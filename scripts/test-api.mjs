// End-to-end API test against memory or a local SQLite-backed D1 binding.
// Run: node scripts/test-api.mjs [--d1]
import crypto from "node:crypto";

const testD1 = process.argv.includes("--d1");
process.env.USE_MEMORY_STORE = testD1 ? "0" : "1";
process.env.ADMIN_PASSWORD = "test-admin-pass";
process.env.ADMIN_SECRET = "test-admin-secret-with-at-least-32-bytes";

const { default: api } = await import("../api/handler.mjs");
const { handleRegister } = await import("../api/lib/api-public.mjs");
const { getDb, putJson, getJson, listKeys, __resetMemoryStore } = await import("../api/lib/db.mjs");
const { rateLimit, hashPassword, checkPassword, hashPin, checkPin } = await import("../api/lib/auth.mjs");
const { emailConfigured, sendEmail } = await import("../api/lib/email.mjs");
const { seedLegacyQuestions } = await import("../api/lib/seed.mjs");
let apiEnv;
let sqlite;

if (testD1) {
  const { DatabaseSync } = await import("node:sqlite");
  const { readFile } = await import("node:fs/promises");
  const migration = await readFile(
    new URL("../cloudflare/migrations/0001_create_app_kv.sql", import.meta.url),
    "utf8"
  );
  sqlite = new DatabaseSync(":memory:");
  sqlite.exec(migration);
  const d1Binding = {
    prepare(query) {
      return {
        bind(...values) {
          return {
            async first() {
              return sqlite.prepare(query).get(...values) || null;
            },
            async all() {
              return { results: sqlite.prepare(query).all(...values) };
            },
            async run() {
              return sqlite.prepare(query).run(...values);
            },
          };
        },
      };
    },
  };
  apiEnv = {
    DB: d1Binding,
    LEGACY_DB: d1Binding,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SECRET: process.env.ADMIN_SECRET,
  };
}

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, extra = "") {
  if (condition) {
    passed += 1;
    console.log(`  ok   ${name}`);
  } else {
    failed += 1;
    failures.push(name);
    console.log(`  FAIL ${name}${extra ? ` — ${extra}` : ""}`);
  }
}

console.log("\n0b. Web Crypto password hashing compatibility");
{
  const passwordHash = await hashPassword("test-password-for-web-crypto");
  check(
    "password hash uses the existing versioned PBKDF2 format",
    passwordHash.startsWith("pbkdf2v3$")
  );
  check(
    "Web Crypto verifies a newly hashed password",
    await checkPassword("test-password-for-web-crypto", passwordHash)
  );
  const legacySalt = crypto.randomBytes(16);
  const legacyHash = crypto.pbkdf2Sync("legacy-password", legacySalt, 60000, 32, "sha256");
  check(
    "Web Crypto still verifies legacy PBKDF2 password hashes",
    await checkPassword(
      "legacy-password",
      `pbkdf2$${legacySalt.toString("base64url")}$${legacyHash.toString("base64url")}`
    )
  );
  const pinHash = await hashPin("4826");
  check("Web Crypto PIN hashing remains compatible", await checkPin("4826", pinHash));
}

