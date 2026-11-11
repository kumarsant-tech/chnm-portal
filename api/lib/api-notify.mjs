// सूचना (notification), समूह चैट और विषय-वार प्रश्न-पत्र निर्माण।
import crypto from "node:crypto";
import { K, getJson, putJson, del, listKeys, listJson } from "./db.mjs";
import { HttpError, json } from "./http.mjs";
import { clean, DEFAULT_TRADE_ID } from "./validate.mjs";
import { audit, rateLimit } from "./auth.mjs";

const NOTICE_BODY = 4000;
const CHAT_KEEP = 300;
const CHAT_TEXT = 500;
const CHAT_WINDOW_MS = 60_000;
const CHAT_MAX_PER_WINDOW = 20;

function noticeId() {
  return `N${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function chatKey() {
  return K.chatMessage(`${String(Date.now()).padStart(14, "0")}-${crypto.randomBytes(4).toString("hex")}`);
}

// Chat ids start with a zero-padded timestamp, so a plain sort is oldest-first.
async function chatKeysSorted(store) {
  return (await listKeys(store, "chat/")).sort();
}

function audienceOf(value) {
  const text = clean(value, 60).toLowerCase();
  if (!text || text === "all" || text === "सभी") return "all";
  if (text.startsWith("trade:")) return text;
  if (text.startsWith("batch:")) return text;
  return "all";
}

export function noticeVisibleTo(notice, student) {
  const audience = notice.audience || "all";
  if (audience === "all") return true;
  if (audience.startsWith("trade:")) return String(student.tradeId || "") === audience.slice(6);
  if (audience.startsWith("batch:")) return String(student.batch || "") === audience.slice(6);
  return true;
}

function publicNotice(notice, read) {
  return {
    id: notice.id,
    title: notice.title,
    body: notice.body,
    level: notice.level || "info",
    audience: notice.audience || "all",
    createdAt: notice.createdAt,
    updatedAt: notice.updatedAt || null,
    read: !!read,
  };
}

/* सिर्फ़ सभी-के-लिए वाली चालू सूचनाएँ — बिना लॉगिन होम पेज पर दिखती हैं। */
export async function handleSiteNotices({ store }) {
  const notices = (await listJson(store, "notices/")).filter(
    (notice) => notice && notice.active !== false && (notice.audience || "all") === "all"
  );
  notices.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return json({
    notices: notices.slice(0, 5).map((notice) => publicNotice(notice, null)),
    serverTime: Date.now(),
  });
}

/* ------------------------------ छात्र पक्ष ------------------------------ */

export async function handleNotices({ store, student }) {
  const notices = (await listJson(store, "notices/")).filter(
    (notice) => notice && notice.active !== false && noticeVisibleTo(notice, student)
  );
  const now = Date.now();
  const publishedExams = (await listJson(store, "exams/"))
    .filter(
      (exam) =>
        exam?.status === "published" &&
        exam.active !== false &&
        Number.isFinite(Date.parse(exam.endAt)) &&
        Date.parse(exam.endAt) >= now &&
        noticeVisibleTo({ audience: `trade:${exam.tradeId || DEFAULT_TRADE_ID}` }, student)
    )
    .map((exam) => ({
      id: `exam-published-${exam.id}`,
      title: `नई परीक्षा प्रकाशित: ${exam.title}`,
      body:
        `यह परीक्षा आपके लिए प्रकाशित हुई है।\n` +
        `शुरू: ${new Intl.DateTimeFormat("hi-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(exam.startAt))}\n` +
        `समाप्त: ${new Intl.DateTimeFormat("hi-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(exam.endAt))}`,
      level: "important",
      audience: `trade:${exam.tradeId || DEFAULT_TRADE_ID}`,
      createdAt: exam.publishedAt || exam.updatedAt,
      updatedAt: exam.publishedAt || exam.updatedAt,
      examId: exam.id,
    }));
  notices.push(...publishedExams);
  notices.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const items = [];
  for (const notice of notices.slice(0, 50)) {
    const read = await getJson(store, K.noticeRead(student.id, notice.id));
    items.push(publicNotice(notice, read));
  }
  return json({ notices: items, unread: items.filter((item) => !item.read).length });
}

