
(function(){
'use strict';
var wrap=document.querySelector('.wrap');
if(!wrap)return;
var gallery=document.getElementById('real'),guide=document.getElementById('component-testing');
if(gallery&&guide){
 var guidePanel=document.createElement('div');guidePanel.className='real-test-guide';
 var guideHeading=guide.querySelector('h2');if(guideHeading){var heading=document.createElement('h3');heading.textContent='असली पार्ट देखकर उसकी टेस्टिंग सीखें';guidePanel.appendChild(heading)}
 while(guide.firstChild){var child=guide.firstChild;if(child===guideHeading){guide.removeChild(child);continue}guidePanel.appendChild(child)}
 guide.remove();gallery.appendChild(guidePanel);
}
var componentAnalogies=[
 [/फ़्यूज़|फ्यूज|fuse/i,'सुरक्षा-कड़ी जैसी: ज़्यादा करंट पर रास्ता खोलकर बाकी सर्किट को बचाती है।'],
 [/MOV|वैरिस्टर|varistor/i,'pressure-relief valve जैसा: voltage spike पर अतिरिक्त ऊर्जा को रास्ता देता है।'],
 [/NTC|थर्मिस्टर|thermistor/i,'soft-start वाल्व जैसा: ठंडा होने पर शुरुआती करंट रोकता है, गर्म होने पर रास्ता आसान करता है।'],
 [/EMI फ़िल्टर|EMI filter/i,'दरवाज़े की जाली जैसा: अनचाहा विद्युत शोर रोकता है, उपयोगी ऊर्जा को जाने देता है।'],
 [/ब्रिज रेक्टिफ़ायर|bridge rectifier/i,'एक-दिशा दरवाज़ों की चौकी जैसा: AC के दोनों आधे चक्र को एक दिशा में मोड़ता है।'],
 [/बल्क कैपेसिटर|bulk capacitor/i,'पानी की टंकी जैसा: झटके से आने वाली धारा जमा करके अधिक समान धार में छोड़ता है।'],
 [/MOSFET|ट्रांजिस्टर|transistor/i,'तेज़ इलेक्ट्रॉनिक नल जैसा: खुल-बंद होकर ट्रांसफ़ॉर्मर को ऊर्जा के छोटे पल भेजता है।'],
 [/स्नबर|snubber/i,'shock absorber जैसा: switch बंद होते समय voltage spike को दबाता है।'],
 [/ट्रांसफ़ॉर्मर|transformer/i,'दो अलग कमरों के बीच ऊर्जा पहुँचाने जैसा: सीधा तार जोड़े बिना वोल्टेज बदलता है।'],
 [/स्टार्टअप.*रेसिस्टर|startup.*resistor/i,'starter rope जैसा: PWM कंट्रोलर को शुरुआती ऊर्जा देता है।'],
 [/शॉटकी|schottky/i,'एक-दिशा तेज़ दरवाज़े जैसा: पल्स को कम रुकावट के साथ DC तरफ़ जाने देता है।'],
 [/इंडक्टर|कॉइल|inductor|coil/i,'भारी घूमते पहिए जैसा: करंट के अचानक बदलने का विरोध करता और ऊर्जा जमा करता है।'],
 [/आउटपुट.*कैपेसिटर|output.*capacitor/i,'छोटी टंकी और damper जैसा: आउटपुट के तेज़ उतार-चढ़ाव को समतल करता है।'],
 [/3\.3V रेगुलेटर|मैग-एम्प|regulator/i,'नल का flow regulator जैसा: रेल का वोल्टेज तय सीमा के पास रखता है।'],
 [/PWM कंट्रोलर|PWM controller/i,'ट्रैफ़िक सिग्नल जैसा: switch को चालू रहने का समय तय करता है।'],
 [/TL431|ऑप्टोकपलर|feedback/i,'थर्मोस्टैट और संदेशवाहक जैसा: आउटपुट देखकर नियंत्रण हिस्से को सुधार बताता है।'],
 [/5VSB|स्टैंडबाय|standby/i,'आपातकालीन छोटी लाइट जैसी: मुख्य सप्लाई बंद रहते भी तैयार रहती है।'],
 [/सुपरवाइज़र|supervisor/i,'सुरक्षा चौकीदार जैसा: वोल्टेज और fault देखकर supply को रोकता है।'],
 [/PFC/i,'कदम मिलाने वाले conductor जैसा: input current को mains voltage के साथ तालमेल में रखता है।'],
 [/पंखा|fan/i,'रेडिएटर के पंखे जैसा: गर्मी बाहर निकालकर पार्ट्स को सुरक्षित तापमान पर रखता है।'],
 [/ATX कनेक्टर|ATX connector/i,'अलग-अलग पाइप लाइनों जैसा: सही rail को सही हिस्से तक पहुँचाता है।']
];
if(gallery)gallery.querySelectorAll('.test-card').forEach(function(card){
 var title=card.querySelector('h3'),first=card.querySelector('p');if(!title||!first||card.querySelector('.component-analogy'))return;
 var rule=componentAnalogies.find(function(entry){return entry[0].test(title.textContent)});if(!rule)return;
 var note=document.createElement('p');note.className='component-analogy';note.textContent='रोज़मर्रा की मिसाल: '+rule[1];first.insertAdjacentElement('beforebegin',note);
});
/* पैनल और साइडबार की सूची: [id, आइकन, हिंदी नाम, English name] */
var GROUPS=[
{id:'smps',icon:'⚡',hi:'SMPS लैब (पूरी जाँच)',en:'SMPS Lab (Full Guide)',items:[
  ['home','🏠','होम','Home'],
  ['safe-top','🛡️','पहले सुरक्षा','Safety First'],
  ['safe','⚠️','सुरक्षा के नियम','Safety Rules'],
  ['recap','📝','सारांश और अभ्यास','Summary & Practice']
 ]}
];
window.__panelGroups=GROUPS;
var panels=[],byId={};
GROUPS.forEach(function(g){g.items.forEach(function(it){
 var el=document.getElementById(it[0]);if(!el)return;
 var p={id:it[0],hi:it[2],en:it[3],el:el};panels.push(p);byId[p.id]=p;
})});
var realLinks={
 ac:['फ़्यूज़','वैरिस्टर MOV','NTC थर्मिस्टर','X2 कैपेसिटर','ब्रिज रेक्टिफ़ायर','बल्क कैपेसिटर'],
 hv:['बल्क कैपेसिटर','स्टार्टअप / कार्बन रेसिस्टर','स्विचिंग MOSFET','मेन ट्रांसफ़ॉर्मर EI33'],
 dc:['शॉटकी डायोड','आउटपुट इंडक्टर','आउटपुट कैपेसिटर'],
 ctl:['PWM IC TL494','TL431 रेफ़रेंस','ऑप्टोकपलर PC817'],
 'repair-guide':['फ़्यूज़','स्विचिंग MOSFET','शॉटकी डायोड','आउटपुट कैपेसिटर'],
 connectors:['ATX 24-पिन कनेक्टर','SATA पावर कनेक्टर']
};
Object.keys(realLinks).forEach(function(sectionId){
 var section=document.getElementById(sectionId),heading=section&&section.querySelector('h2');
 if(!section||!heading)return;
 var box=document.createElement('div');box.className='pv-real-links';
 var label=document.createElement('b');label.textContent='इस सेक्शन के असली SMPS पार्ट देखें';box.appendChild(label);
 realLinks[sectionId].forEach(function(name){
  var part=Array.from(document.querySelectorAll('#gal .part')).find(function(card){var title=card.querySelector('h4');return title&&title.textContent.trim()===name});
  if(!part)return;
  if(!part.id){part.id='pv-real-'+name.toLocaleLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g,'-');part.tabIndex=-1}
  var button=document.createElement('button');button.type='button';button.dataset.realTarget=part.id;button.textContent='🔎 '+name;box.appendChild(button);
 });
 /* असली पार्ट के बटन की अलग सूची हटा दी: नीचे हर पार्ट पहले से खुलकर दिखता है */
});
/* सूचीकृत पैनल के अलावा बाकी पुराने सेक्शन भी छुपे रहें। */
wrap.querySelectorAll(':scope > section').forEach(function(section){section.classList.add('pv-hide')});

var oldNav=wrap.querySelector('nav.tabs');if(oldNav)oldNav.classList.add('pv-hide');

/* ऊपर की पट्टी: सिर्फ़ नाम + पिछला / अगला (सूची सिर्फ़ साइडबार में है) */
var hero=wrap.querySelector('header.hero');
function LL(hi,en){var l=document.documentElement.lang==='en';return '<span data-lang="hi"'+(l?' hidden':'')+'>'+hi+'</span><span data-lang="en"'+(l?'':' hidden')+'>'+en+'</span>'}
var bar=document.createElement('div');bar.className='pv-bar pv-hide';
bar.innerHTML='<div class="pv-title"></div><div class="pv-nav"><button type="button" class="pv-prev">← '+LL('पिछला','Previous')+'</button><button type="button" class="pv-next">'+LL('अगला','Next')+' →</button></div>';
wrap.appendChild(bar);
var cur=null;
function show(id,noHash){
 var p=byId[id];if(!p){id='home';p=byId.home;if(!p)return}
 wrap.querySelectorAll(':scope > section').forEach(function(section){section.classList.add('pv-hide')});
 p.el.classList.remove('pv-hide');
 if(hero)hero.classList.toggle('pv-hide',id!=='home');
 p.el.insertAdjacentElement('beforebegin',bar);bar.classList.remove('pv-hide');
 bar.querySelector('.pv-title').innerHTML=LL(p.hi,p.en);
 var i=panels.indexOf(p);
 bar.querySelector('.pv-prev').disabled=i<=0;bar.querySelector('.pv-next').disabled=i>=panels.length-1;
 cur=p;
 if(!noHash&&location.hash!=='#'+id){try{history.pushState(null,'','#'+id)}catch(e){}}
 window.scrollTo(0,0);
 try{window.dispatchEvent(new Event('resize'))}catch(e){}
 try{document.dispatchEvent(new CustomEvent('smps-panel',{detail:id}))}catch(e){}
}
wrap.addEventListener('click',function(e){
 var button=e.target.closest('[data-real-target]');if(!button)return;
 show('real');
 requestAnimationFrame(function(){var target=document.getElementById(button.dataset.realTarget);if(target){target.scrollIntoView({behavior:'smooth',block:'center'});target.focus({preventScroll:true})}});
});
bar.querySelector('.pv-prev').addEventListener('click',function(){var i=panels.indexOf(cur);if(i>0)show(panels[i-1].id)});
bar.querySelector('.pv-next').addEventListener('click',function(){var i=panels.indexOf(cur);if(i<panels.length-1)show(panels[i+1].id)});
function fromHash(){
 var id=decodeURIComponent((location.hash||'').slice(1));
 if(!id){show('home',true);return}
 if(byId[id]){show(id,true);return}
 if(id==='component-testing'){show('real',true);return}
 var el=document.getElementById(id),host=el&&panels.filter(function(p){return p.el.contains(el)})[0];
 if(host){show(host.id,true);try{el.scrollIntoView()}catch(e){}}else show('home',true);
}
window.addEventListener('hashchange',fromHash);
window.addEventListener('popstate',fromHash);
/* दूसरे स्क्रिप्ट के बटन (जैसे "बेंच खोलें") छुपे पैनल की ओर scrollIntoView करें तो पैनल खोल दें */
var orig=Element.prototype.scrollIntoView;
Element.prototype.scrollIntoView=function(){
 var el=this,host=panels.filter(function(p){return p.el===el||p.el.contains(el)})[0];
 if(host&&host.el.classList.contains('pv-hide'))show(host.id);
 return orig.apply(el,arguments);
};
fromHash();
window.__panels={show:show,list:panels,current:function(){return cur&&cur.id}};
})();
