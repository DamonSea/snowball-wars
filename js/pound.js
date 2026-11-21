// Ground pound (every character): in the air, press the Ground pound button (L1 / Q / right-click by default).
// A quick tuck spin hangs you in the air, then you drop straight down. The landing sends out a shockwave that
// smashes spikeballs and enemies, knocks over snowmen and stuns the computer player nearby.
// GP.st: 0 off, 1 spin (hanging), 2 dropping, 3 landing recovery.
const GP={st:0,t:0,rings:[]};
function groundPound(){
  if(state!=='play'||GP.st||grounded||CL.on||SB.stun>0||A.knock>0)return;
  const g=groundAt(P.position.x,P.position.z,py).h;if(isFinite(g)&&py-g<T.pound.minHeight)return;
  GP.st=1;GP.t=T.pound.spin;ATK.t=0;vel.set(0,0,0);A.spd=0;A.mode='pound';A.flipT=99;A.canCut=false;A.canDive=false;SFX.poundSpin()}
// called at the top of move(); returns true while the pound owns movement
function poundMove(dt){
  if(!GP.st)return false;
  if(GP.st===1){vy=T.gravity*dt;if((GP.t-=dt)<=0)GP.st=2}            // cancels gravity: hang in place
  else if(GP.st===2){if(grounded)poundLand();else{vy=-T.pound.fall+T.gravity*dt;if(Math.random()<.7)trail(0xffffff)}}
  else{ // landing recovery: press Jump right away for a Pound Jump (high, straight up)
    if(jumpBuf>0){GP.st=0;jumpBuf=0;vy=T.pound.jumpVy+T.gravity*dt;grounded=false;stand=null;
      if(chars[ci].acro){A.mode='jump';A.jumpN=2;A.twirlT=0;A.canCut=false;A.canDive=true;A.spd=0}
      SFX.jump(3);burst(V(P.position.x,py+.1,P.position.z),0xffffff,14);addTrick('Pound Jump');vel.x=vel.z=0;return true}
    if((GP.t-=dt)<=0){GP.st=0;A.mode='normal'}}
  vel.x=vel.z=0;A.spd=0;if(GP.st===1)jumpBuf=0;else jumpBuf=Math.max(0,jumpBuf-dt*.5);return true}
function poundLand(){
  GP.st=3;GP.t=T.pound.recover;const x=P.position.x,z=P.position.z;
  shake=Math.max(shake,.35);hitStop=.05;rumble(220,1,.6);SFX.pound();puff(10);burst(V(x,py+.2,z),0xffffff,24);shockRing(x,py,z);addTrick('Ground Pound');
  if(mode==='run'){for(const s of snowmen())if(s.up&&Math.hypot(s.x-x,s.z-z)<T.pound.radius)knockSnowman(s);
    if(CPU.on&&Math.hypot(CPU.x-x,CPU.z-z)<T.pound.radius&&Math.abs(CPU.y-py)<1.5)cpuKnock(CPU.x-x,CPU.z-z,false)}
}
// spikeballs and Adventure enemies count as hit (see attackHits in combat.js) while you drop onto them and
// for a moment after landing, inside the shockwave
function poundHits(pos,yb){const d=Math.hypot(pos.x-P.position.x,pos.z-P.position.z);
  if(GP.st===2)return d<1.3&&yb<=py+.3&&yb>py-2.6;
  if(GP.st===3&&GP.t>T.pound.recover-.12)return d<T.pound.radius&&Math.abs(yb-py)<1.6;
  return false}
function shockRing(x,y,z){const m=new THREE.Mesh(new THREE.RingGeometry(.6,.95,40),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false}));
  m.rotation.x=-PI/2;m.position.set(x,y+.08,z);scene.add(m);GP.rings.push({m,t:0})}
function poundFx(dt){for(let i=GP.rings.length-1;i>=0;i--){const r=GP.rings[i];r.t+=dt;const k=r.t/.45;
  r.m.scale.setScalar(1+k*T.pound.radius*1.1);r.m.material.opacity=.85*(1-k);if(k>=1){freeTree(r.m);GP.rings.splice(i,1)}}}
function resetPound(){GP.st=0;GP.t=0;SA.t=0;if(typeof LH!=='undefined')LH.on=false;if(YS.spray){YS.spray=false;loopNoise('yellow',false)}YS.t=0;if(A.mode==='pound')A.mode='normal'}
