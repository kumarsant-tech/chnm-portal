# 3D लैब विषय-मॉड्यूल लेखने का नियम (cl3d-data-*.js)

यह फ़ाइल सिर्फ़ `Computer-Lab/cl3d-data-*.js` नए विषय-मॉड्यूल लिखते समय पालने वाली शैली बताती है।
पेज/मेन्यू/क्रमांकन सब `scripts/tmp-3d-addpages.mjs` अपने आप बनाता है — **लेखक का काम केवल एक डेटा फ़ाइल है।**

## 1. फ़ाइल का ढाँचा (बिल्कुल यही)

```js
/* =====================================================================
   कंप्यूटर लैब 3D  ·  data-win1.js   (विंडोज़ मास्टरक्लास — भाग 1)
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
  {
    id: 'win-intro',                 // PLAN में जो id दिया है, वही (बदलना निषेध)
    icon: '🪟',
    group: 'विंडोज़ मास्टरक्लास',    // PLAN में जो समूह है, वही अक्षरशः
    title: 'विंडोज़ का परिचय व इतिहास',
    sub: 'संस्करण, एडिशन, लाइसेंस और 32/64-बिट की पूरी समझ',
    kicker: 'Windows Masterclass 1 · Versions & Licensing',
    hero: 'यहाँ पढ़कर आप विंडोज़ का कोई भी संस्करण पहचान सकेंगे और यह बता सकेंगे कि कौन-सा एडिशन किस काम के लिए है।',
    tags: ['1985 से 2024 तक', 'एडिशन तुलना', '32/64-बिट', 'लाइसेंस'],
    blocks: [ /* नीचे के ब्लॉक */ ]
  }
]);
```

- फ़ाइल **CRLF** लाइनों पर लिखें (repo यही उपयोग करता है)।
- कोई `require`, `import`, `document`, `fetch` नहीं — यह फ़ाइल सीधे ब्राउज़र में चलती है।
- केवल अपनी फ़ाइल छुएँ; `cl3d-app.js`, पेज HTML, `index.html` आदि में अपने हाथ से कुछ न लिखें।
- **आदर्श (imitate):** `Computer-Lab/cl3d-data-practical.js` और `Computer-Lab/cl3d-data-hardware.js`।

## 2. ब्लॉक प्रकार (केवल यही 15 स्वीकार हैं)

| type | फ़ील्ड | कब उपयोग करें |
|---|---|---|
| `html` | `html` | अनुच्छेद, `h3.blk` + `span.blk-n` उप-शीर्षक, inline `<table class="tbl">`, `<ul>` |
| `table` | `head:[…]`, `rows:[[…],[…]]` | तुलना, स्पेसिफ़िकेशन, कमांड रिफरेंस, फ़ंक्शन लिस्ट |
| `callout` | `kind:'info'|'tip'|'ok'|'warn'|'danger'|'exam'`, `title`, `html` | नुक्ता, चेतावनी, "परीक्षा में पूछा जाता है" (`exam`) |
| `steps` | `items:[{n,title,text,tips,warn}]` | प्रक्रिया/प्रोसीजर (crisp, 5–12 चरण) |
| `acc` | `title`, `items:[{q,a}]` | FAQ / अक्सर पूछे प्रश्न — `q` = सवाल, `a` = जवाब (HTML चलेगा) |
| `tabs` | `items:[{t,html}]` | एक ही जगह कई विकल्प (CMD बनाम PowerShell) |
| `cards` | `items:[{ico,title,text,tags:[…]}]` | अवलोकन/सारांश कार्ड |
| `kv` | `items:[{label,value,desc}]` | आँकड़े, डिफ़ॉल्ट मान, शॉर्टकट काउंट |
| `code` | `code` | कमांड/फ़ॉर्म्युला/स्क्रिप्ट के नमूने (असली, चलाए जाने योग्य) |
| `pills` | `items:[{text,kind}]` | छोटे रंगीन बैज की पंक्ति (चेतावनी/सुझाव के लिए) |
| `diagram` | `svg:'<नाम>', caption` | नाम दो जगह से मिलते हैं — (a) `cl3d-app.js` के `DIAGRAMS`: `blockDiagram`, `motherboardMap`, `networkTopo`, (b) किसी भी `cl3d-data-*.js` में बना `window.XXdiagName` फ़ंक्शन (जैसे `window.MBdiagGraphics` → `svg:'MBgraphics'`, `window.SVdiagSafety` → `svg:'SVsafety'`). नया चित्र चाहिए तो इसी `window.<अपना-उपसर्ग>diag<Name>` पैटर्न पर फ़ंक्शन बनाएँ; अन्यथा `html` ब्लॉक में inline SVG डालें |
| `3d` | `model,height,title,hotspots` | मौजूदा 3D मॉडल ही लगेंगे (`cl3d-three-lab.js` में जो registered हैं) |
| `sim` | `sim:'<key>'` | मौजूदा सिमुलेटर (`cl3d-simulators.js` के keys) |
| `labs` | `items:[{n,title,aim,tools:[…],steps:[…],result}]` | प्रैक्टिकल कार्य — `n` कभी दोहराएँ नहीं |
| `quiz` | `items:[{q,o:[4],a:<index>,ex}]`, `store:'<slug>'` | MCQ पेज (`a` = सही विकल्प की 0-based संख्या, `ex` = व्याख्या) |

