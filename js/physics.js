// Shared platform physics (Trick Park): tree climbing, ice skating, walls, wall contact, landing.
// ---------- shared platform physics (Trick Park maps) ----------
// ---------- tree climbing ----------
// Run or jump into a trunk while pushing toward it to grab on. Up/down climbs, left/right circles,
// Jump leaps off, crouch lets go. At the tip you balance in a handstand; Jump from there to flip.
const CL={on:false,tree:null,ang:0,h:0,top:false,touch:0,stepT:0,cool:0};
function rawInput(){let ix=kbAxisX()+joy.x+pad.x,iz=kbAxisZ()+joy.z+pad.z;
  const m=Math.hypot(ix,iz);if(m>1){ix/=m;iz/=m}return[ix,iz]}
const leafCol=()=>CL.tree&&CL.tree.pole?0xffe2a8:WIN?0xffffff:0x3fa65a;
const climbName=n=>CL.tree&&CL.tree.pole?n.replace('Tree','Pole'):n;
function tryGrab(dt){
  if(CL.on||CL.cool>0||state!=='play'||ATK.t>0||A.knock>0||SB.stun>0||GP.st||YS.t>0||YS.spray||SA.t>0){CL.touch=0;return}
  // diving (or belly-sliding) into a tree or pole grabs it straight away, aimed the way you're flying
  const diving=chars[ci].acro&&(A.mode==='dive'||A.mode==='slide'),dsp=Math.hypot(vel.x,vel.z);
  const[ix,iz]=diving&&dsp>1?[vel.x/dsp,vel.z/dsp]:rawInput(),im=Math.hypot(ix,iz);if(im<.4||(diving&&dsp<=1)){CL.touch=0;return}
  for(const c of advCol){if(!c.tree)continue;const dx=c.x-P.position.x,dz=c.z-P.position.z,d=Math.hypot(dx,dz);
    // reach a bit past where the trunk stops your body (T.bodyRadius), so jumping into a tree grabs it every time;
    // in the air, aiming roughly at it is enough
    // touching the trunk (where it stops your body) while pushing roughly at it grabs at once, at any speed: running in
    // fast used to slide you round the trunk before the grab delay ran out
    const dot=(ix*dx+iz*dz)/(d*im),contact=d<c.r+T.bodyRadius+.12;
    // grab anywhere up the trunk (short trees used to be too low to catch mid-jump); you start no higher than the climb's top
    if(d<c.r+T.bodyRadius+.4&&py>=c.y-.1&&py<c.top-.5&&(dot>(grounded?.6:.4)||(contact&&dot>.3))){CL.touch+=dt;
      if(diving||contact||CL.touch>(grounded?T.climb.grabDelay:0)){if(diving)addTrick('Dive Grab');Object.assign(CL,{on:true,tree:c,ang:Math.atan2(-dx,-dz),h:Math.min(c.top-1.2,Math.max(py,c.y)+.15),top:false,touch:0,stepT:0});
        vel.set(0,0,0);vy=0;A.spd=0;A.mode='normal';A.flipT=99;grounded=false;stand=null;SFX.grab();burst(V(P.position.x,py+1.2,P.position.z),leafCol(),8)}
      return}}
  CL.touch=Math.max(0,CL.touch-dt*2);   // a frame or two off-angle doesn't throw the grab away
}
function letGo(){CL.on=false;CL.top=false;CL.cool=T.climb.regrabCooldown}
function climbStep(dt){
  const c=CL.tree,R=c.r*.7+.35,[ix,iz]=rawInput();
  invuln=Math.max(0,invuln-dt);jumpBuf=Math.max(0,jumpBuf-dt);vel.set(0,0,0);vy=0;grounded=false;stand=null;wallSliding=false;
  const ck=!!(held('crouch')||joy.crouch);
  if(CL.top){
    P.position.set(c.x,0,c.z);py=c.top;{const ax=Math.abs(ix);if(ax>.25)face-=Math.sign(ix)*Math.min(1,(ax-.25)/.6)*2.8*dt}
    if(jumpBuf>0){jumpBuf=0;letGo();vy=chars[ci].acro?T.climb.topFlipVy:chars[ci].jump*1.15;
      if(chars[ci].acro){A.spd=5;A.mode='flip';startFlip('x',1);A.canDive=true;addTrick(climbName('Tree-top Flip'));SFX.flip()}else{vel.x=Math.sin(face)*5;vel.z=Math.cos(face)*5;SFX.jump(2)}
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
    if(chars[ci].acro){A.spd=T.climb.leap.speed;A.mode='jump';A.jumpN=0;A.canDive=true}addTrick(climbName('Tree Leap'));SFX.jump(1)}
}
// Flip-direction arrow: while you balance on a tree or pole top, a glowing arrow shows where your flip
// (or leap) will go: the way you face. Left/right rotate it; the flip goes exactly where it points.
const flipArrow=new THREE.Group();flipArrow.visible=false;scene.add(flipArrow);
const flipArrowM=new THREE.MeshBasicMaterial({color:0xffd84a,transparent:true,opacity:.9,depthWrite:false});
{const m=flipArrowM;
  const shaft=new THREE.Mesh(new THREE.BoxGeometry(.16,.06,.6),m);shaft.position.z=.3;flipArrow.add(shaft);
  const tip=new THREE.Mesh(new THREE.ConeGeometry(.24,.42,4),m);tip.rotation.x=PI/2;tip.position.z=.78;flipArrow.add(tip)}
function updateFlipArrow(){const on=state==='play'&&CL.on&&CL.top&&!!CL.tree;flipArrow.visible=on;if(!on)return;
  const c=CL.tree,d=face,pulse=Math.sin(tAll*7);
  flipArrow.position.set(c.x+Math.sin(d)*(.75+pulse*.08),c.top+.25,c.z+Math.cos(d)*(.75+pulse*.08));flipArrow.rotation.y=d;
  flipArrowM.opacity=.75+pulse*.2}
// ---------- ledge hang ----------
// Falling past a box ledge while facing it grabs on (hands at the top). Left/right shimmy along it,
// push toward it to pull up, Jump to hop up onto it, crouch or push away to let go.
const LH={on:false,p:null,ax:'x',s:1,up:0,cool:0,dist:0,awarded:false,enabled:true};
try{LH.enabled=localStorage.getItem('orbRunHang')!=='0'}catch(e){}
function tryHang(){
  if(!LH.enabled||LH.cool>0||grounded||vy>0||CL.on||GP.st||SA.t>0||SB.stun>0||A.knock>0||A.mode==='dive'||A.mode==='slide'||YS.spray||YS.t>0||state!=='play')return false;
  const x=P.position.x,z=P.position.z,fx=Math.sin(face),fz=Math.cos(face),H=T.hang;
  for(const p of plats){if(p.k!=='b'||p.mv||p.ramp)continue;const rel=p.top-py;if(rel<H.min||rel>H.max)continue;
    const hw=p.w/2,hd=p.d/2,dx=x-p.x,dz=z-p.z;let ax=null,s=0;
    if(Math.abs(dz)<hd-.1&&Math.abs(dx)>hw-.05&&Math.abs(dx)<hw+H.reach){ax='x';s=Math.sign(dx)}
    else if(Math.abs(dx)<hw-.1&&Math.abs(dz)>hd-.05&&Math.abs(dz)<hd+H.reach){ax='z';s=Math.sign(dz)}
    if(!ax)continue;const nx=ax==='x'?-s:0,nz=ax==='z'?-s:0;if(fx*nx+fz*nz<.5)continue;
    // room to pull up: nothing solid sitting on the ledge right there
    const lx=ax==='x'?p.x+s*(hw-.3):x,lz=ax==='z'?p.z+s*(hd-.3):z;
    if(plats.some(q=>q!==p&&q.top>p.top+.3&&(q.bot===undefined||q.bot<p.top+1.6)&&inside(q,lx,lz,0)))continue;
    Object.assign(LH,{on:true,p,ax,s,up:0,dist:0,awarded:false});
    if(ax==='x')P.position.x=p.x+s*(hw+H.off);else P.position.z=p.z+s*(hd+H.off);
    py=p.top-H.drop;vy=0;vel.set(0,0,0);A.spd=0;A.mode='normal';A.flipT=99;A.twirlT=99;face=Math.atan2(nx,nz);jumpBuf=0;SFX.grab();return true}
  return false}
function hangStep(dt){const p=LH.p,H=T.hang,[ix,iz]=rawInput();vy=0;vel.set(0,0,0);grounded=false;stand=null;invuln=Math.max(0,invuln-dt);wallSliding=false;
  const nx=LH.ax==='x'?-LH.s:0,nz=LH.ax==='z'?-LH.s:0;face=Math.atan2(nx,nz);
  if(LH.up>0){ // rise first, then step in over the edge (smoothstep), so the body and camera move continuously
    LH.up=Math.max(0,LH.up-dt);const k=1-LH.up/LH.upT,sm=t=>t*t*(3-2*t),rise=sm(Math.min(1,k/.75)),step=sm(Math.max(0,(k-.35)/.65));
    py=p.top-H.drop+H.drop*rise+(LH.hop?.25*Math.sin(PI*Math.min(1,k/.75)):0);P.position.x=LH.sx+(LH.ex-LH.sx)*step;P.position.z=LH.sz+(LH.ez-LH.sz)*step;
    if(LH.up<=0){LH.on=false;LH.cool=.25;py=p.top;P.position.x=LH.ex;P.position.z=LH.ez;
      if(LH.hop){vy=H.hopVy*.55;grounded=false;stand=null;if(chars[ci].acro){A.mode='jump';A.jumpN=0;A.spd=0;A.canDive=true;A.canCut=false}SFX.jump(1);addTrick('Ledge Hop')}
      else{grounded=true;stand=p;addTrick('Ledge Climb')}}
    return}
  py=p.top-H.drop;
  const startUp=(hop)=>{Object.assign(LH,{hop,upT:hop?H.hopTime:H.climbTime,up:hop?H.hopTime:H.climbTime,sx:P.position.x,sz:P.position.z,ex:P.position.x+nx*(H.off+.4),ez:P.position.z+nz*(H.off+.4)});if(!hop)SFX.climb()};
  const toward=ix*nx+iz*nz,along=LH.ax==='x'?iz:ix,ck=held('crouch')||joy.crouch;
  if(ck||toward<-.6){LH.on=false;LH.cool=.35;return}
  // Jump: a quick spring up over the edge that ends in a little hop; pushing toward the ledge climbs up
  if(jumpBuf>0){jumpBuf=0;startUp(true);return}
  if(toward>.6){startUp(false);return}
  if(Math.abs(along)>.25){const lim=(LH.ax==='x'?p.d:p.w)/2-.3,st=along*H.shimmy*dt;
    if(LH.ax==='x')P.position.z=Math.max(p.z-lim,Math.min(p.z+lim,P.position.z+st));else P.position.x=Math.max(p.x-lim,Math.min(p.x+lim,P.position.x+st));
    LH.dist+=Math.abs(st);walk+=Math.abs(st)*2;if((LH.stepT=(LH.stepT||0)+dt)>.28){LH.stepT=0;SFX.climb()}
    if(!LH.awarded&&LH.dist>=H.overHand){LH.awarded=true;addTrick('Hand Over Hand')}}
}
let onIce=false;const iceV=new THREE.Vector3();
function stepBody(dt,speed){
  CL.cool=Math.max(0,CL.cool-dt);LH.cool=Math.max(0,LH.cool-dt);if(CL.on){onIce=false;climbStep(dt);return true}
  if(LH.on){onIce=false;hangStep(dt);return true}
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
  const bX=blockedMove(ox,oz,nx,oz,py);if(!bX)P.position.x=nx;else{if(ac&&Math.abs(nx-ox)>1e-4){A.wnx=-Math.sign(nx-ox);A.wnz=0;A.wallT=T.flip.wallJump.contact}vel.x=0}
  const bZ=blockedMove(P.position.x,oz,P.position.x,nz,py);if(!bZ)P.position.z=nz;else{if(ac&&Math.abs(nz-oz)>1e-4){A.wnz=-Math.sign(nz-oz);A.wnx=0;A.wallT=T.flip.wallJump.contact}vel.z=0}
  if(onIce){if(bX){if(Math.abs(iceV.x)>T.ice.bounceSound)SFX.board(Math.abs(iceV.x));iceV.x*=-T.ice.bounce}if(bZ){if(Math.abs(iceV.z)>T.ice.bounceSound)SFX.board(Math.abs(iceV.z));iceV.z*=-T.ice.bounce}}
  if(chars[ci].acro&&!A.knock&&A.mode!=='flip')A.spd=vel.x*Math.sin(face)+vel.z*Math.cos(face);
  pushOut(P.position,T.bodyRadius,advCol);tryGrab(dt);if(CL.on)return true;
  // vertical
  const prev=py;vy-=T.gravity*dt;
  wallSliding=false;
  if(chars[ci].acro&&A.wallT>0&&!grounded&&vy<T.flip.wallJump.slideFall&&A.mode!=='dive'){vy=T.flip.wallJump.slideFall;wallSliding=true;if(Math.random()<.3)puff()}
  py+=vy*dt;
  // bonk your head on the underside of a deck or bar
  if(vy>0)for(const p of plats){const b=botOf(p,P.position.x,P.position.z);if(b!==undefined&&prev+T.bodyH<=b+.02&&py+T.bodyH>b&&inside(p,P.position.x,P.position.z,-.05)){py=b-T.bodyH;vy=0;A.canCut=false;break}}
  const g=groundAt(P.position.x,P.position.z,prev);
  if(py<=g.h){const vin=vy;py=g.h;vy=0;grounded=true;stand=g.on;
    // trampolines: landing from the air bounces you; a ground pound onto one is a super bounce
    if(stand&&stand.bounce&&(vin<-2||GP.st===2)){const sup=GP.st===2;vy=sup?T.bounce.poundVy:T.bounce.vy;grounded=false;stand=null;if(sup)GP.st=0,A.mode='normal';
      if(chars[ci].acro){A.mode=sup?'flip':'jump';A.jumpN=0;A.canDive=true;A.canCut=false;if(sup)startFlip('x',1)}
      SFX.boing(sup);burst(V(P.position.x,py+.1,P.position.z),0xffffff,sup?16:8);addTrick(sup?'Super Bounce':'Bounce')}}
  // going down a slope: stay on it instead of skipping into the air every frame
  else if(grounded&&vy<=0&&g.on&&((stand&&stand.ramp)||g.on.ramp)&&prev-g.h<.6){py=g.h;vy=0;stand=g.on}
  else{grounded=false;stand=null}
  if(!grounded&&tryHang())return true;
  return py>=T.fallDeath;
}
// Safety net: if the body ends up overlapping something solid (a corner, a moving platform, overlapping pieces in a
// custom map), nudge it out to the nearest open spot after a moment; if there isn't one nearby, pop it on top.
let stuckT=0;
function bodyInSolid(x,z,y){return plats.find(p=>inside(p,x,z,-.05)&&topOf(p,x,z)>y+.55&&(botOf(p,x,z)===undefined||y+T.bodyH>botOf(p,x,z)+.1))}
function unstick(dt){if(state!=='play'||CL.on||LH.on){stuckT=0;return}const x=P.position.x,z=P.position.z,s=bodyInSolid(x,z,py);
  if(!s){stuckT=0;return}if((stuckT+=dt)<.2)return;stuckT=0;
  for(let r=.25;r<=3.01;r+=.25)for(let k=0;k<16;k++){const a=k/16*2*PI,nx=x+Math.sin(a)*r,nz=z+Math.cos(a)*r;
    if(!blocked(nx,nz,py)&&!bodyInSolid(nx,nz,py)){P.position.x=nx;P.position.z=nz;vel.set(0,0,0);if(chars[ci].acro)A.spd=0;return}}
  const g=groundAt(x,z,1e9);if(g.on){py=g.h;vy=0;grounded=true;stand=g.on}}
