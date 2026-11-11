import crypto from "node:crypto";
import { getDb, K, listJson, putJson } from "./db.mjs";
import { HttpError, fail, json } from "./http.mjs";
import { requireAdmin, requireStudent } from "./auth.mjs";

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const RESOURCE_ID = /^RES-[A-F0-9]{20}$/;

function safeResource(resource) {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    fileName: resource.fileName,
    mimeType: resource.mimeType,
    size: resource.size,
    tradeId: resource.tradeId || "",
    createdAt: resource.createdAt,
  };
}

function fileName(value) {
  const name = String(value || "")
    .replace(/[\r\n\0-\x1f\x7f]/g, "")
    .split(/[\\/]/)
    .pop()
    .trim()
    .slice(0, 180);
  return name || "resource";
}

function fileType(name, bytes) {
  const ext = name.toLowerCase().split(".").pop();
  if (ext === "pdf" && bytes.subarray(0, 5).toString() === "%PDF-") {
    return "application/pdf";
  }
  if (ext === "ppt" && bytes.subarray(0, 8).toString("hex") === "d0cf11e0a1b11ae1") {
    return "application/vnd.ms-powerpoint";
  }
  if (
    ext === "pptx" &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04
  ) {
    return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  }
  return "";
}

function contentDisposition(name) {
  const fallback = name.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120) || "resource";
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

async function listResources(req, store, env) {
  const url = new URL(req.url);
  const adminView = url.searchParams.get("admin") === "1";
  const student = adminView ? null : await requireStudent(req, store, env);
  if (adminView) await requireAdmin(req, store, env);
  if (!env.RESOURCES || typeof env.RESOURCES.get !== "function") {
    throw new HttpError("Cloudflare R2 bucket binding RESOURCES सेट नहीं है", 503);
  }
  const resources = (await listJson(store, "resources/"))
    .filter((resource) => resource && (adminView ||
      (resource.active !== false && (!resource.tradeId || resource.tradeId === student.tradeId))))
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    .map(safeResource);
  return json({ ok: true, resources });
}

async function uploadResource(req, store, env) {
  const admin = await requireAdmin(req, store, env);
  if (!env.RESOURCES || typeof env.RESOURCES.put !== "function") {
    throw new HttpError("Cloudflare R2 bucket binding RESOURCES सेट नहीं है", 503);
  }
  if (!(req.headers.get("content-type") || "").toLowerCase().includes("multipart/form-data")) {
    throw new HttpError("फ़ाइल multipart form में भेजें", 415);
  }
  let form;
  try {
    form = await req.formData();
  } catch {
    throw new HttpError("फ़ाइल अपलोड अनुरोध पढ़ा नहीं जा सका", 400);
  }
  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function" || !file.name) {
    throw new HttpError("PDF या PowerPoint फ़ाइल चुनें", 400);
  }
  if (file.size < 1 || file.size > MAX_FILE_BYTES) {
    throw new HttpError("फ़ाइल 1 byte से 20 MB के बीच होनी चाहिए", 413);
  }
  const name = fileName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());
  const mimeType = fileType(name, bytes);
  if (!mimeType) {
    throw new HttpError("केवल वैध PDF, PPT या PPTX फ़ाइल अपलोड करें", 415);
  }
  const title = String(form.get("title") || "").trim();
  const description = String(form.get("description") || "").trim();
  const tradeId = String(form.get("tradeId") || "").trim();
  if (!title || title.length > 120 || description.length > 500 || tradeId.length > 80) {
    throw new HttpError("शीर्षक आवश्यक है; विवरण 500 अक्षरों से कम रखें", 400);
  }
  if (tradeId) {
    const trade = await store.get(K.trades(tradeId), { type: "json" });
    if (!trade || trade.active === false) throw new HttpError("चुना गया ट्रेड उपलब्ध नहीं है", 400);
  }
  const id = `RES-${crypto.randomBytes(10).toString("hex").toUpperCase()}`;
  const objectKey = `resources/${id}/${name}`;
  const resource = {
    id,
    title,
    description,
    fileName: name,
    mimeType,
    size: bytes.length,
    tradeId,
    objectKey,
    active: true,
    createdAt: new Date().toISOString(),
    createdBy: admin.sub || "admin",
  };
  await env.RESOURCES.put(objectKey, bytes, {
    httpMetadata: { contentType: mimeType },
    customMetadata: { resourceId: id },
  });
  try {
    await putJson(store, K.resource(id), resource);
  } catch (error) {
    await env.RESOURCES.delete(objectKey);
    throw error;
  }
  return json({ ok: true, resource: safeResource(resource) }, 201);
}

