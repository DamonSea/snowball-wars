// Orb Race: the timed orb run, made competitive.
// - With friends on the map, starting an orb run pulls everyone there into the same run (presence: `or`),
//   racing for the shared orbs.
// - Getting hit by a snowball during a run knocks up to T.race.spill of your points loose as orbs that land
//   around you, free for anyone to grab. The host makes those orbs; other players ask for them (presence: `sp`).
// - Alone, computer rivals (Settings > Orb run rivals) race you for the ground orbs and throw snowballs at you.
const RACE={on:false,id:'',bots:[],spSeq:0,sp:[],spSeen:new Set(),done:new Set(),tick:0,rivals:2};
try{const v=localStorage.getItem('orbRunRivals');if(v!==null&&[0,1,2].includes(+v))RACE.rivals=+v}catch(e){}
function setRivals(n){RACE.rivals=n;try{localStorage.setItem('orbRunRivals',String(n))}catch(e){}}
const raceLive=()=>RACE.on&&mode==='run'&&!runFree;

// ---------- start / stop (beginTimed, toFreeInPlace and resetRun call these) ----------
function raceStart(o={}){raceStop();const peers=warPeers().length;
  RACE.id=o.id||(MP.me?MP.me.slice(-4):'s')+'-r'+Date.now().toString(36);RACE.sp=[];RACE.spSeen.clear();
  const n=o.join||peers?0:RACE.rivals;RACE.bots=[];for(let k=0;k<n;k++){const b=makeBot(k);b.key='rb'+k;b.cool=3+Math.random()*2;RACE.bots.push(b)}
  RACE.on=!!(o.join||peers||n);if(RACE.on){$('warsBoard').classList.add('on');raceBoard()}}
function raceStop(){if(RACE.id)RACE.done.add(RACE.id);RACE.bots.forEach(b=>freeTree(b.a.g));RACE.bots=[];
  if(RACE.on&&!WAR.on)$('warsBoard').classList.remove('on');RACE.on=false}
// standings: you, rivals, friends in the same run
function raceRows(){const r=[{name:'You',score,me:1}];RACE.bots.forEach(b=>r.push({name:b.name,score:b.score}));
  for(const p of warPeers()){const w=p.presence.or;if(Array.isArray(w)&&w[0]===RACE.id)r.push({name:nameOf(p),score:Number.isFinite(p.presence.sc)?Math.floor(p.presence.sc):0})}
  return r.sort((a,b)=>b.score-a.score||(b.me?1:0)-(a.me?1:0))}
function raceBoard(){const e=$('warsBoard');if(!e||!RACE.on)return;
  e.innerHTML=`<div class="wbt">${runCD>0?'Orb race':fmtClock(time)}</div>`+raceRows().map(r=>`<div class="wbr nohp${r.me?' me':''}"><b>${warEsc(r.name)}</b><span>${r.score}</span></div>`).join('')}
// the end-of-run line ("1st of 3 · ...")
function raceResult(){const rows=raceRows(),pl=rows.findIndex(r=>r.me)+1;return{place:pl,of:rows.length,
  text:`${pl===1?'You win the race!':`${pl}${['st','nd','rd'][pl-1]||'th'} of ${rows.length}.`} `+rows.filter(r=>!r.me).map(r=>`${r.name} ${r.score}`).join(', ')}}

// ---------- knocked-loose orbs ----------
// scatter n orbs worth T.race.spillOrb each around (x,z): host only (clients ask through presence)
function spawnSpill(x,z,y0,n){for(let i=0;i<n;i++){let sx=x,sz=z;
    for(let t=0;t<12;t++){const a=Math.random()*PI*2,r=1.7+Math.random()*1.3;sx=x+Math.cos(a)*r;sz=z+Math.sin(a)*r;if(!inPlat(sx,sz,.4))break}
    const g=groundAt(sx,sz,y0+.5).h;makeOrb({x:sx,y:isFinite(g)?g:0,z:sz,v:T.race.spillOrb,rand:1},false,mkId('s'+(++orbSeq)));
    const o=orbs[orbs.length-1];o.spill=true;burst(V(sx,(isFinite(g)?g:0)+1,sz),o.col,6)}}