async function call(action, payload = {}, token = "", ip = "10.0.0.1") {
  const setupRegistration = action === "register" && payload.skipSetup !== true;
  const requestPayload = { ...payload };
  delete requestPayload.skipSetup;
  if (action === "register" && requestPayload.dateOfBirth === undefined) {
    requestPayload.dateOfBirth = "2000-01-01";
  }
  const headers = { "content-type": "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;
  const req = new Request("http://localhost/api", {
    method: "POST",
    headers,
    body: JSON.stringify({ action, ...requestPayload }),
  });
  const res = await api(req, { ip, env: apiEnv });
  const type = res.headers.get("content-type") || "";
  const data = type.includes("json") ? await res.json() : await res.text();
  if (setupRegistration && res.status === 200) {
    const login = await call(
      "student_login",
      { identifier: data.loginId, password: "01012000" },
      "",
      ip
    );
    if (login.status === 200 && login.data.requiresPasswordChange) {
      const changed = await call(
        "student_password_change",
        { currentPassword: "01012000", newPassword: "student-strong-password" },
        login.data.token,
        ip
      );
      if (changed.status === 200) {
        data.token = login.data.token;
        data.student = changed.data.student;
      }
    }
  }
  return { status: res.status, data, headers: res.headers };
}

const store = await getDb(apiEnv);
await seedLegacyQuestions(store);

console.log("\n0. Concurrent storage guarantees");
{
  const attempts = await Promise.allSettled(
    Array.from({ length: 10 }, () =>
      rateLimit(store, "concurrent-test", "same-client", 3, 60 * 1000)
    )
  );
  const allowed = attempts.filter((attempt) => attempt.status === "fulfilled");
  const limited = attempts.filter((attempt) => attempt.status === "rejected");
  check("concurrent limiter allows exactly the configured maximum", allowed.length === 3);
  check(
    "concurrent limiter returns 429 with retry metadata",
    limited.length === 7 &&
      limited.every(
        (attempt) =>
          attempt.reason.status === 429 &&
          Number(attempt.reason.details?.retryAfter) > 0
      )
  );
}

console.log("\n1. Public bootstrap + admin auth");
{
  const boot = await call("bootstrap");
  check("bootstrap 200", boot.status === 200, boot.status);
  check("3 default subjects", boot.data.subjects?.length === 3, boot.data.subjects?.length);
  check(
    "only CHNM trade is offered",
    boot.data.trades?.length === 1 && boot.data.trades[0].id === "chnm",
    JSON.stringify(boot.data.trades)
  );
  check("settings exposed", Boolean(boot.data.settings?.siteName));

  const savedPassword = process.env.ADMIN_PASSWORD;
  const savedBoundPassword = apiEnv?.ADMIN_PASSWORD;
  delete process.env.ADMIN_PASSWORD;
  if (apiEnv) apiEnv.ADMIN_PASSWORD = "";
  const fallbackLogin = await call("admin_login", { password: "admin12345" }, "", "10.0.0.2");
  process.env.ADMIN_PASSWORD = savedPassword;
  if (apiEnv) apiEnv.ADMIN_PASSWORD = savedBoundPassword;
  check("admin login requires configured password", fallbackLogin.status === 500);

  const savedSecret = process.env.ADMIN_SECRET;
  const savedBoundSecret = apiEnv?.ADMIN_SECRET;
  delete process.env.ADMIN_SECRET;
  if (apiEnv) apiEnv.ADMIN_SECRET = "";
  const missingSecretLogin = await call(
    "admin_login",
    { password: "test-admin-pass" },
    "",
    "10.0.0.3"
  );
  process.env.ADMIN_SECRET = savedSecret;
  if (apiEnv) apiEnv.ADMIN_SECRET = savedBoundSecret;
  check("token signing requires configured ADMIN_SECRET", missingSecretLogin.status === 500);

  process.env.ADMIN_SECRET = "too-short";
  if (apiEnv) apiEnv.ADMIN_SECRET = "";
  const shortSecretLogin = await call(
    "admin_login",
    { password: "test-admin-pass" },
    "",
    "10.0.0.4"
  );
  process.env.ADMIN_SECRET = savedSecret;
  if (apiEnv) apiEnv.ADMIN_SECRET = savedBoundSecret;
  check("token signing rejects short ADMIN_SECRET values", shortSecretLogin.status === 500);

  const bad = await call("admin_login", { password: "wrong" });
  check("wrong admin password rejected", bad.status === 401, bad.status);
  const login = await call("admin_login", { password: "test-admin-pass" });
  check("admin login ok", login.status === 200 && login.data.token, login.status);
  globalThis.adminToken = login.data.token;

  const unauthorized = await call("admin_overview", {}, "");
  check("admin API blocked without token", unauthorized.status === 401, unauthorized.status);
}

console.log("\n2. Create questions + exam");
const examPayload = {
  title: "Trade Theory Final Test",
  code: "TT-FINAL-1",
  subjectId: "trade-theory",
  tradeId: "chnm",
  durationMin: 30,
  passPct: 40,
  marksPerQuestion: 1,
  negativeMarks: 0.25,
  instructions: "सभी प्रश्न अनिवार्य हैं।",
  type: "final",
  attemptsAllowed: 1,
  releaseResults: false,
  showAnswers: false,
  active: true,
};
let examId;
let questionIds = [];
let studentId;
{
  const imported = await call(
    "admin_questions_import",
    {
      subjectId: "trade-theory",
      setName: "CHNM Set-A · test",
      questions: [
        {
          subject: "Trade Theory",
          question: "HTTP प्रोटोकॉल का मानक पोर्ट कौन-सा है?",
          optionA: "21",
          optionB: "80",
          optionC: "443",
          optionD: "25",
          correctAnswer: "B",
          explanation: "HTTP = 80",
        },
        {
          subject: "Trade Theory",
          question: "RAM किस प्रकार की मेमोरी है?",
          optionA: "Volatile",
          optionB: "Non-volatile",
          optionC: "Read-only",
          optionD: "Optical",
          correctAnswer: "A",
          explanation: "बिजली जाने पर डेटा मिट जाता है।",
        },
        {
          subject: "Trade Theory",
          question: "DNS का पोर्ट कौन-सा है?",
          options: ["53", "67", "80", "110"],
          correctIndex: 0,
          marks: 2,
          negativeMarks: 0.5,
        },
      ],
    },
    globalThis.adminToken
  );
  check("question import ok", imported.status === 200, JSON.stringify(imported.data));
  check("3 questions added", imported.data.added === 3, imported.data.added);
  check(
    "import creates named folder",
    imported.data.set?.setName === "CHNM Set-A · test" && Boolean(imported.data.set?.setId),
    JSON.stringify(imported.data.set)
  );
  questionIds = imported.data.addedQids;

  const setBank = await call(
    "admin_questions",
    { subjectId: "trade-theory", setId: imported.data.set.setId, pageSize: 100 },
    globalThis.adminToken
  );
  check(
    "folder filter returns only that set",
    setBank.status === 200 &&
      setBank.data.total === 3 &&
      setBank.data.items.every((question) => question.setId === imported.data.set.setId),
    JSON.stringify({ total: setBank.data.total })
  );
  check(
    "sets summary contains folder with count",
    Boolean(
      setBank.data.sets?.some(
        (set) => set.setId === imported.data.set.setId && set.count === 3
      )
    ),
    JSON.stringify(setBank.data.sets)
  );

  const secondSet = await call(
    "admin_questions_import",
    {
      subjectId: "trade-theory",
      setName: "CHNM Set-B · test",
      questions: [
        {
          question: "दूसरे सेट का परीक्षण प्रश्न कौन-सा है?",
          options: ["सेट B", "सेट A", "सेट C", "सेट D"],
          correctIndex: 0,
        },
      ],
    },
    globalThis.adminToken
  );
  check(
    "second import gets a different folder",
    secondSet.status === 200 &&
      secondSet.data.added === 1 &&
      secondSet.data.set.setId !== imported.data.set.setId,
    JSON.stringify(secondSet.data.set)
  );
  const manual = await call(
    "admin_question_save",
    {
      subjectId: "trade-theory",
      question: {
        text: "मैनुअल प्रश्न का फ़ोल्डर कौन-सा है?",
        options: ["मैनुअल", "आयात", "सेट", "कोई नहीं"],
        correctIndex: 0,
      },
    },
    globalThis.adminToken
  );
  check(
    "manually created question lands in manual folder",
    manual.status === 200 && manual.data.question.setId === "manual",
    JSON.stringify(manual.data.question?.setId)
  );

  const dup = await call(
    "admin_questions_import",
    {
      subjectId: "trade-theory",
      questions: [
        {
          question: "HTTP प्रोटोकॉल का मानक पोर्ट कौन-सा है?",
          options: ["21", "80", "443", "25"],
          correctAnswer: "B",
        },
      ],
    },
    globalThis.adminToken
  );
  check("duplicate import detected", dup.status === 200 && dup.data.duplicates.length === 1);

  const save = await call(
    "admin_exam_save",
    { exam: examPayload, questionIds },
    globalThis.adminToken
  );
  check("exam created", save.status === 200, JSON.stringify(save.data));
  examId = save.data.exam.id;

  const duplicateCode = await call(
    "admin_exam_save",
    { exam: { ...examPayload, title: "Another" }, questionIds },
    globalThis.adminToken
  );
  check("duplicate exam code blocked", duplicateCode.status === 409, duplicateCode.status);

  const preview = await call("admin_exam_preview", { examId }, globalThis.adminToken);
  check("admin preview has answers", preview.status === 200 && preview.data.questions[0].correctIndex !== undefined);
  check("preview total marks = 4", preview.data.totalMarks === 4, preview.data.totalMarks);

  const lock = await call("admin_exam_lock", { examId }, globalThis.adminToken);
  check("exam locked", lock.status === 200 && lock.data.exam.status === "locked", JSON.stringify(lock.data));
  const publish = await call("admin_exam_publish", { examId }, globalThis.adminToken);
  check("exam published", publish.status === 200 && publish.data.exam.status === "published");

  const structural = await call(
    "admin_exam_save",
    { exam: { ...examPayload, marksPerQuestion: 2 }, questionIds },
    globalThis.adminToken
  );
  check("published paper structural edit blocked", structural.status === 409, structural.status);
}

console.log("\n3. Student registration, login, exam attempt");
let studentToken;
let resultId;
{
  const missingDob = await call(
    "register",
    { name: "Missing DOB", mobile: "9876500098", consent: true, dateOfBirth: "", skipSetup: true }
  );
  check("registration requires a date of birth", missingDob.status === 400);
  const missingLoginId = await call(
    "register",
    { name: "Missing login ID", mobile: "", citsNumber: "", dateOfBirth: "2000-01-01", consent: true, skipSetup: true }
  );
  check("registration requires either CITS or mobile", missingLoginId.status === 400);
  const citsOnly = await call(
    "register",
    { name: "CITS Only Student", mobile: "", citsNumber: "CITS-NOMOBILE", dateOfBirth: "2000-01-01", consent: true },
    "",
    "10.0.1.30"
  );
  check("CITS-only registration is supported", citsOnly.status === 200 && citsOnly.data.loginId === "CITS-NOMOBILE");

  const concurrentRegistrations = await Promise.all(
    Array.from({ length: 8 }, (_, index) =>
      call(
        "register",
        {
          name: `Concurrent Student ${index}`,
          fatherName: "Test Father",
          mobile: "9876500099",
          consent: true,
        },
        "",
        `10.0.1.${index + 1}`
      )
    )
  );
  const successfulRegistrations = concurrentRegistrations.filter(
    (registration) => registration.status === 200
  );
  const conflictingRegistrations = concurrentRegistrations.filter(
    (registration) => registration.status === 409
  );
  check("concurrent duplicate mobile registrations allow exactly one", successfulRegistrations.length === 1);
  check("concurrent duplicate mobile registrations return 409", conflictingRegistrations.length === 7);
  const alreadyRegistered = await call(
    "register",
    {
      name: "Duplicate Student",
      fatherName: "Test Father",
      mobile: "9876500099",
      consent: true,
    },
    "",
    "10.0.2.1"
  );
  check("existing mobile index still returns 409", alreadyRegistered.status === 409);

  const registration = await call("register", {
    name: "Test Student",
    fatherName: "Test Father",
    citsNumber: "CITS-TEST-1",
    mobile: "9876500001",
    email: "student@example.com",
    dateOfBirth: "2000-01-01",
    tradeId: "chnm",
    batch: "2026",
    photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    consent: true,
    skipSetup: true,
  });
  check("self registration ok", registration.status === 200, JSON.stringify(registration.data));
  check("unconfigured registration email is explicitly reported", registration.data.notification?.reason === "not_configured");
  studentId = registration.data.student?.id;
  check("registration id starts with CHNM", /^CHNM\d+$/.test(studentId || ""), studentId);
  check("CITS number becomes the login ID", registration.data.loginId === "CITS-TEST-1");
  check("registration does not expose a session token", !registration.data.token);
  const savedStudent = await getJson(store, `students/${studentId}`);
  check("date of birth is not retained in the student record", !Object.hasOwn(savedStudent, "dateOfBirth"));
  check("temporary password is stored only as a salted hash", Boolean(savedStudent.passwordHash) && !savedStudent.passwordHash.includes("01012000"));
  const duplicateCits = await call(
    "register",
    {
      name: "Duplicate CITS",
      citsNumber: "CITS-TEST-1",
      mobile: "9876500087",
      dateOfBirth: "2001-02-03",
      consent: true,
      skipSetup: true,
    }
  );
  check("duplicate CITS login IDs are rejected", duplicateCits.status === 409);

  const wrongDob = await call("student_login", { identifier: "CITS-TEST-1", password: "02012000" });
  check("incorrect temporary DOB is rejected", wrongDob.status === 401);
  const login = await call("student_login", { identifier: "CITS-TEST-1", password: "01012000" });
  check("CITS login succeeds with DOB and requires password change", login.status === 200 && login.data.token && login.data.requiresPasswordChange);
  studentToken = login.data.token;
  check("dashboard is blocked until password change", (await call("student_dashboard", {}, studentToken)).status === 428);
  const wrongCurrent = await call(
    "student_password_change",
    { currentPassword: "wrong", newPassword: "student-strong-password" },
    studentToken
  );
  check("password change verifies the temporary password", wrongCurrent.status === 401);
  const changedPassword = await call(
    "student_password_change",
    { currentPassword: "01012000", newPassword: "student-strong-password" },
    studentToken
  );
  check("first-login password change succeeds", changedPassword.status === 200 && !changedPassword.data.student.passwordChangeRequired);
  const mobileLogin = await call(
    "student_login",
    { identifier: "9876500001", password: "student-strong-password" }
  );
  check("mobile number is also accepted as a login alias", mobileLogin.status === 200 && mobileLogin.data.token);

  const dash = await call("student_dashboard", {}, studentToken);
  check("dashboard 200", dash.status === 200, JSON.stringify(dash.data).slice(0, 200));
  check("published exam visible", dash.data.exams?.some((exam) => exam.id === examId));
  const studentAdminView = await call("admin_student_get", { studentId }, globalThis.adminToken);
  check(
    "admin student detail never returns a credential hash",
    !JSON.stringify(studentAdminView.data).includes("passwordHash") &&
      !JSON.stringify(studentAdminView.data).includes("pinHash")
  );
  check("student cannot call admin API", (await call("admin_overview", {}, studentToken)).status === 401);

  const draft = await call(
    "admin_exam_save",
    {
      exam: { ...examPayload, title: "Draft Paper Visible Test", code: "TT-DRAFT-VISIBLE" },
      questionIds: [],
    },
    globalThis.adminToken
  );
  const draftId = draft.data.exam?.id;
  const dashDraft = await call("student_dashboard", {}, studentToken);
  const preparing = (dashDraft.data.preparing || []).find((exam) => exam.id === draftId);
  check("draft paper visible as preparing", Boolean(preparing), JSON.stringify(dashDraft.data.preparing));
  check(
    "preparing entry never exposes questions",
    Boolean(preparing) &&
      !("questionIds" in preparing) &&
      !("questions" in preparing) &&
      preparing.status === "draft",
    JSON.stringify(preparing)
  );

  const started = await call("student_start", { examId }, studentToken);
  check("exam started", started.status === 200, JSON.stringify(started.data));
  const attemptId = started.data.attempt.attemptId;
  check("paper has no correct answers", started.data.paper.questions.every((q) => q.correctIndex === undefined));

  const saved = await call(
    "student_autosave",
    {
      examId,
      attemptId,
      seq: 2,
      responses: { [questionIds[0]]: 1, [questionIds[1]]: 0 },
      marked: [questionIds[2]],
      visited: [questionIds[0], questionIds[1], questionIds[2]],
      current: 2,
    },
    studentToken
  );
  check("autosave ok", saved.status === 200 && saved.data.savedSeq === 2, JSON.stringify(saved.data));

  const stale = await call(
    "student_autosave",
    { examId, attemptId, seq: 1, responses: {} },
    studentToken
  );
  check("stale autosave ignored", stale.status === 200 && stale.data.ignored === true);

  const live = await call("admin_live", {}, globalThis.adminToken);
  const liveRow = live.data.items?.find((item) => item.attemptId === attemptId);
  check("admin live lists active attempt", live.status === 200 && Boolean(liveRow), JSON.stringify(live.data).slice(0, 200));
  check("live progress counts answers", liveRow?.answered === 2, liveRow?.answered);
  check("live progress total matches paper", liveRow?.totalQuestions === 3, liveRow?.totalQuestions);
  check("student cannot read live monitor", (await call("admin_live", {}, studentToken)).status === 401);

  const resumed = await call("student_start", { examId }, studentToken);
  check("start resumes same attempt", resumed.status === 200 && resumed.data.resumed === true);
  check("resumed attempt keeps answers", resumed.data.attempt.responses[questionIds[0]] === 1);

  const submit = await call(
    "student_submit",
    {
      examId,
      attemptId,
      confirm: true,
      seq: 3,
      responses: { [questionIds[0]]: 1, [questionIds[1]]: 0, [questionIds[2]]: 2 },
      marked: [],
      visited: questionIds,
      current: 0,
    },
    studentToken
  );
  check("submit ok", submit.status === 200, JSON.stringify(submit.data));
  resultId = submit.data.resultId;
  check("unreleased result hidden", submit.data.result.percentage === null, submit.data.result);

  const again = await call("student_submit", { examId, attemptId, confirm: true }, studentToken);
  check("duplicate submit idempotent", again.status === 200 && again.data.duplicate === true);

  const pending = await call("student_result_get", { resultId }, studentToken);
  check("student result pending", pending.status === 200 && pending.data.pending === true);

  const noAnswers = await call("student_exam_get", { examId }, studentToken);
  check("completed exam shows no answers", noAnswers.data.paper === null);
}

console.log("\n4. Result release + isolation");
{
  const release = await call(
    "admin_exam_release",
    { examId, releaseResults: true },
    globalThis.adminToken
  );
  check("result released", release.status === 200 && release.data.exam.releaseResults === true);

  const detail = await call("student_result_get", { resultId }, studentToken);
  check("released result visible", detail.status === 200 && detail.data.result.percentage !== null);
  check("answer key visible after release", Array.isArray(detail.data.result.answers) && detail.data.result.answers.length === 3);
  check(
    "answer carries subject id",
    detail.data.result.answers.every((answer) => answer.subjectId === "trade-theory"),
    JSON.stringify(detail.data.result.answers.map((answer) => answer.subjectId))
  );
  check(
    "study plan computed after release",
    Array.isArray(detail.data.result.studyPlan) &&
      detail.data.result.studyPlan.length === 1 &&
      detail.data.result.studyPlan[0].subjectId === "trade-theory" &&
      detail.data.result.studyPlan[0].total === 3 &&
      detail.data.result.studyPlan[0].weak === true &&
      detail.data.result.studyPlan[0].studyHref === "../study/index.html",
    JSON.stringify(detail.data.result.studyPlan)
  );
  check("score computed 1.5/4", detail.data.result.obtained === 1.5, detail.data.result.obtained);
  check("negative marking applied", detail.data.result.correct === 2 && detail.data.result.wrong === 1);

  const other = await call("register", {
    name: "Other Student",
    mobile: "9876500002",
    tradeId: "chnm",
    consent: true,
  });
  const otherToken = other.data.token;
  const stolen = await call("student_result_get", { resultId }, otherToken);
  check("other student cannot read result", stolen.status === 404, stolen.status);

  const list = await call("student_results", {}, studentToken);
  check("own result list", list.data.results?.length === 1 && list.data.results[0].resultId === resultId);

  const csv = await call("admin_results_csv", { examId }, globalThis.adminToken);
  check("CSV download", csv.status === 200 && csv.headers.get("content-type")?.includes("text/csv"));
  if (!String(csv.data).includes("9876500001")) console.log("csv sample:", String(csv.data).slice(0, 400));
  check("CSV has header + row", String(csv.data).includes("Registration ID") && String(csv.data).includes("9876500001"));

  const results = await call("admin_results", {}, globalThis.adminToken);
  check("results include merit list", results.status === 200 && Array.isArray(results.data.merit) && results.data.merit.length >= 1);
  check("merit rank 1 is top scorer", results.data.merit?.[0]?.percentage === 37.5, results.data.merit?.[0]);
  check("live list clears after submit", (await call("admin_live", {}, globalThis.adminToken)).data.items?.some((item) => item.attemptId === attemptId) === false);
}

console.log("\n4b. Five simultaneous demo learners");
{
  const learners = await Promise.all(
    Array.from({ length: 5 }, (_, index) =>
      call(
        "register",
        {
          name: `Demo Learner ${index + 1}`,
          mobile: `98765100${String(index + 1).padStart(2, "0")}`,
          tradeId: "chnm",
          consent: true,
        },
        "",
        `10.5.0.${index + 1}`
      )
    )
  );
  const registered = learners.every((learner) => learner.status === 200 && learner.data.token);
  check("all 5 synthetic learners register", registered, learners.map((learner) => learner.status).join(", "));
  const registrationIds = learners.map((learner) => learner.data.student?.id);
  check(
    "all 5 registrations receive distinct IDs",
    registrationIds.every(Boolean) && new Set(registrationIds).size === 5,
    registrationIds.join(", ")
  );

  if (registered) {
    const starts = await Promise.all(
      learners.map((learner) => call("student_start", { examId }, learner.data.token))
    );
    const started = starts.every((result) => result.status === 200 && result.data.attempt?.attemptId);
    check("all 5 learners start the published exam concurrently", started, starts.map((result) => result.status).join(", "));
    const attemptIds = starts.map((result) => result.data.attempt?.attemptId);
    check(
      "all 5 learners receive independent attempts",
      attemptIds.every(Boolean) && new Set(attemptIds).size === 5,
      attemptIds.join(", ")
    );

    if (started) {
      const saves = await Promise.all(
        starts.map((result, index) =>
          call(
            "student_autosave",
            {
              examId,
              attemptId: result.data.attempt.attemptId,
              seq: 2,
              responses: { [questionIds[0]]: index % 4 },
              visited: [questionIds[0]],
              current: 0,
            },
            learners[index].data.token
          )
        )
      );
      check("all 5 learners autosave independently", saves.every((save) => save.status === 200), saves.map((save) => save.status).join(", "));

      const submissions = await Promise.all(
        starts.map((result, index) =>
          call(
            "student_submit",
            {
              examId,
              attemptId: result.data.attempt.attemptId,
              confirm: true,
              seq: 3,
              responses: { [questionIds[0]]: index % 4 },
              visited: [questionIds[0]],
            },
            learners[index].data.token
          )
        )
      );
      check(
        "all 5 learners submit and receive separate results",
        submissions.every((submission) => submission.status === 200 && submission.data.resultId),
        submissions.map((submission) => submission.status).join(", ")
      );
      const resultIds = submissions.map((submission) => submission.data.resultId);
      check(
        "all 5 learners receive distinct results",
        resultIds.every(Boolean) && new Set(resultIds).size === 5,
        resultIds.join(", ")
      );
    }
  }
}

console.log("\n5. Server-side timer expiry");
{
  const save = await call(
    "admin_exam_save",
    {
      exam: {
        ...examPayload,
        title: "Expiry Test",
        code: "TT-EXPIRY-1",
        durationMin: 1,
      },
      questionIds: [questionIds[0]],
    },
    globalThis.adminToken
  );
  const expiryExam = save.data.exam.id;
  await call("admin_exam_lock", { examId: expiryExam }, globalThis.adminToken);
  await call("admin_exam_publish", { examId: expiryExam }, globalThis.adminToken);

  const reg = await call("register", { name: "Timer Student", mobile: "9876500003", tradeId: "chnm", consent: true });
  const timerToken = reg.data.token;
  const start = await call("student_start", { examId: expiryExam }, timerToken);
  check("timer exam started", start.status === 200);
  const attempt = await getJson(store, `attempts/${expiryExam}/${reg.data.student.id}`);
  attempt.endAt = Date.now() - 60000;
  await putJson(store, `attempts/${expiryExam}/${reg.data.student.id}`, attempt);
  const expired = await call(
    "student_autosave",
    { examId: expiryExam, attemptId: start.data.attempt.attemptId, seq: 2, responses: { [questionIds[0]]: 1 } },
    timerToken
  );
  check("expired autosave auto-submits", expired.status === 200 && expired.data.expired === true, JSON.stringify(expired.data));
  const autoResult = await getJson(store, `results/${expired.data.resultId}`);
  check("auto result stored", Boolean(autoResult) && autoResult.autoSubmitted === true);
}

console.log("\n6. Practice exam reveals answers immediately");
{
  const save = await call(
    "admin_exam_save",
    {
      exam: {
        ...examPayload,
        title: "Practice Test",
        code: "TT-PRACTICE-1",
        type: "practice",
        releaseResults: false,
        showAnswers: false,
        attemptsAllowed: 3,
        durationMin: 10,
      },
      questionIds: [questionIds[0], questionIds[1]],
    },
    globalThis.adminToken
  );
  const practiceId = save.data.exam.id;
  await call("admin_exam_lock", { examId: practiceId }, globalThis.adminToken);
  await call("admin_exam_publish", { examId: practiceId }, globalThis.adminToken);

  const start = await call("student_start", { examId: practiceId }, studentToken);
  check("practice exam start", start.status === 200);
  const submit = await call(
    "student_submit",
    {
      examId: practiceId,
      attemptId: start.data.attempt.attemptId,
      confirm: true,
      seq: 2,
      responses: { [questionIds[0]]: 1 },
    },
    studentToken
  );
  check("practice result visible immediately", submit.data.result.percentage !== null, submit.data.result.percentage);
  const result = await call("student_result_get", { resultId: submit.data.resultId }, studentToken);
  check("practice answers visible", Array.isArray(result.data.result.answers) && result.data.result.answers.length === 2);
  check("practice excluded from exam list", (await call("student_dashboard", {}, studentToken)).data.practice?.some((exam) => exam.id === practiceId) === false);
}

console.log("\n7. Legacy data import");
{
  await putJson(store, "config", { active: true, published: true, subject: "TM", count: 10, duration: 60, passPct: 40, college: "Old College", showAnswers: true });
  await putJson(store, "s/FIG-99999", {
    id: "FIG-99999",
    name: "Legacy Student",
    mobile: "9876599999",
    trade: "CHNM / CITS",
    email: "legacy@example.com",
    photo: "",
    college: "Old College",
    at: "2025-01-01T00:00:00.000Z",
  });
  await putJson(store, "r/FIG-99999", {
    id: "FIG-99999",
    name: "Legacy Student",
    mobile: "9876599999",
    college: "Old College",
    subject: "TM",
    n: 10,
    correct: 7,
    attempted: 8,
    score: 70,
    total: 100,
    pass: true,
    at: "2025-01-10T00:00:00.000Z",
    q: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    ans: [1, 2, 2, 1, 0, 3, 1, 1, 0, 0],
  });
  const preview = await call("admin_legacy_preview", {}, globalThis.adminToken);
  check("legacy preview finds records", preview.data.legacy?.students === 1 && preview.data.legacy?.results === 1, JSON.stringify(preview.data.legacy));
  const imported = await call("admin_legacy_import", {}, globalThis.adminToken);
  check("legacy import ok", imported.status === 200 && imported.data.report.results.imported === 1, JSON.stringify(imported.data.report));
  const again = await call("admin_legacy_import", {}, globalThis.adminToken);
  check("legacy import idempotent", again.data.report.results.existing === 1, JSON.stringify(again.data.report));
  const legacyStudent = await getJson(store, "students/FIG-99999");
  check("legacy student email is preserved for result notifications", legacyStudent?.email === "legacy@example.com");
  await putJson(store, "students/FIG-99999", { ...legacyStudent, email: "" });
  await call("admin_legacy_import", {}, globalThis.adminToken);
  check(
    "legacy import restores a missing email without overwriting existing profile fields",
    (await getJson(store, "students/FIG-99999"))?.email === "legacy@example.com"
  );

  await store.delete("idx/mobile/9876599999");
  const duplicateLegacyMobile = await call(
    "register",
    {
      name: "Duplicate Legacy Mobile",
      mobile: "9876599999",
      dateOfBirth: "2000-01-01",
      consent: true,
      skipSetup: true,
    },
    "",
    "10.0.7.2"
  );
  check(
    "legacy mobile without an index cannot register a second account",
    duplicateLegacyMobile.status === 409
  );

  const login = await call("student_login", { id: "FIG-99999", mobile: "9876599999" });
  check("legacy student login requires password setup", login.status === 200 && login.data.requiresPasswordChange);
  const legacyPassword = await call(
    "student_password_change",
    { currentPassword: "", newPassword: "legacy-strong-password" },
    login.data.token
  );
  check("legacy account can set its first password", legacyPassword.status === 200);
  const dash = await call("student_dashboard", {}, login.data.token);
  const legacyResult = dash.data.results?.find((result) => result.resultId === "RES-LEGACY-FIG-99999");
  check("legacy result visible", Boolean(legacyResult), JSON.stringify(dash.data.results));
  check("legacy score preserved", legacyResult?.percentage === 70, legacyResult?.percentage);
}

console.log("\n8. Admin stats, export, safety guards");
{
  const stats = await call("admin_stats", {}, globalThis.adminToken);
  check("stats 200", stats.status === 200 && stats.data.overall.count >= 2, JSON.stringify(stats.data.overall));
  const overview = await call("admin_overview", {}, globalThis.adminToken);
  check("overview 200", overview.status === 200 && overview.data.summary.students >= 3);
  if (apiEnv?.DB) {
    const savedEnv = apiEnv;
    apiEnv = { ...apiEnv, LEGACY_DB: undefined };
    const legacyUnavailable = await call("admin_legacy_preview", {}, globalThis.adminToken);
    apiEnv = savedEnv;
    check(
      "Cloudflare legacy preview reports the missing legacy binding explicitly",
      legacyUnavailable.status === 501
    );
  }
  check(
    "admin overview hides credential hashes",
    !JSON.stringify(overview.data).includes("pinHash") &&
      !JSON.stringify(overview.data).includes("passwordHash")
  );

  const exportRes = await call("admin_export", {}, globalThis.adminToken);
  check("data export download", exportRes.status === 200 && exportRes.headers.get("content-disposition")?.includes("chnm-data"));
  check(
    "student credential hashes are excluded from backup export",
    !JSON.stringify(exportRes.data.students).includes("passwordHash") &&
      !JSON.stringify(exportRes.data.students).includes("pinHash")
  );

  const delStudent = await call("admin_student_delete", { studentId: "FIG-99999", confirm: "FIG-99999" }, globalThis.adminToken);
  check("student delete with results blocked", delStudent.status === 409, delStudent.status);

  const delExam = await call("admin_exam_delete", { examId, confirm: true }, globalThis.adminToken);
  check("published exam delete blocked", delExam.status === 409, delExam.status);
}

console.log("\n9. Topic-wise paper, सूचनाएँ और समूह चैट");
{
  const admin = globalThis.adminToken;

  const saved = [];
  for (const row of [
    { topic: "SMPS", text: "नया SMPS प्रश्न क", marks: 2 },
    { topic: "SMPS", text: "नया SMPS प्रश्न ख", marks: 1 },
    { topic: "Networking", text: "नया Networking प्रश्न क", marks: 1 },
  ]) {
    const res = await call(
      "admin_question_save",
      {
        subjectId: "trade-theory",
        question: { text: row.text, options: ["सही विकल्प", "गलत विकल्प"], correctIndex: 0, marks: row.marks, topic: row.topic },
      },
      admin
    );
    if (res.status === 200) saved.push(res.data.question);
  }
  check("topic questions saved", saved.length === 3, JSON.stringify(saved.map((q) => q.qid)));
  check("topic persisted on question", saved.every((q) => q.topic), JSON.stringify(saved.map((q) => q.topic)));

  const topics = await call("admin_topics", { subjectId: "trade-theory" }, admin);
  const smpsRow = topics.data.topics?.find((row) => row.topic === "SMPS");
  check(
    "admin_topics groups by topic",
    topics.status === 200 && smpsRow?.count === 2 && smpsRow?.marks === 3,
    JSON.stringify(topics.data.topics || []).slice(0, 200)
  );
  check("admin_topics needs subject", (await call("admin_topics", {}, admin)).status === 400);
  check(
    "admin_topics blocked for student",
    (await call("admin_topics", { subjectId: "trade-theory" }, studentToken)).status === 401
  );

  const build = await call(
    "admin_paper_build",
    { subjectId: "trade-theory", plan: [{ topic: "SMPS", count: 2 }, { topic: "Networking", count: 1 }], randomize: false },
    admin
  );
  check("paper build picks requested counts", build.status === 200 && build.data.total === 3, JSON.stringify(build.data).slice(0, 200));
  check("paper build sums marks", build.data.marks === 4, build.data.marks);
  check("paper build ids unique", new Set(build.data.questionIds).size === 3);
  check(
    "paper build reports topic split",
    build.data.byTopic?.length === 2 && build.data.byTopic[0].count === 2,
    JSON.stringify(build.data.byTopic)
  );
  const shortBuild = await call("admin_paper_build", { subjectId: "trade-theory", plan: [{ topic: "SMPS", count: 5 }] }, admin);
  check(
    "paper build reports shortage",
    shortBuild.status === 200 && shortBuild.data.total === 2 && shortBuild.data.short[0]?.have === 2,
    JSON.stringify(shortBuild.data.short)
  );
  const emptyBuild = await call("admin_paper_build", { subjectId: "trade-theory", plan: [{ topic: "विषय नहीं मिला", count: 3 }] }, admin);
  check("paper build rejects empty selection", emptyBuild.status === 400, emptyBuild.status);
  check("paper build needs plan", (await call("admin_paper_build", { subjectId: "trade-theory", plan: [] }, admin)).status === 400);

  const builtExam = await call(
    "admin_exam_save",
    { exam: { ...examPayload, id: undefined, title: "CBT1 Topic Wise", code: "CBT1-TOPIC" }, questionIds: build.data.questionIds },
    admin
  );
  check(
    "topic paper becomes a real exam",
    builtExam.status === 200 && builtExam.data.exam.totalQuestions === 3 && builtExam.data.exam.totalMarks === 4,
    JSON.stringify({ s: builtExam.status, q: builtExam.data.exam?.totalQuestions, m: builtExam.data.exam?.totalMarks })
  );

  const notice = await call(
    "admin_notice_save",
    { notice: { title: "CBT1 परीक्षा 10 नवम्बर", body: "समय सुबह 10 बजे।", level: "important", audience: "all" } },
    admin
  );
  check("notice saved", notice.status === 200 && notice.data.notice.id, JSON.stringify(notice.data).slice(0, 160));
  const noticeId = notice.data.notice.id;

  const list = await call("notices_list", {}, studentToken);
  check("student sees admin notice", list.status === 200 && list.data.notices.some((n) => n.id === noticeId));
  check("notice unread counted", list.data.unread >= 1, list.data.unread);
  check("notice level preserved", list.data.notices.find((n) => n.id === noticeId)?.level === "important");
  check("notices need student token", (await call("notices_list")).status === 401);

  await call("notice_read", { noticeId }, studentToken);
  const afterRead = await call("notices_list", {}, studentToken);
  check(
    "notice marked read",
    afterRead.data.notices.find((n) => n.id === noticeId)?.read === true &&
      afterRead.data.unread === list.data.unread - 1,
    JSON.stringify({ read: afterRead.data.notices.find((n) => n.id === noticeId)?.read, unread: afterRead.data.unread })
  );

  const batchNotice = await call(
    "admin_notice_save",
    { notice: { title: "बैच 2027 कक्षा", body: "केवल बैच 2027 के लिए।", audience: "batch:2027" } },
    admin
  );
  const batchNoticeId = batchNotice.data.notice?.id;
  const other = await call("register", { name: "Batch Other", mobile: "9876500019", batch: "2027", consent: true }, "", "10.0.9.19");
  const otherToken = other.data.token;
  const hiddenFor = await call("notices_list", {}, studentToken);
  const shownFor = await call("notices_list", {}, otherToken);
  check("batch notice hidden from other batch", !hiddenFor.data.notices.some((n) => n.id === batchNoticeId));
  check("batch notice reaches its batch", shownFor.data.notices.some((n) => n.id === batchNoticeId));
  check("register defaults trade to CHNM", other.data.student?.tradeName === "CHNM" || other.data.student?.tradeId === "chnm", JSON.stringify(other.data.student || {}).slice(0, 160));

  const adminNotices = await call("admin_notices", {}, admin);
  check("admin notice list", adminNotices.status === 200 && adminNotices.data.notices.length >= 2);
  const removed = await call("admin_notice_delete", { noticeId: batchNoticeId }, admin);
  const afterDelete = await call("admin_notices", {}, admin);
  check(
    "notice deleted",
    removed.status === 200 && !afterDelete.data.notices.some((n) => n.id === batchNoticeId)
  );

  const tradeNotice = await call(
    "admin_notice_save",
    { notice: { title: "ट्रेड CHNM कक्षा", body: "केवल CHNM ट्रेड के लिए।", audience: "trade:chnm" } },
    admin
  );
  const tradeNoticeId = tradeNotice.data.notice?.id;
  const quietNotice = await call(
    "admin_notice_save",
    { notice: { title: "बंद की गई सूचना", body: "यह होम पेज पर नहीं दिखनी चाहिए।", active: false } },
    admin
  );
  const publicRes = await call("site_notices", {});
  check("site notices work without a token", publicRes.status === 200 && Array.isArray(publicRes.data.notices), publicRes.status);
  check("site notices include the all-audience notice", publicRes.data.notices.some((n) => n.id === noticeId));
  check("site notices hide trade-targeted notices", !publicRes.data.notices.some((n) => n.id === tradeNoticeId));
  check("site notices hide inactive notices", !publicRes.data.notices.some((n) => n.id === quietNotice.data.notice?.id));
  check("site notices carry no read state", publicRes.data.notices.every((n) => n.read === false));
  check("site notices need no student identity", (await call("site_notices", {})).data.notices.length === publicRes.data.notices.length);
  for (let round = 0; round < 6; round += 1) {
    await call(
      "admin_notice_save",
      { notice: { title: "होम अपडेट " + round, body: "होम पेज जाँच " + round, audience: "all" } },
      admin
    );
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  const capped = await call("site_notices", {});
  check("site notices capped at five", capped.data.notices.length === 5, capped.data.notices.length);
  check("site notices newest first", capped.data.notices[0]?.title === "होम अपडेट 5", capped.data.notices[0]?.title);
  await call("admin_notice_delete", { noticeId: tradeNoticeId }, admin);

  const emptyChat = await call("chat_send", { text: "   " }, studentToken);
  check("empty chat message rejected", emptyChat.status === 400, emptyChat.status);
  const first = await call("chat_send", { text: "जी सर, कल क्लास में पहुँचूँगा।" }, studentToken);
  check("student chat send ok", first.status === 200 && first.data.message.sid, JSON.stringify(first.data).slice(0, 160));
  const shared = await call("chat_list", {}, otherToken);
  check("every student auto-joins the chat", shared.data.messages.some((m) => m.id === first.data.message.id));
  check("chat reports member count", shared.data.members >= 2, shared.data.members);
  check("chat needs student token", (await call("chat_list")).status === 401);

  // Chat cursors are millisecond stamps; the 5 ms gap guarantees the next send
  // lands in a later millisecond so the incremental poll is deterministic.
  const cursor = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 5));
  const newer = await call("chat_send", { text: "दूसरा छात्र संदेश" }, otherToken);
  const poll = await call("chat_list", { after: cursor }, studentToken);
  check(
    "incremental poll returns only newer messages",
    poll.status === 200 && poll.data.messages.length === 1 && poll.data.messages[0].id === newer.data.message.id,
    JSON.stringify({ newer: newer.data.message?.id, ids: poll.data.messages?.map((m) => m.id) })
  );

  for (let i = 0; i < 310; i += 1) {
    // Same 14-digit zero-padded stamp the API uses, dated in the past, so these
    // synthetic rows are the oldest entries once the 300-message cap applies.
    const id = `${String(1_700_000_000_000 + i).padStart(14, "0")}-fill`;
    await putJson(store, `chat/${id}`, { id, sid: "CHNM9", name: "भराव", text: `भराव ${i}`, createdAt: "2026-01-01T00:00:00.000Z" });
  }
  await call("chat_send", { text: "भराव के बाद संदेश" }, otherToken);
  check("chat trimmed to newest 300", (await listKeys(store, "chat/")).length === 300, (await listKeys(store, "chat/")).length);

  const moderation = await call("admin_chat", {}, admin);
  check("admin sees chat with members", moderation.status === 200 && moderation.data.members.length >= 2);
  const wipe = await call("admin_chat_delete", { messageId: newer.data.message.id }, admin);
  const stillThere = (await call("chat_list", {}, otherToken)).data.messages.some(
    (m) => m.id === newer.data.message.id
  );
  check(
    "admin deletes a chat message",
    wipe.status === 200 && !stillThere,
    JSON.stringify({ status: wipe.status, data: wipe.data, stillThere, id: newer.data.message.id })
  );
  check("admin chat delete rejects unknown id", (await call("admin_chat_delete", { messageId: "9999-nope" }, admin)).status === 404);

  let blocked = 0;
  for (let i = 0; i < 25; i += 1) {
    const flood = await call("chat_send", { text: `फ्लड ${i + 1}` }, studentToken);
    if (flood.status === 429) blocked += 1;
  }
  check("chat flood rate-limited", blocked > 0, blocked);
  check("student blocked from admin chat", (await call("admin_chat", {}, studentToken)).status === 401);

  const adminSent = await call("admin_chat_send", { text: "कल परीक्षा 10 बजे — समय पर आ जाएँ" }, admin);
  check("admin sends chat message", adminSent.status === 200 && adminSent.data.message.sid === "ADMIN", adminSent.status);
  const afterAdminSend = await call("chat_list", { after: cursor }, studentToken);
  check(
    "admin message reaches every student",
    (afterAdminSend.data.messages || []).some((m) => m.sid === "ADMIN" && m.text.startsWith("कल परीक्षा")),
    JSON.stringify(afterAdminSend.data.messages || [])
  );
  check("empty admin chat rejected", (await call("admin_chat_send", { text: "   " }, admin)).status === 400);
  check("student cannot use admin chat send", (await call("admin_chat_send", { text: "छात्र का प्रयास" }, studentToken)).status === 401);

  const backup = await call("admin_export", {}, admin);
  check(
    "JSON backup includes notices and chat",
    Array.isArray(backup.data.notices) &&
      backup.data.notices.some((n) => n.title === "CBT1 परीक्षा 10 नवम्बर") &&
      Array.isArray(backup.data.chat) &&
      backup.data.chat.length > 0,
    JSON.stringify({ notices: backup.data.notices?.length, chat: backup.data.chat?.length })
  );
}

