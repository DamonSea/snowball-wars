// Tag: a timed round of tag in Trick Park (PLAY pad or pause menu > Tag). One player is It (the "IT!" sign over
// their head); touch someone to pass it on. No tag-backs: whoever just tagged you is safe from you for a moment, and
// a new It counts for a moment before they can tag. The clock tracks how long each player has been It: least wins.
// Snowballs stun whoever you hit, so you can slow down the It.
// Alone, the computer players join (they chase when It, flee when not, and hop up low ledges). With friends on the
// map it's players only; starting a game pulls everyone there in, and tags travel through presence (`tm`).
const TAG={on:false,id:'',t:0,cd:0,it:'',itT:{},bots:[],safeFrom:'',safeT:0,count:0,seq:0,last:null,done:new Set(),tick:0,seen:{},joinIt:''};
const tagLive=()=>TAG.on&&mode==='run';
function canTag(){return mode==='run'&&runFree&&!(FR.on&&!FR.done)&&!WAR.on&&(state==='play'||state==='paused')}
// "IT!" sign: one shared texture, a sprite per player
const itTex=(()=>{const c=document.createElement('canvas');c.width=128;c.height=64;const x=c.getContext('2d');
  if(x){x.fillStyle='#e8252e';x.beginPath();x.roundRect?x.roundRect(6,6,116,52,18):x.rect(6,6,116,52);x.fill();x.lineWidth=5;x.strokeStyle='#fff';x.stroke();
    x.fillStyle='#fff';x.font='900 38px "Baloo 2", system-ui, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('IT!',64,35)}
  return keep(new THREE.CanvasTexture(c))})();
function itSprite(){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:itTex,transparent:true,depthWrite:false}));s.scale.set(1.3,.65,1);s.visible=false;return s}
const myIt=itSprite();scene.add(myIt);
const tagPeers=()=>warPeers().filter(p=>{const w=p.presence.tm;return Array.isArray(w)&&w[0]===TAG.id});
const tagName=k=>k==='me'?'You':k.startsWith('bot')?(TAG.bots[+k.slice(3)]||{}).name||'Computer':(()=>{const p=warPeers().find(q=>q.peer===k);return p?nameOf(p):'Player'})();

// ---------- start / stop ----------
function startTag(o={}){if(!canTag()&&!TAG.on)return;if(TAG.on)tagStop(false);if(state==='paused'){state='play';overlay(false)}
  Object.assign(TAG,{on:true,id:o.id||(MP.me?MP.me.slice(-4):'s')+'-t'+Date.now().toString(36),t:o.time||T.tag.time,cd:o.time?1.2:3,itT:{me:0},safeFrom:'',safeT:0,count:0,seq:0,seen:{},last:null});
  if(!MP.client){orbs.forEach(q=>rmObj(q.g));orbs=[];runHz.forEach(h=>rmObj(h.g));runHz=[];runQ=[]}
  dropCombo();score=0;
  const peers=warPeers(),n=o.bots!==undefined?o.bots:(peers.length?0:T.tag.bots);TAG.bots=[];
  for(let k=0;k<n;k++){const b=makeBot(k);b.key='bot'+k;b.it=itSprite();b.a.g.add(b.it);b.it.position.y=3.35;b.cool=0;TAG.bots.push(b);TAG.itT[b.key]=0}
  // who starts as It: a friend's game says; otherwise anyone at random
  if(o.it)TAG.it=o.it;else{const all=['me',...TAG.bots.map(b=>b.key),...peers.map(p=>p.peer)];TAG.it=all[Math.floor(Math.random()*all.length)]}
  if(TAG.it!=='me'&&!TAG.it.startsWith('bot')){TAG.seq++;TAG.last=[TAG.seq,TAG.it]}   // tell that friend they're It
  if(TAG.it==='me')TAG.count=T.tag.count;
  $('warsBoard').classList.add('on');freeUI();hint('');if(o.by)toast(`${o.by} started Tag!`);
  SFX.start();hud();tagBoard();tagAnnounce()}
