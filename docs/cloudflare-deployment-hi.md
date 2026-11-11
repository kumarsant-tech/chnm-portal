# GitHub + Cloudflare deployment (हिंदी)

यह मौजूदा live CHNM वेबसाइट की hosting और automatic deployment का संदर्भ है। आसान बदलाव निर्देश [वेबसाइट रखरखाव manual](./site-maintenance-manual-hi.md) में हैं।

## वर्तमान production setup

- Live URL: <https://chnm-portal.kumarsant1947.workers.dev>
- Hosting/API: Cloudflare Worker `chnm-portal` और Static Assets
- Database: Cloudflare D1 (`DB` binding)
- Student resources: private Cloudflare R2 bucket (`RESOURCES` binding)
- GitHub repository: <https://github.com/kumarsant-tech/chnm-portal> (private)
- Production branch: `main`
- Configuration file: [wrangler.jsonc](../wrangler.jsonc)

यह Cloudflare setup पहले से बना और deploy है। पुरानी Netlify site/database इससे अलग है; पुराना Netlify backup इस database में import नहीं किया गया। मौजूदा Worker या D1 database को दोबारा बनाने, database ID बदलने या पुरानी backup फाइल import करने की जरूरत नहीं है।

## GitHub से automatic deploy

Cloudflare Workers Builds पहले से repository और `main` branch से जुड़ा है:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: repository root
- Preview builds: बंद; `main` production में deploy होती है

Code बदलाव `main` में commit और push होने पर build/deploy अपने-आप शुरू होता है। केवल GitHub पर file edit करके बिना commit किए छोड़ने से live site नहीं बदलती। सफल deployment देखने के लिए Cloudflare Dashboard → **Workers & Pages** → `chnm-portal` → **Deployments** खोलें।

Deployment build अपने-आप tests नहीं चलाता। Code/API में बदलाव के बाद push से पहले project terminal में चलाएँ:

```powershell
npm test
npm run test:d1
```

दोनों सफल हों तभी बदलाव push करें। छोटे content/design बदलाव के लिए बदला हुआ page स्थानीय रूप से खोलकर जाँचें।

## छात्र संसाधन लाइब्रेरी

नए deployment में `RESOURCES` binding के लिए Cloudflare R2 bucket पहले बनाएँ:

```powershell
npx wrangler r2 bucket create chnm-portal-resources
```

Bucket private रखें; सार्वजनिक access सक्षम न करें। `wrangler.jsonc` में binding पहले से इसी नाम पर कॉन्फ़िगर है। Admin panel से PDF/PPT/PPTX अपलोड करें; authenticated छात्र अपने ट्रेड की सामग्री डाउनलोड कर सकते हैं। Files R2 में और सूची metadata D1 में रहता है।

## Admin secrets और database सुरक्षा

- Runtime secrets Cloudflare Worker में encrypted secrets के रूप में रखे जाते हैं। उनकी values source code, GitHub, screenshot या chat में न लिखें।
- छात्र ईमेल और admin password recovery के लिए Gmail API (`GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`) या Resend (`RESEND_API_KEY`, verified `EMAIL_FROM`) configure करें। Gmail OAuth consent में Gmail API सक्षम करें और `gmail.send` scope वाला refresh token दें। साथ में `ADMIN_EMAIL` और `PUBLIC_BASE_URL` configure करें; recovery link केवल `ADMIN_EMAIL` पर भेजा जाता है।
- Admin password change/reset का salted hash D1 में रखा जाता है; `ADMIN_SECRET` token signing key अलग और स्थिर रहता है। Password change/reset पर पुराने admin sessions तुरंत अमान्य हो जाते हैं। पहली admin setup के लिए `ADMIN_PASSWORD` अभी भी रखें।
- Student password reset link, यदि student profile में email दर्ज है, केवल उसी saved email पर भेजा जाता है। बिना email वाले पुराने खाते के लिए admin को पहले student profile अपडेट करना होगा। Reset link 30 मिनट में expire होता है और एक बार ही इस्तेमाल हो सकता है।
- Admin Settings से अलग staff/controller खाते और उनकी `exams`, `questions`, `students`, `notices`, `reports`, `tools` permissions बनाई जा सकती हैं। सेटअप ईमेल भेजने के लिए ऊपर दिया email provider आवश्यक है; staff छात्र login से अलग `https://<site-origin>/exam/staff-login.html` पर login करता है। पुराने controller खाते `https://<site-origin>/exam/controller.html` पर भी पासवर्ड अपडेट कर सकते हैं।
- Controller draft exam बना सकता है; परिणाम देखना/जारी करना और exam publish करना केवल Admin कर सकता है। नए exam draft खाली paper से शुरू होते हैं; प्रत्येक exam का upload अलग रहता है और पुराने exam के प्रश्न अपने-आप इसमें नहीं जुड़ते।
- Secret बदलने का काम authorized Cloudflare admin/developer ही करे। Secret values को terminal command arguments में न डालें।
- D1 schema migration, `wrangler.jsonc` का database ID, binding या `cloudflare/migrations/` में बदलाव से production data प्रभावित हो सकता है। Backup और migration योजना के बिना इन्हें न बदलें।
- छात्र/परीक्षा backup निजी, access-controlled जगह पर रखें—GitHub repository में नहीं।

## Free plan और परीक्षार्थियों की संख्या

Cloudflare Free plan की Worker, D1, storage, request और CPU limits लागू होती हैं। 50–200 साथ-साथ परीक्षार्थियों के लिए load test किए बिना capacity की guarantee नहीं है। बड़ी परीक्षा से पहले छोटा pilot करें और Cloudflare dashboard में usage/limits देखें।

## Worker/API संदर्भ

`cloudflare/worker.mjs` same-origin `/api` requests, static assets और scheduled expiry handling करता है। D1 key-value table migration `cloudflare/migrations/0001_create_app_kv.sql` से बनती है। Cron Trigger हर पाँच मिनट में समय-सीमा पार किए attempts finalize करता है।

यदि deploy fail हो, Dashboard के **Deployments** में error पढ़ें और बार-बार अधूरे commits push न करें। Code ठीक करके नया commit `main` में push करें; data या exam समस्या हो तो खुद D1 बदलने के बजाय developer से मदद लें।
