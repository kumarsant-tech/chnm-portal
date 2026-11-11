import api from "../api/handler.mjs";
import { getDb, listJson } from "../api/lib/db.mjs";
import { finalizeExpiredForExam } from "../api/lib/scoring.mjs";
import { processResultReleaseEmails } from "../api/lib/result-notifications.mjs";
import resourceApi from "../api/lib/api-resources.mjs";
import { REDIRECTS } from "./redirects.mjs";

const EXAM_CSP =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self' blob:; frame-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'";

function secure(response, pathname) {
  const headers = new Headers(response.headers);
  headers.set("x-frame-options", "SAMEORIGIN");
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set(
    "permissions-policy",
    "camera=(), microphone=(), geolocation=(), fullscreen=(self)"
  );
  if (pathname.startsWith("/exam/")) {
    headers.set("content-security-policy", EXAM_CSP);
    headers.set("cache-control", "no-store, max-age=0");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const studyChapter = url.pathname.match(/^\/study\/chapter\/(\d{1,2})\/?$/);
    if (studyChapter && Number(studyChapter[1]) >= 1 && Number(studyChapter[1]) <= 16) {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = "/study/chapter.html";
      assetUrl.search = `?m=${studyChapter[1]}`;
      const response = await env.ASSETS.fetch(new Request(assetUrl, request));
      return secure(response, url.pathname);
    }
    if (url.pathname === "/api/resources" || url.pathname.startsWith("/api/resources/")) {
      return resourceApi(request, { env });
    }
    const redirect = REDIRECTS.get(url.pathname);
    if (redirect) {
      return new Response(null, {
        status: 301,
        headers: { location: redirect, "cache-control": "no-store" },
      });
    }
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      if (!env.DB) {
        return Response.json({ error: "Cloudflare D1 database binding उपलब्ध नहीं है" }, { status: 503 });
      }
      return api(request, {
        ip: request.headers.get("cf-connecting-ip") || "unknown",
        env,
        waitUntil: ctx?.waitUntil?.bind(ctx),
      });
    }

    return secure(await env.ASSETS.fetch(request), url.pathname);
  },
  async scheduled(_controller, env) {
    if (!env.DB) throw new Error("Cloudflare D1 database binding उपलब्ध नहीं है");
    const store = await getDb(env);
    const exams = await listJson(store, "exams/");
    let finalized = 0;
    for (const exam of exams) {
      if (!exam) continue;
      if (exam.status === "published") {
        finalized += (await finalizeExpiredForExam(store, exam)).length;
      }
      if (
        exam.notifyResultsOnRelease === true &&
        exam.releaseResults === true &&
        (!exam.releaseAt || Date.parse(exam.releaseAt) <= Date.now())
      ) {
        try {
          await processResultReleaseEmails(store, env, exam);
        } catch (error) {
          console.error("scheduled result release email processing failed", {
            examId: exam.id,
            errorName: error instanceof Error ? error.name : "UnknownError",
          });
        }
      }
    }
    console.log("Expired exam attempts finalized:", finalized);
  },
};
