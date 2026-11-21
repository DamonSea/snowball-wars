// Enemies: the winter crew (snow goons, penguin sliders, frost imps), with the original spikeballs behind a
// toggle (Settings → Enemies). Loaded before the levels, because Adventure builds its enemies at load time.
//  - Snow goon: waddles into range and lobs snowballs (they stun like a friend's); touching it costs a life.
//  - Penguin slider: waddles, flaps a "!" warning, then belly-slides fast and bounces off walls; dizzy (harmless) after.
//  - Frost imp: hops after you and steals snowballs instead of hurting; smack it before it escapes to get them back.
// All of them can be punched, kicked, snowballed, dived into, pounded, or stomped (land on them from above).
// Trick Park: the host runs the AI (foeThink) and shares kind / state / facing and goon throws through presence.
let FOE_STYLE='crew';try{if(localStorage.getItem('orbRunFoes')==='spike')FOE_STYLE='spike'}catch(e){}
const KINDS=['spike','goon','penguin','imp'],FSTATES=['walk','windup','slide','dizzy','flee'];
// body height (top) and contact radius per kind
const FOE={spike:{top:1.5,r:1.2},goon:{top:2.1,r:.95},penguin:{top:1.2,r:.85},imp:{top:.95,r:.8}};
const FX={sent:[],seq:0};
const Sph=(r,w=12,h=9)=>new THREE.SphereGeometry(r,w,h);
// ----- models: each returns {g, ...parts}; g sits on the ground (y = 0) -----
function buildGoon(parent){const g=new THREE.Group();parent.add(g);const body=new THREE.Group();g.add(body);
  const snow=mat(0xf4f8fb,{roughness:.9}),coal=mat(0x1d1a18),stick=mat(0x5a3a22),hatM=mat(0x4a505a,{roughness:.55,metalness:.3}),
        eye=new THREE.MeshStandardMaterial({color:0xff3b30,emissive:0xff2a1a,emissiveIntensity:1.6});
  add(Sph(.6,14,10),snow,0,.55,0,body);add(Sph(.44,14,10),snow,0,1.32,0,body);
  for(let k=0;k<3;k++)add(Sph(.05,6,5),coal,0,1.12+k*.18,.42-Math.abs(k-1)*.03,body);
  const head=new THREE.Group();head.position.y=1.9;body.add(head);add(Sph(.32,14,10),snow,0,0,0,head);
  [-1,1].forEach(s=>{add(Sph(.055,8,6),eye,s*.11,.05,.28,head);const b=add(B(.15,.04,.04),coal,s*.11,.15,.27,head);b.rotation.z=s*.5});
  for(let k=0;k<5;k++)add(Sph(.035,6,5),coal,(k-2)*.06,-.09-Math.abs(k-2)*.03,.29,head);   // frown
  add(new THREE.ConeGeometry(.06,.32,8),mat(0xff8a3d),0,0,.36,head).rotation.x=PI/2;
  const hat=add(new THREE.CylinderGeometry(.22,.27,.3,12),hatM,.03,.36,0,head);hat.rotation.z=.18;
  add(new THREE.TorusGeometry(.16,.02,6,12,PI),hatM,.08,.48,0,head).rotation.z=.18;             // bucket handle
  const arms=[-1,1].map(s=>{const a=new THREE.Group();a.position.set(s*.38,1.45,0);body.add(a);
    const st=add(new THREE.CylinderGeometry(.035,.03,.8,5),stick,s*.34,.14,0,a);st.rotation.z=s*-1.15;
    [-.4,.4].forEach(t=>{const f=add(new THREE.CylinderGeometry(.02,.015,.22,4),stick,s*.7,.34+t*.1,t*.12,a);f.rotation.z=s*-.5+t});return a});
  return{g,body,head,arms}}
