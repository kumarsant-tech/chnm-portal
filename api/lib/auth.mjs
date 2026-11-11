import crypto from "node:crypto";
import { HttpError } from "./http.mjs";
import { K, getJson, putJson } from "./db.mjs";

const HOUR = 3600000;
const PASSWORD_FAILURE_LIMIT = 3;
const PASSWORD_LOCKOUT_MS = HOUR;

function configValue(env, key) {
  return String(env?.[key] || process.env[key] || "");
}

function sessionSecret(env) {
  const secret = configValue(env, "ADMIN_SECRET");
  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new HttpError("Cloudflare secret ADMIN_SECRET कम-से-कम 32 bytes का होना चाहिए", 500);
  }
  return secret;
}

function digest(value) {
  return crypto.createHash("sha256").update(String(value)).digest();
}

export function safeEqual(a, b) {
  return crypto.timingSafeEqual(digest(a), digest(b));
}

function signPayload(payload, env) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", sessionSecret(env))
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

function verifyPayload(token, env) {
  try {
    const [body, signature] = String(token || "").split(".");
    if (!body || !signature) return null;
    const expected = crypto
      .createHmac("sha256", sessionSecret(env))
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

export function issueAdminToken(env, authVersion = 0) {
  return signPayload({ r: "admin", av: authVersion, exp: Date.now() + 12 * HOUR }, env);
}

export async function adminAuthVersion(store) {
  return Number(await getJson(store, K.adminAuthVersion())) || 0;
}

export async function bumpAdminAuthVersion(store) {
  if (typeof store.increment !== "function") {
    throw new Error("Storage provider does not support atomic counters");
  }
  return store.increment(K.adminAuthVersion());
}

export function issueStudentToken(studentId, env, authVersion = 0) {
  return signPayload({
    r: "student",
    sid: String(studentId),
    sv: Number(authVersion) || 0,
    exp: Date.now() + 12 * HOUR,
  }, env);
}

export function hasAdminPassword(env) {
  return Boolean(configValue(env, "ADMIN_PASSWORD"));
}

export async function hasAdminCredential(env, store) {
  return Boolean(await getJson(store, K.adminPasswordOverride())) || hasAdminPassword(env);
}

export async function checkAdminPassword(password, env, store) {
  const override = await getJson(store, K.adminPasswordOverride());
  if (override) return await checkPassword(password, override);
  const configured = configValue(env, "ADMIN_PASSWORD");
  return Boolean(configured) && safeEqual(password || "", configured);
}

async function derivePasswordHash(password, salt, iterations) {
  try {
    const key = await globalThis.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(String(password)),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await globalThis.crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
      key,
      256
    );
    return Buffer.from(bits);
  } catch (error) {
    console.error("password derivation failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    throw error;
  }
}

export async function hashPassword(password) {
  let salt;
  try {
    salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  } catch (error) {
    console.error("password salt generation failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    throw error;
  }
  const hash = await derivePasswordHash(password, salt, 100000);
  return `pbkdf2v3$${Buffer.from(salt).toString("base64url")}$${hash.toString("base64url")}`;
}

export async function checkPassword(password, stored) {
  try {
    const [kind, salt, hash] = String(stored || "").split("$");
    const iterations =
      kind === "pbkdf2v3" ? 100000 : kind === "pbkdf2v2" ? 120000 : kind === "pbkdf2" ? 60000 : 0;
    if (!iterations || !salt || !hash) return false;
    const expected = Buffer.from(hash, "base64url");
    const actual = await derivePasswordHash(
      String(password || ""),
      Buffer.from(salt, "base64url"),
      iterations
    );
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export async function hashPin(pin) {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePasswordHash(pin, salt, 60000);
  return `pbkdf2$${Buffer.from(salt).toString("base64url")}$${hash.toString("base64url")}`;
}

export async function checkPin(pin, stored) {
  try {
    const [kind, salt, hash] = String(stored || "").split("$");
    if (kind !== "pbkdf2" || !salt || !hash) return false;
    const expected = Buffer.from(hash, "base64url");
    const actual = await derivePasswordHash(
      String(pin || ""),
      Buffer.from(salt, "base64url"),
      60000
    );
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export async function requireAdmin(req, store, env) {
  const payload = verifyPayload(bearer(req), env);
  if (!payload || payload.r !== "admin") {
    throw new HttpError("एडमिन लॉगिन आवश्यक है", 401);
  }
  if (Number(payload.av ?? 0) !== (await adminAuthVersion(store))) {
    throw new HttpError("एडमिन सत्र समाप्त हो गया है — दोबारा लॉगिन करें", 401);
  }
  return payload;
}

export async function requireStudent(req, store, env, allowPasswordChange = false) {
  const payload = verifyPayload(bearer(req), env);
  if (!payload || payload.r !== "student" || !payload.sid) {
    throw new HttpError("छात्र लॉगिन आवश्यक है", 401);
  }
  const student = await getJson(store, K.students(payload.sid));
  if (!student) throw new HttpError("छात्र रिकॉर्ड नहीं मिला", 401);
  if (Number(payload.sv ?? 0) !== (Number(student.authVersion) || 0)) {
    throw new HttpError("छात्र सत्र समाप्त हो गया है — दोबारा लॉगिन करें", 401);
  }
  if (student.active === false) {
    throw new HttpError("यह छात्र खाता निष्क्रिय कर दिया गया है", 403);
  }
  if (!allowPasswordChange && (student.mustChangePassword || !student.passwordHash)) {
    throw new HttpError("पहले अपना नया पासवर्ड सेट करें", 428, { passwordChangeRequired: true });
  }
  return student;
}

export async function rateLimit(store, scope, identity, max, windowMs) {
  const id = digest(identity).toString("hex").slice(0, 32);
  const key = K.rateLimit(scope, id);
  const now = Date.now();
  if (typeof store.consumeRateLimit !== "function") {
    throw new Error("Storage provider does not support atomic rate limiting");
  }
  const record = await store.consumeRateLimit(key, now, max, windowMs);
  if (record.reset > now && record.n > max) {
    const retryAfter = Math.ceil((record.reset - now) / 1000);
    throw new HttpError(
      `बहुत अधिक कोशिशें — ${Math.ceil(retryAfter / 60)} मिनट बाद प्रयास करें`,
      429,
      { retryAfter }
    );
  }
}

export async function clearRateLimit(store, scope, identity) {
  const id = digest(identity).toString("hex").slice(0, 32);
  await store.delete(K.rateLimit(scope, id));
}

function authIdentityKeys(scope, identities) {
  return [...new Set(identities.filter(Boolean).map((identity) => {
    const id = digest(`${scope}:${String(identity).trim().toLowerCase()}`)
      .toString("hex")
      .slice(0, 32);
    return id;
  }))];
}

export async function assertAuthUnlocked(store, scope, identities) {
  const now = Date.now();
  let latestExpiration = 0;
  const identityKeys = authIdentityKeys(scope, identities);
  for (const id of identityKeys) {
    const lockKey = K.authLockout(scope, id);
    const lock = await getJson(store, lockKey);
    const expiresAt = Number(lock?.expiresAt) || 0;
    if (expiresAt > now) {
      latestExpiration = Math.max(latestExpiration, expiresAt);
    } else if (lock) {
      await store.delete(lockKey);
      await store.delete(K.authFailures(scope, id));
    }
  }
  if (latestExpiration > now) {
    const retryAfter = Math.ceil((latestExpiration - now) / 1000);
    throw new HttpError(
      "तीन गलत प्रयासों के बाद लॉगिन और पासवर्ड रीसेट एक घंटे के लिए लॉक है",
      429,
      { retryAfter }
    );
  }
}

export async function recordAuthFailure(store, scope, counterIdentity, lockIdentities) {
  if (typeof store.consumeRateLimit !== "function") {
    throw new Error("Storage provider does not support atomic authentication counters");
  }
  const now = Date.now();
  const counterId = authIdentityKeys(scope, [counterIdentity])[0];
  const record = await store.consumeRateLimit(
    K.authFailures(scope, counterId),
    now,
    Number.MAX_SAFE_INTEGER,
    PASSWORD_LOCKOUT_MS
  );
  if (record.n < PASSWORD_FAILURE_LIMIT) return false;
  const expiresAt = now + PASSWORD_LOCKOUT_MS;
  const lockIds = authIdentityKeys(scope, lockIdentities);
  await Promise.all(
    lockIds.map((id) => store.setJSON(K.authLockout(scope, id), { expiresAt }))
  );
  return true;
}

export async function clearAuthFailures(store, scope, identities) {
  const identityKeys = authIdentityKeys(scope, identities);
  await Promise.all(
    identityKeys.flatMap((id) => [
      store.delete(K.authFailures(scope, id)),
      store.delete(K.authLockout(scope, id)),
    ])
  );
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
