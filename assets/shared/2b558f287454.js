
(function(){
"use strict";
var $=function(id){return document.getElementById(id)};
if(!$('spark'))return;  /* guard: लाइव सिम सिर्फ़ live में */
var DT=25e-6, N=400, NS=4; /* हर चौथे स्टेप का नमूना: 100µs */
var S={tv:0,vc:300,vcF:300,vs:0,iin:0,iinMax:0,iinPk:0,vo:12,state:2,t:5,pg:true,sb:true,
 fuse:false,movBurned:false,ov:0,spark:0,latched:false,prot:'',heatN:0,heatQ:0,uv:0,hic:0,
 plug:true,ps:true,pause:false,fault:'ok',vac:230,W:150,hz:50,speed:0.5,rip:0,bulkRip:0,D:0.3,sw:0,pdir:1,iinEnv:0,iinPulse:0};
var B1=new Float32Array(N),B2=new Float32Array(N),B3=new Float32Array(N),B5=new Float32Array(N),bi=0,stepN=0;
var CH={1:true,2:true,3:true,4:false,5:false};
var scopeNode=null,scopeFrozen=false,heldScope=null,scopeZoom=1;

function vnomOK(){return S.fault!=='fb'}
function loadI(){
 var P=0;
 if(S.state===1)P=S.W*Math.min(1,S.vo/12);
 else if(S.state===2)P=S.W*(S.fault==='short'?4:1);
 else if(S.sb)P=3;
 return P/(0.85*Math.max(S.vc,60));
}
function step(){
 var ph=2*Math.PI*S.hz*S.tv;
 var vs=S.vac*Math.SQRT2*Math.sin(ph);
 var live=S.plug&&!S.fuse&&!S.movBurned&&S.fault!=='ntc'&&S.fault!=='fuse'&&S.fault!=='mov';
 var vr=0;
 if(live){var a=Math.abs(vs)-1.4;if(S.fault==='bridge'&&vs<0)a=0;vr=Math.max(0,a)}
 var C=(S.fault==='bulk')?47e-6:330e-6;
 var i=0;if(vr>S.vc)i=(vr-S.vc)/3;
 S.vc+=(i-loadI())*DT/C;if(S.vc<0)S.vc=0;
 S.vcF+=(S.vc-S.vcF)*0.003;
 S.vs=live?vs:0;S.iin=i;if(i>S.iinMax)S.iinMax=i;if(i>0.05)S.pdir=vs>0?1:-1;
 S.tv+=DT;
 /* बल्क या AC इनपुट बहुत गिरे तो UVP: 2ms से ज़्यादा रहने पर ट्रिप */
 if(S.state===2){if(S.vac<160||S.vc<160)S.uv++;else if(S.uv>0)S.uv--;if(S.uv>80){S.uv=0;S.state=4;S.hic=0;S.pg=false;S.prot=S.vac<160?'UVP: AC इनपुट 160V से नीचे गिरा, PG गिरा, SMPS ट्रिप होकर फिर शुरू होगा':'UVP: बल्क वोल्टेज बहुत गिरा, PG गिरा, SMPS बंद होकर फिर शुरू होगा'}}
 stepN++;
 if(stepN%NS===0){
  var sw=(S.state===2)?S.sw:0;
  B1[bi]=S.vs;B2[bi]=S.vc;B3[bi]=i;
  B5[bi]=(S.state===2)?(S.vc-S.vcF)*0.0006+(sw/2)*Math.sin(2*Math.PI*1200*S.tv):0;
  bi=(bi+1)%N;
 }
}
function fsm(rd){
 if(S.fault==='mov'&&S.plug&&!S.movBurned){S.movBurned=true;S.fuse=true;S.spark=1.4;S.state=0;S.pg=false;S.sb=false;S.prot='MOV शॉर्ट है: फ़्यूज़ उड़ गया'}
 if(S.plug&&!S.fuse&&!S.movBurned&&S.vac>265){
  S.ov+=rd;
  if(S.ov>=0.2){S.movBurned=true;S.fuse=true;S.spark=1.4;S.state=0;S.pg=false;S.sb=false;S.prot='MOV जला: 265V AC से ऊपर वोल्टेज पर फ़्यूज़ उड़ गया'}
 }else if(S.vac<=265)S.ov=0;
 if(!(S.plug&&!S.fuse&&!S.movBurned&&S.fault!=='ntc'&&S.fault!=='fuse'&&S.fault!=='mov')){var bl=Math.exp(-rd*0.3);S.vc*=bl;S.vcF*=bl}
 S.sb=S.plug&&!S.fuse&&!S.movBurned&&S.fault!=='ntc'&&S.fault!=='fuse'&&S.fault!=='mov'&&S.fault!=='startup'&&S.vcF>90;
 var mainOpen=S.fault==='pwm'||S.fault==='mosfet-open'||S.fault==='transformer'||S.fault==='gate-open'||S.fault==='sense-open';
 var ready=S.sb&&S.ps&&S.vcF>170&&!S.latched&&!mainOpen;
 if(S.state===0){
  S.vo*=Math.exp(-rd*6);S.pg=false;
  if(ready){S.state=1;S.t=0;S.prot=''}
 }else if(S.state===1){
  S.t+=rd;S.vo=12*Math.min(1,S.t/1.2);S.pg=false;
  if(!ready){S.state=0}else if(S.t>=1.2){S.state=2;S.t=0}
 }else if(S.state===2){
  S.t+=rd;
  if(S.fault==='fb'){S.vo+=1.6*rd;
   if(S.vo>14.4){S.state=3;S.latched=true;S.pg=false;S.prot='OVP: 12V रेल बहुत बढ़ी, SMPS बंद (लैच)'}}
  else if(S.fault==='output-open'){S.vo*=Math.exp(-rd*5);S.pg=false}
  else{S.vo+=(12-S.vo)*Math.min(1,rd*8)}
  if(S.fault==='short'&&S.t>0.5){S.state=4;S.hic=0;S.pg=false;S.prot='SCP: रेल में शॉर्ट, SMPS टिक-टिक करके बार-बार बंद-चालू (हिक-अप)'}
  if(S.state===2&&S.t>0.8&&S.fault!=='output-open')S.pg=true;
  if(!ready&&S.state===2){S.state=0;S.pg=false;if(!S.ps)S.prot=''}
 }else if(S.state===3){
  S.vo*=Math.exp(-rd*4);S.pg=false;
 }else if(S.state===4){
  S.hic+=rd;S.vo*=Math.exp(-rd*5);S.pg=false;
  if(S.hic>1.3){S.state=0;S.prot=''}
 }
 if(S.fault==='mosfet'&&S.plug&&!S.fuse&&S.vcF>10){blow()}
 if(S.fuse&&S.state!==0&&S.state!==3){S.state=0}
 S.D=Math.max(0.1,Math.min(0.9,12/(Math.max(S.vcF,1)*0.125)));
 if(S.fault==='fb')S.D=0.9;
 var ocap=S.fault==='ocap';
 S.sw=(ocap?0.30:0.03)*(0.5+S.W/300);
 var br=0,mn=1e9,mx=-1e9;
 for(var k=0;k<N;k+=2){var v=B2[k];if(v<mn)mn=v;if(v>mx)mx=v}
 S.bulkRip=Math.max(0,mx-mn);
 S.rip=(S.state===2)?(S.sw+S.bulkRip*0.0006)*1000:0;
 S.iinPk+=(S.iinMax-S.iinPk)*Math.min(1,rd*6);S.iinMax=0;
 var tN=Math.min(1,S.iinPk/3);S.heatN+=(tN-S.heatN)*rd*0.5;
 var tQ=(S.state===2)?Math.min(1,S.W/400+0.15):0;S.heatQ+=(tQ-S.heatQ)*rd*0.4;
 if(S.spark>0)S.spark-=rd;
}
function blow(){S.fuse=true;S.spark=1.4;S.prot='फ़्यूज़ उड़ गया: MOSFET शॉर्ट है'}
function resetAll(){
 S.fuse=false;S.movBurned=false;S.ov=0;S.latched=false;S.prot='';S.uv=0;S.state=0;S.t=0;
 if(S.fault==='mosfet'&&S.plug){blow()}
 if(S.fault==='mov'&&S.plug){S.movBurned=true;S.fuse=true;S.state=0;S.sb=false}
 if(S.fault==='fuse'){S.fuse=true;S.state=0;S.sb=false}
}

var PARTS=[
 {id:'fuse',name:'फ़्यूज़',ref:'F1 · AC इनपुट',fault:'fuse',good:'0–1 Ω / बीप',bad:'OL / खुला',test:'प्लग निकालकर और बल्क कैपेसिटर सुरक्षित रूप से डिस्चार्ज करके फ़्यूज़ के दोनों सिरों पर कंटिन्यूटी/Ω नापें।',symptom:'फ़्यूज़ ओपन होने पर AC रास्ता कटता है; बल्क DC और आउटपुट नहीं आते। फ़्यूज़ बदलने से पहले शॉर्ट का कारण खोजें।',limit:'मॉडल: ओपन फ़्यूज़। फ़्यूज़ की रेटिंग कभी न बढ़ाएँ और फ़्यूज़ को तार से बायपास न करें।',effect:'AC पथ खुला'},
 {id:'mov',name:'MOV / वैरिस्टर',ref:'MOV1 · सर्ज सुरक्षा',fault:'mov',good:'उच्च प्रतिरोध / OL',bad:'कम Ω / बीप (शॉर्ट)',test:'प्लग निकालकर एक लीड अलग करें; Ω मोड में सामान्य MOV उच्च प्रतिरोध दिखाता है। फटा/काला MOV बदलें।',symptom:'शॉर्ट हुआ MOV इनपुट फ़्यूज़ उड़ा सकता है।',limit:'मॉडल: MOV शॉर्ट। खराब MOV का सही निष्कर्ष केवल बोर्ड में लगे हुए Ω माप से न निकालें।',effect:'फ़्यूज़ उड़ता है'},
 {id:'ntc',name:'NTC थर्मिस्टर',ref:'NTC1 · इनरश करंट',fault:'ntc',good:'ठंडा: कुछ Ω (उदा. 3–10 Ω)',bad:'OL / खुला',test:'बिजली हटाकर NTC ठंडा होने दें; Ω मोड में ठंडा प्रतिरोध नापें।',symptom:'ओपन NTC से बल्क कैपेसिटर चार्ज नहीं होता और SMPS डेड रहता है।',limit:'मान पार्ट की रेटिंग और तापमान पर निर्भर है; यह उदाहरण मात्र है।',effect:'बल्क चार्ज नहीं'},
 {id:'bridge',name:'ब्रिज रेक्टिफ़ायर',ref:'BD1 · प्राथमिक',fault:'bridge',good:'डायोड: 0.4–0.8 V / उलटी दिशा OL',bad:'एक डायोड दोनों ओर 0 V या OL',test:'प्लग निकालें, बल्क कैपेसिटर डिस्चार्ज करें। डायोड मोड में चार जंक्शन जाँचें; इन-सर्किट रीडिंग भ्रामक हो सकती है।',symptom:'ओपन डायोड में आधे-चक्र की चार्जिंग और बढ़ा हुआ बल्क रिपल; शॉर्ट डायोड फ़्यूज़ उड़ा सकता है।',limit:'मॉडल एक डायोड ओपन दिखाता है; असल ब्रिज के चारों जंक्शन अलग से जाँचें।',effect:'बल्क रिपल बढ़ता है'},
 {id:'bulk',name:'बल्क इलेक्ट्रोलाइटिक कैपेसिटर',ref:'Cbulk · 400 V',fault:'bulk',good:'330 µF ± निर्माता की tolerance; ESR spec में',bad:'मॉडल: 47 µF / ESR ऊँचा',test:'उच्च-वोल्टेज कैपेसिटर को सुरक्षित discharge और verify करने के बाद capacitance/ESR मीटर से जाँचें।',symptom:'क्षमता घटने पर बल्क रिपल बढ़ता है; भारी लोड पर आउटपुट गिर सकता है या रीस्टार्ट हो सकता है।',limit:'मॉडल में दोष के लिए 47 µF माना है; असल nominal मान आपके PSU पर निर्भर है।',effect:'बल्क वोल्टेज / रिपल'},
 {id:'startup',name:'स्टार्टअप रेसिस्टर',ref:'Rstart · PWM VCC',fault:'startup',good:'सर्किट के अनुसार finite kΩ',bad:'OL / खुला',test:'प्लग निकालकर कैपेसिटर discharge करें; एक सिरा उठाकर Ω मोड में छपे/सर्किट मान से तुलना करें।',symptom:'रेसिस्टर ओपन हो तो PWM को स्टार्टअप VCC नहीं मिलता; 5VSB भी नहीं आ सकती।',limit:'प्रतिरोध डिज़ाइन के अनुसार बदलता है; universal मान नहीं है।',effect:'5VSB / VCC बंद'},
 {id:'pwm',name:'PWM कंट्रोल IC',ref:'U1 · स्विचिंग कंट्रोल',fault:'pwm',good:'VCC और गेट पल्स datasheet के अनुसार',bad:'VCC हो सकती है, पर स्विचिंग पल्स नहीं',test:'बिजली चालू अवस्था में VCC और गेट waveform केवल उपयुक्त isolated/differential उपकरण और सुरक्षित प्रक्रिया से जाँचें।',symptom:'PWM/ड्राइव न हो तो स्टैंडबाय रह सकती है, पर मुख्य आउटपुट नहीं चलता।',limit:'DMM अकेले PWM IC को pass/fail नहीं करता; इस मॉडल में मुख्य switching रुकती है।',effect:'मुख्य आउटपुट बंद'},
 {id:'mosfet',name:'प्राइमरी MOSFET (D–S short)',ref:'Q1 · स्विच',fault:'mosfet',good:'डायोड मोड: body diode एक दिशा; दूसरी OL',bad:'D–S दोनों दिशाओं में लगभग 0 V / बीप',test:'बिजली हटाकर और bulk सुरक्षित discharge सत्यापित करके जाँचें; इन-सर्किट अन्य पार्ट रीडिंग बदल सकते हैं।',symptom:'D–S शॉर्ट से इनपुट करंट बढ़ता है और फ़्यूज़/बल्ब टेस्टर प्रतिक्रिया देता है।',limit:'मॉडल: MOSFET short पर फ़्यूज़ उड़ता है। प्राइमरी में जानलेवा DC रहता है।',effect:'फ़्यूज़ उड़ता है'},
 {id:'mosfet-open',name:'प्राइमरी MOSFET (open)',ref:'Q1 · स्विच',fault:'mosfet-open',good:'body diode एक दिशा में conduction',bad:'मुख्य switching नहीं; DMM में कभी सामान्य जैसा',test:'power-off diode test केवल gross short/open पकड़ता है; gate drive और waveform के बिना MOSFET सिद्ध नहीं होता।',symptom:'ओपन MOSFET से मुख्य कन्वर्टर नहीं चलता; अलग स्टैंडबाय मौजूद रह सकती है।',limit:'मॉडल में MOSFET open = switching अनुपस्थित; वास्तविक waveform टेस्ट खतरनाक है।',effect:'मुख्य आउटपुट बंद'},
 {id:'gate',name:'गेट रेसिस्टर / ड्राइव',ref:'Rg · MOSFET gate',fault:'gate-open',good:'छपे मान के करीब, प्रायः कुछ Ω',bad:'OL / मान से बहुत अलग',test:'प्लग निकालकर resistance जाँचें; ड्राइव पल्स देखना हो तो सुरक्षित scope setup अनिवार्य है।',symptom:'गेट ड्राइव कटे तो MOSFET switch नहीं करता; PWM/स्टैंडबाय अलग रह सकती है।',limit:'मॉडल में gate path open मुख्य switching रोकता है।',effect:'मुख्य आउटपुट बंद'},
 {id:'sense',name:'करंट-सेंस रेसिस्टर',ref:'Rsense · प्राथमिक',fault:'sense-open',good:'बहुत कम Ω, पार्ट marking/datasheet अनुसार',bad:'OL / बदला हुआ मान',test:'एक सिरा उठाकर low-ohm मापन करें; सामान्य DMM की lead resistance पहले घटाएँ।',symptom:'सेंस पथ खुलने पर कई डिज़ाइन में switching रुकती या सुरक्षा सक्रिय होती है।',limit:'व्यवहार कंट्रोलर topology पर निर्भर है; मॉडल इसे no-start के रूप में सरल करता है।',effect:'मुख्य आउटपुट बंद'},
 {id:'transformer',name:'मुख्य ट्रांसफ़ॉर्मर',ref:'T1 · आइसोलेशन',fault:'transformer',good:'हर winding में low finite Ω; primary-secondary में OL',bad:'टूटी winding: OL',test:'बिजली हटाकर अलग-अलग windings की continuity जाँचें। winding-to-winding isolation भी जाँचें।',symptom:'प्राइमरी ओपन होने पर ऊर्जा सेकेंडरी तक नहीं पहुँचती; आउटपुट बंद रहता है।',limit:'DMM से shorted turns अक्सर नहीं पकड़े जाते; ring tester/LCR और isolation जाँच अलग है।',effect:'मुख्य आउटपुट बंद'},
 {id:'schottky',name:'सेकेंडरी शॉटकी डायोड',ref:'Dsec · आउटपुट rectifier',fault:'short',good:'डायोड मोड: लगभग 0.15–0.5 V / reverse OL',bad:'दोनों दिशा low reading / short',test:'बिजली हटाकर आउटपुट डिस्चार्ज करें; diode mode में जाँचें, ज़रूरत पर एक सिरा उठाएँ।',symptom:'शॉर्ट सेकेंडरी से ओवरकरंट/हिक-अप; ओपन होने पर संबंधित rail गायब या कम हो सकती है।',limit:'मॉडल शॉर्ट और हिक-अप दिखाता है। ओपन डायोड का अलग wave-level मॉडल नहीं है।',effect:'रेल गिरती / हिक-अप'},
 {id:'schottky-open',name:'शॉटकी / आउटपुट पथ (open)',ref:'Dsec / Lout',fault:'output-open',good:'डायोड जंक्शन conduction; इंडक्टर winding finite Ω',bad:'डायोड open या winding OL',test:'बिजली हटाकर diode और continuity मोड; सही पार्ट पहचानने के बाद अलग से जाँचें।',symptom:'ओपन आउटपुट पथ में मुख्य switching होते हुए भी आउटपुट rail नहीं बनती।',limit:'मॉडल आउटपुट पथ खुला दिखाता है; diode बनाम inductor की पहचान अलग टेस्ट से करें।',effect:'आउटपुट rail बंद'},
 {id:'output-cap',name:'आउटपुट लो-ESR कैपेसिटर',ref:'Cout · सेकेंडरी',fault:'ocap',good:'capacitance tolerance में; ESR datasheet सीमा में',bad:'ESR ऊँचा; ripple बढ़ा',test:'बिजली हटाकर rail discharge करें; ESR meter से जाँचें। capacitance सही होने पर भी ESR खराब हो सकता है।',symptom:'आउटपुट ripple बढ़ता है; लोड पर अस्थिरता, रीस्टार्ट या हैंग हो सकते हैं।',limit:'मॉडल CH5 ripple बढ़ाता है; ESR का सटीक मान पार्ट/माप-आवृत्ति पर निर्भर है।',effect:'12V ripple बढ़ता है'},
 {id:'opto',name:'ऑप्टोकपलर (PC817)',ref:'U2 · feedback isolation',fault:'fb',good:'LED: एक दिशा ~1.0–1.3 V; reverse OL',bad:'LED open/short; CTR कम हो सकता है',test:'बिजली हटाकर LED diode test; transistor side का DMM test CTR/feedback function साबित नहीं करता।',symptom:'Feedback खोने पर output बढ़ सकता है और OVP shutdown हो सकता है।',limit:'मॉडल open feedback का OVP प्रभाव दिखाता है; optocoupler fault के सभी प्रकार एक जैसे नहीं होते।',effect:'12V बढ़े / OVP'},
 {id:'tl431',name:'TL431 shunt reference',ref:'U3 · feedback',fault:'fb',good:'नियंत्रित टेस्ट सर्किट में REF लगभग 2.495 V',bad:'reference/regulation गलत या अनुपस्थित',test:'बिजली बंद circuit में DMM से अकेले pass/fail नहीं; reference और feedback divider को नियंत्रित test में जाँचें।',symptom:'TL431/feedback खराब होने पर output regulation बिगड़ सकता है।',limit:'मॉडल feedback failure पर overvoltage दिखाता है; TL431 खराबी का एक संभावित परिणाम।',effect:'12V बढ़े / OVP'},
 {id:'feedback-r',name:'Feedback divider रेसिस्टर',ref:'Rfb · regulation',fault:'fb',good:'छपे मान के करीब',bad:'OL / drift',test:'प्लग निकालकर discharge करें; एक सिरा उठाकर Ω मोड में रंग/marking और tolerance से तुलना करें।',symptom:'Divider खुला/बदला हो तो output गलत regulate हो सकता है।',limit:'मॉडल इसे open feedback मानकर overvoltage दिखाता है; हर resistor fault का परिणाम समान नहीं।',effect:'12V बढ़े / OVP'},
 {id:'secondary-short',name:'सेकेंडरी rail short',ref:'12V / 5V / 3.3V',fault:'short',good:'बिना power rail-to-ground पर स्थिर short नहीं',bad:'कम Ω / हिक-अप',test:'प्लग निकालकर output capacitors discharge करें; rail-to-ground resistance देखें और diode/capacitor को अलग जाँचें।',symptom:'ओवरकरंट से supply hiccup/restart कर सकती है।',limit:'rail resistance अकेले short का प्रमाण नहीं; parallel loads भी low reading दे सकते हैं।',effect:'हिक-अप / rail गिरती है'}
];
var livePart=PARTS[4],liveBad=false;
function liveFault(fault){
 S.fault=fault;
 $('lf').value=fault;
 resetAll();lastSay='';
}
function liveEffect(part){
 var rails='12V '+S.vo.toFixed(1)+' V · 5VSB '+(S.sb?'5.0':'0.0')+' V';
 if(part.fault==='bulk'||part.fault==='bridge')return 'Bulk '+S.vcF.toFixed(0)+' V · '+rails;
 if(part.fault==='ocap')return 'Ripple '+S.rip.toFixed(0)+' mV · '+rails;
 if(part.fault==='fb')return '12V '+S.vo.toFixed(1)+' V · PG '+(S.pg?'हाँ':'नहीं');
 if(part.fault==='short'||part.fault==='output-open')return rails+' · PG '+(S.pg?'हाँ':'नहीं');
 if(part.fault==='mosfet'||part.fault==='mov'||part.fault==='fuse')return (S.fuse?'फ़्यूज़: उड़ा':'फ़्यूज़: ठीक')+' · Bulk '+S.vcF.toFixed(0)+' V';
 if(part.fault==='ntc'||part.fault==='startup')return '5VSB '+(S.sb?'5.0':'0.0')+' V · Bulk '+S.vcF.toFixed(0)+' V';
 if(part.fault==='pwm'||part.fault==='mosfet-open'||part.fault==='transformer'||part.fault==='gate-open'||part.fault==='sense-open')return '5VSB '+(S.sb?'5.0':'0.0')+' V · मुख्य 12V '+S.vo.toFixed(1)+' V';
 return rails;
}
function drawPartTest(){
 var p=livePart;
 $('live-part-title').textContent=p.name+' · '+p.ref;
 $('live-good-reading').textContent=p.good;
 $('live-bad-reading').textContent=p.bad;
 $('live-howto').textContent='जाँच विधि: '+p.test;
 $('live-symptom').textContent='खराब होने पर: '+p.symptom;
 $('live-limitation').textContent=p.limit;
 $('live-good').setAttribute('aria-pressed',liveBad?'false':'true');
 $('live-bad').setAttribute('aria-pressed',liveBad?'true':'false');
 $('live-status').textContent=liveBad?'खराबी सिमुलेशन चालू':'सभी पार्ट सामान्य · तुलना मोड';
 $('live-status').className='live-led'+(liveBad?' bad':'');
 $('live-effect-reading').textContent=liveEffect(p);
}
function choosePart(p){
 livePart=p;
 liveBad=true;
 liveFault(p.fault);
 drawPartTest();
}
function fillParts(query){
 var sel=$('live-part'),q=query.toLocaleLowerCase();
 var list=PARTS.filter(function(p){return (p.name+' '+p.ref+' '+p.id).toLocaleLowerCase().indexOf(q)>=0});
 if(!list.length){
  sel.innerHTML='';
  var empty=document.createElement('option');empty.value='';empty.textContent='कोई कंपोनेंट नहीं मिला';empty.disabled=true;empty.selected=true;sel.appendChild(empty);
  return;
 }
 sel.innerHTML='';
 list.forEach(function(p){var o=document.createElement('option');o.value=p.id;o.textContent=p.name+' · '+p.ref;sel.appendChild(o)});
 var keep=list.some(function(p){return p.id===livePart.id})?livePart.id:list[0].id;
 sel.value=keep;
 if(keep!==livePart.id)choosePart(PARTS.filter(function(p){return p.id===keep})[0]);
}
fillParts('');
$('live-part').value=livePart.id;
drawPartTest();
$('live-search').addEventListener('input',function(){fillParts($('live-search').value.trim())});
$('live-part').addEventListener('change',function(){
 var selected=PARTS.filter(function(p){return p.id===$('live-part').value})[0];
 if(selected)choosePart(selected);
});
$('live-good').addEventListener('click',function(){liveBad=false;liveFault('ok');drawPartTest()});
$('live-bad').addEventListener('click',function(){liveBad=true;liveFault(livePart.fault);drawPartTest()});
$('lf').addEventListener('change',function(){
 liveBad=$('lf').value!=='ok';
 var match=PARTS.filter(function(p){return p.fault===$('lf').value})[0];
 if(match){livePart=match;$('live-part').value=match.id}
 drawPartTest();
});

/* ---------- ड्रॉइंग ---------- */
var dotSets=[];
function mkDots(pid,n,cls){
 var p=$(pid),len=p.getTotalLength(),g=$('dots'),arr=[];
 for(var i=0;i<n;i++){var c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('r','4');c.setAttribute('class','dot'+(cls?' '+cls:''));g.appendChild(c);arr.push({u:i/n,el:c})}
 dotSets.push({p:p,len:len,a:arr});return dotSets[dotSets.length-1];
}
var dH=mkDots('pH',6),dN=mkDots('pN',8),dA=mkDots('pA',4),dA2=mkDots('pA2',4),dB=mkDots('pB',9),dS=mkDots('pS',10,'sec'),dF=mkDots('pF',4,'sec'),dF2=mkDots('pF2',4,'sec');
function move(ds,speed,rd){
 var on=Math.abs(speed)>0.004;
 for(var i=0;i<ds.a.length;i++){var d=ds.a[i];
  d.u+=speed*rd;d.u-=Math.floor(d.u);
  if(!on){d.el.setAttribute('opacity','0');continue}
  var pt=ds.p.getPointAtLength(d.u*ds.len);
  d.el.setAttribute('cx',pt.x.toFixed(1));d.el.setAttribute('cy',pt.y.toFixed(1));d.el.setAttribute('opacity','1');
 }
}
function setFill(id,col,stroke){var e=$(id);e.setAttribute('fill',col);if(stroke)e.setAttribute('stroke',stroke)}
function diodeStates(){
 var G='#3ddc84';
 var on=S.iinEnv>0.25;
 var c1=on&&S.pdir>0,c2=on&&S.pdir<0;
 $('d1').setAttribute('fill',c1?G:'var(--surface)');$('d4').setAttribute('fill',c1?G:'var(--surface)');
 $('d2').setAttribute('fill',S.fault==='bridge'?'#d33':(c2?G:'var(--surface)'));
 $('d3').setAttribute('fill',c2?G:'var(--surface)');
}
function drawUI(rd){
 var relayNow=S.state===2&&S.plug&&S.ps;
 if(S.fuse&&!lastFuseSound&&window.__smpsAudio)window.__smpsAudio.play('fuse');
 if(relayNow&&!lastRelaySound&&window.__smpsAudio)window.__smpsAudio.play('relay');
 lastFuseSound=S.fuse;lastRelaySound=relayNow;
 var live=S.plug&&!S.fuse&&!S.movBurned&&S.fault!=='ntc'&&S.fault!=='fuse'&&S.fault!=='mov';
 var frac=(S.tv*50)%1;
 $('srcdot').setAttribute('cx',(32+frac*36).toFixed(1));
 $('srcdot').setAttribute('cy',(160-8*Math.sin(frac*3*Math.PI)).toFixed(1));
 $('srcdot').setAttribute('opacity',live?1:0.2);
 S.iinEnv+=(S.iinPulse-S.iinEnv)*Math.min(1,rd*5);
 /* फ़्यूज़ */
 var fglow=S.fuse?0:Math.min(1,S.iinPk/10);
 $('fuseglow').setAttribute('opacity',(S.fuse?0:fglow*0.7).toFixed(2));
 $('fusewire').setAttribute('opacity',S.fuse?0:1);$('fuseblown').setAttribute('opacity',S.fuse?1:0);
 $('spark').setAttribute('opacity',S.spark>0?(Math.random()>0.35?1:0.2):0);
 $('ntcglow').setAttribute('opacity',(S.heatN*0.85).toFixed(2));
 $('movglow').setAttribute('opacity',S.movBurned?'0.9':(S.ov>0?Math.min(0.75,S.ov*3).toFixed(2):'0'));
 $('movbody').setAttribute('fill',S.movBurned?'#49231f':'var(--surface)');
 $('movbody').setAttribute('stroke',S.movBurned?'var(--bad)':'var(--fg)');
 $('movmark').setAttribute('stroke',S.movBurned?'var(--bad)':'var(--fg)');
 $('bulkfill').setAttribute('y',(219-Math.min(1,S.vc/400)*99).toFixed(1));
 $('bulkfill').setAttribute('height',(Math.min(1,S.vc/400)*99).toFixed(1));
 $('outfill').setAttribute('y',(219-Math.min(1,S.vo/16)*99).toFixed(1));
 $('outfill').setAttribute('height',(Math.min(1,S.vo/16)*99).toFixed(1));
 var gs=[['g12',S.vo/16],['g5',S.vo*5/12/8],['g33',S.vo*3.3/12/5.3]];
 for(var i=0;i<gs.length;i++){var h=Math.max(0,Math.min(1,gs[i][1]))*99;$(gs[i][0]).setAttribute('y',(219-h).toFixed(1));$(gs[i][0]).setAttribute('height',h.toFixed(1))}
 var sw=S.state===2;
 $('q1glow').setAttribute('opacity',sw?(S.heatQ*0.8*(0.85+0.15*Math.random())).toFixed(2):0);
 $('coreglow').setAttribute('opacity',sw?(0.15+0.55*S.heatQ).toFixed(2):0);
 $('pwmled').setAttribute('fill',sw?('rgba(61,220,132,'+(0.4+0.6*Math.random())+')'):'#444');
 $('optoled').setAttribute('fill',sw?('rgba(255,170,60,'+Math.min(1,0.25+S.vo/14).toFixed(2)+')'):'#444');
 $('sd').setAttribute('fill',sw?'#5fd0ff':'var(--surface)');
 $('ledsb').setAttribute('fill',S.sb?'#b36bff':'#444');
 $('ledpg').setAttribute('fill',S.pg?'#3ddc84':'#444');
 $('l-prot').textContent=S.prot;
 diodeStates();
 /* बिंदु */
 var dir=S.pdir||1;
 var sp=Math.min(0.9,0.14*S.iinEnv);
 move(dH,dir*sp,rd);move(dN,-dir*sp,rd);move(dA,sp,rd);move(dA2,sp,rd);
 var il=loadI();
 var spB=Math.min(0.7,0.4*il);
 move(dB,spB,rd);
 var spS=(S.state>=1&&S.state<=2)?Math.min(0.7,0.1+S.W/400*0.5):0;
 move(dS,spS,rd);
 var spF=(S.state===2)?0.18:0;move(dF,spF,rd);move(dF2,-spF,rd);
}

/* ---------- मीटर और संदेश ---------- */
var FX={
 ok:['सब सामान्य है। बल्क पर लगभग 300V से ऊपर DC है और 12V स्थिर है। ध्यान दें कि ब्रिज के डायोड सिर्फ़ AC के शिखर के पास थोड़ी देर के लिए चमकते हैं और उसी समय पीले बिंदु तेज़ दौड़ते हैं।'],
 bulk:['बल्क कैपेसिटर सूखा है (47µF)। CH2 में बल्क का रिपल बहुत बढ़ा हुआ है और CH3 के करंट पल्स लंबे और तेज़ हैं। कंप्यूटर का लोड 300W से ऊपर करें या AC घटाएँ, तो बल्क वोल्टेज बीच-बीच में 160V से नीचे जाकर UVP लगता है और SMPS बार-बार रीस्टार्ट होता है।','जाँच: बंद करके क्षमता और ESR मीटर से देखें, ऊपर का ढक्कन फूला है या नहीं देखें।'],
 ocap:['आउटपुट कैपेसिटर सूखा है। CH5 में 12V पर रिपल बहुत बढ़ गया है और मीटर में 12V रिपल लाल हो जाएगा। कंप्यूटर रैंडम हैंग या रीस्टार्ट करता है।','जाँच: ESR मीटर से, या सेक्शन 6 में बताए पैरेलल कैपेसिटर टेस्ट से।'],
 bridge:['ब्रिज का D2 डायोड ओपन है। सिर्फ़ AC के एक आधे चक्र में चार्जिंग होती है। CH3 में पल्स आधे हो गए, बल्क का रिपल 50Hz का और दोगुना है, और बल्क वोल्टेज कम है।','जाँच: ब्रिज को डायोड मोड में जाँचें। एक जोड़ी में दोनों दिशा OL मिलेगा।'],
 mosfet:['MOSFET शॉर्ट है। प्लग लगते ही बल्क कैपेसिटर से बहुत बड़ा करंट बहा और फ़्यूज़ उड़ गया (चिंगारी दिखी)। अब सब डेड है, पर बल्क कैपेसिटर कुछ देर चार्ज रहता है (असली में कई मिनट), इसलिए खोलने से पहले डिस्चार्ज ज़रूर करें। "नया फ़्यूज़ लगाएँ" दबाने पर वह फिर उड़ेगा, क्योंकि जब तक शॉर्ट वाला पार्ट नहीं बदला, फ़्यूज़ बदलना बेकार है।','जाँच: MOSFET के ड्रेन-सोर्स में बीप, ब्रिज और बल्क कैपेसिटर भी। बल्ब टेस्टर में बल्ब पूरा जलेगा।'],
 fb:['फ़ीडबैक टूटा है (TL431 या PC817)। PWM को लगता है आउटपुट कम है, इसलिए ड्यूटी बढ़ती रहती है और 12V ऊपर चढ़ती है, साथ में 5V और 3.3V भी। लगभग 14V पर OVP लगता है और SMPS बंद हो जाता है।','जाँच: TL431, PC817 और डिवाइडर के रेसिस्टर। बल्ब टेस्टर और बिना लोड के चलाकर वोल्टेज देखें।'],
 short:['सेकेंडरी में शॉर्ट है (शॉटकी या कैपेसिटर)। SMPS चालू होने की कोशिश करता है, करंट बहुत बढ़ता है, SCP लगकर बंद होता है और फिर शुरू होता है। इसी से टिक-टिक की आवाज़ आती है। CH2 में बल्क कमज़ोर होता दिखेगा।','जाँच: बिना पावर के 12V, 5V, 3.3V रेल और GND के बीच ओम नापें, शॉर्ट वाली रेल का शॉटकी जाँचें।'],
 startup:['स्टार्टअप रेसिस्टर ओपन है। बल्क पर 300V मौजूद है पर PWM और स्टैंडबाय को शुरुआती Vcc नहीं मिल रहा। इसलिए 5VSB नहीं है और PS_ON जोड़ने पर भी कुछ नहीं होता।','जाँच: बल्क पर वोल्टेज देखें (सावधानी से), फिर स्टार्टअप रेसिस्टर ओम में।'],
 ntc:['NTC ओपन है। AC का रास्ता कट गया है, इसलिए बल्क कैपेसिटर चार्ज नहीं होता (जो थोड़ी बची वोल्टेज दिखती है वह घटती चली जाती है) और सब डेड है। फ़्यूज़ ठीक है, इसलिए कई लोग यहाँ धोखा खाते हैं।','जाँच: प्लग निकालकर NTC पर ओम। OL मिले तो वही खराब है।'],
 fuse:['फ़्यूज़ ओपन है; इनपुट पथ और DC बस बंद हैं। इसे बदलने से पहले bridge/MOSFET सहित शॉर्ट का कारण खोजें।'],
 mov:['MOV शॉर्ट होने पर फ़्यूज़ उड़ता है और इनपुट कट जाता है। सही rated MOV लगाएँ और मूल कारण जाँचें।'],
 pwm:['स्टैंडबाय चल सकती है, लेकिन मुख्य PWM switching नहीं होती; 12V रेल नहीं उठती। VCC और gate waveform की जाँच योग्य isolated setup से करें।'],
 'mosfet-open':['MOSFET ओपन होने पर मुख्य switching रुकती है; अलग स्टैंडबाय सप्लाई बनी रह सकती है।'],
 transformer:['ट्रांसफ़ॉर्मर की प्राइमरी winding ओपन है; मॉडल में मुख्य आउटपुट नहीं बनता। DMM shorted turns को विश्वसनीय रूप से नहीं बताता।'],
 'output-open':['मुख्य switching चल सकती है, लेकिन सेकेंडरी आउटपुट पथ ओपन होने से रेल नहीं बनती।'],
 'gate-open':['गेट रेसिस्टर/ड्राइव ओपन होने पर मुख्य switching बंद है; वास्तविक दोष की पुष्टि में सुरक्षित waveform जाँच चाहिए।'],
 'sense-open':['करंट-सेंस पथ ओपन होने पर कंट्रोलर सुरक्षा या no-start में जा सकता है; मॉडल इसे मुख्य आउटपुट बंद करके सरल करता है।']
};
function sayNow(){
 var f=FX[S.fault],h='<b>'+$('lf').options[$('lf').selectedIndex].text+'</b><br>'+f.join('<br>');
 var s='';
 if(!S.plug)s='AC प्लग निकला है, इसलिए कुछ नहीं चल रहा।';
 else if(S.fuse&&S.movBurned)s='<b>अभी:</b> MOV जल गया और फ़्यूज़ उड़ गया। नया फ़्यूज़ और MOV लगाने से पहले इनपुट 265V AC से नीचे करें।';
 else if(S.fuse)s='<b>अभी:</b> फ़्यूज़ उड़ा हुआ है।';
 else if(S.state===3)s='<b>अभी:</b> '+S.prot+'। दोबारा चालू करने के लिए प्लग निकालकर लगाएँ या रीसेट दबाएँ।';
 else if(S.state===4)s='<b>अभी:</b> '+S.prot+'।';
 else if(S.plug&&S.vac<160)s='<b>अभी:</b> AC इनपुट 160V से कम है; अंडरवोल्टेज ट्रिप सक्रिय है।';
 else if(!S.sb&&S.fault!=='ok')s='<b>अभी:</b> 5VSB नहीं है, SMPS पूरी तरह डेड है।';
 else if(!S.ps)s='<b>अभी:</b> सिर्फ़ 5VSB चालू है। PS_ON (हरा तार) GND से जुड़ने पर बाकी रेल चालू होंगी।';
 else if(S.state===1)s='<b>अभी:</b> रेल धीरे-धीरे चढ़ रही हैं। PG सिग्नल थोड़ी देर बाद आएगा (असली में 100ms से 500ms)।';
 $('lsay').className='say'+((S.fault!=='ok'||S.fuse)?' bad':'');
 $('lsay').innerHTML=h+(s?'<br>'+s:'');
}
var lastM=0,lastSay='',lastFuseSound=false,lastRelaySound=true;
function meters(ts){
 if(ts-lastM<120)return;lastM=ts;
 $('m-ac').textContent=(S.plug?S.vac:0)+' V';
 $('m-vc').textContent=S.vcF.toFixed(0)+' V';
 $('m-iin').textContent=S.iinPk.toFixed(1)+' A';
 $('m-12').textContent=S.vo.toFixed(2)+' V';
 $('m-5').textContent=(S.vo*5/12).toFixed(2)+' V';
 $('m-33').textContent=(S.vo*3.3/12).toFixed(2)+' V';
 var rb=$('m-rip');rb.textContent=S.rip.toFixed(0)+' mV';rb.className=S.rip>120?'bad':'';
 var pg=$('m-pg');pg.textContent=S.pg?'हाँ':'नहीं';pg.className=S.pg?'':'bad';
 $('m-sb').textContent=(S.sb?5.0:0).toFixed(1)+' V';
 var fu=$('m-fuse');fu.textContent=S.fuse?'उड़ा':'ठीक';fu.className=S.fuse?'bad':'';
 var mov=$('m-mov');mov.textContent=S.movBurned?'जला':'ठीक';mov.className=S.movBurned?'bad':'';
 $('m-hz').textContent=S.hz.toFixed(2)+' Hz';
 $('lo-ac').textContent=S.vac+' V';$('lo-w').textContent=S.W+' W';$('lo-sp').textContent=S.speed.toFixed(2)+'×';
 var lineLive=S.plug&&!S.fuse&&!S.movBurned&&S.fault!=='fuse'&&S.fault!=='mov';
 var rectifiedLive=lineLive&&S.fault!=='ntc';
 var phase=S.plug?S.vac*Math.SQRT2*Math.sin(2*Math.PI*S.hz*S.tv):0;
 var switched=S.state===2&&rectifiedLive, swPhase=(S.tv*60000)%1;
 var nodes={
  L:phase,F:lineLive?phase:0,R:rectifiedLive?phase:0,N:0,
  BP:S.vcF,BN:0,VCC:S.sb?15:0,
  D:switched?(swPhase<S.D?2:S.vcF):S.vcF,
  T2:switched?(swPhase<S.D?-12:12):0,
  '12':S.vo,'5':S.vo*5/12,'33':S.vo*3.3/12,SG:0,
  SB:S.sb?5:0,PS:S.ps?0:(S.plug?5:0),PG:S.pg?5:0
 };
 Object.keys(nodes).forEach(function(k){var n=$('node-'+k);n.textContent=nodes[k].toFixed(1)+' V'});
 var key=S.fault+'|'+S.plug+'|'+S.ps+'|'+S.fuse+'|'+S.movBurned+'|'+S.state+'|'+S.sb+'|'+S.vac;
 if(key!==lastSay){lastSay=key;sayNow()}
 $('live-effect-reading').textContent=liveEffect(livePart);
}

/* ---------- ऑसिलोस्कोप ---------- */
var LANES=[
 {k:1,c:'#f6e05a',t:'CH1 AC लाइन · 100V/div',lo:-400,hi:400,ticks:[-300,0,300],buf:B1},
 {k:2,c:'#4fd8ff',t:'CH2 बल्क DC · 100V/div',lo:0,hi:400,ticks:[0,200,400],buf:B2},
 {k:3,c:'#ff6bd6',t:'CH3 इनपुट करंट · 3A/div',lo:0,hi:12,ticks:[0,6,12],buf:B3},
 {k:4,c:'#ff9a3d',t:'CH4 MOSFET ड्रेन (60µs) · 100V/div',lo:0,hi:500,ticks:[0,250,500],buf:null},
 {k:5,c:'#6dff9a',t:'CH5 12V रिपल (AC कपलिंग) · 200mV/div',lo:-0.5,hi:0.5,ticks:[-0.5,0,0.5],buf:B5}
];
function drain(k,n,zoom,state){ /* 60µs में 3 पीरियड */
 var source=state||S,tms=k/n*60e-6/zoom,per=20e-6,x=(tms%per)/per,D=source.D,vcf=source.vcF;
 if(source.fault==='mosfet'||source.fuse)return 0;
 if(source.state!==2)return source.fuse?0:vcf;
 if(x<D)return 1.2+(source.heatQ*2);
 var t=(x-D)*per;
 var ring=Math.exp(-t/1.6e-6)*Math.sin(2*Math.PI*1.2e6*t);
 return vcf+0.30*vcf*ring+0.08*vcf*Math.exp(-t/6e-6);
}
function scope(){
  var cv=$('scp');if(!cv)return;
  var g=cv.getContext('2d'),W=cv.width,H=cv.height;
 var view=scopeFrozen&&heldScope?heldScope:null,buffers=view?view.buffers:{1:B1,2:B2,3:B3,5:B5},cursor=view?view.bi:bi,state=view?view.state:S;
 g.fillStyle='#06120c';g.fillRect(0,0,W,H);
 var act=LANES.filter(function(l){return CH[l.k]});
 if(!act.length){g.fillStyle='#6c8f7b';g.font="16px 'Noto Sans Devanagari',sans-serif";g.fillText('कोई चैनल नहीं चुना',20,40);return}
 var lh=H/act.length,L=40,R=8,pw=W-L-R;
 for(var li=0;li<act.length;li++){
  var l=act[li],top=li*lh+24,bot=(li+1)*lh-8,ph=bot-top;
  function Y(v){return bot-(v-l.lo)/(l.hi-l.lo)*ph}
  g.strokeStyle='rgba(90,200,130,.16)';g.lineWidth=1;
  for(var gx=0;gx<=10;gx++){var x=L+gx*pw/10;g.beginPath();g.moveTo(x,top);g.lineTo(x,bot);g.stroke()}
  for(var gy=0;gy<=4;gy++){var y=top+gy*ph/4;g.beginPath();g.moveTo(L,y);g.lineTo(L+pw,y);g.stroke()}
  var timeLabel=(l.k===4?(60/scopeZoom).toFixed(1)+' µs':(40/scopeZoom).toFixed(1)+' ms');
  var laneLabel=l.k===5&&scopeNode?'CH5 '+scopeNode+' · Ripple':l.t;
  g.fillStyle=l.c;g.font="600 13px 'Noto Sans Devanagari',sans-serif";g.textAlign='left';g.textBaseline='middle';g.fillText(laneLabel+' · '+timeLabel,L,li*lh+11);
  g.font="11px 'IBM Plex Mono',monospace";g.textAlign='right';g.fillStyle='#6c8f7b';
  for(var q=0;q<l.ticks.length;q++){g.fillText(String(l.ticks[q]),L-4,Y(l.ticks[q]))}
  g.strokeStyle=l.c;g.lineWidth=1.8;g.shadowColor=l.c;g.shadowBlur=7;g.beginPath();
  var n=(l.k===4)?Math.max(24,Math.round(240/scopeZoom)):Math.max(24,Math.floor(N/scopeZoom));
  var offset=(cursor-n+N)%N;
  for(var k=0;k<n;k++){
   var v=(l.k===4)?drain(k,n,scopeZoom,state):buffers[l.k][(offset+k)%N];
   var xx=L+k/(n-1)*pw,yy=Y(Math.max(l.lo,Math.min(l.hi,v)));
   if(k===0)g.moveTo(xx,yy);else g.lineTo(xx,yy);
  }
  g.stroke();g.shadowBlur=0;
 }
}
function traceNodeLabel(node){var label=$('node-'+node);return label&&label.previousElementSibling?label.previousElementSibling.textContent:node}
function traceNode(node){
 var lane={L:1,F:1,R:1,N:1,BP:2,BN:2,VCC:2,D:4,G:4,OUT:4,T2:4,'12':5,'5':5,'33':5,SG:5,SB:5,PS:5,PG:5}[node];
 scopeNode=node;
 document.querySelectorAll('#lc .trace-node,[data-trace-node]').forEach(function(el){var active=el.getAttribute('data-trace-node')===node;el.classList.toggle('trace-selected',active);el.setAttribute('aria-pressed',String(active))});
 document.querySelectorAll('#lc .wire2[data-trace-nodes]').forEach(function(path){path.classList.toggle('trace-active',path.dataset.traceNodes.split(' ').includes(node))});
 if(lane){Object.keys(CH).forEach(function(key){CH[key]=Number(key)===lane;pressed('ch'+key,CH[key])})}
 $('scp-trace-state').textContent='Trace: '+traceNodeLabel(node)+(lane?' → CH'+lane:'');scope();
}
var tracePathNodes=[['L','F','R'],['N','BN'],['F','N'],['R','BP','VCC'],['BN','N'],['BP','BN'],['D','G'],['T2','12','5','33','PG','SB'],['OUT','G'],['BP','D'],['T2'],['12','5','33'],['PG','PS'],['BP','VCC']];
document.querySelectorAll('#lc .wire2').forEach(function(path,index){if(tracePathNodes[index])path.dataset.traceNodes=tracePathNodes[index].join(' ')});
var tracePoints=[['L',50,160],['F',142,100],['R',205,160],['N',50,188],['BP',380,100],['BN',380,240],['VCC',421,125],['D',470,175],['T2',530,165],['12',680,120],['5',680,160],['33',680,200],['SG',640,240],['SB',390,145],['PS',730,240],['PG',650,55]];
var traceLayer=document.createElementNS('http://www.w3.org/2000/svg','g');traceLayer.setAttribute('id','lc-trace-points');traceLayer.setAttribute('aria-label','ट्रेस करने योग्य सर्किट नोड');
tracePoints.forEach(function(point){var circle=document.createElementNS('http://www.w3.org/2000/svg','circle');circle.setAttribute('cx',point[1]);circle.setAttribute('cy',point[2]);circle.setAttribute('r','9');circle.setAttribute('class','trace-node');circle.setAttribute('data-trace-node',point[0]);circle.setAttribute('tabindex','0');circle.setAttribute('role','button');circle.setAttribute('aria-label',traceNodeLabel(point[0])+' waveform trace');circle.setAttribute('aria-pressed','false');circle.addEventListener('click',function(){traceNode(point[0])});circle.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();traceNode(point[0])}});traceLayer.appendChild(circle)});
document.getElementById('lc').appendChild(traceLayer);
 document.querySelectorAll('.node-readings b[id^="node-"]').forEach(function(label){var node=label.id.slice(5);label.dataset.traceNode=node;label.tabIndex=0;label.setAttribute('role','button');label.setAttribute('aria-label',traceNodeLabel(node)+' · scope पर trace करें');label.setAttribute('aria-pressed','false');label.addEventListener('click',function(){traceNode(node)});label.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();traceNode(node)}})});