function dropOrbs(x,z,y0,amt){const n=Math.floor(amt/T.race.spillOrb);if(n<1)return;
  if(!MP.client)spawnSpill(x,z,y0,n);else{RACE.sp.push([++RACE.spSeq,f2(x),f2(z),n]);if(RACE.sp.length>4)RACE.sp.shift()}}
// how much a hit knocks loose
const spillOf=s=>Math.min(Math.floor(Math.max(0,s)/T.race.spillOrb)*T.race.spillOrb,T.race.spill);
// I got hit by a snowball during a run
function raceHitMe(){if(mode!=='run'||runFree||runCD>0)return;const amt=spillOf(score);if(amt<=0)return;
  score-=amt;popScore('-'+amt,true);toast(`Knocked ${amt} points loose. Grab them back!`);dropOrbs(P.position.x,P.position.z,py,amt);hud()}
// host: make the orbs other players asked for
function hostSpills(){if(!MP.room||MP.client)return;
  for(const p of warPeers()){const sp=p.presence.sp;if(!Array.isArray(sp))continue;
    for(const s of sp){if(!Array.isArray(s)||!s.slice(0,4).every(Number.isFinite))continue;const k=p.peer+':'+s[0];if(RACE.spSeen.has(k))continue;RACE.spSeen.add(k);
      const n=Math.max(0,Math.min(Math.floor(s[3]),Math.floor(T.race.spill/T.race.spillOrb)));if(n&&Math.hypot(s[1],s[2])<60)spawnSpill(s[1],s[2],0,n)}}}

// ---------- computer rivals ----------
// a snowball of mine reached a rival? it loses points as orbs (no hearts here)
function raceCatch(p,ball){if(!raceLive()||!ball.own)return false;
  for(const b of RACE.bots){if(Math.hypot(b.x-p.x,b.z-p.z)>.75||p.y<b.y||p.y>b.y+2.1)continue;
    if(b.stun>T.snow.stun-.4)return true;
    const d=Math.hypot(ball.vx,ball.vz)||1;b.vx=ball.vx/d*T.snow.hitKnock;b.vz=ball.vz/d*T.snow.hitKnock;b.vy=T.snow.hitLift;b.stun=T.snow.stun;b.throwT=0;b.goal=null;SFX.hurt();
    const amt=spillOf(b.score);if(amt>0){b.score-=amt;spawnSpill(b.x,b.z,b.y,amt/T.race.spillOrb);toast(`${b.name} dropped ${amt} points!`)}else addTrick('Direct Hit');
    return true}
  return false}
