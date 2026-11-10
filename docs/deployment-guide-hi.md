# Netlify डिप्लॉयमेंट गाइड (हिंदी)

यह गाइड Future Instructor – CHNM Portal + CBT परीक्षा प्रणाली को Netlify पर लाइव करने की पूरी प्रक्रिया बताती है। परियोजना **Netlify Functions + Netlify Blobs** पर चलती है — कोई paid database, external API या paid hosting जरूरी नहीं है।

> **वर्तमान स्थिति (2 नवंबर 2026):** साइट **लाइव है** — https://chnm26.netlify.app/ (project `chnm26`, team `sant-kumar-kushwaha`)। Deploy Netlify Dashboard → **Upload your project files** (Netlify Drop) से `chnm-netlify-upload.zip` अपलोड करके हुआ। Functions `/api` और Blobs काम कर रहे हैं; `ADMIN_PASSWORD` तथा `ADMIN_SECRET` project environment variables में सेट हैं। नीचे के चरण भविष्य के re-deploy/नई साइट के लिए हैं।

---

## 1. पहले क्या तैयार रखें

- GitHub खाता (free)
- Netlify खाता (free) — GitHub से sign up करना सबसे आसान है
- यह पूरा प्रोजेक्ट फोल्डर / ZIP
- एक मजबूत एडमिन पासवर्ड (कम से कम 12–16 अक्षर, अक्षर + अंक + चिन्ह)
- एक लंबा गुप्त टेक्स्ट (ADMIN_SECRET) — 32+ random अक्षर। इसे किसी password manager में रखें।
- लगभग 15–20 मिनट

**जरूरी:** परीक्षा शुरू करने से पहले backup रखें। मूल प्रोजेक्ट का backup `chnm-portal-with-exam.backup.zip` के रूप में इसी फोल्डर में है; नवीनतम बदलाव से पहले का backup `chnm-portal-with-exam.backup-before-admin-link.zip` है।

---

## 2. ZIP की जाँच

ZIP खोलने पर ये चीजें दिखनी चाहिए:

```
index.html                         मूल होम पेज (फोटो/कंटेंट/डिज़ाइन सुरक्षित; हेडर में अनुरोधित "📝 ऑनलाइन टेस्ट" लिंक)
SMPS-Lab/                          मूल SMPS लैब (अपरिवर्तित)
assembly-lab.html                  मूल लैब (अपरिवर्तित)
basic-office-lab.html              मूल लैब (अपरिवर्तित)
Computer-Lab-3D-Single-File.html   मूल 3D लैब (अपरिवर्तित)
exam/                              नया छात्र पोर्टल + CBT + एडमिन पैनल
study/                             16-अध्याय Training Methodology पुस्तक
study/trade/                       25-अध्याय Trade Theory पुस्तक, 25 तकनीकी चित्र, 66 सिमुलेटर, 3D मॉडल
netlify/functions/                 सर्वर API (api.mjs, auto-submit.mjs)
netlify/lib/                       सुरक्षा, स्कोरिंग, Blobs स्टोर
scripts/                           build / dev-server / test / template बनाने की स्क्रिप्ट
docs/                              हिंदी गाइड + परीक्षण रिपोर्ट
netlify.toml                       Netlify configuration
package.json                       @netlify/blobs dependency
```

`dist/`, `node_modules/` और backup ZIP को अपलोड करने की जरूरत नहीं — Netlify build स्वयं `dist/` बनाता है।

---

## 3. GitHub पर प्रोजेक्ट चढ़ाएँ

GitHub → **New repository** → नाम दें, जैसे `chnm-portal` → **Private** चुनें → Create। फिर प्रोजेक्ट root से:
```bash
git init
git add .
git commit -m "deploy: CHNM portal with CBT exam"
git branch -M main
git remote add origin https://github.com/<your-user>/chnm-portal.git
git push -u origin main
```

> `git add .` से पहले जाँचें कि कोई निजी backup या credentials शामिल न हों। `chnm26-live-blobs-backup-*.json` में छात्र IDs और IP audit logs हैं; इसे GitHub पर कभी upload न करें। ZIP exports, `dist/`, `node_modules/` और local `.env` `.gitignore` से बाहर रखे गए हैं। GitHub पर repository **Private** रखें।

