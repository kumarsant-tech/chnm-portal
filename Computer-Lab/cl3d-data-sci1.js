/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-sci1.js   (कंप्यूटर विज्ञान — भाग 1)
   विषय : sci-gens · sci-numbers
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   1. कंप्यूटर की पीढ़ियाँ और कंप्यूटर के प्रकार (sci-gens)
   =================================================================== */
{
  id: 'sci-gens', icon: '🕰️', group: 'कंप्यूटर विज्ञान',
  title: 'कंप्यूटर की पीढ़ियाँ और कंप्यूटर के प्रकार',
  sub: 'अबाकस से AI तक — पाँच पीढ़ियाँ, ENIAC–IBM की पूरी कहानी और सारी वर्गीकरण-पद्धतियाँ',
  kicker: 'Computer Science 1 · Generations & Classification of Computers',
  hero: 'यह पेज कंप्यूटर की <b>पूरी वंशावली</b> है — यांत्रिक यंत्रों से vacuum tube, transistor, IC, VLSI और AI तक की <b>पाँच पीढ़ियाँ (Generations)</b>, हर पीढ़ी की चाल, आकार, मेमोरी, कीमत, मशीनें और कमियाँ, और कंप्यूटर की <b>सारी classification</b> (analog/digital/hybrid, super से micro तक)। पढ़ने के बाद कोई भी मशीन या पुरानी तस्वीर देखकर बता सकेंगे कि वह <b>किस युग की है और किस वर्ग में आती है</b>।',
  tags: ['ऐतिहासिक टाइमलाइन', 'पाँच पीढ़ियाँ', 'ENIAC–UNIVAC–IBM', 'वर्गीकरण', 'सुपर कंप्यूटर व PARAM'],
  blocks: [

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.1</span> इतिहास की शुरुआत — गिनने से "गणना-यंत्र" तक</h3>
      <p>कंप्यूटर अचानक नहीं बना — हज़ारों साल तक इंसान गिनने के अपने सहारे बना रहा, फिर "गिनने का काम मशीन पर डालो" की सोच आई। परीक्षा में <b>पीढ़ियों से पहले के ये नाम</b> बार-बार पूछे जाते हैं, इसलिए हर एक का काम और साल पकड़ में रखें।</p>
      <ul>
        <li><b>Abacus (अबाकस / गणक-यंत्र):</b> कई हज़ार वर्ष पुरानी मानी जाने वाली मनकों (beads) वाली गिनने की सहायक-यंत्र। जोड़-घटाव मनके खिसकाकर होते हैं, पर इसमें <b>प्रोग्राम नहीं</b> होता — इसलिए इसे कंप्यूटर नहीं, calculating aid (गणना-सहायक) कहते हैं।</li>
        <li><b>Napier's Bones (नेपियर की हड्डियाँ, 1614):</b> स्कॉटलैंड के <b>John Napier</b> ने गुणनाई (multiplication) को छोटे-छोटे जोड़ में तोड़ने वाले नक्काशीदार डंडे बनाए — लघुगणक (logarithm) के आविष्कारक भी यही हैं।</li>
        <li><b>Pascaline (पास्कलिन, 1642):</b> फ़्रांस के <b>Blaise Pascal</b> ने 18–19 वर्ष की उम्र में दाँतेदार पहियों (gears) वाली जोड़-घटाव मशीन बनाई — टैक्स वसूली के पिता के काम के लिए। पहिया एक बार घूमकर "carry" अपने आप आगे भेजता था।</li>
        <li><b>Stepped Reckoner (1673–94 के आसपास):</b> <b>Gottfried Wilhelm Leibniz</b> ने ऐसी मशीन बनाई जो चारों बुनियादी क्रियाएँ (add, subtract, multiply, divide) कर सकती थी। इनको "आधुनिक कैलकुलेटर का दादा" कहा जाता है।</li>
        <li><b>Jacquard Loom (जैकार्ड करघा, 1804):</b> फ़्रांस के <b>Joseph Marie Jacquard</b> ने बुनाई का नक़शा <b>छेद वाले punched cards (पोच-कार्ड)</b> पर पढ़वाया। यंत्र बदला नहीं, <b>निर्देश कार्डों पर बदले</b> — यही "software" का सबसे पहला विचार है, और हर पीढ़ी के कंप्यूटर में punched card दशकों तक इनपुट-आउटपुट का साधन रही।</li>
        <li><b>Difference Engine (1822) व Analytical Engine (1837 का नक़शा):</b> <b>Charles Babbage</b> — जिन्हें "Father of the Computer (कंप्यूटर के जनक)" कहा जाता है। Difference Engine गणितीय तालिकाएँ (tables) अपने आप छापने के लिए था; Analytical Engine में <b>mill</b> (आज का CPU), <b>store</b> (memory), punched card इनपुट और conditional branching — यानी आधुनिक कंप्यूटर की पूरी हड्डी 100+ साल पहले नक़शे पर आ गई। बन न पाया — सटीक engineering और पैसों की कमी।</li>
        <li><b>Ada Lovelace:</b> Babbage की Analytical Engine पर काम करने वाली गणितज्ञ; Algorithm (एल्गोरिद्म) लिखने वाली पहली व्यक्ति — इन्हें <b>First Computer Programmer</b> कहा जाता है।</li>
        <li><b>Hollerith Tabulator (1890):</b> अमेरिकी जनगणना (census) में <b>Herman Hollerith</b> ने punched card + विद्युत-यांत्रिक टैबुलेटिंग मशीन लगाई, जिससे जनगणना कई साल पहले ख़त्म हुई। इनकी company 1896 → 1911 में CTR (Computing-Tabulating-Recording Company) → <b>1924 से IBM (International Business Machines)</b> — आज की IBM इसी से पैदा हुई।</li>
      </ul>
      <p>इन यंत्रों की सीख एक ही थी: <b>गिनने/तोड़ने का काम मशीन को दो, और निर्देश अलग से फ़ाइल (card) पर रखो</b>। बाक़ी पूरी कहानी यही दोनों बातें बड़ी होती गई हैं।</p>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.2</span> विद्युत-यांत्रिक से इलेक्ट्रॉनिक तक (1930–1946) — चार अग्रणी मशीनें</h3>
      <p>द्वितीय विश्व-युद्ध की गणनाओं (बैलिस्टिक tables, क्रैप्टो-एनालिसिस) ने कंप्यूटर को "शौक" से "ज़रूरत" बना दिया। इसी दौर में <b>vacuum tube (निर्वात नली)</b> स्विच बनकर बैठा — और यानी <b>प्रथम पीढ़ी</b> का जन्म।</p>
      <ul>
        <li><b>George Stibitz — Model I / Complex Number Calculator (1937–40, Bell Labs):</b> रिले (relay) से बनी पहली ऐसी मशीन जिसने "रिमोट टर्मिनल से भेजे गए निर्देश चलाए" — दूर से compute करवाने का पहला नमूना।</li>
        <li><b>Harvard Mark I / ASCR (1944):</b> <b>Howard Aiken</b> + IBM की Electromechanical मशीन — 51 फ़ुट लंबी, लाखों रिले-स्विच, paper-tape इनपुट। पूरी तरह यांत्रिक-विद्युत, अत्यंत धीमी पर भरोसेमंद; 15+ वर्ष चली।</li>
        <li><b>Atanasoff–Berry Computer / ABC (1942):</b> Iowa State में <b>John Vincent Atanasoff</b> व Clifford Berry की पहली <b>इलेक्ट्रॉनिक</b> digital computing machine — vacuum tubes और capacitive (संधारित्र) memory, binary अंक; पर programmed नहीं की जा सकती थी। बाद में ENIAC वाले केस में Atanasoff को अदालत से "पहला इलेक्ट्रॉनिक कंप्यूटर" का श्रेय मिला।</li>
        <li><b>Colossus (1943, Bletchley Park):</b> <b>Tommy Flowers</b> की vacuum-tube मशीन — जर्मन Lorenz cipher तोड़ने के लिए <b>विशेष-उद्देश्य (special purpose)</b> बनी; अस्तित्व दशकों तक गुप्त रहा।</li>
        <li><b>Konrad Zuse — Z3 (1941, बर्लिन):</b> रिले-आधारित, पहली <b>कार्यशील programmable</b> कंप्यूटर — electronic नहीं थी, पर stored program/conditional jump का कॉन्सेप्ट दिख दिया।</li>
        <li><b>ENIAC (1945; सार्वजनिक 1946):</b> जे. प्रेस्पर एकर्ट व जॉन मौचली (University of Pennsylvania) की पहली सामान्य-उद्देश्य इलेक्ट्रॉनिक digital computer — अगले अनुभाग में विस्तार से।</li>
        <li><b>Stored-program का विचार (1945 का EDVAC report):</b> <b>John von Neumann</b> ने लिखाई में ठोस किया कि <b>प्रोग्राम भी डेटा की तरह ही मेमोरी में रखो</b>। यही "von Neumann architecture" — आज का हर सामान्य कंप्यूटर इसी सिद्धांत पर चलता है।</li>
      </ul>
      <p>परीक्षा-नज़र: <b>ABC = पहली electronic</b>, <b>Z3 = पहली programmable (relay)</b>, <b>ENIAC = पहली general-purpose electronic</b>, <b>Manchester Baby = पहली stored-program (1948)</b> — चारों अलग-अलग "पहला" हैं, एक-दूसरे से मिलाएँ नहीं।</p>` },

    { type: 'table', head: ['पीढ़ी', 'वर्ष (लगभग)', 'मुख्य पुर्ज़ा (switching device)', 'मेमोरी', 'चाल', 'आकार व बिजली', 'भाषा / इनपुट', 'उदाहरण मशीनें'],
      rows: [
        ['प्रथम (First)', '1940–1956', '<b>Vacuum Tube</b> (निर्वात नली)', 'चुंबकीय drum, delay line; कुछ KB', 'कुछ हज़ार निर्देश/सेकंड (milliseconds)', 'पूरा कमरा, टनों वज़न; 100+ kW, बहुत गर्मी', 'Machine language (0/1); punched card, paper tape', 'ENIAC, EDVAC, EDSAC, UNIVAC-I, IBM 701'],
        ['द्वितीय (Second)', '1956–1963', '<b>Transistor</b> (ट्रांजिस्टर)', 'Magnetic core memory; कुछ लाख byte', 'लाखों निर्देश/सेकंड (microseconds)', 'बड़ा अलमारी-कक्ष; कम बिजली, कम गर्मी', 'Assembly language; FORTRAN, COBOL; magnetic tape', 'IBM 1401, IBM 7090, CDC 1604, UNIVAC 1107'],
        ['तृतीय (Third)', '1964–1971', '<b>IC — Integrated Circuit</b> (SSI/MSI)', 'Semiconductor memory आने लगी; core के साथ', 'करोड़ों निर्देश/सेकंड (nanoseconds की ओर)', 'मिनी-कंप्यूटर का जन्म; एक कमरा/डेस्क', 'High-level भाषाएँ; OS, keyboard + monitor, multiprogramming', 'IBM System/360, PDP-8, PDP-11, CDC 6600'],
        ['चतुर्थ (Fourth)', '1971–आज तक', '<b>Microprocessor — VLSI/ULSI</b> (एक चिप पर पूरा CPU)', 'Semiconductor RAM; GB में', 'अरबों निर्देश/सेकंड; GHz क्लॉक', 'डेस्कटॉप → लैपटॉप → हथेली; वाट में बिजली', 'C, C++, Java, Python; GUI, mouse, network, Internet', 'Intel 4004 से Core/Ryzen; Apple II, IBM PC, हर स्मार्टफ़ोन'],
        ['पंचम (Fifth)', '1980s–वर्तमान व भविष्य', '<b>ULSI + parallel processing + AI</b>; प्रयोग में quantum/neuromorphic', 'बहुत बड़ी, distributed, cloud', 'पेटाफ़्लॉप्स (10^15) से एक्साफ़्लॉप्स (10^18)', 'क्लस्टर/डेटा-सेंटर; विशेष शीतलन', 'Natural language, knowledge-based, ML; voice व vision input', 'PARAM/Pratyush, Fugaku, Frontier, IBM Watson, quantum प्रोटोटाइप']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.3</span> प्रथम पीढ़ी भीतर से — vacuum tube का सुख-दुख</h3>
      <p><b>Vacuum tube</b> काँच की बनी नली थी जिसमें filament गर्म होकर इलेक्ट्रॉन छोड़ता था और plate की ओर बहता था — grid पर वोल्टेज देकर इस बहाव को चालू/बंद किया जा सकता था, यानी यह एक <b>स्विच</b> बन गया। ENIAC में ऐसे लगभग <b>17,468 tube</b>, 7,200 crystal diode, 1,500 relay, 70,000 resistor और 10,000 capacitor लगे थे; वज़न करीब <b>27 टन</b>, जगह करीब <b>167 वर्ग-मीटर</b>, बिजली करीब <b>150 kW</b>।</p>
      <p>इससे तीन सीधे नतीजे निकले जिन्हें परीक्षा में कारण-सहित लिखना होता है:</p>
      <ul>
        <li><b>बहुत गर्मी और बहुत ख़राबी:</b> filament जलता था तो टूटता भी था। कहावत है कि ENIAC में हर कुछ घंटों में एक tube बदलना पड़ता था — इसलिए मशीन को चालू रखने के लिए tube को कभी पूरी तरह ठंडा नहीं होने दिया जाता था। <b>MTBF (Mean Time Between Failures)</b> बहुत कम थी।</li>
        <li><b>प्रोग्राम करना = तार जोड़ना:</b> ENIAC में प्रोग्राम <b>plug-board और switch</b> से सेट होता था; एक नया काम करने में कई दिन लगते थे। यानी software अभी hardware के अंदर ही था।</li>
        <li><b>आकार व लागत:</b> केवल सरकार, सेना और बड़े विश्वविद्यालय ही ख़रीद सकते थे। आम आदमी की पहुँच से बहुत दूर।</li>
      </ul>
      <p><b>UNIVAC-I (1951)</b> पहला <b>व्यावसायिक (commercial)</b> कंप्यूटर था — Remington Rand ने बेचा, पहली ख़रीद अमेरिकी जनगणना ब्यूरो ने की। 1952 के राष्ट्रपति चुनाव का नतीजा TV पर पहले बताकर यह मशहूर हुआ। <b>भारत का पहला कंप्यूटर</b> भी इसी पीढ़ी का था — <b>Siddhartha</b> (ISI कलकत्ता, 1950s के अंत में बना छोटा analog/digital प्रयोग) और बाद में <b>TIFRAC</b> (1960, TIFR मुंबई)।</p>` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.4</span> द्वितीय व तृतीय पीढ़ी — transistor से IC तक की छलांग</h3>
      <p><b>Transistor (1947, Bell Labs — Bardeen, Brattain, Shockley; 1956 में Nobel)</b> ने vacuum tube की जगह ली। यह semiconductor (germanium, फिर silicon) का छोटा टुकड़ा था जिसमें कोई filament नहीं, कोई गर्म काँच नहीं। फ़ायदे साफ़ थे: <b>आकार में बहुत छोटा, बिजली बहुत कम, गर्मी कम,जल्दी ख़राब नहीं — भरोसा ज़्यादा, और सस्ता</b>। इसी एक पुर्ज़े ने कंप्यूटर को "कमरे की मशीन" से "अलमारी की मशीन" बना दिया।</p>
      <p>द्वितीय पीढ़ी की दो और देन हैं जिन्हें अक्सर भूल जाते हैं: (1) <b>magnetic core memory</b> — छोटे-छोटे चुंबकीय छल्लों में bit रखना, जो बिजली जाने पर भी मान नहीं खोता था (non-volatile); (2) <b>assembly language और पहली high-level भाषाएँ</b> — <b>FORTRAN (1957, John Backus/IBM)</b> वैज्ञानिक गणना के लिए, <b>COBOL (1959, Grace Hopper की अगुवाई वाली समिति)</b> व्यापारिक डेटा के लिए, <b>ALGOL</b> यूरोप में। अब प्रोग्राम इंसान-पढ़ने लायक होने लगा।</p>
      <p><b>IC (Integrated Circuit, 1958–59)</b> — <b>Jack Kilby (Texas Instruments)</b> और स्वतंत्र रूप से <b>Robert Noyce (Fairchild)</b> ने एक ही silicon chip पर कई transistor, resistor, capacitor बना दिए। Kilby को 2000 में Nobel मिला। IC के दो शुरुआती स्तर थे: <b>SSI (Small Scale Integration — कुछ dozen gate)</b> और <b>MSI (Medium Scale — सैकड़ों gate)</b>। तृतीय पीढ़ी इन्हीं पर चली।</p>
      <p>तृतीय पीढ़ी का सबसे बड़ा सामाजिक बदलाव था <b>मिनी-कंप्यूटर</b> — <b>DEC PDP-8 (1965)</b> इतना सस्ता कि एक विभाग/प्रयोगशाला अपने लिए ख़रीद सके। साथ में <b>operating system, multiprogramming, time-sharing</b> आए और पहली बार <b>keyboard + monitor</b> से सीधा संवाद हुआ। <b>IBM System/360 (1964)</b> ने "एक ही family में छोटे-बड़े सब, software compatible" का विचार दिया — यही आज भी चले आ रहा product-line सोच का आधार है। <b>CDC 6600 (1964, Seymour Cray)</b> को पहला सफल <b>supercomputer</b> माना जाता है।</p>` },

    { type: 'table', head: ['मशीन', 'वर्ष', 'किसने बनाई', 'क्यों याद रखी जाती है'],
      rows: [
        ['ABC (Atanasoff–Berry)', '1942', 'Atanasoff व Berry, Iowa State', 'पहली <b>इलेक्ट्रॉनिक</b> digital computing मशीन (programmable नहीं)'],
        ['Colossus', '1943', 'Tommy Flowers, Bletchley Park', 'जर्मन cipher तोड़ने वाली विशेष-उद्देश्य tube मशीन; वर्षों गुप्त रही'],
        ['Harvard Mark I', '1944', 'Howard Aiken + IBM', 'विशाल electromechanical (relay) मशीन; paper-tape इनपुट'],
        ['ENIAC', '1945–46', 'Eckert व Mauchly, Univ. of Pennsylvania', 'पहली <b>general-purpose electronic</b> digital computer; 17,468 tube'],
        ['EDVAC', '1949 (report 1945)', 'Eckert, Mauchly, von Neumann', '<b>stored-program</b> विचार का पहला व्यावहारिक नमूना; binary'],
        ['Manchester Baby (SSEM)', '1948', 'Williams व Kilburn, Manchester', 'पहली मशीन जिसने प्रोग्राम <b>मेमोरी में रखकर चलाया</b>'],
        ['EDSAC', '1949', 'Maurice Wilkes, Cambridge', 'पहला व्यावहारिक stored-program कंप्यूटर जो रोज़ काम आया'],
        ['UNIVAC-I', '1951', 'Remington Rand (Eckert–Mauchley)', 'पहला <b>व्यावसायिक</b> कंप्यूटर; जनगणना व चुनाव-पूर्वानुमान'],
        ['IBM 701 / 7090', '1952 / 1959', 'IBM', 'पहली बड़ी व्यावसायिक scientific लाइन; 7090 transistor वाली'],
        ['IBM 1401', '1959', 'IBM', 'सबसे ज़्यादा बिकने वाली दूसरी-पीढ़ी की business मशीन'],
        ['CDC 6600', '1964', 'Seymour Cray, CDC', 'पहला सफल supercomputer; peripheral processor का विचार'],
        ['IBM System/360', '1964', 'IBM', 'compatible family + OS/360; mainframe का आधुनिक रूप'],
        ['PDP-8', '1965', 'DEC (Digital Equipment Corp.)', 'पहला सफल <b>minicomputer</b> — सस्ता, छोटा'],
        ['PDP-11', '1970', 'DEC', 'वह मशीन जिस पर <b>Unix और C</b> का विकास हुआ'],
        ['Intel 4004', '1971', 'Intel (Faggin, Hoff, Mazor, Shima)', 'पहला <b>microprocessor</b> — 4-bit, 2,300 transistor, 740 kHz'],
        ['Altair 8800', '1975', 'MITS (Intel 8080 पर)', 'पहला लोकप्रिय <b>personal computer kit</b>; Microsoft की पहली भाषा इसी पर'],
        ['Apple II', '1977', 'Apple (Wozniak/Jobs)', 'रंगीन ग्राफ़िक्स व plastic केस वाला पहला बड़ा सफल घरेलू कंप्यूटर'],
        ['IBM PC (5150)', '1981', 'IBM (Intel 8088, MS-DOS)', '"PC" शब्द का मानक; खुली architecture से clone उद्योग खड़ा हुआ'],
        ['Apple Macintosh', '1984', 'Apple', 'आम लोगों तक <b>GUI + mouse</b> पहुँचाने वाली पहली बड़ी सफल मशीन'],
        ['Cray-1 / PARAM 8000', '1976 / 1991', 'Cray / C-DAC भारत', 'vector supercomputer / भारत का पहला स्वदेशी supercomputer']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.5</span> चतुर्थ पीढ़ी — microprocessor ने कंप्यूटर को हथेली में रख दिया</h3>
      <p>1971 में Intel ने <b>4004</b> निकाला — एक चिप पर पूरा CPU। यह <b>LSI → VLSI → ULSI</b> की यात्रा थी: पहले हज़ारों, फिर लाखों, फिर करोड़ों-अरबों transistor एक chip पर। इसे <b>Moore's Law</b> से समझिए — <b>Gordon Moore (Intel सह-संस्थापक, 1965)</b> ने देखा कि chip पर transistor की संख्या लगभग <b>हर 18–24 महीने में दोगुनी</b> होती है। यह कोई भौतिक नियम नहीं, उद्योग की योजना-बनाने की प्रवृत्ति थी; 2010 के बाद इसकी रफ़्तार धीमी पड़ी क्योंकि बिजली/गर्मी (power wall) और transistor का आकार परमाणु-स्तर के पास पहुँच गया।</p>
      <p>चतुर्थ पीढ़ी की असली क्रांति hardware से ज़्यादा <b>पहुँच</b> की थी: कंप्यूटर सस्ता हुआ तो घर, दुकान, स्कूल, दफ़्तर हर जगह पहुँचा। इसके चार स्तंभ याद रखें — <b>personal computer (PC)</b>, <b>GUI (Graphical User Interface)</b>, <b>mouse व keyboard</b>, और <b>network/Internet</b>। Xerox PARC में बना Alto (1973) पहला GUI-माउस वाला कंप्यूटर था; Apple ने Lisa/Mac से इसे बाज़ार तक पहुँचाया और Microsoft ने Windows से हर PC पर।</p>
      <p>Software भी इसी दौर में पका: <b>C (1972, Dennis Ritchie)</b>, <b>C++ (1983, Bjarne Stroustrup)</b>, <b>Java (1995, James Gosling)</b>, <b>Python (1991, Guido van Rossum)</b>, <b>JavaScript (1995, Brendan Eich)</b>। <b>Unix (1969, Ken Thompson व Dennis Ritchie, Bell Labs)</b> से आगे चलकर Linux (1991, Linus Torvalds) और macOS/BSD की परंपराएँ निकलीं।</p>` },

    { type: 'table', head: ['चिप', 'वर्ष', 'Bit', 'Transistor (लगभग)', 'क्लॉक', 'खास बात'],
      rows: [
        ['Intel 4004', '1971', '4-bit', '2,300', '740 kHz', 'पहला commercial microprocessor; कैलकुलेटर के लिए'],
        ['Intel 8008 / 8080', '1972 / 1974', '8-bit', '3,500 / 6,000', '500 kHz–2 MHz', '8080 ने Altair व शुरुआती PC जन्मे'],
        ['MOS 6502 / Zilog Z80', '1975 / 1976', '8-bit', '~3,500 / ~8,500', '1–4 MHz', 'Apple I/II, Commodore, ZX Spectrum की जान; सस्ते'],
        ['Intel 8086 / 8088', '1978 / 1979', '16-bit', '29,000', '5–10 MHz', '<b>x86 architecture का जन्म</b>; IBM PC में 8088'],
        ['Intel 80286', '1982', '16-bit', '134,000', '6–20 MHz', 'protected mode, 16 MB तक memory'],
        ['Intel 80386', '1985', '32-bit', '275,000', '16–33 MHz', '32-bit, virtual memory, multitasking की नींव'],
        ['Intel 80486 / Pentium', '1989 / 1993', '32-bit', '12 लाख / 31 लाख', '25–100 MHz+', '486 में on-chip cache व FPU; Pentium superscalar'],
        ['Pentium Pro → Core 2', '1995–2006', '32/64-bit', '55 लाख → 29 करोड़', '150 MHz–3 GHz', 'out-of-order execution; Core 2 ने multi-core आम किया'],
        ['Intel Core i / AMD Ryzen', '2008–आज', '64-bit', 'अरबों (chiplet सहित)', '3–6 GHz', 'multi-core, integrated GPU, बड़ा cache, SMT'],
        ['Apple M-शृंखला / ARM server', '2020–आज', '64-bit (ARM)', '16–134 अरब (M2 Ultra आदि)', '~3–4 GHz', 'SoC — CPU+GPU+memory एक पैकेज में; वाट में दक्षता']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.6</span> पंचम पीढ़ी — AI, parallel processing और आगे की राह</h3>
      <p>पंचम पीढ़ी की परिभाषा पुर्ज़े से नहीं, <b>क्षमता</b> से होती है: मशीन इंसान की तरह <b>सोच-समझकर, सीखकर और प्राकृतिक भाषा में बात करके</b> काम करे। जापान ने 1982 में <b>Fifth Generation Computer Systems (FGCS)</b> परियोजना शुरू की थी — लक्ष्य था knowledge-based, logic-programming (Prolog) वाली parallel मशीन। वह अपने मूल लक्ष्य में पूरी नहीं उतरी, पर इसने दुनिया भर में AI व parallel computing पर निवेश बढ़ा दिया।</p>
      <p>आज इस पीढ़ी के चार व्यावहारिक चेहरे हैं:</p>
      <ul>
        <li><b>Parallel processing व supercomputing:</b> हज़ारों-लाखों core एक साथ; <b>FLOPS</b> में नापते हैं। <b>Frontier (ORNL, 2022)</b> पहला आधिकारिक <b>exascale</b> सिस्टम था (10^18 floating-point operations/सेकंड)। जापान का <b>Fugaku</b> ARM-आधारित है।</li>
        <li><b>Artificial Intelligence / Machine Learning:</b> डेटा से नियम खुद सीखना। बड़े भाषा-मॉडल (LLM), computer vision, speech recognition — सब GPU/TPU/NPU पर चलते हैं। यही वह तकनीक है जिससे यह पाठ्य-सामग्री बनाने में भी मदद मिली।</li>
        <li><b>Quantum computing:</b> bit की जगह <b>qubit</b>, जो superposition व entanglement से एक साथ कई अवस्थाएँ रख सकता है। कुछ ख़ास समस्याओं (factorisation, simulation, optimisation) पर बहुत तेज़; पर अभी ठंडक (mK), error-correction और स्थिरता बड़ी बाधाएँ हैं। रोज़ के काम का कंप्यूटर नहीं बदलेगा।</li>
        <li><b>Neuromorphic व edge AI:</b> दिमाग़ के neuron जैसा hardware (Spiking Neural Network), और फ़ोन/कैमरे के अंदर ही AI (NPU) ताकि डेटा cloud तक न जाए।</li>
      </ul>
      <p><b>सावधानी:</b> पुस्तकों में पंचम पीढ़ी की वर्ष-सीमा अलग-अलग मिलती है (कहीं 1980s–आज, कहीं 1990s–भविष्य)। उत्तर में <b>"ULSI, parallel processing और AI — यही पंचम पीढ़ी की पहचान है"</b> लिखना सबसे सुरक्षित है; वर्ष को "लगभग" के साथ दें।</p>` },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — पीढ़ियाँ (सबसे ज़्यादा अंक यहीं से)', html: '<p>हर पीढ़ी का <b>एक पुर्ज़ा + एक उदाहरण + एक कमी</b> रट लीजिए: प्रथम = <b>vacuum tube</b>, ENIAC/UNIVAC, कमी = गर्मी/आकार/ख़राबी; द्वितीय = <b>transistor</b>, IBM 1401, लाभ = छोटा/सस्ता/कम गर्मी; तृतीय = <b>IC</b>, IBM 360/PDP-8, लाभ = mini + OS + keyboard-monitor; चतुर्थ = <b>microprocessor (VLSI)</b>, Intel 4004/IBM PC, लाभ = PC व GUI; पंचम = <b>ULSI + AI + parallel</b>, PARAM/Frontier। साथ में ये "पहला" अलग-अलग हैं — <b>ABC</b> पहली electronic, <b>Z3</b> पहली programmable, <b>ENIAC</b> पहली general-purpose electronic, <b>Manchester Baby</b> पहली stored-program, <b>UNIVAC-I</b> पहली commercial, <b>Intel 4004</b> पहला microprocessor, <b>CDC 6600</b> पहला supercomputer। <b>Charles Babbage = Father of Computer</b>, <b>Ada Lovelace = पहली programmer</b>, <b>John von Neumann = stored-program concept</b>, <b>Moore = transistor दोगुना होने का नियम</b>।</p>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.7</span> वर्गीकरण — पहला आधार: काम करने का ढंग (data कैसे सँभालते हैं)</h3>
      <p>कंप्यूटर को तीन तरह से बाँटा जाता है, और प्रश्न में अक्सर यही तीनों आधार एक साथ पूछ लिए जाते हैं। पहला आधार है <b>कार्यप्रणाली / data representation</b>:</p>
      <ul>
        <li><b>Analog (अनुरूप):</b> लगातार बदलती भौतिक राशि (वोल्टेज, दाब, ताप, लंबाई) को नापकर काम करता है। मान <b>continuous</b> होते हैं, इसलिए नतीजा <b>अनुमानित (approximate)</b> होता है — सटीकता limited। उदाहरण: पुराना speedometer, thermometer-based controller, mercury/glass analog, <b>slide rule</b>, oscilloscope, ECG मशीन, petrol pump का पुराना मीटर।</li>
        <li><b>Digital (अंकीय):</b> मान को <b>असतत (discrete) अंकों — 0/1</b> में बदलकर गिनता/गणना करता है। नतीजा <b>सटीक (exact)</b>, प्रोग्राम बदलकर नया काम, डेटा store व copy आसान। आज के सारे PC, लैपटॉप, फ़ोन, कैलकुलेटर digital हैं।</li>
        <li><b>Hybrid (मिश्र):</b> दोनों का जोड़ — analog हिस्सा नापता है, digital हिस्सा गणना/नियंत्रण/दिखावट करता है। उदाहरण: <b>ICU का patient-monitoring system</b> (ECG analog → digital display), आधुनिक <b>petrol pump</b>, <b>digital weather station</b>, CT/MRI स्कैनर, कार का ECU, industrial process-control।</li>
      </ul>
      <p>एक लाइन में फ़र्क़ याद रखिए: <b>analog नापता है, digital गिनता है, hybrid दोनों करता है</b>।</p>` },

    { type: 'table', head: ['आधार', 'Analog', 'Digital', 'Hybrid'],
      rows: [
        ['डेटा का रूप', 'Continuous भौतिक राशि', 'Discrete अंक (binary 0/1)', 'Analog input + digital processing'],
        ['सटीकता', 'Approximate (सीमित)', 'Exact (जितनी bit उतनी सटीकता)', 'Digital जितनी, sensor पर निर्भर'],
        ['गति', 'वास्तविक-समय (real time) नाप', 'बहुत तेज़ गणना, पर clock-bound', 'दोनों का संतुलन'],
        ['प्रोग्राम बदलना', 'कठिन — hardware बदलना पड़े', 'आसान — software बदलो', 'मध्यम'],
        ['डेटा store करना', 'कठिन', 'आसान (file, DB, cloud)', 'digital हिस्से में आसान'],
        ['लागत', 'कम (सरल काम में)', 'काम के हिसाब से', 'ज़्यादा (दोनों subsystem)'],
        ['उदाहरण', 'Slide rule, speedometer, ECG trace, oscilloscope', 'PC, laptop, smartphone, calculator, ATM', 'ICU monitor, petrol pump, ECU, MRI, weather station'],
        ['कमी', 'शोर (noise) से मान बदल, drift', 'तेज़ बदलती राशि को sample करना पड़ता है (aliasing)', 'जटिल, calibration दोनों तरफ़']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.8</span> वर्गीकरण — दूसरा आधार: आकार, क्षमता व उपयोग</h3>
      <p>यही वह सूची है जिसे ITI/CBT में "computers के प्रकार" कहकर पूछा जाता है। क्रम <b>सबसे बड़े से सबसे छोटे</b> की ओर याद रखिए: <b>Super → Mainframe → Mini → Workstation → Micro (Personal) → Embedded/हथेली</b>।</p>
      <ul>
        <li><b>Supercomputer:</b> सबसे तेज़; हज़ारों core/नोड एक साथ (parallel)। काम — मौसम व जलवायु मॉडल, परमाणु simulation, तेल-खोज seismic data, अंतरिक्ष, drug discovery, cryptanalysis। नाप <b>FLOPS</b> में (peta/exascale)। उदाहरण — Frontier, Fugaku, भारत के PARAM/Pratyush/Mihir।</li>
        <li><b>Mainframe:</b> बहुत बड़ी मात्रा में <b>एक साथ हज़ारों user का I/O</b> सँभालने वाली भरोसेमंद मशीन। काम — बैंक का लेन-देन, बीमा, रेलवे/एयरलाइन आरक्षण, सरकारी कर-प्रणाली, bulk transaction। ज़ोर <b>throughput + reliability + security</b> पर, कच्ची गति पर नहीं। उदाहरण — IBM zSeries।</li>
        <li><b>Minicomputer (midrange):</b> mainframe से छोटा, micro से बड़ा; एक विभाग/छोटी कंपनी के लिए, कई terminal एक साथ। उदाहरण — DEC PDP-11, VAX, IBM AS/400 (आज IBM i)। यह श्रेणी आज server में समा गई है।</li>
        <li><b>Workstation:</b> दिखने में desktop पर अंदर से ज़्यादा ताक़त — तेज़ CPU, पेशेवर GPU, ECC RAM, बड़ी storage। काम — CAD/CAM, 3D animation, video editing, वैज्ञानिक visualization, software development। एक समय पर एक ही user (single-user, high performance)।</li>
        <li><b>Microcomputer / Personal Computer:</b> एक microprocessor वाला, एक user के लिए। इसके भेद — <b>desktop, laptop/notebook, tablet, smartphone, smartwatch, single-board computer (Raspberry Pi), game console</b>। सबसे ज़्यादा संख्या में यही हैं।</li>
        <li><b>Embedded computer:</b> किसी और मशीन के <b>अंदर छिपा</b> हुआ समर्पित कंप्यूटर — washing machine, microwave, कार का ECU, TV, router, CCTV, printer, medical device। एक ही काम, अक्सर real-time, बिना keyboard-monitor।</li>
      </ul>
      <p><b>तीसरा आधार — उद्देश्य (purpose):</b> <b>General-purpose</b> (प्रोग्राम बदलो, काम बदलो — PC, laptop) बनाम <b>Special-purpose</b> (एक ही काम के लिए बना — ATM, traffic-signal controller, कैलकुलेटर, digital thermometer, washing-machine controller)।</p>` },

    { type: 'table', head: ['प्रकार', 'आकार/लागत', 'User एक साथ', 'मुख्य ज़ोर', 'typical काम', 'उदाहरण'],
      rows: [
        ['Supercomputer', 'कमरा/हॉल; करोड़ों–अरबों रुपये', 'कुछ शोधकर्ता (job queue)', 'कच्ची गति — FLOPS', 'मौसम, परमाणु, अंतरिक्ष, AI training', 'Frontier, Fugaku, PARAM Rudra, Pratyush'],
        ['Mainframe', 'बड़े कक्ष; बहुत महँगा', 'हज़ारों–लाखों terminal/session', 'Throughput + भरोसा + security', 'बैंक लेन-देन, आरक्षण, बीमा, कर', 'IBM z16, Unisys Dorado'],
        ['Minicomputer / Midrange', 'अलमारी जितना', 'दर्जनों–सैकड़ों', 'विभाग-स्तरीय साझा computing', 'ERP, छोटा बैंक, फ़ैक्टरी नियंत्रण', 'PDP-11, VAX, IBM AS/400'],
        ['Server', 'रैक में 1U–4U', 'सैकड़ों–हज़ारों network client', 'सेवा देना (file/web/DB/mail)', 'वेबसाइट, database, email, cloud', 'Dell PowerEdge, HPE ProLiant'],
        ['Workstation', 'डेस्कटॉप जितना; महँगा', 'एक (कभी-कभी कुछ)', 'single-user उच्च प्रदर्शन + ECC', 'CAD, 3D, VFX, simulation', 'Dell Precision, HP Z, Lenovo ThinkStation'],
        ['Microcomputer (PC)', 'डेस्क/गोद; सबसे सस्ता', 'एक', 'लचीलापन — हर तरह का software', 'पढ़ाई, दफ़्तर, खेल, browsing', 'Desktop, laptop, tablet, फ़ोन, Raspberry Pi'],
        ['Embedded', 'चिप/बोर्ड — पुर्ज़े के अंदर', 'कोई सीधा user नहीं', 'एक काम, real-time, कम बिजली', 'washing machine, ECU, router, TV', 'Arduino, STM32, ESP32, कार ECU']
      ] },

    { type: 'kv', items: [
      { label: 'FLOPS', value: 'Floating-point Operations Per Second', desc: 'supercomputer की चाल का पैमाना — kilo, mega, giga, tera, peta (10^15), exa (10^18)' },
      { label: 'MIPS', value: 'Million Instructions Per Second', desc: 'पुराना चाल-मापक; आज core-count, clock व benchmark ज़्यादा अर्थ रखते हैं' },
      { label: 'Throughput', value: 'प्रति इकाई समय में पूरा हुआ काम', desc: 'mainframe की असली ताक़त — बहुत सारे छोटे काम एक साथ' },
      { label: 'Latency', value: 'एक काम शुरू से अंत तक लगा समय', desc: 'gaming व real-time control में यह ज़्यादा मायने रखता है' },
      { label: 'MTBF', value: 'Mean Time Between Failures', desc: 'भरोसे का औसत अंतराल — mainframe/server में बहुत ऊँचा चाहिए' },
      { label: 'Cluster / Grid / Cloud', value: 'जुड़े हुए कई कंप्यूटर एक साथ', desc: 'cluster = एक जगह तेज़ interconnect; grid = अलग-अलग जगह; cloud = किराए पर सेवा के रूप में' },
      { label: 'SoC', value: 'System on Chip', desc: 'CPU+GPU+modem+memory controller एक ही चिप — फ़ोन व पतले लैपटॉप की जान' },
      { label: 'Top500', value: 'दुनिया के 500 सबसे तेज़ supercomputer की सूची', desc: 'साल में दो बार (June व November) LINPACK benchmark पर छपती है' }
    ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.9</span> भारत की अपनी कंप्यूटर-यात्रा</h3>
      <p>भारत में कंप्यूटर आया तो आयात से, पर बहुत जल्द हमने खुद बनाना शुरू किया — और supercomputer के मामले में तो <b>मजबूरी ने आत्मनिर्भरता पैदा की</b>। यह कहानी परीक्षा व इंटरव्यू दोनों में पूछी जाती है।</p>
      <ul>
        <li><b>1950s–60s:</b> ISI कलकत्ता में <b>Siddhartha</b> नाम की छोटी मशीन; <b>TIFR मुंबई में TIFRAC (1960)</b> — देश में बनी पहली उल्लेखनीय इलेक्ट्रॉनिक कंप्यूटर परियोजना। इसके बाद दशकों तक विदेशी मशीनें (IBM, ICL) ही आती रहीं।</li>
        <li><b>1980s:</b> C-DOT/सरकारी प्रयास से स्वदेशी विकास की नींव; <b>1987 में अमेरिका ने Cray supercomputer बेचने से मना किया</b> (कारण: परमाणु/मौसम में इस्तेमाल का डर)। इसी रोक ने भारत को अपना बनाने पर मजबूर किया।</li>
        <li><b>1988:</b> <b>C-DAC (Centre for Development of Advanced Computing)</b> की स्थापना, पुणे — लक्ष्य था स्वदेशी supercomputer।</li>
        <li><b>1991:</b> <b>PARAM 8000</b> — भारत का पहला स्वदेशी supercomputer, C-DAC। उस दौर की दुनिया की तेज़ मशीनों के बराबर क्षमता, बहुत कम लागत पर। कुछ मशीनें विदेश निर्यात भी हुईं।</li>
        <li><b>आगे:</b> PARAM 9000, PARAM 10000 (parallel, cluster-based), PARAM Padma, PARAM Yuva, PARAM ISHAN; <b>2018 में Pratyush व Mihir</b> (IITM पुणे व NCMRWF नोएडा) — मौसम/जलवायु के लिए petaflop श्रेणी; <b>PARAM Siddhi-AI</b> (AI के लिए)।</li>
        <li><b>2022–आज:</b> <b>National Supercomputing Mission (NSM)</b> — C-DAC व IISc के नेतृत्व में देश भर के संस्थानों में supercomputer लगाना; <b>PARAM Rudra</b> शृंखला (2024) स्वदेशी motherboard/सर्वर के साथ; <b>AIRAWAT</b> (C-DAC, AI-focused, 2023–24)। लक्ष्य — exascale की ओर और अपना hardware ecosystem।</li>
      </ul>
      <p>एक वाक्य में: <b>"निर्यात-रोक ने C-DAC को जन्म दिया, C-DAC ने PARAM को, और PARAM ने भारत को supercomputing के नक़्शे पर ला खड़ा किया।"</b></p>` },

    { type: 'table', head: ['नाम', 'वर्ष', 'संस्था', 'किसलिए / ख़ासियत'],
      rows: [
        ['Siddhartha', '1950s के अंत', 'ISI कलकत्ता', 'देश में बनी शुरुआती छोटी गणना-मशीन'],
        ['TIFRAC', '1960', 'TIFR मुंबई', 'भारत की पहली उल्लेखनीय स्वदेशी इलेक्ट्रॉनिक कंप्यूटर परियोजना'],
        ['PARAM 8000', '1991', 'C-DAC पुणे', 'पहला स्वदेशी supercomputer; Cray रोक का जवाब; निर्यात भी हुआ'],
        ['PARAM 10000', '1998', 'C-DAC', 'cluster-based parallel supercomputing; सस्ते node से बड़ी क्षमता'],
        ['PARAM Padma / Yuva', '2002–2008', 'C-DAC', 'तेज़ interconnect, बेहतर scalability; Top500 में प्रविष्टि'],
        ['Pratyush / Mihir', '2018', 'IITM पुणे / NCMRWF नोएडा', 'petaflop श्रेणी — मौसम व जलवायु पूर्वानुमान के लिए समर्पित'],
        ['PARAM Siddhi-AI', '2020', 'C-DAC', 'AI/deep-learning के लिए GPU-आधारित'],
        ['PARAM Rudra शृंखला', '2024', 'NSM · C-DAC + IISc', 'स्वदेशी सर्वर/motherboard; HPC व खगोल/रक्षा में उपयोग'],
        ['AIRAWAT', '2023–24', 'C-DAC पुणे', 'AI-केंद्रित supercomputer; बड़े मॉडल की training']
      ] },

    { type: 'steps', items: [
      { n: 1, title: 'पहले switching device पहचानिए', text: 'मशीन की तस्वीर/विवरण में देखिए — काँच की नली (vacuum tube) दिखे तो प्रथम; छोटे धातु/प्लास्टिक के तीन-पैर वाले पुर्ज़े (transistor) तो द्वितीय; काली चौकोर चिप पर कई पैर (IC) तो तृतीय; एक बड़ी चिप पर पूरा CPU (microprocessor) तो चतुर्थ; और हज़ारों नोड का क्लस्टर + AI/parallel का ज़िक्र हो तो पंचम।', tips: ['यही एक कसौटी 90% प्रश्न हल कर देती है — बाक़ी सब इसी से निकलता है।'] },
      { n: 2, title: 'वर्ष से क्रॉस-चेक कीजिए', text: '1940–56 → प्रथम, 1956–63 → द्वितीय, 1964–71 → तृतीय, 1971 के बाद → चतुर्थ। वर्ष और पुर्ज़ा आपस में मेल न खाएँ तो पुर्ज़े को ज़्यादा भरोसेमंद मानिए, क्योंकि पुस्तकों में वर्ष-सीमाएँ थोड़ी अलग मिलती हैं।', warn: ['ENIAC (1945) प्रथम है, पर IBM PC (1981) चतुर्थ — केवल "पुराना है" सोचकर उत्तर न दें।'] },
      { n: 3, title: 'इनपुट/आउटपुट व भाषा से पुष्टि', text: 'Punched card + machine language → प्रथम। Magnetic tape + assembly/FORTRAN/COBOL → द्वितीय। Keyboard + monitor + OS + high-level भाषा → तृतीय। GUI + mouse + network + C/Java/Python → चतुर्थ। Voice/NLP/ML + parallel cluster → पंचम।', tips: ['दो स्वतंत्र संकेत मिल जाएँ तो उत्तर पक्का समझिए।'] },
      { n: 4, title: 'आकार से वर्ग तय कीजिए', text: 'पूरा कमरा/हॉल और FLOPS का ज़िक्र → supercomputer। हज़ारों terminal और बैंक/रेलवे का काम → mainframe। एक विभाग के दर्जनों user → mini/midrange। एक user पर CAD/3D → workstation। एक user, घर/दफ़्तर → microcomputer। किसी मशीन के अंदर छिपा एक-काम वाला → embedded।', tips: ['"तेज़" और "भरोसेमंद" अलग बात हैं — super तेज़ है, mainframe भरोसेमंद।'] },
      { n: 5, title: 'अंत में analog/digital/hybrid जाँचिए', text: 'नापने वाली भौतिक राशि पर सीधा काम → analog। 0/1 में गणना → digital। sensor से analog लेकर digital में गणना/दिखावट → hybrid (ICU monitor, petrol pump)।', warn: ['"digital" शब्द दिखते ही analog न मान लें — digital thermometer hybrid हो सकता है क्योंकि sensor analog है।'] }
    ] },

    { type: 'acc', title: 'FAQ — पीढ़ियाँ व वर्गीकरण', items: [
      { q: 'क्या पाँचवीं पीढ़ी सच में आ गई है?', a: 'हाँ, इस अर्थ में कि ULSI, parallel processing और AI वाली मशीनें आज चल रही हैं (PARAM, Frontier, Watson, LLM)। पर "इंसान जैसा पूरी तरह सोचने वाला कंप्यूटर" अभी शोध का विषय है। परीक्षा में परिभाषा लिखिए: <b>ULSI + parallel processing + AI/knowledge-based processing</b>।'},
      { q: 'Supercomputer और mainframe में असली फ़र्क़ क्या है?', a: '<b>Supercomputer = गति</b> — एक बहुत बड़ी गणना को टुकड़ों में बाँटकर हज़ारों core से जल्दी करना (FLOPS)। <b>Mainframe = throughput व भरोसा</b> — लाखों छोटे लेन-देन एक साथ, बिना रुके, सुरक्षित ढंग से (I/O, RAS — Reliability/Availability/Serviceability)। मौसम-मॉडल super पर, बैंक-लेन-देन mainframe पर।'},
      { q: 'क्या laptop, desktop और tablet अलग-अलग "प्रकार" हैं?', a: 'वर्गीकरण की दृष्टि से तीनों <b>microcomputer</b> ही हैं — फ़र्क़ केवल <b>form factor</b> (आकार-रूप) का है। इसी तरह smartphone व smartwatch भी microcomputer हैं। प्रश्न में "प्रकार" पूछा जाए तो श्रेणी लिखिए, "रूप" पूछा जाए तो form factor।'},
      { q: 'Server क्या mainframe है?', a: 'नहीं। Server एक <b>भूमिका</b> है (दूसरों को सेवा देना) — कोई भी microcomputer/workstation server बन सकता है। Mainframe एक <b>विशेष hardware श्रेणी</b> है। आज के data-center में हज़ारों commodity server मिलकर वही काम करते हैं जो पहले mainframe करता था, पर mainframe अब भी बैंकिंग में जीवित है क्योंकि उसका transaction-I/O व security स्तर अलग है।'},
      { q: 'Embedded और general-purpose में क्या अंतर है?', a: 'Embedded एक <b>तय काम</b> के लिए बना/प्रोग्राम किया जाता है, अक्सर real-time, user उसे computer की तरह इस्तेमाल नहीं करता (washing machine, ECU)। General-purpose में user प्रोग्राम बदलकर कोई भी काम करा सकता है (PC)। Embedded की संख्या दुनिया में PC से कई गुना ज़्यादा है।'},
      { q: 'Moore’s Law क्या अब टूट गया है?', a: "यह कोई भौतिक नियम नहीं था, उद्योग की प्रवृत्ति/योजना थी। transistor का आकार अब कुछ nanometre पर है, इसलिए <b>power wall</b> (गर्मी) व <b>quantum leakage</b> के कारण रफ़्तार धीमी हुई। अब लाभ transistor गिनने से नहीं, <b>multi-core, chiplet, विशेष accelerator (GPU/NPU), बेहतर packaging व software</b> से आता है।"},
      { q: 'Quantum computer क्या अब laptop की जगह लेगा?', a: 'नहीं। qubit बहुत नाज़ुक होते हैं (अत्यधिक ठंडक, error-correction चाहिए) और quantum केवल <b>कुछ ख़ास</b> समस्याओं पर लाभ देता है — factorisation, quantum simulation, कुछ optimisation। रोज़ का काम (document, browser, वीडियो) classical computer पर ही बेहतर है। दोनों साथ चलेंगे।'},
      { q: 'भारत का पहला कंप्यूटर कौन-सा था?', a: 'आयातित मशीनों में पहले विदेशी (IBM/ICL) आए। <b>स्वदेशी</b> प्रयासों में ISI कलकत्ता का <b>Siddhartha</b> और TIFR का <b>TIFRAC (1960)</b> शुरुआती नाम हैं; और <b>पहला स्वदेशी supercomputer PARAM 8000 (1991, C-DAC)</b> है। प्रश्न में "supercomputer" शब्द हो तो PARAM ही उत्तर है।'},
      { q: 'Analog कंप्यूटर आज भी कहीं काम आता है?', a: 'हाँ — जहाँ लगातार बदलती राशि को तुरंत नापना हो और बहुत सटीक गणना की ज़रूरत न हो: sensor front-end, analog signal processing, कुछ control loop, oscilloscope का analog हिस्सा। पर गणना/भंडारण का काम digital ही करता है, इसलिए व्यावहारिक प्रणालियाँ hybrid होती हैं।'},
      { q: 'पीढ़ी और वर्ग — दोनों एक साथ कैसे लिखें?', a: 'उदाहरण: "IBM 1401 — <b>द्वितीय पीढ़ी</b> (transistor), <b>mainframe श्रेणी</b>, <b>general-purpose digital</b> कंप्यूटर।" यानी तीन अलग-अलग सवालों के तीन अलग जवाब — इन्हें मिलाइए मत। यही पूरे प्रश्न को साफ़ कर देता है।'}
    ] },

    { type: 'pills', items: [
      { text: 'प्रथम = Vacuum Tube', kind: 'warn' },
      { text: 'द्वितीय = Transistor', kind: 'info' },
      { text: 'तृतीय = IC', kind: 'ok' },
      { text: 'चतुर्थ = Microprocessor (VLSI)', kind: 'exam' },
      { text: 'पंचम = ULSI + AI + Parallel', kind: 'tip' },
      { text: 'Analog नापता है · Digital गिनता है · Hybrid दोनों', kind: 'info' }
    ] },

    { type: 'labs', items: [
      { n: 100, title: 'पाँच पीढ़ियों की तुलना-चार्ट बनाना', aim: 'हर पीढ़ी का पुर्ज़ा, वर्ष, मेमोरी, चाल, आकार, भाषा और दो उदाहरण एक ही चार्ट में लिखकर पक्का करना।',
        tools: ['यह पेज (ऊपर की पीढ़ी-टेबल)', 'A4 शीट या spreadsheet', 'रंगीन पेन / highlighter'],
        steps: ['एक शीट पर 8 कॉलम बनाइए: पीढ़ी, वर्ष, पुर्ज़ा, मेमोरी, चाल, आकार/बिजली, भाषा, उदाहरण।', 'पाँचों पंक्तियाँ भरिए — पहले पुर्ज़े वाला कॉलम, बाक़ी उसी से निकालिए।', 'हर पीढ़ी की <b>एक कमी</b> लाल पेन से लिखिए (गर्मी, आकार, लागत, power-wall, जटिलता)।', 'अंत में बिना देखे चार्ट दोबारा भरिए और मिलाइए — जहाँ भूल हो वही आपका कमज़ोर बिंदु है।'],
        result: 'एक भरा हुआ चार्ट + दोहराव-परीक्षण; किसी भी पीढ़ी का नाम सुनते ही पुर्ज़ा व उदाहरण तुरंत याद आना।' },
      { n: 101, title: '"पहला" वालों की अलग-अलग सूची', aim: 'ABC, Z3, ENIAC, Manchester Baby, UNIVAC-I, CDC 6600, Intel 4004 — हर "पहला" किस बात में पहला था, यह अलग करना।',
        tools: ['ऊपर की ऐतिहासिक-मशीन टेबल', 'नोटबुक'],
        steps: ['हर मशीन के आगे केवल <b>एक वाक्य</b> लिखिए जिसमें "पहला/पहली" शब्द हो।', 'ध्यान दीजिए कि शर्त अलग है — electronic, programmable, general-purpose, stored-program, commercial, supercomputer, microprocessor।', 'किसी सहपाठी को केवल शर्त पढ़कर सुनाइए और मशीन का नाम पूछिए; फिर उलटा कीजिए।', 'जोड़ ग़लत हो तो उसी जोड़ी को तीन बार लिखिए।'],
        result: 'सातों "पहला" सही शर्त के साथ; परीक्षा में इन्हें आपस में मिलाने की ग़लती ख़त्म।' },
      { n: 102, title: 'आस-पास की 10 मशीनों का वर्गीकरण', aim: 'असली वस्तुओं को देखकर analog/digital/hybrid, आकार-श्रेणी और purpose — तीनों आधार लगाना।',
        tools: ['लैब/घर की वस्तुएँ — PC, laptop, फ़ोन, washing machine, router, digital thermometer, petrol pump की तस्वीर, ATM, CCTV, smartwatch', 'नोटबुक'],
        steps: ['10 वस्तुओं की सूची बनाइए।', 'हर एक के लिए तीन कॉलम भरिए: (a) analog/digital/hybrid, (b) super/mainframe/mini/workstation/micro/embedded, (c) general/special purpose।', 'हर उत्तर के पीछे <b>एक कारण</b> लिखिए (जैसे "washing machine = embedded क्योंकि एक तय काम, अंदर छिपा controller")।', 'दो सहपाठियों से तुलना कीजिए; जहाँ मतभेद हो, कारण पढ़कर तय कीजिए।'],
        result: '10 वस्तुओं का कारण-सहित वर्गीकरण; वर्गीकरण के तीनों आधार अलग-अलग समझ में आ जाना।' }
    ] },

    { type: 'quiz', store: 'sci-gens', items: [
      { q: 'प्रथम पीढ़ी के कंप्यूटर में कौन-सा पुर्ज़ा मुख्य switching device था?', o: ['Transistor', 'Vacuum tube', 'Integrated Circuit', 'Microprocessor'], a: 1, ex: 'प्रथम पीढ़ी (1940–56) vacuum tube पर चली — ENIAC में लगभग 17,468 नलियाँ थीं; इसी से गर्मी, आकार और ख़राबी की समस्या आई।' },
      { q: 'Charles Babbage को क्या कहा जाता है?', o: ['Father of the Computer', 'Father of the Internet', 'पहला programmer', 'IC के आविष्कारक'], a: 0, ex: 'Babbage ने Difference Engine व Analytical Engine (mill + store + punched card) का नक़शा दिया — आधुनिक कंप्यूटर की हड्डी। पहली programmer Ada Lovelace थीं।' },
      { q: 'पहला व्यावसायिक (commercial) कंप्यूटर कौन-सा था?', o: ['ENIAC', 'EDSAC', 'UNIVAC-I', 'IBM 360'], a: 2, ex: 'UNIVAC-I (1951, Remington Rand) पहली बेची गई व्यावसायिक मशीन थी; पहली ख़रीद अमेरिकी जनगणना ब्यूरो ने की।' },
      { q: 'द्वितीय पीढ़ी की पहचान किस पुर्ज़े से है?', o: ['IC', 'Transistor', 'VLSI', 'Vacuum tube'], a: 1, ex: '1947 में Bell Labs में बना transistor दूसरी पीढ़ी (1956–63) का आधार बना — छोटा, कम बिजली, कम गर्मी, ज़्यादा भरोसेमंद।' },
      { q: 'Intel 4004 (1971) क्या था?', o: ['पहला microprocessor (4-bit)', 'पहला supercomputer', 'पहली IC', 'पहला transistor'], a: 0, ex: '4004 पहला commercial microprocessor था — 4-bit, लगभग 2,300 transistor, 740 kHz। इसी से चतुर्थ पीढ़ी शुरू मानी जाती है।' },
      { q: 'ICU का patient-monitoring system किस श्रेणी में आता है?', o: ['Analog', 'Digital', 'Hybrid', 'Special-purpose analog'], a: 2, ex: 'ECG/दाब जैसे analog संकेत नापे जाते हैं और digital हिस्सा गणना, display व alarm करता है — इसलिए hybrid।' },
      { q: 'Mainframe की मुख्य ताक़त क्या है?', o: ['सबसे ऊँची FLOPS', 'बहुत सारे लेन-देन एक साथ, भरोसे व सुरक्षा के साथ', 'सबसे छोटा आकार', 'केवल gaming'], a: 1, ex: 'Mainframe throughput + reliability + security के लिए जाना जाता है (बैंक, आरक्षण)। कच्ची गति supercomputer की पहचान है।' },
      { q: 'भारत का पहला स्वदेशी supercomputer कौन-सा था?', o: ['Pratyush', 'PARAM 8000', 'TIFRAC', 'AIRAWAT'], a: 1, ex: 'C-DAC पुणे ने 1991 में PARAM 8000 बनाया — 1987 में Cray बेचने से मना करने के बाद भारत ने अपना रास्ता चुना।' },
      { q: 'Moore\'s Law किस बारे में है?', o: ['चिप पर transistor की संख्या लगभग हर 18–24 माह में दोगुनी होना', 'बिजली की खपत दोगुनी होना', 'RAM हर साल आधी होना', 'Internet की गति'], a: 0, ex: 'Gordon Moore (1965) की यह प्रवृत्ति/योजना थी, भौतिक नियम नहीं; power-wall के कारण अब इसकी रफ़्तार धीमी है।' },
      { q: 'Washing machine के अंदर लगा controller किस प्रकार का कंप्यूटर है?', o: ['Supercomputer', 'Mainframe', 'Workstation', 'Embedded computer'], a: 3, ex: 'एक तय काम के लिए, मशीन के अंदर छिपा, real-time, कम बिजली — यही embedded computer है।' },
      { q: 'पहली stored-program मशीन कौन-सी मानी जाती है?', o: ['ENIAC', 'Manchester Baby (SSEM), 1948', 'UNIVAC-I', 'ABC'], a: 1, ex: 'Manchester Baby ने पहली बार प्रोग्राम को मेमोरी में रखकर चलाया। विचार von Neumann के 1945 के EDVAC report से आया।' },
      { q: 'पंचम पीढ़ी की सही पहचान क्या है?', o: ['केवल vacuum tube', 'केवल transistor', 'ULSI + parallel processing + AI', 'केवल magnetic core'], a: 2, ex: 'पंचम पीढ़ी पुर्ज़े से नहीं, क्षमता से परिभाषित होती है — knowledge-based/AI processing, natural language, massive parallelism।' }
    ] },

    { type: 'callout', kind: 'tip', title: 'एक मिनट का रिवीज़न', html: '<p><b>पाँच पुर्ज़े:</b> Tube → Transistor → IC → Microprocessor → ULSI+AI। <b>पाँच उदाहरण:</b> ENIAC → IBM 1401 → IBM 360/PDP-8 → IBM PC/Intel 4004 → PARAM/Frontier। <b>तीन वर्गीकरण-आधार:</b> (1) analog/digital/hybrid, (2) super/mainframe/mini/workstation/micro/embedded, (3) general/special purpose। <b>तीन नाम:</b> Babbage (जनक), Ada Lovelace (पहली programmer), von Neumann (stored-program)। <b>भारत:</b> C-DAC → PARAM 8000 (1991) → Pratyush/Mihir (2018) → NSM/PARAM Rudra।</p>' }
  ]
},

/* ===================================================================
   2. संख्या पद्धतियाँ (sci-numbers)
   =================================================================== */
{
  id: 'sci-numbers', icon: '🔢', group: 'कंप्यूटर विज्ञान',
  title: 'संख्या पद्धतियाँ — Decimal, Binary, Octal, Hexadecimal',
  sub: 'Base और PLACE VALUE से लेकर complement विधि, ASCII/ISCII/Unicode और parity तक — पूरा हिसाब',
  kicker: 'Computer Science 2 · Number Systems & Codes',
  hero: 'यह पेज कंप्यूटर की <b>अपनी बोली — binary</b> का पूरा व्याकरण है: क्यों binary, base और स्थानीय मान (place value), <b>चारों पद्धतियों में आपस में रूपांतरण</b> पूरी चरण-गणना के साथ, binary जोड़-घटाव-गुणना-भाग, <b>1’s व 2’s complement</b>, bit/nibble/byte, <b>ASCII–ISCII–Unicode</b> (देवनागरी coding तक), octal file permission और parity/checksum की शुरुआत।',
  tags: ['BASE व PLACE VALUE', 'CONVERSION के STEPS', 'COMPLEMENT विधि', 'ASCII–ISCII–UNICODE', 'PARITY व CHECKSUM'],
  blocks: [

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.1</span> binary ही क्यों — flip-flop का तर्क</h3>
      <p>कंप्यूटर गणित का देवता नहीं, <b>स्विचों का ढेर</b> है। हर बुनियादी memory-element <b>flip-flop (द्वि-स्थायी धारा-परिवर्ती circuit)</b> होता है, जिसके केवल <b>दो स्थायी state</b> हो सकते हैं — चालू (ON = 1) या बंद (OFF = 0)। जब हार्डवेयर ही दो-अवस्था का है, तो बोली भी दो-अंकी होनी चाहिए: <b>binary number system — Base 2</b> (अंक सिर्फ़ 0 और 1)।</p>
      <p>दो स्तर का सबसे बड़ा लाभ है <b>noise immunity (शोर-सहिष्णुता)</b> — वोल्टेज थोड़ा ऊपर-नीचे हो जाए तो भी "0 है या 1" पहचान में फ़र्क़ नहीं पड़ता, क्योंकि सिर्फ़ एक तय थ्रेशोल्ड पार करना है। अगर 10 स्तर (decimal) रखने होते तो वोल्टेज की 10 श्रेणियाँ बनाकर हर स्तर को सँभालना पड़ता — महँगा, नाज़ुक और गलती वाला काम। इसीलिए 0–9 का सुविधाजनक decimal संसार के बाहर, कंप्यूटर के अंदर सब कुछ 0/1 है।</p>
      <p>ऐतिहासिक दो नाम याद रखें — <b>Leibniz</b> ने 1703 में binary अंकगणित को यूरोप में प्रस्तुत किया, और <b>1937–38 में Claude Shannon</b> ने अपनी MIT थीसिस में <b>Boolean algebra (बूलियन बीजगणित)</b> को electrical switching से जोड़ा — "सत्य/असत्य = ON/OFF"। इसी एक जोड़ से digital computer का गणितीय आधार बना।</p>
      <table class="tbl">
        <tr><th>पद्धति</th><th>Base (आधार)</th><th>उपयोग अंक</th><th>एक अंक का weight</th><th>कहाँ मिलती है</th></tr>
        <tr><td>Decimal (दशमलव)</td><td>10</td><td>0 1 2 3 4 5 6 7 8 9</td><td>10^0, 10^1, 10^2…</td><td>इंसान का रोज़ का हिसाब</td></tr>
        <tr><td>Binary (द्विआधारी)</td><td>2</td><td>0, 1</td><td>2^0, 2^1, 2^2…</td><td>मशीन की असली बोली — हर bit</td></tr>
        <tr><td>Octal (अष्टाधारी)</td><td>8</td><td>0 से 7</td><td>8^0, 8^1, 8^2…</td><td>पुराने Unix permission, छोटी binary शॉर्टहैंड</td></tr>
        <tr><td>Hexadecimal (षोडशांक)</td><td>16</td><td>0–9 और A=10, B=11, C=12, D=13, E=14, F=15</td><td>16^0, 16^1, 16^2…</td><td>Memory address, रंग कोड, byte dump, assembly</td></tr>
      </table>` },

    { type: 'table', head: ['पद्धति', 'Base', 'अंक', 'स्थानों का weight (दाएँ से बाएँ)', 'एक अंक में कितनी bit', 'उदाहरण (एक ही मान = 255)', 'कहाँ इस्तेमाल'],
      rows: [
        ['Decimal (दशमलव)', '10', '0–9', '10⁰=1, 10¹=10, 10²=100, 10³=1000', '— (इंसानी पद्धति)', '<b>255</b>', 'रोज़ का हिसाब, कीमत, अंक'],
        ['Binary (द्विआधारी)', '2', '0, 1', '2⁰=1, 2¹=2, 2²=4, 2³=8 … 2⁷=128', '1 bit', '<b>11111111</b>', 'हर bit, logic gate, memory cell'],
        ['Octal (अष्टाधारी)', '8', '0–7', '8⁰=1, 8¹=8, 8²=64, 8³=512', '3 bit', '<b>377</b>', 'Linux file permission (chmod 755), पुराने minicomputer'],
        ['Hexadecimal (षोडशांक)', '16', '0–9, A=10 … F=15', '16⁰=1, 16¹=16, 16²=256, 16³=4096', '4 bit', '<b>FF</b>', 'memory address, रंग कोड (#FF0000), MAC address, hex dump, error code']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.2</span> स्थानीय मान (place value) — पूरी गणना का एक ही नियम</h3>
      <p>किसी भी पद्धति में संख्या का मान निकालने का नियम एक ही है: <b>हर अंक × उसके स्थान का weight, फिर सब जोड़ दो</b>। weight = base की घात, और घात दाईं ओर से 0 से शुरू होकर बाईं ओर बढ़ती है। दशमलव-बिंदु के बाद घात ऋणात्मक होती है (base⁻¹, base⁻² …)।</p>
      <p>चारों पद्धतियों में एक-एक उदाहरण पूरे चरण के साथ:</p>
      <ul>
        <li><b>Decimal 4073:</b> 4×10³ + 0×10² + 7×10¹ + 3×10⁰ = 4000 + 0 + 70 + 3 = <b>4073</b>।</li>
        <li><b>Binary 101101₂:</b> 1×2⁵ + 0×2⁴ + 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 32 + 0 + 8 + 4 + 0 + 1 = <b>45</b>।</li>
        <li><b>Octal 752₈:</b> 7×8² + 5×8¹ + 2×8⁰ = 448 + 40 + 2 = <b>490</b>।</li>
        <li><b>Hex 2AF₁₆:</b> 2×16² + A(10)×16¹ + F(15)×16⁰ = 512 + 160 + 15 = <b>687</b>।</li>
        <li><b>भिन्न वाला — Binary 101.101₂:</b> 1×4 + 0×2 + 1×1 + 1×2⁻¹ + 0×2⁻² + 1×2⁻³ = 4 + 1 + 0.5 + 0 + 0.125 = <b>5.625</b>।</li>
      </ul>
      <p><b>MSB व LSB:</b> सबसे बायाँ अंक <b>MSB (Most Significant Bit/Digit)</b> — सबसे बड़ा weight; सबसे दायाँ <b>LSB (Least Significant Bit)</b> — weight 1। LSB ही तय करता है संख्या सम है या विषम (binary में LSB=0 → सम)। Signed संख्या में MSB <b>sign bit</b> बन जाता है।</p>
      <p><b>n bit से कितनी संख्याएँ?</b> कुल <b>2ⁿ</b> अलग मान। 8 bit → 256 (0–255), 16 bit → 65,536 (0–65535), 32 bit → 4,294,967,296। इसीलिए 32-bit OS अधिकतम ~4 GB RAM ही देख पाता था (2³² byte = 4 GiB)।</p>` },

    { type: 'steps', items: [
      { n: 1, title: 'Decimal → Binary : बार-बार 2 से भाग (शेषफल विधि)', text: 'संख्या को 2 से भाग दीजिए, शेषफल (0 या 1) किनारे लिखिए, भागफल को फिर 2 से भाग दीजिए — जब तक भागफल 0 न हो जाए। अब शेषफलों को <b>नीचे से ऊपर</b> पढ़िए। उदाहरण 45: 45÷2=22 शेष 1 → 22÷2=11 शेष 0 → 11÷2=5 शेष 1 → 5÷2=2 शेष 1 → 2÷2=1 शेष 0 → 1÷2=0 शेष 1। नीचे से ऊपर = <b>101101₂</b>।', tips: ['जाँच: वापस place-value से जोड़कर 45 आना चाहिए।', 'भिन्न वाले हिस्से के लिए उलटा काम — 2 से <b>गुणा</b> कीजिए और पूर्णांक हिस्सा ऊपर से नीचे पढ़िए (0.625 ×2=1.25→1, 0.25×2=0.5→0, 0.5×2=1.0→1 ⇒ .101)।'] },
      { n: 2, title: 'Decimal → Octal / Hex : वही विधि, भाजक 8 या 16', text: '8 से भाग दें तो octal, 16 से भाग दें तो hex। शेषफल 10–15 आए तो A–F लिखिए। उदाहरण 687 → hex: 687÷16=42 शेष 15(F) → 42÷16=2 शेष 10(A) → 2÷16=0 शेष 2 ⇒ नीचे से ऊपर <b>2AF₁₆</b>।', tips: ['भागफल छोटा हो तो सीधा तालिका: 16×42=672, 687−672=15 ⇒ F।'] },
      { n: 3, title: 'Binary / Octal / Hex → Decimal : weight से गुणा करके जोड़ें', text: 'हर अंक को उसके स्थान के weight से गुणा कीजिए और जोड़ दीजिए (ऊपर 2.2 के उदाहरण देखें)। Hex में पहले A–F को 10–15 में बदलना न भूलें।', warn: ['सबसे आम ग़लती: घात की गिनती 1 से शुरू करना। दायाँ स्थान हमेशा base⁰ = 1 होता है।'] },
      { n: 4, title: 'Binary ↔ Octal ↔ Hex : सीधा समूह-विधि (भाग करने की ज़रूरत नहीं)', text: 'क्योंकि 8 = 2³ और 16 = 2⁴, इसलिए <b>binary के 3 bit = 1 octal अंक</b> और <b>4 bit = 1 hex अंक</b>। दाईं ओर (LSB) से समूह बनाइए; बाईं ओर bit कम पड़े तो शून्य जोड़ दीजिए। उदाहरण 11010110₂ → hex: <b>1101 0110</b> = D 6 = <b>D6₁₆</b>; octal: <b>011 010 110</b> = 3 2 6 = <b>326₈</b>। उलटा भी उतना ही आसान — हर hex अंक को 4 bit में लिख दीजिए।', tips: ['यही तरीक़ा परीक्षा में सबसे तेज़ है — इसमें भाग-गुणा नहीं करना पड़ता।', 'भिन्न में समूह बाईं ओर से दाईं ओर बनाते हैं और दाईं ओर शून्य जोड़ते हैं।'] },
      { n: 5, title: 'अंतिम जाँच — तीन स्वतंत्र संकेत', text: '(1) अंक सीमा: binary में केवल 0/1, octal में 0–7 (8 या 9 कभी नहीं), hex में 0–9/A–F। (2) आकार: वही मान hex में सबसे छोटा दिखेगा, binary में सबसे लंबा। (3) उलटा रूपांतरण करके मूल संख्या पाइए।', warn: ['"18₈" या "9₂" लिखा हो तो वह संख्या उस पद्धति में है ही नहीं — प्रश्न में यह जाल भी आता है।'] }
    ] },

    { type: 'table', head: ['2 की घात', 'मान', '2 की घात', 'मान', '16 की घात', 'मान', 'याद रखने की कुंजी'],
      rows: [
        ['2⁰', '1', '2⁸', '256', '16⁰', '1', 'एक byte में 2⁸ = 256 मान'],
        ['2¹', '2', '2⁹', '512', '16¹', '16', 'एक hex अंक = 4 bit'],
        ['2²', '4', '2¹⁰', '1,024 (1 KiB)', '16²', '256', '2¹⁰ ≈ 10³ — इसीलिए 1024'],
        ['2³', '8', '2¹¹', '2,048', '16³', '4,096', 'एक octal अंक = 3 bit'],
        ['2⁴', '16', '2¹²', '4,096', '16⁴', '65,536', '2¹⁶ = 65536 = 16-bit सीमा'],
        ['2⁵', '32', '2¹⁶', '65,536', '—', '—', '32-bit address space = 2³² = 4 GiB'],
        ['2⁶', '64', '2²⁰', '1,048,576 (1 MiB)', '—', '—', '2³⁰ = 1 GiB, 2⁴⁰ = 1 TiB'],
        ['2⁷', '128', '2³²', '4,294,967,296', '—', '—', '8-bit signed सीमा −128 … +127']
      ] },

    { type: 'table', head: ['Decimal', 'Binary (4-bit)', 'Octal', 'Hex', 'Decimal', 'Binary (4-bit)', 'Octal', 'Hex'],
      rows: [
        ['0', '0000', '0', '0', '8', '1000', '10', '8'],
        ['1', '0001', '1', '1', '9', '1001', '11', '9'],
        ['2', '0010', '2', '2', '10', '1010', '12', '<b>A</b>'],
        ['3', '0011', '3', '3', '11', '1011', '13', '<b>B</b>'],
        ['4', '0100', '4', '4', '12', '1100', '14', '<b>C</b>'],
        ['5', '0101', '5', '5', '13', '1101', '15', '<b>D</b>'],
        ['6', '0110', '6', '6', '14', '1110', '16', '<b>E</b>'],
        ['7', '0111', '7', '7', '15', '1111', '17', '<b>F</b>']
      ] },

    { type: 'code', code: `# ---------- रूपांतरण जाँचने के आसान तरीक़े (किसी भी लैब PC पर) ----------

# Python — सबसे साफ़
print(bin(45))            # 0b101101      (binary)
print(oct(490))           # 0o752         (octal)
print(hex(687))           # 0x2af         (hex)
print(int('101101', 2))   # 45   ← string + base
print(int('752', 8))      # 490
print(int('2AF', 16))     # 687
print(format(255, '08b')) # 11111111  ← 8 bit में, आगे शून्य भरकर
print(f'{255:04X}')       # 00FF

# Windows CMD — calc को programmer mode में खोलें
calc          # View → Programmer  (Bin/Oct/Dec/Hex बटन)
# PowerShell
[Convert]::ToString(45, 2)      # 101101
[Convert]::ToString(687, 16)    # 2af
[Convert]::ToInt32('2AF', 16)   # 687
[Convert]::ToString(255, 8)     # 377

# Linux / macOS terminal
printf '%o\\n' 490              # 752   (octal)
printf '%x\\n' 687              # 2af   (hex)
echo $((2#101101))              # 45    (binary → decimal)
echo $((8#752))                 # 490
echo $((16#2AF))                # 687
echo "obase=2; 45" | bc         # 101101
echo "ibase=16; 2AF" | bc       # 687

# ASCII / Unicode कोड देखना
python -c "print(ord('A'), hex(ord('A')), ord('अ'))"     # 65 0x41 2309
python -c "print('अ'.encode('utf-8').hex(' '))"          # e0 a4 85
# Linux: अक्षर का byte देखें
printf 'अ' | xxd                 # 00000000: e0a4 85

# रंग कोड (hex) — CSS में
#   #FF0000 = लाल (R=255, G=0, B=0)   #00FF00 = हरा   #0000FF = नीला
#   #FFFFFF = सफ़ेद  #000000 = काला  #808080 = मध्यम ग्रे (128)` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.3</span> Binary अंकगणित — जोड़, घटाव, गुणना, भाग</h3>
      <p>कंप्यूटर के अंदर ALU यही चार काम करता है, और चारों के नियम decimal से <b>छोटे</b> हैं क्योंकि अंक केवल दो हैं।</p>
      <p><b>जोड़ (addition):</b> 0+0=0, 0+1=1, 1+0=1, और <b>1+1 = 10</b> (यानी 0 लिखो, 1 carry आगे)। carry के साथ 1 आ जाए तो <b>1+1+1 = 11</b> (1 लिखो, 1 carry)। उदाहरण: 1011 (11) + 0110 (6) = <b>10001</b> (17)।</p>
      <p><b>घटाव (subtraction):</b> 0−0=0, 1−0=1, 1−1=0, और <b>0−1 के लिए ऊपर से borrow</b> लेकर 10−1=1। उदाहरण: 1011 (11) − 0110 (6) = <b>0101</b> (5)। असली hardware में घटाव अलग circuit से नहीं होता — <b>2’s complement जोड़कर</b> किया जाता है, इसीलिए adder circuit ही सब काम कर लेता है (नीचे 2.5 देखें)।</p>
      <p><b>गुणना (multiplication):</b> decimal की तरह ही — हर अंक से गुणा करके खिसकाकर जोड़ना। पर गुणा केवल 0 या 1 से है, इसलिए हर पंक्ति या तो <b>0</b> है या <b>वही संख्या</b>। उदाहरण: 101 (5) × 011 (3) → 101 + 1010 + 00000 = <b>1111</b> (15)। hardware में यह <b>shift और add</b> कहलाता है; 2 से गुणा = एक bit बाईं ओर खिसकाना (left shift), 2 से भाग = दाईं ओर खिसकाना (right shift)।</p>
      <p><b>भाग (division):</b> decimal long-division जैसा — भाजक को भाज्य के बाएँ हिस्से से घटाते जाइए, जितनी बार घटे उतना भागफल-अंक (0 या 1)। उदाहरण: 1111 (15) ÷ 011 (3) = <b>101</b> (5), शेष 0।</p>` },

    { type: 'table', head: ['क्रिया', 'नियम', 'उदाहरण (binary)', 'उदाहरण (decimal जाँच)', 'hardware में कैसे'],
      rows: [
        ['जोड़', '1+1 = 0, carry 1; 1+1+1 = 1, carry 1', '1011 + 0110 = 10001', '11 + 6 = 17', 'Half adder → Full adder → Ripple/Carry-look-ahead adder'],
        ['घटाव', '0−1 पर borrow लेकर 10−1 = 1', '1011 − 0110 = 0101', '11 − 6 = 5', 'असल में 2’s complement जोड़कर (A − B = A + (−B))'],
        ['गुणना', 'हर पंक्ति 0 या वही संख्या, खिसकाकर जोड़ें', '101 × 011 = 1111', '5 × 3 = 15', 'Shift-and-add; आधुनिक CPU में dedicated multiplier'],
        ['भाग', 'घटाते जाइए, भागफल-अंक 0 या 1', '1111 ÷ 011 = 101 शेष 0', '15 ÷ 3 = 5', 'Restoring / non-restoring division; shift-and-subtract'],
        ['Left shift (×2)', 'सब bit एक स्थान बाएँ, दाएँ 0', '00101 << 1 = 001010', '5 × 2 = 10', 'बहुत सस्ता — केवल तार की अदला-बदली'],
        ['Right shift (÷2)', 'सब bit एक स्थान दाएँ', '01010 >> 1 = 00101', '10 ÷ 2 = 5', 'signed में arithmetic shift (sign bit बना रहता है)'],
        ['Overflow', 'n-bit में नतीजा 2ⁿ से बड़ा हो जाए', '4-bit: 1000 + 1001 = 1 0001 (carry बाहर)', '8 + 9 = 17 > 15', 'Carry flag (unsigned) व Overflow flag (signed) सेट होते हैं']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.4</span> ऋणात्मक संख्या कैसे रखें — तीन विधियाँ</h3>
      <p>bit केवल 0/1 है, तो "−" चिह्न कहाँ रखें? तीन तरीक़े काम आए, और आज लगभग हर कंप्यूटर तीसरा इस्तेमाल करता है।</p>
      <ul>
        <li><b>Sign-magnitude (चिह्न-परिमाण):</b> MSB को चिह्न बना दो — 0 = धनात्मक, 1 = ऋणात्मक; बाक़ी bit मान। 4-bit में 0101 = +5, 1101 = −5। <b>कमी:</b> दो शून्य बनते हैं (0000 = +0, 1000 = −0) और जोड़-घटाव के लिए अलग नियम/चिह्न-जाँच चाहिए — circuit जटिल।</li>
        <li><b>1’s complement (एक-पूरक):</b> धनात्मक संख्या के <b>सारे bit उलट दो</b> (0↔1)। +5 = 0101 → −5 = 1010। <b>कमी:</b> इसमें भी दो शून्य (0000 और 1111), और जोड़ के बाद बाहर गया carry वापस जोड़ना पड़ता है (<b>end-around carry</b>)।</li>
        <li><b>2’s complement (दो-पूरक) — आज का मानक:</b> पहले 1’s complement लो, फिर <b>उसमें 1 जोड़ दो</b>। +5 = 0101 → उलटा 1010 → +1 = <b>1011</b> = −5। <b>फ़ायदे:</b> शून्य केवल एक (0000), जोड़-घटाव एक ही adder से, कोई end-around carry नहीं, और सीमा एक ज़्यादा ऋणात्मक तरफ़ मिलती है। इसीलिए C/Java का <code>int</code>, CPU के सारे integer arithmetic इसी में होते हैं।</li>
      </ul>
      <p><b>तेज़ तरकीब:</b> 2’s complement निकालने के लिए — <b>दाईं ओर से पहला 1 आने तक सब bit ज्यों के त्यों रखो, उसके बाद के सारे bit उलट दो</b>। जैसे 0110<strong>1</strong>000 → पहला 1 (तीसरे स्थान पर) तक 000 वैसे ही, आगे 011 उलटकर 100 ⇒ 10011000।</p>
      <p><b>सीमा (range) याद रखिए:</b> n-bit 2’s complement में <b>−2ⁿ⁻¹ से +(2ⁿ⁻¹ − 1)</b>। 8-bit → −128…+127; 16-bit → −32768…+32767; 32-bit → −2,147,483,648…+2,147,483,647। Unsigned में 0…2ⁿ−1। इसीलिए <code>unsigned char</code> 255 तक और <code>signed char</code> 127 तक जाता है।</p>` },

    { type: 'table', head: ['मान', 'Sign-magnitude (4-bit)', '1’s complement (4-bit)', '2’s complement (4-bit)', 'टिप्पणी'],
      rows: [
        ['+7', '0111', '0111', '0111', 'तीनों में धनात्मक एक जैसा'],
        ['+5', '0101', '0101', '0101', 'MSB = 0'],
        ['+1', '0001', '0001', '0001', '—'],
        ['+0', '0000', '0000', '0000', '—'],
        ['−0', '1000', '1111', '<b>नहीं होता</b>', 'यही 2’s complement का सबसे बड़ा लाभ'],
        ['−1', '1001', '1110', '1111', '—'],
        ['−5', '1101', '1010', '1011', '2’s = 1’s + 1'],
        ['−7', '1111', '1000', '1001', '—'],
        ['−8', '<b>नहीं</b>', '<b>नहीं</b>', '1000', '2’s में एक अतिरिक्त ऋणात्मक मान'],
        ['सीमा (n=4)', '−7 … +7', '−7 … +7', '<b>−8 … +7</b>', 'सूत्र: −2ⁿ⁻¹ … 2ⁿ⁻¹−1'],
        ['सीमा (n=8)', '−127 … +127', '−127 … +127', '<b>−128 … +127</b>', 'unsigned 8-bit = 0 … 255'],
        ['सीमा (n=32)', '−(2³¹−1) … +(2³¹−1)', 'वही', '<b>−2³¹ … 2³¹−1</b>', 'यही C/Java के int की सीमा है']
      ] },

    { type: 'steps', items: [
      { n: 1, title: '2’s complement से घटाव — A − B को A + (−B) बनाइए', text: 'उदाहरण <b>7 − 5</b> (4-bit में): 7 = 0111, 5 = 0101। पहले −5 निकालिए — 0101 का 1’s = 1010, +1 = <b>1011</b>।', tips: ['यही तरीक़ा असली CPU करता है — घटाव का अलग circuit नहीं बनाना पड़ता।'] },
      { n: 2, title: 'अब साधारण binary जोड़ कीजिए', text: '0111 + 1011 = <b>1 0010</b>। बाईं ओर जो अतिरिक्त carry (पाँचवाँ bit) निकला, उसे <b>त्याग दीजिए</b> (4-bit में जगह ही नहीं)। बचा <b>0010</b>।', warn: ['1’s complement में यह carry त्यागते नहीं, वापस जोड़ते हैं (end-around carry) — दोनों विधियाँ मिलाइए मत।'] },
      { n: 3, title: 'नतीजे का चिह्न पढ़िए', text: 'MSB = 0 हो तो नतीजा धनात्मक है और सीधा पढ़ लीजिए: 0010 = <b>+2</b> ✓। MSB = 1 हो तो नतीजा ऋणात्मक है — उसका 2’s complement लेकर परिमाण पढ़िए और आगे "−" लगा दीजिए।', tips: ['उदाहरण 5 − 7: 0101 + (−7 = 1001) = 1110 → MSB 1 ⇒ 1110 का 2’s = 0010 = 2 ⇒ उत्तर <b>−2</b> ✓।'] },
      { n: 4, title: 'Overflow जाँचिए (यह अलग बात है)', text: 'दो <b>धनात्मक</b> जोड़ने पर नतीजा ऋणात्मक दिखे, या दो <b>ऋणात्मक</b> जोड़ने पर धनात्मक — यह <b>signed overflow</b> है, नतीजा ग़लत। जैसे 4-bit में 7+1 = 0111+0001 = 1000 = −8 (ग़लत!)। CPU इसे <b>Overflow flag (V)</b> से बताता है; unsigned की सीमा टूटना <b>Carry flag (C)</b> बताता है।', warn: ['carry बाहर जाना हमेशा ग़लती नहीं — signed जोड़ में वह सामान्य है। दोनों flags का अर्थ अलग है।'] }
    ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.5</span> bit से TB तक — डेटा की इकाइयाँ और 1000 बनाम 1024 का झगड़ा</h3>
      <p><b>bit</b> = एक binary अंक (0 या 1), डेटा की सबसे छोटी इकाई। <b>Nibble</b> = 4 bit (एक hex अंक)। <b>Byte</b> = 8 bit — पता लगाने योग्य (addressable) सबसे छोटी इकाई; एक ASCII अक्षर ठीक एक byte में आता है। <b>Word</b> = CPU एक बार में जितनी bit सँभाले (16/32/64) — इसीलिए "32-bit processor" कहा जाता है।</p>
      <p>अब असली भ्रम यहाँ है: कंप्यूटर 2 की घातों में चलता है, इसलिए परंपरा से <b>1 KB = 1024 byte</b> माना गया। पर SI (अंतरराष्ट्रीय इकाई प्रणाली) में <b>kilo = 1000</b> होता है। 1998 में IEC ने इस भ्रम को मिटाने के लिए नए नाम दिए — <b>KiB (kibibyte) = 1024</b>, <b>MiB = 1024²</b>, <b>GiB</b>, <b>TiB</b>।</p>
      <p>व्यवहार में: <b>hard disk/SSD निर्माता 1000 के गुणज में</b> बताते हैं (1 TB = 10¹² byte), पर <b>Windows 1024 के गुणज में</b> दिखाता है और लेबल "KB/MB/GB" ही लगाता है। इसीलिए 1 TB की disk Windows में लगभग <b>931 GB</b> दिखती है — यह ख़राबी नहीं, इकाई का फ़र्क़ है। Linux के <code>ls -lh</code> व <code>df -h</code> भी 1024 आधारित हैं; <code>--si</code> लगाने पर 1000 आधारित। RAM हमेशा 2 की घात में होती है (8, 16, 32 GiB)। Network की चाल <b>bit</b> में बताई जाती है (100 Mbps), फ़ाइल का आकार <b>byte</b> में — इसलिए 100 Mbps पर अधिकतम ~12.5 MB/s।</p>` },

    { type: 'table', head: ['इकाई', 'चिह्न', 'कितनी bit/byte', 'SI नाम (1000 आधार)', 'IEC नाम (1024 आधार)', 'उदाहरण'],
      rows: [
        ['Bit', 'b', '1 binary अंक', '—', '—', 'एक switch की स्थिति'],
        ['Nibble', '—', '4 bit', '—', '—', 'एक hex अंक (0–F)'],
        ['Byte', 'B', '8 bit', '—', '—', 'एक ASCII अक्षर'],
        ['Kilobyte / Kibibyte', 'KB / KiB', '1000 / 1024 byte', 'kB = 10³', 'KiB = 2¹⁰', 'एक छोटा text note'],
        ['Megabyte / Mebibyte', 'MB / MiB', '10⁶ / 2²⁰ byte', 'MB', 'MiB = 1,048,576 B', 'एक MP3 गाना ~4 MB'],
        ['Gigabyte / Gibibyte', 'GB / GiB', '10⁹ / 2³⁰ byte', 'GB', 'GiB = 1,073,741,824 B', 'RAM 16 GiB; फ़िल्म ~2 GB'],
        ['Terabyte / Tebibyte', 'TB / TiB', '10¹² / 2⁴⁰ byte', 'TB', 'TiB', '1 TB disk = Windows में ~931 GiB'],
        ['Petabyte / Exabyte', 'PB / EB', '10¹⁵ / 10¹⁸ byte', 'PB, EB', 'PiB, EiB', 'बड़ा data-center, cloud भंडारण'],
        ['Word', '—', 'CPU की चौड़ाई: 16/32/64 bit', '—', '—', '64-bit CPU एक बार में 8 byte'],
        ['Network चाल', 'bps, Mbps, Gbps', '<b>bit</b> प्रति सेकंड', '1000 आधार', '—', '100 Mbps ÷ 8 = 12.5 MB/s']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.6</span> अक्षरों को bit में कैसे लिखें — ASCII, ISCII, Unicode</h3>
      <p>संख्या तो binary में आ गई, पर "अ", "क", "A", "₹", "😀" कैसे रखें? इसके लिए <b>character encoding</b> चाहिए — एक सहमति कि किस अक्षर को कौन-सा नंबर मिलेगा।</p>
      <ul>
        <li><b>ASCII (American Standard Code for Information Interchange):</b> 1963 में मानक बना, <b>7-bit</b> → कुल <b>128</b> अक्षर (0–127)। इसमें अंग्रेज़ी के बड़े-छोटे अक्षर, अंक 0–9, विराम-चिह्न और <b>control codes</b> (जैसे 13 = CR, 10 = LF, 9 = TAB, 27 = ESC, 127 = DEL) हैं। 8वाँ bit पहले parity के लिए बचता था; बाद में उसे जोड़कर <b>Extended ASCII (8-bit, 256 अक्षर)</b> बना — पर उसके कई अलग-अलग संस्करण (ISO-8859-1 Latin-1, Windows-1252) आपस में मेल नहीं खाते थे, इसीलिए "टेक्स्ट में अजीब चिह्न" दिखते थे। ASCII में देवनागरी के लिए कोई जगह नहीं थी।</li>
        <li><b>ISCII (Indian Script Code for Information Interchange):</b> 1991 में BIS (भारतीय मानक ब्यूरो) ने बनाया, <b>8-bit</b>। इसमें देवनागरी सहित भारत की कई लिपियाँ (बांग्ला, तमिल, तेलुगु, कन्नड़, मलयालम, गुजराती, गुरुमुखी, ओड़िया, असमिया) एक ही ढाँचे में समाईं — नीचे का हिस्सा ASCII जैसा और ऊपर का हिस्सा भारतीय अक्षरों के लिए। कुछ समय तक सरकारी/दूरसंचार प्रणालियों में चला, पर लिपि-बदलना और अंतरराष्ट्रीय मेल न होने से <b>Unicode ने इसे पीछे छोड़ दिया</b>।</li>
        <li><b>Unicode:</b> 1991 से शुरू हुई वैश्विक सहमति — दुनिया की <b>हर लिपि के हर अक्षर को एक अद्वितीय नंबर (code point)</b>, लिखा जाता है <b>U+XXXX</b>। कुल सीमा <b>U+0000 से U+10FFFF</b> (17 plane, लगभग 11 लाख code point)। देवनागरी का block है <b>U+0900–U+097F</b> — जैसे <b>अ = U+0905</b>, क = U+0915, ा = U+093E। Emoji भी Unicode में हैं (😀 = U+1F600)। Unicode केवल नंबर तय करता है; उसे byte में कैसे लिखें, यह <b>UTF</b> तय करता है।</li>
        <li><b>UTF-8 / UTF-16 / UTF-32:</b> UTF-8 सबसे लोकप्रिय — <b>1 से 4 byte</b> का परिवर्तनीय (variable-length) रूप, और <b>ASCII के साथ पूरी तरह संगत</b> (0–127 वही एक byte)। इसीलिए आज लगभग पूरी वेबसाइट UTF-8 पर हैं। UTF-16 में 2 या 4 byte (Java/Windows internally), UTF-32 में हर अक्षर के लिए तय 4 byte (सरल पर जगह ज़्यादा)।</li>
      </ul>
      <p><b>व्यावहारिक नतीजा:</b> HTML में <code>&lt;meta charset="utf-8"&gt;</code> न हो तो हिंदी टूटकर "à¤…" जैसी दिखती है — यह <b>mojibake</b> है, यानी byte सही हैं पर पढ़ने वाला ग़लत encoding मान रहा है। फ़ाइल save करते समय भी UTF-8 चुनना ज़रूरी है।</p>` },

    { type: 'table', head: ['अक्षर / चिह्न', 'Decimal (ASCII)', 'Hex', 'Binary (8-bit)', 'याद रखने की कुंजी'],
      rows: [
        ['NUL (null)', '0', '00', '00000000', 'string का अंत C में'],
        ['TAB', '9', '09', '00001001', 'Control code'],
        ['LF (line feed)', '10', '0A', '00001010', 'Linux नई लाइन'],
        ['CR (carriage return)', '13', '0D', '00001101', 'Windows में CR+LF = नई लाइन'],
        ['ESC', '27', '1B', '00011011', 'Escape sequence की शुरुआत'],
        ['Space (खाली जगह)', '32', '20', '00100000', 'पहला छपने योग्य अक्षर'],
        ['0 (अंक शून्य)', '48', '30', '00110000', 'अंक 0–9 = 48–57; अक्षर नहीं, character है'],
        ['9', '57', '39', '00111001', '—'],
        ['A (बड़ा)', '65', '41', '01000001', 'A–Z = 65–90'],
        ['Z', '90', '5A', '01011010', '—'],
        ['a (छोटा)', '97', '61', '01100001', 'a–z = 97–122; बड़े से ठीक 32 ज़्यादा'],
        ['z', '122', '7A', '01111010', 'छोटा→बड़ा करने के लिए 32 घटाएँ (bit 5 clear)'],
        ['DEL', '127', '7F', '01111111', 'ASCII का आख़िरी code'],
        ['अ (देवनागरी)', '2309 (Unicode)', 'U+0905', 'UTF-8: E0 A4 85', 'ASCII में जगह नहीं — Unicode चाहिए'],
        ['क', '2325 (Unicode)', 'U+0915', 'UTF-8: E0 A4 95', 'देवनागरी block U+0900–097F'],
        ['₹ (रुपया)', '8377 (Unicode)', 'U+20B9', 'UTF-8: E2 82 B9', '2010 में Unicode में जोड़ा गया'],
        ['😀 (emoji)', '128512 (Unicode)', 'U+1F600', 'UTF-8: F0 9F 98 80 (4 byte)', 'UTF-16 में surrogate pair से 4 byte']
      ] },

    { type: 'table', head: ['Encoding', 'Bit/byte प्रति अक्षर', 'कुल अक्षर', 'भारतीय लिपि?', 'फ़ायदा', 'कमी / कहाँ'],
      rows: [
        ['ASCII', '7-bit (1 byte में रखा)', '128', 'नहीं', 'सरल, हर जगह चलता है', 'केवल अंग्रेज़ी + control; आज भी हर encoding का आधार'],
        ['Extended ASCII (ISO-8859 / CP-1252)', '8-bit', '256', 'नहीं', 'पश्चिमी यूरोपीय अक्षर जुड़े', 'अलग-अलग code page आपस में मेल नहीं खाते → mojibake'],
        ['ISCII', '8-bit', '256 (लिपि-बदलकर)', '<b>हाँ</b> — देवनागरी सहित कई', 'भारत की लिपियों का पहला मानक (BIS, 1991)', 'अंतरराष्ट्रीय संगति कम; Unicode ने प्रतिस्थापित किया'],
        ['Unicode (code point)', 'संकल्पना — नंबर देता है', '~11 लाख (U+0000–10FFFF)', '<b>हाँ</b> — सभी', 'हर लिपि का एक अद्वितीय नंबर', 'यह storage format नहीं; इसके लिए UTF चाहिए'],
        ['UTF-8', '1–4 byte (परिवर्तनीय)', 'पूरा Unicode', 'हाँ', 'ASCII-संगत, जगह बचत, वेब का मानक', 'पुराने software में कभी-कभी ग़लत पहचान'],
        ['UTF-16', '2 या 4 byte', 'पूरा Unicode', 'हाँ', 'Windows/Java का आंतरिक रूप', 'ASCII-संगत नहीं; byte-order (BOM) का झंझट'],
        ['UTF-32', 'तय 4 byte', 'पूरा Unicode', 'हाँ', 'हर अक्षर बराबर चौड़ाई — indexing आसान', 'चार गुना जगह; आम तौर पर इस्तेमाल नहीं']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.7</span> और भी codes — BCD, Excess-3, Gray, Parity, Checksum</h3>
      <p>कुछ कामों के लिए साधारण binary से अलग coding बेहतर पड़ती है। परीक्षा में इनके नाम और "क्यों" पूछे जाते हैं।</p>
      <ul>
        <li><b>BCD (Binary Coded Decimal, 8421 code):</b> decimal के <b>हर अंक को अलग-अलग 4 bit</b> में लिखना। 93 → <b>1001 0011</b>। फ़ायदा — decimal display (घड़ी, कैलकुलेटर, मीटर) में सीधा बदलना, और पैसे के हिसाब में दशमलव की ग़लती नहीं। कमी — जगह ज़्यादा लगती है (4 bit में केवल 0–9 उपयोगी, 1010–1111 बेकार) और अंकगणित धीमा।</li>
        <li><b>Excess-3 (XS-3):</b> BCD के हर अंक में <b>3 जोड़कर</b> लिखना (5 → 5+3=8 → 1000)। यह <b>self-complementing</b> code है — bit उलटने पर 9 का पूरक मिल जाता है, जिससे घटाव आसान। पुराने decimal मशीनों में उपयोगी।</li>
        <li><b>Gray code (reflected binary):</b> लगातार दो मानों में <b>केवल एक bit बदलता है</b>। जैसे binary 00→01→10→11 में कई bit एक साथ बदलते हैं, पर Gray 00→01→11→10 में एक-एक। फ़ायदा — <b>rotary encoder</b>, position sensor और Karnaugh-map में बीच की अवस्था में ग़लत मान पढ़ने का जोखिम ख़त्म। नियम: Gray का MSB = binary का MSB; आगे हर Gray bit = उस binary bit और पिछले binary bit का XOR।</li>
        <li><b>Parity bit (समता बिट):</b> भेजे गए bit में 1 की गिनती सम (even parity) या विषम (odd parity) रखने के लिए एक अतिरिक्त bit जोड़ना। यह <b>एक-bit की ग़लती पकड़ सकता है, सुधार नहीं सकता</b>, और दो bit पलट जाएँ तो पकड़ भी नहीं पाता। पुराने RAM (parity RAM), serial communication में इस्तेमाल।</li>
        <li><b>Checksum / CRC / Hash:</b> पूरे डेटा से एक छोटा "हिसाब-मान" निकालकर साथ भेजना; पाने वाला दोबारा निकालकर मिलाता है। <b>Checksum</b> सरल जोड़; <b>CRC (Cyclic Redundancy Check)</b> बहुपद-भाग पर आधारित, बहुत भरोसेमंद — Ethernet, ZIP, PNG में; <b>Hash (MD5, SHA-256)</b> cryptographic — फ़ाइल की अखंडता व पासवर्ड के लिए। <b>Hamming code</b> एक क़दम आगे — ग़लती पकड़कर <b>सुधार</b> भी सकता है, इसीलिए ECC RAM में यही विचार चलता है।</li>
      </ul>` },

    { type: 'table', head: ['Code', 'कैसे बनता है', 'उदाहरण', 'मुख्य लाभ', 'कहाँ इस्तेमाल'],
      rows: [
        ['BCD (8421)', 'हर decimal अंक → 4 bit', '93 → 1001 0011', 'decimal display से सीधा मेल', 'कैलकुलेटर, digital घड़ी, मीटर, financial'],
        ['Excess-3', 'BCD + 0011', '5 → 1000', 'self-complementing — घटाव आसान', 'पुरानी decimal arithmetic मशीनें'],
        ['Gray code', 'MSB वही; आगे = bᵢ ⊕ bᵢ₊₁', 'binary 1011 → Gray 1110', 'लगातार मानों में एक ही bit बदले', 'rotary/linear encoder, K-map, ADC'],
        ['Parity (even/odd)', '1 की गिनती तय करने वाला अतिरिक्त bit', '1011001 में चार 1 → even parity bit 0', 'एक-bit error पकड़ना (सस्ता)', 'parity RAM, serial link, पुराना bus'],
        ['Hamming code', 'कई parity bit तय स्थानों पर', '7-bit में 4 data + 3 parity', 'एक-bit error <b>सुधारना</b>', 'ECC RAM, कुछ flash/संचार'],
        ['Checksum', 'byte/शब्दों का जोड़ (modulo)', 'फ़ाइल के byte जोड़कर निचले byte', 'बहुत सरल जाँच', 'पुराने protocol, साधारण फ़ाइल जाँच'],
        ['CRC-32', 'बहुपद-भाग का शेष', 'ZIP/PNG/Ethernet frame में 4 byte', 'burst error भी पकड़ता है', 'Ethernet, ZIP, PNG, SATA'],
        ['Cryptographic hash', 'एक-तरफ़ा गणितीय निचोड़', 'SHA-256 → 64 hex अंक', 'छेड़छाड़ पकड़ना, पासवर्ड', 'TLS, software signature, blockchain, फ़ाइल सत्यापन']
      ] },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">2.8</span> रोज़ के काम में octal और hex — permission, रंग, address</h3>
      <p><b>Linux file permission (octal का सबसे आम उपयोग):</b> हरpermission-तिक्कड़ी में <b>r = 4, w = 2, x = 1</b> जोड़ते हैं। तीन तिक्कड़ियाँ — <b>owner, group, others</b>।</p>
      <ul>
        <li><code>chmod 755 file</code> → 7 = 4+2+1 = <b>rwx</b> (owner), 5 = 4+0+1 = <b>r-x</b> (group), 5 = <b>r-x</b> (others) ⇒ <code>rwxr-xr-x</code>। प्रोग्राम/फ़ोल्डर के लिए आम।</li>
        <li><code>chmod 644 file</code> → <b>rw-r--r--</b> — साधारण फ़ाइल के लिए आम।</li>
        <li><code>chmod 600</code> → <b>rw-------</b> — केवल owner पढ़/लिख सके (जैसे SSH private key, इसीलिए वह माँगता है)।</li>
        <li><code>chmod 777</code> → सबको सब — <b>असुरक्षित</b>, कभी न करें।</li>
      </ul>
      <p><b>Hex के रोज़ के उपयोग:</b> (1) <b>रंग कोड</b> — CSS में <code>#RRGGBB</code>, हर जोड़ी 0–255; <code>#FF0000</code> लाल, <code>#00FF00</code> हरा, <code>#FFFFFF</code> सफ़ेद। (2) <b>MAC address</b> — <code>00:1A:2B:3C:4D:5E</code> (6 byte = 12 hex अंक)। (3) <b>Memory address / hex dump</b> — <code>0x7FFF…</code>, डिबगर में डेटा byte-दर-byte। (4) <b>Windows error/BSOD code</b> — <code>0x0000007B</code>, <code>0xC0000005</code> (access violation)। (5) <b>IPv6 address</b> — <code>2001:0db8::1</code>। (6) <b>URL encoding</b> — space = <code>%20</code> (0x20 = 32 = ASCII space)।</p>
      <p>इन सबमें hex इसलिए चुना गया क्योंकि <b>एक byte = ठीक दो hex अंक</b> — इंसान के लिए छोटा और मशीन के byte से सीधा मेल। Octal इसलिए क्योंकि <b>3 bit = एक अंक</b> और permission की तीन-तिक्कड़ी से मेल बैठता है।</p>` },

    { type: 'acc', title: 'FAQ — संख्या पद्धतियाँ', items: [
      { q: 'कंप्यूटर decimal क्यों नहीं इस्तेमाल करता?', a: 'क्योंकि उसका बुनियादी पुर्ज़ा (transistor/flip-flop) केवल <b>दो स्थायी अवस्था</b> रख सकता है — ON/OFF। दस अलग वोल्टेज-स्तर बनाना महँगा, नाज़ुक और शोर (noise) से ग़लती वाला होता। दो स्तर में थ्रेशोल्ड पार करना भर है, इसलिए भरोसा बहुत ज़्यादा।'},
      { q: 'Hex में A–F क्यों रखे गए?', a: 'Base 16 के लिए 16 अलग चिह्न चाहिए, पर 0–9 केवल दस हैं। बाक़ी छह के लिए अंग्रेज़ी के पहले छह अक्षर A=10, B=11, C=12, D=13, E=14, F=15 ले लिए गए। छोटे-बड़े अक्षर का मान एक ही है (2af = 2AF)।'},
      { q: 'Octal आज कहाँ बचा है?', a: 'मुख्यतः <b>Linux/Unix file permission</b> में (chmod 755, 644, 600) — क्योंकि r=4, w=2, x=1 की तीन-तिक्कड़ी 3 bit से ठीक बैठती है। कुछ पुराने programming literal में भी (C में आगे 0 लगाकर, जैसे 0755)। बाक़ी जगह hex ने ले ली है क्योंकि एक byte = दो hex अंक।'},
      { q: '1 KB = 1000 या 1024?', a: 'SI में <b>kB = 1000 byte</b>; IEC में <b>KiB = 1024 byte</b>। व्यवहार में disk निर्माता 1000 से नापते हैं और Windows/Linux 1024 से दिखाते हैं — इसीलिए 1 TB disk ~931 GiB दिखती है। RAM सचमुच 2 की घात में होती है। परीक्षा में "1 KB = 1024 byte" लिखना परंपरागत उत्तर है, पर फ़र्क़ बताना बेहतर।'},
      { q: '2’s complement ही क्यों चुना गया?', a: 'तीन कारण: (1) <b>शून्य केवल एक</b> — +0/−0 का झंझट ख़त्म; (2) <b>जोड़ और घटाव एक ही adder circuit से</b> — A−B = A+(−B), अलग subtractor नहीं चाहिए; (3) end-around carry नहीं सँभालना पड़ता। साथ में ऋणात्मक सीमा एक ज़्यादा मिलती है (−128…+127)।'},
      { q: 'Overflow और carry में फ़र्क़?', a: '<b>Carry flag</b> बताता है कि unsigned नतीजा bit-चौड़ाई से बाहर गया (जैसे 8-bit में 255+1)। <b>Overflow flag</b> बताता है कि signed नतीजा ग़लत चिह्न का आ गया (जैसे 127+1 = −128)। एक ही जोड़ में carry सामान्य हो सकता है पर overflow ग़लती — दोनों अलग स्थितियाँ हैं।'},
      { q: 'ASCII और Unicode में असली फ़र्क़?', a: 'ASCII एक <b>7-bit encoding</b> है — केवल 128 अक्षर, अंग्रेज़ी तक सीमित। Unicode एक <b>वैश्विक अक्षर-सूची (code point)</b> है — हर लिपि का अक्षर, emoji तक; उसे byte में लिखने के लिए UTF-8/16/32 हैं। UTF-8 में ASCII वाले अक्षर वैसे ही एक byte में रहते हैं, इसलिए वह ASCII-संगत है।'},
      { q: 'हिंदी टूटकर अजीब चिह्न क्यों दिखती है?', a: 'यह <b>mojibake</b> है — फ़ाइल UTF-8 में लिखी गई पर पढ़ने वाला उसे Windows-1252/ISO-8859 मान रहा है (या उलटा)। byte नहीं बदले, केवल व्याख्या ग़लत है। हल: फ़ाइल को UTF-8 में save करें, HTML में <code>&lt;meta charset="utf-8"&gt;</code> दें, और फ़ॉन्ट में देवनागरी support हो।'},
      { q: 'BCD बेकार है तो क्यों पढ़ें?', a: 'जहाँ <b>दशमलव की सटीकता</b> चाहिए वहाँ आज भी उपयोगी — वित्तीय गणना, digital display, कैलकुलेटर। binary floating-point में 0.1 ठीक से नहीं बनता (0.1 + 0.2 ≠ 0.3 वाली समस्या), इसलिए पैसे के हिसाब में decimal/BCD या fixed-point चुना जाता है।'},
      { q: 'Parity से ग़लती सुधार क्यों नहीं हो सकती?', a: 'Parity केवल इतना बताता है कि "1 की गिनती का नियम टूटा है" — यह नहीं बताता <b>कौन-सा bit</b> पलटा। सुधार के लिए स्थान भी चाहिए, जो <b>Hamming code</b> कई parity bit तय स्थानों पर रखकर देता है। और दो bit एक साथ पलटें तो parity नियम फिर सही दिखेगा — इसलिए CRC/Hamming बेहतर।'},
      { q: 'Gray code कहाँ काम आता है?', a: '<b>Rotary encoder</b> व position sensor में — क्योंकि लगातार दो मानों के बीच केवल एक bit बदलता है, इसलिए बीच की अवस्था में ग़लत मान पढ़ने का जोखिम नहीं। साधारण binary में 0111→1000 जैसे बदलाव पर चारों bit एक साथ पलटते हैं और क्षण भर के लिए कोई भी ग़लत मान दिख सकता है। Karnaugh-map के क्रम में भी Gray ही होता है।'},
      { q: 'परीक्षा में रूपांतरण के कदम दिखाना ज़रूरी है?', a: 'हाँ — 2/3 अंक के प्रश्न में केवल उत्तर नहीं, <b>विधि</b> पूछी जाती है ("भाग विधि से", "समूह बनाकर")। इसलिए हर चरण का भागफल-शेष या weight-गुणा लिखिए, और अंत में base subscript (₂, ₈, ₁₆) लगाइए ताकि पद्धति स्पष्ट रहे।'}
    ] },

    { type: 'labs', items: [
      { n: 103, title: 'चारों पद्धतियों में 20 संख्याएँ बदलना', aim: 'भाग-विधि, weight-विधि और समूह-विधि — तीनों से रूपांतरण पक्का करना।',
        tools: ['नोटबुक/शीट', 'कैलकुलेटर या यह पेज का code ब्लॉक (Python/PowerShell)', 'ऊपर की 0–15 टेबल'],
        steps: ['एक शीट पर 5 कॉलम बनाइए: Decimal, Binary, Octal, Hex, विधि।', 'ये 20 मान लीजिए — 7, 15, 16, 31, 45, 63, 64, 100, 127, 128, 200, 255, 256, 490, 512, 687, 1000, 1024, 4096, 65535।', 'हर मान के लिए चारों पद्धतियाँ भरिए; कम-से-कम 5 मान भाग-विधि से और 5 समूह-विधि से कीजिए।', 'Python/PowerShell से हर उत्तर जाँचिए और ग़लतियों को लाल से सुधारिए।', 'अंत में केवल 0–15 टेबल याद करके बताइए कि 4 bit = 1 hex और 3 bit = 1 octal क्यों।'],
        result: '20 संख्याओं की भरी हुई चार-पद्धति शीट, software से सत्यापित; रूपांतरण की तीनों विधियाँ हाथ में।' },
      { n: 104, title: '2’s complement से घटाव और overflow पकड़ना', aim: 'ऋणात्मक संख्या बनाना, घटाव को जोड़ में बदलना, और carry बनाम overflow का फ़र्क़ देखना।',
        tools: ['नोटबुक', '4-bit और 8-bit के लिए खाने बना हुआ grid', 'Python (जाँच के लिए)'],
        steps: ['4-bit में +5, −5, +7, −7, −8 तीनों विधियों (sign-magnitude, 1’s, 2’s) में लिखिए।', '2’s complement से ये घटाव कीजिए: 7−5, 5−7, 3−3, 6−2। हर बार carry त्यागकर नतीजा पढ़िए।', 'अब 4-bit में 7+1 और (−5)+(−4) कीजिए — नतीजा ग़लत चिह्न का आएगा; लिखिए कि यह signed overflow है।', 'वही जोड़ 8-bit में दोहराइए और देखिए कि overflow क्यों नहीं हुआ।', 'Python में जाँचिए: <code>(7+1) & 0xF</code> बनाम <code>(7+1) & 0xFF</code>।'],
        result: 'तीनों विधियों की तुलना, चार सही घटाव, और दो overflow उदाहरण — carry व overflow flag का अंतर स्पष्ट।' },
      { n: 105, title: 'अपने नाम का ASCII/Unicode byte dump', aim: 'अक्षर और byte के बीच का संबंध अपने नाम से देखना; ASCII बनाम UTF-8 का फ़र्क़ प्रत्यक्ष करना।',
        tools: ['Python या Linux terminal', 'Notepad/VS Code (encoding बदलने के लिए)', 'xxd या PowerShell'],
        steps: ['अपना नाम अंग्रेज़ी में लिखिए और हर अक्षर का ASCII decimal, hex व binary निकालिए (<code>ord()</code> से)।', 'अब वही नाम हिंदी में लिखिए और <code>encode(\'utf-8\').hex(\' \')</code> से byte देखिए — हर देवनागरी अक्षर 3 byte लेगा।', 'फ़ाइल को एक बार UTF-8 और एक बार Windows-1252/ANSI में save करके खोलिए — हिंदी टूटती दिखेगी (mojibake)।', 'बड़े-छोटे अक्षर का फ़र्क़ 32 क्यों है, bit देखकर लिखिए (bit 5)।', 'एक emoji डालकर उसके 4 byte UTF-8 में देखिए।'],
        result: 'नाम का ASCII व UTF-8 byte dump, encoding बदलने पर टूटन का प्रत्यक्ष अनुभव, और 3-byte देवनागरी का कारण।' },
      { n: 106, title: 'Linux permission को octal में पढ़ना-लिखना', aim: 'r=4, w=2, x=1 के जोड़ से chmod के अंक और प्रतीक रूप आपस में बदलना।',
        tools: ['Linux terminal / WSL / यह पेज', 'नोटबुक'],
        steps: ['एक खाली फ़ाइल बनाइए: <code>touch lab.txt</code>।', '<code>ls -l lab.txt</code> से प्रतीक रूप पढ़िए और उसका octal अंक लिखिए।', 'बारी-बारी से <code>chmod 644</code>, <code>600</code>, <code>755</code>, <code>700</code>, <code>444</code> लगाइए और हर बार <code>ls -l</code> से मिलाइए।', 'उलटा अभ्यास: <code>rw-r-----</code>, <code>rwxr-xr-x</code>, <code>r--r--r--</code> के octal अंक लिखिए।', 'समझाइए कि SSH private key 600 क्यों माँगती है और 777 क्यों असुरक्षित है।'],
        result: 'पाँच chmod स्थितियों की सही जोड़ी और उलटा रूपांतरण; permission के तीन अंकों का अर्थ स्पष्ट।' }
    ] },

    { type: 'quiz', store: 'sci-numbers', items: [
      { q: 'Binary 101101₂ का decimal मान क्या है?', o: ['41', '45', '53', '61'], a: 1, ex: '32 + 0 + 8 + 4 + 0 + 1 = 45। दायाँ स्थान 2⁰ = 1 से शुरू होता है।' },
      { q: 'Hex 2AF₁₆ का decimal मान?', o: ['687', '671', '512', '2175'], a: 0, ex: '2×256 + 10×16 + 15×1 = 512 + 160 + 15 = 687।' },
      { q: 'Octal में कौन-सा अंक कभी नहीं आ सकता?', o: ['0', '5', '7', '8'], a: 3, ex: 'Base 8 के अंक 0–7 हैं। 8 और 9 octal में अवैध हैं — यही आम जाल है।' },
      { q: 'Binary 11010110₂ का hex रूप?', o: ['B6', 'D6', '6D', 'D3'], a: 1, ex: 'दाएँ से 4-4 bit के समूह: 1101 = D, 0110 = 6 ⇒ D6₁₆ (= 214 decimal)।' },
      { q: '4-bit 2’s complement में −5 कैसे लिखा जाएगा?', o: ['1101', '1010', '1011', '0101'], a: 2, ex: '+5 = 0101 → 1’s = 1010 → +1 = 1011। 1101 sign-magnitude है और 1010 केवल 1’s complement।' },
      { q: '8-bit signed (2’s complement) की सीमा क्या है?', o: ['0 से 255', '−127 से +127', '−128 से +127', '−256 से +255'], a: 2, ex: 'सूत्र −2ⁿ⁻¹ … 2ⁿ⁻¹−1 ⇒ −128 … +127। 0…255 unsigned की सीमा है।' },
      { q: 'ASCII में बड़े \'A\' का decimal code क्या है?', o: ['48', '65', '97', '32'], a: 1, ex: 'A = 65 (0x41), a = 97 (0x61), अंक 0 = 48, space = 32। बड़े-छोटे का फ़र्क़ ठीक 32 है।' },
      { q: 'UTF-8 की सबसे बड़ी ख़ूबी क्या है?', o: ['हर अक्षर ठीक 4 byte', 'ASCII के साथ संगत और परिवर्तनीय लंबाई (1–4 byte)', 'केवल अंग्रेज़ी', 'हमेशा 2 byte'], a: 1, ex: 'UTF-8 में ASCII अक्षर वही एक byte रहते हैं और बाक़ी लिपियाँ 2–4 byte लेती हैं — इसीलिए यह वेब का मानक है।' },
      { q: 'देवनागरी \'अ\' का Unicode code point क्या है?', o: ['U+0905', 'U+0041', 'U+0915', 'U+1F600'], a: 0, ex: 'अ = U+0905 (UTF-8 में E0 A4 85)। क = U+0915, A = U+0041, 😀 = U+1F600। देवनागरी block U+0900–097F है।' },
      { q: 'chmod 755 का प्रतीक रूप क्या होगा?', o: ['rw-r--r--', 'rwxr-xr-x', 'rwx------', 'rwxrwxrwx'], a: 1, ex: '7 = 4+2+1 = rwx (owner), 5 = 4+0+1 = r-x (group), 5 = r-x (others) ⇒ rwxr-xr-x।' },
      { q: 'कौन-सा code एक-bit की ग़लती सुधार भी सकता है?', o: ['Parity bit', 'Checksum', 'Hamming code', 'BCD'], a: 2, ex: 'Parity केवल पकड़ता है; Hamming code कई parity bit तय स्थानों पर रखकर ग़लत bit का स्थान भी बता देता है — इसीलिए ECC RAM में यही विचार है।' },
      { q: 'Gray code की ख़ासियत क्या है?', o: ['हर अंक 4 bit का', 'लगातार दो मानों में केवल एक bit बदलता है', 'स्वयं-पूरक (self-complementing)', 'दशमलव के लिए'], a: 1, ex: 'एक-bit बदलाव से rotary encoder में बीच की अवस्था का ग़लत पाठ नहीं होता। Self-complementing Excess-3 की ख़ूबी है।' },
      { q: '1 TB disk Windows में ~931 GB क्यों दिखती है?', o: ['Disk ख़राब है', 'निर्माता 1000 के गुणज में, OS 1024 के गुणज में नापता है', 'फ़ाइल system जगह खा जाता है', 'Windows झूठ दिखाता है'], a: 1, ex: '10¹² byte ÷ 2³⁰ = ~931 GiB। यह इकाई का फ़र्क़ है (SI बनाम IEC), ख़राबी नहीं।' },
      { q: 'BCD में 93 कैसे लिखा जाएगा?', o: ['1011101', '1001 0011', '1100 0011', '0101 1101'], a: 1, ex: 'हर decimal अंक अलग 4 bit में: 9 = 1001, 3 = 0011 ⇒ 1001 0011। साधारण binary में 93 = 1011101 होता, वह BCD नहीं है।' },
      { q: 'Binary में 1 + 1 + 1 (carry सहित) का नतीजा?', o: ['1, carry 0', '0, carry 1', '1, carry 1', '11, carry 1'], a: 2, ex: '1+1+1 = 3 = binary 11 ⇒ उस स्थान पर 1 लिखो और 1 carry आगे। यही full adder का sum/carry है।' },
      { q: 'ISCII क्या था?', o: ['अंतरराष्ट्रीय ASCII', 'भारतीय लिपियों का 8-bit मानक (BIS, 1991)', 'Unicode का नया नाम', 'रंग कोड प्रणाली'], a: 1, ex: 'ISCII = Indian Script Code for Information Interchange — देवनागरी सहित कई भारतीय लिपियाँ; बाद में Unicode ने इसे पीछे छोड़ दिया।' }
    ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — संख्या पद्धति के पक्के प्रश्न', html: '<p>ये लगभग हर पेपर में आते हैं: (1) <b>base व अंक</b> — binary 2, octal 8, hex 16; octal में 8/9 अवैध। (2) <b>रूपांतरण</b> — भाग-विधि (decimal से), weight-विधि (decimal में), समूह-विधि (binary↔octal 3 bit, binary↔hex 4 bit)। (3) <b>2’s complement</b> = 1’s + 1; सीमा −2ⁿ⁻¹ … 2ⁿ⁻¹−1; शून्य एक ही। (4) <b>1 byte = 8 bit, 1 nibble = 4 bit</b>; 1 KB = 1024 byte (परंपरा) बनाम 1000 (SI)। (5) <b>ASCII</b> 7-bit/128, A=65, a=97, 0=48, space=32; <b>Unicode</b> code point, <b>UTF-8</b> 1–4 byte व ASCII-संगत; <b>ISCII</b> भारतीय लिपियों का 8-bit मानक। (6) <b>BCD</b> = हर अंक 4 bit; <b>Gray</b> = एक bit बदलाव; <b>Excess-3</b> = self-complementing; <b>parity</b> पकड़ता है, <b>Hamming</b> सुधारता है। (7) <b>chmod</b> में r=4, w=2, x=1 ⇒ 755 = rwxr-xr-x, 644 = rw-r--r--। हर उत्तर के साथ base का subscript (₂ ₈ ₁₆) लिखना न भूलें।</p>' },

    { type: 'pills', items: [
      { text: 'Binary = Base 2 · Octal = 8 · Hex = 16', kind: 'info' },
      { text: '3 bit = 1 octal अंक · 4 bit = 1 hex अंक', kind: 'tip' },
      { text: '2’s complement = 1’s + 1', kind: 'exam' },
      { text: '1 byte = 8 bit · 1 nibble = 4 bit', kind: 'ok' },
      { text: 'A=65 · a=97 · 0=48 · space=32', kind: 'warn' },
      { text: 'r=4 w=2 x=1 → 755 = rwxr-xr-x', kind: 'info' }
    ] }
  ]
}
]);
