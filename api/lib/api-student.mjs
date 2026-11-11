import { K, getJson, putJson, listJson } from "./db.mjs";
import { HttpError, json, readJson, getIp } from "./http.mjs";
import { int } from "./validate.mjs";
import { rateLimit, audit } from "./auth.mjs";
import {
  examSummary,
  resultDetail,
  resultSummary,
  redactUnreleased,
  studentSelf,
} from "./serializers.mjs";
import {
  answersReleased,
  availability,
  examStartEnd,
  finalizeAttempt,
  finalizeExpiredForStudent,
  resultsReleased,
  sanitizeAttempt,
  sanitizePaperForStudent,
} from "./scoring.mjs";
import {
  countAttempts,
  getExam,
  getPaper,
  loadCatalog,
  resultForExam,
  studentResults,
} from "./domain.mjs";

function newAttemptId() {
  const bytes = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
  return `ATT-${bytes}`;
}

function studentCanSee(exam, student) {
  if (!exam.tradeId) return true;
  if (!student.tradeId) return true;
  return exam.tradeId === student.tradeId;
}

function sanitizeResponses(paper, responses) {
  const output = {};
  if (!responses || typeof responses !== "object") return output;
  for (const question of paper.questions) {
    const value = responses[question.qid];
    if (Number.isInteger(value) && value >= 0 && value < question.options.length) {
      output[question.qid] = value;
    }
  }
  return output;
}

function sanitizeQidList(paper, list) {
  if (!Array.isArray(list)) return [];
  const valid = new Set(paper.questions.map((question) => question.qid));
  return [...new Set(list.map((item) => String(item || "")).filter((item) => valid.has(item)))].slice(
    0,
    paper.questions.length
  );
}

async function paperForAttempt(store, exam, attempt) {
  const paper = await getPaper(store, exam.id, attempt.paperVersion);
  if (!paper) throw new HttpError("परीक्षा का पेपर नहीं मिला — एडमिन से संपर्क करें", 500);
  return paper;
}

async function buildExamEntry(store, exam, catalog, result, attempt, student) {
  const subjectName =
    exam.subjectId === "mixed"
      ? "Mixed"
      : catalog.subjectMap.get(exam.subjectId)?.name || exam.subjectId;
  const tradeName = catalog.tradeMap.get(exam.tradeId)?.name || "";
  const entry = examSummary(exam, subjectName, tradeName, { result });
  entry.subjectName = subjectName;
  entry.tradeName = tradeName;
  entry.attemptInProgress = Boolean(attempt);
  entry.attemptStartedAt = attempt?.startedAt || null;
  entry.attemptEndAt = attempt?.endAt || null;
  const attemptsUsed = (await countAttempts(store, student.id, exam.id)) || 0;
  entry.attemptsUsed = attemptsUsed;
  entry.attemptsAllowed = exam.attemptsAllowed || 1;
  entry.eligible = studentCanSee(exam, student);
  return entry;
}

async function findActiveAttempts(store, studentId) {
  const exams = await listJson(store, "exams/");
  const attempts = [];
  for (const exam of exams) {
    const attempt = await getJson(store, K.attempt(exam.id, studentId));
    if (attempt && attempt.status === "active") attempts.push(attempt);
  }
  return attempts;
}

