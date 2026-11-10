# Environment Variables (पर्यावरण चर)

ये variables **केवल Netlify Dashboard → Site configuration → Environment variables** में सेट करें। कोई भी secret frontend JavaScript, GitHub repository, CSV या screenshots में न रखें।

## अनिवार्य

| नाम | उदाहरण | विवरण |
|---|---|---|
| `ADMIN_PASSWORD` | `Chnm@Ex@m-2026-Strong` | एडमिन लॉगिन पासवर्ड। कम से कम 12–16 अक्षर; अक्षर + अंक + चिन्ह मिलाएँ। सेट होने पर यही प्राथमिक है। |
| `ADMIN_SECRET` | 32–64 random अक्षर | Admin/student tokens के HMAC signature के लिए। `ADMIN_PASSWORD` से अलग और लंबा रखें। |

## Admin password fallback (server-side)

Netlify के free plan पर कभी-कभी environment variable functions तक नहीं पहुँचता। इसलिए `netlify/lib/admin-credentials.mjs` में **scrypt hash** रखा गया है:

- `ADMIN_PASSWORD` मिलने पर वही इस्तेमाल होता है; fallback नहीं।
- Env variable न मिलने पर fallback hash से login चलता है।
- Token का HMAC signature भी इसी स्थिर fallback hash से बनता है, इसलिए env कभी मिले/कभी न मिले — admin का चालू सत्र नहीं टूटता। (`ADMIN_SECRET`/`ADMIN_PASSWORD` बदलने पर अब भी पुराने tokens अमान्य नहीं होते; पासवर्ड rotate करने पर वे अमान्य होते हैं।)
- यह फ़ाइल केवल Netlify Function bundle में जाती है — `dist/`, frontend JavaScript या public URL से कभी serve नहीं होती।
- इसमें plaintext password नहीं, केवल salt + one-way hash है।
- पासवर्ड बदलने के लिए:

```bash
node scripts/set-admin-password.mjs "नया-मजबूत-पासवर्ड"
```

फिर redeploy करें। Token signature भी इसी hash से बनता है, इसलिए पासवर्ड बदलने पर सभी पुराने tokens अमान्य हो जाएँगे।

## वैकल्पिक

| नाम | डिफ़ॉल्ट | विवरण |
|---|---|---|
| `BLOBS_STORE` | `chnm-exam-v2` | Netlify Blobs store का नाम। बदलने पर नया खाली store बनेगा — पुराना data उसी पुराने नाम में रहेगा। केवल अक्षर/अंक/`-`/`_` रखें; गलत मान होने पर कोड अपने आप `chnm-exam-v2` पर लौट आता है। |

## Netlify द्वारा स्वतः उपलब्ध (सेट न करें)

| नाम | उपयोग |
|---|---|
| `NETLIFY_BLOBS_CONTEXT` | Function में Blobs context स्वतः injected; `@netlify/blobs` इसे पढ़ता है |
| `NETLIFY_SITE_ID`, `NETLIFY_API_TOKEN` आदि | Netlify runtime द्वारा; कोड इन पर निर्भर नहीं है |

## स्थानीय विकास (dev server)

`scripts/dev-server.mjs` इन variables को पढ़ता है:

```powershell
$env:USE_MEMORY_STORE="1"
$env:ADMIN_PASSWORD="admin12345"
$env:ADMIN_SECRET="local-dev-only-secret-please-change-0123456789abcdef"
$env:BLOBS_STORE="chnm-exam-v2"
$env:PORT="8888"
$env:HOST="127.0.0.1"
node scripts/dev-server.mjs
```

`USE_MEMORY_STORE=1` होने पर data केवल प्रोसेस मेमोरी में रहता है (restart पर मिटता है) — local testing के लिए।

## परीक्षण स्क्रिप्ट

`scripts/test-api.mjs` अपने भीतर test credentials सेट करता है; उसे Netlify env की जरूरत नहीं।

## सुरक्षा नियम

1. `ADMIN_PASSWORD` कभी commit न करें — `.gitignore` में `.env` शामिल है।
2. Variables बदलने के बाद **Redeploy** करें (functions को नई values तभी मिलेंगी)।
3. पासवर्ड/secret rotate करने पर सभी पुराने tokens अमान्य हो जाते हैं — एडमिन/छात्र दोबारा login करेंगे।
4. `ADMIN_SECRET` खो जाने पर नया लंबा random मान सेट करें और redeploy करें; Blobs का data सुरक्षित रहता है।
5. Secrets को किसी सहायक, CSV, screenshot या सार्वजनिक चैट में साझा न करें।

## वर्तमान स्थिति

इस डिलीवरी में कोई plaintext secret शामिल नहीं है। `admin-credentials.mjs` में केवल one-way scrypt hash है; deployment के समय `ADMIN_PASSWORD` सेट करना अभी भी सर्वोत्तम है। अगर repository public है, तो fallback hash हटाने के बजाय env variable पर निर्भर रहें और मजबूत पासवर्ड रखें।

लाइव project `chnm26` में `ADMIN_PASSWORD` और `ADMIN_SECRET` दोनों **secret** के रूप में production deploy context पर सेट हैं। पासवर्ड का मान इस फ़ाइल, frontend या repository में कभी न लिखें — केवल Netlify Dashboard में रखें। Env बदलने के बाद नया deploy जरूरी है।