$('scp-hold').addEventListener('click',function(){
 if(!scopeFrozen){heldScope={bi:bi,buffers:{1:B1.slice(),2:B2.slice(),3:B3.slice(),5:B5.slice()},state:{fault:S.fault,fuse:S.fuse,state:S.state,D:S.D,vcF:S.vcF,heatQ:S.heatQ}};scopeFrozen=true}
 else{scopeFrozen=false;heldScope=null}
 this.setAttribute('aria-pressed',String(scopeFrozen));this.textContent=scopeFrozen?'▶ लाइव':'⏸ होल्ड';scope();
});
function setScopeZoom(value){scopeZoom=Math.max(1,Math.min(8,value));$('scp-zoom-label').textContent=scopeZoom+'×';scope()}
$('scp-zoom-in').addEventListener('click',function(){setScopeZoom(scopeZoom*1.5)});
$('scp-zoom-out').addEventListener('click',function(){setScopeZoom(scopeZoom/1.5)});

/* ---------- लूप ---------- */
var last=0;
function frame(ts){
 if(!last)last=ts;
 var rd=Math.min(0.05,(ts-last)/1000);last=ts;
 if(!S.pause){
  var vadv=rd*S.speed,n=Math.max(1,Math.round(vadv/DT));
  S.iinMax=0;
  for(var i=0;i<n;i++)step();
  S.iinPulse=S.iinMax; /* इस फ़्रेम का सबसे बड़ा करंट पल्स */
  fsm(rd);
  S.iinMax=S.iinPulse;
  drawUI(rd);scope();
 }
 meters(ts);
 requestAnimationFrame(frame);
}
/* शुरुआती स्थिर अवस्था तैयार करना */
(function(){for(var i=0;i<9000;i++)step();S.iinPulse=0;fsm(0.01);S.vo=12;S.state=2;S.pg=true;S.t=5})();