export async function handleStudentDashboard({ store, student }) {
  await finalizeExpiredForStudent(store, student.id);
  const catalog = await loadCatalog(store);
  const allExams = await listJson(store, "exams/");
  const examById = new Map(allExams.map((exam) => [exam.id, exam]));
  const exams = allExams.filter(
    (exam) => exam.status === "published" && exam.active !== false && studentCanSee(exam, student)
  );
  const results = await studentResults(store, student.id);
  const resultByExam = new Map();
  for (const result of results) {
    const key = `${result.examId}:${result.examType}`;
    if (!resultByExam.has(key)) resultByExam.set(key, result);
  }

  const active = await findActiveAttempts(store, student.id);
  const attemptByExam = new Map(active.map((attempt) => [attempt.examId, attempt]));

  const available = [];
  const upcoming = [];
  const closed = [];
  const practice = [];
  const completed = [];

  for (const exam of exams) {
    const result = resultByExam.get(`${exam.id}:${exam.type}`) || null;
    const attempt = attemptByExam.get(exam.id) || null;
    const entry = await buildExamEntry(store, exam, catalog, result, attempt, student);
    if (result) {
      completed.push(entry);
      continue;
    }
    if (exam.type === "practice") {
      practice.push(entry);
      continue;
    }
    const state = availability(exam);
    if (state.state === "upcoming") upcoming.push(entry);
    else if (state.state === "closed") closed.push(entry);
    else available.push(entry);
  }

  const resultEntries = results.map((result) => {
    const exam = examById.get(result.examId) || null;
    const released =
      result.examType === "practice" || (exam ? resultsReleased(exam) : false);
    const base = released ? resultSummary(result) : redactUnreleased(result, exam);
    return {
      ...base,
      examTitle: result.examTitle,
      subjectName:
        result.subjectId === "mixed"
          ? "Mixed"
          : catalog.subjectMap.get(result.subjectId)?.name || result.subjectId,
      tradeName: catalog.tradeMap.get(result.tradeId)?.name || "",
      resultReleased: released,
      answersReleased: result.examType === "practice" ? true : released,
      pending: !released,
      legacy: Boolean(result.legacy),
    };
  });

  const preparing = allExams
    .filter(
      (exam) =>
        (exam.status === "draft" || exam.status === "locked") &&
        exam.active !== false &&
        studentCanSee(exam, student)
    )
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .map((exam) => ({
      id: exam.id,
      title: exam.title,
      code: exam.code,
      type: exam.type,
      status: exam.status,
      subjectName:
        exam.subjectId === "mixed"
          ? "Mixed"
          : catalog.subjectMap.get(exam.subjectId)?.name || exam.subjectId,
      tradeName: catalog.tradeMap.get(exam.tradeId)?.name || "",
      durationMin: exam.durationMin,
      passPct: exam.passPct,
      totalQuestions: Array.isArray(exam.questionIds) ? exam.questionIds.length : 0,
      marksPerQuestion: exam.marksPerQuestion,
      startAt: exam.startAt || null,
      updatedAt: exam.updatedAt || exam.createdAt || null,
      preparing: true,
    }));

  return json({
    ok: true,
    student: studentSelf(student),
    exams: available,
    practice,
    upcoming,
    preparing,
    closed,
    completed,
    results: resultEntries,
    serverNow: Date.now(),
  });
}

const EXAM_SECURITY_EVENTS = new Set([
  "visibility_hidden",
  "fullscreen_exit",
  "fullscreen_enter_failed",
]);

export async function handleStudentExamEvent({ req, store, student }) {
  const body = await readJson(req);
  const examId = String(body.examId || "").trim().slice(0, 60);
  const event = String(body.event || "");
  if (!examId || !EXAM_SECURITY_EVENTS.has(event)) {
    throw new HttpError("परीक्षा सुरक्षा घटना अमान्य है", 400);
  }
  await rateLimit(store, "exam-event", student.id, 30, 60 * 1000);
  const [exam, attempt] = await Promise.all([
    getJson(store, K.exams(examId)),
    getJson(store, K.attempt(examId, student.id)),
  ]);
  if (!exam || !attempt || attempt.status !== "active") {
    throw new HttpError("सक्रिय परीक्षा प्रयास नहीं मिला", 404);
  }
  await audit(store, `exam.security.${event}`, student.id, { examId });
  return json({ ok: true });
}

