
/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-win2.js   (विंडोज़ मास्टरक्लास — भाग 2)
   विषय : win-admin · win-cli · win-install
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   विंडोज़ प्रशासन (Administration)
   =================================================================== */
{
  id: 'win-admin', icon: '🛡️', group: 'विंडोज़ मास्टरक्लास',
  title: 'विंडोज़ प्रशासन (Administration)',
  sub: 'यूज़र, NTFS परमिशन, सर्विसेज़, Registry, Group Policy, डिस्क व बैकअप',
  kicker: 'Windows Masterclass 3 · Administration & Maintenance',
  hero: 'यह अध्याय वह काम सिखाता है जो सर्विस सेंटर में रोज़ पड़ता है — यूज़र बनाना/सुधारना, <b>“Access is denied”</b> हल करना, ड्राइवर कोड 43 से निकलना, डिस्क 100% बंद करना, परमिशन छीनकर फ़ोल्डर वापस पाना, और डिस्क/बैकअप की सेहत ठीक रखना।',
  tags: ['यूज़र व प्रोफ़ाइल', 'NTFS परमिशन', 'सर्विसेज़ व ड्राइवर', 'Registry व Group Policy', 'डिस्क व बैकअप'],
  blocks: [
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.1</span> यूज़र अकाउंट का मॉडल — कौन क्या कर सकता है</h3>
      <p>Windows में हर चीज़ एक <b>सिक्योरिटी Principal</b> (यूज़र या समूह) के अकाउंट से चलती है और उसी के <b>SID</b> से परमिशन जुड़ते हैं — डिसप्ले नाम से नहीं। इसीलिए नाम बदलने पर परमिशन नहीं टूटते, पर यूज़र हटाकर वही नाम का नया यूज़र बनाने पर पुरानी फ़ाइलों का एक्सेस नहीं मिलता (नया SID बन जाता है)।</p>
      <ul>
        <li><b>Administrator (एडमिन/विशेषज्ञ):</b> सॉफ़्टवेयर इंस्टॉल, सर्विस/Registry/फ़ायरवॉल बदलना, दूसरों के फ़ोल्डर देखना, बैकअप-रिस्टोर — सब कुछ। रोज़ के काम के लिए यह ख़तरनाक है, क्योंकि यूरिसप्रुडेंट (malware) को भी उतने अधिकार मिल जाते हैं।</li>
        <li><b>Standard User (मानक):</b> अपना प्रोफ़ाइल, Documents, सेटिंग्स बदल सकता है; Program Files, सर्विसेज़ या दूसरे यूज़र को छूने पर UAC क्रेडेंशियल माँगेगा। दुकान/लैब के बच्चों और ग्राहक-मशीन के लिए यही सही है।</li>
        <li><b>Guest:</b> Windows 10/11 के नए इंस्टॉल में यह बिल्ट-इन अकाउंट डिफ़ॉल्ट से डिसएबल्ड रहता है; पासवर्ड-रहित अस्थायी एक्सेस के लिए — घरेलू/छोटी दुकान पर इसे चालू न करें।</li>
        <li><b>बिल्ट-इन Administrator:</b> यही सबसे ऊँचा अकाउंट है (UAC से नहीं झुकता)। डिफ़ॉल्ट डिसएबल्ड; केवल तभी चालू करें जब लॉगिन टूट गया हो और कोई रास्ता न बचे। चालू करने के लिए <code>net user Administrator /active:yes</code> — और काम ख़त्म होते ही <code>/active:no</code>। <b>नेटवर्क से (share/RDP) इसे लॉगिन न दें</b> — यही सबसे ज़्यादा ब्रूट-फ़ोर्स का शिकार अकाउंट है।</li>
        <li><b>स्थानीय बनाम Microsoft अकाउंट:</b> स्थानीय (local) सिर्फ़ उसी PC पर, डेटा कहीं नहीं जाता; Microsoft अकाउंट में ईमेल+पासवर्ड से लॉगिन, OneDrive/Store/Cortana/सिंक और PIN माँगता है, और इंटरनेट न हो तो पुराना पासवर्ड/PIN चाहिए। सर्विस हब में ग्राहक की मशीन पर MSA ज़बरदस्ती मत थोपिए — पहले पूछिए।</li>
      </ul>
      <div class="callout info"><b class="ct">समूह (Groups) ही असली नियंत्रण हैं</b><p>यूज़र को अधिकार सीधे नहीं, समूह के ज़रिए दें: <b>Administrators</b> (पूरा नियंत्रण), <b>Power Users</b> (पुराना, Windows 10/11 में लगभग निष्क्रिय), <b>Users</b> (डिफ़ॉल्ट), <b>Guests</b>, <b>Backup Operators</b> (बैकअप ले सकते हैं, परमिशन नहीं बदल सकते), <b>Remote Desktop Users</b>, <b>Network Configuration Operators</b>।</p></div>` },

    { type: 'table', head: ['अकाउंट प्रकार', 'क्या-क्या कर सकता है', 'कब रखें / क्या सावधानी'],
      rows: [
        ['Built-in Administrator', 'सब कुछ, UAC प्रॉम्प्ट के बिना; SeTakeOwnershipPrivilege आदि सभी अधिकार', 'डिफ़ॉल्ट डिसएबल्ड रहने दें; केवल बूट/अकाउंट-रिकवरी के लिए अस्थायी रूप से चालू, फिर /active:no'],
        ['Administrators समूह का सदस्य', 'इंस्टॉल, सर्विस, Registry, फ़ायरवॉल, दूसरों के फ़ोल्डर; elevation पर सिर्फ़ Yes/No (consent)', 'टेक्नीशियन का अपना अकाउंट; रोज़ के ब्राउज़िंग के लिए स्टैंडर्ड अलग रखें'],
        ['Standard User', 'अपनी प्रोफ़ाइल, ऐप चलाना, अपनी सेटिंग्स; सिस्टम बदलने पर एडमिन क्रेडेंशियल माँगेगा', 'बच्चे, लैब बेंच, दुकान का काउंटर PC — यही डिफ़ॉल्ट सुझाव'],
        ['Guest / काउंटर (Kiosk) अकाउंट', 'बहुत सीमित; प्रोफ़ाइल सफ़ाई के साथ', 'सार्वजनिक PC — बेहतर है मैन्युअल Kiosk/Assigned access बनाम Guest चालू करना'],
        ['Microsoft अकाउंट', 'ईमेल से लॉगिन, OneDrive/Store/सेटिंग्स सिंक, PIN/Finger/Windows Hello', 'ग्राहक खुद चाहे तो; पासवर्ड भूलने पर ईमेल OTP से रीसेट होता है'],
        ['स्थानीय अकाउंट', 'सिर्फ़ इसी मशीन, कोई सिंक नहीं, ऑफ़लाइन लॉगिन', 'लैब/दुकान के साझा PC, जहाँ इंटरनेट नहीं या प्राइवेसी चाहिए'],
        ['Service Account (LOCAL SERVICE / NETWORK SERVICE / This account)', 'Windows सेवाएँ इनके नाम चलती हैं, इंटरेक्टिव लॉगिन नहीं', 'सर्विस का लॉगऑन बदलते समय पासवर्ड सही देना ज़रूरी, वरना सेवा 1069 पर फेल']
      ] },

    { type: 'table', head: ['काम', 'सबसे तेज़ तरीक़ा (जैसा टाइप करें)', 'ध्यान रखें'],
      rows: [
        ['नया यूज़र बनाना (GUI)', 'lusrmgr.msc → Users → Right-click → New User', 'Home एडिशन में lusrmgr.msc नहीं खुलता — Settings या net use करें'],
        ['नया यूज़र (कमांड)', 'net user Rahul* /add /fullname:"Rahul Sharma"', '* लगाने से पासवर्ड छिपाकर माँगा जाता है'],
        ['पासवर्ड बदलना/रीसेट', 'net user Rahul Naya@2026', 'एडमिन प्रॉम्प्ट चाहिए; कड़े नियम हों तो 1234 जैसा पासवर्ड अस्वीकृत'],
        ['यूज़र को एडमिन बनाना', 'net localgroup Administrators Rahul /add', 'हटाने के लिए /delete; गलत नाम पर "The member could not be found"'],
        ['यूज़र डिसएबल/एक्टिवेट', 'net user Rahul /active:no', 'डिलीट करने से प्रोफ़ाइल फ़ोल्डर बचा रहता है — पहले डेटा कॉपी करें'],
        ['सभी यूज़र सूची', 'net user  (फिर net user Rahul देखें)', 'Get-LocalUsers PowerShell में: Get-LocalUser'],
        ['लॉगिन पर पासवर्ड हटाना', 'netplwiz → चेकबॉक्स "Users must enter a user name…" → Apply', 'Windows Hello/PIN से जुड़े MSA पर विकल्प न दिखे तो Registry/PIP Policy देखें'],
        ['बिल्ट-इन Administrator चालू/बंद', 'net user Administrator /active:yes', 'काम के बाद ज़रूर /active:no करें'],
        ['प्रोफ़ाइल फ़ोल्डर खोलना', 'Win+R → C:\\Users या sysdm.cpl → Advanced → User Profiles → Settings', 'User Properties से लोकेशन मूव करना पुराने ऐप्स में टूटन ला सकता है'],
        ['प्रोफ़ाइल साइज़ जानना', 'Settings → Accounts → Storage (Temporary files / Show more categories)', 'यहाँ "Temporary files" और AppData का भार दिखता है; Desktop/Downloads भी माप लें'],
        ['ग्रुप में सदस्यता जाँच', 'net localgroup Administrators', 'localgroup की सूची के लिए net localgroup'],
        ['पुरानी/एक्स्ट्रालॉगिन प्रोफ़ाइल हटाना', 'sysdm.cpl → User Profiles → चुनकर Delete', 'यूज़र का अपना लॉगिन हो तो उसका विकल्प ग्रे रहेगा'],
        ['लॉक/रिसेट अकाउंट लॉकआउट पर', 'अन्य एडमिन से net user, या RE → cmdutil/sticky keys तकनीक', 'ग्राहक के MSA के लिए account.live.com से रीसेट — मशीन फ़ॉर्मैट ज़रूरी नहीं']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.2</span> प्रोफ़ाइल फ़ोल्डर, NTUSER.DAT व “temporary profile”</h3>
      <p>हर यूज़र का सारा निजी डेटा <b>C:\\Users\\&lt;नाम&gt;</b> में रहता है, और उसी फ़ोल्डर की दो छिपी फ़ाइलें उस यूज़र की <b>Registry Hive</b> हैं — <b>NTUSER.DAT</b> (HKCU का डिस्क-रूप) और <b>UsrClass.dat</b> (फ़ाइल टाइप/COM सेटिंग्स)। इनको जान-बूझकर हटाना या एंटीवायरस से स्कैन-टाइम पर लॉक होना = प्रोफ़ाइल टूटना।</p>
      <ul>
        <li><b>Local profile:</b> डिफ़ॉल्ट — सिर्फ़ इसी मशीन पर।</li>
        <li><b>Roaming profile:</b> डोमेन/सर्वर पर सिंक होता है ताकि किसी भी PC पर वही Desktop मिले (घर/छोटी दुकान पर ज़रूरत नहीं)।</li>
        <li><b>Temporary profile:</b> Windows को NTUSER.DAT लोड नहीं हुआ (लॉक/करप्ट/एंटीवायरस/अधूरा अपडेट/गलत फ़ोल्डर नाम) — लॉगिन हो जाता है पर Desktop ख़ाली, सब कुछ ग़ायब। <b>घबराकर फ़ाइलें कॉपी न करें</b> — log off करके 2-3 बार रीस्टार्ट से ठीक होता है; बार-बार हो तो नीचे देखें।</li>
        <li><b>साइज़ का असली बोझ:</b> Desktop और Downloads (ग़लती से सारा भार यहीं), <b>AppData\\Local</b> में ब्राउज़र कैश/अपडेट फ़ोल्डर/टेम्पोरेरी ऐप डेटा, OneDrive का "Always keep on this device"। साफ़ करने से 5–20 GB तक खुलता है।</li>
      </ul>
      <div class="callout warn"><b class="ct">“You've been signed in with a temporary profile” — क्रम से करें</b><p><b>1)</b> लॉग आउट/इन दो बार (फ़ाइल लॉक छूटती है)। <b>2)</b> Safe Mode में जाकर एंटीवायरस/बैकअप सॉफ़्टवेयर अस्थायी बंद करें। <b>3)</b> <code>regedit</code> → <code>HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList</code> में दो-fold SID खोजें — एक के नाम के आगे <code>.bak</code>; <code>ProfileImagePath</code> सही फ़ोल्डर पर सेट करें, Status/RefCount = 0 करके रीस्टार्ट (गलत Hive पर हाथ-फेर ज़रूरत से ज़्यादा जोखिम है)। <b>4)</b> डिस्क एरर हटाने <code>chkdsk C: /scan</code>। <b>5)</b> नए सिरे से ठीक रहे तो उसी नाम का नया लोकल अकाउंट बनाकर पुराने प्रोफ़ाइल से Documents/Desktop/AppData कॉपी करें, फिर पुराना प्रोफ़ाइल sysdm.cpl से डिलीट करें।</p></div>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.3</span> UAC (User Account Control) — चार स्तर और सही उपयोग</h3>
      <p>UAC एडमिन टोकन को दो भागों में बाँटता है — <b>filtered (standard)</b> टोकन से डेस्कटॉप चलता है, और जब कोई ऐप सिस्टम बदलना चाहे तो <b>elevation</b> माँगता है। दो तरह की विंडो दिखती हैं: <b>Consent prompt</b> (हरा/नीला, सिर्फ़ Yes/No — एडमिन खुद लॉगिन है) और <b>Credential prompt</b> (यूज़रनेम+पासवर्ड माँगे — स्टैंडर्ड यूज़र या बिल्ट-इन Administrator नीति के अनुसार)। यह अंतर परीक्षा और दुकान दोनों काम आता है।</p>
      <ul>
        <li><b>बदलने का जगह:</b> Start में "Change User Account Control settings" टाइप करके स्लाइडर (4 स्तर) — या <code>Secpol.msc</code> → Local Policies → Security Options → "User Account Control: …" series, या Registry <code>HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System</code> के <b>EnableLUA</b>, <b>ConsentPromptBehaviorAdmin</b>, <b>ConsentPromptBehaviorUser</b>, <b>PromptOnSecureDesktop</b>।</li>
        <li><b>Secure Desktop:</b> प्रॉम्प्ट के दौरान स्क्रीन मद्धम होती है — यह उसी समय अन्य ऐप को इनपुट रोककर "फ़ोर्जिंग" (खिड़की नक़ल) रोकता है। इसे बंद करना सुरक्षा कमज़ोर करता है।</li>
      </ul>
      <div class="callout danger"><b class="ct">UAC कभी पूरी तरह बंद न करें</b><p>नीचे स्लाइडर पर ले जाने से बिना पूछे कोई भी डाउनलोड किया गया exe <code>HKLM</code>, सर्विसेज़ और फ़ायरवॉल बदल सकता है; साथ ही Store/Calculator/Photos जैसे UWP ऐप और कई इंस्टॉलर सही ढंग से नहीं चलते (Admin Approval Mode बंद होने की स्थिति)। ग्राहक कहे "बार-बार विंडो आती है" — तो UAC बंद करने के बजाय <b>दुकान/लैब के काम के लिए स्टैंडर्ड अकाउंट</b> रखें, विश्वसनीय सॉफ़्टवेयर को एक बार elevate करके सेटिंग्स टिक करें, और ऐडवेयर हटाएँ (बदनुमा UAC पोपअप अक्सर मालवेयर का लक्षण है)।</p></div>` },

    { type: 'table', head: ['स्लाइडर स्तर (ऊपर → नीचे)', 'ऐप सिस्टम बदलना चाहें तो', 'आप Windows सेटिंग बदलें तो', 'संबंधित Policy मान'],
      rows: [
        ['1 — Always Notify (सबसे कड़ा)', 'Secure Desktop (स्क्रीन मद्धम) पर consent', 'यह भी पूछता है', 'ConsentPromptBehaviorAdmin=5, PromptOnSecureDesktop=1'],
        ['2 — Always Notify, केवल ऐप्स के लिए (Windows डिफ़ॉल्ट)', 'Secure Desktop पर consent (Yes/No)', 'नहीं पूछता', 'ConsentPromptBehaviorAdmin=5, PromptOnSecureDesktop=1'],
        ['3 — Notify me only when apps try to change (no dim desktop)', 'Normal desktop पर consent — खिड़की नक़ल (UI spoofing) का ख़तरा बढ़ता है', 'नहीं पूछता', 'ConsentPromptBehaviorAdmin=5, PromptOnSecureDesktop=0'],
        ['4 — Notify me only when <i>I</i> try to change computer settings', 'बिना पूछे elevate हो जाते हैं', 'पूछता है', 'ConsentPromptBehaviorAdmin=0 (elevate without prompting)'],
        ['सबसे नीचे — Never Notify', 'कोई पूछताछ नहीं — UAC व्यावहारिक रूप से निष्क्रिय', 'कोई पूछताछ नहीं', 'यही स्थिति Registry में EnableLUA=0 से आती है; Store/UWP ऐप टूट सकते हैं — अनुशंसित नहीं'],
        ['स्टैंडर्ड यूज़र का प्रॉम्प्ट', 'यूज़रनेम + पासवर्ड माँगेगा (किसी एडमिन का)', 'अपनी सेटिंग्स के लिए नहीं', 'ConsentPromptBehaviorUser=3 (डिफ़ॉल्ट — credentials), 1 (deny), 0 (silently elevate)'],
        ['बिल्ट-इन Administrator के लिए नीति', 'Approve / credentials / silently elevate — नीति तय करती है', '—', 'Secpol → Security Options → "User Account Control: Behavior of the elevation prompt for administrators in Admin Approval Mode"'],
        ['Secure Desktop बंद करने का असर', 'प्रॉम्प्ट के दौरान कोई अन्य ऐप Enter/क्लिक भेज सकता है', '—', 'PromptOnSecureDesktop=0 — कैशियो/दुकान के काउंटर PC पर न करें']
      ] },
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.4</span> NTFS परमिशन — Allow/Deny, inheritance और “Access is denied”</h3>
      <p>NTFS में हर फ़ाइल/फ़ोल्डर का अपना <b>Security Descriptor</b> (ACL) होता है जिसमें <b>ACE</b> (Allow या Deny पंक्तियाँ) होती हैं। यह FAT32/exFAT में नहीं होता — इसलिए पेनड्राइव (FAT32) पर परमिशन सेट करना बेकार है। परमिशन जोड़ते हैं (union of Allows), पर कोई भी <b>Deny</b> हमेशा जीतती है।</p>
      <ul>
        <li><b>कहाँ से:</b> फ़ोल्डर Right-click → Properties → <b>Security</b> टैब → Edit / <b>Advanced</b>। Advanced में <b>Inherited from</b> कॉलम, <b>Disable inheritance</b> (Convert inherited permissions into explicit / Remove), और <b>Effective Access</b> टैब (यूज़र चुनकर "View effective access" — पूछा हुआ असली उत्तर यहीं मिलता है)।</li>
        <li><b>Owner (मालिक):</b> Advanced → <b>Change:</b> — मालिकाना हक़ बिना परमिशन के भी परमिशन बदलने देता है। एडमिन <b>Take ownership</b> अधिकार से खुद को owner बना सकता है — यही पुराने <code>C:\\Users\\purana</code> फ़ोल्डर में घुसने का तरीक़ा है।</li>
        <li><b>Inheritance:</b> फ़ोल्डर की परमिशन बच्चों में नीचे जाती है (This folder, subfolders and files)। फ़ाइल-स्तर की explicit परमिशन inherited पर भारी पड़ती है। <b>Move</b> (एक ही वॉल्यूम के अंदर) परमिशन साथ ले जाता है; <b>Copy</b> या दूसरे वॉल्यूम में move destination की परमिशन लेता है।</li>
        <li><b>"The folder you are deleting is empty or not used" जैसी गड़बड़</b> और <b>TrustedInstaller</b> के फ़ोल्डर (WindowsApps, System Volume Information) — इन्हें लेखक-स्तर पर रोक लगाती है; take ownership से सिस्टम टूट सकता है, इसलिए न छेड़ें।</li>
      </ul>
      <p><b>“Access is denied” की जाँच का क्रम:</b> 1) दूसरे एडमिन अकाउंट से कोशिश (सब फ़ाइलों पर deny = मालिक बदलना ज़रूरी) → 2) Security → Advanced → Effective Access → 3) Owner देखें/बदलें → 4) <code>icacls &lt;path&gt; /reset /t /c /q</code> से inheritance बहाल → 5) फ़ाइल किसी ऐप में लॉक है क्या (Resource Monitor → CPU → Associated Handles) → 6) फ़ाइल नेटवर्क शेयर पर है तो शेयर परमिशन + NTFS दोनों जाँचें → 7) <code>chkdsk C: /scan</code> से फ़ाइल सिस्टम एरर → 8) Third-party "Folder Lock/Privacy" सॉफ़्टवेयर या EFS एन्क्रिप्शन (नाम हरा दिखे तो EFS)।</p>
      <div class="callout tip"><b class="ct">छिपी/सिस्टम फ़ाइलें दिख नहीं रहीं</b><p>Explorer → View → <b>Show → Hidden items</b>, और Options → View → <b>"Hide protected operating system files (Recommended)"</b> का टिक हटाएँ (चेतावनी पर Yes)। साथ ही "Hide extensions for known file types" हटाने से <code>मेरी फ़ाइल.jpg.exe</code> जैसी मालवेयर-चाल दिख जाती है। फ़ाइल Attributes से छुपाएँ: <code>attrib -s -h -r /s /d F:\\*</code> (पेनड्राइव की "छिपी फ़ाइलें वापस लानी" की सबसे आम डिमांड यही है)।</p></div>` },

    { type: 'table', head: ['NTFS परमिशन (लेवल)', 'इसमें शामिल (असल advanced अधिकार)', 'व्यावहारिक मतलब'],
      rows: [
        ['Full control', 'सभी निम्न + Change permissions + Take ownership', 'सब कुछ; सिर्फ़ भरोसेमंद एडमिन/खुद को दें — Share के साथ मिलाकर यह सबसे बड़ा जोखिम'],
        ['Modify', 'Read + Write + Execute + Delete + Delete subfolders and files', 'फ़ाइल बनाना/बदलना/मिटाना; साझा वर्क फ़ोल्डर के लिए सही'],
        ['Read & execute', 'Read + Traverse folder / execute file', 'प्रोग्राम चलाना व फ़ोल्डर में घुसना, बदल नहीं सकते (शेयर में "Reader" इसी पर आधारित)'],
        ['List folder / read data (List folder contents)', 'Folders पर Traverse/List; फ़ाइलों पर Read data', 'नाम देखना + अंदर का कंटेंट पढ़ना'],
        ['Read', 'Read data, Read attributes, Read extended attributes, Read permissions', 'सिर्फ़ पढ़ना; delete/write नहीं'],
        ['Write', 'Create files / write data, Create folders / append data, Write attributes, Write extended attributes', 'नई फ़ाइल बनाना; पर पुरानी पर लिखना/मिटाना Modify में आता है'],
        ['Special permissions', 'बचे हुए अकेले अधिकार — जैसे सिर्फ़ Append data (लॉग फ़ोल्डर), सिर्फ़ Read permissions, सिर्फ़ Take ownership', "Advanced में 'Show advanced permissions' दबाने पर 14 छोटे checkbox दिखते हैं — गिरानी (quota) व ऑडिट यहीं से"],
        ['Object-level (explicit) बनाम Inherited', 'कोई भी डिसएबल टिक = उस एंट्री का उस ऑब्जेक्ट पर प्रभाव ख़त्म (inheritance काटती है, deny नहीं बनती)', 'यही कारण है कि "Remove" के बजाय "Disable" टिक करना सुरक्षित है']
      ] },

    { type: 'table', head: ['नियम / स्थिति', 'परिणाम (Effective)', 'क्यों'],
      rows: [
        ['एक ही यूज़र को Groups से एक Allow Read, एक Deny Write', 'Read + Write deny', 'Deny हमेशा Allow को हराती है (सबसे पहले Deny पढ़ी जाती है)'],
        ['Folder पर Allow Read, उसकी फ़ाइल पर explicit Deny Read', 'फ़ाइल पर access नहीं', 'Object-स्तर की एंट्री inherited से ज़्यादा विशिष्ट (more specific) होती है'],
        ['Share = Full Control, NTFS = Read', 'सिर्फ़ Read', 'नेटवर्क एक्सेस में शेयर और NTFS दोनों जाँचे जाते हैं — सबसे सख़्त (most restrictive) जीतता है'],
        ['Share = Read, NTFS = Full Control', 'सिर्फ़ Read', 'उपरोक्त ही नियम — Share परमिशन NTFS को बढ़ा नहीं सकती'],
        ['Share = Change, NTFS = Modify', 'Modify जैसा (delete तक)', 'दोनों मिलाकर effective बनाम effective, फ़ाइन-ग्रेन नहीं'],
        ['Share पर Everyone = Full, NTFS पर Users = Read', 'Everyone को Read', 'दुकान में यही सबसे आम गड़बड़ है — "Full" टिक करने का मतलब नेटवर्क पर सबको लिखना नहीं'],
        ['बिल्ट-इन Groups: Everyone / Authenticated Users', 'Everyone में Guest/एनॉनिमस भी; Authenticated Users में केवल लॉगिन किए यूज़र', 'सार्वजनिक फ़ोल्डर के लिए Everyone, निजी शेयर के लिए Authenticated Users या Specified users'],
        ['CREATOR OWNER = Modify', 'नई फ़ाइल बनाने वाला उसका मालिक + Modify', 'मल्टी-यूज़र शेयर में "अपनी फ़ाइल ही मिटाए" का साफ़ तरीक़ा'],
        ['FAT32/exFAT वॉल्यूम पर Security टैब नहीं', 'कोई NTFS परमिशन नहीं', 'पेनड्राइव/SD पर परमिशन नहीं — सिर्फ़ Read-only switch/एन्क्रिप्शन'],
        ['PERM (Deny) के बाद भी Explorer में फ़ोल्डर दिख रहा है', 'List/Folder browse.allowed, अंदर deny', 'Browse.folder/Traverse चाहिए तभी नेस्टेड शेयर ठीक दिखते हैं']
      ] },

    { type: 'code', code: String.raw`:: === icacls — NTFS परमिशन कमांड से (एडमिन CMD) ===
icacls D:\Accounts                         :: मौजूदा ACL पढ़कर दिखाएँ
icacls D:\Accounts /grant Rahul:(OI)(CI)M  :: Modify, फ़ोल्डर+सब-फ़ोल्डर में inherited
icacls D:\Accounts /grant Rahul:(RX)       :: सिर्फ़ Read & execute
icacls D:\Accounts /deny Guests:(W)        :: Guests का Write मना (deny जीतती है)
icacls D:\Accounts /remove Rahul           :: उस यूज़र की सारी एंट्री हटाएँ
icacls D:\Accounts /reset /t /c /q         :: सबकी परमिशन पेरेंट से inherited (टूटे ACL की मरम्मत)
icacls D:\Accounts /save D:\acl-backup.txt :: बैकअप — रिस्टोर पहले, बदलाव बाद में
icacls D:\Accounts /restore D:\acl-backup.txt
icacls D:\Accounts /setowner Administrators /t /c   :: मालिक बदलें (take ownership से बेहतर)
icacls "C:\Users\PuranaUser" /grant Administrator:(OI)(CI)F /t /c  :: पुरानी प्रोफ़ाइल में घुसना

:: === मालिकाना हक़ (owner) — जब Advanced में Change ग्रे हो ===
takeown /f "C:\Users\PuranaUser" /r /d y
icacls "C:\Users\PuranaUser" /grant administrators:F /t

