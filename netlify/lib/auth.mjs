import crypto from "node:crypto";
import { HttpError } from "./http.mjs";
import { K, getJson, putJson } from "./db.mjs";
import { FALLBACK_ADMIN } from "./admin-credentials.mjs";

const HOUR = 3600000;

function hasFallbackAdmin() {
  return Boolean(FALLBACK_ADMIN && FALLBACK_ADMIN.salt && FALLBACK_ADMIN.hash);
}

function sessionSecret() {
  // The bundled hash always exists, so tokens keep the same signature even if
  // env injection is inconsistent between function instances (which otherwise
  // invalidates tokens mid-session and logs the admin out).
  if (hasFallbackAdmin()) return FALLBACK_ADMIN.hash;
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
  if (!secret) {
    throw new HttpError(
      "सर्वर पर ADMIN_PASSWORD / ADMIN_SECRET सेट नहीं है",
      500
    );
  }
  return secret;
}

function digest(value) {
  return crypto.createHash("sha256").update(String(value)).digest();
}

export function safeEqual(a, b) {
  return crypto.timingSafeEqual(digest(a), digest(b));
}

function signPayload(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", sessionSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

function verifyPayload(token) {
  try {
    const [body, signature] = String(token || "").split(".");
    if (!body || !signature) return null;
    const expected = crypto
      .createHmac("sha256", sessionSecret())
      .update(body)
      .digest("base64url");
    if (!safeEqual(signature, expected)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload || typeof payload !== "object") return null;
    if (Number(payload.exp) <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function bearer(req) {
  const header = req.headers.get("authorization") || "";
  return header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
}

export function issueAdminToken() {
  return signPayload({ r: "admin", exp: Date.now() + 12 * HOUR });
}

export function issueStudentToken(studentId) {
  return signPayload({
    r: "student",
    sid: String(studentId),
    exp: Date.now() + 12 * HOUR,
  });
}

export function hasAdminPassword() {
  return Boolean(process.env.ADMIN_PASSWORD) || hasFallbackAdmin();
}

export function checkAdminPassword(password) {
  const configured = process.env.ADMIN_PASSWORD;
  if (configured) return safeEqual(password || "", configured);
  if (!hasFallbackAdmin()) return false;
  try {
    const actual = crypto.scryptSync(
      String(password || ""),
      Buffer.from(FALLBACK_ADMIN.salt, "hex"),
      FALLBACK_ADMIN.keylen,
      { N: FALLBACK_ADMIN.n, r: FALLBACK_ADMIN.r, p: FALLBACK_ADMIN.p }
    );
    const expected = Buffer.from(FALLBACK_ADMIN.hash, "hex");
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function hashPin(pin) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(String(pin), salt, 60000, 32, "sha256");
  return `pbkdf2$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export function checkPin(pin, stored) {
  try {
    const [kind, salt, hash] = String(stored || "").split("$");
    if (kind !== "pbkdf2" || !salt || !hash) return false;
    const expected = Buffer.from(hash, "base64url");
    const actual = crypto.pbkdf2Sync(
      String(pin || ""),
      Buffer.from(salt, "base64url"),
      60000,
      32,
      "sha256"
    );
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export async function requireAdmin(req) {
  const payload = verifyPayload(bearer(req));
  if (!payload || payload.r !== "admin") {
    throw new HttpError("एडमिन लॉगिन आवश्यक है", 401);
  }
  return payload;
}

export async function requireStudent(req, store) {
  const payload = verifyPayload(bearer(req));
  if (!payload || payload.r !== "student" || !payload.sid) {
    throw new HttpError("छात्र लॉगिन आवश्यक है", 401);
  }
  const student = await getJson(store, K.students(payload.sid));
  if (!student) throw new HttpError("छात्र रिकॉर्ड नहीं मिला", 401);
  if (student.active === false) {
    throw new HttpError("यह छात्र खाता निष्क्रिय कर दिया गया है", 403);
  }
  return student;
}

export async function rateLimit(store, scope, identity, max, windowMs) {
  const id = digest(identity).toString("hex").slice(0, 32);
  const key = K.rateLimit(scope, id);
  const now = Date.now();
  const record = (await getJson(store, key)) || { n: 0, reset: 0 };
  if (record.reset > now && record.n >= max) {
    const retryAfter = Math.ceil((record.reset - now) / 1000);
    throw new HttpError(
      `बहुत अधिक कोशिशें — ${Math.ceil(retryAfter / 60)} मिनट बाद प्रयास करें`,
      429,
      { retryAfter }
    );
  }
  if (record.reset <= now) {
    record.n = 0;
    record.reset = now + windowMs;
  }
  record.n += 1;
  await putJson(store, key, record);
}

export async function clearRateLimit(store, scope, identity) {
  const id = digest(identity).toString("hex").slice(0, 32);
  await store.delete(K.rateLimit(scope, id));
}

export async function audit(store, action, actor, details = {}) {
  const at = new Date().toISOString();
  const id = `${at.replace(/[:.]/g, "-")}-${crypto.randomBytes(4).toString("hex")}`;
  await putJson(store, K.audit(id), {
    id,
    at,
    action,
    actor,
    details,
  });
}

export async function recentAudit(store, limit = 30) {
  const keys = await store.list({ prefix: "audit/" });
  const entries = await Promise.all(
    (keys.blobs || [])
      .map((blob) => blob.key)
      .sort()
      .reverse()
      .slice(0, limit)
      .map((key) => getJson(store, key))
  );
  return entries.filter(Boolean);
}
