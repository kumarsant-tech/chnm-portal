
(function(){
'use strict';
var wrap=document.querySelector('.wrap');
if(!wrap)return;
var gallery=document.getElementById('real'),guide=document.getElementById('component-testing');
if(gallery&&guide){
 var guidePanel=document.createElement('div');guidePanel.className='real-test-guide';
 var guideHeading=guide.querySelector('h2');if(guideHeading){var heading=document.createElement('h3');heading.textContent='असली पार्ट देखकर उसकी टेस्टिंग सीखें';guidePanel.appendChild(heading)}
 while(guide.firstChild){var child=guide.firstChild;if(child===guideHeading){guide.removeChild(child);continue}guidePanel.appendChild(child)}
 guide.remove();gallery.appendChild(guidePanel);
}
var componentAnalogies=[
 [/फ़्यूज़|फ्यूज|fuse/i,'सुरक्षा-कड़ी जैसी: ज़्यादा करंट पर रास्ता खोलकर बाकी सर्किट को बचाती है।'],
 [/MOV|वैरिस्टर|varistor/i,'pressure-relief valve जैसा: voltage spike पर अतिरिक्त ऊर्जा को रास्ता देता है।'],
 [/NTC|थर्मिस्टर|thermistor/i,'soft-start वाल्व जैसा: ठंडा होने पर शुरुआती करंट रोकता है, गर्म होने पर रास्ता आसान करता है।'],
 [/EMI फ़िल्टर|EMI filter/i,'दरवाज़े की जाली जैसा: अनचाहा विद्युत शोर रोकता है, उपयोगी ऊर्जा को जाने देता है।'],
 [/ब्रिज रेक्टिफ़ायर|bridge rectifier/i,'एक-दिशा दरवाज़ों की चौकी जैसा: AC के दोनों आधे चक्र को एक दिशा में मोड़ता है।'],
 [/बल्क कैपेसिटर|bulk capacitor/i,'पानी की टंकी जैसा: झटके से आने वाली धारा जमा करके अधिक समान धार में छोड़ता है।'],
 [/MOSFET|ट्रांजिस्टर|transistor/i,'तेज़ इलेक्ट्रॉनिक नल जैसा: खुल-बंद होकर ट्रांसफ़ॉर्मर को ऊर्जा के छोटे पल भेजता है।'],
 [/स्नबर|snubber/i,'shock absorber जैसा: switch बंद होते समय voltage spike को दबाता है।'],
 [/ट्रांसफ़ॉर्मर|transformer/i,'दो अलग कमरों के बीच ऊर्जा पहुँचाने जैसा: सीधा तार जोड़े बिना वोल्टेज बदलता है।'],
 [/स्टार्टअप.*रेसिस्टर|startup.*resistor/i,'starter rope जैसा: PWM कंट्रोलर को शुरुआती ऊर्जा देता है।'],
 [/शॉटकी|schottky/i,'एक-दिशा तेज़ दरवाज़े जैसा: पल्स को कम रुकावट के साथ DC तरफ़ जाने देता है।'],
 [/इंडक्टर|कॉइल|inductor|coil/i,'भारी घूमते पहिए जैसा: करंट के अचानक बदलने का विरोध करता और ऊर्जा जमा करता है।'],
 [/आउटपुट.*कैपेसिटर|output.*capacitor/i,'छोटी टंकी और damper जैसा: आउटपुट के तेज़ उतार-चढ़ाव को समतल करता है।'],
 [/3\.3V रेगुलेटर|मैग-एम्प|regulator/i,'नल का flow regulator जैसा: रेल का वोल्टेज तय सीमा के पास रखता है।'],
 [/PWM कंट्रोलर|PWM controller/i,'ट्रैफ़िक सिग्नल जैसा: switch को चालू रहने का समय तय करता है।'],
 [/TL431|ऑप्टोकपलर|feedback/i,'थर्मोस्टैट और संदेशवाहक जैसा: आउटपुट देखकर नियंत्रण हिस्से को सुधार बताता है।'],
 [/5VSB|स्टैंडबाय|standby/i,'आपातकालीन छोटी लाइट जैसी: मुख्य सप्लाई बंद रहते भी तैयार रहती है।'],
 [/सुपरवाइज़र|supervisor/i,'सुरक्षा चौकीदार जैसा: वोल्टेज और fault देखकर supply को रोकता है।'],
 [/PFC/i,'कदम मिलाने वाले conductor जैसा: input current को mains voltage के साथ तालमेल में रखता है।'],
 [/पंखा|fan/i,'रेडिएटर के पंखे जैसा: गर्मी बाहर निकालकर पार्ट्स को सुरक्षित तापमान पर रखता है।'],
 [/ATX कनेक्टर|ATX connector/i,'अलग-अलग पाइप लाइनों जैसा: सही rail को सही हिस्से तक पहुँचाता है।']
];
if(gallery)gallery.querySelectorAll('.test-card').forEach(function(card){
 var title=card.querySelector('h3'),first=card.querySelector('p');if(!title||!first||card.querySelector('.component-analogy'))return;
 var rule=componentAnalogies.find(function(entry){return entry[0].test(title.textContent)});if(!rule)return;
 var note=document.createElement('p');note.className='component-analogy';note.textContent='रोज़मर्रा की मिसाल: '+rule[1];first.insertAdjacentElement('beforebegin',note);
});
/* पैनल और साइडबार की सूची: [id, आइकन, हिंदी नाम, English name] */
window.CL3D_FILES={
  'home':'index.html',
  'basics':'02-basics.html',
  'parts':'03-parts.html',
  'mb-foundation':'04-mb-foundation.html',
  'mb-chipset':'05-mb-chipset.html',
  'mb-components':'06-mb-components.html',
  'mb-sockets':'07-mb-sockets.html',
  'mb-graphics':'08-mb-graphics.html',
  'mb-brands':'09-mb-brands.html',
  'mb-choose':'10-mb-choose.html',
  'assembly':'11-assembly.html',
  'disassembly':'12-disassembly.html',
  'wiring':'13-wiring.html',
  'power':'14-power.html',
  'motherboard':'15-motherboard.html',
  'storage':'16-storage.html',
  'bios':'17-bios.html',
  'os':'18-os.html',
  'network':'19-network.html',
  'sv-safety':'20-sv-safety.html',
  'sv-teardown':'21-sv-teardown.html',
  'sv-clean':'22-sv-clean.html',
  'sv-thermal':'23-sv-thermal.html',
  'sv-diagnose':'24-sv-diagnose.html',
  'sv-upgrade':'25-sv-upgrade.html',
  'troubleshoot':'26-troubleshoot.html',
  'labs':'27-labs.html',
  'quiz':'28-quiz.html',
  'glossary':'29-glossary.html',
  'sci-gens':'30-sci-gens.html',
  'sci-numbers':'31-sci-numbers.html',
  'sci-logic':'32-sci-logic.html',
  'sci-data':'33-sci-data.html',
  'sci-dcom':'34-sci-dcom.html',
  'hw-cpu':'35-hw-cpu.html',
  'hw-mem':'36-hw-mem.html',
  'hw-store':'37-hw-store.html',
  'hw-gpu':'38-hw-gpu.html',
  'hw-periph':'39-hw-periph.html',
  'hw-mobile':'40-hw-mobile.html',
  'hw-tools':'41-hw-tools.html',
  'win-intro':'42-win-intro.html',
  'win-ui':'43-win-ui.html',
  'win-admin':'44-win-admin.html',
  'win-cli':'45-win-cli.html',
  'win-install':'46-win-install.html',
  'lin-intro':'47-lin-intro.html',
  'lin-cli':'48-lin-cli.html',
  'lin-admin':'49-lin-admin.html',
  'lin-install':'50-lin-install.html',
  'lin-script':'51-lin-script.html',
  'off-intro':'52-off-intro.html',
  'off-word':'53-off-word.html',
  'off-excel-1':'54-off-excel-1.html',
  'off-excel-2':'55-off-excel-2.html',
  'off-ppt':'56-off-ppt.html',
  'off-access':'57-off-access.html',
  'off-outlook':'58-off-outlook.html',
  'net-web':'59-net-web.html',
  'net-browser':'60-net-browser.html',
  'sec-security':'61-sec-security.html',
  'sec-data':'62-sec-data.html',
  'sw-prog':'63-sw-prog.html',
  'sw-util':'64-sw-util.html',
  'sw-ai':'65-sw-ai.html',
  'sw-labs':'66-sw-labs.html',
  'sw-quiz':'67-sw-quiz.html',
  'sw-glossary':'68-sw-glossary.html'
};
var GROUPS=[
{id:'computer-lab-pages',icon:'🖥️',hi:'कंप्यूटर लैब — हर विषय अलग पेज (68)',en:'Computer Lab — One Page Per Topic',items:[
  ['cl3d:home','🏠','01 · होम','01 · Home — full list'],
  ['cl3d:basics','🧠','02 · कंप्यूटर का परिचय','02 · Intro to Computer'],
  ['cl3d:parts','🧩','03 · कंपोनेंट्स गाइड (3D)','03 · Components Guide (3D)'],
  ['cl3d:mb-foundation','🧱','04 · मदरबोर्ड की नींव','04 · Motherboard Foundation'],
  ['cl3d:mb-chipset','🌉','05 · चिपसेट · नॉर्थ व साउथ ब्रिज','05 · Chipset — North & South Bridge'],
  ['cl3d:mb-components','🔩','06 · मदरबोर्ड के सारे कंपोनेंट','06 · All Motherboard Components'],
  ['cl3d:mb-sockets','🔌','07 · सॉकेट, चिपसेट व CPU मैट्रिक्स','07 · Sockets, Chipset & CPU Matrix'],
  ['cl3d:mb-graphics','🖥️','08 · ग्राफ़िक्स — ऑनबोर्ड या बाहरी?','08 · Graphics — iGPU or dGPU'],
  ['cl3d:mb-brands','🏭','09 · कंपनियाँ, ब्रांड व लाइनअप','09 · Companies, Brands & Lineups'],
  ['cl3d:mb-choose','🧮','10 · मदरबोर्ड कैसे चुनें व जाँचें','10 · Choosing & Checking a Motherboard'],
  ['cl3d:assembly','🔧','11 · असेंबली (Assembly)','11 · Assembly'],
  ['cl3d:disassembly','🔩','12 · डिसअसेंबली (Disassembly)','12 · Disassembly'],
  ['cl3d:wiring','🔌','13 · वायरिंग व कनेक्शन','13 · Wiring & Connections'],
  ['cl3d:power','⚡','14 · पावर सप्लाई (SMPS)','14 · Power Supply (SMPS)'],
  ['cl3d:motherboard','🧠','15 · मदरबोर्ड — हेडर, जंपर व संदर्भ','15 · Motherboard Headers & Jumpers'],
  ['cl3d:storage','💾','16 · स्टोरेज (HDD/SSD/NVMe)','16 · Storage (HDD/SSD/NVMe)'],
  ['cl3d:bios','🎮','17 · BIOS / UEFI व POST','17 · BIOS / UEFI & POST'],
  ['cl3d:os','🪟','18 · ऑपरेटिंग सिस्टम इंस्टॉलेशन','18 · OS Installation'],
  ['cl3d:network','🌐','19 · नेटवर्किंग व LAN','19 · Networking & LAN'],
  ['cl3d:sv-safety','🦺','20 · सुरक्षा, ESD व वर्कबेंच तैयारी','20 · Safety, ESD & Workbench'],
  ['cl3d:sv-teardown','🔩','21 · डिसअसेंबली का पेशेवर क्रम','21 · Professional Teardown Order'],
  ['cl3d:sv-clean','🧼','22 · सफ़ाई, धूल व एयरफ़्लो प्रबंधन','22 · Cleaning, Dust & Airflow'],
  ['cl3d:sv-thermal','❄️','23 · कूलिंग व थर्मल पेस्ट सर्विसिंग','23 · Cooling & Thermal Paste'],
  ['cl3d:sv-diagnose','🩺','24 · निदान — POST कोड से मल्टीमीटर तक','24 · Diagnosis — POST to Multimeter'],
  ['cl3d:sv-upgrade','⬆️','25 · उन्नयन, जीर्णोद्धार व प्रिवेंटिव मेंटेनेंस','25 · Upgrade & Preventive Maintenance'],
  ['cl3d:troubleshoot','🧯','26 · ट्रबलशूटिंग व रिपेयरिंग','26 · Troubleshooting & Repair'],
  ['cl3d:labs','🛠️','27 · प्रैक्टिकल लैब (20 कार्य)','27 · Practical Lab'],
  ['cl3d:quiz','🎯','28 · अभ्यास क्विज़ (25 प्रश्न)','28 · Practice Quiz (25 Q)'],
  ['cl3d:glossary','📖','29 · ग्लोसरी व संदर्भ','29 · Glossary & Reference'],
  ['cl3d:sci-gens','🕰️','30 · कंप्यूटर की पीढ़ियाँ और कंप्यूटर के प्रकार','30 · Computer Generations & Types'],
  ['cl3d:sci-numbers','🔢','31 · संख्या पद्धतियाँ — Decimal, Binary, Octal, Hexadecimal','31 · Number Systems (Binary-Octal-Hex)'],
  ['cl3d:sci-logic','🧮','32 · लॉजिक गेट व बूलियन बीजगणित (Logic Gates)','32 · Logic Gates & Boolean Algebra'],
  ['cl3d:sci-data','🗂️','33 · डेटा, मेमोरी और फ़ाइल सिस्टम','33 · Data, Memory & File Systems'],
  ['cl3d:sci-dcom','📡','34 · डेटा संचार और OSI मॉडल','34 · Data Communication & OSI Model'],
  ['cl3d:hw-cpu','🧠','35 · CPU के अंदर — माइक्रोआर्किटेक्चर','35 · Inside the CPU — Microarchitecture'],
  ['cl3d:hw-mem','🧮','36 · RAM के अंदर — DDR, टाइमिंग व ECC','36 · Inside RAM — DDR, Timings & ECC'],
  ['cl3d:hw-store','💾','37 · स्टोरेज के अंदर — NAND, NVMe व RAID','37 · Inside Storage — NAND, NVMe & RAID'],
  ['cl3d:hw-gpu','🎨','38 · GPU व डिस्प्ले तकनीक','38 · GPU & Display Technology'],
  ['cl3d:hw-periph','🖨️','39 · पेरिफेरल्स व प्रिंटर — इनपुट से छपाई तक','39 · Peripherals & Printers'],
  ['cl3d:hw-mobile','💻','40 · लैपटॉप व मोबाइल हार्डवेयर','40 · Laptop & Mobile Hardware'],
  ['cl3d:hw-tools','🧰','41 · वर्कशॉप, यंत्र व माप','41 · Workshop & Test Instruments'],
  ['cl3d:win-intro','🪟','42 · विंडोज़ का परिचय व इतिहास','42 · Windows Introduction & History'],
  ['cl3d:win-ui','🖥️','43 · विंडोज़ का पूरा इंटरफ़ेस (10 व 11)','43 · Windows 11 Interface in Full'],
  ['cl3d:win-admin','🛡️','44 · विंडोज़ प्रशासन (Administration)','44 · Windows Administration'],
  ['cl3d:win-cli','⌨️','45 · CMD व PowerShell कमांड','45 · CMD & PowerShell Commands'],
  ['cl3d:win-install','🪟','46 · विंडोज़ इंस्टॉल, रिपेयर व BSOD','46 · Windows Install, Repair & BSOD'],
  ['cl3d:lin-intro','🐧','47 · लिनक्स परिचय, डिस्ट्रो व फ़ाइल संरचना','47 · Linux Intro, Distros & Filesystem'],
  ['cl3d:lin-cli','👣','48 · लिनक्स टर्मिनल व कमांड रिफरेंस','48 · Linux Terminal & Commands'],
  ['cl3d:lin-admin','🖧','49 · लिनक्स सर्वर व नेटवर्क प्रशासन','49 · Linux Server & Network Admin'],
  ['cl3d:lin-install','💽','50 · लिनक्स इंस्टॉल, डुअल बुट व WSL','50 · Linux Install, Dual Boot & WSL'],
  ['cl3d:lin-script','📜','51 · प्रैक्टिकल Bash Scripting','51 · Practical Bash Scripting'],
  ['cl3d:off-intro','📊','52 · MS Office व Microsoft 365 परिचय','52 · MS Office & Microsoft 365 Intro'],
  ['cl3d:off-word','📝','53 · MS Word पूरी गहराई','53 · MS Word in Depth'],
  ['cl3d:off-excel-1','🧮','54 · MS Excel भाग 1 — बेसिक, फ़ॉर्मैटिंग व बेसिक फंक्शन','54 · MS Excel Part 1 — Basics & Functions'],
  ['cl3d:off-excel-2','📈','55 · MS Excel भाग 2 — Lookup, Pivot, चार्ट व मॉडल','55 · MS Excel Part 2 — Lookup, Pivot & Charts'],
  ['cl3d:off-ppt','📽️','56 · PowerPoint पूरी गहराई','56 · PowerPoint in Depth'],
  ['cl3d:off-access','🗃️','57 · MS Access डेटाबेस','57 · MS Access Database'],
  ['cl3d:off-outlook','📧','58 · Outlook, Teams व OneNote','58 · Outlook, Teams & OneNote'],
  ['cl3d:net-web','🌍','59 · इंटरनेट कैसे काम करता है — केबल से लेकर पन्ने दिखने तक','59 · How the Internet Works'],
  ['cl3d:net-browser','🌐','60 · ब्राउज़र व वेब औज़ार','60 · Browsers & Web Tools'],
  ['cl3d:sec-security','🛡️','61 · साइबर सुरक्षा, एंटीवायरस व हैकिंग से बचाव','61 · Cyber Security & Antivirus'],
  ['cl3d:sec-data','🗜️','62 · फ़ाइलें, संपीड़न, क्लाउड और डेटा रिकवरी','62 · Files, Compression & Cloud'],
  ['cl3d:sw-prog','👨‍💻','63 · प्रोग्रामिंग की शुरुआत — कोड कैसे चलता है','63 · Getting Started with Programming'],
  ['cl3d:sw-util','🧰','64 · उपयोगी सॉफ़्टवेयर व यूटिलिटी','64 · Useful Software & Utilities'],
  ['cl3d:sw-ai','🤖','65 · क्लाउड, AI व नई तकनीकें','65 · Cloud, AI & New Technologies'],
  ['cl3d:sw-labs','🧪','66 · सॉफ़्टवेयर प्रैक्टिकल लैब (30 कार्य)','66 · Software Practical Lab (30 Tasks)'],
  ['cl3d:sw-quiz','📝','67 · सॉफ़्टवेयर महा-क्विज़ — 100 प्रश्न','67 · Software Quiz (100 Questions)'],
  ['cl3d:sw-glossary','📖','68 · सॉफ़्टवेयर शब्दकोश — पूरे फ़ुल फ़ॉर्म','68 · Software Glossary']
 ]},
{id:'smps',icon:'⚡',hi:'SMPS लैब (पूरी जाँच)',en:'SMPS Lab (Full Guide)',items:[
  ['home','🏠','होम','Home'],
  ['safe-top','🛡️','पहले सुरक्षा','Safety First'],
  ['learning','🎓','गाइडेड लर्निंग लैब','Guided Learning Lab'],
  ['flow','🔀','AC से DC तक का सफ़र','The Journey from AC to DC'],
  ['ac','🔌','AC इनपुट','AC Input'],
  ['hv','⚡','स्विचिंग (दिल)','Switching (the Heart)'],
  ['dc','🔋','DC आउटपुट','DC Output'],
  ['ctl','🧠','कंट्रोल और सुरक्षा','Control and Protection'],
  ['connectors','🔗','कनेक्टर और तारों के रंग','Connectors and Wire Colours'],
  ['real','🔍','असली कंपोनेंट और टेस्टिंग','Real Components and Testing'],
  ['live','📈','लाइव सर्किट','Live Circuit'],
  ['realsim','🧪','रियल SMPS सिमुलेटर','Real SMPS Simulator'],
  ['sim','🎛️','वेवफ़ॉर्म सिमुलेटर','Waveform Simulator'],
  ['shortlab','⚡','शॉर्ट सर्किट लैब','Short Circuit Lab'],
  ['input-reg','🔁','110V बनाम 230V रेगुलेशन','110V vs 230V Regulation'],
  ['tp-probe','📍','टेस्ट पॉइंट प्रोब (AC से DC)','Test Point Probe (AC to DC)'],
  ['ntc-live','🌡️','NTC और PTC लाइव','NTC and PTC Live'],
  ['ohms-law','Ω','ओम लॉ','Ohm’s Law'],
  ['m450','🗺️','450W बोर्ड का नक्शा','450W Board Map'],
  ['repair-guide','🛠️','मरम्मत के कदम','Repair Steps'],
  ['bench','🧰','रिपेयर टेस्ट बेंच','Repair Test Bench'],
  ['test','📟','मल्टीमीटर से जाँच','Testing with a Multimeter'],
  ['fault','🩺','खराबी खोजें','Find the Fault'],
  ['doctor','🧭','मापें और खराबी पकड़ें','Measure and Diagnose'],
  ['svp','⚖️','सीरीज़ और पैरेलल जाँच','Series and Parallel Testing'],
  ['sp','🧮','सीरीज़-पैरेलल कैलकुलेटर','Series-Parallel Calculator'],
  ['m450t','⚙️','लोड कैलकुलेटर','Load Calculator'],
  ['safe','⚠️','सुरक्षा के नियम','Safety Rules'],
  ['cits-smps','🔎','SMPS की पहचान और जाँच','SMPS Identification and Testing'],
  ['cits-scr','🚪','थायरिस्टर (SCR)','Thyristor (SCR)'],
  ['cits-ic','🧩','ऑप-एम्प और रेगुलेटर','Op-amp and Regulators'],
  ['cits-trace','🧵','सर्किट ट्रेस और खराबी खोज','Circuit Tracing and Fault Finding'],
  ['component-testing','🧰','SMPS कंपोनेंट टेस्टिंग गाइड','SMPS Component Testing Guide'],
  ['basic-electronics','🔌','बेसिक इलेक्ट्रॉनिक्स — ज़ीरो से','Basic Electronics — From Zero'],
  ['training-method','🎓','ट्रेनिंग मेथडोलॉजी — पढ़ाने की कला','Training Methodology — The Art of Teaching']
 ]}
];
window.__panelGroups=GROUPS;
var panels=[],byId={};
GROUPS.forEach(function(g){g.items.forEach(function(it){
 var el=document.getElementById(it[0]);if(!el)return;
 var p={id:it[0],hi:it[2],en:it[3],el:el};panels.push(p);byId[p.id]=p;
})});
var realLinks={
 ac:['फ़्यूज़','वैरिस्टर MOV','NTC थर्मिस्टर','X2 कैपेसिटर','ब्रिज रेक्टिफ़ायर','बल्क कैपेसिटर'],
 hv:['बल्क कैपेसिटर','स्टार्टअप / कार्बन रेसिस्टर','स्विचिंग MOSFET','मेन ट्रांसफ़ॉर्मर EI33'],
 dc:['शॉटकी डायोड','आउटपुट इंडक्टर','आउटपुट कैपेसिटर'],
 ctl:['PWM IC TL494','TL431 रेफ़रेंस','ऑप्टोकपलर PC817'],
 'repair-guide':['फ़्यूज़','स्विचिंग MOSFET','शॉटकी डायोड','आउटपुट कैपेसिटर'],
 connectors:['ATX 24-पिन कनेक्टर','SATA पावर कनेक्टर']
};
Object.keys(realLinks).forEach(function(sectionId){
 var section=document.getElementById(sectionId),heading=section&&section.querySelector('h2');
 if(!section||!heading)return;
 var box=document.createElement('div');box.className='pv-real-links';
 var label=document.createElement('b');label.textContent='इस सेक्शन के असली SMPS पार्ट देखें';box.appendChild(label);
 realLinks[sectionId].forEach(function(name){
  var part=Array.from(document.querySelectorAll('#gal .part')).find(function(card){var title=card.querySelector('h4');return title&&title.textContent.trim()===name});
  if(!part)return;
  if(!part.id){part.id='pv-real-'+name.toLocaleLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g,'-');part.tabIndex=-1}
  var button=document.createElement('button');button.type='button';button.dataset.realTarget=part.id;button.textContent='🔎 '+name;box.appendChild(button);
 });
 /* असली पार्ट के बटन की अलग सूची हटा दी: नीचे हर पार्ट पहले से खुलकर दिखता है */
});
/* सूचीकृत पैनल के अलावा बाकी पुराने सेक्शन भी छुपे रहें। */
wrap.querySelectorAll(':scope > section').forEach(function(section){section.classList.add('pv-hide')});

var oldNav=wrap.querySelector('nav.tabs');if(oldNav)oldNav.classList.add('pv-hide');

/* ऊपर की पट्टी: सिर्फ़ नाम + पिछला / अगला (सूची सिर्फ़ साइडबार में है) */
var hero=wrap.querySelector('header.hero');
function LL(hi,en){var l=document.documentElement.lang==='en';return '<span data-lang="hi"'+(l?' hidden':'')+'>'+hi+'</span><span data-lang="en"'+(l?'':' hidden')+'>'+en+'</span>'}
var bar=document.createElement('div');bar.className='pv-bar pv-hide';
bar.innerHTML='<div class="pv-title"></div><div class="pv-nav"><button type="button" class="pv-prev">← '+LL('पिछला','Previous')+'</button><button type="button" class="pv-next">'+LL('अगला','Next')+' →</button></div>';
wrap.appendChild(bar);
var cur=null;
function show(id,noHash){
 var p=byId[id];if(!p){id='home';p=byId.home;if(!p)return}
 wrap.querySelectorAll(':scope > section').forEach(function(section){section.classList.add('pv-hide')});
 p.el.classList.remove('pv-hide');
 if(hero)hero.classList.toggle('pv-hide',id!=='home');
 p.el.insertAdjacentElement('beforebegin',bar);bar.classList.remove('pv-hide');
 bar.querySelector('.pv-title').innerHTML=LL(p.hi,p.en);
 var i=panels.indexOf(p);
 bar.querySelector('.pv-prev').disabled=i<=0;bar.querySelector('.pv-next').disabled=i>=panels.length-1;
 cur=p;
 if(!noHash&&location.hash!=='#'+id){try{history.pushState(null,'','#'+id)}catch(e){}}
 window.scrollTo(0,0);
 try{window.dispatchEvent(new Event('resize'))}catch(e){}
 try{document.dispatchEvent(new CustomEvent('smps-panel',{detail:id}))}catch(e){}
}
wrap.addEventListener('click',function(e){
 var button=e.target.closest('[data-real-target]');if(!button)return;
 show('real');
 requestAnimationFrame(function(){var target=document.getElementById(button.dataset.realTarget);if(target){target.scrollIntoView({behavior:'smooth',block:'center'});target.focus({preventScroll:true})}});
});
bar.querySelector('.pv-prev').addEventListener('click',function(){var i=panels.indexOf(cur);if(i>0)show(panels[i-1].id)});
bar.querySelector('.pv-next').addEventListener('click',function(){var i=panels.indexOf(cur);if(i<panels.length-1)show(panels[i+1].id)});
function fromHash(){
 var id=decodeURIComponent((location.hash||'').slice(1));
 if(!id){show('home',true);return}
 if(byId[id]){show(id,true);return}
 if(id==='component-testing'){show('real',true);return}
 var el=document.getElementById(id),host=el&&panels.filter(function(p){return p.el.contains(el)})[0];
 if(host){show(host.id,true);try{el.scrollIntoView()}catch(e){}}else show('home',true);
}
window.addEventListener('hashchange',fromHash);
window.addEventListener('popstate',fromHash);
/* दूसरे स्क्रिप्ट के बटन (जैसे "बेंच खोलें") छुपे पैनल की ओर scrollIntoView करें तो पैनल खोल दें */
var orig=Element.prototype.scrollIntoView;
Element.prototype.scrollIntoView=function(){
 var el=this,host=panels.filter(function(p){return p.el===el||p.el.contains(el)})[0];
 if(host&&host.el.classList.contains('pv-hide'))show(host.id);
 return orig.apply(el,arguments);
};
fromHash();
window.__panels={show:show,list:panels,current:function(){return cur&&cur.id}};
})();