export async function handleStudentExamGet({ store, student, req }) {
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  const catalog = await loadCatalog(store);
  await finalizeExpiredForStudent(store, student.id);
  const attempt = await getJson(store, K.attempt(exam.id, student.id));
  const result = await resultForExam(store, student.id, exam);
  if (exam.status !== "published" && exam.active === false && !result && !attempt) {
    throw new HttpError("यह परीक्षा उपलब्ध नहीं है", 403);
  }
  if (!studentCanSee(exam, student)) throw new HttpError("यह परीक्षा आपके ट्रेड के लिए नहीं है", 403);

  let paper = null;
  if (attempt) {
    paper = await paperForAttempt(store, exam, attempt);
  }
  const entry = await buildExamEntry(store, exam, catalog, result, attempt, student);
  return json({
    ok: true,
    exam: entry,
    attempt: attempt ? sanitizeAttempt(attempt) : null,
    paper: paper ? sanitizePaperForStudent(paper) : null,
    result: result ? redactUnreleased(result, exam) : null,
    serverNow: Date.now(),
  });
}

export async function handleStudentStart({ store, student, req, ctx }) {
  const ip = getIp(req, ctx);
  await rateLimit(store, "exam-start", `${student.id}:${ip}`, 30, 15 * 60 * 1000);
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  if (!studentCanSee(exam, student)) throw new HttpError("यह परीक्षा आपके ट्रेड के लिए नहीं है", 403);

  await finalizeExpiredForStudent(store, student.id);
  const state = availability(exam);
  if (!state.canStart) throw new HttpError(state.reason, 403);

  const existing = await getJson(store, K.attempt(exam.id, student.id));
  if (existing && existing.status === "active") {
    const paper = await paperForAttempt(store, exam, existing);
    const catalog = await loadCatalog(store);
    return json({
      ok: true,
      resumed: true,
      exam: await buildExamEntry(store, exam, catalog, null, existing, student),
      attempt: sanitizeAttempt(existing),
      paper: sanitizePaperForStudent(paper),
      serverNow: Date.now(),
    });
  }

  const used = await countAttempts(store, student.id, exam.id);
  const allowed = exam.attemptsAllowed || 1;
  if (used >= allowed) {
    throw new HttpError(
      used > 0 ? "आप यह परीक्षा पहले ही दे चुके हैं" : "इस परीक्षा के सभी प्रयास पूरे हो गए हैं",
      409
    );
  }

  const paper = await getPaper(store, exam.id, exam.paperVersion);
  if (!paper || !paper.questions?.length) {
    throw new HttpError("इस परीक्षा का पेपर तैयार नहीं है", 409);
  }
  const { startedAt, endAt } = examStartEnd(exam);
  if (endAt <= Date.now()) throw new HttpError("परीक्षा की समय-सीमा समाप्त हो गई है", 403);

  const attempt = {
    attemptId: newAttemptId(),
    examId: exam.id,
    studentId: student.id,
    paperVersion: exam.paperVersion,
    startedAt,
    endAt,
    status: "active",
    responses: {},
    marked: [],
    visited: [],
    current: 0,
    seq: 1,
    ip,
    createdAt: new Date(startedAt).toISOString(),
    updatedAt: new Date(startedAt).toISOString(),
  };
  await putJson(store, K.attempt(exam.id, student.id), attempt);
  await putJson(store, K.attemptIndex(student.id, exam.id), {
    examId: exam.id,
    attemptId: attempt.attemptId,
    startedAt,
  });
  await putJson(store, K.attemptExamIndex(exam.id, student.id), {
    studentId: student.id,
    attemptId: attempt.attemptId,
    startedAt,
  });

  // Two concurrent starts can both write; the last write wins. Re-read so both
  // requests continue on the record that actually persisted.
  const stored = await getJson(store, K.attempt(exam.id, student.id));
  const active = stored || attempt;
  const storedPaper = await paperForAttempt(store, exam, active);
  const catalog = await loadCatalog(store);
  await audit(store, "exam.start", student.id, { examId: exam.id, attemptId: active.attemptId });
  return json({
    ok: true,
    resumed: false,
    exam: await buildExamEntry(store, exam, catalog, null, active, student),
    attempt: sanitizeAttempt(active),
    paper: sanitizePaperForStudent(storedPaper),
    serverNow: Date.now(),
  });
}

