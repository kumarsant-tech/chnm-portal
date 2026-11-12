
(function(){
'use strict';
var $=function(id){return document.getElementById(id)};
function B(hi,en){return '<span data-lang="hi">'+hi+'</span><span data-lang="en" hidden>'+en+'</span>'}
function refresh(el){if(el&&window.__applyLang)window.__applyLang(el)}
var NOM={v12:12,v5:5,v33:3.3,vsb:5};

/* ---------- शॉर्ट सर्किट लैब ---------- */
var SH={
 sec12:{kind:'sec',rail:'v12',pt:'sec12',a:[590,150,590,210],hi:'12V रेल',en:'12V rail'},
 sec5:{kind:'sec',rail:'v5',pt:'sec5',a:[625,150,625,210],hi:'5V रेल',en:'5V rail'},
 sec33:{kind:'sec',rail:'v33',pt:'sec33',a:[660,150,660,210],hi:'3.3V रेल',en:'3.3V rail'},
 sb:{kind:'sb',rail:'vsb',pt:'sb',a:[695,150,695,210],hi:'5VSB',en:'5VSB'},
 schottky:{kind:'sec',rail:'v12',pt:'sec12',a:[572,100,572,210],hi:'सेकेंडरी शॉटकी',en:'secondary Schottky'},
 bulk:{kind:'pri',pt:'bulk',a:[382,50,382,210],hi:'बल्क कैपेसिटर',en:'bulk capacitor'},
 mosfet:{kind:'pri',pt:'mosfet',a:[455,50,455,210],hi:'MOSFET',en:'MOSFET'},
 bridge:{kind:'pri',pt:'bridge',a:[300,60,300,200],hi:'ब्रिज डायोड',en:'bridge diode'},
 mov:{kind:'pri',pt:'mov',a:[250,50,250,210],hi:'MOV',en:'MOV'}
};
var ROWS=[
 {p:'sec12',m:'ohm',hi:'12V – GND ओम',en:'12V – GND ohm',okHi:'सैकड़ों Ω या OL',okEn:'Hundreds of Ω or OL'},
 {p:'sec5',m:'ohm',hi:'5V – GND ओम',en:'5V – GND ohm',okHi:'सैकड़ों Ω या OL',okEn:'Hundreds of Ω or OL'},
 {p:'sec33',m:'ohm',hi:'3.3V – GND ओम',en:'3.3V – GND ohm',okHi:'सैकड़ों Ω या OL',okEn:'Hundreds of Ω or OL'},
 {p:'sb',m:'ohm',hi:'5VSB – GND ओम',en:'5VSB – GND ohm',okHi:'सैकड़ों Ω या OL',okEn:'Hundreds of Ω or OL'},
 {p:'bulk',m:'ohm',hi:'बल्क + और − ओम',en:'Bulk + to − ohm',okHi:'OL, धीरे-धीरे बढ़ता',okEn:'OL, rising slowly'},
 {p:'mosfet',m:'ohm',hi:'MOSFET ड्रेन–सोर्स',en:'MOSFET drain–source',okHi:'OL या डायोड 0.4–0.7 V',okEn:'OL or diode 0.4–0.7 V'},
 {p:'bridge',m:'ohm',hi:'ब्रिज डायोड (डायोड मोड)',en:'Bridge diode (diode mode)',okHi:'एक दिशा 0.4–0.6 V',okEn:'0.4–0.6 V one way'},
 {p:'mov',m:'ohm',hi:'L – N (MOV)',en:'L – N (MOV)',okHi:'OL (बहुत ऊँचा)',okEn:'OL (very high)'},
 {p:'bulk',m:'volt',k:'bulk',lo:300,hi2:330,hi:'बल्क वोल्टेज (प्लग लगा)',en:'Bulk voltage (plugged in)',okHi:'300–325 V DC',okEn:'300–325 V DC'},
 {p:'v12',m:'volt',k:'v12',lo:11.4,hi2:12.6,hi:'12V रेल',en:'12V rail',okHi:'11.4–12.6 V',okEn:'11.4–12.6 V'},
 {p:'v5',m:'volt',k:'v5',lo:4.75,hi2:5.25,hi:'5V रेल',en:'5V rail',okHi:'4.75–5.25 V',okEn:'4.75–5.25 V'},
 {p:'v33',m:'volt',k:'v33',lo:3.14,hi2:3.47,hi:'3.3V रेल',en:'3.3V rail',okHi:'3.14–3.47 V',okEn:'3.14–3.47 V'},
 {p:'vsb',m:'volt',k:'vsb',lo:4.75,hi2:5.25,hi:'5VSB',en:'5VSB',okHi:'4.75–5.25 V (हमेशा)',okEn:'4.75–5.25 V (always)'}
];

function run(c){
 var s={fuse:'ok',bulb:'off',bulk:310,v12:12,v5:5,v33:3.3,vsb:5,pg:true,mode:'healthy',hi:'',en:''};
 var d=SH[c.loc],kind=d?d.kind:'none',bulbOn=c.bulb!=='none';
 if(!c.plug){
  s.bulk=0;s.v12=s.v5=s.v33=s.vsb=0;s.pg=false;s.mode='unplugged';
  s.hi='प्लग निकला है, इसलिए सभी वोल्टेज 0 V हैं। अब ओम मीटर से शॉर्ट पकड़ सकते हैं। जिस जगह ओम लगभग R दिखे, वही शॉर्ट है।';
  s.en='The plug is out, so all voltages are 0 V. Use the ohm meter to find the short: the spot that reads about R is the short.';
  return s;
 }
 if(kind==='pri'){
  s.bulk=0;s.v12=s.v5=s.v33=s.vsb=0;s.pg=false;
  if(!bulbOn){
   s.fuse='blown';s.bulb='off';s.mode='pri-fuse';
   s.hi='फ़्यूज़ उड़ गया! AC सीधे शॉर्ट से जुड़ गया, इसलिए बहुत ज़्यादा करंट बहा। बिना बल्ब के यही होता है। पहले शॉर्ट वाला पार्ट ढूँढें, तभी नया फ़्यूज़ लगाएँ।';
   s.en='Fuse blown! The AC was directly shorted, so a huge current flowed. This is what happens without a bulb. Find the shorted part first, then fit a new fuse.';
  }else{
   s.bulb='full';s.mode='pri-bulb';
   s.hi='बल्ब पूरा चमका! बल्ब AC के रास्ते में है, इसलिए शॉर्ट होने पर भी फ़्यूज़ नहीं उड़ा। बल्ब का पूरा चमकना = हाई-वोल्टेज (प्राइमरी) में शॉर्ट।';
   s.en='Bulb glows full! The bulb is in the AC path, so the fuse survives and the bulb limits the current. A full-bright bulb means a short on the high-voltage (primary) side.';
  }
  return s;
 }
 if(kind==='none'){
  s.bulb=bulbOn?'dim':'off';s.mode='healthy';
  s.hi='कोई शॉर्ट नहीं। सामान्य SMPS: बल्क लगभग 310 V, सभी रेल सही, और बल्ब (अगर लगा) हल्का सा चमकता है।';
  s.en='No short. Healthy SMPS: bulk about 310 V, all rails correct, and the bulb (if fitted) glows faintly.';
  return s;
 }
 if(kind==='sb'){
  s.bulk=310;
  if(c.R<=2){
   s.vsb=0;s.v12=s.v5=s.v33=0;s.pg=false;s.mode='sb-dead';s.bulb=bulbOn?'dim':'off';
   s.hi='5VSB शॉर्ट: स्टैंडबाय सप्लाई नहीं बनती, इसलिए PS_ON दबाने पर भी SMPS चालू नहीं होता। बल्क 310 V रहता है, पर PSU डेड लगता है।';
   s.en='5VSB short: the standby supply cannot form, so the SMPS will not start even when PS_ON is pulled low. Bulk stays at 310 V, but the PSU looks dead.';
  }else{
   s.vsb=+(NOM.vsb*c.R/(c.R+0.5)).toFixed(2);s.mode='weak';s.bulb=bulbOn?'dim':'off';
   s.hi='शॉर्ट हल्का है: 5VSB थोड़ा गिरा। SMPS चलता दिख सकता है, पर लोड पर फ़ेल हो सकता है।';
   s.en='Weak short: 5VSB dropped a little. The SMPS may seem to work but can fail under load.';
  }
  return s;
 }
 /* sec रेल */
 s.mode='sec';
 if(c.R<=2){
  s.v12=s.v5=s.v33=0;s.pg=false;s.bulb=bulbOn?'flicker':'off';s.mode='scp';
  s.hi='रेल शॉर्ट: SMPS की सुरक्षा (SCP) उसे बंद कर देती है, फिर बार-बार चालू होता है (टिक-टिक)। बल्ब झपकता है। शॉर्ट वाली रेल 0 V है और PG (Power Good) गिरा रहता है।';
  s.en='Rail short: the SMPS protection (SCP) shuts it down, then it retries again and again (tick-tick). The bulb flickers. The shorted rail reads 0 V and PG stays low.';
 }else{
  s[d.rail]=+(NOM[d.rail]*c.R/(c.R+0.5)).toFixed(2);s.bulb=bulbOn?'dim':'off';s.mode='weak';
  s.hi='शॉर्ट हल्का है: रेल थोड़ी गिरी, SCP चालू नहीं हुई। SMPS चलता दिखता है, पर यह ख़तरनाक है क्योंकि असली लोड पर फ़ेल हो सकता है।';
  s.en='Weak short: the rail dropped a bit and SCP did not trip. The SMPS seems to work, but it is risky because it may fail under a real load.';
 }
 return s;
}

function ohmTxt(p,c){
 if(c.plug)return null;
 var d=SH[c.loc];
 if(c.loc!=='none'&&d&&d.pt===p){
  var R=+c.R;return {t:(R<=1?B('बीप ≈ 0 Ω','Beep ≈ 0 Ω'):B(R+' Ω (शॉर्ट)',R+' Ω (short)')),bad:true};
 }
 return {t:B('OL / बहुत ज़्यादा','OL / very high'),bad:false};
}

function slSVG(c,s){
 var d=SH[c.loc]||{};
 var lamp=s.bulb==='full'?'#fff07a':s.bulb==='flicker'?'#ffb020':'#ffd58a';
 var op=s.bulb==='full'?1:s.bulb==='flicker'?.7:s.bulb==='dim'?.35:0;
 var fc=s.fuse==='blown'?'#B3261E':'#1B7F3B';
 var g=[];
 g.push('<svg class="sl-svg" viewBox="0 0 760 250" role="img" aria-label="सर्किट का सरल नक्शा / simplified circuit" style="color:var(--fg)">');
 g.push('<g fill="none" stroke="currentColor" stroke-width="2">');
 g.push('<path d="M20 50H500M20 210H720M50 50V80M50 140V210M570 100H700M570 100V70M500 130H520"/>');
 g.push('<path d="M590 100V150M625 100V150M660 100V150M695 100V150"/>');
 g.push('</g>');
 g.push('<g fill="var(--surface)" stroke="currentColor" stroke-width="2">');
 g.push('<rect x="20" y="80" width="60" height="60" rx="8"/>');
 g.push('<rect x="105" y="40" width="30" height="20" fill="'+fc+'" stroke="currentColor"/>');
 g.push('<circle cx="185" cy="50" r="12" fill="'+lamp+'" fill-opacity="'+op+'"/>');
 g.push('<rect x="242" y="110" width="16" height="40"/>');
 g.push('<rect x="290" y="70" width="60" height="120"/>');
 g.push('<rect x="370" y="90" width="24" height="80"/>');
 g.push('<rect x="420" y="80" width="70" height="100"/>');
 g.push('<rect x="520" y="70" width="50" height="60"/>');
 g.push('<rect x="576" y="92" width="10" height="16"/>');
 g.push('<rect x="576" y="150" width="28" height="22"/>');
 g.push('<rect x="611" y="150" width="28" height="22"/>');
 g.push('<rect x="646" y="150" width="28" height="22"/>');
 g.push('<rect x="681" y="150" width="28" height="22"/>');
 g.push('</g>');
 g.push('<g fill="currentColor" font-size="12" font-family="IBM Plex Mono,monospace" text-anchor="middle">');
 var E=document.documentElement.lang==='en';
 var t=function(h,e){return E?e:h};
 g.push('<text x="50" y="112">AC</text><text x="50" y="128">'+t('प्लग','plug')+'</text>');
 g.push('<text x="120" y="75">'+t('फ़्यूज़','fuse')+'</text><text x="185" y="80">'+t('बल्ब','bulb')+'</text>');
 g.push('<text x="250" y="170">MOV</text>');
 g.push('<text x="320" y="135">'+t('ब्रिज','bridge')+'</text>');
 g.push('<text x="382" y="84">C</text>');
 g.push('<text x="455" y="130">MOSFET</text><text x="455" y="146">'+t('ट्रांस.','trans.')+'</text>');
 g.push('<text x="545" y="98">'+t('सेक.','sec.')+'</text>');
 g.push('<text x="590" y="165">12V</text><text x="625" y="165">5V</text><text x="660" y="165">3.3V</text><text x="695" y="165">SB</text>');
 g.push('<text x="725" y="214">GND</text>');
 g.push('</g>');
 if(c.plug&&s.bulk>0){g.push('<text x="382" y="60" fill="currentColor" font-size="11" text-anchor="middle">'+Math.round(s.bulk)+'V</text>')}
 if(c.loc!=='none'&&d.a){
  var a=d.a;
  g.push('<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+a[2]+'" y2="'+a[3]+'" stroke="#B3261E" stroke-width="5" stroke-dasharray="7 5"/>');
  g.push('<text x="'+(a[0]+(a[0]>=680?-60:8))+'" y="'+(a[1]+Math.round((a[3]-a[1])/2)+4)+'" fill="#B3261E" font-size="12" font-weight="700" font-family="IBM Plex Mono,monospace">SHORT</text>');
 }
 g.push('</svg>');
 return g.join('');
}

function slRender(){
 if(!$('sl-loc')||!$('sl-bulb'))return;
 var c={loc:$('sl-loc').value,R:+$('sl-r').value,bulb:$('sl-bulb').value,plug:slPlug};
 var s=run(c);
 var svgBox=$('sl-svg');svgBox.innerHTML=slSVG(c,s);
 var fz=s.fuse==='blown'?B('उड़ा 🔴','Blown 🔴'):B('ठीक 🟢','OK 🟢');
 var bz=s.bulb==='full'?B('पूरा चमका 🔴 (प्राइमरी शॉर्ट)','Full bright 🔴 (primary short)'):s.bulb==='flicker'?B('झपक रहा 🟠','Flickering 🟠'):s.bulb==='dim'?B('हल्का 🟢','Dim 🟢'):B('बंद / बिना बल्ब','Off / no bulb');
 var st=[];
 function row(lbHi,lbEn,val,cls){st.push('<li><b>'+B(lbHi,lbEn)+'</b><span class="'+(cls||'')+'">'+val+'</span></li>')}
 row('फ़्यूज़','Fuse',fz,s.fuse==='blown'?'bad':'ok');
 row('बल्ब','Bulb',bz,s.bulb==='full'?'bad':s.bulb==='flicker'?'warn':'ok');
 row('बल्क वोल्टेज','Bulk voltage',s.bulk.toFixed(0)+' V',(s.bulk>=300&&s.bulk<=330)?'ok':'bad');
 row('12V रेल','12V rail',s.v12.toFixed(2)+' V',(s.v12>=11.4&&s.v12<=12.6)?'ok':'bad');
 row('5V रेल','5V rail',s.v5.toFixed(2)+' V',(s.v5>=4.75&&s.v5<=5.25)?'ok':'bad');
 row('3.3V रेल','3.3V rail',s.v33.toFixed(2)+' V',(s.v33>=3.14&&s.v33<=3.47)?'ok':'bad');
 row('5VSB','5VSB',s.vsb.toFixed(2)+' V',(s.vsb>=4.75&&s.vsb<=5.25)?'ok':'bad');
 row('PG (Power Good)','PG (Power Good)',s.pg?B('हाँ','Yes'):B('नहीं','No'),s.pg?'ok':'bad');
 $('sl-status').innerHTML=st.join('');
 var say=$('sl-say');
 say.innerHTML='<h3 style="margin-top:0">'+B('इसका मतलब क्या है?','What does it mean?')+'</h3><p>'+B(s.hi,s.en)+'</p>'+
  (s.mode==='scp'?'<p>'+B('<b>अगला कदम:</b> शॉर्ट वाली रेल पर कौन सा पार्ट जुड़ा है (शॉटकी, आउटपुट कैपेसिटर, कनेक्टर) वह निकालकर अलग नापें।','<b>Next:</b> remove the part on the shorted rail (Schottky, output capacitor, connector) and measure it separately.')+'</p>':'')+
  (s.mode==='pri-fuse'?'<p>'+B('<b>अगला कदम:</b> MOSFET, ब्रिज, MOV और बल्क कैपेसिटर एक-एक करके ओम से नापें। शॉर्ट पार्ट बदलने के बाद ही नया फ़्यूज़ लगाएँ।','<b>Next:</b> check the MOSFET, bridge, MOV and bulk capacitor one by one with ohm. Fit a new fuse only after replacing the shorted part.')+'</p>':'')+
  (s.mode==='pri-bulb'?'<p>'+B('<b>अगला कदम:</b> प्लग निकालकर ऊपर वाली ओम रीडिंग से शॉर्ट की जगह ढूँढें।','<b>Next:</b> unplug and use the ohm readings above to find the short.')+'</p>':'');
 var tb=[];
 tb.push('<tr><th>'+B('पॉइंट','Point')+'</th><th>'+B('असली SMPS (ठीक)','Healthy SMPS')+'</th><th>'+B('अभी','Now')+'</th></tr>');
 ROWS.forEach(function(r){
  var head=B(r.hi,r.en),ok=B(r.okHi,r.okEn),now,cls='';
  if(r.m==='ohm'){
   var o=ohmTxt(r.p,c);
   if(o===null){now='<span class="muted">'+B('पहले प्लग निकालें','Unplug first')+'</span>';}
   else {now=o.t.replace('<span','<span');cls=o.bad?'bad':'ok';}
  }else{
   if(!c.plug){now='<span class="muted">'+B('0 V (प्लग निकला)','0 V (unplugged)')+'</span>';}
   else{
    var v=s[r.k];var good=v>=r.lo&&v<=r.hi2;
    now=v.toFixed(2)+' V';cls=good?'ok':'bad';
   }
  }
  tb.push('<tr><td>'+head+'</td><td>'+ok+'</td><td class="'+cls+'">'+now+'</td></tr>');
 });
 $('sl-table').innerHTML=tb.join('');
 refresh(svgBox);refresh(st.length?$('sl-status'):null);refresh(say);refresh($('sl-table'));
}
var slPlug=true;
$('language-toggle').addEventListener('click',function(){setTimeout(slRender,0)});
function slSetPlug(v){slPlug=v;var t1=$('sl-on'),t2=$('sl-off');if(t1)t1.setAttribute('aria-pressed',String(v));if(t2)t2.setAttribute('aria-pressed',String(!v));slRender()}
['sl-loc','sl-r','sl-bulb'].forEach(function(id){var e=$(id);if(e)e.addEventListener('change',slRender)});
var t_on=$('sl-on');if(t_on)t_on.addEventListener('click',function(){slSetPlug(true)});
var t_off=$('sl-off');if(t_off)t_off.addEventListener('click',function(){slSetPlug(false)});
var t_rs=$('sl-reset');if(t_rs)t_rs.addEventListener('click',function(){$('sl-loc').value='none';$('sl-r').value='0';$('sl-bulb').value='none';slSetPlug(true)});
slRender();

/* ---------- मापें और खराबी पकड़ें ---------- */
var DF=[
 {k:'fuse',hi:'फ़्यूज़ (प्लग निकालकर बीप टेस्ट)',en:'Fuse (beep test, unplugged)',o:[['ok','बीप / ठीक','Beep / OK'],['blown','OL (उड़ा हुआ)','OL (blown)']]},
 {k:'ntc',hi:'NTC थर्मिस्टर (ठंडा, ओम)',en:'NTC thermistor (cold, ohm)',o:[['ok','कुछ Ω (ठीक)','A few Ω (OK)'],['open','OL (टूटा)','OL (open)'],['short','लगभग 0 (शॉर्ट)','About 0 (short)']]},
 {k:'bulkohm',hi:'बल्क कैपेसिटर ओम (डिस्चार्ज, प्लग निकला)',en:'Bulk cap ohm (discharged, unplugged)',o:[['ok','OL / धीरे बढ़ता (ठीक)','OL / rising slowly (OK)'],['short','0 Ω (शॉर्ट)','0 Ω (short)']]},
 {k:'bulkv',hi:'बल्क वोल्टेज (प्लग लगाकर)',en:'Bulk voltage (plugged in)',o:[['zero','0 V','0 V'],['low','150–250 V','150–250 V'],['ok','300–325 V (ठीक)','300–325 V (OK)'],['high','330 V से ज़्यादा','Above 330 V']]},
 {k:'vsb',hi:'5VSB (प्लग लगाकर)',en:'5VSB (plugged in)',o:[['zero','0 V','0 V'],['ok','4.75–5.25 V (ठीक)','4.75–5.25 V (OK)']]},
 {k:'mosfet',hi:'MOSFET ड्रेन–सोर्स (सर्किट से निकालकर)',en:'MOSFET drain–source (out of circuit)',o:[['ok','डायोड 0.4–0.7 V एक दिशा','Diode 0.4–0.7 V one way'],['short','बीप (शॉर्ट)','Beep (short)'],['open','OL (ओपन)','OL (open)']]},
 {k:'bridge',hi:'ब्रिज डायोड (डायोड मोड, सारी जोड़ी)',en:'Bridge diodes (diode mode, all pairs)',o:[['ok','सभी ठीक','All OK'],['short','एक या ज़्यादा जोड़ी बीप','One or more pairs beep'],['open','एक जोड़ी OL','One pair OL']]},
 {k:'startr',hi:'स्टार्टअप रेसिस्टर (ओम)',en:'Startup resistor (ohm)',o:[['ok','लेबल के आसपास (ठीक)','Near label (OK)'],['open','OL (ओपन)','OL (open)']]},
 {k:'railohm',hi:'रेल – GND ओम (जैसे 12V – GND, प्लग निकला)',en:'Rail to GND ohm (e.g. 12V–GND, unplugged)',o:[['ok','सैकड़ों Ω+ (ठीक)','Hundreds of Ω+ (OK)'],['low','कुछ Ω या 0 (शॉर्ट)','A few Ω or 0 (short)']]},
 {k:'v12',hi:'12V रेल (PS_ON को GND से जोड़कर चालू)',en:'12V rail (PS_ON tied to GND, powered)',o:[['zero','0 V','0 V'],['low','10.5–11.3 V','10.5–11.3 V'],['ok','11.4–12.6 V (ठीक)','11.4–12.6 V (OK)'],['high','12.7–14 V','12.7–14 V'],['vhigh','14 V से ज़्यादा','Above 14 V']]},
 {k:'ripple',hi:'आउटपुट रिपल / कैपेसिटर',en:'Output ripple / capacitors',o:[['ok','सामान्य','Normal'],['high','रिपल ज़्यादा या कैपेसिटर गरम/फूला','High ripple or hot/bulging capacitor']]},
 {k:'bulb',hi:'बल्ब टेस्ट (60–100W सीरीज़ में, प्लग लगा)',en:'Bulb test (60–100W in series, plugged in)',o:[['off','बल्ब नहीं जला / बहुत हल्का','Bulb off / very dim'],['dim','हल्का लाल-नारंगी','Dim red-orange'],['full','पूरा चमका','Full bright']]}
];
var ORDER=['fuse','bulkohm','bulkv','bridge','mosfet','ntc','vsb','startr','railohm','v12','ripple','bulb'];
var DIAG={
 mos:{hi:'स्विचिंग MOSFET शॉर्ट',en:'Switching MOSFET shorted',
  why:['फ़्यूज़ उड़ाने वाला सबसे आम पार्ट। शॉर्ट होते ही बल्क का करंट सीधा नीचे जाता है।','The most common fuse-killer. When it shorts, bulk current flows straight to ground.'],
  c:[['प्लग निकालें, बल्क डिस्चार्ज करें।','Unplug and discharge the bulk cap.'],['MOSFET सर्किट से निकालकर ड्रेन–सोर्स डायोड मोड में नापें।','Take the MOSFET out and measure drain–source in diode mode.'],['शॉर्ट मिले तो MOSFET बदलें, साथ में गेट रेसिस्टर और स्नबर भी देखें।','If shorted, replace it and also check the gate resistor and snubber.'],['ब्रिज और स्टार्टअप रेसिस्टर भी नापें, ये अक्सर साथ में जल जाते हैं।','Also check the bridge and startup resistor, as they often burn together.'],['नया फ़्यूज़ लगाकर बल्ब सीरीज़ में पहली बार चालू करें।','Fit a new fuse and first power up with a series bulb.']]},
 bridge:{hi:'ब्रिज डायोड खराब',en:'Bridge diode faulty',
  why:['एक डायोड शॉर्ट हो तो फ़्यूज़ उड़ता है; ओपन हो तो बल्क वोल्टेज कम आता है।','A shorted diode blows the fuse; an open one gives low bulk voltage.'],
  c:[['प्लग निकालकर चारों डायोड डायोड मोड में नापें।','Unplug and check all four diodes in diode mode.'],['जो जोड़ी बीप करे या OL दे, वही खराब है।','The pair that beeps or reads OL is the faulty one.'],['पूरा ब्रिज बदलना सबसे पक्का है।','Replacing the whole bridge is the surest fix.'],['बल्ब सीरीज़ में चलाकर बल्क वोल्टेज दोबारा देखें।','Power up with a series bulb and check bulk voltage again.']]},
 mov:{hi:'MOV शॉर्ट (L–N के बीच)',en:'MOV shorted (L–N)',
  why:['MOV वोल्टेज स्पाइक पर जलता है। फ़्यूज़ तब उड़ता है जब MOV शॉर्ट हो जाए।','The MOV burns out on voltage spikes. The fuse then blows when the MOV shorts.'],
  c:[['प्लग निकालकर L–N पर ओम नापें (ठीक होने पर OL)।','Unplug and measure ohm across L–N (should be OL).'],['शॉर्ट मिले तो MOV बदलें।','If shorted, replace the MOV.'],['AC इनपुट 265 V से ऊपर तो नहीं, यह जाँचें।','Check that the AC input is not above 265 V.'],['फ़्यूज़ भी बदलें।','Replace the fuse too.']]},
 bulk:{hi:'बल्क कैपेसिटर शॉर्ट',en:'Bulk capacitor shorted',
  why:['बल्क के अंदर शॉर्ट होने से सीधा फ़्यूज़ उड़ता है।','A short inside the bulk cap blows the fuse directly.'],
  c:[['डिस्चार्ज करके ओम नापें।','Discharge and measure ohm.'],['फूला या लीक हुआ हो तो पक्का बदलें।','Replace it if it is bulging or leaking.'],['नया 400 V रेटेड और वही µF लगाएँ।','Fit a new one rated 400 V with the same µF.']]},
 dry:{hi:'बल्क कैपेसिटर सूखा (क्षमता घटी)',en:'Bulk capacitor dry (lost capacity)',
  why:['क्षमता घटने पर बल्क वोल्टेज 300 V से कम आता है और रिपल बढ़ता है।','When capacity drops, bulk voltage falls below 300 V and ripple rises.'],
  c:[['डिस्चार्ज करके क्षमता / ESR नापें।','Discharge and measure capacity / ESR.'],['लेबल के मान से 15% से कम हो तो बदलें।','Replace if it is more than 15% below its label value.'],['नया 400 V रेटेड और वही µF लगाएँ।','Fit a new one rated 400 V with the same µF.']]},
 ntc:{hi:'NTC थर्मिस्टर ओपन',en:'NTC thermistor open',
  why:['NTC टूटा हो तो AC बल्क तक नहीं पहुँचता, इसलिए बल्क 0 V रहता है।','If the NTC is open, AC never reaches the bulk, so bulk stays at 0 V.'],
  c:[['ठंडा NTC नापें (कुछ Ω होना चाहिए)।','Measure the cold NTC (it should read a few Ω).'],['OL हो तो बदलें, मान (जैसे 5 Ω) मिलाकर लें।','If OL, replace it and match the value (e.g. 5 Ω).'],['बदलने से पहले ब्रिज और बल्क शॉर्ट नहीं, यह देखें।','Before replacing, confirm the bridge and bulk are not shorted.']]},
 inlet:{hi:'AC इनपुट में टूट (तार, सॉकेट या जोड़)',en:'Break in AC input (wire, socket or joint)',
  why:['फ़्यूज़ ठीक है और NTC ठीक है, फिर भी बल्क 0 V है, तो AC रास्ते में कहीं टूट है।','Fuse and NTC are fine but bulk is 0 V, so the AC path is broken somewhere.'],
  c:[['सॉकेट और AC केबल जाँचें।','Check the socket and AC cable.'],['इनलेट पर वोल्टेज नापें (प्लग लगाकर, सावधानी से)।','Measure voltage at the inlet (plugged in, carefully).'],['ब्रिज के AC इनपुट पर वोल्टेज नापें।','Measure voltage at the bridge AC inputs.'],['जहाँ वोल्टेज रुके, उसके पहले का पार्ट/जोड़ देखें।','Check the part or joint just before where the voltage stops.']]},
 startr:{hi:'स्टार्टअप रेसिस्टर ओपन',en:'Startup resistor open',
  why:['बल्क ठीक है पर 5VSB 0 V है, यानी PWM IC को शुरू होने का वोल्टेज नहीं मिल रहा।','Bulk is fine but 5VSB is 0 V, so the PWM IC never gets its start-up voltage.'],
  c:[['प्लग निकालकर स्टार्टअप रेसिस्टर नापें।','Unplug and measure the startup resistor.'],['अक्सर कई सीरीज़ रेसिस्टर होते हैं, सभी नापें।','There are often several series resistors; measure them all.'],['OL वाला बदलें और PS_ON लगाकर 5VSB देखें।','Replace the OL one, then check 5VSB with PS_ON.']]},
 sbfail:{hi:'5VSB सर्किट में खराबी',en:'Fault in the 5VSB circuit',
  why:['बल्क ठीक है पर 5VSB 0 V है। स्टैंडबाय रेगुलेटर या उसका पार्ट खराब हो सकता है।','Bulk is fine but 5VSB is 0 V. The standby regulator or one of its parts may be faulty.'],
  c:[['5VSB रेल का GND से ओम नापें (शॉर्ट तो नहीं)।','Measure 5VSB to GND ohm (is it shorted?).'],['स्टैंडबाय रेगुलेटर और उसके कैपेसिटर देखें।','Check the standby regulator and its capacitors.']]},
 pwm:{hi:'PWM कंट्रोल या ड्राइव नहीं चल रहा (MOSFET या IC)',en:'PWM control or drive not working (MOSFET or IC)',
  why:['बल्क और 5VSB ठीक हैं, पर 12V नहीं बनता। कंट्रोल या स्विच चलना बंद है।','Bulk and 5VSB are fine but 12V is missing. The control or switch is not running.'],
  c:[['PWM IC के Vcc और ड्राइव सिग्नल की जाँच करें (स्कोप हो तो बढ़िया)।','Check the PWM IC Vcc and drive signal (a scope is ideal).'],['MOSFET ओपन हो सकता है, डायोड मोड में नापें।','The MOSFET may be open; check it in diode mode.'],['PS_ON को GND से जोड़कर चालू करें और 5VSB बदलता है या नहीं देखें।','Tie PS_ON to GND to start it and see whether the drive responds.']]},
 sec:{hi:'सेकेंडरी शॉर्ट (रेल, शॉटकी या आउटपुट कैपेसिटर)',en:'Secondary short (rail, Schottky or output capacitor)',
  why:['बल्क और 5VSB ठीक, पर रेल 0 V और ओम कम। SCP हिक-अप कर रहा है।','Bulk and 5VSB are fine, rail is 0 V and ohm is low. The SCP is hiccupping.'],
  c:[['प्लग निकालकर कम ओम वाली रेल के पार्ट अलग-अलग नापें।','Unplug and check each part on the low-ohm rail separately.'],['सेकेंडरी शॉटकी डायोड और आउटपुट कैपेसिटर निकालकर नापें।','Take out the Schottky and output capacitor and measure them.'],['शॉर्ट वाला पार्ट बदलें।','Replace the shorted part.']]},
 fb:{hi:'फ़ीडबैक खराब (TL431 / ऑप्टोकपलर)',en:'Feedback faulty (TL431 / optocoupler)',
  why:['फ़ीडबैक टूटने पर रेल बढ़ती है और OVP लैच होकर SMPS बंद करता है।','When feedback fails, the rail rises and OVP latches the SMPS off.'],
  c:[['TL431 के REF पिन पर लगभग 2.5 V नापें।','Measure about 2.5 V on the TL431 REF pin.'],['PC817 (ऑप्टो) का LED और CTR जाँचें।','Check the PC817 LED and CTR.'],['रेल ज़्यादा हो तो सावधानी से चलाएँ, लोड लगाकर देखें।','If the rail is high, run carefully and check with a load.']]},
 outcap:{hi:'आउटपुट कैपेसिटर सूखा (ESR ज़्यादा)',en:'Output capacitor dry (high ESR)',
  why:['ESR बढ़ने से रिपल बढ़ता है और रेल वोल्टेज भार में गिरता है।','High ESR raises ripple and makes the rail drop under load.'],
  c:[['आउटपुट कैपेसिटर का ESR मीटर से नापें।','Measure the output capacitors with an ESR meter.'],['फूले या लीक वाले पहले बदलें।','Replace the bulging or leaking ones first.'],['वही वोल्टेज, ऊँची µF और कम ESR वाला लगाएँ।','Fit the same voltage, higher µF and low ESR.']]}
};
function fieldHTML(f){
 var opts='<option value="">नहीं नापा / Not measured</option>'+f.o.map(function(x){return '<option value="'+x[0]+'">'+x[1]+' / '+x[2]+'</option>'}).join('');
 return '<div class="dr-field"><label for="dr-'+f.k+'">'+B(f.hi,f.en)+'</label><select id="dr-'+f.k+'">'+opts+'</select></div>';
}
var dfF=$('dr-form');if(dfF)dfF.innerHTML=DF.map(fieldHTML).join('');
function readVals(){var v={};DF.forEach(function(f){var e=$('dr-'+f.k);if(e&&e.value)v[f.k]=e.value});return v}
function diagnose(v){
 var S={};function add(k,n){S[k]=(S[k]||0)+n}
 function is(k,val){return v[k]===val}
 if(is('mosfet','short')){add('mos',60)}
 if(is('mosfet','open')){add('pwm',20)}
 if(is('bridge','short')){add('bridge',60)}
 if(is('bridge','open')){add('bridge',55)}
 if(is('fuse','blown')){
  if(is('mosfet','short'))add('mos',20);
  if(is('bridge','short'))add('bridge',20);
  if(is('bulkohm','short'))add('bulk',60);
  if(!is('mosfet','short')&&!is('bridge','short')&&!is('bulkohm','short'))add('mov',40);
  if(is('bulkohm','ok'))add('mov',15);
 }
 if(is('bulb','full')){add('mos',10);add('bridge',10);add('mov',35)}
 if(is('ntc','open'))add('ntc',70);
 if(is('bulkv','zero')&&!is('ntc','open')&&!is('fuse','blown')){
  add('inlet',40);
  if(is('bridge','ok')||!v.bridge)add('inlet',15);
 }
 if(is('bulkv','low')){add('dry',45);if(is('bridge','open'))add('bridge',20)}
 if(is('bulkv','ok')&&is('vsb','zero')){
  if(is('startr','open'))add('startr',90);else{add('sbfail',40);add('startr',10)}
 }
 if(is('bulkv','ok')&&is('vsb','ok')&&is('v12','zero')){
  if(is('railohm','low'))add('sec',85);
  else{add('pwm',60);if(is('mosfet','open'))add('pwm',20)}
 }
 if(is('v12','high'))add('fb',80);
 if(is('v12','vhigh'))add('fb',95);
 if(is('v12','low')){if(is('ripple','high'))add('outcap',75);if(is('bulkv','ok'))add('outcap',20);if(is('bulkv','low'))add('dry',20)}
 if(is('ripple','high'))add('outcap',20);
 if(is('railohm','low')&&!is('v12','zero'))add('sec',25);
 return S;
}
function card(k,score){
 var D=DIAG[k],pct=Math.min(95,score);
 var lab=score>=80?B('बहुत संभावना','Very likely'):score>=50?B('संभावना','Likely'):B('हो सकता है','Possible');
 return '<div class="dr-card"><h3>'+B(D.hi,D.en)+'</h3><p class="small">'+lab+' · '+pct+'%</p><div class="dr-bar"><i style="width:'+pct+'%"></i></div>'+
  '<p><b>'+B('क्यों:','Why:')+'</b> '+B(D.why[0],D.why[1])+'</p><ol>'+D.c.map(function(x){return '<li>'+B(x[0],x[1])+'</li>'}).join('')+'</ol></div>';
}
function runDoctor(){
 var v=readVals(),n=Object.keys(v).length,out=$('dr-out');
 if(!n){out.innerHTML='<div class="panel">'+B('पहले कम से कम एक रीडिंग भरें। बिजली बंद करके बीप वाली जाँच से शुरू करना सबसे अच्छा है।','Fill in at least one reading first. It is best to start with the unplugged beep tests.')+'</div>';refresh(out);return}
 var S=diagnose(v);
 var keys=Object.keys(S).filter(function(k){return S[k]>=30}).sort(function(a,b){return S[b]-S[a]}).slice(0,3);
 var h='<div class="dr-grid">';
 if(keys.length){keys.forEach(function(k){h+=card(k,S[k])})}
 else{
  var nxt=ORDER.filter(function(k){return !v[k]})[0];
  var nm=nxt?DF.filter(function(f){return f.k===nxt})[0]:null;
  h+='<div class="dr-card" style="grid-column:1/-1"><h3>'+B('अभी पक्का निदान नहीं','Not conclusive yet')+'</h3><p>'+B('और रीडिंग चाहिए। अगला नापें: ','More readings needed. Measure next: ')+(nm?B(nm.hi,nm.en):'')+'</p></div>';
 }
 h+='</div>';
 if(keys.length){h+='<p class="small">'+B('ये कार्ड आपकी रीडिंग से बने हैं। एक-एक करके ठीक करें और हर बार चालू करके जाँचें। एक से ज़्यादा खराबी भी हो सकती है।','These cards come from your readings. Fix one at a time and re-test each time. More than one fault can exist.')+'</p>'}
 if(keys.length&&S[keys[0]]>=50){h='<div class="dr-alert" role="alert">⚠ <b>'+B("खराबी मिली: ","Fault found: ")+'</b>'+B(DIAG[keys[0]].hi,DIAG[keys[0]].en)+'</div>'+h;try{if(window.__smpsAudio)window.__smpsAudio.play("danger")}catch(e){}}
 out.innerHTML=h;refresh(out);
}
var dg=$('dr-go');if(dg)dg.addEventListener('click',runDoctor);
var dc=$('dr-clear');if(dc)dc.addEventListener('click',function(){DF.forEach(function(f){var e=$('dr-'+f.k);if(e)e.value=''});var dao=$('dr-out');if(dao)dao.innerHTML='';});
})();
