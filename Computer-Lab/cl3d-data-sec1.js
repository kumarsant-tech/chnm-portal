/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-sec1.js   (इंटरनेट व साइबर सुरक्षा — भाग 1)
   विषय : sec-security · sec-data
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   साइबर सुरक्षा, एंटीवायरस व हैकिंग से बचाव
   =================================================================== */
{
  id: 'sec-security', icon: '🛡️', group: 'इंटरनेट व साइबर सुरक्षा',
  title: 'साइबर सुरक्षा, एंटीवायरस व हैकिंग से बचाव',
  sub: 'CIA त्रयी, मालवेयर (Malware), सोशल इंजीनियरिंग, पासवर्ड व 2FA, फ़ायरवॉल, वायरलेस, हार्डनिंग, बैकअप व साइबर क़ानून',
  kicker: 'Cyber Security 1 · Defense, Malware & Safe Habits',
  hero: 'यह अध्याय <b>रक्षात्मक (defensive)</b> सोच सिखाता है — यानी हमला कैसे होता है यह <i>समझकर</i> अपने PC, फ़ोन और अकाउंट बचाना। यहाँ कोई हमला सिखाने वाला तरीक़ा/कमांड नहीं है; केवल पहचान, बचाव और सही आदतें हैं। अंत में एक पूरी <b>सुरक्षा चेकलिस्ट</b> और संक्रमण (infection) होने पर करने वाले कदम भी हैं।',
  tags: ['CIA Triad', 'Malware catalogue', 'Social Engineering', 'Password & 2FA', 'Firewall & Wi-Fi', 'Incident Response'],
  blocks: [
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">12.1</span> साइबर सुरक्षा क्यों ज़रूरी है — एक डरावनी पर ज़रूरी तस्वीर</h3>
      <p>आज बैंक, अस्पताल, दुकान का हिसाब, स्कूल का रिकॉर्ड और हमारी निजी तस्वीरें — सब डिजिटल (digital) हैं। <b>साइबर सुरक्षा (Cyber Security)</b> का मतलब है कंप्यूटर, नेटवर्क और डेटा को अनधिकृत पहुँच (unauthorized access), नुक़सान या चोरी से बचाना। ITI/CHNM छात्र के लिए सबसे बड़ा मक़सद है <b>रक्षात्मक जागरूकता (defensive literacy)</b> — आप धोखे, मालवेयर (Malware) और पासवर्ड-चोरी को पहचान सकें और न केवल खुद बचें बल्कि ग्राहक/परिवार को भी बचाएँ।</p>
      <ul>
        <li><b>क्यों असली ख़तरा है:</b> ज़्यादातर सफल हमले जटिल कोड से नहीं, बल्कि इंसान की <b>ग़लती, जल्दबाज़ी और भरोसे</b> से होते हैं — इसे सोशल इंजीनियरिंग (Social Engineering) कहते हैं, जो इसी अध्याय का केंद्र है।</li>
        <li><b>सुरक्षा कोई एक प्रोडक्ट नहीं:</b> यह एक <b>प्रक्रिया (process)</b> है — अपडेट + मज़बूत पासवर्ड + 2FA + बैकअप + सही आदतें, सब मिलकर। केवल एंटीवायरस (Antivirus) लगाना काफ़ी नहीं।</li>
        <li><b>जानकारी का संतुलन:</b> यह सब पाठ्यक्रम <i>रोकथाम</i> के लिए है। किसी और के सिस्टम बिना अनुमति छूना भारत में <b>अपराध</b> है (आगे IT Act देखें) — यहाँ कोई intrusive टूल का कमांड नहीं दिया गया।</li>
      </ul>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">12.2</span> CIA त्रयी — सुरक्षा की तीन स्तंभ (Confidentiality, Integrity, Availability)</h3>
      <p>हर सुरक्षा-उपाय इन्हीं तीन लक्ष्यों में से कम-से-कम एक की रक्षा करता है। इसे <b>CIA Triad</b> कहते हैं (सरलता के लिए यहाँ तीन उदाहरण एक तालिका में हैं)।</p>
      <ul>
        <li><b>गोपनीयता (Confidentiality):</b> डेटा सिर्फ़ अनुमति-प्राप्त व्यक्ति देखे। उपाय — पासवर्ड, 2FA, एन्क्रिप्शन (Encryption), फ़ाइल परमिशन, फ़ायरवॉल।</li>
        <li><b>अखंडता (Integrity):</b> डेटा बिना अनुमति बदलें नहीं। उपाय — हैश (Hash), डिजिटल सिग्नेचर, बैकअप, ऑडिट लॉग, वर्ज़न कंट्रोल।</li>
        <li><b>उपलब्धता (Availability):</b> सेवा/डेटा ज़रूरत पर मिले। उपाय — बैकअप व रिस्टोर, RAID, DDoS सुरक्षा, UPS, पैच/अपडेट से क्रैश रोकना।</li>
      </ul>` },

    { type: 'table', head: ['स्तंभ (CIA)', 'हिंदी अर्थ', 'इसे तोड़ने वाली घटना', 'इसे बचाने वाला उपाय'],
      rows: [
        ['Confidentiality', 'गोपनीयता', 'पासवर्ड/बैंक डिटेल चोरी, जासूसी सॉफ़्टवेयर (Spyware)', '2FA, एन्क्रिप्शन, फ़ायरवॉल, न्यूनतम अधिकार (Least Privilege)'],
        ['Integrity', 'अखंडता', 'फ़ाइल छिपकर बदलना, रैंसमवेयर से एन्क्रिप्ट, फर्ज़ी अपडेट', 'हैश/चेकसम, डिजिटल सिग्नेचर, बैकअप, लॉग/ऑडिट'],
        ['Availability', 'उपलब्धता', 'DDoS (सेवा बंद), रैंसमवेयर लॉक, हार्ड-डिस्क फेल', 'बैकअप+रिस्टोर, UPS, RAID, DDoS-mitigation, पैच'],
        ['(अतिरिक्त) Authentication', 'प्रमाणीकरण', 'कोई दूसरे का ID इस्तेमाल करे', 'मज़बूत पासवर्ड, 2FA, बायोमेट्रिक, Passkey'],
        ['(अतिरिक्त) Authorization', 'अधिकार-प्रदान', 'स्टैंडर्ड यूज़र एडमिन काम कर ले', 'रोल/ग्रुप, NTFS परमिशन, UAC, Least Privilege'],
        ['(अतिरिक्त) Non-repudiation', 'इनकार-अक्षमता', 'भेजने वाला "मैंने नहीं भेजा" कहे', 'डिजिटल सिग्नेचर, ऑडिट लॉग, टाइम-स्टैम्प']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">12.3</span> चार बुनियादी शब्द — Threat, Vulnerability, Exploit, Attack (और Risk)</h3>
      <p>परीक्षा और साक्षात्कार (interview) दोनों में ये शब्द-युग्म पूछे जाते हैं। ध्यान से अंतर समझें:</p>
      <ul>
        <li><b>धमकी (Threat):</b> जो नुक़सान <i>कर सकता</i> है — मालवेयर, चोर, प्राकृतिक आपदा, लापरवाह कर्मचारी।</li>
        <li><b>कमज़ोरी (Vulnerability):</b> सिस्टम में मौजूद <i>कच्चापन/छेद</i> — बिना पैच वाला सॉफ़्टवेयर, कमज़ोर पासवर्ड, खुला पोर्ट।</li>
        <li><b>शोषण/उपयोग (Exploit):</b> वह तरीक़ा/कोड जो कमज़ोरी का <i>फ़ायदा उठाकर</i> अंदर घुसता है।</li>
        <li><b>हमला (Attack):</b> धमकी का <i>व्यावहारिक अमल</i> — असल में की गई घुसपैठ/छल।</li>
        <li><b>जोखिम (Risk):</b> कमज़ोरी + धमकी से होने की संभावना × असर। सुरक्षा = जोखिम को स्वीकार्य स्तर तक लानी है (पैच = कमज़ोरी बंद, फ़ायरवॉल = धमकी की राह रोके)।</li>
        <li><b>Zero-day (ज़ीरो-डे):</b> वह कमज़ोरी जिसका पैच निर्माता को अभी पता ही नहीं — इसलिए दिन-0 से पहले बचाव कठिन; सावधानी = स्रोत-प्रमाणित सॉफ़्टवेयर + तुरंत अपडेट।</li>
      </ul>` },

    { type: 'table', head: ['मालवेयर (Malware)', 'कैसे फैलता है / क्या करता है', 'पहचान के लक्षण (Symptoms)', 'बचाव (Defence)'],
      rows: [
        ['वायरस (Virus)', 'किसी <b>मेज़बान फ़ाइल</b> (doc/exe) में चिपकता है; फ़ाइल खोलने/कॉपी पर फैलता है', 'फ़ाइलें करप्ट, PC धीमा, अजीब एरर', 'रखरक्षित AV, संदेहजनक फ़ाइल न खोलें, USB पहले स्कैन'],
        ['कीड़ा (Worm)', 'खुद-प्रतिरूपित होकर <b>नेटवर्क से फैलता</b>, मेज़बान नहीं चाहिए', 'बैंडविड्थ खाना, अपने-आप भेजे गए मेल', 'फ़ायरवॉल, पैच/अपडेट, निष्क्रिय macro, नेटवर्क segmentation'],
        ['ट्रोजन (Trojan)', 'किसी <b>काम की फ़ाइल/ऐप</b> का रूप लेकर यूज़र खुद चलाता है; दरवाज़ा (backdoor) खोलता है', 'चुराया हुआ ऐप जैसा दिखकर पीछे काम', 'केवल आधिकारिक स्रोत से डाउनलोड, हस्ताक्षर (signature) जाँच'],
        ['स्पायवेयर (Spyware)', 'चुपचाप <b>जानकारी चोरी</b> — लॉगिन, ब्राउज़िंग, कॉन्टैक्ट', 'बिना माँगे विज्ञापन, धीमापन, ट्रैफ़िक बढ़ना', 'AV/anti-spyware, ऐप परमिशन जाँच, रन-टाइम प्रोटेक्शन'],
        ['एडवेयर (Adware)', 'बोझिल <b>विज्ञापन</b> दिखाना; अक्सर फ़्री सॉफ़्टवेयर के साथ बंडल', 'टैब/पॉपअप विज्ञापन, होमपेज बदलना', 'इंस्टॉलर में Advance/Custom चुनकर bundled टिक हटाना'],
        ['रैंसमवेयर (Ransomware)', 'फ़ाइलें <b>एन्क्रिप्ट</b> कर फिरौती माँगता है; अक्सर phishing या unpatched से', 'फ़ाइल एक्सटेंशन बदला, नोट ".txt" में मांग', '<b>ऑफ़लाइन बैकअप</b> (3-2-1), पैच, macro/लिंक सावधानी; फिरौती न दें'],
        ['कीलॉगर (Keylogger)', 'हर <b>कीस्ट्रोक</b> रिकॉर्ड — पासवर्ड/कार्ड OTP चोरी', 'टाइप करते ही अकाउंट गतिविधि, AV पकड़ न पाए', 'सॉफ़्ट कीबोर्ड/पासवर्ड मैनेजर, 2FA, भरोसेमंद AV, अनजाने PC पर लॉगिन न करें'],
        ['रूटकिट (Rootkit)', '<b>OS के नीचे छिपकर</b> kendini गुमराह दिखाता; हटाना कठिन', 'hidden प्रोसेस, असंगत system फ़ाइल', 'Safe Mode/offline scan, साफ़ reinstall, Secure Boot/TPM'],
        ['बॉटनेट (Botnet)', 'संक्रमित PC/IoT को <b>दूर से नियंत्रित</b> जमा (zombie); DDoS/spam', 'बिना काम भारी नेटवर्क ट्रैफ़िक', 'पैच, डिफ़ॉल्ट पासवर्ड बदलें (router/CCTV), फ़ायरवॉल, outbound जाँच'],
        ['स्केयरवेयर (Scareware)', 'झूठा "वायरस मिला!" डराकर <b>नक़ली AV/पेमेंट</b> बिकवाता है', 'स्क्रीन पर लाल अलर्ट, री-डायरेक्ट पॉपअप', 'ब्राउज़र बंद करें (Task Manager), असली AV इस्तेमाल, भुगतान न करें']
      ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में अक्सर', html: '<p><b>वायरस</b> को फैलने के लिए <b>मेज़बान फ़ाइल + मानव क्रिया</b> चाहिए, जबकि <b>कीड़ा (Worm)</b> खुद नेटवर्क से फैलता है — यही अंतर सदैव पूछा जाता है। <b>ट्रोजन</b> फैलता नहीं, छल से चलवाया जाता है। <b>रैंसमवेयर</b> का सबसे भरोसेमंद जवाब = <b>ऑफ़लाइन/अछूता (immutable) बैकअप</b>। <b>Rootkit</b> OS के नीचे छिपता है। इन सबमें <i>सिर्फ़</i> रक्षात्मक पहचान/बचाव आता है, हमले का तरीक़ा नहीं।</p>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">12.4</span> एंटीवायरस सच में कैसे काम करता है</h3>
      <p><b>एंटीवायरस (Antivirus — AV)</b> और आजकल उसके व्यापक रूप <b>एंडपॉइंट प्रोटेक्शन (Endpoint Protection)</b> कई तकनीकों को मिलाकर चलते हैं। कोई एक अकेली तकनीक सब नहीं पकड़ती, इसलिए मिला-जुला (layered) दृष्टिकोण ज़रूरी है।</p>
      <ul>
        <li><b>हस्ताक्षर जाँच (Signature-based):</b> ज्ञात मालवेयर के "फ़िंगरप्रिंट/हैश" का डेटाबेस; फ़ाइल मेल खाए तो पकड़ता है। <i>सीमा:</i> नए/बदले मालवेयर (zero-day) पहले दिन नहीं पकड़े जाते — इसलिए हर घंटे अपडेट ज़रूरी।</li>
        <li><b>हिउरिस्टिक (Heuristic):</b> नियम-आधारित "संदिग्ध दिखता है क्या" जाँच; नए वेरिएंट पकड़ने में मदद, पर <b>फ़ॉलज़ पॉज़िटिव (ग़लत अलार्म)</b> भी हो सकते हैं।</li>
        <li><b>व्यवहार/रन-टाइम (Behavioural/HIPS):</b> चलते समय गतिविधि देखता है — जैसे बहुत तेज़ फ़ाइल एन्क्रिप्ट (रैंसमवेयर जैसा), कीस्ट्रोक पकड़ना। असली सुरक्षा का केंद्र यही है।</li>
        <li><b>क्लाउड/सैंडबॉक्स (Cloud):</b> संदिग्ध फ़ाइल का नमूना क्लाउड/अलगे वर्चुअल मशीन में चलाकर असर देखता है; सामूहिक बौद्धिकता (community intelligence) से तेज़ पहचान।</li>
        <li><b>रिअल-टाइम स्कैन बनाम ऑन-डिमांड:</b> On-access (खोलते/लिखते जाँच) vs manual/full scan। USB/डाउनलोड पर ऑन-एक्सेस ही सबसे काम आता है।</li>
      </ul>` },

    { type: 'table', head: ['डिटेक्शन तकनीक', 'क्या पकड़ती है', 'कमज़ोरी', 'छात्र के लिए सार'],
      rows: [
        ['Signature (हस्ताक्षर)', 'ज्ञात/पहचाना मालवेयर', 'नया/obfuscated नहीं', 'AV को <b>अपडेट</b> रखना = नए सिग्नेचर मिलना'],
        ['Heuristic (नियम-आधारित)', 'संदिग्ध कोड-ढाँचा', 'ग़लत अलार्म संभव', '" quarantine" में भेजकर फिर देखें'],
        ['Behavioural (व्यवहार)', 'हानिकारक <i>करने</i> का पैटर्न', 'कुछ कमज़ोर मालवेयर चालाक हो', 'रैंसमवेयर/कीलॉगर रोकने में सबसे असरदार'],
        ['Cloud lookup', 'सामूहिक ज्ञान से तेज़ पहचान', 'इंटरनेट चाहिए', 'नई फ़ाइल पर तुरंत जवाब'],
        ['Sandbox emulation', 'अलग/वर्चुअल में चलाकर असर', 'भारी/धीमा', 'संदेहास्पद .exe/.docx जाँच का सुरक्षित तरीक़ा'],
        ['Exploit mitigation', 'मेमोरी/पोर्ट ख़तरा रोकना', 'पुराने ऐप से टकराव', 'browser/PDF रीडर hardening इसी से जुड़ा']
      ] },

    { type: 'table', head: ['सॉफ़्टवेयर (मुफ़्त/पेड)', 'प्लेटफ़ॉर्म', 'प्रकृति', 'कब ठीक'],
      rows: [
        ['Windows Security / Microsoft Defender', 'Windows 10/11', '<b>बिल्ट-इन, मुफ़्त</b>, signature+behavioural+cloud', 'अधिकांश घर/छोटी दुकान — डिफ़ॉल्ट में चालू रखें, बंद न करें'],
        ['Microsoft Defender (cross-device/enterprise)', 'Win/Android/iOS', 'पेड/संगठनात्मक, EDR श्रृंखला', 'कई मशीन/संगठन केंद्रीय प्रबंधन'],
        ['मुफ़्त AV (Bitdefender Free, Kaspersky Free, AVG/Avira Free आदि)', 'Windows', 'रन-टाइम + signature', 'अतिरिक्त परत चाहिए तो <b>एक ही</b> real-time AV रखें'],
        ['पेड AV/Internet Security (Norton, McAfee, ESET, Kaspersky, Bitdefender Total…)', 'Win/Mac/मोबाइल', 'वेब फ़िल्टर, फ़ायरवॉल, पासवर्ड मैनेजर आदि बंडल', 'परिवार-प्रोटेक्शन/पासवर्ड मैनेजर/फ़िल्टर चाहिए तो'],
        ['ClamAV (open source)', 'Linux (और Windows ports)', '<b>signature</b>-आधारित, मुख्यतः on-demand/mail-gateway scan', 'सर्वर/मेल छानना, संदिग्ध फ़ाइल स्कैन; real-time कवरेज सीमित'],
        ['Linux में व्यवहारिक रक्षा', 'Linux', 'AV कम-कम ज़रूरी; पैच+फ़ायरवॉल+अनुमतियाँ प्रमुख', 'डेस्कटॉप Linux में <b>अपडेट व least-privilege</b> ही बड़ा कवच'],
        ['Browser/OS built-in (SmartScreen, Malwarebytes on-demand आदि)', 'Win/मोबाइल', 'लिंक/डाउनलोड चेतावनी, second-opinion scan', 'एक AV के साथ सहायक रूप में']
      ] },

    { type: 'callout', kind: 'tip', title: 'असली सुरक्षा को क्या चाहिए और क्या नहीं', html: '<p><b>ज़रूरी है:</b> चालू+अपडेटेड AV, OS/ऐप पैच, फ़ायरवॉल, 2FA, ऑफ़लाइन बैकअप, और <b>संदिग्ध लिंक/अटैचमेंट न खोलने की आदत</b>। <b>ज़रूरी नहीं:</b> कई real-time AV एकसाथ (आपस में टकराकर PC लैग/क्रैश करते हैं — केवल एक active रखें), महँगे "PC सेपर/ट्वीकर" या "RAM booster", और "सारा ड्राइव स्कैन" के नाम पर अजनabic टूल। एक अच्छा AV + आदतें > दस झूठे टूल।</p>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">12.5</span> सोशल इंजीनियरिंग — इंसान को ही हैक करना</h3>
      <p>सोशल इंजीनियरिंग (Social Engineering) कोई कोड नहीं, <b>छल</b> है — डर, लालच, जल्दबाज़ी, भरोसे या "अधिकारी का दबाव" बनाकर आपको <i>खुद</i> ग़लत काम करवाना (OTP देना, लिंक खोलना, पेमेंट, फ़ाइल चलाना)। भारत में सबसे ज़्यादा नुक़सान इसी से हो रहा है, इसलिए यह खंड सबसे महत्त्वपूर्ण है।</p>
      <ul>
        <li><b>फ़िशिंग (Phishing):</b> नक़ली ईमेल/SMS/वेबसाइट जो बैंक/पोर्टल जैसा दिखकर लॉगिन/OTP माँगे। लिंक असली डोमेन से मiltte-julte (जैसे paypa1, .co.in vs .com) होते हैं।</li>
        <li><b>वॉइशिंग (Vishing = voice + phishing):</b> फ़ोन कॉल पर — "आपका अकाउंट ब्लॉक है/लेंदना है, OTP/CVV बताइए"। <b>क्लासिक भारतीय केस:</b> "SIM/बैंक ब्लॉक से बचाने को say "KYC" नाम पर OTP माँगना; "स्क्रीन-शेयरिंग ऐप डाउनलोड कराओ" — दोनों में बैंक <i>कभी</i> OTP/CVV नहीं माँगता।</li>
        <li><b>स्मिशिंग (Smishing = SMS phishing):</b> "पैकेज डिलीवर नहीं हुआ, लिंक खोलें", "PF/LPG/बैंक अपडेट", इनाम/लॉटरी SMS; अक्सर जाली parcel/bank URL पर ले जाते हैं।</li>
        <li><b>व्हेलिंग (Whaling):</b> बड़े/अमी शिकार (CEO, बड़े अकाउंट) पर निशाना — बेहद निजी, research-आधारित ईमेल; "urgent wire transfer" जैसे फर्ज़ी निर्देश।</li>
        <li><b>प्रिटेक्स्टिंग (Pretexting):</b> झूठी कहानी/पहचान बनाना — "मैं बैंक/कंपनी/पुलिस से बोल रहा" — ताकि आप जानकारी दें।</li>
        <li><b>OTP/नौकरी/इन्वेस्टमेंट scams:</b> "नौकरी के लिए रजिस्ट्रेशन फ़ीस/ट्रेनिंग अकाउंट खोलो", "रुपए दोगुने इन्वेस्टमेंट", "फ़र्ज़ी सहायता (tech-support) कॉल" — सब सोशल इंजीनियरिंग; जल्दबाज़ी + लालच + डर तीनों का मेल।</li>
      </ul>` },

    { type: 'table', head: ['छल का प्रकार', 'कैसा दिखता/सुनता है', 'मुख्य लाल झंडी (Red Flag)', 'सही प्रतिक्रिया'],
      rows: [
        ['Phishing email/site', 'बैंक/बिल/रिसेप्स का नक़ली रूप, "verify now"', 'लिंक का डोमेन असली जैसा नहीं, attachment .zip/.exe, त्वरा', 'लिंक न खोलें; स्वयं ऐप/आधिकारिक टाइप करके जाँचें'],
        ['Vishing call ("अकाउंट ब्लॉक")', '"OTP/CVV/पूरा पासवर्ड बताओ", "स्क्रीन शेयर ऐप लगाओ"', 'बैंक/पुलिस कभी OTP/CVV नahi माँगते; स्क्रीन-शेयर दूर से', 'फ़ोन काटें; बैंक के पीछे-printed नंबर से <b>आप</b> कॉल-back करें'],
        ['Smishing SMS (parcel/पेमेंट)', 'छोटा लिंक, "payment failed / parcel रोक"', 'अजनबि लिंक, अज्ञात भेजनेवाला, ₹-प्रतिशत इनाम', 'लिंक न दबाएँ; सेवा वाले ऐप में खुद जाँचें'],
        ['Whaling (CEO/Fraud transfer)', 'बहुत निजी+urgent ईमेल, "तार/_wire transfer_"', 'बहि-कंपनी Gmail, असाधारण दबाव, छिपा-रखने को कहा', 'बॉस से फ़ोन/चेहरा-से-चेहरा पुष्टि करें; बypass ना करें'],
        ['Job scam', '"रजिस्ट्रेशन फ़ीस/ट्रेनिंग अकाउंट में डालो", WFH typing', 'पहले पैसे माँगना, बिना इंटरव्यू offer, WhatsApp "HR"', 'कंपनी वेबसाइट/LinkedIn से verify; फ़ीस न भेजें'],
        ['Tech-support scam', 'पॉपअप "PC inf! हमें कॉल करो", रीमोट ऐप', 'अजनबि फ़ोन नंबर/URL, रीमोट एक्सेस', 'ब्राउज़र टैब बंद; असली AV से scan; रीमोट न दें'],
        ['Pretexting (पहचान छिपाकर)', 'झूठी "अधिकारी/बैंकर" पहचान से जानकार माँग', 'व्यक्तिगत डिटेल step-by-step माँगना, panic पैदा करना', 'आधिकारिक चैनल से identity verify; अनजान को जानकारी ना दें'],
        ['QR / UPI lure', 'जाली QR छपकर "invoice scan"/इनाम', 'अजनबि QR स्कैन कराकर payment prompt', 'अपरिचित QR न स्कैन; रकम/recipient खुद जाँचें']
      ] },

    { type: 'table', head: ['लाल-झंडी चेकलिस्ट — इनमें से एक भी मिले → रुकें', 'क्यों ख़तरा'],
      rows: [
        ['"तुरंत/आज के अंदर" जल्दबाज़ी दिखाई', 'डर+ताकत = सोचने का समय छीनना, यही हथियार है'],
        ['OTP, CVV, पूरा पासवर्ड या रीमोट एक्सेस माँगा', 'कोई legitimate बैंक/सरकार यह माँगता ही नहीं'],
        ['लिंक/मेल ID असली डोमेन से मiltte-julta या अजनबि', 'typosquatting/look-alike डोमेन नक़ली साइट की निशानी'],
        ['अनपढ़े हुए attachment (.zip/.iso/.exe/.scr) भेजे', 'ट्रोजन/माक्रो-आधारित मालवेयर का आम रास्ता'],
        ['"स्क्रीन-शेयर/रिमोट ऐप" डाउनलोड करा रहे', 'स्क्रीन शेयर करते ही OTP/बैलेंस दिख जाता है'],
        ['इनाम/लॉटरी "मिला" पर कर फ़ीस माँगे', 'पहले पैसे माँगना = 100% धोखा'],
        ['अनजान नंबर/URL/QR से कोई ऐप इंस्टॉल करा रहे', 'sideload मालवेयर/spyware का प्रवेश'],
        ['बिना जाँचे .apk (Play Store से बाहर) मंगाया', 'Android में मालवेयर का सबसे बड़ा स्रोत'],
        ['आपसे "किसी को मत बताना/छिपाकर करो" कहा', 'secrecy दबाव = fraud का पैटर्न'],
        ['पैसे भेजने को नया/अनजान UPI/bank detetail', 'mule account/fraud transfer — भेजते ही वापसी कठिन']
      ] },

    { type: 'callout', kind: 'danger', title: 'OTP/पासवर्ड किसी को न दें — कोई भी बहाना सही नहीं', html: '<p>आपका बैंक, पुलिस, सरकार, किसी भी "अफ़सर" या "केयर एक्ज़ीक्युटिव" को <b>OTP, CVV, ATM PIN, पूरा पासवर्ड या स्क्रीन-शेयर/रीमोट एक्सेस</b> देने की ज़रूरत नहीं होती। अगर कोई माँगे तो वह 100% धोखा है। <b>नियम:</b> फ़ोन काटें → खुद आधिकारिक नंबर/ऐप से संपर्क → फिर काम। और सबसे बड़ी बात — <b>पैसे कभी "वापस दिलाएँगे" के झाँसे में फिर न भेजें</b>; धोखा-रिपोर्ट तुरंत करें (आगे 1930/portal देखें)।</p>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">12.6</span> पासवर्ड सुरक्षा — लंबाई बनाम जटिलता (Length vs Complexity)</h3>
      <p>समकालीन सलाह <b>"लंबा > जटिल"</b> है। छोटा पर ख़ास-कैरेक्टर भरा पासवर्ड (<code>P@ssw0rd!</code>) आसान है; लंबा यादगार <b>पासफ्रेज़ (Passphrase)</b> (<code>ghar-ka-kuttonaach-2026</code>) तोड़ना क़रीब असंभव — क्योंकि offline brute-force में <b>समय ≈ (अक्षर-सेट)^लंबाई</b>, घातांक में लंबाई ही सबसे बड़ा गुणक है।</p>
      <ul>
        <li><b>Breach cascade (लीक-श्रृंखला):</b> एक साइट से पासवर्ड लीक → हमलावर <i>वही</i> ID:pass दूसरी साइटों पर आजमाता है (credential stuffing)। इसीलिए हर अकाउंट पर <b>अलग पासवर्ड</b> अनिवार्य।</b></li>
        <li><b>पासफ्रेज़ विधि:</b> 4–6 बेमतलब पर यादगार शब्द + separator + थोड़ा अंक/चिह्न; रोज़ टाइप करने लायक, पर गuess करने लायक नहीं।</li>
        <li><b>पासवर्ड मैनेजर (Password Manager):</b> याद रखने का बोझ हटता है — 1 मज़बूत master password, बाक़ी रैंडम unique; auto-fill से phishing साइट पर ग़लत पासवर्ड भरा नहीं जाता; sync/vault backup रखें। उदाहरण: Bitwarden (मुफ़्त tier), KeePass (offline), 1Password (पेड), OS/browser built-in wallets भी ठीक।</li>
        <li><b>लीक जाँच:</b> यदि शक हो तो "Have I Been Pwned" जैसे सेवा से ईमेल जाँचें, और उसी साइट का पासवर्ड बदलें + 2FA लगाएँ।</li>
      </ul>` },

    { type: 'code', code: `# Entropy (अव्यवस्था/अनishचितता) का काम करती गई मिसाल
# सूत्र (bits):  entropy = लंबाई × log2(अक्षर-सेट का आकार)

# (1) 8-अक्षर, सिर्फ़ छोटे अक्षर (a-z = 26):  8 × log2(26) ≈ 8 × 4.7  = 37.6 bits   → कमज़ोर
# (2) 8-अक्षर, सभी प्रिंट-एबल (≈95):        8 × log2(95) ≈ 8 × 6.57 = 52.6 bits   → ठीक-ठाक, पर छोटों पर offline हमला संभव
# (3) 12-अक्षर alnum (A-z0-9 = 62):         12 × log2(62)≈ 12 × 5.95 = 71.4 bits   → अच्छा
# (4) Passphrase: 4 शब्द diceware-list(7776):4 × log2(7776)≈ 4 × 12.92 = 51.7 bits → टाइप-सहज पर मज़बूत
# (5) Passphrase 5 शब्द + separator + digit:≈ 65+ bits, टाइप करना आसान   → सिफारिश-योग्य

# अनुमानित offline-crack समय = (2^entropy) guesses ÷ guesses-per-second
#   quick GPU ≈ 10^10 guesses/sec पर 37 bits ≈ मिनट; 60+ bits ≈ साल-युग; 80+ bits ≈ व्यावहारिक असंभव
# सीख: लंबाई बढ़ाओ, हर अकाउंट अलग पासवर्ड, और 2FA लगाओ — entropy अकेला काफ़ी नहीं।` },

    { type: 'table', head: ['2FA/MFA का प्रकार', 'कैसे काम करता है', 'ताक़त', 'कमज़ोरी/ध्यान'],
      rows: [
        ['SMS OTP', 'फ़ोन नंबर पर कोड', 'सेटअप आसान, हर फ़ोन पर', '<b>सबसे कमज़ोर</b> — SIM-swap/SS7 इंटरसेप्ट जोखिम; फिर भी बिना-2FA से बेहतर'],
        ['Authenticator App (TOTP)', 'ऐप 30-सेकंड का कोड (Google Authenticator, Microsoft, Authy)', 'SMS से बेहतर, ऑफ़लाइन चलता', 'फ़ोन खोए तो <b>recovery codes</b> बचाना ज़रूरी'],
        ['Push/In-app approve', 'एप नोटिफ़िकेशन approve/deny', 'सुगम; डिवाइस-बाउंड', '"prompt fatigue" — बार-बार पूछे तो अनजान approve न करें'],
        ['Hardware Key / FIDO2 (YubiKey आदि)', 'भौतिक/बायोमेट्रिक key; फ़िश-रोकथाम', '<b>सबसे मज़बूत</b>, OTP चोरी प्रभावहीन', 'दो key रखें (एक खोए तो)'],
        ['Passkey (WebAuthn/FIDO)', 'device-bound, असली पासवर्ड नहीं — public/private key pair', 'फ़िश-रोधक, टाइप करने की ज़रूरत नहीं, आने वाला मानक', 'device/ ecosystem sync समझें; backup passkey रखें'],
        ['Recovery codes', 'एक बार दी गई एक-बार-कोड', 'फ़ोन खोने पर बचाती', 'print/offline vault में रखें; स्क्रीनशॉट/ईमेल में न रखें']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">12.7</span> Passkey, ब्राउज़िंग आदतें व खाता-स्वच्छता (Account Hygiene)</h3>
      <p><b>Passkey</b> पासवर्ड का भविष्य है: आप पहचान फ़ोन/लैपटॉप की बायोमेट्रिक/पिन से करते हैं, सर्वर सिर्फ़ <b>public key</b> रखता है — तोड़ने/फ़िश करने लायक सीक्रेट कभी नेटवर्क पर नहीं जाता। जहाँ मिले, passkey चालू करें।</p>
      <ul>
        <li><b>सुरक्षित ब्राउज़िंग:</b> https + ताला (padlock) जाँचें, पर ताला = भरोसा नहीं (फ़र्ज़ी https साइटें होती हैं)। अनजान साइट पर लॉगिन/पेमेंट न करें; ब्राउज़र अपडेटेड रखें; extensions सिर्फ़ ज़रूरी+भरोसेमंद; pop-ups ब्लॉक; "Download" बटन-जैसी विज्ञापन-लिंक से बचें; साझा/लैब PC पर IncPrivate+लॉगआउट आदत।</li>
        <li><b>खाता-स्वच्छता:</b> <b>recovery email/phone</b> ताज़ा रखें (पासवर्ड भूलने का असली रास्ता)। <b>Logged-in devices</b> सूची में अनजान सेशन/डिवाइस देखें → sign out। अनचाही/पुरानी <b>ऐप permissions</b> (Google/Facebook "Allow") और OAuth grants घटाएँ। निष्क्रिय अकाउंट बंद करें। हर साइट पर <b>कम-से-कम व्यक्तिगत जानकारी</b> (minimization) दें।</li>
        <li><b>ऐप परमिशन (मोबाइल/डेस्कटॉप):</b> टॉर्च ऐप को location/contacts/SMS न दें; camera/mic/location सिर्फ़ ज़रूरत पर; "Allow only while using" चुनें; permission audit occasionally।</li>
      </ul>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">12.8</span> फ़ायरवॉल (Firewall) — इनबाउंड/आउटबाउंड और Windows + Router</h3>
      <p><b>फ़ायरवॉल</b> नेटवर्क ट्रैफ़िक को नियम से allow/deny करता "दीवार" है। दो मोर्चे — <b>इनबाउंड (Inbound)</b>: अंदर आने वाले कनेक्शन (server/PC पर हमला रोकता), और <b>आउटबाउंड (Outbound)</b>: बाहर जाने वाले (spyware/botnet/डेटा-चोरी रोकता — बहुत कम लोग देखते, पर बेहद उपयोगी)।</p>
      <div class="callout info"><b class="ct">सॉफ़्टवेयर बनाम हार्डवेयर फ़ायरवॉल</b><p><b>सॉफ़्टवेयर</b> (OS में, जैसे Windows Defender Firewall, ufw/iptables) — प्रति-मशीन, ऐप-वार नियम, outbound रोकने में उपयोगी। <b>हार्डवेयर</b> (राउटर/Utm appliance) — नेटवर्क-किनारे पर, LAN के बाहर आने वाले सब पर, NAT के साथ पहली रक्षा। असली सुरक्षा दोनों की परतें (defense in depth)।</p></div>
      <p><b>Windows Firewall काम:</b> Defender Firewall → <b>Allow an app through firewall</b> (ऐप को Private/Public में छूट), या <b>Advanced security</b> (wf.msc) में Inbound/Outbound Rules — Port/Program/Scope पर आधारित; Profile: <b>Domain / Private / Public</b> अलग-अलग (Public सबसे कड़ा — café/airports)। नेटवर्क को ग़लत "Public" सेट करने पर शेयरिंग/प्रिंटिंग बंद लग सकती है — घर का LAN <b>Private</b> रखें।</p>
      <p><b>Router/घरेलू सेटअप basics:</b> admin डिफ़ॉल्ट पासवर्ड बदलें, firmware अपडेट, WPA2/WPA3, <b>WPS बंद</b>, UPnP कम-से-कम, remote-management बंद, जरूरत न हो तो port-forwarding बंद/सिर्फ़ ज़रूरी पर, मेज़बान LAN पर अनचाही सेवाएँ न चालू करें।</p>` },

    { type: 'table', head: ['विषय', 'इनबाउंड (Inbound)', 'आउटबाउंड (Outbound)'],
      rows: [
        ['क्या है', 'बाहर/अंदर नेटवर्क से आप तक आता ट्रैफ़िक', 'आपके PC से बाहर जाने वाला ट्रैफ़िक'],
        ['क्या रोकता है', 'unauthorized scan/exploit, inbound हमला, खुले पोर्ट पर घुसपैठ', 'spyware/botnet callback, डेटा-exfiltration, मालवेयर का call-home'],
        ['डिफ़ॉल्ट रुख', 'Windows LAN पर अक्सर deny-जैसा; Public profile सख़्त', 'अक्सर allow-जैसा (इसे कड़ा करना उपयोगी)'],
        ['कब नियम बनाएँ', 'server/printing/file-share के लिए सिर्फ़ ज़रूरी पोर्ट/ऐप खोलें', 'संदिग्ध process का internet बंद करके जाँचें (Advanced security में)'],
        ['छात्र नोट', '"share दिखता नहीं/ब्लॉक" = इनबाउंड नियम जाँचें', '"बिना काम भारी upload" = आउटबाउंड जाँचें = मालवेयर संकेत']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">12.9</span> वायरलेस (Wi-Fi) सुरक्षा व सार्वजनिक नेटवर्क</h3>
      <p>Wi-Fi हवा में ट्रैफ़िक है, इसलिए encryption ज़रूरी। संस्करण और असर:</p>
      <table class="tbl"><tr><th>मानक (Standard)</th><th>स्थिति</th><th>क्यों/क्या</th><th>सुझाव</th></tr>
        <tr><td>WEP</td><td>प्राचीन, भंग</td><td>कुछ मिनटों में टूट जाता है; सुरक्षित नहीं</td><td><b>कभी इस्तेमाल न करें</b></td></tr>
        <tr><td>WPA / WPA2-TKIP</td><td>पुराना</td><td>भंग-प्रवण; पीछे छोड़ें</td><td>नहीं</td></tr>
        <tr><td><b>WPA2-AES (PSK/personal)</b></td><td>व्यापक, स्वीकार्य</td><td>AES strong; पर offline PMKID/Dicitionary dictionary pass पर कमज़ोर</td><td>लंबा रैंडम PSK रखें</td></tr>
        <tr><td><b>WPA3-SAE</b></td><td>नवीनतम, सबसे good</td><td>weak password से भी brute-force रोक; OWE से open-wifi पर encryption</td><td>हार्डवेयर support हो तो चुनें</td></tr>
        <tr><td>WPA2/3-Enterprise (802.1X)</td><td>संगठन</td><td>केंद्रीय RADIUS/ID से लॉगिन</td><td>दफ़्तर/कॉलेज में</td></tr></table>
      <ul>
        <li><b>सार्वजनिक Wi-Fi क्यों जोखिमपूर्ण:</b> खुला/eavesdrop-आसान नेटवर्क, नक़ली hotspot (evil twin), ARP-man-in-the-middle, साझा LAN पर device exposure; साथ ही router के सामने traffic हो सकता है। इसीलिए open Wi-Fi पर password/पेमेंट/OTP सीधे न डालें।</li>
        <li><b>VPN असल में क्या बचाता है:</b> <b>आप ↔ VPN server</b> के बीच traffic encrypt करता है (public Wi-Fi sniffing से बचाता, IP छिपाता)। पर यह <b>not a shield</b> — destination वेबसाइट से आपका traffic फिर वही रहता है; और VPN provider पर trust/privacy प्रश्न बने रहते हैं (वह आपका traffic देख सकता है, logs रख सकता है)। यह phishing/मालवेयर/दुर्बल पासवर्ड से नहीं बचाता। https + 2FA + सावधानी प्राथमिक, VPN सहायक।</li>
      </ul>` },

    { type: 'table', head: ['हार्डनिंग (Hardening) कदम', 'Windows', 'Linux'],
      rows: [
        ['अपडेट/पैच', 'Settings → Windows Update (auto); Optional→driver', '<code>apt update/upgrade</code> / <code>dnf update</code>; unattended-upgrades'],
        ['कम-अधिकार खाता', 'रोज़ का काम Standard User में; Admin अलग', 'root लॉगिन नहीं; sudo से सिर्फ़ ज़रूरत पर elevate'],
        ['एक्सेस कंट्रोल', 'UAC चालू (सिर्फ़ तभी बंद जब कारण समझें)', 'sudoers कम से कम; file perms; SELinux/AppArmor'],
        ['डिस्क एन्क्रिप्शन', '<b>BitLocker</b> (Pro/Enterprise; TPM+PIN/recovery key) / Device Encryption (Home)', '<b>LUKS/dm-crypt</b> (cryptsetup) — install पर full-disk या अलग LV'],
        ['फ़ायरवॉल', 'Defender Firewall + Profile सही (Private/Public)', 'ufw/firewalld/nftables; inbound deny, ज़रूरी allow'],
        ['रिमोट/पोर्ट', 'RDP/Remote ज़रूरत न हो बंद; Firewall से subnet-limit', 'SSH key-only, PermitRootLogin no, fail2ban'],
        ['बूट सुरक्षा', 'Secure Boot + UEFI password + TPM', 'UEFI/BIOS password, GRUB password, Secure Boot जहाँ हो'],
        ['फ़ाइल/डिस्क', 'NTFS परमिशन, EFS/BitLocker', 'chown/chmod, mount option, /tmp noexec जहाँ लागू'],
        ['मालवेयर कवच', 'Windows Defender चालू रखें; on-demand दूसरा', 'प्रधान = पैच+least-privilege; ClamAV/राव supplement']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">12.10</span> बैकअप — 3-2-1 नियम, मोबाइल सुरक्षा, साइबर क़ानून</h3>
      <p><b>बैकअप 3-2-1 नियम:</b> कम-से-कम <b>3</b> प्रतियाँ (1 मूल + 2 कॉपी), <b>2</b> अलग-अलग मीडिया/जगह, <b>1</b> ऑफ़साइट/क्लाउड/अछूता। रैंसमवेयर सिर्फ़ एक ही ड्राइव/नेटवर्क share पर हमला करता है, इसलिए <b>ऑफ़लाइन/immutable</b> copy बचती है। <b>Test restore</b> करें — बिना रिस्टोर-टेस्ट का बैकअप अधूरा।</p>
      <p><b>मोबाइल सुरक्षा:</b> lock (PIN/bio), auto-update OS+ऐप, सिर्फ़ official store, app permissions न्यूनतम, "find my device" चालू, SMS OTP के प्रति सतर्क (SIM-pin), public charging (USB data) से बचें, backup+एन्क्रिप्शन, पुराने फ़ोन को factory-reset करके बेचें।</p>
      <p><b>भारतीय साइबर क़ानून व रिपोर्टिंग (सामान्य सिद्धांत — स्थानीय/आधिकारिक स्रोत से पुष्टि करें):</b> <b>IT Act (Information Technology Act, 2000)</b> भारत में cybercrime/डेटा/इलेक्ट्रॉनिक हस्ताक्षर का मुख्य क़ानून है; इसमें computer-related offences, data/privacy और identity-related अपराध शामिल हैं (सटीक धाराएँ/बदलाव समय-समय पर होते हैं — परीक्षा में अध्यापक/आधिकारिक गज़ेट से verify करें)। बिना अनुमति किसी का सिस्टम/डेटा छूना अपराध है। <b>रिपोर्टिंग:</b> राष्ट्रीय पोर्टल <b>cybercrime.gov.in</b>, शिकायत हेल्पलाइन <b>1930</b> (financial cyber fraud), आपातकालीन <b>112</b>; पुलिस थाना/साइबर सेल। तुरंत बैंक को भी fraud notify करें — जितनी जल्दी, उतना money-recovery संभावना।</p>` },

    { type: 'table', head: ['विषय', 'क्या / कहाँ', 'ध्यान रखें'],
      rows: [
        ['3-2-1 नियम', '3 copies · 2 media · 1 offsite', 'रैंसमवेयर से single-location backup बचती नहीं'],
        ['रैंसमवेयर के लिए ख़ास', 'offline/immutable ("air-gap") copy', 'cloud sync भी encrypt हो सकता है — versioning रखें'],
        ['Restore test', 'कम-से-कम quarterly एक फ़ाइल restore', 'जिसे test न किया, वह backup नहीं'],
        ['क़ानून (भारत)', 'IT Act 2000 — cybercrime/डेटा/_SIGNATURES_', 'सटीक धाराएँ बदलती हैं — अध्यापक/आधिकारिक स्रोत से verify'],
        ['रिपोर्टिंग पोर्टल', '<b>cybercrime.gov.in</b>', 'fraud/financial/hacking शिकायत; complaint no. नोट करें'],
        ['हेल्पलाइन', '<b>1930</b> (cyber fraud), <b>112</b> (emergency)', 'जितनी जल्दी उतना बेहतर; बैंक को भी तुरंत सूचित'],
        ['संरक्षण न्याय', 'police/FIR + cyber cell + bank', 'सबूत संभालें (screenshot/OTP SMS/URL/txn ID)'],
        ['बच्चे/परिवार', 'parental controls, safe search, device limits', 'परिवार में "OTP माँगे तो काटो" नियम साझा करें']
      ] },

    { type: 'steps', title: 'PC संक्रमित (infected) लगे तो क्रम से करें', items: [
      { n: 1, title: 'शांत रहें, जल्दबाज़ी में कुछ न भेजें', text: 'पैनिक में पैसे/OTP/रीमोट एक्सेस देना सबसे बड़ी ग़लती है। पहले रोकथाम, फिर जाँच।' },
      { n: 2, title: 'अलग/Isolate करें', text: 'Ethernet/USB network निकालें, Wi-Fi चालू→<b>OFF</b>, Bluetooth बंद, साझा drive disconnect। ताकि मालवेयर नेटवर्क/दूसरे device न फैले और exfiltration रुके।' },
      { n: 3, title: 'संभावित डेटा सुरक्षित करें', text: 'एक fresh <b>read-only/formatted</b> media पर सिर्फ़ ज़रूरी documents copy करें; .exe/.docx/.zip जो अजनबि हैं न छुएँ। संदिग्ध autostart/persistent note करें।' },
      { n: 4, title: 'स्रोत-प्रमाणित AV से scan (Safe/Offline)', text: 'एक clean दूसरे PC से ताज़ा AV installer/USB लाकर, Windows में <b>Safe Mode + full scan</b>, या Defender का <b>Microsoft Defender Offline</b>/boot-scan चलाएँ। Ransomware लगने पर <i>एन्क्रिप्टेड फ़ाइलें मिटाएँ/renamed न करें</i> — वे सबूत+possible-decrypt हैं।' },
      { n: 5, title: 'दूसरे डिवाइस से पासवर्ड बदलें', text: 'संक्रमित मशीन से <b>नहीं</b> (keylogger)। साफ़ फ़ोन/PC से important accounts (email, bank, social) का पासवर्ड बदलें, <b>2FA</b> लगाएँ, logged-in devices से suspicious sign-out, recovery email ठीक करें।' },
      { n: 6, title: 'जल्दी fraud-report करें', text: 'पैसा/OTP गया तो तुरंत <b>1930</b> + <b>cybercrime.gov.in</b> + बैंक helpline; सबूत (screenshot/txn/URL/SMS) संभालें, complaint no. नोट करें।' },
      { n: 7, title: 'सफ़ाई/साफ़ इंस्टॉल पर विचार', text: 'Rootkit/persistent संक्रमण में सबसे भरोसेमंद = डेटा backup करके <b>पूरी clean reinstall</b>, फिर अपडेट+2FA लगाकर accounts खोलें। "temporarily disable AV" जैसी सलाह अनजान स्रोत से न मानें।' },
      { n: 8, title: 'बहाल/Recover व harden', text: 'अपडेट पूरे करें, AV real-time चालू, फ़ायरवॉल, passkey/2FA, और <b>3-2-1 offline backup</b> से डेटा वापस। फिर दोबारा संक्रमण-आशंका के सबूत (कहाँ फिसले) सुधारें।' }
    ] },

    { type: 'table', head: ['सुरक्षा चेकलिस्ट (Security Checklist)', 'हाँ/नहीं', 'आवृत्ति'],
      rows: [
        ['OS + ऐप + browser अपडेट (auto) चालू?', 'हाँ', 'हर हफ़्ते जाँच'],
        ['Windows Defender/AV चालू + signatures ताज़ा?', 'हाँ', 'रोज़ (auto)'],
        ['हर अकाउंट पर अलग पासवर्ड + password manager?', 'हाँ', 'जब-जब नया account'],
        ['महत्वपूर्ण accounts पर 2FA (app/hardware)?', 'हाँ', 'कभी-कभी audit'],
        ['Passkey उपलब्ध हो तो चालू?', 'हाँ', 'नए service पर'],
        ['Router admin password बदला, firmware update, WPS off?', 'हाँ', 'install पर + quarterly'],
        ['Wi-Fi WPA2-AES/WPA3 + लंबा रैंडम PSK?', 'हाँ', 'router बदलने पर'],
        ['Windows firewall profile सही (घर=Private)?', 'हाँ', 'नई नेटवर्क पर'],
        ['3-2-1 offline backup + restore-test?', 'हाँ', 'weekly + quarterly test'],
        ['BitLocker/LUKS disk encryption चालू?', 'हाँ', 'device setup पर'],
        ['रोज़ का काम standard user अकाउंट में?', 'हाँ', 'हमेशा'],
        ['अनजान OTP/CVV/स्क्रीन-शेयर/रीमोट देने से इंकार?', 'हाँ', 'हमेशा'],
        ['अनजान link/attachment/.apk न खोलना?', 'हाँ', 'हमेशा'],
        ['Logged-in devices/permissions periodical जाँच?', 'हाँ', 'monthly'],
        ['फ़ोन पर PIN/bio + find-device चालू?', 'हाँ', 'device setup पर']
      ] },

    { type: 'acc', title: 'बार-बार पूछे जाने वाले प्रश्न (FAQ — सुरक्षा)', items: [
      {q: 'क्या Windows Defender अकेला काफ़ी है?', a: 'हाँ, अधिकांश घर/छोटी दुकान के लिए Defender + अपडेट + 2FA + सही आदतें पर्याप्त हैं। तीसरे-पक्ष AV तभी जब extra feature (parental/VPN/manager) चाहिए, पर दो real-time AV एकसाथ न रखें।' },
      {q: 'OTP माँगने वाला "बैंक अफ़सर" असली हो सकता है?', a: 'नहीं। कोई भी legitimate bank/police/सरकारी एजेंसी OTP, CVV, पूरा पासवर्ड या रीमोट एक्सेस नहीं माँगती। माँगे तो धोखा — काटें और खुद official नंबर से वापस कॉल।' },
      {q: 'VPN लगाऊँ तो सब सुरक्षित?', a: 'नहीं। VPN सिर्फ़ आपके↔VPN-server traffic छिपाता और IP बदलता है; phishing, मालवेयर, weak password, और destination site का असर पर कोई असर नहीं।' },
      {q: 'क्या Mac/Android "हैक नहीं होते"?', a: 'यह मिथक है। वे कम लक्ष्य हैं पर अखरणीय नहीं; वही सिद्धांत — अपडेट, official store, 2FA, सावधानी।' },
      {q: 'रैंसमवेयर फिरौती दे दें?', a: 'सलाह: न दें — भुगतान पर भी decrypt की गारंटी नहीं, और आप fund करते हैं। Offline backup से restore करें; report करें।' },
      {q: 'एक अच्छा पासवर्ड कितना लंबा?', a: '12–16+ वर्ण या 4–6 शब्द passphrases (≈60–70+ bits) + हर साइट अलग + 2FA। लंबाई जटिलता से ज़्यादा मायने रखती है।' },
      {q: 'Free public Wi-Fi पर bank करूँ?', a: 'बचे; हो तो VPN+2FA, फिर भी "आपका device/destination" दोनों का risk है। असली काम home/cellular पर।' },
      {q: 'पुराना फ़ोन बेचने से पहले?', a: 'Accounts sign-out, Factory reset + disk-erase, SIM/SD निकालें; backup पहले।' },
      {q: 'शक हो तो सबसे पहला काम?', a: 'Device isolate (network off) → साफ़ device से pass बदलें + 2FA → जल्दी fraud हो तो 1930/report।' }
    ] },

    { type: 'quiz', store: 'sec-security', items: [
      { q: 'CIA Triad में "I" किसका प्रतीक है?', o: ['Integrity (अखंडता)', 'Internet', 'Identity', 'Indexing'], a: 0,
        ex: 'C-Confidentiality, I-<b>Integrity</b>, I-Availability — डेटा बिना अनुमति न बदलना।' },
      { q: 'कीड़ा (Worm) वायरस से किस बात में अलग है?', o: ['खुद नेटवर्क से फैलता है, मेज़बान नहीं चाहिए', 'हमेशा फ़ाइल में चिपकता है', 'विज्ञापन दिखाता है', 'सिर्फ़ mobile पर चलता है'], a: 0,
        ex: 'Virus को मेज़बान+मानव क्रिया चाहिए; <b>Worm</b> own-प्रतिरूपण से network फैलता है।' },
      { q: '"आपका अकाउंट ब्लॉक है, OTP बताइए" — यह क्या है?', o: ['Vishing (voice phishing)', 'Firewall rule', 'Heuristic', 'Passkey'], a: 0,
        ex: 'फ़ोन पर छल = <b>Vishing</b>। कोई bank OTP नहीं माँगता।' },
      { q: '2FA का सबसे कमज़ोर रूप (SMS के तुलना में)?', o: ['Hardware key', 'Authenticator app', 'SMS OTP', 'Passkey'], a: 2,
        ex: '<b>SMS OTP</b> SIM-swap/SS7 जोखिम से प्रभावित; फिर भी no-2FA से बेहतर — app/hardware/passkey बेहतर।' },
      { q: 'रैंसमवेयर का सबसे भरोसेमंद बचाव?', o: ['Offline/immutable 3-2-1 backup', 'RAM बढ़ाना', 'Browser cache clear', 'सिर्फ़ AV'], a: 0,
        ex: 'एन्क्रिप्टेड डेटा <b>ऑफ़लाइन बैकअप</b> से ही restore होता है; फिरौती न दें।' },
      { q: 'WPA2/WPA3 का मुख्य काम?', o: ['Wi-Fi traffic encrypt करना', 'CPU तेज़ करना', 'बैकअप', 'फ़ाइल compress'], a: 0,
        ex: 'Wi-Fi encryption से हवा में sniffing रोकी जाती है; WEP भंग है, न करें।' },
      { q: 'VPN असल में क्या बचाता है?', o: ['आप↔VPN-server traffic', 'हर phishing साइट', 'पासवर्ड चोरी', 'मालवेयर'], a: 0,
        ex: 'VPN tunnel encrypt करता है; site-level मालवेयर/phishing पर नहीं।' },
      { q: 'भारत में cyber-fraud शिकायत हेल्पलाइन?', o: ['1930', '100 only', '108', 'कोई नहीं'], a: 0,
        ex: '<b>1930</b> (financial fraud) + <b>cybercrime.gov.in</b>; emergency <b>112</b>।' }
    ] }
  ]
},

/* ===================================================================
   फ़ाइलें, संपीड़न, क्लाउड व डेटा रिकवरी
   =================================================================== */
{
  id: 'sec-data', icon: '🗜️', group: 'इंटरनेट व साइबर सुरक्षा',
  title: 'फ़ाइलें, संपीड़न, क्लाउड और डेटा रिकवरी',
  sub: 'फ़ाइल मैनेजमेंट, archive/codec, hashing/एन्क्रिप्शन, क्लाउड स्टोरेज व data recovery',
  kicker: 'Cyber Security 2 · Files, Compression, Cloud & Recovery',
  hero: 'यह अध्याय <b>डेटा के जीवन-चक्र</b> को समझाता है — फ़ाइल बनाना/नाम/एक्सटेंशन से, संपीड़न (compression) व codec, एन्क्रिप्शन/हैशिंग (hashing), क्लाउड स्टोरेज, और सबसे नाज़ुक हिस्सा <b>डेटा रिकवरी</b> तक कि मिटाई गई फ़ाइल वापस कैसे आती/नहीं आती। यह सब रक्षात्मक/व्यवहारिक ज्ञान है; <b>किसी के कामकाजी (work) drive पर मना किए गए experiments</b> भी साफ़-साफ़ बताए गए हैं। अंत में प्रैक्टिकल <b>135–149</b>।',
  tags: ['File Management', 'Compression & Archive', 'Codecs', 'Hashing & TLS', 'Cloud Storage', 'Data Recovery'],
  blocks: [
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">13.1</span> फ़ाइल व फ़ोल्डर का आधार — Path, नामकरण और छिपी फ़ाइलें</h3>
      <p><b>फ़ाइल (File)</b> नाम वाली बाइट-sequence है; <b>फ़ोल्डर (Directory)</b> फ़ाइलों/और फ़ोल्डरों का समूह। <b>Path (पथ)</b> फ़ाइल का पता है — <b>Absolute</b> (root से शुरू, जैसे <code>C:\\Users\\Ravi\\Desktop\\a.txt</code> या <code>/home/ravi/a.txt</code>) और <b>Relative</b> (मौजूदा जगह से, जैसे <code>./docs/a.txt</code>)। separator Windows <code>\\</code>, Linux/macOS <code>/</code>; Linux root <code>/</code>, Windows drive <code>C:\\</code> — यही अंतर scripts/shortcuts में बार-बार फँसाता है।</p>
      <ul>
        <li><b>नामकरण नियम (per OS):</b> Windows/कई filesystem <b>case-insensitive</b> (Read=read), Linux <b>case-sensitive</b>। Windows में इन 9 वर्णों का प्रतिबंध: <code>&lt; &gt; : " / \\ | ? *</code> और reserved नाम (CON, PRN, AUX, NUL, COM1-9, LPT1-9) — ये file नहीं बन सकते। Linux में सिर्फ़ <code>/</code> और null (\\0) प्रतिबंधित; वरना लगभग कुछ भी। macOS default case-insensitive पर case-preserving।</li>
        <li><b>लंबाई सीमा:</b> NTFS/ext4 में नाम ~255 bytes; Windows legacy path limit <code>MAX_PATH</code> ≈ 260 chars (long paths feature से बढ़ता है); यही कारण कि गहरे folder में "path too long" एरर आता है — folder नीचे ले जाएँ/shorten करें।</li>
        <li><b>Hidden/System attributes:</b> Windows — Hidden, System, Read-only, Archive flags (attrib/GUI); Linux — बिंदु से शुरू <code>.bashrc</code> = hidden + permissions। <b>.NET</b> फ़ाइलें, pagefile/swap आदि सिस्टम की; बिना ज़रूरत न छेड़ें।</li>
        <li><b>DOT-name धोखा:</b> <code>invoice.jpg.exe</code> Windows default में <code>.exe</code> छिपाकर <code>invoice.jpg</code> दिखाना → दोहरा extension = मालवेयर-संकेत; Explorer में "file name extensions" दिखाएँ।</li>
      </ul>` },

    { type: 'table', head: ['एक्सटेंशन', 'प्रकार / पूरा रूप', 'खोलने/उपयोग', 'सुरक्षा नोट'],
      rows: [
        ['.txt / .md', 'Plain text / Markdown', 'नोटपैड, कोई editor', 'सबसे सुरक्षित; macro नहीं'],
        ['.docx / .xlsx / .pptx', 'MS Office XML (ZIP-आधारित)', 'Word/Excel/PowerPoint', 'macro (.docm) व external links सावधानी'],
        ['.pdf', 'Portable Document Format', 'PDF reader/browser', 'embedded JS/links/attachments से सावधान'],
        ['.jpg/.jpeg', 'Joint Photographic Experts Group', 'छवि', 'छवि में meta (EXIF) location हो सकता है'],
        ['.png', 'Portable Network Graphics', 'छवि, transparency', 'lossless; छवि में stego जोखिम (सैद्धांतिक)'],
        ['.mp3 / .wav', 'Audio Layer-3 / Waveform Audio', 'ऑडियो', '.wav raw इसलिए भारी'],
        ['.mp4 / .mkv / .avi', 'Containers (MP4/MPEG-4 P14, Matroska, Audio Video Interleave)', 'वीडियो', 'container ≠ codec; player update रखें'],
        ['.zip / .rar / .7z', 'Archive containers', 'extract करके पढ़ें', 'nested archive password-protect पर भी scan'],
        ['.iso', 'Optical Disc Image', 'disk image; mount', 'इसके अंदर भी executable हो सकता है'],
        ['.exe/.msi/.scr/.bat/.cmd', 'Windows executable/installer', 'सिर्फ़ भरोसेमंद source', '.scr/.bat classic malware vectors — सावधान'],
        ['.apk', 'Android Package', 'Android install', 'official store+permissions; sideload खतरनाक'],
        ['.lnk/.url', 'Shortcut (Windows/Linux link)', 'double click launch', 'LNK target = अजनबि process मालवेयर-संकेत']
      ] },

    { type: 'table', head: ['कार्रवाई', 'Windows (Explorer/GUI)', 'Linux (GUI / कमांड)'],
      rows: [
        ['नई फ़ोल्डर', 'Right-click → New → Folder; <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>N</kbd>', 'GUI: New Folder; <code>mkdir dir</code>'],
        ['कॉपी', '<kbd>Ctrl</kbd>+<kbd>C</kbd> / drag+<kbd>Ctrl</kbd>', 'GUI <kbd>Ctrl</kbd>+<kbd>C</kbd>; <code>cp a b</code> (recursive <code>-r</code>)'],
        ['कट (मोव)', '<kbd>Ctrl</kbd>+<kbd>X</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd>', 'GUI; <code>mv a b</code>'],
        ['रिनेम', '<kbd>F2</kbd>', 'GUI F2; <code>mv old new</code>'],
        ['डिलीट', '<kbd>Del</kbd> (Recycle Bin), <kbd>Shift</kbd>+<kbd>Del</kbd> (स्थायी)', 'GUI; <code>rm f</code> (recursive <code>-r</code>) — bin नहीं'],
        ['खोज/सर्च', 'Explorer box; <kbd>Ctrl</kbd>+<kbd>F</kbd>', 'GUI search; <code>find . -name</code>, <code>locate</code>'],
        ['छिपी दिखाना', 'View → Hidden items (+ OS files)', 'GUI: <kbd>Ctrl</kbd>+<kbd>H</kbd>; <code>ls -a</code>'],
        ['extension दिखाना', 'View → Show → File name extensions', 'नाम में ही रहता है'],
        ['Properties', 'Right-click → Properties', 'Right-click Properties; <code>stat file</code>']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">13.2</span> संपीड़न (Compression) व Archive फ़ॉर्मैट</h3>
      <p><b>Archive</b = कई फ़ाइलों को एक में समेटता है (tar/zip); <b>Compression</b = साइज़ घटाता है। दो श्रेणी — <b>Lossless</b> (डिकोम्प्रेस पर बिल्कुल वही data; doc/zip/png) और <b>Lossy</b> (थोड़ा data हटाकर छोटा; jpg/mp3/mp4 — इंसान को फ़र्क़ कम दिखे)। <b>Compression ratio</b> = मूल/संकुचित साइज़; जितना बड़ा, उतनी बचत (अक्सर % या X:1)।</p>
      <table class="tbl"><tr><th>फ़ॉर्मैट</th><th>पूरा रूप/प्रकृति</th><th>खास</th><th>कहाँ</th></tr>
        <tr><td>ZIP</td><td>सबसे सामान्य lossless container</td><td>cross-platform, Windows/mac/Linux native, password (आधारित) + AES-256 (tools)</td><td>साझा, email attachment</td></tr>
        <tr><td>RAR</td><td>Proprietary (WinRAR); high ratio</td><td>split/repair/recovery-record, password+AES-256</td><td>बड़े archive</td></tr>
        <tr><td>7Z</td><td>7-Zip (open), LZMA2</td><td>तेज़+better ratio, strong AES-256, split, header encrypt</td><td>archive/storage</td></tr>
        <tr><td>TAR.GZ / TAR.XZ</td><td>tar(संग्रह)+gzip/xz(compress)</td><td>Linux में perm/owner रखता है; tar अकेले compress नहीं</td><td>Linux backups/releases</td></tr>
        <tr><td>ISO</td><td>optical-disc image</td><td>mount करके चलाने-योग्य; bootable image भी</td><td>OS installer/disc</td></tr>
        <tr><td>GZIP/BZIP2</td><td>single-stream compressor</td><td>एक फ़ाइल (file.gz); Linux log/data</td><td>server/quick compress</td></tr></table>
      <ul>
        <li><b>कब फ़ायदा:</b> text, doc/spreadsheet, code, bmp, database, folder-of-small-files (बचत ~50–75%)। <b>कब बेकार:</b> jpg/mp3/mp4/zip/7z जैसे पहले से-compressed पर ~0–5% और बर्बाद CPU। (मिसाल: 100 MB folder → ~28 MB zip = ratio ≈ 3.6:1 = ~72% बचत; 500 MB mp4 → ~500 MB zip ≈ कुछ नहीं।)</li>
        <li><b>Split archive:</b > बड़ी file को भागों में (part1.rar…, .z01) — cloud/CD size-limit टालने व download-stability के लिए; सब भाग + क्रम चाहिए वरना extract fail।</li>
        <li><b>Password-protected ZIP:</b> ZIP की पुरानी "ZipCrypto" कमज़ोर; आधुनिक tools (7-Zip/WinRAR) <b>AES-256</b> + <b>header/name encryption</b> — पर पासवर्ड भूलने पर data वापसी कठिन; password को अलग चैनल से भेजें, archive link के साथ न।</li>
        <li><b>सावधानी:</b> password-protected archive AV को दिखता नहीं (inspect कर पाता नहीं) — अनजान source का "protected zip" मालवेयर-ढकने का classic तरीक़ा; केवल पहचाने-श्रोत पर चलाना।</li>
      </ul>` },

    { type: 'table', head: ['Codec/Container', 'पूरा रूप', 'Lossy/Lossless', 'कहाँ उपयोग'],
      rows: [
        ['JPEG (.jpg)', 'Joint Photographic Experts Group', 'Lossy (image)', 'फ़ोटो — कम साइज़; transparency नहीं'],
        ['PNG (.png)', 'Portable Network Graphics', 'Lossless (image)', 'logo/UI, alpha transparency; screenshot'],
        ['GIF (.gif)', 'Graphics Interchange Format', 'Lossless-quant(8-bit)', 'छोटी animation/icon; 256 रंग'],
        ['WebP (.webp)', 'Google WebP', 'दोनों (lossy+lossless)', 'वेब — jpg/png से छोटा; modern browsers'],
        ['MP3 (.mp3)', 'MPEG-1 Audio Layer III', 'Lossy (audio)', 'संगीत; पुराना+सर्वत्र समर्थित'],
        ['AAC (.m4a)', 'Advanced Audio Coding', 'Lossy (audio)', 'MP3 से बेहतर गुणवत्ता/साइज़; streaming/iTunes'],
        ['WAV (.wav)', 'Waveform Audio File Format', 'Lossless/uncompressed', 'रिकॉर्डिंग/एडिटिंग; भारी'],
        ['FLAC (.flac)', 'Free Lossless Audio Codec', 'Lossless (audio)', 'archive/hi-fi; ~50% compression'],
        ['MP4', 'MPEG-4 Part 14 (container)', 'आंतरिक codec पर', 'वीडियो साझा/streaming (H.264/AAC common)'],
        ['MKV', 'Matroska (container)', 'आंतरिक codec पर', 'multi-audio/subtitle; बड़ी video files'],
        ['AVI', 'Audio Video Interleave (container)', 'आंतरिक codec पर', 'पुराना Windows; compatibility'],
        ['H.264 (AVC)', 'Advanced Video Coding', 'Lossy (video)', 'सबसे आम — web/call/bluray'],
        ['H.265 (HEVC)', 'High Efficiency Video Coding', 'Lossy; ~50% better', '4K/8K; licensing/patent जटिल'],
        ['AV1', 'AOMedia Video 1 (open)', 'Lossy; ~30-50% better', 'royalty-free; streaming (YouTube/Netflix)']
      ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा-तथ्य (exam) — Compression/Codec', html: '<p><b>Container ≠ Codec:</b> MP4/MKV/AVI container हैं; H.264/H.265/AV1 codec। <b>ZIP/TAR:</b> tar सिर्फ़ संग्रह (compression नहीं), tar.gz में gzip compress करता है। <b>Lossy vs Lossless:</b> jpg/mp3 = lossy, png/flac/zip = lossless। <b>Office/PDF अंदर से:</b> DOCX/XLSX/PPTX = ZIP (XML files), PDF भी compressed streams रख सकता है। <b>पहले से compressed media पर compression बेकार</b>। <b>H.265/HEVC</b> ~H.264 से दोगुनी दक्षता; <b>AV1</b> open+royalty-free।</p>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">13.3</span> हैशिंग, डिजिटल सिग्नेचर व एन्क्रिप्शन (सामान्य सिद्धांत)</h3>
      <p><b>Hash (हैश/सारांश)</b> = कोई भी size का input → <b>निश्चित लंबाई का fingerprint</b> (MD5 128-bit, SHA-1 160-bit, SHA-256 256-bit)। यह <b>one-way</b> है — hash से वापस data नहीं; input बदलें तो hash पूरी तरह बदलता है (avalanche)। उपयोग: <b>integrity</b> (checksum से डाउनलोड/कॉपी सही?), password storage (salted hash, plain नहीं)। MD5/SHA-1 अब signature-collision के लिए अस्वीकृत; <b>SHA-2/SHA-3</b> मानक। हैश ≠ encryption: encryption <b>reverse</b> करने-योग्य (key चाहिए), hash नहीं।</p>
      <ul>
        <li><b>Digital Signature:</b> sender <b>private key</b> से hash sign करता है; receiver <b>public key</b> से verify — यह <b>authenticity + integrity + non-repudiation</b> देता है (code signing, TLS, documents)।</li>
        <li><b>Symmetric बनाम Asymmetric:</b> Symmetric (AES/ChaCha) — एक ही secret key, तेज़, bulk data के लिए; key-vitran चुनौती। Asymmetric (RSA/ECC) — public/private pair; धीमा, key exchange/signature के लिए। <b>Hybrid</b> (TLS जैसा): asymmetric से session key exchange, फिर symmetric से bulk encrypt।</li>
        <li><b>TLS certificate chain (सरल भाषा):</b> साइट का <b>leaf/server cert</b> → <b>Intermediate CA</b> → <b>Root CA</b> (browser में trust-store से pre-trusted)। यह श्रृंखला साबित करती है "यह साइट वाकई x.com है और इसकी public key valid है"; expiry/revocation + trusted CA इसी का हिस्सा। हस्ताक्षर भंग/unknown CA पर browser warning = सावधानी।</li>
        <li><b>E2E (End-to-End) messaging:</b> संदेश भेजने वाले से पाने वाले तक केवल भेजने-पाने वाले devices पर key; server/ provider decrypt नहीं कर पाता (Signal/WhatsApp) — confidentiality + (safety-number/side-channel से) tamper-pkaतेंत। पर metadata, device compromise, backup-exposure अलग प्रश्न हैं।</li>
      </ul>` },

    { type: 'table', head: ['अवधारणा', 'क्या', 'उपयोग / सीमा'],
      rows: [
        ['Hash (SHA-256/MD5)', 'fixed-length fingerprint, one-way', 'integrity/checksum; password storage (salted) — <b>decrypt नहीं होता</b>'],
        ['Checksum (CRC/SHA)', 'data सही पहुँचा?', 'download/DVD/backup verify; source के साथ hash साइट मिलनी चाहिए'],
        ['Symmetric (AES)', 'एक shared key', 'bulk/folder/disk encryption (BitLocker/LUKS) — तेज़; key sharing risk'],
        ['Asymmetric (RSA/ECC)', 'public+private pair', 'TLS handshake, signature, key-exchange — धीमा, key management आसान'],
        ['Digital signature', 'private से sign, public से verify', 'code-signing/software/authenticity + non-repudiation'],
        ['TLS (https)', 'hybrid + cert chain', 'transport confidentiality/integrity; पर site मालवेयर/भरोसे पर नहीं']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">13.4</span> क्लाउड स्टोरेज — sync vs backup vs share</h3>
      <p>तीनों अलग हैं; गोलमोल से डेटा खो जाता है। <b>Sync (सिंक)</b> = एक folder device↔cloud↔devices mirrored — <b>ग़लती/डिलीट भी sync</b> हो जाता है (यह backup नहीं)। <b>Backup (बैकअप)</b> = point-in-time, versioned, offline/immutable प्रतियाँ (3-2-1 में "offsite/cloud" हिस्सा) — कभी-कभी restore-test। <b>Share (साझा)</b> = दूसरों को access देना (link/invite) — permission नियंत्रण ज़रूरी।</p>
      <table class="tbl"><tr><th>सेवा</th><th>मुफ़्त tier (सामान्य)*</th><th>ताक़त</th><th>ध्यान</th></tr>
        <tr><td>Google Drive / OneDrive / Dropbox</td><td>अलग-अलग सीमित GB; paid से बढ़ता</td><td>auto-sync, mobile, Office/Docs integration, sharing</td><td>sync≠backup; history/version retention plan-भेद</td></tr>
        <tr><td>OneDrive (Windows integration)</td><td>OS-level Known Folder Backup</td><td>Desktop/Documents/Pictures backup, offline files</td><td>account login = PC auto-pull; privacy जाँचें</td></tr>
        <tr><td>Google One / iCloud / Dropbox Plus</td><td>multi-service storage plans</td><td>phone photo/video auto-backup</td><td>device storage↔cloud policy समझें</td></tr>
        <tr><td>True backup apps (Backblaze, Duplicati, Restic, borg)</td><td>plan-based</td><td>versioned, client-side encryption, retention</td><td>रैंसमवेयर/डिलीट से बेहतर सुरक्षित</td></tr></table>
      <p><small>*मुफ़्त सीमाएँ/फीचर समय-समय पर बदलते हैं — signup से पहले provider की मौजूदा योजना स्वयं verify करें; किसी संख्या पर भरोसा न करें।</small></p>
      <ul>
        <li><b>सुरक्षित upload:</b> संवेदनशील data client-side encrypt करके भेजें; strong password + 2FA पर service; "trusted devices" सीमित।</li>
        <li><b>Link permissions:</b> "Anyone with link" से बचें → specific people/invite; view-only बनाम edit/comment; expiry/password/region हो तो; <b>public link = search/index हो सकता</b> — भेजने से पहले link की reach समझें।</li>
        <li><b>Provider trust:</b> cloud पर data provider के server पर है — provider policy/encryption jurisdiction जानें; sensitive चीज़ें encryption+offline रखें।</li>
      </ul>` },

    { type: 'callout', kind: 'exam', title: 'परीक्षा-तथ्य (exam) — Cloud', html: '<p><b>Sync ≠ Backup ≠ Share</b> — यही अक्सर पूछा जाता है। Sync में ग़लती/डिलीट भी फैलता है; backup versioned+offline रखता है। <b>Anyone-with-link</b> = नियंत्रण-शून्य share; <b>client-side/zero-knowledge encryption</b> = provider भी data न पढ़े। मुफ़्त quota/feature बदलते हैं — संख्या याद करने से पहले service की तत्काल योजना verify करें।</p>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">13.5</span> डेटा रिकवरी — क्यों "delete" का मतलब "मिटाई" नहीं</h3>
      <p>FAT/NTFS/ext4 जैसी filesystem में <b>normal delete सिर्फ़ इंडेक्स/MFT entry हटाता है</b> — data blocks disk पर <b>writing तक बचे</b> रहते हैं (इसलिए free space में recovery tool pattern ढूँढकर फ़ाइलें लौटा पाते हैं)। जितना कम नया write, उतनी बेहतर recovery। <b>SSD पर TRIM</b> — फ़ाइल सिस्टम drive को बताता है कि ये blocks खाली हैं; SSD उन्हें बाद में wipe कर देता है → <b>recovery बहुत कठिन/असंभव</b>। इसीलिए फ़ाइल खोने पर उसी drive पर <b>लिखना तुरंत रोकें</b> (system drive पर तो power off/least writes), recovery दूसरे drive पर करवाएँ।</p>
      <ul>
        <li><b>Tools (व्यवहारिक, वैध/अपने data पर):</b> Recuva (Win), PhotoRec/TestDisk, R-Studio, DMDE; Linux <code>extundelete</code>/<code>testdisk</code>/<code>photorec</code>। ये <b>अपने खोए हुए data</b> के लिए हैं — किसी और के drive पर छेड़छाड़ क़ानूनन अपराध व non-ethical।</li>
        <li><b>सुरक्षित मिटाना (wipe/sanitize):</b> पुराने HDD पर multi-pass erase; SSD पर <b>ATA Secure Erase / NVMe sanitize / vendor tool</b>; BitLocker/LUKS के <b>key-erase (crypto-erase)</b> से data unreadable (तेज़+SSD पर standard)। factory reset पर पुराने Android पर encryption + reset ज़्यादा भरोसेमंद।</li>
        <li><b>Format के प्रकार:</b> quick format (index सिर्फ़ — data recovery हो सकता) vs full format (bad-cluster check; HDD पर zeroing में पुराने Windows में data overwrite; नए में variant)। <b>सुरक्षित wipe</b> अलग tool/process से करना चाहिए, quick format से नहीं।</li>
      </ul>` },

    { type: 'table', head: ['स्थिति', 'क्या करें', 'क्यों', 'मना (Never)'],
      rows: [
        ['फ़ाइल गलती से delete (HDD)', 'उसी drive पर लिखना रोकें; दूसरे drive पर tool से scan', 'data free-space में बचा है', 'उसी drive install/write/defrag न करें'],
        ['फ़ाइल गलती से delete (SSD)', 'तुरंत लिखना रोकें; फिर भी संभव घट', 'TRIM ने/करेगा wipe', 'बहुत देर/भारी write से अवसर छूटेगा'],
        ['Ransomware ने एन्क्रिप्ट', 'isolate; backup से restore; report', 'decrypt की गारंटी नहीं', 'फ़ाइलें delete/rename न करें (सबूत+possible); फिरौती न दें'],
        ['पार्टीशन ग़ायब/format', 'boot न करें, image बनाकर फिर tool', 'sector-level scan बेहतर', 'उसी disk पर OS न डालें'],
        ['Work/office drive गड़बड़', 'रोककर IT/specialist को दें', 'और नुक़सान/क़ानूनी जोखिम', 'personal tool/मज़बूती से wipe/format <b>कभी न</b> करें'],
        ['बेचने से पहले disk', 'backup→crypto/format-erase→(HDD) multi-pass', 'data recoverable न रहे', 'सिर्फ़ quick delete/format से बेचना ख़तरनाक'],
        ['छेड़-छाड़ संदेह/जानबूझकर', 'क़ानूनन सिर्फ़ अपना device', 'अनधिकृत access अपराध', 'किसी और का device/backup छेड़ना <b>गैरक़ानूनी</b>']
      ] },

    { type: 'callout', kind: 'danger', title: 'किसी के कामकाजी (work) drive पर कभी न करें', html: '<p>दुकान/ऑफ़िस/कॉलेज या <b>किसी और का</b> computer/backup drive पर <b>self-made recovery wipe/format overwrite, disk-utility experiments</b> कभी न चलाएँ — एक ग़लत command से restore-असमर्थ डेटा-नुक़सान और क़ानूनी/करियर जोखिम। अपने device पर ही सीखें (virtual machine/पुरानी test disk बनाकर) और असली नुक़सान पर specialist को बुलाएँ। recovery सिर्फ़ <b>अपने व अनुमति-प्राप्त</b> data पर, नैतिक व वैध सीमा में।</p>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">13.6</span> प्रिंटिंग/PDF व ईमेल attachment — व्यावहारिक नियम</h3>
      <p><b>PDF practicals:</b> "Print → Microsoft Print to PDF/Save as PDF" = किसी भी app से PDF; PDF merge/split/compress tools; text-वाला PDF बनाम scanned image PDF (OCR चाहिए); <b>PDF में embedded JS/attachment/link से सावधानी</b> (मालवेयर vector), इसलिए अजनबि PDF scan करके खोलें; sensitive PDF को <b>password+permissions</b> (open/copy/print) देकर भेजें, और pass अलग चैनल से।</p>
      <p><b>प्रिंटिंग जाँच (शॉर्ट):</b> printer online/default, queue clear, cable/network/Wi-Fi, driver सही, spooler (Spooler service), "print to file/preview", paper/tray, USB port; stuck job → spool clear/restart।</p>
      <p><b>ईमेल attachment & size limit:</b> आधुनिक Gmail/Outlook में ~25 MB; Yahoo ~20–25 MB; enterprise SMTP अक्सर 10 MB तक (server नीति) — सीमा बदल सकती है, <b>अपने provider की मौजूदा limit स्वयं verify करें</b>। बड़े file <b>cloud link</b> या <b>split archive</b> से भेजें (सिर्फ़ attachment से नहीं); अजनबि attachment पर extension (छिपा dual ext) व source जाँचें।</p>` },

    { type: 'table', head: ['विषय (Email/Print/PDF)', 'मान / नियम', 'ध्यान रखें'],
      rows: [
        ['Gmail / Outlook attachment', '~25 MB तक (provider बदलता है)', 'सीमा बदल सकती है — भेजने से पहले खुद verify करें'],
        ['Yahoo mail attachment', '~20–25 MB', 'SMTP server की नीति अलग हो सकती है'],
        ['Enterprise SMTP / server policy', 'अक्सर ~10 MB तक', 'IT नीति; बड़ा file link से भेजें'],
        ['बड़ी फ़ाइल भेजने का सही तरीक़ा', 'cloud share link / split archive', 'link permission view-only + expiry'],
        ['Print → PDF (किसी भी app से)', '"Microsoft Print to PDF" / Save as PDF', 'text-PDF बनाम scanned (OCR चाहिए)'],
        ['PDF को संरक्षित भेजना', 'password + permissions (open/copy/print)', 'पासवर्ड अलग चैनल से भेजें'],
        ['PDF/Office का मालवेयर-vector', 'embedded JS / macro / link / attachment', 'अजनबि हो तो scan/VM में खोलें'],
        ['अटकी हुई print (job stuck)', 'queue clear → Spooler service restart → driver', 'cable/network/USB port भी जाँचें'],
        ['प्रिंटर "online/default" नहीं', 'default printer सेट, cable/Wi-Fi, driver सही', 'print preview/"print to file" से test'],
        ['अटैचमेंट extension धोखा', 'छिपा dual-extension (.pdf.exe)', 'file-name extensions चालू रखें']
      ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा-तथ्य (exam) — Email/Print/PDF', html: '<p><b>Attachment limit</b> provider-नीति से बदलती है (Gmail/Outlook प्रायः ~25 MB, enterprise SMTP ~10 MB) — संख्या रटने से पहले service की मौजूदा सीमा verify करें। बड़ी फ़ाइल <b>cloud link / split archive</b> से भेजें, plain attachment से नहीं। <b>"Print to PDF"</b> किसी भी app से PDF बनाता है; <b>scanned PDF</b> पर text-के लिए <b>OCR</b> चाहिए। PDF/Office में <b>embedded JS/macro/attachment</b> मालवेयर vector है → अजनबि हो तो scan/VM। <b>Stuck print</b> → Spooler service/queue/driver। <b>DOCX/XLSX = ZIP(XML)</b>। <b>छिपा dual-extension</b> (.pdf.exe) = मालवेयर-संकेत।</p>' },

    { type: 'kv', items: [
      { label: 'FAT32 अधिकतम फ़ाइल', value: '4 GB', desc: 'इसलिए बड़े डेटा/वीडियो के लिए exFAT/NTFS चुनें' },
      { label: 'NTFS/ext4 फ़ाइल-नाम लंबाई', value: '~255 chars', desc: 'Windows legacy path limit MAX_PATH ≈ 260 (long-path feature से बढ़े)' },
      { label: '1 Byte', value: '8 bits', desc: '1 KB = 1024 bytes (binary); marketing में अक्सर 1000' },
      { label: 'ZIP पुराना vs नया पास', value: 'ZipCrypto → AES-256', desc: '7-Zip/WinRAR का AES-256 + header encryption ही सुरक्षित' },
      { label: 'MD5 / SHA-256', value: '128 / 256-bit hash', desc: 'MD5/SHA-1 signature-collision के लिए अस्वीकृत; integrity = SHA-2' },
      { label: 'WEP / WPA2 / WPA3', value: 'भंग / स्वीकार्य / नवीनतम', desc: 'WEP कभी न; WPA2-AES ठीक; WPA3 सर्वश्रेष्ठ' },
      { label: 'BitLocker ↔ LUKS', value: 'Windows ↔ Linux', desc: 'दोनों full-disk encryption; recovery key संभालें' }
    ] },

    { type: 'cards', items: [
      { ico: '📁', title: 'फ़ाइल हैंडलिंग', text: 'Path (absolute/relative), OS-वार नाम-नियम, case-sensitivity, hidden/system, छिपा dual-extension पहचान।', tags: ['Path', 'Extension', 'Hidden files'] },
      { ico: '🗜️', title: 'संपीड़न व Archive', text: 'ZIP/RAR/7Z/tar.gz/ISO; lossless बनाम lossy; text पर फ़ायदा, media पर नहीं; split + AES-256 password।', tags: ['Compression ratio', 'Split', 'AES-256'] },
      { ico: '🎬', title: 'Codec व Container', text: 'JPEG/PNG/WebP, MP3/AAC/WAV, MP4/MKV/AVI + H.264/H.265/AV1 — container ≠ codec।', tags: ['Lossy', 'H.265', 'AV1'] },
      { ico: '🔐', title: 'Hash/Signature/TLS', text: 'Hash one-way (integrity), signature=private sign/public verify, cert-chain leaf→root, E2E messaging।', tags: ['SHA-256', 'TLS', 'E2E'] },
      { ico: '☁️', title: 'क्लाउड स्टोरेज', text: 'Sync ≠ Backup ≠ Share; link permission/expiry; client-side encryption; quota बदलता है।', tags: ['Sync', 'Backup', 'Share'] },
      { ico: '♻️', title: 'डेटा रिकवरी', text: 'Delete सिर्फ़ index हटाता है; overwrite/TRIM रोक; safe wipe crypto-erase; अपना ही data, वैध सीमा में।', tags: ['TRIM', 'Recovery', 'Wipe'] }
    ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा-तथ्य (exam) — File/Data/Security', html: '<p><b>Normal delete सिर्फ़ index हटाता है</b> — data तब तक recoverable जब तक overwrite न हो; <b>SSD TRIM</b> recovery कठिन बनाता है। <b>Quick format ≠ safe wipe</b>; SSD पर crypto/secure-erase। DOCX/XLSX/PPTX = ZIP(XML)। <b>HASH one-way</b>, encryption two-way; TLS cert-chain: leaf→intermediate→root; <b>signature = private से sign, public से verify</b>। Sync ≠ Backup। E2E में server decrypt नहीं करता, पर metadata/device risk बचा रहता है। फिरौती न दें; offline backup से restore।</p>' },

    { type: 'steps', title: 'नई फ़ाइल/डाउनलोड सुरक्षित हैंडल (defensive SOP)', items: [
      { n: 1, title: 'Source प्रमाणित करें', text: 'आधिकारिक वेबसाइट/store, HTTPS, known publisher; "crack/free premium/serial key" वाली साइट = malware का hotspot।' },
      { n: 2, title: 'Extension व dual-name जाँचें', text: 'View → file-name extensions चालू करें; <code>.pdf.exe</code>, <code>.jpg.scr</code>, छुपा बाइनारी = लाल-झंडी।' },
      { n: 3, title: 'Hash/checksum मिलाएँ', text: 'जहाँ निर्माता hash देता है (ISO/archive), वही tool से hash गणना कर मिलाएँ — अंतर = tampered/corrupt file।' },
      { n: 4, title: 'AV scan + real-time', text: 'डबल-क्लिक से पहले on-demand/right-click scan; archive के अंदर की file भी scan; password-protected zip पर AV नहीं देख पाता — अनजान source से सावधान।' },
      { n: 5, title: 'संदिग्ध पर isolate/VM में चलाएँ', text: 'दुर्लभ/संदेहजनक installer VM/sandbox में देखें; real machine पर autostart/network permission न दें।' }
    ] },

    { type: 'acc', title: 'FAQ — फ़ाइल/Compression/Recovery', items: [
      {q: 'ZIP में password रखूँ तो safe?', a: 'पुराना ZipCrypto कमज़ोर; 7-Zip/WinRAR का <b>AES-256 + header encryption</b> लें। पर पासवर्ड forget = data बचेगा नहीं; AV protected archive scan नहीं कर पाता।' },
      {q: 'MP4 पर zip करने से साइज़ कम होगा?', a: 'नहीं — mp4/jpg/mp3 पहले से compressed; बर्बाद CPU, शून्य-के-क़रीब बचत। Compression तभी जब text/doc/code/बड़ी uncompressed media।' },
      {q: 'Delete की फ़ाइल तुरंत recovery हो जाएगी?', a: 'HDD पर अक्सर हाँ (जब तक overwrite न हो); <b>SSD पर TRIM</b> कारण संभावना कम। उसी drive पर लिखना तुरंत रोकें।' },
      {q: 'Hash से password decrypt होता है?', a: 'नहीं — hash <b>one-way</b> है; password storage में salted hash रखते हैं, decrypt नहीं; verify के लिए input का hash मिलाते हैं।' },
      {q: 'Docx/Pdf खुलते नहीं — क्या virus?', a: 'हर बार नहीं; corruption/missing codec/huge media कारण हो सकता। फिर भी unknown source हो तो scan + VM में जाँचें।' },
      {q: 'Recycle Bin खाली = gone?', a: 'अक्सर नहीं — blocks free हो जाते, recovery tool पा सकते हैं जब तक overwrite न हो; स्थायी मिटाने के लिए wipe/secure-erase चाहिए।' },
      {q: 'BitLocker vs LUKS क्या?', a: 'दोनों disk-encryption; <b>BitLocker</b> Windows (TPM), <b>LUKS</b> Linux (cryptsetup/dm-crypt) — recovery key संभालें, वरना data access खो जाता है।' },
      {q: 'Kisi aur ka data recover karu?', a: '<b>नहीं</b> — किसी और के device/backup पर बिना अनुमति छेड़छाड़ क़ानूनन अपराध; सिर्फ़ अपना व permitted data।' },
      {q: 'Cloud link से भेजना safe?', a: '"Anyone with link" जोखिमपूर्ण; <b>specific people, view-only, expiry/password</b> से भेजें; link की reach समझें।' }
    ] },

    { type: 'quiz', store: 'sec-data', items: [
      { q: 'DOCX/XLSX असल में क्या हैं?', o: ['ZIP (XML files)', 'plain text', 'image', 'MP4 container'], a: 0,
        ex: 'Office XML फ़ाइलें ZIP-आधारित container में बंडल होती हैं — zip से खोलकर XML देख सकते हैं।' },
      { q: 'Normal delete के बाद data का क्या होता है?', o: ['blocks पर तब तक बचा जब तक overwrite न हो', 'तुरंत मिट जाता है', 'RAM में जाता है', 'cloud पर चढ़ता है'], a: 0,
        ex: 'सिर्फ़ index/MFT entry हटती है; data free-space में recovery-योग्य (HDD)।' },
      { q: 'SSD पर recovery कठिन क्यों?', o: ['TRIM खाली blocks को wipe करता है', 'SSD में data नहीं रहता', 'file system नहीं होता', 'पासवर्ड लग जाता है'], a: 0,
        ex: 'FS द्वारा खाली declared blocks को SSD <b>TRIM</b> से बाद में साफ़ कर देता है।' },
      { q: 'Hash और Encryption में मूल अंतर?', o: ['Hash one-way, Encryption reversible (key से)', 'दोनों same', 'Hash तेज़ decrypt', 'Encyption fingerprint'], a: 0,
        ex: 'Hash fixed-length fingerprint (reverse नहीं); Encryption key से decrypt-योग्य।' },
      { q: 'H.265 और H.264 की तुलना में?', o: ['H.265 अधिक दक्ष (लगभग आधा bit-rate)', 'H.264 बेहतर', 'दोनों एक', 'H.265 open royalty-free'], a: 0,
        ex: 'H.265/HEVC बेहतर compression; AV1 open+royalty-free।' },
      { q: 'Sync vs Backup?', o: ['Sync ग़लती/डिलीट भी फैलाता; Backup versioned+offline', 'दोनों same', 'Backup mirror', 'Sync सुरक्षित मिटाई'], a: 0,
        ex: 'Sync≠Backup — यही cloud का मुख्य परीक्षा-प्रश्न।' },
      { q: 'किसी और के work drive पर करना?', o: ['व्यावहारिक experiments/recovery-wipe बिल्कुल न करें', 'quick format कर देना', 'recovery tool चलाना', 'छेड़-छाड़ ठीक'], a: 0,
        ex: 'non-ethical+vहमला/नुक़सान; सिर्फ़ own/permitted data पर वैध रिकवरी।' },
      { q: 'TLS certificate chain का क्रम?', o: ['Leaf → Intermediate → trusted Root CA', 'Root → Leaf → user', 'user → root', 'कोई chain नहीं'], a: 0,
        ex: 'server/leaf cert → intermediate → OS/browser के trust-store का root CA।' }
    ] },

    { type: 'labs', items: [
      { n: 135, title: 'पासफ्रेज़ + Password Manager + 2FA सेटअप',
        aim: 'एक मज़बूत passphrases बनाकर password manager में स्टोर करना और एक खाते पर app-based 2FA चालू करके credential-stuffing रक्षा समझना।',
        tools: ['फ़ोन/PC', 'कोई password manager (Bitwarden/KeePass/1Password/browser vault)', 'एक email/social खाता 2FA के लिए'],
        steps: ['4–6 शब्दों का यादगार passphrases बनाइए और master पासवर्ड से अलग रखिए', 'manager में हर service के लिए unique पासवर्ड जनरेट कीजिए', 'एक test खाते पर authenticator-app से 2FA चालू कीजिए', 'recovery codes को offline vault/print में सुरक्षित कीजिए', 'साफ़ device से logged-in devices जाँचकर suspicious sign-out कीजिए'],
        result: 'लिखिए: आपका entropy-अनुमान, कितने खातों में unique pass + 2FA लगा, और recovery कहाँ रखा। (अपने खातों पर ही करें।)' },

      { n: 136, title: 'फ़ाइल एक्सटेंशन धोखा पहचानना',
        aim: 'View → extensions चालू करके dual-extension व मालवेयर-जैसी नामकरण पहचानना।',
        tools: ['Windows PC (file extensions दिखाने की सेटिंग)', 'कुछ sample/बने-हुए test फ़ाइल-नाम'],
        steps: ['Explorer → View → Show → File name extensions चालू कीजिए', 'एक test फ़ाइल का नाम <code>report.pdf.exe</code> जैसा बनाइए (चलाने के लिए नहीं — पहचानने के लिए)', 'छिपी फ़ाइलें भी View → Hidden items से दिखाइए', 'बताइए कौन-सा extension असली प्रकार बताता है और क्यों खतरनाक'],
        result: 'लिखिए: dual-extension क्यों धोखा है, असली extension कौन-सा, और "Show extensions" का लाभ।' },

      { n: 137, title: 'Windows Firewall से inbound/outbound rule',
        aim: 'किसी एक जानी-पहचानी app को Private/Public profile पर allow/deny करके inbound/outbound नियम समझना।',
        tools: ['Windows Defender Firewall with Advanced Security (wf.msc)', 'कोई एक app'],
        steps: ['एक नियम बनाइए: Program/Port पर Inbound allow (सिर्फ़ Private)', 'उसी app के लिए Outbound rule देखिए', 'Profile (Domain/Private/Public) का अंतर नोट कीजिए', 'जाँच के बाद test rule हटाकर पहले जैसा कर दीजिए'],
        result: 'लिखिए: inbound vs outbound का फ़र्क़, profile का प्रभाव, और कब/क्यों नियम चाहिए। (सिर्फ़ अपना PC व जानी app; सिस्टम services न छेड़ें।)' },

      { n: 138, title: 'Wi-Fi security व public Wi-Fi जोखिम जाँच',
        aim: 'अपने router की security (WPA2/WPA3, admin pass, WPS) देखना और open Wi-Fi पर VPN/2FA व्यवहार समझना।',
        tools: ['घर का router admin UI', 'एक Android/Win device, कोई reputable VPN (optional)', 'एक test खाता'],
        steps: ['router में security mode WPA2-AES/WPA3, strong PSK, WPS OFF, firmware update जाँचिए', 'एक open Wi-Fi पर बिना-VPN vs VPN/2FA का नज़रिया समझिए (असली पेमेंट/OTP डाले बिना)', 'SIM-PIN व device encryption (फ़ोन) चालू कीजिए', 'अनजान QR/छोटा link दबाने का ख़तरा दोहराइए'],
        result: 'लिखिए: आपके router की setting, public Wi-Fi पर कौन-कौन सावधानी, और VPN क्या/क्या नहीं रोकता।' },

      { n: 139, title: 'एंटीवायरस स्कैन — Defender + on-demand',
        aim: 'Windows Defender (real-time) + एक on-demand scan चलाकर quarantine/log समझना।',
        tools: ['Windows Security app', 'एक test/संदिग्ध-नहीं फ़ाइल या EICAR test string (केवल AV-verify हेतु, निर्देशानुसार)'],
        steps: ['Windows Security → Virus & threat → scan options देखिए (Quick/Full/Offline)', 'एक manual scan चलाइए और result/log नोट कीजिए', 'quarantine/protected items का मतलब समझिए', 'real-time protection बंद/चालू (केवल तदर्थ demo) का असर देखिए'],
        result: 'लिखिए: signature/behavioural detection का संकेत, quarantine क्या करता है, और क्यों दो real-time AV एकसाथ नहीं।' },

      { n: 140, title: 'ZIP vs RAR/7Z vs tar.gz compression तुलना',
        aim: 'एक ही folder को अलग format में compress करके ratio व "already-compressed media" का असर मापना।',
        tools: ['7-Zip (Win) / tar+gzip (Linux)', 'test folder (text/doc + एक mp4/jpg)'],
        steps: ['text/doc-only folder का ZIP, 7Z बनाइए — साइज़ नोट', 'एक वीडियो/फ़ोटो folder पर वही करें — लगभग बदलाव नहीं दिखेगा', 'Linux पर <code>tar czf</code> vs plain <code>tar</code> तुलना', '<code>ratio = मूल/संकुचित</code> निकालकर तालिका'],
        result: 'लिखिए: कहाँ compression लाभकारी (text) कहाँ बेकार (media) और ratio। (सिर्फ़ अपने sample folder पर।)' },

      { n: 141, title: 'Password-protected + split archive',
        aim: 'एक archive को password (AES-256) + header-encrypt करके split बनाना और सीखना कि यह सबूत/रक्षा व AV-scan limitation दोनों है।',
        tools: ['7-Zip/WinRAR', 'छोटी test files', 'एक दूसरा device (verify हेतु)'],
        steps: ['7-Zip में create → format 7z, AES-256, encrypt file names, split size डालिए', 'भागों को एक साथ रखकर extract करके verify कीजिए', 'चर्चा: AV protected archive scan नहीं कर पाता — इसलिए अनजान source से न चलाना', 'पासवर्ड अलग चैनल से भेजने का अभ्यास (नक़ली scenario)'],
        result: 'लिखिए: split/extract प्रक्रिया, header encryption का फ़ायदा और AV-बचाव का सरोकार।' },

      { n: 142, title: 'Hash (SHA-256) से download integrity',
        aim: 'किसी official download (ISO आदि) का SHA-256 गणना करके निर्माता के बताए hash से मिलाकर integrity जाँचना।',
        tools: ['Windows: certutil / Linux: sha256sum', 'आधिकारिक site का प्रकाशित checksum'],
        steps: ['एक official installer/ISO download कीजिए', 'अपने OS का tool चलाकर hash निकालिए', 'site के hash से अक्षर-दर-अक्षर मिलाइए', 'एक byte भी बदलने पर hash कैसे बदलता है — समझाइए (avalanche)'],
        result: 'लिखिए: मिला/न मिला, hash का उपयोग (integrity) और hash ≠ encryption। (किसी के hash छेड़कर fraud न करना।)' },

      { n: 143, title: 'PDF से work — merge/split/print-to-PDF/password',
        aim: 'किसी app से "Print to PDF", PDFs जोड़ना/तोड़ना और password/permission से संरक्षित करके secure-share समझना।',
        tools: ['Windows Print to PDF / एक PDF tool', 'कुछ sample pages'],
        steps: ['एक doc/image से PDF बनाइए', 'दो PDFs merge और एक PDF split कीजिए', 'document को open/copy/print permission + password दीजिए', 'embedded link/attachment से सावधानी (malware vector) दोहराइए'],
        result: 'लिखिए: PDF workflow, permissions का अर्थ, और अजनबि PDF scan क्यों ज़रूरी।' },

      { n: 144, title: '3-2-1 offline backup + restore test',
        aim: 'कम-से-कम 3 copies, 2 media, 1 offline/cloud पर रखकर एक फ़ाइल की actual restore-test करके backup को सच बनाना।',
        tools: ['एक external drive', 'cloud service (Google/OneDrive/Dropbox) या दूसरा drive', 'restore check list'],
        steps: ['एक ज़रूरी folder primary + drive पर backup + cloud पर backup', 'offline copy (drive unplugged) रखिए', 'random एक फ़ाइल restore करके verify कीजिए', 'schedule (weekly/monthly) बनाइए'],
        result: 'लिखिए: आपकी 3-2-1 plan, कहाँ offline copy, और restore-test का result। (Sync ≠ backup समझाइए।)' },

      { n: 145, title: 'किसी गलती से deleted फ़ाइल की recovery (अपने sample drive पर)',
        aim: 'एक छोटी <b>अपनी</b> test file delete करके Recycle Bin empty करके, recovery tool से वापस लाना और SSD/HDD अंतर समझना।',
        tools: ['एक पुराने/सस्ते HDD या test USB (SSD पर अंतर नोट)', 'Recuva/PhotoRec/R-Studio/DMDE (अपने data के लिए)', 'एक अलग drive destination'],
        steps: ['test folder बनाकर कुछ doc/photo रखिए, delete + bin empty', 'उसी drive पर कुछ <b>न लिखें</b>', 'recovery tool को <b>दूसरी</b> drive पर install/scan करवाइए', 'found files को दूसरी drive पर save करके खोले/validate', 'SSD पर TRIM के कारण अंतर चर्चा'],
        result: 'लिखिए: recovery की संभवता, "लिखना रोकें" का नियम, और HDD vs SSD फ़र्क़। (सिर्फ़ अपना sample data; किसी और का drive छूना वर्जित।)' },

      { n: 146, title: 'Crypto-erase / secure wipe (पहचान-अभ्यास)',
        aim: 'बेचने-से-पहले disk पर safe wipe के विकल्प समझना — BitLocker/LUKS key-erase, secure erase, multi-pass (सिर्फ़ test/अपनी disk)।',
        tools: ['एक पुरानी/बेचने-वाली test disk', 'BitLocker/LUKS या vendor secure-erase tool'],
        steps: ['पहले data backup करें; फिर encryption ON (BitLocker/LUKS) कीजिए', 'crypto-erase (key wipe) से data unreadable करना समझिए', 'HDD पर multi-pass/SSD पर Secure-erase/NVMe sanitize विकल्प पहचानिए', 'एक पुरानी test disk पर ही प्रक्रिया demo/verify करें'],
        result: 'लिखिए: quick format vs secure erase का फ़र्क़, SSD पर crypto-erase क्यों बेहतर, और recovery-रोक का आधार। (कभी किसी के/कामकाजी work drive पर न करें।)' },

      { n: 147, title: 'Incident response drill — संक्रमण simulate/plan',
        aim: 'एक <b>safe tabletop drill</b> में isolate→scan→दूसरे device से pass बदलें→report→restore क्रम का अभ्यास।',
        tools: ['कोई असली malware नहीं — एक काल्पनिक scenario sheet', 'नोटपैड checklist'],
        steps: ['Scenario पढ़िए (phishing से ransomware लक्षण)', 'क्रम लिखिए: network off → clean-device पर scan → दूसरे device से pass+2FA → 1930/cybercrime.gov.in report → offline backup से restore', 'ग़लत प्रतिक्रियाएँ (पैसे देना, फ़ाइलें delete करना) चिह्नित कीजिए', 'अपनी family/shop के लिए 1-page plan बनाइए'],
        result: 'लिखिए: आपका isolate→scan→change→report→restore plan और पहले-रोकथाम checklist।' },

      { n: 148, title: 'Phishing link/OTP छल पहचान अभ्यास',
        aim: 'अलग-अलग फ़र्ज़ी email/SMS/QR के नमूने देखकर डोमेन, typosquatting, त्वरा व OTP-माँग पहचानना और सही जवाब अभ्यास।',
        tools: ['छात्र-संग्रहित/बनाए गए sample messages', 'कैलकुलेटर नहीं — सिर्फ़ आँख/जाँच'],
        steps: ['हर sample में sender domain, typosquat (paypa1), urgency, OTP/CVV/QR माँग ढूँढिए', '"सबसे पहले क्या करोगे?" लिखिए (फ़ोन काटो, खुद official number पर वापस कॉल)', 'एक own test लिंक भेजकर जाँच-अभ्यास (permission से)', '"OTP कभी न दें" शपथ-नियम लिखिए'],
        result: 'लिखिए: पहचाने red-flag, सही reaction, और अपने चारपास के लोगों को समझाने का तरीक़ा।' },

      { n: 149, title: 'साबूत/रिपोर्टिंग mock फ़ाइल (reporting drill)',
        aim: 'एक काल्पनिक cyber-fraud पर रिपोर्ट फ़ाइल बनाकर evidence (screenshot/txn/URL/SMS) और complaint flow समझना।',
        tools: ['नोटपैड/टेम्पलेट', 'काल्पनिक transaction/screenshot sample (असली निजी डेटा नहीं)'],
        steps: ['Scenario (जाली parcel link से OTP leaked) चुनिए', 'timeline + सबूत तालिका बनाइए (kya, kab, kahan)', '1930 व cybercrime.gov.in flow नोट करें (mock; असली में तुरंत)', 'बैंक notification + FIR/cyber-cell का प्लान लिखिए'],
        result: 'लिखिए: आपकी report file + शीघ्र-reporting क्यों (money-recovery) और सबूत संभालने का तरीक़ा। (यह अभ्यास है, असली शिकायत तुरंत police/portal से।)' }
    ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा-तथ्य (exam) — डायरेक्ट उत्तर', html: '<p><b>1)</b> Windows में नाम में नहीं चलते: <code>&lt; &gt; : " / \\ | ? *</code> व reserved (CON/COM1…)। <b>2)</b> Linux case-sensitive, Windows अक्सर नहीं। <b>3)</b> tar = संग्रह, gzip = संपीड़न; tar.gz दोनों। <b>4)</b> WAV/FLAC audio lossless, MP3/AAC lossy; PNG/ZIP/DOCX lossless, JPEG/MP3/H.26x lossy। <b>5)</b> Delete=index हटना; TRIM=SSD recovery कठिन। <b>6)</b> Hash one-way; TLS hybrid + cert-chain; signature=private sign/public verify। <b>7)</b> E2E=server decrypt नहीं। <b>8)</b> 3-2-1=3 copies·2 media·1 offsite। <b>9)</b> BitLocker↔Windows, LUKS↔Linux। <b>10)</b> cybercrime.gov.in + 1930; फिरौती न दें।</p>' }
  ]
}

]);
/* ============================ अंत ============================ */