---

## 4. Netlify से साइट जोड़ें

1. Netlify Dashboard → **Add new site** → **Import an existing project**।
2. **Deploy with GitHub** → repository चुनें।
3. Build settings स्वतः `netlify.toml` से भर जाएँगी:
   - Build command: `node scripts/build.mjs`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
   - Node version: 22
4. अभी **Deploy** न दबाएँ — पहले Environment variables सेट करें।

> **बहुत जरूरी:** केवल `dist/` फोल्डर Netlify Drop पर खींचने से Functions और Blobs deploy नहीं होंगे और हर `/api` call विफल रहेगी। हमेशा **पूरा प्रोजेक्ट root** GitHub से import करें या नीचे दिया Netlify CLI तरीका इस्तेमाल करें। साइट का पता इस तरह बनेगा: `https://<आपका-नाम>.netlify.app`।

### तरीका B — Netlify CLI (GitHub के बिना)
```bash
npm install -g netlify-cli
netlify login
netlify init                 # existing project से जोड़ें या नया बनाएँ
netlify env:set ADMIN_PASSWORD "मजबूत-पासवर्ड"
netlify env:set ADMIN_SECRET "32+ random अक्षरों-का-गुप्त-टेक्स्ट"
netlify deploy --build --prod
```
CLI प्रोजेक्ट root से चलाएँ — यही `netlify.toml` पढ़कर `dist` बनाता है और `netlify/functions` की `api` व `auto-submit` दोनों functions deploy करता है।

---

## 5. Environment Variables (अनिवार्य)

Netlify → Site configuration → **Environment variables** → **Add a variable**:

| Variable | अनिवार्य | उदाहरण / नियम |
|---|---|---|
| `ADMIN_PASSWORD` | हाँ (सिफारिश) | 12–16+ अक्षरों का मजबूत पासवर्ड। सेट होने पर यही प्राथमिक है; न मिले तो server-side hash fallback चलता है। |
| `ADMIN_SECRET` | हाँ (सिफारिश) | 32+ random अक्षर/अंक। टोकन हस्ताक्षर (HMAC) के लिए। न दें तो पासवर्ड ही secret बनता है। |
| `BLOBS_STORE` | नहीं | डिफ़ॉल्ट `chnm-exam-v2`. अलग नाम देंगे तो डेटा नए स्टोर में शुरू होगा। |

`ADMIN_PASSWORD` और `ADMIN_SECRET` में अंतर रखें। दोनों कभी भी frontend JavaScript या किसी CSV में न रखें। केवल one-way scrypt hash (plaintext नहीं) server code में fallback के रूप में रहता है; env मिलने पर वही लागू होता है।

Free plan पर अगर variable functions तक न पहुँचे, तो fallback से लॉगिन चलेगा। पासवर्ड बदलने के लिए `node scripts/set-admin-password.mjs "नया-पासवर्ड"` चलाकर redeploy करें — इससे पुराने tokens भी अमान्य हो जाएँगे।

वैकल्पिक (Netlify स्वयं देता है, आपको सेट नहीं करना):
- `NETLIFY_BLOBS_CONTEXT` — फंक्शन में blobs context स्वतः मिलता है।

Environment variable जोड़ने/बदलने के बाद **नया deploy जरूरी** है। Git-जुड़ी साइट पर **Deploys → Trigger deploy → Deploy site**; Netlify Drop साइट पर Deploys पेज से प्रोजेक्ट ZIP दोबारा अपलोड करें।

---

## 6. पहला डिप्लॉय और जाँच

1. Deploy log में `dist तैयार: …` संदेश दिखेगा और Functions में `api` तथा `auto-submit` दिखेंगे।
2. साइट खोलें:
   - होम पेज पहले जैसा ही दिखेगा (कोई बदलाव नहीं)।
   - `https://<site>.netlify.app/exam/index.html` — छात्र पोर्टल।
   - `https://<site>.netlify.app/exam/admin.html` — एडमिन लॉगिन।
   - `https://<site>.netlify.app/study/index.html` — Training Methodology अध्ययन केंद्र।
   - `https://<site>.netlify.app/study/trade/index.html` — Trade Theory 25-अध्याय पुस्तक (रूल्ड कॉपी, सिमुलेटर, 3D)।
