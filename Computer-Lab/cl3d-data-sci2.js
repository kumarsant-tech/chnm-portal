
/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-sci2.js   (कंप्यूटर विज्ञान — भाग 2)
   विषय : sci-logic · sci-data · sci-dcom
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   32. लॉजिक गेट व बूलियन बीजगणित
   =================================================================== */
{
  id: 'sci-logic', icon: '🧮', group: 'कंप्यूटर विज्ञान',
  title: 'लॉजिक गेट व बूलियन बीजगणित (Logic Gates)',
  sub: 'सभी 7 गेट, truth table, ट्रान्ज़िस्टर स्तर, सार्वभौमिक गेट, laws, SOP/POS, K-map, adder, mux, flip-flop, 74-series IC और गेटों से CPU',
  kicker: 'Computer Science 3 · Logic Gates & Boolean Algebra',
  hero: 'कंप्यूटर अंदर से केवल <b>स्विच</b> है — कोई जादू नहीं। यह अध्याय वही स्विच (logic gate) से शुरू करके <b>Boolean algebra, Karnaugh map (K-map), adder, multiplexer, flip-flop</b> और आख़िर में <b>gate से बना CPU</b> तक ले जाता है। इसे पढ़ने के बाद आप कोई भी Boolean expression कम कर सकेंगे, किसी भी truth table से गेट-सर्किट बना सकेंगे, और 74-series IC का डेटाशीट देखकर समझ सकेंगे कि उसमें कौन-सा गेट कितनी बार है।',
  tags: ['7 गेट + truth table', 'CMOS ट्रान्ज़िस्टर स्तर', 'NAND/NOR universal', 'Boolean laws व De Morgan', 'SOP/POS + K-map', 'Half/Full adder', 'MUX/ Decoder/ Flip-flop', '74 सीरीज़ IC'],
  blocks: [

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">32.1</span> लॉजिक गेट क्या है — स्विच से "तर्क" तक</h3>
      <p><b>लॉजिक गेट (Logic Gate)</b> वह इलेक्ट्रॉनिक सर्किट है जो एक या अधिक <b>बाइनरी इनपुट (binary inputs)</b> लेता है और एक नियम से एक <b>बाइनरी आउटपुट (binary output)</b> देता है। नियम तय करता है <b>बूलियन फ़ंक्शन (Boolean function)</b> — गणित की वह शाखा जिसमें मान केवल <code>0</code> या <code>1</code> हो सकते हैं (George Boole, 1854)।</p>
      <p>भीतर यह केवल <b>ट्रान्ज़िस्टर (transistor)</b> के स्विच हैं — यानी गेट "सोचता" नहीं, बस <b>वोल्टेज की सीमा</b> देखकर 0 या 1 घोषित करता है। गेट दो श्रेणियों में काम करता है:</p>
      <ul>
        <li><b>कॉम्बिनेशनल लॉजिक (combinational logic)</b> — आउटपुट सिर्फ़ मौजूदा इनपुट पर निर्भर (AND, OR, NOT, adder, MUX, decoder)। इसमें <b>मेमोरी नहीं</b> होती।</li>
        <li><b>सीक्वेंशियल लॉजिक (sequential logic)</b> — आउटपुट इनपुट + <b>पिछली अवस्था (previous state)</b> दोनों पर; घड़ी (clock) से चलता है (latch, flip-flop, register, counter)। यही मेमोरी बनती है।</li>
      </ul>
      <p><b>मौलिक शब्दावली (basic terms):</b></p>
      <ul>
        <li><b>Bit (बाइनरी डिजिट)</b> — 0 या 1; गेट की सबसे छोटी इकाई।</li>
        <li><b>Literal (लिटरल)</b> — expression में कोई एक variable या उसका complement (A, A′).</li>
        <li><b>Term</b> — literals का product (AND) = <b>product term / minterm</b>; literals का sum (OR) = <b>sum term / maxterm</b>.</li>
        <li><b>Complement (पूरक)</b> — A′ यानी "NOT A"; expression के ऊपर bar (Ā) भी लिखा जाता है।</li>
        <li><b>Fan-in</b> — एक गेट में कितने इनपुट (2-input, 3-input, 8-input)। ज़्यादा fan-in = ज़्यादा ट्रान्ज़िस्टर और धीमा गेट।</li>
        <li><b>Fan-out</b> — एक आउटपुट कितने इनपुट चला सकता है — यही तय करता है कि एक गेट कितने गेटों को drive करे।</li>
        <li><b>Active-high / Active-low</b> — "1 से काम शुरू" = active-high; "0 से काम शुरू" = active-low (नाम के आगे बार या / या #).</li>
        <li><b>Logic family</b> — उसी तकनीक के गेटों का परिवार (TTL, CMOS), जो एक-दूसरे से जुड़ सकते हैं।</li>
      </ul>` },

    { type: 'table', head: ['अवधारणा', '0 (LOW) क्या मतलब', '1 (HIGH) क्या मतलब', 'ध्यान रखने वाली बात'],
      rows: [
        ['तार्किक मान', 'False / Low / Clear / OFF', 'True / High / Set / ON', 'बूलियन बीजगणित में केवल यही दो मान'],
        ['नाम की परंपरा', 'Positive logic में 0 = False', 'Positive logic में 1 = True', 'Negative logic में यह उल्टा होता है — यही "logic inversion" की जड़'],
        ['आम वोल्टेज (5 V TTL/74HC)', '0 V से लगभग 0.8 V तक', '2 V से 5 V तक', 'बीच का क्षेत्र (0.8–2 V) "forbidden/undefined" — यहीं metastability व गड़बड़ पैदा होती है'],
        ['CMOS 4000 सीरीज़ (15 V पर)', '0 V से ~1.5 V', '~13.5 V से 15 V', 'CMOS का threshold आपूर्ति वोल्टेज के लगभग आधा — VDD बदलो तो noise margin भी'],
        ['त्रुटि सहनशीलता (noise margin)', 'VOL से VIL तक का अंतर', 'VOH से VIH तक का अंतर', 'यही अंतर "शोर" सहता है; बड़ा noise margin = भरोसेमंद सर्किट'],
        ['फ़्लोटिंग इनपुट (hanging pin)', 'TTL: अछूता इनपुट प्रायः HIGH जैसा व्यवहार करता है', 'CMOS: अछूता इनपुट अनिश्चित व ख़तरनाक', 'CMOS का खुला इनपुट कभी न छोड़ें — pull-up/pull-down (10 kΩ आम) लगाएँ'],
        ['हाई-इम्पीडंस (High-Z / tri-state)', 'ना 0 ना 1 — सर्किट जुड़ा ही नहीं', '—', 'बस (bus) साझा करने का आधार; enable = 0 पर आउटपुट High-Z'],
        ['भौतिक रूप (physical)', 'नीचे वाला ट्रान्ज़िस्टर चालू (pull-down)', 'ऊपर वाला ट्रान्ज़िस्टर चालू (pull-up)', 'एक ही समय दोनों ON = shoot-through current (केवल switching के क्षण भर)'],
        ['स्टोरेज में', 'चुंबकीय क्षेत्र/चार्ज "0"', '"1"', 'गेट स्तर पर 0/1 तय होता है; मेमोरी सेल (memory cell) flip-flop या कैपेसिटर से बनता है']
      ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में पक्का — गेट की पहचान', html: `<p><b>7 fundamental gates:</b> AND, OR, NOT, NAND, NOR, XOR, XNOR।<br>
      <b>2 = universal gates:</b> NAND और NOR — इन्हीं अकेले से बाक़ी सब बनेंगे।<br>
      <b>2 = exclusive gates:</b> XOR और XNOR (इन्हें "odd/even detector" भी कहते हैं)।<br>
      <b>1 = inverter:</b> NOT — सबसे कम ट्रान्ज़िस्टर (CMOS में 2) और सबसे तेज़।<br>
      NAND/NOR/XOR/XNOR को "derived/combination gates" भी कहते हैं क्योंकि ये AND/OR/NOT के संयोग हैं।</p>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">32.2</span> सभी 7 गेट एक नज़र में + संयुक्त truth table</h3>
      <p><b>Truth table (सत्य-सारणी)</b> वह तालिका है जो हर संभव इनपुट संयोजन के लिए आउटपुट लिखती है। n इनपुट के लिए पंक्तियाँ = <b>2ⁿ</b> (1 इनपुट → 2, 2 इनपुट → 4, 3 इनपुट → 8, 4 इनपुट → 16)। यही गिनती परीक्षा में सबसे ज़्यादा पूछी जाती है।</p>
      <p><b>प्रतीक शब्दों में (symbols in words)</b> — MIL/IEC दो शैली हैं; यहाँ आम (D-shape/महीफ़) शैली वर्णन की है:</p>
      <ul>
        <li><b>AND</b> — "डी आकार" (D-shape): सीधा बाएँ किनारा, गोल दाहिना उभार; जैसे दो सिरों वाला दरवाज़ा जो तभी खुलेगा जब दोनों कुंडियाँ खुली हों।</li>
        <li><b>OR</b> — "चाँद/कर्व्ड" आकार: अंदर की ओर मुड़ा बायाँ किनारा और तीखा दाहिना सिरा; कई रास्तों का जंक्शन — कोई भी एक रास्ता खुला तो आउटपुट 1।</li>
        <li><b>NOT</b> — त्रिभुज (triangle/buffer) + उसके नोक पर एक छोटा गोल <b>बबल (bubble)</b> = उलटा हुआ buffer।</li>
        <li><b>NAND</b> = AND का डी-आकार + आउटपुट पर बबल। <b>NOR</b> = OR के तीखे आकार + आउटपुट पर बबल।</li>
        <li><b>XOR</b> = OR जैसा आकार, पर बाएँ किनारे के साथ एक <b>अतिरिक्त मुड़ी रेखा</b> (double curve)।</li>
        <li><b>XNOR</b> = XOR का आकार + आउटपुट पर बबल (कई डेटाशीट में बबल के साथ एक और रेखा भी)।</li>
        <li><b>Buffer</b> — बिना बबल का त्रिभुज: आउटपुट = इनपुट, पर करंट/ड्राइव शक्ति बढ़ाता है (fan-out बढ़ाने के लिए)।</li>
        <li><b>Schmitt-trigger</b> — त्रिभुज के अंदर H जैसा चिह्न: धीमे बदलते इनपुट को साफ़ 0/1 में कनवर्ट करता है (hysteresis)।</li>
      </ul>` },

    { type: 'table', head: ['A', 'B', 'AND (A·B)', 'OR (A+B)', 'NAND (A·B)′', 'NOR (A+B)′', 'XOR (A⊕B)', 'XNOR (A⊙B)'],
      rows: [
        ['0', '0', '0', '0', '1', '1', '0', '1'],
        ['0', '1', '0', '1', '1', '0', '1', '0'],
        ['1', '0', '0', '1', '1', '0', '1', '0'],
        ['1', '1', '1', '1', '0', '0', '0', '1'],
        ['NOT गेट (एक इनपुट):', 'A = 0 → A′ = 1', 'A = 1 → A′ = 0', 'Buffer: A → A', 'XOR = "असमानता (inequality) detector"', 'XNOR = "समानता (equality) detector"', 'NAND = OR-with-inverted-inputs', 'NOR = AND-with-inverted-inputs']
      ] },

    { type: 'table', head: ['गेट', 'पूरा नाम / English', 'Boolean व्यंजक', 'आउटपुट का नियम (एक लाइन में)', 'आम IC (74 / 4000)', 'कहाँ सबसे ज़्यादा इस्तेमाल'],
      rows: [
        ['AND', 'Logical conjunction', 'Y = A · B', 'सभी इनपुट 1 हों तभी 1 — "सब शर्तें पूरी" गेट', '7408 / 74LS08 / 74HC08 · CD4081', 'Enable/gating, address decode, carry generate'],
        ['OR', 'Logical disjunction', 'Y = A + B', 'कोई भी एक इनपुट 1 हो तो 1 — "कम-से-कम एक" गेट', '7432 / 74HC32 · CD4071 (CD4072 = 4-input)', 'Interrupt जोड़ना, flag combine, wired-OR संकेत'],
        ['NOT', 'Inverter', 'Y = A′', 'हमेशा उलटा', '7404 (hex inverter) · CD4049/CD4069', 'Inversion, buffering, clock नकल, debouncing'],
        ['NAND', 'NOT-AND', 'Y = (A·B)′', 'सभी 1 हों तभी 0 — बाक़ी सब जगह 1', '7400 / 74LS00 / 74HC00 · CD4011 · 7410 (3-in), 7420 (4-in)', 'Universal gate, latch, memory cell, सबसे कम ट्रान्ज़िस्टर में तेज़ गेट'],
        ['NOR', 'NOT-OR', 'Y = (A+B)′', 'कोई 1 हो तो 0; सब 0 हों तभी 1', '7402 / 74HC02 · CD4001 · 7427 (3-in)', 'Universal gate, cross-coupled SR latch, zero-detect'],
        ['XOR', 'Exclusive-OR', 'Y = A ⊕ B = A′B + AB′', 'इनपुट अलग-अलग हों तो 1 — जोड़ी सम (even) 1s हो तो 0', '7486 / 74HC86 · CD4070/CD4071', 'Adder का sum, parity generator/checker, crypto, comparator'],
        ['XNOR', 'Exclusive-NOR', 'Y = (A ⊕ B)′ = AB + A′B′', 'इनपुट बराबर हों तो 1', '74266 · CD4077', 'Equality comparator, even-parity detect'],
        ['Buffer', 'Driver / follower', 'Y = A', 'जैसा इनपुट वैसा आउटपुट, पर ज़्यादा धारा सहने लायक', '7407/7406 (open-collector), 74244/74245 (tri-state)', 'Bus drive, line length, fan-out बढ़ाना'],
        ['Tri-state buffer', 'Three-state gate', 'Y = A या High-Z (EN पर)', 'Enable = 0 पर आउटपुट "कटा" हुआ', '74125/74126 · 74LS245 octal bidirectional', 'साझा डेटा/एड्रेस बस — CPU का रोज़ का काम']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">32.3</span> ट्रान्ज़िस्टर के स्तर पर — गेट अस्तित्व में कैसे आता है</h3>
      <p>आज के सभी गेट <b>CMOS (Complementary Metal-Oxide-Semiconductor)</b> तकनीक में बनते हैं। "Complementary" का मतलब दो तरह के MOSFET (Metal-Oxide-Semiconductor Field-Effect Transistor) साथ-साथ:</p>
      <ul>
        <li><b>nMOS</b> — जब गेट पर 1 (उच्च वोल्टेज) तो चालू; यह आउटपुट को <b>0 V (GND) की ओर खींचता</b> है, इसलिए इसे <b>pull-down network (PDN)</b> कहते हैं।</li>
        <li><b>pMOS</b> — जब गेट पर 0 तो चालू; यह आउटपुट को <b>VDD (supply) की ओर खींचता</b> है = <b>pull-up network (PUN)</b>।</li>
        <li>डिज़ाइन का एकमात्र सुनहरा नियम: <b>किसी भी इनपुट संयोजन पर PUN और PDN में से ठीक एक ही चालू</b> रहे — दोनों एक साथ चालू = शॉर्ट-सर्किट धारा (shoot-through) + गर्मी।</li>
      </ul>
      <p><b>CMOS INVERTER (NOT गेट) — सबसे सरल गेट, 2 ट्रान्ज़िस्टर:</b> ऊपर pMOS (VDD ↔ आउटपुट), नीचे nMOS (आउटपुट ↔ GND), दोनों के गेट एक ही इनपुट A पर जुड़े।</p>
      <ul>
        <li>A = 0 → pMOS चालू, nMOS बंद → आउटपुट VDD से जुड़ा → <b>1</b></li>
        <li>A = 1 → nMOS चालू, pMOS बंद → आउटपुट GND से जुड़ा → <b>0</b></li>
        <li>बदलाव के क्षण भर दोनों आधे चालू रहते हैं → उसी क्षण <b>dynamic power</b> ख़र्च होता है; स्थिति (state) बदलने पर ही ख़र्च, इसलिए CMOS "static" में लगभग शून्य धारा खाना कहलाता है (आधुनिक नैनोमीटर चिपों में leakage अब नगण्य नहीं)।</li>
      </ul>
      <p><b>NAND (4 ट्रान्ज़िस्टर):</b> दो nMOS <b>श्रेणीक्रम (series)</b> में — दोनों A और B 1 हों तभी आउटपुट GND तक पहुँचे (0); दो pMOS <b>समांतर (parallel)</b> में — कोई भी 0 हो तो आउटपुट VDD तक। यानी आउटपुट = (A·B)′।</p>
      <p><b>NOR (4 ट्रान्ज़िस्टर):</b> उल्टा — दो pMOS श्रेणीक्रम में, दो nMOS समांतर में; कोई भी 1 हो तो n-MOS वाला रास्ता GND देगा = 0; सब 0 हों तभी 1।</p>
      <p><b>याद रखने का सूत्र:</b> nMOS नेटवर्क में <b>series = AND</b>, <b>parallel = OR</b>; pMOS नेटवर्क उसका <b>द्वैत (dual)</b> — series↔parallel आपस में बदल जाते हैं। इसी नियम से AOI (AND-OR-INVERT) जैसे "compound gates" बनते हैं, जिनमें AND+OR+NOT एक साथ, अलग-अलग गेटों से कम ट्रान्ज़िस्टर और कम देरी पर मिलता है।</p>
      <p><b>XOR ट्रान्ज़िस्टर स्तर पर:</b> सरल series/parallel से नहीं बनता; इसे <b>transmission gate (समांतर nMOS+pMOS जोड़ी)</b> + inverters से बनाया जाता है, या sum-of-products (A′B + AB′) को NAND/NOR cascade से। इसीलिए XOR सबसे "महँगा" छोटा गेट है — और ठीक यही कारण है कि adder (जिसमें XOR है) ALU का सबसे बड़ा हिस्सा है।</p>` },

    { type: 'table', head: ['गेट', 'सामान्य static-COS ट्रान्ज़िस्टर संख्या', 'क्यों इतने', 'नोट (गति/लागत)'],
      rows: [
        ['NOT (inverter)', '2', '1 pMOS pull-up + 1 nMOS pull-down', 'सबसे तेज़ और सबसे सस्ता; हर जगह buffer के रूप में'],
        ['2-input NAND', '4', '2 series nMOS + 2 parallel pMOS', 'AND से तेज़ (electrons वाली nMOS series नीचे); इसीलिए library में "default"'],
        ['2-input NOR', '4', '2 parallel nMOS + 2 series pMOS', 'NAND से धीमा (series pMOS कमज़ोर hole mover)'],
        ['2-input AND', '6', 'NAND (4) + inverter (2)', 'इसलिए अलग AND गेट कम मिलता है — NAND+inv से बनाया जाता है'],
        ['2-input OR', '6', 'NOR (4) + inverter (2)', 'उसी कारण'],
        ['XOR (2-input)', '6–12 (rationalized)', '2–4 transmission gates + inverters, या AOI structure', 'इसलिए XOR-heavy adder महँगा; carry-look-ahead व select-adder इसी को घटाने के तरीक़े'],
        ['XNOR', 'XOR जैसी + 1 inverter', 'XOR का उलटा', 'कई library cells में XOR/XNOR एक ही cell के दो आउटपुट'],
        ['3-input NAND / NOR', '6', '3 series + 3 parallel', 'हर अतिरिक्त इनपुट = +2 ट्रान्ज़िस्टर और अधिक loading'],
        ['D flip-flop (master-slave)', 'लगभग 20–30', ' latch के दो स्टेज + transmission gates + clock inverters', 'यही एक "bit" मेमोरी; 6T SRAM cell में 6 ट्रान्ज़िस्टर'],
        ['Full adder (gate-level)', '5 गेटों में ≈ 20–30; optimized cell कम', '2 XOR + 2 AND + 1 OR', 'ALU का मुख्य ईंट; latency में सबसे बड़ा योगदान']
      ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — गिनती के सवाल', html: `<ul>
      <li>एक 2-input NAND = <b>4 ट्रान्ज़िस्टर</b>, एक inverter = <b>2 ट्रान्ज़िस्टर</b>।</li>
      <li>n इनपुट वाली truth table में पंक्तियाँ = <b>2ⁿ</b>; n चरों के कुल minterms = <b>2ⁿ</b>; n चरों से बन सकने कुल भिन्न Boolean फ़ंक्शन = <b>2^(2ⁿ)</b> (2 चर → 16, 3 चर → 256)।</li>
      <li>XOR के 1 होने की शर्त = इनपुटों में 1 की संख्या <b>विषम (odd)</b>; XNOR = 1 की संख्या <b>सम (even)</b> (दो इनपुट के विशेष मामले में "बराबरी")।</li>
      <li>CMOS की सबसे बड़ी ख़ूबी: <b>स्थिर अवस्था में लगभग शून्य धारा</b>, कम power; सबसे बड़ा जोखिम: <b>खुला (floating) इनपुट</b> और static electricity (ESD)।</li>
    </ul>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">32.4</span> सार्वभौमिक गेट (Universal Gates) — NAND/NOR से सब कुछ</h3>
      <p><b>Universal gate</b> वह गेट है जिसके <b>अकेले</b> replicate करके AND, OR, NOT — और इस प्रकार कोई भी Boolean फ़र्क़ — बनाया जा सके। ऐसा केवल <b>NAND</b> और <b>NOR</b> है। कारण: NAND/OR अपने-आप "complete set" नहीं हैं — AND+OR अकेले inversion नहीं दे सकते; NAND और NOR inversion भी देते हैं, इसलिए पूरा काम कर लेते हैं।</p>
      <p>व्यावहारिक कारण भी: चिप बनाने में <b>एक ही तरह के cell</b> बार-बार दोहराना सस्ता और भरोसेमंद है, और NAND हर family का सबसे तेज़/छोटा compound gate है — इसीलिए SRAM, flash, standard-cell libraries और ASIC डिज़ाइन में NAND का प्रभुत्व है। मोबाइल/PC चिपों का एक बड़ा हिस्सा वास्तव में NAND/NOR/inverter ही है।</p>` },

    { type: 'steps', items: [
      { n: 1, title: 'NOT से शुरू करें (1 NAND)', text: 'NAND के दोनों इनपुट एक साथ जोड़ दें: <code>Y = (A·A)′ = A′</code>। यानी एक NAND = एक inverter। NOR के साथ भी वही नियम: <code>(A+A)′ = A′</code>।', tips: 'डेटाशीट पर अकेला इनपुट खुला न छोड़ें — दूसरा इनपुट उसी से join करें।' },
      { n: 2, title: 'AND बनाना (2 NAND)', text: 'पहला NAND = (A·B)′, दूसरा NAND उस आउटपुट को स्वयं से AND करे → ((A·B)′·(A·B)′)′ = A·B। यानी <b>NAND + inverter(NAND)</b>।' },
      { n: 3, title: 'OR बनाना (3 NAND) — De Morgan का सीधा उपयोग', text: 'पहले A′ और B′ बनाएँ (1-1 NAND), फिर उन्हें एक NAND पर दें: <code>(A′·B′)′ = A + B</code>। यही "bubbled-input OR" की पहचान है — NAND का symbol OR जैसा बनेगा यदि दोनों इनपुट पर bubble हों।' },
      { n: 4, title: 'NOR (4 NAND)', text: 'ऊपर वाला OR (3 NAND) + आउटपुट पर एक और NAND inverter → <code>(A+B)′</code>।' },
      { n: 5, title: 'XOR (4 NAND) — क्लासिक सर्किट', text: '<code>W = NAND(A,B)</code> → <code>X = NAND(A,W)</code> → <code>Y = NAND(B,W)</code> → <code>OUT = NAND(X,Y)</code>। OUT = A⊕B। यह चरण-क्रम रट लें — 4 NAND XOR बहुत पूछा जाता है।', tips: 'XNOR चाहिए तो OUT के बाद 1 और NAND (कुल 5)।' },
      { n: 6, title: 'NOR-only पक्ष', text: 'NOT = 1 NOR, OR = 2 NOR, AND = 3 NOR <code>(A′+B′)′</code> से, NAND = 4 NOR, <b>XNOR = 4 NOR</b>, XOR = 5 NOR। ध्यान दें NAND vs NOR में XOR/XNOR की गिनती उलटी हो जाती है।', warn: 'NOR-based designs में series-pMOS के कारण गति कम और area ज़्यादा — इसीलिए ज़्यादातर लाइब्रेरी NAND-primary हैं।' },
      { n: 7, title: 'किसी भी फ़र्क़ का दो-स्तर रूप', text: 'किसी भी truth table को पहले <b>SOP (sum of products)</b> में लिखें, फिर हर product term को NAND-tree और आख़िरी OR को NAND-inverter से बदलें — नतीजा <b>NAND-NAND (two-level) network</b>। यही ASIC/FPGA synthesis का रोज़ का काम है।' }
    ] },

    { type: 'table', head: ['बनाने वाला गेट', 'NOT', 'AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'],
      rows: [
        ['केवल NAND से (gate संख्या)', '1', '2', '3', '1', '4', '4', '5'],
        ['केवल NOR से (gate संख्या)', '1', '3', '2', '4', '1', '5', '4'],
        ['तर्क (एक लाइन)', 'in/out join', 'NAND + inv', 'inputs invert कर NAND', 'मूल cell', 'AND invert', 'ऊपर वाला 4-NAND cascade', 'XOR + inv'],
        ['नतीजा', 'दोनों universal हैं', 'NAND गिनती में कम/तेज़', 'NOR गिनती में कम/तेज़', '—', '—', 'XOR NAND पर सरल, XNOR NOR पर सरल', '—']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">32.5</span> बबल, inversion और active-low — डेटाशीट पढ़ने की कुंजी</h3>
      <p><b>Bubble (बुलबुला)</b> = प्रतीक के किनारे का छोटा गोल = <b>NOT</b>। इसीलिए NAND = "AND + bubble" और NOR = "OR + bubble"। आगे का पूरा नियम <b>De Morgan</b> से आता है, और इसे "bubble pushing / bubble steering" कहते हैं:</p>
      <ul>
        <li><b>बबल के साथ एक और बबल कट जाता है:</b> दो लगातार inversion = मूल मान (involution, <code>(A′)′ = A</code>)। इसीलिए NAND+inverter = AND, और 74LS04 के दो inverters मिलकर buffer बन जाते हैं (debounce/shape सुधारने)।</li>
        <li><b>Rule 1 — NAND ≡ bubbled-input OR:</b> <code>(A·B)′ = A′ + B′</code>। यानी NAND का आउटपुट-बबल हटाकर दोनों इनपुट पर बबल रखें → OR गेट मिलता है, फ़र्क़ नहीं पड़ता।</li>
        <li><b>Rule 2 — NOR ≡ bubbled-input AND:</b> <code>(A+B)′ = A′ · B′</code>।</li>
        <li><b>Rule 3 — बबल "push" करना:</b> तार के किसी भी बिंदु पर दो बबल एक साथ डालना (A → ′′ → A) कानूनी है, फिर उन्हें गेट की तरफ़ घुमाकर expression बदल सकते हैं — डिज़ाइन वही, symbol ज़्यादा साफ़।</li>
        <li><b>Active-low संकेत:</b> नाम पर बार (<code>CS̄</code>), आगे slash (<code>/CS</code>, <code>#CS</code>), या "n" prefix (<code>CSn</code>)। मतलब — <b>0 देने पर काम</b> (enable/select/clear/preset/reset)। 74138 decoder, 74148 encoder के outputs इसीलिए active-low हैं (TTL output_low अधिक धारा खींच सकता है)।</li>
        <li><b>महत्व:</b> active-low संकेत गलत जोड़ना सबसे आम सर्किट-बोर्ड त्रुटि है — reset 0 पर चाहिए, तो floating pull-up के बिना मशीन रीसेट-लूप में फँस सकती है।</li>
      </ul>
      <p><b>Open-collector / open-drain आउटपुट:</b> गेट केवल नीचे खींचता है, ऊपर खुद नहीं चलाता; बाहरी <b>pull-up resistor</b> VDD तक ले जाता है। दो फ़ायदे — (1) कई आउटपुट एक ही तार पर जोड़कर <b>wired-AND</b> (open-collector) बनता है: कोई भी 0 खींचे, तार 0; यह <b>I²C बस (Serial Data Line/SDA, Serial Clock/SCL)</b> का मूल सिद्धांत है, (2) 5 V लॉजिक 12 V/24 V सर्किट से जोड़ सकते हैं। 7407 (hex buffer, open-collector) / 7405 इसी परिवार में।</p>
      <p><b>Tri-state (three-state) output:</b> 0, 1 और <b>High-Z</b> (आउटपुट तार से हटा हुआ)। कई डिवाइस एक ही बस पर तभी रह सकते हैं जब एक ही drive करे और बाक़ी High-Z हों। Enable (OE′) गलत = <b>bus contention</b> — एक गेट ऊपर, एक नीचे खींच रहा = गर्मी व ड्राइवर क्षति; सर्विस लैब में "chip garam ho gaya" का आम कारण।</p>` },

    { type: 'callout', kind: 'warn', title: 'लैब-चेतावनी — ये 4 ग़लतियाँ चिप जलाती/बेकार बनाती हैं', html: `<ul>
      <li><b>CMOS का खुला इनपुट</b> — अनिश्चित आउटपुट + दोनों MOS आधे चालू रह सकते हैं; हर unused input को GND, VDD (pull-up ~10 kΩ) या किसी इस्तेमाल इनपुट से जोड़ें।</li>
      <li><b>Supply के ऊपर वोल्टेज</b> — 74HC सीरीज़ अधिकतम लगभग 6–7 V सहती है; 4000B सीरीज़ 15 V तक; 12 V TTL पर डालें तो latch-up/क्षति।</li>
      <li><b>Output to output सीधे join</b> (बिना open-collector/tri-state नियम) = contention।</li>
      <li><b>ESD (Electrostatic Discharge)</b> — सर्दियों में 3–4 kV शरीर पर; CMOS pins पर झटका cell तोड़ सकता है। कलाई-पट्टी (anti-static wrist strap), फोम बैग, और "सिर्फ़ DIP switch से छूएँ" आदत रखें।</li>
      <li><b>VDD/GND उल्टा</b> — 14-pin DIP में <b>pin 14 = VCC, pin 7 = GND</b> (74xx) और CD4000 में <b>pin 16 = VDD, pin 8 = VSS</b> — यही नियम रट लें, IC उल्टा लगाने से अक्सर चिप मर जाती है।</li>
    </ul>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">32.6</span> बूलियन बीजगणित के नियम (Laws) — गेट कम करने का गणित</h3>
      <p>सामान्य बीजगणित (ordinary algebra) से बूलियन बीजगणित का सबसे बड़ा फ़र्क़: <b>यहाँ चर केवल 0 या 1 हो सकते हैं</b>, इसलिए + (OR) और · (AND) के अपने नियम हैं, और <b>x + x = x</b> (न कि 2x)। ये नियम ही <b>simplification (सरलीकरण)</b> के औज़ार हैं — कम गेट = कम चिप, कम देरी, कम खर्च, कम गर्मी।</p>
      <p><b>पढ़ने की आदत:</b> AND को गुणन की तरह पहले, OR बाद में (precedence: NOT → AND → OR); ब्रैकेट जो लिखा हो उसे पहले। <code>AB + C</code> मतलब <code>(A·B) + C</code>।</p>` },

    { type: 'table', head: ['कानून (Law)', 'OR रूप', 'AND रूप', 'हल किया गया उदाहरण (worked example)'],
      rows: [
        ['Identity (तत्समक)', 'A + 0 = A', 'A · 1 = A', 'F = A·1 + 0 + B → F = A + B'],
        ['Null / Dominance (शून्य-प्रभुत्व)', 'A + 1 = 1', 'A · 0 = 0', 'F = AB + C + 1 → F = 1 (एक भी term हमेशा 1 दे रहा हो)'],
        ['Idempotent (आइडेम्पोटेंट)', 'A + A = A', 'A · A = A', 'F = A + A + B → F = A + B;  F = AA(B+C) = A(B+C)'],
        ['Complement / Inverse (पूरक)', 'A + A′ = 1', 'A · A′ = 0', 'F = (A + A′)B → F = 1·B = B;  F = AB·A′B = 0'],
        ['Involution (द्वि-व्युत्क्रमण)', '(A′)′ = A', '(A′)′ = A', 'दो NAND inverter एक-दूसरे को रद्द: ((AB)′)′ = AB'],
        ['Commutative (क्रमविनिमेय)', 'A + B = B + A', 'A · B = B · A', 'गेट के इनपुट पिन आपस में बदल सकते हैं — 7400 के दो इनपुट swap करने से कुछ नहीं बदलता'],
        ['Associative (सहसंबंधी)', '(A+B)+C = A+(B+C)', '(AB)C = A(BC)', '3-इनपुट OR दो 2-इनपुट OR की चेन से बराबर — cascading का आधार'],
        ['Distributive (वितरण)', 'A + BC = (A+B)(A+C)', 'A(B+C) = AB + AC', 'F = A + A′B → (A+A′)(A+B) = 1·(A+B) = A + B'],
        ['Distributive (वितरण) उल्टी दिशा', 'A(B+C) = AB+AC', 'AB + AC = A(B+C)', 'F = AB + AB′ = A(B+B′) = A·1 = A'],
        ['Absorption (अवशोषण)', 'A + AB = A', 'A(A + B) = A', 'F = XY + XY(Z+1) = XY + XY = XY'],
        ['Simplification/Redundancy', 'A + A′B = A + B', 'A(A′ + B) = AB', 'F = A + A′B + BC? → A + B पहले; फिर A + B + BC = A + B'],
        ['De Morgan (दो बार, सबसे ज़रूरी)', '(A + B)′ = A′ · B′', '(A · B)′ = A′ + B′', 'F = ((A+B)′ + (AB)′)′ = (A+B)·(AB) = AB'],
        ['Consensus (सर्वसम्मति)', 'AB + A′C + BC = AB + A′C', 'द्वैत रूप (dual)', 'F = XY + YZ + XZ? — consensus term हटाकर F = XY + YZ (when it is redundant)'],
        ['Duality (द्वैत)', 'हर समीकरण में 0↔1, +↔· बदलें तो सत्य रहता है', '—', 'Identity A+0=A का dual A·1=A — एक ही कानून के दो रूप'],
        ['Bound/Arithmetic सत्य', '1+1=1 (OR में)', '1·1=1', 'यही कारण है कि Boolean में "जोड़" का मतलब गिनती नहीं, union है']
      ] },

    { type: 'steps', items: [
      { n: 1, title: 'Expression लिखें', text: 'मान लीजिए <code>F = A′BC + A′BC′ + AB′C + AB′C′ + ABC′</code>। पहले गिनती करें — 5 product terms, 3 चर, यानी SOP (sum of products) रूप।', tips: 'हर term में सभी चर हैं — यही canonical SOP/minterm रूप है।' },
      { n: 2, title: 'समान literal वाला group करें', text: '<code>A′BC + A′BC′ = A′B(C+C′) = A′B·1 = A′B</code> (complement + identity)।', tips: 'नियम: जो term सिर्फ़ एक चर से अलग हों, वे जुड़कर उस चर को गिरा देते हैं।' },
      { n: 3, title: 'दूसरा group', text: '<code>AB′C + AB′C′ = AB′(C+C′) = AB′</code>। अब F = A′B + AB′ + ABC′।' },
      { n: 4, title: 'Absorption/consensus से और घटाएँ', text: 'A′B + AB′ = A ⊕ B (XOR)। बचा ABC′ — इसे A′B या AB′ से अलग से रखना होगा; पर ध्यान दें <code>AB′ + ABC′ = AB′(1 + C′)? </code> — नहीं, AB′(1) = AB′ कवर नहीं करता। अतः न्यूनतम रूप: <code>F = A′B + AB′ + ABC′</code>। यहाँ 3 terms, 5 literals + 1 XOR विकल्प।' },
      { n: 5, title: 'जाँच (verification)', text: 'मूल और सरल रूप दोनों की 8-पंक्ति truth table बनाकर मिलाएँ — हर पंक्ति का आउटपुट समान हो तो सरलीकरण सही। यह आदत परीक्षा और प्रैक्टिकल दोनों में अंक बचाती है।', warn: 'एक भी पंक्ति का मूल output 1 हो और सरल रूप 0 दे (या उल्टा) — सरलीकरण ग़लत।' }
    ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — De Morgan ज़रूर पूछा जाता है', html: `<p>1) <b>(AB)′ = A′ + B′</b> और <b>(A+B)′ = A′B′</b> — "bar तोड़ो, ऑपरेट बदलो, हर term को individually invert करो"।<br>
      2) NAND = bubbled-input OR, NOR = bubbled-input AND — यही De Morgan का ग्राफ़िकी रूप।<br>
      3) <code>A + A′B = A + B</code> और <code>AB + A′C = (A+C)(A′+B)</code> — छोटे "trick" identities जो MCQ में आते हैं।<br>
      4) <code>x + xy = x</code> (absorption) — सबसे तेज़ अंक वाला सवाल।<br>
      5) किसी भी expression का <b>complement</b> निकालने का नियम: बार तोड़ें, + ↔ · बदलें, हर literal invert (De Morgan बार-बार)।</p>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">32.7</span> Minterm, Maxterm, SOP और POS — truth table से expression</h3>
      <p>किसी भी फ़र्क़ के दो मानक (canonical) रूप होते हैं:</p>
      <ul>
        <li><b>SOP (Sum of Products)</b> — जिन पंक्तियों में आउटपुट <b>1</b> है, उनकी <b>minterms</b> को OR करना। लिखा जाता है <code>F = Σm(…)</code> (sigma = जोड़)।</li>
        <li><b>POS (Product of Sums)</b> — जिन पंक्तियों में आउटपुट <b>0</b> है, उनकी <b>maxterms</b> को AND करना। लिखा जाता है <code>F = ΠM(…)</code> (pi = गुणा)।</li>
        <li><b>Minterm (mᵢ)</b> — n चरों का product, जिसमें हर चर ठीक एक बार (complemented या not) आता है और केवल <b>एक ही</b> इनपुट संयोजन पर 1 देता है। नियम: चर का मान <b>0 हो तो primed (A′), 1 हो तो बिना prime (A)</b>।</li>
        <li><b>Maxterm (Mᵢ)</b> — उसी संख्या का sum term, जो केवल उस एक संयोजन पर 0 देता है। नियम उल्टा: चर का मान <b>0 हो तो बिना prime (A), 1 हो तो primed (A′)</b>।</li>
        <li>3 चर = 8 minterms (m0…m7), 4 चर = 16। <b>mᵢ = (Mᵢ)′</b>, और Σm की सूची + ΠM की सूची मिलकर सारी 2ⁿ संख्याएँ भर देती हैं (किसी भी i पर F की कमी नहीं)।</li>
        <li><b>Don't-care (X या d)</b> — जिन इनपुट संयोजनों का आउटपुट कभी मायने नहीं रखता (अमान्य BCD कोड 1010–1111, अप्रयुक्त condition) — K-map में इन्हें 1 या 0 जो चाहें मानकर और बड़ा group बना सकते हैं।</li>
      </ul>
      <p><b>3 चर (A = MSB, C = LSB) की पूरी सूची — रटने की नहीं, समझने की:</b></p>
      <table class="tbl">
        <tr><th>दशमलव i</th><th>A B C</th><th>Minterm mᵢ (1 देता है यहीं)</th><th>Maxterm Mᵢ (0 देता है यहीं)</th></tr>
        <tr><td>0</td><td>0 0 0</td><td>A′B′C′</td><td>(A + B + C)</td></tr>
        <tr><td>1</td><td>0 0 1</td><td>A′B′C</td><td>(A + B + C′)</td></tr>
        <tr><td>2</td><td>0 1 0</td><td>A′BC′</td><td>(A + B′ + C)</td></tr>
        <tr><td>3</td><td>0 1 1</td><td>A′BC</td><td>(A + B′ + C′)</td></tr>
        <tr><td>4</td><td>1 0 0</td><td>AB′C′</td><td>(A′ + B + C)</td></tr>
        <tr><td>5</td><td>1 0 1</td><td>AB′C</td><td>(A′ + B + C′)</td></tr>
        <tr><td>6</td><td>1 1 0</td><td>ABC′</td><td>(A′ + B′ + C)</td></tr>
        <tr><td>7</td><td>1 1 1</td><td>ABC</td><td>(A′ + B′ + C′)</td></tr>
      </table>
      <p><b>उदाहरण 1:</b> <code>F = Σm(1,2,5,6)</code> → पंक्तियाँ 001, 010, 101, 110 — हर जगह <b>B और C अलग-अलग</b> हैं, A का कोई फ़र्क़ नहीं। अतः <code>F = B ⊕ C</code> (केवल 2 गेट!)।<br>
      <b>उदाहरण 2:</b> <code>F = Σm(0,1,2,3)</code> → इन सबमें A = 0, इसलिए <code>F = A′</code>; उसी का POS: <code>F = ΠM(4,5,6,7) = A′</code>।<br>
      <b>उदाहरण 3:</b> <code>F = Σm(1,3,5,7)</code> → हरodd पंक्ति में C = 1, अतः <code>F = C</code>।<br>
      <b>उदाहरण 4:</b> <code>F(A,B) = ΠM(0,1,2)</code> → केवल m3 (AB) पर 1, अतः <code>F = AB</code>; और <code>Σm(3)</code> के बराबर।</p>` },

    { type: 'table', head: ['बिंदु', 'SOP (Σm) — 1 वाली पंक्तियाँ', 'POS (ΠM) — 0 वाली पंक्तियाँ'],
      rows: [
        ['क्या जोड़ते हैं', 'हर 1-पंक्ति की minterm को OR', 'हर 0-पंक्ति की maxterm को AND'],
        ['एक term में', 'सभी चर AND किए (product)', 'सभी चर OR किए (sum)'],
        ['चर का रूप', '0 → primed, 1 → plain', '0 → plain, 1 → primed'],
        ['कब सरल', 'कम 1 वाली table', 'कम 0 वाली table (ज़्यादा 1 हों तो POS छोटा)'],
        ['गेट-रूप (2-स्तर)', 'AND-plane + OR-plane (या NAND-NAND)', 'OR-plane + AND-plane (या NOR-NOR)'],
        ['उदाहरण 3 चर', 'Σm(1,2,5,6) = B ⊕ C (2 terms)', 'उसी का POS = ΠM(0,3,4,7) — चार sum terms का product, जो भी B ⊕ C ही देता है'],
        ['hardware निहितार्थ', 'Programmable Array Logic (PAL/PLA) SOP पर बने', 'कम-transistor NOR-PROM भी POS सुखद; आज synthesis दोनों स्वतः चुनता है']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">32.8</span> Karnaugh Map (K-map) — ग्राफ़िक सरलीकरण</h3>
      <p><b>K-map</b> truth table का ही आयताकृती (rectangular) रूप है, जिसमें पड़ोसी कक्ष <b>Gray code</b> क्रम में रखे जाते हैं — यानी पास-पास वाली कक्षों में <b>केवल एक bit</b> बदलता है। इसीलिए आसानी से दिख जाता है कि कौन-से minterms जुड़कर एक literal गिरा सकते हैं।</p>
      <p><b>नियम (ये ही अंक देते हैं):</b></p>
      <ol>
        <li>कक्षों की संख्या = 2ⁿ (2 चर → 4, 3 → 8, 4 → 16, 5 → दो 16-कक्ष के नक्शे)।</li>
        <li>1 से भरे कक्षों के <b>group</b> बनाएँ; हर group का आकार <b>2 का घात</b> हो — 1, 2, 4, 8, 16 (3, 5, 6 कक्ष के group ग़लत)।</li>
        <li>समूह <b>जितना बड़ा हो सके</b> उतना बड़ा, और <b>समूहों की संख्या कम से कम</b>। हर 1 कम-से-कम एक group में हो।</li>
        <li>एक 1 कई groups में आ सकता है (overlap ठीक है); हर नए group में कम-से-कम एक ऐसा 1 हो जो पहले किसी group में नहीं था (वह <b>essential prime implicant</b>)।</li>
        <li>किनारे <b>जुड़े हुए</b> हैं (wrap-around): बायाँ-दायाँ और ऊपर-नीचे पड़ोसी; 4 कक्षों का कोना-समूह भी वैध।</li>
        <li>group में जो चर <b>सब कक्षों में एक-जैसा</b> रहे, वही expression में जाएँ — 0 पर स्थिर रहे तो primed, 1 पर स्थिर रहे तो plain; जो बदले, उसे गिरा दें।</li>
        <li>2 की जगह <b>0 के group</b> बनाकर POS रूप पाते हैं (या_result का complement लेकर De Morgan)।</li>
        <li>Don't-care (X) को 1 मानकर group बड़ा किया जा सकता है; ज़रूरत न हो तो 0 रखें। X को हर group में शामिल करना ज़रूरी नहीं।</li>
      </ol>
      <div class="callout info"><b class="ct">क्यों Gray code क्रम?</b><p>बाइनरी क्रम (00,01,10,11) में 01 → 10 दो bit बदलते हैं, इसलिए सरलीकरण छिप जाता है। Gray code (00, 01, 11, 10) में हर कदम पर 1 bit — यही K-map की पूरी जान है। इसीलिए 3-चर नक्शे में कॉलम <code>AB = 00, 01, 11, 10</code> होते हैं, 00,01,10,11 नहीं।</p></div>` },

    { type: 'steps', items: [
      { n: 1, title: '2-चर K-map — expression लें', text: '<code>F(A,B) = Σm(0,1,2)</code>, यानी m0 (A′B′) = 1, m1 (A′B) = 1, m2 (AB′) = 1, m3 (AB) = 0।' },
      { n: 2, title: 'नक्शा भरें', text: 'कक्ष क्रम (Gray): 00, 01, 11, 10 अर्थ AB: 00→m0, 01→m1, 11→m3, 10→m2। मान रखें: <code>m0=1, m1=1, m3=0, m2=1</code>।' },
      { n: 3, title: 'पहला group (m0 + m1)', text: 'दोनों में A = 0 स्थिर, B बदलता है (0→1)। B गिरा, A primed बचा → term <b>A′</b>।' },
      { n: 4, title: 'दूसरा group (m0 + m2)', text: 'दोनों में B = 0 स्थिर, A बदलता है (0→1)। A गिरा, B primed बचा → term <b>B′</b>। ध्यान दें m0 दो बार इस्तेमाल हुआ — यह वैध है।' },
      { n: 5, title: 'परिणाम जोड़ें', text: '<code>F = A′ + B′</code>। De Morgan से <code>A′ + B′ = (A·B)′</code> — अर्थात् यह एक <b>NAND</b> गेट है! 3 minterms का SOP (2 AND + 1 OR) अब 1 NAND।' , tips: 'यही कारण है कि NAND/NOR library सबसे पहले सोची जाती है।' },
      { n: 6, title: 'जाँच', text: 'A=0,B=0 → F=1 ✓; 0,1 → 1 ✓; 1,0 → 1 ✓; 1,1 → (1·1)′ = 0 ✓। मूल Σm(0,1,2) से मेल खाता है।' },
      { n: 7, title: 'POS रूप (0 के group से)', text: 'यहाँ 0 केवल m3 (AB = 11) पर है। उस एक कक्ष की maxterm <code>M3 = (A′ + B′)</code> — नियम के अनुसार A=1 था इसलिए A′, B=1 था इसलिए B′। अतः <code>F = ΠM(3) = (A′ + B′)</code>, और De Morgan से यही <code>(A·B)′</code> — ऊपर के SOP (A′ + B′) से बिल्कुल मेल खाता है।', warn: '0-कक्ष से sum term लिखते समय literal का primed/plain उल्टा होता है — यहीं सबसे ज़्यादा ग़लती होती है।' }
    ] },

    { type: 'steps', items: [
      { n: 1, title: '3-चर K-map — उदाहरण', text: '<code>F(A,B,C) = Σm(1,3,4,5,7)</code>। A = MSB, C = LSB। 8 कक्ष: m0…m7; इनमें 1 डालें: 1,3,4,5,7।', tips: 'बाक़ी (0,2,6) पर 0।' },
      { n: 2, title: 'नक्शे का ढाँचा', text: 'पंक्तियाँ <code>A</code> (0 और 1), स्तंभ <code>BC</code> Gray क्रम में 00, 01, 11, 10। इससे एक ही row में चार और एक column में दो कक्ष पड़ोसी रहते हैं।' },
      { n: 3, title: 'सबसे बड़ा group पहले', text: 'm1, m3, m5, m7 = एक 4-कक्ष का समूह (पूरे BC=01 व 11 स्तंभ, दोनों rows)। इनमें B और C बदलते हैं पर <b>C = 1 स्थिर</b>? जाँच: 1(001), 3(011), 5(101), 7(111) — सबमें C=1, A और B दोनों बदल रहे → term <b>C</b>।' },
      { n: 4, title: 'बचा हुआ 1 (m4) कवर करें', text: 'm4 (100) को m5 (101) के साथ जोड़ें — 2-कक्ष group, जिसमें A = 1 स्थिर, B = 0 स्थिर, C बदलता → term <b>AB′</b>।' },
      { n: 5, title: 'परिणाम', text: '<code>F = C + AB′</code> — दो terms, 3 literals। SOP रूप (5 minterms, 5×3 = 15 literals) से बहुत छोटा।' },
      { n: 6, title: 'हर पंक्ति पर जाँच', text: 'F(0,0,0)=0 ✓ (m0=0); F(0,1,0)=0 ✓ (m2=0); F(1,1,0)=? C=0, AB′ = 1·0 = 0 → 0 ✓ (m6=0); F(1,0,0)= 0+1·1=1 ✓ (m4=1); C=1 वाली चारों पंक्तियाँ 1 ✓।' },
      { n: 7, title: 'गेट में बदलें', text: 'एक AND (2 इनपुट A, B′) + एक OR (2 इनपुट C, AB′) + एक inverter (B′) = <b>3 IC-gates</b>। NAND-only: AB′ को NAND+inv से, फिर OR-in-Disguise (bubbled-input OR = NAND) — कुल 3 NAND।', tips: '4 चर (16 कक्ष) में नियम वही, बस 8 का group भी बन सकता है और wrap चारों ओर; 5 चर के लिए दो नक्शे या Quine–McCluskey/software।' }
    ] },

    { type: 'callout', kind: 'tip', title: 'K-map की 6 आम ग़लतियाँ (जो अंक चुराती हैं)', html: `<ol>
      <li>Binary क्रम में कॉलम लगाना (00,01,10,11) — Gray क्रम चाहिए: <b>00, 01, 11, 10</b>।</li>
      <li>आकार 3 या 6 का group बनाना — केवल 1, 2, 4, 8, 16।</li>
      <li>wrap-around भूलना (कॉलम 0 और कॉलम 3 पड़ोसी हैं; row 0 और row 1 भी, और 4-चर नक्शे में row 0 व 3 भी)।</li>
      <li>हर संभव group न लेना — कोई 1 बिना कवर छोड़ देना।</li>
      <li>कम literal गिराना — group 4 का है पर term 2-variable वाला लिखा (हर दोगुना group = एक literal कम)।</li>
      <li>Group का नियम याद न रखना: <b>SOP में 1-group के स्थिर literal = product term</b>, <b>POS में 0-group के स्थिर literal (उल्टा मान) = sum term</b>।</li>
    </ol>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">32.9</span> Half Adder और Full Adder — गेटों से जोड़</h3>
      <p><b>adder</b> सबसे मौलिक कॉम्बिनेशनल सर्किट है — यही ALU (Arithmetic Logic Unit) की रीढ़ है।</p>
      <ul>
        <li><b>Half Adder (HA)</b> — दो bits जोड़ता है, incoming carry <b>नहीं</b> लेता। <code>Sum S = A ⊕ B</code>, <code>Carry C = A·B</code>। गेट: 1 XOR + 1 AND। इसे "half" कहने का कारण — यह 3 bits (A, B, Carry-in) का काम नहीं कर सकता।</li>
        <li><b>Full Adder (FA)</b> — तीन bits (A, B, Cin) जोड़ता है। <code>S = A ⊕ B ⊕ Cin</code>, <code>Cout = A·B + Cin·(A ⊕ B)</code> (बराबर रूप: <code>Cout = AB + BCin + ACin</code> — "majority vote" गेट)। गेट: <b>2 HA + 1 OR</b> = 2 XOR + 2 AND + 1 OR।</li>
        <li><b>Ripple Carry Adder (RCA)</b> — n FA श्रेणीक्रम में, हर का Cout अगले का Cin। n-bit जोड़ = n FA; देरी सबसे बड़ी कमज़ोरी — carry एक-एक bit रेंगती है, इसलिए 32-bit जोड़ में 32 carry-delay जुड़ते हैं। इसी को तोड़ने के लिए <b>Carry Look-ahead Adder (CLA)</b> (generate G=A·B, propagate P=A+B से carry पहले से निकालता है), <b>carry-skip / carry-select / BCD adder</b> आदि। 74182 (look-ahead carry generator) और 74181 (4-bit ALU) इसी दौर के क्लासिक IC हैं।</li>
        <li><b>overflow (signed) पहचान</b> = MSB के_stage का <code>Cin ⊕ Cout</code>। Flag register में यही V (overflow) flag बनता है; unsigned का carry = C flag।</li>
      </ul>
      <p><b>घटाना (subtraction)</b> दो तरह: (1) <b>half subtractor</b> — <code>D = A ⊕ B</code>, <code>Borrow = A′·B</code>; <b>full subtractor</b> — <code>D = A ⊕ B ⊕ Bin</code>, <code>Bout = A′B + A′Bin + B·Bin</code>। (2) व्यावहारिक तरीक़ा — <b>2’s complement</b>: <code>A − B = A + B′ + 1</code>; ALU में B को XOR-controlled inverters से पलटा जाता है और Cin = 1 दिया जाता है, जिससे एक ही adder जोड़ भी और घटाव भी करता है। यही कारण है कि कंप्यूटर में "subtract का अलग सर्किट" नहीं होता।</p>` },

    { type: 'table', head: ['A', 'B', 'Half Adder: Sum', 'Half Adder: Carry', 'Half Subtractor: Diff', 'Half Subtractor: Borrow'],
      rows: [
        ['0', '0', '0', '0', '0', '0'],
        ['0', '1', '1', '0', '1', '1'],
        ['1', '0', '1', '0', '1', '0'],
        ['1', '1', '0', '1', '0', '0']
      ] },

    { type: 'table', head: ['A', 'B', 'Cin', 'Sum (A⊕B⊕Cin)', 'Cout (AB + Cin(A⊕B))', 'दशमलव अर्थ (जोड़)'],
      rows: [
        ['0', '0', '0', '0', '0', '0'],
        ['0', '0', '1', '1', '0', '1'],
        ['0', '1', '0', '1', '0', '1'],
        ['0', '1', '1', '0', '1', '2'],
        ['1', '0', '0', '1', '0', '1'],
        ['1', '0', '1', '0', '1', '2'],
        ['1', '1', '0', '0', '1', '2'],
        ['1', '1', '1', '1', '1', '3 (1+1+1 = 11₂)']
      ] },

    { type: 'steps', items: [
      { n: 1, title: 'दो 4-bit संख्याएँ लें', text: 'A = A₃A₂A₁A₀, B = B₃B₂B₁B₀। 4 FA की श्रृंखला रखें; सबसे दाएँ (LSB) FA का Cin = 0 रखें जोड़ के लिए, 1 रखें घटाने के लिए।' },
      { n: 2, title: 'FA₀ (bit 0)', text: 'S₀ = A₀⊕B₀⊕C₀; C₁ = A₀B₀ + C₀(A₀⊕B₀)। यहाँ C₀ = 0 या 1 (control signal)।' },
      { n: 3, title: 'FA₁…FA₃ तक carry आगे बढ़ाएँ', text: 'हर FA का Cout अगले का Cin — यही ripple है। S₁, S₂, S₃ उसी सूत्र से।' },
      { n: 4, title: 'अंतिम Cout = carry flag', text: 'C₄ को C flag कहते हैं (unsigned overflow/borrow का संकेत)।' },
      { n: 5, title: 'Overflow flag', text: '<code>V = C₃ ⊕ C₄</code> — अर्थात MSB-stage के अंदर व बाहर की carry अलग हो तो signed result ग़लत (overflow)।' },
      { n: 6, title: 'उदाहरण से जाँच', text: 'A = 0110 (6), B = 0101 (5): S₀: 0⊕1=1, C₁=0; S₁: 1⊕0⊕0=1, C₂=0; S₂: 1⊕1=0, C₃=1; S₃: 0⊕0⊕1=1, C₄=0 → S = 1011 = 11 ✓, C=0, V=1⊕0=1? यहाँ C₃=1, C₄=0 → V=1 — पर 6+5=11, 4-bit signed range ±7 से बाहर है, अतः V=1 सही है (signed overflow)। Unsigned के लिए 11 सही और C=0।' , tips: 'यही अंकित उदाहरण समझाता है कि V और C दो अलग-अलग ध्वज (flags) क्यों हैं।' },
      { n: 7, title: '2 का complement वाला घटाव', text: 'A − B: हर Bᵢ को inverter से गुज़ारें (या FA के B इनपुट पर XOR với control = 1), Cin = 1। नतीजा 2’s complement जोड़; C₄ उलटा करके borrow flag मिलता है।', warn: 'control signal भूलकर Cin = 0 पर B′ जोड़ दें तो उत्तर 1 कम आएगा — सबसे आम प्रैक्टिकल ग़लती।' }
    ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">32.10</span> Comparator (तुलनाकर्ता) और ALU की शुरुआत</h3>
      <p><b>Magnitude comparator</b> दो बाइनरी संख्याएँ तुलना करता है और तीन आउटपुट देता है: <code>A &gt; B</code>, <code>A = B</code>, <code>A &lt; B</code> (हर एक 1-wire, एक समय केवल एक सक्रिय)।</p>
      <ul>
        <li><b>1-bit तुलना:</b> <code>A = B</code> पर XNOR (1), <code>A &gt; B</code> = A·B′, <code>A &lt; B</code> = A′·B। यह दिखाता है कि XNOR असल में equality detector है।</li>
        <li><b>n-bit तुलना:</b> सबसे महत्वपूर्ण bit (MSB) से शुरू — <code>A₃ &gt; B₃</code> तय कर दे तो नीचे कुछ भी हो, A &gt; B। समान होने पर अगला bit देखता है। <code>(A=B)</code> = सभी bit-pairs की XNOR का product।</li>
        <li><b>Cascading:</b> 4-bit चिपों पर <code>I(A&gt;B)</code>, <code>I(A=B)</code>, <code>I(A&lt;B)</code> इनपुट pins होते हैं — 7485 (4-bit magnitude comparator) में इन्हें जोड़-जोड़कर 8/12/16-bit तुलना बनती है। सबसे बड़े bits वाली चिप के cascading inputs को 0,1,0 (केवल "equal" inactive रखने का मानक तरीक़ा) दें।</li>
        <li><b>ALU से संबंध:</b> आधुनिक प्रोसेसर अलग comparator नहीं रखते — <code>A − B</code> करके flags (Z = zero, C = carry, N = negative, V = overflow) से तुलना तय करते हैं। इसीलिए "if (a &lt; b)" एक subtract + flag-check पर चलता है (x86 का <code>CMP</code> निर्देश यही करता है)।</li>
      </ul>` },

    { type: 'table', head: [' circuits / MSI device', 'क्या करता है', 'मूल समीकरण', 'आम IC', 'कहाँ इस्तेमाल'],
      rows: [
        ['Half / Full adder', '1 या 2-bit जोड़', 'S=A⊕B; S=A⊕B⊕Cin', '7483 / 74283 (4-bit full adder)', 'ALU, address calculation, DSP'],
        ['Ripple carry adder (n-bit)', 'n bits का जोड़, carry रेंगता', 'n FA series', '2×74283 = 8-bit', 'सरल/सस्ता, पर धीमा'],
        ['Carry look-ahead adder', 'carry समानांतर में निकालता', 'G=AB, P=A+B; C₁=G₀+P₀C₀', '74182 + 74181', 'तेज़ ALU'],
        ['Magnitude comparator', 'A&gt;B, A=B, A&lt;B', 'MSB से priority', '7485', 'branch decision, ADC, ID match'],
        ['1-bit equality', 'XNOR', 'A⊙B', '74266 / 7486 + inverter', 'tag compare, cache hit'],
        ['Parity generator/checker', 'odd/even bits की गिनती', 'XOR cascade', '74180 (9-bit)', 'memory/communication की parity, RAID'],
        ['Shifter', 'barrel shift left/right', 'हर stage में mux', '74173/74174 + mux network', 'ALU का multiply/divide, endian बदल']
      ] },

    /* @@NEXT3@@ */
  ]
}
]);

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
{
  id: 'sci-data', icon: '🗂️', group: 'कंप्यूटर विज्ञान',
  title: 'डेटा, मेमोरी और फ़ाइल सिस्टम',
  sub: 'Data बनाम Information, मेमोरी पदानुक्रम, फ़ाइल-फ़ोल्डर, FAT/NTFS/ext4, partition व backup — पूरी जड़',
  kicker: 'Computer Science 4 · Data, Memory Hierarchy & File Systems',
  hero: 'कंप्यूटर के अंदर आपका काम <b>किस रूप में रखा जाता है</b> — यह पेज उसी की पूरी नक्शा-कशी है। <b>डेटा और सूचना का फ़र्क़</b>, processing cycle, <b>मेमोरी पदानुक्रम</b> (register से cloud तक — गति, आकार, लागत), volatile बनाम non-volatile, <b>फ़ाइल क्या है</b> (नाम, extension, metadata, path), <b>फ़ाइल सिस्टम भीतर से कैसे काम करता है</b> (FAT, MFT, inode), FAT32/exFAT/NTFS/ext4/APFS की तुलना, partition व format, sector/cluster/block, fragmentation व TRIM, फ़ाइल-संचालन व अनुमति, absolute बनाम relative path, और <b>backup व recovery</b> का पूरा नियम।',
  tags: ['DATA ≠ INFORMATION', 'MEMORY HIERARCHY', 'FILE SYSTEM भीतर से', 'NTFS · ext4 · FAT32', 'BACKUP 3-2-1'],
  blocks: [

    { type: 'callout', kind: 'info', title: 'इस पेज के बाद आप यह कर पाएँगे', html: '<ol><li>डेटा, सूचना और ज्ञान का फ़र्क़ उदाहरण से बता पाएँगे।</li><li>मेमोरी के हर स्तर की गति, आकार, लागत और volatility क्रम में लिख पाएँगे।</li><li>किसी भी फ़ाइल का नाम, extension, path और metadata पढ़कर उसका काम बता पाएँगे।</li><li>FAT32, exFAT, NTFS, ext4 में फ़र्क़ करके सही जगह सही फ़ाइल सिस्टम चुन पाएँगे।</li><li>format, partition, cluster, sector, inode/MFT का अर्थ समझा पाएँगे।</li><li>डिलीट हुई फ़ाइलक्यों वापस मिल सकती है और backup का 3-2-1 नियम क्या है — दोनों बता पाएँगे।</li></ol>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.1</span> डेटा बनाम सूचना — कंप्यूटर की पूरी प्रक्रिया एक वाक्य में</h3>
      <p><b>Data (डेटा)</b> कच्चे, बिना अर्थ के तथ्य हैं — अंक, अक्षर, चिह्न, तस्वीर के pixel, ध्वनि के sample। अकेला "38" कुछ नहीं कहता। <b>Information (सूचना)</b> वही डेटा है जिसे <b>सन्दर्भ (context) और अर्थ</b> मिल गया हो — "रोगी का तापमान 38°C है, यानी बुख़ार है"। <b>Knowledge (ज्ञान)</b> सूचना से निकला नियम/अनुभव है — "38°C से ऊपर बार-बार आए तो जाँच करानी चाहिए"।</p>
      <p>कंप्यूटर की पूरी प्रक्रिया इसी एक चक्र में सिमटी है: <b>Input → Process → Output → Storage</b> (और वापस feedback)। इसे <b>IPOS cycle</b> कहते हैं। Keyboard/mouse/scanner/sensor से डेटा अंदर आता है (input), CPU की ALU व control unit उसे बदलती है (process), monitor/printer/speaker पर नतीजा दिखता है (output), और disk/SSD/cloud पर सहेजा जाता है (storage) ताकि बाद में फिर इस्तेमाल हो सके।</p>
      <p>डेटा की दो किस्में याद रखिए: <b>qualitative (गुणात्मक)</b> — रंग, प्रतिक्रिया, वर्णन; और <b>quantitative (मात्रात्मक)</b> — अंक, वज़न, समय। कंप्यूटर दोनों को आख़िर में bit में ही रखता है, पर अर्थ इंसान तय करता है। इसीलिए एक ही फ़ाइल ग़लत software में खोलने पर कचरा दिखती है — byte वही हैं, व्याख्या बदल गई।</p>` },

    { type: 'table', head: ['पहलू', 'Data (डेटा)', 'Information (सूचना)', 'Knowledge (ज्ञान)'],
      rows: [
        ['परिभाषा', 'कच्चे तथ्य/आँकड़े, बिना सन्दर्भ', 'संगठित व अर्थपूर्ण डेटा', 'सूचना से निकला नियम, अनुभव, समझ'],
        ['उदाहरण', '38, 42, 17 (केवल अंक)', 'तीन रोगियों का तापमान 38°C, 42°C, 17°C — असामान्य मान', '42°C जानलेवा है; 37°C सामान्य — तुरंत इलाज का नियम'],
        ['अर्थ', 'अकेला अर्थहीन', 'सन्दर्भ से अर्थपूर्ण', 'निर्णय लेने लायक'],
        ['कौन बनाता है', 'sensor, keyboard, फ़ॉर्म, log', 'प्रोग्राम/प्रक्रिया (गणना, छँटाई, जोड़)', 'इंसान या सीखने वाला मॉडल (AI)'],
        ['निर्भरता', 'किसी पर नहीं', 'डेटा पर निर्भर', 'सूचना + अनुभव पर'],
        ['कंप्यूटर में रूप', 'bit/byte, फ़ाइल, database record', 'रिपोर्ट, चार्ट, screen, प्रिंट', 'नियम, मॉडल, प्रशिक्षित भार (weights)'],
        ['ग़लत हो तो', 'ग़लत अंक दर्ज होना (typo)', 'ग़लत गणना/ग़लत सन्दर्भ', 'ग़लत निष्कर्ष/पूर्वाग्रह (bias)']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.2</span> मेमोरी पदानुक्रम (Memory Hierarchy) — क्यों एक ही तरह की मेमोरी नहीं?</h3>
      <p>एक आदर्श मेमोरी <b>बहुत तेज़, बहुत बड़ी और बहुत सस्ती</b> होगी — पर भौतिकी में तीनों एक साथ नहीं मिलते। तेज़ मेमोरी (SRAM) महँगी और जगह घेरने वाली है; सस्ती मेमोरी (disk/flash) धीमी है। इसलिए कंप्यूटर में <b>कई स्तरों का पिरामिड</b> बनाया जाता है: ऊपर थोड़ी-सी बहुत तेज़ मेमोरी, नीचे बहुत सारी धीमी मेमोरी। CPU जिस डेटा को बार-बार माँगता है वह ऊपर चढ़ आता है, बाक़ी नीचे पड़ा रहता है।</p>
      <p>यह कामयाब क्यों होता है? दो अनुभवजन्य नियमों से — <b>Locality of reference</b>: (1) <b>Temporal locality</b> — अभी इस्तेमाल हुआ डेटा जल्द फिर इस्तेमाल होगा (loop का counter); (2) <b>Spatial locality</b> — एक पते के आस-पास का डेटा भी जल्द चाहिए होगा (array के अगले element, फ़ाइल की अगली लाइन)। इसीलिए cache में एक byte नहीं, पूरा <b>cache line (आम तौर पर 64 byte)</b> लाया जाता है।</p>
      <p>क्रम याद रखिए (ऊपर से नीचे = तेज़ से धीमा, छोटा से बड़ा, महँगा से सस्ता): <b>Register → Cache (L1, L2, L3) → Main memory (RAM) → Secondary storage (SSD/HDD) → Tertiary/Offline (tape, optical, cloud archive)</b>। Register और cache CPU के <b>अंदर</b> हैं; RAM बाहर पर motherboard पर; storage उससे आगे।</p>` },

    { type: 'table', head: ['स्तर', 'तकनीक', 'typical आकार', 'पहुँच-समय (लगभग)', 'लागत प्रति GB', 'Volatile?', 'कौन चलाता है'],
      rows: [
        ['CPU Register', 'Flip-flop (CPU के अंदर)', 'कुछ dozen × 64-bit (~KB से भी कम)', '<b>सबसे तेज़</b> — 1 clock cycle (~0.3 ns)', 'सबसे महँगी', 'हाँ', 'Compiler / CPU'],
        ['Cache L1', 'SRAM', '32–64 KB प्रति core (अलग data व instruction)', '~1 ns (3–4 cycle)', 'बहुत महँगी', 'हाँ', 'CPU hardware'],
        ['Cache L2', 'SRAM', '256 KB – 2 MB प्रति core', '~3–5 ns', 'महँगी', 'हाँ', 'CPU hardware'],
        ['Cache L3', 'SRAM (साझा)', '8–128 MB पूरे chip पर', '~10–20 ns', 'महँगी', 'हाँ', 'CPU hardware'],
        ['Main Memory (RAM)', 'DRAM (DDR4/DDR5)', '8–64 GB (सर्वर में TB)', '~50–100 ns', 'मध्यम', '<b>हाँ</b> — बिजली गई, डेटा गया', 'OS + memory controller'],
        ['SSD / NVMe', 'NAND flash', '256 GB – 8 TB', '~20–100 µs (माइक्रोसेकंड)', 'कम', '<b>नहीं</b>', 'OS फ़ाइल सिस्टम + SSD controller'],
        ['HDD', 'चुंबकीय platter', '1–24 TB', '~5–15 ms (मिलीसेकंड)', 'सबसे कम', 'नहीं', 'OS फ़ाइल सिस्टम'],
        ['Optical (CD/DVD/Blu-ray)', 'लेज़र से गड्ढे', '700 MB / 4.7 GB / 25–100 GB', '~100 ms+', 'बहुत कम', 'नहीं', 'user / burning software'],
        ['Tape / Cloud archive', 'चुंबकीय tape / दूरस्थ भंडारण', 'TB–PB', 'सेकंड से मिनट (offline हो तो घंटे)', 'सबसे कम प्रति TB', 'नहीं', 'backup software / प्रदाता']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.3</span> Primary बनाम Secondary, Volatile बनाम Non-volatile</h3>
      <p>दो अलग-अलग वर्गीकरण हैं जिन्हें मिलाया नहीं जाना चाहिए:</p>
      <ul>
        <li><b>Primary (मुख्य) मेमोरी</b> = वह जिससे CPU <b>सीधा</b> पता लगाकर पढ़/लिख सकता है — <b>RAM और ROM</b> (cache/register भी CPU के भीतर primary ही गिने जाते हैं)। <b>Secondary (सहायक) मेमोरी</b> = स्थायी भंडारण — HDD, SSD, pen drive, memory card, optical disk, tape। CPU इसे सीधे नहीं पढ़ता; पहले डेटा RAM में लाना पड़ता है (<b>यही "loading" है</b>)।</li>
        <li><b>Volatile (अस्थिर)</b> = बिजली जाते ही मान मिट जाए — <b>RAM, cache, register</b>। <b>Non-volatile (स्थिर)</b> = बिजली के बिना भी मान बना रहे — <b>ROM, flash/SSD, HDD, optical, tape</b>। इसीलिए कंप्यूटर बंद करने से पहले save करना ज़रूरी है: खुली फ़ाइल RAM में है, disk पर नहीं।</li>
      </ul>
      <p><b>RAM के दो भेद:</b> <b>SRAM (Static RAM)</b> — flip-flop से बना, refresh नहीं चाहिए, बहुत तेज़, महँगा, कम घनत्व → cache में। <b>DRAM (Dynamic RAM)</b> — capacitor में आवेश, हर कुछ ms में <b>refresh</b> करना पड़ता है (नहीं तो लीक होकर मान मिट जाए), सस्ता, ज़्यादा घनत्व → main memory में। "Dynamic" शब्द इसी refresh से आया है।</p>
      <p><b>ROM के भेद:</b> <b>PROM</b> (एक बार लिखा जा सके), <b>EPROM</b> (UV रोशनी से मिटाकर फिर लिखा), <b>EEPROM</b> (बिजली से मिटाकर फिर लिखा — byte-स्तर), <b>Flash</b> (EEPROM का तेज़ block-स्तर रूप — आज का BIOS/UEFI chip, SSD, pen drive सब flash हैं)। BIOS/UEFI फ़र्मवेयर इसी non-volatile flash में रहता है ताकि बिजली जाने पर भी बूट-निर्देश बचे रहें।</p>` },

    { type: 'table', head: ['आधार', 'RAM', 'ROM', 'Cache', 'Secondary Storage (SSD/HDD)'],
      rows: [
        ['पूरा नाम', 'Random Access Memory', 'Read Only Memory', 'Cache Memory', 'सहायक/स्थायी भंडारण'],
        ['लिख सकते हैं?', 'हाँ, बार-बार', 'आम तौर पर नहीं (flash ROM में विशेष विधि से हाँ)', 'CPU hardware खुद लिखता है', 'हाँ'],
        ['Volatile?', '<b>हाँ</b>', 'नहीं', 'हाँ', 'नहीं'],
        ['तकनीक', 'DRAM', 'Flash/EEPROM (पहले mask ROM)', 'SRAM', 'NAND flash / चुंबकीय platter'],
        ['गति', 'तेज़ (~50–100 ns)', 'धीमी', '<b>सबसे तेज़</b>', 'सबसे धीमी (µs–ms)'],
        ['आकार', 'GB में', 'MB में (BIOS chip 8–32 MB)', 'KB–MB में', 'TB में'],
        ['काम', 'चल रहे प्रोग्राम व खुला डेटा रखना', 'बूट/फ़र्मवेयर निर्देश रखना', 'बार-बार वाले डेटा की नक़ल पास रखना', 'फ़ाइलें स्थायी रखना'],
        ['CPU सीधा पहुँच?', 'हाँ', 'हाँ', 'हाँ (अंदर ही है)', 'नहीं — पहले RAM में लाना पड़ता है'],
        ['ख़राब हो तो', 'बीप कोड, POST fail, random restart', 'बूट नहीं होता, BIOS corrupt', 'CPU के अंदर — अलग नहीं बदल सकते', 'फ़ाइलें ग़ायब, click आवाज़, read error']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.4</span> फ़ाइल क्या है — नाम, extension, metadata और path</h3>
      <p><b>File (फ़ाइल)</b> = related डेटा का नाम-रखा हुआ समूह जो secondary storage पर रखा हो। कंप्यूटर के लिए फ़ाइल byte की एक लंबी कतार है; <b>अर्थ फ़ाइल सिस्टम और प्रोग्राम जोड़ते हैं</b>। चार चीज़ें हर फ़ाइल की पहचान बनाती हैं:</p>
      <ul>
        <li><b>नाम (name):</b> इंसान के लिए। Windows में अधिकतम 255 अक्षर (पूरा path 260 की पुरानी सीमा अब लंबी हो सकती है), और <code>\\ / : * ? " &lt; &gt; |</code> वर्जित हैं। Linux में केवल <code>/</code> और NUL वर्जित, नाम case-sensitive है (<code>File.txt</code> और <code>file.txt</code> अलग)।</li>
        <li><b>Extension (एक्सटेंशन):</b> आख़िरी बिंदु के बाद का हिस्सा — <code>.txt</code>, <code>.docx</code>, <code>.jpg</code>। यह OS को बताता है कि <b>किस प्रोग्राम से खोलें</b> (file association)। ध्यान रहे: extension बदलने से फ़ाइल का <b>असली प्रकार नहीं बदलता</b> — <code>photo.jpg</code> को <code>photo.txt</code> कर देने से वह text नहीं बन जाती। असली पहचान फ़ाइल के पहले कुछ byte (<b>magic number / signature</b>) से होती है, जैसे PDF में <code>%PDF</code>, PNG में <code>89 50 4E 47</code>, ZIP/docx/xlsx में <code>50 4B</code> ("PK")।</li>
        <li><b>Metadata (मेटाडेटा):</b> फ़ाइल के बारे में डेटा — आकार, बनाई/बदली/खोली गई तारीख़, owner, permission/attributes (read-only, hidden, system, archive), प्रकार, और अंदरूनी जानकारी (फ़ोटो में EXIF — कैमरा, GPS, समय; MP3 में ID3 — कलाकार, एल्बम)।</li>
        <li><b>Path (पथ):</b> फ़ाइल सिस्टम में उसका पता — <b>absolute</b> (जड़ से पूरा: <code>C:\\Users\\Ram\\notes.txt</code> या <code>/home/ram/notes.txt</code>) बनाम <b>relative</b> (वर्तमान फ़ोल्डर से: <code>notes.txt</code>, <code>..\\notes.txt</code>, <code>./docs/a.txt</code>)।</li>
      </ul>` },

    { type: 'table', head: ['Extension', 'फ़ाइल का प्रकार', 'खोलने वाला प्रोग्राम', 'असली पहचान (magic/signature)', 'ध्यान देने की बात'],
      rows: [
        ['.txt', 'सादा पाठ (plain text)', 'Notepad, VS Code,कोई भी text editor', 'कोई तय signature नहीं', 'सबसे हल्की; कोई formatting नहीं'],
        ['.docx / .xlsx / .pptx', 'Office Open XML', 'MS Word / Excel / PowerPoint, LibreOffice', '<code>PK</code> (50 4B) — असल में ZIP', '.doc/.xls/.ppt पुराना binary रूप; x = XML'],
        ['.pdf', 'Portable Document Format', 'Adobe Reader, browser', '<code>%PDF-</code>', 'हर जगह एक जैसा दिखे; खोलना मुफ़्त'],
        ['.jpg / .jpeg', 'संपीड़ित फ़ोटो (lossy)', 'Photos, browser, viewer', '<code>FF D8 FF</code>', 'बार-बार save करने पर गुणवत्ता गिरती है'],
        ['.png', 'फ़ोटो/ग्राफ़िक (lossless, transparency)', 'Photos, browser', '<code>89 50 4E 47</code>', 'logo, screenshot के लिए बेहतर'],
        ['.gif', 'चित्र + सरल animation', 'browser, viewer', '<code>GIF87a / GIF89a</code>', 'केवल 256 रंग'],
        ['.mp3 / .wav', 'ध्वनि — संपीड़ित / असंपीड़ित', 'player, editor', 'ID3 / <code>RIFF</code>', 'wav बहुत बड़ी, mp3 छोटी'],
        ['.mp4 / .mkv / .avi', 'वीडियो container', 'VLC, player', '<code>ftyp</code> (mp4) / <code>RIFF</code> (avi)', 'container ≠ codec — अंदर H.264/H.265 हो सकता है'],
        ['.zip / .rar / .7z', 'संपीड़ित संग्रह (archive)', 'File Explorer, 7-Zip, WinRAR', '<code>PK</code> / <code>Rar!</code> / <code>7z</code>', 'कई फ़ाइल एक में; password भी लग सकता है'],
        ['.exe / .msi', 'Windows निष्पादन योग्य / installer', 'OS खुद चलाता है', '<code>MZ</code> (4D 5A)', 'सबसे जोखिम भरी — अज्ञात स्रोत से न चलाएँ'],
        ['.html / .css / .js', 'वेब पेज / शैली / स्क्रिप्ट', 'browser, editor', 'पाठ ही है', 'server पर वही फ़ाइलें वेबसाइट बनाती हैं'],
        ['.py / .c / .java', 'स्रोत कोड (source code)', 'editor + interpreter/compiler', 'पाठ', 'चलाने के लिए भाषा का runtime चाहिए'],
        ['.iso', 'डिस्क की पूरी छवि', 'mount/burn software', 'ISO 9660 संरचना', 'OS installer अक्सर इसी में'],
        ['.lnk / .url', 'शॉर्टकट (असली फ़ाइल नहीं)', 'Explorer / browser', 'Windows shell link', 'मूल फ़ाइल हटे तो शॉर्टकट बेकार']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.5</span> फ़ाइल सिस्टम भीतर से कैसे काम करता है</h3>
      <p>डिस्क पर तो केवल byte की कतार है। <b>फ़ाइल सिस्टम</b> वह नक़्शा-प्रणाली है जो बताती है — कौन-सा byte किस फ़ाइल का है, फ़ाइल का नाम क्या है, फ़ोल्डर में कौन-सी फ़ाइलें हैं, और खाली जगह कहाँ है। इसके बिना डिस्क अर्थहीन byte का ढेर है। तीन बुनियादी काम हर फ़ाइल सिस्टम करता है:</p>
      <ol>
        <li><b>नामकरण व निर्देशिका (naming & directory):</b> नाम से फ़ाइल के record तक पहुँच। यह record ही बताता है कि डेटा किन टुकड़ों में रखा है।</li>
        <li><b>आवंटन (allocation):</b> डिस्क को तय आकार के टुकड़ों में बाँटना और फ़ाइल को टुकड़े देना। टुकड़े लगातार (contiguous) हों तो तेज़, बिखरे (linked/indexed) हों तो लचीले।</li>
        <li><b>खाली-जगह प्रबंधन (free-space management):</b> कौन-से टुकड़े खाली हैं — bitmap या free-list से। नई फ़ाइल बनते ही यहीं से जगह मिलती है।</li>
      </ol>
      <p>तीन मुख्य नक़्शा-ढाँचे हैं:</p>
      <ul>
        <li><b>FAT (File Allocation Table — FAT12/16/32):</b> एक बड़ी तालिका जिसमें हर cluster की एक entry है और entry बताती है "अगला cluster कौन-सा" — यानी linked list। सरल, हर OS पढ़ लेता है, इसीलिए pen drive/memory card में आम। कमी: journaling नहीं, permission नहीं, बड़ी फ़ाइल/बड़े volume में सीमा।</li>
        <li><b>NTFS (New Technology File System — Windows):</b> हर फ़ाइल का record <b>MFT (Master File Table)</b> में; छोटी फ़ाइल का डेटा सीधा MFT entry में ही रह सकता है (<b>resident</b>)। साथ में <b>journaling ($LogFile)</b>, permission (ACL), compression, encryption (EFS), hard link, alternate data stream, बड़े volume।</li>
        <li><b>inode-based (ext2/3/4, XFS, APFS, UFS — Linux/Unix/macOS):</b> हर फ़ाइल का एक <b>inode</b> नंबर होता है जिसमें metadata व data-block के पते रहते हैं; <b>नाम inode में नहीं</b> — नाम directory entry में रहता है जो inode नंबर की ओर इशारा करता है। इसीलिए एक ही inode के कई नाम बन सकते हैं (<b>hard link</b>), और फ़ाइल खुली हो तो unlink करने पर भी जगह तब तक नहीं छूटती जब तक आख़िरी handle बंद न हो।</li>
      </ul>
      <p><b>Journaling</b> का अर्थ: बदलाव करने से पहले उसका इरादा एक log में लिख देना। बिजली बीच में गई तो अगली बार log देखकर आधा-अधूरा बदलाव पूरा या वापस किया जा सकता है — फ़ाइल सिस्टम corrupt नहीं होता। FAT में यह नहीं है, इसीलिए बिजली जाने पर pen drive ज़्यादा बिगड़ती है।</p>` },

    { type: 'table', head: ['फ़ाइल सिस्टम', 'कहाँ आम', 'अधिकतम फ़ाइल आकार', 'अधिकतम volume', 'Journaling', 'Permission/ACL', 'ख़ास बात / सीमा'],
      rows: [
        ['FAT32', 'Pen drive, memory card, पुराने Windows', '<b>4 GB − 1 byte</b>', '2 TB (व्यवहार में 32 GB तक format आसान)', 'नहीं', 'नहीं', 'हर OS/कैमरा/TV पढ़ लेता है; 4 GB से बड़ी फ़ाइल नहीं रख सकते'],
        ['exFAT', 'बड़ी SD card, external SSD,cross-platform', 'बहुत बड़ी (16 EB सैद्धांतिक)', 'बहुत बड़ा', 'नहीं (पर चेकसum है)', 'नहीं', 'FAT32 की 4 GB सीमा हल; Windows+macOS दोनों पढ़ते-लिखते हैं'],
        ['NTFS', 'Windows की आंतरिक disk', '16 EB − 1 KB (व्यवहार में बहुत बड़ा)', '256 TB तक (implementation अनुसार)', '<b>हाँ</b>', '<b>हाँ (ACL)</b>', 'compression, EFS encryption, quota, hard link, shadow copy'],
        ['ext4', 'Linux की आंतरिक disk', '16 TB', '1 EB', '<b>हाँ</b>', 'हाँ (POSIX + ACL)', 'extents से कम fragmentation; Linux का मानक'],
        ['XFS', 'बड़े Linux सर्वर, RHEL डिफ़ॉल्ट', '8 EB', '8 EB', 'हाँ', 'हाँ', 'बहुत बड़े volume व parallel I/O में तेज़; छोटा करना मुश्किल'],
        ['Btrfs', 'Linux (SUSE/Fedora), NAS', '16 EB', '16 EB', 'हाँ (CoW)', 'हाँ', 'snapshot, checksum, built-in RAID, compression — आधुनिक'],
        ['ZFS', 'NAS/सर्वर (Solaris, FreeBSD, Linux)', '16 EB', '256 ZB', 'हाँ (CoW)', 'हाँ', 'end-to-end checksum, self-healing, snapshot, RAID-Z; RAM ज़्यादा चाहिए'],
        ['APFS', 'macOS, iOS', '8 EB', '8 EB', 'हाँ (CoW)', 'हाँ', 'SSD के लिए बना; snapshot, cloning, encryption, space sharing'],
        ['ISO 9660 / UDF', 'CD/DVD/Blu-ray', '4 GB (ISO level 3 से कम सीमा)', 'डिस्क आकार तक', 'नहीं', 'नहीं', 'optical media का मानक; UDF बड़ी फ़ाइल के लिए']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.6</span> Partition, Format और sector/cluster/block — शब्दों का सही अर्थ</h3>
      <ul>
        <li><b>Partition (विभाजन):</b> एक भौतिक disk को तार्किक टुकड़ों में बाँटना — हर टुकड़ा OS को अलग disk जैसा दिखता है (Windows में C:, D:; Linux में /dev/sda1, /dev/sda2)। partition की जानकारी disk के शुरू में <b>partition table</b> में रहती है — पुराना <b>MBR</b> (अधिकतम 4 primary partition, 2 TB तक disk) या आधुनिक <b>GPT</b> (128 partition, 2 TB से बहुत बड़ी disk, backup table)। UEFI बूट के लिए GPT चाहिए।</li>
        <li><b>Format (फ़ॉर्मेट):</b> partition पर <b>फ़ाइल सिस्टम बनाना</b> — खाली नक़्शा, खाली-जगह सूची और root directory तैयार करना। <b>Quick format</b> केवल नक़्शा नया बनाता है (डेटा के byte पड़े रहते हैं, इसीलिए recovery हो जाती है); <b>Full format</b> में सेक्टर-जाँच भी होती है। ध्यान दें — "format" शब्द दो अर्थों में चलता है: (a) फ़ाइल सिस्टम बनाना, (b) disk को पूरी तरह मिटाना। परीक्षा में पहला अर्थ सही है।</li>
        <li><b>Sector (सेक्टर):</b> disk का सबसे छोटा भौतिक पढ़ने/लिखने वाला टुकड़ा — पुराने HDD में <b>512 byte</b>, आधुनिक <b>Advanced Format में 4096 byte (4K)</b>। SSD में इसे <b>page</b> कहते हैं (आम तौर पर 4–16 KB), और मिटाने की इकाई <b>block</b> होती है (कई page का समूह, जैसे 1–8 MB) — यही SSD की सबसे बड़ी असंगति है।</li>
        <li><b>Cluster / Allocation unit (Windows) या Block (Linux):</b> फ़ाइल सिस्टम का सबसे छोटा आवंटन-टुकड़ा, जो कई sector का बना होता है (आम तौर पर <b>4 KB</b>)। फ़ाइल चाहे 1 byte की हो, उसे पूरा cluster मिलेगा — बचा हुआ बेकार जाता है, इसे <b>slack space / internal fragmentation</b> कहते हैं। इसीलिए हज़ारों छोटी फ़ाइलें अपेक्षा से ज़्यादा जगह दिखाती हैं ("size" बनाम "size on disk")।</li>
      </ul>
      <p><b>SSD का ख़ास नियम:</b> flash में लिखने से पहले मिटाना पड़ता है, और मिटाना केवल पूरे block में होता है। इसलिए SSD अंदर ही अदला-बदली करता है — <b>FTL (Flash Translation Layer)</b> तार्किक पते को असली physical page पर map करता है, <b>wear leveling</b> से सब block बराबर घिसते हैं, और <b>TRIM</b> कमांड से OS बताता है कि कौन-से पते अब बेकार हैं ताकि SSD उन्हें पहले से साफ़ रख सके। TRIM न मिले तो SSD समय के साथ धीमा हो जाता है।</p>` },

    { type: 'table', head: ['शब्द', 'किस स्तर पर', 'typical आकार', 'कौन तय करता है', 'उदाहरण / नतीजा'],
      rows: [
        ['Sector', 'भौतिक disk (HDD)', '512 B या 4096 B (4K AF)', 'निर्माता', 'disk का सबसे छोटा पढ़ने योग्य हिस्सा'],
        ['Page (SSD)', 'भौतिक NAND', '4–16 KB', 'निर्माता', 'लिखने/पढ़ने की इकाई'],
        ['Block (SSD erase)', 'भौतिक NAND', '1–8 MB (कई page)', 'निर्माता', 'मिटाने की इकाई — इसीलिए write-amplification'],
        ['Cluster / Allocation unit', 'फ़ाइल सिस्टम (Windows)', '4 KB आम (512 B–64 KB चुन सकते)', 'format करते समय', '1 byte फ़ाइल भी 4 KB घेरेगी → slack space'],
        ['Block', 'फ़ाइल सिस्टम (Linux ext4)', '4 KB आम', 'mkfs करते समय', 'inode इसी के पते रखता है'],
        ['Extent', 'आधुनिक फ़ाइल सिस्टम', 'लगातार कई block', 'फ़ाइल सिस्टम', 'ext4/NTFS में बड़ी फ़ाइल के लिए कम metadata, तेज़'],
        ['Partition', 'पूरी disk', 'GB–TB', 'user / installer', 'C:, D: या /dev/sda1'],
        ['Volume', 'तार्किक इकाई', 'एक या कई partition/disk', 'OS / LVM / RAID', 'dynamic disk, LVM LV, RAID array']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.7</span> Fragmentation, Defrag और TRIM — disk धीमी क्यों होती है</h3>
      <p><b>Fragmentation (खंडन)</b> दो तरह का होता है। <b>External fragmentation</b> — एक फ़ाइल के टुकड़े disk पर अलग-अलग जगह बिखर जाना। HDD में पढ़ने वाले हेड को बार-बार खिसकना पड़ता है (seek), इसलिए फ़ाइल धीमी खुलती है। <b>Internal fragmentation</b> — cluster के अंदर बची खाली जगह (ऊपर 3.6)।</p>
      <p><b>Defragmentation</b> फ़ाइल के टुकड़ों को जोड़कर लगातार जगह पर रख देता है और खाली जगह भी एक तरफ़ समेट देता है — इससे HDD की sequential गति सुधरती है। Windows में "Defragment and Optimize Drives" (<code>dfrgui</code>), Linux में <code>e4defrag</code>।</p>
      <p><b>SSD को defrag नहीं करना चाहिए।</b> SSD में कोई हेड नहीं खिसकता, इसलिए बिखराव से गति पर फ़र्क़ नहीं पड़ता; उलटा defrag में बहुत सारी बेकार की writes होती हैं जो flash की उम्र घटाती हैं। SSD के लिए सही काम है <b>TRIM</b> — Windows इसे "Optimize" कहकर हफ़्ते में चलाता है (HDD पर defrag, SSD पर retrim — नाम एक, काम अलग)। Linux में <code>fstrim -av</code> या <code>fstrim.timer</code>।</p>
      <p><b>SSD धीमा होने के असली कारण:</b> (1) बहुत भर जाना — 80–90% से ऊपर खाली block कम पड़ने लगते हैं, write-amplification बढ़ती है; (2) TRIM बंद/न चलना; (3) गर्मी से thermal throttling; (4) DRAM-less/सस्ते controller; (5) पुराना SATA केबल/port जो NVMe की गति नहीं दे सकता। <b>नियम:</b> SSD को कम-से-कम 10–20% खाली रखिए।</p>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.8</span> फ़ाइल-संचालन और अनुमति — create, read, write, delete</h3>
      <p>फ़ाइल सिस्टम प्रोग्राम को जो बुनियादी काम देता है उन्हें <b>file operations</b> कहते हैं। प्रोग्राम पहले फ़ाइल <b>open</b> करता है तो OS एक <b>file descriptor / handle</b> (एक नंबर) देता है और बताता है कि अगला पढ़ना/लिखना कहाँ से होगा (<b>file pointer / offset</b>)। फिर read/write उसी handle पर होते हैं, और अंत में <b>close</b> करने पर बफ़र का बचा डेटा disk पर जाता है। इसीलिए "save करके भी फ़ाइल अधूरी" तब दिखती है जब प्रोग्राम crash हो जाए और close न हो पाए।</p>
      <p><b>Delete का असली अर्थ:</b> सामान्य delete केवल <b>नाम/निर्देशिका-entry हटाता है और जगह को "खाली" बता देता है</b> — डेटा के byte तब तक पड़े रहते हैं जब तक कोई नई फ़ाइल उस जगह पर न लिख दे। इसीलिए (a) Recycle Bin/Trash में जाने से फ़ाइल वापस आती है, (b) Bin खाली करने के बाद भी recovery software (Recuva, PhotoRec, TestDisk) से फ़ाइल मिल सकती है, और (c) <b>फ़ाइल हटाने का सुरक्षित तरीक़ा</b> है उस जगह पर बेकार डेटा लिख देना (shred / cipher /w) या पूरा disk encryption करके key मिटा देना। SSD पर overwrite भरोसेमंद नहीं (FTL/wear-leveling पुराने page कहीं और रख सकता है) — वहाँ <b>Secure Erase / crypto-erase</b> ही सही है।</p>
      <p><b>अनुमति (permission):</b> Linux/Unix में तीन श्रेणियाँ (owner, group, others) × तीन अधिकार (read=4, write=2, execute=1) — इसी से <code>chmod 755</code> बनता है; साथ में ownership <code>chown</code>, और विशेष bit <b>SUID/SGID/sticky</b>। Windows NTFS में <b>ACL (Access Control List)</b> — हर user/group के लिए अलग-अलग allow/deny entry, inheritance के साथ; "Deny" हमेशा "Allow" पर हावी होता है।</p>` },

    { type: 'table', head: ['काम', 'अर्थ', 'Windows (CMD/Explorer)', 'Linux (terminal)', 'ध्यान रखें'],
      rows: [
        ['Create', 'नई खाली फ़ाइल बनाना', '<code>type nul > a.txt</code> / New ▸ Text Document', '<code>touch a.txt</code>', 'नाम पहले से हो तो overwrite न हो जाए'],
        ['Open / Read', 'फ़ाइल खोलकर पढ़ना', '<code>type a.txt</code> / Notepad', '<code>cat a.txt</code>, <code>less a.txt</code>', 'बड़ी फ़ाइल में less/head/tail बेहतर'],
        ['Write / Truncate', 'नया डेटा लिखना (पुराना मिटाकर)', '<code>echo hello > a.txt</code>', '<code>echo hello > a.txt</code>', '<b>></b> मिटाकर लिखता है'],
        ['Append', 'अंत में जोड़ना (पुराना बना रहे)', '<code>echo more >> a.txt</code>', '<code>echo more >> a.txt</code>', '<b>>></b> जोड़ता है — एक > और दो > का फ़र्क़ याद रखें'],
        ['Copy / Move / Rename', 'नक़ल / स्थान बदल / नाम बदल', '<code>copy</code>, <code>move</code>, <code>ren</code>', '<code>cp</code>, <code>mv</code>', 'mv एक ही disk पर केवल नाम बदलता है, डेटा नहीं खिसकता'],
        ['Delete', 'entry हटाना, जगह खाली बताना', '<code>del</code> / Delete (Bin में)', '<code>rm</code> (सीधा, Bin नहीं)', 'rm वापसी नहीं — सावधानी; rm -rf सबसे ख़तरनाक'],
        ['Undelete / Restore', 'Bin से वापस', 'Recycle Bin ▸ Restore', 'Trash से, या <code>photorec</code>/<code>testdisk</code>', 'जितनी जल्दी, उतनी बेहतर — नई writes से जगह पट सकती है'],
        ['Attribute / Permission', 'गुण व अधिकार बदलना', '<code>attrib +r +h</code>, Properties ▸ Security', '<code>chmod</code>, <code>chown</code>, <code>ls -l</code>', 'execute bit के बिना script नहीं चलेगी'],
        ['Search', 'फ़ाइल/अंदर का पाठ ढूँढ़ना', '<code>dir /s</code>, Explorer search', '<code>find</code>, <code>grep -r</code>', 'नाम से find, अंदर के पाठ से grep'],
        ['Link / Shortcut', 'दूसरा नाम/इशारा', 'Shortcut (.lnk), <code>mklink</code>', '<code>ln</code> (hard), <code>ln -s</code> (symbolic)', 'hard link = वही inode; symbolic = अलग फ़ाइल जो पता रखती है']
      ] },

    { type: 'code', code: `# ---------- Path के दोनों रूप (Windows और Linux) ----------

# Windows — absolute (जड़ से पूरा)
C:\\Users\\Ram\\Documents\\notes.txt
D:\\Lab\\data\\marks.csv
\\\\server\\share\\file.txt          # UNC path (network)

# Windows — relative (वर्तमान फ़ोल्डर से)
notes.txt                          # यहीं
Documents\\notes.txt               # नीचे वाले फ़ोल्डर में
..\\notes.txt                      # एक स्तर ऊपर
..\\..\\lab\\a.txt                   # दो स्तर ऊपर, फिर lab में
.\\notes.txt                       # "." = वर्तमान फ़ोल्डर

# Linux — absolute
/home/ram/documents/notes.txt
/etc/passwd
/mnt/usb/marks.csv

# Linux — relative
notes.txt
documents/notes.txt
../notes.txt
../../lab/a.txt
./script.sh                        # "./" ज़रूरी — वर्तमान फ़ोल्डर PATH में नहीं होता

# विशेष चिह्न
~                                  # home directory (/home/ram या C:\\Users\\Ram)
-                                  # पिछला फ़ोल्डर (cd -)
*                                  # कोई भी कई अक्षर (glob)
?                                  # ठीक एक अक्षर

# फ़ाइल की असली पहचान देखना (extension से नहीं, magic bytes से)
# Linux:
file photo.jpg                     # JPEG image data ...
xxd -l 16 photo.jpg                # पहले 16 byte hex में
# Windows PowerShell:
Get-Content .\\photo.jpg -AsByteStream -TotalCount 16 | ForEach-Object { '{0:X2}' -f $_ }

# आकार बनाम disk पर आकार (slack space देखना)
# Linux:
ls -l a.txt                        # logical size
du -h a.txt                        # disk usage (cluster/block के गुणज में)
du -sh --apparent-size folder      # logical कुल
# Windows:
fsutil volume diskfree C:
# Explorer में Properties → "Size" और "Size on disk" अलग दिखेंगे

# फ़ाइल सिस्टम कौन-सा है
# Linux:
df -Th                             # type सहित
lsblk -f
# Windows:
fsutil fsinfo volumeinfo C:
Get-Volume | Format-Table DriveLetter, FileSystem, SizeRemaining, Size` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">3.9</span> Backup और Recovery — 3-2-1 नियम</h3>
      <p>Storage चाहे कितना भरोसेमंद हो, <b>वह backup नहीं है</b>। RAID भी backup नहीं — वह disk ख़राब होने से बचाता है, ग़लती से मिटाने/रैंसमवेयर/चोरी/आग से नहीं। असली backup की कसौटी यह है कि <b>मूल के नष्ट होने पर भी एक अलग, पुरानी प्रति मौजूद हो</b>।</p>
      <p><b>3-2-1 नियम:</b> डेटा की <b>3</b> प्रतियाँ रखो, <b>2</b> अलग-अलग माध्यम पर (जैसे आंतरिक SSD + external HDD), और <b>1</b> प्रति <b>off-site</b> (दूसरी इमारत/cloud)। आधुनिक विस्तार <b>3-2-1-1-0</b> है — एक प्रति <b>offline/immutable</b> (रैंसमवेयर उसे बदल न सके) और restore की जाँच में <b>0</b> त्रुटियाँ।</p>
      <p><b>Backup के प्रकार:</b> <b>Full</b> — सब कुछ, सबसे बड़ा व धीमा, restore सबसे आसान। <b>Incremental</b> — पिछले <i>किसी भी</i> backup के बाद से बदला हुआ; रोज़ का सबसे छोटा, पर restore में full + सारे incremental चाहिए। <b>Differential</b> — पिछले <i>full</i> के बाद से बदला हुआ; आकार बढ़ता जाता है, restore में full + आख़िरी differential चाहिए।</p>
      <p><b>जो backup कभी restore करके नहीं देखा, वह backup नहीं है।</b> समय-समय पर एक फ़ाइल वापस निकालकर मिलाइए। साथ में <b>RPO</b> (कितना डेटा खोना स्वीकार है — यानी कितनी बार backup) और <b>RTO</b> (कितनी देर में वापस चालू होना है) तय कीजिए; यही backup की आवृत्ति और माध्यम तय करते हैं।</p>` },

    { type: 'table', head: ['प्रकार', 'क्या सहेजता है', 'आकार / समय', 'Restore में क्या चाहिए', 'कब चुनें'],
      rows: [
        ['Full (पूर्ण)', 'हर चुनी हुई फ़ाइल, हर बार', 'सबसे बड़ा, सबसे धीमा', 'केवल वही एक backup', 'हफ़्ते/महीने में एक बार; आधार'],
        ['Incremental (वृद्धिशील)', 'पिछले किसी backup के बाद का बदलाव', 'सबसे छोटा, सबसे तेज़', 'Full + <b>सारे</b> incremental क्रम से', 'रोज़, जब जगह/समय कम हो'],
        ['Differential (अंतरात्मक)', 'पिछले <b>full</b> के बाद का सारा बदलाव', 'बढ़ता जाता है', 'Full + <b>आख़िरी</b> differential', 'रोज़, जब restore आसान चाहिए'],
        ['Mirror / Sync', 'जैसा है वैसा ही दूसरी जगह', 'बराबर', 'वही प्रति', 'तेज़ पहुँच — पर ग़लती/मिटाव भीsync हो जाता है, इसलिए backup नहीं'],
        ['Snapshot', 'उस क्षण की स्थिति (CoW)', 'केवल बदलाव', 'मूल volume + snapshot chain', 'बदलाव से पहले तुरंत वापसी (VM, Btrfs/ZFS)'],
        ['Versioned / Immutable', 'हर बदलाव का पुराना संस्करण, लॉक', 'बढ़ता है', 'कोई भी पुराना संस्करण', 'रैंसमवेयर व ग़लत-सुधार से बचाव'],
        ['Cloud backup', 'off-site प्रति, अक्सर versioned', 'अपलोड bandwidth पर निर्भर', 'provider का software/key', '3-2-1 का "1 off-site" हिस्सा']
      ] },

    { type: 'acc', title: 'FAQ — डेटा, मेमोरी व फ़ाइल सिस्टम', items: [
      { q: 'कंप्यूटर बंद करने से पहले save क्यों ज़रूरी है?', a: 'क्योंकि खुली फ़ाइल का बदला हुआ डेटा <b>RAM (volatile)</b> में है। Save करने पर वह disk/SSD (non-volatile) पर लिखा जाता है। बिजली गई या प्रोग्राम बंद हुआ तो RAM का डेटा मिट जाएगा। Auto-save और AutoRecover इसी जोखिम को कम करते हैं।'},
      { q: 'Cache और RAM में क्या फ़र्क़ है?', a: 'दोनों volatile व तेज़ हैं, पर <b>cache SRAM</b> का बना, CPU के बहुत पास/अंदर, बहुत छोटा और बहुत तेज़ है — यह RAM के बार-बार वाले हिस्से की नक़ल रखता है। <b>RAM DRAM</b> का बना, बड़ा, तुलना में धीमा, और पूरा चल रहा प्रोग्राम रखता है। cache hardware खुद सँभालता है; RAM का प्रबंधन OS करता है।'},
      { q: 'फ़ाइल का extension बदल दूँ तो प्रकार बदल जाएगा?', a: 'नहीं। Extension केवल OS को बताता है कि <b>किस प्रोग्राम से खोलना है</b>। असली प्रकार फ़ाइल के अंदर के byte (magic number) तय करते हैं। <code>.jpg</code> को <code>.txt</code> करने पर वह text नहीं बनती — Notepad में अजीब चिह्न दिखेंगे। उलटा, सही प्रोग्राम extension देखकर भीतर का रूप पहचानकर खोल सकता है।'},
      { q: 'Pen drive में 5 GB की फ़ाइल क्यों नहीं जाती?', a: 'क्योंकि वह <b>FAT32</b> में format है और FAT32 की अधिकतम फ़ाइल-सीमा <b>4 GB − 1 byte</b> है। हल: drive को <b>exFAT</b> (Windows+macOS दोनों के लिए) या <b>NTFS</b> (केवल Windows के लिए बेहतर) में format कीजिए — पहले डेटा का backup लें, क्योंकि format से नक़्शा नया बनता है।'},
      { q: 'Quick format और full format में फ़र्क़?', a: '<b>Quick format</b> केवल फ़ाइल सिस्टम का नक़्शा (खाली-जगह सूची, root directory) नया बनाता है — पुराने byte पड़े रहते हैं, इसलिए recovery संभव है और काम सेकंडों में होता है। <b>Full format</b> में सेक्टर-जाँच भी होती है (और आधुनिक Windows में शून्य लिखा जाता है), इसलिए बहुत धीमा। disk बेचने/दान करने से पहले quick format काफ़ी नहीं — secure erase/encryption चाहिए।'},
      { q: 'डिलीट की हुई फ़ाइल वापस कैसे आ जाती है?', a: 'Delete केवल <b>नाम की entry हटाता है और जगह "खाली" घोषित करता है</b>; डेटा के byte तब तक रहते हैं जब तक उन पर नया डेटा न लिखा जाए। Recycle Bin/Trash में तो फ़ाइल जाती ही है। Bin खाली करने के बाद भी PhotoRec/Recuva/TestDisk उन byte को पहचानकर जोड़ सकते हैं — शर्त यह कि उस जगह पर overwrite न हुआ हो। इसीलिए ग़लती से मिटने पर तुरंत उस disk पर लिखना बंद कर दें।'},
      { q: 'SSD को defrag क्यों नहीं करना चाहिए?', a: 'SSD में कोई घूमने वाला हेड नहीं, इसलिए टुकड़ों के बिखराव से गति नहीं गिरती। defrag में बेकार की बहुत सारी writes होती हैं जो flash की सीमित write-उम्र घटाती हैं। SSD के लिए सही काम <b>TRIM</b> है — Windows "Optimize" में SSD पर retrim ही करता है। Linux: <code>fstrim -av</code>।'},
      { q: '1 byte की फ़ाइल 4 KB जगह क्यों दिखाती है?', a: 'फ़ाइल सिस्टम जगह <b>cluster/block</b> (आम तौर पर 4 KB) के पूरे टुकड़ों में देता है, आधे में नहीं। 1 byte को भी पूरा cluster मिलता है; बची जगह बेकार जाती है — इसे <b>slack space / internal fragmentation</b> कहते हैं। इसीलिए Explorer में "Size" और "Size on disk" अलग दिखते हैं, और हज़ारों छोटी फ़ाइलें ज़्यादा जगह लेती हैं।'},
      { q: 'RAID क्या backup है?', a: 'नहीं। RAID (1/5/6 आदि) disk ख़राब होने पर भी सेवा चालू रखता है — यह <b>availability</b> है। पर ग़लती से फ़ाइल मिटाना, रैंसमवेयर का encrypt करना, या आग/चोरी — इन सबसे RAID नहीं बचाता, क्योंकि बदलाव तुरंत सब disk परsync हो जाता है। Backup अलग, पुरानी, off-site प्रति है।'},
      { q: 'MBR और GPT में क्या चुनें?', a: '<b>GPT</b> चुनें — 2 TB से बड़ी disk, 128 तक partition, partition table की backup प्रति, और UEFI बूट के लिए अनिवार्य। <b>MBR</b> केवल पुराने BIOS/legacy बूट या 2 TB से छोटी disk के लिए। ध्यान दें: MBR से GPT बदलने पर आम तौर पर disk का डेटा मिटता है (Windows का mbr2gpt कुछ स्थिति में बिना मिटाए कर देता है) — पहले backup।'},
      { q: 'inode और MFT एक ही चीज़ हैं?', a: 'विचार एक जैसा है — दोनों "हर फ़ाइल का metadata + डेटा-पतों वाला record" हैं। पर <b>NTFS का MFT</b> एक केंद्रीय तालिका है जिसमें नाम भी रहता है और छोटी फ़ाइल का डेटा भी वहीं रह सकता है (resident)। <b>ext4 का inode</b> नाम नहीं रखता — नाम directory entry में होता है जो inode नंबर की ओर इशारा करता है; इसीलिए hard link आसान है।'},
      { q: 'RAM बढ़ाने से कंप्यूटर तेज़ होता है या SSD से?', a: 'निर्भर करता है कि कमी कहाँ है। RAM कम हो तो OS बार-बार disk पर <b>swap/page file</b> करता है — तब RAM बढ़ाना सबसे बड़ा लाभ देता है। RAM पर्याप्त हो पर disk धीमी (HDD) हो तो SSD में बदलना सबसे बड़ा लाभ देता है। Task Manager/Resource Monitor में Memory व Disk का उपयोग देखकर तय कीजिए, अंदाज़े से नहीं।'}
    ] },

    { type: 'labs', items: [
      { n: 110, title: 'Size बनाम Size on disk — slack space नापना', aim: 'cluster के कारण logical आकार और disk पर घेरी जगह का फ़र्क़ प्रत्यक्ष देखना।',
        tools: ['Windows Explorer या Linux terminal', 'एक खाली test फ़ोल्डर', 'नोटबुक'],
        steps: ['एक फ़ोल्डर में 1 byte की फ़ाइल बनाइए (Linux: <code>printf x > tiny.txt</code>; Windows: Notepad में एक अक्षर)।', 'Windows में Properties खोलकर <b>Size</b> और <b>Size on disk</b> दोनों लिखिए। Linux में <code>ls -l tiny.txt</code> और <code>du -h tiny.txt</code>।', 'अब उसी फ़ोल्डर में 100 छोटी फ़ाइलें बनाइए (एक loop से) और कुल "size on disk" नापिए।', 'गणना कीजिए: 100 × cluster-size कितना बना, और असली डेटा कितना था।', 'निष्कर्ष लिखिए: हज़ारों छोटी फ़ाइलों वाली परियोजना में जगह क्यों फूलती है और ZIP बनाने से क्यों बचत होती है।'],
        result: 'दोनों आकारों की तुलना-तालिका और slack space की गणना; cluster का व्यावहारिक असर समझ में आना।' },
      { n: 111, title: 'फ़ाइल की असली पहचान magic bytes से करना', aim: 'extension पर भरोसा न करके फ़ाइल के पहले byte से प्रकार पहचानना।',
        tools: ['Linux/WSL (<code>file</code>, <code>xxd</code>) या PowerShell', 'चार नमूना फ़ाइलें — .txt, .jpg, .png, .pdf, .zip', 'नोटबुक'],
        steps: ['हर फ़ाइल के पहले 16 byte hex में देखिए (<code>xxd -l 16 file</code> या PowerShell का byte-read)।', 'पहचान मिलाइए: PDF = <code>25 50 44 46</code> (%PDF), PNG = <code>89 50 4E 47</code>, JPEG = <code>FF D8 FF</code>, ZIP = <code>50 4B</code>।', 'एक .jpg का नाम बदलकर .txt कर दीजिए और <code>file</code> कमांड से पूछिए — वह अभी भी JPEG बताएगा।', 'नाम वापस सही कीजिए और फ़ाइल खोलकर पुष्टि कीजिए।', 'एक .docx को .zip नाम देकर खोलिए — अंदर XML फ़ोल्डर दिखेंगे; लिखिए कि Office फ़ाइलें असल में ZIP क्यों हैं।'],
        result: 'चारों signature की सूची, extension बदलने पर भी प्रकार न बदलने का प्रमाण, और docx = ZIP का प्रत्यक्ष अनुभव।' },
      { n: 112, title: 'फ़ाइल सिस्टम पहचानना और सही चुनाव करना', aim: 'अपनी disk/pen drive का फ़ाइल सिस्टम देखकर उसकी सीमाएँ बताना और ज़रूरत के हिसाब से चुनाव करना।',
        tools: ['Windows (<code>fsutil</code>/Get-Volume) या Linux (<code>df -Th</code>, <code>lsblk -f</code>)', 'एक pen drive या external disk', 'यह पेज की फ़ाइल-सिस्टम टेबल'],
        steps: ['अपनी आंतरिक disk और एक removable drive का फ़ाइल सिस्टम पता कीजिए और लिखिए।', 'हर एक के लिए तीन सीमाएँ लिखिए: अधिकतम फ़ाइल आकार, journaling है या नहीं, permission है या नहीं।', 'तीन स्थितियाँ लीजिए — (a) 8 GB की वीडियो फ़ाइल pen drive से TV में चलानी है, (b) Windows व macOS दोनों में लिखना-पढ़ना है, (c) Linux सर्वर का डेटा। हर स्थिति के लिए फ़ाइल सिस्टम चुनकर कारण लिखिए।', 'यदि drive खाली है तो exFAT में format करके 4 GB से बड़ी एक फ़ाइल रखकर जाँचिए (पहले डेटा का backup)।', 'अंत में लिखिए: FAT32 की 4 GB सीमा किस स्थिति में सबसे पहले टकराती है।'],
        result: 'अपनी disk का फ़ाइल-सिस्टम विवरण, तीन स्थितियों का कारण-सहित चुनाव, और बड़ी फ़ाइल रखकर सीमा-परीक्षण।' }
    ] },

    { type: 'quiz', store: 'sci-data', items: [
      { q: 'डेटा और सूचना में सही फ़र्क़ क्या है?', o: ['दोनों एक ही हैं', 'डेटा कच्चे तथ्य हैं; सूचना सन्दर्भ व अर्थ वाला संगठित डेटा', 'सूचना कच्ची होती है', 'डेटा केवल अंक होते हैं'], a: 1, ex: 'अकेला "38" डेटा है; "रोगी का तापमान 38°C = बुख़ार" सूचना है। सूचना से निकला नियम ज्ञान कहलाता है।' },
      { q: 'IPOS cycle का सही क्रम क्या है?', o: ['Input → Process → Output → Storage', 'Input → Output → Process → Storage', 'Process → Input → Storage → Output', 'Storage → Output → Input → Process'], a: 0, ex: 'डेटा अंदर आता है (input), CPU बदलता है (process), नतीजा दिखता है (output), और सहेजा जाता है (storage)।' },
      { q: 'मेमोरी पदानुक्रम में सबसे तेज़ कौन-सी है?', o: ['RAM', 'SSD', 'CPU Register', 'Cache L3'], a: 2, ex: 'Register CPU के अंदर flip-flop से बने होते हैं और एक clock cycle में उपलब्ध हैं। क्रम: register → L1 → L2 → L3 → RAM → SSD → HDD → tape।' },
      { q: 'कौन-सी मेमोरी volatile है?', o: ['ROM', 'SSD', 'RAM', 'HDD'], a: 2, ex: 'RAM, cache और register बिजली जाते ही मान खो देते हैं। ROM, flash, HDD, optical, tape non-volatile हैं।' },
      { q: 'DRAM में "Dynamic" शब्द क्यों है?', o: ['बहुत तेज़ है', 'capacitor का आवेश लीक होने से बार-बार refresh करना पड़ता है', 'आकार बदलता है', 'बिजली के बिना चलती है'], a: 1, ex: 'DRAM capacitor में bit रखता है और हर कुछ ms में refresh चाहिए। SRAM flip-flop पर बना है, refresh नहीं चाहिए — इसीलिए वह cache में लगता है।' },
      { q: 'FAT32 की अधिकतम फ़ाइल-आकार सीमा क्या है?', o: ['2 GB', '4 GB − 1 byte', '16 GB', 'कोई सीमा नहीं'], a: 1, ex: 'FAT32 में एक फ़ाइल 4 GB से 1 byte कम तक ही हो सकती है। बड़ी फ़ाइल के लिए exFAT या NTFS चुनिए।' },
      { q: 'Windows की आंतरिक disk का मानक फ़ाइल सिस्टम कौन-सा है?', o: ['FAT16', 'ext4', 'NTFS', 'APFS'], a: 2, ex: 'NTFS में journaling, ACL permission, compression, EFS encryption और MFT मिलते हैं। ext4 Linux का, APFS macOS का मानक है।' },
      { q: 'Linux/ext4 में फ़ाइल का नाम कहाँ रहता है?', o: ['inode में', 'directory entry में, जो inode नंबर की ओर इशारा करती है', 'सुपर block में', 'boot sector में'], a: 1, ex: 'inode में metadata व data-block के पते होते हैं, नाम नहीं। इसीलिए एक inode के कई नाम (hard link) बन सकते हैं।' },
      { q: 'Journaling का लाभ क्या है?', o: ['फ़ाइल तेज़ खुलती है', 'बिजली बीच में जाने पर आधा बदलाव पूरा/वापस करके corruption से बचाव', 'जगह कम लगती है', 'permission मिलती है'], a: 1, ex: 'बदलाव से पहले इरादा log में लिखा जाता है। FAT में journaling नहीं है, इसीलिए अचानक बिजली जाने पर वह ज़्यादा बिगड़ता है।' },
      { q: 'SSD के लिए कौन-सा काम सही है?', o: ['रोज़ defrag', 'TRIM चलाना और कुछ जगह खाली रखना', 'हमेशा 100% भरकर रखना', 'cluster 512 byte करना'], a: 1, ex: 'SSD में हेड नहीं खिसकता, इसलिए defrag बेकार writes बढ़ाकर उम्र घटाता है। TRIM बेकार पते पहले से साफ़ कराता है; 10–20% खाली रखना चाहिए।' },
      { q: 'Delete करने पर असल में क्या होता है?', o: ['सारे byte तुरंत मिट जाते हैं', 'entry हटती है और जगह खाली बताई जाती है; byte तब तक रहते हैं जब तक overwrite न हो', 'फ़ाइल हमेशा के लिए नष्ट', 'disk format हो जाती है'], a: 1, ex: 'इसीलिए Recycle Bin से वापसी और recovery software संभव है। SSD पर सुरक्षित मिटाने के लिए Secure Erase/crypto-erase चाहिए, overwrite काफ़ी नहीं।' },
      { q: '3-2-1 backup नियम क्या कहता है?', o: ['3 disk, 2 RAID, 1 cloud', '3 प्रतियाँ, 2 अलग माध्यम, 1 off-site', '3 बार format, 2 बार जाँच', 'केवल 1 प्रति काफ़ी'], a: 1, ex: 'तीन प्रतियाँ, दो अलग माध्यम पर, एक प्रति दूसरी जगह (off-site/cloud)। विस्तार 3-2-1-1-0 में एक offline/immutable प्रति और शून्य restore-त्रुटि जोड़ी जाती है।' },
      { q: 'Incremental और Differential backup में फ़र्क़?', o: ['दोनों एक ही', 'Incremental पिछले किसी backup के बाद का; Differential पिछले full के बाद का सारा', 'Differential छोटा होता है', 'Incremental में केवल full चाहिए'], a: 1, ex: 'Incremental रोज़ सबसे छोटा पर restore में full + सारे incremental चाहिए। Differential बढ़ता जाता है पर restore में full + आख़िरी differential काफ़ी है।' },
      { q: '1 byte की फ़ाइल disk पर 4 KB क्यों घेरती है?', o: ['फ़ाइल सिस्टम की ख़राबी', 'आवंटन cluster/block (आम तौर पर 4 KB) के पूरे टुकड़ों में होता है', 'virus है', 'compression नहीं है'], a: 1, ex: 'बची जगह slack space / internal fragmentation कहलाती है। इसीलिए "Size" और "Size on disk" अलग दिखते हैं।' },
      { q: 'GPT को MBR पर क्यों चुना जाता है?', o: ['पुराना है इसलिए तेज़', '2 TB से बड़ी disk, 128 partition, backup table और UEFI बूट', 'केवल Linux पर चलता है', 'फ़ाइल सिस्टम है'], a: 1, ex: 'GPT partition table है (फ़ाइल सिस्टम नहीं)। MBR में 4 primary partition व 2 TB सीमा है; UEFI बूट के लिए GPT चाहिए।' },
      { q: 'क्या RAID backup का विकल्प है?', o: ['हाँ, पूरी तरह', 'नहीं — वह availability देता है, मिटाने/रैंसमवेयर/चोरी से नहीं बचाता', 'केवल RAID 1 backup है', 'RAID 0 सबसे सुरक्षित है'], a: 1, ex: 'RAID disk-failure सहन करता है पर ग़लती से मिटाव या encryption तुरंत सब disk परsync हो जाता है। Backup अलग पुरानी off-site प्रति है। RAID 0 में तो कोई redundancy ही नहीं।' }
    ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — डेटा, मेमोरी व फ़ाइल सिस्टम', html: '<p>पक्के प्रश्न: <b>Data ≠ Information</b> (कच्चा तथ्य बनाम अर्थपूर्ण); <b>IPOS cycle</b>; मेमोरी पदानुक्रम का क्रम — <b>Register → Cache(L1/L2/L3) → RAM → SSD → HDD → Tape</b> (गति घटती, आकार व सस्ती होती बढ़ती); <b>volatile</b> = RAM/cache/register, <b>non-volatile</b> = ROM/flash/HDD; <b>SRAM</b> = cache (तेज़, महँगा), <b>DRAM</b> = RAM (refresh चाहिए); <b>Primary</b> = RAM/ROM, <b>Secondary</b> = disk; <b>FAT32 सीमा 4 GB</b>, <b>NTFS</b> = Windows (MFT, journaling, ACL), <b>ext4</b> = Linux (inode), <b>APFS</b> = macOS; <b>sector 512 B/4 KB, cluster 4 KB</b>; <b>quick format</b> से recovery संभव; <b>SSD पर defrag नहीं, TRIM</b>; <b>3-2-1 backup</b>; RAID backup नहीं है।</p>' },

    { type: 'pills', items: [
      { text: 'Input → Process → Output → Storage', kind: 'info' },
      { text: 'Register > Cache > RAM > SSD > HDD (गति)', kind: 'tip' },
      { text: 'RAM volatile · ROM/SSD non-volatile', kind: 'warn' },
      { text: 'FAT32 = 4 GB सीमा · NTFS = Windows · ext4 = Linux', kind: 'exam' },
      { text: 'SSD: defrag नहीं, TRIM हाँ', kind: 'danger' },
      { text: 'Backup 3-2-1 · RAID backup नहीं', kind: 'ok' }
    ] }
  ]
}
]);

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
{
  id: 'sci-dcom', icon: '📡', group: 'कंप्यूटर विज्ञान',
  title: 'डेटा संचार और OSI मॉडल',
  sub: 'पाँच घटक, transmission modes व media, bandwidth/latency, सातों OSI परतें, encapsulation, TCP/IP, devices व topology',
  kicker: 'Computer Science 5 · Data Communication & the OSI Model',
  hero: 'एक कंप्यूटर से दूसरे तक डेटा <b>असल में कैसे पहुँचता है</b> — यह पेज उसकी पूरी शारीरिकी है। संचार के <b>पाँच घटक</b>, simplex/half-duplex/full-duplex, serial बनाम parallel, synchronous बनाम asynchronous, <b>transmission media</b> (twisted pair, coax, fibre, radio, microwave, satellite) की गति-दूरी-लागत तुलना, <b>bandwidth, throughput, latency, jitter, attenuation</b> के सही अर्थ, <b>OSI की सातों परतें</b> (काम, PDU, device, protocol), <b>encapsulation</b> चरण-दर-चरण, OSI बनाम TCP/IP, प्रमुख protocol व port, circuit/packet switching व multiplexing, network devices किस परत पर काम करते हैं, और छह topology के लाभ-हानि।',
  tags: ['पाँच घटक', 'MEDIA तुलना', 'OSI की 7 परतें', 'ENCAPSULATION', 'TCP/IP व PORT', 'TOPOLOGY'],
  blocks: [

    { type: 'callout', kind: 'info', title: 'इस पेज के बाद आप यह कर पाएँगे', html: '<ol><li>किसी भी संचार के पाँच घटक बता पाएँगे और simplex/half/full duplex में फ़र्क़ कर पाएँगे।</li><li>केबल/बेतार माध्यम की गति, दूरी, लागत और शोर-सहिष्णुता देखकर सही चुनाव कर पाएँगे।</li><li>bandwidth, throughput, latency और jitter को अलग-अलग परिभाषित कर पाएँगे।</li><li>OSI की सातों परतें क्रम में, उनका काम, PDU, device और protocol बता पाएँगे।</li><li>भेजते समय डेटा पर headers कैसे चढ़ते हैं (encapsulation) और पहुँचने पर कैसे उतरते हैं — समझा पाएँगे।</li><li>hub/switch/router किस परत पर काम करते हैं और इससे क्या फ़र्क़ पड़ता है — बता पाएँगे।</li></ol>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.1</span> डेटा संचार के पाँच घटक</h3>
      <p><b>Data communication</b> = दो या अधिक उपकरणों के बीच transmission medium से डिजिटल डेटा का आदान-प्रदान। कोई भी संचार हो — तार, फ़ाइबर, Wi-Fi या satellite — उसके <b>पाँच घटक</b> हमेशा मौजूद होते हैं:</p>
      <ol>
        <li><b>Message (संदेश)</b> — जो भेजा जा रहा है: पाठ, अंक, चित्र, ध्वनि, वीडियो, या सबका मिश्रण।</li>
        <li><b>Sender (प्रेषक)</b> — भेजने वाला उपकरण: कंप्यूटर, फ़ोन, कैमरा, sensor, सर्वर।</li>
        <li><b>Receiver (प्राप्तकर्ता)</b> — पाने वाला उपकरण: दूसरा कंप्यूटर, TV, printer, फ़ोन।</li>
        <li><b>Transmission medium (संचार माध्यम)</b> — भौतिक रास्ता: twisted-pair केबल, coaxial, optical fibre, या बेतार (radio wave, microwave, infrared)।</li>
        <li><b>Protocol (प्रोटोकॉल)</b> — नियमों का वह समूह जिस पर दोनों पक्ष सहमत हों: डेटा कैसे बँटेगा, किस क्रम में जाएगा, ग़लती कैसे पकड़ी/सुधारी जाएगी, बहाव कैसे नियंत्रित होगा, पहचान कैसे होगी। <b>Protocol के बिना दो उपकरण जुड़े तो रहेंगे, समझ नहीं पाएँगे</b> — जैसे दो लोग बिना साझा भाषा के।</li>
      </ol>
      <p>संचार की अच्छाई चार कसौटियों पर नापी जाती है: <b>Delivery</b> (सही प्राप्तकर्ता तक पहुँचा?), <b>Accuracy</b> (बिना बदले पहुँचा?), <b>Timeliness</b> (समय पर पहुँचा — वीडियो/ध्वनि में देरी बेकार), और <b>Jitter</b> (packet के पहुँचने के अंतराल में कितना उतार-चढ़ाव)।</p>` },

    { type: 'table', head: ['घटक', 'काम', 'उदाहरण', 'न हो तो क्या होगा'],
      rows: [
        ['Message', 'जानकारी का वह रूप जो भेजा जाए', 'email का पाठ, वीडियो की frame, sensor का मान', 'भेजने के लिए कुछ ही नहीं'],
        ['Sender', 'संदेश बनाकर माध्यम पर डालना', 'आपका laptop, IP कैमरा, सर्वर', 'संदेश उत्पन्न ही न होगा'],
        ['Receiver', 'संदेश ग्रहण करके अर्थ निकालना', 'दूसरा laptop, printer, फ़ोन', 'संदेश बेकार जाएगा'],
        ['Transmission medium', 'भौतिक रास्ता देना', 'Cat6 केबल, fibre, Wi-Fi का 2.4/5 GHz, satellite link', 'जुड़ाव ही नहीं'],
        ['Protocol', 'साझा नियम — packing, addressing, error, flow control', 'TCP/IP, HTTP, FTP, Ethernet, Wi-Fi (802.11)', 'दोनों जुड़े रहेंगे पर एक-दूसरे को समझ नहीं पाएँगे']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.2</span> संचार की दिशा और ढंग — modes</h3>
      <p><b>दिशा के आधार पर तीन modes:</b></p>
      <ul>
        <li><b>Simplex (एकदिशीय):</b> केवल एक दिशा में, हमेशा। एक सदा भेजता है, दूसरा सदा पाता है। उदाहरण — <b>keyboard → कंप्यूटर</b>, <b>कंप्यूटर → monitor/printer</b>, TV/रेडियो प्रसारण, पुराना pager। पूरा channel एक ही दिशा को मिलता है।</li>
        <li><b>Half-duplex (अर्ध-द्विदिशीय):</b> दोनों दिशा में, पर <b>एक समय में एक ही</b> — बोलने के लिए बटन दबाना पड़ता है। उदाहरण — <b>walkie-talkie</b>, पुराना hub वाला Ethernet, कुछ Wi-Fi स्थितियाँ। दिशा बदलने में समय लगता है (<b>turnaround time</b>), इसलिए क्षमता पूरी उपयोग नहीं होती।</li>
        <li><b>Full-duplex (पूर्ण द्विदिशीय):</b> दोनों दिशा में <b>एक साथ</b>। उदाहरण — <b>telephone/मोबाइल call</b>, आधुनिक switched Ethernet, fibre link। इसके लिए या तो दो अलग रास्ते चाहिए या एक ही रास्ते पर frequency/time बाँटना पड़ता है।</li>
      </ul>
      <p><b>भेजने के ढंग के आधार पर:</b> <b>Serial</b> — एक-एक bit एक ही रास्ते पर क्रम से (लंबी दूरी, सस्ता, कम तार; USB, SATA, PCIe, Ethernet सब serial हैं)। <b>Parallel</b> — कई bit एक साथ कई तारों पर (छोटी दूरी, तेज़ पर skew व crosstalk की समस्या; पुराना printer port, IDE/PATA, RAM bus)। आज लंबी दूरी व तेज़ गति दोनों में serial ही जीता है क्योंकि parallel में तारों के बीच timing मिलाना कठिन हो जाता है।</p>
      <p><b>Timing के आधार पर:</b> <b>Synchronous</b> — साझा clock से bit की तय दर, लगातार भेजना, तेज़ व कुशल (बड़े block)। <b>Asynchronous</b> — हर byte/character के साथ <b>start व stop bit</b>, बीच में खाली समय चल सकता है; सरल व सस्ता (पुराना serial/RS-232, keyboard)। <b>Isochronous</b> — समय-बद्ध, तय अंतराल पर (audio/video streaming, USB isochronous transfer)।</p>` },

    { type: 'table', head: ['आधार', 'प्रकार', 'कैसे काम', 'उदाहरण', 'लाभ / कमी'],
      rows: [
        ['दिशा', 'Simplex', 'सदा एक ही दिशा', 'Keyboard→PC, TV broadcast, monitor', 'पूरा channel एक दिशा को; वापसी का रास्ता नहीं'],
        ['दिशा', 'Half-duplex', 'दोनों दिशा, बारी-बारी', 'Walkie-talkie, पुराना hub Ethernet', 'एक channel काफ़ी; turnaround time से क्षमता घटती है'],
        ['दिशा', 'Full-duplex', 'दोनों दिशा एक साथ', 'Telephone, switched Ethernet, fibre', 'सबसे कुशल; दो रास्ते या बाँटवारा चाहिए'],
        ['क्रम', 'Serial', 'bit एक-एक करके एक रास्ते पर', 'USB, SATA, PCIe, Ethernet, RS-232', 'कम तार, लंबी दूरी, आज सबसे तेज़ links'],
        ['क्रम', 'Parallel', 'कई bit एक साथ कई तारों पर', 'पुराना LPT printer port, IDE/PATA, memory bus', 'छोटी दूरी पर तेज़; skew/crosstalk से लंबी दूरी मुश्किल'],
        ['Timing', 'Synchronous', 'साझा clock, लगातार block', 'SONET/SDH, Ethernet, बड़े data links', 'तेज़ व कुशल; clock-sync ज़रूरी'],
        ['Timing', 'Asynchronous', 'हर character के साथ start/stop bit', 'RS-232 serial, keyboard, पुराना modem', 'सरल, सस्ता; overhead ज़्यादा, धीमा'],
        ['Timing', 'Isochronous', 'तय अंतराल पर, समय-बद्ध', 'USB audio/video, live streaming', 'देरी की गारंटी; error सुधार सीमित']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.3</span> Transmission media — तार वाले और बेतार</h3>
      <p>माध्यम दो परिवारों में बँटे हैं: <b>Guided (बद्ध/तार वाले)</b> — संकेत एक ठोस रास्ते में बँधा रहता है; <b>Unguided (अबद्ध/बेतार)</b> — संकेत खुले आकाश में फैलता है, कोई भौतिक रास्ता नहीं।</p>
      <p><b>Guided:</b> (1) <b>Twisted pair</b> — दो ताँबे के तार आपस में लिपटे (twist से शोर रद्द होता है)। <b>UTP</b> (unshielded, सस्ता, LAN का मानक — Cat5e/Cat6/Cat6a) और <b>STP</b> (shielded, शोर वाले उद्योग में)।कनेक्टर RJ-45। 100 मीटर तक। (2) <b>Coaxial</b> — बीच में ताँबे का तार, चारों ओर insulation व जालीदार shield; केबल TV, पुराना Ethernet, CCTV। (3) <b>Optical fibre</b> — काँच/प्लास्टिक के रेशे में <b>प्रकाश की किरण</b> total internal reflection से चलती है। <b>Single-mode</b> (पतला core, laser, बहुत लंबी दूरी, backbone) बनाम <b>Multi-mode</b> (मोटा core, LED, कम दूरी, इमारत के अंदर)। बिजली-चुंबकीय शोर से पूरी तरह मुक्त, चोरी/टैप करना कठिन, बहुत ऊँची bandwidth — पर महँगा और जोड़ने में कौशल चाहिए।</p>
      <p><b>Unguided:</b> <b>Radio wave</b> (सर्वदिशीय, दीवार पार — Wi-Fi, Bluetooth, FM/AM), <b>Microwave</b> (दिशात्मक, line-of-sight — टावर से टावर, satellite, radar), <b>Infrared</b> (बहुत कम दूरी, दीवार पार नहीं — TV remote, पुराना IrDA)। बेतार में माध्यम साझा है इसलिए <b>interference, security और bandwidth बाँट</b> की समस्याएँ आती हैं।</p>` },

    { type: 'table', head: ['माध्यम', 'संकेत', 'typical गति', 'दूरी (बिना repeater)', 'शोर-सहिष्णुता', 'लागत', 'कहाँ'],
      rows: [
        ['Twisted pair — UTP Cat5e', 'विद्युत (ताँबा)', '1 Gbps', '100 m', 'मध्यम (twist से सुधार)', 'सबसे कम', 'घर/दफ़्तर का LAN, RJ-45'],
        ['Twisted pair — Cat6 / Cat6a', 'विद्युत', '1–10 Gbps', '100 m (Cat6a पर 10G)', 'Cat6a में बेहतर', 'कम', 'आधुनिक LAN, PoE कैमरा/AP'],
        ['Twisted pair — STP', 'विद्युत + shield', '1–10 Gbps', '100 m', 'अच्छी (shield)', 'मध्यम', 'फ़ैक्टरी, शोर वाला परिवेश'],
        ['Coaxial', 'विद्युत', '10 Mbps–1 Gbps (DOCSIS में अधिक)', '185–500 m (प्रकार अनुसार)', 'अच्छी', 'कम-मध्यम', 'केबल TV, CCTV, पुराना Ethernet, broadband'],
        ['Fibre — Multi-mode (OM3/OM4)', 'प्रकाश (LED/VCSEL)', '10–100 Gbps', '300–550 m', '<b>सबसे अच्छी</b> — EMI से मुक्त', 'ज़्यादा', 'इमारत/campus backbone, data-center के अंदर'],
        ['Fibre — Single-mode (OS2)', 'प्रकाश (laser)', '100 Gbps–Tbps', 'कई km से 100+ km', 'सबसे अच्छी', 'सबसे ज़्यादा', 'शहर-शहर, देश-देश, submarine cable, ISP backbone'],
        ['Radio (Wi-Fi 2.4/5/6 GHz)', 'विद्युत-चुंबकीय तरंग', '54 Mbps–9.6 Gbps (मानक अनुसार)', 'घर में 30–100 m', 'कम — interference साझा', 'कम (केबल नहीं)', 'Wi-Fi, Bluetooth, मोबाइल'],
        ['Microwave (terrestrial)', 'दिशात्मक तरंग', '100 Mbps–Gbps', 'टावर से टावर ~40–80 km (line of sight)', 'मध्यम — बारिश में क्षीणन', 'मध्यम-ज़्यादा', 'दूरसंचार backbone, पहाड़ी इलाक़ा'],
        ['Satellite', 'तरंग (GEO/MEO/LEO)', 'Mbps–100+ Mbps', 'हज़ारों km', 'मध्यम; GEO में बड़ी latency (~600 ms)', 'बहुत ज़्यादा', 'दूरस्थ/समुद्री क्षेत्र, VSAT, Starlink (LEO)'],
        ['Infrared', 'अवरक्त प्रकाश', 'Kbps–Mbps', 'कुछ मीटर, line of sight', 'दीवार पार नहीं — सुरक्षित पर सीमित', 'सबसे कम', 'TV remote, पुराना IrDA']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.4</span> गति के शब्द — bandwidth, throughput, latency, jitter</h3>
      <p>ये चार शब्द अक्सर एक ही समझ लिए जाते हैं, पर चारों अलग हैं और प्रश्न में अलग-अलग पूछे जाते हैं:</p>
      <ul>
        <li><b>Bandwidth:</b> माध्यम की <b>अधिकतम क्षमता</b>। डिजिटल में <b>bit प्रति सेकंड (bps)</b>; एनालॉग में हर्ट्ज़ (Hz) में frequency-परास। यह "पाइप की मोटाई" है।</li>
        <li><b>Throughput:</b> <b>असल में मिली</b> दर — overhead, congestion, टकराव, दूरी और protocol की सीमा घटाकर। यह हमेशा bandwidth से कम (या बराबर) होती है। 100 Mbps के link पर 10 MB फ़ाइल भेजने में सैद्धांतिक 0.8 s, पर असल में 1–2 s लग सकते हैं।</li>
        <li><b>Latency (विलंब):</b> एक bit/packet को sender से receiver तक पहुँचने में लगा <b>समय</b> (ms में)। चार हिस्से — <b>propagation</b> (दूरी ÷ संकेत-गति), <b>transmission</b> (packet-size ÷ bandwidth), <b>processing</b> (router/switch का काम), <b>queuing</b> (कतार में इंतज़ार)। यह "पाइप की लंबाई" है। Gaming, video-call और remote desktop में bandwidth से ज़्यादा latency मायने रखती है।</li>
        <li><b>Jitter:</b> latency का <b>उतार-चढ़ाव</b> — packet कभी 20 ms में, कभी 80 ms में। ध्वनि/वीडियो में इससे आवाज़ टूटती है; इसीलिए buffer रखा जाता है।</li>
      </ul>
      <p>दो और शब्द: <b>Attenuation (क्षीणन)</b> — दूरी के साथ संकेत की शक्ति घटना (इसीलिए हर 100 m पर repeater/switch चाहिए)। <b>Noise (शोर)</b> — बाहरी unwanted संकेत; तापीय, intermodulation, crosstalk और impulse। इनसे बचने के लिए twist, shield, fibre और digital error-correction इस्तेमाल होते हैं। <b>Shannon की सीमा</b> बताती है कि शोर वाले channel की अधिकतम भरोसेमंद दर bandwidth और signal-to-noise ratio पर निर्भर है — यानी केवल तार मोटा करने से सब हल नहीं होता।</p>` },

    { type: 'table', head: ['शब्द', 'अर्थ', 'इकाई', 'किससे बढ़ता/घटता है', 'रोज़ का उदाहरण'],
      rows: [
        ['Bandwidth', 'अधिकतम सैद्धांतिक क्षमता', 'bps (Kbps, Mbps, Gbps); analog में Hz', 'माध्यम व मानक तय करते हैं', '"100 Mbps का plan" — पाइप की मोटाई'],
        ['Throughput', 'असल में मिली दर', 'bps या MB/s', 'overhead, congestion, दूरी, disk/CPU की सीमा', 'speedtest पर 92 Mbps आना'],
        ['Latency', 'एक packet के पहुँचने का समय', 'ms (मिलीसेकंड)', 'दूरी, hop की संख्या, कतार, processing', 'ping 25 ms; satellite पर 600 ms'],
        ['Jitter', 'latency में उतार-चढ़ाव', 'ms', 'कतार, route बदलना, साझा माध्यम', 'video call में आवाज़ का टूटना'],
        ['Attenuation', 'दूरी से संकेत-शक्ति घटना', 'dB', 'दूरी, केबल की गुणवत्ता, frequency', '100 m के बाद Ethernet न चलना'],
        ['Noise / SNR', 'अवांछित संकेत; signal-to-noise अनुपात', 'dB', 'मोटर, बिजली की तार, दूसरे transmitter', 'फ़ैक्टरी में UTP की जगह STP/fibre'],
        ['Propagation delay', 'दूरी ÷ संकेत-गति', 'ms', 'भौतिक दूरी (ताँबे/फ़ाइबर में ~2×10⁸ m/s)', 'देश के दूसरे छोर तक ~20–30 ms'],
        ['Round-trip time (RTT)', 'जाने + वापस आने का कुल समय', 'ms', 'latency × 2 + processing', 'ping का आँकड़ा यही है']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.5</span> OSI मॉडल — सात परतें और क्यों बनाया गया</h3>
      <p><b>OSI (Open Systems Interconnection)</b> मॉडल ISO ने 1984 में दिया — यह एक <b>सैद्धांतिक संदर्भ-ढाँचा (reference model)</b> है जो नेटवर्किंग के पूरे काम को <b>सात परतों</b> में बाँट देता है। इसका मक़सद है <b>अलग-अलग निर्माता के उपकरण आपस में बात कर सकें</b>, और हर परत का काम अलग रखा जाए ताकि एक में बदलाव से दूसरी न टूटे (<b>modularity</b>)। परीक्षा व ट्रबलशूटिंग दोनों में यही सबसे ज़रूरी नक़्शा है।</p>
      <p>क्रम <b>नीचे से ऊपर</b> (भौतिक तार से इंसान के प्रोग्राम तक) याद रखिए — <b>"Please Do Not Throw Sausage Pizza Away"</b>: <b>P</b>hysical, <b>D</b>ata link, <b>N</b>etwork, <b>T</b>ransport, <b>S</b>ession, <b>P</b>resentation, <b>A</b>pplication। ऊपर से नीचे पूछा जाए तो उलटा क्रम लिखिए और परत-संख्या (7 = Application, 1 = Physical) स्पष्ट कीजिए।</p>
      <p>तीन समूह बनाकर समझिए: <b>निचली तीन परतें (1–3)</b> = network support — डेटा को भौतिक रूप से एक जगह से दूसरी जगह पहुँचाना; <b>ऊपरी तीन परतें (5–7)</b> = user support — प्रोग्राम को आपस में बात करने लायक बनाना; <b>बीच की चौथी (Transport)</b> = दोनों को जोड़ने वाली कड़ी — भरोसेमंद, क्रमबद्ध, end-to-end डिलीवरी।</p>` },

    { type: 'table', head: ['#', 'परत (Layer)', 'मुख्य काम', 'PDU (डेटा की इकाई)', 'उपकरण', 'protocol / मानक', 'एक लाइन में पहचान'],
      rows: [
        ['7', '<b>Application</b> (अनुप्रयोग)', 'user के प्रोग्राम को नेटवर्क सेवा देना; पहचान, resource उपलब्धता', 'Data / Message', 'Host, firewall (L7), proxy', 'HTTP, HTTPS, FTP, SMTP, POP3, IMAP, DNS, DHCP, Telnet, SSH, SNMP', 'जो software आप चलाते हैं — browser, mail client'],
        ['6', '<b>Presentation</b> (प्रस्तुति)', 'अनुवाद (translation), encryption/decryption, compression — syntax व semantics', 'Data', 'Gateway, SSL/TLS accelerator', 'TLS/SSL, JPEG, PNG, GIF, MPEG, ASCII↔EBCDIC, MIME', '"दूसरी मशीन इसे पढ़ सके" — रूप बदलना'],
        ['5', '<b>Session</b> (सत्र)', 'संवाद बनाना, सँभालना, बंद करना; dialog control, synchronization/checkpoint', 'Data', 'Gateway', 'NetBIOS, RPC, PPTP, SIP, sockets API', '"बातचीत कब शुरू/ख़त्म, बीच में टूटे तो फिर से"'],
        ['4', '<b>Transport</b> (परिवहन)', 'end-to-end डिलीवरी, segmentation व reassembly, flow control, error control, port addressing', '<b>Segment</b> (TCP) / <b>Datagram</b> (UDP)', 'L4 switch, firewall, load balancer', '<b>TCP, UDP</b>; port numbers', '"पूरा संदेश सही क्रम में, भरोसे से पहुँचे"'],
        ['3', '<b>Network</b> (जाल)', 'logical addressing (IP), routing — सर्वोत्तम रास्ता चुनना, packet forwarding', '<b>Packet</b>', '<b>Router</b>, L3 switch', 'IP (IPv4/IPv6), ICMP, ARP, OSPF, BGP, RIP, IPsec', '"किस network तक, किस रास्ते से"'],
        ['2', '<b>Data Link</b> (आँकड़ा कड़ी)', 'physical addressing (MAC), framing, error detection, access control; दो उप-परतें LLC व MAC', '<b>Frame</b>', '<b>Switch</b>, bridge, NIC, AP', 'Ethernet (802.3), Wi-Fi (802.11), PPP, HDLC, Frame Relay, VLAN (802.1Q)', '"एक ही link पर अगले पड़ोसी तक"'],
        ['1', '<b>Physical</b> (भौतिक)', 'bit को संकेत में बदलना — voltage, light, radio; केबल, connector, pin, data rate, topology', '<b>Bit</b>', '<b>Hub</b>, repeater, modem, केबल, connector, NIC का PHY', 'RS-232, RJ-45, Cat6, fibre, 100BASE-TX, DSL, SONET', '"तार पर 0 और 1 कैसे जाएँ"']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.6</span> Encapsulation — भेजते समय headers चढ़ना, पहुँचने पर उतरना</h3>
      <p>जब आप browser में कोई पता डालते हैं तो डेटा ऊपर की परत से नीचे की ओर उतरता है और <b>हर परत अपना header (और Data Link पर trailer भी) जोड़ देती है</b>। इसे <b>encapsulation</b> कहते हैं। पाने वाले की तरफ़ ठीक उलटा होता है — हर परत अपना header पढ़कर हटाती है और बाक़ी ऊपर भेजती है; इसे <b>decapsulation</b> कहते हैं।</p>
      <p>एक HTTP request का पूरा सफ़र: <b>Data</b> (Application ने बनाया) → Transport ने <b>TCP header</b> जोड़ा (source/destination port, sequence number, flags) ⇒ <b>Segment</b> → Network ने <b>IP header</b> जोड़ा (source/destination IP, TTL) ⇒ <b>Packet</b> → Data Link ने <b>MAC header + FCS trailer</b> जोड़ा (अगले hop का MAC) ⇒ <b>Frame</b> → Physical ने उसे <b>bit/संकेत</b> में बदलकर तार पर डाल दिया।</p>
      <p>रास्ते में <b>switch</b> केवल Data Link तक उतरता है (MAC देखकर आगे बढ़ाता है, IP header छूता भी नहीं), <b>router</b> Network तक उतरता है (IP देखकर रास्ता चुनता है, MAC header बदल देता है क्योंकि अगला hop बदल गया), और <b>आख़िरी मशीन</b> सातों परत चढ़कर डेटा browser तक पहुँचाती है। यही कारण है कि troubleshooting में "किस परत पर अटका है" पूछना सबसे तेज़ तरीक़ा है — <code>ping</code> परत 3 जाँचता है, link light परत 1, और वेबसाइट न खुलना परत 7।</p>
      <p><b>PDU</b> (Protocol Data Unit) = उस परत पर डेटा की इकाई का नाम। यही नाम परीक्षा में सबसे ज़्यादा पूछे जाते हैं: <b>Application/Presentation/Session = Data, Transport = Segment (TCP) या Datagram (UDP), Network = Packet, Data Link = Frame, Physical = Bit</b>।</p>` },

    { type: 'steps', items: [
      { n: 1, title: 'Application (7) — डेटा बना', text: 'browser ने HTTP request तैयार की: <code>GET /index.html</code> + headers। इस स्तर पर इकाई का नाम <b>Data</b> है।', tips: ['यहाँ protocol तय होता है — HTTP, FTP, SMTP आदि।'] },
      { n: 2, title: 'Presentation (6) — रूप व encryption', text: 'ज़रूरत हो तो encoding/compression, और HTTPS में <b>TLS encryption</b> यहीं से जुड़ता है। अब डेटा दूसरी मशीन के पढ़ने लायक व सुरक्षित रूप में है।', tips: ['TLS को अक्सर 6 और 7 के बीच माना जाता है — परीक्षा में Presentation के साथ लिखना स्वीकार्य है।'] },
      { n: 3, title: 'Session (5) — संवाद का प्रबंधन', text: 'सत्र बनाया/पहचाना जाता है, checkpoint व dialog control तय होता है ताकि लंबी बातचीत बीच से फिर शुरू हो सके।', tips: ['छोटे web request में यह परत बहुत हल्की होती है; बड़े RPC/मीडिया सत्र में इसका काम दिखता है।'] },
      { n: 4, title: 'Transport (4) — Segment बना', text: 'डेटा को <b>segments</b> में तोड़ा, हर एक पर <b>TCP header</b> लगाया — source port (जैसे 51234), destination port (80/443), sequence number, acknowledgement, window, flags। भरोसा, क्रम व flow control यहीं से आता है। UDP चुना होता तो header छोटा और भरोसा नहीं।', tips: ['Port नंबर इसी परत का पता है — process कौन-सा, यह बताता है।'] },
      { n: 5, title: 'Network (3) — Packet बना', text: 'हर segment पर <b>IP header</b> लगा — source IP, destination IP, TTL, protocol। अब यह <b>Packet</b> है और router इसे पढ़कर रास्ता तय कर सकता है।', tips: ['IP = logical पता, बदल सकता है; MAC = physical पता, NIC का स्थायी।'] },
      { n: 6, title: 'Data Link (2) — Frame बना', text: 'packet पर <b>frame header</b> (अगले hop का source व destination <b>MAC</b>, type) और अंत में <b>FCS trailer</b> (CRC से error जाँच) लगा। अब यह <b>Frame</b> है — एक ही link पर पड़ोसी तक जाने लायक।', tips: ['हर hop पर MAC header बदलता है, IP header वही रहता है — यही routing का सार है।'] },
      { n: 7, title: 'Physical (1) — Bit बनकर तार पर', text: 'frame के bit को voltage/light/radio संकेत में बदलकर माध्यम पर डाल दिया। NIC, केबल, hub/repeater इसी परत के पुर्ज़े हैं।', tips: ['यहाँ से आगे "संकेत" है, "डेटा" नहीं।'] },
      { n: 8, title: 'पाने वाले पर Decapsulation — उलटा क्रम', text: 'Physical ने संकेत से bit बनाए → Data Link ने MAC व FCS जाँचा, trailer-header हटाया → Network ने IP देखा (क्या यह मेरे लिए है?) → Transport ने port देखा, sequence से क्रम जोड़ा, ACK भेजा → Session/Presentation ने सत्र व decryption सँभाला → Application ने HTTP request पढ़कर जवाब बनाया।', tips: ['जवाब भेजते समय यही आठ कदम उलटी दिशा में दोहराए जाते हैं।'] }
    ] },

    { type: 'table', head: ['OSI परत', 'TCP/IP परत (4-परत मॉडल)', 'TCP/IP परत (5-परत मॉडल)', 'काम', 'उदाहरण protocol'],
      rows: [
        ['7 Application + 6 Presentation + 5 Session', '<b>Application</b>', 'Application', 'user-प्रोग्राम की सेवा, रूप/encryption, सत्र', 'HTTP, HTTPS, FTP, SMTP, IMAP, DNS, DHCP, SSH, TLS'],
        ['4 Transport', '<b>Transport</b> (Host-to-Host)', 'Transport', 'end-to-end भरोसा, port, flow व error control', 'TCP, UDP (QUIC भी इसी स्तर पर)'],
        ['3 Network', '<b>Internet</b>', 'Network', 'logical addressing व routing', 'IP, ICMP, IGMP, IPsec, OSPF/BGP'],
        ['2 Data Link + 1 Physical', '<b>Network Access / Link</b>', 'Data Link और Physical अलग-अलग', 'एक link पर framing, MAC, भौतिक संकेत', 'Ethernet, Wi-Fi, PPP, ARP, केबल/संकेत मानक']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.7</span> TCP/IP मॉडल — जो असल में चलता है</h3>
      <p>OSI एक <b>पढ़ने-समझने का नक़्शा</b> है; असली Internet <b>TCP/IP</b> पर चलता है, जिसे DoD मॉडल भी कहते हैं। इसमें <b>चार परतें</b> हैं — <b>Application, Transport, Internet, Network Access (Link)</b>। कई पाठ्यपुस्तकें पाँच-परत रूप भी देती हैं जहाँ Network Access को Data Link और Physical में तोड़ दिया जाता है।</p>
      <p>दोनों का मेल ऊपर टेबल में है। परीक्षा में अक्सर पूछा जाता है — "OSI की कौन-सी परतें TCP/IP की Application परत में समा जाती हैं?" उत्तर: <b>Application + Presentation + Session (7, 6, 5)</b>। और "TCP/IP की Internet परत OSI की किस परत के बराबर है?" उत्तर: <b>Network (3)</b>।</p>
      <p><b>TCP बनाम UDP</b> — यह जोड़ी सबसे ज़्यादा पूछी जाती है। <b>TCP (Transmission Control Protocol)</b>: connection-oriented (पहले three-way handshake — SYN, SYN-ACK, ACK), भरोसेमंद (ACK + retransmission), क्रमबद्ध (sequence number), flow control (window), congestion control; header 20–60 byte। काम — web, email, फ़ाइल transfer, SSH; जहाँ एक byte भी खोना मंज़ूर नहीं। <b>UDP (User Datagram Protocol)</b>: connectionless, कोई ACK/retransmission नहीं, क्रम की गारंटी नहीं, header केवल 8 byte, बहुत तेज़ व हल्का। काम — DNS query, DHCP, VoIP, live streaming, gaming, QUIC; जहाँ देरी ग़लती से ज़्यादा महँगी है।</p>` },

    { type: 'table', head: ['Protocol', 'पूरा नाम', 'Port', 'TCP/UDP', 'परत', 'काम'],
      rows: [
        ['HTTP', 'HyperText Transfer Protocol', '80', 'TCP', 'Application', 'वेब पेज माँगना-भेजना (सादा, असुरक्षित)'],
        ['HTTPS', 'HTTP Secure (HTTP over TLS)', '443', 'TCP', 'Application', 'वही + encryption; आज वेब का मानक'],
        ['FTP', 'File Transfer Protocol', '21 (control), 20 (data)', 'TCP', 'Application', 'फ़ाइल भेजना-पाना; सादा — SFTP/FTPS बेहतर'],
        ['SFTP / SSH', 'SSH File Transfer / Secure Shell', '22', 'TCP', 'Application', 'सुरक्षित दूरस्थ login व फ़ाइल transfer'],
        ['SMTP', 'Simple Mail Transfer Protocol', '25 (relay), 587 (submission), 465 (SSL)', 'TCP', 'Application', 'email <b>भेजना</b>'],
        ['POP3', 'Post Office Protocol v3', '110, 995 (SSL)', 'TCP', 'Application', 'email download करके server से हटाना'],
        ['IMAP', 'Internet Message Access Protocol', '143, 993 (SSL)', 'TCP', 'Application', 'email server पर ही रखकर कई उपकरणों से पढ़ना'],
        ['DNS', 'Domain Name System', '53', 'UDP (बड़े जवाब/zone transfer में TCP)', 'Application', 'नाम को IP में बदलना'],
        ['DHCP', 'Dynamic Host Configuration Protocol', '67 (server), 68 (client)', 'UDP', 'Application', 'IP, mask, gateway, DNS अपने आप बाँटना'],
        ['Telnet', 'Teletype Network', '23', 'TCP', 'Application', 'दूरस्थ login — सादा, आज त्याज्य; SSH लें'],
        ['SNMP', 'Simple Network Management Protocol', '161, 162 (trap)', 'UDP', 'Application', 'उपकरणों की निगरानी व प्रबंधन'],
        ['RDP', 'Remote Desktop Protocol', '3389', 'TCP/UDP', 'Application', 'Windows का दूरस्थ desktop'],
        ['TFTP', 'Trivial FTP', '69', 'UDP', 'Application', 'बहुत सरल फ़ाइल transfer — boot/PXE में'],
        ['NTP', 'Network Time Protocol', '123', 'UDP', 'Application', 'घड़ी मिलाना'],
        ['TCP', 'Transmission Control Protocol', '— (port संख्या इसमें रखी जाती है)', '—', 'Transport', 'भरोसेमंद, क्रमबद्ध, connection-oriented'],
        ['UDP', 'User Datagram Protocol', '—', '—', 'Transport', 'तेज़, हल्का, connectionless'],
        ['IP', 'Internet Protocol', '—', '—', 'Network', 'logical addressing व routing (IPv4 32-bit, IPv6 128-bit)'],
        ['ICMP', 'Internet Control Message Protocol', '—', '—', 'Network', 'ping व traceroute की सूचना/त्रुटि-रिपोर्ट'],
        ['ARP', 'Address Resolution Protocol', '—', '—', 'Data Link / Network के बीच', 'IP से MAC पता लगाना']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.8</span> Switching और Multiplexing — रास्ता और साझा करना</h3>
      <p><b>Switching</b> = बहुत सारे उपकरणों के बीच रास्ता तय करना। तीन प्रकार:</p>
      <ul>
        <li><b>Circuit switching:</b> बात शुरू होने से पहले पूरा <b>समर्पित रास्ता</b> आरक्षित हो जाता है और बात भर बना रहता है — पुराना telephone network। लाभ: तय bandwidth, कोई jitter नहीं। कमी: खाली बैठे रहने पर भी रास्ता किसी और को नहीं मिलता, setup में समय।</li>
        <li><b>Message switching:</b> पूरा संदेश एक-एक hop पर <b>store करके आगे</b> भेजा जाता है (store-and-forward), कोई समर्पित रास्ता नहीं। पुराना तार/टेलीग्राम प्रणाली। कमी: बड़े संदेश के लिए हर hop पर जगह व देरी।</li>
        <li><b>Packet switching:</b> संदेश को छोटे <b>packets</b> में तोड़कर हर packet स्वतंत्र रूप से भेजा जाता है; रास्ता साझा, ज़रूरत के समय ही कब्ज़ा। दो रूप — <b>datagram</b> (हर packet अलग रास्ता ले सकता है, IP यही है) और <b>virtual circuit</b> (पहले तार्किक रास्ता तय, सब packet उसी पर — Frame Relay/ATM/MPLS)। लाभ: कुशल, लचीला, ख़राबी पर दूसरा रास्ता। कमी: कतार से jitter, congestion। <b>Internet इसी पर चलता है।</b></li>
      </ul>
      <p><b>Multiplexing</b> = एक ही माध्यम पर कई संकेत एक साथ ले जाना ताकि महँगा रास्ता बँट जाए। <b>FDM</b> (Frequency Division) — अलग-अलग frequency बैंड, जैसे रेडियो/केबल TV के चैनल। <b>TDM</b> (Time Division) — बारी-बारी time slot, synchronous (तय slot) या statistical (ज़रूरत वाले को)। <b>WDM</b> (Wavelength Division) — fibre में अलग-अलग रंग/तरंगदैर्ध्य की किरणें, यही आज की backbone क्षमता का आधार है। <b>CDM/CDMA</b> (Code Division) — सब एक साथ, अलग-अलग code से अलग पहचान।</p>` },

    { type: 'table', head: ['तकनीक', 'प्रकार', 'कैसे बाँटता है', 'उदाहरण', 'लाभ / कमी'],
      rows: [
        ['Circuit switching', 'Switching', 'पहले से समर्पित भौतिक रास्ता', 'पुराना PSTN telephone', 'तय गुणवत्ता; खाली रहने पर भी बर्बादी'],
        ['Message switching', 'Switching', 'पूरा संदेश store-and-forward', 'पुराना तार/टेलीग्राम', 'रास्ता आरक्षित नहीं; बड़े संदेश पर देरी'],
        ['Packet switching — datagram', 'Switching', 'छोटे packet, हर एक स्वतंत्र', '<b>IP / Internet</b>', 'कुशल व लचीला; jitter/congestion संभव'],
        ['Packet switching — virtual circuit', 'Switching', 'तार्किक रास्ता पहले तय', 'Frame Relay, ATM, MPLS', 'क्रम बना रहता है; setup चाहिए'],
        ['FDM', 'Multiplexing', 'अलग frequency बैंड', 'रेडियो, केबल TV, ADSL', 'सरल; guard band से कुछ क्षमता बर्बाद'],
        ['TDM', 'Multiplexing', 'बारी-बारी time slot', 'T1/E1 लाइन, SONET/SDH', 'digital के लिए स्वाभाविक; खाली slot बर्बाद (statistical से हल)'],
        ['WDM / DWDM', 'Multiplexing', 'अलग तरंगदैर्ध्य (रंग)', 'optical fibre backbone', 'एक रेशे पर दर्जनों-सैकड़ों channel, Tbps'],
        ['CDM / CDMA', 'Multiplexing', 'अलग spreading code', '3G मोबाइल, GPS', 'साझा spectrum, शोर-सहिष्णु; जटिल']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.9</span> Network उपकरण — कौन किस परत पर काम करता है</h3>
      <p>उपकरण की असली पहचान यह है कि वह <b>किस परत का पता पढ़ता है</b>। यही तय करता है कि वह कितना समझदार है और क्या-कर सकता है।</p>
      <ul>
        <li><b>Repeater / Hub (परत 1):</b> संकेत को साफ़/बढ़ाकर सब ports पर भेज देता है। कोई पता नहीं पढ़ता, सबको सब दिखता है — एक ही <b>collision domain</b>, आधी-अधूरी bandwidth बँटती है। आज त्याज्य।</li>
        <li><b>Bridge / Switch (परत 2):</b> <b>MAC address</b> पढ़ता है, MAC table बनाकर केवल सही port पर frame भेजता है। हर port अलग collision domain — इसीलिए switch ने hub की जगह ली। <b>VLAN</b> से एक switch को कई तार्किक network में बाँट सकते हैं (broadcast domain अलग)।</li>
        <li><b>Router / Layer-3 switch (परत 3):</b> <b>IP address</b> पढ़ता है, routing table से सर्वोत्तम रास्ता चुनता है, अलग-अलग network को जोड़ता है और broadcast रोकता है। घर का "Wi-Fi router" असल में router + switch + AP + modem का जोड़ है।</li>
        <li><b>Gateway (परत 4–7):</b> दो <b>अलग protocol/ढाँचे</b> के network के बीच अनुवादक — जैसे पुराना mail gateway, या आज का API/application gateway।</li>
        <li><b>Modem (परत 1):</b> digital ↔ analog बदलता है (MOdulator–DEModulator) — telephone/केबल लाइन पर digital डेटा भेजने के लिए। आज का ONT/ONU fibre के लिए यही काम करता है।</li>
        <li><b>Wireless Access Point (परत 1–2):</b> बेतार उपकरणों को तार वाले LAN से जोड़ता है; Wi-Fi का MAC व radio सँभालता है।</li>
        <li><b>Firewall (परत 3–4, आधुनिक में 7 भी):</b> नियमों के अनुसार traffic रोकना/जाने देना — packet filter (IP/port), stateful (connection की स्थिति), या <b>NGFW</b> (application पहचानकर)।</li>
        <li><b>NIC (Network Interface Card):</b> कंप्यूटर को network से जोड़ने वाला बोर्ड/चिप; इसका <b>MAC address</b> जन्म से तय (48-bit, 12 hex अंक)। परत 1 व 2 दोनों में काम करता है।</li>
      </ul>` },

    { type: 'table', head: ['उपकरण', 'OSI परत', 'कौन-सा पता पढ़ता है', 'क्या करता है', 'Collision / Broadcast domain'],
      rows: [
        ['Repeater', '1 Physical', 'कोई नहीं — केवल संकेत', 'क्षीण संकेत को बढ़ाकर आगे', 'दोनों बढ़ा देता है (कोई रोक नहीं)'],
        ['Hub', '1 Physical', 'कोई नहीं', 'एक port से आया संकेत सब ports पर', '<b>एक ही</b> collision व broadcast domain'],
        ['Modem', '1 Physical', 'कोई नहीं', 'digital ↔ analog रूपांतरण', 'माध्यम बदलता है'],
        ['Bridge', '2 Data Link', 'MAC', 'दो LAN खंड जोड़ना, MAC से छानना', 'collision अलग, broadcast एक'],
        ['Switch', '2 Data Link', 'MAC (MAC table)', 'सही port पर frame भेजना; VLAN', '<b>हर port अलग collision</b>; broadcast एक (VLAN से अलग)'],
        ['Wireless AP', '1–2', 'MAC + radio', 'बेतार clients को LAN से जोड़ना', 'साझा बेतार माध्यम — CSMA/CA'],
        ['Router', '3 Network', '<b>IP</b> (routing table)', 'अलग network जोड़ना, रास्ता चुनना, NAT', '<b>हर interface अलग broadcast domain</b>'],
        ['L3 Switch', '2 + 3', 'MAC + IP', 'hardware में तेज़ routing + switching', 'VLAN के बीच routing'],
        ['Firewall', '3–4 (NGFW में 7)', 'IP, port, state, application', 'नियम से allow/deny, निगरानी', 'सुरक्षा-सीमा बनाता है'],
        ['Gateway', '4–7', 'protocol-विशिष्ट', 'दो अलग ढाँचों के बीच अनुवाद', 'दो भिन्न network जोड़ता है'],
        ['NIC', '1–2', 'MAC (अपना)', 'कंप्यूटर को माध्यम से जोड़ना', 'हर NIC अपना MAC रखता है']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">4.10</span> Network Topology — जुड़ाव की बनावट</h3>
      <p><b>Topology</b> = उपकरण आपस में कैसे जुड़े हैं। दो अर्थ हैं — <b>physical</b> (केबल असल में कैसे बिछी है) और <b>logical</b> (डेटा असल में किस रास्ते बहता है)। ये अलग हो सकते हैं: आधुनिक Ethernet <b>physical star</b> है पर <b>logical bus</b> जैसा व्यवहार करता है (साझा माध्यम की तरह)।</p>
      <ul>
        <li><b>Bus:</b> एक ही backbone केबल, सब उसी से जुड़े (terminator दोनों सिरों पर)। सस्ता, कम केबल; पर backbone टूटा तो पूरा network बंद, टकराव बढ़ते हैं, ख़राबी ढूँढ़ना कठिन। पुराना 10BASE-2 coax।</li>
        <li><b>Star:</b> सब एक केंद्रीय switch/hub से। सबसे आम — जोड़ना-हटाना आसान, एक केबल टूटे तो केवल वही node प्रभावित। कमी: केंद्र ख़राब हुआ तो सब बंद, केबल ज़्यादा लगती है।</li>
        <li><b>Ring:</b> हर node दो पड़ोसियों से जुड़कर बंद वलय। डेटा एक दिशा में घूमता है (token passing से टकराव नहीं)। कमी: एक node/केबल टूटे तो वलय टूटा; dual ring (FDDI) से बचाव।</li>
        <li><b>Mesh:</b> हर node कई/सब दूसरों से सीधा जुड़ा। <b>Full mesh</b> में n node के लिए <b>n(n−1)/2</b> links — सबसे भरोसेमंद (कई रास्ते), सबसे महँगा। <b>Partial mesh</b> व्यावहारिक समझौता। Internet backbone व WAN इसी विचार पर।</li>
        <li><b>Tree (hierarchical star):</b> कई star एक ऊपरी स्तर से जुड़े — बड़ी इमारत/campus का ढाँचा (core → distribution → access)।</li>
        <li><b>Hybrid:</b> दो या अधिक का मिश्रण — असली बड़े network लगभग हमेशा hybrid होते हैं (star + mesh backbone)।</li>
      </ul>` },

    { type: 'table', head: ['Topology', 'बनावट', 'केबल/लागत', 'एक node/केबल ख़राब हो तो', 'टकराव व प्रदर्शन', 'कहाँ उपयुक्त'],
      rows: [
        ['Bus', 'एक backbone, सब उससे', 'सबसे कम केबल, सस्ता', '<b>पूरा network बंद</b>', 'टकराव ज़्यादा, load बढ़ने पर गिरता है', 'छोटा/अस्थायी, पुराना coax LAN'],
        ['Star', 'सब केंद्रीय switch से', 'केबल ज़्यादा, मध्यम लागत', 'केवल वही node बंद', 'switch से हर port अलग — अच्छा', '<b>आज का मानक LAN</b>, घर/दफ़्तर'],
        ['Ring', 'बंद वलय, token passing', 'मध्यम', 'वलय टूटा तो सब (dual ring से बचाव)', 'token से टकराव नहीं, तय बारी', 'पुराना Token Ring, FDDI, कुछ MAN'],
        ['Mesh (full)', 'हर node सब से — n(n−1)/2 links', '<b>सबसे ज़्यादा</b>', 'कोई असर नहीं — दूसरा रास्ता', 'सबसे भरोसेमंद, कोई single point of failure', 'WAN backbone, critical link, सेना/आपदा'],
        ['Mesh (partial)', 'कुछ अतिरिक्त रास्ते', 'ज़्यादा पर नियंत्रित', 'प्रायः कोई असर नहीं', 'अच्छा संतुलन', 'बड़ा enterprise WAN, ISP'],
        ['Tree', 'स्तरों में star (core/distribution/access)', 'ज़्यादा, ढाँचागत', 'ऊपरी स्तर ख़राब तो नीचे का पूरा हिस्सा', 'स्तर के अनुसार; bottleneck ऊपर', 'campus, बड़ी इमारत, data-center'],
        ['Hybrid', 'दो या अधिक का जोड़', 'ज़रूरत के अनुसार', 'निर्भर — किस हिस्से में ख़राबी', 'लचीला, अनुकूलनीय', 'हर बड़ा असली network']
      ] },

    { type: 'acc', title: 'FAQ — डेटा संचार व OSI', items: [
      { q: 'OSI मॉडल असल में इस्तेमाल होता है या केवल पढ़ने के लिए है?', a: 'OSI एक <b>reference model</b> है — असली Internet TCP/IP पर चलता है और उसकी सातों परतें हूबहू लागू नहीं होतीं (Session व Presentation अक्सर Application में समा जाते हैं)। पर OSI आज भी <b>पढ़ाने, समझने और troubleshooting</b> का मानक नक़्शा है — "परत 2 की समस्या है या परत 3 की" कहना पूरी दुनिया समझती है।'},
      { q: 'Switch और router में असली फ़र्क़ क्या है?', a: '<b>Switch परत 2</b> पर <b>MAC address</b> पढ़ता है और <b>एक ही network के अंदर</b> frame पहुँचाता है। <b>Router परत 3</b> पर <b>IP address</b> पढ़ता है और <b>अलग-अलग network के बीच</b> packet भेजता है, broadcast रोकता है। घर का "router" असल में router + switch + Wi-Fi AP + modem का संयुक्त डिब्बा है।'},
      { q: 'MAC address और IP address में फ़र्क़?', a: '<b>MAC</b> = 48-bit <b>physical</b> पता, NIC में जन्म से (जैसे 00:1A:2B:3C:4D:5E), परत 2 पर चलता है, एक ही LAN में अर्थ रखता है, आम तौर पर नहीं बदलता। <b>IP</b> = 32-bit (IPv4) या 128-bit (IPv6) <b>logical</b> पता, network के अनुसार बदलता है (DHCP से), परत 3 पर चलता है, पूरी दुनिया में routing के लिए। हर hop पर MAC बदलता है, IP वही रहता है।'},
      { q: 'TCP और UDP कब चुनें?', a: '<b>TCP</b> जब डेटा का हर byte सही क्रम में पहुँचना ज़रूरी हो — web, email, फ़ाइल transfer, SSH। <b>UDP</b> जब देरी ग़लती से ज़्यादा महँगी हो और थोड़ा नुक़सान चले — live video/voice, gaming, DNS query, DHCP। आधुनिक <b>QUIC</b> UDP पर बनाकर TCP जैसा भरोसा खुद जोड़ता है।'},
      { q: 'Bandwidth बढ़ाऊँ या latency घटाऊँ?', a: 'बड़ी फ़ाइल जल्दी भेजनी है तो <b>bandwidth/throughput</b> बढ़ाइए। Gaming, video-call, remote desktop, trading में <b>latency व jitter</b> घटाइए — इसके लिए नज़दीकी server, कम hop, बेहतर routing, कतार-प्रबंधन (QoS) और तार वाला जुड़ाव काम आता है। satellite पर bandwidth अच्छा हो सकता है पर latency बहुत ख़राब।'},
      { q: 'Fibre ताँबे से बेहतर है तो हर जगह fibre क्यों नहीं?', a: 'लागत और सुविधा। fibre महँगा है, जोड़ने/टर्मिनेट करने में कौशल व उपकरण चाहिए, और PoE (केबल से बिजली) नहीं दे सकता — कैमरा/AP को अलग बिजली चाहिए। 100 m तक के LAN में Cat6 सस्ता व काफ़ी है। fibre वहाँ चुनिए जहाँ लंबी दूरी, बहुत ऊँची गति, या बिजली-शोर/लाइटनिंग का जोखिम हो।'},
      { q: 'Hub आज क्यों नहीं बिकता?', a: 'Hub परत 1 का उपकरण है — सब कुछ सब ports पर भेज देता है, इसलिए <b>एक ही collision domain</b> बनता है, bandwidth बँटती है और सुरक्षा भी कमज़ोर (सबका traffic सबको दिखता है)। Switch ने वही काम MAC पढ़कर कुशलता से किया, हर port अलग collision domain दिया — और आज switch की कीमत भी बहुत कम है।'},
      { q: 'ARP क्या करता है और किस परत का है?', a: '<b>ARP (Address Resolution Protocol)</b> ज्ञात <b>IP से अज्ञात MAC</b> पता लगाता है — "192.168.1.5 किसका है?" broadcast पूछता है, मालिक अपना MAC बता देता है, और वह जोड़ी cache में रखी जाती है (<code>arp -a</code>)। यह परत 2 और 3 के बीच का पुल है; IPv6 में इसका काम <b>NDP</b> करता है।'},
      { q: 'Packet switching में packet अलग रास्ते से जाएँ तो क्रम कैसे बनता है?', a: 'यही <b>TCP</b> का काम है — हर segment पर <b>sequence number</b> होता है, पाने वाला उन्हें क्रम में जोड़ता है, खोए हुए को फिर माँगता है (retransmission), और ACK भेजता है। UDP यह नहीं करता, इसलिए वहाँ क्रम की ज़िम्मेदारी application पर आ जाती है।'},
      { q: 'Full mesh में केबल की गिनती का सूत्र क्या है?', a: '<b>n(n−1)/2</b> — हर node को बाक़ी n−1 से जोड़ना है, और हर जोड़ी दो बार गिनी जाती है इसलिए 2 से भाग। 5 node → 10 links, 10 node → 45 links। इसीलिए full mesh छोटे critical network में ही व्यावहारिक है; बड़े network में partial mesh या hierarchical tree लेते हैं।'},
      { q: 'Simplex, half-duplex, full-duplex का एक-एक उदाहरण?', a: '<b>Simplex</b> — keyboard से कंप्यूटर (या TV प्रसारण): सदा एक दिशा। <b>Half-duplex</b> — walkie-talkie: दोनों दिशा पर बारी-बारी, बोलने से पहले बटन। <b>Full-duplex</b> — telephone call: दोनों एक साथ बोल-सुन सकते हैं।'},
      { q: 'ट्रबलशूटिंग में परतों का क्रम कैसे इस्तेमाल करें?', a: 'नीचे से ऊपर जाइए: (1) केबल/link light जली है? (परत 1) (2) NIC को MAC/IP मिला, switch port ठीक? (परत 2) (3) <code>ping gateway</code> व <code>ping 8.8.8.8</code> चला? (परत 3) (4) port खुला है, <code>telnet host 443</code> जुड़ा? (परत 4) (5) DNS resolve हुआ? (परत 7) (6) browser में proxy/certificate/extension? इससे अंदाज़े के बजाय प्रमाण से समस्या सिकुड़ती है।'}
    ] },

    { type: 'labs', items: [
      { n: 113, title: 'OSI की सातों परतें अपनी ज़बान में लिखना', aim: 'हर परत का काम, PDU, device और एक protocol बिना देखे लिख पाना।',
        tools: ['यह पेज की OSI टेबल', 'A4 शीट / spreadsheet', 'रंगीन पेन'],
        steps: ['शीट पर 6 कॉलम बनाइए: परत-संख्या व नाम, काम, PDU, उपकरण, protocol, एक रोज़ का उदाहरण।', 'सातों पंक्तियाँ भरिए — पहले नाम व PDU, फिर बाक़ी।', '"Please Do Not Throw Sausage Pizza Away" से क्रम जाँचिए।', 'शीट पलटकर बिना देखे दोबारा भरिए और मिलाइए; ग़लतियाँ लाल से सुधारिए।', 'अंत में बताइए: switch, router, hub, firewall किस परत पर और क्यों।'],
        result: 'सातों परतों की भरी हुई शीट और दोहराव-परीक्षण; PDU व device की जोड़ी पक्की।' },
      { n: 114, title: 'Encapsulation को कागज़ पर उतारना', aim: 'एक HTTP request के चारों रूप (Data → Segment → Packet → Frame → Bit) हाथ से बनाकर देखना।',
        tools: ['कागज़/whiteboard', 'चार रंग के पेन', 'यह पेज का encapsulation steps ब्लॉक'],
        steps: ['बीच में एक छोटा "GET /index.html" लिखिए — यह Application का Data है।', 'उसके चारों ओर TCP header का डिब्बा बनाइए और उसमें source port 51234, dest port 80, sequence number लिखिए — अब यह Segment है।', 'उसके चारों ओर IP header का डिब्बा — source IP, destination IP, TTL। अब Packet।', 'सबसे बाहर frame header (source MAC, अगले hop का MAC) और पीछे FCS trailer। अब Frame।', 'नीचे लिखिए कि तार पर यह केवल bit/संकेत बनकर जाएगा; फिर पाने वाले की तरफ़ उलटा क्रम बनाइए।', 'हर hop पर कौन-सा header बदलेगा और कौन-सा नहीं — तीर से दिखाइए।'],
        result: 'चारों PDU का चित्र और यह स्पष्टता कि हर hop पर MAC बदलता है पर IP वही रहता है।' },
      { n: 115, title: 'अपने network की परत-दर-परत जाँच', aim: 'असली कमांड से परत 1 से 7 तक जाँच करना और नतीजा लिखना।',
        tools: ['Windows CMD/PowerShell या Linux terminal', 'इंटरनेट जुड़ा हुआ कंप्यूटर', 'नोटबुक'],
        steps: ['परत 1–2: <code>ipconfig /all</code> (Windows) या <code>ip a</code> (Linux) से अपना IP, mask, gateway, MAC लिखिए।', 'परत 3: <code>ping 127.0.0.1</code>, फिर gateway, फिर <code>ping 8.8.8.8</code> — हर एक का समय (ms) लिखिए।', 'रास्ता: <code>tracert 8.8.8.8</code> या <code>traceroute</code> से hop की गिनती व नाम लिखिए।', 'परत 7: <code>nslookup example.com</code> या <code>dig example.com</code> से DNS जवाब लिखिए।', 'ARP: <code>arp -a</code> से gateway का MAC देखिए और समझाइए कि यह किस परत का काम है।', 'अंत में एक छोटी रिपोर्ट लिखिए: कौन-सी जाँच किस परत की थी, और कहाँ सबसे ज़्यादा देरी मिली।'],
        result: 'पाँच कमांड के नतीजों वाली परत-वार रिपोर्ट; ping/traceroute/DNS/ARP का व्यावहारिक अर्थ स्पष्ट।' }
    ] },

    { type: 'quiz', store: 'sci-dcom', items: [
      { q: 'डेटा संचार के पाँच घटक कौन-से हैं?', o: ['Message, Sender, Receiver, Medium, Protocol', 'CPU, RAM, ROM, Disk, Monitor', 'Sender, Receiver, Router, Switch, Hub', 'Data, Signal, Bit, Byte, Frame'], a: 0, ex: 'हर संचार में ये पाँच होते हैं। Protocol वह साझा नियम है जिसके बिना जुड़े उपकरण भी एक-दूसरे को नहीं समझ पाते।' },
      { q: 'Walkie-talkie किस mode का उदाहरण है?', o: ['Simplex', 'Half-duplex', 'Full-duplex', 'Multiplex'], a: 1, ex: 'दोनों दिशा में संचार हो सकता है पर एक समय में एक ही — बोलने से पहले बटन दबाना पड़ता है। Telephone full-duplex है।' },
      { q: 'OSI मॉडल में कुल कितनी परतें हैं?', o: ['4', '5', '6', '7'], a: 3, ex: 'Physical, Data Link, Network, Transport, Session, Presentation, Application — कुल सात। TCP/IP में चार (या पाँच) परतें हैं।' },
      { q: 'Router किस OSI परत पर काम करता है?', o: ['परत 1', 'परत 2', 'परत 3', 'परत 4'], a: 2, ex: 'Router Network परत (3) पर IP address पढ़कर routing करता है। Switch परत 2 पर MAC पढ़ता है, hub परत 1 पर केवल संकेत दोहराता है।' },
      { q: 'Transport परत पर TCP की डेटा-इकाई क्या कहलाती है?', o: ['Frame', 'Packet', 'Segment', 'Bit'], a: 2, ex: 'TCP = Segment, UDP = Datagram, Network = Packet, Data Link = Frame, Physical = Bit, ऊपरी तीन परतें = Data।' },
      { q: 'MAC address किस परत का पता है?', o: ['Physical', 'Data Link', 'Network', 'Transport'], a: 1, ex: 'MAC (48-bit) Data Link परत का physical पता है; IP Network परत का logical पता। हर hop पर MAC बदलता है, IP वही रहता है।' },
      { q: 'Optical fibre में डेटा किस रूप में चलता है?', o: ['विद्युत वोल्टेज', 'प्रकाश की किरण (total internal reflection)', 'रेडियो तरंग', 'ध्वनि'], a: 1, ex: 'काँच/प्लास्टिक के रेशे में प्रकाश बार-बार भीतर परावर्तित होकर आगे बढ़ता है। इसीलिए fibre EMI से पूरी तरह मुक्त है और बहुत लंबी दूरी तय करता है।' },
      { q: 'Bandwidth और throughput में फ़र्क़?', o: ['दोनों एक ही', 'Bandwidth अधिकतम क्षमता; throughput असल में मिली दर', 'Throughput हमेशा ज़्यादा', 'Bandwidth ms में नापते हैं'], a: 1, ex: 'Bandwidth पाइप की मोटाई है (bps), throughput असल बहाव — overhead/congestion से हमेशा कम या बराबर। Latency समय (ms) है।' },
      { q: 'DNS किस port पर चलता है?', o: ['21', '25', '53', '80'], a: 2, ex: 'DNS port 53 (आम तौर पर UDP, बड़े जवाब/zone transfer में TCP)। HTTP 80, HTTPS 443, FTP 21, SMTP 25, SSH 22।' },
      { q: 'TCP की कौन-सी ख़ासियत UDP में नहीं है?', o: ['Port addressing', 'Connection-oriented भरोसेमंद, क्रमबद्ध डिलीवरी', 'IP पर चलना', 'Checksum'], a: 1, ex: 'TCP तीन-चरणीय handshake, ACK, retransmission, sequence व flow control देता है। UDP connectionless है — तेज़ पर भरोसा application को सँभालना पड़ता है।' },
      { q: 'OSI की कौन-सी परतें TCP/IP की Application परत में समा जाती हैं?', o: ['केवल 7', '5, 6 और 7', '1 और 2', '3 और 4'], a: 1, ex: 'Session (5), Presentation (6) और Application (7) मिलकर TCP/IP की Application परत बनाते हैं। OSI की 1+2 मिलकर Network Access बनती हैं।' },
      { q: 'Encapsulation का सही क्रम क्या है?', o: ['Bit → Frame → Packet → Segment → Data', 'Data → Segment → Packet → Frame → Bit', 'Packet → Frame → Data → Bit', 'Frame → Packet → Segment → Data'], a: 1, ex: 'भेजते समय ऊपर से नीचे हर परत header जोड़ती है: Data → Segment (TCP) → Packet (IP) → Frame (MAC+FCS) → Bit (संकेत)। पहुँचने पर उलटा decapsulation होता है।' },
      { q: 'Full mesh topology में n node के लिए कितने link चाहिए?', o: ['n', 'n−1', 'n(n−1)/2', '2n'], a: 2, ex: 'हर node बाक़ी n−1 से जुड़ता है और हर जोड़ी दो बार गिनी जाती है, इसलिए n(n−1)/2। 10 node → 45 links — इसीलिए यह महँगा है।' },
      { q: 'कौन-सा उपकरण broadcast domain अलग करता है?', o: ['Hub', 'Repeater', 'Switch (बिना VLAN)', 'Router'], a: 3, ex: 'Router हर interface पर अलग broadcast domain बनाता है। Switch हर port का collision domain अलग करता है पर broadcast एक ही रहता है — VLAN से उसे भी बाँटा जा सकता है।' },
      { q: 'Fibre को ताँबे के केबल पर सबसे बड़ा लाभ क्या है?', o: ['सस्ता है', 'PoE दे सकता है', 'EMI से मुक्त, बहुत ऊँची bandwidth व लंबी दूरी', 'जोड़ना आसान'], a: 2, ex: 'प्रकाश पर बिजली-चुंबकीय शोर का असर नहीं होता, टैप करना कठिन है, और single-mode से कई km तक बहुत ऊँची गति मिलती है। कमी — लागत, कौशल और PoE न दे पाना।' },
      { q: 'ARP का काम क्या है?', o: ['MAC से IP ढूँढ़ना', 'IP से MAC ढूँढ़ना', 'नाम से IP ढूँढ़ना', 'port से process ढूँढ़ना'], a: 1, ex: 'ARP ज्ञात IP के लिए अज्ञात MAC पूछता है (broadcast) और जोड़ी cache करता है। नाम से IP = DNS; उलटा (MAC से IP) = RARP।' },
      { q: 'Packet switching की मुख्य ख़ूबी क्या है?', o: ['पहले से समर्पित रास्ता', 'माध्यम साझा — ज़रूरत के समय ही packet भेजना, कुशल उपयोग', 'कोई देरी नहीं', 'केवल ध्वनि के लिए'], a: 1, ex: 'Circuit switching में रास्ता आरक्षित रहता है (खाली भी), packet switching में वही रास्ता सब बाँटते हैं — इसीलिए Internet कुशल व लचीला है; कमी — कतार से jitter।' },
      { q: 'Latency के चार घटक कौन-से हैं?', o: ['Bandwidth, throughput, jitter, noise', 'Propagation, transmission, processing, queuing', 'IP, MAC, port, protocol', 'Sender, receiver, medium, protocol'], a: 1, ex: 'Propagation = दूरी÷गति, transmission = packet-size÷bandwidth, processing = उपकरण का काम, queuing = कतार में इंतज़ार। इनका जोड़ कुल latency है।' }
    ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — डेटा संचार व OSI के पक्के प्रश्न', html: '<p>लगभग हर पेपर में: <b>पाँच घटक</b> (message, sender, receiver, medium, protocol); <b>simplex/half/full duplex</b> के उदाहरण; <b>OSI की 7 परतें क्रम में + PDU</b> (Data, Segment/Datagram, Packet, Frame, Bit) + <b>उपकरण</b> (hub=1, switch=2, router=3, gateway=ऊपरी); <b>encapsulation</b> का क्रम; <b>TCP बनाम UDP</b>; <b>OSI बनाम TCP/IP</b> (5+6+7 → Application, 1+2 → Network Access); <b>port</b> — HTTP 80, HTTPS 443, FTP 21/20, SSH 22, SMTP 25, DNS 53, DHCP 67/68, POP3 110, IMAP 143, RDP 3389; <b>bandwidth ≠ throughput ≠ latency ≠ jitter</b>; <b>guided/unguided media</b> व fibre का लाभ; <b>topology</b> व full mesh का सूत्र n(n−1)/2; <b>circuit/packet switching</b> व FDM/TDM/WDM।</p>' },

    { type: 'pills', items: [
      { text: 'Physical → Data Link → Network → Transport → Session → Presentation → Application', kind: 'info' },
      { text: 'Bit · Frame · Packet · Segment · Data', kind: 'exam' },
      { text: 'Hub=1 · Switch=2 (MAC) · Router=3 (IP)', kind: 'tip' },
      { text: 'TCP भरोसेमंद · UDP तेज़', kind: 'ok' },
      { text: 'Bandwidth ≠ Throughput ≠ Latency', kind: 'warn' },
      { text: 'Full mesh links = n(n−1)/2', kind: 'info' }
    ] }
  ]
}
]);
