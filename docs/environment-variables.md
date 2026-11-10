# Environment Variables (पर्यावरण चर)

Production में secrets Cloudflare Dashboard → **Workers & Pages → chnm-portal → Settings → Variables and Secrets** में configure करें। Secret values को source code, GitHub, screenshots, या chat में न रखें।

## जरूरी secrets

| नाम | विवरण |
|---|---|
| `ADMIN_PASSWORD` | एडमिन लॉगिन पासवर्ड; लंबा, अनूठा और कम-से-कम 12–16 अक्षरों का रखें। |
| `ADMIN_SECRET` | Admin और student tokens के HMAC signing के लिए कम-से-कम 32 random bytes का अलग secret। इसे स्थिर रखें; बदलने पर सभी मौजूदा tokens अमान्य हो जाएंगे। |

दोनों secrets Cloudflare Worker में **secret** के रूप में सेट होने चाहिए। कोई bundled/default admin password या token-signing key नहीं है; configuration में से कोई भी अनुपस्थित होने पर admin login/token जारी करना विफल होगा।

## स्थानीय विकास

`scripts/dev-server.mjs` development के लिए process-local in-memory store चलाता है। ये values केवल स्थानीय demo के लिए हैं:

```powershell
$env:USE_MEMORY_STORE="1"
$env:ADMIN_PASSWORD="local-demo-password"
$env:ADMIN_SECRET="local-demo-only-random-secret-change-before-use"
node scripts/dev-server.mjs
```

Server restart पर memory-store data मिट जाता है। Production जैसा D1 test चलाने के लिए `npm run test:d1` उपयोग करें।

## पुराने Netlify Blobs data का migration

Netlify deployment/runtime support हटा दिया गया है। `@netlify/blobs` dependency केवल पुरानी Netlify Blobs site से backup export करने वाले one-off `npm run export:netlify-blobs` migration tool के लिए रहती है। `npm run import:cloudflare-db` उस backup को खाली Cloudflare D1 database में import करता है। Migration backup में छात्र और परीक्षा की संवेदनशील जानकारी हो सकती है—इसे private, access-controlled storage में रखें। Migration utilities को सामान्य Worker runtime में इस्तेमाल नहीं किया जाता।
