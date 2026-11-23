// Computer player for Trick Park (Settings → Computer player). A Flip in the Night Flyer outfit that
// wanders the ground, lobs snowballs at you, and gets knocked back and stunned when your snowballs
// hit it, so you can see the hit from the outside. It only exists on your screen.
const CPU={on:false,a:null,x:0,y:0,z:0,vx:0,vy:0,vz:0,face:0,stun:0,cool:2,tx:0,tz:0,retarget:0,throwT:0,walk:0,hits:0,seq:1e6};
try{CPU.on=localStorage.getItem('orbRunCpu')==='1'}catch(e){}
function cpuAvatar(){if(CPU.a)return CPU.a;const a=makeAv(2);applyOutfitTo(a.rig.mats,1);a.of=1;a.stars=makeStars();a.g.add(a.stars);a.g.visible=false;CPU.a=a;return a}
function cpuPlace(){const s=runL.spad||runL.spawn||{x:0,z:5};CPU.x=s.x+4;CPU.z=s.z-3;CPU.y=groundAt(CPU.x,CPU.z,20).h;if(!isFinite(CPU.y))CPU.y=0;
  CPU.vx=CPU.vz=CPU.vy=0;CPU.stun=0;CPU.cool=2.5;CPU.retarget=0;CPU.hits=0;const a=cpuAvatar();a.g.position.set(CPU.x,CPU.y,CPU.z);a.init=false}
function setCpu(on){CPU.on=on;try{localStorage.setItem('orbRunCpu',on?'1':'0')}catch(e){}
  if(on&&mode==='run')cpuPlace();if(CPU.a)CPU.a.g.visible=on&&mode==='run';toast(on?'Computer player joined':'Computer player left')}
// a snowball of yours reached the computer?
function cpuCatch(p,b){if(!CPU.on||mode!=='run'||WAR.on)return false;
  if(Math.hypot(CPU.x-p.x,CPU.z-p.z)>.75||p.y<CPU.y||p.y>CPU.y+2.1)return false;
  if(CPU.stun>T.snow.stun-.5)return true; // already reeling: splat but no second hit
  cpuKnock(b.vx,b.vz,true,b.yellow);return true}
// knock the computer back along (dx,dz) and stun it; a snowball hit also scores a Direct Hit
function cpuKnock(dx,dz,scored,yel){const d=Math.hypot(dx,dz)||1;CPU.vx=dx/d*T.snow.hitKnock;CPU.vz=dz/d*T.snow.hitKnock;CPU.vy=T.snow.hitLift;CPU.stun=T.snow.stun;CPU.throwT=0;
  CPU.hits++;if(scored)addTrick(yel?'Yellow Snowball':'Direct Hit');SFX.hurt()}
function cpuPose(dt){const t=tAll,mv=Math.hypot(CPU.vx,CPU.vz),air=CPU.y>groundAt(CPU.x,CPU.z,CPU.y).h+.05;
  // [hp.x,hp.y,hp.z, root.y, scaleY, legL.x,legL.z, legR.x,legR.z, armL.x,armL.z, armR.x,armR.z, head.x,head.y,head.z]
  let q=[0,0,0,0,1,0,0,0,0,.05,-.12,-.05,.12,0,0,0];
  if(CPU.stun>0){const w=Math.sin(t*11);q=[air?-.5:-.15,w*.25,w*.12,0,1,air?-.6:.15,0,air?.5:-.15,0,-.4,-1.3,-.4,1.3,.2,0,w*.35]}
  else if(CPU.throwT>0){const k=1-CPU.throwT/.3;q[1]=k<.4?.35:-.3;q[11]=k<.4?.9:-2.5+(k-.4)*2.2;q[12]=.2;q[13]=k<.4?-.2:.2}
  else if(mv>.5){const s=Math.sin(CPU.walk);q[0]=.12;q[5]=s*.8;q[7]=-s*.8;q[9]=-s*.6;q[11]=s*.6;q[3]=Math.abs(Math.cos(CPU.walk))*.05}
  applyPose(CPU.a,q,Math.min(1,dt*14))}
