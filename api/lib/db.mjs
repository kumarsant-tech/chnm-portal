// Data access layer. Uses Cloudflare D1 in production and an in-memory store
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
    async setIfAbsent(key, value) {
      if (MEMORY.has(key)) return false;
      MEMORY.set(key, clone(value));
      return true;
    },
    async consumeRateLimit(key, now, max, windowMs) {
      const current = MEMORY.get(key) || { n: 0, reset: 0 };
      const record = current.reset <= now
        ? { n: 1, reset: now + windowMs }
        : { n: current.n >= max + 1 ? current.n : current.n + 1, reset: current.reset };
      MEMORY.set(key, record);
      return record;
    },
    async nextSequence(key) {
      const current = MEMORY.get(key);
      const value = Number(current?.value) || 0;
      const next = { value: value + 1, updatedAt: new Date().toISOString() };
      MEMORY.set(key, next);
      return next.value;
    },
    async increment(key) {
      const next = (Number(MEMORY.get(key)) || 0) + 1;
      MEMORY.set(key, String(next));
      return next;
    },
    async delete(key) {
      MEMORY.delete(key);
    },
    async consumeResetToken(key, now, tokenHash = "") {
      const value = MEMORY.get(key);
      if (!value || Number(value.expiresAt) <= now) {
        MEMORY.delete(key);
        return null;
      }
      if (tokenHash && value.tokenHash !== tokenHash) return null;
      MEMORY.delete(key);
      return clone(value);
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

function d1Store(database) {
  const upperBound = (prefix) => `${prefix}\uffff`;
  return {
    async get(key, options = {}) {
      const row = await database
        .prepare("SELECT value FROM app_kv WHERE key = ?")
        .bind(String(key))
        .first();
      if (!row) return null;
      return options.type === "json" ? JSON.parse(row.value) : row.value;
    },
    async set(key, value) {
      await database
        .prepare(
          "INSERT INTO app_kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP"
        )
        .bind(String(key), String(value))
        .run();
    },
    async setJSON(key, value) {
      return this.set(key, JSON.stringify(value));
    },
    async setIfAbsent(key, value) {
      const result = await database
        .prepare("INSERT OR IGNORE INTO app_kv (key, value) VALUES (?, ?)")
        .bind(String(key), JSON.stringify(value))
        .run();
      return Number(result.meta?.changes ?? result.changes ?? 0) > 0;
    },
    async consumeRateLimit(key, now, max, windowMs) {
      const row = await database
        .prepare(
          "INSERT INTO app_kv (key, value) VALUES (?, json_object('n', 1, 'reset', ?)) " +
            "ON CONFLICT(key) DO UPDATE SET value = json_object(" +
            "'n', CASE WHEN CAST(json_extract(app_kv.value, '$.reset') AS INTEGER) <= ? THEN 1 " +
            "WHEN CAST(json_extract(app_kv.value, '$.n') AS INTEGER) <= ? " +
            "THEN CAST(json_extract(app_kv.value, '$.n') AS INTEGER) + 1 " +
            "ELSE CAST(json_extract(app_kv.value, '$.n') AS INTEGER) END, " +
            "'reset', CASE WHEN CAST(json_extract(app_kv.value, '$.reset') AS INTEGER) <= ? " +
            "THEN ? ELSE CAST(json_extract(app_kv.value, '$.reset') AS INTEGER) END), " +
            "updated_at = CURRENT_TIMESTAMP " +
            "RETURNING CAST(json_extract(value, '$.n') AS INTEGER) AS n, " +
            "CAST(json_extract(value, '$.reset') AS INTEGER) AS reset"
        )
        .bind(String(key), now + windowMs, now, max, now, now + windowMs)
        .first();
      if (!row) throw new Error("D1 rate limit could not be updated");
      return { n: Number(row.n), reset: Number(row.reset) };
    },
    async nextSequence(key) {
      const row = await database
        .prepare(
          "INSERT INTO app_kv (key, value) VALUES (?, json_object('value', 1, 'updatedAt', CURRENT_TIMESTAMP)) ON CONFLICT(key) DO UPDATE SET value = json_object('value', COALESCE(CAST(json_extract(app_kv.value, '$.value') AS INTEGER), 0) + 1, 'updatedAt', CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP RETURNING CAST(json_extract(value, '$.value') AS INTEGER) AS value"
        )
        .bind(String(key))
        .first();
      if (!row || !Number.isSafeInteger(Number(row.value))) {
        throw new Error("D1 registration sequence could not be allocated");
      }
      return Number(row.value);
    },
    async increment(key) {
      const row = await database
        .prepare(
          "INSERT INTO app_kv (key, value) VALUES (?, '1') " +
            "ON CONFLICT(key) DO UPDATE SET value = CAST(CAST(app_kv.value AS INTEGER) + 1 AS TEXT), " +
            "updated_at = CURRENT_TIMESTAMP RETURNING CAST(value AS INTEGER) AS value"
        )
        .bind(String(key))
        .first();
      if (!row || !Number.isSafeInteger(Number(row.value))) {
        throw new Error("D1 counter could not be incremented");
      }
      return Number(row.value);
    },
    async delete(key) {
      await database.prepare("DELETE FROM app_kv WHERE key = ?").bind(String(key)).run();
    },
    async consumeResetToken(key, now, tokenHash = "") {
      const row = await database
        .prepare(
          "DELETE FROM app_kv WHERE key = ? AND CAST(json_extract(value, '$.expiresAt') AS INTEGER) > ? " +
            "AND (? = '' OR json_extract(value, '$.tokenHash') = ?) RETURNING value"
        )
        .bind(String(key), now, tokenHash, tokenHash)
        .first();
      if (!row) {
        await database
          .prepare(
            "DELETE FROM app_kv WHERE key = ? AND CAST(json_extract(value, '$.expiresAt') AS INTEGER) <= ?"
          )
          .bind(String(key), now)
          .run();
      }
      return row ? JSON.parse(row.value) : null;
    },
    async list({ prefix = "" } = {}) {
      const { results } = await database
        .prepare("SELECT key FROM app_kv WHERE key >= ? AND key < ? ORDER BY key")
        .bind(String(prefix), upperBound(String(prefix)))
        .all();
      return { blobs: results.map(({ key }) => ({ key })), directories: [] };
    },
  };
}

export async function getLegacyDb(env = {}) {
  if (usingMemoryStore()) return memoryStore();
  if (env.LEGACY_DB) return d1Store(env.LEGACY_DB);
  throw new Error("Legacy D1 database binding उपलब्ध नहीं है");
}

export const usingMemoryStore = () => process.env.USE_MEMORY_STORE === "1";

export async function getDb(env = {}) {
  if (env.DB) return d1Store(env.DB);
  if (usingMemoryStore()) return memoryStore();
  throw new Error("Cloudflare D1 database binding उपलब्ध नहीं है");
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
  resultReleaseEmail: (examId, studentId) => `emails/result-release/${examId}/${studentId}`,
  rateLimit: (scope, id) => `rl/${scope}/${id}`,
  authFailures: (scope, id) => `auth/failures/${scope}/${id}`,
  authLockout: (scope, id) => `auth/lockout/${scope}/${id}`,
  adminPasswordOverride: () => "auth/admin-password-override",
  adminAuthVersion: () => "auth/admin-auth-version",
  adminProfile: () => "auth/admin-profile",
  adminPasswordReset: (tokenHash) => `auth/admin-password-reset/${tokenHash}`,
  studentPasswordReset: (tokenHash) => `auth/student-password-reset/${tokenHash}`,
  studentPasswordResetIndex: (studentId) => `auth/student-password-reset-index/${studentId}`,
  examController: () => "auth/exam-controller",
  staffUser: (id) => `auth/staff-users/${id}`,
  staffEmailIndex: (emailHash) => `auth/staff-email/${emailHash}`,
  staffInvite: (id) => `auth/staff-invites/${id}`,
  studentCitsIndex: (cits) => `idx/cits/${cits}`,
  audit: (id) => `audit/${id}`,
  registrationSeq: () => "meta/registration-seq",
  notice: (id) => `notices/${id}`,
  noticeRead: (studentId, noticeId) => `idx/notice-read/${studentId}/${noticeId}`,
  chatMessage: (id) => `chat/${id}`,
  resource: (id) => `resources/${id}`,
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
