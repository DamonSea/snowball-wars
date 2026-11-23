// Trick Park mode: PLAY pad, trick combos and scoring, orbs, spikeballs, free roam and timed runs.
// ---------- RUN mode ----------
let orbs=[],runHz=[],runQ=[],runT=0,bestCombo=0,hintTimer=null,runFree=true,runCD=0,padHold=0;
// PLAY pad in the plaza: stand on it in free roam to begin a timed run
const spadG=new THREE.Group();
const rmObj=o=>freeTree(o);
function useRunMap(i){runIdx=i;runL=RUNMAPS[i];try{localStorage.setItem('orbRunMap',i)}catch(e){}if(runL.spad){runL.grp.add(spadG);spadG.position.set(runL.spad.x,0,runL.spad.z)}else if(spadG.parent)spadG.parent.remove(spadG)}
useRunMap(runIdx);
const spadM=new THREE.MeshBasicMaterial({color:0xffcc33,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false});
const spadRing=new THREE.Mesh(new THREE.RingGeometry(1.25,1.7,40),spadM);spadRing.rotation.x=-PI/2;spadRing.position.y=.05;spadG.add(spadRing);
const spadFillM=new THREE.MeshBasicMaterial({color:0xffcc33,transparent:true,opacity:.45,side:THREE.DoubleSide,depthWrite:false});
const spadFill=new THREE.Mesh(new THREE.CircleGeometry(1.2,40),spadFillM);spadFill.rotation.x=-PI/2;spadFill.position.y=.04;spadFill.scale.setScalar(.001);spadG.add(spadFill);
const spadCv=document.createElement('canvas');spadCv.width=512;spadCv.height=160;
const spadTex=new THREE.CanvasTexture(spadCv);
const spadSign=new THREE.Sprite(new THREE.SpriteMaterial({map:spadTex,transparent:true,depthWrite:false}));spadSign.scale.set(3.2,1,1);spadSign.position.y=2.4;spadG.add(spadSign);
function drawSpadSign(){const x=spadCv.getContext('2d');x.clearRect(0,0,512,160);x.fillStyle='rgba(10,32,46,.85)';
  x.beginPath();x.roundRect?x.roundRect(16,16,480,128,40):x.rect(16,16,480,128);x.fill();
  x.fillStyle='#ffd84a';x.font='800 64px "Baloo 2", system-ui, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('PLAY',256,72);
  x.fillStyle='#fff8e8';x.font='600 28px "Baloo 2", system-ui, sans-serif';x.fillText('stand here',256,118);spadTex.needsUpdate=true}
