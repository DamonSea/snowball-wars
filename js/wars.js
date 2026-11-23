// Snowball Wars: a timed free-for-all snowball fight in Trick Park (pause menu > Snowball Wars).
// Everyone has 3 hearts. A hit scores 100 (200 for a Trick Shot: thrown mid-air or mid-trick), the hit
// that takes someone's last heart scores a KO bonus, and they respawn a few seconds later. Snow piles
// refill your snowballs. Alone you play against computer players; with friends on the map it's players
// only, and starting a match pulls everyone on that map into it (they join through presence: `wm`).
const WAR={on:false,id:'',t:0,cd:0,hp:3,score:0,hits:0,kos:0,downs:0,out:0,inv:0,bots:[],piles:[],refill:0,regen:0,
  done:new Set(),tick:0,by:'',lastBy:''};
SB.trickIds=new Set();
// knocked out: flat on your back, arms and legs splayed. [hip pitch,yaw,roll, root y, squash, legL x,z, legR x,z, armL x,z, armR x,z, head x,y,z]
const KO_Q=[-1.52,null,0,-.62,1,.5,.25,.3,-.3,-.4,-1.35,-.2,1.35,.35,.25,0];
const koBlend=t=>{const k=Math.min(1,Math.max(0,t/.38));return k*k*(3-2*k)};   // ease into the fall
// dizzy stars over a fallen fighter's face (their head is about a body-length behind their feet)
function koStars(g,x,y,z,f,dt){g.visible=true;g.position.set(x-Math.sin(f)*.95,y+.55,z-Math.cos(f)*.95);g.rotation.y+=dt*7}
const BOT_DEF=[{name:'Sleet',ch:3,of:1},{name:'Flurry',ch:5,of:1},{name:'Drift',ch:2,of:2}];
const warName=k=>k==='me'?'You':k.startsWith('bot')?(WAR.bots[+k.slice(3)]||{}).name||'Computer':'Player';
const warEsc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtClock=s=>{s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};

// ---------- start / stop ----------
const warPeers=()=>MP.room?MP.room.peers().filter(p=>!p.sameTab&&p.presence&&Array.isArray(p.presence.p)):[];
function canWar(){return mode==='run'&&runFree&&!(FR.on&&!FR.done)&&(state==='play'||state==='paused')}
function startWars(o={}){if(!canWar()&&!WAR.on)return;if(WAR.on)warsStop(false);
  if(state==='paused'){state='play';overlay(false)}
  const W=T.wars;Object.assign(WAR,{on:true,id:o.id||(MP.me?MP.me.slice(-4):'s')+'-'+Date.now().toString(36),t:o.time||W.time,cd:o.time?1.2:3,hp:W.hp,score:0,hits:0,kos:0,downs:0,out:0,inv:0,refill:0,regen:0,by:o.by||'',lastBy:''});
  SB.trickIds.clear();
  // clear the field: no orbs or enemies in a snowball fight
  if(!MP.client){orbs.forEach(q=>rmObj(q.g));orbs=[];runHz.forEach(h=>rmObj(h.g));runHz=[];runQ=[]}
  dropCombo();SB.ammo=T.snow.ammo;snowHud();score=0;
  makePiles();freeUI();
  const bots=o.bots!==undefined?o.bots:(warPeers().length?0:W.bots);WAR.bots=[];for(let k=0;k<bots;k++)WAR.bots.push(makeBot(k));
  $('warsBoard').classList.add('on');hint('');if(o.by)toast(`${o.by} started Snowball Wars!`);
  SFX.start();hud();warsBoard()}
function warsStop(restore=true){if(!WAR.on)return;WAR.on=false;if(WAR.id)WAR.done.add(WAR.id);
  WAR.bots.forEach(b=>freeTree(b.a.g));WAR.bots=[];WAR.piles.forEach(p=>freeTree(p.g));WAR.piles=[];
  $('warsBoard').classList.remove('on');freeUI();SB.stun=0;score=0;lives=3;
  if(restore&&mode==='run'&&!MP.client&&!orbs.length){spawnCount=0;for(let i=0;i<T.run.orbsOnField;i++)spawnOrb()}   // enemies come back on their own (updateRun)
  hud()}
