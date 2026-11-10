import crypto from "node:crypto";
import { HttpError } from "./http.mjs";
import { K, getJson, putJson, del, listKeys, mapLimit } from "./db.mjs";

export function paperHash(examId, version, questions) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify({ examId, version, questions }))
    .digest("hex");
}

export function snapshotQuestion(question, exam) {
  const marks = question.marks ?? exam.marksPerQuestion ?? 1;
  let negativeMarks = question.negativeMarks ?? exam.negativeMarks ?? 0;
  negativeMarks = Math.min(negativeMarks, marks);
  return {
    qid: question.qid,
    subjectId: question.subjectId,
    text: question.text,
    options: [...question.options],
    correctIndex: question.correctIndex,
    marks: Math.round(marks * 100) / 100,
    negativeMarks: Math.round(negativeMarks * 100) / 100,
    explanation: question.explanation || "",
    image: question.image || "",
  };
}

export function buildPaper(exam, questions, version) {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new HttpError("पेपर में कम से कम एक प्रश्न आवश्यक है", 400);
  }
  const seen = new Set();
  const snapshots = questions.map((question) => {
    if (!question || !question.qid) throw new HttpError("प्रश्न रिकॉर्ड गलत है", 400);
    if (seen.has(question.qid)) {
      throw new HttpError(`एक ही प्रश्न दो बार नहीं जोड़ा जा सकता: ${question.qid}`, 400);
    }
    seen.add(question.qid);
    if (
      exam.subjectId !== "mixed" &&
      question.subjectId &&
      question.subjectId !== exam.subjectId
    ) {
      throw new HttpError(
        `प्रश्न ${question.qid} इस परीक्षा के विषय का नहीं है`,
        400
      );
    }
    return snapshotQuestion(question, exam);
  });
  const totalMarks = snapshots.reduce((sum, question) => sum + question.marks, 0);
  const paper = {
    examId: exam.id,
    version,
    createdAt: new Date().toISOString(),
    questions: snapshots,
    totalQuestions: snapshots.length,
    totalMarks: Math.round(totalMarks * 100) / 100,
  };
  paper.hash = paperHash(exam.id, version, snapshots);
  return paper;
}

export function sanitizePaperForStudent(paper) {
  return {
    examId: paper.examId,
    version: paper.version,
    totalQuestions: paper.totalQuestions,
    totalMarks: paper.totalMarks,
    questions: paper.questions.map((question) => ({
      qid: question.qid,
      text: question.text,
      options: [...question.options],
      image: question.image || "",
      marks: question.marks,
      negativeMarks: question.negativeMarks,
    })),
  };
}

export function availability(exam, now = Date.now()) {
  if (!exam || exam.status !== "published" || exam.active === false) {
    return { state: "unpublished", canStart: false, reason: "परीक्षा अभी उपलब्ध नहीं है" };
  }
  if (exam.startAt && now < new Date(exam.startAt).getTime()) {
    return {
      state: "upcoming",
      canStart: false,
      reason: "परीक्षा अभी शुरू नहीं हुई है",
      startsAt: exam.startAt,
    };
  }
  if (exam.endAt && now > new Date(exam.endAt).getTime()) {
    return {
      state: "closed",
      canStart: false,
      reason: "परीक्षा की समय-सीमा समाप्त हो गई है",
      endedAt: exam.endAt,
    };
  }
  return { state: "available", canStart: true, reason: "" };
}

export function resultsReleased(exam, now = Date.now()) {
  if (!exam) return false;
  if (exam.type === "practice") return true;
  if (!exam.releaseResults) return false;
  if (exam.releaseAt && now < new Date(exam.releaseAt).getTime()) return false;
  return true;
}

export function answersReleased(exam, now = Date.now()) {
  // Publishing a result also publishes its answer key: students see the correct
  // options and explanations as soon as the admin releases the result.
  return resultsReleased(exam, now);
}

export function scoreAttempt(paper, responses, exam, startedAt, submittedAt) {
  const correctAnswers = [];
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;
  let rawMarks = 0;

  for (const question of paper.questions) {
    const selectedRaw = responses ? responses[question.qid] : null;
    const selected =
      Number.isInteger(selectedRaw) &&
      selectedRaw >= 0 &&
      selectedRaw < question.options.length
        ? selectedRaw
        : null;
    const isCorrect = selected !== null && selected === question.correctIndex;
    if (selected === null) {
      unattempted += 1;
    } else if (isCorrect) {
      correct += 1;
      rawMarks += question.marks;
    } else {
      wrong += 1;
      rawMarks -= question.negativeMarks || 0;
    }
    correctAnswers.push({
      qid: question.qid,
      subjectId: question.subjectId || paper.subjectId || "",
      text: question.text,
      options: [...question.options],
      image: question.image || "",
      selected,
      correctIndex: question.correctIndex,
      correct: isCorrect,
      marks: question.marks,
      negativeMarks: question.negativeMarks,
      explanation: question.explanation || "",
    });
  }

  const totalQuestions = paper.questions.length;
  const maxMarks = paper.totalMarks;
  const obtained = Math.max(0, Math.round(rawMarks * 100) / 100);
  const percentage =
    maxMarks > 0 ? Math.round((obtained / maxMarks) * 10000) / 100 : 0;
  const durationMs = exam.durationMin * 60000;
  const timeTakenSec = Math.max(
    0,
    Math.round(
      (Math.min(submittedAt, startedAt + durationMs) - startedAt) / 1000
    )
  );

  return {
    totalQuestions,
    attempted: correct + wrong,
    correct,
    wrong,
    unattempted,
    obtained,
    maxMarks,
    percentage,
    pass: percentage >= exam.passPct,
    timeTakenSec,
    answers: correctAnswers,
  };
}

