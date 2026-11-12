
/* =====================================================================
   रियल SMPS लाइव सर्किट · Future Instructor Group · Sant Varman 420
   42 कंपोनेंट का पूरा बोर्ड (प्राइमरी + सेकेंडरी/फ़ीडबैक), बेंच वाले इंजन पर चलता है।
   हर पार्ट शॉर्ट / ओपन / कमज़ोर किया जा सकता है; मीटर में ON/OFF, कंटीन्युटी, Ω, डायोड, कैप।
   ===================================================================== */
(function(){
'use strict';
const X=window.__bx,host=document.getElementById('realsim');
if(!X||!host||!X.measure)return;
const {st,COMPS,CM,NODES}=X,NS='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
const el=(t,a,p,h)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);if(h!==undefined)e.innerHTML=h;return e};
/* ---------- हर पार्ट का काम (एक पंक्ति) ---------- */
const ROLE={f1:'AC लाइन की पहली सुरक्षा। शॉर्ट पर जलकर बिजली काट देता है।',mov:'स्पाइक और ओवरवोल्टेज को लगभग 275 V पर सोखने वाला वैरिस्टर।',xc:'X2 कैपेसिटर: लाइन का शोर (EMI) छानता है।',ntc:'चालू होते समय का सर्ज करंट रोकता है।',
d1:'ब्रिज का एक डायोड: AC की एक दिशा को DC बनाता है।',d2:'ब्रिज का एक डायोड: AC की एक दिशा को DC बनाता है।',d3:'ब्रिज का एक डायोड: AC की एक दिशा को DC बनाता है।',d4:'ब्रिज का एक डायोड: AC की एक दिशा को DC बनाता है।',
c1:'300 V DC जमा रखकर सपाट करने वाला बल्क कैपेसिटर।',rbl:'बंद करने पर बल्क कैपेसिटर को धीरे-धीरे डिस्चार्ज करता है।',rst:'चालू होते समय PWM IC को शुरुआती करंट देता है।',cvcc:'IC की सप्लाई (VCC) को स्थिर रखता है।',
daux:'चालू होने के बाद ऑक्स वाइंडिंग से IC को सप्लाई देता है।',ic1:'PWM कंट्रोल IC: MOSFET की पल्स और सुरक्षा (OCP/OVP) संभालता है।',rg:'गेट रेसिस्टर: MOSFET की स्विचिंग की गति संभालता है।',rgs:'गेट को GND से पकड़ता है ताकि MOSFET बेवजह ऑन न हो।',
rcs:'करंट-सेंस रेसिस्टर: ओवरलोड का संकेत IC को देता है।',q1:'मुख्य स्विचिंग MOSFET: ट्रांसफ़ॉर्मर में ऊर्जा भेजता है।',t1p:'ट्रांसफ़ॉर्मर की प्राइमरी वाइंडिंग (300 V की तरफ़)।',
dsn:'स्नबर डायोड: MOSFET पर वोल्टेज स्पाइक दबाता है।',rsn:'स्नबर रेसिस्टर: स्पाइक की ऊर्जा गर्मी बनाकर निकालता है।',csn:'स्नबर कैपेसिटर: स्पाइक की ऊर्जा पकड़ता है।',
t1s12:'12 V की सेकेंडरी वाइंडिंग।',d12:'12 V की पल्स को DC बनाने वाला शॉटकी डायोड।',c2a:'12 V का पहला फ़िल्टर कैपेसिटर।',l1:'12 V कॉइल: पल्स को छानकर सपाट करता है।',c2b:'12 V का दूसरा फ़िल्टर कैपेसिटर।',rdum:'डमी लोड: हल्के लोड पर वोल्टेज उठने से रोकता है।',
t1s5:'5 V और 5VSB की सेकेंडरी वाइंडिंग।',d5:'5 V का शॉटकी डायोड।',c5a:'5 V का पहला फ़िल्टर कैपेसिटर।',l2:'5 V कॉइल: पल्स को छानता है।',c5b:'5 V का दूसरा फ़िल्टर कैपेसिटर।',q33:'5 V से 3.3 V बनाने वाला पास MOSFET।',c33:'3.3 V का फ़िल्टर कैपेसिटर।',dsb:'5VSB (स्टैंडबाय) का डायोड।',csb:'5VSB का कैपेसिटर।',
rled:'ऑप्टो की LED का करंट सीमित करता है।',opto:'फ़ीडबैक को आइसोलेशन पार भेजता है (PC817)।',tl:'2.5 V रेफ़रेंस से आउटपुट को तौलता है (TL431)।',rup:'वोल्टेज-डिवाइडर का ऊपरी रेसिस्टर: 12 V → 2.5 V।',rdn:'वोल्टेज-डिवाइडर का निचला रेसिस्टर।'};
/* ---------- चिह्न (सब x-अक्ष पर, लंबाई 44) ---------- */
const SY={
res:'<path d="M-22 0h9l3-8 6 16 6-16 6 16 3-8h11"/>',cap:'<path d="M-22 0h18M4 0h18M-4-12v24M4-12q-5 12 0 24"/>',film:'<path d="M-22 0h18M4 0h18M-4-12v24M4-12v24"/>',
dio:'<path d="M-22 0h10M12 0h10M-12-10v20l22-10zM12-10v20"/>',sch:'<path d="M-22 0h10M12 0h10M-12-10v20l22-10zM12-10v20M9-10h3M12 10h3"/>',
fuse:'<rect x="-14" y="-7" width="28" height="14" rx="4"/><path d="M-22 0h8M14 0h8M-14 0h28"/>',disc:'<circle r="11"/><path d="M-22 0h11M11 0h11M-7 8l14-16"/>',
ind:'<path d="M-22 0h1a5.25 5.25 0 0 1 10.5 0a5.25 5.25 0 0 1 10.5 0a5.25 5.25 0 0 1 10.5 0a5.25 5.25 0 0 1 10.5 0h1"/>',wind:'<path d="M-22 0h1a5.25 5.25 0 0 1 10.5 0a5.25 5.25 0 0 1 10.5 0a5.25 5.25 0 0 1 10.5 0a5.25 5.25 0 0 1 10.5 0h1"/>',
led:'<path d="M-22 0h10M12 0h10M-12-10v20l22-10zM12-10v20M-4-14l5-6M1-15l5-6"/>',tl:'<path d="M-22 0h10M12 0h10M-12-10v20l22-10zM12-10v20M12-10l7-5"/>',
mos:'<path d="M0-22V-11H-6M0 22V11H-6M-6-14v6M-6-3v6M-6 8v6M-11-14v28M-22 0H-11"/><circle r="19" fill="none"/>'};
const kindSym=k=>SY[k]||SY.res;
/* ---------- पार्ट की जगह ---------- */
const P1=[
{i:'f1',x:90,y:70,r:0,lx:0,ly:-15},{i:'ntc',x:260,y:70,r:0,lx:0,ly:-15},{i:'mov',x:170,y:270,r:90,lx:22,ly:4},{i:'xc',x:215,y:270,r:90,lx:22,ly:4},
{i:'d1',x:375,y:205,r:0,s:.65,lx:0,ly:-12},{i:'d4',x:375,y:315,r:180,s:.65,lx:0,ly:20},{i:'d2',x:357,y:282,r:-50.7,s:.65,lx:-24,ly:4},{i:'d3',x:393,y:282,r:-129.3,s:.65,lx:24,ly:4},
{i:'c1',x:520,y:250,r:90,lx:22,ly:4},{i:'rbl',x:565,y:250,r:90,lx:22,ly:4},{i:'rst',x:615,y:115,r:90,lx:-22,ly:4,la:'end'},{i:'cvcc',x:650,y:225,r:90,lx:22,ly:4},
{i:'ic1',box:[690,200,100,130]},{i:'rg',x:830,y:255,r:0,lx:0,ly:-14},{i:'rgs',x:845,y:345,r:90,lx:-22,ly:4,la:'end'},{i:'q1',x:930,y:335,r:0,lx:30,ly:4},{i:'rcs',x:930,y:430,r:90,lx:22,ly:4},
{i:'t1p',x:930,y:150,r:90,lx:-22,ly:4,la:'end'},{i:'dsn',x:865,y:195,r:-90,lx:-22,ly:4,la:'end'},{i:'rsn',x:880,y:110,r:90,lx:22,ly:4},{i:'csn',x:850,y:110,r:90,lx:-22,ly:4,la:'end'},{i:'daux',x:1040,y:205,r:0,lx:0,ly:-14}];
const P2=[
{i:'t1s12',x:90,y:150,r:-90,lx:-18,ly:4,la:'end'},{i:'d12',x:170,y:110,r:0,lx:0,ly:-14},{i:'c2a',x:235,y:157,r:90,lx:20,ly:4},{i:'l1',x:310,y:110,r:0,lx:0,ly:-14},{i:'c2b',x:385,y:157,r:90,lx:20,ly:4},{i:'rdum',x:430,y:157,r:90,lx:20,ly:4},
{i:'rup',x:520,y:160,r:90,lx:20,ly:4},{i:'rdn',x:520,y:250,r:90,lx:20,ly:4},{i:'rled',x:660,y:150,r:90,lx:20,ly:4},{i:'opto',x:660,y:225,r:90,lx:20,ly:4},{i:'tl',x:660,y:302,r:-90,lx:22,ly:4},
{i:'t1s5',x:90,y:360,r:-90,lx:-18,ly:4,la:'end'},{i:'d5',x:170,y:320,r:0,lx:0,ly:-14},{i:'c5a',x:235,y:367,r:90,lx:20,ly:4},{i:'l2',x:310,y:320,r:0,lx:0,ly:-14},{i:'c5b',x:385,y:367,r:90,lx:20,ly:4},
{i:'q33',x:500,y:440,r:-90,lx:0,ly:-26},{i:'c33',x:575,y:487,r:90,lx:20,ly:4},{i:'dsb',x:170,y:520,r:0,lx:0,ly:-14},{i:'csb',x:235,y:567,r:90,lx:20,ly:4}];
const GND=(x,y,n)=>({x,y,n});
const V={
p:{W:1150,H:540,parts:P1,
 wires:[[[40,244],[40,70],[68,70]],[[112,70],[238,70]],[[282,70],[290,70],[290,205],[310,205]],[[170,70],[170,248]],[[170,292],[170,480]],[[215,70],[215,248]],[[215,292],[215,480]],[[40,296],[40,480],[290,480],[290,315],[310,315]],
  [[330,205],[420,205]],[[420,315],[330,315]],[[330,315],[420,205]],[[420,315],[330,205]],[[310,205],[330,205]],[[310,315],[330,315]],[[420,205],[440,205]],[[420,315],[440,315]],
  [[440,205],[470,205],[470,70],[930,70],[930,128]],[[440,315],[470,315],[470,342]],[[520,70],[520,228]],[[520,272],[520,300]],[[565,70],[565,228]],[[565,272],[565,300]],
  [[615,70],[615,93]],[[615,137],[615,170],[715,170],[715,200]],[[650,170],[650,203]],[[650,247],[650,268]],[[715,330],[715,350]],
  [[790,255],[808,255]],[[852,255],[870,255],[870,335],[908,335]],[[870,300],[845,300],[845,323]],[[845,367],[845,388]],
  [[930,172],[930,313]],[[930,357],[930,408]],[[930,452],[930,474]],[[850,70],[850,88]],[[880,70],[880,88]],[[850,132],[850,155],[880,155],[880,132]],[[865,155],[865,173]],[[865,217],[865,235],[930,235]],
  [[1000,228],[1000,205],[1018,205]],[[1062,205],[1080,205]],[[1000,272],[1000,300]],[[690,300],[672,300]],[[690,235],[672,235]],[[930,385],[950,385]]],
 dots:[[170,70],[215,70],[520,70],[565,70],[615,70],[850,70],[880,70],[650,170],[870,300],[930,235]],
 gnd:[GND(470,342,'BN'),GND(520,300,'BN'),GND(565,300,'BN'),GND(650,268,'BN'),GND(715,350,'BN'),GND(845,388,'BN'),GND(930,474,'BN'),GND(1000,300,'BN')],
 tps:[['L',55,70],['F',150,70],['R',290,130],['N',150,480],['BP',470,150],['VCC',615,170],['OUT',800,255],['G',870,285],['D',930,250],['SN',865,155],['CS',930,385],['AUX',1000,205]],
 flows:{ac:[[[40,244],[40,70],[290,70],[290,205],[310,205]],[[40,296],[40,480],[290,480],[290,315],[310,315]]],dc:[[[440,205],[470,205],[470,70],[930,70],[930,128]],[[440,315],[470,315],[470,342]]],st:[[[615,70],[615,170],[715,170],[715,200]]],sw:[[[930,172],[930,313]],[[930,357],[930,474]]]},
 core:[963,969,105,290],
 deco(g){
   el('rect',{x:310,y:180,width:130,height:160,rx:10,class:'bx'},g);el('text',{x:375,y:176,class:'cap','text-anchor':'middle'},g,'ब्रिज BR1');
   el('circle',{cx:40,cy:270,r:26,class:'src'},g);el('path',{d:'M26 270q7-14 14 0t14 0',class:'sine'},g);el('text',{x:40,y:318,class:'cap','text-anchor':'middle'},g,'AC इनपुट');
   el('text',{x:40,y:496,class:'cap','text-anchor':'middle'},g,'N');
   el('text',{x:1000,y:98,class:'cap','text-anchor':'middle'},g,'T1 सेकेंडरी →');el('text',{x:1000,y:112,class:'cap','text-anchor':'middle'},g,'(अगला व्यू)');
   el('text',{x:1000,y:326,class:'cap','text-anchor':'middle'},g,'ऑक्स वाइंडिंग');
   [[655,300,'CS'],[655,235,'FB ←'],[1096,205,'→ VCC'],[980,385,'→ U1 CS']].forEach(t=>el('text',{x:t[0],y:t[1]+4,class:'tag','text-anchor':t[0]<700?'end':'start'},g,t[2]));
   el('text',{x:500,y:30,class:'zone'},g,'प्राइमरी · हॉट साइड · ख़तरनाक 300 V');
   const c=el('rect',{x:963-8,y:100,width:20,height:195,rx:4,class:'core'},g);
   el('line',{x1:1030,y1:60,x2:1030,y2:300,class:'iso'},g);
 }},
s:{W:920,H:640,parts:P2,
 wires:[[[90,128],[90,110],[148,110]],[[192,110],[288,110]],[[332,110],[760,110]],[[90,172],[90,196]],[[235,110],[235,135]],[[235,179],[235,196]],[[385,110],[385,135]],[[385,179],[385,196]],[[430,110],[430,135]],[[430,179],[430,196]],
  [[520,110],[520,138]],[[520,182],[520,228]],[[520,272],[520,292]],[[520,205],[580,205],[580,284],[646,284]],[[660,110],[660,128]],[[660,172],[660,203]],[[660,247],[660,280]],[[660,324],[660,346]],
  [[90,338],[90,320],[148,320]],[[192,320],[288,320]],[[332,320],[760,320]],[[90,382],[90,406]],[[235,320],[235,345]],[[235,389],[235,406]],[[385,320],[385,345]],[[385,389],[385,406]],
  [[440,320],[440,440],[478,440]],[[522,440],[760,440]],[[575,440],[575,465]],[[575,509],[575,528]],[[120,320],[120,520],[148,520]],[[192,520],[760,520]],[[235,520],[235,545]],[[235,589],[235,604]]],
 dots:[[235,110],[385,110],[430,110],[520,110],[660,110],[235,320],[385,320],[440,320],[575,440],[120,320],[235,520]],
 gnd:[GND(90,196,'SG'),GND(235,196,'SG'),GND(385,196,'SG'),GND(430,196,'SG'),GND(520,292,'SG'),GND(660,346,'SG'),GND(90,406,'SG'),GND(235,406,'SG'),GND(385,406,'SG'),GND(575,528,'SG'),GND(235,604,'SG')],
 tps:[['T2',90,118],['V12p',215,110],['V12',365,110],['T5',90,330],['V5p',215,320],['V5',365,320],['V33',555,440],['SB',215,520],['FB',520,205],['OA',660,188],['OK',660,262]],
 flows:{v12:[[[90,128],[90,110],[760,110]]],v5:[[[90,338],[90,320],[760,320]]],v33:[[[440,320],[440,440],[760,440]]],sb:[[[120,320],[120,520],[760,520]]]},
 core:[47,53,95,420],
 deco(g){
   el('rect',{x:760,y:80,width:150,height:540,rx:14,class:'bx'},g);el('text',{x:835,y:72,class:'cap','text-anchor':'middle'},g,'ATX कनेक्टर');
   [['V12','+12V (पीला)',110],['PSON','PS_ON (हरा)',190],['PG','PG (ग्रे)',240],['V5','+5V (लाल)',320],['V33','+3.3V (नारंगी)',440],['SB','5VSB (बैंगनी)',520],['SG','GND (काला)',590]].forEach(a=>{
     el('text',{x:778,y:a[2]+4,class:'cap'},g,a[1]);});
   el('text',{x:750,y:378,class:'tag','text-anchor':'end'},g,'ऑप्टो का फ़ोटो-ट्रांज़िस्टर');el('text',{x:750,y:393,class:'tag','text-anchor':'end'},g,'→ प्राइमरी U1 के FB पिन तक');
   el('line',{x1:690,y1:195,x2:690,y2:255,class:'iso'},g);
   el('rect',{x:43,y:90,width:16,height:340,rx:4,class:'core'},g);
   el('text',{x:90,y:60,class:'zone'},g,'सेकेंडरी · सेफ़ साइड · कम वोल्टेज');
   el('text',{x:500,y:355,class:'cap','text-anchor':'middle'},g,'5V → 3.3V');
 }}};