3. **एडमिन लॉगिन जाँच:** `ADMIN_PASSWORD` से लॉगिन करें। गलत पासवर्ड देन्य पर साफ़ error आना चाहिए; 15 मिनट में 8 से अधिक गलत प्रयास पर अस्थायी block (rate limit)।
4. **API जाँच (browser console में नहीं, अलग terminal में):**
   ```bash
   curl -s -X POST https://<site>.netlify.app/api ^
     -H "content-type: application/json" ^
     -d "{\"action\":\"bootstrap\"}"
   ```
   `{"ok":true,...}` और subjects/trades दिखें। (Windows CMD में `^`, PowerShell में backtick line continuation; या एक ही लाइन में चलाएँ।)
5. **Blobs जाँच:** एडमिन → विषय/ट्रेड में एक असली विषय जोड़ें, पेज refresh करें — डेटा बना रहना चाहिए। न बने तो Environment variables/Deploy log देखें।

> `ADMIN_PASSWORD` न मिलने पर server-side scrypt fallback लॉगिन चलाता है। Fallback पासवर्ड बदलने के लिए `node scripts/set-admin-password.mjs "नया-पासवर्ड"` चलाकर redeploy करें।

---

## 7. पहली बार सेटअप (एडमिन क्रम)

विस्तृत चरण `docs/admin-guide-hi.md` में हैं। संक्षेप:

1. **विषय और ट्रेड** → जरूरत के विषय/ट्रेड जोड़ें (Trade Theory, TM, Trade Practical, Soft Skills, SMPS, Computer Hardware, Networking आदि पहले से seed हैं)।
2. **प्रश्न बैंक** → Excel/XLS/CSV/JSON/HTML आयात करें → validation/duplicate/answer errors ठीक करें → preview देखें। तैयार नमूना और गाइड: `लाइव साइट /exam/templates/guide.html`।
3. **परीक्षाएँ → नई परीक्षा** → शीर्षक, विषय, ट्रेड, प्रकार (Practice/Final), अवधि, कुल प्रश्न/अंक, पास %, negative marking, निर्देश, attempts allowed, प्रश्न चुनें → Save।
4. प्रश्न जोड़ने के बाद **Lock** करें (paper snapshot/version बनता है)।
5. जरूर **Practice** के रूप में एक टेस्ट चलाकर देखें।
6. **Publish** करें — अब छात्र इसे देख/शुरू कर सकेंगे।
7. परीक्षा के बाद **परिणाम जारी करें** (Release results) और चाहें तो "उत्तर दिखाएँ" चालू करें।

परीक्षा शुरू होने के बाद प्रश्न/पेपर/अंक बदलने पर पुराने attempts नहीं बिगड़ते: लॉक पेपर का snapshot हमेशा सुरक्षित रहता है। Published परीक्षा का ढाँचा बदलने से पहले unpublish करना पड़ता है।

---

## 8. परीक्षा दिवस चेकलिस्ट

- [ ] परीक्षा Publish है और समय सही है (optional start/end)
- [ ] निर्देश, कुल प्रश्न, अंक, अवधि, pass % दिख रहे हैं
- [ ] students का registration ID और mobile सही है (नया ID `CHNM` से शुरू होता है)
- [ ] `/exam/templates/guide.html` खुलती है और CSV/HTML नमूना आयात → प्रीव्यू चलता है
- [ ] एक demo student से पूरा flow चलाया (start → autosave → submit → result pending)
- [ ] परिणाम release नहीं किया (परीक्षा पूरी होने तक)
- [ ] admin password किसी के साथ साझा नहीं
- [ ] Netlify Dashboard खुला रखें (deploy/log देखने के लिए)

सुझाव: real final exam से पहले एक **Practice** परीक्षा और एक **अस्थायी Final** परीक्षा (1–2 प्रश्न) से पूरा rehearsal करें, फिर उसे unpublish/archive करें। परिणाम delete न करें।

---

## 9. Free Tier और ~50 छात्रों का अनुमान