console.log("\n10. परीक्षा के English निर्देश (instructionsEn)");
{
  const admin = globalThis.adminToken;
  const enText = "Read every question carefully. Use the palette to review marked answers.";

  const withEn = await call(
    "admin_exam_save",
    {
      exam: {
        ...examPayload,
        title: "Bilingual Instructions Test",
        code: "TT-BILINGUAL-1",
        instructions: "सभी प्रश्न अनिवार्य हैं।",
        instructionsEn: enText,
      },
      questionIds,
    },
    admin
  );
  check("exam saved with instructionsEn", withEn.status === 200, JSON.stringify(withEn.data));
  check(
    "instructionsEn round-trips through admin save",
    withEn.data.exam?.instructionsEn === enText,
    JSON.stringify(withEn.data.exam?.instructionsEn)
  );
  check(
    "Hindi instructions kept alongside English",
    withEn.data.exam?.instructions === "सभी प्रश्न अनिवार्य हैं।",
    JSON.stringify(withEn.data.exam?.instructions)
  );
  const enExamId = withEn.data.exam.id;

  const reg = await call("register", {
    name: "Instructions Student",
    mobile: "9876500021",
    tradeId: "chnm",
    consent: true,
  }, "", "10.0.9.21");
  const insToken = reg.data.token;

  const opened = await call("student_exam_get", { examId: enExamId }, insToken);
  check("student exam entry has instructionsEn", opened.data.exam?.instructionsEn === enText, JSON.stringify(opened.data.exam?.instructionsEn));
  check(
    "student exam entry hides answers",
    JSON.stringify(opened.data).indexOf("correctIndex") < 0,
    "answers leaked to student payload"
  );

  const withoutEn = await call(
    "admin_exam_save",
    {
      exam: { ...examPayload, title: "Hindi Only Instructions", code: "TT-HINDI-ONLY-1", instructionsEn: undefined },
      questionIds,
    },
    admin
  );
  check(
    "exam without instructionsEn stores empty string",
    withoutEn.status === 200 && withoutEn.data.exam?.instructionsEn === "",
    JSON.stringify(withoutEn.data.exam?.instructionsEn)
  );

  const settings = await call(
    "admin_settings_save",
    { settings: { siteName: "Future Instructor", groupName: "Future Instructor Group · CITS", defaultInstructionsEn: "Global English instructions." } },
    admin
  );
  check(
    "defaultInstructionsEn saved",
    settings.status === 200 && settings.data.settings?.defaultInstructionsEn === "Global English instructions.",
    JSON.stringify(settings.data.settings?.defaultInstructionsEn)
  );
  check(
    "group name saved by admin settings",
    settings.status === 200 && settings.data.settings?.groupName === "Future Instructor Group · CITS",
    JSON.stringify(settings.data.settings?.groupName)
  );
  const boot = await call("bootstrap");
  check(
    "bootstrap exposes defaultInstructionsEn to the exam UI",
    boot.data.settings?.defaultInstructionsEn === "Global English instructions.",
    JSON.stringify(boot.data.settings?.defaultInstructionsEn)
  );
  check(
    "bootstrap exposes the configured group name",
    boot.data.settings?.groupName === "Future Instructor Group · CITS",
    JSON.stringify(boot.data.settings?.groupName)
  );
}