drawSpadSign();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(drawSpadSign);
function freeUI(){const f=mode==='run'&&runFree&&state==='play'&&!!(runL&&runL.spad)&&!WAR.on&&!(typeof TAG!=='undefined'&&TAG.on);document.body.classList.toggle('free',f);spadG.visible=!!(runL&&runL.spad)&&mode==='run'&&runFree&&runCD<=0&&!WAR.on&&!(typeof TAG!=='undefined'&&TAG.on)&&state!=='menu'&&state!=='select'}
const FREE_HINT='Free roam: practice as long as you like. Stand on the PLAY pad (or press Enter / △) to choose Orb Race or Snowball Wars.';
const orbGeo=new THREE.IcosahedronGeometry(.42,0),ringGeo=new THREE.RingGeometry(.55,.75,24);
// ----- trick combos: tricks chain while you stay airborne or land and go again quickly -----
const TR={pts:0,mult:0,names:[],t:0};
function addTrick(n,pts){const p=pts??T.tricks[n]??0;if(mode!=='run'||state!=='play')return;MP.tr={n:MP.tr.n+1,s:n};TR.pts+=p;TR.mult++;TR.names.push(n);if(TR.names.length>4)TR.names.shift();TR.t=T.combo.window;showCombo()}
function showCombo(){const e=$('combo');e.classList.toggle('on',TR.mult>0);if(!TR.mult)return;
  $('cMult').textContent='×'+TR.mult;$('cPts').textContent=TR.pts;$('cNames').textContent=TR.names.join(' + ');
  e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump')}
// ----- named gaps: take off from one region, land in another, no ground in between -----
const GAP={from:null,take:null,wasSup:true,found:{}};
function gapFound(){const k='orbRunGaps_'+runL.key;if(!GAP.found[k]){let a=[];try{a=JSON.parse(localStorage.getItem(k)||'[]')}catch(e){}GAP.found[k]=new Set(Array.isArray(a)?a:[])}return GAP.found[k]}
const gapTotal=()=>runL.gaps?new Set(runL.gaps.map(g=>g.name)).size:0;
const gapText=()=>runL.gaps?` Gaps found: ${gapFound().size}/${gapTotal()}.`:'';
const inReg=(p,r)=>(r.y1!==undefined?p.y>r.y-.6&&p.y<r.y1+.6:Math.abs(p.y-r.y)<.6)&&   // y1: a sloped region (roofs) spans y..y1
  Math.abs(p.x-r.x)<=r.w/2+.3&&Math.abs(p.z-r.z)<=r.d/2+.3;
function trackGaps(){
  if(!runL.gaps)return;
  const sup=grounded||(CL.on&&CL.top),here={x:P.position.x,z:P.position.z,y:py};
  if(sup&&!GAP.wasSup&&GAP.take){
    for(const g of runL.gaps){const fr=g.from.find(r=>inReg(GAP.take,r)),to=fr&&g.to.find(r=>inReg(here,r));
      if(fr&&to&&fr!==to){awardGap(g);break}}
    GAP.take=null}
  if(!sup&&GAP.wasSup)GAP.take=GAP.from;
  if(sup)GAP.from=here;
  GAP.wasSup=sup;
}
function awardGap(g){addTrick(g.name,g.pts);const F=gapFound();
  if(!F.has(g.name)){F.add(g.name);try{localStorage.setItem('orbRunGaps_'+runL.key,JSON.stringify([...F]))}catch(e){}
    toast(`New gap! ${g.name} · ${F.size}/${gapTotal()} found`);SFX.unlock()}}
function popScore(t,bad){const e=$('cPop');e.textContent=t;e.classList.toggle('bad',!!bad);e.classList.remove('go');void e.offsetWidth;e.classList.add('go')}
function bankCombo(){if(!TR.mult)return;const total=TR.pts*TR.mult;score+=total;bestCombo=Math.max(bestCombo,total);
  popScore(TR.mult>1?`+${total}  (${TR.pts} × ${TR.mult})`:`+${total}`);if(TR.mult>=3)SFX.ready();Object.assign(TR,{pts:0,mult:0,names:[],t:0});showCombo();hud()}
function dropCombo(){if(!TR.mult)return;popScore('Combo dropped',true);Object.assign(TR,{pts:0,mult:0,names:[],t:0});showCombo()}
const inPlat=(x,z,m)=>runL.plats.some(p=>p.top>.5&&(p.bot===undefined||p.bot<1.8)&&!p.roller&&inside(p,x,z,m));
function freeSpot(minP=4){for(let t=0;t<80;t++){const a=Math.random()*PI*2,r=Math.sqrt(Math.random())*24,x=Math.cos(a)*r,z=Math.sin(a)*r;
  if(!inPlat(x,z,1.3)&&runL.advCol.every(c=>Math.hypot(c.x-x,c.z-z)>c.r+1.4)&&Math.hypot(P.position.x-x,P.position.z-z)>minP)return{x,z}}return{x:0,z:5}}
function pickSpot(){const pool=runL.spots.filter(s=>(chars[ci].acro||s.any)&&!orbs.some(o=>o.spot===s)&&Math.hypot(s.x-P.position.x,s.z-P.position.z)>5);
  if(!pool.length||Math.random()<.35){const g=freeSpot(5);return{x:g.x,z:g.z,y:0,v:100,rand:1}}return pool[Math.floor(Math.random()*pool.length)]}
function spawnOrb(){const gold=++spawnCount%T.run.goldEvery===0,s=pickSpot();makeOrb(s,gold,mkId('o'+(++orbSeq)))}
function makeOrb(s,gold,id){const col=orbCol(gold);
  const g=new THREE.Group();g.position.set(s.x,s.y,s.z);runL.grp.add(g);
  const m=orbBody(gold);g.add(m);   // Crystal, Donuts, Stars... (orbskins.js)
  const ring=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.45,side:THREE.DoubleSide}));ring.rotation.x=-PI/2;ring.position.y=.03;ring.visible=!s.air;g.add(ring);
  if(s.v>=200&&!s.rand){const b=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,14,6,1,true),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.18,depthWrite:false,blending:THREE.AdditiveBlending}));b.position.y=7;g.add(b)}
  orbs.push({g,m,ring,gold,col,t:Math.random()*6,spot:s.rand?null:s,y:s.y,v:gold?T.run.goldValue:s.v,id,beam:s.v>=200&&!s.rand})}