function buildPenguin(parent){const g=new THREE.Group();parent.add(g);const body=new THREE.Group();body.position.y=.55;g.add(body);
  const blk=mat(0x1f2430,{roughness:.5}),wht=mat(0xf4f6f8),org=mat(0xff9a2e),red=mat(0xd83a2e);
  add(Sph(.45,14,10),blk,0,0,0,body).scale.set(1,1.3,.92);add(Sph(.37,14,10),wht,0,-.06,.2,body).scale.set(.95,1.2,.72);
  const head=new THREE.Group();head.position.y=.62;body.add(head);add(Sph(.3,14,10),blk,0,0,0,head);
  [-1,1].forEach(s=>{add(Sph(.075,8,6),wht,s*.11,.05,.24,head);add(Sph(.04,6,5),mat(0x111111),s*.11,.04,.31,head);
    const b=add(B(.13,.035,.03),mat(0x111111),s*.11,.15,.27,head);b.rotation.z=s*.45});
  add(new THREE.ConeGeometry(.07,.22,8),org,0,-.05,.33,head).rotation.x=PI/2;
  add(new THREE.TorusGeometry(.27,.065,6,16),red,0,.4,0,body).rotation.x=PI/2;                  // bandana
  add(B(.12,.2,.05),red,.12,.3,-.27,body).rotation.z=.4;
  const flips=[-1,1].map(s=>{const f=new THREE.Group();f.position.set(s*.42,.18,0);body.add(f);add(B(.08,.46,.24),blk,0,-.2,0,f);f.rotation.z=s*.2;return f});
  const feet=[-1,1].map(s=>add(B(.17,.06,.24),org,s*.15,-.52,.1,body));
  // warning "!" shown during the wind-up
  const excl=new THREE.Group();excl.position.y=1.65;excl.visible=false;g.add(excl);
  const exM=new THREE.MeshBasicMaterial({color:0xff4d3a});add(B(.1,.32,.1),exM,0,.12,0,excl);add(Sph(.065,8,6),exM,0,-.13,0,excl);
  return{g,body,head,flips,feet,excl}}
function buildImp(parent){const g=new THREE.Group();parent.add(g);const body=new THREE.Group();body.position.y=.42;g.add(body);
  const ice=new THREE.MeshStandardMaterial({color:0x8fdcff,roughness:.25,metalness:.1,emissive:0x1a5f80,emissiveIntensity:.4}),
        dk=mat(0x2a5a78),eyeM=new THREE.MeshStandardMaterial({color:0xfff27a,emissive:0xffd400,emissiveIntensity:1.4});
  add(Sph(.36,14,10),ice,0,0,0,body).scale.set(1,.95,.9);
  [-1,1].forEach(s=>{const h=add(new THREE.ConeGeometry(.08,.36,6),ice,s*.19,.36,-.02,body);h.rotation.z=-s*.45;
    const e=add(new THREE.ConeGeometry(.07,.3,5),ice,s*.4,.06,0,body);e.rotation.z=-s*1.35;
    add(Sph(.085,8,6),eyeM,s*.13,.08,.28,body).scale.set(1,1.25,.5);add(B(.025,.09,.02),mat(0x111111),s*.13,.08,.33,body);
    add(Sph(.075,8,6),dk,s*.14,-.36,.05,body);add(Sph(.07,8,6),ice,s*.36,-.1,.06,body)});
  add(B(.27,.07,.03),mat(0xffffff),0,-.11,.31,body);add(B(.31,.11,.02),dk,0,-.11,.3,body);       // grin
  const bag=new THREE.Group();bag.position.set(0,.08,-.34);bag.visible=false;body.add(bag);
  add(Sph(.2,10,8),mat(0xefe6d4,{roughness:.95}),0,0,0,bag);add(Sph(.06,6,5),mat(0xb89a6a),0,.19,0,bag);
  return{g,body,bag}}
function makeFoe(kind,parent){if(kind==='spike')return{g:spikeball(parent),kind,m:null};
  const m=kind==='goon'?buildGoon(parent):kind==='penguin'?buildPenguin(parent):buildImp(parent);return{g:m.g,kind,m}}
function pickKind(){if(FOE_STYLE==='spike')return'spike';const r=Math.random();return r<.36?'goon':r<.7?'penguin':'imp'}
const foeBase=h=>h.kind==='spike'?h.g.position.y-.75:h.g.position.y;
// ----- Trick Park AI (host) -----
function nearestTarget(p){let best={x:P.position.x,y:py,z:P.position.z},bd=Math.hypot(P.position.x-p.x,P.position.z-p.z);
  if(MP.room)for(const a of MP.av.values()){if(!a.g.visible)continue;const q=a.g.position,d=Math.hypot(q.x-p.x,q.z-p.z);if(d<bd){bd=d;best={x:q.x,y:q.y,z:q.z}}}
  return{...best,d:bd}}
