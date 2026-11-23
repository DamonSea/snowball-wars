// Snowball fights (Trick Park only). Throw with F / R1 / the touch "Snow" button.
// Snowballs fly in an arc, splat on anything solid, smash spikeballs, knock down snowmen, and in
// multiplayer hit other players. Each throw is shared through presence as an origin and velocity, so
// every player simulates the same arc. The player who gets hit decides the hit (it's their screen),
// knocks themself back, and reports it; the thrower sees the report and scores a Direct Hit.
// Hold Throw to aim: a dotted arc shows where it will fly. Hold it T.snow.chargeTime seconds and the arc turns gold:
// let go for a charged snowball (bigger, glowing): double damage (2 hearts in Snowball Wars, twice the orbs knocked
// loose in a Collectathon) and a longer stun. Tap Throw to throw straight away, as before.
const SB={aim:{on:false,t:0,full:false},chIds:new Set(),list:[],ammo:T.snow.ammo,regen:0,cool:0,anim:0,seq:0,sent:[],hits:[],credited:new Set(),hitCool:0,stun:0};
const sbGeo=new THREE.SphereGeometry(.18,10,8),sbMat=new THREE.MeshStandardMaterial({color:0xf8fbff,roughness:.9});
const sbYellow=new THREE.MeshStandardMaterial({color:0xf2d64b,roughness:.9});
const sbCharged=new THREE.MeshStandardMaterial({color:0xfff6d8,emissive:0xffc531,emissiveIntensity:.9,roughness:.5});
function launchSnowball(o,own,owner,id,yellow=false,ch=false){
  const m=new THREE.Mesh(sbGeo,yellow?sbYellow:ch?sbCharged:sbMat);m.castShadow=true;m.position.set(o[0],o[1],o[2]);if(ch)m.scale.setScalar(1.5);scene.add(m);
  SB.list.push({m,vx:o[3],vy:o[4],vz:o[5],t:0,own,owner,id,yellow,ch,chunk:owner==='chunk'})}
const canThrow=()=>!(mode!=='run'||state!=='play'||CL.on||SB.cool>0||SB.stun>0||YS.t>0||YS.spray||SA.t>0||(WAR.on&&(WAR.cd>0||WAR.out>0)));
// where a throw would go right now: origin and velocity (the same numbers the throw uses, so the arc is exact)
function throwVec(f){const fx=Math.sin(f),fz=Math.cos(f),s=T.snow;
  return[P.position.x+fx*.5,py+1.45,P.position.z+fz*.5,fx*s.speed+vel.x*.5,s.lift+Math.max(0,vy)*.3,fz*s.speed+vel.z*.5].map(f2)}
function throwSnow(ch=false){
  if(!canThrow())return;
  if(SB.ammo<1){SFX.deny();if(!SB.told){SB.told=true;toast('Out of snowballs: grab orbs to refill')}snowFlash('empty');return}
  SB.ammo--;SB.cool=T.snow.cooldown;SB.anim=.3;snowHud();
  const d=inputDir();if(d!==null&&ATK.t<=0)face=d;
  const o=throwVec(face);
  const id=++SB.seq,yel=YS.armed&&YS.on;YS.armed=false;if(yel)YS.yIds.add(id);launchSnowball(o,true,null,id,yel,ch);if(WAR.on)warsThrew(id);
  if(ch){SB.chIds.add(id);burst(V(o[0],o[1],o[2]),0xffd84a,10)}
  SB.sent.push([id,...o,yel?1:0,ch?1:0]);if(SB.sent.length>4)SB.sent.shift();
  SFX.snowThrow();
}
// spikeballs sit low and are spiky: count anything passing over them up to head height
const hitsSpike=(h,p)=>{const g=h.g.position;return Math.hypot(g.x-p.x,g.z-p.z)<1.05&&p.y<g.y+1.5&&p.y>g.y-1};
function splat(p,big,yel){burst(p.clone(),yel?0xf2d64b:0xffffff,big?16:9);SFX.splat(big)}
// does a point sit inside something solid?
function solidAt(x,y,z){
  for(const p of plats)if(inside(p,x,z,.05)&&topOf(p,x,z)>y&&(botOf(p,x,z)===undefined||y>botOf(p,x,z))&&!(p.k==='c'&&p.r>20&&y>p.top-.05))return true;
  for(const c of advCol)if(Math.hypot(c.x-x,c.z-z)<c.r*(c.tree?.6:1)&&y<(c.tree?c.top:2.2))return true;
  return false}
