import crypto from "node:crypto";
import { HttpError } from "./http.mjs";

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

// The portal runs on exactly three subjects and one trade. Legacy subjects are
// never deleted — they are only hidden — so their old questions stay reachable.
export const DEFAULT_TRADE_ID = "chnm";
export const PRIMARY_SUBJECT_IDS = ["trade-theory", "training-methodology", "soft-skills"];

export function clean(value, max = 200, multiline = false) {
  let text = String(value ?? "").replace(CONTROL, "");
  text = multiline
    ? text.replace(/\r\n?/g, "\n").replace(/[<>]/g, "")
    : text.replace(/\s+/g, " ").replace(/[<>]/g, "");
  return text.trim().slice(0, max);
}

export function slug(value, max = 40) {
  return clean(value, max)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max);
}

export function validKey(value, max = 40) {
  return /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/.test(String(value || "")) && String(value).length <= max;
}

export function phone(value) {
  const normalized = String(value ?? "").replace(/[\s-]/g, "");
  return /^[6-9]\d{9}$/.test(normalized) ? normalized : "";
}

export function email(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized) ? normalized.slice(0, 100) : "";
}

export function number(value, fallback = null) {
  const parsed = typeof value === "number" ? value : Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function int(value, fallback = null) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function bool(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1" || value === 1) return true;
  if (value === "false" || value === "0" || value === 0) return false;
  return fallback;
}

export function dateIso(value) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

export function photo(value, max = 1500000) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(text)) {
    throw new HttpError("फोटो JPEG, PNG या WebP फॉर्मेट में होनी चाहिए", 400);
  }
  if (text.length > max) {
    throw new HttpError("फोटो का साइज़ बहुत बड़ा है", 400);
  }
  return text;
}

export function image(value, max = 350000) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if (/^https?:\/\/[^\s<>"']+$/i.test(text)) return text.slice(0, 1000);
  if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(text) && text.length <= max) {
    return text;
  }
  throw new HttpError("प्रश्न की इमेज URL या data:image होनी चाहिए", 400);
}

export function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\s\p{P}\p{S}]+/gu, "");
}

export function correctIndexFrom(value, optionCount) {
  if (typeof value === "number" && Number.isInteger(value)) {
    if (value >= 0 && value < optionCount) return value;
    throw new HttpError("सही उत्तर का index विकल्पों की संख्या में नहीं है", 400);
  }
  const text = String(value ?? "").trim();
  if (/^[A-Fa-f]$/.test(text)) {
    const index = text.toUpperCase().charCodeAt(0) - 65;
    if (index < optionCount) return index;
  }
  if (/^\d+$/.test(text)) {
    const oneBased = parseInt(text, 10);
    if (oneBased >= 1 && oneBased <= optionCount) return oneBased - 1;
    if (oneBased === 0) return 0;
    if (oneBased < optionCount) return oneBased;
  }
  throw new HttpError("सही उत्तर A, B, C, D या 1-4 में से दें", 400);
}

export function validateOptions(input) {
  let options = input.options;
  if (!Array.isArray(options)) {
    options = [input.optionA, input.optionB, input.optionC, input.optionD, input.optionE, input.optionF];
  }
  const cleaned = options
    .map((option) => clean(option, 500, true))
    .filter((option) => option.length > 0);
  if (cleaned.length < 2) {
    throw new HttpError("कम से कम दो विकल्प आवश्यक हैं", 400);
  }
  if (cleaned.length > 6) {
    throw new HttpError("अधिकतम छह विकल्प हो सकते हैं", 400);
  }
  const seen = new Set();
  for (const option of cleaned) {
    const key = normalizeText(option);
    if (seen.has(key)) throw new HttpError("एक ही प्रश्न में दो विकल्प समान नहीं हो सकते", 400);
    seen.add(key);
  }
  return cleaned;
}

export function validateQuestion(input, defaults = {}) {
  const text = clean(input.text ?? input.question, 2000, true);
  if (text.length < 3) throw new HttpError("प्रश्न लिखना आवश्यक है", 400);
  const options = validateOptions(input);
  const correctSource =
    input.correctIndex !== undefined && input.correctIndex !== null
      ? input.correctIndex
      : input.correctAnswer;
  const correctIndex = correctIndexFrom(correctSource, options.length);
  const blankMarks = input.marks === undefined || input.marks === null || String(input.marks).trim() === "";
  const blankNegative =
    input.negativeMarks === undefined || input.negativeMarks === null || String(input.negativeMarks).trim() === "";
  const marks = blankMarks ? (defaults.marks ?? null) : number(input.marks, null);
  if (marks !== null && (!Number.isFinite(marks) || marks <= 0 || marks > 100)) {
    throw new HttpError("प्रश्न के अंक 0.1 से 100 के बीच होने चाहिए", 400);
  }
  const negativeMarks = blankNegative
    ? (defaults.negativeMarks ?? null)
    : number(input.negativeMarks, null);
  if (
    negativeMarks !== null &&
    (!Number.isFinite(negativeMarks) || negativeMarks < 0 || negativeMarks > (marks ?? 100))
  ) {
    throw new HttpError("नकारात्मक अंक 0 से लेकर प्रश्न के अंकों तक होने चाहिए", 400);
  }
  return {
    qid: clean(input.qid ?? input.id ?? input.questionId, 40),
    text,
    options,
    correctIndex,
    marks: marks === null ? null : Math.round(marks * 100) / 100,
    negativeMarks: negativeMarks === null ? null : Math.round(negativeMarks * 100) / 100,
    explanation: clean(input.explanation, 3000, true),
    topic: clean(input.topic ?? input.Topic ?? input["विषयक"], 120),
    image: image(input.image),
    active: bool(input.active, true),
  };
}

