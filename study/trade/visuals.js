/* Trade Theory · तकनीकी SVG डायग्राम लाइब्रेरी (25 अध्याय) */
(function () {
  "use strict";

  var W = 760;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }

  function t(x, y, text, cls, anchor, size) {
    return '<text x="' + x + '" y="' + y + '" class="' + (cls || "v-label") + '" text-anchor="' + (anchor || "start") + '"' +
      (size ? ' font-size="' + size + '"' : "") + ">" + esc(text) + "</text>";
  }

  function box(x, y, w, h, title, sub, cls) {
    var out = '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" class="v-box ' + (cls || "") + '"/>';
    var cx = x + w / 2;
    var ty = y + h / 2 + (sub ? -3 : 5);
    out += '<text x="' + cx + '" y="' + ty + '" text-anchor="middle" class="v-title">' + esc(title) + "</text>";
    if (sub) out += '<text x="' + cx + '" y="' + (ty + 15) + '" text-anchor="middle" class="v-sub">' + esc(sub) + "</text>";
    return out + "</g>";
  }

  function line(x1, y1, x2, y2, cls) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="v-line ' + (cls || "") + '"/>';
  }

  function arrow(x1, y1, x2, y2, cls) {
    var mark = cls && cls.indexOf("hot") >= 0 ? "arHot" : cls && cls.indexOf("bad") >= 0 ? "arBad" : cls && cls.indexOf("good") >= 0 ? "arGood" : "ar";
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="v-line ' + (cls || "") + '" marker-end="url(#' + mark + ')"/>';
  }

  function path(d, cls) {
    var mark = cls && cls.indexOf("hot") >= 0 ? "arHot" : cls && cls.indexOf("bad") >= 0 ? "arBad" : cls && cls.indexOf("good") >= 0 ? "arGood" : "ar";
    return '<path d="' + d + '" class="v-line ' + (cls || "") + '" fill="none"' + (cls && cls.indexOf("arrow") >= 0 ? ' marker-end="url(#' + mark + ')"' : "") + "/>";
  }

  function token(d, dur, cls) {
    return '<circle r="5.5" class="v-token ' + (cls || "") + '"><animateMotion dur="' + dur + 's" repeatCount="indefinite" path="' + d + '"/></circle>';
  }

  function badge(x, y, w, h, text, cls) {
    return '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" class="v-badge ' + (cls || "") + '"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" class="v-badge-text">' + esc(text) + "</text></g>";
  }

  var DEFS =
    '<defs>' +
      '<marker id="ar" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#8fa3b2"/></marker>' +
      '<marker id="arHot" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#c58b2a"/></marker>' +
      '<marker id="arBad" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#b42318"/></marker>' +
      '<marker id="arGood" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#157f4b"/></marker>' +
    "</defs>";

  function svg(height, title, inner) {
    return '<svg class="tech-svg" viewBox="0 0 ' + W + " " + height + '" role="img" aria-label="' + esc(title) + '" xmlns="http://www.w3.org/2000/svg">' +
      DEFS + inner + "</svg>";
  }

  function person(x, y, label) {
    return '<g class="v-person">' +
      '<circle cx="' + x + '" cy="' + y + '" r="12" class="v-person-head"/>' +
      line(x, y + 12, x, y + 55, "cool") +
      line(x, y + 24, x - 22, y + 42, "cool") + line(x, y + 24, x + 22, y + 42, "cool") +
      line(x, y + 55, x - 16, y + 85, "cool") + line(x, y + 55, x + 16, y + 85, "cool") +
      (label ? t(x, y + 104, label, "v-sub", "middle") : "") + "</g>";
  }

  var D = {};

  /* 1 — अर्थिंग */
  D.earthing = function () {
    var s = "";
    s += box(20, 40, 100, 92, "सप्लाई", "230V · L/N/E", "brand");
    s += box(150, 48, 90, 76, "MCB/RCCB", "30 mA", "");
    s += box(270, 48, 90, 76, "सॉकेट", "3-pin", "");
    s += box(400, 28, 170, 124, "उपकरण चेसिस", "धातु बॉडी", "accent");
    s += t(485, 70, "⚡ इंसुलेशन फेल", "v-sub bad", "middle");
    s += line(120, 66, 400, 66, "hot");
    s += line(120, 92, 400, 92, "cool");
    s += line(490, 152, 490, 225, "good arrow");
    s += line(300, 225, 700, 225, "good");
    s += line(490, 225, 490, 276, "good");
    s += line(466, 252, 514, 252, "good");
    s += line(474, 264, 506, 264, "good");
    s += t(490, 294, "अर्थ इलेक्ट्रोड", "v-sub", "middle");
    s += person(612, 96, "व्यक्ति");
    s += line(590, 120, 570, 118, "cool");
    s += path("M470 92 C 520 118 560 120 600 126", "bad dash arrow");
    s += t(575, 160, "खतरनाक रास्ता", "v-sub bad", "middle");
    s += token("M490 152 L490 225 H560", "2.6s", "good");
    s += token("M120 66 H400", "3.4s", "hot");
    s += badge(140, 158, 118, 34, "30 mA → ट्रिप", "bad");
    s += t(700, 289, "फॉल्ट करंट जमीन में", "v-sub good", "end");
    return svg(310, "अर्थिंग और फॉल्ट करंट का रास्ता", s);
  };

  /* 2 — SMPS */
  D.smps = function () {
    var s = "";
    var boxes = [
      [15, "AC IN", "230V 50Hz"],
      [120, "EMI फ़िल्टर", "शोर रोकें"],
      [225, "ब्रिज", "325 V DC"],
      [330, "PFC", "400 V DC"],
      [435, "HF स्विच", "25–100 kHz"],
      [540, "ट्रांसफॉर्मर", "आइसोलेशन"],
      [645, "आउट फ़िल्टर", "LC"]
    ];
    boxes.forEach(function (b) { s += box(b[0], 35, 95, 76, b[1], b[2], b[0] === 435 ? "brand" : ""); });
    for (var i = 0; i < boxes.length - 1; i += 1) {
      var x = boxes[i][0] + 95;
      s += arrow(x, 73, boxes[i + 1][0] - 2, 73, "hot");
    }
    s += token("M15 73 H740", "4.8s", "hot");
    s += box(645, 170, 100, 104, "DC रेल", "+12V +5V +3.3V 5VSB", "accent");
    s += arrow(692, 111, 692, 168, "good");
    s += box(300, 175, 150, 64, "PWM नियंत्रक", "फीडबैक से ड्यूटी", "");
    s += arrow(692, 240, 460, 240, "good");
    s += path("M460 240 V207", "good arrow");
    s += path("M375 175 V111", "good arrow");
    s += t(692, 160, "फीडबैक", "v-sub good", "middle");
    s += t(380, 96, "नियंत्रण", "v-sub", "start");
    s += badge(15, 240, 250, 44, "गैल्वेनिक आइसोलेशन जरूरी", "warn");
    s += t(740, 292, "हर रेल का रिपल अलग जाँचें", "v-sub", "end");
    return svg(310, "SMPS का पावर और फीडबैक पथ", s);
  };

  /* 3 — PC ब्लॉक */
  D.pc = function () {
    var s = '<rect x="10" y="10" width="740" height="320" rx="14" class="v-zone"/>';
    s += box(30, 250, 120, 60, "PSU", "+12V/+5V/3.3V", "accent");
    s += box(300, 135, 130, 84, "CPU", "कोर + कैश", "brand");
    s += box(500, 55, 190, 62, "RAM", "DDR4 / DDR5", "");
    s += box(520, 160, 120, 62, "GPU", "PCIe x16", "");
    s += box(665, 160, 70, 62, "NVMe", "PCIe", "");
    s += box(300, 258, 130, 50, "चिपसेट (PCH)", "I/O नियंत्रण", "");
    s += box(30, 55, 140, 84, "I/O पैनल", "USB · LAN · ऑडियो", "");
    s += box(150, 258, 100, 50, "BIOS/UEFI", "POST", "");
    s += arrow(365, 135, 500, 100, "hot");
    s += arrow(500, 92, 365, 128, "hot");
    s += arrow(430, 170, 520, 180, "hot");
    s += arrow(640, 180, 665, 180, "hot");
    s += arrow(365, 219, 365, 258, "cool");
    s += arrow(170, 130, 300, 160, "cool");
    s += arrow(250, 283, 300, 283, "cool");
    s += path("M90 250 V190 H300 V200", "hot arrow");
    s += path("M580 222 V250 H640 V270", "cool");
    s += token("M365 135 L500 100", "2.2s", "hot");
    s += token("M430 170 H520", "1.8s", "hot");
    s += t(420, 45, "मेमोरी बस", "v-sub", "middle");
    s += t(610, 140, "PCIe लेन", "v-sub", "middle");
    s += t(230, 320, "पावर रेल सबसे पहले मापें", "v-sub", "middle");
    return svg(340, "पीसी उप-प्रणालियाँ और डेटा बस", s);
  };

  /* 4 — कीबोर्ड मैट्रिक्स */
  D.keyboard = function () {
    var s = "";
    var x0 = 120, y0 = 78, cw = 55, ch = 38;
    s += t(95, y0 - 22, "कॉलम →", "v-sub", "end");
    for (var c = 0; c < 4; c += 1) s += t(x0 + c * cw + cw / 2, y0 - 12, "C" + c, "v-sub", "middle");
    for (var r = 0; r < 4; r += 1) {
      s += t(x0 - 12, y0 + r * ch + 24, "R" + r, "v-sub", "end");
      for (var cc = 0; cc < 4; cc += 1) {
        var hot = r === 1 && cc === 2;
        s += '<rect x="' + (x0 + cc * cw + 3) + '" y="' + (y0 + r * ch + 3) + '" width="' + (cw - 6) + '" height="' + (ch - 6) + '" rx="6" class="v-key' + (hot ? " hot" : "") + '"/>' +
          t(x0 + cc * cw + cw / 2, y0 + r * ch + 24, "K" + (r * 4 + cc), "v-key-text", "middle");
      }
    }
    s += line(x0 + 2 * cw + cw / 2, y0 + ch + ch / 2, 480, y0 + ch + ch / 2, "hot");
    s += line(x0 + 2 * cw + cw / 2, y0 + ch + 3, x0 + 2 * cw + cw / 2, y0 + ch / 2, "hot");
    s += box(480, 95, 140, 96, "कीबोर्ड कंट्रोलर", "पंक्ति-स्तंभ स्कैन", "brand");
    s += box(650, 112, 70, 62, "USB", "HID", "");
    s += arrow(620, 143, 648, 143, "hot");
    s += line(340, 96, 480, 96, "cool");
    s += line(340, 134, 480, 134, "cool");
    s += line(340, 172, 480, 172, "cool");
    s += line(340, 210, 480, 210, "cool");
    s += token("M300 134 H480", "2.4s", "hot");
    s += t(610, 245, "एक समय में एक पंक्ति", "v-sub", "middle");
    s += t(610, 264, "दबी कुंजी = R1 + C2", "v-sub", "middle");
    s += badge(30, 240, 220, 44, "डायोड नहीं → ghosting", "warn");
    return svg(300, "कीबोर्ड मैट्रिक्स और स्कैन-कोड पथ", s);
  };

  /* 5 — HDD */
  D.hdd = function () {
    var s = "";
    s += '<g class="v-rotor"><animateTransform attributeName="transform" type="rotate" from="0 250 165" to="360 250 165" dur="4s" repeatCount="indefinite"/>' +
      '<circle cx="250" cy="165" r="115" class="v-platter"/>' +
      '<circle cx="250" cy="165" r="90" class="v-track"/><circle cx="250" cy="165" r="65" class="v-track"/>' +
      '<circle cx="250" cy="165" r="40" class="v-track"/>' +
      line(250, 165, 250, 50, "hot") +
      '<circle cx="250" cy="80" r="6" class="v-token hot"/></g>';
    s += '<circle cx="250" cy="165" r="14" class="v-spindle"/>';
    s += '<g><animateTransform attributeName="transform" type="rotate" values="-5 560 250; 5 560 250; -5 560 250" dur="3.6s" repeatCount="indefinite"/>' +
      line(560, 250, 330, 150, "cool") + '<circle cx="560" cy="250" r="12" class="v-spindle"/>' +
      '<path d="M330 150 L312 140 L316 160 Z" class="v-head"/></g>';
    s += t(250, 300, "प्लेटर 5400 / 7200 RPM", "v-sub", "middle");
    s += t(598, 285, "एक्ट्यूएटर", "v-sub", "middle");
    s += t(322, 132, "हेड", "v-sub", "end");
    s += box(610, 40, 120, 62, "SATA", "6 Gb/s", "");
    s += box(590, 150, 150, 100, "सेक्टर", "512 B / 4K", "accent");
    s += t(665, 190, "ट्रैक + सेक्टर", "v-sub", "middle");
    s += t(665, 206, "LBA → CHS", "v-sub", "middle");
    s += t(665, 235, "सीक + रोटेशन समय", "v-sub", "middle");
    s += badge(30, 270, 220, 40, "झटके से हेड और प्लेटर टकराते हैं", "bad");
    return svg(320, "हार्ड डिस्क की यांत्रिक बनावट", s);
  };

  /* 6 — मदरबोर्ड */
  D.motherboard = function () {
    var s = '<rect x="30" y="30" width="700" height="300" rx="12" class="v-board"/>';
    s += '<rect x="36" y="60" width="20" height="180" rx="4" class="v-slot"/><text x="46" y="150" transform="rotate(-90 46 150)" text-anchor="middle" class="v-sub">I/O</text>';
    s += box(300, 130, 110, 110, "CPU सॉकेट", "LGA / AM", "brand");
    s += '<rect x="340" y="34" width="90" height="16" rx="4" class="v-slot"/>' + t(385, 30, "8-pin EPS", "v-sub", "middle");
    s += '<rect x="700" y="90" width="18" height="100" rx="4" class="v-slot"/>' + t(690, 80, "24-pin", "v-sub", "end");
    for (var i = 0; i < 4; i += 1) {
      s += '<rect x="' + (450 + i * 28) + '" y="70" width="18" height="170" rx="4" class="v-slot"/>';
    }
    s += t(495, 258, "RAM स्लॉट ×4", "v-sub", "middle");
    s += '<rect x="140" y="280" width="300" height="22" rx="4" class="v-slot"/>' + t(290, 276, "PCIe x16", "v-sub", "middle");
    s += '<rect x="460" y="280" width="100" height="22" rx="4" class="v-slot"/>' + t(510, 276, "PCIe x1", "v-sub", "middle");
    s += '<rect x="600" y="70" width="110" height="26" rx="4" class="v-slot"/>' + t(655, 64, "M.2 NVMe", "v-sub", "middle");
    s += box(610, 140, 80, 50, "SATA", "×4", "");
    s += box(190, 200, 90, 55, "चिपसेट", "PCH", "");
    s += '<circle cx="120" cy="218" r="14" class="v-spindle"/>' + t(120, 250, "CMOS", "v-sub", "middle");
    s += t(150, 130, "CPU VRM", "v-sub", "middle");
    s += line(410, 185, 450, 155, "cool");
    s += token("M450 155 H410", "2s", "hot");
    s += t(380, 345, "फॉर्म फैक्टर पहले तय करें — बाद में सॉकेट और RAM", "v-sub", "middle");
    return svg(360, "मदरबोर्ड के मुख्य स्लॉट और कनेक्टर", s);
  };

  /* 7 — लैपटॉप */
  D.laptop = function () {
    var s = "";
    s += box(20, 48, 110, 62, "एडाप्टर", "19V DC", "accent");
    s += box(145, 62, 55, 34, "DC जैक", "", "");
    s += box(215, 34, 115, 72, "चार्जिंग IC", "CC/CV", "brand");
    s += box(215, 168, 120, 60, "बैटरी", "3S / 6S", "");
    s += box(370, 100, 115, 72, "PMIC", "पावर रेल", "brand");
    s += box(520, 38, 90, 62, "CPU", "VCORE", "");
    s += box(650, 38, 90, 62, "GPU", "VCORE", "");
    s += box(520, 128, 90, 52, "RAM", "1.2V", "");
    s += box(650, 128, 90, 52, "SSD", "3.3V", "");
    s += box(520, 215, 120, 52, "डिस्प्ले", "बैकलाइट", "");
    s += box(660, 215, 90, 52, "कीबोर्ड", "3.3V", "");
    s += arrow(130, 79, 143, 79, "hot");
    s += arrow(200, 79, 213, 70, "hot");
    s += arrow(330, 70, 368, 110, "good");
    s += arrow(330, 106, 368, 128, "good");
    s += arrow(275, 165, 275, 134, "good");
    s += arrow(485, 125, 518, 90, "good");
    s += arrow(485, 140, 518, 150, "good");
    s += arrow(485, 155, 648, 292, "cool");
    s += arrow(485, 110, 518, 240, "cool");
    s += token("M275 165 V134", "2.4s", "good");
    s += token("M330 70 H368", "2s", "good");
    s += badge(30, 240, 250, 44, "आउटपुट शॉर्ट → चार्जिंग IC गर्म", "warn");
    s += t(740, 300, "पहले एडाप्टर, फिर बैटरी, फिर मदरबोर्ड", "v-sub", "end");
    return svg(320, "लैपटॉप का पावर वितरण", s);
  };

  /* 8 — लेज़र प्रिंटर */
  D.printer = function () {
    var s = "";
    s += '<circle cx="330" cy="175" r="72" class="v-drum"><animateTransform attributeName="transform" type="rotate" from="0 330 175" to="360 330 175" dur="8s" repeatCount="indefinite"/></circle>';
    s += '<circle cx="330" cy="175" r="58" class="v-track"/>';
    s += t(330, 180, "ड्रम", "v-title", "middle");
    s += box(270, 45, 120, 38, "1. चार्ज", "कोरोना", "brand");
    s += box(95, 150, 110, 44, "2. एक्सपोज़", "लेज़र", "");
    s += box(150, 268, 120, 40, "3. डेवलप", "टोनर", "");
    s += box(380, 268, 120, 40, "4. ट्रांसफर", "पेपर", "");
    s += box(565, 212, 115, 44, "5. फ्यूज़", "ऊष्मा + दबाव", "accent");
    s += box(570, 88, 115, 40, "6. क्लीन", "ब्लेड", "");
    var ring = "M330 103 A72 72 0 0 1 402 175 M402 175 A72 72 0 0 1 330 247 M330 247 A72 72 0 0 1 258 175 M258 175 A72 72 0 0 1 330 103";
    s += path(ring, "cool dash");
    s += box(25, 300, 80, 30, "ट्रे", "", "");
    var paper = "M105 315 H330 V255 H380 V300 H600 V256 H700 V170";
    s += path(paper, "warm dash");
    s += token(paper, "7s", "hot");
    s += t(330, 335, "पेपर पथ → ट्रांसफर → फ्यूज़र → आउटपुट", "v-sub", "middle");
    s += t(740, 40, "छह चरण लगातार दोहराते हैं", "v-sub", "end");
    return svg(345, "लेज़र प्रिंटर का इलेक्ट्रोफोटोग्राफिक चक्र", s);
  };

  /* 9 — स्कैनर */
  D.scanner = function () {
    var s = "";
    s += '<rect x="80" y="42" width="440" height="14" rx="4" class="v-glass"/>';
    s += '<rect x="100" y="24" width="400" height="16" rx="3" class="v-paper"/>';
    s += t(300, 18, "दस्तावेज़", "v-sub", "middle");
    s += '<g><animateTransform attributeName="transform" type="translate" values="0 0; 300 0; 0 0" dur="6s" repeatCount="indefinite"/>' +
      '<rect x="110" y="72" width="90" height="30" rx="6" class="v-lamp"/>' +
      t(155, 92, "लैंप + स्कैन हेड", "v-sub", "middle") + "</g>";
    s += box(205, 128, 90, 30, "मिरर 1", "", "");
    s += box(285, 158, 90, 30, "मिरर 2", "", "");
    s += '<path d="M380 175 L450 150" class="v-line cool"/>';
    s += '<rect x="450" y="132" width="76" height="42" rx="8" class="v-box accent"/>' + t(488, 158, "लेंस", "v-title", "middle");
    s += '<rect x="548" y="130" width="80" height="44" rx="8" class="v-box brand"/>' + t(588, 150, "CCD/CIS", "v-title", "middle") + t(588, 166, "फोटो डायोड", "v-sub", "middle");
    s += box(470, 215, 120, 44, "ADC", "एनालॉग → डिजिटल", "");
    s += box(610, 215, 120, 50, "USB / PC", "DPI चुनें", "accent");
    s += arrow(628, 152, 610, 215, "cool");
    s += arrow(590, 215, 570, 215, "hot");
    s += path("M155 72 V42", "warm");
    s += path("M155 42 L205 128", "warm dash");
    s += path("M250 128 L285 158", "warm dash");
    s += t(380, 270, "रोशनी: दस्तावेज़ → मिरर → लेंस → सेंसर", "v-sub", "middle");
    s += badge(30, 140, 140, 40, "ग्लास साफ रखें", "warn");
    return svg(300, "फ्लैटबेड स्कैनर का प्रकाश पथ", s);
  };

  /* 10 — LCD */
  D.lcd = function () {
    var s = "";
    var layers = [
      [205, 26, "बैकलाइट", "LED"],
      [177, 20, "डिफ्यूज़र", "समान रोशनी"],
      [153, 16, "पिछला पोलराइज़र", "0°"],
      [123, 24, "TFT ग्लास", "ट्रांज़िस्टर"],
      [97, 20, "लिक्विड क्रिस्टल", "घूमता है"],
      [73, 18, "कलर फ़िल्टर", "RGB"],
      [51, 16, "सामने पोलराइज़र", "90°"]
    ];
    layers.forEach(function (l) {
      s += '<rect x="120" y="' + l[0] + '" width="420" height="' + l[1] + '" rx="4" class="v-layer"/>';
      s += t(110, l[0] + l[1] / 2 + 4, l[2], "v-label", "end");
      s += t(555, l[0] + l[1] / 2 + 4, l[3], "v-sub", "start");
    });
    s += path("M120 218 H560 L620 120", "warm dash arrow");
    s += '<circle cx="635" cy="100" r="16" class="v-eye"/><circle cx="635" cy="100" r="5" class="v-token"/>';
    s += t(660, 105, "आँख", "v-sub", "start");
    s += token("M120 218 H560 L620 120", "4s", "warm");
    s += box(590, 190, 145, 80, "सबपिक्सल", "R · G · B", "accent");
    s += t(662, 230, "रंग फ़िल्टर से", "v-sub", "middle");
    s += t(662, 246, "तीन सबपिक्सल", "v-sub", "middle");
    s += t(120, 285, "बैकलाइट खराब → चित्र नहीं, फिर भी मेन्यू दिखे तो सिग्नल ठीक", "v-sub", "start");
    return svg(300, "LCD पैनल की परतें और प्रकाश पथ", s);
  };

  /* 11 — अपग्रेड */
  D.upgrade = function () {
    var s = '<rect x="30" y="30" width="450" height="260" rx="12" class="v-board"/>';
    s += box(75, 75, 105, 80, "CPU", "सॉकेट मिलान", "brand");
    for (var i = 0; i < 4; i += 1) s += '<rect x="' + (245 + i * 26) + '" y="60" width="16" height="150" rx="4" class="v-slot"/>';
    s += t(300, 230, "RAM — DDR पीढ़ी", "v-sub", "middle");
    s += '<rect x="75" y="220" width="140" height="22" rx="4" class="v-slot"/>' + t(145, 216, "PCIe x16", "v-sub", "middle");
    s += '<rect x="245" y="252" width="120" height="22" rx="4" class="v-slot"/>' + t(305, 248, "M.2 NVMe", "v-sub", "middle");
    s += '<rect x="445" y="60" width="18" height="120" rx="4" class="v-slot"/>' + t(436, 50, "PSU हेडर", "v-sub", "end");
    s += '<g class="v-callout">' +
      box(500, 40, 230, 40, "1. सॉकेट और चिपसेट", "CPU सूची देखें", "") +
      box(500, 92, 230, 40, "2. RAM पीढ़ी + स्लॉट", "DDR4 ≠ DDR5", "") +
      box(500, 144, 230, 40, "3. BIOS समर्थन", "अपडेट पहले", "") +
      box(500, 196, 230, 40, "4. PSU + कूलिंग", "हेडरूम 20–30%", "") +
      '</g>';
    s += t(610, 268, "PSU बजट: 450W", "v-sub", "middle");
    s += '<rect x="520" y="278" width="190" height="14" rx="7" class="v-bar-bg"/>';
    s += '<rect x="520" y="278" width="70" height="14" rx="7" class="v-bar hot"/>';
    s += '<rect x="590" y="278" width="80" height="14" rx="0" class="v-bar brand"/>';
    s += '<rect x="670" y="278" width="20" height="14" rx="0" class="v-bar warm"/>';
    s += t(520, 306, "CPU", "v-sub", "start") + t(615, 306, "GPU", "v-sub", "middle") + t(700, 306, "बाकी", "v-sub", "middle");
    return svg(325, "अपग्रेड की अनुकूलता और PSU बजट", s);
  };

  /* 12 — बैकअप 3-2-1 */
  D.backup = function () {
    var s = "";
    s += box(25, 108, 110, 72, "स्रोत", "लैपटॉप / सर्वर", "brand");
    s += box(180, 35, 115, 60, "प्रति 1", "एक्सटर्नल SSD", "");
    s += box(180, 175, 115, 60, "प्रति 2", "NAS / दूसरा मीडिया", "");
    s += box(370, 35, 125, 60, "प्रति 3", "क्लाउड / ऑफ़साइट", "accent");
    s += box(370, 175, 125, 60, "आर्काइव", "टेप / कोल्ड स्टोर", "");
    s += arrow(135, 120, 178, 78, "hot");
    s += arrow(135, 145, 178, 195, "hot");
    s += path("M135 108 C 250 80 300 70 368 66", "hot arrow");
    s += arrow(305, 208, 368, 208, "cool");
    s += path("M432 175 C 380 150 220 230 135 168", "good dash arrow");
    s += t(270, 262, "restore की जाँच भी बैकअप का हिस्सा है", "v-sub", "middle");
    s += badge(555, 85, 180, 108, "", "brand");
    s += '<text x="645" y="126" text-anchor="middle" class="v-big">3-2-1</text>';
    s += t(645, 152, "3 प्रतियाँ", "v-badge-text", "middle");
    s += t(645, 170, "2 मीडिया · 1 ऑफ़साइट", "v-badge-text", "middle");
    s += t(645, 210, "7 दिन / 4 हफ्ते / 12 महीने", "v-sub", "middle");
    return svg(300, "बैकअप की 3-2-1 रणनीति", s);
  };

  /* 13 — टैबलेट */
  D.tablet = function () {
    var s = "";
    s += box(320, 108, 120, 92, "SoC", "CPU + GPU + मॉडेम", "brand");
    s += box(470, 52, 100, 50, "RAM", "LPDDR", "");
    s += box(470, 118, 100, 50, "eMMC/UFS", "स्टोरेज", "");
    s += box(600, 52, 105, 62, "डिस्प्ले", "MIPI DSI", "");
    s += box(600, 130, 105, 50, "टच", "I2C", "");
    s += box(180, 238, 120, 52, "बैटरी", "Li-ion", "");
    s += box(320, 238, 100, 52, "चार्ज IC", "USB-C", "accent");
    s += box(55, 52, 105, 50, "कैमरा", "CSI", "");
    s += box(55, 120, 105, 50, "WiFi/BT", "SDIO", "");
    s += box(55, 196, 120, 50, "सेंसर", "I2C", "");
    s += arrow(160, 77, 318, 130, "cool");
    s += arrow(160, 145, 318, 150, "cool");
    s += arrow(175, 220, 318, 190, "cool");
    s += arrow(440, 125, 470, 90, "hot");
    s += arrow(440, 160, 470, 143, "hot");
    s += arrow(440, 140, 600, 90, "hot");
    s += arrow(440, 155, 600, 155, "hot");
    s += arrow(300, 264, 318, 200, "good");
    s += token("M265 264 L320 200", "2.6s", "good");
    s += badge(470, 215, 235, 44, "पहले करंट, फिर डिस्प्ले, फिर SoC", "warn");
    return svg(310, "टैबलेट का ब्लॉक डायग्राम", s);
  };

  /* 14 — UPS */
  D.ups = function () {
    var s = "";
    s += box(20, 30, 110, 62, "मेन्स", "230V AC", "brand");
    s += box(200, 30, 100, 62, "चार्जर", "CC/CV", "");
    s += box(360, 30, 110, 62, "बैटरी", "12V × n", "accent");
    s += box(520, 30, 110, 62, "इन्वर्टर", "DC → AC", "");
    s += box(200, 145, 120, 72, "ATS / रिले", "ट्रांसफर", "brand");
    s += box(620, 145, 110, 62, "लोड", "PC / सर्वर", "");
    s += path("M130 52 H200", "hot arrow");
    s += path("M130 72 H170 V181 H200", "hot arrow");
    s += arrow(300, 61, 358, 61, "good");
    s += arrow(470, 61, 518, 61, "good");
    s += path("M575 92 V120 H260 V145", "good arrow");
    s += arrow(320, 181, 618, 181, "hot");
    s += path("M130 88 V250 H620 V209", "cool dash arrow");
    s += token("M130 72 H170 V181 H200", "3s", "hot");
    s += token("M575 92 V120 H260 V145", "4s", "good");
    s += t(145, 265, "बाईपास", "v-sub", "start");
    s += t(640, 285, "ट्रांसफर समय 4–10 ms", "v-sub", "end");
    s += badge(20, 210, 250, 40, "आउटेज पर बैटरी तुरंत नहीं, ATS के बाद", "warn");
    return svg(300, "UPS का पावर पथ और ट्रांसफर", s);
  };

  /* 15 — OSI */
  D.osi = function () {
    var s = "";
    var layers = [
      ["7", "एप्लिकेशन", "HTTP · DNS · FTP"],
      ["6", "प्रेज़ेंटेशन", "TLS · संपीड़न"],
      ["5", "सेशन", "सत्र प्रबंधन"],
      ["4", "ट्रांसपोर्ट", "TCP · UDP"],
      ["3", "नेटवर्क", "IP · ICMP"],
      ["2", "डेटा लिंक", "ईथरनेट · MAC"],
      ["1", "फिज़िकल", "केबल · बिट्स"]
    ];
    layers.forEach(function (l, i) {
      s += '<rect x="20" y="' + (40 + i * 44) + '" width="290" height="38" rx="7" class="v-layer' + (i === 3 || i === 2 ? " accent" : "") + '"/>';
      s += t(34, 64 + i * 44, l[0], "v-num", "start");
      s += t(56, 64 + i * 44, l[1], "v-title", "start");
      s += t(298, 64 + i * 44, l[2], "v-sub", "end");
    });
    s += t(165, 30, "OSI 7 परतें", "v-sub", "middle");
    s += '<rect x="330" y="40" width="70" height="132" rx="7" class="v-layer brand"/>' + t(365, 100, "एप्लिकेशन", "v-badge-text", "middle") + t(365, 118, "5–7", "v-badge-text", "middle");
    s += '<rect x="330" y="180" width="70" height="38" rx="7" class="v-layer brand"/>' + t(365, 204, "ट्रांसपोर्ट", "v-badge-text", "middle");
    s += '<rect x="330" y="226" width="70" height="38" rx="7" class="v-layer brand"/>' + t(365, 250, "इंटरनेट", "v-badge-text", "middle");
    s += '<rect x="330" y="272" width="70" height="82" rx="7" class="v-layer brand"/>' + t(365, 318, "नेटवर्क", "v-badge-text", "middle") + t(365, 336, "1–2", "v-badge-text", "middle");
    s += t(365, 30, "TCP/IP", "v-sub", "middle");
    var stages = [
      ["डेटा", 60, 210],
      ["TCP/UDP हेडर + डेटा", 118, 240],
      ["IP हेडर + सेगमेंट", 176, 270],
      ["फ्रेम हेडर + पैकेट + FCS", 234, 300],
      ["बिट्स केबल पर", 292, 240]
    ];
    stages.forEach(function (st, i) {
      var x = 400 + (300 - st[2]) / 2;
      s += '<rect x="' + x + '" y="' + st[1] + '" width="' + st[2] + '" height="38" rx="7" class="v-layer' + (i === 4 ? " warm" : "") + '"/>';
      s += t(400 + 150, st[1] + 24, st[0], "v-title", "middle");
    });
    for (var i = 0; i < stages.length - 1; i += 1) s += arrow(550, stages[i][1] + 38, 550, stages[i + 1][1] - 2, "hot");
    s += token("M550 98 V330", "5s", "hot");
    s += t(550, 30, "एनकैप्सुलेशन", "v-sub", "middle");
    return svg(380, "OSI मॉडल और डेटा एनकैप्सुलेशन", s);
  };

  /* 16 — नेटवर्क डिवाइस / VLAN */
  D.network = function () {
    var s = "";
    s += box(330, 22, 110, 60, "राउटर", "L3 · VLAN के बीच", "accent");
    s += box(300, 148, 180, 92, "L2 स्विच", "MAC टेबल + 802.1Q", "brand");
    s += box(40, 282, 90, 38, "PC1", "VLAN 10", "good-box");
    s += box(150, 282, 90, 38, "PC2", "VLAN 10", "good-box");
    s += box(260, 282, 90, 38, "PC3", "VLAN 20", "warm-box");
    s += box(370, 282, 90, 38, "PC4", "VLAN 20", "warm-box");
    s += box(620, 150, 110, 60, "फ़ाइल सर्वर", "VLAN 10", "good-box");
    s += box(620, 235, 110, 55, "एक्सेस पॉइंट", "VLAN 20", "warm-box");
    s += line(85, 282, 85, 240, "cool"); s += line(85, 240, 330, 240, "cool");
    s += line(195, 282, 195, 250, "cool"); s += line(195, 250, 350, 250, "cool");
    s += line(305, 282, 305, 260, "warm"); s += line(305, 260, 380, 260, "warm");
    s += line(415, 282, 415, 268, "warm"); s += line(415, 268, 410, 268, "warm");
    s += line(480, 194, 618, 180, "cool");
    s += line(480, 215, 618, 260, "warm");
    s += path("M385 82 V146", "hot dash arrow");
    s += t(398, 118, "ट्रंक", "v-sub", "start");
    s += path("M85 282 V240 H330 V194 H348", "hot arrow");
    s += path("M195 282 V250 H330 V194 H348", "good arrow");
    s += token("M85 282 V240 H330 V194 H348", "3.4s", "hot");
    s += token("M195 282 V250 H380 V260 H415", "4.4s", "good");
    s += t(210, 355, "VLAN 20 का फ्रेम VLAN 10 पोर्ट पर नहीं जाता", "v-sub", "middle");
    s += badge(30, 60, 190, 62, "", "");
    s += t(125, 84, "हब: सबको भेजता", "v-badge-text", "middle");
    s += t(125, 104, "स्विच: MAC से", "v-badge-text", "middle");
    return svg(350, "हब, स्विच और VLAN का फ्रेम पथ", s);
  };

  /* 17 — वायरलेस */
  D.wireless = function () {
    var s = "";
    s += box(25, 118, 100, 60, "PoE स्विच", "PSE", "");
    s += box(185, 118, 90, 60, "AP", "802.11ax", "brand");
    s += line(125, 148, 185, 148, "hot");
    s += t(155, 140, "PoE", "v-sub", "middle");
    var cx = 230, cy = 148;
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="120" class="v-range"/><circle cx="' + cx + '" cy="' + cy + '" r="82" class="v-range"/><circle cx="' + cx + '" cy="' + cy + '" r="45" class="v-range"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="12" class="v-wifi"><animate attributeName="r" values="12;26;12" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0;.7" dur="2.4s" repeatCount="indefinite"/></circle>';
    s += box(345, 88, 90, 46, "लैपटॉप", "-58 dBm", "");
    s += box(320, 238, 80, 42, "फ़ोन", "-67 dBm", "");
    s += box(115, 250, 80, 42, "टैबलेट", "-74 dBm", "");
    s += line(cx, cy, 390, 112, "good dash");
    s += line(cx, cy, 360, 258, "warm dash");
    s += line(cx, cy, 155, 270, "bad dash");
    s += t(470, 40, "2.4 GHz चैनल", "v-sub", "start");
    s += '<rect x="470" y="52" width="270" height="120" rx="8" class="v-chart"/>';
    [["1", 520], ["6", 600], ["11", 680]].forEach(function (ch, i) {
      s += path("M" + (ch[1] - 40) + " 165 Q " + ch[1] + " 75 " + (ch[1] + 40) + " 165", "chan" + i);
      s += t(ch[1], 180, "चैनल " + ch[0], "v-sub", "middle");
    });
    s += t(605, 198, "1 · 6 · 11 ही ओवरलैप-मुक्त", "v-sub", "middle");
    s += badge(470, 215, 270, 46, "सिग्नल अच्छा ≠ थ्रूपुट अच्छा", "warn");
    return svg(330, "AP कवरेज, PoE और चैनल ओवरलैप", s);
  };

  /* 18 — RAID */
  D.raid = function () {
    var s = "";
    function panel(x, y, title, sub, disks, failIndex) {
      var out = '<rect x="' + x + '" y="' + y + '" width="350" height="150" rx="10" class="v-zone"/>';
      out += t(x + 14, y + 24, title, "v-title", "start") + t(x + 336, y + 24, sub, "v-sub", "end");
      var dw = Math.min(64, 300 / disks.length);
      disks.forEach(function (blocks, di) {
        var dx = x + 18 + di * (dw + 8);
        out += '<rect x="' + dx + '" y="' + (y + 36) + '" width="' + dw + '" height="96" rx="6" class="v-disk' + (di === failIndex ? " fail" : "") + '"/>';
        out += t(dx + dw / 2, y + 54, "D" + (di + 1), "v-sub", "middle");
        blocks.forEach(function (b, bi) {
          out += '<rect x="' + (dx + 5) + '" y="' + (y + 62 + bi * 22) + '" width="' + (dw - 10) + '" height="17" rx="3" class="v-strip' + (b === "P" ? " parity" : "") + '"/>';
          out += t(dx + dw / 2, y + 74 + bi * 22, b, "v-strip-text", "middle");
        });
        if (di === failIndex) {
          out += line(dx + 4, y + 40, dx + dw - 4, y + 128, "bad") + line(dx + dw - 4, y + 40, dx + 4, y + 128, "bad");
          out += t(dx + dw / 2, y + 145, "विफल", "v-sub bad", "middle");
        }
      });
      return out;
    }
    s += panel(15, 15, "RAID 0", "स्ट्राइप · स्पीड", [["A1", "A3"], ["A2", "A4"]]);
    s += panel(390, 15, "RAID 1", "मिरर · 50%", [["A1", "A2"], ["A1", "A2"]], 1);
    s += panel(15, 185, "RAID 5", "पैरिटी · 1 डिस्क", [["A1", "A2", "P3"], ["A3", "P2", "A4"], ["P1", "A5", "A6"]], 1);
    s += panel(390, 185, "RAID 10", "मिरर + स्ट्राइप", [["A1", "A3"], ["A1", "A3"], ["A2", "A4"], ["A2", "A4"]], 2);
    return svg(350, "RAID 0, 1, 5 और 10 की डिस्क व्यवस्था", s);
  };

  /* 19 — DNS / DHCP */
  D.dns = function () {
    var s = "";
    s += t(20, 26, "DHCP — DORA", "v-title", "start");
    s += box(25, 42, 100, 56, "क्लाइंट", "नया PC", "brand");
    s += box(180, 42, 90, 56, "स्विच", "", "");
    s += box(320, 42, 130, 56, "DHCP सर्वर", "स्कोप", "accent");
    s += arrow(125, 56, 178, 56, "hot"); s += arrow(178, 84, 125, 84, "good");
    s += arrow(270, 56, 318, 56, "hot"); s += arrow(318, 84, 270, 84, "good");
    s += t(150, 48, "1 Discover", "v-sub", "middle");
    s += t(150, 100, "2 Offer", "v-sub", "middle");
    s += t(295, 48, "3 Request", "v-sub", "middle");
    s += t(295, 100, "4 Ack", "v-sub", "middle");
    s += t(320, 118, "IP + मास्क + GW + DNS + लीज़", "v-sub", "start");
    s += t(20, 178, "DNS — नाम से पता", "v-title", "start");
    s += box(25, 200, 105, 60, "क्लाइंट", "ब्राउज़र", "brand");
    s += box(185, 200, 120, 60, "लोकल DNS", "फ़ॉरवर्डर", "");
    s += box(360, 118, 105, 50, "रूट", "root", "");
    s += box(500, 200, 100, 60, "TLD", ".local", "");
    s += box(640, 118, 100, 60, "ऑथोरिटेटिव", "A रिकॉर्ड", "accent");
    s += arrow(130, 220, 183, 220, "hot"); s += t(156, 213, "1", "v-sub", "middle");
    s += path("M305 210 C 330 170 340 145 358 143", "hot arrow"); s += t(335, 168, "2", "v-sub", "middle");
    s += path("M412 168 C 450 180 470 200 498 216", "hot arrow"); s += t(458, 182, "3", "v-sub", "middle");
    s += path("M600 200 C 620 180 630 165 638 150", "hot arrow"); s += t(625, 178, "4", "v-sub", "middle");
    s += path("M690 178 C 690 270 300 300 130 260", "good dash arrow"); s += t(430, 296, "5 उत्तर: 192.168.10.25", "v-sub", "middle");
    s += token("M130 220 H183", "1.8s", "hot");
    s += token("M412 168 L498 216", "2.2s", "hot");
    s += token("M690 178 C 690 270 300 300 130 260", "4.6s", "good");
    return svg(360, "DHCP DORA और DNS रिज़ॉल्यूशन", s);
  };

  /* 20 — VPN */
  D.vpn = function () {
    var s = "";
    s += box(25, 108, 110, 72, "रिमोट क्लाइंट", "लैपटॉप", "brand");
    s += '<path d="M200 150 C 170 95 235 80 260 112 C 300 82 340 118 330 150 C 345 190 295 205 265 185 C 235 205 195 190 200 150 Z" class="v-cloud"/>';
    s += t(265, 160, "इंटरनेट", "v-title", "middle");
    s += box(390, 100, 130, 82, "VPN सर्वर", "फायरवॉल + RRAS", "accent");
    s += box(570, 104, 80, 72, "स्विच", "LAN", "");
    s += box(675, 55, 70, 50, "फ़ाइल सर्वर", "", "");
    s += box(675, 130, 70, 50, "DC", "", "");
    s += box(390, 20, 130, 48, "RADIUS / NPS", "MFA नीति", "");
    s += path("M135 144 C 215 128 300 128 388 132", "good dash");
    s += t(265, 120, "एन्क्रिप्टेड टनल", "v-sub good", "middle");
    s += '<rect x="245" y="132" width="26" height="20" rx="4" class="v-lock"/><path d="M250 132 V125 A8 8 0 0 1 266 125 V132" class="v-line good"/>';
    s += arrow(520, 140, 568, 140, "hot");
    s += arrow(650, 120, 673, 90, "cool");
    s += arrow(650, 155, 673, 155, "cool");
    s += arrow(455, 68, 455, 98, "cool");
    s += token("M135 144 C 215 128 300 128 388 132", "4s", "good");
    s += t(390, 205, "टनल के अंदर पैकेट एन्क्रिप्टेड", "v-sub", "start");
    s += t(740, 285, "पहचान जाँच के बिना टनल नहीं", "v-sub", "end");
    return svg(300, "VPN टनल, RADIUS और LAN पहुँच", s);
  };

  /* 21 — Active Directory */
  D.ad = function () {
    var s = "";
    s += box(285, 20, 190, 52, "डोमेन", "chnm.local", "brand");
    s += line(380, 72, 380, 90, "hot");
    s += line(150, 90, 610, 90, "hot");
    s += line(150, 90, 150, 108, "hot") + line(380, 90, 380, 108, "hot") + line(610, 90, 610, 108, "hot");
    s += box(90, 108, 120, 48, "OU: Sales", "उपयोगकर्ता", "");
    s += box(320, 108, 120, 48, "OU: IT", "उपयोगकर्ता", "");
    s += box(550, 108, 120, 48, "OU: HR", "उपयोगकर्ता", "");
    s += box(90, 178, 120, 40, "राकेश", "User", "accent");
    s += box(320, 178, 120, 40, "नेहा", "User", "accent");
    s += box(550, 178, 120, 40, "अमित", "User", "accent");
    s += box(640, 108, 100, 48, "GPO", "नीति", "warn-box");
    s += t(20, 260, "AGDLP — अनुमति का सही रास्ता", "v-title", "start");
    var chain = [["Account", 20, 130], ["Global Group", 170, 130], ["Domain Local", 320, 150], ["Permission", 490, 140]];
    chain.forEach(function (c) { s += box(c[1], 274, c[2], 40, c[0], "", ""); });
    s += arrow(150, 294, 168, 294, "hot"); s += arrow(300, 294, 318, 294, "hot"); s += arrow(470, 294, 488, 294, "hot");
    s += t(380, 335, "उपयोगकर्ता → समूह → अनुमति, सीधे व्यक्ति को नहीं", "v-sub", "middle");
    return svg(345, "Active Directory का ढाँचा और AGDLP", s);
  };

  /* 22 — IIS */
  D.iis = function () {
    var s = "";
    s += box(25, 118, 100, 70, "ब्राउज़र", "https://", "brand");
    s += box(155, 124, 90, 58, "DNS", "lab.local", "");
    s += box(275, 124, 100, 58, "फायरवॉल", "443 खुला", "accent");
    s += box(405, 105, 110, 88, "IIS साइट", "बाइंडिंग 443", "brand");
    s += box(545, 105, 90, 88, "ऐप पूल", "पहचान", "");
    s += box(665, 105, 80, 88, "डेटाबेस", "SQL", "");
    s += box(405, 24, 140, 50, "TLS 1.2/1.3", "हैंडशेक", "");
    s += box(560, 24, 120, 50, "सर्टिफिकेट", "नवीनीकरण", "warn-box");
    s += arrow(125, 150, 153, 150, "hot");
    s += arrow(245, 150, 273, 150, "hot");
    s += arrow(375, 150, 403, 150, "hot");
    s += arrow(515, 150, 543, 150, "hot");
    s += arrow(635, 150, 663, 150, "hot");
    s += arrow(470, 74, 470, 103, "cool");
    s += token("M125 150 H470", "3.2s", "hot");
    s += t(330, 210, "HTTP 301 → HTTPS 443", "v-sub", "middle");
    s += t(330, 230, "HSTS + सही सर्टिफिकेट चेन", "v-sub", "middle");
    s += badge(25, 235, 245, 42, "बैकअप + restore टेस्ट किए बिना अधूरा", "warn");
    return svg(300, "HTTPS वेब होस्टिंग का अनुरोध पथ", s);
  };

  /* 23 — हार्डनिंग */
  D.hardening = function () {
    var s = "";
    s += '<rect x="300" y="70" width="170" height="170" rx="16" class="v-server"/>';
    s += t(385, 105, "सर्वर", "v-title", "middle");
    s += t(385, 125, "केवल आवश्यक सेवा", "v-sub", "middle");
    s += '<path d="M385 132 L445 150 V185 C445 220 415 238 385 245 C355 238 325 220 325 185 V150 Z" class="v-shield"/>';
    s += t(385, 195, "बेसलाइन", "v-badge-text", "middle");
    s += t(385, 212, "लागू", "v-badge-text", "middle");
    var bad = [["RDP 3389", 95], ["SMB 445", 145], ["FTP 21", 195]];
    bad.forEach(function (b) {
      s += '<rect x="25" y="' + (b[1] - 14) + '" width="110" height="30" rx="6" class="v-port bad"/>';
      s += t(80, b[1] + 6, b[0], "v-sub", "middle");
      s += line(135, b[1], 295, 155, "bad dash arrow");
      s += t(215, b[1] - 6, "✕", "v-bad-mark", "middle");
    });
    var good = [["80 / 443", 80], ["DNS 53", 135], ["NTP 123", 190]];
    good.forEach(function (b) {
      s += '<rect x="510" y="' + (b[1] - 14) + '" width="100" height="30" rx="6" class="v-port good"/>';
      s += t(560, b[1] + 6, b[0], "v-sub", "middle");
      s += line(470, b[1], 510, b[1], "good");
    });
    s += t(500, 65, "खुले पोर्ट", "v-sub good", "middle");
    s += badge(25, 240, 250, 40, "छोटा हमला-सतह = कम जोखिम", "brand");
    s += t(600, 240, "पैच · कम अधिकार · लॉग", "v-sub", "middle");
    s += t(600, 258, "फायरवॉल · बैकअप", "v-sub", "middle");
    return svg(300, "सर्वर हार्डनिंग और पोर्ट सतह", s);
  };

  /* 24 — Linux परमिशन */
  D.linux = function () {
    var s = "";
    s += box(30, 25, 180, 36, "report.txt", "", "");
    var roles = [["owner (u)", 60], ["group (g)", 210], ["other (o)", 360]];
    var bits = [["r", 1], ["w", 1], ["x", 1], ["r", 1], ["w", 0], ["x", 1], ["r", 1], ["w", 0], ["x", 0]];
    s += t(20, 82, "बिट", "v-sub", "start");
    roles.forEach(function (r, ri) {
      s += t(r[1] + 45, 82, r[0], "v-sub", "middle");
      for (var bi = 0; bi < 3; bi += 1) {
        var val = bits[ri * 3 + bi][1];
        s += '<rect x="' + (r[1] + bi * 30) + '" y="94" width="26" height="32" rx="4" class="v-bit' + (val ? " on" : " off") + '"/>';
        s += t(r[1] + bi * 30 + 13, 116, bits[ri * 3 + bi][0], "v-bit-text", "middle");
      }
    });
    s += box(500, 88, 150, 70, "754", "rwxr-xr--", "brand");
    s += t(575, 172, "प्रत्येक अष्टक", "v-sub", "middle");
    s += t(575, 189, "r=4 · w=2 · x=1", "v-sub", "middle");
    s += '<rect x="30" y="210" width="470" height="44" rx="8" class="v-code"/>';
    s += '<text x="44" y="238" class="v-code-text">$ chmod 754 report.txt</text>';
    s += t(30, 285, "4+2+1 = 7   ·   4+0+1 = 5   ·   4+0+0 = 4", "v-sub", "start");
    s += box(525, 210, 200, 44, "अनुमति जाँचें", "id + ls -l", "accent");
    s += t(625, 285, "स्वामी बदलने के लिए chown", "v-sub", "middle");
    return svg(300, "Linux फ़ाइल परमिशन और chmod", s);
  };

  /* 25 — DMZ */
  D.dmz = function () {
    var s = "";
    s += '<path d="M25 95 C 0 55 55 30 80 55 C 100 25 155 40 150 80 C 175 105 145 140 110 135 C 80 155 40 135 25 95 Z" class="v-cloud"/>';
    s += t(88, 95, "इंटरनेट", "v-title", "middle");
    s += box(25, 22, 100, 40, "हमलावर", "बाहरी", "bad");
    s += line(80, 62, 195, 105, "bad dash");
    s += t(155, 70, "✕", "v-bad-mark", "middle");
    s += '<rect x="195" y="70" width="120" height="170" rx="10" class="v-firewall"/>';
    s += t(255, 95, "एज फायरवॉल", "v-title", "middle");
    s += t(255, 116, "ACL + IPS", "v-sub", "middle");
    s += t(255, 140, "443 → DMZ", "v-sub", "middle");
    s += t(255, 158, "LAN → सीमित", "v-sub", "middle");
    s += '<rect x="355" y="28" width="230" height="112" rx="10" class="v-zone dmz"/>';
    s += t(470, 50, "DMZ", "v-title", "middle");
    s += box(375, 63, 85, 55, "वेब सर्वर", "443", "brand");
    s += box(475, 63, 90, 55, "मेल सर्वर", "25/993", "brand");
    s += '<rect x="355" y="175" width="280" height="112" rx="10" class="v-zone"/>';
    s += t(495, 197, "आंतरिक LAN", "v-title", "middle");
    s += box(375, 212, 90, 55, "DC", "DNS/AD", "");
    s += box(480, 212, 90, 55, "डेटाबेस", "SQL", "");
    s += box(600, 70, 110, 60, "VPN", "RADIUS", "accent");
    s += arrow(315, 105, 353, 90, "good");
    s += path("M315 190 C 335 210 350 225 373 235", "good arrow");
    s += arrow(655, 130, 655, 173, "cool");
    s += t(255, 265, "हर नियम की दिशा और आवश्यकता लिखें", "v-sub", "middle");
    return svg(305, "DMZ, फायरवॉल और आंतरिक नेटवर्क", s);
  };

  function render(id) {
    return D[id] ? D[id]() : "";
  }

  window.FITradeVisual = { render: render, has: function (id) { return Boolean(D[id]); } };
})();