export async function finalizeAttempt({
  store,
  exam,
  attempt,
  student,
  autoSubmitted = false,
}) {
  if (!attempt) throw new HttpError("Attempt नहीं मिला", 404);
  const deterministicId = `RES-${attempt.attemptId}`;
  const existing = await getJson(store, K.result(deterministicId));
  if (existing) return existing;

  const paper = await getJson(store, K.paper(exam.id, attempt.paperVersion));
  if (!paper) {
    throw new HttpError("इस परीक्षा का पेपर नहीं मिला", 500);
  }
  const submittedAt = Date.now();
  const score = scoreAttempt(
    paper,
    attempt.responses || {},
    exam,
    attempt.startedAt,
    submittedAt
  );
  const result = {
    resultId: deterministicId,
    attemptId: attempt.attemptId,
    examId: exam.id,
    examTitle: exam.title,
    examCode: exam.code,
    examType: exam.type,
    paperVersion: attempt.paperVersion,
    subjectId: exam.subjectId,
    tradeId: exam.tradeId || "",
    studentId: student.id,
    studentName: student.name,
    fatherName: student.fatherName || "",
    regId: student.id,
    batch: student.batch || "",
    startedAt: new Date(attempt.startedAt).toISOString(),
    submittedAt: new Date(submittedAt).toISOString(),
    autoSubmitted,
    ...score,
  };
  await putJson(store, K.result(result.resultId), result);
  await putJson(
    store,
    K.studentResultIndex(student.id, result.resultId),
    { resultId: result.resultId, examId: exam.id, type: exam.type }
  );
  await putJson(
    store,
    K.examResultIndex(exam.id, result.resultId),
    { resultId: result.resultId, studentId: student.id, type: exam.type }
  );
  await del(store, K.attempt(exam.id, student.id));
  await del(store, K.attemptIndex(student.id, exam.id));
  await del(store, K.attemptExamIndex(exam.id, student.id));
  return result;
}

export async function finalizeExpiredForExam(store, exam, { graceMs = 5000 } = {}) {
  const keys = await listKeys(store, `idx/exam-attempts/${exam.id}/`);
  const finalized = [];
  await mapLimit(keys, 8, async (key) => {
    const studentId = key.split("/").pop();
    const attempt = await getJson(store, K.attempt(exam.id, studentId));
    if (!attempt || attempt.status !== "active") return;
    if (Date.now() <= Number(attempt.endAt) + graceMs) return;
    const student = await getJson(store, K.students(studentId));
    if (!student) return;
    const result = await finalizeAttempt({
      store,
      exam,
      attempt,
      student,
      autoSubmitted: true,
    });
    finalized.push(result.resultId);
  });
  return finalized;
}

export async function finalizeExpiredForStudent(store, studentId) {
  const keys = await listKeys(store, `idx/student-attempts/${studentId}/`);
  const finalized = [];
  await mapLimit(keys, 8, async (key) => {
    const examId = key.split("/").pop();
    const exam = await getJson(store, K.exams(examId));
    if (!exam) return;
    const attempt = await getJson(store, K.attempt(examId, studentId));
    if (!attempt || attempt.status !== "active") return;
    if (Date.now() <= Number(attempt.endAt) + 5000) return;
    const student = await getJson(store, K.students(studentId));
    if (!student) return;
    const result = await finalizeAttempt({
      store,
      exam,
      attempt,
      student,
      autoSubmitted: true,
    });
    finalized.push(result.resultId);
  });
  return finalized;
}

export function examStartEnd(exam, now = Date.now()) {
  const startedAt = now;
  let endAt = startedAt + exam.durationMin * 60000;
  if (exam.endAt) {
    endAt = Math.min(endAt, new Date(exam.endAt).getTime());
  }
  return { startedAt, endAt };
}

export function sanitizeAttempt(attempt) {
  return {
    attemptId: attempt.attemptId,
    startedAt: attempt.startedAt,
    endAt: attempt.endAt,
    responses: attempt.responses || {},
    marked: Array.isArray(attempt.marked) ? attempt.marked : [],
    visited: Array.isArray(attempt.visited) ? attempt.visited : [],
    current: Number.isInteger(attempt.current) ? attempt.current : 0,
    seq: attempt.seq || 0,
    status: attempt.status,
  };
}