/* पिन/कनेक्टर TP (सेकेंडरी) */
V.s.tps.push(['V12',760,110],['PSON',760,190],['PG',760,240],['V5',760,320],['V33',760,440],['SB',760,520],['SG',760,590]);
/* ---------- UI ढाँचा ---------- */
const root=document.createElement('div');root.className='lv';root.id='rs-root';
root.innerHTML=`
<p class="lv-intro">यह असली ATX SMPS का पूरा सिमुलेटर है: <b>42 असली कंपोनेंट</b>, दो व्यू में (प्राइमरी और सेकेंडरी)। पहले <b>सीखो मोड</b> से पूरा सफ़र समझें, फिर किसी भी पार्ट को शॉर्ट / ओपन / कमज़ोर करके देखें कि बोर्ड का क्या होता है, और नीचे के मीटर से जाँचें। सिमुलेटर बोर्ड, रिपेयर टेस्ट बेंच के साथ साझा है।</p><div class="panel lv-tour" id="rs-tour"></div>
<div class="panel lv-ctl"><div class="row" role="group" aria-label="बोर्ड कंट्रोल">
 <button class="chip" id="rs-plug" type="button" aria-pressed="true">🔌 AC प्लग लगा है</button><button class="chip" id="rs-ps" type="button" aria-pressed="true">PS_ON हरा तार GND से जुड़ा</button>
 <button class="chip" id="rs-spike" type="button">⚡ 1kV स्पाइक</button><button class="chip" id="rs-reset" type="button">♻ सब सही पार्ट</button>
 <label class="lv-sp">एनिमेशन स्पीड <select id="rs-speed"><option value="0.25">0.25× (बहुत धीमा)</option><option value="0.5">0.5× (धीमा)</option><option value="1" selected>1× (सामान्य)</option><option value="2">2× (तेज़)</option></select></label><button class="chip" id="rs-pause" type="button" aria-pressed="false">⏸ रोको</button></div>
 <div class="ctl2" style="margin-top:12px"><div class="ctl"><label for="rs-ac">AC इनपुट <output id="rs-aco"></output></label><input id="rs-ac" type="range" min="90" max="400" step="5" value="230"></div>
 <div class="ctl"><label for="rs-w">कंप्यूटर का लोड <output id="rs-wo"></output></label><input id="rs-w" type="range" min="30" max="600" step="10" value="150"></div></div></div>
<div class="lv-chain" id="rs-chain"></div><div class="lv-rails" id="rs-rails"></div><div class="lv-say" id="rs-say" aria-live="polite"></div>
<div class="panel lv-pick"><h3 style="margin-top:0">🧩 कंपोनेंट चुनें · खराब करके सर्किट में असर देखें</h3>
 <div class="lv-prow"><label for="rs-q">खोजें<input id="rs-q" type="search" placeholder="जैसे: MOSFET, C1, ब्रिज, TL431" autocomplete="off"></label><label for="rs-sel">कंपोनेंट (<span id="rs-cnt"></span>)<select id="rs-sel"></select></label></div>
 <div class="lv-modes" id="rs-modes" role="group" aria-label="चुने पार्ट की हालत"></div></div>
<div class="lv-tabs" role="tablist" aria-label="सर्किट का व्यू"><button type="button" role="tab" data-v="p" aria-selected="true">⚡ प्राइमरी (हाई-वोल्टेज) · 22 पार्ट</button><button type="button" role="tab" data-v="s" aria-selected="false">🔋 सेकेंडरी + फ़ीडबैक · 20 पार्ट</button></div>
<div class="lv-board" id="rs-board"><div class="lv-scroll"><svg id="rs-sp" viewBox="0 0 ${V.p.W} ${V.p.H}" role="img" aria-label="SMPS प्राइमरी सर्किट"></svg><svg id="rs-ss" viewBox="0 0 ${V.s.W} ${V.s.H}" role="img" aria-label="SMPS सेकेंडरी और फ़ीडबैक सर्किट" hidden></svg></div>
 <div class="lv-legend"><span class="k ok"></span>सही <span class="k short"></span>शॉर्ट <span class="k open"></span>ओपन <span class="k weak"></span>कमज़ोर <span class="k tp"></span>टेस्ट बिंदु (टैप करें) <span class="k fl"></span>करंट बहाव</div></div>
<div class="lv-info" id="rs-info"></div>
<div class="mt" id="mt"><div class="mt-top"><div><b>डिजिटल मल्टीमीटर</b><small>पार्ट पर क्लिक करते ही प्रोब उसके दोनों सिरों पर लग जाती हैं</small></div><button type="button" class="mt-pwr" id="mt-pwr" aria-pressed="true"><i></i><span>ON</span></button></div>
 <div class="mt-lcd" id="mt-lcd"><div class="mt-sub" id="mt-sub"></div><div class="mt-val" id="mt-val"></div><div class="mt-hint" id="mt-hint"></div><span class="mt-bz" id="mt-bz" aria-hidden="true">🔔</span></div>
 <div class="mt-modes" id="mt-modes" role="group" aria-label="मीटर का मोड"><div class="mt-grp">बिजली चालू में</div>
  <button type="button" data-m="dcv">V⎓ DC वोल्ट</button><button type="button" data-m="acv">V∼ AC वोल्ट</button><div class="mt-grp off">⚠ बिजली बंद करके (प्लग अपने-आप निकलेगा)</div>
  <button type="button" data-m="cont">🔔 कंटीन्युटी</button><button type="button" data-m="ohm">Ω रेसिस्टेंस</button><button type="button" data-m="dio">▷| डायोड</button><button type="button" data-m="cap">⊣⊢ कैपेसिटेंस</button></div>
 <div class="mt-sel"><label>🔴 लाल प्रोब<select id="mt-r"></select></label><label>⚫ काली प्रोब<select id="mt-b"></select></label><button type="button" id="mt-swap" aria-label="प्रोब अदला-बदली">⇄</button></div>
 <div class="mt-cmp" id="mt-cmp"></div><div class="mt-act"><button type="button" id="mt-act" hidden></button></div></div>
<h3>लाइव ऑसिलोस्कोप (लाल प्रोब का बिंदु)</h3><p class="small" id="rs-scn"></p><canvas id="rs-scope" width="760" height="260" aria-label="लाल प्रोब के बिंदु का वेवफ़ॉर्म"></canvas>
<div class="panel lv-exp" id="rs-exp"><h3 style="margin-top:0">🧪 प्रयोग: पहले अनुमान लगाओ, फिर करके देखो</h3><label class="small" for="rs-es">प्रयोग चुनें</label><select id="rs-es" style="width:100%;padding:9px;margin:6px 0 10px"></select><div id="rs-eq"></div><div class="lv-eo" id="rs-eo"></div><div class="row" style="margin-top:10px"><button class="chip on" id="rs-ego" type="button">▶ करके देखो</button><button class="chip" id="rs-eback" type="button">♻ बोर्ड फिर सही करो</button></div><div id="rs-er" aria-live="polite"></div></div>
<details class="panel lv-gl"><summary><b>📖 शब्दावली: ये शब्द क्या हैं?</b></summary><dl><dt>VCC</dt><dd>PWM IC की अपनी सप्लाई (लगभग 15 V)।</dd><dt>PWM</dt><dd>पल्स की चौड़ाई बदलकर आउटपुट वोल्टेज नियंत्रित करने का तरीका।</dd><dt>रिपल</dt><dd>DC पर बची हुई छोटी हिलावट। जितनी कम, उतना अच्छा।</dd><dt>ESR</dt><dd>कैपेसिटर का अंदरूनी प्रतिरोध। सूखने पर बढ़ता है।</dd><dt>OCP / OVP / SCP</dt><dd>ओवर-करंट / ओवर-वोल्टेज / शॉर्ट-सर्किट सुरक्षा।</dd><dt>हिकअप</dt><dd>सुरक्षा बार-बार लगकर छूटने से आने वाली क्लिक-क्लिक की आवाज़।</dd><dt>5VSB</dt><dd>स्टैंडबाय 5 V जो PC बंद होने पर भी रहता है।</dd><dt>PS_ON</dt><dd>हरा तार। GND से जुड़े तो पावर सप्लाई चालू होती है।</dd><dt>PG (पावर गुड)</dt><dd>सब रेल ठीक होने का 5 V संकेत।</dd><dt>स्नबर</dt><dd>Q1 पर वोल्टेज स्पाइक सोखने वाला D-R-C सर्किट।</dd><dt>आइसोलेशन</dt><dd>प्राइमरी (हाई-वोल्टेज) और सेकेंडरी के बीच बिजली का सीधा संपर्क न होना।</dd></dl></details>
<div class="lv-log" id="rs-log"></div>`;
host.appendChild(root);
/* ---------- SVG बनाना ---------- */
const LUT={};COMPS.forEach(c=>LUT[c.i]=c);
const partView={};P1.forEach(p=>partView[p.i]='p');P2.forEach(p=>partView[p.i]='s');
const svgs={p:$('rs-sp'),s:$('rs-ss')},hlg={},ldg={},tpPos={p:{},s:{}},partEl={};
function gnd(g,a,v){const e=el('g',{class:'gnd'},g);el('path',{d:'M'+a.x+' '+a.y+'v5M'+(a.x-10)+' '+(a.y+5)+'h20M'+(a.x-6)+' '+(a.y+9)+'h12M'+(a.x-2)+' '+(a.y+13)+'h4'},e);el('text',{x:a.x+13,y:a.y+13,class:'tag'},e,a.n);tpAdd(g,v,a.n,a.x,a.y+9,true)}
const tpEls=[];
function tpAdd(g,v,n,x,y,isG){
  const t=el('g',{class:'tp',tabindex:0,role:'button','aria-label':'टेस्ट बिंदु '+(NODES[n]||n)},g);el('circle',{cx:x,cy:y,r:11,class:'tph'},t);el('circle',{cx:x,cy:y,r:isG?3.5:4.5,class:'tpd'},t);el('circle',{cx:x,cy:y,r:9,class:'tpr'},t);
  if(!isG)el('text',{x:x,y:y-9,class:'tpl','text-anchor':'middle'},t,n);
  t.dataset.n=n;t.dataset.v=v;(tpPos[v][n]=tpPos[v][n]||[x,y]);t.addEventListener('click',e=>{e.stopPropagation();probe(n)});t.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();probe(n)}});tpEls.push(t);
}
function build(v){
  const d=V[v],svg=svgs[v];svg.innerHTML='';
  const defs=el('defs',{},svg,'<filter id="rsb'+v+'" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>');
  el('rect',{x:0,y:0,width:d.W,height:d.H,class:'bg'},svg);
  const gGrid=el('g',{class:'grid'},svg);for(let x=20;x<d.W;x+=40)el('line',{x1:x,y1:0,x2:x,y2:d.H},gGrid);for(let y=20;y<d.H;y+=40)el('line',{x1:0,y1:y,x2:d.W,y2:y},gGrid);
  const gw=el('g',{class:'wires'},svg);d.deco(gw);
  d.wires.forEach(w=>el('polyline',{points:w.map(p=>p.join(',')).join(' '),class:'w'},gw));
  d.dots.forEach(p=>el('circle',{cx:p[0],cy:p[1],r:3.2,class:'jn'},gw));
  const gf=el('g',{class:'flows'},svg);d.flowEls={};
  Object.keys(d.flows).forEach(k=>{d.flowEls[k]=d.flows[k].map(w=>el('polyline',{points:w.map(p=>p.join(',')).join(' '),class:'fl '+(v==='s'||k==='sw'?'sec':'pri'),opacity:0},gf))});
  hlg[v]=el('g',{class:'hlg','pointer-events':'none'},svg);
  const gp=el('g',{class:'parts'},svg);
  d.parts.forEach(p=>{
    const c=LUT[p.i];if(!c)return;
    const g=el('g',{class:'cp s-ok',tabindex:0,role:'button','data-i':p.i,'aria-label':c.s+' '+c.n},gp);partEl[p.i]=g;
    if(p.box){const b=p.box;el('rect',{x:b[0],y:b[1],width:b[2],height:b[3],rx:8,class:'icb'},g);
      el('text',{x:b[0]+b[2]/2,y:b[1]+54,class:'ict','text-anchor':'middle'},g,'U1');el('text',{x:b[0]+b[2]/2,y:b[1]+72,class:'icn','text-anchor':'middle'},g,'PWM IC');
      [['VCC',715,214,'middle'],['GND',715,322,'middle'],['OUT',780,259,'end'],['FB',700,239,'start'],['CS',700,304,'start']].forEach(a=>el('text',{x:a[1],y:a[2],class:'pin','text-anchor':a[3]},g,a[0]));
      el('rect',{x:b[0]-8,y:b[1]-8,width:b[2]+16,height:b[3]+16,class:'hit'},g);p.bb=[b[0],b[1],b[2],b[3]];
    }else{
      const gs=el('g',{class:'sy',transform:'translate('+p.x+' '+p.y+') rotate('+p.r+')'+(p.s?' scale('+p.s+')':'')},g,c.k==='mos'?SY.mos:kindSym(c.k));
      if(c.k==='wind'||c.k==='ind'){}
      el('text',{x:p.x+p.lx,y:p.y+p.ly,class:'plb','text-anchor':p.la||'middle'},g,c.s);
      const vert=Math.abs(p.r)===90||c.k==='mos'&&p.r===0,w=(vert?34:54)*(p.s?1.1:1),h=(vert?54:34)*(p.s?1.1:1);
      p.bb=[p.x-w/2,p.y-h/2,w,h];if(c.k==='mos'&&p.r===0)p.bb=[p.x-26,p.y-28,52,56];if(c.k==='mos'&&p.r===-90)p.bb=[p.x-28,p.y-26,56,52];
      el('rect',{x:p.bb[0]-3,y:p.bb[1]-3,width:p.bb[2]+6,height:p.bb[3]+6,class:'hit'},g);
    }
    el('title',{},g,c.s+' · '+c.n+' — '+(ROLE[c.i]||''));g.addEventListener('click',()=>pickPart(p.i,false));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pickPart(p.i,false)}});
    g.addEventListener('mouseenter',()=>{g.dataset.h=1});g.addEventListener('mouseleave',()=>{delete g.dataset.h});
  });
  const gt=el('g',{class:'tps'},svg);
  d.gnd.forEach(a=>gnd(gt,a,v));d.tps.forEach(t=>tpAdd(gt,v,t[0],t[1],t[2]));
  ldg[v]=el('g',{class:'leads','pointer-events':'none'},svg);
  const gc=el('g',{class:'call','pointer-events':'none'},svg);d.call=gc;
  if(d.core){const c=d.core;if(v==='p'){el('line',{x1:c[0],y1:c[2],x2:c[0],y2:c[3],class:'cl'},gw);el('line',{x1:c[1],y1:c[2],x2:c[1],y2:c[3],class:'cl'},gw)}else{el('line',{x1:c[0],y1:c[2],x2:c[0],y2:c[3],class:'cl'},gw);el('line',{x1:c[1],y1:c[2],x2:c[1],y2:c[3],class:'cl'},gw)}}
}
build('p');build('s');
/* ---------- स्थिति ---------- */
const lv={view:'p',sel:'c1',fromList:false,probe:{on:true,mode:'dcv',pr:'BP',pb:'BN',next:'r'}};
const mt=lv.probe;
function setView(v){lv.view=v;svgs.p.toggleAttribute('hidden',v!=='p');svgs.s.toggleAttribute('hidden',v!=='s');root.querySelectorAll('.lv-tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.v===v));drawLeads();drawHL()}
root.querySelectorAll('.lv-tabs button').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.v)));
/* सूची */
const sel=$('rs-sel');
function fillList(q){
  q=(q||'').toLocaleLowerCase();let n=0,html='';
  X.STG.forEach(s=>{const items=COMPS.filter(c=>c.g===s[0]&&(c.s+' '+c.n+' '+c.i+' '+(ROLE[c.i]||'')).toLocaleLowerCase().indexOf(q)>=0);if(!items.length)return;html+='<optgroup label="'+s[1]+'">';items.forEach(c=>{n++;html+='<option value="'+c.i+'">'+c.s+' · '+c.n+'</option>'});html+='</optgroup>'});
  sel.innerHTML=html||'<option value="">कोई कंपोनेंट नहीं मिला</option>';$('rs-cnt').textContent=n+' / '+COMPS.length;
  if(LUT[lv.sel]&&[...sel.options].some(o=>o.value===lv.sel))sel.value=lv.sel;
}
fillList('');sel.value=lv.sel;
$('rs-q').addEventListener('input',e=>{fillList(e.target.value.trim());if(sel.value&&sel.value!==lv.sel)pickPart(sel.value,true)});
sel.addEventListener('change',()=>{if(sel.value)pickPart(sel.value,true)});
function defMode(c){const o=['short','open','weak'].filter(m=>c.m[m]);if(c.k==='cap')return c.m.weak?'weak':o[0];if(c.k==='fuse'||c.k==='ic'||c.k==='wind'||c.k==='res'||c.i==='ntc'||c.k==='ind')return c.m.open?'open':o[0];return o[0]}
const modeFor={res:'ohm',cap:'cap',film:'cap',dio:'dio',sch:'dio',fuse:'cont',disc:'ohm',ind:'cont',mos:'dio',ic:'ohm',tl:'dio',led:'dio',wind:'cont'};
function pickPart(id,fromList){
  const c=LUT[id];if(!c)return;lv.sel=id;lv.fromList=fromList;if(lv.tour&&lv.tour.on&&fromList){lv.tour.on=false;renderTour()}
  if(fromList){applyMode(id,defMode(c),true)}
  if(partView[id]!==lv.view)setView(partView[id]);
  const swp=c.k==='mos'&&c.i!=='q33';mt.pr=swp?c.b:c.a;mt.pb=swp?c.a:c.b;mt.next='r';
  if(X.OFFLINE&&['ohm','dio','cont','cap'].includes(mt.mode))setMeterMode(modeFor[c.k]&&!(c.i==='q33')?modeFor[c.k]:(c.i==='q33'?'ohm':mt.mode),true);
  if([...sel.options].some(o=>o.value===id))sel.value=id;
  drawModes();drawInfo();drawHL();drawLeads();syncProbeSel();
}
function applyMode(id,m,quiet){
  const c=LUT[id],prev=st.c[id];
  if(m==='ok'&&st.plug&&prev!=='ok'){st.plug=false;st.disch=true;X.log('सुरक्षा: पार्ट बदलने के लिए प्लग निकाला और बल्क डिस्चार्ज किया।')}
  st.c[id]=m;st.flash.push(id);st.won=false;
  X.log(c.s+' ('+c.n+'): '+(m==='ok'?'नया ठीक पार्ट लगाया':X.MI[m]+' · '+c.m[m]+(st.plug?' (बिजली चालू में)':'')));
  syncCtl();if(!quiet){drawModes();drawInfo()}
}
function drawModes(){
  const c=LUT[lv.sel],cur=st.c[lv.sel],box=$('rs-modes');
  box.innerHTML='<b class="lv-mh">'+c.s+' · '+c.n+':</b>'+['ok','short','open','weak'].filter(m=>m==='ok'||c.m[m]).map(m=>'<button type="button" class="chip lv-f lv-f-'+m+'" data-m="'+m+'" aria-pressed="'+(cur===m)+'">'+X.MI[m]+(m!=='ok'?'<small>'+c.m[m]+'</small>':'')+'</button>').join('');
  box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{applyMode(lv.sel,b.dataset.m);drawHL()}));
}
/* जानकारी */
function drawInfo(){
  const c=LUT[lv.sel],cur=st.c[lv.sel];
  const eff=m=>c.m[m]&&c.e[m]?'<div class="lp-card '+(m==='short'?'f':m==='open'?'r':'w')+'"><small>'+({short:'⚡ शॉर्ट हुआ तो',open:'⛔ ओपन हुआ तो',weak:'🌫 कमज़ोर हुआ तो'})[m]+'</small><p>'+c.e[m]+'</p></div>':'';
  $('rs-info').innerHTML='<div class="lp-hd"><span class="lp-badge '+(cur==='ok'?'good':'')+'">'+(cur==='ok'?'✓ सही पार्ट':'⚠ '+X.MI[cur]+' · '+c.m[cur])+'</span><b>'+c.s+' · '+c.n+'</b><span class="small">'+c.v+' · पिन '+c.a+' ↔ '+c.b+'</span></div>'
   +'<div class="lp-grid"><div class="lp-card"><small>यह क्या करता है</small><p>'+(ROLE[c.i]||'')+'</p></div>'+eff('short')+eff('open')+eff('weak')+'<div class="lp-card w"><small>जाँच कैसे करें</small><p>'+c.tip+'</p></div></div><div class="lp-live" id="rs-live"></div>';
}
/* ग्लो + कॉलआउट */
function drawHL(){
  Object.values(hlg).forEach(g=>g.innerHTML='');Object.values(V).forEach(d=>d.call&&(d.call.innerHTML=''));
  if(lv.tour&&lv.tour.on){
    const s=TOUR[lv.tour.i],v=s.view,d=V[v];let first=null;
    const glow=b=>{const pd=8;el('rect',{class:'hl-glow',x:b[0]-pd,y:b[1]-pd,width:b[2]+2*pd,height:b[3]+2*pd,rx:14,fill:'#38C6FF',filter:'url(#rsb'+v+')'},hlg[v]);el('rect',{class:'hl-ring',x:b[0]-5,y:b[1]-5,width:b[2]+10,height:b[3]+10,rx:11,stroke:'#38C6FF'},hlg[v]);if(!first)first=b};
    s.parts.forEach(id=>{const p=d.parts.find(q=>q.i===id);if(p&&p.bb)glow(p.bb)});if(s.rect)glow(s.rect);
    if(first){const w=Math.max(120,s.t.length*7.6+16),cx=Math.max(w/2+6,Math.min(d.W-w/2-6,first[0]+first[2]/2)),up=first[1]>70,cy=up?first[1]-46:first[1]+first[3]+16;const g=el('g',{},d.call);el('rect',{x:cx-w/2,y:cy,width:w,height:22,rx:11,fill:'#07140f',stroke:'#38C6FF','stroke-width':1.6},g);el('text',{x:cx,y:cy+15,'text-anchor':'middle',class:'cl-t',fill:'#38C6FF'},g,s.t.length>30?s.t.slice(0,30)+'…':s.t)}
    return}
  const v=partView[lv.sel],d=V[v],p=d.parts.find(q=>q.i===lv.sel);if(!p||!p.bb)return;
  const cur=st.c[lv.sel],bad=cur!=='ok',col=bad?(cur==='open'?'#ffb020':cur==='weak'?'#f2d33a':'#ff4a3a'):'#34e0a1',b=p.bb,pd=8;
  el('rect',{class:'hl-glow',x:b[0]-pd,y:b[1]-pd,width:b[2]+2*pd,height:b[3]+2*pd,rx:14,fill:col,filter:'url(#rsb'+v+')'},hlg[v]);
  el('rect',{class:'hl-ring',x:b[0]-5,y:b[1]-5,width:b[2]+10,height:b[3]+10,rx:11,stroke:col},hlg[v]);
  const c=LUT[lv.sel],txt=(bad?'⚠ '+c.s+' · '+c.m[cur]:'✓ '+c.s+' सही'),w=Math.max(92,txt.length*7.4+18),cx=Math.max(w/2+6,Math.min(d.W-w/2-6,b[0]+b[2]/2)),up=b[1]>70,cy=up?b[1]-pd-30:b[1]+b[3]+pd+10;
  const g=el('g',{},d.call);el('rect',{x:cx-w/2,y:cy,width:w,height:22,rx:11,fill:'#07140f',stroke:col,'stroke-width':1.6},g);el('text',{x:cx,y:cy+15,'text-anchor':'middle',class:'cl-t',fill:col},g,txt);
  el('path',{d:up?'M'+(b[0]+b[2]/2-6)+' '+(cy+22)+'l6 8l6 -8':'M'+(b[0]+b[2]/2-6)+' '+cy+'l6 -8l6 8',fill:col},g);
}
/* ---------- प्रोब और मीटर ---------- */
const MN={dcv:'DC वोल्ट',acv:'AC वोल्ट',cont:'कंटीन्युटी',ohm:'रेसिस्टेंस Ω',dio:'डायोड टेस्ट',cap:'कैपेसिटेंस'},OFFM=['cont','ohm','dio','cap'];
const optN=Object.keys(NODES).map(k=>'<option value="'+k+'">'+NODES[k]+'</option>').join('');
$('mt-r').innerHTML=optN;$('mt-b').innerHTML=optN;
function syncProbeSel(){$('mt-r').value=mt.pr;$('mt-b').value=mt.pb;tpEls.forEach(t=>{t.classList.toggle('pr',t.dataset.n===mt.pr);t.classList.toggle('pb',t.dataset.n===mt.pb)})}
function probe(n){if(mt.next==='r'){mt.pr=n;mt.next='b'}else{mt.pb=n;mt.next='r'}if(!mt.on)setPower(true);syncProbeSel();drawLeads()}
$('mt-r').addEventListener('change',e=>{mt.pr=e.target.value;syncProbeSel();drawLeads()});$('mt-b').addEventListener('change',e=>{mt.pb=e.target.value;syncProbeSel();drawLeads()});
$('mt-swap').addEventListener('click',()=>{[mt.pr,mt.pb]=[mt.pb,mt.pr];syncProbeSel();drawLeads()});
function setPower(on){mt.on=on;const b=$('mt-pwr');b.setAttribute('aria-pressed',on);b.querySelector('span').textContent=on?'ON':'OFF';$('mt').classList.toggle('off',!on);drawLeads()}
$('mt-pwr').addEventListener('click',()=>setPower(!mt.on));
function setMeterMode(m,quiet){
  mt.mode=m;if(!mt.on)setPower(true);
  if(OFFM.includes(m)){if(st.plug){st.plug=false;st.disch=true;X.log('सुरक्षा: '+MN[m]+' के लिए बिजली बंद की गई। प्लग अपने-आप निकाला और बल्क कैपेसिटर डिस्चार्ज हो रहा है।');syncCtl()}else if(st.bulkV>5)st.disch=true}
  $('mt-modes').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m));
}
$('mt-modes').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setMeterMode(b.dataset.m)));
function read(R,mode,pr,pb){const s=[st.mode,st.pr,st.pb];st.mode=mode;st.pr=pr;st.pb=pb;let o;try{o=X.measure(R)}finally{st.mode=s[0];st.pr=s[1];st.pb=s[2]}return o}
let lastBeep='';
function beep(){if(window.__smpsAudio)window.__smpsAudio.play('beep')}
let cmpT=0;
beep=function(){if(window.__smpsAudio)window.__smpsAudio.play('beep')};
function updMeter(R,now){
  $('mt-sub').textContent=mt.on?MN[mt.mode]+'  ·  🔴 '+mt.pr+'   ⚫ '+mt.pb:'';
  const act=$('mt-act');act.hidden=true;
  if(!mt.on){$('mt-val').textContent='OFF';$('mt-hint').textContent='मीटर बंद है। ON दबाएँ।';$('mt-lcd').classList.remove('warn');$('mt-bz').classList.remove('on');$('mt-cmp').innerHTML='';return}
  const o=read(R,mt.mode,mt.pr,mt.pb);
  $('mt-val').textContent=o.v;$('mt-hint').textContent=o.h||'';$('mt-lcd').classList.toggle('warn',!!o.warn);$('mt-bz').classList.toggle('on',!!o.beep);
  if(o.need==='unplug'||(!OFFM.includes(mt.mode)&&!st.plug&&st.c.f1!=='open')){act.hidden=false;act.dataset.a=o.need==='unplug'?'unplug':'plug';act.textContent=o.need==='unplug'?'🔌 प्लग निकालो + डिस्चार्ज':'🔌 प्लग लगाओ'}
  const k=mt.mode+mt.pr+mt.pb+(o.beep?1:0);if(k!==lastBeep){lastBeep=k;if(o.beep)beep()}
  if(now-cmpT>400){cmpT=now;const c=LUT[lv.sel];
    if(c&&st.c[c.i]!=='ok'){const prev=st.c[c.i];st.c[c.i]='ok';let g;try{const Rg=X.analyze();if(Rg.flow)Rg.dc.BP=Rg.bulkT;g=read(Rg,mt.mode,mt.pr,mt.pb)}finally{st.c[c.i]=prev}
      $('mt-cmp').innerHTML='<div class="g"><small>✓ सही '+c.s+' पर यही रीडिंग</small><b>'+g.v+'</b></div><div class="b"><small>⚠ अभी (खराब '+c.s+')</small><b>'+o.v+'</b></div>'+(g.v!==o.v?'<p>फ़र्क़ दिखा: यही खराबी का सबूत है।</p>':'<p>इस जाँच में फ़र्क़ नहीं दिखा। दूसरे मोड या दूसरे बिंदु पर जाँचें।</p>')}
    else $('mt-cmp').innerHTML='<p class="small">खराब करने पर यहाँ "सही पार्ट बनाम अभी" की तुलना आएगी।</p>'}
}
$('mt-act').addEventListener('click',()=>{const a=$('mt-act').dataset.a;if(a==='unplug'){st.plug=false;st.disch=true}else{st.plug=true;st.disch=false}syncCtl()});
function drawLeads(){
  Object.keys(ldg).forEach(v=>{const g=ldg[v];g.innerHTML='';if(!mt.on||v!==lv.view)return;const d=V[v];
    [['pr','#e5262e',24],['pb','#222b36',d.W-24]].forEach(a=>{const t=tpPos[v][mt[a[0]]];const sx=a[2],sy=d.H-14;
      el('circle',{cx:sx,cy:sy,r:8,fill:a[1],stroke:'#fff','stroke-width':2},g);
      if(!t)return;el('path',{d:'M'+sx+' '+sy+' C'+sx+' '+(sy-90)+' '+t[0]+' '+(t[1]+90)+' '+t[0]+' '+t[1],class:'ld',stroke:a[1]},g);el('circle',{cx:t[0],cy:t[1],r:6,fill:a[1],stroke:'#fff','stroke-width':2},g);el('circle',{cx:t[0],cy:t[1],r:7,class:'ldr',stroke:a[1]},g)})});
}
/* ---------- कंट्रोल ---------- */
function syncCtl(){
  const p=(id,on,t)=>{const e=$(id);e.setAttribute('aria-pressed',on);if(t)e.textContent=t};
  p('rs-plug',st.plug,st.plug?'🔌 AC प्लग लगा है':'🔌 AC प्लग निकला है');p('rs-ps',st.ps,st.ps?'PS_ON हरा तार GND से जुड़ा':'PS_ON हरा तार खुला');
  $('rs-aco').textContent=st.ac+' V';$('rs-wo').textContent=st.w+' W';$('rs-ac').value=st.ac;$('rs-w').value=st.w;
}
$('rs-plug').addEventListener('click',()=>{st.plug=!st.plug;if(st.plug)st.disch=false;syncCtl()});
$('rs-ps').addEventListener('click',()=>{st.ps=!st.ps;syncCtl()});
$('rs-spike').addEventListener('click',()=>X.spike());
$('rs-reset').addEventListener('click',()=>{X.allOk();st.plug=true;st.disch=false;st.temp=40;st.hotT=0;st.log=[];X.log('सब पार्ट सही लगा दिए गए।');syncCtl();drawModes();drawInfo();drawHL()});
$('rs-ac').addEventListener('input',e=>{st.ac=+e.target.value;syncCtl()});$('rs-w').addEventListener('input',e=>{st.w=+e.target.value;syncCtl()});
/* ---------- हर फ़्रेम ---------- */
const RL=[['ac','AC इनपुट'],['bulk','बल्क DC'],['12','+12V'],['5','+5V'],['33','+3.3V'],['sb','5VSB'],['pg','PG'],['rp','12V रिपल'],['tq','Q1 तापमान'],['vds','Q1 Vds पीक']];
$('rs-rails').innerHTML=RL.map(r=>'<div class="rl" id="lr-'+r[0]+'"><small>'+r[1]+'</small><b>0</b></div>').join('');
const setRL=(k,t,on,er)=>{const e=$('lr-'+k);e.querySelector('b').textContent=t;e.className='rl'+(on?' on':'')+(er?' er':'')};
let sig='',sayK='',logK='';
function updState(){
  const s=JSON.stringify(st.c);if(s===sig)return;sig=s;
  Object.keys(partEl).forEach(i=>{const v=st.c[i];partEl[i].setAttribute('class','cp s-'+v+(i===lv.sel?' sel':''))});drawModes();drawInfo();drawHL();
}
function frame(now){
  requestAnimationFrame(frame);
  if(host.offsetParent===null)return;
  const R=X.analyze(),D=R.dc,ok=(v,a,b)=>v>a&&v<b;
  updState();
  Object.keys(partEl).forEach(i=>partEl[i].classList.toggle('sel',i===lv.sel));
  /* बहाव */
  const on={ac:R.ac.R>40,dc:R.flow,st:R.flow&&st.c.rst!=='open',sw:R.run,v12:R.v12p>1,v5:R.v5p>1,v33:R.v33>1,sb:R.vsb>1};
  ['p','s'].forEach(v=>{const fe=V[v].flowEls;for(const k in fe)fe[k].forEach(e=>e.setAttribute('opacity',on[k]?1:0))});
  setRL('ac',st.plug?st.ac+' V':'0 V',R.ac.L>0);setRL('bulk',st.bulkV.toFixed(0)+' V',st.bulkV>50,st.bulkV>50&&!st.plug);
  setRL('12',D.V12.toFixed(2)+' V',ok(D.V12,11.4,12.6),R.run&&st.ps&&!ok(D.V12,11.4,12.6));setRL('5',D.V5.toFixed(2)+' V',ok(D.V5,4.75,5.25),R.run&&st.ps&&!ok(D.V5,4.75,5.25));
  setRL('33',D.V33.toFixed(2)+' V',ok(D.V33,3.1,3.5),R.run&&st.ps&&!ok(D.V33,3.1,3.5));setRL('sb',D.SB.toFixed(2)+' V',D.SB>4.7);setRL('pg',R.pg?'हाँ':'नहीं',R.pg,R.run&&st.ps&&!R.pg);
  setRL('rp',R.run&&st.ps?R.rip12.toFixed(0)+' mV':'0 mV',R.run&&st.ps&&R.rip12<120,R.run&&st.ps&&R.rip12>=120);setRL('tq',st.temp.toFixed(0)+' °C',st.temp<100,st.temp>=110);setRL('vds',R.vds.toFixed(0)+' V',R.vds>0&&R.vds<520,R.vds>=600);
  const sk=JSON.stringify(R.m);if(sk!==sayK){sayK=sk;$('rs-say').innerHTML=R.m.map(x=>'<p><b>'+x[0]+'</b><br><span class="small">'+x[1]+'</span></p>').join('');const good=R.m.length===1&&R.m[0][0].indexOf('सब सामान्य')===0;$('rs-say').className='lv-say'+(good?'':(R.run?' warn':' bad'))}
  if(st.logDirty||logK!==st.log.join('|')){logK=st.log.join('|');st.logDirty=false;$('rs-log').innerHTML=st.log.length?'<b>📜 क्या-क्या हुआ</b><ul>'+st.log.map(x=>'<li>'+x+'</li>').join('')+'</ul>':''}
  const lvv=$('rs-live');if(lvv){const c=(l,v,b)=>'<span'+(b?' class="bad"':'')+'><em>'+l+'</em>'+v+'</span>';lvv.innerHTML=c('बल्क',st.bulkV.toFixed(0)+' V',st.plug&&st.bulkV<200)+c('12V',D.V12.toFixed(1)+' V',R.run&&Math.abs(D.V12-12)>.8)+c('5VSB',D.SB>4?'5.0 V':'0 V',D.SB<4)+c('PG',R.pg?'हाँ':'नहीं',!R.pg)+c('Q1 तापमान',st.temp.toFixed(0)+' °C',st.temp>110)}
  updMeter(R,now);updChain(R);updTourWatch(R);if(!lv.paused)drawScope(R);
}
/* स्कोप */
const sc=$('rs-scope'),sx=sc?sc.getContext('2d'):null;let t0=0,lastT=0;
function wf(n,t,R){const D=R.dc,PI2=Math.PI*2,ph=x=>((x%1)+1)%1;
  switch(n){case 'L':return R.ac.L*1.414*Math.sin(PI2*st.hz*t);case 'F':return R.ac.F*1.414*Math.sin(PI2*st.hz*t);case 'R':return R.ac.R*1.414*Math.sin(PI2*st.hz*t);
  case 'N':case 'BN':case 'SG':return 0;case 'BP':{if(!R.run)return D.BP;const f=R.half?st.hz:2*st.hz;return R.vmax-R.vpp*Math.pow(ph(t*f),.85)}
  case 'D':{if(!R.run)return D.D;const p=ph(t*st.fsw*1000);return p<.32?.6:R.vavg+70*Math.exp(-(p-.32)*30)*Math.sin((p-.32)*70)}
  case 'SN':{if(!R.run)return D.SN;const p=ph(t*st.fsw*1000);return R.vavg+35+(p<.4?25*Math.exp(-p*20):0)}
  case 'CS':{if(!R.run)return 0;const p=ph(t*st.fsw*1000);return p<.32?.05+.6*p/.32:0}
  case 'G':case 'OUT':return R.run&&ph(t*st.fsw*1000)<.32?12:0;
  case 'T2':case 'T5':{if(!R.main)return 0;const p=ph(t*st.fsw*1000);return p<.32?D[n]/.32:-4}
  default:{const v=D[n];if(!v)return 0;const r=((n==='V5'||n==='V5p'||n==='V33')?R.rip5:R.rip12)/1000;return v+r*.35*Math.sin(PI2*100*t)+r*.2*Math.sin(PI2*1700*t+1)}}}
