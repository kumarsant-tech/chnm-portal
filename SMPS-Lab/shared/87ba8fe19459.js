
(function(){
'use strict';
const X=window.__bx;if(!X)return;
const {st,COMPS}=X;
/* ================= नेटलिस्ट (बिजली बंद वाली जाँच के लिए) ================= */
function netlist(){
  const s=st.c,E=[];
  const R=(a,b,r)=>E.push({t:'r',a,b,r}),D=(a,b,vf)=>E.push({t:'d',a,b,vf}),C=(a,b,c)=>E.push({t:'c',a,b,c});
  const res=(id,a,b,r,wk)=>{const x=s[id];R(a,b,x==='short'?.02:x==='open'?1e12:x==='weak'?(wk||r*20):r)};
  const dio=(id,a,b,vf)=>{const x=s[id];if(x==='short')R(a,b,.05);else if(x==='open'){}else{D(a,b,vf);if(x==='weak')R(a,b,2000)}};
  const cap=(id,a,b,c,wc)=>{const x=s[id];if(x==='short')R(a,b,.1);else if(x==='open')C(a,b,.0005);else C(a,b,x==='weak'?wc:c)};
  const wnd=(id,a,b,r)=>{const x=s[id];R(a,b,x==='short'?.01:x==='open'?1e12:x==='weak'?r*.85:r)};
  if(st.testDevice==='bjt-npn'){D('TB','TE',.65);D('TB','TC',.65)}
  else if(st.testDevice==='bjt-pnp'){D('TE','TB',.65);D('TC','TB',.65)}
  res('f1','L','F',.1,.1);if(s.f1==='short')E[E.length-1].r=.01;
  R('F','N',s.mov==='short'?.6:s.mov==='weak'?2e5:1e9);
  if(s.xc==='short')R('F','N',.1);else if(s.xc==='open')C('F','N',.0005);else{C('F','N',.47);if(s.xc==='weak')R('F','N',1e5)}
  res('ntc','F','R',4.7);
  dio('d1','R','BP',.55);dio('d2','N','BP',.55);dio('d3','BN','R',.55);dio('d4','BN','N',.55);
  cap('c1','BP','BN',326,85);
  res('rbl','BP','BN',470e3,2e6);
  res('rst','BP','VCC',100e3,2e6);
  cap('cvcc','VCC','BN',22,6);
  dio('daux','AUX','VCC',.6);R('AUX','BN',.6);
  R('VCC','BN',s.ic1==='short'?1:s.ic1==='open'?1e12:25e3);R('OUT','BN',20e3);
  res('rg','OUT','G',10);res('rgs','G','BN',10e3);res('rcs','CS','BN',.33,1.2);
  /* Q1: बॉडी-डायोड CS→D */
  if(s.q1==='short')R('D','CS',.1);else if(s.q1==='ok'||s.q1==='weak'){D('CS','D',.45);if(s.q1==='weak')R('D','CS',800)}
  wnd('t1p','BP','D',1.4);
  dio('dsn','D','SN',.55);res('rsn','SN','BP',47e3,1e6);
  if(s.csn==='short')R('SN','BP',.1);else if(s.csn==='open')C('SN','BP',.0000005);else C('SN','BP',.0022);
  wnd('t1s12','T2','SG',.05);dio('d12','T2','V12p',.25);
  cap('c2a','V12p','SG',470,120);
  {const x=s.l1;R('V12p','V12',x==='open'?1e12:.02)}
  cap('c2b','V12','SG',1000,250);res('rdum','V12','SG',1e3);
  wnd('t1s5','T5','SG',.04);dio('d5','T5','V5p',.25);
  cap('c5a','V5p','SG',1000,250);{const x=s.l2;R('V5p','V5',x==='open'?1e12:.02)}
  cap('c5b','V5','SG',1000,250);
  {const x=s.q33;R('V5','V33',x==='short'?.01:x==='open'?1e12:.15)}
  cap('c33','V33','SG',470,120);
  dio('dsb','T5','SB',.45);cap('csb','SB','SG',100,25);
  res('rled','V12','OA',1e3,5e3);
  {const x=s.opto;if(x==='short')R('OA','OK',.1);else if(x==='open'){}else D('OA','OK',1.15)}
  {const x=s.tl;if(x==='short')R('SG','OK',.1);else if(x==='ok')D('SG','OK',.6)}
  res('rup','V12','FB',9.5e3);res('rdn','FB','SG',2.5e3);
  R('SB','PSON',10e3);R('PG','SG',10e3);
  return E;
}
/* ================= गॉस सॉल्वर ================= */
function gauss(G,N){
  for(let i=0;i<N;i++){
    let p=i;for(let r=i+1;r<N;r++)if(Math.abs(G[r][i])>Math.abs(G[p][i]))p=r;
    if(p!==i){const t=G[i];G[i]=G[p];G[p]=t}
    const d=G[i][i]||1e-30;
    for(let r=i+1;r<N;r++){const f=G[r][i]/d;if(f)for(let c=i;c<=N;c++)G[r][c]-=f*G[i][c]}
  }
  const x=new Float64Array(N);
  for(let i=N-1;i>=0;i--){let t=G[i][N];for(let c=i+1;c<N;c++)t-=G[i][c]*x[c];x[i]=t/(G[i][i]||1e-30)}
  return x;
}
function probeSolve(E,a,b,Vm,Rm){
  const idx={};let n=0;const id=k=>idx[k]!==undefined?idx[k]:(idx[k]=n++);
  E.forEach(e=>{id(e.a);id(e.b)});id(a);id(b);
  const N=n,dio=E.filter(e=>e.t==='d');dio.forEach(d=>d.on=false);let sol=null;
  for(let it=0;it<50;it++){
    const G=Array.from({length:N},()=>new Float64Array(N+1));
    const stp=(p,q,g)=>{G[p][p]+=g;G[q][q]+=g;G[p][q]-=g;G[q][p]-=g};
    for(let i=0;i<N;i++)G[i][i]+=1e-9;
    E.forEach(e=>{const p=idx[e.a],q=idx[e.b];if(e.t==='r')stp(p,q,1/Math.max(e.r,1e-3));else if(e.t==='d'&&e.on){stp(p,q,2);G[p][N]+=2*e.vf;G[q][N]-=2*e.vf}});
    const pa=idx[a],pb=idx[b];stp(pa,pb,1/Rm);G[pa][N]+=Vm/Rm;G[pb][N]-=Vm/Rm;
    sol=gauss(G,N);let ch=false;
    dio.forEach(d=>{const vd=sol[idx[d.a]]-sol[idx[d.b]];if(!d.on&&vd>d.vf+1e-6){d.on=true;ch=true}else if(d.on&&vd<d.vf-1e-6){d.on=false;ch=true}});
    if(!ch)break;
  }
  return sol[idx[a]]-sol[idx[b]];
}
function ohms(E,a,b){
  const Rs=[100,1e3,1e4,1e5,1e6,1e7];let R=Infinity;
  for(const Rm of Rs){const vp=probeSolve(E,a,b,.4,Rm);R=vp>=.4-1e-7?Infinity:Math.max(0,vp*Rm/(.4-vp));if(R<=4*Rm)break}
  return R;
}
function capMeas(E,a,b){
  const par={};const f=x=>{while(par[x]!==undefined&&par[x]!==x)x=par[x];return x};
  const nodes=new Set([a,b]);E.forEach(e=>{nodes.add(e.a);nodes.add(e.b)});nodes.forEach(n=>par[n]=n);
  E.forEach(e=>{if(e.t==='r'&&e.r<=10){const p=f(e.a),q=f(e.b);if(p!==q)par[p]=q}});
  if(f(a)===f(b))return {short:true,c:0};
  const idx={};let n=0;const id=k=>{k=f(k);return idx[k]!==undefined?idx[k]:(idx[k]=n++)};
  nodes.forEach(id);const N=n;
  const G=Array.from({length:N},()=>new Float64Array(N+1));
  for(let i=0;i<N;i++)G[i][i]+=1e-9;
  E.forEach(e=>{if(e.t==='c'){const p=id(e.a),q=id(e.b);if(p!==q){G[p][p]+=e.c;G[q][q]+=e.c;G[p][q]-=e.c;G[q][p]-=e.c}}});
  const pa=id(a),pb=id(b);G[pa][N]+=1;G[pb][N]-=1;
  const x=gauss(G,N),v=x[pa]-x[pb];
  return {short:false,c:v>1e6||v<=0?0:1/v};
}
/* ================= मीटर ================= */
const fV=v=>{const a=Math.abs(v);return(a<1&&a>0?(v).toFixed(3):a>=100?v.toFixed(1):a>=10?v.toFixed(2):v.toFixed(3))+' V'};
const fR=r=>r===Infinity||r>5e7?'OL':r<1?r.toFixed(3)+' Ω':r<1e3?r.toFixed(1)+' Ω':r<1e6?(r/1e3).toFixed(2)+' kΩ':(r/1e6).toFixed(2)+' MΩ';
const fC=c=>c>=1?(c>=100?c.toFixed(0):c.toFixed(1))+' µF':(c*1000>=.05?(c*1000).toFixed(2)+' nF':'0.00 nF');
const OFFLINE=['ohm','dio','cont','cap'];
let cache={k:'',v:null};
function measure(R){
  const m=st.mode,a=st.pr,b=st.pb,o={v:'---',h:'',beep:false,warn:false,off:false};
  if(m==='off'){o.v='';o.off=true;return o}
  if(a===b){o.v={dcv:'0.000 V',acv:'0.000 V',ohm:'0.000 Ω',dio:'0.000 V',cont:'0.0 Ω',cap:'0.00 nF',curr:'0.000 A',freq:'0.0 Hz',duty:'0.0 %'}[m];o.h='दोनों प्रोब एक ही बिंदु पर हैं।';o.beep=m==='cont';return o}
  const da=X.dom(a),db=X.dom(b);
  if(m==='dcv'||m==='acv'){
    if(st.bulkV>5&&!st.plug&&(da==='p'||db==='p'||da==='a'||db==='a'))o.h='बल्क कैप में अभी '+st.bulkV.toFixed(0)+'V बाकी है।';
    if(m==='dcv'){
      if(da==='a'&&db==='a'){o.v='0.000 V';o.h='AC नोड पर DC औसत शून्य होता है। AC वोल्ट मोड लें।';return o}
      if(da==='a'||db==='a'){o.v='अस्थिर';o.h='AC और DC बिंदु मिलाकर DC रीडिंग भरोसेमंद नहीं होती।';return o}
      if(da!==db){o.v='0.000 V';o.h='प्राइमरी और सेकेंडरी आइसोलेटेड हैं: इनके बीच रीडिंग नहीं बनती।';return o}
      let v=R.dc[a]-R.dc[b];if(v)v*=1+Math.sin(performance.now()/700)*.0008;
      o.v=fV(v);if(da==='p'&&Math.abs(v)>50){o.warn=true;o.h='⚡ प्राइमरी का 300V: हाथ न लगाएँ।'}return o}
    if(da==='a'&&db==='a'){const v=Math.abs(R.ac[a]-R.ac[b]);o.v=fV(v);if(v>50){o.warn=true;o.h='⚡ मेन्स वोल्टेज।'}return o}
    if(da==='p'&&db==='p'){
      if(a==='D'||b==='D'||a==='G'||b==='G'||a==='OUT'||b==='OUT'||a==='SN'||b==='SN'){o.v='— —';o.h='तेज़ स्विचिंग: मीटर नहीं पढ़ पाता। नीचे स्कोप में देखें।';return o}
      const bp=(a==='BP'||b==='BP')&&(a==='BN'||b==='BN');o.v=bp?fV(R.vpp/3.46):'0.000 V';o.h=bp?'बल्क का रिपल (RMS)।':'';return o}
    if(da==='s'&&db==='s'){const rp=(a==='V5'||b==='V5'||a==='V33'||b==='V33')?R.rip5:R.rip12;o.v=(R.run&&st.ps?rp/2.83:0).toFixed(1)+' mV';o.h='रिपल का RMS मान।';return o}
    o.v='0.000 V';return o;
  }
  /* एडवांस मोड: करंट और फ़्रीक्वेंसी (प्रोब ज़रूरी नहीं) */
  if(m==='curr'){o.v=(st.run&&st.ps?st.w/12:0).toFixed(3)+' A';o.h=st.run&&st.ps?'लाइव रेल करंट (अनुमान)।':'सप्लाई बंद।';return o}
  if(m==='freq'){o.v=st.run&&st.ps?st.fsw.toFixed(1)+' kHz':'0.0 Hz';o.h=st.run&&st.ps?'स्विचिंग फ़्रीक्वेंसी (MOSFET गेट)।':'सप्लाई बंद।';return o}
  if(m==='duty'){var d=st.run&&st.ps?Math.min(85,20+st.w/8):0;o.v=d.toFixed(1)+' %';o.h=st.run&&st.ps?'PWM ड्यूटी साइकिल (अनुमान)।':'सप्लाई बंद।';return o}
  /* बिजली बंद वाले मोड */
  if(X.OFFLINE.includes(m)&&st.plug){o.v='बिजली चालू';o.warn=true;o.h='Ω, डायोड और कैप मोड में प्लग निकालना ज़रूरी है।';o.need='unplug';return o}
  if(st.bulkV>5&&(da!=='s'||db!=='s')){o.v='डिस्चार्ज…';o.h='बल्क कैप में '+st.bulkV.toFixed(0)+'V बाकी है, 10kΩ से उतर रहा है।';o.warn=true;return o}
  const key=Object.values(st.c).join('')+a+b+m+st.testDevice;
  if(cache.k!==key){
    const E=netlist();let r={};
    if(m==='ohm'||m==='cont'){r.R=ohms(E,a,b)}
    else if(m==='dio'){const vp=probeSolve(E,a,b,3,2000);r.V=vp>2.85?Infinity:vp}
    else if(m==='cap'){r=capMeas(E,a,b)}
    cache={k:key,v:r};
  }
  const r=cache.v;
  if(m==='ohm'){o.v=fR(r.R)}
  else if(m==='cont'){o.beep=r.R<30;o.v=r.R<30?fR(r.R):'OL';o.h=o.beep?'🔔 कंटीन्युटी है।':''}
  else if(m==='dio'){if(r.V===Infinity)o.v='OL';else{o.v=r.V.toFixed(3)+' V';if(r.V<.05){o.beep=true;o.h='🔔 0V के पास: शॉर्ट जैसा।'}}}
  else if(m==='cap'){if(r.short){o.v='0.00 µF';o.h='दोनों प्रोब के बीच तार जैसा रास्ता है (शॉर्ट)।'}else o.v=fC(r.c)}
  return o;
}
X.measure=measure;X.netlist=netlist;X.OFFLINE=OFFLINE;
})();