function foeThink(h,dt){const F_=T.foes,p=h.g.position,tg=nearestTarget(p),dx=tg.x-p.x,dz=tg.z-p.z,d=tg.d||1,to=Math.atan2(dx,dz);
  const wander=sp=>{if((h.t-=dt)<=0){h.t=2+Math.random()*2;h.wa=Math.random()*PI*2}return[Math.sin(h.wa)*sp,Math.cos(h.wa)*sp,h.wa]};
  let vx=0,vz=0,f=h.face;
  if(h.kind==='goon'){h.cool-=dt;h.throwT=Math.max(0,(h.throwT||0)-dt);
    if(d<F_.goonSight){f=to;if(h.throwT<=0){if(d>F_.goonKeep+2){vx=dx/d*F_.goonSpeed;vz=dz/d*F_.goonSpeed}else if(d<F_.goonKeep-2){vx=-dx/d*F_.goonSpeed*.7;vz=-dz/d*F_.goonSpeed*.7}}
      if(h.cool<=0&&d>3&&Math.abs(tg.y-p.y)<4){h.cool=F_.goonEvery+Math.random()*1.2;h.throwT=.35;goonThrow(h,tg,d)}}
    else{[vx,vz,f]=wander(F_.goonSpeed*.5)}}
  else if(h.kind==='penguin'){h.t-=dt;
    if(h.st==='walk'){if(d<F_.penguinSight){vx=dx/d*F_.penguinWalk;vz=dz/d*F_.penguinWalk;f=to}else{[vx,vz,f]=wander(F_.penguinWalk)}
      if(h.t<=0&&d<F_.penguinSight){h.st='windup';h.t=F_.penguinWindup;f=to;SFX.squawk()}}
    else if(h.st==='windup'){f=to;if(h.t<=0){h.st='slide';h.t=F_.penguinSlide;vx=Math.sin(f)*F_.penguinSlideSpeed;vz=Math.cos(f)*F_.penguinSlideSpeed;SFX.whoosh()}}
    else if(h.st==='slide'){vx=h.vx;vz=h.vz;f=Math.atan2(vx,vz);if(h.t<=0){h.st='dizzy';h.t=F_.penguinDizzy;vx=vz=0}}
    else{if(h.t<=0){h.st='walk';h.t=F_.penguinRest+Math.random()*1.5}}}
  else if(h.kind==='imp'){h.hopT=(h.hopT||0)+dt;const ph=h.hopT%F_.impHopEvery,hopping=ph<F_.impHopTime;
    if(h.st==='flee'){h.t-=dt;f=to+PI;if(hopping){vx=-dx/d*F_.impFlee;vz=-dz/d*F_.impFlee}if(h.t<=0)h.escape=true}
    else if(d<F_.impSight){f=to;if(hopping){vx=dx/d*F_.impSpeed;vz=dz/d*F_.impSpeed}}
    else{[vx,vz,f]=wander(hopping?F_.impSpeed*.6:0)}}
  h.vx=vx;h.vz=vz;h.face=f}
// goons lob at where you'll be, with a little wobble so you can dodge; shared with friends via presence
function goonThrow(h,tg,d){const p=h.g.position,S=T.snow,sp=S.speed*.8,fx=Math.sin(h.face),fz=Math.cos(h.face);
  const ox=p.x+fx*.6,oy=p.y+1.7,oz=p.z+fz*.6,tx=tg.x+(Math.random()-.5)*1.4,tz=tg.z+(Math.random()-.5)*1.4,hx=tx-ox,hz=tz-oz,hd=Math.hypot(hx,hz)||1,tt=hd/sp;
  const o=[ox,oy,oz,hx/hd*sp,(tg.y+1.1-oy+.5*S.gravity*tt*tt)/tt,hz/hd*sp].map(f2),id=++FX.seq;
  launchSnowball(o,false,'goon',-id);FX.sent.push([id,...o]);if(FX.sent.length>4)FX.sent.shift();SFX.snowThrow()}
