
/* =====================================================================
   कंप्यूटर लैब  ·  cl3d-data-hw2a.js
   हार्डवेयर गहराई : CPU माइक्रोआर्किटेक्चर · RAM/DDR · स्टोरेज इंटरनल्स
   (सॉकेट/चिपसेट/PSU/BIOS-POST/सर्विसिंग की बुनियाद अन्य विषयों में है —
    यहाँ केवल "चिप के अंदर" की परत जोड़ी गई है)
   ===================================================================== */
window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([

/* ===================================================================
   HW-CPU · CPU के अंदर — माइक्रोआर्किटेक्चर
   =================================================================== */
{
  id:'hw-cpu', icon:'🧠', group:'हार्डवेयर गहराई',
  title:'CPU के अंदर — माइक्रोआर्किटेक्चर',
  sub:'fetch-decode-execute, पाइपलाइन, कैश, कोर-थ्रेड, IPC व बेंचमार्क',
  kicker:'Hardware Depth 1 · CPU Microarchitecture',
  hero:'दो CPU में "5 GHz" लिखा हो तो भी गति दोगुनी-चौगुनी हो सकती है — फ़र्क माइक्रोआर्किटेक्चर का होता है। यह पृष्ठ चिप के <b>अंदर</b> जाता है: रजिस्टर, पाइपलाइन, कैश, SMT, MESI, TLB, µop, बूस्ट व बेंचमार्क। सॉकेट/चिपसेट/VRM की पहचान के लिए मदरबोर्ड मास्टरक्लास और सर्विसिंग विषय पहले देख लीजिए।',
  tags:['IPC व घड़ी','पाइपलाइन व hazards','कैश व MESI','SMT व OoO','SIMD व VT-x','बेंचमार्क व थ्रॉटल'],
  blocks:[

  {type:'html', html:`<h3 class="blk"><span class="blk-n">1.1</span> CPU क्या करता है — और "गति" का असली हिसाब</h3>
  <p>CPU एक दोहराव-मशीन है जो मेमोरी (RAM) से निर्देश लाती है, उन्हें छोटे कदमों में तोड़ती है और ALU से पूरा करती है। इसकी गति तीन चीज़ों का गुणनफल है:</p>
  <p style="text-align:center"><b>प्रति सेकंड वास्तविक कार्य ≈ Clock (GHz) × IPC × कोर संख्या</b> (IPC = instructions per cycle, प्रति घड़ी-चक्र पूरे हुए काम)</p>
  <p>घड़ी की एक अवधि = 1/frequency। 3.6 GHz यानी हर चक्र ~0.28 ns। पर हर चक्र में कितना काम होता है, यह आर्किटेक्चर तय करता है — इसीलिए GHz की दौड़ 2005 के बाद रुक गई (NetBurst की 3.8 GHz गहरा पाइपलाइन IPC ~0.7–1.2 देती थी, Core माइक्रो-आर्किटेक्चर ने घड़ी घटाकर IPC बढ़ाया और तेज़ साबित हुआ)।</p>`},

  {type:'table', head:['अवधारणा','तथ्य/सूत्र','व्यावहारिक अर्थ'],
    rows:[
      ['Clock frequency','चक्र समय T = 1/f ; 1 GHz → 1 ns, 5 GHz → 0.2 ns','GHz केवल "टिक" की गिनती है, काम नहीं'],
      ['IPC','प्रति चक्र पूरे निर्देश/µop; आधुनिक कोर अंदर से 4–6+-wide','काल्पनिक 5 GHz Core2 (IPC ~2–3, 2 कोर) बनाम 5 GHz आधुनिक (IPC ~6+, 16 कोर) — GHz बराबर, काम कई गुना; गिनती: 3 GHz × IPC ~3 ≈ 9 G-IPS प्रति कोर'],
      ['कुल throughput','IPS ≈ f × IPC × कोर (सैद्धांतिक छत; असल में थ्रैड स्केलिंग कम)','कोर बढ़ाने से MT स्कोर बढ़ता है, ST स्कोर नहीं'],
      ['Turbo/Boost','हल्के लोड पर 1–2 कोर सबसे तेज़; भारी लोड पर सब धीमे','ST और MT के स्कोर अलग-अलग ताप/पावर पर अलग दिखते हैं'],
      ['SMT','एक कोर = 2 थ्रेड, साझा execution इकाइयाँ','आमतौर पर 15–30% लाभ (1.3 देखें)']
    ]},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">1.2</span> Fetch → Decode → Execute → Write-back चक्र</h3>
  <p>हर निर्देश यह चक्र दोहराता है। पाइपलाइन में ये चरण एक साथ चलते हैं — किचन की तरह: एक माँगे, एक काटे, एक पकाए।</p>
  <table class="tbl"><thead><tr><th>चरण</th><th>क्या होता है</th><th>उपयोग होने वाले रजिस्टर</th></tr></thead><tbody>
  <tr><td><b>Fetch</b></td><td>PC (RIP) के पते से निर्देश RAM/कैश से लाया जाता है</td><td>PC (RIP), MAR/MDR की भूमिका, L1i कैश</td></tr>
  <tr><td><b>Decode</b></td><td>बाइनरी कोड को µop (micro-operations) में तोड़ा जाता है</td><td>IR की भूमिका, µop-cache</td></tr>
  <tr><td><b>Execute</b></td><td>ALU गणना करता है या LSU मेमोरी load/store करता है</td><td>FLAGS अपडेट, GPR/SIMD रजिस्टर</td></tr>
  <tr><td><b>Memory</b></td><td>(आवश्यक हो तो) कैश/मेमोरी से डेटा आना-जाना</td><td>L1d/L2, TLB</td></tr>
  <tr><td><b>Write-back</b></td><td>परिणाम रजिस्टर में लिखा जाता है, निर्देश retire होता है</td><td>ACC/RAX आदि; ROB से program-order में retire</td></tr>
  </tbody></table>
  <svg viewBox="0 0 780 96" style="width:100%;max-width:780px;margin:6px auto;display:block">
    <defs><marker id="arrhw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8aa"/></marker></defs>
    <rect x="6" y="24" width="130" height="48" rx="8" fill="#22334a" stroke="#5b8"/><text x="71" y="44" fill="#cfe" font-size="13" text-anchor="middle">Memory</text><text x="71" y="61" fill="#9ad" font-size="11" text-anchor="middle">(RAM/Cache)</text>
    <rect x="166" y="24" width="110" height="48" rx="8" fill="#22334a" stroke="#59c"/><text x="221" y="44" fill="#cfe" font-size="13" text-anchor="middle">Fetch</text><text x="221" y="61" fill="#9ad" font-size="11" text-anchor="middle">PC → IR</text>
    <rect x="306" y="24" width="110" height="48" rx="8" fill="#22334a" stroke="#59c"/><text x="361" y="44" fill="#cfe" font-size="13" text-anchor="middle">Decode</text><text x="361" y="61" fill="#9ad" font-size="11" text-anchor="middle">→ µops</text>
    <rect x="446" y="24" width="110" height="48" rx="8" fill="#22334a" stroke="#59c"/><text x="501" y="44" fill="#cfe" font-size="13" text-anchor="middle">Execute</text><text x="501" y="61" fill="#9ad" font-size="11" text-anchor="middle">ALU / LSU</text>
    <rect x="586" y="24" width="120" height="48" rx="8" fill="#22334a" stroke="#59c"/><text x="646" y="44" fill="#cfe" font-size="13" text-anchor="middle">Write-back</text><text x="646" y="61" fill="#9ad" font-size="11" text-anchor="middle">REG + FLAGS</text>
    <line x1="136" y1="48" x2="164" y2="48" stroke="#8aa" stroke-width="2" marker-end="url(#arrhw)"/>
    <line x1="276" y1="48" x2="304" y2="48" stroke="#8aa" stroke-width="2" marker-end="url(#arrhw)"/>
    <line x1="416" y1="48" x2="444" y2="48" stroke="#8aa" stroke-width="2" marker-end="url(#arrhw)"/>
    <line x1="556" y1="48" x2="584" y2="48" stroke="#8aa" stroke-width="2" marker-end="url(#arrhw)"/>
    <path d="M 708 40 C 748 8, 60 -10, 24 22" fill="none" stroke="#e9a" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrhw)"/>
    <text x="390" y="14" fill="#e9a" font-size="11" text-anchor="middle">अगला निर्देश — PC बढ़ा (branch/mispredict यहीं महँगा पड़ता है)</text>
    <path d="M 500 74 C 470 96, 150 96, 120 74" fill="none" stroke="#7cc" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrhw)"/>
    <text x="330" y="92" fill="#7cc" font-size="11" text-anchor="middle">result वापस REG/FLAGS में (store RAM की ओर भी)</text>
  </svg>
  <p><b>नियंत्रण इकाई (CU)</b> पूरे चक्र को समन्वित करती है (कौन कब कौन सा बस/यूनिट uses करेगा), <b>ALU</b> पूरांक गणना/तुलना करता है, <b>FPU/SIMD यूनिट</b> दशमलव व वेक्टर, और <b>रजिस्टर</b> सबसे तेज़ थोड़ी-सी मेमोरी चिप के भीतर।</p>`},

  {type:'table', head:['रजिस्टर','पूरा नाम','काम','x86-64 में अनुरूप'],
    rows:[
      ['PC','Program Counter','अगले निर्देश का virtual पता','RIP'],
      ['IR','Instruction Register','वर्तमान में decode होता निर्देश','program-visible नहीं — decode/µop staging के अंदर'],
      ['MAR','Memory Address Register','बस पर भेजने वाला physical पता','IMC + TLB output के अंदर'],
      ['MDR/MBR','Memory Data Register','आया-गया डेटा का buffer','cache/L1d fill buffer, MOV से जुड़ा'],
      ['ACC','Accumulator','गणित का परिणाम/operand','RAX'],
      ['SP','Stack Pointer','LIFO stack का शीर्ष','RSP'],
      ['BP/FP','Base/Frame Pointer','वर्तमान फ़ंक्शन का फ़्रेम','RBP'],
      ['FLAGS','Status bits','गणना के नतीजे के गुण (नीचे तालिका)','EFLAGS/RFLAGS'],
      ['Index regs','Index/Source-Dest','loop में string/array खिसकाने वाले पते','RSI/RDI (SysV calling convention में args)'],
      ['General purpose','Data registers','शेष 64-बिट डेटा/पते','RBX, RCX (loop counter), RDX, R8–R15'],
      ['Segment','Segment base','पुराना 16-बिट मेमोरी मॉडल (आज DS/SS प्रायः शून्य)','CS/DS/SS/ES + FS/GS (thread-local आधार)'],
      ['SIMD','Vector registers','float/पैरेलल डेटा','MM0–7, XMM0–31, YMM, ZMM (128–512 bit)'],
      ['Control','System state','CR0–CR4, MXCSR (round/flush), debug DR0–DR7','MSR — model-specific registers, ring-0 only']
    ]},

  {type:'table', head:['बिट','Flag','अर्थ','कब काम आता है'],
    rows:[
      ['0','CF (Carry)','unsigned overflow/carry/borrow','unsigned compare/jump (JB/JA, ADC/SBB)'],
      ['2','PF (Parity)','परिणाम के lowest byte में 1s की संख्या सम है तो 1','parity check — legacy, आज दुर्लभ'],
      ['4','AF (Auxiliary)','nibble(4-bit) carry','BCD समायोजन (DAA/DAS)'],
      ['6','ZF (Zero)','परिणाम शून्य है','CMP से बराबरी (JE)'],
      ['7','SF (Sign)','परिणाम का highest bit (ऋणात्मक)','signed compare'],
      ['8','TF (Trap)','single-step — हर निर्देश पर debug exception','debugger का Step-Into'],
      ['9','IF (Interrupt Enable)','बाहरी maskable interrupts चालू/बंद','cli/sti, kernel क्रांतिक क्षेत्र'],
      ['10','DF (Direction)','string ops में पते बढ़ें या घटें','cld/std + MOVS/STOS'],
      ['11','OF (Overflow)','signed overflow','JO/JNO'],
      ['12–13','IOPL','I/O privilege level (0–3 ring)','पुराना OS तंत्र'],
      ['14','NT','nested task (task gate)','आधुनिक OS नहीं उपयोग करते'],
      ['16','RF','resume — debug breakpoint दोबारा न मारे','debug exception से बचने के बाद'],
      ['18','AC','alignment check','cr0.AM + pushed context के लिए'],
      ['19–20','VIF/VIP','virtual IF — guest interrupts बिना VM exit','VT-x/AMD-V posted interrupt आधार'],
      ['21','ID','CPUID निर्देश समर्थित','सटीक पहचान का द्वार']
    ]},

  {type:'callout', kind:'exam', title:'परीक्षा-सारांश — चार स्तंभ', html:'<b>von Neumann मॉडल:</b> निर्देश व डेटा एक ही मेमोरी में, एक ही बस से — यही "von Neumann bottleneck" है (CPU तेज़, डेटा की डिलीवरी धीमी)। <b>ALU</b> = गणना-तुलना; <b>Control Unit</b> = समन्वय; <b>Registers</b> = सबसे तेज़ थोड़ी मेमोरी; <b>Cache</b> = मेमोरी गैप भरने वाला SRAM। एक क्लासिक प्रश्न: "PC और MAR का काम?" — PC अगले निर्देश का पता, MAR वह पता जो memory bus पर भेजता है।'},

  {type:'table', head:['पहलू','CISC (x86)','RISC (ARM, RISC-V)'],
    rows:[
      ['निर्देश लंबाई','variable (1–15 B), जटिल निर्देश','fixed (4 B; Thumb 2 B), सरल निर्देश'],
      ['काम प्रति निर्देश','एक निर्देश में load+compute+store जैसे संयोजन','अधिकांशतः register-register; load/store अलग'],
      ['decode','µop में translation (micro-programming/ROM)','सीधा, तेज़ decode'],
      ['अंदर की सच्चाई','आज का x86 भी µop-level पर RISC-जैसा execution','आधुनिक RISC भी OoO, branch predict, cache वही'],
      ['फायदा','code घना, पुराना software बाइनरी अनुकूल','power/heat कम, शाखा-बदल आसान (mobile/AI)'],
      ['परीक्षा-तथ्य','Intel/AMD = CISC परिवार','Apple/Qualcomm/अधिकांश phone = ARM; नई laptop chips (Snapdragon X) भी ARM']
    ]},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">1.3</span> µop, µop-cache और superscalar</h3>
  <p>आधुनिक x86 निर्देश को decode करके छोटी रूढ़िवादी क्रियाओं में तोड़ता है — <b>µop (micro-operation)</b>। एक <code>ADD [mem], eax</code> = load + add + store, 3 µop; <code>MOV RAX, imm64</code> = 1 µop; कुछ fused µop बन जाते हैं।</p>
  <ul>
    <li><b>µop-cache (Intel में Decoded IStream, AMD Zen में op cache):</b> decode हुए µop टिके रहते हैं (Intel ~1.5–2K µops/कोर, Zen ~6.75K ops — पीढ़ी-अनुसार)। बार-बार चलने वाला loop पूरा decode छूट जाता है → कम heat, स्थिर clock, अधिक IPC।</li>
    <li><b>Superscalar:</b> एक ही चक्र में कई µop issue (आधुनिक Intel 5–6-wide, Zen 4/5 front-end 6-wide; execution ports अलग-अलग)। Issue width जितनी ज़्यादा, उतने parallel काम।</li>
    <li><b>SMT/Hyper-Threading (Intel 1999 में पहली बार, 2006 में वापस, 2018 से सर्वत्र):</b> एक कोर के fetch/decode/scheduler दो थ्रेडों में बाँटे जाते हैं; जब एक थ्रेड wait करे, दूसरा खाली execution port भर ले। भारी AVX/floating workload में सब यूनिट saturated = लाभ ~0–5%; memory-stall वाले काम (browser tabs, compile, VM, rendering) में <b>आमतौर पर 15–30%</b>।</li>
  </ul>`},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">1.4</span> पाइपलाइन — चरण, hazards और समाधान</h3>
  <p>पाइपलाइन में हर चरण अलग hardware है, इसलिए कई निर्देश एक साथ "आधा-आधा" चलते हैं। चरण कम और चौड़े रखना ही आधुनिक फ़लसफ़ा है (NetBurst की 31-stage पाइपलाइन मिसप्रेडिक्ट पर बहुत महँगी पड़ती थी)। गड़बड़ तीन प्रकार की होती हैं:</p>`},

  {type:'table', head:['Hazard','कब','समाधान'],
    rows:[
      ['Structural','दो µop एक ही port/Y-unit चाहें (जैसे एक ही integer multiplier)','अलग-अलग ports, multi-issue scheduler, arbitration'],
      ['Data (RAW/WAR/WAW)','अगला निर्देश पिछले के परिणाम का इंतज़ार करे','Operand forwarding/bypassing, register renaming (false deps हटते), scheduler window (ROB)'],
      ['Control','branch/mispredict से आगे fetch कबाड़','branch predictor + speculative execution; mispredict पर pipeline flush']
    ]},

  {type:'table', head:['विषय','आधुनिक संख्या-परिसर (range)','नोट'],
    rows:[
      ['Branch predictor','आधुनिक कोर (Intel Golden Cove+/Zen4+) पर <b>~95–99%</b> सही; सीधा scalar code पर सबसे ऊँचा, complex pointer-heavy code पर कम','TAGE-type history predictor + ITTAGE target prediction'],
      ['Mispredict की कीमत','~12–20 चक्र flush + पुनः fill; ROB में सैकड़ों µop खारिज, cache/TLB की मेहनत छूट जाती','indirect branch (jump table/virtual call) सबसे महँगे; gaming JIT/emulation में मापने लायक'],
      [' speculation सुरक्षा','Spectre/Meltdown (2017–18) के बाद firmware/Microcode mitigations — कुछ भारी workloads पर थोड़ा IPC नुकसान','BIOS में speculative-mitigation विकल्प सर्वर पर ज़्यादा, desktop पर प्रायः default'],
      ['OOO execution','µop queue + scheduler; ROB की गहराई सैकड़ों entries में (पीढ़ी-दर-पीढ़ी ~200–600) + बड़ा renaming register pool','क्रम तोड़कर execute, retire हमेशा program order में — side effects सुरक्षित'],
      ['Reorder & exceptions','ROB retired; fault हो तो "precise interrupt" — बाकी सब वापस','यही कारण है कि program crash बाकी speculation से अलग दिखता है']
    ]},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">1.5</span> कैश (Cache) — चिप के अंदर की तेज़ मेमोरी</h3>
  <p>कैश <b>SRAM</b> है (DRAM की तरह refresh नहीं, 6 ट्रान्ज़िस्टर/bit — महँगा पर ns नहीं, ps में)। हर स्तर का नियम: आगे वाला छोटा और तेज़। डेटा <b>64-byte cache line</b> में आता है; <b>spatial locality</b> (अगला पता अक्सर चाहिए) और <b>temporal locality</b> (हाल का फिर चाहिए) — इन्हीं दो सांद्रता पर पूरी डिज़ाइन टिकी है।</p>`},

  {type:'table', head:['स्तर','आकार (आधुनिक desktop)','देरी (अनुमानित)','टिप्पणी'],
    rows:[
      ['L1d (data)','32–48 KB/कोर','~3–5 cycle (~1–1.5 ns)','store-forwarding यहीं; L1 store policy पीढ़ी-अनुसार (WT/WB), नीचे के स्तर write-back'],
      ['L1i (instruction)','32–64 KB/कोर','~4–5 cycle','decode को µop-cache से आगे बढ़ने देता है'],
      ['L2','0.5–2 MB/कोर (Zen 4/5 ~1 MB, Intel P-core ~2 MB)','~12–20 cycle (~4–7 ns)','अक्सर per-core private; बड़ा private L2 = standalone कोर तेज़'],
      ['L3 (shared)','कुल ~16–128 MB (6–32 MB/CCX; ring या mesh fabric)','~40–70 cycle (~10–20 ns)','<b>AMD 3D V-Cache (X3D)</b>: ~64 MB extra L3 die के ऊपर stack → gaming 15–30% तक बेहतर'],
      ['L4','ऐतिहासिक: Iris Pro/Crystal Well eDRAM 64–128 MB (2013), Broadwell-EP Xeon का 1.6 MB eDRAM L4 — अब सामान्य नहीं','~80–120 cycle','आज के desktop में L4 व्यावहारिक रूप से नहीं'],
      ['RAM (DDR5)','16–128 GB','~250–400 cycle (~70–120 ns)','यही मुख्य bottleneck — prefetch/MLP से छिपाया जाता है']
    ]},

  {type:'table', head:['परिभाषा','सरल अर्थ'],
    rows:[
      ['Cache line = 64 B','स्थानांतरण की सबसे छोटी ईंट; 1 cache line = 64 B'],
      ['Direct-mapped','हर address के लिए कैश में सिर्फ़ 1 स्थान — टकराव (conflict) miss आसान'],
      ['Set-associative (2/4/8/16/12-way)','L1 में 8–16-way आम; एक set में कई विकल्प, LRU जैसा replacement (actual: pseudo-LRU/RRIP)'],
      ['Inclusive vs Exclusive','Intel (परंपरा) L3 में L2 की सभी lines रखता था (inclusive) — redundancy; AMD प्रायः exclusive — L3 असली capacity ज़्यादा दिखती है'],
      ['Write-through vs Write-back','through: हर store तुरंत नीचे (सुरक्षित, धीमा); back: dirty line बाद में flush (तेज़, आज मानक); non-temporal stores (MOVNTI) cache bypass कर बड़ी copy में सहायक'],
      ['Prefetcher','L2 stride/stream भविष्यवाणी से lines पहले लाता है; बहुत जल्दी random access पर हानिकारक (traffic बढ़ाता)']
    ]},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">1.6</span> MESI — कई कोर एक-दूसरे की कैश कैसे जानते हैं</h3>
  <p>दस कोर हैं, सब L1/L2 private — पर L3/RAM साझा। अगर कोर A एक line बदल दे और कोर B के पास पुरानी नकल रह जाए तो ग़लत डेटा। इसे दूर करने के लिए हर line की <b>अवस्था</b> रखी जाती है:</p>
  <ul>
    <li><b>M (Modified)</b> — यह नकल सबसे नई और केवल मेरे पास; लिखने लायक; दूसरे के पूछने पर मुझे देनी होगी और दूसरा Invalid होगा।</li>
    <li><b>E (Exclusive)</b> — साफ़ copy सिर्फ़ मेरे पास; कोई नहीं लिखा; लिखूँ तो चुपचाप M बन जाऊँगा।</li>
    <li><b>S (Shared)</b> — एक जैसी copy कई कोरों में; पढ़ने-मार्क; लिखने के लिए पहले सबको Invalid कहना होगा।</li>
    <li><b>I (Invalid)</b> — यह line पुरानी है, इस्तेमाल नहीं।</li>
  </ul>
  <p>इसी protocol पर snooping (bus पर कान खड़े) या directory (L3 में tracker) चलता है। <b>False sharing:</b> दो कोर एक-दूसरे के <b>अलग-अलग variable</b> छू रहे हैं पर वे एक ही 64-B line में हैं → line बार-बार M↔S↔I घूमती रहती है (ping-pong) — ठीक करने का तरीक़ा per-thread डेटा को अलग lines पर spread करना (padding/alignment)। <b>3D V-Cache इसी गैप को पाटता है:</b> gaming के assets बार-बार L3 में मिलते हैं तो RAM traffic गिरता है; frame-time के झटके (1% low) बेहतर।</p>`},

  {type:'table', head:['अवधारणा','विवरण','व्यावहारिक तथ्य'],
    rows:[
      ['Virtual address','हर program को लगता है उसके पास अपना पूरा पता-स्थान; MMU page tables से physical पर translation','process अलग-थलग, सुरक्षित, relocatable'],
      ['Paging','4 KB page मानक; <b>2 MB/1 GB huge pages</b> TLB entries कम खाते','DB/VM/huge-map apps बड़े pages से तेज़; Windows में "Lock pages" आवश्यकता'],
      ['TLB','translation cache: L1 ~64–128 entries (per core), L2 ~1–3K; entry = page पता + rights','TLB miss पर page walk (हार्डवेयर/सॉफ़्टवेयर) कई सौ cycle'],
      ['PCID','process-context ID से TLB tags; task switch पर पूरा TLB flush बचत (Intel Haswell+, AMD Zen)','आधुनिक OS इसे KPTI (Meltdown mitigation) के साथ चलाते हैं'],
      ['Page fault','required page RAM में नहीं → CPU fault देता है → OS load/zero व restart','hard fault = disk से (~ms); demand-zero; soft fault = मौजूद पर unmapped'],
      ['MMU','on-die translation + protection (U/S, R/W, NX) की unit; PKU/PKEY जैसे extras','आधुनिक CPU में core के साथ — मेमोरी कंट्रोलर भी on-die'],
      ['PAE (32-bit)','Pentium Pro+ में 36-bit physical → 64 GB तक RAM पहचान, पर प्रति process virtual 4 GB ही','Windows 32-bit desktop पर 4 GB छत; user-space default 2 GB (/3GB से 3 GB); server एडिशन की PAE limit अलग'],
      ['64-bit address','x86-64 वास्तव में 48-bit virtual (256 TB) + 52-bit physical; <b>LA57</b> विकल्प → 57-bit (128 PB); AMD/Intel समान','आज की RAM 48-bit से बहुत नीचे — "16 EB" का नारा वास्तविकतः address space का गणित है'],
      ['UMA vs NUMA','UMA: हर कोर RAM equally दूर (single socket); NUMA: multi-socket में "अपना" memory channel पास, दूसरे socket दूर','Linux numactl / Windows process affinity; NUMA-unaware app धीमा']
    ]},

  {type:'table', head:['सेट/extension','वर्ष','चौड़ाई/काम','किसी ध्यान दें (video/edit/emulation)'],
    rows:[
      ['x87 FPU','1980','80-bit रजिस्टर stack','आज float के लिए SSE उपयोग; legacy'],
      ['MMX','1997','64-bit integer SIMD','बहुत पुराना; GPR साझा'],
      ['SSE / SSE2','1999 / 2000','128-bit float/int','SSE2 अनिवार्य x86-64 में; हर आधुनिक app'],
      ['SSE3 / SSSE3','2004 / 2006','128-bit + shuffle/hadd','emulation/JIT अक्सर SSSE3 माँगती हैं'],
      ['SSE4.1 / 4.2','2007 / 2008','blend, CRC32, POPCNT','4.2 के string-helpers कुछ codecs/apps'],
      ['AVX / AVX2','2011 / 2013','256-bit FMA-less / FMA, integer lanes','<b>सबसे उपयोगी आज</b>: x264/x265, DaVinci, Premiere, emulation (RPCS3/Yuzu आदि AVX2 फ़ॉलबैक)'],
      ['FMA','2013','fused multiply-add','math-heavy codecs; AVX2 के साथ ही आम'],
      ['AVX-512','2016+ (Xeon Phi/SP)','512-bit, 32 vector regs; कई sub-sets (VBMI, VNNI, BF16)','Intel desktop (Alder Lake+) ने हटा दिया; <b>AMD Zen 4</b> = double-pumped, <b>Zen 5</b> = full-width; Apple AVX-512 नहीं (अपना NEON/SVE); HPC/AI inference में मायने'],
      ['VBMI / VBMI2','2017+','byte-shuffle (512)','zstd/joins जैसी AVX-512-optimized routines'],
      ['AES-NI','2010','hardware AES round','BitLocker, TLS/VPN, zip/7z encryption — बहुत बड़ा speedup'],
      ['SHA extension','AMD 2013','SHA-1/256 hardware','hashes, git, TLS'],
      ['AMX','2023 (Intel server: Sapphire Rapids+)','tile-based matrix int8/bf16','AI inference server; client नहीं']
    ]},

  {type:'table', head:['तकनीक','Intel','AMD','काम'],
    rows:[
      ['Basic VMX','VT-x','AMD-V','hypervisor को ring -1; VM entry/exit; guest का own VMM support'],
      ['I/O passthrough','VT-d (IOMMU, interrupt remapping)','AMD-Vi (IOMMU)','GPU/NIC device को सीधे VM देना (VFIO, SR-IOV)'],
      ['Nested paging','EPT','NPT / RVI','guest के virtual->direct->physical translation hardware में — software shadow pages से तेज़'],
      ['चेक कैसे?','Task Manager → Performance → CPU → "Virtualization: Enabled"; CPU-Z में flag; AMD BIOS में <b>SVM Mode</b>, Intel BIOS में VT-x/VT-d','—','BIOS में SVM बंद = VMware/Hyper-V/Android emulator अक्सर fail'],
      ['Hyper-V टकराव','Hyper-V/WSL2/VBS on होने पर hypervisor पहले से चलता है — VirtualBox पुराने versions पर VT-x नहीं मिलता; आज Hyper-V API से चलेगा पर धीमा','—','solution: Hyper-V/VM-platform off करके reboot, या <code>bcdedit /set hypervisorlaunchtype off</code>'],
      ['आधुनिक additions','unrestricted guest, APIC virtualization, posted interrupts, VM-function restrictions','AMD भी समान features (AVIC वगैरह)','Type-1 hypervisor (ESXi/Hyper-V) इन्हीं पर तेज़ है; BIOS में VT-d/SVM + Above-4G decoding ज़रूरी (passthrough के लिए)']
    ]},

  {type:'table', head:['शब्द','अर्थ','ध्यान देने लायक'],
    rows:[
      ['TDP (पुराना)','thermal design power — cooler कितनी गर्मी निपटाए','12वीं पीढ़ी से Intel ने इसे नाम में नहीं रखा'],
      ['PBP (Processor Base Power)','Intel 12+ — base power; PL1 से मेल; पूरे कोर इस पर चल सकते हैं','13400 जैसा ~65W'],
      ['MTP (Max Turbo Power)',' turbo पर चोटी खपत; PL2/τ के लिए अनुमति','i9-13900K: 125W PBP, 253W MTP'],
      ['AMD cTDP','बदलने-योग्य thermal config','5700X3D जैसी low-power SKU; BIOS presets; PBO (Precision Boost Overdrive) पावर-बजट बढ़ाता है'],
      ['Boost algorithm','CPPC/P-state: माँग के अनुसार clock; single-core boost सबसे ऊँचा; सीमा लगाने वाले: power limits (PL1/PL2 या PBP/MTP), TDC/EDC (करंट), thermal, silicon quality','Ryzen Master/HWiNFO में Fmax का घट-बढ़ सामान्य'],
      ['Thermal throttling','Tjmax (Intel ~100 °C, Zen4/5 ~95 °C target) पर clock तुरंत घटते','लक्ष्य: 100 °C = डिज़ाइन बिंदु, नहीं जलने अर्थ'],
      ['Power/current throttling','VRM कमज़ोर या MTP limit → थ्रॉटल बिना गर्मी','HWiNFO: Core/Limit Reason bits (Thermal, PL1/PL2, Current), VRM thermistor'],
      ['Undervolting','offset से समान clock कम V → कम heat; पर हर chip का silicon lottery अलग; आज कई नई BIOS (खासकर laptop व non-K Intel 14th+) offset block करती हैं','सावधान: unstable undervolt = random WHEA/BSOD; V/f curve परीक्षण ज़रूरी'],
      ['SVID व VRM','CPU माइक्रोसेकंड-सटीक Vcore माँगता (SVID); motherboard की VRM phases इसे देते हैं','phase/heat की पहचान मदरबोर्ड विषय में — यहाँ दोहराव नहीं']
    ]},

  {type:'table', head:['पैकेजिंग/तंत्र','विवरण'],
    rows:[
      ['Monolithic vs MCM/chiplet','एक die बनाम कई die एक package में; AMD Zen ने चिपलेट (CCD + IOD) से yield/लागत सुधारी; Intel भी Arrow Lake व server chips में chiplet'],
      ['CCD/CCX','Zen: CCD = अधिकतम 8 कोर + साझा L3; CCX = L3 से जुड़े कोरों का समूह (Zen 2 में 4, Zen 3+ में 8); CCDs IOD से Infinity Fabric से जुड़े; inter-CCX L3 miss महँगा (gaming में 1-CCD SKU बेहतर)'],
      ['EMIB (Intel)','embedded multi-die bridge — PCB में छिपा silicon bridge, die-to-die उच्च-bandwidth, सस्ता/सरल; Ponte Vecchio जैसी बड़ी चिप'],
      ['CoWoS (TSMC)','silicon interposer पर die + HBM साइड-बाय-साइड — AI accelerator (GPU+HBM) का मानक'],
      ['Foveros (Intel)','3D stacking — die सीधे दूसरे die के ऊपर; Lunar Lake में LPDDR5X package पर और compute/SoC die stacked'],
      ['Hybrid bonding','copper bumps को सीधा copper से जोड़ा (bumpless); AMD 3D V-Cache और आधुनिक 3D NAND इसी सिद्धांत से ऊँची density/कम thermal path'],
      ['Process node','7/5/3 nm = marketing शॉर्ट-नेम, असल gate length नहीं; हर पीढ़ी ~समान या छोटे transistors और बेहतर perf/watt; TSMC N3 vs Intel 4 vs Samsung 3 — node numbering तुलनीय नहीं']
    ]},

  {type:'table', head:['Interconnect','कालक्रम/विशेषता'],
    rows:[
      ['FSB (Front Side Bus)','parallel, shared bus — north bridge से CPU तक; Core 2/Nehalem-से-पहले की सीमा; contention से ऊबकर हटा दिया गया'],
      ['QPI (Intel 2008) → UPI','point-to-point serial link; QPI ~4.8–8.0 GT/s प्रति lane, UPI आधुनिक पीढ़ियों में ~10.4–16 GT/s; multi-socket coherence'],
      ['HyperTransport (AMD 2003) → Infinity Fabric','HT 3.x ~3.2 GT/s प्रति lane (16-lane link); IF = AMD का on-die + die-to-die दोनों का बस — clock FCLK/UMCLK ratio से जुड़ा, latency इसी से तय'],
      ['DMI/PCH link','CPU↔चिपसेट; DMI 3.0 x8 ~7.96 GB/s — chipset से जुड़े सभी USB/NVMe/PCIe इस साझा रास्ते पर'],
      ['PCIe lanes','CPU-सामान्य (desktop: x16 GPU + x4 M.2 अक्सर CPU से; extra lanes chipसेट से, shared uplink पर निर्भर; HEDT/server: 48–128 lanes per socket) — विस्तार मदरबोर्ड topic में'],
      ['Memory controller','on-die (Nehalem/AMD 2003 से); dual-channel desktop, 8-channel server; support DDR5-4800/5600 (Intel), DDR5-5600 (AMD) — OC margin IMC पर'],
      ['iGPU का नियम','Intel: F और KF मॉडल में iGPU बंद; plain K/U/H में UHD। AMD: AM5 Ryzen 7000/9000 में basic RDNA iGPU (डिबग/light display); AM4 non-G में नहीं']
    ]},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">1.7</span> लेबल पढ़ना — पहचान और व्यावहारिक परत</h3>
  <p><b>Intel:</b> पुराना पैटर्न <code>Core i5-13400</code> = family-tier-gen-SKU-suffix। 2023–24 का rebrand: <b>Core Ultra 5 235K</b> — Ultra = नई माइक्रो-आर्किटेक्चर लाइन (Series 1 = Meteor Lake, Series 2 = Arrow/Lunar Lake), 5 = tier, 2 = series, 35 = SKU, K = suffix; कोर में tile/NPU बदले; "Core i" और "Core Ultra" एक सीधी तुलना नहीं। <b>AMD:</b> <code>Ryzen 5 7600X</code> = tier-(generation)(SKU)(suffix); 7xxx = Zen 4 AM5, 8xxx = APUs, 9xxx = Zen 5।</p>`},

  {type:'table', head:['Suffix','Company','अर्थ/ध्यान'],
    rows:[
      ['K','Intel','unlocked multiplier, overclocking (Z-chipset); iGPU मौजूद'],
      ['KF','Intel','unlocked पर iGPU नहीं — GPU अलग हो तो सस्ता'],
      ['F','Intel','locked, iGPU नहीं (पुराने 9th+ desktop)'],
      ['T','Intel','desktop low-power (35W class) — SFF/office'],
      ['P / U / H / HX','Intel mobile','U = thin&light 9–15W; P = 12वीं पीढ़ी का 28W slim; H = 45W performance; HX = 55W+ desktop-replacement (overclockable K-HX)'],
      ['X','AMD','higher boost bin (7600X/7700X) — same silicon, factory bin'],
      ['G','AMD','desktop APU — ज़्यादा शक्तिशाली iGPU (8600G)'],
      ['GE','AMD','low-power OEM variant'],
      ['X3D','AMD','3D V-Cache stack — gaming के लिए L3 ~2x; clock थोड़ा कम, heat सीमा सख्त (पहले वाली पीढ़ी ~90 °C target)'],
      ['WX','AMD','Threadripper PRO (workstation); mobile में H/HS/U/X प्रत्यय (suffix) भी मिलते हैं'],
      ['Tray/OEM','दोनों','बॉक्स-बाहर बिकने वाली चिप — वारंटी मदरबोर्ड/OEM पर; पहचान CPU-Z से करें']
    ]},

  {type:'table', head:['औज़ार','क्या दिखाता है','लैब-उपयोग'],
    rows:[
      ['CPU-Z','पहचान (codename/stepping), live clock × multiplier, per-core VID, cache map, Instructions सेट flags (AVX2/AVX-512/VT-x), SPD tab','सबसे तेज़ "यह चिप क्या है + flags चालू/बंद"'],
      ['HWiNFO64','हर सेंसर: per-core temp, package power (W), Vcore, limit reason bits (Thermal/PL2/Current), memory IMC clock','थ्रॉटल का कारण खोजने में सबसे उपयोगी; logging चालू रखें'],
      ['Open Hardware Monitor / Core Temp','आसान ताप/fan/power','परीक्षा/demo के लिए पर्याप्त'],
      ['Ryzen Master / Intel XTU','boost/limit/PBO/undervolt live','test-tune; save करने से पहले stress ज़रूरी'],
      ['HWMonitor','सिंपल वोल्टेज ताप','दूसरा राय के लिए']
    ]},

  {type:'table', head:['Test/Tool','असल में stress/measure','व्याख्या/सतर्कता'],
    rows:[
      ['Cinebench R23','Cinema4D render, ST/MT','10-min loop = heat/throttle परीक्षण; scores तुलना के लिए (SKU-निर्भर)'],
      ['Cinebench 2024','भारी scene + GPU mode','अधिक modern code paths'],
      ['CPU-Z Bench','छोटा ST/MT','2-min quick sanity'],
      ['Geekbench 6','mixed (crypto/compress/sql/physics)','ST/MT दो अंक; cross-platform तुलना'],
      ['Prime95 — Small FFTs','FPU+L1/L2, अधिकतम heat/पावर','VRM+cooler परीक्षण; RAM नहीं देखता'],
      ['Prime95 — Blend','mixed FFT + RAM','memory subsystem + IMC गलतियाँ पकड़ता (RAM/वोल्टेज असुरक्षित होने पर worker stops with Catastrophic error)'],
      ['Prime95 — Torture Test','Options → Torture Test (F9) से Small/Blend/Large मोड','Small = ताप/VRM, Blend = RAM/IMC; AVX2/AVX-512 विकल्प से heat और अधिक'],
      ['AIDA64 Cache & Memory','L1/L2/L3/RAM bandwidth + latency','XMP/EXPO/Gear/FCLK का असर मापने के लिए'],
      ['AIDA64 Stability Test','FPU stress + temp graph','थ्रॉटल दिखाने के लिए; ECC/parity गलती नहीं पकड़ता'],
      ['OCCT','CPU/Power/VGA + auto-error detect','power-supply और CPU दोनों पर; error reporting अच्छी'],
      ['y-cruncher','PI/SQRT, AVX-512 path, RAM test','intensive + stability दोनों'],
      ['RealBench / M Stress x64','RAM+CPU mix stress','XMP instability के लिए पुराना classic'],
      ['CrossMark','व्यावहारिक app-like productivity','एक अंक — ST-heavy'],
      ['3DMark CPU Profile','thread ramp (1/2/4/8/16)','कोर limit पर scaling; game CPU bottleneck'],
      ['Blender Benchmark','open-scene render MT','workstation तुलना'],
      ['HandBrake','x264/x265 encode — AVX2','असली video-work speed; instruction-set का असर'],
      ['Gaming FPS (Fraps/OBS) + Frame metrics','असली engine CPU cost (single/low-thread)','GPU-bound में CPU अंतर छिप जाता — resolution घटाकर isolate करें']
    ]},

  {type:'table', head:['स्थिति','सुरक्षित परिसर (typical)','चेतावनी-स्तर'],
    rows:[
      ['Temperature idle (desktop)','30–50 °C (>10 °C ambient)','— ; 60+ idle = dust/pump/paste'],
      ['Temperature under load','gaming 55–80, render ≤ Tjmax (Intel ~100 target पर throttled, Zen4/5 ~95)','स्थाई 95–100 = cooler पर्याप्त नहीं'],
      ['Laptop sustained','90–98 सामान्य (design), throttle पर वहाँ','frame drops + hot keyboard = repaste/fan'],
      ['Vcore (stock, auto)','लगभग 0.9–1.35 V (VID से चलता)','manual >1.4 V स्थायी — विशेषज्ञ+अच्छा cooling; >1.45 जोखिम भरा (electromigration)'],
      ['DDR5 VDIMM','1.1 V JEDEC; XMP प्रायः 1.25–1.40 V','1.45+ स्थाई पर DDR5 degradation (Intel spec guidance); PMIC heat देखें'],
      ['SoC/VDDCR_CPU (AMD)','auto; OC पर ~1.2–1.3; SoC ≤1.30 दैनिक अनुशंसित','PBO SoC limit को न छोड़ें'],
      ['VRM temp (board)','80–100 °C सामान्य भार पर','110+ = board limit, throttling ज़रूरी']
    ]},

  {type:'steps', items:[
    {n:1, title:'पहले "आधार-रेखा" बनाइए', text:'BIOS defaults + XMP off, cool ambient; HWiNFO logging चालू कर 10-min Cinebench/Prime95 Small चलाइए। रिकॉर्ड: temp curve, all-core clock, package W, limit reason।'},
    {n:2, title:'तीनों संकेत एक साथ देखिए', text:'<b>सीढ़ी-सीढ़ी clock घटते + temp target पर</b> = thermal throttling (CPU ठीक, cooling कम)। <b>बिना warning तुरंत freeze/reboot</b> = power instability (undervolt/VRM/PBP-MTP) या faulty। <b>कोई heat नहीं, clock स्थिर पर random BSOD/WHEA</b> = CPU/IMC/RAM त्रुटि।'},
    {n:3, title:'गर्मी के शक पर cooler जाँच', text:'पंखा चलता है? paste सूखा? heat-sink ऊपर से गरम पर base ठंडा (mount दबाव कम)? pump (AIO) का vibration? कूलर बदलकर/लगाकर दोबारा मापो — अगर थ्रॉटल गायब = CPU निर्दोष।'},
    {n:4, title:'पावर-अस्थिरता का परीक्षण', text:'BIOS में MTP/PL2 limit मैन्युअल कर (जैसे 125W) → stability आती है? VRM overheat? Undervolt किया था तो वापस 0 offset। Event Viewer में WHEA-Logger ID देखें।'},
    {n:5, title:'RAM/IMC को अलग', text:'एक stick, XMP off, MemTest86; clocks manual DDR5-3600/4800 करके। IMC त्रुटियाँ CPU-सीमित दिखती हैं (core offset या SOC voltage से बदलती हैं)।'},
    {n:6, title:'सबसे सरल असली जाँच — swap', text:'संदिग्ध CPU दूसरे compatible board में (या known-good CPU इसी board में)। दोबारा वही गलती = CPU दोषी; ठीक = board/cooling/RAM दोषी। यही servicing topic के diagnostic flow से मिलता है।'},
    {n:7, title:'दोषी साबित होने पर RMA', text:'CPU पर बेंचमार्क crash + BIOS defaults + verified cooler पर भी हार → vendor से RMA (serial, BIOS log, stress report साथ)।'}
  ]},

  {type:'acc', title:'CPU माइक्रोआर्किटेक्चर — इंटरव्यू/परीक्षा 12 प्रश्न', items:[
    {q:'Q. IPC क्या है? कोई इसे क्यों मापता?', a:'<b>Instructions per cycle</b> — प्रति घड़ी-चक्र पूरे हुए निर्देश। कुल गति = f × IPC × कोर। समान GHz पर IPC ↑ = आर्किटेक्चर पीढ़ी ↑; यही 2006 के बाद की GHz-दौड़ रुकने का कारण।'},
    {q:'Q. 5 GHz का पुराना CPU और 5 GHz का आधुनिक CPU — फ़र्क?', a:'पुराने में IPC ~2–3, छोटा cache, बिना prediction, कम width; नए में IPC ~6+, µop cache, बड़ी OoO window, AVX2। चरणों में GHz समान पर काम 2–5 गुना।'},
    {q:'Q. Hyper-threading/SMT में असली कोर कितने?', a:'कोर एक; थ्रेड दो। fetch/decode/scheduler/regs साझा। फायदा तभी जब एक थ्रेड रुका हो और execution unit खाली। भारी AVX workload में 0–5% ही।'},
    {q:'Q. L1/L2/L3 में से सबसे बड़ा और सबसे छोटा कौन?', a:'सबसे बड़ा: L3 (साझा, MB में); सबसे छोटा-तेज़: L1 (KB में, 3–5 cycle)। Line size सबमें 64 B।' },
    {q:'Q. MESI बताइए — M/E/S/I के संक्षिप्त अर्थ?', a:'Modified (मेरे पास केवल और dirty), Exclusive (केवल मेरे पास clean), Shared (कई जगह clean), Invalid (पुरानी)। coherence protocol के चार अवस्थाएँ; snooping/directory से प्रबंधित।'},
    {q:'Q. TLB miss और page fault में अंतर?', a:'TLB miss: translation मिलता है, हार्डवेयर page-walk करता है (सैकड़ों cycle, program को पता नहीं)। Page fault: page RAM में ही नहीं — OS invoke होकर load करता है (milliseconds)।'},
    {q:'Q. 32-bit Windows 4 GB से ज़्यादा RAM क्यों नहीं चलाता?', a:'32-bit virtual address space = 2^32 = 4 GB प्रति process; PAE से physical 64 GB तक हो सकता पर mapping व API limitation; user-space प्रायः 2–3 GB।'},
    {q:'Q. TDP का मतलब सिर्फ़ power consumption?', a:'नहीं — thermal design power, cooler कितनी heat निपटाए। Actual draw burst पर अधिक; Intel 12+ में PBP/MTP; AMD में cTDP/PBO।'},
    {q:'Q. Von Neumann vs Harvard?', a:'Von Neumann: निर्देश+डेटा एक ही मेमोरी व बस में; Harvard: अलग-अलग (L1i/L1d अलग cache — internal Harvard; ARM Cortex-M Harvard)।'},
    {q:'Q. Branch mispredict क्यों सस्ता नहीं?', a:'पूरा speculative pipeline (सैकड़ों µop) फेंकना + fetch PC ठीक करना — 12–20 cycle या उससे अधिक, तब तक कोई नया काम नहीं।'},
    {q:'Q. AVX-512 क्या है, आज किसमें?', a:'512-bit SIMD + 32 vector regs। Intel desktop ने हटाया; server में है। AMD Zen4 partial (double-pumped), Zen5 full-width; Apple/ARM इस ISA में नहीं (उनका NEON/SVE)।'},
    {q:'Q. "CPU गड़बड़ है" — कैसे सिद्ध?', a:'BIOS defaults + verified adequate cooling + swap-test (other board/CPU) + WHEA/crash logs; thermal और instability पहले खारिज — फिर RMA।'}
  ]},

  {type:'callout', kind:'exam', title:'परीक्षा में सबसे ज़्यादा पूछे जाने वाले', html:'<ol><li><b>ALU</b> का कार्य (arith/logic), <b>CU</b> का कार्य (timing/signal) और <b>registers</b> (PC, MAR, MDR, ACC, FLAGS) की एक-लाइन परिभाषाएँ।</li><li><b>Fetch-decode-execute</b> चक्र का चित्र।</li><li><b>Cache तीन स्तर</b> क्यों — speed-gap और locality।</li><li><b>Hyperthreading</b> = logical core, physical नहीं; लाभ 15–30%।</li><li><b>32 vs 64-bit</b> — addressable 4 GB vs ~256 TB virtual; register चौड़ाई।</li><li><b>TDP</b> ≠ अधिकतम खपत; <b>IPC</b> = प्रति cycle काम।</li></ol>'}
  ]
},

