
(function(){
'use strict';
var wrap=document.querySelector('.wrap');
if(!wrap)return;
var pageSections=Array.prototype.slice.call(document.querySelectorAll('body > section:not(.v6-thought), .wrap > section:not(.v6-thought)'));
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
/* कंप्यूटर लैब के अलग-अलग विषय-पेज (Computer-Lab/ में, कोई sub-folder नहीं)
   यह सूची Computer-Lab/cl3d-app.js के window.CL_TOPIC_FILES जैसी ही है */
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
/* पैनल और साइडबार की सूची: [id, आइकन, हिंदी नाम, English name] */
var GROUPS=[
 {id:'computer-lab-pages',icon:'🖥️',hi:'कंप्यूटर लैब — हर विषय अलग पेज (67)',en:'Computer Lab — One Page Per Topic',items:[
  ['cl3d:basics','🧠','01 · कंप्यूटर का परिचय','01 · Intro to Computer'],
  ['cl3d:parts','🧩','02 · कंपोनेंट्स गाइड (3D)','02 · Components Guide (3D)'],
  ['cl3d:mb-foundation','🧱','03 · मदरबोर्ड की नींव','03 · Motherboard Foundation'],
  ['cl3d:mb-chipset','🌉','04 · चिपसेट · नॉर्थ व साउथ ब्रिज','04 · Chipset — North & South Bridge'],
  ['cl3d:mb-components','🔩','05 · मदरबोर्ड के सारे कंपोनेंट','05 · All Motherboard Components'],
  ['cl3d:mb-sockets','🔌','06 · सॉकेट, चिपसेट व CPU मैट्रिक्स','06 · Sockets, Chipset & CPU Matrix'],
  ['cl3d:mb-graphics','🖥️','07 · ग्राफ़िक्स — ऑनबोर्ड या बाहरी?','07 · Graphics — iGPU or dGPU'],
  ['cl3d:mb-brands','🏭','08 · कंपनियाँ, ब्रांड व लाइनअप','08 · Companies, Brands & Lineups'],
  ['cl3d:mb-choose','🧮','09 · मदरबोर्ड कैसे चुनें व जाँचें','09 · Choosing & Checking a Motherboard'],
  ['cl3d:assembly','🔧','10 · असेंबली (Assembly)','10 · Assembly'],
  ['cl3d:disassembly','🔩','11 · डिसअसेंबली (Disassembly)','11 · Disassembly'],
  ['cl3d:wiring','🔌','12 · वायरिंग व कनेक्शन','12 · Wiring & Connections'],
  ['cl3d:power','⚡','13 · पावर सप्लाई (SMPS)','13 · Power Supply (SMPS)'],
  ['cl3d:motherboard','🧠','14 · मदरबोर्ड — हेडर, जंपर व संदर्भ','14 · Motherboard Headers & Jumpers'],
  ['cl3d:storage','💾','15 · स्टोरेज (HDD/SSD/NVMe)','15 · Storage (HDD/SSD/NVMe)'],
  ['cl3d:bios','🎮','16 · BIOS / UEFI व POST','16 · BIOS / UEFI & POST'],
  ['cl3d:os','🪟','17 · ऑपरेटिंग सिस्टम इंस्टॉलेशन','17 · OS Installation'],
  ['cl3d:network','🌐','18 · नेटवर्किंग व LAN','18 · Networking & LAN'],
  ['cl3d:sv-safety','🦺','19 · सुरक्षा, ESD व वर्कबेंच तैयारी','19 · Safety, ESD & Workbench'],
  ['cl3d:sv-teardown','🔩','20 · डिसअसेंबली का पेशेवर क्रम','20 · Professional Teardown Order'],
  ['cl3d:sv-clean','🧼','21 · सफ़ाई, धूल व एयरफ़्लो प्रबंधन','21 · Cleaning, Dust & Airflow'],
  ['cl3d:sv-thermal','❄️','22 · कूलिंग व थर्मल पेस्ट सर्विसिंग','22 · Cooling & Thermal Paste'],
  ['cl3d:sv-diagnose','🩺','23 · निदान — POST कोड से मल्टीमीटर तक','23 · Diagnosis — POST to Multimeter'],
  ['cl3d:sv-upgrade','⬆️','24 · उन्नयन, जीर्णोद्धार व प्रिवेंटिव मेंटेनेंस','24 · Upgrade & Preventive Maintenance'],
  ['cl3d:troubleshoot','🧯','25 · ट्रबलशूटिंग व रिपेयरिंग','25 · Troubleshooting & Repair'],
  ['cl3d:labs','🛠️','26 · प्रैक्टिकल लैब (20 कार्य)','26 · Practical Lab'],
  ['cl3d:quiz','🎯','27 · अभ्यास क्विज़ (25 प्रश्न)','27 · Practice Quiz (25 Q)'],
  ['cl3d:glossary','📖','28 · ग्लोसरी व संदर्भ','28 · Glossary & Reference'],
  ['cl3d:sci-gens','🕰️','29 · कंप्यूटर की पीढ़ियाँ और कंप्यूटर के प्रकार','29 · Computer Generations & Types'],
  ['cl3d:sci-numbers','🔢','30 · संख्या पद्धतियाँ — Decimal, Binary, Octal, Hexadecimal','30 · Number Systems (Binary-Octal-Hex)'],
  ['cl3d:sci-logic','🧮','31 · लॉजिक गेट व बूलियन बीजगणित (Logic Gates)','31 · Logic Gates & Boolean Algebra'],
  ['cl3d:sci-data','🗂️','32 · डेटा, मेमोरी और फ़ाइल सिस्टम','32 · Data, Memory & File Systems'],
  ['cl3d:sci-dcom','📡','33 · डेटा संचार और OSI मॉडल','33 · Data Communication & OSI Model'],
  ['cl3d:hw-cpu','🧠','34 · CPU के अंदर — माइक्रोआर्किटेक्चर','34 · Inside the CPU — Microarchitecture'],
  ['cl3d:hw-mem','🧮','35 · RAM के अंदर — DDR, टाइमिंग व ECC','35 · Inside RAM — DDR, Timings & ECC'],
  ['cl3d:hw-store','💾','36 · स्टोरेज के अंदर — NAND, NVMe व RAID','36 · Inside Storage — NAND, NVMe & RAID'],
  ['cl3d:hw-gpu','🎨','37 · GPU व डिस्प्ले तकनीक','37 · GPU & Display Technology'],
  ['cl3d:hw-periph','🖨️','38 · पेरिफेरल्स व प्रिंटर — इनपुट से छपाई तक','38 · Peripherals & Printers'],
  ['cl3d:hw-mobile','💻','39 · लैपटॉप व मोबाइल हार्डवेयर','39 · Laptop & Mobile Hardware'],
  ['cl3d:hw-tools','🧰','40 · वर्कशॉप, यंत्र व माप','40 · Workshop & Test Instruments'],
  ['cl3d:win-intro','🪟','41 · विंडोज़ का परिचय व इतिहास','41 · Windows Introduction & History'],
  ['cl3d:win-ui','🖥️','42 · विंडोज़ का पूरा इंटरफ़ेस (10 व 11)','42 · Windows 11 Interface in Full'],
  ['cl3d:win-admin','🛡️','43 · विंडोज़ प्रशासन (Administration)','43 · Windows Administration'],
  ['cl3d:win-cli','⌨️','44 · CMD व PowerShell कमांड','44 · CMD & PowerShell Commands'],
  ['cl3d:win-install','🪟','45 · विंडोज़ इंस्टॉल, रिपेयर व BSOD','45 · Windows Install, Repair & BSOD'],
  ['cl3d:lin-intro','🐧','46 · लिनक्स परिचय, डिस्ट्रो व फ़ाइल संरचना','46 · Linux Intro, Distros & Filesystem'],
  ['cl3d:lin-cli','👣','47 · लिनक्स टर्मिनल व कमांड रिफरेंस','47 · Linux Terminal & Commands'],
  ['cl3d:lin-admin','🖧','48 · लिनक्स सर्वर व नेटवर्क प्रशासन','48 · Linux Server & Network Admin'],
  ['cl3d:lin-install','💽','49 · लिनक्स इंस्टॉल, डुअल बुट व WSL','49 · Linux Install, Dual Boot & WSL'],
  ['cl3d:lin-script','📜','50 · प्रैक्टिकल Bash Scripting','50 · Practical Bash Scripting'],
  ['cl3d:off-intro','📊','51 · MS Office व Microsoft 365 परिचय','51 · MS Office & Microsoft 365 Intro'],
  ['cl3d:off-word','📝','52 · MS Word पूरी गहराई','52 · MS Word in Depth'],
  ['cl3d:off-excel-1','🧮','53 · MS Excel भाग 1 — बेसिक, फ़ॉर्मैटिंग व बेसिक फंक्शन','53 · MS Excel Part 1 — Basics & Functions'],
  ['cl3d:off-excel-2','📈','54 · MS Excel भाग 2 — Lookup, Pivot, चार्ट व मॉडल','54 · MS Excel Part 2 — Lookup, Pivot & Charts'],
  ['cl3d:off-ppt','📽️','55 · PowerPoint पूरी गहराई','55 · PowerPoint in Depth'],
  ['cl3d:off-access','🗃️','56 · MS Access डेटाबेस','56 · MS Access Database'],
  ['cl3d:off-outlook','📧','57 · Outlook, Teams व OneNote','57 · Outlook, Teams & OneNote'],
  ['cl3d:net-web','🌍','58 · इंटरनेट कैसे काम करता है — केबल से लेकर पन्ने दिखने तक','58 · How the Internet Works'],
  ['cl3d:net-browser','🌐','59 · ब्राउज़र व वेब औज़ार','59 · Browsers & Web Tools'],
  ['cl3d:sec-security','🛡️','60 · साइबर सुरक्षा, एंटीवायरस व हैकिंग से बचाव','60 · Cyber Security & Antivirus'],
  ['cl3d:sec-data','🗜️','61 · फ़ाइलें, संपीड़न, क्लाउड और डेटा रिकवरी','61 · Files, Compression & Cloud'],
  ['cl3d:sw-prog','👨‍💻','62 · प्रोग्रामिंग की शुरुआत — कोड कैसे चलता है','62 · Getting Started with Programming'],
  ['cl3d:sw-util','🧰','63 · उपयोगी सॉफ़्टवेयर व यूटिलिटी','63 · Useful Software & Utilities'],
  ['cl3d:sw-ai','🤖','64 · क्लाउड, AI व नई तकनीकें','64 · Cloud, AI & New Technologies'],
  ['cl3d:sw-labs','🧪','65 · सॉफ़्टवेयर प्रैक्टिकल लैब (30 कार्य)','65 · Software Practical Lab (30 Tasks)'],
  ['cl3d:sw-quiz','📝','66 · सॉफ़्टवेयर महा-क्विज़ — 100 प्रश्न','66 · Software Quiz (100 Questions)'],
  ['cl3d:sw-glossary','📖','67 · सॉफ़्टवेयर शब्दकोश — पूरे फ़ुल फ़ॉर्म','67 · Software Glossary']
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
  ['cits-trace','🧵','सर्किट ट्रेस और खराबी खोज','Circuit Tracing and Fault Finding']
 ]},
 {id:'electronics',icon:'🔌',hi:'Basic Electronics',en:'Basic Electronics',items:[
  ['basic-electronics','🔌','बेसिक इलेक्ट्रॉनिक्स','Basic Electronics']
 ]},
 {id:'training',icon:'🎓',hi:'Training Methodology',en:'Training Methodology',items:[
  ['training-method','🎓','ट्रेनिंग मीथोडोलॉजी','Training Methodology']
 ]},
 {id:'chnm-intro',icon:'📚',hi:'CHNM Academy',en:'CHNM Academy',items:[
  ['chnm-home','🏁','CHNM परिचय, सिलेबस व टाइमटेबल','CHNM Overview, Syllabus and Timetable']
 ]},
 {id:"chnm-th",icon:"📘",hi:"Future Instructor Group · सम्पूर्ण CHNM गाइड (25)",en:"Future Instructor Group · Complete CHNM Guide (25)",items:[
  ["trade:1","🦺","T1 · सुरक्षा: भार उठाना, अर्थिंग, विद्युत सुरक्षा, प्राथमिक चिकित्सा एवं ई-कचरा","T1 · Safety: Lifting, Earthing, Electrical Safety, First Aid & E-Waste"],
  ["trade:2","🔌","T2 · पावर सप्लाई: SCR/TRIAC, ऑप-एम्प, IC रेगुलेटर एवं SMPS","T2 · Power Supplies: SCR/TRIAC, Op-Amps, IC Regulators & SMPS"],
  ["trade:3","🖥️","T3 · पीसी आर्किटेक्चर, निदान एवं निवारक रखरखाव","T3 · PC Architecture, Diagnostics & Preventive Maintenance"],
  ["trade:4","⌨️","T4 · कीबोर्ड, माउस, लाइट पेन, स्कैनर एवं डिजिटाइज़र","T4 · Keyboard, Mouse, Light Pen, Scanner & Digitizer"],
  ["trade:5","💽","T5 · HDD, CD/DVD ड्राइव, पोर्ट एवं जम्पर सेटिंग","T5 · HDD, CD/DVD Drives, Ports & Jumper Settings"],
  ["trade:6","🧩","T6 · प्रोसेसर, RAM, BIOS, CMOS एवं बैटरी","T6 · Processor, RAM, BIOS, CMOS & Battery"],
  ["trade:7","💻","T7 · लैपटॉप आर्किटेक्चर, सर्विस एवं अपग्रेड","T7 · Laptop Architecture, Service & Upgrades"],
  ["trade:8","🖨️","T8 · प्रिंटर एवं प्लॉटर: DMP, लेज़र, इंकजेट एवं लाइन प्रिंटर","T8 · Printers & Plotters: DMP, Laser, Inkjet and Line Printers"],
  ["trade:9","📠","T9 · स्कैनर, MFD, नेटवर्क एवं पासबुक प्रिंटर","T9 · Scanners, MFDs, Network & Passbook Printers"],
  ["trade:10","🖼️","T10 · मॉनिटर, डिस्प्ले कार्ड, LCD प्रोजेक्टर एवं टचपैड","T10 · Monitors, Display Cards, LCD Projector & Touchpad"],
  ["trade:11","⬆️","T11 · पीसी अपग्रेडिंग: हार्डवेयर, BIOS एवं सॉफ्टवेयर","T11 · PC Upgrading: Hardware, BIOS & Software"],
  ["trade:12","💾","T12 · बैकअप एवं रिमूवेबल स्टोरेज उपकरण","T12 · Backup & Removable Storage Devices"],
  ["trade:13","📱","T13 · टैबलेट एवं स्मार्ट डिवाइस: मरम्मत, फ्लैशिंग एवं OS","T13 · Tablets & Smart Devices: Repair, Flashing & OS"],
  ["trade:14","🔋","T14 · यूपीएस: प्रकार, बैटरी, रखरखाव एवं खराबी","T14 · UPS: Types, Battery, Maintenance & Faults"],
  ["trade:15","🌐","T15 · TCP/IP, IPv4/IPv6 एड्रेसिंग एवं सबनेटिंग","T15 · TCP/IP, IPv4/IPv6 Addressing & Subnetting"],
  ["trade:16","🔀","T16 · नेटवर्क उपकरण, VLAN, STP एवं Packet Tracer","T16 · Network Devices, VLAN, STP & Packet Tracer"],
  ["trade:17","📶","T17 · वायर्ड + वायरलेस एकीकरण, PoE एवं नेटवर्क सुरक्षा","T17 · Wired + Wireless Integration, PoE & Network Protection"],
  ["trade:18","🗄️","T18 · Windows Server, Active Directory एवं इंटरनेट शेयरिंग","T18 · Windows Server, Active Directory & Internet Sharing"],
  ["trade:19","🧭","T19 · DNS एवं DHCP सर्वर कॉन्फ़िगरेशन","T19 · DNS & DHCP Server Configuration"],
  ["trade:20","🔐","T20 · RRAS: रूटिंग, NAT, VPN एवं RADIUS","T20 · RRAS: Routing, NAT, VPN & RADIUS"],
  ["trade:21","👥","T21 · AGDLP, NTFS अनुमतियाँ एवं ग्रुप पॉलिसी","T21 · AGDLP, NTFS Permissions & Group Policy"],
  ["trade:22","🌍","T22 · वेब सर्वर (IIS), FTP एवं बैकअप/रिकवरी","T22 · Web Server (IIS), FTP & Backup/Recovery"],
  ["trade:23","🛡️","T23 · सर्वर सुरक्षा बेसलाइन, ऑडिटिंग एवं IPSec","T23 · Server Security Baseline, Auditing & IPSec"],
  ["trade:24","🐧","T24 · Linux सर्वर: इंस्टॉल, कॉन्फ़िगर एवं प्रशासन","T24 · Linux Server: Install, Configure & Administer"],
  ["trade:25","🔒","T25 · नेटवर्क सुरक्षा: खतरे, फायरवॉल, Wi-Fi एवं VPN","T25 · Network Security: Threats, Firewalls, Wi-Fi & VPN"]
 ]},
 {id:"chnm-pr",icon:"🛠️",hi:"CHNM · ट्रेड प्रैक्टिकल (19)",en:"CHNM · Trade Practical (19)",items:[
  ["chnm-pr-p-safety","🦺","जॉब 1 · सुरक्षा, अर्थिंग, प्राथमिक चिकित्सा एवं ई-कचरा (अभ्यास 1–6)","Job 1 · Safety, Earthing, First Aid & E-Waste (Ex. 1–6)"],
  ["chnm-pr-p-smps","🔌","जॉब 2 · पावर सप्लाई: SCR, Op-Amp, रेगुलेटर एवं PC SMPS (अभ्यास 7–11)","Job 2 · Power Supplies: SCR, Op-Amp, Regulators & PC SMPS (Ex. 7–11)"],
  ["chnm-pr-p-pc-diag","🩺","जॉब 3 · PC डायग्नोस्टिक्स, बेंचमार्किंग एवं POST खराबी (अभ्यास 12–15)","Job 3 · PC Diagnostics, Benchmarking & POST Faults (Ex. 12–15)"],
  ["chnm-pr-p-peripherals","⌨️","जॉब 4 · PC उप-संरचनाएँ: कीबोर्ड, माउस, ड्राइव, पोर्ट एवं BIOS (अभ्यास 16–27)","Job 4 · PC Subassemblies: Keyboard, Mouse, Drives, Ports & BIOS (Ex. 16–27)"],
  ["chnm-pr-p-laptop","💻","जॉब 5 · लैपटॉप असेंबली, अपग्रेड एवं ट्रबलशूटिंग (अभ्यास 28–37)","Job 5 · Laptop Assembly, Upgrade & Troubleshooting (Ex. 28–37)"],
  ["chnm-pr-p-printer-dmp","🖨️","जॉब 6 · डॉट-मैट्रिक्स एवं इंकजेट प्रिंटर (अभ्यास 38–48, 56–59)","Job 6 · Dot-Matrix & Inkjet Printers (Ex. 38–48, 56–59)"],
  ["chnm-pr-p-printer-laser","🖨️","जॉब 7 · लेज़र प्रिंटर, प्लॉटर एवं कंट्रोल बोर्ड (अभ्यास 49–55, 60–65)","Job 7 · Laser Printers, Plotters & Control Boards (Ex. 49–55, 60–65)"],
  ["chnm-pr-p-scanner-mfd","📠","जॉब 8 · स्कैनर, बारकोड, नेटवर्क स्कैनर एवं MFD (अभ्यास 66–72)","Job 8 · Scanner, Barcode, Network Scanner & MFD (Ex. 66–72)"],
  ["chnm-pr-p-monitor","🖥️","जॉब 9 · मॉनिटर एवं डिस्प्ले: ड्राइवर, टच एवं सर्विसिंग (अभ्यास 73–80)","Job 9 · Monitor & Display: Drivers, Touch & Servicing (Ex. 73–80)"],
  ["chnm-pr-p-assembly","🧩","जॉब 10 · मदरबोर्ड, मेमोरी, पेन ड्राइव एवं PC असेंबली (अभ्यास 81–85)","Job 10 · Motherboard, Memory, Pen Drive & PC Assembly (Ex. 81–85)"],
  ["chnm-pr-p-mobile","📱","जॉब 11 · टैबलेट एवं स्मार्टफोन सर्विस, फ़्लैशिंग एवं ट्रबलशूटिंग (अभ्यास 86–94)","Job 11 · Tablet & Smartphone Service, Flashing & Troubleshooting (Ex. 86–94)"],
  ["chnm-pr-p-ups","🔋","जॉब 12 · UPS: ब्लॉक, नियंत्रण, रखरखाव एवं फॉल्ट अनुकरण (अभ्यास 95–102)","Job 12 · UPS: Blocks, Controls, Maintenance & Fault Simulation (Ex. 95–102)"],
  ["chnm-pr-p-tcpip","🌐","जॉब 13 · IP एड्रेसिंग, TCP/IP सेटअप, उपयोगिताएँ एवं शेयरिंग (अभ्यास 103–107)","Job 13 · IP Addressing, TCP/IP Setup, Utilities & Sharing (Ex. 103–107)"],
  ["chnm-pr-p-switch-wireless","📶","जॉब 14 · स्विच, VLAN, वायरलेस एकीकरण एवं PoE (अभ्यास 108–111)","Job 14 · Switch, VLAN, Wireless Integration & PoE (Ex. 108–111)"],
  ["chnm-pr-p-server-install","🗄️","जॉब 15 · सर्वर हार्डवेयर, Windows Server, AD, मॉडेम एवं DNS/DHCP (अभ्यास 112–117)","Job 15 · Server Hardware, Windows Server, AD, Modem & DNS/DHCP (Ex. 112–117)"],
  ["chnm-pr-p-rras","🔐","जॉब 16 · RRAS, VPN, IAS/RADIUS एवं TCP/IP रूटिंग (अभ्यास 118–122)","Job 16 · RRAS, VPN, IAS/RADIUS & TCP/IP Routing (Ex. 118–122)"],
  ["chnm-pr-p-agdlp-web","👥","जॉब 17 · खाते, AGDLP, OU, GPO, वेब/मेल एवं बैकअप (अभ्यास 123–130)","Job 17 · Accounts, AGDLP, OU, GPO, Web/Mail & Backup (Ex. 123–130)"],
  ["chnm-pr-p-security","🛡️","जॉब 18 · सुरक्षा बेसलाइन, ऑडिट, प्रोटोकॉल सुरक्षा एवं निगरानी (अभ्यास 131–139)","Job 18 · Security Baseline, Audit, Protocol Security & Monitoring (Ex. 131–139)"],
  ["chnm-pr-p-linux-firewall","🐧","जॉब 19 · Linux सर्वर, होस्ट्स/SWAT/Telnet एवं फायरवॉल/UTM/Wi-Fi सुरक्षा (अभ्यास 140–149)","Job 19 · Linux Server, Hosts/SWAT/Telnet & Firewall/UTM/Wi-Fi Security (Ex. 140–149)"]
 ]},
 {id:"chnm-tm",icon:"🎓",hi:"Training Methodology · नई डिजिटल बुक (16)",en:"Training Methodology · New Digital Book (16)",items:[
  ["study:1","👨‍🏫","M1 · अनुदेशक की भूमिकाएँ और जिम्मेदारियाँ","M1 · Roles and Responsibilities of an Instructor"],
  ["study:2","🧠","M2 · सीखने का मनोविज्ञान","M2 · Psychology of Learning"],
  ["study:3","📑","M3 · पाठ्यक्रम विश्लेषण और कोर्स निर्माण","M3 · Analysis of Syllabus and Course Construction"],
  ["study:4","🗓️","M4 · निर्देश और कौशल अभ्यास की योजना","M4 · Planning for Instruction and Skills Practice"],
  ["study:5","📽️","M5 · अनुदेशात्मक प्रौद्योगिकी","M5 · Instructional Technology and Facilitate Learning"],
  ["study:6","📝","M6 · लिखित अनुदेशात्मक सामग्री","M6 · Written Instructional Material"],
  ["study:7","📊","M7 · आकलन, प्रमाणन और मूल्यांकन","M7 · Assessment, Certification, Test and Evaluation"],
  ["study:8","🏭","M8 · अनुदेशन कार्यों का संगठन और प्रबंधन","M8 · Organisation and Management of Instructional Functions"],
  ["study:9","🤝","M9 · परामर्श और मार्गदर्शन","M9 · Counseling and Mentoring"],
  ["study:10","💼","M10 · उद्यमिता विकास और नेतृत्व","M10 · Entrepreneurship Development and Leadership"],
  ["study:11","🌐","M11 · ICT और इंटरनेट आधारित शिक्षण","M11 · ICT and Internet Distance Learning Programme"],
  ["study:12","🏅","M12 · NSQF और QP को समझना","M12 · Interpret NSQF and QP"],
  ["study:13","🧓","M13 · वयस्क शिक्षा के सिद्धांत","M13 · Principles of Adult Learning"],
  ["study:14","📈","M14 · सतत व्यावसायिक विकास (CPD)","M14 · Continuing Professional Development"],
  ["study:15","🚀","M15 · औद्योगिक आवश्यकताओं के लिए रोजगार कौशल","M15 · Employability Skills for Industrial Needs"],
  ["study:16","🤖","M16 · उभरती प्रौद्योगिकी में भविष्य के कौशल","M16 · Future Skills in Emerging Technology"]
 ]},
 {id:"chnm-sk",icon:"🗣️",hi:"CHNM · सॉफ्ट स्किल्स (10)",en:"CHNM · Soft Skills (10)",items:[
  ["chnm-sk-ss-communication","🗣️","S1 · संचार कौशल","S1 · Communication Skills"],
  ["chnm-sk-ss-self","⏰","S2 · आत्म-प्रबंधन एवं समय प्रबंधन","S2 · Self-Management & Time Management"],
  ["chnm-sk-ss-grooming","👔","S3 · व्यक्तिगत ग्रूमिंग एवं व्यावसायिक शिष्टाचार","S3 · Personal Grooming & Professional Etiquette"],
  ["chnm-sk-ss-interview","🤵","S4 · इंटरव्यू तैयारी एवं रिज़्यूमे लेखन","S4 · Interview Preparation & Resume Writing"],
  ["chnm-sk-ss-math","🔢","S5 · मूल गणितीय गणनाएँ","S5 · Basic Mathematical Calculations"],
  ["chnm-sk-ss-aptitude","🧮","S6 · मात्रात्मक अभिक्षमता","S6 · Quantitative Aptitude"],
  ["chnm-sk-ss-reasoning","🧩","S7 · तार्किक तर्क","S7 · Logical Reasoning"],
  ["chnm-sk-ss-data","📊","S8 · आँकड़ों का विश्लेषण","S8 · Data Interpretation"],
  ["chnm-sk-ss-energy","🌱","S9 · ऊर्जा एवं पर्यावरण","S9 · Energy & Environment"],
  ["chnm-sk-ss-english","🔤","S10 · अंग्रेज़ी साक्षरता एवं कार्यस्थल अंग्रेज़ी","S10 · English Literacy & Workplace English"]
 ]}
];
var chnmGuideGroupIndex=GROUPS.findIndex(function(group){return group.id==='chnm-th'});
if(chnmGuideGroupIndex>0)GROUPS.unshift(GROUPS.splice(chnmGuideGroupIndex,1)[0]);
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
/* पैनल .wrap के बाहर भी हैं; सभी मुख्य सेक्शन को नेविगेशन से नियंत्रित करें। */
pageSections.forEach(function(section){section.classList.add('pv-hide')});
['part1','part2'].forEach(function(id){var e=document.getElementById(id);if(e)e.classList.add('pv-hide')});
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
 pageSections.forEach(function(section){section.classList.add('pv-hide')});
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
