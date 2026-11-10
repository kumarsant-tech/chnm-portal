// Imports students and results from the original portal store ("exam").
// The import is additive and idempotent: nothing in the old store is deleted
// and re-running it never duplicates records.

import { K, getJson, putJson, getLegacyDb, listKeys, usingMemoryStore } from "./db.mjs";
import { LEGACY_QUESTIONS } from "./seed.mjs";
import { clean, validKey, phone } from "./validate.mjs";

const SUBJECT_MAP = {
  Mixed: "mixed",
  TM: "training-methodology",
  "Trade Theory": "trade-theory",
  "Soft Skills": "soft-skills",
};

const SUBJECT_LABEL = {
  mixed: "Mixed",
  "training-methodology": "Training Methodology (TM)",
  "trade-theory": "Trade Theory",
  "soft-skills": "Soft Skills",
};

function legacySubjectId(raw) {
  return SUBJECT_MAP[String(raw || "").trim()] || "mixed";
}

function legacySubjectLabel(subjectId) {
  return SUBJECT_LABEL[subjectId] || SUBJECT_LABEL.mixed;
}

function resultIdFor(attemptId) {
  return `RES-${attemptId}`;
}

function attemptsFromResult(record) {
  const indices = Array.isArray(record.q) ? record.q : [];
  const answers = Array.isArray(record.ans) ? record.ans : [];
  return indices.map((bankIndex, position) => {
    const source = LEGACY_QUESTIONS[bankIndex];
    const selectedRaw = answers[position];
    const selected =
      Number.isInteger(selectedRaw) &&
      selectedRaw >= 0 &&
      source &&
      selectedRaw < source[2].length
        ? selectedRaw
        : null;
    const correctIndex = source ? source[3] : null;
    const isCorrect = selected !== null && selected === correctIndex;
    return {
      qid: `LEG-${String(bankIndex + 1).padStart(3, "0")}`,
      text: source ? source[1] : "",
      options: source ? [...source[2]] : [],
      image: "",
      selected,
      correctIndex,
      correct: isCorrect,
      marks: record.n ? Math.round((100 / record.n) * 100) / 100 : 1,
      negativeMarks: 0,
      explanation: source ? source[4] || "" : "",
    };
  });
}

async function ensureLegacyExam(store, record, subjectId, questionCount, cfg) {
  const slug = subjectId === "mixed" ? "mixed" : subjectId;
  const examId = `legacy-${slug}-${questionCount}`;
  const existing = await getJson(store, K.exams(examId));
  if (existing) return existing;
  const now = new Date().toISOString();
  const exam = {
    id: examId,
    title: `पुराना पोर्टल — ${legacySubjectLabel(subjectId)} (${questionCount} प्रश्न)`,
    code: `LEGACY-${slug.toUpperCase().replace(/-/g, "")}-${questionCount}`,
    tradeId: "",
    subjectId,
    durationMin: Number(cfg.duration) || 60,
    passPct: Number.isFinite(Number(cfg.passPct)) ? Number(cfg.passPct) : 40,
    marksPerQuestion: questionCount ? Math.round((100 / questionCount) * 100) / 100 : 1,
    negativeMarks: 0,
    instructions: "यह परीक्षा पुराने पोर्टल से आयात की गई है। इसे दोबारा नहीं दिया जा सकता।",
    startAt: null,
    endAt: null,
    type: "final",
    releaseResults: true,
    showAnswers: cfg.showAnswers !== false,
    releaseAt: null,
    active: false,
    status: "archived",
    paperVersion: 0,
    totalQuestions: questionCount,
    totalMarks: 100,
    questionIds: [],
    legacy: true,
    createdAt: now,
    updatedAt: now,
  };
  await putJson(store, K.exams(examId), exam);
  return exam;
}

async function ensureLegacyStudent(store, record, now) {
  const id = clean(record.id, 40);
  if (!validKey(id)) return { student: null, created: false };
  const existing = await getJson(store, K.students(id));
  if (existing) return { student: existing, created: false };
  const mobile = phone(record.mobile);
  if (mobile) {
    const holder = await getJson(store, K.mobileIndex(mobile));
    if (holder && holder.studentId !== id) return { student: null, created: false };
  }
  const student = {
    id,
    name: clean(record.name, 60) || "पुराना छात्र",
    fatherName: "",
    mobile,
    email: "",
    tradeId: "",
    legacyTrade: clean(record.trade, 40),
    batch: "",
    college: clean(record.college, 60),
    photo: /^data:image\/(jpeg|png|webp);base64,/.test(String(record.photo || ""))
      ? String(record.photo)
      : "",
    active: true,
    legacy: true,
    createdAt: record.at || now,
    updatedAt: now,
  };
  await putJson(store, K.students(id), student);
  if (mobile) await putJson(store, K.mobileIndex(mobile), { studentId: id });
  return { student, created: true };
}