/* ===================================================================
   HW-MEM · RAM के अंदर — DDR, टाइमिंग व ECC
   =================================================================== */
{
  id:'hw-mem', icon:'🧮', group:'हार्डवेयर गहराई',
  title:'RAM के अंदर — DDR, टाइमिंग व ECC',
  sub:'DRAM cell, DDR1–DDR5, LPDDR/GDDR, ranks, XMP/EXPO, ECC व फ़ॉल्ट पहचान',
  kicker:'Hardware Depth 2 · Memory Technology',
  hero:'RAM दिखती है सिर्फ़ एक पट्टी — पर इसके अंदर DRAM cell की भौतिकी,_ddr की पीढ़ियाँ, SPD की सेटिंग्स, XMP/EXPO के झूठ-सच और ECC की_politics सब चलता है। यह पृष्ठ वही अंदर की परत खोलता है; स्लॉट/चैनल की भौतिक पहचान मदरबोर्ड व सर्विसिंग विषयों में पहले से है।',
  tags:['DRAM 1T1C','DDR1–DDR5','SPD/XMP/EXPO','ranks व channels','ECC/SECDED','MemTest व diagnosis'],
  blocks:[

  {type:'html', html:`<h3 class="blk"><span class="blk-n">2.1</span> मेमोरी का परिवार — कौन कहाँ</h3>
  <p>मेमोरी दो गुण से बँटती है: <b>volatile</b> (बिजली जाने पर भूल जाए) और <b>non-volatile</b> (याद रहे)। RAM इसमें volatile है, ROM/NAND storage non-volatile।</p>`},

  {type:'table', head:['प्रकार','volatile?','कहाँ मिलती है','गति/कीमत'],
    rows:[
      ['SRAM','हाँ','CPU कैश (L1–L3)','सबसे तेज़, सबसे महँगी (6T/cell)'],
      ['DRAM','हाँ','main RAM (DDR DIMM)','काफ़ी तेज़, सस्ती (1T1C/cell)'],
      ['SDRAM','हाँ','DDR की जननी — clock से sync','SDR→DDR (दोनों edge पर डेटा)'],
      ['ROM/PROM/EPROM/EEPROM','नहीं','BIOS/फ़र्मवेयर','धीमी/मंथर; flash आज मानक'],
      ['NOR flash','नहीं','BIOS चिप (execute-in-place)','छोटी, सीधी पढ़ी जा सके'],
      ['NAND flash','नहीं','SSD/USB/SD/eMMC','बड़ी capacity, block-erase (स्टोरेज topic देखें)']
    ]},

  {type:'table', head:['स्तर','आकार (typical)','देरी (typical)','कीमत (bit प्रति)'],
    rows:[
      ['Registers','कुछ सौ byte (core के अंदर)','~0 (1 cycle से कम)','अनंत के लगभग — die का हिस्सा'],
      ['L1 कैश','32–48 KB/कोर','~1–1.5 ns','₹₹₹₹ (SRAM)'],
      ['L2/L3','MB–सैकड़ों MB','~4–20 ns','₹₹₹'],
      ['DRAM (DDR5)','8–128 GB प्रति PC','~70–120 ns','₹'],
      ['SSD (NVMe)','256 GB–8 TB','~20–100 µs (read)','₹/GB DRAM से कम पर टिकाऊ नहीं (endurance)'],
      ['HDD','1–24 TB','~5–15 ms (seek)','सबसे सस्ता GB, सबसे धीमा इकाई']
    ]},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">2.2</span> DRAM cell — 1 ट्रान्ज़िस्टर + 1 कैपेसिटर (1T1C)</h3>
  <p>एक bit = एक सूक्ष्म कैपेसिटर (चार्ज = 1, खाली = 0) और एक access ट्रान्ज़िस्टर (wordline चालू तो bitline से जुड़े)। समस्याएँ — कैपेसिटर धीरे-धीरे leak होता है, पढ़ते ही discharge हो जाता है (destructive read)।</p>
  <table class="tbl"><thead><tr><th>आधुनिक cell</th><th>कैसे</th><th>नतीजा</th></tr></thead><tbody>
  <tr><td><b>SRAM (6T)</b> — flip-flop, जब तक power तब तक data</td><td>क्या दो cross-coupled inverters</td><td>तेज़, महँगा, refresh नहीं → कैश</td></tr>
  <tr><td><b>DRAM (1T1C)</b> — कैपेसिटर charge</td><td>हर ~64 ms में हर row को पढ़-पुनर्लिखना (refresh)</td><td>सस्ता, घन, धीमा → main RAM</td></tr>
  </tbody></table>
  <p><b>"Dynamic" इसीलिए</b> — charge डायनेमिक है, खुद बनी नहीं रहती। Access का क्रम: RAS (row address) → row activate → CAS (column address) → burst read/write। DRAM chip <b>banks</b> में बँटी होती है (आधुनिक DDR5 में प्रति chip 8–16 banks, bank groups भी); एक ही समय एक bank activate रहता है — दूसरे bank पर काम <b>bank-level parallelism</b> से overlap होता है। <b>Burst</b> = एक activation पर लगातार 8 या 16 डेटा beats (BL8/BC4; DDR5 में 16n prefetch)।</p>`},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">2.3</span> DDR पीढ़ियाँ — कब क्या बदला</h3>
  <svg viewBox="0 0 820 118" style="width:100%;max-width:820px;margin:4px auto;display:block">
    <g font-size="12" text-anchor="middle">
      <rect x="10" y="20" width="150" height="66" rx="8" fill="#22334a" stroke="#69c"/><text x="85" y="42" fill="#cfe">DDR (2000)</text><text x="85" y="60" fill="#9ad">2.5 V · 2n prefetch</text><text x="85" y="76" fill="#9ad">184-pin</text>
      <rect x="170" y="20" width="150" height="66" rx="8" fill="#22334a" stroke="#69c"/><text x="245" y="42" fill="#cfe">DDR2 (2003)</text><text x="245" y="60" fill="#9ad">1.8 V · 4n</text><text x="245" y="76" fill="#9ad">240-pin</text>
      <rect x="330" y="20" width="150" height="66" rx="8" fill="#22334a" stroke="#69c"/><text x="405" y="42" fill="#cfe">DDR3 (2007)</text><text x="405" y="60" fill="#9ad">1.5 V (L 1.35) · 8n</text><text x="405" y="76" fill="#9ad">240-pin</text>
      <rect x="490" y="20" width="150" height="66" rx="8" fill="#22334a" stroke="#69c"/><text x="565" y="42" fill="#cfe">DDR4 (2014)</text><text x="565" y="60" fill="#9ad">1.2 V · 8n</text><text x="565" y="76" fill="#9ad">288-pin</text>
      <rect x="650" y="20" width="160" height="66" rx="8" fill="#22334a" stroke="#6ac"/><text x="730" y="42" fill="#cfe">DDR5 (2020+)</text><text x="730" y="60" fill="#9ad">1.1 V + DIMM PMIC · 16n</text><text x="730" y="76" fill="#9ad">288-pin · 2×32-bit sub-ch</text>
      <text x="410" y="108" fill="#e9a" font-size="12"> notch और key-alignment हर पीढ़ी अलग — पुरानी RAM नए slot में बलपूर्वक भी नहीं जाती (केवल DDR2↔DDR3 notch पास-पास पर voltage अलग — फिर भी मत लगाइए)</text>
    </g>
  </svg>`},

  {type:'table', head:['पीढ़ी','वर्ष','V (nominal)','स्पीड रेंज (MT/s)','prefetch','पिन (DIMM)','ख़ास बदलाव'],
    rows:[
      ['DDR SDRAM','2000','2.5 V','200–400 (PC-1600/2100/2700/3200)','2n','184','SDR से DDR — clock की दोनों edge पर डेटा'],
      ['DDR2','2003','1.8 V','400–1066','4n','240','faster I/O clock ÷ internal (2:1)'],
      ['DDR3 / DDR3L','2007 / 2010','1.5 / 1.35 V','800–2133 (OC 2400+)','8n','240','ASIC-level notch अलग; DDR3L = low voltage (L-suffix chips)'],
      ['DDR4','2014','1.2 V','2133–3200 JEDEC; OC 3600–5000+','8n','288','bank groups, 1.2V, SPD hub; notch आगे'],
      ['DDR5','2020 (client 2021)','1.1 V (PMIC से feed)','4800–6400 JEDEC; OC 8000–9000+','16n','288 (नहीं मेल खाती DDR4 से)','दो स्वतंत्र 32-bit sub-channel/DIMM, on-DIMM <b>PMIC</b>, on-die ECC (side-band नहीं), higher density'],
      ['अधिकतम आम module','—','—','DDR4 32 GB (RDIMM 64+), DDR5 48–64 GB UDIMM आधिकारिक; 128 GB भी आ रहे','—','—','capacity chips की density से — पीढ़ी-दर-पीढ़ी दोगुनी']
    ]},

  {type:'callout', kind:'exam', title:'बैंडविड्थ का सूत्र (हर परीक्षा में)', html:'<b>Bandwidth (GB/s) = MT/s × 8 byte × channels</b><br>उदा.: DDR4-3200, dual-channel = 3200 × 8 × 2 = <b>51.2 GB/s</b>। DDR5-6000 dual = 6000 × 8 × 2 = <b>96 GB/s</b>। (×8 इसलिए कि प्रति channel data width 64 bit = 8 B; DDR5 में भी कुल 2×32 = वही 64 bit प्रति DIMM।)<br><b>CL का असली समय:</b> <code>ns = CL × 2000 ÷ MT/s</code>। DDR4-3200 CL16 = 16×2000/3200 = <b>10 ns</b>; DDR5-6000 CL30 = <b>10 ns</b> — इसलिए "बड़ा CL" बुरा नहीं, real latency बराबर है, bandwidth ज़्यादा।'},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">2.4</span> module के प्रकार — DIMM से LRDIMM तक</h3>`},

  {type:'table', head:['प्रकार','कहाँ/क्या','नोट'],
    rows:[
      ['DIMM (U-DIMM)','desktop standard unbuffered','288-pin DDR5; घरेलू मानक'],
      ['SODIMM','लैपटॉप/Mini-PC (छोटा)','DDR5 262-pin, DDR4 260-pin'],
      ['MicroDIMM / MiniDIMM','पुराने ultra-small devices','आज लगभग विलुप्त'],
      ['RDIMM (Registered)','server — address/command lines पर register (RCD) लगा','signal load कम, clock थोड़ा +1 cycle; सिर्फ़ ECC के साथ मिलती है प्रायः'],
      ['LRDIMM','server — data भी buffer (load-reduced)','बहुत बड़ी capacity (128–256 GB/DIMM ऐतिहासिक); UDIMM/RDIMM से मिलाकर मत चलाइए'],
      ['3DS / Stacked DIMM','die stack करके capacity बढ़ाई (server)','microTDV जैसी vertical addressing'],
      ['ECC UDIMM','एक extra×8 bit = 72-bit module','चलेगा केवल supportive बोर्ड/CPU पर (2.7 देखें)'],
      ['Non-ECC','62? नहीं — 64-bit data','सब desktop modules']
    ]},

  {type:'table', head:['अवधारणा','सरल अर्थ','व्यावहारिक असर'],
    rows:[
      ['Rank','एक DIMM पर chips का एक समूह जो साथ-साथ addressed हो (64-bit width)','Single-rank (1R) हल्का; dual-rank (2R) ~ थोड़ा अधिक load पर bank parallelism से <b>तेज़</b> (gaming में 2R/2-stick बेहतर)'],
      ['Channel A/B','CPU में 2 (desktop) मेमोरी चैनल; बोर्ड पर रंगों से जोड़ी','A2/B2 = दूसरे-दूसरे स्लॉट — 2 stick वहाँ लगाएँ (बोर्ड मैनुअल का नियम; रंग-जोड़ी से मेल)'],
      ['Dual/Quad channel','1 stick = single-channel (आधा bandwidth)','2×16 GB हमेशा 1×32 GB से बेहतर (दोनों चैनल + ranks); quad-channel केवल HEDT/server'],
      ['मिलाकर लगाना','अलग speed/size/rank मिले तो सब मिलकर सबसे धीमे-सुरक्षित JEDEC पर चलते हैं','XMP प्रोफ़ाइल टूट सकता है; तब तक manual पर जाइए'],
      ['मिश्रित पीढ़ी','DDR4 और DDR5 कोई board support नहीं — notch अलग','कभी मत ज़बरदस्ती लगाइए — slot/CPU दोनों मर सकते हैं'],
      ['ECC ↔ non-ECC','अधिकांश consumer UDIMM ECC के साथ boot नहीं करते (कुछ Ryzen बोर्ड छोड़कर)','सर्वर RDIMM/ECC desktop UDIMM slot पर नहीं जाती']
    ]},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">2.5</span> SPD, XMP/EXPO — RAM की "पहचान पत्र" और ओवरक्लॉक प्रोफ़ाइल</h3>
  <ul>
    <li><b>SPD EEPROM</b> — हर DIMM पर छोटी चिप (DDR5 में SPD5118 hub) जिसमेंManufacturer, capacity, timings की JEDEC प्रोफ़ाइलें व (Intel लाइसेंस पर) XMP डेटा लिखा है। BIOS पहली बार चलने पर इसे पढ़कर <b>memory training</b> करता है।</li>
    <li><b>XMP 2.0 (DDR4) / XMP 3.0 (DDR5)</b> — Intel-परिभाषित overclock profile (DRAM speed, timings, voltage; DDR5 में PMIC voltage भी)। <b>AMD EXPO</b> — उसी विचार का AMD ब्रांड (PKE/PMU)।</li>
    <li>BIOS में नाम भिन्न: ASUS में <b>DOCP</b>, कुछ बोर्ड में AOCP/EOCP — सब "XMP जैसा profile चालू करो" का अर्थ।</li>
    <li>XMP एक vendor-टेस्ट shortcut है, गारंटीड नहीं — CPU का IMC उस speed पर जाए यह CPU पर निर्भर। <b>एक समय में एक ही profile</b> चालू रखें; DOCP/EXPO मिलाकर नहीं।</li>
  </ul>`},

  {type:'table', head:['Timing','पूरा नाम/अर्थ','क्या नापती है','सरल नियम'],
    rows:[
      ['tCL','CAS Latency','column address → डेटा निकलने तक','मुख्य संख्या (XMP लेबल का पहला अंक: 36-38-38…)'],
      ['tRCD','RAS→CAS Delay','row खोलने → column पढ़ने तक','activate का खर्च'],
      ['tRP','Row Precharge','row बंद कर अगली row खोलने की तैयारी','precharge समय'],
      ['tRAS','Row Active Strobe','row खुली रहेगी (न्यूनतम)','आमतौर पर ≈ tCL+tRCD+ थोड़ा buffer'],
      ['tRC','Row Cycle','tRAS + tRP का संपूर्ण row चक्र','कम करना तेज़ पर अस्थिर'],
      ['CR','Command Rate (1T/2T)','chip-select → अगला command','2T अधिक स्थिर, थोड़ा धीमा']
    ]},

  {type:'table', head:['द्वितीयक/तृतीयक','काम','कब बदलें'],
    rows:[
      ['tRFC','refresh से अगली activate तक का सबसे लंबा समय (DRAM refresh बहुत महँगा)','DDR5 पर high density → बड़ा tRFC; gaming में कम करना तेज़ पर unstable आसान'],
      ['tRRD (S/L)','दो अलग bank को activate करने की न्यूनतम दूरी','बहुत कम = power-spike glitch; 2R modules पर संवेदनशील'],
      ['tFAW','चार activate एक दूरी के भीतर (four activate window)','बहु-rank/बहु-bank भार में throttle'],
      ['tWTR / tRTP','write→read और read→precharge switches','mixed R/W load पर थोड़ा फर्क'],
      ['tRDRD/tRDRSC SCad','same/different bank read-read','tuning का गहरा हिस्सा (manual only)'],
      ['voltage','VDIMM (1.1 JEDEC; XMP 1.25–1.4), VDDQ, VPP, CPU-side: <b>IMC/SA voltage (Intel), VSOC/VDDIO (AMD)</b>','1.4+ स्थायी VDIMM को ठंडा रखें (DDR5 heat sensitive)'],
      ['FCLK/UCLK/MCLK (AMD)','MCLK = RAM clock ÷2? (DDR — half rate), UCLK = memory controller clock, FCLK = Infinity Fabric','Zen: 1:1:1 मीठा बिंदु — DDR4-3600~3800@1800-1900 FCLK, DDR5-6000~6400@2000-2100; आगे UCLK:MCLK 1:2'],
      ['Gear (Intel)','IMC को memory clock से ratio में: <b>Gear 1 (1:1)</b> कम देरी, <b>Gear 2 (1:2)</b> अधिक speed; DDR5 पर 12th+ अधिकतर Gear 2 ऊँची speed पर, ~6000+ Gear1 IMC quality पर निर्भर','Gear 1 में stable DDR5-6000 = बेहतर latency'],
      ['Gear/SM (DDR5 training)','BIOS का "Memory Context Restore/Fast Boot" पहले boot पर लंबा training दोहराता है','बूट लंबा = training चल रहा — जल्दी मत तोड़िए']
    ]},

  {type:'table', head:['अस्थिरता का कारण','लक्षण','परीक्षण औज़ार'],
    rows:[
      ['बहुत ऊँचा XMP/SOC voltage की कमी','random BSOD (WHEA/MEMORY), freezes under load','MemTest86 (free, USB-boot) — 4–8 pass'],
      ['अस्थिर timings','गेम/compile में silent crash','TestMem5 (TM5) + anta777/1usmus profile — Windows अंदर से'],
      ['IMC थका/अपर्याप्त voltage','2× उच्च आवृत्ति पर pass पर 4 sticks fail','y-cruncher (Stress Test → Ram), Matman (Intel XMP validated)'],
      ['मिश्रित DIMMs','profile बदलने पर अचानक instability','एक-एक करके JEDEC पर परखें'],
      ['गंदे/ढीले contacts','boot पर memory beep, stick कभी-कभी गायब','reseat + eraser cleaning (2.9 देखें)']
    ]},

  {type:'steps', items:[
    {n:1, title:'XMP/EXPO से पहले JEDEC आधार', text:'BIOS default पर MemTest86 clean pass — अगर JEDEC पर भी fail, RAM/CPU IMC दोषी; tuning बेकार।'},
    {n:2, title:'XMP/EXPO चालू', text:'BIOS → Ai Overclock Tuner / A-XMP / DOCP → Profile 1। 2400–6000 MT/s सामान्य modules पर प्रायः तुरंत stable।'},
    {n:3, title:'24–48 घंटे परीक्षण', text:'TM5 (3 profile cycle ×3) या MemTest86 कम-से-कम 4 pass। Stable? परीक्षण 2 — रोज़मर्रा game/render crashes गिनिए।'},
    {n:4, title:'मैनुअल ट्यूनिंग (अब ज़रूरत पर)', text:'XMP से एक-एक चरण ऊपर: पहले VDIMM तय करें (1.35 DDR4 / 1.40 DDR5 अधिकतम ठंडे cooling पर), फिर primary timings टिक-टिक tight (32→30→28…), हर बदलाव पर MemTest।'},
    {n:5, title:'तंग करने पर crash आया तो', text:'तीन विकल्प: (a) timings वापस पिछले stable पर, (b) VDIMM +0.025 V, (c) clock −200 MT/s — यही "stability curve" tuning है; सब एक साथ मत बदलिए।'},
    {n:6, title:'सेव करने से पहले 3 दिन', text:'काम के दौरान भी गलती दिख सकती है; Event Viewer में WHEA-Logger और memory_diag (mdsched.exe) जाँच रखें।'}
  ]},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">2.6</span> ECC — ग़लती सुधार की कक्षा</h3>
  <p><b>SECDED</b> (Single Error Correction, Double Error Detection): हर 64-bit word + 8 check bits → 1-bit पलटना सुधार दें, 2-bit पकड़ लें। <b>Chip-kill/SDDC</b> symbol-based ECC (Reed-Solomon) पूरा x4 chip मरने पर भी डेटा बचाता है — server RDIMM का मानक।</p>
  <ul>
    <li><b>on-die ECC (DDR5 chips में)</b> ≠ real ECC — यह सिर्फ़ chip के अंदर की soft errors सुधारता है, module-level 72-bit नहीं। इसे "ECC" समझकर मत खरीदिए।</li>
    <li><b>Registered (buffered) और ECC अलग बातें</b> हैं; RDIMM में दोनों साथ आते हैं पर UDIMM ECC हो सकती है।</li>
    <li><b>कौन-सा सिस्टम चलाए:</b> आधिकारिक ECC = server/workstation प्लेटफ़ॉर्म (Xeon-W/Epyc/Threadripper + their chipsets)। <b>कुछ AMD Ryzen (non-Pro) + कुछ consumer बोर्ड (ASUS TUF/Business, ASRock, MSI) unbuffered ECC UDIMM BIOS में चलाते हैं — unofficial, गारंटी नहीं। अधिकांश consumer Intel बोर्ड ECC नहीं करते।</b></li>
    <li>क्यों चाहिए: निरंतर खराब bit = DB corruption/vm crashes; bit-flips (cosmic rays) असल में होती हैं — server 24×7 में गिनती बड़ी।</li>
  </ul>`},

  {type:'table', head:['अवधारणा','अर्थ','कहाँ दिखती है'],
    rows:[
      ['Correctable error (CE)','ECC ने चुपचाप सुधार दिया — user को पता नहीं','iDRAC/iLO/IPMI, Linux EDAC counter, Windows event log "Memory - corrected ECC error"'],
      ['Uncorrectable error (UE)','2+ bit गलत — या तो process को मारो या panic','MCE (Machine Check Exception), WHEA-Uncorrectable, BSOD, मशीन halt'],
      ['Scrubbing','background में memory दोबारा पढ़-लिखकर silent corruption पकड़ना','BIOS/BMC setting'],
      ['Mirroring','दो चैनल में डेटा की नकल — half capacity, सुरक्षा','server memory mode'],
      ['Sparing (rank/smart)','reserve rank/chip खराब हिस्से को replace','server memory mode'],
      ['DIMM LEDs/beep','बोर्ड पर memory fault LED; POST beep codes (1 short = RAM pass; अमीर AMI = 3 short RAM)','बीप-कोड की पूरी सूची सर्विसिंग topic में'],
      ['MCE banks','CPU प्रति-unit "machine-check banks" report (IMC, core)','lscpu/mcelog, Windows WHEA']
    ]},

  {type:'table', head:['लक्षण','सबसे संभावित कारण','पहला कदम'],
    rows:[
      ['BSOD <code>MEMORY_MANAGEMENT</code>','खराब cell/अस्थिर profile','MemTest86, XMP off'],
      ['BSOD <code>PAGE_FAULT_IN_NONPAGED_AREA</code>','RAM/ड्राइवर/दोनों','safe mode + MemTest, फिर driver rollback'],
      ['WHEA-Logger frequent errors','IMC/RAM instability या CPU','voltage/offset वापस, MemTest'],
      ['ऐप crashes सिर्फ़ भार में','marginal stability (tRFC/Gear)','TM5 + थोड़ा voltage/एक clock नीचे'],
      ['बूट न हो, memory beep','stick ठीक से बैठा नहीं/मर चुकी','reseat → अलग slot → एक-एक'],
      ['फ़ाइलें corrupt, checksum fail','write path की silent गलती','डिस्क जाँचें फिर RAM (दोनों में गलती हो सकती)'],
      ['एक slot ही मरे (stick उसमें नहीं मिलती)','bent pins, slot damage, या उस चैनल का IMC','उस slot में known-good — फिर CPU socket pins देखें'],
      ['Boot पर capacity आधी दिखे','एक stick/chip-kill हिस्सा गिरा, या 4-slot dual-channel गलत जोड़ी','मैनुअल के A2/B2 जोड़ी दोबारा लगाएँ']
    ]},

  {type:'steps', items:[
    {n:1, title:'रिसीट पहले', text:'पावर बंद → stick निकाल → contact किनारे साफ़ rubber (पेंसिल eraser) से हल्का रगड़, या isopropyl 90%+; पूरी सूखाकर वापस। 80% "मरी RAM" यहीं ठीक।'},
    {n:2, title:'एक-एक stick, सही slot', text:'BIOS manual का primary slot (A2) → एक stick → boot; फिर दूसरी stick उसी slot में — stick vs slot अलग करें।'},
    {n:3, title:'slot बदलकर दोहराएँ', text:'हर slot हर stick के साथ — slot-specific failure (bent LGA pins / solder crack) यहीं पकड़ता है।'},
    {n:4, title:'XMP off कर JEDEC पर परखें', text:'stability वापस = RAM ठीक, profile/CPU IMC की कमी; तब clock −200 या timings वापस।'},
    {n:5, title:'MemTest86 4 pass (प्रत्येक stick अलग)', text:'एक stick पर error → वही दोषी; pass पर साथ में fail → combination/training।'},
    {n:6, title:'voltage/ताप HWiNFO में', text:'VDIMM सही जा रहा? DDR5 PMIC temp ~85 °C से ऊपर = throttling/training fail; cooling जोड़ें।'},
    {n:7, title:'QVL/capacity सीमा', text:'CPU spec sheet (Intel ARK/AMD product page) की max supported speed और board के max per-slot GB से ऊपर RAM = expected instability।'},
    {n:8, title:'BIOS update', text:'नई memory training/rules कई बार BIOS upgrade से 6000+ modules stable होते; board की memory changelog पढ़ें।'},
    {n:9, title:'क्लॉक/Gear घटाकर', text:'Gear 2→1? 6400→5600→4800; stable बिंदु पर ही रहें — instability से बेहतर थोड़ा धीमी RAM।'},
    {n:10, title:'IMC सही?', text:'सभी sticks हर slot में JEDEC पर pass पर XMP पर fail, और वही sticks दूसरे CPU पर pass → दोषी IMC/CPU (या socket)।'},
    {n:11, title:'RMA के लिए', text:'MemTest86 screenshot + log, serial number, lot number (SPD में भी), purchase proof — vendor पहले log माँगता है।'},
    {n:12, title:'कभी न करें', text:'मिली-जुली पीढ़ी/स्पीड ज़बरदस्ती; XMP profile का दावा बिना परीक्षण के भरोसा; ECC UDIMM को consumer board पर चालू मानकर server जैसा विश्वास।'}
  ]},

  {type:'table', head:['परिवार','वोल्टेज (typical)','गति/बनावट','कहाँ'],
    rows:[
      ['LPDDR4 / 4X','~1.1 V core, I/O 0.6/0.4','3200–4266 MT/s (16/32-bit channels)','फ़ोन/पहले tablets, thin laptops'],
      ['LPDDR5 / 5X','~1.05 V (स्तर-अनुसार), कम idle','6400–8533 MT/s','आधुनिक laptops/फ़ोन — Apple M-series, Snapdragon X'],
      ['LPDDR का नियम','—','on-board soldered — upgradable नहीं','खरीदते समय capacity सोचकर लें'],
      ['GDDR6 / 6X','~1.35 V','PAM2; 14–18 Gb/pin; 6X में PAM4 21–24','GPU VRAM (gaming cards)'],
      ['GDDR7','~1.5 V','PAM3, 24–32+ Gb/pin','आधुनिक GPU cards'],
      ['HBM2/2E/3','DRAM stack + interposer','1000+ GB/s प्रति stack (HBM3 ~800–900+), 8–12 die stack','AI accelerators/HPC GPUs (CoWoS packaging)'],
      ['eMMC/UFS','NAND आधारित','mobile storage — DRAM नहीं','फ़ोन storage — NAND vs DRAM का अंतर स्टोरेज topic में']
    ]},

  {type:'html', html:`<h3 class="blk"><span class="blk-n">2.7</span> DDR5 की नई दुनिया — PMIC, MRDIMM/CUDIMM</h3>
  <ul>
    <li><b>PMIC DIMM पर</b> — पहले मदरबोर्ड पर memory voltage regulate होती थी; DDR5 उसका नियमन DIMM पर ले आया (JEDEC 1.1 V feed)। फायदा: board सरल, per-DIMM telemetry; हानि: DIMM गर्म + board-side voltage tuning अब PMIC के अंदर से। <b>OMIC</b> (on-memory power IC) board-side companion है — बोर्ड डिज़ाइन विषय।</li>
    <li><b>CUDIMM / Clock DIMM</b> (CKD on-board) — signal integrity सुधार कर high OC speed (>8000) desktop में लाते हैं; अभी कुछ Intel 800-सीरीज़ boards + list-modules तक सीमित — emerging।</li>
    <li><b>MRDIMM</b> (Multiplexed Rank) — rank-interop multiplexing से server speed DDR5-8800 (Gen1) तक; UDIMM boards पर नहीं।</li>
    <li><b>DDR4 ↔ DDR5 boards अलग</b> — कोई adapter नहीं; notch/PMIC/protocol तीनों में फ़र्क।</li>
  </ul>`},

  {type:'kv', items:[
    {label:'Board type', value:'DDR5? DDR4?', kind:'ok', desc:'बोर्ड मॉडल के spec से मिलाएँ — पीढ़ी mixed नहीं चलती'},
    {label:'CPU max speed', value:'Intel ARK / AMD spec', kind:'warn', desc:'CPU का supported MT/s ही JEDEC ceiling; XMP overclock माना जाए'},
    {label:'Capacity ceiling', value:'max per-slot × slots', kind:'warn', desc:'CPU के rank/height limits; 4 DIMM पर speed अक्सर घटती है'},
    {label:'QVL list', value:'board manufacturer tested', kind:'ok', desc:'विशेषकर DDR5/बहुत ऊँची speed पर सबसे भरोसेमंद संकेत'},
    {label:'ECC चाहिए?', value:'workstation/server only', kind:'info', desc:'consumer पर unofficial; official ECC = Pro/Xeon platform'},
    {label:'Height/Clearance', value:'tall cooler vs low DIMM', kind:'warn', desc:'big-air cooler/RAM heatspreader भिड़ंत — mm जाँचें'}
  ]},

  {type:'table', head:['उपयोग','2026 का व्यावहारिक सुझाव','क्यों'],
    rows:[
      ['ऑफ़िस/ब्राउज़िंग','8 GB (न्यूनतम) — 16 आदर्श','chrome+virus scan+office 8 में ठीक पर tight'],
      ['Student/general','16 GB','multi-tab + zoom + office comfortable'],
      ['Gaming','16–32 GB','आधुनिक AAA 16 माँगते हैं, background apps 32 कराते हैं'],
      ['Video editing','32–64 GB','4K timelines/effects RAM खाते हैं; 8K पर 64+'],
      ['VMs/dev','32–128 GB','प्रत्येक VM अपनी RAM; ECC सोचना यहाँ से शुरू'],
      ['DB/ERP server','128 GB+ ECC (NUMA समझकर)','capacity + reliability दोनों; RAID/DB cache अलग बात']
    ]},

  {type:'steps', items:[
    {n:1, title:'Model + slots पता करें', text:'लैपटॉप मॉडल का service manual — कितने slots, soldered कितना, max GB, DDR4/DDR5, SODIMM पीढ़ी। कुछ laptops में एक ही slot + soldered 8 GB होती है।'},
    {n:2, title:'ESD और tools', text:'पावर बंद, adapter निकाला, battery connector खोलें (internal); wrist strap या metal chassis छूकर discharge; tiny Phillips।'},
    {n:3, title:'Stick पहचानें', text:'SODIMM notch सही पीढ़ी का? (DDR4 260 vs DDR5 262-pin — दिखने में मिनट फ़र्क, manual से मिलान)।'},
    {n:4, title:'30° कोण पर डालें', text:'Notch मिलाकर ~20–30° झुकाकर contacts डालें, फिर दबाकर clips में "click" — दोनों तरफ़ equally।'},
    {n:5, title:'Boot + verify', text:'BIOS में full capacity + speed दिखे; Windows में Task Manager → Memory → "Slots used: 2" और Speed; CPU-Z SPD tab में दोनों modules।'},
    {n:6, title:'XMP/EXPO लैपटॉप पर', text:'अधिकांश laptops में profile नहीं मिलता (locked BIOS) — JEDEC speed पर ही चलने की तैयारी रखें।'}
  ]},

  {type:'acc', title:'RAM — FAQ/परीक्षा 12 प्रश्न', items:[
    {q:'Q. RAM vs ROM?', a:'RAM volatile, rewriteable, main working memory; ROM (flash) non-volatile — BIOS/UEFI फ़र्मवेयर। BIOS chip भी RAM नहीं है।'},
    {q:'Q. volatile का मतलब?', a:'power हटते ही content खोना — DRAM cell का leak/refresh इसी का कारण; refresh circuitry power पर निर्भर।'},
    {q:'Q. "DDR" क्यों?', a:'Double Data Rate — clock की दोनों edge (rising+falling) पर डेटा; effective MT/s = base clock ×2; इसलिए 1600 MHz DDR4 = "DDR4-3200" नहीं, वही 3200 MT/s नाम।'},
    {q:'Q. Dual channel क्या और कैसे?', a:'दो 64-bit चैनल साथ चलकर 128-bit जैसा width; stick A2+B2 जोड़ी में; 1 stick पर आधा bandwidth — gaming में 10–20% फ़र्क आम।'},
    {q:'Q. ECC क्या है, desktop पर?', a:'अतिरिक्त bits से CE सुधार + UE पकड़; अधिकांश consumer boards चलाती नहीं; कुछ Ryzen boards unbuffered ECC unofficial; server में side-band+chip-kill standard।'},
    {q:'Q. SODIMM vs DIMM?', a:'लैपटॉप छोटा module (260/262-pin) vs desktop लंबा (288); बिजली/सिग्नल वही protocol, सिर्फ़ form-factor; desktop DIMM लैपटॉप में नहीं लगती।'},
    {q:'Q. CL क्या?', a:'CAS latency चक्रों में; असली समय ns = CL×2000/MT/s; DDR5 का CL बड़ा पर ns बराबर-बेहतर।'},
    {q:'Q. MemTest86 कितने pass?', a:'आधिकारिक मार्गदर्शन: stability के लिए कई pass (4 आमतौर पर पर्याप्त, production 8–24); पहली errors जल्दी दिखतीं पर intermittent के लिए लंबा चलाना।'},
    {q:'Q. 2×16 vs 1×32?', a:'2×16 = dual channel + अधिक ranks → bandwidth + latency बेहतर; 1×32 सिर्फ़ single channel; upgrade में 2×16 बेहतर विकल्प।'},
    {q:'Q. XMP और DOCP में फ़र्क?', a:'XMP = Intel-licensed profile; DOCP (ASUS)/A-XMP (MSI) = वही profile AMD boards पर apply करना; EXPO = AMD का own spec।'},
    {q:'Q. rank क्या?', a:'DIMM पर 64-bit chips का एक समूह = 1 rank; अधिक ranks = अधिक bank parallelism पर अधिक electrical load; server LRDIMM ranks buffer करते हैं।'},
    {q:'Q. LPDDR laptop में upgrade?', a:'सिर्फ़ SODIMM slots वाले मॉडल में; LPDDR chips soldered → capacity पहली खरीद में ही तय करें।'}
  ]},

  {type:'callout', kind:'exam', title:'परीक्षा-झलक', html:'<ol><li>DRAM = <b>1T1C</b>, refresh ~64 ms; SRAM = 6T, कैश।</li><li>वोल्टेज क्रम: DDR 2.5 → DDR2 1.8 → DDR3 1.5 → DDR4 1.2 → DDR5 1.1 (+DIMM PMIC)।</li><li>Bandwidth = MT/s × 8 × channels; CL ns = CL×2000/MT/s।</li><li>Pins: 184/240/240/288/288; SODIMM 262 (DDR5)।</li><li>ECC: SECDED 1-bit CE, 2-bit UE; chip-kill पूरा chip बचाता; on-die ≠ real ECC।</li><li>SPD में JEDEC/XMP/EXPO profiles; BIOS training करती है।</li><li>Consumer board + ECC UDIMM = "शायद चले", गारंटी नहीं।</li></ol>'}
  ]
},
]);

