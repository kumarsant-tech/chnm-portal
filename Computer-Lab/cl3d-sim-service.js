
/* =====================================================================
   कंप्यूटर लैब  ·  sim-service.js
   सर्विसिंग मास्टरक्लास के 2 नए सिम्युलेटर :
     1) थर्मल पेस्ट सिम्युलेटर   (SIM.thermal)
     2) SMPS वोल्टेज जाँच सिम्युलेटर (SIM.psu_test)
   ===================================================================== */
(function () {
  'use strict';

  var SIM = window.CL_SIM = window.CL_SIM || {};

  /* ---------------- साझा हेल्पर (simulators.js जैसा ही) ---------------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function simShell(host, ico, title, sub, right) {
    var box = el('div', 'sim');
    var head = el('div', 'sim-head');
    head.innerHTML = '<span class="s-ico">' + ico + '</span><div><h4>' + title + '</h4><p>' + sub + '</p></div>';
    var r = el('div', 's-right');
    head.appendChild(r);
    if (right) r.appendChild(right);
    var body = el('div', 'sim-body');
    box.appendChild(head); box.appendChild(body);
    host.appendChild(box);
    return { box: box, body: body, right: r };
  }
  function logLine(log, txt, kind) {
    var d = el('div', kind || '');
    d.textContent = txt;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }
  /* विकल्प-पंक्ति बनाने वाला सहायक: एक समय में एक ही चुना जाता है */
  function chooser(title, note, items, onChange, defIdx) {
    var wrap = el('div', 'sim-panel');
    wrap.innerHTML = '<h5>' + title + '</h5>' + (note ? '<p style="margin:0 0 8px;font-size:12.4px;color:var(--muted)">' + note + '</p>' : '');
    var row = el('div', 'pill-row');
    row.style.margin = '0';
    var d = (defIdx == null) ? 0 : defIdx;
    var state = { value: items[d].id };
    items.forEach(function (it, i) {
      var b = el('button', 'pill' + (i === d ? ' good' : ''), (it.ico ? it.ico + ' ' : '') + it.label);
      b.type = 'button';
      b.style.cursor = 'pointer';
      if (i === d) b.dataset.on = '1';
      b.addEventListener('click', function () {
        if (state.value === it.id) return;
        state.value = it.id;
        Array.prototype.forEach.call(row.children, function (x) { x.dataset.on = ''; x.className = 'pill'; });
        b.dataset.on = '1';
        b.className = 'pill good';
        if (onChange) onChange(it.id);
      });
      row.appendChild(b);
    });
    wrap.appendChild(row);
    return { el: wrap, get: function () { return state.value; } };
  }

  /* =================================================================
     1) थर्मल पेस्ट सिम्युलेटर
     ================================================================= */
  var COOLERS = [
    { id: 'stock', label: 'स्टॉक कूलर', load: 74, idle: 42, rth: '0.60 °C/W' },
    { id: 'tower', label: 'टावर कूलर', load: 58, idle: 34, rth: '0.30 °C/W' },
    { id: 'aio', label: 'AIO 240mm', load: 52, idle: 31, rth: '0.16 °C/W' }
  ];
  var AMOUNT = [
    { id: 'kam', label: 'बहुत कम', pen: 16, note: 'IHS के किनारों पर संपर्क नहीं बना — हवा की जेब' },
    { id: 'sahi', label: 'मटर-दाना (सही)', pen: 0, note: 'आदर्श — पतली समान परत' },
    { id: 'zyada', label: 'बहुत ज़्यादा', pen: 8, note: 'मोटी परत ख़ुद अड़चन बन गई + किनारों से बहा' }
  ];
  var METHOD = [
    { id: 'matar', label: 'बूँद + कूलर से फैलाना', pen: 0, note: 'बहुत अच्छा, बुलबुले कम' },
    { id: 'x', label: 'X / क्रॉस', pen: 1, note: 'ठीक है' },
    { id: 'spread', label: 'स्पैटुला से स्प्रेड', pen: 2, note: 'ठीक, थोड़ा हवा फँस सकती है' },
    { id: 'ungli', label: 'ऊँगली से पोतना', pen: 14, note: 'तेल/गंदगी + असमान परत — ग़लत' }
  ];
  var MOUNT = [
    { id: 'xkram', label: 'X-क्रम में समान', pen: 0, note: 'सही' },
    { id: 'oneside', label: 'एक तरफ़ पहले पूरा', pen: 6, note: 'CPU टेढ़ा बैठा' },
    { id: 'dhila', label: 'ढीला छोड़ा', pen: 13, note: 'संपर्क ही नहीं बना' },
    { id: 'overtight', label: 'बहुत ज़्यादा कसा', pen: 9, note: 'बोर्ड मुड़ा, असमान दबाव' }
  ];

  SIM.thermal = function (host) {
    var shell = simShell(host, '🧴', 'थर्मल पेस्ट सिम्युलेटर',
      'अपनी पसंद चुनिए, “इंस्टॉल + टेस्ट” दबाइए और CPU का तापमान देखिए। सही तरीक़े से 30–40°C का फ़र्क़ पड़ सकता है।');
    var grid = el('div', 'sim-grid');
    var left = el('div'), right = el('div');
    grid.appendChild(left); grid.appendChild(right);
    shell.body.appendChild(grid);

    var cPaste = chooser('1) पेस्ट की मात्रा', 'मटर-दाना सबसे अच्छा है', AMOUNT, null, 1);
    var cMethod = chooser('2) लगाने का तरीक़ा', 'बूँद + कूलर का दबाव = आदर्श', METHOD, null, 0);
    var cMount = chooser('3) कसावट (स्क्रू)', 'X-क्रम में थोड़ा-थोड़ा कसें', MOUNT, null, 0);
    var cCooler = chooser('4) कूलर का प्रकार', 'भारी CPU = बड़ा कूलर', COOLERS.map(function (c) { return { id: c.id, label: c.label }; }), null, 0);
    [cPaste, cMethod, cMount, cCooler].forEach(function (c) {
      left.appendChild(c.el);
    });

    var btnRow = el('div', 'pill-row');
    var runB = el('button', 'v-btn', '▶ इंस्टॉल + टेस्ट चलाइए');
    runB.type = 'button';
    var resetB = el('button', 'v-btn', '↺ शुरुआत');
    resetB.type = 'button';
    btnRow.appendChild(runB); btnRow.appendChild(resetB);
    left.appendChild(btnRow);

    /* दाईं तरफ़ : मीटर */
    var out = el('div', 'sim-panel');
    out.innerHTML = '<h5>परिणाम · CPU तापमान</h5>';
    var tempBox = el('div');
    tempBox.style.textAlign = 'center';
    tempBox.style.padding = '6px 0 2px';
    tempBox.innerHTML = '<div style="font-family:IBM Plex Mono,monospace;font-size:44px;font-weight:700;color:var(--muted)" id="simT">-- °C</div>' +
      '<div style="font-size:12.6px;color:var(--muted)">लोड पर (10 मिनट स्ट्रेस टेस्ट)</div>';
    out.appendChild(tempBox);
    var bar = el('div');
    bar.style.cssText = 'height:16px;border-radius:9px;background:var(--code);border:1px solid var(--line);overflow:hidden;margin:10px 0 4px';
    var barIn = el('i');
    barIn.style.cssText = 'display:block;height:100%;width:0%;background:var(--good);transition:.35s';
    bar.appendChild(barIn);
    out.appendChild(bar);
    var scale = el('div');
    scale.innerHTML = '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);font-family:IBM Plex Mono,monospace">' +
      '<span>30°C ठंडा</span><span>60°C ठीक</span><span>80°C गर्म</span><span>100°C Tjmax</span></div>';
    out.appendChild(scale);
    var verdict = el('div');
    verdict.style.marginTop = '10px';
    out.appendChild(verdict);
    var details = el('div');
    out.appendChild(details);
    right.appendChild(out);

    var logP = el('div', 'sim-panel');
    logP.style.marginTop = '14px';
    logP.innerHTML = '<h5>सर्विस लॉग</h5>';
    var log = el('div', 'log');
    logP.appendChild(log);
    right.appendChild(logP);

    function coolerById(id) { for (var i = 0; i < COOLERS.length; i++) if (COOLERS[i].id === id) return COOLERS[i]; return COOLERS[0]; }
    function byId(arr, id) { for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i]; return arr[0]; }

    function reset() {
      log.innerHTML = '';
      tempBox.querySelector('#simT').textContent = '-- °C';
      tempBox.querySelector('#simT').style.color = 'var(--muted)';
      barIn.style.width = '0%';
      verdict.innerHTML = ''; details.innerHTML = '';
      logLine(log, 'बेंच तैयार है — अध्याय 1 की सुरक्षा पूरी है (स्ट्रैप, पावर ऑफ, IPA, प्लास्टिक टूल)।', 'in');
    }

    runB.addEventListener('click', function () {
      var am = byId(AMOUNT, cPaste.get());
      var me = byId(METHOD, cMethod.get());
      var mo = byId(MOUNT, cMount.get());
      var co = coolerById(cCooler.get());

      var pen = am.pen + me.pen + mo.pen;
      var raw = co.load + pen;
      var capped = raw > 100;
      var load = capped ? 100 : raw;
      var idle = co.idle + Math.round(pen * 0.55);
      var throttle = load >= 95;

      log.innerHTML = '';
      logLine(log, 'कूलर: ' + co.label + ' (Rth ≈ ' + co.rth + ')', 'in');
      logLine(log, 'पेस्ट: ' + am.label + ' — ' + am.note, am.pen === 0 ? 'ok' : 'wr');
      logLine(log, 'तरीक़ा: ' + me.label + ' — ' + me.note, me.pen === 0 ? 'ok' : 'wr');
      logLine(log, 'कसावट: ' + mo.label + ' — ' + mo.note, mo.pen === 0 ? 'ok' : 'wr');
      logLine(log, 'ख़ाली तापमान: ' + idle + '°C · लोड तापमान: ' + load + '°C' + (capped ? ' (Tjmax पर सीमित)' : ''), load >= 85 ? 'no' : (load >= 75 ? 'wr' : 'ok'));

      var t = tempBox.querySelector('#simT');
      t.textContent = load + ' °C';
      var col = load >= 95 ? 'var(--bad)' : load >= 85 ? 'var(--warn)' : 'var(--good)';
      t.style.color = col;
      barIn.style.width = Math.max(4, Math.min(100, (load - 30) / 0.7)) + '%';
      barIn.style.background = col;

      var vTxt, vKind;
      if (throttle) { vTxt = '❌ थ्रॉटलिंग! CPU ख़ुद को धीमा कर रहा है — स्पीड 4.3GHz से 2.4GHz पर गिर जाएगी।' + (capped ? ' (तापमान Tjmax = 100°C पर रुक जाता है, पर CPU पूरी तरह धीमा हो जाता है — लंबे समय में चिप की उम्र घटती है।)' : ''); vKind = 'warn'; }
      else if (load >= 85) { vTxt = '⚠️ गर्म — यह ठीक नहीं। 6–12 महीने में CPU/बोर्ड की उम्र घटेगी और फैन चीखेगा।'; vKind = 'warn'; }
      else if (load >= 75) { vTxt = '🙂 स्वीकार्य, पर बेहतर हो सकता है। 5–10°C और गिराना संभव है।'; vKind = 'info'; }
      else { vTxt = '✅ उत्तम! पेस्ट, तरीक़ा और कसावट — तीनों सही। CPU पूरी स्पीड पर चलेगा।'; vKind = 'tip'; }
      verdict.innerHTML = '<div class="callout ' + vKind + '"><b class="ct">नतीजा</b>' + vTxt + '</div>';

      var tips = [];
      if (am.pen) tips.push('पेस्ट की मात्रा: ' + am.note);
      if (me.pen) tips.push('लगाने का तरीक़ा: ' + me.note);
      if (mo.pen) tips.push('कसावट: ' + mo.note);
      if (!tips.length) tips.push('इसी तरीक़े को हर CPU पर दोहराइए — मापकर, याद रखकर नहीं।');
      details.innerHTML = '<div class="sim-panel"><h5>क्या सुधारें?</h5><ul style="margin:0;padding-left:18px;font-size:13.4px">' +
        tips.map(function (x) { return '<li>' + x + '</li>'; }).join('') +
        '<li>ख़ाली तापमान: <b>' + idle + '°C</b> · लोड: <b>' + load + '°C</b> ' + (throttle ? '<b style="color:var(--bad)">(थ्रॉटल)</b>' : '') + '</li></ul></div>';
    });

    resetB.addEventListener('click', reset);
    reset();
  };

  /* =================================================================
     2) SMPS वोल्टेज जाँच सिम्युलेटर
     ================================================================= */
  /* हर परिदृश्य में रेल की मापी गई वोल्टेज (मल्टीमीटर रीडिंग) */
  var SCENARIOS = [
    { id: 'good', title: 'स्वस्थ SMPS (नया 550W)', v: { '+12V': 12.10, '+5V': 5.05, '+3.3V': 3.31, '+5VSB': 5.02, 'PWR_OK': 5.02, '-12V': -11.90 }, ok: true,
      ex: 'सारी रेल टॉलरेंस के अंदर हैं — SMPS ठीक है। ख़राबी कहीं और है (बोर्ड/RAM/CPU)।' },
    { id: 'weak12', title: 'कमज़ोर +12V रेल (पुराना 450W)', v: { '+12V': 11.18, '+5V': 5.01, '+3.3V': 3.28, '+5VSB': 5.00, 'PWR_OK': 4.85, '-12V': -11.75 }, ok: false,
      ex: '+12V (11.18V) ±5% सीमा से बाहर है। CPU/GPU को कम पावर मिलेगी — बूट में रुकावट, रीस्टार्ट, नीली स्क्रीन। यह SMPS बदलिए।' },
    { id: 'unstable', title: 'फूले कैपेसिटर वाला अस्थिर SMPS', v: { '+12V': 11.94, '+5V': 5.12, '+3.3V': 3.24, '+5VSB': 4.68, 'PWR_OK': 4.10, '-12V': -11.60 }, ok: false,
      ex: '+5VSB (4.68V) और PWR_OK (4.10V) दोनों कम हैं। PC कभी चालू होगा, कभी नहीं — शॉर्ट/अस्थिरता का जोखिम है। फ़ौरन बदलिए।' },
    { id: 'dead5vsb', title: '5VSB रेल फेल SMPS', v: { '+12V': 12.04, '+5V': 5.00, '+3.3V': 3.30, '+5VSB': 0.00, 'PWR_OK': 0.00, '-12V': -11.80 }, ok: false,
      ex: '+5VSB = 0V है। यह स्टैंडबाय रेल ही फ्रंट पैनल बटन को जगाती है — इसके बिना बटन दबाने पर PC चालू ही नहीं होगा। SMPS बदलिए।' },
    { id: 'over', title: 'ज़रूरत से ज़्यादा वोल्टेज (नियंत्रण फेल)', v: { '+12V': 13.05, '+5V': 5.40, '+3.3V': 3.52, '+5VSB': 5.30, 'PWR_OK': 5.10, '-12V': -12.40 }, ok: false,
      ex: 'सारी रेल ऊपर की सीमा से बाहर हैं — यह SMPS जल्द ही मदरबोर्ड/ड्राइव को नुकसान पहुँचाएगा। तुरंत बदलिए, और इससे किसी PC को न चलाइए।' }
  ];
  /* 24-pin में जाँचने योग्य पिन : [पिन, रेल, तार का रंग] */
  var PINS = [
    [1, '+3.3V', 'नारंगी'], [2, '+3.3V', 'नारंगी'], [4, '+5V', 'लाल'], [5, 'COM', 'काला'],
    [9, '+5VSB', 'बैंगनी'], [10, '+12V', 'पीला'], [11, '+12V', 'पीला'], [13, '+3.3V', 'नारंगी'],
    [14, '-12V', 'नीला'], [15, 'COM', 'काला'], [16, 'PS_ON#', 'हरा'], [17, 'COM', 'काला'],
    [21, '+5V', 'लाल'], [22, '+5V', 'लाल'], [23, '+5V', 'लाल'], [24, 'COM', 'काला'],
    ['8', 'PWR_OK', 'स्लेटी'], ['4P', '+12V (CPU)', 'पीला']
  ];
  var RAIL_OK = { '+12V': [11.40, 12.60], '+5V': [4.75, 5.25], '+3.3V': [3.14, 3.47], '+5VSB': [4.75, 5.25], 'PWR_OK': [3.00, 6.00], '-12V': [-13.20, -10.80] };

  SIM.psu_test = function (host) {
    var pick = el('select', 'v-btn');
    pick.style.maxWidth = '300px';
    SCENARIOS.forEach(function (sc, i) {
      var o = document.createElement('option'); o.value = i; o.textContent = sc.title; pick.appendChild(o);
    });
    var shell = simShell(host, '🔌', 'SMPS वोल्टेज जाँच सिम्युलेटर',
      'पहले पेपरक्लिप (PS_ON ↔ COM) लगाइए। फिर 24-pin के पिनों पर क्लिक करके मल्टीमीटर की रीडिंग देखिए और निर्णय चुनिए।', pick);

    var grid = el('div', 'sim-grid');
    var left = el('div'), right = el('div');
    grid.appendChild(left); grid.appendChild(right);
    shell.body.appendChild(grid);

    /* बायाँ : पेपरक्लिप नियंत्रण + मीटर */
    var clipP = el('div', 'sim-panel');
    clipP.innerHTML = '<h5>चरण 1 · पेपरक्लिप ट्रिक</h5>' +
      '<p style="margin:0 0 8px;font-size:12.8px;color:var(--muted)">हरे तार (16 · PS_ON#) को किसी काले तार (COM) से जोड़िए — ताकि SMPS मदरबोर्ड के बिना चालू हो जाए।</p>';
    var clipB = el('button', 'v-btn', '📎 पेपरक्लिप लगाइए (PS_ON ↔ COM)');
    clipB.type = 'button';
    clipP.appendChild(clipB);
    var clipState = el('div');
    clipState.style.marginTop = '8px';
    clipP.appendChild(clipState);
    left.appendChild(clipP);

    var meterP = el('div', 'sim-panel');
    meterP.style.marginTop = '14px';
    meterP.innerHTML = '<h5>मल्टीमीटर (DC वोल्ट · 20V रेंज)</h5>';
    var meterRead = el('div');
    meterRead.style.cssText = 'text-align:center;font-family:IBM Plex Mono,monospace;font-size:40px;font-weight:700;color:var(--muted);margin:4px 0';
    meterRead.textContent = '0.00 V';
    meterP.appendChild(meterRead);
    var meterSub = el('div');
    meterSub.style.cssText = 'text-align:center;font-size:12.6px;color:var(--muted);min-height:18px';
    meterSub.textContent = 'किसी पिन पर क्लिक कीजिए';
    meterP.appendChild(meterSub);
    var probeInfo = el('div');
    meterP.appendChild(probeInfo);
    left.appendChild(meterP);

    /* दायाँ : 24-pin ग्रिड + लॉग */
    var pinP = el('div', 'sim-panel');
    pinP.innerHTML = '<h5>चरण 2 · 24-pin कनेक्टर के पिन</h5>' +
      '<p style="margin:0 0 8px;font-size:12.4px;color:var(--muted)">लाल प्रोब इन पिनों पर; काला प्रोब COM (काले तार) पर।</p>';
    var pinBox = el('div');
    pinBox.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:6px';
    pinP.appendChild(pinBox);
    right.appendChild(pinP);

    var logP = el('div', 'sim-panel');
    logP.style.marginTop = '14px';
    logP.innerHTML = '<h5>मापन लॉग</h5>';
    var log = el('div', 'log');
    logP.appendChild(log);
    right.appendChild(logP);

    /* निर्णय */
    var decP = el('div', 'sim-panel');
    decP.style.marginTop = '14px';
    decP.innerHTML = '<h5>चरण 3 · निर्णय</h5>';
    var decBtns = el('div', 'pill-row');
    ['✅ SMPS ठीक है — ख़राबी कहीं और', '🛠️ SMPS बदलना चाहिए'].forEach(function (t, i) {
      var b = el('button', 'pill', t);
      b.type = 'button'; b.style.cursor = 'pointer';
      b.addEventListener('click', function () {
        if (!scenario) return;
        if (decided) return; decided = true;
        var chooseBad = i === 1;
        var correct = (scenario.ok === false) === chooseBad;
        Array.prototype.forEach.call(decBtns.children, function (x, k) {
          if (k === (scenario.ok ? 0 : 1)) x.className = 'pill good';
          else if (k === i) x.className = 'pill bad';
        });
        decRes.innerHTML = '<div class="callout ' + (correct ? 'tip' : 'warn') + '"><b class="ct">' +
          (correct ? 'सही निर्णय! ✔' : 'ग़लत — सही उत्तर: ' + (scenario.ok ? 'SMPS ठीक है' : 'SMPS बदलना चाहिए')) + '</b>' +
          scenario.ex + '</div>';
      });
      decBtns.appendChild(b);
    });
    decP.appendChild(decBtns);
    var decRes = el('div');
    decP.appendChild(decRes);
    left.appendChild(decP);

    var scenario = null, clipOn = false, decided = false, read = {};

    function readFor(rail) {
      if (!clipOn) return 0;
      if (rail.indexOf('COM') === 0) return 0;
      var v = scenario.v[rail];
      return (v == null) ? null : v;
    }

    function renderPins() {
      pinBox.innerHTML = '';
      PINS.forEach(function (p) {
        var rail = p[1];
        var b = el('button', 'pill', '<span style="font-family:IBM Plex Mono,monospace;font-weight:700">' + p[0] + '</span> ' + rail + '<div style="font-size:10.5px;color:var(--muted);font-weight:500">' + p[2] + '</div>');
        b.type = 'button';
        b.style.cssText = 'cursor:pointer;text-align:center;line-height:1.35;padding:6px 4px';
        b.addEventListener('click', function () {
          if (!clipOn) {
            meterRead.textContent = '0.00 V';
            meterRead.style.color = 'var(--muted)';
            meterSub.textContent = 'SMPS चालू नहीं है — पहले पेपरक्लिप लगाइए';
            logLine(log, '⚠️ PS_ON (16) ↔ COM (15) नहीं जुड़ा — SMPS बंद है, सारी रेडिंग 0V।', 'wr');
            return;
          }
          if (rail === 'COM') {
            meterRead.textContent = '0.00 V';
            meterRead.style.color = 'var(--muted)';
            meterSub.textContent = 'यह COM (ग्राउंड) है — यहीं काला प्रोब रहता है';
            probeInfo.innerHTML = '<div class="callout info" style="margin-top:8px"><b class="ct">COM पिन ' + p[0] + '</b>यह ग्राउंड है। मल्टीमीटर का <b>काला प्रोब</b> हमेशा यहीं (किसी भी COM पिन पर) रहता है। लाल प्रोब से बाक़ी रेल नापिए।</div>';
            return;
          }
          if (rail === 'PS_ON#') {
            meterRead.textContent = (clipOn ? '0.00' : '5.00') + ' V';
            meterRead.style.color = 'var(--muted)';
            meterSub.textContent = 'PS_ON# — बोर्ड इस पिन को GND करके SMPS चालू करता है';
            probeInfo.innerHTML = '<div class="callout ' + (clipOn ? 'info' : 'warn') + '" style="margin-top:8px"><b class="ct">PS_ON# (हरा · पिन 16)</b>' +
              (clipOn ? 'आपने इसे COM से जोड़ दिया है — यही “पेपरक्लिप ट्रिक” है। इसीलिए SMPS चालू है।' : 'यह 5V पर है — यानी SMPS बंद है। इसे COM से जोड़िए (पेपरक्लिप) तो चालू हो जाएगा।') + '</div>';
            return;
          }
          var v = readFor(rail);
          if (v == null) { meterSub.textContent = 'पिन ' + p[0] + ' की रेडिंग उपलब्ध नहीं'; return; }
          read[rail] = v;
          var t = RAIL_OK[rail] || (RAIL_OK['+12V']);
          var inTol = v >= t[0] && v <= t[1];
          meterRead.textContent = v.toFixed(2) + ' V';
          meterRead.style.color = inTol ? 'var(--good)' : 'var(--bad)';
          meterSub.textContent = rail + ' · टॉलरेंस ' + t[0].toFixed(2) + ' से ' + t[1].toFixed(2) + ' V';
          logLine(log, p[0] + ' · ' + rail + ' (' + p[2] + ' तार) = ' + v.toFixed(2) + ' V — ' + (inTol ? '✔ ठीक' : '❌ टॉलरेंस से बाहर'), inTol ? 'ok' : 'no');
          if (rail !== 'PWR_OK' && read['PWR_OK'] == null && read['+12V'] != null && read['+5V'] != null && read['+3.3V'] != null && read['+5VSB'] != null) {
            logLine(log, '💡 चारों मुख्य रेल नाप लीं — अब PWR_OK (स्लेटी, पिन 8) भी जाँचिए। यह सिग्नल न आए तो बोर्ड POST नहीं करेगा।', 'in');
          }
        });
        pinBox.appendChild(b);
      });
    }

    function renderScenario(i) {
      scenario = SCENARIOS[i]; clipOn = false; decided = false; read = {};
      clipState.innerHTML = '';
      clipB.classList.remove('on');
      clipB.textContent = '📎 पेपरक्लिप लगाइए (PS_ON ↔ COM)';
      meterRead.textContent = '0.00 V'; meterRead.style.color = 'var(--muted)';
      meterSub.textContent = 'किसी पिन पर क्लिक कीजिए';
      probeInfo.innerHTML = ''; decRes.innerHTML = '';
      Array.prototype.forEach.call(decBtns.children, function (x) { x.className = 'pill'; });
      log.innerHTML = '';
      logLine(log, '24-pin को मदरबोर्ड से अलग कर दिया गया। प्लग निकला, पावर बटन 5 सेकंड दबाया (सुरक्षा पूरी)।', 'in');
      logLine(log, 'अब हरे तार (16) को काले तार (COM) से जोड़िए — पेपरक्लिप ट्रिक।', 'in');
      renderPins();
    }

    clipB.addEventListener('click', function () {
      clipOn = !clipOn;
      if (clipOn) {
        clipB.classList.add('on');
        clipB.textContent = '📎 पेपरक्लिप लगा है — निकालने के लिए क्लिक';
        clipState.innerHTML = '<div class="callout tip"><b class="ct">SMPS चालू हो गया ✔</b>PS_ON# (हरा) और COM (काला) जुड़ गए — SMPS का पंखा घूमने लगा। अब पिन पर क्लिक करके रेल नापिए।</div>';
        logLine(log, 'PS_ON (16) ↔ COM (15) जोड़ा गया — SMPS चालू, पंखा घूम रहा है।', 'ok');
      } else {
        clipB.textContent = '📎 पेपरक्लिप लगाइए (PS_ON ↔ COM)';
        clipState.innerHTML = '<div class="callout warn"><b class="ct">SMPS बंद</b>पेपरक्लिप निकाल दिया — अब सारी रेडिंग 0V दिखेगी।</div>';
        logLine(log, 'पेपरक्लिप निकाला — SMPS बंद हो गया।', 'wr');
        meterRead.textContent = '0.00 V'; meterRead.style.color = 'var(--muted)';
      }
    });

    pick.addEventListener('change', function () { renderScenario(parseInt(pick.value, 10)); });
    renderScenario(0);
  };

})();