परियोजना केवल Netlify Functions + Blobs + static hosting उपयोग करती है।

- **Functions:** हर start/autosave/submit/login एक invocation है। 60 मिनट की परीक्षा में autosave लगभग हर 10–15 सेकंड; इसलिए प्रति छात्र ~200–400 calls। 50 छात्रों की एक परीक्षा में अनुमानित **15,000–30,000 calls** (login/result/अन्य सहित)। Netlify Free plan की invocation सीमा तत्कालीन plan में जाँचें; सामान्यतः 100k+ प्रति माह मिलती है, जिसमें 2–4 परीक्षाएँ आराम से आती हैं।
- **Blobs:** हर छात्र का attempt + responses + result कुछ KB में। 50 छात्रों का पूरा data सामान्यतः **1 MB से कम**। Free storage/transfer सीमा plan के अनुसार जाँचें; यह उपयोग उससे बहुत कम है।
- **Bandwidth:** static files + JSON API; 50 छात्रों के लिए free tier पर्याप्त होता है।

> सीमाएँ Netlify समय-समय पर बदलता है। लाइव करने से पहले Netlify Pricing पेज पर अपने plan की वर्तमान सीमाएँ देख लें। इस परियोजना में कोई paid database/API/service नहीं है।

**Blobs consistency:** लिखते समय `consistency: "strong"` उपयोग होती है। एक ही attempt को दो डिवाइस से एक साथ खोलना/सबमिट करना समर्थित नहीं है — duplicate submission सर्वर रोकता है, लेकिन छात्र को एक ही डिवाइस पर परीक्षा देने का निर्देश दें।

---

## 10. साइट अपडेट करना

1. बदलाव GitHub में commit/push करें।
2. Netlify स्वतः नया deploy शुरू करेगा (या Deploys → Trigger deploy)।
3. Deploy सफल होने के बाद `/exam/admin.html` खोलकर login + एक route जाँचें।
4. **पहले JSON backup डाउनलोड करें** (एडमिन → टूल्स → JSON बैकअप) यदि data structure बदल रहा है।
5. किसी भी गड़बड़ी पर Netlify → Deploys → पिछला deploy → **Publish deploy** से rollback करें। Blobs का data deploy rollback से नहीं मिटता।

### 10.1 पुराना डेटा (सभी रजिस्टर्ड छात्र) सुरक्षित रहता है
नया deploy केवल **वेबसाइट का कोड** बदलता है। छात्र, परीक्षाएँ, प्रश्न, attempts, परिणाम, **सूचनाएँ** और **समूह चैट** **Netlify Blobs** में अलग रहते हैं और deploy से नहीं मिटते। नए ZIP में कोई ऐसा कोड नहीं है जो startup पर डेटा साफ़ करे; seed केवल तभी जोड़ता है जब कोई चीज़ पहले से न हो।

डेटा सुरक्षित रखने की शर्तें:
- **उसी साइट/project** (`chnm26`) पर deploy करें — नई Netlify साइट बनाने पर उसका Blobs store अलग/खाली होगा।
- `BLOBS_STORE` न बदलें (डिफ़ॉल्ट `chnm-exam-v2`); नाम बदलने पर कोड नया खाली store पढ़ेगा।
- Netlify Dashboard से Blobs store को मैन्युअली delete/clear न करें।
- एडमिन पैनल में **हटाएँ** केवल तभी दबाएँ जब सच में छात्र हटाना हो — वह कार्रवाई deploy से अलग, जानबूझकर की गई deletion है और पुष्टि के बिना नहीं होती।
- परीक्षा से पहले/बाद में JSON backup लेते रहें — यह सबसे सुरक्षित अतिरिक्त कॉपी है।

> जाँच: deploy से पहले एडमिन → विद्यार्थी में कुल संख्या/कुछ ID नोट करें; deploy के बाद वही संख्या और ID दिखें तो डेटा सुरक्षित है। उसी तरह **सूचना और चैट** पेज पर पुरानी सूचनाएँ और चैट संदेश दिखना चाहिए।

---

## 11. जरूरी सुरक्षा नियम

