
(function(){
'use strict';
const X=window.__bx;if(!X)return;
const {st,COMPS,CM,NODES,STG,MI,MODES}=X;
const $=i=>document.getElementById(i),PI2=Math.PI*2;
const IC={
res:'<path d="M0 13h8l3-7 5 14 5-14 5 14 3-7h15"/>',cap:'<path d="M0 13h18M28 13h16M18 3v20"/><path d="M28 3q-5 10 0 20"/><path d="M12 5h-4M10 3v4" />',film:'<path d="M0 13h18M26 13h18M18 3v20M26 3v20"/>',
dio:'<path d="M0 13h14M30 13h14M14 3v20l16-10zM30 3v20"/>',sch:'<path d="M0 13h14M30 13h14M14 3v20l16-10zM30 3v20M27 3h3M30 23h3"/>',fuse:'<rect x="9" y="7" width="26" height="12" rx="6"/><path d="M0 13h9M35 13h9M12 13h20"/>',
disc:'<circle cx="22" cy="13" r="10"/><path d="M0 13h12M32 13h12M14 20l16-14"/>',ind:'<path d="M0 13h6a4 4 0 0 1 8 0a4 4 0 0 1 8 0a4 4 0 0 1 8 0a4 4 0 0 1 8 0h6"/>',
mos:'<path d="M0 13h13M13 4v18M18 4v5M18 10.5v5M18 17v5M18 6h16V0M18 20h16v6M18 13h10"/>',ic:'<rect x="8" y="3" width="28" height="20" rx="2"/><path d="M13 3V0M22 3V0M31 3V0M13 23v3M22 23v3M31 23v3"/><circle cx="13" cy="8" r="1.5"/>',
tl:'<path d="M0 13h14M30 13h14M14 3v20l16-10zM30 3v20M30 13l8-2"/>',led:'<path d="M0 13h14M30 13h14M14 3v20l16-10zM30 3v20M21 -1l5 4M26 -2l5 4"/>',wind:'<path d="M2 21a4 4 0 0 1 8 0a4 4 0 0 1 8 0a4 4 0 0 1 8 0a4 4 0 0 1 8 0a4 4 0 0 1 8 0"/><path d="M0 5h44M0 9h44"/>'};
const ico=k=>'<svg viewBox="-2 -4 48 34" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(IC[k]||IC.res)+'</svg>';
/* ================= कंट्रोल/ढाँचा तैयार ================= */
const stages=$('bx-stages');
STG.forEach(([g,t])=>{
  const sec=document.createElement('div');sec.className='bx-stage';sec.id='bxs-'+g;
  let h='<h4>'+t+'</h4><div class="bx-grid">';
  if(g==='conn'){
    [['SG','GND','#222'],['V12','+12V','#e6b800'],['V5','+5V','#e0262c'],['V33','+3.3V','#ff8a1f'],['SB','5VSB','#9b59d0'],['PSON','PS_ON','#2eaa4a'],['PG','PG','#8a8a8a']].forEach(c=>{h+='<div class="bx-pin"><span class="bx-tp" data-n="'+c[0]+'" style="--c:'+c[2]+'">'+c[1]+'</span></div>'});
    h+='</div><p class="small">वोल्टेज जाँच: लाल प्रोब रेल पर, काली GND पर।</p>';
  }else{
    COMPS.filter(c=>c.g===g).forEach(c=>{
      h+='<div class="bx-tile ok" data-i="'+c.i+'" tabindex="0" role="button" aria-label="'+c.s+' '+c.n+'"><div class="bx-ti">'+ico(c.k)+'</div><div class="bx-tn"><b>'+c.s+'</b><span>'+c.n+'</span></div><div class="bx-tv">'+c.v+'</div><div class="bx-tpr"><span class="bx-tp" data-n="'+c.a+'">'+c.a+'</span><span class="bx-tp" data-n="'+c.b+'">'+c.b+'</span></div><i class="bx-sd"></i></div>';
    });
    h+='</div>';
  }
  sec.innerHTML=h;stages.appendChild(sec);
});
const det=document.createElement('div');det.className='bx-det';det.id='bx-det';
function selComp(id,scroll,autoTest){
  st.sel=id;const t=stages.querySelector('.bx-tile[data-i="'+id+'"]');
  if(t){t.closest('.bx-stage').insertBefore(det,t.closest('.bx-grid').nextSibling);renderDet();if(autoTest)testPart(CM[id]);if(scroll)det.scrollIntoView({block:'nearest',behavior:'smooth'})}
  stages.querySelectorAll('.bx-tile').forEach(x=>x.classList.toggle('sel',x.dataset.i===id));
}
stages.addEventListener('click',e=>{
  const tp=e.target.closest('.bx-tp');if(tp){probe(tp.dataset.n,tp);return}
 const t=e.target.closest('.bx-tile');if(t)selComp(t.dataset.i,true,true);
});
stages.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('bx-tile')){e.preventDefault();selComp(e.target.dataset.i,true,true)}});
const modeFor={res:'ohm',cap:'cap',film:'cap',dio:'dio',sch:'dio',fuse:'cont',disc:'ohm',ind:'cont',mos:'dio',ic:'ohm',tl:'dio',led:'dio',wind:'cont'};
const EXTRA_TEST_PARTS=[
  {i:'bjt-npn',s:'Q (NPN)',n:'NPN BJT ट्रांजिस्टर',k:'bjt',a:'TB',b:'TE',device:'bjt-npn',search:'bjt transistor npn 2sc3306 base collector emitter'},
  {i:'bjt-pnp',s:'Q (PNP)',n:'PNP BJT ट्रांजिस्टर',k:'bjt',a:'TB',b:'TE',device:'bjt-pnp',search:'bjt transistor pnp base collector emitter'}
];
const TEST_PARTS=COMPS.concat(EXTRA_TEST_PARTS),testPartSelect=$('bx-part-select'),testPartSearch=$('bx-part-search'),testPlan=$('bx-test-plan');
let activeTestPart=null,activeTestStep=0;
const PART_SEARCH_TERMS={res:'resistor resistance रेसिस्टर प्रतिरोध',cap:'capacitor electrolytic कैपेसिटर',film:'film x2 snubber capacitor फिल्म कैप',dio:'diode rectifier डायोड रेक्टिफ़ायर',sch:'schottky शॉटकी डायोड',fuse:'फ़्यूज़ fuse',disc:'mov varistor surge ntc thermistor थर्मिस्टर',ind:'inductor coil choke कॉइल चोक',wind:'transformer winding transformer ट्रांसफॉर्मर ट्रांसफ़ॉर्मर वाइंडिंग',mos:'mosfet mos fet transistor ट्रांजिस्टर',ic:'pwm controller pwm कंट्रोलर ic integrated circuit',tl:'tl431 regulator रेगुलेटर',led:'opto optocoupler pc817 ऑप्टोकपलर'};
testPartSelect.innerHTML=TEST_PARTS.map(c=>'<option value="'+c.i+'" data-search="'+(c.s+' '+c.n+' '+(c.search||'')+' '+(PART_SEARCH_TERMS[c.k]||'')).toLocaleLowerCase()+'">'+c.s+' · '+c.n+'</option>').join('');
testPartSelect.value=st.sel;
function updatePartCount(){
  const count=Array.from(testPartSelect.options).filter(option=>!option.hidden).length;
  $('bx-part-count').textContent=count+' / '+TEST_PARTS.length+' कंपोनेंट';
}
updatePartCount();
testPartSearch.addEventListener('input',()=>{
  const query=testPartSearch.value.trim().toLocaleLowerCase();
  Array.from(testPartSelect.options).forEach(option=>{option.hidden=!!query&&!option.dataset.search.includes(query)});
  updatePartCount();
  if(testPartSelect.selectedOptions[0]&&testPartSelect.selectedOptions[0].hidden){
    const first=Array.from(testPartSelect.options).find(option=>!option.hidden);
    if(first){testPartSelect.value=first.value;chooseTestPart(first.value)}
  }
});
testPartSelect.addEventListener('change',()=>chooseTestPart(testPartSelect.value));
function chooseTestPart(id){
  const c=TEST_PARTS.find(part=>part.i===id);
  if(!c)return;
  if(CM[id])selComp(id,true,false);
  testPart(c);
}
function testStepsFor(c){
  if(c.k==='bjt'){
    const npn=c.device==='bjt-npn',base='TB',emitter='TE',collector='TC';
    return [
      {name:'Base–Emitter जंक्शन',mode:'dio',red:npn?base:emitter,black:npn?emitter:base,method:npn?'NPN: लाल प्रोब Base पर, काली Emitter पर।':'PNP: काली प्रोब Base पर, लाल Emitter पर।',expected:'आम तौर पर 0.55–0.8V।'},
      {name:'Base–Collector जंक्शन',mode:'dio',red:npn?base:collector,black:npn?collector:base,method:npn?'लाल Base, काली Collector।':'काली Base, लाल Collector।',expected:'आम तौर पर 0.55–0.8V।'},
      {name:'Base–Emitter उलटी दिशा',mode:'dio',red:npn?emitter:base,black:npn?base:emitter,method:'लाल और काली प्रोब आपस में उलटें।',expected:'OL।'},
      {name:'Base–Collector उलटी दिशा',mode:'dio',red:npn?collector:base,black:npn?base:collector,method:'लाल और काली प्रोब आपस में उलटें।',expected:'OL।'},
      {name:'Collector–Emitter',mode:'dio',red:collector,black:emitter,method:'Base को खुला छोड़कर Collector से Emitter मापें।',expected:'दोनों दिशाओं में सामान्यतः OL।'},
      {name:'Collector–Emitter उलटी दिशा',mode:'dio',red:emitter,black:collector,method:'Base खुला रखते हुए प्रोब उलटें।',expected:'OL; दोनों दिशाओं में बीप/लगभग 0V मिले तो शॉर्ट का शक।'}
    ];
  }
  if(c.k==='mos'&&c.i==='q1')return [
    {name:'Drain–Source बॉडी डायोड',mode:'dio',red:'CS',black:'D',method:'गेट को Source से छुआकर डिस्चार्ज करें। N-channel में लाल Source, काली Drain रखें।',expected:'बॉडी डायोड लगभग 0.3–0.8V।'},
    {name:'Drain–Source उलटी दिशा',mode:'dio',red:'D',black:'CS',method:'प्रोब उलटें; गेट डिस्चार्ज रखें।',expected:'आम तौर पर OL। दोनों दिशाओं में लगभग 0V/बीप मिले तो D–S शॉर्ट।'},
    {name:'Gate–Source लीकेज',mode:'ohm',red:'G',black:'CS',method:'गेट और Source के बीच resistance मापें।',expected:'OL/बहुत ऊँचा प्रतिरोध; कम प्रतिरोध गेट खराब होने का संकेत।'},
    {name:'Gate–Drain लीकेज',mode:'ohm',red:'G',black:'D',method:'गेट और Drain के बीच resistance मापें।',expected:'OL/बहुत ऊँचा प्रतिरोध।'}
  ];
  if(['dio','sch','led','tl'].includes(c.k))return [
    {name:'जंक्शन की फॉरवर्ड दिशा',mode:'dio',red:c.a,black:c.b,method:c.tip||'डायोड मोड में लाल और काली प्रोब इस दिशा में रखें।',expected:'सिलिकॉन डायोड में आम तौर पर 0.4–0.8V; Schottky में लगभग 0.15–0.45V। पार्ट के डेटा से तुलना करें।'},
    {name:'जंक्शन की रिवर्स दिशा',mode:'dio',red:c.b,black:c.a,method:'प्रोब उलटें और उसी जंक्शन को दोबारा मापें।',expected:'आम तौर पर OL; दोनों दिशाओं में लगभग 0V/बीप शॉर्ट का संकेत।'}
  ];
  if(c.k==='cap'||c.k==='film')return [
    {name:'कैपेसिटेंस',mode:'cap',red:c.a,black:c.b,method:'पार्ट को सुरक्षित डिस्चार्ज करें और बेहतर रीडिंग के लिए एक terminal अलग करें।',expected:'लिखे हुए µF/nF मान और tolerance के करीब; ESR के लिए ESR meter चाहिए।'},
    {name:'स्थायी शॉर्ट की जाँच',mode:'ohm',red:c.a,black:c.b,method:'मीटर को Ω मोड में रखें; कैप चार्ज होने पर रीडिंग बदल सकती है, स्थिर रीडिंग का इंतज़ार करें।',expected:'स्थायी बहुत कम Ω/बीप शॉर्ट का संकेत है; in-circuit समानांतर रास्ते अलग करें।'}
  ];
  const mode=c.k==='mos'?'ohm':modeFor[c.k]||'ohm';
  let method=c.tip||'पार्ट को डिस्चार्ज/आइसोलेट करके दोनों सिरों पर मापें।';
  let expected='रीडिंग पार्ट की लिखी वैल्यू/डेटाशीट और समानांतर सर्किट पथ पर निर्भर है।';
  if(c.k==='ic'){
    method='प्लग निकला और बल्क 0V होने पर VCC–GND का resistance देखें। स्थायी hard-short संदिग्ध है; सिर्फ़ Ω/continuity से PWM IC पास सिद्ध नहीं होता।';
    expected='VCC–GND पर स्थायी लगभग 0Ω/बीप नहीं होना चाहिए। सही कार्य के लिए डेटाशीट, नियंत्रित सप्लाई और oscilloscope चाहिए।';
  }else if(c.k==='wind'){
    method='संबंधित winding के दोनों सिरों पर continuity/Ω मापें; अलग winding समूहों से continuity नहीं होनी चाहिए।';
    expected='एक ही winding में सीमित कम resistance/continuity; OL का अर्थ टूटी winding हो सकता है। shorted turns DMM से भरोसेमंद नहीं पकड़ते।';
  }else if(c.k==='mos'){
    method='इस पार्ट के उपलब्ध टर्मिनलों पर resistance से short जाँचें। सही Gate/Drain/Source pinout डेटाशीट से पहचानें; यह simulator में pass MOSFET है।';
    expected='स्थायी rail-to-rail short नहीं। असली MOSFET की gate leakage और body diode जाँच के लिए अलग किए पार्ट पर diode/Ω चरण अपनाएँ।';
  }else if(c.k==='ind'){
    method='एक winding/coil के सिरों पर continuity जाँचें; in-circuit parallel path रीडिंग बदल सकता है।';
  }
  return [{name:'मुख्य टेस्ट',mode,red:c.a,black:c.b,method,expected}];
}
function testPart(c,stepIndex){
  activeTestPart=c;
  const steps=testStepsFor(c);
  activeTestStep=Number.isInteger(stepIndex)?Math.max(0,Math.min(stepIndex,steps.length-1)):0;
  const step=steps[activeTestStep];
  st.testDevice=c.device||'';
  st.pr=step.red;st.pb=step.black;st.prEl=st.pbEl=null;st.next='r';
  testPartSelect.value=c.i;
  applyTestStepToMeter(step);
  renderTestPlan(c,steps,step);
  if(CM[c.i]&&st.sel===c.i)renderDet();
  openDock(true);
}
testPlan.addEventListener('click',event=>{
  const point=event.target.closest('.bx-tp');
  if(point)probe(point.dataset.n,point);
});
function applyTestStepToMeter(step){
  st.pr=step.red;st.pb=step.black;st.prEl=st.pbEl=null;st.next='r';
  setMode(step.mode);openDock(true);syncDock();
}
function renderTestPlan(c,steps,step){
  const pointIds=c.k==='bjt'?['TB','TC','TE']:[step.red,step.black];
  const points=Array.from(new Set(pointIds)).map(id=>'<span class="bx-tp" data-n="'+id+'" title="'+NODES[id]+'">'+id+'</span>').join(' ');
  testPlan.innerHTML='<h4>'+c.s+' · '+c.n+' की जाँच</h4>'+
    '<p><b>मीटर अपने-आप:</b> '+({ohm:'Ω रेज़िस्टेंस',cont:'कंटीन्यूटी',dio:'डायोड टेस्ट',cap:'कैपेसिटेंस',dcv:'DC वोल्ट',acv:'AC वोल्ट'}[step.mode]||step.mode)+
    ' · 🔴 लाल '+step.red+' · ⚫ काली '+step.black+'</p>'+
    '<p><b>पार्ट के टेस्ट पिन:</b> '+points+' <span class="small">· पिन पर टैप करके प्रोब जोड़ें</span></p>'+
    '<div class="bx-test-current"><b>चरण '+(activeTestStep+1)+'/'+steps.length+' · '+step.name+'</b><p>'+step.method+'</p><p><b>सामान्य संकेत:</b> '+step.expected+'</p></div>'+
    '<p class="bx-test-disclaimer">'+(c.k==='ic'?'PWM IC के switching, oscillator और regulation को केवल साधारण DMM से प्रमाणित नहीं किया जा सकता।':'मीटर की रीडिंग इन-सर्किट में आसपास के पार्ट से बदल सकती है; बेहतर पुष्टि के लिए बिजली बंद करके एक pin अलग जाँचें।')+
    (c.k==='wind'?' Shorted turns के लिए LCR/ring tester इस्तेमाल करें।':'')+'</p>'+
    '<div class="bx-test-nav"><button type="button" class="chip" data-test-step="-1" '+(activeTestStep===0?'disabled':'')+'>← पिछला टेस्ट</button><button type="button" class="chip" data-test-step="1" '+(activeTestStep===steps.length-1?'disabled':'')+'>अगला टेस्ट →</button></div>';
  testPlan.querySelectorAll('[data-test-step]').forEach(button=>button.addEventListener('click',()=>{
    testPart(c,activeTestStep+Number(button.dataset.testStep));
  }));
}
function renderDet(){
  const c=CM[st.sel],cur=st.c[c.i];
  const currentTest=activeTestPart&&activeTestPart.i===c.i?testStepsFor(c)[activeTestStep]:null;
  const redProbe=currentTest?currentTest.red:c.a,blackProbe=currentTest?currentTest.black:c.b;
  let h='<div class="bx-dh"><div class="bx-di">'+ico(c.k)+'</div><div><b>'+c.s+' · '+c.n+'</b><div class="small">मान: '+c.v+' · पिन: <span class="bx-tp" data-n="'+c.a+'">'+c.a+'</span> <span class="bx-tp" data-n="'+c.b+'">'+c.b+'</span></div></div></div>';
  h+='<div class="bx-fb" role="group" aria-label="इस पार्ट की हालत बदलें">';
  ['ok'].concat(MODES).forEach(m=>{
    if(m!=='ok'&&(!c.m[m]||st.myst))return;
    h+='<button type="button" class="chip bx-f bx-f-'+m+'" data-m="'+m+'" aria-pressed="'+(!st.myst&&cur===m)+'">'+MI[m]+(m!=='ok'?'<small>'+c.m[m]+'</small>':'')+'</button>';
  });
  h+='</div>';
  if(st.myst)h+='<p class="small">रहस्य मोड: पार्ट की हालत छुपी है। मीटर से जाँचकर खराब पार्ट खोजें, फिर "✔ नया" लगाएँ।</p>';
  h+='<div class="bx-eff">';
  [['short','⚡ शॉर्ट हुआ तो'],['open','⛔ ओपन हुआ तो'],['weak','🌫 कमज़ोर हुआ तो']].forEach(([m,t])=>{if(c.m[m]&&c.e[m])h+='<p><b>'+t+':</b> '+c.e[m]+'</p>'});
  h+='</div><div class="bx-test-reading" aria-live="polite"><p><b>मीटर की प्रोब:</b> 🔴 '+redProbe+' पर · ⚫ '+blackProbe+' पर</p><p><b>ठीक पार्ट की तुलना:</b> <span id="bx-expected-reading">रीडिंग ले रहे हैं…</span></p><p><b>अभी की रीडिंग:</b> <span class="bx-reading-result" id="bx-current-reading">मीटर अपडेट हो रहा है…</span></p><p><b>नतीजा:</b> <span id="bx-reading-grade">कंपोनेंट चुनें और रीडिंग देखें।</span></p><p class="small">यह सर्किट के भीतर अनुमानित तुलना है। समानांतर रास्ते रीडिंग बदल सकते हैं; पक्का परीक्षण करने के लिए सुरक्षित रूप से एक पिन उठाकर जाँचें।</p></div><p class="small"><b>जाँच विधि:</b> '+c.tip+'</p>';
  det.innerHTML=h;
  det.querySelectorAll('.bx-f').forEach(b=>b.addEventListener('click',()=>applyMode(c.i,b.dataset.m)));
}
function applyMode(id,m){
  const c=CM[id],prev=st.c[id];
  if(m==='ok'&&st.plug&&prev!=='ok'){st.plug=false;st.disch=true;log2('सुरक्षा: पार्ट बदलने के लिए प्लग निकाला और बल्क डिस्चार्ज किया।')}
  st.c[id]=m;st.flash.push(id);st.won=false;
  log2(c.s+' ('+c.n+'): '+(m==='ok'?'नया ठीक पार्ट लगाया':MI[m]+' · '+c.m[m]+(st.plug?' (बिजली चालू में)':'')));
  if(m==='ok'&&st.c.f1==='ok'&&!st.plug)log2('अब प्लग लगाकर जाँचें।');
  if(st.myst&&COMPS.every(x=>st.c[x.i]==='ok')){st.won=true;log2('🎉 बधाई! सारे पार्ट ठीक हो गए।')}
  sig='';renderDet();
}
function log2(t){X.log(t)}
/* ================= कंट्रोल बार ================= */
const B=id=>$(id);
function syncCtl(){
  const p=(id,on,t)=>{const e=B(id);e.setAttribute('aria-pressed',on);if(t)e.textContent=t};
  p('bx-plug',st.plug,st.plug?'🔌 AC प्लग लगा है':'🔌 AC प्लग निकला है');
  p('bx-ps',st.ps,st.ps?'PS_ON हरा तार GND से जुड़ा':'PS_ON हरा तार खुला');
  p('bx-open',!st.myst);p('bx-myst',st.myst);B('bx-rev').hidden=!st.myst;
  B('bx-aco').textContent=st.ac+' V';B('bx-wo').textContent=st.w+' W';B('bx-hzo').textContent=st.hz+' Hz';B('bx-fso').textContent=st.fsw+' kHz';
}
B('bx-plug').addEventListener('click',()=>{st.plug=!st.plug;if(st.plug)st.disch=false;syncCtl();syncDock()});
B('bx-ps').addEventListener('click',()=>{st.ps=!st.ps;syncCtl()});
B('bx-spike').addEventListener('click',()=>X.spike());
B('bx-reset').addEventListener('click',()=>{X.allOk();st.plug=true;st.won=false;st.temp=40;st.hotT=0;st.hid=null;st.rev=false;st.log=[];X.log('सब पार्ट नए और ठीक लगा दिए गए।');sig='';renderDet();syncCtl();syncDock()});
[['bx-ac','ac'],['bx-w','w'],['bx-hz','hz'],['bx-fs','fsw']].forEach(([i,k])=>B(i).addEventListener('input',e=>{st[k]=+e.target.value;syncCtl()}));
function newFault(){
  const ids=COMPS.filter(c=>c.i!=='f1');let tries=0;
  do{
    X.allOk();st.plug=true;st.bulkV=300;st.temp=42;st.onT=10;
    const c=ids[Math.floor(Math.random()*ids.length)],ms=MODES.filter(m=>c.m[m]),m=ms[Math.floor(Math.random()*ms.length)];
    st.c[c.i]=m;st.hid=[c.i,m];tries++;
    const R=X.analyze(),sym=R.m[0]&&R.m[0][0].indexOf('सब सामान्य')!==0;
    if(sym||tries>40)break;
  }while(true);
  st.rev=false;st.won=false;st.log=[];st.flash=[];
  X.log('🎲 कोई एक पार्ट खराब कर दिया गया है। लक्षण देखें, मीटर से जाँचें, खराब पार्ट खोजकर "✔ नया" से बदलें।');
}
function setMyst(on){st.myst=on;st.rev=false;if(on)newFault();else{st.hid=null;X.allOk();st.log=[];X.log('खुला मोड: पार्ट पर क्लिक करके शॉर्ट, ओपन या कमज़ोर करके असर देखें।')}sig='';renderDet();syncCtl();syncDock()}
B('bx-open').addEventListener('click',()=>setMyst(false));
B('bx-myst').addEventListener('click',()=>{if(st.myst){newFault();sig='';renderDet();syncCtl()}else setMyst(true)});
B('bx-rev').addEventListener('click',()=>{st.rev=!st.rev;st.logDirty=true});
/* ================= स्थिति अपडेट ================= */
let sig='';
function updTiles(){
  const s=JSON.stringify(st.c)+st.myst+st.sel;if(s===sig)return;sig=s;
  stages.querySelectorAll('.bx-tile').forEach(t=>{const v=st.c[t.dataset.i],sh=st.myst?'ok':v;t.classList.remove('short','open','weak','ok');t.classList.add(sh);t.querySelector('.bx-sd').textContent=sh==='ok'?'':({short:'⚡',open:'⛔',weak:'🌫'})[sh]});
  if(st.dirtyDet!==false)renderDet();
}
/* ================= रेल पट्टी + संदेश ================= */
const RL=[['ac','AC इनपुट'],['bulk','बल्क DC'],['12','+12V'],['5','+5V'],['33','+3.3V'],['sb','5VSB'],['pg','PG'],['rp','12V रिपल'],['tq','Q1 तापमान'],['vds','Q1 Vds पीक'],['fs','स्विचिंग'],['hz','मेन्स']];
B('bx-rails').innerHTML=RL.map(r=>'<div class="rl" id="rl-'+r[0]+'"><small>'+r[1]+'</small><b>0</b></div>').join('');
const setRL=(k,t,on,er)=>{const e=$('rl-'+k);e.querySelector('b').textContent=t;e.className='rl'+(on?' on':'')+(er?' er':'')};
let sayK='',logK='';
function updUI(R){
  const D=R.dc,ok=(v,a,b)=>v>a&&v<b;
  setRL('ac',st.plug?st.ac+' V':'0 V',R.ac.L>0);
  setRL('bulk',st.bulkV.toFixed(0)+' V',st.bulkV>50,st.bulkV>50&&!st.plug);
  setRL('12',D.V12.toFixed(2)+' V',ok(D.V12,11.4,12.6),R.run&&st.ps&&!ok(D.V12,11.4,12.6));
  setRL('5',D.V5.toFixed(2)+' V',ok(D.V5,4.75,5.25),R.run&&st.ps&&!ok(D.V5,4.75,5.25));
  setRL('33',D.V33.toFixed(2)+' V',ok(D.V33,3.1,3.5),R.run&&st.ps&&!ok(D.V33,3.1,3.5));
  setRL('sb',D.SB.toFixed(2)+' V',D.SB>4.7);
  setRL('pg',R.pg?'हाँ':'नहीं',R.pg,R.run&&st.ps&&!R.pg);
  setRL('rp',R.run&&st.ps?R.rip12.toFixed(0)+' mV':'0 mV',R.run&&st.ps&&R.rip12<120,R.run&&st.ps&&R.rip12>=120);
  setRL('tq',st.temp.toFixed(0)+' °C',st.temp<100,st.temp>=110);
  setRL('vds',R.vds.toFixed(0)+' V',R.vds>0&&R.vds<520,R.vds>=600);
  setRL('fs',R.sw?st.fsw+' kHz':'—',R.sw&&st.fsw>=45&&st.fsw<=110,R.sw&&(st.fsw<45||st.fsw>110));
  setRL('hz',st.plug?st.hz+' Hz':'—',st.plug&&Math.abs(st.hz-50)<5);
  const sk=JSON.stringify([R.m,st.myst,st.rev,st.won]);
  if(sk!==sayK){sayK=sk;let h='';R.m.forEach(x=>{h+='<p><b>'+x[0]+'</b>'+(st.myst?'':'<br><span class="small">'+x[1]+'</span>')+'</p>'});
    if(st.myst&&st.rev&&st.hid)h+='<p><b>असली खराबी:</b> '+CM[st.hid[0]].s+' ('+CM[st.hid[0]].n+') · '+CM[st.hid[0]].m[st.hid[1]]+'</p>';
    const good=R.m.length===1&&R.m[0][0].indexOf('सब सामान्य')===0;
    B('bx-say').innerHTML=h;B('bx-say').className='bx-say'+(good||st.won?'':(R.run?' warn':' bad'))}
  if(st.logDirty){st.logDirty=false;B('bx-log').innerHTML=st.log.length?'<b>📜 क्या-क्या हुआ</b><ul>'+st.log.map(x=>'<li>'+x+'</li>').join('')+'</ul>':''}
  while(st.flash.length){const id=st.flash.shift(),t=stages.querySelector('.bx-tile[data-i="'+id+'"]');if(t){t.classList.remove('boom');void t.offsetWidth;t.classList.add('boom')}}
}
/* ================= मीटर डॉक ================= */
const dock=document.createElement('div');dock.id='bx-dock';dock.className='bx-dock';
dock.innerHTML='<div class="bx-dhd"><b>🔧 एडवांस मल्टीमीटर · लाइव + पार्ट टेस्ट</b><span id="bx-dmini"></span><button type="button" id="bx-dtog" aria-label="मीटर छोटा/बड़ा करें">▾</button></div><div class="bx-dbody"><div class="bx-lcd" id="bx-lcd"><div class="bx-lm" id="bx-lm"></div><span class="bx-bz" id="bx-bz">🔔</span><div class="bx-lv" id="bx-lv">---</div><div class="bx-lh" id="bx-lh"></div></div>'
+'<div class="bx-knob" id="bx-knob"><svg viewBox="-30 -30 60 60" class="bx-kn"><circle r="26" fill="#2b2b2b" stroke="#000" stroke-width="2"/><circle r="20" fill="#3d3d3d"/><g id="bx-kp"><path d="M0 -4L3 -24L-3 -24Z" fill="#ffd24a"/></g></svg></div>'
+'<div class="bx-pr"><label>🔴 लाल<select id="bx-pr"></select></label><label>⚫ काली<select id="bx-pb"></select></label></div>'
+'<div class="bx-jacks"><span class="bx-jack r" id="bx-jr">VΩ</span><span class="bx-jack k" id="bx-jb">COM</span></div>'
+'<div class="bx-dact"><button type="button" id="bx-sw">⇄ अदला-बदली</button><button type="button" id="bx-dact1" hidden></button></div><div class="bx-nx" id="bx-nx"></div></div>';
document.body.appendChild(dock);
const leads=document.createElementNS('http://www.w3.org/2000/svg','svg');leads.id='bx-leads';leads.setAttribute('aria-hidden','true');
leads.innerHTML='<path id="bx-lr" fill="none" stroke="#e0262c" stroke-width="4" stroke-linecap="round"/><path id="bx-lb" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"/><circle id="bx-tr" r="6" fill="#e0262c" stroke="#fff" stroke-width="2"/><circle id="bx-tb" r="6" fill="#222" stroke="#fff" stroke-width="2"/>';
document.body.appendChild(leads);
const POS=[['off','OFF',-120],['dcv','V⎓',-80],['acv','V∼',-40],['ohm','Ω',0],['cont','🔔',40],['dio','▷|',80],['cap','⊣⊢',120],['curr','A',160],['freq','Hz',200]];
const knob=$('bx-knob');
POS.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='bx-kb';b.dataset.m=p[0];b.textContent=p[1];b.setAttribute('aria-label','मीटर मोड '+p[1]);
  const a=p[2]*Math.PI/180;b.style.left='calc(50% + '+(Math.sin(a)*92)+'px)';b.style.top=(66-Math.cos(a)*50)+'px';b.addEventListener('click',()=>setMode(p[0]));knob.appendChild(b)});