export async function handleNoticeRead({ store, student, body }) {
  const id = clean(body.noticeId, 40);
  if (!id) throw new HttpError("सूचना पहचान आवश्यक है", 400);
  let notice = await getJson(store, K.notice(id));
  if (!notice && id.startsWith("exam-published-")) {
    const examId = id.slice("exam-published-".length);
    const exam = await getJson(store, K.exams(examId));
    if (
      exam?.status === "published" &&
      exam.active !== false &&
      Date.parse(exam.endAt) >= Date.now() &&
      noticeVisibleTo({ audience: `trade:${exam.tradeId || DEFAULT_TRADE_ID}` }, student)
    ) {
      notice = {
        id,
        audience: `trade:${exam.tradeId || DEFAULT_TRADE_ID}`,
      };
    }
  }
  if (!notice) throw new HttpError("सूचना नहीं मिली", 404);
  await putJson(store, K.noticeRead(student.id, notice.id), { at: new Date().toISOString() });
  return json({ ok: true, noticeId: notice.id });
}

export async function handleChatList({ store, student, body }) {
  const after = Number(body.after) || 0;
  const keys = (await chatKeysSorted(store)).filter((key) => {
    if (!after) return true;
    return Number(String(key).slice("chat/".length, "chat/".length + 14)) > after;
  });
  const take = keys.slice(Math.max(0, keys.length - 80));
  const messages = [];
  for (const key of take) {
    const message = await getJson(store, key);
    if (message && message.text) messages.push(message);
  }
  const members = (await listKeys(store, "students/")).length;
  return json({
    messages,
    members,
    me: { id: student.id, name: student.name },
    serverTime: Date.now(),
  });
}

export async function handleChatSend({ store, student, body }) {
  await rateLimit(store, "chat", student.id, CHAT_MAX_PER_WINDOW, CHAT_WINDOW_MS);
  const text = clean(body.text, CHAT_TEXT).replace(/\s+\n/g, "\n");
  if (text.length < 1) throw new HttpError("खाली संदेश भेजा नहीं जा सकता", 400);
  const message = {
    id: String(chatKey()).slice(5),
    sid: student.id,
    name: student.name || student.id,
    tradeId: student.tradeId || "",
    text,
    createdAt: new Date().toISOString(),
  };
  await putJson(store, K.chatMessage(message.id), message);
  const keys = await chatKeysSorted(store);
  if (keys.length > CHAT_KEEP) {
    for (const key of keys.slice(0, keys.length - CHAT_KEEP)) await del(store, key);
  }
  return json({ ok: true, message });
}

/* ------------------------------ एडमिन पक्ष ------------------------------ */

export async function handleAdminNotices({ store }) {
  const notices = (await listJson(store, "notices/")).filter(Boolean);
  notices.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return json({
    notices: notices.map((notice) => ({
      ...notice,
      body: String(notice.body || "").length > 300 ? `${notice.body.slice(0, 300)}…` : notice.body,
    })),
  });
}

export async function handleAdminNoticeSave({ store, body }) {
  const input = body.notice || {};
  const title = clean(input.title, 120);
  if (title.length < 2) throw new HttpError("सूचना का शीर्षक दर्ज करें", 400);
  const text = clean(input.body, NOTICE_BODY, true);
  if (text.length < 2) throw new HttpError("सूचना का संदेश दर्ज करें", 400);
  const level = ["info", "warn", "important"].includes(input.level) ? input.level : "info";
  const now = new Date().toISOString();
  const existing = input.id ? await getJson(store, K.notice(String(input.id))) : null;
  if (input.id && !existing) throw new HttpError("सूचना नहीं मिली", 404);
  const record = {
    ...(existing || {}),
    id: existing?.id || noticeId(),
    title,
    body: text,
    level,
    audience: audienceOf(input.audience),
    active: input.active === undefined ? existing?.active !== false : !!input.active,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    sentBy: "admin",
  };
  await putJson(store, K.notice(record.id), record);
  await audit(store, existing ? "notice.update" : "notice.create", "admin", {
    id: record.id,
    audience: record.audience,
  });
  return json({ ok: true, notice: { ...record, body: record.body.slice(0, 300) } });
}

