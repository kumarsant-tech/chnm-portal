
/* =====================================================================
   कंप्यूटर लैब  ·  simulators.js
   5 सिम्युलेटर : असेंबली · वायरिंग · POST बीप · बूट सीक्वेंस · फ़ॉल्ट फाइंडर
   ===================================================================== */
(function () {
  'use strict';
  var SIM = {};
  window.CL_SIM = SIM;

  /* ---------------- साझा हेल्पर ---------------- */
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

  /* =================================================================
     1) असेंबली सिम्युलेटर
     ================================================================= */
  var PARTS = [
    { id: 'mb', label: 'मदरबोर्ड', ico: '🟩', slot: 'mb', order: 1, tip: 'स्टैंडऑफ़ पर स्क्रू से कसें' },
    { id: 'cpu', label: 'CPU', ico: '🔲', slot: 'cpu', order: 2, tip: 'तीर▲ मिलाकर लगाएँ' },
    { id: 'cooler', label: 'CPU कूलर + पेस्ट', ico: '❄️', slot: 'cooler', order: 3, tip: 'X-आकार में पेच कसें' },
    { id: 'ram', label: 'RAM', ico: '📏', slot: 'ram', order: 4, tip: 'क्लिप बंद होकर क्लिक हो' },
    { id: 'hdd', label: 'HDD (3.5")', ico: '💿', slot: 'hdd', order: 5, tip: 'बे में स्क्रू से कसें' },
    { id: 'ssd', label: 'SSD / M.2', ico: '⚡', slot: 'ssd', order: 6, tip: 'M.2 को 30° पर डालें' },
    { id: 'psu', label: 'SMPS', ico: '🔌', slot: 'psu', order: 7, tip: 'पंखा नीचे की तरफ़' },
    { id: 'gpu', label: 'ग्राफ़िक्स कार्ड', ico: '🎮', slot: 'gpu', order: 8, tip: 'PCIe x16, लॉक बंद करें' },
    { id: 'w24', label: '24-pin पावर', ico: '🟨', slot: 'w24', order: 9, tip: 'क्लिक सुनाई दे' },
    { id: 'fp', label: 'फ्रंट पैनल केबल', ico: '🎛️', slot: 'fp', order: 10, tip: 'PWR_SW = दो पिन' },
    { id: 'fan', label: 'केस फैन', ico: '🌀', slot: 'fan', order: 11, tip: 'आगे से अंदर, पीछे से बाहर' },
    { id: 'panel', label: 'साइड पैनल + AC', ico: '🚪', slot: 'panel', order: 12, tip: 'आख़िर में पावर केबल' }
  ];
  var SLOTS = {
    mb:     { l: 3,  t: 10, w: 60, h: 56, name: 'मदरबोर्ड ट्रे' },
    cpu:    { l: 7,  t: 14, w: 20, h: 13, name: 'CPU सॉकेट' },
    cooler: { l: 7,  t: 30, w: 20, h: 11, name: 'कूलर' },
    ram:    { l: 30, t: 14, w: 10, h: 38, name: 'RAM स्लॉट' },
    gpu:    { l: 7,  t: 48, w: 46, h: 12, name: 'PCIe x16' },
    hdd:    { l: 66, t: 10, w: 31, h: 13, name: '3.5" बे' },
    ssd:    { l: 66, t: 25, w: 31, h: 11, name: '2.5"/M.2' },
    fan:    { l: 66, t: 38, w: 31, h: 10, name: 'केस फैन बे' },
    psu:    { l: 66, t: 60, w: 31, h: 22, name: 'SMPS बे' },
    w24:    { l: 30, t: 55, w: 12, h: 10, name: '24-pin हेडर' },
    fp:     { l: 7,  t: 64, w: 46, h: 10, name: 'फ्रंट पैनल हेडर' },
    panel:  { l: 3,  t: 86, w: 94, h: 11, name: 'साइड पैनल / AC' }
  };

  SIM.assembly = function (host) {
    var shell = simShell(host, '🔧', 'PC असेंबली सिम्युलेटर',
      'पुर्ज़े चुनिए और सही जगह पर लगाइए — क्रम (order) भी मायने रखता है।');
    var modeBtn = el('button', 'v-btn on', '🎯 चरणबद्ध मोड: ON');
    shell.right.appendChild(modeBtn);
    var resetBtn = el('button', 'v-btn', '↺ रीसेट');
    shell.right.appendChild(resetBtn);

    var grid = el('div', 'sim-grid');
    var left = el('div');
    var right = el('div');
    grid.appendChild(left); grid.appendChild(right);
    shell.body.appendChild(grid);
    left.appendChild(el('div', 'sim-panel')).innerHTML = '<h5>पुर्ज़ों की ट्रे (यहाँ से चुनिए)</h5>';
    var tray = el('div', 'tray');
    left.querySelector('.sim-panel').appendChild(tray);

    var casePanel = el('div', 'sim-panel');
    casePanel.innerHTML = '<h5>कैबिनेट (यहाँ लगाइए)</h5>';
    var caseBox = el('div', 'case');
    casePanel.appendChild(caseBox);
    right.appendChild(casePanel);

    var logPanel = el('div', 'sim-panel');
    logPanel.style.marginTop = '14px';
    logPanel.innerHTML = '<h5>प्रक्रिया लॉग</h5>';
    var log = el('div', 'log');
    logPanel.appendChild(log);
    right.appendChild(logPanel);

    var slotEls = {}, placed = {}, sel = null, stepMode = true;

    Object.keys(SLOTS).forEach(function (k) {
      var s = SLOTS[k];
      var d = el('div', 'slot', '<span class="s-ico">＋</span><span>' + s.name + '</span>');
      d.style.left = s.l + '%'; d.style.top = s.t + '%';
      d.style.width = s.w + '%'; d.style.height = s.h + '%';
      d.dataset.slot = k;
      d.addEventListener('click', function () { tryPlace(k, d); });
      d.addEventListener('dragover', function (e) { e.preventDefault(); d.classList.add('hot-over'); });
      d.addEventListener('dragleave', function () { d.classList.remove('hot-over'); });
      d.addEventListener('drop', function (e) {
        e.preventDefault(); d.classList.remove('hot-over');
        var pid = e.dataTransfer.getData('text/plain'); selectPart(pid); tryPlace(k, d);
      });
      caseBox.appendChild(d);
      slotEls[k] = d;
    });
    ['🌀', '🌀'].forEach(function (ic, i) {
      var f = el('div', 'fanc idle', ic);
      f.style.width = '13%'; f.style.height = '13%';
      f.style.left = (i === 0 ? 12 : 40) + '%'; f.style.top = '76%';
      caseBox.appendChild(f);
      if (i === 0) f.dataset.frontFan = '1';
    });

    var partEls = {};
    PARTS.forEach(function (p) {
      var d = el('div', 'part', '<span class="p-ico">' + p.ico + '</span>' + p.label);
      d.draggable = true;
      d.dataset.pid = p.id;
      d.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', p.id); d.classList.add('dragging');
      });
      d.addEventListener('dragend', function () { d.classList.remove('dragging'); });
      d.addEventListener('click', function () { selectPart(p.id); });
      tray.appendChild(d);
      partEls[p.id] = d;
    });

    function selectPart(id) {
      sel = id;
      Object.keys(partEls).forEach(function (k) { partEls[k].classList.toggle('dragging', k === id && !placed[k]); });
      if (!placed[id]) logLine(log, '👉 चुना: ' + nameOf(id) + ' — अब सही जगह क्लिक कीजिए', 'in');
    }
    function nameOf(id) { for (var i = 0; i < PARTS.length; i++) if (PARTS[i].id === id) return PARTS[i].label; return id; }
    function partOf(id) { for (var i = 0; i < PARTS.length; i++) if (PARTS[i].id === id) return PARTS[i]; }

    function tryPlace(slotKey, slotDiv) {
      if (!sel) { logLine(log, '⚠️ पहले नीचे ट्रे से कोई पुर्ज़ा चुनिए', 'wr'); return; }
      var p = partOf(sel);
      if (placed[sel]) { logLine(log, '⚠️ यह पुर्ज़ा पहले ही लग चुका है', 'wr'); return; }
      if (p.slot !== slotKey) {
        slotDiv.classList.add('bad');
        setTimeout(function () { slotDiv.classList.remove('bad'); }, 450);
        logLine(log, '❌ ' + p.label + ' यहाँ नहीं लगता! (' + SLOTS[slotKey].name + ') — सही स्लॉट: ' + SLOTS[p.slot].name, 'no');
        return;
      }
      if (stepMode) {
        var doneCount = Object.keys(placed).length + 1;
        if (p.order !== doneCount) {
          var want = null;
          for (var i = 0; i < PARTS.length; i++) if (PARTS[i].order === doneCount) want = PARTS[i];
          slotDiv.classList.add('bad');
          setTimeout(function () { slotDiv.classList.remove('bad'); }, 450);
          logLine(log, '⏸️ क्रम गलत — अब पहले लगाना है: ' + (want ? want.label : '?'), 'wr');
          return;
        }
      }
      placed[sel] = true;
      slotDiv.classList.add('filled');
      slotDiv.innerHTML = '<span class="s-ico">' + p.ico + '</span><span>' + p.label + '</span>';
      partEls[sel].classList.add('used');
      partEls[sel].classList.remove('dragging');
      logLine(log, '✅ ' + p.label + ' लग गया → ' + p.tip, 'ok');
      if (sel === 'panel') {
        var ff = caseBox.querySelector('[data-front-fan]');
        if (ff) ff.classList.remove('idle');
      }
      sel = null;
      if (Object.keys(placed).length === PARTS.length) finish();
    }
    function finish() {
      logLine(log, '🎉 असेंबली पूरी! अब कीबोर्ड-माउस लगाइए और पावर बटन दबाइए…', 'ok');
      logLine(log, '🔊 बीप… सिस्टम POST पास — BIOS स्क्रीन आ गई।', 'ok');
      var b = el('div', 'callout tip');
      b.innerHTML = '<b class="ct">बधाई हो — कंप्यूटर तैयार है!</b> अगला काम: BIOS में तारीख-समय सेट करना और बूट ऑर्डर चुनना (मॉड्यूल 9)।';
      shell.body.appendChild(b);
      playBeeps([[880, 140]]);
    }
    modeBtn.addEventListener('click', function () {
      stepMode = !stepMode;
      modeBtn.textContent = '🎯 चरणबद्ध मोड: ' + (stepMode ? 'ON' : 'OFF');
      modeBtn.classList.toggle('on', stepMode);
      logLine(log, stepMode ? '🔒 चरणबद्ध मोड चालू — सही क्रम ज़रूरी है' : '🔓 फ़्री मोड — किसी भी क्रम में लगाइए', 'in');
    });
    resetBtn.addEventListener('click', function () {
      placed = {}; sel = null;
      Object.keys(slotEls).forEach(function (k) {
        var d = slotEls[k];
        d.className = 'slot';
        d.innerHTML = '<span class="s-ico">＋</span><span>' + SLOTS[k].name + '</span>';
      });
      Object.keys(partEls).forEach(function (k) { partEls[k].classList.remove('used', 'dragging'); });
      log.innerHTML = '';
      logLine(log, '🔄 सिम्युलेटर रीसेट — फिर से शुरू कीजिए', 'in');
    });
    var intro = el('div', 'callout info');
    intro.innerHTML = '<b class="ct">कैसे खेलें</b> नीचे ट्रे से पुर्ज़ा क्लिक कीजिए (या खींचिए), फिर कैबिनेट में उसकी सही जगह पर क्लिक कीजिए। चरणबद्ध मोड में क्रम भी सही होना चाहिए।';
    shell.body.insertBefore(intro, grid);
    logLine(log, 'तैयार! पहला स्टेप: मदरबोर्ड केस में कसना।', 'in');
  };

  /* =================================================================
     2) वायरिंग सिम्युलेटर
     ================================================================= */
  var WIRES = [
    { id: 'w24', label: 'SMPS का 24-pin मेन', sub: 'मुख्य पावर', color: '#facc15', to: 'pin24' },
    { id: 'wcpu', label: 'SMPS का 4/8-pin CPU', sub: 'CPU पावर', color: '#fb923c', to: 'pincpu8' },
    { id: 'wcpufan', label: 'CPU कूलर का फैन तार', sub: 'CPU_FAN हेडर', color: '#38bdf8', to: 'pincpufan' },
    { id: 'wsysfan', label: 'केस फैन का तार', sub: 'SYS_FAN हेडर', color: '#22d3ee', to: 'pinsysfan' },
    { id: 'wsata', label: 'SATA डेटा केबल (पतला)', sub: 'मदरबोर्ड → ड्राइव', color: '#ef4444', to: 'pinsata0' },
    { id: 'wsatap', label: 'SATA पावर केबल (चौड़ा)', sub: 'SMPS → ड्राइव', color: '#a3e635', to: 'pinsatapwr' },
    { id: 'wpcie', label: 'PCIe 6/8-pin केबल', sub: 'GPU पावर', color: '#f472b6', to: 'pinpcie' },
    { id: 'wfp', label: 'फ्रंट पैनल PWR_SW', sub: 'पावर बटन', color: '#fbbf24', to: 'pinfp' },
    { id: 'wusb', label: 'फ्रंट USB हेडर', sub: 'USB 2.0/3.0', color: '#34d399', to: 'pinusb' },
    { id: 'waudio', label: 'HD ऑडियो हेडर', sub: 'फ्रंट जैक', color: '#c084fc', to: 'pinaudio' },
    { id: 'wmon', label: 'मॉनिटर केबल (HDMI/DP)', sub: 'GPU → मॉनिटर', color: '#60a5fa', to: 'pinhdmi' },
    { id: 'wlan', label: 'LAN (RJ45) केबल', sub: 'राउटर → PC', color: '#4ade80', to: 'pinlan' },
    { id: 'wac', label: 'AC पावर केबल', sub: 'सॉकेट → SMPS', color: '#e2e8f0', to: 'pinac' },
    { id: 'wnvme', label: 'NVMe SSD (M.2)', sub: 'तार नहीं, स्लॉट', color: '#f59e0b', to: 'pinm2' }
  ];
  var PINS = [
    { id: 'pin24', x: 610, y: 110, t: '24-pin ATX' },
    { id: 'pincpu8', x: 400, y: 78, t: 'CPU_PWR (8-pin)' },
    { id: 'pincpufan', x: 545, y: 78, t: 'CPU_FAN' },
    { id: 'pinsysfan', x: 620, y: 78, t: 'SYS_FAN' },
    { id: 'pinsata0', x: 620, y: 175, t: 'SATA0 (डेटा)' },
    { id: 'pinsatapwr', x: 480, y: 175, t: 'SATA पावर' },
    { id: 'pinpcie', x: 430, y: 392, t: 'GPU PCIe पावर' },
    { id: 'pinfp', x: 620, y: 300, t: 'F_PANEL' },
    { id: 'pinusb', x: 620, y: 245, t: 'USB हेडर' },
    { id: 'pinaudio', x: 470, y: 350, t: 'HD_AUDIO' },
    { id: 'pinhdmi', x: 380, y: 392, t: 'HDMI / DP' },
    { id: 'pinlan', x: 400, y: 300, t: 'RJ45 (LAN)' },
    { id: 'pinac', x: 610, y: 350, t: 'AC इनलेट (SMPS)' },
    { id: 'pinm2', x: 545, y: 245, t: 'M.2 स्लॉट' }
  ];

  SIM.wiring = function (host) {
    var shell = simShell(host, '🔌', 'वायरिंग व कनेक्शन सिम्युलेटर',
      'बाएँ से तार चुनिए और मदरबोर्ड पर सही हेडर पर क्लिक कीजिए।');
    var doneLbl = el('span', 'v-btn', '0 / 14');
    doneLbl.style.cursor = 'default';
    shell.right.appendChild(doneLbl);
    var resetBtn = el('button', 'v-btn', '↺ रीसेट');
    shell.right.appendChild(resetBtn);

    var grid = el('div', 'sim-grid');
    grid.style.gridTemplateColumns = 'minmax(180px,0.85fr) 1.6fr';
    var left = el('div', 'sim-panel');
    left.innerHTML = '<h5>तार / केबल सूची</h5>';
    var list = el('div', 'cable-list');
    left.appendChild(list);

    var logPanel = el('div', 'sim-panel');
    logPanel.style.marginTop = '12px';
    logPanel.innerHTML = '<h5>लॉग</h5>';
    var log = el('div', 'log');
    logPanel.appendChild(log);
    left.appendChild(logPanel);

    var right = el('div', 'sim-panel');
    right.innerHTML = '<h5>मदरबोर्ड कनेक्शन मैप</h5>';
    var wrap = el('div', 'wire-wrap');
    right.appendChild(wrap);
    grid.appendChild(left); grid.appendChild(right);
    shell.body.appendChild(grid);

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 900 460');
    svg.setAttribute('role', 'img');
    wrap.appendChild(svg);
    function se(tag, attrs) {
      var e = document.createElementNS(svgNS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    }
    // मदरबोर्ड बॉडी
    svg.appendChild(se('rect', { x: 330, y: 20, width: 560, height: 420, rx: 16, fill: '#0b2018', stroke: '#1d6b4f', 'stroke-width': 2 }));
    var t = se('text', { x: 610, y: 45, fill: '#7dd3a8', 'font-size': 15, 'font-weight': 700, 'text-anchor': 'middle', 'font-family': 'IBM Plex Mono, monospace' });
    t.textContent = 'MOTHERBOARD (टॉप व्यू)';
    svg.appendChild(t);
    // CPU सॉकेट चिह्न
    svg.appendChild(se('rect', { x: 360, y: 90, width: 110, height: 110, rx: 8, fill: 'none', stroke: '#2b6b8f', 'stroke-dasharray': '5 5' }));
    var tc = se('text', { x: 415, y: 150, fill: '#4f7fa8', 'font-size': 13, 'text-anchor': 'middle' }); tc.textContent = 'CPU + कूलर'; svg.appendChild(tc);
    // RAM स्लॉट चिह्न
    [0, 1].forEach(function (i) {
      svg.appendChild(se('rect', { x: 498 + i * 26, y: 95, width: 18, height: 150, rx: 4, fill: 'none', stroke: '#2b6b8f', 'stroke-dasharray': '5 5' }));
    });
    // PCIe चिह्न
    svg.appendChild(se('rect', { x: 360, y: 372, width: 210, height: 34, rx: 6, fill: 'none', stroke: '#2b6b8f', 'stroke-dasharray': '5 5' }));
    var tg = se('text', { x: 465, y: 395, fill: '#4f7fa8', 'font-size': 13, 'text-anchor': 'middle' }); tg.textContent = 'PCIe x16 (GPU)'; svg.appendChild(tg);

    var pinEls = {};
    PINS.forEach(function (p) {
      var g2 = se('g', { class: 'pin', 'data-pin': p.id });
      g2.style.cursor = 'pointer';
      g2.appendChild(se('rect', { x: p.x - 8, y: p.y - 8, width: 16, height: 16, rx: 4, fill: '#0e2a44', stroke: '#38bdf8', 'stroke-width': 2 }));
      var tx = se('text', { x: p.x + 16, y: p.y + 5, fill: '#9fb6d6', 'font-size': 13, 'font-family': 'Noto Sans Devanagari, sans-serif' });
      tx.textContent = p.t;
      g2.appendChild(tx);
      g2.addEventListener('click', function () { clickPin(p.id); });
      svg.appendChild(g2);
      pinEls[p.id] = g2;
    });

    var lines = se('g', {}); svg.appendChild(lines);
    var sel = null, done = {};
    var cableEls = {};
    WIRES.forEach(function (w) {
      var d = el('div', 'cable', w.label + '<small>' + w.sub + '</small>');
      d.style.setProperty('--wirec', w.color);
      d.addEventListener('click', function () { pick(w.id); });
      list.appendChild(d);
      cableEls[w.id] = d;
    });

    function pick(id) {
      if (done[id]) return;
      sel = id;
      Object.keys(cableEls).forEach(function (k) { cableEls[k].classList.toggle('sel', k === id); });
      logLine(log, '👉 चुना: ' + wireOf(id).label + ' — अब सही पोर्ट क्लिक कीजिए', 'in');
    }
    function wireOf(id) { for (var i = 0; i < WIRES.length; i++) if (WIRES[i].id === id) return WIRES[i]; }
    function clickPin(pid) {
      if (!sel) { logLine(log, '⚠️ पहले बाएँ से कोई तार चुनिए', 'wr'); return; }
      var w = wireOf(sel);
      if (w.to === pid) {
        done[sel] = true;
        cableEls[sel].classList.add('done');
        cableEls[sel].classList.remove('sel');
        pinEls[pid].classList.add('done');
        var p = null; for (var i = 0; i < PINS.length; i++) if (PINS[i].id === pid) p = PINS[i];
        lines.appendChild(se('line', {
          x1: 260, y1: 100, x2: p.x, y2: p.y, stroke: w.color,
          'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: .85
        }));
        logLine(log, '✅ ' + w.label + ' → ' + p.t + ' (सही)', 'ok');
        sel = null;
        updateCount();
      } else {
        logLine(log, '❌ ' + w.label + ' इस पोर्ट में नहीं लगता! दिशा/आकार देखिए।', 'no');
        pinEls[pid].style.opacity = .4;
        setTimeout(function () { pinEls[pid].style.opacity = 1; }, 350);
      }
    }
    function updateCount() {
      var c = Object.keys(done).length;
      doneLbl.textContent = c + ' / ' + WIRES.length;
      if (c === WIRES.length) {
        logLine(log, '🎉 सारे कनेक्शन सही! अब पावर बटन दबाइए — POST पास।', 'ok');
        var b = el('div', 'callout tip');
        b.innerHTML = '<b class="ct">बधाई हो — पूरी वायरिंग सही है।</b> याद रखिए: 24-pin + CPU 8-pin न लगे तो PC चालू ही नहीं होगा; बाक़ी कनेक्शन छूटे तो सिर्फ़ वही सुविधा बंद रहेगी।';
        shell.body.appendChild(b);
        playBeeps([[880, 140]]);
      }
    }
    resetBtn.addEventListener('click', function () {
      done = {}; sel = null; lines.innerHTML = '';
      Object.keys(cableEls).forEach(function (k) { cableEls[k].classList.remove('done', 'sel'); });
      Object.keys(pinEls).forEach(function (k) { pinEls[k].classList.remove('done'); });
      log.innerHTML = '';
      updateCount();
      logLine(log, '🔄 रीसेट — दोबारा कीजिए', 'in');
    });
    updateCount();
    logLine(log, 'शुरू कीजिए: सबसे पहले 24-pin मेन पावर लगाना सबसे ज़रूरी है।', 'in');
  };

  /* =================================================================
     3) POST बीप सिम्युलेटर
     ================================================================= */
  var AC = null;
  function ctx() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = 'no'; } }
    return AC === 'no' ? null : AC;
  }
  function tone(freq, dur, at, type) {
    var a = ctx(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'square';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.18, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur / 1000);
    o.connect(g); g.connect(a.destination);
    o.start(at); o.stop(at + dur / 1000 + 0.02);
  }
  function playBeeps(seq) {
    var a = ctx(); if (!a) return;
    if (a.state === 'suspended') a.resume();
    var at = a.currentTime + 0.06;
    seq.forEach(function (s) {
      if (s[0] > 0) tone(s[0], s[1], at, 'square');
      at += s[1] / 1000 + 0.05;
    });
  }

  var BEEP_CASES = [
    { id: 'ok', name: '1 छोटी बीप', seq: [[880, 130]], q: 'एक छोटी “बीप” सुनाई दी और स्क्रीन पर BIOS दिख गया। निदान?', opts: ['सब ठीक — POST पास हो गया', 'RAM ख़राब है', 'SMPS फेल है', 'GPU नहीं मिला'], ans: 0, ex: 'एक छोटी बीप का मतलब है POST सफल। CPU, RAM, वीडियो, कीबोर्ड सब मिल गए।' },
    { id: 'dead', name: 'कोई बीप नहीं + पावर लाइट बंद', seq: [], q: 'कोई बीप नहीं, कोई LED नहीं जल रही, फैन भी नहीं घूम रहा। निदान?', opts: ['RAM ढीली है', 'पावर/AC/SMPS की समस्या', 'कीबोर्ड ख़राब', 'डिस्क ख़राब'], ans: 1, ex: 'LED तक नहीं जल रही तो बिजली ही नहीं पहुँच रही — AC प्लग, SMPS का I/O स्विच, 24-pin और SMPS की जाँच करें।' },
    { id: 'fans', name: 'कोई बीप नहीं, पर फैन घूमते हैं', seq: [], q: 'फैन घूम रहे हैं, LED जल रही है, पर स्क्रीन काली है और कोई बीप नहीं। निदान?', opts: ['CPU 8-pin नहीं लगा या RAM/GPU ठीक से नहीं बैठा', 'मॉनिटर बंद है', 'Windows ख़राब है', 'माउस नहीं लगा'], ans: 0, ex: 'यह सबसे आम स्थिति है — CPU पावर (8-pin) या RAM/GPU का कॉन्टैक्ट। क्रम से जाँचें: 8-pin → RAM → GPU।' },
    { id: 'two', name: '2 बीप', seq: [[880, 150], [880, 150]], q: 'दो छोटी बीप के बाद स्क्रीन काली रही। निदान?', opts: ['वीडियो कार्ड एरर', 'पैरिटी एरर — RAM में गड़बड़ी', 'कीबोर्ड एरर', 'टाइमर एरर'], ans: 1, ex: '2 बीप = पैरिटी एरर, यानी RAM की जाँच में गड़बड़ी। RAM निकालकर कॉन्टैक्ट साफ़ करके अलग स्लॉट में लगाइए।' },
    { id: 'three', name: '3 बीप', seq: [[880, 150], [880, 150], [880, 150]], q: 'तीन बीप। निदान?', opts: ['बेस 64K मेमोरी फेल (RAM)', 'CPU फेल', 'SMPS फेल', 'हार्ड डिस्क फेल'], ans: 0, ex: '3 बीप = बेस 64K मेमोरी फेल। RAM स्टिक एक-एक करके अलग-अलग स्लॉट में जाँचिए।' },
    { id: 'four', name: '4 बीप', seq: [[880, 140], [880, 140], [880, 140], [880, 140]], q: 'चार बीप के बाद आगे कुछ नहीं। निदान?', opts: ['कीबोर्ड कंट्रोलर फेल', 'सिस्टम टाइमर/मदरबोर्ड फेल', 'GPU फेल', 'मॉनिटर फेल'], ans: 1, ex: '4 बीप = सिस्टम टाइमर फेल। मदरबोर्ड (चिपसेट) की समस्या — CMOS क्लियर करके देखिए, फिर बोर्ड की जाँच।' },
    { id: 'five', name: '5 बीप', seq: [[880, 140], [880, 140], [880, 140], [880, 140], [880, 140]], q: 'पाँच बीप। निदान?', opts: ['प्रोसेसर (CPU) फेल', 'डिस्क फेल', 'LAN फेल', 'ऑडियो फेल'], ans: 0, ex: '5 बीप = CPU एरर। CPU सही बैठा है? पिन मुड़े नहीं हैं? CPU_FAN लगा है? दूसरे CPU से परखिए।' },
    { id: 'six', name: '6 बीप', seq: [[880, 130], [880, 130], [880, 130], [880, 130], [880, 130], [880, 130]], q: 'छह बीप। निदान?', opts: ['RAM फेल', 'कीबोर्ड कंट्रोलर फेल', 'डिस्क फेल', 'CMOS फेल'], ans: 1, ex: '6 बीप = कीबोर्ड कंट्रोलर फेल। कीबोर्ड और USB/PS2 पोर्ट जाँचिए; कभी-कभी मदरबोर्ड का I/O चिप।' },
    { id: 'vga', name: '1 लंबी + 2 छोटी बीप', seq: [[420, 500], [880, 150], [880, 150]], q: 'एक लंबी और दो छोटी बीप। निदान?', opts: ['वीडियो कार्ड / ग्राफ़िक्स की समस्या', 'RAM की समस्या', 'पावर की समस्या', 'ओएस की समस्या'], ans: 0, ex: 'यह पैटर्न (Award BIOS) वीडियो एरर बताता है। GPU निकालकर ऑनबोर्ड पोर्ट से चलाइए; कार्ड के गोल्ड पिन साफ़ कीजिए।' },
    { id: 'loop', name: 'लगातार लंबी बीप', seq: [[300, 900], [300, 900]], q: 'लगातार लंबी बीप चल रही है। निदान?', opts: ['ओवरहीट (CPU/मदरबोर्ड) या पावर की समस्या', 'डिस्क फुल हो गई', 'माउस ख़राब', 'इंटरनेट नहीं'], ans: 0, ex: 'लंबी/लगातार बीप आमतौर पर ओवरहीट या अस्थिर वोल्टेज बताती है। कूलर, पेस्ट, फैन और SMPS की जाँच कीजिए।' }
  ];

  SIM.beep = function (host) {
    var shell = simShell(host, '🔊', 'POST बीप सिम्युलेटर',
      'बीप सुनिए और बताइए कि कंप्यूटर क्या शिकायत कर रहा है।');
    var stopBtn = el('button', 'v-btn', '🔇 चुप कराइए');
    shell.right.appendChild(stopBtn);

    var info = el('div', 'callout warn');
    info.innerHTML = '<b class="ct">ध्यान दें</b> आवाज़ के लिए स्पीकर/हेडफ़ोन चालू रखें। असली PC में यह आवाज़ मदरबोर्ड पर लगे छोटे <b>PC स्पीकर</b> से आती है (आधुनिक बोर्ड में LED/डिबग कोड)।';
    shell.body.appendChild(info);

    var casesBox = el('div', 'beep-panel');
    shell.body.appendChild(casesBox);

    var out = el('div', 'beep-out');
    shell.body.appendChild(out);

    var vis = el('div', 'beep-vis');
    var bars = [];
    for (var i = 0; i < 14; i++) { var b = el('i'); vis.appendChild(b); bars.push(b); }
    out.appendChild(vis);

    var qEl = el('div', 'beep-q');
    out.appendChild(qEl);
    var optsEl = el('div', 'opt-list');
    out.appendChild(optsEl);

    var cur = null;
    BEEP_CASES.forEach(function (c) {
      var btn = el('button', 'beep-case', '<b>' + c.name + '</b><small>' + (c.seq.length ? c.seq.length + ' आवाज़' : 'कोई आवाज़ नहीं') + '</small>');
      btn.addEventListener('click', function () { choose(c, btn); });
      casesBox.appendChild(btn);
    });
    stopBtn.addEventListener('click', function () { try { ctx() && ctx().close(); AC = null; } catch (e) { } });

    function animate(seq) {
      bars.forEach(function (b) { b.classList.remove('on'); });
      var at = 0;
      seq.forEach(function (s) {
        var d = s[1];
        setTimeout(function () {
          if (s[0] > 0) bars.forEach(function (b) { b.classList.add('on'); });
          else bars.forEach(function (b) { b.classList.remove('on'); });
        }, at);
        at += d;
        if (s[0] > 0) setTimeout(function () { bars.forEach(function (b) { b.classList.remove('on'); }); }, at);
      });
      if (!seq.length) bars.forEach(function (b) { b.classList.remove('on'); });
    }
    function choose(c, btn) {
      cur = c;
      Array.prototype.forEach.call(casesBox.children, function (x) { x.classList.remove('on'); });
      btn.classList.add('on');
      playBeeps(c.seq);
      animate(c.seq);
      qEl.innerHTML = '<b>स्थिति:</b> ' + c.name + ' — ' + c.q;
      optsEl.innerHTML = '';
      c.opts.forEach(function (o, ix) {
        var b2 = el('button', 'opt', o);
        b2.addEventListener('click', function () {
          if (b2.dataset.done) return;
          Array.prototype.forEach.call(optsEl.children, function (x) { x.dataset.done = '1'; });
          if (ix === c.ans) {
            b2.classList.add('ok');
            optsEl.appendChild(el('div', 'callout tip', '<b class="ct">सही जवाब! ✔</b>' + c.ex));
          } else {
            b2.classList.add('no');
            var right = optsEl.children[c.ans];
            if (right) right.classList.add('ok');
            optsEl.appendChild(el('div', 'callout warn', '<b class="ct">ग़लत। सही उत्तर: ' + c.opts[c.ans] + '</b>' + c.ex));
          }
        });
        optsEl.appendChild(b2);
      });
    }
    choose(BEEP_CASES[0], casesBox.children[0]);
  };

  /* =================================================================
     4) बूट सीक्वेंस सिम्युलेटर
     ================================================================= */
  var BOOT_STEPS = [
    { t: '1 · AC प्लग + Standby', d: 'SMPS +5VSB स्टैंडबाय वोल्टेज देता है। मदरबोर्ड का चिपसेट जागता है और पावर बटन का इंतज़ार करता है। LED स्टैंडबाय जलती है।' },
    { t: '2 · पावर बटन → PS_ON', d: 'बटन दबाते ही मदरबोर्ड हरे PS_ON तार को Ground करता है। SMPS पूरी बिजली (+12V, +5V, +3.3V) देने लगता है।' },
    { t: '3 · PWR_OK सिग्नल', d: 'SMPS स्लेटी (PWR_OK) तार से बताता है “वोल्टेज स्थिर है”। अब CPU को रीसेट से छोड़ा जाता है।' },
    { t: '4 · CPU Reset Vector', d: 'CPU अपना पहला निर्देश BIOS चिप से लेता है — यह पता हमेशा तय होता है (FFFF0h)।' },
    { t: '5 · POST शुरू', d: 'Power On Self Test — CPU, कैश, RAM, चिपसेट, टाइमर, GPU, कीबोर्ड की जाँच। गड़बड़ी मिली तो बीप कोड या Q-LED।' },
    { t: '6 · RAM की गिनती', d: 'BIOS RAM का साइज़ नापता है और स्क्रीन पर “Memory Test” संख्या दिखाता है।' },
    { t: '7 · BIOS सेटिंग लोड', d: 'CMOS से तारीख, समय, बूट ऑर्डर, RAM प्रोफ़ाइल पढ़ी जाती है। बैटरी ख़त्म हो तो डिफ़ॉल्ट + समय माँगेगा।' },
    { t: '8 · डिवाइस इनिशियलाइज़', d: 'PCIe कार्ड, SATA/M.2 कंट्रोलर और USB कंट्रोलर चालू होते हैं। GPU से पहली तस्वीर — मेकर लोगो दिखता है।' },
    { t: '9 · बूट ऑर्डर स्कैन', d: 'BIOS तय क्रम में बूटेबल डिवाइस ढूँढता है: NVMe SSD → SATA SSD → USB → नेटवर्क।' },
    { t: '10 · बूटलोडर', d: 'चुनी हुई डिस्क से बूटलोडर (Windows Boot Manager / GRUB) RAM में लोड होता है और चलता है।' },
    { t: '11 · कर्नेल व ड्राइवर', d: 'ऑपरेटिंग सिस्टम का कर्नेल लोड होता है, ड्राइवर चलते हैं, सर्विसेज़ शुरू होती हैं।' },
    { t: '12 · लॉगिन स्क्रीन', d: 'Windows/Linux का लॉगिन आता है। यहाँ तक पहुँचना = हार्डवेयर पूरी तरह ठीक। 🎉' }
  ];

  SIM.boot = function (host) {
    var playBtn = el('button', 'v-btn', '▶ चलाइए');
    var shell = simShell(host, '⏻', 'बूट सीक्वेंस सिम्युलेटर',
      'पावर बटन दबाने से लॉगिन स्क्रीन तक — 12 चरण, एक-एक करके।', playBtn);
    var grid = el('div', 'sim-grid');
    grid.style.gridTemplateColumns = '1fr 1fr';
    var flow = el('div', 'boot-flow');
    var side = el('div', 'sim-panel');
    side.innerHTML = '<h5>अभी क्या हो रहा है?</h5><div class="boot-cur" style="font-size:14.6px">▶ चलाइए दबाकर शुरू कीजिए।</div>' +
      '<div class="callout info" style="margin-top:14px"><b class="ct">याद रखने योग्य</b> POST हमेशा ऑपरेटिंग सिस्टम लोड होने से <b>पहले</b> चलता है। बीप/कोई आवाज़ न आना भी एक जानकारी है।</div>';
    BOOT_STEPS.forEach(function (s, i) {
      var d = el('div', 'bf', '<span class="bf-n">' + (i + 1) + '</span><div><h5>' + s.t + '</h5><p>' + s.d + '</p></div>');
      d.addEventListener('click', function () { show(i); });
      flow.appendChild(d);
    });
    grid.appendChild(flow); grid.appendChild(side);
    shell.body.appendChild(grid);
    var idx = -1, timer = null;
    function show(i) {
      idx = i;
      Array.prototype.forEach.call(flow.children, function (c, k) { c.classList.toggle('on', k <= i); });
      side.querySelector('.boot-cur').innerHTML = '<b style="color:var(--accent2)">' + BOOT_STEPS[i].t + '</b><br>' + BOOT_STEPS[i].d;
      flow.children[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    function stop() { if (timer) clearInterval(timer); timer = null; playBtn.textContent = '▶ चलाइए'; playBtn.classList.remove('on'); }
    playBtn.addEventListener('click', function () {
      if (timer) { stop(); return; }
      playBtn.textContent = '⏸ रोकिए'; playBtn.classList.add('on');
      if (idx >= BOOT_STEPS.length - 1) idx = -1;
      show(idx + 1);
      timer = setInterval(function () {
        if (idx >= BOOT_STEPS.length - 1) { stop(); playBeeps([[900, 120]]); return; }
        show(idx + 1);
      }, 2200);
    });
    show(0);
  };

  /* =================================================================
     5) फ़ॉल्ट फाइंडर सिम्युलेटर
     ================================================================= */
  var CHECKS = [
    { id: 'ac', name: 'AC प्लग व सॉकेट जाँचा' },
    { id: 'switch', name: 'SMPS का I/O स्विच जाँचा' },
    { id: 'p24', name: '24-pin कनेक्टर दबाकर बैठाया' },
    { id: 'cpu8', name: 'CPU 8-pin पावर जाँचा' },
    { id: 'ram', name: 'RAM निकालकर साफ़ करके दोबारा लगाई' },
    { id: 'gpu', name: 'GPU निकालकर/दबाकर बैठाया' },
    { id: 'mon', name: 'मॉनिटर केबल व इनपुट स्रोत जाँचा' },
    { id: 'sata', name: 'SATA डेटा व पावर केबल जाँचे' },
    { id: 'cmos', name: 'CMOS क्लियर किया' },
    { id: 'boot', name: 'BIOS में बूट ऑर्डर जाँचा' },
    { id: 'temp', name: 'तापमान व फैन जाँचे' },
    { id: 'psu', name: 'दूसरा SMPS लगाकर परखा' }
  ];
  var FAULTS = [
    {
      id: 'f1', title: 'PC पूरी तरह डेड', symptom: 'पावर बटन दबाने पर कोई LED नहीं, कोई फैन नहीं, कोई बीप नहीं।',
      clues: {
        ac: '❌ AC प्लग सॉकेट में ठीक से नहीं लगा था — प्लग लगाया पर अब भी कुछ नहीं।',
        switch: '⚠️ SMPS का पीछे वाला I/O स्विच OFF (O) था! ON (I) कर दिया।',
        p24: '✔️ 24-pin ठीक लगा है।', cpu8: '✔️ CPU 8-pin ठीक है।',
        ram: '— अभी ज़रूरत नहीं।', psu: '✔️ दूसरा SMPS भी वही व्यवहार — समस्या SMPS में नहीं।'
      },
      opts: ['SMPS का I/O स्विच OFF था / AC कनेक्शन', 'RAM ख़राब है', 'Windows ख़राब हो गया', 'GPU जल गया'],
      ans: 0, cost: ['switch', 'ac'],
      ex: 'सबसे पहले और सबसे सस्ती जाँच — AC प्लग और SMPS का I/O स्विच। यही 20% केस में पूरी समस्या होती है, इसलिए टूल खोलने से पहले यही देखिए।'
    },
    {
      id: 'f2', title: 'फैन चलते हैं, स्क्रीन काली', symptom: 'पावर LED जलती है, CPU फैन घूमता है, पर मॉनिटर पर “No Signal” और कोई बीप नहीं।',
      clues: {
        ac: '✔️ AC ठीक है।', switch: '✔️ स्विच ON है।',
        p24: '✔️ 24-pin मज़बूती से लगा है।',
        cpu8: '❌ CPU का 8-pin कनेक्टर हल्का ढीला था — दबाकर पूरा बैठाया।',
        ram: '✔️ RAM दोनों स्लॉट में ठीक बैठी है।',
        gpu: '✔️ GPU सही लगा है।',
        mon: '✔️ मॉनिटर केबल GPU के पोर्ट में है, इनपुट स्रोत HDMI चुना है।'
      },
      opts: ['SATA केबल ख़राब', 'CPU 8-pin पावर ढीला था', 'RAM ख़राब है', 'मॉनिटर जल गया'],
      ans: 1, cost: ['cpu8'],
      ex: 'बहुत आम केस! 24-pin लगा होने पर बोर्ड चालू दिखता है, पर CPU को अलग पावर न मिले तो वह काम ही नहीं करता — न स्क्रीन, न बीप। हमेशा CPU 8-pin ज़रूर जाँचिए।'
    },
    {
      id: 'f3', title: 'बीप के साथ ब्लैक स्क्रीन', symptom: 'लगातार 3 छोटी बीप के बाद स्क्रीन काली रहती है।',
      clues: {
        ac: '✔️ पावर ठीक।', p24: '✔️ 24-pin ठीक।', cpu8: '✔️ 8-pin ठीक।',
        ram: '❌ RAM का एक सिरा क्लिप में पूरा नहीं बैठा था; निकालकर कॉन्टैक्ट साफ़ करके दोबारा लगाया।',
        gpu: '✔️ GPU ठीक है।', cmos: '✔️ CMOS क्लियर करने की ज़रूरत नहीं पड़ी।'
      },
      opts: ['हार्ड डिस्क ख़राब', 'RAM ठीक से नहीं बैठी थी', 'CPU जल गया', 'BIOS ख़राब है'],
      ans: 1, cost: ['ram'],
      ex: '3 बीप = बेस 64K मेमोरी फेल। RAM की क्लिप दोनों तरफ़ बंद होनी चाहिए और क्लिक की आवाज़ आनी चाहिए। एक-एक स्टिक से भी जाँचिए।'
    },
    {
      id: 'f4', title: 'लगातार रीस्टार्ट', symptom: 'PC चालू होकर लोगो तक आता है, फिर अचानक रीस्टार्ट — बार-बार।',
      clues: {
        p24: '✔️ 24-pin ठीक।', cpu8: '✔️ 8-pin ठीक।',
        temp: '❌ BIOS में CPU तापमान 96°C दिख रहा है! कूलर लगा है पर थर्मल पेस्ट सूखा था।',
        ram: '✔️ RAM ठीक है।', psu: '✔️ दूसरे SMPS से भी रीस्टार्ट लूप जारी — SMPS दोषी नहीं।',
        cmos: '✔️ CMOS क्लियर से फ़र्क़ नहीं पड़ा।'
      },
      opts: ['थर्मल पेस्ट सूखा / ओवरहीटिंग', 'इंटरनेट की समस्या', 'माउस ख़राब', 'डिस्क फुल'],
      ans: 0, cost: ['temp'],
      ex: 'तापमान 95–100°C पहुँचते ही CPU ख़ुद को बचाने के लिए शटडाउन कर देता है — यही रीस्टार्ट लूप बनता है। पेस्ट बदलिए, कूलर साफ़ कीजिए।'
    },
    {
      id: 'f5', title: '“Operating system not found”', symptom: 'POST ठीक होता है, पर लिखा आता है — Operating System not found.',
      clues: {
        sata: '❌ HDD का SATA डेटा केबल ढीला था, और पावर कनेक्टर भी आधा लगा था — दोनों ठीक किए।',
        boot: '⚠️ बूट ऑर्डर में पहले USB रखा हुआ था (पेनड्राइव निकली हुई) — SSD पहले किया।',
        ram: '✔️ RAM ठीक।', cmos: '✔️ CMOS ठीक।'
      },
      opts: ['SATA केबल/पावर ढीला + बूट ऑर्डर ग़लत', 'CPU जल गया', 'मॉनिटर ख़राब', 'RAM बढ़ाना है'],
      ans: 0, cost: ['sata', 'boot'],
      ex: '“OS not found” का मतलब है BIOS ने बूटेबल डिवाइस नहीं पाया। पहले डिस्क डिटेक्ट हो रही है या नहीं देखिए (BIOS में), फिर बूट ऑर्डर।'
    },
    {
      id: 'f6', title: 'बहुत धीमा चलना', symptom: 'Windows खुलने में 5 मिनट, हर क्लिक पर फ़्रिज, HDD लाइट लगातार जलती रहती है।',
      clues: {
        ram: '⚠️ RAM सिर्फ़ 2 GB है और 1.8 GB भरा हुआ — कम मेमोरी के कारण स्वैपिंग।',
        sata: '❌ डिस्क का SMART बताता है कई बैड सेक्टर — डिस्क बूढ़ी हो गई है।',
        temp: '⚠️ CPU 88°C पर थ्रॉटल कर रहा है — धूल भरे कूलर की सफ़ाई ज़रूरी।',
        psu: '✔️ वोल्टेज ठीक।', gpu: '— ज़रूरत नहीं।'
      },
      opts: ['पुरानी HDD + कम RAM + गर्मी (सभी एक साथ)', 'सिर्फ़ वायरस', 'मॉनिटर ख़राब', 'कीबोर्ड ख़राब'],
      ans: 0, cost: ['sata', 'ram', 'temp'],
      ex: 'धीमेपन के तीन बड़े कारण — पुरानी/ख़राब HDD, कम RAM, और ओवरहीट। SSD + 8 GB RAM + सफ़ाई, तीनों से PC नया जैसा हो जाता है।'
    }
  ];

  SIM.fault = function (host) {
    var pick = el('select', 'v-btn');
    pick.style.maxWidth = '260px';
    FAULTS.forEach(function (f, i) {
      var o = document.createElement('option'); o.value = i; o.textContent = f.title; pick.appendChild(o);
    });
    var shell = simShell(host, '🧯', 'फ़ॉल्ट फाइंडर सिम्युलेटर',
      'लक्षण पढ़िए, जाँच (checks) कीजिए, फिर निदान चुनिए — कम जाँच में सही जवाब = बेहतर इंजीनियर।', pick);
    var grid = el('div', 'sim-grid');
    grid.style.gridTemplateColumns = '1fr 1fr';
    var left = el('div');
    var right = el('div');
    grid.appendChild(left); grid.appendChild(right);
    shell.body.appendChild(grid);

    var symCard = el('div', 'callout warn');
    left.appendChild(symCard);
    left.appendChild(el('h4', 'blk2', 'जाँच कीजिए (जितनी कम, उतना अच्छा)'));
    var chkBox = el('div', 'cards');
    chkBox.style.gridTemplateColumns = 'repeat(auto-fit,minmax(180px,1fr))';
    left.appendChild(chkBox);
    var logP = el('div', 'sim-panel');
    logP.innerHTML = '<h5>जाँच लॉग</h5>';
    var log = el('div', 'log');
    logP.appendChild(log);
    right.appendChild(logP);
    right.appendChild(el('h4', 'blk2', 'निदान चुनिए'));
    var optsBox = el('div', 'opt-list');
    right.appendChild(optsBox);
    var resBox = el('div');
    right.appendChild(resBox);

    var cur = FAULTS[0], used = 0, solved = false;
    function render(i) {
      cur = FAULTS[i]; used = 0; solved = false;
      symCard.innerHTML = '<b class="ct">लक्षण: ' + cur.title + '</b>' + cur.symptom;
      log.innerHTML = ''; optsBox.innerHTML = ''; resBox.innerHTML = '';
      chkBox.innerHTML = '';
      CHECKS.forEach(function (c) {
        var b = el('button', 'opt', c.name);
        b.addEventListener('click', function () {
          if (b.dataset.on) return;
          b.dataset.on = '1';
          b.style.borderColor = 'var(--accent2)';
          b.style.background = 'var(--surface2)';
          used++;
          var txt = cur.clues[c.id] || '✔️ यह जाँच सामान्य रही — समस्या यहाँ नहीं।';
          logLine(log, txt, txt.indexOf('❌') === 0 ? 'no' : txt.indexOf('⚠️') === 0 ? 'wr' : 'ok');
          var bad = txt.indexOf('❌') === 0 || txt.indexOf('⚠️') === 0;
          if (bad) hinted = true;
        });
        chkBox.appendChild(b);
      });
      var hinted = false;
      logLine(log, 'लक्षण दर्ज हुआ — अब बाईं तरफ़ से जाँच शुरू कीजिए।', 'in');
      cur.opts.forEach(function (o, ix) {
        var b2 = el('button', 'opt', o);
        b2.addEventListener('click', function () {
          if (solved) return;
          solved = true;
          Array.prototype.forEach.call(optsBox.children, function (x, k) {
            if (k === cur.ans) x.classList.add('ok');
            else if (k === ix) x.classList.add('no');
          });
          var ok = ix === cur.ans;
          var eff = used <= 3 ? '🏆 बहुत बढ़िया (कम जाँच)' : used <= 6 ? '👍 ठीक' : '🐢 थोड़ी ज़्यादा जाँच';
          resBox.appendChild(el('div', 'callout ' + (ok ? 'tip' : 'warn'),
            '<b class="ct">' + (ok ? 'सही निदान! ✔' : 'ग़लत — सही उत्तर: ' + cur.opts[cur.ans]) + '</b>' +
            cur.ex + '<br><br><b>जाँच की संख्या: ' + used + '</b> — ' + eff));
        });
        optsBox.appendChild(b2);
      });
    }
    pick.addEventListener('change', function () { render(parseInt(pick.value, 10)); });
    render(0);
  };

})();

