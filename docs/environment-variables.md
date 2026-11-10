# Environment Variables (पर्यावरण चर)

Production में secrets Cloudflare Dashboard → **Workers & Pages → chnm-portal → Settings → Variables and Secrets** में configure करें। Secret values को source code, GitHub, screenshots, या chat में न रखें।

## जरूरी secrets

| नाम | विवरण |
|---|---|
| `ADMIN_PASSWORD` | शुरुआती एडमिन लॉगिन पासवर्ड; कम-से-कम 12 अक्षरों का रखें। पासवर्ड बदलने/रीसेट करने के बाद D1 में salted hash वाला override प्राथमिक होगा। |
| `ADMIN_SECRET` | Admin और student tokens के HMAC signing के लिए कम-से-कम 32 random bytes का अलग secret। इसे स्थिर रखें; बदलने पर सभी मौजूदा tokens अमान्य हो जाएंगे। |
| `ADMIN_EMAIL` | एडमिन पासवर्ड रिकवरी के लिए सत्यापित निजी ईमेल पता। |
| `RESEND_API_KEY` | छात्र रजिस्ट्रेशन, परिणाम जारी होने की सूचना और एडमिन रिकवरी ईमेल भेजने की Resend API key। |
| `EMAIL_FROM` | Resend में सत्यापित sender, जैसे `CHNM Portal <noreply@example.com>`; इसके बिना ईमेल नहीं भेजे जाते। |
| `PUBLIC_BASE_URL` | साइट का भरोसेमंद HTTPS origin, जैसे `https://chnm-portal.kumarsant1947.workers.dev`; रिकवरी लिंक इसी से बनता है। |

Secret values Cloudflare Worker में **secret** के रूप में सेट करें। `ADMIN_PASSWORD` और `ADMIN_SECRET` अनिवार्य हैं जब तक D1 में एडमिन पासवर्ड override सेट न हो; `ADMIN_SECRET` हमेशा token signing के लिए आवश्यक है। पासवर्ड बदलने या recovery link से reset करने पर नया salted password hash D1 में save होता है, `ADMIN_SECRET` नहीं बदलता और पुराने admin sessions तुरंत अमान्य हो जाते हैं। Recovery email के लिए `ADMIN_EMAIL`, `RESEND_API_KEY`, `EMAIL_FROM` और `PUBLIC_BASE_URL` सभी आवश्यक हैं। ईमेल configuration न होने पर recovery request स्पष्ट configuration error देती है; कोई arbitrary recipient स्वीकार नहीं होता।

Self-registration में छात्र की जन्मतिथि केवल अस्थायी पासवर्ड (`DDMMYYYY`) बनाने के लिए इस्तेमाल होती है और रिकॉर्ड/API/log में सहेजी या लौटाई नहीं जाती। पहले login के बाद परीक्षा सुविधाएँ तब तक बंद रहती हैं जब तक छात्र कम-से-कम 10 अक्षरों का नया पासवर्ड न बना ले। Resend configure न होने पर registration पूरा होता है, पर UI बताता है कि ईमेल नहीं भेजा गया।

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
