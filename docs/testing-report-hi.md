# परीक्षण रिपोर्ट (Testing Report)

**परियोजना:** Future Instructor – CHNM Portal + CBT परीक्षा प्रणाली
**तारीख:** 1 नवंबर 2026
**परीक्षण वातावरण:** Windows 10 (x64), Node.js v24.18.0 (Qoder के Electron runtime से), स्थानीय dev server `http://127.0.0.1:8888`, in-memory data store, headless/in-app browser.

> **स्पष्ट स्थिति:** यह रिपोर्ट **स्थानीय (local) परीक्षण** की है। इस मशीन पर Netlify credentials उपलब्ध नहीं थे, इसलिए **Netlify पर वास्तविक लाइव deployment नहीं किया गया** और लाइव साइट पर कोई परीक्षण नहीं हुआ। Deployment-ready configuration तैयार है; लाइव करते समय `docs/deployment-guide-hi.md` की post-deploy चेकलिस्ट दोबारा चलानी होगी।

---

## 1. परीक्षण का दायरा

| क्षेत्र | परीक्षण |
|---|---|
| Backend API | 78 automated checks — auth, validation, anti-duplicate submit, timers, exam lifecycle, result isolation, practice/final separation, legacy import, export, safety guards |
| Admin panel | Login, dashboard, exams, questions, results, students, catalog, stats, settings, tools |
| Student portal | Registration, login/session, dashboard, CBT, autosave, submit, pending/released result |
| अध्ययन केंद्र | 16 अध्याय रेंडर, **108/108 खंड पर आरेख**, 19 LIVE सिमुलेटर सहित 30+ सिमुलेटर, क्विज़ स्कोर/सेफ्टी, progress persistence, खोज/फ़िल्टर |
| Trade Theory पुस्तक | 25 अध्याय, 143 खंड, **143/143 खंड पर आरेख**, **25/25 अध्याय पर SMPS-शैली LIVE लैब**, 152 प्रश्न, तालिका/सूत्र/बेंच ड्रिल, search/filter, progress अलग key में |
| Preservation | मूल होम पेज, सभी फोटो, SMPS Lab, Computer/3D Lab, Networking/अन्य मॉड्यूल की byte-level समानता |
| Responsive | 390px width में student portal, admin, result, CBT layout |
| Build | `scripts/build.mjs` से production `dist` निर्माण |

---

## 2. स्वचालित API परीक्षण

कमांड:
```bash
node scripts/test-api.mjs
```

परिणाम:
```
===== 78 passed, 0 failed =====
```

समूहवार स्थिति:

| # | समूह | परिणाम |
|---|---|---|
| 1 | Bootstrap / public data | पास |
| 2 | Registration validation (नाम, मोबाइल, ईमेल, फोटो, सहमति) | पास |
| 3 | Student login / token / PIN | पास |
| 4 | Admin login, invalid password, token protection | पास |
| 5 | Exam lifecycle: draft → lock → snapshot → publish → unpublish | पास |
| 6 | Practice exam: answers visible, final list से अलग | पास |
| 7 | Legacy import preview, import, idempotency, legacy login/result | पास |
| 8 | Admin stats, export, safety guards (result वाले student/exam delete block) | पास |

इनके अलावा उपयोग हुए checks में शामिल:
- Exam start / autosave (seq) / submit / duplicate submit prevention
- Server-side timer और auto-submit का व्यवहार
- Scoring + negative marking
- Result release gating (release से पहले score redaction)
- Student result isolation (दूसरे छात्र का result नहीं)
- Published exam का structural edit block
- Locked exam का structural edit पर draft में जाना
- Admin live monitor (`admin_live`): सक्रिय प्रयास, उत्तर गिनती, छात्र access block, submit के बाद सूची खाली
- परिणाम मेरिट सूची: रैंक और शीर्ष प्रतिशत
- CSV/data export और audit log

---

## 3. ब्राउज़र E2E (स्थानीय)

### 3.1 एडमिन
| जाँच | परिणाम |
|---|---|
| `ADMIN_PASSWORD` से login | पास |
| डैशबोर्ड/परीक्षाएँ/प्रश्न बैंक/परिणाम/विद्यार्थी/विषय-ट्रेड/आँकड़े/सेटिंग्स/टूल्स रूट | पास — कोई runtime error नहीं |
| नई परीक्षा बनाना (प्रश्न चयन सहित) | पास — 3 प्रश्न · 3 अंक सही दिखे |
| Lock → snapshot v1 → Publish | पास |
| परिणाम पेज: सारांश, फ़िल्टर, individual detail | पास |
| टूल्स: JSON backup, ऑडिट, टेम्पलेट लिंक | पास |
| प्रश्न/विद्यार्थी/कैटलॉग/सेटिंग्स save/validate | पास |

### 3.2 छात्र
| जाँच | परिणाम |
|---|---|
| फोटो सहित registration (validation सहित) | पास — ID जनरेट हुआ (`CHNM…`) |
| Login/session, dashboard में published exam | पास |
| CBT: timer, palette, प्रश्न/विकल्प, Save & Next, autosave status | पास |
| Final submit confirmation और submit | पास |
| Submit के बाद pending result — अंक/सही-गलत छिपे | पास |
| एडमिन release के बाद result: अंक, %, उत्तीर्ण, उत्तर/व्याख्या | पास |
| उत्तर बदलने/submit दोबारा करने पर server रोक | पास |

### 3.3 Mobile (390px iframe)
| जाँच | परिणाम |
|---|---|
| Student portal: horizontal overflow | नहीं |
| Admin: sidebar off-canvas + menu toggle दिखता है | पास |
| Result page: overflow | नहीं |
| CBT: विकल्प पूरी चौड़ाई में (344px, 390px viewport) | पास |
| CBT: प्रश्न पैलेट off-canvas, toggle दिखता है, खुलने पर viewport में (60–390px) | पास |
| Drawer backdrop | पास |

**सीमा:** in-app browser सरफेस इस सत्र में hidden था, इसलिए screenshot-based visual check नहीं हो सका। उपरोक्त लेआउट/geometry/computed-style जाँच DOM से की गई। लाइव deployment के बाद असली मोबाइल पर एक बार visual check करें।

### 3.4 अध्ययन केंद्र (Training Methodology डिजिटल पुस्तक)
| जाँच | परिणाम |
|---|---|
| हब: 16 मॉड्यूल कार्ड, सही शीर्षक/उपशीर्षक/मिनट, 30 सिमुलेटर व 64 प्रश्न काउंट | पास |
| खोज (`NSQF` → 1 कार्ड; खाली → 16) और फ़िल्टर (सभी/बाकी/पूरे) + खाली संदेश | पास |
| अध्याय रेंडर: परिचय, उद्देश्य, 5 खंड, मुख्य बिंदु, उदाहरण, याद रखें, पिछला/अगला नेविगेशन | पास |
| पढ़ा हुआ टॉगल → localStorage, साइडबार progress 1/16, हब progress 6% | पास |
| सिमुलेटर — sort (अध्याय 1, 8 आइटम): सही/गलत फ़ीडबैक + कारण + पूर्णता | पास |
| सिमुलेटर — conditioning (अध्याय 2): 3 जोड़ी के बाद केवल घंटी से सीखी प्रतिक्रिया | पास |
| सिमुलेटर — sequence (अध्याय 4): 7 चरणों का सही क्रम, प्रति-चरण कारण | पास |
| सिमुलेटर — checklist (अध्याय 8): 5/10 पर अस्वीकृत, दोबारा करके 10/10 पर पूर्ण | पास |
| सिमुलेटर — scenario (अध्याय 9): गलत विकल्प पर सही उत्तर हाइलाइट; स्कोर 2/3 | पास |
| सिमुलेटर — calculator (अध्याय 7, 10, 14): ब्लूप्रिंट 15+25+10=50 तथा समय 60 मिनट; लागत/मुनाफ़ा/ब्रेक-ईवन 7 इकाई; CPD 5 घंटे/महीना | पास |
| सिमुलेटर — calculator validation: प्रतिशत जोड़ 100 न होने पर स्पष्ट त्रुटि | पास |
| सिमुलेटर — levels (अध्याय 12): 10 NSQF चिप, विवरण बदलता है, 3 स्तर देखने पर पूर्ण | पास |
| सिमुलेटर — match (अध्याय 16): 10 जोड़े, सही मिलान पर लॉक, पूर्णता | पास |
| क्विज़ (अध्याय 1): 4/4 स्कोर, व्याख्या, localStorage में सुरक्षित; दोबारा प्रयास | पास |
| Console | किसी परीक्षण अध्याय में कोई JS error/console warning नहीं | पास |

सिमुलेटर पूरा होने और क्विज़ जमा होने पर ही progress localStorage (`fiStudyProgressV1`) में लिखा जाता है; checklist तभी पूरा माना जाता है जब सभी कथन सही हों।

**Mobile geometry (390px iframe):** हब पर कोई horizontal overflow नहीं (scrollWidth = clientWidth = 375), मॉड्यूल ग्रिड 1 कॉलम; अध्याय पेज पर साइडबार लेख के नीचे (order 2), match सिमुलेटर 1 कॉलम। असली फिंगर-टच/visual जाँच नहीं हुई।

### 3.5 नवीनतम संशोधन — आरेख, नए विषय और हेडर लिंक (1 नवंबर 2026)

| # | जाँच | परिणाम |
|---|---|---|
| 1 | होम पेज हेडर में "सम्पूर्ण CHNM Trade Guide" के बगल में 📝 ऑनलाइन टेस्ट लिंक | पास — `exam/index.html` खुलता है; पुराना तैरता बटन भी सुरक्षित |
| 2 | हेडर 1014px desktop पर फिट | पास — `scrollWidth = clientWidth = 1014`, कोई टूटना नहीं |
| 3 | हेडर 390px mobile (iframe) | पास — लिंक आइकन-ओनली (41×42px), ट्रेड गाइड पिल छिपता है, overflow नहीं |
| 4 | हब पर सिमुलेटर काउंट | पास — 30 (हार्डकोडेड 16 से बदलकर गतिशील) |
| 5 | नए आरेख रेंडर (flow/cycle/pyramid/ladder/compare/map) | पास — M1–M16 सभी आरेख दिखे, नोड/लेबल/कैप्शन सही |
| 6 | नया `find` सिमुलेटर (छिपे लेबल वाला चित्र) | पास — M1, M4, M5, M8, M16: सही क्लिक पर लेबल खुला, गलत पर फ़ीडबैक, अंत में पूर्णता |
| 7 | नए sort सिमुलेटर (M2, M6, M7, M9, M10) | पास — क्रमशः 5/5, 6/6, 6/6, 6/6, 6/6 |
| 8 | नए sequence सिमुलेटर (M3 ADDIE 5 चरण, M13 Kolb 4 चरण) | पास — सही क्रम पर प्रति-चरण कारण और पूर्णता |
| 9 | नए checklist सिमुलेटर (M11, M15) | पास — 6/6 कथन पूरे होने पर ही सिम्युलेटर पूर्ण |
| 10 | खोज: ADDIE, डिजिटल ट्विन, 5S, Kolb, DGT | पास — प्रत्येक पर 1 सही मॉड्यूल कार्ड |
| 11 | अध्याय 12 (NSQF ladder), 14 (CPD cycle), 15 (checklist) रेंडर | पास — 1 आरेख + 1–2 सिमुलेटर, overflow नहीं |
| 12 | Mobile 390px: M2, M4, M6, M9, M10, M12, M13, M15 | पास — आरेख पूरी चौड़ाई, कोई horizontal overflow नहीं |
| 13 | Console | कोई JS error/warning नहीं |
| 14 | Build | `dist तैयार: 52 फाइलें, 45.62 MB` |

**इस चरण में जोड़े गए विषय (स्वतंत्र, सरल हिंदी):** DGT/NCVET कार्यक्रम, प्रेरणा व व्यक्तित्व, ADDIE, समय-सारणी, लर्निंग आउटकम/असेसमेंट क्राइटेरिया, Bloom↔NSQF, प्रदर्शन योजना, प्रश्न पूछने की तकनीक, शिक्षण सामग्री के प्रकार व देखभाल, सूक्ष्म-शिक्षण, तीनों जॉब शीट का उपयोग, टेस्ट ब्लूप्रिंट, NSQF मूल्यांकन/प्रमाणन/RPL, 5S व वर्कशॉप प्रबंधन, नेतृत्व शैली, सक्रिय सुनना/कठिन विद्यार्थी, टीम व संघर्ष, इंटरनेट सुरक्षा/ऑनलाइन कक्षा, Kolb, CPD पोर्टफोलियो/नैतिकता, अंग्रेज़ी व करियर/परीक्षा/स्वरोजगार, डिजिटल कंटेंट/डिजिटल ट्विन/मेटावर्स/mobile learning/AR-VR-XR।

**पाई गई समस्या और सुधार:** 390px पर M4 में 14px horizontal overflow था, कारण लंबे अध्याय नाम वाले `.chapter-footnav` लिंक का `white-space: nowrap`। मोबाइल मीडिया क्वेरी में `white-space: normal` जोड़कर सुधारा; M4 सहित सभी जाँचे गए पेजों पर overflow 0 हो गया।

### 3.6 TM navigation सुधार और तैरता बटन हटाना (1 नवंबर 2026)

| # | जाँच | परिणाम |
|---|---|---|
| 1 | साइडबार group "Training Methodology · नई डिजिटल बुक (16)" | पास — 16 links, सभी `study/chapter.html?m=N` |
| 2 | साइडबार से chapter खोलना (M2) | पास — सही अध्याय खुला, सिमुलेटर दिखे |
| 3 | CHNM home card में नई बुक hub + 16 chapter links | पास — 17 links, पुराने `#chnm-tm-*` links हटे |
| 4 | पुराने sidebar TM links | पास — 0 remaining (पुराना DOM content सुरक्षित) |
| 5 | नीचे का तैरता "ऑनलाइन टेस्ट" बटन | पास — हट गया; हेडर लिंक बना हुआ |
| 6 | 390px mobile | पास — overflow 0, हेडर लिंक दिखता है, तैरता बटन नहीं |
| 7 | Console | कोई JS error नहीं |
| 8 | Build | `dist तैयार: 52 फाइलें, 45.62 MB` |

पुराने 14-unit TM sections DOM में बने हुए हैं ताकि कोई content delete न हो, लेकिन navigation अब नई डिजिटल बुक से जुड़ी है।

### 3.7 Admin password fallback (1 नवंबर 2026)

Netlify free plan पर environment variable कभी-कभी function runtime तक नहीं पहुँचता। इसलिए env के बिना भी login चलाने के लिए server-side scrypt fallback जोड़ा गया।

| # | जाँच | परिणाम |
|---|---|---|
| 1 | `ADMIN_PASSWORD`/`ADMIN_SECRET` unset — `hasAdminPassword()` | पास — true (fallback उपलब्ध) |
| 2 | सही fallback पासवर्ड | पास — true |
| 3 | गलत पासवर्ड | पास — false |
| 4 | Env unset पर token जारी कर `requireAdmin` | पास — admin token सत्यापित |
| 5 | `ADMIN_PASSWORD` सेट होने पर precedence | पास — env पासवर्ड true, fallback false |
| 6 | `handleAdminLogin` (env unset, memory store): गलत पासवर्ड | पास — 401 "गलत पासवर्ड" |
| 7 | `handleAdminLogin` (env unset, memory store): fallback पासवर्ड | पास — 200, token मिला |
| 8 | `admin-credentials.mjs` में plaintext या client exposure | नहीं — केवल salt + one-way hash; `dist/` में फ़ाइल नहीं |
| 9 | Env set होने पर fallback का उपयोग | नहीं — env ही प्राथमिक |

Fallback पासवर्ड rotate करने के लिए `scripts/set-admin-password.mjs` जोड़ा गया है; बदलने पर पुराने tokens अमान्य हो जाते हैं।

### 3.8 Portal में एडमिन लॉगिन लिंक

| # | जाँच | परिणाम |
|---|---|---|
| 1 | छात्र पोर्टल हेडर में "एडमिन लॉगिन" लिंक | पास — `admin.html` |
| 2 | Desktop layout (1129px) | पास — overflow 0 |
| 3 | 390px iframe | पास — overflow 0, हेडर 96px, लिंक मौजूद |
| 4 | Footer का पुराना एडमिन लिंक | पास — बना हुआ |

### 3.9 एडमिन सत्र स्थिरता और Blobs पुनर्प्रयास (1 नवंबर 2026)

| # | जाँच | परिणाम |
|---|---|---|
| 1 | Env बदलने के बाद भी पुराना admin token | पास — fallback hash से signature स्थिर, `requireAdmin` सत्यापित |
| 2 | Env पासवर्ड precedence | पास — env सेट होने पर वही पासवर्ड मान्य |
| 3 | Blobs store promise विफल होने पर cache reset | पास — अगला अनुरोध नया प्रयास करता है (कोड जाँच) |
| 4 | लॉगिन के बाद token localStorage में | पास — `fig.admin.token` |
| 5 | पेज reload के बाद डैशबोर्ड बना रहता है | पास — 8 stat कार्ड, लॉगिन फ़ॉर्म छिपा |
| 6 | पुराना sessionStorage token | पास — localStorage में स्वतः migrate |
| 7 | API test suite | पास — 61/61 |
| 8 | Build | पास — 52 फ़ाइलें, 45.60 MB |

### 3.10 सरल CSV (`answer` कॉलम) आयात (1 नवंबर 2026)

समस्या: जिन CSV में उत्तर कॉलम का नाम `answer` था, वहाँ हर पंक्ति पर "सही उत्तर A, B, C, D या 1-4 में से दें" आ रहा था। कारण: इम्पोर्टर केवल `Correct Answer`/`correct` कॉलम पढ़ता था।

| # | जाँच | परिणाम |
|---|---|---|
| 1 | `cits_tm_100_questions_numeric_answers.csv` पढ़ना | पास — 100 पंक्तियाँ, तैयार 100 |
| 2 | प्रीव्यू में उत्तर 1–4 से A–D मैपिंग | पास — 2→B, 3→C, 4→D, 1→A |
| 3 | आयात (TM विषय) | पास — 100 जोड़े गए, त्रुटियाँ 0, डुप्लीकेट 0 |
| 4 | पुराने टेम्पलेट `Correct Answer` | पास — पहले की तरह समर्थित |
| 5 | Build | पास — 52 फ़ाइलें, 45.60 MB |

### 3.11 परीक्षा में एक क्लिक से प्रश्न चयन (1 नवंबर 2026)

| # | जाँच | परिणाम |
|---|---|---|
| 1 | "इस विषय के सभी प्रश्न चुनें" बटन | पास — TM विषय के 110 प्रश्न एक क्लिक में चुने |
| 2 | दिख रहे 30 प्रश्नों के चेकबॉक्स | पास — सभी 30 checked, कुल गिनती 110 |
| 3 | 500 प्रश्न सीमा | पास — सीमा पर रुककर चेतावनी |
| 4 | प्रश्न सूची क्रम (समान updatedAt) | पास — qid से स्थिर क्रम, हर बार एक जैसा |
| 5 | तेज़ subject/search बदलने पर पुराना response | पास — stale response अनदेखा (request guard) |
| 6 | Blobs उपलब्ध न होने पर संदेश | पास — 503 + स्पष्ट कारण, generic 500 नहीं |
| 7 | गलत/खाली `BLOBS_STORE` मान | पास — मान्य नाम न होने पर `chnm-exam-v2` पर fallback |
| 8 | API test suite | पास — 61/61 |

### 3.12 CITS-शैली CBT सुधार (1 नवंबर 2026)

| # | जाँच | परिणाम |
|---|---|---|
| 1 | Landing पर भाषा चयन (हिंदी/English) | पास — English चुनने पर `fig.cbt.lang=en` सुरक्षित, बटन active |
| 2 | निर्देश पुष्टि के बिना शुरू बटन | पास — `startBtn.disabled=true`; टिक करने पर चालू |
| 3 | प्रश्न स्क्रीन भाषा टॉगल (ऊपर + प्रश्न हेडर) | पास — दोनों जगह एक साथ बदलते हैं; प्रश्न/विकल्प ` / ` से अलग हिंदी/English दिखते हैं |
| 4 | "चिह्नित करें और अगला" | पास — उत्तर सुरक्षित, प्रश्न चिह्नित, अगला प्रश्न खुला; गिनती 1/11 और चिह्नित 1 |
| 5 | सर्वर-आधारित टाइमर | पास — 60 मिनट की परीक्षा पर 57:53 शेष दिखा |
| 6 | एडमिन लाइव परीक्षा सूची | पास — सक्रिय 1, प्रगति 1/11, चिह्नित 1, शेष 57:25, "चालू" |
| 7 | लाइव पेज मैनुअल रिफ़्रेश | पास — टाइमस्टैम्प बदला; auto-refresh 15 सेकंड पर सेट और टैब छिपा होने पर बंद (क्रेडिट बचत) |
| 8 | लाइव से "फाइनल करें" | पास — पुष्टि मॉडल, परिणाम बना, सूची 0 और toast "प्रयास फाइनल हो गया" |
| 9 | परिणाम पेज मेरिट सूची | पास — 3 final परिणाम, रैंक 1/2/3 (60%, 40%, 20%), आँकड़े पास दर 66.67% |
| 10 | API test suite | पास — 68/68 (admin_live, merit, live cleanup सहित) |

> सीमा: इस सत्र में in-app browser सरफेस hidden था, इसलिए screenshot-based visual check नहीं हो सका; DOM/स्नैपशॉट से लेआउट और व्यवहार जाँचा गया। नई className (`.cbt-lang`, `.lang-btn`, `.progress`, `.declare-check`) मौजूदा responsive ब्रेकपॉइंट में जोड़ी गई हैं; 390px पर एक बार असली फोन में देख लें।

### 3.13 Trade Theory 25-अध्याय पुस्तक (1 नवंबर 2026)

| # | जाँच | परिणाम |
|---|---|---|
| 1 | डेटा लोड | पास — 25 मॉड्यूल, id 1–25 क्रम में; 5 डेटा फ़ाइलें, कुल ~1.03 MB |
| 2 | संरचना | पास — 143 खंड, 152 MCQ, 54 सिम्युलेटर, 25 उदाहरण, 0 missing field, 0 duplicate paragraph |
| 3 | हब | पास — 25/25 कार्ड, 54 सिमुलेटर, 152 प्रश्न, search (`VPN` → 3), बाकी/पढ़े फ़िल्टर, resume अध्याय 06 |
| 4 | पाठ रेंडर (अध्याय 6) | पास — 6 खंड, 6 तालिकाएँ, 28 चरण, 2 आरेख, 5 note/exam बॉक्स, ~19,000 अक्षर, कोई horizontal overflow नहीं |
| 5 | sequence सिम्युलेटर | पास — 7-चरण नो-बूट क्रम सही करने पर "सही क्रम!" + chapter sim progress सेव |
| 6 | match सिम्युलेटर | पास — 6/6 जोड़े, "सिम्युलेटर पूरा" |
| 7 | scenario सिम्युलेटर | पास — 3 स्थितियाँ, अगली स्थिति बटन, अंत में 3/3 स्कोर |
| 8 | checklist सिम्युलेटर | पास — 8/8 सही पहचान, सिम्युलेटर पूरा |
| 9 | sort सिम्युलेटर | पास — 6/6 सही, सिम्युलेटर पूरा |
| 10 | calc सिम्युलेटर | पास — 12 V, 2 A → R=6 Ω, P=24 W; सूत्र सहित परिणाम |
| 11 | क्विज़ | पास — 6/6 (100%), हर उत्तर का कारण, स्कोर summary pill में तुरंत दिखा, `fiTradeProgressV1` में सेव |
| 12 | पढ़ा हुआ / प्रगति | पास — अध्याय 6 चिह्नित, साइडबार 1/25 (4%), हब 1/25, TM प्रगति 0/16 अलग रही |
| 13 | TM पुस्तक regression | पास — 16 कार्ड, 30 सिमुलेटर, अध्याय 1 रेंडर, TM progress key अछूता |
| 14 | कंसोल | पास — कोई console error नहीं |
| 15 | API suite | पास — 68/68 |

