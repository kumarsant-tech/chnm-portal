
/* ===== CITS प्रैक्टिकल: छोटे इंटरैक्टिव टूल (हर टूल अलग, कुछ टूटे तो बाकी चलते रहें) ===== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
function safe(name,fn){try{fn()}catch(e){if(window.console)console.warn('CITS '+name,e)}}
var PI=Math.PI;
/* ---------- मौजूदा पैनलों में आधारित ब्लॉक जोड़ना (कार्ड-स्क्रिप्ट के बाद, ताकि वे बंद न हों) ---------- */
safe('blocks',function(){
  document.querySelectorAll('template[data-sec]').forEach(function(t){var sec=$(t.getAttribute('data-sec'));if(sec)sec.appendChild(t.content.cloneNode(true))});
});
/* ---------- चित्र एक बार रखकर हर जगह लगाना ---------- */
safe('imgs',function(){
  var images=Array.prototype.slice.call(document.querySelectorAll('img[data-k]'));
  var gallery=document.getElementById('gal');
  if(!images.length&&!gallery)return;
  var targets=images.slice();
  if(gallery)targets.push(gallery);
  var started=false;
  function loadImages(){
    if(started)return;
    started=true;
    fetch('/assets/data/cits-images.json').then(function(response){if(!response.ok)throw new Error('image data '+response.status);return response.json();}).then(function(map){
      window.CITS_IMG=map;
      document.dispatchEvent(new Event('cits-images-ready'));
      images.forEach(function(image){var source=map[image.getAttribute('data-k')];if(source)image.src=source;});
    }).catch(function(error){started=false;if(window.console)console.warn('CITS images unavailable',error);});
  }
  images.forEach(function(image){image.loading='lazy';image.decoding='async';});
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){if(entries.some(function(entry){return entry.isIntersecting;})){observer.disconnect();loadImages();}},{rootMargin:'240px'});
    targets.forEach(function(image){observer.observe(image);});
  }else if('requestIdleCallback' in window){requestIdleCallback(loadImages,{timeout:2500});}
  else{window.setTimeout(loadImages,1200);}
});
/* ---------- चित्र ज़ूम (लाइटबॉक्स) ---------- */
safe('lightbox',function(){
  var lb=document.createElement('div');lb.className='cits-lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-label','चित्र बड़ा करके देखें');
  lb.innerHTML='<button type="button" aria-label="बंद करें">✕</button><img alt="">';document.body.appendChild(lb);
  var im=lb.querySelector('img');function close(){lb.classList.remove('on')}
  lb.addEventListener('click',close);document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
  document.addEventListener('click',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.closest&&t.closest('.cits-fig')){im.src=t.src;im.alt=t.alt;lb.classList.add('on')}});
});
/* ---------- चेकलिस्ट + प्रगति ---------- */
safe('checklist',function(){
  document.querySelectorAll('ol.cits-steps[data-prog]').forEach(function(ol){
    var id=ol.getAttribute('data-prog'),bar=$(id+'-bar'),txt=$(id+'-txt');
    function upd(){var all=ol.querySelectorAll('input[type=checkbox]'),n=0;all.forEach(function(c){if(c.checked)n++;c.closest('li').classList.toggle('done',c.checked)});
      if(bar)bar.style.width=(all.length?n/all.length*100:0)+'%';if(txt)txt.textContent=n+' / '+all.length+' कदम पूरे'+(n===all.length&&all.length?' 🎉 प्रैक्टिकल पूरा!':'')}
    ol.addEventListener('change',upd);upd();
  });
});
/* ---------- कॉपी बटन (प्रैक्टिकल फ़ाइल के लिए) ---------- */
safe('copy',function(){
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-copy]');if(!b)return;
    var pre=$(b.getAttribute('data-copy'));if(!pre)return;var t=pre.innerText;
    var done=function(){var o=b.textContent;b.textContent='✔ कॉपी हो गया';setTimeout(function(){b.textContent=o},1600)};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,function(){});
    else{var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done()}catch(_){}document.body.removeChild(ta)}
  });
});
/* ---------- रीडिंग चेकर (ATX रेल) ---------- */
safe('reading',function(){
  var sel=$('ct-rc-rail');if(!sel)return;var inp=$('ct-rc-val'),out=$('ct-rc-out');
  var R={
   '12V':{n:'+12V (पीला)',lo:11.4,hi:12.6,nom:12,low:'पंखा/HDD कमज़ोर चलते हैं, PC रीस्टार्ट। कारण: 12V का आउटपुट कैपेसिटर सूखा, शॉटकी डायोड कमज़ोर, ओवरलोड, फ़ीडबैक (TL431/ऑप्टो) गड़बड़।',high:'खतरनाक: फ़ीडबैक टूटा हो सकता (TL431 या ऑप्टो खराब)। तुरंत बंद करें।'},
   '5V':{n:'+5V (लाल)',lo:4.75,hi:5.25,nom:5,low:'USB/मदरबोर्ड अटकते हैं। कारण: 5V का कैपेसिटर या डायोड कमज़ोर, लोड ज़्यादा।',high:'मदरबोर्ड जल सकता है। फ़ीडबैक जाँचें।'},
   '3.3V':{n:'+3.3V (नारंगी)',lo:3.135,hi:3.465,nom:3.3,low:'मेमोरी/चिपसेट में दिक्कत। कारण: 3.3V की चेन (मैग-एम्प/रेगुलेटर) या कैपेसिटर।',high:'ऊँची 3.3V रेल: रेगुलेटर खराब। बंद करें।'},
   '5VSB':{n:'5VSB (बैंगनी)',lo:4.75,hi:5.25,nom:5,low:'पावर बटन से PC नहीं जागता। कारण: स्टैंडबाय सेक्शन (छोटा ट्रांसफ़ॉर्मर, उसका IC, 5VSB डायोड/कैप)।',high:'स्टैंडबाय सेक्शन खराब।'},
   '-12V':{n:'−12V (नीला)',lo:-13.2,hi:-10.8,nom:-12,low:'(अधिक नकारात्मक: −13.2 V से नीचे) रेगुलेटर/डायोड जाँचें।',high:'(−10.8 V से कम नकारात्मक) पुराने सीरियल/ऑडियो सर्किट प्रभावित। −12V डायोड/रेगुलेटर देखें।'},
   'PG':{n:'PWR_OK / PG (ग्रे)',lo:2.4,hi:5.25,nom:5,low:'PG नहीं बना: कोई रेल गड़बड़ है, या सुपरवाइज़र IC। PC चालू नहीं होगा।',high:'सीमा से ऊपर: जाँचें।'}
  };
  Object.keys(R).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=R[k].n;sel.appendChild(o)});
  function go(){var r=R[sel.value],v=parseFloat(inp.value);
    if(isNaN(v)){out.innerHTML='<div class="cits-verdict mid">मीटर की रीडिंग लिखें।</div>';return}
    var dev=r.nom?((v-r.nom)/Math.abs(r.nom)*100):0,cls,msg;
    if(v>=r.lo&&v<=r.hi){cls='ok';msg='✔ सही: '+r.n+' सीमा में है ('+r.lo+' से '+r.hi+' V)।'}
    else if(v<r.lo&&r.nom>0||v>r.hi&&r.nom<0){cls='no';msg='✖ कम: '+r.n+' सीमा से नीचे है। '+r.low}
    else{cls='no';msg='✖ ज़्यादा: '+r.n+' सीमा से ऊपर है। '+r.high}
    if(v>=r.lo&&v<=r.hi&&Math.abs(dev)>3&&r.nom!==5&&sel.value!=='PG')msg+=' (सीमा के किनारे के पास है, लोड लगाकर फिर देखें।)';
    out.innerHTML='<div class="cits-out"><span><em>रीडिंग</em>'+v+' V</span><span><em>सही सीमा</em>'+r.lo+' से '+r.hi+' V</span><span class="'+(cls==='ok'?'':'bad')+'"><em>फ़र्क़</em>'+(dev>=0?'+':'')+dev.toFixed(1)+' %</span></div><div class="cits-verdict '+cls+'">'+msg+'</div>';}
  sel.addEventListener('change',go);inp.addEventListener('input',go);go();
});
/* ---------- वर्चुअल SCR टेस्टर ---------- */
safe('scr',function(){
  var st=$('ct-scr-state');if(!st)return;var rd=$('ct-scr-red'),bk=$('ct-scr-black'),lat=$('ct-scr-latch'),lcd=$('ct-scr-lcd'),ver=$('ct-scr-ver');
  var pins=[['A','A एनोड'],['K','K कैथोड'],['G','G गेट']];
  [rd,bk].forEach(function(s,i){pins.forEach(function(p){var o=document.createElement('option');o.value=p[0];o.textContent=p[1];s.appendChild(o)});s.value=i?'K':'A'});
  function read(){
    var s=st.value,r=rd.value,b=bk.value,latched=lat.checked;
    if(r===b)return ['0.000 V','दोनों प्रोब एक ही पिन पर हैं।'];
    var key=r+b;
    if(s==='akshort'){if(key==='AK'||key==='KA')return ['0.000 V 🔔','A–K शॉर्ट: दोनों दिशा में बीप।'];}
    if(s==='open'&&(key==='AK'||key==='KA'))return ['OL','A–K ओपन है।'];
    if(s==='gopen'&&(key==='GK'||key==='KG'))return ['OL','गेट–कैथोड बिल्कुल ओपन।'];
    if(key==='GK')return ['0.62 V','गेट–कैथोड जंक्शन डायोड जैसा चालू (कुछ SCR में थोड़ा अलग)।'];
    if(key==='AK'&&latched&&(s==='good'||s==='gopen'))return ['0.85 V','गेट से ट्रिगर के बाद SCR चालू (latch) हुआ: एनोड–कैथोड पर कम वोल्टेज ड्रॉप।'];
    if(key==='AK'&&latched&&s==='nolatch')return ['OL','ट्रिगर के बाद भी चालू नहीं हुआ (या मीटर का करंट होल्डिंग करंट से कम है)।'];
    return ['OL','इस पिन-जोड़ी पर कोई जंक्शन नहीं बनता: OL आना सही है।'];
  }
  function verdict(){
    var s=st.value,m={good:['ok','SCR की हालत: ठीक। A–K दोनों ओर OL, G–K पर डायोड जैसा ≈0.6 V।'],
      akshort:['no','SCR की हालत: खराब (A–K शॉर्ट)। बदलें।'],open:['no','SCR की हालत: खराब (A–K ओपन, कभी चालू नहीं होगा)।'],
      gopen:['no','SCR की हालत: खराब (गेट ओपन)। बदलें।'],nolatch:['mid','सावधानी: गेट–कैथोड ठीक है पर चालू नहीं हुआ। कारण: SCR कमज़ोर, या मीटर का करंट बहुत कम। बैटरी-बल्ब टेस्ट से पक्का करें।']}[s];
    ver.className='cits-verdict '+m[0];ver.textContent=m[1];
  }
  function go(){var x=read();lcd.innerHTML=x[0]+'<small>'+x[1]+'</small>'}
  [st,rd,bk,lat].forEach(function(e){e.addEventListener('change',go)});st.addEventListener('change',verdict);go();verdict();
});
/* ---------- हाफ-वेव SCR रेक्टिफ़ायर ---------- */
safe('halfwave',function(){
  var cv=$('ct-hw-cv');if(!cv)return;var vac=$('ct-hw-v'),al=$('ct-hw-a'),out=$('ct-hw-out'),ctx=cv.getContext('2d');
  function draw(){
    var V=+vac.value,a=+al.value,ar=a*PI/180,Vm=V*Math.SQRT2;
    var Vdc=Vm/(2*PI)*(1+Math.cos(ar)),Vrms=Vm*Math.sqrt(((PI-ar)+Math.sin(2*ar)/2)/(4*PI));
    $('ct-hw-vo').textContent=V+' V';$('ct-hw-ao').textContent=a+'°';
    out.innerHTML='<span><em>पीक Vm</em>'+Vm.toFixed(1)+' V</span><span><em>आउटपुट DC (औसत)</em>'+Vdc.toFixed(2)+' V</span><span><em>आउटपुट RMS</em>'+Vrms.toFixed(2)+' V</span><span class="warn"><em>असल में (SCR ड्रॉप ≈1V)</em>≈ '+Math.max(0,Vdc-0.45).toFixed(2)+' V</span>';
    var W=cv.width,H=cv.height;ctx.fillStyle='#06120c';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#17402c';ctx.lineWidth=1;
    for(var i=0;i<=8;i++){ctx.beginPath();ctx.moveTo(i*W/8,0);ctx.lineTo(i*W/8,H);ctx.stroke()}
    var mid=H/2,sc=(H/2-14)/Vm;ctx.strokeStyle='#2f7a55';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();ctx.setLineDash([]);
    function x(t){return t/(4*PI)*W}
    ctx.strokeStyle='#4a86c9';ctx.lineWidth=1.6;ctx.beginPath();for(var t=0;t<=4*PI;t+=.05){var y=mid-Vm*Math.sin(t)*sc;t?ctx.lineTo(x(t),y):ctx.moveTo(x(t),y)}ctx.stroke();
    ctx.fillStyle='rgba(109,255,154,.28)';ctx.strokeStyle='#6dff9a';ctx.lineWidth=2.4;
    for(var c=0;c<2;c++){var o=c*2*PI;ctx.beginPath();ctx.moveTo(x(o+ar),mid);for(var t2=ar;t2<=PI+.001;t2+=.03){ctx.lineTo(x(o+t2),mid-Vm*Math.sin(t2)*sc)}ctx.lineTo(x(o+PI),mid);ctx.closePath();ctx.fill();ctx.stroke()}
    ctx.fillStyle='#ffd24a';for(var c2=0;c2<2;c2++){var gx=x(c2*2*PI+ar);ctx.beginPath();ctx.moveTo(gx,H-6);ctx.lineTo(gx-5,H-18);ctx.lineTo(gx+5,H-18);ctx.closePath();ctx.fill()}
    ctx.fillStyle='#9dffc6';ctx.font='12px sans-serif';ctx.fillText('नीली लहर: AC इनपुट · हरा भाग: लोड पर आउटपुट · पीले तीर: गेट ट्रिगर (फायरिंग एंगल)',8,16);
  }
  vac.addEventListener('input',draw);al.addEventListener('input',draw);draw();
});
/* ---------- इनवर्टिंग ऑप-एम्प ---------- */
safe('opamp',function(){
  var cv=$('ct-op-cv');if(!cv)return;var vin=$('ct-op-vin'),ri=$('ct-op-rin'),rf=$('ct-op-rf'),vs=$('ct-op-vs'),out=$('ct-op-out'),ctx=cv.getContext('2d');
  function draw(){
    var Vp=+vin.value,Rin=+ri.value,Rf=+rf.value,Vsup=+vs.value,A=-Rf/Rin,sat=Vsup-2,Vo=A*Vp,clip=Math.abs(Vo)>sat;
    $('ct-op-vino').textContent=Vp.toFixed(2)+' V';
    out.innerHTML='<span><em>गेन = −Rf/Rin</em>'+A.toFixed(1)+'</span><span><em>आउटपुट पीक (सिद्धांत)</em>'+(Math.abs(Vo)).toFixed(2)+' V</span><span class="'+(clip?'bad':'')+'"><em>सीमा (±)</em>'+sat+' V</span><span class="'+(clip?'bad':'')+'"><em>असली आउटपुट पीक</em>'+Math.min(Math.abs(Vo),sat).toFixed(2)+' V</span>'+(clip?'<span class="bad"><em>चेतावनी</em>सिग्नल कट रहा है, इनपुट घटाएँ</span>':'');
    var W=cv.width,H=cv.height;ctx.fillStyle='#06120c';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#17402c';ctx.lineWidth=1;
    for(var i=0;i<=8;i++){ctx.beginPath();ctx.moveTo(i*W/8,0);ctx.lineTo(i*W/8,H);ctx.stroke()}for(var j=0;j<=6;j++){ctx.beginPath();ctx.moveTo(0,j*H/6);ctx.lineTo(W,j*H/6);ctx.stroke()}
    var mid=H/2,lim=Vsup+1,sc=(H/2-6)/lim;ctx.strokeStyle='#2f7a55';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();
    ctx.strokeStyle='#a33';ctx.beginPath();ctx.moveTo(0,mid-sat*sc);ctx.lineTo(W,mid-sat*sc);ctx.moveTo(0,mid+sat*sc);ctx.lineTo(W,mid+sat*sc);ctx.stroke();ctx.setLineDash([]);
    ctx.lineWidth=2;ctx.strokeStyle='#58a6ff';ctx.beginPath();for(var t=0;t<=W;t+=2){var th=t/W*4*PI,y=mid-Vp*Math.sin(th)*sc;t?ctx.lineTo(t,y):ctx.moveTo(t,y)}ctx.stroke();
    ctx.strokeStyle='#6dff9a';ctx.beginPath();for(var t2=0;t2<=W;t2+=2){var th2=t2/W*4*PI,v=Math.max(-sat,Math.min(sat,A*Vp*Math.sin(th2))),y2=mid-v*sc;t2?ctx.lineTo(t2,y2):ctx.moveTo(t2,y2)}ctx.stroke();
    ctx.fillStyle='#9dffc6';ctx.font='12px sans-serif';ctx.fillText('नीला: इनपुट · हरा: आउटपुट (उल्टा, बढ़ा हुआ) · लाल बिंदीदार: सप्लाई की सीमा',8,16);
  }
  [vin,ri,rf,vs].forEach(function(e){e.addEventListener('input',draw)});draw();
});
/* ---------- 7805 / 7812 गर्मी ---------- */
safe('reg78',function(){
  var ty=$('ct-rg-type');if(!ty)return;var vi=$('ct-rg-vin'),il=$('ct-rg-i'),hs=$('ct-rg-hs'),out=$('ct-rg-out'),vd=$('ct-rg-ver');
  function go(){
    var typ=ty.value==='7805'?5:12,Vin=+vi.value,I=+il.value/1000,minIn=typ+2.5;
    $('ct-rg-vo').textContent=Vin+' V';$('ct-rg-io').textContent=Math.round(I*1000)+' mA';
    var P=Math.max(0,(Vin-typ)*I),th=hs.checked?25:65,Tj=30+P*th,ok=Vin>=minIn,Vo=ok?typ:Math.max(0,Vin-2);
    out.innerHTML='<span><em>आउटपुट</em>'+Vo.toFixed(2)+' V</span><span class="'+(P>1.5?'warn':'')+'"><em>गरमी (P)</em>'+P.toFixed(2)+' W</span><span class="'+(Tj>125?'bad':Tj>90?'warn':'')+'"><em>अनुमानित तापमान</em>'+Tj.toFixed(0)+' °C</span><span><em>कम से कम इनपुट</em>'+minIn+' V</span>';
    var c,m;
    if(!ok){c='no';m='इनपुट बहुत कम ('+Vin+' V): रेगुलेटर को आउटपुट से कम से कम 2–2.5 V ऊपर चाहिए। आउटपुट '+typ+' V नहीं बनेगा।'}
    else if(Tj>125){c='no';m='ज़्यादा गरम: हीटसिंक लगाएँ, इनपुट घटाएँ या करंट घटाएँ। (150 °C पर IC अपने आप बंद होगा।)'}
    else if(Tj>90){c='mid';m='काफ़ी गरम। हीटसिंक लगाना बेहतर।'}
    else{c='ok';m='ठीक: आउटपुट '+typ+' V स्थिर, गरमी सीमा में।'}
    if(Vin>25&&c!=='no'){c='no';m='इनपुट बहुत ज़्यादा ('+Vin+' V): 25 V से ऊपर न दें।'}
    vd.className='cits-verdict '+c;vd.textContent=m;
  }
  [ty,vi,il,hs].forEach(function(e){e.addEventListener('input',go);e.addEventListener('change',go)});go();
});
/* ---------- LM317 ---------- */
safe('lm317',function(){
  var r1=$('ct-lm-r1');if(!r1)return;var r2=$('ct-lm-r2'),vi=$('ct-lm-vin'),out=$('ct-lm-out'),vd=$('ct-lm-ver');
  function go(){
    var R1=+r1.value,R2=+r2.value,Vin=+vi.value;$('ct-lm-r2o').textContent=R2+' Ω';$('ct-lm-vino').textContent=Vin+' V';
    var Vout=1.25*(1+R2/R1)+0.00005*R2,need=Vout+3,ok=Vin>=need;
    out.innerHTML='<span><em>आउटपुट (सूत्र)</em>'+Vout.toFixed(2)+' V</span><span class="'+(ok?'':'bad')+'"><em>कम से कम इनपुट</em>'+need.toFixed(1)+' V</span><span><em>R2/R1</em>'+(R2/R1).toFixed(2)+'</span>';
    vd.className='cits-verdict '+(ok?'ok':'no');vd.textContent=ok?'ठीक: इनपुट काफ़ी है, आउटपुट '+Vout.toFixed(2)+' V मिलेगा।':'इनपुट कम है: आउटपुट '+Vout.toFixed(1)+' V पाने के लिए कम से कम '+need.toFixed(1)+' V इनपुट चाहिए।';
  }
  [r1,r2,vi].forEach(function(e){e.addEventListener('input',go)});go();
});
/* ---------- लक्षण से खराबी ---------- */
safe('symptom',function(){
  var sel=$('ct-sy-sel');if(!sel)return;var box=$('ct-sy-out');
  var S={
   dead:{t:'बिल्कुल मुर्दा: पंखा नहीं घूमता, कोई रेल नहीं',s:['AC केबल, सॉकेट और स्विच जाँचें; पेपर-क्लिप टेस्ट ठीक से लगा है या नहीं।','बिजली बंद + डिस्चार्ज करके फ़्यूज़ की कंटीन्युटी देखें। उड़ा हो तो साथ में वजह खोजें।','ब्रिज के चारों डायोड (डायोड मोड) और बल्क कैपेसिटर देखें।','MOSFET का D–S शॉर्ट देखें (शॉर्ट हो तो फ़्यूज़ भी उड़ता है)।','स्टार्टअप रेसिस्टर और PWM IC की VCC सप्लाई (चालू बोर्ड पर बहुत सावधानी, या बंद करके रेसिस्टर नापें)।'],p:'फ़्यूज़, NTC, ब्रिज, बल्क कैप, स्विचिंग MOSFET, स्टार्टअप रेसिस्टर, PWM IC।'},
   partial:{t:'पंखा घूमता है, पर कोई-कोई रेल 0 है',s:['मल्टीमीटर DC मोड में हर रेल और काले तार (COM) के बीच रीडिंग लें।','0 वाली रेल के आउटपुट डायोड (शॉटकी) बंद करके डायोड-मोड में देखें।','उस रेल का फ़िल्टर कैपेसिटर और कॉइल (ब्रेक तो नहीं) जाँचें।','5VSB और PS_ON (हरा तार) की रीडिंग देखें।'],p:'उस रेल का शॉटकी डायोड, कॉइल, फ़िल्टर कैपेसिटर, कनेक्टर की ढीली पिन।'},
   low:{t:'आउटपुट वोल्टेज कम है',s:['पहले लोड हटाकर नापें (ओवरलोड तो नहीं?)।','किसी रेल पर शॉर्ट तो नहीं: बिजली बंद करके रेल और COM के बीच रेसिस्टेंस (कुछ सौ ओम से ऊपर आना चाहिए)।','फ़ीडबैक: TL431 और ऑप्टोकपलर, डिवाइडर रेसिस्टर देखें।','आउटपुट कैपेसिटर की क्षमता (कैप मोड) देखें।'],p:'फ़ीडबैक (TL431/ऑप्टो), सूखा आउटपुट कैपेसिटर, कमज़ोर शॉटकी, ओवरलोड।'},
   hic:{t:'क्लिक-क्लिक या बार-बार चालू-बंद (हिकअप)',s:['लोड हटाकर देखें: चलता है तो ओवरलोड/शॉर्ट सेकेंडरी में।','सेकेंडरी में शॉर्ट: शॉटकी डायोड और बड़े कैपेसिटर बंद करके जाँचें।','PWM IC की सप्लाई (VCC) कैपेसिटर और ऑक्स डायोड देखें।','करंट-सेंस रेसिस्टर देखें।'],p:'शॉर्ट शॉटकी/कैपेसिटर, VCC कैपेसिटर, ऑक्स डायोड, ओवरलोड।'},
   noise:{t:'सीटी / भिनभिनाहट / ज़्यादा शोर',s:['जिस रेल पर हो, रिपल देखें (AC वोल्ट मोड, mV)।','आउटपुट कैपेसिटर की क्षमता और फूले होने के निशान देखें।','बल्क कैपेसिटर सूखा तो नहीं।','ट्रांसफ़ॉर्मर/कॉइल ढीले तो नहीं।'],p:'सूखे कैपेसिटर (बल्क या आउटपुट), ढीला ट्रांसफ़ॉर्मर, कमज़ोर फ़ीडबैक।'},
   reset:{t:'PC अपने आप रीस्टार्ट/हैंग (रेल ठीक दिखती है)',s:['लोड के साथ रेल की रीडिंग देखें (गिरती तो नहीं)।','12V और 5V का रिपल देखें।','PG (ग्रे तार) की रीडिंग 5V स्थिर है या नहीं।','आउटपुट कैपेसिटर बदलकर देखें (सबसे आम कारण)।'],p:'सूखे आउटपुट कैपेसिटर, कमज़ोर शॉटकी, PG सर्किट, ओवरलोड।'},
   fuse:{t:'फ़्यूज़ बार-बार उड़ता है',s:['बिना सोचे नया फ़्यूज़ न लगाएँ: पहले वजह खोजें।','ब्रिज के चारों डायोड शॉर्ट तो नहीं (डायोड मोड)।','बल्क कैपेसिटर शॉर्ट तो नहीं (कैप मोड / Ω)।','स्विचिंग MOSFET का D–S शॉर्ट।','पहली बार चालू करते समय सीरीज़ में 100W का बल्ब लगाएँ।'],p:'ब्रिज डायोड, बल्क कैपेसिटर, स्विचिंग MOSFET, MOV/X-कैप।'}
  };
  Object.keys(S).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=S[k].t;sel.appendChild(o)});
  function go(){var x=S[sel.value];box.innerHTML='<p><b>जाँच के कदम (क्रम से):</b></p><ol class="cits-steps">'+x.s.map(function(s){return '<li><span>'+s+'</span></li>'}).join('')+'</ol><div class="cits-call tip"><i>🎯</i><div><b>सबसे संभावित खराब पार्ट</b><p>'+x.p+'</p></div></div>'}
  sel.addEventListener('change',go);go();
});
/* ---------- सर्किट पथ (ट्रेस) ---------- */
safe('trace',function(){
  document.querySelectorAll('.cits-path[data-detail]').forEach(function(p){
    var d=$(p.getAttribute('data-detail'));p.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
      p.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});d.innerHTML=b.getAttribute('data-t')});
  });
});
/* ---------- प्रैक्टिकल 2 का परिणाम-लेखक ---------- */
safe('p2result',function(){
  var sel=$('ct-p2-sel');if(!sel)return;var pre=$('res-p2');
  function go(){pre.textContent='SMPS को पेपर-क्लिप टेस्ट और मल्टीमीटर से जाँचा गया। आउटपुट वोल्टेज '+(sel.value==='ok'?'सामान्य सीमा में':'सामान्य सीमा से बाहर')+' पाए गए। इस प्रकार SMPS '+(sel.value==='ok'?'सही कार्य कर रहा है।':'खराब है।')}
  sel.addEventListener('change',go);go();
});
})();

