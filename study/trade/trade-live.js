/* Trade Theory · विषय-वार डेटा + लाइव सिमुलेटर इंजन */
(function () {
  "use strict";

  var THEMES = [
    { id: "safety", label: "सुरक्षा एवं वर्कशॉप", icon: "🛡️" },
    { id: "power", label: "पावर एवं इलेक्ट्रॉनिक्स", icon: "⚡" },
    { id: "hardware", label: "हार्डवेयर एवं सर्विसिंग", icon: "🔧" },
    { id: "storage", label: "स्टोरेज एवं बैकअप", icon: "💾" },
    { id: "network", label: "नेटवर्किंग", icon: "🌐" },
    { id: "server", label: "सर्वर, DNS एवं डायरेक्टरी", icon: "🖥️" },
    { id: "security", label: "सर्वर एवं नेटवर्क सुरक्षा", icon: "🔐" }
  ];

  var EXTRA = {
    1: {
      theme: "safety",
      diagrams: [{ svg: "earthing", title: "अर्थिंग और फॉल्ट करंट का रास्ता", caption: "फेज का फॉल्ट चेसिस से अर्थ तार होते हुए जमीन में जाता है — RCCB 30 mA पर ट्रिप करता है।" }],
      live: [{ type: "live", scene: "lab", lab: "shock", title: "शॉक करंट और RCCB — लाइव लैब", instructions: "वोल्टेज, प्रतिरोध, RCCB और जूते बदलकर देखें कब करंट घातक बनता है और बचता है।" }]
    },
    2: {
      theme: "power",
      diagrams: [{ svg: "smps", title: "SMPS का पावर और फीडबैक पथ", caption: "230 V AC से +12 V, +5 V और 3.3 V तक — PWM फीडबैक आउटपुट को स्थिर रखता है।" }],
      live: [{ type: "live", scene: "smps", title: "SMPS आउटपुट — लाइव ऑसिलोस्कोप", instructions: "ड्यूटी और लोड बदलें, फिर देखें कि आउटपुट वोल्टेज और रिपल कैसे बदलते हैं।" }]
    },
    3: {
      theme: "hardware",
      diagrams: [{ svg: "pc", title: "पीसी उप-प्रणालियाँ और डेटा बस", caption: "CPU, RAM, GPU और स्टोरेज एक-दूसरे से बस और PCIe लेन से जुड़े हैं; PSU सबको रेल देता है।" }],
      live: [{ type: "live", scene: "post", title: "POST बूट — लाइव बीप कोड", instructions: "खराबी चुनकर पावर ऑन करें; देखें कि POST किस चरण पर रुकता है और कौन-सा बीप कोड आता है।" }]
    },
    4: {
      theme: "hardware",
      diagrams: [{ svg: "keyboard", title: "कीबोर्ड मैट्रिक्स और स्कैन-कोड पथ", caption: "कंट्रोलर एक-एक पंक्ति स्कैन करता है; R1 + C2 का मिलान होने पर कुंजी पहचानी जाती है।" }],
      live: [{ type: "live", scene: "lab", lab: "kb", title: "कीबोर्ड मैट्रिक्स स्कैनर — लाइव", instructions: "पंक्तियाँ, स्तंभ, स्कैन दर और डीबाउंस बदलें; विलंब और तार बचत लाइव देखें।" }]
    },
    5: {
      theme: "storage",
      diagrams: [{ svg: "hdd", title: "हार्ड डिस्क की यांत्रिक बनावट", caption: "प्लेटर घूमता है, एक्ट्यूएटर हेड को सही ट्रैक पर ले जाता है; सीक + रोटेशन समय ही विलंब बनाते हैं।" }],
      live: [{ type: "live", scene: "hdd", title: "HDD सीक और थ्रूपुट — लाइव", instructions: "RPM, ब्लॉक साइज़ और पढ़ने का तरीका बदलकर विलंब व थ्रूपुट देखें।" }]
    },
    6: {
      theme: "hardware",
      diagrams: [{ svg: "motherboard", title: "मदरबोर्ड के मुख्य स्लॉट और कनेक्टर", caption: "CPU सॉकेट, RAM स्लॉट, PCIe, M.2, SATA और पावर हेडर — अपग्रेड से पहले यही पहचानें।" }],
      live: [{ type: "live", scene: "ram", title: "RAM बैंडविड्थ लैब", instructions: "DDR पीढ़ी, स्पीड और चैनल बदलें; बैंडविड्थ और विलंब लाइव देखें।" }]
    },
    7: {
      theme: "hardware",
      diagrams: [{ svg: "laptop", title: "लैपटॉप का पावर वितरण", caption: "एडाप्टर → चार्जिंग IC → बैटरी/PMIC → CPU, GPU, RAM, SSD और डिस्प्ले।" }],
      live: [{ type: "live", scene: "lab", lab: "laptop", title: "लैपटॉप बैटरी व चार्जिंग — लाइव", instructions: "क्षमता, लोड, स्वास्थ्य और एडाप्टर बदलें; रनटाइम, चार्ज समय और हेडरूम तुरंत दिखेगा।" }]
    },
    8: {
      theme: "hardware",
      diagrams: [{ svg: "printer", title: "लेज़र प्रिंटर का इलेक्ट्रोफोटोग्राफिक चक्र", caption: "चार्ज → एक्सपोज़ → डेवलप → ट्रांसफर → फ्यूज़ → क्लीन, यही छह चरण हर पेज पर दोहराते हैं।" }],
      live: [{ type: "live", scene: "printer", title: "लेज़र प्रिंट चक्र — लाइव", instructions: "चक्र चलाएँ या एक-एक चरण करें; ड्रम घूमता और पेपर आगे बढ़ता दिखेगा।" }]
    },
    9: {
      theme: "hardware",
      diagrams: [{ svg: "scanner", title: "फ्लैटबेड स्कैनर का प्रकाश पथ", caption: "लैंप दस्तावेज़ को रोशन करता है; मिरर → लेंस → CCD/CIS → ADC → USB, यही स्कैन पथ है।" }],
      live: [{ type: "live", scene: "lab", lab: "scan", title: "स्कैन रिज़ॉल्यूशन एवं फाइल साइज़ — लाइव", instructions: "DPI, पृष्ठ आकार, मोड और संपीड़न बदलकर फाइल साइज़, समय और OCR गुणवत्ता देखें।" }]
    },
    10: {
      theme: "hardware",
      diagrams: [{ svg: "lcd", title: "LCD पैनल की परतें और प्रकाश पथ", caption: "बैकलाइट की रोशनी डिफ्यूज़र, पोलराइज़र, TFT और कलर फ़िल्टर से होकर आँख तक पहुँचती है।" }],
      live: [{ type: "live", scene: "lab", lab: "display", title: "डिस्प्ले बैंडविड्थ लैब — लाइव", instructions: "रेज़ोल्यूशन, रिफ्रेश, बिट डेप्थ और इंटरफ़ेस चुनें; कब स्क्रीन काली होगी, तुरंत देखें।" }]
    },
    11: {
      theme: "hardware",
      diagrams: [{ svg: "upgrade", title: "अपग्रेड की अनुकूलता और PSU बजट", caption: "सॉकेट, RAM पीढ़ी, BIOS समर्थन और PSU हेडरूम — चारों जाँच के बाद ही अपग्रेड करें।" }],
      live: [{ type: "live", scene: "lab", lab: "upgrade", title: "अपग्रेड बनाम नई मशीन — लाइव", instructions: "लागत, समय और बिजली बचत बदलें; पे-बैक और 3-वर्ष बचत से निर्णय खुद बन जाएगा।" }]
    },
    12: {
      theme: "storage",
      diagrams: [{ svg: "backup", title: "बैकअप की 3-2-1 रणनीति", caption: "3 प्रतियाँ, 2 अलग मीडिया, 1 ऑफ़साइट; और समय-समय पर restore टेस्ट।" }],
      live: [{ type: "live", scene: "lab", lab: "backup", title: "बैकअप विंडो एवं restore — लाइव", instructions: "डेटा, गति, बदलाव और प्रकार बदलें; रात की विंडो में समाता है या नहीं और RTO देखें।" }]
    },
    13: {
      theme: "hardware",
      diagrams: [{ svg: "tablet", title: "टैबलेट का ब्लॉक डायग्राम", caption: "SoC के चारों ओर RAM, स्टोरेज, डिस्प्ले, टच, कैमरा, वायरलेस और बैटरी/चार्जिंग।" }],
      live: [{ type: "live", scene: "lab", lab: "charge", title: "टैबलेट चार्जिंग निदान — लाइव", instructions: "केबल, पोर्ट, ताप और चार्जर बदलकर देखें करंट कहाँ गिरता है और कारण क्या बनता है।" }]
    },
    14: {
      theme: "power",
      diagrams: [{ svg: "ups", title: "UPS का पावर पथ और ट्रांसफर", caption: "मेन्स उपलब्ध हो तो सीधे लोड; आउटेज पर बैटरी → इन्वर्टर → ATS → लोड।" }],
      live: [{ type: "live", scene: "ups", title: "UPS रनटाइम लैब", instructions: "लोड, बैटरी क्षमता और मेन्स की स्थिति बदलें; बैकअप समय लाइव देखें।" }]
    },
    15: {
      theme: "network",
      diagrams: [{ svg: "osi", title: "OSI मॉडल और डेटा एनकैप्सुलेशन", caption: "ऊपर से नीचे जाते हुए डेटा में हर परत अपना हेडर जोड़ती है; नीचे से ऊपर आते हुए हटाती है।" }],
      live: [{ type: "live", scene: "subnet", title: "सबनेट कैलकुलेटर — लाइव बिट्स", instructions: "IP और प्रीफ़िक्स बदलें; नेटवर्क बिट्स, रेंज और होस्ट संख्या तुरंत देखें।" }]
    },
    16: {
      theme: "network",
      diagrams: [{ svg: "network", title: "हब, स्विच और VLAN का फ्रेम पथ", caption: "स्विच MAC टेबल से फ्रेम भेजता है; अलग VLAN के बीच जाने के लिए L3 राउटिंग चाहिए।" }],
      live: [{ type: "live", scene: "vlan", title: "VLAN फ्रेम फ़ॉरवर्डिंग — लाइव", instructions: "स्रोत और गंतव्य पोर्ट चुनें; फ्रेम उसी VLAN में जाएगा या राउटर से होकर, या गिर जाएगा।" }]
    },
    17: {
      theme: "network",
      diagrams: [{ svg: "wireless", title: "AP कवरेज, PoE और चैनल ओवरलैप", caption: "सिग्नल दूरी के साथ कमजोर होता है; 2.4 GHz में 1, 6, 11 ही ओवरलैप-मुक्त हैं।" }],
      live: [{ type: "live", scene: "wireless", title: "Wi-Fi सिग्नल लैब", instructions: "दूरी, चैनल और बैंड बदलें; RSSI और अनुमानित स्पीड लाइव देखें।" }]
    },
    18: {
      theme: "server",
      diagrams: [{ svg: "raid", title: "RAID 0, 1, 5 और 10 की डिस्क व्यवस्था", caption: "स्पीड, मिरर और पैरिटी के बीच समझौता; RAID बैकअप का विकल्प नहीं है।" }],
      live: [{ type: "live", scene: "raid", title: "RAID लाइव — डिस्क विफलता", instructions: "RAID स्तर चुनें, डिस्क विफल करें और देखें कि डेटा बचता है या नहीं।" }]
    },
    19: {
      theme: "server",
      diagrams: [{ svg: "dns", title: "DHCP DORA और DNS रिज़ॉल्यूशन", caption: "DHCP पता देता है, DNS नाम को पते में बदलता है — दोनों अलग सेवाएँ हैं।" }],
      live: [{ type: "live", scene: "dora", title: "DHCP DORA — लाइव", instructions: "कनेक्ट दबाकर चारों संदेश क्रम से देखें; अंत में मिला पता और लीज़ पढ़ें।" }]
    },
    20: {
      theme: "server",
      diagrams: [{ svg: "vpn", title: "VPN टनल, RADIUS और LAN पहुँच", caption: "एन्क्रिप्टेड टनल के अंदर पैकेट जाता है; पहचान की जाँच RADIUS/NPS करता है।" }],
      live: [{ type: "live", scene: "lab", lab: "vpn", title: "VPN सुरंग जोखिम लैब — लाइव", instructions: "प्रोटोकॉल, पहचान, पासवर्ड लंबाई और खुले पोर्ट बदलें; brute-force समय और जोखिम देखें।" }]
    },
    21: {
      theme: "server",
      diagrams: [{ svg: "ad", title: "Active Directory का ढाँचा और AGDLP", caption: "Account → Global Group → Domain Local Group → Permission; अनुमति सीधे व्यक्ति को नहीं।" }],
      live: [{ type: "live", scene: "lab", lab: "perm", title: "शेयर + NTFS प्रभावी अधिकार — लाइव", instructions: "दोनों परतें, लक्ष्य और Deny बदलें; नेटवर्क बनाम स्थानीय पहुँच का फर्क तुरंत दिखेगा।" }]
    },
    22: {
      theme: "server",
      diagrams: [{ svg: "iis", title: "HTTPS वेब होस्टिंग का अनुरोध पथ", caption: "DNS नाम हल करता है, फायरवॉल 443 खोलता है, IIS बाइंडिंग और सर्टिफिकेट संभालता है।" }],
      live: [{ type: "live", scene: "lab", lab: "web", title: "HTTPS साइट जाँच — लाइव निर्णय वृक्ष", instructions: "DNS, बाइंडिंग, फायरवॉल, सेवा और क्षमता बदलें; पहली टूटी कड़ी और HTTP नतीजा देखें।" }]
    },
    23: {
      theme: "security",
      diagrams: [{ svg: "hardening", title: "सर्वर हार्डनिंग और पोर्ट सतह", caption: "केवल आवश्यक पोर्ट खोलें, अनावश्यक सेवा बंद करें और ऑडिट लॉग चालू रखें।" }],
      live: [{ type: "live", scene: "lab", lab: "harden", title: "हार्डनिंग स्कोर — लाइव", instructions: "पोर्ट, पैच देरी, कमजोर नीतियाँ और रक्षा क्रेडिट बदलकर हमला-सतह व जोखिम देखें।" }]
    },
    24: {
      theme: "server",
      diagrams: [{ svg: "linux", title: "Linux फ़ाइल परमिशन और chmod", caption: "rwxr-xr-- = 754; मालिक, समूह और अन्य के लिए अलग-अलग अधिकार।" }],
      live: [{ type: "live", scene: "chmod", title: "chmod लैब — लाइव बिट्स", instructions: "rwx बिट बदलें; अष्टक, कमांड और प्रभावी अनुमति तुरंत देखें।" }]
    },
    25: {
      theme: "security",
      diagrams: [{ svg: "dmz", title: "DMZ, फायरवॉल और आंतरिक नेटवर्क", caption: "इंटरनेट से सीधे LAN नहीं; DMZ में सार्वजनिक सेवा और आंतरिक नेटवर्क पर सीमित नियम।" }],
      live: [{ type: "live", scene: "lab", lab: "dmz", title: "फायरवॉल नियम जाँच — लाइव", instructions: "स्रोत, गंतव्य और पोर्ट चुनें; PERMIT/DENY, कारण और लॉग प्रविष्टि तुरंत दिखेगी।" }]
    }
  };

  var modules = window.TRADE_MODULES || [];
  modules.forEach(function (module) {
    var extra = EXTRA[module.id];
    if (!extra) return;
    if (extra.theme) module.theme = extra.theme;
    if (extra.diagrams) module.diagrams = extra.diagrams;
    if (extra.live) module.sims = (module.sims || []).concat(extra.live);
  });

  window.TRADE_THEMES = THEMES;
  window.TRADE_EXTRA = EXTRA;

  /* ------------------------------------------------------------------ */
  /* helpers                                                            */
  /* ------------------------------------------------------------------ */
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function fmt(value, digits) {
    return Number(value).toLocaleString("en-IN", { maximumFractionDigits: digits == null ? 2 : digits });
  }

  function shell(body, sim) {
    var root = document.createElement("div");
    root.className = "live-sim";
    root.innerHTML =
      '<div class="live-top"><span class="live-dot" aria-hidden="true"></span><b>LIVE</b><span>' + esc(sim.title) + "</span></div>" +
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

  function stats(container, items) {
    container.innerHTML = '<div class="live-grid">' + items.map(function (item) {
      return '<div class="live-stat' + (item.kind ? " " + item.kind : "") + '"><span>' + esc(item.label) + "</span><b>" + esc(item.value) + "</b></div>";
    }).join("") + "</div>";
  }

  function status(ui, text, kind) {
    ui.status.className = "live-status" + (kind ? " " + kind : "");
    ui.status.textContent = text;
  }

  function finish(ui, ctx, text) {
    status(ui, text, "good");
    if (ui.finished) return;
    ui.finished = true;
    if (ctx && ctx.done) ctx.done();
  }

  function bindRange(root, selector, onInput) {
    var input = root.querySelector(selector);
    if (!input) return null;
    input.addEventListener("input", function () {
      var out = input.parentNode.querySelector("output");
      if (out) out.textContent = input.value + (input.getAttribute("data-unit") || "");
      onInput(Number(input.value));
    });
    return input;
  }

  /* ------------------------------------------------------------------ */
  /* 1. SMPS oscilloscope                                               */
  /* ------------------------------------------------------------------ */
  function sceneSmps(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<label class="live-field">ड्यूटी साइकिल <output>45%</output><input type="range" min="20" max="85" step="1" value="45" data-unit="%" id="lvDuty"></label>' +
        '<label class="live-field">लोड <output>60%</output><input type="range" min="10" max="100" step="5" value="60" data-unit="%" id="lvLoad"></label>' +
        '<button type="button" class="btn btn-sm" id="lvPlay">रोकें</button>' +
        '<button type="button" class="btn btn-sm btn-ghost" id="lvLock">माप लॉक करें</button>' +
      "</div>";
    ui.stage.innerHTML = '<canvas class="live-scope" width="640" height="270" aria-label="SMPS वेवफॉर्म स्कोप"></canvas>';

    var duty = 45, load = 60, playing = true, phase = 0;
    var canvas = ui.stage.querySelector("canvas");
    var g = canvas.getContext("2d");

    function calc() {
      var vout = 12 * (duty / 45);
      var ripple = 18 + load * 1.1 * (1 - Math.abs(duty - 45) / 70);
      var eff = 93 - Math.max(0, load - 70) * 0.28 - Math.abs(duty - 45) * 0.06;
      return { vout: Math.max(1.2, Math.min(26, vout)), ripple: Math.max(8, ripple), eff: Math.max(70, eff) };
    }

    function draw() {
      var c = calc();
      var w = canvas.width, h = canvas.height;
      g.clearRect(0, 0, w, h);
      g.fillStyle = "#071a25";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "rgba(120,170,195,.18)";
      g.lineWidth = 1;
      for (var x = 0; x <= w; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      for (var y = 0; y <= h; y += 30) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      g.fillStyle = "#9fc3d6";
      g.font = "12px system-ui, sans-serif";
      g.fillText("PWM गेट", 10, 18);
      g.fillText("आउटपुट रिपल", 10, 156);

      var cycle = 70, p = phase % cycle;
      g.strokeStyle = "#58c4a9";
      g.lineWidth = 2;
      g.beginPath();
      for (var i = 0; i <= w; i += 2) {
        var ph = ((i + p) % cycle) / cycle * 100;
        var yv = ph < duty ? 88 : 122;
        if (i === 0) g.moveTo(i, yv); else g.lineTo(i, yv);
      }
      g.stroke();

      var amp = Math.min(60, c.ripple * 0.9);
      g.strokeStyle = "#e0a43d";
      g.beginPath();
      for (var j = 0; j <= w; j += 2) {
        var ph2 = ((j + p) % cycle) / cycle;
        var saw = (ph2 < duty ? ph2 / duty : 0) * amp;
        var yy = 220 - saw;
        if (j === 0) g.moveTo(j, yy); else g.lineTo(j, yy);
      }
      g.stroke();

      g.fillStyle = "rgba(224,164,61,.14)";
      g.fillRect(0, 220 - amp, w, amp);

      g.fillStyle = "#eaf4f9";
      g.font = "bold 13px system-ui, sans-serif";
      g.fillText("Vout " + c.vout.toFixed(1) + " V", 470, 20);
      g.fillStyle = "#9fc3d6";
      g.font = "12px system-ui, sans-serif";
      g.fillText("रिपल " + Math.round(c.ripple) + " mV", 470, 38);
      g.fillText("दक्षता " + c.eff.toFixed(1) + "%", 470, 56);

      stats(ui.readout, [
        { label: "आउटपुट वोल्टेज", value: c.vout.toFixed(1) + " V", kind: Math.abs(c.vout - 12) <= 0.6 ? "good" : "bad" },
        { label: "रिपल", value: Math.round(c.ripple) + " mV" },
        { label: "दक्षता", value: c.eff.toFixed(1) + "%" },
        { label: "स्थिति", value: Math.abs(c.vout - 12) <= 0.6 ? "±5% में" : "सहनशीलता से बाहर", kind: Math.abs(c.vout - 12) <= 0.6 ? "good" : "bad" }
      ]);
    }

    function loop() {
      if (playing) { phase += 1.4; draw(); }
      requestAnimationFrame(loop);
    }

    bindRange(ui.root, "#lvDuty", function (v) { duty = v; draw(); });
    bindRange(ui.root, "#lvLoad", function (v) { load = v; draw(); });
    ui.root.querySelector("#lvPlay").addEventListener("click", function () {
      playing = !playing;
      this.textContent = playing ? "रोकें" : "चलाएँ";
    });
    ui.root.querySelector("#lvLock").addEventListener("click", function () {
      var c = calc();
      if (Math.abs(c.vout - 12) > 0.6) {
        status(ui, "आउटपुट सहनशीलता से बाहर है — ड्यूटी/फीडबैक जाँचें।", "bad");
        return;
      }
      finish(ui, ctx, "माप लॉक: Vout " + c.vout.toFixed(1) + " V, रिपल " + Math.round(c.ripple) + " mV — यही स्वस्थ रेल है।");
    });
    draw();
    loop();
  }

  /* ------------------------------------------------------------------ */
  /* 2. POST boot                                                        */
  /* ------------------------------------------------------------------ */
  function scenePost(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<label class="live-field">खराबी <select id="lvFault" class="input">' +
          '<option value="none">कोई खराबी नहीं</option>' +
          '<option value="psu">PSU / पावर नहीं</option>' +
          '<option value="ram">RAM</option>' +
          '<option value="gpu">ग्राफिक्स कार्ड</option>' +
          '<option value="cmos">CMOS / BIOS</option>' +
        "</select></label>" +
        '<button type="button" class="btn btn-sm" id="lvPower">पावर ऑन</button>' +
        '<button type="button" class="btn btn-sm btn-ghost" id="lvReset">रीसेट</button>' +
      "</div>";
    ui.stage.innerHTML =
      '<div class="post-wrap">' +
        '<div class="post-pc"><span class="post-led"></span><b>POST</b><small>पावर-ऑन सेल्फ टेस्ट</small></div>' +
        '<ol class="post-steps">' +
          '<li data-step="psu"><span>1</span><b>PSU रेल</b><small>+12V, +5V, 3.3V</small></li>' +
          '<li data-step="cpu"><span>2</span><b>CPU</b><small>रीसेट + माइक्रोकोड</small></li>' +
          '<li data-step="ram"><span>3</span><b>RAM</b><small>मेमोरी टेस्ट</small></li>' +
          '<li data-step="gpu"><span>4</span><b>VGA</b><small>डिस्प्ले इनिशियलाइज़</small></li>' +
          '<li data-step="kb"><span>5</span><b>कीबोर्ड</b><small>इनपुट जाँच</small></li>' +
          '<li data-step="boot"><span>6</span><b>बूट</b><small>BIOS → OS</small></li>' +
        "</ol>" +
      "</div>";
    var timer = null;
    var order = ["psu", "cpu", "ram", "gpu", "kb", "boot"];
    var rows = {};
    Array.prototype.forEach.call(ui.stage.querySelectorAll(".post-steps li"), function (li) {
      rows[li.getAttribute("data-step")] = li;
    });

    function reset() {
      if (timer) { clearTimeout(timer); timer = null; }
      Object.keys(rows).forEach(function (key) {
        rows[key].className = "";
        rows[key].querySelector("span").textContent = String(order.indexOf(key) + 1);
      });
      ui.stage.querySelector(".post-led").classList.remove("on");
      stats(ui.readout, [{ label: "POST स्थिति", value: "तैयार" }, { label: "बीप कोड", value: "—" }, { label: "निदान", value: "पावर ऑन दबाएँ" }]);
      status(ui, "खराबी चुनकर पावर ऑन करें।", "");
    }

    function setStep(key, cls) { if (rows[key]) rows[key].className = cls || ""; }

    function run() {
      if (timer) { clearTimeout(timer); timer = null; }
      var fault = ui.root.querySelector("#lvFault").value;
      var i = 0;
      ui.stage.querySelector(".post-led").classList.add("on");
      status(ui, "POST चल रहा है…", "");
      function next() {
        if (i >= order.length) {
          finish(ui, ctx, "बूट सफल: एक छोटी बीप + OS लोड। POST का क्रम याद रखें।");
          return;
        }
        var key = order[i];
        setStep(key, "done");
        if (key === fault) {
          setStep(key, "fail");
          var beep = fault === "psu" ? "कोई बीप नहीं, पंखा भी नहीं" :
            fault === "ram" ? "3 छोटी बीप (RAM)" :
            fault === "gpu" ? "1 लंबी + 2 छोटी बीप (VGA)" :
            "CMOS checksum error / 1 लंबी + 2 छोटी";
          ui.stage.querySelector(".post-led").classList.remove("on");
          stats(ui.readout, [
            { label: "POST स्थिति", value: order.indexOf(key) + 1 + " / 6 पर रुका", kind: "bad" },
            { label: "बीप कोड", value: beep, kind: "bad" },
            { label: "निदान", value: fault === "psu" ? "पावर रेल और 24-pin जाँचें" : fault === "ram" ? "RAM निकालकर एक-एक स्टिक जाँचें" : fault === "gpu" ? "GPU/डिस्प्ले केबल बदलकर देखें" : "CMOS बैटरी और BIOS रीसेट करें" }
          ]);
          finish(ui, ctx, "खराबी मिली: POST " + order.indexOf(key) + 1 + " पर रुका — अब मापकर पुष्टि करें, अनुमान से बदलें नहीं।");
          return;
        }
        i += 1;
        timer = setTimeout(next, 650);
      }
      next();
    }

    ui.root.querySelector("#lvPower").addEventListener("click", run);
    ui.root.querySelector("#lvReset").addEventListener("click", reset);
    reset();
  }

  /* ------------------------------------------------------------------ */
  /* 3. HDD                                                              */
  /* ------------------------------------------------------------------ */
  function sceneHdd(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<label class="live-field">RPM <select class="input" id="lvRpm"><option value="5400">5400</option><option value="7200" selected>7200</option><option value="10000">10000</option></select></label>' +
        '<label class="live-field">ब्लॉक <select class="input" id="lvBlock"><option value="4">4 KB</option><option value="16" selected>16 KB</option><option value="64">64 KB</option></select></label>' +
        '<label class="live-field">प्रकार <select class="input" id="lvMode"><option value="seq">सीक्वेंशियल</option><option value="rand">रैंडम</option></select></label>' +
        '<button type="button" class="btn btn-sm" id="lvRead">पढ़ें</button>' +
      "</div>";
    ui.stage.innerHTML =
      '<div class="hdd-live">' +
        '<svg viewBox="0 0 420 260" class="hdd-svg" aria-hidden="true">' +
          '<circle cx="170" cy="130" r="105" class="v-platter"/>' +
          '<circle cx="170" cy="130" r="82" class="v-track"/><circle cx="170" cy="130" r="58" class="v-track"/><circle cx="170" cy="130" r="32" class="v-track"/>' +
          '<g class="hdd-rotor"><line x1="170" y1="130" x2="170" y2="28" class="v-line hot"/><circle cx="170" cy="52" r="5" class="v-token"/></g>' +
          '<circle cx="170" cy="130" r="12" class="v-spindle"/>' +
          '<g class="hdd-arm"><line x1="376" y1="216" x2="232" y2="122" class="v-line cool"/><circle cx="376" cy="216" r="10" class="v-spindle"/><path d="M232 122 L214 112 L218 132 Z" class="v-head"/></g>' +
          '<text x="170" y="250" text-anchor="middle" class="v-sub">प्लेटर</text>' +
        "</svg>" +
        '<div class="hdd-badge">हर गुणा 512 B / 4 KB सेक्टर</div>' +
      "</div>";
    var rotor = ui.stage.querySelector(".hdd-rotor");
    var arm = ui.stage.querySelector(".hdd-arm");

    function calc() {
      var rpm = Number(ui.root.querySelector("#lvRpm").value);
      var block = Number(ui.root.querySelector("#lvBlock").value);
      var mode = ui.root.querySelector("#lvMode").value;
      var latency = (60000 / rpm) / 2 + (mode === "rand" ? 4.2 : 0.2);
      var base = rpm === 5400 ? 110 : rpm === 7200 ? 165 : 215;
      var factor = block === 4 ? 0.62 : block === 16 ? 0.9 : 1;
      var throughput = mode === "seq" ? base * factor : 0.9 * factor * (rpm / 7200);
      var iops = throughput * 1024 / block;
      return { rpm: rpm, block: block, mode: mode, latency: latency, throughput: throughput, iops: iops };
    }

    function draw() {
      var c = calc();
      rotor.style.animation = "hdd-spin " + (c.rpm === 5400 ? "2.2s" : c.rpm === 7200 ? "1.4s" : "0.9s") + " linear infinite";
      stats(ui.readout, [
        { label: "औसत विलंब", value: c.latency.toFixed(1) + " ms", kind: c.mode === "rand" ? "bad" : "good" },
        { label: "थ्रूपुट", value: fmt(c.throughput, 1) + " MB/s" },
        { label: "IOPS", value: fmt(Math.round(c.iops)) },
        { label: "सेक्टर साइज़", value: c.block + " KB" }
      ]);
    }

    ["lvRpm", "lvBlock", "lvMode"].forEach(function (id) {
      ui.root.querySelector("#" + id).addEventListener("change", draw);
    });
    ui.root.querySelector("#lvRead").addEventListener("click", function () {
      var c = calc();
      arm.classList.remove("reading");
      void arm.offsetWidth;
      arm.classList.add("reading");
      draw();
      if (c.mode === "rand") {
        finish(ui, ctx, "रैंडम पढ़ने में " + c.latency.toFixed(1) + " ms प्रति I/O लगा — हेड बार-बार सीक कर रहा है।");
      } else {
        finish(ui, ctx, "सीक्वेंशियल पढ़ना तेज़ है: " + fmt(c.throughput, 1) + " MB/s — डेटा लगातार सेक्टर में है।");
      }
    });
    draw();
  }

  /* ------------------------------------------------------------------ */
  /* 4. RAM bandwidth                                                    */
  /* ------------------------------------------------------------------ */
  function sceneRam(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<label class="live-field">DDR <select class="input" id="lvGen"><option value="1600">DDR3-1600</option><option value="3200" selected>DDR4-3200</option><option value="5600">DDR5-5600</option></select></label>' +
        '<label class="live-field">चैनल <select class="input" id="lvChan"><option value="1">सिंगल</option><option value="2" selected>डुअल</option><option value="4">क्वाड</option></select></label>' +
        '<label class="live-field">CAS <select class="input" id="lvCas"><option value="16">16</option><option value="18" selected>18</option><option value="22">22</option><option value="36">36</option></select></label>' +
      "</div>";
    ui.stage.innerHTML =
      '<div class="ram-live">' +
        '<svg viewBox="0 0 640 220" aria-hidden="true">' +
          '<rect x="30" y="70" width="120" height="80" rx="10" class="v-box brand"/><text x="90" y="106" text-anchor="middle" class="v-title">CPU</text><text x="90" y="124" text-anchor="middle" class="v-sub">मेमोरी कंट्रोलर</text>' +
          '<rect x="460" y="45" width="150" height="130" rx="10" class="v-box accent"/><text x="535" y="100" text-anchor="middle" class="v-title">RAM</text><text x="535" y="118" text-anchor="middle" class="v-sub">DDR बस</text>' +
          '<g class="ram-lanes">' +
            '<line x1="150" y1="90" x2="460" y2="75" class="v-line hot"/><line x1="150" y1="110" x2="460" y2="110" class="v-line hot"/><line x1="150" y1="130" x2="460" y2="145" class="v-line hot"/>' +
          "</g>" +
          '<circle r="5" class="v-token hot"><animateMotion dur="2.2s" repeatCount="indefinite" path="M150 90 H460"/></circle>' +
          '<circle r="5" class="v-token hot"><animateMotion dur="2.2s" begin="0.7s" repeatCount="indefinite" path="M150 130 H460"/></circle>' +
        "</svg>" +
      "</div>";

    function calc() {
      var speed = Number(ui.root.querySelector("#lvGen").value);
      var chan = Number(ui.root.querySelector("#lvChan").value);
      var cas = Number(ui.root.querySelector("#lvCas").value);
      var bandwidth = speed * 8 * chan / 1000;
      var latency = cas * 2000 / speed;
      return { speed: speed, chan: chan, cas: cas, bandwidth: bandwidth, latency: latency };
    }

    function draw() {
      var c = calc();
      var lanes = ui.stage.querySelector(".ram-lanes");
      lanes.style.opacity = c.chan === 1 ? ".45" : c.chan === 2 ? ".85" : "1";
      stats(ui.readout, [
        { label: "सैद्धांतिक बैंडविड्थ", value: c.bandwidth.toFixed(1) + " GB/s", kind: "good" },
        { label: "CAS विलंब", value: c.latency.toFixed(1) + " ns" },
        { label: "बस", value: "64-bit × " + c.chan + " चैनल" },
        { label: "व्यावहारिक अनुमान", value: (c.bandwidth * 0.72).toFixed(1) + " GB/s" }
      ]);
    }

    ["lvGen", "lvChan", "lvCas"].forEach(function (id) {
      ui.root.querySelector("#" + id).addEventListener("change", draw);
    });
    ui.root.querySelector("#lvGen").addEventListener("change", function () {
      var c = calc();
      finish(ui, ctx, "DDR " + c.speed + " पर " + c.chan + " चैनल = " + c.bandwidth.toFixed(1) + " GB/s — चैनल बढ़ाना स्पीड बढ़ाने से ज्यादा असरदार हो सकता है।");
    });
    draw();
  }

  /* ------------------------------------------------------------------ */
  /* 5. Laser print cycle                                                */
  /* ------------------------------------------------------------------ */
  function scenePrinter(sim, body, ctx) {
    var ui = shell(body, sim);
    var STAGES = [
      ["चार्ज", "कोरोना वायर ड्रम पर समान चार्ज डालता है।"],
      ["एक्सपोज़", "लेज़र रोशनी चार्ज हटाकर छिपी हुई इमेज बनाती है।"],
      ["डेवलप", "टोनर चार्ज वाली इमेज पर चिपकता है।"],
      ["ट्रांसफर", "टोनर पेपर पर स्थानांतरित होता है।"],
      ["फ्यूज़", "ऊष्मा और दबाव टोनर को पेपर पर पक्का करते हैं।"],
      ["क्लीन", "बचा टोनर हटाकर ड्रम अगले पेज के लिए तैयार होता है।"]
    ];
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<button type="button" class="btn btn-sm" id="prPlay">रोकें</button>' +
        '<button type="button" class="btn btn-sm btn-ghost" id="prStep">अगला चरण</button>' +
        '<label class="live-field">गति <output>1×</output><input type="range" min="0.4" max="2" step="0.2" value="1" data-unit="×" id="prSpeed"></label>' +
      "</div>";
    ui.stage.innerHTML =
      '<div class="print-live">' +
        '<svg viewBox="0 0 640 250" aria-label="लेज़र प्रिंटर चक्र">' +
          '<circle cx="150" cy="118" r="62" class="v-drum pr-drum"/>' +
          '<circle cx="150" cy="118" r="50" class="v-track"/>' +
          '<text x="150" y="122" text-anchor="middle" class="v-title">ड्रम</text>' +
          '<path id="prPaper" d="M20 210 H150 V180 H400 V210 H590 V120" class="v-line warm dash" fill="none"/>' +
          '<circle id="prDot" r="7" class="v-token warm"/>' +
          '<text x="320" y="238" text-anchor="middle" class="v-sub">पेपर पथ</text>' +
        "</svg>" +
        '<div class="print-stages">' + STAGES.map(function (s, i) {
          return '<button type="button" class="print-stage" data-stage="' + i + '"><span>' + (i + 1) + "</span>" + s[0] + "</button>";
        }).join("") + "</div>" +
      "</div>";
    var pathEl = ui.stage.querySelector("#prPaper");
    var dot = ui.stage.querySelector("#prDot");
    var chips = Array.prototype.slice.call(ui.stage.querySelectorAll(".print-stage"));
    var playing = true, speed = 1, progress = 0, stage = 0;
    var timer = null;
    var engaged = false;

    function paint() {
      chips.forEach(function (chip, i) { chip.classList.toggle("on", i === stage); });
      var len = pathEl.getTotalLength();
      var pt = pathEl.getPointAtLength(Math.min(1, progress) * len);
      dot.setAttribute("cx", pt.x);
      dot.setAttribute("cy", pt.y);
      stats(ui.readout, [
        { label: "चरण", value: (stage + 1) + " / 6 — " + STAGES[stage][0], kind: "good" },
        { label: "प्रक्रिया", value: STAGES[stage][1] },
        { label: "ड्रम", value: "घूम रहा है" }
      ]);
    }

    function advance() {
      progress += 0.04 * speed;
      if (progress >= 1) {
        progress = 0;
        stage = (stage + 1) % 6;
        if (stage === 0 && engaged) {
          finish(ui, ctx, "पूरा चक्र: चार्ज → एक्सपोज़ → डेवलप → ट्रांसफर → फ्यूज़ → क्लीन। हर पेज पर यही दोहराता है।");
        }
      }
      paint();
    }

    function start() {
      if (timer) clearInterval(timer);
      timer = setInterval(advance, 100);
    }

    bindRange(ui.root, "#prSpeed", function (v) { speed = v; });
    ui.root.querySelector("#prPlay").addEventListener("click", function () {
      engaged = true;
      playing = !playing;
      this.textContent = playing ? "रोकें" : "चलाएँ";
      if (playing) start(); else clearInterval(timer);
    });
    ui.root.querySelector("#prStep").addEventListener("click", function () {
      engaged = true;
      playing = false;
      ui.root.querySelector("#prPlay").textContent = "चलाएँ";
      clearInterval(timer);
      stage = (stage + 1) % 6;
      progress = stage / 6;
      paint();
      if (stage === 0) finish(ui, ctx, "छहों चरण देख लिए — अब पेपर पथ और फ्यूज़र तापमान को असली प्रिंटर में जोड़ें।");
    });
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        engaged = true;
        stage = Number(chip.getAttribute("data-stage"));
        progress = stage / 6;
        paint();
      });
    });
    paint();
    start();
  }

  /* ------------------------------------------------------------------ */
  /* 6. UPS runtime                                                      */
  /* ------------------------------------------------------------------ */
  function sceneUps(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<label class="live-field">लोड <output>40%</output><input type="range" min="10" max="100" step="5" value="40" data-unit="%" id="upsLoad"></label>' +
        '<label class="live-field">बैटरी <select class="input" id="upsAh"><option value="7">7 Ah</option><option value="9" selected>9 Ah</option><option value="12">12 Ah</option><option value="18">18 Ah</option><option value="26">26 Ah</option></select></label>' +
        '<label class="live-field">बैटरी संख्या <select class="input" id="upsCount"><option value="1" selected>1</option><option value="2">2</option><option value="4">4</option></select></label>' +
        '<button type="button" class="btn btn-sm" id="upsOutage">मेन्स बंद करें</button>' +
      "</div>";
    ui.stage.innerHTML =
      '<div class="ups-live">' +
        '<svg viewBox="0 0 640 240" aria-label="UPS पावर पथ">' +
          '<rect x="20" y="24" width="100" height="54" rx="8" class="v-box brand"/><text x="70" y="47" text-anchor="middle" class="v-title">मेन्स</text><text x="70" y="63" text-anchor="middle" class="v-sub">230V AC</text>' +
          '<rect x="180" y="24" width="100" height="54" rx="8" class="v-box"/><text x="230" y="47" text-anchor="middle" class="v-title">चार्जर</text><text x="230" y="63" text-anchor="middle" class="v-sub">CC/CV</text>' +
          '<rect x="330" y="24" width="100" height="54" rx="8" class="v-box accent"/><text x="380" y="47" text-anchor="middle" class="v-title">बैटरी</text><text x="380" y="63" text-anchor="middle" class="v-sub">12V × n</text>' +
          '<rect x="480" y="24" width="100" height="54" rx="8" class="v-box"/><text x="530" y="47" text-anchor="middle" class="v-title">इन्वर्टर</text><text x="530" y="63" text-anchor="middle" class="v-sub">DC → AC</text>' +
          '<rect x="180" y="140" width="120" height="62" rx="8" class="v-box brand"/><text x="240" y="166" text-anchor="middle" class="v-title">ATS / रिले</text><text x="240" y="184" text-anchor="middle" class="v-sub">ट्रांसफर</text>' +
          '<rect x="500" y="140" width="110" height="62" rx="8" class="v-box"/><text x="555" y="166" text-anchor="middle" class="v-title">लोड</text><text x="555" y="184" text-anchor="middle" class="v-sub">PC / सर्वर</text>' +
          '<path class="v-line hot ups-mains" d="M120 51 H178"/><path class="v-line hot ups-mains" d="M120 70 H150 V171 H178"/>' +
          '<path class="v-line good ups-batt" d="M280 51 H328"/><path class="v-line good ups-batt" d="M430 51 H478"/><path class="v-line good ups-batt" d="M530 78 V120 H270 V138"/>' +
          '<path class="v-line hot ups-batt" d="M300 171 H498"/>' +
          '<circle r="5" class="v-token hot ups-mains"><animateMotion dur="2.4s" repeatCount="indefinite" path="M120 70 H150 V171 H178"/></circle>' +
          '<circle r="5" class="v-token good ups-batt"><animateMotion dur="3.4s" repeatCount="indefinite" path="M530 78 V120 H270 V138"/></circle>' +
        "</svg>" +
        '<div class="ups-flag">मोड: <b>मेन्स</b></div>' +
      "</div>";

    var outage = false;
    function calc() {
      var loadPct = Number(ui.root.querySelector("#upsLoad").value);
      var ah = Number(ui.root.querySelector("#upsAh").value);
      var count = Number(ui.root.querySelector("#upsCount").value);
      var watts = 600 * loadPct / 100;
      var usable = ah * 12 * count * 0.9 * 0.8;
      var minutes = usable / watts * 60;
      return { loadPct: loadPct, ah: ah, count: count, watts: watts, usable: usable, minutes: minutes };
    }
    function draw() {
      var c = calc();
      stats(ui.readout, [
        { label: "लोड", value: Math.round(c.watts) + " W", kind: c.loadPct > 80 ? "bad" : "good" },
        { label: "उपयोगी ऊर्जा", value: Math.round(c.usable) + " Wh" },
        { label: "अनुमानित बैकअप", value: fmt(c.minutes, 0) + " मिनट", kind: c.minutes >= 10 ? "good" : "bad" },
        { label: "स्थिति", value: outage ? "बैटरी मोड" : "मेन्स मोड", kind: outage ? "bad" : "good" }
      ]);
    }
    bindRange(ui.root, "#upsLoad", draw);
    ["upsAh", "upsCount"].forEach(function (id) { ui.root.querySelector("#" + id).addEventListener("change", draw); });
    ui.root.querySelector("#upsOutage").addEventListener("click", function () {
      outage = !outage;
      ui.root.querySelector(".ups-live").classList.toggle("is-outage", outage);
      ui.root.querySelector(".ups-flag").innerHTML = "मोड: <b>" + (outage ? "बैटरी" : "मेन्स") + "</b>";
      this.textContent = outage ? "मेन्स चालू करें" : "मेन्स बंद करें";
      draw();
      if (outage) {
        var c = calc();
        finish(ui, ctx, "आउटेज पर लगभग " + fmt(c.minutes, 0) + " मिनट बैकअप — लोड बढ़ाने पर यह समय घटता है।");
      }
    });
    draw();
  }

  /* ------------------------------------------------------------------ */
  /* 7. Subnet calculator                                                */
  /* ------------------------------------------------------------------ */
  function sceneSubnet(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<label class="live-field">IP <span class="ip-inputs">' +
          '<input class="input ip-octet" id="s1" type="number" min="0" max="255" value="192">' +
          '<input class="input ip-octet" id="s2" type="number" min="0" max="255" value="168">' +
          '<input class="input ip-octet" id="s3" type="number" min="0" max="255" value="10">' +
          '<input class="input ip-octet" id="s4" type="number" min="0" max="255" value="45">' +
        "</span></label>" +
        '<label class="live-field">प्रीफ़िक्स /<output>24</output><input type="range" min="8" max="30" step="1" value="24" data-unit="" id="sPrefix"></label>' +
        '<button type="button" class="btn btn-sm" id="sApply">लागू करें</button>' +
      "</div>";
    ui.stage.innerHTML = '<div class="subnet-live"><div class="bit-row" id="sBits"></div><div class="subnet-bar"><span class="net"></span><span class="host"></span></div><p class="subnet-note" id="sNote">नेटवर्क बिट्स हरे, होस्ट बिट्स पीले रंग में दिखेंगे।</p></div>';
    var interacted = false;

    function readIp() {
      var parts = [1, 2, 3, 4].map(function (i) { return Number(ui.root.querySelector("#s" + i).value); });
      if (parts.some(function (p) { return !Number.isFinite(p) || p < 0 || p > 255; })) return null;
      return parts;
    }
    function toInt(parts) { return (((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0); }
    function toIp(num) { return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join("."); }
    function bin32(num) { var s = ""; for (var i = 31; i >= 0; i -= 1) s += ((num >>> i) & 1); return s; }

    function draw() {
      var parts = readIp();
      var prefix = Number(ui.root.querySelector("#sPrefix").value);
      if (!parts) {
        status(ui, "हर ऑक्टेट 0–255 के बीच होना चाहिए।", "bad");
        return;
      }
      var ip = toInt(parts);
      var mask = prefix === 0 ? 0 : ((0xFFFFFFFF << (32 - prefix)) >>> 0);
      var net = (ip & mask) >>> 0;
      var broadcast = (net | (~mask >>> 0)) >>> 0;
      var hosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : Math.pow(2, 32 - prefix) - 2;
      var first = prefix >= 31 ? net : net + 1;
      var last = prefix >= 31 ? broadcast : broadcast - 1;
      var bits = bin32(ip);
      var row = ui.root.querySelector("#sBits");
      row.innerHTML = bits.split("").map(function (bit, i) {
        return '<span class="bit' + (i < prefix ? " net" : " host") + '">' + bit + "</span>" +
          ((i + 1) % 8 === 0 && i < 31 ? '<i class="bit-gap" aria-hidden="true">.</i>' : "");
      }).join("");
      ui.root.querySelector(".subnet-bar .net").style.width = (prefix / 32 * 100) + "%";
      ui.root.querySelector(".subnet-bar .host").style.width = (100 - prefix / 32 * 100) + "%";
      stats(ui.readout, [
        { label: "सबनेट मास्क", value: toIp(mask) + " /" + prefix },
        { label: "नेटवर्क", value: toIp(net), kind: "good" },
        { label: "ब्रॉडकास्ट", value: toIp(broadcast) },
        { label: "उपयोगी रेंज", value: toIp(first) + " – " + toIp(last) },
        { label: "होस्ट", value: fmt(hosts, 0), kind: "good" },
        { label: "कुल पते", value: fmt(Math.pow(2, 32 - prefix), 0) }
      ]);
      if (interacted) finish(ui, ctx, "प्रीफ़िक्स /" + prefix + " → नेटवर्क " + toIp(net) + ", होस्ट " + fmt(hosts, 0) + "।");
    }

    bindRange(ui.root, "#sPrefix", function () { interacted = true; draw(); });
    [1, 2, 3, 4].forEach(function (i) {
      ui.root.querySelector("#s" + i).addEventListener("input", function () { interacted = true; draw(); });
    });
    ui.root.querySelector("#sApply").addEventListener("click", function () { interacted = true; draw(); });
    draw();
  }

  /* ------------------------------------------------------------------ */
  /* 8. VLAN forwarding                                                  */
  /* ------------------------------------------------------------------ */
  function sceneVlan(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<label class="live-field">स्रोत <select class="input" id="vSrc"><option value="1">PC1 (VLAN 10)</option><option value="2">PC2 (VLAN 10)</option><option value="3">PC3 (VLAN 20)</option><option value="4">PC4 (VLAN 20)</option></select></label>' +
        '<label class="live-field">गंतव्य <select class="input" id="vDst"><option value="2">PC2 (VLAN 10)</option><option value="1">PC1 (VLAN 10)</option><option value="3">PC3 (VLAN 20)</option><option value="4">PC4 (VLAN 20)</option></select></label>' +
        '<label class="live-check"><input type="checkbox" id="vRouter"> L3 राउटर जुड़ा है</label>' +
        '<button type="button" class="btn btn-sm" id="vSend">फ्रेम भेजें</button>' +
      "</div>";
    ui.stage.innerHTML =
      '<div class="vlan-live">' +
        '<svg viewBox="0 0 640 250" aria-label="VLAN फ्रेम पथ">' +
          '<rect x="240" y="24" width="160" height="60" rx="9" class="v-box brand"/><text x="320" y="50" text-anchor="middle" class="v-title">L2 स्विच</text><text x="320" y="68" text-anchor="middle" class="v-sub">MAC टेबल</text>' +
          '<rect x="340" y="148" width="120" height="46" rx="9" class="v-box' + ("" ) + '" id="vRouterBox"/><text x="400" y="168" text-anchor="middle" class="v-title">राउटर</text><text x="400" y="184" text-anchor="middle" class="v-sub">L3</text>' +
          ["PC1", "PC2", "PC3", "PC4"].map(function (name, i) {
            var x = 30 + i * 110;
            var vlan = i < 2 ? "10" : "20";
            return '<g class="vlan-pc" data-port="' + (i + 1) + '"><rect x="' + x + '" y="188" width="88" height="44" rx="8" class="v-box ' + (i < 2 ? "good-box" : "warm-box") + '"/>' +
              '<text x="' + (x + 44) + '" y="207" text-anchor="middle" class="v-title">' + name + "</text>" +
              '<text x="' + (x + 44) + '" y="223" text-anchor="middle" class="v-sub">VLAN ' + vlan + "</text>" +
              '<line x1="' + (x + 44) + '" y1="188" x2="' + (x + 44) + '" y2="150" class="v-line ' + (i < 2 ? "cool" : "warm") + '"/>' +
              '<line x1="' + (x + 44) + '" y1="150" x2="240" y2="84" class="v-line ' + (i < 2 ? "cool" : "warm") + '"/></g>';
          }).join("") +
          '<circle id="vlanToken" r="6" class="v-token hot" opacity="0"><animateMotion id="vlanMotion" dur="1.3s" fill="freeze"/></circle>' +
        "</svg>" +
      "</div>";
    var token = ui.stage.querySelector("#vlanToken");
    var motion = ui.stage.querySelector("#vlanMotion");
    var routerBox = ui.stage.querySelector("#vRouterBox");
    var engaged = false;

    function vlanOf(port) { return port <= 2 ? 10 : 20; }

    function send() {
      var src = Number(ui.root.querySelector("#vSrc").value);
      var dst = Number(ui.root.querySelector("#vDst").value);
      var routed = ui.root.querySelector("#vRouter").checked;
      var sv = vlanOf(src), dv = vlanOf(dst);
      routerBox.classList.toggle("linked", routed);
      var xOf = function (port) { return 30 + (port - 1) * 110 + 44; };
      var path;
      if (sv === dv) {
        path = "M" + xOf(src) + " 188 V150 L240 84 H400 L240 84 L" + xOf(dst) + " 150 V188";
      } else if (routed) {
        path = "M" + xOf(src) + " 188 V150 L240 84 H320 M320 84 V148";
      } else {
        path = "M" + xOf(src) + " 188 V150 L240 84 H300";
      }
      motion.setAttribute("path", path);
      token.setAttribute("opacity", "1");
      if (motion.beginElement) { try { motion.beginElement(); } catch (error) {} }
      Array.prototype.forEach.call(ui.stage.querySelectorAll(".vlan-pc"), function (pc) {
        var port = Number(pc.getAttribute("data-port"));
        pc.classList.toggle("src", port === src);
        pc.classList.toggle("dst", port === dst);
      });
      if (sv === dv) {
        stats(ui.readout, [
          { label: "स्रोत VLAN", value: "VLAN " + sv }, { label: "गंतव्य VLAN", value: "VLAN " + dv },
          { label: "निर्णय", value: "स्विच ने सीधे भेजा", kind: "good" },
          { label: "फ्रेम टैग", value: "access पोर्ट पर untagged" }
        ]);
        if (engaged) finish(ui, ctx, "एक ही VLAN: स्विच ने MAC टेबल से फ्रेम सीधे गंतव्य पोर्ट पर भेजा।");
      } else if (routed) {
        stats(ui.readout, [
          { label: "स्रोत VLAN", value: "VLAN " + sv }, { label: "गंतव्य VLAN", value: "VLAN " + dv },
          { label: "निर्णय", value: "राउटर से L3 रूटिंग", kind: "good" },
          { label: "ट्रंक टैग", value: "802.1Q VID " + sv + " → " + dv }
        ]);
        if (engaged) finish(ui, ctx, "अलग VLAN: फ्रेम ट्रंक पर 802.1Q टैग के साथ राउटर तक गया, फिर दूसरे VLAN में।");
      } else {
        stats(ui.readout, [
          { label: "स्रोत VLAN", value: "VLAN " + sv }, { label: "गंतव्य VLAN", value: "VLAN " + dv },
          { label: "निर्णय", value: "फ्रेम गिरा दिया", kind: "bad" },
          { label: "कारण", value: "L3 राउटिंग नहीं है" }
        ]);
        if (engaged) finish(ui, ctx, "अलग VLAN और राउटर नहीं — L2 स्विच फ्रेम नहीं भेज सकता।");
      }
    }

    ui.root.querySelector("#vSend").addEventListener("click", function () { engaged = true; send(); });
    ui.root.querySelector("#vRouter").addEventListener("change", function () {
      routerBox.classList.toggle("linked", this.checked);
    });
    send();
  }

  /* ------------------------------------------------------------------ */
  /* 9. Wi-Fi signal                                                     */
  /* ------------------------------------------------------------------ */
  function sceneWireless(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<label class="live-field">दूरी <output>8 m</output><input type="range" min="1" max="45" step="1" value="8" data-unit=" m" id="wDist"></label>' +
        '<label class="live-field">चैनल <select class="input" id="wChan"><option value="1">1 (2412 MHz)</option><option value="6" selected>6 (2437 MHz)</option><option value="11">11 (2462 MHz)</option></select></label>' +
        '<label class="live-field">बैंड <select class="input" id="wBand"><option value="2.4" selected>2.4 GHz</option><option value="5">5 GHz</option></select></label>' +
        '<button type="button" class="btn btn-sm" id="wMeasure">माप लें</button>' +
      "</div>";
    ui.stage.innerHTML =
      '<div class="wifi-live">' +
        '<svg viewBox="0 0 640 260" aria-label="Wi-Fi कवरेज">' +
          '<rect x="30" y="100" width="86" height="60" rx="8" class="v-box brand"/><text x="73" y="126" text-anchor="middle" class="v-title">AP</text><text x="73" y="144" text-anchor="middle" class="v-sub">PoE</text>' +
          '<circle id="wRange" cx="116" cy="130" r="80" class="v-range"/><circle cx="116" cy="130" r="12" class="v-wifi"/>' +
          '<g id="wDevice"><rect x="0" y="0" width="58" height="38" rx="6" class="v-box accent"/><text x="29" y="24" text-anchor="middle" class="v-sub">क्लाइंट</text></g>' +
          '<line id="wLink" x1="128" y1="130" x2="300" y2="130" class="v-line good dash"/>' +
          '<g class="wifi-bars" id="wBars"><rect x="470" y="170" width="14" height="20" rx="2"/><rect x="490" y="150" width="14" height="40" rx="2"/><rect x="510" y="130" width="14" height="60" rx="2"/><rect x="530" y="110" width="14" height="80" rx="2"/></g>' +
          '<text x="500" y="220" text-anchor="middle" class="v-sub">सिग्नल</text>' +
        "</svg>" +
      "</div>";
    var rangeEl = ui.stage.querySelector("#wRange");
    var device = ui.stage.querySelector("#wDevice");
    var link = ui.stage.querySelector("#wLink");
    var bars = Array.prototype.slice.call(ui.stage.querySelectorAll("#wBars rect"));

    function calc() {
      var d = Number(ui.root.querySelector("#wDist").value);
      var band = Number(ui.root.querySelector("#wBand").value);
      var ch = Number(ui.root.querySelector("#wChan").value);
      var freq = band === 5 ? 5180 : 2412 + (ch - 1) * 5;
      var fspl = 20 * Math.log10(Math.max(0.001, d / 1000)) + 20 * Math.log10(freq) + 32.44;
      var rssi = 20 - fspl;
      var rate = rssi > -50 ? (band === 5 ? 866 : 300) : rssi > -60 ? (band === 5 ? 433 : 150) : rssi > -67 ? (band === 5 ? 200 : 72) : rssi > -75 ? (band === 5 ? 65 : 24) : rssi > -82 ? 12 : 2;
      var quality = Math.max(1, Math.min(4, Math.ceil((rssi + 90) / 15)));
      return { d: d, band: band, ch: ch, rssi: rssi, rate: rate, quality: quality };
    }

    function draw() {
      var c = calc();
      var px = Math.min(360, 40 + c.d * 7);
      rangeEl.setAttribute("r", String(px));
      device.setAttribute("transform", "translate(" + (116 + px) + ", 108)");
      link.setAttribute("x2", String(116 + px));
      bars.forEach(function (bar, i) { bar.classList.toggle("on", i < c.quality); });
      stats(ui.readout, [
        { label: "RSSI", value: Math.round(c.rssi) + " dBm", kind: c.rssi > -67 ? "good" : c.rssi > -75 ? "" : "bad" },
        { label: "अनुमानित लिंक स्पीड", value: c.rate + " Mbps" },
        { label: "बैंड", value: c.band + " GHz · चैनल " + c.ch },
        { label: "गुणवत्ता", value: c.quality + " / 4" }
      ]);
    }
    bindRange(ui.root, "#wDist", draw);
    ["wChan", "wBand"].forEach(function (id) { ui.root.querySelector("#" + id).addEventListener("change", draw); });
    ui.root.querySelector("#wMeasure").addEventListener("click", function () {
      var c = calc();
      draw();
      finish(ui, ctx, "दूरी " + c.d + " m पर RSSI " + Math.round(c.rssi) + " dBm — " + (c.rssi > -67 ? "अच्छा कनेक्शन।" : "सिग्नल कमजोर, AP करीब लाएँ।"));
    });
    draw();
  }

  /* ------------------------------------------------------------------ */
  /* 10. RAID failure                                                    */
  /* ------------------------------------------------------------------ */
  function sceneRaid(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<div class="live-seg" role="group" aria-label="RAID स्तर">' +
          ["0", "1", "5", "10"].map(function (l, i) { return '<button type="button" class="seg' + (i === 2 ? " on" : "") + '" data-raid="' + l + '">RAID ' + l + "</button>"; }).join("") +
        "</div>" +
        '<button type="button" class="btn btn-sm" id="rFail">डिस्क विफल करें</button>' +
        '<button type="button" class="btn btn-sm btn-ghost" id="rReset">रीसेट</button>' +
      "</div>";
    ui.stage.innerHTML = '<div class="raid-live"><div class="raid-disks" id="rDisks"></div></div>';
    var level = "5", failed = false;

    function blocks() {
      if (level === "0") return [["A1", "A3"], ["A2", "A4"], ["A5", "A7"], ["A6", "A8"]];
      if (level === "1") return [["A1", "A2"], ["A1", "A2"], ["A3", "A4"], ["A3", "A4"]];
      if (level === "5") return [["A1", "A2", "P3"], ["A3", "P2", "A4"], ["P1", "A5", "A6"], ["A7", "P4", "A8"]];
      return [["A1", "A3"], ["A1", "A3"], ["A2", "A4"], ["A2", "A4"]];
    }

    function draw() {
      var disks = blocks();
      var wrap = ui.root.querySelector("#rDisks");
      wrap.innerHTML = disks.map(function (bl, i) {
        var bad = failed && i === 1;
        return '<div class="raid-disk' + (bad ? " fail" : "") + '"><b>डिस्क ' + (i + 1) + "</b>" +
          bl.map(function (b) { return '<span class="raid-block' + (b[0] === "P" ? " parity" : "") + '">' + b + "</span>"; }).join("") +
          (bad ? '<i class="raid-x">✕</i>' : "") + "</div>";
      }).join("");
      var capacity = { "0": 4, "1": 2, "5": 3, "10": 2 }[level];
      var tolerance = level === "0" ? "कोई नहीं" : "1 डिस्क";
      var state = failed ? (level === "0" ? "डेटा खो गया" : "डिग्रेडेड — rebuild जरूरी") : "सामान्य";
      stats(ui.readout, [
        { label: "स्तर", value: "RAID " + level },
        { label: "उपयोगी क्षमता", value: capacity + " TB (4 × 1 TB)" },
        { label: "फॉल्ट टॉलरेंस", value: tolerance, kind: level === "0" ? "bad" : "good" },
        { label: "स्थिति", value: state, kind: failed ? (level === "0" ? "bad" : "") : "good" }
      ]);
    }

    Array.prototype.forEach.call(ui.root.querySelectorAll("[data-raid]"), function (btn) {
      btn.addEventListener("click", function () {
        level = btn.getAttribute("data-raid");
        failed = false;
        Array.prototype.forEach.call(ui.root.querySelectorAll("[data-raid]"), function (other) {
          other.classList.toggle("on", other === btn);
        });
        draw();
      });
    });
    ui.root.querySelector("#rFail").addEventListener("click", function () {
      failed = !failed;
      draw();
      if (failed) {
        if (level === "0") {
          status(ui, "RAID 0 में कोई सुरक्षा नहीं — एक डिस्क गई तो डेटा गया।", "bad");
          if (!ui.finished && ctx && ctx.done) { ui.finished = true; ctx.done(); }
        } else {
          finish(ui, ctx, "RAID " + level + " एक डिस्क विफलता सह लेता है, पर rebuild के बिना दूसरी विफलता खतरनाक है।");
        }
      }
    });
    ui.root.querySelector("#rReset").addEventListener("click", function () { failed = false; draw(); status(ui, "रीसेट: सभी डिस्क स्वस्थ।", ""); });
    draw();
  }

  /* ------------------------------------------------------------------ */
  /* 11. chmod                                                           */
  /* ------------------------------------------------------------------ */
  function sceneChmod(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<label class="live-field">फ़ाइल <span class="chip-file">report.txt</span></label>' +
        '<label class="live-field">जाँच भूमिका <select class="input" id="cRole"><option value="0">मालिक</option><option value="1">समूह</option><option value="2">अन्य</option></select></label>' +
        '<button type="button" class="btn btn-sm" id="cCheck">अनुमति जाँचें</button>' +
      "</div>";
    var bitDefs = [
      ["मालिक", ["r", "w", "x"]],
      ["समूह", ["r", "w", "x"]],
      ["अन्य", ["r", "w", "x"]]
    ];
    ui.stage.innerHTML = '<div class="chmod-live">' + bitDefs.map(function (role, gi) {
      return '<div class="chmod-role"><b>' + role[0] + "</b>" + role[1].map(function (bit, bi) {
        var idx = gi * 3 + bi;
        var on = [true, true, true, true, false, true, true, false, false][idx];
        return '<label class="chmod-bit"><input type="checkbox" data-bit="' + idx + '"' + (on ? " checked" : "") + '><span>' + bit + "</span></label>";
      }).join("") + "</div>";
    }).join("") + '<div class="chmod-cmd" id="cCmd">$ chmod 754 report.txt</div>' + '<div class="chmod-oct" id="cOct">754</div></div>';

    var boxes = Array.prototype.slice.call(ui.stage.querySelectorAll("input[data-bit]"));

    function values() {
      return boxes.map(function (box) { return box.checked ? 1 : 0; });
    }
    function calc() {
      var v = values();
      var oct = [];
      for (var i = 0; i < 3; i += 1) oct.push(v[i * 3] * 4 + v[i * 3 + 1] * 2 + v[i * 3 + 2]);
      var sym = v.map(function (bit, i) { return bit ? ["r", "w", "x"][i % 3] : "-"; }).join("");
      return { v: v, oct: oct, sym: sym, code: oct.join("") };
    }
    function draw() {
      var c = calc();
      ui.stage.querySelector("#cCmd").textContent = "$ chmod " + c.code + " report.txt";
      ui.stage.querySelector("#cOct").textContent = c.code + "  " + c.sym;
      var role = Number(ui.root.querySelector("#cRole").value);
      var v = c.v.slice(role * 3, role * 3 + 3);
      var can = [v[0] ? "पढ़" : null, v[1] ? "लिख" : null, v[2] ? "चला" : null].filter(Boolean);
      stats(ui.readout, [
        { label: "अष्टक", value: c.code, kind: "good" },
        { label: "सिंबॉलिक", value: c.sym },
        { label: "चयनित भूमिका", value: ["मालिक", "समूह", "अन्य"][role] },
        { label: "अनुमति", value: can.length ? can.join(" · ") : "कुछ नहीं", kind: can.length ? "good" : "bad" }
      ]);
    }
    boxes.forEach(function (box) { box.addEventListener("change", draw); });
    ui.root.querySelector("#cRole").addEventListener("change", draw);
    ui.root.querySelector("#cCheck").addEventListener("click", function () {
      var c = calc();
      var role = ["मालिक", "समूह", "अन्य"][Number(ui.root.querySelector("#cRole").value)];
      draw();
      finish(ui, ctx, "chmod " + c.code + " → " + role + " के लिए अनुमति जाँची गई। r=4, w=2, x=1 याद रखें।");
    });
    draw();
  }

  /* ------------------------------------------------------------------ */
  /* 12. DHCP DORA                                                       */
  /* ------------------------------------------------------------------ */
  function sceneDora(sim, body, ctx) {
    var ui = shell(body, sim);
    ui.controls.innerHTML =
      '<div class="live-row">' +
        '<button type="button" class="btn btn-sm" id="dStart">कनेक्ट करें</button>' +
        '<button type="button" class="btn btn-sm btn-ghost" id="dReset">रीसेट</button>' +
      "</div>";
    ui.stage.innerHTML =
      '<div class="dora-live"><svg viewBox="0 0 640 230" aria-label="DHCP DORA">' +
        '<rect x="20" y="80" width="120" height="66" rx="9" class="v-box brand"/><text x="80" y="108" text-anchor="middle" class="v-title">क्लाइंट</text><text x="80" y="126" text-anchor="middle" class="v-sub">नया PC</text>' +
        '<rect x="250" y="80" width="110" height="66" rx="9" class="v-box"/><text x="305" y="108" text-anchor="middle" class="v-title">स्विच</text><text x="305" y="126" text-anchor="middle" class="v-sub">L2</text>' +
        '<rect x="460" y="80" width="150" height="66" rx="9" class="v-box accent"/><text x="535" y="108" text-anchor="middle" class="v-title">DHCP सर्वर</text><text x="535" y="126" text-anchor="middle" class="v-sub">स्कोप 192.168.10.0/24</text>' +
        '<path id="d1" d="M140 96 H248" class="v-line hot dora-arrow"/><text x="194" y="88" text-anchor="middle" class="v-sub">1 Discover</text>' +
        '<path id="d2" d="M248 116 H140" class="v-line good dora-arrow"/><text x="194" y="134" text-anchor="middle" class="v-sub">2 Offer</text>' +
        '<path id="d3" d="M140 136 H248" class="v-line hot dora-arrow"/><text x="194" y="152" text-anchor="middle" class="v-sub">3 Request</text>' +
        '<path id="d4" d="M250 142 H460" class="v-line good dora-arrow"/><text x="355" y="136" text-anchor="middle" class="v-sub">4 Ack</text>' +
        '<circle id="dToken" r="6" class="v-token hot" opacity="0"/>' +
      "</svg></div>";
    var timers = [];
    var steps = ["Discover — क्लाइंट ब्रॉडकास्ट करता है", "Offer — सर्वर पता सुझाता है", "Request — क्लाइंट औपचारिक माँग करता है", "Ack — सर्वर लीज़ देता है"];
    var arrows = ["d1", "d2", "d3", "d4"].map(function (id) { return ui.stage.querySelector("#" + id); });
    var token = ui.stage.querySelector("#dToken");

    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function reset() {
      clearTimers();
      arrows.forEach(function (a) { a.classList.remove("on"); });
      token.setAttribute("opacity", "0");
      stats(ui.readout, [
        { label: "चरण", value: "तैयार" }, { label: "मिला पता", value: "—" }, { label: "लीज़", value: "—" }, { label: "सर्वर", value: "192.168.10.10" }
      ]);
      status(ui, "कनेक्ट दबाकर DORA का क्रम देखें।", "");
    }
    function run() {
      clearTimers();
      arrows.forEach(function (a) { a.classList.remove("on"); });
      var ip = "192.168.10." + (50 + Math.floor(Math.random() * 40));
      stats(ui.readout, [
        { label: "चरण", value: "Discover भेजा", kind: "good" }, { label: "मिला पता", value: "प्रतीक्षा…" }, { label: "लीज़", value: "—" }, { label: "सर्वर", value: "192.168.10.10" }
      ]);
      token.setAttribute("opacity", "1");
      [0, 1, 2, 3].forEach(function (i) {
        timers.push(setTimeout(function () {
          arrows.forEach(function (a, ai) { a.classList.toggle("on", ai === i); });
          stats(ui.readout, [
            { label: "चरण", value: steps[i], kind: i === 3 ? "good" : "" },
            { label: "मिला पता", value: i >= 1 ? ip + " /24" : "प्रतीक्षा…" },
            { label: "लीज़", value: i >= 3 ? "24 घंटे" : "—" },
            { label: "गेटवे / DNS", value: i >= 3 ? "192.168.10.1 / .10" : "—" }
          ]);
          status(ui, steps[i], i === 3 ? "good" : "");
          if (i === 3) finish(ui, ctx, "DORA पूरा: " + ip + " /24, गेटवे 192.168.10.1, DNS 192.168.10.10, लीज़ 24 घंटे।");
        }, 700 + i * 1100));
      });
    }
    ui.root.querySelector("#dStart").addEventListener("click", run);
    ui.root.querySelector("#dReset").addEventListener("click", reset);
    reset();
  }

  /* ------------------------------------------------------------------ */
  /* 12. spec-आधारित लैब इंजन — SMPS शैली (स्लाइडर → लाइव पट्टी → आँकड़े) */
  /* ------------------------------------------------------------------ */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function ratio(v, lo, hi) { return clamp((v - lo) / (hi - lo), 0, 1); }

  var LABS = {
    /* T1 — विद्युत शॉक, अर्थिंग और RCCB */
    shock: {
      vars: [
        { k: "v", label: "सप्लाई वोल्टेज", min: 110, max: 240, step: 10, value: 230, unit: " V" },
        { k: "r", label: "शरीर का प्रतिरोध", min: 1, max: 100, step: 1, value: 25, unit: " kΩ" }
      ],
      flags: [
        { k: "rccb", label: "30 mA वाला RCCB लगा है", value: true },
        { k: "shoe", label: "सूखे रबड़ के जूते", value: false }
      ],
      calc: function (s) {
        var res = s.r * 1000 * (s.shoe ? 3.2 : 1);
        var ma = (s.v / res) * 1000;
        var stage = ma < 1 ? 0 : ma < 5 ? 1 : ma < 15 ? 2 : ma < 30 ? 3 : 4;
        var names = ["अहसास नहीं", "झुनझुनी", "फंसाव (let-go छूटती नहीं)", "श्वसन कठिन", "वेंट्रिकुलर फाइब्रिलेशन का खतरा"];
        var trip = s.rccb && ma > 30;
        var clear = trip ? Math.max(30, ma * 0.25) : ma;
        return { ma: ma, stage: stage, name: names[stage], trip: trip, clear: clear };
      },
      meters: function (s, r) {
        var log = function (ma) { return ratio(Math.log10(Math.max(0.2, ma)) + 1, 0, 3); };
        return [
          { label: "शरीर से गुज़रा करंट (mA)", ratio: log(r.ma), show: fmt(r.ma, 1) + " mA", tone: r.ma < 5 ? "ok" : r.ma < 30 ? "warn" : "bad" },
          { label: "RCCB ट्रिप के बाद प्रभावी करंट", ratio: log(r.clear), show: fmt(r.clear, 1) + " mA", tone: r.clear < 30 ? "ok" : "bad" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "प्रभाव", value: r.name, kind: r.ma < 5 ? "good" : "bad" },
          { label: "RCCB", value: r.trip ? "30 ms में ट्रिप" : s.rccb ? "ट्रिप नहीं (30 mA से नीचे)" : "लगाया नहीं", kind: r.trip || !s.rccb ? (r.trip ? "good" : s.rccb ? "" : "bad") : "" },
          { label: "संपर्क समय", value: r.trip ? "≈ 30 ms" : "2 सेकंड (अनुमानित)" },
          { label: "सबसे असरदार उपाय", value: s.rccb ? "अर्थिंग + इंसुलेशन" : "पहले RCCB लगाएँ" }
        ];
      },
      judge: function (s, r) {
        if (!s.rccb && r.ma >= 15) return { kind: "bad", text: "30 mA RCCB के बिना यही करंट घातक है — अर्थिंग अकेली काफ़ी नहीं, RCCB अनिवार्य।" };
        if (r.ma < 1) return { kind: "good", text: "इस परिधि में करंट 1 mA से भी कम — व्यवहार में निर्हानिक; प्रतिरोध बढ़ाने का असर दिखता है।" };
        if (r.trip) return { kind: "good", text: "करंट 30 mA पार करते ही RCCB ट्रिप — प्रभावी करंट " + fmt(r.clear, 1) + " mA तक सीमित। यही जीवन-रक्षक उपाय है।" };
        return { kind: "bad", text: r.name + " — " + fmt(r.ma, 1) + " mA; जल्दी से सप्लाई काटें, दस्तावेज़ पर प्राथमिक चिकित्सा के चरण देखें।" };
      },
      lock: function (s, r) {
        return "माप लॉक: " + s.v + " V, " + s.r + " kΩ → " + fmt(r.ma, 1) + " mA (" + r.name + ")" + (r.trip ? ", RCCB ट्रिप" : "");
      }
    },

    /* T4 — कीबोर्ड मैट्रिक्स स्कैनर */
    kb: {
      vars: [
        { k: "rows", label: "पंक्तियाँ (rows)", min: 2, max: 16, step: 1, value: 8 },
        { k: "cols", label: "स्तंभ (columns)", min: 2, max: 20, step: 1, value: 16 },
        { k: "scan", label: "स्कैन दर", min: 100, max: 2000, step: 50, value: 500, unit: " Hz" },
        { k: "deb", label: "डीबाउंस समय", min: 0, max: 50, step: 1, value: 10, unit: " ms" }
      ],
      calc: function (s) {
        var keys = s.rows * s.cols;
        var wires = s.rows + s.cols + 2;
        var sweep = (s.rows / s.scan) * 1000;
        var latency = sweep + s.deb;
        var rate = 1000 / Math.max(1, latency);
        return { keys: keys, wires: wires, sweep: sweep, latency: latency, rate: rate, direct: keys * 2 };
      },
      meters: function (s, r) {
        return [
          { label: "प्रति-कुंजी विलंब (ms)", ratio: ratio(r.latency, 0, 80), show: fmt(r.latency, 1) + " ms", tone: r.latency <= 20 ? "ok" : r.latency <= 45 ? "warn" : "bad" },
          { label: "अधिकतम कुंजी/सेकंड", ratio: ratio(r.rate, 0, 80), show: fmt(r.rate, 0) + "/से", tone: r.rate >= 40 ? "ok" : "warn" },
          { label: "मैट्रिक्स में तार (बनाम सीधे " + r.direct + ")", ratio: ratio(r.wires, 0, 80), show: r.wires + " तार", tone: "ok" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "कुंजियाँ", value: r.keys },
          { label: "तार बचत", value: r.direct + " → " + r.wires + " तार" },
          { label: "पूरा स्कैन", value: fmt(r.sweep, 1) + " ms" },
          { label: "प्रतिक्रिया विलंब", value: fmt(r.latency, 1) + " ms", kind: r.latency <= 20 ? "good" : "bad" }
        ];
      },
      judge: function (s, r) {
        if (r.latency > 60) return { kind: "bad", text: "विलंब " + fmt(r.latency, 1) + " ms — स्कैन दर बढ़ाएँ या डीबाउंस घटाएँ; इतने विलंब में तेज़ टाइपिंग पर कुंजी छूटती है।" };
        if (r.keys > 120 && r.latency <= 20) return { kind: "good", text: r.keys + " कुंजियाँ केवल " + r.wires + " तारों से पढ़ी जा रही हैं और विलंब " + fmt(r.latency, 1) + " ms — यही मैट्रिक्स का लाभ है।" };
        return { kind: "", text: "विलंब " + fmt(r.latency, 1) + " ms, " + fmt(r.rate, 0) + " कुंजी/सेकंड; डीबाउंस के बिना एक दबाव पर कई scan code जुड़ेगे (chatter)।" };
      },
      lock: function (s, r) {
        return "माप लॉक: " + s.rows + "×" + s.cols + " = " + r.keys + " कुंजी, " + r.wires + " तार, विलंब " + fmt(r.latency, 1) + " ms।";
      }
    },

    /* T7 — लैपटॉप बैटरी एवं चार्जिंग */
    laptop: {
      vars: [
        { k: "wh", label: "बैटरी क्षमता", min: 24, max: 99, step: 1, value: 57, unit: " Wh" },
        { k: "load", label: "औसत लोड", min: 5, max: 90, step: 1, value: 22, unit: " W" },
        { k: "health", label: "बैटरी स्वास्थ्य", min: 40, max: 100, step: 1, value: 92, unit: "%" },
        { k: "adp", label: "एडाप्टर शक्ति", min: 30, max: 130, step: 5, value: 65, unit: " W" }
      ],
      calc: function (s) {
        var usable = s.wh * s.health / 100;
        var runtime = usable / Math.max(1, s.load);
        var charge = usable / Math.max(1, s.adp * 0.82);
        var head = s.adp * 0.82 - s.load;
        var heat = s.adp * 0.82 < s.load;
        var cycles = Math.round(1000 * (1 - (100 - s.health) / 220));
        return { usable: usable, runtime: runtime, charge: charge, head: head, heat: heat, cycles: cycles };
      },
      meters: function (s, r) {
        return [
          { label: "रनटाइम (घंटे)", ratio: ratio(r.runtime, 0, 10), show: fmt(r.runtime, 1) + " घं", tone: r.runtime >= 4 ? "ok" : r.runtime >= 2 ? "warn" : "bad" },
          { label: "चार्ज समय (घंटे)", ratio: ratio(r.charge, 0, 6), show: fmt(r.charge, 1) + " घं", tone: r.charge <= 3 ? "ok" : "warn" },
          { label: "एडाप्टर हेडरूम (W)", ratio: ratio(r.head, -20, 60), show: fmt(r.head, 0) + " W", tone: r.heat ? "bad" : r.head > 15 ? "ok" : "warn" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "उपयोगी क्षमता", value: fmt(r.usable, 0) + " Wh" },
          { label: "रनटाइम", value: fmt(r.runtime, 1) + " घंटे", kind: r.runtime >= 4 ? "good" : "bad" },
          { label: "0→100% चार्ज", value: fmt(r.charge, 1) + " घंटे" },
          { label: "शेष चक्र (अनुमानित)", value: r.cycles, kind: r.cycles > 600 ? "good" : "bad" }
        ];
      },
      judge: function (s, r) {
        if (r.heat) return { kind: "bad", text: "एडाप्टर लोड से कम दे रहा है — चार्ज धीमा/रुकेगा और एडाप्टर गरम होगा; " + Math.ceil(s.load / 0.82) + " W का एडाप्टर चाहिए।" };
        if (s.health < 70) return { kind: "bad", text: "स्वास्थ्य " + s.health + "% — क्षमता " + fmt(r.usable, 0) + " Wh रह गई; यही बदलने का समय है, सेल फूलने पर तुरंत हटाएँ।" };
        if (r.runtime >= 5) return { kind: "good", text: "रनटाइम " + fmt(r.runtime, 1) + " घंटे और चार्ज " + fmt(r.charge, 1) + " घंटे — कक्षा के एक सत्र के लिए पर्याप्त।" };
        return { kind: "", text: "रनटाइम " + fmt(r.runtime, 1) + " घंटे; लोड " + s.load + " W कम करें (ब्राइटनेस, वायरलेस, बाहरी HDD) या क्षमता बढ़ाएँ।" };
      },
      lock: function (s, r) {
        return "माप लॉक: " + fmt(r.usable, 0) + " Wh उपयोगी → " + fmt(r.runtime, 1) + " घंटे रनटाइम, " + fmt(r.charge, 1) + " घंटे चार्ज।";
      }
    },

    /* T9 — स्कैनर रिज़ॉल्यूशन, फाइल साइज़ और OCR */
    scan: {
      vars: [
        { k: "dpi", label: "रिज़ॉल्यूशन", min: 75, max: 1200, step: 25, value: 300, unit: " DPI" },
        { k: "pages", label: "पृष्ठ", min: 1, max: 100, step: 1, value: 10 },
        { k: "wide", label: "पृष्ठ की चौड़ाई", min: 5, max: 17, step: 0.1, value: 8.3, unit: " इंच", digits: 1 },
        { k: "tall", label: "पृष्ठ की लंबाई", min: 5, max: 22, step: 0.1, value: 11.7, unit: " इंच", digits: 1 }
      ],
      opts: [
        { k: "col", label: "मोड", options: ["ब्लैक-एंड-वाइट (1 bit)", "ग्रेस्केल (8 bit)", "रंग (24 bit)"], def: 2 },
        { k: "comp", label: "संपीड़न", options: ["TIFF (असंपीड़ित)", "PNG", "JPEG (8:1)"], def: 1 }
      ],
      calc: function (s) {
        var bits = s.col.indexOf("1 bit") > 0 ? 1 : s.col.indexOf("8 bit") > 0 ? 8 : 24;
        var px = Math.round(s.wide * s.dpi) * Math.round(s.tall * s.dpi);
        var rawBytes = px * bits / 8;
        var factor = s.comp.indexOf("TIFF") === 0 ? 1 : s.comp.indexOf("PNG") === 0 ? 0.55 : 0.12;
        var mb = rawBytes * factor / 1048576 * s.pages;
        var secs = s.pages * (0.8 + (s.dpi / 300) * 3.2 * (bits / 8));
        var ocr = s.dpi < 150 ? "पढ़ना मुश्किल — अक्षर टूटते हैं" : s.dpi <= 400 ? "अच्छा — 300 DPI मानक" : "कोई लाभ नहीं, बस फाइल बड़ी";
        return { px: px, bits: bits, mb: mb, secs: secs, ocr: ocr, mode: s.col, good: s.dpi >= 250 && s.dpi <= 400 };
      },
      meters: function (s, r) {
        return [
          { label: "फाइल साइज़ (MB)", ratio: ratio(Math.log10(Math.max(1, r.mb)), 0, 4), show: fmt(r.mb, 1) + " MB", tone: r.mb > 400 ? "bad" : r.mb > 120 ? "warn" : "ok" },
          { label: "स्कैन समय", ratio: ratio(r.secs, 0, 600), show: fmt(r.secs / 60, 1) + " मिनट", tone: r.secs > 300 ? "warn" : "ok" },
          { label: "OCR गुणवत्ता", ratio: ratio(s.dpi, 75, 450), show: s.dpi + " DPI", tone: r.good ? "ok" : s.dpi > 450 ? "warn" : "bad" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "पिक्सेल/पृष्ठ", value: fmt(r.px / 1000000, 2) + " MP" },
          { label: "कुल फाइल", value: fmt(r.mb, 1) + " MB", kind: r.mb > 400 ? "bad" : "" },
          { label: "समय", value: fmt(r.secs / 60, 1) + " मिनट" },
          { label: "OCR", value: r.ocr, kind: r.good ? "good" : "bad" }
        ];
      },
      judge: function (s, r) {
        if (s.dpi > 500) return { kind: "bad", text: s.dpi + " DPI पर " + fmt(r.mb, 0) + " MB फाइल, पर OCR में सुधार नहीं — 300 DPI काफ़ी है; ज़ूम के लिए स्कैन दोबारा करें।" };
        if (s.dpi < 200) return { kind: "bad", text: "केवल " + s.dpi + " DPI — छोटे अक्षर और सील/हस्ताक्षर धुंधले; दस्तावेज़ और बारकोड के लिए कम से कम 300 DPI।" };
        return { kind: "good", text: s.dpi + " DPI, " + r.mode + " — यही व्यावहारिक मानक; फाइल " + fmt(r.mb, 1) + " MB और समय " + fmt(r.secs / 60, 1) + " मिनट।" };
      },
      lock: function (s, r) {
        return "माप लॉक: " + s.dpi + " DPI, " + s.pages + " पृष्ठ → " + fmt(r.mb, 1) + " MB, " + fmt(r.secs / 60, 1) + " मिनट।";
      }
    },

    /* T10 — डिस्प्ले बैंडविड्थ एवं रिफ्रेश */
    display: {
      vars: [
        { k: "w", label: "क्षैतिज पिक्सेल", min: 960, max: 3840, step: 120, value: 1920 },
        { k: "h", label: "ऊर्ध्व पिक्सेल", min: 600, max: 2160, step: 60, value: 1080 },
        { k: "hz", label: "रिफ्रेश दर", min: 30, max: 240, step: 10, value: 60, unit: " Hz" },
        { k: "bpp", label: "बिट प्रति पिक्सेल", min: 24, max: 48, step: 6, value: 24 }
      ],
      opts: [
        { k: "link", label: "इंटरफ़ेस (उपयोगी बैंडविड्थ)", options: ["VGA/DVI-single (12 Gbps)", "HDMI 1.4 (8.2 Gbps)", "HDMI 2.0 (14.4 Gbps)", "DisplayPort 1.2 (17.3 Gbps)"], def: 3 }
      ],
      calc: function (s) {
        var cap = s.link.indexOf("12 Gbps") > 0 ? 12 : s.link.indexOf("8.2") > 0 ? 8.2 : s.link.indexOf("14.4") > 0 ? 14.4 : 17.3;
        var raw = s.w * s.h * s.hz * s.bpp / 1e9;
        var need = raw * 1.25;
        return { cap: cap, raw: raw, need: need, mp: s.w * s.h / 1e6, fits: need <= cap, head: cap - need };
      },
      meters: function (s, r) {
        return [
          { label: "ज़रूरत (ब्लैंकिंग सहित)", ratio: ratio(r.need, 0, r.cap * 1.6), show: fmt(r.need, 1) + " Gbps", tone: r.fits ? "ok" : "bad" },
          { label: "इंटरफ़ेस क्षमता", ratio: ratio(r.cap, 0, 24), show: fmt(r.cap, 1) + " Gbps", tone: "ok" },
          { label: "हेडरूम", ratio: ratio(r.head, -10, 10), show: fmt(r.head, 1) + " Gbps", tone: r.head > 1 ? "ok" : r.head > 0 ? "warn" : "bad" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "पिक्सेल", value: fmt(r.mp, 2) + " MP" },
          { label: "अशोधित बैंडविड्थ", value: fmt(r.raw, 1) + " Gbps" },
          { label: "इंटरफ़ेस", value: r.fits ? "पर्याप्त" : "असमर्थ", kind: r.fits ? "good" : "bad" },
          { label: "नतीजा", value: r.fits ? "सेटिंग स्वीकार" : "काली स्क्रीन / घटाया रेज़" }
        ];
      },
      judge: function (s, r) {
        if (!r.fits) return { kind: "bad", text: fmt(r.need, 1) + " Gbps चाहिए पर केवल " + fmt(r.cap, 1) + " Gbps उपलब्ध — रिफ्रेश/रंग गहराई घटाएँ या केबल/पोर्ट बदलें।" };
        return { kind: "good", text: s.w + "×" + s.h + " @ " + s.hz + " Hz " + s.bpp + "-bit = " + fmt(r.need, 1) + " Gbps; " + fmt(r.head, 1) + " Gbps हेडरूम बचा — कनेक्शन स्थिर रहेगा।" };
      },
      lock: function (s, r) {
        return "माप लॉक: " + s.w + "×" + s.h + "@" + s.hz + " Hz → " + fmt(r.need, 1) + " / " + fmt(r.cap, 1) + " Gbps।";
      }
    },

    /* T11 — अपग्रेड बनाम नई मशीन (बचत व पे-बैक) */
    upgrade: {
      vars: [
        { k: "rep", label: "मरम्मत/अपग्रेड लागत", min: 500, max: 30000, step: 500, value: 6000, unit: " ₹" },
        { k: "new", label: "नई मशीन मूल्य", min: 25000, max: 90000, step: 1000, value: 42000, unit: " ₹" },
        { k: "hrs", label: "रोज़ बचने वाला समय", min: 0, max: 4, step: 0.25, value: 1, unit: " घं", digits: 2 },
        { k: "watt", label: "बिजली बचत", min: 0, max: 200, step: 5, value: 60, unit: " W" },
        { k: "rate", label: "प्रति घंटा काम का मूल्य", min: 20, max: 300, step: 10, value: 90, unit: " ₹" }
      ],
      calc: function (s) {
        var work = s.hrs * 26 * s.rate;
        var units = s.watt * 8 * 26 / 1000;
        var power = units * 8;
        var month = work + power;
        var payback = month > 0 ? s.new / month : 999;
        var three = month * 36 - s.new;
        var better = three > s.rep * 3 ? "नई मशीन" : s.rep > 0 ? "अपग्रेड/मरम्मत" : "कुछ नहीं";
        return { work: work, power: power, units: units, month: month, payback: payback, three: three, better: better };
      },
      meters: function (s, r) {
        return [
          { label: "मासिक बचत (₹)", ratio: ratio(r.month, 0, 8000), show: fmt(r.month, 0) + " ₹/माह", tone: r.month > 2000 ? "ok" : "warn" },
          { label: "पे-बैक (माह)", ratio: ratio(r.payback, 0, 60), show: fmt(Math.min(r.payback, 60), 1) + " माह", tone: r.payback <= 18 ? "ok" : r.payback <= 30 ? "warn" : "bad" },
          { label: "3-वर्ष शुद्ध बचत (₹)", ratio: ratio(r.three, -60000, 120000), show: fmt(r.three, 0) + " ₹", tone: r.three > 0 ? "ok" : "bad" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "समय की बचत", value: fmt(r.work, 0) + " ₹/माह" },
          { label: "बिजली", value: fmt(r.units, 1) + " यूनिट/माह = " + fmt(r.power, 0) + " ₹" },
          { label: "पे-बैक", value: r.payback >= 999 ? "कभी नहीं" : fmt(r.payback, 1) + " माह", kind: r.payback <= 24 ? "good" : "bad" },
          { label: "निर्णय", value: r.better, kind: r.better === "नई मशीन" ? "good" : "" }
        ];
      },
      judge: function (s, r) {
        if (r.payback > 36) return { kind: "bad", text: "पे-बैक " + fmt(Math.min(r.payback, 999), 0) + " माह — खर्चा बचत से बड़ा; बस मरम्मत करें या काम घटाकर चलाएँ।" };
        if (r.better === "नई मशीन") return { kind: "good", text: "3 वर्ष में " + fmt(r.three, 0) + " ₹ शुद्ध बचत और पे-बैक " + fmt(r.payback, 1) + " माह — यही व्यावहारिक निर्णय, वॉरंटी भी नई।" };
        return { kind: "", text: "अपग्रेड " + fmt(s.rep, 0) + " ₹ में काम चलाना बेहतर; नई मशीन का पे-बैक " + fmt(r.payback, 1) + " माह है — बजट तय करके आगे बढ़ें।" };
      },
      lock: function (s, r) {
        return "माप लॉक: मासिक बचत " + fmt(r.month, 0) + " ₹, पे-बैक " + fmt(r.payback, 1) + " माह → " + r.better + "।";
      }
    },

    /* T12 — बैकअप विंडो और restore */
    backup: {
      vars: [
        { k: "gb", label: "कुल डेटा", min: 5, max: 500, step: 5, value: 60, unit: " GB" },
        { k: "mbps", label: "मीडिया गति", min: 10, max: 400, step: 10, value: 80, unit: " MB/s" },
        { k: "chg", label: "रोज़ बदलाव", min: 0, max: 40, step: 1, value: 5, unit: "%" },
        { k: "win", label: "रात की विंडो", min: 1, max: 10, step: 0.5, value: 6, unit: " घं", digits: 1 }
      ],
      opts: [
        { k: "kind", label: "प्रकार", options: ["Full", "Incremental", "Differential"], def: 1 }
      ],
      calc: function (s) {
        var mb = s.gb * 1024;
        var day = s.kind === "Full" ? mb : s.kind === "Incremental" ? mb * s.chg / 100 : mb * s.chg / 100 * 3;
        var hrs = day / s.mbps / 3600 * 1000;
        var fits = hrs <= s.win * 0.8;
        var restore = s.kind === "Full" ? hrs : s.kind === "Incremental" ? hrs + (mb / s.mbps / 3.6) * 0.15 * 6 : hrs + mb * s.chg / 100 * 6 / s.mbps / 3.6;
        return { day: day, hrs: hrs, fits: fits, restore: restore, media: s.kind === "Full" ? 30 * day : day * 26 };
      },
      meters: function (s, r) {
        return [
          { label: "रोज़ लिखा डेटा", ratio: ratio(r.day, 0, 400000), show: fmt(r.day / 1024, 1) + " GB", tone: r.day / 1024 > s.gb ? "bad" : "ok" },
          { label: "बैकअप समय", ratio: ratio(r.hrs, 0, s.win * 2), show: fmt(r.hrs, 1) + " घंटे", tone: r.hrs <= s.win * 0.8 ? "ok" : r.hrs <= s.win ? "warn" : "bad" },
          { label: "पूरा restore", ratio: ratio(r.restore, 0, 30), show: fmt(r.restore, 1) + " घंटे", tone: r.restore <= 8 ? "ok" : "bad" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "विंडो", value: s.win + " घंटे" },
          { label: "समाता है?", value: r.fits ? "हाँ, " + fmt(s.win - r.hrs, 1) + " घं जगह" : "नहीं, " + fmt(r.hrs - s.win, 1) + " घं देर", kind: r.fits ? "good" : "bad" },
          { label: "restore समय (RTO)", value: fmt(r.restore, 1) + " घंटे", kind: r.restore <= 8 ? "good" : "bad" },
          { label: "मासिक मीडिया", value: fmt(r.media / 1024, 0) + " GB" }
        ];
      },
      judge: function (s, r) {
        if (!r.fits) return { kind: "bad", text: s.kind + " बैकअप " + fmt(r.hrs, 1) + " घंटे लेगा — विंडो से बाहर। गति बढ़ाएँ, चयन घटाएँ या दिन में दो बार इंक्रीमेंटल रखें।" };
        if (s.kind === "Incremental" && r.restore > 8) return { kind: "bad", text: "बैकअप तो विंडो में है, पर restore " + fmt(r.restore, 1) + " घंटे (सारे सेट चाहिए) — RTO छोटा रखने के लिए साप्ताहिक Full ज़रूरी।" };
        return { kind: "good", text: s.kind + ": " + fmt(r.hrs, 1) + " घंटे में पूरा, restore " + fmt(r.restore, 1) + " घंटे — विंडो में जगह भी बची है।" };
      },
      lock: function (s, r) {
        return "माप लॉक: " + s.kind + " " + fmt(r.day / 1024, 1) + " GB, " + fmt(r.hrs, 1) + " घंटे, restore " + fmt(r.restore, 1) + " घंटे।";
      }
    },

    /* T13 — टैबलेट चार्जिंग निदान */
    charge: {
      vars: [
        { k: "cap", label: "बैटरी क्षमता", min: 8, max: 30, step: 0.5, value: 16, unit: " Wh", digits: 1 },
        { k: "cres", label: "केबल प्रतिरोध", min: 50, max: 1500, step: 50, value: 250, unit: " mΩ" },
        { k: "dust", label: "पोर्ट में धूल/जंग", min: 0, max: 80, step: 5, value: 10, unit: "%" },
        { k: "temp", label: "वातावरण ताप", min: 10, max: 50, step: 1, value: 27, unit: " °C" }
      ],
      opts: [
        { k: "adp", label: "चार्जर", options: ["5 V / 1 A", "5 V / 2 A", "9 V / 2 A (फास्ट)"], def: 1 }
      ],
      calc: function (s) {
        var amp = s.adp.indexOf("1 A") > 0 ? 1 : s.adp.indexOf("2 A (फास्ट)") > 0 ? 2 : 2;
        var volt = s.adp.indexOf("9 V") === 0 ? 9 : 5;
        var cableLoss = clamp(s.cres / 1500, 0, 1) * 0.55;
        var portLoss = s.dust / 100 * 0.8;
        var thermal = s.temp > 40 ? 0.5 : s.temp > 32 ? 0.8 : 1;
        var eff = clamp(1 - cableLoss - portLoss, 0.05, 1) * thermal;
        var cur = amp * eff;
        var hours = s.cap / Math.max(0.2, volt * cur * 0.85);
        var heat = cur * cur * (s.cres / 1000) * 1000;
        var cause = portLoss > cableLoss && portLoss > (1 - thermal) ? "पोर्ट गंदा/ढीला" : cableLoss > portLoss ? "केबल पतला/लंबा" : s.temp > 40 ? "अधिक ताप — चार्ज धीमा" : "बैटरी/PMIC संदेह";
        return { cur: cur, hours: hours, heat: heat, cause: cause, volt: volt };
      },
      meters: function (s, r) {
        return [
          { label: "वास्तविक चार्ज करंट", ratio: ratio(r.cur, 0, 2), show: fmt(r.cur, 2) + " A", tone: r.cur > 1.4 ? "ok" : r.cur > 0.6 ? "warn" : "bad" },
          { label: "0→100% समय", ratio: ratio(r.hours, 0, 12), show: fmt(r.hours, 1) + " घं", tone: r.hours <= 3.5 ? "ok" : r.hours <= 6 ? "warn" : "bad" },
          { label: "केबल पर अपव्यय", ratio: ratio(r.heat, 0, 8), show: fmt(r.heat, 1) + " W", tone: r.heat < 2 ? "ok" : "bad" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "पोर्ट करंट", value: fmt(r.cur, 2) + " A", kind: r.cur < 0.5 ? "bad" : "" },
          { label: "चार्ज समय", value: fmt(r.hours, 1) + " घंटे", kind: r.hours <= 3.5 ? "good" : "bad" },
          { label: "सबसे बड़ा कारण", value: r.cause },
          { label: "अगला कदम", value: r.cause.indexOf("केबल") >= 0 ? "छोटा मोटा केबल से जाँच" : r.cause.indexOf("पोर्ट") >= 0 ? "पोर्ट सफाई/रिप्लेस" : r.cause.indexOf("ताप") >= 0 ? "ठंडी जगह पर चार्ज" : "बैटरी वोल्टेज मापें" }
        ];
      },
      judge: function (s, r) {
        if (r.cur < 0.3) return { kind: "bad", text: "केवल " + fmt(r.cur, 2) + " A — चिह्न दिखेगा पर बैटरी नहीं बढ़ेगी। कारण: " + r.cause + "।" };
        if (r.hours <= 3.5) return { kind: "good", text: fmt(r.cur, 2) + " A और " + fmt(r.hours, 1) + " घंटे — यही सामान्य है; फिर भी " + s.temp + " °C से ऊपर चार्ज न रखें।" };
        return { kind: "bad", text: r.cause + " की वजह से " + fmt(r.hours, 1) + " घंटे लगेंगे; केबल → पोर्ट → बैटरी क्रम में मापें, बोर्ड से पहले नहीं।" };
      },
      lock: function (s, r) {
        return "माप लॉक: " + fmt(r.cur, 2) + " A, " + fmt(r.hours, 1) + " घंटे, कारण — " + r.cause + "।";
      }
    },

    /* T20 — VPN सुरंग का जोखिम */
    vpn: {
      vars: [
        { k: "len", label: "पासवर्ड लंबाई", min: 4, max: 28, step: 1, value: 8, unit: " अक्षर" },
        { k: "ports", label: "खुले पोर्ट", min: 1, max: 24, step: 1, value: 6 },
        { k: "attempts", label: "प्रति सेकंड प्रयास (बिना लॉकआउट)", min: 10, max: 1000000, step: 10, value: 1000 }
      ],
      opts: [
        { k: "proto", label: "प्रोटोकॉल", options: ["PPTP (टूटा हुआ)", "L2TP/IPsec", "SSTP (TLS 443)", "IKEv2"], def: 0 },
        { k: "auth", label: "प्रमाणीकरण", options: ["केवल पासवर्ड", "पासवर्ड + MFA", "सर्टिफिकेट + MFA"], def: 0 }
      ],
      calc: function (s) {
        var bits = s.len * 4.6 + (s.auth.indexOf("MFA") > 0 ? 20 : 0) + (s.auth.indexOf("सर्टिफिकेट") === 0 ? 60 : 0);
        var protoBonus = s.proto.indexOf("PPTP") === 0 ? -45 : s.proto.indexOf("L2TP") === 0 ? 8 : 18;
        var strength = bits + protoBonus;
        var secs = Math.pow(2, Math.min(128, strength)) / 2 / s.attempts;
        var yrs = secs / 31557600;
        var risk = clamp(100 - strength * 1.1 - (s.auth.indexOf("MFA") > 0 ? 12 : 0) + s.ports * 1.4, 1, 100);
        return { bits: bits, strength: strength, yrs: yrs, risk: risk, open: s.proto.indexOf("PPTP") === 0 };
      },
      meters: function (s, r) {
        return [
          { label: "कुंजी शक्ति (प्रभावी बिट)", ratio: ratio(r.strength, 0, 128), show: fmt(Math.max(0, r.strength), 0) + " bit", tone: r.strength > 80 ? "ok" : r.strength > 50 ? "warn" : "bad" },
          { label: "ब्रूट-फोर्स का समय", ratio: ratio(Math.log10(Math.max(1, r.yrs)), 0, 9), show: r.yrs < 1 ? fmt(r.yrs * 24, 1) + " घंटे" : r.yrs < 1000 ? fmt(r.yrs, 1) + " वर्ष" : "अरबों वर्ष", tone: r.yrs > 10 ? "ok" : "bad" },
          { label: "जोखिम स्कोर", ratio: ratio(r.risk, 0, 100), show: fmt(r.risk, 0) + "/100", tone: r.risk < 35 ? "ok" : r.risk < 60 ? "warn" : "bad" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "प्रोटोकॉल", value: s.proto, kind: r.open ? "bad" : "good" },
          { label: "समय ( brute-force)", value: r.yrs > 1e6 ? "व्यवहार में असंभव" : r.yrs < 1 ? fmt(r.yrs * 24 * 60, 0) + " मिनट" : fmt(r.yrs, 1) + " वर्ष", kind: r.yrs > 10 ? "good" : "bad" },
          { label: "जोखिम", value: r.risk < 35 ? "कम" : r.risk < 60 ? "मध्यम" : "उच्च", kind: r.risk < 35 ? "good" : "bad" },
          { label: "सबसे बड़ी कमजोरी", value: r.open ? "PPTP — MS-CHAPv2 टूटा" : s.ports > 10 ? "बहुत खुले पोर्ट" : s.auth.indexOf("MFA") < 0 ? "MFA का अभाव" : "छोटा पासवर्ड" }
        ];
      },
      judge: function (s, r) {
        if (r.open) return { kind: "bad", text: "PPTP आज उपयोग नहीं — MS-CHAPv2hash ऑफलाइन टूटता है। IKEv2 या SSTP + सर्टिफिकेट + MFA पर जाएँ।" };
        if (r.risk >= 60) return { kind: "bad", text: "जोखिम " + fmt(r.risk, 0) + "/100 — " + (s.auth.indexOf("MFA") < 0 ? "MFA जोड़ें, " : "") + (s.ports > 10 ? "अनावश्यक पोर्ट बंद करें, " : "") + "पासवर्ड " + s.len + " अक्षर कम है।" };
        if (r.risk <= 30 && s.auth.indexOf("सर्टिफिकेट") === 0) return { kind: "good", text: "सर्टिफिकेट + MFA, " + s.proto + ", " + s.ports + " पोर्ट — यही सुदृढ़ VPN सेटिंग; लॉकआउट नीति और सर्टिफिकेट अवधि याद रखें।" };
        return { kind: "", text: fmt(r.yrs, 0) + " वर्ष का brute-force समय और जोखिम " + fmt(r.risk, 0) + "/100 — प्रोटोकॉल, MFA और पोर्ट सीमा तीनों मिलाकर ही VPN मज़बूत होता है।" };
      },
      lock: function (s, r) {
        return "माप लॉक: " + s.proto + " + " + s.auth + " → जोखिम " + fmt(r.risk, 0) + "/100।";
      }
    },

    /* T21 — शेयर + NTFS प्रभावी अधिकार */
    perm: {
      vars: [
        { k: "share", label: "Share अधिकार", min: 0, max: 3, step: 1, value: 2, unit: "", labelMap: ["कुछ नहीं", "पढ़ना", "परिवर्तन", "पूरा नियंत्रण"] },
        { k: "ntfs", label: "NTFS अधिकार", min: 0, max: 4, step: 1, value: 3, unit: "", labelMap: ["कुछ नहीं", "पढ़ना", "सूची", "परिवर्तन", "पूरा नियंत्रण"] },
        { k: "target", label: "लक्ष्य (काम के लिए जो चाहिए)", min: 0, max: 3, step: 1, value: 2, unit: "", labelMap: ["पहुँच बंद", "केवल पढ़ना", "परिवर्तन", "पूरा नियंत्रण"] }
      ],
      flags: [
        { k: "local", label: "क्लाइंट सर्वर पर बैठकर स्थानीय पथ खोल रहा है", value: false },
        { k: "deny", label: "एक Deny एंट्री मौजूद है", value: false },
        { k: "user", label: "अधिकार सीधे यूज़र को दिए (ग्रुप नहीं)", value: false }
      ],
      calc: function (s) {
        var shareNames = ["कुछ नहीं", "पढ़ना", "परिवर्तन", "पूरा नियंत्रण"];
        var ntfsNames = ["कुछ नहीं", "पढ़ना", "सूची", "परिवर्तन", "पूरा नियंत्रण"];
        var effLevel = s.local ? s.ntfs : Math.min(s.share, s.ntfs);
        var eff = s.deny ? "अस्वीकृत (Deny जीता)" : ntfsNames[effLevel];
        var targetName = ["पहुँच बंद", "केवल पढ़ना", "परिवर्तन", "पूरा नियंत्रण"][s.target];
        var map = { "पहुँच बंद": -1, "केवल पढ़ना": 1, "परिवर्तन": 3, "पूरा नियंत्रण": 4 };
        var got = s.deny ? -1 : effLevel;
        var need = map[targetName];
        return { eff: eff, level: effLevel, ok: s.deny ? need === -1 : got >= need && got <= need, over: got > need, under: got < need, need: need, got: got };
      },
      meters: function (s, r) {
        return [
          { label: "Share परत", ratio: ratio(s.share, 0, 3), show: ["कुछ नहीं", "पढ़ना", "परिवर्तन", "पूरा नियंत्रण"][s.share], tone: "ok" },
          { label: "NTFS परत", ratio: ratio(s.ntfs, 0, 4), show: ["कुछ नहीं", "पढ़ना", "सूची", "परिवर्तन", "पूरा नियंत्रण"][s.ntfs], tone: "ok" },
          { label: "प्रभावी अधिकार", ratio: ratio(s.deny ? 0 : r.level, 0, 4), show: r.eff, tone: r.ok ? "ok" : r.over ? "warn" : "bad" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "पहुँच का तरीका", value: s.local ? "स्थानीय (NTFS فقط)" : "नेटवर्क (दोनों)" },
          { label: "प्रभावी", value: r.eff, kind: r.ok ? "good" : "bad" },
          { label: "लक्ष्य", value: ["पहुँच बंद", "केवल पढ़ना", "परिवर्तन", "पूरा नियंत्रण"][s.target] },
          { label: "नियम", value: s.local ? "स्थानीय पथ पर शेयर नहीं देखता" : "दोनों में से कम वाला लागू" }
        ];
      },
      judge: function (s, r) {
        if (s.deny) return { kind: s.target === 0 ? "good" : "bad", text: "Deny हमेशा जीतता है — Allow की परवाह नहीं; यही कारण है कि Deny कम-से-कम और सोचकर लगाते हैं।" };
        if (r.over) return { kind: "bad", text: "प्रभावी अधिकार " + r.eff + " — लक्ष्य से ज़्यादा। Least privilege के लिए NTFS घटाएँ या शेयर बदलें, ACL में ग्रुप रखें।" };
        if (r.under) return { kind: "bad", text: "प्रभावी " + r.eff + " — काम नहीं चलेगा; " + (s.local ? "NTFS बढ़ाएँ" : "कम वाली परत बढ़ाएँ") + "।" };
        return { kind: "good", text: "बिल्कुल लक्ष्य जितना: " + r.eff + (s.user ? " — पर अधिकार सीधे यूज़र को दिए हैं, ग्रुप (DL) में बदलें ताकि बदलाव आसान रहे।" : " — यही सही डिज़ाइन; परिवर्तन केवल Domain Local ग्रुप में करें।") };
      },
      lock: function (s, r) {
        return "माप लॉक: शेयर " + ["कुछ नहीं", "पढ़ना", "परिवर्तन", "पूरा नियंत्रण"][s.share] + " ∩ NTFS " + ["कुछ नहीं", "पढ़ना", "सूची", "परिवर्तन", "पूरा नियंत्रण"][s.ntfs] + " → " + r.eff + "।";
      }
    },

    /* T22 — HTTPS साइट कब खुलेगी (निर्णय वृक्ष) */
    web: {
      vars: [
        { k: "days", label: "सर्टिफिकेट में बचे दिन", min: -20, max: 120, step: 5, value: 40, unit: " दिन" },
        { k: "clients", label: "एक साथ क्लाइंट", min: 5, max: 400, step: 5, value: 60 },
        { k: "ms", label: "प्रति अनुरोध प्रोसेसिंग", min: 5, max: 300, step: 5, value: 40, unit: " ms" },
        { k: "workers", label: "ऐप पूल वर्कर", min: 1, max: 16, step: 1, value: 4 }
      ],
      flags: [
        { k: "dns", label: "डेटा रिकॉर्ड (A) सही पते पर है", value: true },
        { k: "port", label: "फायरवॉल में 443 inbound खुला है", value: true },
        { k: "bind", label: "बाइंडिंग में host header मेल खाता है", value: true },
        { k: "svc", label: "W3SVC सेवा चल रही है", value: true }
      ],
      calc: function (s) {
        var perWorker = 1000 / Math.max(1, s.ms);
        var cap = perWorker * s.workers;
        var queue = s.clients - cap;
        var fail = !s.dns ? "DNS" : !s.bind ? "Binding" : !s.port ? "Firewall" : !s.svc ? "Service" : s.days < 0 ? "Cert expired" : "OK";
        var code = fail === "DNS" ? "नाम हल नहीं — कोई कनेक्शन नहीं" : fail === "Binding" ? "404 / गलत साइट" : fail === "Firewall" ? "समय समाप्त (timeout)" : fail === "Service" ? "503 सेवा अनुपलब्ध" : fail === "Cert expired" ? "NET::ERR_CERT_DATE_INVALID" : queue > 0 ? "200, पर धीमा" : "200 OK";
        return { cap: cap, queue: queue, fail: fail, code: code, overload: queue > 0 };
      },
      meters: function (s, r) {
        return [
          { label: "सेवा क्षमता (req/s)", ratio: ratio(r.cap, 0, 200), show: fmt(r.cap, 0) + " req/s", tone: r.queue <= 0 ? "ok" : "warn" },
          { label: "कतार में अनुरोध", ratio: ratio(Math.max(0, r.queue), 0, 200), show: fmt(Math.max(0, r.queue), 0), tone: r.queue <= 0 ? "ok" : r.queue < 50 ? "warn" : "bad" },
          { label: "सर्टिफिकेट अवधि", ratio: ratio(s.days, -20, 120), show: s.days + " दिन", tone: s.days > 30 ? "ok" : s.days > 0 ? "warn" : "bad" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "परिणाम", value: r.code, kind: r.fail === "OK" && !r.overload ? "good" : "bad" },
          { label: "पहला टूता कड़ी", value: r.fail === "OK" ? "सभी कड़ी ठीक" : r.fail, kind: r.fail === "OK" ? "good" : "bad" },
          { label: "क्षमता", value: fmt(r.cap, 0) + " req/s (" + s.workers + " वर्कर)" },
          { label: "अगला कदम", value: r.fail === "OK" ? (r.overload ? "वर्कर/स्केल या MS घटाएँ" : "तैयार — HSTS और बैकअप जोड़ें") : r.fail === "DNS" ? "A रिकॉर्ड जाँच" : r.fail === "Binding" ? "host header मिलाएँ" : r.fail === "Firewall" ? "443 नियम जोड़ें" : r.fail === "Service" ? "W3SVC चालू करें" : "सर्टिफिकेट नवीनीकृत करें" }
        ];
      },
      judge: function (s, r) {
        if (r.fail !== "OK") return { kind: "bad", text: "पथ की पहली टूटी कड़ी: " + r.fail + " — " + r.code + "। जाँच का क्रम याद रखें: DNS → बाइंडिंग → फायरवॉल → सेवा → सर्टिफिकेट।" };
        if (r.overload) return { kind: "bad", text: "साइट सही पर " + fmt(r.queue, 0) + " अनुरोध कतार में — वर्कर बढ़ाएँ, कैशिंग लगाएँ या प्रोसेसिंग समय घटाएँ।" };
        return { kind: "good", text: "200 OK: नाम हल, बाइंडिंग मेल, पोर्ट खुला, सेवा चलती, सर्टिफिकेट " + s.days + " दिन में वैध और क्षमता पर्याप्त।" };
      },
      lock: function (s, r) {
        return "माप लॉक: " + r.code + " — " + fmt(r.cap, 0) + " req/s क्षमता, मांग " + s.clients + "।";
      }
    },

    /* T23 — हार्डनिंग स्कोर */
    harden: {
      vars: [
        { k: "ports", label: "खुले inbound पोर्ट", min: 1, max: 40, step: 1, value: 18 },
        { k: "days", label: "पैच में देरी", min: 0, max: 180, step: 5, value: 60, unit: " दिन" },
        { k: "weak", label: "कमजोर पासवर्ड नीति वाले खाते", min: 0, max: 100, step: 5, value: 45, unit: "%" },
        { k: "admins", label: "स्थानीय प्रशासक", min: 1, max: 20, step: 1, value: 9 }
      ],
      flags: [
        { k: "audit", label: "ऑडिट पॉलिसी चालू", value: false },
        { k: "test", label: "बैकअप का restore टेस्ट किया", value: false },
        { k: "laps", label: "LAPS से स्थानीय पासवर्ड घुमाए", value: false }
      ],
      calc: function (s) {
        var surface = s.ports * 2 + s.days * 0.35 + s.weak * 0.3 + s.admins * 1.6;
        var credit = (s.audit ? 14 : 0) + (s.test ? 16 : 0) + (s.laps ? 10 : 0);
        var score = clamp(surface - credit, 0, 160);
        var band = score < 30 ? "कम जोखिम" : score < 70 ? "मध्यम" : "उच्च जोखिम";
        var quick = s.ports > 12 ? "खुले पोर्ट घटाएँ" : s.days > 30 ? "पैच विंडो लगाएँ" : s.weak > 20 ? "पासवर्ड नीति + LAPS" : s.admins > 4 ? "अतिरिक्त प्रशासक हटाएँ" : !s.test ? "restore टेस्ट करें" : !s.audit ? "ऑडिट चालू करें" : "सब ठीक";
        return { surface: surface, credit: credit, score: score, band: band, quick: quick };
      },
      meters: function (s, r) {
        return [
          { label: "हमला-सतह (आँकड़ा)", ratio: ratio(r.surface, 0, 140), show: fmt(r.surface, 0), tone: r.surface < 50 ? "ok" : r.surface < 90 ? "warn" : "bad" },
          { label: "रक्षा क्रेडिट", ratio: ratio(r.credit, 0, 40), show: "−" + fmt(r.credit, 0), tone: r.credit >= 30 ? "ok" : r.credit > 0 ? "warn" : "bad" },
          { label: "शेष जोखिम", ratio: ratio(r.score, 0, 140), show: fmt(r.score, 0) + " — " + r.band, tone: r.score < 30 ? "ok" : r.score < 70 ? "warn" : "bad" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "पोर्ट", value: s.ports + " inbound", kind: s.ports <= 6 ? "good" : "bad" },
          { label: "पैच देरी", value: s.days + " दिन", kind: s.days <= 30 ? "good" : "bad" },
          { label: "कुल जोखिम", value: r.band, kind: r.score < 70 ? (r.score < 30 ? "good" : "") : "bad" },
          { label: "सबसे तेज़ सुधार", value: r.quick, kind: r.score < 30 ? "" : "bad" }
        ];
      },
      judge: function (s, r) {
        if (s.ports > 12) return { kind: "bad", text: s.ports + " पोर्ट खुले — हर पोर्ट एक दरवाजा। आवश्यक 5–6 तक सीमित करें, बाकी profile-आधारित नियम से बंद करें।" };
        if (!s.test) return { kind: "bad", text: "restore टेस्ट नहीं किया — बिना परीक्षित बैकअप रैंसमवेयर के बाद काम नहीं आएगा; यही सबसे बड़ा छिपा जोखिम है।" };
        if (r.score < 30) return { kind: "good", text: "जोखिम " + fmt(r.score, 0) + " (" + r.band + ") — कम पोर्ट, पैच विंडो, ऑडिट और टेस्टेड बैकअप; यही लेखित बेसलाइन है।" };
        return { kind: "bad", text: "जोखिम " + fmt(r.score, 0) + " (" + r.band + ") — सबसे तेज़ सुधार: " + (s.days > 30 ? "पैच विंडो" : s.weak > 20 ? "पासवर्ड नीति + LAPS" : "अतिरिक्त स्थानीय प्रशासक हटाएँ") + "।" };
      },
      lock: function (s, r) {
        return "माप लॉक: सतह " + fmt(r.surface, 0) + ", क्रेडिट " + fmt(r.credit, 0) + " → जोखिम " + fmt(r.score, 0) + " (" + r.band + ")।";
      }
    },

    /* T25 — DMZ/फायरवॉल नियम जाँच */
    dmz: {
      vars: [
        { k: "port", label: "गंतव्य पोर्ट", min: 20, max: 8080, step: 1, value: 443 }
      ],
      opts: [
        { k: "from", label: "स्रोत ज़ोन", options: ["इंटरनेट", "गेस्ट वाई-फाई", "ऑफिस LAN", "प्रबंधन VLAN"], def: 0 },
        { k: "to", label: "गंतव्य", options: ["वेब सर्वर (DMZ)", "फाइल सर्वर (LAN)", "डोमेन कंट्रोलर (LAN)", "राउटर/FW (प्रबंधन)"], def: 0 }
      ],
      calc: function (s) {
        var p = s.port;
        var web = s.to === "वेब सर्वर (DMZ)";
        var file = s.to === "फाइल सर्वर (LAN)";
        var dc = s.to === "डोमेन कंट्रोलर (LAN)";
        var mg = s.to === "राउटर/FW (प्रबंधन)";
        var rule = "";
        var allow = false;
        if (s.from === "इंटरनेट") {
          allow = web && (p === 80 || p === 443);
          rule = allow ? "अनुमति: सार्वजनिक सेवा DMZ में, केवल 80/443" : "अस्वीकृत: इंटरनेट से भीतरी नेटवर्क सीधे नहीं";
        } else if (s.from === "गेस्ट वाई-फाई") {
          allow = false;
          rule = "अस्वीकृत: गेस्ट को केवल इंटरनेट, LAN/प्रबंधन से अलग (NAT-only)";
        } else if (s.from === "ऑफिस LAN") {
          allow = web || file || (dc && [53, 88, 389, 445, 636, 3268].indexOf(p) >= 0);
          rule = allow ? "अनुमति: LAN → " + (web ? "DMZ सेवा" : dc ? "AD सेवाएँ" : "फाइल शेयर") : "अस्वीकृत: यह पोर्ट इस सेवा के लिए नहीं";
        } else {
          allow = mg || dc || file;
          rule = allow ? "अनुमति: प्रबंधन VLAN सीमित स्रोत से ही प्रबंधन पोर्ट पर" : "अस्वीकृत: प्रबंधन पहुँच इस गंतव्य पर नहीं";
        }
        var risky = allow && (p === 21 || p === 23 || p === 3389 || p === 445) && s.from === "इंटरनेट";
        return { allow: allow, rule: rule, risky: risky, log: (s.from.split(" ")[0] + " → " + s.to.split(" (")[0] + ":" + p + " " + (allow ? "PERMIT" : "DENY")).replace(/"/g, "") };
      },
      meters: function (s, r) {
        return [
          { label: "नियम मिला?", ratio: 1, show: r.allow ? "PERMIT" : "DENY", tone: r.allow ? "ok" : "warn" },
          { label: "जोखिम", ratio: r.risky ? 1 : 0.15, show: r.risky ? "खतरनाक खुला पोर्ट" : "स्वीकार्य", tone: r.risky ? "bad" : "ok" },
          { label: "लॉग प्रविष्टि", ratio: 1, show: r.log, tone: "ok" }
        ];
      },
      stats: function (s, r) {
        return [
          { label: "स्रोत", value: s.from },
          { label: "गंतव्य", value: s.to },
          { label: "निर्णय", value: r.allow ? "ट्रैफिक आगे जाएगा" : "ब्लॉक + लॉग", kind: r.allow && !r.risky ? "good" : r.allow ? "bad" : "" },
          { label: "कारण", value: r.rule, kind: r.risky ? "bad" : "" }
        ];
      },
      judge: function (s, r) {
        if (r.risky) return { kind: "bad", text: "पोर्ट " + s.port + " इंटरनेट पर खुला — FTP/Telnet/RDP/SMB का यही दुरुपयोग होता है। VPN के पीछे डालें या बंद करें।" };
        if (!r.allow) return { kind: "", text: r.rule + " — नियम का क्रम याद रखें: ज़ोन → सेवा → पोर्ट, और अंत में implicit deny।" };
        return { kind: "good", text: r.rule + "। लॉग में " + r.log + " दर्ज होगा; हर अनुमति के पीछे एक कारण लिखा हो।" };
      },
      lock: function (s, r) {
        return "माप लॉक: " + r.log + " — " + r.rule + "।";
      }
    }
  };

  function sceneLab(sim, body, ctx) {
    var spec = LABS[sim.lab];
    if (!spec) {
      var miss = document.createElement("p");
      miss.className = "sim-hint";
      miss.textContent = "यह लैब लोड नहीं हो सका — पेज फिर से खोलकर देखें।";
      body.appendChild(miss);
      return;
    }
    var ui = shell(body, sim);
    var state = {};
    (spec.vars || []).forEach(function (v) { state[v.k] = v.value; });
    (spec.opts || []).forEach(function (o) { state[o.k] = o.options[o.def || 0]; });
    (spec.flags || []).forEach(function (f) { state[f.k] = !!f.value; });

    var html = "";
    if ((spec.vars || []).length) {
      html += '<div class="live-row">' + spec.vars.map(function (v) {
        var lbl = v.labelMap ? v.labelMap[v.value] : fmt(v.value, v.digits == null ? 0 : v.digits) + (v.unit || "");
        return '<label class="live-field">' + esc(v.label) + "<output>" + esc(lbl) + "</output>" +
          '<input type="range" min="' + v.min + '" max="' + v.max + '" step="' + (v.step || 1) + '" value="' + v.value + '" data-lab="' + v.k + '"></label>';
      }).join("") + "</div>";
    }
    if ((spec.opts || []).length) {
      html += spec.opts.map(function (o) {
        return '<div class="live-row"><span class="live-field">' + esc(o.label) + '</span><span class="live-seg">' +
          o.options.map(function (op) {
            return '<button type="button" class="seg' + (op === state[o.k] ? " on" : "") + '" data-opt="' + esc(o.k) + '" data-val="' + esc(op) + '">' + esc(op) + "</button>";
          }).join("") + "</span></div>";
      }).join("");
    }
    if ((spec.flags || []).length) {
      html += '<div class="live-row">' + spec.flags.map(function (f) {
        return '<label class="live-check"><input type="checkbox" data-flag="' + esc(f.k) + '"' + (f.value ? " checked" : "") + ">" + esc(f.label) + "</label>";
      }).join("") + "</div>";
    }
    html += '<div class="live-row"><button type="button" class="btn btn-sm" data-lock="">माप लॉक करें</button>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-reset="">मान दोबारा</button></div>';
    ui.controls.innerHTML = html;

    var result = spec.calc(state);
    var meters = spec.meters ? spec.meters(state, result) : [];
    ui.stage.innerHTML = '<canvas class="live-scope" width="640" height="' + (26 + Math.max(2, meters.length) * 52) + '" aria-label="' + esc(sim.title) + ' — माप पट्टी"></canvas>';
    var canvas = ui.stage.querySelector("canvas");
    var g = canvas.getContext("2d");
    var phase = 0;
    var TONE = { ok: "#58c4a9", warn: "#e0a43d", bad: "#d9615a" };

    function paint() {
      var w = canvas.width, h = canvas.height;
      g.clearRect(0, 0, w, h);
      g.fillStyle = "#071a25";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "rgba(120,170,195,.16)";
      g.lineWidth = 1;
      for (var x = 0; x <= w; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      meters.forEach(function (m, i) {
        var y = 20 + i * 52;
        g.fillStyle = "#9fc3d6";
        g.font = "15px system-ui, sans-serif";
        g.fillText(String(m.label).slice(0, 40), 12, y);
        var bx = 12, bw = w - 24, bh = 22, by = y + 8;
        g.fillStyle = "rgba(255,255,255,.07)";
        g.fillRect(bx, by, bw, bh);
        var fill = Math.max(3, Math.min(1, m.ratio || 0) * bw);
        g.fillStyle = TONE[m.tone] || TONE.ok;
        g.fillRect(bx, by, fill, bh);
        var sweep = (phase * 2 + i * 26) % (bw + 60) - 30;
        g.fillStyle = "rgba(255,255,255,.13)";
        g.fillRect(bx + Math.max(0, sweep), by, 26, bh);
        g.strokeStyle = "rgba(255,255,255,.22)";
        g.strokeRect(bx + 0.5, by + 0.5, bw, bh);
        g.fillStyle = "#eaf4f9";
        g.font = "bold 15px system-ui, sans-serif";
        var text = String(m.show == null ? "" : m.show);
        g.fillText(text.slice(0, 42), bx + 8, by + 17);
      });
    }

    function refresh() {
      result = spec.calc(state);
      meters = spec.meters ? spec.meters(state, result) : [];
      stats(ui.readout, spec.stats(state, result));
      var j = spec.judge(state, result);
      status(ui, j.text, j.kind);
      paint();
    }

    function loop() {
      phase += 1;
      paint();
      window.requestAnimationFrame(loop);
    }

    (spec.vars || []).forEach(function (v) {
      bindRange(ui.root, '[data-lab="' + v.k + '"]', function (val) {
        state[v.k] = val;
        var out = ui.root.querySelector('[data-lab="' + v.k + '"]').parentNode.querySelector("output");
        if (out) out.textContent = v.labelMap ? (v.labelMap[val] || val) : fmt(val, v.digits == null ? 0 : v.digits) + (v.unit || "");
        refresh();
      });
    });
    Array.prototype.forEach.call(ui.root.querySelectorAll("[data-opt]"), function (btn) {
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-opt");
        state[k] = btn.getAttribute("data-val");
        Array.prototype.forEach.call(ui.root.querySelectorAll('[data-opt="' + k + '"]'), function (other) {
          other.classList.toggle("on", other === btn);
        });
        refresh();
      });
    });
    Array.prototype.forEach.call(ui.root.querySelectorAll("[data-flag]"), function (box) {
      box.addEventListener("change", function () {
        state[box.getAttribute("data-flag")] = box.checked;
        refresh();
      });
    });
    ui.root.querySelector("[data-lock]").addEventListener("click", function () {
      var r = spec.calc(state);
      var j = spec.judge(state, r);
      if (j.kind === "bad") { status(ui, "पहले गलती सुधारें — " + j.text, "bad"); return; }
      finish(ui, ctx, spec.lock ? spec.lock(state, r) : j.text);
    });
    ui.root.querySelector("[data-reset]").addEventListener("click", function () {
      (spec.vars || []).forEach(function (v) {
        state[v.k] = v.value;
        var input = ui.root.querySelector('[data-lab="' + v.k + '"]');
        if (input) { input.value = v.value; input.parentNode.querySelector("output").textContent = v.labelMap ? v.labelMap[v.value] : fmt(v.value, v.digits == null ? 0 : v.digits) + (v.unit || ""); }
      });
      (spec.opts || []).forEach(function (o) {
        state[o.k] = o.options[o.def || 0];
        Array.prototype.forEach.call(ui.root.querySelectorAll('[data-opt="' + o.k + '"]'), function (b) {
          b.classList.toggle("on", b.getAttribute("data-val") === state[o.k]);
        });
      });
      (spec.flags || []).forEach(function (f) {
        state[f.k] = !!f.value;
        var box = ui.root.querySelector('[data-flag="' + f.k + '"]');
        if (box) box.checked = !!f.value;
      });
    });
    refresh();
    loop();
  }

  window.TRADE_LABS = LABS;

  var scenes = {
    smps: sceneSmps,
    post: scenePost,
    hdd: sceneHdd,
    ram: sceneRam,
    printer: scenePrinter,
    ups: sceneUps,
    subnet: sceneSubnet,
    vlan: sceneVlan,
    wireless: sceneWireless,
    raid: sceneRaid,
    chmod: sceneChmod,
    dora: sceneDora,
    lab: sceneLab
  };

  window.FITradeLive = {
    mount: function (sim, body, ctx) {
      var fn = scenes[sim.scene];
      if (fn) fn(sim, body, ctx || {});
    }
  };
})();