// enemies: winter crew or classic spikeballs (see enemies.js)
function spawnRunHz(kind=pickKind()){const f=makeFoe(kind,runL.grp),{x,z}=freeSpot(12);f.g.position.set(x,kind==='spike'?.75:0,z);const a=Math.random()*PI*2,sp=kind==='spike'?T.run.hazardSpeed+runT*T.run.hazardSpeedUp:0;
  runHz.push(Object.assign(f,{vx:Math.cos(a)*sp,vz:Math.sin(a)*sp,id:mkId('h'+(++hzSeq)),st:'walk',t:1+Math.random()*2,face:a,wa:a,cool:2+Math.random()*2,robbed:0,mine:0}))}
function resetRun(){if(WAR.on)warsStop(false);raceStop();tagStop(false);[...orbs,...runHz].forEach(o=>rmObj(o.g));orbs=[];runHz=[];runQ=[];ATK.t=0;spawnCount=0;score=0;time=T.run.time;runT=0;bestCombo=0;lives=3;invuln=0;resetAcro();
  ({plats,advCol}=runL);clearSnow();Object.assign(GAP,{from:null,take:null,wasSup:true});CL.on=false;CL.top=false;stand=null;iceV.set(0,0,0);onIce=false;Object.assign(TR,{pts:0,mult:0,names:[],t:0});showCombo();
  P.position.set(0,0,0);vel.set(0,0,0);vy=py=0;grounded=true;
  if(runL.custom){const s=runL.spawn;P.position.set(s.x,0,s.z);py=s.y||0;if(s.x||s.z)face=Math.atan2(-s.x,-s.z)}   // custom maps: start on the spawn point, facing the middle
  frReset();
  for(let i=0;i<T.run.orbsOnField;i++)spawnOrb();if(foesOn())for(let i=0;i<T.run.hazardsStart;i++)spawnRunHz();spawnRollers()}
const foesOn=()=>!(runL&&runL.opt&&!runL.opt.enemies);
function startRun(free=true){mode='run';setWorld('run');resetRun();runFree=free;runCD=0;padHold=0;state='play';overlay(false);hud();SFX.start();freeUI();renderControls();
  hint('')}
// from free roam: keep Flip where he is, reset the board, count down 3-2-1, then the clock starts
function beginTimed(o={}){if(mode!=='run'||!runFree||runCD>0||state!=='play'||WAR.on||TAG.on)return;if(!runL.spad){toast('This map has no orb run.');return}
  runFree=false;runCD=3;popScore('3');SFX.ui(3);padHold=0;score=0;time=T.run.time;runT=0;bestCombo=0;lives=3;Object.assign(TR,{pts:0,mult:0,names:[],t:0});showCombo();
  if(!MP.client){orbs.forEach(o=>rmObj(o.g));orbs=[];spawnCount=0;for(let i=0;i<T.run.orbsOnField;i++)spawnOrb();
  runHz.forEach(h=>rmObj(h.g));runHz=[];runQ=[]}
  raceStart({id:o.id,join:!!o.id});if(o.time){time=o.time;runCD=1.5}   // orbrace.js: friends join, or computer rivals
  hint('');if(o.by)toast(`${o.by} started an orb race!`);hud();freeUI();renderControls()}