function hitMe(owner,id,bx,bz,yel,ch=false){
  if(SB.hitCool>0||warsShielded())return;SB.hitCool=.5;SB.stun=T.snow.stun*(ch?T.snow.chargeStun:1);ATK.t=0;resetPound();
  const dx=P.position.x-bx,dz=P.position.z-bz,d=Math.hypot(dx,dz)||1,kn=T.snow.hitKnock*(ch?T.snow.chargeKnock:1);
  vel.x=dx/d*kn;vel.z=dz/d*kn;vy=Math.max(vy,T.snow.hitLift);grounded=false;stand=null;
  if(chars[ci].acro){A.mode='normal';A.flipT=99;A.spd=0}SFX.hurt();
  dropCombo();CL.on=false;CL.top=false;
  const f=$('frost');f.classList.remove('on','yellow');void f.offsetWidth;f.classList.add('on');if(yel){f.classList.add('yellow');toast('Ew. Yellow snowball.')}
  splat(V(P.position.x,py+1.4,P.position.z),true);rumble(160,.4,.8);
  const ko=WAR.on&&warsHitMe(owner,ch?2:1);if(ko)face=Math.atan2(-dx,-dz);if(!WAR.on)raceHitMe(ch?2:1);   // turn to face the throw, so the fall goes away from it
SB.hits.push(ko?[owner,id,1]:[owner,id]);if(SB.hits.length>6)SB.hits.shift();
}
function updateSnow(dt){
  updateAim(dt);
  SB.stun=Math.max(0,SB.stun-dt);dizzy(myStars,SB.stun>0,P.position.x,py,P.position.z,dt);
  SB.cool=Math.max(0,SB.cool-dt);SB.anim=Math.max(0,SB.anim-dt);SB.hitCool=Math.max(0,SB.hitCool-dt);
  if(T.snow.regen>0&&SB.ammo<T.snow.ammo&&(SB.regen+=dt)>=T.snow.regen){SB.regen=0;SB.ammo++;snowHud()}
  for(let i=SB.list.length-1;i>=0;i--){const b=SB.list[i],p=b.m.position;b.t+=dt;
    b.vy-=T.snow.gravity*dt;p.x+=b.vx*dt;p.y+=b.vy*dt;p.z+=b.vz*dt;
    let gone=b.t>T.snow.life||p.y<-1;
    if(!gone&&solidAt(p.x,p.y,p.z)){splat(p,false);gone=true}
    if(!gone&&b.own){
      // spikeballs (the loops in trickpark.js finish the smash)
      for(const h of runHz)if(!h.dead&&!h.sbHit&&hitsFoe(h,p)){h.sbHit=true;splat(p,false);gone=true;break}
      // snowmen
      if(!gone)for(const s of snowmen())if(s.up&&Math.hypot(s.x-p.x,s.z-p.z)<.85&&p.y<2.5){knockSnowman(s);splat(p,true);gone=true;break}
      // other players: splat for show; the hit only counts once they confirm it
      if(!gone&&(botCatch(p,b)||raceCatch(p,b)||tagCatch(p,b)||cpuCatch(p,b))){splat(p,true,b.yellow);gone=true}
      if(!gone)for(const a of MP.av.values()){const g=a.g.position;if(Math.hypot(g.x-p.x,g.z-p.z)<.75&&p.y>g.y&&p.y<g.y+2.1){splat(p,true);gone=true;break}}
    }else if(!gone&&!b.chunk){
      if(Math.hypot(P.position.x-p.x,P.position.z-p.z)<.75&&p.y>py&&p.y<py+2.1){hitMe(b.owner,b.id,p.x-b.vx*.05,p.z-b.vz*.05,b.yellow,b.ch);gone=true}
      else if(botCatch(p,b)){splat(p,true);gone=true}
      else for(const h of runHz)if(!h.dead&&!(b.owner==='goon'&&h.kind==='goon')&&hitsFoe(h,p)){splat(p,false);gone=true;break}
    }
    if(gone){freeTree(b.m);SB.list.splice(i,1)}}
  // standing snowmen are solid: you (and computer players) bump off them; knocked down, you can walk through.
  // r .55 keeps you just close enough that dives and belly slides still smash them.
  {const solid=snowmen().filter(s=>s.up).map(s=>({x:s.x,z:s.z,r:.55}));if(solid.length){
    if(py<2.4)pushOut(P.position,T.bodyRadius,solid);
    for(const b of [...(WAR.on?WAR.bots:[]),...RACE.bots,...(TAG.on?TAG.bots:[])])if((b.y||0)<2.4)pushOut(b,.5,solid);
    if(CPU.on&&(CPU.y||0)<2.4)pushOut(CPU,.5,solid)}}
  // punches, kicks, dives and belly slides smash snowmen too
  for(const s of snowmen()){if(!s.up||py>2.6)continue;const d=Math.hypot(s.x-P.position.x,s.z-P.position.z);
    if(attackHits(V(s.x,.75,s.z),0)){ATK.hits++;hitStop=.07;shake=Math.max(shake,.18);rumble(120,.7,.9);SFX.hit();knockSnowman(s)}
    else if(chars[ci].acro&&(A.mode==='dive'||A.mode==='slide')&&d<1.15){shake=Math.max(shake,.2);rumble(120,.6,.8);SFX.splat(true);knockSnowman(s)}}
  for(const s of snowmen())if(!s.up&&(s.t-=dt)<=0){s.up=true;s.g.visible=true;burst(V(s.x,1.2,s.z),0xffffff,10)}
}
function clearSnow(){aimEnd(false);clearAngels();clearRollers();clearYellow();resetPound();SB.stun=0;if(CPU.a)CPU.a.init=false;myStars.visible=false;SB.list.forEach(b=>freeTree(b.m));SB.list=[];SB.ammo=T.snow.ammo;SB.regen=0;SB.anim=0;snowHud()}
// orbs refill snowballs: regular orbs give a few, gold orbs fill you up
// knocking down a snowman (a target or a Winter Crew snowman) packs you a few snowballs
function snowmanSnow(){const was=SB.ammo;SB.ammo=Math.min(T.snow.ammo,SB.ammo+T.snow.snowmanAmmo);snowHud();snowFlash('gain');if(SB.ammo>was)toast(`+${SB.ammo-was} snowball${SB.ammo-was>1?'s':''}`)}
function gainSnow(gold){const was=SB.ammo;SB.ammo=gold?T.snow.ammo:Math.min(T.snow.ammo,SB.ammo+T.snow.orbAmmo);if(SB.ammo>was){snowHud();snowFlash('gain')}}
function snowFlash(c){const e=$('snowBox');if(!e)return;e.classList.remove('gain','empty');void e.offsetWidth;e.classList.add(c)}
function snowHud(){const e=$('snowAmmo');if(e)e.innerHTML=Array.from({length:T.snow.ammo},(_,i)=>`<i class="${i<SB.ammo?'':'off'}"></i>`).join('')}
// multiplayer: start remote throws we haven't seen, and credit our hits that others reported
function snowFromPeer(peer,a){const pr=peer.presence||{};yellowFromPeer(pr,a);
  if(!a.stars){a.stars=makeStars();a.g.add(a.stars)}a.stars.visible=!!pr.z;if(pr.z){a.stars.position.set(0,2.35,0);a.stars.rotation.y+=.12}
  if(!a.sbSeen){a.sbSeen=new Set();if(Array.isArray(pr.sb))pr.sb.forEach(s=>Array.isArray(s)&&a.sbSeen.add(s[0]));return}
  if(Array.isArray(pr.sb))for(const s of pr.sb){if(!Array.isArray(s)||s.length<7||a.sbSeen.has(s[0])||!s.slice(1).every(v=>Number.isFinite(v)))continue;
    a.sbSeen.add(s[0]);if(mode==='run'&&state==='play')launchSnowball(s.slice(1,7),false,peer.peer,s[0],s[7]===1,s[8]===1)}
  if(Array.isArray(pr.hb))for(const h of pr.hb){if(!Array.isArray(h)||h[0]!==MP.me||!Number.isInteger(h[1]))continue;
    const k=peer.peer+':'+h[1];if(SB.credited.has(k)||h[1]>SB.seq)continue;SB.credited.add(k);
    const yel=YS.yIds.has(h[1]);if(WAR.on){warsCreditRemote(h);SFX.splat(true);toast(h[2]===1?`You knocked out ${nameOf(peer)}!`:`Direct hit on ${nameOf(peer)}!`);continue}addTrick(yel?'Yellow Snowball':'Direct Hit');toast(yel?`Yellow snowball on ${nameOf(peer)}!`:`Direct hit on ${nameOf(peer)}!`);SFX.splat(true)}
}
// ----- snowmen targets, per map -----
const SNOWMEN_AT={Plaza:[[6,10],[-3,13],[9,-4],[-19,-4]],'Frozen Rink':[[-7,9],[7,9.5],[-9,-12],[17,10]],Rooftops:[[-6,9],[3,15],[-19,7],[14,7]],'Christmas Village':[[-12,2.5],[9.5,0.5],[-6.5,-9],[3.5,-13]],'Jungle Gym':[[-15,14],[17,13],[-17,-15],[19,-13]]};
function makeSnowman(grp,x,z,i){const g=new THREE.Group();g.position.set(x,0,z);grp.add(g);
  const coal=mat(0x1d1a18),carrot=mat(0xff8a3d),stick=mat(0x6b4226),scarfC=mat([0xd83a2e,0x2f6fd0,0x2bb3a8,0xffd84a][i%4]);
  add(new THREE.SphereGeometry(.72,14,10),snowM,0,.62,0,g);add(new THREE.SphereGeometry(.52,14,10),snowM,0,1.5,0,g);add(new THREE.SphereGeometry(.36,14,10),snowM,0,2.16,0,g);
  [-1,1].forEach(s=>{add(new THREE.SphereGeometry(.045,6,5),coal,s*.12,2.22,.32,g);add(new THREE.CylinderGeometry(.03,.03,.9,5),stick,s*.75,1.65,0,g).rotation.z=s*-1.1});
  for(let k=0;k<3;k++)add(new THREE.SphereGeometry(.05,6,5),coal,0,1.35+k*.2,.5-Math.abs(k-1)*.03,g);
  add(new THREE.ConeGeometry(.06,.35,8),carrot,0,2.14,.5,g).rotation.x=PI/2;
  const sc=add(new THREE.TorusGeometry(.36,.07,6,16),scarfC,0,1.9,0,g);sc.rotation.x=PI/2;
  return{g,x,z,up:true,t:0}}