// ----- animation (host and clients) -----
function foeAnim(h,dt){if(!h.m)return;const m=h.m,t=tAll+(h.ph||(h.ph=Math.random()*9)),p=h.g.position;
  const sp=Math.hypot(p.x-(h.lx??p.x),p.z-(h.lz??p.z))/Math.max(dt,1e-3);h.lx=p.x;h.lz=p.z;
  h.g.rotation.y+=angD(h.face??0,h.g.rotation.y)*Math.min(1,dt*10);
  if(h.kind==='goon'){m.body.rotation.z=Math.sin(t*7)*Math.min(.14,sp*.06);m.body.position.y=Math.abs(Math.sin(t*7))*Math.min(.08,sp*.03);
    const th=h.throwT||0;m.arms[1].rotation.x=th>0?(th>.18?.9:-1.6):Math.sin(t*2)*.1;m.arms[0].rotation.x=Math.sin(t*2+1)*.1;m.head.rotation.z=Math.sin(t*1.3)*.08}
  else if(h.kind==='penguin'){const sl=h.st==='slide';m.body.rotation.x+=((sl?1.45:0)-m.body.rotation.x)*Math.min(1,dt*12);m.body.position.y=sl?.36:.55;
    m.excl.visible=h.st==='windup';if(m.excl.visible)m.excl.position.y=1.65+Math.sin(t*14)*.05;
    const flap=h.st==='windup'?Math.sin(t*30)*.6:sl?-.9:Math.sin(t*8)*Math.min(.3,sp*.15);m.flips.forEach((f,i)=>f.rotation.z=(i?1:-1)*(.2+Math.abs(flap)));
    m.body.rotation.z=h.st==='walk'?Math.sin(t*9)*Math.min(.15,sp*.1):h.st==='dizzy'?Math.sin(t*6)*.25:0;
    if(!h.stars){h.stars=makeStars();h.g.add(h.stars)}h.stars.visible=h.st==='dizzy';if(h.stars.visible){h.stars.position.set(0,1.45,0);h.stars.rotation.y+=dt*7}}
  else if(h.kind==='imp'){const ph=((h.hopT??t)%T.foes.impHopEvery)/T.foes.impHopTime,air=ph<1&&sp>.5;
    m.body.position.y=.42+(air?Math.sin(ph*PI)*.45:0);m.body.scale.set(1,air?1.08:.92+Math.abs(Math.sin(t*3))*.05,1);
    m.body.rotation.z=Math.sin(t*5)*.1;m.bag.visible=h.st==='flee'||(h.mine||0)>0}}
// ----- contact with the local player -----
function foeHit(h){return attackHits(h.g.position,foeBase(h))||!!h.sbHit}
function foeStomp(h){if(h.kind==='spike'||grounded||vy>-1)return false;const p=h.g.position,k=FOE[h.kind],b=foeBase(h);
  return Math.hypot(p.x-P.position.x,p.z-P.position.z)<k.r+.15&&py>=b+k.top-.5&&py<=b+k.top+.8}
// 'hurt', 'steal' or null
function foeTouch(h){const p=h.g.position,k=FOE[h.kind],b=foeBase(h),d=Math.hypot(p.x-P.position.x,p.z-P.position.z);
  if(h.kind==='spike')return d<1.2&&Math.abs(py-b)<1?'hurt':null;
  if(d>k.r||py>b+k.top-.4||py<b-1)return null;
  if(h.kind==='imp')return(h.robbed||0)>0||h.st==='flee'?null:'steal';
  if(h.kind==='penguin'&&h.st==='dizzy')return null;return'hurt'}
function impSteal(h){const n=Math.min(T.foes.impSteals,mode==='run'?SB.ammo:0);if(mode==='run'){SB.ammo-=n;snowHud()}
  h.mine=(h.mine||0)+n;h.robbed=4;h.st='flee';h.t=T.foes.impFleeTime;
  const p=h.g.position,dx=P.position.x-p.x,dz=P.position.z-p.z,d=Math.hypot(dx,dz)||1;vel.x+=dx/d*6;vel.z+=dz/d*6;
  SFX.impGiggle();rumble(90,.3,.6);toast(n?`A frost imp swiped ${n} snowball${n>1?'s':''}! Smack it to get ${n>1?'them':'it'} back.`:'A frost imp shoved you!')}