function tagStop(restore=true){if(!TAG.on)return;TAG.on=false;if(TAG.id)TAG.done.add(TAG.id);
  TAG.bots.forEach(b=>freeTree(b.a.g));TAG.bots=[];myIt.visible=false;MP.av.forEach(a=>{if(a.it)a.it.visible=false});
  $('warsBoard').classList.remove('on');score=0;
  if(restore&&mode==='run'&&!MP.client&&!orbs.length){spawnCount=0;for(let i=0;i<T.run.orbsOnField;i++)spawnOrb()}
  freeUI();hud()}
function tagAnnounce(){if(TAG.it==='me'){popScore("You're It!",true);toast("You're It! Tag someone.")}else toast(`${tagName(TAG.it)} is It. Run!`)}
// everyone in the game, least time as It first
function tagRows(){const r=[{name:'You',k:'me',s:TAG.itT.me||0,it:TAG.it==='me',me:1}];
  TAG.bots.forEach(b=>r.push({name:b.name,k:b.key,s:TAG.itT[b.key]||0,it:TAG.it===b.key}));
  for(const p of tagPeers()){const w=p.presence.tm;r.push({name:nameOf(p),k:p.peer,s:Number.isFinite(w[2])?w[2]:0,it:w[3]===1})}
  return r.sort((a,b)=>a.s-b.s||(b.me?1:0)-(a.me?1:0))}
function tagBoard(){const e=$('warsBoard');if(!e||!TAG.on)return;
  e.innerHTML=`<div class="wbt">${TAG.cd>0?'Tag':fmtClock(TAG.t)}</div>`+tagRows().map(r=>`<div class="wbr nohp${r.me?' me':''}"><b>${r.it?'<em class="itdot">IT</em> ':''}${warEsc(r.name)}</b><span>${r.s.toFixed(1)}s</span></div>`).join('')}
function tagEnd(){const rows=tagRows(),pl=rows.findIndex(r=>r.me)+1,best=rows[0].s,tied=rows.filter(r=>r.s===best).length>1;
  const title=pl===1?(tied?'Tied for first!':'You win!'):`${pl}${['st','nd','rd'][pl-1]||'th'} place`;
  tagStop(true);state='over';SFX[pl===1?'start':'ui'](3);
  overlay(true,title,'','Play again','Keep playing',()=>{state='play';overlay(false);startTag()},()=>{state='play';overlay(false)});
  hint('');$('ov').classList.add('wres');
  $('ovP').innerHTML=`<ol class="warsres">${rows.map(r=>`<li class="${r.me?'me':''}"><b>${warEsc(r.name)}</b><span>${r.s.toFixed(1)}s It</span></li>`).join('')}</ol><small>Least time as It wins.</small>`}

// ---------- tagging ----------
// pass It from `from` to `to`; `to` can't tag `from` straight back, and counts before tagging anyone
function passIt(from,to){TAG.it=to;SFX.splat(true);
  if(to==='me'){TAG.safeFrom=from;TAG.safeT=T.tag.noBack;TAG.count=T.tag.count;popScore("You're It!",true);rumble(140,.6,.8);toast(`${tagName(from)} tagged you!`)}
  else if(from==='me'){popScore('Tagged!');toast(`You tagged ${tagName(to)}!`);if(!to.startsWith('bot')){TAG.seq++;TAG.last=[TAG.seq,to]}}
  const b=TAG.bots.find(q=>q.key===to);if(b){b.safeFrom=from;b.safeT=T.tag.noBack;b.count=T.tag.count;b.retarget=0}
  const pos=to==='me'?V(P.position.x,py+1.2,P.position.z):b?V(b.x,b.y+1.2,b.z):null;if(pos)burst(pos,0xe8252e,14);tagBoard()}
const tagNear=(ax,ay,az,bx,by,bz)=>Math.hypot(ax-bx,az-bz)<T.tag.reach&&Math.abs(ay-by)<1.8;
function tagChecks(){if(TAG.cd>0)return;
  if(TAG.it==='me'&&TAG.count<=0){
    for(const b of TAG.bots)if(!(TAG.safeT>0&&TAG.safeFrom===b.key)&&tagNear(P.position.x,py,P.position.z,b.x,b.y,b.z)){passIt('me',b.key);return}
    for(const p of tagPeers()){if(TAG.safeT>0&&TAG.safeFrom===p.peer)continue;const a=MP.av.get(p.peer);if(a&&tagNear(P.position.x,py,P.position.z,a.g.position.x,a.g.position.y,a.g.position.z)){passIt('me',p.peer);return}}}
  const ib=TAG.bots.find(b=>b.key===TAG.it);
  if(ib&&ib.count<=0){if(!(ib.safeT>0&&ib.safeFrom==='me')&&tagNear(ib.x,ib.y,ib.z,P.position.x,py,P.position.z)){passIt(ib.key,'me');return}
    for(const b of TAG.bots)if(b!==ib&&!(ib.safeT>0&&ib.safeFrom===b.key)&&tagNear(ib.x,ib.y,ib.z,b.x,b.y,b.z)){passIt(ib.key,b.key);return}}}
