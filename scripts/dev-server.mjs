// Local development + E2E server. Serves the built ./dist site and calls the
// real Netlify Function handler directly with an in-memory Blobs replacement.
import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 8888);

// netlify.toml के [[redirects]] यहाँ भी लागू करता है ताकि लोकल जाँच production जैसी रहे।
const TOML = await import("node:fs/promises").then((fs) =>
  fs.readFile(path.join(ROOT, "netlify.toml"), "utf8")
);
const MOVED_PATHS = {};
for (const m of TOML.matchAll(/from\s*=\s*"([^"]+)"\s*\n\s*to\s*=\s*"([^"]+)"/g)) {
  MOVED_PATHS[m[1]] = m[2];
}

process.env.USE_MEMORY_STORE = "1";
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin12345";
process.env.ADMIN_SECRET =
  process.env.ADMIN_SECRET || "local-dev-only-secret-please-change-0123456789abcdef";

const { default: api } = await import("../netlify/functions/api.mjs");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".wasm": "application/wasm",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".webmanifest": "application/manifest+json",
};

function baseHeaders() {
  return {
    "x-frame-options": "SAMEORIGIN",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), fullscreen=(self)",
  };
}

function sendJson(res, status, payload) {
  const body = Buffer.from(JSON.stringify(payload));
  res.writeHead(status, {
    ...baseHeaders(),
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": body.length,
  });
  res.end(body);
}

async function handleApi(req, res, url) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue;
    if (["host", "connection", "content-length", "transfer-encoding", "accept-encoding"].includes(key)) {
      continue;
    }
    headers.set(key, Array.isArray(value) ? value.join(", ") : String(value));
  }
  if (!headers.has("x-forwarded-for")) {
    headers.set("x-forwarded-for", req.socket.remoteAddress || "127.0.0.1");
  }
  const request = new Request("http://127.0.0.1" + url.pathname + url.search, {
    method: req.method,
    headers: headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
  });
  try {
    const response = await api(request, { ip: req.socket.remoteAddress || "127.0.0.1" });
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("content-length", buffer.length);
    res.end(buffer);
  } catch (error) {
    console.error("api failure", error);
    sendJson(res, 500, { error: "स्थानीय सर्वर में त्रुटि: " + (error.message || error) });
  }
}

async function handleStatic(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendJson(res, 405, { error: "केवल GET अनुरोध समर्थित है" });
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    sendJson(res, 400, { error: "गलत URL" });
    return;
  }
  const rel = pathname.replace(/^\/+/, "");
  let filePath = path.resolve(DIST, rel);
  if (filePath !== DIST && !filePath.startsWith(DIST + path.sep)) {
    sendJson(res, 403, { error: "पहुँच नहीं" });
    return;
  }

  let info = await stat(filePath).catch(() => null);
  if (info && info.isDirectory()) {
    if (!pathname.endsWith("/")) {
      res.writeHead(301, { ...baseHeaders(), location: pathname + "/" + url.search });
      res.end();
      return;
    }
    filePath = path.join(filePath, "index.html");
    info = await stat(filePath).catch(() => null);
  }

  let statusCode = 200;
  if (!info || !info.isFile()) {
    filePath = path.join(DIST, "404.html");
    info = await stat(filePath).catch(() => null);
    statusCode = 404;
    if (!info) {
      res.writeHead(404, { ...baseHeaders(), "content-type": "text/plain; charset=utf-8" });
      res.end("404 — पेज नहीं मिला");
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const isExam = filePath.startsWith(path.join(DIST, "exam") + path.sep);
  res.writeHead(statusCode, {
    ...baseHeaders(),
    "content-type": MIME[ext] || "application/octet-stream",
    "cache-control": ext === ".html" || isExam ? "no-store, max-age=0" : "no-cache",
    ...(isExam
      ? {
          "content-security-policy":
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self' blob:; frame-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
        }
      : {}),
    "content-length": info.size,
  });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  createReadStream(filePath)
    .on("error", () => {
      res.destroy();
    })
    .pipe(res);
}

await build();

const server = http.createServer(async (req, res) => {
  let url;
  try {
    url = new URL(req.url || "/", "http://" + (req.headers.host || "127.0.0.1"));
  } catch {
    sendJson(res, 400, { error: "गलत URL" });
    return;
  }
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
    await handleApi(req, res, url);
    return;
  }
  const moved = MOVED_PATHS[url.pathname];
  if (moved) {
    res.writeHead(301, { location: moved, "Cache-Control": "no-store" });
    res.end();
    return;
  }
  await handleStatic(req, res, url);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error("पोर्ट " + PORT + " पहले से उपयोग में है — PORT बदलकर चलाएँ।");
  } else {
    console.error("सर्वर त्रुटि:", error);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log("स्थानीय साइट:  http://" + HOST + ":" + PORT + "/index.html");
  console.log("छात्र पोर्टल:   http://" + HOST + ":" + PORT + "/exam/");
  console.log("एडमिन पैनल:    http://" + HOST + ":" + PORT + "/exam/admin.html");
  console.log("एडमिन पासवर्ड: " + process.env.ADMIN_PASSWORD + "  (केवल स्थानीय डेमो)");
  console.log("डेटा: इन-मेमोरी (सर्वर बंद होने पर रीसेट)");
});
