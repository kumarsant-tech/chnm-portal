"use strict";

const CACHE_NAME = "chnm-public-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/offline.html",
  "/privacy.html",
  "/terms.html",
  "/study/index.html",
  "/study/chapter.html",
];
const PUBLIC_PREFIXES = ["/study/", "/Computer-Lab/", "/SMPS-Lab/", "/assets/"];

function isPrivatePath(pathname) {
  return pathname === "/api" || pathname.startsWith("/api/") ||
    pathname === "/exam" || pathname.startsWith("/exam/");
}

function isPublicPath(pathname) {
  return pathname === "/" || pathname === "/index.html" ||
    pathname === "/offline.html" || pathname === "/privacy.html" || pathname === "/terms.html" ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function cacheable(response) {
  return response && response.ok &&
    !/\bno-store\b/i.test(response.headers.get("cache-control") || "");
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("chnm-public-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isPrivatePath(url.pathname) || !isPublicPath(url.pathname)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then((response) => {
        if (cacheable(response)) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
        }
        return response;
      }).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        if (/^\/study\/chapter\/(?:[1-9]|1[0-6])\/?$/.test(url.pathname)) {
          const chapter = await cache.match("/study/chapter.html");
          if (chapter) return chapter;
        }
        return (await cache.match("/offline.html")) || Response.error();
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (cacheable(response)) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
        }
        return response;
      });
    })
  );
});
