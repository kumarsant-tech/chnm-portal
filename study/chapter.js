/* अध्याय व्यूअर + इंटरैक्टिव सिमुलेटर + क्विज़ */
(function () {
  "use strict";

  var modules = window.STUDY_MODULES || [];
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

  document.title = "अध्याय " + current.id + ": " + current.title + " · Training Methodology";
  window.FIStudy.markLast(current.id);

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function numberedList(items, tag) {
    var element = tag || "ul";
    return "<" + element + ">" + items.map(function (item) {
      return "<li>" + esc(item) + "</li>";
    }).join("") + "</" + element + ">";
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
    var progress = window.FIStudy.load();
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
    var stats = window.FIStudy.stats();
    if (sideProgressText) sideProgressText.textContent = stats.read + " / " + stats.total + " पढ़े";
    if (sideProgressFill) {
      sideProgressFill.style.width = (stats.total ? Math.round((stats.read / stats.total) * 100) : 0) + "%";
    }
  }

  function renderArticle() {
    var sections = (current.sections || []).map(function (section, index) {
      return '<section class="section-block">' +
        '<h2><span class="sec-num">' + pad(index + 1) + '</span>' + esc(section.h) + '</h2>' +
        (section.p || []).map(function (paragraph) {
          return "<p>" + esc(paragraph) + "</p>";
        }).join("") +
        (section.figure ? figureHTML(section.figure) : "") +
        (section.list && section.list.length ? numberedList(section.list) : "") +
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

    article.innerHTML =
      '<div class="chapter-topline">' +
        '<span class="chapter-eyebrow">मॉड्यूल ' + pad(current.id) + " · " + esc(current.code) + "</span>" +
        '<span class="pill">' + esc(current.minutes) + " मिनट</span>" +
      "</div>" +
      "<h1>" + esc(current.title) + "</h1>" +
      '<p class="chapter-subtitle">' + esc(current.subtitle) + "</p>" +
      '<p class="chapter-tagline">' + esc(current.tagline) + "</p>" +
      '<div class="chapter-actions">' +
        '<button type="button" class="btn btn-soft" id="markReadBtn" aria-pressed="false">पढ़ा हुआ चिह्नित करें</button>' +
        '<button type="button" class="btn btn-ghost" id="printBtn">प्रिंट करें</button>' +
      "</div>" +
      '<div class="intro-box"><p>' + esc(current.intro) + "</p></div>" +
      '<div class="outcome-box"><h2>इस अध्याय के बाद आप…</h2>' + numberedList(current.outcomes) + "</div>" +
      sections +
      '<div class="key-box"><h2>मुख्य बिंदु</h2>' + numberedList(current.keyPoints) + "</div>" +
      '<div class="example-box"><h2>' + esc(current.example.title) + "</h2><p>" + esc(current.example.text) + "</p></div>" +
      '<div id="simMount"></div>' +
      '<div id="quizMount"></div>' +
      '<div class="remember-box">' + esc(current.remember) + "</div>" +
      footNav +
      '<p class="chapter-note">यह अध्याय NIMI <i>Training Methodology — NSQF Level 5 (संशोधित 2022)</i> के विषय-क्रम पर आधारित ' +
      "स्वतंत्र, सरल हिंदी सामग्री है। मूल पुस्तक का पाठ यहाँ कॉपी नहीं किया गया है। © NIMI।</p>";

    var readBtn = document.getElementById("markReadBtn");
    if (readBtn) {
      readBtn.addEventListener("click", function () {
        var progress = window.FIStudy.load();
        if (progress.read[current.id]) window.FIStudy.unmarkRead(current.id);
        else window.FIStudy.markRead(current.id);
        updateChrome();
      });
    }
    var printBtn = document.getElementById("printBtn");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

    var simMount = document.getElementById("simMount");
    if (simMount) {
      var simList = [];
      if (current.sim) simList.push(current.sim);
      if (Array.isArray(current.sims)) simList = simList.concat(current.sims);
      simList.forEach(function (sim) { mountSim(sim, simMount); });
    }

    var quizMount = document.getElementById("quizMount");
    if (quizMount && current.quiz && current.quiz.length) mountQuiz(current.quiz, quizMount);

    updateChrome();
  }

  /* ---------------- simulator shell ---------------- */
  function mountSim(sim, mount) {
    var card = document.createElement("div");
    card.className = "sim-card";
    card.innerHTML =
      '<div class="sim-head">' +
        '<span class="sim-kicker">इंटरैक्टिव सिम्युलेटर</span>' +
        "<h2>" + esc(sim.title) + "</h2>" +
        "<p>" + esc(sim.instructions) + "</p>" +
      "</div>" +
      '<div class="sim-body"></div>';
    mount.appendChild(card);
    var body = card.querySelector(".sim-body");

    if (window.FIStudy.load().sims[current.id]) {
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
    else if (sim.type === "calculator") mountCalculator(sim, body);
    else if (sim.type === "levels") mountLevels(sim, body);
    else if (sim.type === "match") mountMatch(sim, body);
    else if (sim.type === "find") mountFind(sim, body);
    else if (sim.type === "live") {
      if (window.FITmLive) window.FITmLive.mount(sim, body, markSimDone);
      else {
        var missing = document.createElement("p");
        missing.className = "sim-hint";
        missing.textContent = "यह सिमुलेटर लोड नहीं हो सका — पेज फिर से खोलकर देखें।";
        body.appendChild(missing);
      }
    }
  }

  function doneBox(text) {
    var box = document.createElement("div");
    box.className = "sim-done";
    box.textContent = text;
    return box;
  }

  function markSimDone() {
    window.FIStudy.markSim(current.id);
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
      var saved = window.FIStudy.load().quiz[current.id];
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

        window.FIStudy.saveQuiz(current.id, score, quiz.length);
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