function backToFree(){startRun(true)}
// the PLAY pad (or △ / Enter in free roam): pick a mode. With only one on offer, just start it.
let padLock=false;
function modeMenu(){if(state!=='play'||mode!=='run'||!runFree||runCD>0||WAR.on||TAG.on)return;
  const solo=!warPeers().length,O=[];
  if(runL.spad)O.push(['Orb Race',()=>{resume();beginTimed()},`<b>Orb Race</b> \u00b7 60 seconds of orb grabbing${solo&&RACE.rivals?' vs '+RACE.rivals+' computer rival'+(RACE.rivals>1?'s':''):''}`]);
  if(canWar())O.push(['Snowball Wars',()=>{resume();startWars()},`<b>Snowball Wars</b> \u00b7 3-minute snowball fight${solo?' vs 3 computer players':''}`]);
  if(canTag())O.push(['Tag',()=>{resume();startTag()},`<b>Tag</b> \u00b7 2 minutes; least time as It wins${solo?' (vs 3 computer players)':''}`]);
  if(!O.length)return;if(O.length===1){O[0][1]();return}
  state='paused';SFX.ui(2);const g=k=>O[k]||['',null];
  overlay(true,'Choose a mode','',g(0)[0],g(1)[0],g(0)[1],g(1)[1],g(2)[0]||'Cancel',g(2)[1]||(()=>resume()),O.length>2?'Cancel':'',O.length>2?()=>resume():null);$('ovP').innerHTML=O.map(o=>o[2]).join('<br>');$('ov').classList.add('menu','pausem')}
// time's up (or out of lives): show the result and keep playing right where you are, back in free roam
function endRun(){bankCombo();const rr=RACE.on?raceResult():null;const bk=runL.key,fin=score,nb=fin>(bestR[bk]||0);if(nb){bestR[bk]=fin;try{localStorage.setItem(bk,fin)}catch(e){}}
  beep(220,.4,'sawtooth',.08);const why=lives<=0?(FOE_STYLE==='spike'?'Spiked!':'Wiped out!'):'Time\u2019s up!';
  toFreeInPlace();popScore(why);const msg=`${why} ${rr?rr.text+' \u00b7 ':''}Score ${fin} \u00b7 best combo ${bestCombo}${nb?' \u00b7 New best!':''}`;hint(msg)}
