// Shared platform physics (Adventure and Trick Park): tree climbing, ice skating, walls, wall contact, landing.
// ---------- shared platform physics (Adventure levels and Trick Park) ----------
// ---------- tree climbing ----------
// Run or jump into a trunk while pushing toward it to grab on. Up/down climbs, left/right circles,
// Jump leaps off, crouch lets go. At the tip you balance in a handstand; Jump from there to flip.
const CL={on:false,tree:null,ang:0,h:0,top:false,touch:0,stepT:0,cool:0};
function rawInput(){let ix=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joy.x+pad.x,iz=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0)+joy.z+pad.z;
  const m=Math.hypot(ix,iz);if(m>1){ix/=m;iz/=m}return[ix,iz]}
const leafCol=()=>WIN?0xffffff:0x3fa65a;
function tryGrab(dt){
  if(CL.on||CL.cool>0||state!=='play'||ATK.t>0||A.knock>0||SB.stun>0||A.mode==='dive'||A.mode==='slide'){CL.touch=0;return}
  const[ix,iz]=rawInput(),im=Math.hypot(ix,iz);if(im<.4){CL.touch=0;return}
  for(const c of advCol){if(!c.tree)continue;const dx=c.x-P.position.x,dz=c.z-P.position.z,d=Math.hypot(dx,dz);
    if(d<c.r+.7&&py>=c.y-.1&&py<c.top-1.3&&(ix*dx+iz*dz)/(d*im)>.6){CL.touch+=dt;
      if(CL.touch>(grounded?T.climb.grabDelay:0)){Object.assign(CL,{on:true,tree:c,ang:Math.atan2(-dx,-dz),h:Math.max(py,c.y)+.15,top:false,touch:0,stepT:0});
        vel.set(0,0,0);vy=0;A.spd=0;A.mode='normal';A.flipT=99;grounded=false;stand=null;SFX.grab();burst(V(P.position.x,py+1.2,P.position.z),leafCol(),8)}
      return}}
  CL.touch=0;
}
function letGo(){CL.on=false;CL.top=false;CL.cool=T.climb.regrabCooldown}
function climbStep(dt){
  const c=CL.tree,R=c.r*.7+.35,[ix,iz]=rawInput();
  invuln=Math.max(0,invuln-dt);jumpBuf=Math.max(0,jumpBuf-dt);vel.set(0,0,0);vy=0;grounded=false;stand=null;wallSliding=false;
  const ck=!!(keys.ShiftLeft||keys.ShiftRight||keys.KeyC||joy.crouch||pad.crouch);
  if(CL.top){
    P.position.set(c.x,0,c.z);py=c.top;if(Math.abs(ix)>.3)face-=ix*2.6*dt;
    if(jumpBuf>0){jumpBuf=0;letGo();const d=inputDir();if(d!==null)face=d;vy=chars[ci].acro?T.climb.topFlipVy:chars[ci].jump*1.15;
      if(chars[ci].acro){A.spd=5;A.mode='flip';startFlip('x',1);A.canDive=true;addTrick('Tree-top Flip');SFX.flip()}else{vel.x=Math.sin(face)*5;vel.z=Math.cos(face)*5;SFX.jump(2)}
      burst(V(c.x,c.top+.3,c.z),leafCol(),10)}
    else if(iz>.5||ck){CL.top=false;CL.h=c.top-1.35}
    return}
  if(ck){letGo();return}
  CL.h=Math.min(c.top-1.2,CL.h-iz*T.climb.speed*dt);CL.ang+=ix*T.climb.circle*dt/R*1.2;
  if(CL.h<=c.y+.02&&iz>.3){letGo();py=c.y;grounded=true;return}
  CL.h=Math.max(c.y,CL.h);
  P.position.x=c.x+Math.sin(CL.ang)*R;P.position.z=c.z+Math.cos(CL.ang)*R;py=CL.h;face=CL.ang+PI;
  if((CL.stepT+=(Math.abs(iz)+Math.abs(ix)*.6)*dt)>.3){CL.stepT=0;SFX.climb();if(Math.random()<.5)burst(V(P.position.x,py+1.4,P.position.z),leafCol(),3)}
  if(CL.h>=c.top-1.2&&iz<-.3){CL.top=true;SFX.tada();addTrick('Handstand');burst(V(c.x,c.top+.4,c.z),leafCol(),14)}
  if(jumpBuf>0){jumpBuf=0;letGo();face=CL.ang;vy=T.climb.leap.vy;vel.x=Math.sin(face)*T.climb.leap.speed;vel.z=Math.cos(face)*T.climb.leap.speed;
    if(chars[ci].acro){A.spd=T.climb.leap.speed;A.mode='jump';A.jumpN=0;A.canDive=true}addTrick('Tree Leap');SFX.jump(1)}
}
let onIce=false;const iceV=new THREE.Vector3();
function stepBody(dt,speed){
  CL.cool=Math.max(0,CL.cool-dt);if(CL.on){onIce=false;climbStep(dt);return true}
  for(const p of plats)if(p.mv){const v=p.mv,s=Math.sin(advT*v.sp+v.ph)*v.amp,nx=v.x0+v.ax*s,nz=v.z0+v.az*s;p.dx=nx-p.x;p.dz=nz-p.z;p.x=nx;p.z=nz;p.m.position.x=nx;p.m.position.z=nz}
  if(stand&&stand.mv){P.position.x+=stand.dx;P.position.z+=stand.dz}
  // horizontal move with step/wall checks
  const ox=P.position.x,oz=P.position.z;move(dt,grounded&&stand&&stand.ice?speed*T.ice.speedBoost:speed);
  let nx=P.position.x,nz=P.position.z;P.position.x=ox;P.position.z=oz;
  // ice: the input only nudges a gliding velocity, so you build speed, drift and coast
  onIce=grounded&&!!(stand&&stand.ice);
  if(onIce){const k=1-Math.exp(-(Math.hypot(vel.x,vel.z)<Math.hypot(iceV.x,iceV.z)?T.ice.coast:T.ice.push)*dt);iceV.x+=(vel.x-iceV.x)*k;iceV.z+=(vel.z-iceV.z)*k;vel.x=iceV.x;vel.z=iceV.z;nx=ox+vel.x*dt;nz=oz+vel.z*dt}
  else iceV.set(vel.x,0,vel.z);
  const ac=chars[ci].acro&&!grounded;
  const bX=blocked(nx,oz,py);if(!bX)P.position.x=nx;else{if(ac&&Math.abs(nx-ox)>1e-4){A.wnx=-Math.sign(nx-ox);A.wnz=0;A.wallT=T.flip.wallJump.contact}vel.x=0}
  const bZ=blocked(P.position.x,nz,py);if(!bZ)P.position.z=nz;else{if(ac&&Math.abs(nz-oz)>1e-4){A.wnz=-Math.sign(nz-oz);A.wnx=0;A.wallT=T.flip.wallJump.contact}vel.z=0}
  if(onIce){if(bX){if(Math.abs(iceV.x)>T.ice.bounceSound)SFX.board(Math.abs(iceV.x));iceV.x*=-T.ice.bounce}if(bZ){if(Math.abs(iceV.z)>T.ice.bounceSound)SFX.board(Math.abs(iceV.z));iceV.z*=-T.ice.bounce}}
  if(chars[ci].acro&&!A.knock&&A.mode!=='flip')A.spd=vel.x*Math.sin(face)+vel.z*Math.cos(face);
  pushOut(P.position,T.bodyRadius,advCol);tryGrab(dt);if(CL.on)return true;
  // vertical
  const prev=py;vy-=T.gravity*dt;
  wallSliding=false;
  if(chars[ci].acro&&A.wallT>0&&!grounded&&vy<T.flip.wallJump.slideFall&&A.mode!=='dive'){vy=T.flip.wallJump.slideFall;wallSliding=true;if(Math.random()<.3)puff()}
  py+=vy*dt;
  const g=groundAt(P.position.x,P.position.z,prev);
  if(py<=g.h){py=g.h;vy=0;grounded=true;stand=g.on}else{grounded=false;stand=null}
  return py>=T.fallDeath;
}
