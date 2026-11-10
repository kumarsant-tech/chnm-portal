export class HttpError extends Error {
  constructor(message, status = 400, details = null) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export function fail(message, status = 400, details = null) {
  return json({ error: message, details }, status);
}

const BODY_CACHE = new WeakMap();

export async function readJson(req) {
  if (BODY_CACHE.has(req)) return BODY_CACHE.get(req);
  const type = req.headers.get("content-type") || "";
  if (!type.includes("application/json")) {
    throw new HttpError("अनुरोध JSON फॉर्मेट में होना चाहिए", 415);
  }
  let body;
  try {
    body = await req.json();
  } catch {
    throw new HttpError("गलत JSON अनुरोध", 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError("अनुरोध का फॉर्मेट गलत है", 400);
  }
  BODY_CACHE.set(req, body);
  return body;
}

export function getIp(req, ctx) {
  return (
    ctx?.ip ||
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function csvResponse(csv, filename) {
  return new Response(`\ufeff${csv}`, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}

export const nowIso = () => new Date().toISOString();
