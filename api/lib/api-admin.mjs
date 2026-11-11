import crypto from "node:crypto";
import {
  K,
  getJson,
  putJson,
  del,
  listJson,
  listKeys,
  mapLimit,
  deleteKeys,
} from "./db.mjs";
import { HttpError, json, readJson, getIp, csvResponse } from "./http.mjs";
import {
  clean,
  validKey,
  int,
  number,
  bool,
  validateStudent,
  validateExam,
  validateQuestion,
  photo,
  normalizeText,
  csv,
  slug,
} from "./validate.mjs";
import {
  issueAdminToken,
  hasAdminCredential,
  checkAdminPassword,
  hashPassword,
  adminAuthVersion,
  bumpAdminAuthVersion,
  clearRateLimit,
  assertAuthUnlocked,
  recordAuthFailure,
  clearAuthFailures,
  rateLimit,
  audit,
  recentAudit,
  hashPin,
} from "./auth.mjs";
import { emailConfigured, sendEmail } from "./email.mjs";
import {
  createResetToken,
  hashResetToken,
  resetBaseUrl,
  validResetToken,
} from "./recovery.mjs";
import { processResultReleaseEmails } from "./result-notifications.mjs";
import {
  examSummary,
  resultDetail,
  resultSummary,
  studentSummary,
  publicSettings,
} from "./serializers.mjs";
import {
  allResults,
  examAttemptCount,
  examAttempts,
  examResults,
  getExam,
  getPaper,
  loadCatalog,
  nextRegistrationId,
  resolveQuestions,
  saveExam,
  subjectQuestionCounts,
} from "./domain.mjs";
import { buildPaper, finalizeAttempt, finalizeExpiredForExam } from "./scoring.mjs";
import { DEFAULT_SETTINGS } from "./seed.mjs";
import { importLegacyData, legacyPreview } from "./legacy.mjs";

const ADMIN_LOGIN_WINDOW = 15 * 60 * 1000;
const MAX_QUESTIONS_PER_EXAM = 500;
const MAX_IMPORT_ROWS = 1000;