/* ---------- नियंत्रण ---------- */
function pressed(id,v){$(id).setAttribute('aria-pressed',v)}
$('lf').addEventListener('change',function(){S.fault=$('lf').value;resetAll();lastSay=''});
$('t-plug').addEventListener('click',function(){S.plug=!S.plug;pressed('t-plug',S.plug);
 $('t-plug').textContent=S.plug?'AC प्लग लगा है':'AC प्लग निकला है';
 if(S.plug){S.latched=false;S.prot='';if(S.fault==='mosfet'&&!S.fuse)blow()}else{S.state=0;S.pg=false;S.prot=''}
 lastSay=''});
$('t-ps').addEventListener('click',function(){S.ps=!S.ps;pressed('t-ps',S.ps);
 $('t-ps').textContent=S.ps?'PS_ON हरा तार GND से जुड़ा है':'PS_ON हरा तार खुला है';
 if(S.ps){S.latched=false;S.prot=''}else{S.prot=''}
 lastSay=''});
$('t-pause').addEventListener('click',function(){S.pause=!S.pause;pressed('t-pause',S.pause);$('t-pause').textContent=S.pause?'चलाएँ':'रोकें'});
$('lf-reset').addEventListener('click',function(){resetAll();lastSay=''});
$('lv-ac').addEventListener('input',function(){S.vac=+$('lv-ac').value});
$('lv-w').addEventListener('input',function(){S.W=+$('lv-w').value});
$('lv-sp').addEventListener('input',function(){S.speed=+$('lv-sp').value});
[1,2,3,4,5].forEach(function(k){$('ch'+k).addEventListener('click',function(){CH[k]=!CH[k];pressed('ch'+k,CH[k])})});
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){S.pause=true;pressed('t-pause',true);$('t-pause').textContent='चलाएँ'}
requestAnimationFrame(frame);
})();
