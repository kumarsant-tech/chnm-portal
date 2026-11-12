
(function(){
"use strict";
var $=function(id){return document.getElementById(id)};

/* ---------- 1. ब्लॉक डायग्राम की जानकारी ---------- */
var BI={
 inp:["AC इनपुट (230V, 50Hz)","घर की लाइन से आता है। फ़्यूज़, वैरिस्टर (MOV) और NTC यहीं लगते हैं। फ़्यूज़ उड़ने का मतलब आगे कहीं शॉर्ट है।"],
 flt:["EMI फ़िल्टर","X कैपेसिटर, Y कैपेसिटर और कॉमन मोड चोक। SMPS से निकलने वाला और लाइन से आने वाला हाई-फ़्रीक्वेंसी शोर रोकते हैं।"],
 brg:["ब्रिज रेक्टिफ़ायर","चार डायोड AC को एक दिशा के स्पंदित DC में बदलते हैं। 230V AC से शिखर लगभग 325V।"],
 blk:["बल्क कैपेसिटर","स्पंदित DC को चिकना करके लगभग 300V से 320V DC बनाता है। इसकी क्षमता घटे तो रिपल बढ़ता है और कंप्यूटर बंद होने लगता है।"],
 sw:["स्विचिंग MOSFET / ट्रांजिस्टर","300V DC को हर सेकंड हज़ारों बार ऑन-ऑफ करके ट्रांसफ़ॉर्मर में पल्स भेजता है। सबसे आम जलने वाला पार्ट।"],
 ntc:["NTC थर्मिस्टर","स्टार्टअप में बल्क कैपेसिटर के तेज़ इनरश करंट को सीमित करता है; गर्म होने पर इसका प्रतिरोध घटता है।"],
 mov:["MOV वैरिस्टर","वोल्टेज स्पाइक पर अतिरिक्त ऊर्जा को सोखकर फ़्यूज़ और बाकी सर्किट की रक्षा करने की कोशिश करता है।"],
 trf:["मेन ट्रांसफ़ॉर्मर","फेराइट कोर पर प्राइमरी और सेकेंडरी वाइंडिंग। ऊँची फ़्रीक्वेंसी पर छोटा कोर काम कर जाता है और बिजली को अलग (आइसोलेट) भी करता है।"],
 pwm:["PWM कंट्रोल IC","पल्स की चौड़ाई (ड्यूटी साइकिल) तय करता है। आउटपुट कम हो तो चौड़ी, ज़्यादा हो तो पतली। जैसे TL494, KA7500, UC3842।"],
 sb:["स्टैंडबाय सप्लाई","अलग छोटा SMPS जो प्लग लगाते ही 5VSB देता है। इसी से PWM IC को शुरुआती पावर और मदरबोर्ड बटन को सप्लाई मिलती है।"],
 fb:["TL431 + ऑप्टोकपलर","आउटपुट को नापकर रोशनी के सहारे प्राइमरी तक खबर भेजता है। इससे आइसोलेशन भी बना रहता है और वोल्टेज स्थिर भी।"],
 sec:["सेकेंडरी डायोड (शॉटकी)","ट्रांसफ़ॉर्मर के पल्स को DC में बदलते हैं। कम ड्रॉप, तेज़ चाल। शॉर्ट होना आम खराबी।"],
 out:["आउटपुट फ़िल्टर और रेल","इंडक्टर और लो-ESR कैपेसिटर रिपल हटाते हैं। नतीजा: +12V, +5V, +3.3V (और −12V, 5VSB)।"]
};
var bdTip=$('bd-tooltip'),bdTipTimer=0;
if(bdTip)document.body.appendChild(bdTip);
function bdArt(k){
 if(k==='sw')return '<svg viewBox="0 0 100 76"><path class="bd-wire" d="M6 38h23m42 0h23M50 8v16m0 28v16M29 22v32m42-32v32"/><path class="bd-core" d="M39 25h22v26H39zM33 38h6m22 0h10"/><path class="bd-pulse" d="M6 38h12v-9h9v18h9v-9h12"/><text x="50" y="73">MOSFET</text></svg>';
 if(k==='ntc')return '<svg viewBox="0 0 100 76"><path class="bd-wire" d="M5 38h24m42 0h24"/><circle class="bd-core" cx="50" cy="38" r="19"/><path class="bd-wire" d="M38 49l24-22"/><path class="bd-pulse" d="M5 38h12v-8h12v16h12v-8h9"/><path class="bd-charge" d="M39 15q11-9 22 0"/><text x="50" y="73">NTC</text></svg>';
 if(k==='mov')return '<svg viewBox="0 0 100 76"><path class="bd-wire" d="M5 38h24m42 0h24"/><circle class="bd-core" cx="50" cy="38" r="19"/><path class="bd-wire" d="M38 49l24-22"/><path class="bd-charge" d="M50 8v10m-5-5 5-5 5 5M50 68V58m-5 5 5 5 5-5"/><path class="bd-pulse" d="M5 38h12v-8h12v16h12v-8h9"/><text x="50" y="73">MOV</text></svg>';
 if(k==='trf')return '<svg viewBox="0 0 100 76"><path class="bd-wire" d="M5 38h18m54 0h18"/><path class="bd-coil" d="M23 20c18 0 18 9 0 9s-18 9 0 9 18 9 0 9-18 9 0 9m54-36c-18 0-18 9 0 9s18 9 0 9-18 9 0 9 18 9 0 9 18 9 0 9"/><path class="bd-core" d="M47 16v44m6-44v44"/><path class="bd-pulse" d="M5 38h12v-8h6m54 8h8v-8h9"/><text x="50" y="73">TRANSFORMER</text></svg>';
 if(k==='blk')return '<svg viewBox="0 0 100 76"><path class="bd-wire" d="M8 38h25m34 0h25M50 11v18m0 18v18"/><path class="bd-core" d="M35 29v18m30-18v18"/><path class="bd-pulse" d="M8 38h10v-8h8v16h8v-8h10"/><path class="bd-charge" d="M50 12v10m-4-6 4-4 4 4M50 64V54m-4 6 4 4 4-4"/><text x="50" y="73">CAPACITOR</text></svg>';
 return '<svg viewBox="0 0 100 76"><path class="bd-wire" d="M6 38h88"/><path class="bd-pulse" d="M6 38h16v-12h12v24h12v-18h12v12h12v-6h24"/><circle class="bd-node" cx="50" cy="38" r="6"/><text x="50" y="73">SMPS CIRCUIT</text></svg>';
}
function showBdTip(k,node,pinned){
 var data=BI[k],rect=node.getBoundingClientRect();if(!data||!bdTip)return;
 $('bd-tooltip-title').textContent=data[0];$('bd-tooltip-tech').textContent=data[1];$('bd-tooltip-art').innerHTML=bdArt(k);
 bdTip.hidden=false;bdTip.dataset.pinned=pinned?'true':'false';node.setAttribute('aria-describedby','bd-tooltip');node.setAttribute('aria-expanded','true');
 var width=bdTip.offsetWidth,left=Math.max(10,Math.min(innerWidth-width-10,rect.left+(rect.width-width)/2)),top=rect.bottom+10;
 if(top+bdTip.offsetHeight>innerHeight-10)top=Math.max(10,rect.top-bdTip.offsetHeight-10);
 bdTip.style.left=left+'px';bdTip.style.top=top+'px';
}
function hideBdTip(){if(bdTip){bdTip.hidden=true;bdTip.dataset.pinned='false'}document.querySelectorAll('[aria-controls="bd-tooltip"][aria-expanded="true"]').forEach(function(node){node.setAttribute('aria-expanded','false');node.removeAttribute('aria-describedby')})}
 window.__showSmpsTip=showBdTip;window.__hideSmpsTip=hideBdTip;
function selBlk(k){
 var gs=document.querySelectorAll('#bd .blk');
 for(var i=0;i<gs.length;i++){gs[i].classList.toggle('sel',gs[i].getAttribute('data-k')===k)}
 var d=BI[k];$('bd-info').innerHTML='<h3 style="margin:0 0 6px">'+d[0]+'</h3><p style="margin:0"><b>तकनीकी बात:</b> '+d[1]+'</p>';
}
(function(){
 var gs=document.querySelectorAll('#bd .blk');
 for(var i=0;i<gs.length;i++){(function(g){
  var key=g.getAttribute('data-k');g.setAttribute('role','button');g.setAttribute('aria-controls','bd-tooltip');g.setAttribute('aria-expanded','false');
  g.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch')showBdTip(key,g,false)});
  g.addEventListener('pointerleave',function(){bdTipTimer=setTimeout(function(){if(bdTip.dataset.pinned!=='true'&&document.activeElement!==g)hideBdTip()},120)});
  g.addEventListener('focusin',function(){showBdTip(key,g,false)});
  g.addEventListener('focusout',function(){if(bdTip.dataset.pinned!=='true')hideBdTip()});
  g.addEventListener('click',function(){selBlk(key);showBdTip(key,g,true)});
  g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selBlk(key);showBdTip(key,g,true)}if(e.key==='Escape')hideBdTip()});
 })(gs[i])}
 if(bdTip){bdTip.addEventListener('pointerenter',function(){clearTimeout(bdTipTimer)});
 bdTip.addEventListener('pointerleave',function(){if(bdTip.dataset.pinned!=='true')hideBdTip()});
 $('bd-tooltip-close').addEventListener('click',hideBdTip);}
 document.addEventListener('click',function(e){if(!e.target.closest('#bd .blk,.component-term,#bd-tooltip'))hideBdTip()});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')hideBdTip()});

if(document.querySelector('#bd .blk'))selBlk('blk');
})();