function warsEnd(){const rows=standings(),me=rows.findIndex(r=>r.me),place=me+1,W=WAR.score;
  const bk='warsBest_'+runL.key,best=+(localStorage.getItem(bk)||0),nb=W>best;if(nb)try{localStorage.setItem(bk,W)}catch(e){}
  const top=rows[0]&&rows[0].score,tied=rows.filter(r=>r.score===top).length>1;
  const title=place===1?(tied?'Tied for first!':'You win!'):`${place}${['st','nd','rd'][place-1]||'th'} place`;
  const fin={rows,stats:`${WAR.hits} hits · ${WAR.kos} KOs · knocked out ${WAR.downs}×${nb?' · New best!':''}`};
  warsStop(true);state='over';SFX[place===1?'start':'ui'](3);
  overlay(true,title,'','Play again','Keep playing',()=>{state='play';overlay(false);startWars()},()=>{state='play';overlay(false)});
  hint('');$('ov').classList.add('wres');
  $('ovP').innerHTML=`<ol class="warsres">${fin.rows.map(r=>`<li class="${r.me?'me':''}"><b>${warEsc(r.name)}</b><span>${r.score}</span></li>`).join('')}</ol><small>${fin.stats}</small>`}
// everyone in the match, best first
function standings(){const r=[{name:'You',score:WAR.score,hp:WAR.out>0?0:WAR.hp,me:1}];
  WAR.bots.forEach(b=>r.push({name:b.name,score:b.score,hp:b.out>0?0:b.hp}));
  for(const p of warPeers()){const w=p.presence.wm;if(Array.isArray(w)&&w[0]===WAR.id)r.push({name:nameOf(p),score:Number.isFinite(p.presence.sc)?Math.floor(p.presence.sc):0,hp:Number.isInteger(w[2])?w[2]:3})}
  return r.sort((a,b)=>b.score-a.score||(b.me?1:0)-(a.me?1:0))}
function warsBoard(){const e=$('warsBoard');if(!e)return;
  e.innerHTML=`<div class="wbt">${WAR.cd>0?'Get ready':fmtClock(WAR.t)}</div>`+standings().map(r=>`<div class="wbr${r.me?' me':''}"><b>${warEsc(r.name)}</b><i>${'♥'.repeat(Math.max(0,r.hp))}<s>${'♥'.repeat(Math.max(0,T.wars.hp-r.hp))}</s></i><span>${r.score}</span></div>`).join('')}

// ---------- snow piles: stand on one to refill ----------
function makePiles(){WAR.piles.forEach(p=>freeTree(p.g));WAR.piles=[];const mS=snowM;
  for(let k=0;k<T.wars.piles;k++){const s=freeSpot(4),g=new THREE.Group(),y=groundAt(s.x,s.z,20).h;g.position.set(s.x,isFinite(y)?y:0,s.z);runL.grp.add(g);
    const m=new THREE.Mesh(new THREE.SphereGeometry(.95,14,8),mS);m.scale.set(1,.42,1);m.position.y=.05;g.add(m);
    for(let i=0;i<5;i++){const b=new THREE.Mesh(sbGeo,sbMat);const a=i/5*PI*2;b.position.set(Math.cos(a)*.38,.42+(i%2)*.06,Math.sin(a)*.38);g.add(b)}
    const top=new THREE.Mesh(sbGeo,sbMat);top.position.y=.6;g.add(top);
    const ring=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:0x9fe3ff,transparent:true,opacity:.5,side:THREE.DoubleSide}));ring.rotation.x=-PI/2;ring.position.y=.04;ring.scale.setScalar(2.1);g.add(ring);
    WAR.piles.push({g,x:s.x,z:s.z,y:g.position.y,ring})}}

// ---------- computer players ----------
function makeBot(k){const d=BOT_DEF[k%BOT_DEF.length],a=makeAv(d.ch);try{applyLook(a.rig,d.ch,d.of,cleanLook(null,d.ch));a.of=d.of}catch(e){}
  a.stars=makeStars();a.g.add(a.stars);const s=freeSpot(8),y=groundAt(s.x,s.z,20).h;
  return{a,name:d.name,ch:d.ch,x:s.x,y:isFinite(y)?y:0,z:s.z,vx:0,vy:0,vz:0,face:Math.random()*PI*2,stun:0,cool:2+Math.random()*2,throwT:0,tx:s.x,tz:s.z,retarget:0,walk:0,
    hp:T.wars.hp,score:0,hits:0,kos:0,out:0,inv:0,target:null,seq:5e6+k*1e5,last:null}}
const botKey=b=>'bot'+WAR.bots.indexOf(b);
// where a fighter is (me, a bot) for aiming
function fighterPos(key){if(key==='me')return{x:P.position.x,y:py,z:P.position.z,vx:vel.x,vz:vel.z,up:WAR.out<=0};
  const b=WAR.bots[+key.slice(3)];return b?{x:b.x,y:b.y,z:b.z,vx:b.vx,vz:b.vz,up:b.out<=0}:null}