export async function handleAdminNoticeDelete({ store, body }) {
  const id = clean(body.noticeId ?? body.id, 40);
  if (!id) throw new HttpError("सूचना पहचान आवश्यक है", 400);
  const notice = await getJson(store, K.notice(id));
  if (!notice) throw new HttpError("सूचना नहीं मिली", 404);
  await del(store, K.notice(id));
  await audit(store, "notice.delete", "admin", { id });
  return json({ ok: true });
}

export async function handleAdminChat({ store }) {
  const keys = await chatKeysSorted(store);
  const messages = [];
  for (const key of keys.slice(Math.max(0, keys.length - 200))) {
    const message = await getJson(store, key);
    if (message) messages.push(message);
  }
  const students = (await listJson(store, "students/")).filter(Boolean);
  return json({
    messages,
    members: students.map((student) => ({
      id: student.id,
      name: student.name,
      tradeId: student.tradeId || "",
      batch: student.batch || "",
      active: student.active !== false,
    })),
  });
}

export async function handleAdminChatSend({ store, body }) {
  await rateLimit(store, "admin-chat", "admin", 20, CHAT_WINDOW_MS);
  const text = clean(body.text, CHAT_TEXT);
  if (!text) throw new HttpError("खाली संदेश भेजा नहीं जा सकता", 400);
  const message = {
    id: String(chatKey()).slice(5),
    sid: "ADMIN",
    name: "संस्था (Admin)",
    tradeId: DEFAULT_TRADE_ID,
    text,
    createdAt: new Date().toISOString(),
  };
  await putJson(store, K.chatMessage(message.id), message);
  const keys = await chatKeysSorted(store);
  if (keys.length > CHAT_KEEP) {
    for (const key of keys.slice(0, keys.length - CHAT_KEEP)) await del(store, key);
  }
  await audit(store, "chat.admin-send", "admin", { id: message.id });
  return json({ ok: true, message });
}

export async function handleAdminChatDelete({ store, body }) {
  const id = clean(body.messageId ?? body.id, 60);
  if (!id) throw new HttpError("संदेश पहचान आवश्यक है", 400);
  const key = K.chatMessage(id);
  const message = await getJson(store, key);
  if (!message) throw new HttpError("संदेश नहीं मिला", 404);
  await del(store, key);
  await audit(store, "chat.delete", "admin", { id });
  return json({ ok: true });
}

/* ------------------------- विषय-वार प्रश्न-पत्र -------------------------- */

function topicName(question) {
  const topic = clean(question.topic, 120);
  return topic || "— विषय नहीं —";
}

async function subjectQuestions(store, subjectId, setId = "", allowedIds = null) {
  const all = (await listJson(store, `questions/${subjectId}/`)).filter(
    (question) =>
      question &&
      question.active !== false &&
      (!setId || String(question.setId || "") === setId) &&
      (!allowedIds || allowedIds.includes(question.qid))
  );
  const groups = new Map();
  for (const question of all) {
    const name = topicName(question);
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(question);
  }
  return groups;
}