:: === Attributes (छिपी/सिस्टम/रीड-ओनली फ़ाइलें) ===
attrib -h -s -r /s /d G:\*.*               :: पेनड्राइव की छुपाई फ़ाइलें वापस
attrib +h "C:\Windows\Temp\secret.txt"      :: फ़ाइल छिपाएँ
attrib -r D:\report.docx                    :: Read-only हटाएँ (नोटपैड "Cannot save" का समाधान)` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.5</span> फ़ोल्डर/डिस्क शेयरिंग (SMB) व नेटवर्क एक्सेस</h3>
      <p>Windows फ़ाइल शेयरिंग <b>SMB (Server Message Block)</b> प्रोटोकॉल पर चलती है — पोर्ट <b>TCP 445</b> (नेटबायॉस-era 137–139 भी पुराने तरीक़े में)। शेयर बनाने के दो रास्ते: सरल — Right-click → <b>Give access to → Specific people</b> (Share wizard); सही तरीक़ा — Properties → <b>Sharing → Advanced Sharing</b> में "Share this folder", शेयर नाम, Permissions (Full/Change/Read) और <b>Caching</b> (offline files)। Share wizard सिर्फ़ <b>Read/Change</b> देता है; <b>Full Control</b> चाहिए तो Advanced Sharing से दें।</p>
      <ul>
        <li><b>HomeGroup हटा दिया गया है</b> (Windows 10 1803 के बाद) — अब सिर्फ़ SMB शेयर, <b>Known Folder Share</b> (Settings → Accounts → Other users → "Share my local folders across network") और OneDrive साझा लिंक इस्तेमाल करें।</li>
        <li><b>नेटवर्क डिस्कवरी व फ़ाइल शेयरिंग</b> Control Panel → Network and Sharing Center → Advanced sharing settings में, और <b>प्रोफ़ाइल-वार</b> (Private/Public/All Networks) — यानी नेटवर्क को Private करना ज़रूरी है, वरना डिस्कवरी ब्लॉक रहेगी। उसी पेज पर <b>Password protected sharing</b> (ऑन = शेयर खोलने पर उस PC का यूज़रनेम/पासवर्ड; ऑफ़ = Everyone बिना पासवर्ड, केवल भरोसेमंद LAN पर)।</li>
        <li><b>Mapped drive:</b> This PC → Map network drive → <code>\\192.168.1.10\Accounts</code> → "Reconnect at sign-in" + "Connect using different credentials" (दूसरे यूज़र से कनेक्ट)। कमांड से: <code>net use Z: \\192.168.1.10\Accounts /user:Rahul * /persistent:yes</code>।</li>
        <li><b>दुकान का असली मसला:</b> "दूसरे PC पर शेयर दिखता है पर खुलता नहीं" — 90% में क्रेडेंशियल गड़बर, फ़ायरवॉल का "File and Printer Sharing (SMB-In)" Block, या सेवा SMB (LanmanServer) बंद, या Time mismatch से Kerberos/NTLM फेल। जाँच: <code>Test-NetConnection 192.168.1.10 -Port 445</code>।</li>
      </ul>
      <table class="tbl"><tr><th>कमांड / पथ</th><th>क्या करता है</th></tr>
        <tr><td>net share</td><td>सभी सक्रिय शेयर की सूची (IPC$, ADMIN$, C$ हिड्डेन एडमिन शेयर दिखेंगे)</td></tr>
        <tr><td>net share Accounts=D:\Accounts /grant:Rahul,CHANGE</td><td>कमांड से शेयर बनाना</td></tr>
        <tr><td>net share Accounts /delete</td><td>शेयर रोकना/हटाना (डेटा नहीं मिटता)</td></tr>
        <tr><td>net use</td><td>मौजूदा नेटवर्क कनेक्शन/_mapped drive_ दिखाएँ</td></tr>
        <tr><td>net use Z: /delete</td><td>मैप किया ड्राइव हटाएँ; <code>net use * /delete /y</code> सब</td></tr>
        <tr><td>net use \\192.168.1.10\IPC$ /delete</td><td>छिपा घुलमिल कनेक्शन तोड़ें ("Multiple connections" एरर का समाधान)</td></tr>
        <tr><td>\\192.168.1.10 या \\PCNAME</td><td>Run बॉक्स से सीधे उस मशीन के सभी शेयर देखें (IP से DNS/नाम के बिना — लैब में सबसे तेज़)</td></tr>
        <tr><td>C:\\Users\\Public</td><td>बिना परमिशन-झंझट का साझा फ़ोल्डर — दोनों PC पर फ़ाइल यहीं कॉपी करना सबसे सरल</td></tr>
        <tr><td>control folders → View → "Show icons, not thumbnails"</td><td>बड़े शेयर में Explorer अटकने पर</td></tr>
        <tr><td>SMB 1.0/CIFS फ़ीचर</td><td>पुराने NAS/Windows XP के लिए — <b>सुरक्षा कारण से इंस्टॉल न करें</b> (WannaCry इसी रास्ते फैला); Windows 11 में डिफ़ॉल्ट हटा हुआ</td></tr>
      </table>
      <div class="callout info"><b class="ct">Everyone = कम, Authenticated Users = ज़्यादा सुरक्षित</b><p>शेयर परमिशन में <b>Everyone</b> हटाकर <b>Authenticated Users</b> (या Specified users) रखें और <b>Change</b> तक दें; असली कंट्रोल NTFS परमिशन से (मोडल: Share = Everyone/Full, NTFS = ग्रुप-वार Modify/Read)। इससे एक जगह बदलने पर पूरा शेयर ट्यून हो जाता है।</p></div>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.6</span> Device Manager व ड्राइवर प्रबंधन</h3>
      <p><code>devmgmt.msc</code> में डिवाइस <b>categories</b> में बँटे हैं — Display adapters, Network adapters, Sound/video/game controllers, Disk drives, IDE ATA/ATAPI controllers, USB controllers, System devices, Mice and other pointing devices, Keyboards, Human Interface Devices, Monitors, Batteries, Processors, Software devices। <b>पीला त्रिभुज (⚠) = समस्या (Error code)</b>, नीचे की ओर तीर = Device Disabled, ऊपर का तीर = Driver Not Installed, छिपा डिवाइस = हल्का/ट्रांसपेरेंट आइकन।</p>
      <ul>
        <li><b>ड्राइवर अपडेट के 4 रास्ते:</b> (1) Windows Update → Advanced options → <b>Optional updates → Driver updates</b> (सबसे सुरक्षित), (2) Manufacturer का अपना ऐप/साइट (GPU: NVIDIA/AMD/Intel), (3) Device Manager → Update driver → Browse my computer → "Let me pick from a list" (पुराना/कम्पैटिबल ड्राइवर चुनने के लिए — यही Display driver लूप तोड़ता है), (4) <code>pnputil /add-driver</code> से driver store में इंजेक्ट।</li>
        <li><b>Rollback:</b> Properties → Driver → <b>Roll Back Driver</b> — अपडेट किए ड्राइवर से पिछला संस्करण वापस; बटन ग्रे हो तो पहले कोई rollback store नहीं है, "Update driver → Have Disk" से पुराना INF लगाएँ।</li>
        <li><b>Uninstall + delete driver software:</b> Properties → Driver → Uninstall device → टिक <b>"Delete the driver software for this device"</b> — ग़लत ड्राइवर का पूरा सफ़ाया; फिर Action → Scan for hardware changes से Windows PnP ड्राइवर दोबारा लेगा। Device का टिक हटाकर unplug करके uninstall (remove device) करने पर next plug पर दोबारा वही ड्राइवर लग जाता है।</li>
        <li><b>छिपे डिवाइस:</b> View → <b>Show hidden devices</b> (Non-present/GHOST ड्राइवर, old VPN/virtual adapters) और View → <b>Devices by connection</b> (कौन किस बस पर — USB/SATA ट्रबलशूटिंग में)। Ghost device हटाने: <code>set devmgr_show_nonpresent_devices=1</code> फिर devmgmt.msc (नए Windows में Show hidden devices काफ़ी)।</li>
        <li><b>Driver store व INF:</b> इंस्टॉल किए .inf/.sys फ़ाइलें <code>C:\\Windows\\System32\\DriverStore\\FileRepository</code> में रहती हैं; <code>C:\\Windows\\INF</code> में h/w DB; हस्ताक्षर (catalog) <code>C:\\Windows\\System32\\CatRoot</code> में। यही कारण है कि पुराना हार्डवेयर भी बिना CD के चल जाता है।</li>
        <li><b>अनसाइनड ड्राइवर ज़बरदस्ती चलाना (सिर्फ़ लैब/अभ्यास में):</b> Test Signing — नीचे दिए कमांड के बाद रीस्टार्ट, डेस्कटॉप पर "Test Mode" वॉटरमार्क। प्रोडक्शन/ग्राहक मशीन पर न करें; Secure Boot पहले Disable करना पड़ सकता है, और Windows 11 में HVCI/Core Isolation (Memory Integrity) भी ब्लॉक करता है।</li>
      </ul>
      <table class="tbl"><tr><th>कमांड</th><th>काम</th></tr>
        <tr><td>pnputil /enum-drivers</td><td>Driver store के सारे पैकेज (Published name, class, version, providers)</td></tr>
        <tr><td>pnputil /enum-devices /problem /class Display</td><td>समस्या वाले डिवाइस सूची</td></tr>
        <tr><td>pnputil /add-driver oem12.inf /install /subdirs</td><td>INF को store में डालकर लागू करना</td></tr>
        <tr><td>pnputil /delete-driver oem12.inf /uninstall /force</td><td>store से ड्राइवर हटाना (ग़लत ड्राइवर दोबारा न चिपके)</td></tr>
        <tr><td>pnputil /export-driver * C:\\DriverBackup</td><td>पूरे PC के ड्राइवर फ़ोल्डर में बैकअप — रिपेयर से पहले ज़रूरी</td></tr>
        <tr><td>pnputil /scan-devices</td><td>Action → Scan for hardware changes का कमांड-रूप</td></tr>
        <tr><td>bcdedit /set testsigning on  (फिर re-start; बंद: /set testsigning off)</td><td>Test-signing मोड — unsigned ड्राइवर चलाता है</td></tr>
        <tr><td>driverquery /v</td><td>चल रहे सभी ड्राइवर, their state, link date, path</td></tr>
      </table>` },

    { type: 'table', head: ['कोड', 'संदेश (सार)', 'आम कारण', 'पहले ये 3 कदम'],
      rows: [
        ['Code 1', 'Device is configured incorrectly', 'INF/गलत resources, आधा-अधूरा ड्राइवर', 'Uninstall+delete driver → Scan for changes → manufacturer का ताज़ा ड्राइवर'],
        ['Code 3', 'Registry could be corrupted / out of memory', 'विंडोज़ रजिस्ट्री में Device Class key गड़बर', 'सिस्टम रिस्टोर, <code>sfc /scannow</code>, फिर क्लास key की मरम्मत'],
        ['Code 10', 'This device cannot start', 'ड्राइवर फेल, फ़र्मवेयर, power management, हार्डवेयर मर रहा', 'Rollback/update driver, USB/PCIe slot बदलें, BIOS में XHCI/AHCI सेट, पावर सप्लाई जाँचें'],
        ['Code 12', 'Not enough free resources (IRQ/memory)', 'दो डिवाइस एक resource ले रहे; BIOS PnP/PCI गड़बर', 'Device Resources हटाएँ, slot बदलें, BIOS reset/load defaults, "Use automatic settings"'],
        ['Code 18', 'Reinstall the drivers for this device', 'पहली बार install, रीबूट बाक़ी', 'रीस्टार्ट; फिर भी रहे तो Uninstall+delete, दोबारा इंस्टॉल'],
        ['Code 19', 'Registry configuration information incomplete or damaged', 'UpperFilters/LowerFilters गंदे (अक्सर CD/burn या filter driver के बाद)', 'Filters हटाने के लिए kb article — या uninstall + clean driver install; बैकअप के बाद Registry'],
        ['Code 22', 'This device is disabled', 'Device Manager में डिसेबल किया हुआ', 'Right-click → Enable device; BIOS में पोर्ट disable न हो'],
        ['Code 24', 'Device is not present, not working, or missing drivers', 'plug हटाया/ढीला, card मरा', 'फिर से लगाएँ, दूसरा पोर्ट, cables; Ghost निकालें'],
        ['Code 28', 'The drivers for this device are not installed', 'ड्राइवर कहीं नहीं मिला (नया WiFi/Chipset/LAN chip)', 'Manufacturer साइट से ड्राइवर (दूसरे PC+पेनड्राइव), या <code>pnputil /add-driver</code>, Windows Update Optional'],
        ['Code 31', 'Windows cannot load the required drivers', 'ड्राइवर फाइलें गुम/करप्ट, service disable', 'Clean reinstall driver, <code>sfc /scannow</code>, <code>DISM /Online /Cleanup-Image /RestoreHealth</code>'],
        ['Code 32', 'Drivers for this device are disabled', 'Registry Start=4 (सर्विस डिसेबल्ड), पुराना tweak', 'Start=3 करें या uninstall+scan; Service को Automatic करें'],
        ['Code 37', 'Windows cannot initialize the device driver', 'ड्राइवर का Entry Point/Init फेल, वर्ज़न/बिट गलत, मेमोरी गड़बर', 'सही 64/32-बिट ड्राइवर, rollback, RAM टेस्ट (<code>mdsched.exe</code>)'],
        ['Code 39', 'Driver is corrupted or missing', 'अधूरा अपडेट/एंटीवायरस क्वारंटीन', 'Uninstall+delete, दोबारा इंस्टॉल, UpperFilters की जाँच'],
        ['Code 43', 'Windows has stopped this device because it reported problems', 'GPU/RAM/USB हार्डवेयर फेल, पावर/केबल, ड्राइवर क्रैश, overheating', 'केबल/पोर्ट बदलें, ड्राइवर साफ़ करके (DDU) दोबारा, तापमान जाँचें, अलग PSU केबल, फिर swap-test — लंबे में कोड 43 = डिवाइस बदलें'],
        ['Code 45', 'Currently, this hardware device is not connected', 'हट गया/स्लीप में ड्राइव ढीली, USB hub power', 'plug-in, सीधा बॉर्डर पोर्ट, hub हटाएँ; तब भी रहे तो re-enumerate (scan)'],
        ['Code 48 / 52', 'Software can’t start (blocked) / digital signature not verified', 'Windows ने known-bad या unsigned ड्राइवर रोका', 'अपडेटेड signed ड्राइवर लें; बंद करने का "correct" तरीक़ा Secure Boot/Memory Integrity रखना'],
        ['Code 47', 'Windows has removed this device because it hit an unexpected error', 'सर्फ़ (surprise removal), PCIe/USB पर बड़ी गलती, पावर ड्रॉप', 'Device हटाकर दोबारा plug, Action → Scan, PCIe slot/केबल बदलें; बार-बार हो तो PSU/स्लॉट जाँचें']
      ] },
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.7</span> सेवाएँ (Services) — services.msc, svchost व sc कमांड</h3>
      <p><code>services.msc</code> में हर सेवा की 5 बातें देखें: <b>Status</b> (Running/Stopped), <b>Startup type</b>, <b>Log on as</b> (Local System / Network Service / Local Service / This account), <b>Dependencies</b> टैब (यह किस पर टिकी है और कौन-सी इसके ऊपर टिकी हैं) और <b>Recovery</b> टैब। सेवा का असली घर <code>HKLM\\SYSTEM\\CurrentControlSet\\Services\\&lt;नाम&gt;</code> है, जहाँ <b>Start</b> DWORD यही startup type है।</p>
      <ul>
        <li><b>Recovery टैब:</b> First/Subsequent/Second subsequent failure → Take No Action / Restart the Service / Run a Task / Restart the Computer; साथ में "Restart service after" और <b>Reset fail counter after</b> — सर्विस बार-बार गिरने वाली मशीन पर यही सेटिंग बचाती है।</li>
        <li><b>svchost.exe:</b> कई सेवाएँ एक साझा होस्ट प्रोसेस में चलती हैं (<code>-k netsvcs</code>, <code>-k LocalService</code>, <code>-k NetworkService</code>)। Task Manager → Processes में "Service Host: Network…" जैसा समूह दिखता है; Right-click → <b>Go to service(s)</b> से पता चलता है कि उसी svchost में कौन-सी सेवाएँ हैं — RAM/CPU 100% वाला svchost इसी से पहचाना जाता है।</li>
        <li><b>कमांड से:</b> <code>sc query</code>, <code>sc qc wuauserv</code> (config), <code>sc start</code>/<code>sc stop</code>/<code>sc restart</code>, <code>sc config SysMain start= disabled</code> — ध्यान दें <b>start=</b> के बाद खाली जगह अनिवार्य है, वरना "[SC] ChangeServiceConfig FAILED 87"। Registry से: <code>reg add HKLM\\SYSTEM\\CurrentControlSet\\Services\\SysMain /v Start /t REG_DWORD /d 4 /f</code></li>
        <li><b>TELEMETRY/Insider:</b> "Connected User Experiences and Telemetry" (<b>DiagTrack</b>) यूज़ेज डेटा/क्रैश रिपोर्ट भेजता है; "Windows Insider Service" और Diagnostic Policy Service Insider/फ़ीडबैक के लिए हैं — Insider प्रोग्राम में नहीं हैं तो Manual कर सकते हैं, पर क्रैश विश्लेषण (WER) का डेटा कम हो जाता है।</li>
      </ul>
      <table class="tbl"><tr><th>Startup type</th><th>Registry Start</th><th>क्या होता है</th><th>कब चुनें</th></tr>
        <tr><td>Automatic</td><td>2</td><td>बूट/लॉगिन पर तुरंत शुरू</td><td>सिस्टम के लिए ज़रूरी (RPC, DCOM, Plug and Play)</td></tr>
        <tr><td>Automatic (Delayed Start)</td><td>2 (DelayStart 1)</td><td>बूट के ~30 सेकंड बाद शुरू — बूट तेज़ लगता है</td><td>Print Spooler, WMPNetworkSvc, ड्राइव-संबंधी सेवाएँ</td></tr>
        <tr><td>Manual</td><td>3</td><td>खुद नहीं, पर कोई ऐप/सेवा माँगे तो चल जाती है</td><td>ज़्यादातर Windows सेवाएँ — यही डिफ़ॉल्ट सुरक्षित है</td></tr>
        <tr><td>Disabled</td><td>4</td><td>कुछ भी माँगे तो नहीं चलेगी (Error 1058)</td><td>सिर्फ़ वही जो पक्का नहीं चाहिए; स्क्रिप्ट/सेंटर टूट सकते हैं</td></tr>
        <tr><td>Boot start / System start (केवल Registry/ड्राइवर)</td><td>0 / 1</td><td>कर्नेल लोड होते समय — सेवाओं में नहीं दिखता</td><td>ड्राइवर (storahci, ndis) — हाथ न लगाएँ</td></tr>
      </table>` },

    { type: 'table', head: ['सेवा (Display name)', 'Service name', 'बंद करने पर असर', 'सुझाव'],
      rows: [
        ['SysMain (पुराना Superfetch)', 'SysMain', 'Prefetch/रैम-प्रिफ़ेट बंद; HDD पर Disk 100% घटता है, ऐप थोड़ा धीमा खुलते हैं', 'HDD वाली मशीन पर Manual — सबसे पहले यही आज़माएँ'],
        ['Windows Search', 'WSearch', 'फ़ाइल इंडेक्सिंग बंद → Start/Explorer सर्च धीमा', 'पुरानी HDD/कम RAM पर Manual; SSD पर छोड़ दें'],
        ['Connected User Experiences and Telemetry', 'DiagTrack', 'टेलीमेट्री/फ़ीडबैक डेटा नहीं जाएगा; Insider/Feedback app अचल', 'Manual किया जा सकता है'],
        ['Diagnostic Policy Service', 'DPS', 'Windows troubleshooter (Network/Bluetooth) नहीं चलेंगे', 'रखें — रिपेयर में काम आती है'],
        ['Windows Error Reporting Service', 'WerSvc', 'Crash रिपोर्ट/minidump भेजना बंद; local dump फिर भी बनते हैं', 'BSOD डिबग करते समय चालू रखें'],
        ['Print Spooler', 'Spooler', 'प्रिंटिंग बंद', 'प्रिंटर न हो तो Disabled; "print queue stuck" पर restart'],
        ['Fax', 'Fax', 'फ़ैक्स सेवा बंद', '99% मशीनों पर Disabled'],
        ['Remote Registry', 'RemoteRegistry', 'दूसरे PC से Registry बदलना बंद — सुरक्षा बढ़ती है', 'Disabled (डिफ़ॉल्ट भी यही)'],
        ['Secondary Logon', 'seclogsrv', 'Run as different user / net use /runas_with_profile टूटता है', 'एडमिन काम के लिए चालू रखें'],
        ['Touch Keyboard and Handwriting Panel', 'TabletInputService', 'टैब्लेट कीबोर्ड/टच केबोर्ड नहीं खुलेगा', 'Desktop पर Manual'],
        ['Downloaded Maps Manager', 'MapsBroker', 'Maps app का ऑफ़लाइन नक्शा बंद', 'Manual'],
        ['Xbox Accessory Management / Xbox Live Auth Manager', 'XblAuthManager आदि', 'गेमपैड व Xbox Live साइनइन बंद', 'गेमिंग PC न हो तो Manual'],
        ['Windows Biometric Service', 'WbioSrvc', 'फ़िंगरप्रिंट/Face लॉगिन बंद', 'बायोमेट्रिक न हो तो Manual'],
        ['Function Discovery Provider Host / Publication', 'fdPHost / FDResPub', 'नेटवर्क में PC "दिखना"/दिखाना बंद', 'शेयरिंग चाहिए तो Automatic (These two के बिना discovery नहीं)'],
        ['Windows Update / Update Orchestrator', 'wuauserv / UsoSvc', 'सिक्योरिटी पैच बंद — बिल्कुल न करें (केवल pause/active hours)', 'कभी Disabled न करें']
      ] },

    { type: 'steps', items: [
      { n: 1, title: 'msconfig खोलें', text: '<code>Win+R</code> → <code>msconfig</code> → Enter। (नए Windows में Startup टैब यहाँ नहीं — वह Task Manager → Startup में चला गया है।)', tips: 'एडमिन प्रॉम्प्ट पर Yes दें।' },
      { n: 2, title: 'General टैब → Selective startup', text: '"Load system services + Load startup services" टिक रखें, <b>Use Original / Group Policy start-up</b> चुनें — ताकि बाद में "Normal" पर लौटना आसान रहे।' },
      { n: 3, title: 'Services टैब → Hide all Microsoft services', text: 'पहले यह चेकबॉक्स ज़रूर टिक करें — इससे सुरक्षित रहेगा कि कोई ज़रूरी OS सर्विस बंद नहीं होगी।', warn: 'यह टिक किए बिना "Disable all" करने पर Bluetooth/Network/Security टूट सकता है।' },
      { n: 4, title: 'Disable all → Apply', text: 'अब बाक़ी बची (third-party) सेवाएँ बंद — Antivirus, RGB सॉफ़्टवेयर, Updater, Virtual printer, USB-capture सॉफ़्टवेयर आदि।' },
      { n: 5, title: 'Task Manager → Startup → सब Disable', text: 'Startup टैब में हर entry चुनकर Disable (पहले सूची नोट कर लें)। फिर रीस्टार्ट — यह <b>True Clean Boot</b> है।' },
      { n: 6, title: 'एक-एक करके वापस जोड़ें', text: 'समस्या गायब? अब आधी सेवाएँ चालू करके रीस्टार्ट, फिर बाक़ी — आधा-आधा (bisect) विधि से 3-4 रीस्टार्ट में दोषी मिल जाता है।', tips: 'हर रीस्टार्ट के बाद वही काम करके देखें जो क्रैश करता था।' },
      { n: 7, title: 'पक्का होने के बाद हटाएँ', text: 'दोषी ऐप का ड्राइवर/सर्विस अपडेट करें या uninstall करें; जरूरत न हो तो रखें।'},
      { n: 8, title: 'Normal startup पर लौटना', text: 'msconfig → General → <b>Normal startup</b> → OK → रीस्टार्ट, और Startup entries दोबारा Enable करें।', warn: 'Diagnostic/Selective startup पर छोड़कर मशीन ग्राहक को न दें — अपडेट व सुरक्षा सेवाएँ बंद रहेंगी।' }
    ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.8</span> Task Manager — हर टैब का पूरा उपयोग</h3>
      <p><code>Ctrl+Shift+Esc</code> सीधा खोलता है; <code>Ctrl+Alt+Del</code> → Task Manager (सुरक्षित स्क्रीन से — मालवेयर इसे रोक नहीं सकता, इसलिए जाम मशीन यहीं से खोलें)। छोटी विंडो दिखे तो <b>More details</b> दबाएँ। Processes टैब में Right-click → <b>Set priority</b> (Realtime सिर्फ़ अस्थायी टेस्ट के लिए — रियलटाइम पर सेट करके गेम/एडिटर चलाने से सिस्टम हैंग हो सकता है), <b>Set affinity</b> (किस-किस कोर पर चले — पुराने/अकेले-कोर वाले ऐप के लिए), <b>Go to details</b>, <b>Analyze wait chain</b> (कौन प्रोसेस किसका इंतज़ार कर रहा है), <b>Open file location</b> (शक़्क़ुलना नाम पकड़ने का सबसे तेज़ तरीक़ा)।</p>
      <table class="tbl"><tr><th>टैब</th><th>क्या दिखता है</th><th>किस काम में</th></tr>
        <tr><td>Processes</td><td>Apps / Background processes / Windows processes; CPU, Memory, Disk, Network, GPU %; <b>Startup impact</b> कॉलम</td><td>"किसने मशीन रोकी" — कॉलम हेड पर Right-click करके Power usage, Disk rate, GPU आदि जोड़ें</td></tr>
        <tr><td>Performance</td><td>CPU (cores/threads, virtualization, base speed), Memory (in use, committed, slots/speed), Disk (SSD/HDD, active time, queue), Ethernet/Wi-Fi (link speed, IPv4, DNS, gateway, DHCP), GPU (3D/Copy/Video decode, dedicated/shared)</td><td>हार्डवेयर पहचान + संकट का आकार; नीचे <b>Open Resource Monitor</b> बटन</td></tr>
        <tr><td>App history</td><td>UWP/Store ऐप का CPU समय व नेटवर्क (user/Metered) — Reset से काउंटर शून्य</td><td>कौन-सा Store ऐप डेटा खा रहा है</td></tr>
        <tr><td>Startup</td><td>लॉगिन पर चलने वाली चीज़ें, Enabled/Disabled, <b>Startup impact</b> (High/Medium/Low/None), Command line, Publisher, Date, Author, "App provided update", HKLM/HKCU Registry Path कॉलम</td><td>धीमे बूट का पहला इलाज; Right-click → Open file location / Disable</td></tr>
        <tr><td>Users</td><td>लॉगिन यूज़र, their session, CPU/Memory/Disk usage, Disconnect/Sign off</td><td>साझा/रिमोट मशीन पर दूसरे session बंद करना</td></tr>
        <tr><td>Details</td><td>हर process की पंक्ति — PID, Status, Username, CPU, CPU time, Memory, Handles, Threads, I/O, Priority, Affinity, Elevation, Data execution prevention; राइट-क्लिक से <b>ETime</b> (कुल elapsed समय) व <b>ECPU</b> (CPU पर बिताया समय) कॉलम जोड़ें</td><td>लेक/लीक पकड़ना: एक ही PID के Threads/Handles बढ़ते जाएँ तो memory leak; <b>End process tree</b> से पूरा परिवार बंद</td></tr>
        <tr><td>Services</td><td>सेवाएँ (Status, Startup type, "Hide protected services") + <b>Open services</b></td><td>बिना services.msc खोले restart/disable; Right-click → Go to details (svchost पहचानने के लिए उल्टा भी)</td></tr>
      </table>
      <div class="callout tip"><b class="ct">"End task" बनाम "End process" बनाम "End process tree"</b><p><b>End task</b> ऐप को विनम्रता से बंद करने को कहता है (message भेजता है), <b>End process</b> ज़बरदस्ती मारता है — अधूरा सेव/लॉक फ़ाइल बन सकती है, <b>End process tree</b> उस प्रोसेस के सारे बच्चों (child processes) को मारता है — browser freeze या "installer stuck" में यही काम आता है। Explorer जाम हो तो <code>explorer.exe</code> restart करें: File → Run new task → <code>explorer.exe</code>।</p></div>` },

    { type: 'table', head: ['समस्या / टूल', 'लक्षण', 'कदम (क्रम से)'],
      rows: [
        ['Disk 100% (HDD वाली मशीन)', 'Task Manager में Disk 100%, Active time 100%, प्रोसेस धीमा', '1) कौन प्रोसेस है देखें → 2) <b>SysMain</b> Manual → 3) <b>Windows Search</b> बंद → 4) Power plan = High performance → 5) <code>chkdsk C: /scan</code> व CrystalDiskInfo से SMART Reallocated sectors → ख़राब निकले तो SSD बदलें'],
        ['Disk 100% — कोई प्रोसेस ज़िम्मेदार नहीं', 'Queue कम, %time 100, HDD टिक-टिक', 'SATA केबल/पोर्ट बदलें, BIOS में SATA mode = AHCI, स्टोरेज ड्राइवर (Intel RST ↔ storahci) बदलकर रीस्टार्ट, फ़्री-स्पेस 15%+ रखें'],
        ['Windows Update के दौरान 100%', 'Delivery Optimization, TiWorker.exe', 'Settings → Windows Update → Advanced → Delivery Optimization बंद; WU पूरी करें फिर अपने आप ठीक'],
        ['Antivirus स्कैन भारी', 'MsMpEng.exe RAM/CPU ज़्यादा', 'Real-time scan के बजाय scheduled scan रात में; फ़ोल्डर एक्सक्लूज़न सिर्फ़ भरोसेमंद डेटा पर'],
        ['Resource Monitor', 'कौन फ़ाइल लॉक किए है, कौन पोर्ट खोल रहा है', '<code>resmon</code> — CPU → Associated Handles/Services (फ़ाइल लॉक), Memory → Hard Faults, Disk → Disk Queue/Storage, Network → TCP Connections व Listen Ports'],
        ['Performance Monitor (perfmon.msc)', 'लंबे समय का डेटा/चार्ट चाहिए', '<b>Data Collector Sets</b> → Built-in → System Diagnostics / System Performance रन करें → Report में लाल पंक्तियाँ; Counter जोड़ने के लिए "+": <code>\\Processor(_Total)\\% Processor Time</code>, <code>\\Memory\\Available MBytes</code>, <code>\\PhysicalDisk\\% Disk Time</code>, <code>\\Paging File\\% Usage</code>, <code>\\System\\Processor Queue Length</code>'],
        ['Reliability Monitor', "किस तारीख़ को क्या टूटा — साफ़ टाइमलाइन", '<code>perfmon /rel</code> (or start → "View reliability history") — दिन-वार 10-स्कोर, App/Windows failures, Install/Uninstall, Critical events; BSOD/रिस्टार्ट का इतिहास यहीं सबसे जल्दी पढ़ा है'],
        ['Windows Error Reporting (WER)', 'ऐप क्रैश पर "has stopped working"', 'रिपोर्ट यहाँ: <code>C:\\ProgramData\\Microsoft\\Windows\\WER\\ReportArchive</code> व ReportQueue; Local Dumps फ़ोल्डर; घटना लॉग में <b>Event 1000</b> (faulting module), <b>1001</b> (BugCheck), <b>1002</b> (hang)'],
        ['Minidump पढ़ना (WinDbg)', 'BSOD के बाद <code>C:\\Windows\\Minidump\\*.dmp</code>', 'WinDbg खोलें → File → Open dump → कमांड लाइन में <code>!analyze -v</code> → "Probably caused by : <b>xxx.sys</b>" लाइन देखें; <code>lmvm xxx</code> से ड्राइवर का वर्ज़न/बिल्ड, <code>.ecxr</code> से crash का context, <code>kv</code> से स्टैक — ड्राइवर वर्ज़न manufacturer के ताज़ा ड्राइवर से मिलाकर बदलें'],
        ['मौजूदा RAM leak', 'Memory बढऩा परंतु return नहीं', 'Details टैब → PID नोट → perfmon में <code>\\Process(name)\\Private Bytes</code> मिनटों में प्लॉट; बढ़ता रहे तो ऐप reinstall/update']
      ] },
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.9</span> Event Viewer (eventvwr.msc) — मशीन की डायरी</h3>
      <p>Windows हर महत्वपूर्ण बात लॉग लिखता है। मुख्य लॉग (Applications and Services Logs के अलावा): <b>Application</b> (ऐप/सेवा की घटनाएँ), <b>System</b> (ड्राइवर, सर्विस, बूट, पावर), <b>Security</b> (लॉगिन/लॉगआउट, ऑब्जेक्ट एक्सेस — नीति ON हो तभी भरा-बरा), <b>Setup</b> (अपग्रेड/इंस्टॉल), <b>Forwarded Events</b>। Levels: <b>Critical, Error, Warning, Information, Success Audit, Failure Audit</b>।</p>
      <ul>
        <li><b>पढ़ने की आदत:</b> समस्या के समय (Reliability Monitor से तारीख़ मिलती है) के आसपास की <b>Error/Critical</b> पंक्तियाँ देखें, Source और <b>Event ID</b> नोट करें — ID + Source ही सर्च की असली चाबी है।</li>
        <li><b>Filter:</b> right लॉग पर → <b>Filter Current Log</b> → Levels = Critical+Error, Event IDs में <code>41,1074,6008,1001</code> जैसे लिखें (कॉमा से अलग)। <b>Find</b> (Ctrl+F) टेक्स्ट खोजता है।</li>
        <li><b>Custom Views:</b> Actions → Create Custom View → कई लॉग एक साथ (System+Application+Setup), "All the events listed in the defined time period" — रिपोर्ट देते समय सबसे उपयोगी। तैयार व्यू पर Right-click → <b>Save Properties</b> (.xml) से लैब के दूसरे PC पर import करें।</li>
        <li><b>बचत/साफ़:</b> लॉग पर Right-click → <b>Save All Events in Log</b> (.evtx/.csv/.txt) ग्राहक/मैनुफैक्चरर को भेजने के लिए; Clear Log साफ़ करता है (पुरावा नष्ट — पहले save करें); लॉग साइज़/रिटेंशन Properties → Maximum log size ( डिफ़ॉल्ट 20–25 MB) व "Overwrite events as needed"।</li>
        <li><b>Task Manager/Explorer जाम:</b> <code>eventvwr.msc</code> सीधे Run से खोलें; रिमोट मशीन के लॉग: File → Connect to another computer (परमिशन चाहिए)।</li>
      </ul>` },

    { type: 'table', head: ['Event ID', 'लॉग / Source', 'अर्थ', 'अगला कदम'],
      rows: [
        ['41 (63)', 'System / Kernel-Power', 'बिना साफ़ शटडाउट के पावर काटी/मशीन रीस्टार्ट हुई (BSOD, SMPS, बैटरी ख़त्म)', 'Dump फ़ाइल, Temperature, SMPS व UPS जाँचें; बूट में BIOS defaults'],
        ['1074', 'System / User32', 'नियमित रीस्टार्ट/शटडाउन किसने और क्यों (Windows Update/ऐप/यूज़र)', 'अचानक रीस्टार्ट का कारण यहीं पता चलता है (Reason code, Process name)'],
        ['6008', 'System / EventLog', 'पिछला शटडाउन अनपेक्षित था (डायरी में "improper shutdown")', '41/1001 के साथ मिलाकर देखें — पावर बनाम क्रैश'],
        ['6005 / 6006', 'System / EventLog', 'Event Log service started / stopped — बूट व शटडाउन का टाइमस्टैम्प', 'बूट समय मापने के लिए 6005'],
        ['109', 'System / Kernel-Power', 'Windows ने shutdown शुरू किया (killing apps)', 'अधूरा शटडाउन/हैंग का पता'],
        ['410 / 420', 'System / Kernel-Boot / Kernel-General', 'Hibernate/Resume व बूट टाइमिंग', 'Fast Startup की समस्या ढूँढने में'],
        ['1001', 'System / Microsoft-Windows-WER-SystemErrorReporting', 'BugCheck (BSOD) रिकॉर्ड — dump file path व parameters', '<code>C:\\Windows\\Minidump</code> का ताज़ा dump WinDbg में खोलें'],
        ['1000 / 1002', 'Application / Application Error / Hang', 'ऐप क्रैश (faulting module + offset) / ऐप हैंग', 'Faulting module (moudule dll) से ड्राइवर/एप पहचानें; वही ड्राइवर अपडेट'],
        ['7000', 'System / Service Control Manager', 'सेवा शुरू नहीं हो सकी (Error 2 = फ़ाइल नहीं मिली, 1069 = लॉगऑन फेल)', 'Service की Path/Start मान व Log On पासवर्ड जाँचें'],
        ['7034 / 7031', 'System / SCM', 'प्रोसेस/सेवा अप्रत्याशित तरीके से बंद हुई (कितनी बार)', 'बार-बार एक ही सेवा → उस ऐप का रीइंस्टॉल/अपडेट, मालवेयर स्कैन'],
        ['4624', 'Security / Microsoft-Windows-Security-Auditing', 'लॉगिन सफल (Type 2 interactive, 3 network, 10 RDP)', 'Login Times/Source Network Address से अनजान एक्सेस पकड़ें'],
        ['4625', 'Security', 'लॉगिन फेल — पासवर्ड ग़लत/अकाउंट लॉक; Status codes 0xC0000064 (नाम ग़लत), 0xC0000234 (लॉक)', 'बार-बार हज़ारों 4625 = ब्रूट फ़ोर्स/रिमोट हमला — RDP बंद/पोर्ट बदलें, लॉकआउट पॉलिसी'],
        ['4648', 'Security', 'जान-बूझकर दूसरे क्रेडेंशियल से लॉगिन (Run as / service)', 'गलत पासवर्ड से service fail की जाँच'],
        ['4720 / 4726 / 4732', 'Security', 'यूज़र बना / डिलीट / समूह में जोड़ा गया', 'ग्राहक PC पर छिपा अकाउंट बनाने वाला मालवेयर यहीं पकड़ में आता है'],
        ['4740', 'Security', 'अकाउंट लॉक आउट हो गया (kis source से)', 'Source Network Address देखें'],
        ['2191 / 1 / 4', 'Application / Microsoft-Windows-AppModel-Runtime / Store', 'Store ऐप इंस्टॉल/अपडेट की गड़बड़', 'WSReset/Store ऐप रीपेयर'],
        ['168 / 98', 'System / Microsoft-Windows-Kernel-Boot / Wininit', 'पेन्डिंग अपडेट रीबूट, pagefile समस्या', 'एक पूरा अपडेट साइकिल पूरा होने दें'],
        ['55 / 50 / 137 / 153', 'Application / Ntfs / disk / volmgr', 'NTFS फ़ाइल सिस्टम एरर, डिस्क एरर, dump लिखने में विफल', '<code>chkdsk C: /scan</code> → फेल हो तो /f /r; SMART व केबल जाँच; dump के लिए pagefile on C: चाहिए']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.10</span> Registry (regedit) — 5 Hive, सुरक्षित तरीक़ा और बैकअप</h3>
      <p>Registry Windows की सेटिंग-डेटाबेस है, पाँच <b>hives</b> (root keys) में बँटी:</p>
      <ul>
        <li><b>HKEY_CLASSES_ROOT (HKCR)</b> — फ़ाइल एक्सटेंशन ↔ ऐप/map associations और COM registration; यह HKLM\\Software\\Classes + HKCU\\Software\\Classes का मिश्रण है। <code>.txt</code> किसमें खुलेगा, यहीं तय होता है।</li>
        <li><b>HKEY_CURRENT_USER (HKCU)</b> — लॉगिन यूज़र की सेटिंग्स = <code>C:\\Users\\&lt;नाम&gt;\\NTUSER.DAT</code> (इसीलिए दूसरे यूज़र की hive Load Hive से चढ़ानी पड़ती है)।</li>
        <li><b>HKEY_LOCAL_MACHINE (HKLM)</b> — मशीन की सारी hardware/software/service सेटिंग; सब-की: <b>SYSTEM</b> (CurrentControlSet, Services, DeviceClasses), <b>SOFTWARE</b> (installed apps, Policies), <b>SAM</b> (local accounts — लॉक रहता है), <b>SECURITY</b>, <b>COMPONENTS</b>।</li>
        <li><b>HKEY_USERS (HKU)</b> — लोड की गई सभी यूज़र hives (<code>.DEFAULT</code> = logon screen की सेटिंग)।</li>
        <li><b>HKEY_CURRENT_CONFIG (HKCC)</b> — आज चयनित hardware profile (<code>HKLM\\SYSTEM\\CurrentControlSet\\Hardware Profiles\\Current</code> का रीड)।</li>
      </ul>
      <div class="callout danger"><b class="ct">Registry से पहले दो काम अनिवार्य</b><p><b>1)</b> उस key पर Right-click → <b>Export</b> → <code>before-tweak.reg</code> (वापसी का एकमात्र रास्ता)। <b>2)</b> पूरी hive का बैकअप:.regedit में File → Export → All, या RE/System Restore point, या <code>robocopy C:\\Windows\\System32\\config D:\\regback /mir</code> (बूट में कॉपी नहीं मिलेंगे — RE या दूसरे OS से)। Windows 10/11 automatic registry backup बंद है (2004 के बाद) — इसलिए "Registry Cleaner/Booster" ऐप्स से दूर रहें: ये अक्सर HKCU\\Software\\Classes और Uninstall keys तोड़कर Store/Uninstall टूटने का कारण बनते हैं।</p></div>
      <p><b>सिस्टम रिस्टोर/RE से Registry वापस:</b> System Restore point रीजिस्ट्री hive सहित लौटाता है; चलती मशीन पर <code>regedit</code> → File → Load Hive से offline NTUSER.DAT ठीक किया जा सकता है, पर HKLM\\SYSTEM लोड नहीं होता (Sysprep/RE से करना पड़ता है)।</p>` },

    { type: 'table', head: ['पथ (Shortcut रूप)', 'क्या नियंत्रित करता है', 'व्यावहारिक उपयोग'],
      rows: [
        ['HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'लॉगिन पर चलने वाले प्रोग्राम (per-user)', 'स्टार्टअप एंट्री जोड़ना/हटाना; मालवेयर की सबसे प्रिय जगह — Task Manager → Startup के "Command line" कॉलम से मिलाएँ'],
        ['HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'सब यूज़र के स्टार्टअप प्रोग्राम', 'System-wide entry; 32-बिट ऐप्स के लिए WOW6432Node वाला उसी नाम का path'],
        ['…\\CurrentVersion\\RunOnce', 'एक बार (चलने के बाद हट जाता है)', 'रिबूट-पेंडिंग सेटअप स्क्रिप्ट; मालवेयर यहाँ भी लिखता है'],
        ['…\\CurrentVersion\\RunServicesOnce / RunServices', 'पुरानी विंडोज़ की सेवा-स्टार्ट एंट्री', 'आज XP-जमाने के छोटे ऐप्स में दिखती है — वहाँ भी जाँच लें'],
        ['HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList', 'हर SID का ProfileImagePath व State', 'Temporary profile व प्रोफ़ाइल लोकेशन मरम्मत (सावधानी से)'],
        ['HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer', 'यूज़र-स्तर Explorer पाबंदियाँ (NoRun, NoTaskManager, NoDrives)', 'NoRun=1 से Run डिसएबल; NoDrives=255 से सारे ड्राइव छिपे — वही बात GP से होनी चाहिए'],
        ['HKLM\\…\\Windows\\CurrentVersion\\Policies\\System', 'UAC (EnableLUA, ConsentPromptBehaviorAdmin…), legal notice, logon', 'Elevate करने पर ही बदलता है; "Logon: Message text" यहीं'],
        ['HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\notepad.exe → Debugger', 'प्रोग्राम के बदले कोई और चलाना', 'सिस्टम-कमांड-रूटिंग trick; Sticky Keys (sethc.exe) debugger बदलकर RE से अकाउंट रीसेट की मशहूर तकनीक यही है'],
        ['HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall', 'Control Panel/Settings की इंस्टॉल्ड ऐप सूची', 'हर key में DisplayName/UninstallString — सॉफ़्टवेयर इन्वेंटरी यहीं से'],
        ['HKLM\\SYSTEM\\CurrentControlSet\\Services\\&lt;svc&gt; → Start', 'सेवा का startup type (0–4)', '2 Automatic, 3 Manual, 4 Disabled; Drivers में 0/1 भी'],
        ['HKLM\\SYSTEM\\CurrentControlSet\\Control\\SafeBoot\\(Minimal|Network)', 'Safe Mode में कौन-सी सेवा/ड्राइवर चले', 'किसी service की key यहाँ बनाते ही वह safe mode में चलने लगती है'],
        ['HKCU\\Control Panel\\Desktop → Wallpaper / WallPaperStyle', 'डेस्कटॉप वॉलपेपर व स्टाइल', 'GP से "Desktop Wallpaper" lock करने पर यही policy value दिखती है'],
        ['HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\ShellIconOverlayIdentifiers', 'Explorer के ओवरले आइकन (OneDrive/सिंक)', 'Overlay limit (11) से ज़्यादा होने पर OneDrive icon ग़ायब — यहीं से हटाएँ'],
        ['HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem', 'NTFS settings (NtfsDisable8dot3NameCreation, Win31Priority)', '8.3 नाम बंद करने से नेटवर्क कॉपी तेज़; Long path enable'],
        ['HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion', 'ProductName, DisplayVersion, CurrentBuild, InstallationType', 'Windows का exact संस्करण/बिल्ड यहीं — "About" इसी से पढ़ता है'],
        ['HKCU\\Software\\Classes\\… / HKCR\\&lt;.ext&gt;', 'फ़ाइल एक्सटेंशन association', '"Open with" टूटे तो यहीं से ठीक (या default apps से)']
      ] },

    { type: 'code', code: String.raw`:: === regedit से सुरक्षित तरीक़ा ===
regedit                          :: खोलें; पहले key पर Right-click → Export (backup .reg)
File → Import …                  :: .reg फ़ाइल घुसेटना
File → Load Hive …               :: offline NTUSER.DAT चढ़ाना (RE/दूसरे Windows से मरम्मत)

:: === .reg फ़ाइल का सही फ़ॉर्मैट (Double-click से import) ===
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\System]
"DisableTaskMgr"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\MyCompany\App]
"InstallPath"="C:\\Program Files\\MyApp"
"Version"="2.1"

:: === reg कमांड (स्क्रिप्ट/रिमोट के लिए) ===
reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /s /f "OneDrive"
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\System" /v DisableTaskMgr /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\MyCompany\App" /v InstallPath /t REG_SZ /d "C:\Program Files\MyApp" /f
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v SuspiciousApp /f
reg export "HKLM\SYSTEM\CurrentControlSet\Services" C:\regback\services.reg /y
reg import C:\regback\services.reg
reg load HKU\Off C:\Users\Purana\NTUSER.DAT   :: फिर query/delete करके reg unload HKU\Off` },
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.11</span> Group Policy (gpedit.msc) व Local Security Policy</h3>
      <p><b>Group Policy</b> = बिना Registry हाथ से छेड़े सैकड़ों सेटिंग एक जगह से लगाना। <code>gpedit.msc</code> में दो बड़ी डालियाँ हैं:</p>
      <ul>
        <li><b>Computer Configuration</b> — मशीन पर, बूट होते ही, किसी भी यूज़र के लॉगिन से पहले लागू (Windows Update, Device installation, Audit)।</li>
        <li><b>User Configuration</b> — यूज़र के लॉगिन पर लागू (Start menu, Control Panel, Drive map, Logon script)।</li>
        <li>दोनों के अंदर: <b>Software Settings</b> (MSI deploy), <b>Windows Settings</b> (Security Settings, Scripts, Folder Redirection), <b>Administrative Templates</b> (पॉलिसी .admx — यही ज़्यादातर काम)।</li>
        <li><b>क्रम:</b> Local → Site → Domain → OU (LSDOU); बाद वाला पहले को हराता है, और "Enforced"/No Override सबसे ऊपर। सेटिंग में <b>Enabled / Disabled / Not Configured</b> — "Not Configured" मतलब छुआ नहीं, वरना आपकी सेटिंग 100 मशीनों पर fix हो जाएगी।</li>
        <li><b>लागू करना/जाँचना:</b> <code>gpupdate /force</code> (तुरंत), <code>gpresult /r</code> (कौन-सी GPO लगीं), <code>gpresult /h C:\\gp.html</code> (पूरा HTML रिपोर्ट — ऑडिट में), <code>rsop.msc</code> (Resultant Set of Policy)।</li>
        <li><b>Security Settings:</b> <code>secpol.msc</code> → Account Policies (password + lockout), Local Policies → <b>User Rights Assignment</b> (कौन लॉगिन/RDP करेगा) और <b>Security Options</b> (UAC series), Advanced Audit Policy, Software Restriction/AppLocker.</li>
      </ul>
      <table class="tbl"><tr><th>चाही गई चीज़</th><th>पथ (gpedit/secpol)</th><th>सेटिंग</th></tr>
        <tr><td>Run म्यू (Win+R) हटाना</td><td>User Config → Admin Templates → Start Menu and Taskbar</td><td><b>Remove Run menu from Start Menu</b> → Enabled</td></tr>
        <tr><td>Task Manager बंद करना</td><td>User (या Computer) Config → Admin Templates → System</td><td><b>Disable Task Manager</b> → Enabled (Ctrl+Alt+Del विकल्प भी कम हो जाते हैं)</td></tr>
        <tr><td>वॉलपेपर फ़िक्स करना</td><td>User Config → Admin Templates → Desktop → Desktop</td><td><b>Desktop Wallpaper</b> → Enabled + .jpg path + Fill (सभी users के लिए Computer Config वाली डाली में नहीं, यही सही)</td></tr>
        <tr><td>Lock screen image / हटाना</td><td>Computer या User Config → Admin Templates → Control Panel → Personalization</td><td><b>Force a specific default lock screen and logon image</b> / <b>Do not display the lock screen</b></td></tr>
        <tr><td>Feature update 30/60/180 दिन टालना</td><td>Computer Config → Admin Templates → Windows Components → Windows Update → Manage updates offered from Windows Update</td><td><b>Select when Feature Updates are received</b> → Enabled + days (Pro/Edu/Enterprise)</td></tr>
        <tr><td>Pause updates मशीन-वाइड</td><td>उसी Windows Update डाली में</td><td><b>Remove access to use all Windows Update features</b> / <b>Configure Automatic Updates</b> → Enabled (समय/श्रेणी सेट)</td></tr>
        <tr><td>Autoplay/USB autorun बंद</td><td>Computer Config → Admin Templates → Windows Components → AutoPlay Policies</td><td><b>Turn off Autoplay</b> → Enabled → All drives (दुकान में पेनड्राइव से फैलने वाले वायरस की सबसे अच्छी रोक)</td></tr>
        <tr><td>नए USB storage device को रोकना</td><td>Computer Config → Admin Templates → System → Device Installation → Device Installation Restrictions</td><td><b>Prevent installation of removable devices</b> (या "USB devices…") → Enabled</td></tr>
        <tr><td>पासवर्ड नियम (लंबाई/जटिलता)</td><td>secpol → Account Policies → Password Policy</td><td><b>Minimum password length</b> = 8, <b>Password must meet complexity requirements</b> = Enabled, <b>Enforce password history</b> = 24</td></tr>
        <tr><td>5 ग़लत पासवर्ड पर अकाउंट लॉक</td><td>secpol → Account Policies → Account Lockout Policy</td><td>Threshold 5, Duration 15 min, Reset counter 15 min (Event 4740 से जाँच)</td></tr>
        <tr><td>RDP/Guest से लॉगिन रोकना</td><td>secpol → Local Policies → User Rights Assignment</td><td><b>Deny log on through Remote Desktop Services</b> → Guests जोड़ें; <b>Allow log on locally</b> में सिर्फ़ ज़रूरी ग्रुप</td></tr>
        <tr><td>लॉगिन से पहले क़ानूनी नोटिस</td><td>secpol → Local Policies → Security Options</td><td><b>Interactive logon: Message text for users attempting to log on</b> + title (लैब/ऑफ़िस में ज़रूरी)</td></tr>
        <tr><td>regedit/Task Manager आदि से रोक (audit)</td><td>secpol → Local Policies → Audit Policy / Advanced Audit</td><td><b>Audit logon events</b>, <b>Audit object access</b> → Success+Failure (Security लॉग तभी भरता है)</td></tr>
        <tr><td>लॉगिन/स्टार्टअप स्क्रिप्ट चलाना</td><td>Computer Config → Windows Settings → Scripts (Startup/Shutdown); User Config → Scripts (Logon/Logoff)</td><td>.bat/.vbs/.ps1 path दें — साझा प्रिंटर/ड्राइव मैपिंग यहीं से</td></tr>
      </table>
      <div class="callout warn"><b class="ct">Home एडिशन में gpedit.msc/secpol.msc नहीं</b><p>Group Policy Editor सिर्फ़ <b>Pro / Enterprise / Education</b> में होता है — Home में "Windows can’t find gpedit.msc" आना गड़बड़ी नहीं, एडिशन की सीमा है। Home पर वही सेटिंग Registry value, Settings app, या PowerShell से दें (और "gpedit enabler" स्क्रिप्ट पर भरोसा न करें — आधा-अधूरा लागू होकर सिस्टम उलझा देती है)।</p></div>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.12</span> Disk Management (diskmgmt.msc) — पार्टीशन, वॉल्यूम व TRIM</h3>
      <p><b>Basic disk</b> = सामान्य (primary/extended/logical या GPT partitions)। <b>Dynamic disk</b> = volume-based (spanned/stripe/mirror/raid-5) — पुराने Windows/Boot में दिक्कत; घर/दुकान की मशीन को Basic ही रखें, क्योंकि dynamic को पढ़ने के लिए Linux/WinPE टूल्स को extra ड्राइवर चाहिए और विफल import पर पूरा डेटा जोखिम में।</p>
      <ul>
        <li><b>MBR:</b> अधिकतम <b>4 primary</b> (या 3 primary + 1 extended में logical), एक partition अधिकतम <b>2 TB</b> — 3 TB डिस्क पर 1 TB गँवाने का यही कारण है, और "unallocated space cannot be allocated" का उत्तर <b>GPT</b> है (128 partitions, 2^64-byte सैद्धांतिक सीमा, protective MBR + primary/backup GPT header)।</li>
        <li><b>UEFI इंस्टॉल का लेआउट:</b> Recovery (Windows RE) ~500–773 MB → <b>EFI System Partition</b> 100 MB FAT32 (bootloader यहीं: <code>\\EFI\\Microsoft\\Boot\\bootmgfw.efi</code>) → <b>MSR</b> 16 MB (Microsoft Reserved — कोई ड्राइव लेटर नहीं, खाली दिखता है पर ज़रूरी) → Primary (C:) → Recovery/Other। <b>BIOS/MBR</b> में इसकी जगह <b>System Reserved</b> 100–599 MB (bootmgr + BCD) रखता है। EFI, MSR और Recovery — इनमें से किसी को Disk Management से डिलीट न करें, न format करें: बूट मर जाता है और Windows के फ़ीचर अपडेट फेल होने लगते हैं।</li>
        <li><b>Extend Volume</b> केवल उसी volume पर काम करता है जिसके <b>ठीक दाईं ओर contiguous unallocated</b> हो (या बाईं ओर की खाली जगह जोड़ना Disk Management नहीं सकता) — बीच में Recovery partition आ जाए तो बटन ग्रे; हल: third-party partition tool या diskpart में volumes हटाना (डेटा उठाकर)। <b>Shrink</b> unmovable files (pagefile, MFT, System Volume Information) से सीमित है — "100 MB only" दिखाए तो pagefile अस्थायी बंद करके रीस्टार्ट करें।</li>
        <li><b>Format विकल्प:</b> NTFS allocation unit default <b>4096 bytes</b> (सामान्य); 64 KB केवल बड़े मीडिया/DB शेयर के लिए; "Perform a quick format" = MFT/सुपरफ़ॉर्मैट रीसेट, "Full" = हर सेक्टर scan (संकेत मिलने पर ही); exFAT = पेनड्राइव (Win+Mac), ReFS = storage spaces/server; FAT32 = 4 GB/f़ाइल सीमा (इसलिए बड़ा ISO पेनड्राइव पर नहीं लिखा जाता)।</li>
      </ul>
      <table class="tbl"><tr><th>RAID/वॉल्यूम प्रकार</th><th>कम-से-कम डिस्क</th><th>फ़ायदा</th><th>क्षति सहनशीलता</th></tr>
        <tr><td>Simple volume</td><td>1</td><td>साधारण partition</td><td>शून्य — डिस्क गई तो डेटा गया</td></tr>
        <tr><td>Spanned</td><td>2+</td><td>अलग-अलग साइज़ जोड़कर एक बड़ा volume</td><td>शून्य; एक डिस्क फेल = पूरा volume</td></tr>
        <tr><td>Striped (RAID 0)</td><td>2</td><td>स्पीड दोगुनी जैसी</td><td>शून्य; किसी भी डिस्क की मौत पर सब ख़त्म</td></tr>
        <tr><td>Mirrored (RAID 1)</td><td>2</td><td>पूरी नक़ल — सबसे सुरक्षित सस्ता तरीक़ा</td><td>1 डिस्क फेल चल जाता है; साइज़ आधा मिलता है</td></tr>
        <tr><td>RAID-5 (Parity)</td><td>3+</td><td>1 डिस्क की जगह parity में — सस्ता सुरक्षित, रीड तेज़</td><td>1 फेल सह जाता है; राइट धीमा</td></tr>
        <tr><td>Storage Spaces (Settings)</td><td>2+</td><td>Two-way/Mirror, Parity, resiliency + पुरानी डिस्क जोड़ना</td><td>Mirror = 1, Parity = 1–2 (सेटिंग पर)</td></tr>
      </table>
      <div class="callout tip"><b class="ct">SSD की सेहत — TRIM व Optimize Drives</b><p>SSD पर defrag बेकार और हानिकारक है; Windows वहाँ <b>TRIM</b> भेजता है। जाँच: <code>fsutil behavior query DisableDeleteNotify</code> → <b>0 = TRIM चालू</b> ("NTFS DisableDeleteNotify = 0" मिलना चाहिए), 1 = बंद। <b>Optimize Drives</b> (<code>dfrgui</code>) में हर volume का Media type (HDD/SSD) व "Scheduled optimization (Weekly)" दिखता है — HDD के लिए defrag, SSD के लिए Retrim; 4K alignment अपने आप हो जाता है जब partition Windows/Disk Management से बने। HDD पर fragments 10% से ज़्यादा हो तो optimize करें; TRIM वाले SSD पर सिर्फ़ free space 15–20% खाली रखना ज़्यादा मायने रखता है (write amplification)।</p></div>` },

    { type: 'code', code: String.raw`:: diskpart — एडमिन CMD/RE में; गलत डिस्क चुनना = डेटा ख़त्म, इसलिए list के बाद साफ़ जाँचें
diskpart
  list disk                 :: सभी डिस्क (size से पहचानें; * = selected)
  select disk 1             :: 1 नंबर वाली डिस्क चुनें
  clean                     :: पूरा partition table + डेटा मिटाएँ — अपरिवर्तनीय, पहले backup ज़रूरी
  convert gpt               :: GPT बनाएँ (MBR के लिए: convert mbr)
  create partition primary size=102400        :: 100 MB
  format quick fs=ntfs label="Data"
  assign letter=E
  create partition primary                    :: बाक़ी सारी जगह
  format quick fs=ntfs                        :: RE में C: फ़ॉर्मैट के लिए: format quick fs=ntfs
  active                                      :: केवल MBR/system partition पर (UEFI पर नहीं)
  list volume
  select volume 3
  assign letter=S           :: EFI partition को लेटर देना (boot फिक्स के लिए ज़रूरी)
  remove letter=S
  detail disk
  exit

:: एक उदाहरण: 3 TB HDD को GPT करके पूरी जगह इस्तेमाल करना
diskpart
list disk
select disk 2
clean
convert gpt
create partition primary
format quick fs=ntfs label="Storage"
assign letter=F
exit` },
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.13</span> BitLocker, Device Encryption व EFS</h3>
      <p><b>BitLocker</b> पूरे वॉल्यूम को एन्क्रिप्ट करता है (AES-128/256, XTS-CBC) — डिस्क निकालकर दूसरे PC/USB adapter पर लगाने से डेटा नहीं पढ़ा जा सकता। इसे खोलने की कुंजी <b>TPM 2.0</b> (Trusted Platform Module चिप) में रहती है, और चाहें तो <b>PIN</b> या <b>USB key</b> से जुड़ी है। Windows 11 Pro/Enterprise पर पूरा BitLocker; <b>Home</b> पर "<b>Device encryption</b>" (डिफ़ॉल्ट चालू, Microsoft अकाउंट में recovery key अपने-आप सेव) — यह हल्का संस्करण है, उसी में manage-bde के ज़्यादा विकल्प सीमित रहते हैं।</p>
      <ul>
        <li><b>Enable करने के 2 रास्ते:</b> Control Panel → BitLocker Drive Encryption → Turn on BitLocker → (1) "Choose how to unlock drive" (2) <b>recovery key कहाँ सेव करें</b> — Microsoft account / USB flash drive / file / print out → "Encrypt used disk space only" (नई मशीन) बनाम "Encrypt entire drive" (पहले से इस्तेमाल की गई — धीमा पर सुरक्षित) → "Compatible mode" (केवल used space, पेनड्राइव/बाहरी डिस्क के लिए ज़रूरी) → Encrypt → रीस्टार्ट पर BitLocker setup drive।</li>
        <li><b>Recovery key (48 अंक):</b> यह सोने की चाबी है — <b>कस्टमर को प्रिंटकर दें और अपना कॉपी अपने रिकॉर्ड में रखें</b>। देखने के लिए: <code>manage-bde -protectors -get C:</code>, या account.microsoft.com/devices/recoverykey, या AD (domain)। BIOS/UEFI firmware update, TPM reset, motherboard बदलना, boot order बदलना, BitLocker-वॉल्यूम पर <code>diskpart</code>/<code>chkdsk</code> जैसे बदलाव — इन सब पर recovery माँगा जाता है।</li>
        <li><b>BIOS/firmware अपडेट से पहले:</b> <code>manage-bde -protectors -disable C:</code> (<b>Suspend protection</b> — Control Panel में "Suspend protection") — इससे एन्क्रिप्शन चलता है पर अगले कुछ reboots पर keys नहीं माँगेगा; अपडेट के बाद अपने आप वापस protect हो जाता है (या <code>-protectors -enable C:</code>)।</li>
        <li><b>BitLocker To Go</b> (पेनड्राइव/बाहरी HDD): "Use a password to unlock the drive" + (Win7/8 के लिए compatible mode) — दूसरे PC पर unlock करने पर password/48-अंक key; "automatically unlock on this PC" विकल्प भी है।</li>
        <li><b>EFS</b> (Encrypting File System) — NTFS पर फ़ाइल/फ़ोल्डर-स्तर एन्क्रिप्शन: Properties → Advanced → <b>Encrypt contents to secure data</b>, या <code>cipher /e D:\\Secret</code>। हर यूज़र का अपना EFS सर्टिफ़िकेट — <b>export ज़रूर करें</b> (<code>certmgr.msc</code> → Personal → Certificates → Export with private key + password), वरना प्रोफ़ाइल उड़ने पर फ़ाइलें स्थायी रूप से बंद। एन्क्रिप्टेड फ़ाइल का नाम हरे रंग में दिखता है। <code>cipher /l D:\\Secret</code> से status, <code>cipher /d D:\\Secret</code> से cert हटाना/बदलना।</li>
        <li><b>कमांड से:</b> manage-bde नीचे की तालिका में — RE/Service PC पर सबसे काम का सेट।</li>
      </ul>
      <table class="tbl"><tr><th>कमांड (एडमिन)</th><th>क्या करता है</th></tr>
        <tr><td>manage-bde -status</td><td>हर volume की Protection status, Conversion state, Encryption method, Used space</td></tr>
        <tr><td>manage-bde -on C: -usedspaceonly</td><td>एन्क्रिप्शन शुरू (सिर्फ़ इस्तेमाल हुई जगह — तेज़)</td></tr>
        <tr><td>manage-bde -on D: -rp -recoverypassword</td><td>चालू करके recovery password बनाने को कहेगा</td></tr>
        <tr><td>manage-bde -protectors -add C: -pin 123456</td><td>PIN protector जोड़ें (TPM+PIN)</td></tr>
        <tr><td>manage-bde -protectors -add C: -recoverykey C:\\Keys\\C.rp49 -tpm</td><td>recovery फ़ाइल + TPM जोड़ी</td></tr>
        <tr><td>manage-bde -protectors -get C:</td><td>लगे सभी protectors (TPM/PIN/Password/Recovery key ID)</td></tr>
        <tr><td>manage-bde -autounlock -enable E:</td><td>बाहरी ड्राइव को इस PC पर अपने आप अनलॉक</td></tr>
        <tr><td>manage-bde -lock E: -forcedismount</td><td>रेडी-मूव के बाद immediately लॉक</td></tr>
        <tr><td>manage-bde -off C:</td><td>Decryption शुरू ("BitLocker turning off" — रुकवाएँ नहीं, पावर बंद न करें)</td></tr>
        <tr><td>manage-bde -forceoff -volume C:</td><td>अधूरा एन्क्रिप्शन पूरा होने तक प्रोटेक्शन स्थगित (BIOS अपडेट से पहले का पक्का तरीक़ा)</td></tr>
        <tr><td>repair-bde D: R: -rp &lt;48-digit&gt;</td><td>करप्ट_bitlocker volume को image पर ठीक करके पढ़ना (RE में)</td></tr>
        <tr><td>diskpart → select vdisk file="X.vhdx" → attach vdisk</td><td>VHD में बंद BitLocker डेटा खोलने की शुरुआत</td></tr>
      </table>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.14</span> बैकअप, सिस्टम इमेज, रिस्टोर्ड पॉइंट व "Reset this PC"</h3>
      <p><b>3-2-1 का नियम (परीक्षा व दुकान दोनों में):</b> डेटा के <b>3</b> कॉपी, <b>2</b> अलग मीडिया (SSD + बाहरी HDD/क्लाउड), <b>1</b> ऑफ़साइट (क्लाउड या दूसरी इमारत) — केवल एक ही डिस्क पर दो कॉपी रखना बैकअप नहीं है (एक spanner/एक वॉल्यूम एरर, आग या चोरी में सब एक साथ)।</p>
      <ul>
        <li><b>File History</b> (Settings → Update &amp; Security → Backup → Add a drive): ज़रूरत — <b>NTFS/reFS का दूसरा volume या नेटवर्क शेयर</b> (सिस्टम ड्राइव नहीं) और सेवा चालू; यह Documents/Desktop/Downloads/Photos/Contacts/Pictures का versioned कॉपी हर घंटे रखता है; "Advanced settings" में keep duration/RAM cache। बहाल करना: "Restore personal files" खोलकर तारीख़ चुनें।</li>
        <li><b>Backup and Restore (Windows 7)</b> — <code>wbAdmin.msc</code>: यहीं <b>Create a system image</b> है (पूरी C: की बूट-योग्य छवि बाहरी डिस्क पर) और "Create a system repair disc"। Restore: Settings → Recovery → Advanced startup → Troubleshoot → <b>System Image Recovery</b>। यह सबसे काम का टूल है — 1 घंटे में पूरी मशीन वैसी ही वापस (ड्राइवर+सॉफ़्टवेयर सहित)।</li>
        <li><b>System Restore Point</b> — Sysdm.cpl → System Protection → Configure → Turn on + Max Usage 5–10% → Create। यह <b>सिर्फ़</b> सिस्टम फ़ाइलें/Registry/प्रोग्राम वापस लाता है, आपके documents छूता नहीं; ड्राइवर ख़राब अपडेट के बाद सबसे पहला उपाय। (सिस्टम इमेज से यह अलग है — इमेज सब कुछ होती है।)</li>
        <li><b>Reset this PC</b> (Settings → Recovery): <b>Keep my files</b> (Windows दोबारा, ऐप हटेंगे, personal files बचे) / <b>Remove everything</b> (पूरी सफ़ाई; "Clean data" = zero-fill जैसा धीमा पर ज़्यादा सुरक्षित — पुरानी मशीन बेचते समय यही) / <b>Cloud download</b> (Microsoft से ताज़ा इमेज, ~4 GB, इंटरनेट चाहिए, मौजूदा install ख़राब हो तो बेहतर) बनाम <b>Local reinstall</b> (डिस्क पर मौजूदा Windows इमेज से)।</li>
        <li><b>Windows RE (WinRE) मेन्यू:</b> Troubleshoot → <b>Reset this PC</b> / <b>Advanced options</b> → Startup Repair · <b>Uninstall Updates</b> (quality/feature) · <b>System Restore</b> · <b>System Image Recovery</b> · <b>Startup Settings</b> (Safe Mode/Networking/Command Prompt) · <b>Command Prompt</b> · (UEFI Firmware Settings)। RE न खुले तो इंस्टॉलेशन USB/DVD से बूट करके "Repair your computer"।</li>
        <li><b>कमांड लाइन (RE या चलते Windows):</b> <code>chkdsk c: /f /r</code> · <code>sfc /scannow /offbootdir=C:\\ /offwindir=C:\\Windows</code> (RE में offline) · <code>DISM /Image:C:\\ /Cleanup-Image /RestoreHealth</code> (mount किए image पर) · <code>bootrec /fixmbr /fixboot /scanos /rebuildbcd</code> · <code>bcdboot C:\\Windows /s S: /f UEFI</code> · <code>wbadmin get versions</code> · <code>wbadmin enable backup</code> (scheduled) · <code>wbadmin start backup -backupTarget:E: -include:C: -allCritical -quiet</code> (कमांड से सिस्टम इमेज) · <code>wbadmin start systemstaterecovery -version:…</code></li>
        <li><b>Image/डिप्लॉयमेंट (लैब के लिए):</b> एक आदर्श PC बनाकर <code>C:\\Windows\\System32\\Sysprep\\sysprep.exe /generalize /oobe /shutdown</code> (generalize = SID/hardware-specific हटाना — क्लोन बनाने से पहले अनिवार्य, वरना हर PC का SID एक जैसा और NetBIOS conflict), फिर उस disk की छवि (DISM capture / Macrium / Clonezilla) लेकर 20 PC पर उतारना। <b>unattend.xml</b> (Windows System Image Manager से) region/language/admin account/join domain जवाब देकर OOBE चुप करा देता है; <b>WinPE</b> (ADK) बूट करने वाला मिनी Windows है जिससे diskpart/DISM/imagex चलते हैं। DISM से छवि पढ़ना/बदलना: <code>dism /Mount-Image /ImageFile:install.wim /index:1 /MountDir:C:\\M</code>, <code>/Add-Driver</code>, <code>/Capture-Image</code>, <code>/Commit-Image</code>।</li>
      </ul>
      <table class="tbl"><tr><th>टूल</th><th>क्या बचाता है</th><th>कब उपयोग</th></tr>
        <tr><td>File History</td><td>Personal folders के पुराने versions</td><td>ग़लती से overwrite/delete हुई DOC/XLS वापस लानी हो</td></tr>
        <tr><td>Backup and Restore (Windows 7) / wbadmin</td><td>पूरी disk की system image + फ़ाइल backup</td><td>नई SSD पर पूरी मशीन शिफ़्ट; "image" से रिस्टोर</td></tr>
        <tr><td>System Restore point</td><td>Windows + programs (डेटा नहीं)</td><td>ड्राइवर/अपडेट के बाद मशीन बिगड़ी</td></tr>
        <tr><td>OneDrive Known Folder Move</td><td>Desktop/Documents/Pictures का क्लाउड version</td><td>मशीन चोरी/मरने पर भी डेटा बचा; Settings → Accounts → Sync</td></tr>
        <tr><td>Third-party (Macrium Reflect Free / Veeam / AOMEI)</td><td>block-level image, incremental, bare-metal restore</td><td>दुकान का नियमित रखरखाव — 15 मिनट में पूरी disk image</td></tr>
        <tr><td>Reset this PC</td><td>Windows reinstall (डेटा रखकर या हटाकर)</td><td>सिस्टम इतना गंदा/इंफ़ेक्टेड कि रिपेयर न हो</td></tr>
        <tr><td>Clean install + restore image</td><td>सब कुछ</td><td>मालवेयर/बूट मरा; सबसे भरोसेमंद समाधान</td></tr>
      </table>
      <h4 class="blk2">3.14.1 मासिक रखरखाव व परफ़ॉर्मेंस चेकलिस्ट</h4>
      <table class="tbl"><tr><th>काम</th><th>कैसे</th><th>क्यों/कब</th></tr>
        <tr><td>Startup ऐप्स साफ़</td><td>Task Manager → Startup → High impact वाले Disable; <code>taskschd.msc</code> में Scheduled Tasks (Log on) जाँचें</td><td>बूट 20–60 सेकंड तेज़; हर 3 महीने</td></tr>
        <tr><td>Visual effects हल्के</td><td><code>sysdm.cpl</code> → Advanced → Performance Settings → "Adjust for best performance" या Custom (Font smoothing रखें)</td><td>4 GB RAM / पुराने iGPU पर</td></tr>
        <tr><td>Power plan</td><td><code>powercfg.cpl</code> → High performance (डेस्कटॉप) / Balanced (लैपटॉप); <code>powercfg /batteryreport</code> लैपटॉप की बैटरी सेहत</td><td>बूट/थ्रॉटल शिकायत पर</td></tr>
        <tr><td>खाली जगह</td><td>Storage sense चालू (Settings → System → Storage); <code>cleanmgr</code> → Clean up system files (Windows Update cleanup, previous installs); Temp: <code>%temp%</code>, <code>C:\\Windows\\Temp</code>, <code>cleanmgr /sagerun:1</code>; Prefetch <code>C:\\Windows\\Prefetch</code> (सिर्फ़ ज़रूरत पर)</td><td>C: पर कम-से-कम 15–20% खाली — वरना अपडेट/SSD/TRIM व pagefile मरते हैं</td></tr>
        <tr><td>Indexing सीमित</td><td>Options → Indexing Options → Modify (सिर्फ़ ज़रूरी folders), या WSearch Manual</td><td>HDD पर disk 100% घटाने</td></tr>
        <tr><td>SysMain (Superfetch)</td><td>services.msc → SysMain → Manual (केवल HDD पर)</td><td>बूट के 10 मिनट का 100% डिस्क शोर</td></tr>
        <tr><td>ड्राइवर अपडेट डिलीवरी बंद</td><td>Settings → Windows Update → Advanced → Receive updates for other Microsoft products / (GP: "Do not include drivers with Windows Updates")</td><td>GPU/ऑडियो ड्राइवर का अनचाहा बदलाव रोकने</td></tr>
        <tr><td>Tips/सिंक/एड बंद</td><td>Settings → Privacy → General (advertising ID, "Show suggested content"), Personalization → Start ("Show suggestions"), Accounts → Sync</td><td>बैंडविड्थ व ध्यान दोनों बचाते हैं</td></tr>
        <tr><td>सिस्टम हेल्थ</td><td><code>DISM /Online /Cleanup-Image /ScanHealth</code> → <code>/RestoreHealth</code>, फिर <code>sfc /scannow</code> (Windows Repair console में)</td><td>अपडेट फेल / "Windows Explorer crashed" बार-बार</td></tr>
        <tr><td>डिस्क जाँच</td><td><code>chkdsk C: /scan</code> (चलते Windows, offline नहीं), <code>/spotfix</code> तुरंत मरम्मत, <code>/f /r</code> रीस्टार्ट-पेंडिंग (2–3 घंटे) — और SMART (CrystalDiskInfo)</td><td>6 महीने में एक बार; "dirty bit" लगा हो तो तुरंत</td></tr>
        <tr><td>Optimize drives</td><td><code>dfrgui</code> → Analyze → Optimize (schedule Weekly)</td><td>HDD defrag, SSD retrim</td></tr>
        <tr><td>Trimmed services/tasks</td><td>msconfig → Services → Hide all Microsoft → शक़ वाले बंद; taskschd.msc में शक़्क़ुलना task Disable</td><td>राम/बैटरी चूसने वाले updater/टूलकिट</td></tr>
        <tr><td>बैकअप जाँच</td><td>पिछली system image की तारीख़ देखें, 1 फ़ाइल restore करके <b>सत्यापित</b> करें</td><td>हर महीने — बिना जाँचे बैकअप सिर्फ़ उम्मीद है</td></tr>
      </table>` },

    { type: 'acc', items: [
      { q: 'ग्राहक का पासवर्ड भूल गया — डेटा न खोए लॉगिन कैसे?', a: 'पहले <b>Microsoft अकाउंट</b> पहचानें: दूसरे फ़ोन/PC से <code>account.live.com/password/reset</code> पर OTP से रीसेट — मशीन पर कोई छेड़छाड़ नहीं। <b>लोकल अकाउंट</b> हो और पासवर्ड-रीसेट डिस्क न बनी हो, तो सुरक्षित रास्ता: उसी मशीन पर दूसरा एडमिन अकाउंट बनाकर प्रोफ़ाइल का डेटा कॉपी करना। बाक़ी तकनीकें (hacking tools) ग्राहक की लिखित अनुमति और डेटा-जोखिम बताने के बाद ही — और यह स्पष्ट कीजिए कि यह उसका अपना सिस्टम है।' },
      { q: 'C:\\Users\\AppData में से क्या हटा सकते हैं?', a: '<b>AppData\\Local\\Temp</b> और ब्राउज़र cache हटा सकते हैं। पर ऐप के <b>AppData\\Local\\&lt;ऐप&gt;</b> व <b>Roaming\\&lt;ऐप&gt;</b> में सेटिंग्स, प्रोफ़ाइल, डेटाबेस, लाइसेंस रहते हैं — ग़लती से हटाने पर WhatsApp/Chrome/Outlook प्रोफ़ाइल, गेम सेव और Tally/Busy जैसा सॉफ़्टवेयर डेटा उड़ सकता है। पहले पूरा फ़ोल्डर rename (Delete नहीं) करके ऐप चलाकर देखें।'},
      { q: 'NTFS परमिशन बदलने से पहले क्या ज़रूरी है?', a: 'ACL का बैकअप — <code>icacls D:\\Data /save D:\\acl.txt</code>, और सिस्टम रिस्टोर पॉइंट। C:\\Windows, Program Files, Users\\Default, System Volume Information के ACL न बदलें; बदलने पर Store/Update/Boot टूटते हैं और मरम्मत का एकमात्र रास्ता repair install/reinstall रहता है।'},
      { q: 'Device Manager में Code 43 आ रहा है — हार्डवेया ख़राब या ड्राइवर?', a: 'क्रम आज़माएँ: दूसरा पोर्ट/केबल → ड्राइवर साफ़ करके (Uninstall + delete driver, फिर DDU जैसा क्लीनर) ताज़ा ड्राइवर → तापमान/पावर जाँच → अगर GPU है तो अलग PSU केबल (daisy-chain नहीं) → दूसरी मशीन पर लगाकर swap test। दूसरी मशीन पर भी Code 43 आए तो डिवाइस ही बदलना पड़ेगा।'},
      { q: 'सर्विसेज़ disable करने का सुरक्षित तरीक़ा?', a: 'एक बार में एक सेवा, Manual (Disabled से बेहतर — ज़रूरत पर चल जाती है), और काम बिगड़े तो तुरंत वापस। सूची/नोट बनाए रखें। System Critical सेवाएँ (rpcss, dcomlaunch, lsass से जुड़ी, PlugPlay) कभी न छेड़ें; सबसे अच्छा practice — पहले clean boot (msconfig) से दोषी खोजें।'},
      { q: 'Registry tweak के बाद Start menu/Store नहीं खुल रहा', a: 'वही key import करके पुरानी मान लौटाएँ (इसलिए Export ज़रूरी था)। नंबर हो तो System Restore point से लौटें, या नए यूज़र बनाकर देखें (HKCU की गड़बड़ HKCU में सीमित रहती है), फिर <code>DISM /Online /Cleanup-Image /RestoreHealth</code> + <code>sfc /scannow</code>, और फिर भी न हो तो repair install (setup.exe से "Keep personal files and apps")।'},
      { q: 'BitLocker ON है, अब BIOS अपडेट करना है — क्या खो जाएगा?', a: 'नहीं, बशर्ते <b>recovery key</b> आपके पास हो। अपडेट से पहले <code>manage-bde -protectors -disable C:</code> (Suspend protection) करें, अपडेट के बाद खुद re-protect। key का प्रिंट/फ़ाइल कस्टमर को दें और रिकॉर्ड में रखें — TPM reset/motherboard बदलने पर यही 48 अंक बचाते हैं।'},
      { q: 'System Restore, System Image और Backup — फ़र्क़?', a: '<b>Restore point</b> = सिस्टम फ़ाइलें/प्रोग्राम पुरानी स्थिति में (डेटा नहीं), <b>System Image</b> = पूरी disk की छवि (सब कुछ, बाहरी डिस्क पर), <b>File History/Backup</b> = सिर्फ़ फ़ाइलें। दुकान में बेस्ट: हर साफ़ install के बाद system image + महीने में File History।' },
      { q: '3-2-1 rule क्या है और ITI परीक्षा में कैसे लिखें?', a: '<b>3</b> प्रतियाँ, <b>2</b> अलग-अलग प्रकार के मीडिया, <b>1</b> ऑफ़साइट (क्लाउड/दूसरी जगह)। साथ लिखें: backup कभी verify करना (restore drill), एन्क्रिप्शन/पासवर्ड, और schedule — यही पूरा उत्तर माना जाता है।' }
    ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा व इंटरव्यू में सबसे ज़्यादा पूछे जाने वाले', html: '<ol><li><b>net user / net localgroup</b> का सिंटेक्स (यूज़र बनाना, पासवर्ड, group में जोड़ना) — कमांड लिखकर बोलने को कहा जाता है।</li><li><b>NTFS में सबसे पहले कौन सी पंक्ति पढ़ी जाती है → Deny</b>, और Share+NTFS का effective सबसे <b>restrictive</b>।</li><li>UAC के स्तर व <b>consent बनाम credential prompt</b>।</li><li><b>Temporary profile</b> का कारण (NTUSER.DAT लोड न होना) और हल।</li><li>Device Manager <b>Code 28 = ड्राइवर इंस्टॉल नहीं, Code 10 = start नहीं, Code 43 = रिपोर्ट की गड़बड़ी, Code 45 = डिवाइस जुड़ा नहीं</b> — ये चार कंठस्थ।</li><li>सेवा के Start मान: <b>2 Automatic, 3 Manual, 4 Disabled</b>।</li><li>Registry के 5 hive पूरे नाम से (HKEY_CURRENT_USER = NTUSER.DAT आदि)।</li><li><b>gpupdate /force</b>, <b>secpol.msc</b> में password complexity/length, और <b>Home एडिशन में gpedit नहीं</b>।</li><li>MBR की <b>4 primary partition व 2 TB</b> सीमा, GPT में <b>128</b>, और <b>EFI/MSR/Recovery</b> को डिलीट न करने का कारण।</li><li>बैकअप के <b>3-2-1</b> नियम व <b>chkdsk /f /r</b>, <b>sfc /scannow</b>, <b>DISM /RestoreHealth</b> का क्रम (पहले DISM, फिर SFC जब component store ख़राब हो)।</li></ol>' }
  ]
},

/* ===================================================================
   CMD व PowerShell कमांड
   =================================================================== */
{
  id: 'win-cli', icon: '⌨️', group: 'विंडोज़ मास्टरक्लास',
  title: 'CMD व PowerShell कमांड',
  sub: '60+ कमांड, शेल स्क्रिप्टिंग, WMI/CIM और DISM/SFC',
  kicker: 'Windows Masterclass 4 · CMD & PowerShell',
  hero: 'डुकान पर जाम मशीन, रिमोट PC या बूट न होने वाली Windows — तीनों में <b>CMD और PowerShell</b> की कमांड ही सबसे तेज़ रास्ता हैं। यहाँ 60+ असली कमांड, तीन पूरे स्क्रिप्ट और दोनों शेल की तुलना है।',
  tags: ['CMD बेसिक्स', 'बैच फ़ाइल (.bat)', 'नेटवर्क डिबगिंग', 'PowerShell पाइपलाइन', 'रीमोट कमांड'],
  blocks: [
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.1</span> CMD (Command Prompt) की नींव</h3>
      <p>खोलने के तरीक़े: Start में <code>cmd</code> → Right-click → <b>Run as administrator</b> (title bar पर "Administrator: Command Prompt" दिखे), या <code>Win+X</code> → Terminal (Admin) / Command Prompt (Admin), या Run में <code>cmd</code>, या RE/इंस्टॉलर में <code>Shift+F10</code>। <b>एडमिन बनाम साधारण प्रॉम्प्ट का फ़र्क़:</b> सिस्टम ड्राइव, HKLM, सर्विसेज़, फ़ायरवॉल और शैडो कॉपी वाले कमांड सिर्फ़ elevated prompt में चलते हैं — "Access is denied"/"The requested operation requires elevation (Run as administrator)" दिखे तो यही कमी है।</p>
      <ul>
        <li><b>Prompt का रूप:</b> <code>PROMPT $P$G</code> = वर्तमान Path + <b>&gt;</b> (डिफ़ॉल्ट)। अन्य meta: <code>$N</code> ड्राइव, <code>$D</code> तारीख़, <code>$T</code> समय, <code>$_</code> स्पेस, <code>$L</code> &lt;, <code>$G</code> &gt;, <code>$B</code> |, <code>$Q</code> =, <code>$$</code> $, <code>$V</code> Windows वर्ज़न। मिसाल: <code>PROMPT $D $T $_$P$G</code>। डिफ़ॉल्ट पर वापसी: <code>PROMPT</code> (बिना आर्गुमेंट)।</li>
        <li><b>ड्राइव/फ़ोल्डर बदलना:</b> <code>D:</code> से ड्राइव बदलती है (cd सिर्फ़ उसी ड्राइव के अंदर चलता है), <code>cd /d D:\\Projects</code> एक ही बार में ड्राइव+फ़ोल्डर। <code>cd ..</code> ऊपर, <code>cd \\</code> रूट, <code>cd</code> अकेला = मौजूदा path। <code>pushd \\\\server\\share</code> स्थानीय लेटर देकर फ़ोल्डर खोलता है, <code>popd</code> वापसी + वह अस्थायी लेटर हटाता है।</li>
        <li><b>टैब</b> = फ़ाइल/फ़ोल्डर पूरा करना (दोबारा दबाने पर विकल्प सूची), <b>↑/↓</b> या <b>F7</b> = कमांड हिस्ट्री (F7 खिड़की खोलता है, F8 टाइप करके खोजता है), <code>doskey /history</code> = सूची; <b>Ctrl+C</b> = रोकें/abort; पुरानी विंडो में Ctrl+V न चले तो Right-click से पेस्ट करें (या Properties → QuickEdit Mode)।</li>
        <li><b>Redirection व pipe:</b> <code>dir &gt; out.txt</code> (बनाएँ/ओवरराइट), <code>&gt;&gt;</code> (जोड़ें), <code>2&gt;&amp;1</code> (error भी फ़ाइल में), <code>&gt;nul</code> (आउटपुट फेंकें), <code>type file | find /i "ip"</code>, <code>more</code> से स्क्रीन-दर-स्क्रीन। <code>cls</code> स्क्रीन साफ़, <code>title BSOD-fix</code> विंडो का नाम, <code>color 0A</code>।</li>
        <li><b>दूसरे यूज़र/PowerShell:</b> <code>runas /user:Rahul cmd</code>, <code>runas /savecred /user:admin "notepad.exe"</code>, प्रॉम्प्ट से <code>powershell</code> (5.1) या <code>pwsh</code> (7), एक ही लाइन में: <code>powershell -NoProfile -Command "Get-Date"</code>।</li>
        <li><b>Exit code:</b> हर कमांड एक नंबर छोड़ती है — <code>echo %errorlevel%</code>; <code>if errorlevel 1</code> (1 या उससे ज़्यादा) बनाम <code>if %ERRORLEVEL% EQU 0</code> (बराबर)। 0 = सफलता। robocopy में 0–7 "सफल" के अलग-अलग मतलब हैं और 8+ विफलता — स्क्रिप्ट लिखते समय यही पकड़ में आता है।</li>
      </ul>
      <div class="callout info"><b class="ct">कमांड का मतलब पूछने का आसान तरीक़ा</b><p><code>/?</code> लगभग हर CMD कमांड के साथ काम करता है — <code>robocopy /?</code>, <code>net user /?</code>, <code>ipconfig /?</code>। built-in help: <code>help</code> (सूची), <code>help find</code>, और <code>cmd /?</code>, <code>for /?</code>, <code>if /?</code>। PowerShell में वही काम <code>Get-Help</code> करता है।</p></div>` },

    { type: 'table', head: ['कमांड', 'क्या करती है', 'व्यावहारिक उदाहरण'],
      rows: [
        ['cd /d X:\\Path', 'ड्राइव + डायरेक्टरी एक साथ बदलें', 'cd /d "C:\\Program Files\\MyApp"'],
        ['pushd / popd', 'फ़ोल्डर स्टैक; UNC पाथ पर अस्थायी ड्राइव लेटर', 'pushd \\\\192.168.1.10\\Accounts … popd'],
        ['dir /a /o-d /b /s', 'सब (hidden+system) / date का उलटा क्रम / सिर्फ़ नाम / सब-फ़ोल्डर सहित', 'dir /a-d /o-d /b D:\\Downloads'],
        ['tree /f /a', 'फ़ोल्डर-ढाँचा (फ़ाइलों के नाम, plain ASCII)', 'tree D:\\Backup /f &gt; struct.txt'],
        ['type / more / sort', 'फ़ाइल स्क्रीन पर / पेज-दर-पेज / क्रम से', 'type win.ini | more  ;  sort /r file.txt'],
        ['find / findstr', 'टेक्स्ट खोजना (find सरल, findstr regex+सब-फ़ोल्डर)', 'findstr /i /s /c:"error code" C:\\Logs\\*.txt'],
        ['where', 'कमांड/फ़ाइल की असल लोकेशन (PATH या पूरा रूट)', 'where notepad.exe ; where /r C:\\Users *.pst'],
        ['copy / xcopy / robocopy', 'कॉपी — साधारण / ट्री सहित / mirror+resume वाला मज़बूत', 'robocopy D:\\Data E:\\Data /MIR /R:1 /W:1 /NP /LOG:D:\\bak.log'],
        ['move / ren / del / rd / md', 'shift+rename / डिलीट / फ़ोल्डर हटाना / बनाना', 'del /f /s /q "%TEMP%\\*.*" ; rd /s /q C:\\old'],
        ['attrib / compact / cipher', 'छिपा-सिस्टम-flag / NTFS संपीड़न / एन्क्रिप्ट व free-space wipe', 'attrib -h -s -r /s /d F:\\* ; cipher /w:C:\\'],
        ['mklink', 'सिंबोलिक लिंक (/D), हार्ड लिंक (/H), जंक्शन (/J)', 'mklink /J C:\\Users\\Rahul\\Desktop D:\\Desktop'],
        ['subst / net use', 'फ़ोल्डर को ड्राइव लेटर / नेटवर्क शेयर को लेटर', 'subst X: D:\\Work ; net use Z: \\\\PC\\Share /persistent:yes'],
        ['echo / cls / title / pause / timeout', 'प्रिंट / साफ़ / विंडो नाम / रुकें / N सेकंड', 'timeout /t 5 /nobreak &gt;nul'],
        ['set / set /a / set /p', 'वेरिएबल / अंकगणित / यूज़र से इनपुट', 'set /a sum=a+b ; set /p ans=Continue?'],
        ['start', 'नई विंडो/ऐप/URL, बिना इंतज़ार (/wait से इंतज़ार)', 'start "" "https://support.microsoft.com"'],
        ['runas', 'दूसरे यूज़र के अधिकार से प्रोग्राम', 'runas /user:Administrator cmd'],
        ['cmd /c और /k', '/c कमांड चलाकर बंद, /k खुला रहे', 'cmd /k "ipconfig /all"'],
        ['doskey /macro:all', 'अपने मैक्रो व हिस्ट्री दिखाएँ', 'doskey ls=dir /a-d /b $*'],
        ['exit / exit /b N', 'शेल/स्क्रिप्ट बंद, exit code सहित', 'exit /b 2  (अगली लाइन errorlevel 2)']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.2</span> फ़ाइल/डायरेक्टरी कमांड — असल दुकान के काम</h3>
      <p>चार कमांडों की मज़बूती अलग-अलग है: <b>copy</b> (साधारण; <code>/b</code> से बाइनरी जोड़ना, <code>/y</code> बिना पूछे ओवरराइट), <b>xcopy</b> (पूरा फ़ोल्डर ट्री — <code>/e /i /h /k /o /y</code>), <b>robocopy</b> (resume, retry, mirror, log, multithread — बड़े बैकअप का राजा) और <b>move / del / rd</b>। याद रखिए — <code>del</code> और <code>rd /s /q</code> <b>recycle bin में नहीं डालते, तुरंत मिटाते हैं</b>; गलती हो जाए तो लिखना-पढ़ना बंद करके Recuva/PhotoRec (अध्याय "स्टोरेज") तुरंत चलाइए।</p>` },

    { type: 'table', head: ['कमांड (जैसी टाइप करें)', 'मतलब / आउटपुट', 'कब काम आती है'],
      rows: [
        ['dir', 'नाम, तारीख़, साइज़, &lt;DIR&gt; और अंत में कुल', 'फ़ोल्डर की पहचान'],
        ['dir /a', 'Hidden (h), System (s), Archive (a) सहित सब', 'attrib-वाली छुपी फ़ाइलें पकड़ना'],
        ['dir /s /a-d', 'सब-फ़ोल्डर की सिर्फ़ फ़ाइलें', 'कौन-सा फ़ोल्डर जगह खा रहा है'],
        ['dir /o-d /b', 'नई→पुरानी क्रम में सिर्फ़ नाम', 'latest backup/log चुनना'],
        ['attrib +h -r file.txt', 'hidden लगाएँ, read-only हटाएँ; /s /d पूरे tree पर', '"Cannot save" व पेनड्राइव की छुपी फ़ाइलें'],
        ['copy /y a.txt b.txt', 'बिना पूछे ओवरराइट', 'config replace (स्क्रिप्ट में)'],
        ['copy /b 1.dat+2.dat all.dat', 'बाइनरी फ़ाइलें जोड़ना', 'split डाउनलोड जोड़ना'],
        ['xcopy D:\\Src D:\\Dst /e /i /h /y', '/e खाली फ़ोल्डर भी, /i destination folder मानो, /h hidden भी, /y बिना पूछे', 'प्रोफ़ाइल कॉपी (robocopy से पहले का मानक)'],
        ['robocopy D:\\Src D:\\Dst /MIR', 'mirror — destination की अतिरिक्त फ़ाइलें भी हटाएँ', 'साफ़ नक़ल; <b>ग़लत destination = डेटा हानि</b>'],
        ['robocopy /R:2 /W:5 /NP /MT:8', 'retry 2 बार, 5 सेकंड रुकें, progress छिपाएँ, 8 thread', 'नेटवर्क कॉपी तेज़ व लॉग-योग्य'],
        ['robocopy src dst /L /NDL /NS', 'dry-run — सूची दिखाएगा, कुछ बदलेगा नहीं', 'बड़े /MIR से पहले एक बार ज़रूर'],
        ['robocopy … /XD "Temp" /XF *.tmp', 'फ़ोल्डर/फ़ाइल छोड़कर कॉपी', 'कैश-टेम्पोरेरी बैकअप से बाहर'],
        ['move D:\\a.txt D:\\b\\', 'rename/move (दूसरी डिस्क पर = कॉपी+डिलीट)', 'फ़ोल्डर शिफ़्ट'],
        ['ren *.JPG *.jpg', 'एक ही टाइप के नाम बदलें (लूप ज़्यादा सुरक्षित)', 'कैमरा फ़ाइल का केस ठीक करना'],
        ['del /f /s /q C:\\Path\\*.*', 'force, सब-फ़ोल्डर, बिना पूछे डिलीट', 'टेम्पोरेरी फ़ाइलें — पहले dir से देख लें'],
        ['rd /s /q C:\\Folder', 'पूरा tree चुपचाप हटाएँ', 'अधूरे uninstall का अवशेष'],
        ['md D:\\a\\b\\c', 'नेस्टेड फ़ोल्डर (Win10 1809+ में /p ज़रूरी नहीं)', 'बैकअप स्ट्रक्चर बनाना'],
        ['fc /b f1 f2', 'दो फ़ाइलों का बाइट-दर-बाइट अंतर', 'कॉपी सत्यापन, config diff'],
        ['comp a.bin b.bin /d /c:100', 'बाइनरी तुलना — /d decimal, /c कितने बाइट', 'छोटी फ़ाइलों की त्वरित जाँच'],
        ['compact /c /s /i D:\\Data', 'NTFS संपीड़न (LZX) — जगह बचत', 'पुराने PC में 5–15% जगह'],
        ['cipher /w:C:\\', 'मिटी फ़ाइलों वाला free space ज़ीरो करना', 'मशीन बेचने से पहले (SSD पर TRIM के कारण असर सीमित)'],
        ['mklink /J C:\\Link D:\\Real', 'junction — Explorer/CMD में असली फ़ोल्डर जैसा', 'C: भरी हो तो बड़ा फ़ोल्डर D: पर रखकर लिंक'],
        ['forfiles /p D:\\Logs /m *.log /d -30 /c "cmd /c del @path"', '30 दिन से पुरानी फ़ाइलें हटाएँ', 'रीटेंशन पॉलिसी (tokens: @file @path @fsize @fdate)'],
        ['fsutil file createnew C:\\test.bin 1048576', 'नक़ली फ़ाइल बनाकर साइज़/गति जाँच', 'डिस्क व नेटवर्क कॉपी टेस्ट']
      ] },

    { type: 'table', head: ['खोज/तुलना कमांड', 'सिंटेक्स', 'क्या छपाई/करती है'],
      rows: [
        ['find (सरल)', 'find /i /n /c /v "text" file.txt', '/i केस-लेस, /n लाइन नंबर, /c गिनती, /v उलटा (जिसमें न हो)'],
        ['findstr (मज़बूत)', 'findstr /i /s /r /c:"192.168.1.*" *.txt', '/s सब-फ़ोल्डर, /r regex, /c space वाला वाक्यांश, /b /e शुरू-अंत से मैच, /v exclude, /m सिर्फ़ फ़ाइल का नाम'],
        ['findstr + pipe', 'ipconfig /all | findstr /i "physical address"', 'MAC/IPv4 तुरंत काटना'],
        ['where', 'where /r C:\\Users *.xlsx', 'नाम से फ़ाइल खोजना (PATH में नहीं)'],
        ['fc', 'fc /n /l a.txt b.txt', 'अलग लाइनें दिखाएँ (/n नंबर, /l केस-इनसेंटिव, /t tabs, /b binary)'],
        ['sort', 'dir /b | sort /+5', 'ASCII क्रम; /r उलटा, /+n offset से तुलना'],
        ['more', 'type big.txt | more +20', 'पेज-बाउज़; +n लाइनें छोड़ें'],
        ['type', 'type C:\\Windows\\win.ini', 'कंटेंट सीधे स्क्रीन पर'],
        ['Get-ChildItem + Select-String', 'Get-ChildItem -Recurse | Select-String -Pattern "BSOD"', 'findstr से बेहतर: फ़ाइल+लाइन+कॉलम व Context'],
        ['wevtutil qe', 'wevtutil qe System /q:"*[System[(Level=2)]]" /c:5 /rd:true /f:text', 'Event Viewer खोले बिना सबसे नए 5 Error इवेंट'],
        ['schtasks /query', 'schtasks /query /fo LIST /v', 'सभी scheduled tasks की अगली रन टाइम व command']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.3</span> बैच फ़ाइल (.bat/.cmd) स्क्रिप्टिंग</h3>
      <p>बैच = कमांडों की सूची फ़ाइल में; Notepad से लिखकर <b>Save As → All Files → backup.bat</b>, फिर Right-click → Run as administrator। पहली लाइन <code>@echo off</code> रखें ताकि हर कमांड स्क्रीन पर न छपे।</p>
      <ul>
        <li><b>%1 %2…%9</b> आर्गुमेंट, <b>%~f0</b> स्क्रिप्ट की पूरी path, <b>%~dp0</b> उसका फ़ोल्डर ("अपने ही फ़ोल्डर में काम करना" इसी से सुरक्षित होता है)। built-in: <code>%DATE% %TIME% %COMPUTERNAME% %USERNAME% %USERPROFILE% %TEMP% %SYSTEMROOT% %PROCESSOR_ARCHITECTURE% %LOGONSERVER%</code>।</li>
        <li><b>CMD प्रॉम्प्ट पर <code>%a</code>, बैच फ़ाइल में <code>%%a</code></b> — यही सबसे आम "for loop नहीं चल रहा" का कारण है।</li>
        <li><b>शर्तें:</b> <code>if exist</code>, <code>if not exist</code>, <code>if /i "%ans%"=="y"</code> (/i केस-इनसेंटिव), <code>if %n% GTR 5</code> (EQU NEQ LSS LEQ GEQ GTR), <code>if errorlevel 1</code> (1 या ज़्यादा)। खाली वेरिएबल से बचने के लिए कोटेशन: <code>if "%v%"==""</code>।</li>
        <li><b>Delayed expansion:</b> लूप के अंदर बदले वेरिएबल पढ़ने के लिए <code>setlocal enabledelayedexpansion</code> और <code>!counter!</code> — <code>%counter%</code> लूप से पहले ही evaluate हो जाता है।</li>
        <li><b>सब्रूटीन व कंट्रोल:</b> <code>call :label args</code> … <code>goto :eof</code> (फ़ाइल के अंदर ही दोबारा इस्तेमाल), <code>call other.bat</code>, <code>goto :loop</code>, <code>shift</code>, <code>exit /b %ERRORLEVEL%</code>। कमेंट के लिए <code>rem</code> सुरक्षित (<code>::</code> सिर्फ़ लाइन-हेड पर, block के अंदर नहीं)।</li>
        <li><b>चलाने के 3 तरीक़े:</b> डबल-क्लिक (खिड़की खुलकर बंद — टेस्ट के लिए <code>pause</code> डालें), Right-click → Run as administrator, और <code>schtasks</code> से तय समय पर (नीचे कोड में पूरा उदाहरण)। स्क्रिप्ट invisible चलानी हो तो <code>wscript.exe //b script.bat</code> या Task में "Run whether user is logged on or not" + Hidden。</li>
      </ul>` },

    { type: 'table', head: ['सिंटेक्स', 'क्या करता है', 'नमूना'],
      rows: [
        ['set VAR=value', 'वेरिएबल (equals के आसपास स्पेस न दें)', 'set "OUT=D:\\Backup"'],
        ['set /a n=n+1', 'पूर्णांक अंकगणित', 'set /a free=total-used'],
        ['set /p ans=?', 'यूज़र से इनपुट', 'set /p ans=Continue (Y/N)? '],
        ['if exist … else …', 'फ़ाइल/फ़ोल्डर की मौजूदगी', 'if not exist "%OUT%" md "%OUT%"'],
        ['if /i "%1"=="help" goto :usage', 'केस-इनसेंटिव तुलना', 'आर्गुमेंट हैंडलिंग'],
        ['if %n% GTR 5 …', 'अंक तुलना (EQU NEQ LSS LEQ GEQ GTR)', 'if %ERRORLEVEL% GEQ 8 echo FAIL'],
        ['for %%F in (*.txt) do …', 'एक फ़ोल्डर की फ़ाइलें', 'for %%F in (*.log) do del "%%F"'],
        ['for /d %%D in (C:\\Users\\*) do', 'सिर्फ़ डायरेक्टरीज़', 'हर प्रोफ़ाइल पर एक काम'],
        ['for /r %%F in (*.pst) do', 'पूरे tree में खोजना', 'सभी Outlook डेटा फ़ाइलें गिनना'],
        ['for /l %%i in (1,1,20) do', 'रेंज लूप (start, step, end)', 'for /l %%i in (1,1,20) do ping -n 1 192.168.1.%%i'],
        ['for /f "tokens=1,3 delims=," %%a in (file.csv) do', 'टेक्स्ट/कमांड आउटपुट टुकड़ों में तोड़ना', 'for /f "skip=1 tokens=2" %%i in (\'tasklist /fi "imagename eq notepad.exe"\') do echo %%i'],
        ['for /f "usebackq delims=" %%i in (`command`) do', 'कमांड के आउटपुट को वेरिएबल में', 'date-stamp, BIOS version पकड़ना'],
        ['forfiles … /c "cmd /c del @path"', 'पुरानी/बड़ी फ़ाइलें चुनकर कमांड', '/d -30 दिन, /s +2 (साइज़), @file @path @fsize'],
        ['call :label args … goto :eof', 'फ़ाइल-भीतरी सब्रूटीन', 'call :log "step 1 done"'],
        ['shift', '%1 से आगे खिसकाएँ', 'गिनती-रहित arguments पढ़ने वाला लूप'],
        ['start /wait /min "" prog', 'इंतज़ार / मिनिमाइज़्ड', 'start /wait msiexec /i app.msi /qn'],
        ['timeout /t 3 /nobreak &gt;nul', '3 सेकंड रुकें (की दबाने पर न टूटे)', 'install steps के बीच में'],
        ['choice /c YN /m "Format disk?"', 'बटन-वाला सवाल, errorlevel लौटाता है', 'ख़तरनाक स्क्रिप्ट का सुरक्षा गार्ड'],
        ['&gt;nul 2&gt;&amp;1', 'आउटपुट व error फेंकना', 'net session &gt;nul 2&gt;&amp;1 (एडमिन जाँच)']
      ] },

    { type: 'code', code: String.raw`@echo off
rem =====================================================================
rem  backup.bat  -  Documents का date-stamped backup + zip + 30 दिन रीटेंशन
rem  robocopy = mirror, PowerShell Compress-Archive = zip
rem =====================================================================
setlocal
set "SRC=C:\Users\Rahul\Documents"
set "DST=D:\Backup"

rem --- 1) sortable timestamp (locale से असर न हो, इसलिए PowerShell से) ---
for /f "delims=" %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm"') do set "STAMP=%%i"
set "TARGET=%DST%\Docs-%STAMP%"
set "LOG=%DST%\backup-%STAMP%.log"

rem --- 2) destination फ़ोल्डर बनाएँ ---
if not exist "%DST%" md "%DST%"

rem --- 3) कॉपी: /MIR mirror, /R:1 /W:1 कम retry, /NP no progress, /XJ junction skip ---
robocopy "%SRC%" "%TARGET%" /MIR /R:1 /W:1 /NP /XJ /LOG:"%LOG%"

rem --- 4) robocopy exit code जाँचें (0-7 = OK, 8+ = fail) ---
if %ERRORLEVEL% GEQ 8 (
  echo BACKUP FAILED - log dekhein: "%LOG%"
  exit /b 1
)