- `ADMIN_PASSWORD` / `ADMIN_SECRET` केवल Netlify Environment Variables में रखें।
- पासवर्ड बदलने पर सभी पुराने admin tokens अपने आप अमान्य हो जाते हैं (नया deploy/env लागू होने पर)।
- एडमिन पैनल साझा कंप्यूटर पर खुला न छोड़ें; काम के बाद Logout करें।
- छात्रों को केवल अपना registration ID/mobile दें; सामूहिक सूची सार्वजनिक न करें।
- परीक्षा से पहले और बाद में JSON backup डाउनलोड करके सुरक्षित रखें।
- किसी भी data/result को बिना सोचे delete न करें — परिणाम वाले छात्र को हटाने पर दो पुष्टियाँ (Registration ID + `DELETE`) माँगी जाती हैं; सिर्फ़ रोकना हो तो छात्र को **निष्क्रिय** करें।

---

## 12. समस्या-समाधान (Troubleshooting)

| लक्षण | संभावित कारण | समाधान |
|---|---|---|
| `सर्वर पर ADMIN_PASSWORD सेट नहीं है` | deploy पुराना / `admin-credentials.mjs` bundle में नहीं | नया deploy करें; फिर भी आए तो `netlify/lib/admin-credentials.mjs` मौजूद है या नहीं जाँचें |
| एडमिन लॉगिन सफल नहीं | गलत पासवर्ड या 8 गलत प्रयास | 15 मिनट बाद फिर कोशिश; password जाँचें |
| `/api` 404 | functions deploy नहीं हुए | Deploy log → Functions में `api` दिखे; `netlify.toml` functions directory |
| हर action पर `/api` 500 ("तकनीकी त्रुटि") | Blobs context नहीं मिला, credits खत्म/साइट paused, या पुराना function bundle | Netlify → Logs → Functions → `api` खोलें; Team → Usage में credits देखें; नया deploy करें |
| डेटा refresh पर गायब | Blobs context नहीं मिला | Netlify पर ही चलाएँ (Netlify Drop/सिर्फ static पर बैकएंड नहीं चलेगा) |
| छात्र exam नहीं देख पा रहा | exam draft/locked है या trade/subject गलत | Publish करें; छात्र का trade/subject जाँचें |
| समय खत्म पर submit नहीं | ब्राउज़र बंद था | scheduled `auto-submit` फंक्शन देखें; अगली बार खोलने पर server timer लागू |
| परीक्षा में बार-बार "offline" | नेटवर्क कमजोर | उत्तर locally सुरक्षित रहते हैं; कनेक्शन आने पर autosave |
| होम पेज की 3D लैब नहीं खुली | X-Frame-Options बदला गया | `netlify.toml` में `SAMEORIGIN` बना रहने दें |

---

## 13. डिप्लॉय के बाद अनिवार्य परीक्षण (post-deploy)

1. होम पेज, सभी फोटो, SMPS लैब, Computer Lab, Networking लिंक खोलें।
2. नया छात्र register करें → login करें → dashboard देखें।
3. एक Practice परीक्षा में 2–3 प्रश्न हल करें, Save & Next / Mark / Clear / palette जाँचें।
4. Final Submit confirmation जाँचें; submit के बाद उत्तर न बदलें।
5. एडमिन → परिणाम → release → छात्र result खोलें; Refresh पर भी वही score दिखे।
6. एडमिन → टूल्स → JSON बैकअप डाउनलोड करके खोलें।
7. Mobile browser (Chrome, 390px चौड़ाई) पर timer, palette drawer और Submit जाँचें; शुरू हुई परीक्षा के हेडर में **संस्थान/ग्रुप का नाम** (जैसे “Future Instructor Group”) दिखना चाहिए।
8. एडमिन → सेटिंग्स → **संस्थान का नाम** बदलकर परीक्षा पेज refresh करें — CBT हेडर, लैंडिंग हेडर और browser tab title में नया नाम दिखे।
9. दो डिवाइस से एक ही छात्र का दोबारा submit रोकें/जाँचें।

यह चेकलिस्ट पहले deploy के बाद चलाई जा चुकी है (होम पेज, छात्र/एडमिन पेज, `/api` bootstrap, mobile 390px हेडर)। नया deploy या environment variable बदलने पर इसे दोबारा चलाएँ।