function botThink(b,dt){
  // pick someone to pick on: often whoever hit it last, otherwise whoever's close
  if(b.retarget<=0){b.retarget=1.6+Math.random()*2.2;
    const opts=['me',...WAR.bots.filter(o=>o!==b).map(botKey)].filter(k=>{const f=fighterPos(k);return f&&f.up});
    if(b.last&&opts.includes(b.last)&&Math.random()<.55)b.target=b.last;
    else if(opts.length){opts.sort((p,q)=>{const P1=fighterPos(p),Q1=fighterPos(q);return Math.hypot(P1.x-b.x,P1.z-b.z)-Math.hypot(Q1.x-b.x,Q1.z-b.z)});b.target=opts[Math.random()<.65?0:Math.floor(Math.random()*opts.length)]}
    const f=b.target&&fighterPos(b.target);if(f){const ang=Math.atan2(b.x-f.x,b.z-f.z)+(Math.random()-.5)*2.4,r=6+Math.random()*6;b.tx=f.x+Math.sin(ang)*r;b.tz=f.z+Math.cos(ang)*r}}
  const f=b.target&&fighterPos(b.target);
  const ex=b.tx-b.x,ez=b.tz-b.z,el=Math.hypot(ex,ez),sp=el>.6&&b.throwT<=0?5.8:0,k=1-Math.exp(-8*dt);
  b.vx+=((el?ex/el:0)*sp-b.vx)*k;b.vz+=((el?ez/el:0)*sp-b.vz)*k;
  if(Math.hypot(b.vx,b.vz)>.5&&b.throwT<=0)b.face+=angD(Math.atan2(b.vx,b.vz),b.face)*Math.min(1,dt*10);
  if(!f||!f.up||WAR.cd>0)return;const dx=f.x-b.x,dz=f.z-b.z,dist=Math.hypot(dx,dz);
  if(b.cool<=0&&dist>2.5&&dist<19&&Math.abs(f.y-b.y)<4){b.cool=2.4+Math.random()*1.8;b.throwT=.3;b.face=Math.atan2(dx,dz);
    const fl=dist/T.snow.speed,wob=1.5+dist*.09,tx=f.x+f.vx*fl*.7+(Math.random()-.5)*wob,tz=f.z+f.vz*fl*.7+(Math.random()-.5)*wob;
    const ox=b.x+Math.sin(b.face)*.5,oy=b.y+1.45,oz=b.z+Math.cos(b.face)*.5,hx=tx-ox,hz=tz-oz,hd=Math.hypot(hx,hz)||1,tt=hd/T.snow.speed;
    launchSnowball([ox,oy,oz,hx/hd*T.snow.speed,(f.y+1.1-oy+.5*T.snow.gravity*tt*tt)/tt,hz/hd*T.snow.speed].map(f2),false,botKey(b),++b.seq);SFX.snowThrow()}}
function botPose(b,dt){const t=tAll,mv=Math.hypot(b.vx,b.vz),air=b.y>groundAt(b.x,b.z,b.y).h+.05;
  let q=[0,0,0,0,1,0,0,0,0,.05,-.12,-.05,.12,0,0,0];
  if(b.stun>0){const w=Math.sin(t*11);q=[air?-.5:-.15,w*.25,w*.12,0,1,air?-.6:.15,0,air?.5:-.15,0,-.4,-1.3,-.4,1.3,.2,0,w*.35]}
  else if(b.throwT>0){const kk=1-b.throwT/.3;q[1]=kk<.4?.35:-.3;q[11]=kk<.4?.9:-2.5+(kk-.4)*2.2;q[12]=.2;q[13]=kk<.4?-.2:.2}
  else if(mv>.5){const s=Math.sin(b.walk);q[0]=.12;q[5]=s*.8;q[7]=-s*.8;q[9]=-s*.6;q[11]=s*.6;q[3]=Math.abs(Math.cos(b.walk))*.05}
  applyPose(b.a,q,Math.min(1,dt*14))}
