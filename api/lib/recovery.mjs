import crypto from "node:crypto";

export function resetBaseUrl(env) {
  const configured = String(env?.PUBLIC_BASE_URL || "");
  try {
    const url = new URL(configured);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return "";
    return url.origin;
  } catch {
    return "";
  }
}

export function createResetToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashResetToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

export function validResetToken(token) {
  return /^[A-Za-z0-9_-]{40,60}$/.test(String(token || ""));
}