export async function handleStudentAutosave({ store, student, req }) {
  await rateLimit(store, "autosave", student.id, 90, 60 * 1000);
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  const attemptId = String(body.attemptId || "");
  const attempt = await getJson(store, K.attempt(exam.id, student.id));

  if (!attempt) {
    const existing = await resultForExam(store, student.id, exam);
    if (existing) {
      return json({ ok: true, submitted: true, resultId: existing.resultId, serverNow: Date.now() });
    }
    throw new HttpError("सक्रिय परीक्षा नहीं मिली", 409);
  }
  if (attempt.attemptId !== attemptId) {
    throw new HttpError("परीक्षा सत्र बदल चुका है — पेज रीफ़्रेश करें", 409);
  }
  if (Date.now() > Number(attempt.endAt) + 3000) {
    const result = await finalizeAttempt({
      store,
      exam,
      attempt,
      student,
      autoSubmitted: true,
    });
    return json({
      ok: true,
      expired: true,
      submitted: true,
      resultId: result.resultId,
      serverNow: Date.now(),
    });
  }
  const paper = await paperForAttempt(store, exam, attempt);
  const seq = int(body.seq, 0);
  if (seq > Number(attempt.seq || 0)) {
    attempt.responses = sanitizeResponses(paper, body.responses);
    attempt.marked = sanitizeQidList(paper, body.marked);
    attempt.visited = sanitizeQidList(paper, body.visited);
    attempt.current = Math.max(
      0,
      Math.min(paper.questions.length - 1, int(body.current, attempt.current || 0))
    );
    attempt.seq = seq;
    attempt.updatedAt = new Date().toISOString();
    await putJson(store, K.attempt(exam.id, student.id), attempt);
    await putJson(store, K.attemptExamIndex(exam.id, student.id), {
      studentId: student.id,
      attemptId: attempt.attemptId,
      startedAt: attempt.startedAt,
    });
  }
  return json({
    ok: true,
    savedSeq: attempt.seq,
    ignored: seq <= Number(attempt.seq || 0),
    endAt: attempt.endAt,
    serverNow: Date.now(),
  });
}

export async function handleStudentSubmit({ store, student, req }) {
  await rateLimit(store, "submit", student.id, 10, 60 * 1000);
  const body = await readJson(req);
  if (body.confirm !== true) throw new HttpError("अंतिम सबमिट की पुष्टि आवश्यक है", 400);
  const exam = await getExam(store, String(body.examId || ""));
  const attempt = await getJson(store, K.attempt(exam.id, student.id));

  if (!attempt) {
    const existing = await resultForExam(store, student.id, exam);
    if (existing) {
      return json({
        ok: true,
        duplicate: true,
        resultId: existing.resultId,
        result: redactUnreleased(existing, exam),
        serverNow: Date.now(),
      });
    }
    throw new HttpError("सक्रिय परीक्षा नहीं मिली", 409);
  }
  if (attempt.attemptId !== String(body.attemptId || "")) {
    throw new HttpError("परीक्षा सत्र बदल चुका है — पेज रीफ़्रेश करें", 409);
  }
  const withinTime = Date.now() <= Number(attempt.endAt) + 5000;
  if (withinTime) {
    const paper = await paperForAttempt(store, exam, attempt);
    const incomingSeq = int(body.seq, 0);
    if (incomingSeq >= Number(attempt.seq || 0)) {
      attempt.responses = sanitizeResponses(paper, body.responses);
      attempt.marked = sanitizeQidList(paper, body.marked);
      attempt.visited = sanitizeQidList(paper, body.visited);
      attempt.current = Math.max(
        0,
        Math.min(paper.questions.length - 1, int(body.current, attempt.current || 0))
      );
      attempt.seq = incomingSeq;
    }
  }
  const result = await finalizeAttempt({
    store,
    exam,
    attempt,
    student,
    autoSubmitted: !withinTime,
  });
  await audit(store, "exam.submit", student.id, {
    examId: exam.id,
    attemptId: attempt.attemptId,
    resultId: result.resultId,
  });
  return json({
    ok: true,
    resultId: result.resultId,
    result: redactUnreleased(result, exam),
    serverNow: Date.now(),
  });
}