console.log("\n11. Registration email and admin password recovery");
{
  const savedEnv = apiEnv;
  const savedFetch = globalThis.fetch;
  const sentEmails = [];
  apiEnv = {
    ...(apiEnv || {}),
    ADMIN_EMAIL: "admin@example.com",
    RESEND_API_KEY: "test-resend-key",
    EMAIL_FROM: "CHNM Portal <noreply@example.com>",
    PUBLIC_BASE_URL: "https://portal.example",
  };
  globalThis.fetch = async (url, options) => {
    sentEmails.push({
      url,
      body: JSON.parse(options.body),
      idempotencyKey: options.headers["Idempotency-Key"],
    });
    return new Response(JSON.stringify({ id: `test-${sentEmails.length}` }), { status: 200 });
  };
  try {
    const gmailEnv = {
      GMAIL_CLIENT_ID: "test-client-id",
      GMAIL_CLIENT_SECRET: "test-client-secret",
      GMAIL_REFRESH_TOKEN: "test-refresh-token",
    };
    const gmailRequests = [];
    globalThis.fetch = async (url, options) => {
      gmailRequests.push({ url, options });
      if (url === "https://oauth2.googleapis.com/token") {
        return new Response(JSON.stringify({ access_token: "test-access-token" }), { status: 200 });
      }
      return new Response(JSON.stringify({ id: "gmail-message-id" }), { status: 200 });
    };
    const gmailDelivery = await sendEmail(gmailEnv, {
      to: "student@gmail.com",
      subject: "पंजीकरण सफल",
      text: "Gmail API test body",
      html: "<p>Gmail API test body</p>",
    });
    const gmailTokenForm = new URLSearchParams(gmailRequests[0]?.options.body || "");
    const gmailRaw = Buffer.from(
      String(JSON.parse(gmailRequests[1]?.options.body || "{}").raw || "")
        .replace(/-/g, "+")
        .replace(/_/g, "/"),
      "base64"
    ).toString("utf8");
    check(
      "Gmail OAuth refresh-token exchange uses the configured client",
      gmailRequests[0]?.url === "https://oauth2.googleapis.com/token" &&
        gmailTokenForm.get("client_id") === gmailEnv.GMAIL_CLIENT_ID &&
        gmailTokenForm.get("client_secret") === gmailEnv.GMAIL_CLIENT_SECRET &&
        gmailTokenForm.get("refresh_token") === gmailEnv.GMAIL_REFRESH_TOKEN &&
        gmailTokenForm.get("grant_type") === "refresh_token"
    );
    check(
      "Gmail API sends UTF-8 multipart message through authenticated account",
      gmailDelivery.sent &&
        gmailRequests[1]?.url === "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" &&
      gmailRequests[1]?.options.headers.authorization?.startsWith("Bearer ") &&
        gmailRaw.includes("To: student@gmail.com") &&
        gmailRaw.includes("multipart/alternative") &&
      gmailRaw.includes(Buffer.from("Gmail API test body").toString("base64"))
    );
    const gmailRequestCount = gmailRequests.length;
    const incompleteGmail = await sendEmail(
      { ...gmailEnv, GMAIL_CLIENT_ID: "" },
      { to: "student@gmail.com", subject: "test", text: "test" }
    );
    check(
      "incomplete Gmail credentials fail closed without provider requests",
      !emailConfigured({ ...gmailEnv, GMAIL_CLIENT_ID: "" }) &&
        incompleteGmail.reason === "not_configured" &&
        gmailRequests.length === gmailRequestCount
    );

    const fallbackRequests = [];
    globalThis.fetch = async (url, options) => {
      fallbackRequests.push({ url, options });
      if (url === "https://oauth2.googleapis.com/token") {
        return new Response(JSON.stringify({ access_token: "test-access-token" }), { status: 200 });
      }
      if (url === "https://gmail.googleapis.com/gmail/v1/users/me/messages/send") {
        return new Response(JSON.stringify({ error: "insufficient scope" }), { status: 403 });
      }
      return new Response(JSON.stringify({ id: "resend-fallback-id" }), { status: 200 });
    };
    const fallbackDelivery = await sendEmail(
      {
        ...gmailEnv,
        RESEND_API_KEY: "test-resend-key",
        EMAIL_FROM: "CHNM Portal <noreply@example.com>",
      },
      {
        to: "student@gmail.com",
        subject: "पंजीकरण सफल",
        text: "Fallback email body",
        idempotencyKey: "registration/test-student",
      }
    );
    check(
      "Gmail rejection falls back to configured Resend sender",
      fallbackDelivery.sent &&
        fallbackRequests.length === 3 &&
        fallbackRequests[1]?.url === "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" &&
        fallbackRequests[2]?.url === "https://api.resend.com/emails" &&
        JSON.parse(fallbackRequests[2]?.options.body || "{}").to?.[0] === "student@gmail.com" &&
        fallbackRequests[2]?.options.headers["Idempotency-Key"] === "registration/test-student"
    );

    let ambiguousGmailRequests = 0;
    globalThis.fetch = async (url) => {
      ambiguousGmailRequests += 1;
      if (url === "https://oauth2.googleapis.com/token") {
        return new Response(JSON.stringify({ access_token: "test-access-token" }), { status: 200 });
      }
      throw new Error("connection lost after Gmail send request");
    };
    const ambiguousDelivery = await sendEmail(
      {
        ...gmailEnv,
        RESEND_API_KEY: "test-resend-key",
        EMAIL_FROM: "CHNM Portal <noreply@example.com>",
      },
      { to: "student@gmail.com", subject: "test", text: "test" }
    );
    check(
      "ambiguous Gmail transport failure avoids duplicate Resend fallback",
      !ambiguousDelivery.sent &&
        ambiguousDelivery.reason === "provider_error" &&
        ambiguousGmailRequests === 2
    );

    globalThis.fetch = async (url, options) => {
      sentEmails.push({
        url,
        body: JSON.parse(options.body),
        idempotencyKey: options.headers["Idempotency-Key"],
      });
      return new Response(JSON.stringify({ id: `test-${sentEmails.length}` }), { status: 200 });
    };
    const registration = await call(
      "register",
      {
        name: "Email Student",
        mobile: "9876500088",
        email: "student@example.com",
        dateOfBirth: "1999-05-04",
        consent: true,
        skipSetup: true,
      },
      "",
      "10.0.10.1"
    );
    check("registration confirmation email uses Resend", registration.status === 200 && registration.data.notification?.sent);
    check("student email contains configured group name", sentEmails[0]?.body.text.includes("Future Instructor Group · CITS"));
    check(
      "registration email uses the branded responsive HTML template",
      sentEmails[0]?.body.html.includes("width:100%;background:#ffffff") &&
        sentEmails[0]?.body.html.includes("आपका प्यार ही हमारी प्रगति है") &&
        sentEmails[0]?.body.html.includes("पोर्टल में लॉगिन करें")
    );
    check(
      "registration email includes the configured portal login URL",
      sentEmails[0]?.body.html.includes('href="https://portal.example/exam/index.html"') &&
        sentEmails[0]?.body.text.includes("https://portal.example/exam/index.html")
    );
    check("student confirmation does not disclose DOB", !sentEmails[0]?.body.text.includes("04051999"));
    check("registration API explicitly reports email availability", registration.data.notification?.message.includes("ईमेल भेज"));

    globalThis.fetch = async () => new Response(JSON.stringify({ message: "provider rejected sender" }), { status: 422 });
    const rejectedEmailRegistration = await call(
      "register",
      {
        name: "Email Provider Reject",
        mobile: "9876500089",
        email: "student@example.com",
        dateOfBirth: "1999-05-04",
        consent: true,
        skipSetup: true,
      },
      "",
      "10.0.10.9"
    );
    check(
      "provider rejection does not fail registration",
      rejectedEmailRegistration.status === 200 &&
        rejectedEmailRegistration.data.notification?.reason === "provider_error"
    );
    check(
      "provider rejection keeps the student account",
      Boolean(await getJson(store, `students/${rejectedEmailRegistration.data.student?.id}`))
    );

    globalThis.fetch = async () => {
      throw new Error("provider transport unavailable");
    };
    const unavailableEmailRegistration = await call(
      "register",
      {
        name: "Email Provider Offline",
        mobile: "9876500090",
        email: "student@example.com",
        dateOfBirth: "1999-05-04",
        consent: true,
        skipSetup: true,
      },
      "",
      "10.0.10.10"
    );
    check(
      "email transport failure does not fail registration",
      unavailableEmailRegistration.status === 200 &&
        unavailableEmailRegistration.data.notification?.reason === "provider_error"
    );
    check(
      "transport failure keeps the student account",
      Boolean(await getJson(store, `students/${unavailableEmailRegistration.data.student?.id}`))
    );

    const auditFailureStore = {
      ...store,
      async setJSON(key, value) {
        if (String(key).startsWith("audit/")) throw new Error("audit storage unavailable");
        return store.setJSON(key, value);
      },
    };
    const originalConsoleError = console.error;
    let auditDiagnostic = [];
    let auditFailureResponse;
    console.error = (...args) => {
      auditDiagnostic = args;
    };
    try {
      auditFailureResponse = await handleRegister({
        req: new Request("https://portal.example/api", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: "Audit Store Offline",
            mobile: "9876500091",
            dateOfBirth: "1999-05-04",
            consent: true,
          }),
        }),
        ctx: { ip: "10.0.10.11" },
        store: auditFailureStore,
        env: apiEnv,
      });
    } finally {
      console.error = originalConsoleError;
    }
    const auditFailureData = await auditFailureResponse.json();
    check(
      "post-save audit failure does not fail registration",
      auditFailureResponse.status === 200 &&
        Boolean(await getJson(store, `students/${auditFailureData.student?.id}`))
    );
    check(
      "audit failure diagnostic excludes student identifiers",
      auditDiagnostic[0] === "registration audit logging failed" &&
        !JSON.stringify(auditDiagnostic).includes("9876500091")
    );

    globalThis.fetch = async (url, options) => {
      sentEmails.push({
        url,
        body: JSON.parse(options.body),
        idempotencyKey: options.headers["Idempotency-Key"],
      });
      return new Response(JSON.stringify({ id: `test-${sentEmails.length}` }), { status: 200 });
    };
    const forgot = await call("admin_forgot_password", { email: "attacker@example.com" }, "", "10.0.10.2");
    check("forgot password returns a non-enumerating success", forgot.status === 200 && !forgot.data.message.includes("attacker@example.com"));
    check("reset email recipient is fixed to ADMIN_EMAIL", sentEmails[1]?.body.to?.[0] === "admin@example.com");
    const resetMatch = sentEmails[1]?.body.text.match(/reset=([A-Za-z0-9_-]+)/);
    const resetToken = resetMatch?.[1] || "";
    check("reset email contains a one-time link", Boolean(resetToken));
    const expiredToken = crypto.randomBytes(32).toString("base64url");
    const expiredHash = crypto.createHash("sha256").update(expiredToken).digest("hex");
    await putJson(store, `auth/admin-password-reset/${expiredHash}`, { expiresAt: Date.now() - 1 });
    const expiredReset = await call(
      "admin_reset_password",
      { token: expiredToken, newPassword: "admin-expired-password-2026" },
      "",
      "10.0.10.8"
    );
    check("expired admin reset links are rejected", expiredReset.status === 400);
    const resetPassword = await call(
      "admin_reset_password",
      { token: resetToken, newPassword: "admin-reset-password-2026" },
      "",
      "10.0.10.3"
    );
    check("admin reset link changes the password", resetPassword.status === 200, JSON.stringify(resetPassword.data));
    check("password reset invalidates existing admin sessions", (await call("admin_overview", {}, globalThis.adminToken)).status === 401);
    const reusedToken = await call(
      "admin_reset_password",
      { token: resetToken, newPassword: "admin-other-password-2026" },
      "",
      "10.0.10.4"
    );
    check("admin reset link is single-use", reusedToken.status === 400);
    const oldAdmin = await call("admin_login", { password: "test-admin-pass" }, "", "10.0.10.5");
    const newAdmin = await call("admin_login", { password: "admin-reset-password-2026" }, "", "10.0.10.6");
    check("reset password override replaces the initial secret", oldAdmin.status === 401 && newAdmin.status === 200);
    const changedAdmin = await call(
      "admin_password_change",
      {
        currentPassword: "admin-reset-password-2026",
        newPassword: "admin-changed-password-2026",
      },
      newAdmin.data.token
    );
    check("authenticated admin can change password", changedAdmin.status === 200);
    const finalAdminLogin = await call(
      "admin_login",
      { password: "admin-changed-password-2026" },
      "",
      "10.0.10.7"
    );
    check("changed admin password is active", finalAdminLogin.status === 200);

    const controllerSave = await call(
      "admin_exam_controller_save",
      {
        controller: {
          username: "test-controller",
          displayName: "परीक्षा कंट्रोलर",
          password: "exam-controller-password-2026",
          active: true,
        },
      },
      finalAdminLogin.data.token
    );
    const controllerGet = await call(
      "admin_exam_controller_get",
      {},
      finalAdminLogin.data.token
    );
    const controllerLogin = await call(
      "exam_controller_login",
      { username: "test-controller", password: "exam-controller-password-2026" }
    );
    const controllerToken = controllerLogin.data.token;
    const controllerExams = await call("controller_exams", {}, controllerToken);
    const controllerCatalog = await call("controller_catalog", {}, controllerToken);
    const controllerDraft = await call(
      "controller_exam_create",
      {
        exam: {
          title: "Controller Draft Test",
          code: "CONTROLLER-DRAFT",
          subjectId: "trade-theory",
          tradeId: "chnm",
          durationMin: 45,
          passPct: 40,
          marksPerQuestion: 1,
          negativeMarks: 0,
          attemptsAllowed: 1,
          type: "final",
          status: "published",
          questionIds: ["must-not-be-accepted"],
        },
      },
      controllerToken
    );
    const controllerLive = await call("controller_live", {}, controllerToken);
    const controllerPublishDenied = await call(
      "controller_exam_publish",
      { examId: controllerDraft.data.exam?.id || "" },
      controllerToken
    );
    const controllerAdminPublishDenied = await call(
      "admin_exam_publish",
      { examId: controllerDraft.data.exam?.id || "" },
      controllerToken
    );
    const controllerDenied = await call("admin_overview", {}, controllerToken);
    const controllerStudentRecordsDenied = await call("admin_students", {}, controllerToken);
    check(
      "admin can create a separate controller account without returning its hash",
      controllerSave.status === 200 &&
        controllerGet.data.controller?.username === "test-controller" &&
        !JSON.stringify(controllerGet.data).includes("passwordHash")
    );
    check("exam controller has a separate successful login", controllerLogin.status === 200 && controllerToken);
    check(
      "controller catalog exposes only active subject and trade labels",
      controllerCatalog.status === 200 &&
        controllerCatalog.data.subjects.some((subject) => subject.id === "trade-theory") &&
        controllerCatalog.data.trades.some((trade) => trade.id === "chnm") &&
        !JSON.stringify(controllerCatalog.data).includes("students")
    );
    check(
      "controller can create a draft but cannot inject questions or publish it",
      controllerDraft.status === 200 &&
        controllerDraft.data.exam.status === "draft" &&
        controllerDraft.data.exam.questionCount === 0 &&
        controllerPublishDenied.status === 400 &&
      controllerAdminPublishDenied.status === 401,
      JSON.stringify({
      draft: controllerDraft,
      publish: controllerPublishDenied,
      adminPublish: controllerAdminPublishDenied,
      })
    );
    check(
      "controller exam list exposes no question content",
      controllerExams.status === 200 &&
        Array.isArray(controllerExams.data.exams) &&
        !JSON.stringify(controllerExams.data).includes("questionIds")
    );
    check(
      "controller live view excludes student network details",
      controllerLive.status === 200 &&
        !JSON.stringify(controllerLive.data).includes('"ip"')
    );
    check(
      "controller cannot access admin dashboard or student records",
      controllerDenied.status === 401 && controllerStudentRecordsDenied.status === 401
    );
    const reviewedDraft = controllerDraft.data.exam
      ? await call(
          "admin_exam_save",
          {
            exam: {
              id: controllerDraft.data.exam.id,
              title: "Controller Draft Test",
              code: "CONTROLLER-DRAFT",
              subjectId: "trade-theory",
              tradeId: "chnm",
              durationMin: 45,
              passPct: 40,
              marksPerQuestion: 1,
              negativeMarks: 0,
              attemptsAllowed: 1,
              type: "final",
            },
            questionIds,
          },
          finalAdminLogin.data.token
        )
      : { status: 0 };
    const reviewedLock = controllerDraft.data.exam
      ? await call(
          "admin_exam_lock",
          { examId: controllerDraft.data.exam.id },
          finalAdminLogin.data.token
        )
      : { status: 0 };
    const reviewedPublish = controllerDraft.data.exam
      ? await call(
          "admin_exam_publish",
          { examId: controllerDraft.data.exam.id },
          finalAdminLogin.data.token
        )
      : { status: 0 };
    check(
      "admin can review controller draft, lock its paper, and publish it",
      reviewedDraft.status === 200 &&
        reviewedLock.status === 200 &&
        reviewedPublish.status === 200 &&
        reviewedPublish.data.exam.status === "published",
      JSON.stringify({
        draft: reviewedDraft,
        lock: reviewedLock,
        publish: reviewedPublish,
      })
    );
    const controllerDisabled = await call(
      "admin_exam_controller_save",
      {
        controller: {
          username: "test-controller",
          displayName: "परीक्षा कंट्रोलर",
          active: false,
        },
      },
      finalAdminLogin.data.token
    );
    check(
      "admin can disable controller access and invalidate its session",
      controllerDisabled.status === 200 &&
        (await call("controller_exams", {}, controllerToken)).status === 401 &&
        (await call("admin_overview", {}, finalAdminLogin.data.token)).status === 200
    );

    const studentLoginBeforeReset = await call(
      "student_login",
      { identifier: registration.data.loginId, password: "04051999" },
      "",
      "10.0.10.31"
    );
    const sentBeforeStudentReset = sentEmails.length;
    const studentForgot = await call(
      "student_forgot_password",
      { identifier: registration.data.loginId, email: "attacker@example.com" },
      "",
      "10.0.10.32"
    );
    const studentResetEmail = sentEmails[sentEmails.length - 1];
    const studentResetMatch = studentResetEmail?.body.text.match(/reset=([^&\s]+)/);
    const studentResetToken = studentResetMatch
      ? decodeURIComponent(studentResetMatch[1])
      : "";
    check(
      "student forgot-password sends reset link only to saved student email",
      studentLoginBeforeReset.status === 200 &&
        studentForgot.status === 200 &&
        sentEmails.length === sentBeforeStudentReset + 1 &&
        studentResetEmail?.body.to?.[0] === "student@example.com" &&
        !studentResetEmail?.body.text.includes("attacker@example.com")
    );
    check(
      "student reset link uses the configured HTTPS portal origin",
      studentResetEmail?.body.text.includes("https://portal.example/exam/index.html?reset=") &&
        Boolean(studentResetToken)
    );
    const unknownStudentForgot = await call(
      "student_forgot_password",
      { identifier: "CITS-UNKNOWN-99" },
      "",
      "10.0.10.33"
    );
    check(
      "student password recovery does not reveal whether an account exists",
      unknownStudentForgot.status === studentForgot.status &&
        unknownStudentForgot.data.message === studentForgot.data.message &&
        sentEmails.length === sentBeforeStudentReset + 1
    );
    const emailLessForgot = await call(
      "student_forgot_password",
      { identifier: "9876500091" },
      "",
      "10.0.10.34"
    );
    check(
      "accounts without a saved email receive the same non-enumerating response",
      emailLessForgot.status === studentForgot.status &&
        emailLessForgot.data.message === studentForgot.data.message &&
        sentEmails.length === sentBeforeStudentReset + 1
    );
    const studentRecordBeforeReset = await getJson(store, `students/${registration.data.student.id}`);
    const expiredStudentToken =
      Buffer.from(studentRecordBeforeReset.id, "utf8").toString("base64url") +
      "." +
      crypto.randomBytes(32).toString("base64url");
    const expiredStudentHash = crypto.createHash("sha256").update(expiredStudentToken).digest("hex");
    await putJson(store, `auth/student-password-reset/${studentRecordBeforeReset.id}`, {
      tokenHash: expiredStudentHash,
      expiresAt: Date.now() - 1,
    });
    const expiredStudentReset = await call(
      "student_reset_password",
      { token: expiredStudentToken, newPassword: "student-expired-reset-password" },
      "",
      "10.0.10.35"
    );
    check("expired student reset links are rejected", expiredStudentReset.status === 400);
    const validStudentForgot = await call(
      "student_forgot_password",
      { identifier: registration.data.loginId },
      "",
      "10.0.10.36"
    );
    const validStudentResetEmail = sentEmails[sentEmails.length - 1];
    const validStudentResetMatch = validStudentResetEmail?.body.text.match(/reset=([^&\s]+)/);
    const validStudentResetToken = validStudentResetMatch
      ? decodeURIComponent(validStudentResetMatch[1])
      : "";
    const forgedStudentResetToken =
      validStudentResetToken.split(".")[0] + "." + crypto.randomBytes(32).toString("base64url");
    const forgedStudentReset = await call(
      "student_reset_password",
      { token: forgedStudentResetToken, newPassword: "student-forged-reset-password" },
      "",
      "10.0.10.41"
    );
    const studentReset = await call(
      "student_reset_password",
      { token: validStudentResetToken, newPassword: "student-reset-password-2026" },
      "",
      "10.0.10.37"
    );
    const oldStudentSession = await call(
      "student_dashboard",
      {},
      studentLoginBeforeReset.data.token,
      "10.0.10.38"
    );
    const newStudentLogin = await call(
      "student_login",
      { identifier: registration.data.loginId, password: "student-reset-password-2026" },
      "",
      "10.0.10.39"
    );
    const reusedStudentReset = await call(
      "student_reset_password",
      { token: validStudentResetToken, newPassword: "another-student-password-2026" },
      "",
      "10.0.10.40"
    );
    check(
      "forged student reset token cannot consume the valid recovery link",
      forgedStudentReset.status === 400 && studentReset.status === 200
    );
    check(
      "student reset changes the password and invalidates prior sessions",
      validStudentForgot.status === 200 &&
        studentReset.status === 200 &&
        oldStudentSession.status === 401 &&
        newStudentLogin.status === 200 &&
        !newStudentLogin.data.requiresPasswordChange &&
        reusedStudentReset.status === 400
    );

    const releaseEmailStart = sentEmails.length;
    await call("admin_exam_release", { examId, releaseResults: false }, finalAdminLogin.data.token);
    const releasedWithEmail = await call(
      "admin_exam_release",
      { examId, releaseResults: true },
      finalAdminLogin.data.token
    );
    const resultEmail = sentEmails
      .slice(releaseEmailStart)
      .find((sent) => sent.body.subject.startsWith("परीक्षा परिणाम जारी"));
    check(
      "publishing results sends one Resend notification to the student",
      releasedWithEmail.status === 200 &&
        resultEmail?.body.to?.[0] === "student@example.com"
    );
    check(
      "result notification contains a portal link without score details",
      resultEmail?.body.text.includes("https://portal.example/exam/index.html") &&
        !resultEmail.body.text.includes("70%")
    );
    check(
      "result notification uses a stable Resend idempotency key",
      resultEmail?.idempotencyKey === `result-release/${examId}/${studentId}`
    );
    const emailCountAfterPublish = sentEmails.length;
    await call(
      "admin_exam_release",
      { examId, releaseResults: true },
      finalAdminLogin.data.token
    );
    check(
      "repeating result publish does not send a duplicate email",
      sentEmails.length === emailCountAfterPublish
    );
  } finally {
    globalThis.fetch = savedFetch;
    apiEnv = savedEnv;
  }
}

