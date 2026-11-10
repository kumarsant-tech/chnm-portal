
/* =====================================================================
   कंप्यूटर लैब  ·  sim-assembly.js
   पूरा इंटरैक्टिव PC असेंबली सिम्युलेटर (SIM.assembly ओवरराइट करता है)
   क्रम: मदरबोर्ड → कैबिनेट → पुर्ज़ा → तार जोड़ना → SMPS पावर → पावर ऑन
   ===================================================================== */
(function () {
  'use strict';
  var SIM = window.CL_SIM = window.CL_SIM || {};

  /* ---------------- साझा हेल्पर ---------------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function logLine(log, txt, kind) {
    var d = el('div', kind || '');
    d.textContent = txt;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }
  var _ac = null;
  function playBeeps(seq) {
    try {
      if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
      if (_ac.state === 'suspended') _ac.resume();
      var at = _ac.currentTime + 0.06;
      seq.forEach(function (s) {
        var o = _ac.createOscillator(), g = _ac.createGain();
        o.type = 'square'; o.frequency.value = s[0];
        g.gain.setValueAtTime(0.12, at);
        g.gain.exponentialRampToValueAtTime(0.001, at + s[1] / 1000);
        o.connect(g); g.connect(_ac.destination);
        o.start(at); o.stop(at + s[1] / 1000);
        at += s[1] / 1000 + 0.06;
      });
    } catch (e) {}
  }

  /* =================================================================
     डेटा
     ================================================================= */
  var MOTHERBOARDS = [
    { id: 'mb-basic', name: 'बेसिक ATX (LGA1700)', ico: '🟩', form: 'ATX', socket: 'LGA1700', ddr: 'DDR4', ramSlots: 4, m2: 2, sata: 4, desc: 'ऑफ़िस/होम के लिए — i5-12400F सॉकेट, DDR4, 2x M.2' },
    { id: 'mb-game', name: 'गेमिंग ATX (LGA1700)', ico: '🟪', form: 'ATX', socket: 'LGA1700', ddr: 'DDR5', ramSlots: 4, m2: 3, sata: 4, desc: 'गेमिंग के लिए — DDR5, 3x M.2, RGB, बेहतर VRM' },
    { id: 'mb-budget', name: 'बजट mATX (AM4)', ico: '🟦', form: 'mATX', socket: 'AM4', ddr: 'DDR4', ramSlots: 2, m2: 1, sata: 4, desc: 'कम कीमत — Ryzen 5 5600X सॉकेट, DDR4, 2 RAM स्लॉट' },
    { id: 'mb-office', name: 'ऑफ़िस ATX (LGA1200)', ico: '⬜', form: 'ATX', socket: 'LGA1200', ddr: 'DDR4', ramSlots: 4, m2: 2, sata: 4, desc: 'पुराना प्लेटफ़ॉर्म — i5-10400F सॉकेट, DDR4, 2x M.2' }
  ];
  var CABINETS = [
    { id: 'case-basic', name: 'बेसिक टावर', ico: '🗄️', form: 'ATX', fans: 2, desc: 'ATX/mATX बोर्ड, 2x 120mm फैन, साधारण' },
    { id: 'case-game', name: 'गेमिंग केस (RGB)', ico: '🖥️', form: 'ATX', fans: 4, desc: 'ATX, 4x RGB फैन, टेम्पर्ड ग्लास, बेहतर एयरफ़्लो' },
    { id: 'case-compact', name: 'कॉम्पैक्ट mATX', ico: '📦', form: 'mATX', fans: 1, desc: 'mATX/ITX बोर्ड, 1x फैन, छोटा आकार' }
  ];
  var CPUS = [
    { id: 'cpu-i5-12400', name: 'Intel i5-12400F', ico: '🔲', socket: 'LGA1700', tdp: 65, recPsu: 450 },
    { id: 'cpu-i7-12700', name: 'Intel i7-12700F', ico: '🔲', socket: 'LGA1700', tdp: 65, recPsu: 550 },
    { id: 'cpu-i9-12900', name: 'Intel i9-12900K', ico: '🔲', socket: 'LGA1700', tdp: 125, recPsu: 750 },
    { id: 'cpu-r5-5600', name: 'AMD Ryzen 5 5600X', ico: '🔲', socket: 'AM4', tdp: 65, recPsu: 450 },
    { id: 'cpu-i5-10400', name: 'Intel i5-10400F', ico: '🔲', socket: 'LGA1200', tdp: 65, recPsu: 400 }
  ];
  var RAMS = [
    { id: 'ram-d4-8', name: 'DDR4 8GB 3200MHz', ico: '📏', ddr: 'DDR4', size: '8GB' },
    { id: 'ram-d4-16', name: 'DDR4 16GB 3200MHz', ico: '📏', ddr: 'DDR4', size: '16GB' },
    { id: 'ram-d5-16', name: 'DDR5 16GB 5200MHz', ico: '📏', ddr: 'DDR5', size: '16GB' },
    { id: 'ram-d5-32', name: 'DDR5 32GB 5200MHz', ico: '📏', ddr: 'DDR5', size: '32GB' }
  ];
  var SSDS = [
    { id: 'ssd-sata-256', name: 'SATA SSD 256GB', ico: '💽', type: 'SATA', size: '256GB' },
    { id: 'ssd-sata-512', name: 'SATA SSD 512GB', ico: '💽', type: 'SATA', size: '512GB' },
    { id: 'ssd-m2-512', name: 'M.2 NVMe 512GB', ico: '⚡', type: 'M.2', size: '512GB' },
    { id: 'ssd-m2-1tb', name: 'M.2 NVMe 1TB', ico: '⚡', type: 'M.2', size: '1TB' }
  ];
  var CDS = [
    { id: 'cd-dvd', name: 'DVD राइटर (SATA)', ico: '💿', type: 'SATA' },
    { id: 'cd-none', name: 'CD ड्राइव नहीं', ico: '🚫', type: 'none' }
  ];
  var PSUS = [
    { id: 'psu-400', name: 'SMPS 400W (सस्ता)', ico: '🔌', watts: 400 },
    { id: 'psu-450', name: 'SMPS 450W 80+', ico: '🔌', watts: 450 },
    { id: 'psu-550', name: 'SMPS 550W 80+ Bronze', ico: '🔌', watts: 550 },
    { id: 'psu-650', name: 'SMPS 650W 80+ Bronze', ico: '🔌', watts: 650 },
    { id: 'psu-750', name: 'SMPS 750W 80+ Gold', ico: '🔌', watts: 750 }
  ];
  var LANS = [
    { id: 'lan-onboard', name: 'ऑनबोर्ड LAN (RJ45)', ico: '🌐', type: 'onboard' },
    { id: 'lan-pcie', name: 'PCIe LAN कार्ड 1Gbps', ico: '🌐', type: 'pcie' },
    { id: 'lan-wifi', name: 'PCIe Wi-Fi + LAN कार्ड', ico: '📶', type: 'pcie' }
  ];
  var WIRES = [
    { id: 'w24', name: '24-pin ATX पावर', ico: '🟨', from: 'SMPS', to: 'मदरबोर्ड', color: 'पीला/काला', must: true },
    { id: 'w8', name: '8-pin CPU पावर', ico: '🟧', from: 'SMPS', to: 'मदरबोर्ड (CPU पास)', color: 'पीला/काला', must: true },
    { id: 'wsata', name: 'SATA डेटा', ico: '🟦', from: 'मदरबोर्ड', to: 'SSD/HDD/CD', color: 'नीला', must: true },
    { id: 'wsatap', name: 'SATA पावर', ico: '🟫', from: 'SMPS', to: 'SSD/HDD/CD', color: 'काला', must: true },
    { id: 'wpcie', name: 'PCIe पावर (GPU)', ico: '🟪', from: 'SMPS', to: 'GPU', color: 'पीला/काला', must: false },
    { id: 'wfp', name: 'फ्रंट पैनल (PWR_SW/LED)', ico: '🎛️', from: 'मदरबोर्ड', to: 'केस फ्रंट', color: 'हरा/लाल', must: true },
    { id: 'wlan', name: 'LAN केबल (RJ45)', ico: '🌐', from: 'मदरबोर्ड', to: 'राउटर', color: 'नीला', must: false }
  ];

  /* =================================================================
     सिम्युलेटर कोर — event delegation के साथ
     ================================================================= */
  SIM.assembly = function (host) {
    var state = {
      mb: null, caseId: null,
      cpu: null, ram: null, ssd: null, cd: null, psu: null, lan: null,
      wires: {}, acPlug: false, psuSwitch: false, powered: false
    };

    var shell = el('div', 'sim asm-shell');
    host.appendChild(shell);

    var left = el('div', 'sim-panel asm-left');
    shell.appendChild(left);

    var right = el('div', 'asm-right');
    shell.appendChild(right);

    var stage = el('div', 'asm-stage');
    right.appendChild(stage);

    var logPanel = el('div', 'sim-panel');
    logPanel.style.margin = '0';
    logPanel.innerHTML = '<h5>प्रक्रिया लॉग</h5>';
    var log = el('div', 'log');
    logPanel.appendChild(log);
    right.appendChild(logPanel);

    /* ---- हेल्पर ---- */
    function mbOf(id) { for (var i = 0; i < MOTHERBOARDS.length; i++) if (MOTHERBOARDS[i].id === id) return MOTHERBOARDS[i]; }
    function cpuOf(id) { for (var i = 0; i < CPUS.length; i++) if (CPUS[i].id === id) return CPUS[i]; }
    function ramOf(id) { for (var i = 0; i < RAMS.length; i++) if (RAMS[i].id === id) return RAMS[i]; }
    function ssdOf(id) { for (var i = 0; i < SSDS.length; i++) if (SSDS[i].id === id) return SSDS[i]; }
    function psuOf(id) { for (var i = 0; i < PSUS.length; i++) if (PSUS[i].id === id) return PSUS[i]; }
    function lanOf(id) { for (var i = 0; i < LANS.length; i++) if (LANS[i].id === id) return LANS[i]; }

    /* ---- सेक्शन बिल्डर ---- */
    function sec(title) {
      var s = el('div', 'asm-sec');
      s.innerHTML = '<h5>' + title + '</h5>';
      left.appendChild(s);
      return s;
    }
    function note(parent, txt) {
      var p = el('p');
      p.style.cssText = 'font-size:12.6px;color:var(--muted);margin:0 0 10px';
      p.textContent = txt;
      parent.appendChild(p);
    }
    function pickCard(parent, item, key, sub) {
      var card = el('div', 'card');
      card.style.cssText = 'cursor:pointer';
      card.dataset.pick = key;
      card.dataset.id = item.id;
      var on = state[key] === item.id;
      card.innerHTML = '<div style="font-weight:600;font-size:13px">' + item.ico + ' ' + item.name +
        (on ? ' <span style="color:var(--good);font-size:11px">✔ चुना</span>' : '') + '</div>' +
        '<div style="font-size:11.5px;color:var(--muted)">' + (sub || '') + '</div>';
      if (on) { card.style.borderColor = 'var(--good)'; card.style.background = 'rgba(34,197,94,.08)'; }
      parent.appendChild(card);
    }
    function group(parent, title, items, key, filter, subFn) {
      var h = el('h4', 'blk2');
      h.textContent = title;
      h.style.margin = '10px 0 6px';
      parent.appendChild(h);
      var list = el('div');
      list.style.cssText = 'display:grid;gap:6px';
      var shown = 0;
      items.forEach(function (it) {
        if (filter && !filter(it)) return;
        pickCard(list, it, key, subFn ? subFn(it) : (it.socket || it.ddr || it.type || ''));
        shown++;
      });
      if (!shown) note(parent, 'कोई विकल्प नहीं — पहले मदरबोर्ड चुनिए।');
      parent.appendChild(list);
    }

    /* ---- दाईं तरफ़: लाइव PC निर्माण दृश्य ---- */
    function drawStage() {
      var mb = mbOf(state.mb), cpu = cpuOf(state.cpu), ram = ramOf(state.ram),
        ssd = ssdOf(state.ssd), psu = psuOf(state.psu);
      var C = { panel: '#122036', line: '#2a3b57', ac: '#38bdf8', good: '#22c55e',
        warn: '#f59e0b', mut: '#475569', tx: '#cbd5e1', dim: '#7c8aa3' };
      function r(x, y, w, h, fill, stroke, dash) {
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + fill +
          '" stroke="' + stroke + '" stroke-width="1.6"' + (dash ? ' stroke-dasharray="5 4"' : '') + '/>';
      }
      function tx(x, y, s, fill, size, anchor) {
        return '<text x="' + x + '" y="' + y + '" fill="' + (fill || C.tx) + '" font-size="' + (size || 11) +
          '" text-anchor="' + (anchor || 'start') + '" font-family="Noto Sans Devanagari, sans-serif">' + s + '</text>';
      }
      function dot(x, y, c) { return '<circle cx="' + x + '" cy="' + y + '" r="3.2" fill="' + c + '"/>'; }

      var s = [];
      s.push('<svg viewBox="0 0 520 350" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">');
      s.push(r(0, 0, 520, 350, '#0a1020', 'none'));

      /* केस */
      s.push(r(20, 18, 320, 314, '#0d1729', state.caseId ? C.ac : C.line, !state.caseId));
      s.push(tx(32, 38, state.caseId ? '🗄️ कैबिनेट तैयार' : 'कैबिनेट — चुनिए', state.caseId ? C.tx : C.dim, 11));
      /* केस फ्रंट: ड्राइव बे + फ्रंट पैनल */
      s.push(r(30, 150, 70, 150, '#0b1424', C.line));
      s.push(r(36, 176, 58, 34, ssd ? '#12361f' : '#0b1424', ssd ? C.good : C.line, !ssd));
      s.push(tx(65, 197, 'ड्राइव', ssd ? C.good : C.dim, 9, 'middle'));
      s.push(r(36, 246, 58, 24, state.wires.wfp ? '#12361f' : '#0b1424', state.wires.wfp ? C.good : C.line, !state.wires.wfp));
      s.push(tx(65, 262, 'PWR_SW', state.wires.wfp ? C.good : C.dim, 8, 'middle'));
      /* मदरबोर्ड */
      s.push(r(120, 44, 200, 160, mb ? '#10233b' : '#0b1424', mb ? C.ac : C.line, !mb));
      s.push(tx(220, 62, mb ? ('🧩 ' + mb.socket + ' · ' + mb.ddr) : 'मदरबोर्ड — चुनिए', mb ? C.tx : C.dim, 10.5, 'middle'));
      /* CPU सॉकेट */
      s.push(r(140, 74, 54, 52, cpu ? '#12361f' : '#0b1424', cpu ? C.good : C.line, !cpu));
      s.push(tx(167, 104, cpu ? 'CPU ✔' : 'CPU', cpu ? C.good : C.dim, 10, 'middle'));
      /* RAM स्लॉट */
      var slots = mb ? mb.ramSlots : 4;
      for (var i = 0; i < slots; i++) {
        var filled = !!ram && i < 2;
        s.push(r(212 + i * 22, 74, 14, 74, filled ? '#12361f' : '#0b1424', filled ? C.good : C.line, !filled));
      }
      s.push(tx(258, 160, ram ? (ram.ddr + ' ' + ram.size) : 'RAM', ram ? C.good : C.dim, 9.5, 'middle'));
      /* M.2 / SSD */
      s.push(r(140, 138, 120, 13, (ssd && ssd.type === 'M.2') ? '#12361f' : '#0b1424', (ssd && ssd.type === 'M.2') ? C.good : C.line, !(ssd && ssd.type === 'M.2')));
      s.push(tx(220, 170, ssd ? ('💽 ' + ssd.name) : 'स्टोरेज — चुनिए', ssd ? C.tx : C.dim, 9.5, 'middle'));
      /* GPU */
      s.push(r(150, 184, 130, 15, state.wires.wpcie ? '#221a33' : '#0b1424', state.wires.wpcie ? '#a855f7' : C.line, !state.wires.wpcie));
      /* SMPS */
      s.push(r(150, 244, 150, 60, state.psuSwitch ? '#16281a' : '#0b1424', psu ? C.ac : C.line, !psu));
      s.push(tx(225, 266, psu ? ('🔌 ' + psu.watts + 'W SMPS') : 'SMPS — चुनिए', psu ? C.tx : C.dim, 10, 'middle'));
      s.push(tx(225, 284, state.psuSwitch ? '⏻ स्विच ON' : (state.acPlug ? 'AC लगा · स्विच OFF' : 'AC नहीं लगा'), state.psuSwitch ? C.good : C.dim, 9.5, 'middle'));
      /* AC प्लग */
      s.push(r(310, 252, 24, 20, state.acPlug ? '#12361f' : '#0b1424', state.acPlug ? C.good : C.line, !state.acPlug));
      s.push(tx(322, 266, state.acPlug ? '⚡' : 'AC', state.acPlug ? C.good : C.dim, 9, 'middle'));

      /* तार */
      var WCOL = { w24: '#eab308', w8: '#f97316', wsata: '#3b82f6', wsatap: '#9ca3af', wpcie: '#a855f7', wfp: '#22c55e', wlan: '#06b6d4' };
      function wire(x1, y1, x2, y2, id) {
        var on = !!state.wires[id], col = on ? WCOL[id] : C.mut;
        var cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + 20;
        s.push('<path d="M' + x1 + ' ' + y1 + ' Q' + cx + ' ' + cy + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="' + col +
          '" stroke-width="' + (on ? 2.6 : 1.5) + '"' + (on ? '' : ' stroke-dasharray="4 4" opacity="0.5"') + '/>');
        if (on) { s.push(dot(x1, y1, col)); s.push(dot(x2, y2, col)); }
      }
      wire(180, 250, 230, 210, 'w24');
      wire(165, 250, 170, 102, 'w8');
      wire(215, 152, 100, 195, 'wsata');
      wire(160, 262, 100, 262, 'wsatap');
      wire(200, 250, 205, 200, 'wpcie');
      wire(140, 190, 95, 252, 'wfp');
      wire(305, 92, 350, 74, 'wlan');
      /* LAN पोर्ट */
      s.push(r(340, 82, 72, 26, state.wires.wlan ? '#12361f' : '#0b1424', state.wires.wlan ? C.good : C.line, !state.wires.wlan));
      s.push(tx(376, 99, '🌐 LAN', state.wires.wlan ? C.good : C.dim, 9.5, 'middle'));

      /* पावर LED */
      if (state.powered) {
        s.push('<circle cx="330" cy="42" r="6" fill="' + C.good + '"><animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite"/></circle>');
        s.push(tx(344, 46, 'चालू', C.good, 11));
      }
      s.push('</svg>');
      stage.innerHTML = s.join('');
    }

    /* ---- रेंडर (पहले क्लियर, फिर सब जोड़े) ---- */
    function render() {
      left.innerHTML = '';
      // 1. मदरबोर्ड
      var s1 = sec('चरण 1/6 · मदरबोर्ड चुनिए');
      note(s1, 'सबसे पहले मदरबोर्ड चुनिए — बाक़ी सब इसी के हिसाब से मिलेगा।');
      MOTHERBOARDS.forEach(function (mb) {
        pickCard(s1, mb, 'mb', mb.desc + ' · ' + mb.socket + ' · ' + mb.ddr);
      });
      // 2. कैबिनेट
      var s2 = sec('चरण 2/6 · कैबिनेट चुनिए');
      var mb = mbOf(state.mb);
      note(s2, 'कैबिनेट का फ़ॉर्म फैक्टर मदरबोर्ड से मेल खाना चाहिए (' + (mb ? mb.form : 'ATX') + ')।');
      CABINETS.forEach(function (c) {
        var ok = !mb || c.form === 'ATX' || c.form === mb.form;
        var on = state.caseId === c.id;
        var card = el('div', 'card');
        card.style.cssText = 'cursor:pointer' + (ok ? '' : ';opacity:.45');
        card.dataset.pick = 'caseId';
        card.dataset.id = c.id;
        card.innerHTML = '<div style="font-weight:600;font-size:13px">' + c.ico + ' ' + c.name +
          (on ? ' <span style="color:var(--good);font-size:11px">✔ चुना</span>' : '') + '</div>' +
          '<div style="font-size:11.5px;color:var(--muted)">' + c.desc + '</div>' +
          '<div style="font-size:11.5px;color:var(--muted)">' + c.fans + 'x फैन · ' + c.form + '</div>';
        if (on) { card.style.borderColor = 'var(--good)'; card.style.background = 'rgba(34,197,94,.08)'; }
        s2.appendChild(card);
      });
      // 3. पुर्ज़ा
      var s3 = sec('चरण 3/6 · पुर्ज़ा चुनिए');
      if (!mb) { note(s3, 'पहले मदरबोर्ड चुनिए।'); }
      else {
        group(s3, 'CPU (' + mb.socket + ' सॉकेट)', CPUS, 'cpu', function (c) { return c.socket === mb.socket; }, function (c) { return 'TDP ' + c.tdp + 'W · कम-से-कम ' + c.recPsu + 'W SMPS'; });
        group(s3, 'RAM (' + mb.ddr + ', ' + mb.ramSlots + ' स्लॉट)', RAMS, 'ram', function (r) { return r.ddr === mb.ddr; }, function (r) { return r.size + ' · ' + r.ddr; });
        group(s3, 'SSD (' + (mb.m2 > 0 ? 'M.2 + SATA' : 'सिर्फ़ SATA') + ')', SSDS, 'ssd', function (s) { return s.type === 'SATA' || mb.m2 > 0; }, function (s) { return s.size + ' · ' + s.type; });
        group(s3, 'CD ड्राइव', CDS, 'cd', null, null);
        group(s3, 'SMPS (पावर सप्लाई)', PSUS, 'psu', null, function (p) { return p.watts + 'W'; });
        group(s3, 'LAN / नेटवर्क', LANS, 'lan', null, null);
        // पावर जाँच
        var cpu = cpuOf(state.cpu), psu = psuOf(state.psu);
        if (cpu && psu) {
          var need = cpu.recPsu;
          var okP = psu.watts >= need;
          var info = el('div', 'callout ' + (okP ? 'tip' : 'warn'));
          info.style.margin = '10px 0 0';
          info.innerHTML = '<b class="ct">पावर जाँच</b>' + cpu.name + ' (TDP ' + cpu.tdp + 'W) के लिए कम-से-कम <b>' + need + 'W</b> वाला SMPS चाहिए। आपका: <b>' + psu.watts + 'W</b> — ' + (okP ? 'पर्याप्त ✔' : 'कम है ❌');
          s3.appendChild(info);
        }
      }
      // 4. तार
      var s4 = sec('चरण 4/6 · तार जोड़िए (लाइव)');
      note(s4, 'हर केबल को क्लिक करके जोड़िए। लाल = ज़रूरी, हरा = वैकल्पिक।');
      WIRES.forEach(function (w) {
        var done = !!state.wires[w.id];
        var row = el('div', 'card');
        row.style.cssText = 'cursor:pointer;display:flex;align-items:center;gap:8px';
        row.dataset.wire = w.id;
        row.innerHTML = '<span style="font-size:16px">' + (done ? '✅' : w.ico) + '</span>' +
          '<div style="flex:1"><div style="font-weight:600;font-size:13px">' + w.name + '</div>' +
          '<div style="font-size:11px;color:var(--muted)">' + w.from + ' → ' + w.to + ' · ' + w.color + (w.must ? ' · ज़रूरी' : ' · वैकल्पिक') + '</div></div>' +
          (done ? '<span style="color:var(--good);font-size:11px">जुड़ा ✔</span>' : '<span style="color:var(--warn);font-size:11px">बाक़ी</span>');
        if (done) row.style.borderColor = 'var(--good)';
        s4.appendChild(row);
      });
      // 5. SMPS पावर
      var s5 = sec('चरण 5/6 · SMPS को पावर दीजिए');
      note(s5, 'पहले AC प्लग लगाइए, फिर SMPS का स्विच ON कीजिए।');
      var plugBtn = el('button', 'v-btn' + (state.acPlug ? ' on' : ''), state.acPlug ? '🔌 AC प्लग लगा है' : '🔌 AC प्लग लगाइए');
      plugBtn.style.marginBottom = '8px';
      plugBtn.dataset.act = 'plug';
      s5.appendChild(plugBtn);
      var swBtn = el('button', 'v-btn' + (state.psuSwitch ? ' on' : ''), state.psuSwitch ? '⏻ SMPS स्विच: ON' : '⏻ SMPS स्विच: OFF');
      swBtn.dataset.act = 'sw';
      s5.appendChild(swBtn);
      // 6. पावर ऑन
      var s6 = sec('चरण 6/6 · पावर ऑन कीजिए');
      note(s6, 'सब तैयार होने पर पावर बटन दबाइए और देखिए — PC चले या नहीं।');
      var btn = el('button', 'v-btn', '⏻ पावर बटन दबाइए');
      btn.style.cssText = 'font-size:15px;padding:12px;margin-bottom:10px';
      btn.dataset.act = 'boot';
      s6.appendChild(btn);
      var resetBtn = el('button', 'v-btn', '↺ पूरा रीसेट');
      resetBtn.style.marginLeft = '6px';
      resetBtn.dataset.act = 'reset';
      s6.appendChild(resetBtn);

      drawStage();
    }

    /* ---- क्रियाएँ ---- */
    function doPlug() {
      state.acPlug = !state.acPlug;
      logLine(log, state.acPlug ? '🔌 AC प्लग लग गया — SMPS को 220V मिल रहा है' : '🔌 AC प्लग निकाल दिया', state.acPlug ? 'ok' : 'wr');
      render();
    }
    function doSwitch() {
      if (!state.acPlug) { logLine(log, '⚠️ पहले AC प्लग लगाइए — बिना 220V के स्विच काम नहीं करेगा', 'wr'); return; }
      state.psuSwitch = !state.psuSwitch;
      logLine(log, state.psuSwitch ? '⏻ SMPS चालू — 5VSB स्टैंडबाय रेल आ गई, पंखा घूम रहा है' : '⏻ SMPS बंद', state.psuSwitch ? 'ok' : 'wr');
      render();
    }
    function doReset() {
      state.mb = null; state.caseId = null; state.cpu = null; state.ram = null;
      state.ssd = null; state.cd = null; state.psu = null; state.lan = null;
      state.wires = {}; state.acPlug = false; state.psuSwitch = false; state.powered = false;
      var ob = document.getElementById('asm-bootmsg'); if (ob && ob.parentNode) ob.parentNode.removeChild(ob);
      log.innerHTML = '';
      logLine(log, 'रीसेट हो गया — फिर से शुरू कीजिए', 'in');
      render();
    }
    function doBoot() {
      var ob = document.getElementById('asm-bootmsg'); if (ob && ob.parentNode) ob.parentNode.removeChild(ob);
      state.powered = false;
      var mb2 = mbOf(state.mb), cpu = cpuOf(state.cpu), ram = ramOf(state.ram), ssd = ssdOf(state.ssd), psu = psuOf(state.psu);
      var problems = [];
      if (!mb2) problems.push('मदरबोर्ड नहीं चुनी');
      if (!state.caseId) problems.push('कैबिनेट नहीं चुना');
      if (!cpu) problems.push('CPU नहीं चुना');
      if (!ram) problems.push('RAM नहीं चुनी');
      if (!ssd) problems.push('SSD नहीं चुनी');
      if (!psu) problems.push('SMPS नहीं चुना');
      if (!state.acPlug) problems.push('AC प्लग नहीं लगा');
      if (!state.psuSwitch) problems.push('SMPS स्विच OFF है');
      WIRES.forEach(function (w) { if (w.must && !state.wires[w.id]) problems.push(w.name + ' नहीं जुड़ा'); });
      if (problems.length) {
        logLine(log, '❌ PC चालू नहीं हो सका — ये बाक़ी हैं:', 'no');
        problems.forEach(function (x) { logLine(log, '  • ' + x, 'wr'); });
        return;
      }
      var need = cpu.recPsu;
      if (psu.watts < need) {
        logLine(log, '❌ SMPS कमज़ोर (' + psu.watts + 'W < ' + need + 'W) — इतनी कम पावर में PC बूट नहीं होगा!', 'no');
        logLine(log, '💡 ' + cpu.name + ' के लिए कम-से-कम ' + need + 'W वाला SMPS लगाइए।', 'in');
        return;
      }
      state.powered = true;
      logLine(log, '⏻ पावर बटन दबाया — SMPS का पंखा घूम रहा है', 'ok');
      logLine(log, '🧠 POST शुरुआत... CPU: ' + cpu.name, 'in');
      logLine(log, '🧠 RAM जाँच: ' + ram.name + ' ✔', 'ok');
      logLine(log, '💽 डिस्क जाँच: ' + ssd.name + ' ✔', 'ok');
      var lan = lanOf(state.lan);
      logLine(log, '🌐 नेटवर्क: ' + (lan ? lan.name : 'ऑनबोर्ड LAN') + ' ✔', 'ok');
      logLine(log, '🔊 बीप! POST पास — BIOS स्क्रीन आ गई ✔', 'ok');
      logLine(log, '🎉 PC चालू हो गया! BIOS में सब पुर्ज़ा दिख रहे हैं।', 'ok');
      var b = el('div', 'callout tip');
      b.id = 'asm-bootmsg';
      b.innerHTML = '<b class="ct">बधाई हो!</b> पूरा सिस्टम सही से चल रहा है। अब BIOS में तारीख-समय सेट करें और बूट ऑर्डर चुनें।';
      right.appendChild(b);
      playBeeps([[880, 140]]);
      drawStage();
    }

    /* ---- इवेंट डेलिगेशन (एक ही बार, कभी नहीं मरता) ---- */
    left.addEventListener('click', function (e) {
      var t = e.target.closest('[data-pick],[data-wire],[data-act]');
      if (!t || !left.contains(t)) return;
      if (t.dataset.pick) {
        var key = t.dataset.pick, id = t.dataset.id;
        state[key] = id;
        var item = null;
        var arr = key === 'mb' ? MOTHERBOARDS : key === 'caseId' ? CABINETS : key === 'cpu' ? CPUS : key === 'ram' ? RAMS : key === 'ssd' ? SSDS : key === 'cd' ? CDS : key === 'psu' ? PSUS : LANS;
        for (var i = 0; i < arr.length; i++) if (arr[i].id === id) item = arr[i];
        if (key === 'mb') {
          state.cpu = null; state.ram = null; state.ssd = null; state.psu = null; state.lan = null; state.wires = {};
        }
        logLine(log, '✅ ' + (item ? item.name : id) + ' चुना गया', 'ok');
        render();
      } else if (t.dataset.wire) {
        var wid = t.dataset.wire;
        if (state.wires[wid]) { logLine(log, 'ℹ️ पहले ही जुड़ा है', 'in'); return; }
        state.wires[wid] = true;
        var w = null;
        for (var j = 0; j < WIRES.length; j++) if (WIRES[j].id === wid) w = WIRES[j];
        logLine(log, '🔗 ' + (w ? w.name : wid) + ' जोड़ा गया', 'ok');
        render();
      } else if (t.dataset.act) {
        var act = t.dataset.act;
        if (act === 'plug') doPlug();
        else if (act === 'sw') doSwitch();
        else if (act === 'boot') doBoot();
        else if (act === 'reset') doReset();
      }
    });

    /* ---- शुरू ---- */
    render();
    logLine(log, 'प्रारंभ — पहले मदरबोर्ड चुनिए, बाक़ी सब इसी के हिसाब से मिलेगा', 'in');
  };
})();