function updateRun(dt){
  advT+=dt;
  if(runCD>0){const a=Math.ceil(runCD);runCD-=dt;const b=Math.ceil(runCD);
    if(b!==a&&b>=1&&b<=2){popScore(String(b));SFX.ui(b)}
    if(runCD<=0){runCD=0;popScore('GO!');SFX.start();hint('');lives=3;if(!MP.client&&foesOn())for(let i=0;i<T.run.hazardsStart;i++)spawnRunHz();freeUI();hud()}}
  else if(!runFree){const shown=Math.ceil(time);time-=dt;runT+=dt;if(time<=0){time=0;hud();endRun();return}if(Math.ceil(time)!==shown)hud()}
  else if(runL.spad&&!WAR.on&&!TAG.on){ // free roam: PLAY pad
    const on=grounded&&py<.3&&Math.hypot(P.position.x-runL.spad.x,P.position.z-runL.spad.z)<1.6;if(!on)padLock=false;   // step off to use it again
    padHold=on?padHold+dt:Math.max(0,padHold-dt*2);spadFill.scale.setScalar(Math.max(.001,Math.min(1,padHold/.8)));
    spadM.opacity=.45+Math.sin(advT*4)*.15+(on?.3:0);if(padHold>=.8&&!padLock){padHold=0;padLock=true;modeMenu()}}
  stepBody(dt,T.speed.trickPark);frUpdate(dt);if(state!=='play')return;
  const r=Math.hypot(P.position.x,P.position.z);if(r>ARENA){P.position.x*=ARENA/r;P.position.z*=ARENA/r}
  trackGaps();
  // combo window only runs down while you're on the ground
  if(TR.mult){if(grounded&&ATK.t<=0)TR.t-=dt;if(TR.t<=0)bankCombo()}
  if(runHz.some(h=>h.dead))runHz=runHz.filter(h=>!h.dead);
  if(MP.client)syncFromHost();else hostClaims();
  for(const o of [...orbs]){
    if(Math.hypot(o.g.position.x-P.position.x,o.g.position.z-P.position.z)<1.15&&Math.abs(py-o.y)<1.7){
      burst(o.m.getWorldPosition(V(0,0,0)),o.col||(o.gold?0xffcc33:0x5ff3ff));if(o.gold)time+=T.run.goldBonusTime;gainSnow(o.gold);
      if(TR.mult){TR.pts+=o.v;TR.t=Math.max(TR.t,T.combo.orbExtend);showCombo()}else{score+=o.v;popScore('+'+o.v)}
      SFX.orb(o.gold);rmObj(o.g);orbs.splice(orbs.indexOf(o),1);if(MP.client){MP.gone.add(o.id);claim('o',o.id)}else if(!o.spill)spawnOrb();hud()}
  }
  if(MP.client){const k=1-Math.exp(-12*dt);
    for(const h of runHz){if(h.dead)continue;const p=h.g.position,ox=p.x,oz=p.z;p.x+=(h.tx-p.x)*k;p.z+=(h.tz-p.z)*k;if(h.kind==='spike')roll(h.g,(p.x-ox)/dt,(p.z-oz)/dt,dt);else foeAnim(h,dt);
      h.robbed=Math.max(0,(h.robbed||0)-dt);const how=foeHit(h)?'hit':foeStomp(h)?'stomp':null;
      if(how){killFoe(h,how);h.dead=true;rmObj(h.g);MP.gone.add(h.id);claim('k',h.id);continue}
      const c=foeTouch(h);if(c==='steal')impSteal(h);
      else if(c==='hurt'&&!invuln){dropCombo();hurt(p.x,p.z,14);if(lives<=0){if(FR.on&&runFree&&!FR.done){frRespawn('Out of lives: back to your checkpoint.')}else if(runFree||runCD>0){lives=3;hud()}else{endRun();return}}}}
    return}
  const want=!foesOn()||runCD>0||WAR.on||TAG.on?0:runFree?T.run.hazardsFree:Math.min(T.run.hazardsStart+Math.floor(runT/T.run.hazardEvery),T.run.hazardsMax);while(runHz.length+runQ.length<want)spawnRunHz();
  for(let i=runQ.length-1;i>=0;i--){runQ[i]-=dt;if(runQ[i]<=0){runQ.splice(i,1);spawnRunHz()}}
  for(const h of runHz){if(h.dead)continue;
    const p=h.g.position,ox=p.x,oz=p.z;
    if(h.kind!=='spike')foeThink(h,dt);
    if(h.escape){foeFx(h);if(h.mine>0)toast('The imp got away with your snowballs!');h.dead=true;rmObj(h.g);runQ.push(T.run.smashRespawn);continue}
    p.x+=h.vx*dt;if(inPlat(p.x,p.z,.7)){p.x=ox;h.vx*=-1;if(h.kind==='goon')h.t=Math.min(h.t,.2)}
    p.z+=h.vz*dt;if(inPlat(p.x,p.z,.7)){p.z=oz;h.vz*=-1;if(h.kind==='goon')h.t=Math.min(h.t,.2)}
    const r=Math.hypot(p.x,p.z);
    if(r>ARENA-.5){const nx=p.x/r,nz=p.z/r,d=h.vx*nx+h.vz*nz;if(d>0){h.vx-=2*d*nx;h.vz-=2*d*nz}p.x=nx*(ARENA-.5);p.z=nz*(ARENA-.5)}
    const n=pushOut(p,.7,runL.advCol);if(n){const d=h.vx*n.x+h.vz*n.z;if(d<0){h.vx-=2*d*n.x;h.vz-=2*d*n.z}}
    if(h.kind==='spike')roll(h.g,h.vx,h.vz,dt);else{if(h.st==='slide')h.face=Math.atan2(h.vx,h.vz);foeAnim(h,dt)}
    h.robbed=Math.max(0,(h.robbed||0)-dt);h.hurtT=Math.max(0,(h.hurtT||0)-dt);const how=foeHit(h)?'hit':foeStomp(h)?'stomp':null;
    if(how&&angerPenguin(h,how))continue;
    if(how){killFoe(h,how);h.dead=true;rmObj(h.g);runQ.push(T.run.smashRespawn);continue}
    const c=foeTouch(h);if(c==='steal')impSteal(h);
    else if(c==='hurt'&&!invuln){if(h.kind==='penguin'&&h.st==='slide'){h.st='dizzy';h.t=T.foes.penguinDizzy;h.vx=h.vz=0}dropCombo();hurt(p.x,p.z,14);if(lives<=0){if(FR.on&&runFree&&!FR.done){frRespawn('Out of lives: back to your checkpoint.')}else if(runFree||runCD>0){lives=3;hud()}else{endRun();return}}}
  }
}
