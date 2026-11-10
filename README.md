# Future Instructor – CHNM पोर्टल + सुरक्षित CBT परीक्षा प्रणाली

यह रिपॉज़िटरी मूल CHNM वेबसाइट का होम पेज कंटेंट/फोटो/डिज़ाइन और सभी लैब सुरक्षित रखती है (उपयोगकर्ता अनुरोध पर साइडबार से पुराना कंप्यूटर लैब समूह, अलग Training Methodology फोल्डर और CHNM Academy फोल्डर हटाए गए हैं), और उसके साथ Netlify Functions + Netlify Blobs पर चलने वाली **पूरी CBT परीक्षा प्रणाली**, **Training Methodology डिजिटल पुस्तक** तथा **25-अध्याय Trade Theory डिजिटल पुस्तक** देती है।

> स्थिति: **Netlify पर लाइव** — https://chnm26.netlify.app/ (project `chnm26`, team `sant-kumar-kushwaha`)। Functions + Blobs चालू हैं; `ADMIN_PASSWORD` और `ADMIN_SECRET` production environment variables में सेट हैं। ताज़ा परिणाम: `docs/testing-report-hi.md`।

## लाइव लिंक

| पेज | URL |
|---|---|
| होम पेज | https://chnm26.netlify.app/ |
| छात्र पोर्टल | https://chnm26.netlify.app/exam/index.html |
| एडमिन | https://chnm26.netlify.app/exam/admin.html |
| अध्ययन केंद्र | https://chnm26.netlify.app/study/index.html |
| Trade Theory पुस्तक | https://chnm26.netlify.app/study/trade/index.html |

## मुख्य फीचर्स

- **अध्ययन केंद्र (डिजिटल पुस्तक):** Training Methodology NSQF स्तर 5 के 16 अध्याय सरल हिंदी में — **108/108 खंड पर शिक्षण आरेख** (flow/cycle/pyramid/ladder/compare/map), 49 इंटरैक्टिव सिमुलेटर जिनमें **19 SMPS-शैली LIVE लैब** (स्लाइडर → लाइव canvas → रीडआउट → स्थिति संदेश) और 64 अभ्यास प्रश्न; progress इसी ब्राउज़र में सुरक्षित
- **Trade Theory पुस्तक:** `study/trade/` में 25 अध्याय (T1–T25) — हार्डवेयर, स्टोरेज, प्रिंटर, UPS, नेटवर्किंग, Windows Server, Active Directory, IIS, Linux और नेटवर्क सुरक्षा; रूल्ड कॉपी जैसी पठन सतह, हिंदी + English गहन नोट्स, 3D मॉडल, बेंच ड्रिल और 152 परीक्षा-शैली प्रश्न। **हर एक खंड (143/143) पर आरेख** और **हर एक अध्याय (25/25) में कम-से-कम एक LIVE लैब** — कुल 79 सिमुलेटर; अलग progress key (`fiTradeProgressV1`)
- **होम पेज हेडर:** "सम्पूर्ण CHNM Trade Guide" के बगल में **📝 ऑनलाइन टेस्ट** लिंक (मोबाइल पर केवल आइकन); नीचे का पुराना तैरता परीक्षा बटन हटा दिया गया है
- **TM navigation:** साइडबार का Training Methodology group और CHNM home card अब सीधे नई 16-अध्याय डिजिटल बुक (`study/`) के chapters खोलते हैं; पुराने 14-unit inline TM links हटा दिए गए हैं (पुराना DOM content सुरक्षित है)
- **छात्र पोर्टल:** फोटो सहित registration जिसमें ID हमेशा **CHNM** से शुरू होता है (जैसे `CHNM12`), बैच डिफ़ॉल्ट **2026-27**, login (ID + मोबाइल + वैकल्पिक PIN), हिंदी/English टॉगल वाला dashboard, उपलब्ध/आगामी/पूरी परीक्षाएँ, तैयार हो रही (draft) परीक्षाएँ, अपने परिणाम और release के बाद विषय-वार अध्ययन सुझाव
- **CBT स्क्रीन:** NIMI-शैली header, नीली timer/status bar, candidate panel, question palette, Save & Next, Previous, Mark for Review, Clear Response, answered/not-answered/not-visited/marked, autosave, offline handling, final submit confirmation, auto-submit; desktop, tablet और mobile पर responsive
- **विषय-वार परीक्षाएँ:** Trade Theory, TM, Trade Practical, Soft Skills, SMPS, Computer Hardware, Networking आदि; admin नए विषय जोड़ सकता है; हर आयात का अपना प्रश्न फ़ोल्डर (सेट)
- **एडमिन पैनल:** आधुनिक split-screen login (पासवर्ड दिखाने/छिपाने का बटन), dashboard, exam builder में पूरा पेपर प्रीव्यू → ड्राफ्ट → Lock/snapshot → Publish/Unpublish, **टॉपिक-वार पेपर** (विषय के हर topic से चुनी हुई संख्या में प्रश्न) और **सीबीटी श्रृंखला** (एक विषय में CBT1, CBT2 … — topic बराबर-बरार बाँटे, प्रश्न दोहराए बिना), question bank (Excel/CSV/JSON/HTML import + validation + preview + फ़ोल्डर, प्रति फ़ाइल विषय चुनने का विकल्प), छात्र एडिट और सुरक्षित हटाना, catalog, results + CSV + release gating, stats, settings, tools/backup/audit
- **सूचना और समूह चैट (पोर्टल के अंदर):** एडमिन भेजी सूचना भेजते ही सभी छात्रों के डैशबोर्ड पर सीधे दिखती है (नई सूचना का बैज काउंट, सभी/बैच-वार audience, एडिट/हटाना)। हर पंजीकृत छात्र अपने आप समूह चैट में शामिल रहता है — एडमिन का संदेश तुरंत सबको दिखता है, संदेश हटाना और flood protection सहित। कोई बाहरी ऐप (WhatsApp/Telegram) या join लिंक नहीं चाहिए।
- **सुरक्षा:** env-आधारित admin password (env न मिलने पर server-side scrypt hash fallback), HMAC tokens, rate limiting, server-side timer/scoring, answer key gating, result isolation, duplicate submit prevention
- **अलग Practice और Final:** practice के उत्तर/परिणाम final से अलग; final के अंक और उत्तर-कुंजी release के बाद ही दिखते हैं (release करते ही दोनों खुल जाते हैं)
- **Data:** Netlify Blobs — कोई paid database/API नहीं