function updateBot(b,dt){const a=b.a;
  // knocked out: skid back, fall flat, lie there seeing stars, then puff away and come back somewhere else
  if(b.out>0){b.out-=dt;const down=T.wars.respawn-b.out;
    if(b.out<=.3&&a.g.visible){a.g.visible=false;a.stars.visible=false;burst(V(b.x,.5,b.z),0xffffff,18);burst(V(b.x,.5,b.z),0xdff4ff,8)}
    if(b.out<=0){const s=freeSpot(8),y=groundAt(s.x,s.z,20).h;Object.assign(b,{x:s.x,z:s.z,y:isFinite(y)?y:0,vx:0,vz:0,vy:0,hp:T.wars.hp,inv:T.wars.invuln,stun:0,retarget:0,cool:1.5});
      a.g.visible=true;a.tag.position.y=2.75;a.g.position.set(b.x,b.y,b.z);burst(V(b.x,1,b.z),0xffffff,14);return}
    if(!a.g.visible)return;
    b.vx*=Math.exp(-3*dt);b.vz*=Math.exp(-3*dt);botMove(b,dt);
    applyPose(a,KO_Q,koBlend(down));a.tag.position.y=2.75-1.5*koBlend(down);koStars(a.stars,b.x,b.y,b.z,b.face,dt);drawTag(a,b.name,b.score,false);return}
  a.g.visible=b.inv>0?Math.floor(tAll*10)%2===0:true;
  b.stun=Math.max(0,b.stun-dt);b.inv=Math.max(0,b.inv-dt);b.cool-=dt;b.throwT=Math.max(0,b.throwT-dt);b.retarget-=dt;
  if(b.stun>0){b.vx*=Math.exp(-2.5*dt);b.vz*=Math.exp(-2.5*dt)}else botThink(b,dt);
  botMove(b,dt);
  a.stars.visible=b.stun>0;if(b.stun>0){a.stars.position.set(0,2.35,0);a.stars.rotation.y+=dt*7}
  botPose(b,dt);drawTag(a,b.name,b.score,false)}
// walk/skid with simple collision: walls stop it, ledges it walks off fall
function botMove(b,dt){const a=b.a;
  const nx=b.x+b.vx*dt,nz=b.z+b.vz*dt;
  if(!blocked(nx,b.z,b.y))b.x=nx;else{b.vx=0;b.retarget=0}
  if(!blocked(b.x,nz,b.y))b.z=nz;else{b.vz=0;b.retarget=0}
  const lim=runL.arena||26;b.x=Math.max(-lim,Math.min(lim,b.x));b.z=Math.max(-lim,Math.min(lim,b.z));
  const g=groundAt(b.x,b.z,b.y).h,gh=isFinite(g)?g:0;b.vy-=T.gravity*dt;b.y+=b.vy*dt;if(b.y<=gh){b.y=gh;b.vy=0}
  b.walk+=Math.hypot(b.vx,b.vz)*dt*2.2;a.g.position.set(b.x,b.y,b.z);a.g.rotation.y=b.face}

// ---------- hits ----------
// score a hit for `by` ('me' or 'botN') on the fighter that lost a heart; ko: that was their last heart
function award(by,ko,trick){const pts=(trick?T.wars.trick:T.wars.hit)+(ko?T.wars.ko:0);
  if(by==='me'){WAR.score+=pts;WAR.hits++;if(ko)WAR.kos++;score=WAR.score;popScore(ko?`KO! +${pts}`:trick?`Trick Shot! +${pts}`:`+${pts}`);if(ko)SFX.start();hud()}
  else if(by.startsWith('bot')){const b=WAR.bots[+by.slice(3)];if(b){b.score+=pts;b.hits++;if(ko)b.kos++}}}
// a snowball (mine or a bot's) reached a bot?
function botCatch(p,ball){if(!WAR.on)return false;
  for(const b of WAR.bots){if(b.out>0||ball.owner===botKey(b))continue;
    if(Math.hypot(b.x-p.x,b.z-p.z)>.75||p.y<b.y||p.y>b.y+2.1)continue;
    if(b.inv>0||b.stun>T.snow.stun-.4)return true;   // splat, no damage while blinking or already reeling
    const by=ball.own?'me':ball.owner,d=Math.hypot(ball.vx,ball.vz)||1;b.vx=ball.vx/d*T.snow.hitKnock;b.vz=ball.vz/d*T.snow.hitKnock;b.vy=T.snow.hitLift;b.stun=T.snow.stun;b.throwT=0;
    b.hp--;b.last=by;const ko=b.hp<=0;award(by,ko,ball.own&&SB.trickIds.has(ball.id));SFX.hurt();
    if(ko){b.out=T.wars.respawn;b.face=Math.atan2(-ball.vx,-ball.vz);b.stun=0;burst(V(b.x,1.2,b.z),0xffffff,22);if(by==='me')toast(`You knocked out ${b.name}!`)}
    return true}
  return false}