function rivalThink(b,dt){
  // chase the nearest ground orb (the ones up high are yours), switching if someone grabs it
  if(!b.goal||!orbs.includes(b.goal)||(b.retarget-=dt)<=0){b.retarget=1.2+Math.random();let best=null,bd=1e9;
    for(const o of orbs){if(o.y>.6)continue;const d=Math.hypot(o.g.position.x-b.x,o.g.position.z-b.z)+(RACE.bots.some(q=>q!==b&&q.goal===o)?8:0)+(o.gold?-4:0);if(d<bd){bd=d;best=o}}
    b.goal=best}
  const g=b.goal;if(g){b.tx=g.g.position.x;b.tz=g.g.position.z}
  else if((b.idle=(b.idle||0)-dt)<=0){b.idle=1.5+Math.random();const a=Math.random()*PI*2,r=5+Math.random()*3;b.tx=P.position.x+Math.cos(a)*r;b.tz=P.position.z+Math.sin(a)*r}   // nothing to chase: come after you
  const ex=b.tx-b.x,ez=b.tz-b.z,el=Math.hypot(ex,ez),sp=el>.3&&b.throwT<=0?T.race.botSpeed:0,k=1-Math.exp(-8*dt);
  b.vx+=((el?ex/el:0)*sp-b.vx)*k;b.vz+=((el?ez/el:0)*sp-b.vz)*k;
  if(Math.hypot(b.vx,b.vz)>.5&&b.throwT<=0)b.face+=angD(Math.atan2(b.vx,b.vz),b.face)*Math.min(1,dt*10);
  // grab it
  if(g&&Math.hypot(g.g.position.x-b.x,g.g.position.z-b.z)<1.1&&Math.abs(g.y-b.y)<1.5){b.score+=g.v;burst(g.m.getWorldPosition(V(0,0,0)),g.col,8);
    rmObj(g.g);orbs.splice(orbs.indexOf(g),1);if(!g.spill)groundOrb();b.goal=null}
  // and pelt you when you're close (harder when you're ahead)
  const dx=P.position.x-b.x,dz=P.position.z-b.z,dist=Math.hypot(dx,dz);b.cool-=dt;
  if(b.cool<=0&&dist>2.5&&dist<13&&Math.abs(py-b.y)<3.5){b.cool=(score>b.score?2.6:3.8)+Math.random()*2.2;b.throwT=.3;b.face=Math.atan2(dx,dz);
    const fl=dist/T.snow.speed,wob=1.6+dist*.1,tx=P.position.x+vel.x*fl*.6+(Math.random()-.5)*wob,tz=P.position.z+vel.z*fl*.6+(Math.random()-.5)*wob;
    const ox=b.x+Math.sin(b.face)*.5,oy=b.y+1.45,oz=b.z+Math.cos(b.face)*.5,hx=tx-ox,hz=tz-oz,hd=Math.hypot(hx,hz)||1,tt=hd/T.snow.speed;
    launchSnowball([ox,oy,oz,hx/hd*T.snow.speed,(py+1.1-oy+.5*T.snow.gravity*tt*tt)/tt,hz/hd*T.snow.speed].map(f2),false,b.key,++b.seq);SFX.snowThrow()}}
// a rival's grab is replaced on the ground, so there's always something for them to chase
function groundOrb(){const s=freeSpot(5),y=groundAt(s.x,s.z,1).h;makeOrb({x:s.x,y:isFinite(y)?Math.max(0,y):0,z:s.z,v:T.run.groundOrb,rand:1},++spawnCount%T.run.goldEvery===0,mkId('o'+(++orbSeq)))}
function updateRival(b,dt){const a=b.a;a.g.visible=true;
  b.stun=Math.max(0,b.stun-dt);b.throwT=Math.max(0,b.throwT-dt);
  if(b.stun>0){b.vx*=Math.exp(-2.5*dt);b.vz*=Math.exp(-2.5*dt)}else if(runCD<=0)rivalThink(b,dt);else{b.vx*=.8;b.vz*=.8}
  botMove(b,dt);a.stars.visible=b.stun>0;if(b.stun>0){a.stars.position.set(0,2.35,0);a.stars.rotation.y+=dt*7}
  botPose(b,dt);drawTag(a,b.name,b.score,false)}

// ---------- every frame ----------
function raceUpdate(dt){
  if(RACE.on&&(mode!=='run'||runFree||state==='menu'||state==='select'||state==='build')){raceStop();return}
  hostSpills();
  // a friend on this map started an orb run: join it
  if(!RACE.on&&!WAR.on&&!TAG.on&&mode==='run'&&runFree&&runL.spad&&state==='play'&&MP.room&&(RACE.tick+=dt)>.5){RACE.tick=0;
    for(const p of warPeers()){const w=p.presence.or;if(Array.isArray(w)&&typeof w[0]==='string'&&w[0].length<40&&!RACE.done.has(w[0])&&Number.isFinite(w[1])&&w[1]>8){
      beginTimed({id:w[0],time:Math.min(T.run.time,w[1]),by:nameOf(p)});break}}}
  if(!RACE.on||state!=='play')return;
  RACE.bots.forEach(b=>updateRival(b,dt));
  if((RACE.tick+=dt)>.25){RACE.tick=0;raceBoard()}}