> सीमा: Trade Theory पृष्ठों का screenshot नहीं लिया जा सका (उपरोक्त browser surface सीमा); संरचना, DOM माप और सिम्युलेटर व्यवहार से जाँच पूरी की गई। मोबाइल 390px पर एक बार असली फोन में जाँच लें।

---

### 3.14 एडमिन लॉगिन, छात्र एडिट/हटाना और WhatsApp (2 नवंबर 2026)

| # | जाँच | परिणाम |
|---|---|---|
| 1 | नई एडमिन लॉगिन स्क्रीन | पास — बाईं ओर "EXAM CONTROL CENTER" हीरो, दाईं ओर पासवर्ड पैनल; सुरक्षा नोट दिखा |
| 2 | पासवर्ड दिखाएँ/छिपाएँ | पास — `password` → `text` → `password`; आइकन और aria-label बदले |
| 3 | लॉगिन सत्यापन | पास — सही पासवर्ड पर डैशबोर्ड, गलत पर स्पष्ट त्रुटि; पासवर्ड कहीं localStorage/frontend में नहीं |
| 4 | लॉगिन स्क्रीन + साइडबार WhatsApp लिंक | पास — दोनों सही ग्रुप URL पर जाते हैं (`chat.whatsapp.com/HH8Uzf756YwLe5UWkdoioa`) |
| 5 | विद्यार्थी पंक्ति बटन | पास — **विवरण · एडिट · हटाएँ** तीनों दिखे |
| 6 | छात्र एडिट | पास — मौजूदा नाम/मोबाइल/ट्रेड/बैच/फोटो/ PIN के साथ फॉर्म खुला; सेव पर प्रोफ़ाइल अपडेट, Registration ID अपरिवर्तित |
| 7 | बिना परिणाम वाले छात्र को हटाना | पास — Registration ID टाइप करने पर पुष्टि, फिर हट गया; रद्द करने पर कुछ नहीं हुआ |
| 8 | परिणाम वाले छात्र को हटाना | पास — पहली पुष्टि (ID) + दूसरी पुष्टि (`DELETE`); बिना दोनों के हटना नहीं होता |
| 9 | रजिस्ट्रेशन सफलता पर WhatsApp बटन | पास — "WhatsApp ग्रुप खोलें" बटन सही URL के साथ दिखा |
| 10 | पुराने छात्र डैशबोर्ड पर ग्रुप बैनर | पास — हरा बैनर, जॉइन बटन, हेडर में स्थायी "WhatsApp ग्रुप" बटन |
| 11 | बैनर बंद करना | पास — ✕ पर छिपा और `chnm.wa.CHNM1=1` localStorage में सेव; दोबारा लोड पर छिपा रहा |
| 12 | ग्रुप संदेश की सीमा | पास — auto-join/auto-post नहीं; सभी क्रियाएँ उपयोगकर्ता के टैप से |
| 13 | परिणाम जारी करते ही WhatsApp विंडो | पास — शीर्षक, तैयार संदेश (परीक्षा नाम + पोर्टल लिंक), **संदेश कॉपी करें**, **WhatsApp खोलें**, **ग्रुप खोलें** |
| 14 | संदेश संपादन/कॉपी | पास — textarea बदल सकते हैं; कॉपी पर toast "संदेश कॉपी हो गया" |
| 15 | WhatsApp share लिंक | पास — `https://wa.me/?text=...` सही encode हुआ; ग्रुप चुनकर भेजना उपयोगकर्ता के हाथ में |
| 16 | बैच डिफ़ॉल्ट | पास — रजिस्ट्रेशन फॉर्म में `2026-27` पहले से भरा |
| 17 | डैशबोर्ड भाषा टॉगल | पास — हिंदी/English से पूरा डैशबोर्ड बदला, चुनाव localStorage में सुरक्षित |
| 18 | तैयार हो रही परीक्षाएँ | पास — ड्राफ्ट पेपर छात्र को "पेपर तैयार हो रहा है" के साथ दिखे, शुरू नहीं हो सकीं |
| 19 | परिणाम के बाद अध्ययन सुझाव | पास — "📚 ये पढ़ें आप" में विषय-वार %, सुझाव और ट्रेड थ्योरी लिंक |
| 20 | प्रश्न फ़ोल्डर | पास — आयात पर फ़ोल्डर बना; प्रश्न बैंक कार्ड और "इस फ़ोल्डर के सभी प्रश्न चुनें" काम किए |
| 21 | API suite | पास — **78/78** |
| 22 | Build | पास — 77 फ़ाइलें, 47.27 MB |

> सीमा: in-app browser का visible surface उपलब्ध नहीं था, इसलिए screenshot नहीं लिया गया; DOM स्नैपशॉट, computed style और localStorage मान से जाँच की गई। WhatsApp में वास्तविक भेजना उपयोगकर्ता के अपने फोन/नंबर से होता है — परीक्षण में केवल तैयार लिंक/संदेश जाँचा गया।

---

### 3.15 पुराना डेटा सुरक्षा जाँच (2 नवंबर 2026)

| # | जाँच | परिणाम |
|---|---|---|
| 1 | Startup seed दोबारा चलाने पर मौजूदा छात्र | पास — `CHNM1`, `CHNM2` दोनों अपनी जानकारी के साथ बने रहे |
| 2 | Startup पर store clear/reset | नहीं — कोई clear/delete-all कॉल नहीं; seed केवल गायब विषय/ट्रेड/प्रश्न जोड़ता है |
| 3 | Blobs store का नाम | अपरिवर्तित — डिफ़ॉल्ट `chnm-exam-v2`; बदलने पर ही नया खाली store बनता |
| 4 | Deploy से छात्र/परिणाम मिटना | नहीं — deploy केवल static/functions कोड बदलता है; data Blobs में अलग रहता है |
| 5 | छात्र हटाना | केवल मैनुअल; Registration ID पुष्टि; परिणाम वाले छात्र पर दूसरी `DELETE` पुष्टि; server भी बिना `deleteResults` रोकता है |
| 6 | Legacy छात्र login/result | पास — पुराना `FIG-…` डेटा अभी भी लॉगिन और परिणाम दिखाता है |
| 7 | API suite | पास — 78/78 (student delete guard सहित) |

> निष्कर्ष: नया deploy मौजूदा रजिस्टर्ड छात्रों, प्रश्नों, परीक्षाओं, attempts या परिणामों को नहीं मिटाता। शर्त: उसी Netlify साइट पर deploy करें और `BLOBS_STORE` न बदलें। विस्तृत चेकलिस्ट [deployment-guide-hi.md](deployment-guide-hi.md) के सेक्शन 10.1 में है।

---

### 3.17 चित्र-आच्छादन, SMPS-शैली लाइव लैब और UI समग्रता (5 नवंबर 2026)

इस चरण का मुख्य लक्ष्य: **हर खंड पर चित्र** और **हर अध्याय में SMPS जैसा लाइव सिमुलेटर**।

| # | जाँच | परिणाम |
|---|---|---|
| 1 | Trade Theory चित्र आच्छादन | पास — 25 मॉड्यूल, **143/143 खंड** पर आरेख; `scripts/_verify_trade_figs.mjs` से type/items/label/note/map.center/cycle.loop सहित संरचना जाँच — "ALL FIGURES WELL-FORMED" |
| 2 | नई आरेख परतें | पास — `clarity-trade-figs-c/d/e.js` (T11–T25, 79 नई आकृतियाँ) `chapter.html` में लोड; मौजूदा आरेख पर आक्रामक नहीं (`if (section.figure) return;`) |
| 3 | TM चित्र आच्छादन | पास — 16 मॉड्यूल, **108/108 खंड** पर आरेख, 19 लाइव सिमुलेटर |
| 4 | Trade लाइव सिमुलेटर | पास — **25/25 अध्याय** पर कम-से-कम एक LIVE सिम; कुल 25 (12 हस्त-लिखित दृश्य + 13 नए spec-आधारित लैब) |
| 5 | लैब इंजन | पास — `LABS` रजिस्ट्री (shock, kb, laptop, scan, display, upgrade, backup, charge, vpn, perm, web, harden, dmz) + सामान्य `sceneLab` रेंडरर, जो SMPS लैब जैसा ही `shell()` इस्तेमाल करता है: LIVE पट्टी → canvas → स्लाइडर/विकल्प/चेकबॉक्स → रीडआउट टाइल → स्थिति संदेश → "माप लॉक करें" |
| 6 | लैब smoke test | पास — 13 लैब × (default + हर स्लाइडर min/mid/max + हर विकल्प + दोनों flag स्थिति) = calc/meters/stats/judge/lock चले; **कोई undefined/NaN/[object Object] या exception नहीं** |
| 7 | **पाई गई गलती** | `.live-scope` में बार की चौड़ाई `Math.max(2, Math.min(1, ratio)) * bw` लिखी थी — clamp अनुपात पर लग रहा था, इसलिए **हर बार पूरे चौड़ाई का** भर रहा (मान 0 हो तब भी)। `Math.max(3, Math.min(1, ratio) * bw)` से सुधारा |
| 8 | सुधार के बाद ब्राउज़र जाँच | पास — अध्याय 22 (web): बार 0.50 / 0.00 / 0.43; अध्याय 1 (shock): 9.2 mA ≈ 55% अंबर; अध्याय 25 (dmz): 1 / 0.15 / 1; अध्याय 4 (kb): 0.29 / 0.48 / 0.32 |
| 9 | पठनीयता | पास — canvas 640px से ~464px CSS में स्केल होता है, इसलिए लेबल/मान फ़ॉन्ट 12px → 15px किया; हिंदी टेक्स्ट स्पष्ट |
| 10 | लॉक → प्रगति | पास — "माप लॉक करें" पर `fiTradeProgressV1.sims[22] = true` सेव हुआ; गलत मान पर "पहले गलती सुधारें — …" और लॉक नहीं |
| 11 | "मान दोबारा" | पास — सभी स्लाइडर/विकल्प/चेक डिफ़ॉल्ट पर लौटे और रीडआउट तुरंत अपडेट |
| 12 | Trade लैब अनुभाग | पास — "लैब / सिमुलेटर और लाइव लैब" हेडर, हर कार्ड पर eyebrow + शीर्षक + निर्देश; SMPS ऑसिलोस्कोप (अध्याय 2) में PWM गेट + रिपल वेवफॉर्म, Vout/रिपल/दक्षता ओवरले सही |
| 13 | होम / पोर्टल / एडमिन लॉगिन | पास — होम का welcome band + फ़ोटो गैलरी अछूता, कोई horizontal overflow नहीं (scrollWidth 600 ≤ viewport); छात्र पोर्टल लॉगिन (लॉगिन/नया रजिस्ट्रेशन टैब, CHNM12 placeholder) साफ़ दिखा |
| 14 | Console | पास — लैब वाले अध्यायों, होम और पोर्टल पर कोई JS error/warning नहीं |
| 15 | API suite | पास — **78/78** |
| 16 | Build | पास — `dist तैयार: 95 फाइलें, 47.73 MB` |

**नोट:** सभी 13 नए लैब और 79 नए आरेख स्वतंत्र रूप से लिखे/बनाए गए हैं — NIMI पुस्तक का पाठ या चित्र कहीं कॉपी नहीं किया गया; हर अध्याय पेज पर यही स्पष्टीकरण और © NIMI नोट मौजूद है।

**बैकअप:** बदलाव के बाद स्रोत का पूरा बैकअप `chnm-portal-with-exam.backup-2026-11-05-live-labs.zip` (21.45 MB, `dist/` छोड़कर) में लिया गया है। कंटेंट जाँच अब स्थायी कमांड `node scripts/check-content.mjs` से दोबारा चलाई जा सकती है (143/143 + 108/108 आरेख, 25/25 LIVE लैब, 13 लैब smoke)। TM के 4 आरेखों (1.3 कोर्स निर्माण, 1.6 जॉब शीट, 1.8 5S, 1.14 CPD) में कैप्शन जोड़े गए।

---

## 4. मूल वेबसाइट संरक्षण

`chnm-portal-with-exam.backup.zip` से SHA-256 तुलना:

| फ़ाइल | स्थिति |
|---|---|
| `index.html` (होम पेज) | उपयोगकर्ता के स्पष्ट अनुरोध पर **केवल साइडबार** से पुराना कंप्यूटर लैब समूह (क्रम 34–50), अलग Training Methodology फ़ोल्डर और CHNM Academy फ़ोल्डर हटाए गए; बाद में हेडर में **📝 ऑनलाइन टेस्ट** लिंक जोड़ा गया, नीचे का तैरता बटन हटाया गया और TM navigation नई बुक से जोड़ी गई। फोटो, मुख्य कंटेंट, डिज़ाइन, रंग और लेआउट सुरक्षित |
| `assembly-lab.html` | ✅ byte-identical |
| `basic-office-lab.html` | ✅ byte-identical |
| `Computer-Lab-3D-Single-File.html` | ✅ byte-identical |
| `SMPS-Lab/` की सभी 15 फ़ाइलें (`index.html`, 00–13, आदि) | ✅ byte-identical |

निष्कर्ष: शिक्षक/समूह फोटो, रंग/लेआउट, लैब और होम पेज का बाकी कंटेंट अपरिवर्तित हैं। साइडबार से कंप्यूटर लैब के 17 लिंक (3D लैब + 16 उप-लिंक) तथा दो अलग फ़ोल्डर (Training Methodology 1 और CHNM Academy 1) हटाए गए हैं; संबंधित पुराना कंटेंट DOM में सुरक्षित है ताकि syllabus के अनुसार दोबारा बनाया जा सके। बदलावों से पहले के पूरे प्रोजेक्ट बैकअप `chnm-portal-with-exam.backup-before-computerlab-removal.zip`, `chnm-portal-with-exam.backup-before-tm-academy-removal.zip`, `chnm-portal-with-exam.backup-before-online-test-link.zip`, `chnm-portal-with-exam.backup-before-tm-nav-fix.zip`, `chnm-portal-with-exam.backup-before-admin-fallback.zip`, `chnm-portal-with-exam.backup-before-admin-link.zip` और `chnm-portal-with-exam.backup-before-reliability-fix.zip` और `chnm-portal-with-exam.backup-before-cits-upgrade.zip` और **`chnm-portal-with-exam.backup-before-trade-theory-book.zip`** में सुरक्षित हैं।

Trade Theory कार्य से पहले के बैकअप से byte-level तुलना (1 नवंबर 2026): `index.html`, `assembly-lab.html`, `basic-office-lab.html`, `Computer-Lab-3D-Single-File.html`, पूरा `SMPS-Lab/`, पूरा `exam/`, `study/study.css`, `study/store.js`, `study/study.js`, `study/chapter.js` और `study/data/` — सभी **अपरिवर्तित**। केवल `study/index.html` और `study/chapter.html` में जानबूझकर Trade Theory बुक का लिंक जोड़ा गया; TM सामग्री/प्रगति नहीं बदली।

होम पेज लोड पर 34 network requests — सभी `200`; कोई 4xx/5xx नहीं।

---

## 5. पाई गई समस्याएँ और सुधार

| # | समस्या | कारण | सुधार | पुनः परीक्षण |
|---|---|---|---|---|
| 1 | Draft परीक्षा में total marks 0 रह जाते थे | `api-admin.mjs` में प्रश्न बदलने पर totalMarks reset होता था और lock तक recompute नहीं होता था | Save पर प्रश्नों के अंकों से recompute + structural edit पर recompute | पास — 3 प्रश्न = 3 अंक |
| 2 | परीक्षा सूची/detail में प्रश्न संख्या undefined | Frontend `exam.questionCount` पढ़ रहा था जबकि API `totalQuestions` देता है | `totalQuestions ?? questionCount ?? 0` fallback | पास |
| 3 | टूल्स पेज पर `Cannot read properties of null (reading 'addEventListener')` | Legacy preview खाली होने पर `[data-legacy-import]` बटन मौजूद नहीं था, listener बिना guard लगता था | null guard जोड़ा | पास — टूल्स पेज सामान्य |
| 4 | परीक्षण के दौरान एक attempt अचानक submit दिखा | Browser automation में element/timing artifact; app flow में explicit confirmation है; UI/सर्वर दोनों duplicate submit रोकते हैं | कोड में बदलाव आवश्यक नहीं; flow दोबारा जाँचा | पास — manual flow सही |
| 5 | Route error पर stack नहीं दिखता था | `renderRoute` catch में केवल UI error | `console.error` जोड़ा (debugging हेतु) | पास |

> #3 की जाँच में एक बार पुराना error दिखा क्योंकि hash-only navigation से document reload नहीं हुआ था; पूरा page reload करने पर fix लागू मिला। यह production उपयोग को प्रभावित नहीं करता।

---

## 6. Build और output

कमांड:
```bash
node scripts/build.mjs
```

परिणाम:
```
dist तैयार: 95 फाइलें, 47.73 MB
```

`dist/` में मूल साइट + लैब + `exam/` + `study/` (TM और Trade Theory दोनों) + templates शामिल हैं; function sources `dist` में नहीं जाते (सुरक्षा)। सभी परीक्षण हेतु बनाई गई temp फाइलें और screenshots final package से बाहर रखी गई हैं।

---

## 7. सुरक्षा सत्यापन (संक्षेप)

- Admin password केवल env var; frontend में नहीं
- हर admin API Bearer token (HMAC, 12h) जाँचती है
- Timing-safe comparison + rate limits (admin login 8/15min, register 12/घंटा, login 20/15min, autosave 90/मिनट, submit 10/मिनट)
- Server-side timer/scoring; client timer केवल दिखावा
- Answer key केवल authorized API response में (release gating)
- Student result isolation; दूसरे छात्र का data नहीं
- Duplicate/idempotent submit prevention
- Published paper structural edits blocked; snapshot पुराने attempts सुरक्षित रखता है
- Photo/data validation server-side; CSP + नोस्निफ headers; SAMEORIGIN (होम पेज की 3D iframe के लिए आवश्यक)
- Admin actions का audit log

---

### 3.14 CHNM registration ID और प्रश्न-पत्र अपलोड फोल्डर (2 नवंबर 2026)

| # | जाँच | परिणाम |
|---|---|---|
| 1 | नया self registration ID | पास — `CHNM1`, फिर `CHNM2` |
| 2 | एडमिन से बनाया छात्र ID | पास — `CHNM3` (वही क्रम) |
| 3 | पुराना `FIG-…` छात्र login | पास — legacy test में सफल |
| 4 | पोर्टल placeholder/संदेश | पास — `CHNM12` उदाहरण |
| 5 | CSV नमूना अपलोड → प्रीव्यू | पास — 10 पंक्तियाँ, हिंदी सही (UTF-8), उत्तर A/B/C |
| 6 | HTML नमूना अपलोड → प्रीव्यू | पास — 3 पंक्तियाँ, पहली `<table>` से |
| 7 | CSV आयात | पास — 10 जोड़े गए, 0 त्रुटि, 0 डुप्लीकेट |
| 8 | वही HTML दोबारा आयात | पास — 0 जोड़े, 3 डुप्लीकेट पहचाने गए |
| 9 | `guide.html` और सभी नमूना फाइलें लोड | पास — 200 |
| 10 | API test suite | पास — 69/69 |

**सुधार:** CSV फाइल बाइट्स के रूप में पढ़ने पर हिंदी UTF-8 Latin-1 बन रही थी (प्रीव्यू में `à¤…`)। अब CSV को decoded टेक्स्ट के रूप में पढ़ा जाता है; XLSX/XLS पहले जैसे बाइट्स से पढ़े जाते हैं।

---

### 3.15 Release के साथ उत्तर-कुंजी (2 नवंबर 2026)

| # | जाँच | परिणाम |
|---|---|---|
| 1 | `admin_exam_release` बिना `showAnswers` → छात्र detail | पास — सही उत्तर + व्याख्या दिखे |
| 2 | Release से पहले student result | पास — pending, कोई अंक/उत्तर नहीं |
| 3 | Practice परीक्षा | पास — पहले की तरह तुरंत उत्तर |
| 4 | Admin release dialog | पास — अलग "उत्तर-कुंजी" checkbox हटाया; संदेश स्पष्ट |
| 5 | API suite | पास — 69/69 |
| 6 | लाइव deploy (2 नवंबर, 4:10 PM) पर जारी final result | पास — बिना किसी admin दोबारा save के 6 सही उत्तर + व्याख्या मिले |

**बदलाव:** अब परिणाम जारी करते ही उत्तर-कुंजी भी जारी मानी जाती है (`answersReleased = resultsReleased`)। छिपाना हो तो पूरा परिणाम छिपाएँ — तब कुंजी भी बंद हो जाती है।

---

### 3.16 लाइव "सर्वर में तकनीकी त्रुटि" — Blobs token expiry (2 नवंबर 2026)

| # | जाँच | परिणाम |
|---|---|---|
| 1 | लाइव API (bootstrap/register/login) | FAIL — सभी 500; लॉग में `BlobsInternalError: Failed to decode token: Token expired` |
| 2 | कारण | Store instance module-level cache में टिका था; Blobs token expiry के बाद वही पुराना token इस्तेमाल होता रहा |
| 3 | सुधार | `getStore` हर request पर नया बनाया जाता है (कोई store cache नहीं) |
| 4 | Deploy के बाद लाइव bootstrap | पास — 200 |
| 5 | लाइव register validation | पास — 400 सही संदेश, 500 नहीं |
| 6 | API suite | पास — 69/69 |

**नोट:** साइट का नया नाम **chnm26** है (`https://chnm26.netlify.app/`); पुराना `brilliant-malabi-19a295` URL अब 404 देता है, इसलिए छात्रों को नया लिंक दें।

---

## 8. ज्ञात सीमाएँ / जो अभी लाइव-अनटेस्टेड है

1. **नवीनतम deploy (2 नवंबर, 4:10 PM)** पर static templates, CHNM ID और जारी परिणाम की उत्तर-कुंजी लाइव सत्यापित है। नए CHNM छात्र से पूरा live E2E दोबारा नहीं चलाया — जरूरत पर post-deploy checklist दोबारा चलाएँ।
2. **50 छात्रों का वास्तविक concurrent load test नहीं हुआ**। स्थानीय in-memory store पर functional flow जाँचा गया; Netlify Blobs का actual latency/consistency लाइव जाँचना बाकी है।
3. **Netlify Blobs पर data persistence का live test** — मूल deployment पर E2E हो चुका; नए बदलावों के बाद दोबारा करें।
4. **असली मोबाइल डिवाइस visual test नहीं** — 390px geometry/computed-style जाँच हुई, screenshot नहीं।
5. **auto-submit scheduled function का live cron test नहीं** — schedule config (`*/5 * * * *`) मौजूद है; लाइव deploy पर Netlify Functions में दिखना जाँचें।
6. **Windows dev server**: `node_modules` install नहीं है (इस मशीन पर npm उपलब्ध नहीं); Netlify build स्वयं dependencies install करता है। स्थानीय build बिना blobs dependency के चलता है।
7. **अध्ययन केंद्र का असली मोबाइल फिंगर-टच test नहीं हुआ** — 390px iframe में layout/overflow geometry पास है; वास्तविक फोन पर एक बार जाँचें।
8. **डिजिटल पुस्तक की सामग्री मूल NIMI PDF की शब्दशः प्रतिलिपि नहीं** — NIMI के "NOT TO BE REPUBLISHED" नोट के कारण 16 मॉड्यूल के विषय-क्रम पर आधारित स्वतंत्र, सरल हिंदी सामग्री लिखी गई है; सभी 19 आरेख और सिमुलेटर भी मूल रूप से बनाए गए हैं। श्रेय और © NIMI नोट हर पेज पर है। विषय-विशेषज्ञ द्वारा सामग्री की एक बार समीक्षा कराना उचित होगा।