rem --- 5) zip बनाकर loose folder हटाएँ ---
powershell -NoProfile -Command "Compress-Archive -Path '%TARGET%' -DestinationPath '%DST%\Docs-%STAMP%.zip' -CompressionLevel Optimal"
if exist "%DST%\Docs-%STAMP%.zip" rd /s /q "%TARGET%"

rem --- 6) 30 दिन से पुरानी zip हटाएँ ---
forfiles /p "%DST%" /m Docs-*.zip /d -30 /c "cmd /c del @path" 2>nul

echo Backup ho gaya: "%DST%\Docs-%STAMP%.zip"
pause` },

    { type: 'code', code: String.raw`@echo off
rem =====================================================================
rem  fixcase.bat - सारे .JPG को .jpg करना  +  अपने-आप UAC elevation
rem =====================================================================

rem --- (a) एडमिन न हों तो खुद elevation माँगकर दोबारा चलें ---
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Admin chahiye - request bhej raha hoon...
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

rem --- (b) हमेशा स्क्रिप्ट के अपने फ़ोल्डर में काम करें ---
cd /d "%~dp0"

rem --- (c) rename: %%~nF = नाम बिना extension के ---
set /a n=0
for %%F in (*.JPG) do (
  if exist "%%~nF.jpg" (
    echo Skip, already .jpg: %%F
  ) else (
    ren "%%F" "%%~nF.jpg" && set /a n+=1
  )
)
echo %n% files rename hue.

