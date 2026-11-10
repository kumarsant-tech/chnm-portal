/* अध्याय व्यूअर + इंटरैक्टिव सिमुलेटर + क्विज़ */
(function () {
  "use strict";

  var modules = window.TRADE_MODULES || [];
  var article = document.getElementById("chapterArticle");
  var navList = document.getElementById("chapterNav");
  var sideProgressText = document.getElementById("sideProgressText");
  var sideProgressFill = document.getElementById("sideProgressFill");
  if (!article) return;

  var params = new URLSearchParams(window.location.search);
  var requested = parseInt(params.get("m"), 10);
  var current = modules.filter(function (m) { return m.id === requested; })[0];
  if (!current) {
    article.innerHTML =
      '<div class="empty"><strong>अध्याय नहीं मिला</strong>' +
      'कृपया सही अध्याय चुनें।<div style="margin-top:14px">' +
      '<a class="btn" href="index.html">सभी अध्याय देखें</a></div></div>';
    return;
  }

  document.title = "अध्याय " + current.id + ": " + current.title + " · Trade Theory";
  window.FITrade.markLast(current.id);

  var deep = (window.TRADE_DEEP && window.TRADE_DEEP[current.id]) || {};
  var enData = deep.en || {};
  var GLOSSARY = window.TRADE_GLOSSARY || [];
  var GLOSS_MAP = {};
  GLOSSARY.forEach(function (item) {
    if (!item || !item.a) return;
    GLOSS_MAP[item.a] = item;
    if (!GLOSS_MAP[item.a.toUpperCase()]) GLOSS_MAP[item.a.toUpperCase()] = item;
  });
  var LANG_KEY = "fi-trade-lang";

  function loadLangMode() {
    try {
      var saved = window.localStorage.getItem(LANG_KEY);
      if (saved === "hi" || saved === "en" || saved === "both") return saved;
    } catch (err) {}
    return "both";
  }

  var langMode = loadLangMode();

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function rich(value) {
    return esc(value)
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function numberedList(items, tag) {
    var element = tag || "ul";
    return "<" + element + ">" + items.map(function (item) {
      return "<li>" + rich(item) + "</li>";
    }).join("") + "</" + element + ">";
  }

  function tableHTML(table) {
    if (!table || !table.rows || !table.rows.length) return "";
    var head = table.head && table.head.length
      ? "<thead><tr>" + table.head.map(function (cell) { return "<th>" + rich(cell) + "</th>"; }).join("") + "</tr></thead>"
      : "";
    var body = "<tbody>" + table.rows.map(function (row) {
      return "<tr>" + row.map(function (cell) { return "<td>" + rich(cell) + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody>";
    return '<div class="study-table-wrap"><table class="study-table">' + head + body + "</table>" +
      (table.caption ? '<p class="table-caption">' + rich(table.caption) + "</p>" : "") + "</div>";
  }

  function stepsHTML(steps) {
    if (!steps || !steps.length) return "";
    return '<ol class="step-list">' + steps.map(function (step, index) {
      var title = typeof step === "string" ? step : step.t;
      var desc = typeof step === "string" ? "" : step.d;
      return '<li class="step-item"><span class="step-num" aria-hidden="true">' + (index + 1) + "</span>" +
        '<div class="step-body"><b class="step-title">' + rich(title) + "</b>" +
        (desc ? '<span class="step-desc">' + rich(desc) + "</span>" : "") + "</div></li>";
    }).join("") + "</ol>";
  }

  function formulaHTML(lines) {
    if (!lines || !lines.length) return "";
    return '<div class="formula-box"><span class="formula-label">सूत्र / नियम</span>' +
      lines.map(function (line) { return '<code class="formula-line">' + rich(line) + "</code>"; }).join("") +
      "</div>";
  }

  function termsHTML(terms) {
    if (!terms || !terms.length) return "";
    return '<div class="term-grid">' + terms.map(function (term) {
      return '<div class="term-card"><b>' + rich(term.t) + "</b><span>" + rich(term.d) + "</span></div>";
    }).join("") + "</div>";
  }

  function enSection(index) {
    var entry = (enData.sections || [])[index];
    return {
      h: entry && entry[0] ? entry[0] : "",
      note: entry && entry[1] ? entry[1] : ""
    };
  }

  function langSwitchHTML() {
    var options = [["hi", "हिंदी"], ["both", "दोनों"], ["en", "English"]];
    return '<div class="lang-switch" role="group" aria-label="पाठ की भाषा चुनें">' +
      '<span class="lang-switch-label">भाषा / Language</span>' +
      options.map(function (option) {
        var on = langMode === option[0];
        return '<button type="button" class="lang-btn' + (on ? " is-on" : "") + '"' +
          ' data-lang-set="' + option[0] + '" aria-pressed="' + (on ? "true" : "false") + '">' +
          option[1] + "</button>";
      }).join("") + "</div>";
  }

  function applyLang(mode) {
    langMode = mode;
    article.setAttribute("data-lang", mode);
    document.documentElement.lang = mode === "en" ? "en" : "hi";
    Array.prototype.forEach.call(article.querySelectorAll("[data-lang-set]"), function (button) {
      var on = button.getAttribute("data-lang-set") === mode;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { window.localStorage.setItem(LANG_KEY, mode); } catch (err) {}
  }

  function wireLanguage() {
    Array.prototype.forEach.call(article.querySelectorAll("[data-lang-set]"), function (button) {
      button.addEventListener("click", function () {
        applyLang(button.getAttribute("data-lang-set"));
      });
    });
    applyLang(langMode);
  }

  function masteryHTML() {
    var mastery = deep.mastery;
    if (!mastery) return "";
    var blocks = ["hi", "en"].map(function (lang) {
      var block = mastery[lang];
      if (!block) return "";
      return '<article class="mastery-card mastery-' + lang + '">' +
        '<span class="depth-kicker">' + (lang === "hi" ? "गहन अध्ययन" : "In-depth study") + "</span>" +
        "<h3>" + rich(block.title) + "</h3>" +
        (block.lead ? '<p class="mastery-lead">' + rich(block.lead) + "</p>" : "") +
        (block.paragraphs || []).map(function (paragraph) {
          return "<p>" + rich(paragraph) + "</p>";
        }).join("") +
        (block.steps ? stepsHTML(block.steps) : "") +
        (block.table ? tableHTML(block.table) : "") +
        "</article>";
    }).join("");
    if (!blocks) return "";
    return '<section class="depth-section" id="mastery" aria-labelledby="masteryTitle">' +
      '<div class="area-head"><span class="area-eyebrow">गहराई</span><div>' +
        '<h2 id="masteryTitle">गहन अध्ययन · Mastery</h2>' +
        "<p>परीक्षा से आगे की समझ — जोखिम, कारण, प्रक्रिया और व्यावसायिक निर्णय। दोनों भाषाओं में एक ही सामग्री।</p></div></div>" +
      '<div class="mastery-grid">' + blocks + "</div></section>";
  }

  function vivaHTML() {
    var list = deep.viva || [];
    if (!list.length) return "";
    return '<section class="viva-section" id="viva" aria-labelledby="vivaTitle">' +
      '<div class="area-head"><span class="area-eyebrow">मौखिक</span><div>' +
        '<h2 id="vivaTitle">वाइवा प्रश्न · Viva questions</h2>' +
        "<p>प्रश्न पर क्लिक करके उत्तर खोलें। उत्तर पहले अपने शब्दों में बोलें, फिर मिलाएँ।</p></div></div>" +
      '<div class="viva-list">' + list.map(function (item, index) {
        return '<details class="viva-item">' +
          '<summary><span class="viva-num" aria-hidden="true">Q' + (index + 1) + "</span>" +
            '<span class="viva-question"><span class="hi-only">' + rich(item.q) + "</span>" +
            '<span class="viva-q-en en-only">' + rich(item.qEn) + "</span></span>" +
            '<span class="viva-toggle" aria-hidden="true">+</span></summary>' +
          '<div class="viva-answer">' +
            '<p class="hi-only">' + rich(item.a) + "</p>" +
            '<p class="en-only">' + rich(item.aEn) + "</p>" +
          "</div></details>";
      }).join("") + "</div></section>";
  }

  function glossaryHTML() {
    var forms = (deep.fullForms || []).filter(function (abbr) {
      return abbr && GLOSS_MAP[abbr] && GLOSS_MAP[abbr].f;
    });
    if (!forms.length) return "";
    return '<section class="media-section glossary-section" id="glossary" aria-labelledby="glossaryTitle">' +
      '<div class="area-head"><span class="area-eyebrow">फुल फॉर्म</span><div>' +
        '<h2 id="glossaryTitle">संक्षिप्ताक्षर गाइड · Full forms</h2>' +
        "<p>इस अध्याय में आए " + forms.length + " संक्षिप्ताक्षर — पूरा नाम और हिंदी अर्थ। पाठ में पहली बार आने पर भी पूरा रूप दिखता है।</p></div></div>" +
      '<div class="abbr-grid">' + forms.map(function (abbr) {
        var entry = GLOSS_MAP[abbr];
        return '<div class="abbr-card"><b>' + esc(entry.a) + "</b>" +
          "<span>" + esc(entry.f) + "</span>" +
          (entry.h ? "<small>" + esc(entry.h) + "</small>" : "") + "</div>";
      }).join("") + "</div></section>";
  }

  function modelSectionHTML() {
    if (!deep.model3d || !window.FITrade3D) return "";
    var model = window.FITrade3D.models[deep.model3d];
    if (!model) return "";
    return '<section class="media-section model-section" id="model3d" aria-labelledby="model3dTitle">' +
      '<div class="area-head"><span class="area-eyebrow">3D</span><div>' +
        '<h2 id="model3dTitle">3D मॉडल · ' + esc(model.title) + "</h2>" +
        "<p>मॉडल को घुमाएँ, भागों को चुनें और असली उपकरण की बनावट को तीन आयामों में समझें।</p></div></div>" +
      '<div id="model3dMount"></div></section>';
  }

  function expandAbbreviations(root) {
    if (!root || !document.createTreeWalker) return;
    var terms = Object.keys(GLOSS_MAP).filter(function (key) {
      return key.length > 1 && GLOSS_MAP[key] && GLOSS_MAP[key].f;
    }).sort(function (a, b) { return b.length - a.length; });
    if (!terms.length) return;
    var pattern;
    try {
      pattern = new RegExp("(^|[^A-Za-z0-9])(" + terms.map(function (term) {
        return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }).join("|") + ")(?![A-Za-z0-9])", "g");
    } catch (err) { return; }

    var used = {};
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentNode;
        if (!parent || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (/^(A|ABBR|CODE|PRE|KBD|SAMP|SCRIPT|STYLE|TEXTAREA|BUTTON|SUMMARY|H1|H2|H3|H4)$/.test(parent.nodeName)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.closest && parent.closest(".formula-box, .tech-figure, .td-card, .glossary-section, .abbr-card")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var fragment = document.createDocumentFragment();
      var last = 0;
      var changed = false;
      pattern.lastIndex = 0;
      text.replace(pattern, function (match, pre, abbr, offset) {
        var entry = GLOSS_MAP[abbr] || GLOSS_MAP[abbr.toUpperCase()];
        if (!entry || !entry.f || used[abbr]) return match;
        used[abbr] = true;
        var start = offset + pre.length;
        if (start > last) fragment.appendChild(document.createTextNode(text.slice(last, start)));
        var element = document.createElement("abbr");
        element.className = "gloss-abbr";
        element.title = entry.f + (entry.h ? " — " + entry.h : "");
        element.textContent = abbr;
        fragment.appendChild(element);
        last = start + abbr.length;
        changed = true;
        return match;
      });
      if (changed) {
        if (last < text.length) fragment.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(fragment, node);
      }
    });
  }

  function sectionExtras(section) {
    var html = "";
    if (section.figure) html += figureHTML(section.figure);
    if (section.table) html += tableHTML(section.table);
    if (Array.isArray(section.tables)) html += section.tables.map(tableHTML).join("");
    if (section.steps) html += stepsHTML(section.steps);
    if (section.formula) html += formulaHTML(section.formula);
    if (section.terms) html += termsHTML(section.terms);
    if (section.list && section.list.length) html += numberedList(section.list, section.ordered ? "ol" : "ul");
    if (section.note) html += '<div class="note-box"><b>ध्यान दें:</b> ' + rich(section.note) + "</div>";
    if (section.exam) html += '<div class="exam-box"><b>परीक्षा दृष्टि:</b> ' + rich(section.exam) + "</div>";
    return html;
  }

  var FIGURE_TYPES = ["flow", "cycle", "pyramid", "ladder", "compare", "map"];

  function figureHTML(figure, options) {
    if (!figure) return "";
    options = options || {};
    var conceal = Boolean(options.conceal);
    var interactive = Boolean(options.interactive);
    var tag = interactive ? "button" : "div";
    var type = FIGURE_TYPES.indexOf(figure.type) >= 0 ? figure.type : "flow";

    function node(item, index, extraStyle) {
      var icon = item.icon ? '<span class="fig-ic" aria-hidden="true">' + esc(item.icon) + "</span>" : "";
      var label = conceal ? "?" : esc(item.label);
      var note = conceal ? "भाग " + (index + 1) : esc(item.note || "");
      var attrs = interactive
        ? ' type="button" data-node="' + index + '" data-label="' + esc(item.label) + '" data-note="' + esc(item.note || "") + '" aria-label="भाग ' + (index + 1) + '"'
        : "";
      return "<" + tag + attrs + ' class="fig-node' + (conceal ? " is-concealed" : "") + '"' +
        (extraStyle ? ' style="' + extraStyle + '"' : "") + ">" +
        '<span class="fig-num" aria-hidden="true">' + (index + 1) + "</span>" + icon +
        '<b class="fig-label">' + label + "</b>" +
        (note ? '<small class="fig-note">' + note + "</small>" : "") +
        "</" + tag + ">";
    }

    var body = "";
    var items = figure.items || [];
    if (type === "flow") {
      body = '<div class="fig-flow">' + items.map(function (item, index) {
        return (index ? '<span class="fig-arrow" aria-hidden="true">→</span>' : "") + node(item, index);
      }).join("") + "</div>";
    } else if (type === "cycle") {
      body = '<div class="fig-cycle">' + items.map(function (item, index) {
        return node(item, index);
      }).join("") + "</div>" +
        '<p class="fig-loop-note">↻ यह चक्र बार-बार दोहराता है' + (figure.loop ? " — " + esc(figure.loop) : "") + "</p>";
    } else if (type === "pyramid") {
      var last = Math.max(1, items.length - 1);
      body = '<div class="fig-pyramid">' + items.map(function (item, index) {
        var width = 46 + (index * (54 / last));
        return node(item, index, "width:" + width.toFixed(1) + "%");
      }).join("") + "</div>";
    } else if (type === "ladder") {
      body = '<div class="fig-ladder">' + items.map(function (item, index) {
        return { item: item, index: index };
      }).reverse().map(function (pair) {
        return node(pair.item, pair.index);
      }).join("") + "</div>";
    } else if (type === "compare") {
      body = '<div class="fig-compare">' +
        '<div class="fig-col"><h4>' + esc(figure.left.title) + "</h4>" + numberedList(figure.left.items) + "</div>" +
        '<div class="fig-col"><h4>' + esc(figure.right.title) + "</h4>" + numberedList(figure.right.items) + "</div>" +
        "</div>";
    } else {
      body = '<div class="fig-map">' +
        (figure.center ? '<div class="fig-center">' + esc(figure.center) + "</div>" : "") +
        '<div class="fig-map-items">' + items.map(function (item, index) {
          return node(item, index);
        }).join("") + "</div></div>";
    }

    return '<figure class="study-figure fig-' + type + '">' +
      (figure.title ? '<figcaption class="fig-title"><span aria-hidden="true">' + esc(figure.icon || "🧭") + "</span>" + esc(figure.title) + "</figcaption>" : "") +
      '<div class="fig-canvas">' + body + "</div>" +
      (figure.caption ? '<p class="fig-caption">' + esc(figure.caption) + "</p>" : "") +
      "</figure>";
  }

  function diagramHTML(diagram, index) {
    if (!diagram || !window.FITradeVisual) return "";
    var svg = window.FITradeVisual.render(diagram.svg);
    if (!svg) return "";
    return '<figure class="tech-figure" data-diagram="' + esc(diagram.svg) + '">' +
      '<div class="tech-frame">' + svg + "</div>" +
      '<figcaption class="tech-caption">' +
        "<div><b>" + esc(diagram.title || "तकनीकी चित्र") + "</b>" +
        (diagram.caption ? "<span>" + esc(diagram.caption) + "</span>" : "") + "</div>" +
        '<button type="button" class="diagram-toggle" data-diagram-toggle="' + index + '" aria-pressed="true">एनिमेशन रोकें</button>' +
      "</figcaption></figure>";
  }

  function diagramsSectionHTML() {
    var list = Array.isArray(current.diagrams) ? current.diagrams : [];
    if (!list.length) return "";
    return '<section class="media-section" id="diagrams" aria-labelledby="diagramsTitle">' +
      '<div class="area-head"><span class="area-eyebrow">चित्र</span>' +
        '<div><h2 id="diagramsTitle">तकनीकी चित्र</h2>' +
        "<p>उपकरण की बनावट और डेटा/पावर का रास्ता — एनिमेशन के साथ। रोककर हर हिस्सा ध्यान से देखें।</p></div></div>" +
      '<div class="tech-gallery">' + list.map(diagramHTML).join("") + "</div></section>";
  }

  function topicNavHTML() {
    var sections = current.sections || [];
    var items = sections.map(function (section, index) {
      return '<a href="#sec-' + (index + 1) + '" data-topic="' + (index + 1) + '">' +
        "<span>" + pad(index + 1) + "</span>" + esc(section.h) + "</a>";
    }).join("");
    return '<nav class="topic-nav" id="topicNav" aria-label="इस अध्याय की विषय सूची">' +
      '<span class="topic-nav-label">विषय</span>' +
      '<div class="topic-nav-scroll">' + items + "</div>" +
      '<div class="topic-nav-extra">' +
        (current.diagrams ? '<a href="#diagrams">चित्र</a>' : "") +
        (deep.model3d && window.FITrade3D ? '<a href="#model3d">3D मॉडल</a>' : "") +
        (deep.mastery ? '<a href="#mastery">गहन</a>' : "") +
        (deep.viva ? '<a href="#viva">वाइवा</a>' : "") +
        (deep.fullForms ? '<a href="#glossary">फुल फॉर्म</a>' : "") +
        '<a href="#labs">लैब</a><a href="#quizMount">क्विज़</a>' +
      "</div></nav>";
  }

  function wireDiagrams() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    Array.prototype.forEach.call(article.querySelectorAll(".tech-figure"), function (figure) {
      var svg = figure.querySelector("svg");
      var button = figure.querySelector(".diagram-toggle");
      if (!svg || !button) return;
      var running = !reduce;

      function apply() {
        if (svg.pauseAnimations) {
          if (running) svg.unpauseAnimations();
          else svg.pauseAnimations();
        }
        figure.classList.toggle("is-paused", !running);
        button.textContent = running ? "एनिमेशन रोकें" : "एनिमेशन चलाएँ";
        button.setAttribute("aria-pressed", running ? "true" : "false");
      }

      if (reduce && svg.pauseAnimations) svg.pauseAnimations();
      button.addEventListener("click", function () {
        running = !running;
        apply();
      });
      apply();
    });
    if (reduce) {
      Array.prototype.forEach.call(article.querySelectorAll(".sim-live-card svg"), function (svg) {
        if (svg.pauseAnimations) svg.pauseAnimations();
      });
    }
  }

  function wireTopicNav() {
    var nav = document.getElementById("topicNav");
    if (!nav) return;
    var scroller = nav.querySelector(".topic-nav-scroll");
    var links = Array.prototype.slice.call(nav.querySelectorAll("[data-topic]"));
    var sections = links.map(function (link) {
      return document.getElementById("sec-" + link.getAttribute("data-topic"));
    }).filter(Boolean);
    if (!links.length || !sections.length) return;

    function setActive(topic) {
      links.forEach(function (link) {
        var isActive = link.getAttribute("data-topic") === topic;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      var active = nav.querySelector('[data-topic="' + topic + '"]');
      if (active && scroller && scroller.scrollTo) {
        var left = active.offsetLeft - scroller.clientWidth / 2 + active.offsetWidth / 2;
        scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
      }
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (entry) { return entry.isIntersecting; })
          .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
        if (visible.length) setActive(visible[0].target.id.replace("sec-", ""));
      }, { rootMargin: "-18% 0px -68% 0px", threshold: 0 });
      sections.forEach(function (section) { observer.observe(section); });
    }
  }

  function jumpToHash() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;
    setTimeout(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 140);
  }

  function renderNav() {
    if (!navList) return;
    navList.innerHTML = "";
    modules.forEach(function (m) {
      var link = document.createElement("a");
      link.href = "chapter.html?m=" + m.id;
      if (m.id === current.id) link.setAttribute("aria-current", "page");
      link.setAttribute("data-nav-id", String(m.id));
      var num = document.createElement("span");
      num.className = "nav-num";
      num.textContent = pad(m.id);
      var label = document.createElement("span");
      label.textContent = m.title;
      link.appendChild(num);
      link.appendChild(label);
      navList.appendChild(link);
    });
  }

  function updateChrome() {
    var progress = window.FITrade.load();
    var isRead = Boolean(progress.read[current.id]);
    var readBtn = document.getElementById("markReadBtn");
    if (readBtn) {
      readBtn.textContent = isRead ? "पढ़ा हुआ ✓" : "पढ़ा हुआ चिह्नित करें";
      readBtn.classList.toggle("is-read", isRead);
      readBtn.setAttribute("aria-pressed", isRead ? "true" : "false");
      readBtn.title = isRead ? "चिह्न हटाने के लिए दबाएँ" : "इस अध्याय को पढ़ा हुआ चिह्नित करें";
    }
    if (navList) {
      Array.prototype.forEach.call(navList.querySelectorAll("[data-nav-id]"), function (link) {
        var id = Number(link.getAttribute("data-nav-id"));
        link.classList.toggle("is-read", Boolean(progress.read[id]));
      });
    }
    var stats = window.FITrade.stats();
    if (sideProgressText) sideProgressText.textContent = stats.read + " / " + stats.total + " पढ़े";
    if (sideProgressFill) {
      sideProgressFill.style.width = (stats.total ? Math.round((stats.read / stats.total) * 100) : 0) + "%";
    }
  }

  function renderArticle() {
    var sections = (current.sections || []).map(function (section, index) {
      var en = enSection(index);
      return '<section class="section-block" id="sec-' + (index + 1) + '">' +
        '<h2><span class="sec-num">' + pad(index + 1) + '</span>' +
          '<span class="sec-titles">' +
            '<span class="hi-heading">' + rich(section.h) + '</span>' +
            (en.h ? '<span class="en-heading en-only">' + esc(en.h) + '</span>' : "") +
          "</span>" +
        "</h2>" +
        '<div class="hi-body">' +
          (section.p || []).map(function (paragraph) {
            return "<p>" + rich(paragraph) + "</p>";
          }).join("") +
          sectionExtras(section) +
        "</div>" +
        (en.note
          ? '<div class="en-note en-only"><span class="lang-flag">EN</span><p>' + rich(en.note) + "</p></div>"
          : "") +
        "</section>";
    }).join("");

    var prev = modules.filter(function (m) { return m.id === current.id - 1; })[0];
    var next = modules.filter(function (m) { return m.id === current.id + 1; })[0];
    var footNav =
      '<nav class="chapter-footnav" aria-label="अध्याय नेविगेशन">' +
      (prev
        ? '<a class="btn btn-ghost" href="chapter.html?m=' + prev.id + '">पिछला: ' + esc(prev.title) + "</a>"
        : '<a class="btn btn-ghost" href="index.html">सभी अध्याय</a>') +
      (next
        ? '<a class="btn" href="chapter.html?m=' + next.id + '">अगला: ' + esc(next.title) + "</a>"
        : '<a class="btn" href="index.html">अध्ययन केंद्र पर लौटें</a>') +
      "</nav>";

    var simList = [];
    if (current.sim) simList.push(current.sim);
    if (Array.isArray(current.sims)) simList = simList.concat(current.sims);
    var simTotal = simList.length;
    var liveTotal = simList.filter(function (sim) { return sim.type === "live"; }).length;
    var diagramTotal = Array.isArray(current.diagrams) ? current.diagrams.length : 0;
    var exampleExtra = current.example && current.example.list ? numberedList(current.example.list) : "";
    var enTitle = enData.title || "";
    var enIntro = enData.intro || "";
    var enOutcomes = enData.outcomes || [];

    article.innerHTML =
      '<div class="chapter-topline">' +
        '<span class="chapter-eyebrow">Trade Theory · ' + esc(current.code) + " · अध्याय " + pad(current.id) + "</span>" +
        '<span class="pill">' + esc(current.minutes) + " मिनट · " + simTotal + " सिमुलेटर" +
          (liveTotal ? " · " + liveTotal + " लाइव" : "") + (diagramTotal ? " · " + diagramTotal + " चित्र" : "") +
          (enTitle ? " · द्विभाषी" : "") + (deep.model3d ? " · 3D" : "") + "</span>" +
      "</div>" +
      '<h1 class="chapter-title-hi hi-only">' + rich(current.title) + "</h1>" +
      (enTitle ? '<p class="chapter-title-en en-only" role="heading" aria-level="1">' + rich(enTitle) + "</p>" : "") +
      '<p class="chapter-subtitle hi-only">' + rich(current.subtitle) + "</p>" +
      (enData.subtitle ? '<p class="chapter-subtitle chapter-subtitle-en en-only">' + rich(enData.subtitle) + "</p>" : "") +
      '<p class="chapter-tagline hi-only">' + rich(current.tagline) + "</p>" +
      (enData.tagline ? '<p class="chapter-tagline chapter-tagline-en en-only">' + rich(enData.tagline) + "</p>" : "") +
      '<div class="chapter-actions">' +
        '<button type="button" class="btn btn-soft" id="markReadBtn" aria-pressed="false">पढ़ा हुआ चिह्नित करें</button>' +
        '<button type="button" class="btn btn-ghost" id="printBtn">प्रिंट करें</button>' +
        '<a class="btn btn-ghost" href="index.html">25 अध्याय सूची</a>' +
        langSwitchHTML() +
      "</div>" +
      topicNavHTML() +
      '<div class="intro-box hi-only"><p>' + rich(current.intro) + "</p></div>" +
      (enIntro ? '<div class="intro-box intro-en en-only"><p>' + rich(enIntro) + "</p>" +
        '<p class="lang-hint">English study notes. Switch to <b>हिंदी</b> or <b>दोनों</b> for the full detailed Hindi text.</p></div>' : "") +
      '<div class="outcome-box hi-only"><h2>इस अध्याय के बाद आप…</h2>' + numberedList(current.outcomes) + "</div>" +
      (enOutcomes.length
        ? '<div class="outcome-box outcome-en en-only"><h2>After this chapter you will be able to…</h2>' +
          numberedList(enOutcomes) + "</div>"
        : "") +
      diagramsSectionHTML() +
      modelSectionHTML() +
      sections +
      masteryHTML() +
      vivaHTML() +
      glossaryHTML() +
      '<div class="key-box hi-only"><h2>मुख्य बिंदु</h2>' + numberedList(current.keyPoints) + "</div>" +
      '<div class="example-box hi-only"><h2>' + rich(current.example.title) + "</h2><p>" + rich(current.example.text) + "</p>" + exampleExtra + "</div>" +
      '<div class="area-head" id="labs"><span class="area-eyebrow">लैब</span><div>' +
        "<h2>सिमुलेटर और लाइव लैब</h2>" +
        "<p>पहले नियम और प्रक्रिया समझें, फिर नीचे दिए लैब में मान बदलकर असर देखें।</p></div></div>" +
      '<div id="simMount"></div>' +
      '<div id="quizMount"></div>' +
      '<div class="remember-box hi-only">' + rich(current.remember) + "</div>" +
      footNav +
      '<p class="chapter-note">यह अध्याय CITS <i>CHNM / ICTSM</i> ट्रेड थ्योरी विषय-क्रम पर आधारित ' +
      "स्वतंत्र, सरल हिंदी अध्ययन सामग्री है। यह NIMI की आधिकारिक पुस्तक नहीं है; मूल पुस्तक का पाठ या चित्र यहाँ कॉपी नहीं किया गया है। " +
      "पूरी पुस्तक NIMI, चेन्नई से प्राप्त करें। © NIMI।</p>";

    var readBtn = document.getElementById("markReadBtn");
    if (readBtn) {
      readBtn.addEventListener("click", function () {
        var progress = window.FITrade.load();
        if (progress.read[current.id]) window.FITrade.unmarkRead(current.id);
        else window.FITrade.markRead(current.id);
        updateChrome();
      });
    }
    var printBtn = document.getElementById("printBtn");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

    var simMount = document.getElementById("simMount");
    if (simMount) {
      simList.forEach(function (sim) { mountSim(sim, simMount); });
    }

    var quizMount = document.getElementById("quizMount");
    if (quizMount && current.quiz && current.quiz.length) mountQuiz(current.quiz, quizMount);

    var modelMount = document.getElementById("model3dMount");
    if (modelMount && deep.model3d && window.FITrade3D) {
      window.FITrade3D.mount(deep.model3d, modelMount);
    }

    wireDiagrams();
    wireTopicNav();
    wireLanguage();
    expandAbbreviations(article);
    jumpToHash();
    updateChrome();
  }

  /* ---------------- simulator shell ---------------- */
  function mountSim(sim, mount) {
    var isLive = sim.type === "live";
    var card = document.createElement("div");
    card.className = "sim-card" + (isLive ? " sim-live-card" : "");
    card.innerHTML =
      '<div class="sim-head">' +
        '<span class="sim-kicker' + (isLive ? " is-live" : "") + '">' +
          (isLive ? '<span class="live-dot" aria-hidden="true"></span>लाइव सिमुलेटर' : "इंटरैक्टिव सिम्युलेटर") + "</span>" +
        "<h2>" + esc(sim.title) + "</h2>" +
        "<p>" + esc(sim.instructions) + "</p>" +
      "</div>" +
      '<div class="sim-body"></div>';
    mount.appendChild(card);
    var body = card.querySelector(".sim-body");

    if (window.FITrade.load().sims[current.id]) {
      var replay = document.createElement("p");
      replay.className = "sim-hint";
      replay.textContent = "आप इसे पहले पूरा कर चुके हैं — दोबारा अभ्यास कर सकते हैं।";
      body.appendChild(replay);
    }

    if (sim.type === "sort") mountSort(sim, body);
    else if (sim.type === "sequence") mountSequence(sim, body);
    else if (sim.type === "conditioning") mountConditioning(sim, body);
    else if (sim.type === "scenario") mountScenario(sim, body);
    else if (sim.type === "checklist") mountChecklist(sim, body);
    else if (sim.type === "calc") mountCalc(sim, body);
    else if (sim.type === "calculator") mountCalculator(sim, body);
    else if (sim.type === "levels") mountLevels(sim, body);
    else if (sim.type === "match") mountMatch(sim, body);
    else if (sim.type === "find") mountFind(sim, body);
    else if (isLive && window.FITradeLive) {
      window.FITradeLive.mount(sim, body, { done: markSimDone, id: current.id });
    }
  }

  function doneBox(text) {
    var box = document.createElement("div");
    box.className = "sim-done";
    box.textContent = text;
    return box;
  }

  function markSimDone() {
    window.FITrade.markSim(current.id);
  }

  /* ---------------- sort ---------------- */
  function mountSort(sim, body) {
    var answered = 0;
    var correct = 0;
    var finished = false;
    var summary = document.createElement("div");
    summary.className = "sim-summary";
    body.appendChild(summary);

    function updateSummary() {
      summary.innerHTML = "हल किए: <b>" + answered + " / " + sim.items.length + "</b>" +
        "<span class=\"sim-status\">सही: <b>" + correct + "</b></span>";
      if (answered === sim.items.length && !finished) {
        finished = true;
        markSimDone();
        summary.innerHTML += "<span class=\"sim-status good\">सिमुलेटर पूरा</span>";
        body.appendChild(doneBox("आपने " + sim.items.length + " में से " + correct + " सही पहचाने। जिनमें गलती हुई, उनका कारण ऊपर पढ़ें।"));
      }
    }

    sim.items.forEach(function (item, index) {
      var row = document.createElement("div");
      row.className = "sort-item";
      var text = document.createElement("div");
      text.className = "sort-text";
      text.textContent = (index + 1) + ". " + item.text;
      var buttons = document.createElement("div");
      buttons.className = "bucket-btns";
      var feedback = document.createElement("div");
      feedback.className = "item-feedback";
      feedback.hidden = true;
      var locked = false;

      sim.buckets.forEach(function (bucket) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "bucket-btn";
        btn.textContent = bucket.label;
        btn.setAttribute("data-bucket", bucket.id);
        btn.addEventListener("click", function () {
          if (locked) return;
          locked = true;
          answered += 1;
          Array.prototype.forEach.call(buttons.children, function (child) { child.disabled = true; });
          var isRight = item.bucket === bucket.id;
          if (isRight) {
            correct += 1;
            row.classList.add("ok");
            btn.classList.add("correct");
            feedback.className = "item-feedback good";
            feedback.textContent = "सही — " + item.why;
          } else {
            row.classList.add("bad");
            btn.classList.add("chosen");
            var rightBtn = buttons.querySelector('[data-bucket="' + item.bucket + '"]');
            if (rightBtn) rightBtn.classList.add("correct");
            var rightLabel = sim.buckets.filter(function (b) { return b.id === item.bucket; })[0];
            feedback.className = "item-feedback bad";
            feedback.textContent = "सही उत्तर: " + (rightLabel ? rightLabel.label : "") + " — " + item.why;
          }
          feedback.hidden = false;
          updateSummary();
        });
        buttons.appendChild(btn);
      });

      row.appendChild(text);
      row.appendChild(buttons);
      row.appendChild(feedback);
      body.appendChild(row);
    });

    updateSummary();
  }

  /* ---------------- sequence ---------------- */
  function mountSequence(sim, body) {
    var steps = sim.steps || sim.items || [];
    var correctOrder = steps.map(function (_, index) { return index; });
    var order = correctOrder.slice();
    var finished = false;
    var attempts = 0;

    function shuffle(list) {
      for (var i = list.length - 1; i > 0; i -= 1) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = list[i];
        list[i] = list[j];
        list[j] = temp;
      }
    }
    do { shuffle(order); } while (order.length > 1 && order.every(function (value, index) { return value === index; }));

    var summary = document.createElement("div");
    summary.className = "sim-summary";
    summary.innerHTML = "चरणों को सही क्रम में लगाएँ, फिर “क्रम जाँचें” दबाएँ।";
    body.appendChild(summary);

    var list = document.createElement("ol");
    list.className = "seq-list";
    body.appendChild(list);

    var actions = document.createElement("div");
    actions.className = "sim-actions";
    var checkBtn = document.createElement("button");
    checkBtn.type = "button";
    checkBtn.className = "btn btn-sm";
    checkBtn.textContent = "क्रम जाँचें";
    var shuffleBtn = document.createElement("button");
    shuffleBtn.type = "button";
    shuffleBtn.className = "btn btn-sm btn-ghost";
    shuffleBtn.textContent = "फिर से मिलाएँ";
    actions.appendChild(checkBtn);
    actions.appendChild(shuffleBtn);
    body.appendChild(actions);
    var doneHolder = document.createElement("div");
    body.appendChild(doneHolder);

    function draw() {
      list.innerHTML = "";
      order.forEach(function (stepIndex, position) {
        var row = document.createElement("li");
        row.className = "seq-row";
        var pos = document.createElement("span");
        pos.className = "seq-pos";
        pos.textContent = position + 1;
        var text = document.createElement("span");
        text.className = "seq-text";
        text.textContent = steps[stepIndex].text;
        var moves = document.createElement("div");
        moves.className = "seq-moves";

        var up = document.createElement("button");
        up.type = "button";
        up.className = "move-btn";
        up.innerHTML = "↑";
        up.setAttribute("aria-label", "ऊपर ले जाएँ");
        up.disabled = position === 0 || finished;
        up.addEventListener("click", function () {
          var temp = order[position - 1];
          order[position - 1] = order[position];
          order[position] = temp;
          draw();
        });

        var down = document.createElement("button");
        down.type = "button";
        down.className = "move-btn";
        down.innerHTML = "↓";
        down.setAttribute("aria-label", "नीचे ले जाएँ");
        down.disabled = position === order.length - 1 || finished;
        down.addEventListener("click", function () {
          var temp = order[position + 1];
          order[position + 1] = order[position];
          order[position] = temp;
          draw();
        });

        moves.appendChild(up);
        moves.appendChild(down);
        row.appendChild(pos);
        row.appendChild(text);
        row.appendChild(moves);
        list.appendChild(row);
      });
    }

    checkBtn.addEventListener("click", function () {
      if (finished) return;
      attempts += 1;
      var allCorrect = true;
      Array.prototype.forEach.call(list.children, function (row, position) {
        row.classList.remove("ok", "bad");
        if (order[position] === position) row.classList.add("ok");
        else { row.classList.add("bad"); allCorrect = false; }
      });
      if (allCorrect) {
        finished = true;
        markSimDone();
        summary.innerHTML = "सही क्रम! हर चरण का कारण पढ़ें।";
        Array.prototype.forEach.call(list.children, function (row, position) {
          var why = document.createElement("span");
          why.className = "seq-why";
          why.textContent = steps[position].why;
          row.querySelector(".seq-text").appendChild(why);
        });
        checkBtn.disabled = true;
        shuffleBtn.disabled = true;
        doneHolder.appendChild(doneBox("सिम्युलेटर पूरा — सही क्रम और हर चरण का कारण याद रखें।"));
      } else {
        summary.innerHTML = "कुछ चरण अभी गलत जगह हैं। सोचें: <b>तैयारी/सुरक्षा पहले, प्रदर्शन उसके बाद, मूल्यांकन अंत में।</b>";
        if (attempts >= 2) {
          summary.innerHTML += " सुरक्षा और औज़ार की जाँच प्रदर्शन से पहले होनी चाहिए।";
        }
      }
    });

    shuffleBtn.addEventListener("click", function () {
      if (finished) return;
      order = correctOrder.slice();
      do { shuffle(order); } while (order.length > 1 && order.every(function (value, index) { return value === index; }));
      draw();
      summary.innerHTML = "नया क्रम बना दिया गया है — फिर से लगाएँ।";
    });

    draw();
  }

  /* ---------------- conditioning ---------------- */
  function mountConditioning(sim, body) {
    var pairings = 0;
    var conditioned = false;
    var logged = [];

    var stage = document.createElement("div");
    stage.className = "cond-stage";
    stage.innerHTML =
      '<div class="cond-state" id="condState">लार प्रतिक्रिया: कोई नहीं</div>' +
      '<div class="cond-sub" id="condSub">पहले “भोजन दें” दबाकर देखें।</div>' +
      '<div class="cond-meter" id="condMeter"><span></span><span></span><span></span></div>' +
      '<div class="sim-actions" style="justify-content:center"></div>';
    var actions = stage.querySelector(".sim-actions");
    body.appendChild(stage);

    var log = document.createElement("ul");
    log.className = "cond-log";
    body.appendChild(log);
    var doneHolder = document.createElement("div");
    body.appendChild(doneHolder);

    var state = stage.querySelector("#condState");
    var sub = stage.querySelector("#condSub");
    var meter = stage.querySelector("#condMeter");

    function addLog(text) {
      logged.unshift(text);
      log.innerHTML = logged.slice(0, 6).map(function (item) {
        return "<li>" + esc(item) + "</li>";
      }).join("");
    }

    function paintMeter() {
      Array.prototype.forEach.call(meter.children, function (bar, index) {
        bar.classList.toggle("on", index < Math.min(pairings, 3));
      });
    }

    function reset() {
      pairings = 0;
      conditioned = false;
      logged = [];
      log.innerHTML = "";
      state.textContent = "लार प्रतिक्रिया: कोई नहीं";
      state.style.color = "";
      sub.textContent = "पहले “भोजन दें” दबाकर देखें।";
      paintMeter();
      doneHolder.innerHTML = "";
    }

    function button(label, handler, primary) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-sm" + (primary ? "" : " btn-ghost");
      btn.textContent = label;
      btn.addEventListener("click", handler);
      actions.appendChild(btn);
      return btn;
    }

    button("भोजन दें", function () {
      state.textContent = "लार प्रतिक्रिया: पूरी (स्वाभाविक)";
      sub.textContent = "भोजन स्वाभाविक उद्दीपक है — लार अपने आप आती है।";
      addLog("<b>भोजन</b> → लार आई (स्वाभाविक प्रतिक्रिया)");
    }, true);

    button("घंटी बजाएँ", function () {
      if (pairings >= 3) {
        conditioned = true;
        state.textContent = "लार प्रतिक्रिया: पूरी (सीखी हुई)";
        state.style.color = "var(--good)";
        sub.textContent = "घंटी अब भोजन की याद दिलाती है — शास्त्रीय अनुबंधन बन गया।";
        addLog("<b>केवल घंटी</b> → लार आई (सीखी हुई प्रतिक्रिया)");
        if (!doneHolder.firstChild) {
          markSimDone();
          doneHolder.appendChild(doneBox("अनुबंधन पूरा: तटस्थ संकेत (घंटी) ने भोजन की जगह ले ली। इसी सिद्धांत से कक्षा में संकेत, दिनचर्या और अभ्यास की आदत बनती है।"));
        }
      } else {
        state.textContent = "लार प्रतिक्रिया: कोई नहीं";
        state.style.color = "";
        sub.textContent = "अभी घंटी अकेली काम नहीं करती। इसे भोजन के साथ " + (3 - pairings) + " बार और जोड़ें।";
        addLog("<b>केवल घंटी</b> → कोई लार नहीं (अभी तटस्थ)");
      }
    });

    button("घंटी + भोजन", function () {
      if (conditioned) {
        addLog("<b>घंटी + भोजन</b> → प्रतिक्रिया मजबूत रही");
        return;
      }
      pairings = Math.min(pairings + 1, 3);
      paintMeter();
      state.textContent = "लार प्रतिक्रिया: पूरी";
      sub.textContent = pairings < 3
        ? "जोड़ी " + pairings + " / 3 बनी। अभी " + (3 - pairings) + " जोड़ी और जोड़ें।"
        : "3 जोड़ियाँ पूरी — अब केवल घंटी बजाकर देखें।";
      addLog("<b>घंटी + भोजन</b> → जोड़ी " + pairings + " बनी, लार आई");
    }, true);

    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "btn btn-sm btn-outline";
    resetBtn.textContent = "रीसेट";
    resetBtn.addEventListener("click", reset);
    actions.appendChild(resetBtn);

    paintMeter();
  }

  /* ---------------- scenario ---------------- */
  function mountScenario(sim, body) {
    var roundIndex = 0;
    var score = 0;
    var finished = false;

    var head = document.createElement("div");
    head.className = "scenario-head";
    body.appendChild(head);
    var holder = document.createElement("div");
    body.appendChild(holder);
    var nextHolder = document.createElement("div");
    nextHolder.className = "sim-actions";
    body.appendChild(nextHolder);

    function draw() {
      var round = sim.rounds[roundIndex];
      head.innerHTML = '<span class="scenario-round">स्थिति ' + (roundIndex + 1) + " / " + sim.rounds.length + "</span>" +
        '<span class="pill ' + (score > 0 ? "good" : "") + '">सही: ' + score + "</span>";
      holder.innerHTML = "";
      nextHolder.innerHTML = "";

      var situation = document.createElement("div");
      situation.className = "scenario-situation";
      situation.textContent = round.situation;
      holder.appendChild(situation);

      var answered = false;
      round.options.forEach(function (option, optionIndex) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option-btn";
        btn.setAttribute("data-index", String(optionIndex));
        btn.textContent = option.text;
        btn.addEventListener("click", function () {
          if (answered) return;
          answered = true;
          var buttons = holder.querySelectorAll(".option-btn");
          Array.prototype.forEach.call(buttons, function (b) { b.disabled = true; });
          if (option.ok) {
            score += 1;
            btn.classList.add("ok");
            var good = document.createElement("span");
            good.className = "option-why good";
            good.textContent = "सही — " + option.why;
            btn.appendChild(good);
          } else {
            btn.classList.add("bad");
            var bad = document.createElement("span");
            bad.className = "option-why bad";
            bad.textContent = "यह सबसे अच्छा विकल्प नहीं — " + option.why;
            btn.appendChild(bad);
            var best = round.options.filter(function (o) { return o.ok; })[0];
            var bestIndex = round.options.findIndex(function (o) { return o.ok; });
            if (best && bestIndex >= 0) {
              var bestBtn = holder.querySelector('.option-btn[data-index="' + bestIndex + '"]');
              if (bestBtn) {
                bestBtn.classList.add("ok");
                var bestWhy = document.createElement("span");
                bestWhy.className = "option-why good";
                bestWhy.textContent = "सही उत्तर — " + best.why;
                bestBtn.appendChild(bestWhy);
              }
            }
          }
          head.innerHTML = '<span class="scenario-round">स्थिति ' + (roundIndex + 1) + " / " + sim.rounds.length + "</span>" +
            '<span class="pill good">सही: ' + score + "</span>";
          advance();
        });
        holder.appendChild(btn);
      });
    }

    function advance() {
      var next = document.createElement("button");
      next.type = "button";
      next.className = "btn btn-sm";
      next.textContent = roundIndex === sim.rounds.length - 1 ? "परिणाम देखें" : "अगली स्थिति";
      next.addEventListener("click", function () {
        if (roundIndex === sim.rounds.length - 1) {
          if (!finished) {
            finished = true;
            markSimDone();
          }
          head.innerHTML = '<span class="scenario-round">अभ्यास पूरा</span><span class="pill good">स्कोर: ' + score + " / " + sim.rounds.length + "</span>";
          holder.innerHTML = '<div class="sim-done">आपने ' + sim.rounds.length + " स्थितियों में से " + score +
            " बार सबसे अच्छा विकल्प चुना। हर कारण दोबारा पढ़कर अपने व्यवहार से जोड़ें।</div>" +
            '<div class="sim-actions"><button type="button" class="btn btn-sm btn-ghost" id="scenarioRetry">दोबारा अभ्यास करें</button></div>';
          document.getElementById("scenarioRetry").addEventListener("click", function () {
            roundIndex = 0;
            score = 0;
            finished = false;
            draw();
          });
          nextHolder.innerHTML = "";
        } else {
          roundIndex += 1;
          draw();
        }
      });
      nextHolder.innerHTML = "";
      nextHolder.appendChild(next);
    }

    draw();
  }

  /* ---------------- checklist ---------------- */
  function mountChecklist(sim, body) {
    var checked = false;
    var summary = document.createElement("div");
    summary.className = "sim-summary";
    summary.innerHTML = "कुल कथन: <b>" + sim.items.length + "</b>";
    body.appendChild(summary);

    var list = document.createElement("div");
    list.className = "check-list";
    body.appendChild(list);

    sim.items.forEach(function (item) {
      var row = document.createElement("label");
      row.className = "check-row";
      var input = document.createElement("input");
      input.type = "checkbox";
      var text = document.createElement("span");
      text.textContent = item.text;
      row.appendChild(input);
      row.appendChild(text);
      list.appendChild(row);
      item._row = row;
      item._input = input;
      item._text = text;
    });

    var actions = document.createElement("div");
    actions.className = "sim-actions";
    var check = document.createElement("button");
    check.type = "button";
    check.className = "btn btn-sm";
    check.textContent = "जाँचें";
    var retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn btn-sm btn-ghost";
    retry.textContent = "दोबारा करें";
    retry.hidden = true;
    actions.appendChild(check);
    actions.appendChild(retry);
    body.appendChild(actions);
    var doneHolder = document.createElement("div");
    body.appendChild(doneHolder);

    function reset() {
      checked = false;
      doneHolder.innerHTML = "";
      retry.hidden = true;
      check.disabled = false;
      summary.innerHTML = "कुल कथन: <b>" + sim.items.length + "</b>";
      sim.items.forEach(function (item) {
        item._input.disabled = false;
        item._input.checked = false;
        item._row.classList.remove("ok", "bad");
        var why = item._row.querySelector(".check-why");
        if (why) why.remove();
      });
    }

    check.addEventListener("click", function () {
      if (checked) return;
      checked = true;
      var correct = 0;
      sim.items.forEach(function (item) {
        var isRight = Boolean(item._input.checked) === Boolean(item.ok);
        if (isRight) correct += 1;
        item._row.classList.add(isRight ? "ok" : "bad");
        item._input.disabled = true;
        if (item._row.querySelector(".check-why")) return;
        var why = document.createElement("span");
        why.className = "check-why";
        why.textContent = item.why;
        item._text.appendChild(why);
      });
      summary.innerHTML = "सही पहचान: <b>" + correct + " / " + sim.items.length + "</b>";
      check.disabled = true;
      retry.hidden = false;
      if (correct === sim.items.length) {
        markSimDone();
        doneHolder.appendChild(doneBox("सभी सही — सिम्युलेटर पूरा। इन अच्छी आदतों को वर्कशॉप में अपनाएँ।"));
      } else {
        var note = document.createElement("div");
        note.className = "sim-hint";
        note.textContent = "हर कथन के नीचे कारण पढ़ें, फिर “दोबारा करें” से सुधारें। सिम्युलेटर सभी सही होने पर पूरा माना जाएगा।";
        doneHolder.appendChild(note);
      }
    });

    retry.addEventListener("click", reset);
  }

  /* ---------------- generic formula calculator ---------------- */
  function mountCalc(sim, body) {
    var form = document.createElement("form");
    form.className = "calc-form";
    form.setAttribute("novalidate", "");

    var fields = (sim.fields || []).map(function (item, index) {
      var id = "calcField" + index;
      var input;
      if (item.type === "select") {
        input = '<select class="input" id="' + id + '" name="' + esc(item.key) + '">' +
          (item.options || []).map(function (option) {
            return '<option value="' + esc(option.value) + '"' + (option.value === item.value ? " selected" : "") + ">" + esc(option.label) + "</option>";
          }).join("") + "</select>";
      } else {
        input = '<input class="input" id="' + id + '" name="' + esc(item.key) + '" type="number" inputmode="decimal" value="' + esc(item.value) + '"' +
          (item.min != null ? ' min="' + item.min + '"' : "") +
          (item.max != null ? ' max="' + item.max + '"' : "") +
          (item.step ? ' step="' + item.step + '"' : ' step="any"') + ">";
      }
      return '<label class="field" for="' + id + '"><span>' + rich(item.label) + "</span>" + input +
        (item.hint ? '<small class="field-hint">' + rich(item.hint) + "</small>" : "") + "</label>";
    }).join("");

    form.innerHTML = '<div class="calc-grid' + (sim.columns === 1 ? " one-col" : "") + '">' + fields + "</div>" +
      '<div class="sim-actions"><button type="submit" class="btn btn-sm">' + esc(sim.button || "गणना करें") + "</button>" +
      '<button type="button" class="btn btn-sm btn-ghost" data-calc-reset>रीसेट</button></div>' +
      '<div class="calc-result" hidden></div>';
    body.appendChild(form);

    var result = form.querySelector(".calc-result");

    function showError(message) {
      result.hidden = false;
      result.innerHTML = '<div class="calc-msg bad">' + rich(message) + "</div>";
    }

    function calculate() {
      var values = {};
      var invalid = null;
      (sim.fields || []).forEach(function (item) {
        var fieldEl = form.elements[item.key];
        var raw = fieldEl ? String(fieldEl.value).replace(/,/g, "").trim() : "";
        if (item.type === "select" || item.type === "text") {
          values[item.key] = raw;
        } else {
          var number = Number(raw);
          if (raw === "" || !Number.isFinite(number)) invalid = item.label;
          values[item.key] = number;
        }
      });
      if (invalid) return showError("कृपया “" + invalid + "” में सही संख्या भरें।");

      var out;
      try {
        out = sim.compute(values);
      } catch (error) {
        return showError("गणना में त्रुटि हुई — मान जाँचें।");
      }
      if (!out) return showError("गणना नहीं हो सकी — मान जाँचें।");
      if (out.error) return showError(out.error);

      result.hidden = false;
      result.innerHTML = "<h3>" + esc(out.title || "परिणाम") + "</h3>" +
        '<div class="calc-result-grid">' + (out.stats || []).map(function (stat) {
          return '<div class="calc-stat' + (stat.kind ? " " + stat.kind : "") + '"><span>' + rich(stat.label) + "</span><b>" + rich(stat.value) + "</b></div>";
        }).join("") + "</div>" +
        (out.note ? '<p class="calc-msg ' + (out.noteKind || "") + '">' + rich(out.note) + "</p>" : "");
      markSimDone();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      calculate();
    });
    var reset = form.querySelector("[data-calc-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        form.reset();
        result.hidden = true;
        result.innerHTML = "";
      });
    }
  }

  /* ---------------- calculator ---------------- */
  function numberFormatter() {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
  }

  function field(labelText, id, value, options) {
    options = options || {};
    return '<label class="field"><span>' + esc(labelText) + "</span>" +
      '<input class="input" id="' + id + '" type="number" inputmode="decimal" value="' + esc(value) + '"' +
      (options.min != null ? ' min="' + options.min + '"' : "") +
      (options.step ? ' step="' + options.step + '"' : ' step="any"') +
      "></label>";
  }

  function mountCalculator(sim, body) {
    var preset = sim.preset;
    var form = document.createElement("form");
    form.className = "calc-form";
    form.setAttribute("novalidate", "");
    var fields = "";
    if (preset === "blueprint") {
      fields =
        '<div class="calc-grid">' +
          field("कुल प्रश्न", "calcTotal", 50, { min: 1, step: "1" }) +
          field("प्रति प्रश्न अंक", "calcMarks", 1, { min: 0.5, step: "0.5" }) +
          field("आसान प्रश्न (%)", "calcEasy", 30, { min: 0, step: "1" }) +
          field("मध्यम प्रश्न (%)", "calcMedium", 50, { min: 0, step: "1" }) +
          field("कठिन प्रश्न (%)", "calcHard", 20, { min: 0, step: "1" }) +
        "</div>";
    } else if (preset === "profit") {
      fields =
        '<div class="calc-grid">' +
          field("प्रति इकाई लागत (₹)", "calcCost", 1800, { min: 0 }) +
          field("प्रति इकाई विक्रय मूल्य (₹)", "calcPrice", 3200, { min: 0 }) +
          field("बेची गई इकाइयाँ", "calcUnits", 12, { min: 0, step: "1" }) +
          field("मासिक स्थिर खर्च (₹)", "calcFixed", 9000, { min: 0 }) +
        "</div>";
    } else {
      fields =
        '<div class="calc-grid">' +
          field("वार्षिक लक्ष्य (घंटे)", "calcTarget", 50, { min: 1 }) +
          field("अब तक पूरे (घंटे)", "calcDone", 20, { min: 0 }) +
          field("बचे महीने", "calcMonths", 6, { min: 1, step: "1" }) +
        "</div>";
    }
    form.innerHTML = fields +
      '<div class="sim-actions"><button type="submit" class="btn btn-sm">गणना करें</button>' +
      '<button type="button" class="btn btn-sm btn-ghost" id="calcReset">रीसेट</button></div>' +
      '<div class="calc-result" id="calcResult" hidden></div>';
    body.appendChild(form);

    var result = form.querySelector("#calcResult");

    function valueOf(id) {
      return Number(String(document.getElementById(id).value).replace(/,/g, ""));
    }

    function showError(message) {
      result.hidden = false;
      result.innerHTML = '<div class="calc-msg bad">' + esc(message) + "</div>";
    }

    function stat(label, value, kind) {
      return '<div class="calc-stat' + (kind ? " " + kind : "") + '"><span>' + esc(label) + "</span><b>" + esc(value) + "</b></div>";
    }

    function calculate() {
      var fmt = numberFormatter();
      if (preset === "blueprint") {
        var total = valueOf("calcTotal");
        var marks = valueOf("calcMarks");
        var easy = valueOf("calcEasy");
        var medium = valueOf("calcMedium");
        var hard = valueOf("calcHard");
        if (!Number.isFinite(total) || total < 1 || Math.floor(total) !== total) return showError("कुल प्रश्न पूरी संख्या में और 1 या अधिक होने चाहिए।");
        if (!Number.isFinite(marks) || marks <= 0) return showError("प्रति प्रश्न अंक 0 से अधिक होने चाहिए।");
        if ([easy, medium, hard].some(function (v) { return !Number.isFinite(v) || v < 0; })) return showError("प्रतिशत 0 या उससे अधिक होना चाहिए।");
        var sum = easy + medium + hard;
        if (Math.abs(sum - 100) > 0.5) return showError("तीनों प्रतिशत का जोड़ 100 होना चाहिए (अभी " + fmt.format(sum) + " है)।");

        var raw = [total * easy / 100, total * medium / 100, total * hard / 100];
        var counts = raw.map(function (v) { return Math.floor(v); });
        var remainder = total - counts.reduce(function (a, b) { return a + b; }, 0);
        var fractions = raw.map(function (v, i) { return { i: i, frac: v - Math.floor(v) }; })
          .sort(function (a, b) { return b.frac - a.frac; });
        for (var k = 0; k < remainder; k += 1) counts[fractions[k % 3].i] += 1;

        var totalMarks = total * marks;
        var minutes = Math.ceil(total * 1.2);
        result.hidden = false;
        result.innerHTML = "<h3>ब्लूप्रिंट परिणाम</h3>" +
          '<div class="calc-result-grid">' +
            stat("आसान", counts[0] + " प्रश्न") +
            stat("मध्यम", counts[1] + " प्रश्न") +
            stat("कठिन", counts[2] + " प्रश्न") +
            stat("कुल अंक", fmt.format(totalMarks)) +
            stat("सुझाया समय", "≈ " + minutes + " मिनट") +
          "</div>" +
          '<p class="calc-msg">जोड़: ' + counts[0] + " + " + counts[1] + " + " + counts[2] + " = " + total +
          " प्रश्न। कठिनाई के साथ-साथ टॉपिक/LO का कवरेज भी देखें।</p>";
        markSimDone();
      } else if (preset === "profit") {
        var cost = valueOf("calcCost");
        var price = valueOf("calcPrice");
        var units = valueOf("calcUnits");
        var fixed = valueOf("calcFixed");
        if ([cost, price, units, fixed].some(function (v) { return !Number.isFinite(v) || v < 0; })) return showError("सभी मान 0 या उससे अधिक होने चाहिए।");
        if (price <= 0) return showError("विक्रय मूल्य 0 से अधिक होना चाहिए।");
        var revenue = price * units;
        var variable = cost * units;
        var totalCost = variable + fixed;
        var profit = revenue - totalCost;
        var contribution = price - cost;
        var breakEven = contribution > 0 ? Math.ceil(fixed / contribution) : null;
        var margin = revenue > 0 ? (profit / revenue) * 100 : 0;
        result.hidden = false;
        result.innerHTML = "<h3>व्यवसाय का हिसाब</h3>" +
          '<div class="calc-result-grid">' +
            stat("कुल आय", "₹" + fmt.format(revenue)) +
            stat("कुल लागत", "₹" + fmt.format(totalCost)) +
            stat(profit >= 0 ? "मुनाफा" : "घाटा", "₹" + fmt.format(Math.abs(profit)), profit >= 0 ? "good" : "bad") +
            stat("प्रति इकाई योगदान", "₹" + fmt.format(contribution)) +
            stat("ब्रेक-ईवन", breakEven == null ? "संभव नहीं" : breakEven + " इकाई") +
            stat("मुनाफा मार्जिन", fmt.format(margin) + "%") +
          "</div>" +
          '<p class="calc-msg ' + (profit >= 0 ? "good" : "bad") + '">' +
            (profit >= 0
              ? "इस बिक्री पर लागू स्थिर खर्च के बाद लाभ हुआ।"
              : "इस बिक्री पर स्थिर खर्च नहीं निकला — लागत/कीमत/इकाइयाँ जाँचें।") +
          "</p>" +
          '<p class="calc-msg">ब्रेक-ईवन = स्थिर खर्च ÷ प्रति इकाई योगदान (' + fmt.format(fixed) + " ÷ " + fmt.format(contribution) + ")" +
          (breakEven == null ? " — योगदान शून्य/ऋणात्मक है।" : " ≈ " + breakEven + " इकाई (ऊपर की ओर पूर्णांक)।") +
          "</p>";
        markSimDone();
      } else {
        var target = valueOf("calcTarget");
        var done = valueOf("calcDone");
        var months = valueOf("calcMonths");
        if (!Number.isFinite(target) || target <= 0) return showError("लक्ष्य घंटे 0 से अधिक होने चाहिए।");
        if (!Number.isFinite(done) || done < 0) return showError("पूरे किए घंटे 0 या अधिक होने चाहिए।");
        if (!Number.isFinite(months) || months < 1) return showError("बचे महीने 1 या अधिक होने चाहिए।");
        var remaining = Math.max(0, target - done);
        var perMonth = remaining / months;
        var perWeek = remaining / (months * 4.33);
        var status = remaining <= 0 ? "लक्ष्य पूरा" : perMonth <= 4 ? "आसान" : perMonth <= 8 ? "संतुलित" : "चुनौतीपूर्ण";
        result.hidden = false;
        result.innerHTML = "<h3>CPD योजना</h3>" +
          '<div class="calc-result-grid">' +
            stat("बाकी घंटे", fmt.format(Math.round(remaining * 10) / 10)) +
            stat("प्रति महीना", fmt.format(Math.round(perMonth * 10) / 10) + " घंटे") +
            stat("प्रति हफ्ता", fmt.format(Math.round(perWeek * 10) / 10) + " घंटे") +
            stat("स्थिति", status, status === "लक्ष्य पूरा" ? "good" : "") +
          "</div>" +
          '<p class="calc-msg">' + (remaining <= 0
            ? "लक्ष्य पूरा हो गया — अगला CPD चक्र तय करें।"
            : "हफ्ते में " + fmt.format(Math.round(perWeek * 10) / 10) + " घंटे नियमित रखें; महीने में लगभग " + fmt.format(Math.round(perMonth * 10) / 10) + " घंटे।") +
          "</p>";
        markSimDone();
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      calculate();
    });
    var resetBtn = form.querySelector("#calcReset");
    resetBtn.addEventListener("click", function () {
      form.reset();
      result.hidden = true;
      result.innerHTML = "";
    });
  }

  /* ---------------- levels ---------------- */
  function mountLevels(sim, body) {
    var explored = {};
    var chips = document.createElement("div");
    chips.className = "level-chips";
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", "NSQF स्तर");
    body.appendChild(chips);

    var detail = document.createElement("div");
    detail.className = "level-detail";
    body.appendChild(detail);
    var hint = document.createElement("p");
    hint.className = "sim-hint";
    body.appendChild(hint);

    function show(level) {
      var item = sim.levels.filter(function (l) { return l.level === level; })[0];
      if (!item) return;
      explored[level] = true;
      Array.prototype.forEach.call(chips.children, function (chip) {
        chip.setAttribute("aria-pressed", Number(chip.getAttribute("data-level")) === level ? "true" : "false");
      });
      detail.innerHTML = "<h3>NSQF स्तर " + item.level + " — " + esc(item.title) + "</h3>" +
        "<p>" + esc(item.desc) + "</p>" +
        '<p class="level-example"><b>उदाहरण:</b> ' + esc(item.example) + "</p>";
      var seen = Object.keys(explored).length;
      hint.textContent = "देखे गए स्तर: " + seen + " / 3 — कम से कम 3 स्तर देखकर बदलाव समझें।";
      if (seen >= 3) {
        markSimDone();
        hint.textContent = "देखे गए स्तर: " + seen + " — सिम्युलेटर पूरा। स्तर 5 (CITS) पर जिम्मेदारी और स्वायत्तता दोनों बढ़ जाती हैं।";
      }
    }

    sim.levels.forEach(function (item) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "level-chip";
      chip.setAttribute("data-level", String(item.level));
      chip.setAttribute("aria-pressed", "false");
      chip.textContent = item.level;
      chip.addEventListener("click", function () { show(item.level); });
      chips.appendChild(chip);
    });

    show(5);
  }

  /* ---------------- match ---------------- */
  function mountMatch(sim, body) {
    var selectedKey = null;
    var matched = 0;
    var summary = document.createElement("div");
    summary.className = "sim-summary";
    body.appendChild(summary);

    var wrap = document.createElement("div");
    wrap.className = "match-wrap";
    var leftCol = document.createElement("div");
    leftCol.className = "match-col";
    leftCol.innerHTML = "<h3>तकनीक</h3>";
    var rightCol = document.createElement("div");
    rightCol.className = "match-col";
    rightCol.innerHTML = "<h3>उपयोग / अर्थ</h3>";
    wrap.appendChild(leftCol);
    wrap.appendChild(rightCol);
    body.appendChild(wrap);
    var doneHolder = document.createElement("div");
    body.appendChild(doneHolder);

    function updateSummary() {
      summary.innerHTML = "जोड़े मिले: <b>" + matched + " / " + sim.pairs.length + "</b>";
      if (matched === sim.pairs.length) {
        summary.innerHTML += '<span class="sim-status good">सिम्युलेटर पूरा</span>';
        markSimDone();
        doneHolder.appendChild(doneBox("सभी तकनीक और उनके उपयोग सही मिलाए। नई तकनीक का अर्थ और सुरक्षित उपयोग दोनों याद रखें।"));
      }
    }

    function clearSelection() {
      selectedKey = null;
      Array.prototype.forEach.call(leftCol.querySelectorAll(".match-btn"), function (btn) {
        if (!btn.classList.contains("matched")) btn.classList.remove("selected");
      });
    }

    sim.pairs.forEach(function (pair, index) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "match-btn";
      btn.textContent = pair.left;
      btn.setAttribute("data-key", String(index));
      btn.addEventListener("click", function () {
        if (btn.classList.contains("matched")) return;
        clearSelection();
        selectedKey = index;
        btn.classList.add("selected");
        summary.innerHTML = "अब दाईं ओर से सही उपयोग चुनें।";
      });
      leftCol.appendChild(btn);
    });

    var rightOrder = sim.pairs.map(function (_, index) { return index; });
    for (var i = rightOrder.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = rightOrder[i];
      rightOrder[i] = rightOrder[j];
      rightOrder[j] = temp;
    }

    rightOrder.forEach(function (index) {
      var pair = sim.pairs[index];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "match-btn";
      btn.textContent = pair.right;
      btn.setAttribute("data-key", String(index));
      btn.addEventListener("click", function () {
        if (btn.classList.contains("matched")) return;
        if (selectedKey == null) {
          summary.innerHTML = "पहले बाईं ओर से कोई तकनीक चुनें।";
          return;
        }
        var key = selectedKey;
        var leftBtn = leftCol.querySelector('[data-key="' + key + '"]');
        if (key === index) {
          matched += 1;
          btn.classList.add("matched");
          btn.disabled = true;
          if (leftBtn) {
            leftBtn.classList.add("matched");
            leftBtn.classList.remove("selected");
            leftBtn.disabled = true;
          }
          clearSelection();
          updateSummary();
        } else {
          btn.classList.add("wrong");
          if (leftBtn) leftBtn.classList.add("wrong");
          summary.innerHTML = "यह जोड़ा सही नहीं है — फिर सोचें।";
          window.setTimeout(function () {
            btn.classList.remove("wrong");
            if (leftBtn) leftBtn.classList.remove("wrong");
            clearSelection();
          }, 650);
        }
      });
      rightCol.appendChild(btn);
    });

    updateSummary();
  }

  /* ---------------- find (चित्र में भाग खोजें) ---------------- */
  function mountFind(sim, body) {
    var rounds = sim.rounds || [];
    var roundIndex = 0;
    var firstTryCorrect = 0;
    var misses = 0;
    var finished = false;

    body.innerHTML =
      '<div class="find-wrap">' +
        '<div class="fig-interactive">' + figureHTML(sim.figure, { conceal: true, interactive: true }) + "</div>" +
        '<div class="find-panel">' +
          '<div class="sim-summary"><span class="find-progress"></span><b class="find-score"></b></div>' +
          '<p class="find-prompt" aria-live="polite"></p>' +
          '<div class="find-feedback" aria-live="polite"></div>' +
        "</div>" +
      "</div>";

    var progressEl = body.querySelector(".find-progress");
    var scoreEl = body.querySelector(".find-score");
    var promptEl = body.querySelector(".find-prompt");
    var feedbackEl = body.querySelector(".find-feedback");
    var nodes = Array.prototype.slice.call(body.querySelectorAll(".fig-node[data-node]"));

    function reveal(node) {
      node.classList.add("found");
      node.classList.remove("is-concealed");
      node.disabled = true;
      var label = node.querySelector(".fig-label");
      var note = node.querySelector(".fig-note");
      if (label) label.textContent = node.getAttribute("data-label") || "";
      if (note) note.textContent = node.getAttribute("data-note") || "";
    }

    function refresh() {
      if (roundIndex >= rounds.length) {
        finished = true;
        nodes.forEach(reveal);
        progressEl.textContent = "पूरा हुआ";
        scoreEl.textContent = "पहले प्रयास में सही: " + firstTryCorrect + " / " + rounds.length;
        promptEl.textContent = "बधाई! अब चित्र के सभी भागों के नाम दिख रहे हैं।";
        feedbackEl.className = "find-feedback good";
        feedbackEl.textContent = "नीचे दिए चित्र को एक बार फिर देखें और नाम याद करें।";
        markSimDone();
        body.appendChild(doneBox("चित्र-अभ्यास पूरा — अब आप प्रक्रिया के सभी भाग पहचान सकते हैं।"));
        return;
      }
      progressEl.textContent = "भाग " + (roundIndex + 1) + " / " + rounds.length;
      scoreEl.textContent = "पहले प्रयास में सही: " + firstTryCorrect;
      promptEl.textContent = rounds[roundIndex].prompt;
      feedbackEl.textContent = "चित्र में सही भाग पर क्लिक करें।";
      feedbackEl.className = "find-feedback";
      misses = 0;
    }

    nodes.forEach(function (node) {
      node.addEventListener("click", function () {
        if (finished || roundIndex >= rounds.length) return;
        var round = rounds[roundIndex];
        var nodeIndex = Number(node.getAttribute("data-node"));
        if (nodeIndex === round.index) {
          if (misses === 0) firstTryCorrect += 1;
          reveal(node);
          feedbackEl.className = "find-feedback good";
          feedbackEl.textContent = "सही! " + (round.why || "");
          roundIndex += 1;
          window.setTimeout(refresh, 850);
        } else {
          misses += 1;
          node.classList.add("miss");
          window.setTimeout(function () { node.classList.remove("miss"); }, 650);
          feedbackEl.className = "find-feedback bad";
          feedbackEl.textContent = misses >= 2 && round.hint
            ? "संकेत: " + round.hint
            : "यह सही भाग नहीं है — सोचकर दूसरा भाग चुनें।";
        }
      });
    });

    refresh();
  }

  /* ---------------- quiz ---------------- */
  function mountQuiz(quiz, mount) {
    var card = document.createElement("div");
    card.className = "quiz-card";
    mount.appendChild(card);

    function draw() {
      var saved = window.FITrade.load().quiz[current.id];
      var questions = quiz.map(function (item, qIndex) {
        var options = item.options.map(function (option, oIndex) {
          return '<label class="quiz-opt" data-q="' + qIndex + '" data-o="' + oIndex + '">' +
            '<input type="radio" name="q' + qIndex + '" value="' + oIndex + '">' +
            "<span>" + esc(option) + "</span></label>";
        }).join("");
        return '<div class="quiz-q"><fieldset><legend class="quiz-question">' +
          (qIndex + 1) + ". " + esc(item.q) + "</legend>" + options +
          '<div class="quiz-why" data-why="' + qIndex + '" hidden></div></fieldset></div>';
      }).join("");

      var savedNote = saved
        ? '<span class="pill good">पिछला स्कोर: ' + saved.score + " / " + saved.total + "</span>"
        : '<span class="pill">अभी तक नहीं दिया</span>';

      card.innerHTML =
        '<div class="sim-head">' +
          '<span class="sim-kicker">अभ्यास क्विज़</span>' +
          "<h2>अपनी समझ जाँचें</h2>" +
          "<p>सभी प्रश्नों के उत्तर चुनें, फिर जाँचें। हर उत्तर का कारण भी दिखेगा।</p>" +
        "</div>" +
        '<div class="sim-body">' +
          '<div class="sim-summary"><span>कुल प्रश्न: <b>' + quiz.length + "</b></span>" + savedNote + "</div>" +
          '<form id="quizForm" novalidate>' + questions +
            '<div class="sim-actions"><button type="submit" class="btn">उत्तर जाँचें</button></div>' +
            '<div id="quizFeedback" aria-live="polite"></div>' +
          "</form>" +
        "</div>";

      var form = card.querySelector("#quizForm");
      var feedback = card.querySelector("#quizFeedback");

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var answers = [];
        for (var index = 0; index < quiz.length; index += 1) {
          var chosen = form.querySelector('input[name="q' + index + '"]:checked');
          answers.push(chosen ? Number(chosen.value) : -1);
        }
        if (answers.indexOf(-1) !== -1) {
          feedback.innerHTML = '<div class="notice warn" style="margin-top:10px">कृपया सभी प्रश्नों के उत्तर चुनें।</div>';
          return;
        }

        var score = 0;
        quiz.forEach(function (item, qIndex) {
          var chosenIndex = answers[qIndex];
          var isRight = chosenIndex === item.answer;
          if (isRight) score += 1;
          var labels = form.querySelectorAll('.quiz-opt[data-q="' + qIndex + '"]');
          Array.prototype.forEach.call(labels, function (label) {
            var optionIndex = Number(label.getAttribute("data-o"));
            label.querySelector("input").disabled = true;
            if (optionIndex === item.answer) label.classList.add("correct");
            if (optionIndex === chosenIndex && chosenIndex !== item.answer) label.classList.add("wrong");
          });
          var why = form.querySelector('[data-why="' + qIndex + '"]');
          if (why) {
            why.hidden = false;
            why.className = "quiz-why " + (isRight ? "good" : "bad");
            why.textContent = (isRight ? "सही। " : "सही उत्तर: " + item.options[item.answer] + "। ") + item.why;
          }
        });

        var percent = Math.round((score / quiz.length) * 100);
        var kind = percent >= 75 ? "good" : "bad";
        feedback.innerHTML =
          '<div class="quiz-score ' + kind + '"><span>आपका स्कोर: <b>' + score + " / " + quiz.length + "</b> (" + percent + "%)</span>" +
          "<span>" + (percent >= 75 ? "बहुत अच्छा — आगे बढ़ें।" : "एक बार अध्याय दोबारा पढ़कर फिर प्रयास करें।") + "</span></div>" +
          '<div class="sim-actions"><button type="button" class="btn btn-sm btn-ghost" id="quizRetry">दोबारा प्रयास</button></div>';

        window.FITrade.saveQuiz(current.id, score, quiz.length);
        var summaryPill = card.querySelector(".sim-summary .pill");
        if (summaryPill) {
          summaryPill.className = "pill good";
          summaryPill.textContent = "स्कोर: " + score + " / " + quiz.length;
        }
        var retry = feedback.querySelector("#quizRetry");
        retry.addEventListener("click", draw);
      });
    }

    draw();
  }

  /* ---------------- boot ---------------- */
  renderNav();
  renderArticle();
})();
