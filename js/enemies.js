// Enemies: the winter crew (snow goons, penguin sliders, holiday elves), with the original spikeballs behind a
// toggle (Settings → Enemies).
//  - Snow goon: waddles into range and lobs snowballs (they stun like a friend's); touching it costs a life.
//  - Penguin slider: waddles, flaps a "!" warning, then belly-slides fast and bounces off walls; dizzy (harmless) after.
//  - Holiday elf: hops after you and steals snowballs instead of hurting; smack it before it escapes to get them back.
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
  const brows=[],cheeks=[];[-1,1].forEach(s=>{add(Sph(.075,8,6),wht,s*.11,.05,.24,head);add(Sph(.04,6,5),mat(0x111111),s*.11,.04,.31,head);
    const b=add(B(.13,.035,.03),mat(0x111111),s*.11,.15,.27,head);b.rotation.z=s*.45;b.side_=s;brows.push(b);
    const c=add(Sph(.06,8,6),new THREE.MeshBasicMaterial({color:0xff5a5a,transparent:true,opacity:.7}),s*.2,-.04,.22,head);c.scale.set(1,.6,.4);c.visible=false;cheeks.push(c)});
  add(new THREE.ConeGeometry(.07,.22,8),org,0,-.05,.33,head).rotation.x=PI/2;
  add(new THREE.TorusGeometry(.27,.065,6,16),red,0,.4,0,body).rotation.x=PI/2;                  // bandana
  add(B(.12,.2,.05),red,.12,.3,-.27,body).rotation.z=.4;
  const flips=[-1,1].map(s=>{const f=new THREE.Group();f.position.set(s*.42,.18,0);body.add(f);add(B(.08,.46,.24),blk,0,-.2,0,f);f.rotation.z=s*.2;return f});
  const feet=[-1,1].map(s=>add(B(.17,.06,.24),org,s*.15,-.52,.1,body));
  // warning "!" shown during the wind-up
  const excl=new THREE.Group();excl.position.y=1.65;excl.visible=false;g.add(excl);
  const exM=new THREE.MeshBasicMaterial({color:0xff4d3a});add(B(.1,.32,.1),exM,0,.12,0,excl);add(Sph(.065,8,6),exM,0,-.13,0,excl);
  return{g,body,head,flips,feet,excl,brows,cheeks}}