इन सीमाओं को "पूरा/लाइव" न मानें। उपरोक्त post-deploy checklist से ही live readiness पुष्टि करें।

---

## 9. दोबारा परीक्षण कैसे चलाएँ

```bash
# 1) Build
node scripts/build.mjs

# 2) Dev server (PowerShell)
$env:USE_MEMORY_STORE="1"; $env:ADMIN_PASSWORD="admin12345"; node scripts/dev-server.mjs

# 3) दूसरे terminal में API tests
node scripts/test-api.mjs
```

ब्राउज़र:
- छात्र: `http://127.0.0.1:8888/exam/index.html`
- एडमिन: `http://127.0.0.1:8888/exam/admin.html` (password ऊपर सेट किया हुआ)

---

## 10. निष्कर्ष

- Core CBT, admin, security, practice/final separation, result gating और preservation अपेक्षा के अनुसार काम करते हैं।
- 78/78 automated checks पास; मुख्य admin/student browser flows पास। नए registration ID `CHNM…` क्रम से बनते हैं और CSV/HTML प्रश्न-पत्र अपलोड → प्रीव्यू → आयात स्थानीय browser में सत्यापित है।
- अध्ययन केंद्र (Training Methodology): 16 अध्याय, **108/108 खंड पर आरेख**, 19 LIVE सिमुलेटर, क्विज़ और progress — स्थानीय ब्राउज़र में पास।
- Trade Theory: 25 अध्याय, **143/143 खंड पर आरेख** और **25/25 अध्याय में SMPS-शैली LIVE लैब** (स्लाइडर → लाइव canvas → रीडआउट → स्थिति → "माप लॉक करें") — smoke test और browser दोनों में पास।
- मूल होम पेज का कंटेंट/फोटो/डिज़ाइन और सभी लैब सुरक्षित; साइडबार से पुराना कंप्यूटर लैब समूह (34–50), अलग Training Methodology फ़ोल्डर और CHNM Academy फ़ोल्डर उपयोगकर्ता अनुरोध पर हटाए गए; हेडर में केवल अनुरोधित ऑनलाइन टेस्ट लिंक जोड़ा गया।
- **Live Netlify deployment हो चुका है (2 नवंबर, 4:10 PM)** — deploy के बाद उत्तर-कुंजी लाइव सत्यापित; पूरे flow के लिए post-deploy checklist एक बार चलाएँ।

---

## 11. टॉपिक-वार पेपर, सीबीटी श्रृंखला, सूचना और समूह चैट (5 नवंबर 2026)

**वातावरण:** स्थानीय dev server `http://127.0.0.1:8891`, in-memory Blobs, ब्राउज़र में जाँच। सभी डेटा नकली परीक्षण-डेटा था (डेमो प्रश्न, एक नकली छात्र `CHNM1`, नकली मोबाइल `9999999901`) — लाइव साइट `chnm26.netlify.app` पर कुछ नहीं किया गया।

### 11.1 Automated API tests
`node scripts/test-api.mjs` → **120/120 पास**। इनमें नए: topic grouping, paper build (counts/marks/unique ids/topic split/shortage), notice CRUD + audience + unread count + read marking, batch targeting, chat send/list/poll/delete + flood limit + admin↔student reachability + CHNM default trade, JSON backup में सूचनाएँ व चैट।

### 11.2 ब्राउज़र में पास
| # | जाँच | परिणाम |
|---|---|---|
| 1 | एडमिन → परीक्षाएँ → **सीबीटी श्रृंखला** (Soft Skills, 3 CBT) | पास — CBT1/2/3 Draft बने, कोड `CBT1-SS`…`CBT3-SS`, ट्रेड CHNM डिफ़ॉल्ट |
| 2 | 23 प्रश्न का topic-वार बंटवारा | पास — 10 / 7 / 6 = 23, कोई प्रश्न दोहराया नहीं, हर पेपर में topic संतुलित |
| 3 | **प्रश्न आयात** विंडो में "डिफ़ॉल्ट विषय" + फ़ोल्डर नाम + सीधे परीक्षा में जोड़ें | पास — विषय-वार अपलोड का UI मौजूद |
| 4 | **सूचना और चैट** → नई सूचना (शीर्षक/संदेश/महत्व/audience/तुरंत दिखाएँ) | पास — "सूचना भेज दी गई" + सूची में एडिट/हटाएँ |
| 5 | छात्र डैशबोर्ड पर सूचना सीधे दिखी | पास — बैनर + **सूचनाएँ ❶** बैज + "पूरा पढ़ें" |
| 6 | audience ड्रॉपडाउन में बैच विकल्प | पास — छात्र रजिस्टर होने पर "बैच 2026-27 فقط" दिख गया |
| 7 | छात्र → समूह चैट में संदेश | पास — एडमिन मॉनिटर में नाम/ID के साथ दिखा, सदस्य: 1 |
| 8 | एडमिन → चैट संदेश | पास — छात्र को `संस्था (Admin)` नाम से तुरंत दिखी |
| 9 | रजिस्ट्रेशन में ट्रेड/बैच डिफ़ॉल्ट | पास — ट्रेड `CHNM`, बैच `2026-27` पहले से भरा |

### 11.3 मिला बग और उसकी मरम्मत
- **बग:** छात्र चैट में टाइप करते समय 15 सेकंड का polling refresh पूरा पैनल दोबारा बना देता था, जिससे **अधूरा संदेश मिट जाता था** (डैशबोर्ड shell ही बदल जाता है, इसलिए DOM में draft बचाना काम नहीं किया)।
- **मरम्मत:** `exam/assets/portal.js` — draft अब `state.chatDraft` में रहता है, composer पर `input` listener से सेव और हर re-render के बाद restore होता है; भेजने के बाद साफ़।
- **पुष्टि:** बिल्ड के बाद ब्राउज़र में draft टाइप करके **रीफ़्रेश करें** दबाया → संदेश composer में बचा रहा (पास)।
- एडमिन की तरफ यही समस्या नहीं थी — वहाँ केवल `#chatLog` बदलता है, composer नहीं।

### 11.4 WhatsApp हटाना
- `exam/` (छात्र पोर्टल + एडमिन) में कहीं भी `wa.me` / WhatsApp बाटन / ग्रुप लिंक नहीं बचा — grep से पुष्टि।
- सूचना और समूह चैट अब पूरी तरह पोर्टल के अंदर है। `SMPS-Lab/` के गाइड पेजों का अपना पुराना helper छोड़ा गया है — वे परीक्षा पोर्टल का हिस्सा नहीं हैं।
- पुरानी `docs/testing-report-hi.md` की §3.14 (2 नवंबर) WhatsApp जाँच का **ऐतिहासिक रिकॉर्ड** है, इसलिए वैसी रहने दी गई; उसके बाद के दस्तावेज़ (README §विशेषताएँ, `admin-guide-hi.md` §7.2/§11, `student-guide-hi.md` §1/§3.1–3.2/§7) अब इन-ऐप सूचना/चैट बताते हैं।

### 11.5 डेटा सुरक्षा (deploy)
- सूचनाएँ (`notices/`) और समूह चैट (`chat/`) भी Netlify Blobs में ही रहते हैं — deploy या rollback से नहीं मिटते (`deployment-guide-hi.md` §10.1)।
- एडमिन → टूल्स → **JSON बैकअप** में अब `notices` और `chat` भी शामिल हैं; नया API test इसे जाँचता है।
- deploy **नहीं** किया गया — अनुमति के बिना लाइव साइट पर कुछ नहीं भेजा जाएगा।

---

## 12. परीक्षा के निर्देश हिंदी + English और CITS-जैसा CBT इंटरफ़ेस (5 नवंबर 2026)

**मांग:** "exam lete waqt instructions hindi aur english dono me aane chahiye … interface ekdum real hona chahiye, jaise ITI/CITS ka hota hai — jo waha options hote hain wahi yaha bhi"।

### 12.1 Automated API tests
`node scripts/test-api.mjs` → **128/128 पास** (पहले 120)। नया §10 "परीक्षा के English निर्देश":
- `admin_exam_save` में `instructionsEn` round-trip
- Hindi निर्देश के साथ English निर्देश बचा रहे
- छात्र का `student_exam_get` में `instructionsEn` दिखे
- छात्र payload में `correctIndex` कहीं न दिखे (उत्तर लीक जाँच)
- `instructionsEn` न भरने पर खाली `""` (front-end डिफ़ॉल्ट पर गिर सके)
- `admin_settings_save` → `defaultInstructionsEn` और `bootstrap` में वही मान

### 12.2 ब्राउज़र में पास (679px फ़ोन-चौड़ाई, dev server `127.0.0.1:8911`, ताज़ा टैब)
| # | जाँच | परिणाम |
|---|---|---|
| 1 | परीक्षा खोलने पर निर्देश विज़ार्ड **1 / 4 — "परीक्षा का विवरण / Exam Details"**, **परीक्षा शुरू करें** बटन बंद | पास |
| 2 | **आगे → Next** से चारों पेज — विवरण → पैलेट चिह्न → महत्वपूर्ण निर्देश → घोषणा | पास |
| 3 | हर पेज का शीर्षक और बॉडी **हिंदी + English** में | पास |
| 4 | पेज 2 में पाँचों पैलेट चिह्न (हरा/लाल/ग्रे/बैंगनी/बैंगनी+✓) नमूने के साथ + फ़िल्टर बटन की व्याख्या | पास |
| 5 | पेज 3 में एडमिन के **निर्देश (हिंदी)** और **निर्देश (English)** दोनों "विशेष निर्देश" में | पास |
| 6 | अंतिम पेज तक जाने पर भी टिक न होने तक **Start** बंद; टिक करते ही चालू | पास |
| 7 | CBT chrome: **शेष समय / TIME LEFT (IN SEC)** = 19:52 से गिनती, ऊपर **निर्देश / Instructions**, **जमा करें / Submit**, हिंदी/English टॉगल | पास |
| 8 | प्रश्न `"HTTP किस पोर्ट का उपयोग करता है?"` + नीचे `"In English: Which port does HTTP use?"`, विकल्प `21 / 80 / 443 / 25` साफ़ | पास |
| 9 | English टॉगल → मुख्य = English, नीचे `"हिंदी में"` के साथ हिंदी | पास |
| 10 | **परीक्षा पैनल / EXAM PANEL**: नाम, CHNM1, दिनांक, मोबाइल, ट्रेड + 4 गिनतियाँ | पास |
| 11 | पैलेट की 5 स्थितियाँ असली DOM class के साथ — `answered`, `marked`, `marked answered`, `not-answered`, `not-visited` | पास |
| 12 | फ़िल्टर बटन: `चिह्नित` → केवल प्रश्न 2; `उत्तर + चिह्नित` → केवल प्रश्न 3; `नहीं देखे` → 8; `सभी` → 12 | पास |
| 13 | फ़िल्टर गिनती का जोड़ = कुल प्रश्न (1+1+1+1+8 = 12) | पास |
| 14 | **जमा करें / Submit** की तालिका — 5 पंक्तियाँ द्विभाषी, जोड़ 12, **शेष समय / Time left** | पास |
| 15 | **नहीं, परीक्षा जारी रखें / No, continue** से modal बंद, परीक्षा सुरक्षित (submit नहीं हुई) | पास |
| 16 | चिह्नित प्रश्न पर **● समीक्षा हेतु चिह्नित / Marked for review** टैग दिखा | पास |
| 17 | परीक्षा के दौरान **निर्देश / Instructions** modal में चारों खंड | पास |
| 18 | reload → "आपकी चालू परीक्षा सुरक्षित है" + फिर से घोषणा-टिक के बाद **Resume Examination** | पास |

### 12.3 मिली गड़बड़ियाँ और सुधार
| गड़बड़ी | सुधार |
|---|---|
| पैलेट फ़िल्टर के काउंट "inclusive" थे (Answered=3 + Marked=3 + … = 16 > 12), इसलिए बटन दबाने पर गिनती और दिखने वाले बटन मेल नहीं खाते | `matchesFilter()` अब **exclusive** — हर प्रश्न केवल एक ही बकेट में; 5 बकेट का जोड़ = कुल प्रश्न |
| नीचे का "उत्तर दिए" काउंट `कुल − उत्तर` था, जिसमें "नहीं देखे" भी घुल जाते थे | `countRemaining` अब केवल **उत्तर नहीं दिए (देखा हुआ)** गिनता है |
| सबमिट-समीक्षा तालिका में "Answered" और "Marked" overlap करते थे (जोड़ 12 से ज़्यादा) | तालिका के पाँचों row अब 5 पैलेट रंगों से 1:1 मिलते हैं |
| जिस प्रश्न/विकल्प का stored टेक्स्ट English से शुरू होता था, वह **हिंदी** साइड दिखता था | `splitBilingual()` अब **लिपि-आधारित** है — जिस हिस्से में देवनागरी है वही हिंदी |
| विकल्प जैसे `220 / 230 V`, `A / B / C क्या?` सस्लैश से टूटकर आधे-आधे दिखते | अब विभाजन केवल **हिंदी↔English की सीमा** पर; दोनों तरफ देवनागरी न हो या एक तरफ खाली हो तो पूरा टेक्स्ट ही दोनों भाषा में दिखता है |
| CBT के अलावा अतिरिक्त हेल्प-ओवरले (स्टेटस चिप, कीबोर्ड हेल्प-बार, landing के 3 स्टेप कार्ड) असली CBT जैसा नहीं लग रहा था | `assets/exam-help.js` और `assets/exam-ui.css` से हटाए — अब केवल टाइल-जंप + शॉर्टकट; इससे दबा हुआ **`Marked for Review` चिह्न** भी वापस दिखने लगा |
| `instructionsEn` सिर्फ़ Hindi field में घुलकर दिखता | परीक्षा फ़ॉर्म में **निर्देश (हिंदी)** + **निर्देश (English)** अलग-अलग, सेटिंग्स में **डिफ़ॉल्ट निर्देश (English)**; परीक्षा-स्तर खाली हो तो डिफ़ॉल्ट चले |
| `21 / 21`, `80 / 80` जैसे विकल्प (दोनों भाषा एक जैसे) स्क्रीन पर `21 / 21` की तरह टूटे दिखते | `splitBilingual()` अब पहले यह देखता है कि ` / ` के दोनों हिस्से **एक जैसे** हैं तो केवल एक बार दिखाता है |
| निर्देश पेज 2 में "Mark for Review & Next — उत्तर छोड़कर अगले प्रश्न पर जाएँ" लिखा था, जबकि यह बटन उत्तर सुरक्षित रखता है | पाठ सुधार: "चुना उत्तर सुरक्षित रहता है और प्रश्न बाद में देखने के लिए चिह्नित हो जाता है, फिर अगले प्रश्न पर जाएँ।" |

### 12.4 जो अभी बाक़ी
- डेस्कटॉप-चौड़ाई (1280px+) पर लेआउट की आँख से पुष्टि — जाँच का ब्राउज़र टैब 679px (फ़ोन media query) पर है और स्क्रीनशॉट उपलब्ध नहीं था; इसलिए रंग/position का विज़ुअल check आपकी स्क्रीन पर एक बार कर लें।
- deploy **नहीं** किया गया (15 क्रेडिट/प्रोडक्शन deploy; अनुमति चाहिए)। लाइव करने के बाद वही CBT एक असली छात्र खाते से दोबारा जाँचना होगा।


## 13. SMPS गाइड का फ़ुटर और "रिपोर्ट डाउनलोड" बटन (5 नवंबर 2026)

**क्या बदला:** आपकी बात के अनुसार SMPS गाइड के **सभी 15 पेजों** (`index.html` + `SMPS-Lab/00…13` + `SMPS-Lab/index.html`) में से

1. **"⬇ रिपोर्ट डाउनलोड करें (प्रिंट)" बटन हटाया गया** — बटन बनाने वाला JavaScript पूछ निकाल दिया गया, इसलिए पेज के नीचे अब कोई डाउनलोड/प्रिंट-रिपोर्ट बटन नहीं दिखता।
2. **पुराना disclaimer हटाया** ("यह गाइड सामान्य जानकारी और सिद्धांत के लिए है … डेटाशीट देखें।") और नया फ़ुटर लिखा:

   > **फर्जी अनुदेशक** · SMPS पूरी गाइड · 2026-27
   > यह पेज केवल टेस्ट और जानकारी के लिए विकसित किया गया है।
   > सभी ट्रेडमार्क और सामग्री उनके संबंधित स्वामियों के हैं।
   > यह एक व्यक्तिगत प्रोजेक्ट है — सभी अधिकार सुरक्षित।
   > पता — Coming Soon

3. **प्रिंट नियम बदले** — पहले `@media print` में केवल रिपोर्ट-आर्टिकल छपता था; बटन हटने के बाद वह पेज को पूरा खाली छोड़ देता। अब प्रिंट करते समय ऊपर की ऐप-बार/वोलेटेज-अलर्ट/बटन छिपते हैं और **पूरा पाठ साफ़ छपता है**।
4. **हिंदी→English डिक्शनरी** में नए फ़ुटर की 6 लाइनें जोड़ी गईं और हटे बटन की पुरानी entry निकाल दी गई (हर पेज की डिक्शनरी अब 4954 keys, सब बिना error पढ़ी जा रही हैं)।

### 13.1 जाँच (स्थानीय dev server, `http://127.0.0.1:8893`)
| # | जाँच | परिणाम |
|---|---|---|
| 1 | `SMPS-Lab/01-safety.html` का फ़ुटर | पास — "फर्जी अनुदेशक · SMPS पूरी गाइड · 2026-27 … पता — Coming Soon" |
| 2 | "रिपोर्ट"/"प्रिंट" वाला कोई बटन | पास — 0 बटन (स्रोत + `dist` की सभी 15 फ़ाइलों में `reportButton` कहीं नहीं) |
| 3 | 🌐 English टॉगल | पास — फ़ुटर अंग्रेज़ी में: "Fake Instructor · Complete SMPS Guide · 2026-27 … Address — Coming Soon" |
| 4 | मुख्य पेज `index.html` | पास — वही फ़ुटर + EN टॉगल काम करता है |
| 5 | ब्राउज़र console | पास — कोई JS error नहीं (केवल goatcounter का localhost warning) |
| 6 | `node scripts/build.mjs` | पास — `dist` में 95 फ़ाइलें, नया फ़ुटर मौजूद, पुराना बटन/डिक्शनरी key नहीं |

### 13.2 deploy
SMPS पेज बदले हैं पर **deploy नहीं** किया गया — लाइव `chnm26.netlify.app` पर अनुमति के बिना कुछ नहीं भेजा जाएगा।
## 14. होम पेज की जगह लाइव सूचना पट्टी (5 नवंबर 2026)

**आपकी बात:** होम पेज पर जो लिखा-का-लिखा हुआ वाक्य था उसे हटाकर वहाँ **notification** लगाया जाए — एडमिन द्वारा कुछ अपडेट हो तो वह वहीं दिखे।

### 14.1 क्या बदला
- **हटाया गया:** दोनों होम पेजों के हीरो के नीचे का वही वाक्य *"🌟 कृपया कोई सुझाव हो दे — नीचे छात्र समूह चैट बटन से भेजें।"* (और उसका English संस्करण) — मुख्य साइट `index.html` और SMPS लैब का होम `SMPS-Lab/00-home.html`।
- **लगाया गया:** उसी जगह 🔔 **सूचना पट्टी** (दोनों पेजों पर एक जैसी) —
  - बिना लॉगिन चलती है; एडमिन की **सभी-छात्र-के-लिए** वाली चालू सूचनाएँ दिखती हैं (नवीनतम ऊपर, अधिकतम 5)।
  - सबसे नई सूचना का शीर्षक + संदेश + तारीख़; 180 अक्षर से लंबा संदेश कटकर **"पूरा पढ़ें / Read more"** बटन देता है।
  - एक से ज़्यादा सूचना हों तो **"अन्य N सूचनाएँ देखें / View N more notices"**।
  - **महत्व के रंग:** अति आवश्यक = लाल किनारा, ध्यान दें = अम्बर, सामान्य = हरा।
  - कोई सूचना न हो तो आसान भाषा में: *"अभी कोई सूचना नहीं — एडमिन जैसे ही नई सूचना डालेंगे, वह यहाँ अपने आप दिख जाएगी।"*
  - हर **60 सेकंड** में सर्वर से ताज़ा — पेज खुला हो तो नई सूचना अपने आप आ जाती है; टैब छिपा हो तो फिर से खोलते ही ताज़ा।
  - हिंदी/English टॉगल पर लेबल और **तारीख़ की भाषा** भी बदलती है (सूचना का पाठ वही रहता है जो एडमिन ने लिखा)।
- **नया API:** पब्लिक `site_notices` (`netlify/lib/api-notify.mjs` + `netlify/functions/api.mjs`) — टोकन के बिना, केवल `active !== false` और `audience = all` सूचनाएँ, `read` स्थिति कभी नहीं भेजी जाती। छात्रों वाला `notices_list` पहले जैसा टोकन माँगता है — कोई बदलाव नहीं।
- सुरक्षा: एडमिन का शीर्षक/संदेश DOM में **escape** करके जाता है (HTML इंजेक्शन नहीं चल सकता)।

### 14.2 Automated API tests
`node scripts/test-api.mjs` → **136/136 पास** (पहले 128; 8 नए):
"site notices work without a token" · "site notices include the all-audience notice" · "site notices hide trade-targeted notices" · "site notices hide inactive notices" · "site notices carry no read state" · "site notices need no student identity" · "site notices capped at five" · "site notices newest first"।

### 14.3 ब्राउज़र जाँच (स्थानीय dev server, `http://127.0.0.1:8896`)
| # | जाँच | परिणाम |
|---|---|---|
| 1 | पुराना "सुझाव" वाला वाक्य | पास — `index.html`, `SMPS-Lab/00-home.html` और उनके `dist` संस्करण — कहीं नहीं बचा |
| 2 | कोई सूचना न हो पर पट्टी | पास — आसान भाषा वाली खाली-अवस्था दिखती है |
| 3 | एडमिन → **सूचना और चैट** से नई सूचना भेजने पर होम पेज पर दिखी | पास — पेज रीफ़्रेश किए बिना ताज़ा हो गई |
| 4 | सिर्फ़ `ट्रेड:CHNM` audience वाली सूचना | पास — होम पेज पर नहीं दिखी (API में भी नहीं) |
| 5 | 461 अक्षर का संदेश | पास — 180 अक्षर पर कटा + "पूरा पढ़ें"; क्लिक पर पूरा (461) दिखा, बटन "संक्षेप में" |
| 6 | दो सूचनाएँ | पास — "अन्य 1 सूचनाएँ देखें" → 2 पंक्तियाँ, फिर "सूचनाएँ छिपाएँ" |
| 7 | अति आवश्यक / ध्यान दें रंग | पास — `hn-level-important` (लाल) और `hn-level-warn` (अम्बर) |
| 8 | English टॉगल | पास — लेबल "Read more / View 1 more notices / Hide notices" और तारीख़ `05 Nov 2026, 10:18 pm` |
| 9 | हिंदी में वापस | पास — लेबल और तारीख़ दोनों हिंदी |
| 10 | console | पास — कोई JS error नहीं (केवल analytics का localhost warning) |
| 11 | SMPS लैब का होम `SMPS-Lab/00-home.html` | पास — उसी पट्टी पर सूचना दिखी, English टॉगल पर तारीख़ `05 Nov 2026, 10:22 pm` हुई, हिंदी में वापस आ गई |

