
/* ===== जुड़ाव: सिमुलेटर के बटन, ATX सिमुलेटर, OVP सिमुलेटर, क्विज़, गैलरी ===== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
function safe(n,f){try{f()}catch(e){if(window.console)console.warn('CITS2 '+n,e)}}
/* ---------- "करके देखें" बटन: सिमुलेटर की हालत सेट करके पैनल खोलना ---------- */
safe('go',function(){
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-go]');if(!b)return;
    var X=window.__bx,raw=b.getAttribute('data-do'),ops=raw?JSON.parse(raw):null;
    if(ops&&X){var st=X.st;
      if(ops.reset){X.allOk();st.plug=true;st.disch=false;st.ac=230;st.w=150;st.ps=true;st.fsw=65;st.hz=50;st.temp=40;st.hotT=0;st.log=[];st.bulkV=300}
      if(ops.f)Object.keys(ops.f).forEach(function(k){if(X.CM&&X.CM[k]){st.c[k]=ops.f[k];st.flash.push(k)}});
      ['ac','w','fsw','hz'].forEach(function(k){if(k in ops)st[k]=ops[k]});
      if('ps' in ops)st.ps=ops.ps;if('plug' in ops)st.plug=ops.plug;
      [['rs-ac','ac'],['rs-w','w'],['rs-hz','hz'],['rs-fs','fsw'],['bx-ac','ac'],['bx-w','w'],['bx-hz','hz'],['bx-fs','fsw']].forEach(function(p){var el=$(p[0]);if(el){el.value=st[p[1]];el.dispatchEvent(new Event('input'))}});
      ['rs-plug','rs-ps','bx-plug','bx-ps'].forEach(function(id){var el=$(id);if(el){el.click();el.click()}});
      if(X.log&&ops.f)X.log('📘 CITS: '+Object.keys(ops.f).map(function(k){return X.CM[k].s+' → '+X.MI[ops.f[k]]}).join(', ')+' लगाया गया।');
    }
    var t=b.getAttribute('data-go');
    if(window.__panels&&window.__panels.show)window.__panels.show(t);else location.hash='#'+t;
    var at=b.getAttribute('data-at')||t;
    setTimeout(function(){var el=$(at);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},450);
    if(at==='rs-tour')setTimeout(function(){var s=$('rs-tstart');if(s)s.click()},700);
  });
});
/* ---------- फ़्रीक्वेंसी बनाम कोर ---------- */
safe('hvf',function(){
  var f=$('hv-f');if(!f)return;var out=$('hv-out');
  function go(){var k=+f.value;$('hv-fo').textContent=k+' kHz';var rel=(0.05/k)*100;
    out.innerHTML='<span><em>50 Hz की तुलना में कोर का आकार (मोटा)</em>लगभग '+(rel<0.1?rel.toFixed(3):rel.toFixed(2))+' %</span><span><em>कितना गुना छोटा</em>≈ '+Math.round(k/0.05)+' गुना</span>'}
  f.addEventListener('input',go);go();
});
/* ---------- OVP क्राउबार सिमुलेटर ---------- */
safe('ovp',function(){
  var cv=$('ov-cv');if(!cv)return;var ctx=cv.getContext('2d'),stSel=$('ov-state'),th=$('ov-th'),out=$('ov-out'),ver=$('ov-ver');
  var S={t:0,run:false,v:12,fired:false,fireT:0,log:[],dead:false};
  function reset(){S={t:0,run:false,v:stSel.value==='scrshort'?0.8:12,fired:false,fireT:0,log:[],dead:false};draw();txt()}
  function step(dt){
    if(!S.run)return;S.t+=dt;var s=stSel.value,T=+th.value;
    if(s==='scrshort'){S.v=0.8}
    else if(S.fired){var k=S.t-S.fireT;S.v=Math.max(0,1.1*Math.exp(-k*3)+0.1*Math.max(0,1-k));if(k>1.5)S.dead=true}
    else{S.v=Math.min(17.5,12+4.2*S.t);if(S.v>=T+0.7&&(s==='ok')){S.fired=true;S.fireT=S.t;S.v=T+0.7}}
    S.log.push([S.t,S.v]);if(S.log.length>900)S.log.shift();if(S.t>6){S.run=false}
  }
  function draw(){
    var W=cv.width,H=cv.height;ctx.fillStyle='#06120c';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#17402c';ctx.lineWidth=1;
    for(var i=0;i<=8;i++){ctx.beginPath();ctx.moveTo(i*W/8,0);ctx.lineTo(i*W/8,H);ctx.stroke()}for(var j=0;j<=6;j++){ctx.beginPath();ctx.moveTo(0,j*H/6);ctx.lineTo(W,j*H/6);ctx.stroke()}
    var vmax=20,y=function(v){return H-6-(v/vmax)*(H-16)},x=function(t){return 8+t/6*(W-16)};
    ctx.setLineDash([6,5]);ctx.strokeStyle='#a33';var T=+th.value;ctx.beginPath();ctx.moveTo(0,y(T+0.7));ctx.lineTo(W,y(T+0.7));ctx.stroke();ctx.strokeStyle='#2f7a55';ctx.beginPath();ctx.moveTo(0,y(12));ctx.lineTo(W,y(12));ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#9dffc6';ctx.font='12px sans-serif';ctx.fillText('रेल की वोल्टेज (V) · लाल रेखा: SCR चालू होने की वोल्टेज · हरी रेखा: 12 V',8,14);
    ctx.strokeStyle='#6dff9a';ctx.lineWidth=2.4;ctx.beginPath();
    if(S.log.length){S.log.forEach(function(p,i){var px=x(p[0]),py=y(p[1]);i?ctx.lineTo(px,py):ctx.moveTo(px,py)})}else{ctx.moveTo(x(0),y(S.v));ctx.lineTo(x(0.3),y(S.v))}
    ctx.stroke();
    if(S.fired){ctx.fillStyle='#ffd24a';ctx.beginPath();ctx.arc(x(S.fireT),y(T+0.7),6,0,7);ctx.fill();ctx.fillText('SCR चालू',x(S.fireT)+10,y(T+0.7)-8)}
  }
  function txt(){
    var s=stSel.value,T=+th.value;$('ov-tho').textContent=T.toFixed(1)+' V';
    out.innerHTML='<span><em>रेल अभी</em>'+S.v.toFixed(1)+' V</span><span><em>SCR चालू होने पर</em>≈ '+(T+0.7).toFixed(1)+' V</span><span class="'+(S.v>15.5&&!S.fired?'bad':'')+'"><em>पुर्ज़ों के लिए</em>'+(S.v>15.5&&!S.fired?'खतरा':'ठीक')+'</span>';
    var c,m;
    if(!S.run&&S.t===0){c='mid';m='शुरू करने के लिए "फ़ीडबैक तोड़ो" दबाएँ।'}
    else if(s==='scrshort'){c='no';m='SCR शॉर्ट: रेल हमेशा लगभग 1 V पर, SMPS चालू ही नहीं हो पाता (हिकअप या डेड)। SCR बदलना होगा।'}
    else if(S.fired){c='ok';m='✔ सुरक्षा चली: वोल्टेज '+(T+0.7).toFixed(1)+' V पर पहुँचते ही SCR चालू हुआ, रेल लगभग शॉर्ट हुई और SMPS बंद (लैच) हो गया। कंप्यूटर के पुर्ज़े बच गए।'}
    else if(S.v>=17){c='no';m='✖ सुरक्षा नहीं चली ('+(s==='scropen'?'SCR ओपन':'ज़ेनर ओपन')+'): रेल '+S.v.toFixed(1)+' V तक चढ़ गई। मदरबोर्ड/ड्राइव के पुर्ज़े जल सकते हैं। (कई SMPS में IC की अपनी OVP भी होती है; यहाँ केवल क्राउबार दिखाया गया है।)'}
    else{c='mid';m='वोल्टेज चढ़ रही है…'}
    ver.className='cits-verdict '+c;ver.textContent=m;
  }
  $('ov-go').addEventListener('click',function(){S={t:0,run:true,v:stSel.value==='scrshort'?0.8:12,fired:false,fireT:0,log:[],dead:false}});
  $('ov-reset').addEventListener('click',reset);stSel.addEventListener('change',reset);th.addEventListener('input',function(){draw();txt()});
  var last=performance.now();
  (function loop(now){requestAnimationFrame(loop);var dt=Math.min(.05,(now-last)/1000);last=now;if(cv.offsetParent===null)return;step(dt);draw();txt()})(last);
  reset();
});
/* ---------- ATX 24-पिन सिमुलेटर ---------- */
safe('atx',function(){
  var svg=$('at-svg');if(!svg)return;var X=window.__bx;if(!X)return;var NS='http://www.w3.org/2000/svg';
  var COL={o:'#ff8a1f',k:'#2a2a2a',r:'#e0262c',gr:'#9a9a9a',p:'#8a4fd0',y:'#f2c200',b:'#2b6fe0',g:'#2eaa4a',w:'#e8e8e8'};
  var P={1:['o','3.3V'],2:['o','3.3V'],3:['k','COM'],4:['r','5V'],5:['k','COM'],6:['r','5V'],7:['k','COM'],8:['gr','PWR_OK'],9:['p','5VSB'],10:['y','12V'],11:['y','12V'],12:['o','3.3V'],
         13:['o','3.3V'],14:['b','−12V'],15:['k','COM'],16:['g','PS_ON'],17:['k','COM'],18:['k','COM'],19:['k','COM'],20:['w','N/C'],21:['r','5V'],22:['r','5V'],23:['r','5V'],24:['k','COM']};
  var TOL={'12V':[11.4,12.6,12],'5V':[4.75,5.25,5],'3.3V':[3.135,3.465,3.3],'5VSB':[4.75,5.25,5],'−12V':[-13.2,-10.8,-12],'PWR_OK':[2.4,5.25,5]};
  var red=10,blk=3,next='r',pos={};
  function mk(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
  function pos_(n){var c=n<=12?0:1,r=(n-1)%12;return {x:c?196:70,y:34+r*26,c:c,r:r}}
  mk('text',{x:70,y:16,'text-anchor':'middle',fill:'#8fb8a8','font-size':'11'},svg).textContent='पिन 1–12';mk('text',{x:196,y:16,'text-anchor':'middle',fill:'#8fb8a8','font-size':'11'},svg).textContent='पिन 13–24';
  mk('rect',{x:20,y:22,width:240,height:322,rx:12,fill:'none',stroke:'#3b5a4d','stroke-dasharray':'6 5'},svg);
  var els={};
  for(var n=1;n<=24;n++){(function(n){
    var q=pos_(n),g=mk('g',{style:'cursor:crosshair',tabindex:0,role:'button','aria-label':'पिन '+n+' '+P[n][1]},svg);
    mk('rect',{x:q.x-39,y:q.y-10,width:78,height:21,rx:6,fill:COL[P[n][0]],stroke:n===20?'#888':'#000','stroke-dasharray':n===20?'3 3':'0'},g);
    mk('text',{x:q.x,y:q.y+5,'text-anchor':'middle','font-size':'10.5','font-weight':'700',fill:(P[n][0]==='k'||P[n][0]==='r'||P[n][0]==='b'||P[n][0]==='p'||P[n][0]==='g')?'#fff':'#111'},g).textContent=n+' · '+P[n][1];
    var ring=mk('rect',{x:q.x-42,y:q.y-13,width:84,height:27,rx:8,fill:'none','stroke-width':3,opacity:0},g);
    g.addEventListener('click',function(){if(next==='r'){red=n;next='b'}else{blk=n;next='r'}draw()});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();g.dispatchEvent(new Event('click'))}});
    els[n]=ring;})(n)}
  var clipG=mk('g',{},svg);
  var tag=mk('text',{x:290,y:150,'font-size':'11',fill:'#8fb8a8','text-anchor':'middle'},svg);
  function draw(){
    for(var n=1;n<=24;n++){var r=els[n];r.setAttribute('opacity',n===red||n===blk?1:0);r.setAttribute('stroke',n===red?'#ff3b3b':'#ffffff')}
    clipG.innerHTML='';if(X.st.ps){var a=pos_(16),b=pos_(15);mk('path',{d:'M'+(a.x+39)+' '+a.y+'h16q10 0 10 10v'+(b.y-a.y-20)+'q0 10 -10 10h-16',fill:'none',stroke:'#cfd6dd','stroke-width':5,'stroke-linecap':'round'},clipG);mk('path',{d:'M'+(a.x+39)+' '+a.y+'h16q10 0 10 10v'+(b.y-a.y-20)+'q0 10 -10 10h-16',fill:'none',stroke:'#6b7380','stroke-width':1.4},clipG)}
    tag.textContent=X.st.ps?'📎 पेपर-क्लिप':'';tag.setAttribute('x',300)}
  function val(n,R){var k=P[n][1];if(k==='COM')return 0;if(k==='N/C')return null;
    if(k==='12V')return R.dc.V12;if(k==='5V')return R.dc.V5;if(k==='3.3V')return R.dc.V33;if(k==='5VSB')return R.dc.SB;if(k==='PWR_OK')return R.dc.PG;if(k==='PS_ON')return R.dc.PSON;if(k==='−12V')return R.main&&R.v12>1?-12.0:0;return 0}
  var faults={ok:{},fuse:{f1:'open'},rst:{rst:'open'},d12:{d12:'open'},c2b:{c2b:'weak'},tl:{tl:'open'}};
  $('at-fault').addEventListener('change',function(){var v=this.value,st=X.st;X.allOk();st.plug=true;st.disch=false;st.temp=40;st.log=[];Object.keys(faults[v]).forEach(function(k){st.c[k]=faults[v][k];st.flash.push(k)});if(v==='c2b')st.w=380;else st.w=150;X.log('📘 ATX सिमुलेटर: '+(v==='ok'?'सब पार्ट सही':'खराबी लगाई: '+this.options[this.selectedIndex].text));});
  $('at-clip').addEventListener('click',function(){X.st.ps=!X.st.ps;draw()});
  $('at-start').addEventListener('click',function(){var st=X.st;X.allOk();st.plug=false;st.ps=false;st.disch=true;st.temp=40;st.log=[];$('at-fault').value='ok';draw()});
  $('at-plug').addEventListener('click',function(){X.st.plug=!X.st.plug;if(X.st.plug)X.st.disch=false});
  var fan=$('at-fan').querySelector('.at-blades');
  setInterval(function(){
    if($('at-sim').offsetParent===null)return;var R=X.analyze(),st=X.st;
    $('at-clip').setAttribute('aria-pressed',st.ps);$('at-clip').textContent=st.ps?'📎 पेपर-क्लिप लगी है (हटाएँ)':'📎 पेपर-क्लिप लगाओ';
    $('at-plug').setAttribute('aria-pressed',st.plug);$('at-plug').textContent=st.plug?'🔌 AC प्लग लगा है (निकालें)':'🔌 AC प्लग लगाओ';
    draw();
    var spin=R.main&&R.v12>9;fan.classList.toggle('on',!!spin);
    $('at-fantxt').textContent=spin?'पंखा घूम रहा है (12 V मिल रही है)':(!st.plug?'पंखा बंद: AC नहीं':(!st.ps?'पंखा बंद: PS_ON खुला (पेपर-क्लिप नहीं)':(R.v12<=1?'पंखा बंद: 12 V रेल नहीं बनी':'पंखा बंद')));
    var rv=val(red,R),bv=val(blk,R),lcd=$('at-lcd'),v=$('at-ver');
    if(red===blk){lcd.innerHTML='0.00 V<small>दोनों प्रोब एक ही पिन पर हैं</small>';v.innerHTML='';return}
    if(rv===null||bv===null){lcd.innerHTML='OL<small>N/C पिन: कोई तार नहीं, तैरता है</small>';v.innerHTML='';return}
    var d=rv-bv;lcd.innerHTML=d.toFixed(2)+' V<small>🔴 पिन '+red+' ('+P[red][1]+') · ⚫ पिन '+blk+' ('+P[blk][1]+')</small>';
    var sig=P[red][1];
    if(P[blk][1]==='COM'&&TOL[sig]){var t=TOL[sig];
      if(sig==='PWR_OK'&&!R.pg&&!R.main){v.innerHTML='<div class="cits-verdict mid">PWR_OK = 0 V: या तो SMPS चालू नहीं है, या कोई रेल सही नहीं। PC चालू नहीं होगा।</div>'}
      else if(!st.plug){v.innerHTML='<div class="cits-verdict mid">AC प्लग निकला है: सब रीडिंग शून्य।</div>'}
      else if(!st.ps&&sig!=='5VSB'){v.innerHTML='<div class="cits-verdict mid">पेपर-क्लिप नहीं लगी (PS_ON खुला): केवल 5VSB मिलेगा, मुख्य रेल बंद रहेंगी।</div>'}
      else if(d>=t[0]&&d<=t[1]){v.innerHTML='<div class="cits-verdict ok">✔ सही: '+sig+' सीमा ('+t[0]+' से '+t[1]+' V) में है।</div>'}
      else{v.innerHTML='<div class="cits-verdict no">✖ '+sig+' सीमा ('+t[0]+' से '+t[1]+' V) से बाहर: '+(Math.abs(d)<0.5?'रेल गायब।':'कम/ज़्यादा।')+' ऊपर का "खराबी" चुनकर देखें कि कौन-सा पार्ट ऐसा करता है।</div>'}
    }else if(P[red][1]==='COM'&&TOL[P[blk][1]]){v.innerHTML='<div class="cits-verdict mid">प्रोब उलटी लगी: लाल COM पर और काली रेल पर, इसलिए रीडिंग माइनस आई। लाल हमेशा रेल पर, काली COM पर।</div>'}
    else v.innerHTML='';
  },250);
  draw();
});
/* ---------- क्विज़ ---------- */
safe('quiz',function(){
  var box=$('qz-box');if(!box)return;var qs=box.querySelectorAll('.qz-q');
  $('qz-check').addEventListener('click',function(){var n=0,ans=0;
    qs.forEach(function(q){var c=+q.getAttribute('data-c'),ch=q.querySelector('input:checked'),fb=q.querySelector('.qz-fb'),ex=q.querySelector('.qz-ex');
      if(!ch){fb.textContent='';ex.hidden=true;q.classList.remove('good','bad');return}ans++;
      var ok=+ch.value===c;if(ok)n++;q.classList.toggle('good',ok);q.classList.toggle('bad',!ok);fb.textContent=ok?'✔ सही':'✖ ग़लत';ex.hidden=false;});
    $('qz-score').innerHTML='<span><em>स्कोर</em>'+n+' / '+qs.length+'</span><span><em>हल किए</em>'+ans+' प्रश्न</span>'});
  $('qz-reset').addEventListener('click',function(){qs.forEach(function(q){q.querySelectorAll('input').forEach(function(i){i.checked=false});q.querySelector('.qz-fb').textContent='';q.querySelector('.qz-ex').hidden=true;q.classList.remove('good','bad')});$('qz-score').innerHTML='<span><em>स्कोर</em>0 / '+qs.length+'</span>'});
});
/* ---------- असली कंपोनेंट गैलरी में फ़ोटो ---------- */
function renderCitsGallery(){safe('gallery',function(){
  var g=$('gal');if(!g||!window.CITS_IMG)return;var M=window.CITS_IMG;
  var C=[['थायरिस्टर (SCR) · फ़ोटो','scrphoto','तीन पिन वाला कंट्रोल होने वाला स्विच। SMPS में ज़्यादातर ओवरवोल्टेज सुरक्षा (क्राउबार) में।','TO-220, काला, 3 पाँव (A, K, G)','पार्ट नंबर: C106 / TYN612 आदि','A–K के बीच कोई रीडिंग (शॉर्ट) या गेट ओपन। जाँच: डायोड मोड में A–K OL, G–K ≈ 0.6 V।'],
    ['741 ऑप-एम्प · चित्र','pinout741','सिग्नल का फ़र्क़ बढ़ाने वाला IC: SMPS के फ़ीडबैक में "एरर एम्प्लीफ़ायर" की मिसाल।','8-पिन DIP, पिन 1 पर बिंदी/नॉच','LM741','जला/गरम IC, आउटपुट अटका हुआ।'],
    ['7805 / 7812 रेगुलेटर · फ़ोटो','regphoto','इनपुट वोल्टेज बदले तब भी आउटपुट को 5 V/12 V पर स्थिर रखता है।','TO-220, 3 पाँव (इनपुट, ग्राउंड, आउटपुट)','L7805CV, L7812CV','बहुत गरम, आउटपुट = इनपुट या 0 V।'],
    ['ATX कनेक्टर का चित्र','atx','24-पिन (और पुराना 20-पिन) कनेक्टर का सामने से दृश्य, रंग सहित।','2×12 पिन, लॉक वाला प्लग','ATX 24-pin','ढीली/काली पिन, पिघला प्लास्टिक।'],
    ['SMPS टेस्टर · फ़ोटो','tester','बिना मीटर के रेल की जल्दी जाँच: कनेक्टर लगाकर LED/रीडिंग देखें।','कनेक्टरों वाली छोटी बॉक्स','Power Supply Tester','LED न जले तो रेल गायब।'],
    ['पेपर-क्लिप टेस्ट · फ़ोटो','clip','हरे तार (PS_ON) और काले तार (COM) को क्लिप से जोड़कर SMPS को PC के बिना चालू करना।','मुड़ा हुआ पेपर-क्लिप / जम्पर','—','क्लिप ढीली हो तो SMPS चालू नहीं होता।'],
    ['ट्रांसफ़ॉर्मर 0–12 V · फ़ोटो','xfmr','सीखने के प्रयोगों (SCR रेक्टिफ़ायर, डिमर) के लिए 230 V से 12 V AC देता है।','लोहे की कोर, 2 A','0-12V 2A','वाइंडिंग ओपन: कंटीन्युटी में OL।']];
  C.forEach(function(c){if(!M[c[1]])return;var d=document.createElement('div');d.className='part';d.setAttribute('data-search',c[0].toLocaleLowerCase());
    d.innerHTML='<div class="pic cits-pic"><img src="'+M[c[1]]+'" alt="'+c[0]+'" style="width:100%;height:100%;object-fit:contain;background:#fff;border-radius:8px;cursor:zoom-in"></div><div class="txt"><h4>'+c[0]+'</h4><p>'+c[2]+'</p><p class="mk">पैकेज: '+c[3]+'<br>निशान: '+c[4]+'</p><p><b>खराब दिखे तो:</b> '+c[5]+'</p></div>';
    d.querySelector('img').closest('.pic').classList.add('cits-fig');g.appendChild(d)});
});}
if(window.CITS_IMG)renderCitsGallery();
else document.addEventListener('cits-images-ready',renderCitsGallery,{once:true});
})();

