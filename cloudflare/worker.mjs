import api from "../netlify/functions/api.mjs";
import { getDb, listJson } from "../netlify/lib/db.mjs";
import { finalizeExpiredForExam } from "../netlify/lib/scoring.mjs";

const EXAM_CSP =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self' blob:; frame-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'";

const REDIRECTS = new Map([
  ["/Computer-Lab", "/Computer-Lab/02-basics.html"],
  ["/Computer-Lab/", "/Computer-Lab/02-basics.html"],
  ["/Computer-Lab/index.html", "/Computer-Lab/02-basics.html"],
  ["/Computer-Lab-3D-Single-File.html", "/Computer-Lab/02-basics.html"],
  ["/SMPS-Lab/Computer-Lab-3D-Single-File.html", "/Computer-Lab/02-basics.html"],
  ["/assembly-lab.html", "/Computer-Lab/assembly-lab.html"],
  ["/basic-office-lab.html", "/Computer-Lab/basic-office-lab.html"],
]);

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
  async fetch(request, env) {
    const url = new URL(request.url);
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
      if (!exam || exam.status !== "published") continue;
      finalized += (await finalizeExpiredForExam(store, exam)).length;
    }
    console.log("Expired exam attempts finalized:", finalized);
  },
};
