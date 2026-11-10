import crypto from "node:crypto";
import { K, getJson, putJson, listJson, listKeys, mapLimit } from "./db.mjs";
import { HttpError } from "./http.mjs";

// D1 and memory stores allocate sequential IDs atomically. Stores without an
// atomic counter use a random suffix so simultaneous registrations cannot
// overwrite one another.
export async function nextRegistrationId(store) {
  if (typeof store.nextSequence === "function") {
    for (let attempt = 0; attempt < 500; attempt += 1) {
      const id = `CHNM${await store.nextSequence(K.registrationSeq())}`;
      if (!(await getJson(store, K.students(id)))) return id;
    }
    throw new HttpError("नया रजिस्ट्रेशन ID नहीं बन पाया — दोबारा प्रयास करें", 500);
  }

  for (let attempt = 0; attempt < 500; attempt += 1) {
    const id = `CHNM${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
    if (!(await getJson(store, K.students(id)))) return id;
  }
  throw new HttpError("नया रजिस्ट्रेशन ID नहीं बन पाया — दोबारा प्रयास करें", 500);
}

export async function loadCatalog(store, { includeInactive = false } = {}) {
  const [subjects, trades] = await Promise.all([
    listJson(store, "subjects/"),
    listJson(store, "trades/"),
  ]);
  const activeSubjects = includeInactive ? subjects : subjects.filter((s) => s.active !== false);
  const activeTrades = includeInactive ? trades : trades.filter((t) => t.active !== false);
  return {
    subjects: activeSubjects.sort((a, b) => a.name.localeCompare(b.name, "hi")),
    trades: activeTrades.sort((a, b) => a.name.localeCompare(b.name, "hi")),
    subjectMap: new Map(activeSubjects.map((s) => [s.id, s])),
    tradeMap: new Map(activeTrades.map((t) => [t.id, t])),
    subjectByName: new Map(activeSubjects.map((s) => [s.name.toLowerCase(), s])),
    subjectByCode: new Map(activeSubjects.map((s) => [s.code.toUpperCase(), s])),
  };
}

export async function requireSubject(store, subjectId) {
  if (!subjectId) return null;
  return getJson(store, K.subjects(subjectId));
}

export async function requireTrade(store, tradeId) {
  if (!tradeId) return null;
  return getJson(store, K.trades(tradeId));
}

export async function getExam(store, examId) {
  const exam = await getJson(store, K.exams(examId));
  if (!exam) throw new HttpError("परीक्षा नहीं मिली", 404);
  return exam;
}

export async function getPaper(store, examId, version) {
  if (!version) return null;
  return getJson(store, K.paper(examId, version));
}

export async function saveExam(store, exam) {
  await putJson(store, K.exams(exam.id), exam);
  return exam;
}

export async function studentResults(store, studentId) {
  const keys = await listKeys(store, `idx/student-results/${studentId}/`);
  const entries = (await mapLimit(keys, 10, (key) => getJson(store, key))).filter(Boolean);
  const results = await mapLimit(entries, 10, (entry) => getJson(store, K.result(entry.resultId)));
  return results.filter(Boolean).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export async function examResults(store, examId) {
  const keys = await listKeys(store, `idx/exam-results/${examId}/`);
  const entries = (await mapLimit(keys, 10, (key) => getJson(store, key))).filter(Boolean);
  const results = await mapLimit(entries, 10, (entry) => getJson(store, K.result(entry.resultId)));
  return results.filter(Boolean).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export async function allResults(store) {
  const entries = await listJson(store, "results/");
  return entries.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export async function resultForExam(store, studentId, exam) {
  if (!studentId || !exam) return null;
  const results = await studentResults(store, studentId);
  return (
    results.filter((result) => result.examId === exam.id && result.examType === exam.type)[0] || null
  );
}

export async function countAttempts(store, studentId, examId) {
  const keys = await listKeys(store, `idx/student-results/${studentId}/`);
  const entries = (await mapLimit(keys, 10, (key) => getJson(store, key))).filter(Boolean);
  return entries.filter((entry) => entry.examId === examId).length;
}

export async function activeAttempt(store, examId, studentId) {
  return getJson(store, K.attempt(examId, studentId));
}

export async function examAttemptCount(store, examId) {
  const keys = await listKeys(store, `idx/exam-attempts/${examId}/`);
  return keys.length;
}

export async function examAttempts(store, examId) {
  const keys = await listKeys(store, `idx/exam-attempts/${examId}/`);
  return (
    await mapLimit(keys, 8, async (key) => {
      const studentId = key.split("/").pop();
      return getJson(store, K.attempt(examId, studentId));
    })
  ).filter(Boolean);
}

export async function resolveQuestions(store, questionIds) {
  const ids = [...new Set((questionIds || []).map((id) => String(id || "").trim()).filter(Boolean))];
  const questions = [];
  const missing = [];
  for (const qid of ids) {
    const index = await getJson(store, K.questionIndex(qid));
    if (!index) {
      missing.push(qid);
      continue;
    }
    const question = await getJson(store, K.questions(index.subjectId, qid));
    if (!question) {
      missing.push(qid);
      continue;
    }
    questions.push(question);
  }
  return { questions, missing };
}

export async function subjectQuestionCounts(store, catalog) {
  const counts = {};
  await mapLimit(catalog.subjects, 8, async (subject) => {
    counts[subject.id] = (await listKeys(store, `questions/${subject.id}/`)).length;
  });
  return counts;
}

export function examQuestionIds(exam, paper) {
  if (paper?.questions?.length) return paper.questions.map((question) => question.qid);
  return Array.isArray(exam.questionIds) ? exam.questionIds : [];
}

export function publicSubject(subject) {
  return { id: subject.id, name: subject.name, code: subject.code };
}

export function publicTrade(trade) {
  return { id: trade.id, name: trade.name, code: trade.code };
}

export function examStatusLabel(status) {
  return (
    {
      draft: "Draft",
      locked: "Locked",
      published: "Published",
      archived: "Archived",
    }[status] || status
  );
}
