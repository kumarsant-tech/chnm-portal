
(function(){
"use strict";
if(!document.getElementById('bm'))return;  /* guard: बोर्ड मैप सिर्फ़ m450 में */
var NS='http://www.w3.org/2000/svg';
var D=[
{k:'inlet',n:'AC इनलेट',ref:'CN1 / AC इनलेट',val:'230V AC, 3 पिन (L, N, अर्थ)',job:'घर की बिजली को SMPS में लाता है।',test:'पिन ढीले या जले तो नहीं, यह देखें। अर्थ पिन मेटल केस से जुड़ा होता है।',bad:'ढीला संपर्क, जला हुआ पिन, स्पार्क। इससे SMPS बीच-बीच में बंद होता है।',t:'r',x:22,y:36,w:56,h:56,f:'#2c2f35',s:'#000'},
{k:'fuse',n:'फ़्यूज़',ref:'F1',val:'6.3A 250V (T)',job:'शॉर्ट होने पर तार पिघलाकर AC रास्ता काट देता है।',test:'कंटिन्यूटी: बीप या 0Ω ठीक, OL खराब।',bad:'उड़ा हुआ: पहले ब्रिज, MOSFET और बल्क कैपेसिटर में शॉर्ट खोजें।',t:'r',x:94,y:38,w:40,h:16,f:'#cfe4e6',s:'#7a9a9e'},
{k:'mov',n:'वैरिस्टर MOV',ref:'ZNR1 / VR1',val:'14D471K (470V)',job:'वोल्टेज स्पाइक आने पर ऊर्जा सोख लेता है।',test:'ओम: बहुत ऊँचा। बीप या कम मान = खराब।',bad:'जला, चटका या काला।',t:'c',x:156,y:46,r:15,f:'#2f6fb5',s:'#173a63'},
{k:'ntc',n:'NTC थर्मिस्टर',ref:'TH1',val:'5Ω से 10Ω (ठंडा)',job:'चालू होते समय का बड़ा करंट रोकता है।',test:'ठंडा होने पर कुछ ओम दिखे। OL = खराब।',bad:'ओपन हो जाता है: SMPS बिल्कुल डेड, फ़्यूज़ ठीक।',t:'c',x:200,y:46,r:14,f:'#3f8a58',s:'#1e4d30'},
{k:'emi',n:'EMI फ़िल्टर (X2, Y2, चोक)',ref:'CX1, CY1, CY2, LF1',val:'0.47µF/275VAC, 2.2nF/250VAC, चोक',job:'लाइन और SMPS का हाई-फ़्रीक्वेंसी शोर रोकता है।',test:'X2 पर क्षमता मीटर। चोक की हर वाइंडिंग में कंटिन्यूटी।',bad:'X2 या Y2 फूला या पिघला, चोक की वार्निश जली।',t:'g',x:112,y:100,w:130,h:50,f:'#e0b22e',s:'#8a6410'},
{k:'bridge',n:'ब्रिज रेक्टिफ़ायर',ref:'BD1',val:'KBU1006 (10A 600V) या GBU जैसा',job:'AC को स्पंदित DC (100Hz) में बदलता है।',test:'डायोड मोड में चारों डायोड: एक दिशा 0.4V से 0.6V, उलटी OL।',bad:'शॉर्ट: फ़्यूज़ उड़ता है। ओपन: बल्क वोल्टेज कम और रिपल ज़्यादा।',t:'r',x:48,y:176,w:44,h:44,f:'#1d1d20',s:'#000'},
{k:'bulk',n:'बल्क कैपेसिटर',ref:'C1 (और C2)',val:'330µF से 470µF / 400V (या दो 330µF/200V सीरीज़ में)',job:'स्पंदित DC को चिकना करके लगभग 310V से 380V का भंडार बनाता है।',test:'बंद करके डिस्चार्ज करें, फिर क्षमता और ESR मीटर।',bad:'सूखा: रिपल और रीस्टार्ट, फूला ढक्कन, तरल रिसाव।',t:'c2',x:200,y:215,r:33,f:'#1f4fa0',s:'#10285a'},
{k:'pfc',n:'एक्टिव PFC (अगर हो)',ref:'Q (PFC), L (चोक), D',val:'600V MOSFET, बूस्ट डायोड, चोक',job:'इनपुट करंट को साफ़ रखकर बल्क पर 380V से 400V बनाता है।',test:'PFC MOSFET का ड्रेन-सोर्स बीप तो शॉर्ट। बूस्ट डायोड डायोड मोड में।',bad:'PFC MOSFET शॉर्ट: फ़्यूज़ उड़ता है। सस्ते मॉडल में PFC नहीं होता।',t:'hs',x:132,y:312,w:100,h:62,f:'#8c969d',s:'#4b545a'},
{k:'prihs',n:'प्राइमरी हीटसिंक: स्विचिंग Q1, Q2',ref:'Q1, Q2',val:'2 × 500V से 650V MOSFET (जैसे 10N60) या पुराने मॉडल में 2SC3306 जैसे ट्रांजिस्टर',job:'300V DC को तेज़ी से ऑन-ऑफ करके मेन ट्रांसफ़ॉर्मर को पल्स देते हैं।',test:'ड्रेन-सोर्स में बीप तो शॉर्ट। बॉडी डायोड 0.4V से 0.7V।',bad:'सबसे आम शॉर्ट वाला पार्ट। साथ में गेट रेसिस्टर और PWM IC भी जाँचें।',t:'hs',x:318,y:148,w:80,h:140,f:'#8c969d',s:'#4b545a'},
{k:'drive',n:'ड्राइव ट्रांसफ़ॉर्मर',ref:'T1',val:'छोटा फेराइट, 1:1 जैसा',job:'PWM के सिग्नल को आइसोलेट करके Q1 और Q2 के गेट तक पहुँचाता है।',test:'वाइंडिंग में कंटिन्यूटी। पिन के ठंडे जोड़ देखें।',bad:'ठंडा सोल्डर जोड़, टूटा तार: Q1 और Q2 चलते नहीं।',t:'r',x:330,y:304,w:44,h:34,f:'#3a3a40',s:'#000'},
{k:'main',n:'मेन ट्रांसफ़ॉर्मर',ref:'T2',val:'EI33 या EE42 जैसा फेराइट',job:'पल्स का वोल्टेज घटाकर सेकेंडरी में 12V, 5V और 3.3V की सप्लाई बनाता है और आइसोलेशन देता है।',test:'हर वाइंडिंग में कंटिन्यूटी। जलने की गंध और टेप का रंग देखें।',bad:'कम खराब होता है। टेप जला, वाइंडिंग शॉर्ट: गर्मी और शोर।',t:'tr',x:432,y:150,w:92,h:110,f:'#d7a53c',s:'#7a5a12'},
{k:'stby',n:'स्टैंडबाय सप्लाई',ref:'T3 और स्विच (MOSFET या IC)',val:'छोटा फ्लाईबैक, 5VSB 2A से 2.5A',job:'प्लग लगाते ही 5V देती है और PWM IC को शुरुआती पावर देती है।',test:'बैंगनी तार पर 5V होना चाहिए। स्टार्टअप रेसिस्टर देखें।',bad:'खराब हो तो 5VSB नहीं और मदरबोर्ड ऑन नहीं होता।',t:'tr',x:334,y:366,w:64,h:56,f:'#b9a36a',s:'#6b5a2a'},
{k:'pwm',n:'PWM कंट्रोलर IC',ref:'IC1',val:'TL494, KA7500B या मिलता-जुलता (16-पिन)',job:'ड्यूटी साइकिल तय करके आउटपुट स्थिर रखता है।',test:'Vcc पिन पर 12V से 15V के आसपास। ऑसिलेटर पिन पर सिग्नल (स्कोप से)।',bad:'Vcc न मिले तो चालू नहीं होता। MOSFET शॉर्ट के साथ अक्सर जलता है।',t:'ic',x:444,y:304,w:44,h:22,f:'#17181a',s:'#000'},
{k:'sup',n:'सुपरवाइज़र IC',ref:'IC2',val:'LM339 या सुपरवाइज़र चिप (14-पिन)',job:'OVP, UVP, SCP और PG सिग्नल बनाता है।',test:'PS_ON का वोल्टेज और PG का स्लेटी तार (चालू के बाद 5V)।',bad:'खराब हो तो PG नहीं, पंखा घूमकर भी कंप्यूटर शुरू नहीं होता।',t:'ic',x:444,y:340,w:40,h:20,f:'#17181a',s:'#000'},
{k:'opto',n:'फ़ीडबैक: ऑप्टोकपलर और TL431',ref:'PC1 और U1 (TL431)',val:'PC817 या EL817 और TL431 (2.495V रेफ़रेंस)',job:'आउटपुट की जानकारी रोशनी से प्राइमरी तक भेजता है।',test:'बदलकर देखना सबसे भरोसेमंद। डिवाइडर के रेसिस्टर ओम में।',bad:'टूटने पर आउटपुट वोल्टेज बहुत बढ़ता है और OVP से बंद।',t:'r',x:504,y:326,w:34,h:26,f:'#17181a',s:'#000'},
{k:'secdi',n:'सेकेंडरी हीटसिंक: शॉटकी डायोड',ref:'D1 (12V), D2 (5V), D3 (3.3V)',val:'डुअल शॉटकी 30A या 40A, 40V या 100V (जैसे MBR3045PT या SBL3040 जैसे)',job:'ट्रांसफ़ॉर्मर के पल्स को DC में बदलते हैं।',test:'डायोड मोड में दोनों डायोड: 0.15V से 0.4V एक दिशा, उलटी OL।',bad:'सेकेंडरी में सबसे आम शॉर्ट। रेल शून्य के पास और टिक-टिक की आवाज़।',t:'hs',x:560,y:50,w:78,h:194,f:'#8c969d',s:'#4b545a'},
{k:'coil',n:'आउटपुट कॉइल',ref:'L1 (कपल्ड/मैग-एम्प)',val:'पीले-सफ़ेद टोरॉइड पर मोटी तांबे की वाइंडिंग',job:'पल्स वाले करंट को चिकना करके कैपेसिटर तक भेजता है। 3.3V अक्सर यहीं से बनती है।',test:'वाइंडिंग में कंटिन्यूटी और जलन का निशान।',bad:'वाइंडिंग जलना: 3.3V या 5V कम या गायब।',t:'t',x:690,y:105,r:36,f:'#e0c545',s:'#8a7620'},
{k:'ocap',n:'आउटपुट कैपेसिटर',ref:'C10 से C20',val:'1000µF/25V (12V), 2200µF/10V या 16V (5V, 3.3V), लो ESR',job:'रिपल सोखते हैं और अचानक बढ़े लोड की ज़रूरत पूरी करते हैं।',test:'ESR मीटर। ऊपर का K खाँचा उभरा तो बदलें।',bad:'सबसे ज़्यादा खराब होते हैं: रैंडम रीस्टार्ट और हैंग।',t:'caps',x:586,y:330,r:19,f:'#16151c',s:'#6b6fa0'},
{k:'fan',n:'पंखा',ref:'FAN1',val:'12V, 120mm',job:'MOSFET, डायोड और ट्रांसफ़ॉर्मर को ठंडा रखता है।',test:'तारों पर 12V। घुमाकर देखें कि जाम तो नहीं।',bad:'जाम पंखा: ओवरहीट और जलना।',t:'c',x:750,y:60,r:30,f:'#202225',s:'#555'}
];
var svg=document.getElementById('bm'),sel=null;
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e}
svg.appendChild(el('rect',{x:8,y:8,width:784,height:444,rx:10,fill:'#1f4d3a',stroke:'#0f2c20','stroke-width':3}));
svg.appendChild(el('line',{x1:526,y1:38,x2:526,y2:444,stroke:'#cfe6d8','stroke-width':1.5,'stroke-dasharray':'6 6'}));
function lab(x,y,s,a){var t=el('text',{x:x,y:y,'text-anchor':a||'middle','font-size':12,fill:'#cfe6d8'});t.textContent=s;svg.appendChild(t)}
lab(200,438,'प्राइमरी (ख़तरनाक, 300V)');lab(660,438,'सेकेंडरी');lab(526,28,'आइसोलेशन','middle');
var groups={};
D.forEach(function(d,i){
 var g=el('g',{tabindex:0,role:'button','aria-label':d.n,style:'cursor:pointer'});g.setAttribute('data-k',d.k);
 var cx=0,cy=0,box;
 if(d.t==='r'||d.t==='tr'||d.t==='ic'||d.t==='g'||d.t==='hs'){
  g.appendChild(el('rect',{x:d.x,y:d.y,width:d.w,height:d.h,rx:d.t==='ic'?2:4,fill:d.f,stroke:d.s,'stroke-width':1.5}));
  if(d.t==='hs'){for(var fx=d.x+6;fx<d.x+d.w-3;fx+=7)g.appendChild(el('line',{x1:fx,y1:d.y+4,x2:fx,y2:d.y+d.h-4,stroke:'#5b656c','stroke-width':2}))}
  if(d.t==='tr'){for(var ty=d.y+8;ty<d.y+d.h-4;ty+=7)g.appendChild(el('line',{x1:d.x+10,y1:ty,x2:d.x+d.w-10,y2:ty,stroke:'#8f6b17','stroke-width':1.5}))}
  if(d.t==='ic'){for(var lx=d.x+4;lx<d.x+d.w-2;lx+=6){g.appendChild(el('rect',{x:lx,y:d.y-4,width:2,height:4,fill:'#c9ced2'}));g.appendChild(el('rect',{x:lx,y:d.y+d.h,width:2,height:4,fill:'#c9ced2'}))}}
  if(d.t==='g'){g.appendChild(el('rect',{x:d.x+6,y:d.y+8,width:36,height:26,rx:3,fill:'#e0b22e',stroke:'#8a6410'}));g.appendChild(el('circle',{cx:d.x+62,cy:d.y+22,r:9,fill:'#5aa0d8',stroke:'#2a5e8a'}));g.appendChild(el('circle',{cx:d.x+84,cy:d.y+22,r:9,fill:'#5aa0d8',stroke:'#2a5e8a'}));g.appendChild(el('circle',{cx:d.x+112,cy:d.y+22,r:15,fill:'none',stroke:'#c4742f','stroke-width':8,'stroke-dasharray':'3 4'}))}
  if(d.k==='prihs'){g.appendChild(el('rect',{x:d.x+16,y:d.y+26,width:30,height:34,fill:'#17181a',stroke:'#000'}));g.appendChild(el('rect',{x:d.x+16,y:d.y+82,width:30,height:34,fill:'#17181a',stroke:'#000'}))}
  if(d.k==='secdi'){[40,100,160].forEach(function(o){g.appendChild(el('rect',{x:d.x+14,y:d.y+o-16,width:30,height:30,fill:'#17181a',stroke:'#000'}))})}
  if(d.k==='pfc'){g.appendChild(el('rect',{x:d.x+8,y:d.y+8,width:24,height:30,fill:'#17181a',stroke:'#000'}));g.appendChild(el('circle',{cx:d.x+68,cy:d.y+30,r:20,fill:'none',stroke:'#c4742f','stroke-width':9,'stroke-dasharray':'3 4'}))}
  box=[d.x+d.w/2,d.y+d.h/2];
 }else if(d.t==='c'||d.t==='c2'||d.t==='t'){
  var offs=d.t==='c2'?[[-0,0],[72,0]]:[[0,0]];
  offs.forEach(function(o){
   g.appendChild(el('circle',{cx:d.x+o[0],cy:d.y+o[1],r:d.r,fill:d.t==='t'?'none':d.f,stroke:d.t==='t'?d.f:d.s,'stroke-width':d.t==='t'?20:2}));
   if(d.t==='t'){g.appendChild(el('circle',{cx:d.x,cy:d.y,r:d.r,fill:'none',stroke:'#b86a2c','stroke-width':22,'stroke-dasharray':'4 6'}))}
   else if(d.k==='bulk'||d.k==='ocap'){g.appendChild(el('circle',{cx:d.x+o[0],cy:d.y+o[1],r:d.r*0.62,fill:'none',stroke:'#c9d3dc','stroke-width':1.2}));g.appendChild(el('line',{x1:d.x+o[0]-d.r*.4,y1:d.y+o[1],x2:d.x+o[0]+d.r*.4,y2:d.y+o[1],stroke:'#c9d3dc'}))}
   else if(d.k==='fan'){g.appendChild(el('circle',{cx:d.x,cy:d.y,r:d.r*.35,fill:'#2a2c32',stroke:'#666'}));for(var b=0;b<7;b++){var a=b*Math.PI*2/7;g.appendChild(el('line',{x1:d.x,y1:d.y,x2:d.x+Math.cos(a)*d.r*.9,y2:d.y+Math.sin(a)*d.r*.9,stroke:'#555','stroke-width':5,'stroke-linecap':'round'}))}}
  });
  box=[d.x,d.y];
 }else if(d.t==='caps'){
  for(var r2=0;r2<2;r2++)for(var c2=0;c2<5;c2++){
   var ccx=d.x+c2*40,ccy=d.y+r2*50;
   g.appendChild(el('circle',{cx:ccx,cy:ccy,r:d.r,fill:d.f,stroke:d.s,'stroke-width':1.6}));
   g.appendChild(el('circle',{cx:ccx,cy:ccy,r:d.r*.6,fill:'none',stroke:'#aab','stroke-width':1}));
  }
  box=[d.x+80,d.y+25];
 }
 var bd=el('circle',{cx:box[0],cy:box[1],r:9,fill:'#fff',stroke:'#000','stroke-width':1.2,class:'badge'});g.appendChild(bd);
 var bt=el('text',{x:box[0],y:box[1]+4,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#000'});bt.textContent=String(i+1);g.appendChild(bt);
 var ring=el('rect',{x:d.t==='c'||d.t==='c2'||d.t==='t'?d.x-d.r-4:d.x-4,y:d.t==='c'||d.t==='c2'||d.t==='t'?d.y-d.r-4:d.y-4,width:d.t==='caps'?190:(d.t==='c2'?d.r*2+80:(d.t==='c'||d.t==='t'?d.r*2+8:d.w+8)),height:d.t==='caps'?90:(d.t==='c'||d.t==='c2'||d.t==='t'?d.r*2+8:d.h+8),rx:6,fill:'none',stroke:'#ffd24a','stroke-width':3,opacity:0});
 ring.setAttribute('class','ring');g.appendChild(ring);
 svg.appendChild(g);groups[d.k]=g;
 g.addEventListener('click',function(){pick(d.k)});
 g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(d.k)}});
});
var chips=document.getElementById('bm-chips');
D.forEach(function(d,i){var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=(i+1)+'. '+d.n;b.setAttribute('data-k',d.k);b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){pick(d.k)});chips.appendChild(b)});
function pick(k){
 var d=D.filter(function(x){return x.k===k})[0];
 for(var kk in groups){groups[kk].querySelector('.ring').setAttribute('opacity',kk===k?1:0)}
 var bs=chips.querySelectorAll('button');for(var i=0;i<bs.length;i++)bs[i].setAttribute('aria-pressed',bs[i].getAttribute('data-k')===k);
 document.getElementById('bm-info').innerHTML='<h3 style="margin:0 0 6px">'+d.n+'</h3>'
  +'<p class="small" style="margin:0 0 8px">बोर्ड पर आम निशान: <span class="mono">'+d.ref+'</span><br>आम मान: '+d.val+'</p>'
  +'<p style="margin:0 0 6px"><b>काम:</b> '+d.job+'</p><p style="margin:0 0 6px"><b>जाँच:</b> '+d.test+'</p><p style="margin:0"><b>आम खराबी:</b> '+d.bad+'</p>';
}
pick('bulk');
})();
