
(function(){
  'use strict';
  var $=function(id){return document.getElementById(id)};
  var appbar=document.querySelector('.appbar');
  if(!appbar)return;
  var audioContext=null,audioMuted=false;
  try{audioMuted=localStorage.getItem('smps-audio-muted')==='true'}catch(e){}
  function playAudio(name){
    if(audioMuted)return;
    try{
      var Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;
      audioContext=audioContext||new Context();if(audioContext.state==='suspended')audioContext.resume();
      var now=audioContext.currentTime;
      function tone(frequency,at,duration,volume,type,endFrequency){
        var oscillator=audioContext.createOscillator(),gain=audioContext.createGain();oscillator.type=type||'sine';oscillator.frequency.setValueAtTime(frequency,at);if(endFrequency)oscillator.frequency.exponentialRampToValueAtTime(endFrequency,at+duration);
        gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start(at);oscillator.stop(at+duration+.01);
      }
      if(name==='fuse'){
        var length=Math.floor(audioContext.sampleRate*.1),buffer=audioContext.createBuffer(1,length,audioContext.sampleRate),samples=buffer.getChannelData(0);
        for(var i=0;i<length;i++)samples[i]=(Math.random()*2-1)*(1-i/length);
        var source=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter(),popGain=audioContext.createGain();source.buffer=buffer;filter.type='highpass';filter.frequency.value=1100;popGain.gain.setValueAtTime(.07,now);popGain.gain.exponentialRampToValueAtTime(.0001,now+.09);source.connect(filter);filter.connect(popGain);popGain.connect(audioContext.destination);source.start(now);tone(180,now,.1,.045,'triangle',70);
      }else if(name==='relay'){tone(1150,now,.035,.04,'square');tone(540,now+.045,.05,.035,'triangle')}
      else if(name==='danger'){[880,620,880].forEach(function(frequency,index){tone(frequency,now+index*.19,.16,.045,'sawtooth')})}
      else tone(2200,now,.16,.05,'sine');
    }catch(e){}
  }
  window.__smpsAudio={play:playAudio,isMuted:function(){return audioMuted},setMuted:function(value){audioMuted=!!value;try{localStorage.setItem('smps-audio-muted',String(audioMuted))}catch(e){}return audioMuted}};
  document.querySelectorAll('#home img[src="placeholder.jpg"]').forEach(function(image){
    function showPlaceholder(){
      var initials=image.alt.indexOf('बद्री')>=0?'BS':image.alt.indexOf('JD')>=0?'JD':image.alt.indexOf('गौरव')>=0?'GS':image.alt.indexOf('संत कुमार')>=0?'SV':'FI';
      var placeholder=document.createElement('div');placeholder.className='photo-placeholder';placeholder.setAttribute('role','img');placeholder.setAttribute('aria-label',image.alt);placeholder.textContent=initials;image.replaceWith(placeholder);
    }
    image.addEventListener('error',showPlaceholder,{once:true});
    if(image.complete&&!image.naturalWidth)showPlaceholder();
  });
  var DEV=/[ऀ-ॿ]/,ATTRS=['title','aria-label','placeholder','alt'];
  var dict=window.__SMPS_EN||{},language='hi';
  var trCache=new Map(),fragRe=null,nodeState=new WeakMap(),attrState=new WeakMap();
  function escRe(x){return x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
  function buildFrag(){
    var keys=Object.keys(dict).filter(function(k){return k.length>=5}).sort(function(a,b){return b.length-a.length});
    if(!keys.length){fragRe=/(?!)/g;return}
    var body=keys.map(escRe).join('|');
    try{fragRe=new RegExp('(?<![\\u0900-\\u097F])(?:'+body+')(?![\\u0900-\\u097F])','g')}catch(e){fragRe=new RegExp('(?:'+body+')','g')}
  }
  function english(raw){
    var t=raw.trim();if(!t||!DEV.test(t))return raw;
    var out=trCache.get(t);
    if(out===undefined){
      out=dict[t];
      if(out===undefined){if(!fragRe)buildFrag();out=t.replace(fragRe,function(m){return dict[m]})}
      if(trCache.size>6000)trCache.clear();
      trCache.set(t,out);
    }
    var i=raw.indexOf(t);return raw.slice(0,i)+out+raw.slice(i+t.length);
  }
  window.__smpsEnglish=english;
  function skipNode(node){var el=node.parentElement;return !el||/^(SCRIPT|STYLE|TEXTAREA)$/.test(el.tagName)||!!el.closest('#troubleshooting-game,[data-lang]')}
  function syncText(node){
    var v=node.nodeValue,st=nodeState.get(node),src=(st&&v===st.out)?st.src:v;
    if(language==='hi'&&!st)return;
    if(!DEV.test(src))return;
    var out=language==='en'?english(src):src;
    nodeState.set(node,{src:src,out:out});
    if(out!==v)node.nodeValue=out;
  }
  function syncAttrs(el){
    if(el.closest('#troubleshooting-game,[data-lang]'))return;
    ATTRS.forEach(function(a){
      if(!el.hasAttribute(a))return;
      var o=attrState.get(el)||{},cur=el.getAttribute(a),src=(o[a]&&cur===o[a].out)?o[a].src:cur;
      if(language==='hi'&&!o[a])return;
      if(!DEV.test(src))return;
      var out=language==='en'?english(src):src;
      o[a]={src:src,out:out};attrState.set(el,o);
      if(out!==cur)el.setAttribute(a,out);
    });
  }
  function localize(root){
    if(!root)return;
    if(root.nodeType===3){if(!skipNode(root))syncText(root);return}
    if(root.nodeType!==1)return;
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;
    while((n=w.nextNode())){if(!skipNode(n))syncText(n)}
    syncAttrs(root);
    root.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(syncAttrs);
  }
  window.__applyLang=function(root){
    root=root||document;
    if(root.dataset&&root.dataset.lang)root.hidden=root.dataset.lang!==language;
    if(root.querySelectorAll)root.querySelectorAll('[data-lang]').forEach(function(el){el.hidden=el.dataset.lang!==language});
  };
  try{
    var CP=CanvasRenderingContext2D.prototype;
    ['fillText','strokeText'].forEach(function(fn){var o=CP[fn];CP[fn]=function(t){if(language==='en'&&typeof t==='string'&&DEV.test(t))arguments[0]=english(t);return o.apply(this,arguments)}});
  }catch(e){}
  var menu=document.createElement('button');
    var inlineTipTimer=0;
    var inlineTermKey={MOSFET:'sw',NTC:'ntc',MOV:'mov'};
    function bindComponentTerm(span,term){
      var key=inlineTermKey[term.toUpperCase()];span.className='component-term';span.dataset.term=term.toUpperCase();span.tabIndex=0;span.setAttribute('role','button');span.setAttribute('aria-haspopup','dialog');span.setAttribute('aria-controls','bd-tooltip');span.setAttribute('aria-expanded','false');
      function open(pinned){window.__showSmpsTip(key,span,pinned)}
      span.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch')open(false)});
      span.addEventListener('pointerleave',function(){inlineTipTimer=setTimeout(function(){var tip=document.getElementById('bd-tooltip');if(tip&&tip.dataset.pinned!=='true')window.__hideSmpsTip()},120)});
      span.addEventListener('focusin',function(){open(false)});
      span.addEventListener('focusout',function(){var tip=document.getElementById('bd-tooltip');if(tip&&tip.dataset.pinned!=='true')window.__hideSmpsTip()});
      span.addEventListener('click',function(e){e.stopPropagation();open(true)});
      span.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(true)}if(e.key==='Escape')window.__hideSmpsTip()});
    }
    function decorateComponentText(root){
      if(!root)return;var textNodes=[];
      if(root.nodeType===3)textNodes=[root];
      else if(root.nodeType===1||root.nodeType===9){var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),node;while((node=walker.nextNode()))textNodes.push(node)}
      textNodes.forEach(function(textNode){
        var parent=textNode.parentElement;if(!parent||parent.closest('script,style,textarea,input,select,option,code,pre,svg,.component-term,.bd-tooltip,[contenteditable="true"]'))return;
        var value=textNode.nodeValue,pattern=/\b(MOSFET|NTC|MOV)\b/gi,match,cursor=0,fragment=null;
        while((match=pattern.exec(value))){
          if(!fragment)fragment=document.createDocumentFragment();fragment.appendChild(document.createTextNode(value.slice(cursor,match.index)));
          var term=document.createElement('span');term.textContent=match[0];bindComponentTerm(term,match[0]);fragment.appendChild(term);cursor=pattern.lastIndex;
        }
        if(fragment){fragment.appendChild(document.createTextNode(value.slice(cursor)));textNode.parentNode.replaceChild(fragment,textNode)}
      });
    }
    decorateComponentText(document.body);
    var menu=document.createElement('button');
  menu.type='button';menu.className='header-action';menu.textContent='☰';menu.setAttribute('aria-label','सूची खोलें / बंद करें');menu.setAttribute('aria-expanded','false');
  var lang=document.createElement('button');
  lang.type='button';lang.className='header-action';lang.id='language-toggle';lang.textContent='🌐 English';lang.setAttribute('aria-label','Switch website language to English');
  var theme=appbar.querySelector('#themeBtn');
  appbar.insertBefore(menu,appbar.firstChild);
  appbar.insertBefore(lang,theme||null);
  var sidebar=document.createElement('aside');
  sidebar.className='app-sidebar';sidebar.id='app-sidebar';sidebar.setAttribute('aria-label','मुख्य नेविगेशन');
  function Lh(hi,en){return '<span data-lang="hi"'+(language==='hi'?'':' hidden')+'>'+hi+'</span><span data-lang="en"'+(language==='en'?'':' hidden')+'>'+en+'</span>'}
  sidebar.innerHTML='<div class="sb-top"><div class="sb-logo" aria-hidden="true">⚡</div><div class="sb-brand"><b>SMPS '+Lh('लैब','Lab')+'</b><small>'+Lh('सीखें · जाँचें · ठीक करें','Learn · Test · Repair')+'</small></div></div>'
   +'<label class="sb-search"><span aria-hidden="true">🔎</span><input type="search" id="sb-q" autocomplete="off" spellcheck="false" placeholder="खोजें…" aria-label="खोजें"></label>'
   +'<nav class="sb-nav" aria-label="सूची"></nav><div class="sb-foot"></div><p class="sb-none" hidden>'+Lh('कुछ नहीं मिला','Nothing found')+'</p>';
  var sideNav=sidebar.querySelector('.sb-nav'),sideFoot=sidebar.querySelector('.sb-foot'),sideQ=sidebar.querySelector('#sb-q'),sideNone=sidebar.querySelector('.sb-none');
  function isDocked(){return window.matchMedia&&window.matchMedia('(min-width:1100px)').matches}
  function closeSidebar(){document.body.classList.remove('sidebar-open');menu.setAttribute('aria-expanded',String(isDocked()&&!document.body.classList.contains('sb-collapsed')))}
  var stepNum=0;
  function mkHomeLink(){
      var a=document.createElement('a');a.className='sb-home';a.href='#home';a.dataset.id='home';a.dataset.q='home होम home';
      a.innerHTML='<span class="sb-step" aria-hidden="true">🏠</span><span class="sb-ic" aria-hidden="true">🏠</span><span class="sb-t">'+Lh('होम — शुरुआत','Home — Start')+'</span>';
      a.addEventListener('click',function(){if(!isDocked())closeSidebar()});
      sideNav.appendChild(a);
    }
    mkHomeLink();
  var SB_ALIAS={'एक्सेल':'excel','वर्ड':'word','पॉवरपॉइंट':'powerpoint','पावरपॉइंट':'powerpoint','प्रेजेंटेशन':'presentation','विंडोज':'windows','विंडोज़':'windows','लिनक्स':'linux','ऑफिस':'office','सीपीयू':'cpu','रैम':'ram','जीपीयू':'gpu','एसएसडी':'ssd','एचडीडी':'hdd','बायोस':'bios','एसएमपीएस':'smps','मदरबोर्ड':'motherboard','क्विज़':'quiz','क्विज':'quiz','शब्दकोश':'glossary','ग्लॉसरी':'glossary','प्रैक्टिकल':'practical','सुरक्षा':'safety','नेटवर्क':'network','हार्डवेयर':'hardware','सॉफ्टवेयर':'software','सॉफ़्टवेयर':'software','थ्योरी':'theory','ट्रेनिंग':'training','इलेक्ट्रॉनिक्स':'electronics','सर्वर':'server','प्रोग्रामिंग':'programming','क्लाउड':'cloud'};
  function sbTerms(q){var out=[q];Object.keys(SB_ALIAS).forEach(function(k){if(q.indexOf(k)>=0)out.push(q.split(k).join(SB_ALIAS[k]))});return out}
  var sbCur=null;
  function sbHead(g,n){
    var sec=document.createElement('div');sec.className='sb-sect';sec.dataset.group=g.id;
    var h=document.createElement('h3');h.className='sb-sec';h.dataset.group=g.id;
    h.innerHTML='<span class="sb-gi" aria-hidden="true">'+g.icon+'</span><span class="sb-gt">'+Lh(g.hi,g.en)+'</span><span class="sb-count">'+n+'</span>';
    sec.appendChild(h);sideNav.appendChild(sec);sbCur=sec;
  }
  function sbLink(it,g,external){
    stepNum++;
    var a=document.createElement('a');a.className='sb-link';a.href=external||('#'+it[0]);
    a.dataset.id=it[0];a.dataset.step=stepNum;
    a.dataset.q=(it[2]+' '+it[3]+' '+g.hi+' '+g.en).toLowerCase().normalize('NFC');
    a.innerHTML='<span class="sb-step" aria-hidden="true">'+stepNum+'</span><span class="sb-ic" aria-hidden="true">'+it[1]+'</span><span class="sb-t">'+Lh(it[2],it[3])+'</span>';
    a.addEventListener('click',function(){if(!isDocked())closeSidebar()});
    (sbCur||sideNav).appendChild(a);
  }
    (window.__panelGroups||[]).forEach(function(g){
      var shown=g.items.filter(function(it){return it[0]!=='home'});
      if(!shown.length)return;
      sbHead(g,shown.length);
      shown.forEach(function(it){
        var external=null;
        sbLink(it,g,external);
      });
    });
  function setActive(id){
    id=id||(location.hash||'#home').slice(1);
    var found=null;
    sideNav.querySelectorAll('a').forEach(function(a){if(a.dataset.id===id){a.setAttribute('aria-current','page');found=a}else a.removeAttribute('aria-current')});
    if(found&&!sideQ.value){try{found.scrollIntoView({block:'nearest'})}catch(e){}}
  }
  sideQ.addEventListener('input',function(){
    var q=sideQ.value.trim().toLowerCase().normalize('NFC'),terms=sbTerms(q),any=false,shown=0;
    Array.prototype.forEach.call(sideNav.children,function(sec){
      if(sec.tagName==='A'){var h0=(sec.dataset.q||'').normalize('NFC');sec.hidden=!!q&&!terms.some(function(t){return h0.indexOf(t)>=0});if(!sec.hidden)any=true;return}
      if(!sec.classList.contains('sb-sect'))return;
      shown=0;
      Array.prototype.forEach.call(sec.children,function(el){
        if(el.tagName!=='A')return;
        var hay=(el.dataset.q||'').normalize('NFC');
        var ok=!q||terms.some(function(t){return hay.indexOf(t)>=0});
        el.hidden=!ok;if(ok){shown++;any=true}
      });
      sec.hidden=!shown;
    });
    if(!q)setActive();
    sideNone.hidden=any||!q;
  });
  var soundButton=document.createElement('button');soundButton.type='button';soundButton.className='sidebar-audio-toggle';
  function updateSoundButton(){var muted=window.__smpsAudio.isMuted();soundButton.textContent=language==='hi'?(muted?'♫ ध्वनि चालू करें':'♫ ध्वनि बंद करें'):(muted?'♫ Turn sound on':'♫ Mute sound');soundButton.setAttribute('aria-pressed',String(muted));soundButton.setAttribute('aria-label',soundButton.textContent);soundButton.title=soundButton.textContent}
  updateSoundButton();soundButton.addEventListener('click',function(){window.__smpsAudio.setMuted(!window.__smpsAudio.isMuted());updateSoundButton()});sideFoot.appendChild(soundButton);
  var backdrop=document.createElement('div');backdrop.className='app-sidebar-backdrop';backdrop.setAttribute('aria-hidden','true');
  document.body.append(sidebar,backdrop);
  menu.addEventListener('click',function(){
    if(isDocked()){var c=document.body.classList.toggle('sb-collapsed');menu.setAttribute('aria-expanded',String(!c));return}
    var open=!document.body.classList.contains('sidebar-open');
    document.body.classList.toggle('sidebar-open',open);menu.setAttribute('aria-expanded',String(open));
  });
  menu.setAttribute('aria-expanded',String(isDocked()));
  backdrop.addEventListener('click',closeSidebar);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSidebar()});
  document.addEventListener('smps-panel',function(e){setActive(e.detail)});
  window.addEventListener('hashchange',function(){setActive()});
  setActive(window.__panels&&window.__panels.current());
  var studentToggle=$('student-mode-toggle');
  function setStudentMode(enabled){
    document.body.classList.toggle('student-mode',enabled);
if(studentToggle)studentToggle.setAttribute('aria-pressed',String(enabled));
if(studentToggle)studentToggle.textContent=language==='hi'?(enabled?'विद्यार्थी मोड बंद करें':'विद्यार्थी मोड चालू करें'):(enabled?'Turn Student Mode off':'Turn Student Mode on');
    try{localStorage.setItem('smps-student-mode',String(enabled))}catch(e){}
  }
  var studentMode=false;
  try{studentMode=localStorage.getItem('smps-student-mode')==='true'}catch(e){}
  setStudentMode(studentMode);