// a friend tagged me (their presence names me in a tag they haven't sent before)
function tagFromPeers(){for(const p of tagPeers()){const l=p.presence.tm[4];if(!Array.isArray(l)||!Number.isInteger(l[0]))continue;
  const k=p.peer;if((TAG.seen[k]||0)>=l[0])continue;TAG.seen[k]=l[0];if(l[1]===MP.me)passIt(k,'me');else if(TAG.it===k)TAG.it=l[1]}}
// my snowball hit a computer player: stun it (handy against the It)
function tagCatch(p,ball){if(!tagLive()||!ball.own)return false;
  for(const b of TAG.bots){if(Math.hypot(b.x-p.x,b.z-p.z)>.75||p.y<b.y||p.y>b.y+2.1)continue;if(b.stun>T.snow.stun-.4)return true;
    const d=Math.hypot(ball.vx,ball.vz)||1;b.vx=ball.vx/d*T.snow.hitKnock;b.vz=ball.vz/d*T.snow.hitKnock;b.vy=T.snow.hitLift;b.stun=T.snow.stun;SFX.hurt();addTrick('Direct Hit');return true}
  return false}

// ---------- computer players ----------
const fPos=k=>k==='me'?{x:P.position.x,y:py,z:P.position.z}:(()=>{const b=TAG.bots.find(q=>q.key===k);if(b)return{x:b.x,y:b.y,z:b.z};const a=MP.av.get(k);return a?{x:a.g.position.x,y:a.g.position.y,z:a.g.position.z}:null})();
function tagThink(b,dt){const it=TAG.it===b.key,k=1-Math.exp(-8*dt),onG=b.y<=groundAt(b.x,b.z,b.y).h+.05;
  let tx=b.x,tz=b.z,sp=0,tgt=null;
  if(it){if(b.count>0){b.count-=dt}else{   // chase whoever's closest (not the one who just tagged it)
      let bd=1e9;for(const k2 of ['me',...TAG.bots.filter(q=>q!==b).map(q=>q.key)]){if(b.safeT>0&&b.safeFrom===k2)continue;const f=fPos(k2);if(!f)continue;const d=Math.hypot(f.x-b.x,f.z-b.z)+Math.max(0,f.y-b.y)*2;if(d<bd){bd=d;tgt=f}}
      if(tgt){tx=tgt.x;tz=tgt.z;sp=T.tag.chase}}}
  else{const f=fPos(TAG.it);if(f&&Math.hypot(f.x-b.x,f.z-b.z)<11){   // run from the It, veering when walls get in the way
      if((b.retarget-=dt)<=0){b.retarget=.8+Math.random();b.veer=(Math.random()-.5)*1.6}
      const a=Math.atan2(b.x-f.x,b.z-f.z)+(b.veer||0);tx=b.x+Math.sin(a)*6;tz=b.z+Math.cos(a)*6;sp=T.tag.flee;
      // keep off the rim
      if(Math.hypot(tx,tz)>ARENA-3){const r=Math.hypot(b.x,b.z)||1;tx=b.x-b.x/r*4+(b.z/r)*5*(b.veer>0?1:-1);tz=b.z-b.z/r*4-(b.x/r)*5*(b.veer>0?1:-1)}}
    else if((b.retarget-=dt)<=0){b.retarget=1.5+Math.random()*2;const s=freeSpot(3);b.tx=s.x;b.tz=s.z}else{tx=b.tx??b.x;tz=b.tz??b.z;sp=2.5}}
  const ex=tx-b.x,ez=tz-b.z,el=Math.hypot(ex,ez);
  b.vx+=((el>.3?ex/el:0)*sp-b.vx)*k;b.vz+=((el>.3?ez/el:0)*sp-b.vz)*k;
  if(Math.hypot(b.vx,b.vz)>.5)b.face+=angD(Math.atan2(b.vx,b.vz),b.face)*Math.min(1,dt*10);
  // hop up after someone on a low ledge (or over a wall in the way)
  b.hopT=Math.max(0,(b.hopT||0)-dt);
  if(it&&tgt&&onG&&b.hopT<=0&&b.count<=0){const dy=tgt.y-b.y,dh=Math.hypot(tgt.x-b.x,tgt.z-b.z);
    if(dy>.6&&dy<T.tag.hopMax&&dh<5){b.vy=Math.sqrt(2*T.gravity*(dy+.8));b.hopT=1.2;SFX.ui(1)}}}
