(()=>{const out=[];const _st=__step;__step=n=>{for(let i=0;i<n;i++){runHz.forEach(h=>{h.g.position.set(0,.75,40);h.vx=h.vz=0});SB.stun=0;_st(1)}};const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);
ok('Vex still built (benched from the roster for now)',chars[4].name==='Vex'&&chars[4].acro&&!ORDER.includes(4));
ok('5 Vex outfits, gold locked',OUTFITS_VEX.length===5&&!!OUTFITS_VEX[4].lock);
ci=4;resume&&0;__place(0,10,0,Math.PI);const H=VX;ok('Vex rig visible',H.root.visible!==false&&chars[4].g.visible);
// run forward, then stop hard: tails get flung, mohawk springs
__k({KeyW:true});__step(40);const t0=H.tails[0][0].rotation.x;__k({});let maxT=0;for(let i=0;i<30;i++){__step(1);maxT=Math.max(maxT,Math.abs(H.tails[0][0]._sv.x))}
ok('tails stream back when running (rx '+t0.toFixed(2)+')',t0>.6);ok('stopping whips the tails (spring vel '+maxT.toFixed(1)+')',maxT>1);
// jump and land: mohawk flops forward then settles
__place(0,10,0,Math.PI);jumpBuf=.15;keys.Space=true;__step(3);keys.Space=false;__until(()=>grounded,200);let mx=-9;const b0=H.hawk[2]._b;for(let i=0;i<20;i++){__step(1);mx=Math.max(mx,H.hawk[2].rotation.x-b0)}
__step(120);ok('landing flops the mohawk ('+mx.toFixed(2)+') and it settles ('+(H.hawk[2].rotation.x-b0).toFixed(3)+')',mx>.15&&Math.abs(H.hawk[2].rotation.x-b0)<.05);
// idle: crossed arms + gum bubble then pop
__place(0,10,0,Math.PI);__k({});idleT=0;H.gT=0;let crossed=false,bub=0,popped=false;for(let i=0;i<420;i++){vel.set(0,0,0);__step(1);if(H.armL.rotation.z>.5&&H.armL.rotation.x<-1)crossed=true;if(H.gum.visible)bub=Math.max(bub,H.gum.scale.x);if(bub>.5&&!H.gum.visible)popped=true}
ok('idle: arms crossed',crossed);ok('idle: blows a bubble (scale '+bub.toFixed(2)+') that pops',bub>.5&&popped);
__k({KeyW:true});__step(5);ok('moving uncrosses the arms',H.gum.visible===false);__k({});
// Exaggerated squash & stretch
setToon(false);__place(0,10,0,Math.PI);__step(30);ok('normal mode: ordinary scale',Math.abs(H.root.scale.y-1)<.05);
setToon(true);ok('setting saved',localStorage.getItem('orbRunSquash')==='1');
__place(0,10,0,Math.PI);jumpBuf=.15;keys.Space=true;let up=0;for(let i=0;i<12;i++){__step(1);up=Math.max(up,H.root.scale.y)}keys.Space=false;
__until(()=>grounded,200);let lo=9;for(let i=0;i<10;i++){__step(1);lo=Math.min(lo,H.root.scale.y)}
ok('jump stretches tall ('+up.toFixed(2)+')',up>1.25);ok('landing squashes flat ('+lo.toFixed(2)+')',lo<.75);
let wob=0,prev=H.root.scale.y,dir=0;for(let i=0;i<40;i++){__step(1);const d=Math.sign(H.root.scale.y-prev);if(d&&d!==dir){wob++;dir=d}prev=H.root.scale.y}ok('springs back with a wobble ('+wob+' direction changes)',wob>=3);
__place(0,10,0,Math.PI);__step(10);attackPress();let fz=0;for(let i=0;i<15;i++){__step(1);fz=Math.max(fz,H.root.scale.z)}ok('punch stretches forward ('+fz.toFixed(2)+')',fz>1.25);
__step(40);__place(0,10,0,Math.PI);jumpBuf=.15;keys.Space=true;__step(2);__step(22);keys.Space=false;groundPound();out.push('     (pound state '+GP.st+', height '+py.toFixed(2)+')');let sp=9,dn=0,imp=9;for(let i=0;i<80;i++){__step(1);if(GP.st===1)sp=Math.min(sp,H.root.scale.y);if(GP.st===2)dn=Math.max(dn,H.root.scale.y);if(GP.st===3)imp=Math.min(imp,H.root.scale.y)}
ok('ground pound: balls up ('+sp.toFixed(2)+'), stretches down ('+dn.toFixed(2)+'), splats ('+imp.toFixed(2)+')',sp<.9&&dn>1.25&&imp<.75);
// Sunny gets it too
ci=0;__place(0,10,0,Math.PI);__step(60);jumpBuf=.15;keys.Space=true;let su=0;for(let i=0;i<12;i++){__step(1);su=Math.max(su,body.scale.y)}keys.Space=false;ok('Sunny stretches too ('+su.toFixed(2)+')',su>1.2);
setToon(false);__until(()=>grounded,200);__step(60);ok('turning it off restores scale',Math.abs(body.scale.y-1)<.05);
ok('settings slider',LOOK.squash&&LOOK.squash.slider);
const a=makeAv(4);ok('multiplayer avatar for Vex',!!a.rig.tails&&a.rig.hawk.length===6);
ci=4;__step=_st;return out.join('\n')})()