RUNMAPS.forEach(M=>{M.snowmen=(SNOWMEN_AT[M.name]||[]).map(([x,z],i)=>makeSnowman(M.grp,x,z,i))});
const snowmen=()=>runL.snowmen||[];
// snowmen burst into snow: a puff from each body ball, plus a few chunks that tumble out and splat
function knockSnowman(s){s.up=false;snowmanSnow();s.t=T.snow.snowmanRespawn;s.g.visible=false;
  [[.62,16],[1.5,14],[2.16,10]].forEach(([y,n])=>{burst(V(s.x,y,s.z),0xffffff,n);burst(V(s.x,y,s.z),0xdff4ff,Math.round(n/2))});
  for(let i=0;i<5;i++){const a=Math.random()*PI*2,sp=2.5+Math.random()*2.5;
    launchSnowball([s.x,1+Math.random(),s.z,Math.cos(a)*sp,3+Math.random()*3,Math.sin(a)*sp].map(f2),false,'chunk',-1)}
  SFX.splat(true);addTrick('Snowman Down')}
// ----- dizzy stars over a stunned player's head -----
function makeStars(){const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:0xffe066});
  for(let i=0;i<4;i++){const s=new THREE.Mesh(new THREE.OctahedronGeometry(.13,0),m);const a=i/4*PI*2;s.position.set(Math.cos(a)*.5,Math.sin(a*2)*.06,Math.sin(a)*.5);g.add(s)}
  g.visible=false;return g}
