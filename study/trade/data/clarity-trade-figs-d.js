/* Trade Theory — चित्र परत, अध्याय 16–20 */
(function () {
  "use strict";
  var modules = window.TRADE_MODULES || [];

  function apply(map) {
    Object.keys(map).forEach(function (id) {
      var mod = modules.filter(function (m) { return m.id === Number(id); })[0];
      if (!mod) return;
      (mod.sections || []).forEach(function (section) {
        if (section.figure) return;
        var fig = map[id][section.h];
        if (fig) section.figure = fig;
      });
    });
  }

  var D = {

    /* ================= T16 नेटवर्क डिवाइस ================= */
    16: {
      "OSI परतें, PDU और नेटवर्क में डेटा का रास्ता": {
        type: "flow", icon: "📦",
        title: "एक ही डेटा, हर परत पर नया नाम",
        caption: "भेजते समय हर परत अपना हेडर जोड़ती है और पाते समय हटाती है — यही encapsulation है।",
        items: [
          { label: "एप्लिकेशन डेटा", note: "L7 — अनुरोध, फाइल, पेज" },
          { label: "सेगमेंट", note: "L4 — TCP पोर्ट, क्रम और पुष्टि" },
          { label: "पैकेट", note: "L3 — स्रोत और गंतव्य IP" },
          { label: "फ्रेम", note: "L2 — MAC पता और FTC चेक" },
          { label: "बिट", note: "L1 — वोल्टेज, प्रकाश या रेडियो सिग्नल" },
          { label: "पुनर्निर्माण", note: "प्राप्तकर्ता पर उल्टे क्रम में हटता है" }
        ]
      },
      "हब, ब्रिज, स्विच, राउटर, गेटवे, मॉडेम, एक्सेस पॉइंट एवं फायरवॉल": {
        type: "compare", icon: "🔀",
        title: "डोमेन की भाषा — हब बनाम स्विच",
        caption: "परीक्षा का सबसे आम प्रश्न: हब collision domain बढ़ाता नहीं, बाँटता है; स्विच हर पोर्ट को अलग collision domain देता है।",
        left: {
          title: "हब (L1)",
          items: ["सिग्नल हर पोर्ट पर दोहराता है", "एक ही collision domain", "10 Mbps बाँटकर चलता है", "half duplex, टकराव पर निर्भर"],
        },
        right: {
          title: "स्विच (L2)",
          items: ["MAC टेबल से केवल जरूरी पोर्ट पर", "हर पोर्ट अलग collision domain", "पूरी गति, full duplex", "broadcast domain फिर भी एक रहता है"]
        }
      },
      "L2/L3 स्विचिंग, VLAN, ट्रंकिंग एवं VTP": {
        type: "map", icon: "🧵",
        title: "एक स्विच, कई तार्किक नेटवर्क",
        caption: "VLAN अलग broadcast domain बनाता है; दो VLAN के बीच जाने के लिए L3 राउटिंग अनिवार्य है।",
        center: "24-पोर्ट स्विच",
        items: [
          { label: "VLAN 10 — प्रशासन", note: "पोर्ट 1–6, subnet 192.168.10.0/24" },
          { label: "VLAN 20 — प्रशिक्षण", note: "पोर्ट 7–16, अलग subnet" },
          { label: "VLAN 30 — प्रिंटर", note: "स्थिर पते, रिज़र्वेशन से" },
          { label: "Trunk पोर्ट", note: "802.1Q टैग से कई VLAN एक केबल पर" },
          { label: "Access पोर्ट", note: "एक VLAN, टैग हटाकर डेटा देता है" },
          { label: "L3 SVI", note: "interface VLAN 10 पर IP — यही गेटवे है" }
        ]
      },
      "STP एवं लूप रोकथाम": {
        type: "flow", icon: "🌀",
        title: "लूप बनने पर क्या होता है और STP क्या करता है",
        caption: "फ्रेम में TTL नहीं होता, इसलिए broadcast घूमता रहता है और पूरा नेटवर्क ठप हो जाता है।",
        items: [
          { label: "रेडंडेंट लिंक", note: "उपलब्धता के लिए, पर लूप का खतरा" },
          { label: "Broadcast storm", note: "एक फ्रेम अनगिनत बार दोहराता है" },
          { label: "MAC टेबल अस्थिर", note: "एक MAC कई पोर्ट पर दिखना" },
          { label: "स्विच CPU 100%", note: "संचालन धीमा, ट्रैफिक गिरता है" },
          { label: "STP चयन", note: "802.1D — root bridge चुनता है और पोर्ट की प्राथमिकता तय करती है" },
          { label: "ब्लॉक पोर्ट", note: "एक रास्ता निष्क्रिय; बाधा आने पर forwarding" }
        ]
      },
      "CLI कॉन्फ़िगरेशन, IP राउटिंग एवं Packet Tracer बेंच ड्रिल": {
        type: "ladder", icon: "⌨️",
        title: "Cisco IOS के चार मोड",
        caption: "मोड भूलकर कमांड लगाने पर '% Invalid input' आता है — प्रॉम्प्ट ही बताता है कि आप कहाँ हैं।",
        items: [
          { label: "user exec  (>)", note: "केवल देखने वाले कमांड, ping/show थोड़े" },
          { label: "privileged exec  (#)", note: "enable से अंदर; show running-config यहाँ" },
          { label: "global config", note: "configure terminal के बाद hostname, interface" },
          { label: "interface config", note: "interface g0/1 — ip address, no shutdown" },
          { label: "सुरक्षा", note: "enable secret, console/VTY password, service password-encryption, banner motd" },
          { label: "सहेजना", note: "end → copy running-config startup-config" }
        ]
      }
    },

    /* ================= T17 वायरलेस एवं एक्सेस ================= */
    17: {
      "पब्लिक-की, डिजिटल सर्टिफिकेट एवं MAC फ़िल्टरिंग": {
        type: "flow", icon: "🔑",
        title: "पब्लिक-की से सर्टिफिकेट तक",
        caption: "पब्लिक कुंजी से एन्क्रिप्ट, निजी कुंजी से डिक्रिप्ट — हस्ताक्षर उलटा काम करता है।",
        items: [
          { label: "जोड़ी बनाना", note: "निजी कुंजी सुरक्षित, पब्लिक कुंजी बाँटें" },
          { label: "CSR भेजना", note: "पब्लिक कुंजी + पहचान CA को" },
          { label: "CA जाँच", note: "डोमेन/संस्था की पुष्टि" },
          { label: "सर्टिफिकेट", note: "CA की निजी कुंजी से हस्ताक्षरित" },
          { label: "प्रमाणीकरण", note: "क्लाइंट CA की पब्लिक कुंजी से हस्ताक्षर जाँचे" },
          { label: "समाप्ति", note: "अवधि पूरी, रद्द सूची (CRL) और नवीनीकरण" }
        ]
      },
      "वायर्ड + वायरलेस LAN इंटीग्रेशन": {
        type: "flow", icon: "🌉",
        title: "क्लाइंट से सर्वर तक का पूरा रास्ता",
        caption: "लक्ष्य — वायरलेस क्लाइंट को भी वही सेवाएँ मिलें जो वायर्ड PC को: DHCP, DNS, फाइल सर्वर, इंटरनेट।",
        items: [
          { label: "ISP राउटर/मॉडेम", note: "WAN से कनेक्शन" },
          { label: "फायरवॉल", note: "किनारा, नियम और नेटवर्क पता अनुवाद" },
          { label: "L3 स्विच", note: "VLAN के बीच राउटिंग, गेटवे" },
          { label: "एक्सेस स्विच", note: "Trunk uplink, access पोर्ट" },
          { label: "एक्सेस पॉइंट", note: "bridge mode में क्लाइंट ट्रैफिक स्विच तक" },
          { label: "क्लाइंट", note: "SSID से जुड़ना, DHCP से पता, DNS से नाम" }
        ]
      },
      "PoE (802.3af/at, budget, injector)": {
        type: "pyramid", icon: "⚡",
        title: "PoE के स्तर और बजट",
        caption: "बजट हमेशा PSE (स्विच) की कुल वाट से तय होता है, पोर्ट संख्या से नहीं।",
        items: [
          { label: "802.3bt Type 4", note: "PSE पर 90–100 W, Wi-Fi 6E AP और PTZ कैमरा" },
          { label: "802.3bt Type 3", note: "PSE पर 60 W, PD को 51 W" },
          { label: "802.3at (PoE+)", note: "PSE पर 30 W, PD को 25.5 W, class 4" },
          { label: "802.3af (PoE)", note: "PSE पर 15.4 W, PD को 12.95 W, class 0–3" },
          { label: "इंजेक्टर", note: "बिना PoE स्विच के एक डिवाइस को बिजली" },
          { label: "केबल", note: "44–57 V DC; कैटेगरी 5e/6 और ताप ध्यान रखें" }
        ]
      },
      "परफॉर्मेंस मॉनिटरिंग एवं एक्सेस नेटवर्क ट्रबलशूटिंग": {
        type: "map", icon: "📶",
        title: "वायरलेस की चार माप और एक सिग्नल",
        caption: "RSSI −65 dBm अच्छा, −70 सामान्य, −75 से नीचे कमजोर; SNR जितना अधिक उतना बेहतर।",
        center: "Wi-Fi गुणवत्ता",
        items: [
          { label: "Latency", note: "ping का समय — वीडियो कॉल में मायने रखता है" },
          { label: "Jitter", note: "समय का उतार-चढ़ाव; VoIP का सबसे बड़ा शत्रु" },
          { label: "Packet loss", note: "1% से अधिक हो तो आवाज़ टूटती है" },
          { label: "Throughput", note: "असल गति, सिद्धांत की नहीं" },
          { label: "RSSI/SNR", note: "सिग्नल की मज़बूती और शोर से अनुपात" },
          { label: "Retry/utilization", note: "भीड़ और ओवरलैप का संकेत" }
        ]
      },
      "IP राउटिंग — RIP एवं IGRP": {
        type: "compare", icon: "🗺️",
        title: "दूरी-वेक्टर राउटिंग की दो किताबें",
        caption: "RIP में hop count ही मेट्रिक है: 15 तक मान्य, 16 का अर्थ अप्राप्य।",
        left: {
          title: "RIP v1/v2",
          items: ["मानक, किसी भी ब्रांड पर चलता है", "मेट्रिक केवल hop count (16 = अनंत)", "v1 classful, broadcast 255.255.255.255", "हर 30 सेकंड में पूरी टेबल"]
        },
        right: {
          title: "IGRP / EIGRP",
          items: ["Cisco का स्वामित्व प्रोटोकॉल", "बैंडविड्थ + देरी + भरोसा मेट्रिक", "कम बदलाव पर केवल अंश अपडेट", "तेज convergence, बड़े नेटवर्क में उपयुक्त"]
        }
      },
      "बेंच ड्रिल: AP जोड़ना, PoE बजट और 20 PC की वायरलेस जाँच": {
        type: "flow", icon: "📡",
        title: "योजना से रिकॉर्ड तक",
        caption: "वायरलेस की आधी समस्याएँ केबल लगाने से पहले की योजना में ही हल हो जाती हैं।",
        items: [
          { label: "योजना", note: "VLAN 40, SSID CHNM-LAB, WPA2-Enterprise, दो अलग चैनल" },
          { label: "बजट", note: "दो AP × PoE+ = 30 W; स्विच बजट में जगह है?" },
          { label: "पोर्ट", note: "स्विच पोर्ट 20 और 21 AP के लिए trunk/access" },
          { label: "कॉन्फ़िगर", note: "NPS/CAP को रजिस्टर, AP को SSID और RADIUS" },
          { label: "जाँच", note: "हर कोने में RSSI, क्लाइंट को DHCP पता, गति" },
          { label: "रिकॉर्ड", note: "पोर्ट मैप, चैनल, पता, RSSI मान और तारीख" }
        ]
      }
    },

    /* ================= T18 सर्वर एवं RAID ================= */
    18: {
      "सर्वर की अवधारणा, हार्डवेयर एवं RAID (0/1/5/10)": {
        type: "map", icon: "🗄️",
        title: "RAID के चार स्तर एक नज़र में",
        caption: "RAID बैकअप का विकल्प नहीं है — यह उपलब्धता बढ़ाता है, गलती से मिटे डेटा को वापस नहीं लाता।",
        center: "चार 2 TB डिस्क",
        items: [
          { label: "RAID 0", note: "स्ट्रिपिंग — तेज, पर एक डिस्क गई तो सब गया" },
          { label: "RAID 1", note: "मिरर — आधा स्थान, एक डिस्क सहज विफलता" },
          { label: "RAID 5", note: "स्ट्रिप + पैरिटी; n−1 क्षमता, एक डिस्क बर्दाश्त" },
          { label: "RAID 10", note: "मिरर + स्ट्रिप — तेज और सुरक्षित, आधा स्थान" },
          { label: "ECC मेमोरी", note: "मेमोरी बिट की गलती सुधारती है, कर्नेल पैनिक कम" },
          { label: "रेडंडेंट PSU/फैन", note: "एक फेल हो तो सेवा चलती रहे" }
        ]
      },
      "Windows Server इंस्टॉल एवं कॉन्फ़िगर": {
        type: "flow", icon: "🖥️",
        title: "सर्वर इंस्टॉल के बाद के अनिवार्य काम",
        caption: "Server Core में ग्राफिकल डेस्कटॉप नहीं होता; रोल वही चलते हैं, फर्क प्रबंधन का है।",
        items: [
          { label: "रूप चुनें", note: "Desktop Experience या Server Core" },
          { label: "अपडेट", note: "पहले पैच, फिर रोल — हमला-सतह कम" },
          { label: "स्थिर IP", note: "192.168.30.10 जैसे; DHCP सर्वर पर स्थिरता अनिवार्य" },
          { label: "नाम और डोमेन", note: "hostname, फिर जॉइन या DC बनाएँ" },
          { label: "रोल", note: "AD DS, DNS, DHCP, IIS, FS — जरूरत के अनुसार" },
          { label: "प्रबंधन", note: "RDP सीमा, फायरवॉल नियम, ऑडिट चालू" }
        ]
      },
      "AD DS एवं डोमेन कंट्रोलर": {
        type: "pyramid", icon: "🌲",
        title: "AD का ढाँचा — ऊपर से नीचे",
        caption: "वस्तुएँ OU में रखकर Group Policy लगाई जाती है; DC के पास NTDS.dit, SYSVOL और Kerberos होता है।",
        items: [
          { label: "Forest", note: "सबसे बड़ा दायरा, एक या अधिक tree" },
          { label: "Tree", note: "सतत namespace वाला डोमेन समूह" },
          { label: "Domain", note: "प्रशासन की सीमा, अलग सुरक्षा नीति" },
          { label: "OU", note: "यूज़र/PC/ग्रुप का कंटेनर — GPO यहीं link" },
          { label: "Object", note: "यूज़र, कंप्यूटर, ग्रुप, प्रिंटर, शेयर" },
          { label: "GC/FSMO", note: "संपूर्ण फॉरेस्ट खोज और पाँच स्वामित्व भूमिकाएँ" }
        ]
      },
      "ब्रॉडबैंड मॉडेम एवं इंटरनेट शेयरिंग (ICS/NAT)": {
        type: "map", icon: "🌐",
        title: "चार ब्रॉडबैंड मार्ग, एक सिद्धांत",
        caption: "मॉडेम सिग्नल को डेटा में बदलता है; राउटर पता, DHCP, NAT और फायरवॉल संभालता है।",
        center: "ISP से लैब तक",
        items: [
          { label: "DSL", note: "RJ-11 फोन लाइन, PPPoE यूज़रनेम/पासवर्ड राउटर में" },
          { label: "केबल", note: "DOCSIS, कोएक्सियल लाइन" },
          { label: "फाइबर", note: "ONT/GPON — सबसे कम विलंब" },
          { label: "4G/5G राउटर", note: "SIM आधारित, बैकअप लिंक के लिए उपयोगी" },
          { label: "NAT", note: "निजी पते एक सार्वजनिक पते से बाहर जाते हैं" },
          { label: "ICS", note: "Windows का सरल शेयरिंग — छोटी लैब के लिए, सर्वर के लिए नहीं" }
        ]
      },
      "सर्वर मैनेजमेंट, मॉनिटरिंग एवं बैकअप": {
        type: "map", icon: "📊",
        title: "तीनों सवाल हर सर्वर पर",
        caption: "क्या चल रहा है, कितना संसाधन लग रहा है, और क्या विफल होने वाला है — इसी क्रम में जाँचें।",
        center: "सर्वर स्वास्थ्य",
        items: [
          { label: "Server Manager", note: "रोल, इवेंट, सेवाएँ और दूरी प्रबंधन" },
          { label: "Event Viewer", note: "System, Application, Security — समय और स्रोत" },
          { label: "Processor", note: "% Processor Time लगातार 85%+ हो तो बाधा" },
          { label: "Memory", note: "Available MBytes कम और paging बढ़े तो RAM/लीक" },
          { label: "Disk", note: "Avg. Disk sec/Transfer 20 ms से अधिक हो तो धीमा" },
          { label: "बैकअप", note: "System State + डेटा, और महीने में एक restore टेस्ट" }
        ]
      },
      "बेंच ड्रिल: लैब सर्वर तैयार करना (RAID से AD तक)": {
        type: "flow", icon: "🧱",
        title: "एक सर्वर, पूरा जीवन-चक्र",
        caption: "तय करें कौन-सा काम किस परत पर होगा: RAID हार्डवेयर पर, IP नेटवर्क पर, डोमेन Directory पर।",
        items: [
          { label: "RAID 10", note: "चार 2 TB डिस्क — उपयोगी 4 TB, एक डिस्क सहज विफलता" },
          { label: "OS इंस्टॉल", note: "Windows Server, पैच, hostname WEB01/DC01" },
          { label: "स्थिर IP", note: "192.168.30.10/24, गेटवे और DNS स्वयं पर" },
          { label: "AD DS", note: "chnm.local डोमेन, DC promotions, DNS AD-integrated" },
          { label: "OU और नीति", note: "Students/Staff OU, पासवर्ड और लॉकआउट नीति" },
          { label: "बैकअप", note: "System State साप्ताहिक और एक सत्यापित restore" }
        ]
      }
    },

    /* ================= T19 DNS एवं DHCP ================= */
    19: {
      "DNS ज़ोन, रिकॉर्ड प्रकार (A, AAAA, CNAME, MX, PTR, SRV) एवं रिज़ॉल्यूशन": {
        type: "map", icon: "🗂️",
        title: "रिकॉर्ड का काम एक-एक",
        caption: "Forward zone नाम से पता बताता है, reverse zone पते से नाम — दोनों AD में जरूरी।",
        center: "chnm.local ज़ोन",
        items: [
          { label: "A / AAAA", note: "नाम से IPv4 / IPv6 पता" },
          { label: "CNAME", note: "उपनाम, जैसे www → lab.local" },
          { label: "MX", note: "मेल सर्वर और प्राथमिकता संख्या" },
          { label: "PTR", note: "पते से नाम — in-addr.arpa ज़ोन में" },
          { label: "SRV", note: "सर्विस का पता, Kerberos और LDAP यहीं से" },
          { label: "NS / SOA", note: "ज़ोन कौन चलाता है और कौन प्राधिकृत है" }
        ]
      },
      "Windows Server पर DNS इंस्टॉल/कॉन्फ़िगर (forward/reverse, forwarder)": {
        type: "flow", icon: "🧾",
        title: "DNS रोल से लेकर जाँच तक",
        caption: "DC पर ज़ोन AD-integrated होता है, जिससे डेटा replicate होता है और अपडेट multi-master रहता है।",
        items: [
          { label: "रोल जोड़ें", note: "Server Manager या Install-WindowsFeature DNS" },
          { label: "Forward zone", note: "chnm.local, dynamic update Secure only" },
          { label: "Reverse zone", note: "30.168.192.in-addr.arpa — PTR के लिए" },
          { label: "Forwarder", note: "बाहरी नाम ISP/8.8.8.8 से, रूट हिंट कम जरूरी" },
          { label: "क्लाइंट जाँच", note: "dnscmd /ZoneUpdateFromDs और replication" },
          { label: "सत्यापन", note: "nslookup नाम और पता दोनों ओर, dcdiag /test:dns" }
        ]
      },
      "DHCP स्कोप, रिज़र्वेशन, ऑप्शन एवं रिले": {
        type: "flow", icon: "📨",
        title: "DORA — चार संदेशों में पता",
        caption: "Discover broadcast (UDP 68→67), Offer, Request, Ack; Windows में डिफ़ॉल्ट लीज़ 8 दिन।",
        items: [
          { label: "Discover", note: "क्लाइंट चिल्लाता है — मुझे पता चाहिए" },
          { label: "Offer", note: "सर्वर पता प्रस्ताव देता है" },
          { label: "Request", note: "क्लाइंट प्रस्ताव चुनकर माँगता है" },
          { label: "Ack", note: "स्वीकृति और लीज़ अवधि" },
          { label: "T1/T2", note: "50% पर unicast renew, 87.5% पर rebind" },
          { label: "Option 60/82", note: "क्लाइंट पहचान और relay से VLAN तय" }
        ]
      },
      "इंटीग्रेशन, टेस्टिंग एवं ट्रबलशूटिंग (ipconfig /release /renew /flushdns)": {
        type: "cycle", icon: "🔁",
        title: "दोनों सेवाएँ मिलकर चलती हैं",
        caption: "नाम-आधारित सेवाएँ DNS के बिना, और DNS के लिए स्थिर पता चाहिए — दोनों एक-दूसरे पर निर्भर।",
        loop: "हर बदलाव के बाद क्लाइंट पर release/renew और flushdns से दोबारा जाँच",
        items: [
          { label: "DHCP → DNS", note: "ऑप्शन 006 से DNS सर्वर का पता क्लाइंट तक" },
          { label: "क्लाइंट अपडेट", note: "A और PTR रिकॉर्ड dynamic update से बनते हैं" },
          { label: "अधिकार", note: "dnsupdateproxy/उचित अधिकार, वरना मालिकाना गड़बड़" },
          { label: "रिलीज़-रिन्यू", note: "ipconfig /release फिर /renew" },
          { label: "फ्लश", note: "ipconfig /flushdns से पुराना कैश हटाएँ" },
          { label: "रिकॉर्ड", note: "लिज़ पूल उपयोग, संपर्क और विफल ग्राहक" }
        ]
      },
      "बेंच ड्रिल: DNS और DHCP सर्वर लैब": {
        type: "flow", icon: "🧪",
        title: "बीस क्लाइंट, एक सर्वर",
        caption: "सफलता की कसौटी — हर क्लाइंट को स्कोप से पता और दोनों दिशाओं में नाम हल हो।",
        items: [
          { label: "योजना", note: "सबनेट /24, सर्वर 192.168.30.10, पूल .100–.200" },
          { label: "रिज़र्वेशन", note: "प्रिंटर के लिए .50, MAC से बाँधें" },
          { label: "DNS ज़ोन", note: "chnm.local + reverse 30.168.192.in-addr.arpa" },
          { label: "ऑप्शन", note: "003 गेटवे और 006 DNS सर्वर" },
          { label: "क्लाइंट जाँच", note: "/all में पता, ping नाम, ping IP, nslookup -type=ptr" },
          { label: "रिकॉर्ड", note: "विफलता, कारण, किया बदलाव और तारीख" }
        ]
      }
    },

    /* ================= T20 RRAS एवं VPN ================= */
    20: {
      "RRAS इंस्टॉल, LAN राउटिंग एवं NAT": {
        type: "map", icon: "🚦",
        title: "RRAS के तीन काम, दो NIC",
        caption: "RRAS सर्वर में कम से कम दो नेटवर्क इंटरफ़ेस चाहिए — एक LAN की ओर, एक WAN/ISP की ओर।",
        center: "RRAS सर्वर",
        items: [
          { label: "LAN राउटिंग", note: "अलग सबनेट के बीच पैकेट आगे बढ़ाना" },
          { label: "NAT", note: "निजी पतों को एक सार्वजनिक पते से बाहर" },
          { label: "रिमोट एक्सेस", note: "VPN और डायल-अप से बाहर से अंदर" },
          { label: "WAN इंटरफ़ेस", note: "10.0.0.10/24 — ISP की ओर" },
          { label: "LAN इंटरफ़ेस", note: "192.168.30.10/24 — लैब की ओर" },
          { label: "स्थिर पता", note: "राउटिंग में DHCP पता खतरा है" }
        ]
      },
      "रिमोट एक्सेस एवं VPN प्रोटोकॉल (PPTP, L2TP/IPsec, SSTP, IKEv2)": {
        type: "pyramid", icon: "🛡️",
        title: "प्रोटोकॉल चयन — ऊपर भरोसेमंद",
        caption: "तीन बातें तय करती हैं: सुरंग का प्रोटोकॉल, प्रमाणीकरण की विधि, और एन्क्रिप्शन का बल।",
        items: [
          { label: "IKEv2", note: "तेज और MoMA के साथ नेटवर्क बदलने पर भी टिकी सुरंग" },
          { label: "SSTP", note: "TLS 443 के अंदर — फायरवॉल से पार जाने में सहज" },
          { label: "L2TP/IPsec", note: "UDP 500/4500 + 1701; साझा कुंजी या सर्टिफिकेट" },
          { label: "PPTP", note: "पुराना, टूटा हुआ — आज उपयोग नहीं करना" },
          { label: "प्रमाणीकरण", note: "EAP-MSCHAPv2, सर्टिफिकेट और MFA के साथ NPS" },
          { label: "एन्क्रिप्शन", note: "AES-128/256; MPPE वाले पुराने विकल्प छोड़ें" }
        ]
      },
      "RADIUS/IAS/NPS": {
        type: "flow", icon: "🎯",
        title: "AAA — एक जगह जाँच, कई जगह लागू",
        caption: "VPN सर्वर, वायरलेस कंट्रोलर और स्विच RADIUS क्लाइंट बनकर NPS से जाँच कराते हैं।",
        items: [
          { label: "Authentication", note: "कौन है — UDP 1812 पर अनुरोध" },
          { label: "Authorization", note: "क्या कर सकता है — समूह आधारित नीति" },
          { label: "Accounting", note: "क्या किया, कितनी देर — UDP 1813" },
          { label: "क्लाइंट रजिस्टर", note: "नाम, IP और साझा सीक्रेट के साथ" },
          { label: "नीति", note: "समूह, समय, स्टेशन और विधि के नियम" },
          { label: "लॉग", note: "सफल/असफल प्रयास और सत्र अवधि" }
        ]
      },
      "सुरक्षा, टेस्टिंग एवं ट्रबलशूटिंग": {
        type: "ladder", icon: "🪜",
        title: "रिमोट एक्सेस की रक्षा की परतें",
        caption: "हर खुला पोर्ट हमले का दरवाजा है — RDP को सीधे इंटरनेट पर न खोलें।",
        items: [
          { label: "केवल जरूरी पोर्ट", note: "4500/500 या 443; PPTP का 1723 बंद" },
          { label: "मजबूत पहचान", note: "लंबा पासफ्रेज + MFA + लॉकआउट नीति" },
          { label: "सर्टिफिकेट", note: "समाप्ति तिथि का कैलेंडर अलार्म" },
          { label: "सीमित पहुँच", note: "VPN यूज़र को केवल जरूरी सर्वर तक" },
          { label: "Split tunneling", note: "जोखिम देखकर निर्णय; बंद रखना सुरक्षित" },
          { label: "निरीक्षण", note: "NPS accounting, इवेंट लॉग और असफल प्रयास की जाँच" }
        ]
      },
      "बेंच ड्रिल: RRAS VPN सर्वर लैब": {
        type: "flow", icon: "🧪",
        title: "बाहरी क्लाइंट से लैब के भीतर",
        caption: "सफलता की कसौटी — क्लाइंट को पूल का पता मिले और भीतरी सर्वर का शेयर खुले।",
        items: [
          { label: "योजना", note: "WAN 10.0.0.10/24, LAN 192.168.30.10/24, भीतरी सर्वर .20" },
          { label: "VPN पूल", note: "192.168.30.200–210, स्कोप से बाहर रखें" },
          { label: "RRAS", note: "रोल इंस्टॉल, दो NIC, remote access policy" },
          { label: "NPS", note: "समूह-आधारित नीति, EAP विधि और सीक्रेट" },
          { label: "क्लाइंट", note: "सर्टिफिकेट/TRUSTED CA, DNS में सार्वजनिक नाम" },
          { label: "सत्यापन", note: "पिंग भीतरी सर्वर, फाइल शेयर, लॉग में सत्र" }
        ]
      }
    }
  };

  apply(D);
})();