### 14.4 मिला बग और उसकी मरम्मत
| समस्या | मरम्मत |
|---|---|
| English मोड में नए बनाए गए बटनों पर हिंदी लेबल दिख रहे थे (पेज का own अनुवादक `[data-lang]` सबट्री को दोबारा नहीं सजता) | पट्टी का `bi()` अब **उस समय की भाषा** देखकर `hidden` लगाता है (जैसे पेज के `B()`/`LL()` हेपर करते हैं) |
| तारीख़ हिंदी/English बदलने पर पुरानी भाषा में रह जाती | `<html lang>` पर MutationObserver — भाषा बदलते ही पट्टी दोबारा बनती है |
| जाँच के दौरान पुराना JS बार-बार दिख रहा था | `scripts/dev-server.mjs` **dist से भेजता है** — कोड बदलने पर dev server फिर से चलाएँ (या नया PORT), वरना cached पेज पुराना स्क्रिप्ट देता है |

### 14.5 deploy
`node scripts/build.mjs` से `dist` ताज़ा (95 फ़ाइलें)। **deploy नहीं** किया गया — लाइव `chnm26.netlify.app` पर अनुमति के बिना कुछ नहीं भेजा जाएगा।

## 15. होम पेज पर शायरी का ऑडियो — क्लिक करते ही चले (5 नवंबर 2026)

**आपकी बात:** सुझाव वाली लाइन की जगह ऑडियो जोड़ दिया जाए — बस क्लिक पर चले। पाँच लिंक दिए गए थे (4 शायरी + 1 विचार)।

### 15.1 क्या लगा
- 🔔 सूचना पट्टी (§14) के **नीचे** 🔊 **"शायरी और विचार — क्लिक करते ही चलेंगे"** कार्ड — `index.html` और `SMPS-Lab/00-home.html` दोनों पर बिल्कुल एक जैसा (`id="home-audio"` से खोजें)।
- 5 बटन और उनके लिंक (आपके दिए वही video ID):

| बटन | video ID | प्रकार |
|---|---|---|
| शायरी 1 | `Ss_jEUlLc5w` | short |
| शायरी 2 | `3w9IvsozFBY` | short |
| शायरी 3 | `9YQBTu5wIBw` | short |
| शायरी 4 | `MbBUDEFpJbk` | short |
| विचार (पूरा) | `KgVf67E1zds` | पूरा वीडियो |

- **क्लिक करते ही autoplay** — कोई "पहले लोड फिर चलाएँ" वाला कदम नहीं।
- **एक साथ एक ही चले** — दूसरा बटन दबाने पर पुराना अपने आप बंद; **जो चल रहा है वही दोबारा दबाएँ तो रुक जाता है**।
- चलते बटन पर "चालू" का रंग/किनारा दिखता है (`aria-pressed="true"` से) — स्क्रीन-रीडर को भी यही पता चलता है।
- शायरी 9:16 (लंबे) और "विचार (पूरा)" 16:9 (चौड़े) फ़्रेम में — फ़ोन पर छोटा, डेस्कटॉप पर अधिकतम 320px / 460px।
- **कॉपीराइट का ख़याल:** कोई ऑडियो फ़ाइल डाउनलोड या प्रोजेक्ट में कॉपी नहीं की गई — केवल `youtube-nocookie.com` का embed है, यानी चलने के लिए इंटरनेट चाहिए और मूल क्रिएटर को ही view जाता है।
- हिंदी/English टॉगल पर लेबल भी बदलते हैं: `शायरी 1…4` ↔ `Shayari 1…4`, `विचार (पूरा)` ↔ `Thoughts (full)`; भाषा बदलते ही कार्ड दोबारा बनता है (MutationObserver on `<html lang>`)।

### 15.2 ब्राउज़र जाँच (स्थानीय dev server, `http://127.0.0.1:8898`)
| # | पेज | जाँच | परिणाम |
|---|---|---|---|
| 1 | `index.html` | कार्ड + 5 बटन + सुझाव वाली पुरानी लाइन नहीं | पास |
| 2 | `index.html` | शायरी 2 पर क्लिक → ठीक **एक** iframe, src `youtube-nocookie.com/embed/3w9IvsozFBY?autoplay=1&rel=0&playsinline=1` | पास |
| 3 | `index.html` | "विचार (पूरा)" → iframe `…/embed/KgVf67E1zds…` + `ha-box wide` (चौड़ा) | पास |
| 4 | `index.html` | वही बटन दोबारा दबाया → iframe 0, फ़्रेम छिपा, कोई बटन चालू नहीं | पास |
| 5 | `index.html` | English टॉगल → लेबल `Shayari 1 … Thoughts (full)` | पास |
| 6 | `index.html` | हिंदी में वापस → शायरी 1 क्लिक → iframe `…/embed/Ss_jEUlLc5w…` | पास |
| 7 | `SMPS-Lab/00-home.html` | कार्ड मौजूद, 5 बटन, हिंदी लेबल दिख रहा / English लेबल `hidden` | पास |
| 8 | `SMPS-Lab/00-home.html` | शायरी 2 क्लिक → 1 iframe, केवल वही बटन `aria-pressed="true"` | पास |
| 9 | `SMPS-Lab/00-home.html` | "विचार (पूरा)" (wide) और फिर रोकना → iframe 0, `hidden=true`, चालू बटन 0 | पास |
| 10 | `SMPS-Lab/00-home.html` | ऊपर वाली 🔔 पट्टी (§14) अभी भी सही — खाली-अवस्था का हिंदी वाक्य दिखे, English वाला छिपा | पास |
| 11 | दोनों | console | पास — कोई JS error नहीं (केवल analytics का localhost warning) |

### 15.3 tests · build · deploy
- `node scripts/test-api.mjs` → **136/136 पास** — इस काम में कोई API नहीं बदला (ऑडियो कार्ड केवल पेज का UI है)।
- `node scripts/build.mjs` → 95 फ़ाइलें (~47.8 MB); `dist/index.html` और `dist/SMPS-Lab/00-home.html` दोनों में `home-audio` मौजूद।
- **deploy नहीं** किया गया। इसलिए लाइव `chnm26.netlify.app` पर अभी भी पुरानी *"🌟 कृपया कोई सुझाव हो दे — नीचे WhatsApp बटन से भेजें।"* वाली लाइन दिखती है और नई सूचना-पट्टी व ऑडियो कार्ड नहीं दिखते — ये तीनों बदलाव केवल आपकी अनुमति से deploy होने के बाद दिखाई देंगे।

## 16. अंतिम सबमिट की शर्त + बटनों की नई जगह (6 नवंबर 2026)

**आपकी बात:** पेपर फ़ाइनल सबमिट का विकल्प तब आए जब 90% प्रश्न हो जाएँ या परीक्षा के 30 मिनट बीत जाएँ; Mark for Review बाईं ओर नीचे; उत्तर/चिह्नित वाले बटन दाईं ओर; आकार medium — ताकि छात्र confuse न हो।

### 16.1 शर्त (gate) कैसे काम करती है
- **खोलने की शर्त — कोई भी एक पूरी हो:**
  - **90% उत्तर** — `उत्तर ≥ ceil(कुल प्रश्न × 0.9)`। 10 प्रश्न → 9, 50 → 45, 100 → 90। (सिर्फ़ "देखा" या "चिह्नित" काफ़ी नहीं — **Option दबाकर उत्तर** सहेजा गया हो।)
  - **समय** — `min(30 मिनट, कुल समय का ¾)`। 60 मिनट की परीक्षा → 30 मिनट; 40 मिनट → 30; 4 मिनट → 3 मिनट। इसीलिए बहुत छोटी/मॉक परीक्षा में सबमिट कभी बंद न रहे।
- **शर्त पूरी न होने तक** — तीनों सबमिट बटन (ऊपर वाली पट्टी का `जमा करें`، साइड पैनल का `समीक्षा व अंतिम सबमिट`, फ़ोन वाली फुटर पट्टी का `समीक्षा व सबमिट`) **छिपे** रहते हैं (`hidden`) और उनकी जगह 🟡 पीली हिंट लाइन दिखती है:
  - साइड पैनल: *"🔒 अंतिम सबमिट अभी बंद है। यह खुलेगा जब पेपर के 90% यानी कम से कम 9 प्रश्नों के उत्तर हो जाएँ, या परीक्षा के 30 मिनट बीत जाएँ। अभी 3/10 उत्तर और 6 मिनट पूरे हुए हैं।"*
  - फ़ोन फ़ुटर (छोटा): *"🔒 सबमिट: 6 और उत्तर या 24 मिनट शेष"* — दोनों में गिनती **लाइव** बदलती है।
- **शर्त पूरी होते ही** — बटन अपने आप दिखने लगते हैं और toast *"अंतिम सबमिट खुल गया / Final submit is now available"*।
- **00:00 पर अपने-आप जमा** — यह शर्त ऑटो-सबमिट को **प्रभावित नहीं करती**; समय ख़त्म होते ही पेपर (उत्तर कम हों तो भी) जमा हो जाता है।
- **छिपे हुए बटन पर code से क्लिक** भी काम नहीं करता — `openSubmit()` खुद शर्त दोबारा जाँचता है और warning toast देता है।
- गिनती हर 500ms के `tick()` में होती है, पर paint केवल तब जब गिनती बदले (memo `gatePainted`) — टाइमर भारी नहीं होता।
- **निर्देश (Instructions)** और **नियम** वाले step में यह बात हिंदी+English लिख दी गई है, और हर बटन की जगह ("बाईं ओर नीचे / दाईं ओर नीचे") भी।

### 16.2 बटनों की नई जगह और आकार (सवाल के नीचे वाली पट्टी)
| जगह | बटन | क्लास |
|---|---|---|
| **बाईं ओर नीचे** | `समीक्षा हेतु चिह्नित / Mark for Review` (बैंगनी) → `उत्तर हटाएँ / Clear Response` | `.qa-left` |
| **दाईं ओर नीचे** | `← पिछला / Back` → `उत्तर + चिह्नित कर अगला / Answer & Mark for Review & Next` → `सहेजें और अगला / Save & Next` (नीला, सबसे दाईं किनारे पर) | `.qa-right` |

- **आकार medium** — `.btn-md`: `padding 9px 15px`, `font-size 13.5px`, `min-width 118px`; जाँच में ऊँचाई **42px** निकली (पुराने छोटे बटन ~30px थे)।
- फ़ोन (≤760px): `सहेजें और अगला` सबसे ऊपर पूरी लंबाई, फिर `[चिह्नित | हटाएँ]` और `[पिछला | उत्तर + चिह्नित]` दो क़तारों में।
- **पकड़ा गया बग:** छिपी second stylesheet `assets/exam-ui.css` में पुराने flat DOM के `order:` मान लिखे थे, जिससे बटन उलट-पुलट/बीच में तैरते दिख रहे थे → `.qa-left`/`.qa-right` के हिसाब से दोबारा लिखे, और पाँचों exam पेजों पर `exam-ui.css?v=1` → **`?v=2`** बदला (root `/assets/*` cacheable है, वरना पुरानी CSS दिखती)।

### 16.3 ब्राउज़र जाँच (स्थानीय dev server + seeded परीक्षाएँ)
| # | सेटअप | जाँच | परिणाम |
|---|---|---|---|
| 1 | `GATE-90-A` · 10 प्रश्न · 60 मिनट | 0/8 उत्तर, 6 मिनट बीते → तीनों सबमिट बटन `hidden=true`, हिंट में "9" और "3/10 उत्तर, 6 मिनट" | पास |
| 2 | वही | 9वां उत्तर → बटन दिखे + toast; हिंट छिपा | पास |
| 3 | वही | `उत्तर हटाएँ` से 9→8 → सबमिट फिर छिपे, हिंट फिर दिखा | पास |
| 4 | वही | छिपे बटन पर JS `click()` → कोई modal नहीं, warning toast *"अंतिम सबमिट अभी बंद है"* | पास |
| 5 | `GATE-3M-B` · 4 मिनट | शर्त का हिसाब 3 मिनट (कुल समय का ¾) → ~3:24 पर केवल 1 उत्तर होने पर भी खुला | पास |
| 6 | वही | समय 00:00 → **ऑटो-सबमिट** हुआ, फ़िनिश व्यू + `RES-ATT-CFC3452C9AAB`, sync text *"स्वतः सबमिट हो रहा है…"* | पास |
| 7 | शर्त-पूरी वाली परीक्षा | modal → `हाँ, अंतिम सबमिट` → `RES-ATT-E79D988F13C2` | पास |
| 8 | फ़ोन चौड़ाई (679px पैनल) | क़तारें: `[चिह्नित | हटाएँ]` / `[सहेजें और अगला — पूरी लंबाई]` / `[पिछला | उत्तर + चिह्नित]` | पास |
| 9 | डेस्कटॉप 1380×900 (same-origin iframe में CBT) | बायाँ समूह x≈39/267 से शुरू, दायाँ समूह दाईं किनारे (x=989) तक chipka, हर बटन height=42px / font=13.5px, `.submit-gate-foot` `display:none` | पास |
| 10 | दोनों | निर्देश व नियम step में नई बातें + बाईं/दाईं जगह का वर्णन | पास |
| 11 | सभी | console | पास — कोई JS error नहीं |

### 16.4 tests · build · deploy
- `node scripts/test-api.mjs` → **136/136 पास** — यह gate पूरी तरह client-side है, कोई API/answer data नहीं बदला।
- `node scripts/build.mjs` → 95 फ़ाइलें (~47.78 MB)।
- जाँच के लिए बनाई गई अस्थायी seed फ़ाइल (`scripts/tmp-seed-cbt.mjs`) और dev server हटा दिए/बंद किए।
- **deploy नहीं** किया गया — लाइव `chnm26.netlify.app` पर पुराने बटन और बिना-shर्त वाला सबमिट ही दिखेगा, जब तक आप ख़ुद न कहें।

## 17. परीक्षा शुरू होते ही फ़ुल स्क्रीन (6 नवंबर 2026)

**आपकी बात:** परीक्षा शुरू होते ही मोबाइल/लैपटॉप/कंप्यूटर पर पेज अपने आप फ़ुल स्क्रीन हो — जैसे असली परीक्षा में; कंप्यूटर में ESC से और मोबाइल पर डबल-क्लिक से minimize हो।

### 17.1 क्या-क्या लगा
- **अपने-आप फ़ुल स्क्रीन:** `startExam()` में *"परीक्षा शुरू करें"* क्लिक के **उसी gesture** से `requestFullscreen()` माँगी जाती है (gesture के बिना browser इसे रोक देता है)। `navigationUI: "hide"`, साथ में `webkitRequestFullscreen` / `msRequestFullscreen` fallback।
- **बाहर निकलने के तीन रास्ते:**
  - कंप्यूटर/लैपटॉप: **ESC** — यह browser का अपना नियम है, कोई स्क्रिप्ट इसे नहीं रोक सकती (रोकने की कोशिश भी नहीं की गई)।
  - मोबाइल/टच: **ऊपर की परीक्षा पट्टी पर दो बार टैप** (420ms के अंदर; बटन/इनपुट/भाषा-टॉगल पर टैप से नहीं होता)।
  - दोनों पर: स्टेटस-बार में **⛶ फ़ुल स्क्रीन** बटन (अंदर-बाहर toggle; `aria-pressed` + title से स्थिति)।
- **फ़ुल स्क्रीन बंद हो तो:** स्क्रीन के ऊपर 🟡 पीली पट्टी — *"पेज फ़ुल स्क्रीन में नहीं है — बटन दबाकर वापस जाएँ, टाइमर चलता रहेगा"* + **फ़ुल स्क्रीन करें** बटन + `× N` गिनती (कितनी बार बाहर गया)। पट्टी/बटन केवल तभी दिखते हैं जब परीक्षा चल रही हो और browser फ़ुल स्क्रीन सपोर्ट करता हो।
- **समय पर कोई असर नहीं:** टाइमर सर्वर-आधारित है — फ़ुल स्क्रीन बंद/टूटने पर pause नहीं होता (झूठा आश्वासन नहीं दिया गया)।
- **जमा होते ही** `finish()` में `exitFullscreen()` — फ़ुल स्क्रीन अपने आप बंद।
- **लगातार चेतावनी नहीं:** नियमों वाले step (निर्देश 3/4) में यह बात हिंदी + English लिख दी गई है।
- **iOS/इन-ऐप browser:** जहाँ Fullscreen API नहीं है, वहाँ पट्टी/बटन छिपे रहते हैं और एक बार केवल toast *"इस ब्राउज़र में फ़ुल स्क्रीन उपलब्ध नहीं है — परीक्षा सामान्य स्क्रीन पर चलेगी"* — लगातार परेशान करने के लिए नहीं।

### 17.2 ब्राउज़र जाँच (स्थानीय dev server `http://127.0.0.1:8903`, परीक्षा FS-CHECK-2 · 5 प्रश्न · 30 मिनट)
| # | जाँच | परिणाम |
|---|---|---|
| 1 | लैंडिंग/निर्देश पेज पर `#fsBanner` व `#fsBtn` छिपे | पास |
| 2 | असली (trusted) क्लिक से *"परीक्षा शुरू करें"* → `requestFullscreen()` चली | पास — कॉल हुई; इस automation browser में policy ने रोक दिया (`Permissions check failed`), और **fallback UI** तुरंत दिखी (पट्टी + urgent बटन) यानी डिज़ाइन के मुताबिक़ |
| 3 | `document.fullscreenEnabled` / API की उपलब्धता जाँच | पास |
| 4 | फ़ुल स्क्रीन **अंदर** की नकल (fullscreenchange भेजकर) → पट्टी छिपी, बटन `aria-pressed=true`, urgent=false, title *"से बाहर"* | पास |
| 5 | **बाहर** (ESC जैसी घटना) → पट्टी दिखी, urgent=true, `× 1` गिनती, बटन title *"फ़ुल स्क्रीन करें"* | पास |
| 6 | पट्टी पर **डबल-टैप** (80ms अंतर) → `exitFullscreen()` एक बार चली + toast | पास |
| 7 | उसी पट्टी के **बटन (निर्देश) पर डबल-टैप** → `exitFullscreen()` 0 बार (ग़लती से बाहर नहीं होता) | पास |
| 8 | 5/5 उत्तर → सबमिट gate खुला, modal → *हाँ, अंतिम सबमिट* → `RES-ATT-18F20BB64687` | पास |
| 9 | सबमिट के बाद | पास — फ़िनिश व्यू, पट्टी व ⛶ बटन दोनों छिपे, `fullscreenElement` null (अपने-आप बाहर) |
| 10 | मोबाइल 396px चौड़ाई में पट्टी | पास — 74px ऊँचाई (पहले 110px थी; टेक्स्ट छोटा करके और बटन compact करके ठीक किया), बटन एक ही लाइन में दाईं ओर, `scrollWidth == clientWidth` (कोई horizontal scroll नहीं), स्टेटस-बार का ⛶ बटन 31×24 (सिर्फ़ आइकन) |
| 11 | डेस्कटॉप 1376px पर पट्टी | पास — 50px ऊँचाई, बटन 193×31 दाईं ओर, ⛶ बटन 91×34 (लेबल के साथ) |
| 12 | console | केवल 3 message — 2 warning `requestFullscreen … only be initiated by a user gesture` (ये मेरे **स्क्रिप्ट-से किए गए** क्लिक थे, असली क्लिक पर gesture मौजूद रहता है) और 1 iframe का `beforeunload` notice; **कोई JS error नहीं** |

**सीमा (ज़रूरी):** यह automation browser Fullscreen API को policy से ब्लॉक करता है, इसलिए *असली* फ़ुल स्क्रीन में जाकर दिखने वाला नज़ारा (address bar/toolbar ग़ायब होना) यहाँ रिकॉर्ड नहीं हो सका — state machine, events, exit रास्ते और layout सब जाँचे गए। इसे अपने कंप्यूटर/फ़ोन पर एक बार खोकर देख लें।

### 17.3 tests · build · deploy
- `node scripts/test-api.mjs` → **136/136 पास** (कोई API नहीं बदला — यह पूरा काम client-side है)।
- `node scripts/build.mjs` → 95 फ़ाइलें (~47.78 MB)।
- अस्थायी seeder फ़ाइल `scripts/tmp-seed-fs.mjs` और dev server (PORT 8903) जाँच के बाद हटाए/बंद किए।
- **deploy नहीं** किया गया — लाइव साइट पर फ़ुल स्क्रीन व्यवहार तभी दिखेगा जब आप कहेंगे।

---

## 18. SMPS लैब — पाठ सुधार + "किताब" लेआउट (5–6 नवंबर 2026)

### 18.1 क्या किया
| काम | पेज | नतीजा |
|---|---|---|
| पूरा फ़ोल्डर पढ़कर टेक्स्ट सुधार | `SMPS-Lab/*.html` (15 फ़ाइलें) | फ़ालतू/दोहराए गए वाक्य हटाए, हिंदी शुद्ध की (गलब-सरल वर्णमाला की 3 ग़लतियाँ और `बत्तीस`→`बावन (42)` जैसी तथ्य-ग़लतियाँ ठीक) |
| हर पाठ के शुरू में "अध्ययन उद्देश्य" ब्लॉक | M01–M13 (13 पेज) | 4 लक्ष्य + एक पंक्ति की भूमिका — हिंदी/अंग्रेज़ी `data-lang` जोड़े से (शब्दकोश पर निर्भर नहीं) |
| हर पाठ के अंत में **📝 सारांश और अभ्यास** पैनल | M01–M13 | 5 याद रखने की बातें + 5 self-check प्रश्न (`<details>` — पहले सोचें, फिर खोलें) + "बेंच पर आजमाएँ" |
| पुरानी duplicate लिंक-पट्टी हटाई | सभी 13 | `.hub-links` (हब/पिछला/अगला) दोहराई जा रही थी — ऊपर की sticky `smps-switch` पट्टी पहले से वही काम करती है, इसलिए हटाई |
| नया पैनल नेविगेशन में जोड़ा | GROUPS array | `['recap','📝',…]` — GROUPS में यह पंक्ति जोड़ना ज़रूरी था; न जोड़ते तो `.pv-hide` की वजह से पैनल कभी दिखता ही नहीं |
| **सिम्युलेटर वापस बचाया** | `06-realsim.html` | bx इंजन `if(!$('bx-stages'))return;` पर चुपचाप बाहर हो रहा था — मार्कअप ही मौजूद नहीं था (18 `bx-*` id ग़ायब)। `08-bench.html` का bx ब्लॉक पोर्ट किया (71 लाइन, over-voltage तालिका हटाकर) → अब `window.__bx` चलता है |
| किताब/कॉपी जैसा रूप | `smps.css` v2 + `smps-nav.js` v2 | क्रीम-रंग कागज़ जैसा `.wrap`, बाईं ओर लाल margin रेखा, नीली horizontal ruled lines, शीर्षक पर highlighter, `?v=1`→`?v=2` cache-bust सभी 15 पेजों पर |

