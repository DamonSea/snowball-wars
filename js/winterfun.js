// Winter activities.
//  - Snow angels: Crouch + Ground pound while standing in snow (Nova: Ground pound alone). Fall back, sweep
//    arms and legs, and leave an angel in the snow. Jump to get up early.
//  - Rolling snowballs (Trick Park): small snowballs sit around each map. Walk into one to push it; it grows
//    as it rolls through snow, bowls over enemies and snowmen, and you can stand on a big one. Smash it
//    (attack or ground pound) to start over. Local to your screen in multiplayer.
// ---------- snow angels ----------
const SA={t:0,dec:null,decals:[]};
const angelM=()=>new THREE.MeshBasicMaterial({color:0xb9d0e4,transparent:true,opacity:.75,depthWrite:false});
function canAngel(){return state==='play'&&grounded&&!(stand&&(stand.ice||stand.bounce||stand.roller))&&!CL.on&&!LH.on&&!GP.st&&SB.stun<=0&&ATK.t<=0&&!YS.spray&&YS.t<=0&&SA.t<=0&&A.knock<=0}
function startAngel(){if(!WIN){toast('No snow to make angels in. Try winter.');return}if(!canAngel())return;
  SA.t=T.angel.time;vel.set(0,0,0);A.spd=0;A.mode='normal';SA.done=false;
  // you fall backwards, so the angel lies behind you: head away from where you face
  SA.dec=makeAngel(P.position.x-Math.sin(face)*.8,py,P.position.z-Math.cos(face)*.8,face);SFX.angel()}
function makeAngel(x,y,z,f){const g=new THREE.Group();g.position.set(x,y+.022,z);g.rotation.y=f;scene.add(g);const m=angelM();
  const flat=(geo,px,pz,sx=1,sz=1)=>{const k=new THREE.Mesh(geo,m);k.rotation.x=-PI/2;k.position.set(px,0,pz);k.scale.set(sx,sz,1);g.add(k);return k};
  flat(new THREE.CircleGeometry(.32,20),0,0,.9,2.1);flat(new THREE.CircleGeometry(.24,16),0,-.95);
  const wings=flat(new THREE.CircleGeometry(1.15,28,0,PI),0,-.4),skirt=flat(new THREE.CircleGeometry(.95,24,PI,PI),0,.45);
  const d={g,m,wings,skirt,t:0};SA.decals.push(d);while(SA.decals.length>6){const o=SA.decals.shift();freeTree(o.g)}return d}
function angelMove(dt){ // called from move(): hold still; Jump gets you up early
  vel.set(0,0,0);A.spd=0;if(jumpBuf>0&&SA.t<T.angel.time-.4){SA.t=Math.min(SA.t,.3);jumpBuf=0}else jumpBuf=0}
function angelPhase(){const el=T.angel.time-SA.t,tt=T.angel.time;return{el,lie:Math.min(1,el/.35,SA.t/.35),sweep:el>.35&&SA.t>.35?.5-.5*Math.cos((el-.35)*PI*2.4):0}}
function updateAngels(dt){
  if(SA.t>0){SA.t=Math.max(0,SA.t-dt);const k=angelPhase();if(SA.dec){const sc=Math.min(1,.25+(T.angel.time-SA.t)/T.angel.time*1.1);SA.dec.wings.scale.set(sc,sc,1);SA.dec.skirt.scale.set(sc,sc,1)}
    if(SA.t===0&&!SA.done){SA.done=true;if(T.angel.time-SA.t>1)addTrick('Snow Angel')}}
  for(let i=SA.decals.length-1;i>=0;i--){const d=SA.decals[i];if(d===SA.dec&&SA.t>0)continue;d.t+=dt;d.m.opacity=.75*Math.max(0,Math.min(1,(T.angel.life-d.t)/5));if(d.t>=T.angel.life){freeTree(d.g);SA.decals.splice(i,1)}}}
function clearAngels(){SA.t=0;SA.decals.forEach(d=>freeTree(d.g));SA.decals=[];SA.dec=null}
// ---------- rolling snowballs ----------
const RS={list:[],pushing:false};
const rollGeo=new THREE.SphereGeometry(1,18,14),rollM=new THREE.MeshStandardMaterial({color:0xf6f9fc,roughness:.95});
function makeRoller(x,z){const m=new THREE.Mesh(rollGeo,rollM);m.castShadow=true;runL.grp.add(m);
  const b={m,x,z,sx:x,sz:z,r:T.roll.r0,vx:0,vz:0,giant:false,plat:{k:'c',x,z,r:0,top:0,roller:true}};runL.plats.push(b.plat);syncRoller(b);RS.list.push(b);return b}
