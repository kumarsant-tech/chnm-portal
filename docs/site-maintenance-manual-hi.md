# CHNM वेबसाइट: आसान रखरखाव manual

यह manual बताता है कि किस तरह के बदलाव कहाँ करने हैं। लाइव वेबसाइट Cloudflare पर है; GitHub में वेबसाइट का code रखा है।

## जरूरी लिंक

- लाइव वेबसाइट: <https://chnm-portal.kumarsant1947.workers.dev>
- छात्र पोर्टल: <https://chnm-portal.kumarsant1947.workers.dev/exam/index.html>
- एडमिन पैनल: <https://chnm-portal.kumarsant1947.workers.dev/exam/admin>
- GitHub code: <https://github.com/kumarsant-tech/chnm-portal>
- Cloudflare deploy स्थिति: Cloudflare Dashboard → **Workers & Pages** → **chnm-portal** → **Deployments**

## पहले तय करें: बदलाव एडमिन में करना है या code में?

| क्या बदलना है? | कहाँ बदलें? | GitHub push चाहिए? |
|---|---|---|
| प्रश्न, परीक्षा, समय, अंक, छात्र, सूचना | [एडमिन पैनल](https://chnm-portal.kumarsant1947.workers.dev/exam/admin) | नहीं |
| होम पेज का लेख/लिंक/लेआउट | `index.html` | हाँ |
| होम पेज के रंग/डिज़ाइन | `assets/` में संबंधित `.css` | हाँ |
| छात्र/परीक्षा पेज का डिज़ाइन या बटन | `exam/` और `exam/assets/` | हाँ |
| पढ़ाई की किताब या अध्याय | `study/` या `study/trade/` | हाँ |
| नई प्रश्न-पत्र template/sample file | `exam/templates/` | हाँ |
| login, scoring, registration, API | `netlify/lib/` या `netlify/functions/` | हाँ; पहले developer से जाँच कराएँ |

### एडमिन से होने वाले बदलाव

प्रश्न जोड़ने के लिए **एडमिन → प्रश्न बैंक → आयात करें** खोलें। नमूने और खाली templates [exam/templates/](../exam/templates/) में हैं। परीक्षा बनाना, छात्रों को manage करना, सूचना देना, परिणाम देखना और release करना भी एडमिन पैनल से करें।

ये बदलाव Cloudflare D1 में save होते हैं। इन्हें code file में खोजने, GitHub में लिखने या deploy करने की जरूरत नहीं है। एडमिन पैनल के **Tools / Backup** से समय-समय पर backup लें और उसे निजी जगह पर रखें—GitHub पर नहीं।

## Code में बदलाव कैसे करें

### आसान तरीका: VS Code

1. VS Code में project folder खोलें: `E:\CHNM-backup-2026-11-08`.
2. बाईं ओर **Explorer** से ऊपर की तालिका में दिया folder और file खोलें।
3. बदलाव करने से पहले file का नाम और page सही है या नहीं जाँचें। छोटा बदलाव करें और `Ctrl+S` से save करें।
4. पहले वेबसाइट को स्थानीय रूप से जाँचें। Code/API में बदलाव हो तो project folder के VS Code terminal में चलाएँ:

   ```powershell
   npm test
   npm run test:d1
   ```

   दोनों commands में `passed` और `0 failed` देखे बिना code बदलाव live न भेजें। केवल लेख/फोटो/रंग के छोटे बदलाव में पेज खोलकर दृश्य जाँच करें।

5. VS Code के **Source Control** में बदली हुई files देखें। केवल अपने बदलाव वाली files चुनें। छोटा संदेश लिखें, जैसे `home page text update`, फिर **Commit** और **Sync Changes / Push** करें।
6. यह project `main` branch से जुड़ा है। `main` पर push होते ही Cloudflare अपने-आप build और deploy करता है; अलग से deploy command चलाने की जरूरत नहीं।
7. Cloudflare → **Workers & Pages → chnm-portal → Deployments** में सबसे नया deployment **Ready** होने की प्रतीक्षा करें। फिर लाइव website खोलकर बदलाव देखें।

### GitHub वेबसाइट से एक file बदलना

1. [GitHub repository](https://github.com/kumarsant-tech/chnm-portal) खोलें।
2. `main` branch में सही file खोलें—जैसे `index.html`। **Edit (pencil)** दबाएँ।
3. छोटा बदलाव करें, नीचे **Commit changes** चुनें और बदलाव `main` में commit करें।
4. Cloudflare का build/deploy अपने-आप शुरू होगा। **Deployments** में सफलता देखें।

गलती से एक साथ कई files बदलने या `main` में बड़ा अधूरा बदलाव भेजने से बचें। GitHub में edit करने से पहले सही file की पुष्टि न हो तो किसी जानकार से पूछें।

## मुख्य files और folders

| Path | इसका काम |
|---|---|
| `index.html` | वेबसाइट का मुख्य home page |
| `assets/home-modern.css`, `assets/home-neo.css`, `assets/modern-ui.css` | home page और साझा design |
| `assets/home-modern.js`, `assets/home-neo.js`, `assets/modern-ui.js` | home page के interaction |
| `exam/index.html` | छात्र पोर्टल |
| `exam/register.html` | छात्र registration |
| `exam/test.html` | परीक्षा देने वाली screen |
| `exam/result.html` | छात्र result page |
| `exam/admin.html` | एडमिन screen |
| `exam/assets/portal.js` | छात्र पोर्टल की functionality |
| `exam/assets/test.js` | परीक्षा screen की functionality |
| `exam/assets/result.js`, `exam/assets/result-view.js` | result page की functionality |
| `exam/assets/admin.js` | एडमिन panel की functionality |
| `exam/assets/styles.css`, `exam/app.css` | परीक्षा प्रणाली का design |
| `exam/templates/` | प्रश्न import के नमूने और templates |
| `study/` | Training Methodology किताब और अध्याय |
| `study/trade/` | Trade Theory किताब और अध्याय |
| `netlify/functions/api.mjs`, `netlify/lib/` | साझा API और database logic; संवेदनशील code, बिना विशेषज्ञ सलाह न बदलें |
| `cloudflare/worker.mjs` | Cloudflare Worker: API routing, static files और scheduled काम |
| `wrangler.jsonc` | Cloudflare Worker/D1 configuration; न बदलें जब तक वजह स्पष्ट न हो |
| `cloudflare/migrations/` | Database schema बदलने की migrations; गलती से चलाने पर data प्रभावित हो सकता है |
| `scripts/test-api.mjs` | API के automated tests |
| `docs/` | हिंदी उपयोग और deployment guides |

## पासवर्ड और छात्र-data की सुरक्षा

- Admin password, `ADMIN_SECRET`, API token और `.env` की कोई value GitHub, source file, screenshot या chat में **कभी न डालें**।
- Secrets Cloudflare में सुरक्षित रखे जाते हैं। उन्हें बदलना हो तो Cloudflare Dashboard के **Settings → Variables and Secrets** में authorized admin/developer की मदद लें।
- GitHub repository private रखें। Student data का backup repository में upload न करें।
- D1 की migration, database ID, `wrangler.jsonc` या `cloudflare/migrations/` को परीक्षण/backup के बिना न बदलें।

## अगर बदलाव live न दिखे

1. Cloudflare **Deployments** में देखें कि नया deployment `Ready` है या failed।
2. Failed हो तो error message पढ़ें; बार-बार अलग-अलग बदलाव push न करें।
3. Code बदलाव revert/fix करके नया commit `main` में push करें; नया successful deployment अपने-आप live होगा।
4. यदि सफल deployment के बाद भी समस्या है, Cloudflare Dashboard से पिछला सफल deployment वापस activate कराएँ या developer की मदद लें।
5. परीक्षा/छात्र/result का data गायब हो तो code या D1 में खुद delete/restore न करें—पहले admin backup सुरक्षित रखें और सहायता लें।

## याद रखने की सबसे आसान बात

**परीक्षा का content → एडमिन पैनल। वेबसाइट का रूप/code → GitHub की file, फिर `main` पर push।**  
GitHub push के बाद Cloudflare खुद website deploy करता है।