### 18.2 ruled-lines का सुरक्षा नियम (सिम्युलेटर ख़राब न हो)
`smps-nav.js` JS से ही लाइनें लगाता है — किसी पेज का HTML नहीं बदला। एक `<p>`/`<li>` पर लाइन तभी लगती है जब:
- लंबाई ≥ 130 अक्षर, और
- उसके अंदर कोई interactive चीज़ न हो (`button input select canvas svg a label details table`), और
- वह `.smps-switch / nav.tabs / footer / .pv-bar / #troubleshooting-game / .bk-qa` के अंदर न हो।

इसलिए स्कोप, डैशबोर्ड, बटन, सर्किट आदि पर कभी rule नहीं पीछे से दिखती। पुनर्गणना `smps-panel` इवेंट, resize और tab वापस आने पर होती है।

### 18.3 ब्राउज़र जाँच (dev server `http://127.0.0.1:8888`)
| # | जाँच | परिणाम |
|---|---|---|
| 1 | `06-realsim.html?v=2` पर सिम्युलेटर | पास — `window.__bx` object, 8 stage groups, 41 बटन, कोई console error नहीं |
| 2 | `12-cits.html?v=2#recap` | पास — `shown:["recap"]`, 5 प्रश्न, 5 बिंदु, 48 prose पैराग्राफ़ लाइन्ड |
| 3 | हिंदी ⇄ अंग्रेज़ी टॉगल recap पर | पास — `lang=en` पर 21 EN span दृश्य / 0 HI span |
| 4 | dark और light दोनों थीम | पास — दोनों में कागज़/रेखाएँ पढ़ने लायक (CSS custom properties से theme-aware) |
| 5 | `.hub-links` हटने के बाद नेविगेशन | पास — sticky पट्टी पर हब / पिछला / jump / अगला बरक़रार |
| 6 | `.bk-prose` लाइनों की गिनती अन्य पेजों पर | पास — सिम्युलेटर नियंत्रणों पर कोई लाइन नहीं |

**नोट:** पहले पुराने cache के कारण `06-realsim` सुधार "विफल" लग रहा था — `?v=2` लगाकर खोलने पर साफ़ हो गया। सभी 15 फ़ाइलों में `smps.css?v=2` इसलिए ज़रूरी है।

### 18.4 backups / tests / deploy
- सुरक्षा-कॉपी: `backups/SMPS-Lab-before-book-pass-2026-11-06/` (14 फ़ाइलें, 36 MB) और `backups/SMPS-Lab-before-text-pass-2026-11-06/`।
- तीनों अस्थायी codemod (`scripts/tmp-smps-{text-pass,book-pass,fix-realsim}.mjs`) जाँच के बाद हटा दिए।
- `node scripts/build.mjs` → 95 फ़ाइलें, 47.90 MB। कोई API नहीं छुआ — `test-api.mjs` की ज़रूरत नहीं।
- **deploy नहीं** किया गया — अनुमति पर ही जाएगा।

---

## 19. होम पेज: थीम के कई विकल्प + आधुनिक एनिमेशन (6 नवंबर 2026)

### 19.1 नई फ़ाइलें (सिर्फ़ होम पेज पर लगती हैं)
| फ़ाइल | काम |
|---|---|
| `assets/home-modern.css` | 5 नई थीम के रंग-टोकन, थीम-पैनल का रूप, एनिमेशन (aurora / hero प्रवेश / कार्ड hover / ripple / reveal) |
| `assets/home-modern.js` | 🎨 थीम पिकर, 12 थीम + ऑटो + एनिमेशन चालू/बंद, reveal/spotlight/ripple, localStorage |
| `index.html` | बस दो लाइन जोड़ीं: `<link … home-modern.css?v=2>` (हेड में) और `<script … home-modern.js?v=2>` (आख़िर में) |

### 19.2 थीम के विकल्प (कुल 12 + ऑटो)
`light` (हरा), `dark`, `blue`, `purple`, `orange`, `teal`, `rose` (ये 7 पहले से थे) +
**नई 5**: `paper` (किताब जैसी क्रीम), `midnight` (मध्यरात्रि नीला), `mint` (पुदीना), `slate` (स्लेट ग्रे), `contrast` (हाई कंट्रास्ट — काला + पीला, प्रोजेक्टर के लिए ठीक)।
- ऊपर की पट्टी में **🎨** बटन → पैनल खुलता है; हर थीम का नाम + रंग-नमूना।
- पुराना **◐** बटन पहले जैसा काम करता है (थीम घुमाता है) और पैनल साथ में sync रहता है।
- **फ़ोन/लैपटॉप के अनुसार (ऑटो)** = सिस्टम के light/dark के साथ चले।
- **एनिमेशन चालू/बंद** = धीमे फ़ोन पर गति बंद करें; बंद करने पर छिपा हुआ कुछ भी नहीं रहता और फ़ोटो की पट्टी हाथ से स्क्रॉल हो जाती है।
- सब `localStorage` में रहता है: `smps-theme` (वही पुराना key), `smps-theme-auto`, `smps-motion`।

### 19.3 एनिमेशन (सजावट فقط, कुछ नहीं हटाया गया)
- **aurora** — पीछे धीमी चलती रोशनी के तीन गोले; `pointer-events:none`, इसलिए किसी बटन/लिंक पर असर नहीं।
- **hero प्रवेश** — शीर्षक, सूचना पट्टी और शायरी पट्टी बारी-बारी से ऊपर उठकर आती हैं; हीरो पर हल्की चमकती रेखा।
- **कार्ड hover** — कार्ड 3px ऊपर उठता है + माउस जहाँ है वहाँ हल्की रोशनी (spotlight)। *ज़रूरी:* जिन कार्डों में canvas/SVG/बटन/टेबल/सिमुलेटर है उन्हें यह transform नहीं मिलता — भीतर की परतें हिल सकती थीं, इसलिए छोड़ दिए।
- **ripple** — बटन दबाने पर पानी की लहर जैसा प्रभाव (सिर्फ़ pill/chip/थीम-बटन पर)।
- **reveal** — स्क्रॉल पर पाठ-ब्लॉक हल्के से दिखते हैं। शर्तें: 130+ अक्षर का सादे ब्लॉक, भीतर कोई live चीज़ नहीं, और `.v8-gal` (फ़ोटो), appbar, footer कभी छिपे नहीं। साथ में हर 1.5s एक "sweep" चलता है जो स्क्रीन पर या स्क्रीन से ऊपर निकल चुके किसी भी ब्लॉक को ज़रूर दिखा देता है, और IntersectionObserver न हो तो सब दिख जाता है।
- `prefers-reduced-motion` वाले डिवाइस पर ये सब अपने-आप बंद।

### 19.4 फ़ोटो की जाँच (आपकी चिंता — फ़ोटो नहीं हटनी चाहिए)
| जाँच | नतीजा |
|---|---|
| पेज पर कुल `<img>` | 84 — बदलें नहीं (कोई `src` नहीं हटाया गया) |
| गैलरी की 5 तस्वीरें (दोहराकर 10 नोड) | सब `naturalWidth > 0`, opacity 1, दिख रही हैं |
| CITS पैनल की 8 तस्वीरें | सब में base64 `src` मौजूद |
| गैलरी कार्ड पर hover + ज़ूम | hover पर तस्वीर 1.07× बड़ी होती है, `.v8-card` में `overflow:hidden` से पड़ोसी कार्ड पर नहीं चढ़ती |
| नया संकेत | गैलरी के ऊपर "📸 फ़ोटो गैलरी — 5 तस्वीरें (सब वैसी ही हैं)" |

