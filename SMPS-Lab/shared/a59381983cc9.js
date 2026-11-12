
(function(){
"use strict";
var T='#dfeee6', M='#cfd4d8';
function leads(xs,y0,y1){return xs.map(function(x){return '<line x1="'+x+'" y1="'+y0+'" x2="'+x+'" y2="'+y1+'" stroke="'+M+'" stroke-width="3" stroke-linecap="round"/>'}).join('')}
function tx(x,y,s,sz,fill,extra){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="'+(sz||11)+'" font-weight="700" fill="'+(fill||'#fff')+'" font-family="IBM Plex Mono,monospace" '+(extra||'')+'>'+s+'</text>'}
function dip(p,n,label,sub){
 var m=n/2,pitch=n===4?22:12.5,w=m*pitch+10,x0=100-w/2,s='';
 for(var i=0;i<m;i++){var x=x0+5+pitch*(i+.5);
  s+='<rect x="'+(x-2.5)+'" y="24" width="5" height="22" fill="'+M+'"/><rect x="'+(x-2.5)+'" y="94" width="5" height="22" fill="'+M+'"/>'}
 s+='<defs><linearGradient id="'+p+'d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2c30"/><stop offset="1" stop-color="#121214"/></linearGradient></defs>';
 s+='<rect x="'+x0+'" y="44" width="'+w+'" height="52" rx="3" fill="url(#'+p+'d)" stroke="#000"/>';
 s+='<path d="M'+x0+' 64 A6 6 0 0 1 '+x0+' 76 Z" fill="#1d2b25"/><circle cx="'+(x0+12)+'" cy="86" r="2.5" fill="#55585e"/>';
 s+=tx(100+4,66,label,n===4?13:14)+tx(100+4,82,sub,9,'#9aa0a6');
 return s}
function to220(p,l1,l2,pins,lab){
 return '<defs><linearGradient id="'+p+'t" x1="0" x2="1"><stop offset="0" stop-color="#8f979d"/><stop offset=".5" stop-color="#d4d9dc"/><stop offset="1" stop-color="#8f979d"/></linearGradient></defs>'
 +'<rect x="70" y="10" width="60" height="26" rx="3" fill="url(#'+p+'t)"/><circle cx="100" cy="21" r="5" fill="#1d2b25"/>'
 +'<rect x="70" y="36" width="60" height="52" fill="#17181a"/><rect x="70" y="36" width="60" height="3" fill="#2b2d31"/>'
 +tx(100,58,l1,12)+tx(100,73,l2,10,'#9aa0a6')
 +[82,100,118].map(function(x){return '<rect x="'+(x-3)+'" y="88" width="6" height="38" fill="'+M+'"/>'}).join('')
 +[82,100,118].map(function(x,i){return tx(x,136,pins[i],10,T)}).join('')}
function resist(){
 return '<line x1="14" y1="62" x2="62" y2="62" stroke="'+M+'" stroke-width="3"/><line x1="138" y1="62" x2="186" y2="62" stroke="'+M+'" stroke-width="3"/>'
 +'<defs><linearGradient id="rsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ecd9a4"/><stop offset=".5" stop-color="#d4bb7f"/><stop offset="1" stop-color="#a98e54"/></linearGradient></defs>'
 +'<rect x="58" y="46" width="84" height="32" rx="14" fill="url(#rsg)" stroke="#8a7440"/>'
 +'<rect x="74" y="47" width="8" height="30" fill="#ff8a1f"/><rect x="88" y="47" width="8" height="30" fill="#ff8a1f"/><rect x="102" y="47" width="8" height="30" fill="#ffd800"/><rect x="124" y="47" width="8" height="30" fill="#c8a951"/>'
 +tx(100,104,'330 kΩ ±5%',12,T)+tx(100,122,'नारंगी · नारंगी · पीला · सुनहरा',9.5,'#a9c4b5')}
function can(p,sleeve,txt,txtc,stripe){
 return '<defs><linearGradient id="'+p+'c" x1="0" x2="1"><stop offset="0" stop-color="'+sleeve[0]+'"/><stop offset=".45" stop-color="'+sleeve[1]+'"/><stop offset="1" stop-color="'+sleeve[0]+'"/></linearGradient>'
 +'<linearGradient id="'+p+'a" x1="0" x2="1"><stop offset="0" stop-color="#9aa1a8"/><stop offset=".5" stop-color="#e3e7ea"/><stop offset="1" stop-color="#9aa1a8"/></linearGradient></defs>'
 +leads([88,112],104,130)
 +'<rect x="68" y="26" width="64" height="82" rx="4" fill="url(#'+p+'c)"/>'
 +'<rect x="68" y="26" width="12" height="82" fill="'+stripe+'" opacity=".92"/>'
 +'<text x="74" y="52" font-size="12" fill="#222" font-weight="700" text-anchor="middle">−</text><text x="74" y="70" font-size="12" fill="#222" font-weight="700" text-anchor="middle">−</text><text x="74" y="88" font-size="12" fill="#222" font-weight="700" text-anchor="middle">−</text>'
 +'<ellipse cx="100" cy="26" rx="32" ry="8" fill="url(#'+p+'a)"/><path d="M86 26 L114 26 M100 20 L100 32" stroke="#707880" stroke-width="1.4"/><circle cx="100" cy="26" r="17" fill="none" stroke="#8b929a" stroke-width=".8"/>'
 +txt.map(function(s,i){return '<text transform="translate('+(98+i*13)+',98) rotate(-90)" font-size="'+(i?8.5:9.5)+'" font-weight="700" fill="'+txtc+'" font-family="IBM Plex Mono,monospace">'+s+'</text>'}).join('')}
function disc(p,c1,c2,r,lines,ly){
 return leads([100-r*.35,100+r*.35],62+r*.7,132)
 +'<defs><radialGradient id="'+p+'r" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></radialGradient></defs>'
 +'<circle cx="100" cy="62" r="'+r+'" fill="url(#'+p+'r)" stroke="rgba(0,0,0,.45)" stroke-width="2"/>'
 +'<ellipse cx="'+(86)+'" cy="'+(62-r*.5)+'" rx="'+(r*.35)+'" ry="'+(r*.15)+'" fill="rgba(255,255,255,.22)"/>'
 +lines.map(function(s,i){return tx(100,ly+i*13,s,i?10:12)}).join('')}
function toroid(p,top,bot){
 return leads([62,80,120,138],102,132)
 +'<path d="M100 22 A40 40 0 0 0 100 102" fill="none" stroke="'+top+'" stroke-width="28"/><path d="M100 22 A40 40 0 0 1 100 102" fill="none" stroke="'+bot+'" stroke-width="28"/>'
 +'<circle cx="100" cy="62" r="40" fill="none" stroke="#b86a2c" stroke-width="30" stroke-dasharray="4 6" opacity=".95"/>'
 +'<circle cx="100" cy="62" r="25" fill="#1d2b25"/>'}
var P=[
{t:'फ़्यूज़',w:'ज़्यादा करंट पर तार पिघलाकर सर्किट खोलता है।',pk:'काँच की ट्यूब 5×20mm',mk:'T6.3A 250V (T = धीमा)',bad:'अंदर का तार टूटा, काँच अंदर से काला या धुँधला।',
 d:function(p){return '<defs><linearGradient id="'+p+'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7fdfd" stop-opacity=".9"/><stop offset=".5" stop-color="#b9ced0" stop-opacity=".35"/><stop offset="1" stop-color="#e8f4f4" stop-opacity=".75"/></linearGradient><linearGradient id="'+p+'m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0dca0"/><stop offset=".5" stop-color="#b8923a"/><stop offset="1" stop-color="#7d6020"/></linearGradient></defs><rect x="38" y="50" width="124" height="40" rx="6" fill="url(#'+p+'g)" stroke="#9fb4b6"/><path d="M48 70 q6 -9 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0" fill="none" stroke="#d4d4d4" stroke-width="1.6"/><rect x="26" y="47" width="22" height="46" rx="4" fill="url(#'+p+'m)"/><rect x="152" y="47" width="22" height="46" rx="4" fill="url(#'+p+'m)"/>'+tx(100,114,'T 6.3A  250V',12,T)}},
{t:'वैरिस्टर MOV',w:'वोल्टेज स्पाइक आने पर शॉर्ट जैसा बनकर ऊर्जा सोखता है।',pk:'नीली या नारंगी डिस्क 10mm से 14mm',mk:'14D471K (14mm, 470V)',bad:'जला, चटका या किनारा पिघला हुआ।',
 d:function(p){return disc(p,'#5a97da','#1e4f8f',40,['14D471K','▮▮▮'],56)}},
{t:'NTC थर्मिस्टर',w:'चालू होते समय बड़ा करंट रोकता है, फिर गर्म होकर प्रतिरोध घटा लेता है।',pk:'छोटी हरी या काली डिस्क',mk:'5D-11 (5Ω, 11mm)',bad:'चटका या काला, ठंडा होने पर मीटर में OL।',
 d:function(p){return disc(p,'#4f9a68','#1f5a36',30,['5D-11'],64)}},
{t:'X2 कैपेसिटर',w:'Live और Neutral के बीच का शोर शॉर्ट करके हटाता है।',pk:'चौकोर फ़िल्म बॉक्स, पीला या नारंगी',mk:'0.47µF 275VAC X2',bad:'फूला हुआ, चटका या पिघला।',
 d:function(p){return leads([80,120],98,130)+'<defs><linearGradient id="'+p+'x" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1cd5b"/><stop offset="1" stop-color="#b8861c"/></linearGradient></defs><rect x="58" y="28" width="84" height="72" rx="5" fill="url(#'+p+'x)" stroke="#8a6410"/>'+tx(100,52,'X2',15,'#3a2900')+tx(100,70,'0.47µF',12,'#3a2900')+tx(100,86,'275VAC',11,'#3a2900')}},
{t:'Y2 कैपेसिटर',w:'लाइन से अर्थ के बीच शोर निकालता है और सुरक्षा बनाए रखता है।',pk:'नीली डिस्क, सुरक्षा चिह्न वाली',mk:'222M 250VAC Y2 (2.2nF)',bad:'पिघला या चटका। हल्का झटका लग सकता है।',
 d:function(p){return disc(p,'#7ec0ee','#2f75ad',30,['222M','250V~','Y2'],52)}},
{t:'कॉमन मोड चोक',w:'दोनों तारों का एक जैसा शोर रोकता है, 50Hz करंट पर असर नहीं।',pk:'फेराइट रिंग पर तांबे की दो वाइंडिंग',mk:'कोई निशान नहीं, 4 पाँव',bad:'वार्निश जली, वाइंडिंग का तार टूटा।',
 d:function(p){return toroid(p,'#3e3a36','#3e3a36')}},
{t:'ब्रिज रेक्टिफ़ायर',w:'AC को एक दिशा के स्पंदित DC में बदलता है।',pk:'चौकोर काला बॉडी, 4 पाँव',mk:'KBU806, GBU8K, GBJ1006 (~ + − छपा)',bad:'चटका या जला, पाँव के पास रंग बदला हुआ।',
 d:function(p){return '<defs><linearGradient id="'+p+'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34353a"/><stop offset="1" stop-color="#141416"/></linearGradient></defs>'+leads([68,89,111,132],104,132)+'<rect x="52" y="22" width="96" height="84" rx="4" fill="url(#'+p+'b)" stroke="#000"/><circle cx="100" cy="42" r="8" fill="#1d2b25" stroke="#000"/>'+tx(100,72,'KBU806',14)+tx(100,88,'8A 600V',10,'#9aa0a6')}},
{t:'बल्क कैपेसिटर',w:'रेक्टिफ़ाई हुई DC को चिकना करके 300V के आसपास का भंडार बनाता है।',pk:'बड़ा बेलन, नीला आवरण, ऊपर K खाँचा',mk:'330µF 400V 105°C',bad:'ऊपर का ढक्कन फूला, नीचे रबर उभरा, तरल रिसा हुआ।',
 d:function(p){return can(p,['#1b4a9a','#3b7ae0'],['330µF 400V','105°C  ⌀35'],'#f2f6ff','#cfd6dd')}},
{t:'स्टार्टअप / कार्बन रेसिस्टर',w:'शुरू में PWM IC को Vcc देता है, या बैलेंसिंग और ब्लीडर का काम करता है।',pk:'रंगीन धारियाँ, ¼W से 2W',mk:'नारंगी-नारंगी-पीला-सुनहरा = 330kΩ ±5%',bad:'काला जला हुआ, चटका, या मीटर में OL।',d:resist},
{t:'स्विचिंग MOSFET',w:'300V DC को हर सेकंड हज़ारों बार ऑन-ऑफ करके ट्रांसफ़ॉर्मर को पल्स देता है।',pk:'TO-220 या TO-247, धातु टैब हीटसिंक पर',mk:'10N60, 20N60, 7N60 (G D S)',bad:'बॉडी में दरार, पाँव काले, ड्रेन-सोर्स बीप।',
 d:function(p){return to220(p,'10N60','600V 10A',['G','D','S'])}},
{t:'मेन ट्रांसफ़ॉर्मर EI33',w:'ऊँची फ़्रीक्वेंसी पर वोल्टेज बदलता है और बिजली को अलग (आइसोलेट) रखता है।',pk:'फेराइट EE कोर, पीला टेप, कई पिन',mk:'EI33, EE40, ETD39',bad:'टेप जला, जलने की गंध, पिन के जोड़ ठंडे।',
 d:function(p){var s='';for(var y=38;y<92;y+=5)s+='<line x1="84" y1="'+y+'" x2="116" y2="'+y+'" stroke="#a87a28" stroke-width="1.5"/>';return leads([56,72,88,112,128,144],102,128)+'<rect x="42" y="24" width="116" height="80" rx="3" fill="#2c2c30" stroke="#000"/><rect x="56" y="38" width="22" height="52" fill="#18181b"/><rect x="122" y="38" width="22" height="52" fill="#18181b"/><rect x="82" y="32" width="36" height="64" fill="#e6b84e"/>'+s+tx(100,15,'EI33',11,T)}},
{t:'शॉटकी डायोड',w:'सेकेंडरी पर पल्स को DC करता है, कम वोल्टेज ड्रॉप के साथ।',pk:'TO-220 या TO-247, 3 पाँव, कॉमन कैथोड',mk:'MBR3045PT, STPS3045, SBL3040',bad:'शॉर्ट होना (दोनों दिशा बीप), गर्मी से रंग उड़ना।',
 d:function(p){return to220(p,'MBR','3045PT',['A','K','A'])}},
{t:'आउटपुट इंडक्टर',w:'पल्स वाली DC को चिकनी करके आउटपुट कैपेसिटर तक भेजता है।',pk:'पीला-सफ़ेद टोरॉइड, मोटा तांबा',mk:'कोई निशान नहीं, कभी-कभी रंग से मान',bad:'वार्निश काली, तार ढीला या जला।',
 d:function(p){return toroid(p,'#e0c545','#ebebe4')}},
{t:'आउटपुट कैपेसिटर',w:'बचा हुआ रिपल सोखता है और अचानक बढ़े लोड की ज़रूरत पूरी करता है।',pk:'छोटा बेलन, लो ESR',mk:'2200µF 16V 105°C Low ESR',bad:'ऊपर का K खाँचा उभरा, तरल रिसा। सबसे ज़्यादा खराब होने वाला पार्ट।',
 d:function(p){return can(p,['#17151f','#2c2940'],['2200µF 16V','Low ESR 105°C'],'#e8c24f','#6b6fa0')}},
{t:'ऑप्टोकपलर PC817',w:'रोशनी से सिग्नल पार कराता है, इसलिए प्राइमरी और सेकेंडरी अलग रहते हैं।',pk:'4-पिन DIP, काला',mk:'PC817 या EL817',bad:'अंदर की LED टूटी: बाहर से सब ठीक, पर काम नहीं करता।',
 d:function(p){return dip(p,4,'PC817','C2 8A')}},
{t:'TL431 रेफ़रेंस',w:'2.495V की रेफ़रेंस से तुलना करके आउटपुट वोल्टेज तय करवाता है।',pk:'TO-92, काला, 3 पाँव',mk:'TL431 (REF · A · K)',bad:'बाहर से दिखता नहीं। टेस्ट या बदलकर ही पता चलता है।',
 d:function(p){return leads([82,100,118],88,126)+'<defs><linearGradient id="'+p+'q" x1="0" x2="1"><stop offset="0" stop-color="#2d2e32"/><stop offset="1" stop-color="#111113"/></linearGradient></defs><path d="M68 92 V62 A32 32 0 0 1 132 62 V92 Z" fill="url(#'+p+'q)" stroke="#000"/>'+tx(100,74,'TL431',12)+tx(100,86,'A 2310',8,'#9aa0a6')+tx(82,138,'R',10,T)+tx(100,138,'A',10,T)+tx(118,138,'K',10,T)}},
{t:'PWM IC TL494',w:'ड्यूटी साइकिल तय करके आउटपुट वोल्टेज स्थिर रखता है।',pk:'16-पिन DIP, पिन 1 पर बिंदी',mk:'TL494, KA7500B',bad:'बाहर से कम दिखता है। Vcc, ऑसिलेटर और आउटपुट जाँचें।',
 d:function(p){return dip(p,16,'TL494CN','ST 9812')}},
{t:'सुपरवाइज़र LM339',w:'चार कंपेरेटर जो OVP, UVP और Power Good बनाते हैं।',pk:'14-पिन DIP',mk:'LM339, LM339N',bad:'बाहर से कम दिखता है। PG और PS_ON का व्यवहार देखें।',
 d:function(p){return dip(p,14,'LM339N','TI 0412')}},
{t:'12V पंखा',w:'MOSFET, डायोड और ट्रांसफ़ॉर्मर को ठंडा रखता है।',pk:'80mm या 120mm, 12V',mk:'12V 0.25A',bad:'जाम, खड़-खड़ की आवाज़, धीमा घूमना।',
 d:function(p){var b='';for(var k=0;k<7;k++)b+='<path transform="rotate('+(k*360/7)+' 100 70)" d="M100 70 C 104 50, 124 38, 142 42 C 136 58, 118 68, 100 70 Z" fill="#3b3e46" stroke="#5a5e68"/>';return '<rect x="38" y="8" width="124" height="124" rx="10" fill="#202225" stroke="#000"/><circle cx="100" cy="70" r="52" fill="#101114"/><g class="fanblades">'+b+'</g><circle cx="100" cy="70" r="14" fill="#2a2c32" stroke="#555"/><circle cx="46" cy="16" r="3" fill="#0b0b0c"/><circle cx="154" cy="16" r="3" fill="#0b0b0c"/><circle cx="46" cy="124" r="3" fill="#0b0b0c"/><circle cx="154" cy="124" r="3" fill="#0b0b0c"/>'}},
{t:'ATX 24-पिन कनेक्टर',w:'मदरबोर्ड तक 12V, 5V, 3.3V, 5VSB और नियंत्रण सिग्नल पहुँचाता है।',pk:'2×12-पिन लॉक वाला प्लग',mk:'ATX 24-pin',bad:'ढीले/काले पिन, पिघला प्लास्टिक या खराब crimp।',
 d:function(p){var pins='';for(var r=0;r<2;r++)for(var c=0;c<12;c++)pins+='<rect x="'+(40+c*10)+'" y="'+(47+r*23)+'" width="6" height="13" rx="2" fill="'+(c%4===0?'#d5b64a':'#b8bec5')+'" stroke="#555"/>';return '<path d="M30 24h140v75H30z" rx="8" fill="#25282d" stroke="#111" stroke-width="3"/><path d="M30 30h140" stroke="#555" stroke-width="4"/>'+pins+'<path d="M155 20v-8h18v14" fill="#25282d" stroke="#111" stroke-width="3"/>'+tx(100,122,'24-PIN ATX',12,T)}},
{t:'SATA पावर कनेक्टर',w:'ड्राइव को 3.3V, 5V और 12V रेल के साथ ग्राउंड देता है।',pk:'15 संपर्क वाला चौड़ा L-आकार प्लग',mk:'SATA POWER',bad:'जले संपर्क, ढीला पिन या टूटा लॉक।',
 d:function(p){var pins='';for(var c=0;c<15;c++)pins+='<rect x="'+(28+c*9)+'" y="57" width="5" height="18" rx="1" fill="'+(c%5===0?'#d5b64a':'#b8bec5')+'" stroke="#555"/>';return '<path d="M24 28h148v58H24z" fill="#25282d" stroke="#111" stroke-width="3"/><path d="M36 28l10 -12h104l10 12" fill="#33373d" stroke="#111" stroke-width="3"/>'+pins+tx(100,112,'SATA POWER',12,T)}}
];
var el=document.getElementById('gal'),h='';
P.forEach(function(x,i){
 h+='<div class="part" data-search="'+x.t.toLocaleLowerCase()+'"><svg class="pic" viewBox="0 0 200 140" role="img" aria-label="'+x.t+' का चित्र">'+x.d('g'+i)+'</svg><div class="txt"><h4>'+x.t+'</h4><p>'+x.w+'</p><p class="mk">पैकेज: '+x.pk+'<br>निशान: '+x.mk+'</p><p><b>खराब दिखे तो:</b> '+x.bad+'</p></div></div>';
});
if(el)el.innerHTML=h;
})();
