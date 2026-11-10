
/* =====================================================================
   कंप्यूटर लैब  ·  data-hw2c.js
   हार्डवेयर गहराई — लैपटॉप/मोबाइल हार्डवेयर व बेंच यंत्र
     HW-6 : लैपटॉप व मोबाइल हार्डवेयर (SoC, पावर ट्री, BMS, LCD, M.2)
     HW-7 : वर्कशॉप, यंत्र व माप (मल्टीमीटर, ऑसिलोस्कोप, सॉल्डरिंग, POST)
   ===================================================================== */

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ---------------------------------------------------------------
   HW-6 · लैपटॉप व मोबाइल हार्डवेयर
   --------------------------------------------------------------- */
{
  id: 'hw-mobile', icon: '💻', group: 'हार्डवेयर गहराई',
  title: 'लैपटॉप व मोबाइल हार्डवेयर',
  sub: 'SoC, पावर ट्री, बैटरी BMS, LCD असेंबली, कीबोर्ड, M.2 व मोबाइल रिपेयर',
  kicker: 'Hardware Depth 6 · Laptop & Mobile Hardware',
  hero: 'डेस्कटॉप का नियम — “बोर्ड बड़ा, पुर्ज़े बदलने योग्य” — लैपटॉप व फ़ोन पर उल्टा हो जाता है। यहाँ RAM/SSD/GPU ज़्यादातर चिप से <b>सोल्डर (BGA)</b> होते हैं, पावर बहुत कम वोल्टेज पर चलती है, और बैटरी + <b>EC/PMIC</b> मिलकर चालू-बंद का पूरा नाटक संभालते हैं। यह अध्याय आपको डेस्कटॉप-से-अलग दुनिया का नक़्शा देता है: लैपटॉप के अंदर क्या-क्या बदल सकते हैं, फ़ोन का SoC/पावर-ट्री कैसे काम करता है, और बैटरी व LCD असेंबली की सर्विसिंग में कौन-सी ग़लतियाँ बोर्ड बर्बाद कर देती हैं।',
  tags: ['लैपटॉप फ़ॉर्म फैक्टर', 'SoC व पावर ट्री', 'बैटरी BMS', 'LCD/eDP असेंबली', 'M.2 व SO-DIMM', 'मोबाइल रिपेयर'],
  blocks: [
    { type: 'callout', kind: 'info', title: 'डेस्कटॉप से मूल अंतर एक लाइन में', html: 'डेस्कटॉप में आप <b>पुर्ज़े बदलते</b> हैं; लैपटॉप/फ़ोन में आप <b>असेंबली बदलते</b> हैं — डिस्प्ले पैनल, कीबोर्ड, टॉप-केस, बैटरी, फैन—हर चीज़ एक मोड़े हुए प्लास्टिक/धातु के ढाँचे का हिस्सा। और जो सबसे ज़रूरी है (CPU, GPU, RAM, कई बार SSD का कंट्रोलर) वह बोन की तरह बोर्ड से चिपका होता है। इसीलिए यहाँ <b>निदान</b> (diagnosis) बदलाव से ज़्यादा कीमती है।' },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">6.1</span> लैपटॉप फ़ॉर्म फैक्टर — कौन-सा मशीन किसके लिए</h3>' +
      '<p>सर्विसिंग में सबसे पहले यही तय करना होता है कि मशीन किस वर्ग की है, क्योंकि वर्ग ही तय करता है कि <b>बैटरी कितनी बड़ी</b>, <b>पुर्ज़े बदलने योग्य हैं या नहीं</b>, और <b>गर्मी कैसे निकलेगी</b>।</p>' },

    { type: 'table', head: ['फ़ॉर्म फैक्टर', 'मोटाई/वज़न (सामान्य)', 'बैटरी (Wh)', 'कौन ख़रीदता है / पहचान'],
      rows: [
        ['नेटबुक (Netbook — इतिहास)', '~20–25 mm, ~1.0–1.3 kg', '20–40 Wh', '2008-12 की सस्ती 10" मशीनें, Atom CPU, SSD नहीं eMMC/हार्ड — आज लगभग विलुप्त'],
        ['अल्ट्राबुक (Ultrabook)', '~13–16 mm, ~0.9–1.3 kg', '40–60 Wh', 'पतली, हल्की, soldered RAM, LPDDR, USB-C-only पोर्ट — mobility पेशेवर'],
        ['मेनस्ट्रीम (Mainstream/15-16")', '~18–23 mm, ~1.7–2.3 kg', '42–58 Wh', 'सबसे आम; अक्सर एक SO-DIMM + M.2 + 2.5" bay खुला — सर्विस करने लायक'],
        ['वर्कस्टेशन (Mobile Workstation)', '~20–28 mm, ~2.0–2.8 kg', '60–99 Wh', 'CAD/3D/BIM; Xeon/PRO GPU, ECC RAM, dock, दो SSD'],
        ['गेमिंग (Gaming)', '~21–27 mm, ~2.2–3.0+ kg', '60–99 Wh', 'bigger cooler, dual-fan, H/HX CPU + dGPU, RGB, ज़्यादा ports'],
        ['2-in-1 कनवर्टिबल (Convertible)', '~14–17 mm, ~1.2–1.6 kg', '40–57 Wh', '360° hinge + touch; अक्सर soldered RAM, pen support'],
        ['क्रोमबुक (Chromebook)', '~15–20 mm, ~1.1–1.6 kg', '40–53 Wh', 'ChromeOS, flash-only storage, बच्चों/स्कूल; soldered, कम repairable'],
        ['मोबाइल वर्कस्टेशन/rugged', '~22–30 mm, ~2.5–4 kg', '72–99 Wh', 'फ़ील्ड/उद्योग; MIL-STD, हॉट-स्वैप बैटरी, keyboard बदलने योग्य']
      ]},

    { type: 'callout', kind: 'tip', title: 'ख़रीद/सर्विस नज़र', html: '<b>अल्ट्राबुक/क्रोमबुक/2-in-1</b> में RAM व अक्सर SSD soldered — ग्राहक को “RAM upgrade नहीं होगा” पहले ही बताइए। <b>मेनस्ट्रीम/गेमिंग/वर्कस्टेशन</b> में खुला M.2 व SO-DIMM मिलता है — यहीं उन्नयन का पैसा कमाई का असली मौका है।' },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">6.2</span> लैपटॉप बनाम डेस्कटॉप — इंजीनियरिंग सौदे (Trade-offs)</h3>' +
      '<p>लैपटॉप डेस्कटॉप का “छोटा” संस्करण नहीं, एक अलग सौदा है: <b>कम वोल्टेज, कम गर्मी, कम जगह</b> के बदले <b>कम अपग्रेड</b>। यह तालिका वही अंतर दिखाती है जो सर्विस क्वोटेशन तय करती है।</p>' },

    { type: 'table', head: ['विषय', 'डेस्कटॉप', 'लैपटॉप', 'सर्विसिंग मतलब'],
      rows: [
        ['CPU/GPU अटैच', 'LGA सॉकेट/PCIe कार्ड — बदलने योग्य', 'BGA — बोर्ड से सोल्डर', 'चिप बदलना = micro-soldering; व्यावहारिक में पूरा बोर्ड बदलें'],
        ['RAM', 'DIMM, 2–4 स्लॉट, खुले', 'SO-DIMM और/या soldered LPDDR', 'soldered हो तो capacity पहले से तय; स्टिक बदलना मुश्किल'],
        ['बिजली वोल्टेज', 'ATX 12/5/3.3 V, खुले VRM', '19–20 V DC या USB-C PD, बंद VRM', 'चार्जर/DC-jack/PD IC अलग दोष; board-level repair'],
        ['थर्मल सीमा', 'बड़े हीटसिंक, 65–125 W+ TDP', 'छोटे heat pipe, 15–45 W (H/XH पर ~45–65 W)', 'धूल/सूखा पेस्ट लैपटॉप में ज़्यादा नुक़सान — थ्रॉटल तुरंत'],
        ['स्टोरेज', 'SATA + M.2 दोनों खुले', 'अक्सर केवल M.2 (NVMe/SATA)', '2.5" bay हटा दिया गया; NVMe key/slot मेल ज़रूरी'],
        ['हीट पाइप', 'CPU व GPU अलग कूलर', 'CPU+GPU <b>shared heat pipe</b> अक्सर', 'एक तरफ़ गर्मी = दूसरी चिप भी थ्रॉटल; सफ़ाई दोनों की साथ'],
        ['पावर ऑन', 'PSU + बोर्ड', 'चार्जर → EC (embedded controller) → PMIC', 'EC/RTC/CMOS दोष पर “बिल्कुल नहीं चालू” मिलता है']
      ]},

    { type: 'html', html: '<h4 class="blk2">CPU suffix — H / HX / P / U क्या मतलब</h4>' +
      '<p>एक ही नाम (जैसे “Core i7”) के पीछे अक्षर असली ताक़त व बिजली बताते हैं। suffix पढ़कर ही अनुमान लगाइए कि मशीन गेमिंग/वर्क है या thin battery-life।</p>' },

    { type: 'table', head: ['Suffix', 'वर्ग', 'नाम का मतलब (Intel/AMD)', 'TDP/व्यवहार'],
      rows: [
        ['U', 'Ultra-low power', 'पतले अल्ट्राबुक, लंबी बैटरी', '~9–15 W — हल्का काम, थर्मल जल्दी भरा'],
        ['P', 'Performance-thin', '(Intel 12th+) हल्की पर तेज़', '~15–28 W — संतुलन'],
        ['H', 'High performance', 'गेमिंग/वर्कस्टेशन mainstream', '~45 W — अच्छा sustained, भारी cooler'],
        ['HX', 'High performance + unlocked/overclock', 'फ़्लैगशिप गेमिंग/मोबाइल वर्कस्टेशन', '~55 W+ — डेस्कटॉप जैसा, ज़्यादा heat'],
        ['HS / H (AMD)', 'mobile Ryzen', 'संतुलित गेमिंग', '~35–45 W समायोज्य'],
        ['डेस्कटॉप K/F/etc.', 'socket CPU', 'K = unlocked, F = बिना iGPU', 'सॉकेट पर — बदलने योग्य, यह लैपटॉप में नहीं']
      ]},

    { type: 'callout', kind: 'warn', title: 'अपग्रेड की सीमा समझाइए', html: 'लैपटॉप का CPU/GPU/RAM ज़्यादातर <b>BGA</b> है — यानी “i5 को i7 बनाना” व्यावहारिक रूप से संभव नहीं (नए BIOS/PState/thermal के कारण)। ईमानदार सलाह: <b>RAM (खुला हो), M.2 NVMe, बैटरी, फैन, थर्मल</b> ही बदलने/बढ़ाने योग्य चीज़ें हैं। ग्राहक को यही बताइए, न कि झूठा वादा।' },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">6.3</span> अंदर का नक़्शा — नीचे का ढक्कन से EC तक</h3>' +
      '<p>ढक्कन खोलना ही सबसे बड़ी ग़लती का स्थान है। लैपटॉप में <b>अलग-अलग लंबाई के स्क्रू</b> एक ही ढक्कन पर होते हैं; छोटा स्क्रू लंबे छेद में डालने पर बोर्ड/ट्रेस कट जाते हैं। यह servicing का सबसे आम ख़र्चीला एक्सीडेंट है।</p>' },

    { type: 'steps', items: [
      { n: 1, title: 'पावर व बैटरी काटें', text: 'शट डाउन, चार्जर निकालें, ढक्कन खोलकर <b>मेन बैटरी का कनेक्टर पहला</b> हटाएँ। इससे EC/PMIC live नहीं रहते और शॉर्ट का ख़तरा घटता है।', warn: 'बैटरी कनेक्टर खोलते ज़ोर न डालें — ribbon फट जाता है; सीधे खींचें।' },
      { n: 2, title: 'स्क्रू मैप बनाइए', text: 'हर स्क्रू की जगह व लंबाई नोट करें ( magnetic mat / क्रमबिन / फ़ोटो)। कुछ स्क्रू कीबोर्ड के नीचे या स्टिकर के पीछे छिपे होते हैं।', tips: 'कंपनी सर्विस मैनुअल में “screw length (L=mm)” अक्सर दिया होता है।' },
      { n: 3, title: 'छोटा/लंबा अलग रखें', text: 'बंद करते समय <b>लंबा स्क्रू लंबे छेद में ही</b> जाए। छोटा स्क्रू गलत छेद में डालना = board damage; लंबा स्क्रू छोटे छेद में = component crush।', warn: 'यही वह असली सर्विसिंग ग़लती है जो मशीन को “चालू नहीं होता” बना देती है।' },
      { n: 4, title: 'ढक्कन प्रूइंग (prying)', text: 'प्लास्टिक spudger से किनारे खोलें, metal tool/नेल कभी नहीं — निशान व short दोनों बनते हैं। क्लिप टूटने आम शिकायत है।' },
      { n: 5, title: 'ESD व हैंडलिंग', text: 'ESD मैट + wrist strap से जुड़े हाथ, बोर्ड किनारे से पकड़ें, कनेक्टर/चिप पर उँगली नहीं।', tips: 'ribbon/FPC कनेक्टर में lock (flip-lock/ZIF) पहले खुलाएँ फिर केबल निकालें।' }
    ]},

    { type: 'html', html: '<h4 class="blk2">M.2 स्लॉट — Key E/A/E+ और एंटेना केबल</h4>' +
      '<p>लैपटॉप में M.2 स्लॉट एक जैसे नहीं होते — <b>key notch</b> बताता है कि उसमें क्या चलेगा। गलत key का कार्ड स्लॉट में नहीं बैठता और ज़बरदस्ती डालने पर नॉच टूटता है।</p>' },

    { type: 'table', head: ['M.2 Key', 'बस/प्रोटोकॉल', 'आमतौर पर क्या लगता है', 'नोट'],
      rows: [
        ['Key M', 'PCIe x4 (NVMe) या SATA (B&M)', 'स्टोरेज SSD (2230/2242/2260/2280)', 'NVMe बनाम SATA — स्लॉट capability BIOS से देखें'],
        ['Key A/E', 'PCIe x1 + USB 2.0 + I2C/ऑडियो', 'Wi-Fi/Bluetooth कार्ड (Intel/Realtek/Qualcomm)', 'छोटा 2230 कार्ड; antenna sockets IPEX/U.FL'],
        ['Key A+E', 'दोनों notch', 'WWAN (4G/5G modem) कार्ड', 'अक्सर “E key slot” कहा जाता; carrier + eSIM'],
        ['Key B', 'PCIe x2/SATA/USB', 'पुराना WWAN', 'आज कम; phone-style modules']
      ]},

    { type: 'html', html: '<p>Wi-Fi/WWAN कार्ड पर <b>1/2/3/4</b> नंबर के tiny coaxial antenna केबल (U.FL/IPEX) जुड़ते हैं — Intel AX कार्डों पर अक्सर Main(0)/Aux(1) और MIMO के लिए 2/3/4। इनके generations मिलाकर लगाना परफ़ॉर्मेंस गिराते हैं: IPEX (1st/4th/MHF4) connectors <b>matched generation</b> में ही ठीक से clip होते हैं। 1 का केबल 2 पर डाल देने पर signal कमज़ोर व unstable।</p>' +
      '<ul><li>केबल खोलते/चढ़ाते समय <b>plastic pick/नील</b> से सीधा ऊपर उठाएँ, केबल से न खींचें — core टूट जाता है।</li>' +
      '<li>एक socket खाली छोड़ने पर antenna diversity/ throughput घटता है (खासकर 2×2/AX मॉड्यूल)।</li></ul>' },

    { type: 'html', html: '<h4 class="blk2">2.5" bay बनाम M.2 NVMe/SATA</h4>' +
      '<p>पुराने mainstream लैपटॉप में <b>2.5" SATA bay</b> + M.2 दोनों होते; आज के पतले में सिर्फ़ M.2 NVMe। सर्विस में यह अंतर मायने रखता है: 2.5" HDD/SSD में bracket + ribbon/connector चाहिए; NVMe में सिर्फ़ <b>1 mm या 2.5 mm स्क्रू</b> (छोटी चीज़, खोने का ख़तरा)। NVMe कार्ड <b>SATA-only slot</b> में नहीं चलते और उलटा — key व protocol मिलाकर ही लें।</p>' },

    { type: 'html', html: '<h4 class="blk2">SO-DIMM स्लॉट व soldered LPDDR</h4>' +
      '<p>जहाँ 1–2 <b>SO-DIMM</b> स्लॉट खुले हैं वहाँ RAM बढ़ाना सबसे आसान upgrade है। LPDDR4x/5/5x (<b>सोल्डर</b>) वाले अल्ट्राबुक में capacity खरीदते समय ही तय हो जाती है — स्लॉट होते भी एक soldered हो सकता है। BIOS/मैनुअल से अधिकतम (max memory) व “one slot populated from factory” पढ़ लें। DDR4 vs DDR5 SO-DIMD मिलाएँ नहीं — notch व voltage अलग।</p>' },

    { type: 'html', html: '<h4 class="blk2">CMOS/RTC बैटरी</h4>' +
      '<p>छोटी <b>CR2032</b> (many में wire वाला coinpack) RTC व BIOS settings चलाती है। यह ख़त्म/ढीली हो तो symptoms: हर boot पर date/time गिरना, BIOS password reset, boot fail, “time not preserved off”. बदलना सस्ता repair — पर अक्सर keyboard/ढक्कन के नीचे छिपा होता है। <b>shipping mode</b> (नीचे) EC cell को deep-sleep करता है; shipping mode में बची मशीन “चालू नहीं” लगती है पर असल में sleep है।</p>' },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">6.4</span> मेन बैटरी, BMS, EC व चार्जर</h3>' +
      '<p>लिथियम-पोलिमर (Li-polymer) पैक में छोटी सेलें होती हैं जो <b>श्रृंखला (series)</b> से वोल्टेज और <b>समांतर (parallel)</b> से क्षमता (Ah) बनाती हैं। <b>3S</b> = 3 सेल श्रृंखला में ≈ 11.1–11.55 V nominal; <b>3S2P</b> = वही वोल्टेज पर दोगुनी Ah। क्षमता वाट-घंटे में: <b>Wh = V(nominal) × Ah</b> — यही असली "कितना चलेगा" का आँकड़ा है (mAh अकेला धोखा देता है, क्योंकि V अलग-अलग है)।</p>' +
      '<p>आधुनिक लैपटॉप 56 Wh (पतले), 60–72 Wh (mainstream/gaming) और 90–99 Wh (वर्कस्टेशन) पर क्यों केंद्रित हैं? क्योंकि <b>100 Wh एयरलाइन की सीमा</b> है — 100 Wh से कम बैटरी कैबिन में बिना अनुमति ले जा सकती हैं; बड़ी मशीनें जान-बूझकर 99 Wh पर सीमित करती हैं। (बैटरी के लेबल पर Wh छपा होता है, या Ah×V से निकालें।)</p>' +
      '<p><b>EC (Embedded Controller)</b> लैपटॉप का छिपा मैनेजर है — यह power button, lid, charger plug-in, thermal व fan को देखता है और <b>power-on sequence</b> चलाता है: AC present → EC wake → RTC/CMOS alive → EC PMIC को enable → S5→S3→S0 states. EC मरा/फिर्मी हो तो मशीन "बिल्कुल नहीं चालू" होती है पर चार्जिंग LED कभी-कभी झपकती है — यही उसका पहचान-चिह्न।</p>' +
      '<h4 class="blk2">बैटरी फूलना (swelling) व ट्रेकपैड</h4>' +
      '<p>पुरानी/नुकसान वाली Li-ion cell में गैसें बनती हैं → पैक <b>फूल</b> जाता है। चूँकि बैटरी ट्रेकपैड/कीबोर्ड के ठीक नीचे होती है, फूली बैटरी <b>ट्रेकपैड ऊपर उठा देती है</b> या टच सतह टूट-सी लगती है — यह शारीरिक लक्षण है। फूली बैटरी कभी दबाएँ/छेदना नहीं, चार्ज करना बंद करें, ESD बैग में अलग रखें और बदल दें। बदलने के बाद Windows में <b>calibration</b> (पूरा 100% → पूरी खाली → पूरा चार्ज) से BMS का fuel-gauge दोबारा सीखता है।' },

    { type: 'table', head: ['पैक विन्यास', 'सेल (Series×Parallel)', 'Nominal V', 'क्षण (typ.)', 'कहाँ मिलता है'],
      rows: [
        ['3S1P (3-cell)', '3×1', '~11.1–11.55 V', '40–50 Wh', 'पुराने/सस्ते लैपटॉप'],
        ['4S1P (4-cell)', '4×1', '~14.4–14.8 V', '50–62 Wh', 'mainstream 15"'],
        ['3S2P', '3×2', '~11.1–11.55 V', '50–65 Wh', 'पतले जहाँ मोटाई सीमित'],
        ['4S2P (8-cell)', '4×2', '~14.4–15.2 V', '70–99 Wh', 'वर्कस्टेशन/गेमिंग'],
        ['6S (rare)', '6×1/6×2', '~21–25 V', '90+ Wh', 'कुछ बड़े gaming/mobile WS'],
        ['Li-ion 18650/पॉच cell', 'cell level', '3.6–3.85 V nominal', 'per-cell 2–3.5 Ah', 'पैक के अंदर की ईंट']
      ]},

    { type: 'table', head: ['BMS का काम', 'क्या करता है', 'सर्विसिंग नोट'],
      rows: [
        ['Coulomb counting', 'आने-जाने वाला चार्ज (mAh/s) गिनकर SOC (% ) बताता है', 'ग़लत कैलिब्रेशन से % झूठ बोले — 100% पर भी अचानक बंद'],
        ['Cell balancing', 'हर सेल को बराबर V तक लाना (passive/active)', 'असंतुलित पैक = जल्दी क्षमता गिरना; बदलने का समय'],
        ['Charge limit (80%)', 'लॉन्गेविटी के लिए 80% पर रोक (BIOS/UEFI/OEM app)', 'लगातार 100% पर रखने से cycle life घटती; ग्राहक को बताइए'],
        ['Thermal throttle', 'सेल बहुत गर्म/ठंडी हो तो charge/discharge धीमा-रुक', 'गर्म हाउसिंग में "चार्ज नहीं हो रहा" = अक्सर यह सुरक्षा'],
        ['Sleep / Shipping mode', 'deep-sleep से self-discharge कम; नई मशीन shipping mode में आती है', 'shipping mode वाली मशीन "मरी" लगती है — चार्जर लगाकर EC wake करें'],
        ['Protection (OVP/UVP/OCP)', 'over-voltage/under-voltage/over-current पर MOSFET काटना', 'short पर pack चुप; multimeter से pack V जाँचें'],
        ['Gas-gauge/EEPROM ID', 'पैक की पहचान व capacity EEPROM में', 'OEM pack न मिलाएँ तो BIOS "battery not original" दे सकता है']
      ]},

    { type: 'code', code: 'C:\\> powercfg /batteryreport\n/* रिपोर्ट HTML बनती है — खोलकर देखें:\n   DESIGN CAPACITY   : फैक्ट्री की Wh/Ah\n   FULL CHARGE CAP.  : अब पूरी चार्ज पर कितना (यह घटा = wear)\n   CYCLE COUNT       : कितनी बार चार्ज-साइकल\n   wear % = 100 - (FULL/DESIGN*100)  →  ~80% पर बदलने का विचार */' },

    { type: 'table', head: ['USB-C PD प्रोफ़ाइल', 'वोल्टेज', 'शक्ति (step)', 'क्या/कैसे'],
      rows: [
        ['Fixed PDO', '5 / 9 / 15 / 20 V', '15 / 27 / 45 / 65 W', 'PD का बेस; फ़ोन आमतौर पर 5 या 9 V माँगता है'],
        ['20V बड़ा लोड', '20 V', '100 W (5 A)', 'ज़्यादातर लैपटॉप चार्जर; 5 A के लिए e-marker केबल अनिवार्य'],
        ['Extended PDO', '28 V', '140 W', 'नए गेमिंग/WS; USB-C 240 W (EPR) आ रहा है'],
        ['PPS (Programmable PS)', '3.3–21 V adjustable', '22/45/65 W+', 'Samsung/ Xiaomi fast-charge; चार्जर व डिवाइस वोल्टेज finely tune'],
        ['EPR', 'up to 48 V', 'up to 240 W', '240 W + e-marker + Cable Lock; बहुत नए']
      ]},

    { type: 'callout', kind: 'warn', title: 'चार्जर — नक़ली, धीमा चार्ज व "असली नहीं" जोखिम', html: '<b>USB-C PD एक वार्तालाप (negotiation) है</b>: चार्जर अपने PDO की घोषणा करता है, डिवाइस माँगता है, फिर वोल्टेज बदलता है। 5 A (100 W) के लिए <b>e-marker chip</b> वाला केबल चाहिए — साधारण केबल पर चार्जर केवल 3 A (60 W) देता है।<ul><li><b>फ़ोन लैपटॉप-चार्जर से धीमा क्यों?</b> फ़ोन का PD request छोटा PDO (5 V/9 V) हो सकता है, या फ़ोन अपना private fast-charge (VOOC/SuperCharge) माँगता है जो generic PD चार्जर पर 18–25 W पर सीमित हो जाता है।</li><li><b>सस्ता/नक़ली चार्जर:</b> सही isolation/protection न हो → surge पर board/PMIC जल सकता है; कम वाट का चार्जर भारी लैपटॉप पर battery drain करते-करते चलेगा।</li><li><b>वाट नापें:</b> USB-C PD meter tester से live V×A + negotiated protocol दिखता है — "65 W वाला चार्जर असल में कितना दे रहा है" यही बताता है।</li></ul>' },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">6.5</span> हिंज, चैसिस व थर्मल सिस्टम</h3>' +
      '<p><b>हिंज (hinge)</b> एक यांत्रिक पुर्ज़ा है जो हर दिन मोड़-मोड़ कर थकता है। ग्रीस सूखने पर कड़कड़ाहट, ज़्यादा कसने पर top/bottom case में <b>crack</b>, और हिंज माउंट (plastic boss) टूटना आम शिकायत है — टूटा माउंट अक्सर पूरे top-case बदलने पर मजबूर करता है। ढक्कन खोलते समय हिंज से केबल (display/eDP, antenna) खींचना न भूलें — कच्ची force से FLP/connector फटते हैं।</p>' +
      '<h4 class="blk2">थर्मल: vapor chamber बनाम heat pipe, dual-fan व liquid metal</h4>' +
      '<p><b>Heat pipe</b> (ताँबे की सील ट्यूब, अंदर wick + working fluid) गर्मी दूर तक ले जाती है; <b>vapor chamber</b> एक चपटी कक्ष है जो बड़े area पर evenly फैलाती है — पतले/high-TDP मशीनों में। गेमिंग में <b>dual-fan + shared heat pipe</b> (CPU+GPU एक ही हीटसिंक) — इसलिए एक चिप गर्म हो तो दूसरी भी थ्रॉटल होती है। <b>धूल-फ़िल्टर</b> वाले मॉडल में फ़िल्टर साफ़ करना सफ़ाई का पहला कदम।</p>' +
      '<p><b>Liquid metal</b> (गैलियम-based, कुछ गेमिंग OEM) की चालकता बहुत अच्छी पर वह <b>चालक (conductive)</b> है — एल्युमिनियम हीटसिंक/Die के किनारे बहकर पहुँचे तो <b>short-circuit</b> का ख़तरा, और Al के साथ galvanic reaction से उसे खाता है। इसीलिए liquid metal रीपेस्ट सिर्फ़ trained लोग, सही barrier के साथ करें; सावधानी के बिना न छुएँ।</p>' +
      '<p><b>थ्रॉटलिंग कैसे पकड़ें (HWiNFO64):</b> "CPU Package Power" (कितना W असल में लग रहा), core clocks, "Thermal (and Power) Limit" / "Thermal Throttling" flag — लोड पर clock गिरता + flag आता = थर्मल पावर-बजट पूरा नहीं हो रहा। Fan curve व BIOS के <b>Quiet/Balanced/Performance</b> mode यह तय करते हैं कि cooler कितना तेज़ चलेगा — performance mode में dB ऊँचा पर sustained clock ज़्यादा।</p>' },

    { type: 'table', head: ['थर्मल घटक / जाँच', 'पहचान व मान', 'सर्विस नुक्ता'],
      rows: [
        ['Heat pipe ट्यूब', 'दबाव पर भरी ताम्र पाइप; छिद्र/डेंट = गर्मी न जाए', 'मोड़ी/छिदरी pipe बदलें (पूरा heat-sink assembly)'],
        ['Vapor chamber', 'चपटी धातु कक्ष, बड़े spread के लिए', 'पतले/प्रीमियम; रीपेस्ट के बाद अच्छा clamp ज़रूरी'],
        ['Thermal pad thickness', 'VRM/VRAM पर 0.5–1.5 mm; मूल से मेल ज़रूरी', 'ग़लत मोटाई = pad compressed नहीं / chip gap — pad gauge/vernier से नापें'],
        ['Liquid metal TIM', 'चालक; Al पर galvanic risk', 'केवल trained; सही barrier/clamp; spill = short risk'],
        ['HWiNFO CPU Package Power', 'W; thermal limit flag', 'flag + clock गिरना = cooler/पेस्ट/धूल दोष'],
        ['Fan curve / BIOS mode', 'Quiet/Balanced/Perf; RPM vs temp', 'fan न चले तो fan connector/RPM जाँचें; bearings बदलें']
      ]},

    { type: 'callout', kind: 'danger', title: 'Liquid metal + एल्युमिनियम = दो जोखिम एक साथ', html: 'गैलियम एल्युमिनियम को <b>amalgamate करके खाता</b> है (Al-Ti-Ga reaction), और चूंकि liquid metal <b>बिजली का सुचालक</b> है — हीटसिंक/Die के किनारे बहकर SMD pads या socket के संपर्क में आए तो <b>short</b> और मृत बोर्ड। गैर-पेशेवर को liquid metal कभी न लगाने दें; OEM जो factory में भरता है उसके लिए ही वो safe है (boil/dam के साथ)।' },

    { type: 'steps', items: [
      { n: 1, title: 'बैटरी + AC काटें, EC drain', text: 'बैटरी कनेक्टर हटाएँ, चार्जर निकालें, power button 15–20 s दबाकर residual drain (EC reset) — यही सुरक्षित रीपेस्ट की शुरुआत।', warn: 'live board पर heat-gun/iron = short व fume ख़तरा।' },
      { n: 2, title: 'हीट-सिंक खोलें (X-क्रम ढीला)', text: 'हीटपाइप पर अंकित 1-2-3-4/या क्रम में स्क्रू धीरे-धीरे आधा-आधा ढीले करें, फिर पूरी तरह; warp/pressure अचानक छूटने पर die crack होता है।' },
      { n: 3, title: 'पुराना पेस्ट/पैड हटाएँ', text: 'IPA 99% + lint-free से die व heat-sink बेस साफ़; thermal pad बदलने में <b>मूल मोटाई (mm)</b> मिलाकर ही नया पैड लगाएँ।' },
      { n: 4, title: 'पेस्ट मात्रा व पैड', text: 'Die के बीच में मटर-दाने जितना पेस्ट; VRM/VRAM पर सही-mohtai के पैड; बहने से रोकने के लिए बीच में ही, किनारों पर नहीं।' },
      { n: 5, title: 'clamp + क्रम में कसें', text: 'हीट-सिंक सीधा रखकर X-क्रम में equally कसें — एक कोना पहले कसने से gap व hot-spot बनता है।' },
      { n: 6, title: 'थर्मल टेस्ट', text: 'बैटरी/AC जोड़ें, HWiNFO खोलें, 10–15 min load — peak Tj, throttling flag व fan profile जाँचें; पहले जैसा गर्म = clamp/pad/धूल दोबारा देखें।' }
    ]},

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">6.6</span> डिस्प्ले, कीबोर्ड, इनपुट व पोर्ट सर्विसिंग</h3>' +
      '<p><b>पैनल इंटरफ़ेस:</b> आज के लैपटॉप में <b>eDP (embedded DisplayPort)</b> — पतला ribbon, आमतौर पर 30/40-pin, lane count (2/4 lane) resolution-refresh तय करती है; पुरानी मशीनों में <b>LVDS</b>। पैनल बदलते समय <b>EDID/spec match</b> ज़रूरी: resolution, refresh, connector (30/40 pin), eDP vs LVDS, brightness/backlight type, touch (हाँ/ना)। मेल न खाए तो backlight नहीं/no signal/wrong resolution।</p>' +
      '<h4 class="blk2">OLED, 120 Hz, touch व glass-vs-assembly</h4>' +
      '<p><b>OLED</b> में per-pixel emissive → गहरा काला पर <b>burn-in</b> का ख़तरा (static taskbar/logo घंटों बाद छाया)। <b>120 Hz+</b> smooth पर battery ज़्यादा खाता (adaptive refresh इसीलिए)। touch में <b>on-cell/in-cell</b> (digitizer panel से जुड़ा) vs <b>OGS/added</b> — और <b>"glass only" vs "full assembly"</b> असली कीमत-तर्क: digitalizer alone बदलने की machine (laminator/OCR) चाहिए, shop में अक्सर पूरा assembly बदलना ही व्यावहारिक + warranty-safe होता है।' +
      '<h4 class="blk2">कीबोर्ड — matrix, backlight व liquid damage</h4>' +
      '<p>कीबोर्ड एक <b>row×column matrix</b> है; एक ही <b>column</b> के सारे keys मरने का मतलब उस लाइन/ribbon trace का टूटना, न कि हर key। <b>Ribbon/FPC</b> व <b>ZIF/flip-lock</b> connector संभाल-से काम (खुला lock बिना केबल न निकालें)। <b>backlight fuse/choke</b> उड़ने पर keys चलते पर रोशनी नहीं; कुछ models में white dots (backlight diffuser) दिखते। <b>Liquid damage:</b> तुरंत power off + बैटरी काटें (2 सेकंड का काम); फिर board उठाकर <b>IPA 99% wash + ultrasonic cleaner</b>, connector हटाकर corrosion हटाना — फिर भी मशीन "कुछ हफ़्ते बाद मरती है" क्योंकि residual corrosion trace को धीरे-काटता है (इसे "death by corrosion after weeks" कहते हैं)।' +
      '<h4 class="blk2">टचपैड, TrackPoint, फिंगरप्रिंट व TPM/BitLocker</h4>' +
      '<p><b>टचपैड</b> bus दो तरह: <b>I2C</b> (नए, <b>Windows Precision</b> drivers) बनाम <b>SMBus/PS2-emulation</b> (पुराना, vendor driver) — Precision न मिले तो gestures काम नहीं। clickpad में <b>pivot wear</b> से click असमान। <b>TrackPoint</b> (Lenovo) का nipple व bottom button अलग calibration। <b>फिंगरप्रिंट/Windows Hello</b> के लिए IR camera + <b>TPM</b> चाहिए; board बदलने पर <b>TPM owner</b> बदल जाता है और <b>BitLocker recovery key</b> माँगता है — board swap से पहले ग्राहक से recovery key/Microsoft account ज़रूर लें, वरना डेटा लॉक।</p>' +
      '<h4 class="blk2">पोर्ट व board-level failure</h4>' +
      '<p>bent <b>USB port के मुड़े pins</b> (micro-solder repair) या <b>DC jack rebuild</b>; <b>HDMI port</b> ज़ोर से खींचने पर pad/pins lift। <b>Ethernet/USB से ESD</b> TVS diodes/protectors खा जाते हैं (port chip के पास short)। <b>"एक USB-C port पर charge होता, दूसरे पर नहीं"</b> = उस Type-C controller के एक channel/CC line का दोष। <b>Capacitor short</b> खोजना: thermal camera से hot MLCC, या IPA freeze technique (IPA स्प्रेकर जिस cap पर frost तुरंत पिघले = short) — फिर diode-mode/current-injection से confirm (यह hw-tools का विषय भी है)।' },

    { type: 'steps', items: [
      { n: 1, title: 'बिजली काटें + बैटरी हटाएँ', text: 'shutdown, AC out, bottom cover खोलकर battery connector हटाएँ; तभी display ribbon से छेड़छाड़ सुरक्षित।' },
      { n: 2, title: 'bezel / glass हटाएँ', text: 'प्लास्टिक spudger/pick से bezel clips खोलें; glued glass (OLED/laminated) पर heat + suction से, force सीधी रखें।' },
      { n: 3, title: 'cable व mount', text: 'eDP/LVDS ribbon का ZIF lock खुलाकर केबल निकालें; panel screws/brackets हटाएँ; antenna/ webcam ribbon न खींचें।' },
      { n: 4, title: 'match करके नया पैनल लगाएँ', text: 'resolution/refresh/connector/eDP-lane/touch — मूल से मेल; backlight type (LED vs OLED) भी।' },
      { n: 5, title: 'EDID/first-boot जाँच', text: 'बैटरी/AC जोड़कर बूट; BIOS/OS में सही resolution+refresh; brightness slider काम करे; dead/stuck pixel टेस्ट रंग।' },
      { n: 6, title: 'बंद + touch calibration', text: 'bezel back, touch हो तो Windows "Calibrate the screen for pen/touch"; hinge grease व clamp दोबारा।' }
    ]},

    { type: 'table', head: ['विषय', 'विकल्प-1', 'विकल्प-2', 'सर्विस मतलब'],
      rows: [
        ['पैनल इंटरफ़ेस', 'eDP (30/40-pin, 2/4 lane)', 'LVDS (पुराना)', 'मेल न खाए = no signal/backlight dead'],
        ['कीबोर्ड mechanism', 'scissor-switch (laptop)', 'membrane / mechanical', 'scissor keycap अलग बिकते; पूरा कीबोर्ड assembly बदलना आसान'],
        ['टचपैड bus', 'I2C + Windows Precision', 'SMBus/PS2 vendor driver', 'Precision driver न हो तो gestures दोष'],
        ['फिंगरप्रिंट + Hello', 'IR camera + TPM', 'capacitive FP + Hello', 'board swap → TPM owner change → BitLocker recovery'],
        ['USB-C charge channel', 'दोनों port ठीक', 'एक ही port charge', 'एक Type-C controller/CC चैनल का दोष'],
        ['Cap short पकड़ना', 'thermal camera hot MLCC', 'IPA freeze + diode/current injection', 'बोर्ड-लेवल repair (hw-tools में विस्तार)']
      ]},

    { type: 'callout', kind: 'warn', title: 'बोर्ड बदलने से पहले — TPM / BitLocker interlock', html: 'विंडोज़ की <b>BitLocker</b> encryption कुंजी <b>TPM</b> में सील होती है। board (और उसमें TPM) बदलने पर OS recovery key माँगता है — अगर ग्राहक के पास Microsoft account/printed recovery key न हो तो <b>डेटा हमेशा के लिए लॉक</b>। इसलिए: board swap से पहले <b>BitLocker suspend</b> या <b>recovery key backup</b> करवा लें। यही नियम firmware-hashed keys/Windows Hello PIN पर भी लागू।' },
    { type: 'html', html: '<h3 class="blk"><span class="blk-n">6.7</span> मोबाइल फ़ोन — SoC, रेडियो, फ़्लैश व नैतिक सीमाएँ</h3>' +
      '<p>फ़ोन का दिमाग एक <b>SoC (System on Chip)</b> है — CPU, GPU, NPU, ISP, DSP, modem, memory-controller सब एक ही die पर। CPU में <b>ARM Cortex-A clusters</b> — efficiency + performance कोर (पुराने naming में <b>big.LITTLE</b>, जैसे 2×Cortex-X + 4×A720 + 6×A520) — हल्का काम छोटे कोर पर, भारी बड़े पर, ताकि बैटरी बचे। GPU <b>Mali/Adreno/Apple</b>। <b>NPU</b> AI/photography/blur, <b>ISP</b> कैमरा pipeline, <b>DSP</b> audio/sensor, modem <b>on-die</b> (Snapdragon) या <b>external</b> (कुछ Exynos/Dimensity)। सुरक्षा के लिए <b>TrustZone/TEE (Trusty)</b> और ऐप्पल का <b>Secure Enclave</b> — biometric/payment keys यहीं रहते हैं, OS में नहीं।</p>' +
      '<h4 class="blk2">रेडियो, बैंड व IMEI (क़ानूनी पक्ष)</h4>' +
      '<p>baseband 2G-5G बैंड चलाता है। <b>भारत में आम बैंड</b>: 4G/LTE — Band 3 (1800), 8 (900), 28 (700), 40 (2300 TDD), 41 (2500 TDD); 5G — n78 (3.5 GHz) व n41, कुछ n77। ज़्यादा बैंड = अच्छा roam/coverage; फ़ोन चुनते समय <b>carrier बैंड match</b> देखें। <b>Carrier aggregation</b> दो बैंड जोड़कर speed बढ़ाता है। SIM → <b>eSIM</b> (on-board chip, profile download) → <b>iSIM</b> (SoC के अंदर) की ओर जा रहा है। <b>IMEI</b> फ़ोन की उँगली-पहचान है — <b>IMEI बदलना/टैम्पर करना भारत में क़ानूनी रूप से दंडनीय</b> है; चोरी/गुमशुदा फ़ोन का IMEI "repair" करना मना है — नैतिक व क़ानूनी stop-line।</p>' +
      '<h4 class="blk2">फ़्लैश/unbrick व FRP — ग्राहक-सहमति की सीमा</h4>' +
      '<p>सॉफ़्टवेयर-लेवल ब्रिक ठीक करने के concepts: <b>Qualcomm EDL (9008 mode)</b> में deep-flash, <b>MediaTek SP Flash Tool</b> (DA + auth), <b>Samsung Download Mode + Odin</b>, <b>Fastboot</b> (Pixel/Xiaomi) — ये firmware/partition दोबारा डालते हैं। पर <b>FRP (Factory Reset Protection / Google Account Lock)</b> या Apple Activation Lock <b>सुरक्षा फ़ीचर</b> हैं: factory reset के बाद ग्राहक अपने Google/Apple ID से verify करता है। <b>ग्राहक के फ़ोन पर FRP bypass करना क़ानूनी/नैतिक रूप से जोखिम-क्षेत्र में जा सकता है</b> (चोरी-रोक)। नीति: <b>पहले verified proof of purchase + ID</b>, फिर सिर्फ़ मालिक की अपनी Google/Apple credentials से unlock — shop bypass tools का उपयोग ग्राहक-सम्पत्ति पर न करें।</p>' },

    { type: 'table', head: ['SoC/मेमोरी तह', 'मोबाइल', 'लैपटॉप बराबरी', 'नोट'],
      rows: [
        ['CPU कोर', 'ARM Cortex-A clusters (efficient+perf)', 'x86 Intel/AMD (H/U/P…)', 'फ़ोन कम W में काम; instruction set अलग (apps recompiled)'],
        ['GPU', 'Mali / Adreno / Apple', 'Intel iGPU / NVIDIA / AMD dGPU', 'फ़ोन GPU shared memory; thermal पर clock झूलता'],
        ['AI', 'NPU (Hexagon/NPU/ANE)', 'अक्सर dGPU या Intel NPU', 'फ़ोटो/blur/on-device AI यहीं'],
        ['RAM', 'LPDDR4X / LPDDR5 / LPDDR5X (soldered)', 'DDR4/DDR5 SO-DIMM या LPDDR', 'फ़ोन में हमेशा soldered; bandwidth प्रति पिन नहीं बढ़ा सकते'],
        ['Storage', 'UFS 2.2/3.1/4.0, eMMC (सस्ता)', 'NVMe PCIe Gen3/4/5, SATA', 'UFS ≈ phone-NVMe; eMMC ≈ धीमे SATA/junior'],
        ['64-bit + सुरक्षा', 'ARMv8/v9 64-bit, TrustZone/TEE', 'x86-64, TPM/VT-d', 'key/biometric TEE में, root-attack से अलग']
      ]},

    { type: 'callout', kind: 'danger', title: 'IMEI/स्टोलेन-डिवाइस — यहाँ रुकिए', html: 'किसी भी सूरत में <b>IMEI rewrite/tamper</b> या lock हटाना ऐसी सेवा न दें जो संदिग्ध/चोरी डिवाइस की ओर इशारा करे। <b>IMEI बदलना क़ानूनन अपराध</b> है। शक होने पर <b>CEIR/मालिक ID</b> verify करें; बिना proof-of-purchase के locked device पर काम इनकार करना ही सुरक्षित व्यावसायिक नीति।' },

    { type: 'html', html: '<h4 class="blk2">पावर ट्री, PMIC व charging; डिस्प्ले/कैमरा/सेंसर</h4>' +
      '<p>फ़ोन की <b>PMIC (Power Management IC)</b> बैटरी से कई रेलें बनाती है — CPU/GPU (high current), memory, camera, display, audio, modem हर अपनी rail; charging अलग <b>charge IC</b> संभालता है। <b>QC (Qualcomm)/VOOC (OPPO)/SuperCharge (Huawei)</b> private protocols vs <b>USB PD/PPS</b> standard — protocol match न हो तो धीमा charge; charge IC failure पर "बिल्कुल चार्ज नहीं / % अटका / heat"। <b>Wireless Qi / Qi2 (magnets)</b> convenience + thermal derating (गर्म होकर speed घटती)। बैटरी 3800–6000 mAh (≈14–23 Wh); swelling व hazard लैपटॉप जैसा ही — फूली battery press/पंच न करें।</p>' +
      '<p><b>डिस्प्ले:</b> LCD (backlight + liquid crystal) vs <b>OLED/AMOLED</b> (self-emissive, गहरा काला, burn-in risk)। <b>in-cell/on-cell/OGS</b> touch integration से मोटाई घटी; <b>frame bonding/lamination</b> machine-काम — glass-only vs full assembly यही price logic तय करता है। touch IC दोष = "ghost touch/कुछ area नहीं"। <b>under-display fingerprint</b> optical (प्रकाश से photo) vs ultrasonic (ध्वनि लहर से 3D)। notch/punch-hole sensor alignment ज़रूरी। <b>refresh 90/120/144 Hz</b> smooth पर battery।</p>' +
      '<p><b>कैमरा:</b> sensor size (1/x.x") — बड़ा बेहतर low-light; <b>f-number (f/1.8)</b> aperture जितना छोटा अंक उतनी रोशनी; <b>OIS</b> (lens/sensor हिलकर shake-रोक) vs <b>EIS</b> (software crop); focus <b>PDAF</b> (phase) vs <b>LAF</b> (laser); multi-cam में <b>periscope</b> telezoom। "camera app closes" = power rail/cap failure या connector, न कि हमेशा sensor।</p>' +
      '<p><b>ऑडियो:</b> <b>smart PA amplifier</b> speaker चलाता (IC दोष = "आवाज़ नहीं/crackle"); mic array से noise-cancel; earpiece-receiver बनाम bottom speaker; <b>water-ejection</b> (sound से पानी बाहर)।</p>' },

    { type: 'table', head: ['सेंसर', 'काम', 'आम दोष/लक्षण'],
      rows: [
        ['Accelerometer', 'गिरना/rotation/step', 'auto-rotate नहीं; games tilt fail'],
        ['Gyroscope', 'सटीक rotation/VR/OIS support', '360° video drift, AR jitter'],
        ['Magnetometer (compass)', 'दिशा', 'map arrow ग़लत; calibration loop'],
        ['Proximity + Ambient light', 'call पर screen off; auto-brightness', '"कॉल कट जाती है" = proximity गंदगी/कवर से block'],
        ['Barometer', 'altitude/मौसम', 'indoor navigation/step count में assist'],
        ['Hall (चुंबक)', 'flip-cover open/close detect', 'cover हटाते ही screen न जले / चुंबक से confusion'],
        ['ToF / LiDAR', 'गहराई/AF', 'portrait/AR focus दोष']
      ]},

    { type: 'table', head: ['विषय', 'विकल्प/मान', 'सर्विस मतलब'],
      rows: [
        ['स्टोरेज प्रकार', 'eMMC (सस्ता) vs UFS 3.1/4.0', 'eMMC boot धीमा; "0 bytes/free" = FW/boot area damage'],
        ['IP रेटिंग', 'IP54 / IP67 / IP68', 'पहला अंक=धूल (6=complete), दूसरा=पानी (8=immersion, test-conditions)'],
        ['IP बनाम warranty', 'water damage आमतौर पर NOT covered', 'IP lab-test पर, असली गिरावट/pressure पर guarantee नहीं'],
        ['micro-solder', '0201 components, multi-layer board, flex conn', 'iron hot-air + flux + Kapton + microscope; reballing stencil'],
        ['रीफ़्लो (leaded vs lead-free)', 'peak ~217-227 / ~235-250 °C', 'preheat ज़रूरी; board warping व component stress से बचाव'],
        ['common faults', 'charge IC, audio IC, CPU cold-joint, PMOS switch', 'diode-mode/current-injection/rail-map से localization']
      ]},

    { type: 'table', head: ['मोबाइल/बोर्ड-रिपेयर औज़ार', 'क्या/मान', 'नोट'],
      rows: [
        ['ESD mat + wrist strap', 'common ground point', 'dry winter में ESD ज़्यादा — humidity 40-60% रखें'],
        ['Spudger/pick, suction, opening wires', 'plastic, non-marring', 'metal से short व scratch'],
        ['Pentalobe P2/P5, Torx T2/T4/T5, Phillips', 'फ़ोन/screw types', 'screw strip न काटें (cam-out)'],
        ['Ultrasonic cleaner + IPA 99.9%', 'corrosion wash', 'अच्छी तरह dry — board wet न छोड़ें'],
        ['DC power supply (current-limited)', '4–5 V, current limit set', 'boot current signature (steps में) पढ़ना'],
        ['Multimeter diode-mode', 'rail short/opens', 'board unpowered; good diode ~0.4–0.7 Si'],
        ['Thermal camera', 'short component locate', 'IPA freeze का supplement'],
        ['Stereoscope/microscope + hot-air + iron', '0201/QFP/BGA rework', 'temp/airflow table पालन; stencil reball'],
        ['Programming boxes / EDL cables', 'FW flash (advanced)', 'बैकअप व legal ownership पहले']
      ]},

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">6.8</span> सेकंड-हैंड लैपटॉप/फ़ोन — ख़रीद-जाँच (15 बिंदु)</h3>' +
      '<p>ग्राहक/दुकान के लिए यही जाँच-list पैसे बचाती है। हर बिंदु औज़ार-सहज है; बिना जाँच ख़रीदना सबसे बड़ी ग़लती। <b>कीमत-band नीचे "अनुमानित" है</b> — बाज़ार/मॉडल/उम्र से बदलता है, ठोस दाम न बताएँ।</p>' },

    { type: 'table', head: ['#', 'जाँच', 'कैसे/औज़ार', 'संकेत'],
      rows: [
        ['1', 'BIOS serial व warranty', 'BIOS में serial + manufacturer site पर service tag/IMEI', 'serial mismatch = repainted/replaced board'],
        ['2', 'बैटरी health', 'powercfg /batteryreport; Design vs Full charge, cycles', 'wear >20% या cycles ज़्यादा = बदलें'],
        ['3', 'पैनल टेस्ट', 'solid-color/white-black images; dead-pixel + backlight bleed', 'एक भी बड़ा bleed/streak = मोटिवेशन कम'],
        ['4', 'कीबोर्ड टेस्ट', 'keyboard test utility (हर key); backlight', 'मरा column/row = board damage के संकेत'],
        ['5', 'पोर्ट टेस्ट', 'हर USB/HDMI/audio/SD + charge दोनों Type-C', 'कमज़ोर/मुड़ा port = micro-solder ख़र्च'],
        ['6', 'स्ट्रेस 15 मिनट', 'HWiNFO + stress; temp/throttle', 'thermal fail = cooling दोष, मोटा bill'],
        ['7', 'SSD SMART', 'CrystalDiskInfo (Health, TBW, Power-on)', 'SMART warning = बदलने वाला SSD'],
        ['8', 'RAM मौजूद/सही', 'Task Manager/BIOS/CPU-Z', 'soldered हो तो capacity fixed'],
        ['9', 'Wi-Fi/BT/WWAN', 'device manager + real connect; antenna 1/2 जाँच', 'एक antenna गायब = slow speed'],
        ['10', 'FRP/iCloud lock', 'reset करके Google/Apple ID माँगे—नहीं दिखना चाहिए', 'locked = बेचने का हक़ नहीं; legal stop'],
        ['11', 'IMEI/serial stolen check', 'CEIR/manufacturer/telecom database', 'blacklisted = ख़रीदें ही नहीं'],
        ['12', 'Hinge/chassis', 'बारें खोल-बंद; cracks, wobble, screen flex', 'हिंज माउंट टूटा = महँगा top-case'],
        ['13', 'Camera/mic/speaker', 'कैमरा app, recorder, playback', 'camera closes = rail/cap fault'],
        ['14', 'Charger original/watt', 'PD meter से negotiated W; e-marker केबल', 'कम W charger = slow drain under load'],
        ['15', 'Fingerprint/Hello/TPM', 'enroll करके देखें; TPM present (tpm.msc)', 'TPM गायब/board swap से BitLocker ज़रूरत']
      ]},

    { type: 'callout', kind: 'info', title: 'कीमत-band (अनुमानित, INR) — केवल मार्गदर्शन', html: '<b>ये आँकड़े अनुमानित हैं</b> और मॉडल/उम्र/बाज़ार से बहुत बदलते हैं; कभी ठोस वादा न बनाएँ। अनुभव-क्रम: साफ़ मेंटेन्ड चलने-योग्य used mainstream laptop एक सीमित range में मिलता है; gaming/mobile-workstation का मूल्य GPU+CPU+condition पर अत्यधिक निर्भर। <b>फ़ोन</b> में condition (battery health, screen original, no lock) सबसे बड़ा price-driver। ग्राहक को हमेशा <b>invoice + test report + short warranty</b> दें, अंदाज़ा नहीं।' },

    { type: 'acc', title: 'FAQ — लैपटॉप व मोबाइल', items: [
      {q: 'SoC क्या है? साधारण CPU से अलग?', a: 'SoC (System on Chip) एक ही die पर CPU+GPU+NPU+ISP+DSP+modem जोड़ता है। फ़ोन/पतले लैपटॉप में यही कारण है कि पुर्ज़े अलग नहीं बदले जाते — सब एक चिप।' },
      {q: 'eSIM vs iSIM में फ़र्क़?', a: 'eSIM board पर soldered चिप जिसमें carrier profile download होता है; iSIM उसी को SoC के अंदर ले जाता है (अलग chip नहीं)। दोनों में physical SIM नहीं डालनी पड़ती।' },
      {q: 'in-cell touch मतलब?', a: 'digitizer panel के अंदर ही बना होता है (LCD/OLED से integrated) — मोटाई कम, पर टूटे तो glass-only बदलना मुश्किल; अक्सर पूरा assembly बदलना पड़ता है।' },
      {q: 'PMIC क्या करता है?', a: 'Power Management IC — बैटरी/चार्जर से input लेकर हर subsystem (CPU, memory, camera, display, modem) के लिए अलग regulated rail बनाता है; एक rail की failure = उसी फ़ीचर का मरना।' },
      {q: 'Wh निकालने का formula?', a: 'Wh = V(nominal) × Ah। mAh को Ah में बदलने के लिए 1000 से भाग दें। एयरलाइन-सीमा 100 Wh पर आधारित है, इसीलिए 99 Wh वाले पैक बनते हैं।' },
      {q: 'BMS के मुख्य काम?', a: 'Coulomb counting (fuel gauge %), cell balancing (सेल को बराबर V), protection (OVP/UVP/OCP + thermal throttle)। साथ में charge-limit व sleep/shipping mode।' },
      {q: 'बैटरी यूज़र-replaceable क्यों नहीं?', a: 'पतलापन/structural battery, water/dust sealing व safety के लिए OEM pack internal करते हैं; बदलाव service center का काम, स्वयं करने पर warranty/security जोखिम।' },
      {q: 'USB-C PD कैसे तय करता है कितना वाट?', a: 'Source अपने PDO (5/9/15/20 V + W) advertise करता है; sink चुनकर request करता है; >3 A (60 W+) के लिए e-marker केबल अनिवार्य। PPS में finely adjustable V। meter से negotiated value दिखता है।' },
      {q: 'IP68 का मतलब व warranty?', a: '6=धूल-प्रतिरोध (complete), 8=निर्माता-तय immersion तक पानी; पर यह lab-condition पर — असली नुकसान (pressure, detergent) अलग; इसलिए water damage warranty में नहीं।' },
      {q: 'eMMC बनाम UFS?', a: 'दोनों फ़ोन-storage; UFS NVMe-जैसा तेज़ parallel interface, eMMC धीमा serial। "0 bytes"/boot fail = firmware/boot-area damage — अक्सर reflash/board repair।' },
      {q: 'Laptop CPU suffix H/U से क्या फ़र्क?', a: 'U ~9-15W thin/battery; P ~15-28W; H ~45W gaming/WS; HX 55W+ desktop-like. Battery-life बनाम performance यही तय करता है; soldered होने से upgrade नहीं होता।' },
      {q: 'Liquid metal क्यों ख़तरनाक?', a: 'वह बिजली-सुचालक है (spill पर short) और एल्युमिनियम को galvanic से खाता है — इसलिए केवल trained, सही barrier/Die पर; साधारण user न छुएँ।' }
    ]},

    { type: 'callout', kind: 'exam', title: 'परीक्षा/इंटरव्यू — मोबाइल व लैपटॉप हार्डवेयर', html: '<ul><li><b>SoC</b> = CPU+GPU+NPU+ISP+DSP+modem एक die पर; फ़ोन में पुर्ज़े soldered इसीलिए।</li><li><b>eSIM</b> on-board profile, <b>iSIM</b> SoC के अंदर।</li><li><b>in-cell</b> touch panel के अंदर integrated; glass-only बदलना कठिन।</li><li><b>PMIC</b> हर subsystem की rail बनाता है; एक rail failure = एक फ़ीचर बंद।</li><li><b>Wh = V × Ah</b>; एयरलाइन सीमा <b>100 Wh</b>।</li><li><b>BMS</b>: coulomb counting + balancing + protection + charge-limit।</li><li>बैटरी internal क्यों: पतलापन/structural + sealing + safety।</li><li><b>USB-C PD</b>: PDO negotiation, >60 W पर e-marker, PPS adjustable।</li><li><b>IP68</b>: 6 धूल-complete, 8 immersion (lab); water damage warranty-out।</li><li><b>eMMC धीमा serial, UFS तेज़ parallel (NVME-जैसा)</b>।</li><li><b>IMEI बदलना/FRP bypass बिना proof-of-purchase — क़ानूनी जोखिम, stop-line।</b></li></ul>' },
  ]
},