function updateCpu(dt){const a=cpuAvatar(),on=CPU.on&&!WAR.on&&mode==='run'&&state!=='menu'&&state!=='select';a.g.visible=on;   // sits out Snowball Wars (it has its own computer players)
  if(!on){a.stars.visible=false;return}
  if(state!=='play')return;
  if(!a.init){cpuPlace();a.init=true}
  CPU.stun=Math.max(0,CPU.stun-dt);CPU.cool-=dt;CPU.throwT=Math.max(0,CPU.throwT-dt);CPU.retarget-=dt;
  const dx=P.position.x-CPU.x,dz=P.position.z-CPU.z,dist=Math.hypot(dx,dz);
  if(CPU.stun>0)CPU.vx*=Math.exp(-2.5*dt),CPU.vz*=Math.exp(-2.5*dt);
  else{
    // keep a throwing distance from you, drifting around
    if(CPU.retarget<=0){CPU.retarget=1.5+Math.random()*2;const ang=Math.atan2(-dx,-dz)+(Math.random()-.5)*2.2,r=7+Math.random()*5;CPU.tx=P.position.x+Math.sin(ang)*r;CPU.tz=P.position.z+Math.cos(ang)*r}
    const ex=CPU.tx-CPU.x,ez=CPU.tz-CPU.z,el=Math.hypot(ex,ez),sp=el>.6&&CPU.throwT<=0?5.5:0,k=1-Math.exp(-8*dt);
    CPU.vx+=((el?ex/el:0)*sp-CPU.vx)*k;CPU.vz+=((el?ez/el:0)*sp-CPU.vz)*k;
    if(Math.hypot(CPU.vx,CPU.vz)>.5&&CPU.throwT<=0)CPU.face+=angD(Math.atan2(CPU.vx,CPU.vz),CPU.face)*Math.min(1,dt*10);
    // throw: a lob aimed at where you'll be, with some wobble so you can dodge
    if(CPU.cool<=0&&dist>3&&dist<18&&Math.abs(py-CPU.y)<4){CPU.cool=2+Math.random()*1.5;CPU.throwT=.3;CPU.face=Math.atan2(dx,dz);
      const fl=dist/T.snow.speed,tx=P.position.x+vel.x*fl*.6+(Math.random()-.5)*1.4,tz=P.position.z+vel.z*fl*.6+(Math.random()-.5)*1.4;
      const ox=CPU.x+Math.sin(CPU.face)*.5,oy=CPU.y+1.45,oz=CPU.z+Math.cos(CPU.face)*.5,hx=tx-ox,hz=tz-oz,hd=Math.hypot(hx,hz)||1,tt=hd/T.snow.speed;
      const vy0=(py+1.1-oy+.5*T.snow.gravity*tt*tt)/tt;
      launchSnowball([ox,oy,oz,hx/hd*T.snow.speed,vy0,hz/hd*T.snow.speed].map(f2),false,'cpu',++CPU.seq);SFX.snowThrow()}
  }
  // move with simple collision: walls stop it (and pick a new spot), ledges it walks off fall
  const nx=CPU.x+CPU.vx*dt,nz=CPU.z+CPU.vz*dt;
  if(!blocked(nx,CPU.z,CPU.y))CPU.x=nx;else{CPU.vx=0;CPU.retarget=0}
  if(!blocked(CPU.x,nz,CPU.y))CPU.z=nz;else{CPU.vz=0;CPU.retarget=0}
  const lim=runL.arena||26;CPU.x=Math.max(-lim,Math.min(lim,CPU.x));CPU.z=Math.max(-lim,Math.min(lim,CPU.z));
  const g=groundAt(CPU.x,CPU.z,CPU.y).h,gh=isFinite(g)?g:0;CPU.vy-=T.gravity*dt;CPU.y+=CPU.vy*dt;if(CPU.y<=gh){CPU.y=gh;CPU.vy=0}
  CPU.walk+=Math.hypot(CPU.vx,CPU.vz)*dt*2.2;
  a.g.position.set(CPU.x,CPU.y,CPU.z);a.g.rotation.y=CPU.face;
  a.stars.visible=CPU.stun>0;if(CPU.stun>0){a.stars.position.set(0,2.35,0);a.stars.rotation.y+=dt*7}
  cpuPose(dt);drawTag(a,'Computer',CPU.hits,false);
}
