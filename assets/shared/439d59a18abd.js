
(function(){
'use strict';
function $(id){return document.getElementById(id)}
function TL(hi,en){return '<span data-lang="hi">'+hi+'</span><span data-lang="en" hidden>'+en+'</span>'}
function apply(el){try{if(window.__applyLang&&el)window.__applyLang(el)}catch(e){}}
function play(k){try{if(window.__smpsAudio)window.__smpsAudio.play(k)}catch(e){}}
function ok(lo,hi,x){return x>=lo&&x<=hi}
function pk(x,v){return (typeof x==='string')?x:x[v]}

/* ---------- 1. होम हीरो बैनर ---------- */
(function(){
  var box=$('v5-hero');if(!box)return;
  var slides=[].slice.call(box.querySelectorAll('.v5-slide'));
  var dots=[].slice.call(box.querySelectorAll('[data-hs]'));
  var cnt=$('v5-hero-count'),i=0,timer=null;
  function go(n){
    i=(n+slides.length)%slides.length;
    slides.forEach(function(s,k){s.classList.toggle('on',k===i)});
    dots.forEach(function(d,k){d.setAttribute('aria-current',k===i?'true':'false')});
    if(cnt)cnt.textContent='0'+(i+1)+' / 0'+slides.length;
  }
  function start(){stop();if(!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))timer=setInterval(function(){go(i+1)},4500)}
  function stop(){if(timer){clearInterval(timer);timer=null}}
  box.addEventListener('click',function(e){
    var t=e.target.closest('[data-hs],[data-hprev],[data-hnext]');if(!t)return;
    if(t.hasAttribute('data-hs'))go(+t.getAttribute('data-hs'));
    else go(i+(t.hasAttribute('data-hnext')?1:-1));
    start();
  });
  box.addEventListener('mouseenter',stop);box.addEventListener('mouseleave',start);
  box.addEventListener('focusin',stop);box.addEventListener('focusout',start);
  go(0);start();
})();

/* ---------- 2. 110V बनाम 230V रेगुलेशन ---------- */
var RG={v:230,smps:'pfc',sw:'115'};
function rgCalc(){
  var v=RG.v,load=300,o={};
  var bl=RG.smps==='manual'&&RG.sw==='115'&&v>160;
  var br=RG.smps==='manual'&&RG.sw==='230'&&v<160;
  o.bl=bl;o.br=br;o.st=bl?'BLOWN':br?'BROWNOUT':'STABLE';
  o.bulk=0;o.duty=0;o.cur=0;o.eff=88;o.r12=12.04;o.r5=5.02;o.r33=3.31;
  if(RG.smps==='pfc'){
    o.bulk=385;o.eff=v>=200?88.5:85.2;o.cur=load/(v*0.98*o.eff/100);
    o.duty=Math.min(48,Math.max(15,Math.round((380/385)*(230/v)*22)));
    o.r12=12.02;o.r5=5.01;o.r33=3.3;
  } else if(bl){
    o.bulk=Math.round(v*1.414*2);o.eff=0;o.r12=0;o.r5=0;o.r33=0;
  } else if(br){
    o.bulk=Math.round(v*1.414);o.duty=50;o.eff=78;o.cur=load/(v*0.65*0.78);
    o.r12=Math.round(o.bulk/325*12*0.75*10)/10;
    o.r5=Math.round(o.bulk/325*5*0.78*10)/10;
    o.r33=Math.round(o.bulk/325*3.3*0.8*10)/10;
  } else if(RG.sw==='115'){
    o.bulk=Math.round(v*1.414*2);o.eff=83;o.cur=load/(v*0.68*0.83);o.duty=26;o.r12=12.01;o.r5=5.02;o.r33=3.31;
  } else {
    o.bulk=Math.round(v*1.414);o.eff=86;o.cur=load/(v*0.72*0.86);o.duty=24;o.r12=12.04;o.r5=5.01;o.r33=3.3;
  }
  if(bl){o.cur=0;o.duty=0}
  return o;
}
function rgRender(){
  var box=$('v5-reg');if(!box)return;
  var o=rgCalc(),v=RG.v,hz=v<160?60:50;
  [].forEach.call(box.querySelectorAll('[data-v5-v]'),function(b){
    b.setAttribute('aria-pressed',String(Math.abs(v-(+b.getAttribute('data-v5-v')))<5));
  });
  [].forEach.call(box.querySelectorAll('[data-v5-smps]'),function(b){
    b.setAttribute('aria-pressed',String(b.getAttribute('data-v5-smps')===RG.smps));
  });
  $('v5-reg-slider').value=v;
  $('v5-reg-out').textContent=v+' V AC · '+hz+' Hz';

  $('v5-reg-sw').innerHTML=RG.smps==='manual'
    ?'<div class="v5-row"><span class="v5-lbl" style="margin:0">'+TL('SMPS के पीछे का लाल स्विच:','Red switch on the SMPS back panel:')+'</span>'
      +'<button class="v5-btn" type="button" data-v5-sw="115" aria-pressed="'+(RG.sw==='115')+'">115V</button>'
      +'<button class="v5-btn" type="button" data-v5-sw="230" aria-pressed="'+(RG.sw==='230')+'">230V</button></div>'
    :'<div class="v5-box" style="margin:8px 0">'+TL('एक्टिव PFC बूस्ट इनपुट को खुद पहचानकर लगभग 385V DC बनाता है। स्विच की ज़रूरत नहीं।','Active PFC boost senses the input by itself and makes about 385 V DC. No switch is needed.')+'</div>';

  var st=$('v5-reg-status'),cls=o.bl?'bad':o.br?'warn':'good',h='';
  if(o.bl){
    h='<strong>'+TL('💥 ओवरवोल्टेज ट्रिप / धमाके का खतरा (OVP)','💥 Overvoltage trip / risk of blow-out (OVP)')+'</strong>'
     +'<p>'+TL('इनपुट लगभग 230V है, पर स्विच 115V पर है। डबलर बल्क को लगभग 650V DC तक ले जाता है। इनपुट कैपेसिटर फट सकते हैं और मेन फ्यूज उड़ सकता है।','Input is about 230 V but the switch is on 115 V. The doubler pushes the bulk to about 650 V DC. Input capacitors can burst and the mains fuse can blow.')+'</p>'
     +'<div class="v5-row"><button class="v5-btn" type="button" data-v5-sw="230" aria-pressed="false">'+TL('स्विच 230V पर करें →','Set switch to 230 V →')+'</button></div>';
  } else if(o.br){
    h='<strong>'+TL('⚠️ अंडर-वोल्टेज ब्राउनआउट (UVP)','⚠️ Under-voltage brownout (UVP)')+'</strong>'
     +'<p>'+TL('110V इनपुट पर स्विच 230V पर है। कैपेसिटर पर केवल लगभग 155V DC बनता है। PWM 50% पर अटक जाता है और लोड पड़ने पर रेलें बहुत नीचे गिर जाती हैं।','With 110 V input the switch is on 230 V. The capacitor gets only about 155 V DC. PWM gets stuck at 50% and under load the rails sag a lot.')+'</p>'
     +'<div class="v5-row"><button class="v5-btn" type="button" data-v5-sw="115" aria-pressed="false">'+TL('स्विच 115V पर करें →','Set switch to 115 V →')+'</button></div>';
  } else {
    h='<strong>'+TL('✅ स्थिर: सभी रेल टॉलरेंस के अंदर हैं।','✅ Stable: all rails are inside tolerance.')+'</strong>';
  }
  st.className='v5-st '+cls;st.innerHTML=h;

  var g=[
    {c:o.bl?'bad':'',t:TL('इनपुट करंट (I_in)','Input current (I_in)'),v:o.bl?'0.00 A':o.cur.toFixed(2)+' A',
     s:v<=120?TL('110V पर वही 300W देने के लिए करंट लगभग दोगुना खिंचता है।','At 110 V the same 300 W draws about double the current.'):TL('230V पर करंट लगभग आधा, इसलिए तार में गर्मी कम।','At 230 V the current is about half, so less heat in the wires.')},
    {c:o.bl?'bad':o.br?'warn':'',t:TL('प्राइमरी बल्क DC','Primary bulk DC'),v:o.bulk+' V DC',
     s:RG.smps==='pfc'?TL('PFC बूस्ट: हमेशा लगभग 385V DC स्थिर।','PFC boost: always about 385 V DC.'):RG.sw==='115'?TL('वोल्टेज डबलर: 110V × 1.414 × 2 ≈ 311V।','Voltage doubler: 110 V × 1.414 × 2 ≈ 311 V.'):TL('ब्रिज रेक्टिफायर: 230V × 1.414 ≈ 325V।','Bridge rectifier: 230 V × 1.414 ≈ 325 V.')},
    {c:o.bl?'bad':'',t:TL('PWM ड्यूटी साइकिल (D)','PWM duty cycle (D)'),v:o.duty+' %',bar:Math.min(100,o.duty*2),
     s:o.duty>40?TL('हाई पल्स चौड़ाई: कम वोल्टेज की भरपाई के लिए गेट पल्स चौड़ी।','High pulse width: the gate pulse is wide to make up for low voltage.'):TL('लो पल्स चौड़ाई: ज़्यादा वोल्टेज पर गेट पल्स संकरी।','Low pulse width: at higher voltage the gate pulse is narrow.')},
    {c:o.bl?'bad':'',t:TL('दक्षता (Efficiency)','Efficiency'),v:(o.bl?'0':o.eff.toFixed(1))+' %',
     s:v>=220?TL('230V पर तार में I²R गर्मी का नुकसान कम, इसलिए दक्षता ज़्यादा।','At 230 V the I²R heat loss in the wires is lower, so efficiency is higher.'):TL('110V पर ज़्यादा करंट से कंडक्शन लॉस थोड़ा ज़्यादा।','At 110 V the higher current gives slightly more conduction loss.')}
  ];
  $('v5-reg-gauges').innerHTML=g.map(function(x){
    return '<div class="v5-gauge '+x.c+'"><b>'+x.t+'</b><div class="v">'+x.v+'</div>'
      +(x.bar!==undefined?'<div class="v5-bar"><i style="width:'+x.bar+'%"></i></div>':'')
      +'<small>'+x.s+'</small></div>';
  }).join('');

  var rails=[
    {n:'+12V',t:TL('मुख्य रेल (CPU और GPU)','Main rail (CPU and GPU)'),v:o.r12,lo:11.4,hi:12.6},
    {n:'+5V',t:TL('SATA और USB','SATA and USB'),v:o.r5,lo:4.75,hi:5.25},
    {n:'+3.3V',t:TL('RAM और PCIe','RAM and PCIe'),v:o.r33,lo:3.14,hi:3.47}
  ];
  $('v5-reg-rails').innerHTML=rails.map(function(r){
    var good=ok(r.lo,r.hi,r.v);
    return '<div class="c'+(good?'':' bad')+'"><span>'+r.n+' · '+r.t+'</span><strong>'+r.v.toFixed(2)+' V</strong><small>'+TL('टॉलरेंस: ','Tolerance: ')+r.lo.toFixed(2)+' – '+r.hi.toFixed(2)+' V</small></div>';
  }).join('');
  $('v5-reg-badge').innerHTML=TL('नियमन: ','Regulation: ')+'<b>'+o.st+'</b>';
  apply(box);
}
function rgSet(patch,fromBtn){
  var was=rgCalc().bl;
  Object.keys(patch).forEach(function(k){RG[k]=patch[k]});
  var now=rgCalc().bl;
  if(fromBtn&&!was&&now)play('danger');
  rgRender();
}
(function(){
  var box=$('v5-reg');if(!box)return;
  box.addEventListener('click',function(e){
    var t=e.target.closest('[data-v5-v],[data-v5-smps],[data-v5-sw]');if(!t)return;
    if(t.hasAttribute('data-v5-v'))rgSet({v:+t.getAttribute('data-v5-v')},true);
    else if(t.hasAttribute('data-v5-smps'))rgSet({smps:t.getAttribute('data-v5-smps')},true);
    else rgSet({sw:t.getAttribute('data-v5-sw')},true);
  });
  $('v5-reg-slider').addEventListener('input',function(e){rgSet({v:+e.target.value},false)});
  rgRender();
})();

/* ---------- 3. AC से DC टेस्ट पॉइंट ---------- */
var WAVE={
  sine:{d:'M 0 40 Q 37.5 5, 75 40 T 150 40 T 225 40 T 300 40',c:'#5eead4'},
  dc:{d:'M 0 30 L 300 30',c:'#86efac'},
  sq:{d:'M 0 70 L 20 70 L 20 15 L 50 15 L 50 70 L 90 70 L 90 15 L 120 15 L 120 70 L 160 70 L 160 15 L 190 15 L 190 70 L 230 70 L 230 15 L 260 15 L 260 70 L 300 70',c:'#c4b5fd'},
  hf:{d:'M 0 40 L 15 40 L 15 15 L 35 15 L 35 65 L 55 65 L 55 15 L 75 15 L 75 65 L 95 65 L 95 15 L 115 15 L 115 65 L 135 65 L 135 15 L 155 15 L 155 65 L 175 65 L 175 15 L 195 15 L 195 65 L 215 65 L 215 15 L 235 15 L 235 65 L 255 65 L 255 15 L 275 15 L 275 65 L 295 65 L 295 40 L 300 40',c:'#f9a8d4'}
};
var WLBL={sine:TL('साइन लहर','Sine wave'),dc:TL('स्थिर DC','Steady DC'),sq:TL('स्क्वेयर पल्स','Square pulse'),hf:TL('हाई-फ्रीक्वेंसी AC','High-frequency AC')};
var TPD={
 tp1:{n:TL('TP1: AC मेन्स इनपुट','TP1: AC mains input'),node:TL('AC मेन्स सॉकेट (L–N)','AC mains socket (L–N)'),
   v:{230:TL('230 V AC · पीक ~325 V','230 V AC · peak ~325 V'),110:TL('110 V AC · पीक ~155 V','110 V AC · peak ~155 V')},
   f:{230:TL('50 Hz साइन लहर','50 Hz sine wave'),110:TL('60 Hz साइन लहर','60 Hz sine wave')},
   w:'sine',d:{230:TL('भारतीय / यूरोपीय मानक 230V AC (50 Hz)। पीक = 230 × √2 ≈ 325V।','Indian/European standard 230 V AC (50 Hz). Peak = 230 × √2 ≈ 325 V.'),110:TL('अमेरिकी / जापानी मानक 110V AC (60 Hz)। पीक = 110 × √2 ≈ 155V।','US/Japanese standard 110 V AC (60 Hz). Peak = 110 × √2 ≈ 155 V.')}},
 tp2:{n:TL('TP2: EMI फ़िल्टर के बाद','TP2: after the EMI filter'),node:TL('लाइन फ़िल्टर आउटपुट','Line filter output'),
   v:{230:TL('230 V AC (साफ़)','230 V AC (clean)'),110:TL('110 V AC (साफ़)','110 V AC (clean)')},
   f:{230:TL('50 Hz (साफ़)','50 Hz (clean)'),110:TL('60 Hz (साफ़)','60 Hz (clean)')},
   w:'sine',d:TL('X-कैपेसिटर, Y-कैपेसिटर और कॉमन मोड चोक से गुजरने के बाद हाई-फ्रीक्वेंसी स्पाइक्स हटे हुए AC।','AC with high-frequency spikes removed after the X-capacitors, Y-capacitors and common-mode choke.')},
 tp3:{n:TL('TP3: प्राइमरी बल्क DC','TP3: primary bulk DC'),node:TL('प्राइमरी बल्क कैपेसिटर (+ से −)','Primary bulk capacitors (+ to −)'),
   v:{230:TL('310–325 V DC (हाई वोल्टेज)','310–325 V DC (high voltage)'),110:TL('~310 V DC (वोल्टेज डबलर सक्रिय)','~310 V DC (voltage doubler active)')},
   f:{230:TL('100 Hz रिपल (<2%)','100 Hz ripple (<2%)'),110:TL('120 Hz रिपल (<2%)','120 Hz ripple (<2%)')},
   w:'dc',d:{230:TL('ब्रिज रेक्टिफायर (KBU808) और 450V कैपेसिटर से बना लगभग 325V DC।','About 325 V DC made by the bridge rectifier (KBU808) and the 450 V capacitors.'),110:TL('110V इनपुट पर वोल्टेज डबलर या एक्टिव PFC बूस्ट से लगभग 310–385V DC बनता है।','With 110 V input, a voltage doubler or active PFC boost makes about 310–385 V DC.')}},
 tp4:{n:TL('TP4: MOSFET ड्रेन पल्स','TP4: MOSFET drain pulse'),node:TL('प्राइमरी MOSFET ड्रेन','Primary MOSFET drain'),
   v:{230:TL('0 V से ~380 V (ड्यूटी ~24%)','0 V to ~380 V (duty ~24%)'),110:TL('0 V से ~380 V (ड्यूटी ~42%)','0 V to ~380 V (duty ~42%)')},
   f:{230:TL('65–100 kHz (PWM स्विचिंग)','65–100 kHz (PWM switching)'),110:TL('65–100 kHz (PWM स्विचिंग)','65–100 kHz (PWM switching)')},
   w:'sq',d:{230:TL('230V इनपुट: प्राइमरी वोल्टेज पहले से ऊँचा है, इसलिए ड्यूटी साइकिल संकरी (~24%) रहती है।','230 V input: the primary voltage is already high, so the duty cycle stays narrow (~24%).'),110:TL('110V इनपुट: PWM कंट्रोलर ड्यूटी साइकिल बढ़ाकर (~42%) करता है, ताकि 12V आउटपुट स्थिर रहे।','110 V input: the PWM controller raises the duty cycle (~42%) so the 12 V output stays steady.')}},
 tp5:{n:TL('TP5: ट्रांसफार्मर सेकेंडरी','TP5: transformer secondary'),node:TL('फेराइट ट्रांसफार्मर का सेकेंडरी','Ferrite transformer secondary'),
   v:TL('14–18 V AC (हाई फ्रीक्वेंसी)','14–18 V AC (high frequency)'),f:TL('65–100 kHz स्क्वेयर AC','65–100 kHz square AC'),
   w:'hf',d:TL('EI-33 फेराइट ट्रांसफार्मर से सुरक्षित लो-वोल्टेज में बदला सिग्नल। प्राइमरी से पूरी तरह अलग (आइसोलेटेड)।','Signal stepped down to a safe low voltage by the EI-33 ferrite transformer. Fully isolated from the primary.')},
 tp6:{n:TL('TP6: +12V शुद्ध DC आउटपुट','TP6: clean +12 V DC output'),node:TL('12V रेल आउटपुट (पीला तार)','12 V rail output (yellow wire)'),
   v:TL('+12.04 V DC स्थिर (नियमित)','+12.04 V DC steady (regulated)'),f:TL('0 Hz (रिपल < 30 mV)','0 Hz (ripple < 30 mV)'),
   w:'dc',d:TL('शॉटकी डायोड (MBR20100CT) और लो-ESR कैपेसिटर से प्रोसेस की गई स्थिर 12V DC।','Steady 12 V DC processed by the Schottky diode (MBR20100CT) and low-ESR capacitors.')},
 tp7:{n:TL('TP7: +5V शुद्ध DC आउटपुट','TP7: clean +5 V DC output'),node:TL('5V रेल आउटपुट (लाल तार)','5 V rail output (red wire)'),
   v:TL('+5.02 V DC स्थिर (नियमित)','+5.02 V DC steady (regulated)'),f:TL('0 Hz (रिपल < 20 mV)','0 Hz (ripple < 20 mV)'),
   w:'dc',d:TL('मदरबोर्ड चिपसेट और SSD के लिए शुद्ध 5V DC। PWM रेगुलेशन से 110V/230V दोनों पर स्थिर।','Clean 5 V DC for the chipset and SSDs. PWM regulation keeps it steady on both 110 V and 230 V.')}
};
var STG=[
 {id:'all',n:TL('पूरा सर्किट','Complete circuit'),t:TL('AC मेन्स (110V या 230V) → [EMI फ़िल्टर] → [ब्रिज रेक्टिफायर, ~325V DC] → [MOSFET ~65 kHz स्विचिंग] → [फेराइट ट्रांसफार्मर] → [शॉटकी + लो-ESR फ़िल्टर] → कंप्यूटर को 12V, 5V, 3.3V DC।','AC mains (110 V or 230 V) → [EMI filter] → [bridge rectifier, ~325 V DC] → [MOSFET switching ~65 kHz] → [ferrite transformer] → [Schottky + low-ESR filter] → 12 V, 5 V, 3.3 V DC for the computer.')},
 {id:'filter',n:TL('1. EMI फ़िल्टर','1. EMI filter'),t:TL('AC इनपुट सबसे पहले फ्यूज, MOV (471KD14) और NTC (5D-11) से गुजरता है। इसके बाद X-कैपेसिटर और कॉमन मोड चोक शोर को अंदर आने और बाहर जाने दोनों से रोकते हैं।','AC input first passes the fuse, the MOV (471KD14) and the NTC (5D-11). Then the X-capacitor and common-mode choke stop electrical noise from both entering and leaving.')},
 {id:'bridge',n:TL('2. रेक्टिफायर व बल्क','2. Rectifier and bulk'),t:TL('ब्रिज डायोड (KBU808) AC को पल्सेटिंग DC बनाता है। फिर 450V बल्क कैपेसिटर उसे पीक तक चार्ज करता है (230V पर ~325V)। ब्लीडर रेसिस्टर अनप्लग होने पर कुछ सेकंड में कैपेसिटर डिस्चार्ज करता है।','The bridge diode (KBU808) turns AC into pulsating DC. The 450 V bulk capacitor then charges to the peak (about 325 V on 230 V input). A bleeder resistor discharges it within seconds of unplugging.')},
 {id:'switch',n:TL('3. MOSFET स्विचिंग','3. MOSFET switching'),t:TL('प्राइमरी MOSFET (जैसे 13N60) बल्क DC को प्रति सेकंड 65,000 से 100,000 बार चालू-बंद करता है। PWM IC (जैसे TL494) लोड के हिसाब से ON-समय बदलता है। ऊँची फ़्रीक्वेंसी की वजह से ट्रांसफार्मर छोटा और हल्का बनता है।','The primary MOSFET (e.g. 13N60) switches the bulk DC on and off 65,000 to 100,000 times a second. The PWM IC (e.g. TL494) changes the ON-time with the load. The high frequency lets the transformer be small and light.')},
 {id:'xfmr',n:TL('4. फेराइट ट्रांसफार्मर','4. Ferrite transformer'),t:TL('फेराइट ट्रांसफार्मर (जैसे EI-33) प्राइमरी के ऊँचे वोल्टेज को सुरक्षित लो-वोल्टेज AC में बदलता है। ऑप्टोकपलर (PC817) फीडबैक देता है और प्राइमरी व सेकेंडरी को अलग रखता है।','The ferrite transformer (e.g. EI-33) converts the high primary voltage into safe low-voltage AC. The optocoupler (PC817) carries feedback and keeps primary and secondary separate.')},
 {id:'output',n:TL('5. DC आउटपुट','5. DC output'),t:TL('हाई-स्पीड शॉटकी डायोड (जैसे MBR20100CT) सेकेंडरी AC को DC बनाते हैं। फिर लो-ESR कैपेसिटर और चोक मिलकर साफ़ +12V, +5V और +3.3V देते हैं। सुपरवाइजर IC वोल्टेज पर नज़र रखता है।','High-speed Schottky diodes (e.g. MBR20100CT) turn the secondary AC into DC. Low-ESR capacitors and a choke then give clean +12 V, +5 V and +3.3 V. A supervisor IC watches the voltages.')}
];
var BLK=[
 {s:'filter',tp:'tp1',n:TL('EMI फ़िल्टर','EMI filter'),sb:TL('फ्यूज, MOV, NTC, X/Y कैपेसिटर','Fuse, MOV, NTC, X/Y caps')},
 {s:'bridge',tp:'tp3',n:TL('रेक्टिफायर व बल्क','Rectifier and bulk'),sb:TL('KBU808 + 450V कैपेसिटर','KBU808 + 450 V caps')},
 {s:'switch',tp:'tp4',n:TL('MOSFET स्विचिंग','MOSFET switching'),sb:TL('13N60 + PWM IC','13N60 + PWM IC')},
 {s:'xfmr',tp:'tp5',n:TL('फेराइट ट्रांसफार्मर','Ferrite transformer'),sb:TL('EI-33 स्टेप-डाउन','EI-33 step-down')},
 {s:'output',tp:'tp6',n:TL('शुद्ध DC आउटपुट','Clean DC output'),sb:TL('शॉटकी + लो-ESR','Schottky + low-ESR')}
];
var TP={v:230,stage:'all',sel:'tp3'};
function tpRender(){
  var box=$('v5-tp');if(!box)return;
  var d=TPD[TP.sel],v=TP.v;
  var h='<span class="v5-lbl">'+TL('1. AC इनपुट चुनें','1. Choose AC input')+'</span><div class="v5-row">'
   +'<button class="v5-btn" type="button" data-v5-acv="110" aria-pressed="'+(v===110)+'">110 V AC · 60 Hz</button>'
   +'<button class="v5-btn" type="button" data-v5-acv="230" aria-pressed="'+(v===230)+'">230 V AC · 50 Hz</button></div>';
  h+='<span class="v5-lbl">'+TL('2. चरण चुनें','2. Choose a stage')+'</span><div class="v5-row">';
  STG.forEach(function(s){
    h+='<button class="v5-btn" type="button" data-v5-stg="'+s.id+'" aria-pressed="'+(TP.stage===s.id)+'">'+s.n+'</button>';
  });
  h+='</div><div class="v5-stages">';
  BLK.forEach(function(b){
    var on=TP.stage==='all'||TP.stage===b.s;
    h+='<div class="v5-stage'+(on?' on':'')+'"><b>'+b.n+'</b><small>'+b.sb+'</small>'
      +'<button class="v5-btn" type="button" data-v5-tp="'+b.tp+'" aria-pressed="'+(TP.sel===b.tp)+'" style="min-height:36px;font-size:12px;padding:4px 8px">'+b.tp.toUpperCase()+' '+TL('प्रोब','probe')+'</button></div>';
  });
  h+='</div>';
  var sx=STG.filter(function(s){return s.id===TP.stage})[0]||STG[0];
  h+='<div class="v5-box" style="margin:8px 0">'+sx.t+'</div>';
  var wv=WAVE[d.w];
  h+='<div class="v5-scope"><div class="v5-row" style="justify-content:space-between;margin:0"><span class="k">'+d.n+'</span><span class="val">'+pk(d.v,v)+'</span></div>'
   +'<svg viewBox="0 0 300 80" role="img" aria-label="waveform"><line x1="0" y1="'+(d.w==='dc'?70:40)+'" x2="300" y2="'+(d.w==='dc'?70:40)+'" stroke="#3f6b57" stroke-dasharray="3 3"/><path d="'+wv.d+'" fill="none" stroke="'+wv.c+'" stroke-width="2.5"/></svg>'
   +'<div class="v5-row" style="justify-content:space-between;margin:0;font-size:12px"><span class="k">'+TL('जाँच बिंदु','Test point')+': '+d.node+'</span></div>'
   +'<div class="v5-row" style="justify-content:space-between;margin:0;font-size:12px"><span class="k">'+TL('आवृत्ति','Frequency')+': <span class="val">'+pk(d.f,v)+'</span></span><span class="k">'+TL('वेवफॉर्म','Waveform')+': <span class="val">'+WLBL[d.w]+'</span></span></div></div>';
  h+='<div class="v5-box" style="margin:8px 0;font-size:14px">'+pk(d.d,v)+'</div>';
  h+='<span class="v5-lbl">'+TL('सभी टेस्ट पॉइंट','All test points')+'</span><div class="v5-row">';
  Object.keys(TPD).forEach(function(k){
    h+='<button class="v5-btn" type="button" data-v5-tp="'+k+'" aria-pressed="'+(TP.sel===k)+'" style="min-height:36px;font-size:12px;padding:4px 10px">'+k.toUpperCase()+'</button>';
  });
  h+='</div>';
  box.innerHTML=h;apply(box);
}
(function(){
  var box=$('v5-tp');if(!box)return;
  box.addEventListener('click',function(e){
    var t=e.target.closest('[data-v5-acv],[data-v5-stg],[data-v5-tp]');if(!t)return;
    if(t.hasAttribute('data-v5-acv'))TP.v=+t.getAttribute('data-v5-acv');
    else if(t.hasAttribute('data-v5-stg'))TP.stage=t.getAttribute('data-v5-stg');
    else TP.sel=t.getAttribute('data-v5-tp');
    tpRender();
  });
  tpRender();
})();

/* ---------- 4. NTC और PTC लाइव ---------- */
function ntcR(t){var T=t+273.15,T25=298.15,B=3200,r=5*Math.exp(B*(1/T-1/T25));return Math.max(0.1,Math.round(r*10)/10)}
function ptcR(t){if(t<65)return Math.round((8+(t-25)*0.05)*10)/10;return Math.min(15000,Math.round(10*Math.pow(1.22,t-65)))}
function tRender(t){
  var n=ntcR(t),p=ptcR(t);
  $('v5-t-out').textContent=t+' °C';
  $('v5-t-slider').value=t;
  [].forEach.call(document.querySelectorAll('[data-v5-t]'),function(b){b.setAttribute('aria-pressed',String(+b.getAttribute('data-v5-t')===t))});
  $('v5-ntc').innerHTML='<b>NTC '+TL('(नेगेटिव तापमान गुणांक)','(negative temperature coefficient)')+'</b><div class="v">'+n+' Ω</div>'
    +'<small>'+(t<20?TL('ठंडा: ज़्यादा प्रतिरोध, इनरश करंट रुकता है।','Cold: high resistance, blocks inrush current.'):t>70?TL('गर्म: बहुत कम प्रतिरोध, लगभग बिना नुकसान।','Hot: very low resistance, almost no loss.'):TL('सामान्य ऑपरेटिंग रेंज।','Normal operating range.'))+'</small>'
    +'<small style="margin-top:4px">'+TL('नियम: तापमान ↑ = प्रतिरोध ↓','Rule: temperature ↑ = resistance ↓')+'</small>';
  $('v5-ptc').innerHTML='<b>PTC '+TL('(पॉजिटिव तापमान गुणांक)','(positive temperature coefficient)')+'</b><div class="v">'+(p>9999?'>10,000':p)+' Ω</div>'
    +'<small>'+(t>=75?TL('TRIPPED: ज़्यादा प्रतिरोध, करंट लगभग रुक गया।','TRIPPED: high resistance, current almost stopped.'):TL('NORMAL: कम प्रतिरोध, करंट बह रहा है।','NORMAL: low resistance, current flows.'))+'</small>'
    +'<small style="margin-top:4px">'+TL('नियम: तापमान ↑ = प्रतिरोध ↑','Rule: temperature ↑ = resistance ↑')+'</small>';
  apply($('v5-ntc').parentNode);
}
(function(){
  var s=$('v5-t-slider');if(!s)return;
  s.addEventListener('input',function(e){tRender(+e.target.value)});
  [].forEach.call(document.querySelectorAll('[data-v5-t]'),function(b){
    b.addEventListener('click',function(){tRender(+b.getAttribute('data-v5-t'))});
  });
  tRender(25);
})();

/* ---------- 5. प्रैक्टिस टेस्ट ---------- */
var QZ=[
 {q:TL('SMPS का पूरा नाम क्या है?','What is the full form of SMPS?'),
  o:[TL('Switched-Mode Power Supply','Switched-Mode Power Supply'),TL('Simple Modular Power Source','Simple Modular Power Source'),TL('Silicon Metal Power Storage','Silicon Metal Power Storage'),TL('Standard Motherboard Power Socket','Standard Motherboard Power Socket')],c:0,
  e:TL('SMPS का पूरा नाम \'Switched-Mode Power Supply\' है। यह हाई-फ्रीक्वेंसी स्विचिंग के सिद्धांत पर काम करता है।','The full form is \'Switched-Mode Power Supply\'. It works on the principle of high-frequency switching.')},
 {q:TL('SMPS को बिना मदरबोर्ड के चालू करने के लिए किन दो तारों को जोड़ा (जंप) किया जाता है?','Which two wires are joined (jumped) to start an SMPS without a motherboard?'),
  o:[TL('पीला (+12V) और काला (GND)','Yellow (+12 V) and black (GND)'),TL('हरा (PS_ON#) और कोई भी काला (COM)','Green (PS_ON#) and any black (COM)'),TL('लाल (+5V) और बैंगनी (+5VSB)','Red (+5 V) and purple (+5VSB)'),TL('नीला (-12V) और ग्रे (PWR_OK)','Blue (−12 V) and grey (PWR_OK)')],c:1,
  e:TL('पिन 16 का हरा तार (PS_ON#) किसी भी काले ग्राउंड तार (पिन 15, 17, 18 या 19) से जोड़ने पर SMPS चालू हो जाता है। इसे पेपरक्लिप टेस्ट कहते हैं।','Joining the green wire (pin 16, PS_ON#) to any black ground wire (pin 15, 17, 18 or 19) starts the SMPS. This is the paperclip test.')},
 {q:TL('230V AC इनपुट पर प्राइमरी बल्क कैपेसिटर पर लगभग कितना DC वोल्टेज मापना चाहिए?','With 230 V AC input, about how much DC voltage should you measure across the primary bulk capacitor?'),
  o:[TL('12V DC','12 V DC'),TL('230V DC','230 V DC'),TL('310V से 325V DC (पीक = 230 × √2)','310 V to 325 V DC (peak = 230 × √2)'),TL('450V DC','450 V DC')],c:2,
  e:TL('फुल-वेव रेक्टिफिकेशन के बाद कैपेसिटर पीक वोल्टेज तक चार्ज होता है: Vpeak = 230 × 1.414 ≈ 325V DC।','After full-wave rectification the capacitor charges to the peak: Vpeak = 230 × 1.414 ≈ 325 V DC.')},
 {q:TL('NTC थर्मिस्टर का तापमान बढ़ने पर प्रतिरोध पर क्या असर होता है?','What happens to an NTC thermistor’s resistance when its temperature rises?'),
  o:[TL('प्रतिरोध तेज़ी से बढ़ता है','Resistance rises sharply'),TL('प्रतिरोध घटता है (व्युत्क्रमानुपाती)','Resistance falls (inversely proportional)'),TL('प्रतिरोध बिल्कुल स्थिर रहता है','Resistance stays exactly the same'),TL('शून्य से अनंत हो जाता है','It goes from zero to infinity')],c:1,
  e:TL('NTC का मतलब \'Negative Temperature Coefficient\' है। तापमान बढ़ने पर उसका प्रतिरोध घटता है, इसलिए गर्म होने पर वह लगभग रुकावट नहीं डालता।','NTC means \'Negative Temperature Coefficient\'. As temperature rises its resistance falls, so once warm it offers little opposition.')},
 {q:TL('पावर गुड (PG / PWR_OK) सिग्नल किस रंग के तार पर आता है और उसका वोल्टेज कितना होता है?','On which wire colour does the Power Good (PG / PWR_OK) signal appear, and what is its voltage?'),
  o:[TL('ग्रे तार, +5.0V DC','Grey wire, +5.0 V DC'),TL('बैंगनी तार, +5VSB','Purple wire, +5VSB'),TL('पीला तार, +12.0V DC','Yellow wire, +12.0 V DC'),TL('नारंगी तार, +3.3V DC','Orange wire, +3.3 V DC')],c:0,
  e:TL('पिन 8 का ग्रे तार PWR_OK देता है। सभी वोल्टेज स्थिर होने के लगभग 100–500 ms बाद इस पर +5V आता है, और मदरबोर्ड बूट होता है।','Pin 8, the grey wire, carries PWR_OK. About 100–500 ms after all voltages settle it goes to +5 V and the motherboard boots.')},
 {q:TL('कंप्यूटर पर लोड या गेमिंग शुरू होते ही रीस्टार्ट होने का सबसे आम कारण क्या है?','What is the most common reason a PC restarts as soon as heavy load or gaming starts?'),
  o:[TL('इनपुट फ्यूज का उड़ना','The input fuse blowing'),TL('सेकेंडरी लो-ESR कैपेसिटर्स का फूलना या ESR बढ़ना','Secondary low-ESR capacitors bulging or their ESR rising'),TL('MOV का शॉर्ट होना','The MOV shorting'),TL('X-कैपेसिटर का खराब होना','The X-capacitor failing')],c:1,
  e:TL('सेकेंडरी फ़िल्टर कैपेसिटर सूखने या फूलने पर रिपल बढ़ता है। भारी लोड पर वोल्टेज गिरता है और पीसी रीस्टार्ट हो जाता है।','When secondary filter capacitors dry out or bulge, ripple rises. Under heavy load the voltage sags and the PC restarts.')},
 {q:TL('ओम के नियम से, यदि वोल्टेज 12V और प्रतिरोध 4Ω है, तो करंट कितना बहेगा?','By Ohm’s law, if voltage is 12 V and resistance is 4 Ω, how much current flows?'),
  o:[TL('48 A','48 A'),TL('3 A (I = V / R = 12 / 4)','3 A (I = V / R = 12 / 4)'),TL('0.33 A','0.33 A'),TL('8 A','8 A')],c:1,
  e:TL('I = V / R = 12V / 4Ω = 3 एम्पियर।','I = V / R = 12 V / 4 Ω = 3 A.')},
 {q:TL('सर्किट में वोल्टमीटर और एमीटर को कैसे जोड़ा जाता है?','How are a voltmeter and an ammeter connected in a circuit?'),
  o:[TL('दोनों सीरीज़ में','Both in series'),TL('वोल्टमीटर सीरीज़ में और एमीटर समानांतर में','Voltmeter in series, ammeter in parallel'),TL('वोल्टमीटर समानांतर में और एमीटर सीरीज़ में','Voltmeter in parallel, ammeter in series'),TL('दोनों समानांतर में','Both in parallel')],c:2,
  e:TL('वोल्टमीटर का आंतरिक प्रतिरोध बहुत अधिक होता है, इसलिए वह समानांतर में जुड़ता है। एमीटर का प्रतिरोध लगभग शून्य होता है, इसलिए वह सीरीज़ में जुड़ता है।','A voltmeter has very high internal resistance, so it goes in parallel. An ammeter has almost zero resistance, so it goes in series.')}
];
var QA={},QD=false;
function qRender(){
  var box=$('v5-quiz');if(!box)return;
  var sc=0;QZ.forEach(function(x,i){if(QA[i]===x.c)sc++});
  var h='';
  if(QD){
    var pct=Math.round(sc/QZ.length*100);
    h+='<div class="v5-score">'+TL('आपका स्कोर: ','Your score: ')+sc+' / '+QZ.length+' ('+pct+'%)<br><span style="font-weight:500">'
      +(sc>=6?TL('शानदार! आपकी तैयारी अच्छी है।','Excellent! Your preparation is good.'):TL('कंपोनेंट और रीजनल सर्किट वाले हिस्से को फिर से दोहराएँ।','Revise the components and regional circuit sections.'))+'</span></div>';
  }
  QZ.forEach(function(x,i){
    h+='<div class="v5-q"><b>'+TL('प्र. '+(i+1),'Q'+(i+1))+'</b> <span>'+x.q+'</span><div style="margin-top:8px">';
    x.o.forEach(function(opt,j){
      var cls='',sel=QA[i]===j;
      if(QD){if(j===x.c)cls=' ok';else if(sel)cls=' no'}
      h+='<button class="v5-opt'+cls+'" type="button" data-v5-q="'+i+'" data-v5-o="'+j+'" aria-pressed="'+sel+'"'+(QD?' disabled':'')+'>'+opt+'</button>';
    });
    h+='</div>';
    if(QD)h+='<div class="v5-exp"><b>'+TL('स्पष्टीकरण: ','Explanation: ')+'</b>'+x.e+'</div>';
    h+='</div>';
  });
  var answered=Object.keys(QA).length;
  if(!QD){
    h+='<div class="v5-row" style="justify-content:space-between"><span style="font-size:14px;color:var(--muted)">'+TL('हल किए: ','Answered: ')+answered+' / '+QZ.length+'</span>'
      +'<button class="v5-btn" type="button" data-v5-qgo'+(answered===0?' disabled':'')+'>'+TL('परिणाम देखें','See result')+'</button></div>';
  } else {
    h+='<div class="v5-row"><button class="v5-btn" type="button" data-v5-qreset>'+TL('फिर से दें','Try again')+'</button></div>';
  }
  box.innerHTML=h;apply(box);
}
(function(){
  var box=$('v5-quiz');if(!box)return;
  box.addEventListener('click',function(e){
    var t=e.target.closest('[data-v5-q],[data-v5-qgo],[data-v5-qreset]');if(!t||t.disabled)return;
    if(t.hasAttribute('data-v5-q')){if(QD)return;QA[+t.getAttribute('data-v5-q')]=+t.getAttribute('data-v5-o')}
    else if(t.hasAttribute('data-v5-qgo')){if(Object.keys(QA).length)QD=true}
    else {QA={};QD=false}
    qRender();
  });
  qRender();
})();

/* ---------- 6. थीम: Light → Dark → Blue → Purple ---------- */
(function(){
  var old=$('themeBtn');if(!old)return;
  var b=old.cloneNode(true);old.parentNode.replaceChild(b,old);
  var root=document.documentElement,order=['light','dark','blue','purple','orange','teal','rose'];
  var names={light:TL('Light (साधारण)','Light'),dark:TL('Dark (डार्क)','Dark'),blue:TL('Blue (नीला)','Blue'),purple:TL('Purple (बैंगनी)','Purple')};
  function cur(){return root.getAttribute('data-theme')||'dark'}
  function label(){
    var t=cur();
    b.setAttribute('title','थीम बदलें · Change theme');
    b.setAttribute('aria-label','थीम बदलें (अभी: '+t+') · Change theme (now: '+t+')');
    b.setAttribute('data-theme-now',t);
  }
  b.addEventListener('click',function(){
    var i=order.indexOf(cur()),n=order[(i+1)%order.length];
    root.setAttribute('data-theme',n);
    try{localStorage.setItem('smps-theme',n)}catch(e){}
    label();
  });
  label();
})();
})();