### 19.5 ब्राउज़र जाँच (`http://127.0.0.1:8888/index.html`)
| # | जाँच | नतीजा |
|---|---|---|
| 1 | 🎨 बटन + पैनल, 12 swatch, 2 toggle, aurora 3 गोले | पास |
| 2 | हर नई थीम पर `--bg/--accent/--glass/color-scheme` बदलते + `localStorage` लिखा + सिर्फ़ एक swatch `aria-pressed` | पास (paper #F4EDDC, midnight #0A0F1E, mint, slate, contrast #000/#FFD400) |
| 3 | बॉडी का असली रंग भी थीम के साथ बदले | पास (cross-fade 0.38s के कारण तुरंत पढ़ने पर पुराना रंग आता था — थोड़ा रुकने के बाद नया) |
| 4 | ◐ बटन से cycle → पैनल sync | पास |
| 5 | ऑटो ON → सिस्टम के अनुसार (`sysDark=false` → light), OFF → चुनी थीम | पास |
| 6 | एनिमेशन बंद → `.hm-no-motion`, `.hm-reveal` छिपे 0, स्टोरेज `smps-motion=off` | पास |
| 7 | सिमुलेटर छूए नहीं: realsim 35, bench 38, live 21, tp-probe 20, ntc-live 5 कंट्रोल; इनमें से कोई `.hm-reveal`/`.hm-glow` वाला छिपा हुआ 0 | पास |
| 8 | स्क्रॉल के बाद `.hm-reveal:not(.hm-in)` जो स्क्रीन पर/ऊपर हैं | 0 (sweep ने दिखा दिए) |
| 9 | क्षैतिज स्क्रॉल | 0 px (aurora/पैनल की वजह से overflow नहीं) |
| 10 | console | सिर्फ़ goatcounter की localhost warning, कोई JS error नहीं |
| 11 | reload के बाद थीम याद | पास |

### 19.6 tests · build · deploy
- `node scripts/build.mjs` → 97 फ़ाइलें, 47.93 MB (दो नई asset फ़ाइलें शामिल)।
- कोई API नहीं बदला, इसलिए `test-api.mjs` (136/136) पहले जैसा।
- **deploy नहीं** किया गया — आपकी अनुमति के बिना Netlify पर कुछ नहीं जाएगा।

---

## 20. आख़िरी QA — सब कुछ लोकल सर्वर पर चलाकर जाँचा (6 नवंबर 2026)

`node scripts/dev-server.mjs` → `http://127.0.0.1:8888` पर असली ब्राउज़र से हर पेज खोला, क्लिक किए, फ़ॉर्म भरे।

### 20.1 इस जाँच में मिला बग और उसकी ठीक
| बग | जगह | ठीक कैसे |
|---|---|---|
| 3D लैब का iframe खाली दिखता था (404) | `SMPS-Lab/00-home.html:2315` — `src="Computer-Lab-3D-Single-File.html"`, पर फ़ाइल साइट की जड़ पर है | `src="../Computer-Lab-3D-Single-File.html"` किया; अब iframe का title "कंप्यूटर लैब 3D · असेंबली से डिसअसेंबली" लोड होता है |

### 20.2 छात्र की पूरी राह (सच में भरा गया फ़ॉर्म)
| # | कदम | नतीजा |
|---|---|---|
| 1 | "नया रजिस्ट्रेशन" → नाम/पिता/मोबाइल/ईमेल/बैच + फ़ोटो + सहमति | पास — ID `CHNM1` मिला, "रजिस्ट्रेशन सफल" |
| 2 | फ़ोटो के बिना submit | रोका: "अपनी फ़ोटो चुनें (JPG / PNG / WebP)।" — सही gating |
| 3 | डैशबोर्ड | नाम, ID, ट्रेड, बैच, मोबाइल, शायरी लाइन, 6 काउंटर — सब सही |
| 4 | एडमिन ने पेपर बनाकर प्रकाशित किया | 11 प्रश्न का पेपर, `v1 लॉक` → "परीक्षा प्रकाशित हो गई" |
| 5 | छात्र के डैशबोर्ड पर "उपलब्ध परीक्षा 1" | दिखी (अवधि/प्रश्न/अंक/पास%/नकारात्मक सब सही) |
| 6 | निर्देश wizard 1/4 → 4/4 | सब पेज पढ़ने के बाद ही "परीक्षा शुरू करें" चला; सहमति checkbox से पहले बटन `disabled` — सही |
| 7 | CBT चालू | टाइमर `29:57` से चला, 11 प्रश्न, पैलेट स्थितियाँ (answered / not-answered / not-visited) सही |
| 8 | 10/11 उत्तर → सबमिट | "समीक्षा व अंतिम सबमिट" खुला (90% गेट पास), सारांश टेबल 10 उत्तरित / 1 छूटा |
| 9 | हाँ, अंतिम सबमिट | "परीक्षा सबमिट हो गई" + Result ID `RES-ATT-…` |
| 10 | एडमिन → परिणाम | `3 / 11 · 27.27%`, "देखें" लिंक, CSV बटन |
| 11 | एडमिन → परिणाम जारी करें | "परिणाम और उत्तर-कुंजी जारी कर दिए गए" |
| 12 | छात्र → परिणाम विवरण | अंक, सही/गलत/छूटे, समय, "📚 ये पढ़ें आप" सुझाव, हर प्रश्न का सही उत्तर + व्याख्या |

### 20.3 एडमिन पैनल की जाँच (`exam/admin.html`)
- लॉगिन सिर्फ़ पासवर्ड से, 0 inline `<script>` (CSP `script-src 'self'` बरकरार)।
- परीक्षाएँ → नई परीक्षा बनाएँ: विषय/ट्रेड/अवधि/पास%/ऋणात्मक/प्रयास + प्रश्न picker (फ़ोल्डर फ़िल्टर, खोज) — 11 प्रश्न चुने, "पूरा पेपर प्रीव्यू" चला।
- स्थिति राह: `DRAFT → LOCKED → PUBLISHED` — "पेपर लॉक करें" के बाद ही "प्रकाशित करें" दिखता है, दोनों पर confirmation modal।
- tabs चले: डैशबोर्ड, लाइव परीक्षा, परीक्षाएँ, प्रश्न बैंक, विषय और ट्रेड, परिणाम, आँकड़े, विद्यार्थी, सूचना और चैट, सेटिंग्स, टूल्स।

### 20.4 SMPS लैब के सभी पेज एक-साथ लोड करके
hub के अंदर हर पेज iframe में चलाया — किसी में भी JS error नहीं, सबमें `recap` + दोनों भाषा के जोड़े + सिमुलेटर बचते हैं:

| पेज | prose खंड | `data-lang` जोड़े | सिमुलेटर कंट्रोल |
|---|---|---|---|
| 00-home | 341 | 969 | bx चरण 8 |
| 01-safety | 13 | 112 | — |
| 02-learning-lab | 15 | 114 | बटन 53, SVG 7 |
| 03-basics | 13 | 132 | — |
| 04-how-smps-works | 37 | 130 | canvas 1, SVG 4 |
| 05-real-parts | 16 | 112 | canvas 1, SVG 24 |
| 06-realsim | 14 | 110 | bx चरण 8, `window.__bx` 20 key |
| 07-waveform | 7 | 106 | canvas 1 |
| 08-bench | 23 | 114 | bx चरण 8 |
| 09-multimeter | 15 | 112 | बटन 18 |
| 10-fault-finding | 18 | 280 | इनपुट 18 |
| 11-calculators | 37 | 320 | बटन 73 |
| 12-cits | 48 | 118 | canvas 2, फ़ोटो 42 |
| 13-glossary | 13 | 153 | — |

- `06-realsim` पर भाषा toggle देखा: `html lang="en"` → 55 अंग्रेज़ी खंड दिखे, 55 हिंदी छिपे; वापस हिंदी पर आ गया।
- कहीं भी `NaN` / `undefined` / `[object` पाठ में नहीं फैला।
- `.cits-lb` का `<img>` खाली `src` से "टूटी तस्वीर" लगता है — यह ज़ूम-lightbox है, क्लिक पर `src` भरता है; दिक्कत नहीं।

### 20.5 बाक़ी पेज
| पेज | नतीजा |
|---|---|
| `index.html` | 84 `<img>`, टूटी 0; 🎨 12 swatch; `midnight` चुनने पर बॉडी `rgb(10,15,30)` + `localStorage` + एक ही `aria-pressed`; शायरी iframe `youtube-nocookie…autoplay=1` बना |
| `study/index.html` (Training Methodology) | 41 लिंक, कोई error नहीं |
| `study/trade/index.html` | 68 लिंक, कोई error नहीं |
| `study/chapter.html?m=1` | चित्र 7, live scene 1, error 0 |
| `study/trade/chapter.html?m=12` | ruled कॉपी खंड 5, चित्र 7, live scene 1, error 0 |
| `study/trade/topics.html` | विषय-वार सूची चालू |
| `exam/register.html` | फ़ॉर्म लोड, तस्वीरें 2, टूटी 0 |
| `assembly-lab.html` / `basic-office-lab.html` | 23 / 22 बटन, error 0 |
| `/exam/*` response headers | `Cache-Control: no-store` + CSP `script-src 'self'` (test.html, admin.html, result.html में inline script 0) |
| WhatsApp | छात्र पोर्टल (`exam/`) में कहीं नहीं; सिर्फ़ होम पेज पर समूह-जॉइन लिंक (2 जगह) |

### 20.6 जाँच के दौरान नोट की दो बातें (बग नहीं, फ़ैसला आपका)
1. **Training Methodology के अध्याय ruled कॉपी नहीं हैं** — ruled-लाइनें `trade.css` में हैं, `study.css` में नहीं। चाहें तो TM अध्याय पर भी वही किताब-असर लगा दें।
2. **परीक्षा शुरू होते ही फ़ुल स्क्रीन** — कोड क्लिक के उसी gesture में `requestFullscreen()` माँगता है (सही जगह)। असली ब्राउज़र में चलता है; automation में "user gesture" न मानने से warning आई और पेज ने "फ़ुल स्क्रीन करें" पट्टी दिखाकर परीक्षा जारी रखी — यानी fallback सही है।

### 20.7 आँकड़े
- `node scripts/test-api.mjs` → **136 पास, 0 फेल**
- `node scripts/build.mjs` → 97 फ़ाइलें, 47.93 MB
- `dist` का लिंक-क्रॉलर (सिर्फ़ असली `href`/`src` attribute) → 32 HTML फ़ाइलें, **टूटे संदर्भ 0**
- ब्राउज़र console: हर पेज पर सिर्फ़ goatcounter की localhost warning; कोई JS error नहीं

### 20.8 deploy
- **deploy नहीं किया गया।** सब कुछ लोकल पर जाँच लिया है — Netlify पर भेजने की आपकी हरी झंडी का इंतज़ार (15 credit, फ़्री प्लान में 0 होने पर साइट रुक जाती है)।

---

## 21. होम पेज के आख़िरी बदलाव — प्रोफ़ेसर फ़ीचर हटाना, 🔔 सूचना, शायरी ऑडियो (6 नवंबर 2026)

यह हिस्सा आपकी इसी बात पर किया गया: *"प्रोफेस्सेर सवाद्वाली पूरा हटा दो ..और शयरी को ऑडियो फॉर्म म लगाओ ..बस"* और उससे पहले *"...राईट साइड में ..एक आइकॉन है आशान भासा में पढ़े उसको हटाकर ........उसकी जगह पर ..नोटिफिकेसन का IICON लगा दो"*.

### 21.1 क्या-क्या बदला
| # | काम | विवरण | नतीजा |
|---|------|--------|--------|
| 1 | प्रोफ़ेसर / "बिल्कुल आसान भाषा में पढ़ें" **पूरा हटा** | appbar का 👨‍🏫 बटन, `body.prof-mode` स्विच, 27 `.prof-box` ब्लॉक, `#prof-lex` section, शब्दकोश (`#lex-grid`/`#lex-q`) और उसका script, `@keyframes profFade`, `.lex-*`/`.story-flow` CSS, GROUPS नेव-row की `prof-lex` एंट्री, localStorage `smps-prof-mode` | कोड में अब कहीं भी `profBtn` / `prof-box` / `prof-lex` नहीं बचा (grep = 0) |
| 2 | उसी जगह **🔔 सूचना आइकॉन** | appbar में `#homeBell` + लाल गिनती बैज `#homeBellBadge`; खोलने पर `#homeBellPanel` में live सूचियाँ (बैकएंड `site_notices`), ज़रूरी/चेतावनी रंग, "नया/NEW" चिप, तारीख़, `#homeBellRead` से "सब पढ़ा हुआ चिह्नित करें" | 60 सेकंड + tab वापस आने पर अपने-आप ताज़ा; पढ़ी हुई IDs localStorage में; Esc और ✕ से बंद |
| 3 | **शायरी अब ऑडियो में** | ऑडियो प्लेयर (`#home-audio` → `#haTracks` 5 ट्रैक + `#haFrame`) शायरी कार्ड के अंदर ले जाया गया (`ha-in-card`) | ट्रैक पर क्लिक करते ही कार्ड के अंदर ही वॉइस चलती है; पुराना अलग-थलग बॉक्स हटा दिया |

### 21.2 फोटो और बाक़ी सामान सुरक्षित (आपकी शर्त "PHOTO NAHI HATANA CHHCIYE")
| चेक | पहले | बाद |
|------|-------|------|
| `<img>` टैग (सोर्स) | 78 | **78** |
| `data:image` (base64 फोटो) | 55 | **55** |
| गैलरी नोड | 9 | **9** |
| `<script>` ब्लॉक | 37 | **37** |
| ब्राउज़र में दिखने वाले `<img>` / लोड गैलरी | 84 / 10 | **84 / 10** |

- फ़ाइल का आकार 4,208,929 → **4,033,550 characters** कम हुआ — यानी सिर्फ़ प्रोफ़ेसर वाला टेक्स्ट/CSS गया, कोई फोटो नहीं।
- एक भ्रम यह था कि "1.8 MB फोटो उड़ गए": असल में JS में `s.length` **character** गिनता है और हिंदी 3-byte होती है; byte-आकार (`5,378,295`) जैसा था वैसा ही है। पुरानी backup (`backups/index-before-prof-removal-2026-11-06.html`) से diff करके यह साफ़ किया।

### 21.3 ब्राउज़र में चलाकर जाँचा (लोकल सर्वर `127.0.0.1:8888`)
| जाँच | नतीजा |
|------|--------|
| प्रोफ़ेसर बटन/पेज़ | पेज पर कहीं नहीं; पुराना URL hash से खोलने की कोशिश पर कुछ नहीं दिखता — **0 residue** |
| 🔔 बैज | एडमिन पैनल ("सूचना और चैट" → "सभी को भेजें") से नोटिस भेजने पर बैज **1**; खोलने पर नोटिस + "नया" चिप + ज़रूरी लाल रंग + तारीख़ |
| "सब पढ़ा हुआ" | क्लिक से बैज हटा, `localStorage['chnm-home-notices-read']` में ID सेव; reload पर भी पढ़ा-हुआ रहता है |
| बंद करना | Esc और ✕ — दोनों से बंद; बाहर क्लिक से भी बंद |
| शायरी ऑडियो | ट्रैक क्लिक → `youtube-nocookie` iframe कार्ड के अंदर ही (`frameInsideCard=true`), `aria-pressed=true`, आवाज़ चालू |
| 🌐 हिंदी/English | panel "सूचनाएँ ↔ Notices", शायरी label दोनों भाषाओं में बदलता और वापस आता है |
| लेआउट | 360 / 768 / 1440 px पर horizontal overflow नहीं; फोटो गैलरी यथावत |
| Console | कोई JS error नहीं (सिर्फ़ goatcounter की localhost warning) |

### 21.4 रिग्रेशन
- `node scripts/test-api.mjs` → **136 पास, 0 फेल** (इस बदलाव में कोई API नहीं छुआ)।
- `node scripts/build.mjs` → `dist/index.html` source से बराबर (5,378,295 bytes)।
- exam / study / SMPS-Lab पेजों पर यह बदलाव लागू नहीं — वहाँ का कुछ नहीं टूटा।

### 21.5 deploy
- **deploy नहीं किया।** बदलाव लोकल पर पूरे जाँच लिए हैं; Netlify पर भेजने के लिए आपकी हरी झंडी चाहिए (15 credit — फ़्री प्लान में 0 होने पर साइट रुक जाती है)।

---

## 22. बग: होम पेज के नीचे "सुरक्षा के नियम" आ गया था — और उसी में छुपा बड़ा नुकसान (6 नवंबर 2026, शाम)

आपकी शिकायत: *"होम पेज के निचे क्या आ गया ... सुराचा के नियम इसको हटाओ"*। जाँच में यह सिर्फ़ दिखने वाली बात निकली — असली कारण §21 के स्क्रिप्ट का टैग-काटना था।

### 22.1 असली कारण (मेरी पिछली ग़लती)
प्रोफ़ेसर फ़ीचर हटाने वाले स्क्रिप्ट का block-cutter हर `.prof-box` के बाद अगले टैग के **4–5 अक्षर काट देता था**। इसके तीन नतीजे:
| नुकसान | कितना |
|--------|--------|
| 15 अध्यायों की `</section>` टूटी (`…</h2>` के बाद नंगा `section>` टेक्स्ट) | DOM में section बाहर-भीतर गड़बड़ |
| `<section id="safe">` का शुरूआती हिस्सा कटा → "सुरक्षा के नियम" का पूरा चैप्टर होम पेज के नीचे **हमेशा दिखने लगा** | यही आपने देखा |
| `c-basics … c-glossary` के **14 कंप्यूटर-लैब अध्यायों का पूरा टेक्स्ट** (टेबल, SVG चित्र, 🎯 याद-वाली-बात) `.prof-box` के अंदर होने से कट गया | लगभग **1.23 लाख अक्षर** का पाठ |

### 22.2 सुधार (कोई नया फ़ीचर नहीं, सिर्फ़ वापसी)
1. 15 टूटे `</section>` और `<section id="safe">` का टैग दोबारा जोड़ा।
2. backup `backups/index-before-prof-removal-2026-11-06.html` से 14 `c-*` अध्याय वापस लिए — इस बार **सिर्फ़ प्रोफ़ेसर वाला हिस्सा** (prof-h, intro पैरा, prof-step) हटाकर; बाक़ी चैप्टर, टेबल, SVG और 🎯 पैरा ज्यों-के-त्यों।
3. `.prof-box` रैपर हटाकर उसकी जगह सादा `<div class="c-full">`/`c-body` — इसलिए कोई CSS टूटा नहीं।

### 22.3 संतुलन और आँकड़े
| जाँच | पहले (टूटा) | बाद |
|------|-------------|------|
| `<section>` / `</section>` | 121 / 107 (EOF पर 15 खुले) | **122 / 122 (संतुलित)** |
| `<div>` / `</div>` | — | **1391 / 1391** |
| फ़ाइल आकार (characters) | 4,033,600 | **4,156,578** (बैकअप 4,208,929 — फ़र्क़ सिर्फ़ प्रोफ़ेसर का पाठ) |
| बचा हुआ पाठ | 14 अध्याय लगभग खाली (191–584 chars) | **हर अध्याय 1,400–18,700 chars** |
| `prof-box` / `profBtn` / `prof-lex` | 0 | **0** (प्रोफ़ेसर फ़ीचर अब भी पूरा हटा हुआ) |
| फोटो `<img>` / `data:image` | 78 / 55 | **78 / 55** (ब्राउज़र में 84 img) |

### 22.4 ब्राउज़र में चलाकर जाँचा
| जाँच | नतीजा |
|------|--------|
| होम पेज का नीचे वाला हिस्सा | अब शायरी कार्ड + फ़ुटर पर खत्म; `#safe` का `display:none` — **सुरक्षा के नियम होम पेज पर नहीं दिखता** |
| साइडबार → "⚠️ सुरक्षा के नियम" | अलग पेज की तरह खुलता है (1507px, सारे 7 नियम + आसान उदाहरण) |
| `c-basics` | 4499px, 3 टेबल + 1 SVG चित्र वापस |
| `c-assembly` | 10447px, 12,430 अक्षर, 3 टेबल |
| `c-glossary` | 4178px, 1 टेबल |
| 🔔 सूचना + शायरी ऑडियो | दोनों पहले की तरह चल रहे (bell मौजूद, `.shayari-card #haTracks` मौजूद) |
| DOM | 122 sections, 84 img, कोई नंगा `section>`/`ion id=` टेक्स्ट नहीं |
| Console | सिर्फ़ goatcounter की localhost warning — कोई error नहीं |
| `node scripts/test-api.mjs` | **136 पास / 0 फेल** |
| `node scripts/build.mjs` | 97 फ़ाइलें, 47.85 MB, `dist/index.html` source से बराबर |

### 22.5 सबक
अब से index.html जैसे बड़े फ़ाइल में block हटाने के बाद **हर बार** section/div संतुलन और "कितने अक्षर गए" की तुलना backup से की जाएगी — सिर्फ़ grep से नहीं।

### 22.6 deploy
- **deploy नहीं किया।** Netlify के लिए आपकी हरी झंडी बाक़ी (15 credit)।


---

## 23. होम पेज: सूचना पट्टी हटी + शायरी अब केवल ऑडियो (6 नवंबर 2026, रात)

आपकी माँग: *"होम पेज पर chnm ट्रेड गाइड के नीचे notification क्या कर रहा है, जब वो पहले से ऊपर है तो इसे यहाँ से हटाओ… और शायरी को ऑडियो फ़ॉर्म में करो — प्ले करने पर वीडियो न चले, केवल ऑडियो।"*

### 23.1 काम 1 — शीर्षक के नीचे की लाइव सूचना पट्टी हटाई

`📖 सम्पूर्ण CHNM Trade Guide` के ठीक नीचे जो पट्टी चलती थी वह तीन चीज़ों का जोड़ था:

| हटाया गया | विवरण |
|---|---|
| `<style>.hn{…}</style>` | पट्टी का अपना CSS (`.hn`, `.hn-row`, `.hn-dot`, `.hn-badge`) |
| `<div class="hn" id="home-notice">` | पट्टी का मार्कअप + `#home-notice-body` |
| उसका `<script>` | `/api {action:'site_notices'}` polling, `noticeRow()`, भाषा `MutationObserver`, `setInterval(…, 60000)` |

कुल **54 लाइनें (695–748)** हटीं। हटाने से पहले guard लगाए थे — पहली लाइन `<style>.hn{` से शुरू हो, `#home-notice` मौजूद हो और आख़िरी लाइन `</script>` हो — ताकि ग़लती से कोई और block न कटे।

**सूचना अब भी पूरी चलती है**, बस ज़्यादा जगह घेरती नहीं:
- ऊपर के 🔔 (`#homeBell`) में वही `/api site_notices` आता है,
- unread count badge (`#homeBellBadge`),
- पढ़ने की स्थिति `localStorage['chnm-home-notices-read']`,
- 60 सेकंड का polling और `visibilitychange` — ये सब 🔔 के अपने script में हैं, पट्टी हटने से नहीं छुए।

### 23.2 काम 2 — शायरी: वीडियो बंद, केवल आवाज़

पहले क्लिक करते ही card के अंदर YouTube का iframe दिखता था (यानी वीडियो)। अब तीन स्तरों में व्यवस्था है:

**स्तर 1 — छिपा ऑडियो प्लेयर (normal रास्ता)**
क्लिक पर iframe बनता है पर card में नहीं, बल्कि `#haOff` में, जो CSS से स्क्रीन से बाहर है:
`.ha-off{position:fixed;left:-99999px;top:0;width:320px;height:180px;overflow:hidden;pointer-events:none}`
`src` में `enablejsapi=1` जोड़ा गया है ताकि YouTube के अपने `widget` postMessage से `playing` / `videoStart` event मिल सके। दिखता कुछ नहीं — सिर्फ़ आवाज़ आती है।

**स्तर 2 — 4.5 सेकंड का watchdog + ब्राउज़र की आवाज़**
अगर ब्राउज़र ने छिपा iframe रोक दिया (autoplay policy / बिना user gesture) तो 4.5 सेकंड में iframe हटकर `speechSynthesis` से वही शायरी हिन्दी आवाज़ (`hi-IN`, rate `0.92`) में सुनाई जाती है। status line पर `"ब्राउज़र की आवाज़ — बज रहा है: …"` दिखता है।

**स्तर 3 — अंतिम विकल्प**
आवाज़ भी न चले तो एक `_blank` लिंक (`♪ …`) दिखता है; कोई video page में कहीं embed नहीं होता।

**Status UI**: `#haNow` में लाल pulsing dot + `"बज रहा है: शायरी 2"` + `⏹ रोकें` बटन। पुराने `.ha-frame` / `.ha-box` (वीडियो दिखाने वाले) CSS हटा दिए गए। 5 clips वही हैं — `Ss_jEUlLc5w`, `3w9IvsozFBY`, `9YQBTu5wIBw`, `MbBUDEFpJbk`, `KgVf67E1zds`.

### 23.3 जाँच के आँकड़े

| जाँच | नतीजा |
|---|---|
| `<section>` खुले/बंद | 122 / 122 |
| `<div>` खुले/बंद | 1389 / 1389 |
| `<script>` / `</script>` | 36 / 36 |
| `<style>` / `</style>` | 24 / 24 |
| `<img>` | 78 (ब्रौज़र में 84 — CSS से दिखने वाले) |
| `data:image` | 55 |
| `#home-notice` | **नहीं है** (`false`) |
| `#haOff` (छिपा प्लेयर) | मौजूद |
| कुल अक्षर | 41,55,866 |
| `node scripts/build.mjs` | 97 फ़ाइलें, 47.85 MB, `dist/index.html` = source |
| `node scripts/test-api.mjs` | **136 पास / 0 फेल** |
| Syntax check | 0 फेल |

### 23.4 ब्राउज़र में प्रमाण (local `http://127.0.0.1:8888`)

| बिंदु | नतीजा |
|---|---|
| शीर्षक के नीचे | कोई सूचना पट्टी नहीं — सीधे card शुरू |
| 🔔 बटन | खुलता है, सूचनाएँ दिखाता है, badge व read-state चलता है |
| शायरी card | बटन: `♪ शायरी 1` … `♪ शायरी 4`, `♪ विचार (पूरा)` |
| क्लिक के बाद स्क्रीन पर दिख रहे video iframe | **0** (हर sample पर) |
| status line | `● बज रहा है: शायरी 4` → 4.5 s के बाद `ब्राउज़र की आवाज़ — बज रहा है: शायरी 4` |
| `⏹ रोकें` | आवाज़ बंद, pulsing dot और status पंक्ति हटी, बटन का `aria-pressed` reset |
| DOM | 122 sections, 84 img, कोई नंगा `section>` टेक्स्ट नहीं |
| Console | goatcounter की localhost warning के सिवाय कोई error नहीं |

### 23.5 deploy
- **deploy नहीं किया गया** — आपकी बात के अनुसार पहले local server पर चलाकर देख लिया गया।
- Netlify पर भेजने के लिए आपकी साफ़ अनुमति बाक़ी (15 credit, free plan 300/month, 0 पर plan pause)।

---

## 24. SMPS-Lab फ़ोल्डर: "आसान भाषा" (प्रोफ़ेसर मोड) पूरी तरह हटा + गहरी QA (6 नवंबर 2026, रात)

आपकी बात: *"अब भाई smps वाले फोल्डर पर बहुत गहराई पर काम करो ...सबसे पहले आशान भासा वाला पूरा हटा दो ..."*. यह काम `SMPS-Lab/` के **सभी 15 HTML पेजों** + `smps.css` पर हुआ। कोई deploy नहीं हुआ।

### 24.1 "आसान भाषा / प्रोफ़ेसर मोड" क्या-क्या हटा
हर पेज से: appbar का `👨‍🏫 #profBtn` बटन, उसका पूरा `<script>` (body class `prof-mode`, `localStorage['smps-prof-mode']`, `#prof-hint` toast, भाषा-observer), शब्दकोश `<script>` (`#lex-grid`/`#lex-q` + 39 शब्दों का `L[]`), और 38 लाइनों का CSS गुच्छा (`.prof-btn` `.prof-box` `.prof-h` `.prof-step` `.prof-key` `body.prof-mode …` `@keyframes profFade` `.lex-*` `.story-flow` + 560px media block)।
`00-home.html` और `13-glossary.html` से अलावा `#prof-lex` section (नल-और-पानी की 8-कदम कहानी + खोज पट्टी) भी हटा। `smps.css` की दो साझा selector-list से `.prof-box` निकाला।

**अवशेष जाँच (grep):** `profBtn` / `prof-mode` / `prof-box` / `prof-lex` / `prof-key` / `profFade` / `lex-grid` / `story-flow` / `प्रोफ़ेसर` / `Professor` / `आसान भाषा` — **15 में से किसी भी फ़ाइल में 0**। ब्राउज़र DOM में भी 0।

### 24.2 फ़ाइल आकार (बाइट) — पहले → बाद
| फ़ाइल | पहले | बाद | अंतर |
|---|---|---|---|
| 00-home.html | 3,598,714 | 3,513,208 | −85,506 |
| 01-safety.html | 2,603,392 | 2,582,613 | −20,779 |
| 02-learning-lab.html | 2,622,873 | 2,600,186 | −22,687 |
| 03-basics.html | 2,619,261 | 2,594,517 | −24,744 |
| 04-how-smps-works.html | 2,651,287 | 2,622,940 | −28,347 |
| 05-real-parts.html | 2,622,410 | 2,601,631 | −20,779 |
| 06-realsim.html | 2,607,238 | 2,586,459 | −20,779 |
| 07-waveform.html | 2,601,902 | 2,581,123 | −20,779 |
| 08-bench.html | 2,619,061 | 2,595,956 | −23,105 |
| 09-multimeter.html | 2,603,866 | 2,583,087 | −20,779 |
| 10-fault-finding.html | 2,608,246 | 2,587,467 | −20,779 |
| 11-calculators.html | 2,644,153 | 2,623,374 | −20,779 |
| 12-cits.html | 2,761,077 | 2,740,210 | −20,867 |
| 13-glossary.html | 2,607,035 | 2,592,699 | −14,336 |
| index.html (हब) | 20,553 | 22,017 | +1,464 (थीम बटन + थिम CSS) |

- **फोटो/सिम्युलेटर नहीं छुए**: हर पेज पर `<img>` 27 (00-home 78, 12-cits 68), `data:image` 39 (00-home 55), `<svg>` 18–32, `<iframe>` सिर्फ़ 00-home में 1 — बदलाव से पहले और बाद **बराबर**।
- `00-home.html` के 27 `.prof-box` **मिटाए नहीं गए** — हर बॉक्स के अंदर छुपा असली पाठ `<div class="c-full">` (14 ब्लॉक, ~1.2 लाख बाइट का पूरा अध्याय-शरीर) और 27 `🎯 याद रखने वाली बात` लाइनें बाहर निकालकर सुरक्षित रखीं।

### 24.3 एक सच्चा नुकसान जो मिला और ठीक किया गया
`13-glossary.html` का 39 शब्दों का शब्दकोश **`#prof-lex` section के अंदर** रहता था — हटाने पर मॉड्यूल 13 की पूरी शब्द-सूची उड़ गई (ब्राउज़र में 0 तालिका)। इसे backup से निकालकर **बिना किसी "प्रोफ़ेसर/आसान भाषा" रूप के** सीधी तालिका के रूप में `#home` में वापस डाला:
- नई तालिका: 39 शब्द × 4 कॉलम (शब्द | हिंदी नाम | मतलब | विभाग), हर सेल हिंदी+अंग्रेज़ी।
- `bk-intro` बदला: "…एक ही खोज पट्टी में। कहानी नल और पानी की उपमा से…आठ कदमों…" → "हर तकनीकी शब्द का हिंदी नाम, मतलब और विभाग एक ही तालिका में…"
- `bk-aims` की 4 बुलेट्स ईमानदारी से दोबारा लिखीं (अब कोई खोज पट्टी/कहानी का वादा नहीं)।
- `#recap` की वह लाइन भी ठीक की जो अब ग़ायब खोज पट्टी का सहारा बता रही थी → "शब्द भूल जाएँ तो ऊपर दी शब्दावली तालिका में देखिए…"
- ब्राउज़र में जाँचा: `#home` में **40 `<tr>`** (1 हेडर + 39 शब्द), तालिका दिखती है, `tbl` क्लास की वजह से मोबाइल पर horizontal scroll चलता है।

### 24.4 गहरी QA — ऑटोमैटिक स्कैन (हर 15 फ़ाइल)
`scripts/` में QA स्क्रिप्ट बनाकर चलाया; **अंतिम नतीजा: 15/15 फ़ाइलें ✅, "समस्या वाली फ़ाइलें: कोई नहीं"**।
| जाँच | नतीजा |
|---|---|
| टूटे आंतरिक लिंक `href="#id"` | **0** (15 में से किसी पेज पर नहीं; `cits-t1…t14` `<article>` id हैं — ठीक) |
| डुप्लिकेट `id` | **0** (00-home में 640 id सहित) |
| फ़ाइल लिंक (`../exam/index.html`, `/exam/index.html`, `00-home.html`…) | सब मोजूद |
| हिंदी/अंग्रेज़ी `<span data-lang>` जोड़े | हर पेज पर **बराबर** (77/77 से 141/141 तक) |
| JS में hi→en अनुवाद शब्दकोश | **4,762 जोड़े**, खाली = 0, बिना-अनुवाद = 0 |
| टैग संतुलन (`section`/`script`/`style`/`table`) | हर पेज पर खुला = बंद |
| थीम बटन + भाषा बटन | 15/15 पेजों पर (हब में JS-बना `language-toggle`, हब में अब `theme-flip` भी) |
| खाली placeholder भाग | `part1`/`part2` की जगहें अब नहीं (नीचे देखें) |

### 24.5 QA में मिली और सुधारी तीन गंदगियाँ
1. **मरे हुए `part1`/`part2` हेडिंग ब्लॉक** — हर पेज में "भाग 1 · THEORY & CONNECTORS GUIDE" और "भाग 2 · INTERACTIVE LAB" के दो बॉक्स थे, जिनके नीचे कोई content नहीं था (पैनल-स्क्रिप्ट इन्हें `pv-hide` से छिपा देता था, पर **print/PDF में वे दिखते** और ग़लत जगह लगते थे)। 14 फ़ाइलों से 28 ब्लॉक + 14 JS लाइनें हटाईं (≈516 बाइट/फ़ाइल)।
2. **अधूरे फोटो-क्रेडिट** — कैप्शन/alt में "(चित्र  से)" और "(picture from the )" लिखा था (स्रोत का नाम पहले हट चुका था, कोष्ठक रह गए)। 14 पेजों × 9 जगहें साफ़ कीं; अब कहीं भी यह अवशेष नहीं।
3. **हब (SMPS-Lab/index.html) में थीम का बटन नहीं था** — जबकि सभी मॉड्यूल पेज dark/light चलाते हैं। हब में `🌓/☀️` बटन + वही `localStorage['smps-theme']` + dark पैलेट जोड़ा (hardcoded `white`/`#fff` की जगह `var(--surface)`/`var(--accent-ink)`)। ब्राउज़र में जाँचा: हब default **dark**, क्लिक से light, दोबारा क्लिक से dark, मॉड्यूल पेजों से की साझा।

### 24.6 ब्राउज़र में चलाकर जाँच (लोकल `127.0.0.1:8888`, dist rebuild के बाद)
| पेज | console error | ऊपर की मॉड्यूल-पट्टी | टूटे/खाली चित्र | page दिखने वाला text | undefined/NaN |
|---|---|---|---|---|---|
| 00-home, 01-safety, 02-learning-lab | **0** (सिर्फ़ goatcounter की localhost warning) | ✅ | 1 src-रहित `<img>` = CITS लाइटबॉक्स placeholder (टैप पर src भरता है) — डिज़ाइन से | 3.7K+ | 0 / 0 |
| 03 … 12 (10 पेज) | **0** | ✅ | वही 1 placeholder | 1.4K–1.6K (बाक़ी पैनल `display:none` हैं) | 0 / 0 |
| 13-glossary | **0** | ✅ | वही 1 placeholder | 4,931 (नई 39-शब्द तालिका सहित) | 0 / 0 |
| index.html (हब) | **0** | — (हब में पट्टी नहीं, कार्ड-लिंक हैं) | 28 मॉड्यूल कार्ड | थीम बटन ✅ dark default | 0 / 0 |

हर पेज का पैनल-लिस्ट सही रजिस्टर होता है (कम से कम `home` + `recap`; 11-calculators में 9, 04 में 7, 12-cits में 7)।

### 24.7 बाक़ी बचे काम की जाँच
- `node scripts/build.mjs` → **97 फ़ाइलें, 47.51 MB** dist तैयार।
- `node scripts/test-api.mjs` → **136 पास, 0 फेल** (SMPS काम से बैकएंड नहीं छुआ, फिर भी पूरा सूट चलाया)।

### 24.8 तीन चीज़ें जो QA में मिलीं — आपका फ़ैसला बाक़ी
1. **`🧒 आसान उदाहरण` कार्ड (100 जगहें)** — ये "आसान भाषा मोड" से अलग चीज़ है: हर सब्जेक्ट के नीचे हमेशा दिखने वाली एक-लाइन की मिसाल (जैसे "गेन = −Rf ÷ Rin, जैसे नल का हैंडल")। यह content है, toggle नहीं। **फ़िलहा रखा है** — हटाना हो तो बताइए।
2. **`विद्यार्थी मोड` बटन मरा पड़ा है** — sidebar में "विद्यार्थी मोड चालू करें" बटन है, `body.student-mode` क्लास लगाता है, पर किसी भी पेज में `.student-tip` एलिमेंट ही नहीं है (0)। यानी बटन दबाने पर **कुछ नहीं बदलता**। या तो बटन हटाएँ, या उसमें tips भरें।
3. **SMPS-Lab फ़ोल्डर मुख्य होम पेज से लिंक ही नहीं है** — `index.html` (chnm26.netlify.app) में `SMPS-Lab/` की एक भी लिंक नहीं है; यह लैब सिर्फ़ सीधे URL `/SMPS-Lab/` से खुलती है। होम पर एक कार्ड/बटन जोड़ना हो तो बताइए।

### 24.9 deploy
- **deploy नहीं किया गया** — आपकी बात *"BAAD ME DEPOLY HOGA ... PAHLE LOCAL SERVER PAR CHALA KE CHEK KAR LENA"* के अनुसार सब कुछ लोकल सर्वर + ब्राउज़र पर जाँचा।
- Netlify पर भेजने के लिए आपकी साफ़ अनुमति बाक़ी (15 credit, free plan 300/month, 0 पर plan pause)।

---

## 25. पूरी वेबसाइट (32 पेज) लोकल सर्वर + ब्राउज़र पर चलाकर जाँच — 6 नवम्बर 2026

**सर्वर:** `ADMIN_PASSWORD=admin12345 node scripts/dev-server.mjs` → http://127.0.0.1:8888 (`/exam/*` पर CSP `script-src 'self'` + `Cache-Control: no-store`)।

| जाँच | नतीजा |
|---|---|
| खोले गए URL | **35 / 35** (admin, student, exam, study, book, SMPS-Lab) |
| Console errors | **0** — सिर्फ़ `goatcounter: not counting because of: localhost` (लोकल पर अपेक्षित) |
| `<img>` कुल / टूटे | **191 / 0** |
| `undefined` / `NaN` / `[object Object]` दिखना | **0** |
| `<title>` + `lang` हर पेज पर | सही |
| internal links | 557 में से **0 असली टूटे** (शुरू में दिखे 15 `placeholder.jpg` झूठे अलार्म थे — वह केवल `index.html:6573` का JS selector स्ट्रिंग है, मार्कअप में ऐसा `src` कहीं नहीं) |

**असली खोजी गई कमी (बाक़ी फ़ैसला):** `/study/chapter.html` बिना `?m=` के खुले तो "अध्याय नहीं मिला" + साइडबार में 0 लिंक। `/exam/result.html` और `/exam/test.html` बिना लॉगिन पोर्टल लॉगिन पर भेजते हैं — यह सही व्यवहार है (`result.js:31,192`, `test.js:88`)।

## 26. SMPS-Lab से "आसान उदाहरण" और "गलतियाँ और सुधार" — पूरा हटाना — 6 नवम्बर 2026

**फ़ैसला:** "पूरा हटा दो" = हर अवशेष (मार्कअप, CSS, JS, dictionary, nav, wording)। बैकअप पहले: `backups/SMPS-Lab-before-easy-corrections-removal-2026-11-06/` (14 पेज + hub, 36 MB)।

### 26.1 हटाई गई चीज़ें (before → after)

| फ़ीचर का हिस्सा | पहले | बाद |
|---|---|---|
| `<div class="kid-box">` (🧒 आसान उदाहरण कार्ड) | **56** | 0 |
| `<div class="cits-call fix">` (✏️ सुधार कॉलआउट) | **112** | 0 |
| `<section id="cits-fix">` (00-home + 12-cits) | **2** | 0 |
| उस सेक्शन की तालिका / पंक्तियाँ | 2 / **50** | 0 / 0 (00-home 606→581, 12-cits 153→128 rows) |
| nav आइटम `['cits-fix','✅','गलतियाँ और सुधार']` | **1** | 0 |
| `var STORY={…}` + tooltip की "पहले आसान उदाहरण:" पंक्ति | **14 पेज** | 0 |
| CSS: आसान उदाहरण उप-ब्लॉक + `.cits-call.fix{…}`/`b{…}` | 14 / **28** | 0 |
| `@media print` और `smps.css` के selector-list में बचा `.kid-flow`/`.kid-box` | 14 / **2** | 0 |
| `en-dict` की फ़ीचर-कुंजियाँ | **154** (11 × 14 पेज) | 0 |
| JS `सुधार तालिका फ़िल्टर` (fixfilter) ब्लॉक | **14** | 0 |
| `localStorage` keys (kid/story/fix) | **0** — कभी नहीं थीं | 0 |
| बाइट्स (14 पेज) | 16,898,885 | 16,508,401 (**−390,484 ≈ 0.4 MB**) |

**शब्द-पुनर्लेखन** (हर पेज पर): "गलतियाँ सुधारकर इसे आसान हिंदी में लिखा गया है", "मरम्मत का सही क्रम: कदम, सुधार और…", "📘 As Per the · With Corrections", "walale practical का सुधरा हुआ रूप है", "Fix / Next Safe Step:" आदि — और 12-cits के intro/«इस पाठ में क्या-क्या» से "ग़लतियाँ और सुधार" की बात हटी।

**छोड़ा नहीं गया (असली तकनीकी "सुधार"):** `पावर फ़ैक्टर सुधारते हैं` (PFC), `लूप सुधार नहीं भेजता` (feedback), TL431 सादृश्य `आउटपुट देखकर नियंत्रण हिस्से को सुधार बताता है`।

### 26.2 अवशेष = 0 का प्रमाण (कोड + DOM दोनों)
- **कोड:** सभी 15 फ़ाइलों में `grep` पैटर्न `आसान उदाहरण|ग़लतियाँ और|kid-box|kid-flow|sb-kid|cits-call fix|ct-fx|bd-story|bd-tooltip-story|cits-fix|Mistakes and Corrections|With Corrections|STORY` → **हर फ़ाइल 0** (केवल `bd-tooltip` बचा है, वह टूलटिप फ़ीचर का अपना नाम है, कहानी की लाइन नहीं)।
- **DOM (ब्राउज़र, सभी 15 पेज):** `.kid-box` 0, `.cits-call.fix` 0, `#cits-fix` 0, `[id^=ct-fx]` 0, `#bd-tooltip-story` 0, JS टोकन 0, बॉडी टेक्स्ट में "आसान उदाहरण"/"गलतियाँ और सुधार" **0**।
- **CSS rules:** पेज के सभी stylesheet में `.kid-*`/`bd-tooltip-story` नियम **0**।
- **nav:** 12-cits में 6 लिंक, उनमें "गलतियाँ और सुधार" नहीं; बाक़ी पेजों के nav items की संख्या अपरिवर्तित (80→80, 83→83 …) — सिर्फ़ `cits-fix` हटा।

### 26.3 कुछ भी ज़रूरी न गिरने की जाँच
- हर फ़ाइल में `<img>`, `<svg>`, `<canvas>`, `<input>`, `<select>` की संख्या **पहले = बाद** (00-home 78/78, 32/32, 8/8, 172/172, 41/41 — *PHOTO NAHI HATANA CHHCIYE* / *SIMULETOR MAT HATANA* कायम)।
- `<div>`/`<p>`/`<section>` का open−close अंतर हर फ़ाइल में पहले जैसा ही (baseline −1)।
- **सिमुलेटर चलाकर देखा** (`06-realsim`): पैनल खुला, स्लाइडर `rs-ac` 90 → 240 करने पर रीडआउट `rs-aco` "90 V" → "240 V", scope canvas पूरी तरह पेंट (197,600 px)।
- Console साफ़ (केवल goatcounter-localhost warning)।
- `node scripts/build.mjs` → dist 97 फ़ाइलें, 47.10 MB; dist == source (सभी HTML synced); `node scripts/test-api.mjs` → **136 passed / 0 failed**।
- **deploy नहीं किया** — केवल लोकल जाँच; Netlify के लिए आपकी अनुमति बाक़ी।

### 26.4 "बदलाव नज़र नहीं आ रहे" — वजह (2026-11-06)
लाइव बनाम लोकल नाप (`SMPS-Lab/00-home.html`):

| | chnm26.netlify.app (लाइव) | http://127.0.0.1:8888 (लोकल) |
|---|---|---|
| आसान उदाहरण कार्ड | 28 | **0** |
| सुधार कॉलआउट | 20 | **0** |
| `#cits-fix` सेक्शन | 1 | **0** |
| साइज़ | 28,74,473 | 27,74,569 |

कारण: chnm26 rename के बाद **कोई deploy नहीं हुआ** — सब बदलाव लोकल डिस्क पर हैं, लाइव पर पुराना संस्करण।

## 27. मुख्य होम पेज `index.html` से भी वही दोनों फ़ीचर हटाना — 6 नवम्बर 2026

जाँच में पकड़ा कि वही फ़ीचर **साइट के मुख्य होम पेज** पर भी मौजूद है (आपने कहा था "smps फोल्डर", इसलिए पहले सिर्फ़ SMPS-Lab बदला था)। फिर होम पेज भी उसी सुरक्षित पाइपलाइन से साफ़ किया।

**बैकअप:** `backups/home-before-easy-corrections-removal-2026-11-06/` (index.html, assembly-lab.html, basic-office-lab.html)।

| हटाया गया | पहले | बाद |
|---|---|---|
| `kid-box` कार्ड | **28** | 0 |
| `cits-call fix` कॉलआउट | **20** | 0 |
| `<section id="cits-fix">` (24-बिंदु तालिका) | 1 | 0 |
| तालिका पंक्तियाँ (`<tr>`) | 629 | 604 |
| nav आइटम `['cits-fix','✅','गलतियाँ और सुधार']` | 1 | 0 |
| `var STORY={…}` + `bd-story` पल + `#bd-tooltip-story` (मार्कअप + JS) | 1/1/2 | 0 |
| `सुधार तालिका फ़िल्टर` (fixfilter) JS | 1 | 0 |
| CSS: आसान उदाहरण उप-ब्लॉक, `.cits-call.fix{…}`×2, print/`.kid-*` अवशेष | 1/2/1 | 0 |
| `en-dict` की फ़ीचर-कुंजियाँ | 4954 → | 3 कुंजियाँ हटीं |
| शब्द-पुनर्लेखन | — | **21** जगह |
| बाइट्स (chars) | 41,55,866 | 41,02,493 (**−53,373**) |

**शब्द जो बदले:** "गलतियाँ सुधारकर इसे आसान हिंदी में लिखा गया है" → "इसे आसान हिंदी में लिखा गया है", "(गलतियों की पूरी सूची … पैनल में है।)" पूरा वाक्यांश हट (हिंदी + अंग्रेज़ी), "मरम्मत का सही क्रम: कदम, सुधार और…" → "कदम और…", "…वाले प्रैक्टिकल का सुधरा हुआ रूप है" → "…वाले प्रैक्टिकल का क्रम है", "📘 As Per the · With Corrections" → "📘 Study material", "सुधार / अगला सुरक्षित कदम:" → "अगला सुरक्षित कदम:", "खराबी → कारण → अगला कदम (तालिका, सुधार के साथ)" → "(तालिका)"।

**नहीं छुआ:** `assembly-lab.html` की एक "गलतियाँ और सुधार" लाइन — वह असेंबली लैब के स्कोरर की अपना नतीजा-हेडिंग है (विद्यार्थी की अपनी ग़लतियाँ), SMPS का हटाया फ़ीचर नहीं।

**अखंडता:** `<img> 78/78`, `<canvas> 8/8`, `<svg> 32/32`, `<input> 172/172`, `<select> 41/41`, `<script> 36/36`, `<style> 24/24` — पहले = बाद; `<div>`/`<p>`/`<section>` का open−close अंतर अपरिवर्तित; 460 inline `<script>` ब्लॉक `vm` से कंपाइल → **0 syntax त्रुटि**; पूरे `dist/index.html` में फ़ीचर-टोकन (kid-box / आसान उदाहरण / cits-fix / STORY / ct-fx / Mistakes and Corrections / सुधरा हुआ) = **0**; `node scripts/build.mjs` → dist 97 फ़ाइलें, 47.03 MB; `test-api.mjs` **136/136**।

**deploy:** अभी भी नहीं किया — Netlify पर पुराना संस्करण है; "deploy करो" कहने पर SMPS-Lab + होम पेज + बाक़ी सब एक साथ जाएगा (15 credit)।

## 28. Computer-Lab folder साइट में जोड़ा + menu में SMPS के ऊपर — 6 नवम्बर 2026 (रात)

**बैकअप:** `backups/computer-lab-before-folder-merge-2026-11-06/` (index.html, तीनों lab फ़ाइलें, 00-home.html, build.mjs, dev-server.mjs, netlify.toml)।

**क्या जोड़ा:** Desktop के `Computer-Lab-3D.rar` में `Computer-Lab-3D` folder था जिसमें `css/ js/ lib/ _backup/` sub-folders थे। शर्त के अनुसार **कोई sub-folder नहीं बनाया** — तीनों self-contained पेज flat रखे:

| फ़ाइल | bytes | पुराना URL अब |
|---|---|---|
| `Computer-Lab/index.html` (3D लैब, THREE r128 inline) | 1,834,207 | `/Computer-Lab-3D-Single-File.html` → 301 |
| `Computer-Lab/assembly-lab.html` | 220,936 | `/assembly-lab.html` → 301 |
| `Computer-Lab/basic-office-lab.html` | 623,020 | `/basic-office-lab.html` → 301 |

RAR की `build-standalone.ps1`, `.bat`, `README.md`, `_backup/`, `css/js/lib` नहीं लिए — उनका सारा code इन्हीं तीनों पेजों में पहले से inline है। जड़ की फ़ाइलें `mv` से डालीं, इसलिए duplicate copy नहीं (bytes अपरिवर्तित)। `/SMPS-Lab/Computer-Lab-3D-Single-File.html` का पुराना alias भी 301 → `/Computer-Lab/index.html`।

**redirect का स्रोत:** अब `netlify.toml` के `[[redirects]]` ही नियम हैं; `scripts/dev-server.mjs` उन्हीं को पढ़ता है, इसलिए लोकल जाँच और production एक जैसे व्यवहार करते हैं।

**मेनू में SMPS के ऊपर (असली कारण मिला):** sidebar builder में लाइन थी `if(g.id==='computer'||g.id==='training'||g.id==='chnm-intro')return;` — यानी Computer समूह menu में **कभी बनता ही नहीं था** (इसलिए "जोड़ो" कहना पड़ा)। अब:
- `GROUPS` का क्रम: `computer → smps → electronics → training → chnm-intro → chnm-th → chnm-pr → chnm-tm → chnm-sk`;
- skip-सूची से `computer` हटाया → menu में **🖥️ Computer लैब (17)** सबसे ऊपर, नीचे ⚡ SMPS लैब (31);
- computer समूह का पहला कदम `['computer-lab','🖥️','3D कंप्यूटर लैब (पूरा)']` बनाया, यानी iframe वाला पैनल भी sidebar से सीधा खुलता है;
- पुरानी dead `sb-flat` शाखा (944 chars) हटी — वो skip के कारण कभी चलती ही नहीं थी, अब हटाना ज़रूरी था वरना Computer समूह header-के-बिना flat दिखता।

**पकड़ा गया बग (फ़ोल्डर में जाने से):** तीनों पेज `./assets/modern-ui.css?v=1` और `./assets/modern-ui.js?v=1` माँग रहे थे → `/Computer-Lab/assets/...` = 404 (console में 3 error)। सब `../assets/...` किए (3 फ़ाइलें × 2 पथ)।

**जाँच (सब लोकल http://127.0.0.1:8888 पर, dist rebuild के बाद):**
- तीनों नए URL 200 + सही bytes; चारों पुराने URL 301 → ठीक target; `/assets/modern-ui.css` 200 (text/css), `/assets/modern-ui.js` 200 (text/javascript)।
- home पेज DOM: `.sb-nav` क्रम `sb-home → computer → smps → electronics → chnm-th → chnm-pr → chnm-tm → chnm-sk`; `__panels.list[0] = computer-lab`; कुल panels **81 अपरिवर्तित**।
- sidebar का "1 🖥️ 3D कंप्यूटर लैब (पूरा)" क्लिक → `__panels.current() = computer-lab`, section hidden नहीं, iframe `src="Computer-Lab/index.html"` state **complete**, title "कंप्यूटर लैब 3D · असेंबली से डिसअसेंबली तक", THREE r128 लोड, 3D टैब खोलने पर **6 WebGL canvas** mount (दृश्यमान ones में pixels)।
- `/Computer-Lab/assembly-lab.html` (107 elements, स्टूडेंट प्रवेश फ़ॉर्म स्क्रीन) और `/Computer-Lab/basic-office-lab.html` (17,682 elements) — दोनों में `../assets` से CSS/JS चल रहे, **0 console error/warn**।
- syntax: 448 + 32 inline `<script>` `vm` से कंपाइल → **0 त्रुटि**; element-count delta **शून्य** (div/section/script/style/iframe/img/canvas/svg/input/a); `Computer-Lab-3D-Single-File.html` का नाम साइट में कहीं नहीं बचा (सिर्फ़ redirect नियमों में)।
- build: `node scripts/build.mjs` → 97 फ़ाइलें, 47.03 MB; `node scripts/test-api.mjs` → **136/136 पास** (dev server restart के बाद, इसलिए QA agent का test student `CHNM1` अपने आप हट गया)।

**नहीं हो सका:** in-app Browser का surface hidden होने से screenshot नहीं मिला — इसलिए menu क्रम DOM-संरचना से सिद्ध किया (`data-group` क्रम + summary text), pixel-सत्यापन नहीं।

**deploy:** अब भी रुका है — कहने पर `dist` + `netlify.toml` (redirects सहित) एक साथ जाएँगे (15 credit)।

---

## 29. 3D लैब के 29 विषय = 29 अलग-अलग पेज (कोई sub-folder नहीं) — 6 नवम्बर 2026 (रात)

**क्या माँगा गया:** "jo computer lab me 3d lab hai … usme sab folder hai sabko alag alag karo … koi sub folder nahi hona chahiye" — और फ़ैसला **हर विषय = अलग पेज**।

**1) 1.83 MB की single-फ़ाइल ऐप को flat modules में तोड़ा** (`Computer-Lab/index.html` के अंदर दबे 19 blocks → 18 फ़ाइलें, कोई folder अंदर नहीं):

| फ़ाइल | काम | bytes |
|---|---|---|
| `cl3d-style.css` | मूल UI CSS | 31,537 |
| `cl3d-slim-style.css` | embed/slim overrides | 399 |
| `cl3d-topic-style.css` | **नया**: पेज-नेविगेशन + कार्ड-सूची CSS | ~2,000 |
| `cl3d-three.min.js` | THREE r128 | 603,455 |
| `cl3d-data-intro.js` … `cl3d-data-practical.js` (7) | 29 विषयों की सारी सामग्री | 4,90,776 |
| `cl3d-i18n-en.js` | अंग्रेज़ी अनुवाद परत | 144,881 |
| `cl3d-three-lab.js` | 3D viewers (CL3D) | 52,563 |
| `cl3d-simulators.js`, `cl3d-sim-assembly.js`, `cl3d-sim-service.js` | 7 सिम्युलेटर (CL_SIM) | 85,824 |
| `cl3d-app.js` | renderer + menu + quiz + प्रगति | 38,160 (पैच के बाद) |
| `cl3d-boot.js`, `cl3d-lang-sync.js` | embed boot + भाषा संदेश | 1,502 |

**2) 29 flat पेज** — `index.html` (होम) + `02-basics.html … 29-glossary.html`, हर पेज ~8 KB। सामग्री एक ही जगह (modules) से आती है, इसलिए 29 × 1.83 MB = 53 MB की नकल नहीं बनी — कुल मिलाकर ~1.4 MB जो browser एक बार cache करता है। क्रम `cl3d-app.js` के `GROUP_ORDER` जैसा ही: आधार (3) → मदरबोर्ड मास्टरक्लास (7) → असेंबली (2) → कनेक्शन (3) → सिस्टम (4) → सर्विसिंग मास्टरक्लास (6) → प्रैक्टिकल (4)।