function newExamId() {
  return `EXM-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
}

function newQuestionId(code) {
  return `Q-${String(code || "GEN").replace(/[^A-Z0-9]/gi, "").toUpperCase()}-${crypto
    .randomBytes(2)
    .toString("hex")
    .toUpperCase()}`;
}

const MANUAL_SET_ID = "manual";
const MANUAL_SET_NAME = "मैनुअल प्रश्न";

function newQuestionSetId() {
  return `SET-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomBytes(2)
    .toString("hex")
    .toUpperCase()}`;
}

function questionSet(question) {
  return {
    setId: clean(question.setId, 80) || MANUAL_SET_ID,
    setName: clean(question.setName, 120) || MANUAL_SET_NAME,
    setCreatedAt: question.setCreatedAt || question.createdAt || null,
  };
}

function setSummary(questions, catalog) {
  const map = new Map();
  for (const question of questions) {
    const set = questionSet(question);
    const key = `${question.subjectId}:${set.setId}`;
    let entry = map.get(key);
    if (!entry) {
      entry = {
        setId: set.setId,
        setName: set.setName,
        subjectId: question.subjectId,
        subjectName: catalog.subjectMap.get(question.subjectId)?.name || question.subjectId,
        count: 0,
        activeCount: 0,
        createdAt: set.setCreatedAt,
        latestAt: question.updatedAt || question.createdAt || null,
      };
      map.set(key, entry);
    }
    entry.count += 1;
    if (question.active !== false) entry.activeCount += 1;
    if (set.setCreatedAt && (!entry.createdAt || set.setCreatedAt < entry.createdAt)) {
      entry.createdAt = set.setCreatedAt;
    }
    if (question.updatedAt && (!entry.latestAt || question.updatedAt > entry.latestAt)) {
      entry.latestAt = question.updatedAt;
    }
  }
  return [...map.values()].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) ||
      a.setName.localeCompare(b.setName)
  );
}

function examSort(a, b) {
  return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
}

function settingsView(settings) {
  return { ...DEFAULT_SETTINGS, ...settings, ...publicSettings(settings) };
}

async function uniqueExamCode(store, code, excludeId) {
  const exams = await listJson(store, "exams/");
  return !exams.some((exam) => exam.code === code && exam.id !== excludeId);
}

async function examAdminSummary(store, exam, catalog) {
  const subjectName =
    exam.subjectId === "mixed"
      ? "Mixed"
      : catalog.subjectMap.get(exam.subjectId)?.name || exam.subjectId;
  const tradeName = catalog.tradeMap.get(exam.tradeId)?.name || "";
  const [resultKeys, attemptKeys] = await Promise.all([
    listKeys(store, `idx/exam-results/${exam.id}/`),
    listKeys(store, `idx/exam-attempts/${exam.id}/`),
  ]);
  return {
    ...examSummary(exam, subjectName, tradeName),
    subjectName,
    tradeName,
    questionCount: Array.isArray(exam.questionIds) ? exam.questionIds.length : 0,
    totalQuestions: exam.totalQuestions || (exam.questionIds || []).length,
    resultCount: resultKeys.length,
    activeAttempts: attemptKeys.length,
    hasPaper: Boolean(exam.paperVersion),
  };
}

async function adminPreview(store, exam, questionIds) {
  const { questions, missing } = await resolveQuestions(store, questionIds);
  if (!questions.length) {
    return { paper: null, missing, totalMarks: 0, questions: [] };
  }
  const paper = buildPaper(exam, questions, exam.paperVersion || 0);
  return { paper, missing, totalMarks: paper.totalMarks, questions: paper.questions };
}

async function activeAttemptDetails(store, exam) {
  const attempts = await examAttempts(store, exam.id);
  const rows = [];
  for (const attempt of attempts) {
    const student = await getJson(store, K.students(attempt.studentId));
    rows.push({
      attemptId: attempt.attemptId,
      studentId: attempt.studentId,
      studentName: student?.name || attempt.studentId,
      regId: attempt.studentId,
      startedAt: attempt.startedAt,
      endAt: attempt.endAt,
      attempted: Object.keys(attempt.responses || {}).length,
      marked: (attempt.marked || []).length,
      visited: (attempt.visited || []).length,
      seq: attempt.seq,
    });
  }
  return rows;
}

function examStatsFromResults(results) {
  if (!results.length) {
    return { count: 0, average: 0, highest: 0, lowest: 0, pass: 0, fail: 0, passRate: 0 };
  }
  const percentages = results.map((result) => Number(result.percentage) || 0);
  const passed = results.filter((result) => result.pass).length;
  return {
    count: results.length,
    average: Math.round((percentages.reduce((sum, value) => sum + value, 0) / results.length) * 100) / 100,
    highest: Math.max(...percentages),
    lowest: Math.min(...percentages),
    pass: passed,
    fail: results.length - passed,
    passRate: Math.round((passed / results.length) * 10000) / 100,
  };
}

function filterResults(results, body) {
  const q = clean(body.q, 80).toLowerCase();
  return results.filter((result) => {
    if (body.examId && result.examId !== body.examId) return false;
    if (body.subjectId && result.subjectId !== body.subjectId) return false;
    if (body.tradeId && result.tradeId !== body.tradeId) return false;
    if (body.studentId && result.studentId !== body.studentId) return false;
    if (body.type && result.examType !== body.type) return false;
    if (q) {
      const haystack = [
        result.studentName,
        result.regId,
        result.examTitle,
        result.examCode,
        result.resultId,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function paged(items, body, defaultSize = 25) {
  const page = Math.max(1, int(body.page, 1));
  const pageSize = Math.max(1, Math.min(100, int(body.pageSize, defaultSize)));
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

export async function handleAdminLogin({ req, ctx, store, env }) {
  const ip = getIp(req, ctx);
  await assertAuthUnlocked(store, "admin", ["admin"]);
  await rateLimit(store, "admin-login", ip, 8, ADMIN_LOGIN_WINDOW);
  if (!(await hasAdminCredential(env, store))) {
    throw new HttpError(
      "ADMIN_PASSWORD secret या पहले से सेट किया गया एडमिन पासवर्ड आवश्यक है।",
      500
    );
  }
  const body = await readJson(req);
  if (!(await checkAdminPassword(body.password, env, store))) {
    if (await recordAuthFailure(store, "admin", "admin", ["admin"])) {
      throw new HttpError(
        "तीन गलत प्रयासों के बाद लॉगिन और पासवर्ड रीसेट एक घंटे के लिए लॉक है",
        429,
        { retryAfter: 3600 }
      );
    }
    throw new HttpError("गलत पासवर्ड", 401);
  }
  await clearRateLimit(store, "admin-login", ip);
  await clearAuthFailures(store, "admin", ["admin"]);
  await audit(store, "admin.login", "admin", { ip });
  return json({
    ok: true,
    token: issueAdminToken(env, await adminAuthVersion(store)),
    expiresIn: 12 * 3600,
  });
}

function validNewAdminPassword(password) {
  return typeof password === "string" && password.length >= 12 && password.length <= 128;
}

export async function handleAdminPasswordChange({ req, ctx, store, env }) {
  const body = await readJson(req);
  const ip = getIp(req, ctx);
  await rateLimit(store, "admin-password-change", ip, 6, ADMIN_LOGIN_WINDOW);
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  if (!(await checkAdminPassword(currentPassword, env, store))) {
    throw new HttpError("वर्तमान पासवर्ड सही नहीं है", 401);
  }
  if (!validNewAdminPassword(newPassword)) {
    throw new HttpError("नया पासवर्ड 12 से 128 अक्षरों का होना चाहिए", 400);
  }
  if (newPassword === currentPassword) {
    throw new HttpError("नया पासवर्ड वर्तमान पासवर्ड से अलग होना चाहिए", 400);
  }
  await putJson(store, K.adminPasswordOverride(), await hashPassword(newPassword));
  const authVersion = await bumpAdminAuthVersion(store);
  await clearAuthFailures(store, "admin", ["admin"]);
  await audit(store, "admin.password.change", "admin", { ip });
  return json({
    ok: true,
    token: issueAdminToken(env, authVersion),
    message: "एडमिन पासवर्ड बदल दिया गया है।",
  });
}

export async function handleAdminForgotPassword({ req, ctx, store, env }) {
  const ip = getIp(req, ctx);
  await assertAuthUnlocked(store, "admin", ["admin"]);
  await rateLimit(store, "admin-forgot-password", ip, 5, 60 * 60 * 1000);
  await rateLimit(store, "admin-forgot-password-global", "admin", 3, 60 * 60 * 1000);
  const recipient = String(env?.ADMIN_EMAIL || "").trim().toLowerCase();
  const baseUrl = resetBaseUrl(env);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(recipient) || !baseUrl || !emailConfigured(env)) {
    throw new HttpError(
      "पासवर्ड रिकवरी उपलब्ध नहीं है। ADMIN_EMAIL और PUBLIC_BASE_URL के साथ Gmail API (GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN) या Resend (RESEND_API_KEY, EMAIL_FROM) configure करें।",
      503
    );
  }
  const token = createResetToken();
  const tokenHash = hashResetToken(token);
  const resetKey = K.adminPasswordReset(tokenHash);
  const expiresAt = Date.now() + 30 * 60 * 1000;
  await Promise.all(
    (await listKeys(store, "auth/admin-password-reset/")).map((key) => del(store, key))
  );
  await putJson(store, resetKey, { expiresAt });
  const resetUrl = `${baseUrl}/exam/admin.html?reset=${encodeURIComponent(token)}`;
  const delivery = await sendEmail(env, {
    to: recipient,
    subject: "एडमिन पासवर्ड रीसेट",
    text: `एडमिन पासवर्ड रीसेट करने के लिए इस लिंक को 30 मिनट के भीतर खोलें:\n${resetUrl}\n\nयदि आपने यह अनुरोध नहीं किया है, तो इस ईमेल को अनदेखा करें।`,
    html: `<p>एडमिन पासवर्ड रीसेट करने के लिए <a href="${resetUrl}">इस लिंक</a> को 30 मिनट के भीतर खोलें।</p><p>यदि आपने यह अनुरोध नहीं किया है, तो इस ईमेल को अनदेखा करें।</p>`,
  });
  if (!delivery.sent) {
    await del(store, resetKey);
    throw new HttpError("रीसेट ईमेल नहीं भेजा जा सका। ईमेल provider configuration जाँचकर फिर प्रयास करें।", 503);
  }
  return json({
    ok: true,
    message: "यदि एडमिन ईमेल कॉन्फ़िगर है, तो पासवर्ड रीसेट लिंक भेज दिया गया है।",
  });
}

export async function handleAdminResetPassword({ req, ctx, store, env }) {
  const ip = getIp(req, ctx);
  await assertAuthUnlocked(store, "admin", ["admin"]);
  await rateLimit(store, "admin-reset-password", ip, 8, 15 * 60 * 1000);
  const body = await readJson(req);
  const token = String(body.token || "");
  const newPassword = String(body.newPassword || "");
  if (!validResetToken(token)) {
    throw new HttpError("रीसेट लिंक अमान्य या समाप्त हो गया है", 400);
  }
  if (!validNewAdminPassword(newPassword)) {
    throw new HttpError("नया पासवर्ड 12 से 128 अक्षरों का होना चाहिए", 400);
  }
  const tokenHash = hashResetToken(token);
  const reset = await store.consumeResetToken(K.adminPasswordReset(tokenHash), Date.now());
  if (!reset) throw new HttpError("रीसेट लिंक अमान्य या समाप्त हो गया है", 400);
  await putJson(store, K.adminPasswordOverride(), await hashPassword(newPassword));
  await bumpAdminAuthVersion(store);
  await clearAuthFailures(store, "admin", ["admin"]);
  await audit(store, "admin.password.reset", "admin", { ip });
  return json({ ok: true, message: "एडमिन पासवर्ड रीसेट हो गया है।" });
}

export async function handleAdminOverview({ store }) {
  const catalog = await loadCatalog(store, { includeInactive: true });
  const [students, exams, results, settings, auditLog] = await Promise.all([
    listJson(store, "students/"),
    listJson(store, "exams/"),
    allResults(store),
    getJson(store, K.settings()),
    recentAudit(store, 20),
  ]);
  const counts = { draft: 0, locked: 0, published: 0, archived: 0 };
  for (const exam of exams) counts[exam.status || "draft"] = (counts[exam.status || "draft"] || 0) + 1;
  const questionCounts = await subjectQuestionCounts(store, catalog);
  const activeAttemptKeys = await listKeys(store, "idx/exam-attempts/");
  const finalResults = results.filter((result) => result.examType !== "practice");
  const practiceResults = results.filter((result) => result.examType === "practice");
  let legacy = null;
  try {
    legacy = await legacyPreview(env);
  } catch {
    legacy = null;
  }
  return json({
    ok: true,
    settings: settingsView(settings),
    summary: {
      students: students.length,
      activeStudents: students.filter((student) => student.active !== false).length,
      exams: exams.length,
      examStatus: counts,
      questions: Object.values(questionCounts).reduce((sum, value) => sum + value, 0),
      results: results.length,
      finalResults: finalResults.length,
      practiceResults: practiceResults.length,
      activeAttempts: activeAttemptKeys.length,
      passRate: examStatsFromResults(finalResults).passRate,
      average:
        finalResults.length > 0
          ? Math.round(
              (finalResults.reduce((sum, result) => sum + (Number(result.percentage) || 0), 0) /
                finalResults.length) *
                100
            ) / 100
          : 0,
    },
    subjects: catalog.subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      active: subject.active !== false,
      questions: questionCounts[subject.id] || 0,
      exams: exams.filter((exam) => exam.subjectId === subject.id).length,
    })),
    trades: catalog.trades,
    recentResults: results.slice(0, 8).map(resultSummary),
    recentAudit: auditLog,
    legacy,
    serverNow: Date.now(),
  });
}

export async function handleAdminExams({ store }) {
  const catalog = await loadCatalog(store, { includeInactive: true });
  const exams = (await listJson(store, "exams/")).sort(examSort);
  const items = [];
  for (const exam of exams) items.push(await examAdminSummary(store, exam, catalog));
  return json({ ok: true, exams: items, serverNow: Date.now() });
}

export async function handleAdminExamGet({ store, req }) {
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  const catalog = await loadCatalog(store, { includeInactive: true });
  const paper = await getPaper(store, exam.id, exam.paperVersion);
  await finalizeExpiredForExam(store, exam);
  const ids = paper?.questions?.length
    ? paper.questions.map((question) => question.qid)
    : exam.questionIds || [];
  let preview = [];
  let missing = [];
  if (ids.length) {
    if (paper?.questions?.length) {
      preview = paper.questions;
    } else {
      try {
        const built = await adminPreview(store, exam, ids);
        preview = built.questions;
        missing = built.missing;
      } catch (error) {
        missing = [error.message];
      }
    }
  }
  const results = await examResults(store, exam.id);
  return json({
    ok: true,
    exam: {
      ...exam,
      ...examSummary(exam, "", "", {}),
      subjectName:
        exam.subjectId === "mixed"
          ? "Mixed"
          : catalog.subjectMap.get(exam.subjectId)?.name || exam.subjectId,
      tradeName: catalog.tradeMap.get(exam.tradeId)?.name || "",
      questionIds: ids,
      resultCount: results.length,
      activeAttempts: (await examAttemptCount(store, exam.id)) || 0,
    },
    paper: paper
      ? {
          version: paper.version,
          createdAt: paper.createdAt,
          totalQuestions: paper.totalQuestions,
          totalMarks: paper.totalMarks,
          hash: paper.hash,
        }
      : null,
    preview,
    missing,
    attempts: await activeAttemptDetails(store, exam),
    stats: examStatsFromResults(results),
    results: results.slice(0, 10).map(resultSummary),
    serverNow: Date.now(),
  });
}

export async function handleAdminExamSave({ store, req }) {
  const body = await readJson(req);
  const input = body.exam || {};
  const existing = input.id ? await getJson(store, K.exams(String(input.id))) : null;
  if (input.id && !existing) throw new HttpError("संपादित करने के लिए परीक्षा नहीं मिली", 404);
  const data = validateExam(input);
  const catalog = await loadCatalog(store, { includeInactive: true });
  if (data.subjectId !== "mixed" && !catalog.subjectMap.has(data.subjectId)) {
    throw new HttpError("चुना गया विषय मौजूद नहीं है", 400);
  }
  if (data.tradeId && !catalog.tradeMap.has(data.tradeId)) {
    throw new HttpError("चुना गया ट्रेड मौजूद नहीं है", 400);
  }
  if (!(await uniqueExamCode(store, data.code, existing?.id))) {
    throw new HttpError("यह Exam Code पहले से किसी परीक्षा में प्रयोग हो रहा है", 409);
  }

  let questionIds = existing?.questionIds || [];
  let totalMarks = Number(existing?.totalMarks) || 0;
  if (Array.isArray(body.questionIds)) {
    questionIds = [...new Set(body.questionIds.map((id) => clean(id, 40)).filter(Boolean))];
    if (questionIds.length > MAX_QUESTIONS_PER_EXAM) {
      throw new HttpError(`एक परीक्षा में अधिकतम ${MAX_QUESTIONS_PER_EXAM} प्रश्न हो सकते हैं`, 400);
    }
    const { questions, missing } = await resolveQuestions(store, questionIds);
    if (missing.length) {
      throw new HttpError(`ये प्रश्न नहीं मिले: ${missing.slice(0, 5).join(", ")}`, 400);
    }
    if (data.subjectId !== "mixed") {
      const wrong = questions.filter((question) => question.subjectId !== data.subjectId);
      if (wrong.length) {
        throw new HttpError(
          `ये प्रश्न इस विषय के नहीं हैं: ${wrong.slice(0, 5).map((q) => q.qid).join(", ")}`,
          400
        );
      }
    }
    totalMarks = Math.round(
      questions.reduce((sum, question) => sum + (question.marks ?? data.marksPerQuestion ?? 1), 0) * 100
    ) / 100;
  }

  const structuralChanged = Boolean(
    existing &&
      (existing.subjectId !== data.subjectId ||
        existing.type !== data.type ||
        Number(existing.marksPerQuestion) !== Number(data.marksPerQuestion) ||
        Number(existing.negativeMarks) !== Number(data.negativeMarks) ||
        JSON.stringify(existing.questionIds || []) !== JSON.stringify(questionIds))
  );

  if (existing && existing.status === "published" && structuralChanged) {
    throw new HttpError(
      "Published परीक्षा का पेपर/विषय/अंक नहीं बदले जा सकते। पहले Unpublish करें — पुराने परिणाम सुरक्षित रहेंगे।",
      409
    );
  }

  if (structuralChanged && !Array.isArray(body.questionIds) && questionIds.length) {
    const { questions } = await resolveQuestions(store, questionIds);
    totalMarks = Math.round(
      questions.reduce((sum, question) => sum + (question.marks ?? data.marksPerQuestion ?? 1), 0) * 100
    ) / 100;
  }

  // Question/paper changes to a locked exam invalidate its snapshot; demote to
  // draft so it must be locked (and versioned) again before publishing. Already
  // published attempts keep their own immutable paper versions.
  const demoteLocked = Boolean(existing && existing.status === "locked" && structuralChanged);

  const now = new Date().toISOString();
  const exam = {
    ...(existing || {}),
    ...data,
    id: existing?.id || newExamId(),
    questionIds,
    status: demoteLocked ? "draft" : existing?.status || "draft",
    paperVersion: existing?.paperVersion || 0,
    paperHash: existing?.paperHash || "",
    paperLockedAt: demoteLocked ? null : existing?.paperLockedAt || null,
    publishedAt: existing?.publishedAt || null,
    totalQuestions: structuralChanged ? questionIds.length : existing?.totalQuestions || questionIds.length,
    totalMarks,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  await saveExam(store, exam);
  await audit(store, existing ? "exam.update" : "exam.create", "admin", { examId: exam.id });
  return json({ ok: true, exam, serverNow: Date.now() });
}

export async function handleAdminExamPaper({ store, req }) {
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  if (exam.status === "published") {
    throw new HttpError("Published परीक्षा का पेपर बदलने से पहले Unpublish करें", 409);
  }
  const questionIds = [
    ...new Set((Array.isArray(body.questionIds) ? body.questionIds : []).map((id) => clean(id, 40)).filter(Boolean)),
  ];
  if (questionIds.length > MAX_QUESTIONS_PER_EXAM) {
    throw new HttpError(`एक परीक्षा में अधिकतम ${MAX_QUESTIONS_PER_EXAM} प्रश्न हो सकते हैं`, 400);
  }
  const { questions, missing } = await resolveQuestions(store, questionIds);
  if (missing.length) throw new HttpError(`ये प्रश्न नहीं मिले: ${missing.join(", ")}`, 400);
  if (exam.subjectId !== "mixed") {
    const wrong = questions.filter((question) => question.subjectId !== exam.subjectId);
    if (wrong.length) {
      throw new HttpError(
        `ये प्रश्न इस परीक्षा के विषय के नहीं हैं: ${wrong.slice(0, 5).map((q) => q.qid).join(", ")}`,
        400
      );
    }
  }
  let totalMarks = 0;
  if (questions.length) {
    totalMarks = buildPaper(exam, questions, exam.paperVersion || 0).totalMarks;
  }
  exam.questionIds = questionIds;
  exam.totalQuestions = questionIds.length;
  exam.totalMarks = totalMarks;
  exam.status = "draft";
  exam.updatedAt = new Date().toISOString();
  await saveExam(store, exam);
  await audit(store, "exam.paper", "admin", { examId: exam.id, count: questionIds.length });
  return json({ ok: true, exam, serverNow: Date.now() });
}

export async function handleAdminExamLock({ store, req }) {
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  if (exam.status === "published") throw new HttpError("Published परीक्षा पहले Unpublish करें", 409);
  const ids = exam.questionIds || [];
  if (!ids.length) throw new HttpError("लॉक करने से पहले प्रश्न जोड़ें", 400);
  const { questions, missing } = await resolveQuestions(store, ids);
  if (missing.length) throw new HttpError(`ये प्रश्न नहीं मिले: ${missing.join(", ")}`, 400);
  const candidate = buildPaper(exam, questions, (exam.paperVersion || 0) + 1);
  const current = await getPaper(store, exam.id, exam.paperVersion);
  const sameQuestions =
    current && JSON.stringify(current.questions) === JSON.stringify(candidate.questions);
  const version = sameQuestions ? exam.paperVersion : candidate.version;
  const paper = sameQuestions ? current : candidate;
  if (!sameQuestions) await putJson(store, K.paper(exam.id, version), paper);
  exam.paperVersion = version;
  exam.paperHash = paper.hash;
  exam.totalQuestions = paper.totalQuestions;
  exam.totalMarks = paper.totalMarks;
  exam.status = "locked";
  exam.paperLockedAt = new Date().toISOString();
  exam.updatedAt = exam.paperLockedAt;
  await saveExam(store, exam);
  await audit(store, "exam.lock", "admin", { examId: exam.id, version });
  return json({ ok: true, exam, paper, serverNow: Date.now() });
}

export async function handleAdminExamPublish({ store, req }) {
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  if (exam.status === "published") return json({ ok: true, exam });
  if (exam.status !== "locked") {
    throw new HttpError("Publish करने से पहले पेपर Lock करें", 409);
  }
  const paper = await getPaper(store, exam.id, exam.paperVersion);
  if (!paper || !paper.questions?.length) throw new HttpError("लॉक किया हुआ पेपर नहीं मिला", 409);
  if (exam.startAt && exam.endAt && new Date(exam.startAt) >= new Date(exam.endAt)) {
    throw new HttpError("Exam Start/End Time ठीक करें", 400);
  }
  exam.status = "published";
  exam.publishedAt = new Date().toISOString();
  exam.updatedAt = exam.publishedAt;
  exam.active = true;
  await saveExam(store, exam);
  await audit(store, "exam.publish", "admin", { examId: exam.id, version: exam.paperVersion });
  return json({ ok: true, exam, serverNow: Date.now() });
}

export async function handleAdminExamUnpublish({ store, req }) {
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  if (exam.status !== "published") return json({ ok: true, exam });
  exam.status = "locked";
  exam.updatedAt = new Date().toISOString();
  await saveExam(store, exam);
  await audit(store, "exam.unpublish", "admin", { examId: exam.id });
  return json({ ok: true, exam, serverNow: Date.now() });
}

export async function handleAdminExamRelease({ store, req, ctx, env }) {
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  const wasReleased = Boolean(exam.releaseResults);
  const releaseResults = bool(body.releaseResults, exam.releaseResults);
  exam.releaseResults = releaseResults;
  exam.showAnswers = releaseResults;
  exam.notifyResultsOnRelease = releaseResults
    ? Boolean(exam.notifyResultsOnRelease || !wasReleased)
    : false;
  let releaseAt = null;
  if (body.releaseAt) {
    const time = new Date(body.releaseAt).getTime();
    if (!Number.isFinite(time)) throw new HttpError("Result Release समय गलत है", 400);
    releaseAt = new Date(time).toISOString();
  }
  exam.releaseAt = releaseAt;
  exam.updatedAt = new Date().toISOString();
  await saveExam(store, exam);
  try {
    await audit(store, "exam.release", "admin", {
      examId: exam.id,
      releaseResults: exam.releaseResults,
      showAnswers: exam.showAnswers,
    });
  } catch (error) {
    console.error("exam release audit logging failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
  }
  if (
    exam.notifyResultsOnRelease &&
    (!exam.releaseAt || Date.parse(exam.releaseAt) <= Date.now())
  ) {
    const notifications = processResultReleaseEmails(store, env, exam).catch((error) => {
      console.error("result release email processing failed", {
        examId: exam.id,
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
    });
    if (typeof ctx?.waitUntil === "function") ctx.waitUntil(notifications);
    else await notifications;
  }
  return json({ ok: true, exam, serverNow: Date.now() });
}

export async function handleAdminExamDelete({ store, req }) {
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  if (exam.status !== "draft") {
    throw new HttpError("केवल Draft परीक्षा ही हटाई जा सकती है", 409);
  }
  const [results, attempts] = await Promise.all([
    listKeys(store, `idx/exam-results/${exam.id}/`),
    listKeys(store, `idx/exam-attempts/${exam.id}/`),
  ]);
  if (results.length || attempts.length) {
    throw new HttpError("इस परीक्षा के परिणाम/प्रयास मौजूद हैं — इसे हटाया नहीं जा सकता", 409);
  }
  if (clean(body.confirm, 120) !== exam.title && body.confirm !== true) {
    throw new HttpError("पुष्टि के लिए परीक्षा का नाम टाइप करें", 400);
  }
  await deleteKeys(store, await listKeys(store, `papers/${exam.id}/`));
  await del(store, K.exams(exam.id));
  await audit(store, "exam.delete", "admin", { examId: exam.id, title: exam.title });
  return json({ ok: true });
}

export async function handleAdminExamPreview({ store, req }) {
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  const ids =
    Array.isArray(body.questionIds) && body.questionIds.length
      ? body.questionIds
      : exam.questionIds || [];
  const catalog = await loadCatalog(store, { includeInactive: true });
  const preview = await adminPreview(store, exam, ids);
  return json({
    ok: true,
    exam: {
      id: exam.id,
      title: exam.title,
      code: exam.code,
      type: exam.type,
      status: exam.status,
      durationMin: exam.durationMin,
      passPct: exam.passPct,
      marksPerQuestion: exam.marksPerQuestion,
      negativeMarks: exam.negativeMarks,
      subjectName:
        exam.subjectId === "mixed"
          ? "Mixed"
          : catalog.subjectMap.get(exam.subjectId)?.name || exam.subjectId,
      tradeName: catalog.tradeMap.get(exam.tradeId)?.name || "",
      instructions: exam.instructions,
    },
    questions: preview.questions,
    totalQuestions: preview.questions.length,
    totalMarks: preview.totalMarks,
    missing: preview.missing,
    serverNow: Date.now(),
  });
}

export async function handleAdminSubjects({ store }) {
  const catalog = await loadCatalog(store, { includeInactive: true });
  const counts = await subjectQuestionCounts(store, catalog);
  const exams = await listJson(store, "exams/");
  return json({
    ok: true,
    subjects: catalog.subjects.map((subject) => ({
      ...subject,
      questions: counts[subject.id] || 0,
      exams: exams.filter((exam) => exam.subjectId === subject.id).length,
    })),
    serverNow: Date.now(),
  });
}

export async function handleAdminSubjectSave({ store, req }) {
  const body = await readJson(req);
  const input = body.subject || {};
  const name = clean(input.name, 60);
  if (name.length < 2) throw new HttpError("विषय का नाम दर्ज करें", 400);
  const id = input.id ? clean(input.id, 40) : slug(name, 40);
  if (!validKey(id)) throw new HttpError("विषय ID गलत है", 400);
  const code = clean(input.code, 8).toUpperCase() || id.slice(0, 4).toUpperCase();
  const existing = await getJson(store, K.subjects(id));
  if (input.id && !existing) throw new HttpError("विषय नहीं मिला", 404);
  const all = await listJson(store, "subjects/");
  if (all.some((subject) => subject.id !== id && subject.name.toLowerCase() === name.toLowerCase())) {
    throw new HttpError("इस नाम का विषय पहले से मौजूद है", 409);
  }
  const now = new Date().toISOString();
  const subject = {
    ...(existing || {}),
    id,
    name,
    code,
    active: bool(input.active, existing?.active !== false),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  await putJson(store, K.subjects(id), subject);
  await audit(store, existing ? "subject.update" : "subject.create", "admin", { subjectId: id });
  return json({ ok: true, subject });
}

export async function handleAdminSubjectDelete({ store, req }) {
  const body = await readJson(req);
  const id = clean(body.id, 40);
  const subject = await getJson(store, K.subjects(id));
  if (!subject) throw new HttpError("विषय नहीं मिला", 404);
  const [questionKeys, exams] = await Promise.all([
    listKeys(store, `questions/${id}/`),
    listJson(store, "exams/"),
  ]);
  const usedByExams = exams.filter((exam) => exam.subjectId === id);
  if (questionKeys.length || usedByExams.length) {
    throw new HttpError(
      `यह विषय प्रयोग में है (${questionKeys.length} प्रश्न, ${usedByExams.length} परीक्षाएँ) — पहले इन्हें हटाएँ या विषय निष्क्रिय करें`,
      409
    );
  }
  if (clean(body.confirm, 60) !== subject.name && body.confirm !== true) {
    throw new HttpError("पुष्टि के लिए विषय का नाम टाइप करें", 400);
  }
  await del(store, K.subjects(id));
  await audit(store, "subject.delete", "admin", { subjectId: id, name: subject.name });
  return json({ ok: true });
}

export async function handleAdminTrades({ store }) {
  const catalog = await loadCatalog(store, { includeInactive: true });
  const [exams, students] = await Promise.all([listJson(store, "exams/"), listJson(store, "students/")]);
  return json({
    ok: true,
    trades: catalog.trades.map((trade) => ({
      ...trade,
      exams: exams.filter((exam) => exam.tradeId === trade.id).length,
      students: students.filter((student) => student.tradeId === trade.id).length,
    })),
    serverNow: Date.now(),
  });
}

export async function handleAdminTradeSave({ store, req }) {
  const body = await readJson(req);
  const input = body.trade || {};
  const name = clean(input.name, 60);
  if (name.length < 2) throw new HttpError("ट्रेड का नाम दर्ज करें", 400);
  const id = input.id ? clean(input.id, 40) : slug(name, 40);
  if (!validKey(id)) throw new HttpError("ट्रेड ID गलत है", 400);
  const code = clean(input.code, 12).toUpperCase() || name.slice(0, 8).toUpperCase();
  const existing = await getJson(store, K.trades(id));
  if (input.id && !existing) throw new HttpError("ट्रेड नहीं मिला", 404);
  const all = await listJson(store, "trades/");
  if (all.some((trade) => trade.id !== id && trade.name.toLowerCase() === name.toLowerCase())) {
    throw new HttpError("इस नाम का ट्रेड पहले से मौजूद है", 409);
  }
  const now = new Date().toISOString();
  const trade = {
    ...(existing || {}),
    id,
    name,
    code,
    active: bool(input.active, existing?.active !== false),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  await putJson(store, K.trades(id), trade);
  await audit(store, existing ? "trade.update" : "trade.create", "admin", { tradeId: id });
  return json({ ok: true, trade });
}

export async function handleAdminTradeDelete({ store, req }) {
  const body = await readJson(req);
  const id = clean(body.id, 40);
  const trade = await getJson(store, K.trades(id));
  if (!trade) throw new HttpError("ट्रेड नहीं मिला", 404);
  const [exams, students] = await Promise.all([listJson(store, "exams/"), listJson(store, "students/")]);
  const used = exams.filter((exam) => exam.tradeId === id).length;
  const enrolled = students.filter((student) => student.tradeId === id).length;
  if (used || enrolled) {
    throw new HttpError(
      `यह ट्रेड प्रयोग में है (${used} परीक्षाएँ, ${enrolled} छात्र) — इसे निष्क्रिय करें`,
      409
    );
  }
  if (clean(body.confirm, 60) !== trade.name && body.confirm !== true) {
    throw new HttpError("पुष्टि के लिए ट्रेड का नाम टाइप करें", 400);
  }
  await del(store, K.trades(id));
  await audit(store, "trade.delete", "admin", { tradeId: id, name: trade.name });
  return json({ ok: true });
}

export async function handleAdminQuestions({ store, req }) {
  const body = await readJson(req);
  const catalog = await loadCatalog(store, { includeInactive: true });
  const subjectId = clean(body.subjectId, 40);
  const q = clean(body.q, 100).toLowerCase();
  const questions = [];
  if (subjectId) {
    if (subjectId !== "mixed" && !catalog.subjectMap.has(subjectId)) {
      throw new HttpError("विषय नहीं मिला", 404);
    }
    const items = await listJson(store, `questions/${subjectId}/`);
    for (const item of items) questions.push(item);
  } else {
    for (const subject of catalog.subjects) {
      const items = await listJson(store, `questions/${subject.id}/`);
      for (const item of items) questions.push(item);
    }
  }
  const filtered = questions
    .filter((question) => {
      if (body.active === true && question.active === false) return false;
      if (body.active === false && question.active !== false) return false;
      const setId = clean(body.setId, 80);
      if (setId && questionSet(question).setId !== setId) return false;
      if (!q) return true;
      return normalizeText(question.text).includes(normalizeText(q)) ||
        String(question.qid).toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const time = new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      if (time) return time;
      return String(a.qid).localeCompare(String(b.qid));
    });
  const counts = await subjectQuestionCounts(store, catalog);
  const result = paged(filtered, body, 20);
  return json({
    ok: true,
    ...result,
    items: result.items.map((question) => ({
      ...question,
      ...questionSet(question),
      subjectName:
        catalog.subjectMap.get(question.subjectId)?.name || question.subjectId,
    })),
    sets: setSummary(questions, catalog),
    counts,
    serverNow: Date.now(),
  });
}

export async function handleAdminQuestionGet({ store, req }) {
  const body = await readJson(req);
  const index = await getJson(store, K.questionIndex(String(body.qid || "")));
  if (!index) throw new HttpError("प्रश्न नहीं मिला", 404);
  const question = await getJson(store, K.questions(index.subjectId, index.qid));
  if (!question) throw new HttpError("प्रश्न नहीं मिला", 404);
  return json({ ok: true, question, serverNow: Date.now() });
}

export async function handleAdminQuestionSave({ store, req }) {
  const body = await readJson(req);
  const input = body.question || {};
  const catalog = await loadCatalog(store, { includeInactive: true });
  let subject =
    catalog.subjectMap.get(clean(body.subjectId || input.subjectId, 40)) ||
    catalog.subjectByName.get(clean(input.subject, 60).toLowerCase()) ||
    catalog.subjectByCode.get(clean(input.subject, 12).toUpperCase());
  if (!subject) throw new HttpError("विषय चुनें", 400);
  const question = validateQuestion(input);
  let qid = question.qid;
  const index = qid ? await getJson(store, K.questionIndex(qid)) : null;
  if (index && index.subjectId !== subject.id) {
    throw new HttpError("यह Question ID पहले से दूसरे विषय में प्रयोग हो रहा है", 409);
  }
  if (index) {
    const old = await getJson(store, K.questions(index.subjectId, qid));
    if (old) question.createdAt = old.createdAt;
  }
  if (!qid) {
    do {
      qid = newQuestionId(subject.code);
    } while (await getJson(store, K.questionIndex(qid)));
  }
  if (!validKey(qid)) throw new HttpError("Question ID गलत है", 400);
  const existingQuestions = await listJson(store, `questions/${subject.id}/`);
  const duplicate = existingQuestions.find(
    (item) => item.qid !== qid && normalizeText(item.text) === normalizeText(question.text)
  );
  if (duplicate) throw new HttpError(`यह प्रश्न पहले से मौजूद है (${duplicate.qid})`, 409);
  const now = new Date().toISOString();
  const previous = index ? await getJson(store, K.questions(index.subjectId, qid)) : {};
  const requestedSetId = clean(input.setId, 80);
  const requestedSetName = clean(input.setName, 120);
  let set = questionSet(previous);
  if (requestedSetName && requestedSetName !== set.setName) {
    set = {
      setId: requestedSetId && requestedSetId !== previous.setId ? requestedSetId : newQuestionSetId(),
      setName: requestedSetName,
      setCreatedAt: now,
    };
  } else if (requestedSetId && requestedSetId !== set.setId) {
    set = { setId: requestedSetId, setName: set.setName, setCreatedAt: now };
  }
  if (!previous.setId && requestedSetId) {
    set = { setId: requestedSetId, setName: requestedSetName || set.setName, setCreatedAt: now };
  }
  if (!set.setCreatedAt) set = { ...set, setCreatedAt: now };
  const record = {
    ...previous,
    ...question,
    ...set,
    qid,
    subjectId: subject.id,
    source: previous.source || "admin",
    createdAt: question.createdAt || now,
    updatedAt: now,
  };
  await putJson(store, K.questions(subject.id, qid), record);
  await putJson(store, K.questionIndex(qid), { qid, subjectId: subject.id });
  await audit(store, index ? "question.update" : "question.create", "admin", {
    qid,
    subjectId: subject.id,
  });
  return json({ ok: true, question: record });
}

export async function handleAdminQuestionDelete({ store, req }) {
  const body = await readJson(req);
  const qid = clean(body.qid, 40);
  const index = await getJson(store, K.questionIndex(qid));
  if (!index) throw new HttpError("प्रश्न नहीं मिला", 404);
  const exams = await listJson(store, "exams/");
  const locked = exams.filter(
    (exam) =>
      (exam.status === "locked" || exam.status === "published") &&
      (exam.questionIds || []).includes(qid)
  );
  if (locked.length) {
    throw new HttpError(
      `यह प्रश्न ${locked.length} Locked/Published परीक्षा में है — पहले वहाँ से हटाएँ`,
      409
    );
  }
  if (body.confirm !== true && body.confirm !== qid) {
    throw new HttpError("प्रश्न हटाने की पुष्टि आवश्यक है", 400);
  }
  for (const exam of exams) {
    if (exam.status === "draft" && (exam.questionIds || []).includes(qid)) {
      exam.questionIds = exam.questionIds.filter((id) => id !== qid);
      exam.totalQuestions = exam.questionIds.length;
      exam.updatedAt = new Date().toISOString();
      await saveExam(store, exam);
    }
  }
  await del(store, K.questions(index.subjectId, qid));
  await del(store, K.questionIndex(qid));
  await audit(store, "question.delete", "admin", { qid, subjectId: index.subjectId });
  return json({ ok: true });
}

export async function handleAdminQuestionsImport({ store, req }) {
  const body = await readJson(req);
  if (!Array.isArray(body.questions)) throw new HttpError("प्रश्न सूची नहीं मिली", 400);
  if (body.questions.length > MAX_IMPORT_ROWS) {
    throw new HttpError(`एक बार में अधिकतम ${MAX_IMPORT_ROWS} प्रश्न आयात कर सकते हैं`, 400);
  }
  const catalog = await loadCatalog(store, { includeInactive: true });
  let exam = null;
  if (body.examId) {
    exam = await getExam(store, String(body.examId));
    if (exam.status === "published") {
      throw new HttpError("Published परीक्षा में नए प्रश्न नहीं जोड़े जा सकते — पहले Unpublish करें", 409);
    }
  }
  const defaults = exam
    ? { marks: exam.marksPerQuestion, negativeMarks: exam.negativeMarks }
    : { marks: 1, negativeMarks: 0 };
  const importSetId = newQuestionSetId();
  const importSetName =
    clean(body.setName, 120) ||
    (exam ? exam.title : `आयात ${new Date().toISOString().slice(0, 10)}`);
  const importSetCreatedAt = new Date().toISOString();
  const errors = [];
  const duplicates = [];
  const added = [];
  const bankBySubject = new Map();
  for (const subject of catalog.subjects) {
    const map = new Map();
    for (const question of await listJson(store, `questions/${subject.id}/`)) {
      map.set(normalizeText(question.text), question.qid);
      map.set(`qid:${question.qid}`, question.qid);
    }
    bankBySubject.set(subject.id, map);
  }
  const uploadTexts = new Set();

  for (let index = 0; index < body.questions.length; index += 1) {
    const row = body.questions[index] || {};
    const rowNumber = index + 2;
    let subject =
      catalog.subjectMap.get(clean(row.subjectId, 40)) ||
      catalog.subjectByName.get(clean(row.subject, 60).toLowerCase()) ||
      catalog.subjectByCode.get(clean(row.subject, 12).toUpperCase()) ||
      catalog.subjectMap.get(clean(body.subjectId, 40));
    if (!subject) {
      errors.push({ row: rowNumber, message: "विषय पहचाना नहीं गया", qid: row.qid || "" });
      continue;
    }
    if (exam && exam.subjectId !== "mixed" && subject.id !== exam.subjectId) {
      errors.push({
        row: rowNumber,
        message: `यह प्रश्न परीक्षा के विषय (${exam.subjectId}) का नहीं है`,
        qid: row.qid || "",
      });
      continue;
    }
    let question;
    try {
      question = validateQuestion(row, defaults);
    } catch (error) {
      errors.push({ row: rowNumber, message: error.message, qid: row.qid || "" });
      continue;
    }
    const bank = bankBySubject.get(subject.id);
    if (question.qid) {
      if (bank.has(`qid:${question.qid}`) || (await getJson(store, K.questionIndex(question.qid)))) {
        duplicates.push({ row: rowNumber, qid: question.qid, reason: "Question ID पहले से मौजूद" });
        continue;
      }
    }
    const textKey = normalizeText(question.text);
    if (bank.has(textKey)) {
      duplicates.push({
        row: rowNumber,
        qid: question.qid || "",
        reason: `यह प्रश्न पहले से मौजूद है (${bank.get(textKey)})`,
      });
      continue;
    }
    if (uploadTexts.has(`${subject.id}:${textKey}`)) {
      duplicates.push({ row: rowNumber, qid: question.qid || "", reason: "फाइल में यह प्रश्न दो बार है" });
      continue;
    }
    uploadTexts.add(`${subject.id}:${textKey}`);
    let qid = question.qid;
    if (!qid) {
      do {
        qid = newQuestionId(subject.code);
      } while (await getJson(store, K.questionIndex(qid)));
    }
    if (!validKey(qid)) {
      errors.push({ row: rowNumber, message: "Question ID गलत है", qid });
      continue;
    }
    const now = new Date().toISOString();
    const record = {
      ...question,
      qid,
      subjectId: subject.id,
      setId: importSetId,
      setName: importSetName,
      setCreatedAt: importSetCreatedAt,
      marks: question.marks === null ? defaults.marks : question.marks,
      negativeMarks:
        question.negativeMarks === null ? defaults.negativeMarks : question.negativeMarks,
      source: "import",
      createdAt: now,
      updatedAt: now,
    };
    await putJson(store, K.questions(subject.id, qid), record);
    await putJson(store, K.questionIndex(qid), { qid, subjectId: subject.id });
    bank.set(textKey, qid);
    bank.set(`qid:${qid}`, qid);
    added.push({ ...record, subjectName: subject.name });
  }

  let examQuestionCount = null;
  if (exam && added.length) {
    const merged = [
      ...new Set([...(exam.questionIds || []), ...added.map((question) => question.qid)]),
    ];
    exam.questionIds = merged;
    exam.totalQuestions = merged.length;
    if (exam.status === "locked") {
      exam.status = "draft";
      exam.paperLockedAt = null;
    }
    exam.updatedAt = new Date().toISOString();
    await saveExam(store, exam);
    examQuestionCount = merged.length;
  }
  await audit(store, "question.import", "admin", {
    added: added.length,
    errors: errors.length,
    duplicates: duplicates.length,
    examId: exam?.id || null,
    setName: importSetName,
  });
  return json({
    ok: true,
    added: added.length,
    errors,
    duplicates,
    total: body.questions.length,
    set: { setId: importSetId, setName: importSetName },
    preview: added.slice(0, 20).map((question) => ({
      qid: question.qid,
      subjectName: question.subjectName,
      text: question.text,
      options: question.options,
      correctIndex: question.correctIndex,
      marks: question.marks,
      negativeMarks: question.negativeMarks,
      explanation: question.explanation,
    })),
    addedQids: added.map((question) => question.qid),
    examQuestionCount,
    serverNow: Date.now(),
  });
}

export async function handleAdminStudents({ store, req }) {
  const body = await readJson(req);
  const catalog = await loadCatalog(store, { includeInactive: true });
  const q = clean(body.q, 80).toLowerCase();
  const students = (await listJson(store, "students/"))
    .filter((student) => {
      if (body.tradeId && student.tradeId !== body.tradeId) return false;
      if (body.active === true && student.active === false) return false;
      if (body.active === false && student.active !== false) return false;
      if (!q) return true;
      return [student.name, student.id, student.mobile, student.email]
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const result = paged(students, body, 20);
  const items = [];
  for (const student of result.items) {
    const count = (await listKeys(store, `idx/student-results/${student.id}/`)).length;
    items.push({
      ...studentSummary(student, catalog.tradeMap.get(student.tradeId)?.name || student.legacyTrade || ""),
      resultCount: count,
      hasPin: Boolean(student.pinHash),
    });
  }
  return json({ ok: true, ...result, items, serverNow: Date.now() });
}

export async function handleAdminStudentGet({ store, req }) {
  const body = await readJson(req);
  const student = await getJson(store, K.students(String(body.studentId || "")));
  if (!student) throw new HttpError("छात्र नहीं मिला", 404);
  const catalog = await loadCatalog(store, { includeInactive: true });
  const results = await allResults(store);
  const own = results.filter((result) => result.studentId === student.id);
  const active = [];
  const attemptKeys = await listKeys(store, `idx/student-attempts/${student.id}/`);
  for (const key of attemptKeys) {
    const attempt = await getJson(store, K.attempt(key.split("/").pop(), student.id));
    if (attempt) {
      const exam = await getJson(store, K.exams(attempt.examId));
      active.push({ ...attempt, examTitle: exam?.title || attempt.examId });
    }
  }
  const { pinHash, passwordHash, ...safeStudent } = student;
  return json({
    ok: true,
    student: {
      ...safeStudent,
      hasPin: Boolean(pinHash),
      tradeName: catalog.tradeMap.get(student.tradeId)?.name || student.legacyTrade || "",
      resultCount: own.length,
      stats: examStatsFromResults(own),
    },
    results: own.map(resultSummary),
    attempts: active.map((attempt) => ({
      attemptId: attempt.attemptId,
      examId: attempt.examId,
      examTitle: attempt.examTitle,
      startedAt: attempt.startedAt,
      endAt: attempt.endAt,
      attempted: Object.keys(attempt.responses || {}).length,
    })),
    serverNow: Date.now(),
  });
}

export async function handleAdminStudentSave({ store, req }) {
  const body = await readJson(req);
  const input = body.student || {};
  const existing = input.id ? await getJson(store, K.students(String(input.id))) : null;
  if (input.id && !existing) throw new HttpError("छात्र नहीं मिला", 404);
  const data = validateStudent({ ...input, consent: true });
  const catalog = await loadCatalog(store, { includeInactive: true });
  if (data.tradeId && !catalog.tradeMap.has(data.tradeId)) {
    throw new HttpError("चुना गया ट्रेड मौजूद नहीं है", 400);
  }
  const holder = data.mobile ? await getJson(store, K.mobileIndex(data.mobile)) : null;
  if (holder && holder.studentId !== existing?.id) {
    throw new HttpError("यह मोबाइल नंबर पहले से किसी छात्र के पास है", 409);
  }
  if (data.citsNumber) {
    const citsHolder = await getJson(store, K.studentCitsIndex(data.citsNumber));
    if (citsHolder && citsHolder.studentId !== existing?.id) {
      throw new HttpError("यह CITS नंबर पहले से किसी छात्र के पास है", 409);
    }
    const duplicateCits = (await listJson(store, "students/")).some(
      (record) => record.id !== existing?.id &&
        (
          String(record.citsNumber || "").toUpperCase() === data.citsNumber ||
          String(record.mobile || "") === data.citsNumber
        )
    );
    if (duplicateCits) throw new HttpError("यह CITS नंबर पहले से किसी छात्र के पास है", 409);
  }
  let id = existing?.id;
  if (!id) {
    id = clean(input.id, 40);
    if (id && !validKey(id)) throw new HttpError("Registration ID गलत है", 400);
    if (id && (await getJson(store, K.students(id)))) throw new HttpError("यह Registration ID मौजूद है", 409);
    if (!id) {
      id = await nextRegistrationId(store);
    }
  }
  const now = new Date().toISOString();
  const student = {
    ...(existing || {}),
    id,
    name: data.name,
    fatherName: data.fatherName,
    mobile: data.mobile,
    citsNumber: data.citsNumber,
    email: data.email,
    tradeId: data.tradeId,
    batch: data.batch,
    photo: Object.prototype.hasOwnProperty.call(input, "photo")
      ? photo(input.photo)
      : existing?.photo || "",
    active: bool(input.active, existing?.active !== false),
    source: existing?.source || "admin",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  if (input.clearPin) {
    delete student.pinHash;
  } else if (String(input.pin || "").trim()) {
    const pin = String(input.pin).trim();
    if (!/^\d{4,8}$/.test(pin)) throw new HttpError("PIN 4 से 8 अंकों का होना चाहिए", 400);
    student.pinHash = await hashPin(pin);
  }
  const ownsMobile = Boolean(existing && holder?.studentId === existing.id);
  const mobileReserved =
    !student.mobile ||
    ownsMobile ||
    (await store.setIfAbsent(K.mobileIndex(student.mobile), {
      studentId: student.id,
    }));
  if (!mobileReserved) {
    throw new HttpError("यह मोबाइल नंबर पहले से किसी छात्र के पास है", 409);
  }
  let citsReserved = false;
  if (data.citsNumber && existing?.citsNumber !== data.citsNumber) {
    citsReserved = await store.setIfAbsent(K.studentCitsIndex(data.citsNumber), {
      studentId: student.id,
    });
    if (!citsReserved) {
      if (!ownsMobile && student.mobile) await del(store, K.mobileIndex(student.mobile));
      throw new HttpError("यह CITS नंबर पहले से किसी छात्र के पास है", 409);
    }
  }
  try {
    await putJson(store, K.students(id), student);
  } catch (error) {
    if (!ownsMobile && student.mobile) await del(store, K.mobileIndex(student.mobile));
    if (citsReserved) await del(store, K.studentCitsIndex(data.citsNumber));
    throw error;
  }
  if (existing?.mobile && existing.mobile !== student.mobile) {
    await del(store, K.mobileIndex(existing.mobile));
  }
  if (existing?.citsNumber && existing.citsNumber !== student.citsNumber) {
    await del(store, K.studentCitsIndex(existing.citsNumber));
  }
  if (student.citsNumber && existing?.citsNumber === student.citsNumber &&
      !(await getJson(store, K.studentCitsIndex(student.citsNumber)))) {
    await store.setIfAbsent(K.studentCitsIndex(student.citsNumber), { studentId: student.id });
  }
  await audit(store, existing ? "student.update" : "student.create", "admin", { studentId: id });
  const { pinHash, passwordHash, ...safeStudent } = student;
  return json({
    ok: true,
    student: studentSummary({ ...safeStudent, photo: student.photo }, ""),
    hasPin: Boolean(pinHash),
  });
}

export async function handleAdminStudentStatus({ store, req }) {
  const body = await readJson(req);
  const student = await getJson(store, K.students(String(body.studentId || "")));
  if (!student) throw new HttpError("छात्र नहीं मिला", 404);
  student.active = bool(body.active, student.active !== false);
  student.updatedAt = new Date().toISOString();
  await putJson(store, K.students(student.id), student);
  await audit(store, "student.status", "admin", { studentId: student.id, active: student.active });
  return json({ ok: true, active: student.active, serverNow: Date.now() });
}

export async function handleAdminStudentDelete({ store, req }) {
  const body = await readJson(req);
  const student = await getJson(store, K.students(String(body.studentId || "")));
  if (!student) throw new HttpError("छात्र नहीं मिला", 404);
  if (clean(body.confirm, 40) !== student.id) {
    throw new HttpError("पुष्टि के लिए Registration ID टाइप करें", 400);
  }
  const resultKeys = await listKeys(store, `idx/student-results/${student.id}/`);
  const attemptKeys = await listKeys(store, `idx/student-attempts/${student.id}/`);
  if ((resultKeys.length || attemptKeys.length) && body.deleteResults !== true) {
    throw new HttpError(
      "इस छात्र के परिणाम/सक्रिय प्रयास मौजूद हैं। सुरक्षित रखने के लिए छात्र को निष्क्रिय करें, या Delete Results अलग से चुनें।",
      409
    );
  }
  if (body.deleteResults === true) {
    for (const key of attemptKeys) {
      await finalizeIfActive(store, key.split("/").pop(), student);
    }
    const freshResultKeys = await listKeys(store, `idx/student-results/${student.id}/`);
    const entries = (await Promise.all(freshResultKeys.map((key) => getJson(store, key)))).filter(Boolean);
    for (const entry of entries) {
      await del(store, K.result(entry.resultId));
      await del(store, K.examResultIndex(entry.examId, entry.resultId));
    }
    await deleteKeys(store, freshResultKeys);
  }
  for (const key of attemptKeys) {
    const examId = key.split("/").pop();
    await del(store, K.attempt(examId, student.id));
    await del(store, K.attemptExamIndex(examId, student.id));
  }
  if (student.mobile) await del(store, K.mobileIndex(student.mobile));
  if (student.citsNumber) await del(store, K.studentCitsIndex(student.citsNumber));
  await del(store, K.students(student.id));
  await audit(store, "student.delete", "admin", {
    studentId: student.id,
    deletedResults: body.deleteResults === true,
  });
  return json({ ok: true });
}

async function finalizeIfActive(store, examId, student) {
  const exam = await getJson(store, K.exams(examId));
  const attempt = await getJson(store, K.attempt(examId, student.id));
  if (exam && attempt && attempt.status === "active") {
    await finalizeAttempt({ store, exam, attempt, student, autoSubmitted: true });
  }
}

export async function handleAdminAttemptFinalize({ store, req }) {
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  const student = await getJson(store, K.students(String(body.studentId || "")));
  if (!student) throw new HttpError("छात्र नहीं मिला", 404);
  const attempt = await getJson(store, K.attempt(exam.id, student.id));
  if (!attempt) throw new HttpError("सक्रिय प्रयास नहीं मिला", 404);
  const result = await finalizeAttempt({ store, exam, attempt, student, autoSubmitted: true });
  await audit(store, "attempt.finalize", "admin", {
    examId: exam.id,
    studentId: student.id,
    resultId: result.resultId,
  });
  return json({ ok: true, result: resultSummary(result), serverNow: Date.now() });
}

export async function handleAdminResults({ store, req }) {
  const body = await readJson(req);
  const catalog = await loadCatalog(store, { includeInactive: true });
  const filtered = filterResults(await allResults(store), body);
  const result = paged(filtered, body, 20);
  const items = result.items.map((row) => ({
    ...resultSummary(row),
    subjectName:
      row.subjectId === "mixed"
        ? "Mixed"
        : catalog.subjectMap.get(row.subjectId)?.name || row.subjectId,
    tradeName: catalog.tradeMap.get(row.tradeId)?.name || "",
  }));
  const merit = filtered
    .filter((row) => row.examType !== "practice")
    .sort((a, b) => {
      const percentage = (Number(b.percentage) || 0) - (Number(a.percentage) || 0);
      if (percentage) return percentage;
      return (Number(b.obtained) || 0) - (Number(a.obtained) || 0);
    })
    .slice(0, 10)
    .map((row, index) => ({
      rank: index + 1,
      resultId: row.resultId,
      studentName: row.studentName,
      regId: row.regId,
      examTitle: row.examTitle,
      examCode: row.examCode,
      tradeName: catalog.tradeMap.get(row.tradeId)?.name || "",
      obtained: row.obtained,
      maxMarks: row.maxMarks,
      percentage: row.percentage,
      pass: Boolean(row.pass),
      submittedAt: row.submittedAt,
    }));
  return json({
    ok: true,
    ...result,
    items,
    merit,
    stats: examStatsFromResults(
      filtered.filter((row) => row.examType !== "practice")
    ),
    serverNow: Date.now(),
  });
}

export async function handleAdminLive({ store, env }) {
  const [attempts, exams, students, catalog] = await Promise.all([
    listJson(store, "attempts/"),
    listJson(store, "exams/"),
    listJson(store, "students/"),
    loadCatalog(store, { includeInactive: true }),
  ]);
  const now = Date.now();
  const examMap = new Map(exams.map((exam) => [exam.id, exam]));
  const studentMap = new Map(students.map((student) => [student.id, student]));
  const items = attempts
    .filter((attempt) => attempt && attempt.status === "active")
    .map((attempt) => {
      const exam = examMap.get(attempt.examId);
      const student = studentMap.get(attempt.studentId);
      const totalQuestions = Number(exam?.totalQuestions) || (exam?.questionIds || []).length || 0;
      const answered = Object.keys(attempt.responses || {}).length;
      const endAt = Number(attempt.endAt) || 0;
      return {
        attemptId: attempt.attemptId,
        examId: attempt.examId,
        examTitle: exam?.title || attempt.examId,
        examCode: exam?.code || "",
        examType: exam?.examType || "final",
        studentId: attempt.studentId,
        studentName: student?.name || attempt.studentId,
        regId: student?.regId || "",
        tradeName: catalog.tradeMap.get(exam?.tradeId)?.name || "",
        answered,
        marked: Array.isArray(attempt.marked) ? attempt.marked.length : 0,
        totalQuestions,
        startedAt: attempt.startedAt,
        lastSeenAt: attempt.updatedAt || attempt.startedAt,
        endAt,
        remainingSec: Math.max(0, Math.floor((endAt - now) / 1000)),
        expired: endAt > 0 && endAt <= now,
        ip: attempt.ip || "",
      };
    })
    .sort((a, b) => {
      if (a.expired !== b.expired) return a.expired ? 1 : -1;
      return (Date.parse(b.lastSeenAt) || 0) - (Date.parse(a.lastSeenAt) || 0);
    });
  return json({
    ok: true,
    items,
    active: items.filter((item) => !item.expired).length,
    expired: items.filter((item) => item.expired).length,
    serverNow: now,
  });
}

export async function handleAdminResultGet({ store, req }) {
  const body = await readJson(req);
  const result = await getJson(store, K.result(String(body.resultId || "")));
  if (!result) throw new HttpError("परिणाम नहीं मिला", 404);
  const [exam, student, catalog] = await Promise.all([
    getJson(store, K.exams(result.examId)),
    getJson(store, K.students(result.studentId)),
    loadCatalog(store, { includeInactive: true }),
  ]);
  return json({
    ok: true,
    result: resultDetail(result, exam, { includeAnswers: true, forceAll: true }),
    exam: exam
      ? {
          ...exam,
          subjectName:
            exam.subjectId === "mixed"
              ? "Mixed"
              : catalog.subjectMap.get(exam.subjectId)?.name || exam.subjectId,
          tradeName: catalog.tradeMap.get(exam.tradeId)?.name || "",
        }
      : null,
    student: student ? studentSummary(student, "") : null,
    serverNow: Date.now(),
  });
}

function resultRowsForCsv(results, catalog, mobileMap) {
  const header = [
    "Student Name",
    "Registration ID",
    "Mobile",
    "Trade",
    "Subject",
    "Exam Name",
    "Exam Code",
    "Exam Type",
    "Exam Date",
    "Total Questions",
    "Attempted",
    "Correct",
    "Wrong",
    "Unattempted",
    "Obtained Marks",
    "Maximum Marks",
    "Percentage",
    "Pass/Fail",
    "Time Taken (sec)",
    "Result ID",
    "Attempt ID",
    "Auto Submitted",
  ];
  const rows = results.map((result) => [
    result.studentName,
    result.regId,
    mobileMap.get(result.studentId) || "",
    catalog.tradeMap.get(result.tradeId)?.name || result.tradeId,
    result.subjectId === "mixed"
      ? "Mixed"
      : catalog.subjectMap.get(result.subjectId)?.name || result.subjectId,
    result.examTitle,
    result.examCode,
    result.examType === "practice" ? "Practice" : "Final",
    result.submittedAt,
    result.totalQuestions,
    result.attempted,
    result.correct,
    result.wrong,
    result.unattempted,
    result.obtained,
    result.maxMarks,
    result.percentage,
    result.pass ? "Pass" : "Fail",
    result.timeTakenSec,
    result.resultId,
    result.attemptId,
    result.autoSubmitted ? "Yes" : "No",
  ]);
  return [header, ...rows];
}

export async function handleAdminResultsCsv({ store, req }) {
  const body = await readJson(req);
  const catalog = await loadCatalog(store, { includeInactive: true });
  const filtered = filterResults(await allResults(store), body);
  const students = await listJson(store, "students/");
  const mobileMap = new Map(students.map((student) => [student.id, student.mobile]));
  const rows = resultRowsForCsv(filtered, catalog, mobileMap);
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return csvResponse(csv(rows), `chnm-results-${stamp}.csv`);
}

export async function handleAdminStats({ store }) {
  const catalog = await loadCatalog(store, { includeInactive: true });
  const results = await allResults(store);
  const finalResults = results.filter((result) => result.examType !== "practice");
  const practiceResults = results.filter((result) => result.examType === "practice");
  const byExam = new Map();
  const bySubject = new Map();
  const byTrade = new Map();
  for (const result of finalResults) {
    if (!byExam.has(result.examId)) {
      byExam.set(result.examId, { examId: result.examId, examTitle: result.examTitle, results: [] });
    }
    byExam.get(result.examId).results.push(result);
    bySubject.set(result.subjectId, [...(bySubject.get(result.subjectId) || []), result]);
    byTrade.set(result.tradeId || "", [...(byTrade.get(result.tradeId || "") || []), result]);
  }
  return json({
    ok: true,
    overall: examStatsFromResults(finalResults),
    practice: examStatsFromResults(practiceResults),
    exams: [...byExam.values()]
      .map((entry) => ({
        examId: entry.examId,
        examTitle: entry.examTitle,
        ...examStatsFromResults(entry.results),
      }))
      .sort((a, b) => b.count - a.count),
    subjects: [...bySubject.entries()].map(([subjectId, rows]) => ({
      subjectId,
      subjectName:
        subjectId === "mixed" ? "Mixed" : catalog.subjectMap.get(subjectId)?.name || subjectId,
      ...examStatsFromResults(rows),
    })),
    trades: [...byTrade.entries()].map(([tradeId, rows]) => ({
      tradeId,
      tradeName: catalog.tradeMap.get(tradeId)?.name || tradeId || "अन्य",
      ...examStatsFromResults(rows),
    })),
    students: (await listJson(store, "students/")).length,
    activeAttempts: (await listKeys(store, "idx/exam-attempts/")).length,
    serverNow: Date.now(),
  });
}

export async function handleAdminSettingsSave({ store, req }) {
  const body = await readJson(req);
  const input = body.settings || {};
  const current = (await getJson(store, K.settings())) || DEFAULT_SETTINGS;
  const siteName = clean(input.siteName, 80) || current.siteName;
  const groupName =
    clean(input.groupName ?? input.collegeName, 80) ||
    current.groupName ||
    current.collegeName;
  const passPct = input.defaultPassPct === undefined ? current.defaultPassPct : number(input.defaultPassPct, current.defaultPassPct);
  if (!Number.isFinite(passPct) || passPct < 0 || passPct > 100) {
    throw new HttpError("डिफ़ॉल्ट पास प्रतिशत 0-100 के बीच होना चाहिए", 400);
  }
  const duration = input.defaultDurationMin === undefined ? current.defaultDurationMin : int(input.defaultDurationMin, current.defaultDurationMin);
  if (duration < 1 || duration > 300) throw new HttpError("डिफ़ॉल्ट अवधि 1-300 मिनट होनी चाहिए", 400);
  const maxPhotoKb = input.maxPhotoKb === undefined ? current.maxPhotoKb || 200 : int(input.maxPhotoKb, 200);
  if (maxPhotoKb < 50 || maxPhotoKb > 1000) {
    throw new HttpError("फोटो सीमा 50-1000 KB के बीच होनी चाहिए", 400);
  }
  const settings = {
    ...current,
    siteName,
    collegeName: groupName,
    groupName,
    registrationOpen: bool(input.registrationOpen, current.registrationOpen !== false),
    defaultPassPct: Math.round(passPct * 100) / 100,
    defaultDurationMin: duration,
    defaultInstructions: clean(input.defaultInstructions, 5000, true) || current.defaultInstructions,
    defaultInstructionsEn: clean(input.defaultInstructionsEn, 5000, true) || current.defaultInstructionsEn,
    resultsReleaseDefault: bool(input.resultsReleaseDefault, current.resultsReleaseDefault),
    showAnswersDefault: bool(input.showAnswersDefault, current.showAnswersDefault),
    maxPhotoKb,
    updatedAt: new Date().toISOString(),
  };
  await putJson(store, K.settings(), settings);
  await audit(store, "settings.update", "admin", {});
  return json({ ok: true, settings: settingsView(settings) });
}

export async function handleAdminAudit({ store, req }) {
  const body = await readJson(req);
  const limit = Math.max(1, Math.min(200, int(body.limit, 100)));
  return json({ ok: true, entries: await recentAudit(store, limit), serverNow: Date.now() });
}

export async function handleAdminLegacyPreview({ env }) {
  if (env?.DB && !env?.LEGACY_DB) {
    throw new HttpError("Cloudflare पर पुराने Netlify डेटा के लिए सुरक्षित backup import करें", 501);
  }
  return json({ ok: true, legacy: await legacyPreview(env) });
}

export async function handleAdminLegacyImport({ store, env }) {
  if (env?.DB && !env?.LEGACY_DB) {
    throw new HttpError("Cloudflare पर पुराने Netlify डेटा के लिए सुरक्षित backup import करें", 501);
  }
  const report = await importLegacyData(store, env);
  await audit(store, "legacy.import", "admin", {
    students: report.students.imported,
    results: report.results.imported,
  });
  return json({ ok: true, report, serverNow: Date.now() });
}

export async function handleAdminExport({ store }) {
  const catalog = await loadCatalog(store, { includeInactive: true });
  const [students, exams, results, settings, subjects, trades, notices, chat] = await Promise.all([
    listJson(store, "students/"),
    listJson(store, "exams/"),
    allResults(store),
    getJson(store, K.settings()),
    listJson(store, "subjects/"),
    listJson(store, "trades/"),
    listJson(store, "notices/"),
    listJson(store, "chat/"),
  ]);
  const papers = [];
  for (const exam of exams) {
    for (const key of await listKeys(store, `papers/${exam.id}/`)) {
      const paper = await getJson(store, key);
      if (paper) papers.push(paper);
    }
  }
  const questions = [];
  for (const subject of catalog.subjects) {
    for (const question of await listJson(store, `questions/${subject.id}/`)) questions.push(question);
  }
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 2,
    settings,
    subjects,
    trades,
    exams,
    papers,
    questions,
    students: students.map((student) => {
      const { passwordHash, pinHash, ...safeStudent } = student;
      return safeStudent;
    }),
    results,
    notices,
    chat,
  };
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="chnm-data-${stamp}.json"`,
      "cache-control": "no-store",
    },
  });
}