const opts=Object.keys(NODES).map(k=>'<option value="'+k+'">'+NODES[k]+'</option>').join('');
$('bx-pr').innerHTML=opts;$('bx-pb').innerHTML=opts;
$('bx-pr').addEventListener('change',e=>{st.pr=e.target.value;st.prEl=null;syncDock()});
$('bx-pb').addEventListener('change',e=>{st.pb=e.target.value;st.pbEl=null;syncDock()});
$('bx-sw').addEventListener('click',()=>{[st.pr,st.pb]=[st.pb,st.pr];[st.prEl,st.pbEl]=[st.pbEl,st.prEl];syncDock()});
$('bx-dtog').addEventListener('click',()=>openDock(!st.dock));
$('bx-dact1').addEventListener('click',()=>{const a=$('bx-dact1').dataset.a;if(a==='unplug'){st.plug=false;st.disch=true;X.log('सुरक्षा: प्लग निकाला, बल्क कैप 10kΩ से डिस्चार्ज हो रहा है।')}else if(a==='plug'){st.plug=true;st.disch=false}syncCtl();syncDock()});
function openDock(o){st.dock=o;dock.classList.toggle('min',!o);$('bx-dtog').textContent=o?'▾':'▴'}
function setMode(m){
  st.mode=m;
  if(X.OFFLINE.includes(m)&&st.plug){st.plug=false;st.disch=true;X.log('सुरक्षा: '+(m==='cap'?'कैपेसिटेंस':m==='dio'?'डायोड':m==='cont'?'कंटीन्युटी':'Ω')+' मोड के लिए प्लग अपने-आप निकाला और बल्क कैप डिस्चार्ज किया।');syncCtl()}
  else if(X.OFFLINE.includes(m)&&st.bulkV>5)st.disch=true;
  syncDock();
}
const benchTabButtons=Array.from(document.querySelectorAll('#bench [data-bx-tab]'));
let plugBeforeParts=null;
function activateBenchTab(button,focus){
  const target=button.dataset.bxTab;
  if(target==='bx-components'&&plugBeforeParts===null)plugBeforeParts=st.plug;
  if(target==='bx-running'&&plugBeforeParts!==null){if(plugBeforeParts&&!st.plug&&st.c.f1!=='open'){st.plug=true;st.disch=false;syncCtl();X.log('रनिंग टैब पर लौटे: प्लग फिर से लगा दिया गया।')}plugBeforeParts=null}
  benchTabButtons.forEach(tab=>{
    const selected=tab===button;
    tab.setAttribute('aria-selected',String(selected));
    tab.tabIndex=selected?0:-1;
    document.getElementById(tab.dataset.bxTab).hidden=!selected;
  });
  if(target==='bx-components'){
    if(activeTestPart){
      const step=testStepsFor(activeTestPart)[activeTestStep];
      setMode(step.mode);
    }else testPart(CM[st.sel]||CM.c1);
  }
  if(focus)button.focus();
}
benchTabButtons.forEach((button,index)=>{
  button.addEventListener('click',()=>activateBenchTab(button,false));
  button.addEventListener('keydown',event=>{
    let next=index;
    if(event.key==='ArrowRight')next=(index+1)%benchTabButtons.length;
    else if(event.key==='ArrowLeft')next=(index+benchTabButtons.length-1)%benchTabButtons.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=benchTabButtons.length-1;
    else return;
    event.preventDefault();
    activateBenchTab(benchTabButtons[next],true);
  });
});
function probe(n,el){
  const completedPair=st.next==='b';
  const domain=X.dom(n);
  if((domain==='a'&&st.plug)||(domain==='p'&&(st.plug||st.bulkV>5))){var hv=domain==='a'?st.ac:st.bulkV>5?st.bulkV:st.ac;window.dispatchEvent(new CustomEvent('smps:unsafe-hv-touch',{detail:{node:n,voltage:hv}}))}
  if(st.next==='r'){st.pr=n;st.prEl=el||null;st.next='b'}else{st.pb=n;st.pbEl=el||null;st.next='r'}
  if(st.mode==='off')setMode('dcv');openDock(true);syncDock();
  if(completedPair){
    const result=X.measure(X.analyze()),matches=COMPS.filter(function(item){return(item.a===st.pr&&item.b===st.pb)||(item.a===st.pb&&item.b===st.pr)}),component=matches.length===1?matches[0]:matches.find(function(item){return item.i===st.sel})||CM[st.sel];
    st.testHistory.unshift({time:new Date().toLocaleString(),part:component?component.s+' · '+component.n:st.sel,mode:MN[st.mode]||st.mode,red:NODES[st.pr]||st.pr,black:NODES[st.pb]||st.pb,reading:result.v||'OFF',note:result.h||''});
    if(st.testHistory.length>300)st.testHistory.pop();
  }
}
function syncDock(){
  $('bx-pr').value=st.pr;$('bx-pb').value=st.pb;
  const idx=POS.findIndex(p=>p[0]===st.mode);$('bx-kp').style.transform='rotate('+POS[idx][2]+'deg)';
  knob.querySelectorAll('.bx-kb').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===st.mode));
  $('bx-nx').textContent='अगला क्लिक: '+(st.next==='r'?'🔴 लाल प्रोब':'⚫ काली प्रोब')+' · पार्ट के पिन-चिप या कनेक्टर पर टैप करें';
  document.querySelectorAll('.bx-tp').forEach(e=>{e.classList.toggle('pr',e.dataset.n===st.pr);e.classList.toggle('pb',e.dataset.n===st.pb)});
}
const MN={off:'OFF',dcv:'DC वोल्ट',acv:'AC वोल्ट',ohm:'रेसिस्टेंस Ω',dio:'डायोड टेस्ट',cont:'कंटीन्युटी',cap:'कैपेसिटेंस'};
let lastB='';
function beep(){if(window.__smpsAudio)window.__smpsAudio.play('beep')}
const referenceCache={key:'',reading:null};
beep=function(){if(window.__smpsAudio)window.__smpsAudio.play('beep')};
function parseReading(text){
  const match=text.match(/(-?[\d.]+)\s*(mV|µF|nF|MΩ|kΩ|Ω|V)/);
  if(!match)return null;
  const unit=match[2],scale=unit==='mV'?.001:unit==='nF'?1e-9:unit==='kΩ'?1000:unit==='MΩ'?1e6:unit==='µF'?1e-6:1;
  return {value:Number(match[1])*scale,unit:unit==='mV'||unit==='V'?'V':unit==='Ω'||unit==='kΩ'||unit==='MΩ'?'Ω':unit==='µF'||unit==='nF'?'F':''};
}
function readingsMatch(actual,expected,c){
  if(actual.v==='OL'||expected.v==='OL')return actual.v===expected.v;
  const a=parseReading(actual.v),b=parseReading(expected.v);
  if(!a||!b||a.unit!==b.unit)return false;
  const tolerance=c.k==='cap'?0.3:['dio','sch','tl','led'].includes(c.k)?0.18:['fuse','wind','ind'].includes(c.k)?1:0.15;
  return Math.abs(a.value-b.value)<=Math.max(Math.abs(b.value)*tolerance,c.k==='cap'?1e-7:0.02);
}
function updatePartTest(R,current){
  const expectedEl=$('bx-expected-reading'),currentEl=$('bx-current-reading'),gradeEl=$('bx-reading-grade');
  if(!expectedEl||!currentEl||!gradeEl)return;
  const c=CM[st.sel];
  currentEl.textContent=current.v+(current.h?' · '+current.h:'');
  if(current.warn||current.v==='बिजली चालू'||current.v==='डिस्चार्ज…'){
    expectedEl.textContent=X.OFFLINE.includes(st.mode)?'प्लग निकालें और कैपेसिटर का डिस्चार्ज पूरा होने दें।':'—';
    gradeEl.textContent=current.h||'परीक्षण सुरक्षित रूप से पूरा नहीं हुआ।';
    gradeEl.className='bad';
    return;
  }
  const key=st.sel+'|'+st.mode+'|'+st.pr+'|'+st.pb+'|'+Object.keys(st.c).filter(id=>id!==st.sel).map(id=>id+st.c[id]).join('');
  if(referenceCache.key!==key&&st.bulkV<=5&&!st.plug&&X.OFFLINE.includes(st.mode)){
    const previous=st.c[c.i],wasPlugged=st.plug,bulk=st.bulkV;
    try{
      st.c[c.i]='ok';st.plug=false;st.bulkV=0;
      referenceCache.reading=X.measure(R);
      referenceCache.key=key;
    }finally{
      st.c[c.i]=previous;st.plug=wasPlugged;st.bulkV=bulk;
      X.measure(R);
    }
  }
  const reference=referenceCache.key===key?referenceCache.reading:null;
  if(!reference){
    expectedEl.textContent='सुरक्षित टेस्ट-पॉइंट तैयार होने की प्रतीक्षा…';
    gradeEl.textContent='चार्ज उतरने के बाद रीडिंग अपने-आप जाँची जाएगी।';
    gradeEl.className='';
    return;
  }
  expectedEl.textContent=reference.v+(reference.h?' · '+reference.h:'');
  if(st.myst){
    const pass=readingsMatch(current,reference,c);
    gradeEl.textContent=pass?'रीडिंग ठीक पार्ट के मान से मेल खाती है।':'रीडिंग ठीक पार्ट के मान से अलग है—पार्ट खराब हो सकता है।';
    gradeEl.className=pass?'good':'bad';
  }else if(st.c[c.i]==='ok'){
    const pass=readingsMatch(current,reference,c);
    gradeEl.textContent=pass?'ठीक · रीडिंग सामान्य सीमा में है।':'जाँचें · रीडिंग ठीक पार्ट की तुलना से अलग है।';
    gradeEl.className=pass?'good':'bad';
  }else{
    gradeEl.textContent='खराब · चुनी गई खराबी: '+(c.m[st.c[c.i]]||st.c[c.i])+'. रीडिंग को ठीक पार्ट के मान से तुलना करें।';
    gradeEl.className='bad';
  }
}
function updMeter(R){
  const o=X.measure(R);
  $('bx-lm').textContent=(MN[st.mode]||'')+'  ·  🔴 '+st.pr+'  ⚫ '+st.pb;
  $('bx-lv').textContent=o.off?'':o.v;$('bx-lh').textContent=o.h||'';
  $('bx-lcd').classList.toggle('warn',!!o.warn);$('bx-bz').classList.toggle('on',!!o.beep);
  $('bx-dmini').textContent=o.off?'OFF':o.v;
  const k=st.mode+st.pr+st.pb+o.beep;if(k!==lastB){lastB=k;if(o.beep)beep()}
  updatePartTest(R,o);
  const b=$('bx-dact1');
  if(o.need==='unplug'){b.hidden=false;b.dataset.a='unplug';b.textContent='🔌 प्लग निकालो + डिस्चार्ज'}
  else if((st.mode==='dcv'||st.mode==='acv')&&!st.plug&&st.c.f1!=='open'){b.hidden=false;b.dataset.a='plug';b.textContent='🔌 प्लग लगाओ'}
  else b.hidden=true;
}
/* प्रोब की तारें (डॉक से टेस्ट बिंदु तक) */
function findTP(n,pref){
  if(pref&&pref.isConnected)return pref;
  let best=null,bd=1e9;const mid=innerHeight/2;
  document.querySelectorAll('#bench .bx-tp[data-n="'+n+'"]').forEach(e=>{const r=e.getBoundingClientRect();const d=Math.abs((r.top+r.bottom)/2-mid);if(d<bd){bd=d;best=e}});
  return best;
}
function drawLeads(){
  const vis=benchVisible&&!dock.classList.contains('hide')&&!dock.classList.contains('min');
  leads.style.display=vis?'block':'none';if(!vis)return;
  const W=innerWidth,H=innerHeight;leads.setAttribute('viewBox','0 0 '+W+' '+H);leads.setAttribute('width',W);leads.setAttribute('height',H);
  const one=(n,pref,jack,path,tip)=>{
    const t=findTP(n,pref),j=$(jack).getBoundingClientRect();if(!t){$(path).setAttribute('d','');$(tip).setAttribute('r',0);return}
    const r=t.getBoundingClientRect();let x=r.left+r.width/2,y=r.top+r.height/2;const off=y<0||y>H;
    if(off){$(path).setAttribute('d','');$(tip).setAttribute('r',0);return}const jx=j.left+j.width/2,jy=j.top+j.height/2;
    $(path).setAttribute('d','M'+jx+' '+jy+' C'+jx+' '+(jy-70)+' '+x+' '+(y+80)+' '+x+' '+y);
    $(tip).setAttribute('cx',x);$(tip).setAttribute('cy',y);$(tip).setAttribute('r',6);
  };
  one(st.pr,st.prEl,'bx-jr','bx-lr','bx-tr');one(st.pb,st.pbEl,'bx-jb','bx-lb','bx-tb');
}
let benchVisible=false;
function updateBenchVisibility(){
  const r=$('bench').getBoundingClientRect();
  benchVisible=r.bottom>0&&r.top<innerHeight;
  dock.classList.toggle('hide',!benchVisible);
}
window.addEventListener('scroll',updateBenchVisibility,{passive:true});
window.addEventListener('resize',updateBenchVisibility);
updateBenchVisibility();
/* ================= पावर-फ़्लो एनिमेशन ================= */
const pc=$('bx-pipe'),px=pc.getContext?pc.getContext('2d'):null;
const PS=[['AC + फ़िल्टर','F1 · MOV · XC · NTC','ac'],['ब्रिज','D1–D4','rect'],['बल्क C1','~300V DC','bulk'],['PWM + Q1 + T1','स्विचिंग','pulse'],['सेकेंडरी','D · L · C','sec'],['रेल','12 · 5 · 3.3V','rail']];
const STAGE_COMPS=[['f1','mov','xc','ntc'],['d1','d2','d3','d4'],['c1','rbl'],['rst','cvcc','daux','ic1','rg','rgs','rcs','q1','t1p','dsn','rsn','csn'],['t1s12','d12','c2a','l1','c2b','rdum','t1s5','d5','c5a','l2','c5b','q33','c33','dsb','csb','rled','opto','tl','rup','rdn'],[]];
let tAnim=0;
function waveY(kind,t,R,bh){
  const ph=x=>((x%1)+1)%1;
  switch(kind){
  case 'ac':return Math.sin(PI2*st.hz*t)*(R.ac.L>0?1:0);
  case 'rect':return R.flow?Math.abs(Math.sin(PI2*st.hz*t))*1.6-.8:-.8;
  case 'bulk':{if(!R.flow)return -.8;const f=R.half?st.hz:2*st.hz,p=ph(t*f),amp=Math.min(R.vpp/Math.max(R.vmax,1)*6,1.3);return .6-amp*Math.pow(p,.85)}
  case 'pulse':{if(!R.sw)return -.8;const p=ph(t*st.fsw*0+t*1);return p<.34?.9:-.8}
  case 'sec':return R.run?(ph(t)<.34?.9:-.2):-.8;
  default:return R.run&&st.ps?.4+Math.sin(PI2*6*t)*Math.min(R.rip12/500,.4):-.8;
  }
}
function drawPipe(R,dt){
  if(!px)return;
  tAnim+=dt;const dpr=window.devicePixelRatio||1,W=pc.clientWidth||600,narrow=W<560,H=narrow?286:166;
  if(pc.width!==Math.round(W*dpr)||pc.height!==Math.round(H*dpr)){pc.width=Math.round(W*dpr);pc.height=Math.round(H*dpr);pc.style.height=H+'px'}
  px.setTransform(dpr,0,0,dpr,0,0);px.clearRect(0,0,W,H);
  const g=px.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0b1712');g.addColorStop(1,'#08110d');px.fillStyle=g;px.fillRect(0,0,W,H);
  px.strokeStyle='rgba(80,160,120,.07)';px.lineWidth=1;for(let x=0;x<W;x+=24){px.beginPath();px.moveTo(x,0);px.lineTo(x,H);px.stroke()}for(let y=0;y<H;y+=24){px.beginPath();px.moveTo(0,y);px.lineTo(W,y);px.stroke()}
  const cols=narrow?3:6,bw=Math.min(104,W/cols-16),bh=narrow?104:116;
  const pos=PS.map((_,i)=>{const row=narrow?Math.floor(i/3):0;let col=narrow?(row?2-(i%3):i%3):i;return {x:(W/cols)*(col+.5),y:narrow?(row?H*.75:H*.27):H/2}});
  const flows=[R.ac.R>40,R.flow,R.sw,R.run,R.run&&st.ps,R.main];
  const bad=PS.map((_,i)=>st.myst?false:STAGE_COMPS[i].some(id=>st.c[id]!=='ok'));
  /* पाइप */
  for(let i=0;i<5;i++){
    const a=pos[i],b=pos[i+1],on=flows[i],sec=i>=3;
    px.lineWidth=5;px.strokeStyle='rgba(120,140,130,.25)';px.beginPath();px.moveTo(a.x,a.y);px.lineTo(b.x,b.y);px.stroke();
    if(on){
      const col=sec?'#4fd1ff':'#ffb347',sp=.25+Math.min(st.w,500)/500*.9,n=7;
      px.fillStyle=col;px.shadowColor=col;px.shadowBlur=9;
      for(let k=0;k<n;k++){const u=((tAnim*sp+k/n)%1),x=a.x+(b.x-a.x)*u,y=a.y+(b.y-a.y)*u;px.beginPath();px.arc(x,y,3,0,PI2);px.fill()}
      px.shadowBlur=0;
    }else{px.fillStyle='#7a2a2a';const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;px.font='bold 14px sans-serif';px.textAlign='center';px.fillText(flows[i-1]||i===0?'✖':'✖',mx,my+5)}
  }
  /* स्टेज बॉक्स */
  PS.forEach((p,i)=>{
    const c=pos[i],x=c.x-bw/2,y=c.y-bh/2;
    let glow=null;if(i===3){const t=Math.max(0,Math.min(1,(st.temp-55)/95));if(t>0)glow='rgba(255,'+Math.round(140-100*t)+',30,'+(.25+.55*t)+')'}
    if(bad[i])glow='rgba(255,70,70,.65)';
    px.shadowColor=glow||'transparent';px.shadowBlur=glow?18:0;
    px.fillStyle='#10241b';px.strokeStyle=bad[i]?'#ff5a4f':(flows[i]||i===0&&R.ac.L>0?'#3dd68c':'#4a5a52');px.lineWidth=2;
    px.beginPath();px.roundRect?px.roundRect(x,y,bw,bh,10):px.rect(x,y,bw,bh);px.fill();px.stroke();px.shadowBlur=0;
    px.fillStyle='#d6f5e6';px.font='bold 11.5px sans-serif';px.textAlign='center';px.fillText(p[0],c.x,y+16);
    px.fillStyle='#7fae98';px.font='9.5px sans-serif';px.fillText(p[1],c.x,y+bh-7);
    /* मिनी वेव */
    const wx=x+8,ww=bw-16,wy=y+22,wh=bh-56;px.strokeStyle='#6dff9a';px.lineWidth=1.8;px.beginPath();
    for(let k=0;k<=40;k++){const t=tAnim*.12+k/40*.04*(p[2]==='pulse'?.35:1),v=waveY(p[2]==='pulse'?'pulse':p[2],p[2]==='pulse'?k/40*3:t*(p[2]==='sec'?25:1),R,wh);const yy=wy+wh/2-v*wh/2.2;k?px.lineTo(wx+ww*k/40,yy):px.moveTo(wx,yy)}px.stroke();
    if(bad[i]){px.fillStyle='#ff6b5e';px.font='bold 13px sans-serif';px.fillText('✖',x+bw-12,y+16)}
    /* मान */
    px.fillStyle='#ffe28a';px.font='bold 10.5px sans-serif';
    const v=[R.ac.L>0?st.ac+'V ~':'0V',R.flow?(st.bulkV.toFixed(0)+'V'):'0V',R.flow?(st.bulkV.toFixed(0)+'V'):'0V',st.temp.toFixed(0)+'°C',R.run?'ON':'OFF',R.main?R.v12.toFixed(1)+'/'+R.v5.toFixed(1)+'/'+R.v33.toFixed(1):R.vsb>0?'SB '+R.vsb.toFixed(1):'0'][i];
    px.textAlign='center';px.fillText(v,c.x,y+bh-22);
  });
}
/* ================= स्कोप ================= */
const sc=$('bx-scope'),sx=sc.getContext?sc.getContext('2d'):null;let t0=0;
function wf(n,t,R){
  const D=R.dc,ph=x=>((x%1)+1)%1;
  switch(n){
  case 'L':return R.ac.L*1.414*Math.sin(PI2*st.hz*t);case 'F':return R.ac.F*1.414*Math.sin(PI2*st.hz*t);case 'R':return R.ac.R*1.414*Math.sin(PI2*st.hz*t);
  case 'N':case 'BN':case 'SG':return 0;
  case 'BP':{if(!R.run)return D.BP;const f=R.half?st.hz:2*st.hz;return R.vmax-R.vpp*Math.pow(ph(t*f),.85)}
  case 'D':{if(!R.run)return D.D;const p=ph(t*st.fsw*1000);return p<.32?.6:R.vavg+70*Math.exp(-(p-.32)*30)*Math.sin((p-.32)*70)}
  case 'SN':{if(!R.run)return D.SN;const p=ph(t*st.fsw*1000);return R.vavg+35+(p<.4?25*Math.exp(-p*20):0)}
  case 'CS':{if(!R.run)return 0;const p=ph(t*st.fsw*1000);return p<.32?.05+.6*p/.32:0}
  case 'G':case 'OUT':{if(!R.run)return 0;return ph(t*st.fsw*1000)<.32?12:0}
  case 'T2':case 'T5':{if(!R.main)return 0;const p=ph(t*st.fsw*1000);return p<.32?D[n]/.32:-4}
  case 'AUX':{if(!R.run)return 0;const p=ph(t*st.fsw*1000);return p<.32?40:-8}
  default:{const v=D[n];if(!v)return 0;const r=((n==='V5'||n==='V5p'||n==='V33')?R.rip5:R.rip12)/1000;return v+r*.35*Math.sin(PI2*100*t)+r*.2*Math.sin(PI2*1700*t+1)}
  }
}
let scopePaused=false,scopeZoom=1;
window.__bxScopeControl={
  pause:function(value){scopePaused=!!value},
  zoom:function(value){scopeZoom=Math.max(1,Math.min(8,value));return scopeZoom}
};
function drawScope(R,dt){
  if(!sx||scopePaused)return;const W=sc.width,H=sc.height,a=st.pr,b=st.pb;
  const fast=['D','SN','CS','G','OUT','T2','T5','AUX'].includes(a),span=(fast?60e-6:.04)/scopeZoom;t0+=span*.25*dt;
  sx.fillStyle='rgba(6,18,12,.42)';sx.fillRect(0,0,W,H);sx.strokeStyle='#17402c';sx.lineWidth=1;
  for(let i=0;i<=10;i++){sx.beginPath();sx.moveTo(i*W/10,0);sx.lineTo(i*W/10,H);sx.stroke()}for(let j=0;j<=8;j++){sx.beginPath();sx.moveTo(0,j*H/8);sx.lineTo(W,j*H/8);sx.stroke()}
  const diff=X.dom(a)===X.dom(b)&&!['BN','SG','N'].includes(b),ys=[];let mn=1e9,mx=-1e9;
  for(let i=0;i<=380;i++){const t=t0+span*i/380;const v=wf(a,t,R)-(diff?wf(b,t,R):0);ys.push(v);if(v<mn)mn=v;if(v>mx)mx=v}
  let rg=mx-mn;if(rg<1e-6){mn=mx-.5;mx=mx+.5;rg=1}const pd=rg*.18,lo=mn-pd,hi=mx+pd,sy=v=>H-(v-lo)/(hi-lo)*H;
  if(lo<0&&hi>0){sx.strokeStyle='#2f7a55';sx.setLineDash([5,5]);sx.beginPath();sx.moveTo(0,sy(0));sx.lineTo(W,sy(0));sx.stroke();sx.setLineDash([])}
  sx.strokeStyle='#6dff9a';sx.lineWidth=2.2;sx.shadowColor='#6dff9a';sx.shadowBlur=6;sx.beginPath();ys.forEach((v,i)=>{const x=i*W/380,y=sy(v);i?sx.lineTo(x,y):sx.moveTo(x,y)});sx.stroke();sx.shadowBlur=0;
  sx.fillStyle='#9dffc6';sx.font='12px monospace';sx.fillText('max '+mx.toFixed(Math.abs(mx)<10?3:1)+' V',8,16);sx.fillText('min '+mn.toFixed(Math.abs(mn)<10?3:1)+' V',8,H-8);sx.fillText(fast?'6 µs/div':'4 ms/div',W-84,H-8);
  const instant=wf(a,t0,R)-(diff?wf(b,t0,R):0);
  $('bx-scn').textContent='लाल प्रोब: '+(NODES[a]||a)+(diff?' − '+(NODES[b]||b):'')+' · रीडिंग '+instant.toFixed(Math.abs(instant)<10?3:1)+' V · '+(fast?'6 µs/div':'4 ms/div')+' · '+scopeZoom+'×';
}
/* ================= स्टेप गाइड ================= */
const GD={
nout:{t:'🔍 कोई आउटपुट नहीं: सामान्य खोज',s:[
 ['AC आ रहा है या नहीं: AC वोल्ट, लाल L, काली N। लगभग 230V चाहिए।',{plug:true,m:'acv',pr:'L',pb:'N',sel:'f1'}],
 ['NTC के बाद भी देखें: लाल R, काली N। 0V आए तो फ़्यूज़ या NTC खराब।',{m:'acv',pr:'R',pb:'N',sel:'ntc'}],
 ['बल्क पर DC: लाल BP, काली BN। लगभग 300V चाहिए। 0V हो तो ब्रिज (D1–D4) या C1 देखें।',{m:'dcv',pr:'BP',pb:'BN',sel:'c1'}],
 ['300V है तो IC की सप्लाई: लाल VCC, काली BN। 15V = IC चल रहा है। 0V हो तो R1 खुला।',{m:'dcv',pr:'VCC',pb:'BN',sel:'rst'}],
 ['VCC भी ठीक है पर आउटपुट नहीं? 12V रेल देखें: लाल +12V, काली SG।',{m:'dcv',pr:'V12',pb:'SG',sel:'d12'}],
 ['12V कॉइल से पहले (V12p) और बाद में (V12) देखें। पहले है, बाद में नहीं तो L1 टूटी।',{m:'dcv',pr:'V12p',pb:'SG',sel:'l1'}],
 ['PS_ON देखें: हरा तार GND से जुड़ा हो तो 0V, खुला हो तो लगभग 5V।',{m:'dcv',pr:'PSON',pb:'SG'}]]},
ov:{t:'⚡ ओवरवोल्टेज / स्पाइक के बाद: कौन सा पार्ट गया?',s:[
 ['पहले सुरक्षा: प्लग निकालें और बल्क कैप डिस्चार्ज करें।',{plug:false,disch:true}],
 ['फ़्यूज़ जाँचें: कंटीन्युटी, लाल L, काली F। बजर नहीं बोला = उड़ा।',{m:'cont',pr:'L',pb:'F',sel:'f1'}],
 ['MOV जाँचें: Ω मोड, लाल F, काली N। जला MOV लगभग 0Ω देता है, ठीक में OL।',{m:'ohm',pr:'F',pb:'N',sel:'mov'}],
 ['ब्रिज का पहला डायोड: डायोड मोड, लाल R, काली BP। लगभग 0.55V ठीक, 0V = शॉर्ट। चारों जाँचें।',{m:'dio',pr:'R',pb:'BP',sel:'d1'}],
 ['बल्क कैप: कैपेसिटेंस मोड, BP और BN। 0 = शॉर्ट, 100µF से कम = सूखा।',{m:'cap',pr:'BP',pb:'BN',sel:'c1'}],
 ['MOSFET: कंटीन्युटी, लाल CS, काली D। बजर बजे तो D–S शॉर्ट। फिर R5, U1, R3 भी जाँचें।',{m:'cont',pr:'CS',pb:'D',sel:'q1'}],
 ['सारे खराब पार्ट, फ़्यूज़ और MOV बदलकर 230V पर चलाएँ।',{plug:false,ac:230}]]},
ol:{t:'🔥 ओवरलोड और गर्म MOSFET',s:[
 ['150W पर सामान्य चलाएँ। Q1 का तापमान और रेल देखें।',{plug:true,w:150,m:'dcv',pr:'V12',pb:'SG',sel:'q1'}],
 ['लोड 450W (रेटिंग) करें: 12V थोड़ा झुकेगा, Q1 गरम होगा।',{w:450}],
 ['रिपल देखें: AC वोल्ट, लाल +12V, काली SG। बढ़ा हो तो C5, C6 जाँचें।',{w:450,m:'acv',pr:'V12',pb:'SG',sel:'c2b'}],
 ['लोड 560W करें: OCP ट्रिप, क्लिक-क्लिक (हिकअप)।',{w:560}],
 ['अब R5 (करंट-सेंस) को शॉर्ट करके 520W करें। OCP अंधी है, Q1 जल जाएगा।',{w:520,sel:'rcs'}],
 ['150W पर लौटें।',{w:150}]]},
fs:{t:'🌀 स्विचिंग फ़्रीक्वेंसी बदलने पर',s:[
 ['65kHz पर ड्रेन का वेवफ़ॉर्म देखें: लाल D। स्कोप 6µs/div।',{plug:true,fsw:65,m:'dcv',pr:'D',pb:'BN',sel:'q1'}],
 ['130kHz करें: Q1 और शॉटकी ज़्यादा गरम, रेल थोड़ी झुकेगी।',{fsw:130}],
 ['35kHz करें: कोर सैचुरेट होने लगता है, Q1 पर पीक बढ़ता है। 33kHz के नीचे Q1 जलेगा।',{fsw:35,sel:'t1p'}],
 ['65kHz पर वापस।',{fsw:65}]]},
hz:{t:'〰 मेन्स Hz बदलना',s:[
 ['50Hz पर बल्क रिपल: AC वोल्ट, लाल BP, काली BN।',{plug:true,hz:50,m:'acv',pr:'BP',pb:'BN',sel:'c1'}],
 ['40Hz: रिपल बढ़ता है।',{hz:40}],['65Hz: रिपल घटता है, रेल लगभग वैसी ही।',{hz:65}],
 ['निष्कर्ष: Hz खुद कम नुकसान करता है; जनरेटर में वोल्टेज उछाल असली ख़तरा है।',{hz:50}]]}
};
const gsel=$('bx-gsel'),gl=$('bx-gl');
gsel.innerHTML=Object.keys(GD).map(k=>'<option value="'+k+'">'+GD[k].t+'</option>').join('');
function act(a){
  if('plug' in a){st.plug=a.plug;if(a.plug)st.disch=false}
  if(a.disch&&!st.plug)st.disch=true;
  if(a.m)st.mode=a.m;if(a.pr){st.pr=a.pr;st.prEl=null}if(a.pb){st.pb=a.pb;st.pbEl=null}
  ['ac','w','fsw','hz'].forEach(k=>{if(k in a){st[k]=a[k];$({ac:'bx-ac',w:'bx-w',fsw:'bx-fs',hz:'bx-hz'}[k]).value=a[k]}});
  if(a.m&&X.OFFLINE.includes(a.m)&&st.plug){st.plug=false;st.disch=true}
  if(a.sel)selComp(a.sel,false);openDock(true);syncCtl();syncDock();
}
function renderGuide(){
  const g=GD[gsel.value];gl.innerHTML='';
  g.s.forEach(s=>{const li=document.createElement('li');li.innerHTML='<span>'+s[0]+'</span> ';
    const b=document.createElement('button');b.type='button';b.className='chip';b.textContent='▶ यह सेटिंग लगाओ';
    b.addEventListener('click',()=>{act(s[1]);li.classList.add('done');b.textContent='✔ लग गई'});li.appendChild(b);gl.appendChild(li)});
}
gsel.addEventListener('change',renderGuide);renderGuide();
/* ================= सिम्युलेटर के पास वाले मिनी मीटर (लाइव सर्किट, वेवफ़ॉर्म सिम्युलेटर) ================= */
function mini(anchor,pos,pts,note,defR,defB){
  if(!anchor)return;
  const el=document.createElement('div');el.className='dmm mini';
  el.innerHTML='<h3>🔧 मल्टीमीटर: इसी सिम्युलेटर पर लाइव जाँच</h3><div class="scr"><div class="mm"></div><div class="vv">---</div><div class="hh"></div></div><div class="dial" style="grid-template-columns:1fr 1fr"><button type="button" data-m="dcv" aria-pressed="true">V⎓ DC वोल्ट</button><button type="button" data-m="acv" aria-pressed="false">V∼ AC / रिपल</button></div><div class="pr"><label>🔴 लाल प्रोब<select class="r"></select></label><label>⚫ काली प्रोब<select class="k"></select></label></div><div class="nx">'+note+'</div><div class="row" style="margin-top:8px"><button type="button" class="go">पार्ट जाँच (Ω, डायोड, कैप), शॉर्ट/ओपन करके देखना और स्टेप गाइड: एडवांस टेस्ट बेंच खोलें</button></div>';
  anchor.insertAdjacentElement(pos,el);
  const r=el.querySelector('.r'),k=el.querySelector('.k'),op=pts.map(p=>'<option value="'+p.k+'">'+p.n+'</option>').join('');
  r.innerHTML=op;k.innerHTML=op;r.value=defR;k.value=defB;let mode='dcv';
  el.querySelectorAll('.dial button').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.m;el.querySelectorAll('.dial button').forEach(x=>x.setAttribute('aria-pressed',x===b))}));
  el.querySelector('.go').addEventListener('click',()=>$('bench').scrollIntoView({behavior:'smooth'}));
  const val=p=>{if(p.k==='GND')return 0;const e=document.getElementById(p.e);if(!e)return null;const m=e.textContent.match(/(-?[\d.]+)\s*(mV|V)/);return m?parseFloat(m[1])*(m[2]==='mV'?.001:1):null};
  const fm=v=>Math.abs(v)<1?(v*1000).toFixed(1)+' mV':Math.abs(v)>=100?v.toFixed(1)+' V':v.toFixed(3)+' V';
  setInterval(()=>{
    const a=pts.find(p=>p.k===r.value),b=pts.find(p=>p.k===k.value);let v='---',h='';const va=val(a),vb=val(b);
    if(a===b){v='0.000 V';h='दोनों प्रोब एक ही बिंदु पर हैं।'}
    else if(va===null||vb===null){v='---';h='रीडिंग अभी उपलब्ध नहीं।'}
    else if(mode==='dcv'){if(a.ac||b.ac){v='0.000 V';h='यह AC या रिपल सिग्नल है, AC मोड लगाएँ।'}else v=fm(va-vb)}
    else{if(a.ac||b.ac){v=fm(a.ac?va:vb);h=a.ac&&b.ac?'दो AC बिंदु: अलग रीडिंग नहीं बनती।':'AC वोल्ट मोड: सिग्नल का RMS/रिपल मान।'}else{v='0.000 V';h='DC बिंदु पर AC नहीं होता (रिपल वाला बिंदु चुनें)।'}}
    el.querySelector('.vv').textContent=v;el.querySelector('.hh').textContent=h;el.querySelector('.mm').textContent=(mode==='dcv'?'DC वोल्ट':'AC वोल्ट')+'  ·  🔴 '+a.k+'  ⚫ '+b.k;
  },250);
}
mini($('lcd'),'afterend',[{k:'AC',n:'AC इनपुट (L–N)',e:'m-ac',ac:true},{k:'BULK',n:'बल्क कैप +',e:'m-vc'},{k:'12V',n:'+12V रेल',e:'m-12'},{k:'5V',n:'+5V रेल',e:'m-5'},{k:'3.3V',n:'+3.3V रेल',e:'m-33'},{k:'5VSB',n:'5VSB',e:'m-sb'},{k:'RIPPLE',n:'12V रिपल',e:'m-rip',ac:true},{k:'GND',n:'GND (0V)'}],'ऊपर के सर्किट के साथ चलता है। खराबी चुनें और रीडिंग बदलती देखें।','12V','GND');
if($('simc'))mini($('simc'),'beforebegin',[{k:'AC',n:'AC इनपुट',e:'o-ac',ac:true},{k:'BULK',n:'बल्क कैप DC (औसत)',e:'r-vdc'},{k:'BRIPPLE',n:'बल्क रिपल',e:'r-rip',ac:true},{k:'12V',n:'आउटपुट 12V रेल',e:'r-vo'},{k:'ORIPPLE',n:'आउटपुट रिपल',e:'r-or',ac:true},{k:'GND',n:'GND (0V)'}],'स्लाइडर बदलें और रीडिंग देखें।','BULK','GND');
/* ================= मुख्य लूप ================= */
let last=performance.now();
function frame(now){
  const dt=Math.min(.1,(now-last)/1000);last=now;
  let R=X.analyze();X.step(R,dt);R=X.analyze();
  updTiles();updUI(R);if(benchVisible){updMeter(R);drawPipe(R,dt);drawScope(R,dt);drawLeads()}
  requestAnimationFrame(frame);
}
selComp('c1',false);syncCtl();syncDock();openDock(innerWidth>=700);
X.log('खुला मोड: किसी भी पार्ट पर क्लिक करें, उसे शॉर्ट/ओपन/कमज़ोर करके असर देखें, फिर मीटर से जाँचें।');
window.addEventListener('resize',()=>{});
requestAnimationFrame(frame);
})();