function drawScope(R){
  if(!sc)return;
  const now=performance.now()/1000,dt=Math.min(.1,now-lastT);lastT=now;const W=sc.width,H=sc.height,a=mt.pr,b=mt.pb;
  const fast=['D','SN','CS','G','OUT','T2','T5','AUX'].includes(a),span=fast?60e-6:.04;t0+=span*.25*dt*lv.speed;
  sx.fillStyle='rgba(6,18,12,.42)';sx.fillRect(0,0,W,H);sx.strokeStyle='#17402c';sx.lineWidth=1;
  for(let i=0;i<=10;i++){sx.beginPath();sx.moveTo(i*W/10,0);sx.lineTo(i*W/10,H);sx.stroke()}for(let j=0;j<=8;j++){sx.beginPath();sx.moveTo(0,j*H/8);sx.lineTo(W,j*H/8);sx.stroke()}
  const diff=X.dom(a)===X.dom(b)&&!['BN','SG','N'].includes(b),ys=[];let mn=1e9,mx=-1e9;
  for(let i=0;i<=380;i++){const t=t0+span*i/380,v=wf(a,t,R)-(diff?wf(b,t,R):0);ys.push(v);if(v<mn)mn=v;if(v>mx)mx=v}
  let rg=mx-mn;if(rg<1e-6){mn=mx-.5;mx=mx+.5;rg=1}const pd=rg*.18,lo=mn-pd,hi=mx+pd,sy=v=>H-(v-lo)/(hi-lo)*H;
  if(lo<0&&hi>0){sx.strokeStyle='#2f7a55';sx.setLineDash([5,5]);sx.beginPath();sx.moveTo(0,sy(0));sx.lineTo(W,sy(0));sx.stroke();sx.setLineDash([])}
  sx.strokeStyle='#6dff9a';sx.lineWidth=2.2;sx.shadowColor='#6dff9a';sx.shadowBlur=6;sx.beginPath();ys.forEach((v,i)=>{const x=i*W/380,y=sy(v);i?sx.lineTo(x,y):sx.moveTo(x,y)});sx.stroke();sx.shadowBlur=0;
  sx.fillStyle='#9dffc6';sx.font='12px monospace';sx.fillText('max '+mx.toFixed(Math.abs(mx)<10?3:1)+' V',8,16);sx.fillText('min '+mn.toFixed(Math.abs(mn)<10?3:1)+' V',8,H-8);sx.fillText(fast?'6 µs/div':'4 ms/div',W-84,H-8);
  $('rs-scn').textContent='लाल प्रोब: '+(NODES[a]||a)+(diff?' (काली प्रोब के सापेक्ष)':'')+' · '+(fast?'6µs/div (तेज़ स्विचिंग)':'4ms/div (AC के दो चक्र)');
}
/* ===================== सीखो मोड, प्रयोग, चेन-पट्टी, स्पीड ===================== */
const stepsHost=$('rs-tour');
const watchTxt=(l,v)=>'<span class="lv-w"><em>'+l+'</em>'+v+'</span>';
const TOUR=[
{t:'AC बिजली बोर्ड में आती है',view:'p',parts:[],rect:[8,236,64,70],txt:'घर की 230 V AC लाइन (L) और न्यूट्रल (N) से आती है। AC हर सेकंड 50 बार दिशा बदलती है, और इलेक्ट्रॉनिक पार्ट इस पर सीधे नहीं चल सकते। इसलिए आगे इसे DC में बदला जाएगा।',watch:R=>watchTxt('AC इनपुट',(st.plug?st.ac:0)+' V')+watchTxt('पीक',(st.plug?st.ac*1.414:0).toFixed(0)+' V'),act:['प्लग निकालकर देखो',()=>{st.plug=false;syncCtl()}]},
{t:'फ़्यूज़ F1: पहली सुरक्षा',view:'p',parts:['f1'],txt:'आगे कहीं शॉर्ट हो जाए तो करंट बहुत बढ़ जाता है। फ़्यूज़ का पतला तार जलकर AC काट देता है, ताकि बोर्ड और घर को आग से बचाया जा सके। याद रखें: फ़्यूज़ खुद नहीं जलता, किसी खराबी की वजह से जलता है।',watch:R=>watchTxt('F1',st.c.f1==='open'?'उड़ा ✖':'ठीक ✔'),act:['Q1 शॉर्ट करके फ़्यूज़ उड़ाओ',()=>applyMode('q1','short')]},
{t:'MOV और X-कैप: स्पाइक और शोर से बचाव',view:'p',parts:['mov','xc'],txt:'MOV (वैरिस्टर) बिजली की ऊँची स्पाइक को लगभग 275 V पर सोख लेता है। X-कैप लाइन का शोर (EMI) छानता है ताकि दूसरे उपकरण (टीवी, रेडियो) परेशान न हों।',watch:R=>watchTxt('MOV',st.c.mov==='ok'?'ठीक ✔':'खराब ✖')+watchTxt('X-कैप',st.c.xc==='ok'?'ठीक ✔':'खराब ✖'),act:['1kV स्पाइक दो',()=>X.spike()]},
{t:'NTC: चालू होने का झटका रोकता है',view:'p',parts:['ntc'],txt:'प्लग लगाते ही खाली बल्क कैपेसिटर बहुत करंट खींचना चाहता है। ठंडा NTC कुछ ओम का होता है और इस उछाल को रोकता है। बाद में गर्म होकर इसका प्रतिरोध घट जाता है और यह लगभग कुछ नहीं गिराता।',watch:R=>watchTxt('NTC के बाद AC',R.ac.R.toFixed(0)+' V'),act:['NTC ओपन करके देखो',()=>applyMode('ntc','open')]},
{t:'ब्रिज: AC से धड़कती DC',view:'p',parts:['d1','d2','d3','d4'],txt:'AC के एक आधे चक्र में D1 और D4 चालू होते हैं, दूसरे आधे में D2 और D3। इससे करंट हमेशा एक ही दिशा में बहता है। यह DC है, पर अभी धड़कती (पल्सेटिंग) हुई।',watch:R=>watchTxt('बल्क (BP)',st.bulkV.toFixed(0)+' V'),act:['D1 ओपन करके देखो',()=>applyMode('d1','open')]},
{t:'बल्क कैपेसिटर C1: DC को सपाट करता है',view:'p',parts:['c1','rbl'],txt:'C1 धड़कती DC को भरकर लगभग सपाट 300 V बना देता है (230 V × 1.414 ≈ 325 V पीक)। R2 ब्लीडर है: प्लग निकालने पर C1 को धीरे-धीरे खाली करता है, ताकि झटका न लगे।',watch:R=>watchTxt('बल्क DC',st.bulkV.toFixed(0)+' V')+watchTxt('रिपल',R.vpp.toFixed(1)+' V p-p'),act:['C1 को सूखा करो',()=>applyMode('c1','weak')]},
{t:'स्टार्टअप R1 + C3: IC को पहली सप्लाई',view:'p',parts:['rst','cvcc'],txt:'शुरू में PWM IC सोया हुआ है। बल्क के 300 V से R1 बहुत थोड़ा करंट देता है, और C3 धीरे-धीरे भरकर लगभग 15 V पर पहुँचता है। तभी IC जागता है। R1 खुला हो तो IC कभी नहीं जागता।',watch:R=>watchTxt('VCC',R.dc.VCC.toFixed(1)+' V'),act:['R1 ओपन करो',()=>applyMode('rst','open')]},
{t:'PWM IC U1: बोर्ड का दिमाग',view:'p',parts:['ic1','rg','rgs','rcs'],txt:'U1 जागकर MOSFET के लिए पल्स बनाता है (R3 के रास्ते)। R5 पर करंट नापकर वह ओवरलोड पहचानता है और ज़रूरत पर पल्स बंद कर देता है। FB पिन से वह आउटपुट का हाल जानता है।',watch:R=>watchTxt('IC',R.sw?'चल रहा ✔':'बंद'),act:['R3 (गेट R) ओपन करो',()=>applyMode('rg','open')]},
{t:'Q1 और T1: स्विचिंग (बोर्ड का दिल)',view:'p',parts:['q1','t1p'],txt:'Q1 सेकंड में हज़ारों बार (लगभग 65,000) चालू-बंद होकर 300 V की पल्स ट्रांसफ़ॉर्मर T1 में भेजता है। इतनी तेज़ पल्स से छोटा ट्रांसफ़ॉर्मर भी बहुत ऊर्जा आगे भेज पाता है। यही SMPS का राज़ है।',watch:R=>watchTxt('स्विचिंग',st.fsw+' kHz')+watchTxt('Q1 तापमान',st.temp.toFixed(0)+' °C')+watchTxt('Vds पीक',R.vds.toFixed(0)+' V'),act:['लोड 500 W करो',()=>{st.w=500;syncCtl()}]},
{t:'स्नबर D6, R6, C4: स्पाइक का दबाव',view:'p',parts:['dsn','rsn','csn'],txt:'Q1 बंद होते ही ट्रांसफ़ॉर्मर की बची हुई ऊर्जा एक ऊँची स्पाइक बनाती है जो Q1 को मार सकती है। स्नबर उस स्पाइक को सोख लेता है। D6 ओपन हो तो Q1 कुछ ही पल में जल जाता है।',watch:R=>watchTxt('Q1 Vds पीक',R.vds.toFixed(0)+' V (रेटिंग 650 V)'),act:['D6 ओपन करो',()=>applyMode('dsn','open')]},
{t:'ऑक्स D5: IC की अपनी सप्लाई',view:'p',parts:['daux'],txt:'जैसे ही स्विचिंग शुरू होती है, T1 की ऑक्स वाइंडिंग D5 से होकर IC को खुद की सप्लाई देने लगती है। तब R1 का काम खत्म हो जाता है और बिजली की बर्बादी भी बहुत कम रहती है।',watch:R=>watchTxt('VCC',R.dc.VCC.toFixed(1)+' V'),act:['D5 ओपन करो',()=>applyMode('daux','open')]},
{t:'12 V सेकेंडरी: पल्स से साफ़ DC',view:'s',parts:['t1s12','d12','c2a','l1','c2b','rdum'],txt:'T1 की सेकेंडरी वाइंडिंग पल्स देती है। शॉटकी D7 उन्हें DC बनाता है, कॉइल L1 और कैपेसिटर C5, C6 उन्हें छानकर साफ़ 12 V बनाते हैं। बचा हुआ रिपल जितना कम, उतना बेहतर।',watch:R=>watchTxt('+12V',R.v12.toFixed(2)+' V')+watchTxt('रिपल',R.rip12.toFixed(0)+' mV'),act:['C6 को सूखा करो',()=>applyMode('c2b','weak')]},
{t:'5 V, 3.3 V और 5VSB',view:'s',parts:['t1s5','d5','c5a','l2','c5b','q33','c33','dsb','csb'],txt:'5 V की अलग वाइंडिंग से 5 V बनता है। 3.3 V इसी 5 V से Q2 के ज़रिए बनता है। 5VSB (स्टैंडबाय) हमेशा रहता है, चाहे PC बंद हो: इसी से पावर बटन दबाने पर PC जागता है।',watch:R=>watchTxt('+5V',R.v5.toFixed(2)+' V')+watchTxt('+3.3V',R.v33.toFixed(2)+' V')+watchTxt('5VSB',R.vsb.toFixed(2)+' V'),act:['PS_ON का तार खोलो',()=>{st.ps=false;syncCtl()}]},
{t:'फ़ीडबैक: बोर्ड खुद को संभालता है',view:'s',parts:['rup','rdn','tl','opto','rled'],txt:'R9 और R10 12 V को 2.5 V तक उतारते हैं। TL431 इसे 2.5 V रेफ़रेंस से तौलता है। 12 V बढ़े तो ऑप्टो U2 प्राइमरी IC को खबर देता है कि पल्स कम करो, और घटे तो पल्स बढ़ाओ। इसी से वोल्टेज स्थिर रहती है।',watch:R=>watchTxt('FB पिन',R.dc.FB.toFixed(2)+' V (सही ≈ 2.5 V)'),act:['TL431 ओपन करो (फ़ीडबैक टूटा)',()=>applyMode('tl','open')]},
{t:'सुरक्षा और PG: सब ठीक है का संकेत',view:'s',parts:[],rect:[760,176,150,80],txt:'OCP ओवरलोड पर, OVP ज़्यादा वोल्टेज पर और SCP शॉर्ट पर बोर्ड बंद कर देते हैं। जब सब रेल ठीक आ जाती हैं, तब PG (पावर गुड) 5 V हो जाता है और PC को चालू होने की इजाज़त मिलती है।',watch:R=>watchTxt('PG',R.pg?'5 V ✔':'0 V ✖')+watchTxt('PS_ON',st.ps?'0 V (हरा तार GND से)':'~5 V (खुला)'),act:['लोड 560 W करो (OCP)',()=>{st.w=560;syncCtl()}]}
];
lv.tour={on:false,i:0};
function renderTour(){
  const T=lv.tour,h=stepsHost;
  if(!T.on){h.innerHTML='<div class="lv-tour-head"><div><b>🎓 सीखो मोड</b><p>AC से लेकर 12 V तक पूरा सफ़र, 15 आसान कदमों में। हर कदम पर सर्किट के वही पार्ट चमकेंगे और लाइव रीडिंग साथ में दिखेगी।</p></div><button type="button" class="chip on" id="rs-tstart">▶ सीखना शुरू करें</button></div>';$('rs-tstart').onclick=()=>{T.on=true;T.i=0;goStep(0)};return}
  const s=TOUR[T.i];
  h.innerHTML='<div class="lv-tour-head"><div><small class="lv-st">कदम '+(T.i+1)+' / '+TOUR.length+'</small><b>'+s.t+'</b></div><button type="button" class="chip" id="rs-tstop">✕ बंद करें</button></div><div class="lv-prog"><i style="width:'+((T.i+1)/TOUR.length*100)+'%"></i></div>'
   +'<p class="lv-ttxt">'+s.txt+'</p><div class="lv-tw" id="rs-tw"></div><div class="lv-tbtns"><button type="button" class="chip" id="rs-tprev"'+(T.i?'':' disabled')+'>◀ पिछला</button><button type="button" class="chip on" id="rs-tnext">'+(T.i===TOUR.length-1?'✔ पूरा हुआ':'अगला ▶')+'</button>'+(s.act?'<button type="button" class="chip" id="rs-tact">🧪 '+s.act[0]+'</button>':'')+'</div>';
  $('rs-tstop').onclick=()=>{T.on=false;renderTour();drawHL()};
  $('rs-tprev').onclick=()=>{if(T.i>0)goStep(T.i-1)};$('rs-tnext').onclick=()=>{if(T.i<TOUR.length-1)goStep(T.i+1);else{T.on=false;renderTour();drawHL()}};
  if(s.act)$('rs-tact').onclick=()=>{s.act[1]();drawHL()};
}
function goStep(i){lv.tour.i=i;const s=TOUR[i];if(s.view!==lv.view)setView(s.view);renderTour();drawHL();stepsHost.scrollIntoView({block:'nearest',behavior:'smooth'})}
function updTourWatch(R){if(!lv.tour.on)return;const e=$('rs-tw');if(e)e.innerHTML=TOUR[lv.tour.i].watch(R)}
/* ---------- चेन-पट्टी: चेन कहाँ टूटी ---------- */
const CH=[['AC',R=>R.ac.L>0],['फ़्यूज़/NTC',R=>R.ac.R>40],['ब्रिज+बल्क',R=>st.bulkV>200],['IC की सप्लाई',R=>R.dc.VCC>8],['स्विचिंग',R=>R.run],['12V',R=>R.v12>11],['5V',R=>R.v5>4.7],['3.3V',R=>R.v33>3.1],['5VSB',R=>R.vsb>4.7],['PG',R=>R.pg]];
function updChain(R){
  let broke=-1;const html=CH.map((c,i)=>{const ok=c[1](R);let cls=ok?'ok':(broke<0?'bad':'idle');if(!ok&&broke<0)broke=i;if(broke>=0&&i>broke&&!ok)cls='idle';return '<span class="'+cls+'"><i>'+(ok?'✔':cls==='bad'?'✖':'·')+'</i>'+c[0]+'</span>'}).join('<b>›</b>');
  const k=html;if($('rs-chain').dataset.k!==k){$('rs-chain').dataset.k=k;$('rs-chain').innerHTML='<small>बिजली का सफ़र: जहाँ <b>✖</b> आए वहीं चेन टूटी है, उसके आगे वाले अपने-आप बंद दिखते हैं।</small><div>'+html+'</div>'}
}
/* ---------- प्रयोग: पहले अनुमान, फिर करके देखो ---------- */
const reset0=()=>{X.allOk();st.plug=true;st.disch=false;st.ac=230;st.w=150;st.ps=true;st.temp=40;st.hotT=0;st.log=[];syncCtl()};
const EXP=[
{q:'बल्क कैपेसिटर C1 सूखा (क्षमता घटी) हो जाए और लोड 300 W हो तो?',o:['कुछ नहीं होगा','रिपल/हम बढ़ेगा और वैली वोल्टेज गिरेगा; भारी लोड पर बोर्ड बंद हो सकता है','फ़्यूज़ तुरंत उड़ेगा'],c:1,f:()=>{st.w=300;applyMode('c1','weak')},e:'सूखे C1 की क्षमता कम होती है, इसलिए हर चक्र में उसका वोल्टेज ज़्यादा गिरता है (रिपल बढ़ता है)। भारी लोड पर वैली वोल्टेज इतना गिरता है कि IC बंद हो जाता है।'},
{q:'स्टार्टअप रेसिस्टर R1 ओपन हो जाए तो?',o:['बल्क पर 300 V है पर PSU स्टार्ट नहीं होता, रेल 0','फ़्यूज़ उड़ेगा','12 V ऊँचा होगा'],c:0,f:()=>applyMode('rst','open'),e:'R1 से ही IC को पहली सप्लाई मिलती है। वह खुला हो तो IC जागता ही नहीं, इसलिए स्विचिंग शुरू नहीं होती, जबकि बल्क पर 300 V मौजूद रहता है।'},
{q:'Q1 के D–S शॉर्ट हो जाएँ तो?',o:['5 V बढ़ जाएगा','फ़्यूज़ उड़ेगा और R5, U1 व R3 भी जल सकते हैं','सिर्फ़ पंखा रुकेगा'],c:1,f:()=>applyMode('q1','short'),e:'शॉर्ट Q1 से 300 V सीधे ग्राउंड तक पहुँचता है और बहुत भारी करंट बहता है। फ़्यूज़ उड़ता है, और R5, U1 व R3 जैसे आस-पास के पार्ट भी साथ में जल जाते हैं।'},
{q:'TL431 ओपन (फ़ीडबैक टूटा) हो जाए तो?',o:['आउटपुट चढ़ेगा और OVP से बोर्ड बंद हो जाएगा','आउटपुट 0 रहेगा','कुछ नहीं होगा'],c:0,f:()=>applyMode('tl','open'),e:'फ़ीडबैक न मिलने पर IC को लगता है कि आउटपुट कम है, इसलिए वह पल्स बढ़ाता जाता है। वोल्टेज चढ़ने लगती है और OVP सुरक्षा बोर्ड को बंद कर देती है।'},
{q:'स्नबर डायोड D6 ओपन हो जाए तो?',o:['कुछ असर नहीं','Q1 पर स्पाइक इतनी बढ़ेगी कि Q1 जल जाएगा','5VSB चला जाएगा'],c:1,f:()=>applyMode('dsn','open'),e:'D6 के बिना ट्रांसफ़ॉर्मर की बची ऊर्जा की स्पाइक सोखी नहीं जाती। Q1 पर वोल्टेज 650 V की रेटिंग पार कर जाता है और Q1 शॉर्ट हो जाता है।'},
{q:'AC अचानक 300 V हो जाए (न्यूट्रल टूटना), और MOV लगा हो तो?',o:['MOV जलकर फ़्यूज़ उड़ा देगा और बाकी पार्ट बच जाएँगे','सारे पार्ट जल जाएँगे','कुछ नहीं होगा'],c:0,f:()=>{st.ac=300;syncCtl()},e:'MOV लगभग 275 V के ऊपर चालू होकर भारी करंट लेता है, जल जाता है (शॉर्ट) और फ़्यूज़ उड़ा देता है। बलिदान देकर वह बाकी महँगे पार्ट बचा लेता है।'},
{q:'लोड 560 W कर दें (बोर्ड की रेटिंग 450 W)?',o:['ज़्यादा बिजली मिलेगी','OCP से हिकअप (क्लिक-क्लिक), आउटपुट 0','12 V बढ़ेगा'],c:1,f:()=>{st.w=560;syncCtl()},e:'रेटिंग से ज़्यादा लोड पर करंट-सेंस R5 से IC को खतरा पता चलता है और वह सुरक्षा (OCP) चालू करके पल्स बंद कर देता है। फिर कोशिश करता है, फिर बंद करता है: यही क्लिक-क्लिक (हिकअप) है।'},
{q:'12 V का कैपेसिटर C6 सूखा हो जाए तो?',o:['रिपल बढ़ेगा; PG अस्थिर होकर PC रीस्टार्ट/हैंग हो सकता है','12 V 0 हो जाएगा','कुछ नहीं होगा'],c:0,f:()=>{st.w=350;applyMode('c2b','weak')},e:'C6 का काम पल्स को छानना है। सूखने पर ESR बढ़ता है और रिपल बढ़ जाता है। 12 V साफ़ नहीं रहता, इसलिए PC अजीब तरह से रीस्टार्ट या हैंग होने लगता है।'}
];
const es=$('rs-es');es.innerHTML=EXP.map((x,i)=>'<option value="'+i+'">प्रयोग '+(i+1)+': '+x.q.slice(0,46)+'…</option>').join('');
let curE=0,exTimer=null;
function renderExp(){
  const x=EXP[curE];$('rs-eq').innerHTML='<b>'+x.q+'</b>';
  $('rs-eo').innerHTML=x.o.map((o,i)=>'<label><input type="radio" name="lve" value="'+i+'"> '+o+'</label>').join('');$('rs-er').innerHTML='<p class="small">पहले अपना अनुमान चुनें, फिर "करके देखो" दबाएँ। सर्किट पहले सही हालत में आ जाएगा।</p>';
}
es.addEventListener('change',()=>{curE=+es.value;renderExp()});
$('rs-ego').addEventListener('click',()=>{
  const ch=document.querySelector('input[name="lve"]:checked');if(!ch){$('rs-er').innerHTML='<p class="lv-warn">पहले एक अनुमान चुनें।</p>';return}
  const x=EXP[curE];reset0();x.f();$('rs-er').innerHTML='<p class="small">⏳ प्रयोग चल रहा है… सर्किट देखें।</p>';clearTimeout(exTimer);
  exTimer=setTimeout(()=>{const R=X.analyze(),ok=+ch.value===x.c;$('rs-er').innerHTML='<div class="lv-res '+(ok?'ok':'no')+'"><b>'+(ok?'✔ सही अनुमान!':'✖ अनुमान ग़लत')+'</b><p>सही जवाब: <b>'+x.o[x.c]+'</b></p><p>'+x.e+'</p><p class="small">बोर्ड ने अभी दिखाया: '+R.m.map(m=>m[0]).join(' · ')+'</p></div>'},2200);
});
$('rs-eback').addEventListener('click',()=>{reset0();$('rs-er').innerHTML='<p class="small">बोर्ड फिर सही हालत में है।</p>';drawModes();drawInfo();drawHL()});
renderExp();
/* ---------- स्पीड और पॉज़ ---------- */
lv.speed=1;lv.paused=false;
$('rs-speed').addEventListener('change',e=>{lv.speed=+e.target.value;$('rs-board').style.setProperty('--lvs',lv.speed)});
$('rs-pause').addEventListener('click',()=>{lv.paused=!lv.paused;root.classList.toggle('paused',lv.paused);$('rs-pause').setAttribute('aria-pressed',lv.paused);$('rs-pause').textContent=lv.paused?'▶ चलाओ':'⏸ रोको'});
renderTour();

/* शुरुआत */
setMeterMode('dcv');syncCtl();pickPart('c1',false);setView('p');syncProbeSel();drawLeads();
X.log('रियल SMPS लाइव सर्किट: किसी पार्ट पर क्लिक करें, या सूची से चुनकर उसे खराब करें।');
requestAnimationFrame(frame);
})();

