# Environment Variables (पर्यावरण चर)

Production में secrets Cloudflare Dashboard → **Workers & Pages → chnm-portal → Settings → Variables and Secrets** में configure करें। Secret values को source code, GitHub, screenshots, या chat में न रखें।

## जरूरी variables और secrets

| नाम | विवरण |
|---|---|
| `ADMIN_PASSWORD` | शुरुआती एडमिन लॉगिन पासवर्ड; कम-से-कम 12 अक्षरों का रखें। पासवर्ड बदलने/रीसेट करने के बाद D1 में salted hash वाला override प्राथमिक होगा। |
| `ADMIN_SECRET` | Admin और student tokens के HMAC signing के लिए कम-से-कम 32 random bytes का अलग secret। इसे स्थिर रखें; बदलने पर सभी मौजूदा tokens अमान्य हो जाएंगे। |
| `ADMIN_EMAIL` | एडमिन पासवर्ड रिकवरी के लिए सत्यापित निजी ईमेल पता। |
| `GMAIL_CLIENT_ID` | Gmail API OAuth 2.0 Desktop/Web client ID। |
| `GMAIL_CLIENT_SECRET` | उसी OAuth client का secret। |
| `GMAIL_REFRESH_TOKEN` | Gmail API `gmail.send` scope के साथ अधिकृत OAuth refresh token। |
| `RESEND_API_KEY` | वैकल्पिक Resend provider की API key। Gmail credentials configure न होने पर ही इस्तेमाल होती है। |
| `EMAIL_FROM` | Resend में सत्यापित sender, जैसे `CHNM Portal <noreply@example.com>`; Gmail provider में आवश्यक नहीं। |
| `PUBLIC_BASE_URL` | साइट का भरोसेमंद HTTPS origin, जैसे `https://chnm-portal.kumarsant1947.workers.dev`; रिकवरी लिंक इसी से बनता है। |

Email provider के लिए Gmail API या Resend configure करें। Gmail चुनने पर तीनों `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN` configure करें; Gmail credentials मौजूद हों तो Gmail provider प्राथमिक होगा। साथ में Resend configure होने पर Gmail की स्पष्ट OAuth/API rejection पर Resend fallback होगा; ambiguous network failure के बाद fallback नहीं होगा, ताकि duplicate email का जोखिम न हो। अधूरी Gmail configuration पर complete Resend configuration इस्तेमाल होगी। OAuth consent में Gmail API सक्षम होनी चाहिए और refresh token `https://www.googleapis.com/auth/gmail.send` scope के साथ उसी sender Gmail account से बनना चाहिए। Client ID को variable या secret और client secret/refresh token को **secret** के रूप में रखें। Resend के लिए `RESEND_API_KEY` और verified `EMAIL_FROM` आवश्यक हैं। Provider credentials को frontend, GitHub या chat में न रखें।

`ADMIN_PASSWORD` और `ADMIN_SECRET` अनिवार्य हैं जब तक D1 में एडमिन पासवर्ड override सेट न हो; `ADMIN_SECRET` हमेशा token signing के लिए आवश्यक है। पासवर्ड बदलने या recovery link से reset करने पर नया salted password hash D1 में save होता है, `ADMIN_SECRET` नहीं बदलता और पुराने admin sessions तुरंत अमान्य हो जाते हैं। Recovery email के लिए `ADMIN_EMAIL`, `PUBLIC_BASE_URL` और ऊपर दिए providers में से एक आवश्यक है। ईमेल configuration न होने पर recovery request स्पष्ट configuration error देती है; कोई arbitrary recipient स्वीकार नहीं होता।

Self-registration में छात्र की जन्मतिथि केवल अस्थायी पासवर्ड (`DDMMYYYY`) बनाने के लिए इस्तेमाल होती है और रिकॉर्ड/API/log में सहेजी या लौटाई नहीं जाती। पहले login के बाद परीक्षा सुविधाएँ तब तक बंद रहती हैं जब तक छात्र कम-से-कम 10 अक्षरों का नया पासवर्ड न बना ले। Email provider configure न होने पर registration पूरा होता है, पर UI बताता है कि ईमेल नहीं भेजा गया।

## स्थानीय विकास

`scripts/dev-server.mjs` development के लिए process-local in-memory store चलाता है। ये values केवल स्थानीय demo के लिए हैं:

```powershell
$env:USE_MEMORY_STORE="1"$env:ADMIN_PASSWORD = Read-Host "Local admin password"$env:ADMIN_SECRET = [guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')
node scripts/dev-server.mjs
```

Server restart पर memory-store data मिट जाता है। Production जैसा D1 test चलाने के लिए `npm run test:d1` उपयोग करें।

## पुराने Netlify Blobs data का migration

Netlify deployment/runtime support हटा दिया गया है। `@netlify/blobs` dependency केवल पुरानी Netlify Blobs site से backup export करने वाले one-off `npm run export:netlify-blobs` migration tool के लिए रहती है। `npm run import:cloudflare-db` उस backup को खाली Cloudflare D1 database में import करता है। Migration backup में छात्र और परीक्षा की संवेदनशील जानकारी हो सकती है—इसे private, access-controlled storage में रखें। Migration utilities को सामान्य Worker runtime में इस्तेमाल नहीं किया जाता।