if(studentToggle)studentToggle.addEventListener('click',function(){setStudentMode(!document.body.classList.contains('student-mode'))});
  function setLanguage(next){
    language=next;
    updateSoundButton();
    document.documentElement.lang=language;
    lang.textContent=language==='hi'?'🌐 English':'🌐 हिंदी';
    window.__applyLang(document);
    localize(document.body);
    setStudentMode(document.body.classList.contains('student-mode'));
    if(typeof updateGameLanguage==='function')updateGameLanguage();
    menu.setAttribute('aria-label',language==='hi'?'सूची खोलें / बंद करें':'Open or close menu');
    sideQ.placeholder=language==='hi'?'खोजें…':'Search…';sideQ.setAttribute('aria-label',sideQ.placeholder);
    sideNav.setAttribute('aria-label',language==='hi'?'सूची':'Menu');
    lang.setAttribute('aria-label',language==='hi'?'Switch website language to English':'वेबसाइट की भाषा हिंदी करें');
    document.title=language==='en'?'Complete CHNM Trade Guide · Future Instructor Group · Sant Varman 420':'सम्पूर्ण CHNM Trade Guide · Future Instructor Group · Sant Varman 420';
    try{localStorage.setItem('smps-lang',language)}catch(e){}
    window.__guideLang=language;
    try{window.dispatchEvent(new Event('resize'))}catch(e){}
  }
  lang.addEventListener('click',function(){setLanguage(language==='hi'?'en':'hi')});
  var observer=new MutationObserver(function(records){
    records.forEach(function(r){
      if(r.type==='characterData'){if(language==='en'&&!skipNode(r.target))syncText(r.target);return}
      r.addedNodes.forEach(function(n){
        if(n.nodeType===1||n.nodeType===3){
          var holder=n.nodeType===1?n:n.parentElement;
          decorateComponentText(n);
          if(language==='en'){localize(n.nodeType===1?n:holder);if(holder&&holder.parentElement)localize(holder)}
          else if(n.nodeType===1)window.__applyLang(n);
        }
      });
    });
  });
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  window.addEventListener('load',function(){try{if(localStorage.getItem('smps-lang')==='en')setLanguage('en')}catch(e){}});
  if($('bx-scope-pause')&&$('bx-running')){
  $('bx-scope-pause').addEventListener('click',function(){
    var b=this,paused=b.getAttribute('aria-pressed')!=='true';
    b.setAttribute('aria-pressed',String(paused));b.textContent=paused?'▶ वेवफ़ॉर्म चलाएँ':'⏸ वेवफ़ॉर्म रोकें';
    $('bx-scope-state').textContent=paused?'फ़्रीज़':'लाइव';
    window.__bxScopeControl.pause(paused);
  });
  var zoom=1;
  function setZoom(next){zoom=window.__bxScopeControl.zoom(next);$('bx-scope-zoom').textContent=zoom+'×'}
  $('bx-scope-in').addEventListener('click',function(){setZoom(zoom*1.5)});
  $('bx-scope-out').addEventListener('click',function(){setZoom(zoom/1.5)});

  var game=document.createElement('section');
  game.className='troubleshooting-game';game.id='troubleshooting-game';
  game.innerHTML='<h3>🎯 Troubleshooting Master / ट्रबलशूटिंग मास्टर</h3><p data-lang="hi">छुपी हुई खराबी पाने के लिए गेम शुरू करें। बिजली बंद है—मल्टीमीटर मोड और दोनों प्रोब लगाकर पार्ट जाँचें, फिर अपना अनुमान चुनें। सही जाँच और निदान पर 100 अंक।</p><p data-lang="en" hidden>Start a round to get a hidden fault. Power is off—select the meter mode and probe both test points, then choose your diagnosis. Earn 100 points for a correct test and diagnosis.</p><div class="row"><button type="button" id="game-start">🎲 गेम शुरू करें / Start game</button><span class="game-score" id="game-score">स्कोर / Score: 0</span></div><div class="game-choices" role="group" aria-label="खराब कंपोनेंट चुनें"><button type="button" data-game-part="f1" aria-pressed="false">फ़्यूज़ / Fuse</button><button type="button" data-game-part="c1" aria-pressed="false">बल्क कैप / Bulk capacitor</button><button type="button" data-game-part="mov" aria-pressed="false">MOV वेरिस्टर / MOV varistor</button></div><div class="row"><button type="button" id="game-check">मीटर से जाँचकर उत्तर दें / Check diagnosis</button><button type="button" id="game-reveal">समाधान दिखाएँ / Reveal</button></div><p id="game-feedback" class="game-feedback" aria-live="polite">गेम शुरू करने के लिए बटन दबाएँ। / Press Start to begin.</p>';
  var running=$('bx-running');
  running.insertBefore(game,running.firstChild);
  var tries=document.createElement('span');tries.className='game-attempts';tries.id='game-attempts';tries.setAttribute('aria-live','polite');
  $('game-score').insertAdjacentElement('afterend',tries);
  var score=0,target=null,choice=null,gameSolved=false,gameStatus='idle',gameRevealed=false,gameTries=3,gameOver=false;
  var gameCopy={
    hi:{
      title:'🎯 ट्रबलशूटिंग मास्टर गेम',start:'🎲 नया गेम शुरू करें',fuse:'फ़्यूज़ / Fuse',bulk:'बल्क कैप / Bulk capacitor',mov:'MOV वेरिस्टर / MOV varistor',
      check:'मीटर से जाँचकर उत्तर दें',reveal:'समाधान दिखाएँ',idle:'गेम शुरू करने के लिए बटन दबाएँ।',attempts:'मौके शेष: ',outOfAttempts:'तीन मौके पूरे।',
      hidden:'खराबी छुपा दी गई है। पार्ट के पिन-चिप पर टैप करके मीटर से जाँचें।',
      noRound:'पहले गेम शुरू करें।',noChoice:'पहले अपना निदान चुनें।',
      wrongProbe:'सही पार्ट के पिन पर प्रोब लगाएँ और उपयुक्त मीटर मोड चुनें।',
      badReading:'मीटर की स्पष्ट खराबी वाली रीडिंग नहीं मिली—प्रोब और मोड फिर जाँचें।',
      wrongAnswer:'रीडिंग इस खराबी की पुष्टि नहीं करती। सही पार्ट और मीटर मोड जाँचें।',
      right:'सही निदान! +100 अंक। नया राउंड खेलने के लिए फिर शुरू करें।',
      solved:'इस राउंड के अंक पहले ही मिल चुके हैं। नया राउंड शुरू करें।',
      wrongChoice:'माप सही है, लेकिन चुना गया पार्ट खराब नहीं है। फिर कोशिश करें।',
      revealPrefix:'छुपी खराबी: ',score:'स्कोर: '
    },
    en:{
      title:'🎯 Troubleshooting Master Game',start:'🎲 Start new game',fuse:'Fuse',bulk:'Bulk capacitor',mov:'MOV varistor',
      check:'Check probes & diagnosis',reveal:'Reveal fault',idle:'Press Start to begin a game.',attempts:'Attempts left: ',outOfAttempts:'All three attempts are used.',
      hidden:'A fault is hidden. Tap the component test pins and check it with the meter.',
      noRound:'Start a game first.',noChoice:'Choose your diagnosis first.',
      wrongProbe:'Probe the correct component pins and select the appropriate meter mode.',
      badReading:'No clear fault reading. Recheck the probes and meter mode.',
      wrongAnswer:'The reading does not confirm this fault. Recheck the component and meter mode.',
      right:'Correct diagnosis! +100 points. Start a new round to play again.',
      solved:'This round has already been scored. Start a new round.',
      wrongChoice:'The measurement is correct, but that component is not faulty. Try again.',
      revealPrefix:'Hidden fault: ',score:'Score: '
    }
  };
  function setGameStatus(key){
    gameStatus=key;
    $('game-feedback').textContent=gameCopy[language][key];
  }
  function updateGameLanguage(){
    var copy=gameCopy[language];
    $('troubleshooting-game').querySelector('h3').textContent=copy.title;
    $('game-start').textContent=copy.start;
    $('game-check').textContent=copy.check;
    $('game-reveal').textContent=copy.reveal;
    $('game-score').textContent=copy.score+score;
    $('game-attempts').textContent=copy.attempts+gameTries+'/3';
    game.querySelector('[data-game-part="f1"]').textContent=copy.fuse;
    game.querySelector('[data-game-part="c1"]').textContent=copy.bulk;
    game.querySelector('[data-game-part="mov"]').textContent=copy.mov;
    setGameStatus(gameStatus);
    if(target){
      $('game-feedback').textContent=gameStatus==='hidden'?copy.hidden:copy[gameStatus];
      if(gameOver)$('game-feedback').textContent=copy.outOfAttempts+' '+copy.revealPrefix+(target[0]==='f1'?copy.fuse:target[0]==='c1'?copy.bulk:copy.mov)+'.';
      else if(gameRevealed)$('game-feedback').textContent=copy.revealPrefix+(target[0]==='f1'?copy.fuse:target[0]==='c1'?copy.bulk:copy.mov)+'.';
    }
  }
  function spendGameAttempt(reason){
    gameTries=Math.max(0,gameTries-1);
    if(gameTries===0){gameOver=true;gameRevealed=true;gameStatus='outOfAttempts';var X=window.__bx;if(X)X.st.rev=true}
    else gameStatus=reason;
    updateGameLanguage();
  }
  game.querySelectorAll('[data-game-part]').forEach(function(button){
    button.addEventListener('click',function(){
      choice=this.dataset.gamePart;
      game.querySelectorAll('[data-game-part]').forEach(function(b){b.setAttribute('aria-pressed',String(b===button))});
    });
  });
  $('game-start').addEventListener('click',function(){
    var X=window.__bx;if(!X)return;
    var cases=[['f1','open','cont','L','F'],['c1','weak','cap','BP','BN'],['mov','short','ohm','F','N']];
    target=cases[Math.floor(Math.random()*cases.length)];choice=null;
    gameSolved=false;gameRevealed=false;gameOver=false;gameTries=3;gameStatus='hidden';
    X.allOk();X.st.c[target[0]]=target[1];X.st.plug=false;X.st.disch=true;X.st.bulkV=0;X.st.myst=true;X.st.hid=[target[0],target[1]];X.st.rev=false;X.st.won=false;
    game.querySelectorAll('[data-game-part]').forEach(function(b){b.setAttribute('aria-pressed','false')});
    updateGameLanguage();
    var dock=$('bx-dock');if(dock)dock.classList.remove('hide');
  });
  $('game-check').addEventListener('click',function(){
    if(!target){setGameStatus('noRound');return}
    if(gameSolved){setGameStatus('solved');return}
    if(gameOver){setGameStatus('outOfAttempts');return}
    var X=window.__bx,mode=X.st.mode,red=X.st.pr,black=X.st.pb;
    var correctTest=mode===target[2]&&((red===target[3]&&black===target[4])||(red===target[4]&&black===target[3]));
    if(!choice){setGameStatus('noChoice');return}
    if(!correctTest){spendGameAttempt('wrongProbe');return}
    var measured=X.measure(X.analyze());
    var value=(measured.v||'').trim(),faultConfirmed=target[0]==='f1'?/^OL\b/.test(value):target[0]==='c1'?/^\d+(?:\.\d+)?\s*µF$/.test(value)&&parseFloat(value)<200:target[0]==='mov'?parseFloat(value)<10&&!/\bkΩ|\bMΩ/.test(value):false;
    if(!faultConfirmed){spendGameAttempt('badReading');return}
    if(choice===target[0]){
      gameSolved=true;score+=100;X.st.rev=true;X.st.won=true;X.log('गेम निदान सही: '+X.CM[target[0]].s+' · +100 अंक');
      setGameStatus('right');
    }else{
      spendGameAttempt('wrongChoice');return;
    }
    updateGameLanguage();
  });
  $('game-reveal').addEventListener('click',function(){
    if(!target){setGameStatus('noRound');return}
    var X=window.__bx;X.st.rev=true;gameRevealed=true;
    var copy=gameCopy[language];
    $('game-feedback').textContent=copy.revealPrefix+(target[0]==='f1'?copy.fuse:target[0]==='c1'?copy.bulk:copy.mov)+'.';
  });
  updateGameLanguage();
  }

  var alert=document.createElement('div');alert.className='high-voltage-alert';alert.id='high-voltage-alert';alert.setAttribute('role','alert');alert.setAttribute('aria-live','assertive');alert.hidden=true;
  alert.textContent='⚠ HIGH VOLTAGE DANGER · सिम्युलेटर AC 265V से ऊपर है — सुरक्षित दूरी रखें। / Simulator AC is above 265V — keep clear.';
  document.body.appendChild(alert);
  var unsafeTouch=null,dangerWasActive=false;
  function playDangerTone(){if(window.__smpsAudio)window.__smpsAudio.play('danger')}
  function checkVoltage(){
    var values=[];
    ['s-ac','bx-ac','rs-ac','lv-ac'].forEach(function(id){var el=$(id);if(el)values.push(Number(el.value))});
    var X=window.__bx,overVoltage=values.some(function(v){return v>265});
    if(X&&X.st&&unsafeTouch&&!X.st.plug&&X.st.bulkV<=5)unsafeTouch=null;
    var danger=overVoltage||!!unsafeTouch;alert.hidden=!danger;
    if(overVoltage)alert.textContent='⚠ HIGH VOLTAGE DANGER · AC 265V से ऊपर है — सुरक्षित दूरी रखें। / AC is above 265V — keep clear.';
    else if(unsafeTouch)alert.textContent='⚠ बिना डिस्चार्ज हाई-वोल्टेज नोड छुआ: '+unsafeTouch.node+' ('+Math.round(unsafeTouch.voltage)+'V)। पहले प्लग निकालें और 0V जाँचें। / HV node touched before discharge: unplug and verify 0V.';
    if(danger&&!dangerWasActive)playDangerTone();dangerWasActive=danger;
  }
  window.addEventListener('smps:unsafe-hv-touch',function(event){unsafeTouch=event.detail||{node:'HV',voltage:300};checkVoltage()});
  ['s-ac','bx-ac','rs-ac','lv-ac'].forEach(function(id){var el=$(id);if(el)el.addEventListener('input',checkVoltage)});
  window.setInterval(checkVoltage,400);


  checkVoltage();
})();