## प्रश्न पेपर अपलोड फोल्डर

लाइव साइट पर **`/exam/templates/guide.html`** खोलें — यही अपलोड फोल्डर की हिंदी गाइड है। फाइलें:

| फाइल | उपयोग |
|---|---|
| `question-paper-sample.csv` | 10 तैयार Trade Theory प्रश्न — सीधे आयात और प्रीव्यू |
| `questions-template.csv` / `.xlsx` | खाली टेम्पलेट (CSV / Excel) |
| `question-paper-sample.html` | HTML तालिका नमूना (`<table>` से पढ़ा जाता है) |
| `questions-sample.json` | JSON नमूना |
| `guide.html` | अपलोड → प्रीव्यू → पेपर सेट → छात्र परीक्षा → परिणाम release की पूरी गाइड |

आयात: **एडमिन → प्रश्न बैंक → आयात करें** → फाइल चुनें (XLSX/XLS/CSV/JSON/HTML) → प्रीव्यू जाँचें → आयात करें। एक बार में 1000 प्रश्न तक; डुप्लीकेट (वही Question ID या वही प्रश्न टेक्स्ट) अपने-आप छूट जाते हैं।

## फोल्डर संरचना

```
index.html, SMPS-Lab/, assembly-lab.html,
basic-office-lab.html, Computer-Lab-3D-Single-File.html   मूल साइट (अपरिवर्तित)
exam/                                                      पोर्टल, CBT, admin, templates
exam/templates/                                            प्रश्न पेपर अपलोड फोल्डर (CSV/XLSX/HTML + गाइड)
study/                                                     Training Methodology डिजिटल पुस्तक + सिमुलेटर
study/trade/                                               Trade Theory 25-अध्याय पुस्तक + सिमुलेटर
netlify/functions/api.mjs                                  मुख्य API (Netlify Functions v2)
netlify/functions/auto-submit.mjs                          scheduled auto-submit (हर 5 मिनट)
netlify/lib/                                               auth, db/Blobs, scoring, handlers
scripts/build.mjs                                          dist बनाना
scripts/dev-server.mjs                                     स्थानीय server (in-memory store)
scripts/test-api.mjs                                       69-check API test suite
scripts/make-templates.mjs                                 Excel/CSV/JSON टेम्पलेट
docs/                                                      हिंदी गाइड + परीक्षण रिपोर्ट
netlify.toml                                               deploy/build/headers config
```

## स्थानीय चलाना

Node.js 22+ चाहिए (Netlify build में `NODE_VERSION = "22"` सेट है)।

```bash
node scripts/build.mjs
node scripts/dev-server.mjs      # PowerShell: $env:USE_MEMORY_STORE="1"; $env:ADMIN_PASSWORD="admin12345" (केवल local)
node scripts/test-api.mjs        # API suite
```

- छात्र: `http://127.0.0.1:8888/exam/index.html`
- एडमिन: `http://127.0.0.1:8888/exam/admin.html`
- अध्ययन केंद्र: `http://127.0.0.1:8888/study/index.html`
- Trade Theory पुस्तक: `http://127.0.0.1:8888/study/trade/index.html`

`USE_MEMORY_STORE=1` के बिना dev server Netlify Blobs context ढूँढेगा। स्थानीय परीक्षण के लिए memory store उपयोग करें — restart पर data मिटता है।

## Netlify deployment

पूरी हिंदी गाइड: **`docs/deployment-guide-hi.md`**