if (testD1) {
  const { default: worker } = await import("../cloudflare/worker.mjs");
  const runtimeEnv = {
    ...apiEnv,
    ASSETS: { fetch: async () => new Response("exam asset") },
  };
  const asset = await worker.fetch(
    new Request("https://example.test/exam/index.html"),
    runtimeEnv
  );
  check(
    "Cloudflare exam assets carry CSP and no-store headers",
    asset.headers.get("content-security-policy")?.includes("default-src 'self'") &&
      asset.headers.get("cache-control") === "no-store, max-age=0"
  );
  const redirect = await worker.fetch(
    new Request("https://example.test/Computer-Lab"),
    runtimeEnv
  );
  check(
    "Cloudflare preserves legacy Netlify redirects",
    redirect.status === 301 && redirect.headers.get("location") === "/Computer-Lab/02-basics.html"
  );
  const routed = await worker.fetch(
    new Request("https://example.test/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "bootstrap" }),
    }),
    runtimeEnv
  );
  check("Cloudflare Worker routes /api to the D1-backed CBT API", routed.status === 200);
  const unavailable = await worker.fetch(
    new Request("https://example.test/api", { method: "POST" }),
    { ASSETS: runtimeEnv.ASSETS }
  );
  check("Cloudflare API fails explicitly when D1 is unbound", unavailable.status === 503);
  await worker.scheduled({}, runtimeEnv);
  check("Cloudflare scheduled expiry handler runs", true);
}
console.log(`\n===== ${passed} passed, ${failed} failed =====`);
if (failed) {
  console.log("Failures:", failures.join(", "));
  process.exit(1);
}
__resetMemoryStore();
sqlite?.close();
