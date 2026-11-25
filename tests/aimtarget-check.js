(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x?' -> '+x:''));
const calm=()=>runHz.forEach(h=>{if(!h.keep){h.g.position.set(0,.75,60);h.vx=h.vz=0}});const _st=__step;__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const vis=()=>aimDots.filter(m=>m.visible);
const aimAt=(fx,fz,tx,tz,frames=6)=>{__place(fx,fz,0,Math.atan2(tx-fx,tz-fz));SB.ammo=6;SB.cool=0;SB.stun=0;__step(2);face=Math.atan2(tx-fx,tz-fz);keys.KeyF=true;press('throw');__step(frames)};
const letGo=()=>{keys.KeyF=false;__step(1)};
const cancel=()=>{aimEnd(false);keys.KeyF=false;__step(30)};
// where an unobstructed throw from (fx,fz) toward (tx,tz) comes down: put targets a little short of that
const landAt=(fx,fz,tx,tz)=>{aimAt(fx,fz,tx,tz,3);const h=SB.aim.hit;cancel();const L=Math.hypot(tx-fx,tz-fz),d=Math.hypot(h.x-fx,h.z-fz)-2;return{x:fx+(tx-fx)/L*d,z:fz+(tx-fx===0&&tz-fz===0?0:(tz-fz)/L*d)}};
// open ground: blue, ring on the ground
aimAt(0,10,0,30);ok('Open ground: blue arc, ring flat on the ground',SB.aim.hit&&SB.aim.hit.k==='ground'&&(vis()[0]||{}).material===aimM&&Math.abs(aimRing.rotation.x+Math.PI/2)<.01,SB.aim.hit&&SB.aim.hit.k);cancel();
// a tree: stops at the branches, not red
const tr=advCol.find(c=>c.tree&&!c.pole&&Math.hypot(c.x,c.z)<22&&Math.hypot(c.x,c.z)>6);
const ang=Math.atan2(-tr.x,-tr.z),fx=tr.x+Math.sin(ang)*5,fz=tr.z+Math.cos(ang)*5;
aimAt(fx,fz,tr.x,tr.z);const th=SB.aim.hit;
ok('Tree ahead: the arc stops at it',th&&th.k==='wall'&&Math.hypot(th.x-tr.x,th.z-tr.z)<tr.r/.65*1.4+.1&&Math.hypot(th.x-tr.x,th.z-tr.z)>tr.r*.6,th&&(th.k+' '+Math.hypot(th.x-tr.x,th.z-tr.z).toFixed(2)+' from the trunk'));
ok('No dots past the tree',vis().every(m=>Math.hypot(m.position.x-fx,m.position.z-fz)<=Math.hypot(tr.x-fx,tr.z-fz)));
ok('Tree is not a target: arc stays blue',(vis()[0]||{}).material===aimM);
ok('Ring is at the impact point',aimRing.visible&&Math.hypot(aimRing.position.x-th.x,aimRing.position.z-th.z)<.6);
const n0=SB.list.length;letGo();const ball=SB.list[SB.list.length-1];let passed=false;for(let i=0;i<60&&SB.list.includes(ball);i++){__step(1);if(Math.hypot(ball.m.position.x-fx,ball.m.position.z-fz)>Math.hypot(tr.x-fx,tr.z-fz)+1.3)passed=true}
ok('A real snowball stops at the tree too',!passed&&!SB.list.includes(ball));__step(30);
// a snowman: red
const sm=snowmen()[0];sm.up=true;sm.g.visible=true;aimAt(sm.x,sm.z+6,sm.x,sm.z);ok('Snowman 6 m away is under the arc\'s path: the arc is blocked by it',SB.aim.hit&&SB.aim.hit.k==='target');ok('Snowman in sights: the arc turns red, ring at its feet',SB.aim.hit&&SB.aim.hit.k==='target'&&(vis()[0]||{}).material===aimRed&&Math.hypot(aimRing.position.x-sm.x,aimRing.position.z-sm.z)<.1,SB.aim.hit&&SB.aim.hit.k);cancel();
// an enemy / penguin: it walks around on its own, so check the hit test at its body directly
const h=runHz.find(q=>!q.dead);if(h){const q=h.g.position;ok('Enemy/penguin counts as a target ('+h.kind+')',!!aimHits(q.x,q.y+.5,q.z)&&!aimHits(q.x+3,q.y+.5,q.z+3))}
// a friend (multiplayer avatar)
const lf=landAt(6,14,6,0);const fake={g:new THREE.Group()};fake.g.position.set(lf.x,0,lf.z);MP.av.set('friend',fake);aimAt(6,14,6,0);ok('A friend in sights: red',SB.aim.hit&&SB.aim.hit.k==='target'&&(vis()[0]||{}).material===aimRed);cancel();MP.av.delete('friend');
// charged + target: still red, bigger
ok('Friend gone: no longer a target',!aimHits(lf.x,1,lf.z));
// Snowball Wars rival
startWars();__step(220);WAR.bots.forEach(q=>{q.cool=99});const bt=WAR.bots[0];const bx=bt.x,bz=bt.z;
aimAt(bx,bz+5,bx,bz,3);bt.x=bx;bt.z=bz;__step(2);ok('Wars rival in sights: red',SB.aim.hit&&SB.aim.hit.k==='target'&&(vis()[0]||{}).material===aimRed,JSON.stringify({on:SB.aim.on,hit:SB.aim.hit&&SB.aim.hit.k,dots:vis().length,cd:WAR.cd,can:canThrow(),me:[P.position.x,P.position.z].map(v=>v.toFixed(1)),bot:[bt.x,bt.z].map(v=>v.toFixed(1))}));
SB.aim.t=2;__step(2);bt.x=bx;bt.z=bz;__step(1);ok('Charged with a target: still red (target wins), pulsing bigger',SB.aim.full&&(vis()[0]||{}).material===aimRed);cancel();warsStop(false);__step(5);
return out.join('\n')})()
