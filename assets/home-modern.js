/* =====================================================================
   HOME MODERN JS · थीम पिकर + एनिमेशन
   यह फ़ाइल केवल होम पेज (index.html) पर चलती है।
   कोई फ़ोटो, सिमुलेटर या मार्कअप हटाया/बदला नहीं जाता — सब कुछ जोड़ा जाता है।
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var LS_THEME = "smps-theme", LS_AUTO = "smps-theme-auto", LS_MOTION = "smps-motion";

  var THEMES = [
    ["light", "हरा (साधारण)", "Green (light)", "#0B6B4D", "#F8FAF6"],
    ["dark", "डार्क", "Dark", "#4FD1A1", "#17211C"],
    ["paper", "किताब (क्रीम)", "Paper (cream)", "#9A5B22", "#FFFBF0"],
    ["midnight", "मध्यरात्रि", "Midnight", "#6EA8FE", "#121A2E"],
    ["mint", "पुदीना", "Mint", "#0E8A5F", "#FFFFFF"],
    ["slate", "स्लेट (ग्रे)", "Slate (grey)", "#3A5A8C", "#FFFFFF"],
    ["contrast", "हाई कंट्रास्ट", "High contrast", "#FFD400", "#0C0C0C"],
    ["blue", "नीला", "Blue", "#1D63B8", "#F4F8FC"],
    ["purple", "बैंगनी", "Purple", "#7C1DB8", "#F8F2FC"],
    ["orange", "नारंगी", "Orange", "#EA580C", "#FFF9F3"],
    ["teal", "फ़िरोज़ी", "Teal", "#0891B2", "#F3FBFA"],
    ["rose", "गुलाबी", "Rose", "#DB2777", "#FFF6F9"]
  ];

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function current() { return root.getAttribute("data-theme") || "dark"; }
  function systemTheme() { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
  function pair(hi, en) { return '<span data-lang="hi">' + hi + "</span><span data-lang=\"en\" hidden>" + en + "</span>"; }
  function reduced() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  /* ---------- 1. थीम लगाना ---------- */
  function crossfade() {
    if (reduced() || root.classList.contains("hm-no-motion")) return;
    root.classList.add("hm-xfade");
    setTimeout(function () { root.classList.remove("hm-xfade"); }, 460);
  }
  function applyTheme(name, remember) {
    root.setAttribute("data-theme", name);
    if (remember) { store(LS_THEME, name); store(LS_AUTO, "0"); }
    crossfade();
    paint();
  }
  function autoOn() {
    store(LS_AUTO, "1");
    root.setAttribute("data-theme", systemTheme());
    crossfade();
    paint();
  }
  // "auto" चुना हो तो सिस्टम बदलने पर थीम भी बदले
  try {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    (mq.addEventListener ? mq.addEventListener("change", function () {
      if (read(LS_AUTO) === "1") { root.setAttribute("data-theme", systemTheme()); paint(); }
    }) : mq.addListener(function () {
      if (read(LS_AUTO) === "1") { root.setAttribute("data-theme", systemTheme()); paint(); }
    }));
  } catch (e) {}

  /* ---------- 2. पिकर UI ---------- */
  var btn, panel, autoBtn, motionBtn;

  function swatchMarkup(t) {
    return '<button type="button" class="hm-sw" data-hm-t="' + t[0] + '" aria-pressed="' + (current() === t[0]) + '">' +
      '<span class="hm-dot" aria-hidden="true"><i style="background:' + t[4] + '"></i><i style="background:' + t[3] + '"></i></span>' +
      pair(t[1], t[2]) + "</button>";
  }

  function paint() {
    if (!panel) return;
    var c = current();
    Array.prototype.slice.call(panel.querySelectorAll("[data-hm-t]")).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-hm-t") === c));
    });
    if (autoBtn) autoBtn.setAttribute("aria-pressed", String(read(LS_AUTO) === "1"));
    if (motionBtn) {
      var on = !root.classList.contains("hm-no-motion");
      motionBtn.setAttribute("aria-pressed", String(on));
      motionBtn.setAttribute("aria-label", on ? "एनिमेशन चालू हैं" : "एनिमेशन बंद हैं");
    }
    if (btn) { btn.classList.toggle("hm-on", true); btn.setAttribute("aria-label", "थीम चुनें (अभी: " + c + ") · Choose theme (now: " + c + ")"); }
    if (window.__applyLang) window.__applyLang(panel);
  }

  function close() {
    if (!panel || !panel.classList.contains("hm-open")) return;
    panel.classList.remove("hm-open");
    panel.setAttribute("aria-hidden", "true");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }
  function open() {
    if (!panel) return;
    panel.classList.add("hm-open");
    panel.removeAttribute("aria-hidden");
    if (btn) btn.setAttribute("aria-expanded", "true");
    var first = panel.querySelector(".hm-sw");
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function isOpen() { return panel && panel.classList.contains("hm-open"); }

  function build() {
    var bar = document.querySelector("header.appbar") || document.querySelector(".appbar");
    if (!bar) return;
    var ref = document.getElementById("themeBtn");

    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme";
    btn.id = "hmThemeBtn";
    btn.title = "थीम चुनें · Choose theme";
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "थीम चुनें");
    btn.textContent = "🎨";
    if (ref && ref.parentNode === bar) bar.insertBefore(btn, ref.nextSibling);
    else bar.appendChild(btn);

    panel = document.createElement("div");
    panel.className = "hm-panel";
    panel.id = "hmThemePanel";
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-label", "थीम / Theme");
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML =
      '<div class="hm-head"><b>' + pair("थीम चुनें", "Choose a theme") + "</b>" +
      '<button type="button" class="hm-x" data-hm-close aria-label="बंद करें">✕</button></div>' +
      '<div class="hm-grid">' + THEMES.map(swatchMarkup).join("") + "</div>" +
      '<div class="hm-foot">' +
      '<div class="hm-toggle"><span>' + pair("फ़ोन/लैपटॉप के अनुसार (ऑटो)", "Follow device (auto)") + "</span>" +
      '<button type="button" class="hm-switch" data-hm-auto role="switch" aria-label="ऑटो थीम"></button></div>' +
      '<div class="hm-toggle"><span>' + pair("एनिमेशन चालू", "Animations on") + "</span>" +
      '<button type="button" class="hm-switch" data-hm-motion role="switch" aria-label="एनिमेशन"></button></div>' +
      '<small class="hm-note">' + pair("थीम सिर्फ़ रंग बदलती है — पाठ, फ़ोटो और सिमुलेटर वैसे रहते हैं।", "Themes only change colours — text, photos and simulators stay as they are.") + "</small>" +
      "</div>";
    document.body.appendChild(panel);

    autoBtn = panel.querySelector("[data-hm-auto]");
    motionBtn = panel.querySelector("[data-hm-motion]");

    btn.addEventListener("click", function (e) { e.stopPropagation(); isOpen() ? close() : open(); });
    panel.addEventListener("click", function (e) {
      var t = e.target.closest("[data-hm-t]");
      if (t) { applyTheme(t.getAttribute("data-hm-t"), true); return; }
      if (e.target.closest("[data-hm-close]")) { close(); if (btn) btn.focus(); return; }
      if (e.target.closest("[data-hm-auto]")) { read(LS_AUTO) === "1" ? applyTheme(current(), true) : autoOn(); return; }
      if (e.target.closest("[data-hm-motion]")) { setMotion(root.classList.contains("hm-no-motion")); return; }
    });
    document.addEventListener("click", function (e) {
      if (isOpen() && !e.target.closest("#hmThemePanel") && !e.target.closest("#hmThemeBtn")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) { close(); if (btn) btn.focus(); }
    });
    // पुराना ◐ बटन दबाने पर ऑटो बंद हो, ताकि दोनों आपस में न लड़ें
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("#themeBtn") && read(LS_AUTO) === "1") store(LS_AUTO, "0");
    });
    paint();
  }

  /* ---------- 3. एनिमेशन चालू/बंद ---------- */
  function setMotion(on) {
    root.classList.toggle("hm-no-motion", !on);
    store(LS_MOTION, on ? "on" : "off");
    if (!on) Array.prototype.slice.call(document.querySelectorAll(".hm-reveal")).forEach(function (n) { n.classList.add("hm-in"); });
    paint();
  }

  /* ---------- 4. reveal + spotlight + ripple ---------- */
  var SAFE = "h2, h3, .home-hero, .hn, .ha, .shayari-card, .student-mode-card, .tbl-wrap, .v5-box, .cits-card, .card, .panel";
  var LIVE = "canvas, svg, iframe, img, video, input, select, textarea, table, button, script";

  function reveal() {
    if (!io || reduced() || root.classList.contains("hm-no-motion")) return;
    var seen = 0;
    Array.prototype.slice.call(document.querySelectorAll(SAFE)).forEach(function (el) {
      if (el.closest(".v8-gal, .hm-panel, .appbar, .app-sidebar, footer, #wa-ask, .pv-bar")) return;
      if (el.querySelector(LIVE) || el.classList.contains("hm-reveal")) return;
      if (seen++ > 140) return;
      el.classList.add("hm-reveal");
      io.observe(el);
    });
  }
  var io = null;
  function makeObserver() {
    io = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("hm-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "180px 0px -6% 0px", threshold: 0.02 });
  }

  function sweep() {
    // जो ब्लॉक स्क्रीन पर हैं या स्क्रीन से ऊपर निकल चुके हैं, उन्हें ज़रूर दिखाओ
    Array.prototype.slice.call(document.querySelectorAll(".hm-reveal:not(.hm-in)")).forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add("hm-in");
    });
  }

  var GLOW_SEL = ".card, .panel, .cits-card, .v5-box, .shayari-card";

  function glow() {
    // सिर्फ़ सादे कार्ड उठते-चमकते हैं; जिनमें कैनवस, बटन या टेबल हैं उन्हें बदला नहीं जाता
    // (transform से उनके अंदर की परतें हिल सकती थीं)
    var RISKY = "canvas, svg, iframe, video, button, input, select, textarea, table, details";
    Array.prototype.slice.call(document.querySelectorAll(GLOW_SEL)).forEach(function (el) {
      if (el.closest(".hm-panel, .appbar, footer")) return;
      if (el.querySelector(RISKY)) return;
      el.classList.add("hm-glow");
    });
    if (!window.matchMedia("(hover: hover)").matches) return;
    var raf = 0, last = null, x = 0, y = 0;
    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest ? e.target.closest(GLOW_SEL) : null;
      if (!el) return;
      last = el;
      var r = el.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width) * 100;
      y = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0;
        if (!last) return;
        last.style.setProperty("--hm-x", x.toFixed(1) + "%");
        last.style.setProperty("--hm-y", y.toFixed(1) + "%");
      });
    }, { passive: true });
  }

  function ripple() {
    var SEL = ".appbar .pill, .appbar button, .ha-btn, button.chip, .hn-btn, .v5-btn, .cits-btn, .hm-sw, .lang-btn";
    document.addEventListener("pointerdown", function (e) {
      if (reduced() || root.classList.contains("hm-no-motion")) return;
      var b = e.target.closest ? e.target.closest(SEL) : null;
      if (!b || b.disabled) return;
      b.classList.add("hm-rip");
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
      var s = document.createElement("span");
      s.className = "hm-ripple";
      s.style.width = s.style.height = d + "px";
      s.style.left = (e.clientX - r.left - d / 2) + "px";
      s.style.top = (e.clientY - r.top - d / 2) + "px";
      b.appendChild(s);
      busyUntil = Date.now() + 800;
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 600);
    }, { passive: true });
  }

  function aurora() {
    if (reduced() || root.classList.contains("hm-no-motion")) return;
    var a = document.createElement("div");
    a.className = "hm-aurora";
    a.setAttribute("aria-hidden", "true");
    a.innerHTML = "<span></span><span></span><span></span>";
    document.body.insertBefore(a, document.body.firstChild);
  }

  /* ---------- 5. शुरू ---------- */
  var busyUntil = 0, pending = 0;
  function refresh() {
    if (Date.now() < busyUntil) return;
    if (pending) return;
    pending = setTimeout(function () { pending = 0; reveal(); glow(); sweep(); }, 700);
  }

  function start() {
    // स्टोरेज में "auto" हो या नहीं, दोनों चलें
    if (read(LS_AUTO) === "1") root.setAttribute("data-theme", systemTheme());
    if (read(LS_MOTION) === "off") root.classList.add("hm-no-motion");
    build();
    aurora();
    if ("IntersectionObserver" in window) { makeObserver(); reveal(); }
    else {
      // पुराने ब्राउज़र में कोई भी हिस्सा छिपा नहीं रहे
      Array.prototype.slice.call(document.querySelectorAll(SAFE)).forEach(function (n) { n.classList.add("hm-in"); });
    }
    glow();
    setTimeout(sweep, 400);
    setInterval(function () { if (document.visibilityState === "visible") sweep(); }, 1500);
    ripple();
    // पेज पर JS से और कार्ड जोड़े जाते हैं — नए ब्लॉक भी जाँच लिए जाएँ
    try { new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    // ◐ बटन या कोई और स्क्रिप्ट थीम बदले तो पिकर की पट्टी भी साथ बदले
    try {
      new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    } catch (e) {}
    try {
      new MutationObserver(function () { if (window.__applyLang) window.__applyLang(panel); })
        .observe(root, { attributes: true, attributeFilter: ["lang"] });
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