const myStars=makeStars();scene.add(myStars);
function dizzy(g,on,x,y,z,dt){g.visible=on;if(on){g.position.set(x,y+2.35,z);g.rotation.y+=dt*7}}

// ---------- aiming and charging (hold Throw) ----------
// dots are sky blue (white would vanish against the snow); gold once charged
const AIM_N=28,aimDotGeo=new THREE.SphereGeometry(.1,8,6),aimM=new THREE.MeshBasicMaterial({color:0x2fb8ff,transparent:true,opacity:.95,depthWrite:false}),
  aimGold=new THREE.MeshBasicMaterial({color:0xffb400,transparent:true,opacity:1,depthWrite:false}),
  aimRing=new THREE.Mesh(new THREE.RingGeometry(.3,.48,24),new THREE.MeshBasicMaterial({color:0x2fb8ff,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));
const aimDots=Array.from({length:AIM_N},()=>{const m=new THREE.Mesh(aimDotGeo,aimM);m.visible=false;scene.add(m);return m});
aimRing.rotation.x=-PI/2;aimRing.visible=false;scene.add(aimRing);keep(aimDotGeo,aimM,aimGold,aimRing.geometry,aimRing.material);aimDots.forEach(m=>keep(m));
function aimStart(){if(!canThrow())return;
  if(SB.ammo<1){SFX.deny();if(!SB.told){SB.told=true;toast('Out of snowballs: grab orbs to refill')}snowFlash('empty');return}
  Object.assign(SB.aim,{on:true,t:0,full:false})}
function aimEnd(fire){if(!SB.aim.on&&!aimRing.visible)return;const full=SB.aim.full;SB.aim.on=false;SB.aim.full=false;aimDots.forEach(m=>m.visible=false);aimRing.visible=false;if(fire)throwSnow(full)}
function updateAim(dt){const A_=SB.aim;if(!A_.on)return;
  if(!canThrow()||SB.ammo<1){aimEnd(false);return}
  if(!(held('throw')||joy.snow)){aimEnd(true);return}
  A_.t+=dt;if(!A_.full&&A_.t>=T.snow.chargeTime){A_.full=true;SFX.ui(6);rumble(80,.2,.5);burst(V(P.position.x,py+1.45,P.position.z),0xffd84a,8)}
  // turn to aim while holding, like the throw does
  const d=inputDir();if(d!==null&&ATK.t<=0)face+=angD(d,face)*Math.min(1,dt*14);
  // trace the arc with the throw's own numbers until it hits something
  const o=throwVec(face),g=T.snow.gravity,mat=A_.full?aimGold:aimM,step=.035,pulse=A_.full?1+.25*Math.sin(tAll*14):1;
  let x=o[0],y=o[1],z=o[2],vx=o[3],vy_=o[4],vz=o[5],n=0,hit=null;
  for(let i=0;i<AIM_N*2&&n<AIM_N;i++){vy_-=g*step;x+=vx*step;y+=vy_*step;z+=vz*step;
    const gh=groundAt(x,z,y+.4).h;if(y<=(isFinite(gh)?gh:0)+.02){hit={x,z,y:isFinite(gh)?gh:0};break}
    if(solidAt(x,y,z)){hit={x,z,y:Math.max(0,y-.2)};break}
    {const m=aimDots[n++];m.visible=true;m.material=mat;m.position.set(x,y,z);m.scale.setScalar((1-n/AIM_N*.45)*pulse)}}
  for(let k=n;k<AIM_N;k++)aimDots[k].visible=false;
  aimRing.visible=!!hit;if(hit){aimRing.position.set(hit.x,hit.y+.04,hit.z);aimRing.material.color.setHex(A_.full?0xffb400:0x2fb8ff);aimRing.scale.setScalar(A_.full?1.35:1)}}
