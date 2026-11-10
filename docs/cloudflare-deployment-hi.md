# GitHub + Cloudflare deployment (हिंदी)

नई hosting **Cloudflare Workers + Static Assets** और persistent database **Cloudflare D1** है। Netlify वर्तमान live site को migrate/export करने तक चालू रहेगा; इस बदलाव में उसका deployment या data delete नहीं होता।

## जरूरी सीमा

Cloudflare Free plan पर requests, D1 reads/writes, storage और CPU की limits हैं। 50–200 साथ-साथ परीक्षार्थियों के लिए इसे **load test** किए बिना capacity guarantee नहीं दी जा सकती। परीक्षा शुरू करने से पहले छोटा pilot करें और Cloudflare dashboard में usage/limits देखें। Database migration के दौरान दो अलग live databases न चलाएँ—एक system में maintenance mode रखें।

## 1. GitHub repository

Repository private रखें: `https://github.com/kumarsant244-web/chnm-portal`। Project root से पहली बार push:

```powershell
git push -u origin main
```

GitHub browser sign-in पूरा करें। `.gitignore` में `.env`, ZIP exports, temporary scripts और `*blobs-backup*.json` हैं। Student/audit backup कभी repository में commit न करें।

## 2. Cloudflare account और D1

Node.js 22.12+ लगाकर project root से:

```powershell
npm ci
npx wrangler login
npx wrangler d1 create chnm-portal
```

`d1 create` से मिलने वाला ID [wrangler.jsonc](../wrangler.jsonc) के `database_id` में `REPLACE_WITH_D1_DATABASE_ID` की जगह रखें। फिर:

```powershell
npx wrangler d1 migrations apply chnm-portal --remote
```

Worker पहली बार deploy होने के बाद secrets configure करें; उस Worker के बनने से पहले `secret put` काम नहीं करेगा।

## 3. मौजूदा live data सुरक्षित migrate करें

`chnm26-live-blobs-backup-2026-11-02.json` पुराना snapshot है—इसे live data के विकल्प की तरह **import न करें**। Import script केवल पिछले 24 घंटों का raw export स्वीकार करती है।

1. मौजूदा exam में सभी चल रहे attempts submit होने दें; migration के दौरान registration/exam changes रोकें।
2. Netlify Account → **User settings → Applications → Personal access tokens** से local-only token बनाएँ। Token chat/GitHub में न डालें।
3. PowerShell में token को process environment में रखें और project folder के बाहर सुरक्षित path चुनें:

```powershell
$env:NETLIFY_SITE_ID = "Netlify dashboard का site API ID"
$secureToken = Read-Host "Netlify personal access token" -AsSecureString
$env:NETLIFY_AUTH_TOKEN = [System.Net.NetworkCredential]::new("", $secureToken).Password
node scripts/export-netlify-blobs.mjs "$env:TEMP\chnm26-live-blobs-latest.json"
Remove-Item Env:NETLIFY_AUTH_TOKEN
Remove-Variable secureToken
```

यह script `chnm-exam-v2` से raw Blobs पढ़ती है और private export project folder के बाहर लिखती है। फिर, GitHub/Cloudflare deploy और site traffic शुरू करने **से पहले**, उसी मशीन पर:

```powershell
node scripts/import-netlify-blobs.mjs "$env:TEMP\chnm26-live-blobs-latest.json"
```

Import केवल खाली D1 database में शुरू होगा; partial import को उसी snapshot से safely retry किया जा सकता है। सफल import verify होने तक नई site को परीक्षार्थियों में साझा न करें। Export file में student details, exam records और IP audit logs हो सकते हैं; काम पूरा होने पर इसे सुरक्षित रूप से हटाएँ। Netlify source site/data को rollback की आवश्यकता पूरी होने तक न हटाएँ।

## 4. नई site deploy करें

```powershell
npm run build
npx wrangler deploy
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SECRET
```

दोनों secrets के लिए अलग, मजबूत values डालें। उन्हें command arguments, source files, GitHub या chat में न लिखें। Cloudflare द्वारा दिया गया `*.workers.dev` URL नई site होगा; secrets set होने और smoke tests पास होने तक इसे परीक्षार्थियों से साझा न करें। पहले admin login, student login, exam start/autosave/submit/result, और पुराने imported results जाँचें। सफल cutover के बाद ही सभी को नया URL दें।

## 5. GitHub से auto-deploy

Cloudflare Dashboard → **Workers & Pages** → `chnm-portal` Worker → **Settings / Builds** → GitHub repository connect करें। Production branch `main`, build command `npm ci && npm run build`, deploy command `npx wrangler deploy` रखें। GitHub Actions/Cloudflare secrets में API token की जरूरत हो तो उसे केवल Cloudflare/GitHub secret store में रखें।

## मौजूदा API और scheduled expiry

`cloudflare/worker.mjs` मौजूदा CBT API को same-origin `/api` पर चलाता है। D1 key-value table migration `cloudflare/migrations/0001_create_app_kv.sql` से बनती है। Cloudflare Cron Trigger हर पाँच मिनट में server-side expired attempts finalize करता है। `npm test` मौजूदा API regression suite चलाता है; यह production-load test का विकल्प नहीं है।