export function validateStudent(input) {
  const name = clean(input.name, 60);
  if (name.length < 2) throw new HttpError("छात्र का सही नाम दर्ज करें", 400);
  const mobile = phone(input.mobile);
  if (input.mobile && !mobile) throw new HttpError("10 अंकों का सही मोबाइल नंबर दें", 400);
  const citsNumber = clean(input.citsNumber ?? input.cits, 30).toUpperCase();
  if (citsNumber && !/^[A-Z0-9/-]{2,30}$/.test(citsNumber)) {
    throw new HttpError("सही CITS नंबर दर्ज करें", 400);
  }
  if (!mobile && !citsNumber) {
    throw new HttpError("CITS नंबर या मोबाइल नंबर में से एक दर्ज करना आवश्यक है", 400);
  }
  const dateOfBirth = String(input.dateOfBirth || "");
  if (dateOfBirth && !validDateOfBirth(dateOfBirth)) {
    throw new HttpError("जन्मतिथि सही दर्ज करें", 400);
  }
  const emailAddress = clean(input.email, 100).toLowerCase();
  if (emailAddress && !email(emailAddress)) {
    throw new HttpError("सही ईमेल दर्ज करें", 400);
  }
  if (input.consent === false || input.consent === "false") {
    throw new HttpError("रजिस्ट्रेशन के लिए शर्तों की सहमति आवश्यक है", 400);
  }
  return {
    name,
    fatherName: clean(input.fatherName, 60),
    mobile,
    citsNumber,
    dateOfBirth,
    email: emailAddress,
    tradeId: clean(input.tradeId, 40) || DEFAULT_TRADE_ID,
    batch: clean(input.batch, 40),
    photo: photo(input.photo),
  };
}

export function validDateOfBirth(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getTime() <= Date.now()
  );
}

export function temporaryPasswordFromDob(value) {
  if (!validDateOfBirth(value)) throw new HttpError("जन्मतिथि सही दर्ज करें", 400);
  return value.slice(8, 10) + value.slice(5, 7) + value.slice(0, 4);
}

export function validateExam(input) {
  const title = clean(input.title, 120);
  if (title.length < 2) throw new HttpError("परीक्षा का नाम दर्ज करें", 400);
  const code = clean(input.code, 30).toUpperCase().replace(/\s+/g, "-");
  if (!/^[A-Z0-9][A-Z0-9-]{1,29}$/.test(code)) {
    throw new HttpError("Exam Code में केवल अक्षर, अंक और - हो सकते हैं", 400);
  }
  const subjectId = clean(input.subjectId, 40);
  if (!subjectId) throw new HttpError("विषय चुनें", 400);
  const durationMin = int(input.durationMin ?? input.duration, 60);
  if (durationMin < 1 || durationMin > 300) {
    throw new HttpError("अवधि 1 से 300 मिनट के बीच होनी चाहिए", 400);
  }
  const passPct = number(input.passPct, 40);
  if (!Number.isFinite(passPct) || passPct < 0 || passPct > 100) {
    throw new HttpError("पास प्रतिशत 0 से 100 के बीच होना चाहिए", 400);
  }
  const marksPerQuestion = number(input.marksPerQuestion, 1);
  if (!Number.isFinite(marksPerQuestion) || marksPerQuestion <= 0 || marksPerQuestion > 100) {
    throw new HttpError("प्रति प्रश्न अंक 0.1 से 100 के बीच होने चाहिए", 400);
  }
  const negativeMarks = number(input.negativeMarks, 0);
  if (!Number.isFinite(negativeMarks) || negativeMarks < 0 || negativeMarks > marksPerQuestion) {
    throw new HttpError("नकारात्मक अंक 0 से प्रति प्रश्न अंकों तक होने चाहिए", 400);
  }
  const startAt = dateIso(input.startAt);
  const endAt = dateIso(input.endAt);
  if (input.startAt && !startAt) throw new HttpError("Exam Start Time गलत है", 400);
  if (input.endAt && !endAt) throw new HttpError("Exam End Time गलत है", 400);
  if (!startAt) throw new HttpError("Exam Start Time अनिवार्य है", 400);
  if (!endAt) throw new HttpError("Exam End Time अनिवार्य है", 400);
  if (startAt && endAt && new Date(startAt) >= new Date(endAt)) {
    throw new HttpError("Exam End Time, Start Time के बाद होना चाहिए", 400);
  }
  const type = input.type === "practice" ? "practice" : "final";
  const attemptsAllowed = int(input.attemptsAllowed, type === "practice" ? 3 : 1);
  if (attemptsAllowed < 1 || attemptsAllowed > 50) {
    throw new HttpError("प्रयासों की संख्या 1 से 50 के बीच होनी चाहिए", 400);
  }
  return {
    title,
    code,
    tradeId: clean(input.tradeId, 40) || DEFAULT_TRADE_ID,
    subjectId,
    durationMin,
    passPct: Math.round(passPct * 100) / 100,
    marksPerQuestion: Math.round(marksPerQuestion * 100) / 100,
    negativeMarks: Math.round(negativeMarks * 100) / 100,
    attemptsAllowed,
    instructions: clean(input.instructions, 5000, true),
    instructionsEn: clean(input.instructionsEn, 5000, true),
    startAt,
    endAt,
    type,
    releaseResults: bool(input.releaseResults, false),
    showAnswers: bool(input.showAnswers, false),
    releaseAt: dateIso(input.releaseAt),
    active: bool(input.active, true),
  };
}

export function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function csv(rows) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export function safeFilePart(value, fallback = "data") {
  const text = slug(value, 40);
  return text || fallback;
}

export function randomToken(length = 12) {
  return crypto.randomBytes(length).toString("base64url");
}