संक्षेप:
1. GitHub repo में **पूरा प्रोजेक्ट root** push करें (`dist/`, `node_modules/` नहीं)।
2. Netlify → Import project (build command व publish directory `netlify.toml` से स्वतः; functions `netlify/functions`)।
3. Environment variables: `ADMIN_PASSWORD`, `ADMIN_SECRET` (विवरण `docs/environment-variables.md`)।
4. Deploy → `https://<site>.netlify.app/exam/admin.html` से login → पहली परीक्षा बनाएँ।
5. Deploy के बाद `docs/deployment-guide-hi.md` की post-deploy checklist चलाएँ।

GitHub के बिना:
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set ADMIN_PASSWORD "मजबूत-पासवर्ड"
netlify env:set ADMIN_SECRET "32+ random अक्षर"
netlify deploy --build --prod
```

> Netlify Drop पर **पूरा प्रोजेक्ट root ZIP** अपलोड करें (जैसे `chnm-netlify-upload.zip`) — तब `netlify.toml` से build चलती है और Functions/Blobs भी deploy होते हैं। केवल `dist/` अपलोड करने पर `/api` काम नहीं करेगा। API `/api` path पर function v2 config से चलती है; कोई अलग redirect जरूरी नहीं।
>
> Environment variable बदलने के बाद **नया deploy जरूरी** है (functions को नई value तभी मिलती है)।

## गाइड

- [डिप्लॉयमेंट गाइड](docs/deployment-guide-hi.md)
- [एडमिन गाइड](docs/admin-guide-hi.md)
- [छात्र गाइड](docs/student-guide-hi.md)
- [Environment Variables](docs/environment-variables.md)
- [परीक्षण रिपोर्ट](docs/testing-report-hi.md)

## महत्वपूर्ण नोट

- होम पेज का कंटेंट, शिक्षक/समूह फोटो, डिज़ाइन और सभी लैब सुरक्षित हैं। उपयोगकर्ता के अनुरोध पर साइडबार से पुराना **कंप्यूटर लैब समूह (क्रम 34–50)**, अलग **Training Methodology** फोल्डर और **CHNM Academy** फोल्डर हटाए गए हैं। होम पेज में उपयोगकर्ता के स्पष्ट अनुरोध से हेडर में **📝 ऑनलाइन टेस्ट** लिंक जोड़ा गया, नीचे का तैरता परीक्षा बटन हटाया गया और Training Methodology navigation को नई डिजिटल बुक से जोड़ा गया (फोटो, मुख्य कंटेंट, लेआउट और रंग अपरिवर्तित; पुराना TM DOM content सुरक्षित)।
- अध्ययन सामग्री NIMI की विषय-सूची पर आधारित **स्वतंत्र, सरल हिंदी सामग्री** है; मूल पुस्तक का पाठ/चित्र सम्मिलित नहीं है (श्रेय: © NIMI)।
- `netlify.toml` में `X-Frame-Options: SAMEORIGIN` जरूरी है — इससे होम पेज की same-origin 3D लैब iframe काम करती है।
- `exam/` के लिए CSP `no-store` के साथ लागू है; admin password कभी frontend में न रखें।
- **Admin login fallback:** अगर Netlify Functions को `ADMIN_PASSWORD` नहीं मिलता (free-plan scope समस्या), तो `netlify/lib/admin-credentials.mjs` में रखा **scrypt hash** काम आता है। Env variable सेट होने पर वही प्राथमिक रहता है। पासवर्ड बदलने के लिए `node scripts/set-admin-password.mjs "नया-पासवर्ड"` चलाएँ और redeploy करें। यह फ़ाइल client/dist में नहीं जाती; इसमें plaintext password नहीं है।
- **सत्र स्थिरता:** admin token `localStorage` में रहता है (पुराना `sessionStorage` token स्वतः migrate होता है), और token का signature server-side fallback hash से बनता है — इसलिए env अस्थिर होने या tab reload होने पर admin अपने आप लॉगआउट नहीं होता।
- **Blobs पुनर्प्रयास:** store बनाने में अस्थायी विफलता आने पर cached promise reset हो जाता है, ताकि function instance हमेशा के लिए खराब न हो।
- **CITS-शैली CBT:** परीक्षा से पहले भाषा (हिंदी/English) और निर्देश-पुष्टि; प्रश्न स्क्रीन पर भाषा टॉगल, "चिह्नित करें और अगला" बटन, सर्वर टाइमर और प्रश्न पैलेट। प्रश्न में ` / ` से हिंदी और English अलग किए जाते हैं (आयात CSV इसी प्रारूप में हो सकती है)।
- **एडमिन लाइव निगरानी:** साइडबार में **लाइव परीक्षा** — प्रगति, अंतिम गतिविधि, शेष समय और "फाइनल करें"; परिणाम पेज पर **मेरिट (शीर्ष 10)**।
- मूल प्रोजेक्ट backup: `chnm-portal-with-exam.backup.zip`; नवीनतम बदलाव से पहले के backup: `chnm-portal-with-exam.backup-before-cits-upgrade.zip`, `chnm-portal-with-exam.backup-before-reliability-fix.zip` (इससे पहले: `…backup-before-admin-link.zip`, `…backup-before-admin-fallback.zip`)।