window.CL_SECTIONS = (window.CL_SECTIONS || []).concat([
{
  id:'hw-store', icon:'💾', group:'हार्डवेयर गहराई',
  title:'स्टोरेज के अंदर — NAND, NVMe व RAID',
  sub:'HDD की भौतिकी, NAND सेल, कंट्रोलर, TBW, TRIM, SMART, NVMe और RAID स्तर',
  kicker:'Hardware Depth 3 · Storage Internals',
  hero:'SSD केवल "तेज़ हार्ड डिस्क" नहीं है — उसके अंदर एक पूरा छोटा कंप्यूटर (controller) चलता है जो तय करता है कि आपका डाटा किस सेल में जाएगा, कब मिटेगा और कब नक़ल बनेगी। यह पृष्ठ HDD की प्लैटर-हेड भौतिकी से लेकर NAND के SLC/MLC/TLC/QLC सेल, wear leveling, TBW, TRIM, SMART की पंक्तियाँ, NVMe बनाम SATA, M.2 की keys और RAID 0/1/5/6/10 तक जाता है। स्टोरेज की बुनियादी पहचान के लिए पहले "स्टोरेज" विषय देख लें; यहाँ भीतर की परत है।',
  tags:['HDD बनाम SSD','NAND सेल व 3D NAND','TBW व wear leveling','TRIM व SMART','NVMe व M.2 keys','RAID 0/1/5/6/10'],
  blocks:[

  { type:'callout', kind:'info', title:'इस पृष्ठ को पढ़ने के बाद आप क्या कर पाएँगे', html:'<p>1) HDD और SSD की बनावट व उनकी असली सीमाएँ बता सकेंगे। 2) SLC/MLC/TLC/QLC और 3D NAND का अंतर समझकर SSD ख़रीद सकेंगे। 3) TBW, DWPD, DRAM cache और SLC cache का अर्थ पढ़कर दुकानदार के दावे जाँच सकेंगे। 4) CrystalDiskInfo की SMART पंक्तियाँ पढ़कर मरती डिस्क पहले पहचान सकेंगे। 5) SATA/AHCI बनाम NVMe/PCIe और M.2 की B/M key में फ़र्क़ कर सकेंगे। 6) RAID 0/1/5/6/10 का गणित करके सही स्तर चुन सकेंगे। 7) TRIM, Secure Erase और cloning सुरक्षित ढंग से कर सकेंगे।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.1</span> HDD के अंदर — प्लैटर, हेड, ट्रैक और सेक्टर</h3><p><b>HDD (Hard Disk Drive)</b> में एल्युमिनियम या काँच की गोल <b>platter</b> होती हैं जिन पर चुम्बकीय परत चढ़ी होती है। एक spindle motor उन्हें 5400 या 7200 RPM (सर्वर में 10k/15k) पर घुमाता है। हर सतह के ऊपर एक <b>read/write head</b> होता है जो actuator arm पर तैरता है — हेड प्लैटर को छूता नहीं, हवा की पतली परत पर उड़ता है। सिर हिलने और प्लैटर घूमने से कोई भी जगह पहुँची जाती है।</p><p>प्लैटर पर संकेंद्रित वृत्त <b>track</b> कहलाते हैं, हर track के टुकड़े <b>sector</b> (आज 4096 byte logical, जिसे 512e कहा जाता है), और सब platterों के एक ही व्यास वाले tracks मिलकर <b>cylinder</b> बनाते हैं। पुरानी CHS (Cylinder-Head-Sector) addressing की जगह अब <b>LBA (Logical Block Addressing)</b> है — सीधा सेक्टर नंबर।</p>' },
  { type:'table', head:['HDD शब्द','अर्थ','व्यावहारिक असर'], rows:[
    ['Seek time','हेड को सही track तक पहुँचने का समय (~4–12 ms)','random छोटे काम में यही सबसे बड़ी देरी है'],
    ['Rotational latency','चाहा सेक्टर हेड के नीचे आने का इंतज़ार (औसत = आधा चक्कर)','7200 RPM → ~4.17 ms, 5400 → ~5.56 ms'],
    ['Access time','seek + rotational latency','HDD का random access ~8–15 ms; SSD ~0.05–0.1 ms'],
    ['Sustained transfer','लगातार बड़ी file की गति (150–260 MB/s)','बाहरी track तेज़, भीतरी धीमा — zoned recording'],
    ['Cache / Buffer','डिस्क पर 64–512 MB DRAM','छोटे writes इकट्ठा करके क्रम से लिखती है'],
    ['Areal density','प्रति वर्ग इंच बिट','बढ़ने से गति व क्षमता दोनों बढ़ती हैं'],
    ['CMR (Conventional)','tracks अलग-अलग, कोई ओवरलैप नहीं','लगातार और random write दोनों स्थिर — सर्वर/RAID के लिए'],
    ['SMR (Shingled)','tracks छत की टाइलों जैसे ओवरलैप','सस्ता व घना, पर बार-बार overwrite पर बहुत धीमा — archive के लिए'],
    ['Helium-filled','हवा की जगह हीलियम (कम घर्षण)','ज़्यादा platter, कम गर्मी, कम बिजली — 12 TB+ डिस्क'],
    ['MTBF / AFR','औसत विफलता अंतराल / वार्षिक विफलता दर','1.2 M घंटे MTBF ≈ ~0.7% AFR — यह गारंटी नहीं, आँकड़ा है'],
  ] },
  { type:'callout', kind:'warn', title:'HDD की तीन जानलेवा आदतें', html:'<p>1) <b>चलती डिस्क को हिलाना/उठाना</b> — हेड प्लैटर से टकराकर <i>head crash</i> कर सकता है; लैपटॉप बंद किए बिना न उठाएँ। 2) <b>बार-बार बिजली काटना</b> — हेड पार्क हुए बिना बंद हो तो सतह खरोंच सकती है। 3) <b>क्लिक-क्लिक आवाज़ को अनदेखा करना</b> — यह "click of death" है; तुरंत backup लें और डिस्क बदलें, फ़्रीज़र वाला घरेलू नुस्खा न अपनाएँ।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.2</span> SSD के अंदर — NAND सेल का भौतिक शास्त्र</h3><p>SSD में घूमने वाला कुछ नहीं है। डाटा <b>NAND flash</b> सेल में <i>floating gate</i> (या आधुनिक <b>charge-trap</b>) पर फँसे इलेक्ट्रॉनों के रूप में रहता है। इलेक्ट्रॉन भरने से सेल का <b>threshold voltage</b> बदल जाता है; कंट्रोलर उस voltage को पढ़कर बताता है कि सेल में कौन-सा मान रखा है। बिजली जाने पर भी इलेक्ट्रॉन फँसे रहते हैं — इसीलिए यह <b>non-volatile</b> है।</p><p>एक सेल में कितने bit रखें, यही SLC/MLC/TLC/QLC का फ़र्क़ है। जितने ज़्यादा bit, उतने ज़्यादा voltage स्तर पहचानने पड़ते हैं — इसलिए धीमा, कम टिकाऊ, पर सस्ता।</p>' },
  { type:'table', head:['सेल प्रकार','प्रति सेल bit','Voltage स्तर','अनुमानित P/E चक्र','गति व क़ीमत','आम उपयोग'], rows:[
    ['SLC (Single Level)','1','2','50,000–100,000','सबसे तेज़, सबसे महँगी','औद्योगिक, enterprise cache'],
    ['MLC (Multi Level)','2','4','3,000–10,000','तेज़, महँगी','पुरानी enterprise SSD, अब कम'],
    ['TLC (Triple Level)','3','8','1,000–3,000','मध्यम, सस्ती','आज की सबसे आम घरेलू SSD'],
    ['QLC (Quad Level)','4','16','300–1,000','धीमा write, सबसे सस्ती','बड़ी पढ़ने-प्रधान storage'],
    ['PLC (Penta Level)','5','32','~100–300','बहुत धीमा, प्रयोगात्मक','अभी व्यावसायिक नहीं'],
    ['pSLC (pseudo-SLC)','1 (MLC/TLC से बनाया)','2','MLC के चक्र × ~10','कार्ड/औद्योगिक में टिकाऊपन का जुगाड़'],
  ] },
  { type:'html', html:'<p><b>3D NAND</b> — पहले सेल एक समतल पर फैलाए जाते थे (planar/2D), और छोटा करते-करते 15 nm पर इलेक्ट्रॉन लीक होने लगे। समाधान था <b>ऊपर की ओर चढ़ना</b> — सेल की परतें एक-दूसरे के ऊपर। आज 176, 232, 238 और 300+ परतों वाली NAND आम है। परत बढ़ने से सेल बड़ा रखकर भी क्षमता बढ़ती है, इसलिए टिकाऊपन भी सुधरता है। इसीलिए "नई 176-layer TLC" पुरानी "64-layer TLC" से बेहतर हो सकती है।</p><p><b>NAND की संरचना</b>: सेल → <b>Page</b> (पढ़ने/लिखने की smallest इकाई, आम तौर पर 4–16 KB) → <b>Block</b> (मिटाने की smallest इकाई, कई सौ pages, जैसे 4–24 MB) → Plane → Die → Package → Channel। यही असंगति SSD की सारी चालाकी की जड़ है: <b>लिख page में सकते हैं, मिटा केवल पूरा block सकते हैं।</b></p>' },
  { type:'callout', kind:'danger', title:'SSD की सबसे बड़ी असंगति — Write amplification', html:'<p>आपने 4 KB बदला, पर SSD को पूरा block मिटाकर फिर लिखना पड़ता है क्योंकि मिटाना block-स्तर पर ही होता है। नतीजा — flash पर असल में आपसे कहीं ज़्यादा लिखा जाता है। इसे <b>Write Amplification Factor (WAF)</b> कहते हैं = (flash पर लिखा गया) ÷ (host ने लिखा)। अच्छी स्थिति में WAF ~1.1, भरी हुई डिस्क पर बिना TRIM के यह 5–20 तक जा सकता है। इसीलिए <b>SSD को कभी 90–100% न भरें</b> — 10–20% खाली जगह कंट्रोलर की साँस है।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.3</span> कंट्रोलर, FTL, Wear Leveling व Garbage Collection</h3><p>SSD के अंदर एक ARM-आधारित <b>controller</b> होता है जो firmware चलाता है। उसका सबसे अहम काम <b>FTL (Flash Translation Layer)</b> है — एक नक़्शा जो OS के LBA नंबर को असली भौतिक page पर map करता है। OS सोचता है वह सेक्टर 100 पर लिख रहा है; कंट्रोलर उसे किसी भी खाली page पर लिखकर नक़्शा बदल देता है।</p>' },
  { type:'table', head:['कंट्रोलर का काम','क्या करता है','आपको क्या दिखता है'], rows:[
    ['FTL mapping','LBA → भौतिक page का नक़्शा','OS को साधारण disk जैसी लगती है'],
    ['Wear leveling (dynamic)','नए writes खाली/कम-घिसे blocks में बाँटना','कुछ सेल पहले न मरें'],
    ['Wear leveling (static)','कभी न बदलने वाले डाटा को भी हटाकर घिसे block में भरना','पूरी डिस्क एक-सा घिसे'],
    ['Garbage Collection','आधे-भरे blocks से वैध page निकालकर पूरा block खाली करना','खाली जगह बनी रहे; भीड़ में धीमापन'],
    ['Over-provisioning','7–28% छिपी अतिरिक्त जगह','लिखने की जगह व टिकाऊपन'],
    ['SLC / pseudo-SLC cache','TLC/QLC सेल को अस्थायी 1-bit मोड में लिखना','शुरू में बहुत तेज़, cache भरते ही गिरावट'],
    ['DRAM cache','FTL नक़्शा DRAM में रखना','तेज़ random access; DRAM-less में धीमा'],
    ['HMB (Host Memory Buffer)','DRAM-less SSD सिस्टम RAM का थोड़ा हिस्सा माँगे','सस्ती NVMe में सुधार'],
    ['ECC / LDPC','पढ़ते समय बिट-त्रुटि सुधारना','पुरानी सेल भी पढ़ी जा सके'],
    ['Read disturb management','बार-बार पढ़े जाने से पड़ोसी सेल बिगड़ें तो नक़ल बनाए','डाटा सुरक्षित'],
    ['Thermal throttling','गर्मी पर गति घटाना','लंबी copy में speed गिरना'],
    ['Power-loss protection','कैपेसिटर से अधूरा write पूरा (enterprise)','बिजली जाने पर भी FTL न बिगड़े'],
  ] },
  { type:'html', html:'<p><b>SLC cache का धोखा</b> — दुकान में 5000 MB/s दिखता है, पर 50 GB की एक file copy करते समय 20–30 GB के बाद गति 400–800 MB/s (TLC) या 80–150 MB/s (QLC) पर गिर जाती है। यह ख़राबी नहीं, डिज़ाइन है: तेज़ SLC cache भर गया, अब सीधे TLC/QLC पर लिखा जा रहा है। बड़ी file/video editing के काम के लिए <b>बड़ा cache या DRAM वाली, TLC SSD</b> चुनें और असली <i>sustained write</i> benchmark देखें।</p>' },
  { type:'table', head:['टिकाऊपन का माप','पूरा नाम','अर्थ','कैसे पढ़ें'], rows:[
    ['P/E cycles','Program/Erase cycles','एक block कितनी बार मिटा-लिखा जा सकता है','सेल प्रकार पर निर्भर (ऊपर तालिका)'],
    ['TBW','Terabytes Written','वारंटी में गारंटीकृत कुल लिखावट','600 TBW = 600 TB लिखने तक वारंटी'],
    ['DWPD','Drive Writes Per Day','रोज़ पूरी क्षमता कितनी बार लिख सकते हैं','1 DWPD × 5 वर्ष × 1 TB ≈ 1825 TBW'],
    ['MTBF','Mean Time Between Failures','सांख्यिकीय औसत, व्यक्तिगत गारंटी नहीं','1.5 M घंटे = बहुत भरोसेमंद श्रेणी'],
    ['UBER','Uncorrectable Bit Error Rate','पढ़ने में असुधारनीय त्रुटि की दर','enterprise में 1e-17, घरेलू में 1e-15'],
    ['Data retention','बिना बिजली डाटा टिकने का समय','घिसी डिस्क पर कम हो जाता है','ठंडी, बंद पड़ी SSD वर्षों बाद कमज़ोर हो सकती है'],
  ] },
  { type:'callout', kind:'tip', title:'TBW का सीधा हिसाब', html:'<p>एक छात्र/ऑफ़िस उपयोगकर्ता रोज़ औसतन 10–30 GB लिखता है। साल का ≈ 3.6–11 TB। <b>300 TBW</b> वाली SSD भी 27–80 साल चलेगी — यानी घरेलू उपयोग में TBW लगभग कभी सीमा नहीं बनता। असली ख़तरा है <b>कंट्रोलर की अचानक मृत्यु</b> और <b>बिजली का झटका</b>। इसलिए "TBW कम है" से ज़्यादा ज़रूरी है <b>अच्छा ब्रांड + DRAM + नियमित backup</b>।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.4</span> TRIM, SMART व स्वस्थ-जाँच</h3><p>जब आप file मिटाते हैं तो OS केवल उसका प्रविष्टि-चिह्न हटाता है; SSD को पता ही नहीं चलता कि वे page अब बेकार हैं। <b>TRIM</b> (SATA) / <b>Deallocate</b> (NVMe) वही सूचना है — OS कंट्रोलर को बताता है "ये LBA अब खाली हैं", जिससे garbage collection पहले से कर लिया जाता है और अगला write तेज़ रहता है। विंडोज़ 7 के बाद TRIM अपने आप चालू रहता है और हर हफ़्ते <b>Optimize Drives</b> इसे दोहराता है।</p>' },
  { type:'code', code: ':: --- विंडोज़ में TRIM जाँच ---\nfsutil behavior query DisableDeleteNotify\n::   DisableDeleteNotify = 0   -> TRIM चालू (सही)\n::   DisableDeleteNotify = 1   -> TRIM बंद\n\n:: चालू करना (Administrator CMD)\nfsutil behavior set DisableDeleteNotify 0\n\n:: हाथ से optimize (SSD पर "defrag" नहीं, ReTRIM होता है)\ndefrag C: /L\n\n:: SMART सारांश (PowerShell, Admin)\nGet-PhysicalDisk | Get-StorageReliabilityCounter | Format-List\nGet-Disk | Select Number,FriendlyName,HealthStatus,OperationalStatus\n\n:: फ़ाइल-सिस्टम जाँच (SSD पर भी सुरक्षित)\nchkdsk C: /scan\n\n# --- लिनक्स में ---\nsudo smartctl -a /dev/nvme0        # पूरा SMART\nsudo smartctl -t short /dev/nvme0   # छोटा self-test\nsudo nvme smart-log /dev/nvme0      # NVMe का अपना log\nlsblk -D                            # DISC-GRAN/DISC-MAX = TRIM समर्थन\nsudo fstrim -v /                    # हाथ से TRIM\nsystemctl status fstrim.timer       # साप्ताहिक स्वतः TRIM' },
  { type:'table', head:['SMART ID / खेत','नाम','क्या देखें','ख़तरे का संकेत'], rows:[
    ['05','Reallocated Sector Count','डिस्क ने कितने ख़राब सेक्टर बदले','0 से बढ़ना = भौतिक क्षति शुरू'],
    ['C5 (197)','Current Pending Sector','संदेह में पड़े, अभी न बदले सेक्टर','कोई भी non-zero = तुरंत backup'],
    ['C6 (198)','Offline Uncorrectable','पढ़े न जा सके सेक्टर','non-zero = डाटा जा रहा है'],
    ['0A (10)','Spin Retry Count','HDD का motor घूमने में नाकाम','non-zero = motor/बिजली समस्या'],
    ['BB (187)','Reported Uncorrectable Errors','सुधार न हो सकी त्रुटियाँ','बढ़ता मान = ख़तरा'],
    ['C7 (199)','UltraDMA CRC Error','केबल/इंटरफ़ेस की त्रुटि','डिस्क नहीं — SATA केबल बदलें'],
    ['E7/E9 (SSD)','Remaining Life / Media Wearout','बचा जीवन प्रतिशत','10% से नीचे = बदलने की योजना'],
    ['F1/F2 (SSD)','Total LBAs Written / Read','कुल लिखावट','TBW से तुलना करें'],
    ['NVMe: Percentage Used','बचा/घिसा जीवन','0 → 100 बढ़ता है','100 पार = वारंटी सीमा पार'],
    ['NVMe: Media and Data Integrity Errors','असुधारनीय त्रुटि','non-zero = गंभीर','तुरंत backup + RMA'],
    ['NVMe: Available Spare','बची reserve जगह','100% से घटती है','threshold से नीचे = बदलें'],
    ['Temperature','तापमान','HDD 30–45 °C, SSD 30–60 °C','70 °C+ पर throttling व आयु घटना'],
  ] },
  { type:'callout', kind:'warn', title:'SSD बनाम HDD — कौन-सी देखभाल किस पर', html:'<p><b>SSD पर कभी defragment न करें</b> — यह व्यर्थ writes बढ़ाता है और आयु घटाता है। विंडोज़ खुद पहचानकर SSD पर “Optimize (ReTRIM)” और HDD पर “Defragment” करता है, इसलिए स्वतः अनुसूची बंद न करें। HDD पर defrag उपयोगी है (हेड की दौड़ घटती है)। दोनों पर <b>chkdsk /r</b> बिना backup के न चलाएँ — मरती डिस्क पर यह अंतिम धक्का हो सकता है; पहले <b>clone/image</b> लें, फिर मरम्मत।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.5</span> इंटरफ़ेस — SATA/AHCI बनाम NVMe/PCIe</h3><p>गति की असली सीमा डिस्क से पहले <b>रास्ता</b> तय करता है। SATA III की सीमा 6 Gb/s ≈ 600 MB/s है और उसका प्रोटोकॉल <b>AHCI</b> एक समय में एक कतार (32 command) रखता है — यह घूमने वाली डिस्क के लिए बना था। <b>NVMe</b> सीधे PCIe lanes पर चलता है, 65,535 कतारें × 65,536 command प्रति कतार — यानी SSD की समानांतरता के लिए बना। इसीलिए NVMe SSD का random 4K प्रदर्शन SATA से कई गुना है।</p>' },
  { type:'table', head:['इंटरफ़ेस','प्रोटोकॉल','अधिकतम व्यावहारिक गति','कतार','कहाँ'], rows:[
    ['SATA III (6 Gb/s)','AHCI','~550–600 MB/s','1 × 32','2.5" SSD, HDD, ऑप्टिकल'],
    ['PCIe 3.0 ×4','NVMe','~3,500 MB/s','65k × 65k','Gen3 M.2 SSD'],
    ['PCIe 4.0 ×4','NVMe','~7,000–7,400 MB/s','वही','Gen4 M.2 SSD'],
    ['PCIe 5.0 ×4','NVMe','~12,000–14,500 MB/s','वही','Gen5 SSD (गर्म — heatsink चाहिए)'],
    ['USB 3.2 Gen1','BOT/UASP','~450 MB/s','—','बाहरी enclosure'],
    ['USB 3.2 Gen2','UASP','~1,000 MB/s','—','तेज़ बाहरी SSD'],
    ['USB 3.2 Gen2×2 / USB4','UASP/Tunnel','~2,000–3,800 MB/s','—','नए पोर्टेबल SSD'],
    ['SAS 12G','SCSI','~1,200 MB/s, dual-port','गहरी','सर्वर — SATA डिस्क SAS में नहीं लगती'],
    ['eMMC','सरल flash','~250–400 MB/s','कम','सस्ते लैपटॉप/टैबलेट — बदली नहीं जा सकती'],
    ['UFS','NVMe-जैसा','~1,200–4,000 MB/s','गहरी','आधुनिक फ़ोन — eMMC से बहुत तेज़'],
  ] },
  { type:'table', head:['Form factor / Key','किनारे का निशान','क्या चल सकता है','सावधानी'], rows:[
    ['2.5" SATA','कोई key नहीं, SATA केबल','SATA SSD/HDD','7 mm बनाम 9.5 mm मोटाई देखें'],
    ['M.2 2280 B+M key','दो खाँचे','प्रायः SATA M.2 SSD','NVMe नहीं चलेगी — स्लॉट SATA-only हो सकता है'],
    ['M.2 2280 M key','एक खाँचा (दाएँ)','PCIe ×4 NVMe','कुछ स्लॉट SATA भी सहते हैं — manual पढ़ें'],
    ['M.2 2230 / 2242 / 22110','लंबाई 30/42/110 mm','वही प्रोटोकॉल','लैपटॉप में लंबाई सीमित; स्क्रू-पोस्ट की जगह देखें'],
    ['M.2 A/E key','Wi-Fi कार्ड के लिए','SSD नहीं','ग़लत जगह SSD लगाने की कोशिश न करें'],
    ['U.2 / U.3 (2.5")','सर्वर backplane','NVMe enterprise','घरेलू मदरबोर्ड में केबल चाहिए'],
    ['mSATA','पुराना छोटा कार्ड','SATA only','M.2 से बिल्कुल अलग — आपस में नहीं लगते'],
    ['Add-in card (AIC)','PCIe ×4/×8/×16 स्लॉट','NVMe SSD','lane बाँटने पर GPU ×8 हो सकता है'],
  ] },
  { type:'callout', kind:'tip', title:'M.2 लगाने से पहले 4 जाँच', html:'<p>1) <b>Key</b> — स्लॉट M-key है या B+M? 2) <b>प्रोटोकॉल</b> — manual में उस स्लॉट के आगे “PCIe/NVMe” लिखा है या “SATA”? कुछ स्लॉट दोनों सहते हैं, कुछ केवल एक। 3) <b>लंबाई</b> — 2280 का स्क्रू-पोस्ट मौजूद है? 4) <b>Lane बाँट</b> — कई मदरबोर्ड में दूसरा M.2 लगाने पर SATA पोर्ट 5/6 बंद हो जाते हैं या GPU ×16 से ×8 हो जाता है। यह manual की “shared bandwidth” तालिका में लिखा होता है।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.6</span> RAID — कई डिस्क को एक बनाना</h3><p><b>RAID (Redundant Array of Independent Disks)</b> का मक़सद दो में से एक या दोनों है — <b>गति</b> (डाटा बाँटकर parallel पढ़ना/लिखना) और <b>सुरक्षा</b> (नक़ल या parity रखकर एक डिस्क मरने पर भी चलना)। <b>RAID backup नहीं है</b> — यह याद रखना सबसे ज़रूरी है: ग़लती से मिटी file, ransomware या आग सब डिस्क पर एक साथ असर करेगी।</p>' },
  { type:'table', head:['स्तर','कम-से-कम डिस्क','कैसे','उपयोगी क्षमता','कितनी मर सकती हैं','कब चुनें'], rows:[
    ['RAID 0 (Striping)','2','डाटा टुकड़ों में बँटता','N × सबसे छोटी','0 — एक गई, सब गई','केवल गति; अस्थायी scratch/video cache'],
    ['RAID 1 (Mirroring)','2','हर डिस्क पर पूरा नक़ल','सबसे छोटी का आकार','N−1','छोटा सर्वर, boot डिस्क, सरलता'],
    ['RAID 5 (Striping + parity)','3','एक parity हर stripe में घूमती','(N−1) × आकार','1','पढ़ने-प्रधान file server (बड़ी डिस्क पर जोखिम)'],
    ['RAID 6 (Double parity)','4','दो अलग parity','(N−2) × आकार','2','बड़ी (4 TB+) डिस्क वाला संग्रह — आज अनुशंसित'],
    ['RAID 10 (1+0)','4','mirror के जोड़ों पर striping','N/2 × आकार','हर जोड़े से 1','डेटाबेस/तेज़ write + सुरक्षा'],
    ['RAID 01 (0+1)','4','stripe के दो सेट का mirror','N/2','एक सेट पूरा','RAID 10 से कमज़ोर — आज लगभग नहीं'],
    ['JBOD / Spanning','2','बस जोड़कर एक बड़ा volume','सब का जोड़','0 (उस डिस्क का हिस्सा जाता है)','क्षमता बढ़ाना, कोई सुरक्षा नहीं'],
    ['RAID 5E / 6E / hot spare','+1 अतिरिक्त','खाली डिस्क तैयार बैठी','ऊपर वाला घटा 1','rebuild अपने आप','दूरस्थ सर्वर जहाँ हाथ नहीं पहुँचता'],
  ] },
  { type:'html', html:'<p><b>Parity का गणित</b> — RAID 5 में हर stripe के डाटा टुकड़ों का XOR एक parity टुकड़ा बनता है: <code>P = D1 ⊕ D2 ⊕ D3</code>। कोई एक डिस्क मरे तो बाकियों से XOR करके उसका डाटा निकाल लिया जाता है (<code>D2 = D1 ⊕ D3 ⊕ P</code>)। RAID 6 में दूसरी, अलग तरह की parity (Reed–Solomon) होती है, इसलिए दो डिस्क एक साथ मरने पर भी काम चलता है।</p><p><b>Rebuild का ख़तरा</b> — 8 TB डिस्क का rebuild 10–30 घंटे लेता है और उस दौरान बाकी सब डिस्क पूरी क्षमता से पढ़ी जाती हैं। इतने बड़े संग्रह में दूसरी डिस्क के मरने या <b>URE (Uncorrectable Read Error)</b> आने की सम्भावना काफ़ी होती है — इसीलिए 4 TB+ डिस्क पर RAID 5 की जगह <b>RAID 6</b> और उसके ऊपर <b>असली backup</b> रखें।</p>' },
  { type:'table', head:['RAID का प्रकार','कौन चलाता है','लाभ','सीमा'], rows:[
    ['Hardware RAID','अलग RAID कार्ड (अपना CPU + cache + बैटरी)','OS से स्वतंत्र, तेज़ parity, hot-swap','महँगा; कार्ड मरे तो वही/मिलता कार्ड चाहिए'],
    ['Firmware / “Fake” RAID','मदरबोर्ड का चिपसेट (Intel RST, AMD RAIDXpert)','सस्ता, BIOS में सेट','असल में driver-based; मदरबोर्ड बदलने पर जोखिम'],
    ['Software RAID (mdadm)','लिनक्स kernel','मुफ़्त, लचीला, कोई hardware lock-in','CPU का कुछ काम; boot सेटअप ध्यान से'],
    ['Storage Spaces','विंडोज़','Simple/Mirror/Parity, अलग-आकार की डिस्क','Parity mode में write बहुत धीमा'],
    ['ZFS RAID-Z1/Z2/Z3','TrueNAS/FreeBSD, ZFS on Linux','checksum + self-healing + snapshot','RAM ज़्यादा चाहिए; नियम से विस्तार कठिन'],
    ['Btrfs / Synology SHR','Btrfs आधारित NAS','अलग आकार मिलाकर भी जगह बचती','बड़े बदलाव से पहले backup अनिवार्य'],
  ] },
  { type:'code', code: '# --- लिनक्स: mdadm से RAID 1 बनाना (नक़ली/अभ्यास डिस्क पर) ---\nlsblk                                # डिस्क नाम पक्का करें\nsudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc\ncat /proc/mdstat                     # rebuild की प्रगति\nsudo mkfs.ext4 /dev/md0\nsudo mkdir -p /mnt/raid1 && sudo mount /dev/md0 /mnt/raid1\nsudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf\nsudo update-initramfs -u\n\n# एक डिस्क fail करके जाँच (केवल अभ्यास मशीन पर!)\nsudo mdadm /dev/md0 --fail /dev/sdc --remove /dev/sdc\nsudo mdadm /dev/md0 --add /dev/sdc   # वापस जोड़ें -> rebuild\n\n# --- ZFS mirror (TrueNAS/Linux) ---\nsudo zpool create tank mirror /dev/sdb /dev/sdc\nsudo zfs set compression=lz4 tank\nsudo zfs snapshot tank/data@before-change\nzpool status tank' },
  { type:'callout', kind:'danger', title:'RAID के 6 “कभी नहीं”', html:'<p>1) RAID को backup न मानें — 3-2-1 नियम अलग से लागू करें। 2) एक ही ब्रांड/बैच की सब डिस्क एक साथ न लगाएँ — एक ही दोष से सब एक साथ मर सकती हैं। 3) बड़ी डिस्क पर RAID 5 न बनाएँ। 4) rebuild चलते समय दूसरी डिस्क न खींचें। 5) hardware RAID कार्ड बदलते समय configuration की नक़ल (metadata) न भूलें। 6) RAID बनाने से पहले सब डिस्क का SMART जाँचें — कमज़ोर डिस्क पर array बनाना बेकार है।</p>' },

  { type:'html', html:'<h3 class="blk"><span class="blk-n">1.7</span> Cloning, Secure Erase व Data Recovery</h3><p><b>Cloning</b> = पुरानी डिस्क की हूबहू नक़ल नई पर (OS सहित) —अपग्रेड के समय। <b>Imaging</b> = डिस्क का एक file-रूप snapshot (बाद में खोला/लौटाया जा सके)। मरती डिस्क पर हमेशा <b>पहले image</b> लें, फिर उस image पर मरम्मत/खोज करें — मूल को बार-बार चलाना उसे और बिगाड़ता है।</p>' },
  { type:'table', head:['काम','औज़ार','ध्यान रखें'], rows:[
    ['HDD → SSD clone (विंडोज़)','Macrium Reflect, Clonezilla, ब्रांड का Migration tool','लक्ष्य डिस्क बड़ी/बराबर; clone से पहले used space घटाएँ'],
    ['Sector-by-sector image','ddrescue (लिनक्स), HDDSuperClone','मरती डिस्क के लिए सबसे अच्छा — ख़राब क्षेत्र छोड़कर आगे बढ़ता है'],
    ['फ़ाइल-स्तर backup','robocopy /MIR, rsync, FreeFileSync','versioning नहीं — ग़लती से मिटाना दोनों तरफ़ जाएगा'],
    ['Versioned backup','Veeam Agent, Restic, Borg, Windows File History','ransomware से बचाव — offline/immutable copy रखें'],
    ['Secure Erase (SSD)','ब्रांड का toolbox, hdparm --security-erase, nvme format','encryption key बदलकर पूरा डाटा एक झटके में बेकार'],
    ['Secure erase (HDD)','पूरा overwrite (1 पास काफ़ी), या भौतिक नष्ट','DBAN पुराना; आधुनिक डिस्क पर एक पास पर्याप्त'],
    ['मिटी file वापसी','Recuva, PhotoRec, TestDisk, R-Studio','उसी डिस्क पर कुछ न लिखें; बचाव दूसरी डिस्क पर करें'],
    ['Partition table मरम्मत','TestDisk','पहले image लें, फिर “Analyse → Quick/Deeper Search”'],
    ['भौतिक ख़राबी (क्लिक/जलन)','केवल प्रयोगशाला / clean-room','खोलना = डाटा हमेशा के लिए जाने का जोखिम'],
  ] },
  { type:'callout', kind:'exam', title:'परीक्षा/इंटरव्यू में यहाँ से प्रश्न', html:'<p>SATA III की सीमा (~600 MB/s), NVMe का लाभ (कई कतारें), M.2 B/M key का फ़र्क़, SLC/MLC/TLC/QLC में bit व स्तर, TBW का पूरा नाम, TRIM का काम, SSD पर defrag क्यों नहीं, RAID 0/1/5/6/10 की न्यूनतम डिस्क व सहन-क्षमता, “RAID backup नहीं है”, SMART के 05/197/198 का अर्थ — ये लगभग निश्चित प्रश्न हैं।</p>' },

  { type:'labs', items:[
    { n:30, title:'SMART पढ़कर डिस्क का स्वास्थ्य रिपोर्ट बनाना', aim:'CrystalDiskInfo/smartctl से अपनी मशीन की हर डिस्क का स्वास्थ्य आँकड़ा निकालना।', tools:['CrystalDiskInfo (विंडोज़) या smartmontools (लिनक्स)', 'लैब PC जिसमें HDD और SSD दोनों हों'], steps:['CrystalDiskInfo खोलें; ऊपर टैब से हर डिस्क चुनें।', 'Health Status, Temperature, Power On Hours, Power On Count नोट करें।', 'नीचे की सूची में ID 05, C5(197), C6(198), C7(199) के RAW मान लिखें।', 'SSD पर Total Host Writes और Remaining Life/Percentage Used लिखें।', 'लिनक्स हो तो sudo smartctl -a /dev/sda और sudo smartctl -a /dev/nvme0 चलाकर वही खेत मिलाएँ।', 'एक तालिका बनाएँ: डिस्क | प्रकार | क्षमता | स्वास्थ्य | तापमान | चलने के घंटे | लिखावट | जोखिम-टिप्पणी।'], result:'हर डिस्क की भरी स्वास्थ्य-तालिका और एक स्पष्ट निष्कर्ष — कौन-सी डिस्क ठीक, कौन-सी बदलनी है।' },
    { n:31, title:'TRIM जाँचना और Optimize चलाकर पहले/बाद की गति नापना', aim:'TRIM की स्थिति पढ़ना और उसका असर मापना।', tools:['Administrator CMD/PowerShell', 'CrystalDiskMark', 'SSD वाली मशीन'], steps:['fsutil behavior query DisableDeleteNotify चलाकर मान लिखें (0 = चालू)।', 'CrystalDiskMark से SEQ1M Q8T1 और RND4K Q32T1 के आँकड़े नोट करें।', 'defrag C: /L चलाकर ReTRIM करें; “Optimize Drives” विंडो में मीडिया प्रकार “Solid state drive” दिखना चाहिए।', 'वही benchmark दोबारा चलाएँ और दोनों आँकड़े एक तालिका में रखें।', 'अंतर कम हो तो समझाएँ कि TRIM लाभ लंबे समय में दिखता है, एक मिनट में नहीं।', 'ग़लती से HDD पर defrag और SSD पर ReTRIM का अंतर लिखित रूप में समझाएँ।'], result:'TRIM स्थिति का प्रमाण, पहले/बाद के benchmark और HDD/SSD maintenance का लिखित अंतर।' },
    { n:32, title:'M.2 स्लॉट, key और lane-बाँट की पहचान', aim:'मदरबोर्ड के manual से सही SSD चुनने की क्षमता बनाना।', tools:['मदरबोर्ड/लैपटॉप का manual (PDF)', 'खुला कैबिनेट या स्पष्ट फ़ोटो', 'एक M.2 SSD'], steps:['manual में “Storage” अध्याय खोलें और हर M.2 स्लॉट की पंक्ति लिखें — नाम, key, लंबाई, PCIe Gen, lanes।', '“SATA port disabled when M.2 populated” जैसी टिप्पणी ढूँढ़कर लिखें।', 'स्लॉट का खाँचा देखकर B/M/B+M key पहचानें और SSD के खाँचे से मिलाएँ।', 'BIOS → Storage/NVMe Configuration में लगी डिस्क का नाम व link speed (Gen3 ×4 आदि) देखें।', 'निष्कर्ष लिखें — इस मशीन में कौन-सी SSD चलेगी, कौन-सी नहीं, और क्यों।'], result:'manual की storage तालिका की नक़ल + key पहचान + एक स्पष्ट ख़रीद-सिफ़ारिश।' },
    { n:33, title:'आभासी डिस्क पर RAID 1 बनाना और fail करके rebuild देखना', aim:'RAID की सुरक्षा और rebuild का समय अपने हाथ से देखना।', tools:['लिनक्स VM (VirtualBox/VMware)', '3 आभासी डिस्क (2 array + 1 spare)', 'mdadm'], steps:['VM में 2–2 GB की तीन आभासी डिस्क जोड़ें; lsblk से नाम पक्का करें।', 'sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc चलाएँ।', 'cat /proc/mdstat से sync पूरा होने तक देखें; mkfs.ext4 करके mount करें।', 'mounted folder में एक file लिखें और उसका sha256sum नोट करें।', 'sudo mdadm /dev/md0 --fail /dev/sdc --remove /dev/sdc; फिर भी file पढ़ें और hash मिलाएँ।', 'तीसरी डिस्क --add करें; rebuild का समय लिखें और अंत में hash फिर मिलाएँ।'], result:'degraded अवस्था में भी अक्षुण्ण डाटा (hash मिला), rebuild का मापा समय और भरी प्रक्रिया।' },
    { n:34, title:'SSD बनाम HDD का वास्तविक benchmark और ख़रीद-निर्णय', aim:'संख्याओं के आधार पर सही स्टोरेज चुनना सीखना।', tools:['CrystalDiskMark', 'एक बड़ी (10 GB+) test file', 'HDD व SSD दोनों'], steps:['दोनों डिस्क पर एक ही benchmark चलाएँ — SEQ1M Q8T1, SEQ1M Q1T1, RND4K Q32T1, RND4K Q1T1।', '10 GB की एक file दोनों पर copy करके समय नापें; SSD पर cache ख़त्म होने के बाद की गिरावट भी लिखें।', 'विंडोज़ boot समय दोनों पर नापें (Event Viewer → Diagnostics-Performance → Event ID 100)।', 'चार परिदृश्य लिखें — OS, गेम/बड़ी file, CCTV/सतत लेखन, ठंडा archive — और हर एक के लिए सही डिस्क चुनें।', 'लागत प्रति GB निकालकर एक पृष्ठ की ख़रीद-सिफ़ारिश लिखें।'], result:'चार-स्तंभ benchmark तालिका, copy-समय, boot-समय और तर्कसहित ख़रीद-सिफ़ारिश।' },
  ] },

  { type:'acc', title:'स्टोरेज पर अक्सर पूछे जाने वाले 14 प्रश्न', items:[
    { q:'SSD पूरी भर जाए तो क्या होता है?', a:'कंट्रोलर के पास garbage collection के लिए खाली block नहीं बचते, write amplification बढ़ता है, गति बहुत गिरती है और घिसावट तेज़ होती है। 10–20% जगह हमेशा खाली रखें; बहुत भरी डिस्क पर पहले बड़ी अनावश्यक फ़ाइलें हटाकर ReTRIM करें।' },
    { q:'क्या SSD को defrag करना चाहिए?', a:'नहीं। SSD में कोई हेड नहीं दौड़ता, इसलिए टुकड़ों में रखे डाटा से गति नहीं गिरती; उल्टा defrag हज़ारों व्यर्थ writes करता है। विंडोज़ SSD पर “Optimize” यानी ReTRIM करता है — वही सही है और स्वतः अनुसूचित रहना चाहिए।' },
    { q:'NVMe SSD SATA स्लॉट में लगेगी?', a:'M.2 स्लॉट केवल SATA support करता हो तो NVMe कार्ड फ़िट होकर भी पहचाना नहीं जाएगा। और SATA M.2 कार्ड NVMe-only स्लॉट में नहीं चलेगा। Key (खाँचा) और manual में लिखा प्रोटोकॉल — दोनों मिलाना ज़रूरी है।' },
    { q:'DRAM-less SSD लेना ठीक है?', a:'हल्के उपयोग (OS + ब्राउज़र + Office) में आज की HMB वाली DRAM-less NVMe ठीक चलती है। पर बड़ी file, बहुत सारी छोटी फ़ाइलें, या लगभग भरी डिस्क पर यह DRAM वाली से काफ़ी धीमी हो जाती है। भारी काम के लिए DRAM वाली TLC लें।' },
    { q:'SSD अचानक ग़ायब हो जाती है — कारण?', a:'अक्सर कंट्रोलर/firmware की विफलता, ख़राब SATA केबल या बिजली, या overheating। SMART में कुछ न दिखे तो भी यह हो सकता है। केबल/पोर्ट बदलकर, दूसरी मशीन में लगाकर और firmware update जाँचें; बार-बार हो तो डिस्क बदलें — डाटा वापसी महँगी है।' },
    { q:'HDD से आवाज़ आ रही है — कब चिंता करें?', a:'हल्की घरघराहट/क्लिक हेड पार्क होने की सामान्य आवाज़ हो सकती है। पर लगातार ठक-ठक, चरमराहट, या घूम-घूमकर बंद होना ख़तरे की घंटी है। तुरंत backup लें, SMART के 05/197/198 देखें और डिस्क बदलने की योजना बनाएँ।' },
    { q:'RAID 1 लगाया तो क्या backup की ज़रूरत ख़त्म?', a:'बिल्कुल नहीं। RAID 1 केवल एक डिस्क की भौतिक विफलता से बचाता है। ग़लती से मिटी file तुरंत दोनों डिस्क से मिट जाती है; ransomware दोनों को encrypt कर देगा; चोरी/आग दोनों ले जाएगी। 3-2-1 backup अलग से चाहिए।' },
    { q:'RAID 5 और RAID 6 में आज क्या चुनें?', a:'2 TB से छोटी डिस्क और छोटा array हो तो RAID 5 ठीक है। 4 TB+ डिस्क हों तो RAID 6 — क्योंकि rebuild इतना लंबा होता है कि उसी दौरान दूसरी डिस्क मरने का जोखिम असली है। RAID 6 की क़ीमत एक अतिरिक्त डिस्क और थोड़ा धीमा write है।' },
    { q:'SSD पर Secure Erase और साधारण Format में फ़र्क़?', a:'Format केवल फ़ाइल-सिस्टम की सूची मिटाता है; पुराना डाटा सेल में बना रह सकता है। Secure Erase कंट्रोलर से पूरा नक़्शा/encryption key बदलवा देता है, जिससे सब सेल एक साथ अपठनीय हो जाते हैं — सेकंडों में और बिना घिसावट के। बेचने से पहले यही करें।' },
    { q:'बंद पड़ी SSD में डाटा कितने दिन टिकता है?', a:'नई और ठंडी जगह रखी डिस्क में कई साल। पर घिसी हुई (कम बचे P/E चक्र वाली) डिस्क गर्म जगह पर कुछ महीनों में ही charge खो सकती है। “ठंडा archive” के लिए SSD से बेहतर है HDD, टेप या cloud — और हर साल जाँच करके नई copy बनाना।' },
    { q:'SMR डिस्क क्यों सस्ती है और कहाँ न लगाएँ?', a:'SMR में tracks ओवरलैप होते हैं जिससे क्षमता बढ़ती है, पर बीच में बदलने पर पूरा zone दोबारा लिखना पड़ता है। इसीलिए यह archive/एक बार लिखकर पढ़ने के काम में ठीक है, पर RAID, NAS, या लगातार छोटे writes में बहुत धीमी पड़ जाती है। वहाँ CMR लें।' },
    { q:'SSD का तापमान कितना ठीक है?', a:'idle में 30–45 °C और भारी काम में 50–65 °C सामान्य है। 70 °C के ऊपर throttling शुरू होती है और लंबे समय तक गर्म रहना आयु घटाता है। Gen4/Gen5 NVMe पर heatsink लगाएँ और कैबिनेट में हवा का रास्ता रखें।' },
    { q:'नक़ल (clone) के बाद विंडोज़ boot नहीं हो रहा?', a:'अक्सर EFI System Partition छूट जाता है या boot order पुरानी डिस्क पर है। BIOS में नई डिस्क/Windows Boot Manager पहले रखें; न चले तो recovery USB से bootrec /fixboot और bcdboot C:\\Windows /s S: /f UEFI चलाएँ। clone हमेशा “सभी partitions सहित” करें।' },
    { q:'कौन-सी SSD ख़रीदूँ — एक सीधा नियम?', a:'OS के लिए: TLC + DRAM (या अच्छी HMB) + NVMe, कम-से-कम 500 GB, भरोसेमंद ब्रांड, 5 वर्ष वारंटी। बड़े संग्रह के लिए: अलग CMR HDD या QLC SSD (पढ़ने-प्रधान)। और किसी भी हालत में — एक अच्छी backup आदत, क्योंकि हर डिस्क एक दिन मरती है।' },
  ] },

  { type:'quiz', store:'hw-store', items:[
    { q:'SATA III की अधिकतम व्यावहारिक गति लगभग कितनी है?', o:['150 MB/s','300 MB/s','600 MB/s','3500 MB/s'], a:2, ex:'6 Gb/s link, 8b/10b encoding के बाद ≈ 600 MB/s; असल में 550–580 MB/s दिखता है।' },
    { q:'NVMe का सबसे बड़ा लाभ AHCI पर क्या है?', o:['सस्ता होना','हज़ारों parallel कतारें','कम बिजली','USB पर चलना'], a:1, ex:'AHCI: 1 कतार × 32 command. NVMe: 65,535 कतारें × 65,536 command — flash की समानांतरता के अनुकूल।' },
    { q:'TLC सेल में कितने bit और कितने voltage स्तर होते हैं?', o:['1 bit, 2 स्तर','2 bit, 4 स्तर','3 bit, 8 स्तर','4 bit, 16 स्तर'], a:2, ex:'SLC 1/2, MLC 2/4, TLC 3/8, QLC 4/16. जितने ज़्यादा स्तर, उतना धीमा और कम टिकाऊ।' },
    { q:'3D NAND में परतें ऊपर चढ़ाने का मुख्य लाभ?', o:['सेल छोटा करना','बड़ा सेल रखकर भी क्षमता व टिकाऊपन बढ़ाना','सस्ता कंट्रोलर','कम बिजली'], a:1, ex:'planar scaling 15 nm पर अटक गया था; ऊपर चढ़ने से सेल बड़ा रहता है (कम लीकेज) और क्षमता बढ़ती है।' },
    { q:'SSD में मिटाने (erase) की सबसे छोटी इकाई क्या है?', o:['Bit','Page','Block','Die'], a:2, ex:'पढ़ना/लिखना page में, मिटाना केवल पूरे block में — यही असंगति write amplification पैदा करती है।' },
    { q:'TRIM किस समस्या को हल करता है?', o:['OS को बताता है कि कौन-से LBA अब बेकार हैं','डिस्क को defrag करता है','तापमान घटाता है','password लगाता है'], a:0, ex:'TRIM/Deallocate से कंट्रोलर पहले से garbage collection कर लेता है, जिससे अगला write तेज़ रहता है और WAF घटता है।' },
    { q:'TBW का पूरा नाम?', o:['Total Bandwidth','Terabytes Written','Time Between Writes','Total Block Wear'], a:1, ex:'TBW = वारंटी अवधि में गारंटीकृत कुल लिखावट। DWPD = Drive Writes Per Day.' },
    { q:'SSD पर defragment क्यों नहीं करना चाहिए?', o:['फ़ाइल मिट जाती है','व्यर्थ writes से आयु घटती है, लाभ शून्य','विंडोज़ मना करता है','BIOS बदल जाता है'], a:1, ex:'SSD में seek time नहीं होता, इसलिए टुकड़ों से नुक़सान नहीं; defrag केवल P/E चक्र खाता है। सही काम ReTRIM/Optimize है।' },
    { q:'SMART ID 05 (Reallocated Sector Count) बढ़ना क्या बताता है?', o:['केबल ख़राब','डिस्क ख़राब सेक्टर बदल रही है — भौतिक क्षति','तापमान ज़्यादा','फ़ाइल-सिस्टम त्रुटि'], a:1, ex:'0 non-zero और बढ़ता मान = सतह/सेल बिगड़ रही है। तुरंत backup लें। C7 (199) CRC केबल की समस्या बताता है।' },
    { q:'M.2 M-key स्लॉट में आम तौर पर क्या चलता है?', o:['केवल SATA SSD','PCIe ×4 NVMe SSD','Wi-Fi कार्ड','RAM'], a:1, ex:'M-key = PCIe ×4 (NVMe). B+M key वाले कार्ड प्रायः SATA. A/E key Wi-Fi के लिए होते हैं।' },
    { q:'RAID 0 में एक डिस्क मर जाए तो?', o:['आधा डाटा बचता है','पूरा volume जाता है','parity से वापस आता है','कुछ नहीं होता'], a:1, ex:'RAID 0 में कोई redundancy नहीं — हर file कई डिस्क पर बँटी है, इसलिए एक डिस्क गई तो सब बेकार।' },
    { q:'RAID 5 बनाने के लिए कम-से-कम कितनी डिस्क और कितनी मर सकती है?', o:['2 डिस्क, 1 मर सकती','3 डिस्क, 1 मर सकती','4 डिस्क, 2 मर सकती','2 डिस्क, 0'], a:1, ex:'RAID 5 = minimum 3, उपयोगी क्षमता (N−1), सहन-क्षमता 1. RAID 6 = minimum 4, (N−2), सहन 2.' },
    { q:'6 × 4 TB डिस्क के RAID 6 में उपयोगी क्षमता?', o:['24 TB','20 TB','16 TB','12 TB'], a:2, ex:'RAID 6 में दो डिस्क parity में जाती हैं: (6−2) × 4 TB = 16 TB.' },
    { q:'बड़ी (8 TB) डिस्क के array में RAID 5 की जगह RAID 6 क्यों?', o:['RAID 6 तेज़ है','लंबे rebuild के दौरान दूसरी डिस्क मरने/URE का जोखिम','RAID 5 पुराना है','RAID 6 सस्ता है'], a:1, ex:'rebuild में सब डिस्क पूरी तरह पढ़ी जाती हैं और घंटों लगते हैं; इस खिड़की में दूसरी विफलता की सम्भावना असली है।' },
    { q:'“RAID backup है” — यह कथन सही है?', o:['हाँ, RAID 1 पूरा backup है','नहीं — मिटाना/ransomware/चोरी सब डिस्क पर असर करेगा','केवल RAID 6 में सही','केवल hardware RAID में सही'], a:1, ex:'RAID केवल भौतिक डिस्क-विफलता से बचाता है। logical ग़लती तुरंत सब copy पर जाती है — 3-2-1 backup अलग चाहिए।' },
    { q:'SLC cache भरने के बाद QLC SSD की write गति क्यों गिरती है?', o:['डिस्क ख़राब हो गई','अब सीधे धीमी QLC सेल पर लिखा जा रहा है','TRIM बंद हो गया','तापमान बढ़ गया'], a:1, ex:'तेज़ शुरुआत pseudo-SLC cache की देन है। cache भरते ही असली sustained write दिखता है — QLC में 80–150 MB/s तक।' },
    { q:'SSD को कितना खाली रखना चाहिए?', o:['0% — पूरा भरना बेहतर','कम-से-कम 10–20%','50%','कोई फ़र्क़ नहीं'], a:1, ex:'खाली block garbage collection और wear leveling के लिए ज़रूरी हैं; भरी डिस्क पर WAF बढ़कर गति व आयु दोनों गिरते हैं।' },
    { q:'मरती HDD से डाटा निकालने का सबसे सुरक्षित पहला कदम?', o:['chkdsk /r चलाना','पहले ddrescue से image/clone लेना','फ़्रीज़र में रखना','बार-बार restart'], a:1, ex:'मूल डिस्क को बार-बार चलाना उसे और बिगाड़ता है। पहले sector-by-sector image लें, फिर उस image पर मरम्मत/खोज करें।' },
    { q:'SSD बेचने से पहले सबसे सही सफ़ाई?', o:['Quick Format','सब फ़ाइलें Delete + Recycle Bin खाली','Secure Erase / NVMe Format (crypto erase)','Defragment'], a:2, ex:'Secure Erase कंट्रोलर का नक़्शा/encryption key बदल देता है — सेकंडों में पूरा डाटा अपठनीय, बिना अतिरिक्त घिसावट के।' },
    { q:'SMR डिस्क किस काम के लिए सबसे अनुपयुक्त है?', o:['एक बार लिखा गया archive','फ़िल्मों का संग्रह','RAID/NAS में लगातार छोटे writes','backup की ठंडी copy'], a:2, ex:'ओवरलैप tracks के कारण overwrite पर पूरा zone दोबारा लिखना पड़ता है — RAID rebuild में यह भयंकर धीमा होता है। वहाँ CMR लें।' },
    { q:'घरेलू उपयोग में SSD की आयु का असली सीमांकक आम तौर पर क्या होता है?', o:['TBW ख़त्म होना','कंट्रोलर/firmware की अचानक विफलता या बिजली का झटका','रंग फीका पड़ना','USB पोर्ट'], a:1, ex:'रोज़ 10–30 GB लिखने पर 300 TBW भी दशकों चलेगा; असल में डिस्क पहले controller failure से जाती है — इसलिए backup अनिवार्य है।' },
  ] },
  { type:'pills', items:[
    { text:'SATA III ≈ 600 MB/s', kind:'info' },
    { text:'NVMe = हज़ारों कतारें', kind:'ok' },
    { text:'SLC 1 · MLC 2 · TLC 3 · QLC 4 bit', kind:'info' },
    { text:'मिटाना = पूरा Block', kind:'warn' },
    { text:'SSD पर defrag नहीं', kind:'danger' },
    { text:'10–20% जगह खाली रखें', kind:'tip' },
    { text:'RAID ≠ Backup', kind:'danger' },
    { text:'SMART 05 / 197 / 198 देखें', kind:'exam' },
  ] },
  ]
},
]);