// I got hit (called from hitMe). Returns true when that was my last heart.
function warsHitMe(owner){WAR.hp--;WAR.lastBy=owner;const ko=WAR.hp<=0;
  if(typeof owner==='string'&&owner.startsWith('bot'))award(owner,ko,false);
  if(ko){WAR.out=T.wars.respawn;WAR.poof=false;WAR.downs++;SB.stun=T.wars.respawn;
    const who=owner&&owner.startsWith('bot')?warName(owner):(warPeers().find(p=>p.peer===owner)?nameOf(warPeers().find(p=>p.peer===owner)):'someone');
    popScore('Snowed in!',true);toast(`Knocked out by ${who}`)}
  hud();return ko}
const warsShielded=()=>WAR.on&&(WAR.out>0||WAR.inv>0||WAR.cd>0);
// a friend reported my snowball hit them (h = [me, ballId, ko])
function warsCreditRemote(h){if(!WAR.on)return;award('me',h[2]===1,SB.trickIds.has(h[1]))}
// remember which of my throws were trick shots
function warsThrew(id){if(!grounded||(chars[ci].acro&&A.mode!=='normal')||LH.on)SB.trickIds.add(id)}

// ---------- every frame ----------
function warsUpdate(dt){
  if(WAR.on&&(mode!=='run'||state==='menu'||state==='select'||state==='build')){warsStop(false);return}
  // a friend on this map started a match: jump in
  if(!WAR.on&&canWar()&&state==='play'&&MP.room&&(WAR.tick+=dt)>.5){WAR.tick=0;
    for(const p of warPeers()){const w=p.presence.wm;if(Array.isArray(w)&&typeof w[0]==='string'&&w[0].length<40&&!WAR.done.has(w[0])&&Number.isFinite(w[1])&&w[1]>8){startWars({id:w[0],time:w[1],bots:0,by:nameOf(p)});break}}}
  if(!WAR.on||state!=='play')return;
  if(WAR.cd>0){const a=Math.ceil(WAR.cd);WAR.cd-=dt;const b=Math.ceil(WAR.cd);if(b!==a&&b>=1){popScore(String(b));SFX.ui(b)}if(WAR.cd<=0){WAR.cd=0;popScore('Fight!');SFX.start();hud()}}
  else{const sh=Math.ceil(WAR.t);WAR.t-=dt;if(WAR.t<=0){WAR.t=0;warsEnd();return}if(Math.ceil(WAR.t)!==sh){hud();if(WAR.t<=5)SFX.ui(1)}}
  // knocked out: dizzy where you fell, then back in somewhere else, blinking
  if(WAR.out>0){WAR.out-=dt;if(WAR.out<=0){const s=freeSpot(6),y=groundAt(s.x,s.z,20).h;P.position.set(s.x,0,s.z);py=isFinite(y)?y:0;vy=0;vel.set(0,0,0);grounded=true;stand=null;
      WAR.hp=T.wars.hp;WAR.inv=T.wars.invuln;invuln=T.wars.invuln;SB.stun=0;SB.ammo=T.snow.ammo;snowHud();burst(V(s.x,py+1,s.z),0xffffff,14);hud()}}
  if(WAR.inv>0)WAR.inv-=dt;
  if(WAR.out>0&&WAR.out<=.3&&!WAR.poof){WAR.poof=true;burst(V(P.position.x,py+.5,P.position.z),0xffffff,18);burst(V(P.position.x,py+.5,P.position.z),0xdff4ff,8)}
  // snow piles and a slow trickle
  let near=false;for(const p of WAR.piles){p.ring.material.opacity=.35+Math.sin(tAll*3)*.15;if(Math.hypot(p.x-P.position.x,p.z-P.position.z)<T.wars.pileR&&Math.abs(py-p.y)<1.2)near=true}
  if(near&&SB.ammo<T.snow.ammo&&(WAR.refill+=dt)>=T.wars.pileRate){WAR.refill=0;SB.ammo++;snowHud();snowFlash('gain');SFX.ui(2)}
  if(!near)WAR.refill=0;
  if(SB.ammo<T.snow.ammo&&(WAR.regen+=dt)>=T.wars.regen){WAR.regen=0;SB.ammo++;snowHud()}
  WAR.bots.forEach(b=>updateBot(b,dt));
  if((WAR.tick+=dt)>.25){WAR.tick=0;warsBoard()}}