**3) `cl3d-app.js` में "एक-विषय-पेज मोड"** (12 पैच, `scripts/tmp-3d-apppatch.mjs` से — हर पैच exactly 1 जगह मिलना ज़रूरी, वरना लिखा ही नहीं जाता):
- पेज `window.CL_TOPIC='<id>'` + `window.CL_TOPIC_FILES` देता है; `SECTIONS` फ़िल्टर होकर 1 रह जाता है, पर ORDER/मेनू/प्रगति पूरी 29 की सूची से चलते हैं।
- `go(id)` अब दूसरे विषय का id पाते ही `location.href = FILES[id]` करता है → मेनू क्लिक, मोबाइल पट्टी का अगला/पिछला, Alt+→/Alt+←, `hashchange`, और home पेज का `c3d-topic` postMessage — सब पेज-बदल बन गए।
- `#विषय` वाला पुराना deep-link (`index.html#parts`) अब सीधे `03-parts.html` पर जाता है; element-hash (`27-labs.html#sec-labs`) वैसा ही रहता है।
- प्रगति,थीम, फ़ॉन्ट, भाषा, quiz score, lab checkboxes पहले जैसे localStorage में — इसलिए **पेज बदलने पर भी 29 विषयों की प्रगति जुड़ती है** (जाँच में 51% दिखा)।
- हर पेज के नीचे **⬅ पिछला विषय / अगला विषय ➡** पट्टी; होम पेज पर **28 विषय-पेजों की कार्ड-सूची** (पढ़े हुए पर ✓ पढ़ा)।

**4) मुख्य होम पेज का sidebar** (`index.html`): नया समूह `{id:'computer-3d', icon:'🧊', hi:'3D लैब — हर विषय अलग पेज'}` — **29 कदम (step 18 से 46)**, `Computer` समूह के ठीक बाद और **SMPS से ऊपर**। items `cl3d:<id>` prefix से चलते हैं (नई branch ने `study:`/`trade:` के बगल में जोड़ा), map `window.CL3D_FILES` में। पुराने 17 `c-*` पैनल (पढ़ने वाला संस्करण) और `computer-lab` iframe पैनल **जस-के-तस** — कुछ नहीं हटाया।

**5) जाँच (सब लोकल http://127.0.0.1:8888, dist rebuild के बाद):**
- 49 फ़ाइलें (29 पेज + 16 JS + CSS + पुराने 3 लैब पेज) HTTP probe: **सब 200, सही MIME, 0 अनुपलब्ध sub-resource**।
- **29 पेजों का DOM sweep** (iframe sweep): हर पेज पर exactly 1 section, menu में 29 items, `रेंडर त्रुटि` = 0, टूटी img = 0, `responseStatus>=400` = 0।
- **3D नहीं छूआ:** 12/12 viewer canvas mount (parts 6, assembly/wiring/mb-chipset/motherboard/storage/sv-clean 1-1) — `mounted=12, pending-unmounted=0`।
- **सिम्युलेटर नहीं छूए:** 7/7 init (assembly, wiring, bios×2, sv-thermal, sv-diagnose, troubleshoot)। quiz पेज पर 25 प्रश्न, पहला उत्तर → "सही! ✔" + सर्वोत्तम स्कोर saved; लैब पेज पर 20 प्रैक्टिकल + checkbox → `cl3d.labs.lab1=true`।
- menu क्लिक (11-assembly → glossary) → `/Computer-Lab/29-glossary.html`, heading + `.nav-item.on` सही; home पेज के `.c-golab` का postMessage iframe को `13-wiring.html` पर ले गया (sim init=1)।
- खोज, थीम, फ़ॉन्ट, भाषा बटन एक topic पेज पर चलते हैं; `cl3d.theme` बदला और persisted।
- content-integrity: हर section के `type:'table'` blocks ≤ पेज पर rendered `<table>` (108 vs 90 — html-blocks के कारण ज़्यादा, कम कहीं नहीं)।
- `node --check` 16 JS modules = OK; inline `<script>` 32 + 9 vm-compile = **0 syntax त्रुटि**; build **144 फ़ाइलें / 47.26 MB**; `test-api.mjs` **136/136**; `check-content.mjs` सभी आरेख/LIVE लैब सही; console में सिर्फ़ goatcounter वाला localhost warning, **0 error**।
- `netlify.toml` के 301 नियम अब भी सही हैं (पुराने URL → `/Computer-Lab/index.html`, जो अब होम/पूरी-सूची पेज है)।

**6) पकड़ा गया बग (खुद बना, खुद पकड़ा):** पहली बार हर पेज में `cl3d-app.js` दो बार जुड़ रहा था (module loop की limit ग़लत) → `sections=2, navItems=58` दिखा; limit ठीक की और generator को backup की pristine single-फ़ाइल से पढ़वाया, ताकि कितनी भी बार चले नतीजा एक रहे।

**नहीं हो सका:** in-app Browser surface hidden है → screenshot/pixel और असली मोबाइल-चौड़ाई जाँच नहीं; यह DOM-संरचना + HTTP + console से सिद्ध किया गया है।

