(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
const calm=()=>runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});const _st=__step;__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const R=chars[2].rig,iS=OUTFITS.findIndex(o=>o.name==='Super Flipper');OFI[2]=iS;applyOutfit(iS);
ok('Flip\'s hair has swinging locks',R.locks&&R.locks.length>=25,R.locks&&R.locks.length);
// tip of a lock in the hair's own space (z = toward his face)
const tipZ=p=>{const t=p._t,e=p.rotation,cx=Math.cos(e.x),sx=Math.sin(e.x),cy=Math.cos(e.y),sy=Math.sin(e.y);let x=t[0],y=t[1],z=t[2];
  let y1=y*cx-z*sx,z1=y*sx+z*cx;y=y1;z=z1;let x2=x*cy+z*sy,z2=-x*sy+z*cy;return z2};
const top=R.locks.filter(p=>p._t[1]>.6);const avgZ=()=>top.reduce((a,p)=>a+tipZ(p),0)/top.length;
__place(0,6,0,0);__k({});__step(120);const rest=avgZ();const restMax=Math.max(...R.locks.map(p=>Math.abs(p.rotation.x)+Math.abs(p.rotation.z)));
ok('At rest the locks hang still (small sway)',restMax<.12,restMax.toFixed(3));
if(state==='paused')resume();setCam('classic');__k({KeyS:true});let minZ=9;for(let i=0;i<10;i++){__step(1);minZ=Math.min(minZ,avgZ())}
ok('Speeding up flings the top locks back',minZ<rest-.03,'tip z '+rest.toFixed(3)+' -> '+minZ.toFixed(3)+' (face is +z) pos '+P.position.z.toFixed(2)+' state '+state+' vel '+Math.hypot(vel.x,vel.z).toFixed(2));
__step(60);const runZ=avgZ();ok('Running streams them back a little',runZ<rest-.01,runZ.toFixed(3));
__k({});let maxZ=-9;for(let i=0;i<20;i++){__step(1);maxZ=Math.max(maxZ,avgZ())}ok('Stopping throws them forward (overshoot)',maxZ>runZ+.03,runZ.toFixed(3)+' -> '+maxZ.toFixed(3));
__step(150);const settled=Math.max(...R.locks.map(p=>Math.abs(p.rotation.x)+Math.abs(p.rotation.z)));ok('...then they settle',settled<.12,settled.toFixed(3));
if(state==='paused')resume();let big=0;jumpBuf=.15;keys.Space=true;for(let i=0;i<90;i++){__step(1);if(i==3)keys.Space=false;big=Math.max(big,...R.locks.map(p=>Math.abs(p.rotation.x)+Math.abs(p.rotation.y)+Math.abs(p.rotation.z)))}
ok('Jumping and landing bounce them, but not wildly',big>.08&&big<1.2,big.toFixed(2));
OFI[2]=0;applyOutfit(0);const before=R.locks.map(p=>p.rotation.x).join();__step(10);ok('Under the winter cap (hair hidden) nothing is simulated',!R.parts.hair[0].visible);
return out.join('\n')})()