/* ---------- 2. सिमुलेटर ---------- */
var fbOn=true, capBad=false, N=0.125;
function tok(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
function simulate(){
 var vac=+$('s-ac').value, I=+$('s-ld').value, C=+$('s-c').value*1e-6;
 var f=50, dt=50e-6, T=0.04, steps=Math.round(T/dt);
 var vp=vac*Math.SQRT2, vc=0, a=[],r=[],c=[], vdrop=1.4;
 /* दो चक्र पहले से चलाकर स्थिर अवस्था में लाना */
 var pre=Math.round(0.06/dt);
 for(var i=-pre;i<steps;i++){
  var t=i*dt, s=Math.abs(vp*Math.sin(2*Math.PI*f*t)), vr=Math.max(0,s-vdrop);
  if(vr>vc){vc=vr}else{vc-=I*dt/C; if(vc<0)vc=0}
  if(i>=0){a.push(vp*Math.sin(2*Math.PI*f*t));r.push(vr);c.push(vc)}
 }
 var mn=1e9,mx=-1e9,sum=0;
 for(var k=0;k<c.length;k++){if(c[k]<mn)mn=c[k];if(c[k]>mx)mx=c[k];sum+=c[k]}
 return {vp:vp,a:a,r:r,c:c,vmin:mn,vmax:mx,vavg:sum/c.length,rip:mx-mn};
}
function draw(){
var cv=$('simc');if(!cv)return;
var g=cv.getContext('2d'),W=cv.width,H=cv.height;
 var S=simulate(), D;
 var vo_ideal;
 if(fbOn){D=12/(Math.max(S.vavg,1)*N); D=Math.min(0.9,Math.max(0.1,D)); $('s-d').value=Math.round(D*100)}
 else{D=(+$('s-d').value)/100}
 vo_ideal=S.vavg*N*D;
 var vo=vo_ideal; /* फ़ीडबैक चालू हो तो D इतना चुना जाता है कि 12V बने, सिवाय जब D अपनी सीमा (10% से 90%) पर अटक जाए */
 $('o-ac').textContent=$('s-ac').value+' V';$('o-ld').textContent=(+$('s-ld').value).toFixed(1)+' A';
 $('o-c').textContent=$('s-c').value+' µF';$('o-d').textContent=Math.round(D*100)+' %'+(fbOn?' (अपने आप)':'');
 $('s-d').disabled=fbOn;
 var brip=S.rip;
 var sw=(capBad?220:25)+(+$('s-ld').value)*(capBad?30:4);
 var line=fbOn?0.04:1; /* 100Hz रिपल का आउटपुट पर असर */
 var orip=sw+brip*N*D*1000*line;
 $('r-vdc').textContent=S.vavg.toFixed(0)+' V';
 $('r-rip').textContent=brip.toFixed(0)+' V';
 $('r-vo').textContent=vo.toFixed(2)+' V';
 $('r-or').textContent=orip.toFixed(0)+' mV';
 var warn='';
 if(orip>120)warn+='आउटपुट रिपल ATX की सीमा (12V पर 120mV पीक-टू-पीक) से ज़्यादा है। ऐसे में कंप्यूटर रीस्टार्ट या हैंग होता है। ';
 if(S.vmin<200)warn+='बल्क वोल्टेज बहुत गिर रहा है, फ़ीडबैक के बावजूद आउटपुट लड़खड़ा सकता है। ';
 if(fbOn&&vo<11.9)warn+='इस इनपुट और लोड पर ड्यूटी साइकिल अपनी ऊपरी सीमा पर पहुँच गई, 12V नहीं बन रही। ';
 if(!warn)warn='ठीक चल रहा है। कैपेसिटर घटाकर, इनपुट कम करके या कैपेसिटर को सूखा चुनकर खराबी का असर देखें।';
 $('sim-note').textContent=warn;
 /* ग्राफ़ */
 var fg=tok('--fg'),mu=tok('--muted'),ln=tok('--line'),tr=tok('--trace'),ac=tok('--accent'),wr=tok('--warn'),bg=tok('--surface');
 g.fillStyle=bg;g.fillRect(0,0,W,H);
 var rows=[
  {t:'1. AC इनपुट (230V RMS का शिखर ≈ 325V)',y0:-400,y1:400,u:'V',col:tr,d:S.a,tk:[-300,0,300]},
  {t:'2. ब्रिज के बाद: स्पंदित DC (100Hz)',y0:0,y1:400,u:'V',col:tr,d:S.r,tk:[0,200,400]},
  {t:'3. बल्क कैपेसिटर के बाद: रिपल वाली DC',y0:0,y1:400,u:'V',col:ac,d:S.c,tk:[0,200,400]},
  {t:'4. स्विचिंग: ट्रांसफ़ॉर्मर में पल्स (ज़ूम: 60µs)',y0:0,y1:400,u:'V',col:wr,d:null,tk:[0,200,400]},
  {t:'5. 12V आउटपुट रेल (रिपल बड़ा करके दिखाया गया)',y0:11,y1:13,u:'V',col:ac,d:null,tk:[11,12,13]}
 ];
 var rh=Math.floor(H/rows.length), L=44, R=10, pw=W-L-R;
 g.textBaseline='middle';
 for(var ri=0;ri<rows.length;ri++){
  var row=rows[ri], top=ri*rh+22, bot=(ri+1)*rh-10, ph=bot-top;
  g.fillStyle=fg;g.font="600 13px 'Noto Sans Devanagari',sans-serif";g.textAlign='left';g.fillText(row.t,L,ri*rh+11);
  function Y(v){return bot-(v-row.y0)/(row.y1-row.y0)*ph}
  g.strokeStyle=ln;g.lineWidth=1;g.fillStyle=mu;g.font="11px 'IBM Plex Mono',monospace";g.textAlign='right';
  for(var q=0;q<row.tk.length;q++){var yy=Y(row.tk[q]);g.beginPath();g.moveTo(L,yy);g.lineTo(L+pw,yy);g.stroke();g.fillText(String(row.tk[q]),L-5,yy)}
  g.strokeStyle=row.col;g.lineWidth=2;g.beginPath();
  if(ri<3){var n=row.d.length;for(var p=0;p<n;p+=2){var x=L+p/(n-1)*pw,y=Y(row.d[p]);if(p===0)g.moveTo(x,y);else g.lineTo(x,y)}}
  else if(ri===3){
   var per=20,tot=60,hi=S.vavg;
   var x0=L,yL=Y(0),yH=Y(hi);g.moveTo(x0,yL);
   for(var k2=0;k2<3;k2++){
    var xa=L+(k2*per)/tot*pw,xb=L+(k2*per+per*D)/tot*pw,xc=L+((k2+1)*per)/tot*pw;
    g.lineTo(xa,yL);g.lineTo(xa,yH);g.lineTo(xb,yH);g.lineTo(xb,yL);g.lineTo(xc,yL);
   }
  }else{
   var n2=S.c.length;
   for(var p2=0;p2<n2;p2+=2){
    var tt=p2/(n2-1);
    var base=S.c[p2]-S.vavg;
    var v=vo+ (base/Math.max(S.rip,1e-6))*(brip*N*D*line)*0.5 + Math.sin(2*Math.PI*tt*40)*(sw/1000)*0.5;
    v=Math.max(row.y0,Math.min(row.y1,v));
    var x2=L+tt*pw,y2=Y(v);if(p2===0)g.moveTo(x2,y2);else g.lineTo(x2,y2);
   }
  }
  g.stroke();
  g.fillStyle=mu;g.font="11px 'IBM Plex Mono',monospace";g.textAlign='right';
  g.fillText(ri===3?'60µs':'40ms',L+pw,ri*rh+11);
 }
}
function bind(id){var e=$(id);if(!e)return;e.addEventListener('input',draw)}
['s-ac','s-ld','s-c','s-d'].forEach(bind);
function setFb(on){fbOn=on;$('b-fbon').setAttribute('aria-pressed',on);$('b-fboff').setAttribute('aria-pressed',!on);draw()}
function setCap(bad){capBad=bad;$('b-good').setAttribute('aria-pressed',!bad);$('b-bad').setAttribute('aria-pressed',bad);draw()}
var _e1=$('b-fbon');if(_e1)_e1.addEventListener('click',function(){setFb(true)});
var _e2=$('b-fboff');if(_e2)_e2.addEventListener('click',function(){setFb(false)});
var _e3=$('b-good');if(_e3)_e3.addEventListener('click',function(){setCap(false)});
var _e4=$('b-bad');if(_e4)_e4.addEventListener('click',function(){setCap(true)});
if(window.matchMedia){try{window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',draw)}catch(e){}}
try{new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']})}catch(e){}

/* ---------- 3. सीरीज़ / पैरेलल ---------- */
var kind='r';
function fmt(v,k){
 if(!isFinite(v))return '—';
 if(k==='r'){if(v>=1e6)return (v/1e6).toPrecision(4)+' MΩ';if(v>=1e3)return (v/1e3).toPrecision(4)+' kΩ';return v.toPrecision(4)+' Ω'}
 if(v<1)return (v*1000).toPrecision(4)+' nF';return v.toPrecision(4)+' µF';
}
function calc(){
 var vals=[+$('v1').value,+$('v2').value,+$('v3').value].filter(function(x){return x>0});
 if(vals.length<2){$('sp-s').textContent='—';$('sp-p').textContent='—';$('sp-note').textContent='कम से कम दो मान डालें।';return}
 var sum=vals.reduce(function(a,b){return a+b},0), rec=vals.reduce(function(a,b){return a+1/b},0);
 var ser,par;
 if(kind==='r'){ser=sum;par=1/rec;$('sp-note').textContent='रेसिस्टर: सीरीज़ में सब जुड़ते हैं, पैरेलल में कुल मान सबसे छोटे से भी कम हो जाता है।'}
 else{ser=1/rec;par=sum;$('sp-note').textContent='कैपेसिटर: पैरेलल में क्षमता जुड़ती है। सीरीज़ में क्षमता घटती है, पर सहन करने वाला वोल्टेज बँट जाता है (बराबर कैपेसिटर होने पर लगभग दोगुना)।'}
 $('sp-s').textContent=fmt(ser,kind);$('sp-p').textContent=fmt(par,kind);
}
function setKind(k){kind=k;$('k-r').classList.toggle('on',k==='r');$('k-c').classList.toggle('on',k==='c');
 if(k==='r'){$('v1').value=100;$('v2').value=220}else{$('v1').value=220;$('v2').value=220}
 calc()}
var _k1=$('k-r');if(_k1)_k1.addEventListener('click',function(){setKind('r')});
var _k2=$('k-c');if(_k2)_k2.addEventListener('click',function(){setKind('c')});
['v1','v2','v3'].forEach(function(id){var e=$(id);if(!e)return;e.addEventListener('input',calc)});

/* ---------- 4. बल्ब टेस्टर ---------- */
var BULB={
 full:'<b>पूरा तेज़ जलता रहे: प्राइमरी में शॉर्ट।</b> बिजली सीधे बह रही है। चालू रखकर न देखें। प्लग निकालकर ब्रिज डायोड, स्विचिंग MOSFET/ट्रांजिस्टर, बल्क कैपेसिटर और X कैपेसिटर जाँचें। शॉर्ट पार्ट बदलने के बाद PWM IC और गेट रेसिस्टर भी देखें।',
 flash:'<b>एक बार चमककर बुझना या बहुत हल्का रहना: सामान्य।</b> शुरुआती चमक बल्क कैपेसिटर चार्ज होने की है। इसके बाद SMPS ठीक है और खुद चल पड़ेगा। अगर कुछ भी न चले और बल्ब बिल्कुल न चमके, तो फ़्यूज़, NTC या AC रास्ता ओपन है।',
 blink:'<b>बार-बार जलना-बुझना (टिक-टिक): SMPS बार-बार शुरू होकर प्रोटेक्शन में जा रहा है।</b> सेकेंडरी की किसी रेल में शॉर्ट या ओवरलोड (शॉटकी डायोड, लीक होता आउटपुट कैपेसिटर) देखें। फ़ीडबैक टूटा हो (TL431 या ऑप्टोकपलर) तो भी यही होता है। स्टैंडबाय सप्लाई में भी ऐसा हो सकता है।',
 dim:'<b>धीमा लेकिन स्थिर जलना: प्रायः ठीक।</b> SMPS चल रहा है और बल्ब थोड़ा करंट रोक रहा है। अब लोड लगाकर देखें। लोड पर बल्ब बहुत तेज़ हो जाए तो सेकेंडरी में ओवरलोड है।'
};
function bulb(){var s=$('bulb'),r=$('bulb-r');if(!s||!r)return;$('bulb-r').innerHTML=BULB[s.value]}
var _bu=$('bulb');if(_bu)_bu.addEventListener('change',bulb);
window.__smps={draw:draw,calc:calc,bulb:bulb};
})();
