/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-sw1.js
   सॉफ़्टवेयर संसार — भाग 1
     M63 : प्रोग्रामिंग की शुरुआत (sw-prog)
     M64 : ज़रूरी सॉफ़्टवेयर व यूटिलिटीज़ (sw-util)
     M65 : क्लाउड, AI व नई तकनीकें (sw-ai)
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   1. प्रोग्रामिंग की शुरुआत  (sw-prog)
   =================================================================== */
{
  id: 'sw-prog', icon: '👨‍💻', group: 'सॉफ़्टवेयर संसार',
  title: 'प्रोग्रामिंग की शुरुआत — कोड कैसे चलता है',
  sub: 'सॉफ़्टवेयर क्या है, स्रोत कोड से प्रोग्राम तक, compiler बनाम interpreter, IDE, बुनियादी अवधारणाएँ, भाषाएँ, Python/Node सेटअप, एल्गोरिद्म व Git',
  kicker: 'Software World 1 · Getting Started with Programming',
  hero: 'यह पेज प्रोग्रामिंग की <b>नींव</b> देता है — सॉफ़्टवेयर (software) है क्या, आपकी टाइप की गई लाइन CPU तक कैसे पहुँचती है, compiler बनाम interpreter बनाम assembler, IDE बनाम text editor बनाम टर्मिनल, variable (चर) से loop (लूप) व function (फलन) तक हर अवधारणा छोटे चलते उदाहरण के साथ, C से Scratch तक भाषाओं का नक्शा, विंडोज़ व लिनक्स पर Python और Node.js का सेटअप असली कमांड के साथ, एल्गोरिद्म (algorithm) + flowchart + pseudocode के 3 हल किए उदाहरण, डेटा संरचना (data structure) की शुरुआत, Git/GitHub के 6 कमांड और करियर का रास्ता।',
  tags: ['स्रोत कोड से exe तक', 'compiler बनाम interpreter', 'IDE व टर्मिनल', 'variable से OOP तक', 'एल्गोरिद्म व flowchart', 'Git व करियर'],
  blocks: [

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.1</span> सॉफ़्टवेयर (Software) है क्या — और हार्डवेयर से इसका रिश्ता</h3>
      <p><b>हार्डवेयर (hardware)</b> वह सब है जिसे हाथ से छुआ जा सकता है — CPU, RAM, HDD, मॉनिटर, कीबोर्ड। <b>सॉफ़्टवेयर (software)</b> निर्देशों (instructions) का वह सेट है जो हार्डवेयर को बताता है कि <i>क्या</i> करना है, <i>कब</i> करना है और <i>कैसे</i> करना है। सॉफ़्टवेयर छुआ नहीं जाता — यह डिस्क पर बिटों (bits) के रूप में रहता है और चलने के लिए RAM में जाता है।</p>
      <p>सबसे पुरानी और सबसे ज़रूरी बात — <b>बिना हार्डवेयर के सॉफ़्टवेयर नहीं चल सकता, और बिना सॉफ़्टवेयर के हार्डवेयर जड़ है।</b> एक नया खाली SSD लगाने के बाद मशीन कुछ नहीं करती जब तक उसमें firmware, OS और application न डाला जाए। इसीलिए ITI में सॉफ़्टवेयर और हार्डवेयर को दो विषय नहीं, एक ही सिक्के के दो पहलू कहा जाता है।</p>
      <h4 class="blk2">सॉफ़्टवेयर तीन काम करता है</h4>
      <ul>
        <li><b>डिवाइस को चलाता है</b> — driver (अनुक्रमिका) और firmware हार्डवेयर की भाषा बोलते हैं।</li>
        <li><b>संसाधन बाँटता है</b> — OS CPU समय, RAM की जगह, डिस्क और नेटवर्क हर प्रोग्राम को देता है।</li>
        <li><b>उपयोगकर्ता का काम करता है</b> — Word, Excel, ब्राउज़र, गेम, कैलकुलेटर — यही application software है।</li>
      </ul>
      <p>एक प्रोग्राम लिखने वाला व्यक्ति <b>programmer / developer (डेवलपर)</b> कहलाता है, और उससे बने काम को <b>coding (कोडिंग)</b> कहा जाता है। कोडिंग की भाषा मनुष्य के लिए होती है; CPU के लिए केवल मशीन भाषा (machine language — 0 और 1) होती है। पूरी प्रोग्रामिंग क्लास इसी खाई को पाटने का तरीका सिखाती है।</p>` },

    { type: 'table', head: ['परत (Layer)', 'उदाहरण', 'क्या करती है', 'इस लैब का संबंधित पेज'],
      rows: [
        ['1. Firmware', 'BIOS/UEFI, कीबोर्ड का एम्बेडेड कंट्रोलर, राउटर फ़र्मवेयर', 'चिप के अंदर स्थायी सॉफ़्टवेयर; power-on और डिवाइस का सबसे निचला नियंत्रण', 'बायोस (BIOS) व सर्विस मॉड्यूल'],
        ['2. Hardware', 'CPU, RAM, SSD, GPU, USB नियंत्रक', 'भौतिक उपकरण जो निर्देश चलाते हैं और डेटा रखते हैं', 'मदरबोर्ड, स्टोरेज, पावर सप्लाई'],
        ['3. Operating System kernel', 'Windows NT kernel, Linux kernel', 'प्रोसेस, मेमोरी, फ़ाइल, डिवाइस व नेटवर्क का मालिक', 'विंडोज़ मास्टरक्लास व लिनक्स मास्टरक्लास'],
        ['4. System software / utility', 'Explorer, डिस्क टूल, एंटीवायरस, ड्राइवर पैकेज', 'OS और मशीन को चलता-स्वच्छ रखना', 'इसी फ़ाइल का sw-util भाग'],
        ['5. Runtime व framework', '.NET, Java JVM, Python interpreters, Node.js, WebView', 'प्रोग्राम चलने के लिए आवश्यक मध्यवर्ती भाषा — असल में application का आधार', 'सॉफ़्टवेयर इंस्टॉलेशन के पेज'],
        ['6. Application software', 'MS Office, LibreOffice, Chrome, Photoshop, VLC', 'सीधे उपयोगकर्ता का काम', 'MS Office मास्टरक्लास'],
        ['7. User data', 'दस्तावेज़, चित्र, वीडियो, कोड फ़ाइलें', 'सॉफ़्टवेयर जो बनाता/पढ़ता है वह सब', 'बैकअप व फ़ाइल मैनेजमेंट']
      ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — सॉफ़्टवेयर का वर्गीकरण', html: '<p>सबसे आम अंक-प्रश्न: <b>सॉफ़्टवेयर के दो बड़े वर्ग</b> — <b>(1) System software</b> (OS, driver, utility, firmware) और <b>(2) Application software</b> (जॉब-ओरिएंटेड प्रोग्राम)। तीसरा शब्द जो अक्सर अलग पूछा जाता है — <b>Programming software</b> (compiler, debugger, IDE)। उदाहरण सहित लिखें: System = Windows, Linux, डिस्प्ले ड्राइवर; Application = Word, Excel, VLC; Programming = GCC, Python, VS Code।</p>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.2</span> स्रोत कोड से चलते प्रोग्राम तक — पूरी शृंखला</h3>
      <p>आप <code>hello.c</code> में जो अंग्रेज़ी-जैसी भाषा लिखते हैं उसे <b>source code (स्रोत कोड)</b> कहते हैं। CPU उसे सीधे नहीं समझता। बीच में पाँच काम होते हैं:</p>
      <ol>
        <li><b>Preprocessing</b> — <code>#include</code>, macro व comment हटाना/जोड़ना (C/C++ में पहला चरण; फल स्वरूप एक expanded फ़ाइल बनती है)।</li>
        <li><b>Compilation</b> — स्रोत कोड से <b>assembly code (सम्मेलन कोड)</b> या सीधे <b>object code</b> बनाना; syntax ग़लतियाँ यहीं पकड़ती हैं।</li>
        <li><b>Assembly</b> — assembly कोड से <b>machine code</b> की <code>.obj/.o</code> फ़ाइल (इसे assembler करता है)।</li>
        <li><b>Linking</b> — कई <code>.o</code> फ़ाइलें + लाइब्रेरियाँ (library) जोड़कर एक <b>executable</b> बनाना; <code>printf</code> का असली कोड यहीं जुड़ता है (static या dynamic linking)।</li>
        <li><b>Loading व execution</b> — OS executable को डिस्क से RAM में लादता है, CPU उसे fetch–decode–execute चक्र से चलाता है।</li>
      </ol>
      <p>इसीलिए विंडोज़ का <code>.exe</code> और लिनक्स का बिना extension वाला binary एक जैसे नहीं हो सकते — दोनों का executable फ़ॉर्मैट अलग है (<b>PE/COFF</b> बनाम <b>ELF</b>) और instruction सेट (ISA — निर्देशों का शब्दकोश) x86-64 पर भी अलग-अलग OS कॉल बुलाने का तरीका रखता है। इसी कारण लिनक्स का binary विंडोज़ पर नहीं चलता; उसके लिए WSL (Windows Subsystem for Linux) या VM चाहिए।</p>` },

    { type: 'table', head: ['तुलना', 'Compiler (संकलक)', 'Interpreter (व्याख्याकार)', 'Assembler (सम्मेलक)'],
      rows: [
        ['इनपुट', 'पूरा source file (.c, .cpp, .go, .rs)', 'लाइन/बाइट-कोड पढ़कर तुरंत चलाता है (.py, .js, .sh)', 'assembly mnemonic (.asm)'],
        ['आउटपुट', 'object/machine code, फिर executable (.exe/a.out)', 'कोई फ़ाइल नहीं — नतीजा स्क्रीन पर (bytecode बन सकता है)', 'machine code का object फ़ाइल'],
        ['गति (execution)', 'बनने के बाद तेज़ (दोबारा अनुवाद नहीं)', 'तुलनात्मक रूप से धीमी (हर बार अनुवाद)', '— (निचला स्तर)'],
        ['ग़लती पकड़ना', 'बनते समय पूरी syntax जाँच (compile-time error)', 'चलते समय पहली ग़लती पर रुकता (runtime error)', 'केवल mnemonic/label की ग़लती'],
        ['डिबगिंग आसान?', 'थोड़ा कठिन — map/.sym/DWARF चाहिए', 'आसान — लाइन-बाय-लाइन, REPL से', 'बहुत कठिन'],
        ['कहाँ शुरू होता है', 'C, C++, Go, Rust, Pascal; Java में javac पहले bytecode बनाता है', 'Python, PHP, shell scripts, JavaScript (ब्राउज़र)', 'Driver/firmware/खुद compiler का कुछ हिस्सा'],
        ['फ़ाइल का उदाहरण', 'gcc hello.c -o hello', 'python hello.py', 'nasm hello.asm'],
        ['परीक्षा-एक-पंक्ति-जवाब', 'पूरा अनुवाद एक बार, फिर binary चलता है', 'लाइन-दर-लाइन अनुवाद व execution एक साथ', 'सिंबोलिक निर्देश को मशीन बाइनरी बनाता है']
      ] },

    { type: 'html', html: `<h4 class="blk2">Bytecode, JVM व .NET — "एक बार लिखो, हर जगह चलो" का असली तरीका</h4>
      <p>Java और C# दोनों <b>दो-चरणीय (two-stage)</b> मॉडल चलाते हैं। <code>javac Main.java</code> मशीन कोड नहीं, बल्कि <b>bytecode</b> बनाता है (<code>Main.class</code>)। वह bytecode किसी भी OS/CPU पर एक जैसा रहता है। चलते समय <b>JVM (Java Virtual Machine)</b> उसे अपनी मशीन के मशीन कोड में बदलता है। JVM का हिस्सा जो बार-बार चलने वाले कोड को तुरंत मशीन कोड बना देता है, उसे <b>JIT (Just-In-Time) compiler</b> कहते हैं।</p>
      <p>.NET में वही काम <b>IL (Intermediate Language)</b> और <b>CLR (Common Language Runtime)</b> करते हैं; C# का <code>dotnet build</code> DLL में IL बनाता है। Python भी पहले <code>.py</code> को <b>bytecode</b> (<code>.pyc</code>, <code>__pycache__/</code> में) बनाता है, फिर CPython का VM उसे चलाता है — अतः "Python interpreter है" कहना आधा सच है; असल में compile-then-interpret मिला हुआ है। JavaScript ब्राउज़र में पहले AST/bytecode बनता है, फिर JIT मशीन कोड — इसलिए Chrome का V8 engine "interpreter" कहने से ज़्यादा "JIT compiler" है।</p>
      <p>दो शब्द और: <b>AOT (Ahead-Of-Time)</b> compilation = चलने से पहले मशीन कोड (C++, Go, Rust, Java का <code>native-image</code>) — तेज़ शुरुआत, बड़ी फ़ाइल; <b>JIT</b> = चलते समय अनुवाद — थोड़ा warm-up, पर चलते-चलतेबार-बार चलने वाला कोड को ऑप्टिमाइज़ कर सकता है।</p>` },

    { type: 'code', code: `# ---- C : compile होकर binary बनता है, फिर चलता है ----
gcc hello.c -o hello          # preprocess + compile + assemble + link (एक कमांड)
gcc -E hello.c -o hello.i     # केवल preprocessing देखें
gcc -S hello.c -o hello.s     # assembly (.s) दिखाएँ
gcc -c hello.c -o hello.o     # object file (अभी link नहीं हुई)
./hello                       # लिनक्स पर चलाना
hello.exe                     # विंडोज़ (MinGW-w64 पर बनाई गई फ़ाइल) पर चलाना
gcc -O2 -Wall hello.c -o hello   # optimize + सभी warnings

# ---- C++ ----
g++ main.cpp -o app
g++ -std=c++17 -Wall -g main.cpp -o app   # मानक + warnings + debug info

# ---- Java : दो चरण (compile -> run on JVM) ----
javac Main.java               # Main.class (bytecode)
java Main                     # JVM bytecode को JIT करके चलाता है
java -version                 # JVM/कौन-सा JDK
javap -c Main                 # bytecode disassembly देखना

# ---- Python : source -> bytecode -> CPython VM ----
python hello.py
python -m py_compile hello.py # सिर्फ़ compile जाँच (syntax)
python -i hello.py            # चलने के बाद interactive shell खुले
python -O hello.py            # assertions हटाकर चलाएँ

# ---- JavaScript ----
node app.js                    # V8 JIT engine (terminal में)
node -e "console.log(6*7)"     # एक लाइन तुरंत
node --jitless app.js          # JIT बंद करके सादा interpreter मोड` },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — compiler बनाम interpreter (क्लासिक 5 अंक)', html: '<p>चार बिंदु में लिखें: <b>(1)</b> compiler पूरे कार्यक्रम को एक बार में अनुवाद करता है, interpreter लाइन/बाइट-कोड स्तर पर अनुवाद-चलाना साथ-साथ करता है। <b>(2)</b> compiler का आउटपुट executable/intermediate फ़ाइल, interpreter का कोई executable नहीं। <b>(3)</b> compiler गति तेज़, interpreter आसान डीबगिंग व cross-platform। <b>(4)</b> उदाहरण — compiler: GCC (C), g++ (C++), javac (Java, bytecode); interpreter: Python, PHP, shell; assembler: NASM।एक और बात: <b>bytecode + JVM = दोनों का मिश्रण</b> (portability + JIT speed)।</p>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.3</span> कहाँ लिखें? Text editor बनाम IDE बनाम Terminal</h3>
      <p>कोड लिखने के लिए तीन काम मिलते हैं — <b>लिखना</b> (editor), <b>चलाना</b> (terminal / run button), <b>ठीक करना</b> (debugger)। <b>Text editor</b> केवल फ़ाइल खोलता-बचता है; syntax रंग (highlighting) अच्छा editor देते हैं। <b>IDE (Integrated Development Environment — समाहित विकास परिवेश)</b> में editor + build + debugger + code completion + परियोजना प्रबंधन एक साथ है। <b>Terminal/Console</b> वह काली खिड़की है जहाँ कमांड टाइप कर compiler/interpreter चलता है — सर्वर व CI (Continuous Integration) पर यही एकमात्र साधन है।</p>
      <p><b>REPL (Read-Eval-Print Loop)</b> ध्यान देने लायक शब्द है — टर्मिनल में <code>python</code>, <code>node</code> या <code>irb</code> टाइप करते ही <code>>></code> प्रॉम्प्ट आता है और एक-एक लाइन तुरंत चलती है; नई अवधारणा सीखने का सबसे तेज़ तरीका। VS Code में <code>Ctrl+Shift+P</code> → <code>Terminal: Create New Terminal</code> या सीधे <code>Ctrl + Backtick</code> से टर्मिनल खुलता है।</p>` },

    { type: 'table', head: ['प्रकार', 'उदाहरण', 'अंदर क्या मिलता है', 'किसके लिए', 'कमज़ोरी'],
      rows: [
        ['Plain text editor', 'Notepad (विंडोज़), nano (लिनक्स)', 'बस टाइपिंग व सेव; कोई build नहीं', 'छोटी फ़ाइल, config एडिट, त्वरित नोट', 'गड़बड़ पकड़ने का कोई साधन नहीं'],
        ['Code editor', 'VS Code, Sublime Text, Notepad++, Vim, Emacs, Atom (सेवानिवृत्त)', 'Syntax highlighting, file tree, extension, integrated terminal, Git diff', 'ज़्यादातर छात्र व वेब/Python/JS डेवलपर — हल्का और मुफ़्त', 'भारी परियोजनाओं का debugger/refactoring सीमित'],
        ['Full IDE', 'Visual Studio, IntelliJ IDEA, PyCharm, Android Studio, Eclipse, Code::Blocks', 'Editor + compiler/build + debugger + profiler + UI designer + Refactoring', 'बड़े C++/Java/Android/.NET प्रोजेक्ट, कॉलेज लैब', 'भारी (RAM/CPU खाता), सीखने में समय'],
        ['Online editor', 'replit, Google Colab, Programiz, JDoodle, CodePen', 'ब्राउज़र में interpreter/JIT + सेव + शेयर', 'लैब का पुराना PC, पहला कोड, बिना इंस्टॉल अभ्यास', 'इंटरनेट पर निर्भर, फ़ाइल/लाइब्रेरी सीमित'],
        ['Terminal + editor', 'Vim/Neovim + gcc, tmux, nano + python', 'SSH सर्वर पर कोड व build', 'सर्वर केयर, दूर से काम, CI स्क्रिप्ट', 'शुरुआत में कठिन (विशेषकर Vim)'],
        [' Notebook UI', 'Jupyter (Python)', 'कोड + आउटपुट + चार्ट + नोट एक फ़ाइल (.ipynb) में', 'डेटा विश्लेषण, अध्यापन, AI प्रयोग', 'बड़ी सॉफ़्टवेयर परियोजना के लिए नहीं']
      ] },

    { type: 'callout', kind: 'tip', title: 'लैब के लिए चुनाव', html: '<p>छात्रों की पहली भाषा Python + <b>VS Code</b> (मुफ़्त, हल्का, Hindi UI उपलब्ध)। C/C++ पढ़ा रहे हैं तो <b>Code::Blocks</b> या VS Code + MinGW-w64 GCC; Java के लिए <b>IntelliJ IDEA Community</b> (मुफ़्त) सबसे कम परेशानी देता है। Android सिखा रहे हैं तो <b>Android Studio</b> अनिवार्य है, क्योंकि उसका emulator ही असली टेस्ट देता है।</p>' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.4</span> प्रोग्राम की सात ईंटें — variable, data type, operator, condition, loop, function, array</h3>
      <p>हर भाषा के नाम अलग हैं, पर अवधारणाएँ (concepts) एक ही हैं। <b>variable (चर)</b> = RAM में नाम वाली डिब्बी; <b>data type (डेटा प्रकार)</b> = डिब्बी का आकार और उसमें क्या रख सकते हैं; <b>operator (संकारक)</b> = काम करने का चिह्न; <b>condition (सशर्त कथन)</b> = "अगर… तो… वरना"; <b>loop (लूप)</b> = बार-बार एक ही काम; <b>function (फलन / विधि)</b> = नाम दिया हुआ छोटा कार्यक्रम जिसे दोबारा बुलाया जा सके; <b>array (सरणी)</b> = एक जैसे प्रकार के कई मान एक नाम से। इन सात के ऊपर string (श्रृंखला), OOP और exception (अपवाद) आते हैं।</p>
      <p><b>variable बनाम constant:</b> variable का मान बदल सकता है (<code>age = 16</code> के बाद <code>age = 17</code>), constant नहीं बदलता (C में <code>const float PI = 3.14159;</code>, Python में परंपरा से पूरे बड़े अक्षर <code>PI = 3.14</code>)।</p>
      <p><b>नाम रखने के नियम (सभी भाषाओं में लगभग एक):</b> अक्षर या underscore (_) से शुरू, संख्या से नहीं; खाली जगह नहीं; कीवर्ड (if, while, class) नाम नहीं; C/Java में <code>Age</code> और <code>age</code> अलग-अलग (case-sensitive)।</p>` },

    { type: 'code', code: `# ---------- variable व data type (Python) ----------
name = "Ravi"        # str      (स्ट्रिंग)
age = 17             # int      (पूर्णांक)
marks = 88.5         # float    (दशमलव)
passed = True        # bool     (सत्य/असत्य)
print(name, age, marks, passed)
print(type(age))     # <class 'int'>  -- प्रकार जाँचने का तरीका
age = age + 1        # मान बदला जा सकता है
print(age)           # 18

// ---------- variable व data type (C) ----------
#include <stdio.h>
int main(void) {
    int    age   = 17;          // 4 बाइट (आधुनिक x86-64 पर)
    float  pi    = 3.14f;       // 4 बाइट, लगभग 6 दशमलव स्थान तक सटीक
    double d     = 3.14159265;  // 8 बाइट, अधिक सटीक
    char   grade = 'A';         // 1 बाइट, एक अक्षर (single quote)
    _Bool  ok    = 1;           // 0 या 1
    printf("%d %.2f %c %d\\n", age, d, grade, ok);
    return 0;
}

// ---------- variable (Java : type पहले से घोषित करना पड़ता है) ----------
int age = 17;
double pi = 3.14159;
String name = "Ravi";
final int CLASS_SIZE = 40;   // final = constant, बाद में बदलने पर compile error` },

    { type: 'table', head: ['Data type', 'क्या रखता है', 'C', 'Java', 'Python', 'ध्यान रखने लायक'],
      rows: [
        ['Integer (पूर्णांक)', '... -2, -1, 0, 1, 2 ...', 'int, long, short, unsigned int', 'int (32-bit), long (64-bit)', 'int', 'Python का int कभी overflow नहीं करता (जितनी RAM उतना बड़ा)'],
        ['Float / Double', 'दशमलव वाले मान, 3.14, -0.001', 'float (32), double (64)', 'float, double', 'float', '0.1 + 0.2 बराबर 0.3 नहीं आता — binary भिन्न की मजबूरी; पैसों के लिए Decimal/int paisa उपयोग करें'],
        ['Character', 'एक अक्षर', "char (1 बाइट, single quote 'A')", 'char (2 बाइट, Unicode)', 'str का लंबाई-1 मान', "ASCII में 'A'=65, 'a'=97; Hindi के अक्षर Unicode (Devanagari ब्लॉक) में"],
        ['Boolean', 'सत्य / असत्य', '_Bool / bool, 0 = false', 'boolean (true/false)', 'bool (True/False)', 'C में गैर-शून्य = सच; Python में खाली list/str भी False'],
        ['String (श्रृंखला)', 'अक्षरों का क्रम', 'char[] + terminating \\0', 'String (अपरिवर्तनीय/immutable)', 'str (immutable)', 'Java/Python में बदलने पर नई फ़ाइल जैसी नई वस्तू बनती है'],
        ['Array (सरणी)', 'एक जैसे प्रकार का निश्चित आकार', 'int a[5]; आकार compile पर तय', 'int[] a = new int[5];', 'list (आकार बदल सकता है)', 'index 0 से शुरू — a[5] का आखिरी मान a[4]'],
        ['Null / None', 'कुछ नहीं / खाली संदर्भ', 'NULL (pointer)', 'null', 'None', 'Java में null वस्तू पर . चलाएँ तो NullPointerException'],
        ['User-defined', 'struct, class, enum', 'struct Student {…}', 'class Student {…}', 'class Student: …', 'अपना डेटा रूप बनाने का तरीका — OOP की शुरुआत']
      ] },

    { type: 'table', head: ['समूह', 'Operator', 'मतलब / उदाहरण', 'कहाँ मिलता है'],
      rows: [
        ['Arithmetic (अंकगणित)', '+ - * / %', 'जोड़, घटाव, गुणा, भाग, शेषफल (17 % 5 = 2)', 'सभी भाषाएँ'],
        ['Arithmetic (विशेष)', '// ** या ^', 'Python में // = पूर्णांक भाग (7//2=3), ** = घात (2**10=1024); C/Java में ^ bitwise XOR है, घात नहीं', 'Python बनाम C'],
        ['Assignment', '= += -= *= /= %=', 'x += 5 यानी x = x + 5 (compound assignment)', 'सभी भाषाएँ'],
        ['Relational (तुलना)', '== != > < >= <=', 'बराबर/नाबराबर/बड़ा/छोटा; नतीजा हमेशा boolean', 'सभी भाषाएँ'],
        ['Equality की गड़बड़', '= बनाम ==', 'if (x = 5) C में मान देता है (हमेशा सच), if (x == 5) तुलना करता है', 'सबसे पुरानी bug'],
        ['Logical (तार्किक)', '&& || ! (C/Java) और and or not (Python)', 'दो शर्तें जोड़ना/विकल्प/उलटना', 'सभी भाषाएँ'],
        ['Short-circuit', '&& और || का काम रुकना', 'a && b में a झूठ हो तो b नहीं चलता (safe check: if (p != NULL && p->x > 0))', 'C/C++/Java/JS/Python'],
        ['Bitwise (बाइट-स्तरीय)', '& | ^ << >> ~', 'बिट चलाकर गुणा/भाग, mask, flags, parity; x << 1 यानी x*2', 'सिस्टम/एम्बेडेड कोड'],
        ['Increment', '++ -- i+=1', 'i++ पुराना मान देकर बढ़ाता है, ++i बढ़ाकर नया मान देता है', 'C/Java/JS'],
        ['Ternary', 'shart ? A : B', 'एक-लाइन if-else: max = a > b ? a : b;', 'C/Java/JS/Python (if-else expression)'],
        ['Membership/Identity', 'in, is / is-not (Python)', "'a' in 'apple', x is None", 'Python, JS में in केवल object key के लिए'],
        ['String join/concat', '+ या concat या join/f-string', '"Ram" + " " + "Mohan"; Python f"{name} {age}"', 'हर भाषा में अलग वर्तनी']
      ] },

    { type: 'code', code: `# ---------- condition (सशर्त कथन) ----------
marks = 72
if marks >= 75:
    print("Distinction")
elif marks >= 60:
    print("First division")
elif marks >= 45:
    print("Second division")
else:
    print("Fail")

# nested condition + logical operator
age = 19
has_id = True
if age >= 18 and has_id:
    print("Voting allowed")

/* ---------- condition (C) ---------- */
int m = 72;
if (m >= 75)      printf("Distinction");
else if (m >= 60) printf("First division");
else if (m >= 45) printf("Second division");
else              printf("Fail");
char div = (m >= 60) ? 'A' : 'B';      // ternary` },

    { type: 'code', code: `# ---------- loop (लूप) ----------
# for : गिना हुआ दोहराव (0 से 4 तक)
for i in range(5):
    print("Batch", i)

# while : शर्त के अनुसार दोहराव
n = 5
total = 0
while n > 0:
    total += n          # 5+4+3+2+1
    n -= 1              # तरक्की न करें तो infinite loop
print("total =", total)

# break / continue / else
for x in [2, 4, 7, 9]:
    if x == 7:
        break           # लूप वहीं खत्म
    if x % 2 == 0:
        continue        # इस बार नीचे का काम छोड़ो
    print(x)

/* ---------- loop (C) ---------- */
for (int i = 1; i <= 10; i++) {        // init; test; step
    if (i == 5) continue;
    if (i == 8) break;
    printf("%d ", i);
}
int j = 1;
while (j <= 100) { sum += j; j++; }
do { printf("कम-से-कम एक बार चलेगा\\n"); } while (0);   // do-while`,
      note: 'while (1) या for(;;) = जान-बूझकर का अनंत लूप — सर्वर/एम्बेडेड main loop यही होता है; बंद करने के लिए Ctrl+C।' },

    { type: 'code', code: `# ---------- function (फलन) ----------
def area(r):                 # def से फलन परिभाषित
    return 3.14159 * r * r

print(area(2))               # 12.566 -- कॉल (call)

def greet(name="Atithi"):    # default argument
    return f"Namaste, {name}!"
print(greet()); print(greet("Sita"))

def add(*nums):              # variable arguments
    s = 0
    for n in nums: s += n
    return s
print(add(1, 2, 3, 4))       # 10

# scope: स्थानीय चर फलन के बाहर नहीं दिखता
x = 10
def f():
    x = 5              # यह अलग स्थानीय x है
f(); print(x)          # अभी भी 10

/* ---------- function (C) ---------- */
int square(int n) {            // return-type + नाम + पैरामीटर
    return n * n;
}
void show(void) { printf("main function se pehle prototype chahiye\\n"); }
int main(void) {
    int r = square(7);         // 49
    printf("%d\\n", r);
    return 0;                  // 0 = सफलता का संकेत OS को
}` },

    { type: 'code', code: `# ---------- array / list ----------
marks = [45, 78, 92, 61]        # list (सरणी जैसा, आकार लचीला)
print(marks[0])                 # 45   (index 0 से शुरू)
print(marks[-1])                # 61   (ऋणात्मक index = पीछे से)
print(len(marks))               # 4    कुल तत्व
marks.append(55)                # जोड़ें
marks.sort()                    # क्रम
print(sum(marks), max(marks))   # योग व अधिकतम
for m in marks:                 # हर तत्व पर लूप
    print(m, end=" ")

/* ---------- array (C) ---------- */
int a[5] = {45, 78, 92, 61, 55};
int sum = 0;
for (int i = 0; i < 5; i++) sum += a[i];
int grid[2][3] = {{1,2,3},{4,5,6}};   // 2D array (matrix)
printf("sum=%d, grid[1][2]=%d\\n", sum, grid[1][2]);
// ध्यान रखें: C में index 5 पर जाकर a[5] पढ़ना = undefined behaviour
// (आउट-ऑफ-बॉउंड्स बग — स्क्रीन garbage, क्रैश, या security hole)`,
      note: 'C/C++ में सरणी का आकार compile/declaration समय तय; Python list, Java ArrayList में आकार बदल सकता है।' },

    { type: 'code', code: `# ---------- string (श्रृंखला) ----------
s = "Computer Laboratory"
print(len(s))              # 19 लंबाई
print(s[0], s[-1])         # C  y
print(s.upper())           # COMPUTER LABORATORY
print(s.lower().count("a"))# 'a' कितनी बार
print(s.replace("Lab", "Labz"))
print(s.split(" "))        # शब्दों की list
print("-".join(["a","b"])) # जोड़ना
print("Hi" + str(5))       # int को str बनाना ज़रूरी, वरना TypeError
full = f"{s} at {len(s)}"  # f-string (सबसे साफ़ तरीका)
print("123".isdigit(), "abc".isalpha(), " x ".strip())

/* ---------- string (C : char array + '\\0') ---------- */
char name[20] = "Ravi";
printf("%s, len=%d\\n", name, strlen(name));   // strlen -> 4
strcat(name, " Kumar");                        // जोड़ें (buffer ध्यान से)
strcmp(name, "Ravi Kumar");                    // 0 बराबर हो तो
char buf[32];
sprintf(buf, "Marks = %d", 88);                // number -> text
/* Java : String immutability */
String a = "Hi"; a = a + "!";   // पुरानी वस्तू नहीं बदली, नई बनी`,
      note: 'String तुलना C में == से नहीं (वह पता-स्थान तुलना), strcmp से करनी है — यह सबसे आम practical exam प्रश्न है।' },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.5</span> OOP (Object-Oriented Programming) — class और object की नींव</h3>
      <p><b>OOP = वस्तू-उन्मुख प्रोग्रामिंग।</b> प्रोग्राम को "डेटा + उस पर काम करने वाले फलन" की <b>वस्तुओं (objects)</b> में तोड़ने का तरीका। <b>class (वर्ग)</b> नक्शा/ब्लूप्रिंट है, <b>object (वस्तू)</b> उस नक्शे से बनी असली चीज़। जैसे <code>class Student</code> एक परिभाषा है; "रवि", "सीता" दो objects हैं — एक ही नक्शे से बने, अलग-अलग मान रखते हैं।</p>
      <h4 class="blk2">चार स्तंभ (चारों नाम-परिभाषा परीक्षा में अंक देते हैं)</h4>
      <ul>
        <li><b>Encapsulation (संवलन)</b> — डेटा को methods के पीछे छिपाकर रखना; <code>private int marks;</code> के लिए <code>getMarks()</code>/<code>setMarks()</code>। सीधा फ़ायदा: ग़लत मान (जैसे -50) अंदर जाने से रोका जा सकता है।</li>
        <li><b>Inheritance (विरासत)</b> — नई class पुरानी class का कोड लेती है: <code>class PartTimeStudent extends Student</code>। बार-बार लिखने से बचाव। Java में एक ही times single inheritance, C++ multiple विरासत लेता है।</li>
        <li><b>Polymorphism (बहु रूपता)</b> — एक ही नाम, अलग व्यवहार: <code>shape->draw()</code> वृत्त में circle draw, वर्ग में square draw (method overriding), या same नाम अलग arguments (overloading)।</li>
        <li><b>Abstraction (अमूर्तन)</b> — जटिलता छिपाकर केवल ज़रूरी चीज़ दिखाना; <code>Car.start()</code> बोलना — इंजन की सैकड़ों क्रियाएँ अंदर छिपी हैं। interface/abstract class इसी का उपकरण है।</li>
      </ul>
      <p>बाक़ी शब्द जो साथ आते हैं: <b>constructor</b> (वस्तू बनते ही चलने वाला कोड), <b>method</b> (class के अंदर का फलन), <b>this/self</b> (वही वस्तू), <b>attribute/field</b> (डेटा), <b>instance</b> (वस्तू का दूसरा नाम)। OOP के बिना भी छोटा काम चलता है (procedural C), पर 500 फ़ाइलों वाला प्रोजेक्ट OOP के बिना नहीं संभलता — इसीलिए Java/C++/C#/Python इसे सिखाते हैं।</p>` },

    { type: 'code', code: `# ---------- OOP : Python ----------
class Student:                      # class = नक्शा
    school = "ITI Kanpur"           # class-level attribute (सबमें साझा)

    def __init__(self, name, marks):   # constructor (वस्तू बनते ही चलता है)
        self.name = name               # instance attribute
        self.__marks = marks           # __ से name mangling (छोटा सा private)

    def show(self):                  # method (self = यह वस्तू)
        return f"{self.name}: {self.__marks}"

    def set_marks(self, m):          # encapsulation का Guard
        if 0 <= m <= 100:
            self.__marks = m
        else:
            print("Invalid marks")

a = Student("Ravi", 78)              # object/instance बने
b = Student("Sita", 85)
print(a.show(), b.show(), a.school)
a.set_marks(-5)                       # Guard ने रोका

class PartTime(Student):             # inheritance
    def show(self):                  # polymorphism : override
        return f"{self.name} (part-time)"
print(PartTime("Mohan", 60).show())

// ---------- OOP : Java ----------
class Student {
    private int marks;                       // encapsulation
    Student(int m) { this.marks = m; }        // constructor
    int getMarks() { return marks; }
    void setMarks(int m) { if (m>=0 && m<=100) marks = m; }
}
class Shape { void draw() { System.out.println("shape"); } }
class Circle extends Shape {                  // inheritance
    @Override void draw() { System.out.println("circle"); }  // polymorphism
}` },

    { type: 'html', html: `<h3 class="blk"><span class="blk-n">1.6</span> bug (कीड़ा) और debugging (दोष-निदान)</h3>
      <p><b>bug</b> = प्रोग्राम में ग़लती जिससे वह गलत नतीजा दे, रुक जाए या क्रैश हो। शब्द प्रसिद्ध <b>Grace Hopper</b> की 1947 की घटना से हुआ, जब Mark II रिले-कंप्यूटर में एक पतंगा फँसा मिला और log में "first actual case of bug being found" लिखा गया। bug निपटाने की प्रक्रिया <b>debugging</b> कहलाती है; इसे दूर करने वाला तर्कसंगत काम है, अनुमान का खेल नहीं।</p>
      <p><b>डिबगिंग का चार-कदम सूत्र (यही इंटरव्यू में बोलिए):</b> (1) <b>पुनरुत्पादन</b> (reproduce) — वही input/कदम दोबारा दोहराकर त्रुटि लाएँ। (2) <b>संकीर्णन</b> (isolate) — कोड छोटा करते जाएँ; जहाँ तक ग़लती दिखे वहीं बग है (binary search सोचें)। (3) <b>कारण</b> (root cause) — "क्यों" तीन बार पूछें: मान ग़लत आया → क्योंकि index ग़लत → क्योंकि loop 1 से शुरू हुआ जबकि array 0 से। (4) <b>ठीक करके जाँचना</b> (fix + regression test) — वही टेस्ट फिर चलाएँ और दो और किनारे के case (खाली input, अधिकतम) भी जाँचें।</p>
      <h4 class="blk2">तीन साधन जो हर छात्र को आने चाहिए</h4>
      <ul>
        <li><b>print debugging</b> — संदेह वाली लाइन के नीचे <code>print(x)</code>/<code>printf("%d\\n", x)</code> — सबसे तेज़, क्लासरूम में सबसे व्यावहारिक।</li>
        <li><b>debugger</b> — breakpoint लगाकर रोकना, <b>step over / step into</b> से लाइन-दर-लाइन चलाना, watch/locals में मान देखना, call stack से "किसने बुलाया" पता करना। VS Code में <code>F5</code> शुरू, <code>F10</code> step over, <code>F11</code> step into, <code>F5</code> continue।</li>
        <li><b>compiler warnings व linter</b> — <code>-Wall</code> (GCC), <code>pylint</code>/<code>flake8</code>, <code>eslint</code> बिना चलाए ग़लती बताते हैं; warnings को "छोटी बात" समझकर नज़रअंदाज़ करना नए डेवलपर की सबसे बड़ी आदत है।</li>
      </ul>` },

    { type: 'table', head: ['त्रुटि का प्रकार', 'कब पकड़ती है', 'उदाहरण (संदेश सहित)', 'ठीक करने का तरीका'],
      rows: [
        ['Syntax error (वाक्य-गठन)', 'compile/interpret के समय, चलने से पहले', 'Python: <code>SyntaxError: expected \':\'</code> ; C: <code>expected \';\' before \'}\'</code>', 'कोष्ठक, colon, semicolon, quote मिलाएँ; अक्सर लाइन के ऊपर की ग़लती नीचे दिखती है'],
        ['Compile/link error', 'build के समय', '<code>undefined reference to \'square\'</code> (linker), <code>fatal error: stdio.h: No such file</code>', 'फ़ंक्शन लिखें/लिंक करें; include path व -l flags जाँचें'],
        ['Runtime error (exception)', 'चलते समय किसी मान पर', '<code>ZeroDivisionError</code>, <code>IndexError: list index out of range</code>, <code>NullPointerException</code>, <code>Segmentation fault (core dumped)</code>', 'input जाँचें (शर्त/try-catch), array सीमा, pointer null; segfault में आउट-ऑफ-बॉउंड्स लिखना सबसे आम कारण'],
        ['Logical error', 'कभी नहीं पकड़ती — नतीजा ग़लत', 'average में sum/2 के बजाय sum/n भूलना; off-by-one (loop < बनाम <=)', 'test case से जाँचें, dry-run करके कागज़ पर मान चलें'],
        ['Semantic error', 'compile OK पर अर्थ ग़लत', '<code>if (x = 5)</code> (तुलना की जगह assignment) — C चुपचाप स्वीकार करता है', '<code>-Wall</code> enable करें, == और = का अभ्यास'],
        ['Resource error', 'चलते/बंद होते समय', '<code>FileNotFoundError</code>, <code>Permission denied</code>, <code>StackOverflowError</code> (अनंत recursion), memory leak', 'path व अनुमति जाँचें; recursion में base case; फ़ाइल close / with-block'],
        ['Off-by-one', 'तर्क त्रुटि की सबसे आम किस्म', '<code>for (i=0; i<=n; i++)</code> n+1 बार चला', 'सीमा पर सोचें: पहला व आखिरी index कौन-सा?'],
        ['Race/concurrency bug', 'कभी-कभी (नपटने लायक)', 'दो thread एक ही variable बदलें तो अंक गिरते', 'lock/mutex/synchronized; पहले से एक ही thread में काम रखना बेहतर'],
        ['Environment bug', "'मेरे लैपटॉप पर तो चलता है'", 'अलग Python वर्ज़न, PATH नहीं, library missing, 32/64-bit मिसमैच', 'version+path likhkar share karein, virtualenv/requirements.txt se same build']
      ] },

    { type: 'code', code: `# ---------- try / except : अपवाद संभालना (Python) ----------
try:
    a = int(input("bhagyaank: "))
    print(100 / a)
except ValueError:
    print("ankh daaliye, shabd nahi")
except ZeroDivisionError:
    print("shunya se bhaag nahi dete")
finally:
    print("har sthiti mein chalta hai")   # cleanup यहाँ

# ---------- debugging : Python (pdb) ----------
# hello.py में एक लाइन डालें:  import pdb; pdb.set_trace()   या   breakpoint()
python -m pdb hello.py
#   (Pdb) n          अगली लाइन (next)
#   (Pdb) s         अंदर जाएँ (step into function)
#   (Pdb) c         continue (अगले breakpoint तक)
#   (Pdb) p marks   मान print करें
#   (Pdb) l        स्रोत कोड दिखलाएँ
#   (Pdb) w         call stack (किसने किसे बुलाया)
#   (Pdb) q         बाहर

# ---------- debugging : GDB (C/C++) ----------
gcc -g -Wall main.c -o main       # -g = debug symbols, अनिवार्य
gdb ./main
(gdb) break main                  # breakpoint
(gdb) run 5 abc                   # arguments ke saath chalayein
(gdb) next / step                 # step over / into
(gdb) print i                     # variable का मान
(gdb) backtrace                   # crash कहाँ हुआ (पूरा कॉल स्टैक)
(gdb) info locals                 # स्थानीय चर
(gdb) continue (c) , quit (q)
./main core; gdb ./main core      # crash हुई binary का core dump जाँचें

# ---------- Valgrind : memory की गंदगी पकड़ता है ----------
valgrind --leak-check=full ./main     # leak, ग़लत free, uninitialized read` },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — debugging व exception', html: '<p>तीनों अंतर मुँहो-मुट लिखे आने चाहिए: <b>compile-time error</b> (syntax — build नहीं होगा), <b>runtime error</b> (exception — चला हुआ प्रोग्राम रुका), <b>logical error</b> (कोई संदेश नहीं, नतीजा ग़लत)। साथ में <b>try / catch / finally</b> का काम (अपवाद संभालकर प्रोग्राम को साफ़ तरीके से रुकने/संभलने देना), <b>breakpoint</b> और <b>step over बनाम step into</b> का फ़र्क़ अक्सर 2-अंकीय प्रश्न है। Java में <code>throws</code>/<code>throw</code>, Python में <code>raise</code> भी पूछा जाता है।</p>' }
  ]
}
]);

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
{
  id: 'sw-util',
  icon: '🧰',
  group: 'सॉफ़्टवेयर संसार',
  title: 'उपयोगी सॉफ़्टवेयर व यूटिलिटी',
  sub: 'लाइसेंस, पैकेज मैनेजर, compression, PDF, मीडिया, बैकअप, रिमोट डेस्कटॉप, VM व पासवर्ड मैनेजर',
  kicker: 'Software World 2 · Useful Software & Utilities',
  hero: 'यह पेज उन सॉफ़्टवेयर की पूरी कुंडली है जो एक ITI विद्यार्थी, लैब असिस्टेंट या सर्विसिंग इंजीनियर को रोज़ चाहिए — सॉफ़्टवेयर का वर्गीकरण और लाइसेंस के सात प्रकार, Windows/Linux/macOS पर स्थापना और हटाने के सही तरीके, winget/apt/flatpak जैसे पैकेज मैनेजर, compression के lossless व lossy सिद्धांत और ZIP/7z/RAR/tar.gz का चुनाव, PDF बनाना-जोड़ना-OCR-हस्ताक्षर, codec बनाम container का पूरा नक्शा, GIMP/VLC/OBS/HandBrake, 3-2-1 बैकअप नियम, रिमोट डेस्कटॉप के छह रास्ते, VirtualBox व Ventoy, पासवर्ड मैनेजर, और सॉफ़्टवेयर न चलने पर 14 तरह की जाँच। हर हिस्से में तुलना-तालिका, चलती कमांड और परीक्षा-बिंदु दिए गए हैं।',
  tags: ['लाइसेंस व वर्गीकरण', 'पैकेज मैनेजर', 'Compression व PDF', 'Codec व मीडिया', 'बैकअप व रिमोट', 'VM व पासवर्ड'],
  blocks: [

    { type: 'html', html: '<h3>1.1 सॉफ़्टवेयर का वर्गीकरण — तीन मंज़िलें</h3><p>सॉफ़्टवेयर (Software) = प्रोग्राम + उसका डेटा + उसका दस्तावेज़ (documentation)। केवल <code>.exe</code> फ़ाइल सॉफ़्टवेयर नहीं है; जब तक उपयोग-विधि, लाइसेंस और सहायता-सामग्री न हो, वह पूरा उत्पाद नहीं कहलाता। मोटे तौर पर तीन मंज़िलें हैं — <b>सिस्टम सॉफ़्टवेयर</b> जो मशीन चलाता है, <b>एप्लिकेशन सॉफ़्टवेयर</b> जो उपयोगकर्ता का काम करता है, और <b>यूटिलिटी सॉफ़्टवेयर</b> जो मशीन की देखभाल करता है।</p>' },

    { type: 'table',
      head: ['मंज़िल', 'काम', 'उदाहरण', 'हटाया जा सकता है?'],
      rows: [
        ['सिस्टम — Operating System', 'हार्डवेयर व एप्लिकेशन के बीच प्रबंधक', 'Windows 11, Ubuntu, macOS, Android', 'नहीं — मशीन बेकार'],
        ['सिस्टम — Device Driver', 'एक हार्डवेयर को OS से बात करना सिखाना', 'chipset, GPU, NIC, printer driver', 'हाँ, पर वह उपकरण बंद'],
        ['सिस्टम — Language Translator', 'स्रोत कोड को मशीन कोड में बदलना', 'GCC, Python interpreter, JVM, .NET CLR', 'हाँ, पर प्रोग्राम न बनेंगे'],
        ['सिस्टम — Firmware / BIOS', 'बोर्ड पर स्थायी कोड', 'UEFI, SSD firmware, router firmware', 'नहीं — गलत flash से ईंट'],
        ['एप्लिकेशन — सामान्य', 'दस्तावेज़, गणना, प्रस्तुति, संचार', 'MS Word, Excel, PowerPoint, Outlook, ब्राउज़र', 'हाँ'],
        ['एप्लिकेशन — विशिष्ट', 'किसी एक पेशे का काम', 'AutoCAD, Tally, Photoshop, SPSS, CATIA', 'हाँ'],
        ['यूटिलिटी — रखरखाव', 'सफ़ाई, निदान, बैकअप, सुरक्षा', 'Disk Cleanup, CrystalDiskInfo, 7-Zip, antivirus', 'हाँ'],
        ['यूटिलिटी — विकास', 'कोड लिखना, परखना, संस्करण-नियंत्रण', 'VS Code, Git, compilers, Postman', 'हाँ']
      ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — सॉफ़्टवेयर के प्रकार',
      html: '<b>प्रणाली सॉफ़्टवेयर (System Software)</b> और <b>अनुप्रयोग सॉफ़्टवेयर (Application Software)</b> में अंतर पूछा जाता है। उत्तर की तीन पंक्तियाँ याद रखें — (1) प्रणाली सॉफ़्टवेयर कंप्यूटर को चलाने के लिए है, अनुप्रयोग उपयोगकर्ता का कार्य करने के लिए; (2) प्रणाली सॉफ़्टवेयर हार्डवेयर के निकट होता है और सामान्यतः निर्माता/OS विक्रेता देता है, अनुप्रयोग अंत-उपयोगकर्ता के निकट होता है; (3) उदाहरण — OS, driver, compiler बनाम Word, Excel, browser। <b>यूटिलिटी</b> को अक्सर प्रणाली सॉफ़्टवेयर की उप-श्रेणी माना जाता है।' },

    { type: 'html', html: '<h3>1.2 लाइसेंस — मुफ़्त का मतलब "खुला" नहीं होता</h3><p>किसी सॉफ़्टवेयर को उपयोग करने की अनुमति उसका <b>लाइसेंस (License)</b> तय करता है, उसकी कीमत नहीं। <code>freeware</code> मुफ़्त हो सकता है पर उसका स्रोत कोड बंद रहता है; और <code>open source</code> का स्रोत कोड खुला होता है भले ही आप उससे कमाई करें। चार स्वतंत्रताएँ (चलाना, पढ़ना, बदलना, बाँटना) <b>Free Software</b> की पहचान हैं — यहाँ "free" का अर्थ स्वतंत्रता है, शून्य कीमत नहीं।</p>' },

    { type: 'table',
      head: ['लाइसेंस प्रकार', 'कीमत', 'स्रोत कोड', 'बदल व बाँट सकते हैं?', 'उदाहरण'],
      rows: [
        ['Proprietary / Commercial', 'खरीदना या subscription', 'बंद', 'नहीं — EULA बाँधता है', 'MS Office, Adobe, Windows'],
        ['Freeware', 'मुफ़्त', 'प्रायः बंद', 'बाँट सकते हैं, बदल नहीं', 'VLC, 7-Zip (जुड़वाँ लाइसेंस), Skype'],
        ['Shareware / Trial', 'सीमित समय मुफ़्त, फिर भुगतान', 'बंद', 'नहीं', 'WinRAR trial, कई antivirus'],
        ['Open Source (permissive)', 'मुफ़्त', 'खुला', 'हाँ — शर्त: credit व notice बनाए रखें', 'MIT (React), BSD, Apache-2.0'],
        ['Open Source (copyleft)', 'मुफ़्त', 'खुला', 'हाँ — पर व्युत्पन्न काम भी उसी लाइसेंस में', 'GPL (Linux kernel, GIMP), LGPL'],
        ['Adware', 'मुफ़्त', 'बंद', 'नहीं; विज्ञापन दिखाकर कमाई', 'कई मुफ़्त converter, bundled toolbar'],
        ['Public Domain / CC0', 'मुफ़्त', 'खुला', 'हाँ — बिना शर्त', 'SQLite, कुछ सरकारी डेटासेट'],
        ['SaaS subscription', 'मासिक/वार्षिक किराया', 'बंद, server पर चलता', 'नहीं', 'Microsoft 365, Google Workspace, Canva Pro']
      ] },

    { type: 'callout', kind: 'danger', title: 'crack, keygen और "activator" — लैब में सर्वथा वर्जित',
      html: 'क्रैक किए गए सॉफ़्टवेयर में प्रायः <b>trojan, miner या ransomware</b> छिपा होता है, क्योंकि उसे चलाने के लिए antivirus बंद करना पड़ता है और UAC को अनुमति देनी पड़ती है। यह लाइसेंस-उल्लंघन भी है और संस्थान की मशीनों को असुरक्षित भी करता है। लैब के लिए हमेशा <b>मुफ़्त/खुला विकल्प</b> चुनें — MS Office की जगह LibreOffice, Photoshop की जगह GIMP, WinRAR की जगह 7-Zip, IDM की जगह browser downloader। विद्यार्थी हों तो अपने संस्थान का <b>education licence</b> जाँचें; कई उत्पाद विद्यार्थियों को मुफ़्त मिलते हैं।' },

    { type: 'html', html: '<h3>1.3 कहाँ से लाएँ — स्थापित, पोर्टेबल, स्टोर या पैकेज मैनेजर</h3><p>एक ही सॉफ़्टवेयर चार रूपों में मिल सकता है। <b>Installed</b> Program Files में जाता है, registry व Start menu में entry बनाता है और uninstaller छोड़ता है। <b>Portable</b> एक फ़ोल्डर या USB से चलता है, registry नहीं छूता — लैब की साझा मशीनों और पुराने PC के लिए बढ़िया। <b>Store app</b> sandbox में चलता है, अपने-आप अपडेट होता है और अनुमतियाँ माँगता है। <b>Package manager</b> कमांड से डाउनलोड, स्थापना, अपडेट और हटाना — चारों एक ही जगह सँभालता है और भरोसेमंद repository से लाता है।</p>' },

    { type: 'table',
      head: ['प्लैटफ़ॉर्म', 'औज़ार', 'स्थापना कमांड / तरीका', 'अपडेट', 'हटाना'],
      rows: [
        ['Windows 10/11', 'winget (App Installer)', 'winget install -e --id VideoLAN.VLC', 'winget upgrade --all', 'winget uninstall VideoLAN.VLC'],
        ['Windows', 'Microsoft Store', 'Store खोलें → Get', 'स्वचालित (background)', 'Start → right-click → Uninstall'],
        ['Windows', 'Chocolatey (तीसरा पक्ष)', 'choco install 7zip -y', 'choco upgrade all -y', 'choco uninstall 7zip'],
        ['Windows', 'MSI / EXE installer', 'डबल-क्लिक, या msiexec /i app.msi /qn', 'उत्पाद का अपना updater', 'Settings → Apps → Installed apps'],
        ['Debian / Ubuntu', 'APT (.deb)', 'sudo apt update && sudo apt install vlc', 'sudo apt upgrade', 'sudo apt remove vlc'],
        ['Fedora / RHEL', 'DNF (.rpm)', 'sudo dnf install vlc', 'sudo dnf upgrade', 'sudo dnf remove vlc'],
        ['Arch', 'pacman', 'sudo pacman -S vlc', 'sudo pacman -Syu', 'sudo pacman -R vlc'],
        ['Linux (सभी)', 'Flatpak (sandbox)', 'flatpak install flathub org.videolan.VLC', 'flatpak update', 'flatpak uninstall org.videolan.VLC'],
        ['Linux (सभी)', 'Snap', 'sudo snap install vlc', 'sudo snap refresh', 'sudo snap remove vlc'],
        ['macOS', 'Homebrew', 'brew install --cask vlc', 'brew upgrade', 'brew uninstall --cask vlc'],
        ['macOS', '.dmg / App Store', 'dmg खोलकर Applications में खींचें', 'App Store स्वचालित', 'Applications से Trash में']
      ] },

    { type: 'code', code: '# ================= Windows : winget =================\nwinget --version\nwinget search vlc\nwinget show --id VideoLAN.VLC\nwinget install -e --id VideoLAN.VLC --accept-package-agreements\nwinget list\nwinget upgrade\nwinget upgrade --all --include-unknown\nwinget uninstall -e --id VideoLAN.VLC\nwinget export -o C:\\lab\\apps.json          # सूची सहेजें\nwinget import -i C:\\lab\\apps.json           # दूसरी मशीन पर वही सूची\n\n# ================= Ubuntu / Debian : APT =================\nsudo apt update\napt search vlc\napt show vlc\nsudo apt install -y vlc p7zip-full\napt list --installed | head -20\nsudo apt upgrade -y\nsudo apt autoremove --purge -y              # अनाथ पैकेज हटाएँ\nsudo apt clean\n\n# ================= Flatpak (हर distro पर एक जैसा) =================\nflatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo\nflatpak install -y flathub org.videolan.VLC\nflatpak list --app\nflatpak run org.videolan.VLC\nflatpak update -y\nflatpak uninstall --unused -y\n\n# ================= चुपचाप (silent) स्थापना — लैब imaging =================\nmsiexec /i "7z2409-x64.msi" /qn /norestart ALLUSERS=1\n"vlc-3.0.21-win64.exe" /L=1033 /S\n# /qn = कोई UI नहीं, /S = NSIS silent, /L = भाषा' },

    { type: 'steps', title: 'सुरक्षित स्थापना — सात अनिवार्य कदम',
      items: [
        { n: '1', title: 'आधिकारिक स्रोत पहचानें', text: 'विक्रेता की अपनी वेबसाइट, Microsoft Store, Flathub या भरोसेमंद repository। खोज-इंजन का पहला "Download" बटन प्रायः विज्ञापन होता है।', tips: ['URL का domain ठीक-ठीक पढ़ें — 0 (शून्य) बनाम O, l बनाम I', 'HTTPS ताला देखें, पर केवल ताला भरोसे की गारंटी नहीं'] },
        { n: '2', title: 'Hash या signature मिलाएँ', text: 'साइट पर दिया SHA-256 अपनी डाउनलोड की हुई फ़ाइल से मिलाएँ; Windows पर Get-FileHash, Linux पर sha256sum।', tips: ['certutil -hashfile file.exe SHA256', 'Get-FileHash .\\file.exe -Algorithm SHA256'] },
        { n: '3', title: 'सही संस्करण व architecture चुनें', text: 'x64 बनाम ARM64 बनाम x86; Windows का N/LTSC संस्करण; Linux का .deb बनाम .rpm। गलत binary चलेगा ही नहीं।', tips: ['systeminfo | findstr /C:"System Type"', 'uname -m'] },
        { n: '4', title: 'Installer को ध्यान से पढ़ें', text: 'हर स्क्रीन पर "Next" दबाने से पहले देखें — कहीं bundled toolbar, "default browser बदलें" या "सिस्टम स्कैन करें" जैसी अनुमति तो नहीं।', warn: 'Custom/Advanced install चुनें; Express install प्रायः अतिरिक्त सॉफ़्टवेयर ठूँस देता है।' },
        { n: '5', title: 'घर में पहले परखें', text: 'संभव हो तो पहले VM या एक गैर-ज़रूरी मशीन पर चलाकर देखें; लैब की सभी मशीनों पर एक साथ न चढ़ाएँ।', tips: ['स्थापना से पहले restore point बनाएँ'] },
        { n: '6', title: 'अनुमतियाँ जाँचें', text: 'स्थापना के बाद देखें कि उसने कौन-सी अनुमति ली — camera, microphone, location, contacts, "सभी फ़ाइलों तक पहुँच"। अनावश्यक बंद करें।', tips: ['Windows: Settings → Privacy & security', 'Android: Settings → Apps → Permissions'] },
        { n: '7', title: 'दर्ज करें और अपडेट-नीति तय करें', text: 'लैब रजिस्टर में नाम, संस्करण, स्रोत, लाइसेंस व तारीख़ लिखें। तय करें कि अपडेट स्वचालित होगा या महीने में एक बार जाँचकर।', tips: ['winget export से सूची JSON में रख लें — अगली बार imaging आसान'] }
      ] },

    { type: 'html', html: '<h3>1.4 Compression — फ़ाइल छोटी कैसे होती है</h3><p><b>Lossless (हानि-रहित)</b> compression में मूल डेटा बिलकुल वैसा ही वापस मिलता है — प्रोग्राम, दस्तावेज़, डेटाबेस और स्रोत कोड के लिए यही चाहिए। यह दोहराव को छोटे संकेतों में बदलता है (LZ77/LZMA, Huffman, DEFLATE)। <b>Lossy (हानि-युक्त)</b> compression में वह सूचना फेंक दी जाती है जो मानव-इंद्रिय को कम दिखती/सुनाई देती है — JPEG, MP3, H.264 इसी पर चलते हैं। एक बार lossy किया तो मूल वापस नहीं आता; बार-बार सहेजने पर गुणवत्ता गिरती जाती है (<b>generation loss</b>)।</p>' },

    { type: 'table',
      head: ['प्रारूप', 'प्रकार', 'खास बात', 'कब चुनें', 'कमांड / औज़ार'],
      rows: [
        ['.zip (DEFLATE)', 'Lossless', 'हर OS में बिना औज़ार खुलता है', 'सामान्य बाँटना, email attachment', '7-Zip, Explorer, zip'],
        ['.7z (LZMA2)', 'Lossless', 'zip से छोटा, AES-256 encryption, solid block', 'बड़ा backup, गुप्त फ़ाइलें', '7z a -t7z -mhe=on -p out.7z files'],
        ['.rar / .rev', 'Lossless', 'अच्छा ratio, recovery record, split volumes', 'कई खंडों में बाँटना, खराब मीडिया', 'WinRAR (shareware)'],
        ['.tar.gz / .tgz', 'Lossless', 'पहले tar से जोड़ा, फिर gzip; Unix अनुमतियाँ सुरक्षित', 'Linux स्रोत कोड, server backup', 'tar -czvf out.tar.gz dir/'],
        ['.tar.xz', 'Lossless', 'बहुत छोटा, पर धीमा', 'distribution ISO, लंबा संग्रह', 'tar -cJvf out.tar.xz dir/'],
        ['.tar.zst (Zstandard)', 'Lossless', 'तेज़ और छोटा — आधुनिक पसंद', 'बड़े लॉग, तेज़ backup', 'tar --zstd -cvf out.tar.zst dir/'],
        ['.gz / .bz2 / .xz (एकल)', 'Lossless', 'केवल एक फ़ाइल; नाम में .gz जुड़ता है', 'लॉग rotate, SQL dump', 'gzip -9 file.sql'],
        ['.jpg / .png / .mp3 / .mp4', 'Lossy (या मिश्र)', 'पहले से compressed — दोबारा zip से लगभग कुछ नहीं बचता', 'मीडिया को सीधे भेजें', '—']
      ] },

    { type: 'code', code: '# ---------------- 7-Zip (Windows / Linux p7zip) ----------------\n7z a -tzip  archive.zip  folder\\            # zip बनाएँ\n7z a -t7z -mx=9 -mhe=on -p secret.7z folder\\  # अधिकतम + encrypt + नाम भी छिपाएँ\n7z l secret.7z                             # सूची देखें\n7z x secret.7z -oC:\\out                     # पूरे path के साथ खोलें\n7z e secret.7z -oC:\\flat                    # सब एक ही फ़ोल्डर में\n7z t archive.zip                           # अखंडता जाँच (test)\n7z a -v100m big.7z hugefolder\\              # 100 MB के खंड\n\n# ---------------- Linux tar ----------------\ntar -czvf backup.tar.gz /home/student\ntar -cjvf backup.tar.bz2 /home/student\ntar -cJvf backup.tar.xz /home/student\ntar --zstd -cvf backup.tar.zst /home/student\ntar -tzvf backup.tar.gz                    # अंदर क्या है\ntar -xzvf backup.tar.gz -C /restore        # खोलें\ntar -dzvf backup.tar.gz                    # मूल से तुलना (diff)\n\n# ---------------- अपेक्षाकृत आकार (एक ही 1 GB फ़ोल्डर) ----------------\n# zip  ≈ 620 MB | 7z ≈ 480 MB | tar.xz ≈ 455 MB | tar.zst ≈ 500 MB (बहुत तेज़)\n# पहले से compressed मीडिया (JPEG/MP4) पर अंतर लगभग 0–2%' },

    { type: 'callout', kind: 'warn', title: 'archive का पासवर्ड भूल गए तो?',
      html: 'AES-256 वाला <code>.7z</code> या आधुनिक ZIP व्यावहारिक रूप से <b>खोला नहीं जा सकता</b> — यही उसका उद्देश्य है। "password recovery" टूल brute-force करते हैं और सरल पासवर्ड पर ही कामयाब होते हैं। इसलिए (1) पासवर्ड मैनेजर में दर्ज करें, (2) <code>-mhe=on</code> से फ़ाइल-नाम भी encrypt करें ताकि सूची न दिखे, (3) महत्वपूर्ण archive की एक बिना-पासवर्ड प्रति अपने भरोसेमंद स्थान पर रखें। पुराना <b>ZipCrypto</b> कमज़ोर है — उसे न चुनें।' },

    { type: 'html', html: '<h3>1.5 PDF — बनाना, जोड़ना, घटाना, OCR और हस्ताक्षर</h3><p>PDF (Portable Document Format) का उद्देश्य है — <b>हर मशीन पर एक जैसा दिखना</b>। यह पृष्ठ-आधारित है, इसलिए संपादन कठिन होता है; मूल दस्तावेज़ हमेशा Word/ODT में सुरक्षित रखें और PDF केवल बाँटने के लिए बनाएँ। PDF के दो रूप हैं — <b>text-based</b> (अक्षर सचमुच मौजूद, खोज व copy हो सकते हैं) और <b>scanned/image-only</b> (हर पृष्ठ एक तस्वीर; खोजने के लिए OCR चाहिए)।</p>' },

    { type: 'table',
      head: ['काम', 'मुफ़्त औज़ार', 'तरीका / कमांड', 'सावधानी'],
      rows: [
        ['PDF बनाना', 'Word / LibreOffice / Print to PDF', 'File → Export as PDF, या Microsoft Print to PDF', 'फ़ॉन्ट embed करें, वरना दूसरी मशीन पर बदल जाएगा'],
        ['कई PDF जोड़ना', 'PDFsam Basic, pdftk, qpdf', 'qpdf --empty --pages a.pdf b.pdf -- out.pdf', 'पृष्ठ-क्रम और bookmark जाँचें'],
        ['पृष्ठ अलग करना', 'PDFsam, qpdf', 'qpdf in.pdf --pages . 3-7 -- part.pdf', 'मूल फ़ाइल न बदलें, नई बनाएँ'],
        ['आकार घटाना', 'Ghostscript', 'gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -o small.pdf big.pdf', 'image-only PDF में गुणवत्ता गिरेगी'],
        ['OCR (तस्वीर → पाठ)', 'Tesseract, OCRmyPDF', 'ocrmypdf -l hin+eng scan.pdf out.pdf', '300 DPI स्कैन सबसे अच्छा; हिंदी के लिए hin भाषा-डेटा चाहिए'],
        ['पाठ निकालना', 'pdftotext (Poppler)', 'pdftotext -layout in.pdf out.txt', '-layout से तालिका की सज़ावट बचती है'],
        ['हस्ताक्षर / भरना', 'LibreOffice Draw, Xournal++, Adobe Reader', 'Fill & Sign, या draw में text box', 'कानूनी डिजिटल हस्ताक्षर के लिए DSC/eSign सेवाएँ'],
        ['पासवर्ड लगाना/हटाना', 'qpdf', 'qpdf --encrypt user owner 256 -- in.pdf out.pdf', 'मालिक का पासवर्ड खोया तो permissions नहीं बदल सकते'],
        ['तस्वीर में बदलना', 'pdftoppm', 'pdftoppm -r 200 -png in.pdf page', '200 DPI प्रिंट के लिए पर्याप्त'],
        ['ऑनलाइन PDF टूल', '—', '—', 'आधार, मार्कशीट, फ़ीस रसीद जैसी निजी PDF कभी न चढ़ाएँ']
      ] },

    { type: 'code', code: '# ---------------- OCRmyPDF + Tesseract (Linux) ----------------\nsudo apt install ocrmypdf tesseract-ocr tesseract-ocr-hin tesseract-ocr-eng\nocrmypdf -l hin+eng --deskew --rotate-pages scan.pdf searchable.pdf\nocrmypdf -l eng --force-ocr old.pdf new.pdf      # पहले से OCR हो तो दोबारा\ntesseract page.png out -l hin+eng                # एक तस्वीर से पाठ\n\n# ---------------- qpdf / Ghostscript ----------------\nqpdf --empty --pages chap1.pdf chap2.pdf -- book.pdf\nqpdf book.pdf --pages . 1-10 -- first10.pdf\nqpdf --encrypt myuser myowner 256 -- book.pdf locked.pdf\nqpdf --decrypt locked.pdf open.pdf               # पासवर्ड पता हो तो\nqpdf --check book.pdf                            # संरचना जाँच\ngs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 \\\n   -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH \\\n   -sOutputFile=small.pdf big.pdf\npdftotext -layout book.pdf book.txt\npdftoppm -r 150 -png book.pdf slide' },

    { type: 'html', html: '<h3>1.6 Codec बनाम Container — मीडिया की दो अलग बातें</h3><p><b>Container (कंटेनर)</b> एक डिब्बा है जो video stream, audio stream, subtitles और metadata को एक फ़ाइल में pack करता है — जैसे <code>.mp4</code>, <code>.mkv</code>, <code>.avi</code>। <b>Codec (कोडेक)</b> वह एल्गोरिद्म है जो stream को compress व decompress करता है — जैसे <code>H.264</code>, <code>H.265/HEVC</code>, <code>AV1</code>, <code>AAC</code>, <code>MP3</code>। इसीलिए एक <code>.mkv</code> फ़ाइल VLC में चलती है पर किसी पुराने TV में नहीं — डिब्बा ठीक है, अंदर का codec वह नहीं जानता। "Codec pack" चढ़ाने के बजाय <b>VLC</b> रखें; वह अपने codec साथ लाता है।</p>' },

    { type: 'table',
      head: ['नाम', 'क्या है', 'खास बात', 'कहाँ मिलता है'],
      rows: [
        ['MP4 (.mp4/.m4v)', 'Container', 'सबसे व्यापक समर्थन; streaming अनुकूल', 'YouTube, मोबाइल, कैमरा'],
        ['MKV (.mkv)', 'Container', 'खुला; कई audio/subtitle track, अध्याय', 'फ़िल्म backup, anime'],
        ['AVI (.avi)', 'Container', 'पुराना; बड़ा आकार, आधुनिक codec सीमित', 'पुराने कैमरा/विंडोज़'],
        ['WebM (.webm)', 'Container', 'वेब के लिए खुला; VP9/AV1 + Opus', 'HTML5 video, YouTube'],
        ['MOV (.mov)', 'Container', 'Apple QuickTime; प्रो संपादन', 'iPhone, Final Cut'],
        ['H.264 / AVC', 'Video codec', 'सर्वत्र समर्थित, अच्छा संतुलन', 'लगभग हर जगह'],
        ['H.265 / HEVC', 'Video codec', 'H.264 से ~40% छोटा, पर encoding भारी व पेटेंट', '4K, नए मोबाइल'],
        ['AV1', 'Video codec', 'रायल्टी-मुक्त, HEVC जितना कुशल; धीमा encode', 'YouTube, Netflix, नए GPU'],
        ['VP9', 'Video codec', 'Google का खुला codec', 'YouTube, WebM'],
        ['MP3', 'Audio codec', 'lossy, सर्वत्र समर्थित; 128–320 kbps', 'संगीत, पॉडकास्ट'],
        ['AAC', 'Audio codec', 'MP3 से बेहतर उसी bitrate पर', 'YouTube, Apple, MP4'],
        ['FLAC / ALAC', 'Audio codec', 'lossless — मूल गुणवत्ता, बड़ा आकार', 'ऑडियो संग्रह, संपादन मूल'],
        ['Opus', 'Audio codec', 'कम bitrate पर उत्कृष्ट; कम विलंब', 'WebRTC, Discord, WhatsApp कॉल'],
        ['WAV / AIFF', 'Container (असम्पीड़ित)', 'बहुत बड़ा; संपादन के लिए आदर्श मूल', 'Audacity, रिकॉर्डिंग']
      ] },

    { type: 'table',
      head: ['काम', 'मुफ़्त सॉफ़्टवेयर', 'मुख्य क्षमता', 'सीखने लायक पहली बात'],
      rows: [
        ['कोई भी मीडिया चलाना', 'VLC', 'लगभग हर codec/container, network stream, DVD', 'Media → Open Network Stream; Tools → Codec Information'],
        ['वीडियो बदलना/घटाना', 'HandBrake', 'preset से MP4/MKV, subtitle, queue', 'Preset "Fast 1080p30", Constant Quality RF 20–23'],
        ['स्क्रीन रिकॉर्ड + लाइव', 'OBS Studio', 'scene, source, encoder, streaming', 'Settings → Output → Encoder: hardware (NVENC/AMF/QSV)'],
        ['ऑडियो संपादन', 'Audacity', 'काटना, noise reduction, multi-track, export', 'Effect → Noise Reduction के लिए पहले "शांत" हिस्सा चुनें'],
        ['तस्वीर संपादन (raster)', 'GIMP', 'layer, mask, filter, batch', 'Layer = पारदर्शी शीट; मूल पर नहीं, नई layer पर काम'],
        ['तस्वीर देखना/बदलना', 'IrfanView, XnView, ImageMagick', 'तेज़ viewer, bulk resize/convert', 'ImageMagick: magick in.jpg -resize 50% out.jpg'],
        ['वेक्टर चित्र', 'Inkscape', 'SVG, logo, आरेख; वेक्टर हर आकार पर साफ़', 'SVG खींचने पर फटता नहीं — PNG फटता है'],
        ['3D मॉडल', 'Blender', 'मॉडलिंग, animation, render', 'यह लैब का 3D-viewer अलग है; Blender निर्माता-औज़ार है'],
        ['स्क्रीनशॉट + GIF', 'ShareX, Flameshot', 'region capture, annotation, auto-upload', 'निजी डेटा स्क्रीनशॉट में न आए — पहले जाँचें'],
        ['मीडिया जानकारी', 'MediaInfo', 'codec, bitrate, resolution, duration', 'फ़ाइल न चले तो पहले यहीं देखें']
      ] },

    { type: 'code', code: '# ---------------- FFmpeg : मीडिया का चाकू ----------------\nffmpeg -i input.mkv -c:v libx264 -crf 22 -preset medium -c:a aac -b:a 160k out.mp4\nffmpeg -i input.mp4 -vn -c:a libmp3lame -q:a 2 audio.mp3     # केवल ऑडियो\nffmpeg -i input.mp4 -ss 00:01:30 -t 20 -c copy clip.mp4      # 20 सेकंड का टुकड़ा\nffmpeg -i input.mp4 -vf "scale=1280:-2" -c:a copy 720p.mp4   # चौड़ाई 1280\nffmpeg -i input.mp4 -r 1 -f image2 frame%03d.png             # हर सेकंड एक फ़्रेम\nffmpeg -i in.mp4 -i sub.srt -c copy -c:s mov_text out.mp4    # subtitle जोड़ें\nffprobe -v error -show_format -show_streams input.mp4        # पूरी जानकारी\n\n# ---------------- ImageMagick : तस्वीरें थोक में ----------------\nmagick in.jpg -resize 1024x1024 -quality 85 out.jpg\nmagick mogrify -resize 800x800 -format webp *.jpg            # सबको WebP\nmagick montage *.jpg -tile 4x3 -geometry 200x200+4+4 sheet.jpg\n\n# ---------------- OBS : लैब रिकॉर्डिंग की सिफ़ारिश ----------------\n# Base 1920x1080, Output 1280x720, FPS 30, Encoder NVENC/AMF/QSV\n# Bitrate 4000–6000 Kbps (local recording), Keyframe 2 s, Format mkv\n# mkv इसलिए कि बिजली जाए तो फ़ाइल खराब नहीं होती; बाद में remux → mp4' },

    { type: 'callout', kind: 'tip', title: 'तस्वीर प्रारूप — एक पंक्ति में चुनाव',
      html: '<b>JPEG</b> = फ़ोटो, छोटा, lossy, पारदर्शिता नहीं। <b>PNG</b> = स्क्रीनशॉट/रेखा-चित्र, lossless, पारदर्शिता है, बड़ा। <b>WebP</b> = दोनों का आधुनिक विकल्प, छोटा, पारदर्शिता + animation। <b>AVIF</b> = सबसे छोटा पर समर्थन कम। <b>GIF</b> = केवल 256 रंग, छोटे animation। <b>SVG</b> = वेक्टर, लोगो/आरेख, किसी भी आकार पर साफ़। <b>TIFF</b> = प्रिंट/स्कैन संग्रह, lossless, बहुत बड़ा। <b>HEIC</b> = iPhone का HEIF, छोटा पर Windows में codec चाहिए। परीक्षा में पूछा जाता है — <b>"पारदर्शिता (transparency) किसमें मिलती है?"</b> उत्तर: PNG, GIF, WebP, TIFF; JPEG में नहीं।' },

    { type: 'html', html: '<h3>1.7 बैकअप — 3-2-1 नियम और उसके औज़ार</h3><p><b>3-2-1 नियम:</b> डेटा की <b>3</b> प्रतियाँ रखें, <b>2</b> अलग माध्यमों पर (जैसे आंतरिक SSD + बाहरी HDD), और <b>1</b> प्रति स्थान से बाहर (off-site — cloud या दूसरी इमारत)। इसका विस्तार <b>3-2-1-1-0</b> है — एक प्रति अपरिवर्तनीय (immutable/air-gapped) और सत्यापन में <b>0</b> त्रुटि। याद रखें: <b>RAID बैकअप नहीं है</b> (गलती से मिटी फ़ाइल दोनों डिस्क से मिटती है), और <b>sync भी बैकअप नहीं है</b> (OneDrive/Drive पर मिटाया तो हर जगह मिटता है) — जब तक versioning/recycle bin चालू न हो।</p>' },

    { type: 'table',
      head: ['औज़ार', 'प्लैटफ़ॉर्म', 'क्या करता है', 'खास बात', 'किसके लिए'],
      rows: [
        ['File History', 'Windows', 'लाइब्रेरी/फ़ोल्डर की आवधिक प्रतियाँ', 'पुराने संस्करण वापस; बाहरी डिस्क चाहिए', 'घर/छोटी लैब के दस्तावेज़'],
        ['Backup and Restore (Win 7)', 'Windows', 'system image + फ़ाइल बैकअप', 'पूरी मशीन की image बना सकता', 'पूर्ण मशीन पुनर्स्थापना'],
        ['wbadmin', 'Windows Server', 'कमांड-लाइन बैकअप', 'script व schedule से चलता', 'सर्विसिंग/सर्वर लैब'],
        ['Timeshift', 'Linux', 'system snapshot (rsync/Btrfs)', 'गलत अपडेट से पहले की स्थिति', 'ड्राइवर/पैकेज प्रयोग'],
        ['rsync', 'Linux/Unix', 'incremental फ़ाइल-प्रतिलिपि', 'केवल बदला हुआ भेजता; --delete सावधानी', 'सर्वर व लैब डेटा'],
        ['Borg / restic', 'Linux/Win/mac', 'deduplicated, encrypted backup', 'एक ही डेटा दोबारा नहीं रखता; snapshot इतिहास', 'गंभीर, लंबा संग्रह'],
        ['FreeFileSync / SyncBackFree', 'Windows', 'दो फ़ोल्डर की तुलना व mirror', 'दृश्य तुलना; गलती से mirror उल्टा न चलाएँ', 'बाहरी डिस्क पर नकल'],
        ['Clonezilla / Macrium Reflect', 'सभी', 'पूरी डिस्क की image', 'bare-metal restore; डिस्क बदलने पर', 'लैब imaging, मरम्मत'],
        ['Cloud (Drive/OneDrive/Dropbox)', 'सभी', 'sync + version history + recycle bin', 'off-site प्रति; पर निजी डेटा की नीति पढ़ें', 'दस्तावेज़, प्रोजेक्ट'],
        ['tar + बाहरी डिस्क', 'सभी', 'सादा संग्रह', 'सबसे भरोसेमंद — कोई proprietary प्रारूप नहीं', 'परीक्षा-डेटा, प्रोजेक्ट']
      ] },

    { type: 'code', code: '# ---------------- rsync : भरोसेमंद नकल ----------------\nrsync -avh --progress /home/student/ /mnt/backup/student/\nrsync -avh --delete --dry-run /src/ /dst/     # पहले केवल दिखाएँ (कुछ मिटेगा नहीं)\nrsync -avh --delete /src/ /dst/               # पुष्टि के बाद ही चलाएँ\nrsync -avhz -e "ssh -p 22" /data/ user@server:/backup/data/\nrsync -avh --exclude="*.tmp" --exclude="node_modules/" /proj/ /mnt/b/proj/\n\n# ---------------- Windows : robocopy ----------------\nrobocopy "C:\\Users\\student\\Documents" "E:\\Backup\\Documents" /MIR /R:2 /W:2 /LOG+:C:\\lab\\backup.log\n# /MIR = mirror (लक्ष्य की अतिरिक्त फ़ाइलें मिटती हैं) — पहले /L लगाकर देखें\nrobocopy "C:\\Data" "E:\\Data" /MIR /L\n\n# ---------------- Borg : encrypted + deduplicated ----------------\nborg init --encryption=repokey /mnt/backup/repo\nborg create --stats --progress /mnt/backup/repo::lab-{now:%Y-%m-%d} /home/student\nborg list /mnt/backup/repo\nborg extract /mnt/backup/repo::lab-2026-11-07\nborg check --verify-data /mnt/backup/repo      # सत्यापन = "0 त्रुटि"\n\n# ---------------- Windows system image ----------------\nwbadmin start backup -backupTarget:E: -include:C: -allCritical -quiet' },

    { type: 'callout', kind: 'danger', title: 'बैकअप की चार जानलेवा गलतियाँ',
      html: '(1) <b>केवल एक प्रति</b> — वही डिस्क खराब हुई तो सब गया। (2) <b>बिना सत्यापन</b> — backup तो बना पर कभी खोलकर देखा नहीं; जिस दिन चाहिए उस दिन corrupt निकला। (3) <b>उसी मशीन पर दूसरा partition</b> — डिस्क गई तो दोनों गए; यह off-site नहीं है। (4) <b>sync को बैकअप समझना</b> — गलती से मिटाया तो cloud से भी मिट गया। समाधान: महीने में एक बार <b>पुनर्स्थापना का अभ्यास</b> (restore drill) करें — एक फ़ाइल और एक पूरा फ़ोल्डर वापस लाकर देखें। जो बैकअप कभी खोला नहीं गया, वह बैकअप नहीं है।' },

    { type: 'html', html: '<h3>1.8 रिमोट डेस्कटॉप — दूर बैठकर मशीन चलाना</h3><p>लैब की मशीन खराब हो तो बार-बार दौड़ने के बजाय दूर से ठीक करना सीखें। तीन मुख्य रास्ते हैं — <b>GUI remote</b> (पूरा डेस्कटॉप दिखता है), <b>command-line remote</b> (SSH/PowerShell Remoting, बहुत कम bandwidth), और <b>unattended access</b> (कोई उपयोगकर्ता मौजूद न हो तब भी जुड़ सकें)। नीचे दिए हर औज़ार में <b>मज़बूत पासवर्ड + 2FA</b> अनिवार्य है; खुला remote port इंटरनेट पर सबसे अधिक हमला झेलता है।</p>' },

    { type: 'table',
      head: ['औज़ार / प्रोटोकॉल', 'Port', 'प्लैटफ़ॉर्म', 'खास बात', 'सावधानी'],
      rows: [
        ['RDP (Remote Desktop Protocol)', 'TCP 3389', 'Windows Pro/Enterprise host', 'तेज़, drive/printer redirect, session', 'Home edition host नहीं बन सकता; इंटरनेट पर सीधे न खोलें'],
        ['SSH', 'TCP 22', 'Linux/macOS/Windows OpenSSH', 'command-line, scp/sftp, tunneling', 'key-based login रखें, root login बंद'],
        ['PowerShell Remoting (WinRM)', '5985/5986', 'Windows', 'Enter-PSSession, Invoke-Command', 'विश्वसनीय नेटवर्क में ही; HTTPS 5986'],
        ['VNC (RealVNC/TightVNC)', '5900+', 'सभी', 'खुला प्रोटोकॉल, console session दिखता', 'डिफ़ॉल्ट में encryption नहीं — SSH tunnel में चलाएँ'],
        ['AnyDesk / TeamViewer', 'निजी ID + पासवर्ड', 'सभी', 'NAT के पार आसान, फ़ाइल transfer', 'ID लीक हुई तो कोई भी जुड़ सकता; unattended पासवर्ड मज़बूत रखें'],
        ['RustDesk (खुला स्रोत)', 'अपना server भी बना सकते', 'सभी', 'आत्म-होस्टेड relay — डेटा बाहर नहीं', 'अपना server सँभालना पड़ेगा'],
        ['Chrome Remote Desktop', 'HTTPS', 'सभी', 'मुफ़्त, Google खाते से, आसान', 'Google खाता ही एकमात्र द्वार — 2FA अनिवार्य'],
        ['Quick Assist (Windows)', 'HTTPS', 'Windows 10/11', 'बिना स्थापना, एक बार का कोड', 'केवल सहायता के लिए; स्थायी पहुँच नहीं']
      ] },

    { type: 'code', code: '# ---------------- SSH : दूर से कमांड ----------------\nssh student@192.168.1.50\nssh -p 2222 student@192.168.1.50\nssh-keygen -t ed25519 -C "lab-laptop"\nssh-copy-id student@192.168.1.50\nscp report.pdf student@192.168.1.50:/home/student/\nsftp student@192.168.1.50\nssh -L 5901:localhost:5901 student@192.168.1.50   # VNC को सुरक्षित tunnel में\n\n# ---------------- Windows : PowerShell Remoting ----------------\nEnable-PSRemoting -Force\nEnter-PSSession -ComputerName LAB-PC-05\nInvoke-Command -ComputerName LAB-PC-01,LAB-PC-02 -ScriptBlock { Get-Service Spooler }\nGet-Service -ComputerName LAB-PC-05 -Name Spooler | Restart-Service\nmstsc /v:192.168.1.50 /admin\n\n# ---------------- सर्विसिंग में काम आने वाली दूर-जाँच ----------------\nssh student@pc "df -h; free -m; uptime; sensors"\nInvoke-Command -ComputerName LAB-PC-05 { Get-PhysicalDisk | Get-StorageReliabilityCounter }' },

    { type: 'html', html: '<h3>1.9 Virtual Machine — एक मशीन में कई कंप्यूटर</h3><p><b>Hypervisor</b> वह परत है जो एक भौतिक मशीन के संसाधन बाँटकर कई आभासी मशीनें (VM) चलाती है। <b>Type-1 (bare-metal)</b> सीधे हार्डवेयर पर बैठता है — VMware ESXi, Proxmox, Hyper-V Server, Xen। <b>Type-2 (hosted)</b> किसी OS के ऊपर एप्लिकेशन की तरह चलता है — VirtualBox, VMware Workstation, Parallels। लैब में प्रयोग, पुराने सॉफ़्टवेयर की जाँच, संदिग्ध फ़ाइल खोलने और Linux सीखने के लिए VM सबसे सुरक्षित sandbox है।</p>' },

    { type: 'table',
      head: ['तरीका', 'क्या है', 'फ़ायदा', 'नुकसान', 'कब चुनें'],
      rows: [
        ['Virtual Machine (Type-2)', 'मेज़बान OS के ऊपर पूरा अतिथि OS', 'एक साथ दोनों चलें; snapshot से तुरंत वापसी', 'RAM/CPU बँटते हैं; GPU सीमित', 'Linux सीखना, प्रयोग, परीक्षण'],
        ['Dual Boot', 'दो OS अलग partition पर, एक समय में एक', 'पूरा हार्डवेयर मिलता है, तेज़', 'बदलने के लिए reboot; bootloader जोखिम', 'रोज़ाना दोनों OS का भारी काम'],
        ['WSL2 (Windows Subsystem for Linux)', 'Windows के भीतर हल्का Linux kernel', 'फ़ाइलें साझा, तेज़ शुरुआत, terminal एकीकृत', 'systemd सीमित, GUI अलग तरीके से', 'Windows पर Linux कमांड सीखना'],
        ['Container (Docker)', 'एक ही kernel, अलग user-space', 'सेकंडों में शुरू, बहुत हल्का, सुसंगत वातावरण', 'अलग kernel नहीं; Windows container अलग', 'एप्लिकेशन बाँटना, सर्वर सेवाएँ'],
        ['Live USB', 'USB से सीधे चलता OS, डिस्क अछूती', 'स्थापना नहीं, मरम्मत व जाँच के लिए उत्तम', 'बदलाव सहेजने के लिए persistence चाहिए', 'मरम्मत, डेटा बचाना, हार्डवेयर जाँच'],
        ['Sandbox (Windows Sandbox)', 'अस्थायी हल्की Windows VM', 'बंद करते ही सब मिट जाता', 'Pro/Enterprise चाहिए; स्थायी नहीं', 'संदिग्ध फ़ाइल/लिंक खोलना']
      ] },

    { type: 'steps', title: 'VirtualBox में पहली VM — छह कदम',
      items: [
        { n: '1', title: 'तैयारी जाँचें', text: 'BIOS/UEFI में virtualization (Intel VT-x / AMD-V) चालू करें। Task Manager → Performance → CPU में "Virtualization: Enabled" दिखना चाहिए।', tips: ['Windows पर Hyper-V/WSL2 चालू हो तो VirtualBox धीमा चल सकता है'] },
        { n: '2', title: 'ISO लाएँ', text: 'Ubuntu/Kali/Windows का आधिकारिक ISO डाउनलोड करें और SHA-256 मिलाएँ।', tips: ['sha256sum ubuntu.iso को साइट के मान से तुलना करें'] },
        { n: '3', title: 'VM बनाएँ', text: 'New → नाम व प्रकार चुनें। RAM मेज़बान की आधी से अधिक न दें (8 GB मेज़बान पर 2–4 GB अतिथि)। CPU core भी आधे से कम रखें।', warn: 'मेज़बान को भूखा रखा तो दोनों मशीनें अटकेंगी।' },
        { n: '4', title: 'डिस्क व नेटवर्क', text: 'VDI, dynamically allocated, 25–40 GB। Network में शुरुआत में NAT रखें; लैब के दूसरी मशीनों से बात करनी हो तो Bridged Adapter चुनें।', tips: ['NAT = अतिथि बाहर जा सकता, बाहर से अतिथि नहीं आ सकता', 'Host-only = केवल मेज़बान ↔ अतिथि'] },
        { n: '5', title: 'OS स्थापित करें', text: 'ISO को optical drive में लगाकर Start करें, सामान्य स्थापना पूरी करें। फिर Devices → Insert Guest Additions CD image चलाएँ।', tips: ['Guest Additions से full-screen, shared clipboard, drag-drop, shared folder मिलते हैं'] },
        { n: '6', title: 'Snapshot लें', text: 'साफ़ स्थापना के तुरंत बाद Machine → Take Snapshot। अब कोई भी प्रयोग करें और बिगड़ने पर एक क्लिक में वापस आएँ।', tips: ['प्रयोग से पहले हर बार नया snapshot — यही VM का सबसे बड़ा लाभ है'] }
      ] },

    { type: 'code', code: '# ---------------- Docker : container की पहली झलक ----------------\ndocker --version\ndocker run hello-world\ndocker run -it --rm ubuntu:24.04 bash          # अंदर जाकर देखें, निकलते ही मिटे\ndocker run -d --name web -p 8080:80 nginx      # पृष्ठभूमि में वेब सर्वर\ndocker ps ; docker ps -a\ndocker logs web\ndocker exec -it web bash\ndocker stop web ; docker rm web\ndocker images ; docker rmi nginx\ndocker system df ; docker system prune        # अनावश्यक साफ़ (सोच-समझकर)\n\n# ---------------- WSL2 (Windows) ----------------\nwsl --install -d Ubuntu-24.04\nwsl --list --verbose\nwsl --set-default-version 2\nwsl --shutdown\nwsl --update\n# Windows की फ़ाइलें Linux में:  /mnt/c/Users/student/\n# Linux की फ़ाइलें Windows में:  \\\\wsl$\\Ubuntu-24.04\\home\\student\n\n# ---------------- Ventoy : एक USB, कई ISO ----------------\n# 1) Ventoy2Disk चलाकर USB पर Ventoy स्थापित करें (USB मिट जाएगा)\n# 2) बस ISO फ़ाइलें USB पर copy कर दें — कोई अलग burning नहीं\n# 3) boot menu में जितने ISO हैं, सब दिखेंगे; नया ISO = नई फ़ाइल' },

    { type: 'html', html: '<h3>1.10 पासवर्ड मैनेजर — याद रखने की मशीनरी</h3><p>एक ही पासवर्ड दस जगह उपयोग करने का अर्थ है — एक साइट लीक हुई तो दसों खुल गईं (<b>credential stuffing</b>)। समाधान: हर खाते का <b>अलग, लंबा, यादृच्छिक</b> पासवर्ड, और उन्हें याद रखने के लिए एक <b>password manager</b>। आपको केवल एक <b>master password</b> याद रखना है — वह लंबा वाक्यांश रखें (चार-पाँच असंबंधित शब्द)। अधिकांश मैनेजर <b>zero-knowledge</b> होते हैं: आपका vault आपके master पासवर्ड से encrypt होता है और कंपनी के पास उसकी कुंजी नहीं होती।</p>' },

    { type: 'table',
      head: ['औज़ार', 'प्रकार', 'खुला स्रोत?', 'Sync कहाँ', 'खास बात'],
      rows: [
        ['Bitwarden', 'क्लाउड + self-host', 'हाँ', 'उनका server या आपका (Vaultwarden)', 'मुफ़्त योजना उदार; passkey व TOTP भी'],
        ['KeePassXC', 'स्थानीय फ़ाइल (.kdbx)', 'हाँ', 'आप तय करें (USB/cloud फ़ोल्डर)', 'इंटरनेट की ज़रूरत नहीं; पूरी तरह offline'],
        ['1Password', 'क्लाउड subscription', 'नहीं', 'उनका server', 'परिवार/टीम साझा करना, travel mode'],
        ['Proton Pass', 'क्लाउड', 'हाँ (क्लाइंट)', 'Proton', 'email aliases के साथ'],
        ['Browser का built-in', 'स्थानीय + खाता sync', 'आंशिक', 'Chrome/Edge/Firefox खाता', 'सुविधाजनक, पर browser खुला हो तो सब सुलभ'],
        ['Google Password Manager', 'क्लाउड', 'नहीं', 'Google खाता', 'Android/Chrome में एकीकृत; checkup बताता है कौन-सा लीक हुआ']
      ] },

    { type: 'callout', kind: 'danger', title: 'पासवर्ड मैनेजर की पाँच गलतियाँ',
      html: '(1) <b>master पासवर्ड कमज़ोर</b> — पूरा vault एक ही द्वार से खुलता है। (2) <b>2FA बंद</b> — master लीक हुआ तो vault गया। (3) <b>recovery code नहीं सहेजा</b> — फ़ोन खोया तो स्थायी रूप से बाहर। (4) <b>साझा मशीन पर vault खुला छोड़ना</b> — लैब में हर बार lock करें (Ctrl+L) और "master password on restart" चालू रखें। (5) <b>पासवर्ड plaintext फ़ाइल में</b> — <code>passwords.txt</code> या Excel में रखना मैनेजर न रखने से भी बुरा है। और हाँ — <b>किसी भी वेबसाइट पर अपना master पासवर्ड कभी न डालें</b>; कोई वैध सेवा उसे नहीं माँगती।' },

    { type: 'html', html: '<h3>1.11 हटाना भी एक कला है — अवशेष (leftovers) साफ़ करना</h3><p>Uninstall प्रायः केवल मुख्य फ़ाइलें हटाता है; खाली फ़ोल्डर, registry keys, scheduled tasks, services और startup entries पीछे छूट जाते हैं। धीमी मशीन का एक बड़ा कारण यही कचरा है। सही क्रम — पहले उत्पाद का अपना uninstaller, फिर Windows का Apps panel, फिर बचे अवशेष की जाँच। <b>Registry को हाथ से काटने से पहले export कर लें</b>; गलत key हटाने से Windows चलना बंद कर सकता है।</p>' },

    { type: 'table',
      head: ['अवशेष कहाँ', 'कैसे देखें', 'साफ़ करने का सुरक्षित तरीका', 'जोखिम'],
      rows: [
        ['Program Files / Program Files (x86)', 'फ़ोल्डर खोलकर बचा नाम देखें', 'uninstall के बाद खाली फ़ोल्डर हटाएँ', 'दूसरे उत्पाद की साझा फ़ाइल न हो — जाँचें'],
        ['%AppData%, %LocalAppData%, %ProgramData%', 'Run में ये नाम डालकर खोलें', 'उसी उत्पाद का फ़ोल्डर हटाएँ', 'सेटिंग्स/लाइसेंस जा सकते हैं — पहले backup'],
        ['Registry — HKLM\\Software, HKCU\\Software', 'regedit → Find से नाम खोजें', 'पहले File → Export, फिर key हटाएँ', 'गलत key = अस्थिर Windows'],
        ['Services', 'services.msc, या sc query', 'अनाथ service को sc delete नाम', 'चलती service न हो — पहले stop'],
        ['Startup / Task Manager', 'Task Manager → Startup apps', 'अनावश्यक Disable करें', 'security/ड्राइवर entry न छेड़ें'],
        ['Scheduled Tasks', 'taskschd.msc', 'उत्पाद का updater task हटाएँ', 'Windows के अपने task न हटाएँ'],
        ['Temp फ़ाइलें', '%temp%, C:\\Windows\\Temp', 'Disk Cleanup → Clean up system files', 'चलती प्रक्रिया की फ़ाइल अपने-आप बच जाती है'],
        ['Driver store', 'pnputil /enum-drivers', 'pnputil /delete-driver oemXX.inf /uninstall', 'सक्रिय उपकरण का driver न हटाएँ'],
        ['Linux — अनाथ पैकेज', 'apt list --installed; dpkg -l', 'sudo apt autoremove --purge', 'configuration भी मिटेगी — पहले सूची देखें'],
        ['Linux — बचा config', '~/.config, ~/.local/share, /etc', 'उत्पाद का फ़ोल्डर हटाएँ', 'दूसरे उपयोगकर्ता का डेटा न छुएँ']
      ] },

    { type: 'code', code: '# ---------------- Windows : हटाना व अवशेष ----------------\nGet-Package | Where-Object { $_.Name -like "*VLC*" }\nGet-Package -Name "VLC media player" | Uninstall-Package\nGet-CimInstance Win32_Product | Select-Object Name, Version   # धीमा, पर पूरी सूची\nwinget list\nwinget uninstall -e --id VideoLAN.VLC\nsc query type= service state= all | findstr /I "orphan"\nsc stop OldService ; sc delete OldService\nschtasks /query /fo LIST /v | more\npnputil /enum-drivers\ncleanmgr /sageset:1 ; cleanmgr /sagerun:1\n\n# ---------------- Linux : पूरा साफ़ ----------------\nsudo apt remove --purge vlc\nsudo apt autoremove --purge\nsudo apt clean\ndpkg -l | grep "^rc"                 # हटे पैकेज के बचे config\ndpkg -l | awk \'/^rc/ {print $2}\' | xargs sudo dpkg --purge\nflatpak uninstall --unused\nsudo journalctl --vacuum-time=14d    # लॉग 14 दिन तक सीमित\n\n# ---------------- Registry export (काटने से पहले) ----------------\nreg export "HKCU\\Software\\OldApp" "C:\\lab\\oldapp-backup.reg" /y' },

    { type: 'html', html: '<h3>1.12 सॉफ़्टवेयर न चले तो — क्रमबद्ध निदान</h3><p>सॉफ़्टवेयर की शिकायतों का 80% हिस्सा पाँच कारणों में सिमटा है — <b>लापता dependency</b> (DLL/.NET/VC++), <b>अनुमति</b>, <b>पुराना/बेमेल संस्करण</b>, <b>security software का रोकना</b>, और <b>भ्रष्ट प्रोफ़ाइल/सेटिंग्स</b>। नीचे की तालिका उसी क्रम में है जिसमें जाँच करनी चाहिए — सबसे सस्ता और सबसे कम जोखिम वाला कदम पहले।</p>' },

    { type: 'table',
      head: ['लक्षण / संदेश', 'संभावित कारण', 'पहली जाँच', 'पक्का इलाज'],
      rows: [
        ['"VCRUNTIME140.dll / MSVCP140.dll missing"', 'Visual C++ Redistributable नहीं', 'कौन-सा वर्ष माँग रहा (2015–2022)', 'x64 व x86 दोनों VC++ redist स्थापित करें'],
        ['".NET Framework / Runtime आवश्यक"', 'सही .NET संस्करण नहीं', 'ऐप का दस्तावेज़ देखें', '.NET Desktop Runtime सही संस्करण का डालें'],
        ['"api-ms-win-crt-*.dll missing"', 'Universal CRT / पुराना Windows', 'Windows Update की स्थिति', 'सभी अपडेट + VC++ redist'],
        ['ऐप चुपचाप बंद, कोई संदेश नहीं', 'crash — log में मिलेगा', 'Event Viewer → Windows Logs → Application', 'faulting module देखें; ऐप repair/reinstall'],
        ['"Access is denied" / "Permission denied"', 'अनुमति या admin चाहिए', 'किस फ़ोल्डर/फ़ाइल पर अटका', 'Run as administrator, या फ़ोल्डर की NTFS अनुमति ठीक करें'],
        ['"This app can’t run on your PC"', 'architecture/संस्करण बेमेल', 'x86 बनाम x64 बनाम ARM64', 'सही binary डाउनलोड करें'],
        ['पुराना ऐप नया Windows पर नहीं चलता', 'compatibility', 'Properties → Compatibility', 'Compatibility mode + admin; या VM में पुराना Windows'],
        ['Antivirus चुपचाप फ़ाइल मिटा दे', 'false positive या सचमुच संदिग्ध', 'quarantine सूची देखें', 'पहले hash/VirusTotal जाँचें; भरोसेमंद हो तो ही allow करें'],
        ['"Side-by-side configuration is incorrect"', 'manifest/CRT बेमेल', 'Event Viewer का विवरण', 'सही VC++ redist; sxstrace से निदान'],
        ['बार-बार settings reset / प्रोफ़ाइल भ्रष्ट', 'user profile खराब', 'दूसरे user में चलाकर देखें', 'ऐप का config फ़ोल्डर backup करके हटाएँ; नया प्रोफ़ाइल'],
        ['इंस्टॉलर बीच में अटक जाता है', 'अधूरी पिछली स्थापना, जगह कम', '%temp% log, डिस्क की खाली जगह', 'Disk Cleanup, reboot, फिर installer; MSI log लें'],
        ['ऐप चलता है पर बहुत धीमा', 'GPU acceleration, कम RAM, background scan', 'Task Manager → CPU/Disk/GPU', 'hardware acceleration बंद करके परखें; RAM/SSD जाँचें'],
        ['"License expired" / "Activate Windows"', 'लाइसेंस/subscription समाप्त', 'खाते की स्थिति, तारीख़', 'वैध नवीनीकरण या मुफ़्त विकल्प पर जाएँ'],
        ['Linux: "error while loading shared libraries"', 'लाइब्रेरी path में नहीं', 'ldd ./app', 'सही पैकेज स्थापित करें, या LD_LIBRARY_PATH सेट करें']
      ] },

    { type: 'code', code: '# ---------------- Windows : निदान के हथियार ----------------\n# Event Viewer की crash entries कमांड से\nGet-WinEvent -FilterHashtable @{LogName="Application"; Level=2} -MaxEvents 20 |\n  Select-Object TimeCreated, ProviderName, Id, Message | Format-List\n# विश्वसनीयता इतिहास (कौन-सा ऐप कब गिरा)\nperfmon /rel\n# system फ़ाइल अखंडता\nsfc /scannow\nDISM /Online /Cleanup-Image /RestoreHealth\n# कौन-सी DLL किसने माँगी (Sysinternals)\n# Process Monitor → filter Process Name = app.exe → देखें NAME NOT FOUND\n# MSI installer का विस्तृत log\nmsiexec /i app.msi /l*v C:\\lab\\install.log\n# कौन-सा प्रोग्राम startup पर चलता है\nGet-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location\n\n# ---------------- Linux : निदान ----------------\nldd ./myapp                     # कौन-सी library missing\nldconfig -p | grep libssl            # system में कौन-सी version है\nstrace -f -o trace.txt ./myapp  # कौन-सी फ़ाइल/syscall पर अटका\njournalctl -xe                  # हाल की त्रुटियाँ\ndmesg | tail -40                # kernel/hardware संदेश\nulimit -a                       # संसाधन सीमाएँ\ndf -h ; free -m                 # जगह व RAM' },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — यूटिलिटी व सॉफ़्टवेयर रखरखाव',
      html: 'बार-बार पूछे जाने वाले बिंदु — (1) <b>Utility software</b> की परिभाषा व दो उदाहरण (disk defragmenter, antivirus, backup, compression)। (2) <b>Open source बनाम freeware</b> में अंतर — स्रोत कोड की उपलब्धता। (3) <b>Lossless बनाम lossy</b> — उदाहरण सहित (ZIP/PNG/FLAC बनाम JPEG/MP3/MP4)। (4) <b>Codec और container</b> में अंतर। (5) <b>3-2-1 बैकअप नियम</b>। (6) <b>GUI vs CLI remote</b> और RDP/SSH के port (3389/22)। (7) <b>Type-1 बनाम Type-2 hypervisor</b>। (8) <b>Defragmentation</b> HDD के लिए है, <b>SSD के लिए नहीं</b> — SSD पर TRIM चलता है, defrag उसकी write-सीमा घटाता है।' },

    { type: 'labs', items: [
      { n: 175, title: 'लाइसेंस व पैकेज-मैनेजर ऑडिट', aim: 'लैब की मशीन पर लगे सॉफ़्टवेयर की लाइसेंस-स्थिति और अपडेट-स्थिति का पूरा लेखा बनाना।', tools:['Windows 10/11 PC', 'winget', 'PowerShell', 'नोटबुक/स्प्रेडशीट'], steps:['winget list चलाकर पूरी सूची C:\\lab\\apps.txt में सहेजें।', 'winget upgrade चलाकर देखें कितने पैकेज पुराने हैं; संख्या लिखें।', 'हर सॉफ़्टवेयर को चार श्रेणियों में बाँटें — system / application / utility / development।', 'हर एक का लाइसेंस-प्रकार पहचानें (proprietary, freeware, open source, trial) और उसका स्रोत-URL लिखें।', 'कोई trial या अधूरा लाइसेंस मिले तो उसका मुफ़्त/खुला विकल्प खोजें और तुलना-तालिका बनाएँ।', 'winget export -o C:\\lab\\apps.json से सूची निर्यात करें; दूसरी मशीन पर winget import से पुनर्स्थापना का अभ्यास करें।'], result: 'सॉफ़्टवेयर-रजिस्टर (नाम, संस्करण, श्रेणी, लाइसेंस, स्रोत, अपडेट-स्थिति) और एक आयात/निर्यात प्रतिवेदन।' },
      { n: 176, title: 'Compression प्रयोगशाला — ratio नापो', aim: 'विभिन्न archive प्रारूपों का आकार, समय और अखंडता नापकर सही चुनाव करना सीखना।', tools:['7-Zip', 'एक ही 200–500 MB फ़ोल्डर (दस्तावेज़ + तस्वीरें + वीडियो मिश्रित)', 'स्टॉपवॉच'], steps:['मूल फ़ोल्डर का सटीक आकार लिखें।', 'उसी फ़ोल्डर से zip, 7z (mx=9), tar.gz और tar.xz बनाएँ; हर एक का समय व आकार दर्ज करें।', 'हर archive को 7z t से परखें और एक फ़ाइल खोलकर मूल से hash मिलाएँ।', 'अब केवल तस्वीरों/वीडियो वाला फ़ोल्डर लेकर वही चार प्रारूप दोहराएँ — अंतर क्यों घटा, लिखें।', 'एक 7z archive AES-256 पासवर्ड और -mhe=on के साथ बनाएँ; बिना पासवर्ड सूची भी न दिखे, यह जाँचें।', 'एक बड़ा archive 100 MB खंडों में बाँटें और सब खंड जोड़कर वापस खोलें।'], result: 'आकार/समय/ratio की तुलना-तालिका, hash-सत्यापन प्रतिवेदन और encrypted archive का प्रदर्शन।' },
      { n: 177, title: 'PDF कार्यप्रवाह — स्कैन से खोजने योग्य तक', aim: 'एक छपी हुई सामग्री को स्कैन करके OCR द्वारा खोजने योग्य, छोटे और हस्ताक्षर-योग्य PDF में बदलना।', tools:['स्कैनर या मोबाइल कैमरा', 'OCRmyPDF + Tesseract (hin+eng)', 'qpdf, Ghostscript', 'LibreOffice'], steps:['दो पृष्ठ की हिंदी+अंग्रेज़ी सामग्री 300 DPI पर स्कैन करें।', 'OCR से पहले pdftotext चलाकर दिखाएँ कि कुछ नहीं मिलता (image-only)।', 'ocrmypdf -l hin+eng --deskew --rotate-pages चलाएँ; फिर pdftotext से पाठ निकालकर शुद्धता जाँचें।', 'Ghostscript से /ebook और /screen दोनों आकार घटाकर मूल से तुलना करें — पाठ अभी भी खोजा जा सकता है?', 'दो अध्याय-PDF को qpdf से जोड़ें, फिर पृष्ठ 3–7 अलग निकालें।', 'अंतिम PDF पर पासवर्ड लगाएँ और अपने हस्ताक्षर जोड़कर एक प्रति प्रतिवेदन में लगाएँ।'], result: 'खोजने योग्य PDF, OCR-शुद्धता टिप्पणी, आकार-तुलना तालिका और पासवर्ड-सुरक्षित अंतिम प्रति।' },
      { n: 178, title: 'मीडिया रूपान्तरण व स्क्रीन रिकॉर्डिंग', aim: 'codec/container का व्यावहारिक अंतर समझना और लैब-प्रतिवेदन के लिए साफ़ स्क्रीन-रिकॉर्डिंग बनाना।', tools:['FFmpeg / HandBrake', 'MediaInfo', 'VLC', 'OBS Studio'], steps:['एक वीडियो का MediaInfo से codec, container, bitrate, resolution लिखें।', 'FFmpeg से उसे H.264 MP4 (CRF 22) और H.265 MP4 (CRF 26) में बदलें; आकार व दृश्य-गुणवत्ता तुलना करें।', 'उसी से केवल ऑडियो MP3 निकालें और 20 सेकंड का एक clip बिना re-encode (-c copy) काटें।', 'जान-बूझकर एक बेमेल फ़ाइल बनाएँ (जैसे AV1 को पुराने player में) और MediaInfo से कारण बताएँ।', 'OBS में 720p30, hardware encoder, MKV format सेट करके 2 मिनट की स्क्रीन-रिकॉर्डिंग लें जिसमें आप एक कमांड चलाकर समझाएँ।', 'MKV को MP4 में remux करें और अंतिम फ़ाइल VLC व browser दोनों में चलाकर जाँचें।'], result: 'codec-तुलना तालिका, चार व्युत्पन्न फ़ाइलें और 2 मिनट की समझाई हुई स्क्रीन-रिकॉर्डिंग।' },
      { n: 179, title: '3-2-1 बैकअप + पुनर्स्थापना अभ्यास', aim: 'एक वास्तविक बैकअप-नीति बनाना, उसे स्वचालित करना और सत्यापित पुनर्स्थापना करके दिखाना।', tools:['बाहरी HDD/USB', 'rsync या robocopy', 'Borg/restic या File History', 'एक cloud फ़ोल्डर', 'VirtualBox (परीक्षण के लिए)'], steps:['अपने महत्वपूर्ण डेटा की सूची बनाएँ और उसका कुल आकार नापें।', '3-2-1 के अनुसार तीन स्थान तय करें — आंतरिक, बाहरी डिस्क, off-site (cloud/दूसरी मशीन)।', 'पहली पूरी नकल लें; फिर एक फ़ाइल बदलकर incremental चलाएँ और दिखाएँ कि केवल बदला हुआ गया।', 'Borg/restic से encrypted, deduplicated संग्रह बनाएँ और borg check / restic check से सत्यापित करें।', 'अब एक फ़ाइल और एक पूरा फ़ोल्डर जान-बूझकर मिटाएँ, फिर backup से वापस लाएँ और hash मिलाएँ।', 'VM में एक छोटी पुनर्स्थापना करके दिखाएँ कि मशीन नई हो तब भी डेटा वापस आता है; पूरी प्रक्रिया का समय लिखें।'], result: 'लिखित 3-2-1 नीति, स्वचालित schedule, सत्यापन-प्रतिवेदन और पुनर्स्थापना अभ्यास का समय-सहित प्रमाण।' }
    ] },

    { type: 'acc', title: 'अक्सर उलझने वाले प्रश्न',
      items: [
        { q: 'मुफ़्त सॉफ़्टवेयर और खुला स्रोत सॉफ़्टवेयर एक ही हैं?', a: 'नहीं। Freeware की कीमत शून्य है पर स्रोत कोड बंद हो सकता है और बदलने-बाँटने की अनुमति नहीं मिलती। Open source में स्रोत कोड खुला होता है, आप पढ़-बदल-बाँट सकते हैं (लाइसेंस की शर्तों के साथ) — भले ही कोई उसे बेचे भी। "Free software" में free का अर्थ स्वतंत्रता है, कीमत नहीं।' },
        { q: 'Portable ऐप और installed ऐप में लैब के लिए क्या बेहतर?', a: 'साझा लैब मशीनों पर portable बढ़िया है — registry नहीं छूता, USB से चलता है, हटाना सरल। पर portable में स्वचालित अपडेट और file-association प्रायः नहीं मिलते, और कुछ ऐप admin अधिकार माँगते ही हैं। स्थायी, रोज़ के काम के लिए installed ठीक है।' },
        { q: 'ZIP और 7Z में क्या चुनें?', a: 'बाँटना हो और सामने वाला कोई भी हो तो ZIP — हर OS बिना औज़ार खोल लेता है। संग्रह/backup हो, आकार मायने रखता हो या encryption चाहिए तो 7Z (LZMA2 + AES-256, -mhe=on से नाम भी छिपते हैं)। Linux स्रोत कोड के लिए tar.gz/tar.xz क्योंकि वह Unix अनुमतियाँ व symlink सुरक्षित रखता है।' },
        { q: 'JPEG को ZIP में डालने से आकार क्यों नहीं घटता?', a: 'JPEG पहले से lossy compression से गुज़र चुका है; उसमें वह दोहराव बचा ही नहीं जिसे ZIP घटा सके। इसलिए मीडिया फ़ाइलों पर archive लगभग बेअसर है। आकार घटाना हो तो resolution/bitrate/quality घटाएँ या आधुनिक codec (WebP/AVIF/HEVC) चुनें।' },
        { q: 'MP4 और MKV में क्या फ़र्क़ है? कौन-सा बेहतर?', a: 'दोनों container हैं, codec नहीं। MP4 की समर्थन-सीमा सबसे चौड़ी है (मोबाइल, TV, browser)। MKV खुला है और कई audio track, subtitle, अध्याय एक फ़ाइल में रख सकता है — संग्रह के लिए बेहतर, पर हर उपकरण नहीं चलाता। "बेहतर" उपयोग पर निर्भर है, गुणवत्ता पर नहीं।' },
        { q: 'क्या antivirus के होते हुए भी crack करना सुरक्षित है?', a: 'नहीं। crack को चलाने के लिए antivirus बंद करना पड़ता है, ठीक उसी समय जब वह सबसे अधिक चाहिए। crack बनाने वाला पहले से payload बाँध चुका होता है। लैब/संस्थान की मशीन पर यह लाइसेंस-उल्लंघन भी है। मुफ़्त/खुला विकल्प या education licence ही सही रास्ता है।' },
        { q: 'RAID लगा दिया, अब बैकअप की ज़रूरत नहीं?', a: 'RAID केवल डिस्क-विफलता से बचाता है। गलती से मिटी फ़ाइल, ransomware का encryption, आग/चोरी, या भ्रष्ट filesystem — इनमें से किसी से भी RAID नहीं बचाता; वह तुरंत हर डिस्क पर वही गलती दोहरा देता है। बैकअप अलग, off-site और सत्यापित होना ही चाहिए।' },
        { q: 'OneDrive पर सब कुछ है तो बैकअप हो गया?', a: 'Sync बैकअप नहीं है। मिटाया तो हर जुड़ी मशीन और cloud से मिटता है; ransomware ने encrypt किया तो encrypted प्रति sync हो जाती है। बचाव के लिए version history व recycle bin चालू रखें, "Files On-Demand" की offline स्थिति समझें, और एक अलग offline/off-site प्रति भी रखें।' },
        { q: 'VM धीमी चलती है — क्या करूँ?', a: 'क्रम से जाँचें — BIOS में VT-x/AMD-V चालू है? अतिथि को मेज़बान की आधी से अधिक RAM तो नहीं दी? Guest Additions लगे हैं? डिस्क dynamically allocated है तो पहली बार बढ़ने पर धीमी लगती है। Windows मेज़बान पर Hyper-V/WSL2/VBS चालू हो तो VirtualBox को hardware virtualization नहीं मिल पाती — उसे बंद करें या Hyper-V संगत संस्करण लें।' },
        { q: 'Dual boot और VM में परीक्षा-दृष्टि से क्या अंतर है?', a: 'Dual boot में एक समय में एक ही OS चलता है, पूरा हार्डवेयर मिलता है, पर बदलने के लिए reboot चाहिए और bootloader बिगड़ने का जोखिम है। VM में मेज़बान OS के ऊपर अतिथि OS चलता है, दोनों साथ चलते हैं, snapshot मिलते हैं, पर संसाधन बँटते हैं। Hypervisor Type-1 सीधे हार्डवेयर पर, Type-2 मेज़बान OS के ऊपर।' },
        { q: 'WSL क्या पूरा Linux है?', a: 'WSL2 असली Linux kernel चलाता है पर हल्की VM में, Windows के साथ एकीकृत। कमांड, पैकेज मैनेजर, filesystem सब असली Linux जैसे हैं। सीमाएँ — अलग boot नहीं, systemd समर्थन संस्करण पर निर्भर, GUI ऐप के लिए WSLg चाहिए, और kernel-स्तरीय/हार्डवेयर-निकट काम (जैसे custom kernel module, USB passthrough) सीमित हैं।' },
        { q: 'पासवर्ड मैनेजर का master पासवर्ड भूल गए तो?', a: 'शून्य-ज्ञान (zero-knowledge) सेवाएँ उसे recover नहीं कर सकतीं — यही उनकी सुरक्षा है। इसीलिए recovery code / emergency kit पहले ही छापकर सुरक्षित रखें। कुछ मैनेजर trusted device या परिवार-साझा करने से वापसी देते हैं। सब खोया तो vault स्थायी रूप से अप्राप्य है; हर खाते का पासवर्ड "forgot password" से reset करना पड़ेगा।' },
        { q: 'Uninstall के बाद भी ऐप का नाम क्यों दिखता है?', a: 'अवशेष बचे हैं — Start menu की टूटी shortcut, registry की uninstall key, %AppData% का फ़ोल्डर, या कोई service/task। Apps panel से हटाने के बाद इन स्थानों की जाँच करें। Registry काटने से पहले export अवश्य लें। Linux में apt remove --purge और autoremove --purge से बचा config भी मिटता है।' },
        { q: 'किसी ऐप के लिए कौन-सा VC++ या .NET चाहिए, कैसे पता करें?', a: 'ऐप के दस्तावेज़/वेबसाइट में "System Requirements" देखें। न मिले तो error में माँगी गई DLL का नाम पढ़ें — VCRUNTIME140 = VC++ 2015–2022, MSVCR120 = 2013, MSVCR110 = 2012। Event Viewer → Application में faulting module और .NET Runtime की entry भी संस्करण बता देती है। x64 ऐप के लिए x64 redist चाहिए; x86 ऐप के लिए x86 — दोनों रखना सुरक्षित है।' }
      ] },

    { type: 'quiz', store: 'sw-util', items: [
      { q: 'सॉफ़्टवेयर की तीन मुख्य मंज़िलें कौन-सी हैं?', o: ['Input, Output, Process', 'System, Application, Utility', 'Hardware, Firmware, Driver', 'Compiler, Interpreter, Assembler'], a: 1, ex: 'प्रणाली सॉफ़्टवेयर मशीन चलाता है, अनुप्रयोग उपयोगकर्ता का काम करता है, यूटिलिटी देखभाल करती है।' },
      { q: 'Freeware और Open Source में मुख्य अंतर क्या है?', o: ['कीमत', 'स्रोत कोड की उपलब्धता व बदलने की अनुमति', 'चलने की गति', 'आकार'], a: 1, ex: 'Freeware मुफ़्त हो सकता है पर स्रोत बंद; open source में स्रोत खुला और बदल-बाँट सकते हैं।' },
      { q: 'GPL लाइसेंस की खास शर्त क्या है?', o: ['कोई शर्त नहीं', 'व्युत्पन्न काम भी उसी लाइसेंस में बाँटना (copyleft)', 'केवल व्यक्तिगत उपयोग', 'स्रोत कोड छिपाना अनिवार्य'], a: 1, ex: 'GPL copyleft है — बदला हुआ संस्करण बाँटें तो स्रोत भी उसी GPL में देना पड़ता है। MIT/Apache permissive हैं।' },
      { q: 'winget से सभी स्थापित पैकेज अपडेट करने की कमांड?', o: ['winget update all', 'winget upgrade --all', 'winget refresh', 'winget install --all'], a: 1, ex: 'winget upgrade --all सभी ज्ञात पैकेज नवीनतम संस्करण पर ले जाता है।' },
      { q: 'Ubuntu पर अनाथ पैकेज व बचा config हटाने की कमांड?', o: ['sudo apt clean', 'sudo apt autoremove --purge', 'sudo apt update', 'sudo apt remove --all'], a: 1, ex: 'autoremove अनाथ निर्भरताएँ हटाता है; --purge उनका config भी मिटाता है।' },
      { q: 'Lossless compression का उदाहरण कौन-सा है?', o: ['JPEG', 'MP3', 'PNG', 'H.264'], a: 2, ex: 'PNG, ZIP, FLAC, GIF lossless हैं; JPEG, MP3, H.264 lossy हैं।' },
      { q: 'किस प्रारूप में पारदर्शिता (transparency) नहीं मिलती?', o: ['PNG', 'GIF', 'WebP', 'JPEG'], a: 3, ex: 'JPEG में alpha channel नहीं होता, इसलिए पारदर्शिता नहीं। PNG/GIF/WebP/TIFF में मिलती है।' },
      { q: '.mp4 क्या है?', o: ['Video codec', 'Container', 'Audio codec', 'Compression algorithm'], a: 1, ex: 'MP4 container है; अंदर H.264/H.265/AV1 video और AAC/MP3 audio हो सकता है।' },
      { q: 'H.265/HEVC का H.264 से मुख्य लाभ?', o: ['हर पुराने उपकरण में चलता है', 'लगभग आधा आकार उसी गुणवत्ता पर', 'lossless है', 'केवल ऑडियो के लिए'], a: 1, ex: 'HEVC उसी दृश्य गुणवत्ता पर लगभग 40–50% कम bitrate लेता है, पर encoding भारी और पेटेंट-बोझ है।' },
      { q: 'VLC क्यों हर फ़ाइल चला देता है?', o: ['इंटरनेट से codec माँगता है', 'अपने codec स्वयं साथ लाता है', 'फ़ाइल को बदल देता है', 'केवल MP4 चलाता है'], a: 1, ex: 'VLC अपने built-in codecs लाता है, इसलिए अलग codec pack की ज़रूरत नहीं।' },
      { q: '3-2-1 बैकअप नियम में "1" क्या दर्शाता है?', o: ['एक पासवर्ड', 'एक प्रति स्थान से बाहर (off-site)', 'एक डिस्क', 'एक बार सत्यापन'], a: 1, ex: '3 प्रतियाँ, 2 अलग माध्यम, 1 off-site। विस्तार 3-2-1-1-0 में एक immutable प्रति और 0 सत्यापन-त्रुटि।' },
      { q: 'क्या RAID बैकअप का विकल्प है?', o: ['हाँ, RAID 1 पूरा बैकअप है', 'नहीं — गलती से मिटाना, ransomware व चोरी से नहीं बचाता', 'हाँ, RAID 5 काफी है', 'केवल SSD पर हाँ'], a: 1, ex: 'RAID केवल डिस्क-विफलता सहन करता है; तार्किक गलती तुरंत हर सदस्य पर दोहरा जाती है।' },
      { q: 'rsync में --delete क्या करता है?', o: ['स्रोत की फ़ाइलें मिटाता है', 'लक्ष्य की वे फ़ाइलें मिटाता है जो स्रोत में नहीं हैं', 'कुछ नहीं मिटाता', 'केवल नाम बदलता है'], a: 1, ex: '--delete लक्ष्य को स्रोत का आईना बनाता है। पहले --dry-run (/L) से देखें, वरना लक्ष्य का अतिरिक्त डेटा मिट जाएगा।' },
      { q: 'SSH का डिफ़ॉल्ट port और RDP का port क्रमशः?', o: ['21 और 23', '22 और 3389', '80 और 443', '3306 और 5432'], a: 1, ex: 'SSH = TCP 22, RDP = TCP 3389, VNC = 5900+, WinRM = 5985/5986।' },
      { q: 'Type-2 hypervisor का उदाहरण?', o: ['VMware ESXi', 'Proxmox VE', 'Oracle VirtualBox', 'Xen bare-metal'], a: 2, ex: 'VirtualBox/VMware Workstation मेज़बान OS के ऊपर चलते हैं = Type-2। ESXi/Proxmox सीधे हार्डवेयर पर = Type-1।' },
      { q: 'VM में "Guest Additions" किसलिए लगाते हैं?', o: ['अतिथि OS को सक्रिय करने', 'full-screen, shared clipboard/folder व बेहतर graphics के लिए', 'इंटरनेट देने', 'पासवर्ड हटाने'], a: 1, ex: 'Guest Additions (VirtualBox) / VMware Tools अतिथि के लिए ड्राइवर व एकीकरण सुविधाएँ लाते हैं।' },
      { q: 'WSL2 क्या चलाता है?', o: ['Linux कमांड का नकली अनुवाद', 'असली Linux kernel हल्की VM में', 'केवल bash script', 'Windows kernel में Linux ऐप'], a: 1, ex: 'WSL2 असली Linux kernel चलाता है; WSL1 अनुवाद-परत था। इसलिए WSL2 में संगतता बेहतर है।' },
      { q: 'Container और VM में मुख्य अंतर?', o: ['Container में अलग kernel होता है', 'VM में अलग kernel, container मेज़बान का kernel साझा करता है', 'दोनों एक ही हैं', 'Container हमेशा बड़ा होता है'], a: 1, ex: 'VM पूरा अतिथि OS + kernel चलाता है; container केवल अलग user-space रखता है, इसलिए हल्का व तेज़ है।' },
      { q: 'Ventoy का लाभ क्या है?', o: ['ISO को छोटा करता है', 'एक USB पर कई ISO बस copy करके boot करना', 'USB को encrypt करता है', 'Windows स्थापित करता है'], a: 1, ex: 'Ventoy एक बार USB पर लगता है; फिर जितने ISO copy करें, boot menu में सब दिखते हैं। बार-बार burn नहीं करना पड़ता।' },
      { q: 'Zero-knowledge पासवर्ड मैनेजर का अर्थ?', o: ['पासवर्ड रखता ही नहीं', 'vault आपके master पासवर्ड से encrypt; सेवा-प्रदाता के पास कुंजी नहीं', 'बिना पासवर्ड खुलता है', 'सब पासवर्ड एक जैसे'], a: 1, ex: 'इसीलिए master पासवर्ड भूलने पर सेवा उसे recover नहीं कर सकती — recovery code पहले सहेजना ज़रूरी है।' },
      { q: '"VCRUNTIME140.dll missing" का सही इलाज?', o: ['DLL इंटरनेट से अलग डाउनलोड करें', 'Microsoft Visual C++ 2015–2022 Redistributable स्थापित करें', 'Windows दोबारा डालें', 'registry साफ़ करें'], a: 1, ex: 'यह VC++ runtime की कमी है। आधिकारिक redist (x64 व x86 दोनों) डालें; अलग DLL साइटें असुरक्षित होती हैं।' },
      { q: 'SSD पर defragmentation क्यों नहीं करनी चाहिए?', o: ['SSD बहुत तेज़ है', 'यादृच्छिक पहुँच का लाभ नहीं, उल्टे write घिसावट बढ़ती है; TRIM चाहिए', 'Windows मना करता है', 'SSD में फ़ाइलें बिखरती ही नहीं'], a: 1, ex: 'SSD में seek time नहीं होता, इसलिए defrag का लाभ शून्य है पर write-सीमा घटती है। वहाँ TRIM/Optimize (retrim) सही है।' },
      { q: 'scanned PDF में पाठ खोजने के लिए क्या चाहिए?', o: ['बड़ा फ़ॉन्ट', 'OCR (Optical Character Recognition)', 'पासवर्ड', 'compression'], a: 1, ex: 'image-only PDF में अक्षर नहीं होते। OCRmyPDF/Tesseract तस्वीर को पाठ में बदलकर खोजने योग्य परत जोड़ते हैं।' },
      { q: 'किसी installer को चुपचाप (silent) चलाने का सही तरीका?', o: ['msiexec /i app.msi /qn /norestart', 'app.msi डबल-क्लिक', 'msiexec /x app.msi', 'app.msi /silent=0'], a: 0, ex: '/qn = कोई UI नहीं, /norestart = reboot नहीं। NSIS exe के लिए प्रायः /S। लैब imaging में यही उपयोगी है।' },
      { q: 'सॉफ़्टवेयर डाउनलोड करते समय सबसे सुरक्षित स्रोत कौन-सा?', o: ['खोज-इंजन का पहला "Download" बटन', 'विक्रेता की आधिकारिक साइट / Store / भरोसेमंद repository', 'कोई भी mirror', 'टोरेंट'], a: 1, ex: 'पहला परिणाम प्रायः विज्ञापन होता है। आधिकारिक स्रोत + SHA-256 मिलान + signature जाँच — यही सुरक्षित क्रम है।' }
    ] },

    { type: 'pills', items: [
      { text: 'System = मशीन चलाए, Application = काम करे, Utility = देखभाल', kind: 'info' },
      { text: 'मुफ़्त ≠ खुला स्रोत', kind: 'warn' },
      { text: 'ZIP बाँटने के लिए, 7z संग्रह के लिए, tar.gz Linux के लिए', kind: 'tip' },
      { text: 'MP4/MKV = डिब्बा, H.264/AAC = अंदर का codec', kind: 'info' },
      { text: '3 प्रतियाँ · 2 माध्यम · 1 off-site', kind: 'ok' },
      { text: 'RAID ≠ बैकअप, Sync ≠ बैकअप', kind: 'danger' },
      { text: 'SSH 22 · RDP 3389 · VNC 5900', kind: 'info' },
      { text: 'SSD पर TRIM, defrag नहीं', kind: 'warn' }
    ] }

  ]
},
]);

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
{
  id: 'sw-ai',
  icon: '🤖',
  group: 'सॉफ़्टवेयर संसार',
  title: 'क्लाउड, AI व नई तकनीकें',
  sub: 'क्लाउड सेवा-मॉडल, स्टोरेज व होस्टिंग, container/serverless, ML व LLM, prompt, IoT, blockchain, AR/VR, 5G व quantum',
  kicker: 'Software World 3 · Cloud, AI & New Technologies',
  hero: 'यह पेज आज की और आने वाले कल की तकनीक का पूरा नक्शा है। क्लाउड कंप्यूटिंग की पाँच NIST विशेषताएँ, IaaS/PaaS/SaaS/FaaS में "कौन क्या सँभालता है" की पूरी तालिका, public/private/hybrid deployment, क्लाउड स्टोरेज में sync बनाम backup का अंतर, साझा-लिंक की अनुमतियाँ, static वेबसाइट होस्टिंग व CDN, container से serverless तक का सफ़र। फिर AI — ML/DL/GenAI की सीढ़ी, supervised/unsupervised/reinforcement learning, LLM का token से inference तक का पूरा रास्ता, hallucination क्यों होता है, prompt engineering की दस तकनीकें, चलते उदाहरण, दर्जनों AI औज़ारों की तुलना और AI के सुरक्षित-नैतिक उपयोग के नियम। अंत में IoT की चार परतें व प्रोटोकॉल, blockchain, AR/VR/MR, 1G से 5G, edge computing, quantum computing की नींव और करियर-पथ।',
  tags: ['क्लाउड सेवा-मॉडल', 'स्टोरेज व होस्टिंग', 'ML से LLM तक', 'Prompt व AI औज़ार', 'IoT व Blockchain', 'AR/VR, 5G, Quantum'],
  blocks: [

    { type: 'html', html: '<h3>1.1 क्लाउड कंप्यूटिंग — किराए पर कंप्यूटर</h3><p><b>क्लाउड कंप्यूटिंग (Cloud Computing)</b> = इंटरनेट पर साझा किए गए कंप्यूटिंग संसाधनों (server, storage, database, network, software, analytics) की <b>माँग के अनुसार, नापकर बिल होने वाली</b> आपूर्ति। अपना server खरीदने के बजाय आप उसे मिनटों में किराए पर लेते हैं और जितना उपयोग करें उतना भुगतान करते हैं। "क्लाउड" कोई जादू नहीं — वह किसी और की मशीन है, किसी डेटा-सेंटर में, जिसे आप network से चलाते हैं।</p>' },

    { type: 'table',
      head: ['NIST विशेषता', 'अर्थ', 'व्यावहारिक उदाहरण'],
      rows: [
        ['On-demand self-service', 'मानवीय बातचीत के बिना स्वयं संसाधन ले सकें', 'console में दो क्लिक में नया server/डेटाबेस'],
        ['Broad network access', 'मानक network व हर तरह के उपकरण से पहुँच', 'मोबाइल, लैपटॉप, टैबलेट — सब से वही फ़ाइल/ऐप'],
        ['Resource pooling', 'एक ही भौतिक संसाधन कई ग्राहकों में बँटा (multi-tenant)', 'एक भौतिक server पर कई VM; storage का साझा पूल'],
        ['Rapid elasticity', 'माँग बढ़े तो तुरंत बढ़े, घटे तो तुरंत घटे', 'परीक्षा-परिणाम वाले दिन traffic दस गुना — server अपने-आप बढ़ें'],
        ['Measured service', 'उपयोग नापा जाता है, उसी का बिल', 'प्रति GB storage, प्रति घंटा VM, प्रति लाख request']
      ] },

    { type: 'table',
      head: ['मॉडल', 'पूरा नाम', 'आप क्या सँभालते हैं', 'प्रदाता क्या सँभालता है', 'उदाहरण'],
      rows: [
        ['IaaS', 'Infrastructure as a Service', 'OS, runtime, ऐप, डेटा', 'hardware, network, virtualization, storage', 'AWS EC2, Azure VM, Google Compute Engine, DigitalOcean Droplet'],
        ['PaaS', 'Platform as a Service', 'केवल ऐप का कोड व डेटा', 'OS, runtime, scaling, patching सब', 'Heroku, Google App Engine, Azure App Service, Render'],
        ['SaaS', 'Software as a Service', 'कुछ नहीं — केवल उपयोग व अपना डेटा', 'पूरा stack, ऐप सहित', 'Microsoft 365, Google Workspace, Salesforce, Canva'],
        ['FaaS / Serverless', 'Function as a Service', 'एक-एक function का कोड', 'server, scaling, शून्य पर घटाना', 'AWS Lambda, Azure Functions, Netlify Functions, Cloudflare Workers'],
        ['BaaS', 'Backend as a Service', 'frontend व business logic', 'auth, database, storage, push', 'Firebase, Supabase, Appwrite'],
        ['DaaS / DBaaS', 'Database / Desktop as a Service', 'query व schema', 'DB engine, backup, patching', 'Amazon RDS, MongoDB Atlas, Azure SQL, Windows 365'],
        ['CaaS', 'Containers as a Service', 'container image व उसका विन्यास', 'cluster, orchestrator, networking', 'AWS ECS/EKS, Google Cloud Run, Azure Container Apps']
      ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — IaaS / PaaS / SaaS',
      html: 'सबसे आम प्रश्न — <b>"तीन सेवा-मॉडलों में अंतर बताइए और उदाहरण दीजिए।"</b> याद रखने की तरकीब: <b>IaaS में आप OS से ऊपर सब सँभालते हैं, PaaS में केवल ऐप, SaaS में केवल अपना डेटा।</b> जैसे pizza — IaaS = आटा-सामान घर लाकर स्वयं बनाना (किचन आपका), PaaS = तैयार dough पर अपनी topping (बेकिंग दुकान की), SaaS = बन बनाया pizza खाना (कुछ नहीं करना)। दूसरा प्रश्न — <b>क्लाउड की पाँच विशेषताएँ</b> (ऊपर दी गई तालिका) और <b>चार deployment मॉडल</b> (public, private, community, hybrid)।' },

    { type: 'table',
      head: ['Deployment मॉडल', 'किसके लिए', 'लागत', 'नियंत्रण', 'जोखिम / सीमा'],
      rows: [
        ['Public cloud', 'सबके लिए खुला, साझा बुनियादी ढाँचा', 'सबसे कम प्रवेश-लागत, उपयोग-आधारित', 'कम — प्रदाता के नियम', 'multi-tenancy, डेटा कहाँ रखा है यह जाँचें'],
        ['Private cloud', 'एक ही संस्था (अपने डेटा-सेंटर या होस्टेड)', 'अधिक — hardware व स्टाफ़', 'पूरा', 'scaling सीमित, कुशल स्टाफ़ चाहिए'],
        ['Community cloud', 'साझा हित वाले कई संस्थान (जैसे सभी ITI)', 'बँटकर कम', 'सामूहिक नीति', 'शासन व सहमति कठिन'],
        ['Hybrid cloud', 'निजी + सार्वजनिक, सुरंग से जुड़े', 'मध्यम', 'संवेदनशील डेटा निजी में, बाकी सार्वजनिक', 'दो वातावरण जोड़ना जटिल'],
        ['Multi-cloud', 'एक से अधिक प्रदाता एक साथ', 'प्रतिस्पर्धा से बचत संभव', 'बँटा हुआ', 'व्यवस्थापन व बिल जटिल; vendor lock-in कम']
      ] },

    { type: 'table',
      head: ['प्रदाता', 'पहचान', 'मुख्य सेवाएँ', 'भारतीय विद्यार्थी/लैब के लिए उपयोगी'],
      rows: [
        ['AWS (Amazon Web Services)', 'सबसे बड़ा, सबसे चौड़ी सूची', 'EC2, S3, RDS, Lambda, CloudFront', 'मुफ़्त tier (12 महीने), skill-builder प्रशिक्षण'],
        ['Microsoft Azure', 'Microsoft stack से गहरा एकीकरण', 'VM, App Service, Azure SQL, Functions, Entra ID', 'विद्यार्थी क्रेडिट, Windows/Active Directory लैब'],
        ['Google Cloud Platform', 'डेटा/AI/ML में मज़बूत', 'Compute Engine, Cloud Storage, BigQuery, Vertex AI', 'BigQuery sandbox, AI/ML सीखना'],
        ['Oracle Cloud (OCI)', 'डेटाबेस-केंद्रित, उदार मुफ़्त tier', 'Autonomous DB, Compute, Object Storage', 'स्थायी मुफ़्त ARM VM — प्रयोगशाला के लिए'],
        ['DigitalOcean / Linode / Vultr', 'सरल, predictable बिल', 'Droplets, managed DB, App Platform', 'छोटी वेबसाइट व API होस्टिंग'],
        ['Cloudflare', 'CDN, DNS, edge compute, सुरक्षा', 'Pages, Workers, R2, DNS, WAF', 'मुफ़्त static hosting + HTTPS + DDoS सुरक्षा'],
        ['Netlify / Vercel / GitHub Pages', 'frontend व static साइट के लिए', 'build + deploy + functions + preview', 'इस पोर्टल जैसी static साइट के लिए सबसे सरल'],
        ['Firebase / Supabase', 'BaaS — ऐप का पूरा backend', 'auth, realtime DB, storage, functions', 'छोटा ऐप बनाना सीखने के लिए']
      ] },

    { type: 'html', html: '<h3>1.2 क्लाउड स्टोरेज — sync, sharing और versioning</h3><p>क्लाउड स्टोरेज तीन काम करता है — <b>sync</b> (हर जुड़े उपकरण पर वही नवीनतम प्रति), <b>sharing</b> (लिंक या अनुमति से दूसरों को देना), और <b>version history</b> (पुराने संस्करण वापस लाना)। ध्यान रहे — <b>sync बैकअप नहीं है</b>। गलती से मिटाया तो हर जगह मिटता है; ransomware ने encrypt किया तो encrypted प्रति ही sync होती है। बचाव के लिए versioning व recycle bin चालू रखें और एक अलग offline प्रति भी रखें।</p>' },

    { type: 'table',
      head: ['सेवा', 'मुफ़्त जगह', 'खास बात', 'ध्यान रखने लायक'],
      rows: [
        ['Google Drive', '15 GB (Gmail + Photos साझा)', 'Docs/Sheets/Slides के साथ एकीकृत, अच्छी खोज', 'साझा कोटा — तस्वीरें भर गईं तो Drive रुकेगा'],
        ['OneDrive', '5 GB (M365 में 1 TB)', 'Windows में Files On-Demand, Office autosave', 'Known Folder Move चालू हो तो Desktop/Documents अपने-आप cloud में'],
        ['Dropbox', '2 GB', 'बहुत भरोसेमंद sync, version history, LAN sync', 'मुफ़्त जगह कम; bandwidth सीमाएँ'],
        ['iCloud Drive', '5 GB', 'Apple उपकरणों में सहज, Photos/Backup एकीकृत', 'Windows पर iCloud ऐप चाहिए; Android समर्थन सीमित'],
        ['MEGA / pCloud', '20 GB / 10 GB तक', 'client-side encryption का विकल्प', 'मुफ़्त योजना में transfer सीमा'],
        ['Nextcloud (स्वयं होस्ट)', 'आपकी डिस्क जितनी', 'पूरा नियंत्रण, डेटा बाहर नहीं', 'server, backup व सुरक्षा आपकी ज़िम्मेदारी']
      ] },

    { type: 'table',
      head: ['साझा-लिंक विकल्प', 'अर्थ', 'कब चुनें', 'जोखिम'],
      rows: [
        ['Anyone with the link — Viewer', 'जिसके पास लिंक है, केवल देखे', 'सार्वजनिक नोटिस, सामान्य सामग्री', 'लिंक आगे भेजा जा सकता है — वापस नहीं ले सकते'],
        ['Anyone with the link — Editor', 'जिसके पास लिंक है, बदल भी सके', 'केवल भरोसेमंद छोटी टीम', 'कोई भी सामग्री मिटा/बदल सकता है'],
        ['Specific people', 'नामित खातों को ही', 'मार्कशीट, वेतन, निजी दस्तावेज़', 'सही email पता जाँचें; गलत पते पर गया तो लीक'],
        ['Restricted / organisation only', 'केवल उसी संस्थान के खाते', 'आंतरिक नीति, परीक्षा-सामग्री', 'बाहरी सहयोगी नहीं खोल पाएगा'],
        ['Expiry + password', 'तारीख़ के बाद लिंक बेकार, पासवर्ड चाहिए', 'अस्थायी बाँटना', 'पासवर्ड अलग माध्यम से भेजें, उसी email में नहीं'],
        ['Download / print / copy बंद', 'केवल screen पर देखे', 'संवेदनशील सामग्री', 'स्क्रीनशॉट फिर भी संभव — पूरी रोक नहीं']
      ] },

    { type: 'callout', kind: 'danger', title: 'क्लाउड पर कभी न चढ़ाने वाली चीज़ें',
      html: 'पासवर्ड की सूची, <code>passwords.txt</code>, आधार/पैन की मूल प्रति, प्रश्नपत्र का उत्तर-कुंजी (answer key), किसी और की निजी तस्वीरें, संस्थान का गुप्त डेटाबेस, और अपने प्रोजेक्ट की <code>.env</code> फ़ाइल जिसमें API key हो। <b>API key कभी frontend कोड या public repository में न डालें</b> — वह तुरंत स्कैन कर ली जाती है और बिल आपके सिर आता है। संवेदनशील फ़ाइल चढ़ानी ही हो तो पहले encrypt करें (7-Zip AES-256 या VeraCrypt) और पासवर्ड अलग माध्यम से दें। साझा-लिंक बनाते समय डिफ़ॉल्ट "Anyone" को हमेशा "Specific people" में बदलें।' },

    { type: 'html', html: '<h3>1.3 क्लाउड पर वेबसाइट — static hosting, CDN व domain</h3><p>एक <b>static साइट</b> केवल HTML/CSS/JS फ़ाइलें हैं — उसे किसी server-side भाषा की ज़रूरत नहीं, इसलिए वह सस्ती/मुफ़्त होस्टिंग पर चलती है और बहुत तेज़ खुलती है। प्रवाह यह है — <b>कोड → build → deploy → CDN → domain + HTTPS</b>। CDN (Content Delivery Network) आपकी फ़ाइलों की प्रतियाँ दुनिया भर के किनारों (edge) पर रखता है, ताकि उपयोगकर्ता के सबसे नज़दीक से मिलें। इसी पोर्टल की तरह की साइट के लिए यही सबसे किफ़ायती रास्ता है।</p>' },

    { type: 'table',
      head: ['चरण', 'क्या होता है', 'औज़ार / अवधारणा', 'आम गलती'],
      rows: [
        ['Source', 'कोड repository में', 'Git + GitHub/GitLab', 'बड़ी binary फ़ाइलें repo में ठूँस देना'],
        ['Build', 'फ़ाइलें इकट्ठी/संकुचित होकर तैयार', 'build script, bundler, static generator', 'build फ़ोल्डर ही deploy न करना'],
        ['Deploy', 'तैयार फ़ाइलें होस्ट पर चढ़ना', 'Git से auto-deploy, CLI, drag-drop', 'गलत branch deploy कर देना'],
        ['CDN / Edge', 'दुनिया भर में प्रति, तेज़ वितरण', 'Cloudflare, Netlify Edge, CloudFront', 'cache की वजह से पुरानी फ़ाइल दिखना — hard refresh/cache purge'],
        ['Domain', 'नाम से पहुँच', 'DNS: A, AAAA, CNAME, MX, TXT', 'CNAME को root पर लगाना (वहाँ A/ALIAS चाहिए)'],
        ['HTTPS', 'TLS certificate, encrypted रास्ता', 'Let’s Encrypt / स्वचालित managed cert', 'mixed content — https पेज पर http संसाधन'],
        ['Functions / API', 'server-side छोटा कोड', 'serverless functions, env variables', 'secret को frontend में रखना'],
        ['Monitoring', 'traffic, error, गति', 'analytics, logs, uptime check', 'deploy के बाद जाँच ही न करना']
      ] },

    { type: 'code', code: '# ---------------- DNS रिकॉर्ड — क्या किसलिए ----------------\n# A      : नाम → IPv4            (example.com → 203.0.113.10)\n# AAAA   : नाम → IPv6\n# CNAME  : नाम → दूसरा नाम       (www → example.com, या होस्ट का लक्ष्य)\n# MX     : डाक किस server पर जाए\n# TXT    : सत्यापन व नीति (SPF, DKIM, DMARC, domain verification)\n# NS     : कौन-से name server इस zone के मालिक\n# TTL    : यह रिकॉर्ड कितनी देर cache में रहे (कम TTL = बदलाव जल्दी फैले)\n\n# ---------------- जाँच कमांड ----------------\nnslookup example.com\nnslookup -type=MX example.com\ndig example.com A +short            # Linux/macOS\ndig example.com TXT +short\nping example.com\ntracert example.com                 # Windows\ntraceroute example.com              # Linux\ncurl -I https://example.com         # केवल header — status, cache, server\n\n# ---------------- Git से deploy का सामान्य प्रवाह ----------------\ngit add index.html assets/\ngit commit -m "नया अध्याय जोड़ा"\ngit push origin main                # जुड़ी होस्ट अपने-आप build + deploy करेगी\n# स्थानीय build पहले परखें, फिर ही push करें' },

    { type: 'html', html: '<h3>1.4 Virtualization से Container से Serverless तक</h3><p>तीनों का उद्देश्य एक ही है — <b>संसाधन का कुशल उपयोग और सुसंगत वातावरण</b>। VM पूरा अतिथि OS चलाता है (भारी, अलग kernel)। Container मेज़बान का kernel साझा करता है और केवल ऐप + उसकी libraries pack करता है (हल्का, सेकंडों में शुरू)। Serverless में आप server देखते ही नहीं — केवल function लिखते हैं, प्रदाता उसे चलाता है और केवल चलने के मिलीसेकंड का बिल लेता है।</p>' },

    { type: 'table',
      head: ['पहलू', 'Virtual Machine', 'Container', 'Serverless Function'],
      rows: [
        ['इकाई', 'पूरा OS + ऐप', 'ऐप + libraries (image)', 'एक function / छोटा कोड'],
        ['Kernel', 'अपना अलग kernel', 'मेज़बान का kernel साझा', 'प्रदाता का, अदृश्य'],
        ['शुरुआत का समय', 'मिनट', 'सेकंड / मिलीसेकंड', 'मिलीसेकंड (cold start में अधिक)'],
        ['आकार', 'GB में', 'MB में', 'KB में कोड'],
        ['अलगाव (isolation)', 'सबसे मज़बूत', 'मध्यम (kernel साझा)', 'प्रदाता-नियंत्रित'],
        ['Scaling', 'हाथ से या autoscaling group', 'orchestrator (Kubernetes) से', 'अपने-आप, शून्य से हज़ारों तक'],
        ['बिल', 'चलते रहने का प्रति घंटा', 'चलते रहने का प्रति घंटा', 'प्रति invocation + अवधि'],
        ['कब चुनें', 'अलग OS, kernel-काम, मज़बूत अलगाव', 'एक ही ऐप हर जगह एक जैसा चलाना', 'छोटे, कभी-कभार चलने वाले काम, webhook, API'],
        ['सीमा', 'भारी, धीमा', 'अलग kernel नहीं; सुरक्षा-विन्यास ज़रूरी', 'cold start, अवधि-सीमा, vendor lock-in, state रखना कठिन']
      ] },

    { type: 'code', code: '# ---------------- Dockerfile : अपना image बनाना ----------------\nFROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]\n\n# ---------------- image व container ----------------\ndocker build -t lab-app:1.0 .\ndocker run -d --name lab -p 3000:3000 lab-app:1.0\ndocker logs -f lab\ndocker exec -it lab sh\ndocker stop lab && docker rm lab\n\n# ---------------- Docker Compose : कई सेवाएँ एक साथ ----------------\n# compose.yaml\n# services:\n#   web:\n#     build: .\n#     ports: ["3000:3000"]\n#   db:\n#     image: postgres:16\n#     environment:\n#       POSTGRES_PASSWORD: example\n#     volumes: ["dbdata:/var/lib/postgresql/data"]\n# volumes:\n#   dbdata:\ndocker compose up -d\ndocker compose ps\ndocker compose logs -f web\ndocker compose down            # रोककर हटाएँ (volume बचा रहता है)\n\n# ---------------- Kubernetes : केवल शब्दावली ----------------\n# Pod        = एक या अधिक container की सबसे छोटी इकाई\n# Deployment = कितनी प्रतियाँ चलें, अपडेट कैसे हो\n# Service    = स्थिर network नाम व load balancing\n# Ingress    = बाहर से आने वाला HTTP रास्ता\n# ConfigMap / Secret = विन्यास व गुप्त मान\nkubectl get pods ; kubectl get svc ; kubectl logs <pod>' },

    { type: 'html', html: '<h3>1.5 AI, ML, DL और GenAI — एक सीढ़ी, चार नाम</h3><p>ये चारों अलग-अलग चीज़ें नहीं, <b>एक के भीतर एक</b> हैं। <b>AI (Artificial Intelligence / कृत्रिम बुद्धिमत्ता)</b> सबसे बड़ा घेरा है — मशीन से ऐसा काम कराना जो बुद्धि माँगता हो। <b>ML (Machine Learning / यंत्र अधिगम)</b> उसका उपसमुच्चय है — स्पष्ट नियम लिखने के बजाय डेटा से पैटर्न सीखना। <b>DL (Deep Learning / गहन अधिगम)</b> ML का उपसमुच्चय है — बहुत परतों वाली neural network से। <b>GenAI (Generative AI / जननात्मक AI)</b> DL का वह रूप है जो नई सामग्री (पाठ, तस्वीर, ऑडियो, कोड) बनाता है।</p>' },

    { type: 'kv', items: [
      { label: 'AI', value: 'सबसे बड़ा घेरा', desc: 'नियम-आधारित expert system से लेकर सीखने वाली मशीन तक — सब AI', kind: 'info' },
      { label: 'ML', value: 'डेटा से सीखना', desc: 'spam फ़िल्टर, सिफ़ारिश, मूल्य-पूर्वानुमान, अंक-विश्लेषण', kind: 'info' },
      { label: 'DL', value: 'गहरी neural network', desc: 'तस्वीर/आवाज़ पहचान, भाषा अनुवाद, self-driving', kind: 'info' },
      { label: 'GenAI / LLM', value: 'नई सामग्री बनाना', desc: 'ChatGPT, Claude, Gemini — पाठ; Midjourney/DALL·E — तस्वीर', kind: 'ok' },
      { label: 'ANI (Narrow AI)', value: 'आज का सच', desc: 'एक ही काम में निपुण — शतरंज खेलने वाला AI गाना नहीं गा सकता', kind: 'warn' },
      { label: 'AGI (General AI)', value: 'अभी नहीं', desc: 'मनुष्य जैसी हर क्षेत्र की समझ — शोध का विषय, उत्पाद नहीं', kind: 'warn' }
    ] },

    { type: 'table',
      head: ['सीखने का प्रकार', 'डेटा कैसा', 'क्या सीखता है', 'उदाहरण', 'एल्गोरिद्म'],
      rows: [
        ['Supervised (पर्यवेक्षित)', 'लेबल के साथ (input → सही output)', 'पहले से बताए उत्तर का पैटर्न', 'spam/हैम्प्लेट, अंक से पास/फेल, तस्वीर में बिल्ली', 'Linear/Logistic Regression, Decision Tree, Random Forest, SVM, Neural Net'],
        ['Unsupervised (अपर्यवेक्षित)', 'बिना लेबल', 'छिपा समूह व संरचना', 'ग्राहक-समूह बाँटना, विसंगति पकड़ना', 'K-Means, Hierarchical clustering, PCA, DBSCAN'],
        ['Semi-supervised', 'थोड़ा लेबल + बहुत बिना लेबल', 'कम लेबल से अधिक सीखना', 'चिकित्सा तस्वीरें (लेबल महँगा)', 'self-training, label propagation'],
        ['Self-supervised', 'बिना लेबल, स्वयं बनाया कार्य', 'डेटा के भीतर से संकेत', 'LLM का pretraining — अगला token पूर्वानुमान', 'masked language modelling, contrastive learning'],
        ['Reinforcement (पुनर्बलन)', 'पुरस्कार/दंड का संकेत', 'प्रयास-त्रुटि से सर्वोत्तम नीति', 'खेल, रोबोट चाल, सिफ़ारिश क्रम', 'Q-Learning, Deep Q-Network, PPO'],
        ['Transfer learning', 'पहले से प्रशिक्षित मॉडल', 'पुराना ज्ञान नए काम में लगाना', 'बड़े मॉडल को अपने छोटे डेटा पर fine-tune करना', 'fine-tuning, LoRA, adapters']
      ] },

    { type: 'table',
      head: ['शब्द', 'पूरा नाम / अर्थ', 'एक पंक्ति में'],
      rows: [
        ['Neural Network', 'कृत्रिम तंत्रिका जाल', 'न्यूरॉन की परतें; हर जोड़ का भार (weight) सीखा जाता है'],
        ['Training', 'प्रशिक्षण', 'डेटा दिखाकर भार ठीक करना; भारी GPU व समय लगता है'],
        ['Inference', 'अनुमान / चलाना', 'प्रशिक्षित मॉडल से नए input का उत्तर निकालना'],
        ['Model / Weights', 'मॉडल / भार', 'सीखा हुआ ज्ञान संख्याओं के रूप में सहेजा गया फ़ाइल-रूप'],
        ['Dataset / Label', 'डेटासेट / लेबल', 'उदाहरणों का संग्रह; लेबल = सही उत्तर'],
        ['Overfitting', 'अति-फिटिंग', 'प्रशिक्षण डेटा रट लिया, नए डेटा पर फेल — रटना बनाम समझना'],
        ['Underfitting', 'अल्प-फिटिंग', 'मॉडल इतना सरल कि पैटर्न ही न पकड़े'],
        ['Bias (पूर्वाग्रह)', 'डेटा/मॉडल का पक्षपात', 'डेटा जैसा होगा, उत्तर वैसा ही पक्षपाती आएगा'],
        ['Hallucination', 'मतिभ्रम / गढ़ंत', 'मॉडल आत्मविश्वास से गलत या काल्पनिक तथ्य बोल दे'],
        ['Token', 'इकाई', 'शब्द का टुकड़ा; मॉडल token गिनकर सोचता व बिल करता है'],
        ['Context window', 'संदर्भ-खिड़की', 'एक बार में कितने token याद रख सकता है'],
        ['Temperature', 'तापमान (यादृच्छिकता)', 'कम = निश्चित व दोहराव; अधिक = रचनात्मक व जोखिम'],
        ['Fine-tuning', 'सूक्ष्म-समायोजन', 'पहले से प्रशिक्षित मॉडल को अपने डेटा पर आगे प्रशिक्षित करना'],
        ['RAG', 'Retrieval-Augmented Generation', 'उत्तर से पहले अपने दस्तावेज़ खोजकर उन्हें संदर्भ में देना'],
        ['Embedding / Vector DB', 'सदिश-रूप / सदिश डेटाबेस', 'पाठ को संख्या-सदिश में बदलकर अर्थ-आधारित खोज'],
        ['Multimodal', 'बहु-विधा', 'पाठ + तस्वीर + ऑडियो + वीडियो एक साथ समझना/बनाना'],
        ['GPU / TPU / NPU', 'Graphics / Tensor / Neural Processing Unit', 'समानांतर गणना के विशेष चिप — प्रशिक्षण व inference की रीढ़']
      ] },

    { type: 'html', html: '<h3>1.6 LLM असल में करता क्या है</h3><p>एक <b>LLM (Large Language Model / विशाल भाषा मॉडल)</b> बहुत सारे पाठ पर प्रशिक्षित एक विशाल neural network है। इसका मूल काम केवल एक है — <b>दिए गए संदर्भ के बाद अगला token सबसे उपयुक्त चुनना</b>। यही काम बार-बार दोहराकर वह पूरा वाक्य, अनुच्छेद, कोड या उत्तर बनाता है। वह डेटाबेस से तथ्य "देखकर" नहीं लाता; उसने पैटर्न सीखे हैं, इसलिए कभी-कभी बहुत विश्वास से गलत बात कह देता है — यही <b>hallucination</b> है।</p>' },

    { type: 'steps', title: 'LLM का जीवन-चक्र — पाँच पड़ाव',
      items: [
        { n: '1', title: 'डेटा जुटाना व साफ़ करना', text: 'वेब, पुस्तकें, कोड, लेख — बहुत बड़ा पाठ-संग्रह। अशुद्धि, दोहराव, निजी डेटा व विषैली सामग्री छाँटी जाती है।', tips: ['डेटा की गुणवत्ता ही मॉडल की गुणवत्ता तय करती है — "कचरा अंदर, कचरा बाहर"'] },
        { n: '2', title: 'Pretraining (पूर्व-प्रशिक्षण)', text: 'अरबों token पर "अगला token क्या होगा" सीखता है। यही सबसे महँगा चरण है — हज़ारों GPU, हफ़्तों-महीनों।', tips: ['यहाँ भाषा, तर्क-पैटर्न व सामान्य ज्ञान आता है'] },
        { n: '3', title: 'Fine-tuning / Instruction tuning', text: 'निर्देश-उत्तर जोड़ों पर सिखाया जाता है कि प्रश्न का सहायक उत्तर कैसे दें।', tips: ['SFT = Supervised Fine-Tuning'] },
        { n: '4', title: 'Alignment (संरेखण)', text: 'मानव-पसंद के उत्तरों से तुलना करके सिखाना कि कौन-सा उत्तर सुरक्षित व उपयोगी है।', tips: ['RLHF = Reinforcement Learning from Human Feedback', 'यहीं मॉडल "विनम्र पर कभी-कभी अति-सतर्क" बनता है'] },
        { n: '5', title: 'Inference (चलाना)', text: 'आपका prompt संदर्भ बनता है; मॉडल एक-एक token चुनकर उत्तर बनाता है।', tips: ['temperature/top-p से यादृच्छिकता नियंत्रित होती है', 'context window से तय होता है कि कितना पुराना संदर्भ याद रहे'] }
      ] },

    { type: 'callout', kind: 'warn', title: 'LLM की पाँच व्यावहारिक सीमाएँ',
      html: '(1) <b>Hallucination</b> — नकली उद्धरण, नकली आँकड़े, नकली कमांड-फ़्लैग बहुत विश्वास से दे सकता है। (2) <b>ज्ञान की कटौती-तारीख़ (knowledge cutoff)</b> — प्रशिक्षण के बाद की घटनाएँ नहीं जानता; browsing/tool चालू हो तब जाकर देख सकता है। (3) <b>गणित व तर्क</b> — बड़ी संख्याओं की गणना में चूक; कोड चलाकर जाँचें। (4) <b>Context सीमा</b> — बहुत लंबी बातचीत में शुरू की बात भूल सकता है। (5) <b>स्रोत नहीं बताता</b> — जो तथ्य महत्वपूर्ण है उसे मूल स्रोत से स्वयं मिलाएँ। परीक्षा-कार्य में AI का उत्तर <b>अंतिम प्रमाण नहीं, कच्चा मसौदा</b> है।' },

    { type: 'html', html: '<h3>1.7 Prompt Engineering — सही प्रश्न, सही उत्तर</h3><p><b>Prompt</b> = मॉडल को दिया गया निर्देश व संदर्भ। मॉडल वही देता है जो आपने माँगा — इसलिए अस्पष्ट प्रश्न का अस्पष्ट उत्तर मिलता है। अच्छे prompt के छह तत्व हैं — <b>भूमिका (role), कार्य (task), संदर्भ (context), प्रारूप (format), सीमाएँ (constraints), उदाहरण (example)</b>। नीचे की तालिका दस तकनीकें देती है; हर तकनीक का असर नापने के लिए एक ही प्रश्न दो रूपों में पूछकर उत्तरों की तुलना करें।</p>' },

    { type: 'table',
      head: ['तकनीक', 'क्या करें', 'छोटा उदाहरण', 'कब उपयोगी'],
      rows: [
        ['भूमिका देना (Role)', 'मॉडल को विशेषज्ञ की भूमिका दें', '"तुम ITI के कंप्यूटर अनुदेशक हो…"', 'विषय-विशिष्ट शब्दावली व स्तर चाहिए'],
        ['कार्य स्पष्ट (Task)', 'एक ही वाक्य में ठीक-ठीक काम बताएँ', '"नीचे दिए अनुच्छेद के 5 मुख्य बिंदु निकालो"', 'लगभग हर बार'],
        ['संदर्भ देना (Context)', 'कक्षा, स्तर, उद्देश्य, पाठक बताएँ', '"पाठक प्रथम वर्ष के ITI विद्यार्थी हैं"', 'उत्तर की गहराई सही रखने के लिए'],
        ['प्रारूप तय (Format)', 'तालिका/सूची/JSON/शब्द-सीमा बताएँ', '"उत्तर 6 पंक्तियों की तालिका में दो"', 'सीधे उपयोग करने लायक उत्तर'],
        ['सीमाएँ (Constraints)', 'क्या नहीं करना है, यह भी बताएँ', '"तकनीकी शब्दों का हिंदी अर्थ कोष्ठक में दो; अनुमान न लगाओ"', 'भटकाव रोकने के लिए'],
        ['उदाहरण (Few-shot)', 'एक-दो नमूना उत्तर पहले दिखाएँ', '"जैसे: प्रश्न → उत्तर शैली में…"', 'शैली व ढाँचा ठीक कराने के लिए'],
        ['चरणबद्ध सोच (Step-by-step)', 'पहले योजना, फिर उत्तर माँगें', '"पहले हल के चरण लिखो, फिर अंतिम उत्तर"', 'गणित, तर्क, कोड'],
        ['विभाजन (Decomposition)', 'बड़े काम को छोटे प्रश्नों में तोड़ें', 'पहले रूपरेखा → फिर हर भाग अलग', 'लंबा निबंध/प्रोजेक्ट'],
        ['स्रोत माँगना + RAG', 'अपना दस्तावेज़ देकर उसी से उत्तर माँगें', '"केवल नीचे दिए पाठ के आधार पर उत्तर दो; न मिले तो कहो — नहीं मिला"', 'तथ्य-शुद्धता व कम hallucination'],
        ['पुनरावृत्ति (Iterate)', 'पहले उत्तर पर सुधार माँगें', '"यह बहुत लंबा है — आधा करो और सरल शब्द रखो"', 'लगभग हर बार; पहला उत्तर अंतिम नहीं']
      ] },

    { type: 'code', code: '# ---------------- कमज़ोर prompt ----------------\n"कंप्यूटर के बारे में बताओ"\n\n# ---------------- उसी का बेहतर रूप ----------------\nभूमिका : तुम ITI के प्रथम वर्ष के कंप्यूटर अनुदेशक हो।\nकार्य   : "इनपुट और आउटपुट उपकरण" पर कक्षा-नोट्स बनाओ।\nसंदर्भ  : विद्यार्थी हिंदी माध्यम के हैं; तकनीकी शब्द पहली बार आने पर\n          कोष्ठक में अंग्रेज़ी भी लिखो।\nप्रारूप  : (1) परिभाषा 2 पंक्ति, (2) 8 उपकरणों की तालिका\n          [नाम | प्रकार | काम | उदाहरण], (3) 5 बहुविकल्पीय प्रश्न उत्तर सहित।\nसीमाएँ  : कुल 400 शब्द; कोई अनुमानित आँकड़ा नहीं; कठिन शब्दों से बचो।\n\n# ---------------- कोड के लिए ----------------\n"Python में एक function लिखो जो CSV पढ़कर हर विद्यार्थी के औसत अंक\n निकाले। शर्तें: केवल standard library, खाली पंक्ति छूटे, अंक न होने पर\n 0 गिने, और अंत में 3 पंक्ति का उपयोग-उदाहरण दो। पहले संक्षिप्त योजना\n लिखो, फिर कोड।"\n\n# ---------------- तथ्य-जाँच के लिए ----------------\n"केवल नीचे दिए पाठ के आधार पर उत्तर दो। जो बात पाठ में नहीं है,\n उसके लिए स्पष्ट लिखो — \'पाठ में नहीं मिला\'। अनुमान मत लगाओ।\n पाठ: <<<यहाँ अपना अनुच्छेद चिपकाएँ>>>"\n\n# ---------------- सुधार माँगना ----------------\n"यह उत्तर बहुत लंबा है। आधा करो, वही तालिका-प्रारूप रखो,\n और हर तकनीकी शब्द के बाद कोष्ठक में उसका पूरा नाम (full form) जोड़ो।"' },

    { type: 'callout', kind: 'tip', title: 'AI से पढ़ाई — सही तरीका',
      html: 'AI को <b>उत्तर-मशीन</b> न बनाएँ, <b>अभ्यास-साथी</b> बनाएँ। अच्छे उपयोग — (1) कठिन अनुच्छेद को सरल भाषा में समझाओ, (2) अपने नोट्स से 20 प्रश्न बनवाओ और स्वयं हल करो, (3) अपनी लिखी उत्तर-पुस्तिका की जाँच करवाओ, (4) कोड की त्रुटि समझाओ (उत्तर नहीं, कारण माँगो), (5) किसी अवधारणा के तीन अलग उदाहरण माँगो, (6) अपनी गलती का पैटर्न बताओ। बुरे उपयोग — पूरा असाइनमेंट लिखवाकर जमा कर देना, परीक्षा में नकल, और बिना जाँचे तथ्य मान लेना। <b>याद रखें: जो आप स्वयं समझा नहीं सकते, वह आपका ज्ञान नहीं है।</b>' },

    { type: 'table',
      head: ['श्रेणी', 'औज़ार', 'क्या करता है', 'मुफ़्त सीमा / ध्यान'],
      rows: [
        ['सामान्य संवाद / लेखन', 'ChatGPT, Claude, Gemini, Copilot, Perplexity', 'प्रश्नोत्तर, लेखन, सारांश, अनुवाद, तर्क', 'मुफ़्त योजना में दर/संदर्भ सीमा; स्रोत-जाँच स्वयं करें'],
        ['कोड सहायक', 'GitHub Copilot, Cursor, Codeium, Tabnine', 'कोड पूरा करना, समझाना, refactor, test', 'उत्पादित कोड चलाकर व पढ़कर ही स्वीकारें'],
        ['तस्वीर बनाना', 'Midjourney, DALL·E, Stable Diffusion, Ideogram', 'पाठ से तस्वीर, शैली-रूपांतरण', 'चेहरे/लोगो/कॉपीराइट सामग्री के अधिकार जाँचें'],
        ['तस्वीर संपादन', 'Photoshop (Firefly), Canva, GIMP + प्लगइन', 'background हटाना, upscale, retouch', 'मूल तस्वीर सुरक्षित रखें'],
        ['ऑडियो / आवाज़', 'ElevenLabs, Whisper, Audacity + AI', 'पाठ→आवाज़, आवाज़→पाठ, transcription', 'किसी की आवाज़ की नकल उसकी अनुमति के बिना न करें'],
        ['वीडियो', 'Runway, Pika, CapCut, Descript', 'clip बनाना, संपादन, subtitle', 'deepfake व गलत सूचना से बचें'],
        ['प्रस्तुति / दस्तावेज़', 'Gamma, Canva, Beautiful.ai, Notion AI', 'slide रूपरेखा, नोट्स, सारांश', 'तथ्य व आँकड़े स्वयं मिलाएँ'],
        ['खोज व शोध', 'Perplexity, Elicit, Consensus, NotebookLM', 'स्रोत-सहित उत्तर, अपने दस्तावेज़ पर प्रश्नोत्तर', 'उद्धरण खोलकर जाँचें — नकली संदर्भ भी आते हैं'],
        ['अनुवाद / भाषा', 'Google Translate, DeepL, भाषा-मॉडल', 'अनुवाद, सरलीकरण, व्याकरण', 'पारिभाषिक शब्दों का स्थानीय प्रचलन मिलाएँ'],
        ['स्थानीय / खुला मॉडल', 'Ollama, LM Studio, llama.cpp', 'अपनी मशीन पर मॉडल चलाना — डेटा बाहर नहीं', 'RAM/GPU चाहिए; छोटे मॉडल कमज़ोर होते हैं']
      ] },

    { type: 'steps', title: 'AI के उत्तर को सत्यापित करना — छह कदम',
      items: [
        { n: '1', title: 'दावे अलग करें', text: 'उत्तर में से हर तथ्यात्मक दावा (नाम, तारीख़, आँकड़ा, कमांड, फ़्लैग, उद्धरण) अलग सूची में लिखें।', tips: ['जो दावा जाँचा नहीं जा सकता, उसे हटा दें'] },
        { n: '2', title: 'मूल स्रोत खोलें', text: 'दिया गया लिंक/संदर्भ सचमुच खोलकर पढ़ें। नकली उद्धरण व बंद लिंक आम हैं।', tips: ['सरकारी/आधिकारिक दस्तावेज़ सबसे भरोसेमंद'] },
        { n: '3', title: 'दूसरे स्वतंत्र स्रोत से मिलाएँ', text: 'वही तथ्य दो अलग भरोसेमंद जगहों पर मिलाएँ; केवल AI के दूसरे उत्तर को दूसरा स्रोत न मानें।', tips: ['एक ही मॉडल से दोबारा पूछना स्वतंत्र पुष्टि नहीं है'] },
        { n: '4', title: 'कोड/कमांड चलाकर देखें', text: 'सुझाई कमांड या कोड पहले सुरक्षित वातावरण (VM/sandbox) में चलाएँ; --help से फ़्लैग जाँचें।', warn: 'AI की बताई rm/delete/format कमांड बिना समझे कभी न चलाएँ।' },
        { n: '5', title: 'गणना स्वयं करें', text: 'अंक, प्रतिशत, इकाई-रूपांतरण calculator या spreadsheet से दोबारा निकालें।', tips: ['इकाई व दशमलव की चूक सबसे आम है'] },
        { n: '6', title: 'अपने शब्दों में लिखें', text: 'सत्यापित सामग्री को अपनी भाषा में दोबारा लिखें — तभी वह आपकी समझ बनेगी और कॉपीराइट/नकल का दोष भी नहीं रहेगा।', tips: ['जहाँ AI की मदद ली, वहाँ संस्थान की नीति के अनुसार स्वीकारोक्ति (acknowledgement) दें'] }
      ] },

    { type: 'callout', kind: 'danger', title: 'AI के छह गंभीर जोखिम',
      html: '(1) <b>निजता</b> — prompt में डाला डेटा प्रशिक्षण/लॉग में जा सकता है; पासवर्ड, आधार, चिकित्सा-रिकॉर्ड, प्रश्नपत्र की उत्तर-कुंजी, संस्थान का गुप्त डेटा कभी न डालें। (2) <b>Hallucination</b> — गढ़ा हुआ तथ्य, उद्धरण या कमांड। (3) <b>पूर्वाग्रह (bias)</b> — डेटा का पक्षपात उत्तर में आता है; जाति/लिंग/क्षेत्र के बारे में संवेदनशील रहें। (4) <b>Deepfake</b> — नकली आवाज़/वीडियो से धोखा; "तुरंत पैसे भेजो" वाली कॉल पर हमेशा दूसरे माध्यम से पुष्टि करें। (5) <b>कॉपीराइट व शैक्षणिक ईमानदारी</b> — पूरा काम AI से लिखवाकर अपना बताना नकल है; संस्थान की नीति पढ़ें। (6) <b>स्वचालित निर्णय</b> — अंक, चयन या अनुशासन का अंतिम निर्णय मशीन पर न छोड़ें; मानव-समीक्षा अनिवार्य रखें।' },

    { type: 'table',
      head: ['करें (Do)', 'न करें (Don’t)'],
      rows: [
        ['AI को समझाने व अभ्यास कराने में लगाएँ', 'पूरा असाइनमेंट लिखवाकर जमा न करें'],
        ['तथ्य मूल स्रोत से मिलाएँ', 'बिना जाँचे आँकड़ा/उद्धरण उद्धृत न करें'],
        ['सुझाया कोड चलाकर व पढ़कर स्वीकारें', 'अज्ञात कमांड सीधे मुख्य मशीन पर न चलाएँ'],
        ['निजी डेटा हटाकर ही prompt बनाएँ', 'पासवर्ड, API key, आधार, उत्तर-कुंजी न चिपकाएँ'],
        ['AI-सहायता की स्वीकारोक्ति दें (नीति अनुसार)', 'AI के काम को अपना मौलिक काम न बताएँ'],
        ['स्थानीय/खुला मॉडल चुनें यदि डेटा संवेदनशील हो', 'संवेदनशील दस्तावेज़ किसी अनजान सेवा पर न चढ़ाएँ'],
        ['उत्तर की भाषा व स्तर अपने पाठक के अनुसार माँगें', 'एक ही prompt से अंतिम उत्तर मानकर न रुकें'],
        ['संदेह हो तो अनुदेशक से पूछें', 'परीक्षा/मूल्यांकन में AI का गुप्त उपयोग न करें']
      ] },

    { type: 'html', html: '<h3>1.8 IoT — इंटरनेट से जुड़ी चीज़ें</h3><p><b>IoT (Internet of Things / वस्तुओं का इंटरनेट)</b> = रोज़मर्रा की भौतिक चीज़ों में sensor, processor व network जोड़कर उन्हें डेटा भेजने और दूर से नियंत्रित होने योग्य बनाना। एक IoT उपकरण के चार हिस्से होते हैं — <b>संवेदन/पहचान</b> (sensor, RFID), <b>प्रसंस्करण</b> (microcontroller/SoC), <b>संचार</b> (Wi-Fi/BLE/LoRa/MQTT), और <b>अनुप्रयोग</b> (dashboard, automation, विश्लेषण)। लैब के लिए सबसे सस्ता प्रवेश-बिंदु Arduino/ESP32/Raspberry Pi है।</p>' },

    { type: 'table',
      head: ['परत', 'काम', 'उदाहरण घटक', 'चुनौती'],
      rows: [
        ['1 — Perception (संवेदन)', 'भौतिक दुनिया से डेटा लेना / क्रिया करना', 'तापमान, आर्द्रता, प्रकाश, गैस, motion sensor; relay, motor, LED', 'कम बिजली, अंशांकन (calibration), शोर'],
        ['2 — Network (संचार)', 'डेटा को भेजना', 'Wi-Fi, BLE, Zigbee, LoRaWAN, NB-IoT, 5G, Ethernet', 'दूरी बनाम bandwidth बनाम बैटरी जीवन'],
        ['3 — Middleware / Edge', 'छानना, जोड़ना, स्थानीय निर्णय', 'gateway, edge server, MQTT broker, नियम-इंजन', 'विलंब (latency), डेटा-मात्रा, सुरक्षा'],
        ['4 — Application', 'उपयोगकर्ता को अर्थ देना', 'dashboard, mobile ऐप, automation, analytics, AI', 'निजता, पहुँच-नियंत्रण, विश्वसनीयता']
      ] },

    { type: 'table',
      head: ['प्रोटोकॉल / तकनीक', 'दूरी', 'गति', 'बिजली', 'कहाँ उपयुक्त'],
      rows: [
        ['Wi-Fi (2.4/5 GHz)', 'घर/कमरा', 'उच्च (Mbps–Gbps)', 'अधिक', 'कैमरा, स्मार्ट स्पीकर, घरेलू उपकरण'],
        ['Bluetooth Low Energy (BLE)', 'कुछ मीटर', 'मध्यम', 'बहुत कम', 'wearable, beacon, फ़ोन से जोड़'],
        ['Zigbee / Z-Wave', 'घर (mesh से बढ़े)', 'कम', 'बहुत कम', 'स्मार्ट बल्ब, ताला, sensor जाल'],
        ['LoRaWAN', 'कई किमी', 'बहुत कम (bytes)', 'बहुत कम', 'खेत, मीटर, दूरस्थ sensor'],
        ['NB-IoT / LTE-M', 'सेलुलर क्षेत्र', 'कम', 'कम', 'स्मार्ट मीटर, ट्रैकिंग, शहर-सेवाएँ'],
        ['MQTT', 'जहाँ तक IP पहुँचे', 'हल्का publish/subscribe', 'कम', 'sensor → broker → dashboard; IoT का मानक'],
        ['CoAP', 'IP network', 'बहुत हल्का (UDP)', 'बहुत कम', 'अत्यंत सीमित उपकरण, REST जैसा'],
        ['HTTP/HTTPS + REST', 'जहाँ तक IP पहुँचे', 'अधिक भारी header', 'अधिक', 'कभी-कभार भेजने वाले उपकरण, API'],
        ['Modbus / RS-485', 'तार से सैकड़ों मीटर', 'कम', 'कम', 'औद्योगिक मशीन, PLC, मीटर'],
        ['RFID / NFC', 'सेमी से कुछ मीटर', 'बहुत कम', 'शून्य (passive tag)', 'पहचान-पत्र, उपस्थिति, भुगतान, पुस्तकालय']
      ] },

    { type: 'code', code: '# ---------------- MQTT : सबसे आम IoT प्रोटोकॉल ----------------\n# Broker (जैसे Mosquitto) सबका डाकघर है; प्रकाशक भेजता है, ग्राहक लेता है\nsudo apt install mosquitto mosquitto-clients\n\n# एक terminal में ग्राहक (subscriber)\nmosquitto_sub -h localhost -t "lab/room1/temperature" -v\n\n# दूसरे terminal में प्रकाशक (publisher)\nmosquitto_pub -h localhost -t "lab/room1/temperature" -m "27.5"\n\n# topic की सीढ़ी (hierarchy) — wildcard से सब एक साथ\nmosquitto_sub -h localhost -t "lab/+/temperature" -v   # + = एक स्तर\nmosquitto_sub -h localhost -t "lab/#" -v               # # = सब नीचे के स्तर\n\n# सुरक्षित रूप (TLS + उपयोगकर्ता)\nmosquitto_sub -h broker.example.com -p 8883 --cafile ca.crt \\\n  -u student -P गुप्तपास -t "lab/#"\n\n# ---------------- ESP32 / Arduino : पहला sensor ----------------\n# DHT22 से तापमान-आर्द्रता पढ़कर हर 10 सेकंड MQTT पर भेजना\n# (लाइब्रेरी: WiFi.h, PubSubClient.h, DHT.h)\n# loop() में:  float t = dht.readTemperature();\n#              char buf[16]; dtostrf(t, 4, 1, buf);\n#              client.publish("lab/room1/temperature", buf);\n#              delay(10000);\n\n# ---------------- Raspberry Pi : तैयार Linux मशीन ----------------\nuname -a ; pinout ; vcgencmd measure_temp\npython3 -m pip install paho-mqtt gpiozero\n# gpiozero से LED:  from gpiozero import LED; led = LED(17); led.on()' },

    { type: 'callout', kind: 'danger', title: 'IoT सुरक्षा — सबसे कमज़ोर कड़ी',
      html: 'बहुत से IoT उपकरण <b>डिफ़ॉल्ट पासवर्ड</b> (admin/admin) के साथ आते हैं, अपडेट कभी नहीं मिलते, और उनका traffic encrypted नहीं होता। यही कारण है कि लाखों कैमरे व router मिलकर <b>botnet</b> बनाकर बड़े हमले करते हैं। अनिवार्य नियम — (1) पहली बार चालू करते ही डिफ़ॉल्ट पासवर्ड बदलें, (2) firmware अपडेट चालू रखें, (3) IoT उपकरणों को अलग VLAN/guest network में रखें, मुख्य लैब-नेटवर्क से अलग, (4) इंटरनेट से सीधे पहुँच (port forwarding) न खोलें — cloud/VPN के रास्ते जाएँ, (5) अनावश्यक सेवाएँ (Telnet, UPnP) बंद करें, (6) कैमरा/माइक वाले उपकरण संवेदनशील स्थान पर न लगाएँ।' },

    { type: 'html', html: '<h3>1.9 Blockchain — भरोसे की बही-खाता तकनीक</h3><p><b>Blockchain</b> एक साझा, केवल-जोड़ने योग्य (append-only) डिजिटल बही है जिसकी प्रतियाँ कई कंप्यूटरों पर रहती हैं। हर <b>block</b> में लेन-देन का समूह, समय-मुहर और <b>पिछले block का hash</b> होता है। hash बदलते ही पूरी शृंखला टूट जाती है, इसलिए पुराना रिकॉर्ड चुपचाप बदलना व्यावहारिक रूप से असंभव है। नया block जोड़ने की सहमति <b>consensus mechanism</b> तय करता है। Bitcoin इसका पहला उपयोग है; पर तकनीक आपूर्ति-शृंखला, भूमि-रिकॉर्ड, प्रमाणपत्र-सत्यापन और पहचान में भी लगती है।</p>' },

    { type: 'table',
      head: ['शब्द', 'अर्थ', 'एक पंक्ति में'],
      rows: [
        ['Block', 'खंड', 'लेन-देन का समूह + समय + पिछले block का hash'],
        ['Hash', 'cryptographic fingerprint (जैसे SHA-256)', 'डेटा बदला तो hash पूरी तरह बदल जाता है'],
        ['Node', 'जाल का कंप्यूटर', 'बही की प्रति रखता व सत्यापित करता है'],
        ['Consensus', 'सहमति-विधि', 'कौन-सा block वैध है, यह तय करने का नियम'],
        ['PoW (Proof of Work)', 'कार्य-प्रमाण', 'कठिन पहेली हल करके block जोड़ना; बहुत बिजली (Bitcoin)'],
        ['PoS (Proof of Stake)', 'हिस्सेदारी-प्रमाण', 'जिसकी जितनी हिस्सेदारी, उतना अवसर; कम बिजली (Ethereum)'],
        ['Smart Contract', 'स्वचालित अनुबंध', 'शर्त पूरी होते ही स्वयं चलने वाला कोड (Ethereum/Solidity)'],
        ['Wallet / Key', 'बटुआ / कुंजी', 'private key = मालिकाना हक़; खोई तो स्थायी रूप से गया'],
        ['Public / Private chain', 'खुला / निजी शृंखला', 'कोई भी जुड़े बनाम केवल अनुमति-प्राप्त सदस्य'],
        ['DApp / DeFi / NFT', 'विकेंद्री ऐप / वित्त / अद्वितीय टोकन', 'blockchain पर बने अनुप्रयोग व अद्वितीय डिजिटल वस्तु']
      ] },

    { type: 'callout', kind: 'warn', title: 'blockchain बनाम साधारण डेटाबेस — कब सचमुच चाहिए?',
      html: 'यदि कई पक्ष हैं जो एक-दूसरे पर भरोसा नहीं करते और कोई एक साझा स्वामी नहीं चाहते, तब blockchain उपयोगी है। यदि एक ही संस्थान का डेटा है और एक भरोसेमंद admin है, तो <b>साधारण डेटाबेस तेज़, सस्ता और सरल है</b> — blockchain वहाँ अनावश्यक जटिलता है। दूसरी सावधानी: <b>क्रिप्टो-निवेश जोखिमपूर्ण है</b>; "निश्चित लाभ", "डबल पैसा" और अनजान टोकन प्रायः धोखा होते हैं। शैक्षणिक दृष्टि से तकनीक समझें — सट्टेबाजी न करें। private key कभी किसी को न दें, न किसी वेबसाइट पर डालें।' },

    { type: 'html', html: '<h3>1.10 AR, VR, MR और XR</h3><p>ये सब <b>अनुभव की परतें</b> हैं। <b>VR (Virtual Reality / आभासी वास्तविकता)</b> आपको पूरी तरह नकली दुनिया में ले जाता है — असली दिखना बंद। <b>AR (Augmented Reality / संवर्धित वास्तविकता)</b> असली दृश्य पर डिजिटल परत जोड़ता है — जैसे फ़ोन के कैमरे में फ़र्नीचर रखकर देखना। <b>MR (Mixed Reality / मिश्रित वास्तविकता)</b> में डिजिटल वस्तु असली दुनिया से क्रिया करती है — आभासी गेंद असली मेज़ से टकराती है। <b>XR (Extended Reality)</b> इन सबका छाता-शब्द है। इस लैब का <b>3D viewer</b> AR/VR नहीं, ब्राउज़र में घूमने वाला 3D मॉडल है — पर वही अवधारणाएँ (mesh, texture, camera, lighting) आगे काम आती हैं।</p>' },

    { type: 'table',
      head: ['तकनीक', 'क्या दिखता है', 'उपकरण', 'शिक्षा/लैब में उपयोग'],
      rows: [
        ['VR', 'पूरी आभासी दुनिया', 'headset (Meta Quest, Vive), controller', 'सुरक्षित अभ्यास — वेल्डिंग, ऊँचाई, सर्जरी, मशीन-संचालन'],
        ['AR', 'असली + डिजिटल परत', 'फ़ोन/टैबलेट कैमरा, AR चश्मा', 'पुस्तक पर 3D मॉडल, उपकरण के पुर्ज़ों पर लेबल, माप-सहायता'],
        ['MR', 'आभासी वस्तु असली से क्रिया करे', 'HoloLens, Quest passthrough', 'इंजन खोलकर पुर्ज़े पहचानना, दूरस्थ विशेषज्ञ की सीधी मदद'],
        ['XR', 'उपर्युक्त सबका समूह', '—', 'छाता-शब्द; परीक्षा में "XR = AR + VR + MR"'],
        ['360° वीडियो', 'चारों ओर देख सकने वाला वीडियो', 'फ़ोन + headset, वेब player', 'लैब-भ्रमण, संयंत्र-दर्शन'],
        ['Haptic feedback', 'स्पर्श का आभास', 'दस्ताने, controller, suit', 'औज़ार पकड़ने का अनुभव, बल-प्रशिक्षण'],
        ['Digital Twin', 'असली मशीन का जीवंत डिजिटल प्रतिरूप', 'sensor + 3D मॉडल + डेटा', 'पहले आभासी में परखो, फिर असली मशीन पर करो']
      ] },

    { type: 'table',
      head: ['पीढ़ी', 'वर्ष (लगभग)', 'मुख्य क्षमता', 'गति', 'खास बात'],
      rows: [
        ['1G', '1980 का दशक', 'केवल analog आवाज़ कॉल', 'kbps में भी नहीं', 'कोई डेटा नहीं, कमज़ोर encryption'],
        ['2G', '1990 का दशक', 'डिजिटल आवाज़ + SMS', '~9.6–14.4 kbps', 'GSM, पहली बार text संदेश'],
        ['2.5G/2.75G (GPRS/EDGE)', '2000 के आसपास', 'packet डेटा', '~50–200 kbps', 'पहली बार मोबाइल इंटरनेट'],
        ['3G', '2000 का दशक', 'वीडियो कॉल, मोबाइल वेब', '~0.2–7 Mbps', 'UMTS/HSPA; स्मार्टफ़ोन का आगमन'],
        ['4G / LTE', '2010 का दशक', 'पूरा IP network, HD streaming', '~10–100 Mbps', 'ऐप-अर्थव्यवस्था, वीडियो कॉल आम'],
        ['5G', '2020 का दशक', 'अति-कम विलंब, बहुत घना जोड़', '~0.1–1+ Gbps', 'तीन रूप — eMBB (गति), URLLC (भरोसेमंद कम विलंब), mMTC (लाखों IoT)'],
        ['6G (शोध में)', '2030 के आसपास संभावित', 'AI-मूल network, sensing, THz', 'अभी मानक नहीं', 'अभी केवल शोध — उत्पाद का दावा न मानें']
      ] },

    { type: 'table',
      head: ['तकनीक', 'मूल विचार', 'आज कहाँ दिखता है', 'सीखने लायक पहली बात'],
      rows: [
        ['Edge / Fog computing', 'गणना डेटा के स्रोत के पास ही', 'कैमरे में ही पहचान, factory gateway, CDN edge', 'विलंब घटता, bandwidth बचता; डेटा बाहर कम जाता'],
        ['Quantum computing', 'qubit — superposition व entanglement', 'शोध-प्रयोगशालाएँ, cloud quantum सेवाएँ', 'हर काम तेज़ नहीं करता; केवल कुछ विशेष समस्याएँ (गुणनखंड, अनुकरण, अनुकूलन)'],
        ['Qubit / Superposition', '0 और 1 की अवस्थाओं का मिश्रण', 'quantum प्रोसेसर', 'मापने पर एक निश्चित मान मिलता है; n qubit = 2^n अवस्थाएँ एक साथ'],
        ['Entanglement', 'जुड़े हुए qubit — एक का माप दूसरे को तय करे', 'quantum संचार, गणना', 'दूरी से स्वतंत्र सहसंबंध; डेटा-तेज़-भेजना नहीं'],
        ['Post-quantum cryptography', 'quantum-रोधी encryption', 'नए मानक (जैसे lattice-आधारित)', 'आज का RSA/ECC भविष्य में टूट सकता है — अभी से योजना'],
        ['Robotics / Cobots', 'sensor + नियंत्रण + क्रिया', 'कारख़ाना, गोदाम, चिकित्सा, खेत', 'ROS (Robot Operating System) सीखने का मानक मंच'],
        ['3D Printing / Additive', 'परत-दर-परत वस्तु बनाना', 'प्रोटोटाइप, पुर्ज़े, चिकित्सा मॉडल', 'STL फ़ाइल → slicer → G-code → printer'],
        ['Nanotechnology', 'परमाणु-स्तर पर पदार्थ-अभियांत्रिकी', 'नए पदार्थ, चिप, चिकित्सा', '1 nm = एक मीटर का अरबवाँ हिस्सा'],
        ['Biometrics', 'शरीर से पहचान', 'fingerprint, face, iris, voice', 'biometric बदला नहीं जा सकता — लीक हुआ तो स्थायी जोखिम'],
        ['Digital Twin', 'असली वस्तु का जीवंत डिजिटल जुड़वाँ', 'इंजन, भवन, विद्युत-जाल', 'sensor डेटा से मॉडल लगातार अद्यतन होता है']
      ] },

    { type: 'callout', kind: 'exam', title: 'परीक्षा में — नई तकनीकों के मानक उत्तर',
      html: '(1) <b>क्लाउड कंप्यूटिंग</b> की परिभाषा + पाँच विशेषताएँ + तीन सेवा-मॉडल (उदाहरण सहित) + चार deployment मॉडल। (2) <b>IaaS/PaaS/SaaS में अंतर</b> — "कौन क्या सँभालता है" वाली तालिका। (3) <b>AI बनाम ML बनाम DL</b> — एक के भीतर एक। (4) <b>IoT</b> की परिभाषा, चार परतें, दो प्रोटोकॉल (MQTT, Zigbee/LoRa)। (5) <b>AR बनाम VR</b> — असली दृश्य दिखता रहे या पूरी तरह आभासी। (6) <b>Blockchain</b> — block + hash + पिछले block का hash + consensus। (7) <b>5G</b> की तीन विशेषताएँ — उच्च गति, अति-कम विलंब, बहुत अधिक उपकरण। (8) <b>Edge computing</b> — गणना स्रोत के पास, विलंब व bandwidth की बचत। (9) <b>Quantum</b> — qubit, superposition, entanglement; यह हर काम में तेज़ नहीं।' },

    { type: 'labs', items: [
      { n: 180, title: 'क्लाउड सेवा-मॉडल का तुलनात्मक अध्ययन', aim: 'IaaS/PaaS/SaaS/FaaS को वास्तविक उदाहरणों पर "कौन क्या सँभालता है" के आधार पर अलग करना।', tools:['इंटरनेट व ब्राउज़र', 'AWS/Azure/GCP/Netlify की आधिकारिक वेबसाइटें', 'स्प्रेडशीट'], steps:['चारों मॉडल की परिभाषा अपने शब्दों में लिखें।', 'हर मॉडल के दो वास्तविक उत्पाद खोजें और उनका आधिकारिक पृष्ठ खोलकर प्रमाण-स्वरूप URL व स्क्रीनशॉट लें।', 'एक तालिका बनाएँ — [मॉडल | उत्पाद | आप क्या सँभालते | प्रदाता क्या सँभालता | बिल-आधार | मुफ़्त सीमा]।', 'इसी पोर्टल जैसी एक static साइट के लिए चारों मॉडल में से कौन उपयुक्त है, तर्क सहित चुनें।', 'एक ही काम (जैसे "फ़ॉर्म से डेटा सहेजना") के लिए SaaS बनाम FaaS की लागत व श्रम का अनुमान लगाएँ।', 'पाँच NIST विशेषताएँ अपने चुने उत्पाद पर जाँचें — कौन-सी दिखती है, कौन-सी नहीं।'], result: 'चार-मॉडल तुलना-तालिका, आठ प्रमाणित उत्पाद-उदाहरण और एक पृष्ठ का तर्कसहित चुनाव।' },
      { n: 181, title: 'क्लाउड स्टोरेज — sync, sharing व पुनर्प्राप्ति', aim: 'sync और बैकअप का अंतर प्रयोग से सिद्ध करना और साझा-अनुमतियों का सुरक्षित उपयोग सीखना।', tools:['Google Drive या OneDrive खाता', 'दो उपकरण (या दो browser profile)', 'एक नमूना फ़ोल्डर'], steps:['एक फ़ोल्डर बनाकर उसमें तीन फ़ाइलें रखें और दूसरे उपकरण पर sync होते देखें।', 'एक फ़ाइल बदलें — version history में पुराना संस्करण दिखता है? उसे वापस लाकर जाँचें।', 'एक फ़ाइल मिटाएँ — दोनों उपकरणों और recycle bin में क्या होता है, दर्ज करें। यहीं सिद्ध होता है कि sync बैकअप नहीं है।', 'तीन तरह के साझा-लिंक बनाएँ — Anyone/Viewer, Specific people, expiry+password — और दूसरे खाते से खोलकर अनुमति जाँचें।', 'गलत अनुमति वाला लिंक तुरंत निरस्त (revoke) करें और जाँचें कि अब नहीं खुलता।', 'अंत में उसी फ़ोल्डर की एक अलग offline प्रति बनाकर 3-2-1 नीति का पालन दिखाएँ।'], result: 'sync-बनाम-बैकअप प्रयोग-प्रतिवेदन, version-पुनर्प्राप्ति का प्रमाण और तीन साझा-अनुमति जाँचों की तालिका।' },
      { n: 182, title: 'Static साइट होस्टिंग — build से HTTPS तक', aim: 'एक छोटी साइट को स्थानीय से क्लाउड तक पहुँचाना और DNS/CDN/HTTPS की कड़ियाँ समझना।', tools:['एक छोटा HTML प्रोजेक्ट', 'Git', 'मुफ़्त static होस्ट (Netlify/Vercel/Cloudflare Pages/GitHub Pages)', 'nslookup/dig, curl'], steps:['स्थानीय सर्वर पर साइट चलाकर जाँचें कि सब ठीक है।', 'Git में commit करके होस्ट से जोड़ें और पहला deploy करें; होस्ट का दिया अस्थायी URL खोलें।', 'curl -I से status, cache-header व server पहचानें; फिर एक फ़ाइल बदलकर दोबारा deploy करें और cache का असर देखें।', 'nslookup/dig से होस्ट के DNS रिकॉर्ड जाँचें — कौन-सा A/CNAME किस ओर इशारा करता है।', 'HTTPS certificate कब व कैसे बना, यह दर्ज करें; http से https पर redirect जाँचें।', 'एक गलती जान-बूझकर करें (टूटा लिंक) और होस्ट के deploy-log में उसे पकड़ें; फिर सुधारकर दोबारा deploy करें।'], result: 'लाइव अस्थायी URL, deploy-log का विश्लेषण, DNS/header जाँच-प्रतिवेदन और cache-व्यवहार की टिप्पणी।' },
      { n: 183, title: 'Prompt प्रयोगशाला — एक प्रश्न, दस रूप', aim: 'prompt engineering की तकनीकों का असर नापना और hallucination पकड़ना।', tools:['कोई एक AI चैट-सेवा', 'एक ही मूल प्रश्न', 'तुलना-स्प्रेडशीट'], steps:['एक कमज़ोर prompt लिखें (जैसे "लिनक्स बताओ") और उत्तर सहेजें।', 'उसी प्रश्न पर क्रमशः भूमिका, संदर्भ, प्रारूप, सीमाएँ, उदाहरण, चरणबद्ध सोच जोड़कर नए उत्तर लें।', 'हर उत्तर को चार कसौटियों पर 1–5 अंक दें — शुद्धता, उपयोगिता, प्रारूप, संक्षिप्तता।', 'एक जान-बूझकर कठिन तथ्यात्मक प्रश्न पूछें (जैसे किसी पुराने आँकड़े का सटीक मान) और उत्तर की जाँच मूल स्रोत से करें — hallucination मिला तो दर्ज करें।', '"केवल दिए पाठ के आधार पर उत्तर दो" वाला prompt बनाकर अपने एक अध्याय पर प्रश्नोत्तर कराएँ; अंतर नापें।', 'अंत में सर्वोत्तम prompt का एक पुनःप्रयोग-योग्य साँचा (template) बनाएँ।'], result: 'दस-उत्तर तुलना-तालिका, अंक-पत्रक, एक प्रलेखित hallucination और एक तैयार prompt-साँचा।' },
      { n: 184, title: 'IoT झलक — sensor से dashboard तक', aim: 'IoT की चारों परतें एक छोटे वास्तविक प्रवाह में देखना और MQTT का publish/subscribe समझना।', tools:['Raspberry Pi या ESP32/Arduino + एक sensor (या केवल Linux PC + Mosquitto)', 'MQTT broker व clients', 'एक dashboard (Node-RED या सादा HTML+JS)'], steps:['Mosquitto broker स्थापित करें और mosquitto_sub से एक topic सुनें।', 'mosquitto_pub से नमूना तापमान भेजें और subscriber पर आता देखें — यही परत 2 (संचार) है।', 'असली sensor हो तो उसे जोड़कर हर 10 सेकंड वास्तविक मान भेजें; न हो तो script से यादृच्छिक मान भेजें और स्पष्ट लिखें कि यह अनुकरण है।', 'topic-सीढ़ी बनाएँ (lab/room1/temperature, lab/room1/humidity) और wildcard (+, #) से सब एक साथ सुनें।', 'Node-RED या सादे HTML पेज पर आते मानों की लाइव तालिका/ग्राफ़ दिखाएँ — यही परत 4 (अनुप्रयोग) है।', 'सुरक्षा जाँच करें — broker पर पासवर्ड/TLS लगाएँ, बिना अनुमति जुड़ने का प्रयास करें और असफलता दर्ज करें।'], result: 'चारों परतों का चित्रित प्रवाह, चलता MQTT प्रवाह, लाइव dashboard और सुरक्षा-जाँच प्रतिवेदन।' }
    ] },

    { type: 'acc', title: 'अक्सर उलझने वाले प्रश्न',
      items: [
        { q: 'क्लाउड का मतलब क्या मेरा डेटा हवा में रहता है?', a: 'नहीं। "क्लाउड" किसी और की भौतिक मशीन है — किसी डेटा-सेंटर में रखे server, storage व network। आपका डेटा वास्तविक डिस्क पर ही रहता है, बस वह डिस्क आपकी नहीं है। इसीलिए यह पूछना ज़रूरी है कि डेटा किस देश/क्षेत्र में रखा जाएगा, कौन उसे देख सकता है, और सेवा बंद होने पर आप उसे कैसे निकालेंगे।' },
        { q: 'IaaS, PaaS और SaaS में मैं क्या-क्या सँभालता हूँ?', a: 'IaaS में आपको OS, runtime, ऐप और डेटा — सब सँभालना है; प्रदाता केवल hardware, network व virtualization देता है। PaaS में OS व runtime प्रदाता सँभालता है, आप केवल ऐप का कोड व डेटा। SaaS में पूरा stack प्रदाता का है, आप केवल उपयोग करते हैं और अपना डेटा रखते हैं। FaaS/serverless में आप केवल एक function लिखते हैं, बाकी सब प्रदाता।' },
        { q: 'Public cloud असुरक्षित है, इसलिए private cloud ही ठीक?', a: 'ऐसा नहीं। बड़े प्रदाता की सुरक्षा-टीम, भौतिक सुरक्षा व अनुपालन प्रायः छोटे संस्थान से बेहतर होते हैं। असली प्रश्न है — साझा-ज़िम्मेदारी (shared responsibility) में आपका हिस्सा क्या है। Public cloud में भी गलत साझा-अनुमति, कमज़ोर पासवर्ड या लीक API key से डेटा बाहर जाता है। Private cloud तब चुनें जब नियंत्रण/अनुपालन की विशिष्ट आवश्यकता हो और उसे सँभालने की क्षमता भी हो।' },
        { q: 'Sync और बैकअप में फ़र्क़ क्यों ज़रूरी है?', a: 'Sync का लक्ष्य है "हर जगह वही नवीनतम प्रति" — इसलिए गलती, मिटाना या encryption भी हर जगह पहुँच जाता है। बैकअप का लक्ष्य है "समय में पीछे जा सकना" — इसलिए वह अपरिवर्तनीय, संस्करण-सहित और अलग माध्यम पर होता है। OneDrive/Drive को बैकअप मानना तब तक गलत है जब तक versioning + recycle bin + एक अलग offline प्रति न हो।' },
        { q: 'Serverless का मतलब server नहीं है?', a: 'Server है, पर आप उसे देखते-सँभालते नहीं। प्रदाता आपके function को माँग के अनुसार चलाता है, खाली समय में शून्य पर घटा देता है, और केवल चलने की अवधि व संसाधन का बिल लेता है। सीमाएँ — cold start (पहली बार धीमा), अवधि-सीमा, state सहेजना कठिन, और प्रदाता पर निर्भरता।' },
        { q: 'AI, ML, DL और GenAI — क्या ये चार अलग तकनीकें हैं?', a: 'नहीं, ये एक के भीतर एक घेरे हैं। AI सबसे बड़ा क्षेत्र है (मशीन से बुद्धि-वाला काम)। ML उसका उपसमुच्चय है (डेटा से सीखना, स्पष्ट नियम नहीं)। DL ML का उपसमुच्चय है (गहरी neural network)। GenAI DL का वह रूप है जो नई सामग्री बनाता है — पाठ, तस्वीर, ऑडियो, कोड। हर GenAI, DL है; हर DL, ML है; हर ML, AI है — पर उल्टा नहीं।' },
        { q: 'LLM गलत तथ्य क्यों गढ़ लेता है?', a: 'उसका मूल काम "अगला सबसे संभावित token" चुनना है, न कि डेटाबेस से तथ्य देखना। उसने पैटर्न सीखे हैं, इसलिए जो बात "सुनने में सही लगती है" वह बना देता है — भले ही वह सच न हो। इसे hallucination कहते हैं। बचाव — अपना दस्तावेज़ संदर्भ में दें (RAG), "न मिले तो साफ़ कहो" निर्देश जोड़ें, और हर महत्वपूर्ण तथ्य मूल स्रोत से मिलाएँ।' },
        { q: 'Temperature बढ़ाने से क्या होता है?', a: 'यह अगले token के चुनाव की यादृच्छिकता नियंत्रित करता है। कम temperature (जैसे 0–0.3) पर उत्तर निश्चित, दोहराव वाला व तथ्य-केंद्रित आता है — कोड, गणित, तथ्यात्मक काम के लिए ठीक। अधिक (0.8–1.2) पर रचनात्मक व विविध, पर गलती व भटकाव की संभावना भी अधिक — कहानी/विचार-मंथन के लिए। यह "बुद्धिमत्ता" नहीं बढ़ाता, केवल चुनाव-वितरण बदलता है।' },
        { q: 'क्या AI मेरा निजी डेटा सीख लेता है?', a: 'यह सेवा की नीति पर निर्भर है। कुछ सेवाएँ chat को प्रशिक्षण में उपयोग कर सकती हैं जब तक आप opt-out न करें; कुछ व्यवसायिक/शैक्षणिक योजनाएँ स्पष्ट रूप से नहीं करतीं। सुरक्षित नियम — पासवर्ड, API key, आधार/पैन, चिकित्सा-रिकॉर्ड, प्रश्नपत्र की उत्तर-कुंजी और संस्थान का गुप्त डेटा किसी भी AI सेवा में न डालें। संवेदनशील काम के लिए स्थानीय/खुला मॉडल (Ollama आदि) चुनें।' },
        { q: 'MQTT और HTTP में IoT के लिए क्या चुनें?', a: 'MQTT हल्का publish/subscribe प्रोटोकॉल है — छोटा header, कम bandwidth, broker के through एक-से-कई वितरण, और अनियमित network पर भी टिकाऊ (QoS स्तर, retained message)। लगातार भेजने वाले sensor के लिए यही बेहतर है। HTTP भारी header वाला request/response है — कभी-कभार भेजने वाले उपकरण या जब सीधे किसी REST API से बात करनी हो, तब ठीक। बहुत सीमित उपकरण के लिए CoAP।' },
        { q: 'IoT उपकरण घर/लैब के network पर जोखिम क्यों हैं?', a: 'प्रायः डिफ़ॉल्ट पासवर्ड, बिना encryption traffic, कभी अपडेट न मिलना और अनावश्यक खुली सेवाएँ। एक कमज़ोर कैमरा या bulb पूरे network का प्रवेश-द्वार बन सकता है, और लाखों ऐसे उपकरण मिलकर botnet बनाकर बड़े हमले करते हैं। बचाव — पासवर्ड बदलें, firmware अपडेट रखें, IoT को अलग VLAN/guest network में रखें, इंटरनेट से सीधा port न खोलें, Telnet/UPnP बंद करें।' },
        { q: 'Blockchain और साधारण डेटाबेस में कब क्या चुनें?', a: 'यदि एक ही संस्थान का डेटा है और एक भरोसेमंद admin है, तो साधारण डेटाबेस तेज़, सस्ता व सरल है — blockchain वहाँ बेकार जटिलता है। Blockchain तब उपयोगी है जब कई पक्ष हों जो एक-दूसरे पर भरोसा नहीं करते, कोई साझा स्वामी न चाहते हों, और अपरिवर्तनीय साझा रिकॉर्ड चाहिए। तकनीक समझें; क्रिप्टो-सट्टे से बचें — "निश्चित लाभ" प्रायः धोखा है।' },
        { q: 'AR और VR में एक पंक्ति का अंतर?', a: 'VR में असली दुनिया पूरी तरह ढक जाती है — आप केवल आभासी वातावरण देखते हैं (headset)। AR में असली दृश्य दिखता रहता है और उस पर डिजिटल परत जुड़ती है (फ़ोन कैमरा, AR चश्मा)। MR में आभासी वस्तु असली दुनिया से क्रिया करती है। XR इन सबका छाता-शब्द है।' },
        { q: 'Quantum computer क्या हर काम में तेज़ है?', a: 'नहीं। यह केवल कुछ विशेष प्रकार की समस्याओं में लाभ देता है — जैसे बड़े गुणनखंड (Shor), अनुकरण/सिम्युलेशन, कुछ खोज व अनुकूलन। सामान्य काम — वेब चलाना, दस्तावेज़ लिखना, वीडियो — में इससे कोई लाभ नहीं। आज के quantum कंप्यूटर छोटे, शोर-युक्त (noisy) और विशेष वातावरण माँगते हैं। इसीलिए "post-quantum cryptography" पर अभी से काम हो रहा है, ताकि भविष्य का quantum आज का encryption न तोड़ सके।' }
      ] },

    { type: 'quiz', store: 'sw-ai', items: [
      { q: 'क्लाउड कंप्यूटिंग की NIST विशेषता नहीं कौन-सी है?', o: ['On-demand self-service', 'Resource pooling', 'Measured service', 'मुफ़्त असीमित storage'], a: 3, ex: 'पाँच विशेषताएँ — on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service। असीमित मुफ़्त storage इनमें नहीं।' },
      { q: 'IaaS में ग्राहक क्या सँभालता है?', o: ['केवल ऐप का कोड', 'OS, runtime, ऐप और डेटा', 'कुछ नहीं', 'केवल hardware'], a: 1, ex: 'IaaS में प्रदाता hardware/network/virtualization देता है; OS से ऊपर सब ग्राहक का। उदाहरण — AWS EC2, Azure VM।' },
      { q: 'Microsoft 365 किस सेवा-मॉडल का उदाहरण है?', o: ['IaaS', 'PaaS', 'SaaS', 'FaaS'], a: 2, ex: 'पूरा ऐप प्रदाता चलाता है, उपयोगकर्ता केवल उपयोग करता है — यही SaaS है।' },
      { q: 'केवल एक संस्था के लिए बना क्लाउड कौन-सा है?', o: ['Public', 'Private', 'Community', 'Hybrid'], a: 1, ex: 'Private cloud एक ही संस्था के लिए; community साझा हित वाले कई संस्थानों के लिए; hybrid = निजी + सार्वजनिक।' },
      { q: 'क्लाउड स्टोरेज में sync को बैकअप क्यों नहीं मानते?', o: ['sync धीमा होता है', 'गलती/मिटाना/encryption हर प्रति में पहुँच जाता है', 'sync में फ़ाइलें नहीं दिखतीं', 'sync मुफ़्त नहीं'], a: 1, ex: 'sync का लक्ष्य हर जगह नवीनतम प्रति है; बैकअप का लक्ष्य समय में पीछे जा सकना। versioning + अलग offline प्रति चाहिए।' },
      { q: 'CDN का मुख्य लाभ क्या है?', o: ['डेटाबेस तेज़ करना', 'उपयोगकर्ता के नज़दीकी edge से सामग्री देकर विलंब घटाना', 'फ़ाइलें encrypt करना', 'domain खरीदना'], a: 1, ex: 'CDN किनारों पर प्रतियाँ रखता है — गति बढ़ती, मूल server पर बोझ घटता, DDoS सहनशीलता बढ़ती है।' },
      { q: 'DNS में CNAME रिकॉर्ड क्या करता है?', o: ['नाम को IPv4 से जोड़ता है', 'नाम को दूसरे नाम से जोड़ता है', 'डाक server बताता है', 'नीतियाँ व सत्यापन रखता है'], a: 1, ex: 'A = IPv4, AAAA = IPv6, CNAME = उपनाम → दूसरा नाम, MX = डाक, TXT = सत्यापन/नीति (SPF, DKIM, DMARC)।' },
      { q: 'Container और VM में kernel के स्तर पर क्या अंतर है?', o: ['Container का अलग kernel होता है', 'VM का अलग kernel; container मेज़बान का kernel साझा करता है', 'दोनों के अलग kernel', 'किसी में kernel नहीं'], a: 1, ex: 'इसीलिए container हल्का व तेज़ शुरू होता है, पर अलगाव VM जितना मज़बूत नहीं।' },
      { q: 'Serverless की सही परिभाषा?', o: ['server होता ही नहीं', 'server प्रदाता सँभालता है; आप केवल function लिखते हैं, प्रति invocation बिल', 'मुफ़्त hosting', 'केवल static फ़ाइलें'], a: 1, ex: 'AWS Lambda, Azure Functions, Netlify Functions, Cloudflare Workers — सब FaaS। सीमाएँ: cold start, अवधि-सीमा, state।' },
      { q: 'AI, ML, DL का सही क्रम (बड़े से छोटा)?', o: ['DL > ML > AI', 'AI > ML > DL', 'ML > AI > DL', 'तीनों असंबंधित'], a: 1, ex: 'AI सबसे बड़ा घेरा, ML उसका उपसमुच्चय, DL ML का उपसमुच्चय; GenAI DL का एक रूप।' },
      { q: 'लेबल-युक्त डेटा से सीखना कौन-सा प्रकार है?', o: ['Unsupervised', 'Supervised', 'Reinforcement', 'Clustering'], a: 1, ex: 'Supervised में input के साथ सही output (लेबल) दिया जाता है। बिना लेबल = unsupervised; पुरस्कार/दंड = reinforcement।' },
      { q: 'Overfitting का अर्थ?', o: ['मॉडल बहुत सरल है', 'प्रशिक्षण डेटा रट लिया, नए डेटा पर असफल', 'बहुत अधिक डेटा', 'GPU गरम होना'], a: 1, ex: 'रटना बनाम समझना। बचाव — अधिक विविध डेटा, regularization, validation set, early stopping।' },
      { q: 'LLM में "token" क्या है?', o: ['पासवर्ड', 'पाठ की छोटी इकाई (शब्द या उसका टुकड़ा)', 'एक फ़ाइल', 'GPU का नाम'], a: 1, ex: 'मॉडल token गिनकर संदर्भ सीमा तय करता है और उसी आधार पर बिल होता है। एक token ≈ ¾ अंग्रेज़ी शब्द।' },
      { q: 'LLM का "hallucination" क्या है?', o: ['बहुत धीमा उत्तर', 'आत्मविश्वास से गढ़ा हुआ गलत तथ्य/उद्धरण देना', 'उत्तर न देना', 'भाषा बदल देना'], a: 1, ex: 'मूल काम अगला संभावित token चुनना है, तथ्य-lookup नहीं — इसलिए विश्वासपूर्वक गलती संभव। मूल स्रोत से मिलाएँ।' },
      { q: 'RAG (Retrieval-Augmented Generation) क्या करता है?', o: ['मॉडल को दोबारा प्रशिक्षित करता है', 'उत्तर से पहले संबंधित दस्तावेज़ खोजकर संदर्भ में देता है', 'तस्वीर बनाता है', 'तापमान घटाता है'], a: 1, ex: 'इससे उत्तर आपके वास्तविक दस्तावेज़ पर टिकता है और hallucination घटता है; प्रशिक्षण की ज़रूरत नहीं।' },
      { q: 'तथ्यात्मक/कोड कार्य के लिए temperature कैसा रखें?', o: ['बहुत अधिक (1.5+)', 'कम (0–0.3)', 'हमेशा 1.0', 'कोई फ़र्क़ नहीं'], a: 1, ex: 'कम temperature = निश्चित, दोहराव वाला, तथ्य-केंद्रित। अधिक = रचनात्मक पर जोखिम भरा।' },
      { q: 'अच्छे prompt का कौन-सा तत्व नहीं है?', o: ['भूमिका व कार्य', 'संदर्भ व प्रारूप', 'सीमाएँ व उदाहरण', 'जितना अस्पष्ट हो उतना अच्छा'], a: 3, ex: 'स्पष्टता ही अच्छे prompt की जान है। अस्पष्ट प्रश्न का अस्पष्ट उत्तर मिलता है।' },
      { q: 'AI सेवा में क्या कभी नहीं डालना चाहिए?', o: ['सार्वजनिक प्रश्न', 'पासवर्ड, API key, आधार व प्रश्नपत्र की उत्तर-कुंजी', 'अपना नाम', 'सामान्य पाठ'], a: 1, ex: 'निजी व गुप्त डेटा प्रशिक्षण/लॉग में जा सकता है। संवेदनशील काम के लिए स्थानीय मॉडल चुनें।' },
      { q: 'IoT की चार परतों का सही क्रम?', o: ['Application → Network → Perception → Middleware', 'Perception → Network → Middleware/Edge → Application', 'Network → Perception → Application → Edge', 'Edge → Application → Network → Perception'], a: 1, ex: 'संवेदन (sensor) → संचार (Wi-Fi/MQTT) → मध्यवार/edge (छानना, नियम) → अनुप्रयोग (dashboard)।' },
      { q: 'लगातार डेटा भेजने वाले सीमित IoT उपकरण के लिए सबसे उपयुक्त प्रोटोकॉल?', o: ['HTTP', 'MQTT', 'FTP', 'SMTP'], a: 1, ex: 'MQTT हल्का publish/subscribe है — छोटा header, कम bandwidth, broker से एक-से-कई, QoS व retained message।' },
      { q: 'बहुत कम बिजली व कई किमी दूरी वाले खेत-sensor के लिए कौन-सी तकनीक?', o: ['Wi-Fi', 'BLE', 'LoRaWAN', 'Ethernet'], a: 2, ex: 'LoRaWAN = लंबी दूरी, बहुत कम डेटा-दर, बहुत कम बिजली। Wi-Fi तेज़ पर भूखा; BLE कम दूरी।' },
      { q: 'IoT उपकरणों के लिए सबसे ज़रूरी सुरक्षा कदम?', o: ['डिफ़ॉल्ट पासवर्ड रखना', 'डिफ़ॉल्ट पासवर्ड बदलना, firmware अपडेट, अलग VLAN', 'सब port खोल देना', 'Telnet चालू रखना'], a: 1, ex: 'कमज़ोर IoT उपकरण botnet का प्रवेश-द्वार बनते हैं। अलग network व बंद अनावश्यक सेवाएँ अनिवार्य।' },
      { q: 'Blockchain में पुराना रिकॉर्ड बदलना कठिन क्यों है?', o: ['पासवर्ड लगा है', 'हर block में पिछले block का hash है — बदलते ही पूरी शृंखला टूटती है', 'इंटरनेट बंद रहता है', 'केवल एक प्रति है'], a: 1, ex: 'hash-शृंखला + कई nodes पर प्रतियाँ + consensus — इसलिए चुपचाप बदलना व्यावहारिक रूप से असंभव।' },
      { q: 'PoW और PoS में मुख्य अंतर?', o: ['दोनों एक ही', 'PoW में कठिन पहेली व अधिक बिजली; PoS में हिस्सेदारी के आधार पर अवसर, कम बिजली', 'PoS अधिक बिजली खाता है', 'PoW केवल निजी chain में'], a: 1, ex: 'Bitcoin = PoW, Ethereum (अब) = PoS। PoS ऊर्जा की दृष्टि से बहुत किफ़ायती है।' },
      { q: 'AR और VR में सही अंतर?', o: ['VR में असली दृश्य दिखता रहता है', 'AR में असली दृश्य पर डिजिटल परत; VR में पूरी तरह आभासी दुनिया', 'दोनों एक ही', 'AR केवल ऑडियो'], a: 1, ex: 'AR = संवर्धित वास्तविकता, VR = आभासी वास्तविकता, MR = मिश्रित (आभासी वस्तु असली से क्रिया करे), XR = छाता-शब्द।' },
      { q: '5G की तीन प्रमुख क्षमताएँ कौन-सी हैं?', o: ['केवल तेज़ गति', 'eMBB (उच्च गति), URLLC (अति-कम विलंब), mMTC (लाखों उपकरण)', 'केवल SMS', 'केवल वीडियो कॉल'], a: 1, ex: '5G केवल गति नहीं — भरोसेमंद कम-विलंब (उद्योग/वाहन) और बहुत घना IoT जोड़ भी उसका लक्ष्य है।' },
      { q: 'Edge computing का मुख्य लाभ?', o: ['सारा डेटा क्लाउड में भेजना', 'गणना स्रोत के पास — विलंब व bandwidth की बचत, निजता बेहतर', 'बिजली अधिक खपत', 'धीमा उत्तर'], a: 1, ex: 'कैमरे में ही पहचान, factory gateway, CDN edge — सब edge के उदाहरण। क्लाउड केवल सारांश/प्रशिक्षण लेता है।' },
      { q: 'Qubit की खासियत क्या है?', o: ['केवल 0 या 1', 'superposition — 0 व 1 की अवस्थाओं का मिश्रण; entanglement से जुड़ाव', 'हमेशा 1', 'साधारण bit से बड़ा आकार'], a: 1, ex: 'n qubit एक साथ 2^n अवस्थाएँ निभा सकते हैं; मापने पर एक निश्चित मान मिलता है। यह हर काम में तेज़ नहीं, केवल विशेष समस्याओं में।' },
      { q: 'किसी संस्थान के एकल-admin डेटा के लिए blockchain चाहिए?', o: ['हाँ, हमेशा', 'नहीं — साधारण डेटाबेस तेज़, सस्ता व सरल है', 'केवल बड़े डेटा पर', 'केवल मुफ़्त हो तो'], a: 1, ex: 'blockchain तब उपयोगी जब कई अविश्वासी पक्ष हों और साझा स्वामी न चाहिए। एक भरोसेमंद admin हो तो DB ही सही।' },
      { q: 'Digital twin क्या है?', o: ['दूसरा कंप्यूटर', 'असली मशीन/भवन का sensor-डेटा से लगातार अद्यतन डिजिटल प्रतिरूप', 'backup फ़ाइल', 'दोहारा पासवर्ड'], a: 1, ex: 'पहले आभासी प्रतिरूप पर परखो, फिर असली मशीन पर करो — जोखिम व लागत घटती है।' }
    ] },

    { type: 'pills', items: [
      { text: 'IaaS = OS से ऊपर आपका · PaaS = केवल कोड · SaaS = केवल उपयोग', kind: 'info' },
      { text: 'क्लाउड = किसी और की मशीन, किराए पर', kind: 'tip' },
      { text: 'Sync ≠ बैकअप', kind: 'danger' },
      { text: 'AI ⊃ ML ⊃ DL ⊃ GenAI', kind: 'info' },
      { text: 'LLM का काम = अगला token; तथ्य मूल स्रोत से मिलाओ', kind: 'warn' },
      { text: 'prompt में निजी डेटा कभी नहीं', kind: 'danger' },
      { text: 'IoT = संवेदन → संचार → edge → अनुप्रयोग', kind: 'info' },
      { text: 'AR = असली + परत · VR = पूरा आभासी', kind: 'ok' }
    ] }

  ]
},
]);
