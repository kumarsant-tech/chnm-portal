
/* =====================================================================
   कंप्यूटर लैब  ·  app.js
   सेक्शन रेंडरिंग · साइडबार मेनू · क्विज़ · डायग्राम · प्रगति
   ===================================================================== */
(function () {
  'use strict';

  var ALL = window.CL_SECTIONS || [];

  /* =================================================================
     एक-विषय-पेज मोड
     हर topic अब Computer-Lab/ के अलग HTML पेज में है। पेज window.CL_TOPIC
     से अपना topic id बताता है और window.CL_TOPIC_FILES से बाकी पेजों के
     नाम मिलते हैं। बिना CL_TOPIC वाले पुराने single-file पेज पर यह मोड
     बंद रहता है और सारे विषय एक ही पेज में दिखते हैं।
     ================================================================= */
  var TOPIC = window.CL_TOPIC || null;
  var FILES = window.CL_TOPIC_FILES || {};
  /* पोर्टल मोड: पोर्टल के साइडबार से '?p=1' के साथ आया है → लैब का फुल शेल छिपाएं */
  var PM = /[?&]p=1(&|$)/.test(location.search);
  if (PM) document.documentElement.classList.add('portal-mode');
  function U(u){ return (PM && u && u.indexOf('?')<0) ? u+'?p=1' : u; }
  var SECTIONS = TOPIC ? ALL.filter(function (s) { return s.id === TOPIC; }) : ALL;
  if (TOPIC && !SECTIONS.length) TOPIC = null, SECTIONS = ALL;

  /* समूहों का क्रम — साइडबार, प्रिंट और अगला/पिछला इसी क्रम से चलेंगे */
  var GROUP_ORDER = [
    'आधार', 'मदरबोर्ड मास्टरक्लास', 'असेंबली', 'कनेक्शन', 'सिस्टम',
    'सर्विसिंग मास्टरक्लास', 'प्रैक्टिकल',
    'कंप्यूटर विज्ञान', 'हार्डवेयर गहराई', 'विंडोज़ मास्टरक्लास',
    'लिनक्स मास्टरक्लास', 'MS Office मास्टरक्लास', 'इंटरनेट व साइबर सुरक्षा',
    'सॉफ़्टवेयर संसार', 'सॉफ़्टवेयर प्रैक्टिकल'
  ];
  var ORDER = (function () {
    var groups = [], out = [];
    ALL.forEach(function (s) { if (groups.indexOf(s.group) < 0) groups.push(s.group); });
    groups.sort(function (a, b) {
      var ia = GROUP_ORDER.indexOf(a), ib = GROUP_ORDER.indexOf(b);
      if (ia < 0) ia = 90; if (ib < 0) ib = 90;
      return ia - ib;
    });
    groups.forEach(function (g) {
      ALL.forEach(function (s) { if (s.group === g) out.push(s); });
    });
    /* 'होम' अब सूची/क्रम से बाहर — पहला विषय सीधे खुलता है */
    return out.filter(function (s) { return s.id !== 'home'; });
  })();
  function orderIndex(id) {
    for (var i = 0; i < ORDER.length; i++) if (ORDER[i].id === id) return i;
    return -1;
  }

  var LS = {
    visited: 'cl3d.visited', labs: 'cl3d.labs', quiz: 'cl3d.quiz', theme: 'cl3d.theme', fs: 'cl3d.fs', lang: 'cl3d.lang'
  };
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }

  var visited = lsGet(LS.visited, {});
  var labDone = lsGet(LS.labs, {});

  /* =================================================================
     डायग्राम (SVG)
     ================================================================= */
  var FONT = 'Noto Sans Devanagari, sans-serif';
  var DIAGRAMS = {
    blockDiagram: function () {
      function b(x, y, w, h, t, sub, fill, stroke) {
        return '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"/>' +
          '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 - 4) + '" text-anchor="middle" fill="#e8eefc" font-size="17" font-weight="700" font-family="' + FONT + '">' + t + '</text>' +
          '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 18) + '" text-anchor="middle" fill="#9fb6d6" font-size="13" font-family="' + FONT + '">' + sub + '</text></g>';
      }
      function arrow(x1, y1, x2, y2, label, dash) {
        return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#ah)"' + (dash ? ' stroke-dasharray="6 5"' : '') + '/>' +
          (label ? '<text x="' + ((x1 + x2) / 2) + '" y="' + ((y1 + y2) / 2 - 8) + '" text-anchor="middle" fill="#7dd3fc" font-size="12.5" font-family="' + FONT + '">' + label + '</text>' : '');
      }
      return '<svg viewBox="0 0 900 470" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="ah" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 z" fill="#38bdf8"/></marker></defs>' +
        b(40, 80, 180, 90, 'इनपुट यूनिट', 'कीबोर्ड · माउस · स्कैनर', '#122036', '#3b82f6') +
        b(360, 40, 220, 170, 'CPU (प्रोसेसर)', 'CU + ALU + रजिस्टर', '#172a1f', '#22c55e') +
        b(680, 80, 180, 90, 'आउटपुट यूनिट', 'मॉनिटर · प्रिंटर', '#2a1c31', '#a78bfa') +
        b(360, 250, 220, 80, 'मेमोरी यूनिट', 'RAM + ROM (प्राइमरी)', '#2b2416', '#f59e0b') +
        b(360, 370, 220, 80, 'सेकेंडरी स्टोरेज', 'HDD · SSD · NVMe', '#1a2333', '#22d3ee') +
        arrow(224, 125, 356, 125, 'डेटा') +
        arrow(584, 125, 676, 125, 'परिणाम') +
        arrow(430, 214, 430, 246, 'डेटा/निर्देश', true) +
        arrow(510, 214, 510, 246, '', true) +
        arrow(430, 334, 430, 366, 'सेव/लोड', true) +
        '<text x="450" y="30" text-anchor="middle" fill="#94a3c4" font-size="13" font-family="' + FONT + '">कंप्यूटर का ब्लॉक डायग्राम — सारे हिस्से एक-दूसरे से बस (Bus) द्वारा जुड़ते हैं</text>' +
        '</svg>';
    },
    motherboardMap: function () {
      function pin(x, y, t, col) {
        return '<g><rect x="' + x + '" y="' + y + '" width="150" height="26" rx="7" fill="#0e2a44" stroke="' + (col || '#38bdf8') + '" stroke-width="1.8"/>' +
          '<text x="' + (x + 75) + '" y="' + (y + 18) + '" text-anchor="middle" fill="#cfe3ff" font-size="12.5" font-weight="600" font-family="' + FONT + '">' + t + '</text></g>';
      }
      return '<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="230" y="30" width="640" height="460" rx="16" fill="#0b2018" stroke="#1d6b4f" stroke-width="2.5"/>' +
        '<text x="550" y="58" text-anchor="middle" fill="#7dd3a8" font-size="15" font-weight="700" font-family="IBM Plex Mono, monospace">MOTHERBOARD — कनेक्शन मैप</text>' +
        '<rect x="270" y="90" width="150" height="150" rx="10" fill="none" stroke="#2b6b8f" stroke-dasharray="6 5"/>' +
        '<text x="345" y="172" text-anchor="middle" fill="#5f8db5" font-size="13" font-family="' + FONT + '">CPU सॉकेट + कूलर</text>' +
        '<rect x="450" y="92" width="24" height="200" rx="5" fill="none" stroke="#2b6b8f" stroke-dasharray="6 5"/>' +
        '<rect x="482" y="92" width="24" height="200" rx="5" fill="none" stroke="#2b6b8f" stroke-dasharray="6 5"/>' +
        '<text x="478" y="315" text-anchor="middle" fill="#5f8db5" font-size="13" font-family="' + FONT + '">RAM स्लॉट (DIMM ×2/4)</text>' +
        '<rect x="270" y="330" width="210" height="40" rx="8" fill="none" stroke="#2b6b8f" stroke-dasharray="6 5"/>' +
        '<text x="375" y="356" text-anchor="middle" fill="#5f8db5" font-size="13" font-family="' + FONT + '">PCIe x16 (GPU)</text>' +
        '<rect x="270" y="400" width="110" height="34" rx="8" fill="none" stroke="#2b6b8f" stroke-dasharray="6 5"/>' +
        '<text x="325" y="422" text-anchor="middle" fill="#5f8db5" font-size="12" font-family="' + FONT + '">M.2 स्लॉट</text>' +
        pin(690, 92, 'CPU_PWR (4/8-pin)', '#f59e0b') +
        pin(690, 130, 'SYS_FAN / CHA_FAN') +
        pin(690, 168, 'CPU_FAN') +
        pin(690, 216, '24-pin ATX मेन', '#facc15') +
        pin(690, 262, 'SATA 0/1/2/3') +
        pin(690, 308, 'F_PANEL (JFP1)', '#f472b6') +
        pin(690, 354, 'F_USB / USB3_1', '#34d399') +
        pin(690, 400, 'AAFP / HD_AUDIO', '#c084fc') +
        pin(690, 446, 'BIOS चिप + CMOS बैटरी', '#a3e635') +
        pin(560, 446, 'JP1-3 (BIOS सेट)', '#94a3b8') +
        '<text x="40" y="60" fill="#9fb6d6" font-size="14" font-weight="700" font-family="' + FONT + '">I/O पैनल</text>' +
        '<rect x="40" y="80" width="150" height="330" rx="12" fill="#131a26" stroke="#3b82f6" stroke-width="2"/>' +
        ['USB 3.0 ×2', 'USB 2.0 ×2', 'HDMI / DP', 'RJ45 (LAN)', 'ऑडियो जैक ×3', 'PS/2 (पुराना)', 'Wi-Fi एंटेना', 'VGA (पुराना)'].map(function (s, i) {
          return '<text x="115" y="' + (110 + i * 38) + '" text-anchor="middle" fill="#8fb4dd" font-size="12.5" font-family="' + FONT + '">' + s + '</text>';
        }).join('') +
        '<text x="40" y="445" fill="#94a3c4" font-size="12" font-family="' + FONT + '">(बैक पैनल — केस के पीछे दिखता है)</text>' +
        '</svg>';
    },
    networkTopo: function () {
      function n(x, y, w, h, t1, t2, fill, stroke) {
        return '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"/>' +
          '<text x="' + (x + w / 2) + '" y="' + (y + h / 2) + '" text-anchor="middle" fill="#e8eefc" font-size="14" font-weight="700" font-family="' + FONT + '">' + t1 + '</text>' +
          (t2 ? '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 20) + '" text-anchor="middle" fill="#9fb6d6" font-size="12" font-family="' + FONT + '">' + t2 + '</text>' : '') + '</g>';
      }
      function ln(x1, y1, x2, y2, c) {
        return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || '#38bdf8') + '" stroke-width="2"/>';
      }
      return '<svg viewBox="0 0 900 460" xmlns="http://www.w3.org/2000/svg">' +
        n(360, 20, 180, 64, 'इंटरनेट (ISP)', 'WAN / ऑप्टिकल फ़ाइबर', '#152238', '#3b82f6') +
        ln(450, 84, 450, 130) +
        n(360, 130, 180, 66, 'राउटर + Wi-Fi', 'DHCP सर्वर · 192.168.1.1', '#16324f', '#22d3ee') +
        ln(450, 196, 450, 240) +
        n(350, 240, 200, 60, 'स्विच (Switch)', '8/16/24 पोर्ट · LAN केंद्र', '#1b2a44', '#a78bfa') +
        ln(400, 300, 120, 360, '#4ade80') +
        ln(450, 300, 450, 360, '#4ade80') +
        ln(500, 300, 780, 360, '#4ade80') +
        n(30, 360, 180, 66, 'PC 1 (टीचर)', '192.168.1.10', '#122036', '#4ade80') +
        n(360, 360, 180, 66, 'PC 2…PC 40', '192.168.1.11–.50', '#122036', '#4ade80') +
        n(690, 360, 180, 66, 'प्रिंटर / CCTV', 'शेयर्ड नेटवर्क डिवाइस', '#2a1c31', '#f472b6') +
        '<text x="450" y="448" text-anchor="middle" fill="#94a3c4" font-size="12.5" font-family="' + FONT + '">स्टार टोपोलॉजी — हर डिवाइस का अपना केबल सीधे स्विच से (Cat5e/Cat6, RJ45, अधिकतम 100 मीटर)</text>' +
        '</svg>';
    }
  };

  /* बाहरी फ़ाइलों (data-mb-theory.js, data-svc-theory.js आदि) में बने डायग्राम
     अपने-आप जोड़ लें:  MBdiagChipsetClassic -> MBchipsetClassic
                        SVdiagSafety         -> SVsafety            */
  Object.keys(window).forEach(function (k) {
    var m = /^([A-Z]{2})diag([A-Z][A-Za-z0-9]*)$/.exec(k);
    if (m && typeof window[k] === 'function') {
      var alias = m[1] + m[2].charAt(0).toLowerCase() + m[2].slice(1);
      if (!DIAGRAMS[alias]) DIAGRAMS[alias] = window[k];
    }
  });

  /* =================================================================
     क्विज़ प्रश्न
     ================================================================= */
  var QUIZ = [
    { q: 'CPU का पूरा नाम क्या है?', o: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Control Processing Unit'], a: 0, ex: 'CPU = Central Processing Unit — इसमें CU, ALU और रजिस्टर होते हैं।' },
    { q: 'कंप्यूटर में 1 बाइट बराबर होता है —', o: ['4 बिट', '8 बिट', '16 बिट', '1024 बिट'], a: 1, ex: '1 बाइट = 8 बिट। 1 KB = 1024 बाइट।' },
    { q: 'कौन-सी मेमोरी अस्थायी (Volatile) होती है?', o: ['ROM', 'RAM', 'HDD', 'BIOS'], a: 1, ex: 'RAM में बिजली जाते ही डेटा मिट जाता है, इसलिए उसे Volatile कहते हैं।' },
    { q: 'मदरबोर्ड पर CPU कहाँ लगता है?', o: ['DIMM स्लॉट', 'PCIe स्लॉट', 'CPU सॉकेट', 'SATA पोर्ट'], a: 2, ex: 'CPU सॉकेट (LGA/PGA) में। रैम DIMM स्लॉट में, कार्ड PCIe में।' },
    { q: 'थर्मल पेस्ट का काम क्या है?', o: ['CPU को चिपकाना', 'CPU और कूलर के बीच गर्मी का अच्छा संचार', 'बिजली देना', 'धूल रोकना'], a: 1, ex: 'पेस्ट हवा के अंतराल को भरता है ताकि गर्मी कूलर तक जल्दी पहुँचे।' },
    { q: '24-pin कनेक्टर कहाँ लगता है?', o: ['HDD में', 'मदरबोर्ड के मुख्य पावर हेडर में', 'GPU में', 'मॉनिटर में'], a: 1, ex: 'यह SMPS से मदरबोर्ड को मुख्य पावर देता है — न लगे तो PC चालू नहीं होगा।' },
    { q: 'CPU 8-pin पावर कनेक्टर न लगा हो तो क्या सबसे संभव है?', o: ['PC पूरी तरह बंद रहेगा', 'फैन घूमेंगे पर स्क्रीन काली रहेगी', 'डिस्क नहीं दिखेगी', 'साउंड न आए'], a: 1, ex: '24-pin से फैन/LED चलते हैं, पर CPU को पावर न मिले तो POST नहीं होगा — स्क्रीन काली।' },
    { q: 'फ्रंट पैनल के LED तार में ध्रुवता (+/−) ग़लत लग जाए तो?', o: ['मदरबोर्ड जल जाएगा', 'LED नहीं जलेगी, नुकसान नहीं', 'PC चालू नहीं होगा', 'फ्यूज़ उड़ जाएगा'], a: 1, ex: 'LED (डायोड) एक दिशा में चलती है — उलटी लगे तो सिर्फ़ नहीं जलेगी। PWR_SW/RESET में ध्रुवता का फ़र्क़ नहीं पड़ता।' },
    { q: 'SMPS क्या करता है?', o: ['AC को DC में बदलता है', 'DC को AC में बदलता है', 'डेटा स्टोर करता है', 'डिस्प्ले चलाता है'], a: 0, ex: 'SMPS = Switched Mode Power Supply. 230V AC को +12V/+5V/+3.3V DC में बदलता है।' },
    { q: 'FAT32 में अधिकतम फ़ाइल साइज़ कितनी हो सकती है?', o: ['2 GB', '4 GB', '8 GB', 'कोई सीमा नहीं'], a: 1, ex: 'FAT32 में एक फ़ाइल 4 GB से बड़ी नहीं हो सकती — इसलिए बड़े डेटा के लिए exFAT/NTFS।' },
    { q: 'M.2 NVMe SSD किस इंटरफ़ेस का उपयोग करती है?', o: ['SATA', 'IDE', 'PCIe', 'USB'], a: 2, ex: 'M.2 NVMe SSD PCIe लेन (PCIe 3.0/4.0/5.0) पर चलती है — इसीलिए बहुत तेज़।' },
    { q: 'HDD में डेटा कहाँ रहता है?', o: ['प्लेटर पर चुंबकीय रूप में', 'चिप में', 'RAM में', 'कैपेसिटर में'], a: 0, ex: 'प्लेटर की सतह पर चुंबकीय रूप में; रीड/राइट हेड उसे पढ़ता/लिखता है।' },
    { q: 'POST का पूरा नाम?', o: ['Power On Self Test', 'Post Operating System Test', 'Peripheral Output System Test', 'Primary Onboard Storage Test'], a: 0, ex: 'POST = Power On Self Test — OS लोड होने से पहले हार्डवेयर की जाँच।' },
    { q: '1 छोटी बीप का अर्थ?', o: ['RAM फेल', 'POST सफल', 'GPU फेल', 'कीबोर्ड फेल'], a: 1, ex: 'एक छोटी बीप = सब जाँच पास, POST सफल।' },
    { q: '3 बीप आने पर सबसे पहले क्या जाँचें?', o: ['मॉनिटर', 'RAM', 'HDD', 'LAN'], a: 1, ex: '3 बीप = बेस 64K मेमोरी फेल → RAM की जाँच।' },
    { q: 'CMOS बैटरी के ख़त्म होने का असर?', o: ['PC बूट नहीं होगा', 'हर बार तारीख-समय गलत', 'RAM कम दिखेगी', 'इंटरनेट बंद'], a: 1, ex: 'BIOS सेटिंग व घड़ी के लिए CR2032 बैटरी चाहिए; ख़त्म होने पर तारीख-समय बार-बार रीसेट होगा।' },
    { q: 'BIOS में बूट ऑर्डर क्यों बदलते हैं?', o: ['स्पीड बढ़ाने', 'USB/SSD से बूट कराने', 'रैम बढ़ाने', 'वोल्टेज सेट करने'], a: 1, ex: 'Windows इंस्टॉल या रिकवरी के लिए पेनड्राइव/USB को पहले रखते हैं।' },
    { q: 'Windows 11 के लिए कौन-सी चीज़ ज़रूरी है?', o: ['TPM 2.0 + Secure Boot + UEFI/GPT', 'BIOS + MBR', 'RAID 5', 'PS/2 कीबोर्ड'], a: 0, ex: 'Windows 11 के लिए UEFI (GPT), Secure Boot और TPM 2.0 अनिवार्य हैं।' },
    { q: 'MBR कितनी बड़ी डिस्क को सपोर्ट करता है?', o: ['1 TB', '2 TB', '4 TB', 'कोई सीमा नहीं'], a: 1, ex: 'MBR 2 TB तक और अधिकतम 4 प्राइमरी पार्टीशन; GPT में यह सीमा नहीं।' },
    { q: 'RAID 1 क्या करता है?', o: ['स्पीड दोगुनी', 'मिररिंग (डेटा कॉपी)', 'पैरिटी', 'कंप्रेशन'], a: 1, ex: 'RAID 1 में दो डिस्क पर एक जैसा डेटा रहता है — एक ख़राब हो तो डेटा सुरक्षित।' },
    { q: 'UTP केबल का कनेक्टर कौन-सा है?', o: ['RJ11', 'RJ45', 'BNC', 'USB'], a: 1, ex: 'LAN केबल (UTP Cat5e/Cat6) में RJ45 (8 pin) कनेक्टर लगता है।' },
    { q: 'स्ट्रेट-थ्रू LAN केबल के दोनों सिरों का क्रम होता है —', o: ['एक T568A, एक T568B', 'दोनों T568B', 'दोनों उलटे', 'कोई नियम नहीं'], a: 1, ex: 'स्ट्रेट केबल में दोनों सिरे एक ही मानक (आमतौर पर T568B) के होते हैं।' },
    { q: '169.254.x.x IP एड्रेस का क्या मतलब है?', o: ['इंटरनेट तेज़ है', 'DHCP सर्वर नहीं मिला (APIPA)', 'IP कॉन्फ़्लिक्ट नहीं', 'गेटवे ठीक है'], a: 1, ex: 'यह APIPA रेंज है — Windows ने ख़ुद बना लिया, यानी DHCP/नेटवर्क से कनेक्ट नहीं हुआ।' },
    { q: 'इंटरनेट न आने पर सबसे पहले कौन-सा कमांड?', o: ['chkdsk', 'ipconfig', 'sfc /scannow', 'defrag'], a: 1, ex: 'ipconfig से IP, गेटवे, DNS देखिए। फिर ping से आगे बढ़िए।' },
    { q: 'डिलीट की गई फ़ाइल वापस पाने के लिए सबसे ज़रूरी नियम?', o: ['उसी ड्राइव पर लिखना बंद करें', 'PC रीस्टार्ट करें', 'फ़ॉर्मेट करें', 'विंडोज़ अपडेट करें'], a: 0, ex: 'डिलीट पर सिर्फ़ इंडेक्स हटता है; नया डेटा लिखने पर पुराना डेटा अधिलेखित हो जाता है, तब रिकवरी कठिन।' }
  ];

  /* =================================================================
     ब्लॉक रेंडरर
     ================================================================= */
  function E(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* =================================================================
     द्विभाषी टेबल (हिंदी + English)  —  js/i18n-en.js का CL_EN शब्दकोश
     ================================================================= */
  var EN = window.CL_EN || {};
  var DEVA = /[\u0900-\u097F]/;
  var EN_NORM = (function () {
    var m = {};
    Object.keys(EN).forEach(function (k) { m[k.replace(/\s+/g, ' ').trim()] = EN[k]; });
    return m;
  })();
  function enFor(s) {
    if (typeof s !== 'string' || !DEVA.test(s)) return null;
    var v = EN[s];
    if (v == null) v = EN[s.trim()];
    if (v == null) v = EN_NORM[s.replace(/\s+/g, ' ').trim()];
    return (v && v !== s) ? v : null;
  }
  function tblCell(c, i) {
    var mono = typeof c === 'string' && /^[\x00-\x7F\s\.\(\)\+\-\/:,=×→]+$/.test(c) && c.length < 34 && i > 0;
    var en = enFor(c);
    var inner = en
      ? '<span class="hi">' + c + '</span><span class="en" lang="en">' + en + '</span>'
      : c;
    return '<td' + (mono ? ' class="mono"' : '') + '>' + inner + '</td>';
  }
  /* जो टेबल सीधे HTML में लिखी हैं (callout/tabs के अंदर), उन्हें भी द्विभाषी बनाएँ */
  var biBusy = false;
  function bilingualize(scope) {
    if (biBusy) return;
    var rootEl = scope || document.getElementById('content');
    if (!rootEl || !rootEl.querySelectorAll) return;
    biBusy = true;
    try {
      var list = [].slice.call(rootEl.querySelectorAll('table.tbl'));
      if (rootEl.nodeType === 1 && rootEl.classList && rootEl.classList.contains('tbl')) list.push(rootEl);
      list.forEach(function (t) {
        [].forEach.call(t.querySelectorAll('th,td'), function (c) {
          if (c.querySelector('.en')) return;
          var raw = (c.textContent || '').replace(/\s+/g, ' ').trim();
          var en = enFor(raw);
          if (!en) return;
          c.innerHTML = '<span class="hi">' + c.innerHTML + '</span><span class="en" lang="en">' + en + '</span>';
        });
      });
    } catch (e) { }
    biBusy = false;
  }

  var R = {
    html: function (b) { var d = E('div'); d.innerHTML = b.html; return d; },
    callout: function (b) { return E('div', 'callout ' + (b.kind || 'info'), '<b class="ct">' + (b.title || '') + '</b>' + b.html); },
    code: function (b) { return E('pre', 'code', '<code>' + (b.code || '').replace(/</g, '&lt;') + '</code>'); },
    pills: function (b) { var d = E('div', 'pill-row'); (b.items || []).forEach(function (p) { d.appendChild(E('span', 'pill ' + (p.kind || ''), p.text)); }); return d; },
    cards: function (b) {
      var d = E('div', 'cards');
      (b.items || []).forEach(function (c) {
        d.appendChild(E('div', 'card', '<span class="c-ico">' + (c.ico || '🔹') + '</span><h4>' + c.title + '</h4><p>' + c.text + '</p>' +
          ((c.tags || []).length ? '<div class="c-tags">' + c.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' : '')));
      });
      return d;
    },
    kv: function (b) {
      var d = E('div', 'kv');
      (b.items || []).forEach(function (k) {
        d.appendChild(E('div', 'kv-i ' + (k.kind || ''), '<b>' + k.label + '</b><span class="v">' + k.value + '</span><small>' + (k.desc || '') + '</small>'));
      });
      return d;
    },
    table: function (b) {
      var w = E('div', 'tbl-wrap'), t = document.createElement('table');
      t.className = 'tbl';
      var th = '<tr>' + (b.head || []).map(function (h) { return tblCell(h, -1); }).join('') + '</tr>';
      var tb = (b.rows || []).map(function (r) {
        return '<tr>' + r.map(function (c, i) { return tblCell(c, i); }).join('') + '</tr>';
      }).join('');
      t.innerHTML = '<thead>' + th + '</thead><tbody>' + tb + '</tbody>';
      w.appendChild(t);
      return w;
    },
    steps: function (b) {
      var d = E('div', 'steps');
      (b.items || []).forEach(function (s) {
        var st = E('div', 'step');
        st.innerHTML = '<div class="step-n">' + s.n + '</div><div class="step-b"><h4>' + s.title + '</h4><p>' + s.text + '</p>' +
          (s.tips ? '<div class="tips"><b>टिप:</b> ' + s.tips + '</div>' : '') +
          (s.warn ? '<div class="warnbox"><b>⚠️ सावधान:</b> ' + s.warn + '</div>' : '') + '</div>';
        d.appendChild(st);
      });
      return d;
    },
    acc: function (b) {
      var d = E('div', 'acc');
      (b.items || []).forEach(function (a, i) {
        var it = E('div', 'acc-i' + (i === 0 ? ' on' : ''));
        var btn = E('button', 'acc-q', a.q); btn.type = 'button';
        var ans = E('div', 'acc-a', a.a);
        btn.addEventListener('click', function () { it.classList.toggle('on'); });
        it.appendChild(btn); it.appendChild(ans); d.appendChild(it);
      });
      return d;
    },
    tabs: function (b) {
      var d = E('div', 'tabs'), h = E('div', 'tab-h'), body = E('div');
      (b.items || []).forEach(function (t, i) {
        var btn = E('button', 'tab-b' + (i === 0 ? ' on' : ''), t.t); btn.type = 'button';
        var p = E('div', 'tab-p' + (i === 0 ? ' on' : ''), t.html);
        btn.addEventListener('click', function () {
          Array.prototype.forEach.call(h.children, function (x, k) { x.classList.toggle('on', k === i); });
          Array.prototype.forEach.call(body.children, function (x, k) { x.classList.toggle('on', k === i); });
        });
        h.appendChild(btn); body.appendChild(p);
      });
      d.appendChild(h); d.appendChild(body);
      return d;
    },
    diagram: function (b) {
      var f = DIAGRAMS[b.svg];
      var d = E('figure', 'diagram');
      d.innerHTML = (typeof f === 'function' ? f() : '') + (b.caption ? '<figcaption>' + b.caption + '</figcaption>' : '');
      return d;
    },
    sim: function (b) {
      var d = E('div');
      d.dataset.sim = b.sim;
      return d;
    },
    labs: function (b) {
      var d = E('div');
      (b.items || []).forEach(function (L, i) {
        var key = 'lab' + L.n;
        var on = !!labDone[key];
        var box = E('div', 'lab');
        var head = E('div', 'lab-h', '<span class="lh-n">प्रैक्टिकल ' + L.n + '</span><h4>' + L.title + '</h4>');
        var body = E('div', 'lab-b');
        body.appendChild(E('div', null, '<h5>उद्देश्य (Aim)</h5><p>' + L.aim + '</p><h5 style="margin-top:10px">उपकरण / पुर्ज़े</h5><ul>' + L.tools.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>'));
        body.appendChild(E('div', null, '<h5>प्रक्रिया (Procedure)</h5><ol>' + L.steps.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol>'));
        body.appendChild(E('div', null, '<h5>परिणाम (Result) में लिखिए</h5><p>' + L.result + '</p>'));
        var chk = E('label', 'chk' + (on ? ' done' : ''), '<input type="checkbox"' + (on ? ' checked' : '') + '><span>✓ यह प्रैक्टिकल पूरा कर लिया</span>');
        chk.querySelector('input').addEventListener('change', function (e) {
          var c = e.target.checked;
          labDone[key] = c; lsSet(LS.labs, labDone);
          chk.classList.toggle('done', c);
          updateProgress();
        });
        body.appendChild(chk);
        box.appendChild(head); box.appendChild(body);
        d.appendChild(box);
      });
      return d;
    },
    quiz: function (b) {
      var QS = (b && b.items && b.items.length) ? b.items : QUIZ;
      var qk = LS.quiz + ((b && b.store) ? '.' + b.store : '');
      var d = E('div'), res = E('div', 'quiz-res', '<div class="big">—</div><p>नीचे के प्रश्न हल कीजिए, अंक यहाँ दिखेंगे।</p>');
      d.appendChild(res);
      var correct = 0, answered = 0;
      QS.forEach(function (Q, qi) {
        var box = E('div', 'quiz-q');
        box.appendChild(E('div', 'qh', '<span class="qn">' + (qi + 1) + '.</span><span class="qt">' + Q.q + '</span>'));
        var ol = E('div', 'opt-list');
        Q.o.forEach(function (o, oi) {
          var b = E('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            if (box.dataset.done) return;
            box.dataset.done = '1'; answered++;
            var ok = oi === Q.a;
            if (ok) correct++;
            Array.prototype.forEach.call(ol.children, function (x, k) {
              if (k === Q.a) x.classList.add('ok');
              else if (k === oi) x.classList.add('no');
            });
            ol.appendChild(E('div', 'callout ' + (ok ? 'tip' : 'warn'), '<b class="ct">' + (ok ? 'सही! ✔' : 'ग़लत — सही उत्तर: ' + Q.o[Q.a]) + '</b>' + Q.ex));
            show();
          });
          ol.appendChild(b);
        });
        box.appendChild(ol);
        d.appendChild(box);
      });
      function show() {
        var pct = answered ? Math.round(correct / answered * 100) : 0;
        res.innerHTML = '<div class="big">' + correct + ' / ' + QS.length + '</div>' +
          '<p>उत्तर दिए: ' + answered + ' / ' + QS.length + ' · सटीकता: ' + pct + '% — ' +
          (pct >= 85 ? 'शानदार! 🏆' : pct >= 65 ? 'अच्छा, थोड़ा रिवीज़न 🎯' : 'मॉड्यूल दोबारा पढ़िए 📚') + '</p>';
        var best = lsGet(qk, 0);
        if (correct > best) { lsSet(qk, correct); }
        res.innerHTML += '<p style="margin-top:6px;font-size:12.6px">सर्वोत्तम स्कोर: ' + Math.max(best, correct) + ' / ' + QS.length + '</p>';
        var again = E('button', 'v-btn', '↺ दोबारा शुरू');
        again.style.marginTop = '8px';
        again.addEventListener('click', function () { location.reload(); });
        res.appendChild(again);
        updateProgress();
      }
      return d;
    }
  };

  /* =================================================================
     सेक्शन बनाना
     ================================================================= */
  var content = document.getElementById('content');
  var secEls = {};

  SECTIONS.forEach(function (sec) {
    var s = E('section', 'section');
    s.id = 'sec-' + sec.id;
    if (sec.title) {
      var hero = E('div', 'sec-hero',
        (sec.kicker ? '<div class="kicker">' + sec.kicker + '</div>' : '') +
        '<h2>' + (sec.icon ? sec.icon + ' ' : '') + sec.title + '</h2>' +
        (sec.hero ? '<p>' + sec.hero + '</p>' : '') +
        ((sec.tags || []).length ? '<div class="tags">' + sec.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div>' : ''));
      s.appendChild(hero);
    }
    (sec.blocks || []).forEach(function (b) {
      var fn = R[b.type];
      if (!fn) return;
      try { s.appendChild(fn(b)); } catch (e) { s.appendChild(E('div', 'callout warn', '<b class="ct">रेंडर त्रुटि</b>' + (b.type || ''))); }
    });
    content.appendChild(s);
    secEls[sec.id] = s;
  });
  bilingualize(content);
  var biTimer = null;
  if (window.MutationObserver) {
    new MutationObserver(function () {
      if (biTimer) return;
      biTimer = setTimeout(function () { biTimer = null; bilingualize(content); }, 150);
    }).observe(content, { childList: true, subtree: true });
  }

  /* =================================================================
     साइडबार मेनू
     ================================================================= */
  var nav = document.getElementById('sbNav');
  var navItems = {};
  /* सीधी सपाट सूची — कोई ग्रुप/सब-फ़ोल्डर नहीं, और 'होम' भी सूची में नहीं */
  var flatNav = E('div', 'nav-group nav-flat');
  nav.appendChild(flatNav);
  ORDER.forEach(function (sec) {
    if (sec.id === 'home') return;
    var b = E('button', 'nav-item', '<span class="ni-ico">' + sec.icon + '</span><span class="ni-tx">' + sec.title + '</span><span class="ni-dot"></span>');
    b.type = 'button';
    if (TOPIC && FILES[sec.id]) b.title = sec.title + ' — ' + FILES[sec.id];
    b.dataset.id = sec.id;
    b.addEventListener('click', function () { go(sec.id); });
    flatNav.appendChild(b);
    navItems[sec.id] = b;
  });

  var pageTitle = document.getElementById('pageTitle');
  var pageSub = document.getElementById('pageSub');
  var current = null;

  function go(id, noHash) {
    var sec = null;
    for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].id === id) sec = SECTIONS[i];
    if (TOPIC && id !== TOPIC && FILES[id]) { location.href = U(FILES[id]); return; }
    if (!sec) {
      if (TOPIC) { location.href = U(FILES[ORDER[0].id] || 'index.html'); return; }
      id = ORDER[0].id, sec = ORDER[0];
    }
    current = id;
    Object.keys(secEls).forEach(function (k) { secEls[k].classList.toggle('on', k === id); });
    Object.keys(navItems).forEach(function (k) {
      navItems[k].classList.toggle('on', k === id);
      navItems[k].classList.toggle('done', !!visited[k]);
    });
    pageTitle.textContent = sec.title;
    pageSub.textContent = sec.sub || '';
    visited[id] = true; lsSet(LS.visited, visited);
    if (navItems[id]) navItems[id].classList.add('done');
    updateProgress();
    initSims(secEls[id]);
    if (!noHash) { try { history.replaceState(null, '', '#' + id); } catch (e) { } }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebar();
    var badge = document.getElementById('tbBadge');
    badge.textContent = '📍 ' + sec.title;
  }

  function initSims(scope) {
    var nodes = scope.querySelectorAll('[data-sim]');
    Array.prototype.forEach.call(nodes, function (n) {
      if (n.dataset.init) return;
      n.dataset.init = '1';
      var f = window.CL_SIM && window.CL_SIM[n.dataset.sim];
      if (f) { try { f(n); } catch (e) { n.innerHTML = '<div class="callout warn"><b class="ct">सिम्युलेटर लोड नहीं हो सका</b>' + (e.message || '') + '</div>'; } }
    });
  }

  /* कुल प्रैक्टिकल लैब की गिनती सेक्शन-सामग्री से ही निकाल लीजिए */
  var TOTAL_LABS = (function () {
    var n = 0;
    ALL.forEach(function (s) {
      (s.blocks || []).forEach(function (b) {
        if (b.type === 'labs') n += (b.items || []).length;
      });
    });
    return n;
  })();
  /* होम को गिनती से बाहर रखिए — वह शुरुआत में अपने आप 'देखा हुआ' नहीं होता */
  var TOTAL_STEPS = ORDER.filter(function (s) { return s.id !== 'home'; }).length + TOTAL_LABS;

  function updateProgress() {
    var total = TOTAL_STEPS;
    var v = Object.keys(visited).filter(function (k) { return k !== 'home'; }).length;
    var l = Object.keys(labDone).filter(function (k) { return labDone[k]; }).length;
    var pct = Math.round((v + l) / total * 100);
    if (pct > 100) pct = 100;
    document.getElementById('progBar').style.width = pct + '%';
    document.getElementById('progTxt').textContent = pct + '%';
  }

  /* =================================================================
     साइडबार खोलना/बंद करना + खोज
     ================================================================= */
  var sidebar = document.getElementById('sidebar');
  var scrim = document.getElementById('sbScrim');
  function openSidebar() { sidebar.classList.add('open'); scrim.classList.add('on'); }
  function closeSidebar() { sidebar.classList.remove('open'); scrim.classList.remove('on'); }
  document.getElementById('btnHamb').addEventListener('click', openSidebar);
  document.getElementById('sbClose').addEventListener('click', closeSidebar);
  scrim.addEventListener('click', closeSidebar);

  /* हिंदी में टाइप किया हुआ नाम अंग्रेज़ी शीर्षक से भी मिलाए */
  var SEARCH_ALIAS = {
    'एक्सेल': 'excel', 'वर्ड': 'word', 'पॉवरपॉइंट': 'powerpoint', 'पावरपॉइंट': 'powerpoint',
    'प्रेजेंटेशन': 'presentation', 'विंडोज': 'windows', 'विंडोज़': 'windows', 'ऑफिस': 'office',
    'एक्सेस': 'access', 'आउटलुक': 'outlook', 'टीम्स': 'teams', 'वननोट': 'onenote',
    'सीपीयू': 'cpu', 'रैम': 'ram', 'जीपीयू': 'gpu', 'एसएसडी': 'ssd', 'एचडीडी': 'hdd',
    'बायोस': 'bios', 'एसएमपीएस': 'smps', 'क्विज': 'quiz', 'क्विज़': 'quiz', 'ग्लॉसरी': 'glossary',
    'लैब': 'lab', 'प्रैक्टिकल': 'practical', 'प्रोग्रामिंग': 'programming', 'एआई': 'ai',
    'क्लाउड': 'cloud', 'ब्राउज़र': 'browser', 'इंटरनेट': 'internet', 'सुरक्षा': 'security',
    'नेटवर्क': 'network', 'हार्डवेयर': 'hardware', 'सॉफ्टवेयर': 'software', 'सॉफ़्टवेयर': 'software',
    'डेटाबेस': 'database', 'टर्मिनल': 'terminal', 'कमांड': 'command', 'इंस्टॉल': 'install',
    'सर्विसिंग': 'servicing', 'असेंबली': 'assembly', 'मदरबोर्ड': 'motherboard', 'लिनक्स': 'linux'
  };
  function searchTerms(q) {
    var list = [q];
    Object.keys(SEARCH_ALIAS).forEach(function (k) {
      if (q.indexOf(k) >= 0) list.push(q.split(k).join(SEARCH_ALIAS[k]));
    });
    return list;
  }
  document.getElementById('navSearch').addEventListener('input', function (e) {
    var q = e.target.value.trim().toLowerCase().normalize('NFC');
    var terms = searchTerms(q);
    ORDER.forEach(function (sec) {
      var hay = (sec.title + ' ' + (sec.sub || '') + ' ' + (sec.tags || []).join(' ') + ' ' +
        sec.group + ' ' + (sec.kicker || '') + ' ' + sec.id).toLowerCase().normalize('NFC');
      var hit = !q || terms.some(function (t) { return hay.indexOf(t) >= 0; });
      navItems[sec.id].classList.toggle('hide', !hit);
    });
    Array.prototype.forEach.call(nav.querySelectorAll('.nav-group'), function (g) {
      var any = Array.prototype.some.call(g.querySelectorAll('.nav-item'), function (b) { return !b.classList.contains('hide'); });
      g.style.display = any ? '' : 'none';
    });
  });

  /* =================================================================
     थीम, फॉन्ट, प्रिंट, रीसेट
     ================================================================= */
  var root = document.documentElement;
  var theme = lsGet(LS.theme, 'dark');
  root.dataset.theme = theme;
  var fs = lsGet(LS.fs, 'm'); root.dataset.fs = fs;
  var FS = ['s', 'm', 'l'];
  document.getElementById('btnTheme').addEventListener('click', function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme; lsSet(LS.theme, theme);
  });
  document.getElementById('btnFont').addEventListener('click', function () {
    fs = FS[(FS.indexOf(fs) + 1) % 3];
    root.dataset.fs = fs; lsSet(LS.fs, fs);
  });
  document.getElementById('btnPrint').addEventListener('click', function () {
    Object.keys(secEls).forEach(function (k) { secEls[k].classList.add('on-print'); });
    window.print();
  });
  /* भाषा: हिंदी + English (डिफ़ॉल्ट) → सिर्फ़ English → सिर्फ़ हिंदी → वापस */
  var LANGS = ['both', 'en', 'hi'];
  var LANG_TXT = { both: '🌐 हिंदी + EN', en: '🌐 English only', hi: '🌐 सिर्फ़ हिंदी' };
  var lang = lsGet(LS.lang, 'both');
  if (LANGS.indexOf(lang) < 0) lang = 'both';
  var btnLang = document.getElementById('btnLang');
  function applyLang() {
    root.dataset.lang = lang;
    if (btnLang) { btnLang.textContent = LANG_TXT[lang]; btnLang.title = 'टेबल में भाषा बदलें'; }
  }
  applyLang();
  if (btnLang) btnLang.addEventListener('click', function () {
    lang = LANGS[(LANGS.indexOf(lang) + 1) % 3];
    lsSet(LS.lang, lang); applyLang();
  });
  document.getElementById('btnReset').addEventListener('click', function () {
    if (!confirm('प्रगति, लैब चेकलिस्ट और स्कोर रीसेट कर दें?')) return;
    try {
      localStorage.removeItem(LS.visited); localStorage.removeItem(LS.labs);
      Object.keys(localStorage).forEach(function (k) { if (k.indexOf(LS.quiz) === 0) localStorage.removeItem(k); });
    } catch (e) { }
    location.reload();
  });

  /* =================================================================
     मोबाइल बार
     ================================================================= */
  document.getElementById('mobbar').addEventListener('click', function (e) {
    var a = e.target.dataset.mob;
    if (!a) return;
    var idx = orderIndex(current); if (idx < 0) idx = 0;
    if (a === 'menu') openSidebar();
    if (a === 'next') go(ORDER[Math.min(idx + 1, ORDER.length - 1)].id);
    if (a === 'prev') go(ORDER[Math.max(idx - 1, 0)].id);
  });

  /* कीबोर्ड शॉर्टकट */
  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input,textarea')) return;
    var idx = orderIndex(current); if (idx < 0) idx = 0;
    if (e.key === 'ArrowRight' && e.altKey) go(ORDER[Math.min(idx + 1, ORDER.length - 1)].id);
    if (e.key === 'ArrowLeft' && e.altKey) go(ORDER[Math.max(idx - 1, 0)].id);
    if (e.key === '/') { e.preventDefault(); document.getElementById('navSearch').focus(); }
  });

  window.addEventListener('hashchange', function () {
    var id = location.hash.replace('#', '');
    if (id && id !== current) go(id, true);
  });

  /* =================================================================
     शुरुआत
     ================================================================= */
  updateProgress();
  var start = location.hash.replace('#', '');
  if (TOPIC) {
    /* पुराने गहरे लिंक (?कोई-विषय नहीं, #विषय) अब भी काम करें:
       hash किसी और विषय का id है तो सीधे उसके पेज पर चले जाइए */
    if (start && start !== TOPIC && FILES[start]) location.href = U(FILES[start]);
    else go(secEls[TOPIC] ? TOPIC : ORDER[0].id, true);
  } else go(!start || !secEls[start] ? ORDER[0].id : start, true);

  /* अलग-अलग पेजों में नीचे पिछला/अगला विषय के बटन */
  if (TOPIC) {
    var pos = orderIndex(TOPIC);
    var prv = pos > 0 ? ORDER[pos - 1] : null;
    var nxt = pos >= 0 && pos < ORDER.length - 1 ? ORDER[pos + 1] : null;
    var bar = E('div', 'tp-nav');
    function btn(sec, dir) {
      if (!sec) return '';
      var a = E('a', 'tp-btn ' + dir,
        '<small>' + (dir === 'prev' ? '⬅️ पिछला विषय' : 'अगला विषय ➡️') + '</small>' +
        '<b>' + sec.icon + ' ' + sec.title + '</b>');
      a.href = U(FILES[sec.id] || 'index.html');
      return a;
    }
    var pb = btn(prv, 'prev'), nb = btn(nxt, 'next');
    if (pb) bar.appendChild(pb); else bar.appendChild(E('span', 'tp-btn ghost', '<small>—</small><b>🏁 यह पहला विषय</b>'));
    if (nb) bar.appendChild(nb); else bar.appendChild(E('span', 'tp-btn ghost', '<small>—</small><b>🏁 यह आख़िरी विषय</b>'));
    var host = secEls[TOPIC];
    if (host) host.appendChild(bar);
  }

  /* होम पेज = लैब की पूरी सूची: हर विषय का अपना पेज यहाँ कार्ड बनकर दिखता है */
  if (TOPIC === 'home') {
    var hHost = secEls.home;
    if (hHost) {
      var wrap = E('div', 'tp-list');
      wrap.appendChild(E('h3', 'blk', '<span class="blk-n">सारे विषय</span> ' + (ORDER.length - 1) + ' अलग-अलग पेज — कहीं से भी शुरू कीजिए'));
      var grid = E('div', 'tp-grid');
      ORDER.forEach(function (s, i) {
        if (s.id === 'home') return;
        var a = E('a', 'tp-card' + (visited[s.id] ? ' seen' : ''),
          '<span class="tpc-n">' + (i + 1) + '</span>' +
          '<span class="tpc-ico">' + s.icon + '</span>' +
          '<b>' + s.title + '</b>' +
          '<small>' + (s.sub || s.group) + '</small>' +
          '<span class="tpc-g">' + s.group + '</span>');
        a.href = U(FILES[s.id] || 'index.html');
        grid.appendChild(a);
      });
      wrap.appendChild(grid);
      hHost.appendChild(wrap);
    }
  }

  /* पोर्टल मोड में वापसी बार */
  if (PM) {
    var pmBar = E('div', 'pm-bar',
      '<a class="pm-back" href="../index.html">← पोर्टल पर वापस</a>' +
      '<a class="pm-all" href="'+U('index.html')+'">📚 सारे विषय</a>');
    var mainEl = document.getElementById('main');
    if (mainEl) {
      if (mainEl.firstChild) mainEl.insertBefore(pmBar, mainEl.firstChild);
      else mainEl.appendChild(pmBar);
    }
  }
})();