/* ---------------------------------------------------------------
   HW-7 · वर्कशॉप, यंत्र व माप
   --------------------------------------------------------------- */
{
  id: 'hw-tools', icon: '🧰', group: 'हार्डवेयर गहराई',
  title: 'वर्कशॉप, यंत्र व माप',
  sub: 'मल्टीमीटर, क्लैंप मीटर, ऑसिलोस्कोप, पावर सप्लाई, सॉल्डरिंग, ESD व POST उपकरण',
  kicker: 'Hardware Depth 7 · Instruments & Bench Craft',
  hero: 'एक अच्छा टेक्नीशियन आँख से नहीं, <b>यंत्र से</b> सोचता है। मल्टीमीटर बताता है “वोल्टेज कितना है”, ऑसिलोस्कोप बताता है “वह वोल्टेज <b>कैसा</b> बदल रहा है”, और current-limited bench supply बताती है “बोर्ड कितनी धारा <b>खींच</b> रही है” — यही तीन सवालों पर board-level diagnosis खड़ा है। यह अध्याय बेंच की बनावट से शुरू करके हर यंत्र की <b>सही विधि, सीमा व ख़तरा</b> सिखाता है, और साथ में सॉल्डरिंग/रिवर्क व POST-उपकरण।',
  tags: ['मल्टीमीटर व diode-mode', 'CAT सेफ़टी', 'ऑसिलोस्कोप व probe', 'सॉल्डरिंग व reflow', 'POST/beep कोड', 'CH341 व consumables'],
  blocks: [
    { type: 'callout', kind: 'info', title: 'बेंच = सुरक्षा + गति', html: 'एक अनुशासित बेंच चार चीज़ें देता है: <b>ESD-सुरक्षित सतह</b>, <b>सही रोशनी/मैग्निफ़िकेशन</b>, <b>flux धुआँ बाहर करने वाला fume extractor</b>, और <b>क्रमबद्ध स्क्रू/पुर्ज़ा स्टोरेज</b>। ये चीज़ें “गो-लाइन” repair (बिना नुकसान) की नींव हैं।' },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">7.1</span> वर्कशॉप की नींव — ESD, रोशनी, ग्राउंडिंग</h3>' +
      '<p><b>ESD मैट</b> और <b>wrist strap</b> दोनों एक ही <b>common ground point</b> पर जाने चाहिए — अगर मैट एक ground पर और strap दूसरे पर हों तो उनके बीच potential अंतर होकर डिवाइस वहीँ जल सकता है। strap के अंदर 1 MΩ resistor होता है ताकि गलती से mains छूने पर करंट सीमित रहे।</p>' +
      '<h4 class="blk2">नमी व सर्दियाँ</h4>' +
      '<p><b>सूखा मौसम (कम humidity) = ज़्यादा static</b>। ~40–60% RH पर ESD जोखिम कम; सर्दियों/AC-रूम में हवा सूखी होकर चिप-मृत्यु के मामले बढ़ते हैं। इसलिए मैट+strap अनिवार्य, और संवेदनशील चिप (CMOS/MOSFET) पर हाथ से पहले discharge।</p>' +
      '<h4 class="blk2">पैकेजिंग व ग्राउंड जाँच</h4>' +
      '<p>anti-static <b>pink foam</b> सस्ती protection देती पर conducting नहीं; <b>silver shielding bag</b> (बॉडी चार्जिंग से बचाव) shipment के लिए; <b>foam (black conductive)</b> बॉडी-charged objects रोकता। दीवार का आउटलेट <b>socket tester</b> से जाँचें (open ground/ reversed/ neutral-ground bond) — ख़राब wiring पर यंत्र व मरीज़ दोनों ख़तरे में। लैब में औज़ार-सूची (inventory) व हर यंत्र का <b>calibration रिकॉर्ड</b> रखना “उपकरण-बीमा” जैसा है।' },

    { type: 'table', head: ['पैकेजिंग/सतह', 'क्या करती है', 'कब उपयोग', 'सावधानी'],
      rows: [
        ['Pink anti-static foam', 'आंशिक leakage से charge धीमा; mechanical cushion', 'बोर्ड interim रखना', 'समय के साथ गुण घटते; बार-बार जाँचें'],
        ['Silver shielding bag', 'Faraday-style; <b>body-charged object</b> से बचाव', 'shipping/WWAN/SSD/RAM मेल', 'bag के बाहर से छूएँ—अंदर वाली सतह ground नहीं'],
        ['Black conductive foam', 'पिन आपस में short कर charge रोकता', 'MOSFET/IC transport', 'असुरक्षित mechanical—पिन मोड़ सकता'],
        ['ESD mat + strap', 'common ground पर discharge', 'हर board-level काम', 'दोनों एक ही ground point पर; strap में 1 MΩ'],
        ['Regular bubble wrap', 'सिर्फ़ cushion — static जनरेट भी करता', 'shipping outer', 'ESD-sensitive चीज़ें कभी इसमें न डालें']
      ]},

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">7.2</span> मल्टीमीटर (DMM) — गहराई से</h3>' +
      '<p><b>एनालॉग (needle)</b> में trend/waveform-जैसा भाव दिखता पर accuracy कम; <b>डिजिटल (DMM)</b> सटीक व multi-function। हर फंक्शन <b>सही तरीक़े</b> से — यहीं शुरूआती गड़बड़ करते हैं। सबसे खतरनाक ग़लती: <b>वोल्टेज मापने वाली जगह पर धारा (A) मापने के लिए series में जोड़ देना</b> — internal fuse (या board) उड़ जाता है। वोल्टेज हमेशा <b>parallel</b>, धारा हमेशा <b>series</b>, प्रतिरोध <b>unpowered</b> circuit पर।</p>' },

    { type: 'table', head: ['फंक्शन', 'कैसे मापें (सही विधि)', 'सीमा/ग़लती'],
      rows: [
        ['V DC', 'parallel — प्रोब दो बिंदुओं के बीच', 'COM प्रोब काले/ground पर; DC vs AC डायल गड़बड़'],
        ['V AC (true-RMS)', 'parallel', 'non-RMS SMPS waveform ग़लत दिखाएगा (नीचे 7.2.x)'],
        ['A (श्रृंखला)', 'circuit <b>तोड़कर series</b>', '10 A input fused; mA/µA अलग jack; चूक = fuse-blow'],
        ['mV', 'parallel, sensitive', 'thermocouple/offset व noise का ख़याल'],
        ['Ω (resistance)', 'power OFF + cap discharge', 'powered पर Ω = ख़तरा व ग़लत पाठ'],
        ['Continuity beep', 'power OFF', 'cap charging से झूठा beep; diode path से भ्रम'],
        ['Diode drop', 'power OFF', 'board पर parallel path से reading बदलती (नीचे)'],
        ['Capacitance', 'discharged, isolated', 'in-circuit parallel path ग़लत दिखाता'],
        ['Frequency / Duty', 'signal पर parallel', 'low/high ADC bandwidth की हद; PWM duty यहीं'],
        ['Temperature', 'probe/type मिलाकर (K/J)', 'type मिलाओ तो ग़लत °C'],
        ['NCV', 'बिना छुए field-pick', 'presence—not value; false alarms आम']
      ]},

    { type: 'callout', kind: 'danger', title: 'चार सुनहरी सुरक्षा-रेखाएँ', html: '<ul><li><b>never measure resistance/continuity on a POWERED board</b> — पाठ ग़लत + यंत्र/बोर्ड नुकसान।</li><li><b>discharge caps first</b> (SMPS में बड़े electrolytic ख़तरनाक तक चार्ज रहते हैं) — bleed resistor/proper discharge से।</li><li><b>धारा सीरीज़ में, वोल्टेज पैरेलल में</b> — गड़बड़ = fuse blow या शॉर्ट।</li><li><b>unsuitable meter से mains कभी न नापें</b> — नीचे CAT रेटिंग देखें।</li></ul>' },

    { type: 'table', head: ['Diode-mode पाठ', 'अर्थ', 'बोर्ड-लेवल उपयोग'],
      rows: [
        ['~0.4–0.7 V (Si)', 'अच्छा silicon diode/junction', 'rail पर एक दिशा में forward drop स्वाभाविक'],
        ['~0.15–0.3 V (Schottky)', 'Schottky (कम drop)', 'power rail/TVS के पास आम'],
        ['OL / 1.xx (open)', 'खुला/चालक नहीं (या parallel नहीं)', 'open trace, कटा via, मरा diode'],
        ['0.000 / ~0 V', 'short', 'मरा diode/cap/IC — यहीं शॉर्ट खोजने का बिंदु'],
        ['दोनों दिशा में कम O/L', 'short/leaky', 'PMOS/PMIC rail cap short, liquid damage'],
        ['दोनों ओल', 'open loop', 'path कटा; rail floating (unpowered board)']
      ]},

    { type: 'html', html: '<p>बोर्ड पर <b>diode-mode का असली कमाल:</b> हर power rail का ground/0 V के सापेक्ष forward-diode पाठ एक baseline होता है; जिस rail पर 0.000 (short) दिखे—वहीं fault है। यही current-injection (7.3 का स्टेप) से मिलकर शॉट लोकलाइज़ करता है।</p>' },

    { type: 'table', head: ['ATX रेल', 'आदर्श', 'सहनीय खिड़की', 'नोट'],
      rows: [
        ['+3.3 V', '3.3 V', '±5% (3.14–3.47)', 'तंग tolerance — आउट-ऑफ़ पर PSU/board दोष'],
        ['+5 V', '5.0 V', '±5% (4.75–5.25)', 'USB/logic रेल; brownout यहीं'],
        ['+12 V', '12.0 V', '+5% / −7% (~11.4–12.6)', 'ATX spec में +12/−5 व −12/−7; motor/GPU भारी लोड'],
        ['+5 VSB', '5.0 V', '±5%', 'स्टैंडबाय — 3.3VSB/5VSB ripple scope पर सीमित'],
        ['−12 V', '−12 V', '±10%', 'आधुनिक PSUs में प्रायः absent/unused'],
        ['−5 V', '−5 V', '—', 'पुराना ISA — आज मौजूद नहीं']
      ]},

    { type: 'html', html: '<h4 class="blk2">7.2.x True-RMS क्यों ज़रूरी</h4>' +
      '<p>सस्ता non-RMS DMM sine-manual पर calibrated होता है और pure sine में ठीक। पर SMPS/PWM/fan-signal जैसे <b>non-sine waveforms</b> पर यह 10–40% ग़लत पढ़ता। <b>True-RMS</b> meter असली heating-equivalent निकालता है — servicing में AC ripple-मुक्त DC, digital signal और SMPS secondary के लिए यही चाहिए। ripple “कितनी है” DMM नहीं — <b>scope</b> बताता (7.3)।</p>' },

    { type: 'table', head: ['CAT रेटिंग', 'कहाँ माप', 'मतलब'],
      rows: [
        ['CAT I', 'electronics, signal-level (protected)', 'सबसे कम; कमज़ोर transient'],
        ['CAT II', 'plug-in appliances / outlets (short branch)', 'घरेलू उपकरण, यंत्र-feeding'],
        ['CAT III', 'fixed wiring, outlets, distribution, breaker feeds', 'बिल्डिंग-level; transient robust'],
        ['CAT IV', 'service entrance, meter, main panel', 'सबसे कठोर; incoming surge'],
        ['600 V CAT III', 'आउटलेट/fixed wiring तक सुरक्षित (standard-rated)', 'लैपटॉप/PC mains सर्विस में यही न्यूनतम; poor CAT से mains न मापें']
      ]},

    { type: 'html', html: '<h4 class="blk2">7.2.y स्पेक-शीट, digits व आम DMM ख़राबियाँ</h4>' +
      '<p><b>Counts/digits</b> accuracy बताते हैं: 3½-digit = 1999 counts, 4½ = 19999 — अधिक counts = अधिक resolution। spec में <b>“±(% reading + digits)”</b> होता है; calibration से समय के साथ drift। <b>आम ख़राबियाँ:</b> blow हो 10 A fuse, कमज़ोर battery (अस्थिर पाठ), LID/hold चालू रहकर value freeze, auto-range लटका, corroded probes/जैक, मापा-रास्ता impedance loading। हर यंत्र खरीद/सेवा पर <b>reference source से calibration-check</b>।</p>' },

    { type: 'steps', title: '7.3 · चार प्रैक्टिकल माप-प्रक्रियाएँ', items: [
      { n: 1, title: 'ATX पावर सप्लाई टेस्ट', text: 'बोर्ड से 24-pin अलग करें → PS_ON# (हरा, pin16) को COM (काला) से jump कर चालू करें → हर रेल (3.3/5/12/5VSB) true-RMS DMM पर, फिर <b>load tester</b> पर रेटेड लोड देकर ripple scope पर देखें → ±5%/-7% खिड़की से तुलना; PWR_OK (ग्रे) 3–6 V जाँचें।', warn: 'SMPS खुली-असेंबली में mains+voltage stress—के trained, insulation, एक-हाथ नियम।' },
      { n: 2, title: 'बोर्ड पर शॉट (diode + current injection)', text: 'unpowered board हर rail पर diode-mode → जिस rail 0.000; फिर bench PSU se <b>वही rail पर 0.5–1 V, current-limit (1–3 A)</b> injection → thermal camera/IPA freeze से सबसे गर्म component = culprit → हटा/बदलो → diode baseline दोबारा मेल।', tips: 'current-limit कभी न बढ़ाएँ—अनचाहे short व heat।', warn: 'board live मत छोड़ें; injection के दौरान touch नहीं।' },
      { n: 3, title: 'बैटरी/चार्जर जाँच', text: 'pack open-circuit V (nominal के अंदर?), charge के वक़्त V/A (USB-C meter/PD tester पर negotiated protocol); phone/laptop battery: <code>powercfg /batteryreport</code> design vs full-charge + cycles; cell internal-resistance <b>specialized meter</b> से (DMM का काम नहीं)।', warn: 'फूली/गर्म battery पर चार्ज-टेस्ट न करें।' },
      { n: 4, title: 'POST से पहले के 5 माप (RAM/power-good)', text: 'बूट न होने पर क्रम: (1) CMOS/RTC coin 3 V? (2) 5VSB/3V3SB (standby) मौजूद? (3) PS_ON pull → PMIC enable? (4) rail sequence + power-good (PWR_OK)? (5) RAM rail (VDD) + clock crystal scope/freq? — यही EC/PMIC/Power-good diagnosis का core।' }
    ]},

    { type: 'callout', kind: 'exam', title: 'परीक्षा — मल्टीमीटर/ATX/CAT', html: '<b>V पैरेलल, A सीरीज़</b> (fuse blow ग़लती यहीं)। <b>powered पर Ω/continuity कभी नहीं</b>; caps discharge। <b>Diode: Si 0.4–0.7, Schottky ~0.2, OL open, 0.000 short</b>। <b>ATX ±5% (12 V −7%)</b>, −5V आज नहीं। <b>True-RMS</b> = non-sine पर सही; <b>ripple DMM नहीं scope</b>। <b>600 V CAT III</b> = fixed wiring/outlet तक सुरक्षित। <b>4½-digit = 19999 counts</b>।' },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">7.4</span> ऑसिलोस्कोप (DSO/DPO/MSO)</h3>' +
      '<p>यंत्र वो <b>time</b> दिखाता है जो DMM नहीं: switching node, ripple की shape, clock presence, PWM duty, serial bits। specs पढ़ना = कौन-सा काम संभव। probes व trigger सही नहीं तो waveforms झूठ बोलते हैं।</p>' },

    { type: 'table', head: ['Spec', 'अर्थ', 'सर्विसिंग-लागू'],
      rows: [
        ['Bandwidth (MHz)', 'उप-सिग्नल frequency तक माप', 'crystal/FSB/PWM देखने के लिए ≥100 MHz उपयोगी'],
        ['Sample rate (GSa/s)', 'कितनी बार नमूना', 'BW से ≥2–5× ज़्यादा हो waveform smooth'],
        ['Memory depth', 'कितना record पकड़े', 'long serial/LVDS debug में लंबी rec needed'],
        ['Channels', 'एक साथ traces', 'PS/2/serial decode के लिए ≥2; rail+junction 2-4'],
        ['Rise time (tr)', 'tr ≈ <b>0.35/BW</b>', 'edge sharpness; BW बढ़ो तो tr घटता'],
        ['Vertical res', '8-bit आम; 12-bit high-end', '12-bit = कम ripple resolution बेहतर'],
        ['Waveform update', 'कितनी बार/सेकंड नया', 'fast glitches पकड़ने में मायने'],
        ['प्रकार', 'DSO/DPO/Analog; MSO (digital)', 'MSO logic-analyzer साथ; DLA ultra-high-speed']
      ]},

    { type: 'table', head: ['Control/फीचर', 'क्या', 'कैसे उपयोग'],
      rows: [
        ['Time/div', 'क्षैतिज scale (s/div)', 'crystal=µs-ns; PWM=few-ms'],
        ['Volts/div', 'ऊर्ध्व scale', 'rail छोटा step तब दिखता जब scale ठीक'],
        ['Coupling DC/AC/GND', 'offset हटाना/दिखाना', 'ripple = AC coupling (DC offset हटाकर)'],
        ['Trigger (edge/level/src)', 'waveform स्थिर करना', 'rail/junction पर rising/falling + level'],
        ['Single/Normal/Auto', 'capture mode', 'glitch के लिए Single; Auto भ्रमित करे'],
        ['Holdoff', 're-trigger रोक', 'multi-edge/serial decode स्थिरता'],
        ['Math FFT', 'frequency spectrum', 'noise/ripple/interference का spectral'],
        ['Cursors', 'measure period/freq/duty', 'Δtime→1/Δt = freq; duty = high/period'],
        ['Serial decode', 'UART/I2C/SPI/CAN/PS2/USB-LS', 'सस्ता scope <b>PS/2 keyboard decode</b> कभी-कभी—practical']
      ]},

    { type: 'html', html: '<h4 class="blk2">Probe 1× बनाम 10× व compensation</h4>' +
      '<p><b>1×</b> अधिक loading, कम BW; <b>10×</b> (~9 MΩ+cap) कम loading—servicing default। <b>Compensation</b>: probe को square-wave terminal पर, scope अपने-आप adjust; square के corners <b>flat/overshoot/ringing</b> हों तो probe cap-tuner घुमाकर flat बनाएँ—ग़लत क्षतिपूर्ति (compensation) माप को distort करता। <b>ground-lead inductance</b> से ringing; छोटा <b>ground-spring</b> प्रयोग करें। high-current के लिए <b>current probe/Rogowski</b>; mains-level के लिए <b>isolated/differential HV probe</b>।</p>' +
      '<h4 class="blk2">SMPS पर scope की सुरक्षा</h4>' +
      '<p><b>scope का chassis ground mains-earth से tied</b> होता है—सामान्य probe का ground clip <b>mains neutral पर मत लगाओ</b> (short!)। primary side मापने के लिए <b>isolation transformer</b> या <b>differential probe</b> ही सही; secondary/rail-side माप इसी नियम के साथ। <b>crystal/resonator:</b> x10 probe की input-capacitance oscillator को <b>load</b> कर stop/detune कर सकती—इसलिए crystal “oscillate है” सिर्फ़ scope से कंफ़र्म करना बेहतर <b>frequency counter/spectrum analyzer</b> से करें; probe से देखना हो तो minimal-loading trick व short ground।</p>' },

    { type: 'callout', kind: 'danger', title: 'Probe ground से mains short = विस्फोट-स्तर ख़तरा', html: 'Normal probe का ground clip scope-PC/mains-earth से जुड़ा रहता है। इसे mains-neutral या live के कहीं भी छूआ तो <b>dead-short/breaker-trip/scope damage/fire</b>। <b>primary/referenced-to-mains node पर साधारण probe से माप कभी नहीं</b>—पहले isolation transformer या HV differential probe, और trained हाथ से।' },

    { type: 'table', head: ['क्या देखें (scope पर)', 'स्वस्थ संकेत', 'ख़राब संकेत'],
      rows: [
        ['3.3 VSB / standby ripple', 'छोटी, नियमित ripple (spec limit)', 'बड़ा/आवृत्ति-बदलता ripple = PSU/filter दोष'],
        ['PWM switching node', 'तेज़ clean edges, right duty', 'ringing/overshoot = drive/snubber/fet दोष'],
        ['Memory DDR waveform', 'व्यवस्थित levels/timing', ' reflections/गंदे edges = routing/termination'],
        ['Clock crystal', 'stable sine; freq spec के पास (counter)', 'no swing = oscillator/PMOS/stop—probe-loading सावधानी'],
        ['PS/2 keyboard (decode)', 'clock+data bits, protocol bytes', 'glitch = pullup/line-short/connector']
      ]},

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">7.5</span> फंक्शन जेनरेटर व कंपोनेंट-टेस्टर</h3>' +
      '<p><b>Function generator</b> सिग्नल डालकर input-stage/switch-logic जाँचने में मदद करता (square/sine/triangle; freq-amplitude)। <b>Transistor/component tester</b> (जैसे LCR-T4) pin डालते ही hFE, type, pinout, diode/Cap/Res/L पहचानता। <b>ESR meter</b> blown/bulged capacitor का Equivalent Series Resistance बिना desolder जाँचता—पर <b>in-circuit ESR झूठ बोल सकता है</b> क्योंकि parallel components path देते हैं; संदिग्ध पर एक पैर उठाकर/desolder कर नापें। <b>LCR meter</b> सटीक L/C/R देता। इनका दायरा “component-level” है; board-level fault अभी भी diode-mode/current-injection/scope से मिलता।' },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">7.6</span> सॉल्डरिंग व रिवर्क स्टेशन</h3>' +
      '<p><b>Temp-controlled</b> iron (thermocouple feedback) heater-only से बेहतर—setpoint पर स्थाना TIP। wattage जितनी, उतना <b>thermal mass</b> बड़े pads/planes पर heat पहुँचाता। <b>Lead-free (SAC305)</b> का melting ~217 °C, इसलिए working temp आमतौर पर <b>~350 °C</b> (tip) व contact heat transfer के लिए right tip shape ज़रूरी। ceramic heater vs interchangeable-tip iron: बाद वाला सस्ता; बाद वाले में tip shapes से जॉब। <b>Tip care</b>: हमेशा tin करके रखें; dry/oxided tip solder नहीं लेता—tip tinner/activator से बचाना।</p>' },

    { type: 'table', head: ['Tip shape', 'काम', 'नोट'],
      rows: [
        ['Conical (I)', 'general, small pads', 'ज़्यादा heat spread नहीं—बड़े planes पर मुश्किल'],
        ['Chisel/Screwdriver', 'drag-soldering, SMD rows', 'एक direction; QFP pads drag आसान'],
        ['K/Bevel', 'multi-purpose, larger joints', 'thermal reservoir अच्छा'],
        ['Hoof/J (gummy)', 'chip-pad heat spread', 'MLCC/pad lift कम'],
        ['Needle/Iron fine', 'jumper wires, tiny pads', 'delicate; जल्दी oxidize हो सकती'],
        ['Wick-sitter/flat', 'solder braid pressing', 'pad पर बराबर दबाव']
      ]},

    { type: 'table', head: ['जॉब', 'Hot-air °C (tip)', 'Airflow', 'Nozzle', 'Kapton'],
      rows: [
        ['0201/0402 R/C', '~320–350', 'medium-low', '1–2 mm needle', 'आस-पास caps mask'],
        ['0603/SOT', '~340–360', 'medium', '2–3 mm', 'border mask'],
        ['SOIC/SOP', '~350', 'medium', 'small oval', 'adjacent IC cover'],
        ['QFP (fine pitch)', '~350–370', 'high', 'wide oval/4-hole', 'nearby plastic mask'],
        ['BGA (reball/remove)', '~380–400', 'high', 'BGA nozzle + preheat', 'surround protect'],
        ['Preheat (बड़ा board)', 'board 100–150 °C', '—', 'IR/plate', 'warp/short stress घटाता']
      ]},

    { type: 'table', head: ['Flux प्रकार', 'कोड', 'गुण', 'धुलाई-सलाह'],
      rows: [
        ['Rosin (R)', 'R (Type R)', 'मild, corrosion कम', 'residue अक्सर fine— पर high-reliability पर wash'],
        ['Rosin mildly activated (RMA)', 'RMA', 'थोड़ा strong, residue हल्का', 'आमतौर पर wash optional; sensitive पर wash'],
        ['Activated rosin (RA)', 'RA', 'oxide हटाने strong', '<b>residue corrosive—washing सुझाई</b>'],
        ['No-clean', 'NC/ROL0/ROL1', 'कम-residue, board-level फ़ीचर', 'residue जेल जैसा; high-humidity/rel-critical पर wash बेहतर'],
        ['Liquid soldering flux', 'various', 'pen/brush application', 'activity देखकर; IPC J-STD wash vs no-clean tradeoff']
      ]},

    { type: 'table', head: ['Solder', 'गलनांक/विशेषता', 'कब', 'Wire'],
      rows: [
        ['63/37 (Sn/Pb)', 'eutectic ~183 °C', 'clean joints, rework-friendly (Leaded—fume/disposal नियम)', '0.3–0.5 mm SMD'],
        ['60/40', '~183–190 paste range', 'general (Leaded)', '0.5–1 mm THT'],
        ['SAC305 (lead-free)', '~217–220 °C', 'RoHS boards; ~350 °C working', '0.3–0.5 mm fine'],
        ['Silver-bearing (0.3–3.0% Ag)', 'strength/wetting', 'कॉपर/immersion finish पर', '0.5 mm'],
        ['Paste (solder stenciled)', 'reflow for', 'BGA/reball, SMT', 'n/a'],
        ['0.5 mm vs 1 mm', 'diameter = flow rate', '0.5 SMD; 1+ THT/heavy', '—']
      ]},

    { type: 'html', html: '<h4 class="blk2">Wick/sucker व reflow profile</h4>' +
      '<p><b>Solder wick (braid)</b> flux-laden hot ho जाता—pad से हटाने में जल्दी व <b>pad lift</b> ख़तरा; suction pump/desoldering gun बेहतर volume हटाता। <b>Reflow (lead-free)</b> curve चार हिस्से: <b>preheat</b> (thermal gradient सीमित), <b>soak</b> (flux activate), <b>reflow</b> (peak ~235–250 °C, liquidus above ~217), <b>cooling</b> (controlled)। <b>Pre-heating</b> ज़रूरी ताकि board warp न हो, joints uneven न बनें, और component/PCB thermal shock से बचे।</p>' },

    { type: 'table', head: ['Reflow stage', 'तापमान (lead-free आसपास)', 'क्या होता है', 'ग़लती'],
      rows: [
        ['Preheat', '~150–180 °C तक ramp (2–4 °C/s)', 'पूरा board समान गर्म', 'too fast = thermal shock'],
        ['Soak', '~180–190 °C, ~60–120 s', 'flux सक्रिय, oxide हट', 'long = flux burn'],
        ['Reflow/Peak', 'liquidus ~217 °C+, peak ~235–250 °C', 'solder wetting/joint', 'over 260 = damage'],
        ['Cooling', 'controlled ~4 °C/s', 'grain/joint solid', 'fast = cold-joint risk']
      ]},

    { type: 'html', html: '<h4 class="blk2">Board-level repairs, cleaning व माइक्रोस्कोप</h4>' +
      '<p><b>BGA reballing</b> = stencil से नए solder balls + hot-air + flux + inspection (X-ray ideal), temperature profile पालन। <b>Lifting pads</b> पर careful heat, <b>jumper wires ~0.03 mm enamelled wire</b> से trace bypass, <b>via repair</b>, और <b>ground plane heat-sink</b> बड़ा joint—इसलिए plane वाले pads “पिघलते नहीं” दिखते: extra heat-sink से iron बड़े tip/high-watt चाहिए, नहीं तो pad lift होगा। सफ़ाई: <b>ultrasonic + IPA 99% workflow</b>—flux/corrosion हटा, फिर पूरी तरह dry (residue/humidity विसर्जन बढ़ाते)। <b>Stereoscope</b> हर micro-work का आधार—अच्छी रोशनी व उचित magnification।</p>' +
      '<h4 class="blk2">सुरक्षा (सॉल्डरिंग)</h4>' +
      '<p><b>Lead fume/flux smoke</b> inhalation से बचाव (extractor), <b>isopropylflammable</b> (open spark/iron से दूर, capped), <b>आँखों की सुरक्षा</b> (hot-air/splash), <b>iron burn first aid</b> (thanda पानी 10-20 min, no ice/ointment सील नहीं, blister मत फोड़), bench पर <b>खाना-पीना मना</b> (lead ingestion), और <b>solder dross/leaded waste e-waste</b> अलग—trash में नहीं।' },

    { type: 'callout', kind: 'danger', title: 'Flux धुआँ, IPA व गर्म air', html: 'Flux/rosin smoke आँख-फेफड़े-irritant है—<b>fume extractor</b> श्वास-रेखा से दूर रखें। IPA 99% <b>बहुत flammable</b>—hot plate/iron/station के पास न खुला रखें, well-ventilated, capped containers। <b>Hot-air</b> 350 °C+—plastic/labels/Kapton न पकड़ें; बाल-कपड़े से दूर। बेंच पर पहला नियम: <b>एक ही काम, तभी जब ध्यान पूरा</b>।' },

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">7.7</span> POST कार्ड, बीप व ख़ास जाँच-उपकरण</h3>' +
      '<p><b>POST card</b> (PCI legacy / PCIe debug) boot-stage का 2-digit code दिखाता है। आम अर्थ (AMI-style, vendor भिन्न): <b>00</b>=no code/CPU-not-starting, <b>A2</b>=early chipset/SB init (often hangs), <b>D3</b>=USB/IO-related, <b>D6</b> इत्यादि—पर हर BIOS/UEFI व OEM अलग कोड रखता है; <b>सर्विस मैनुअल</b> ही reference। Motherboard पर onboard <b>debug LED</b> (BOOT/CPU/DRAM/VGA) भी यही काम करते।</p>' },

    { type: 'table', head: ['BIOS/Vendor', 'बीप पैटर्न अर्थ', 'नियम'],
      rows: [
        ['AMI', '1 short = refresh; 1-3 = memory; long+shorts = video', 'कोड/मैनुअल से मिलाएँ'],
        ['Award/Phoenix', '1 long=video; 3 short=memory; repeating=PSU/board', 'Phoenix combo-codes भिन्न'],
        ['Dell/HP/Lenovo (vendor)', 'आपनी beep/LED sequence (e.g. 3-amber blink)', 'model-specific service manual ज़रूरी'],
        ['POST card codes', '00 / A2 / D3 / D6 (typical AMI)', 'vendor differ; manual + datasheet'],
        ['Onboard LEDs', 'BOOT/CPU/DRAM/VGA stuck = stage', 'जल्द पहचान; beep/POST पूरक']
      ]},

    { type: 'html', html: '<p><b>Speaker/buzzer test</b> और <b>USB power/protocol meter</b> (V/A/W + PD/QC protocol display), <b>cable testers</b> (wire-map 8-conductor, PoE, tone/finder, 8-LED LAN tester, RJ45 crimp—T568A/B wiring topic में), <b>fiber</b> (visual fault pointer, power meter, OTDR mention) diagnostic kit का हिस्सा हैं। इनके साथ <b>BIOS-chip programmer</b> board-FLASH recovery देता है।' },

    { type: 'table', head: ['उपकरण', 'काम', 'सावधानी/नोट'],
      rows: [
        ['CH341A programmer', '24-series (24Cxx) & 25-series (25Qxx) SPI EEPROM/Flash read/write/dump', '<b>25-series पर 3.3 V pin-2 (VCC) hazard</b>—wrong = chip kill; 8 MB flash पर famous “CH341 can’t >2^? (8MB fix)”'],
        ['SPI/eMMC programmer', 'boot-firmware / eMMC/SSD-NAND flashing', 'advanced; locked flash erase/write न हो पाए; backup पहले'],
        ['Locked flash', 'RPMB/secure-boot regions', 'programmer “can’t erase”/“can’t write” सामान्य—proper tools/keys'],
        ['USB-C PD tester', 'negotiated V/A/W/protocol', '5 A पर e-marker; over-spec देखें'],
        ['Current-limited bench PSU', 'rail inject + boot-current signature', 'limit पहले set; OV/OC protection'],
        ['ESD simulator/gun', 'product ESD immunity test', 'lab-only, calibrated']
      ]},

    { type: 'html', html: '<h4 class="blk2">CH341A — शक्ति व जाल</h4>' +
      '<p>CH341A सस्ता SPI/EEPROM programmer है: 24-series (24C01–24C16) व 25-series (25Q40/80/3210…) flash। दो बड़े जाल: (1) <b>3.3 V supply — कई boards/chips VCC गलत लगने पर मरते</b>; external-3.3V trick/patch व SOP8/SOIC8 clip सही से। (2) <b>बड़ा flash (आमतौर पर >8 MB / 16 MB)</b> पर CH341 का address-limit (24-bit) काम नहीं करता—“CH341 8 MB/16 MB fix” (patched software/hw) चाहिए। <b>Locked/protected flash</b> (ME-region, RPMB) CH341 आसानी से न erase/write कर पाए—यही सीमा। हमेशा dump से पहले <b>असली-बोर्ड का backup</b> व checksum रखें।</p>' },

    { type: 'table', head: ['हैंड-टूल', 'उपयोग', 'खास'],
      rows: [
        ['Torx T2/T4/T5, Pentalobe P2/P5, Phillips PH0/1/2', 'लैपटॉप/फ़ोन screws', 'cam-out से strip बचाओ; सही size पहले'],
        ['Spudger/pick set + suction cup', 'prying bezel/assembly', 'plastic, non-marring'],
        ['Anti-static tweezers/brushes', 'SMD handling & dust', 'ceramic/coated tip—short नहीं'],
        ['Magnetic mat + label printer', 'screw sorting/audit', 'क्रम + फ़ोटो साथ'],
        ['Hot plate / pre-heater', 'multi-side reflow/soften glue', 'temp ramp; burn risk'],
        ['Vacuum pickup pens', 'tiny components/SMD', '0201/0402 handle बिना damage'],
        ['Battery spot-welder', 'nickel tab cell rebuild', 'fire/short; PPE व training'],
        ['USB-C breakout test cable', 'CC/D+/D+/SBU lines', 'negotiation/short debug'],
        ['ESD-safe brushes + IPA', 'corrosion cleaning', 'capped IPA, ventilated'],
        ['Thermal camera kit', 'short/component locate', 'emissivity adjust; supplements IPA']
      ]},

    { type: 'table', head: ['Consumable', '20-सीट लैब अनुमानित मात्रा', 'क्यों'],
      rows: [
        ['IPA 99.9%', '4–6 L + spray/pump bottles', 'सफ़ाई/flux residue wash'],
        ['ESD-safe brushes/lint-free wipes', 'हर bench 1–2 + bulk', 'dust/flux'],
        ['Kapton tape', '5–10 rolls', 'masking during hot-air'],
        ['Flux (no-clean/RMA) + solder (63/37 & SAC)', 'हर station 1–2', 'iron & hot-air rework'],
        ['Thermal paste + pads (0.5/1.0/1.5 mm)', 'per-bench kit', 'repaste/pad match'],
        ['Screw kits (mm/Torx/Phillips) + M.2 screws', '2–3 sets', 'mixed fasteners'],
        ['CMOS coin cells (CR2032/1220)', 'bulk 50–100', 'dead-RTC fixes'],
        ['Fan kits + replacement fans', 'several sizes', 'bearing-failure stock'],
        ['Anti-static bags / conductive foam', 'bulk', 'transport/storage'],
        ['Nitrile gloves + labels', 'per-bench', 'contamination/ID']
      ]},

    { type: 'kv', title: 'कैलिब्रेशन व यंत्र-रखरखाव अनुसूची', items: [
      { label: 'मल्टीमीटर', value: 'वार्षिक/traceable', desc: 'reference source से DCV/Ω/continuity जाँच; battery व fuse स्थिति' },
      { label: 'ऑसिलोस्कोप + probe', value: 'प्रति-सेमिन्नर compensation', desc: 'square-wave compensation व vertical/horizontal accuracy self-cal' },
      { label: 'Soldering/hot-air station', value: 'प्रति-माह thermocouple check', desc: 'tip-air temp IR से; burnt element/tip बदलें' },
      { label: 'Bench PSU', value: 'प्रति-तिमाही set-value vs meter', desc: 'OCP/limit test; OV पर output बंद होता—जाँच' },
      { label: 'ESD mat/strap', value: 'साप्ताहिक strap tester', desc: '1 MΩ व continuity; mat resistance check' },
      { label: 'Socket tester / ground', value: 'वार्षिक + नए outlet पर', desc: 'open ground/reverse पोलरिटी (ध्रुवता); bond जाँच' },
      { label: 'Inventory/बीमा', value: 'त्रैमासिक physical audit', desc: 'हर यंत्र serial+cal-date रिकॉर्ड; खोया/ख़राब हटाना' }
    ]},

    { type: 'html', html: '<h3 class="blk"><span class="blk-n">7.8</span> छात्र-किट — “₹X से कम में क्या रखें” (अनुमानित)</h3>' +
      '<p>हर छात्र के पास own kit = अधिक practice। नीचे categories; <b>पैसे अनुमानित हैं</b> व brand/range से बदलते हैं—कभी ठोस वादा नहीं।</p>' },

    { type: 'table', head: ['Category', 'Minimum (beginner)', 'Upgrade (advanced)', 'कीमत-बैंड (अनुमानित)'],
      rows: [
        ['Multimeter', 'True-RMS auto-range DMM', 'CAT III/IV, current clamp', '₹—सस्ते से मध्यम'],
        ['Soldering', 'Temp-controlled iron + tips', 'Iron + hot-air 2-in-1 + preheat', '₹—मध्यम'],
        ['Microscope', '3–5× loupe', 'Stereoscope trinocular', '₹—मध्यम से ऊँचा'],
        ['ESD', 'Mat + 1 strap', 'Ground tester + ionizer', '₹—सस्ता'],
        ['Power', 'USB PD tester', 'Current-limited bench PSU', '₹—मध्यम'],
        ['Scope', '2-ch entry DSO (≤50 MHz)', '≥100 MHz MSO', '₹—ऊँचा'],
        ['Programmer', 'CH341A + SOP8 clip', '8 MB fix + eMMC tool', '₹—सस्ता (सावधानी ज़रूरी)'],
        ['Hand tools', 'Screwdriver set + spudgers', 'Torx/pentalobe/tweezer full kit', '₹—सस्ता']
      ]},

    { type: 'acc', title: 'FAQ — यंत्र व बेंच', items: [
      {q: 'DMM में 10 A fuse क्यों उड़ा?', a: 'धारा मापने के लिए series में जोड़ने के बजाय गलती से वोल्टेज-जैक पर या parallel जोड़ दिया; या mA range में बड़ा करंट। सही jack (A vs mA/µA), series, limit याद रखें।' },
      {q: 'Powered board पर resistance/continuity क्यों नहीं?', a: 'parallel paths पाठ गलत बनाते हैं और live rail पर Ω-mode से meter/board damage। power off + caps discharge, फिर continuity/diode mode।' },
      {q: 'Diode-mode पर 0.000 मिले—मतलब?', a: 'शॉर्ट/leaky junction या shorted cap/rail; board-लेवल fault यहीं से localize होता (current injection से आगे)।' },
      {q: 'Non-RMS DMM SMPS में गलत क्यों?', a: 'non-RMS pure-sine calibrated; PWM/ripple जैसा non-sine 10–40% गलत; true-RMS heating-equivalent देता। ripple shape के लिए scope।' },
      {q: '600 V CAT III मतलब?', a: 'building wiring/outlets (fixed feeds) तक meter safe; lower CAT पर mains transient meter/युज़र risk। CAT IV = service entrance। unsuitable meter से mains न मापें।' },
      {q: 'Probe 10× क्यों व compensation?', a: '10× कम loading/अधिक BW; square-wave पर flat corners बनाना = compensation; बुरा = waveform/measure गलत।' },
      {q: 'Primary SMPS node साधारण probe से माप जायज़?', a: 'नहीं—probe ground mains-earth से tied; neutral/live छूआ तो short/fire। isolation transformer या HV differential probe।' },
      {q: 'ESR meter in-circuit झूठ?', a: 'parallel components path देते; इसलिए एक पैर lift/desolder कर नापो—वरना OK दिखता मरा cap।' },
      {q: 'POST card कोड सीधे दोष बताता?', a: 'stage बताता; AMI 00/A2/D3/D6 आदि पर vendor UEFI codes भिन्न—service manual reference; onboard LEDs पूरक।' },
      {q: 'CH341A बड़ी flash पर fail?', a: '24-bit address limit; >8/16 MB पर “8 MB fix” (patched sw/hw) चाहिए; locked/secure regions (RPMB/ME) आसानी से नहीं erase/write।' },
      {q: 'Hot-air temp/flow कहाँ से?', a: 'package व board से—0201/0603 कम-temp/medium flow, QFP ~350–370 higher, BGA preheat साथ; nozzle+Kapton+inspection।' },
      {q: 'Liquid metal/गर्म joints पर solder?', a: 'conductive contamination व thermal-mass issues; ground-plane joint high-watt/bigger tip, pad-lift से बचने के लिए preheat/hoof-tip।' }
    ]},

    { type: 'callout', kind: 'exam', title: 'परीक्षा — यंत्र/माप', html: '<ul><li><b>V पैरेलल, A सीरीज़</b>—fuse blow यही classic ग़लती।</li><li><b>Diode-mode: Si 0.4–0.7 / Schottky ~0.2 / OL open / 0.000 short</b>—rail short खोज इसी से।</li><li><b>True-RMS</b> non-sine पर सही; <b>ripple scope</b> का काम, DMM नहीं।</li><li><b>600 V CAT III</b> fixed wiring सुरक्षित; unsuitable meter से mains निषेध।</li><li><b>Rise time tr ≈ 0.35/BW</b>; BW बढ़े तो edge तेज़।</li><li><b>Probe 10×</b> = कम loading; compensation square-wave पर flat।</li><li><b>ESR in-circuit lies</b>—desolder/lift कर नापो।</li><li><b>POST card</b> 2-digit stage; <b>00/A2/D3/D6</b> typical AMI (vendor differ)।</li><li><b>CH341A</b> 24/25 SPI; <b>3.3 V pin-2 hazard</b> व >8 MB “8 MB fix”।</li><li>Lead-free working ~<b>350 °C</b>, reflow peak ~<b>235–250 °C</b>, liquidus ~217 °C; <b>preheat</b> warp रोके।</li><li><b>Flux RA=corrosive wash; RMA/no-clean tradeoff</b>—IPC J-STD wash when reliability demands।</li></ul>' },

    { type: 'labs', items: [
      { n: 60, title: 'ATX रेल माप (true-RMS + load)',
        aim: '24-pin हर रेल रेटेड लोड पर ATX tolerance से तुलना।',
        tools: ['SMPS + 24-pin', 'True-RMS DMM', 'PSU load tester', 'clip/jumper'],
        steps: ['PS_ON# को COM से jump कर चालू', '3.3/5/12/5VSB माप', 'load देकर दोबारा', '±5%/-7% से तुलना', 'PWR_OK 3–6 V जाँच'],
        result: 'तालिका: रेल|मापी|अंदर/बाहर; PSU-निष्कर्ष लिखें।' },
      { n: 61, title: 'रिपोर्टेड battery health (Windows)',
        aim: 'battery report से Design vs Full-charge व cycles पढ़ना।',
        tools: ['लैपटॉप', 'CMD', 'रजिस्टर'],
        steps: ['powercfg /batteryreport खोलें', 'DESIGN व FULL CHARGE capacity निकालें', 'wear % = 100-(F/D*100)', 'cycle count लिखें'],
        result: 'wear% + cycles से battery-replace निर्णय justify करें।' },
      { n: 62, title: 'Board शॉट — diode mode',
        aim: 'unpowered board पर diode-mode से shorted rail पहचानना।',
        tools: ['DMM', 'ESD mat', 'reference rail-map'],
        steps: ['power off+discharge', 'हर rail->ground diode-mode', '0.000 वाली rail mark', 'दोनों ओल=open vs short भेद'],
        result: 'कौन-सी rail short—कम-से-कम एक rail-map annotated देना।' },
      { n: 63, title: 'Current injection से शॉट लोकेशन',
        aim: 'short rail पर limit-de कर गर्म component पकड़ना।',
        tools: ['Bench PSU (limit)', 'thermal camera/IPA', 'multimeter'],
        steps: ['rail पर 0.5–1 V, limit 1–3 A', 'thermal/IPA से hot MLCC/IC', ' culprit हटा/बदलो', 'diode baseline फिर मेल'],
        result: 'component name + removal-सिद्ध repair note।' },
      { n: 64, title: 'Capacitor ESR (in vs out circuit)',
        aim: 'in-circuit ESR का भ्रम समझना।',
        tools: ['ESR meter', 'IPA+iron', 'bulged caps'],
        steps: ['in-circuit ESR नोट', 'एक पैर lift/desolder', 'out-of-circuit ESR', 'दोनों तुलना'],
        result: 'क्यों in-circuit झूठ—parallel path स्पष्ट करें।' },
      { n: 65, title: '5V रेल पर scope ripple',
        aim: 'DMM vs scope से ripple माप अंतर।',
        tools: ['Scope', 'probe', 'SMPS', 'DMM'],
        steps: ['AC coupling + proper V/div', '5V rail ripple pk-pk', 'DMM AC vs true-RMS vs scope', 'switching freq note'],
        result: 'ripple amplitude+freq; “why scope, not DMM” लाइन।' },
      { n: 66, title: 'PS/2 keyboard decode (scope)',
        aim: 'clock+data पर protocol bits पहचानना।',
        tools: ['2-ch scope', 'PS/2 keyboard', 'pullups'],
        steps: ['clock+data probe', 'keystroke पर edges', 'cursor से bit measure', 'decode/ASCII मेल'],
        result: 'एक keypress का decoded value और + चिह्न।' },
      { n: 67, title: 'Crystal—freq counter / scope-loading',
        aim: 'oscillator check में probe-loading सीमा समझना।',
        tools: ['Freq counter/spectrum', 'scope x10'],
        steps: ['counter से freq (best)', 'scope से देखें—load से stop/detune?', 'minimal-loading/short-ground'],
        result: 'freq+probe-loading effect लिखें।' },
      { n: 68, title: 'Through-hole व SMD solder',
        aim: 'THT resistor व 0603 resistor solder—tip/heat control।',
        tools: ['Iron 350 °C', '63/37', 'flux', 'R + 0603 pads'],
        steps: ['flux+tin joint', 'SMD: drag/one-pad then reflow', 'wick/sucker se desolder', 'pad-lift avoid'],
        result: 'दोनों joint photos/notes, defects पहचान।' },
      { n: 69, title: 'Hot-air QFP rework',
        aim: 'SOIC/QFP IC को hot-air से उठाना/बैठाना।',
        tools: ['Hot-air + nozzle', 'preheat', 'Kapton', 'flux'],
        steps: ['border Kapton', 'preheat+350–370 high air', 'even lift', 'fresh flux+place+reball/verify'],
        result: 'joint/pitch OK; lifted pads नोट।' },
      { n: 70, title: 'BGA stencil reball (demo)',
        aim: 'stencil+balls से BGA reball concept/quality।',
        tools: ['Stencil', 'paste/balls', 'hot-air+preheat', 'scope'],
        steps: ['stencil align', 'balls+flux+heat profile', 'cool+inspect coplanarity', 'place on board'],
        result: 'reball image/observations; X-ray mention।' },
      { n: 71, title: 'BIOS dump (CH341A, spare board)',
        aim: 'spare-board SPI chip का safe read/backup।',
        tools: ['CH341A+SOP8 clip', '3.3V care', 'dump sw'],
        steps: ['correct VCC/pin2', 'read+save dump+checksum', '2 dumps match (verify)', 'no blind write'],
        result: 'dump files + verification report; 8MB-fix mention।' },
      { n: 72, title: 'LAN cable tester + crimp',
        aim: '8-LED wire-map + RJ45 crimp (wiring topic cross-ref)।',
        tools: ['Cable tester', 'crimp', 'Cat6+RJ45', 'stripper'],
        steps: ['T568B cut+strip+order', 'insert+crimp', 'tester wire-map', 'far-end PoE if kit'],
        result: 'map pass/fail + note।' },
      { n: 73, title: 'Multimeter calibration-check',
        aim: 'known reference से DMM की drift।',
        tools: ['calibration/known resistor+source', 'DMM'],
        steps: ['known R+V नाप', '%diff vs spec', 'fuse+battery जाँच', 'cal-date sticker'],
        result: 'in/out-of-cal verdict।' },
      { n: 74, title: 'ESD strap tester',
        aim: 'wrist strap 1 MΩ व continuity verify।',
        tools: ['Strap tester/mat', 'multimeter'],
        steps: ['strap tester green/hi/lo', 'DMM से ~1 MΩ जाँच', 'mat resistance', 'daily log'],
        result: 'pass/fail + daily-check log।' },
      { n: 75, title: 'UPS battery runtime test',
        aim: 'known load पर UPS runtime व internal-resistance trend।',
        tools: ['UPS', 'known load (lamp)', 'clamp/power meter'],
        steps: ['battery mode start', 'time to shutdown', 'pack voltage curve', 'compare spec runtime'],
        result: 'measured vs rated runtime; battery-health hint।' },
      { n: 76, title: 'DC power-supply boot signature',
        aim: 'laptop bench-supply पर boot-current step पढ़ना।',
        tools: ['Bench PSU (5V/19V)', 'laptop board', 'ammeter'],
        steps: ['current-limit set', 'power on: 0→?→?→run', 'short draw = rail fault', 'no draw = no enable/EC'],
        result: 'current trace + interpretation।' },
      { n: 77, title: 'True-RMS बनाम non-RMS तुलना',
        aim: 'SMPS PWM पर दोनों meters का अंतर दिखाना।',
        tools: ['Non-RMS + True-RMS DMM', 'scope (ground truth)'],
        steps: ['PWM/ripple signal', 'दोनों readings', 'scope RMS से तुलना', 'कौन नज़दीक—क्यों'],
        result: 'error% table + true-RMS importance।' }
    ]}
  ]
}
]);