function updateTagBot(b,dt){const a=b.a;a.g.visible=true;
  b.stun=Math.max(0,b.stun-dt);b.safeT=Math.max(0,(b.safeT||0)-dt);
  if(b.stun>0){b.vx*=Math.exp(-2.5*dt);b.vz*=Math.exp(-2.5*dt)}else if(TAG.cd<=0)tagThink(b,dt);else{b.vx*=.8;b.vz*=.8}
  botMove(b,dt);a.stars.visible=b.stun>0;if(b.stun>0){a.stars.position.set(0,2.35,0);a.stars.rotation.y+=dt*7}
  b.it.visible=TAG.it===b.key;if(b.it.visible)b.it.position.y=3.35+Math.sin(tAll*6)*.08;
  botPose(b,dt);drawTag(a,b.name,`It ${Math.round(TAG.itT[b.key]||0)}s`,false)}

// ---------- every frame ----------
function tagUpdate(dt){
  if(TAG.on&&(mode!=='run'||state==='menu'||state==='select'||state==='build')){tagStop(false);return}
  // a friend on this map started Tag: join in
  if(!TAG.on&&!WAR.on&&canTag()&&state==='play'&&MP.room&&(TAG.tick+=dt)>.5){TAG.tick=0;
    for(const p of warPeers()){const w=p.presence.tm;if(Array.isArray(w)&&typeof w[0]==='string'&&w[0].length<40&&!TAG.done.has(w[0])&&Number.isFinite(w[1])&&w[1]>8){
      const it=w[3]===1?p.peer:(Array.isArray(w[4])&&w[4][1]===MP.me?'me':(tagPeers().find(q=>q.presence.tm[3]===1)||{}).peer||p.peer);
      startTag({id:w[0],time:w[1],bots:0,by:nameOf(p),it});break}}}
  if(!TAG.on)return;
  // signs over friends who are It
  for(const p of warPeers()){const a=MP.av.get(p.peer);if(!a)continue;if(!a.it){a.it=itSprite();a.g.add(a.it);a.it.position.y=3.35}const w=p.presence.tm;a.it.visible=Array.isArray(w)&&w[0]===TAG.id&&w[3]===1}
  myIt.visible=TAG.it==='me';if(myIt.visible)myIt.position.set(P.position.x,py+3.2+Math.sin(tAll*6)*.08,P.position.z);
  if(state!=='play')return;
  if(TAG.cd>0){const a=Math.ceil(TAG.cd);TAG.cd-=dt;const b=Math.ceil(TAG.cd);if(b!==a&&b>=1){popScore(String(b));SFX.ui(b)}if(TAG.cd<=0){TAG.cd=0;popScore('Go!');SFX.start();hud()}}
  else{const sh=Math.ceil(TAG.t);TAG.t-=dt;TAG.itT[TAG.it]!==undefined?TAG.itT[TAG.it]+=dt:TAG.itT[TAG.it]=dt;
    if(TAG.t<=0){TAG.t=0;tagEnd();return}if(Math.ceil(TAG.t)!==sh){hud();if(TAG.t<=5)SFX.ui(1)}}
  TAG.safeT=Math.max(0,TAG.safeT-dt);TAG.count=Math.max(0,TAG.count-dt);
  tagFromPeers();TAG.bots.forEach(b=>updateTagBot(b,dt));tagChecks();
  if((TAG.tick+=dt)>.25){TAG.tick=0;tagBoard()}}