उदाहरण — table + callout + quiz:

```js
{ type: 'table', head: ['कमांड', 'क्या करती है', 'उदाहरण'],
  rows: [['ipconfig /all', 'पूरा TCP/IP विवरण (MAC, DNS, DHCP)', 'ipconfig /all']] },
{ type: 'callout', kind: 'exam', title: 'परीक्षा में', html: '<p><b>ipconfig</b> विंडोज़ का कमांड है, <b>ifconfig/ip</b> लिनक्स का।</p>' },
{ type: 'quiz', store: 'sw', items: [
  { q: 'BIOS का पूरा नाम क्या है?', o: ['Basic Input Output System', 'Binary Input Output System', 'Boot Intel Operating System', 'Base Integrated OS'], a: 0,
    ex: '<b>Basic Input Output System</b> — POST करता है और boot से पहले हार्डवेयर चलाता है।' } ] }
```

## 3. सामग्री के नियम (सबसे ज़रूरी)

1. **भाषा:** सरल हिंदी, जैसी एक ITI/servicing instructor बोर्ड पर लिखता है। हर तकनीकी शब्द के साथ English कोष्ठक में — जैसे "मेमोरी (RAM)", "फ़ोल्डर (Directory)"।
2. **गहराई:** हर विषय में **18–28 blocks**, कम-से-कम 4–6 बड़ी tables, 1–2 `steps`, 1 `acc` (FAQ 6–10 प्रश्न), 1–2 `callout kind:'exam'`, और जहाँ लागू हो वहाँ `code` नमूने।
3. **कुछ भी छोड़ें नहीं:** संस्करण/एडिशन, वर्ष, कीबोर्ड शॉर्टकट, कमांड सिंटेक्स, फ़ॉर्म्युले, त्रुटि संकेत (error codes) और उनके समाधान, डिफ़ॉल्ट मान (paths, ports, extensions), परीक्षा/इंटरव्यू प्रश्न।
4. **सटीकता:** केवल वही लिखें जो सच है। भ्रमित तथ्य, नकली संस्करण-नंबर या "शायद" वाली बात न लिखें। कोई नया UI/फ़ीचर कल्पना न करें।
5. **छोटी-मोटी पंक्तियाँ नहीं:** "यह महत्वपूर्ण है" जैसी भर्ती भाषा हटाएँ। हर वाक्य में एक नया तथ्य हो।
6. **HTML:** `html`/`callout.html`/`tabs.html` के अंदर `<b> <i> <code> <kbd> <ul> <ol> <li> <p> <h4 class="blk2"> <table class="tbl">` चलाते हैं। **इंटरनेट से कोई `<script>`, `<iframe>`, `onclick=` या `src=` न डालें।** कोटेशन में सावधानी — JS string के अंदर double-quote हो तो `'` या `\"` उपयोग करें।
7. **उप-शीर्षक का क्रम:** हर बड़े हिस्से के शुरू में `{ type:'html', html:'<h3 class="blk"><span class="blk-n">12.3</span> शीर्षक</h3><p>…</p>' }` — नंबर विषय के क्रम से बढ़ें।
8. **परीक्षा-तैयारी:** हर विषय के अंत में एक `callout kind:'exam'` या `acc` रखें जिसमें उस विषय के 6–10 संभावित प्रश्न/उत्तर हों।
9. **फ़ाइल आकार:** लक्ष्य 45–90 KB प्रति विषय। एक बार में पूरी फ़ाइल न लिखें — पहले फ़ाइल बनाएँ, फिर `Edit` से blocks जोड़-जोड़कर पूरा करें (हर 2–3 blocks के बाद सहेजें)।
10. **जाँच (अनिवार्य):** लिखने के बाद ये दोनों कमांड चलाएँ और तभी काम पूरा बताएँ:
    ```bash
    node --check Computer-Lab/cl3d-data-<आपकी-फ़ाइल>.js
    node -e "const fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('Computer-Lab/cl3d-data-<फ़ाइल>.js','utf8'),c);const S=c.window.CL_SECTIONS;console.log(S.map(s=>s.id+':'+s.blocks.length+'blk/'+(JSON.stringify(s).length/1024).toFixed(0)+'KB').join(' | '))"
    ```
    आउटपुट में आपके सभी id होने चाहिए, `blocks` संख्या 18 से कम न हो, और कोई Syntax Error न आए।