export async function legacyPreview() {
  const legacy = await getLegacyDb();
  const [studentKeys, resultKeys, attemptKeys] = await Promise.all([
    listKeys(legacy, "s/"),
    listKeys(legacy, "r/"),
    listKeys(legacy, "t/"),
  ]);
  const cfg = (await getJson(legacy, "config")) || {};
  return {
    store: usingMemoryStore() ? "memory" : "exam",
    students: studentKeys.length,
    results: resultKeys.length,
    activeAttempts: attemptKeys.length,
    config: {
      active: Boolean(cfg.active),
      published: Boolean(cfg.published),
      subject: cfg.subject || "Mixed",
      count: cfg.count || 0,
      duration: cfg.duration || 0,
      passPct: cfg.passPct ?? 40,
      college: cfg.college || "",
      showAnswers: cfg.showAnswers !== false,
    },
  };
}

export async function importLegacyData(store) {
  const legacy = await getLegacyDb();
  const now = new Date().toISOString();
  const cfg = (await getJson(legacy, "config")) || {};
  const report = {
    students: { imported: 0, existing: 0, skipped: [] },
    results: { imported: 0, existing: 0, skipped: [] },
    exams: [],
    preview: { students: 0, results: 0 },
  };

  const studentKeys = await listKeys(legacy, "s/");
  const resultKeys = await listKeys(legacy, "r/");
  report.preview = { students: studentKeys.length, results: resultKeys.length };

  const legacyStudents = (await Promise.all(studentKeys.map((key) => getJson(legacy, key)))).filter(
    Boolean
  );
  const byId = new Map();
  for (const record of legacyStudents) {
    const { student, created } = await ensureLegacyStudent(store, record, now);
    if (!student) {
      report.students.skipped.push({ id: String(record.id || ""), reason: "ID/मोबाइल पहले से किसी और छात्र के पास है" });
    } else if (created) {
      report.students.imported += 1;
    } else {
      report.students.existing += 1;
    }
    if (student) byId.set(student.id, student);
  }

  const legacyResults = (await Promise.all(resultKeys.map((key) => getJson(legacy, key)))).filter(
    Boolean
  );
  const examIds = new Set();

  for (const record of legacyResults) {
    const studentId = clean(record.id, 40);
    const attemptId = `LEGACY-${studentId}`;
    const resultId = resultIdFor(attemptId);
    if (await getJson(store, K.result(resultId))) {
      report.results.existing += 1;
      continue;
    }
    let student = byId.get(studentId) || (await getJson(store, K.students(studentId)));
    if (!student) {
      const ensured = await ensureLegacyStudent(store, record, now);
      student = ensured.student;
      if (ensured.created) report.students.imported += 1;
      if (student) byId.set(student.id, student);
    }
    if (!student) {
      report.results.skipped.push({ id: studentId, reason: "छात्र रिकॉर्ड नहीं बन सका" });
      continue;
    }

    const subjectId = legacySubjectId(record.subject);
    const answers = attemptsFromResult(record);
    const totalQuestions = Number(record.n) || answers.length;
    if (!totalQuestions) {
      report.results.skipped.push({ id: studentId, reason: "पुराने परिणाम में प्रश्न नहीं हैं" });
      continue;
    }
    const exam = await ensureLegacyExam(store, record, subjectId, totalQuestions, cfg);
    examIds.add(exam.id);

    const correct = answers.filter((answer) => answer.correct).length;
    const attempted = answers.filter((answer) => answer.selected !== null).length;
    const percentage = Number.isFinite(Number(record.score))
      ? Number(record.score)
      : Math.round((correct / totalQuestions) * 10000) / 100;
    const submittedAt = record.at || now;
    const result = {
      resultId,
      attemptId,
      examId: exam.id,
      examTitle: exam.title,
      examCode: exam.code,
      examType: "final",
      paperVersion: 0,
      subjectId,
      tradeId: student.tradeId || "",
      studentId: student.id,
      studentName: student.name,
      fatherName: student.fatherName || "",
      regId: student.id,
      batch: student.batch || "",
      startedAt: submittedAt,
      submittedAt,
      autoSubmitted: false,
      totalQuestions,
      attempted,
      correct,
      wrong: attempted - correct,
      unattempted: totalQuestions - attempted,
      obtained: Math.round(percentage * 100) / 100,
      maxMarks: 100,
      percentage: Math.round(percentage * 100) / 100,
      pass: Boolean(record.pass),
      timeTakenSec: 0,
      answers,
      legacy: true,
    };
    await putJson(store, K.result(resultId), result);
    await putJson(store, K.studentResultIndex(student.id, resultId), {
      resultId,
      examId: exam.id,
      type: "final",
      legacy: true,
    });
    await putJson(store, K.examResultIndex(exam.id, resultId), {
      resultId,
      studentId: student.id,
      type: "final",
      legacy: true,
    });
    report.results.imported += 1;
  }

  report.exams = [...examIds];
  return report;
}
