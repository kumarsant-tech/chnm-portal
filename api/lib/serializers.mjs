import {
  answersReleased,
  availability,
  resultsReleased,
  sanitizeAttempt,
} from "./scoring.mjs";

export function publicSettings(settings) {
  return {
    siteName: settings.siteName,
    collegeName: settings.collegeName,
    groupName: settings.groupName || settings.collegeName || "",
    registrationOpen: settings.registrationOpen !== false,
    defaultPassPct: settings.defaultPassPct,
    defaultDurationMin: settings.defaultDurationMin,
    defaultInstructions: settings.defaultInstructions,
    defaultInstructionsEn: settings.defaultInstructionsEn,
    resultsReleaseDefault: Boolean(settings.resultsReleaseDefault),
    showAnswersDefault: Boolean(settings.showAnswersDefault),
    maxPhotoKb: settings.maxPhotoKb || 200,
  };
}

export function studentSelf(student) {
  return {
    id: student.id,
    name: student.name,
    fatherName: student.fatherName || "",
    citsNumber: student.citsNumber || "",
    loginId: student.citsNumber || student.mobile || "",
    tradeId: student.tradeId,
    batch: student.batch || "",
    mobile: student.mobile,
    email: student.email || "",
    photo: student.photo || "",
    active: student.active !== false,
    passwordChangeRequired: Boolean(student.mustChangePassword || !student.passwordHash),
    createdAt: student.createdAt,
  };
}

export function studentSummary(student, tradeName = "") {
  return {
    id: student.id,
    name: student.name,
    fatherName: student.fatherName || "",
    mobile: student.mobile,
    citsNumber: student.citsNumber || "",
    email: student.email || "",
    tradeId: student.tradeId,
    tradeName,
    batch: student.batch || "",
    active: student.active !== false,
    hasPhoto: Boolean(student.photo),
    createdAt: student.createdAt,
  };
}

export function examSummary(exam, subjectName, tradeName, options = {}) {
  const now = options.now || Date.now();
  const state = availability(exam, now);
  const released = options.result ? resultsReleased(exam, now) : false;
  return {
    id: exam.id,
    title: exam.title,
    code: exam.code,
    type: exam.type,
    status: exam.status,
    subjectId: exam.subjectId,
    subjectName,
    tradeId: exam.tradeId || "",
    tradeName,
    durationMin: exam.durationMin,
    passPct: exam.passPct,
    totalQuestions: exam.totalQuestions || 0,
    totalMarks: exam.totalMarks || 0,
    marksPerQuestion: exam.marksPerQuestion,
    negativeMarks: exam.negativeMarks,
    instructions: exam.instructions || "",
    instructionsEn: exam.instructionsEn || "",
    startAt: exam.startAt || null,
    endAt: exam.endAt || null,
    releaseResults: Boolean(exam.releaseResults),
    showAnswers: Boolean(exam.showAnswers),
    releaseAt: exam.releaseAt || null,
    paperVersion: exam.paperVersion || 0,
    paperLockedAt: exam.paperLockedAt || null,
    publishedAt: exam.publishedAt || null,
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt,
    availability: state,
    completed: Boolean(options.result),
    resultId: options.result?.resultId || null,
    resultReleased: released,
    percentage: released ? options.result?.percentage ?? null : null,
    pass: released ? options.result?.pass ?? null : null,
    resultPending: Boolean(options.result) && !released,
  };
}

export function redactUnreleased(result, exam, now = Date.now()) {
  const summary = resultSummary(result);
  if (exam && resultsReleased(exam, now)) return summary;
  return {
    ...summary,
    totalQuestions: null,
    attempted: null,
    correct: null,
    wrong: null,
    unattempted: null,
    obtained: null,
    maxMarks: null,
    percentage: null,
    pass: null,
    timeTakenSec: null,
    pending: true,
  };
}

export function resultSummary(result) {
  return {
    resultId: result.resultId,
    attemptId: result.attemptId,
    examId: result.examId,
    examTitle: result.examTitle,
    examCode: result.examCode,
    examType: result.examType,
    subjectId: result.subjectId,
    tradeId: result.tradeId,
    studentId: result.studentId,
    studentName: result.studentName,
    regId: result.regId,
    batch: result.batch,
    startedAt: result.startedAt,
    submittedAt: result.submittedAt,
    totalQuestions: result.totalQuestions,
    attempted: result.attempted,
    correct: result.correct,
    wrong: result.wrong,
    unattempted: result.unattempted,
    obtained: result.obtained,
    maxMarks: result.maxMarks,
    percentage: result.percentage,
    pass: result.pass,
    timeTakenSec: result.timeTakenSec,
    autoSubmitted: result.autoSubmitted,
  };
}

export function resultDetail(result, exam, { includeAnswers = false, forceAll = false } = {}) {
  const summary = resultSummary(result);
  if (!includeAnswers) return { ...summary, answers: null };
  const allow = forceAll || (exam ? answersReleased(exam) : Boolean(result.examType === "practice"));
  return {
    ...summary,
    answersReleased: allow,
    answers: allow
      ? (result.answers || []).map((answer) => ({
          qid: answer.qid,
          subjectId: answer.subjectId || result.subjectId || "",
          text: answer.text,
          options: Array.isArray(answer.options) ? answer.options : [],
          image: answer.image || "",
          selected: answer.selected,
          correctIndex: answer.correctIndex,
          correct: answer.correct,
          marks: answer.marks,
          negativeMarks: answer.negativeMarks,
          explanation: answer.explanation,
        }))
      : null,
  };
}

export function studentDashboardEntry(exam, subjectName, tradeName, result, now) {
  return examSummary(exam, subjectName, tradeName, { result, now });
}

export function attemptView(student, exam, attempt, paper) {
  return {
    student: studentSelf(student),
    exam: examSummary(exam, "", "", { now: Date.now() }),
    attempt: sanitizeAttempt(attempt),
    paper: {
      examId: paper.examId,
      version: paper.version,
      totalQuestions: paper.totalQuestions,
      totalMarks: paper.totalMarks,
      questions: paper.questions.map((question) => ({
        qid: question.qid,
        text: question.text,
        options: [...question.options],
        image: question.image || "",
      })),
    },
    serverNow: Date.now(),
  };
}