function syncRoller(b){b.m.position.set(b.x,b.r,b.z);b.m.scale.setScalar(b.r);Object.assign(b.plat,{x:b.x,z:b.z,r:b.r*.72,top:b.r*1.92})}
function removeRoller(b){rmObj(b.m);const L=runL.plats,i=L.indexOf(b.plat);if(i>=0)L.splice(i,1);RS.list.splice(RS.list.indexOf(b),1)}
function clearRollers(){[...RS.list].forEach(b=>{b.m.parent&&b.m.parent.remove(b.m);for(const M of RUNMAPS){const i=M.plats.indexOf(b.plat);if(i>=0)M.plats.splice(i,1)}});RS.list=[]}
function spawnRollers(){clearRollers();if(mode!=='run')return;const spots=runL.rollers||[0,1,2].map(()=>{const s=freeSpot(6);return[s.x,s.z]});spots.forEach(([x,z])=>makeRoller(x,z))}
function rollerHitsFoe(b,h){const p=h.g.position,k=FOE[h.kind]||FOE.spike;return Math.hypot(p.x-b.x,p.z-b.z)<b.r+k.r*.55&&foeBase(h)<b.r*1.6}
function updateRollers(dt){RS.pushing=false;if(mode!=='run'||state!=='play')return;const R_=T.roll,[ix,iz]=rawInput(),im=Math.hypot(ix,iz);
  for(const b of [...RS.list]){
    // push: walk into it
    const dx=b.x-P.position.x,dz=b.z-P.position.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d;
    if(grounded&&stand!==b.plat&&py<b.r*1.5&&d<b.r*.72+T.wallMargin+.5&&im>.3){const dot=(ix*ux+iz*uz)/im;
      if(dot>.45){const sp=R_.push*dot*Math.min(1,im),k=1-Math.exp(-6*dt);b.vx+=(ux*sp-b.vx)*k;b.vz+=(uz*sp-b.vz)*k;RS.pushing=true}}
    const ice=!!(groundAt(b.x,b.z,.3).on||{}).ice,fr=ice?R_.iceFriction:R_.friction;b.vx*=Math.exp(-fr*dt);b.vz*=Math.exp(-fr*dt);
    const sp=Math.hypot(b.vx,b.vz);if(sp<.02){b.vx=b.vz=0;continue}
    const ox=b.x,oz=b.z,rr=b.r*.75;
    b.x+=b.vx*dt;if(inPlat(b.x,b.z,rr)||Math.hypot(b.x,b.z)>ARENA-b.r){b.x=ox;b.vx*=-R_.bounce}
    b.z+=b.vz*dt;if(inPlat(b.x,b.z,rr)||Math.hypot(b.x,b.z)>ARENA-b.r){b.z=oz;b.vz*=-R_.bounce}
    for(const o of RS.list)if(o!==b){const ex=b.x-o.x,ez=b.z-o.z,ed=Math.hypot(ex,ez),mn=(b.r+o.r)*.85;if(ed<mn&&ed>0){b.x=o.x+ex/ed*mn;b.z=o.z+ez/ed*mn;b.vx*=-R_.bounce;b.vz*=-R_.bounce}}
    const n=pushOut(b,rr,runL.advCol);if(n){const q=b.vx*n.x+b.vz*n.z;if(q<0){b.vx-=2*q*n.x*.7;b.vz-=2*q*n.z*.7}}
    // grow while rolling through snow
    const moved=Math.hypot(b.x-ox,b.z-oz);if(WIN&&!ice&&b.r<R_.rMax){b.r=Math.min(R_.rMax,b.r+moved*R_.grow);if(b.r>=R_.rMax&&!b.giant){b.giant=true;addTrick('Giant Snowball');toast('Giant snowball!')}}
    const ax=V(b.vz/sp,0,-b.vx/sp);b.m.rotateOnWorldAxis(ax,moved/b.r);if(sp>2&&Math.random()<.3)burst(V(b.x,.1,b.z),0xffffff,1);syncRoller(b);
    // bowl things over
    if(sp>R_.bowl){for(const h of runHz)if(!h.dead&&rollerHitsFoe(b,h)){foeFx(h);h.dead=true;rmObj(h.g);addTrick('Bowled Over');if(MP.client){MP.gone.add(h.id);claim('k',h.id)}else runQ.push(T.run.smashRespawn)}
      for(const s of snowmen())if(s.up&&Math.hypot(s.x-b.x,s.z-b.z)<b.r+.6)knockSnowman(s);
      if(CPU.on&&CPU.stun<=0&&Math.hypot(CPU.x-b.x,CPU.z-b.z)<b.r+.6)cpuKnock(CPU.x-b.x,CPU.z-b.z,false)}}
  // smash one (attack, kick, ground pound) to start it over from a small ball
  for(const b of [...RS.list]){if(b.r<=.5)continue;const qx=P.position.x-b.x,qz=P.position.z-b.z,qd=Math.hypot(qx,qz)||1;   // the point on its surface facing you
    if(!attackHits(V(b.x+qx/qd*b.r*.8,b.r,b.z+qz/qd*b.r*.8),0))continue;[[.3,14],[b.r,18],[b.r*1.7,10]].forEach(([y,n])=>burst(V(b.x,y,b.z),0xffffff,n));SFX.splat(true);
    const{sx,sz}=b;removeRoller(b);makeRoller(sx,sz)}}
