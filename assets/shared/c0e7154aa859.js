
(function(){
'use strict';
document.querySelectorAll('#component-guide-cards .guide-card').forEach(card=>{
  const heading=card.querySelector('h3');
  if(!heading)return;
  const details=document.createElement('details');
  details.className=card.className;
  details.dataset.search=card.dataset.search||'';
  const summary=document.createElement('summary');
  summary.appendChild(heading);
  details.appendChild(summary);
  while(card.firstChild)details.appendChild(card.firstChild);
  card.replaceWith(details);
});
const search=document.getElementById('component-guide-search');
const guideCards=Array.from(document.querySelectorAll('#component-guide-cards .guide-card'));
const realPartCards=Array.from(document.querySelectorAll('#gal .part'));
const guideCount=document.getElementById('component-guide-count');
function filterGuide(){
  const query=search.value.trim().toLocaleLowerCase();
  let shown=0,partsShown=0;
  guideCards.forEach(card=>{
    const match=!query||(card.dataset.search+' '+card.textContent).toLocaleLowerCase().includes(query);
    card.hidden=!match;
    if(match)shown++;
  });
  realPartCards.forEach(card=>{
    const match=!query||(card.dataset.search+' '+card.textContent).toLocaleLowerCase().includes(query);
    card.hidden=!match;
    if(match)partsShown++;
  });
  guideCount.textContent='टेस्ट गाइड: '+shown+' / '+guideCards.length+' · रियल पार्ट: '+partsShown+' / '+realPartCards.length;
}
if(search&&guideCount)search.addEventListener('input',filterGuide);
if(search&&guideCount)filterGuide();

const unknown=document.getElementById('ohm-unknown');
const fields={V:document.getElementById('ohm-v'),I:document.getElementById('ohm-i'),R:document.getElementById('ohm-r')};
const units={V:document.getElementById('ohm-v-unit'),I:document.getElementById('ohm-i-unit'),R:document.getElementById('ohm-r-unit')};
const answer=document.getElementById('ohm-answer');
const power=document.getElementById('ohm-power');
const formula=document.getElementById('ohm-formula');
const note=document.getElementById('ohm-note');
function formatValue(value,kind){
  if(!Number.isFinite(value))return '—';
  if(kind==='V')return Math.abs(value)>=1000?(value/1000).toPrecision(4)+' kV':Math.abs(value)<1?(value*1000).toPrecision(4)+' mV':value.toPrecision(4)+' V';
  if(kind==='I')return Math.abs(value)>=1?value.toPrecision(4)+' A':Math.abs(value)>=0.001?(value*1000).toPrecision(4)+' mA':(value*1e6).toPrecision(4)+' µA';
  if(kind==='R')return Math.abs(value)>=1e6?(value/1e6).toPrecision(4)+' MΩ':Math.abs(value)>=1000?(value/1000).toPrecision(4)+' kΩ':value.toPrecision(4)+' Ω';
  return value.toPrecision(4)+' W';
}
function calculateOhmsLaw(){
  const target=unknown.value;
  Object.keys(fields).forEach(key=>{
    const disabled=key===target;
    fields[key].disabled=disabled;
    units[key].disabled=disabled;
    fields[key].closest('.ohm-field').setAttribute('aria-disabled',String(disabled));
  });
  const base={};
  for(const key of ['V','I','R']){
    if(key===target)continue;
    const raw=fields[key].value.trim();
    const value=Number(raw)*Number(units[key].value);
    if(raw===''||!Number.isFinite(value)||value<0){
      answer.textContent='—';power.textContent='—';formula.textContent='—';
      note.textContent='कृपया बाकी दोनों मानों में शून्य या उससे बड़ा वैध अंक भरें।';
      return;
    }
    base[key]=value;
  }
  let result,expression;
  if(target==='I'){
    result=base.R===0?NaN:base.V/base.R;
    expression='I = V ÷ R';
  }else if(target==='V'){
    result=base.I*base.R;
    expression='V = I × R';
  }else{
    result=base.I===0?NaN:base.V/base.I;
    expression='R = V ÷ I';
  }
  if(!Number.isFinite(result)||result<0){
    answer.textContent='—';power.textContent='—';formula.textContent=expression;
    note.textContent='इस गणना के लिए भाजक शून्य नहीं हो सकता; मान जाँचें।';
    return;
  }
  const all={V:base.V,I:base.I,R:base.R};
  all[target]=result;
  const watts=all.V*all.I;
  answer.textContent=target+' = '+formatValue(result,target);
  power.textContent=formatValue(watts,'P');
  formula.textContent=expression;
  note.textContent='जाँचें: P = V × I = '+formatValue(watts,'P')+'. रेसिस्टर चुनते समय वास्तविक शक्ति से पर्याप्त अधिक watt rating रखें।';
}
if(unknown)unknown.addEventListener('change',calculateOhmsLaw);
Object.keys(fields).forEach(key=>{if(!fields[key]||!units[key])return;fields[key].addEventListener('input',calculateOhmsLaw);units[key].addEventListener('change',calculateOhmsLaw);});
if(unknown)calculateOhmsLaw();

function makeExclusive(details,selector){
  details.addEventListener('toggle',()=>{
    if(!details.open)return;
    const parent=details.parentElement;
    if(!parent)return;
    parent.querySelectorAll(':scope > '+selector).forEach(other=>{
      if(other!==details)other.open=false;
    });
  });
}
document.querySelectorAll('#component-testing .guide-card').forEach(card=>makeExclusive(card,'details.guide-card'));
document.querySelectorAll('.component-card').forEach(card=>makeExclusive(card,'details.component-card'));

const supply=document.getElementById('ohm-supply');
const resistor=document.getElementById('ohm-resistor');
const supplyValue=document.getElementById('ohm-supply-value');
const resistorValue=document.getElementById('ohm-resistor-value');
const powerSwitch=document.getElementById('ohm-power-switch');
const circuitSwitch=document.getElementById('ohm-circuit-switch');
const circuitWire=document.getElementById('ohm-wire-left');
const bulb=document.getElementById('ohm-bulb');
const screenLabel=document.getElementById('ohm-sim-meter-label');
const screenValue=document.getElementById('ohm-sim-meter-value');
const screenHelp=document.getElementById('ohm-sim-meter-help');
const simState=document.getElementById('ohm-sim-state');
const circuitSwitchLabel=document.getElementById('ohm-circuit-switch-label');
const switchLever=document.getElementById('ohm-switch-lever');
const currentLabel=document.getElementById('ohm-circuit-current-label');
const voltageLabel=document.getElementById('ohm-circuit-voltage-label');
const circuitResistorLabel=document.getElementById('ohm-circuit-res-label');
let supplyOn=true,circuitClosed=true,meterMode='voltage';
const formatCurrent=value=>Math.abs(value)>=1?value.toFixed(3)+' A':(value*1000).toFixed(1)+' mA';
function renderOhmCircuit(){
 if(!document.getElementById('ohm-supply'))return;
  const volts=Number(supply.value),ohms=Number(resistor.value);
  const energized=supplyOn&&circuitClosed&&volts>0;
  const amps=energized?volts/ohms:0;
  const resistorVolts=energized?volts:0;
  supplyValue.textContent=volts.toFixed(1)+' V';
  resistorValue.textContent=ohms+' Ω';
  circuitResistorLabel.textContent='R = '+ohms+' Ω';
  currentLabel.textContent='I = '+formatCurrent(amps);
  voltageLabel.textContent='V = '+resistorVolts.toFixed(1)+' V';
  document.querySelector('#ohm-circuit-title').textContent='ओम लॉ सर्किट: '+volts.toFixed(1)+' V DC और '+ohms+' Ω रेसिस्टर';
  powerSwitch.setAttribute('aria-pressed',String(supplyOn));
  powerSwitch.textContent=supplyOn?'⏻ सप्लाई चालू':'⏻ सप्लाई बंद';
  circuitSwitch.setAttribute('aria-pressed',String(circuitClosed));
  circuitSwitch.textContent=circuitClosed?'स्विच बंद (सर्किट पूरा)':'स्विच खुला (सर्किट टूटा)';
  circuitSwitchLabel.textContent=circuitClosed?'स्विच बंद':'स्विच खुला';
  switchLever.setAttribute('d',circuitClosed?'M620 235L650 235':'M620 235L644 215');
  circuitWire.classList.toggle('live-wire',energized);
  bulb.classList.toggle('on',energized&&amps>0);
  document.querySelectorAll('[data-ohm-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ohmMode===meterMode)));
  if(meterMode==='resistance'){
    screenLabel.textContent='Ω · रेसिस्टर के आर-पार';
    if(supplyOn){
      screenValue.textContent='LIVE';
      screenHelp.textContent='रेसिस्टेंस मापने से पहले सप्लाई OFF करें। energized circuit पर Ω न मापें।';
      simState.textContent='सुरक्षा रोक: Ω माप के लिए पहले सप्लाई बंद करें।';
      simState.className='ohm-sim-state bad';
    }else{
      screenValue.textContent=circuitClosed?ohms+' Ω':'OL';
      screenHelp.textContent=circuitClosed?'सप्लाई बंद है · रेसिस्टर का simulated Ω माप।':'सप्लाई बंद है · खुला स्विच रेसिस्टर पथ तोड़ता है, इसलिए OL।';
      simState.textContent='सप्लाई बंद · Ω मोड सुरक्षित · '+(circuitClosed?'रेसिस्टर की continuity है।':'सर्किट खुला है।');
      simState.className='ohm-sim-state good';
    }
  }else if(meterMode==='current'){
    screenLabel.textContent='A⎓ · सीरीज़ करंट';
    screenValue.textContent=formatCurrent(amps);
    screenHelp.textContent=energized?'एममीटर सर्किट के साथ सीरीज़ में है।':'सर्किट में करंट नहीं बह रहा।';
    simState.textContent=energized?'I = V ÷ R = '+volts.toFixed(1)+' ÷ '+ohms+' = '+formatCurrent(amps):'करंट 0 A · सप्लाई या सीरीज़ स्विच बंद है।';
    simState.className='ohm-sim-state'+(energized?' good':'');
  }else{
    screenLabel.textContent='V⎓ · रेसिस्टर के आर-पार';
    screenValue.textContent=resistorVolts.toFixed(2)+' V';
    screenHelp.textContent=energized?'वोल्टमीटर रेसिस्टर के समानांतर मापा गया।':'रेसिस्टर पर मापा वोल्टेज 0 V है।';
    simState.textContent=energized?'सर्किट चालू · I = V ÷ R · P = V × I':'सर्किट में सप्लाई/स्विच बंद है; रीडिंग 0 है।';
    simState.className='ohm-sim-state'+(energized?' good':'');
  }
}
if(supply)supply.addEventListener('input',renderOhmCircuit);
if(resistor)resistor.addEventListener('input',renderOhmCircuit);
if(powerSwitch)powerSwitch.addEventListener('click',()=>{supplyOn=!supplyOn;renderOhmCircuit()});
if(circuitSwitch)circuitSwitch.addEventListener('click',()=>{circuitClosed=!circuitClosed;renderOhmCircuit()});
document.querySelectorAll('[data-ohm-mode]').forEach(button=>button.addEventListener('click',()=>{meterMode=button.dataset.ohmMode;renderOhmCircuit()}));
if(supply)renderOhmCircuit();
})();