rem --- (d) सारे सब-फ़ोल्डर में .jpeg को .jpg करना ---
for /r %%F in (*.jpeg) do ren "%%F" "%%~nF.jpg"

rem =====================================================================
rem  .bat को हमेशा एडमिन अधिकार से चलाने के 3 तरीके
rem   1) Right-click -> Run as administrator
rem   2) Shortcut -> Properties -> Advanced -> "Run as administrator"
rem   3) Scheduled Task -> "Run with highest privileges"  (नीचे कमांड)
rem =====================================================================
schtasks /create /tn "NightlyBackup" /tr "D:\Scripts\backup.bat" /sc daily /st 23:30 /ru SYSTEM /rl HIGHEST /f
schtasks /run    /tn "NightlyBackup"
schtasks /query  /tn "NightlyBackup" /v /fo LIST
schtasks /delete /tn "NightlyBackup" /f` },
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.4</span> सिस्टम जानकारी, प्रोसेस व सर्विस कमांड</h3>
      <p>ग्राहक की मशीन की पूरी जानकारी एक पेज में चाहिए तो <code>systeminfo</code> (रिमोट के लिए <code>systeminfo /s 192.168.1.20 /u admin /p *</code>), और ग्राफ़िकल पूरा विवरण <code>msinfo32</code> → File → Export (<code>msinfo32 /report D:\\msinfo.txt</code>)। कमांड लाइन से इनवेन्टरी लेने की असल ताक़त <b>wmic</b> (WMI query) और PowerShell के <b>Get-CimInstance</b> में है।</p>
      <div class="callout warn"><b class="ct">wmic deprecated है — पर अभी चलता है</b><p>Windows 11 (24H2 के बाद) में <b>wmic.exe</b> को फ़ीचर-on-demand/retired घोषित कर दिया गया है और future releases में हटाया जाएगा। इसलिए आज लिखी स्क्रिप्ट <b>PowerShell Get-CimInstance</b> में लिखना भविष्य-सुरक्षित है; पुराने XP/7/8/10 PC पर wmic सबसे तेज़ है। दोनों रूप नीचे की तालिका में साथ-साथ दिए हैं।</p></div>` },

    { type: 'table', head: ['कमांड', 'क्या दिखाती/करती है', 'उदाहरण व टिप'],
      rows: [
        ['ver', 'CMD/Windows का बिल्ड नंबर', 'पुराने बिल्ड की पहचान — पूरी जानकारी नहीं'],
        ['winver', 'About Windows खिड़ज़ी (एडिशन + OS build + Experience)', 'क्लाइंट को दिखाने के लिए सबसे साफ़'],
        ['systeminfo', 'OS name/version, BIOS, CPU, RAM, page file, domain, hotfixes, NIC', 'systeminfo /fo CSV &gt; pc.csv (रिमोट: /s)'],
        ['hostname', 'कंप्यूटर का नाम', 'नाम बदलना: sysdm.cpl → Rename या <code>wmic computersystem where name="%COMPUTERNAME%" call rename name="NEW-PC"</code>'],
        ['whoami /user /groups /priv', 'मौजूदा यूज़र, उसका SID, सदस्य समूह, अधिकार', 'एडमिन चेक: <code>net localgroup Administrators</code>; MSA UPN: <code>whoami /upn</code>'],
        ['vol C:', 'वॉल्यूम लेबल व सीरियल नंबर', 'लेबल बदलना: <code>label C: OFFICE</code>'],
        ['driverquery /v', 'सभी ड्राइवर — display name, state (Boot/Running), link date, path', 'driverquery /fo CSV &gt; drv.csv; शक़्क़ुलना .sys यहीं ढूँढें'],
        ['tasklist', 'चलते process: image, PID, session, memory', 'tasklist /v /fi "imagename eq chrome.exe" /fo LIST'],
        ['taskkill', 'process बंद करना', 'taskkill /im notepad.exe /f ; /pid 4321 /t /f (पूरा tree) ; /fi "STATUS eq NOT RESPONDING"'],
        ['sc query / sc qc / sc start / sc stop', 'सेवाओं की स्थिति, config, चालू-बंद', 'sc qc wuauserv ; sc start Spooler ; sc queryex type= service state= all'],
        ['net start / net stop', 'सेवा चालू/बंद (सरल रूप)', 'net stop wuauserv (dependency वालों का भी permission माँगता है — Y)'],
        ['services.msc / msconfig', 'GUI में सेवाएँ / startup + selective boot', 'clean boot का आधिकारिक रास्ता'],
        ['query user / query session', 'कौन लॉगिन है, session ID, state, idle time', 'RDP/साझा मशीन पर दूसरा session बंद: <code>logoff 2</code>, <code>msg 2 text</code>, <code>tskill</code> (server)'],
        ['msinfo32', 'संपूर्ण hardware/software/system report', 'msinfo32 /report D:\\info.txt ; Tools → Memory Diagnostics'],
        ['dxdiag', 'GPU, DirectX, sound, monitor, BIOS — गेमिंग/ग्राफ़िक्स रिपोर्ट', 'dxdiag /t D:\\dx.txt (सaving बिना क्लिक)'],
        ['powercfg /a', 'कौन-सी sleep/hibernate states उपलब्ध और क्यों नहीं', '"Fast Startup is disabled because…" का कारण यहीं'],
        ['powercfg /devicequery wake_armed', 'कौन डिवाइस मशीन जगा सकता है', 'रात को अपने-आप जगने वाली मशीन का इलाज (LAN/USB/mouse)'],
        ['powercfg /batteryreport /output D:\\bat.html', 'लैपटॉप की डिज़ाइन vs मौजूदा capacity व ड्रेन हिस्ट्री', 'बैटरी "सूज"/कम चलने का प्रमाणित जवाब — ग्राहक को दिखाएँ'],
        ['powercfg /energy /duration 60s', '60 सेकंड का पावर-एफ़िशिएंसी सर्वे HTML', 'USB selective suspend, driver issues पकड़ता है'],
        ['control + .cpl/.dll नाम', 'Control Panel का कोई भी pane सीधा', 'control appwiz.cpl · ncpa.cpl · sysdm.cpl · powercfg.cpl · firewall.cpl · input.dll · intl.cpl'],
        ['rundll32 …', 'कोई DLL function बुलाना', 'rundll32.exe user32.dll,LockWorkStation · rundll32.exe shell32.dll,Control_RunDLL · rundll32.exe powrprof.dll,SetSuspendState 0,1,0 (hibernate ON हो तो hibernate करेगा)'],
        ['ms-settings: URI', 'Settings app का सीधा पेज (Win10/11)', 'नीचे सूची — script/GPO/shortcut में काम आती है']
      ] },

    { type: 'code', code: String.raw`:: ms-settings URI — Run/CMD/shortcut में टाइप करके सीधा Settings पेज
start ms-settings:                      :: Settings होम
start ms-settings:about                 :: एडिशन, OS build, processor, RAM
start ms-settings:display               :: रेज़ोल्यूशन, scale, multiple displays
start ms-settings:sound                 :: volume mixer, output/input
start ms-settings:network               :: Wi-Fi/Ethernet सेटिंग्स
start ms-settings:network-wifi          :: Wi-Fi list
start ms-settings:network-ethernet      :: adapter properties
start ms-settings:network-status        :: view properties, reset networking
start ms-settings:network-proxy         :: proxy settings
start ms-settings:bluetooth             :: devices
start ms-settings:notifications         :: focus/notify
start ms-settings:startupapps           :: startup apps (Task Manager का Settings रूप)
start ms-settings:appsfeatures          :: uninstall list
start ms-settings:defaultapps           :: "Open with" के डिफ़ॉल्ट
start ms-settings:storagesense          :: फ़ोल्डर साइज़ व cleanup
start ms-settings:windowsupdate         :: Windows Update
start ms-settings:windowsupdate-restartoptions  :: active hours/restart time
start ms-settings:recovery              :: advanced startup, Reset this PC
start ms-settings:dateandtime           :: time sync / timezone
start ms-settings:regionlanguage        :: भाषा व keyboard install
start ms-settings:easeofaccess-cursor   :: accessibility
start ms-settings:privacy               :: microphone/camera/location permissions
start ms-settings:windowsdefender       :: Windows Security center
start ms-settings:remotedesktop         :: RDP on/off (Pro)
start ms-settings:power                 :: power & battery

:: ---- .cpl / .msc shortcut की पूरी दुकान-सूची ----
appwiz.cpl   :: Programs and Features (uninstall)
ncpa.cpl     :: Network Connections (adapter)
sysdm.cpl    :: System Properties (computer name, hardware, performance, protection)
powercfg.cpl :: Power Options
firewall.cpl :: Windows Defender Firewall
wscui.cpl    :: Security Center
input.dll    :: Text services and input languages (keyboard layout)
intl.cpl     :: Region / formats / admin language
mstsc.exe    :: Remote Desktop client (mstsc /v:192.168.1.20 /f)
devmgmt.msc  :: Device Manager
diskmgmt.msc :: Disk Management
compmgmt.msc :: Computer Management (users, shares, event log, services)
lusrmgr.msc  :: Local Users and Groups (Pro/Enterprise)
secpol.msc   :: Local Security Policy (Pro/Enterprise)
gpedit.msc   :: Local Group Policy (Pro/Enterprise/Education)
services.msc :: Services
taskschd.msc :: Task Scheduler
eventvwr.msc :: Event Viewer
wf.msc       :: Advanced Firewall with Security
resmon       :: Resource Monitor
perfmon.msc  :: Performance Monitor
dfrgui       :: Optimize Drives (TRIM/defrag)
wercon       :: Problem Reports and Solutions / reliability
cleanmgr     :: Disk Cleanup
mdsched.exe  :: Windows Memory Diagnostic
optionalfeatures.exe :: Windows Features (IIS, .NET 3.5, Hyper-V, Sandbox, WSL)
msconfig     :: System Configuration (boot/services)
dxdiag       :: DirectX Diagnostic Tool
regedit      :: Registry Editor
notepad / mspaint / calc / explorer :: classic shell tools
control userpasswords2 :: Netplwiz - auto-login/username box` },

    { type: 'table', head: ['कमांड (WMI query)', 'क्या मिलता है', 'PowerShell का समकक्ष'],
      rows: [
        ['wmic csproduct get name,vendor,identifyingnumber', 'मॉडल नाम, मेकर, सीरियल (Service Tag)', 'Get-CimInstance Win32_ComputerSystemProduct | Select Name,Vendor,IdentifyingNumber'],
        ['wmic cpu get name,numberofcores,numberoflogicalprocessors,maxclockspeed', 'CPU मॉडल, कोर/थ्रेड, अधिकतम स्पीड', 'Get-CimInstance Win32_Processor'],
        ['wmic diskdrive get model,size,interfaceType,status,mediatype', 'हर डिस्क — NVMe/SATA, साइज़ (बाइट), स्वास्थ्य', 'Get-CimInstance Win32_DiskDrive ; Get-PhysicalDisk (MSFT_Disk module)'],
        ['wmic physicalmemory get devicelocator,capacity,speed,formfactor', 'RAM स्टिक की स्लॉट-वार जानकारी (8 GB x 2?)', 'Get-CimInstance Win32_PhysicalMemory'],
        ['wmic bios get manufacturer,version,serialnumber,releaseDate', 'BIOS वर्ज़न व रिलीज़ — अपडेट की ज़रूरत यहीं से', 'Get-CimInstance Win32_BIOS'],
        ['wmic baseboard get product,manufacturer,serialnumber', 'मदरबोर्ड मॉडल (ड्राइवर खोजने के लिए ज़रूरी)', 'Get-CimInstance Win32_BaseBoard'],
        ['wmic os get caption,version,buildnumber,installdate,lastboottime,arch', 'Windows एडिशन, बिल्ड, इंस्टॉल व बूट समय', 'Get-CimInstance Win32_OperatingSystem'],
        ['wmic qfe get hotfixid,installedon,description', 'लगे सभी updates (KB…)', 'Get-HotFix'],
        ['wmic nicconfig get description,ipaddress,macaddress,dhcpenabled,dnsserversearchorder', 'हर NIC की IP/DNS/DHCP', 'Get-NetIPConfiguration ; Get-CimInstance Win32_NetworkAdapterConfiguration'],
        ['wmic /namespace:\\\\root\\\\SecurityCenter2 path AntiVirusProduct get * /value', 'इंस्टॉल एंटीवायरस — कौन सा, कौन से version', 'Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntiVirusProduct'],
        ['wmic process get name,processid,workingsetsize,executablepath', 'सभी process + उनका exe path (मालवेयर पकड़ने में)', 'Get-Process ; Get-CimInstance Win32_Process'],
        ['wmic startup get caption,command,location', 'स्टार्टअप एंट्रीज़ (registry+startup folder दोनों)', 'Get-CimInstance Win32_StartupCommand'],
        ['wmic service get name,displayname,state,startmode,pathname', 'सेवाएँ और उनकी exe path', 'Get-Service ; Get-CimInstance Win32_Service'],
        ['wmic volume get driveletter,freespace,totalsize,filesystem,drivetype', 'हर volume की जगह व फ़ाइल सिस्टम', 'Get-Volume ; Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3"'],
        ['wmic useraccount get name,disabled,lastpasswordset,passwordexpires,sid', 'लोकल यूज़र व उनकी स्थिति', 'Get-LocalUser'],
        ['wmic path win32_videocontroller get name,driverversion,videomodesupported', 'GPU व ड्राइवर वर्ज़न', 'Get-CimInstance Win32_VideoController'],
        ['wmic /output:D:\\out.txt process get name /format:csv', 'आउटपुट सीधे फ़ाइल में (reporting)', '… | Export-Csv D:\\out.csv -NoTypeInformation']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.5</span> नेटवर्क निदान — IP से लेकर फ़ायरवॉल तक</h3>
      <p>क्रम यही रखिए: <b>nik (NIC up?) → own IP (169.254.x.x = DHCP fail) → gateway ping → DNS (nslookup) → target ping → port (Test-NetConnection) → फ़ायरवॉल</b>। इसी क्रम से 90% "इंटरनेट नहीं चल रहा" दो मिनट में हल होता है।</p>
      <table class="tbl"><tr><th>कमांड</th><th>क्या करती है</th><th>दुकान-उदाहरण</th></tr>
        <tr><td>ipconfig /all</td><td>हर adapter का MAC, IPv4/IPv6, subnet, gateway, DHCP, DNS, lease</td><td>सबसे पहले यही; "Media disconnected" = केबल/NIC</td></tr>
        <tr><td>ipconfig /release &amp; /renew</td><td>DHCP से IP छोड़कर दोबारा लेना</td><td>169.254.x.x या पुरानी IP हटाने</td></tr>
        <tr><td>ipconfig /flushdns (+ /registerdns, /displaydns)</td><td>DNS कैश साफ़ / रजिस्टर / दिखाना</td><td>साइट पुरानी error दिख रही हो</td></tr>
        <tr><td>ping -n 4 -l 1400 -t -4 8.8.8.8</td><td>पैिंग भेजें — -t लगातार, -l साइज़, -n गिनती, -4/-6</td><td>1400 बाइट से MTU समस्या भी पकड़ती है; time out = रास्ता/फ़ायरवॉल</td></tr>
        <tr><td>tracert -d -h 20 target</td><td>कौन-कौन से hop (router) से जा रहा है; -d नाम न पूछे (तेज़)</td><td>hop 1 fail = आपका राउटर; बीच में * * * = आगे फ़िल्टर/धीमा</td></tr>
        <tr><td>pathping -n target</td><td>tracert + packet loss प्रति hop (25 सेकंड चलता है)</td><td>"रात को lenta" — किस hop पर loss, यह इसी से</td></tr>
        <tr><td>arp -a / arp -d *&lt;ip&gt; / arp -s</td><td>IP↔MAC टेबल; कैश हटाना; static एंट्री</td><td>IP conflict/IP-MAC binding (ISP वाले)</td></tr>
        <tr><td>netstat -ano</td><td>सभी connections + LISTENING ports (PID के साथ)</td><td>netstat -ano | findstr :445 ; फिर PID से tasklist /fi "pid eq 1234"</td></tr>
        <tr><td>netstat -ab / -rn / -e</td><td>program+port (एडमिन), routing table, interface stats</td><td>"कौन ऐप बाहर call कर रहा है" पकड़ने में</td></tr>
        <tr><td>nslookup</td><td>DNS queries — interactive: <code>server 1.1.1.1</code>, <code>set type=A|AAAA|MX|NS|TXT|CNAME</code>, <code>set qtype=any</code></td><td>DNS ठीक है या ISP का DNS — यहीं तय होता है</td></tr>
        <tr><td>route print / route add / route delete</td><td>IPv4 रूटिंग टेबल व manual routes (<code>-p</code> persistent)</td><td>route add 0.0.0.0 mask 0.0.0.0 192.168.1.254 -p (दूसरा gateway)</td></tr>
        <tr><td>netsh interface ipv4 show config / show interfaces</td><td>हर interface का static/DHCP विवरण, metrics</td><td>दो NIC वाले PC में "सही gateway" कौन — यहीं दिखता है</td></tr>
        <tr><td>netsh interface ipv4 set address name="Ethernet" static 192.168.1.50 255.255.255.0 192.168.1.1</td><td>static IP सेट करना (एडमिन)</td><td>लैब में स्क्रिप्ट से IP देना; DNS: <code>… set dns name="Ethernet" static 8.8.8.8</code></td></tr>
        <tr><td>netsh wlan show interfaces / show profiles / show profile name="XYZ" key=clear</td><td>Wi-Fi स्थिति, सेव नेटवर्क, और <b>उसका पासवर्ड</b></td><td>ग्राहक का भुला हुआ Wi-Fi password निकालना (आपने key=clear से माँगा है) — नैतिक सीमा याद रखें</td></tr>
        <tr><td>netsh winsock reset + netsh int ip reset + netsh advfirewall reset</td><td>LSP stack, TCP/IP stack और फ़ायरवॉल को factory पर</td><td>वायरस/VPN के बाद "कुछ भी नेट पर नहीं खुलता" — तीनों के बाद re-start</td></tr>
        <tr><td>netsh advfirewall firewall add rule</td><td>फ़ायरवॉल नियम जोड़ना</td><td>netsh advfirewall firewall add rule name="Labs SMB" dir=in action=allow protocol=TCP localport=445 profile=private</td></tr>
        <tr><td>netsh advfirewall set allprofiles state off / on</td><td>फ़ायरवॉल अस्थायी बंद/चालू</td><td>टेस्ट के लिए ही — फिर तुरंत on करें</td></tr>
        <tr><td>netsh interface portproxy add v4tov4 …</td><td>एक पोर्ट दूसरे PC पर forward</td><td>पुराने XP-app का नेटवर्क ट्रायल</td></tr>
        <tr><td>nbtstat -a PCNAME / -n / -S</td><td>NetBIOS नाम-टेबल, सेशन</td><td>नेटवर्क में PC नहीं दिख रहा (137–139)</td></tr>
        <tr><td>getmac /v</td><td>सभी NIC का MAC + transport</td><td>DHCP reservation/Filter के लिए MAC नोट करना</td></tr>
        <tr><td>net view \\\\192.168.1.1 / net share / net session</td><td>शेयर सूची, अपनी शेयर, active sessions</td><td>"किसी के PC खुले हुए sessions" बंद: <code>net session /delete /y</code></td></tr>
        <tr><td>Test-NetConnection (PowerShell)</td><td>ping + TCP port + routing एक साथ</td><td>Test-NetConnection 192.168.1.10 -Port 445</td></tr>
        <tr><td>Resolve-DnsName (PowerShell)</td><td>DNS — type, server, cache हटाना</td><td>Resolve-DnsName gmail.com -Type MX ; Clear-DnsClientCache</td></tr>
      </table>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.6</span> रिपेयर, सर्विसिंग व एक्टिवेशन की कमांडें</h3>
      <p>Component store (Windows की फ़ाइलों का भंडार) ख़राब हो तो <code>sfc</code> अकेला हार मान लेता है ("found corrupt files but was unable to fix some") — पहले <b>DISM</b> से store ठीक कीजिए, फिर <b>SFC</b>: यही सही क्रम है। offline मशीन (RE या mount किए VHD) पर दोनों <code>/offbootdir</code>-<code>/offwindir</code> और <code>/Image</code> फ़्लैग के साथ चलते हैं।</p>` },

    { type: 'table', head: ['कमांड', 'क्या करती है', 'ध्यान/उदाहरण'],
      rows: [
        ['sfc /scannow', 'प्रोटेक्टेड सिस्टम फ़ाइलें जाँचकर ठीक (component store से)', 'एडमिन CMD; CBS.log: C:\\Windows\\Logs\\CBS\\CBS.log'],
        ['sfc /verifyonly · /scanonce', 'सिर्फ़ जाँच / एक बार scan', 'बदलाव नहीं करना हो तो /verifyonly'],
        ['sfc /scannow /offbootdir=C:\\ /offwindir=C:\\Windows', 'RE में offline Windows ठीक करना', 'C: लेटर RE में बदल सकता है — पहले diskpart list volume'],
        ['DISM /Online /Cleanup-Image /ScanHealth', 'Component store की सेहत जाँच (बदलाव नहीं)', 'सबसे पहले यह, फिर RestoreHealth'],
        ['DISM /Online /Cleanup-Image /RestoreHealth', 'ख़राब फ़ाइलें Windows Update से लाकर ठीक', 'offline मशीन के लिए /Source:WIM:install.wim:6'],
        ['DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase', 'Backup component हटाकर C: की GB वापस', 'अपडेट के 1-2 दिन बाद; ResetBase के बाद पुराने updates uninstall नहीं होंगे'],
        ['DISM /Online /Enable-Feature /FeatureName:NetFx3 /All', '.NET 3.5 (2.0/3.0) चालू', 'पुराने सॉफ़्टवेयर के लिए; /LimitAccess + \\\\sources\\\\sxs offline'],
        ['DISM /Get-WimInfo /WimFile:E:\\sources\\install.wim', 'ISO में कौन-कौन एडिशन (index नंबर)', 'एडिशन चुनकर इंस्टॉल/apply करने से पहले ज़रूरी'],
        ['DISM /Mount-Image /MountDir:C:\\M /ImageFile:… /index:1', 'WIM/VHD/HDD छवि माउंट करके ड्राइवर पैच करना', '/Add-Driver /Driver:D:\\drv /Recurse, फिर /Commit-Image, /Unmount-Image /Discard'],
        ['chkdsk C: /f /r', 'त्रुटि सुधार + बैड सेक्टर (रीस्टार्ट-पेंडिंग, घंटों)', 'थोड़ा खतरनाक माना जाए: बैड सेक्टर का डेटा बचा नहीं जाता — पहले backup'],
        ['chkdsk C: /scan · /spotfix · /offline', 'चलते Windows online scan / तुरंत fix / offline (अगले बूट पर) /f', 'आज की सिफ़ारिश: पहले /scan, मिलने पर /spotfix'],
        ['chkdsk /i /c /x', 'index/ folder-cycle check छोड़ें, volume force dismount', '/r के बाद /i /c से समय आधा; /x = पहले dismount'],
        ['format D: /FS:NTFS /Q /V:DATA /A:64K /X', 'फ़ॉर्मैट (quick, label, unit, dismount)', 'C: का format चलते Windows से नहीं — boot media/RE से'],
        ['diskpart', 'पार्टीशन/वॉल्यूम का कमांड टूल (पूरा सेट अध्याय 3.12 में)', 'list disk → select disk N → clean / convert gpt / create partition / assign'],
        ['bcdedit /enum all', 'Boot Configuration Data — सभी boot entries, path, hypervisor settings', 'एडमिन में; /store S:\\EFI\\Microsoft\\Boot\\BCD offline BCD के लिए'],
        ['bcdedit /set {default} recoveryenabled No', 'Automatic Repair लूप रोकें (अस्थायी)', 'फिर from RE चलाकर /set {default} bootstatuspolicy IgnoreAllFailures'],
        ['bcdedit /deletevalue {default} safeboot', 'अटक गया safe-boot हटाना', 'msconfig के Boot "Safe boot" टिक हटने के बराबर'],
        ['bcdedit /set {default} safeboot network (+ bcdedit /timeout 5)', 'अगले बूट पर Safe Mode (Networking) फ़ोर्स', 'बूट न हो तो RE के cmd से'],
        ['bcdedit /set testsigning on', 'अनसाइनड ड्राइवर मोड (लैब)', 'off करने के बाद re-start; प्रोडक्शन पर नहीं'],
        ['bootrec /fixmbr · /fixboot · /scanos · /rebuildbcd', 'MBR/system boot code, BCD में entry जोड़ना (BIOS-MBR मशीन)', 'RE cmd, C: का लेटर जाँचकर; UEFI पर इनकी जगह <b>bcdboot</b>'],
        ['bootsect /nt60 sys /mbr', 'System volume का boot code 6.x (Vista-+) पर', 'dual-boot में Linux GRUB हटने के बाद MBR ठीक करने'],
        ['bcdboot C:\\Windows /s S: /f UEFI', 'नई EFI पर boot फ़ाइलें लिखना (bcdboot का असली उपयोग)', 'पहले diskpart में EFI volume को S: देकर; /f ALL भी'],
        ['gpupdate /force', 'सभी Group Policy तुरंत लागू', 'gpresult /r से जाँच; /target:computer या /user'],
        ['slmgr /ipk XXXXX-…-… /ato /dli /dlv /xpr', 'key देना, activation, licence विवरण, "Windows permanently activated?"', 'cscript //nologo C:\\Windows\\System32\\slmgr.vbs /xpr (स्क्रिप्ट में)'],
        ['slmgr /skms kms.company.com:1688 · /ckms · /rearm', 'KMS server सेट/हटाना, licence state reset', '/rearm 3 बार तक — फिर तो repair/re-install'],
        ['certutil -hashfile F:\\soft.exe SHA256', 'फ़ाइल का hash — download सही/बदला नहीं यह पक्का करने', 'manufacturer की साइट के hash से मिलाएँ'],
        ['certutil -encode/-decode file b64.txt', 'Base64 रूपांतरण', 'लॉग/config text भेजने में; <b>मालवेयर भी इसका दुरुपयोग करता है</b>'],
        ['certutil -store my · -dump cert.cer', 'सर्टिफ़िकेट देखना (EFS/BitLocker/VPN)', 'हर सिस्टम पर अनजान CA cert मिले तो जाँचें'],
        ['fsutil behavior query DisableDeleteNotify', 'TRIM चालू? (0 = चालू)', 'SSD सेटअप वेरिफ़िकेशन'],
        ['fsutil dirty query C:', 'volume "dirty" है? (अगले बूट पर chkdsk चलेगा)', 'bar-bar chkdsk का कारण यहीं'],
        ['takeown /f D:\\Folder /r /d y', 'ownership लेना (एडमिन)', 'फिर icacls … /grant administrators:F /t'],
        ['reg add/query/delete/import/export', 'Registry — कमांड से (उदाहरण अध्याय 3.10 में)', 'स्क्रिप्ट/रिमोट के लिए; पहले export हमेशा'],
        ['wevtutil qe System /rd:true /c:3 /f:text', 'लॉग पढ़ना; <code>wevtutil cl Security</code> साफ़; <code>wevtutil gl Security</code> स्थिति', '<b>cl</b> से हमलावर अपना सबूत मिटाता है — जाँच में लॉग कभी clear न करें'],
        ['cscript //nologo file.vbs', 'VBScript चलाना (slmgr/selftest वही लिखे जाते हैं)', '32-बिट: %WINDIR%\\SysWOW64\\cscript.exe'],
        ['net accounts / net config workstation / net config server', 'पासवर्ड-लॉकआउट नीति, LAN Manager/वर्कस्टेशन सेटिंग, share limit', 'डोमेन-जैसी नीति लोकल पर सेट करने में'],
        ['netsh -c "i i" show', 'context में जाकर कई कमांड (interface ipv4)', 'टैब से विकल्प मिलते हैं — सीखने का तेज़ तरीक़ा']
      ] },

    { type: 'code', code: String.raw`:: ============================================================
::  दुकान की 12 कमांड - एक के बाद एक (एडमिन CMD में)
:: ============================================================
:: 1) Windows Update घटक reset (0x80070002/0x80240034 जैसे एरर)
net stop wuauserv & net stop bits & net stop cryptSvc & net stop msiserver
ren C:\Windows\SoftwareDistribution SoftwareDistribution.old
ren C:\Windows\System32\catroot2 catroot2.old
net start wuauserv & net start bits & net start cryptSvc & net start msiserver
wuauclt /detectnow /reportnow

:: 2) सिस्टम इमेज + फ़ाइल जाँच (यही क्रम)
DISM /Online /Cleanup-Image /RestoreHealth
sfc /scannow

