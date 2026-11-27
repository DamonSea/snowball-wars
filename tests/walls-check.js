(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const st=n=>{for(let i=0;i<n;i++){runHz.forEach(h=>h.g.position.set(0,.75,60));SB.stun=0;__step(1)}};
for(const[mi,ch]of[[0,3],[2,2],[0,5]]){menu();pickMode='run';pickLevel=mi;ci=ch;showChar();confirmChar();st(5);
  const p=plats.find(q=>q.k==='b'&&q.top>2.5&&q.w>2&&q.d>2&&!q.ramp&&!q.bot&&Math.hypot(q.x+q.w/2+2,q.z)<26&&!plats.some(o=>o!==q&&o.top>.3&&!(o.k==='c'&&o.r>20)&&inside(o,q.x+q.w/2+1,q.z,.6)));const M=T.wallMargin;
  let worst=99;for(const gap of[M-.05,M*.6,.1,0]){__place(p.x+p.w/2+gap,p.z,0,Math.PI/2);st(2);const x0=P.position.x;__k({KeyD:true});st(30);__k({});worst=Math.min(worst,P.position.x-x0)}
  ok(RUNMAPS[mi].name+' / '+chars[ch].name+': from inside a wall’s buffer you can always walk away (worst '+worst.toFixed(2)+')',worst>1.5);
  __place(p.x+p.w/2+1,p.z,0,-Math.PI/2);st(2);__k({KeyA:true});st(40);__k({});ok('  and walking into the wall still stops at the buffer ('+(P.position.x-(p.x+p.w/2)).toFixed(2)+')',Math.abs(P.position.x-(p.x+p.w/2)-M)<.06)}
menu();return out.join('\n')})()
