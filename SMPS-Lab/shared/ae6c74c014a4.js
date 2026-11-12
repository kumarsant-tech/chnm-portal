
/* =====================================================================
   लाइव सर्किट प्लस · Future Instructor Group · Sant Varman 420
   
   (क) सूची में चुना पार्ट सर्किट में चमकता है + कॉलआउट + पूरी जानकारी
   (ख) सर्किट के किसी भी पार्ट पर क्लिक = नया मल्टीमीटर लाइव रीडिंग देता है
   यह मॉड्यूल पुराने लाइव कोड को छुए बिना DOM से पढ़ता है।
   ===================================================================== */
(function(){
'use strict';
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const lc=$('lc');if(!lc||!$('live-part'))return;
const num=id=>{const e=$(id);if(!e)return 0;const m=(e.textContent||'').match(/-?\d+(?:\.\d+)?/);return m?parseFloat(m[0]):0};
const txt=id=>($(id)||{}).textContent||'';
const mk=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
const W=800,H=320;
/* ---------- सर्किट पर जगह (SVG निर्देशांक) ---------- */
const G={
fuse:{x:92,y:88,w:44,h:24,n:'फ़्यूज़ F1'},mov:{x:161,y:150,w:44,h:44,n:'MOV वैरिस्टर'},ntc:{x:139,y:88,w:40,h:24,n:'NTC थर्मिस्टर'},
bridge:{x:203,y:123,w:74,h:74,n:'ब्रिज रेक्टिफ़ायर'},bulk:{x:362,y:116,w:36,h:108,n:'बल्क कैपेसिटर'},startup:{x:408,y:94,w:28,h:34,n:'स्टार्टअप रेसिस्टर'},
pwm:{x:392,y:121,w:58,h:58,n:'PWM कंट्रोल IC'},q1:{x:452,y:171,w:36,h:48,n:'MOSFET Q1'},gate:{x:438,y:144,w:24,h:56,n:'गेट रेसिस्टर'},
sense:{x:454,y:218,w:34,h:28,n:'करंट-सेंस रेसिस्टर'},tr:{x:466,y:102,w:84,h:78,n:'ट्रांसफ़ॉर्मर'},sch:{x:554,y:84,w:36,h:32,n:'शॉटकी डायोड'},
sch2:{x:554,y:78,w:110,h:44,n:'शॉटकी + कॉइल पथ'},oc:{x:664,y:116,w:32,h:108,n:'आउटपुट कैपेसिटर'},opto:{x:491,y:36,w:43,h:38,n:'ऑप्टोकपलर PC817'},
tl:{x:596,y:39,w:48,h:32,n:'TL431'},fbr:{x:536,y:44,w:60,h:22,n:'फ़ीडबैक डिवाइडर'},sec:{x:552,y:80,w:216,h:148,n:'सेकेंडरी रेल'},
g12:{x:708,y:106,w:22,h:120,n:'12V रेल'},g5:{x:730,y:106,w:22,h:120,n:'5V रेल'},g33:{x:752,y:106,w:22,h:120,n:'3.3V रेल'}};
/* सूची की PARTS id -> सर्किट की जगह */
const MAP={fuse:'fuse',mov:'mov',ntc:'ntc',bridge:'bridge',bulk:'bulk',startup:'startup',pwm:'pwm',mosfet:'q1','mosfet-open':'q1',gate:'gate',sense:'sense',transformer:'tr',schottky:'sch','schottky-open':'sch2','output-cap':'oc',opto:'opto',tl431:'tl','feedback-r':'fbr','secondary-short':'sec'};
/* ---------- हर पार्ट की पूरी जानकारी ---------- */
const I={
fuse:['AC लाइन में लगा पतला तार, पूरे बोर्ड की सबसे पहली सुरक्षा।','आगे कहीं शॉर्ट हो तो खुद जलकर बिजली काट देता है, ताकि बोर्ड और आग से बचाव हो।','उड़ा फ़्यूज़ यानी AC आगे नहीं जाता: बल्क शून्य, 5VSB नहीं, पंखा नहीं। फ़्यूज़ उड़ना नतीजा है, वजह नहीं।','फ़्यूज़ पर चिंगारी, बल्क कैप का खाली होना, सारी रेल 0 V।'],
mov:['लाइन और न्यूट्रल के बीच लगा नीला/नारंगी डिस्क (वैरिस्टर)।','बिजली की स्पाइक और ओवरवोल्टेज को लगभग 275 V पर सोख लेता है।','शॉर्ट या जला MOV लाइन पर शॉर्ट बनाता है और फ़्यूज़ उड़ा देता है।','MOV का नारंगी चमकना, चिंगारी, फ़्यूज़ का ओपन होना।'],
ntc:['काला या नारंगी थर्मिस्टर, फ़्यूज़ के बाद लाइन में।','चालू होते समय बल्क कैप भरने का उछाल (इनरश करंट) रोकता है। गर्म होकर प्रतिरोध घटाता है।','ओपन NTC: ब्रिज तक AC पहुँचता ही नहीं, SMPS बिल्कुल डेड।','NTC का लाल चमकना, बल्क 0 V, कोई रेल नहीं।'],
bridge:['चार डायोड का ब्लॉक (GBU/KBL)।','AC को एक ही दिशा वाली DC में बदलता है।','एक डायोड ओपन: आधा-चक्र चार्जिंग, रिपल दोगुना, भारी लोड पर बंद। शॉर्ट: फ़्यूज़ उड़ता है।','बल्क वोल्टेज का झूलना और स्कोप पर बढ़ा रिपल।'],
bulk:['बड़ा 330 µF / 400 V इलेक्ट्रोलाइटिक कैपेसिटर।','300 V DC जमा रखता है और AC के दो शिखरों के बीच भी सप्लाई देता है।','सूखा कैप: क्षमता घटती है, रिपल बहुत बढ़ता है, लोड पर बंद या 100 Hz की हम। शॉर्ट: फ़्यूज़ उड़ता है।','बल्क की भराई का स्तर, रिपल की चौड़ाई, 12V का हिलना।'],
startup:['बल्क + से PWM IC के VCC तक जाने वाला बड़े मान का रेसिस्टर।','पहली बार IC को चलने लायक थोड़ा करंट देता है। उसके बाद ऑक्स वाइंडिंग संभाल लेती है।','ओपन: IC को VCC नहीं मिलता, कुछ भी शुरू नहीं होता, 5VSB भी नहीं।','बल्क 300 V है पर VCC 0 V, कोई रेल नहीं।'],
pwm:['कंट्रोल IC (जैसे TL494 / UC384x)।','MOSFET को चलाने वाली पल्स (ड्यूटी) बनाता है और फ़ीडबैक के हिसाब से आउटपुट स्थिर रखता है।','ड्राइव नहीं: स्विचिंग बंद, सारी रेल 0 जबकि बल्क 300 V बना रहता है।','PWM की LED बुझी, MOSFET ठंडा, रेल 0।'],
mosfet:['हाई-वोल्टेज पावर MOSFET (ड्रेन–सोर्स)।','हर सेकंड हज़ारों बार चालू-बंद होकर ट्रांसफ़ॉर्मर में ऊर्जा भेजता है।','D–S शॉर्ट: बल्क सीधे ग्राउंड, भारी करंट, फ़्यूज़ तुरंत उड़ता है।','Q1 का नारंगी चमकना, चिंगारी, फ़्यूज़ ओपन।'],
'mosfet-open':['हाई-वोल्टेज पावर MOSFET (ड्रेन–सोर्स)।','हर सेकंड हज़ारों बार चालू-बंद होकर ट्रांसफ़ॉर्मर में ऊर्जा भेजता है।','ओपन MOSFET: स्विचिंग नहीं होती, ट्रांसफ़ॉर्मर तक ऊर्जा नहीं पहुँचती, मुख्य रेल 0।','बल्क ठीक पर मुख्य रेल 0, PWM चालू।'],
gate:['MOSFET के गेट के आगे लगा छोटा रेसिस्टर।','स्विचिंग की गति और रिंगिंग संभालता है और गेट को सुरक्षित रखता है।','ओपन: गेट तक ड्राइव नहीं पहुँचती, MOSFET कभी ऑन नहीं होता।','PWM चालू है पर Q1 में पल्स नहीं।'],
sense:['MOSFET के सोर्स पर बहुत छोटा (0.1–0.5 Ω) रेसिस्टर।','करंट नापकर ओवरलोड या शॉर्ट पर PWM को बंद करवाता है (OCP)।','ओपन: कंट्रोलर को ग़लत संकेत, no-start या बंद। शॉर्ट/ड्रिफ़्ट: सुरक्षा बेअसर।','Q1 का पथ खुला, आउटपुट 0।'],
tr:['फ़ेराइट कोर पर प्राइमरी और सेकेंडरी वाइंडिंग।','ऊर्जा को आइसोलेशन के पार भेजकर 300 V को 12 V जैसे स्तर तक उतारता है।','प्राइमरी ओपन: ऊर्जा नहीं पहुँचती, आउटपुट 0। शॉर्टेड टर्न: वोल्टेज कम और गर्मी।','कोर का हल्का नीला चमकना (काम करता हुआ), सेकेंडरी पल्स।'],
sch:['सेकेंडरी का तेज़ शॉटकी डायोड।','ट्रांसफ़ॉर्मर की पल्स को DC में बदलता है। कम ड्रॉप (≈0.4 V) के कारण कम गर्मी।','शॉर्ट: आउटपुट शॉर्ट, हिकअप। ओपन: 12 V बनता ही नहीं।','12V गेज का गिरना, हिकअप का संदेश।'],
sch2:['सेकेंडरी का शॉटकी डायोड और आउटपुट कॉइल का पूरा पथ।','पल्स को DC बनाकर कॉइल से छानते हुए कैप तक पहुँचाता है।','इस पथ में कहीं ओपन: मुख्य स्विचिंग चलती रहती है पर रेल नहीं बनती।','सेकेंडरी में पल्स, पर रेल गेज ऊपर नहीं चढ़ते।'],
oc:['सेकेंडरी का लो-ESR इलेक्ट्रोलाइटिक कैपेसिटर।','आउटपुट की तेज़ पल्स छानकर साफ़ DC देता है।','सूखा (ESR ज़्यादा): रिपल बढ़ता है, PG अस्थिर, PC रीस्टार्ट या हैंग।','12V का रिपल (mV) लाल होना।'],
opto:['PC817 ऑप्टोकपलर (LED + फ़ोटो-ट्रांज़िस्टर)।','आउटपुट के हाल की खबर आइसोलेशन पार कराकर PWM तक भेजता है।','फ़ीडबैक टूटा: PWM को लगता है आउटपुट कम है, वोल्टेज चढ़ती है और OVP लैच हो जाता है।','12V का लगभग 14 V तक चढ़ना, फिर बंद।'],
tl:['प्रोग्रामेबल 2.5 V रेफ़रेंस (शंट रेगुलेटर)।','आउटपुट को 2.5 V रेफ़रेंस से तौलकर ऑप्टो की LED का करंट तय करता है।','ओपन/शॉर्ट: रेगुलेशन बिगड़ता है, वोल्टेज ज़्यादा (OVP) या बहुत कम।','12V रेल का ऊपर चढ़ना या गिरना।'],
fbr:['TL431 का वोल्टेज-डिवाइडर रेसिस्टर।','12 V को 2.5 V तक उतारकर TL431 को देता है। इसी से आउटपुट वोल्टेज तय होता है।','ड्रिफ़्ट या ओपन: 12 V ग़लत हो जाता है, OVP या बहुत कम वोल्टेज।','12V का ग़लत स्तर, OVP का संदेश।'],
sec:['सेकेंडरी की कोई भी रेल और GND के बीच का शॉर्ट।','—','ओवरकरंट: सुरक्षा (SCP) बार-बार चालू होकर टिक-टिक/हिकअप करती है।','रेल बार-बार चढ़कर गिरती है, PG टूटता है।']};
const KEYS=['क्या है','क्या काम करता है','खराब होने पर','सर्किट में क्या देखें'];
/* ---------- ग्लो परत और क्लिक-क्षेत्र ---------- */
const circ=lc.parentElement;
const stage=document.createElement('div');stage.className='lc-stage';circ.insertBefore(stage,lc);stage.appendChild(lc);
const hl=mk('g',{id:'hlg','pointer-events':'none'},lc);
const bubF=document.createElement('div');bubF.className='lc-bubble';bubF.hidden=true;stage.appendChild(bubF);
function bubblePos(b,g,side){
  const cx=(g.x+g.w/2)/W*100,top=side==='down'?(g.y+g.h+14)/H*100:(g.y-14)/H*100;
  b.style.left='clamp(16%,'+cx+'%,84%)';b.style.top=top+'%';b.style.transform=side==='down'?'translate(-50%,0)':'translate(-50%,-100%)';
  b.classList.toggle('down',side==='down');b.classList.toggle('up',side!=='down');
}
function sideFor(g){return (g.y+g.h/2)<150?'down':'up'}
/* चुने पार्ट का ग्लो */
function curr(){const id=$('live-part').value,bad=$('live-bad').getAttribute('aria-pressed')==='true';return {id,bad,key:id+'|'+bad}}
let lastKey='';
function drawHL(c){
  while(hl.firstChild)hl.removeChild(hl.firstChild);
  const k=MAP[c.id],g=G[k];if(!g){bubF.hidden=true;return}
  const col=c.bad?'#ff5a3a':'#34e0a1',p=6;
  mk('rect',{class:'hl-glow',x:g.x-p,y:g.y-p,width:g.w+2*p,height:g.h+2*p,rx:12,fill:col},hl);
  mk('rect',{class:'hl-ring',x:g.x-4,y:g.y-4,width:g.w+8,height:g.h+8,rx:10,stroke:col},hl);
  [[g.x-4,g.y-4,1,1],[g.x+g.w+4,g.y-4,-1,1],[g.x-4,g.y+g.h+4,1,-1],[g.x+g.w+4,g.y+g.h+4,-1,-1]].forEach(a=>mk('path',{class:'hl-corner',stroke:col,d:'M'+a[0]+' '+(a[1]+9*a[3])+'V'+a[1]+'H'+(a[0]+9*a[2])},hl));
  bubF.className='lc-bubble '+(c.bad?'':'good');bubF.hidden=false;bubblePos(bubF,g,sideFor(g));
}
function bubbleText(c){
  const nm=($('live-part-title').textContent||'').split(' · ')[0]||'';
  const e=txt('live-effect-reading');
  bubF.innerHTML=(c.bad?'<b>⚠ खराब: ':'<b>✓ सही: ')+nm+'</b>';bubF.title=c.bad?('असर: '+e):'तुलना मोड';
}
/* ---------- जानकारी-कार्ड ---------- */
const ex=document.querySelector('#live .live-explain');
const info=document.createElement('div');info.className='lp-info';if(ex)ex.appendChild(info);
function drawInfo(c){
  const k=MAP[c.id],d=I[k]||['','','',''];
  info.innerHTML='<div class="lp-hd"><span class="lp-badge '+(c.bad?'':'good')+'">'+(c.bad?'⚠ खराबी सिमुलेशन · सर्किट में चमक रहा है':'✓ सही पार्ट · तुलना मोड')+'</span></div>'
   +'<div class="lp-grid"><div class="lp-card"><small>'+KEYS[0]+'</small><p>'+d[0]+'</p></div><div class="lp-card w"><small>'+KEYS[1]+'</small><p>'+d[1]+'</p></div><div class="lp-card f"><small>'+KEYS[2]+'</small><p>'+d[2]+'</p></div><div class="lp-card r"><small>'+KEYS[3]+'</small><p>'+d[3]+'</p></div></div>'
   +'<div class="lp-live" id="lp-live"></div>';
}
function updLive(){
  const e=$('lp-live');if(!e)return;const M=model();
  const c=(l,v,b)=>'<span'+(b?' class="bad"':'')+'><em>'+l+'</em>'+v+'</span>';
  e.innerHTML=c('बल्क',M.bulk.toFixed(0)+' V',M.plug&&M.bulk<200)+c('12V',M.v12.toFixed(1)+' V',M.run&&Math.abs(M.v12-12)>.8)+c('5VSB',M.sb?'5.0 V':'0 V',!M.sb)+c('PG',M.pg?'हाँ':'नहीं',!M.pg)+c('फ़्यूज़',M.fuse?'उड़ा':'ठीक',M.fuse)+c('MOV',M.mov?'जला':'ठीक',M.mov)+c('रिपल',M.rip.toFixed(0)+' mV',M.rip>120);
}
/* ---------- लाइव मॉडल (DOM से) ---------- */
function model(){
  const M={plug:$('t-plug').getAttribute('aria-pressed')==='true',ps:$('t-ps').getAttribute('aria-pressed')==='true'};
  M.vac=M.plug?num('m-ac'):0;M.bulk=num('m-vc');M.v12=num('m-12');M.v5=num('m-5');M.v33=num('m-33');M.rip=num('m-rip');M.iin=num('m-iin');
  M.sb=num('m-sb')>4;M.pg=txt('m-pg').indexOf('हाँ')>=0;M.fuse=txt('m-fuse').indexOf('उड़ा')>=0;M.mov=txt('m-mov').indexOf('जला')>=0;
  M.hz=num('m-hz')||50;M.W=+$('lv-w').value;M.fault=$('lf').value;M.vcc=num('node-VCC');
  M.run=M.v12>10&&M.sb;M.D=M.fault==='fb'?.9:Math.max(.1,Math.min(.9,12/(Math.max(M.bulk,1)*.125)));
  const C=M.fault==='bulk'?47e-6:330e-6,I=M.W/(.85*Math.max(M.bulk,60));
  M.bulkPP=(M.bulk>20&&M.plug)?I/((M.fault==='bridge'?M.hz:2*M.hz)*C):0;
  return M;
}
/* पुराना छोटा मीटर हटाएँ (नया इसकी जगह) */
const old=document.querySelector('#live .dmm.mini');if(old)old.remove();
function tick(){
  const c=curr();
  if(c.key!==lastKey){lastKey=c.key;drawHL(c);drawInfo(c)}
  bubbleText(c);updLive();
}
tick();setInterval(tick,250);
['live-part','lf','live-search'].forEach(i=>{const e=$(i);if(e)e.addEventListener('change',()=>setTimeout(tick,30))});
['live-good','live-bad'].forEach(i=>{const e=$(i);if(e)e.addEventListener('click',()=>setTimeout(tick,30))});
})();