:: 3) नेटवर्क पूरी सफ़ाई (reboot ज़रूरी)
ipconfig /release & ipconfig /flushdns & ipconfig /renew & ipconfig /registerdns
netsh winsock reset
netsh int ip reset
netsh advfirewall reset

:: 4) प्रोफ़ाइल साइज़ व अतिरिक्त फ़ाइलें ढूँढना
dir /a-d /o-s /s C:\Users 2>nul | findstr /r "^[0-9]" & forfiles /p C:\ /m *.* /s /c "cmd /c if @fsize GEQ 536870912 echo @path @fsize" 2>nul

:: 5) license स्थिति
slmgr /dli & slmgr /xpr
cscript //nologo C:\Windows\System32\slmgr.vbs /dlv

:: 6) रीस्टार्ट-पेंडिंग व शेड्यूल टास्क जाँच
schtasks /query /fo TABLE | findstr /i "Ready Running"
shutdown /r /t 0 /c "Lab maintenance reboot"` },
    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.7</span> PowerShell — यह क्यों आया, और कैसे सोचता है</h3>
      <p>CMD text देता है; <b>PowerShell objects देता है</b>। यानी <code>Get-Service | Where-Object Status -eq 'Running'</code> में Status एक असली property है — string काटने (parse) की ज़रूरत नहीं, इसलिए वर्ज़न/भाषा/फ़ॉर्मैट बदलने पर स्क्रिप्ट नहीं टूटती। हर चीज़ <b>Verb-Noun</b> नाम वाली <b>cmdlet</b> है (<code>Get-</code>, <code>Set-</code>, <code>New-</code>, <code>Remove-</code>, <code>Test-</code>, <code>Start-</code>, <code>Stop-</code>, <code>Restart-</code>), और हर cmdlet को <code>Get-Help</code>, <code>Get-Member</code> से खुद समझा जा सकता है।</p>
      <ul>
        <li><b>दो वर्ज़न:</b> <b>Windows PowerShell 5.1</b> (<code>powershell.exe</code>) — हर Windows 10/11 में built-in, .NET Framework पर; <b>PowerShell 7</b> (<code>pwsh.exe</code>) — अलग install (Microsoft Store/MSI/GitHub), cross-platform, तेज़, नई फ़ीचर, पर पुराने मॉड्यूल कभी-कभी नहीं चलते। दोनों एक ही मशीन पर साथ रह सकते हैं।</li>
        <li><b>Providers/Drives:</b> फ़ाइल सिस्टम के अलावा <code>HKLM:</code>, <code>HKCU:</code>, <code>Env:</code>, <code>Cert:</code>, <code>Variable:</code>, <code>Alias:</code> — इसलिए <code>Get-ChildItem HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run</code> सीधे चलता है, और <code>Set-ItemProperty</code> registry बदलता है। <code>New-PSDrive</code> से शेयर/VHD भी drive बन जाता है।</li>
        <li><b>Alias पुरानी आदत के लिए:</b> <code>dir/ls → Get-ChildItem</code>, <code>cd → Set-Location</code>, <code>copy → Copy-Item</code>, <code>del → Remove-Item</code>, <code>gps → Get-Process</code>, <code>gcm → Get-Command</code>, <code>gm → Get-Member</code>, <code>select → Select-Object</code>, <code>where → Where-Object</code>, <code>curl → Invoke-WebRequest</code> (सावधान!)। असली कमांड जानने के लिए <code>Get-Alias dir</code>।</li>
        <li><b>Discovery (सबसे ज़रूरी आदत):</b> <code>Get-Command -Noun Service</code> (Service से जुड़ी सभी cmdlet), <code>Get-Command -Module BitLocker</code>, <code>Get-Service | Get-Member</code> (कौन-सी property/method), <code>Get-Help Get-Process -Examples</code>, <code>Update-Help</code>, <code>Get-Help about_Comparison_Operators</code>, <code>Show-Command Get-Process</code> (GUI फ़ॉर्म)।</li>
        <li><b>Execution Policy</b> यह तय करता है कि <b>.ps1 फ़ाइल</b> चलेगी या नहीं (इंटरैक्टिव टाइपिंग हमेशा चलती है): <code>Restricted</code> (client डिफ़ॉल्ट — सिर्फ़ commands), <code>AllSigned</code>, <code>RemoteSigned</code> (सुझाया गया — locally लिखी फ़ाइल चले, इंटरनेट से आई हो तो unblock/signature), <code>Unrestricted</code>, <code>Bypass</code>। जाँच/सेट: <code>Get-ExecutionPolicy -List</code>, <code>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code>। <b>यह security boundary नहीं, guardrail है</b> — असली सुरक्षा AppLocker/WDAC + admin controls से। एक बार के लिए: <code>powershell -ExecutionPolicy Bypass -File .\\report.ps1</code>, और blocked-by-internet फ़ाइल पर Right-click → Unblock (<code>Unblock-File</code>)।</li>
        <li><b>Profile</b> = शेल खुलते ही चलने वाली स्क्रिप्ट: <code>notepad $PROFILE</code> (path: Documents\\WindowsPowerShell\\Microsoft.PowerShell_profile.ps1), नई बनाने को <code>New-Item -Path $PROFILE -Force</code>। यहाँ alias/function/prompt/farf़ॉन्ट रखते हैं; PS 7 का अपना अलग profile है (<code>$PROFILE</code> pwsh में अलग फ़ाइल)।</li>
        <li><b>चलाने के तरीक़े:</b> फ़ाइल Right-click → <b>Run with PowerShell</b>; प्रॉम्प्ट में <code>.\\script.ps1</code> (\`.\` ज़रूरी — current directory path में नहीं होता); CMD से <code>powershell -NoProfile -ExecutionPolicy Bypass -File D:\\s.ps1 -Server PC1</code> (स्क्रिप्ट में <code>param([string]$Server)</code>); Task Scheduler में Action = program <code>powershell.exe</code> + arguments; और Remote (नीचे 4.9)।</li>
      </ul>` },

    { type: 'table', head: ['बनावट', 'सिंटेक्स/उदाहरण', 'नोट'],
      rows: [
        ['वेरिएबल', '$name = "Rahul"   ;   $n = 42', 'तुरंत type तय होता है; [int]$x = "5" से force'],
        ['टाइप कास्ट', '[int]"12" ; [string]5 ; [datetime]"2026-01-31" ; [pscustomobject]@{A=1}', 'अनजान इनपुट पर [int]::TryParse इस्तेमाल करें'],
        ['Array', '$a = 1,2,3 ; $a[0] ; $a.Count ; $a += 4 ; ,@($a) ', 'fixed नहीं; -Contains, -in, Where-Object से फ़िल्टर'],
        ['Hashtable', '$h = @{Name="PC1"; RAM=16} ; $h.RAM ; $h["RAM"]', 'Keys unordered; ordered के लिए [ordered]@{}'],
        ['PSCustomObject', '[pscustomobject]@{PC=$env:COMPUTERNAME; GB=120}', 'Export-Csv की असल ईंट'],
        ['String interpolation', '"Free = $free GB, total = $($d.Size/1GB)"', 'double quote में ही expand; single quote literal'],
        ['Formatting operator', '"{0:N2} GB of {1:N0}" -f $free, $total', '-f culture-aware संख्या/तारीख़ देता है'],
        ['Here-string', '$sql = @" ... multi line ... "@', 'code/HTML टेम्पलेट लिखने में आसान'],
        ['तुलना', '$a -eq $b ; -ne -gt -ge -lt -le', 'केस-इनसेंटिव डिफ़ॉल्ट; sensitive चाहिए तो -ceq/-ieq'],
        ['Wildcard/Regex', '"file.log" -like "*.log" ; "10.1.2.3" -match "^10\\."', '-match में $Matches[0] में मैच आता है'],
        ['Collection checks', '$list -contains "PC1" ; "PC1" -in $list', '-in का बायाँ तरफ़ scalar'],
        ['तर्क', 'if ($a -and $b) {} elseif {} else {} ; -not / !', 'short-circuit; switch ($x) { 1 {} "A" {} default {} }'],
        ['String बदलना', '$s -replace "^C:","D:" ; $s.Trim() ; $s.Split("\\")', '-replace regex है; .Trim/.PadLeft/.Substring .NET से'],
        ['Join/Split', '$arr -join ","  ;  ("a,b" -split ",")', 'CSV के बिना सरल काम'],
        ['Loop', 'foreach ($f in $files) { … }   vs   $files | ForEach-Object { … }', 'foreach loop तेज़ व -break/-continue वाला; pipe वाली version pipeline streaming'],
        ['Current item', '$_ (उर्फ़ $PSItem) — $_.Name, $_.Length', 'pipeline की मौजूदा वस्तु'],
        ['Simplified Where', 'Get-Service | Where-Object Status -eq "Running"', '3.0+ का छोटा रूप; पुरा: { $_.Status -eq "Running" }'],
        ['Error रोकना', '-ErrorAction SilentlyContinue ; $ErrorActionPreference="Stop"', 'try { } catch { Write-Error $_ } finally { }'],
        ['Exit code', '$LASTEXITCODE (exe से) ; throw (cmdlet से)', 'CMD का %errorlevel% यहाँ नहीं'],
        ['Line continuation', 'आख़िर में backtick (नई लाइन) या कॉमा-उपरांत', 'कमांड एक लाइन में रखना पढ़ने में आसान'],
        ['Function', 'function Get-FreeGB { param([string]$Drive="C:") … }', 'advanced के लिए [CmdletBinding()], ValueFromPipeline'],
        ['Module/Gallery', 'Find-Module ; Install-Module -Name xyz -Scope CurrentUser', 'PowerShellGet + PSGallery; भरोसेमंड module ही लें']
      ] },

    { type: 'table', head: ['Cmdlet / एक-लाइन', 'क्या करता है', 'उदाहरण'],
      rows: [
        ['Get-ComputerInfo', 'मशीन का बड़ा सारांश (OS, BIOS, RAM, domain, UEFI?)', 'Get-ComputerInfo -Property Cs*,"Os*Uptime"'],
        ['Get-CimInstance Win32_*', 'हर hardware/OS/class का असली डेटा', 'Get-CimInstance Win32_BIOS | Select SerialNumber'],
        ['Get-Process / Stop-Process', 'प्रोसेस सूची / बंद', 'Get-Process | Sort WS -Desc | Select -First 5 Name,Id,WS'],
        ['Wait-Process', 'प्रोसेस ख़त्म होने का इंतज़ार', 'Stop-Process -Name setup -Force; Wait-Process -Name setup'],
        ['Get-Service / Set-Service', 'सेवाएँ पढ़ना/बदलना', 'Set-Service SysMain -StartupType Disabled'],
        ['Restart-Service / Start- / Stop-', 'सेवा चलाएँ-रोकें', 'Get-Service Spooler | Restart-Service -Force'],
        ['New-Service', 'नई Windows सेवा बनाना', 'New-Service -Name MyAgent -BinaryPathName "C:\\app.exe" -StartupType Automatic'],
        ['Get-ChildItem (gci)', 'फ़ाइल/फ़ोल्डर; recursion, hidden', 'gci D:\\ -Recurse -File -Force -EA SilentlyContinue'],
        ['Get-Item / Set-ItemProperty', 'फ़ाइल/registry के गुण', 'Set-ItemProperty HKCU:\\Software\\MyApp -Name Level -Value 5'],
        ['New-Item', 'फ़ाइल/फ़ोल्डर/registry key बनाना', 'New-Item -ItemType Directory -Path D:\\Reports -Force'],
        ['Copy-Item / Move-Item / Remove-Item', 'कॉपी/शिफ़्ट/मिटाना (-Recurse -Force)', 'Remove-Item C:\\Temp\\* -Recurse -Force -EA SilentlyContinue'],
        ['Rename-Item', 'नाम बदलना', 'gci *.JPG | Rename-Item -NewName { $_.Name -replace "\\.JPG$",".jpg" }'],
        ['Test-Path / Test-Connection', 'मौजूदगी / ping (नया: Test-NetConnection)', 'if (Test-Path "\\\\srv\\share") { … }'],
        ['Get-Content / Set-Content / Add-Content', 'फ़ाइल पढ़ना/लिखना/जोड़ना', 'Get-Content log.txt -Tail 20 ; Add-Content log.txt (Get-Date)'],
        ['Select-String', 'फ़ाइलों में regex खोजना (grep जैसा)', 'gci -Recurse *.log | Select-String "Error" -Context 1,2'],
        ['Where-Object / Select-Object', 'फ़िल्टर / कॉलम चुनना', '… | Where Length -gt 1GB | Select FullName,@{n="GB";e={[math]::Round($_.Length/1GB,1)}}'],
        ['Sort-Object / Group-Object / Measure-Object', 'क्रम / समूह / जोड़-औसत', 'Get-Process | Group-Object Company | Sort Count -Desc | Select Name,Count'],
        ['Measure-Command', 'कमांड कितना समय लिया', 'Measure-Command { gci C:\\ -Recurse }'],
        ['Export-Csv / Import-Csv', 'CSV में आना-जाना', 'Get-Service | Export-Csv svc.csv -NoTypeInformation'],
        ['ConvertTo-Json / ConvertFrom-Json', 'JSON सीरियलाइज़ेशन', 'Get-Volume | ConvertTo-Json -Depth 3'],
        ['ConvertTo-Html', 'HTML रिपोर्ट', 'Get-ComputerInfo | Select OsName,OsVersion | ConvertTo-Html > report.html'],
        ['Compress-Archive / Expand-Archive', 'ZIP बनाना/खोलना', 'Compress-Archive D:\\Logs\\* -DestinationPath D:\\logs.zip'],
        ['Get-FileHash / Set-AuthenticodeSignature', 'SHA256 hash / स्क्रिप्ट साइन', 'Get-FileHash D:\\soft.exe -Algorithm SHA256'],
        ['Get-NetIPConfiguration', 'एक-लाइन में हर NIC का IP/gateway/DNS', 'Get-NetIPConfiguration | Format-List'],
        ['Get-NetAdapter / Enable- / Disable-', 'NIC स्थिति व चालू-बंद', 'Disable-NetAdapter -Name "Ethernet" -Confirm:$false'],
        ['Set-NetIPInterface / New-NetIPAddress', 'DHCP→static, IP जोड़ना', 'Set-NetIPInterface -InterfaceAlias Ethernet -Dhcp Enabled'],
        ['Test-NetConnection', 'ping + TCP port + route एक साथ', 'Test-NetConnection 192.168.1.10 -Port 445'],
        ['Resolve-DnsName / Clear-DnsClientCache', 'DNS query / कैश साफ़', 'Resolve-DnsName company.local -Type MX'],
        ['Get-NetRoute / Get-NetFirewallRule / New-NetFirewallRule', 'रूटिंग व फ़ायरवॉल नियम', 'New-NetFirewallRule -DisplayName "Lab app" -Direction Inbound -Action Allow -LocalPort 8080 -Protocol TCP'],
        ['Get-Disk / Initialize-Disk', 'डिस्क स्थिति, GPT/MBR इनिशियलाइज़', 'Initialize-Disk -Number 1 -PartitionStyle GPT'],
        ['New-Partition / Get-Partition / Set-Partition', 'वॉल्यूम बनाना/लेटर देना', 'New-Partition -DiskNumber 1 -UseSize -AssignDriveLetter'],
        ['Format-Volume / Get-Volume', 'फ़ॉर्मैट व जानकारी', 'Format-Volume -DriveLetter E -FileSystem NTFS -NewFileSystemLabel Data -Confirm:$false'],
        ['Optimize-Volume', 'TRIM (retrim)/defrag भेजना', 'Optimize-Volume -DriveLetter C -ReTrim -Verbose'],
        ['Get-BitLockerVolume / Enable-BitLocker', 'एन्क्रिप्शन स्थिति/चालू', 'Enable-BitLocker D: -EncryptionMethod XtsAes256 -RecoveryPasswordProtector'],
        ['Add-BitLockerKeyProtector / Lock- / Unlock-BitLocker', 'PIN/password protector, लॉक', 'Unlock-BitLocker E: -RecoveryPassword 111111-…'],
        ['Disable-BitLocker / Resume-BitLocker', 'protection बंद/वापस', 'Resume-BitLocker C: -MountPoint? (सिर्फ़ C:)'],
        ['Get-WindowsOptionalFeature', 'Windows feature की स्थिति (DISM module)', 'Get-WindowsOptionalFeature -Online -FeatureName SMB1Protocol'],
        ['Enable-/Disable-WindowsOptionalFeature', 'feature चालू/बंद (WSL, Sandbox, .NET 3.5)', '… -FeatureName Microsoft-Windows-Subsystem-Linux -All -NoRestart'],
        ['Repair-WindowsImage / Save-WindowsImage / Mount-WindowsImage', 'DISM के PowerShell रूप', 'Repair-WindowsImage -Online -RestoreHealth'],
        ['Add-WindowsDriver / Add-WindowsPackage', 'offline image में ड्राइवर/अपडेट', 'Add-WindowsDriver -Path C:\\M -Driver D:\\drv -Recurse'],
        ['Get-WinEvent', 'Event log — filter hashtable के साथ (तेज़)', 'Get-WinEvent -FilterHashtable @{LogName="System";Level=1,2;StartTime=(Get-Date).AddDays(-3)} -MaxEvents 50'],
        ['New-TemporaryFile / Get-TempPath (env)', 'अस्थायी फ़ाइल', '$t = New-TemporaryFile'],
        ['Invoke-WebRequest (iwr)', 'HTTP download/GET-POST', 'iwr https://host/app.exe -OutFile D:\\app.exe  <b>— curl alias है, सावधान</b>'],
        ['Invoke-RestMethod', 'JSON API को object बनाकर देना', 'Invoke-RestMethod https://api.example.com/status'],
        ['Invoke-Expression (iex)', 'string को कमांड बनाकर चलाना', '<b>ख़तरनाक:</b> "iwr … | iex" का मतलब बिना पढ़े कोड चलाना — स्क्रिप्ट पहले पढ़ें'],
        ['Start-Process', 'नई प्रोसेस/विंडो, elevation, arguments', 'Start-Process cmd -Verb RunAs -ArgumentList "/k ipconfig /all"'],
        ['Start-Job / Get-Job / Receive-Job', 'बैकग्राउंड जॉब', '$j = Start-Job { Get-Process }; Receive-Job $j -Wait -AutoRemoveJob'],
        ['Register-ObjectEvent / Get-EventSubscriber', 'WMI/इवेंट वाचर (जैसे USB plug)', '—'],
        ['Get-ScheduledTask / Register- / Start- / Unregister-', 'Task Scheduler का PowerShell रूप', 'Register-ScheduledTask -TaskName "Backup" -Action (New-ScheduledTaskAction -Execute "D:\\b.bat") -Trigger (New-ScheduledTaskTrigger -Daily -At 23:30) -RunLevel Highest'],
        ['Get-LocalUser / New-LocalUser / Set-LocalUser', 'लोकल अकाउंट', 'New-LocalUser rahul -Password (ConvertTo-SecureString "Lab@2026" -AsPlainText -Force)'],
        ['Get-LocalGroup / Add-LocalGroupMember / Remove-', 'समूह व सदस्यता', 'Add-LocalGroupMember -Group Administrators -Member rahul'],
        ['Get-MpComputerStatus / MpPreference', 'Defender की स्थिति व सेटिंग', 'Get-MpComputerStatus | Select AMServiceEnabled,AntivirusSignatureLastUpdated'],
        ['Update-MpSignature / Start-MpScan', 'signature ताज़ा / फुल स्कैन', 'Start-MpScan -ScanType FullScan'],
        ['Set-MpPreference -ExclusionPath', 'एक्सक्लूज़न (DB/लॉग फ़ोल्डर)', 'सिर्फ़ ज़रूरत पर; Tamper Protection पहले से off करना पड़ सकता है'],
        ['Get-AppxPackage / Remove-AppxPackage', 'Store (UWP) ऐप सूची/हटाना', 'Get-AppxPackage *bing* | Remove-AppxPackage  <b>(-AllUsers + Get-AppxProvisionedPackage… हटाने से Store/Updtes टूट सकते हैं — सावधान)</b>'],
        ['Get-AppxPackage -AllUsers | … Add-AppxPackage -DisableDevelopmentMode', 'टूटे UWP ऐप दोबारा रजिस्टर', 'एडमिन में "re-register all apps" एक-लाइन trick'],
        ['Checkpoint-Computer', 'System Restore point बनाना', 'Checkpoint-Computer -Description "Before driver change" (System Protection ON हो)'],
        ['Restart-Computer / Stop-Computer', 'रीस्टार्ट/शटडाउन (रिमोट भी)', 'Restart-Computer -Force ; Restart-Computer -ComputerName PC2 -Credential admin'],
        ['Get-TimeZone / Set-TimeZone / w32tm', 'टाइमज़ोन व NTP sync', 'w32tm /resync /force ; w32tm /query /status'],
        ['New-TimeSpan / Get-Date', 'समय-अंतर व फ़ॉर्मैट', '(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime'],
        ['Get-Member / Get-Command / Get-Help / Update-Help', 'खुद discover करना — सबसे ज़रूरी चार', 'Get-Service | Get-Member ; Get-Help Get-Process -Examples'],
        ['Format-Table / Format-List / Format-Wide / Out-GridView', 'आउटपुट सजाकर दिखाना', '… | Out-GridView -Title "Disk"  (filter-योग्य विंडो)'],
        ['Clear-RecycleBin', 'रे-cycle bin खाली (Win10 1809+)', 'Clear-RecycleBin -DriveLetter C -Force'],
        ['Get-Counter', 'perfmon counter एक बार पढ़ना', 'Get-Counter "\\Processor(_Total)\\% Processor Time"'],
        ['Get-PnpDevice', 'Device Manager का कमांड रूप (error codes!)', 'Get-PnpDevice -PresentOnly | Where Status -ne OK | Select FriendlyName,Class,InstanceId'],
        ['Get-WmiObject (पुराना) → Get-CimInstance', 'WMI access — पुराना alias आज भी चलता है', 'नई स्क्रिप्ट हमेशा Get-CimInstance से लिखें']
      ] },

    { type: 'code', code: String.raw`# ============================================================
#  PowerShell - पाइपलाइन, फ़ॉर्मैट व discovery के ज़रूरी नमूने
# ============================================================
Get-Service | Where-Object {$_.Status -eq 'Running'} | Sort-Object DisplayName | Format-Table -AutoSize
Get-Process | Sort-Object WS -Descending | Select-Object -First 5 Name, Id, @{n='WS_MB';e={[math]::Round($_.WS/1MB,1)}}
Get-ChildItem C:\ -Recurse -File -Force -ErrorAction SilentlyContinue | Where-Object Length -gt 1GB | Sort-Object Length -Descending | Select-Object -First 15 FullName, @{n='GB';e={[math]::Round($_.Length/1GB,2)}} | Format-Table -Wrap

# group + measure (किस company के कितने ऐप, कितनी RAM)
Get-Process | Group-Object Company | Sort-Object Count -Descending | Select-Object Name, Count
(Get-ChildItem D:\ -Recurse -File -EA SilentlyContinue | Measure-Object Length -Sum).Sum / 1GB

# registry पढ़ना/लिखना providers से
Get-ItemProperty HKCU:\Software\Microsoft\Windows\CurrentVersion\Run
Set-ItemProperty HKCU:\Software\MyApp -Name Theme -Value 'Dark' -Type String

# event log - तेज़ filter (CMD के wevtutil से आसान)
Get-WinEvent -LogName System -MaxEvents 20 | Where-Object LevelDisplayName -in 'Error','Critical'
Get-WinEvent -FilterHashtable @{LogName='Application'; ProviderName='Application Error'; StartTime=(Get-Date).AddDays(-7)} | Select-Object TimeCreated, Id, @{n='Msg';e={$_.Message.Substring(0,[Math]::Min(120,$_.Message.Length))}}

# discovery - हर बार काम आती चार कमांडें
Get-Command -Noun Service
Get-Module -ListAvailable
Get-Service | Get-Member
Get-Help Get-Process -Examples

# फ़ाइल हैश, zip, टेक्स्ट हेरफेर
Get-FileHash D:\setup.exe -Algorithm SHA256
Compress-Archive -Path D:\Logs\*.log -DestinationPath D:\logs.zip -Update
(Get-Content config.txt) -replace 'Server=OLD','Server=NEW' | Set-Content config.txt
'PC1,PC2,PC3'.Split(',') | ForEach-Object { Test-Connection $_ -Count 1 -Quiet }` },

    { type: 'code', code: String.raw`<# ==========================================================
   diskreport.ps1  -  हर लोकल disk की जगह + बड़ी फ़ाइलें, CSV में
   चलाने के लिए:  powershell -NoProfile -ExecutionPolicy Bypass -File .\diskreport.ps1
========================================================== #>
$PC  = $env:COMPUTERNAME
$Dir = 'C:\Reports'
$Out = Join-Path $Dir ("disk-{0}-{1}.csv" -f $PC, (Get-Date -Format 'yyyyMMdd-HHmm'))
New-Item -ItemType Directory -Path $Dir -Force | Out-Null

# 1) हर local disk (DriveType=3) की एक row
$disks = Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' | ForEach-Object {
    $usedPct = if ($_.Size) { [math]::Round((($_.Size - $_.FreeSpace) / $_.Size) * 100, 1) } else { 0 }
    [pscustomobject]@{
        Computer = $PC
        Drive    = $_.DeviceID
        Label    = $_.VolumeName
        FS       = $_.FileSystem
        SizeGB   = [math]::Round($_.Size / 1GB, 1)
        FreeGB   = [math]::Round($_.FreeSpace / 1GB, 1)
        UsedPct  = $usedPct
    }
}

# 2) 90% से ज़्यादा भरा हो तो warning
$disks | Where-Object UsedPct -gt 90 | ForEach-Object { Write-Warning ("{0} almost full - {1} GB free" -f $_.Drive, $_.FreeGB) }

# 3) C: की 500 MB से बड़ी 10 फ़ाइलें (अलग शीट जैसी CSV)
$big = Get-ChildItem C:\ -Recurse -File -Force -ErrorAction SilentlyContinue |
       Where-Object Length -gt 500MB |
       Sort-Object Length -Descending |
       Select-Object -First 10 @{n='SizeGB';e={[math]::Round($_.Length/1GB,2)}}, FullName, LastWriteTime

# 4) CSV लिखें और खोलें
$disks | Export-Csv $Out -NoTypeInformation -Encoding UTF8
$big | Export-Csv ($Dir + '\bigfiles-' + $PC + '.csv') -NoTypeInformation -Encoding UTF8
Write-Host ("Report ready: {0}" -f $Out) -ForegroundColor Green
Invoke-Item $Out` },

    { type: 'code', code: String.raw`<# ==========================================================
   software-inventory.ps1  -  इंस्टॉल सॉफ़्टवेयर की CSV
   (registry Uninstall keys - तेज़; Win32_Product - धीमा/अंतिम विकल्प)
========================================================== #>
$Paths = @(
  'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
  'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',   # 32-बिट ऐप्स
  'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*'                 # per-user install
)

$Apps = foreach ($p in $Paths) {
  Get-ItemProperty -Path $p -ErrorAction SilentlyContinue | Where-Object {
    $_.DisplayName -and -not $_.SystemComponent -and -not $_.ParentKeyName       # hidden components छोड़ें
  } | Select-Object DisplayName, DisplayVersion, Publisher, InstallDate, InstallLocation, UninstallString, EstimatedSize
}

$Out = 'C:\Reports\software-{0}.csv' -f $env:COMPUTERNAME
New-Item -ItemType Directory -Path 'C:\Reports' -Force | Out-Null
$Apps | Sort-Object DisplayName -Unique | Export-Csv $Out -NoTypeInformation -Encoding UTF8

# publisher के हिसाब से सारांश स्क्रीन पर
$Apps | Group-Object Publisher | Sort-Object Count -Descending | Select-Object -First 10 Name, Count | Format-Table -AutoSize
Write-Host ("{0} apps logged -> {1}" -f $Apps.Count, $Out) -ForegroundColor Green

# --- वैकल्पिक: सिर्फ़ MSI से इंस्टॉल (धीमा - Windows Installer हर प्रोडक्ट verify करता है) ---
# Get-CimInstance Win32_Product | Select-Object Name, Version, Vendor, InstallDate | Export-Csv C:\Reports\msi.csv -NoTypeInformation

# --- कौन-से ऐप पर license/trial टाइप करना है: बिना publisher वाले ---
$Apps | Where-Object { -not $_.Publisher } | Select-Object DisplayName, DisplayVersion | Sort-Object DisplayName` },

    { type: 'code', code: String.raw`<# ==========================================================
   make-users.ps1  -  CSV से कई लोकल यूज़र बनाना (लैब के लिए)
   users.csv फ़ॉर्मैट:  username,fullname,description
     rahul,Rahul Sharma,Lab Batch A
     priya,Priya Verma,Lab Batch B
========================================================== #>
param([string]$CsvPath = '.\users.csv', [string]$InitialPassword = 'Lab@2026!X')

if (-not (Test-Path $CsvPath)) { throw "CSV नहीं मिला: $CsvPath" }
$SecPass = ConvertTo-SecureString $InitialPassword -AsPlainText -Force

# 1) पासवर्ड नीति दिखें (कम-से-कम लंबाई/complexity/लॉकआउट)
net accounts

Import-Csv $CsvPath | ForEach-Object {
  $u = $_.username.Trim()
  if (Get-LocalUser -Name $u -ErrorAction SilentlyContinue) {
    Write-Warning "$u पहले से मौजूद - छोड़ दिया"
    return
  }
  New-LocalUser -Name $u -FullName $_.fullname -Description $_.description \`
                -Password $SecPass -PasswordNeverExpires $false -AccountNeverExpires | Out-Null
  Add-LocalGroupMember -Group 'Users' -Member $u -ErrorAction SilentlyContinue
  Write-Host "बना: $u ($($_.fullname))" -ForegroundColor Green
}

# 2) एडमिन बनाने वाले rows अलग CSV से - सावधानी से
# Import-Csv admins.csv | ForEach-Object { Add-LocalGroupMember -Group 'Administrators' -Member $_.username }

# 3) सत्यापन
Get-LocalUser | Select-Object Name, Enabled, LastLogon, PasswordExpires | Format-Table -AutoSize

# 4) नीति सेट करनी हो (न्यूनतम लंबाई 8) - secedit का template तरीक़ा
secedit /export /cfg C:\Reports\sec.inf | Out-Null
(Get-Content C:\Reports\sec.inf) -replace 'MinimumPasswordLength\s*=\s*\d+', 'MinimumPasswordLength = 8' |
  Set-Content C:\Reports\sec2.inf
# secedit /configure /db secedit.sdb /cfg C:\Reports\sec2.inf /areas SECURITYPOLICY` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.8</span> तीन स्क्रिप्ट की लाइन-दर-लाइन व्याख्या</h3>
      <h4 class="blk2">A) diskreport.ps1</h4>
      <ol>
        <li><code>$PC = $env:COMPUTERNAME</code> — environment वेरिएबल से मशीन का नाम; CSV के नाम में जुड़ जाता है जिससे कई PC की रिपोर्ट मिलाई जा सकती है।</li>
        <li><code>New-Item -ItemType Directory -Force | Out-Null</code> — Reports फ़ोल्डर न हो तो बनाएँ; <code>| Out-Null</code> का मतलब "बनाम फ़ोल्डर का विवरण स्क्रीन पर न छपे"।</li>
        <li><code>Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3'</code> — WMI class Win32_LogicalDisk, फ़िल्टर का मतलब सिर्फ़ <b>local disks</b> (3=local, 2=removable, 4=network, 5=CD)।</li>
        <li><code>ForEach-Object { [pscustomobject]@{…} }</code> — हर disk को एक tidy object बनाया, जिसमें <code>[math]::Round($_.Size/1GB,1)</code> बाइट को GB में बदलता है (<code>1GB</code> PowerShell का built-in गुणक = 1073741824)।</li>
        <li><code>if ($_.Size) {…} else {0}</code> — media-reader/empty drive पर Size null आता है; भाग-शून्य की गड़बड़ यहीं रुकती है।</li>
        <li><code>Where-Object UsedPct -gt 90 | Write-Warning</code> — 90% से ज़्यादा भरे volume पर पीली warning; इसे <code>Send-MailMessage</code>/<code>Write-EventLog</code> से बदलकर alert बना सकते हैं।</li>
        <li><code>Get-ChildItem C:\\ -Recurse -File -Force -EA SilentlyContinue</code> — पूरा C: ट्री, सिर्फ़ फ़ाइलें, hidden/system सहित, और <code>-EA SilentlyContinue</code> से "Access Denied" की लाल पंक्तियाँ नहीं दिखतीं (यही सही तरीक़ा है)।</li>
        <li><code>Where-Object Length -gt 500MB</code> — 500 MB से बड़ी फ़ाइलें; <code>Select-Object -First 10</code> सबसे बड़ी 10।</li>
        <li><code>Export-Csv -NoTypeInformation -Encoding UTF8</code> — Excel में खुलने वाली CSV; <code>-NoTypeInformation</code> का मतलब पहली line में "#TYPE…" कचरा नहीं।</li>
        <li><code>Invoke-Item $Out</code> — CSV खोलकर दिखा देता है (रन के बाद तुरंत जाँच)।</li>
      </ol>
      <h4 class="blk2">B) software-inventory.ps1</h4>
      <ol>
        <li>तीनों <b>Uninstall paths</b> ज़रूरी हैं: 64-बिट ऐप HKLM\\Software\\…\\Uninstall, <b>32-बिट ऐप WOW6432Node</b> वाले path में, और per-user (Chrome/Teams जैसी) HKCU में — एक ही जगह देखने पर "आधा सॉफ़्टवेयर नहीं दिखा" की शिकायत आती है।</li>
        <li><code>Where-Object { $_.DisplayName -and -not $_.SystemComponent … }</code> — Windows के सैकड़ों invisible hotfix/entry फ़िल्टर करता है (यही Control Panel की सूची का नियम है)।</li>
        <li><code>Select-Object … EstimatedSize</code> — KB में साइज़; <code>UninstallString</code> से पता चलता है silent uninstall कैसे करना है (<code>/S</code>, <code>/qn</code>)।</li>
        <li><code>Sort-Object DisplayName -Unique</code> — वही ऐप कई जगह से आया हो तो एक बार।</li>
        <li><code>Group-Object Publisher</code> — किस company के कितने ऐप: license/audit रिपोर्ट का सारांश।</li>
        <li>कमेंटेड <code>Win32_Product</code> — यह <b>धीमा</b> है क्योंकि हर MSI प्रोडक्ट को Windows Installer re-verify करता है, और कुछ एप्लिकेशन के repair trigger हो सकते हैं; इसलिए इसे अंतिम विकल्प रखा है।</li>
      </ol>
      <h4 class="blk2">C) make-users.ps1</h4>
      <ol>
        <li><code>param([string]$CsvPath = …)</code> — स्क्रिप्ट को arguments देने की आधिकारिक विधि (<code>.\\make-users.ps1 -CsvPath d:\\batch5.csv</code>); default मान न देने पर भी चले।</li>
        <li><code>throw</code> — CSV न मिले तो तुरंत रोकें, वरना अधूरा काम होकर "सब बन गए" दिखाएगा।</li>
        <li><code>net accounts</code> — पहले लॉग में पासवर्ड की न्यूनतम लंबाई/जटिलता/एक्सपायरी दिख जाए; <code>Lab@2026!X</code> जैसा password इसलिए चुना कि complexity नीति (upper+lower+digit+symbol, ≥8) पास हो।</li>
        <li><code>ConvertTo-SecureString -AsPlainText -Force</code> — cmdlet को plain string नहीं, SecureString चाहिए; <code>-Force</code> उस conversion की पुष्टि करता है।</li>
        <li><code>Get-LocalUser … -EA SilentlyContinue</code> — मौजूदा यूज़र पर skip (<code>return</code> उसी pipeline item से आगे बढ़ाता है, स्क्रिप्ट नहीं रोकता)।</li>
        <li><code>New-LocalUser -PasswordNeverExpires $false -AccountNeverExpires</code> — पासवर्ड समय पर expire हो, पर अकाउंट कभी निष्क्रिय न हो (लैब बैच के लिए यही चाहिए)।</li>
        <li><code>Add-LocalGroupMember -Group 'Users'</code> — समूह ही असली permission है; <b>Administrators में केवल ज़रूरी</b> जोड़ें (comment वाला हिस्सा इसलिए अलग रखा)।</li>
        <li>अंत में <code>Get-LocalUser | Format-Table</code> — सत्यापन; और <code>secedit /export → edit → /configure</code> नीति बदलने का पारंपरिक (non-domain) तरीक़ा — <code>/areas SECURITYPOLICY</code> सिर्फ़ वही हिस्सा लागू करता है, पूरा template नहीं धकेलता।</li>
      </ol>` },

    { type: 'table', head: ['पहलू', 'CMD (.bat)', 'PowerShell (.ps1)'],
      rows: [
        ['Pipeline का स्वरूप', 'सादा टेक्स्ट — findstr/sort से काटना पड़ता है', 'Objects — property/method सीधे (<code>$_.FreeSpace</code>)'],
        ['उम्र/उपलब्धता', 'हर Windows में, बिना कुछ इंस्टॉल', '5.1 हर Windows 7+ में; 7 (pwsh) अलग install, Linux/Mac पर भी'],
        ['नाम का ढाँचा', 'अनियमित (dir, copy, del — CPM/DOS विरासत)', 'Verb-Noun नियमित — Get/Set/New/Remove/Test/Start-…'],
        ['सीखना/discovery', 'कमांड /? और किताबें', 'Get-Help, Get-Command, Get-Member — खुद पूछिए'],
        ['Numbers/तारीख़', 'set /a सिर्फ़ पूर्णांक; %DATE% locale पर निर्भर', '[int]/[double]/[datetime], 1GB गुणक, Get-Date -Format'],
        ['Quoting/escaping', '%, ^, & और double-quote के उलझने वाले नियम', 'single/double quote + backtick escape; फिर भी quotes पर ध्यान'],
        ['Error handling', 'errorlevel जाँचना पड़ता है (हर कमांड के बाद)', '<code>try/catch</code>, <code>-ErrorAction</code>, <code>$?</code>, <code>$ErrorActionPreference</code>'],
        ['Exit code', '%ERRORLEVEL%', '<code>$LASTEXITCODE</code> (चलाए गए exe का) और <code>throw</code>'],
        ['Formatting', 'echo/redirect/manual columns', 'Format-Table/List/Wide, Out-GridView, ConvertTo-Html/Json/Csv'],
        ['Remote', 'psexec/psexec जैसी थर्ड-पार्टी या net use', 'WinRM built-in — Enter-PSSession, Invoke-Command -ComputerName; SSH भी'],
        ['Rozšíření/modules', 'कोई नहीं; third-party exe (grep, rsync) जोड़ने पड़ते हैं', 'PS Gallery modules (Az, PnP, VMware), functions, DSC'],
        ['गति (एक काम)', 'छोटे काम में तेज़, RAM कम', 'startup थोड़ा धीमा; पर लॉजिक 5 लाइन में'],
        ['कब सही?', 'एक-दो कमांड, पुरानी मशीन/WinPE/RE, quick fix', 'दो से ज़्यादा स्टेप, रिपोर्ट, many PC, loops/CSV/JSON — PowerShell'],
        ['दुकान का व्यावहारिक नियम', 'RE/bcdboot/chkdsk/netsh यहीं से (सिंटैक्स छोटा)', 'इन्वेंटरी, many-PC change, scheduled job, Defender/BitLocker/Store काम']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.9</span> रिमोट कमांड व offline servicing</h3>
      <p>लैब/दुकान में 20 PC पर एक ही काम बैठे-बैठे करने के तीन रास्ते:</p>
      <ol>
        <li><b>WinRM (PowerShell Remoting)</b> — <code>Enable-PSRemoting -Force</code> (सेवा + फ़ायरवॉल 5985/5986), फिर <code>Enter-PSSession -ComputerName PC07 -Credential admin</code> (इंटरैक्टिव shell दूसरी मशीन पर) या <code>Invoke-Command -ComputerName PC01,PC02,PC03 -ScriptBlock { Get-Service Spooler | Restart-Service } -Credential admin</code> (एक साथ सब पर)। Workgroup (डोमेन नहीं) में <code>Set-Item WSMan:\\localhost\\Client\\TrustedHosts -Value "192.168.1.*"</code> + explicit credential चाहिए, और target पर <code>winrm quickconfig</code>। <code>Test-WSMan PC07</code> से पता चलता है कि service सुन रहा है या नहीं।</li>
        <li><b>OpenSSH (Windows का built-in feature)</b> — Client: <code>Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0</code> (Win10 1809+ में पहले से), Server target पर <code>Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0</code> → <code>Start-Service sshd</code> → <code>Set-Service sshd -StartupType Automatic</code>; फिर <code>ssh admin@192.168.1.20</code>, <code>scp D:\\a.log admin@192.168.1.20:D:\\</code>। Linux मशीन/ नेटवर्क डिवाइस से भी इसी से जुड़ते हैं — port 22, फ़ायरवॉल नियम अपने आप बन जाता है।</li>
        <li><b>PsExec (Sysinternals)</b> — <code>psexec \\\\PC07 -u admin -p cmd</code>, <code>-s</code> SYSTEM के रूप में, <code>-i 2</code> यूज़र के desktop session में। यह SMB (445) + ADMIN$ शेयर पर निर्भर है — फ़ायरवॉल/PsPass/एडमिन शेयर चाहिए और कई एंटीवायरस इसे "hacktool" संकेत देते हैं; इसलिए केवल अपने नेटवर्क पर, लिखित अनुमति से।</li>
      </ol>
      <table class="tbl"><tr><th>काम</th><th>कमांड</th></tr>
        <tr><td>सब PC से RAM/CPU एक साथ</td><td>Invoke-Command -ComputerName (Get-Content PCs.txt) -ScriptBlock { Get-CimInstance Win32_OperatingSystem | Select PSComputerName,Caption,TotalVisibleMemorySize }</td></tr>
        <tr><td>रिमोट मशीन की फ़ाइल लेना</td><td>$s = New-PSSession PC07 ; Copy-Item D:\\log.txt -Destination D:\\collect\\ -FromSession $s</td></tr>
        <tr><td>पूरा module रिमोट में import</td><td>$s = New-PSSession PC07 ; Import-PSSession $s -Module BitLocker (implicit remoting)</td></tr>
        <tr><td>WinRM फिर भी fail</td><td>winrm enumerate winrm/config/listener ; winrm set winrm/config/client @{TrustedHosts="*"} (केवल लैब में); Kerberos vs NTLM, time skew 5 मिनट से ज़्यादा</td></tr>
        <tr><td>Offline Windows image servicing</td><td>Mount-WindowsImage -ImagePath D:\\install.wim -Index 6 -Path C:\\M ; Add-WindowsDriver -Path C:\\M -Driver D:\\drivers -Recurse ; Add-WindowsPackage -Path C:\\M -PackagePath D:\\cab\\net48.cab ; Dismount-WindowsImage -Path C:\\M -Save</td></tr>
        <tr><td>बूट न होने वाली Windows ठीक (RE cmd)</td><td>sfc /scannow /offbootdir=C:\\ /offwindir=C:\\Windows ; DISM /Image:C:\\ /Cleanup-Image /RestoreHealth ; chkdsk C: /f /r ; bootrec/bcdboot (अध्याय 5)</td></tr>
        <tr><td>पुराने/नए PC पर एक जैसी सेटिंग</td><td> Desired State Configuration: Set-DSCLocalEngine? (केवल अभ्यास) — आसान तरीक़ा: एक .ps1 स्क्रिप्ट + Scheduled Task + Group Policy/logon script</td></tr>
      </table>
      <div class="callout danger"><b class="ct">नैतिक व क़ानूनी सीमा</b><p>दूसरे की मशीन/नेटवर्क पर कमांड चलाना (remoting, PsExec, password recovery, key extraction) सिर्फ़ <b>मालिक की स्पष्ट लिखित अनुमति</b> और अपने काम के दायरे में। ग्राहक का Wi-Fi password, browser save पासवर्ड या स्टोरेज शेयर "निकालना" बिना बताए — यह अनुचित है और IT Act/गोपनीयता नीति का उल्लंघन। यही कारण है कि सारे practical अपने ही लैब PC पर कीजिए।</p></div>` },

    { type: 'acc', items: [
      { q: 'एडमिन CMD कैसे खोलें — सबसे तेज़ तरीक़ा?', a: '<code>Win+X</code> → <b>Windows Terminal (Admin)</b> / Command Prompt (Admin), या Start में <code>cmd</code> टाइप करके <b>Ctrl+Shift+Enter</b>। title bar पर "Administrator:" दिखे तभी elevated है। RE/सेटअप विंडो में <b>Shift+F10</b> से cmd खुलता है।' },
      { q: 'PowerShell में "cannot be loaded because running scripts is disabled" आ रहा है', a: 'Execution policy <code>Restricted</code> है। <code>Get-ExecutionPolicy -List</code> से देखें, फिर <code>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code> (पूरे मशीन के लिए AllUsers)। एक बार के लिए: <code>powershell -ExecutionPolicy Bypass -File script.ps1</code>। इंटरनेट से आई फ़ाइल पर <code>Unblock-File</code> या Properties → Unblock भी ज़रूरी हो सकता है।' },
      { q: 'CMD में for loop चलता है, .bat में नहीं — क्यों?', a: 'बैच फ़ाइल में loop variable को <b>%%a</b> लिखना पड़ता है, कमांड लाइन पर <b>%a</b>। यही नहीं, <code>%</code> वाले किसी भी टेक्स्ट को <code>%%</code> करना पड़ता है।' },
      { q: 'robocopy ने कुछ कॉपी नहीं किया / "FAILED 5"', a: 'पहले destination path जाँचें (शेयर हो तो <code>net use</code> से कनेक्ट करके credentials सही)। Source/destination उलट तो नहीं दिए — <code>robocopy SRC DST</code> क्रम यही है। 8+ code = genuine fail; log फ़ाइल पढ़ें (<code>/LOG:bak.log</code>)।' },
      { q: 'del से मिटी फ़ाइल वापस आ सकती है?', a: 'CMD का <code>del</code>/<code>rd /s /q</code> recycle bin में नहीं डालता। मशीन का उपयोग तुरंत बंद कीजिए (लिखना = overwrite), फिर Recuva/PhotoRec/R-Studio जैसे टूल से scan — दूसरी डिस्क पर restore करें। यही कारण है कि दुकान में "पहले image, फिर data recovery" का नियम है।' },
      { q: 'wmic का विकल्प अब क्या सीखें?', a: '<code>Get-CimInstance</code> — मिसाल: <code>wmic bios get serialnumber</code> की जगह <code>(Get-CimInstance Win32_BIOS).SerialNumber</code>। WMIC deprecated है, CIM/MSFT_* modules भविष्य हैं।' },
      { q: 'एक ही कमांड 20 PC पर कैसे चलाएँ?', a: 'WinRM से: <code>Invoke-Command -ComputerName (Get-Content PCs.txt) -ScriptBlock { Set-Service SysMain -StartupType Disabled } -Credential (Get-Credential)</code>। domain न हो तो TrustedHosts + IP; न चाहें तो PsExec या Group Policy logon script।' },
      { q: 'PowerShell में text फ़ाइल की एक लाइन कैसे बदलें?', a: '<code>(Get-Content file.txt) -replace "old","new" | Set-Content file.txt</code>। backup चाहिए तो पहले <code>Copy-Item file.txt file.bak</code>; regex चाहिए तो -replace regex ही है, इसलिए dots escape करें (<code>"192\\.168\\.1\\.1"</code>)।' },
      { q: 'iwr … | iex वाली इंस्टॉल कमांड चलानी चाहिए?', a: 'बिना स्क्रिप्ट पढ़े नहीं। यह pattern डाउनलोड किए कोड को तुरंत चला देता है — official vendor ने ही दिया हो तो भी पहले उस URL की फ़ाइल save करके पढ़िए, hash (<code>Get-FileHash</code>) मिलाइए।' }
    ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में सबसे ज़्यादा पूछे जाने वाले', html: '<ol><li><b>CD vs PUSHD</b>, <b>CD /D</b> का उपयोग, और <code>D:</code> से ड्राइव स्विचिंग।</li><li><b>dir /a</b> (hidden+system दिखाएँ), <b>dir /s</b>, <b>dir /b</b>, <b>dir /o-d</b> — चारों flag अलग-अलग पूछे जाते हैं।</li><li><b>copy / xcopy / robocopy</b> में फ़र्क़ और <b>robocopy /MIR</b> का ख़तरा।</li><li><b>attrib +r -h</b>, <b>del /f /s /q</b>, <b>rd /s /q</b> का मतलब।</li><li><b>findstr</b> बनाम <b>find</b>; <b>where</b> का काम।</li><li>बैच में <b>%%a बनाम %a</b>, <b>%~dp0</b>, <b>errorlevel</b>, <b>call :label</b>।</li><li><b>ipconfig /all, /release, /renew, /flushdns</b> — कब-कौन-सा (यह almost हर पेपर में है)।</li><li><b>ping बनाम tracert बनाम pathping बनाम netstat -ano</b> — कौन क्या मापता है।</li><li><b>nslookup set type=MX</b> व DNS का काम।</li><li><b>sfc /scannow</b>, <b>DISM /Online /Cleanup-Image /RestoreHealth</b> — और दोनों का <b>सही क्रम (पहले DISM, फिर SFC)</b>।</li><li><b>chkdsk /f /r /x</b> के अर्थ व offline reboot व्यवहार।</li><li><b>net user / net localgroup / net share / net use</b> का सिंटेक्स।</li><li><b>slmgr /dli /dlv /xpr /ipk /ato</b>; <b>gpupdate /force</b>; <b>certutil -hashfile</b>।</li><li>PowerShell: <b>object pipeline</b>, <b>Verb-Noun</b>, <b>$_</b>, <b>Get-Help/Get-Member</b>, <b>Execution Policy</b> का मतलब (security नहीं, guardrail) और <b>5.1 बनाम 7</b>।</li><li><b>Enter-PSSession बनाम Invoke-Command</b>, <b>WinRM</b> का पोर्ट (5985 HTTP / 5986 HTTPS) व OpenSSH (22)।</li></ol>' }
  ]
}
]);

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
{
  id:'win-install', icon:'🪟', group:'विंडोज़ मास्टरक्लास',
  title:'विंडोज़ इंस्टॉल, रिपेयर व BSOD',
  sub:'UEFI/GPT, bootable USB, साफ़ इंस्टॉल, WinRE, bootrec/bcdboot, SFC/DISM व stop codes',
  kicker:'Windows Masterclass 5 · Install, Repair & BSOD',
  hero:'सर्विस सेंटर का सबसे आम काम — "विंडोज़ डाल दो" और "नीली स्क्रीन आ रही है"। यह पृष्ठ पूरा चक्र सिखाता है: Windows 11 की असली ज़रूरतें (TPM 2.0, Secure Boot), सही edition, bootable USB बनाना, UEFI बनाम Legacy और GPT बनाम MBR, डिस्क का सही partition नक़्शा, साफ़ इंस्टॉल के हर चरण, ड्राइवर व activation, Windows Update, फिर मरम्मत का पूरा हथियारख़ाना — WinRE, Safe Mode, Startup Repair, SFC, DISM, bootrec, bcdboot, Reset this PC — और BSOD के stop code पढ़कर असली कारण तक पहुँचना।',
  tags:['ज़रूरतें व edition','Bootable USB व UEFI','GPT partition नक़्शा','साफ़ इंस्टॉल के चरण','WinRE व SFC/DISM','BSOD stop codes'],
  blocks:[

  { type:'callout', kind:'info', title:'इस पृष्ठ के बाद आप क्या कर पाएँगे', html:'<p>1) किसी मशीन पर Windows 11 चलेगी या नहीं, जाँचकर बता सकेंगे। 2) सही ISO लेकर bootable USB बना सकेंगे और UEFI में boot करा सकेंगे। 3) GPT/MBR और EFI/MSR/Recovery partition का अर्थ समझा सकेंगे। 4) बिना किसी की मदद के साफ़ इंस्टॉल पूरा कर सकेंगे। 5) इंस्टॉल के बाद ड्राइवर, activation और Update ठीक कर सकेंगे। 6) न चलती विंडोज़ को WinRE, Safe Mode, SFC/DISM और bootrec/bcdboot से ठीक कर सकेंगे। 7) BSOD का stop code पढ़कर RAM/ड्राइवर/डिस्क में सही दिशा पकड़ सकेंगे।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.1</span> पहले जाँच — मशीन तैयार है या नहीं</h3><p>Windows 11 की कठिन शर्तें केवल RAM/CPU नहीं, बल्कि <b>TPM 2.0</b> और <b>UEFI + Secure Boot</b> हैं। 2016 के बाद के अधिकांश सिस्टम में TPM firmware रूप में मौजूद है पर BIOS में बंद रहता है — Intel पर <b>PTT (Platform Trust Technology)</b>, AMD पर <b>fTPM</b>। उसे चालू करते ही मशीन योग्य हो जाती है।</p>' },
  { type:'table', head:['ज़रूरत','Windows 11 (न्यूनतम)','व्यावहारिक सिफ़ारिश','कैसे जाँचें'], rows:[
    ['CPU','1 GHz+, 2 कोर, 64-bit, सूचीबद्ध (Intel 8वीं पीढ़ी+/AMD Zen2+)','4 कोर, 10वीं पीढ़ी+','msinfo32 → Processor; PC Health Check'],
    ['RAM','4 GB','8 GB (16 GB आरामदायक)','Task Manager → Performance → Memory'],
    ['Storage','64 GB','256 GB SSD','diskmgmt.msc'],
    ['Firmware','UEFI, Secure Boot capable','UEFI + Secure Boot ON','msinfo32 → BIOS Mode / Secure Boot State'],
    ['TPM','TPM 2.0','2.0 चालू','tpm.msc → Status “ready for use”'],
    ['Display','9" + 720p, 8-bit colour','1080p','—'],
    ['Graphics','DirectX 12 + WDDM 2.0','कोई भी आधुनिक GPU','dxdiag'],
    ['Internet + MSA','Home में पहली बार सेटअप पर अनिवार्य','Pro में local खाता सम्भव','—'],
    ['Windows 10 के लिए','1 GHz, 1/2 GB RAM, 16/20 GB डिस्क','4 GB + SSD','पुरानी मशीनों के लिए 10 ही सही'],
  ] },
  { type:'code', code: ':: --- तैयारी की एक-लाइन जाँच (PowerShell, Admin) ---\nGet-ComputerInfo | Select WindowsProductName,CsProcessors,CsTotalPhysicalMemory,BiosFirmwareType\nConfirm-SecureBootUEFI            # True चाहिए; "not supported" = Legacy BIOS\nGet-Tpm                           # TpmPresent / TpmReady / SpecVersion\ndiskpart                          # -> list disk -> GPT के नीचे * होना चाहिए\n\n:: msinfo32 में देखने वाले चार खेत\n::   BIOS Mode              = UEFI\n::   Secure Boot State      = On\n::   Processor              = सूचीबद्ध मॉडल\n::   Installed Physical RAM = 4 GB+\n\n:: TPM न दिखे तो BIOS/UEFI में:\n::   Intel -> Advanced -> PCH-FW -> PTT = Enabled\n::   AMD   -> Advanced -> CPU Config -> AMD fTPM switch = Enabled\n::   Secure Boot: Boot -> Secure Boot = Enabled, CSM = Disabled' },
  { type:'table', head:['Edition','किसके लिए','मुख्य अतिरिक्त सुविधा','ध्यान'], rows:[
    ['Home','घर, छात्र','मूल सब कुछ','Group Policy नहीं; पहली बार में MSA + इंटरनेट चाहिए'],
    ['Pro','छोटा दफ़्तर, प्रशिक्षण','BitLocker, gpedit.msc, Hyper-V, Remote Desktop host, Domain join','ITI लैब के लिए सबसे उपयुक्त'],
    ['Pro for Workstations','भारी workstation','ReFS, SMB Direct, ज़्यादा RAM/CPU','महँगा'],
    ['Enterprise','बड़ी संस्था','AppLocker, DirectAccess, LTSC विकल्प','Volume licensing'],
    ['Education','स्कूल/कॉलेज','Enterprise जैसा, शैक्षिक लाइसेंस','संस्थागत लाइसेंस से'],
    ['IoT Enterprise LTSC','kiosk/मशीन','10 वर्ष support, कोई feature update नहीं','सामान्य डेस्कटॉप के लिए नहीं'],
    ['N संस्करण','यूरोप','Media Player/कोडेक हटाए हुए','Media Feature Pack अलग डालना पड़ता — सामान्यतः न लें'],
  ] },
  { type:'callout', kind:'tip', title:'32-bit बनाम 64-bit और ARM', html:'<p>Windows 11 <b>केवल 64-bit (x64 या ARM64)</b> है — 32-bit संस्करण नहीं बनता। 4 GB से कम RAM वाली पुरानी मशीन पर Windows 10 32-bit ही चलेगी। ARM वाले लैपटॉप (Snapdragon) पर x64 ऐप emulation से चलते हैं पर हर ड्राइवर/एंटीचीट नहीं — ख़रीदने से पहले जाँच लें।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.2</span> Bootable USB और boot कराना</h3><p>इंस्टॉल का पहला व्यावहारिक काम है सही ISO से सही USB बनाना। <b>Media Creation Tool</b> सीधा Microsoft से ISO/USB बनाता है। <b>Rufus</b> ज़्यादा नियंत्रण देता है — partition scheme (GPT/MBR), target system (UEFI/BIOS), और Windows 11 की TPM/RAM जाँच हटाने का विकल्प भी। USB हमेशा <b>8 GB या बड़ा</b> लें; बनाने पर उसका सब डाटा मिट जाता है।</p>' },
  { type:'table', head:['औज़ार','कब','खास बात'], rows:[
    ['Media Creation Tool','सीधा, आधिकारिक रास्ता','अपने आप सही संस्करण; कम विकल्प'],
    ['Rufus','नियंत्रण चाहिए तो','GPT/MBR चुनें; पुरानी मशीन पर जाँच हटाने का विकल्प'],
    ['Ventoy','एक USB पर कई ISO','ISO बस copy करें; बार-बार format नहीं'],
    ['Windows USB/DVD tool','पुराना','आज Rufus बेहतर'],
    ['dd (लिनक्स)','कमांड से','Windows ISO पर हमेशा सही नहीं — Rufus/Ventoy बेहतर'],
    ['PXE / Network boot','लैब में 30 मशीन एक साथ','WDS/MDT या Serva; समय बहुत बचता है'],
  ] },
  { type:'steps', items:[
    { n:1, title:'ISO सही जगह से लें', text:'Microsoft की “Download Windows 11” पेज से ISO लें। किसी तीसरी साइट की “pre-activated” ISO कभी न लें — उसमें मैलवेयर और बदला हुआ सिस्टम होता है।' },
    { n:2, title:'USB बनाएँ', text:'Rufus खोलें → Device में अपनी USB → Boot selection में ISO → Partition scheme = GPT, Target system = UEFI (नई मशीन) → File system FAT32/NTFS जैसा Rufus सुझाए → START। चेतावनी पढ़कर हाँ करें — USB का सब डाटा मिटेगा।' },
    { n:3, title:'BIOS/UEFI में जाएँ', text:'मशीन चालू करते ही F2 / Del / F10 / F12 / Esc (निर्माता अनुसार) दबाएँ। Boot मेनू के लिए अक्सर F12 सीधा काम करता है।' },
    { n:4, title:'Boot सेटिंग ठीक करें', text:'Boot Mode = UEFI, CSM/Legacy = Disabled, Secure Boot = Enabled (Windows 11 के लिए), और Boot Order में USB पहले। SATA Mode = AHCI रखें (RAID/Intel RST बदलने पर बाद में BSOD आता है)।' },
    { n:5, title:'USB से boot करें', text:'F12 boot menu से “UEFI: <USB नाम>” चुनें — केवल USB नाम नहीं। “UEFI:” उपसर्ग ज़रूरी है, वरना GPT इंस्टॉल नहीं होगा।' },
    { n:6, title:'भाषा व Install now', text:'Language/Time/Keyboard चुनें → Next → Install now। Product key माँगे तो “I don’t have a product key” करके आगे बढ़ें; edition बाद में चुनें और activation बाद में करें।', tips:['ग़लत edition चुनने पर बाद में बदलने के लिए पुनः इंस्टॉल करना पड़ सकता है — पहले ही Pro चुनें यदि लाइसेंस Pro का है।'] },
  ] },
  { type:'table', head:['Boot त्रुटि','अर्थ','हल'], rows:[
    ['“Selected boot device failed”','USB bootable नहीं बनी','Rufus से दोबारा बनाएँ; दूसरा USB पोर्ट/USB 2.0 आज़माएँ'],
    ['USB दिखता ही नहीं','Legacy/CSM mismatch या Secure Boot रोक रहा','UEFI में USB entry चुनें; ज़रूरत हो तो Secure Boot अस्थायी Off'],
    ['“Windows cannot be installed to this disk. The selected disk has an MBR partition table”','UEFI मोड में MBR डिस्क','डिस्क के सारे partition मिटाकर Unallocated करें (डाटा जाएगा) — Setup खुद GPT बनाएगा'],
    ['“…GPT partition table” पर पुरानी मशीन','Legacy मोड में GPT डिस्क','BIOS में UEFI चालू करें, या डिस्क को MBR में बदलें'],
    ['“We couldn’t find any drives”','स्टोरेज ड्राइवर (Intel RST/VMD) नहीं','“Load driver” से निर्माता का RST/VMD ड्राइवर USB से डालें, या BIOS में VMD बंद करके AHCI करें'],
    ['“This PC can’t run Windows 11”','TPM/Secure Boot/CPU शर्त','BIOS में PTT/fTPM व Secure Boot ON; न चले तो Windows 10 लें'],
    ['इंस्टॉल के बाद सीधे BIOS में लौटना','boot order में USB अभी पहले है','USB निकालें; Windows Boot Manager पहले रखें'],
    ['0xc000000e / 0xc0000225 पर boot','BCD टूटा/ग़ायब','WinRE → bootrec /rebuildbcd या bcdboot (नीचे)'],
  ] },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.3</span> UEFI बनाम Legacy और GPT बनाम MBR</h3><p>ये दो अलग-अलग जोड़े हैं जिन्हें छात्र मिला देते हैं। <b>UEFI/Legacy</b> firmware का तरीक़ा है; <b>GPT/MBR</b> डिस्क की partition-तालिका का तरीक़ा है। सही जोड़ी है — <b>UEFI + GPT</b> (आधुनिक) और <b>Legacy BIOS + MBR</b> (पुराना)। Secure Boot केवल UEFI में मिलता है।</p>' },
  { type:'table', head:['पहलू','Legacy BIOS + MBR','UEFI + GPT'], rows:[
    ['उम्र','1981 से','2007 के बाद, आज मानक'],
    ['डिस्क आकार सीमा','2 TB तक','9.4 ZB (व्यावहारिक रूप से असीमित)'],
    ['Partition संख्या','4 primary (या 3 + extended)','128 primary (कोई extended नहीं)'],
    ['Bootloader','MBR के पहले 446 byte में','अलग EFI System Partition (FAT32) में .efi फ़ाइल'],
    ['Secure Boot','नहीं','हाँ — हस्ताक्षरित bootloader ही चले'],
    ['Boot गति','धीमा POST','तेज़, parallel initialization'],
    ['इंटरफ़ेस','केवल कीबोर्ड, text','माउस, GUI, नेटवर्क भी सम्भव'],
    ['तालिका की सुरक्षा','एक ही copy — बिगड़ी तो गया','primary + backup copy, CRC जाँच'],
    ['कब चुनें','बहुत पुरानी मशीन / 2 TB से छोटी डिस्क','हर नई मशीन, Windows 11 अनिवार्य'],
  ] },
  { type:'table', head:['GPT partition (क्रम से)','आकार','फ़ाइल-सिस्टम','काम'], rows:[
    ['EFI System Partition (ESP)','100–500 MB','FAT32','bootloader (.efi) — यहीं से UEFI विंडोज़ चलाता है'],
    ['Microsoft Reserved (MSR)','16 MB','कोई नहीं','भविष्य के dynamic disk काम के लिए आरक्षित; छिपा रहता है'],
    ['Primary — Windows (C:)','बाक़ी जगह','NTFS','असली OS व आपका डाटा'],
    ['Recovery / WinRE','500 MB–1 GB','NTFS','WinRE का winre.wim — मरम्मत का माहौल'],
    ['OEM / ड्राइवर partition','निर्माता अनुसार','प्रायः NTFS','फ़ैक्टरी रिकवरी (लैपटॉप में)'],
  ] },
  { type:'callout', kind:'warn', title:'“Convert to GPT” करने से पहले', html:'<p><b>diskpart → clean</b> या Setup में partition मिटाना <b>पूरी डिस्क का डाटा मिटा देता है</b> — पहले backup लें। Windows 10/11 में बिना मिटाए बदलने का औज़ार है: <code>MBR2GPT.EXE /validate /allowFullOS</code> फिर <code>MBR2GPT /convert /allowFullOS</code> — पर यह तभी चलेगा जब 4 से कम primary partition हों और validation पास हो। बदलने के बाद BIOS में भी Legacy से UEFI करना पड़ता है, वरना boot नहीं होगा।</p>' },
  { type:'code', code: ':: --- diskpart: साफ़ इंस्टॉल के लिए डिस्क तैयार (सावधानी!) ---\ndiskpart\n  list disk                 :: नंबर पक्का करें — आकार देखकर\n  select disk 0             :: ग़लत नंबर = ग़लत डिस्क मिटेगी\n  detail disk               :: एक बार और पुष्टि\n  clean                     :: पूरी partition तालिका मिटाता है\n  convert gpt\n  exit\n:: इसके बाद Setup में Unallocated space चुनें -> Next\n:: Windows खुद ESP + MSR + C: + Recovery बना लेता है\n\n:: --- डाटा मिटाए बिना MBR -> GPT (विंडोज़ चलती हुई) ---\nmbr2gpt /validate /allowFullOS\nmbr2gpt /convert /allowFullOS\n:: फिर BIOS में Boot Mode = UEFI करें\n\n:: --- Setup के बीच में कमांड खोलना ---\n:: Shift + F10  -> CMD (इंस्टॉलर के किसी भी चरण पर)\n:: यहीं से diskpart, notepad (फ़ाइल बचाव), bcdboot चला सकते हैं' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.4</span> साफ़ इंस्टॉल के पूरे चरण और उसके बाद का काम</h3><p>साफ़ (clean) इंस्टॉल = पुराना OS हटाकर नया। <b>Upgrade/in-place</b> = फ़ाइलें व ऐप रखते हुए OS बदलना। जब सिस्टम बहुत बिगड़ा हो, मैलवेयर हो, या डिस्क बदली हो — साफ़ इंस्टॉल ही सही है।</p>' },
  { type:'steps', items:[
    { n:1, title:'Backup और लाइसेंस नोट करें', text:'C: के Users, Desktop, Documents, Downloads, और ब्राउज़र bookmarks की copy बाहरी डिस्क पर लें। BitLocker चालू हो तो recovery key पहले निकालें। Office/ऐप के लाइसेंस व product key लिख लें।' },
    { n:2, title:'USB से boot करके Custom चुनें', text:'Install now → “Custom: Install Windows only (advanced)”। Upgrade विकल्प केवल चलती विंडोज़ से चलाने पर आता है।' },
    { n:3, title:'सही डिस्क पर सारे partition मिटाएँ', text:'जिस डिस्क पर OS डालना है उसके हर partition को Delete करें जब तक केवल “Drive 0 Unallocated Space” बचे। <b>दूसरी डिस्क को न छूएँ</b> — आकार देखकर पक्का करें। संदेह हो तो Shift+F10 → diskpart → list disk से मिलाएँ।' },
    { n:4, title:'Unallocated चुनकर Next', text:'“New” दबाने की ज़रूरत नहीं — Setup खुद ESP, MSR, C: और Recovery बनाता है। फ़ाइलें copy होंगी, मशीन कई बार restart लेगी। <b>पहले restart पर USB निकाल दें</b> वरना सेटअप फिर शुरू हो जाएगा।' },
    { n:5, title:'OOBE (पहली बार का सेटअप)', text:'देश/keyboard → नेटवर्क → नाम/खाता → प्राइवेसी टॉगल। Pro में नेटवर्क छोड़ने पर local खाते का विकल्प मिलता है; Home में Microsoft खाता अनिवार्य है। प्राइवेसी के सारे टॉगल बंद करना उचित है।' },
    { n:6, title:'ड्राइवर — सही क्रम में', text:'पहले <b>चिपसेट</b>, फिर <b>स्टोरेज/RST</b>, फिर <b>GPU</b>, फिर <b>नेटवर्क/Wi-Fi</b>, फिर <b>ऑडियो</b>, फिर बाक़ी। लैपटॉप में निर्माता की support साइट से मॉडल-अनुसार ड्राइवर लें; “ड्राइवर अपडेटर” वाले तीसरे-पक्ष के सॉफ़्टवेयर से बचें।', tips:['Device Manager में कोई पीला ! न बचे — यही पूरा होने का प्रमाण है।'] },
    { n:7, title:'Activation जाँचें', text:'Settings → System → Activation। डिजिटल लाइसेंस उसी मशीन पर अपने आप लग जाता है (मदरबोर्ड से बँधा)। नया key: Change product key। त्रुटि 0xC004F074 = KMS नहीं मिला; 0xC004C003 = key ब्लॉक/प्रयोग में।' },
    { n:8, title:'Windows Update और अंतिम सेटअप', text:'Settings → Windows Update → Check → सारे update + Optional updates → Driver updates। फिर Restore point बनाएँ, ऐप डालें, backup अनुसूची लगाएँ और एक पूरी system image लें — यही “सुनहरी स्थिति” है जिसे बाद में लौटाया जा सके।' },
  ] },
  { type:'table', head:['काम','साफ़ इंस्टॉल','In-place Upgrade','Reset this PC'], rows:[
    ['पुरानी फ़ाइलें','मिट जाती हैं','रहती हैं','“Keep my files” में रहती हैं'],
    ['इंस्टॉल किए ऐप','मिट जाते हैं','रहते हैं','मिट जाते हैं'],
    ['समय','40–90 मिनट','60–120 मिनट','30–60 मिनट'],
    ['कब','बहुत बिगड़ा/नई डिस्क/मैलवेयर','संस्करण बदलना, ऐप बचाना','OS ठीक है पर गड़बड़ है'],
    ['जोखिम','डाटा जाने का (backup अनिवार्य)','कम, पर पुरानी गड़बड़ साथ आ सकती','कम'],
    ['Windows.old','नहीं','हाँ (~10 दिन)','“Remove everything” में नहीं'],
  ] },
  { type:'callout', kind:'info', title:'Windows.old और unattended इंस्टॉल', html:'<p><b>Windows.old</b> upgrade के बाद पुराने सिस्टम की copy है — इसमें पुराने Users फ़ोल्डर से भूली फ़ाइलें मिल सकती हैं। यह ~10 दिन बाद अपने आप मिट जाती है; जगह चाहिए तो Disk Cleanup → “Previous Windows installation(s)” से हटाएँ। <b>Unattended इंस्टॉल</b> में <code>autounattend.xml</code> USB की जड़ में रखते हैं — भाषा, partition, खाता, product key सब पहले से तय, और लैब की 30 मशीनों पर बिना हाथ लगाए इंस्टॉल हो जाता है (Windows System Image Manager से बनाएँ)।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.5</span> Windows Update — channels और अटकने पर हल</h3><p>विंडोज़ अब “servicing” मॉडल पर चलती है। हर महीने का <b>Patch Tuesday</b> (दूसरा मंगल) सुरक्षा-सुधार लाता है; साल में एक बार <b>feature update</b> (22H2, 23H2, 24H2…) नया संस्करण देता है। <b>Servicing Stack Update (SSU)</b> ख़ुद update इंजन को सुधारता है और अक्सर बाक़ी update के लिए पहले चाहिए होता है।</p>' },
  { type:'table', head:['प्रकार / channel','क्या','कब'], rows:[
    ['Quality / Cumulative Update','सुरक्षा + bug fix, पिछले सब शामिल','हर माह Patch Tuesday'],
    ['Servicing Stack Update (SSU)','update इंजन का सुधार','जरूरत पर; प्रायः cumulative के साथ'],
    ['Feature Update','नया संस्करण','साल में एक बार'],
    ['Out-of-band','आपात सुधार','गंभीर दोष पर तुरंत'],
    ['Optional / Preview (C/D release)','अगले माह का पूर्वावलोकन','केवल जाँच के लिए; लैब में न लगाएँ'],
    ['Driver update (Optional)','निर्माता के ड्राइवर','जब कोई उपकरण न चले'],
    ['Insider — Dev/Beta/Release Preview','परीक्षण संस्करण','प्रयोगशाला मशीन पर ही, मुख्य मशीन पर कभी नहीं'],
    ['LTSC','केवल सुरक्षा, 5–10 वर्ष','kiosk/उद्योग मशीन'],
  ] },
  { type:'code', code: ':: --- Windows Update पूरी तरह रीसेट (Admin CMD) ---\nnet stop wuauserv & net stop cryptSvc & net stop bits & net stop msiserver\nren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old\nren C:\\Windows\\System32\\catroot2 catroot2.old\nnet start wuauserv & net start cryptSvc & net start bits & net start msiserver\n:: फिर Settings -> Windows Update -> Check for updates\n\n:: --- भ्रष्ट सिस्टम फ़ाइलों की मरम्मत (सही क्रम) ---\nDISM /Online /Cleanup-Image /CheckHealth\nDISM /Online /Cleanup-Image /ScanHealth\nDISM /Online /Cleanup-Image /RestoreHealth\nsfc /scannow\n:: DISM पहले (भंडार ठीक करे), फिर SFC (फ़ाइलें ठीक करे) — उल्टा करने पर SFC असफल हो सकता है\n\n:: इंटरनेट न हो तो ISO से भंडार दें\nDISM /Online /Cleanup-Image /RestoreHealth /Source:wim:D:\\sources\\install.wim:1 /LimitAccess\n\n:: केवल एक फ़ाइल जाँचनी/लौटानी हो\nsfc /scanfile=C:\\Windows\\System32\\kernel32.dll\n\n:: अपडेट हटाना (जब कोई update समस्या लाए)\nwmic qfe list brief /format:table\nwusa /uninstall /kb:5034441\nDISM /Online /Get-Packages | more\n\n# PowerShell\nGet-HotFix | Sort InstalledOn -Descending | Select -First 10\nGet-WindowsUpdateLog          # ETL -> पढ़ने योग्य log' },
  { type:'table', head:['Update त्रुटि कोड','अर्थ','हल'], rows:[
    ['0x80070002 / 0x80070003','फ़ाइल ग़ायब/पथ ग़लत','SoftwareDistribution + catroot2 रीसेट'],
    ['0x800f081f','स्रोत फ़ाइलें नहीं मिलीं','DISM /RestoreHealth /Source:install.wim से'],
    ['0x8007000d / 0x80070057','अमान्य पैरामीटर/भ्रष्ट घटक','DISM फिर SFC; जगह खाली करें'],
    ['0x80240034','अधूरा डाउनलोड','दोबारा Check; नेटवर्क/प्रॉक्सी जाँचें'],
    ['0x8024402c','प्रॉक्सी/नेटवर्क सेटिंग','netsh winhttp reset proxy'],
    ['0x80070643','इंस्टॉलर/MSI विफल, अक्सर WinRE update','Recovery partition छोटा — अलग समाधान या update छोड़ें'],
    ['0x800f0922','System Reserved/ESP में जगह नहीं','ESP में जगह बनाएँ या तीसरा-पक्ष encryption हटाएँ'],
    ['0xc1900101 (feature update)','ड्राइवर असंगत','सब बाहरी उपकरण हटाएँ, third-party antivirus बंद, ड्राइवर update'],
    ['“Undoing changes” लूप','असफल feature update','WinRE → Uninstall latest feature update'],
  ] },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.6</span> WinRE — मरम्मत का माहौल</h3><p><b>Windows Recovery Environment</b> एक छोटी विंडोज़ है जो Recovery partition में <code>winre.wim</code> के रूप में रहती है। जब मुख्य OS न चले, यही बचाता है। इसमें पहुँचने के चार रास्ते हैं।</p>' },
  { type:'steps', items:[
    { n:1, title:'WinRE में पहुँचना', text:'रास्ता 1: Settings → System → Recovery → Advanced startup → Restart now। रास्ता 2: Shift दबाकर Restart। रास्ता 3: boot दो-तीन बार बीच में काटें — Windows खुद Automatic Repair में जाएगी। रास्ता 4: इंस्टॉल USB से boot → “Repair your computer”।' },
    { n:2, title:'Startup Repair आज़माएँ', text:'Troubleshoot → Advanced options → Startup Repair। यह boot फ़ाइलें व BCD अपने आप जाँचता है। सरल मामलों में यहीं हल हो जाता है; “couldn’t repair” कहे तो आगे बढ़ें।' },
    { n:3, title:'System Restore / Uninstall Updates', text:'Restore point बना हो तो System Restore सबसे सुरक्षित है — फ़ाइलें नहीं मिटतीं, केवल सिस्टम/ड्राइवर पीछे जाते हैं। किसी update के बाद बिगड़ा हो तो “Uninstall latest quality/feature update” चुनें।' },
    { n:4, title:'Command Prompt से boot मरम्मत', text:'Advanced options → Command Prompt। पहले diskpart → list volume से ESP और Windows वाले अक्षर पक्का करें (WinRE में अक्षर बदल जाते हैं — C: की जगह D: हो सकता है)। फिर नीचे के आदेश।' },
    { n:5, title:'Safe Mode में जाकर कारण पकड़ें', text:'Startup Settings → Restart → 4 (Safe Mode) या 5 (Networking)। Safe Mode में केवल ज़रूरी ड्राइवर चलते हैं — यहाँ ठीक चले तो समस्या third-party ड्राइवर/सेवा/स्टार्टऐप की है। वहीं से उसे हटाएँ या Roll Back करें।' },
    { n:6, title:'अंतिम उपाय — Reset / Image / साफ़ इंस्टॉल', text:'Troubleshoot → Reset this PC → Keep my files (ऐप मिटेंगे, निजी फ़ाइलें रहेंगी) → Local reinstall या Cloud download। इससे भी न बने तो बाहरी डिस्क से system image लौटाएँ, या साफ़ इंस्टॉल करें।' },
  ] },
  { type:'code', code: ':: === WinRE के Command Prompt से boot मरम्मत ===\ndiskpart\n  list volume        :: EFI (FAT32, ~100 MB) और Windows (NTFS, बड़ा) पहचानें\n  select volume 2    :: मान लें EFI = volume 2\n  assign letter=S\n  exit\n:: मान लें Windows का अक्षर WinRE में D: है\n\n:: 1) फ़ाइल-सिस्टम व सिस्टम फ़ाइलें (offline)\nchkdsk D: /f\nsfc /scannow /offbootdir=S:\\ /offwindir=D:\\Windows\nDISM /Image:D:\\ /Cleanup-Image /RestoreHealth\n\n:: 2) पुराना bootrec क्रम (Legacy/MBR पर अधिक उपयोगी)\nbootrec /fixmbr\nbootrec /fixboot          :: "Access is denied" आए तो नीचे bcdboot इस्तेमाल करें\nbootrec /scanos\nbootrec /rebuildbcd\n\n:: 3) UEFI/GPT पर सबसे भरोसेमंद — BCD नए सिरे से बनाना\nbcdboot D:\\Windows /s S: /f UEFI\n:: सफल होने पर "Boot files successfully created" आना चाहिए\n\n:: 4) BCD की जाँच / प्रविष्टि देखना\nbcdedit /store S:\\EFI\\Microsoft\\Boot\\BCD /enum\nbcdedit /enum {default}\n\n:: 5) WinRE खुद बंद हो तो\nreagentc /info\nreagentc /enable\n\n:: 6) लॉगिन पासवर्ड भूले हों तो (वैध मालिक ही)\n:: Advanced options -> System Restore, या Microsoft खाता ऑनलाइन रीसेट\n:: स्थानीय खाते के लिए password reset disk पहले बनी हो तो ही सीधा रास्ता' },
  { type:'table', head:['Boot संदेश / कोड','अर्थ','पहला हल'], rows:[
    ['INACCESSIBLE_BOOT_DEVICE (0x7B)','स्टोरेज ड्राइवर/मोड नहीं मिला','BIOS में SATA Mode पहले जैसा करें (AHCI/RAID); WinRE से ड्राइवर जोड़ें'],
    ['0xc000000e / 0xc0000225','BCD में प्रविष्टि नहीं/भ्रष्ट','bcdboot D:\\Windows /s S: /f UEFI'],
    ['0xc000000f','boot फ़ाइल पढ़ी नहीं गई','chkdsk + Startup Repair + bcdboot'],
    ['BOOTMGR is missing','Legacy MBR में boot फ़ाइल ग़ायब','bootrec /fixmbr /fixboot /rebuildbcd'],
    ['NTLDR is missing','बहुत पुराना XP-युग संदेश','ग़लत डिस्क से boot हो रहा — boot order जाँचें'],
    ['“No bootable device”','firmware को OS मिला ही नहीं','केबल/डिस्क पहचान, boot order, ESP मौजूद है?'],
    ['“Operating System not found”','MBR में active partition नहीं','diskpart → active (केवल MBR पर)'],
    ['Automatic Repair loop','हर बार मरम्मत असफल','Safe Mode → हाल का ड्राइवर/update हटाएँ; System Restore'],
    ['Black screen with cursor','explorer/ड्राइवर/graphics','Ctrl+Alt+Del → Task Manager → explorer.exe; GPU ड्राइवर हटाएँ'],
    ['“Your PC/Device needs to be repaired”','हस्ताक्षर/अखंडता विफल','Secure Boot/BCD जाँचें; bcdboot से दोबारा बनाएँ'],
  ] },
  { type:'callout', kind:'tip', title:'Safe Mode के आठ विकल्प', html:'<p>Startup Settings में — <b>1)</b> Debugging, <b>2)</b> Boot logging (ntbtlog.txt बनता है), <b>3)</b> Low-resolution video, <b>4)</b> Safe Mode, <b>5)</b> Safe Mode with Networking, <b>6)</b> Safe Mode with Command Prompt, <b>7)</b> Disable driver signature enforcement, <b>8)</b> Disable early launch anti-malware, <b>9)</b> Disable automatic restart after failure (BSOD का कोड पढ़ने के लिए यही चुनें)। निदान का सबसे उपयोगी जोड़ी है <b>4</b> और <b>9</b>।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.7</span> BSOD — नीली स्क्रीन को पढ़ना</h3><p><b>BSOD (Blue Screen of Death)</b> = kernel को ऐसी ख़राबी मिली जिससे डाटा बिगड़ने का ख़तरा था, इसलिए उसने मशीन जान-बूझकर रोक दी। यह दुश्मन नहीं, <b>सुरक्षा-वाल्व</b> है। स्क्रीन पर तीन चीज़ें पढ़ें — <b>Stop code</b> (जैसे MEMORY_MANAGEMENT), <b>क्या फ़ेल हुआ</b> (What failed: xyz.sys), और <b>QR/लिंक</b>। मशीन तुरंत restart हो जाए तो पहले “automatic restart on failure” बंद करें।</p>' },
  { type:'table', head:['Stop code','सबसे आम कारण','पहले ये करें'], rows:[
    ['MEMORY_MANAGEMENT','RAM दोषी/अस्थिर XMP','Windows Memory Diagnostic → फिर MemTest86 (4+ पास); XMP बंद करके जाँच'],
    ['PAGE_FAULT_IN_NONPAGED_AREA','RAM या ड्राइवर ने ग़लत पता माँगा','हाल का ड्राइवर/RAM जाँच; dump में .sys देखें'],
    ['IRQL_NOT_LESS_OR_EQUAL','ड्राइवर ने ग़लत interrupt स्तर पर स्मृति छुई','ड्राइवर update/rollback; नया hardware हटाएँ'],
    ['SYSTEM_SERVICE_EXCEPTION','ड्राइवर/सिस्टम फ़ाइल, कभी antivirus','What failed फ़ाइल देखें; SFC/DISM; तीसरा-पक्ष AV हटाएँ'],
    ['CRITICAL_PROCESS_DIED','जरूरी प्रक्रिया मरी (csrss/wininit)','SFC/DISM; मैलवेयर स्कैन; अंत में Reset'],
    ['KERNEL_DATA_INPAGE_ERROR','डिस्क से पन्ना पढ़ा नहीं गया','SMART + chkdsk; SATA केबल; डिस्क बदलने की तैयारी'],
    ['UNEXPECTED_KERNEL_MODE_TRAP','RAM/overclock/गर्मी/CPU','XMP/OC बंद, तापमान देखें, RAM जाँच'],
    ['DPC_WATCHDOG_VIOLATION','पुराना SSD firmware/SATA ड्राइवर','SSD firmware + चिपसेट/RST ड्राइवर update'],
    ['VIDEO_TDR_FAILURE / VIDEO_SCHEDULER_INTERNAL','GPU ड्राइवर या GPU','DDU से ड्राइवर पूरी तरह हटाकर नया डालें; तापमान/OC जाँच'],
    ['BAD_SYSTEM_CONFIG_INFO','BCD/registry ग़लत','bcdedit में numproc/truncatememory हटाएँ; System Restore'],
    ['NTFS_FILE_SYSTEM','NTFS भ्रष्ट','chkdsk /f /r; डिस्क SMART'],
    ['WHEA_UNCORRECTABLE_ERROR','hardware त्रुटि (CPU/RAM/PCIe/गर्मी)','BIOS update, OC बंद, तापमान/PSU जाँच'],
    ['INACCESSIBLE_BOOT_DEVICE','स्टोरेज मोड/ड्राइवर','BIOS SATA मोड लौटाएँ; recent update हटाएँ'],
    ['0x0000007E / 0x00000050','सामान्य system thread/page fault','dump पढ़ें, हाल के बदलाव उलटें'],
  ] },
  { type:'steps', items:[
    { n:1, title:'कोड और फ़ाइल का नाम लिखें', text:'स्क्रीन रुके तो फ़ोटो लें। “What failed:” में कोई .sys दिखे तो वही सबसे बड़ा सुराग है — उसे खोजकर पता करें वह किस उपकरण/सॉफ़्टवेयर का ड्राइवर है।' },
    { n:2, title:'हाल के बदलाव उलटें', text:'पिछले 48 घंटे में क्या बदला — नया RAM/GPU, नया ड्राइवर, Windows update, नया ऐप/antivirus? Safe Mode में जाकर वही हटाएँ या Roll Back करें। 70% BSOD यहीं हल होते हैं।' },
    { n:3, title:'Minidump पढ़ें', text:'C:\\Windows\\Minidump\\*.dmp को NirSoft BlueScreenView या WinDbg से खोलें। WinDbg में !analyze -v चलाएँ — MODULE_NAME और IMAGE_NAME असली दोषी फ़ाइल बताते हैं।' },
    { n:4, title:'RAM और डिस्क जाँचें', text:'mdsched.exe → Restart now and check। गहराई के लिए MemTest86 USB से कम-से-कम 4 पास। डिस्क के लिए CrystalDiskInfo + chkdsk /scan। कोई भी त्रुटि मिले तो वही पुर्ज़ा बदलें।' },
    { n:5, title:'ड्राइवर व सिस्टम फ़ाइलें', text:'सब चिपसेट/GPU/स्टोरेज ड्राइवर निर्माता से नए डालें। फिर DISM /RestoreHealth → sfc /scannow। GPU मामले में DDU से पुराना ड्राइवर पूरी तरह साफ़ करना सबसे असरदार है।' },
    { n:6, title:'गर्मी, बिजली और BIOS', text:'तापमान HWiNFO से देखें; धूल साफ़ करें; overclock/XMP बंद करके जाँचें; BIOS/UEFI update करें; कमज़ोर PSU भी अस्थिरता देता है। अंत में Driver Verifier (केवल अनुभवी) दोषी ड्राइवर पकड़ सकता है — पर वह जान-बूझकर BSOD कराता है, इसलिए पहले restore point लें।' },
  ] },
  { type:'code', code: ':: --- BSOD जाँच के आदेश (Admin) ---\n:: तुरंत restart बंद करें ताकि कोड पढ़ सकें\nwmic recoveros set AutoReboot = False\n:: या: sysdm.cpl -> Advanced -> Startup and Recovery -> Settings\n\n:: dump सेटिंग जाँचें (Small memory dump = Minidump)\nwmic recoveros get DebugInfoType, MiniDumpDirectory\n:: 3 = small (minidump), 1 = complete, 2 = kernel, 7 = automatic\n\n:: RAM जाँच\nmdsched.exe\n\n:: डिस्क\nwmic diskdrive get status,model\nchkdsk C: /scan\n\n:: हाल के ड्राइवर सूचीबद्ध (तारीख सहित)\ndriverquery /v /fo table | more\npnputil /enum-drivers\n\n:: कोई ड्राइवर हटाना (oem नंबर ऊपर से)\npnputil /delete-driver oem42.inf /uninstall /force\n\n:: सिस्टम फ़ाइलें\nDISM /Online /Cleanup-Image /RestoreHealth\nsfc /scannow\n\n:: विश्वसनीयता इतिहास — कब क्या बिगड़ा (GUI)\nperfmon /rel\n\n:: Driver Verifier (सावधानी: पहले restore point बनाएँ)\nverifier /standard /all\n:: बंद करना: verifier /reset   (Safe Mode से भी चलता है)' },
  { type:'callout', kind:'danger', title:'मरम्मत में ये पाँच ग़लतियाँ न करें', html:'<p>1) <b>बिना backup मरम्मत शुरू करना</b> — मरती डिस्क पर chkdsk /r अंतिम धक्का हो सकता है; पहले image लें। 2) <b>Registry cleaner चलाना</b> — ये लाभ नहीं देते, सिस्टम तोड़ते हैं। 3) <b>Driver Verifier बिना तैयारी</b> — मशीन boot लूप में जा सकती है; Safe Mode का रास्ता पहले जान लें। 4) <b>BIOS update बिजली की अस्थिरता में</b> — बीच में गए तो मदरबोर्ड बेकार। 5) <b>“pre-activated” ISO</b> — मैलवेयर का सबसे आम रास्ता; हमेशा Microsoft से लें।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">5.8</span> Activation, लाइसेंस और रिकवरी की तैयारी</h3><p>विंडोज़ का लाइसेंस तीन रूपों में मिलता है और तीनों का व्यवहार अलग है। सर्विस सेंटर में ग्राहक से पूछना ज़रूरी है कि उसका लाइसेंस किस प्रकार का था, वरना मदरबोर्ड बदलने पर activation उड़ जाती है।</p>' },
  { type:'table', head:['लाइसेंस प्रकार','किससे बँधा','मदरबोर्ड बदलने पर','स्थानांतरण'], rows:[
    ['OEM (पूर्व-इंस्टॉल्ड)','उस मशीन के मदरबोर्ड/BIOS में key','जाएगा — नया लाइसेंस चाहिए','नहीं'],
    ['Retail (ख़रीदा हुआ key)','आपके Microsoft खाते से जोड़ सकते हैं','खाते से दोबारा सक्रिय','हाँ, एक मशीन छोड़कर दूसरी पर'],
    ['Digital License','हार्डवेयर-हैश + (यदि जोड़ा हो) MSA','उसी मशीन पर स्वतः; बदलने पर Activation troubleshooter','MSA जोड़ा हो तो आसान'],
    ['Volume — MAK','संस्था का key, गिनती सीमित','गिनती में से एक','संस्था की नीति अनुसार'],
    ['Volume — KMS','संस्था के अंदरूनी सर्वर से हर 180 दिन','सर्वर से दोबारा','केवल संस्था के नेटवर्क में'],
    ['Subscription (M365/Windows E3)','उपयोगकर्ता के खाते से','खाता साइन-इन करते ही','हाँ'],
  ] },
  { type:'code', code: ':: --- Activation जाँच व प्रबंधन (Admin) ---\nslmgr /dlv          :: विस्तृत लाइसेंस जानकारी (प्रकार, स्थिति, अंतिम 5 अक्षर)\nslmgr /dli          :: संक्षिप्त\nslmgr /xpr          :: स्थायी है या समाप्ति तिथि\nslmgr /ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX     :: नया key डालना\nslmgr /ato          :: ऑनलाइन सक्रिय करने का प्रयास\nslui 4              :: फ़ोन से सक्रिय करने का विकल्प\n\n:: BIOS में छिपा OEM key पढ़ना (PowerShell)\n(Get-CimInstance -ClassName SoftwareLicensingService).OA3xOriginalProductKey\n\n:: रिकवरी की तैयारी — ये तीन चीज़ें हर मशीन पर बनाएँ\n:: 1) Recovery Drive (USB 16 GB): "Create a recovery drive" + system files tick\nreagentc /info      :: WinRE चालू है?\n:: 2) BitLocker recovery key (यदि encryption चालू)\nmanage-bde -protectors -get C:\n:: 3) पूरी system image बाहरी डिस्क पर\nwbadmin start backup -backupTarget:E: -include:C: -allCritical -quiet' },
  { type:'callout', kind:'exam', title:'परीक्षा/इंटरव्यू में यहाँ से प्रश्न', html:'<p>Windows 11 की न्यूनतम RAM/स्टोरेज/TPM, UEFI+GPT बनाम Legacy+MBR, MBR की 2 TB सीमा, ESP का फ़ाइल-सिस्टम (FAT32) और काम, diskpart clean का असर, DISM और SFC का सही क्रम, WinRE में पहुँचने के तरीक़े, Safe Mode का उपयोग, bootrec बनाम bcdboot, OEM बनाम Retail लाइसेंस, और 4–5 प्रमुख BSOD stop codes के कारण — ये सबसे बार-बार पूछे जाते हैं।</p>' },

  { type:'labs', items:[
    { n:56, title:'मशीन की Windows-योग्यता जाँचकर रिपोर्ट बनाना', aim:'किसी भी PC पर Windows 11 चलेगी या नहीं, प्रमाण सहित तय करना।', tools:['लैब PC', 'msinfo32, tpm.msc, dxdiag', 'PC Health Check (वैकल्पिक)'], steps:['msinfo32 खोलकर Processor, RAM, BIOS Mode, Secure Boot State लिखें।', 'tpm.msc में Status और Specification Version लिखें।', 'diskpart → list disk से GPT/MBR स्थिति नोट करें।', 'dxdiag से DirectX संस्करण व WDDM संस्करण लिखें।', 'प्रत्येक ज़रूरत के सामने “हाँ/नहीं” और प्रमाण का screenshot लगाएँ।', 'निष्कर्ष — Windows 11 योग्य है? न हो तो कौन-सी एक चीज़ रोक रही है और BIOS में उसका विकल्प क्या है।'], result:'आठ-ज़रूरतों की भरी जाँच-तालिका और स्पष्ट योग्य/अयोग्य निष्कर्ष।' },
    { n:57, title:'Bootable USB बनाकर आभासी मशीन में साफ़ इंस्टॉल', aim:'पूरा इंस्टॉल चक्र अभ्यास-मशीन पर सुरक्षित रूप से करना।', tools:['Rufus/Ventoy', 'Windows ISO', '8 GB+ USB', 'VirtualBox/VMware'], steps:['ISO की भाषा/edition/architecture नोट करें; Rufus में GPT + UEFI चुनकर USB बनाएँ।', 'VM बनाएँ — 4 GB RAM, 60 GB डिस्क, firmware = EFI, TPM जोड़ें यदि उपलब्ध।', 'USB (या सीधे ISO) से boot करें; Custom चुनें।', 'सारे partition मिटाकर Unallocated चुनें और Next दबाएँ; बनाए गए ESP/MSR/Recovery का आकार Shift+F10 → diskpart → list partition से लिखें।', 'OOBE पूरा करें; पहले restart पर boot माध्यम हटाना न भूलें।', 'Device Manager में पीले चिह्न जाँचें; Activation व Windows Update की स्थिति लिखें।'], result:'चलती नई विंडोज़, बने partitions की सूची और पूरे चरण की रिपोर्ट।' },
    { n:58, title:'SFC/DISM चलाकर भ्रष्ट घटक की मरम्मत', aim:'सही क्रम में भंडार और फ़ाइलें ठीक करना तथा log पढ़ना।', tools:['Admin CMD/PowerShell', 'इंटरनेट या Windows ISO'], steps:['DISM /Online /Cleanup-Image /CheckHealth → /ScanHealth चलाएँ और परिणाम लिखें।', '/RestoreHealth चलाएँ; लगे समय व अंतिम प्रतिशत नोट करें।', 'अब sfc /scannow चलाएँ; “found corrupt files and successfully repaired” जैसा संदेश लिखें।', 'C:\\Windows\\Logs\\CBS\\CBS.log में “Cannot repair” खोजें (findstr) और गिनती लिखें।', 'इंटरनेट बंद करके /Source:wim:D:\\sources\\install.wim:1 /LimitAccess वाला रूप आज़माएँ।', 'जान-बूझकर एक ग़ैर-ज़रूरी सिस्टम फ़ाइल की प्रतिलिपि हटाकर दोबारा sfc चलाएँ और बहाली देखें (केवल अभ्यास VM पर)।'], result:'चारों आदेशों के परिणाम, CBS.log की खोज और एक सफल बहाली का प्रमाण।' },
    { n:59, title:'WinRE में जाकर BCD देखना और bcdboot से बनाना', aim:'boot फ़ाइलों की बनावट समझना और उन्हें दोबारा बनाना।', tools:['अभ्यास VM', 'इंस्टॉल USB/ISO', 'WinRE Command Prompt'], steps:['VM को Shift+Restart या इंस्टॉल USB → Repair your computer से WinRE में ले जाएँ।', 'Command Prompt → diskpart → list volume; EFI (FAT32) व Windows (NTFS) के अक्षर लिखें; EFI को S: दें।', 'bcdedit /store S:\\EFI\\Microsoft\\Boot\\BCD /enum चलाकर प्रविष्टियाँ नोट करें।', 'S:\\EFI\\Microsoft\\Boot\\BCD का नाम बदलकर BCD.old करें और VM restart करें — boot विफल होगा (लक्षण लिखें)।', 'फिर WinRE में जाकर bcdboot D:\\Windows /s S: /f UEFI चलाएँ।', 'VM सामान्य boot हो तो सफलता का screenshot लें; पूरा क्रम रिपोर्ट में लिखें।'], result:'BCD की प्रविष्टियों की नक़ल, दिखाई गई विफलता और bcdboot से सफल बहाली।' },
    { n:78, title:'Windows Update रीसेट करके अटका अपडेट चलाना', aim:'SoftwareDistribution/catroot2 रीसेट का असर देखना।', tools:['Admin CMD', 'अभ्यास VM', 'Windows Update सेटिंग'], steps:['Settings → Windows Update → Update history से पिछले 5 update व उनकी स्थिति लिखें।', 'Get-HotFix से तारीखवार सूची निकालें।', 'चारों सेवाएँ रोकें (wuauserv, cryptSvc, bits, msiserver)।', 'SoftwareDistribution और catroot2 का नाम बदलें; folder का आकार पहले/बाद में नोट करें।', 'सेवाएँ चालू करके Check for updates चलाएँ; नया folder बनता देखें।', 'परिणाम लिखें — कौन-सा update चला, कितना समय लगा, कोई त्रुटि कोड आया तो उसका अर्थ।'], result:'रीसेट के पहले/बाद की तुलना और सफल/असफल update का प्रमाण।' },
    { n:79, title:'BSOD का minidump पढ़कर दोषी की पहचान', aim:'dump फ़ाइल से असली कारण तक पहुँचने का कौशल।', tools:['BlueScreenView या WinDbg', 'C:\\Windows\\Minidump (या शिक्षक का नमूना dump)'], steps:['Minidump folder खोलें; .dmp फ़ाइलों की तारीखें लिखें।', 'BlueScreenView में हर dump का Bug Check String, Code और “Caused By Driver” नोट करें।', 'WinDbg हो तो !analyze -v चलाकर MODULE_NAME, IMAGE_NAME और STACK_TEXT लिखें।', 'उस .sys फ़ाइल का Properties → Details देखकर निर्माता/उपकरण पहचानें।', 'उसी आधार पर तीन सम्भावित कारण और उनका क्रमबद्ध हल लिखें।', 'perfmon /rel खोलकर उसी तारीख़ की घटनाएँ मिलाएँ और निष्कर्ष पक्का करें।'], result:'एक dump का पूरा विश्लेषण — कोड, दोषी फ़ाइल, निर्माता और तर्कसहित हल।' },
    { n:80, title:'Recovery Drive, Restore Point और System Image बनाना', aim:'बिगड़ने से पहले बचाव की तीन परतें तैयार करना।', tools:['16 GB USB', 'बाहरी डिस्क', 'Admin अधिकार'], steps:['“Create a recovery drive” चलाएँ; “Back up system files” tick करें; USB तैयार होने का समय लिखें।', 'reagentc /info से WinRE की स्थिति व स्थान लिखें।', 'System Properties → System Protection → C: ON → Max Usage 5–10% → Create → नाम “clean baseline”।', 'wbadmin start backup -backupTarget:E: -include:C: -allCritical -quiet से पूरी image लें।', 'BitLocker चालू हो तो manage-bde -protectors -get C: से recovery key सुरक्षित जगह लिखें।', 'तीनों की तारीख़, आकार और स्थान की एक तालिका बनाकर मशीन के साथ चिपकाएँ।'], result:'तैयार recovery USB, एक restore point, एक सत्यापित system image और लिखित स्थान-तालिका।' },
  ] },

  { type:'acc', title:'इंस्टॉल व मरम्मत — 14 आम प्रश्न', items:[
    { q:'Windows 11 इंस्टॉल करते समय “This PC can’t run Windows 11” आता है, जबकि मशीन नई है।', a:'प्रायः TPM बंद है। BIOS में Intel पर PTT और AMD पर fTPM चालू करें, Secure Boot Enabled और CSM Disabled करें। tpm.msc में “ready for use” और Specification Version 2.0 दिखना चाहिए। CPU सूची से बाहर हो तो Windows 10 ही उचित विकल्प है।' },
    { q:'“Windows cannot be installed to this disk — MBR partition table” का हल?', a:'आप UEFI मोड में boot कर रहे हैं और डिस्क MBR है। Setup में उस डिस्क के सारे partition Delete करके Unallocated चुनें — Setup खुद GPT बनाएगा (डाटा मिटेगा, पहले backup)। डाटा बचाना हो तो चलती विंडोज़ से MBR2GPT /validate फिर /convert चलाएँ और BIOS में UEFI करें।' },
    { q:'इंस्टॉलर में डिस्क दिखती ही नहीं (“We couldn’t find any drives”)।', a:'नए Intel सिस्टम में VMD/RST नियंत्रक का ड्राइवर चाहिए। निर्माता की साइट से “Intel RST/VMD F6 driver” लेकर USB पर खोलें और “Load driver” से डालें। या BIOS में VMD को Disabled करके SATA Mode = AHCI करें — तब डिस्क सीधे दिखने लगती है।' },
    { q:'DISM और SFC — पहले कौन चलाएँ?', a:'पहले DISM /Online /Cleanup-Image /RestoreHealth, फिर sfc /scannow। SFC अपनी मरम्मत का माल component store से लेता है; वह भंडार ही भ्रष्ट हो तो SFC असफल होगा। DISM भंडार ठीक करता है, इसलिए वह पहले आता है।' },
    { q:'bootrec /fixboot पर “Access is denied” आता है।', a:'यह UEFI/GPT सिस्टम पर आम है क्योंकि /fixboot पुराने MBR-शैली के लिए है। सही रास्ता है — diskpart से EFI partition को S: देना, फिर bcdboot D:\\Windows /s S: /f UEFI। यह पूरा BCD नए सिरे से लिख देता है।' },
    { q:'Safe Mode में मशीन ठीक चलती है, सामान्य मोड में BSOD — क्या अर्थ?', a:'समस्या किसी तीसरे-पक्ष के ड्राइवर, सेवा या स्टार्टअप ऐप में है, मूल विंडोज़ में नहीं। Safe Mode में हाल का ड्राइवर Roll Back/हटाएँ, msconfig से ग़ैर-Microsoft सेवाएँ बंद करके clean boot करें, और dump में दिखी .sys फ़ाइल पकड़ें।' },
    { q:'Reset this PC और साफ़ इंस्टॉल में क्या चुनें?', a:'OS चल रहा है पर अस्थिर है → Reset (Keep my files) सबसे तेज़ और सरल। मैलवेयर की आशंका, नई डिस्क, या Reset भी असफल → साफ़ इंस्टॉल। Reset में ऐप मिट जाते हैं यह पहले बता दें; साफ़ इंस्टॉल में निजी फ़ाइलें भी, इसलिए backup अनिवार्य।' },
    { q:'मदरबोर्ड बदलने के बाद विंडोज़ activate नहीं हो रही।', a:'OEM लाइसेंस मदरबोर्ड से बँधा होता है — वह नहीं लौटेगा। Retail key हो तो Settings → Activation → Troubleshoot → “I changed hardware on this device recently” से Microsoft खाते द्वारा स्थानांतरित करें। नया OEM लाइसेंस ख़रीदना पड़ सकता है; activation जाँच slmgr /dlv से करें।' },
    { q:'BSOD आते ही मशीन restart हो जाती है, कोड पढ़ नहीं पाता।', a:'sysdm.cpl → Advanced → Startup and Recovery → Settings → “Automatically restart” का tick हटाएँ। या Startup Settings से विकल्प 9 (Disable automatic restart after failure) चुनें। कोड लिखने के बाद C:\\Windows\\Minidump से dump भी पढ़ें।' },
    { q:'Feature update हर बार “Undoing changes” पर लौट आता है।', a:'प्रायः कोई ड्राइवर या तीसरा-पक्ष antivirus रोक रहा है। सब बाहरी उपकरण हटाएँ, antivirus अस्थायी हटाएँ, चिपसेट/स्टोरेज/ग्राफ़िक्स ड्राइवर नए करें, 20 GB+ जगह खाली करें। फिर ISO को mount करके setup.exe से in-place upgrade चलाएँ — यह Update से ज़्यादा भरोसेमंद है।' },
    { q:'इंस्टॉल के बाद Wi-Fi/ऑडियो नहीं चल रहा।', a:'ड्राइवर नहीं लगे। जिस मशीन पर इंटरनेट है वहाँ निर्माता की support साइट से मॉडल-अनुसार chipset, network/Wi-Fi और audio ड्राइवर डाउनलोड करके USB से लाएँ। “Driver booster” जैसे तीसरे-पक्ष के औज़ार न चलाएँ — वे ग़लत ड्राइवर डालकर नई समस्या बनाते हैं।' },
    { q:'Windows.old क्या है और कब हटाएँ?', a:'Upgrade/in-place के बाद पुरानी विंडोज़ की copy — इसमें पुराने Users फ़ोल्डर से भूली फ़ाइलें मिल सकती हैं। ~10 दिन बाद अपने आप मिट जाती है। सब कुछ जाँच लेने के बाद Disk Cleanup → “Previous Windows installation(s)” से हटाएँ; उसके बाद पुराने संस्करण पर लौटना सम्भव नहीं।' },
    { q:'लैब की 30 मशीनों पर एक-एक करके इंस्टॉल करना है — तेज़ तरीक़ा?', a:'एक मशीन पर साफ़ इंस्टॉल + ड्राइवर + ज़रूरी ऐप करके उसकी image बनाएँ (sysprep /generalize /oobe /shutdown के बाद capture), और उसे PXE/WDS या Clonezilla/Ventoy से बाक़ी पर डालें। या autounattend.xml USB की जड़ में रखकर बिना-हाथ इंस्टॉल कराएँ। इससे घंटों का काम मिनटों में होता है।' },
    { q:'BitLocker चालू मशीन की मरम्मत करनी है — क्या ध्यान रखें?', a:'सबसे पहले 48-अंकीय recovery key निकालकर सुरक्षित रखें (Microsoft खाता, manage-bde -protectors -get C:, या प्रिंट)। BIOS/TPM बदलने या boot मरम्मत पर WinRE recovery key माँगेगा। उसके बिना डाटा पूरी तरह अप्राप्य हो जाता है — कोई “bypass” नहीं है।' },
  ] },

  { type:'quiz', store:'win-install', items:[
    { q:'Windows 11 की न्यूनतम RAM और स्टोरेज क्या है?', o:['2 GB / 32 GB','4 GB / 64 GB','8 GB / 128 GB','1 GB / 16 GB'], a:1, ex:'आधिकारिक न्यूनतम 4 GB RAM और 64 GB स्टोरेज; व्यावहारिक रूप से 8 GB + SSD चाहिए।' },
    { q:'Windows 11 के लिए कौन-सा TPM संस्करण अनिवार्य है?', o:['TPM 1.2','TPM 2.0','TPM आवश्यक नहीं','TPM 3.0'], a:1, ex:'TPM 2.0 + UEFI + Secure Boot. Intel पर इसे PTT और AMD पर fTPM कहते हैं — BIOS में चालू करना पड़ता है।' },
    { q:'सही आधुनिक जोड़ी कौन-सी है?', o:['Legacy BIOS + GPT','UEFI + MBR','UEFI + GPT','Legacy + ESP'], a:2, ex:'UEFI firmware के साथ GPT partition तालिका; पुराना जोड़ा Legacy BIOS + MBR है। Secure Boot केवल UEFI में मिलता है।' },
    { q:'MBR की अधिकतम डिस्क आकार सीमा?', o:['512 GB','1 TB','2 TB','कोई सीमा नहीं'], a:2, ex:'MBR में 32-bit LBA × 512 byte ≈ 2 TB. इससे बड़ी डिस्क के लिए GPT चाहिए।' },
    { q:'EFI System Partition (ESP) का फ़ाइल-सिस्टम क्या होता है?', o:['NTFS','FAT32','exFAT','ReFS'], a:1, ex:'ESP हमेशा FAT32 होती है क्योंकि UEFI firmware उसे पढ़ सकता है; इसमें .efi bootloader रहते हैं।' },
    { q:'diskpart में clean कमांड क्या करता है?', o:['फ़ाइलें साफ़ करता है','पूरी partition तालिका मिटा देता है','डिस्क defrag करता है','केवल C: format'], a:1, ex:'clean पूरी partition/volume जानकारी हटा देता है — डिस्क Unallocated हो जाती है। ग़लत डिस्क चुनना = पूरा डाटा गया।' },
    { q:'इंस्टॉलर के बीच में Command Prompt खोलने की key?', o:['Ctrl+Alt+Del','Shift+F10','F8','Alt+F4'], a:1, ex:'Windows Setup के किसी भी चरण पर Shift+F10 से CMD खुलता है — diskpart, notepad, bcdboot सब यहीं से।' },
    { q:'साफ़ इंस्टॉल में partition बनाने का सही तरीक़ा?', o:['हर partition हाथ से New करके बनाना','सब Delete करके Unallocated चुनना — Setup खुद ESP/MSR/C:/Recovery बनाता है','केवल C: बनाना','Recovery बनाना अनिवार्य'], a:1, ex:'Setup को Unallocated जगह देने पर वह मानक layout स्वयं बनाता है; हाथ से बनाने पर ESP छूट सकती है।' },
    { q:'पहले restart पर इंस्टॉल फिर से शुरू हो जाता है — कारण?', o:['ISO ख़राब','USB अभी लगी है और boot order में पहले है','RAM कम','TPM बंद'], a:1, ex:'पहले restart पर bootable USB निकाल दें, वरना firmware फिर उसी सेटअप से boot कर देता है।' },
    { q:'DISM और SFC का सही क्रम?', o:['sfc पहले, DISM बाद में','DISM /RestoreHealth पहले, फिर sfc /scannow','कोई भी क्रम','दोनों एक साथ'], a:1, ex:'SFC मरम्मत का माल component store से लेता है। भंडार भ्रष्ट हो तो पहले DISM से उसे ठीक करना ज़रूरी है।' },
    { q:'WinRE में पहुँचने का तरीक़ा नहीं है?', o:['Shift दबाकर Restart','Settings → Recovery → Advanced startup','इंस्टॉल USB → Repair your computer','Ctrl+Alt+F2'], a:3, ex:'Ctrl+Alt+F2 लिनक्स का TTY शॉर्टकट है, विंडोज़ का नहीं। boot कई बार काटने पर भी Automatic Repair आता है।' },
    { q:'Safe Mode में ठीक चलने पर समस्या कहाँ मानी जाती है?', o:['हार्डवेयर में','तीसरे-पक्ष के ड्राइवर/सेवा/स्टार्टअप ऐप में','BIOS में','RAM में'], a:1, ex:'Safe Mode केवल ज़रूरी Microsoft ड्राइवर चलाता है। वहाँ ठीक है तो बाक़ी किसी तीसरे घटक की गड़बड़ है।' },
    { q:'UEFI/GPT पर BCD दोबारा बनाने का सबसे भरोसेमंद आदेश?', o:['bootrec /fixmbr','bcdboot D:\\Windows /s S: /f UEFI','chkdsk /f','sfc /scannow'], a:1, ex:'bcdboot दी गई Windows से boot फ़ाइलें निकालकर बताए EFI partition (S:) में नया BCD लिख देता है। bootrec /fixboot पर अक्सर Access denied आता है।' },
    { q:'0xc0000225 त्रुटि किस चीज़ की ओर इशारा करती है?', o:['RAM ख़राब','BCD प्रविष्टि ग़ायब/भ्रष्ट','GPU ड्राइवर','टोनर'], a:1, ex:'यह boot configuration data की समस्या है — Startup Repair या bcdboot से हल होती है।' },
    { q:'INACCESSIBLE_BOOT_DEVICE (0x7B) का सबसे आम कारण?', o:['RAM','BIOS में SATA मोड बदल जाना (AHCI/RAID) या स्टोरेज ड्राइवर','नेटवर्क','माउस'], a:1, ex:'OS जिस मोड में इंस्टॉल हुआ उससे अलग मोड पर boot करते ही स्टोरेज ड्राइवर नहीं मिलता। BIOS में पुराना मोड लौटाएँ।' },
    { q:'MEMORY_MANAGEMENT stop code पर पहला कदम?', o:['विंडोज़ फिर डालना','RAM जाँच (mdsched/MemTest86), XMP बंद करके देखना','GPU बदलना','टोनर बदलना'], a:1, ex:'यह प्रायः RAM या अस्थिर मेमोरी प्रोफ़ाइल का संकेत है। MemTest86 के 4+ पास और XMP बंद करके जाँच सबसे उपयोगी है।' },
    { q:'KERNEL_DATA_INPAGE_ERROR किस ओर इशारा करता है?', o:['डिस्क से पन्ना पढ़ने में विफल','GPU','नेटवर्क','कीबोर्ड'], a:0, ex:'पेजिंग डिस्क से डाटा नहीं आया — SMART, chkdsk, SATA केबल जाँचें; अक्सर मरती डिस्क का पहला संकेत।' },
    { q:'DPC_WATCHDOG_VIOLATION का आम हल?', o:['RAM बदलना','SSD firmware और चिपसेट/स्टोरेज ड्राइवर update','मॉनिटर बदलना','भाषा बदलना'], a:1, ex:'पुराना SSD firmware या SATA/AHCI ड्राइवर इसका सबसे आम कारण है; दोनों update करने से ठीक होता है।' },
    { q:'BSOD का कोड पढ़ने के लिए कौन-सी सेटिंग बदलें?', o:['Automatically restart बंद करें','Screen saver बंद','Sleep बंद','Fast startup चालू'], a:0, ex:'Startup and Recovery में “Automatically restart” हटाएँ, या Startup Settings का विकल्प 9 चुनें — तब स्क्रीन रुकेगी।' },
    { q:'Minidump फ़ाइलें कहाँ मिलती हैं?', o:['C:\\Windows\\Temp','C:\\Windows\\Minidump','C:\\Users\\Public','C:\\ProgramData'], a:1, ex:'Small memory dump पर .dmp फ़ाइलें C:\\Windows\\Minidump में बनती हैं; BlueScreenView/WinDbg से पढ़ी जाती हैं।' },
    { q:'Windows Update अटक जाए तो कौन-से folder रीसेट किए जाते हैं?', o:['System32 और Drivers','SoftwareDistribution और catroot2','Program Files','Users'], a:1, ex:'सेवाएँ रोककर इन दोनों का नाम बदलने से update का cache नया बनता है — सबसे आम और सुरक्षित हल।' },
    { q:'OEM लाइसेंस किससे बँधा होता है?', o:['Microsoft खाते से','मशीन के मदरबोर्ड से','हार्ड डिस्क से','माउस से'], a:1, ex:'OEM key BIOS/UEFI में रहता है और उसी मदरबोर्ड से बँधा है — मदरबोर्ड बदलने पर नहीं लौटता। Retail स्थानांतरणीय है।' },
    { q:'BitLocker चालू मशीन की मरम्मत से पहले क्या अनिवार्य है?', o:['डिस्क defrag','48-अंकीय recovery key सुरक्षित रखना','टोनर जाँच','भाषा बदलना'], a:1, ex:'TPM/boot बदलने पर WinRE recovery key माँगेगा। उसके बिना डाटा अप्राप्य है — कोई bypass नहीं।' },
    { q:'Windows.old किस स्थिति में बनती है?', o:['साफ़ इंस्टॉल पर','In-place upgrade/संस्करण बदलने पर','हर update पर','Reset — Remove everything पर'], a:1, ex:'Upgrade के समय पुराना सिस्टम Windows.old में रखा जाता है (~10 दिन), ताकि भूली फ़ाइलें निकाली जा सकें और लौटा जा सके।' },
    { q:'लैब की कई मशीनों पर बिना-हाथ इंस्टॉल का तरीक़ा?', o:['हर मशीन पर अलग USB','autounattend.xml या image + PXE/WDS','RDP से','Bluetooth से'], a:1, ex:'autounattend.xml सेटअप के सारे उत्तर पहले से दे देता है; sysprep image + PXE से दर्जनों मशीन एक साथ तैयार होती हैं।' },
  ] },
  { type:'pills', items:[
    { text:'Win11: 4 GB · 64 GB · TPM 2.0', kind:'info' },
    { text:'UEFI + GPT (आधुनिक)', kind:'ok' },
    { text:'ESP = FAT32', kind:'info' },
    { text:'Shift+F10 = Setup CMD', kind:'tip' },
    { text:'DISM पहले, SFC बाद में', kind:'exam' },
    { text:'bcdboot … /f UEFI', kind:'tip' },
    { text:'BSOD = सुरक्षा-वाल्व', kind:'info' },
    { text:'पहले backup, फिर मरम्मत', kind:'danger' },
  ] },
  ]
},
]);
