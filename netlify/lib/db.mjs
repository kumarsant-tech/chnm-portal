// Data access layer. Uses Netlify Blobs in production and an in-memory store
// for local development/tests (USE_MEMORY_STORE=1).

const MEMORY = new Map();

function clone(value) {
  return value === undefined ? undefined : structuredClone(value);
}

function memoryStore() {
  return {
    async get(key, options = {}) {
      if (!MEMORY.has(key)) return null;
      const value = MEMORY.get(key);
      if (options.type === "json") return clone(value);
      return typeof value === "string" ? value : JSON.stringify(value);
    },
    async set(key, value) {
      MEMORY.set(key, String(value));
    },
    async setJSON(key, value) {
      MEMORY.set(key, clone(value));
    },
    async delete(key) {
      MEMORY.delete(key);
    },
    async list({ prefix = "" } = {}) {
      return {
        blobs: [...MEMORY.keys()]
          .filter((key) => key.startsWith(prefix))
          .sort()
          .map((key) => ({ key })),
        directories: [],
      };
    },
  };
}

async function blobsStore(name) {
  // The Blobs token in the function environment changes per invocation and
  // expires. A store instance cached across warm invocations would keep using
  // the old token and fail with "Failed to decode token: Token expired", so a
  // fresh store must be created for every request.
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name, consistency: "strong" });
}

function storeName() {
  const name = String(process.env.BLOBS_STORE || "").trim();
  // An invalid value (spaces, slashes, empty) makes every getStore call throw.
  return /^[A-Za-z0-9_-]{1,64}$/.test(name) ? name : "chnm-exam-v2";
}

async function netlifyStore() {
  return blobsStore(storeName());
}

export async function getLegacyDb() {
  if (usingMemoryStore()) return memoryStore();
  return blobsStore("exam");
}

export const usingMemoryStore = () => process.env.USE_MEMORY_STORE === "1";

export async function getDb() {
  return usingMemoryStore() ? memoryStore() : netlifyStore();
}

export function __resetMemoryStore() {
  MEMORY.clear();
}

export function __memoryEntries() {
  return MEMORY;
}

export const K = {
  settings: () => "settings/site",
  subjects: (id) => `subjects/${id}`,
  trades: (id) => `trades/${id}`,
  students: (id) => `students/${id}`,
  mobileIndex: (mobile) => `idx/mobile/${mobile}`,
  exams: (id) => `exams/${id}`,
  paper: (examId, version) => `papers/${examId}/v${version}`,
  questions: (subjectId, qid) => `questions/${subjectId}/${qid}`,
  questionIndex: (qid) => `idx/question/${qid}`,
  attempt: (examId, studentId) => `attempts/${examId}/${studentId}`,
  attemptIndex: (studentId, examId) => `idx/student-attempts/${studentId}/${examId}`,
  attemptExamIndex: (examId, studentId) => `idx/exam-attempts/${examId}/${studentId}`,
  result: (attemptId) => `results/${attemptId}`,
  studentResultIndex: (studentId, attemptId) => `idx/student-results/${studentId}/${attemptId}`,
  examResultIndex: (examId, attemptId) => `idx/exam-results/${examId}/${attemptId}`,
  rateLimit: (scope, id) => `rl/${scope}/${id}`,
  audit: (id) => `audit/${id}`,
  registrationSeq: () => "meta/registration-seq",
  notice: (id) => `notices/${id}`,
  noticeRead: (studentId, noticeId) => `idx/notice-read/${studentId}/${noticeId}`,
  chatMessage: (id) => `chat/${id}`,
};

export async function getJson(store, key, fallback = null) {
  const value = await store.get(key, { type: "json" });
  return value ?? fallback;
}

export async function putJson(store, key, value) {
  await store.setJSON(key, value);
  return value;
}

export async function del(store, key) {
  await store.delete(key);
}

export async function listKeys(store, prefix = "") {
  const result = await store.list({ prefix });
  return (result.blobs || []).map((blob) => blob.key);
}

export async function listJson(store, prefix = "") {
  const keys = await listKeys(store, prefix);
  return (await mapLimit(keys, 12, (key) => getJson(store, key))).filter(Boolean);
}

export async function mapLimit(items, limit, fn) {
  const list = [...items];
  const output = new Array(list.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, list.length) }, async () => {
    while (cursor < list.length) {
      const index = cursor++;
      output[index] = await fn(list[index], index);
    }
  });
  await Promise.all(workers);
  return output;
}

export async function deleteKeys(store, keys) {
  await mapLimit(keys, 12, (key) => store.delete(key));
}

export function newId(prefix, length = 10) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}${out}`;
}
