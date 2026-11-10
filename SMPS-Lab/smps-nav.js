/* SMPS लैब · साझा मॉड्यूल स्विचर — हर मॉड्यूल पेज के ऊपर पट्टी लगाता है।
   यह केवल नेविगेशन जोड़ता है; पेज का अपना लॉजिक नहीं छूता। */
(function () {
  "use strict";

  var MODULES = [
    { file: "00-home.html", n: "M00", hi: "होम (सभी मॉड्यूल)", en: "Home (all modules)", group: "शुरुआत" },
    { file: "01-safety.html", n: "M01", hi: "पहले सुरक्षा", en: "Safety First", group: "शुरुआत" },
    { file: "02-learning-lab.html", n: "M02", hi: "गाइडेड लर्निंग लैब", en: "Guided Learning Lab", group: "शुरुआत" },
    { file: "03-basics.html", n: "M03", hi: "बुनियादी बातें (ओम लॉ)", en: "Basics (Ohm's law)", group: "सिद्धांत" },
    { file: "04-how-smps-works.html", n: "M04", hi: "SMPS कैसे काम करता है", en: "How an SMPS Works", group: "सिद्धांत" },
    { file: "05-real-parts.html", n: "M05", hi: "असली कंपोनेंट + सर्किट", en: "Real Parts + Circuit", group: "सिद्धांत" },
    { file: "06-realsim.html", n: "M06", hi: "रियल SMPS सिम्युलेटर", en: "SMPS Simulator", group: "सिम्युलेटर" },
    { file: "07-waveform.html", n: "M07", hi: "वेवफ़ॉर्म सिम्युलेटर", en: "Waveform Simulator", group: "सिम्युलेटर" },
    { file: "08-bench.html", n: "M08", hi: "रिपेयर टेस्ट बेंच", en: "Repair Test Bench", group: "रिपेयर" },
    { file: "09-multimeter.html", n: "M09", hi: "मल्टीमीटर से जाँच", en: "Multimeter Testing", group: "रिपेयर" },
    { file: "10-fault-finding.html", n: "M10", hi: "ख़राबी खोज", en: "Fault Finding", group: "रिपेयर" },
    { file: "11-calculators.html", n: "M11", hi: "कैलकुलेटर + प्रोब", en: "Calculators + Probes", group: "रिपेयर" },
    { file: "12-cits.html", n: "M12", hi: "CITS प्रैक्टिकल", en: "CITS Practicals", group: "प्रमाणन" },
    { file: "13-glossary.html", n: "M13", hi: "शब्दावली", en: "Glossary", group: "प्रमाणन" }
  ];

  function currentFile() {
    var parts = location.pathname.split("/");
    var last = decodeURIComponent(parts[parts.length - 1] || "");
    return /html?$/i.test(last) ? last : "00-home.html";
  }

  function pair(hi, en) {
    return '<span data-lang="hi">' + hi + '</span><span data-lang="en" hidden>' + en + "</span>";
  }

  function syncLang() {
    var isEn = document.documentElement.lang === "en";
    Array.prototype.slice.call(bar.querySelectorAll("[data-lang]")).forEach(function (el) {
      el.hidden = el.dataset.lang !== (isEn ? "en" : "hi");
    });
  }

  var bar;

  function build() {
    var file = currentFile();
    var index = MODULES.findIndex(function (m) { return m.file === file; });
    if (index < 0) return;
    var here = MODULES[index];
    var prev = MODULES[index - 1];
    var next = MODULES[index + 1];

    bar = document.createElement("div");
    bar.className = "smps-switch";
    bar.setAttribute("role", "navigation");
    bar.setAttribute("aria-label", "SMPS मॉड्यूल नेविगेशन");

    var options = MODULES.map(function (m) {
      return '<option value="' + m.file + '"' + (m.file === file ? " selected" : "") + ">" +
        m.n + " · " + m.hi + " / " + m.en + "</option>";
    }).join("");

    bar.innerHTML =
      '<a class="ss-brand" href="index.html">🏠 ' + pair("हब", "Hub") + "</a>" +
      (prev ? '<a href="' + prev.file + '">⬅️ ' + prev.n + "</a>" : "") +
      '<span class="ss-now">' + here.n + " · " + pair(here.hi, here.en) + "</span>" +
      '<label class="ss-grow" style="display:inline-flex;align-items:center;gap:6px">' +
      '<span style="position:absolute;left:-9999px">' + pair("मॉड्यूल चुनें", "Choose module") + "</span>" +
      '<select id="smps-jump" aria-label="मॉड्यूल चुनें / Choose module">' + options + "</select></label>" +
      (next ? '<a class="ss-next" href="' + next.file + '">' + next.n + " ➡️</a>" : "") +
      '<a href="../index.html">' + pair("मुख्य साइट", "Main site") + "</a>";

    document.body.insertBefore(bar, document.body.firstChild);

    bar.querySelector("#smps-jump").addEventListener("change", function (event) {
      location.href = event.target.value;
    });

    syncLang();
    new MutationObserver(syncLang).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

/* किताब परत: पढ़ने वाले गद्यांशों पर रेखाएँ लगाता है।
   सिम्युलेटर/बटन/इनपुट वाले ब्लॉक छूटे रहते हैं, इसलिए रेखाएँ कभी
   कंट्रोल के ऊपर नहीं चढ़तीं। यह कोई म ark-up नहीं बदलता, केवल class जोड़ता है। */
(function () {
  "use strict";

  var SKIP = ".smps-switch, nav.tabs, footer, .pv-bar, #troubleshooting-game, .bk-qa, script, style, noscript";
  var LIVE = "button, input, select, textarea, canvas, svg, video, audio, iframe, a, label, details, summary, table";

  function tag(root) {
    if (!root || !root.querySelectorAll) return 0;
    var n = 0;
    Array.prototype.slice.call(root.querySelectorAll("p, li")).forEach(function (el) {
      if (el.classList.contains("bk-prose") || el.closest(SKIP)) return;
      if (el.querySelector(LIVE)) return;
      var txt = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (txt.length < 130) return;
      el.classList.add("bk-prose");
      n++;
    });
    return n;
  }

  function run() { tag(document.body); }

  var timer = null;
  function schedule() {
    if (timer) return;
    timer = setTimeout(function () { timer = null; run(); }, 250);
  }

  function start() {
    run();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    window.addEventListener("smps-panel", schedule);
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) schedule(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

