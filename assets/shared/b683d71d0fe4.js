
(function(){
  'use strict';
  var score=0,completed={},answered={},activeProbe='RED',redNode='12V',blackNode='COM',supplyOn=false,currentMystery=-1,mysterySolved=false;
  var scoreEl=document.getElementById('learning-score');
  if(!scoreEl)return;
  function updateScore(){scoreEl.textContent=String(score);document.getElementById('learning-progress').textContent=Object.keys(completed).length+' / 3 मॉड्यूल पूरे'}
  function setProbeSelection(){
    document.getElementById('select-red').setAttribute('aria-pressed',String(activeProbe==='RED'));
    document.getElementById('select-black').setAttribute('aria-pressed',String(activeProbe==='BLACK'));
    document.querySelectorAll('#probe-points .probe-point').forEach(function(point){
      var node=point.dataset.node,labels=[];
      point.dataset.red=String(redNode===node);point.dataset.black=String(blackNode===node);
      if(redNode===node)labels.push('🔴 RED');if(blackNode===node)labels.push('⚫ BLACK');
      point.querySelector('.probe-marker').textContent=labels.join(' / ');
    });
    document.getElementById('dmm-probes').textContent='RED: '+redNode+' · BLACK: '+blackNode;
  }
  function potential(node,mode){
    if(mode==='ACV')return node==='LINE'?230:0;
    if(node==='COM'||node==='NEUTRAL'||node==='FUSE_IN'||node==='FUSE_OUT'||node==='MOS_S')return 0;
    if(node==='LINE')return supplyOn?230:0;
    if(node==='BULK')return supplyOn?325:0;
    if(node==='MOS_D')return supplyOn?325:0;
    if(node==='5VSB')return supplyOn?5:0;
    if(node==='PS_ON')return supplyOn?0.1:5;
    if(!supplyOn)return 0;
    return {'12V':12,'5V':5,'3V3':3.3}[node]||0;
  }
  function pairKey(a,b){return [a,b].sort().join('|')}
  function reading(){
    var mode=document.getElementById('dmm-mode').value,screen=document.getElementById('dmm-reading'),unit=document.getElementById('dmm-unit'),status=document.getElementById('dmm-status');
    var primary=['BULK','MOS_D'].indexOf(redNode)>=0||['BULK','MOS_D'].indexOf(blackNode)>=0;
    if((mode==='OHM'||mode==='CONT')&&supplyOn){
      screen.textContent='LIVE';unit.textContent=mode==='OHM'?'Ω · measurement locked':'CONT · measurement locked';status.textContent='Resistance/continuity के लिए simulated supply बंद करें।';return;
    }
    if(mode==='DCV'||mode==='ACV'){
      var v=Math.abs(potential(redNode,mode)-potential(blackNode,mode));
      screen.textContent=v.toFixed(3);unit.textContent=mode==='DCV'?'DC V · simulated':'AC V · simulated';
      status.textContent=primary&&supplyOn?'⚠️ simulated primary high voltage · वास्तविक probe न लगाएँ':supplyOn?'सिम्युलेटेड reading · वास्तविक SMPS reading नहीं':'सप्लाई बंद · output rails 0V';
      return;
    }
    var key=pairKey(redNode,blackNode),ohms={'FUSE_IN|FUSE_OUT':0.3,'12V|COM':180,'3V3|COM':90,'5V|COM':120,'5VSB|COM':150};
    var resistance=ohms[key];
    if(mode==='OHM'){
      screen.textContent=resistance===undefined?'OL':resistance.toFixed(1);
      unit.textContent='Ω · simulated, power OFF';status.textContent='मॉडल अनुमान · वास्तविक resistance पार्ट/सर्किट से बदलती है।';return;
    }
    var beeps=typeof resistance==='number'&&resistance<50;
    screen.textContent=beeps?'BEEP':'OL';unit.textContent='CONTINUITY · '+(beeps?'बीप':'कोई बीप नहीं');
    status.textContent='केवल de-energized simulated circuit · वास्तविक बोर्ड पर कैपेसिटर discharge verify करें।';
  }
  document.getElementById('select-red').addEventListener('click',function(){activeProbe='RED';setProbeSelection()});
  document.getElementById('select-black').addEventListener('click',function(){activeProbe='BLACK';setProbeSelection()});
  document.querySelectorAll('#probe-points .probe-point').forEach(function(point){
    point.addEventListener('click',function(){
      if(activeProbe==='RED')redNode=point.dataset.node;else blackNode=point.dataset.node;
      setProbeSelection();reading();
    });
  });
  document.getElementById('dmm-mode').addEventListener('change',reading);
  document.getElementById('dmm-power').addEventListener('click',function(){
    supplyOn=!supplyOn;this.setAttribute('aria-pressed',String(supplyOn));
    this.textContent=supplyOn?'सिम्युलेटेड AC input: चालू':'सिम्युलेटेड AC input: बंद';
    reading();
  });
  document.querySelectorAll('#learning .quiz-question').forEach(function(question){
    var key=question.dataset.quiz;
    question.querySelectorAll('button').forEach(function(button){
      button.addEventListener('click',function(){
        if(answered[key])return;
        var feedback=question.querySelector('.quiz-feedback');
        if(button.dataset.correct==='true'){
          answered[key]=true;score++;feedback.textContent='सही जवाब! +1 अंक';feedback.className='quiz-feedback good';
          question.querySelectorAll('button').forEach(function(option){option.disabled=true});
          updateScore();
        }else{feedback.textContent='फिर सोचें—पाठ पढ़कर दोबारा प्रयास करें।';feedback.className='quiz-feedback bad'}
      });
    });
  });
  document.querySelectorAll('.module-complete').forEach(function(button){
    button.addEventListener('click',function(){
      completed[button.dataset.module]=true;button.textContent='✓ मॉड्यूल पूरा';button.disabled=true;updateScore();
    });
  });
  var challenges=[
    {scenario:'लक्षण: AC input ठीक है और standby मौजूद है, लेकिन मुख्य +12V/+5V rails नहीं आतीं। किस जाँच से शुरू करेंगे?',options:['PS_ON# high/low state, supervisor और protection/hiccup संकेत जाँचें','फ़्यूज़ को तार से bypass करें','बिजली चालू रखकर Ω mode में rail जाँचें'],answer:0,why:'सही: PS_ON# active-low है; पहले control state और protection संकेत देखें। energized primary पर काम न करें।'},
    {scenario:'लक्षण: फ़्यूज़ खुला है और primary MOSFET Drain-Source लगभग short दिखाता है (बिजली हटाकर, cap discharge पुष्टि के बाद)। संभावित अगला कदम?',options:['सिर्फ़ बड़ा amp वाला फ़्यूज़ लगाएँ','MOSFET के साथ bridge/MOV और आसपास के gate/startup parts में root cause जाँचें','फ़्यूज़ bypass करके mains दें'],answer:1,why:'सही: D-S short के कारण की जाँच करें; rated fuse और सुरक्षित series-lamp/current-limited परीक्षण प्रशिक्षक के साथ करें।'},
    {scenario:'लक्षण: +12V rail में ripple अधिक है और output capacitor का ESR ऊँचा है। सबसे उपयुक्त कार्रवाई?',options:['सही low-ESR/ripple-current rated capacitor और आसपास के rectifier/load की जाँच','Feedback optocoupler को short करना','कम voltage rating का capacitor लगाना'],answer:0,why:'सही: capacitor की capacitance, ESR, ripple-current और temperature rating मिलाएँ; कारण/लोड भी जाँचें।'}
  ];
  function nextChallenge(){
    var next=Math.floor(Math.random()*challenges.length);
    if(challenges.length>1&&next===currentMystery)next=(next+1)%challenges.length;
    currentMystery=next;mysterySolved=false;
    var data=challenges[next],scenario=document.getElementById('mystery-scenario'),options=document.getElementById('mystery-options'),feedback=document.getElementById('mystery-feedback');
    scenario.textContent=data.scenario;options.replaceChildren();feedback.textContent='';
    data.options.forEach(function(label,index){
      var button=document.createElement('button');button.type='button';button.className='chip';button.textContent=label;
      button.addEventListener('click',function(){
        if(mysterySolved)return;
        if(index===data.answer){mysterySolved=true;score++;feedback.textContent=data.why+' · +1 अंक';feedback.className='quiz-feedback good';options.querySelectorAll('button').forEach(function(option){option.disabled=true});updateScore()}
        else{feedback.textContent='यह सुरक्षित diagnostic कदम नहीं है। दूसरा विकल्प चुनें।';feedback.className='quiz-feedback bad'}
      });
      options.appendChild(button);
    });
  }
  document.getElementById('mystery-next').addEventListener('click',nextChallenge);
  document.getElementById('learning-reset').addEventListener('click',function(){
    score=0;completed={};answered={};
    document.querySelectorAll('.module-complete').forEach(function(button){button.disabled=false;button.textContent='मॉड्यूल '+button.dataset.module.slice(1)+' पूरा करें'});
    document.querySelectorAll('#learning .quiz-question').forEach(function(question){
      question.querySelectorAll('button').forEach(function(button){button.disabled=false});
      var feedback=question.querySelector('.quiz-feedback');feedback.textContent='';feedback.className='quiz-feedback';
    });
    updateScore();nextChallenge();
  });
  var pw=document.getElementById('print-worksheet');if(pw)pw.addEventListener('click',function(){
    document.body.classList.add('print-worksheet');
    window.addEventListener('afterprint',function(){document.body.classList.remove('print-worksheet')},{once:true});
    window.print();
    window.setTimeout(function(){document.body.classList.remove('print-worksheet')},1500);
  });
  setProbeSelection();reading();updateScore();nextChallenge();
})();