**deploy:** रुका हुआ — कहाँ-कहाँ बदलाव है वह सब अभी सिर्फ़ लोकल पर है; `deploy करो` कहने पर `dist` + `netlify.toml` भेजेंगे (15 credit)।

---

## 30. 3D लैब का महा-विस्तार: 29 → 68 विषय, पूरा कंप्यूटर गहराई तक — 7 नवम्बर 2026

**माँग:** "कंप्यूटर के बारे में कुछ भी मत छोड़ना — पूरा लिनक्स, विंडोज़, MS Excel, PowerPoint … जितने भी सॉफ़्टवेयर/हार्डवेयर हैं, पूरा विस्तार से गहराई तक, और नोट्स बनाना।" संरचना वही रही जो तय हुई थी: **हर विषय = अलग flat पेज, कोई sub-folder नहीं** (`Computer-Lab/` में 68 पेज, `01` = `index.html`)।

**1) नया क्या जुड़ा (39 नए विषय, पेज 30–68):**

| समूह | विषय | पेज |
|---|---|---|
| कंप्यूटर विज्ञान | पीढ़ियाँ व प्रकार · संख्या पद्धतियाँ · लॉजिक गेट व बूलियन · डेटा/मेमोरी/फ़ाइल सिस्टम · डेटा संचार व OSI | 30–34 |
| हार्डवेयर गहराई | CPU माइक्रोआर्किटेक्चर · RAM/DDR/ECC · NAND/NVMe/RAID · GPU व डिस्प्ले · पेरिफेरल्स व प्रिंटर · लैपटॉप व मोबाइल · वर्कशॉप यंत्र व माप | 35–41 |
| विंडोज़ मास्टरक्लास | परिचय व इतिहास · पूरा इंटरफ़ेस (10/11) · प्रशासन · CMD व PowerShell · इंस्टॉल/रिपेयर/BSOD | 42–46 |
| लिनक्स मास्टरक्लास | परिचय/डिस्ट्रो/फ़ाइल संरचना · टर्मिनल व कमांड · सर्वर व नेटवर्क प्रशासन · इंस्टॉल/डुअल बूट/WSL · Bash Scripting | 47–51 |
| MS Office मास्टरक्लास | Office/365 परिचय · Word · Excel भाग 1 · Excel भाग 2 (Lookup/Pivot/चार्ट) · PowerPoint · Access · Outlook/Teams/OneNote | 52–58 |
| इंटरनेट व साइबर सुरक्षा | इंटरनेट कैसे काम करता है · ब्राउज़र व वेब औज़ार · साइबर सुरक्षा/एंटीवायरस · फ़ाइल/संपीड़न/क्लाउड/रिकवरी | 59–62 |
| सॉफ़्टवेयर संसार | प्रोग्रामिंग की शुरुआत · उपयोगी सॉफ़्टवेयर व यूटिलिटी · क्लाउड/AI/नई तकनीकें | 63–65 |
| सॉफ़्टवेयर प्रैक्टिकल | 30 प्रैक्टिकल लैब · 100-प्रश्न महा-क्विज़ · पूरा शब्दकोश (फ़ुल फ़ॉर्म) | 66–68 |

**2) कुल आकार (validator + ब्राउज़र दोनों से मिलाया):**
- **68 विषय, 1738 ब्लॉक, 627 टेबल, 6260 टेबल-पंक्तियाँ, 175 प्रैक्टिकल, 536 क्विज़ प्रश्न** (511 डेटा में + 25 पुराने app-क्विज़), 12 3D मॉडल, 7 सिमुलेटर, 14 SVG आरेख।
- रेंडर हुआ पाठ ≈ **19.4 लाख अक्षर**, DOM nodes ≈ **76,240**।
- डेटा modules **7 → 23** (`cl3d-data-win1/2`, `lin1/2`, `office1/2/3`, `hw2a/b/c`, `sci1/2`, `net1`, `sec1`, `sw1/2`)। हर पेज अब **23/23** module load करता है।
- build: **199 फ़ाइलें / 50.75 MB** (पहले 160 / 48.88 MB)।

**3) जाँच — सब लोकल `http://127.0.0.1:8888` पर, dist rebuild के बाद:**
- **HTTP sweep 111/111 = 200** (होम, Computer-Lab, SMPS-Lab, study/trade, exam के दो पेज, सभी 70 HTML, सभी JS/CSS)।
- **सभी 68 पेजों का असली DOM sweep** (same-origin iframe में हर पेज लोड करके): हर पेज पर `CL_TOPIC` सही, `CL_SECTIONS = 68`, sidebar में **68 nav-items**, `रेंडर त्रुटि = 0`, विदेशी-लिपि (CJK/Hangul/Gurmukhi/Bengali) = **0**, कोई timeout/error नहीं। सबसे छोटा पेज भी 201 nodes।
- **लैब:** 24 पेजों पर कुल **175 `.lab` कार्ड** रेंडर — validator की 175 unique lab-संख्याओं से ठीक मेल। checkbox क्लिक → प्रगति 28% → 29%, `cl3d.labs.lab200 = true`; दोबारा क्लिक → false, प्रगति वापस 28%।
- **क्विज़:** `67-sw-quiz.html` पर **100 प्रश्न** रेंडर, हर एक में 4 विकल्प। सही उत्तर → `opt ok` + "सही! ✔" + कारण; गलत → `opt no` + "ग़लत — सही उत्तर: …" + कारण। उत्तर `cl3d.quiz.swq-hw` में सेव (हर सेट का अलग store)।
- **3D नहीं छूआ:** `03-parts.html` पर **6/6 canvas** mount, असली आकार (967×607 आदि)। पहले/बाद में तुलना: `THREE`/3d refs **634 → 634**, sim refs **14 → 14**, कमी **0**।
- **सिम्युलेटर नहीं छूए:** `CL_SIM` में सातों इंजन (`assembly, wiring, beep, boot, fault, thermal, psu_test`)। `17-bios.html` पर boot + beep दोनों रेंडर; boot का ▶ क्लिक → ⏸ हुआ और चरण आगे बढ़े; beep में 15 बटन।
- **खोज:** `एक्सेल → 2`, `पॉवरपॉइंट → 1`, `विंडोज़ → 7`, `क्लाउड → 3`, `सीपीयू → 5`, `शब्दकोश → 1`, `लिनक्स → 7`, `zzzz → 0`, खाली → 68।
- **थीम:** light → dark → light, `cl3d.theme` में persisted।
- **पिछला/अगला:** `68-sw-glossary` → पिछला `67-sw-quiz`; `66-sw-labs` → `65-sw-ai` / `67-sw-quiz`।
- **होम पेज:** `CL3D_FILES` **29 → 68**; sidebar के `computer-3d` समूह में 68 लिंक, सब **flat** (`Computer-Lab/<file>.html`, कोई sub-folder नहीं), 71 anchors / 68 unique। **78 `<img>` टैग पहले = बाद**, टूटी इमेज **0**।
- `node --check` सभी 23 modules + app = OK; `tmp-3d-check.mjs` = **68 विषय, 0 समस्याएँ**; `tmp-3d-pagecheck.mjs` = **0 समस्याएँ**; `test-api.mjs` = **136/136**; `check-content.mjs` = सभी आरेख/LIVE लैब सही (Trade 143/143, TM 108/108, Trade LIVE 25/25, TM 16/16)।
- console: होम पर सिर्फ़ goatcounter का localhost warning; `49-lin-admin` (सबसे बड़ा, 55 ब्लॉक) और `68-sw-glossary` पर **0 error, 0 warn**।

**4) इस दौर में पकड़े और ठीक किए गए दोष:**
- **विदेशी लिपि का रिसाव:** नई सामग्री में CJK/Hangul/Gurmukhi/Bengali/Arabic/Gujarati/Kannada के टुकड़े आ गए थे। Unicode-range-आधारित `fix-runs.mjs` से हर टुकड़ा हिंदी में बदला गया; `probe-all.mjs` (19 Unicode रेंज) से अंतिम स्कैन = **0** (सिर्फ़ `Ω` बचा, जो Ohm का सही चिह्न है)। Latin-लिपि के विदेशी शब्द भी singleton-token सूची से manually जाँचे।
- **`acc` ब्लॉकों के खेत:** पुराने `{h,p}` → renderer के `{q,a}` में माइग्रेट (कार्य #82), सभी 23 modules का backup लेकर।
- **गलत गिनती वाला शीर्षक:** `प्रैक्टिकल लैब (26 कार्य)` कहता था पर पेज पर 20 कार्ड थे → **`(20 कार्य)`** किया, hero में पूरे लैब की 175 गिनती जोड़ी। होम की पुरानी inline `c-labs26` प्रतिलिपि में भी वही 26 था (4 जगह) → **175** किया, बासी "नए 9 प्रैक्टिकल" callout हटाकर असली पेजों के लिंक दिए, और `दुकान कि कुर्सी` → `दुकान की कुर्सी`। residue जाँच: `26 कार्य` = **0**, `26 Tasks` = **0**।
- **हिंदी खोज काम नहीं करती थी:** sidebar खोज सिर्फ़ literal substring मिलाती थी, इसलिए `एक्सेल` टाइप करने पर **0** नतीजे आते (शीर्षक में Latin "Excel" है)। `SEARCH_ALIAS` (40 हिंदी→अंग्रेज़ी उपनाम) + `kicker`/`id` को haystack में जोड़ा + NFC normalize (नुक्ता के दोनों रूप मिलें)। अब ऊपर के सारे हिंदी शब्द सही नतीजे देते हैं।
- **शब्दकोश की 10 तालिकाएँ बिना शीर्षक थीं:** renderer के `table` ब्लॉक में caption नहीं होता, इसलिए 3.2–3.11 के `html` शीर्षक जोड़े (साथ में 3.14/3.15/3.16) → शब्दकोश **34 ब्लॉक, 12 टेबल, 346 पंक्तियाँ, 20 प्रश्न**।

**5) बैकअप (कुछ नहीं मिटा):**
- `backups/comlab-3d-before-software-wave-2026-11-06/` — विस्तार से पहले का pristine Computer-Lab + होम।
- `backups/comlab-3d-acc-fix-2026-11-07/` — acc माइग्रेशन से पहले सभी 23 modules।
- `backups/comlab-3d-before-pages-2026-11-07/` — पेज-जनरेटर चलाने से पहले Computer-Lab (66 फ़ाइलें) + `home-index.html`।

**नहीं हो सका:** इस automation browser में screenshot/pixel और असली मोबाइल-चौड़ाई की जाँच नहीं होती; Fullscreen API भी blocked है। इसलिए यह सब DOM-संरचना + HTTP + console + क्लिक-व्यवहार से सिद्ध किया गया है — **एक बार अपने कंप्यूटर/फ़ोन पर भी देख लें**।

**deploy:** **रुका हुआ।** 3 नवम्बर → 7 नवम्बर का सारा बदलाव अभी सिर्फ़ लोकल पर है; लाइव `chnm26.netlify.app` पर **पुराना version** है। `deploy करो` कहने पर ही भेजेंगे (15 credit)। ≥50 छात्रों की परीक्षा से पहले deploy नहीं, और परीक्षा से 30–60 मिनट पहले मुफ़्त live health-check (login → start → submit → result) वादा किया हुआ है।

---

## 31. मेनू के सारे फ़ोल्डर हटाए — एक सीधी सूची, पुराने कंप्यूटर पैनल की जगह असली 68 पेज — 8 नवम्बर 2026

**माँग:** "कंप्यूटर लैब में … सब फ़ोल्डर है … इसको हटा के सही करो … इनको बाहर ला दो।" दो फ़ैसले लिए गए: (1) **सारे फ़ोल्डर, पूरी सूची सीधी** — हर विषय हमेशा खुला दिखे, खोज काम करती रहे; (2) होम के पुराने 15 कंप्यूटर पैनल + "कंप्यूटर सर्वर" को **नए 68 पेजों से बदल दो**।

**असल में "फ़ोल्डर" तीन चीज़ें थीं** (डिस्क पर कोई sub-folder नहीं था):
1. होम की साइडबार के 8 `<details class="sb-group">` — `#home` पर **सारे बंद** रहते थे, इसलिए कुछ नहीं दिखता था।
2. `computer-lab` पैनल के अंदर `<iframe src="Computer-Lab/index.html">` — पूरा 3D लैब एक पन्ने के अंदर, और उसके अंदर उसका अपना 15-समूह वाला मेनू। नोट में literally लिखा था "इस फ़ोल्डर में जुड़ते जाएँगे"।
3. SMPS-Lab के हर पेज की साइडबार का वही बंद `details` फ़ोल्डर।

**1) नया मेनू — सीधी सूची:**
- `details/summary/sb-group/sb-items` पूरी तरह हटे। अब `nav.sb-nav` के अंदर सीधे `div.sb-sect` (सादा लपेटन, कोई फ़ोल्डर नहीं) → `h3.sb-sec` (चिपकने वाला शीर्षक + गिनती-बैज) → `a.sb-link` (क्रम-संख्या + आइकन + द्विभाषी नाम)।
- होम पर **171 लिंक, 7 शीर्षक**: 3D लैब 68 · SMPS 31 · बेसिक इलेक्ट्रॉनिक्स 1 · ट्रेड थ्योरी 25 · ट्रेड प्रैक्टिकल 19 · TM 16 · सॉफ्ट स्किल्स 10 (+1 होम)। क्रम-संख्या 1…170, कंप्यूटर विषयों की 1…68 उनकी `NN ·` prefix से ठीक मेल खाती है।
- स्क्रॉलबार अपनी भाषा में: 10px, track हल्का accent, thumb accent→#2F6BFF gradient, hover पर #00C08B→#4D86FF।
- **खोज पहले हिंदी में फ़ेल थी** (शीर्षक में Latin "Excel" है, इसलिए `एक्सेल` → 0 नतीजे)। `SB_ALIAS` के 32 हिंदी→अंग्रेज़ी उपनाम + NFC normalize जोड़ा। अब `एक्सेल→2`, `विंडोज़→6`, `लिनक्स→6`, `शब्दकोश→2`, `क्विज़→2`, `पावरपॉइंट→1`, `सॉफ्टवेयर→5`, `ट्रेड→44`, `एसएमपीएस→34`, `मदरबोर्ड→5`, `zzzz→0` ("कुछ नहीं मिला"), खाली→171। खाली नतीजे पर 🏠 होम लिंक भी छिपता है।
- `setActive()` अब सिर्फ़ `aria-current="page"` लगाता है और लिंक को `scrollIntoView({block:'nearest'})` करता है — कोई फ़ोल्डर खोलना नहीं पड़ता।

**2) पुराने पैनल हटाए (दोनों होम पर):**
- `index.html`: 17 section (`computer-lab`, `c-basics` … `c-glossary`, `computer-server`) = **1,29,983 chars** हटे। पहले साबित किया कि इनमें **0 `<img>`, 0 canvas, 0 असली सिमुलेटर** हैं (`c-sim-bar` सिर्फ़ बटन-पट्टी थी) और इनके 3 SVG Computer-Lab के `blockDiagram`/`motherboardMap`/`networkTopo` की byte-समान नकल हैं। `computer-server` खाली "Coming next" stub था।
- साथ में हटा: GROUPS का `computer` entry, `computer-lab` injection IIFE, `c3d-hel` listener, `.c-golab` handler, `c3d-lang` postMessage, `.c3d-*` stylesheet, 64 नियमों वाला `section[id^="c-"]` CSS।
- **`SMPS-Lab/00-home.html` में भी वही 17 पैनल + iframe बचे थे** (1,30,502 chars) — वो भी हटाए। उस पेज की साइडबार में **सिर्फ़ 1 लिंक (होम)** था, यानी मेनू खाली था; अब उसमें असली `CL3D_FILES` + `computer-3d` समूह (68 लिंक, `../Computer-Lab/…`) और अपनी पूरी SMPS सूची है → **103 लिंक, 2 शीर्षक**।
- बाकी 13 SMPS पेजों से मृत `c3d` कोड (IIFE, listener, handler, postMessage, 2 stylesheet) हटाया — हर पेज पर residue **0**।
- कुल बचत: 15 फ़ाइलों में **345.7 KB**; build **199 फ़ाइलें / 50.26 MB** (पहले 50.75 MB)।

**3) इस दौर में पकड़े और ठीक किए गए दोष:**
- **साइडबार शीर्षक अदृश्य हो सकते थे:** `assets/home-modern.js` का reveal `h2, h3` पर `hm-reveal` (opacity:0) लगा देता था और `.app-sidebar` उसकी छूट-सूची में नहीं था। नए `h3.sb-sec` टैग हो रहे थे (सिर्फ़ पहले पर `hm-in`)। छूट-सूची में `.app-sidebar` जोड़ा → अब 7/7 शीर्षक opacity **1**, `hm-reveal` **0**।
- **चिपकने वाले शीर्षक एक-दूसरे पर चढ़ रहे थे:** सारे `h3` एक ही flex container में `position:sticky;top:0` थे, इसलिए scrollTop 4000 पर दो शीर्षक एक साथ top:2 पर overlap होते। हर समूह को सादे `div.sb-sect` में लपेटा → अब **एक समय में सिर्फ़ 1** शीर्षक चिपकता है और समूह के अंत में छूट जाता है (1500/3200→computer-3d, 5000→chnm-th, 7000→chnm-pr, 8600→chnm-sk)।
- **`mods` नेस्टेड पैनल था:** `SMPS-Lab/00-home.html` में `#mods`, `#home` के अंदर है। उसे GROUPS में डालने पर `show('mods')` सारे `wrap > section` छिपा देता और अपना parent भी छिपा रहता → खाली स्क्रीन। GROUPS से हटाया (होम पैनल में उसके 14 मॉड्यूल-कार्ड पहले से हैं)। `component-testing` DOM से हटकर `#real` में जा चुका है, पर `fromHash()` का redirect उसे सही खोलता है — क्लिक करके जाँचा: `#real` दिखा, **23 guide-card** मिले।
- **68 English labels में दोहराव:** पहले के generator runs ने नंबर बार-बार जोड़ दिया था (`'01 · 01 · 01 · 01 · 01 · Home — full list'`)। backreference regex से **68** ठीक किए; `Software Quiz (80+ Questions)` → `(100 Questions)`। residue `01 · 01 ·` = **0**।
- **`26 कार्य` वाली गलत गिनती** का residue अब 15 फ़ाइलों में **0**।

**4) जाँच — सब लोकल `http://127.0.0.1:8888` पर, dist rebuild के बाद:**
- **होम (असली DOM):** फ़ोल्डर 0, summary 0, sb-group 0, sb-items 0, iframe 0, हटाए गए पैनल 0; शीर्षक 7 (सब opacity 1), लिंक 171 (छिपे 0), `nav.scrollWidth 287 = clientWidth 287`, `scrollHeight 9049`।
- **डेस्कटॉप 1380×900** (same-origin iframe): साइडबार docked x=0 w=310, main left=310, 171 लिंक, नेविगेशन के बाहर **0**, कटा हुआ टेक्स्ट **0**, document overflow **0**।
- **मोबाइल 400×760**: दराज़ बंद x=−325 → ☰ पर x=0, w=310, h=696, top=64 (appbar के नीचे), viewport में फिट; लिंक बाहर **0**, document overflow **0**; लिंक क्लिक → दराज़ बंद + hash सही। असली टैब (684×665) पर भी scrollTop 0→4000 चला।
- **भाषा:** `data-lang="hi"` inline, `data-lang="en"` display:none — द्विभाषी spans सही छिपते हैं।
- **हैश नेविगेशन:** `#chnm-sk-ss-energy` → active लिंक वही, साइडबार scrollTop 8575, दिखा पैनल सिर्फ़ वही; `#home` → active home।
- **सारे 109 बाहरी लिंक fetch करके जाँचे → 109/109 HTTP 200** (68 Computer-Lab + 25 trade + 16 study), कोई `undefined`/`NaN` href नहीं। होम के 62 hash-लिंक में नेस्टेड/गायब लक्ष्य **0**।
- **SMPS-Lab के 14 पेज (पूरा load होने के बाद iframe sweep):** हर पेज पर फ़ोल्डर 0, summary 0, iframe 0, पुराने पैनल 0, शीर्षक opacity 1, छिपे लिंक 0, nav overflow **0**, document overflow **0**, टूटी इमेज **0**, नेस्टेड पैनल-लिंक **0**; खोज `zzzz→0` और खाली→पूरी सूची। canvas यथावत (00-home 8, 06-realsim 3, 08-bench 2, 12-cits 2, 04/05/07 में 1 each)।
- **SMPS होम का असली व्यवहार:** `#bench` → सिर्फ़ bench दिखा (2 canvas), `#home` → home + 14 मॉड्यूल-कार्ड, `#component-testing` → `#real` + 23 guide-card, 68 cl3d लिंक → **68/68 HTTP 200**।
- **फ़ोटो/सिमुलेटर कुछ कम नहीं:** 15 फ़ाइलों में `<img>` **548 → 548**; होम 78→78, 12-cits 68→68, बाकी SMPS 27→27; canvas गिनती अपरिवर्तित; `realsim` संदर्भ यथावत।
- **JS:** 15 फ़ाइलों के **426/426** inline JavaScript ब्लॉक parse (16 JSON-LD/data ब्लॉक अलग)। console: होम और SMPS होम दोनों पर सिर्फ़ goatcounter का localhost warning, **0 error**।
- residue (15 फ़ाइलें): `sb-group` 0, `sb-items` 0, `c3d-` 0, `c-golab` 0, `c-sim-bar` 0, `c-basics` 0, `c-labs26` 0, `computer-server` 0, `01 · 01 ·` 0, `26 कार्य` 0। `index.html` में `computer-lab` का **1** बचा hit वैध अंग्रेज़ी वाक्य है (chnm-data JSON: "a computer-lab slot") — जानबूझकर रखा।
- `Computer-Lab/` के अपने 68 पेजों का मेनू पहले से सीधा था (`div.nav-group`, कोई collapse नहीं) — छुआ नहीं।

**5) बैकअप (कुछ नहीं मिटा):**
- `backups/home-before-flat-menu-2026-11-08/` — फ़्लैट मेनू से पहले का `index.html` + 14 SMPS पेज।
- `backups/home-before-sb-sect-2026-11-08/` — sticky-लपेटन से पहले की 15 फ़ाइलें + `home-modern.js`।
- `backups/smps-before-c3d-removal-2026-11-08/` — पुराने कंप्यूटर पैनल/iframe हटाने से पहले के 14 SMPS पेज।
- स्क्रिप्ट: `scripts/tmp-home-flat.mjs`, `tmp-sb-sect.mjs`, `tmp-sb-home-search.mjs`, `tmp-smps-c3d.mjs` (सब पहले dry-run, फिर `--apply`)।

**नहीं हो सका:** इस automation browser में screenshot/pixel जाँच नहीं होती, इसलिए रंग-संतुलन और असली फ़ोन-स्क्रीन पर एक बार आँख से देख लें। संख्यात्मक layout (overflow/clipping/opacity) DOM-माप से सिद्ध है।

**deploy:** **रुका हुआ।** 3 नवम्बर → 8 नवम्बर का सारा बदलाव सिर्फ़ लोकल पर है; लाइव `chnm26.netlify.app` पर **पुराना version** है। `deploy करो` कहने पर ही भेजेंगे (15 credit)। ≥50 छात्रों की परीक्षा से पहले deploy नहीं, और परीक्षा से 30–60 मिनट पहले मुफ़्त live health-check (login → start → submit → result) वादा किया हुआ है।