// Holiday elf (kind 'imp' under the hood, so friends on older versions still match up): green tunic with a zigzag
// collar and a belt, red-and-white striped stockings, curly-toed shoes with bells, a floppy hat with a fur band and a
// jingle bell, pointy ears and a sly grin. Same {g, body, bag} as before: it hops, and carries your snowballs in its sack.
function buildImp(parent){const g=new THREE.Group();parent.add(g);const body=new THREE.Group();body.position.y=.42;g.add(body);
  const sm=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.7,...o}),
        skin=sm(0xf2c6a0),green=sm(0x2f9e4f),dkG=sm(0x1f6e37),red=sm(0xd8332f),white=sm(0xf7f3ea,{roughness:.95}),
        gold=sm(0xf2c230,{roughness:.3,metalness:.5}),dark=mat(0x1a1214),pink=sm(0xf08a8a,{transparent:true,opacity:.6});
  // stockings (striped) and curly shoes
  [-1,1].forEach(s=>{for(let k=0;k<4;k++)add(new THREE.CylinderGeometry(.055,.055,.05,10),k%2?white:red,s*.09,-.25-k*.05,0,body);
    const sh=new THREE.Group();sh.position.set(s*.09,-.45,.03);body.add(sh);add(Sph(.08,10,8),dkG,0,0,0,sh).scale.set(1,.7,1.5);
    const toe=add(new THREE.ConeGeometry(.045,.16,8),dkG,0,.03,.15,sh);toe.rotation.x=-1.1;add(Sph(.028,6,5),gold,0,.1,.2,sh)});
  // tunic: body, zigzag collar points, belt and buckle
  add(new THREE.CylinderGeometry(.15,.23,.32,14),green,0,-.08,0,body);
  for(let k=0;k<10;k++){const a=k/10*2*PI,c=add(new THREE.ConeGeometry(.045,.1,4),k%2?red:green,Math.sin(a)*.21,-.24,Math.cos(a)*.21,body);c.rotation.x=PI}
  add(new THREE.TorusGeometry(.19,.03,6,18),dark,0,-.13,0,body).rotation.x=PI/2;add(B(.07,.06,.03),gold,0,-.13,.2,body);
  for(let k=0;k<8;k++){const a=k/8*2*PI,c=add(new THREE.ConeGeometry(.04,.08,4),k%2?white:red,Math.sin(a)*.14,.07,Math.cos(a)*.14,body);c.rotation.x=-.2}
  // arms
  [-1,1].forEach(s=>{const a=add(new THREE.CylinderGeometry(.045,.05,.2,8),green,s*.2,-.05,0,body);a.rotation.z=s*.6;add(Sph(.05,8,6),skin,s*.27,-.13,0,body)});
  // head: pointy ears, rosy cheeks, sly eyes with one raised brow, a big grin
  const hd=new THREE.Group();hd.position.y=.27;body.add(hd);add(Sph(.2,14,12),skin,0,0,0,hd);
  [-1,1].forEach(s=>{const e=add(new THREE.ConeGeometry(.05,.2,6),skin,s*.22,.02,-.02,hd);e.rotation.z=-s*1.25;
    add(Sph(.035,8,6),dark,s*.075,.03,.18,hd).scale.set(1,1.3,.5);add(Sph(.04,8,6),pink,s*.12,-.05,.15,hd);
    const br=add(B(.07,.016,.02),dark,s*.075,s>0?.1:.085,.18,hd);br.rotation.z=s>0?-.35:.15});
  add(Sph(.035,8,6),sm(0xe8a07a),0,-.01,.2,hd);
  const gr=add(new THREE.TorusGeometry(.06,.014,6,12,PI),dark,.01,-.07,.18,hd);gr.rotation.z=PI*1.08;
  // floppy hat: fur band, two bending cone segments, a bell on the tip
  add(new THREE.TorusGeometry(.18,.045,8,18),white,0,.1,0,hd).rotation.x=PI/2;
  const h1=new THREE.Group();h1.position.set(0,.12,0);h1.rotation.set(-.35,0,.15);hd.add(h1);add(new THREE.ConeGeometry(.18,.3,14),green,0,.15,0,h1);
  const h2=new THREE.Group();h2.position.set(0,.28,0);h2.rotation.set(-.9,0,.2);h1.add(h2);add(new THREE.ConeGeometry(.07,.2,10),green,0,.08,0,h2);
  add(Sph(.045,8,6),gold,0,.19,0,h2);
  // the sack your snowballs go in
  const bag=new THREE.Group();bag.position.set(0,.02,-.26);bag.visible=false;body.add(bag);
  add(Sph(.17,10,8),sm(0xc0392b,{roughness:.9}),0,0,0,bag);add(new THREE.TorusGeometry(.05,.015,6,10),gold,0,.16,0,bag).rotation.x=PI/2;
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
  else if(h.kind==='penguin'&&!h.angry){h.t-=dt;   // calm: waddle about, sometimes come over for a look, never charge
    if(h.st==='dizzy'){if(h.t<=0){h.st='walk';h.t=1}}
    else if(d<F_.penguinCurious&&d>2.2&&(h.peek=(h.peek??Math.random()*6)-dt)>-3){vx=dx/d*F_.penguinWalk*.8;vz=dz/d*F_.penguinWalk*.8;f=to}
    else{if(h.peek<=-3)h.peek=4+Math.random()*6;[vx,vz,f]=d<=2.2?[0,0,to]:wander(F_.penguinWalk*.7)}}
  else if(h.kind==='penguin'){h.t-=dt;if((h.angry-=dt)<=0&&h.st==='walk'){h.angry=0;h.st='walk'}
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
    if(m.brows){const ang=!!h.angry;m.brows.forEach(b=>{b.rotation.z=b.side_*(ang?.45:-.15);b.position.y=ang?.15:.17});m.cheeks.forEach(c=>c.visible=ang)}
    m.excl.visible=h.st==='windup';if(m.excl.visible)m.excl.position.y=1.65+Math.sin(t*14)*.05;
    const flap=h.st==='windup'?Math.sin(t*30)*.6:sl?-.9:Math.sin(t*8)*Math.min(.3,sp*.15);m.flips.forEach((f,i)=>f.rotation.z=(i?1:-1)*(.2+Math.abs(flap)));
    m.body.rotation.z=h.st==='walk'?Math.sin(t*9)*Math.min(.15,sp*.1):h.st==='dizzy'?Math.sin(t*6)*.25:0;
    if(!h.stars){h.stars=makeStars();h.g.add(h.stars)}h.stars.visible=h.st==='dizzy';if(h.stars.visible){h.stars.position.set(0,1.45,0);h.stars.rotation.y+=dt*7}}
  else if(h.kind==='imp'){const ph=((h.hopT??t)%T.foes.impHopEvery)/T.foes.impHopTime,air=ph<1&&sp>.5;
    m.body.position.y=.42+(air?Math.sin(ph*PI)*.45:0);m.body.scale.set(1,air?1.08:.92+Math.abs(Math.sin(t*3))*.05,1);
    m.body.rotation.z=Math.sin(t*5)*.1;m.bag.visible=h.st==='flee'||(h.mine||0)>0}}