// effects when one goes down (no red, except the original spikeballs)
function foeFx(h){const p=h.g.position.clone();
  if(h.kind==='spike'){burst(p,0xff5a4e,18);burst(p,0xffffff,6);return}
  if(h.kind==='goon'){[[.55,16],[1.32,12],[1.9,8]].forEach(([y,n])=>{const q=V(p.x,p.y+y,p.z);burst(q,0xffffff,n);burst(q,0xdff4ff,n>>1)});burst(V(p.x,p.y+2.2,p.z),0x4a505a,5)}
  else if(h.kind==='penguin'){burst(V(p.x,p.y+.6,p.z),0x1f2430,14);burst(V(p.x,p.y+.6,p.z),0xffffff,12);burst(V(p.x,p.y+.9,p.z),0xffe066,4)}
  else{burst(V(p.x,p.y+.45,p.z),0x8fdcff,18);burst(V(p.x,p.y+.45,p.z),0xffffff,8)}
  SFX.splat(true)}
// you took one out: effects, points, stomp bounce, stolen snowballs back
function killFoe(h,how){foeFx(h);
  if(how==='stomp'){vy=T.foes.stompBounce;grounded=false;stand=null;if(chars[ci].acro){A.mode='jump';A.jumpN=0;A.canCut=true;A.canDive=true}SFX.stomp();rumble(100,.5,.7)}
  else{ATK.hits++;hitStop=.07;shake=Math.max(shake,.18);rumble(120,.7,.9);if(h.kind!=='spike')SFX.hit();else smashSnd()}
  if(mode==='run')addTrick(how==='stomp'?'Stomp':'Smash');
  if((h.mine||0)>0){SB.ammo=Math.min(T.snow.ammo,SB.ammo+h.mine);snowHud();snowFlash('gain');toast(`Got your snowball${h.mine>1?'s':''} back!`);h.mine=0}}
function smashSnd(){SFX.hit()}
// snowballs vs enemies
function hitsFoe(h,p){const g=h.g.position;if(h.kind==='spike')return Math.hypot(g.x-p.x,g.z-p.z)<1.05&&p.y<g.y+1.5&&p.y>g.y-1;
  const k=FOE[h.kind];return Math.hypot(g.x-p.x,g.z-p.z)<k.r*.8+.25&&p.y<g.y+k.top+.15&&p.y>g.y-.2}
// switching styles: Trick Park swaps the current enemies now (host); Adventure swaps its looks live
function setFoeStyle(s){FOE_STYLE=s;try{localStorage.setItem('orbRunFoes',s)}catch(e){}
  if(mode==='run'&&!MP.client&&state!=='menu'){const n=runHz.filter(h=>!h.dead).length;runHz.forEach(h=>rmObj(h.g));runHz=[];for(let i=0;i<n;i++)spawnRunHz()}
  else if(MP.client)toast('The host picks the enemies in multiplayer.')}
// ----- Adventure: path enemies (patrol = penguin, circler = imp), spikeball kept inside for the toggle -----
function advFoe(kind){const g=new THREE.Group();advW.add(g);const spk=spikeball(g),m=kind==='penguin'?buildPenguin(g):buildImp(g);m.g.position.y=-.75;
  return{g,spk,m,kind,st:kind==='penguin'?'slide':'walk',face:0}}
function advFoeFrame(h,dt,dx,dz){const crew=FOE_STYLE!=='spike';h.spk.visible=!crew;h.m.g.visible=crew;
  if(!crew){roll(h.spk,dx/dt,dz/dt,dt);return}
  if(Math.hypot(dx,dz)>1e-4)h.face=Math.atan2(dx,dz);h.m.g.rotation.y+=angD(h.face,h.m.g.rotation.y)*Math.min(1,dt*10);
  const m=h.m;if(h.kind==='penguin'){m.body.rotation.x=1.45;m.body.position.y=.36;m.flips.forEach((f,i)=>f.rotation.z=(i?1:-1)*1.1)}
  else{h.hopT=(h.hopT||0)+dt;const ph=(h.hopT%.4)/.4;m.body.position.y=.42+Math.sin(ph*PI)*.35;m.body.rotation.z=Math.sin(tAll*5)*.1}}
