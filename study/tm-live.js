/* tm-live.js — Training Methodology के "LIVE" सिमुलेटर, SMPS लैब की शैली में:
   स्लाइर → तुरंत कैनवस ग्राफ/आकृति → रीडआउट संख्या → स्थिति संदेश।
   कोई बाहरी लाइब्रेरी नहीं; केवल canvas 2D और DOM। */
(function () {
  "use strict";

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function fmt(v, d) {
    return Number(v).toLocaleString("en-IN", { maximumFractionDigits: d == null ? 1 : d });
  }

  /* ---------------- shell ---------------- */
  function shell(body, sim) {
    var root = document.createElement("div");
    root.className = "live-sim";
    root.innerHTML =
      '<div class="live-top"><b>LIVE</b><span>' + esc(sim.title) + "</span></div>" +
      '<div class="live-stage"></div>' +
      '<div class="live-controls"></div>' +
      '<div class="live-readout"></div>' +
      '<div class="live-status" aria-live="polite"></div>';
    body.appendChild(root);
    return {
      root: root,
      stage: root.querySelector(".live-stage"),
      controls: root.querySelector(".live-controls"),
      readout: root.querySelector(".live-readout"),
      status: root.querySelector(".live-status")
    };
  }

  function stats(ui, items) {
    ui.readout.innerHTML = '<div class="live-grid">' + items.map(function (it) {
      return '<div class="live-stat' + (it.kind ? " " + it.kind : "") + '"><span>' + esc(it.label) + "</span><b>" + esc(it.value) + "</b></div>";
    }).join("") + "</div>";
  }

  function status(ui, text, kind) {
    ui.status.className = "live-status" + (kind ? " " + kind : "");
    ui.status.textContent = text;
  }

  function done(ui, ctx) {
    if (ui.finished || !ctx || !ctx.done) return;
    ui.finished = true;
    ctx.done();
  }

  function range(label, id, min, max, step, value, unit) {
    return '<label class="live-field">' + esc(label) +
      '<output>' + value + (unit || "") + "</output>" +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step +
      '" value="' + value + '" data-unit="' + (unit || "") + '"></label>';
  }

  function select(label, id, options, value) {
    return '<label class="live-field">' + esc(label) + "<select id=\"" + id + '">' +
      options.map(function (o) {
        return '<option value="' + o.v + '"' + (o.v === value ? " selected" : "") + ">" + esc(o.t) + "</option>";
      }).join("") + "</select></label>";
  }

  function bind(ui, id, fn) {
    var input = ui.controls.querySelector("#" + id);
    if (!input) return null;
    var handler = function () {
      var out = input.parentNode.querySelector("output");
      if (out) out.textContent = input.value + (input.getAttribute("data-unit") || "");
      fn(input.type === "range" || input.type === "number" ? Number(input.value) : input.value);
    };
    input.addEventListener("input", handler);
    input.addEventListener("change", handler);
    return input;
  }

  function button(ui, id, label, fn, ghost) {
    var b = ui.controls.querySelector("#" + id);
    if (!b) {
      b = document.createElement("button");
      b.type = "button";
      b.id = id;
      (ui.controls.querySelector(".live-row") || ui.controls).appendChild(b);
    }
    b.className = "live-btn" + (ghost ? " ghost" : "");
    b.textContent = label;
    b.addEventListener("click", fn);
    return b;
  }

  /* ---------------- canvas helpers ---------------- */
  function scope(ui, w, h, aria) {
    ui.stage.innerHTML = '<canvas class="live-scope" width="' + w + '" height="' + h + '" aria-label="' + esc(aria) + '"></canvas>';
    var c = ui.stage.querySelector("canvas");
    return { c: c, g: c.getContext("2d") };
  }

  function board(g, w, h, dark) {
    g.fillStyle = dark ? "#071a25" : "#ffffff";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = dark ? "rgba(120,170,195,.18)" : "rgba(13,107,95,.10)";
    g.lineWidth = 1;
    for (var x = 0; x <= w; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (var y = 0; y <= h; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  }

  function text(g, s, x, y, size, color, align, bold) {
    g.fillStyle = color || "#0d1b26";
    g.font = (bold ? "700 " : "500 ") + (size || 12) + 'px "Noto Sans Devanagari", system-ui, sans-serif';
    g.textAlign = align || "left";
    g.textBaseline = "middle";
    g.fillText(s, x, y);
  }

  function line(g, pts, color, width, dashed) {
    g.strokeStyle = color;
    g.lineWidth = width || 2;
    g.setLineDash(dashed ? [6, 5] : []);
    g.beginPath();
    pts.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); });
    g.stroke();
    g.setLineDash([]);
  }

  function bar(g, x, y, w, h, color) {
    g.fillStyle = color;
    g.fillRect(x, y, w, h);
  }

  function axis(g, x0, y0, x1, y1, color) {
    g.strokeStyle = color || "#8aa";
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x0, y1);
    g.lineTo(x1, y1);
    g.stroke();
  }

  /* =============================================================
     1. शिक्षण स्तर + Bloom (levels)
     ============================================================= */
  function sceneLevels(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML = '<div class="live-row">' +
      range("कक्षा का समय (मिनट)", "lvTime", 10, 60, 5, 30, " मिनट") +
      range("याद स्तर के प्रश्न (%)", "lvMem", 0, 100, 5, 40, "%") +
      range("समझ स्तर के प्रश्न (%)", "lvUnd", 0, 100, 5, 40, "%") +
      '<button type="button" class="live-btn ghost" id="lvReset">रीसेट</button></div>' +
      '<p class="live-hint">शेष प्रतिशत चिंतन स्तर (reflective) को मिलता है। Bloom के ऊपरी स्तर — Apply, Analyse, Evaluate, Create — तभी सक्रिय होंगे जब समझ और चिंतन पर पर्याप्त समय जाए।</p>';
    var sc = scope(ui, 640, 300, "शिक्षण स्तर और Bloom पिरामिड");
    var state = { time: 30, mem: 40, und: 40 };

    function calc() {
      var reflect = Math.max(0, 100 - state.mem - state.und);
      var lower = state.mem * 0.6 + state.und * 0.25;
      var higher = state.und * 0.55 + reflect * 0.85;
      var skill = Math.min(100, higher * 0.9 + reflect * 0.35);
      var level = reflect >= 30 ? "चिंतन स्तर (reflective)" : state.und >= 40 ? "समझ स्तर (understanding)" : "स्मृति स्तर (memory)";
      return { reflect: reflect, lower: Math.min(100, lower), higher: Math.min(100, higher), skill: skill, level: level };
    }

    function draw() {
      var c = calc(), g = sc.g, w = sc.c.width, h = sc.c.height;
      board(g, w, h, false);
      /* बाएँ: Bloom पिरामिड */
      var names = ["Remember", "Understand", "Apply", "Analyse", "Evaluate", "Create"];
      var widths = [46, 62, 78, 94, 110, 126];
      var baseX = 40, top = 40, rowH = 34;
      for (var i = 5; i >= 0; i--) {
        var y = top + (5 - i) * rowH;
        var active = i <= 1 ? c.lower : i >= 2 ? c.higher : 0;
        var lit = (i <= 1 && c.lower > 45) || (i >= 2 && c.higher > 45);
        g.fillStyle = lit ? "#0d6b5f" : "#dfe9e6";
        g.beginPath();
        var cx = baseX + 63;
        g.moveTo(cx - widths[i] / 2, y + rowH - 3);
        g.lineTo(cx + widths[i] / 2, y + rowH - 3);
        g.lineTo(cx + widths[i] / 2 - 8, y);
        g.lineTo(cx - widths[i] / 2 + 8, y);
        g.closePath();
        g.fill();
        text(g, names[i], cx, y + rowH / 2, 11, lit ? "#fff" : "#5a6b79", "center", true);
      }
      text(g, "Bloom का पिरामिड (हरा = सक्रिय)", baseX + 63, top - 18, 11.5, "#35505c", "center", true);
      /* दाएँ: समय बंटवारा + कौशल मीटर */
      var x0 = 300, bw = 300;
      var segs = [["स्मृति", c.mem / 100, "#7fb2a6"], ["समझ", c.und / 100, "#0d6b5f"], ["चिंतन", c.reflect / 100, "#c58b2a"]];
      var px = x0;
      segs.forEach(function (s) {
        var sw = bw * s[1];
        bar(g, px, 60, sw, 30, s[2]);
        if (sw > 34) text(g, s[0] + " " + fmt(s[1] * 100, 0) + "%", px + sw / 2, 75, 11, "#fff", "center", true);
        px += sw;
      });
      text(g, "समय बंटवारा — " + state.time + " मिनट में", x0, 44, 11.5, "#35505c", "left", true);
      text(g, "वर्तमान स्तर", x0, 116, 11.5, "#35505c", "left", true);
      text(g, c.level, x0 + 92, 116, 12.5, "#0d1b26", "left", true);
      /* कौशल मीटर */
      var mw = bw, mh = 16, my = 150;
      bar(g, x0, my, mw, mh, "#e7ebee");
      bar(g, x0, my, mw * c.skill / 100, mh, c.skill > 65 ? "#157f4b" : c.skill > 40 ? "#c58b2a" : "#d64541");
      text(g, "कक्षा के बाद व्यावहारिक कौशल का अनुमान: " + fmt(c.skill, 0) + "%", x0, my + 34, 12, "#0d1b26", "left", true);
      var note = c.reflect < 10
        ? "केवल याद/समझ — नई खराबी या समस्या में विद्यार्थी अटक जाएगा।"
        : c.skill > 70
          ? "संतुलित पाठ: अवधारणा + अभ्यास + निर्णय लेना, तीनों हैं।"
          : "अच्छी शुरुआत — एक असली केस/गड़बड़ी वाला प्रश्न जरूर जोड़ें।";
      text(g, note, x0, my + 62, 11.5, "#5a6b79", "left");
      stats(ui, [
        { label: "निचले स्तर (Remember/Understand)", value: fmt(c.lower, 0) + "%" },
        { label: "ऊपरी स्तर (Apply…Create)", value: fmt(c.higher, 0) + "%", kind: c.higher > 45 ? "good" : "bad" },
        { label: "चिंतन समय", value: fmt(c.reflect, 0) + "%" },
        { label: "कौशल अनुमान", value: fmt(c.skill, 0) + "%", kind: c.skill > 65 ? "good" : "" }
      ]);
      status(ui, "स्तर: " + c.level + " — " + note, c.skill > 65 ? "good" : "");
      if (c.skill > 70) done(ui, ctx);
    }

    bind(ui, "lvTime", function (v) { state.time = v; draw(); });
    bind(ui, "lvMem", function (v) { state.mem = v; draw(); });
    bind(ui, "lvUnd", function (v) { state.und = v; draw(); });
    button(ui, "lvReset", "रीसेट", function () { state = { time: 30, mem: 40, und: 40 }; ui.controls.querySelector("#lvMem").value = 40; ui.controls.querySelector("#lvUnd").value = 40; draw(); }, true);
    draw();
  }

  /* =============================================================
     2. स्किनर: अनुबंधन/प्रेरक (conditioning)
     ============================================================= */
  function sceneConditioning(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML = '<div class="live-row">' +
      select("अनुबंधन का प्रकार", "cvKind", [
        { v: "cont", t: "हर सही पर पुरस्कार (continuous)" },
        { v: "fixed", t: "हर 3वें पर पुरस्कार (fixed ratio)" },
        { v: "var", t: "कभी-कभी पुरस्कार (variable ratio)" },
        { v: "punish", t: "गलती पर डाँट (punishment)" },
        { v: "none", t: "कुछ नहीं (extinction)" }
      ], "cont") +
      range("अभ्यास सत्र (दिन)", "cvDays", 5, 30, 1, 15, "") +
      '<button type="button" class="live-btn" id="cvRun">चलाएँ</button></div>' +
      '<p class="live-hint">ग्राफ दिखाता है कि सही व्यवहार की आवृत्ति कैसे बढ़ती/घटती है और पुरस्कार बंद करने पर कितनी जल्दी बुझती (extinction) है।</p>';
    var sc = scope(ui, 640, 280, "व्यवहार आवृत्ति ग्राफ");
    var series = [];
    var playing = false;

    function curve(kind, days) {
      var out = [];
      for (var d = 1; d <= days; d++) {
        var base;
        if (kind === "cont") base = 100 * (1 - Math.exp(-d / 3.2));
        else if (kind === "fixed") base = 100 * (1 - Math.exp(-d / 4.6)) * (0.92 + 0.08 * Math.sin(d));
        else if (kind === "var") base = 100 * (1 - Math.exp(-d / 6.2)) * (0.85 + 0.15 * Math.sin(d * 1.7));
        else if (kind === "punish") base = 100 * (1 - Math.exp(-d / 2.2)) * (d > 8 ? Math.max(0.35, 1 - (d - 8) / 16) : 1);
        else base = 78 * Math.exp(-d / 5.5);
        out.push(Math.max(0, Math.min(100, base)));
      }
      return out;
    }

    function draw() {
      var g = sc.g, w = sc.c.width, h = sc.c.height, days = series.length;
      board(g, w, h, true);
      axis(g, 46, 20, w - 20, h - 34, "rgba(160,200,220,.5)");
      text(g, "व्यवहार (%)", 12, 24, 11, "#9fd8c8", "left", true);
      text(g, "अभ्यास के दिन →", w / 2, h - 16, 11, "#9fd8c8", "center", true);
      if (days > 1) {
        var pts = series.map(function (v, i) {
          return [46 + (w - 76) * (i / (days - 1)), (h - 34) - (h - 60) * v / 100];
        });
        line(g, pts, "#57e5b5", 2.5);
        pts.forEach(function (p) {
          g.fillStyle = "#7ef0c9";
          g.beginPath();
          g.arc(p[0], p[1], 2.6, 0, 6.284);
          g.fill();
        });
      }
      var last = days ? series[days - 1] : 0;
      text(g, "दिन " + days + " → " + fmt(last, 0) + "%", w - 24, 26, 12, "#e8fff8", "right", true);
    }

    function step() {
      var kind = ui.controls.querySelector("#cvKind").value;
      var days = Number(ui.controls.querySelector("#cvDays").value);
      var all = curve(kind, days);
      if (series.length >= days) {
        playing = false;
        ui.controls.querySelector("#cvRun").textContent = "फिर से चलाएँ";
        var verdict = kind === "var"
          ? "Variable ratio: सीखना धीमा पर सबसे टिकाऊ — पुरस्कार बंद होने पर भी लंबे समय तक व्यवहार रहता है।"
          : kind === "cont"
            ? "Continuous: सबसे तेज सीखना, पर पुरस्कार रुकते ही व्यवहार जल्दी बुझता है।"
            : kind === "fixed"
              ? "Fixed ratio: तेज और नियमित; नई आदत डालने के लिए अच्छा, फिर धीरे-धीरे variable पर जाएँ।"
              : kind === "punish"
                ? "Punishment: शुरुआत तेज, फिर डर/चुकना — व्यवहार छिप जाता है, खत्म नहीं होता।"
                : "Extinction: बिना पुरस्कार व्यवहार तेजी से घटता है — इसलिए सही अभ्यास पर तुरंत प्रशंसा जरूरी।";
        status(ui, verdict, kind === "punish" || kind === "none" ? "bad" : "good");
        if (kind === "cont" || kind === "var" || kind === "fixed") done(ui, ctx);
        return;
      }
      series.push(all[series.length]);
      draw();
      stats(ui, [
        { label: "वर्तमान आवृत्ति", value: fmt(series[series.length - 1], 0) + "%", kind: series[series.length - 1] > 70 ? "good" : "" },
        { label: "दिन", value: series.length + " / " + days },
        { label: "स्थिरता (टिकाऊपन)", value: kind === "var" ? "सबसे अधिक" : kind === "cont" ? "कम" : kind === "fixed" ? "मध्यम" : kind === "punish" ? "भ्रामक (डर)" : "घटता हुआ" },
        { label: "बुझने की गति", value: kind === "none" ? "तेज" : kind === "var" ? "सबसे धीमी" : "मध्यम" }
      ]);
    }

    bind(ui, "cvDays", function () { series = []; draw(); });
    ui.controls.querySelector("#cvKind").addEventListener("change", function () { series = []; draw(); });
    ui.controls.querySelector("#cvRun").addEventListener("click", function () {
      playing = !playing;
      this.textContent = playing ? "रोकें" : "चलाएँ";
      if (playing) tick();
    });
    function tick() {
      if (!playing) return;
      step();
      window.setTimeout(tick, 260);
    }
    draw();
    status(ui, "प्रकार चुनें और “चलाएँ” दबाएँ — दिन-दर-दिन ग्राफ बनेगा।");
  }

  /* =============================================================
     3. अभ्यास की विधियाँ (practice)
     ============================================================= */
  function scenePractice(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML = '<div class="live-row">' +
      select("अभ्यास विधि", "pvHow", [
        { v: "whole", t: "पूरा काम एक साथ (whole)" },
        { v: "part", t: "भाग-भाग से (part)" },
        { v: "massed", t: "लगातार, बिना रुकना (massed)" },
        { v: "distributed", t: "अंतराल के साथ (distributed)" }
      ], "distributed") +
      range("कुल अभ्यास अवसर", "pvTrials", 5, 40, 1, 20, "") +
      range("ओवरलर्निंग (अतिरिक्त %)", "pvOver", 0, 100, 10, 20, "%") +
      '<button type="button" class="live-btn" id="pvGo">ग्राफ बनाएँ</button></div>' +
      '<p class="live-hint">नीली रेखा = सुधार की गति, नारंगी = 1 सप्ताह बाद याद/कौशल (retention)। जटिल और खतरनाक काम में part + distributed बेहतर रहता है।</p>';
    var sc = scope(ui, 640, 260, "अभ्यास वक्र");
    var model = null;

    function calc() {
      var how = ui.controls.querySelector("#pvHow").value;
      var trials = Number(ui.controls.querySelector("#pvTrials").value);
      var over = Number(ui.controls.querySelector("#pvOver").value);
      var speed = how === "whole" ? 0.26 : how === "part" ? 0.2 : how === "massed" ? 0.3 : 0.22;
      var plateau = how === "whole" ? 82 : how === "part" ? 92 : how === "massed" ? 76 : 90;
      var retention = plateau * (how === "distributed" ? 0.94 : how === "massed" ? 0.66 : 0.82) * (1 + over / 260);
      var err = how === "massed" ? 1.7 : 1;
      var curvePts = [];
      for (var t = 1; t <= trials; t++) curvePts.push(plateau * (1 - Math.exp(-t * speed)));
      return { trials: trials, over: over, curvePts: curvePts, plateau: plateau, retention: Math.min(99, retention), err: err, how: how };
    }

    function draw() {
      model = calc();
      var g = sc.g, w = sc.c.width, h = sc.c.height;
      board(g, w, h, false);
      axis(g, 46, 16, w - 18, h - 30);
      text(g, "कौशल (%)", 12, 22, 11, "#35505c", "left", true);
      text(g, "अभ्यास अवसर →", w / 2, h - 14, 11, "#35505c", "center", true);
      var pts = model.curvePts.map(function (v, i) {
        return [46 + (w - 70) * (i / Math.max(1, model.trials - 1)), (h - 30) - (h - 56) * v / 100];
      });
      line(g, pts, "#1f6fb2", 2.6);
      var rp = (h - 30) - (h - 56) * model.retention / 100;
      line(g, [[46, rp], [w - 18, rp]], "#e08a2b", 2, true);
      text(g, "1 सप्ताह बाद याद: " + fmt(model.retention, 0) + "%", w - 22, rp - 10, 11.5, "#a15c07", "right", true);
      var last = pts[pts.length - 1];
      g.fillStyle = "#1f6fb2";
      g.beginPath();
      g.arc(last[0], last[1], 4, 0, 6.284);
      g.fill();
      stats(ui, [
        { label: "अंतिम कौशल", value: fmt(model.curvePts[model.curvePts.length - 1], 0) + "%", kind: model.curvePts[model.curvePts.length - 1] > 80 ? "good" : "" },
        { label: "1 सप्ताह बाद retention", value: fmt(model.retention, 0) + "%", kind: model.retention > 80 ? "good" : "bad" },
        { label: "अभ्यास में गलती का जोखिम", value: model.err > 1.4 ? "अधिक (थकान)" : "सामान्य", kind: model.err > 1.4 ? "bad" : "" },
        { label: "समय लागत", value: model.how === "part" ? "थोड़ा अधिक" : "कम" }
      ]);
      var msg = model.how === "massed"
        ? "लगातार अभ्यास से शुरुआत तेज दिखती है पर थकान और गलती बढ़ती है, याद कम रहता है।"
        : model.how === "part"
          ? "भाग-भाग से सीखना धीमा लगता है, पर जटिल/सुरक्षा-संवेदी काम में अधिक सटीक।"
          : model.how === "whole"
            ? "पूरा काम एक साथ — सरल और कम जोखिम वाले काम के लिए अच्छा।"
            : "अंतराल वाला अभ्यास — सबसे टिकाऊ सीख; ITI/CITS के प्रैक्टिकल सत्र में इसे प्राथमिकता दें।";
      status(ui, msg, model.how === "distributed" ? "good" : "");
      if (model.retention > 85) done(ui, ctx);
    }

    ["pvHow", "pvTrials", "pvOver"].forEach(function (id) { bind(ui, id, draw); });
    button(ui, "pvGo", "ग्राफ बनाएँ", draw);
    draw();
  }

  /* =============================================================
     4. टेस्ट ब्लूप्रिंट (blueprint)
     ============================================================= */
  function sceneBlueprint(sim, body, ctx) {
    var ui = shell(body, sim);
    var rows = [
      { k: "r1", n: "Unit I — प्रशिक्षण संगठन" },
      { k: "r2", n: "Unit II — पाठ्यक्रम विश्लेषण" },
      { k: "r3", n: "Unit III — शिक्षण प्रौद्योगिकी" },
      { k: "r4", n: "Unit IV — आकलन व मूल्यांकन" }
    ];
    var cols = [{ k: "know", n: "जानना" }, { k: "under", n: "समझना" }, { k: "apply", n: "लागू करना" }];
    var v = { r1: { know: 4, under: 2, apply: 0 }, r2: { know: 2, under: 4, apply: 2 }, r3: { know: 2, under: 2, apply: 4 }, r4: { know: 2, under: 2, apply: 2 } };
    ui.controls.innerHTML = '<div class="live-row">' +
      range("कुल अंक लक्ष्य", "bpTotal", 10, 60, 5, 30, "") +
      range("पास प्रतिशत", "bpPass", 25, 70, 5, 40, "%") +
      '<button type="button" class="live-btn" id="bpAuto">संतुलित करें</button></div>' +
      '<p class="live-hint">हर सेल में अंक स्लाइर से बदलें (नीचे)। अच्छे ब्लूप्रिंट में हर इकाई के अंक उसके पढ़ाए गए घंटों के अनुपात में रहते हैं और ऊपरी स्तरों का हिस्सा कम नहीं होता।</p>' +
      '<div class="live-row" id="bpCells"></div>';
    ui.controls.querySelector("#bpCells").innerHTML = rows.map(function (r) {
      return '<div class="live-field" style="min-width:100%">' + esc(r.n) + "</div>" + cols.map(function (c) {
        return range(c.n, "bp_" + r.k + "_" + c.k, 0, 20, 1, v[r.k][c.k], " अंक");
      }).join("");
    }).join("");
    var sc = scope(ui, 640, 250, "ब्लूप्रिंट वितरण ग्राफ");

    function totals() {
      var byRow = rows.map(function (r) {
        return cols.reduce(function (a, c) { return a + v[r.k][c.k]; }, 0);
      });
      var byCol = cols.map(function (c) {
        return rows.reduce(function (a, r) { return a + v[r.k][c.k]; }, 0);
      });
      var total = byRow.reduce(function (a, b) { return a + b; }, 0);
      var spread = Math.max.apply(null, byRow) - Math.min.apply(null, byRow);
      var upper = byCol[1] + byCol[2];
      return { byRow: byRow, byCol: byCol, total: total, spread: spread, upperPct: total ? upper / total * 100 : 0 };
    }

    function draw() {
      var t = totals(), g = sc.g, w = sc.c.width, h = sc.c.height;
      var target = Number(ui.controls.querySelector("#bpTotal").value);
      board(g, w, h, false);
      var x0 = 150, bw = w - 190, y = 40, rh = 34;
      rows.forEach(function (r, i) {
        text(g, r.n, 12, y + rh / 2, 11.5, "#0d1b26", "left", true);
        bar(g, x0, y + 6, bw * t.byRow[i] / Math.max(1, target), rh - 12, "#0d6b5f");
        text(g, t.byRow[i] + " अंक", x0 + bw * t.byRow[i] / Math.max(1, target) + 8, y + rh / 2, 11, "#35505c", "left", true);
        y += rh;
      });
      y += 6;
      text(g, "स्तर के अनुसार: जानना " + t.byCol[0] + " · समझना " + t.byCol[1] + " · लागू करना " + t.byCol[2], 12, y + 8, 11.5, "#35505c", "left", true);
      text(g, "कुल: " + t.total + " / " + target + " अंक", 12, y + 30, 13, t.total === target ? "#157f4b" : "#b42318", "left", true);
      stats(ui, [
        { label: "कुल अंक", value: t.total + " / " + target, kind: t.total === target ? "good" : "bad" },
        { label: "इकाइयों में अंतर", value: t.spread + " अंक", kind: t.spread <= 4 ? "good" : "bad" },
        { label: "समझ+लागू हिस्सा", value: fmt(t.upperPct, 0) + "%", kind: t.upperPct >= 50 ? "good" : "bad" },
        { label: "पास रेखा", value: fmt(target * Number(ui.controls.querySelector("#bpPass").value) / 100, 1) + " अंक" }
      ]);
      var bad = [];
      if (t.total !== target) bad.push("कुल अंक लक्ष्य से मेल नहीं खा रहे");
      if (t.spread > 6) bad.push("एक इकाई पर बहुत भार (वैधता कमजोर)");
      if (t.upperPct < 40) bad.push("केवल याद करने वाले प्रश्न अधिक — समझ/प्रयोग कम");
      if (bad.length) status(ui, "सुधार: " + bad.join(" · ") + "।", "bad");
      if (!bad.length) { status(ui, "ब्लूप्रिंट संतुलित है — वैधता (content validity) अच्छी, अब प्रश्न लिखें।", "good"); done(ui, ctx); }
    }

    rows.forEach(function (r) {
      cols.forEach(function (c) {
        bind(ui, "bp_" + r.k + "_" + c.k, function (val) { v[r.k][c.k] = val; draw(); });
      });
    });
    bind(ui, "bpTotal", draw);
    bind(ui, "bpPass", draw);
    button(ui, "bpAuto", "संतुलित करें", function () {
      var target = Number(ui.controls.querySelector("#bpTotal").value);
      var per = target / rows.length;
      rows.forEach(function (r, i) {
        v[r.k].know = Math.round(per * 0.3);
        v[r.k].under = Math.round(per * 0.4);
        v[r.k].apply = Math.round(per * 0.3);
        var el = ui.controls.querySelector("#bp_" + r.k + "_know");
        el.value = v[r.k].know; el.parentNode.querySelector("output").textContent = v[r.k].know + " अंक";
        el = ui.controls.querySelector("#bp_" + r.k + "_under");
        el.value = v[r.k].under; el.parentNode.querySelector("output").textContent = v[r.k].under + " अंक";
        el = ui.controls.querySelector("#bp_" + r.k + "_apply");
        el.value = v[r.k].apply; el.parentNode.querySelector("output").textContent = v[r.k].apply + " अंक";
      });
      draw();
    });
    draw();
  }

  /* =============================================================
     5. ब्रेक-ईवन (breakEven)
     ============================================================= */
  function sceneBreakEven(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML = '<div class="live-row">' +
      range("मासिक स्थिर लागत (₹)", "beFixed", 5000, 200000, 5000, 40000, "") +
      range("इकाई-variable लागत (₹)", "beVar", 10, 500, 5, 60, "") +
      range("विक्रय मूल्य (₹)", "bePrice", 20, 800, 5, 100, "") +
      range("मासिक उत्पादन (इकाई)", "beQty", 100, 3000, 50, 900, "") +
      '<button type="button" class="live-btn ghost" id="beReset">रीसेट</button></div>' +
      '<p class="live-hint">TC = स्थिर + variable×Q और TR = मूल्य×Q। दोनों जहाँ मिलते हैं वही ब्रेक-ईवन बिंदु है; उसके बाद का हिस्सा मुनाफा।</p>';
    var sc = scope(ui, 640, 280, "ब्रेक-ईवन ग्राफ");

    function calc() {
      var f = Number(ui.controls.querySelector("#beFixed").value);
      var vr = Number(ui.controls.querySelector("#beVar").value);
      var p = Number(ui.controls.querySelector("#bePrice").value);
      var q = Number(ui.controls.querySelector("#beQty").value);
      var beQ = p > vr ? f / (p - vr) : Infinity;
      var tc = f + vr * q, tr = p * q;
      return { f: f, vr: vr, p: p, q: q, beQ: beQ, tc: tc, tr: tr, profit: tr - tc, mos: tr > 0 ? (tr - beQ * p) / tr * 100 : 0, contrib: p - vr };
    }

    function draw() {
      var c = calc(), g = sc.g, w = sc.c.width, h = sc.c.height;
      board(g, w, h, false);
      var x0 = 54, y0 = 18, x1 = w - 16, y1 = h - 34;
      var maxQ = Math.max(c.q * 1.2, (isFinite(c.beQ) ? c.beQ * 1.4 : c.q * 1.2), 200);
      var maxR = Math.max(c.tc, c.tr, c.f * 2) * 1.15;
      var px = function (q) { return x0 + (x1 - x0) * q / maxQ; };
      var py = function (money) { return y1 - (y1 - y0) * money / maxR; };
      axis(g, x0, y0, x1, y1);
      line(g, [[px(0), py(c.f)], [px(maxQ), py(c.f + c.vr * maxQ)]], "#d64541", 2.4);
      line(g, [[px(0), py(0)], [px(maxQ), py(c.p * maxQ)]], "#1f6fb2", 2.4);
      text(g, "TC (कुल लागत)", px(maxQ) - 6, py(c.f + c.vr * maxQ) - 10, 11, "#b42318", "right", true);
      text(g, "TR (आय)", px(maxQ) - 6, py(c.p * maxQ) - 10, 11, "#1f6fb2", "right", true);
      if (isFinite(c.beQ) && c.beQ < maxQ) {
        g.fillStyle = "#c58b2a";
        g.beginPath();
        g.arc(px(c.beQ), py(c.p * c.beQ), 5, 0, 6.284);
        g.fill();
        text(g, "BE = " + fmt(c.beQ, 0) + " इकाई", px(c.beQ) + 8, py(c.p * c.beQ) - 8, 11.5, "#a15c07", "left", true);
      }
      g.strokeStyle = "rgba(13,27,38,.35)";
      g.setLineDash([4, 4]);
      g.beginPath();
      g.moveTo(px(c.q), y1);
      g.lineTo(px(c.q), py(Math.max(c.tc, c.tr)));
      g.stroke();
      g.setLineDash([]);
      text(g, "आपकी योजना: " + c.q + " इकाई", px(c.q) + 6, y1 - 8, 11, "#0d1b26", "left", true);
      text(g, "इकाई (Q) →", (x0 + x1) / 2, h - 12, 11, "#35505c", "center", true);
      stats(ui, [
        { label: "योगदान प्रति इकाई", value: "₹" + fmt(c.contrib, 0), kind: c.contrib > 0 ? "good" : "bad" },
        { label: "ब्रेक-ईवन मात्रा", value: isFinite(c.beQ) ? fmt(c.beQ, 0) + " इकाई" : "असंभव (मूल्य ≤ लागत)", kind: isFinite(c.beQ) ? "" : "bad" },
        { label: "योजना पर मुनाफा/हानि", value: (c.profit >= 0 ? "₹" : "−₹") + fmt(Math.abs(c.profit), 0), kind: c.profit > 0 ? "good" : "bad" },
        { label: "सुरक्षा की मार्जिन (MOS)", value: fmt(Math.max(0, c.mos), 0) + "%", kind: c.mos > 20 ? "good" : "bad" }
      ]);
      var msg = c.p <= c.vr
        ? "मूल्य variable लागत से कम है — हर इकाई पर नुकसान; कोई भी ब्रेक-ईवन नहीं।"
        : c.profit <= 0
          ? "योजना अभी ब्रेक-ईवन से नीचे है — मात्रा बढ़ाएँ, मूल्य बढ़ाएँ या स्थिर लागत घटाएँ।"
          : c.mos < 15
            ? "मुनाफा है पर सुरक्षा-मार्जिन पतला — एक महीने की बिक्री गिरते ही नुकसान।"
            : "व्यावसायिक रूप से टिकाऊ योजना — लागत नियंत्रण और बिक्री बढ़ाने पर ध्यान दें।";
      status(ui, msg, c.profit > 0 && c.mos >= 15 ? "good" : c.profit <= 0 ? "bad" : "");
      if (c.profit > 0 && c.mos >= 20) done(ui, ctx);
    }

    ["beFixed", "beVar", "bePrice", "beQty"].forEach(function (id) { bind(ui, id, draw); });
    button(ui, "beReset", "रीसेट", function () {
      [["beFixed", 40000], ["beVar", 60], ["bePrice", 100], ["beQty", 900]].forEach(function (p) {
        var el = ui.controls.querySelector("#" + p[0]);
        el.value = p[1];
        el.parentNode.querySelector("output").textContent = p[1] + (el.getAttribute("data-unit") || "");
      });
      draw();
    }, true);
    draw();
  }

  /* =============================================================
     6. आइटम विश्लेषण (itemAnalysis)
     ============================================================= */
  function sceneItem(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML = '<div class="live-row">' +
      range("कठिनाई सूचकांक p (सही उत्तर %)", "iaP", 0, 100, 1, 62, "%") +
      range("विभेदन D (ऊँचे−नीचे समूह)", "iaD", -50, 50, 1, 28, "%") +
      select("प्रश्न का प्रकार", "iaType", [
        { v: "mcq", t: "वस्तुनिष्ठ (MCQ)" },
        { v: "short", t: "लघु उत्तरीय" }
      ], "mcq") +
      '<button type="button" class="live-btn ghost" id="iaFix">सुधार दिखाएँ</button></div>' +
      '<p class="live-hint">p ≈ 0.7–0.8 और D ≥ 0.3 आदर्श। D ऋणात्मक मतलब — कमजोर विद्यार्थी अधिक सही कर रहे, उत्तर-कुंजी या प्रश्न ही गड़बड़ है।</p>';
    var sc = scope(ui, 640, 250, "आइटम विश्लेषण आकृति");

    function calc() {
      var p = Number(ui.controls.querySelector("#iaP").value) / 100;
      var d = Number(ui.controls.querySelector("#iaD").value) / 100;
      var verdict = d <= 0 ? "खराब — उत्तर कुंजी/प्रश्न जाँचें"
        : d < 0.2 ? "कमजोर विभेदन — विकल्प आकर्षक बनाएँ"
          : d < 0.3 ? "स्वीकार्य — परिशोधन चाहिए"
            : "अच्छा आइटम";
      var diff = p > 0.9 ? "बहुत आसान" : p > 0.65 ? "उपयुक्त" : p > 0.35 ? "कठिन" : "बहुत कठिन";
      return { p: p, d: d, verdict: verdict, diff: diff, keep: d >= 0.3 && p >= 0.35 && p <= 0.9 };
    }

    function draw() {
      var c = calc(), g = sc.g, w = sc.c.width, h = sc.c.height;
      board(g, w, h, false);
      axis(g, 60, 20, w - 20, h - 40);
      text(g, "D (विभेदन)", 14, 24, 11, "#35505c", "left", true);
      text(g, "p (कठिनाई) →", w / 2, h - 18, 11, "#35505c", "center", true);
      /* स्वीकार्य क्षेत्र */
      g.fillStyle = "rgba(21,127,75,.12)";
      g.fillRect(60 + (w - 80) * 0.35, (h - 40) - (h - 60) * 0.5, (w - 80) * 0.55, (h - 60) * 0.5);
      text(g, "स्वीकार्य क्षेत्र", 62 + (w - 80) * 0.36, (h - 40) - (h - 60) * 0.46, 10.5, "#157f4b", "left", true);
      var px = 60 + (w - 80) * c.p;
      var py = (h - 40) - (h - 60) * ((c.d + 0.5));
      g.fillStyle = c.keep ? "#157f4b" : c.d <= 0 ? "#b42318" : "#c58b2a";
      g.beginPath();
      g.arc(px, Math.max(24, Math.min(h - 44, py)), 7, 0, 6.284);
      g.fill();
      text(g, "आपका आइटम", px + 10, Math.max(24, Math.min(h - 44, py)) - 10, 11, "#0d1b26", "left", true);
      stats(ui, [
        { label: "कठिनाई p", value: fmt(c.p * 100, 0) + "%", kind: c.p >= 0.35 && c.p <= 0.9 ? "good" : "bad" },
        { label: "विभेदन D", value: fmt(c.d * 100, 0) + "%", kind: c.d >= 0.3 ? "good" : c.d <= 0 ? "bad" : "" },
        { label: "निर्णय", value: c.verdict, kind: c.keep ? "good" : "bad" },
        { label: "समझ", value: c.diff }
      ]);
      status(ui, c.keep
        ? "आइटम रखें — यह अच्छे और कमजोर विद्यार्थी में अंतर कर पाता है।"
        : c.d <= 0
          ? "तुरंत जाँच: उत्तर कुंजी, विकल्पों की भाषा, या पढ़ाया गया बताने वाला हिस्सा।"
          : "आइटम सुधारें: भ्रामक विकल्प (distractor) बेहतर बनाएँ या संदर्भ बदलें।",
      c.keep ? "good" : "bad");
      if (c.keep) done(ui, ctx);
    }

    ["iaP", "iaD", "iaType"].forEach(function (id) { bind(ui, id, draw); });
    button(ui, "iaFix", "सुधार दिखाएँ", function () {
      [["iaP", 72], ["iaD", 35]].forEach(function (p) {
        var el = ui.controls.querySelector("#" + p[0]);
        el.value = p[1];
        el.parentNode.querySelector("output").textContent = p[1] + "%";
      });
      draw();
      status(ui, "सुधार के बाद: p 72% और D 35% — आदर्श आइटम। इसी तरह हर प्रश्न की जाँच करके प्रश्न पत्र तैयार करें।", "good");
    });
    draw();
  }

  /* =============================================================
     7. सूक्ष्म-शिक्षण 5-4-5 चक्र (micro)
     ============================================================= */
  function sceneMicro(sim, body, ctx) {
    var ui = shell(body, sim);
    var skills = ["Set induction", "Stimulating", "Explaining", "Probing", "Reinforcement", "Blackboard writing", "Closing"];
    var hi = ["प्री-टेस्ट", "ट्रीटमेंट (5 मिनट)", "पोस्ट-टेस्ट", "फीडबैक + प्लान रिविज़ड", "री-टीच"];
    ui.controls.innerHTML = '<div class="live-row">' +
      select("कौशल चुनें", "mkSkill", skills.map(function (s) { return { v: s, t: s }; }), skills[0]) +
      '<button type="button" class="live-btn" id="mkRun">चक्र चलाएँ</button></div>' +
      '<p class="live-hint">5-4-5: 5 मिनट पढ़ाना, 4 मिनट आत्म-मूल्यांकन (टेप देखना), फिर 5 मिनट सुधरा हुआ पुनः-अध्यापन — एक ही कौशल पर।</p>';
    var sc = scope(ui, 640, 240, "सूक्ष्म-शिक्षण चक्र");
    var phase = -1, timer = null;

    function draw() {
      var g = sc.g, w = sc.c.width, h = sc.c.height;
      var skill = ui.controls.querySelector("#mkSkill").value;
      board(g, w, h, true);
      var cx = w / 2, cy = h / 2 + 6, r = 82;
      g.strokeStyle = "rgba(120,170,195,.4)";
      g.lineWidth = 2;
      g.beginPath();
      g.arc(cx, cy, r, 0, 6.284);
      g.stroke();
      hi.forEach(function (label, i) {
        var a = -Math.PI / 2 + i * (6.284 / hi.length);
        var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        var on = i === phase;
        g.fillStyle = on ? "#57e5b5" : "rgba(120,170,195,.35)";
        g.beginPath();
        g.arc(x, y, on ? 12 : 8, 0, 6.284);
        g.fill();
        text(g, label, cx + Math.cos(a) * (r + 34), cy + Math.sin(a) * (r + 22), on ? 12 : 11, on ? "#e8fff8" : "#9fd8c8", "center", on);
      });
      text(g, "कौशल: " + skill, cx, cy - 8, 13, "#e8fff8", "center", true);
      text(g, phase < 0 ? "“चक्र चलाएँ” दबाएँ" : "चरण " + (phase + 1) + " / " + hi.length, cx, cy + 14, 11.5, "#9fd8c8", "center");
      var notes = {
        "Set induction": "शुरुआत: पुराने सवाल/चित्र/घटना से ध्यान खींचें — 1 मिनट पर्याप्त।",
        "Stimulating": "आवाज़ की ऊँचाई-नीचाई, इशारा, प्रश्न — ध्यान बनाए रखने का कौशल।",
        "Explaining": "परिभाषा + कारण + उदाहरण एक साथ; 'क्यों' स्पष्ट हो।",
        "Probing": "उत्तर के बाद follow-up: 'क्यों?', 'अगर बदलें तो?' — सोच आगे बढ़ाना।",
        "Reinforcement": "तात्कालिक प्रशंसा: शब्द, सिर हिलाना, नाम से संबोधन; अनुशासन नहीं।",
        "Blackboard writing": "साफ़, बड़ा, क्रमबद्ध लेखन; सारांश नीचे दाएँ; गलती तुरंत मिटाएँ।",
        "Closing": "सारांश + अगला कदम + जाँच प्रश्न — कक्षा बिना समापन के अधूरी है।"
      };
      stats(ui, [
        { label: "चुना कौशल", value: skill },
        { label: "वर्तमान चरण", value: phase < 0 ? "तैयार" : hi[phase] },
        { label: "समय (लगभग)", value: phase < 0 ? "14 मिनट" : [5, 3, 2, 4, 5][phase] + " मिनट" },
        { label: "अभ्यास का लक्ष्य", value: "एक ही कौशल में सुधार" }
      ]);
      status(ui, notes[skill] || "कौशल चुनें और चक्र चलाएँ।", phase === hi.length - 1 ? "good" : "");
      if (phase === hi.length - 1) done(ui, ctx);
    }

    bind(ui, "mkSkill", draw);
    ui.controls.querySelector("#mkRun").addEventListener("click", function () {
      if (timer) { window.clearInterval(timer); timer = null; phase = -1; draw(); return; }
      phase = 0;
      timer = window.setInterval(function () {
        phase += 1;
        if (phase >= hi.length) { window.clearInterval(timer); timer = null; phase = hi.length - 1; }
        draw();
      }, 1100);
      draw();
    });
    draw();
  }

  /* =============================================================
     8. Dale का अनुभव शंकु + retention (cone)
     ============================================================= */
  function sceneCone(sim, body, ctx) {
    var ui = shell(body, sim);
    var tiers = [
      { v: "abstract", t: "केवल सुनना/पढ़ना", keep: 20, time: 1, cost: 1, risk: 1 },
      { v: "visual", t: "चित्र/डॉयग्राम/वीडियो", keep: 45, time: 2, cost: 2, risk: 1 },
      { v: "demo", t: "अनुदेशक का प्रदर्शन", keep: 65, time: 3, cost: 2, risk: 2 },
      { v: "sim", t: "सिम्युलेटर/मॉकअप", keep: 75, time: 4, cost: 3, risk: 2 },
      { v: "practice", t: "स्वयं करके सीखना (real job)", keep: 90, time: 5, cost: 4, risk: 3 }
    ];
    ui.controls.innerHTML = '<div class="live-row">' +
      select("कक्षा में क्या करा रहे हैं?", "cnTier", tiers.map(function (x) { return { v: x.v, t: x.t }; }), "demo") +
      range("सत्र की अवधि (मिनट)", "cnTime", 10, 90, 5, 40, "") +
      '<button type="button" class="live-btn ghost" id="cnMix">मिश्रित योजना दिखाएँ</button></div>' +
      '<p class="live-hint">शंकु जितना नीचे — उतना सक्रिय अनुभव, अधिक प्रतिधारण (retention), पर अधिक समय/औज़ार और सुरक्षा-जोखिम।</p>';
    var sc = scope(ui, 640, 260, "अनुभव शंकु");
    var mix = false;

    function draw() {
      var g = sc.g, w = sc.c.width, h = sc.c.height;
      var v = ui.controls.querySelector("#cnTier").value;
      var mins = Number(ui.controls.querySelector("#cnTime").value);
      board(g, w, h, false);
      var cx = 190, top = 26, rowH = 40;
      tiers.forEach(function (x, i) {
        var y = top + i * rowH;
        var wid = 60 + i * 46;
        var on = mix ? true : x.v === v;
        g.fillStyle = on ? (x.v === v ? "#0d6b5f" : "#7fb2a6") : "#e6ede9";
        g.beginPath();
        g.moveTo(cx - wid / 2, y + rowH - 4);
        g.lineTo(cx + wid / 2, y + rowH - 4);
        g.lineTo(cx + wid / 2 - 22, y);
        g.lineTo(cx - wid / 2 + 22, y);
        g.closePath();
        g.fill();
        text(g, x.keep + "%", cx, y + rowH / 2, 11.5, on ? "#fff" : "#5a6b79", "center", true);
      });
      text(g, "Dale का अनुभव शंकु — अनुमानित प्रतिधारण", cx, 14, 11, "#35505c", "center", true);
      var sel = mix ? tiers[3] : tiers.filter(function (x) { return x.v === v; })[0];
      var x0 = 380, bw = 240;
      [["प्रतिधारण", sel.keep, 100, "#157f4b"], ["समय लागत", sel.time * 20, 100, "#1f6fb2"], ["औज़ार/लागत", sel.cost * 25, 100, "#c58b2a"], ["सुरक्षा जोखिम", sel.risk * 33, 100, "#d64541"]].forEach(function (b, i) {
        var y = 40 + i * 46;
        text(g, b[0], x0, y, 11.5, "#0d1b26", "left", true);
        bar(g, x0, y + 10, bw, 14, "#e7ebee");
        bar(g, x0, y + 10, bw * Math.min(100, b[1]) / 100, 14, b[2]);
        text(g, fmt(b[1], 0) + (b[0] === "प्रतिधारण" ? "%" : ""), x0 + bw + 8, y + 17, 11, "#35505c", "left", true);
      });
      var effective = mins * sel.keep / 100;
      stats(ui, [
        { label: "चुनी विधि", value: sel.t },
        { label: "प्रतिधारण", value: sel.keep + "%", kind: sel.keep >= 65 ? "good" : "bad" },
        { label: "उपयोगी सीख (मिनट-तुल्य)", value: fmt(effective, 0) + " / " + mins, kind: effective > mins * 0.6 ? "good" : "" },
        { label: "सुझाव", value: sel.v === "abstract" ? "10 मिनट बाद अभ्यास जोड़ें" : sel.v === "practice" ? "सुरक्षा चेकलिस्ट अनिवार्य" : "अच्छा संतुलन" }
      ]);
      var msg = mix
        ? "मिश्रित योजना: 8 मिनट जानकारी → 7 मिनट प्रदर्शन → 20 मिनट स्वयं अभ्यास → 5 मिनट जाँच/फीडबैक। यही NIMI/CITS का पैटर्न है।"
        : sel.v === "abstract"
          ? "केवल बोलना/पढ़ाना — कम समय लेता है पर कौशल नहीं बनता; तुरंत एक छोटा अभ्यास जोड़ें।"
          : sel.v === "practice"
            ? "स्वयं करके सीखना सबसे अच्छा — पर औज़ार, PPE और निगरानी का इंतजाम पहले से रखें।"
            : "संतुलित विकल्प — जानकारी, देखना और करना तीनों क्रम में रखें।";
      status(ui, msg, mix || sel.v === "practice" || sel.v === "sim" ? "good" : sel.v === "abstract" ? "bad" : "");
      if (mix || sel.keep >= 75) done(ui, ctx);
    }

    bind(ui, "cnTier", function () { mix = false; draw(); });
    bind(ui, "cnTime", draw);
    button(ui, "cnMix", "मिश्रित योजना दिखाएँ", function () { mix = true; draw(); }, true);
    draw();
  }

  /* =============================================================
     9. संवाद मॉडल + शोर (comm)
     ============================================================= */
  function sceneComm(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML = '<div class="live-row">' +
      range("शोर (noise) %", "cmNoise", 0, 90, 5, 25, "%") +
      range("संदेश की स्पष्टता %", "cmClear", 20, 100, 5, 70, "%") +
      select("फीडबैक", "cmFb", [{ v: "yes", t: "पूछताछ/सारांश हो रहा है" }, { v: "no", t: "कोई फीडबैक नहीं" }], "yes") +
      '<button type="button" class="live-btn ghost" id="cmFix">सुधार उपाय</button></div>' +
      '<p class="live-hint">वर्कशॉप का शोर केवल आवाज़ नहीं — जटिल भाषा, तेज बोलना, ध्यान न देना भी शोर है।</p>';
    var sc = scope(ui, 640, 220, "संचार प्रवाह आकृति");

    function calc() {
      var noise = Number(ui.controls.querySelector("#cmNoise").value) / 100;
      var clear = Number(ui.controls.querySelector("#cmClear").value) / 100;
      var fb = ui.controls.querySelector("#cmFb").value === "yes";
      var base = clear * (1 - noise);
      var received = Math.max(0, Math.min(100, (fb ? base * 0.75 + (base + (1 - base) * 0.55) * 0.25 : base) * 100));
      return { noise: noise, clear: clear, fb: fb, received: received, repeats: Math.round(Math.max(0, (1 - received / 100) * 4 * 10) / 10) };
    }

    function draw() {
      var c = calc(), g = sc.g, w = sc.c.width, h = sc.c.height;
      board(g, w, h, false);
      var boxes = [["अनुदेशक", 20], ["संदेश", 170], ["विद्यार्थी", 320], ["प्रतिक्रिया", 470]];
      boxes.forEach(function (b) {
        bar(g, b[1], 60, 120, 46, "#dfe9e6");
        g.strokeStyle = "#9fb8b1";
        g.strokeRect(b[1], 60, 120, 46);
        text(g, b[0], b[1] + 60, 83, 12, "#0d1b26", "center", true);
      });
      for (var i = 0; i < 3; i++) {
        var x = boxes[i][1] + 120;
        line(g, [[x + 2, 83], [x + 28, 83]], "#0d6b5f", 2);
        g.fillStyle = "#0d6b5f";
        g.beginPath();
        g.moveTo(x + 30, 83);
        g.lineTo(x + 22, 78);
        g.lineTo(x + 22, 88);
        g.closePath();
        g.fill();
      }
      if (c.fb) line(g, [[530, 110], [530, 130], [80, 130], [80, 110]], "#c58b2a", 2, true);
      text(g, c.fb ? "फीडबैक लूप चालू" : "फीडबैक बंद", 300, 142, 11.5, "#a15c07", "center", true);
      /* शोर की लहर */
      g.strokeStyle = "rgba(214,69,65," + (0.25 + c.noise * 0.6) + ")";
      g.lineWidth = 2 + c.noise * 4;
      g.beginPath();
      for (var x = 20; x < w - 20; x += 6) {
        var y = 175 + Math.sin(x / 14) * (4 + c.noise * 16);
        if (x === 20) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke();
      text(g, "शोर स्तर: " + fmt(c.noise * 100, 0) + "%", w - 24, 196, 11, "#b42318", "right", true);
      text(g, "पहुँचा संदेश: " + fmt(c.received, 0) + "%", 24, 30, 13, c.received > 70 ? "#157f4b" : "#b42318", "left", true);
      stats(ui, [
        { label: "विद्यार्थी तक पहुँचा", value: fmt(c.received, 0) + "%", kind: c.received > 70 ? "good" : "bad" },
        { label: "दोहराने पड़ सकते हैं", value: c.repeats + " बार" },
        { label: "फीडबैक", value: c.fb ? "चालू" : "बंद", kind: c.fb ? "good" : "bad" },
        { label: "जोखिम", value: c.received < 55 ? "गलती/दुर्घटना की संभावना" : "नियंत्रित", kind: c.received < 55 ? "bad" : "good" }
      ]);
      status(ui, c.received > 75
        ? "संदेश स्पष्ट पहुँच रहा है — अब करके जाँचें (return demonstration)।"
        : "संवाद कमजोर: छोटे वाक्य, स्थानीय भाषा, एक समय एक निर्देश, और विद्यार्थी से कहवाएँ।", c.received > 75 ? "good" : "bad");
      if (c.received > 80) done(ui, ctx);
    }

    ["cmNoise", "cmClear", "cmFb"].forEach(function (id) { bind(ui, id, draw); });
    button(ui, "cmFix", "सुधार उपाय", function () {
      [["cmNoise", 10], ["cmClear", 92]].forEach(function (p) {
        var el = ui.controls.querySelector("#" + p[0]);
        el.value = p[1];
        el.parentNode.querySelector("output").textContent = p[1] + "%";
      });
      ui.controls.querySelector("#cmFb").value = "yes";
      draw();
    });
    draw();
  }

  /* =============================================================
     10. ADDIE पाइपलाइन (addie)
     ============================================================= */
  function sceneAddie(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML = '<div class="live-row">' +
      select("ट्रेड विषय", "adTopic", [
        { v: "smps", t: "SMPS की मरम्मत" },
        { v: "network", t: "LAN केबल क्रिम्पिंग" },
        { v: "safety", t: "वर्कशॉप सुरक्षा" }
      ], "smps") +
      range("कुल घंटे", "adHours", 2, 20, 1, 8, "") +
      select("अंतिम जाँच", "adCheck", [{ v: "job", t: "प्रैक्टिकल जॉब" }, { v: "both", t: "थ्योरी + प्रैक्टिकल" }], "both") +
      '<button type="button" class="live-btn" id="adRun">योजना बनाएँ</button></div>' +
      '<p class="live-hint">ADDIE = Analysis → Design → Development → Implementation → Evaluation। हर चरण का आउटपुट अगले का इनपुट।</p>';
    var sc = scope(ui, 640, 240, "ADDIE चरण और समय बंटवारा");
    var built = false;

    function calc() {
      var hours = Number(ui.controls.querySelector("#adHours").value);
      var topic = ui.controls.querySelector("#adTopic").value;
      var check = ui.controls.querySelector("#adCheck").value;
      var split = [0.15, 0.2, 0.15, 0.35, 0.15];
      var names = ["Analysis", "Design", "Development", "Implementation", "Evaluation"];
      var out = names.map(function (n, i) { return { n: n, h: hours * split[i] }; });
      var teach = hours * (check === "both" ? 0.3 : 0.38);
      var practice = hours * (check === "both" ? 0.45 : 0.5);
      return { out: out, hours: hours, topic: topic, check: check, teach: teach, practice: practice };
    }

    function draw() {
      var c = calc(), g = sc.g, w = sc.c.width, h = sc.c.height;
      board(g, w, h, false);
      var x = 20, y = 40, bw = (w - 40) / c.out.length;
      c.out.forEach(function (s, i) {
        var doneStep = built;
        bar(g, x + i * bw + 4, y, bw - 8, 56, doneStep ? "#0d6b5f" : "#dfe9e6");
        text(g, s.n, x + i * bw + bw / 2, y + 20, 11, doneStep ? "#fff" : "#5a6b79", "center", true);
        text(g, fmt(s.h, 1) + " घं", x + i * bw + bw / 2, y + 40, 11, doneStep ? "#d8fff4" : "#5a6b79", "center", true);
        if (i) line(g, [[x + i * bw - 4, y + 28], [x + i * bw + 2, y + 28]], "#0d6b5f", 2);
      });
      text(g, "ADDIE — कुल " + c.hours + " घंटे की पाठ्य-इकाई", 20, 24, 12, "#0d1b26", "left", true);
      var py = 130;
      text(g, "सत्र में समय:", 20, py, 11.5, "#35505c", "left", true);
      var segs = [["बोध/प्रदर्शन", c.teach, "#1f6fb2"], ["स्वयं अभ्यास", c.practice, "#157f4b"], ["सारांश+जाँच", c.hours - c.teach - c.practice, "#c58b2a"]];
      var px = 130, total = segs.reduce(function (a, s) { return a + s[1]; }, 0) || 1;
      segs.forEach(function (s) {
        var sw = (w - 160) * s[1] / total;
        bar(g, px, py - 8, sw, 22, s[2]);
        if (sw > 60) text(g, s[0] + " " + fmt(s[1], 1), px + sw / 2, py + 3, 10.5, "#fff", "center", true);
        px += sw;
      });
      var titles = { smps: "SMPS की मरम्मत", network: "LAN केबल क्रिम्पिंग", safety: "वर्कशॉप सुरक्षा" };
      var obj = {
        smps: "30–60 मिनट में SMPS खोलकर मुख्य खराबी पहचानकर ठीक करना, सुरक्षा नियमों के साथ।",
        network: "RJ45 पर T568B क्रम में केबल क्रिम्प करके टेस्टर से पास करना।",
        safety: "वर्कशॉप के 10 जोखिम पहचानकर उपाय बताना और PPE सही ढंग से लगाना।"
      };
      text(g, "उद्देश्य (ABCD): " + titles[c.topic] + " के सत्र में — विद्यार्थी, दिए गए औज़ारों से, " + obj[c.topic], 20, 180, 11.5, "#0d1b26", "left");
      text(g, "मूल्यांकन: " + (c.check === "both" ? "वस्तुनिष्ठ 10 अंक + प्रैक्टिकल जॉब 20 अंक (ब्लूप्रिंट से)" : "केवल प्रैक्टिकल जॉब + मौखिक जाँच"), 20, 202, 11.5, "#35505c", "left");
      stats(ui, [
        { label: "विश्लेषण चरण", value: fmt(c.out[0].h, 1) + " घं (आवश्यकता+QP)" },
        { label: "सामग्री निर्माण", value: fmt(c.out[2].h, 1) + " घं (जॉब/ऑपरेशन शीट)" },
        { label: "अभ्यास का हिस्सा", value: fmt(c.practice / c.hours * 100, 0) + "%", kind: c.practice / c.hours > 0.4 ? "good" : "bad" },
        { label: "जाँच", value: c.check === "both" ? "थ्योरी + प्रैक्टिकल" : "प्रैक्टिकल" }
      ]);
      status(ui, built
        ? "योजना तैयार — अब जॉब शीट, प्रदर्शन योजना और ब्लूप्रिंट लिखें; Evaluation से मिली कमजोरी Analysis में लौटाएँ (चक्र)।"
        : "“योजना बनाएँ” दबाकर पूरा ADDIE आउटपुट देखें।", built ? "good" : "");
      if (built) done(ui, ctx);
    }

    ["adHours", "adTopic", "adCheck"].forEach(function (id) { bind(ui, id, function () { built = false; draw(); }); });
    ui.controls.querySelector("#adRun").addEventListener("click", function () { built = true; draw(); });
    draw();
  }

  /* =============================================================
     11. Herzberg: स्वच्छता बनाम प्रेरक (motivation)
     ============================================================= */
  function sceneMotivation(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML = '<div class="live-row">' +
      range("स्वच्छता कारक (Hygiene): सुरक्षा, वेतन/छुट्टी, व्यवहार", "hyg", 0, 100, 5, 45, "%") +
      range("प्रेरक कारक (Motivators): उपलब्धि, ज़िम्मेदारी, प्रशंसा", "mot", 0, 100, 5, 40, "%") +
      '<button type="button" class="live-btn ghost" id="moBal">संतुलन दिखाएँ</button></div>' +
      '<p class="live-hint">Herzberg के अनुसार खराब स्वच्छता असंतोष देती है, पर अच्छी करने से संतोष नहीं — संतोष और प्रेरणा प्रेरक कारकों से आती है।</p>';
    var sc = scope(ui, 640, 250, "प्रेरणा वितरण ग्राफ");

    function calc() {
      var h = Number(ui.controls.querySelector("#hyg").value);
      var m = Number(ui.controls.querySelector("#mot").value);
      var dissatisfaction = Math.max(0, (60 - h)) * 1.1;
      var satisfaction = m * 0.85 + Math.max(0, h - 60) * 0.2;
      var effort = Math.min(100, satisfaction * 0.8 + (h >= 50 ? 15 : h * 0.3));
      return { h: h, m: m, dissatisfaction: dissatisfaction, satisfaction: satisfaction, effort: effort };
    }

    function draw() {
      var c = calc(), g = sc.g, w = sc.c.width, h = sc.c.height;
      board(g, w, h, false);
      var mid = h / 2 + 10;
      line(g, [[40, mid], [w - 20, mid]], "#9fb8b1", 1.5);
      text(g, "उदासीन (neither satisfied nor dissatisfied)", 44, mid - 12, 10.5, "#5a6b79", "left", true);
      /* असंतोष नीचे, संतोष ऊपर */
      bar(g, 90, mid, 120, (h - mid - 30) * c.dissatisfaction / 70, "#d64541");
      text(g, "असंतोष " + fmt(c.dissatisfaction, 0), 150, mid + 8, 11, "#b42318", "center", true);
      bar(g, 300, mid - (h - 60) * c.satisfaction / 110, 120, (h - 60) * c.satisfaction / 110, "#157f4b");
      text(g, "संतोष " + fmt(c.satisfaction, 0), 360, mid - (h - 60) * c.satisfaction / 110 - 12, 11, "#157f4b", "center", true);
      bar(g, 480, mid - (h - 60) * c.effort / 110, 120, (h - 60) * c.effort / 110, "#1f6fb2");
      text(g, "प्रयास " + fmt(c.effort, 0), 540, mid - (h - 60) * c.effort / 110 - 12, 11, "#1f6fb2", "center", true);
      text(g, "स्वच्छता", 150, h - 14, 11, "#35505c", "center", true);
      text(g, "प्रेरक कारक", 360, h - 14, 11, "#35505c", "center", true);
      text(g, "विद्यार्थी का प्रयास", 540, h - 14, 11, "#35505c", "center", true);
      stats(ui, [
        { label: "असंतोष (डर/अनुशासन)", value: fmt(c.dissatisfaction, 0), kind: c.dissatisfaction > 25 ? "bad" : "good" },
        { label: "संतोष", value: fmt(c.satisfaction, 0), kind: c.satisfaction > 55 ? "good" : "" },
        { label: "प्रयास/प्रदर्शन", value: fmt(c.effort, 0) + "%", kind: c.effort > 65 ? "good" : "bad" },
        { label: "स्थिति", value: c.h < 40 ? "पहले बुनियादी सुधार" : c.m < 45 ? "प्रशंसा-अवसर बढ़ाएँ" : "स्वस्थ माहौल" }
      ]);
      var msg = c.h < 40
        ? "सुरक्षा, टूले-औज़ार और व्यवहार जैसी बुनियादी चीजें कमजोर हैं — जब तक ये ठीक नहीं, प्रेरणा के भाषण बेकार।"
        : c.m < 45
          ? "बुनियादी ठीक है, पर प्रेरक कारक कम: छोटे लक्ष्य, तुरंत प्रशंसा, ज़िम्मेदारी और 'मैंने बनाया' का अहसास दें।"
          : "अच्छा संतुलन — अब चुनौतीपूर्ण काम और मेंटरिंग से आगे बढ़ाएँ।";
      status(ui, msg, c.effort > 65 ? "good" : c.h < 40 ? "bad" : "");
      if (c.effort > 70) done(ui, ctx);
    }

    ["hyg", "mot"].forEach(function (id) { bind(ui, id, draw); });
    button(ui, "moBal", "संतुलन दिखाएँ", function () {
      [["hyg", 75], ["mot", 70]].forEach(function (p) {
        var el = ui.controls.querySelector("#" + p[0]);
        el.value = p[1];
        el.parentNode.querySelector("output").textContent = p[1] + "%";
      });
      draw();
    }, true);
    draw();
  }

  /* =============================================================
     12. 5S वर्कशॉप ऑडिट (fiveS)
     ============================================================= */
  function sceneFiveS(sim, body, ctx) {
    var ui = shell(body, sim);
    var steps = [
      { k: "s1", n: "Sort — अनावश्यक हटाना" },
      { k: "s2", n: "Set in order — जगह तय करना" },
      { k: "s3", n: "Shine — सफाई" },
      { k: "s4", n: "Standardise — नियम लिखना" },
      { k: "s5", n: "Sustain — अनुशासन" }
    ];
    var state = { s1: 3, s2: 2, s3: 4, s4: 1, s5: 1 };
    ui.controls.innerHTML = '<div class="live-row" style="align-items:flex-start">' +
      steps.map(function (s) {
        return range(s.n, "f_" + s.k, 0, 5, 1, state[s.k], "/5");
      }).join("") +
      '<button type="button" class="live-btn" id="fPlan">सुधार योजना</button></div>' +
      '<p class="live-hint">हर S 0–5 अंक। S4–S5 कम हो तो सफाई कुछ दिनों में फिर बिगड़ जाती है — यही सबसे आम विफलता है।</p>';
    var sc = scope(ui, 640, 240, "5S स्कोर कार्ड");

    function calc() {
      var vals = steps.map(function (s) { return state[s.k]; });
      var total = vals.reduce(function (a, b) { return a + b; }, 0);
      var avg = total / 5;
      var weak = steps.filter(function (s) { return state[s.k] <= 2; }).map(function (s) { return s.n.split(" — ")[0]; });
      return { vals: vals, total: total, avg: avg, weak: weak };
    }

    function draw() {
      var c = calc(), g = sc.g, w = sc.c.width, h = sc.c.height;
      board(g, w, h, false);
      var bw = (w - 80) / 5;
      steps.forEach(function (s, i) {
        var v = state[s.k];
        var x = 40 + i * bw, y = h - 46;
        text(g, s.n.split(" — ")[0], x + bw / 2, 26, 12, "#0d1b26", "center", true);
        for (var k = 0; k < 5; k++) {
          var cellY = y - (k + 1) * 26;
          bar(g, x + 10, cellY, bw - 20, 22, k < v ? (v >= 4 ? "#157f4b" : v >= 3 ? "#c58b2a" : "#d64541") : "#eef2f0");
          g.strokeStyle = "#d7e0e7";
          g.strokeRect(x + 10, cellY, bw - 20, 22);
        }
        text(g, v + "/5", x + bw / 2, y + 12, 11.5, "#35505c", "center", true);
      });
      text(g, "5S ऑडिट — कुल " + c.total + "/25 · औसत " + fmt(c.avg, 1), 20, 12, 12, "#0d1b26", "left", true);
      stats(ui, [
        { label: "कुल स्कोर", value: c.total + " / 25", kind: c.total >= 18 ? "good" : "bad" },
        { label: "स्तर", value: c.avg >= 4 ? "उत्कृष्ट" : c.avg >= 3 ? "अच्छा" : c.avg >= 2 ? "मध्यम" : "कमजोर" },
        { label: "कमजोर S", value: c.weak.length ? c.weak.join(", ") : "कोई नहीं", kind: c.weak.length ? "bad" : "good" },
        { label: "दुर्घटना/गलती जोखिम", value: c.avg >= 4 ? "कम" : c.avg >= 3 ? "मध्यम" : "अधिक", kind: c.avg >= 4 ? "good" : "bad" }
      ]);
      status(ui, c.weak.length
        ? "पहले " + c.weak.join(" और ") + " पर कार्यवाही: ज़िम्मेदार नाम, तारीख, चेकलिस्ट और सप्ताह में एक ऑडिट।"
        : "सभी S अच्छे — अब नए विद्यार्थी को 5S का मालिक बनाकर अनुशासन बनाए रखें।", c.total >= 18 ? "good" : "bad");
      if (c.total >= 20) done(ui, ctx);
    }

    steps.forEach(function (s) {
      bind(ui, "f_" + s.k, function (v) { state[s.k] = v; draw(); });
    });
    button(ui, "fPlan", "सुधार योजना", function () {
      steps.forEach(function (s) {
        state[s.k] = 5;
        var el = ui.controls.querySelector("#f_" + s.k);
        el.value = 5;
        el.parentNode.querySelector("output").textContent = "5/5";
      });
      draw();
      status(ui, "योजना: (1) अनावश्यक सामग्री हटाने की छवि-सूची, (2) हर औज़ार की छाया-बोर्ड जगह, (3) रोज़ 5 मिनट सफाई, (4) 5S पोस्टर व चेकलिस्ट, (5) शुक्रवार 10 मिनट ऑडिट — ज़िम्मेदार: अनुदेशक + समूह नेता।", "good");
    });
    draw();
  }

  /* ---------------- registry ---------------- */
  var SCENES = {
    levels: sceneLevels,
    conditioning: sceneConditioning,
    practice: scenePractice,
    blueprint: sceneBlueprint,
    breakEven: sceneBreakEven,
    item: sceneItem,
    micro: sceneMicro,
    cone: sceneCone,
    comm: sceneComm,
    addie: sceneAddie,
    motivation: sceneMotivation,
    fiveS: sceneFiveS
  };

  window.FITmLive = {
    scenes: Object.keys(SCENES),
    mount: function (sim, body, doneFn) {
      var fn = SCENES[sim.scene];
      if (!fn) {
        var p = document.createElement("p");
        p.className = "sim-hint";
        p.textContent = "इस सिमुलेटर के लिए दृश्य उपलब्ध नहीं है।";
        body.appendChild(p);
        return false;
      }
      fn(sim, body, { done: typeof doneFn === "function" ? doneFn : function () {} });
      return true;
    }
  };
})();
