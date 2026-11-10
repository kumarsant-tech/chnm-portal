/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-sw2.js
   सॉफ़्टवेयर प्रैक्टिकल — 30 कार्य (200–229) + 84 प्रश्नों का क्विज़ + 170 शब्दों का शब्दकोश
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   1. सॉफ़्टवेयर प्रैक्टिकल लैब (कार्य 200–229)
   =================================================================== */
{
  id:'sw-labs', icon:'🧪', group:'सॉफ़्टवेयर प्रैक्टिकल',
  title:'सॉफ़्टवेयर प्रैक्टिकल लैब (30 कार्य)',
  sub:'विंडोज़ · MS Office · लिनक्स · नेटवर्क व सुरक्षा · डेटा कौशल — उद्देश्य, उपकरण, प्रक्रिया, परिणाम',
  kicker:'Software Practical · Labs 200–229',
  hero:'यहाँ <b>30 हाथ से करने वाले कार्य</b> हैं (क्रमांक <b>200 से 229</b>) — जैसे ITI वर्कशॉप की प्रैक्टिकल बुक में लिखे जाते हैं: <b>उद्देश्य (Aim), उपकरण (Tools), प्रक्रिया (Procedure), परिणाम (Result)</b>। हर कार्य के नीचे का ✓ दबाते ही आपकी प्रगति (progress) अपने आप सेव हो जाती है।',
  tags:['30 कार्य (200–229)','विंडोज़ 8','Office 5','लिनक्स 6','नेटवर्क-सुरक्षा 6','डेटा कौशल 5'],
  blocks:[

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.1</span> इस लैब का इस्तेमाल कैसे करें</h3>
      <p>हर कार्य <b>45–90 मिनट</b> का है। इसे करने से पहले संबंधित सिद्धांत (theory) वाला पेज एक बार पढ़ लीजिए — विंडोज़ के लिए <b>विंडोज़ मास्टरक्लास</b>, लिनक्स के लिए <b>लिनक्स मास्टरक्लास</b>, Office कार्यों के लिए <b>MS Office मास्टरक्लास</b>, और 220–225 के लिए <b>इंटरनेट व साइबर सुरक्षा</b>।</p>
      <ul>
        <li><b>कार्य का नंबर कभी मत बदलिए:</b> प्रगति (progress) कुंजी (key) <code>lab200</code>…<code>lab229</code> से बनती है — यही अंक पूरी लैब में आपका रिकॉर्ड नंबर है।</li>
        <li><b>एक कार्य = एक प्रैक्टिकल फ़ाइल पन्ना:</b> तारीख, कार्य 200, उद्देश्य, उपकरण, मुख्य 5–6 प्रक्रिया पंक्तियाँ, परिणाम के संख्यात्मक मान।</li>
        <li><b>सबूत (proof) ज़रूरी है:</b> हर कार्य के बाद स्क्रीनशॉट (कार्य 207 का तरीका) या कमांड का आउटपुट फ़ाइल में चिपकाइए। बिना सबूत के कार्य अधूरा माना जाएगा।</li>
        <li><b>लैब का PC साझा है:</b> कोई भी सेटिंग बदलने से पहले पुराना मान (old value) नोट कीजिए और कार्य खत्म होते वही यथास्थिति (restore) वापस लाइए।</li>
      </ul>`},

    {type:'table', head:['समूह (Group)','कार्य के नंबर','कितने','कौन-सा कौशल (Skill) बनता है'],
      rows:[
        ['A · ऑपरेटिंग सिस्टम (विंडोज़)','200–207','8','फ़ोल्डर योजना, शॉर्टकट, Task Manager, Disk Cleanup, Driver, Windows Update, Control Panel/Settings, Screenshot'],
        ['B · MS Office','208–213','6','Word (TOC + Styles), Excel (फ़ंक्शन), Excel (Pivot + Chart), PowerPoint (Master + Animation + Handout), Access (Table + Query), Outlook (Rules)'],
        ['C · लिनक्स (Linux)','214–219','6','Terminal navigation, chmod/chown permissions, grep + pipe + redirect, apt/dnf package install, Bash script, SSH key + config file'],
        ['D · नेटवर्क व सुरक्षा','220–225','6','ipconfig/DNS flush, Router review, Password manager, 2FA (दो-कारक), 3-2-1 Backup, Antivirus full scan'],
        ['E · डेटा कौशल','226–229','4','Batch rename, PDF merge/compress, OCR, Archive + Hash verification'],
        ['कुल','200–229','30','पूरा सॉफ़्टवेयर-हैंड्स-ऑन (Software hands-on)']
      ]},

    {type:'callout', kind:'info', title:'प्रैक्टिकल रिपोर्ट का 6-पंक्ति फ़ॉर्मेट', html:'<b>1)</b> कार्य संख्या + शीर्षक + तारीख <b>2)</b> उद्देश्य (Aim) <b>3)</b> उपकरण/सॉफ़्टवेयर (Tools) <b>4)</b> प्रक्रिया — जो-जो किया (मुख्य 5–6 पंक्तियाँ, कमांड अक्षरशः) <b>5)</b> परिणाम (Result) — संख्या/नाम/सफलता-असफलता + कारण <b>6)</b> सबूत — स्क्रीनशॉट/आउटपुट लॉग शिक्षक के हस्ताक्षर के साथ।'},

    {type:'labs', items:[

      {n:200, title:'फ़ोल्डर संरचना (Folder Structure) बनाना व फ़ाइल रखना',
       aim:'File Explorer (फ़ाइल एक्सप्लोरर) में बहु-स्तर फ़ोल्डर बनाकर, नामकरण नियम से फ़ाइलें सही जगह रखना और Move/Copy का फ़र्क़ समझना।',
       tools:['विंडोज़ वाला PC/लैपटॉप','File Explorer (Win + E)','5–8 नमूना फ़ाइलें (DOCX, XLSX, JPG, TXT)','फ़ोल्डर नामकरण नियम लिखा कागज़'],
       steps:['Win + E से File Explorer खोलिए और डेटा डिस्क (D: या E:) पर जाइए — C: डिस्क पर केवल OS रहता है, यह याद रखिए।',
        'नया फ़ोल्डर बनाइए: नाम <code>CHNM-2026</code>; उसके अंदर चार उप-फ़ोल्डर (subfolder) <code>Notes</code>, <code>Images</code>, <code>Assignments</code>, <code>Backup</code> — Ctrl + Shift + N से या Right-click → New → Folder से।',
        'हर फ़ोल्डर में कम से कम एक फ़ाइल रखिए और नामकरण नियम (naming rule) अपनाइए: <code>2026-11-05_Excel_SUM.docx</code> जैसा — तारीख_विषय_विषय-वस्तु।',
        'View टैब → Show → <b>File name extensions</b> और <b>Hidden items</b> चालू करके .docx/.txt एक्सटेंशन व छिपी फ़ाइलें दिखाइए।',
        'एक फ़ाइल को दूसरे फ़ोल्डर में ड्रैग करके <b>Move</b> कीजिए, फिर <b>Ctrl + ड्रैग</b> से <b>Copy</b> कीजिए — दोनों में फ़ाइल की गिनती और जगह का फ़र्क़ नोट कीजिए।',
        'F2 दबाकर एक फ़ोल्डर का नाम बदलिए; Ctrl + Z से वापस लाइए और Cut/Copy/Paste (Ctrl + X / C / V) से भी एक फ़ाइल स्थानांतरित कीजिए।',
        'Assignments फ़ोल्डर का शॉर्टकट Desktop पर बनाइए (Right-click → Send to → Desktop (create shortcut)) और Address bar में पथ (path) पढ़कर लिखिए।',
        'Explorer के Search बॉक्स में <code>ext:.docx</code> लिखकर केवल Word फ़ाइलें खोजिए और परिणाम गिनिए।'],
       result:'फ़ोल्डर ट्री (tree) का चित्र/स्क्रीनशॉट + कौन-सी फ़ाइल किस पथ (path) पर है, कितनी Move हुई, कितनी Copy हुई — तालिका में लिखिए।'
      },

      {n:201, title:'शॉर्टकट (Shortcut) व Hot key बनाना, कीबोर्ड शॉर्टकट का अभ्यास',
       aim:'Desktop/Start menu में शॉर्टकट बनाना, शॉर्टकट की Hot key व Icon बदलना और रोज़ के 10 कीबोर्ड शॉर्टकट आदत बनाना।',
       tools:['विंडोज़ PC','कोई भी इंस्टॉल्ड प्रोग्राम (जैसे Calculator, WordPad, Notepad)','System32 फ़ोल्डर तक पहुँच','Notepad (सूची के लिए)'],
       steps:['Desktop पर Right-click → New → Shortcut → Browse से प्रोग्राम चुनिए; Calculator के लिए <code>C:\\Windows\\System32\\calc.exe</code> टाइप करके Next → Finish कीजिए।',
        'शॉर्टकट पर Right-click → Properties → <b>Shortcut key</b> में अक्षर <code>Q</code> दबाइए (अपने आप <code>Ctrl + Alt + Q</code> बनता है) → Apply → Desktop पर आकर hot key से चलाकर देखिए।',
        'उसी Properties विंडो में <b>Change Icon</b> से icon बदलिए, <b>Target</b> और <b>Start in</b> फ़ील्ड पढ़कर अलग-अलग नोट कीजिए — Target = असली फ़ाइल का पथ, शॉर्टकट सिर्फ़ 1 KB का निर्देशन भर है।',
        'किसी प्रोग्राम पर Right-click → <b>Pin to taskbar</b> और Start menu → All apps → Right-click → Pin to Start कीजिए; बाद में Unpin करके फ़र्क़ देखिए।',
        'यह शॉर्टकट नोटबुक में लिखिए और 2 बार practice कीजिए: Win + E (Explorer), Win + D (Show Desktop), Win + L (Lock), Win + R (Run), Ctrl + Shift + Esc (Task Manager), Alt + F4 (बंद करें), F2 (नाम बदलें), Ctrl + Z (Undo), Win + Tab (Task View), Ctrl + Shift + N (नया फ़ोल्डर)।',
        'Taskbar के किसी आइकन पर Right-click करके <b>Jump list</b> (हाल की फ़ाइलें) दिखाइए और Start menu में टाइप करके सबसे तेज़ खोज (type-to-search) आजमाइए।',
        'शॉर्टकट तोड़कर देखिए: असली .exe का नाम बदलिए, फिर शॉर्टकट चलाइए — "can\'t find this file" त्रुटि का अर्थ लिखिए और शॉर्टकट दोबारा ठीक कीजिए।'],
       result:'बनाए 3 शॉर्टकट का नाम, Target पथ, Hot key और Jump list का फ़र्क़ लिखिए; 10 कीबोर्ड शॉर्टकट की अपनी सूची संलग्न कीजिए।'
      },

      {n:202, title:'Task Manager (कार्य प्रबंधक) से सिस्टम जाँच',
       aim:'प्रोसेसर/मेमोरी का उपयोग पहचानना, बिना जवाब दिए (Not Responding) प्रोग्राम बंद करना, Startup प्रोग्राम घटाकर बूट तेज़ करना।',
       tools:['चालू Windows PC','Task Manager (Ctrl + Shift + Esc)','Notepad + एक भारी प्रोग्राम (बहुत सारे टैब वाला ब्राउज़र/वीडियो)','नोट करने के लिए टैबलेट/कागज़'],
       steps:['Ctrl + Shift + Esc से Task Manager खोलिए; छोटा view हो तो <b>More details</b> दबाइए।',
        'Processes टैब के CPU, Memory, Disk, Network कॉलम पढ़िए — सबसे ज़्यादा खपत करने वाले 3 प्रोसेसर के नाम व % नोट कीजिए; कॉलम शीर्षक पर क्लिक करके क्रम बदलें (sort)।',
        'Notepad में 3 बड़ी फ़ाइलें खोलकर उसकी Memory लाइन में बढ़ोतरी देखिए — इससे समझेगा कि RAM खपत कैसे मापी जाती है।',
        'जान-बूझकर एक प्रोग्राम को हैंग करवाइए (बड़ी फ़ाइल के साथ) और शीर्षक पर "Not Responding" देखकर Select → <b>End task</b> कीजिए; खुला काम खो जाने का अनुभव लिखिए (Force close का जोखिम)।',
        'Startup टैब (Windows 11 में Startup apps) में Enabled प्रोग्राम गिनिए; किसी एक को Disable करके अगला बूट ले लीजिए और बूट समय/फ्री RAM का फ़र्क़ नोट कीजिए (शिक्षक की अनुमति से)।',
        'Performance टैब से CPU का नाम, कोर/थ्रेड संख्या, RAM की Total/In use स्लॉट जानकारी, डिस्क का प्रकार (HDD/SSD/M.2) और GPU का नाम लिखिए।',
        'Details/Services टैब में किसी svchost समूह को देखिए; "Go to service(s)" से services.msc का संबंध समझिए — सेवा बंद/स्टार्ट केवल शिक्षक की देखरेख में करें।',
        'App history टैब (यदि उपलब्ध) से पिछले उपयोग का रिकॉर्ड देखिए और Task Manager को ही बंद करके फिर खोलिए — यह प्रोग्राम स्वयं प्रोसेसर है, इसे समझाइए।'],
       result:'सबसे भारी 3 प्रोसेसर + उनका %, Total/In-use RAM, डिस्क प्रकार, Enabled Startup प्रोग्राम की गिनती और Disable करने का असर — सब तारीख के साथ तालिका में लिखिए।'
      },

      {n:203, title:'Disk Cleanup, Storage Sense व Temp फ़ाइल सफ़ाई',
       aim:'डिस्क की अनावश्यक फ़ाइलें (temporary, recycle bin, update leftovers) हटाकर जगह बनाना और सफ़ाई का मापना।',
       tools:['Windows PC (कम से कम 10 GB भरी डिस्क)','Disk Cleanup (<code>cleanmgr</code>)','Settings → System → Storage','%temp% फ़ोल्डर','पहले/बाद के आँकड़े लिखने का फ़ॉर्म'],
       steps:['This PC → C: पर Right-click → Properties: Total size व Free space नोट कीजिए (यही "पहले" का मान)।',
        'Win + R → <code>cleanmgr</code> → C: → OK;elist में Temporary files, Recycle Bin, Thumbnails, Windows Update Cleanup पर tick दीजिए।',
        '<b>Clean up system files</b> दबाइए — इससे पुराने Windows Update इंस्टॉलेशन व Defender की छवि (previous installation) भी दिखाई देती हैं; चुनकर OK करें।',
        'Settings → System → Storage → <b>Temporary files</b> में जाकर इसी तरह (similar) की categories tick करके Remove files कीजिए; यहीं Downloads फ़ोल्डर हटाने का विकल्प सावधानी से देखिए (गलती से अपना काम न मिटाएँ)।',
        'Win + R → <code>%temp%</code> → Ctrl + A → Delete; जो फ़ाइलें "in use" होने से मना करें उन्हें <b>Skip</b> दीजिए — इसका कारण समझाइए (प्रोग्राम खुला है)।',
        'Storage Sense (Same settings page) चालू करके schedule सेट कीजिए — कितने दिन बाद Temp/Recycle Bin खाली हो, Downloads को कब न छुएँ, यह तय कीजिए।',
        'Recycle Bin खोलकर पहले उसकी फ़ाइलें देखिए: Right-click → <b>Restore</b> (असली जगह वापस) बनाम <b>permanently delete</b> (अंतिम) — एक फ़ाइल restore करके जाँचिए।',
        'फिर C: → Properties खोलिए; Free space का नया मान लिखकर अंतर (MB/GB) निकालिए।'],
       result:'पहले Free space ___, बाद में ___, छूटी जगह ___ MB; किन 5 फ़ोल्डर/श्रेणियों से सबसे ज़्यादा जगह आई — तालिका बनाइए।'
      },

      {n:204, title:'Device Manager (उपकरण प्रबंधक) से ड्राइवर जाँच व प्रबंधन',
       aim:'ड्राइवर (Driver) पहचानना, अपडेट/रोलबैक/अनइंस्टॉल करना और पीले चिह्न (⚠) वाला device ठीक करना।',
       tools:['Windows PC','<code>devmgmt.msc</code> (Win + X → Device Manager)','एक USB pen drive/mouse','शिक्षक द्वारा दिया ड्राइवर पैकेज या निर्माता साइट (अनुमति से)'],
       steps:['Win + X → <b>Device Manager</b> खोलिए; जिस device पर ⚠/❔ या "Unknown device" है, उनकी सूची बनाइए (यही इस कार्य का मुख्य काम)।',
        'किसी एक device पर Right-click → Properties → <b>Driver</b> टैब: Driver Provider, Driver Version, Driver Date नोट कीजिए; Resources टैब में IRQ/Memory range भी देखिए।',
        '<b>Update driver</b> → Search automatically (अनलाइन उपलब्ध हो) अथवा Browse my computer → teacher-provided फ़ोल्डर चुनिए; असर (⚠ गया/नहीं गया) लिखिए।',
        'नया ड्राइवर लगने के बाद device खराब चले तो <b>Roll Back Driver</b> से पुराना ड्राइवर वापस लाइए और Reboot करके जाँचिए।',
        '<b>Uninstall device</b> करें (जो checkbox "delete driver software" कहता है उसे केवल शिक्षक के कहने पर tick करें) → ऊपर Action → <b>Scan for hardware changes</b> से दोबारा पहचान करवाइए।',
        'View → <b>Show hidden devices</b> से non-present (पुराने USB/Bluetooth) entries देखिए और पुरानी हटाइए — गलत/पुराना ड्राइवर भी यही समस्या देता है।',
        'Pen drive लगाकर-निकालकर "Universal Serial Bus controllers" में entry आना-जाना देखिए; Device Status लाइन "The device is working properly" का अर्थ लिखिए।',
        'किसी device पर Right-click → Properties → General में Location/Bus number पढ़कर बताइए कि वह onboard है या USB पोर्ट पर; फिर Disable device करके केबल/माउस का असर देखकर Enable वापस कीजिए।'],
       result:'3 devices का नाम + driver version + ⚠ वाला device कौन-सा था, क्या किया (Update/Rollback/Reinstall) और निदान — 6 पंक्ति रिपोर्ट लिखिए।'
      },

      {n:205, title:'Windows Update (विंडोज़ अद्यतन) की पूरी जाँच',
       aim:'OS का संस्करण/बिल्ड पहचानना, अपडेट चेक/इंस्टॉल/पॉज़ करना और असफल अपडेट का error code दर्ज करना।',
       tools:['इंटरनेट से जुड़ा Windows PC','Settings → Windows Update','<code>winver</code> (Win + R में)','Notepad (KB नंबर व तारीख के लिए)'],
       steps:['Win + R → <code>winver</code> → OK: Windows का संस्करण (edition), Version (जैसे 22H2/23H2/24H2) व OS build संख्या अक्षरशः नोट कीजिए।',
        'Settings → Windows Update → <b>Check for updates</b> चलाइए; आने वाले update का नाम (Quality update / Definition update / Driver) लिखिए।',
        'Install से पहले कार्य save करके <b>Restart now</b> / <b>Pause for 1 week</b> के फ़र्क़ समझिए; Update options → Active hours और Metered connection देखिए।',
        '<b>Update history</b> खोलकर Installed updates की KB संख्याएँ (जैसे KB503xxxx) व तारीखें लिखिए; Failed वाले में error code नोट कीजिए।',
        'Advanced options में "Receive updates for other Microsoft products" व Optional updates (Driver updates) खोलकर देखिए कि ड्राइवर यहीं भी आते हैं।',
        'अपडेट अटकें तो: Settings → System → Troubleshoot → Additional troubleshooters → <b>Windows Update</b> चलाइए और परिणाम लिखिए; services.msc में <b>Windows Update (wuauserv)</b> की स्थिति केवल शिक्षक से जाँचवाइए।',
        'डिस्क जगह (Disk Cleanup का Windows Update Cleanup) और restart के बाद "Getting Windows ready" का अर्थ चर्चा कीजिए — यह स्टेज बीच में बंद करने का खतरा लिखिए।'],
       result:'OS edition/version/build, मिली 3 KB संख्याएँ, update status, error code (यदि हो) और pause/active hours की सेटिंग — तारीख के साथ तालिका बनाइए।'
      },

      {n:206, title:'Control Panel व Settings app की ज़रूरी सेटिंग्स',
       aim:'परंपरागत Control Panel और नए Settings app की अंतर समझना; Power options, Date format, Default apps, Display scale, User accounts बदलकर यथास्थिति लाना।',
       tools:['Windows PC','Win + R → <code>control</code> / <code>desk.cpl</code> / <code>powercfg.cpl</code>','पहले-बाद के मान लिखने का फ़ॉर्म'],
       steps:['Win + R → <code>control</code>: Control Panel का "Category" बनाम "Small icons" view फ़र्क़ देखिए और 8 applet के नाम लिखिए (System, Programs, Network and Sharing Center, Power Options, Device Manager, Folder Options, Date and Time, User Accounts)।',
        '<code>powercfg.cpl</code> (या Control Panel → Hardware and Sound → Power Options): Balanced → High performance बदलकर Screen turn off/ Sleep timer जाँचिए, फिर Balanced वापस लाइए।',
        'Control Panel → Clock and Region → Date and Time → Change date and time formats में <code>dd-MM-yyyy</code> सेट करके Taskbar clock पर असर देखिए; फिर मूल मान वापस कीजिए।',
        'Settings → Apps → Default apps से browser/media player/PDF viewer बदलिए और किसी .pdf/.mp3 फ़ाइल खोलकर file association का असर जाँचिए।',
        'Settings → System → Display: Resolution व Scale (100%/125%) बदलकर text/आइकन का आकार देखिए; "Keep changes" countdown का काम और Alt + Tab, Win + P (project) आजमाइए।',
        'Control Panel → User Accounts → Change User Account Control settings: slider के स्तर व "Yes/No" के मतलब समझिए — लैब PC पर स्तर यथावत छोड़ दीजिए।',
        'Folder Options (File Explorer → View → Options) में "Show hidden files" व "Hide extensions" के checkbox बदलकर देखिए; Same में Taskbar/Start settings (Settings → Personalization → Taskbar) की तुलना कीजिए।',
        'Win + R → <code>msconfig</code> खोलकर केवल <b>देखिए</b> (System configuration के Boot/Services टैब), Selective startup का मतलब समझाइए और OK → Exit without restart — लैब PC की boot सेटिंग मत बदलिए।'],
       result:'बदली गई 5 सेटिंग्स का पहले/बाद का मान + हर सेटिंग का Control Panel applet नाम (<code>desk.cpl</code> आदि) और Settings app का पथ लिखिए।'
      },

      {n:207, title:'Screenshot (स्क्रीन कैप्चर) टूल्स व चित्र जोड़ना',
       aim:'विंडोज़ के चार अलग तरीकों से स्क्रीनशॉट लेकर उन्हें Paint/Word में जोड़कर कैप्शन (caption) के साथ सहेजना।',
       tools:['Windows PC','PrtScn / Alt + PrtScn / Win + PrtScn / Win + Shift + S','Snipping Tool (या Snip & Sketch)','Paint या Word','PNG व JPG में सेव करने की सुविधा'],
       steps:['<b>PrtScn</b> दबाकर पूरी स्क्रीन Clipboard (क्लिपबोर्ड) में लीजिए; Paint खोलकर Ctrl + V paste कीजिए और PNG में <code>lab207_full.png</code> नाम से सेव कीजिए।',
        'कोई विंडो active करके <b>Alt + PrtScn</b> दबाइए → Paste; पहले वाले में फ़र्क़ दिखाइए (पूरी स्क्रीन बनाम केवल विंडो) और clipboard की अवधारणा (RAM का अस्थायी भंडार) समझाइए।',
        '<b>Win + Shift + S</b> से Snipping Tool का clip चुनिए — Rectangular / Freeform / Window / Fullscreen — चारों से एक-एक लीजिए; notification पर क्लिक कर एडिट खोलिए।',
        '<b>Win + PrtScn</b> दबाते ही स्क्रीन एक पल झपकेगी — <code>Pictures\\Screenshots</code> फ़ोल्डर में फ़ाइल अपने आप सेव होती है; वहाँ जाकर नाम व आकार जाँचिए।',
        'Snipping Tool में <b>Delay</b> (3–5 सेकंड) लगाकर menu खुला हुआ screenshot लीजिए — यही गिरती हुई विंडो/मेनू पकड़ने का तरीका है; pen/highlighter से तीर (arrow) बनाइए।',
        'तीन screenshot Word में paste करके हर एक का कैप्शन लिखिए (चित्र-1 Task Manager) और उन्हें सँवारकर 1 पेज नोट बनाइए; File → Save As में PNG बनाम JPG का आकार तुलना कीजिए।',
        'Screen recording के लिए Snipping Tool का Record विकल्प (उपलब्ध हो) या Xbox Game Bar (<b>Win + G</b>) से 15 सेकंड का क्लिप बनाइए; दोनों में फ़ाइल का location जाँचिए।',
        'Clipboard history (<b>Win + V</b>) चालू करके 2 screenshot रखकर दोबारा-paste का अभ्यास कीजिए और Screen Reader (Win + Ctrl + Enter) के बारे में केवल जानकारी लीजिए (सुनकर बंद करें)।'],
       result:'चार तरीकों की तालिका — क्या clipboard में जाता है / कहाँ सेव होता है / कौन-सा tool चाहिए; Word नोट फ़ाइल + 3 screenshot सबूत के रूप में जमा कीजिए।'
      },

      {n:208, title:'Word में लंबा दस्तावेज़ — Styles, Table of Contents व Header/Footer',
       aim:'8–10 पृष्ठ का दस्तावेज़ (document) बनाकर Heading styles, स्वचालित सामग्री (TOC), page numbering, section break व cross-reference से पेशेवर स्वरूप देना।',
       tools:['MS Word (या Writer/Richeditor जैसा FREE विकल्प)','10–12 पेज का पाठ (अपनी सिद्धांत नोट से)','1–2 चित्र','PDF में save करने की सुविधा'],
       steps:['नई फ़ाइल में 5 अध्याय बनाइए; अध्याय के शीर्षक पर <b>Heading 1</b>, उप-शीर्षक पर <b>Heading 2</b>, body text पर <b>Normal</b> style लगाइए — style Home टैब की gallery से (सीधे font बड़ा करके शीर्षक बनाना ग़लत है, कारण लिखिए)।',
        'Cursor पहले पृष्ठ पर रखकर <b>References → Table of Contents → Automatic Table 1</b> लगाइए; बाद में कोई heading बदलकर TOC पर Right-click → <b>Update Field → Update entire table</b> करके जाँचिए।',
        'Insert → Header में दस्तावेज़ का नाम + class; Insert → Footer → Page Number → Bottom Center; Page Number → Format में "Total pages" field लगाकर "पृष्ठ 3 / 10" जैसा बनाइए।',
        'Layout → Breaks → <b>Section Break (Next Page)</b> cover page के बाद लगाइए और page numbering को Section 2 से 1 पर "Start at" करके चलाइए — Cover पर संख्या न दिखे, यह सेट कीजिए।',
        'Insert → Picture लगाकर चित्र के साथ <b>References → Insert Caption</b> (Label = चित्र/Figure) दीजिए; दूसरे स्थान से Insert → Cross-reference से "चित्र-2" का नाम बुलाइए।',
        'Table बनाइए (Insert → Table 6×4) → Design/Layout से शीर्षक पंहर (Repeat Header Rows) व text wrapping "None" करके अगले पेज पर छोड़िए।',
        'Review टैब: Word Count (शब्द/पृष्ठ नोट करें), Spelling & Grammar (F7), Thesaurus और AutoCorrect options (गलत वर्तनी अपने आप सुधारने की entries) देखिए।',
        'Ctrl + F से "RAM" खोजिए और Ctrl + H (Replace) से पहले स्थान पर "RAM (Random Access Memory)" बदलकर पुरा दस्तावेज़ में first-use नियम लागू कीजिए; अंत में File → Save As → PDF बनाकर दोनो फ़ाइलें जमा कीजिए।'],
       result:'DOCX + PDF फ़ाइल, TOC वाला पृष्ठ का स्क्रीनशॉट, 3 इस्तेमाल किए गए style के नाम, कुल शब्द संख्या व पृष्ठ संख्या, और "Section break क्यों ज़रूरी था" 3 पंक्तियों में लिखिए।'
      },

      {n:209, title:'Excel में फ़ंक्शन (Functions) व फ़ॉर्म्युले — Marks sheet',
       aim:'SUM, AVERAGE, MAX, MIN, COUNT, ROUND, IF, VLOOKUP और Relative/Absolute reference से 20 छात्रों की marks report बनाना।',
       tools:['MS Excel (या Calc/OnlyOffice)','पहले से बनी data sheet (Roll, Name, Subject-1/2/3 marks)','फ़ॉर्म्युले लिखने का फ़ॉर्म'],
       steps:['Sheet "Marks" में A1:F20 तक data भराइए: A=Roll, B=Name, C–E=तीन विषयों के अंक (0–100)।',
        'F2 में <code>=SUM(C2:E2)</code> लिखकर Fill handle (cell के नीचे-दाएँ कोने का छोटा वर्ग) से F20 तक खींचिए; formula bar में असली फ़ॉर्म्युला व cell में मान दिखता है — यह फ़र्क़ समझाइए।',
        'नीचे summary पंक्ति बनाइए: <code>=AVERAGE(F2:F20)</code>, <code>=MAX(F2:F20)</code>, <code>=MIN(F2:F20)</code>, <code>=COUNT(C2:C20)</code>, <code>=COUNTA(B2:B20)</code> — COUNT बनाम COUNTA का अंतर लिखिए।',
        'Percentage के लिए नया कॉलम: <code>=ROUND(F2/300*100,2)</code> और Home → Number group में % / 2 decimal format लगाइए।',
        'Result कॉलम: <code>=IF(G2>=33,"PASS","FAIL")</code); Grade कॉलम nested IF: <code>=IF(G2>=80,"A",IF(G2>=60,"B",IF(G2>=40,"C","D")))</code>।',
        'नई sheet "Master" में Roll → Fee तालिका (A:B) बनाइए; Marks sheet में <code>=VLOOKUP(A2,Master!$A:$B,2,FALSE)</code> लगाइए — 4 arguments का मतलब एक-एक करके लिखिए और $ (absolute) हटाकर देखिए क्या टूटता है।',
        'किसी cell में F4 दबाकर C2 → $C$2 बनाइए; फिर फ़ॉर्म्युला नीचे copy करके Relative/मिश्रित (mixed) reference का फ़र्क़ नोट कीजिए।',
        'View → Freeze Panes → Freeze Top Row; Home → Conditional Formatting में percentage कॉलम पर ">=80 हरा, <33 लाल" rule लगाइए; अंत में Sheet का नाम बदलकर .xlsx में save कीजिए।'],
       result:'फ़ाइल जमा + 6 फ़ॉर्म्युले के असली मान (पहली, टॉपर और औसत पंक्ति), VLOOKUP के 4 arguments की व्याख्या और <code>#DIV/0!</code> तथा <code>#REF!</code> जान-बूझकर बनाकर उनका कारण लिखिए।'
      },

      {n:210, title:'Excel में PivotTable व Chart — सारांश विश्लेषण',
       aim:'50 पंक्तियों के सिले (sales/marks) data से PivotTable, Grouping, Filter और Column/Pie/Line chart निकालना।',
       tools:['Excel/Calc','50 पंक्ति sample data (Date, Student/Region, Subject/Product, Marks/Sales)','पहले से बनी Marks sheet (कार्य 209)'],
       steps:['Data को <b>Table</b> में बदलिए (Ctrl + T, "My table has headers" tick) — हर कॉलम का शीर्षक अद्वितीय (unique) रखिए, खाली पंक्ति/मर्ज सेल न रखिए।',
        'Insert → <b>PivotTable</b> → New Worksheet; Fields में Rows = Subject, Values = Sum of Marks रखकर 31×4 सारांश देखिए।',
        'Values पर Right-click → Number Format; फिर Value Field Settings → Show Values As → <b>% of Grand Total</b> लगाकर अनुपात निकालिए।',
        'Rows में Date खेतो (drag) और Right-click → Group → Months/Quarters; Regions/Names के लिए PivotTable Analyze → <b>Insert Slicer</b> लगाकर filter को माउस से चलाइए।',
        'PivotTable select करके Insert → <b>PivotChart</b> → Clustered Column; chart का title, legend, Data Labels और axis title जोड़िए; Chart Design → Change Colors से theme बदलिए।',
        'साथ ही सादा चित्र भी बनाइए: Pie (3 विषयों का भाग), Line (5 महीनों का trend), Column (छात्रों की तुलना) — तीनों कब उपयोगी हैं, एक-एक पंक्ति में लिखिए; 3-D चित्र पाठ्य-पुस्तक/बोर्ड रिपोर्ट में क्यों नहीं बनाते, कारण लिखिए।',
        'PivotTable पर Right-click → Refresh करके data में 2 नई पंक्तियाँ जोड़कर सारांश बदलता है या नहीं जाँचिए; Source data में ग़लती (text में number) रखकर <code>#VALUE!</code> देखिए और ठीक कीजिए।',
        'PivotTable का एक पल का निष्कर्ष Word/Excel नोट में लिखिए: सबसे अच्छा subject, सबसे कम region, top 3 — "Pivot se kya nishkarsh nikla" 5 पंक्तियाँ।'],
       result:'PivotTable + 3 chart वाली फ़ाइल जमा कीजिए; Rows/Values/Slicer क्या-क्या दिखाया, Grand Total का मान और trend का 3 पंक्ति निष्कर्ष लिखिए।'
      },

      {n:211, title:'PowerPoint — Slide Master, Animation, Transition व Handout',
       aim:'Slide Master से पूरी presentation का रूप एक जगह बदलना, Transition/Animation का फ़र्क़ करना और Handout/Notes page छापना।',
       tools:['MS PowerPoint (या Impress)','10 slides का पाठ (अपने विषय से)','School logo की PNG image','प्रिंटर/Print to PDF'],
       steps:['View → <b>Slide Master</b>: सबसे ऊपर की Master slide चुनकर title font, placeholder position, logo (Insert → Picture → bottom-right) और Footer (Insert → Header & Footer → Slide number + Date) लगाइए; अब सभी layout पर अपने आप असर दिखेगा।',
        'Master में <b>Duplicate Layout</b> से "Content + Image" लेआउट और <b>Insert Layout</b> से "Title only" लेआउट बनाइए; Close Master View के बाद Home → New Slide → Choose Layout में दोनों दिखाइए।',
        '10 slides भरते समय एक slide पर 6Bullet से अधिक न रखिए; SmartArt (Process/Cycle) और Table से विषय-वस्तु सँवारिए; हर slide का title 40 अक्षर से कम रखिए।',
        'Transitions टैब: <b>Fade</b> सभी slides पर → <b>Apply To All</b>; फिर सिर्फ़ title slide पर <b>Push</b>, Duration 1 सेकंड; "On Mouse Click" ON और "Advance Slide after" OFF का फ़र्क़ समझाइए।',
        'Animations टैब: text पर <b>Appear</b> (Start: With/After Previous, Delay), image पर <b>Fly In</b> (Direction: From Bottom) और <b>Animation Pane</b> से क्रम (reorder) बदलकर 1 पर Exit animation लगाइए — Transition बनाम Animation का फ़र्क़ 4 पंक्तियों में लिखिए।',
        'Insert → Slide Number/Date & Time/Footer "Apply to All" से छोड़कर title slide पर "Don\'t show" करिए; Notes page में हर slide का बोल-नोट (speaker script) लिखिए।',
        'Slide Show → From Beginning (F5) और From Current Slide (Shift + F5) चलाइए;presentation के दौरान B (black), W (white), N (notes) और number+Enter keys आजमाइए।',
        'File → Print → Settings में <b>Handouts: 3 Slides Horizontal</b> (lines के साथ) और <b>Notes Pages</b> चुनकर PDF/प्रिंट कीजिए; फिर Save As में .pptx, .pdf और .ppsx ( slideshow, सीधे चलने वाली) बनाइए।'],
       result:'Master से बदले रूप का पहले/बाद स्क्रीनशॉट, 1 transition + 2 animation के सेटिंग मान (Start/Delay/Duration), 3-per-page handout का PDF और F5/Shift + F5 का फ़र्क़ लिखिए।'
      },

      {n:212, title:'MS Access — Table, Primary Key, Form व Select Query',
       aim:'रिलेशनल डेटाबेस (Relational Database) बनाकर Table + Primary Key, Relationships, Data Entry Form और शर्त वाली Query बनाना व SQL view पढ़ना।',
       tools:['MS Access (एक्सेस)','कुल 20 छात्रों का data','चर्चा हेतु Excel की वही Marks sheet'],
       steps:['Access → <b>Blank Database</b> → फ़ाइल नाम <code>college.accdb</code> (2007 के बाद की एक्सटेंशन; पुरानी .mdb है — फ़र्क़ नोट कीजिए)।',
        '<b>Table Design</b> में <code>Student</code> table बनाइए: RollNo (AutoNumber, Primary Key), Name (Text/Short Text), Class (Text), Marks (Number), DOB (Date/Time), Remarks (Yes/No) — हर field का Data Type व Field Size लिखिए।',
        'Primary Key पर Right-click → Primary Key का काम समझाइए (रिकॉर्ड अद्वितीय + पहचान); "Duplicates not allowed" message आने पर Name को key क्यों नहीं बनाते — कारण लिखिए; 15–20 रिकॉर्ड Enter से डालिए।',
        'दूसरी table <code>Class</code> (ClassID PK, ClassName) बनाइए; Database Tools → <b>Relationships</b> से Student.Class ↔ Class.ClassID जोड़िए और <b>Enforce Referential Integrity</b> tick करके Show Update/Delete Rules देखिए।',
        'Create → <b>Form</b> (Form Design/Use Forms) से एक-एक रिकॉर्ड भरण वाला फ़ॉर्म बनाइए; Tab order और combo box (Row Source = Class table) लगाइए।',
        'Create → <b>Query Design</b> में Student डालकर Fields में Name, Marks; Criteria पंक्ति में Marks पर <code>&gt;=60</code> लिखिए, Sort → Descending; Run (!) दबाकर परिणाम गिनिए।',
        'Query के Design view में टूल → <b>SQL View</b> खोलकर उत्पन्न पंक्ति पढ़िए (<code>SELECT Name, Marks FROM Student WHERE Marks>=60 ORDER BY Marks DESC;</code>) और हर क्लॉज़ का अर्थ लिखिए।',
        'Create → Report (Layout: Columnar/Tabular) से print-ready रिपोर्ट बनाइए; Database Tools → <b>Compact and Repair Database</b> चलाइए; अंत में Excel vs Access के 4 अंतर (table size, relationship, multi-user, query/report) तालिका में लिखिए।'],
       result:'<code>.accdb</code> फ़ाइल जमा; Query का SQL view स्क्रीनशॉट, Primary Key का काम, Referential Integrity से रोक गया 1 ग़लत entry और Total/Pass रिकॉर्ड की गिनती लिखिए।'
      },

      {n:213, title:'Outlook — Rules, Signature, Calendar व To/CC/BCC',
       aim:'ईमेल क्लाइंट (email client) में Rules से incoming mail स्वत: वर्गीकृत करना, signature बनाना, meeting invite भेजना और To/CC/BCC का फ़र्क़ सिद्ध करना।',
       tools:['Outlook (desktop या web) / Edu-mail','5–10 भेजे/प्राप्त किए test messages','2 सहपाठियों के email पते','एक छोटी attachment (1–3 MB)'],
       steps:['Inbox खोलकर 3 message Read/Unread चिह्नित करके filter (Unread only) का फ़र्क़ देखिए; Search bar में <code>from:teacher</code> व <code>hasattachment:yes</code> जैसी filters आजमाइए।',
        'किसी message पर Right-click → <b>Rules → Create Rule</b> → "from <शिक्षक>" को subfolder <code>College</code> में भेजने का नियम बनाइए; Home → Rules → <b>Manage Rules & Alerts</b> → Run Rules Now चलाकर जाँचिए कि पुराने mail भी shift हुए या नहीं।',
        'Rule के प्राथमिकता (rule order) व exception देखिए; एक दूसरा नियम बनाइए जिसमें subject में "homework" हो तो message highlighted/huge-flag के साथ आए; दोनो का interaction लिखिए।',
        'Mail → <b>Signature</b> → New: नाम, class, फ़ोन, institution लिखकर "New messages" व "Replies/forwards" दोनों में choose कीजिए; नया mail भेजकर signature जाँचिए।',
        'नए mail में To = 1 छात्र, CC = दूसरा, BCC = तीसरा रखकर भेजिए; तीनों प्राप्तकर्ताओं से जाँचिए कि <b>BCC</b> का पता दूसरों को नहीं दिखता — To/CC/BCC की 4-पंक्ति व्याख्या लिखिए।',
        'Calendar → New Appointment (11:00–12:00) → 2 attendees invite → Reminder 15 min → Recurring: Daily/Weekly; Free/Busy status और Response (Accept/Tentative) आना देखिए; Time zone बदलकर फ़र्क़ जाँचिए।',
        '1–3 MB attachment भेजकर size limit का संदेश देखिए; बड़ी फ़ाइल के लिए cloud link (OneDrive/Drive share) भेजने का तरीका और security फर्क़ समझाइए; Junk Email options में Blocked Senders व Safe list देखिए।',
        'Tasks/Flags: किसी message पर Follow-up flag (कल 9 AM) लगाइए; Sweep/Purge (पुराने mail हटाने वाला विकल्प) केवल demo folder में चलाइए; अंत में सारी Rules Export/Back up करने का विकल्प नोट कीजिए (काम न करें, केवल पथ देखें)।'],
       result:'बनाए 2 Rules के नाम + शर्त + action, signature का नमूना, To/CC/BCC प्रयोग का निष्कर्ष, meeting invite की details और attachment limit का संदेश — सब स्क्रीनशॉट के साथ लिखिए।'
      },

      {n:214, title:'लिनक्स टर्मिनल — Navigation व File operations',
       aim:'Linux terminal (real / VirtualBox / WSL) में pwd, ls, cd, mkdir, cp, mv, rm, cat, touch, ln से फ़ाइल सिस्टम घूमना व लॉग बनाना।',
       tools:['Linux (Ubuntu/Debian या Fedora/RHEL) / WSL','Terminal emulator','शिक्षक का PC या VM (snapshot लेने का अधिकार)'],
       steps:['<code>pwd</code> (print working directory) से वर्तमान पथ; फिर <code>ls</code>, <code>ls -l</code>, <code>ls -a</code>, <code>ls -lh</code> — हर विकल्प (option/flag) का फ़र्क़ output चिपकाकर दिखाइए; छिपी फ़ाइलें dot (.) से शुरू होती हैं।',
        '<code>cd ~</code> (home), <code>cd ..</code> (parent), <code>cd /</code> (मूल/root), <code>cd -</code> (पिछला) — हर बार <code>pwd</code> से पुष्टि कीजिए और prompt में ~ चिह्न का मतलब लिखिए।',
        '<code>mkdir lab214</code> → <code>cd lab214</code> → <code>touch a.txt</code> → <code>cp a.txt b.txt</code> → <code>mv b.txt c.txt</code> → <code>cat c.txt</code> → <code>rm c.txt</code> → <code>rmdir ../lab214</code> या <code>rm -r lab214</code>; rmdir और rm -r का फ़र्क़ लिखिए (खाली directory बनाम भीतरी फ़ाइलें)।',
        '<code>echo "Linux lab" &gt; note.txt</code> से फ़ाइल बनाइए, <code>echo "line 2" &gt;&gt; note.txt</code> से जोड़िए और <code>cat note.txt</code>, <code>less note.txt</code> (q से बाहर) से पढ़िए — &gt; overwrite करता है, &gt;&gt; append, यह सिद्ध कीजिए।',
        '<code>ln -s note.txt link1</code> से symbolic link बनाकर <code>ls -l</code> में तीर (→) दिखाइए; hard link (<code>ln note.txt hard1</code>) से inode/कॉपी फ़र्क़ शिक्षक से पूछकर लिखिए; <code>rm link1</code> से हटाकर मूल फ़ाइल सुरक्षित जाँचिए।',
        'Tab दबाकर auto-completion, ↑/↓ से command history, <code>history</code> व Ctrl + R से पुराना कमांड खोजना — तीनों अभ्यास कीजिए; <code>clear</code> (या Ctrl + L) से स्क्रीन साफ़ कीजिए।',
        '<code>tree -L 2 /etc</code> (यदि tree न हो तो <code>ls /</code> और <code>ls /etc | head</code>) से / के नीचे के main directories देखकर काम लिखिए: /home (उपयोगकर्ता), /root (superuser home), /etc (विन्यास/config), /var (बदलता डेटा/logs), /tmp (अस्थायी), /bin व /usr/bin (कमांड), /dev (डिवाइस फ़ाइलें), /mnt व /media (mount)।',
        'अब हर कमांड + उसका पहला output एक फ़ाइल में लॉग कीजिए: <code>echo "=== lab214 log ===" &gt; lab214.log</code> फिर हर कमांड के बाद <code>&gt;&gt; lab214.log</code> से append; अंत में <code>cat lab214.log</code> से पूरा proof दिखाइए।'],
       result:'कमांड लॉग फ़ाइल + / के नीचे 8 directories के नाम व काम की तालिका और cp/mv/ln के फ़र्क़, &gt; बनाम &gt;&gt; का मतलब — सब अक्षरशः output के साथ लिखिए।'
      },

      {n:215, title:'लिनक्स Permissions — chmod व chown',
       aim:'r/w/x (पढ़ें/लिखें/चलाएँ) को owner-group-other में बाँटना, octal (755) व symbolic (u+x) दोनों तरीके से permission देना-लेना और execute न मिलने की त्रुटि हल करना।',
       tools:['Linux terminal','एक script फ़ाइल <code>hello.sh</code>','दूसरा user account (शिक्षक वाला) या sudo का अधिकार'],
       steps:['<code>touch hello.sh</code> करके उसमें <code>#!/bin/bash</code> और <code>echo "Namaste"</code> लिखिए; <code>./hello.sh</code> चलाइए — "Permission denied" आता है; कारण लिखिए (execute bit बंद)।',
        '<code>ls -l hello.sh</code> का पहला column पढ़िए: <code>-rwxr-xr-x</code> में 1वां=फ़ाइल प्रकार, अगले 3 owner, फिर 3 group, अंतिम 3 other (world) — चित्र बनाकर समझाइए।',
        '<code>chmod +x hello.sh</code> से execute जोड़िए, अब <code>./hello.sh</code> चलेगा; फिर <code>chmod 755 hello.sh</code>, <code>644</code>, <code>600</code>, <code>444</code> लगाकर हर बार <code>ls -l</code> output लिखिए — octal में r=4, w=2, x=1 यह हिसाब दिखाइए।',
        'Symbolic mode आजमाइए: <code>chmod u=rw,go=r notes.txt</code>, <code>chmod a-x script.sh</code>, <code>chmod -R 755 lab215/</code> (recursive) — u/g/o/a व +/=/- के मतलब तालिका बनाइए।',
        '644 वाली फ़ाइल पर <code>echo test &gt;&gt; notes.txt</code> करके "Permission denied" देखिए; फिर owner बनकर/सुधार करके लिखने लायक बनाइए और यथास्थिति वापस लाइए।',
        '<code>sudo chown $USER: hello.sh</code> (या शिक्षक से) से owner बदलिए; <code>chown user:group file</code> व <code>chgrp</code> का फ़र्क़ और <code>ls -ln</code> में numeric UID/GID देखिए।',
        'directory पर permission का मतलब अलग है: /tmp की entry <code>drwxrwxrwt</code> देखकर x का अर्थ directory में "प्रवेश" और sticky bit (t) की बात शिक्षक से पूछकर लिखिए; <code>chmod 700 private/</code> करके दूसरे user से पढ़ने की कोशिश करके निष्फलता नोट कीजिए।',
        'सबसे ज़रूरी सुरक्षा-अभ्यास: <code>chmod 777</code> क्यों बुरा है (सभी कुछ कर सकते हैं) — 3 कारण लिखिए और <code>chmod 600 ~/.ssh/config</code> जैसी सही आदत बताइए।'],
       result:'octal → rwx तालिका (755 = rwxr-xr-x, 644 = rw-r--r--), 4 chmod प्रयोगों के पहले/बाद के <code>ls -l</code> output, permission denied का कारण और chmod 777 के 3 खतरे लिखिए।'
      },

      {n:216, title:'लिनक्स text प्रोसेसिंग — grep, find, pipe व redirection',
       aim:'grep, find, cut, sort, uniq, head, tail, wc और pipe (|) / redirect (&gt;, &gt;&gt;) से बड़े text data से उत्तर निकालना।',
       tools:['Linux terminal','20–30 पंक्ति का CSV data (name,marks,city)','सिस्टम फ़ाइलें (/etc/passwd जैसी पढ़ने-योग्य)'],
       steps:['<code>students.csv</code> बनाइए: <code>नाम,अंक,शहर</code> के 25 रिकॉर्ड (echo/ nano से); <code>cat students.csv | head -5</code> से शुरुआत देखिए।',
        '<code>grep "Ravi" students.csv</code> → फिर <code>grep -i</code> (case छोड़ें), <code>grep -v</code> (उलटा — जो नहीं मिला), <code>grep -c</code> (गिनती), <code>grep -n</code> (line number) — पाँचों output अलग-अलग चिपकाइए।',
        'Pipe chain: <code>cat students.csv | grep -i "delhi" | wc -l</code> से दिल्ली के छात्र गिनिए; हर हिस्से का काम (कौन क्या दे रहा है) तीर के साथ लिखिए — pipe का मतलब "पिछले का output अगले का input"।',
        'Column काम: <code>cut -d"," -f3 students.csv | sort | uniq -c | sort -rn</code> से कौन-सा शहर कितनी बार — output की पहली 3 पंक्तियाँ नोट कीजिए; sort/uniq/-c/-rn के विकल्प समझाइए।',
        'Redirect: <code>grep "60" students.csv &gt; pass.txt</code>, फिर <code>grep "fail" students.csv &gt;&gt; pass.txt</code> — &gt; से फ़ाइल नई/खाली होती है, &gt;&gt; जोड़ती है; दोनो बार cat करके सिद्ध कीजिए।',
        'find के 4 प्रयोग: <code>find . -name "*.txt"</code>, <code>find /home -type d</code>, <code>find . -size +1M</code>, <code>find . -mtime -7 -name "*.log"</code> और <code>locate</code> (उपलब्ध हो) से फ़र्क़ लिखिए।',
        'सिस्टम काम: <code>ls -l /etc | head</code>, <code>grep "^root" /etc/passwd</code>, <code>grep -r "error" /var/log (sudo की ज़रूरत)</code> — क्या मिला, क्या नहीं; /etc/passwd के 7 fields का अर्थ शिक्षक से पूछकर एक पंक्ति में लिखिए।',
        '<code>ps aux | head</code> से process list, <code>top</code> (q से बाहर) से live view और <code>df -h</code>, <code>du -sh .</code>, <code>wc -lwc students.csv</code> से disk/line गिनती — चारों का output काटकर नोट कीजिए।'],
       result:'कम से कम 10 कमांड + output लॉग; grep के 4 विकल्प, pipe (&gt; vs &gt;&gt;), find/locate और cut-sort-uniq की chain की व्याख्या एक पेज नोट में लिखिए।'
      },

      {n:217, title:'लिनक्स पैकेज प्रबंधन — apt / dnf से software install',
       aim:'repository (संग्रह) से software इंस्टॉल/अपडेट/रिमूव करना और निर्भरता (dependencies), cache व package naming समझना।',
       tools:['Debian/Ubuntu (apt) या Fedora/RHEL (dnf/yum)','sudo का पासवर्ड (शिक्षक से)','इंटरनेट/स्थानीय repository'],
       steps:['पैकेज सूची update कीजिए: <code>sudo apt update</code> (Debian/Ubuntu) या <code>sudo dnf check-update</code> (Fedora) — कौन-कौन से repository पढ़े जा रहे हैं, output की 5 लाइन चिपकाइए।',
        '<code>apt search geany</code> और <code>apt show geany</code> से version, size, homepage, निर्भरता (Depends) की जानकारी पढ़िए; <code>rpm -qi</code> / <code>dnf info</code> (Fedora) का उसी काम वाला कमांड लिखिए।',
        '<code>sudo apt install geany</code> से install कीजिए; "extra packages will be installed" में आने वाली dependency गिनिए और total download size/आगाज़ (need root) का संदेश नोट कीजिए।',
        'फिर <code>apt list --installed | wc -l</code> से कुल packages, <code>apt list --upgradable</code> से बाकी updates; <code>sudo apt full-upgrade</code>/ <code>sudo dnf upgrade</code> केवल शिक्षक के कहने पर (सिस्टम-wide बदलाव)।',
        '<code>sudo apt remove geany</code> (config रहती है) बनाम <code>sudo apt purge geany</code> (config भी हटी) और <code>sudo apt autoremove</code> (अनचाही dependency) — तीनों का फ़र्क़ install/remove करके सिद्ध कीजिए।',
        '<code>apt-cache policy geany</code> से installed candidate version व repository priority देखिए; <code>/etc/apt/sources.list</code> और <code>/etc/apt/sources.list.d/</code> खोलकर (सिर्फ़ पढ़िए, बदलिए मत) repository लाइनों की संख्या लिखिए।',
        'Snap/Flatpak (उपलब्ध हो) देखिए: <code>snap list</code> या <code>flatpak list</code>; .deb बनाम snap/flatpak (self-contained bundle) और AppImage का फ़र्क़ शिक्षक से चर्चा करके 4 पंक्तियों में लिखिए।',
        'Source से compile का अवधारणा-मात्र अवलोकन: <code>./configure &amp;&amp; make &amp;&amp; sudo make install</code> के 3 चरण क्या करते हैं (केवल समझाइए, लैब PC पर न चलाइए); <code>which gcc</code> से compiler की मौजूदगी जाँचिए।'],
       result:'चलाए गए कमांड + install/remove का output, package का version, dependency की गिनती, remove/purge/autoremove का फ़र्क़ और repository क्या होता है — सब 8 पंक्तियों में लिखिए।'
      },

      {n:218, title:'Bash Scripting — variables, if, for व arguments',
       aim:'दो छोटी Bash scripts लिखकर चलाएँ: variable + read + if, और for loop + command line arguments + log बनाना।',
       tools:['Linux + nano/vim','chmod +x का अधिकार','<code>.sh</code> फ़ाइलें रखने का फ़ोल्डर'],
       steps:['<code>nano age.sh</code> में पहली लाइन <code>#!/bin/bash</code> लिखिए — इसे <b>shebang</b> कहते हैं; यह बताता है कि फ़ाइल किस interpreter से चलेगी।',
        'अब: <code>name="Ravi"</code>, <code>echo "Namaste $name"</code>, <code>read -p "उम्र डालिए: " age</code>, <code>if [ $age -ge 18 ]; then echo "वयस्क"; else echo "नाबालिग"; fi</code> — save करके <code>chmod +x age.sh</code> और <code>./age.sh</code> चलाइए (2 उम्र: 12 और 25)।',
        'for loop वाली script <code>loop.sh</code>: <code>for i in 1 2 3; do echo "line $i"; done</code> और फिर <code>for i in {1..20}; do echo $i; done</code>; तीसरा रूप <code>for f in *.txt; do echo "$f"; done</code} — तीनों का output अलग-अलग नोट कीजिए।',
        'arguments सीखिए: <code>arg.sh</code> में <code>echo "नाम: $1"</code>, <code>echo "कुल arguments: $#"</code>, <code>echo "सब: $@"</code>; <code>chmod +x arg.sh</code> करके <code>./arg.sh Ravi 22 Delhi</code> चलाइए — $1/$2/$3 और $# का मान लिखिए।',
        'एक उपयोगी log script <code>sysinfo.sh</code>: <code>date &gt;&gt; sysinfo.log</code>, <code>df -h &gt;&gt; sysinfo.log</code>, <code>free -m &gt;&gt; sysinfo.log</code> (यदि free न हो तो <code>top -bn1 | head -5</code>) — इसे 3 बार चलाकर log में 3 entries जाँचिए।',
        'ग़लती जाँच: <code>bash -n sysinfo.sh</code> (syntax check), फिर <code>echo $?</code> — 0 का मतलब पिछला कमांड सफल, ग़लती पर non-zero; <code>set -x</code> लगाकर debug output देखिए और हटा दीजिए।',
        'case का उपयोग: <code>case $1 in start) echo "started";; stop) echo "stopped";; *) echo "use: start|stop";; esac</code> — तीन बार arguments बदल-बदलकर चलाइए।',
        'cron से schedule (केवल देखिए): <code>crontab -l</code>, <code>crontab -e</code> में <code>@daily /home/user/sysinfo.sh</code> जैसी लाइन लिखकर पढ़िए और तुरंत हटा दीजिए; अंत में scripts को <code>lab218/</code> folder में zip करके जमा कीजिए।'],
       result:'तीनों scripts की source code + output; shebang, $1/$#, &gt;&gt;, chmod +x, if के -ge/-gt, bash -n व echo $? का काम — एक पंक्ति-एक-काम तालिका में लिखिए।'
      },

      {n:219, title:'SSH Key व ~/.ssh/config — दूर की मशीन पर login',
       aim:'OpenSSH client से server पर login, key-based (password-less) authentication और SSH config file में alias बनाकर बार-बार IP/type करने से बचना।',
       tools:['Linux या Windows 10/11 (OpenSSH client)','लैब का Linux VM/server (शिक्षक का अनुमति-पत्र)','ping/ssh कमांड','nano/Notepad'],
       steps:['पहले reachability: <code>ping &lt;server-ip&gt;</code> (Ctrl + C से रोकें) — reply आया तो network ठीक; असफल होने पर gateway/firewall कारण लिखिए।',
        '<code>ssh user@192.168.x.x</code> से पहला login; "authenticity of host can not be established… fingerprint" warning का अर्थ (first-time trust) समझाइए और yes/deactivate करके आगे बढ़िए; server पर <code>hostname; whoami; pwd; uname -a</code> चलाकर 4 मान नोट कीजिए।',
        'अपनी मशीन पर key बनाइए: <code>ssh-keygen -t ed25519</code> (पुराने सिस्टम पर <code>-t rsa -b 4096</code>); Enter से <code>~/.ssh/id_ed25519</code> में private + <code>.pub</code> में public key; passphrase डालने/न डालने का फ़र्क़ लिखिए।',
        '<code>ls -l ~/.ssh</code> से दोनों फ़ाइलें और permission (600/644) देखिए — <b>private key कभी किसी को न भेजें</b>; public key भेजना सुरक्षित है, यह कारण समझाइए।',
        'public key server पर भेजिए: Linux पर <code>ssh-copy-id user@server</code>; Windows से manual: <code>type $env:USERPROFILE\\.ssh\\id_ed25519.pub</code> का content server की <code>~/.ssh/authorized_keys</code> में जोड़िए (शिक्षक से) — अब <code>ssh user@server</code> बिना पासवर्ड चलेगा, जाँचिए।',
        '<code>nano ~/.ssh/config</code> में alias बनाइए: <code>Host lab1</code> / <code>HostName 192.168.x.x</code> / <code>User student</code> / <code>Port 22</code> / <code>IdentityFile ~/.ssh/id_ed25519</code>; save करके <code>ssh lab1</code> चलाइए — यही config file का काम है।',
        'अतिरिक्त प्रयोग: <code>ssh -p 2222 user@server</code> (custom port), <code>ssh lab1 "df -h"</code> (remote command का output अपने terminal में), <code>scp file.txt lab1:/tmp/</code> से फ़ाइल भेजकर server पर <code>ls -l /tmp</code> से जाँचिए।',
        'debug व security: <code>ssh -v lab1</code> से log की पहली 10 लाइनें; "~/.ssh पर 700, config पर 600 permission चाहिए" — g/other ने editable रखने पर ssh मना करता है, यह प्रयोग (सिर्फ़ VM पर) करके संदेश चिपकाइए; logout/exit से session बंद कीजिए।'],
       result:'<code>~/.ssh/config</code> की फ़ाइल सामग्री, alias से login का proof, authorized_keys का पथ व permission, key के दो हिस्सों का फ़र्क़ और passphrase का महत्व — सब तारीख के साथ लिखिए।'
      },

      {n:220, title:'ipconfig, ping, tracert व DNS flush',
       aim:'विंडोज़ से TCP/IP configuration पढ़ना, ping/tracert से कनेक्टिविटी जाँचना और DNS cache flush करके resolution समझना।',
       tools:['Windows PC + इंटरनेट','Command Prompt (<code>cmd</code>)','नोट करने का फ़ॉर्म','शिक्षक का DNS/IP अनुमोदन'],
       steps:['Win + R → <code>cmd</code> → <code>ipconfig</code>: IPv4 Address, Subnet Mask, Default Gateway नोट कीजिए; फिर <code>ipconfig /all</code> से Physical (MAC) address, DHCP server, DNS servers, Lease Obtained/Expires, Host name भी लिखिए।',
        'MAC address का format पहचानिए (hex pairs, जैसे <code>AA-BB-CC-DD-EE-FF</code>) और IPv4 के 4 octets (0–255) जाँचकर लिखिए कि आपका IP कौन-सा class/PRIVATE range में है।',
        'चार तरह के ping: <code>ping 127.0.0.1</code> (स्वयं/loopback), <code>ping &lt;gateway-ip&gt;</code> (LAN), <code>ping 8.8.8.8</code> (Internet reachability), <code>ping www.google.com</code> (naam → IP यानी DNS) — हर एक का reply time/TTL व निष्कर्ष लिखिए।',
        '<code>ping -n 10 8.8.8.8</code> से 10 पैकट, <code>ping -t 8.8.8.8</code> से लगातार (Ctrl + C रोकें) — Lost packets % व average time नोट कीजिए; <code>ping -l 2000</code> से बड़ा पैकेट भेजकर फ़र्क़ देखिए।',
        '<code>tracert google.com</code> से hops गिनिए; पहला hop = लैब का router, बाद वाले ISP के; * * * आने का अर्थ (router ने reply नहीं दिया) लिखिए और <code>pathping</code> (उपलब्ध हो) से तुलना कीजिए।',
        '<code>nslookup google.com</code> से DNS server का पता व resolved IP; फिर <code>ipconfig /flushdns</code> ("Successfully flushed the DNS Resolver Cache") और दोबारा nslookup — DNS cache की अवधारणा अपने शब्दों में लिखिए।',
        '<code>ipconfig /release</code> → <code>ipconfig /renew</code> से DHCP से नया IP लीजिए; बदला या नहीं, कितने समय में मिला — लिखिए; DHCP server बंद हो तो कौन-सा IP अपने आप मिलता है (169.254.x.x — APIPA) के बारे में शिक्षक से पूछकर नोट कीजिए।',
        '<code>arp -a</code> से LAN के अन्य devices का IP↔MAC नक्शा देखिए, <code>netstat -rn</code> से routing table और <code>nslookup -type=mx gmail.com</code> से mail server records; अंत में अपनी पूरी जाँच की 10 पंक्ति रिपोर्ट बनाइए।'],
       result:'पहले/बाद का IP, Subnet, Gateway, DNS व MAC; 4 ping प्रकार के परिणाम, tracert का hop count, flushdns से पहले/बाद का nslookup और renew का नतीजा — तालिका में लिखिए।'
      },

      {n:221, title:'Router (राउटर) की सेटिंग्स का अवलोकन',
       aim:'अनुमति वाले router के admin panel से WAN/SSID/सुरक्षा/DHCP/फ़र्मवेयर जानकारी पढ़ना और 4 सुरक्षा सुधार पहचानना।',
       tools:['लैब/घर का router (शिक्षक/मालिक का लिखित अनुमोदन)','admin पता व पासवर्ड (सौंपा हुआ)','ब्राउज़र + phone','ipconfig से Default Gateway'],
       steps:['<code>ipconfig</code> में Default Gateway का IP (आम तौर पर <code>192.168.0.1</code> या <code>192.168.1.1</code>) browser में खोलिए; login page पर दिए गए admin credentials से प्रवेश कीजिए (कभी brute-force/default अनुमान न करें)।',
        'Status/WAN page: connection type (DHCP/PPPoE/Static IP), WAN से मिला IP, DNS, uptime व firmware version नोट कीजिए; router का model name/label भी लिखिए।',
        'Wireless/WLAN सेटिंग: SSID (network का नाम), 2.4 GHz बनाम 5 GHz, channel (2.4 GHz में 1/6/11 कम-भीड़ वाले), bandwidth 20/40 MHz और country code — सब दर्ज कीजिए।',
        'Security: wireless encryption mode जाँचिए — WPA/WPA2-Personal/WPA3 ठीक, WEP या "Open" असुरक्षित; PSK (pre-shared key) कितना लंबा है (20 अक्षर से कम कमज़ोर) लिखिए, पासवर्ड न बदलिए।',
        'DHCP सेटिंग: pool range (जैसे 192.168.1.100–199), lease time और DNS जो router देता है; LAN IP/Subnet mask (आम तौर पर 255.255.255.0) नोट कीजिए।',
        'Attached devices/Wireless client list से कितने devices जुड़े हैं गिनिए और उनके hostname/MAC देखिए; कोई अनजान device दिगे तो शिक्षक को तुरंत दिखाइए।',
        'Administration से 4 चीज़ें जाँचिए: (1) admin पासवर्ड बदलने का विकल्प, (2) remote/m WAN management ON है या OFF, (3) firmware upgrade का विकल्प, (4) MAC filtering/Wireless isolation व Guest network — बदलाव केवल अनुमति से (आपके कार्य में केवल देखना और लिखना है)।',
        'Guest Wi-Fi चालू करके phone से कनेक्ट करके जाँचिए कि guest को LAN के printers/folders नहीं मिलते; फिर Guest बंद करके Reboot (Administration → Reboot) से सब यथावत लाइए और Internet वापस चला है, ping से पुष्टि कीजिए।',
        'Port Forwarding/Virtual Server page केवल खोलकर देखिए; UPnP, DMZ, WPS का खतरा शिक्षक से पूछकर 4 पंक्तियों में लिखिए और router के पासवर्ड कभी नोटबुक/स्क्रीनशॉट में न डालें, यह नियम मानिए।'],
       result:'Router model, firmware version, WAN type/IP, SSID व security mode, channel, DHCP range, जुड़े devices की संख्या और 4 सुझाए गए सुरक्षा-सुधार (admin password बदलना, WPS/remote management बंद, WPA2/WPA3, guest isolation) — बिना असली पासवर्ड के लिखिए।'
      },

      {n:222, title:'Password Manager (कूटशब्द प्रबंधक) सेटअप व पासवर्ड अनुशासन',
       aim:'एक password manager स्थापित करके हर अकाउंट के लिए लंबा-अनोखा पासवर्ड बनाना, master password discipline और reuse के खतरे समझना।',
       tools:['Browser (Edge/Chrome/Firefox) या Foss फ्री manager (जैसे Bitwarden/KeePassXC)','2 demo accounts (लैब/स्कूल के test अकाउंट)','नोट नहीं — केवल माप लिखने का फ़ॉर्म'],
       steps:['पहले 15 कमज़ोर पासवर्ड की सूची बनाइए (<code>123456</code>, <code>password</code>, <code>name@123</code>, <code>mobile number</code>) और बताइए कि dictionary/brute-force attack व leaked-credential stuffing में ये मिनटों में टूटते हैं।',
        'Password manager स्थापना: desktop app या browser extension; <b>master password</b> 16+ अक्षर का passphrase रखिए (4 बेतरतीब शब्द + 1 संख्या + 1 चिह्न) और hint ऐसा लिखिए जो दूसरे को कुछ न बताए; recovery kit (emergency access) print/save करके शिक्षक/अभिभावक के पास रखिए।',
        'Manager में 3 test entries बनाइए: School LMS, Email, Utility site — हर एक के लिए Generate से 20–25 अक्षर का पासवर्ड (uppercase+lowercase+digit+symbol) बनाकर save कीजिए; कोई भी पासवर्ड दो अकाउंट में repeat न कीजिए।',
        'Auto-fill (स्वत: भरना) का convenience vs risk चर्चा कीजिए: सार्वजनिक/साझा PC पर save करना, lock-on-idle सेट करना और clipboard से पासवर्ड हटाने का समय (30–60 सेकंड) सेट कीजिए।',
        'Browser के saved passwords list (जैसे Settings → Passwords) खोलकर कितने पुराने/कमज़ोर पासवर्ड पड़े हैं देखिए; जहाँ possible हो वहाँ delete/change कीजिए — "Password health/report" (उपलब्ध हो) का score नोट कीजिए।',
        'Export करके backup फ़ाइल बनाइए और उसकी जगह/नाम लिखिए (फ़ाइल का content/पासवर्ड न लिखिए) — यह backup भी 3-2-1 नियम (कार्य 224) में रखें, कारण लिखिए।',
        'Passphrase गणित समझाइए: <code>A7!zqR2</code> (8 अक्षर random) बनाम <code>chaai-ganna-taki-42</code> (20 अक्षर passphrase) — कौन-सा याद रखने/तोड़ने में कैसा, और "6 महीने में बदलें / breach पर तुरंत बदलें" का नियम लिखिए।',
        'साझा-PC आदत: लैब के PC पर logout + browser clear (cookies + saved passwords) कीजिए, फिर Windows keylock (<b>Win + L</b>) से मशीन लॉक करके जाँचिए कि दूसरा उपयोगकर्ता आपका session न खोल सके।'],
       result:'कमज़ोर 15 पासवर्ड की सूची, पासवर्ड के माप (लंबाई/complexity — मान नहीं लिखें), master password का नियम, reuse के 3 खतरे, export backup का पथ और shared-PC पर 4 आदतें — सब 8 पंक्तियों में लिखिए।'
      },

      {n:223, title:'दो-कारक प्रमाणीकरण (2FA / MFA) चालू करना',
       aim:'समर्थित account (Microsoft/Google) पर Authenticator app से Two-Factor Authentication चालू करके login test करना और recovery codes सुरक्षित रखना।',
       tools:['लैपटॉप + अपना स्मार्टफ़ोन','Microsoft या Google account (अपना/अनुमोदित)','Authenticator app (Microsoft/Google)','क्यामरा (QR के लिए) या manual setup key'],
       steps:['<b>अपने</b> account की security page खोलिए (Microsoft: account.microsoft.com → Security → Advanced security options; Google: myaccount.google.com → Security → 2-Step Verification) — education PC पर किसी और के account के साथ यह कार्य न कीजिए।',
        'फ़ोन में Authenticator app install कीजिए; website में "Add a new way to sign in or verify → Authenticator app" चुनिए।',
        'QR code को app से scan कीजिए; QR न दिखे तो <b>manual setup key</b> (लंबा alphanumeric secret) copy करके app → Add account → Other से डालिए; दोनों में एक ही account जुड़ता है — कारण समझाइए।',
        'app में दिखने वाली 6-अंकीय कोड (हर ~30 सेकंड बदलती है, इसे TOTP — Time-based One-Time Password कहते हैं) website में डालकर verify कीजिए; ग़लत/पुरानी कोड पर त्रुटि देखिए।',
        'Recovery codes generate करके download/print कीजिए और password manager या सीलबंद कागज़ पर रखिए — फ़ोन खोने/बदलने पर यही रास्ता बचाता है; "app install पर दोबारा पुराना account जोड़ने" का तरीका पढ़िए।',
        'अब पूरी तरह logout करके नया login कीजिए: password के बाद code माँगा — यही दो कारक (two factors) हैं; "trust this device/Don\'t ask again 30 days" checkbox का फ़र्क़ व जोखिम लिखिए।',
        'तीन विकल्पों की तुलना तालिका में: SMS OTP (SIM-swap का खतरा, offline न हो तो समस्या), app TOTP (internet नहीं चाहिए, फ़ोन पर निर्भर), hardware key/security key (सबसे मज़बूत, खोने पर alternative चाहिए) — प्रत्येक के 1 उपयोग व 1 कमज़ोरी लिखिए।',
        'Backup second factor (दूसरा फ़ोन/backup email/SMS fallback) जोड़ने का विकल्प देखिए; account पर लगे alerts/recent activity list खोलकर अनजान login पहचानने का अभ्यास कीजिए और 5 मिनट का समय निकालकर पूरी सेटिंग verify कीजिए।'],
       result:'किस प्रकार का 2FA चालू हुआ (account का नाम न लिखें), कौन-से दो कारक लगे, recovery codes कहाँ रखे, SMS बनाम app बनाम hardware key की तालिका और login test का निष्कर्ष — 6 पंक्तियों में लिखिए।'
      },

      {n:224, title:'3-2-1 Backup योजना बनाकर Restore Drill',
       aim:'सच्चा <b>3-2-1</b> नियम (3 Copies, 2 अलग media, 1 off-site) अपनाकर 100 MB डेटा का backup लेना और ग़लती से मिटाई फ़ाइल को restore करके समय मापना।',
       tools:['Windows PC','50–100 MB का अपना फ़ोल्डर (Word + Excel + चित्र)','Pen drive/External HDD (Copy 2)','OneDrive/Google Drive या लैब का NAS (Copy 3, off-site)','Command Prompt (robocopy) या File Explorer'],
       steps:['स्रोत (source) चुनिए: <code>D:\\MyWork</code> के कम से कम 5 फ़ाइलें; कुल size व file count Properties से नोट कीजिए (यही आपका "1st copy = original")।',
        'पेन ड्राइव पर copy: CMD में <code>robocopy D:\\MyWork E:\\Backup-MyWork /MIR /R:2 /W:2 /LOG:C:\\backup.log</code> — /MIR (mirror), /R /W (retry) और /LOG का काम पंक्ति-दर-पंक्ति लिखिए; log में Copied/Skipped/Mismatched गिनिए।',
        'वही कमांड दूसरी बार चलाइए — अब "0 copied" आता है क्योंकि /MIR ने mirror बना दिया; इसी से incremental (बदली हुई फ़ाइलें) backup का अर्थ समझाइए और 2 नई/बदली फ़ाइल रखकर तीसरी बार चलाकर अंतर देखिए।',
        'Windows के आंतरिक उपकरण देखिए: Settings → Storage → Backup / Control Panel → Backup and Restore — schedule (daily 7 PM), कौन-से folders लेते हैं, और <b>Create a system image</b> में क्या-क्या शामिल होता है (पूरी C:, drivers, apps) पढ़िए; File History उपलब्ध हो (Win+R → <code>control /name Microsoft.FileHistory</code>) से ON करके "Restore personal files" खोलकर view करें।',
        'तीसरी copy off-site: OneDrive/Google Drive में वही फ़ोल्डर sync कीजिए; sync icon बदलता देखिए और 1 फ़ाइल delete करके cloud की Trash/Version history से वापस लाइए — यही असली परीक्षा है।',
        '<b>Restore Drill:</b> external drive से 2 फ़ाइलें ग़लती से delete कीजिए; (क) Recycle Bin से restore, (ख) pen-drive backup से copy-back, (ग) cloud version history से — तीनों का समय (सेकंड/मिनट) व कौन-सा पहले काम आया लिखिए।',
        'सुरक्षा: backup वाली pen drive पर BitLocker (उपलब्ध editions) या archive को password से protect करने का विकल्प समझाइए; "backup नहीं लिया" और "backup लिया पर restore test नहीं किया" — दोनों में से कौन खतरनाक है, कारण लिखिए।',
        'अपनी योजना एक पेज पर बनाइए: कौन-सा डेटा, कितनी बार (daily/weekly), media कौन-कौन, off-site कहाँ, रीटेन्शन कितने महीने, ज़िम्मेदार कौन, restore test कब — और 3-2-1 के साथ immutable/versioning (3-2-1-1-0 जैसा नियम) की चर्चा शिक्षक से कीजिए।'],
       result:'आपकी 3 copies/2 media/1 off-site तालिका, backup.log का सारांश (कितनी फ़ाइलें/MB, कितने retries), तीनों restore रास्तों का समय, File History/system image का फ़र्क़ और अगली बार कब-backup — सब तारीख के साथ लिखिए।'
      },

      {n:225, title:'Antivirus (एकवाह रोगनाशक? नहीं — वायरस-नाशक) पूरा स्कैन व सुरक्षा समीक्षा',
       aim:'Windows Security / antivirus की definitions अपडेट करके Quick व Full scan, protection history review, firewall profile व ransomware protection की जाँच।',
       tools:['Windows 10/11 PC','Windows Security (shield icon या Win + R → <code>windowsdefender:</code>)','कोई स्थापित third-party antivirus (उपलब्ध हो)','समय मापने की घड़ी'],
       steps:['Windows Security खोलिए → Virus &amp; threat protection: Virus &amp; threat protection updates में <b>definition version</b> व last check time, Engine version नोट कीजिए।',
        'Protection updates → <b>Check for updates</b> से definitions नई कीजिए; पहले/बाद का version व तारीख लिखिए (पुरानी definitions = नए virus नहीं पकड़ेंगे, कारण)।',
        'Scan options → <b>Quick scan</b> चलाकर शुरू/खत्म का समय मापिए और scanned items की गिनती नोट कीजिए।',
        'फिर <b>Full scan</b> चलाइए (लैब PC पर, शिक्षक की अनुमति से) — समय, items scanned, मिला कुछ या नहीं, सब लिखिए; scan के दौरान PC की धीमी गति (CPU/disk usage, Task Manager) भी देखिए।',
        'किसी एक फ़ोल्डर पर Right-click → "Scan with Microsoft Defender" (या स्थापित AV का context menu) से custom scan; test file (जैसे EICAR test string — केवल शिक्षक दे तो) पर detection कैसे होता है, observe कीजिए और तुरंत हटवाइए।',
        '<b>Protection history</b> (या AV का Quarantine) खोलकर 2 entries के नाम/category/action लिखिए; quarantine का मतलब (संदिग्ध फ़ाइल बंद कमरे में) और "restore" का जोखिम समझाइए — कोई भी quarantine चीज़ बिना जाँच restore न कीजिए।',
        'Virus &amp; threat protection settings में Real-time protection, Cloud-delivered protection और <b>Controlled folder access</b> (ransomware से Documents/Pictures बचाने वाला) की स्थिति देखिए — लैब PC पर कुछ बंद मत कीजिए, केवल पढ़िए।',
        'Scan options में <b>Microsoft Defender Offline scan</b>/Boot-time scan का फ़र्क़ (reboot करके kernel से पहले scan) समझिए; Firewall &amp; network protection में Domain/Private/Public profiles और "Block all incoming connections" जाँचिए; Browser का SmartScreen/Safe Browsing भी देखिए।'],
       result:'Definition version (पहले/बाद), Quick scan समय __ सेकंड/मिनट व items ___, Full scan समय __ व नतीजा, Protection history की 2 entries (threat name, category, action), Controlled folder access की स्थिति व तीनों firewall profile — तारीख के साथ तालिका में लिखिए।'
      },

      {n:226, title:'Batch Rename (थोक नाम परिवर्तन) — Explorer, ren व PowerShell',
       aim:'30 फ़ाइलों का नाम एक साथ बदलना — Explorer trick, CMD के <code>ren</code> wildcard, PowerShell व FOR loop से; साथ में extension बदलने के परिणाम समझना।',
       tools:['Windows PC','30 फ़ाइलें (IMG_0001.jpg या note_1.txt जैसी) एक <code>lab226/</code> फ़ोल्डर में','Command Prompt','PowerShell','हर प्रयोग से पहले backup copy'],
       steps:['<code>lab226/</code> में 30 JPG/TXT फ़ाइलें डालिए और एक क्लोन फ़ोल्डर <code>lab226_backup/</code> बनाइए — हर प्रयोग से पहले backup रखना ही असली आदत है।',
        'Explorer तरीका: Select All (Ctrl + A) → <b>F2</b> → पहला नाम <code>Photo</code> टाइप कर Enter दबाइए — Windows अपने आप Photo (1), Photo (2)… क्रम देता है; पहले/बाद के 5 नाम लिखिए और Ctrl + Z से undo करके वापस लाइए।',
        'CMD में wildcard: <code>ren *.txt *.bak</code> (सभी .txt का extension .bak हो जाता है; * मूल नाम का स्थान लेता है) — प्रयोग करके देखिए; फिर <code>ren photo?.* img?.*</code> जहाँ <code>?</code> = एक character; <code>*</code> व <code>?</code> का फ़र्क़ उदाहरण से लिखिए।',
        'FOR loop: <code>for %f in (*.txt) do ren "%f" "note_%f"</code> CMD में; batch file (<code>.bat</code>) में यही <code>for %%f in (*.txt) do ren "%%f" "note_%%f"</code> — %f बनाम %%f का कारण नोट कीजिए; <code>echo off</code> वाली छोटी .bat बनाकर चलाइए।',
        'PowerShell: <code>Rename-Item -Path "img1.jpg" -NewName "pic1.jpg"</code> एक के लिए; थोक में <code>Get-ChildItem *.jpg | Rename-Item -NewName { $_.Name -replace "photo","pic" }</code> (केवल test folder पर) — <code>$_</code> व -replace का काम समझाइए और पहले <code>WhatIf</code> लगाकर dry-run कीजिए।',
        'Extension का खतरा: किसी .txt का नाम बदलकर <code>data</code> (बिना extension) और .txt को .jpg बनाकर खोलिए — association/icon बदलने का फ़र्क़ व "file damaged" संदेश लिखिए; फिर extension वापस करके ठीक कीजिए।',
        'Systematic naming नीति बनाइए: <code>2026-11-05_Excel_Pivot_001.xlsx</code> जैसे pattern पर 10 फ़ाइलें rename करके Excel/Word में rename-सूची (पुराना → नया) बनाइए।',
        'सबूत: <code>dir /b</code> (CMD) व <code>Get-ChildItem -Name</code> (PowerShell) से पहले/बाद की list फ़ाइल में redirect करके चिपकाइए — 2 redirect प्रयोग कार्य 216 से मिलाइए।'],
       result:'तीनों तरीकों (Explorer F2, ren/FOR, PowerShell) से पहले/बाद के 5–5 नाम, * व ? का अर्थ, %f बनाम %%f, extension बदलने की त्रुटि व उसका समाधान — तालिका में लिखिए।'
      },

      {n:227, title:'PDF जोड़ना व संपीड़न (Merge & Compress PDF)',
       aim:'कई Word/PDF फ़ाइलों को जोड़कर एक PDF बनाना, size कम करना, pages घुमाना/निकालना व properties/password सेट करना।',
       tools:['MS Word (Microsoft Print to PDF)','FREE PDF utility (जैसे PDFsam Basic, PDF24, LibreOffice Export)','4 source फ़ाइलें (2 DOCX + 2 PDF)','तुलना हेतु size कैलकुलेटर/Properties'],
       steps:['2 Word फ़ाइलों को अलग-अलग PDF बनाइए: File → Print → printer <b>Microsoft Print to PDF</b> → Print → फ़ाइल नाम <code>part1.pdf</code> (यह virtual printer है, असली प्रिंटर नहीं चाहिए)।',
        'PDF utility में <b>Merge</b> खोलकर part1.pdf, part2.pdf + 2 दिए PDF डालिए; <b>क्रम बदलकर</b> (up/down) तय कीजिए और output <code>combined.pdf</code> बनाइए — कुल पृष्ठ संख्या (4+3+…) गिनकर Properties से मिलाइए।',
        'Utility में <b>Compress/Optimize</b> लगाइए (image quality/DPI 150 जैसा option) — पहले का size ___ MB, बाद का ___ KB, percentage बचाव और पढ़ने की गुणवत्ता (चित्र धुंधले हुए?) लिखिए; 2 बार अलग-setting से तुलना कीजिए।',
        'Page operations: combined.pdf से 3 पृष्ठ <b>Extract</b> करके अलग PDF बनाइए; उल्टी स्कैन वाली पंक्ति <b>Rotate</b> 90° करके ठीक कीजिए; Delete pages से blank पृष्ठ हटाइए — हर operation के बाद पृष्ठ संख्या जाँचिए।',
        'Bookmarks/Outline (utility में उपलब्ध हो) जोड़कर अध्याय-नेविगेशन बनाइए; Word में heading से PDF export करने पर bookmarks अपने आप आते हैं — दोनों का फ़र्क़ लिखिए।',
        'Word → File → Save As → PDF में <b>Options…</b> खोलकर "ISO 19005-1 compliant (PDF/A)", Bitmap text, Optimize for standard/minimal size के विकल्प पढ़िए; PDF/A क्यों archive के लिए होता है — एक पंक्ति में लिखिए।',
        'File → Properties (या utility) में Title/Author/Subject/Keywords बदलकर save कीजिए; फिर <b>password security</b> में open-password व permission (print/copy/change) लगाकर दूसरे PC/phone पर test कीजिए — पासवर्ड कहीं नोट न करें, शिक्षक को बताकर याद रखिए।',
        'अंत में combined.pdf को Ctrl + F (या finder) से खोलकर एक शब्द खोजिए; न मिले (यदि scanned image PDF है) तो कारण लिखिए — यही अगले कार्य 228 (OCR) की ज़रूरत है।'],
       result:'combined.pdf (पृष्ठ संख्या ___), पहले/बाद का size व % बचाव, बदली 4 properties, permission test का नतीजा और "text-based बनाम image-based PDF" का फ़र्क़ — सब स्क्रीनशॉट के साथ लिखिए।'
      },

      {n:228, title:'OCR — छवि से पाठ (Optical Character Recognition)',
       aim:'छपे हुए/स्कैन किए चित्र का text extract करके editable बनाना, proofread करके accuracy मापना और image-based PDF को searchable बनाना।',
       tools:['साफ़ 300 DPI image (अंग्रेज़ी + हिन्दी पंक्तियाँ) + एक धुंधली/टेंडी image','Windows Snipping Tool का <b>Text Actions/Text Extractor</b> या PowerToys Text Extractor','FREE OCR utility (Tesseract, शिक्षक द्वारा सेट किया गया) या Word/Google Keep','Notepad/Word'],
       steps:['छवि तैयार कीजिए: एक पन्ना फ़ोन से खींचकर PC पर लाइए; दूसरी धुंधली/कम रोशनी वाली रखिए — दोनों पर तुलना होगी।',
        'Snipping Tool → <b>Text actions</b> (या PowerToys → Text Extractor, Win + Shift + T जैसा shortcut) से area select करके text copy → Notepad में paste; extracted text अक्षरशः चिपकाइए।',
        'Command OCR (उपलब्ध हो): <code>tesseract scan.png out -l eng</code> — output <code>out.txt</code> खुलता है; हिन्दी के लिए <code>-l hin</code> (भाषा data सेट हो तो) चलाकर दोनों outputs तुलना कीजिए।',
        'Proofreading: extracted पाठ की पहली 100 characters गिनकर सही/ग़लत अक्षर तालिका में डालिए और accuracy % निकालिए (जैसे 92/100); ग़लतियों की classification कीजिए — <code>0/O</code>, <code>1/l/I</code>, <code>rn/m</code>, हिन्दी matras/anusvar, line-break।',
        ' preprocessing का असर: image की contrast/brightness बढ़ाइए, crop करके extra margin हटाइए, 90° घुमाकर seedhi कीजिए और 300 DPI बनाइए; हर बदलाव के बाद OCR दोबारा चलाकर accuracy में फ़र्क़ लिखिए।',
        'कार्य 227 वाली scanned PDF पर utility का <b>OCR this PDF</b>/Searchable PDF चलाइए; output में Ctrl + F से एक शब्द खोजकर सत्यापित कीजिए कि अब text मिलता है — पहले क्यों नहीं मिला, कारण लिखिए।',
        '4 व्यावहारिक उपयोग (form/paper entry, digitisation of books, gaadi का नंबर/ challan, receipt/invoice data) व 3 सीमाएँ (हाथ की लिखावट, fancy/decorative font, टेढ़ा/मुड़ा page, कम resolution) तालिका में लिखिए।',
        'गोपनीयता: OCR के लिए अजनबी website पर document upload करने का खतरा (क्या हो सकता है) 3 पंक्तियों में लिखिए और offline/local tool को ही प्राथमिकता देने का नियम बनाइए।'],
       result:'input image (2), raw OCR text, proofread text, दोनों की accuracy % (साफ़ ___%, धुंधली ___%), इस्तेमाल किए tool के नाम व preprocessing का फ़र्क़ — तालिका के साथ जमा कीजिए।'
      },

      {n:229, title:'Archive (संग्रह) बनाना-खोलना व Hash से सत्यापन',
       aim:'ZIP/7z/RAR/TAR archives बनाना, extract करना, split volumes, password व ISO mount सीखना; फिर SHA-256/MD5 hash से फ़ाइल की integrity जाँचना।',
       tools:['Windows Explorer compression','7-Zip (FREE) या WinRAR','30 MB का फ़ोल्डर + एक ISO image','Command Prompt (<code>certutil</code>) व PowerShell (<code>Get-FileHash</code>)','Linux पर <code>sha256sum</code> (उपलब्ध हो)'],
       steps:['30 MB फ़ोल्डर पर Right-click → <b>Send to → Compressed (zipped) folder</b>; मूल व zip का size नोट करके compression % निकालिए (शून्य-हानि/lossless का अर्थ: खोलने पर फ़ाइल बिल्कुल वैसी)।',
        '7-Zip से वही फ़ोल्डर: <b>Add to archive</b> → format <code>.7z</code>, <code>.zip</code> और <code>.rar</code> (WinRAR हो तो) अलग-अलग बनाकर तीनों का size तुलना कीजिए; Compression level (Store/Fastest/Normal/Ultimate) बदलकर 1 प्रयोग और कीजिए।',
        'Split volume: 7-Zip में "Split to volumes, bytes" = 10M रखकर archive बनाइए → <code>.001, .002, .003</code> फ़ाइलें; किसी एक को rename/hide करके extract करने पर क्या संदेश आता है, देखिए और गिनती नोट कीजिए।',
        'Password व SFX: archive को password से protect करके बनाइए, सही/ग़लत password पर संदेश जाँचिए; "Create SFX archive" (.exe) बनाकर double-click से extract दिखाइए; 7-Zip → <b>Test archive</b> से corruption जाँच की अवधारणा लिखिए।',
        'Extract के फ़र्क़: Right-click → <b>Extract Here</b> बनाम <b>Extract to folder\\</b> (एक क्लिक कम, सब कुछ folder में) बनाम "Extract files… (ask password)" — तीनों से 1-1 फ़ाइल निकालकर folder structure जाँचिए; TAR.GZ को 7-Zip/Linux में खोलकर लिनक्स archive (<code>tar -czf</code>) से तुलना लिखिए।',
        'ISO mount: किसी <code>.iso</code> (Windows installer/disc image) पर Right-click → <b>Mount</b> से virtual drive बनता है, setup.exe/अंदर की फ़ाइलें देखिए और eject कीजिए; पुराने ज़माने में ISO burn करके CD/DVD बनाते थे — यह फ़र्क़ लिखिए; <code>.bin/.cue</code> व disk image का संबंध चर्चा में।',
        '<b>Hash:</b> CMD में <code>certutil -hashfile combined.pdf SHA256</code> व <code>certutil -hashfile combined.pdf MD5</code> — दोनों hash नोट कीजिए; PowerShell में <code>Get-FileHash combined.pdf -Algorithm SHA256</code> वही SHA-256 देता है — मिलाइए।',
        'अब PDF में केवल 1 अक्षर बदलकर save कीजिए और दोबारा SHA-256 लीजिए — पूरा hash बदल जाता है (1 bit भी फ़र्क़); यही integrity check है। फिर किसी official download के साथ छपा SHA-256/MD5 (शिक्षक दें) से मिलाकर बताइए फ़ाइल सही है या बिगड़ी; और <b>MD5/SHA-1 को तोड़ा जा चुका</b> है इसलिए आज SHA-256 आदि उपयोग होता है।',
        'Linux पर (उपलब्ध हो) <code>sha256sum file</code>, <code>md5sum file</code>, <code>tar -czf lab229.tar.gz lab229/</code>, <code>tar -xzf lab229.tar.gz</code> चलाकर Windows से output तुलना कीजिए; checksum फ़ाइल (<code>sha256sum *.zip &gt; sums.txt</code>, फिर <code>sha256sum -c sums.txt</code>) का प्रयोग भी दिखाइए।'],
       result:'Formats का size तालिका (original/zip/7z/rar), split volumes की गिनती व missing volume का संदेश, password test, ISO mount का drive letter, original बनाम modified फ़ाइल का SHA-256 (पहले 12 characters) व verification का निष्कर्ष — सब तारीख के साथ लिखिए।'
      }
    ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.2</span> मूल्यांकन (Marking) — हर कार्य में क्या देखेंगे</h3>
      <p>हर प्रैक्टिकल 10 अंक का है: <b>3</b> अंक सही प्रक्रिया (कमांड/क्लिक पथ अक्षरशः दर्ज हो), <b>3</b> अंक परिणाम के संख्यात्मक मान (size, time, version, count), <b>2</b> अंक सबूत (स्क्रीनशॉट/लॉग), <b>2</b> अंक स्पष्टीकरण (कार्य में किए बदलाव वापस लाना + "यह क्यों ज़रूरी है" 2 पंक्ति)।</p>`},

    {type:'table', head:['विषय','मानदंड (Criteria)','अंक'],
      rows:[
        ['प्रक्रिया (Procedure)','कमांड/क्लिक पथ सही, क्रम में, असली सिंटेक्स (Syntax) के साथ','3'],
        ['परिणाम (Result)','मापने योग्य मान भरे हैं (MB, %, version, hop count, समय)','3'],
        ['सबूत (Evidence)','स्क्रीनशॉट/लॉग फ़ाइल/आउटपुट चिपका है','2'],
        ['यथास्थिति + व्याख्या','बदली सेटिंग वापस आई; 2 पंक्ति में "क्यों ज़रूरी"','2'],
        ['कुल (प्रति कार्य)','25 कार्य (200–229) × 10 = 250 अंक (सत्रांत प्लस प्रैक्टिकल)','10']
      ]},

    {type:'table', head:['समूह','जमा करने वाले सबूत (Deliverables)','सबसे कठिन हिस्सा'],
      rows:[
        ['A (200–207)',' rename/संरचना का screenshot, Task Manager की 3 पंक्तियाँ, cleanmgr से छूटी MB, driver version, winver का build, बदली 5 सेटिंग्स, 4 screenshot + Word नोट','परिणाम में संख्या भरना (बहुत से केवल "किया" लिख देते हैं)'],
        ['B (208–213)','DOCX + PDF (TOC), .xlsx (6 फ़ॉर्म्युले), PivotTable + 3 chart PDF, Master के पहले/बाद व handout PDF, .accdb + SQL view, Rule स्क्रीनशॉट','VLOOKUP के arguments और Pivot का % of Grand Total'],
        ['C (214–219)','lab214.log, octal→rwx तालिका, 10 कमांड output, install/remove log, 3 scripts (.sh), ssh_config फ़ाइल','Permissions का octal हिसाब व pipe chain'],
        ['D (220–225)','ipconfig /all का पूरा output, router info sheet (पासवर्ड नहीं), password नियम-पत्र, 2FA का स्वरूप, backup तालिका + log, AV version/समय','DNS flush से पहले/बाद का nslookup तुलना'],
        ['E (226–229)','पहले/बाद नाम list, combined.pdf + size पहले/बाद, OCR raw vs proofread text, hash के 2 मान','एक-अक्षर बदलने पर hash पूरा बदलना — इसे समझाना']
      ]},

    {type:'callout', kind:'warn', title:'छात्रों की 10 आम ग़लतियाँ', html:'<ol><li>लैब PC की सेटिंग बदलकर <b>वापस नहीं</b> लाना (अगले बैच को समस्या)।</li><li>परिणाम में संख्या के स्थान पर केवल "किया" लिखना — अंक कटेंगे।</li><li><code>rm -rf /</code> जैसा कमांड "चलाके देखने" की कोशिश — हानिकारक, कभी नहीं।</li><li>C: डिस्क पर सारा काम रखना; फ़ॉर्मेट/reinstall में सब मिट जाता है।</li><li>Extension बदलकर फ़ाइल "खराब" होना, फिर रोना (<code>data.txt</code> को <code>data.jpg</code> करना)।</li><li>असली पासवर्ड/OTP/router credential नोटबुक या स्क्रीनशॉट में डाल देना।</li><li>किसी और का account खोलकर 2FA/Backup का प्रयोग करना।</li><li>Word में style के बदले font size बढ़ाकर heading बनाना — TOC नहीं बनेगा।</li><li>Excel में data में blank row/merged cell रखकर Pivot बनाना (गलत सारांश)।</li><li>Backup लेने के बाद <b>restore drill</b> न करना — बिना test किए backup अधूरा है।</li></ol>'},

    {type:'table', head:['ग़लती/त्रुटि (Error)','कहाँ मिलती है','कारण व समाधान'],
      rows:[
        ['"Permission denied"','लिनक्स (215, 218)','execute/write bit नहीं — <code>chmod +x file.sh</code>, <code>./file.sh</code>; owner ग़लत हो तो <code>sudo chown</code>'],
        ['"Command not found"','लिनक्स (214, 217)','या तो ग़लत वर्तनी, या पैकेज इंस्टॉल नहीं (<code>apt install</code>), या <code>/usr/sbin</code> वाला कमांड root चाहिए'],
        ['"File not found / cannot find path"','CMD (220, 224, 226)','ग़लत drive पर <code>cd</code> नहीं किया, या नाम में space है → पथ को <code>"..."</code> में डालें'],
        ['<code>#REF!</code>, <code>#VALUE!</code>, <code>#DIV/0!</code>','Excel (209–210)','हटाया गया reference, text पर गणना, शून्य से भाग — cell ठीक करके formula दोबारा लिखें'],
        ['"Duplicate values not allowed"','Access (212)','Primary Key पर दोहराव — key field बदलें या AutoNumber रखें'],
        ['TOC खाली/एरर दिखाना','Word (208)','Heading styles लागू नहीं या field update नहीं — style लगाकर Update entire table'],
        ['DHCP से IP नहीं (169.254.x.x)','220–221','DHCP server/router बंद/केबल ढीला — <code>ipconfig /renew</code>, router/स्विच जाँचें (APIPA)'],
        ['2FA का code ग़लत','223','फ़ोन/PC की घड़ी गड़बड़ (TOTP time-dependent) — auto time-zone चालू कीजिए'],
        ['"Archive corrupted / missing volume"','229','.002/.003 फ़ाइल गायब या अधूरा download — सब volumes एक जगह रखकर फिर extract, hash मिलाकर जाँचें'],
        ['Update अटक गया (0x80xxxxxx)','205','डिस्क जगह/सर्विस/इंटरनेट — troubleshooter चलाएँ, जगह खाली करें, शिक्षक से servicing']
      ]},

    {type:'code', lang:'cmd', code:`:: --- कार्य 220 : नेटवर्क जाँच ---
ipconfig /all
ping 127.0.0.1
ping -n 10 8.8.8.8
tracert google.com
nslookup google.com
ipconfig /flushdns
ipconfig /release && ipconfig /renew
arp -a

:: --- कार्य 226 : थोक नाम परिवर्तन ---
ren *.jpg photo.*
ren photo?.* img?.*
for %f in (*.txt) do ren "%f" "note_%f"

:: --- कार्य 224 : मिरर बैकअप + लॉग ---
robocopy D:\\MyWork E:\\Backup-MyWork /MIR /R:2 /W:2 /LOG:C:\\backup.log

:: --- कार्य 229 : हैश सत्यापन ---
certutil -hashfile combined.pdf SHA256
certutil -hashfile combined.pdf MD5

:: --- अन्य ज़रूरी (202, 203, 204, 225) ---
taskmgr
cleanmgr
devmgmt.msc
winver
windowsdefender:`},

    {type:'code', lang:'bash', code:`# --- कार्य 214 : फ़ाइल संचालन + लॉग ---
pwd; ls -la
mkdir lab214 && cd lab214
touch a.txt; cp a.txt b.txt; mv b.txt c.txt; rm c.txt
echo "Linux lab" > note.txt; echo "line 2" >> note.txt
ln -s note.txt link1; ls -l

# --- कार्य 215 : अनुमतियाँ ---
chmod 755 hello.sh; chmod 644 notes.txt; ls -l
chmod u=rw,go=r notes.txt
sudo chown $USER: hello.sh

# --- कार्य 216 : खोज व पाइप ---
grep -in "ravi" students.csv
cut -d"," -f3 students.csv | sort | uniq -c | sort -rn
grep "60" students.csv > pass.txt
find . -name "*.txt" -mtime -7

# --- कार्य 217 : पैकेज (Debian/Ubuntu) ---
sudo apt update
apt show geany
sudo apt install geany
sudo apt remove geany && sudo apt autoremove

# --- कार्य 218 : Bash script (age.sh) ---
#!/bin/bash
read -p "उम्र डालिए: " age
if [ $age -ge 18 ]; then echo "वयस्क"; else echo "नाबालिग"; fi
bash -n age.sh; echo $?

# --- कार्य 219 : SSH ---
ssh-keygen -t ed25519
ssh-copy-id user@192.168.1.20
ssh lab1 "df -h"

# --- कार्य 229 : आर्काइव + हैश ---
tar -czf lab229.tar.gz lab229/
tar -xzf lab229.tar.gz
sha256sum lab229.tar.gz; md5sum lab229.tar.gz
sha256sum *.zip > sums.txt && sha256sum -c sums.txt`},

    {type:'steps', items:[
      {n:1, title:'सत्र की तैयारी (5 मिनट)', text:'प्रैक्टिकल फ़ाइल में तारीख + कार्य संख्या (200–229) लिखिए, theory का संबंधित पेज 5 मिनट स्क्रिम कीजिए, test फ़ोल्डर बनाइए।', tips:'हर बार "backup फ़ोल्डर" पहले — फिर प्रयोग।', warn:'लैब PC की सेटिंग बदलने से पहले पुराना मान लिखिए।'},
      {n:2, title:'उद्देश्य पढ़कर योजना (5 मिनट)', text:'Aim पढ़कर 3 सवाल ख़ुद से पूछिए: क्या करना है, कौन-सा टूल/कमांड, कौन-सा आँकड़ा Result में जाएगा।'},
      {n:3, title:'प्रक्रिया चरण-दर-चरण (25–40 मिनट)', text:'steps क्रम से कीजिए; हर कमांड को अक्षरशः typed करके चलाइए — copy-paste से सिंटेक्स याद नहीं होता।', tips:'आउटपुट तुरंत फ़ाइल में redirect/सcreenshots से सेव कीजिए।', warn:'"शायद काम करेगा" कहकर root/sudo वाले कमांड न चलाएँ।'},
      {n:4, title:'आँकड़े निकालना (10 मिनट)', text:'size, time, version, count, % — Result फ़ॉर्म में भरिए; आँकड़ा नहीं है तो कार्य अधूरा।'},
      {n:5, title:'यथास्थिति व सफ़ाई (5 मिनट)', text:'बदली सेटिंग वापस, temp फ़ाइलें हटाकर अपना काम backup फ़ोल्डर में, दूसरे users का data न छेड़ें।', tips:'लैब PC: logout + Win + L आदत।'},
      {n:6, title:'रिपोर्ट + शिक्षक जाँच (10 मिनट)', text:'6-पंक्ति रिपोर्ट + सबूत संलग्न, "क्यों ज़रूरी" 2 पंक्ति, शिक्षक से हस्ताक्षर; तभी ✓ लगाइए।', warn:'✓ पहले लगाकर बाद में काम करना — प्रगति झूठी हो जाती है।'}
    ]},

    {type:'acc', title:'अटकने पर अक्सर पूछे जाने वाले 8 प्रश्न', items:[
      {q:'लैब PC में Administrator का पासवर्ड नहीं है, क्या करूँ?', a:'कभी brute-force/guess न करें। sudo (लिनक्स) या UAC elevation (विंडोज़) के लिए शिक्षक/लैब इंचार्ज से माँगें, और कार्य को standard account पर ही संभव बनाइए — यही production आदत है।'},
      {q:'कमांड "not recognized" आ रहा है?', a:'वर्तनी (spelling) जाँचिए, सही shell में हैं या नहीं (CMD बनाम PowerShell बनाम bash) और पैकेज इंस्टॉल है या नहीं (<code>apt install</code>/<code>dnf install</code>)। Linux में पहले बार <code>./script.sh</code> के लिए <code>chmod +x</code> ज़रूरी है।'},
      {q:'robocopy में /MIR से मेरी extra फ़ाइलें मिट गईं?', a:'/MIR destination की अतिरिक्त फ़ाइलें भी हटा देता है (mirror)। पहली बार हमेशा test फ़ोल्डर पर चलाइए या /MIR के स्थान पर /E (सिर्फ़ copy) रखिए; destination ग़लत न हो, यह path दो बार पढ़िए।'},
      {q:'Word में TOC में page number ग़लत/खाली है?', a:'heading पर Actual Heading style लगा है या नहीं देखिए; फिर TOC पर Right-click → Update Field → Update entire table। Section break के बाद numbering "Continue from previous section" पर है या Start at 1 — यह जाँचिए।'},
      {q:'Excel में VLOOKUP #N/A दे रहा है?', a:'या तो lookup value उसी कॉलम में नहीं (first column ज़रूरी), या space/case फ़र्क़, या FALSE (exact match) छूट गया, या reference $ से lock नहीं — range गलत होकर नीचे की rows छूट गईं।'},
      {q:'Router का admin panel नहीं खुल रहा?', a:'PC router की LAN पर हो (guest Wi-Fi पर नहीं), gateway IP सही हो, और कुछ routers HTTP पर 80 port बंद रखते हैं — शिक्षक से port/HTTPS पता कीजिए; किसी का पासवर्ड टॉइंग नहीं।'},
      {q:'SSH में "Too many authentication failures / Permission denied (publickey)"?', a:'public key server की <code>~/.ssh/authorized_keys</code> में पूरी तरह गई है या नहीं, permission (<code>~/.ssh</code> 700, file 600), और सही user/key चुना है — <code>ssh -v</code> से log पढ़िए।'},
      {q:'Hash मेल नहीं खा रहा — फ़ाइल खराब?', a:'दोनों समय करें: सही फ़ाइल पर (extract/खोलने के बाद नहीं, download हुई मूल फ़ाइल पर) और published value के same algorithm (SHA-256 बनाम MD5 मिलाया नहीं?) से। फिर भी differ करे → download अधूरा/बदला हुआ, दोबारा download कीजिए।'}
    ]},

    {type:'callout', kind:'tip', title:'पाँच "कभी नहीं" नियम (लैब सुरक्षा)', html:'<b>1)</b> किसी और के account/password पर प्रयोग नहीं। <b>2)</b> <code>rm -rf</code>, diskpart/format, registry hack बिना शिक्षक के नहीं। <b>3)</b> अज्ञात .exe/attachment खोलना या "crack/keygen" download नहीं। <b>4)</b> असली पासवर्ड/OTP/कोर्स key नोटबुक या स्क्रीनशॉट में नहीं। <b>5)</b> कोई भी सेटिंग बदलकर यथास्थिति वापस लाए बिना PC नहीं छोड़ना।'},

    {type:'callout', kind:'exam', title:'परीक्षा/वIVA में इन कार्यों से सबसे ज़्यादा प्रश्न', html:'<ul><li>Task Manager में <b>कौन-से 4 कॉलम</b> से समस्या पहचानते हैं? CPU/Memory/Disk/Network — सबसे ज़्यादा खपत वाला प्रोसेसर।</li><li><code>ipconfig</code> बनाम <code>ifconfig</code>/<code>ip addr</code>, <code>ipconfig /flushdns</code> कब/क्यों?</li><li><code>chmod 755</code> का मतलब rwxr-xr-x लिखकर बताइए; &gt; बनाम &gt;&gt;।</li><li>BIOS/UEFI नहीं — यहाँ <b>Device Manager में ⚠</b> का कारण व समाधान।</li><li>3-2-1 backup नियम और restore drill की ज़रूरत; 2FA के 3 कारक प्रकार (know/possess/inherent)।</li><li>Hash (SHA-256) vs Encryption (AES) vs Compression (ZIP) — तीनों का अलग काम।</li><li>Word: TOC किस पर निर्भर? Excel: VLOOKUP के 4 argument; PPT: Master vs Animation; Access: Primary Key; Outlook: Rule vs Filter vs Signature।</li><li>MD5/SHA-1 की कमज़ोरी व आज SHA-256 क्यों? (collision/तोड़े जा चुके)।</li></ul>'},

    {type:'table', head:['कार्य','सत्र (Period)','गिनती (Count)','अगला कदम (Theory पेज)'],
      rows:[
        ['200–203','1 सत्र','4','विंडोज़ मास्टरक्लास — UI व Administration'],
        ['204–207','1 सत्र','4','विंडोज़ — Install/Repair + BSOD व Drivers'],
        ['208–210','2 सत्र','3','MS Office — Word व Excel (Part 1 + 2)'],
        ['211–213','2 सत्र','3','PowerPoint / Access / Outlook'],
        ['214–216','2 सत्र','3','लिनक्स — Terminal व Filesystem'],
        ['217–219','2 सत्र','3','लिनक्स — Package, Bash, Server/SSH'],
        ['220–222','1 सत्र','3','इंटरनेट व साइबर सुरक्षा'],
        ['223–225','1 सत्र','3','सुरक्षा — Authentication, Backup, Antivirus'],
        ['226–229','1 सत्र','4','Files, Compression व Cloud (sec-data)'],
        ['कुल','12 सत्र','30','— कार्य 200 से 229 —']
      ]},

    {type:'html', html:`<h3 class="blk"><span class="blk-n">1.3</span> निष्कर्ष — 30 कार्य के बाद आपको क्या आना चाहिए</h3>
      <ul>
        <li>विंडोज़ की <b>पाँच जगहें</b> बिना बताए मिल जाएँ: Task Manager, Device Manager, Disk Cleanup/Storage, Windows Update, Default apps।</li>
        <li>Office में <b>styles → TOC</b>, <b>formula → pivot → chart</b>, <b>master → handout</b>, <b>table → query</b>, <b>rule → signature</b> की पूरी श्रृंखला।</li>
        <li>लिनक्स में <b>कमांड + विकल्प + output</b> पढ़ने की आदत, permission का octal हिसाब और छोटी script लिखने की हिम्मत।</li>
        <li>नेटवर्क में <b>ipconfig → ping → tracert → nslookup</b> का क्रम और router से पढ़ने वाली 8 जानकारी।</li>
        <li>सुरक्षा में <b>पासवर्ड नियम, 2FA, 3-2-1 backup, AV scan, hash verification</b> — यह पाँच चीज़ें हर सर्विसिंग/ऑफ़िस जॉब में पूछी जाती हैं।</li>
      </ul>
      <p>अगला पेज: <b>📝 सॉफ़्टवेयर क्विज़ (80+ प्रश्न)</b> — इन कार्यों और theory का मिश्रित परीक्षण।</p>`},

      { type: 'html', html: '<h3>1.4 इन 30 कार्यों में बार-बार काम आने वाले शॉर्टकट</h3><p>हर कार्य में माउस कम और कीबोर्ड ज़्यादा चलाएँ — यही असली कौशल है। नीचे वे keys हैं जो 200–229 तक लगभग हर कार्य में लगती हैं। इन्हें एक काग़ज़ पर लिखकर मशीन के पास रखें और पहले सप्ताह में बिना देखे टाइप करने लायक बना लें।</p>' },
      { type: 'table', head: ['शॉर्टकट', 'किसमें', 'काम', 'किस कार्य में'], rows: [
        ['Win+E', 'विंडोज़', 'File Explorer खोलना', '200, 201, 203'],
        ['Win+R', 'विंडोज़', 'Run box — cmd, msconfig, appwiz.cpl', '202, 204, 206'],
        ['Ctrl+Shift+Esc', 'विंडोज़', 'Task Manager सीधे', '202'],
        ['Ctrl+Shift+N', 'Explorer', 'नया folder', '200'],
        ['F2 / Alt+Enter', 'Explorer', 'नाम बदलना / Properties', '200, 201'],
        ['Shift+Delete', 'विंडोज़', 'Recycle Bin छोड़कर स्थायी मिटाना (सावधान)', '203'],
        ['Win+Shift+S', 'विंडोज़', 'Screen clipping — सबूत का screenshot', 'सभी 30'],
        ['Win+V', 'विंडोज़', 'Clipboard history', 'Office कार्य'],
        ['Ctrl+S / F12', 'Office', 'Save / Save As', '208–212'],
        ['Ctrl+Shift+S / Alt+F,S', 'Word/Excel', 'Save As का दूसरा रास्ता', '208, 209'],
        ['Ctrl+T / Ctrl+L', 'Excel', 'Range को Table बनाना', '210, 211'],
        ['Alt+= ', 'Excel', 'AutoSUM', '210'],
        ['F4', 'Excel', 'पिछला काम दोहराना / reference को $ लगाना', '210, 211'],
        ['F5 / Ctrl+G', 'Word/Excel', 'Go To — नामित range पर जाना', '211'],
        ['Ctrl+Alt+T', 'लिनक्स', 'Terminal खोलना', '214–219'],
        ['Ctrl+Shift+C / V', 'Terminal', 'Copy / Paste (Ctrl+C वहाँ रोकता है)', '214–219'],
        ['Tab', 'bash', 'नाम पूरा करना — typing की आधी ग़लती बचाता है', '214–219'],
        ['Ctrl+R', 'bash', 'पुराने command में खोज', '216'],
        ['Ctrl+L / clear', 'bash', 'screen साफ़ (इतिहास नहीं मिटता)', 'सभी'],
        ['↑ / !! / !$', 'bash', 'पिछला command / पूरा दोहराना / पिछला तर्क', '215'],
        ['Ctrl+C / Ctrl+Z / Ctrl+D', 'bash', 'रोकना / suspend / EOF (exit)', '216'],
        ['Ctrl+Alt+F2…F6', 'लिनक्स', 'दूसरा TTY — GUI अटके तो', '219'],
      ] },
      { type: 'code', code: 'प्रैक्टिकल रिपोर्ट — भरा हुआ नमूना (कार्य 200)\n====================================================\nनाम        : ____________________      रोल नं. : __________\nबैच        : 2026-27                    दिनांक  : __________\nकार्य संख्या : 200\nउद्देश्य    : एक तय folder संरचना बनाना और फ़ाइलें सही जगह रखना।\nउपकरण      : विंडोज़ 11, File Explorer, Notepad\n\nप्रक्रिया (जो मैंने किया, अपने शब्दों में):\n  1. Win+E दबाया, D: खोला, Ctrl+Shift+N से "ITI_2026" बनाया।\n  2. उसके अंदर 4 folder बनाए — Theory, Practical, Reports, Backup।\n  3. Notepad में 5 पंक्ति लिखकर Theory\\notes.txt नाम से सेव किया।\n  4. उसी file की copy Ctrl+C / Ctrl+V से Backup में रखी।\n  5. Properties (Alt+Enter) से दोनों का size मिलाया — 132 bytes, बराबर।\n\nप्रेक्षण (Observation):\n  बनाए गए folder : 5     बनाई गई फ़ाइलें : 1     copy : 1\n  मूल व copy का size : 132 bytes = 132 bytes (मिलान सही)\n\nकठिनाई व समाधान:\n  सेव करते समय नाम notes.txt.txt बन गया था। कारण — Explorer में\n  "File name extensions" छिपा था। View → Show → File name\n  extensions चालू करके सही नाम रखा।\n\nपरिणाम : माँगी गई संरचना बन गई; मूल और नक़ल का size बराबर मिला।\nसबूत   : screenshot संलग्न (folder tree + Properties विंडो)\nशिक्षक हस्ताक्षर : ____________        अंक : ____ / 10' },
      { type: 'quiz', store: 'sw-labs', items: [
        { q: 'प्रैक्टिकल रिपोर्ट के 6 अनिवार्य भाग कौन-से हैं?', o: ['नाम, रोल, दिनांक, फ़ोन, पता, हस्ताक्षर', 'उद्देश्य, उपकरण, प्रक्रिया, प्रेक्षण, कठिनाई/समाधान, परिणाम', 'परिचय, इतिहास, सिद्धांत, निष्कर्ष, संदर्भ, परिशिष्ट', 'प्रश्न, उत्तर, अंक, समय, स्थान, गवाह'], a: 1, ex: 'यही छह-पंक्ति फ़ॉर्मेट ITI वर्कशॉप प्रैक्टिकल बुक का मानक है और इसी पर अंक कटते हैं।' },
        { q: 'Task Manager सीधे खोलने का शॉर्टकट?', o: ['Ctrl+Alt+Del', 'Ctrl+Shift+Esc', 'Win+T', 'Alt+F4'], a: 1, ex: 'Ctrl+Shift+Esc सीधे Task Manager खोलता है; Ctrl+Alt+Del पहले security screen दिखाता है।' },
        { q: 'नया folder बनाने का Explorer शॉर्टकट?', o: ['Ctrl+N', 'Ctrl+Shift+N', 'Ctrl+F', 'Alt+N'], a: 1, ex: 'Ctrl+Shift+N = नया folder. Ctrl+N Explorer में नई विंडो खोलता है।' },
        { q: 'Recycle Bin छोड़कर स्थायी मिटाने वाली key — और क्यों सावधानी?', o: ['Delete — कोई जोखिम नहीं', 'Shift+Delete — वापसी आसान नहीं', 'Ctrl+Delete — केवल नाम मिटता है', 'Alt+Delete — छिपा देता है'], a: 1, ex: 'Shift+Delete फ़ाइल Recycle Bin में नहीं भेजता, इसलिए सामान्य तरीक़े से वापस नहीं आती। लैब में पहले backup लें।' },
        { q: 'सबूत का screenshot लेने का सबसे तेज़ तरीक़ा?', o: ['PrtScn और Paint में paste', 'Win+Shift+S से क्षेत्र चुनना', 'फ़ोन से फ़ोटो', 'Alt+Tab'], a: 1, ex: 'Win+Shift+S (Snipping Tool) से केवल ज़रूरी हिस्सा कटता है और clipboard में आता है — रिपोर्ट में सीधे paste करें।' },
        { q: 'फ़ाइल सेव करते समय नाम notes.txt.txt बन गया — असली कारण?', o: ['Notepad की ख़राबी', 'Explorer में file extensions छिपी थीं', 'virus', 'disk भरी है'], a: 1, ex: 'Extension छिपी हो तो दिखता notes.txt असल में notes.txt.txt होता है। View → Show → File name extensions चालू करें।' },
        { q: 'Excel में Range को Table बनाने का शॉर्टकट?', o: ['Ctrl+T', 'Ctrl+D', 'Ctrl+R', 'Ctrl+B'], a: 0, ex: 'Ctrl+T (या Ctrl+L) Create Table खोलता है। Table बनते ही structured reference व auto-filter मिलते हैं।' },
        { q: 'Excel में AutoSUM की key?', o: ['Alt+=', 'Ctrl+=', 'Shift+=', 'F2'], a: 0, ex: 'Alt+= ऊपर/बाईं ओर की संख्याओं का SUM अपने आप लगा देता है।' },
        { q: 'Excel में F4 का दोहरा काम क्या है?', o: ['Save और Print', 'पिछला काम दोहराना और reference में $ लगाना', 'Bold और Italic', 'Undo और Redo'], a: 1, ex: 'खाली सेल में F4 पिछला action दोहराता है; formula लिखते समय reference पर F4 से A1 → $A$1 → A$1 → $A1 चक्र चलता है।' },
        { q: 'लिनक्स terminal में paste की सही key?', o: ['Ctrl+V', 'Ctrl+Shift+V', 'Alt+V', 'Shift+Insert ही एकमात्र'], a: 1, ex: 'Terminal में Ctrl+C प्रोग्राम रोकता है और Ctrl+V कुछ और करता है, इसलिए copy/paste Ctrl+Shift+C / Ctrl+Shift+V है (Shift+Insert भी चलता है)।' },
        { q: 'bash में Ctrl+R क्या करता है?', o: ['screen साफ़', 'पुराने commands में खोज (reverse search)', 'प्रोग्राम restart', 'फ़ाइल rename'], a: 1, ex: 'Ctrl+R दबाकर शब्द टाइप करें — इतिहास से मेल खाता command आ जाता है; Enter से चलेगा, तीर से बदल सकते हैं।' },
        { q: 'चल रहे terminal program को रोकने की key?', o: ['Ctrl+Z', 'Ctrl+C', 'Ctrl+D', 'Ctrl+L'], a: 1, ex: 'Ctrl+C = SIGINT (रोकना), Ctrl+Z = SIGTSTP (suspend, बाद में fg), Ctrl+D = EOF/exit, Ctrl+L = screen साफ़।' },
        { q: 'bash में !$ का अर्थ?', o: ['पिछला पूरा command', 'पिछले command का अंतिम तर्क', 'exit status', 'सब तर्क'], a: 1, ex: '!! = पूरा पिछला command, !$ = उसका अंतिम argument, !* = सारे arguments. जैसे mkdir lab214 के बाद cd !$ .' },
        { q: 'ping 127.0.0.1 किस चीज़ की जाँच है?', o: ['इंटरनेट चल रहा है', 'इस मशीन का TCP/IP stack ठीक है', 'DNS काम कर रहा है', 'router ठीक है'], a: 1, ex: '127.0.0.1 loopback है — यह NIC/बाहरी नेटवर्क तक जाता ही नहीं। यही fail हो तो स्थानीय TCP/IP stack या driver की समस्या है।' },
        { q: 'ipconfig /all में कौन-सी जानकारी नहीं मिलती?', o: ['MAC (Physical Address)', 'DHCP व DNS server', 'रास्ते के हर router का नाम', 'IP व subnet mask'], a: 2, ex: 'रास्ते के hops के लिए tracert/traceroute चाहिए। ipconfig केवल अपने interface का विवरण देता है।' },
        { q: 'लैब में मशीन बंद करने से पहले अनिवार्य कदम?', o: ['सीधे बिजली का स्विच बंद', 'काम सेव करके यथास्थिति व सफ़ाई, फिर Shut down', 'केवल monitor बंद', 'cable खींच देना'], a: 1, ex: 'सत्र के अंतिम 5 मिनट यथास्थिति के लिए हैं — सेव, बनाई अस्थायी फ़ाइलें हटाना, सीट साफ़, फिर विधिवत shutdown।' },
        { q: 'कार्य का “परिणाम” लिखते समय क्या लिखना चाहिए?', o: ['जो सोचा था वही', 'जो असल में प्रेक्षित हुआ, आँकड़ों सहित', 'केवल “सफल रहा”', 'अगले कार्य की योजना'], a: 1, ex: 'परिणाम प्रेक्षण पर आधारित हो — जैसे “दोनों file का size 132 bytes बराबर मिला”। केवल “सफल” लिखने पर अंक कटते हैं।' },
        { q: 'किसी कार्य में अटक जाएँ तो सबसे पहले?', o: ['मशीन restart', 'त्रुटि का पूरा संदेश पढ़कर त्रुटि-तालिका में ढूँढ़ना', 'दूसरे की file copy करना', 'कार्य छोड़ देना'], a: 1, ex: 'त्रुटि संदेश ही सबसे बड़ा सुराग है। उसे शब्दशः लिखें, फिर कारण-समाधान तालिका या खोज में वही शब्द डालें। नक़ल करना सीखना नहीं है।' },
        { q: 'GUI अटक जाए पर लिनक्स में shell चाहिए तो?', o: ['Ctrl+Alt+Del', 'Ctrl+Alt+F2…F6 से दूसरा TTY', 'पावर बटन दबाकर रखना', 'Alt+F4'], a: 1, ex: 'Ctrl+Alt+F2 (या F3…F6) text console देता है; login करके समस्या देखें। वापस GUI पर आने के लिए आम तौर पर Ctrl+Alt+F1/F7.' },
        { q: '30 कार्य पूरे करने के बाद सबसे बड़ा लाभ क्या माना जाएगा?', o: ['सब screenshot जमा होना', 'बिना देखे वही कार्य दोहरा पाना और त्रुटि ख़ुद सुधार पाना', 'तेज़ टाइपिंग', 'सब उत्तर याद होना'], a: 1, ex: 'मूल्यांकन कौशल पर है — दोहराव, त्रुटि-निदान और साफ़ रिपोर्ट। screenshot केवल सबूत हैं, कौशल नहीं।' },
      ] },
  ]
},
]);

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
{
  id: 'sw-quiz',
  icon: '📝',
  group: 'सॉफ़्टवेयर प्रैक्टिकल',
  title: 'सॉफ़्टवेयर महा-क्विज़ — 100 प्रश्न',
  sub: 'दस विषय-सेट · हर प्रश्न का कारण-सहित उत्तर · अलग-अलग प्रगति-भंडार · गलती-विश्लेषण',
  kicker: 'Software Practical 2 · Master Quiz (100 Questions)',
  hero: 'यह पूरे कंप्यूटर-कोर्स की एक साथ परख है — दस सेट, हर सेट में दस प्रश्न, कुल सौ। सेट क्रमशः हार्डवेयर व आधार, ऑपरेटिंग सिस्टम व विंडोज़, लिनक्स, MS Office, इंटरनेट व नेटवर्किंग, साइबर सुरक्षा, सॉफ़्टवेयर व यूटिलिटी, प्रोग्रामिंग व कंप्यूटर विज्ञान, क्लाउड-AI-नई तकनीक, और मिश्रित संख्या-इकाई-full form पर हैं। हर प्रश्न के चार विकल्प, सही उत्तर और उसका कारण (explanation) दिया गया है — इसलिए गलती होने पर तुरंत समझ आता है कि अवधारणा कहाँ चूकी। हर सेट की प्रगति अलग सहेजी जाती है, इसलिए आप कमज़ोर सेट को बार-बार दोहरा सकते हैं। अंत में गलती-विश्लेषण तालिका, अंक-पट्टी और दोबारा प्रयास की नीति दी गई है।',
  tags: ['10 सेट × 10 प्रश्न', 'कारण-सहित उत्तर', 'अलग प्रगति-भंडार', 'गलती-विश्लेषण', 'अंक-पट्टी', 'पुनरावृत्ति नीति'],
  blocks: [

    { type: 'html', html: '<h3>2.1 यह महा-क्विज़ कैसे काम करता है</h3><p>नीचे दस अलग-अलग क्विज़-सेट हैं। हर सेट स्वतंत्र है — उसका अपना प्रश्न-समूह, अपना score और अपना सहेजा हुआ इतिहास। किसी सेट में उत्तर चुनते ही सही/गलत रंग और <b>कारण (explanation)</b> दिखता है; अंत में कुल अंक दिखते हैं। सेट पूरा होने के बाद दोबारा प्रयास करने पर प्रगति उसी सेट की मिटकर नई बनती है — बाकी सेट अछूते रहते हैं। इसलिए <b>कमज़ोर सेट को अलग से दोहराना</b> सबसे किफ़ायती अभ्यास है।</p>' },

    { type: 'callout', kind: 'tip', title: 'पहले नियम, फिर प्रश्न',
      html: '(1) एक बैठक में <b>एक या दो सेट</b> ही करें — दस एक साथ करने से थकान में गलतियाँ बढ़ती हैं। (2) उत्तर देखने से पहले <b>कारण स्वयं बोलकर</b> बताएँ; जो कारण आप समझा नहीं सकते, वह अवधारणा अभी कच्ची है। (3) गलत प्रश्न को नोटबुक में <b>विषय + सही तथ्य + अपनी चूक</b> के रूप में लिखें। (4) उसी विषय का संबंधित पेज खोलकर पढ़ें, फिर <b>अगले दिन</b> वही सेट दोहराएँ (spaced repetition)। (5) अंक नहीं, <b>गलती का पैटर्न</b> देखें — क्या चूक इकाई में है, शब्दावली में, या अवधारणा में?' },

    { type: 'table',
      head: ['सेट', 'विषय', 'प्रश्न', 'किस पेज से दोहराएँ', 'कठिनाई'],
      rows: [
        ['1', 'कंप्यूटर आधार व हार्डवेयर', '10', 'आधार, पुर्ज़े, हार्डवेयर गहराई (CPU/RAM/storage/GPU/peripheral)', 'आधार → मध्यम'],
        ['2', 'ऑपरेटिंग सिस्टम व विंडोज़', '10', 'विंडोज़ मास्टरक्लास (intro, UI, admin, CLI, install)', 'मध्यम'],
        ['3', 'लिनक्स', '10', 'लिनक्स मास्टरक्लास (intro, CLI, admin, install, script)', 'मध्यम'],
        ['4', 'MS Office — Word/Excel/PowerPoint', '10', 'MS Office मास्टरक्लास (Word, Excel 1-2, PPT, Access, Outlook)', 'मध्यम'],
        ['5', 'इंटरनेट व नेटवर्किंग', '10', 'इंटरनेट व साइबर सुरक्षा (वेब, ब्राउज़र), सिस्टम-नेटवर्क, डेटा-संचार', 'मध्यम'],
        ['6', 'साइबर सुरक्षा', '10', 'सुरक्षा व डेटा-रक्षा पेज, ब्राउज़र-सुरक्षा', 'मध्यम → उच्च'],
        ['7', 'सॉफ़्टवेयर, यूटिलिटी व लाइसेंस', '10', 'प्रोग्रामिंग की शुरुआत, उपयोगी सॉफ़्टवेयर व यूटिलिटी', 'आधार → मध्यम'],
        ['8', 'प्रोग्रामिंग व कंप्यूटर विज्ञान', '10', 'प्रोग्रामिंग की शुरुआत, कंप्यूटर विज्ञान (पीढ़ियाँ, संख्या, तर्क, डेटा, संचार)', 'मध्यम → उच्च'],
        ['9', 'क्लाउड, AI व नई तकनीक', '10', 'क्लाउड, AI व नई तकनीकें', 'मध्यम'],
        ['10', 'मिश्रित — संख्या, इकाई, full form, तर्क', '10', 'सभी पेज; विशेषकर संख्या-प्रणाली व शब्दकोश', 'उच्च']
      ] },

    { type: 'table',
      head: ['अंक (प्रति सेट 10 में से)', 'प्रतिशत', 'स्थिति', 'अगला कदम'],
      rows: [
        ['9–10', '90–100%', 'उत्कृष्ट — अवधारणा पक्की', 'अगले सेट पर जाएँ; एक सप्ताह बाद हल्की पुनरावृत्ति'],
        ['7–8', '70–80%', 'अच्छा — कुछ छिद्र', 'गलत प्रश्नों के विषय का पेज पढ़ें, अगले दिन वही सेट'],
        ['5–6', '50–60%', 'सीमा-रेखा — नींव ढीली', 'पहले संबंधित पेज पूरा पढ़ें, फिर सेट दोहराएँ'],
        ['3–4', '30–40%', 'कमज़ोर — अवधारणागत चूक', 'पेज के उदाहरण व तालिकाएँ स्वयं लिखकर बनाएँ; फिर सेट'],
        ['0–2', '0–20%', 'आरंभिक — पहले पढ़ना ज़रूरी', 'बिना पढ़े प्रश्न न करें; पहले आधार पेज, फिर धीरे-धीरे']
      ] },

    { type: 'steps', title: 'सौ प्रश्नों को अभ्यास में बदलने की रणनीति',
      items: [
        { n: '1', title: 'पहले दिन — निदान', text: 'सेट 1, 2 और 7 करें (आधार-प्रधान)। इनका score बताएगा कि नींव कहाँ ढीली है।', tips: ['अंक लिखें, पर निराश न हों — यह निदान है, परीक्षा नहीं'] },
        { n: '2', title: 'दूसरे दिन — उपचार', text: 'जिन सेट में 7 से कम आए, उनके संबंधित पेज खोलकर केवल वे भाग पढ़ें जिनसे गलत प्रश्न थे।', tips: ['तालिकाएँ स्वयं कापी पर दोबारा बनाएँ — लिखने से याद रहता है'] },
        { n: '3', title: 'तीसरे दिन — OS व लिनक्स', text: 'सेट 3 और 4 करें। कमांड वाले प्रश्न हों तो टर्मिनल खोलकर कमांड चलाकर देखें।', tips: ['जो कमांड चलाकर देखी, वह प्रश्न फिर कभी गलत नहीं होगा'] },
        { n: '4', title: 'चौथे दिन — नेटवर्क व सुरक्षा', text: 'सेट 5 और 6 करें। port, प्रोटोकॉल और हमले के नाम एक अलग कार्ड पर लिखें।', tips: ['port-सूची रोज़ एक बार बोलकर दोहराएँ'] },
        { n: '5', title: 'पाँचवें दिन — विज्ञान व नई तकनीक', text: 'सेट 8, 9 और 10 करें। संख्या-रूपांतरण वाले प्रश्न कागज़ पर हल करें, calculator से जाँचें।', tips: ['इकाई (bit/byte, KB/KiB) की चूक सबसे आम है — उसे अलग चिह्नित करें'] },
        { n: '6', title: 'छठे दिन — पूर्ण पुनरावृत्ति', text: 'सभी दस सेट दोबारा करें और पहले दिन के अंक से तुलना करें। सुधार-प्रतिशत लिखें।', tips: ['जो सेट अब भी 7 से नीचे है, उसे सातवें दिन फिर दोहराएँ — यही spaced repetition है'] }
      ] },

    { type: 'quiz', store: 'swq-hw', items: [
      { q: 'CPU का कौन-सा भाग अंकगणित व तर्क की गणना करता है?', o: ['Control Unit', 'ALU', 'Register', 'Cache'], a: 1, ex: 'ALU (Arithmetic Logic Unit) गणना करता है; Control Unit निर्देशों का प्रवाह नियंत्रित करती है, register अस्थायी मान रखते हैं।' },
      { q: 'कौन-सी memory बिजली जाने पर डेटा खो देती है?', o: ['ROM', 'SSD', 'RAM', 'HDD'], a: 2, ex: 'RAM volatile है। ROM, SSD, HDD non-volatile हैं — बिजली के बिना भी डेटा रखते हैं।' },
      { q: 'CPU की clock speed की इकाई क्या है?', o: ['GB', 'GHz', 'Mbps', 'RPM'], a: 1, ex: 'Hz = प्रति सेकंड चक्र; GHz = अरब चक्र/सेकंड। RPM डिस्क की घूर्णन-गति है, Mbps डेटा-दर।' },
      { q: 'SSD में NAND की कौन-सी कोशिका सबसे अधिक bit प्रति सेल रखती है?', o: ['SLC', 'MLC', 'TLC', 'QLC'], a: 3, ex: 'SLC=1, MLC=2, TLC=3, QLC=4 bit/सेल। अधिक bit = सस्ता व घना, पर धीमा व कम सहनशक्ति (TBW)।' },
      { q: 'मदरबोर्ड पर CPU की शक्ति पहुँचाने वाला VRM क्या करता है?', o: ['12V को CPU के निम्न core voltage में बदलना', 'डेटा encrypt करना', 'पंखा घुमाना', 'BIOS सहेजना'], a: 0, ex: 'VRM (Voltage Regulator Module) PSU के 12V को CPU/GPU के ~1V core voltage में उतारता है; कमज़ोर VRM से throttling।' },
      { q: 'Dual-channel RAM का लाभ कैसे मिलता है?', o: ['कोई भी दो stick लगा दें', 'सही जोड़ी को सही स्लॉट में लगाकर bandwidth दोगुनी करना', 'RAM overclock करना', 'BIOS अपडेट करना'], a: 1, ex: 'दो समान क्षमता/गति की stick को मदरबोर्ड के बताए जोड़े (प्रायः A2+B2) में लगाना पड़ता है; गलत स्लॉट = single channel।' },
      { q: 'लेज़र प्रिंटर में toner को कागज़ पर स्थायी करने वाला चरण?', o: ['Charging', 'Exposing', 'Developing', 'Fusing'], a: 3, ex: 'Fusing में गर्म roller toner को कागज़ में पिघलाकर बैठाता है। क्रम — Processing, Charging, Exposing, Developing, Transferring, Fusing, Cleaning।' },
      { q: 'किस interface पर NVMe SSD सबसे तेज़ चलती है?', o: ['SATA III', 'PCIe (M.2 NVMe)', 'USB 2.0', 'IDE'], a: 1, ex: 'NVMe PCIe lanes पर चलता है — SATA की 6 Gbps सीमा से कई गुना अधिक, और बहुत कम विलंब।' },
      { q: 'GPU का मुख्य कार्य क्या है?', o: ['फ़ाइलें सहेजना', 'समानांतर ग्राफ़िक्स/गणना rendering', 'OS चलाना', 'नेटवर्क packet भेजना'], a: 1, ex: 'GPU के हज़ारों छोटे core एक साथ समान गणना करते हैं — rendering, ML प्रशिक्षण व inference इसी पर निर्भर।' },
      { q: 'PSU की 80 PLUS रेटिंग क्या बताती है?', o: ['अधिकतम watt', 'दक्षता (efficiency) का स्तर', 'पंखे की गति', 'वोल्टता'], a: 1, ex: '80 PLUS (White/Bronze/Silver/Gold/Platinum/Titanium) बताता है कि AC→DC रूपांतरण में कितनी बिजली बचती है; कम बर्बादी = कम गर्मी व बिल।' }
    ] },

    { type: 'quiz', store: 'swq-os', items: [
      { q: 'ऑपरेटिंग सिस्टम का मुख्य कार्य क्या है?', o: ['केवल फ़ाइलें दिखाना', 'हार्डवेयर व एप्लिकेशन के बीच संसाधन-प्रबंधन', 'इंटरनेट देना', 'वायरस बनाना'], a: 1, ex: 'OS प्रक्रिया, memory, फ़ाइल, उपकरण व सुरक्षा का प्रबंधक है; एप्लिकेशन उसी के ऊपर चलते हैं।' },
      { q: 'Windows में process और thread में अंतर?', o: ['दोनों एक ही', 'process = स्वतंत्र memory-space वाला प्रोग्राम; thread = उसी के भीतर चलने वाली इकाई', 'thread बड़ा होता है', 'process केवल फ़ाइल है'], a: 1, ex: 'एक process में कई thread हो सकते हैं जो उसकी memory साझा करते हैं; process अलग-अलग memory रखते हैं।' },
      { q: 'Virtual memory (paging file) किसलिए है?', o: ['RAM को स्थायी बनाना', 'डिस्क के भाग को RAM की तरह उपयोग कर RAM-कमी सँभालना', 'डेटा encrypt करना', 'गति बढ़ाना'], a: 1, ex: 'कम RAM में OS निष्क्रिय पृष्ठ डिस्क पर भेजता है। यह RAM से बहुत धीमा है — अधिक paging = अधिक disk activity = सुस्ती।' },
      { q: 'NTFS की FAT32 से बड़ी विशेषता?', o: ['FAT32 तेज़ है', 'प्रति-फ़ाइल अनुमति, encryption, journaling व 4 GB से बड़ी फ़ाइल', 'FAT32 में folder नहीं', 'NTFS केवल USB के लिए'], a: 1, ex: 'FAT32 में एक फ़ाइल अधिकतम 4 GB की हो सकती है और अनुमति/ journaling नहीं। NTFS में ACL, EFS, compression, journaling सब है।' },
      { q: 'Windows Registry क्या रखता है?', o: ['उपयोगकर्ता की फ़ाइलें', 'OS व ऐप का विन्यास (configuration) पदानुक्रम', 'केवल पासवर्ड', 'इंटरनेट इतिहास'], a: 1, ex: 'HKLM/HKCU आदि hive में सेटिंग्स रहती हैं। काट-छाँट से पहले export अवश्य लें — गलत key से Windows अस्थिर हो सकता है।' },
      { q: 'UEFI की Legacy BIOS से विशेषता?', o: ['केवल पुराना समर्थन', 'GPT डिस्क, Secure Boot, तेज़ शुरुआत, बड़े boot volume', 'MBR अनिवार्य', 'graphical नहीं'], a: 1, ex: 'UEFI + GPT आधुनिक मानक है; Secure Boot अहस्ताक्षरित bootloader रोकता है। MBR में 2 TB व 4 primary partition की सीमा है।' },
      { q: 'Windows में Safe Mode किसलिए?', o: ['तेज़ gaming', 'न्यूनतम driver/सेवा के साथ boot करके दोष-निदान', 'डेटा मिटाना', 'इंटरनेट बंद करना'], a: 1, ex: 'समस्या खराब driver/ऐप से है तो Safe Mode में मशीन चल जाएगी — वहीं से uninstall/rollback करें।' },
      { q: 'SFC और DISM का सही क्रम व काम?', o: ['दोनों एक ही', 'DISM से component store सुधारें, फिर SFC से system फ़ाइलें', 'पहले SFC फिर DISM अनिवार्य', 'केवल formatting'], a: 1, ex: 'DISM /Online /Cleanup-Image /RestoreHealth स्वस्थ स्रोत लाता है; sfc /scannow उसी से भ्रष्ट system फ़ाइलें बदलता है।' },
      { q: 'Task Manager में कौन-सा कॉलम बताता है कि डिस्क ही अड़चन है?', o: ['CPU 100%', 'Disk 100% पर अटका रहना', 'Memory कम', 'Network शून्य'], a: 1, ex: 'Disk लगातार 100% = bottleneck। कारण — HDD, कम RAM से paging, indexing, antivirus scan या खराब डिस्क (SMART जाँचें)।' },
      { q: 'Windows.old फ़ोल्डर क्या है और कब मिटता है?', o: ['वायरस', 'upgrade के समय पुरानी Windows की प्रति; प्रायः 10 दिन में स्वतः साफ़', 'स्थायी backup', 'registry की नकल'], a: 1, ex: 'यह rollback के लिए रखी जाती है। Disk Cleanup → "Previous Windows installation" से इसे हटाकर जगह वापस मिलती है, पर rollback समाप्त।' }
    ] },

    { type: 'quiz', store: 'swq-lin', items: [
      { q: 'Linux में सब कुछ किस रूप में दिखता है?', o: ['registry key', 'फ़ाइल (उपकरण भी /dev में फ़ाइल)', 'केवल folder', 'DLL'], a: 1, ex: '"Everything is a file" — डिस्क /dev/sda, terminal /dev/tty, यहाँ तक कि kernel जानकारी /proc में फ़ाइल की तरह पढ़ी जाती है।' },
      { q: 'chmod 755 का अर्थ?', o: ['सबको सब', 'मालिक rwx, समूह r-x, अन्य r-x', 'केवल मालिक पढ़े', 'सब निष्पादित'], a: 1, ex: '7=rwx, 5=r-x, 5=r-x। अंक = r(4)+w(2)+x(1) का जोड़; क्रम मालिक-समूह-अन्य।' },
      { q: 'कौन-सी कमांड फ़ाइल के अंत की पंक्तियाँ लगातार दिखाती रहती है?', o: ['head', 'tail -f', 'cat', 'less'], a: 1, ex: 'tail -f लॉग पर नज़र रखने के लिए मानक है। head शुरू की पंक्तियाँ, cat पूरा, less पृष्ठ-दर-पृष्ठ।' },
      { q: 'grep में -i और -r का अर्थ?', o: ['उल्टा व तेज़', 'case-insensitive व recursive', 'केवल गिनती', 'रंग व दबाव'], a: 1, ex: '-i बड़े/छोटे अक्षर भेद मिटाता है; -r निर्देशिका में अंदर तक खोजता है। -n पंक्ति-संख्या, -v उल्टा चयन।' },
      { q: 'systemctl status nginx क्या दिखाता है?', o: ['केवल PID', 'सेवा की स्थिति, सक्रियता, हाल के लॉग व main PID', 'फ़ाइल सूची', 'नेटवर्क गति'], a: 1, ex: 'यह unit की loaded/active स्थिति, since कब से, main PID और journal की अंतिम पंक्तियाँ एक साथ देता है।' },
      { q: 'Linux में root का home और सामान्य उपयोगकर्ता का home?', o: ['/home/root और /root', '/root और /home/उपयोगकर्ता', 'दोनों /root', 'दोनों /home'], a: 1, ex: 'root का home /root है; अन्य उपयोगकर्ताओं का /home/नाम। ~ वर्तमान उपयोगकर्ता का home दर्शाता है।' },
      { q: 'कौन-सा runlevel/target बहु-उपयोगकर्ता graphical mode है?', o: ['runlevel 0', 'runlevel 1', 'runlevel 3', 'runlevel 5'], a: 3, ex: '0=halt, 1=single-user, 3=multi-user text, 5=multi-user graphical, 6=reboot। systemd में क्रमशः poweroff, rescue, multi-user, graphical.target।' },
      { q: 'पाइप (pipe) | का काम क्या है?', o: ['दो फ़ाइलें जोड़ना', 'एक कमांड का output दूसरी कमांड का input बनाना', 'background में चलाना', 'फ़ाइल में सहेजना'], a: 1, ex: 'ps aux | grep nginx — पहली का output दूसरी को मिलता है। > फ़ाइल में लिखता है, >> जोड़ता है, & background में चलाता है।' },
      { q: 'cron में "0 2 * * *" का अर्थ?', o: ['हर 2 मिनट', 'रोज़ रात 2:00 बजे', 'हर 2 घंटे', 'महीने में दूसरे दिन'], a: 1, ex: 'पाँच खाने — मिनट, घंटा, दिन-तारीख़, महीना, सप्ताह-दिन। 0 2 * * * = हर दिन 02:00।' },
      { q: 'script की पहली पंक्ति #!/bin/bash क्यों ज़रूरी है?', o: ['सजावट', 'kernel को बताना कि कौन-सा interpreter चलाए (shebang)', 'पासवर्ड', 'लाइसेंस'], a: 1, ex: 'इसे shebang कहते हैं। गलत path होने पर "bad interpreter" आता है। साथ में chmod +x भी चाहिए ताकि ./script.sh चले।' }
    ] },

    { type: 'quiz', store: 'swq-office', items: [
      { q: 'Excel में $A$1 किस प्रकार का संदर्भ है?', o: ['Relative', 'Absolute (पूरा स्थिर)', 'Mixed', 'External'], a: 1, ex: '$ कॉलम व पंक्ति दोनों बाँधता है — copy करने पर नहीं बदलता। A1 relative, $A1 या A$1 mixed।' },
      { q: 'Excel में =SUM(A1:A10) और =SUM(A1,A10) में अंतर?', o: ['कोई अंतर नहीं', 'पहला A1 से A10 तक सब जोड़ता है; दूसरा केवल दो सेल', 'दूसरा सब जोड़ता है', 'पहला त्रुटि देता है'], a: 1, ex: ': (colon) सीमा है, , (comma) अलग-अलग तर्क। यही अंतर परीक्षा में बार-बार पूछा जाता है।' },
      { q: 'VLOOKUP की चौथी तर्क FALSE का अर्थ?', o: ['approximate match', 'exact match अनिवार्य', 'उल्टा क्रम', 'case-sensitive'], a: 1, ex: 'FALSE/0 = ठीक-ठीक मिलान; TRUE/1 = approximate (पहला कॉलम sorted होना चाहिए)। गलत TRUE चुनने से चुपचाप गलत मान आता है।' },
      { q: 'Excel में #DIV/0! कब आता है?', o: ['गलत नाम', 'शून्य या खाली सेल से भाग देने पर', 'बहुत बड़ा मान', 'text जोड़ने पर'], a: 1, ex: 'शून्य या खाली सेल से भाग देने पर। बचाव — IFERROR(सूत्र, 0) या IF(B1<>0, A1/B1, "")। #VALUE! = गलत प्रकार, #REF! = मिटा हुआ संदर्भ, #NAME? = अज्ञात नाम।' },
      { q: 'Word में Styles के उपयोग का सबसे बड़ा लाभ?', o: ['रंग बदलना', 'एक जगह बदलकर पूरे दस्तावेज़ का रूप व स्वचालित विषय-सूची', 'फ़ाइल छोटी होना', 'spell-check बंद'], a: 1, ex: 'Heading 1/2/3 पर आधारित Navigation, TOC, outline व accessibility सब styles से चलते हैं। सीधे formatting करने से ये टूटते हैं।' },
      { q: 'PowerPoint में Slide Master किसलिए?', o: ['एक slide सजाना', 'पूरी प्रस्तुति का साझा लेआउट/फ़ॉन्ट/लोगो एक जगह तय करना', 'animation', 'वीडियो जोड़ना'], a: 1, ex: 'Master बदलते ही सब slides पर असर। इसी से एक जैसा शीर्षक, फ़ुटर, पृष्ठ-संख्या व लोगो मिलता है।' },
      { q: 'Excel में PivotTable क्या करता है?', o: ['तस्वीर जोड़ता है', 'बड़े डेटा का सारांश — समूह, गिनती, योग, औसत', 'फ़ाइल encrypt', 'chart मिटाता है'], a: 1, ex: 'Rows/Columns/Values/Filters में खींचकर हज़ारों पंक्तियों का सार seconds में। मूल डेटा नहीं बदलता; Refresh से अद्यतन।' },
      { q: 'Mail Merge के दो अनिवार्य घटक?', o: ['दो प्रिंटर', 'मुख्य दस्तावेज़ (template) + डेटा स्रोत (सूची)', 'दो फ़ॉन्ट', 'macro व पासवर्ड'], a: 1, ex: 'Word का template जिसमें merge fields हों, और Excel/Access/CSV की प्राप्तकर्ता-सूची। Preview Results से जाँचकर Finish & Merge करें।' },
      { q: 'PowerPoint में "Presenter View" क्या दिखाता है?', o: ['केवल slide', 'वक्ता को अगली slide, नोट्स व समय; श्रोताओं को केवल slide', 'सबको नोट्स', 'केवल नोट्स'], a: 1, ex: 'दो screen हों तो एक पर slide, दूसरे पर नोट्स + अगली slide + घड़ी। यही प्रस्तुति का सही तरीका है।' },
      { q: 'Outlook में PST और OST में अंतर?', o: ['दोनों एक ही', 'PST = स्थानीय संग्रह/निर्यात; OST = Exchange/M365 mailbox की offline cache', 'OST निर्यात के लिए', 'PST केवल server पर'], a: 1, ex: 'OST खाते से बँधा होता है और सीधे दूसरे प्रोफ़ाइल में नहीं खुलता; निर्यात/backup के लिए PST बनाया जाता है।' }
    ] },

    { type: 'quiz', store: 'swq-net', items: [
      { q: 'OSI मॉडल में कितनी परतें हैं और router किस पर काम करता है?', o: ['5, परत 2', '7, परत 3 (Network)', '4, परत 4', '7, परत 2'], a: 1, ex: 'OSI की 7 परतें — Physical, Data Link, Network, Transport, Session, Presentation, Application। Router परत 3 (IP), switch परत 2 (MAC), hub परत 1।' },
      { q: 'TCP और UDP में मुख्य अंतर?', o: ['UDP भरोसेमंद है', 'TCP connection-based व भरोसेमंद (क्रम/पुनःप्रेषण); UDP connectionless व तेज़', 'दोनों एक ही', 'TCP केवल LAN के लिए'], a: 1, ex: 'TCP में three-way handshake, acknowledgement, पुनःप्रेषण — वेब/ईमेल/फ़ाइल। UDP में नहीं — live video, DNS, gaming, VoIP।' },
      { q: 'DNS का काम क्या है?', o: ['फ़ाइल भेजना', 'नाम को IP पते में बदलना', 'डेटा encrypt करना', 'packet route करना'], a: 1, ex: 'DNS = इंटरनेट की फ़ोन-बुक। A रिकॉर्ड नाम→IPv4, AAAA→IPv6, CNAME→उपनाम, MX→डाक, TXT→नीति/सत्यापन।' },
      { q: 'HTTP और HTTPS में अंतर?', o: ['HTTPS तेज़ है', 'HTTPS = HTTP + TLS encryption व certificate-सत्यापन', 'HTTP नया है', 'HTTPS केवल डाक के लिए'], a: 1, ex: 'HTTPS रास्ता encrypt करता है और certificate से नाम सत्यापित करता है। ताला दिखने का अर्थ यह नहीं कि साइट ईमानदार है।' },
      { q: '192.168.1.10 किस प्रकार का पता है?', o: ['Public', 'Private (Class C सीमा)', 'Loopback', 'Multicast'], a: 1, ex: 'निजी सीमाएँ — 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16। 127.0.0.1 loopback। NAT इन्हें सार्वजनिक IP में बदलता है।' },
      { q: 'Subnet mask 255.255.255.0 (/24) में कितने usable host?', o: ['256', '254', '255', '128'], a: 1, ex: '8 host bit = 2^8 = 256 पते, जिनमें network व broadcast पते घटाकर 254 उपयोगी। /25 = 126, /26 = 62।' },
      { q: 'DHCP क्या करता है?', o: ['नाम से IP खोजना', 'उपकरण को स्वतः IP, mask, gateway, DNS देना', 'फ़ाइल साझा करना', 'डेटा encrypt'], a: 1, ex: 'DHCP Discover→Offer→Request→Ack (DORA)। पट्टा (lease) समाप्त होने पर नवीनीकरण। APIPA 169.254.x.x = DHCP असफल।' },
      { q: 'ping किस प्रोटोकॉल पर चलता है?', o: ['TCP', 'UDP', 'ICMP', 'HTTP'], a: 2, ex: 'ping ICMP Echo Request/Reply भेजता है। traceroute भी ICMP/UDP का उपयोग करके हर hop का TTL-आधारित पता लगाता है।' },
      { q: 'URL में https:// के बाद भागों का सही क्रम?', o: ['path → domain → protocol', 'protocol → domain (host) → port → path → query → fragment', 'domain → protocol → path', 'fragment → query → path'], a: 1, ex: 'जैसे https://site.com:443/path/page?x=1#top — scheme, host, port, path, query, fragment।' },
      { q: 'Bandwidth और latency में अंतर?', o: ['दोनों एक ही', 'Bandwidth = प्रति सेकंड कितना डेटा; latency = पहुँचने में कितना समय', 'latency मात्रा है', 'bandwidth समय है'], a: 1, ex: 'Bandwidth सड़क की चौड़ाई है, latency दूरी/विलंब। बड़ी bandwidth से latency नहीं घटती — satellite इसका उदाहरण है।' }
    ] },

    { type: 'quiz', store: 'swq-sec', items: [
      { q: 'Phishing क्या है?', o: ['वायरस का प्रकार', 'भरोसेमंद दिखने वाले नकली संदेश/साइट से गुप्त जानकारी ठगना', 'फ़ाइल compression', 'नेटवर्क जाँच'], a: 1, ex: 'प्रेषक का domain, urgency ("तुरंत करें"), अजीब लिंक और लिखने की चूक पहचानें। लिंक पर जाने के बजाय साइट स्वयं टाइप करके खोलें।' },
      { q: 'Ransomware का लक्षण?', o: ['मशीन तेज़ होना', 'फ़ाइलें encrypt करके फिरौती माँगना', 'केवल विज्ञापन दिखाना', 'पासवर्ड चुराना बिना बदलाव'], a: 1, ex: 'फ़ाइल-नाम/एक्सटेंशन बदल जाते हैं, फिरौती-नोट मिलता है। बचाव — offline/off-site बैकअप, अपडेट, कम-अधिकार खाता, संदिग्ध attachment न खोलना।' },
      { q: '2FA/MFA क्यों ज़रूरी है?', o: ['पासवर्ड याद रखने के लिए', 'पासवर्ड लीक होने पर भी दूसरा कारक खाता बचाता है', 'गति बढ़ाने', 'फ़ाइल छोटी करने'], a: 1, ex: 'कुछ आप जानते हैं (पासवर्ड) + कुछ आपके पास है (फ़ोन/कुंजी) + कुछ आप हैं (biometric)। SMS से बेहतर authenticator ऐप या security key है।' },
      { q: 'सबसे मज़बूत पासवर्ड-नीति कौन-सी?', o: ['एक ही पासवर्ड सब जगह', 'हर खाते का अलग लंबा यादृच्छिक पासवर्ड + पासवर्ड मैनेजर + MFA', 'नाम और जन्मतिथि', 'छोटा आसान पासवर्ड'], a: 1, ex: 'पुनःप्रयोग से credential stuffing होता है — एक लीक, सब खुले। मैनेजर से याद रखने का बोझ हटता है।' },
      { q: 'सार्वजनिक Wi-Fi पर सबसे सुरक्षित व्यवहार?', o: ['बैंकिंग कर लेना', 'संवेदनशील काम टालें; HTTPS जाँचें; ज़रूरत हो तो भरोसेमंद VPN', 'फ़ाइल साझा चालू करें', 'पासवर्ड सहेजें'], a: 1, ex: 'खुला Wi-Fi छेड़छाड़ व नकली hotspot का जोखिम रखता है। नेटवर्क "Private" नहीं "Public" चुनें ताकि discovery बंद रहे।' },
      { q: 'Social engineering किस पर हमला करता है?', o: ['firewall पर', 'मनुष्य के भरोसे व जल्दबाज़ी पर', 'केवल software bug', 'RAM पर'], a: 1, ex: 'तकनीक नहीं, मनोविज्ञान। "मैं IT से हूँ, पासवर्ड बताइए" — कोई वैध संस्था फ़ोन पर पासवर्ड/OTP नहीं माँगती।' },
      { q: 'Firewall क्या करता है?', o: ['वायरस मिटाता है', 'नीति के अनुसार आने-जाने वाले network traffic को अनुमति देता/रोकता है', 'डेटा encrypt', 'डिस्क साफ़'], a: 1, ex: 'packet के स्रोत/लक्ष्य, port व प्रोटोकॉल पर नियम लगाता है। Antivirus सामग्री जाँचता है — दोनों अलग परतें हैं, दोनों चाहिए।' },
      { q: 'Encryption और hashing में अंतर?', o: ['दोनों एक ही', 'Encryption कुंजी से वापस पढ़ा जा सकता है; hashing एक-तरफ़ा है', 'hashing वापस पढ़ा जा सकता है', 'encryption केवल पासवर्ड के लिए'], a: 1, ex: 'पासवर्ड hash करके (salt के साथ) रखे जाते हैं, encrypt नहीं। डेटा भेजने/सहेजने के लिए encryption — TLS, AES, BitLocker।' },
      { q: 'संदिग्ध email attachment मिले तो पहला कदम?', o: ['तुरंत खोलें', 'प्रेषक व domain जाँचें; अपेक्षित न हो तो खोलें ही नहीं; संस्था को बताएँ', 'सबको forward करें', 'macro चालू करें'], a: 1, ex: '.exe/.js/.lnk/.scr तथा macro-युक्त Office फ़ाइलें विशेष जोखिम। सत्यापन के लिए प्रेषक को अलग माध्यम से पूछें।' },
      { q: 'डिस्क बेचने/फेंकने से पहले डेटा का क्या करें?', o: ['Delete कर दें', 'Format भी काफी नहीं — secure erase / cryptographic erase या भौतिक नष्ट करें', 'कुछ नहीं', 'केवल recycle bin खाली'], a: 1, ex: 'साधारण delete/format से डेटा recover हो जाता है। SSD के लिए निर्माता का secure erase या PSID revert; HDD के लिए overwrite/भौतिक विनाश।' }
    ] },

    { type: 'quiz', store: 'swq-util', items: [
      { q: 'Freeware और open source में मुख्य अंतर?', o: ['कीमत', 'स्रोत कोड की उपलब्धता व बदलने-बाँटने की अनुमति', 'गति', 'आकार'], a: 1, ex: 'Freeware मुफ़्त हो सकता है पर स्रोत बंद। Open source में स्रोत खुला और लाइसेंस-शर्तों के साथ बदल-बाँट सकते हैं।' },
      { q: 'GPL और MIT लाइसेंस में अंतर?', o: ['कोई अंतर नहीं', 'GPL copyleft — व्युत्पन्न काम भी उसी लाइसेंस में; MIT permissive', 'MIT स्रोत छिपाता है', 'GPL मुफ़्त नहीं'], a: 1, ex: 'GPL (Linux kernel, GIMP) में बदला संस्करण बाँटें तो स्रोत भी उसी GPL में देना होगा। MIT/BSD/Apache में इतनी बाध्यता नहीं।' },
      { q: 'Lossless compression का उदाहरण?', o: ['JPEG', 'MP3', 'PNG', 'H.264'], a: 2, ex: 'PNG/ZIP/FLAC/GIF lossless — मूल डेटा वैसा ही वापस। JPEG/MP3/H.264 lossy — सूचना फेंकी जाती है।' },
      { q: 'ZIP बनाम 7Z — कब क्या?', o: ['हमेशा ZIP', 'बाँटने के लिए ZIP (सर्वत्र समर्थित); संग्रह/encryption के लिए 7Z (LZMA2 + AES-256)', 'हमेशा 7Z', 'दोनों एक ही'], a: 1, ex: 'ZIP हर OS बिना औज़ार खोलता है। 7Z छोटा बनाता है और -mhe=on से फ़ाइल-नाम भी encrypt करता है।' },
      { q: 'codec और container में अंतर?', o: ['दोनों एक ही', 'container डिब्बा (.mp4/.mkv); codec अंदर की संपीड़न-विधि (H.264/AAC)', 'codec डिब्बा है', 'container केवल ऑडियो'], a: 1, ex: 'इसीलिए एक MKV VLC में चलता है पर पुराने TV में नहीं — डिब्बा ठीक, अंदर का codec वह नहीं जानता।' },
      { q: '3-2-1 बैकअप नियम क्या कहता है?', o: ['3 डिस्क एक मशीन में', '3 प्रतियाँ, 2 अलग माध्यम, 1 off-site', '1 प्रति काफी', '2 पासवर्ड'], a: 1, ex: 'विस्तार 3-2-1-1-0 — एक अपरिवर्तनीय/air-gapped प्रति और सत्यापन में शून्य त्रुटि। RAID व sync बैकअप नहीं हैं।' },
      { q: 'winget upgrade --all क्या करता है?', o: ['सब uninstall', 'सभी ज्ञात पैकेज नवीनतम संस्करण पर ले जाना', 'केवल सूची', 'Windows अपडेट'], a: 1, ex: 'winget Windows का पैकेज मैनेजर है — search/show/install/upgrade/uninstall/export/import। Linux में apt/dnf/pacman/flatpak।' },
      { q: 'Type-1 और Type-2 hypervisor में अंतर?', o: ['दोनों एक ही', 'Type-1 सीधे हार्डवेयर पर (ESXi/Proxmox); Type-2 मेज़बान OS के ऊपर (VirtualBox)', 'Type-2 हार्डवेयर पर', 'Type-1 केवल Windows'], a: 1, ex: 'Type-1 bare-metal अधिक कुशल; Type-2 लैब/प्रयोग के लिए सरल। दोनों VM चलाते हैं, container अलग चीज़ है।' },
      { q: 'SSH और RDP के डिफ़ॉल्ट port?', o: ['21 और 23', '22 और 3389', '80 और 443', '25 और 110'], a: 1, ex: 'SSH=22 (command-line), RDP=3389 (Windows GUI), VNC=5900+, WinRM=5985/5986, HTTP=80, HTTPS=443।' },
      { q: 'SSD पर defragmentation क्यों नहीं?', o: ['तेज़ है इसलिए', 'लाभ शून्य पर write-घिसावट बढ़ती; वहाँ TRIM/Optimize सही है', 'Windows मना करता है', 'SSD में फ़ाइलें बिखरती नहीं'], a: 1, ex: 'SSD में seek time नहीं होता, इसलिए defrag का कोई लाभ नहीं। वह केवल write-सीमा (TBW) घटाता है। TRIM खाली ब्लॉक बताकर गति बनाए रखता है।' }
    ] },

    { type: 'quiz', store: 'swq-prog', items: [
      { q: 'Compiler और interpreter में अंतर?', o: ['दोनों एक ही', 'Compiler पूरा स्रोत एक साथ मशीन-कोड में; interpreter पंक्ति-दर-पंक्ति चलाता है', 'interpreter तेज़ binary बनाता है', 'compiler केवल Python'], a: 1, ex: 'C/C++/Rust compile होकर स्वतंत्र binary बनाते हैं। Python/JS प्रायः interpreted (या bytecode + VM)। Java/C# दो-चरणीय — bytecode फिर VM।' },
      { q: 'Variable और constant में अंतर?', o: ['कोई अंतर', 'variable का मान बदल सकता है; constant स्थिर', 'constant बड़ा होता है', 'variable केवल संख्या'], a: 1, ex: 'नामकरण से ही कोड पढ़ने योग्य बनता है। स्थिर मानों को constant बनाने से गलती से बदलने का जोखिम घटता है।' },
      { q: 'Loop का कौन-सा रूप कम-से-कम एक बार अवश्य चलता है?', o: ['for', 'while', 'do-while', 'if'], a: 2, ex: 'do-while में शर्त अंत में जाँची जाती है, इसलिए पहला चक्कर बिना शर्त चलता है। while/for में शर्त पहले जाँची जाती है।' },
      { q: 'Array और list में व्यावहारिक अंतर?', o: ['दोनों हमेशा एक ही', 'array प्रायः निश्चित आकार व एक प्रकार; list गतिशील आकार (भाषा-निर्भर)', 'list केवल संख्या', 'array गतिशील'], a: 1, ex: 'C में array निश्चित आकार का है; Python की list गतिशील है। अवधारणा — index से पहुँच, 0 से गिनती शुरू।' },
      { q: 'Function का मुख्य लाभ?', o: ['कोड लंबा होना', 'पुनःप्रयोग, विभाजन व एक जगह सुधार', 'गति हमेशा बढ़ना', 'memory हमेशा घटना'], a: 1, ex: 'एक काम एक नाम में बाँधने से कोड पढ़ने योग्य, परखने योग्य और दोबारा उपयोग करने योग्य बनता है।' },
      { q: 'OOP में class और object?', o: ['दोनों एक ही', 'class नक्शा/खाका; object उसका वास्तविक उदाहरण', 'object खाका है', 'class केवल फ़ाइल'], a: 1, ex: 'class Student परिभाषित करती है; ravi = Student() एक object है। चार स्तंभ — encapsulation, abstraction, inheritance, polymorphism।' },
      { q: 'Syntax error और logical error में अंतर?', o: ['दोनों एक ही', 'syntax = भाषा-नियम टूटे, चलने से पहले पकड़; logical = चले पर गलत परिणाम', 'logical पहले पकड़ में आता है', 'syntax केवल runtime'], a: 1, ex: 'logical error सबसे खतरनाक है क्योंकि प्रोग्राम चलता रहता है। उसे परीक्षण (test) व अपेक्षित परिणाम से तुलना करके पकड़ते हैं।' },
      { q: 'द्विआधारी 1011 का दशमलव मान?', o: ['9', '11', '13', '15'], a: 1, ex: '1×8 + 0×4 + 1×2 + 1×1 = 11। स्थान-मान दाएँ से 1, 2, 4, 8, 16… बढ़ते हैं।' },
      { q: 'हेक्साडेसिमल FF का दशमलव मान?', o: ['15', '16', '255', '256'], a: 2, ex: 'F=15; 15×16 + 15 = 255। एक hex अंक = 4 bit, इसलिए दो hex अंक = एक byte (00–FF)।' },
      { q: 'Git में commit और push में अंतर?', o: ['दोनों एक ही', 'commit स्थानीय इतिहास में सहेजना; push दूरस्थ repository पर भेजना', 'push स्थानीय', 'commit दूरस्थ'], a: 1, ex: 'commit से आपका काम स्थानीय इतिहास में सुरक्षित; push से वह साझा/दूरस्थ होता है। बीच में branch, merge, pull भी आते हैं।' }
    ] },

    { type: 'quiz', store: 'swq-ai', items: [
      { q: 'IaaS, PaaS, SaaS में आप किसमें केवल ऐप-कोड सँभालते हैं?', o: ['IaaS', 'PaaS', 'SaaS', 'तीनों में'], a: 1, ex: 'PaaS में OS/runtime प्रदाता का; आप कोड व डेटा। IaaS में OS से ऊपर सब आपका; SaaS में केवल उपयोग व अपना डेटा।' },
      { q: 'क्लाउड की कौन-सी विशेषता "माँग के अनुसार तुरंत बढ़ना-घटना" है?', o: ['Resource pooling', 'Rapid elasticity', 'Measured service', 'Broad network access'], a: 1, ex: 'पाँच NIST विशेषताएँ — on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service।' },
      { q: 'AI, ML, DL का सही संबंध?', o: ['तीन असंबंधित', 'AI ⊃ ML ⊃ DL; GenAI DL का एक रूप', 'DL ⊃ ML ⊃ AI', 'ML ⊃ AI'], a: 1, ex: 'एक के भीतर एक घेरे। हर DL, ML है; हर ML, AI है — पर उल्टा नहीं।' },
      { q: 'बिना लेबल वाले डेटा में छिपे समूह खोजना कौन-सा learning है?', o: ['Supervised', 'Unsupervised', 'Reinforcement', 'Transfer'], a: 1, ex: 'Unsupervised — K-Means, clustering, PCA। लेबल के साथ = supervised; पुरस्कार/दंड = reinforcement।' },
      { q: 'LLM में hallucination क्या है?', o: ['धीमा उत्तर', 'विश्वासपूर्वक गढ़ा हुआ गलत तथ्य/उद्धरण', 'उत्तर न देना', 'भाषा बदलना'], a: 1, ex: 'मूल काम अगला संभावित token चुनना है, तथ्य-lookup नहीं। हर महत्वपूर्ण तथ्य मूल स्रोत से मिलाएँ।' },
      { q: 'RAG का लाभ?', o: ['मॉडल बड़ा होना', 'अपने दस्तावेज़ खोजकर संदर्भ में देना — शुद्धता बढ़े, hallucination घटे', 'तस्वीर बनाना', 'बिल घटाना'], a: 1, ex: 'Retrieval-Augmented Generation में प्रशिक्षण नहीं बदलता; उत्तर के समय सही संदर्भ जोड़ा जाता है।' },
      { q: 'तथ्यात्मक कार्य के लिए temperature?', o: ['बहुत अधिक', 'कम (0–0.3)', 'हमेशा 1', 'कोई फ़र्क़ नहीं'], a: 1, ex: 'कम = निश्चित व दोहराव वाला; अधिक = रचनात्मक पर जोखिम भरा। यह बुद्धिमत्ता नहीं, यादृच्छिकता नियंत्रित करता है।' },
      { q: 'IoT की चार परतों का क्रम?', o: ['Application→Network→Perception→Edge', 'Perception→Network→Middleware/Edge→Application', 'Network→Perception→Application→Edge', 'Edge→Application→Network→Perception'], a: 1, ex: 'sensor से शुरुआत, संचार, फिर छानना/स्थानीय निर्णय, अंत में dashboard/अनुप्रयोग।' },
      { q: 'AR और VR में अंतर?', o: ['VR में असली दिखता रहे', 'AR = असली दृश्य + डिजिटल परत; VR = पूरी आभासी दुनिया', 'दोनों एक ही', 'AR केवल ऑडियो'], a: 1, ex: 'MR में आभासी वस्तु असली से क्रिया करती है; XR इन सबका छाता-शब्द।' },
      { q: 'Serverless का सही अर्थ?', o: ['server नहीं है', 'server प्रदाता सँभालता है; आप function लिखते हैं, प्रति invocation बिल', 'मुफ़्त hosting', 'केवल static फ़ाइल'], a: 1, ex: 'AWS Lambda, Azure Functions, Netlify Functions, Cloudflare Workers। सीमाएँ — cold start, अवधि-सीमा, state रखना कठिन।' }
    ] },

    { type: 'quiz', store: 'swq-misc', items: [
      { q: '1 KiB (kibibyte) कितने byte है?', o: ['1000', '1024', '1024×1024', '8'], a: 1, ex: 'KiB/MiB/GiB = 1024 के गुणज (द्विआधारी); KB/MB/GB = 1000 के गुणज (दशमलव, SI)। डिस्क विक्रेता 1000 से, OS प्रायः 1024 से गिनता है — इसीलिए आकार "कम" दिखता है।' },
      { q: '1 byte कितने bit का होता है और एक nibble?', o: ['4 और 8', '8 और 4', '16 और 8', '8 और 16'], a: 1, ex: '1 byte = 8 bit; 1 nibble = 4 bit = एक hex अंक। 1 KB = 1024 byte (पारंपरिक) या 1000 byte (SI)।' },
      { q: 'ASCII और Unicode में अंतर?', o: ['दोनों एक ही', 'ASCII मुख्यतः अंग्रेज़ी/128–256 वर्ण; Unicode लगभग हर लिपि के लाखों code point', 'Unicode केवल अंग्रेज़ी', 'ASCII बड़ा है'], a: 1, ex: 'UTF-8 Unicode का परिवर्तनीय-लंबाई encoding है — ASCII के लिए 1 byte, हिंदी के लिए प्रायः 3 byte। इसी से एक फ़ाइल में कई भाषाएँ चलती हैं।' },
      { q: 'HTTP स्थिति-कोड 404 और 500 का अर्थ?', o: ['404 server त्रुटि, 500 client', '404 = संसाधन नहीं मिला (client); 500 = server की आंतरिक त्रुटि', 'दोनों सफल', '404 redirect'], a: 1, ex: '2xx सफल, 3xx redirect, 4xx client-पक्ष (400 bad request, 401 unauthorized, 403 forbidden, 404 not found), 5xx server-पक्ष (500, 502, 503)।' },
      { q: 'IP पता और MAC पते में अंतर?', o: ['दोनों एक ही', 'IP तार्किक/बदलने योग्य, network-स्तर; MAC भौतिक, NIC में जड़ा, link-स्तर', 'MAC बदलता रहता है', 'IP hardware में जड़ा'], a: 1, ex: 'MAC 48-bit (जैसे A1:B2:C3:D4:E5:F6), IP 32-bit (IPv4) या 128-bit (IPv6)। ARP इन्हें जोड़ता है।' },
      { q: 'IPv4 और IPv6 की लंबाई?', o: ['32 और 64 bit', '32 और 128 bit', '64 और 128 bit', '128 और 256 bit'], a: 1, ex: 'IPv4 = 32 bit (~4.3 अरब पते, चार दशमलव खंड)। IPv6 = 128 bit (आठ hex समूह, :: से संकुचन) — पते की कमी समाप्त।' },
      { q: 'BIOS/UEFI का POST क्या करता है?', o: ['OS लोड करता है', 'चालू होते ही हार्डवेयर की प्रारंभिक जाँच', 'फ़ाइलें मिटाता है', 'ड्राइवर अपडेट'], a: 1, ex: 'Power-On Self-Test — RAM, CPU, storage, keyboard आदि की जाँच; beep/code से त्रुटि बताता है। फिर bootloader को नियंत्रण देता है।' },
      { q: 'Algorithm और flowchart में अंतर?', o: ['दोनों एक ही', 'Algorithm चरणों का लिखा क्रम; flowchart उसका चित्र-रूप', 'flowchart केवल कोड', 'algorithm चित्र है'], a: 1, ex: 'flowchart के मानक चिह्न — अंडाकार (आरंभ/अंत), आयत (प्रक्रिया), समलंब/समांतर चतुर्भुज (input/output), हीरा (निर्णय), तीर (प्रवाह)।' },
      { q: 'खुले स्रोत सॉफ़्टवेयर का उदाहरण कौन-सा है?', o: ['MS Word', 'Adobe Photoshop', 'LibreOffice', 'Windows 11'], a: 2, ex: 'LibreOffice, GIMP, VLC, 7-Zip, Firefox, Linux kernel, Audacity, Inkscape — सब खुले स्रोत। Word/Photoshop/Windows proprietary हैं।' },
      { q: 'किसी फ़ाइल का SHA-256 hash किसलिए मिलाते हैं?', o: ['आकार घटाने', 'अखंडता जाँचने — डाउनलोड में बदलाव/छेड़छाड़ तो नहीं हुई', 'फ़ाइल खोलने', 'पासवर्ड बनाने'], a: 1, ex: 'एक bit भी बदले तो hash पूरी तरह बदल जाता है। आधिकारिक साइट का मान अपनी फ़ाइल से मिलाएँ — certutil -hashfile या Get-FileHash या sha256sum।' }
    ] },

    { type: 'table',
      head: ['गलती का प्रकार', 'पहचान कैसे', 'उपचार', 'दोबारा न हो, इसके लिए'],
      rows: [
        ['इकाई की चूक', 'bit/byte, KB/KiB, Mbps/MBps, GHz/GB उलझे', 'इकाई-तालिका एक कार्ड पर लिखें; हर प्रश्न में इकाई गोलाई लगाएँ', 'उत्तर लिखने से पहले इकाई अलग से बोलें'],
        ['शब्दावली की चूक', 'process/thread, codec/container, sync/backup जैसे जोड़े उलझे', 'शब्दकोश पेज के "उलझन-जोड़े" भाग को पढ़ें; हर जोड़े का एक उदाहरण स्वयं बनाएँ', 'जोड़े को एक वाक्य में अंतर बताकर लिखें'],
        ['संख्या/मान रटना', 'port, chmod अंक, runlevel, OSI परत गलत', 'सूची को कहानी/तरकीब से जोड़ें (जैसे 7=rwx, 5=r-x)', 'रोज़ एक बार बिना देखे बोलकर दोहराएँ'],
        ['अवधारणागत चूक', 'परिभाषा तो याद पर "क्यों" का उत्तर नहीं', 'संबंधित पेज का उदाहरण व diagram पढ़ें; स्वयं समझाएँ', 'किसी और को पढ़ाकर देखें — समझाने से पक्का होता है'],
        ['जल्दबाज़ी में पढ़ना', 'प्रश्न का "नहीं/सही/गलत" शब्द छूट गया', 'प्रश्न दो बार पढ़ें; नकारात्मक शब्दों को रेखांकित करें', 'विकल्प चुनने से पहले प्रश्न का मुख्य शब्द मन में दोहराएँ'],
        ['अनुमान लगाना', 'दो विकल्प में से बिना कारण चुना', 'जो नहीं पता, उसे ईमानदारी से चिह्नित करें और पेज खोलें', 'गलत प्रश्न की सूची बनाएँ — वही आपका असली पाठ्यक्रम है'],
        ['पुराना ज्ञान', 'नए संस्करण/नाम से मेल नहीं (जैसे विंडोज़ के बदले मेनू)', 'पेज का अद्यतन भाग पढ़ें; संस्करण-अंतर तालिका देखें', 'जहाँ नाम बदला है, वहाँ पुराना→नया जोड़कर लिखें'],
        ['कमांड न चलाकर याद करना', 'कमांड का फ़्लैग/क्रम गलत', 'टर्मिनल खोलकर वही कमांड चलाएँ; --help पढ़ें', 'जो कमांड चलाकर देखी, वह प्रश्न फिर गलत नहीं होगा']
      ] },

    { type: 'table',
      head: ['प्रश्न-स्तर', 'क्या माँगता है', 'उदाहरण क्रिया', 'तैयारी कैसे'],
      rows: [
        ['स्मरण (Remember)', 'तथ्य/नाम/मान याद रखना', 'बताओ, सूचीबद्ध करो, कितना', 'कार्ड व सूची-दोहरावृत्ति'],
        ['समझ (Understand)', 'अपने शब्दों में अर्थ', 'समझाओ, अंतर बताओ, वर्गीकृत करो', 'परिभाषा + एक उदाहरण स्वयं लिखें'],
        ['प्रयोग (Apply)', 'दिए स्थिति में उपयोग', 'हल करो, चलाओ, लागू करो', 'कमांड/सूत्र वास्तव में चलाकर देखें'],
        ['विश्लेषण (Analyse)', 'कारण व भाग अलग करना', 'क्यों असफल, कौन-सा भाग दोषी', 'दोष-निदान तालिकाएँ पढ़ें व स्वयं बनाएँ'],
        ['मूल्यांकन (Evaluate)', 'तुलना करके निर्णय', 'कौन-सा बेहतर, क्या चुनें', 'तुलना-तालिका के आधार पर तर्क लिखें'],
        ['निर्माण (Create)', 'नया समाधान बनाना', 'डिज़ाइन करो, script लिखो, योजना बनाओ', 'लैब-कार्य पूरे करें व प्रतिवेदन लिखें']
      ] },

    { type: 'acc', title: 'बार-बार उलझने वाले जोड़े — एक पंक्ति का अंतर',
      items: [
        { q: 'RAM बनाम ROM', a: 'RAM अस्थायी (volatile) — चलते प्रोग्राम का कार्य-क्षेत्र, बिजली गई तो खाली। ROM स्थायी (non-volatile) — firmware जैसा कोड जो बदला नहीं जाता या कठिनता से बदला जाता है।' },
        { q: 'Cache बनाम Buffer', a: 'Cache बार-बार चाहिए वही डेटा पास रखता है ताकि दोबारा न लाना पड़े (गति)। Buffer दो भिन्न गति वाले भागों के बीच अस्थायी ठहराव है ताकि प्रवाह न टूटे (जैसे प्रिंटर spool, वीडियो buffering)।' },
        { q: 'Process बनाम Thread', a: 'Process स्वतंत्र memory-space वाला चलता प्रोग्राम है। Thread उसी process के भीतर की हल्की इकाई है जो उसकी memory साझा करती है। एक process में कई thread हो सकते हैं।' },
        { q: 'Compiler बनाम Interpreter', a: 'Compiler पूरे स्रोत को एक साथ मशीन-कोड में बदलकर स्वतंत्र binary देता है। Interpreter पंक्ति-दर-पंक्ति पढ़कर तुरंत चलाता है; अलग binary नहीं बनता। Java/C# बीच का रास्ता — bytecode फिर VM।' },
        { q: 'Bandwidth बनाम Latency', a: 'Bandwidth = प्रति सेकंड कितना डेटा जा सकता है (सड़क की चौड़ाई)। Latency = भेजने से पहुँचने में कितना समय (दूरी/विलंब)। चौड़ी सड़क से दूरी कम नहीं होती।' },
        { q: 'TCP बनाम UDP', a: 'TCP connection-based, भरोसेमंद — क्रम, acknowledgement, पुनःप्रेषण (वेब, ईमेल, फ़ाइल)। UDP connectionless, हल्का व तेज़ पर डिलीवरी की गारंटी नहीं (live video, DNS, gaming, VoIP)।' },
        { q: 'Encryption बनाम Hashing', a: 'Encryption द्वि-तरफ़ा है — कुंजी से मूल वापस पढ़ा जा सकता है (डेटा भेजना/सहेजना)। Hashing एक-तरफ़ा है — वापस नहीं पढ़ा जा सकता (पासवर्ड सहेजना, अखंडता जाँचना)।' },
        { q: 'Authentication बनाम Authorization', a: 'Authentication = आप कौन हैं यह सिद्ध करना (login)। Authorization = आपको क्या करने की अनुमति है यह तय करना (पढ़ना/लिखना/admin)। पहले पहचान, फिर अधिकार।' },
        { q: 'Sync बनाम Backup', a: 'Sync हर जगह वही नवीनतम प्रति रखता है — गलती भी हर जगह पहुँचती है। Backup समय में पीछे जा सकने वाली अलग प्रति है — अपरिवर्तनीय, संस्करण-सहित, अलग माध्यम पर।' },
        { q: 'Codec बनाम Container', a: 'Container डिब्बा है (.mp4/.mkv/.avi) जो video+audio+subtitle pack करता है। Codec अंदर की compression-विधि है (H.264/H.265/AAC/MP3)। फ़ाइल न चले तो प्रायः codec बेमेल होता है, container नहीं।' },
        { q: 'VM बनाम Container', a: 'VM पूरा अतिथि OS व अलग kernel चलाता है — भारी, मज़बूत अलगाव। Container मेज़बान का kernel साझा करके केवल ऐप+libraries pack करता है — हल्का, सेकंडों में शुरू, पर अलगाव कम।' },
        { q: 'AR बनाम VR', a: 'AR में असली दृश्य दिखता रहता है और उस पर डिजिटल परत जुड़ती है। VR में असली दुनिया पूरी तरह ढक जाती है — केवल आभासी वातावरण। MR में आभासी वस्तु असली से क्रिया करती है; XR छाता-शब्द।' },
        { q: 'Freeware बनाम Open Source', a: 'Freeware की कीमत शून्य है पर स्रोत कोड बंद हो सकता है और बदलने की अनुमति नहीं। Open source में स्रोत खुला है, पढ़-बदल-बाँट सकते हैं (लाइसेंस-शर्तों के साथ) — भले ही कोई बेचे भी।' },
        { q: 'Hub बनाम Switch बनाम Router', a: 'Hub परत 1 — सबको सब भेज देता है (टकराव)। Switch परत 2 — MAC देखकर सही port पर भेजता है। Router परत 3 — IP देखकर अलग network के बीच भेजता है।' }
      ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा-कक्ष में यह सौ प्रश्न कैसे काम आएँगे',
      html: 'ITI/NIMI की CBT में प्रश्न प्रायः <b>स्मरण + समझ + एक-कदम प्रयोग</b> स्तर के होते हैं — यही इस महा-क्विज़ का केंद्र है। कक्ष में तीन नियम — (1) <b>पहले आसान</b>: पूरा पेज एक बार स्कैन करके ज्ञात प्रश्न पहले करें, फिर कठिन पर लौटें। (2) <b>नकारात्मक शब्द रेखांकित</b>: "नहीं", "सही नहीं", "except" वाले प्रश्न सबसे अधिक चूकते हैं। (3) <b>इकाई जाँचें</b>: bit/byte, KB/KiB, Mbps/MBps का अंतर एक अंक का होता है। और अंत में — जो प्रश्न नहीं आता, उसमें <b>सबसे असंगत विकल्प पहले हटाएँ</b>; दो बचे विकल्पों में वह चुनें जो परिभाषा से मेल खाता हो, न कि जो "सुनने में अच्छा" लगे।' },

    { type: 'html', html: '<h3>2.12 दोबारा प्रयास की नीति — अंक नहीं, सुधार मापो</h3><p>हर सेट की प्रगति इस ब्राउज़र में अलग सहेजी जाती है। दोबारा प्रयास करने पर उसी सेट का पुराना score बदल जाता है, बाकी सेट अछूते रहते हैं। इसलिए <b>सुधार-दर</b> नापने के लिए पहले प्रयास के अंक कागज़ पर लिख लें। लक्ष्य यह नहीं कि हर सेट में 10/10 आए; लक्ष्य यह है कि <b>एक ही गलती दोबारा न हो</b>। जिस प्रश्न में आपने कारण पढ़कर भी उत्तर नहीं समझा, वह अवधारणा अभी कच्ची है — उसका पेज खोलें, उदाहरण स्वयं चलाएँ, और अगले दिन फिर परखें। सात दिन में तीन पुनरावृत्ति (दिन 1, दिन 3, दिन 7) सबसे प्रभावी मानी जाती है।</p>' },

    { type: 'pills', items: [
      { text: '10 सेट · 100 प्रश्न · हर उत्तर का कारण', kind: 'info' },
      { text: 'एक बैठक में एक-दो सेट ही करें', kind: 'tip' },
      { text: 'अंक नहीं, गलती का पैटर्न देखें', kind: 'warn' },
      { text: 'दिन 1 → दिन 3 → दिन 7 पुनरावृत्ति', kind: 'ok' },
      { text: 'इकाई की चूक सबसे आम है — bit/byte, KB/KiB', kind: 'warn' },
      { text: 'कमांड वाला प्रश्न? टर्मिनल खोलकर चलाओ', kind: 'tip' },
      { text: '"नहीं / except" वाले प्रश्न दो बार पढ़ो', kind: 'danger' },
      { text: 'जो समझा नहीं सकते, वह अभी कच्चा है', kind: 'info' }
    ] }

  ]
},
]);

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
{
  id: 'sw-glossary',
  icon: '📖',
  group: 'सॉफ़्टवेयर प्रैक्टिकल',
  title: 'सॉफ़्टवेयर शब्दकोश — पूरे फ़ुल फ़ॉर्म',
  sub: 'हार्डवेयर · OS · नेटवर्क · सुरक्षा · फ़ाइल प्रारूप · Office · प्रोग्रामिंग · क्लाउड/AI · इकाई · port',
  kicker: 'Software Practical 3 · Complete Glossary & Full Forms',
  hero: 'यह पूरे कंप्यूटर-कोर्स का एक-जगह शब्दकोश है। हर छोटे-बड़े संक्षेप (acronym) का पूरा नाम (full form), उसका हिंदी अर्थ और एक पंक्ति में काम — दस बड़ी तालिकाओं में क्रमशः हार्डवेयर, सॉफ़्टवेयर व OS, नेटवर्क व इंटरनेट, साइबर सुरक्षा, फ़ाइल प्रारूप व एक्सटेंशन, MS Office व भारतीय डिजिटल सेवाएँ, प्रोग्रामिंग व डेटा, क्लाउड-AI-नई तकनीक, इकाई व माप, और well-known port संख्याएँ। साथ में वे शब्द जो एक जैसे दिखते हैं पर अलग हैं (WAF, SOC, APT, PAN, SLA, MR, BOM, AI), कठिन पारिभाषिक शब्दों के सरल अर्थ, याद रखने की तरकीबें, और बीस प्रश्नों का full-form क्विज़। परीक्षा में "पूरा नाम लिखिए" वाले प्रश्नों का यह एकमात्र पड़ाव है।',
  tags: ['10 श्रेणी-तालिकाएँ', 'पूरा नाम + हिंदी अर्थ', 'एक-जैसे दिखने वाले शब्द', 'इकाई व port', 'याद रखने की तरकीब', '20 प्रश्न क्विज़'],
  blocks: [

    { type: 'html', html: '<h3>3.1 इस शब्दकोश का उपयोग कैसे करें</h3><p>हर तालिका के चार स्तंभ हैं — <b>संक्षेप</b> (जैसा लिखा जाता है), <b>पूरा नाम</b> (full form, अंग्रेज़ी में), <b>हिंदी अर्थ</b>, और <b>काम</b> (एक पंक्ति)। परीक्षा में प्रायः केवल पूरा नाम पूछा जाता है, पर समझ के लिए काम जानना ज़रूरी है — तभी आप भूलने पर भी अनुमान से सही लिख सकते हैं। <b>नियम:</b> पूरा नाम लिखते समय हर शब्द का पहला अक्षर वही रखें जो संक्षेप में है। जैसे <code>SMTP</code> = <b>S</b>imple <b>M</b>ail <b>T</b>ransfer <b>P</b>rotocol — चार अक्षर, चार शब्द। जहाँ संक्षेप में अंक है (POP3, IPv4, MP3, WPA3), वह संस्करण-संख्या है, शब्द नहीं।</p>' },

    { type: 'callout', kind: 'tip', title: 'पूरा नाम याद रखने की पाँच तरकीबें',
      html: '(1) <b>अक्षर-गिनती मिलाओ</b> — जितने अक्षर, उतने शब्द। <code>HTML</code> = HyperText Markup Language (चार शब्द, HyperText एक शब्द माना जाता है)। (2) <b>परिवार से जोड़ो</b> — LAN/WAN/MAN/PAN/VLAN/WLAN सब "…Area Network"; बस पहला शब्द बदलता है। (3) <b>काम से नाम तक पहुँचो</b> — DHCP का काम है पता "बाँटना", तो Dynamic Host <i>Configuration</i> Protocol। (4) <b>जोड़े बनाओ</b> — TCP/UDP, HTTP/HTTPS, IMAP/POP3, SSD/HDD, encryption/hashing — एक-दूसरे के विरोध से याद रहते हैं। (5) <b>बोलकर लिखो</b> — पूरा नाम एक बार बोलकर, फिर बिना देखे कागज़ पर लिखो; जो अक्षर छूटा, वही आपकी कमज़ोरी है।' },

    { type: 'html', html: '<h3>3.2 हार्डवेयर, स्टोरेज व घटक</h3><p>प्रोसेसर से लेकर मदरबोर्ड, डिस्क, स्मृति और बिजली तक — वे सब संक्षेप जो असेंबली व सर्विसिंग में रोज़ मिलते हैं।</p>' },
    { type: 'table',
      head: ['संक्षेप', 'पूरा नाम (Full Form)', 'हिंदी अर्थ', 'काम'],
      rows: [
        ['CPU', 'Central Processing Unit', 'केंद्रीय प्रक्रमण इकाई', 'प्रोग्राम के निर्देश निष्पादित करना'],
        ['ALU', 'Arithmetic Logic Unit', 'अंकगणितीय तर्क इकाई', 'जोड़-घटाव व तर्क (AND/OR/NOT) की गणना'],
        ['CU', 'Control Unit', 'नियंत्रण इकाई', 'निर्देशों का प्रवाह व संकेत नियंत्रित करना'],
        ['RAM', 'Random Access Memory', 'यादृच्छिक पहुँच स्मृति', 'चलते प्रोग्राम का अस्थायी कार्य-क्षेत्र (volatile)'],
        ['ROM', 'Read Only Memory', 'केवल-पठन स्मृति', 'स्थायी कोड/firmware रखना (non-volatile)'],
        ['SRAM / DRAM', 'Static / Dynamic RAM', 'स्थिर / गतिशील RAM', 'SRAM तेज़ व महँगी (cache); DRAM सस्ती, बार-बार refresh चाहिए'],
        ['SDRAM', 'Synchronous Dynamic RAM', 'तुल्यकालिक गतिशील RAM', 'CPU घड़ी के ताल से चलने वाली DRAM'],
        ['DDR', 'Double Data Rate', 'द्विगुण डेटा दर', 'घड़ी के दोनों किनारों पर डेटा — DDR4, DDR5'],
        ['DIMM / SO-DIMM', 'Dual In-line Memory Module / Small Outline DIMM', 'स्मृति मॉड्यूल', 'डेस्कटॉप की लंबी पट्टी / लैपटॉप की छोटी पट्टी'],
        ['ECC', 'Error Correcting Code', 'त्रुटि-सुधार कोड', 'एक-bit त्रुटि स्वयं पकड़कर सुधारना (सर्वर/कार्यस्टेशन)'],
        ['GPU', 'Graphics Processing Unit', 'ग्राफ़िक्स प्रक्रमण इकाई', 'हज़ारों core से समानांतर rendering व ML गणना'],
        ['VRAM', 'Video RAM', 'वीडियो स्मृति', 'GPU की अपनी memory — texture, frame buffer'],
        ['NPU / TPU', 'Neural / Tensor Processing Unit', 'तंत्रिका / टेन्सर प्रक्रमण इकाई', 'AI inference के विशेष चिप'],
        ['SSD', 'Solid State Drive', 'ठोस-अवस्था चालक', 'NAND flash पर भंडारण — कोई घूमने वाला भाग नहीं'],
        ['HDD', 'Hard Disk Drive', 'कठोर डिस्क चालक', 'घूमती चुंबकीय platter पर चुंबकीय भंडारण'],
        ['NVMe', 'Non-Volatile Memory express', 'अवाष्पशील स्मृति तीव्र', 'PCIe पर SSD का आधुनिक प्रोटोकॉल — बहुत कम विलंब'],
        ['SATA', 'Serial ATA (Advanced Technology Attachment)', 'क्रमिक ATA', 'HDD/SSD का पुराना पर व्यापक interface (6 Gbps)'],
        ['PCIe', 'Peripheral Component Interconnect Express', 'परिधीय घटक अंतरसंबंध तीव्र', 'GPU/SSD/कार्ड के लिए तेज़ lane-based bus'],
        ['USB', 'Universal Serial Bus', 'सार्वत्रिक क्रमिक बस', 'बाहरी उपकरण जोड़ने का मानक — डेटा + बिजली'],
        ['HDMI', 'High-Definition Multimedia Interface', 'उच्च-परिभाषा बहुमाध्यम अंतरापृष्ठ', 'एक केबल में डिजिटल video + audio'],
        ['VGA / DVI', 'Video Graphics Array / Digital Visual Interface', 'वीडियो ग्राफ़िक्स सरणी / डिजिटल दृश्य अंतरापृष्ठ', 'पुराने analog / डिजिटल display connector'],
        ['PSU', 'Power Supply Unit', 'विद्युत आपूर्ति इकाई', 'AC को DC (+12V, +5V, +3.3V) में बदलना'],
        ['SMPS', 'Switched Mode Power Supply', 'स्विच-विधा विद्युत आपूर्ति', 'उच्च दक्षता वाली switching regulator — PSU का दिल'],
        ['UPS', 'Uninterruptible Power Supply', 'अबाधित विद्युत आपूर्ति', 'बिजली जाने पर battery से कुछ मिनट की backup बिजली'],
        ['VRM', 'Voltage Regulator Module', 'वोल्टता नियामक मॉड्यूल', '12V को CPU/GPU के ~1V core voltage में उतारना'],
        ['BIOS', 'Basic Input Output System', 'मूल इनपुट-आउटपुट तंत्र', 'पुराना firmware — POST व boot आरंभ'],
        ['UEFI', 'Unified Extensible Firmware Interface', 'एकीकृत विस्तारणीय firmware अंतरापृष्ठ', 'आधुनिक BIOS — GPT, Secure Boot, graphical setup'],
        ['CMOS', 'Complementary Metal Oxide Semiconductor', 'पूरक धातु ऑक्साइड अर्धचालक', 'BIOS सेटिंग्स रखने वाली कम-बिजली memory (बैटरी से)'],
        ['POST', 'Power-On Self-Test', 'चालू-होने पर स्व-परीक्षण', 'boot से पहले RAM/CPU/storage की जाँच; beep code'],
        ['TPM', 'Trusted Platform Module', 'विश्वसनीय प्लेटफ़ॉर्म मॉड्यूल', 'कुंजियाँ सुरक्षित रखने वाला चिप — BitLocker/Windows 11 के लिए'],
        ['PCB / IC', 'Printed Circuit Board / Integrated Circuit', 'मुद्रित परिपथ बोर्ड / एकीकृत परिपथ', 'पुर्ज़ों का आधार बोर्ड / एक चिप पर पूरा circuit'],
        ['MOSFET', 'Metal Oxide Semiconductor Field Effect Transistor', 'धातु-ऑक्साइड अर्धचालक क्षेत्र-प्रभाव ट्रांजिस्टर', 'आधुनिक चिप का मूल स्विच'],
        ['NIC', 'Network Interface Card', 'नेटवर्क अंतरापृष्ठ कार्ड', 'मशीन को network से जोड़ना (Ethernet/Wi-Fi)'],
        ['MAC', 'Media Access Control', 'माध्यम पहुँच नियंत्रण', 'NIC का 48-bit भौतिक पता (जैसे A1:B2:C3:D4:E5:F6)'],
        ['SMART', 'Self-Monitoring Analysis and Reporting Technology', 'स्व-निगरानी विश्लेषण व प्रतिवेदन तकनीक', 'डिस्क का स्वास्थ्य व चेतावनी आँकड़े'],
        ['TBW / DWPD', 'Terabytes Written / Drive Writes Per Day', 'लिखे टेराबाइट / प्रति दिन डिस्क-लेखन', 'SSD की सहनशक्ति (endurance) के माप'],
        ['RAID', 'Redundant Array of Independent Disks', 'स्वतंत्र डिस्कों का अतिरिक्त सरणी', 'कई डिस्क को जोड़ना — गति/सुरक्षा/दोनों'],
        ['SLC/MLC/TLC/QLC', 'Single / Multi / Triple / Quad Level Cell', 'एकल/बहु/त्रि/चतुर् स्तर कोशिका', 'NAND में 1/2/3/4 bit प्रति सेल'],
        ['FTL / WAF', 'Flash Translation Layer / Write Amplification Factor', 'flash अनुवाद परत / लेखन-प्रवर्धन गुणक', 'logical→physical mapping / वास्तविक लेखन कितना गुना हुआ'],
        ['DPI / PPI', 'Dots Per Inch / Pixels Per Inch', 'प्रति इंच बिंदु / पिक्सेल', 'प्रिंटर/स्कैनर की सूक्ष्मता / स्क्रीन का घनत्व'],
        ['OCR', 'Optical Character Recognition', 'प्रकाशिक वर्ण पहचान', 'तस्वीर/स्कैन से पाठ निकालना'],
        ['SoC', 'System on Chip', 'चिप पर तंत्र', 'CPU+GPU+memory controller+modem एक ही चिप पर (मोबाइल)']
      ] },

    { type: 'html', html: '<h3>3.3 सॉफ़्टवेयर, ऑपरेटिंग सिस्टम व लाइसेंस</h3><p>OS के प्रकार, विंडोज़/लिनक्स के औज़ार, और लाइसेंस की शर्तें — यहाँ से "कौन-सा सॉफ़्टवेयर किस काम का" साफ़ होता है।</p>' },
    { type: 'table',
      head: ['संक्षेप', 'पूरा नाम (Full Form)', 'हिंदी अर्थ', 'काम'],
      rows: [
        ['OS', 'Operating System', 'प्रचालन तंत्र', 'हार्डवेयर व एप्लिकेशन के बीच संसाधन-प्रबंधक'],
        ['GUI / CLI', 'Graphical / Command Line User Interface', 'चित्रात्मक / कमांड-पंक्ति अंतरापृष्ठ', 'क्लिक से चलाना / टाइप करके चलाना'],
        ['API', 'Application Programming Interface', 'अनुप्रयोग प्रोग्रामन अंतरापृष्ठ', 'दो सॉफ़्टवेयर के बीच बातचीत का अनुबंध'],
        ['SDK / IDE', 'Software Development Kit / Integrated Development Environment', 'विकास किट / एकीकृत विकास वातावरण', 'बनाने के औज़ार / editor+compiler+debugger एक जगह'],
        ['DLL / EXE', 'Dynamic Link Library / Executable', 'गतिशील लिंक लाइब्रेरी / निष्पादन-योग्य', 'साझा कोड-लाइब्रेरी / चलने योग्य प्रोग्राम'],
        ['MSI', 'Microsoft Installer', 'माइक्रोसॉफ़्ट स्थापक', 'Windows का मानक स्थापना-पैकेज प्रारूप'],
        ['NTFS', 'New Technology File System', 'नवीन प्रौद्योगिकी फ़ाइल तंत्र', 'Windows का आधुनिक filesystem — ACL, journaling, बड़ी फ़ाइल'],
        ['FAT / exFAT', 'File Allocation Table / Extended FAT', 'फ़ाइल आवंटन तालिका / विस्तारित FAT', 'पुराना सरल filesystem / USB के लिए बड़ी-फ़ाइल समर्थन'],
        ['ext4', 'Fourth Extended Filesystem', 'चतुर्थ विस्तारित फ़ाइल तंत्र', 'Linux का प्रचलित filesystem'],
        ['GPT / MBR', 'GUID Partition Table / Master Boot Record', 'GUID विभाजन तालिका / मास्टर बूट अभिलेख', 'आधुनिक विभाजन-योजना (UEFI) / पुरानी (BIOS, 2 TB सीमा)'],
        ['GUID', 'Globally Unique Identifier', 'वैश्विक अद्वितीय पहचानकर्ता', '128-bit अद्वितीय पहचान-संख्या'],
        ['ESP / MSR', 'EFI System Partition / Microsoft Reserved Partition', 'EFI तंत्र विभाजन / माइक्रोसॉफ़्ट आरक्षित विभाजन', 'FAT32 bootloader विभाजन / Windows का आरक्षित स्थान'],
        ['WinRE', 'Windows Recovery Environment', 'विंडोज़ पुनर्प्राप्ति वातावरण', 'मरम्मत, reset, command prompt, uninstall update'],
        ['WSL', 'Windows Subsystem for Linux', 'विंडोज़ हेतु लिनक्स उपतंत्र', 'Windows के भीतर असली Linux kernel (WSL2)'],
        ['UAC', 'User Account Control', 'उपयोगकर्ता खाता नियंत्रण', 'admin अधिकार माँगने पर पुष्टि — चुपचाप बदलाव रोके'],
        ['ACL / SID', 'Access Control List / Security Identifier', 'पहुँच नियंत्रण सूची / सुरक्षा पहचानकर्ता', 'किस उपयोगकर्ता/समूह को क्या अनुमति / Windows की आंतरिक पहचान'],
        ['GPO / MMC', 'Group Policy Object / Microsoft Management Console', 'समूह नीति वस्तु / प्रबंधन कंसोल', 'कई मशीनों पर नीति लागू करना / admin snap-ins का ढाँचा'],
        ['DISM', 'Deployment Image Servicing and Management', 'परिनियोजन छवि सर्विसिंग व प्रबंधन', 'Windows component store की मरम्मत व रखरखाव'],
        ['SFC', 'System File Checker', 'तंत्र फ़ाइल जाँचक', 'भ्रष्ट system फ़ाइलों की जाँच व प्रतिस्थापन'],
        ['BSOD', 'Blue Screen of Death', 'मृत्यु की नीली स्क्रीन', 'गंभीर kernel त्रुटि पर Windows का रुकना; stop code देता है'],
        ['PnP', 'Plug and Play', 'लगाओ और चलाओ', 'उपकरण लगाते ही स्वतः पहचान व driver'],
        ['HAL', 'Hardware Abstraction Layer', 'हार्डवेयर अमूर्तन परत', 'OS को हार्डवेयर-विवरण से अलग रखना'],
        ['EFS', 'Encrypting File System', 'एन्क्रिप्टिंग फ़ाइल तंत्र', 'NTFS पर प्रति-फ़ाइल encryption'],
        ['POSIX', 'Portable Operating System Interface', 'पोर्टेबल प्रचालन तंत्र अंतरापृष्ठ', 'Unix-जैसे व्यवहार का मानक — संगतता की कसौटी'],
        ['GNU', 'GNU’s Not Unix (पुनरावर्ती)', 'GNU, Unix नहीं है', 'मुफ़्त Unix-जैसे तंत्र की परियोजना'],
        ['GPL / LGPL', 'General Public License / Lesser GPL', 'सामान्य सार्वजनिक लाइसेंस / लघु GPL', 'copyleft — व्युत्पन्न काम भी उसी लाइसेंस में / लाइब्रेरी हेतु ढीला'],
        ['FOSS / FLOSS', 'Free and Open Source Software / Free-Libre and Open Source Software', 'मुक्त व खुला स्रोत सॉफ़्टवेयर', 'चार स्वतंत्रताएँ + खुला स्रोत'],
        ['EULA', 'End User License Agreement', 'अंत-उपयोगकर्ता लाइसेंस समझौता', 'उपयोग की कानूनी शर्तें'],
        ['LTS', 'Long Term Support', 'दीर्घकालिक समर्थन', 'वर्षों तक सुरक्षा-अपडेट वाला संस्करण'],
        ['APT / DNF / YUM', 'Advanced Package Tool / Dandified YUM / Yellowdog Updater Modified', 'उन्नत पैकेज औज़ार', 'Debian/Ubuntu / Fedora/RHEL के पैकेज मैनेजर'],
        ['RPM', 'RPM Package Manager (मूल: Red Hat Package Manager)', 'RPM पैकेज प्रबंधक', 'Red Hat परिवार का पैकेज प्रारूप व प्रबंधक'],
        ['SSH', 'Secure Shell', 'सुरक्षित शेल', 'encrypted दूरस्थ command-line व फ़ाइल transfer'],
        ['TLS / SSL', 'Transport Layer Security / Secure Sockets Layer', 'परिवहन परत सुरक्षा / सुरक्षित सॉकेट परत', 'आधुनिक encryption / SSL का पुराना, अब असुरक्षित पूर्वज'],
        ['VM / VDI', 'Virtual Machine / Virtual Disk Image (या Virtual Desktop Infrastructure)', 'आभासी मशीन / आभासी डिस्क छवि', 'एक मशीन में कई OS / disk image या दूरस्थ डेस्कटॉप'],
        ['OVF', 'Open Virtualization Format', 'खुला आभासीकरण प्रारूप', 'VM को एक hypervisor से दूसरे में ले जाने का मानक'],
        ['RDP', 'Remote Desktop Protocol', 'दूरस्थ डेस्कटॉप प्रोटोकॉल', 'Windows का GUI दूर से चलाना (port 3389)'],
        ['WinRM', 'Windows Remote Management', 'विंडोज़ दूरस्थ प्रबंधन', 'PowerShell Remoting का आधार (5985/5986)']
      ] },

    { type: 'html', html: '<h3>3.4 नेटवर्क, इंटरनेट व वेब</h3><p>जाल के आकार, प्रोटोकॉल, IP/DNS और वेब की तकनीक। साथ में port-संख्या भी दी है ताकि एक ही तालिका से पूरा उत्तर लिखा जा सके।</p>' },
    { type: 'table',
      head: ['संक्षेप', 'पूरा नाम (Full Form)', 'हिंदी अर्थ', 'काम / port'],
      rows: [
        ['LAN / WAN / MAN / PAN', 'Local / Wide / Metropolitan / Personal Area Network', 'स्थानीय / विस्तृत / महानगरीय / व्यक्तिगत क्षेत्र जाल', 'कमरा-भवन / देश-दुनिया / शहर / कुछ मीटर'],
        ['WLAN / VLAN / VPN', 'Wireless LAN / Virtual LAN / Virtual Private Network', 'बेतार LAN / आभासी LAN / आभासी निजी जाल', 'Wi-Fi / एक ही switch पर तार्किक अलगाव / सार्वजनिक जाल पर सुरक्षित सुरंग'],
        ['SAN / NAS', 'Storage Area Network / Network Attached Storage', 'भंडारण क्षेत्र जाल / जाल-संलग्न भंडारण', 'block-स्तर साझा storage / फ़ाइल-स्तर साझा storage'],
        ['IP', 'Internet Protocol', 'इंटरनेट प्रोटोकॉल', 'पता देना व routing (IPv4 32-bit, IPv6 128-bit)'],
        ['TCP / UDP', 'Transmission Control Protocol / User Datagram Protocol', 'पारेषण नियंत्रण / उपयोगकर्ता डेटाग्राम प्रोटोकॉल', 'भरोसेमंद, क्रमबद्ध / हल्का, तेज़, गारंटी नहीं'],
        ['HTTP / HTTPS', 'HyperText Transfer Protocol / HTTP Secure', 'अतिपाठ स्थानांतरण प्रोटोकॉल / सुरक्षित HTTP', 'वेब पृष्ठ लाना (80) / TLS के साथ (443)'],
        ['FTP / SFTP / FTPS', 'File Transfer Protocol / SSH File Transfer Protocol / FTP over SSL', 'फ़ाइल स्थानांतरण प्रोटोकॉल', 'फ़ाइल भेजना (20/21) / SSH के भीतर / TLS के साथ'],
        ['SMTP / POP3 / IMAP', 'Simple Mail Transfer Protocol / Post Office Protocol v3 / Internet Message Access Protocol', 'सरल डाक स्थानांतरण / डाकघर प्रोटोकॉल / इंटरनेट संदेश पहुँच प्रोटोकॉल', 'डाक भेजना (25/587) / डाउनलोड करके हटाना (110) / server पर रखकर पढ़ना (143)'],
        ['DNS', 'Domain Name System', 'डोमेन नाम तंत्र', 'नाम को IP में बदलना (53)'],
        ['DHCP', 'Dynamic Host Configuration Protocol', 'गतिशील होस्ट विन्यास प्रोटोकॉल', 'स्वतः IP, mask, gateway, DNS देना (67/68)'],
        ['NAT', 'Network Address Translation', 'जाल पता अनुवाद', 'निजी IP को सार्वजनिक IP में बदलना'],
        ['ICMP / ARP', 'Internet Control Message Protocol / Address Resolution Protocol', 'इंटरनेट नियंत्रण संदेश / पता समाधान प्रोटोकॉल', 'ping व त्रुटि-सूचना / IP से MAC खोजना'],
        ['OSI', 'Open Systems Interconnection', 'मुक्त तंत्र अंतरसंबंध', 'नेटवर्किंग का सात-परत सैद्धांतिक मॉडल'],
        ['ISO / IEEE / IETF', 'International Organization for Standardization / Institute of Electrical and Electronics Engineers / Internet Engineering Task Force', 'मानक संस्थाएँ', 'अंतरराष्ट्रीय मानक / विद्युत-इलेक्ट्रॉनिक मानक / इंटरनेट मानक (RFC)'],
        ['URL / URI / URN', 'Uniform Resource Locator / Identifier / Name', 'एकसमान संसाधन स्थानकारक / पहचानकर्ता / नाम', 'पता+विधि / पहचान का व्यापक रूप / केवल नाम'],
        ['HTML / CSS / JS', 'HyperText Markup Language / Cascading Style Sheets / JavaScript', 'अतिपाठ चिह्नन भाषा / सोपानी शैली पत्रक', 'वेब की संरचना / रूप-रंग / व्यवहार'],
        ['DOM / CSSOM', 'Document Object Model / CSS Object Model', 'दस्तावेज़ वस्तु प्रतिरूप', 'पृष्ठ को प्रोग्राम से पेड़ की तरह पढ़ना-बदलना'],
        ['AJAX', 'Asynchronous JavaScript and XML', 'अतुल्यकालिक JavaScript व XML', 'पृष्ठ दोबारा खोले बिना डेटा लाना'],
        ['JSON / XML / YAML', 'JavaScript Object Notation / eXtensible Markup Language / YAML Ain’t Markup Language', 'डेटा-विनिमय प्रारूप', 'हल्का डेटा / चिह्नन-आधारित डेटा / पठनीय विन्यास'],
        ['REST / SOAP / RPC', 'Representational State Transfer / Simple Object Access Protocol / Remote Procedure Call', 'अभिवचन-आधारित / XML-आधारित / दूरस्थ प्रक्रिया-कॉल', 'आधुनिक API शैली / कठोर XML API / दूर का function चलाना'],
        ['CDN', 'Content Delivery Network', 'सामग्री वितरण जाल', 'किनारों से तेज़ वितरण व मूल server की रक्षा'],
        ['TTL / MTU / QoS', 'Time To Live / Maximum Transmission Unit / Quality of Service', 'जीवन-काल / अधिकतम पारेषण इकाई / सेवा गुणवत्ता', 'cache/hop सीमा / सबसे बड़ा packet / प्राथमिकता व bandwidth प्रबंधन'],
        ['ISP / WWW / W3C', 'Internet Service Provider / World Wide Web / World Wide Web Consortium', 'इंटरनेट सेवा प्रदाता / विश्वव्यापी जाल / मानक निकाय', 'इंटरनेट देना / वेब / वेब मानक बनाना'],
        ['VoIP / MQTT / CoAP', 'Voice over Internet Protocol / Message Queuing Telemetry Transport / Constrained Application Protocol', 'इंटरनेट पर आवाज़ / IoT प्रोटोकॉल', 'इंटरनेट कॉल / हल्का publish-subscribe / अति-सीमित उपकरण हेतु'],
        ['SSID / WPA / WEP', 'Service Set Identifier / Wi-Fi Protected Access / Wired Equivalent Privacy', 'Wi-Fi नाम / सुरक्षित पहुँच / पुरानी कमज़ोर सुरक्षा', 'जाल का नाम / WPA2/WPA3 सुरक्षित / WEP अब त्याज्य'],
        ['NFC / RFID / BLE', 'Near Field Communication / Radio Frequency Identification / Bluetooth Low Energy', 'निकट-क्षेत्र संचार / रेडियो आवृत्ति पहचान / कम-ऊर्जा ब्लूटूथ', 'कुछ सेमी / टैग-आधारित पहचान / wearable व beacon'],
        ['GPS', 'Global Positioning System', 'वैश्विक स्थिति निर्धारण तंत्र', 'उपग्रहों से स्थान व समय'],
        ['PoE / UTP / STP', 'Power over Ethernet / Unshielded / Shielded Twisted Pair', 'Ethernet पर बिजली / अपरिरक्षित / परिरक्षित युग्मित तार', 'एक केबल में डेटा+बिजली / सामान्य केबल / शोर-रोधी केबल'],
        ['DSL / FTTH / ONT', 'Digital Subscriber Line / Fiber To The Home / Optical Network Terminal', 'डिजिटल ग्राहक लाइन / घर तक ऑप्टिकल फ़ाइबर / प्रकाशिक जाल टर्मिनल', 'फ़ोन-तार पर इंटरनेट / फ़ाइबर पहुँच / फ़ाइबर को Ethernet में बदलना'],
        ['BGP / OSPF / SDN', 'Border Gateway Protocol / Open Shortest Path First / Software Defined Networking', 'सीमा द्वार प्रोटोकॉल / खुला लघुतम पथ प्रथम / सॉफ़्टवेयर-परिभाषित जालन', 'इंटरनेट की routing / आंतरिक routing / नियंत्रण-तल को अलग करना'],
        ['CORS / CSP', 'Cross-Origin Resource Sharing / Content Security Policy', 'विन्न-स्रोत संसाधन साझाकरण / सामग्री सुरक्षा नीति', 'दूसरे domain की API अनुमति / कौन-सी script चल सकती है']
      ] },

    { type: 'html', html: '<h3>3.5 साइबर सुरक्षा व क्रिप्टोग्राफ़ी</h3><p>हमलों के नाम, बचाव के औज़ार और encryption/hashing के संक्षेप — सुरक्षा वाले प्रश्नों का पूरा भंडार।</p>' },
    { type: 'table',
      head: ['संक्षेप', 'पूरा नाम (Full Form)', 'हिंदी अर्थ', 'काम'],
      rows: [
        ['MFA / 2FA', 'Multi-Factor / Two-Factor Authentication', 'बहु-कारक / द्वि-कारक सत्यापन', 'पासवर्ड के अतिरिक्त दूसरा प्रमाण'],
        ['OTP / TOTP', 'One-Time Password / Time-based OTP', 'एक बार का पासवर्ड / समय-आधारित OTP', 'एक बार वैध कोड / 30 सेकंड में बदलता कोड'],
        ['AES / RSA', 'Advanced Encryption Standard / Rivest–Shamir–Adleman', 'उन्नत एन्क्रिप्शन मानक / आविष्कारकों के नाम', 'symmetric encryption / asymmetric (public-private key)'],
        ['SHA / MD5', 'Secure Hash Algorithm / Message Digest 5', 'सुरक्षित हैश एल्गोरिद्म / संदेश सार 5', 'अखंडता-जाँच (SHA-256) / MD5 अब टूटा हुआ, न उपयोग करें'],
        ['HMAC', 'Hash-based Message Authentication Code', 'हैश-आधारित संदेश प्रमाणीकरण कोड', 'कुंजी से अखंडता + प्रामाणिकता दोनों'],
        ['PKI / CA', 'Public Key Infrastructure / Certificate Authority', 'सार्वजनिक कुंजी अवसंरचना / प्रमाणपत्र प्राधिकरण', 'कुंजी व प्रमाणपत्र का तंत्र / भरोसेमंद प्रमाणपत्र जारी करना'],
        ['CRL / OCSP', 'Certificate Revocation List / Online Certificate Status Protocol', 'प्रमाणपत्र निरसन सूची / ऑनलाइन स्थिति प्रोटोकॉल', 'रद्द प्रमाणपत्रों की सूची / वास्तविक-समय स्थिति जाँच'],
        ['HSTS', 'HTTP Strict Transport Security', 'HTTP कठोर परिवहन सुरक्षा', 'browser को सदैव HTTPS पर बाँधना'],
        ['SPF / DKIM / DMARC', 'Sender Policy Framework / DomainKeys Identified Mail / Domain-based Message Authentication, Reporting and Conformance', 'प्रेषक नीति / डाक-हस्ताक्षर / नीति-प्रतिवेदन', 'कौन-सा server डाक भेज सकता / डाक पर cryptographic हस्ताक्षर / दोनों की नीति व रिपोर्ट'],
        ['XSS / CSRF', 'Cross-Site Scripting / Cross-Site Request Forgery', 'विन्न-साइट स्क्रिप्टन / विन्न-साइट अनुरोध कूटरचना', 'दूसरे की साइट पर script इंजेक्शन / उपयोगकर्ता की ओर से नकली अनुरोध'],
        ['SQLi', 'SQL Injection', 'SQL अंतःक्षेपण', 'input के रास्ते डेटाबेस query में घुसपैठ'],
        ['DoS / DDoS', 'Denial of Service / Distributed DoS', 'सेवा-निषेध / वितरित सेवा-निषेध', 'एक स्रोत से बाधित करना / हज़ारों मशीनों से बाढ़'],
        ['MITM', 'Man-In-The-Middle', 'मध्य-पुरुष हमला', 'दो पक्षों के बीच चुपचाप सुनना/बदलना'],
        ['IDS / IPS', 'Intrusion Detection / Prevention System', 'घुसपैठ पहचान / रोकथाम तंत्र', 'संदिग्ध गतिविधि बताना / स्वयं रोकना'],
        ['WAF', 'Web Application Firewall', 'वेब अनुप्रयोग फ़ायरवॉल', 'HTTP-स्तर के हमले (XSS, SQLi) रोकना'],
        ['SIEM / SOC', 'Security Information and Event Management / Security Operations Center', 'सुरक्षा सूचना व घटना प्रबंधन / सुरक्षा संचालन केंद्र', 'लॉग जोड़कर विश्लेषण / निगरानी करने वाली टीम व कक्ष'],
        ['EDR / AV', 'Endpoint Detection and Response / Antivirus', 'अंतबिंदु पहचान व प्रतिक्रिया / प्रतिवायरस', 'मशीन पर गहरा व्यवहार-विश्लेषण / ज्ञात malware पहचान'],
        ['PUP / RAT / C2', 'Potentially Unwanted Program / Remote Access Trojan / Command and Control', 'संभावित अवांछित प्रोग्राम / दूरस्थ पहुँच ट्रोजन / आदेश-नियंत्रण', 'adware जैसा अवांछित / छिपा दूरस्थ नियंत्रण / हमलावर का नियंत्रण-केंद्र'],
        ['CVE / CVSS', 'Common Vulnerabilities and Exposures / Common Vulnerability Scoring System', 'सार्वजनिक कमज़ोरी सूची / गंभीरता अंकन', 'हर कमज़ोरी की अद्वितीय ID / 0–10 गंभीरता अंक'],
        ['OWASP', 'Open Worldwide Application Security Project', 'मुक्त वैश्विक अनुप्रयोग सुरक्षा परियोजना', 'Top-10 जोखिम-सूची व मुफ़्त सुरक्षा-सामग्री'],
        ['PCI DSS / GDPR', 'Payment Card Industry Data Security Standard / General Data Protection Regulation', 'भुगतान-कार्ड सुरक्षा मानक / सामान्य डेटा संरक्षण विनियम', 'कार्ड-डेटा की सुरक्षा / निजी डेटा के अधिकार'],
        ['DLP / BYOD / MDM', 'Data Loss Prevention / Bring Your Own Device / Mobile Device Management', 'डेटा-हानि रोकथाम / अपना उपकरण लाओ / मोबाइल उपकरण प्रबंधन', 'डेटा बाहर जाने से रोकना / निजी उपकरण की नीति / उपकरणों पर नियंत्रण'],
        ['RBAC / ABAC / SSO', 'Role-Based / Attribute-Based Access Control / Single Sign-On', 'भूमिका / गुण आधारित पहुँच / एकल प्रवेश', 'पद से अनुमति / शर्तों से अनुमति / एक login से कई सेवाएँ'],
        ['SAML / OAuth / OIDC', 'Security Assertion Markup Language / Open Authorization / OpenID Connect', 'सुरक्षा अभिकथन भाषा / खुला प्राधिकरण / OpenID कनेक्ट', 'SSO का XML मानक / सीमित पहुँच देने का मानक / OAuth पर पहचान-परत'],
        ['JWT / LDAP / AD', 'JSON Web Token / Lightweight Directory Access Protocol / Active Directory', 'JSON वेब टोकन / हल्का निर्देशिका पहुँच प्रोटोकॉल / सक्रिय निर्देशिका', 'हस्ताक्षरित पहचान-टोकन / निर्देशिका से पूछना / Microsoft की पहचान-सेवा'],
        ['RADIUS', 'Remote Authentication Dial-In User Service', 'दूरस्थ प्रमाणीकरण सेवा', 'नेटवर्क पहुँच का केंद्रीकृत AAA (authentication, authorization, accounting)'],
        ['CERT / IOC / APT', 'Computer Emergency Response Team / Indicator of Compromise / Advanced Persistent Threat', 'आपात प्रतिक्रिया दल / समझौता-संकेतक / उन्नत स्थायी खतरा', 'घटना-सहायता / हमले के निशान / लंबा, लक्षित, छिपा हमला']
      ] },

    { type: 'html', html: '<h3>3.6 फ़ाइल एक्सटेंशन व प्रारूप</h3><p>हर एक्सटेंशन का पूरा नाम, वह किस प्रकार की फ़ाइल है, और उसे कौन-सा सॉफ़्टवेयर खोलता है।</p>' },
    { type: 'table',
      head: ['एक्सटेंशन', 'पूरा नाम', 'प्रकार', 'किससे खुले'],
      rows: [
        ['.pdf', 'Portable Document Format', 'दस्तावेज़ (पृष्ठ-आधारित)', 'कोई भी PDF reader, browser'],
        ['.docx / .xlsx / .pptx', 'Word / Excel / PowerPoint Open XML', 'Office दस्तावेज़', 'MS Office, LibreOffice (x = XML)'],
        ['.odt / .ods / .odp', 'OpenDocument Text / Spreadsheet / Presentation', 'खुला Office प्रारूप', 'LibreOffice, OpenOffice'],
        ['.csv / .tsv', 'Comma / Tab Separated Values', 'सादा तालिका-पाठ', 'Excel, कोई भी text editor'],
        ['.txt / .rtf', 'Text / Rich Text Format', 'सादा / स्वरूपित पाठ', 'Notepad, WordPad, Word'],
        ['.jpg / .jpeg', 'Joint Photographic Experts Group', 'lossy तस्वीर', 'सर्वत्र; पारदर्शिता नहीं'],
        ['.png', 'Portable Network Graphics', 'lossless तस्वीर', 'सर्वत्र; पारदर्शिता है'],
        ['.gif', 'Graphics Interchange Format', '256-रंग तस्वीर/animation', 'सर्वत्र'],
        ['.bmp / .tiff', 'Bitmap / Tagged Image File Format', 'असम्पीड़ित / प्रिंट-गुणवत्ता', 'सर्वत्र / प्रिंट व स्कैन संग्रह'],
        ['.svg', 'Scalable Vector Graphics', 'वेक्टर (XML)', 'browser, Inkscape; खींचने पर फटता नहीं'],
        ['.webp / .avif', 'Web Picture / AV1 Image File Format', 'आधुनिक छोटी तस्वीर', 'आधुनिक browser'],
        ['.heic', 'High Efficiency Image Container', 'HEIF तस्वीर (iPhone)', 'Apple; Windows में codec चाहिए'],
        ['.mp3 / .aac', 'MPEG Audio Layer III / Advanced Audio Coding', 'lossy ऑडियो', 'सर्वत्र'],
        ['.flac / .wav', 'Free Lossless Audio Codec / Waveform Audio File Format', 'lossless / असम्पीड़ित ऑडियो', 'संग्रह / संपादन-मूल'],
        ['.mp4 / .mkv / .avi', 'MPEG-4 Part 14 / Matroska Video / Audio Video Interleave', 'video container', 'सर्वत्र / VLC / पुराने player'],
        ['.mov / .webm', 'QuickTime Movie / WebM', 'video container', 'Apple / वेब (VP9/AV1 + Opus)'],
        ['.zip / .rar / .7z', 'ZIP / Roshal Archive / 7-Zip', 'संग्रह (archive)', 'सर्वत्र / WinRAR / 7-Zip'],
        ['.tar / .gz / .xz', 'Tape Archive / GNU zip / XZ', 'Unix संग्रह व संपीड़न', 'Linux/macOS tar'],
        ['.iso / .img', 'ISO 9660 disc image / Image', 'डिस्क की हूबहू नकल', 'mount करके या bootable USB से'],
        ['.exe / .msi / .bat', 'Executable / Microsoft Installer / Batch', 'चलने योग्य / स्थापक / script', 'Windows'],
        ['.sh / .ps1 / .py', 'Shell script / PowerShell script / Python', 'script', 'bash / PowerShell / Python'],
        ['.js / .ts / .json', 'JavaScript / TypeScript / JavaScript Object Notation', 'कोड / डेटा', 'browser, Node.js'],
        ['.yaml / .ini / .cfg', 'YAML Ain’t Markup Language / Initialization / Configuration', 'विन्यास', 'सर्वत्र (पाठ-संपादक)'],
        ['.html / .css', 'HyperText Markup Language / Cascading Style Sheets', 'वेब पृष्ठ / शैली', 'browser'],
        ['.db / .sqlite / .accdb', 'Database / SQLite / Access Database', 'डेटाबेस', 'DB engine, MS Access'],
        ['.pst / .ost', 'Personal Storage Table / Offline Storage Table', 'Outlook संग्रह / offline cache', 'Outlook (OST सीधे दूसरी प्रोफ़ाइल में नहीं)'],
        ['.eml / .msg / .ics / .vcf', 'Email Message / Outlook Message / iCalendar / vCard', 'डाक / कैलेंडर / संपर्क', 'mail client, कैलेंडर, फ़ोन'],
        ['.stl / .obj / .gltf', 'Stereolithography / Wavefront Object / Graphics Language Transmission Format', '3D मॉडल', 'slicer, Blender, 3D viewer'],
        ['.psd / .ai / .eps', 'Photoshop Document / Adobe Illustrator / Encapsulated PostScript', 'संपादन-योग्य मूल', 'Photoshop / Illustrator / प्रिंट'],
        ['.pcl / .ps / .xps', 'Printer Command Language / PostScript / XML Paper Specification', 'प्रिंटर/पृष्ठ भाषा', 'प्रिंटर driver'],
        ['.epub / .mobi', 'Electronic Publication / Mobipocket', 'ई-पुस्तक', 'e-reader'],
        ['.apk / .ipa / .deb / .rpm', 'Android Package / iOS App Store Package / Debian / RPM Package', 'ऐप/पैकेज स्थापक', 'Android / iOS / Debian / Red Hat']
      ] },

    { type: 'html', html: '<h3>3.7 MS Office व भारतीय डिजिटल सेवाएँ</h3><p>Word/Excel/PowerPoint के संक्षेप और UPI, NEFT, RTGS, IMPS, DigiLocker, eSign जैसी भारतीय सेवाएँ।</p>' },
    { type: 'table',
      head: ['संक्षेप', 'पूरा नाम', 'हिंदी अर्थ', 'काम'],
      rows: [
        ['TOC', 'Table of Contents', 'विषय-सूची', 'Heading styles से स्वचालित सूची'],
        ['OLE / DDE', 'Object Linking and Embedding / Dynamic Data Exchange', 'वस्तु जोड़ना-अंतःस्थापित करना / गतिशील डेटा विनिमय', 'Excel chart को Word में जोड़ना'],
        ['VBA', 'Visual Basic for Applications', 'अनुप्रयोगों हेतु विजुअल बेसिक', 'Office में macro व स्वचालन'],
        ['VLOOKUP / HLOOKUP', 'Vertical / Horizontal Lookup', 'ऊर्ध्वाधर / क्षैतिज खोज', 'तालिका के पहले स्तंभ/पंक्ति से मान खोजना'],
        ['XLOOKUP', 'आधुनिक Lookup (X = extended)', 'विस्तारित खोज', 'दोनों दिशाओं में, डिफ़ॉलट exact match'],
        ['IFERROR / SUMIF / COUNTIF', 'If Error / Sum If / Count If', 'यदि त्रुटि / शर्त से योग / शर्त से गिनती', 'त्रुटि छिपाना / शर्त-आधारित गणना'],
        ['CONCAT / TEXTJOIN', 'Concatenate / Text Join', 'जोड़ना / पाठ-संधान', 'कई सेल का पाठ एक में'],
        ['PMT / PV / FV', 'Payment / Present Value / Future Value', 'किस्त / वर्तमान मूल्य / भविष्य मूल्य', 'ऋण व निवेश की गणना'],
        ['NPV / IRR / ROI', 'Net Present Value / Internal Rate of Return / Return on Investment', 'शुद्ध वर्तमान मूल्य / आंतरिक प्रतिफल दर / निवेश पर प्रतिफल', 'परियोजना-लाभ का आकलन'],
        ['GAL / OAB', 'Global Address List / Offline Address Book', 'वैश्विक पता सूची / offline पता-पुस्तिका', 'संस्थान के सब संपर्क / offline खोज'],
        ['MAPI / EWS', 'Messaging Application Programming Interface / Exchange Web Services', 'संदेशन API / Exchange वेब सेवाएँ', 'Outlook का Exchange से जुड़ना'],
        ['GST / PAN / TAN', 'Goods and Services Tax / Permanent Account Number / Tax Deduction Account Number', 'वस्तु-सेवा कर / स्थायी खाता संख्या / कर-कटौती खाता संख्या', 'भारतीय कर व्यवस्था'],
        ['UPI / NEFT / RTGS / IMPS', 'Unified Payments Interface / National Electronic Funds Transfer / Real Time Gross Settlement / Immediate Payment Service', 'एकीकृत भुगतान अंतरापृष्ठ / राष्ट्रीय इलेक्ट्रॉनिक निधि transfer / वास्तविक-समय सकल निपटान / तत्काल भुगतान सेवा', 'भारतीय डिजिटल भुगतान के चार रास्ते'],
        ['DSC / eSign', 'Digital Signature Certificate / Electronic Signature', 'डिजिटल हस्ताक्षर प्रमाणपत्र / इलेक्ट्रॉनिक हस्ताक्षर', 'कानूनी रूप से वैध डिजिटल हस्ताक्षर'],
        ['CBT / CBE', 'Computer Based Test / Computer Based Examination', 'कंप्यूटर आधारित परीक्षा', 'ITI/NIMI की ऑनलाइन परीक्षा-विधा']
      ] },

    { type: 'html', html: '<h3>3.8 प्रोग्रामिंग, डेटाबेस व डेटा</h3><p>भाषा-प्रतिमान, SQL कमांड, डेटा-संरचनाएँ और प्रदर्शन-मापन — कोडिंग वाले विषयों की शब्दावली।</p>' },
    { type: 'table',
      head: ['संक्षेप', 'पूरा नाम', 'हिंदी अर्थ', 'काम'],
      rows: [
        ['OOP / FP', 'Object Oriented / Functional Programming', 'वस्तु-उन्मुख / फलन-उन्मुख प्रोग्रामन', 'class-object शैली / शुद्ध फलन शैली'],
        ['MVC / MVVM', 'Model View Controller / Model View ViewModel', 'प्रतिरूप-दृश्य-नियंत्रक', 'कोड को तीन भूमिकाओं में बाँटना'],
        ['ORM / CRUD', 'Object Relational Mapping / Create Read Update Delete', 'वस्तु-संबंध मानचित्रण / चार मूल क्रियाएँ', 'table को object की तरह / डेटा के चार बुनियादी काम'],
        ['ACID', 'Atomicity, Consistency, Isolation, Durability', 'परमाणुता, संगति, पृथकता, स्थायित्व', 'विश्वसनीय transaction के चार गुण'],
        ['DBMS / RDBMS', 'Database Management System / Relational DBMS', 'डेटाबेस प्रबंधन तंत्र / संबंधपरक DBMS', 'डेटा सँभालना / table-आधारित डेटा'],
        ['SQL / NoSQL', 'Structured Query Language / Not Only SQL', 'संरचित प्रश्न भाषा / केवल SQL नहीं', 'संबंधपरक query / दस्तावेज़-key-value-ग्राफ़ भंडार'],
        ['DDL / DML / DCL / TCL', 'Data Definition / Manipulation / Control Language / Transaction Control Language', 'डेटा परिभाषा / हेरफेर / नियंत्रण / transaction नियंत्रण', 'CREATE-ALTER / SELECT-INSERT / GRANT-REVOKE / COMMIT-ROLLBACK'],
        ['PK / FK / ER', 'Primary Key / Foreign Key / Entity Relationship', 'मुख्य कुंजी / बाहरी कुंजी / इकाई-संबंध', 'अद्वितीय पहचान / जोड़ने वाली कुंजी / डेटा-नक्शा'],
        ['UML', 'Unified Modeling Language', 'एकीकृत प्रतिरूपण भाषा', 'सॉफ़्टवेयर का चित्र-नक्शा'],
        ['JVM / JRE / JDK', 'Java Virtual Machine / Java Runtime Environment / Java Development Kit', 'जावा आभासी मशीन / runtime / विकास किट', 'bytecode चलाना / केवल चलाना / बनाना+चलाना'],
        ['JIT / AOT', 'Just In Time / Ahead Of Time', 'ठीक समय पर / पहले से', 'चलते समय compile / पहले ही compile'],
        ['CLR / IL', 'Common Language Runtime / Intermediate Language', 'साझा भाषा runtime / मध्यवर्ती भाषा', '.NET का निष्पादन-इंजन / .NET bytecode'],
        ['GC / OOM', 'Garbage Collection / Out Of Memory', 'कचरा-संग्रह / स्मृति-समाप्ति', 'अप्रयुक्त memory स्वतः मुक्त / memory खत्म'],
        ['TDD / BDD', 'Test Driven / Behavior Driven Development', 'परीक्षण / व्यवहार प्रेरित विकास', 'पहले test फिर कोड / पहले अपेक्षित व्यवहार'],
        ['CI / CD', 'Continuous Integration / Continuous Delivery (या Deployment)', 'सतत एकीकरण / सतत वितरण', 'हर बदलाव पर build-test / स्वतः तैयार या परिनियोजित'],
        ['VCS / DVCS / PR', 'Version Control System / Distributed VCS / Pull Request', 'संस्करण नियंत्रण तंत्र / वितरित VCS / pull अनुरोध', 'इतिहास रखना / हर clone पूरा इतिहास / बदलाव जोड़ने का प्रस्ताव'],
        ['QA / UAT / POC / MVP', 'Quality Assurance / User Acceptance Testing / Proof of Concept / Minimum Viable Product', 'गुणवत्ता आश्वासन / उपयोगकर्ता स्वीकृति परीक्षण / अवधारणा प्रमाण / न्यूनतम व्यवहार्य उत्पाद', 'गुणवत्ता प्रक्रिया / अंतिम उपयोगकर्ता की जाँच / व्यवहार्यता दिखाना / सबसे छोटा उपयोगी संस्करण'],
        ['SRS / SDLC', 'Software Requirements Specification / Software Development Life Cycle', 'सॉफ़्टवेयर आवश्यकता विनिर्देश / विकास जीवन-चक्र', 'क्या बनाना है लिखित / योजना→विश्लेषण→डिज़ाइन→कोड→परीक्षण→परिनियोजन→रखरखाव'],
        ['DSA / BFS / DFS', 'Data Structures and Algorithms / Breadth First Search / Depth First Search', 'डेटा संरचना व एल्गोरिद्म / चौड़ाई-प्रथम / गहराई-प्रथम खोज', 'संगठन + विधि / परत-दर-परत / शाखा में गहराई तक'],
        ['FIFO / LIFO / LRU', 'First In First Out / Last In First Out / Least Recently Used', 'पहले आया पहले गया / बाद में आया पहले गया / सबसे पुराना प्रयुक्त', 'queue / stack / cache निकालने की नीति'],
        ['ASCII / UTF / BOM', 'American Standard Code for Information Interchange / Unicode Transformation Format / Byte Order Mark', 'अमेरिकी मानक सूचना-विनिमय कोड / यूनिकोड रूपांतरण प्रारूप / byte-क्रम चिह्न', '7/8-bit वर्ण-कोड / UTF-8 आदि / फ़ाइल के आरंभ का encoding-संकेत'],
        ['CRLF / LF / EOL', 'Carriage Return + Line Feed / Line Feed / End Of Line', 'कैरिज रिटर्न + लाइन फ़ीड / लाइन फ़ीड / पंक्ति-अंत', 'Windows पंक्ति-अंत / Unix पंक्ति-अंत / सामान्य शब्द'],
        ['regex / AST / IR', 'Regular Expression / Abstract Syntax Tree / Intermediate Representation', 'नियमित अभिव्यक्ति / अमूर्त व्याकरण वृक्ष / मध्यवर्ती निरूपण', 'पैटर्न-खोज / कोड का पेड़-रूप / compiler का बीच-रूप'],
        ['NaN / int / bool', 'Not a Number / Integer / Boolean', 'संख्या नहीं / पूर्णांक / बूलियन', 'अवैध गणना-परिणाम / पूर्ण संख्या / सही-गलत'],
        ['SPA / MPA / PWA', 'Single Page / Multi Page Application / Progressive Web App', 'एकल-पृष्ठ / बहु-पृष्ठ अनुप्रयोग / प्रगतिशील वेब ऐप', 'एक ही पृष्ठ में सब / अलग-अलग पृष्ठ / ऐप जैसा वेब (offline, install)'],
        ['SSR / CSR / SSG', 'Server Side Rendering / Client Side Rendering / Static Site Generation', 'server-पक्ष / client-पक्ष प्रतिपादन / स्थिर साइट जनन', 'HTML server पर बने / browser पर बने / build समय पर बने'],
        ['SEO / UX / UI', 'Search Engine Optimization / User Experience / User Interface', 'खोज-इंजन अनुकूलन / उपयोगकर्ता अनुभव / अंतरापृष्ठ', 'खोज में ऊपर आना / कैसा महसूस होता है / क्या दिखता है'],
        ['a11y / i18n / l10n', 'Accessibility / Internationalization / Localization', 'सुगम्यता / अंतरराष्ट्रीयकरण / स्थानीयकरण', 'a+11 अक्षर+y / i+18 अक्षर+n / l+10 अक्षर+n — numeronym'],
        ['FCP / LCP / CLS / INP', 'First Contentful Paint / Largest Contentful Paint / Cumulative Layout Shift / Interaction to Next Paint', 'प्रथम सामग्री चित्रण / विशालतम सामग्री चित्रण / संचयी लेआउट खिसकाव / अगले चित्रण तक अंतःक्रिया', 'Core Web Vitals — गति व स्थिरता के माप'],
        ['TTFB / TTI / CWV', 'Time To First Byte / Time To Interactive / Core Web Vitals', 'प्रथम byte तक समय / अंतःक्रिया-योग्य तक समय / मूल वेब स्वास्थ्य-संकेत', 'server प्रतिक्रिया / उपयोगी होने का समय / Google के तीन माप']
      ] },

    { type: 'html', html: '<h3>3.9 क्लाउड, AI व नई तकनीकें</h3><p>सेवा-मॉडल, container, मशीन-लर्निंग, IoT, blockchain और XR — आज की तकनीक के सारे संक्षेप एक जगह।</p>' },
    { type: 'table',
      head: ['संक्षेप', 'पूरा नाम', 'हिंदी अर्थ', 'काम'],
      rows: [
        ['IaaS', 'Infrastructure as a Service', 'सेवा के रूप में अवसंरचना', 'VM, storage, network किराए पर — OS से ऊपर आपका'],
        ['PaaS', 'Platform as a Service', 'सेवा के रूप में मंच', 'OS/runtime प्रदाता का — आप केवल कोड व डेटा'],
        ['SaaS', 'Software as a Service', 'सेवा के रूप में सॉफ़्टवेयर', 'पूरा ऐप प्रदाता का — आप केवल उपयोग'],
        ['FaaS', 'Function as a Service', 'सेवा के रूप में फलन', 'serverless — प्रति invocation बिल'],
        ['BaaS / CaaS / DBaaS', 'Backend / Containers / Database as a Service', 'सेवा के रूप में backend / container / डेटाबेस', 'auth+DB+storage / cluster प्रबंधित / DB प्रबंधित'],
        ['NIST', 'National Institute of Standards and Technology', 'राष्ट्रीय मानक व प्रौद्योगिकी संस्थान', 'क्लाउड की पाँच विशेषताएँ इन्होंने परिभाषित कीं'],
        ['AWS / GCP / OCI', 'Amazon Web Services / Google Cloud Platform / Oracle Cloud Infrastructure', 'तीन बड़े क्लाउड प्रदाता', 'IaaS/PaaS/SaaS की पूरी सूची'],
        ['EC2 / S3 / RDS', 'Elastic Compute Cloud / Simple Storage Service / Relational Database Service', 'लचीला compute / सरल भंडारण / संबंधपरक DB सेवा', 'AWS की VM / object storage / प्रबंधित DB'],
        ['EKS / ECS', 'Elastic Kubernetes Service / Elastic Container Service', 'प्रबंधित Kubernetes / container सेवा', 'container चलाने के दो तरीके'],
        ['VPC / IAM / KMS', 'Virtual Private Cloud / Identity and Access Management / Key Management Service', 'आभासी निजी क्लाउड / पहचान-पहुँच प्रबंधन / कुंजी प्रबंधन', 'अलग network / कौन क्या करे / encryption कुंजियाँ'],
        ['SLA / SLO / SLI', 'Service Level Agreement / Objective / Indicator', 'सेवा स्तर समझौता / लक्ष्य / संकेतक', 'वादा / संख्यात्मक लक्ष्य / मापा गया मान'],
        ['RTO / RPO', 'Recovery Time Objective / Recovery Point Objective', 'पुनर्प्राप्ति समय / बिंदु लक्ष्य', 'कितनी देर में चालू / कितना डेटा-नुकसान सह्य'],
        ['HA / DR / IOPS', 'High Availability / Disaster Recovery / Input-Output Operations Per Second', 'उच्च उपलब्धता / आपदा पुनर्प्राप्ति / प्रति सेकंड IO क्रियाएँ', 'लगातार चालू / बड़े हादसे से वापसी / storage गति का माप'],
        ['AI / ML / DL', 'Artificial Intelligence / Machine Learning / Deep Learning', 'कृत्रिम बुद्धिमत्ता / यंत्र अधिगम / गहन अधिगम', 'बड़ा घेरा / डेटा से सीखना / गहरी neural network'],
        ['GenAI / LLM', 'Generative AI / Large Language Model', 'जननात्मक AI / विशाल भाषा प्रतिरूप', 'नई सामग्री बनाना / पाठ का विशाल मॉडल'],
        ['AGI / ANI / ASI', 'Artificial General / Narrow / Super Intelligence', 'सामान्य / संकीर्ण / अति बुद्धिमत्ता', 'मनुष्य-समक्ष (अभी नहीं) / एक काम (आज का सच) / मनुष्य से आगे (कल्पना)'],
        ['NN / ANN / CNN / RNN', 'Neural Network / Artificial NN / Convolutional NN / Recurrent NN', 'तंत्रिका जाल के प्रकार', 'मूल ढाँचा / कृत्रिम / तस्वीर के लिए / क्रम-डेटा के लिए'],
        ['LSTM / GAN', 'Long Short-Term Memory / Generative Adversarial Network', 'दीर्घ-लघु स्मृति / जननात्मक प्रतिद्वंद्वी जाल', 'लंबा क्रम याद रखना / दो जालों की होड़ से नमूना बनाना'],
        ['NLP / NLU / NLG / CV', 'Natural Language Processing / Understanding / Generation / Computer Vision', 'प्राकृतिक भाषा प्रक्रमण / समझ / जनन / कंप्यूटर दृष्टि', 'भाषा का काम / अर्थ निकालना / पाठ बनाना / तस्वीर समझना'],
        ['RL / RLHF / SFT / LoRA', 'Reinforcement Learning / RL from Human Feedback / Supervised Fine-Tuning / Low-Rank Adaptation', 'पुनर्बलन अधिगम / मानव-प्रतिक्रिया से RL / पर्यवेक्षित सूक्ष्म-समायोजन / निम्न-कोटि अनुकूलन', 'पुरस्कार से सीखना / संरेखण / आगे प्रशिक्षण / सस्ता fine-tune'],
        ['RAG / GPU / TPU', 'Retrieval-Augmented Generation / Graphics / Tensor Processing Unit', 'पुनर्प्राप्ति-संवर्धित जनन / ग्राफ़िक्स / टेन्सर इकाई', 'दस्तावेज़ खोजकर उत्तर / समानांतर गणना-चिप'],
        ['FLOPS / TOPS', 'Floating Point Operations Per Second / Tera Operations Per Second', 'प्रति सेकंड फ़्लोटिंग-पॉइंट संक्रियाएँ / टेरा संक्रियाएँ', 'वैज्ञानिक गणना-क्षमता / AI चिप की क्षमता'],
        ['IoT / IIoT / M2M', 'Internet of Things / Industrial IoT / Machine to Machine', 'वस्तुओं का इंटरनेट / औद्योगिक IoT / मशीन-से-मशीन', 'जुड़ी चीज़ें / कारख़ाने में / स्वचालित संवाद'],
        ['LoRa / LoRaWAN / NB-IoT', 'Long Range / LoRa Wide Area Network / Narrowband IoT', 'दीर्घ पल्ला / LoRa विस्तृत जाल / संकीर्णपट्टी IoT', 'कई किमी, कम बिजली, बहुत कम डेटा'],
        ['AR / VR / MR / XR', 'Augmented / Virtual / Mixed / Extended Reality', 'संवर्धित / आभासी / मिश्रित / विस्तारित वास्तविकता', 'असली+परत / पूरा आभासी / आभासी-असली क्रिया / छाता-शब्द'],
        ['HMD / HUD / FOV / 6DoF', 'Head Mounted Display / Head-Up Display / Field of View / Six Degrees of Freedom', 'सिर-माउंट display / सामने projection / दृश्य-क्षेत्र / छह स्वतंत्रता-अंश', 'headset / वाहन-स्क्रीन / कितना दिखे / तीन स्थान + तीन घूर्णन'],
        ['eMBB / URLLC / mMTC', 'enhanced Mobile Broadband / Ultra-Reliable Low-Latency Communications / massive Machine Type Communications', 'वर्धित मोबाइल broadband / अति-विश्वसनीय न्यून-विलंब / विशाल मशीन-संचार', '5G के तीन उपयोग-रूप'],
        ['LTE / NR', 'Long Term Evolution / New Radio', 'दीर्घकालिक विकास / नया रेडियो', '4G का मानक / 5G का रेडियो'],
        ['PoW / PoS / PoA', 'Proof of Work / Stake / Authority', 'कार्य / हिस्सेदारी / प्राधिकरण प्रमाण', 'सहमति की तीन विधियाँ'],
        ['DApp / DeFi / NFT / DAO', 'Decentralized Application / Decentralized Finance / Non-Fungible Token / Decentralized Autonomous Organization', 'विकेंद्री ऐप / वित्त / अद्वितीय टोकन / स्वायत्त संगठन', 'blockchain पर बने अनुप्रयोग'],
        ['KYC / AML', 'Know Your Customer / Anti-Money Laundering', 'अपने ग्राहक को जानो / धन-शोधन रोधी', 'पहचान सत्यापन / अवैध धन रोकना'],
        ['PQC / qubit', 'Post-Quantum Cryptography / Quantum bit', 'quantum-पश्चात cryptography / quantum बिट', 'quantum-रोधी encryption / superposition वाली इकाई'],
        ['ROS / SLAM / DOF', 'Robot Operating System / Simultaneous Localization and Mapping / Degrees of Freedom', 'रोबोट प्रचालन तंत्र / एक साथ स्थानीकरण व मानचित्रण / स्वतंत्रता-अंश', 'रोबोट का मंच / चलते हुए नक्शा बनाना / कितनी दिशाओं में हिले'],
        ['CAD / CAM / CAE / CNC', 'Computer Aided Design / Manufacturing / Engineering / Computer Numerical Control', 'कंप्यूटर सहायित अभिकल्पना / विनिर्माण / अभियांत्रिकी / संख्यात्मक नियंत्रण', 'नक्शा बनाना / उत्पादन / विश्लेषण / मशीन को कोड से चलाना'],
        ['FDM / SLA / SLS', 'Fused Deposition Modeling / Stereolithography / Selective Laser Sintering', 'गलित निक्षेपण प्रतिरूपण / त्रिविम मुद्रणशिला / चयनात्मक लेज़र सिन्टरन', '3D printing की तीन विधियाँ'],
        ['PLM', 'Product Lifecycle Management', 'उत्पाद जीवन-चक्र प्रबंधन', 'विचार से सेवानिवृत्ति तक का प्रबंधन']
      ] },

    { type: 'html', html: '<h3>3.10 इकाई, माप व गणना</h3><p>bit से Exabyte तक, Hz से GHz तक, और तापमान/बिजली की इकाइयाँ। द्विआधारी (KiB) व SI (KB) का अंतर यहाँ स्पष्ट है।</p>' },
    { type: 'table',
      head: ['इकाई', 'पूरा नाम / अर्थ', 'मान', 'ध्यान रखें'],
      rows: [
        ['bit', 'binary digit', '0 या 1', 'सबसे छोटी इकाई; छोटा b'],
        ['byte / B', '8 bit', '8 bit', 'बड़ा B; एक ASCII वर्ण'],
        ['nibble', 'आधा byte', '4 bit', 'एक hexadecimal अंक'],
        ['KB / KiB', 'Kilobyte / Kibibyte', '1000 / 1024 byte', 'SI बनाम द्विआधारी — इसी से आकार "कम" दिखता है'],
        ['MB / MiB', 'Megabyte / Mebibyte', '10^6 / 2^20 byte', '1 MiB = 1,048,576 byte'],
        ['GB / GiB', 'Gigabyte / Gibibyte', '10^9 / 2^30 byte', 'डिस्क विक्रेता GB, OS प्रायः GiB दिखाता है'],
        ['TB / TiB', 'Terabyte / Tebibyte', '10^12 / 2^40 byte', 'बड़े भंडारण का माप'],
        ['PB / EB', 'Petabyte / Exabyte', '10^15 / 10^18 byte', 'डेटा-सेंटर का पैमाना'],
        ['Hz / kHz / MHz / GHz', 'Hertz (चक्र प्रति सेकंड)', '10^3 / 10^6 / 10^9', 'CPU घड़ी; अधिक GHz हमेशा अधिक गति नहीं'],
        ['bps / Kbps / Mbps / Gbps', 'bits per second', '10^3 / 10^6 / 10^9 bit/s', 'नेटवर्क गति — छोटा b'],
        ['Bps / KBps / MBps', 'Bytes per second', '8 × संबंधित bits', 'डाउनलोड गति — बड़ा B; 8 Mbps = 1 MBps'],
        ['ms / µs / ns', 'millisecond / microsecond / nanosecond', '10^-3 / 10^-6 / 10^-9 s', 'latency, RAM timing, clock cycle'],
        ['DPI / PPI / LPI', 'Dots / Pixels / Lines Per Inch', 'प्रति इंच', 'प्रिंटर / स्क्रीन / प्रिंट स्क्रीन'],
        ['rpm', 'revolutions per minute', 'प्रति मिनट चक्कर', 'HDD platter, पंखा'],
        ['W / kW', 'Watt / Kilowatt', 'शक्ति', 'PSU क्षमता, बिजली खपत'],
        ['V / A / Ω', 'Volt / Ampere / Ohm', 'वोल्टता / धारा / प्रतिरोध', 'V = I × R (ओम का नियम)'],
        ['mAh / Wh', 'milliampere-hour / Watt-hour', 'आवेश / ऊर्जा', 'battery capacity; Wh = V × Ah'],
        ['nm / µm', 'nanometre / micrometre', '10^-9 / 10^-6 m', 'चिप की प्रक्रिया-नोड, तरंगदैर्ध्य'],
        ['dB / lm / lx', 'decibel / lumen / lux', 'ध्वनि-स्तर / प्रकाश-फ्लक्स / प्रति क्षेत्र प्रकाश', 'शोर / प्रोजेक्टर चमक'],
        ['MTBF / MTTR / AFR', 'Mean Time Between Failures / To Repair / Annualized Failure Rate', 'औसत अंतराल / मरम्मत समय / वार्षिक विफलता दर', 'विश्वसनीयता के माप'],
        ['CL / CAS latency', 'Column Address Strobe latency', 'चक्रों में विलंब', 'RAM की timing — कम बेहतर'],
        ['IOPS', 'Input/Output Operations Per Second', 'प्रति सेकंड IO', 'SSD/डेटाबेस की random गति'],
        ['TBW / DWPD', 'Terabytes Written / Drive Writes Per Day', 'कुल लेखन / प्रति दिन', 'SSD सहनशक्ति व warranty की शर्त'],
        ['°C / K', 'Celsius / Kelvin', 'तापमान', 'K = °C + 273.15; चिप का तापमान °C में']
      ] },

    { type: 'html', html: '<h3>3.11 प्रसिद्ध Port व उनकी सेवाएँ</h3><p>परीक्षा में "port संख्या लिखिए" बार-बार आता है। यह तालिका रटने के लिए नहीं — समूह बनाकर याद रखने के लिए है।</p>' },
    { type: 'table',
      head: ['Port', 'सेवा / प्रोटोकॉल', 'पूरा नाम', 'टिप्पणी'],
      rows: [
        ['20 / 21', 'FTP (data / control)', 'File Transfer Protocol', 'असुरक्षित; SFTP (22) बेहतर'],
        ['22', 'SSH / SFTP / SCP', 'Secure Shell', 'encrypted remote व फ़ाइल transfer'],
        ['23', 'Telnet', 'Teletype Network', 'plaintext — अब त्याज्य'],
        ['25 / 587 / 465', 'SMTP / submission / SMTPS', 'Simple Mail Transfer Protocol', 'डाक भेजना; 587 आधुनिक submission'],
        ['53', 'DNS', 'Domain Name System', 'TCP व UDP दोनों'],
        ['67 / 68', 'DHCP (server / client)', 'Dynamic Host Configuration Protocol', 'UDP'],
        ['69', 'TFTP', 'Trivial File Transfer Protocol', 'बहुत सरल, authentication नहीं — boot/image के लिए'],
        ['80 / 443', 'HTTP / HTTPS', 'HyperText Transfer Protocol (Secure)', 'वेब; 443 पर TLS'],
        ['110 / 995', 'POP3 / POP3S', 'Post Office Protocol v3', 'डाक लाना; 995 सुरक्षित'],
        ['123', 'NTP', 'Network Time Protocol', 'घड़ी मिलाना'],
        ['143 / 993', 'IMAP / IMAPS', 'Internet Message Access Protocol', 'डाक server पर रखकर पढ़ना'],
        ['161 / 162', 'SNMP / trap', 'Simple Network Management Protocol', 'उपकरण-निगरानी'],
        ['389 / 636', 'LDAP / LDAPS', 'Lightweight Directory Access Protocol', 'निर्देशिका; 636 सुरक्षित'],
        ['445', 'SMB / CIFS', 'Server Message Block', 'Windows फ़ाइल-साझा; पुराने संस्करण जोखिम भरे'],
        ['1433 / 1521', 'MS SQL / Oracle', 'डेटाबेस सेवाएँ', 'इंटरनेट पर सीधे न खोलें'],
        ['3306 / 5432', 'MySQL / PostgreSQL', 'डेटाबेस सेवाएँ', 'localhost या निजी जाल तक सीमित रखें'],
        ['3389', 'RDP', 'Remote Desktop Protocol', 'Windows GUI remote; इंटरनेट पर सीधे न खोलें'],
        ['5900+', 'VNC', 'Virtual Network Computing', '5900, 5901…; SSH tunnel में चलाएँ'],
        ['5985 / 5986', 'WinRM (HTTP / HTTPS)', 'Windows Remote Management', 'PowerShell Remoting'],
        ['6379 / 27017', 'Redis / MongoDB', 'in-memory store / दस्तावेज़ DB', 'प्रमाणीकरण के बिना कभी न खोलें'],
        ['8080 / 8443', 'HTTP / HTTPS वैकल्पिक', 'development server', 'लैब व प्रॉक्सी में आम'],
        ['8883', 'MQTT over TLS', 'Message Queuing Telemetry Transport', 'IoT का सुरक्षित port; 1883 असुरक्षित']
      ] },

    { type: 'html', html: '<h3>3.12 एक जैसे दिखने वाले, पर अलग — सावधानी</h3><p>कई संक्षेप एक ही अक्षरों के होते हुए भी बिलकुल अलग चीज़ें हैं। प्रश्न में <b>प्रसंग (context)</b> पढ़कर अर्थ तय करें। नीचे की तालिका वही भ्रम मिटाती है — यह परीक्षा में "अंतर बताइए" का तैयार उत्तर भी है।</p>' },

    { type: 'table',
      head: ['संक्षेप', 'अर्थ 1', 'अर्थ 2', 'पहचान कैसे'],
      rows: [
        ['WAF', 'Web Application Firewall (सुरक्षा)', 'Write Amplification Factor (SSD)', 'बात network/हमले की हो तो firewall; SSD/TBW की हो तो गुणक'],
        ['SOC', 'Security Operations Center (सुरक्षा कक्ष)', 'System on Chip (मोबाइल चिप)', 'टीम/निगरानी की बात हो तो केंद्र; प्रोसेसर की हो तो चिप'],
        ['APT', 'Advanced Persistent Threat (हमला)', 'Advanced Package Tool (Debian/Ubuntu)', 'खतरे की बात हो तो हमला; apt install की हो तो पैकेज मैनेजर'],
        ['PAN', 'Personal Area Network (कुछ मीटर का जाल)', 'Permanent Account Number (भारतीय कर पहचान)', 'नेटवर्किंग में जाल; कर/बैंक में पहचान-संख्या'],
        ['SLA', 'Service Level Agreement (सेवा-स्तर समझौता)', 'Stereolithography (3D printing विधि)', 'क्लाउड/अनुबंध में समझौता; 3D printer में मुद्रण-विधि'],
        ['MR', 'Mixed Reality (मिश्रित वास्तविकता)', 'Merge Request (Git में बदलाव-प्रस्ताव)', 'AR/VR के साथ हो तो वास्तविकता; Git की हो तो प्रस्ताव'],
        ['BOM', 'Byte Order Mark (encoding संकेत)', 'Browser Object Model (वेब) / Bill of Materials (पुर्ज़ा-सूची)', 'फ़ाइल-encoding में चिह्न; JavaScript में window-पेड़; उत्पादन में सूची'],
        ['AI', 'Artificial Intelligence (कृत्रिम बुद्धिमत्ता)', 'Adobe Illustrator (.ai फ़ाइल)', 'तकनीक की बात हो तो बुद्धिमत्ता; फ़ाइल-एक्सटेंशन हो तो चित्र-सॉफ़्टवेयर'],
        ['ISO', 'International Organization for Standardization', 'ISO 9660 disc image (.iso)', 'मानक की बात हो तो संस्था; फ़ाइल हो तो डिस्क-नकल'],
        ['IR', 'Intermediate Representation (compiler)', 'Incident Response (सुरक्षा घटना-प्रतिक्रिया)', 'कोड-निर्माण में बीच-रूप; हमले के बाद प्रतिक्रिया'],
        ['MVP', 'Minimum Viable Product (न्यूनतम उपयोगी उत्पाद)', 'Model View Presenter (कोड-ढाँचा)', 'उत्पाद-रणनीति में पहला; software architecture में दूसरा'],
        ['EOL', 'End Of Line (पंक्ति-अंत)', 'End Of Life (उत्पाद-समर्थन समाप्त)', 'CRLF/LF की बात हो तो पंक्ति; अपडेट बंद होने की हो तो जीवन-अंत'],
        ['CLI / CL', 'Command Line Interface', 'CAS Latency (RAM timing)', 'कमांड की बात हो तो interface; RAM की हो तो विलंब'],
        ['VDI', 'Virtual Disk Image (फ़ाइल)', 'Virtual Desktop Infrastructure (दूरस्थ डेस्कटॉप)', 'VirtualBox की फ़ाइल हो तो पहला; enterprise desktop हो तो दूसरा'],
        ['MAC', 'Media Access Control (भौतिक पता)', 'Message Authentication Code (cryptographic)', 'नेटवर्क/NIC में पता; HMAC/security में प्रमाणीकरण कोड']
      ] },

    { type: 'html', html: '<h3>3.13 कठिन पारिभाषिक शब्द — सरल हिंदी में</h3><p>नीचे वे शब्द हैं जो पूरा नाम होने के बाद भी उलझे रहते हैं। हर शब्द का एक-पंक्ति अर्थ और एक रोज़मर्रा का उदाहरण दिया है — इन्हें बोलकर समझाने का अभ्यास करें।</p>' },

    { type: 'table',
      head: ['शब्द', 'सरल अर्थ', 'रोज़मर्रा का उदाहरण'],
      rows: [
        ['Abstraction (अमूर्तन)', 'अंदर की जटिलता छिपाकर केवल ज़रूरी दिखाना', 'गाड़ी का steering घुमाओ — अंदर का तंत्र जानना ज़रूरी नहीं'],
        ['Encapsulation (संपुटन)', 'डेटा व उसके काम को एक डिब्बे में बाँधना', 'class के भीतर private field, बाहर से केवल method'],
        ['Latency (विलंब)', 'भेजने से पहुँचने तक का समय', 'बटन दबाया और असर दिखने में लगी देर'],
        ['Throughput (प्रवाह-दर)', 'प्रति इकाई समय में सचमुच कितना काम हुआ', 'घंटे में कितनी फ़ाइलें प्रोसेस हुईं'],
        ['Bottleneck (अड़चन)', 'वह सबसे धीमा भाग जो पूरे तंत्र की गति तय करे', 'तेज़ CPU पर HDD — डिस्क ही अड़चन'],
        ['Overhead (अतिरिक्त बोझ)', 'काम के अलावा लगा अतिरिक्त श्रम/समय', 'हर packet के साथ जाने वाला header'],
        ['Scalability (मापनीयता)', 'बोझ बढ़ने पर सँभालने की क्षमता', 'दस से दस हज़ार उपयोगकर्ता तक चलना'],
        ['Redundancy (अतिरिक्तता)', 'एक से अधिक प्रति/रास्ता रखना', 'RAID 1, दो पावर सप्लाई, backup link'],
        ['Idempotent (एकसमान-परिणामी)', 'एक ही काम बार-बार करने पर परिणाम न बदले', 'HTTP GET, या "पहले से मौजूद हो तो कुछ न करो"'],
        ['Deterministic (निर्धारित)', 'वही input → हमेशा वही output', 'शुद्ध गणितीय function'],
        ['Volatile / Non-volatile', 'बिजली जाने पर मिटे / बना रहे', 'RAM बनाम SSD'],
        ['Synchronous / Asynchronous', 'क्रम से, प्रतीक्षा करके / बिना रोके, बाद में सूचना', 'फ़ोन कॉल बनाम WhatsApp संदेश'],
        ['Stateless / Stateful', 'पुरानी बात याद न रखे / याद रखे', 'HTTP stateless; login session stateful'],
        ['Schema (रूपरेखा)', 'डेटा का ढाँचा — कौन-सा खाना, किस प्रकार का', 'table के column व उनका प्रकार'],
        ['Index (अनुक्रमणिका)', 'ढूँढ़ने के लिए बनाया गया shortcut-नक्शा', 'पुस्तक की विषय-सूची; DB index'],
        ['Cache (संग्रह-स्मृति)', 'बार-बार चाहिए वही चीज़ पास रखना', 'browser cache, CPU L1/L2/L3'],
        ['Buffer (अवरोधक)', 'दो अलग गति वालों के बीच अस्थायी ठहराव', 'वीडियो buffering, printer spool'],
        ['Daemon / Service', 'पृष्ठभूमि में लगातार चलने वाला प्रोग्राम', 'Linux में sshd, Windows में Spooler'],
        ['Kernel (गूदा)', 'OS का सबसे भीतरी भाग — hardware से सीधा संवाद', 'Linux kernel, Windows NT kernel'],
        ['Shell (आवरण)', 'kernel के ऊपर उपयोगकर्ता का दुभाषिया', 'bash, PowerShell, cmd'],
        ['Firmware', 'हार्डवेयर में जड़ा स्थायी कोड', 'BIOS/UEFI, SSD firmware, router firmware'],
        ['Driver (चालक)', 'OS को एक उपकरण चलाना सिखाने वाला कोड', 'printer driver, GPU driver'],
        ['Sandbox (बालू-कक्ष)', 'अलग, सीमित वातावरण जहाँ से बाहर नुकसान न हो', 'VM, browser का renderer process'],
        ['Virtualization (आभासीकरण)', 'एक भौतिक संसाधन को कई आभासी रूपों में बाँटना', 'एक server पर कई VM'],
        ['Provisioning (प्रावधान)', 'संसाधन तैयार करके सौंपना', 'नया VM बनाना, खाता खोलना'],
        ['Orchestration (समन्वयन)', 'कई स्वचालित कामों को क्रम में कराना', 'Kubernetes, CI/CD pipeline'],
        ['Telemetry (दूरमिति)', 'दूर से स्वचालित माप-संग्रह', 'ऐप का crash-report, sensor का डेटा'],
        ['Hash (सार)', 'डेटा का अद्वितीय छोटा fingerprint', 'SHA-256 से फ़ाइल की अखंडता जाँचना'],
        ['Salt (लवण)', 'hash से पहले जोड़ा गया यादृच्छिक टुकड़ा', 'एक जैसे पासवर्ड के अलग-अलग hash'],
        ['Nonce', 'केवल एक बार उपयोग होने वाली संख्या', 'cryptographic protocol में दोहराव रोकना'],
        ['Entropy (एन्ट्रॉपी)', 'यादृच्छिकता की मात्रा', 'मज़बूत पासवर्ड/कुंजी के लिए ऊँची entropy'],
        ['Zero-knowledge (शून्य-ज्ञान)', 'सेवा को आपका गुप्त मान पता ही न हो', 'पासवर्ड मैनेजर का vault'],
        ['Air-gapped (वायु-अंतरित)', 'नेटवर्क से पूरी तरह कटा हुआ', 'सबसे संवेदनशील backup'],
        ['Immutable (अपरिवर्तनीय)', 'एक बार बना तो बदला न जा सके', 'immutable backup, container image'],
        ['Rollback (पश्चगमन)', 'पुरानी ज्ञात-अच्छी स्थिति पर लौटना', 'snapshot, Git revert, DB rollback']
      ] },

    { type: 'html', html: '<h3>3.14 सात दिन की योजना — सौ संक्षेप पक्के</h3><p>पूरा शब्दकोश एक बैठक में याद नहीं होता। नीचे दिया क्रम रोज़ थोड़ा-थोड़ा जोड़ता है और हर दिन पिछला दोहराता है, इसलिए भूलने की गति कम हो जाती है।</p>' },

    { type: 'steps', title: 'सौ संक्षेप एक सप्ताह में — याद रखने की योजना',
      items: [
        { n: '1', title: 'दिन 1 — परिवार पहचानो', text: 'पहले वे समूह छाँटें जिनका अंत एक जैसा है — "…Area Network" (LAN/WAN/MAN/PAN/VLAN/WLAN), "…Protocol" (TCP/UDP/HTTP/FTP/SMTP), "…as a Service" (IaaS/PaaS/SaaS/FaaS)।', tips: ['एक परिवार = एक कार्ड; केवल पहला शब्द बदलता है'] },
        { n: '2', title: 'दिन 2 — अक्षर-गिनती', text: 'हर संक्षेप के अक्षर गिनें और उतने ही शब्द लिखें। जहाँ गिनती न मिले, वहाँ ध्यान दें — जैसे HTML में HyperText एक शब्द है, POP3 में 3 संस्करण है।', tips: ['SMTP = 4 अक्षर = Simple Mail Transfer Protocol'] },
        { n: '3', title: 'दिन 3 — काम से नाम', text: 'हर संक्षेप का काम एक पंक्ति में बोलें, फिर उस काम से नाम तक पहुँचें। DHCP "पता बाँटता" है → Dynamic Host Configuration Protocol।', tips: ['जो काम समझ आ गया, उसका नाम भूलना कठिन है'] },
        { n: '4', title: 'दिन 4 — port व इकाई', text: 'port-सूची और इकाई-तालिका अलग कार्ड पर लिखें। bit/byte, KB/KiB, Mbps/MBps का अंतर रोज़ बोलें।', tips: ['8 Mbps = 1 MBps — यह एक अंक का प्रश्न है'] },
        { n: '5', title: 'दिन 5 — भ्रम-जोड़े', text: '"एक जैसे दिखने वाले" तालिका के पंद्रह जोड़े पढ़ें और हर एक के लिए प्रसंग पहचानने का वाक्य बनाएँ।', tips: ['WAF, SOC, APT, PAN, SLA, MR, BOM, AI — आठ सबसे आम'] },
        { n: '6', title: 'दिन 6 — स्वयं की परीक्षा', text: 'बिना देखे पचास संक्षेप के पूरे नाम कागज़ पर लिखें; फिर मिलाएँ। जो छूटा, उसे लाल चिह्नित करें।', tips: ['जो लिखते समय अटका, वही असली कमज़ोरी है'] },
        { n: '7', title: 'दिन 7 — केवल लाल वाले', text: 'पिछले दिन चिह्नित किए शब्द दोहराएँ और नीचे का क्विज़ दें। सात दिन बाद फिर एक हल्की पुनरावृत्ति करें।', tips: ['spaced repetition — दिन 1, दिन 3, दिन 7 सबसे प्रभावी'] }
      ] },

    { type: 'html', html: '<h3>3.15 स्वयं जाँच — 20 प्रश्न</h3><p>बिना ऊपर की तालिकाएँ देखे उत्तर दें। हर प्रश्न के बाद स्पष्टीकरण खुलता है — गलत उत्तर वाले संक्षेप को कापी में अलग लिखें और अगले दिन दोबारा पूछें।</p>' },

    { type: 'quiz', store: 'sw-glossary', items: [
      { q: 'CPU का पूरा नाम?', o: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility'], a: 1, ex: 'Central Processing Unit — केंद्रीय प्रक्रमण इकाई। ALU व CU इसके दो मुख्य भाग हैं।' },
      { q: 'RAM का पूरा नाम?', o: ['Read Access Memory', 'Random Access Memory', 'Rapid Access Module', 'Read Only Memory'], a: 1, ex: 'Random Access Memory — किसी भी स्थान से समान समय में पहुँच। Read Only Memory = ROM।' },
      { q: 'HTTP का पूरा नाम?', o: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Transmission Process', 'Home Tool Transfer Protocol'], a: 0, ex: 'HyperText Transfer Protocol। HTTPS = HTTP Secure (TLS के साथ), port 443।' },
      { q: 'DNS का पूरा नाम और काम?', o: ['Digital Name Service — फ़ाइल सहेजना', 'Domain Name System — नाम को IP में बदलना', 'Dynamic Network Server — पता बाँटना', 'Data Node System — डेटा रखना'], a: 1, ex: 'Domain Name System — इंटरनेट की फ़ोन-बुक, port 53। पता बाँटना DHCP का काम है।' },
      { q: 'SMTP का पूरा नाम?', o: ['Simple Mail Transfer Protocol', 'Secure Message Transfer Process', 'System Mail Transport Protocol', 'Simple Memory Transfer Protocol'], a: 0, ex: 'Simple Mail Transfer Protocol — डाक भेजने का प्रोटोकॉल (25/587/465)। लाने के लिए POP3/IMAP।' },
      { q: 'USB का पूरा नाम?', o: ['Universal Serial Bus', 'Unified System Bus', 'Universal System Backup', 'Unique Serial Bridge'], a: 0, ex: 'Universal Serial Bus — बाहरी उपकरण जोड़ने का मानक; डेटा के साथ बिजली भी देता है।' },
      { q: 'BIOS का पूरा नाम?', o: ['Basic Input Output System', 'Binary Input Output Service', 'Basic Internal Operating System', 'Boot Input Output Standard'], a: 0, ex: 'Basic Input Output System। आधुनिक रूप UEFI = Unified Extensible Firmware Interface।' },
      { q: 'SSD का पूरा नाम?', o: ['Solid State Drive', 'Super Speed Disk', 'Static Storage Device', 'Serial State Disk'], a: 0, ex: 'Solid State Drive — NAND flash पर भंडारण, कोई घूमने वाला भाग नहीं। HDD = Hard Disk Drive।' },
      { q: 'PDF का पूरा नाम?', o: ['Portable Document Format', 'Printable Data File', 'Public Document Form', 'Personal Digital Format'], a: 0, ex: 'Portable Document Format — हर मशीन पर एक जैसा दिखने वाला पृष्ठ-आधारित प्रारूप।' },
      { q: 'JSON का पूरा नाम?', o: ['JavaScript Object Notation', 'Java Source Object Network', 'Joint Standard Object Notation', 'JavaScript Ordered Nodes'], a: 0, ex: 'JavaScript Object Notation — हल्का डेटा-विनिमय प्रारूप; key-value व array।' },
      { q: 'SQL का पूरा नाम?', o: ['Structured Query Language', 'Simple Question Language', 'System Query Logic', 'Standard Quality Language'], a: 0, ex: 'Structured Query Language — संबंधपरक डेटाबेस से पूछने/बदलने की भाषा। NoSQL = Not Only SQL।' },
      { q: 'IoT का पूरा नाम?', o: ['Internet of Things', 'Input Output Terminal', 'Integrated Online Technology', 'Internet of Tools'], a: 0, ex: 'Internet of Things — sensor व network जुड़ी रोज़मर्रा की चीज़ें। IIoT = Industrial IoT।' },
      { q: 'AI का पूरा नाम?', o: ['Automated Intelligence', 'Artificial Intelligence', 'Advanced Integration', 'Applied Informatics'], a: 1, ex: 'Artificial Intelligence — कृत्रिम बुद्धिमत्ता। ML = Machine Learning, DL = Deep Learning इसके उपसमुच्चय।' },
      { q: 'LLM का पूरा नाम?', o: ['Large Language Model', 'Linear Logic Machine', 'Local Learning Module', 'Long Latency Memory'], a: 0, ex: 'Large Language Model — विशाल भाषा प्रतिरूप; अगला token चुनकर पाठ बनाता है।' },
      { q: 'SaaS का पूरा नाम?', o: ['Storage as a Service', 'Software as a Service', 'System as a Service', 'Security as a Service'], a: 1, ex: 'Software as a Service — पूरा ऐप प्रदाता चलाता है (Microsoft 365, Google Workspace)।' },
      { q: 'VPN का पूरा नाम?', o: ['Virtual Private Network', 'Verified Public Node', 'Virtual Protocol Network', 'Visual Private Node'], a: 0, ex: 'Virtual Private Network — सार्वजनिक जाल पर encrypted सुरंग।' },
      { q: 'MFA का पूरा नाम?', o: ['Multi File Access', 'Multi-Factor Authentication', 'Managed Firewall Access', 'Multiple Format Authorization'], a: 1, ex: 'Multi-Factor Authentication — पासवर्ड के अतिरिक्त दूसरा कारक (फ़ोन/कुंजी/biometric)।' },
      { q: 'OCR का पूरा नाम?', o: ['Optical Character Recognition', 'Online Code Reader', 'Output Character Rendering', 'Optical Compression Ratio'], a: 0, ex: 'Optical Character Recognition — तस्वीर/स्कैन से पाठ पहचानना। हिंदी के लिए hin भाषा-डेटा चाहिए।' },
      { q: 'RAID का पूरा नाम?', o: ['Redundant Array of Independent Disks', 'Rapid Access Integrated Drive', 'Random Array of Internal Disks', 'Redundant Access of Independent Data'], a: 0, ex: 'Redundant Array of Independent Disks — कई डिस्क को जोड़कर गति/सुरक्षा। RAID बैकअप नहीं है।' },
      { q: '1 KiB कितने byte होते हैं?', o: ['1000', '1024', '100', '8'], a: 1, ex: 'KiB (kibibyte) = 1024 byte (द्विआधारी); KB (kilobyte) = 1000 byte (SI)। 1 byte = 8 bit।' }
    ] },

    { type: 'html', html: '<h3>3.16 परीक्षा की दृष्टि से अंतिम तैयारी</h3>' },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — "पूरा नाम लिखिए" वाले प्रश्न',
      html: 'यह प्रश्न लगभग हर पेपर में आता है और पूरे अंक देता है — बस शर्त है <b>ठीक-ठीक शब्द</b>। तीन सावधानियाँ — (1) <b>शब्द न बदलें</b>: "Random Access Memory" ही लिखें, "Random Accessible Memory" नहीं। (2) <b>अक्षर-क्रम न बिगाड़ें</b>: SMTP = Simple Mail Transfer Protocol, "Simple Transfer Mail Protocol" गलत है। (3) <b>संस्करण-अंक जोड़ें जहाँ हो</b>: POP3, IPv4, WPA3, DDR5 — अंक छोड़ना अपूर्ण उत्तर है। और यदि पूरा नाम याद न आए तो <b>काम लिखकर आंशिक अंक</b> लें — "यह … का प्रोटोकॉल है जो … करता है"। खाली छोड़ने से बेहतर है।' },

    { type: 'html', html: '<h3>3.17 शब्दकोश को अपना बनाना</h3><p>ये तालिकाएँ केवल आरंभ हैं। अपनी लैब में जो नया शब्द मिले — किसी driver का नाम, किसी कमांड का फ़्लैग, किसी त्रुटि-संदेश का कोड — उसे अपनी कापी में <b>चार स्तंभों</b> में जोड़ें: संक्षेप/शब्द, पूरा नाम, हिंदी अर्थ, और <b>वह जगह जहाँ आपने उसे पहली बार देखा</b>। चौथा स्तंभ सबसे ज़रूरी है — प्रसंग से याददाश्त जुड़ती है। महीने में एक बार अपनी सूची को इस पेज से मिलाएँ; जो शब्द यहाँ नहीं है, उसे अनुदेशक से पूछकर जोड़ें। इस तरह यह शब्दकोश आपकी अपनी लैब-डायरी बन जाएगा।</p>' },

    { type: 'pills', items: [
      { text: 'जितने अक्षर, उतने शब्द — SMTP = 4', kind: 'tip' },
      { text: 'परिवार से याद करो: …Area Network, …Protocol, …as a Service', kind: 'info' },
      { text: 'POP3 / IPv4 / WPA3 — अंक मत छोड़ो', kind: 'warn' },
      { text: '8 Mbps = 1 MBps (bit बनाम byte)', kind: 'warn' },
      { text: 'WAF · SOC · APT · PAN · SLA — प्रसंग से अर्थ तय करो', kind: 'danger' },
      { text: 'KiB = 1024, KB = 1000', kind: 'info' },
      { text: 'port 22 SSH · 53 DNS · 80 HTTP · 443 HTTPS · 3389 RDP', kind: 'ok' },
      { text: 'नाम याद न आए तो काम लिखकर आंशिक अंक लो', kind: 'tip' }
    ] }

  ]
},
]);