// ----- contact with the local player -----
function foeHit(h){if((h.hurtT||0)>0){h.sbHit=false;return false}return attackHits(h.g.position,foeBase(h))||!!h.sbHit}
function foeStomp(h){if(h.kind==='spike'||grounded||vy>-1)return false;const p=h.g.position,k=FOE[h.kind],b=foeBase(h);
  return Math.hypot(p.x-P.position.x,p.z-P.position.z)<k.r+.15&&py>=b+k.top-.5&&py<=b+k.top+.8}
// 'hurt', 'steal' or null
function foeTouch(h){const p=h.g.position,k=FOE[h.kind],b=foeBase(h),d=Math.hypot(p.x-P.position.x,p.z-P.position.z);
  if(h.kind==='spike')return d<1.2&&Math.abs(py-b)<1?'hurt':null;
  if(d>k.r||py>b+k.top-.4||py<b-1)return null;
  if(h.kind==='imp')return(h.robbed||0)>0||h.st==='flee'?null:'steal';
  if(h.kind==='penguin'&&(h.st==='dizzy'||!h.angry))return null;return'hurt'}   // calm penguins are harmless
function impSteal(h){const n=Math.min(T.foes.impSteals,mode==='run'?SB.ammo:0);if(mode==='run'){SB.ammo-=n;snowHud()}
  h.mine=(h.mine||0)+n;h.robbed=4;h.st='flee';h.t=T.foes.impFleeTime;
  const p=h.g.position,dx=P.position.x-p.x,dz=P.position.z-p.z,d=Math.hypot(dx,dz)||1;vel.x+=dx/d*6;vel.z+=dz/d*6;
  SFX.impGiggle();rumble(90,.3,.6);toast(n?`A holiday elf swiped ${n} snowball${n>1?'s':''}! Smack it to get ${n>1?'them':'it'} back.`:'A holiday elf shoved you!')}
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
  if(mode==='run'&&h.kind==='goon'){const q=h.g.position,gh=groundAt(q.x,q.z,q.y+1).h;snowmanSnow(q.x,isFinite(gh)?gh:0,q.z)}   // the Winter Crew's snowman drops snowballs to grab
  if((h.mine||0)>0){SB.ammo=Math.min(T.snow.ammo,SB.ammo+h.mine);snowHud();snowFlash('gain');toast(`Got your snowball${h.mine>1?'s':''} back!`);h.mine=0}}
function smashSnd(){SFX.hit()}
// hitting a calm penguin doesn't take it out: it reels, gets angry and calls its friends. Returns true if it survived.
function angerPenguin(h,how){if(h.kind!=='penguin'||h.angry)return false;const F_=T.foes,p=h.g.position;
  if(how==='stomp'){vy=T.foes.stompBounce;grounded=false;stand=null;if(chars[ci].acro){A.mode='jump';A.jumpN=0;A.canCut=true;A.canDive=true}SFX.stomp()}
  else{ATK.hits++;hitStop=.05;shake=Math.max(shake,.12);SFX.hit()}
  const dx=p.x-P.position.x,dz=p.z-P.position.z,d=Math.hypot(dx,dz)||1;h.vx=dx/d*4;h.vz=dz/d*4;h.sbHit=false;h.hurtT=.7;
  for(const o of runHz)if(o.kind==='penguin'&&!o.dead&&(o===h||Math.hypot(o.g.position.x-p.x,o.g.position.z-p.z)<F_.penguinCall)){o.angry=F_.penguinGrudge;if(o!==h&&o.st!=='dizzy'){o.st='walk';o.t=.3}}
  h.st='dizzy';h.t=F_.penguinDizzy;SFX.squawk();burst(V(p.x,p.y+1.2,p.z),0xff5a5a,6);if(mode==='run')toast('You made the penguins angry!');return true}
// snowballs vs enemies
function hitsFoe(h,p){const g=h.g.position;if(h.kind==='spike')return Math.hypot(g.x-p.x,g.z-p.z)<1.05&&p.y<g.y+1.5&&p.y>g.y-1;
  const k=FOE[h.kind];return Math.hypot(g.x-p.x,g.z-p.z)<k.r*.8+.25&&p.y<g.y+k.top+.15&&p.y>g.y-.2}
// switching styles: Trick Park swaps the current enemies now (host)
function setFoeStyle(s){FOE_STYLE=s;try{localStorage.setItem('orbRunFoes',s)}catch(e){}
  if(mode==='run'&&!MP.client&&state!=='menu'){const n=runHz.filter(h=>!h.dead).length;runHz.forEach(h=>rmObj(h.g));runHz=[];for(let i=0;i<n;i++)spawnRunHz()}
  else if(MP.client)toast('The host picks the enemies in multiplayer.')}