export async function handleStudentResultGet({ store, student, req }) {
  const body = await readJson(req);
  const result = await getJson(store, K.result(String(body.resultId || "")));
  if (!result || result.studentId !== student.id) {
    throw new HttpError("परिणाम नहीं मिला", 404);
  }
  const exam = await getJson(store, K.exams(result.examId));
  const allowAnswers =
    result.examType === "practice" || (exam ? answersReleased(exam) : false);
  const released =
    result.examType === "practice" || (exam ? resultsReleased(exam) : false);
  if (!released) {
    return json({ ok: true, pending: true, result: redactUnreleased(result, exam), serverNow: Date.now() });
  }
  const detail = resultDetail(result, exam, { includeAnswers: allowAnswers });
  if (allowAnswers && Array.isArray(detail.answers) && detail.answers.length) {
    const catalog = await loadCatalog(store);
    const groups = new Map();
    for (const answer of detail.answers) {
      const subjectId = answer.subjectId || result.subjectId || "mixed";
      let group = groups.get(subjectId);
      if (!group) {
        group = {
          subjectId,
          subjectName:
            subjectId === "mixed"
              ? "Mixed"
              : catalog.subjectMap.get(subjectId)?.name || subjectId,
          total: 0,
          correct: 0,
          wrong: 0,
          unattempted: 0,
        };
        groups.set(subjectId, group);
      }
      group.total += 1;
      if (answer.selected === null || answer.selected === undefined) group.unattempted += 1;
      else if (answer.correct) group.correct += 1;
      else group.wrong += 1;
    }
    detail.studyPlan = [...groups.values()]
      .map((group) => {
        const percentage = group.total
          ? Math.round((group.correct / group.total) * 10000) / 100
          : 0;
        return {
          ...group,
          percentage,
          weak: percentage < 70,
          studyHref: group.subjectId === "trade-theory" ? "../study/index.html" : "",
        };
      })
      .sort((a, b) => a.percentage - b.percentage);
  }
  return json({
    ok: true,
    result: detail,
    answersReleased: allowAnswers,
    serverNow: Date.now(),
  });
}

export async function handleStudentResults({ store, student }) {
  const results = await studentResults(store, student.id);
  const catalog = await loadCatalog(store);
  const items = [];
  for (const result of results) {
    const exam = await getJson(store, K.exams(result.examId));
    const released =
      result.examType === "practice" || Boolean(exam && resultsReleased(exam));
    const summary = released ? resultSummary(result) : redactUnreleased(result, exam);
    items.push({
      ...summary,
      subjectName:
        result.subjectId === "mixed"
          ? "Mixed"
          : catalog.subjectMap.get(result.subjectId)?.name || result.subjectId,
      resultReleased: released,
      answersReleased:
        result.examType === "practice"
          ? true
          : Boolean(exam && released && answersReleased(exam)),
      pending: !released,
      legacy: Boolean(result.legacy),
    });
  }
  return json({ ok: true, results: items, serverNow: Date.now() });
}

export async function handleStudentResultDelete() {
  throw new HttpError("विद्यार्थी अपना परिणाम नहीं हटा सकते", 403);
}

export async function handleStudentExamPaper({ store, student, req }) {
  const body = await readJson(req);
  const exam = await getExam(store, String(body.examId || ""));
  const attempt = await getJson(store, K.attempt(exam.id, student.id));
  if (!attempt) throw new HttpError("सक्रिय परीक्षा नहीं मिली", 404);
  const paper = await paperForAttempt(store, exam, attempt);
  return json({ ok: true, paper: sanitizePaperForStudent(paper), attempt: sanitizeAttempt(attempt) });
}