async function getResource(req, store, env, id) {
  if (!RESOURCE_ID.test(id)) throw new HttpError("संसाधन नहीं मिला", 404);
  const url = new URL(req.url);
  const adminView = url.searchParams.get("admin") === "1";
  const student = adminView ? null : await requireStudent(req, store, env);
  if (adminView) await requireAdmin(req, store, env);
  const resource = await store.get(K.resource(id), { type: "json" });
  if (!resource || resource.active === false) throw new HttpError("संसाधन नहीं मिला", 404);
  if (!adminView && resource.tradeId && resource.tradeId !== student.tradeId) {
    throw new HttpError("संसाधन नहीं मिला", 404);
  }
  if (!env.RESOURCES || typeof env.RESOURCES.get !== "function") {
    throw new HttpError("Cloudflare R2 bucket binding RESOURCES सेट नहीं है", 503);
  }
  const object = await env.RESOURCES.get(resource.objectKey);
  if (!object) throw new HttpError("फ़ाइल उपलब्ध नहीं है — एडमिन से संपर्क करें", 404);
  const headers = new Headers({
    "content-type": resource.mimeType,
    "content-disposition": contentDisposition(resource.fileName),
    "cache-control": "private, no-store, max-age=0",
    "x-content-type-options": "nosniff",
    "content-security-policy": "default-src 'none'; sandbox",
  });
  if (object.size) headers.set("content-length", String(object.size));
  return new Response(object.body, { status: 200, headers });
}

async function deleteResource(req, store, env) {
  await requireAdmin(req, store, env);
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";
  if (!RESOURCE_ID.test(id)) throw new HttpError("संसाधन नहीं मिला", 404);
  const resource = await store.get(K.resource(id), { type: "json" });
  if (!resource) throw new HttpError("संसाधन नहीं मिला", 404);
  if (!env.RESOURCES || typeof env.RESOURCES.delete !== "function") {
    throw new HttpError("Cloudflare R2 bucket binding RESOURCES सेट नहीं है", 503);
  }
  await env.RESOURCES.delete(resource.objectKey);
  await store.delete(K.resource(id));
  return json({ ok: true });
}

export default async function handleResourceRequest(req, { env }) {
  try {
    if (!env.DB && process.env.USE_MEMORY_STORE !== "1") {
      return fail("Cloudflare D1 database binding उपलब्ध नहीं है", 503);
    }
    const store = await getDb(env);
    const url = new URL(req.url);
    if (url.pathname === "/api/resources" && req.method === "GET") {
      return await listResources(req, store, env);
    }
    if (url.pathname === "/api/resources" && req.method === "POST") {
      return await uploadResource(req, store, env);
    }
    if (url.pathname === "/api/resources" && req.method === "DELETE") {
      return await deleteResource(req, store, env);
    }
    const match = url.pathname.match(/^\/api\/resources\/([^/]+)$/);
    if (match && req.method === "GET") {
      return await getResource(req, store, env, match[1]);
    }
    return fail("संसाधन API मार्ग उपलब्ध नहीं है", 404);
  } catch (error) {
    if (error instanceof HttpError) return fail(error.message, error.status, error.details);
    console.error("resource API error", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return fail("संसाधन अनुरोध पूरा नहीं हो सका", 500);
  }
}
