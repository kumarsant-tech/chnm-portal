/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-office1.js   (MS Office मास्टरक्लास — भाग 1)
   विषय : off-intro · off-word
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   1. MS Office व Microsoft 365 परिचय
   =================================================================== */
{
  id: 'off-intro', icon: '📊', group: 'MS Office मास्टरक्लास',
  title: 'MS Office व Microsoft 365 परिचय',
  sub: 'सूट के ऐप्स, संस्करण, इंस्टॉल/एक्टिवेशन, फ़ाइल फ़ॉर्मैट व साझा UI',
  kicker: 'Office Masterclass 1 · The Suite & Its Files',
  hero: 'यह पेज Office सूट की पूरी पहचान सिखाता है — कौन-सा ऐप क्या करता है, कौन-सा संस्करण कब आया और उसमें Ribbon/फ़ाइल फ़ॉर्मैट जैसी क्या चीज़ बदली, subscription (Microsoft 365) बनाम one-time Office 2024 में असली फ़र्क़, portal से इंस्टॉल/एक्टिवेट कैसे हो, .docx/.xlsx/.pptx आदि एक्सटेंशन का मतलब, तीनों ऐप्स में एक-से दिखने वाला UI (Ribbon, Backstage), और सहकार्य (co-authoring) व Hindi टाइपिंग। CCC/NIMI के Office प्रश्न इन्हीं आठ सिरों से बनते हैं।',
  tags: ['सूट के ऐप्स', 'संस्करण इतिहास', '365 बनाम 2024', 'इंस्टॉल/Activation', 'फ़ाइल फ़ॉर्मैट', 'co-authoring'],
  blocks: [

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.1</span> MS Office क्या है — एक ही सूट, कई ऐप्स</h3>
      <p><b>Microsoft Office</b> (2020 से ब्रांड का नाम <b>Microsoft 365</b>) एक <b>productivity suite</b> है — दस्तावेज़ बनाने, गिनती/ग्राफ़, प्रस्तुति, ईमेल, नोट व डेटाबेस एक-दूसरे से जुड़कर करते हैं। एक ही फ़ाइल एक ऐप में बनकर दूसरे में जा सकती है (Word में Excel चार्ट, PowerPoint में Word सूची)।</p>
      <ul>
        <li><b>“आपका Office” पहचानने का क्रम:</b> कोई भी ऐप खोलकर <b>File → Account</b> देखिए — वहाँ उत्पाद का नाम (Microsoft 365 / Office Home &amp; Student 2024), license type और <b>Version</b> (जैसे 16.0.1433x) लिखा है। यही सर्विस सेंटर/कॉलेज में सही जवाब है।</li>
        <li><b>सबमें सॉफ़्टवेयर संस्करण 16.x:</b> Office 2016, 2019, 2021, 2024 LTSC और Microsoft 365 — सबका internal build <b>16.0</b> है। बाहरी नाम अलग है, कोड एक ही डीएनए। यही कारण है कि फ़ाइल फ़ॉर्मैट और Ribbon लगभग एक-से हैं।</li>
        <li><b>Web/mobile बनाम desktop:</b> <b>Microsoft 365 on the web</b> (Word/Excel/PPT) फ़्री में भी चलते हैं पर macros/field editing/mail merge जैसी चीज़ें कम हैं। Mobile (iOS/Android) और भी सीमित। सिखाते समय यह भेद ज़रूर बताएँ।</li>
      </ul>` },

    { type: 'table', head: ['ऐप', 'मुख्य काम (क्या बनता है)', 'किसको ज़रूर सिखाना', 'NIMI/CCC में पूछा जाता है?'],
      rows: [
        ['Word', 'दस्तावेज़ (document) — लेटर, रिपोर्ट, प्रश्न-पत्र, किताब', 'हर बैच (ITQ/CCC का केंद्र)', 'हाँ — सबसे ज़्यादा'],
        ['Excel', 'वर्कशीट/वर्कबुक — गणना, फ़ॉर्म्युला, चार्ट, डेटाबेस-जैसी छँटनी', 'दफ़्तर/बुकिंग/डाटा ऑपरेटर', 'हाँ'],
        ['PowerPoint', 'प्रस्तुति (slide deck), एनिमेशन, रिकॉर्डिंग', 'शिक्षक/सेल्स/छात्र', 'हाँ'],
        ['Outlook', 'ईमेल, कैलेंडर, संपर्क, कार्य-सूची (desktop mail client)', 'दफ़्तर, अकाउंटेंट', 'हाँ (विशेषकर desktop Outlook)'],
        ['OneNote', 'अनलिमिटेड नोटबुक — टैब/पेज, रिकॉर्डिंग, स्क्रीन-क्लिप', 'छात्र/अध्यापक', 'कभी-कभी'],
        ['Access', 'रिलेशनल डेटाबेस (.accdb) — टेबल, क्वेरी, फ़ॉर्म, रिपोर्ट', 'DCA/सॉफ़्टवेयर बैच, छोटा inventory', 'हाँ (Windows-only ऐप)'],
        ['Publisher', 'डेस्क-टॉप पब्लिशिंग — न्यूज़लेटर, पोस्टर, brochure', 'प्रिंट-मीडिया छोटा काम', '<b>Oct 2026 के बाद support/bundling बंद</b> — नई बैच में Word/PPT/Forms सिखाएँ'],
        ['Microsoft Forms', 'ऑनलाइन क्विज़/सर्वेक्षण/रजिस्ट्रेशन, तुरंत ग्राफ़', 'परीक्षा/फ़ॉर्म भरवाना', 'कभी-कभी'],
        ['Microsoft Teams', 'चैट, मीटिंग, फ़ाइल शेयर, क्लास (Teams for Education)', 'ऑनलाइन क्लास', 'हाँ (को-पॉर्ड अवधारणा)'],
        ['Visio', 'डायग्राम/फ़्लोचार्ट/नेटवर्क मैप (.vsdx)', 'IT/नेटवर्किंग बैच', 'Visio desktop 2024 LTSC + Visio Plan 1/2 (subscription) — अलग लाइसेंस'],
        ['Project', 'गैंट चार्ट, टास्क शेड्यूल, resource', 'मैनेजमेंट/DCA', 'Project Standard/Professional + Project Plan (subscription)'],
        ['Microsoft Loop', 'नए collaborative workspaces व components (365)', 'टीम नोट्स', 'नया ऐप — अभी सिलेबस में कम'],
        ['Clipchamp', 'ऑनलाइन वीडियो एडिटिंग (अब Windows 11 में built-in)', 'बनाई हुई प्रस्तुति/रील', 'छोटा परिचय'],
        ['Stream (on SharePoint)', 'संगठन के अंदर वीडियो होस्टing/शेयर (Teams/OneDrive के साथ)', 'क्लास रिकॉर्डिंग', 'पूरा नाम जानो'],
        ['Delve', 'Microsoft 365 में संगठनीय फ़ाइल/people discovery', 'पुराना tenant', '<b>2024 से retired</b> — आज नई फ़ीचर मत बनाइए'],
        ['OneDrive / SharePoint', 'क्लाउड स्टोरेज व टीम साइट — co-authoring यहीं संभव है', 'हर बैच (share सिखाने)', 'हाँ — बहुत ज़रूरी']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.2</span> संस्करण इतिहास (Version History) — हर संस्करण में क्या बदला</h3>
      <p>इतिहास रटने का सूत्र — <b>हर बड़ा संस्करण एक नई चीज़ लाया:</b> 97 = Assistant/Clip, 2007 = Ribbon + .docx, 2010 = Backstage, 2013 = touch + सच co-authoring, 2016 = cloud-default, फिर सबको subscription (365) ने निगल लिया।</p>` },

    { type: 'table', head: ['संस्करण', 'वर्ष', 'भीतर का संस्करण', 'इसमें क्या बदला (याद रखने लायक)'],
      rows: [
        ['Office for Mac (पहला)', '1989 (घोषणा 1988)', '1.x', 'पहला Office — Word + Excel + File Manager Mac Classic पर; “Office” नाम यहीं से'],
        ['Office for Windows', '1990', '—', 'पहला Windows Edition — Word + Excel + PowerPoint + Mail; MS-DOS/Win3.x'],
        ['Office 3.0', '1992', '—', 'Windows 3.1 पर पहला लोकप्रिय संस्करण; Access जोड़ा (Windows), Clipboard Manager'],
        ['Office 95', '1995', '7.0', 'पहला 32-bit Windows 95 Suite; Outlook 4.0; हर ऐप 32-bit'],
        ['Office 97', '1997', '8.0', 'Clippy/Office Assistant, VBA एकजुट, Command bar; SR-1 (1998) व SR-2 (Aug 1998) पचे'],
        ['Office 2000', '1999', '9.0', 'Windows Installer (MSI) + Multi-user install, Web features, Outlook 2000, Clipboard 12 items'],
        ['Office XP', '2001 (2002 भी कहते)', '10.0', 'Task Panes, Recovery, AutoComplete; पहला activation (WPA); Outlook hotmail integration'],
        ['Office 2003', '2003', '11.0', 'अंतिम classic-menu वाला; InfoPath, Outlook Cached Exchange Mode, XML features; last MSI-only युग'],
        ['Office 2007', 'जनवरी 2007', '12.0', '<b>Ribbon UI</b> + <b>Open XML फ़ाइलें (.docx/.xlsx/.pptx)</b> + SmartArt; यही आज की UI की जड़'],
        ['Office 2010', '2010', '14.0', '<b>Backstage view</b> (File), File-protect password, co-authoring की शुरुआत (OneDrive/Word 2010 viewer), first free viewer'],
        ['Office 2013', '2012/13', '15.0', 'Flat/touch UI, live personas, सच्चा real-time co-authoring, Click-to-Run install, iPad/Android apps'],
        ['Office 2016', '2015', '16.0', 'Cloud Save डिफ़ॉल्ट, बेहतर co-authoring, Skype for Business; पहला Common License सब प्लैटफ़ॉर्म'],
        ['Office 2019', 'सित 2018', '16.x', 'Perpetual (LTSC) — MS account बिना चले; Dark Mode, नए Excel फ़ंक्शन (XLOOKUP नहीं, वह 365)'],
        ['Office 2021 (LTSC)', 'अक्टू 2021', '16.x', 'Perpetual + LTSC; Windows 10/11; 5 साल support; फिर भी 2024 के बाद security-only'],
        ['Office 2024 (LTSC)', 'अक्टू 2024', '16.0 (LTSC)', 'नवीनतम one-time: OneDrive sync UI, नए फ़ंक्शन, Dark Mode बेहतर; Windows 11/10; 5-yr main + security'],
        ['Microsoft 365 (subscription)', '2020 से नाम; 2011 से Office 365', 'सतत (continuous)', 'हर महीने/साल features + cloud + 1 TB OneDrive; desktop+web+mobile; सबसे ज़्यादा update'],
        ['Microsoft 365 on the web', '2014 (Office Online) से', 'Web', 'फ़्री (MS account पर) Word/Excel/PPT/OneNote/Outlook — browser में, सीमित features'],
        ['Mobile apps (iOS/Android)', '2013–19 से', '—', 'Free to view; edit बड़ा फ़ोन पर subscription माँगता है (screen &gt; ~10.1")']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.3</span> लाइसेंसिंग मॉडल — subscription बनाम perpetual, और कॉलेज क्या चुने</h3>
      <p>Office ख़रीदने के दो ही रास्ते हैं — <b>Microsoft 365 (subscription, चालू रखना पड़ता है)</b> या <b>perpetual one-time Office 2024 (एक बार पैसे, कोई नया feature नहीं)</b>। चुनाव इसी पर है:</p>
      <ul>
        <li><b>हर साल बदलती लैब + ठीक इंटरनेट →</b> Microsoft 365: एक अकाउंट से सारी मशीनें, Teams/OneDrive जुड़े; पर हर साल शुल्क।</li>
        <li><b>बजट/offline/पुराने PC →</b> Office LTSC 2024: KMS से volume activate, subscription नहीं, features थोड़े पुराने।</li>
        <li><b>सिर्फ़ पढ़ाना-लिखाना, 1 मशीन, email नहीं चाहिए →</b> Home &amp; Student 2024 (इसमें Outlook नहीं — Outlook सिखाना हो तो ग़लत योजना)।</li>
        <li><b>offline use:</b> subscription भी offline चलता है पर हर ~30 दिन एक बार license re-check (intranet); perpetual हमेशा offline।</li>
        <li><b>cost behaviour:</b> subscription बंद हुआ तो ऐप्स <b>read-only/reduced-functionality</b> में आते हैं; perpetual कभी बंद नहीं पर नया feature नहीं मिलता।</li>
      </ul>` },

    { type: 'table', head: ['योजना (Plan)', 'डिस्कटॉप ऐप्स?', 'कितने डिवाइस', 'OneDrive', 'Outlook?', 'कीमत का बर्ताव / कब चुनें'],
      rows: [
        ['Microsoft 365 Personal', 'हाँ (Win/Mac + web/mobile)', '1 व्यक्ति — साइन-in कई पर एक साथ चलाएँ (अक्सर ~5 active)', '1 TB', 'हाँ (personal mailbox)', 'सालाना/मासिक; एक व्यक्ति, ताज़ा features + cloud चाहता हो'],
        ['Microsoft 365 Family', 'हाँ', 'अधिकतम 6 व्यक्ति (हर एक का अपना 1 TB)', '6 × 1 TB = 6 TB', 'हाँ', 'परिवार/छोटी लैब; सबसे ज़्यादा जगह; 6 लोगों तक सस्ता पड़ता है'],
        ['Microsoft 365 Business Basic', 'ना — सिर्फ़ web + mobile', '5 डिवाइस/यूज़र', '1 TB', 'हाँ (business email included)', 'सस्ता, जहाँ डिस्कटॉप ऐप्स नहीं चाहिए — दफ़्तर का वेब क्लर्क'],
        ['Microsoft 365 Business Standard', 'हाँ (Win/Mac) + web', '5 डिवाइस/यूज़र', '1 TB', 'हाँ', 'छोटा दफ़्तर/ITI जो desktop+email+web तीनों चाहे'],
        ['Microsoft 365 Business Premium', 'हाँ + web', '5 डिवाइस/यूज़र', '1 TB', 'हाँ', 'Business Standard + Intune/Entra ID security — जहाँ PC प्रबंधन/डिवाइस policy चाहिए'],
        ['Office Home & Student 2024 (perpetual)', 'हाँ — Word/Excel/PPT only', '1 PC या Mac', '5 GB (subscription वाला 1 TB नहीं)', 'ना — Outlook नहीं', 'एक बार पैसे, कोई email/आवर्ती शुल्क नहीं; छात्र/घर के लिए'],
        ['Office Home &amp; Business 2024 (Win only)', 'हाँ — + Outlook', '1 PC', '5 GB (आम तौर पर)', 'हाँ', 'छोटा दुकानदार जो सालाना शुल्क नहीं देना चाहता, email चाहिए'],
        ['Office LTSC 2024 (Standard/Professional)', 'हाँ (volume/perpetual)', '1 device/licence', 'कोई cloud नहीं', 'Standard: हाँ; Pro: + Publisher/Access', 'बड़ा संस्थान जो offline/air-gapped रखना चाहे — KMS/MAK activation']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.4</span> इंस्टॉल — Click-to-Run बनाम MSI, 32/64-बिट, “This account can’t install”</h3>
      <p>आज का Office लगभग हमेशा <b>Click-to-Run (C2R)</b> से इंस्टॉल होता है; MSI सिर्फ़ पुराने volume deployments में था। यह दोनों का अंतर और bit चुनने का नियम ज़रूरी है।</p>` },

    { type: 'table', head: ['विषय', 'Click-to-Run (C2R / Office 2013+)', 'MSI (Windows Installer — legacy)'],
      rows: [
        ['कैसे आता है', 'portal.office.com / Office setup.exe → streaming install', 'CD/कस्टम admin image; Office 2010 और पुराने'],
        ['फ़ाइलें कहाँ', '<code>C:\\Program Files\\Microsoft Office\\root</code> (virtualized)', 'seeded classic path; System32 में shared components'],
        ['Update', 'खुद (Automatic Update), service <code>ClickToRunSvc</code>', 'Windows Update/manual; अब deprecated'],
        ['Repair', 'Quick/Online Repair (Setup.exe /configure या Programs→Modify)', 'Add/Remove features से'],
        ['आज स्थिति', 'सब subscription और LTSC 2024 C2R पर; MSI पूरी तरह हटा', 'सिर्फ़ पुराने एंटरप्राइज़ images में मिलता है'],
        ['32/64-bit का असली नियम', 'अब डिफ़ॉल्ट <b>64-bit</b>। <b>32-bit</b> तभी चुनें जब कोई पुराना ActiveX control, 32-bit-only add-in, या <code>Access</code> पर आधारित 32-bit COM/OLAP हो; ActiveX व कुछ legacy add-in 64-bit में नहीं चलते। 64-bit ज़्यादा RAM (4 GB से ऊपर) वाला डेटा Excel में बेहतर चलाता है', '64-bit/32-bit अलग installer; mix मत रखिए — एक machine पर एक ही bit class']
      ] },

    { type: 'steps', items: [
      { n: 1, title: 'portal.office.com पर साइन इन', text: 'उसी Microsoft work/school या personal अकाउंट से लॉगिन कीजिए जिस पर license लटकता है। ऊपर-दाएँ <b>Install apps</b> दिखेगा।' },
      { n: 2, title: 'अपना device व bit चुनिए', text: '<b>Install apps → Other/Language &amp; install options</b> में भाषा (Hindi/English) और 64-bit (सुझाया) चुनिए; पहले से कोई दूसरी bit-install है तो हटाइए।' },
      { n: 3, title: 'setup.exe चलाइए', text: 'Click-to-Run installer फ़ाइलें streaming में लाएगा। इंस्टॉलर खोलने पर UAC “Yes” दें। इंस्टॉल <code>root</code> फ़ोल्डर में होता है।', tips: 'इंटरनेट ठीक रहे तो ही टिके — C2R download होता है।' },
      { n: 4, title: 'एक्टिवेशन के लिए फिर से साइन इन', text: 'पहली बार कोई ऐप (Word) खोलकर <b>Sign in</b> करें — license account से जुड़ा होने पर “Product Activated” आ जाता है।', warn: 'अगर “This account can’t install Office” आए — मतलब उस अकाउंट पर Office-installable license नहीं या admin ने <b>Services &amp; add-ons → Install &amp; other</b> बंद किया है (business tenant)।' },
      { n: 5, title: 'आख़िरी जाँच', text: '<b>File → Account</b> में उत्पाद-नाम + “Product Activated” + <b>About Word</b> में version/build। यही screenshot रजिस्टर में।' }
    ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.5</span> Activation व troubleshooting — key, account, KMS और कोड</h3>
      <p>Activation के तीन मॉडल हैं। उन्हें उलझाना ही सबसे बड़ी ग़लती है — पहले पहचानिए license किस पर टिका है।</p>` },

    { type: 'table', head: ['मॉडल', 'कैसे काम करता है', 'पहचान/संकेत', 'ट्रबलशूटिंग'],
      rows: [
        ['Product key (retail 25-char)', 'केंद्र पर एक बार redeem → account/device पर license', 'Account पर “Activated with a product key”', 'गलत region/type के key पर 0x80070002; redeem सीमा पार पर 0xC004C003'],
        ['Account-based licence (Microsoft 365)', 'license अकाउंट पर, sign-in से activate', 'Account पर email; कई device sign-in', 'सही email से साइन-इन नहीं हुआ = reduced mode; subscription expiry पर वही'],
        ['Volume — KMS (on-prem/edu)', 'client LAN के KMS host (port 1688) से activate, renew हर 180 दिन', '“Activated by your organization’s…”', 'KMS host न मिले → <b>0xC004F074</b>; <code>slmgr /ato</code>, firewall 1688'],
        ['Volume — MAK', 'एक बार server/key से activate (count-based)', 'MAK key, कभी-कभी offline', 'MAK limit ख़त्म पर 0xC004F033; <code>ospp.vbs /act</code> से retry'],
        ['Pre-activated (OEM, device-based)', 'Windows के साथ license BIOS/UMLT में', 'पहले boot पर ही activated', 'Hardware बदलने पर re-check; MSDN/retail key यहाँ लागू नहीं'],
        ['“Product activated temporarily”', 'यह सच्चा permanent activation नहीं — KMS/grace या unlicensed period', 'संदेश बार-बार; कुछ features lock', 'सही email sign-in / KMS renewal / genuine key से ठीक करें; pirate KMS-tool से बचें']
      ] },

    { type: 'table', head: ['कोड/लक्षण', 'मतलब (सार)', 'पहला समाधान'],
      rows: [
        ['0xC004F074 / “KMS host couldn’t be contacted”', 'KMS server नहीं मिला (edu/volume)', 'नेटवर्क/firewall port 1688 जाँचें; <code>slmgr /skms &lt;host&gt;</code> फिर <code>/ato</code>'],
        ['0xC004C003 / activation blocked', 'key invalid/blocked/गलत region', 'genuine key से redeem; retail key को volume से mix न करें'],
        ['0xC004E016 / license store corrupt', 'activation state टूटी', '<code>ospp.vbs /dstatus</code> पढ़ें; rearm सीमा में <code>ospprearm</code>, फिर re-activate'],
        ['0xC004F009 / too many re-arms', 'rearm limit ख़त्म', 'रिपेयर-इंस्टॉल या <code>/rearm:reset</code> (सीमित); बेहतर fresh install'],
        ['0xC101E413 / 0x8007000D “license not found”', 'licensing mailbox गड़बर या wrong email', 'सही <b>Licensing: This mailbox…</b> वाले अकाउंट से sign-in; tenant में <b>Assign license</b> जाँचें'],
        ['“Unlicensed product / reduced functionality”', 'subscription expired या activation नहीं', 'sign-in/subscription renew; फिर File→Account→Manage/Activate'],
        ['<b>Repair</b>: Quick बनाम Online', 'Quick = files check/reset; Online = reinstall जैसा', 'File→Account→<b>Update Options→…</b> नहीं; Control Panel→Programs→Office→<b>Change→Quick/Online Repair</b>'],
        ['Safe mode व <b>normal.dotm</b>', 'add-in/template दोष देखना', 'Win+R → <code>winword /safe</code>; बार-बार गड़बड़ पर <code>%appdata%\\Microsoft\\Templates\\normal.dotm</code> हटाकर reset'],
        ['Add-in conflict procedure', 'कौन-सा COM add-in गिरा रहा', 'File→Options→Add-ins→COM→Go, सारे uncheck → safe खुले तो एक-एक कर check'],
        ['Uninstall', 'साफ़ न हटने पर', 'Programs→Change; बाक़ी रहे तो <b>Microsoft Support &amp; Recovery Assistant (SaRA)</b> का Office uninstall/fix-licensing']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.6</span> फ़ाइल फ़ॉर्मैट — एक्सटेंशन का पूरा मानचित्र</h3>
      <p><b>x</b> का मतलब XML (zip-आधारित, सुरक्षित), <b>m</b> = macro-allowed, <b>t</b> = template, <b>s</b> = slideshow/binary। यह नियम याद रखिए तो हर एक्सटेंशन खुल जाता है।</p>` },

    { type: 'table', head: ['फ़ाइल', 'ऐप', 'क्या है / कब उपयोग', 'मैक्रो?'],
      rows: [
        ['.docx', 'Word', 'Word-processing दस्तावेज़ (ZIP/XML) — डिफ़ॉल्ट', 'नहीं'],
        ['.docm', 'Word', 'यही, पर VBA macro रख सकता है', 'हाँ'],
        ['.dotx / .dotm', 'Word', 'Template — नई फ़ाइल इसी से बनती है; dotm में macro', 'dotm: हाँ'],
        ['.xlsx / .xlsm', 'Excel', 'Workbook; xlsm macro-वाला', 'xlsm: हाँ'],
        ['.xlsb', 'Excel', '<b>Binary</b> workbook — बहुत बड़ा डेटा/पिवट तेज़ खुले', 'रख सकता है'],
        ['.xltx / .xltm', 'Excel', 'Template (normal/macro)', 'xltm: हाँ'],
        ['.csv', 'Excel', 'कॉमा--separated सादा टेक्स्ट डेटा — formatting/sheet नहीं बचती', 'नहीं'],
        ['.pptx / .pptm', 'PowerPoint', 'Presentation; pptm macro', 'pptm: हाँ'],
        ['.potx', 'PowerPoint', 'Presentation template', 'नहीं'],
        ['.ppsx', 'PowerPoint', 'Slideshow — खोलते ही run हो जाए', 'नहीं']
      ] },

    { type: 'table', head: ['फ़ाइल', 'ऐप/मॉडल', 'क्या है / क्यों (ग़ैर-ऑफ़िस व legacy)'],
      rows: [
        ['.pdf', 'सब (export)', 'Portable Document Format — हर जगह एक-से दिखे; edit मुश्किल (देखिए 1.6)'],
        ['.xps', 'Microsoft', 'XML Paper Specification — PDF जैसा fixed-layout, अब कम चलता'],
        ['.odt/.ods/.odp', 'OpenDocument (LibreOffice)', 'खुला मानक; Office खोल/सहेज सकता है — फ़ीचर थोड़े टूट सकते हैं'],
        ['.rtf', 'Rich Text', 'पुराना cross-platform formatting; फ़ॉन्ट-heavy, feature-कम'],
        ['.txt / .htm(.html)', 'Text / Web', 'बिना formatting / वेब पेज; Word HTML खोल-सहेज सकता है'],
        ['.pub', 'Publisher', 'Publisher दस्तावेज़ (देखिए 2026 नोट)'],
        ['.vsdx', 'Visio', 'Visio drawing (XML) — डायग्राम'],
        ['.accdb / .accdt', 'Access', '2007+ database व template (पुराना .mdb 2003)'],
        ['.msg', 'Outlook', 'एक ईमेल संदेश फ़ाइल में'],
        ['.pst', 'Outlook', 'Local mail/archive store (एक बड़ी फ़ाइल में folders+mail)'],
        ['.one / .onepkg', 'OneNote', 'नोटबुक पेज/सिंड्रिकेटेड bundle'],
        ['.doc / .xls / .ppt', 'Legacy (97–2003)', '<b>Binary OLE</b> — macro-malware का प्रमुख रास्ता, corruption ज़्यादा, co-authoring/कई नए feature नहीं; इसलिए “Save as .docx” व Protected View']
      ] },

    { type: 'callout', kind: 'info', title: 'सुरक्षित सहेजना व PDF — Protected View, Trust Center, PDF/A', html: `<ul><li><b>Protected View:</b> इंटरनेट/ईमेल से खुली फ़ाइल read-only sandbox में खुलती है; Mark of the Web (MOTW) यही ट्रिगर करता है। “Enable Editing” से बाहर आती है — अजनबी फ़ाइल पर जल्दी न दबाएँ।</li><li><b>Trust Center:</b> File→Options→Trust Center — macro setting, blocked file types, Protected View settings यहीं। <b>Macros</b> को “Disable with notification” रखें, “Enable all” कभी नहीं।</li><li><b>Password/Prem:</b> File→Info→Protect Document→<b>Encrypt with Password</b> (open), या <b>Restrict Editing / permissions (IRM/AIP)</b>; <b>Mark as Final</b> = संपादन-रोक संकेत (सुरक्षा नहीं)। Digital signature (Info/Add) authenticity देता है।</li><li><b>पुराने version के लिए:</b> File→Info→Check for Issues→<b>Check Compatibility</b> — क्या-क्या टूटेगा बताता है; फिर .doc/.xls में Save करें।</li><li><b>PDF:</b> File→Save As/Export→PDF — A4-ready; options में ISO <b>19005-1 (PDF/A)</b> long-term archiving व low-quality/standard। <b>Print to PDF</b> में bookmarks/hyperlinks कम बचते हैं।</li></ul>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.7</span> तीनों ऐप्स का साझा UI — Ribbon, Quick Access, Backstage</h3>
      <p>Word/Excel/PowerPoint का ऊपरी हिस्सा एक-सा है। एक बार समझ लीजिए तो तीनों में काम चलेगा।</p>` },

    { type: 'table', head: ['UI का हिस्सा', 'कहाँ/क्या', 'नियंत्रण/शॉर्टकट'],
      rows: [
        ['<b>Ribbon</b>', 'Tabs → Groups → Buttons; ऐप-विशिष्ट (Home/Insert/Layout…)', 'Ribbon minimize/expand <kbd>Ctrl+F1</kbd>'],
        ['Contextual tabs', 'केवल चुने चीज़ पर दिखे (Picture Format, Table Design, Shape Format)', 'हो/टेक्स्ट बॉक्स/चित्र select कीजिए'],
        ['<b>Quick Access Toolbar</b>', 'ऊपर-बाएँ Save/Undo…; customize करके कोई command जोड़ें', '<kbd>Alt</kbd>+1..9 उस बटन पर जाएँ'],
        ['<b>File → Backstage</b>', 'Info, New, Open, Save, Save As, Print, Share, Close, Account, Options', '<kbd>Ctrl+P</kbd>=Print, <kbd>F12</kbd>=Save As'],
        ['Title / Status bar', 'ऊपर फ़ाइल+ऐप; नीचे page/word count/zoom/view/notifications', 'Status bar right-click से items toggle'],
        ['Dialog launcher', 'Group के कोने का tiny arrow → पूरी dialog', 'जैसे Paragraph/Font की पूरी खिड़की'],
        ['Search / Tell me', 'ऊपर-बीच “Search” box (पहले Tell me)', '<kbd>Alt+Q</kbd> command खोजें, चलाने पर Enter'],
        ['Zoom + View buttons', 'नीचे-दाएँ slider व layout buttons (Print/Web/Read…)', '<kbd>Ctrl+scroll</kbd> zoom'],
        ['Theme/Colour', 'Design→Themes; File→Options→General→Office Theme (Dark/Colorful/White)', 'Dark Mode: 365/2021+ पर'],
        ['Language & proofing', 'File→Options→Language — Display/Authoring/proofing languages; “Match Office display”', 'Hindi proofing/Display यहीं जोड़ें (देखिए 1.9)']
      ] },

    { type: 'table', head: ['शॉर्टकट', 'क्या करे (तीनों ऐप्स में एक-सा)', 'शॉर्टकट', 'क्या करे'],
      rows: [
        ['<kbd>Ctrl+N</kbd>', 'नई फ़ाइल', '<kbd>Ctrl+P</kbd>', 'Print'],
        ['<kbd>Ctrl+O</kbd>', 'Open', '<kbd>Ctrl+S</kbd>', 'Save'],
        ['<kbd>Ctrl+Z</kbd>', 'Undo', '<kbd>Ctrl+Y</kbd>', 'Redo'],
        ['<kbd>Ctrl+A</kbd>', 'सब select', '<kbd>Ctrl+F</kbd>', 'Find (Word/Excel)'],
        ['<kbd>Ctrl+C</kbd>', 'Copy', '<kbd>Ctrl+V</kbd>', 'Paste'],
        ['<kbd>Ctrl+X</kbd>', 'Cut', '<kbd>Ctrl+B</kbd>', 'Bold'],
        ['<kbd>Ctrl+I</kbd>', 'Italic', '<kbd>Ctrl+U</kbd>', 'Underline'],
        ['<kbd>F1</kbd>', 'Help', '<kbd>F7</kbd>', 'Spell/Research'],
        ['<kbd>F12</kbd>', 'Save As', '<kbd>Ctrl+F1</kbd>', 'Ribbon minimize'],
        ['<kbd>Ctrl+H</kbd>', 'Replace (Word/Excel)', '<kbd>Alt+Q</kbd>', 'Search command'],
        ['<kbd>Alt</kbd>', 'KeyTips ( ribbon letters ) दिखाएँ', '<kbd>Ctrl+Shift+…</kbd>', 'Formatting/selection modifiers (ऐप अनुसार)']
      ] },

    { type: 'callout', kind: 'tip', title: 'Press Alt to show key tips — बिना माउस के चलाना', html: `<p><b><kbd>Alt</kbd></b> दबाने पर Ribbon पर छोटे अक्षर (KeyTips) दिखते हैं — <code>H</code>=Home, <code>N</code>=Insert आदि; उनके बाद का अक्षर दबाकर command चुनें। एक बार <kbd>Alt</kbd> दबाकर फिर से छोड़ने पर Ribbon focus। SkyTips/“Tell me” (<kbd>Alt+Q</kbd>) से command नाम टाइप करके सीधे चलाएँ — नई user को बहुत तेज़ लगता है। Accessibility के लिए File→Options→<b>Accessibility</b> व “Press Alt to show key tips” विकल्प रखें।</p>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.8</span> सहकार्य (Collaboration) — Share, co-authoring, OneDrive/SharePoint</h3>
      <p>“एक ही फ़ाइल पर कई लोग साथ में” = <b>co-authoring</b>। यह तभी चलता है जब फ़ाइल cloud (OneDrive/SharePoint) पर हो और format XML हो — नीचे पूरे नियम।</p>` },

    { type: 'table', head: ['विषय', 'नियम / क्या होता है', 'ध्यान रखें'],
      rows: [
        ['<b>Share</b> button', 'ऊपर-दाएँ; link/email से allow-edit/allow-view', 'link “Anyone” = सबको; “People in org”/specific-safe'],
        ['co-authoring की शर्त', 'फ़ाइल <b>OneDrive/SharePoint</b> पर हो, format <b>.docx/.xlsx/.pptx/.one</b>, सब साइन-in', 'local HDD या .doc/.xls/.ppt पर live co-authoring नहीं'],
        ['real-time presence', 'दूसरों का cursor/“X is editing…” दिखे; autosave ON', 'नेटवर्क धीमा = lag; “.doc” में editing lock (अन्य read-only)'],
        ['<b>Version history</b>', 'File→Info→Version History; किसी पुराने version को restore', '365 per-minute-ish snapshots; SharePoint majors/minors'],
        ['<b>Comments</b> + @mention', 'Review/Insert→New Comment; @name से उस व्यक्ति को notify + Assign task', 'resolve/unresolve; print comments optional'],
        ['OneDrive sync client + Files On-Demand', 'cloud icon सिर्फ़-online, green tick = offline available', '“Always keep on this device” से offline पढ़ें'],
        ['SharePoint permissions', 'Site→Members(Edit)/Visitors(Read)/Owners(Full); item-level break', 'link sharing tenant policy से सीमित हो सकता है'],
        ['Teams Files tab', 'channel/CHAT file SharePoint/OneDrive पर ही रहती है', 'Teams में खोलो = web/desktop Office खुले'],
        ['conflict क्या हो', 'एक ही file पर सच्चा live merge (server-side CRDT) — “conflict copy” नहीं बनती', 'per-user autosave; offline edits पर re-sync में merge'],
        ['sharing link expiry/password', 'Business/Enterprise पर set; SharePoint admin centre policy', 'personal OneDrive पर password-expiry link नहीं']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.9</span> सरकारी/कॉलेज दस्तावेज़ मानक व Hindi टाइपिंग</h3>
      <p>हिंदी-माध्यम संस्थान में <b>Devanagari टाइपिंग अनिवार्य</b> है — प्रश्न-पत्र, प्रमाण-पत्र, पत्राचार सब। सही font/layout न चुनने पर अक्षर बिगड़ते (reph/conjunct टूटना)।</p>` },

    { type: 'table', head: ['औज़ार/फ़ॉन्ट', 'क्या है', 'कब/क्यों'],
      rows: [
        ['<b>Inscript (मानक अक्षरविन्यास)</b> layout', 'सरकारी मानक कीबोर्ड लेआउट (Manually Laid Out); keys पर चिह्न छपे', 'परीक्षा/सरकारी हिंदी typing यही मानक — exam papers के लिए'],
        ['<b>Transliteration (phonetic)</b> typing', 'रोमन में टाइप करो, हिंदी बनता (जैसे “namaste”→नमस्ते)', 'जल्दी टाइपिंग; Windows/365 का Hindi IME + Google IME'],
        ['<b>Mangal</b>', 'Unicode Devanagari font (Windows के साथ), Inscript पर अच्छा', 'सरकारी/नई फ़ाइलों में प्रचलित; Unicode, इसलिए कहीं भी दिखे'],
        ['<b>Arial Unicode MS</b>', 'बड़ा glyph-set वाला Unicode font', 'पुरानी फ़ाइल; अब license-सीमित, Noto बेहतर'],
        ['<b>Noto (Noto Sans Devanagari)</b>', 'Google का मुफ़्त Unicode font, conjunct/reph सही', 'crisp exam print, जहाँ Krutidev-mangal फ़र्क़ पड़े'],
        ['<b>Krutidev</b>', 'पुराना non-Unicode font (ASCII पर Devanagari glyphs mapped)', 'अब ख़तरनाक — दूसरे PC पर बिगड़ता; <b>convert to Unicode</b> करें'],
        ['Krutidav → Unicode conversion', 'converter टूल/extension या Unicode font पर re-map + text transliterate', 'पुराना सारा डेटा एक बार Unicode में लाएँ ताकि कभी न टूटे'],
        ['Hindi in Word', 'Hindi language authoring+proofing (Options→Language) व Inscript Hindi keyboard जोड़ें; font Noto/Mangal', 'exam papers इसी ढर्रे पर टाइप हों']
      ] },

    { type: 'acc', title: 'Office परिचय — अक्सर पूछे जाने वाले प्रश्न (FAQ)', items: [
      { q: 'Ribbon किस संस्करण में आया? Backstage?', a: '<b>Ribbon → Office 2007</b> (12.0) के साथ, और उसी में .docx/.xlsx/.pptx। <b>Backstage view (File) → Office 2010</b> में आया, 2007 में File सिर्फ़ एक छोटा button/menu था।' },
      { q: '.docx और .doc में असली फ़र्क़?', a: '.docx = <b>Office Open XML</b> (ZIP-pakड़े XML) — छोटा, सुरक्षित, को-एडिटिंग लायक। .doc = पुराना binary OLE — macro-malware व corruption का अड्डा। आज हरेक को .docx में सेव करना सिखाएँ।' },
      { q: 'Microsoft 365 और Office 2024 में चुनाव?', a: '365 = subscription, ताज़ा features + 1 TB OneDrive + हर महीने ~5 device। Office 2024 = one-time, 1 device, नए features नहीं, Outlook/OneDrive-1TB Home &amp; Student में नहीं। ऑनलाइन-कॉलेज→365, offline/बजट→perpetual/LTSC।' },
      { q: 'Co-authoring कब चलता है?', a: 'जब फ़ाइल <b>OneDrive/SharePoint</b> पर <b>.docx/.xlsx/.pptx</b> में हो और सब साइन-in हों। local फ़ोल्डर या .doc/.xls पर live सहकार्य नहीं — वहाँ editing lock।'},
      { q: '“Product activated temporarily” मतलब?', a: 'permanent genuine activation नहीं — KMS renewal या grace/unlicensed period। सही email sign-in / KMS reach / genuine key से ठीक होता है; crack-tool से नहीं।'},
      { q: 'Quick Repair बनाम Online Repair?', a: 'Quick = फ़ाइलें जाँच/दुरुस्त, इंटरनेट नहीं चाहिए। Online = पूरी reinstall जैसी मरम्मत, इंटरनेट + लंबा समय। पहले Quick, असर न हो तो Online।'},
      { q: 'Excel में .xlsb क्यों रखें?', a: 'binary workbook — बहुत बड़ा डेटा/कई पिवट तेज़ी से खुलता-सहेजता है, फ़ाइल छोटी; पर कुछ third-party tool/मैक्रो compatibility कम। साझा फ़ाइल हों तो .xlsx सुरक्षित।'},
      { q: 'Access/Publisher/Visio Windows पर क्यों?', a: 'ये desktop-heavy ऐप्स मुख्यतः Windows-only (Access/Visio/Project) हैं; Mac/iPad पर नहीं। Publisher पर 2026 retire चेतावनी है, इसलिए सिखाते समय सावधान।'}
    ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में सबसे ज़्यादा पूछा जाने वाला (Office परिचय)', html: `<ul><li><b>Full forms:</b> DOCX = Word-processing Document (XML); XLSX = workbook; PPTX = presentation; PDF = <b>Portable Document Format</b>; OOXML = Office Open XML; C2R = Click-to-Run; KMS = Key Management Service; SLC = Software Licensing.</li><li><b>Ribbon = 2007</b>, <b>Backstage = 2010</b>, <b>.docx 2007</b> में शुरू।</li><li><b>x/m/t/s</b> अक्षर का मतलब (XML/macro/template/slideshow-binary) एक-से पूछा जाता है।</li><li><b>Co-authoring</b> की शर्त = OneDrive/SharePoint + XML format + sign-in; पुराने .doc/.xls/.ppt पर editing lock।</li><li><b>Protected View</b> = इंटरनेट/अटैचमेंट फ़ाइल read-only sandbox; Mark of the Web ट्रिगर। <b>Trust Center</b> में macro setting, “Enable all” ग़लत।</li><li><b>1 TB OneDrive</b> subscription में; perpetual Home &amp; Student में सिर्फ़ ~5 GB और Outlook नहीं।</li><li>CCC/NIMI सवाल: “एक्सटेंशन बताइए”, “Ribbon किस version में”, “macro-safe format कौन-सा”, “co-authoring क्या”।</li></ul>` }

    /* @@T1MORE@@ */
  ]
},

/* ===================================================================
   2. MS Word पूरी गहराई
   =================================================================== */
{
  id: 'off-word', icon: '📝', group: 'MS Office मास्टरक्लास',
  title: 'MS Word पूरी गहराई',
  sub: 'टाइपिंग से प्रिंट तक — styles, TOC, mail merge, track changes, macros',
  kicker: 'Office Masterclass 2 · MS Word in Depth',
  hero: 'यह एक पूरी प्रैक्टिकल बैच चलाने लायक Word पाठ है — document vs template, टाइपिंग/Find-Wildcards, हर font-paragraph control, long-document की असल कला (sections, headers/footers, TOC, captions, cross-reference), Word tables, images-wrap, mail merge शीरे-से-पैर, Track Changes/review, सरकारी प्रश्न-पत्र व रिपोर्ट का repeatable procedure, fields/macros, print/export और 45+ शॉर्टकट + 12 प्रैक्टिकल।',
  tags: ['Styles व TOC', 'Mail Merge', 'Track Changes', 'Sections/Caption', 'Fields/Macros', 'प्रिंट व PDF'],
  blocks: [
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.1</span> Word की जड़ — document बनाम template, फ़ाइल का भीतरी ढाँचा, autosave</h3>
      <p><b>Document (.docx)</b> = असली पाठ; <b>Template (.dotx/.dotm)</b> = “माँ फ़ाइल” जिससे नई document बनती है (styles, page setup, header पहले से)। New→Personal/Installed templates इसी से आते हैं।</p>
      <ul>
        <li><b>Aptos:</b> Microsoft 365 की डिफ़ॉल्ट थीम फ़ॉन्ट <b>Aptos</b> है (2023 से); पुराने perpetual में Calibri। पुरानी फ़ाइल न खुले तो font substitute न हो इसका ध्यान रखें।</li>
        <li><b>.docx अंदर क्या है:</b> असल में एक <b>ZIP</b> archive — खोलें तो <code>word/document.xml</code> (पाठ), <code>styles.xml</code>, <code>numbering.xml</code>, <code>media\\</code> (चित्र), <code>[Content_Types].xml</code>, <code>rels</code>। इसलिए .docx छोटी, तेज़ और corruption-रोधी है।</li>
        <li><b>AutoRecover (.asd) बनाम AutoSave:</b> <b>AutoSave</b> (ऊपर का toggle) सिर्फ़ OneDrive/SharePoint फ़ाइल का live save; <b>AutoRecover</b> हर ~10 मिनट local <code>.asd</code> बनाता है (File→Options→Save) ताकि crash के बाद <code>AppData\\Microsoft\\Word\\AutoRecovery</code> से वापस मिले।</li>
        <li><b>Save As cloud:</b> OneDrive पर नाम पहले से मौजूद हो तो Word push कर देता है (“Keep both/rename”); personal info फ़ंसा न हो इसकी चेतावनी भी दिखती है।</li>
      </ul>` },

    { type: 'table', head: ['चीज़', 'क्या/कहाँ', 'मान/ध्यान रखें'],
      rows: [
        ['Template (.dotx/.dotm)', 'File→New→Personal; Save As→“Word Template”', 'Normal.dotm सबसे मुख्य template — यही सभी नई .docx की जड़'],
        ['AutoRecover file', '<code>.asd</code>, File→Options→Save→“AutoRecover file location”', 'हर 10 min default; अनसेव बंद करते समय “Do Save” पूछे'],
        ['Version का .docx internal', 'ZIP के अंदर document.xml/styles.xml', 'चित्र media\\ में — इसलिए फ़ाइल बड़ी होती है'],
        ['Default font/theme', 'Design→Fonts/Themes; Set As Default (सभी नई documents)', 'M365→Aptos; theme बदलते ही हर font/colour बदले'],
        ['Document property', 'File→Info→Properties (Title/Author/Tags)', 'Document Inspector से hidden personal info हटाएँ (2.7)']
      ] },

    { type: 'table', head: ['Page setup का हिस्सा', 'कहाँ मिले', 'व्याख्या/मानक मान'],
      rows: [
        ['Paper size', 'Layout→Size', 'A4 = 210×297 mm (भारत/सरकारी), Letter = 216×279 mm, Legal = 216×356 mm, Executive ≈ 184×267 mm, Note = Letter-jaisa small'],
        ['Margins', 'Layout→Margins', 'Normal = top/bottom 2.54 cm, left/right 3.18 cm (1″/1.25″); Narrow/Green/Custom'],
        ['Gutter', 'Layout→Margins→Custom→Gutter', 'बाइंडिंग के लिए अतिरिक्त किनारा (binding margin); book/report में ज़रूरी'],
        ['Orientation', 'Layout→Orientation', 'Portrait/landscape; per-section बदल सकता है (देखिए 2.4)'],
        ['Page Border', 'Design→Page Borders', 'Box/shadow/3-D/custom; “Apply to” = Whole document/This section—first page only'],
        ['Watermark', 'Design→Watermark', 'DRAFT/CONFIDENTIAL preset या Custom text/picture; Print Layout में हल्का दिखे'],
        ['Columns', 'Layout→Columns', '1/2/3/Left/Right/More (Width & Spacing); news-letter का मूल'],
        ['Page Colour/Background', 'Design→Page Color', 'screen पर रंग; print में “Print background colors and images” ON चाहिए'],
        ['Theme', 'Design→Themes', 'fonts+colours+effects का पूरा सेट — एक click में सारा look बदले']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.2</span> पाठ डालना व संपादन — Insert/Overtype, Word Count, Find/Replace</h3>
      <p><b>Insert</b> (नई चीज़ बीच में घुसे) बनाम <b>Overtype</b> (आगे का पाठ मिटता है)। Overtype कभी-कभी ग़लती से ON हो जाता है — <kbd>Insert</kbd> key या Status bar के “Overtype” पर click से बंद; पक्का toggle File→Options→Advanced→“Use overtype mode”।</p>
      <p><b>Word Count</b> (Review/Status bar): शब्द, characters (spaces सहित/रहित), paragraphs, lines, और <b>reading time</b> (~200 शब्द/मिनट मानक)। “<b>Include textboxes, footnotes and endnotes</b>” का टिक हटाएँ तो मुख्य-पाठ ही गिना जाए — परीक्षा-पत्र में अक्सर यही चाहिए।</p>` },

    { type: 'table', head: ['Select करने का तरीक़ा', 'कैसे', 'क्या चुने'],
      rows: [
        ['एक शब्द', 'Double-click', 'शब्द'],
        ['एक वाक्य', '<kbd>Ctrl</kbd> + click (वाक्य में)', 'पूरा वाक्य'],
        ['एक पैराग्राफ़', 'Triple-click / margin में 3-click', 'पैरा'],
        ['एक पंक्ति', 'Left margin में click', 'पूरी line'],
        ['पूरी document', '<kbd>Ctrl+A</kbd> (margin में triple-click भी)', 'सब'],
        ['End तक / Home तक', '<kbd>Ctrl+Shift+End</kbd> / <kbd>Ctrl+Shift+Home</kbd>', 'cursor से अंत/शुरुआत तक'],
        ['Block/column चुनना', '<kbd>Alt</kbd> + drag (या <kbd>Alt+Shift+arrow</kbd>)', 'आयताकार/कॉलम selection'],
        ['Extend mode', '<kbd>F8</kbd> दबाएँ (बार-बार = word→sentence→para→all), फिर arrows/click', 'keyboard से बढ़ती selection'],
        ['Discontiguous', '<kbd>Shift+F8</kbd> “Select To” + click', 'दूर-दूर हिस्से एक साथ']
      ] },

    { type: 'table', head: ['Find & Replace — wildcard टोकन', 'मतलब', 'उदाहरण (Use wildcards ON)'],
      rows: [
        ['<code>?</code>', 'कोई एक character', '<code>gr?s</code> → gas/gis…'],
        ['<code>*</code>', 'शून्य या अधिक characters', '<code>b*t</code> → bat/boat/bright…'],
        ['<code>[ ]</code>', 'इनमें से कोई एक character', '<code>gr[ae]y</code> → gray/grey'],
        ['<code>!</code> (range में)', 'in_range नहीं', '<code>[!0-9]</code> → कोई non-digit'],
        ['<code>{n} / {n,} / {n,m}</code>', 'पिछला token n बार / n+ / n–m बार', '<code>ab{2,}c</code> → abbbc…'],
        ['<code>&lt;</code> / <code>&gt;</code>', 'शब्द की शुरुआत / समाप्ति', '<code>&lt;in*</code> → in- से शुरू हर शब्द (information, India…)'],
        ['<code>@</code>', 'पिछला token एक या अधिक बार', '<code>co@l</code> → col/cooll…'],
        ['<code>()</code>', 'grouping', '<code>(in)&gt;</code>'],
        ['<code>-</code> (range में)', 'range', '<code>[a-z]</code>']
      ] },
    { type: 'html', html: `<p><b>Find & Replace के बाक़ी ज़रूरी बिंदु:</b> <b>Find All In Document</b> (पूरी फ़ाइल में highlight) ; <b>Advanced Find</b> (<kbd>Ctrl+F</kbd> dropdown, या <kbd>Ctrl+H</kbd>→More) में Format/Style/Special से <b>formatting बदलना</b> (जैसे सभी Heading को replace) ; headers/footers खोजने के लिए पहले header/footer खोलें ; ब्राउज़र/फ़ोल्डर-wide search के लिए <b>Search box</b>।</p>
      <p><b>Replace में special codes</b> (Use wildcards OFF पर काम करते हैं):</p>` },
    { type: 'table', head: ['Code', 'क्या खोज/बदल दे', 'Code', 'क्या'],
      rows: [
        ['<code>^p</code>', 'Paragraph mark (Enter)', '<code>^t</code>', 'Tab character'],
        ['<code>^l</code>', 'Manual line break (Shift+Enter)', '<code>^n</code>', 'Page break (Ctrl+Enter)'],
        ['<code>^s</code>', 'Non-breaking space', '<code>^m</code>', 'Paragraph mark in a table cell'],
        ['<code>^b</code>', 'Section break', '<code>^?</code>', 'Any single character (Find)'],
        ['<code>^#</code>', 'Any digit', '<code>^$</code>', 'Any letter (a–z)'],
        ['<code>^&</code>', 'Found text (Replace box)', '<code>^c</code>', 'Clipboard contents (Replace)'],
        ['<code>^d</code>', 'Field', '<code>^f</code> / <code>^e</code>', 'Footnote / Endnote reference']
      ] },

    { type: 'table', head: ['Spelling/Grammar व AutoCorrect', 'कहाँ/कैसे', 'नियंत्रण'],
      rows: [
        ['Spelling & Grammar check', 'Review→Spelling & Grammar या <kbd>F7</kbd>; red=spelling, blue=grammar', 'Ignore Once / Ignore All / Add (dictionary में)'],
        ['Custom dictionary', 'File→Options→Proofing→Custom Dictionaries (<code>.dic</code>)', 'word Add/Delete;_dictionary change से सबको मिले'],
        ['Grammar styles', 'Options→Proofing→Writing Style (Grammar &amp; only / Grammar &amp; Style) + Refine', 'formal/conciseness level स्लाइडर'],
        ['Hindi spell check', 'Hindi authoring भाषा जोड़ें (Options→Language)', 'built-in Hindi spell/grammar सीमित है; मुख्यतः manual + font सही'],
        ['AutoCorrect — आम त्रुटियाँ', 'Options→Proofing→AutoCorrect Options', '“Capitalize first letter”, “Correct TWo INitial CApitals”, “/2”→ date, “internet”→Internet — checkbox हटाएँ या list से entry delete करें'],
        ['Smart quotes (‘ ’ “ ”)', 'AutoCorrect→“Replace” tab', 'code/plain-text के लिए “straight quotes” रखें — यहाँ toggle off'],
        ['AutoText / Quick Parts', 'Insert→Quick Parts→Save selection; organizer Alt+drag', '<code>.dotm</code>/Normal में building blocks; type कर <kbd>F3</kbd> से AutoText पूरा']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.3</span> Font व Paragraph formatting — हर control</h3>
      <p>Home टैब के दो समूह — <b>Font</b> (अक्षर) और <b>Paragraph</b> (पैरा) — ही Word की 80% formatting हैं। नीचे हर बटन/डायलॉग।</p>` },

    { type: 'table', head: ['Font समूह का control', 'क्या', 'शॉर्टकट/नोट'],
      rows: [
        ['Font &amp; Size', 'family, आकार 8–72 (box में टाइप करके बड़ा भी; Type Ahead)', 'सबसे बड़ा मान Word में 1638 pt'],
        ['Grow / Shrink', 'आकार बढ़ा/घटा (1 pt steps)', '<kbd>Ctrl+]</kbd> / <kbd>Ctrl+[</kbd>'],
        ['Clear Formatting', 'सब manual formatting हटाकर Normal', '<kbd>Ctrl+Space</kbd> (style reset)'],
        ['Change Case', 'lowercase/Title/UPPER/tOGGLE/sentence', '<kbd>Shift+F3</kbd> cycle'],
        ['Bold/Italic/Underline', '<kbd>Ctrl+B</kbd> / <kbd>Ctrl+I</kbd> / <kbd>Ctrl+U</kbd>', 'underline types dropdown में'],
        ['Highlight बनाम Font Colour', 'Highlight = पीछे का रंग (marker); Font Colour = अक्षर का रंग', 'print में highlight के लिए option ON चाहिए'],
        ['Superscript / Subscript', '<code>x²</code> / <code>x₂</code>', '<kbd>Ctrl+Shift++</kbd> / <kbd>Ctrl+=</kbd>'],
        ['Strikethrough / Double strike', 'एक / दो कट-रेखा', 'double = Font dialog'],
        ['Emphasis mark / Shading / Border', 'अक्षर पर बिंदु/रंग/रेखा', 'Font dialog + Borders dropdown'],
        ['Small caps / All caps / Hidden', 'छोटी-बड़े अक्षर, सब-बड़े, छिपा पाठ', 'Hidden = Font dialog (छिपा तभी दिखे जब “Hidden” show ON)'],
        ['Text Effects / Enclosed', 'glow/shadow/outline, अक्षर circle/box में', 'Font dialog के tabs में']
      ] },

    { type: 'table', head: ['Advanced Font dialog का tab', 'उपलब्ध नियंत्रण', 'कब उपयोग'],
      rows: [
        ['Font (1st tab)', 'Latin / Complex-script / Advanced options; Bold/Italic; Underline/colour/effects', 'Hindi (complex script) अलग font देना'],
        ['Advanced', 'Scale (%), Spacing (Expanded/Condensed, pt), Position (Raised/Lowered), Kerning for fonts', 'heading spacing, chapter title tweaking'],
        ['Text Effects (2010+)', 'Text fill / outline / glow; Shadow, Reflection, 3-D, With change-shape', 'WordArt-style बड़े heading']
      ] },

    { type: 'table', head: ['Paragraph नियंत्रण', 'विकल्प/मान', 'शॉर्टकट/नोट'],
      rows: [
        ['Alignment (5)', 'Left / Center / Right / Justify / Distributed', '<kbd>Ctrl+L/E/R/J</kbd>; Distributed <kbd>Ctrl+Shift+T</kbd>'],
        ['Line spacing', 'Single/1.5/Double/At least/Exactly/Multiple', '<kbd>Ctrl+1</kbd>=Single, <kbd>Ctrl+5</kbd>=Double; Exactly/At least pt में, Multiple factor'],
        ['Spacing before/after', 'पैरों के बीच रिक्त (pt या cm — Options→General में unit बदलें)', '<kbd>Ctrl+0</kbd> toggle 12pt space before'],
        ['Indent — left/right', 'पूरा पैरा भीतर', '<kbd>Ctrl+M</kbd> increase / <kbd>Ctrl+Shift+M</kbd> decrease'],
        ['Indent — hanging', 'पहली line बाहर, बाक़ी भीतर (सूची जैसा)', '<kbd>Ctrl+T</kbd>'],
        ['Indent — first line', 'पहली line अंदर', 'ruler का ऊपरी प्याज़ / Paragraph dialog'],
        ['Keep with next', 'यह पैरा अगले से साथ रहे (heading नीचे न जाए)', 'Paragraph→Line and Page Breaks'],
        ['Keep lines together', 'एक पैरा के lines न टूटें', 'उसी tab'],
        ['Page break before', 'इस पैरा से पहले नया पेज', 'उसी tab (Ctrl+Enter का style-आधारित विकल्प)'],
        ['Widow/Orphan control', 'अकेली line अगले/पिछले पेज पर न जाए', 'डिफ़ॉल्ट ON'],
        ['Snap to grid / Different page grid', 'ग्रीड में line संरेख', 'उसी tab (East-Asian layout)']
      ] },

    { type: 'table', head: ['List व Tab', 'विकल्प', 'कैसे/नियंत्रण'],
      rows: [
        ['Bullets', 'preset/Define New Bullet/-picture', 'character बदलें; symbol font <b>Wingdings</b> (✓, →, ★)'],
        ['Numbering', 'Format 1,2,3 / a,b,c / i,ii,iii; Define New Number format', '<b>Restart numbering</b>/Continue; “Align list to / Indent text at”'],
        ['Multilevel / Outline numbering', 'List→Multilevel List (1.1, 1.1.1)', 'Heading styles से बाँधें → TOC/chapter-numbering के लिए ज़रूरी'],
        ['List Paragraph style', 'list का base style', '<kbd>Ctrl+Shift+L</kbd> apply List Paragraph'],
        ['Tab stop types', 'Left / Center / Right / Decimal / Bar', 'Tabs dialog (<kbd>Ctrl+A</kbd> ruler view); Decimal संख्या दशमलव पर संरेख'],
        ['Default tab stop', 'हर 1.27 cm (0.5″) पर', 'custom tab से ऊपर override'],
        ['Leader characters', 'dots/dashes/line before tab', '“Tab leader” — contents dotted line और answer-space के लिए']
      ] },

    { type: 'table', head: ['Borders & Shading व Styles', 'कहाँ', 'ध्यान रखें'],
      rows: [
        ['Borders dialog', 'Home→Borders dropdown→Borders and Shading', '<b>Apply to: Paragraph बनाम Text</b> — पैरा के चारों ओर या चुने शब्द पर'],
        ['Box बनाम Shadow', 'Style में Box/Shadow/3-D', 'प्रश्न-पत्र instruction box में Box'],
        ['Page Border', 'Design→Page Borders', 'per-section या first-page-only apply'],
        ['Art borders', 'Page Border→Art', 'certificates में सजावटी किनारा'],
        ['Shading', 'Borders dialog→Shading (Fill/Pat)",', 'table cell heading में fill रंग'],
        ['Quick Styles gallery', 'Home→Styles', 'Heading 1/2/3, Title, Normal, No Spacing…'],
        ['Create/Modify/Delete style', 'Styles dropdown→Create/Modify Style; Manage Styles', 'एक style बदलें → हर जगह लागू (यही style की शक्ति)'],
        ['Style Inspector / set', '<kbd>Ctrl+Alt+Shift+S</kbd> pane; Style Set (Design)', 'कौन-सा style+direct format लगा है देखें'],
        ['Outline level व Heading', 'Paragraph→Indents and Spacing→Outline level; H1/H2/H3', '<b>TOC, Navigation pane, numbered chapters, accessibility</b> इन्हीं पर निर्भर']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.4</span> लंबे दस्तावेज़ की कला — sections, headers/footers, TOC, caption, cross-reference</h3>
      <p>थीसिस/रिपोर्ट/प्रश्न-पत्र में यही हिस्सा परीक्षा जिताता है। <b>Section</b> = पेज-लेआउट का स्वतंत्र टुकड़ा; अलग margins/orientation/header/footers/footnote-restart हर section में अलग हो सकते हैं।</p>` },

    { type: 'table', head: ['चीज़', 'विकल्प/क्या बदले', 'कहाँ'],
      rows: [
        ['Section break — Next Page', 'नया section नए पेज पर शुरू', 'Layout→Breaks→Next Page'],
        ['Section break — Continuous', 'उसी पेज पर section बदले (जैसे columns बदलना)', 'Layout→Breaks→Continuous'],
        ['Section break — Even / Odd Page', 'अगला section सम/विषम पेज पर शुरू (book printing)', 'Layout→Breaks'],
        ['हर section में अलग हो सकता है', 'margins, page size/orientation, columns, header/footer, line numbering, footnote numbering, page-number start', 'उपर्युक्त section के अंदर सेट करें'],
        ['Break vs paragraph', 'Page break <kbd>Ctrl+Enter</kbd>; Column break <kbd>Ctrl+Shift+Enter</kbd>; Line break <kbd>Shift+Enter</kbd>', '“Page break before” (paragraph option) Ctrl+Enter से बेहतर — delete पर न टूटे'],
        ['Show/Hide ¶ (<kbd>Ctrl+Shift+8</kbd> या <kbd>Ctrl+*</kbd>)', 'छिपे चिह्न: <code>¶</code>=paragraph, <code>·</code>=space, <code>→</code>=tab, <code>↵</code>=manual line break, <code>°</code>=non-breaking space, dashed-box=hidden text, <code>¶</code> big=section break', 'View टैब या Home का ¶ button']
      ] },

    { type: 'table', head: ['Header/Footer का नियंत्रण', 'क्या', 'नोट'],
      rows: [
        ['खोलना', 'double-click header/footer area या Insert→Header/Footer', 'Header &amp; Footer Tools contextual tab खुले'],
        ['Link to Previous', 'इस section का header पिछले से जुड़ा रहे', 'पहले page के header से अलग करने के लिए इसे OFF करें'],
        ['Different First Page', 'पहले पन्ने का header/footer अलग (कवर पर नंबर न दिखे)', 'Header &amp; Footer Design टैब'],
        ['Different Odd &amp; Even', 'किताब जैसा बाएँ/दाएँ पन्ना अलग header', 'booklet printing में'],
        ['Page number → format/start', 'Insert→Page Number→Format… : 1,2,3 / i,ii / a,b; “Start at” मान', 'section-wise “Continue/Start at 1”'],
        ['Insert fields', 'Page, NumPages, Date and Time, File name/path, Author, …', 'Field के shortcut नीचे 2.9'],
        ['Date &amp; Time दो तरह', '“Update automatically” (हर open पर बदले) बनाम static (जो टाइप किया वही रहे)', 'certificates में static तारीख़ रखें']
      ] },

    { type: 'table', head: ['लंबे-दस्तावेज़ के साधन', 'कैसे/कहाँ', 'महत्वपूर्ण बात'],
      rows: [
        ['Footnote / Endnote डालना', 'References→Insert Footnote <kbd>Ctrl+Alt+F</kbd> / Endnote <kbd>Ctrl+Alt+D</kbd>', 'footnote नीचे, endnote अंत/section-अंत'],
        ['Footnote numbering/restart', 'Footnote dialog: 1/i/a; Continuous/Each page/Each section', 'separator lines (Footnote Separator) edit करें'],
        ['Footnote↔Endnote बदलना', 'footnote पर right-click→Convert', 'cross-reference से वापस jump'],
        ['Citations &amp; Bibliography', 'References→Insert Citation / Manage Sources / Bibliography', 'styles: APA, MLA, Chicago, Harvard, IEEE (कुछ download लगते हैं); Hindi संदर्भ के लिए manual बेहतर'],
        ['Index बनाना', 'Mark entry (select → <kbd>Alt+Shift+X</kbd>, <code>XE</code> field) → References→Insert Index (1/2/3 column)', '“Mark All Entries” concordance से; right-align tab + hyperlinks option'],
        ['Table of Contents', 'References→Table of Contents: Automatic 1/2, Custom, Add text', 'Automatic सिर्फ़ Heading styles से; Manual अपने-आप नहीं बदलता'],
        ['TOC update', 'References→Update Table → “page numbers only” बनाम “entire table”', 'styles बदलें तो entire table'],
        ['TOC field switches', '<code>TOC \\o "1-3" \\h \\z \\u</code> (levels/hyperlinks/context/toc-entries)', 'dots leaders व tab leader “Show levels” से'],
        ['Bookmark', 'Insert→Bookmark; नाम letter से शुरू, space नहीं; Hidden bookmarks option', '<kbd>Ctrl+G</kbd>→Bookmark पर jump'],
        ['Cross-reference', 'Insert→Cross-reference: Heading/page number/paragraph number/numbered item/caption/“on above-below”', 'यह एक field है — बदलाव बाद <kbd>F9</kbd> से update'],
        ['“#REF!” error', 'जिस source को cross-reference किया था delete/बदल गया', 'Ctrl+A → <kbd>F9</kbd> update; फिर भी रहे तो source दोबारा insert करें'],
        ['Captions &amp; labels', 'References→Insert Caption; New label; Numbering→Include chapter number (multilevel Heading चाहिए)', 'position above/below; cross-ref “Figure 1 on page 3”'],
        ['Table of Figures/Tables', 'References→Insert Table of Figures (label चुनें)', 'caption update हो तो refresh']
      ] },

    { type: 'table', head: ['Links व interactive हिस्से', 'क्या/कहाँ', 'नियंत्रण'],
      rows: [
        ['Hyperlink', 'Insert→Hyperlink <kbd>Ctrl+K</kbd>; Existing/Place in Document (bookmark)/Email (mailto:) + ScreenTip', 'follow: <kbd>Ctrl</kbd>+click (Advanced option “Use Ctrl+Single-click”); Edit/remove right-click'],
        ['Content controls (Developer)', 'Design Mode ON → Rich Text / Plain Text / Picture / Drop-down / Repeating / Date Picker', 'Developer tab न दिखे तो Options→Customize Ribbon→Developer tick'],
        ['Group &amp; restrict editing', 'Developer→Group; Review→Restrict editing→“Filling in forms”', 'forms इसी से बनते हैं; XML mapping (Developer→XML) से data-bandhan'],
        ['Views', 'View→Outline / Draft / Print Layout / Read Mode / Focus (<kbd>Alt</kbd> से निकलें) / Full Screen', 'Outline view से headings को reorder/promote/demote'],
        ['Navigation pane', 'View→Navigation Pane tick', 'Headings से jump/reorder, Search results, page thumbnails — बड़ा document यहीं सुलझाता है']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.5</span> Word में Tables व Graphics — conversion, wrap text, anchor, equation</h3>` },

    { type: 'table', head: ['Table का काम', 'कैसे', 'सावधानी/बेस्ट प्रैक्टिस'],
      rows: [
        ['Insert (तरीके)', 'grid drag / Insert Table / Draw Table / Excel Spreadsheet / Quick Tables / Convert Text to Table', '3×3 से बड़े में Insert Table dialog'],
        ['AutoFit (3)', 'Fixed width / AutoFit to Contents / AutoFit to Window', 'Layout→AutoFit'],
        ['Text ↔ Table बदलना', 'select text→Insert→Table→Convert Text to Table (delimiter: paragraph/tab/comma/other)', 'table→text: Layout→Convert to Text (delimiter चुनें)'],
        ['Merge / Split cells', 'select cells→Layout→Merge Cells ; split cells (number of columns)', 'split table by paragraph: Layout→Split Table (<kbd>Alt+Shift+Enter</kbd>? — menu से)'],
        ['Repeat header rows', 'Layout→Repeat Header Rows', 'बहु-पेज table में पहली row हर पेज पर'],
        ['Row को तोड़ना रोकें', 'Row tab→“Suppress row break across pages” + “Repeat as header row”', 'exam में प्रश्न टूटे नहीं'],
        ['Sort table', 'Layout→Sort (First-Field Row/No Header; Type; Ascending/Descending)', 'Case sensitive टिक; अंक vs पाठ ध्यान'],
        ['Cell margins/padding, valign, text direction', 'Layout→Cell Margins; Alignment (9 grid); Text Direction (rotate)', 'vertical align top/center/bottom'],
        ['Tab से table बढ़ना', 'last cell में <kbd>Tab</kbd> दबाने पर नई row जुड़ती है', 'इसलिए आख़िरी cell में Tab से बचें'],
        ['Table में formula', 'Layout→Formula: <code>=SUM(ABOVE)</code>, <code>=SUM(LEFT)</code>, <code>=A1*B1</code> (field-based)', 'Word में सिर्फ़ सीधे-सादे formula; cell-reference A1-style'],
        ['Exam-paper best practice', 'question + marks कॉलम table; answer-space dotted line (tab leader)', 'marks कॉलम right-align; border सिर्फ़ ज़रूरी पर']
      ] },

    { type: 'table', head: ['Wrap text के 7 प्रकार', 'क्या करे', 'कब'],
      rows: [
        ['In Line With Text', 'चित्र एक बड़े अक्षर की तरह line में', 'inline चिह्न; flow सुरक्षित'],
        ['Square', 'पाठ चारों ओर box में', 'छोटे चित्र'],
        ['Tight', 'चित्र की outline के अनुसार पाठ', 'irregular shape'],
        ['Through', 'खाली जगह में भी पाठ घुसे', 'complex cutout'],
        ['Top and Bottom', 'पाठ ऊपर/नीचे, दाएँ-बाएँ नहीं', 'पूरे-चौड़ाई diagram'],
        ['Behind Text', 'चित्र पाठ के पीछे', 'background/logo watermark'],
        ['Front of Text', 'चित्र पाठ के ऊपर', 'overlay/annotation'],
        ['Anchor का सिद्धांत', 'हर floating object एक paragraph से <b>anchor</b> होता है; anchor दिखे तो object उस पैरा के साथ चलता है', '“Why image moves”: object के <b>Move with text</b> + anchor पैरा हिलने से; हल = <b>Position→Fixed on page</b> या anchor को <b>Lock anchor</b> (Object/Size &amp; Position→Picture→“Lock anchor”)'],
        ['Format/group/crop/alt', 'Picture Format: Align/Distribute, Group <kbd>Ctrl+Shift+G</kbd>, Rotate/Flip, Crop / Crop-to-Shape, Remove Background, Picture Styles/Effects, <b>Alt Text</b> (accessibility)', 'Group→Ungroup; alt text screen-reader व PDF accessibility के लिए ज़रूरी']
      ] },

    { type: 'table', head: ['Insert व graphics के और साधन', 'कहाँ/क्या', 'नोट'],
      rows: [
        ['Icons / 3D Models / Screenshot', 'Insert→Icons, 3D Models, Screenshot (Screen Clipping — खुली window का हिस्सा)', 'Screen Clipping बिना external tool के'],
        ['Shapes व Text Box', 'Insert→Shapes; Text Box (float/inline)', 'text box में wrap “With Text Wrapping” vs “In Front of Text”'],
        ['SmartArt', 'Insert→SmartArt; layout families: List/Process/Cycle/Hierarchy/Relationship/Matrix/Pyramid; [Text] pane; Reverse/Change Colors/Convert to Shapes', 'Convert to Shapes के बाद text box टूट-टूट हो जाता है'],
        ['WordArt', 'Insert→WordArt', 'bड़े heading/कवर title'],
        ['Chart', 'Insert→Chart (छोटा Excel खुलकर data)', 'एक्ज़ल-style edit; फिर chart'],
        ['Equation', 'Insert→Equation / <kbd>Alt+=</kbd>; Professional या Linear; Gallery + Ink', 'math AutoCorrect: <code>\\alpha</code>, <code>\\frac{a}{b}</code>, <code>\\sqrt</code>, <code>^</code> sup, <code>_</code> sub; space पर professional'],
        ['Numbered equation (1)', 'equation + right-aligned tab + <code>#(1)</code> — Word auto-number देता है', 'या 1-row/3-col table से center+right number; “(1.1)” section-wise के लिए SEQ/STYLEREF field']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.6</span> Mail Merge — पूरा शीरे से पैर (लैब का प्रिय)</h3>
      <p><b>Main document</b> (जो हर बार दोहराए, field के साथ) + <b>Data source</b> (नाम/पता/अंक की list) मेल होकर कई personalized फ़ाइलें बनाता है। field को <code>«Name»</code> से और code को <code>{ MERGEFIELD Name }</code> से दिखाते हैं (<kbd>Alt+F9</kbd> toggle)।</p>` },

    { type: 'table', head: ['विषय', 'विकल्प/क्या', 'ध्यान रखें'],
      rows: [
        ['6 Merge types', 'Letters / E-mail Messages / Labels / Envelopes / Directory (catalog) / Step-by-Step (Directions) wizard', 'Mailings→Start Mail Merge'],
        ['Select recipients', 'Use Existing List / Type New List / Select from Outlook Contacts / Browse for Outlook Data File', 'Outlook source के लिए <b>desktop Outlook</b> (profile) चाहिए; Outlook Web नहीं'],
        ['Edit Recipient List', 'Check All/Unsel, filter, sort, Find recipient, Add/Delete', 'यहाँ “Only send records…” की छँटनी'],
        ['Insert fields', 'Merge Field, Address Block, Greeting Line, Date (format के साथ), more', 'Date field पर format <code>@</code> switch'],
        ['Conditional text', 'Field <code>{ IF «Marks» &gt;= 40 "पसंद" "अनुत्तीर्ण" }</code> (Insert→Quick Parts→Field→IF)', 'Pass/Fail marksheet का मूल'],
        ['Interactive merge', 'Ask / CompareSet fields — हर record पर पूछे', 'हर बार prompt; तेज़ batch में कम उपयोग'],
        ['Rules', 'Mailings→Rules: Skip Record When, Next Record If (catalog), Set To, If Then Else', 'catalog/Directory में <code>&lt;Next Record&gt;</code> rule'],
        ['Preview &amp; navigate', 'Preview Results (<kbd>Alt+Shift+N</kbd>); first record दिखता है — arrows से आगे', '“«Next»” उलझन = सिर्फ़ पहला record दिखता है, arrow से बदलें; Preview पर highlight toggle'],
        ['Find Errors', 'Mailings→Find Errors — अधूरे/गड़बर records दिखाएँ', 'merge से पहले सुधारें'],
        ['Finish &amp; Merge', 'Edit Individual Documents / Print Documents / Send Email Messages (subject)', 'Edit-individual = बड़ी फ़ाइल; “All/Current/From-To” चुनें'],
        ['Labels (Avery)', 'Start Mail Merge→Labels→Labels dialog→Label vendors (Avery) या Page setup (Width/Height/Number-upon) + Update labels', 'एक cell design→Update Label'],
        ['Envelopes', 'Create→Envelopes→Options (size, delivery/return, placement); “Print to single envelope”', 'feed direction प्रिंटर से मिलाएँ'],
        ['Catalog + Hindi marksheet', 'Directory type + <code>&lt;Next Record&gt;</code> ; Hindi marksheet में font (Mangal/Noto) + IF pass/fail', 'source Hindi में हो तो font व Unicode ठीक रखें'],
        ['Merge to single PDF', 'native सुविधा नहीं — workaround: Finish→Edit Individual Documents (सारा एक .docx) → File→Save As PDF; या merged doc पर Microsoft Print to PDF', 'बहुत बड़े merge में memory/timeout ध्यान; page-break “Section breaks” से देखें']
      ] },

    { type: 'code', code: String.raw`{ MERGEFIELD Name }            :: एक merge field का असली code रूप
{ MERGEFIELD Marks }
«AddressBlock»  «GreetingLine»  :: wizard वाले fields
{ IF { MERGEFIELD Marks } >= 40 "पसंद (PASS)" "अनुत्तीर्ण (FAIL)" }
{ DATE \@ "dd-MMMM-yyyy" }       :: date field का format switch (@)
{ MERGEFIELD City }{ IF "Delhi" = "Mumbai" " (West)" "" }   :: CompareSet/conditional
Catalog (Directory) में हर record के बीच:  <Next Record>
Ask field:  { ASK "परीक्षा का नाम" } फिर { MERGEFIELD "परीक्षा का नाम" }

-- Toggle देखने के लिए: Alt+F9 (सभी field code) / Shift+F9 (selected) / F9 (update)` },

    { type: 'steps', items: [
      { n: 1, title: 'Main document बनाइए', text: 'Letter/certificate/label का स्थिर हिस्सा टाइप कीजिए; जहाँ बदलता डेटा आएगा वहाँ field का स्थान छोड़िए (जैसे “प्रिय ____,”)।' },
      { n: 2, title: 'Start Mail Merge चुनिए', text: 'Mailings→Start Mail Merge→ अगला type (Letters/Emails/Labels/Envelopes/Directory)।' },
      { n: 3, title: 'Data source जोड़िए', text: 'Select Recipients→Use Existing List (Excel .xlsx) या Type New List। file चुनकर sheet/first-row-is-header पुष्टि कीजिए।' },
      { n: 4, title: 'Merge fields रखिए', text: 'Insert Merge Field→ स्तंभ-नाम; या Address Block/Greeting Line wizard। ज़रूरत हो तो IF field से pass/fail।' },
      { n: 5, title: 'Edit list व Preview', text: 'Edit Recipient List से filter/sort/Check All; Preview Results कर arrows से कुछ records जाँचिए; Find Errors चलाइए।' },
      { n: 6, title: 'Finish &amp; Merge', text: 'Edit Individual Documents→All (एक बड़ी .docx) या Print/Documents, या Send Email (subject)। PDF चाहिए तो merged doc को Save As PDF।' },
      { n: 7, title: 'Result जाँच', text: 'कितने records आए, कोई « » field अनबुझा तो नहीं, Hindi font सही है, pass/fail IF सही — रजिस्टर में लिखिए।', warn: 'merge से पहले data source में extra blank rows/hindi-spell सुधार लें; वरना अधूरे output।' }
    ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.7</span> Track Changes व Review — सह-संपादन सुरक्षित रखें</h3>` },

    { type: 'table', head: ['Review सुविधा', 'कहाँ/क्या', 'नियंत्रण/चेतावनी'],
      rows: [
        ['Track Changes toggle', 'Review→Track Changes <kbd>Ctrl+Shift+E</kbd>', 'ON करने के बाद जो बदलाव हुए सिर्फ़ वे record होंगे — पहले के नहीं'],
        ['क्या-क्या track हो', 'insert / delete / formatting / (optionally) moved text', 'Display of tracked changes: balloons margin या inline list से'],
        ['Display for Review (4)', 'Simple Markup / All Markup / No Markup / Original', '“No Markup” में बदलाव छिपे पर मौजूद — धोखा न समझें'],
        ['Accept / Reject', 'Review→Accept (this/next) या Accept All Changes ; Reject …', 'बेदागली भेजने से पहले <b>Accept All + Clear all comments</b> ज़रूरी'],
        ['Comments', 'New Comment <kbd>Ctrl+Alt+M</kbd>; reply; @mention (notify); Resolve; Delete; Move', 'print में comments विकल्प बंद करके साफ़ copy दें'],
        ['Compare / Combine', 'Review→Compare (two versions का अंतर) ; Combine (कई authors के changes एकत्र)', 'word-for-word बनाम character-by-character; results एक “reviewed” doc में'],
        ['Restrict Editing', 'Review→Restrict: No changes / Tracking / Comments / Filling in forms / Read only', 'password लगाएँ; stop protection पर pass चाहिए'],
        ['Mark as Final', 'File→Info→Protect→Mark as Final', 'संकेत है, ताला नहीं — कोई editing चालू कर सकता है'],
        ['Digital signature', 'Insert→Signature Line या File→Info→Protect→Add a Signature', 'authenticity + tamper-evidence; cert चाहिए'],
        ['Password open/modify', 'Save As→Tools→General Options (open &amp; modify)', 'open password भूलें तो data मुश्किल; responsible रखें'],
        ['Document Inspector', 'File→Info→Check for Issues→Inspect Document', 'hidden data/personal info/comments/metadata/versions/macros हटाएँ — भेजने से पहले'],
        ['Compatibility Checker', 'File→Info→Check for Issues→Check Compatibility', 'पुराने format में क्या टूटेगा; 365 features को .docx में न बाँधें']
      ] },
    { type: 'callout', kind: 'danger', title: '“Track Changes OFF” का गुप्त ख़तरा', html: `<p>Track Changes <b>OFF</b> करने का मतलब बदलाव मिटना नहीं — बंद करने से <b>अगले</b> बदलाव record नहीं होंगे, पुराने markup वैसे ही रह जाएँगे और “No Markup” view में दिखकर भी <b>फ़ाइल में मौजूद</b> होंगे। इसलिए भेजने/प्रिंट से पहले: <b>Accept All Changes → Delete All Comments → Document Inspector</b> चलाकर साफ़ कीजिए, वरना आपकी गुप्त टिप्पणी सामनेवाले को दिखती है।</p>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.8</span> प्रश्न-पत्र व रिपोर्ट का repeatable फ़ॉर्मैट (इंस्टिट्यूट का असली काम)</h3>
      <p>यहाँ दो पूरे procedures दिए हैं जिन्हें हर बैच दोहरा सकती है — एक semester exam paper, एक report/assignment। मूल मंत्र: <b>styles + sections + fields</b> से बनाइए, manual spacing से नहीं।</p>` },

    { type: 'steps', items: [
      { n: 1, title: 'Header table (पहचान-ब्लॉक)', text: 'पहले पेज पर 1–2-row table: संस्थान / विषय / कक्षा / Set No / समय / अधिकतम अंक। logo cell में Insert→Picture (Behind Text)।' },
      { n: 2, title: 'Instructions box', text: 'नया paragraph → Borders dialog में <b>Box, Apply to Paragraph</b> — सामान्य निर्देश (O.M.R./negative marking/आदि)।' },
      { n: 3, title: 'Watermark &amp; section', text: 'Design→Watermark (CONFIDENTIAL/SESSIONAL) ; Layout→Breaks→Next Page से questions अलग section में।' },
      { n: 4, title: 'Section headings', text: 'प्रत्येक खंड (Section A/B) को <b>Heading 2</b> style दें — फिर TOC/Navigation और “Keep with next” से शीर्षक नीचे न चूकें।' },
      { n: 5, title: 'Marks कॉलम table', text: '2-column table: बाएँ प्रश्न (auto/numbered list), दाएँ marks (right-align)। हर प्रश्न को numbered list (multilevel) से जुड़ें।', tips: '“OR/वैकल्पिक” प्रश्न के लिए एक ही paragraph में <b>Shift+Enter</b> line break — दो numbered items नहीं।' },
      { n: 6, title: 'Answer space dotted line', text: 'खाली पंक्ति में tab डालें; Paragraph→Tabs→Leader=“…”, position जितनी चौड़ाई — dotted line हो जाएगी।', warn: 'नंबर “1)” auto list से आएँ, हाथ से टाइप न करें — हटाने पर क्रम बिगड़ता है।' },
      { n: 7, title: '“Page x of y” footer', text: 'Footer→Insert Page Number + <code>NumPages</code> field; signature block footer में; auto <code>DATE</code> field परीक्षा तारीख़ के लिए।' },
      { n: 8, title: 'Total marks &amp; PDF', text: 'marks कॉलम में <code>=SUM(ABOVE)</code> formula या manual total; फिर File→Print→A4 margins check, PDF/Print। Accessibility के लिए alt text व logical headings रखें।' }
    ] },

    { type: 'steps', items: [
      { n: 1, title: 'Cover page', text: 'Insert→Cover Page या अलग पहले section (continuous break नहीं — Next Page) ; title (Heading/WordArt), विद्यार्थी/roll no., guide, date (static)।' },
      { n: 2, title: 'Certificate', text: 'नया section (Next Page) ; Borders→Page border (Art); signature block table (right-align)।' },
      { n: 3, title: 'Acknowledgement &amp; Abstract', text: 'Heading 1 वाले छोटे अग्रभाग; page numbers यहाँ <b>i, ii (lowercase roman)</b> से start करें (Format Page Numbers→Start at)।' },
      { n: 4, title: 'Index / TOC', text: 'chapters Heading 1, sub-heading Heading 2 → References→Table of Contents (Automatic) — levels Show 2/3 रखें।' },
      { n: 5, title: 'Chapters', text: 'हर अध्याय Next Page से; numbering multilevel list (Heading से bound) से 1, 1.1, 1.1.1; figures पर caption + <code>SEQ</code>।' },
      { n: 6, title: 'Page numbers body में', text: 'असली pages पर numbers <b>1,2,3</b> (नया section → Start at 1) ; footer में <code>STYLEREF</code> से chapter नाम + <code>SEQ</code> “Fig 1.2”।', warn: 'sections न बनाकर roman/arabic एक साथ रखने की कोशिश करें — header “Link to Previous” OFF करना न भूलें।' },
      { n: 7, title: 'References &amp; PDF', text: 'Bibliography (manual या citation), फिर File→Save As PDF (PDF/A विकल्प यदि archive हो) ; Document Inspector से personal info हटाएँ।' }
    ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.9</span> Templates, styles reuse व Fields — productivity</h3>
      <p>एक बार सही template + style + field बनाइए, फिर हर फ़ाइल अपने-आप सही बनेगी। Normal को कभी सीधे न बिगड़ें — rename करके reset बेहतर।</p>` },

    { type: 'table', head: ['विषय', 'क्या/कैसे', 'नोट'],
      rows: [
        ['Template बनाना/सहेजना', 'File→Save As→“Word Template (.dotx)” ; New→Personal से खोलें', 'macro हो तो .dotm'],
        ['Normal reset', 'Word बंद → <code>%appdata%\\Microsoft\\Templates\\normal.dotm</code> rename (जैसे normal.old) → Word खोलें', 'गड़बर style/toolbar यहीं से ठीक होते हैं'],
        ['Quick Parts / Building Blocks', 'select text/छवि → Insert→Quick Parts→Save to Gallery; Organizer से exchange', 'footer/logo/box बार-बार एक click में'],
        ['Themes / Set As Default', 'Design→Themes/Colors/Fonts ; Set As Default (सभी नई docs)', 'college brand एक theme में'],
        ['Field codes operations', 'create <code>{ }</code>: <kbd>Ctrl+F9</kbd> ; toggle code: <kbd>Shift+F9</kbd> (selected) / <kbd>Alt+F9</kbd> (all) ; update: <kbd>F9</kbd> या <kbd>Ctrl+A</kbd>+<kbd>F9</kbd> ; unlink: <kbd>Ctrl+Shift+F9</kbd> ; lock: <kbd>Ctrl+Shift+F2</kbd>', 'linked field Ctrl+Shift+F9 से static हो जाता है'],
        ['Page/Date/Time shortcuts', 'Page number <kbd>Alt+Shift+P</kbd>, Date <kbd>Alt+Shift+D</kbd>, Time <kbd>Alt+Shift+T</kbd>', 'ये field डालते हैं (auto-update)'],
        ['Chapter numbering “(1.1)”', 'STYLEREF + SEQ field या multilevel list — <code>STYLEREF 1 \\s</code> chapter no, <code>SEQ Figure \\* ARABIC</code>', 'figure “Fig 1.3” स्वतः chapter-wise']
      ] },

    { type: 'table', head: ['Field', 'क्या दे', 'Field', 'क्या दे'],
      rows: [
        ['<code>PAGE</code>', 'वर्तमान page संख्या', '<code>NUMPAGES</code>', 'कुल pages (document)'],
        ['<code>SECTIONPAGES</code>', 'इस section के pages', '<code>DATE</code> / <code>TIME</code>', 'तारीख़ / समय (update)'],
        ['<code>FILENAME</code>', 'फ़ाइल का नाम (path options के साथ)', '<code>FILEPATH</code>', 'फ़ोल्डर पथ'],
        ['<code>TITLE</code> / <code>AUTHOR</code>', 'document property से शीर्षक/लेखक', '<code>NUMWORDS</code> / <code>NUMCHARS</code>', 'शब्द / वर्ण संख्या'],
        ['<code>STYLEREF</code>', 'किसी style (जैसे Heading 1) का पाठ — chapter heading footer में', '<code>SEQ</code>', 'क्रम संख्या (Figure 1, Table 2)'],
        ['<code>INCLUDETEXT</code>', 'दूसरी फ़ाइल का पाठ (embedded copy)', '<code>LINK</code>', 'बाहरी डेटा से live link (update on open)'],
        ['<code>TOC \\o \\h \\z \\u</code>', 'Table of Contents', '<code>INDEX</code> / <code>XE</code>', 'Index व its mark-up entry']
      ] },

    /* @@T2E@@ */
  ]
}
]);
