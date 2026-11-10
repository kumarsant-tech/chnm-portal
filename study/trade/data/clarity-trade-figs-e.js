/* Trade Theory — चित्र परत, अध्याय 21–25 */
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

  var E = {

    /* ================= T21 Active Directory ================= */
    21: {
      "AD ऑब्जेक्ट, OU एवं ग्रुप स्कोप": {
        type: "map", icon: "🧭",
        title: "तीनों ग्रुप स्कोप का काम",
        caption: "स्कोप तय करता है कि ग्रुप कहाँ दिखेगा; सदस्यता का प्रकार तय करता है कि उसमें कौन आ सकता है।",
        center: "chnm.local डोमेन",
        items: [
          { label: "Global (G)", note: "इसी डोमेन के यूज़र/समूह; पूरे forest में दिखता है" },
          { label: "Domain Local (DL)", note: "किसी भी डोमेन का सदस्य; परमिशन केवल अपने डोमेन में" },
          { label: "Universal (U)", note: "forest भर में सदस्य और पहुँच — बड़े वातावरण में replicate होता है" },
          { label: "Security बनाम Distribution", note: "सिक्योरिटी ग्रुप ACL में लगाया जा सकता है" },
          { label: "Built-in", note: "Administrators, Account Operators, Backup Operators" },
          { label: "System", note: "DC_grp, DNSUpdateProxy जैसी स्व-निर्मित समूहें" }
        ]
      },
      "AGDLP एवं परमिशन डिज़ाइन": {
        type: "flow", icon: "🔐",
        title: "AGDLP की चार सीढ़ियाँ",
        caption: "फोल्डर की ACL में कभी सीधे व्यक्ति का नाम न जोड़ें — बदलाव मुश्किल और जाँच असंभव हो जाती है।",
        items: [
          { label: "A — Accounts", note: "यूज़र खाते, भूमिका के अनुसार" },
          { label: "G — Global group", note: "जैसे GG-Sales-Staff; एक ही डोमेन के सदस्य" },
          { label: "DL — Domain Local", note: "DL-Sales-Read; संसाधन के पास, ACL यहीं" },
          { label: "P — Permission", note: "Read/Modify Share पर; Share + NTFS में से कम लागू" },
          { label: "नई भूमिका", note: "केवल यूज़र को Global में डालें, ACL छूएँ नहीं" },
          { label: "जाँच", note: "Effective Access टैब से व्यक्ति का प्रभावी अधिकार देखें" }
        ]
      },
      "Group Policy स्कोप, प्रोसेसिंग क्रम (LSDOU) एवं सेटिंग्स": {
        type: "ladder", icon: "🪜",
        title: "LSDOU — कौन सी नीति आखिर में जीतेगी",
        caption: "nested OU में बाहरी OU पहले और भीतरी OU बाद में लागू होती है; Enforced और Block यहीं काम करते हैं।",
        items: [
          { label: "L — Local", note: "मशीन की स्थानीय नीति (gpedit.msc)" },
          { label: "S — Site", note: "भौतिक साइट पर link, AD साइट सेवा से जुड़ी" },
          { label: "D — Domain", note: "पूरे डोमेन पर, जैसे chnm.local" },
          { label: "OU — Organizational Unit", note: "Students/Staff जैसे समूहों पर" },
          { label: "Link order", note: "नीचे की link पहले लागू, ऊपर की बाद में यानी जीतती है" },
          { label: "WMI/Security filter", note: "केवल शर्त पूरी करने वाले पर लागू" }
        ]
      },
      "फाइल/प्रिंट रिसोर्स, ऑडिटिंग एवं ट्रबलशूटिंग": {
        type: "compare", icon: "⚖️",
        title: "Share permission बनाम NTFS permission",
        caption: "नेटवर्क से पहुँच पर दोनों लागू होती हैं और प्रभावी अधिकार दोनों में से कम वाला होता है।",
        left: {
          title: "Share permission",
          items: ["केवल नेटवर्क पहुँच पर लागू", "Full Control / Change / Read", "सिर्फ तीन स्तर — मोटा छाननी", "स्थानीय पथ पर इसका कोई असर नहीं"]
        },
        right: {
          title: "NTFS permission",
          items: ["फाइल और फोल्डर पर, हर पहुँच पर", "Read/Write/Modify/List/Rx आदि बारीक", "inheritance और propagation से फैलती है", "Audit entries यहीं लगती हैं"]
        }
      },
      "लैब ड्रिल: Sales शेयर, ग्रुप परमिशन और GPO — योजना से रिकॉर्ड तक": {
        type: "flow", icon: "🗂️",
        title: "Sales फोल्डर — योजना से रिकॉर्ड तक",
        caption: "क्रम बदलने से ऑडिट में झूठे अधिकार दिखते हैं; पहले कागज़ पर तय करें, फिर क्लिक करें।",
        items: [
          { label: "योजना", note: "DDL-Sales-Modify, GG-Sales-Staff, पथ D:/Sales, परमिशन स्पष्ट" },
          { label: "फोल्डर + शेयर", note: "Share: Change; NTFS: Modify — प्रभावी Modify" },
          { label: "ग्रुप भराई", note: "यूज़र सिर्फ Global में; ACL में केवल Domain Local" },
          { label: "GPO ड्राइव मैप", note: "Preferences → Drive Maps, S:/D:/ लेटर स्थिर रखें" },
          { label: "सत्यापन", note: "क्लाइंट से फोल्डर, लिखना, हटाना और Effective Access" },
          { label: "रिकॉर्ड", note: "ग्रुप सदस्य, अधिकार, तारीख और हस्ताक्षर" }
        ]
      }
    },

    /* ================= T22 IIS एवं वेब होस्टिंग ================= */
    22: {
      "IIS इंस्टॉल, साइट, बाइंडिंग एवं वर्चुअल डायरेक्टरी": {
        type: "flow", icon: "🌍",
        title: "एक साइट कब तैयार कहलाती है",
        caption: "बाइंडिंग तीन चीजें तय करती है: IP, पोर्ट और होस्ट हेडर — तीनों मेल खाएँ तभी अनुरोध साइट तक पहुँचे।",
        items: [
          { label: "रोल जोड़ें", note: "Web Server (IIS) — W3SVC सेवा चालू" },
          { label: "फोल्डर", note: "C:/inetpub/wwwroot या अलग साइट फोल्डर" },
          { label: "बाइंडिंग", note: "http 80 / https 443 + host header" },
          { label: "एप्लिकेशन पूल", note: ".NET संस्करण और Identity (ApplicationPoolIdentity)" },
          { label: "वर्चुअल डायरेक्टरी", note: "नाम से अलग फोल्डर, IUSR और IIS_IUSRS अधिकार" },
          { label: "जाँच", note: "localhost, IP से और नाम से — तीनों बार" }
        ]
      },
      "DNS, SSL/TLS सर्टिफिकेट एवं सिक्योर होस्टिंग (HTTPS, HSTS)": {
        type: "flow", icon: "🔒",
        title: "HTTPS अनुरोध का पूरा पथ",
        caption: "नाम resolve न हो तो ब्राउज़र सर्वर तक पहुँचता ही नहीं, चाहे IIS बिल्कुल सही चले।",
        items: [
          { label: "DNS नाम", note: "लैब में A रिकॉर्ड 192.168.1.10, www के लिए CNAME" },
          { label: "फायरवॉल", note: "443 inbound केवल जरूरी स्रोत के लिए" },
          { label: "सर्टिफिकेट", note: "नाम मिलता हो (CN/SAN), अवधि और निजी कुंजी" },
          { label: "बाइंडिंग 443", note: "IIS में सर्टिफिकेट चुनें, SNI जरूरत हो तो चालू" },
          { label: "HTTP से HTTPS", note: "HTTP Redirect या URL Rewrite, HSTS हेडर" },
          { label: "सत्यापन", note: "ताला चिह्न, श्रृंखला पूरी, TLS 1.2+ केवल" }
        ]
      },
      "FTP पब्लिशिंग एवं फाइल ट्रांसफर सेवाएँ": {
        type: "compare", icon: "📤",
        title: "तीन रास्ते, तीन जोखिम",
        caption: "FTP सादे टेक्स्ट में चलता है; आज SFTP या FTPS चुनें और पोर्ट सीमा फायरवॉल में खुली रखें।",
        left: {
          title: "FTP / FTPS (IIS)",
          items: ["नियंत्रण TCP 21, passive पोर्ट 50000–50100", "फायरवॉल में यह सीमा न खुले तो कनेक्शन अटका रहता है", "FTPS = TLS के अंदर, सर्टिफिकेट चाहिए", "पुराने क्लाइंट के साथ संगतता अच्छी"]
        },
        right: {
          title: "SFTP / SMB",
          items: ["SFTP SSH के अंदर, TCP 22 — एक ही पोर्ट", "कुंजी आधारित पहचान, पासफ्रेज सुरक्षित", "SMB शेयर LAN के भीतर सहज, डोमेन पहचान से जुड़ा", "इंटरनेट पर SMB सीधे न खुले"]
        }
      },
      "बैकअप प्रकार, शेड्यूलिंग एवं टेस्टेड रिस्टोर": {
        type: "pyramid", icon: "💾",
        title: "तीनों बैकअप प्रकार का फर्क",
        caption: "archive bit की बात यही परीक्षा में पूछी जाती है — incremental उसे साफ करता है, differential नहीं।",
        items: [
          { label: "Differential", note: "पिछले Full के बाद सब बदलाव; bit नहीं हटाता" },
          { label: "Incremental", note: "पिछले किसी भी बैकअप के बाद के बदलाव; bit साफ" },
          { label: "Full", note: "पूरा चयन, bit साफ; आधार हर सप्ताह" },
          { label: "System State", note: "DC पर AD, SYSVOL, रजिस्ट्री, CA — डोमेन कंट्रोलर के लिए अनिवार्य" },
          { label: "शेड्यूल", note: "रात का समय, भोर की रिपोर्ट और विफलता का अलार्म" },
          { label: "टेस्टेड रिस्टोर", note: "बिना बहाली जाँचे बैकअप अधूरा माना जाए" }
        ]
      },
      "लैब ड्रिल: lab.local साइट प्रकाशित करना और बैकअप-रिस्टोर जाँच": {
        type: "flow", icon: "🧪",
        title: "पाँच बातें पहले तय करें",
        caption: "DNS रिकॉर्ड, फायरवॉल पोर्ट, फोल्डर संरचना, सर्टिफिकेट स्रोत और बैकअप समय — यही योजना है।",
        items: [
          { label: "योजना", note: "WEB01 पर साइट, नाम lab.local, पोर्ट 80 और 443" },
          { label: "DNS", note: "A रिकॉर्ड और test.lab.local का CNAME" },
          { label: "IIS कॉन्फ़िगर", note: "बाइंडिंग, ऐप पूल, निर्देशिका अधिकार" },
          { label: "सर्टिफिकेट", note: "lab.local का CN/SAN, निजी कुंजी सुरक्षित" },
          { label: "बैकअप", note: "साइट फोल्डर + config, शेड्यूल और हैश" },
          { label: "रिस्टोर जाँच", note: "दूसरी मशीन पर खोलकर पेज और लिंक जाँचें" }
        ]
      }
    },

    /* ================= T23 हार्डनिंग एवं ऑडिट ================= */
    23: {
      "हार्डनिंग — अकाउंट, सर्विस, पैच एवं पोर्ट": {
        type: "map", icon: "🛡️",
        title: "हमला-सतह घटाने के छह कदम",
        caption: "हार्डनिंग का अर्थ है कम से कम अधिकार, कम से कम सेवा और कम से कम खुले पोर्ट।",
        center: "DC01 हार्डनिंग",
        items: [
          { label: "खाते", note: "Administrator/Guest का नाम बदलें या बंद करें, Domain Admin रोज़मर्रा के काम में न चलाएँ" },
          { label: "पासवर्ड", note: "लंबाई, जटिलता, परिवर्तन अवधि और LAPS से स्थानीय admin घुमाएँ" },
          { label: "सेवाएँ", note: "अनावश्यक रोल/सर्विस हटाएं या बंद, प्रत्येक सेवा का कारण लिखें" },
          { label: "पैच", note: "मासिक विंडो, पहले दो टेस्ट मशीन, फिर रोलआउट" },
          { label: "पोर्ट", note: "सिर्फ आवश्यक inbound; बाकी block और जाँच के लिए लॉग" },
          { label: "बेसलाइन", note: "Security Baseline और Microsoft Security Compliance Toolkit से सत्यापन" }
        ]
      },
      "ऑडिट पॉलिसी, इवेंट लॉग एवं मॉनिटरिंग": {
        type: "flow", icon: "🔎",
        title: "दृश्यता बनाने का क्रम",
        caption: "सफल और असफल दोनों घटनाएँ दर्ज करें; असफल अकेले शोर देता है और सफल अकेले आँखें बंद।",
        items: [
          { label: "श्रेणी चुनें", note: "Logon/Logoff, Account Management, Object Access" },
          { label: "auditpol /get", note: "वर्तमान स्थिति देखें, category:* से पूरी सूची" },
          { label: "auditpol /set या GPO", note: "डोमेन में Advanced Audit Policy से केंद्रीय नियंत्रण" },
          { label: "सबस्क्रिप्शन", note: "SACL से खास फोल्डर/फाइल की पहुँच दर्ज" },
          { label: "लॉग रखरखाव", note: "आकार, घूर्णन, निर्यात और केंद्रीय एकत्रण" },
          { label: "सूचना", note: "4625 असफल लॉगिन, 4720 खाता बना, 4672 विशेष अधिकार" }
        ]
      },
      "Windows Firewall एवं IPSec": {
        type: "map", icon: "🧱",
        title: "तीनों प्रोफाइल और नियम के हिस्से",
        caption: "डिफ़ॉल्ट आधार सही है — inbound ब्लॉक, outbound अनुमत; फिर केवल जरूरी नियम खोलें।",
        center: "फायरवॉल नियम",
        items: [
          { label: "Domain", note: "डोमेन से जुड़ी मशीन, सब से भरोसेमंद प्रोफाइल" },
          { label: "Private", note: "लैब/ऑफिस नेटवर्क, पता और नाम जाँच" },
          { label: "Public", note: "बाहरी नेटवर्क, सबसे सख्त नियम" },
          { label: "नियम के स्तंभ", note: "प्रोटोकॉल, पोर्ट, दिशा, प्रोफाइल और स्रोत सीमा" },
          { label: "IPSec", note: "पैकेट-स्तर पहचान और एन्क्रिप्शन; सर्टिफिकेट या PSK" },
          { label: "सत्यापन", note: "netsh advfirewall show allprofiles, दो स्रोत से जाँच" }
        ]
      },
      "मैलवेयर प्रोटेक्शन, बैकअप एवं इंसिडेंट रिस्पॉन्स": {
        type: "flow", icon: "🚨",
        title: "इंसिडेंट के छह चरण",
        caption: "Defender को डिफ़ॉल्ट पर न छोड़ें — ASR नियम Office से नई प्रक्रिया बनना रोकते हैं।",
        items: [
          { label: "तैयारी", note: "नीति, संपर्क सूची, आइसोलेट करने का तरीका, बैकअप" },
          { label: "पहचान", note: "अलार्म, लक्षण, EICAR जैसी हानिरहित जाँच फाइल से परीक्षण" },
          { label: "रोकथाम", note: "नेटवर्क से अलग, खाते निष्क्रिय, रन रोकें" },
          { label: "आकलन", note: "समयरेखा, प्रभावित मशीन, डेटा चोरी की संभावना" },
          { label: "उन्मूलन", note: "स्वच्छ इमेज से रिस्टोर, फिर पैच और क्रेडेंशियल बदल" },
          { label: "पाठ", note: "रिकॉर्ड, नियम बदलाव और अगली ड्रिल की तारीख" }
        ]
      },
      "लैब ड्रिल: DC01 की हार्डनिंग बेसलाइन और ऑडिट सत्यापन": {
        type: "flow", icon: "🧪",
        title: "बेसलाइन लिखें, फिर सिद्ध करें",
        caption: "बिना वापसी योजना के हार्डनिंग जोखिम है — कभी-कभी आवश्यक सेवा बंद हो जाती है।",
        items: [
          { label: "योजना", note: "आवश्यक भूमिकाएँ, खुले पोर्ट, ऑडिट श्रेणियाँ, वापसी कदम" },
          { label: "बेसलाइन लागू", note: "GPO से पासवर्ड, लॉकआउट, सर्विस और फायरवॉल" },
          { label: "सत्यापन", note: "gpresult /r, netstat -ano | findstr, auditpol /get" },
          { label: "ऑडिट जाँच", note: "जानबूझकर एक असफल लॉगिन और एक खाता बनाकर लॉग देखें" },
          { label: "वापसी", note: "बदलाव से पहले running-config/reg exports रखें" },
          { label: "रिकॉर्ड", note: "मूल मान, नया मान, समय,कर्ता और परिणाम" }
        ]
      }
    },

    /* ================= T24 Linux सर्वर ================= */
    24: {
      "फाइलसिस्टम, यूज़र/ग्रुप एवं परमिशन (rwx, chmod/chown, umask)": {
        type: "map", icon: "🐧",
        title: "एक पेड़, तीन अधिकार",
        caption: "rwxr-xr-- यानी 754 — मालिक, समूह और अन्य के लिए अलग-अलग तीन बिट।",
        center: "/ (जड़)",
        items: [
          { label: "/etc", note: "सेटिंग फाइलें; fstab और पासवर्ड यहीं" },
          { label: "/var", note: "लॉग और बदलता डेटा; यही सबसे तेज बढ़ता है" },
          { label: "/home", note: "यूज़र की निजी फाइलें" },
          { label: "/srv", note: "सेवा का डेटा — शेयर यहीं रखना अच्छा" },
          { label: "/boot", note: "कर्नेल और boot loader" },
          { label: "chmod / chown", note: "chmod 770 पथ, chown यूज़र:समूह पथ; umask से नई फाइल के बिट" }
        ]
      },
      "इंस्टॉल, पार्टिशनिंग एवं पैकेज मैनेजमेंट (apt/dnf)": {
        type: "flow", icon: "📀",
        title: "इंस्टॉल से पहली सर्विस तक",
        caption: "/var अलग रखें ताकि लॉग भरने से जड़ फुल न हो; fstab में UUID उपयोग करें।",
        items: [
          { label: "पार्टिशन", note: "/ के लिए पर्याप्त जगह, /home अलग, /var अलग, swap RAM के बराबर" },
          { label: "LVM", note: "pvcreate → vgcreate → lvcreate, बाद में जगह बढ़ाई जा सकती है" },
          { label: "fstab", note: "UUID से माउंट, nofail से बूट न रुके" },
          { label: "पैकेज", note: "apt update/upgrade या dnf check-update/system-upgrade" },
          { label: "सिक्योरिटी", note: "सिर्फ आधिकारिक रिपो, third-party पर कारण लिखें" },
          { label: "बूट जाँच", note: "reboot के बाद माउंट, सेवाएँ और लॉग" }
        ]
      },
      "सर्विस, नेटवर्किंग, SSH एवं फाइल शेयरिंग (Samba/NFS)": {
        type: "map", icon: "🔗",
        title: "सेवा और साझाकरण के उपकरण",
        caption: "systemctl enable का अर्थ है बूट पर स्वतः चालू; गड़बड़ी पहले status, फिर journalctl में दिखती है।",
        center: "Linux सर्वर",
        items: [
          { label: "systemd", note: "start, stop, restart, status, enable, is-enabled" },
          { label: "journalctl", note: "-u सेवा, --since, -f से लाइव पीछा" },
          { label: "नेटवर्क", note: "ip addr, ip route, nmcli, /etc/resolv.conf" },
          { label: "SSH", note: "कुंजी आधारित प्रवेश, root लॉगिन बंद, असामान्य पोर्ट नहीं बल्कि MFA" },
          { label: "Samba", note: "Windows क्लाइंट के लिए शेयर, smb.conf और testparm" },
          { label: "NFS", note: "Linux-से-Linux; /etc/exports और exportfs -ra" }
        ]
      },
      "मॉनिटरिंग, लॉग एवं ट्रबलशूटिंग (top, df, journalctl, ss)": {
        type: "ladder", icon: "🩺",
        title: "निदान का क्रम — संसाधन, सेवा, नेटवर्क",
        caption: "df -h में जगह दिखे पर फाइल न बने तो inode समाप्त हो सकते हैं — df -i से जाँचें।",
        items: [
          { label: "CPU/मेमोरी", note: "top या htop, free -h; load average की तुलना कोर संख्या से" },
          { label: "डिस्क", note: "df -h स्थान, df -i inode, du -sh पथ से आकार" },
          { label: "प्रक्रिया", note: "ps aux | grep, kill -TERM पहले, -9 अंतिम उपाय" },
          { label: "सेवा", note: "systemctl status सेवा, journalctl -u सेवा -n 100" },
          { label: "नेटवर्क", note: "ss -tulpn से कौन-सा पोर्ट खुला, ip route से रास्ता" },
          { label: "लॉग", note: "/var/log/syslog या /var/log/secure में समय के अनुसार" }
        ]
      },
      "लैब ड्रिल: Linux फ़ाइल सर्वर — यूज़र, शेयर, SSH और जाँच": {
        type: "flow", icon: "🧪",
        title: "समूह, फोल्डर, अधिकार, क्लाइंट",
        caption: "उदाहरण योजना: समूह sales, फोल्डर /srv/sales, परमिशन 770 और Windows के लिए Samba शेयर।",
        items: [
          { label: "योजना", note: "कौन-सा समूह, कौन-सा फोल्डर, कौन-से बिट, कौन-से क्लाइंट" },
          { label: "यूज़र/समूह", note: "groupadd sales, useradd -g sales -m ramesh" },
          { label: "फोल्डर + बिट", note: "mkdir -p /srv/sales; chown :sales; chmod 770; setgid बिट" },
          { label: "Samba", note: "smb.conf शेयर, testparm, pdbedit से पासवर्ड" },
          { label: "SSH कड़ाई", note: "कुंजी प्रवेश, PasswordAuthentication no, फायरवॉल 22 सीमित" },
          { label: "जाँच", note: "क्लाइंट से लिखें-पढ़ें-हटाएँ, लॉग देखें, रिकॉर्ड लिखें" }
        ]
      }
    },

    /* ================= T25 नेटवर्क सुरक्षा ================= */
    25: {
      "खतरे, हमले एवं डिफेंस-इन-डेप्थ (DoS, MITM, phishing, ransomware)": {
        type: "map", icon: "🎭",
        title: "CIA और हमले के चार रूप",
        caption: "खतरा संभावित घटना है, कमजोरी वह कमी है जिसका फायदा उठता है, जोखिम दोनों का गुणनफल।",
        center: "गोपनीयता • अखंडता • उपलब्धता",
        items: [
          { label: "DoS/DDoS", note: "उपलब्धता तोड़ता है — सेवा धीमी या बंद" },
          { label: "MITM", note: "गोपनीयता और अखंडता दोनों — बीच में बदलाव" },
          { label: "Phishing", note: "मनुष्य कमजोरी; पहचान और भरोसा चोरी" },
          { label: "Ransomware", note: "अखंडता + उपलब्धता; ऑफलाइन बैकअप ही बचाता है" },
          { label: "परतें", note: "फायरवॉल, पैच, MFA, एन्क्रिप्शन, ऑडिट, प्रशिक्षण, बैकअप" },
          { label: "रिकवरी", note: "बैकअप, घटना योजना, बीमा और कानूनी सूचना" }
        ]
      },
      "फायरवॉल, ACL, DMZ एवं UTM": {
        type: "pyramid", icon: "🧱",
        title: "फायरवॉल की समझ की सीढ़ी",
        caption: "इंटरनेट से सीधे LAN नहीं; सार्वजनिक सेवा DMZ में और आंतरिक नेटवर्क पर सीमित नियम।",
        items: [
          { label: "NGFW / UTM", note: "एप्लिकेशन पहचान, IPS, एंटीवायरस, फिल्टर एक डिवाइस में" },
          { label: "Proxy/App फायरवॉल", note: "L7 तक जाकर जाँच, उपयोगकर्ता आधारित नियम" },
          { label: "Stateful", note: "कनेक्शन स्थिति याद; उत्तर के पैकेट स्वतः अनुमत" },
          { label: "Packet filter", note: "हर पैकेट अलग देखता है, IP+पोर्ट आधारित" },
          { label: "DMZ ज़ोन", note: "वेब/मेल सर्वर यहीं; भीतर की ओर केवल जरूरी पोर्ट" },
          { label: "ACL", note: "इन/आउट दिशा, सिर्फ जरूरी, अंत में implicit deny याद रखें" }
        ]
      },
      "वायरलेस सुरक्षा एवं 802.1X (WPA2/WPA3, EAP, RADIUS)": {
        type: "flow", icon: "📡",
        title: "802.1X Enterprise पहचान का पथ",
        caption: "WEP और TKIP टूट चुके हैं — PSK छोटी लैब के लिए, Enterprise संस्था के लिए।",
        items: [
          { label: "क्लाइंट", note: "सर्टिफिकेट या क्रेडेंशियल के साथ assoc भेजता है" },
          { label: "AP (Authenticator)", note: "पहचान का अनुरोध आगे बढ़ाता है" },
          { label: "RADIUS/NPS (Server)", note: "पहचान लेता है, समूह देखता है, उत्तर देता है" },
          { label: "EAP विधि", note: "PEAP-MSCHAPv2 या EAP-TLS सर्टिफिकेट आधारित" },
          { label: "कुंजी", note: "सफल होने पर PMK/PTK से एन्क्रिप्शन (AES-CCMP)" },
          { label: "WPA3-SAE", note: "ऑफलाइन शब्दकोश हमला रोकता है; Enterprise में 192-bit मोड" }
        ]
      },
      "VPN, मॉनिटरिंग, हार्डनिंग एवं सुरक्षा नीति": {
        type: "map", icon: "📜",
        title: "सुरक्षा नीति के स्तंभ",
        caption: "नीति लिखी न हो तो हर निर्णय व्यक्तिगत हो जाता है — यही सबसे बड़ा जोखिम है।",
        center: "सुरक्षा नीति",
        items: [
          { label: "पहुँच", note: "VPN प्रकार, MFA अनिवार्य, न्यूनतम अधिकार, समीक्षा अवधि" },
          { label: "एन्क्रिप्शन", note: "IPSec IKEv2 या SSL/TLS, TLS 1.2+ केवल" },
          { label: "उपलब्धता", note: "बहु-सर्वर, विभाजित टनल का निर्णय, लॉगआउट प्रक्रिया" },
          { label: "मॉनिटरिंग", note: "सत्र लंबाई, असफल प्रयास, भौगोलिक असामान्यता" },
          { label: "हार्डनिंग", note: "सर्टिफिकेट अवधि, पुराने प्रोटोकॉल बंद, पैच विंडो" },
          { label: "प्रशिक्षण", note: "फिशिंग जाँच, रिपोर्टिंग चैनल और आवृत्ति" }
        ]
      },
      "लैब ड्रिल: CHNM ऑफिस के लिए DMZ नियम और सुरक्षा नीति": {
        type: "flow", icon: "🧪",
        title: "ज़ोन बाँटें, फिर नियम लिखें",
        caption: "20 क्लाइंट, एक वेब सर्वर, एक फाइल सर्वर, वाई-फाई और इंटरनेट लिंक — पाँच ज़ोन में बाँटें।",
        items: [
          { label: "ज़ोन", note: "LAN, DMZ, गेस्ट वाई-फाई, प्रबंधन और WAN" },
          { label: "नियम तालिका", note: "स्रोत → गंतव्य : पोर्ट, दिशा और कारण का एक-एक पंक्ति" },
          { label: "DMZ", note: "वेब 443 इनबाउंड; DMZ से LAN केवल जरूरी पोर्ट पर" },
          { label: "वाई-फाई", note: "WPA2/WPA3-Enterprise + RADIUS, गेस्ट अलग VLAN" },
          { label: "दूरस्थ पहुँच", note: "IKEv2/SSTP + MFA, पुराना PPTP बंद" },
          { label: "सत्यापन", note: "हर नियम दो दिशा से जाँच, लॉग देखें, नीति पर हस्ताक्षर" }
        ]
      }
    }
  };

  apply(E);
})();