export async function handleAdminTopics({ store, body, staff }) {
  if (staff && !staff.permissions.includes("questions") && !body.examId) {
    throw new HttpError("प्रश्न देखने के लिए परीक्षा चुनें", 403);
  }
  const subjectId = clean(body.subjectId, 40);
  if (!subjectId) throw new HttpError("विषय चुनें", 400);
  const exam = body.examId ? await getJson(store, K.exams(clean(body.examId, 80))) : null;
  if (body.examId && !exam) throw new HttpError("परीक्षा नहीं मिली", 404);
  if (exam && exam.subjectId !== "mixed" && exam.subjectId !== subjectId) {
    throw new HttpError("यह विषय चुनी गई परीक्षा का नहीं है", 400);
  }
  const groups = await subjectQuestions(
    store,
    subjectId,
    exam?.questionSetId || "",
    staff && !staff.permissions.includes("questions") && exam && !exam.questionSetId
      ? exam.questionIds
      : null
  );
  const topics = [...groups.entries()]
    .map(([topic, list]) => ({
      topic,
      count: list.length,
      marks: Math.round(list.reduce((sum, q) => sum + (q.marks ?? 1), 0) * 100) / 100,
    }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
  return json({ subjectId, topics, total: topics.reduce((sum, t) => sum + t.count, 0) });
}

function sample(list, count, randomize) {
  if (!randomize) return list.slice(0, count);
  const pool = [...list];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = crypto.randomInt(i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export async function handleAdminPaperBuild({ store, body, staff }) {
  if (staff && !staff.permissions.includes("questions") && !body.examId) {
    throw new HttpError("प्रश्न चुनने के लिए परीक्षा चुनें", 403);
  }
  const subjectId = clean(body.subjectId, 40);
  if (!subjectId) throw new HttpError("विषय चुनें", 400);
  const exam = body.examId ? await getJson(store, K.exams(clean(body.examId, 80))) : null;
  if (body.examId && !exam) throw new HttpError("परीक्षा नहीं मिली", 404);
  if (exam && exam.subjectId !== "mixed" && exam.subjectId !== subjectId) {
    throw new HttpError("यह विषय चुनी गई परीक्षा का नहीं है", 400);
  }
  const plan = Array.isArray(body.plan) ? body.plan : [];
  const wanted = plan
    .map((row) => ({ topic: clean(row.topic, 120), count: Math.max(0, Math.floor(Number(row.count) || 0)) }))
    .filter((row) => row.topic && row.count > 0);
  if (!wanted.length) throw new HttpError("कम-से-कम एक विषय के लिए प्रश्न संख्या दें", 400);
  const groups = await subjectQuestions(
    store,
    subjectId,
    exam?.questionSetId || "",
    staff && !staff.permissions.includes("questions") && exam && !exam.questionSetId
      ? exam.questionIds
      : null
  );
  const randomize = body.randomize !== false;
  const picked = [];
  const short = [];
  const byTopic = [];
  for (const row of wanted) {
    const pool = groups.get(row.topic) || [];
    if (!pool.length) {
      short.push({ topic: row.topic, want: row.count, have: 0 });
      continue;
    }
    const take = sample(pool, Math.min(row.count, pool.length), randomize);
    if (take.length < row.count) short.push({ topic: row.topic, want: row.count, have: pool.length });
    take.forEach((question) => picked.push(question));
    byTopic.push({ topic: row.topic, count: take.length });
  }
  if (short.length && picked.length === 0) {
    throw new HttpError(
      `इन विषयों में प्रश्न उपलब्ध नहीं हैं: ${short.map((s) => s.topic).join(", ")}`,
      400
    );
  }
  const seen = new Set();
  const questions = picked.filter((question) => !seen.has(question.qid) && seen.add(question.qid));
  const marks = Math.round(questions.reduce((sum, q) => sum + (q.marks ?? 1), 0) * 100) / 100;
  return json({
    questionIds: questions.map((question) => question.qid),
    questions: questions.map((question) => ({
      qid: question.qid,
      topic: topicName(question),
      text: question.text.slice(0, 120),
      marks: question.marks ?? 1,
    })),
    byTopic,
    total: questions.length,
    marks,
    short,
  });
}
