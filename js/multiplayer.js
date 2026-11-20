// Multiplayer (Trick Park only) over the page's room capability: presence, remote avatars,
// host election and the shared orb/spikeball field.
// ---------- multiplayer: Trick Park only (Adventure stays single-player) ----------
// Uses the page's `room` capability. Everyone on the same Trick Park map shares a named room.
// Presence carries each player's position, pose, character, outfit, score and last trick.
// One player's game (the lowest peer id) referees the shared orbs and spikeballs and publishes
// them in its presence; the others mirror that field and send "claims" when they grab or smash.
const MP={on:false,lobby:null,user:null,room:null,roomName:'',joining:false,retryAt:0,me:'',host:true,client:false,hostPeer:null,
  myName:'',av:new Map(),prof:{},gone:new Set(),done:new Set(),cl:{n:0,o:[],k:[]},tr:{n:0,s:''},lastSend:0,lastWhere:'',lastList:0};
let orbSeq=0,hzSeq=0;
const mkId=p=>(MP.me?MP.me.slice(-5):'s')+p;
const f2=x=>Math.round(x*100)/100;
async function mpInit(){try{if(!window.claude||typeof window.claude.use!=='function')return;
  const[room,user]=await Promise.all([window.claude.use('room'),window.claude.use('user')]);if(!room)return;
  MP.lobby=room;MP.user=user;MP.on=true;
  try{const me=user&&await user.me();MP.myName=(me&&me.name)||''}catch(e){}
  room.onPeers(()=>lobbyUI(),()=>{MP.on=false;lobbyUI()});lobbyUI()}catch(e){MP.on=false}}
function nameOf(peer){
  if(peer.sameTab)return MP.myName||'You';
  if(peer.by&&MP.user){if(!(peer.by in MP.prof)){MP.prof[peer.by]='';MP.user.profiles([peer.by]).then(ps=>{const q=ps&&ps[peer.by];MP.prof[peer.by]=(q&&q.name)||''}).catch(()=>{})}
    if(MP.prof[peer.by])return MP.prof[peer.by]}
  const n=peer.presence&&peer.presence.nm;return typeof n==='string'&&n.trim()?n.trim().slice(0,24):'Player'}
const whereName=w=>w==='menu'?'in the menu':w==='adv'?'in Adventure':/^p\d$/.test(w||'')&&RUNMAPS[+w[1]]?'in '+RUNMAPS[+w[1]].name:'';
function lobbyUI(){const e=$('online');if(!e)return;
  if(!MP.on||!MP.lobby){e.textContent='';return}
  const ps=MP.lobby.peers();if(ps.length<2){e.textContent='Multiplayer: share this game from claude.ai to invite friends. Anyone on the same Trick Park map plays with you.';return}
  e.textContent='Online now: '+ps.map(p=>(p.sameTab?'You':nameOf(p))+(p.sameTab?'':(' ('+(whereName(p.presence.w)||'here')+')'))).join(', ')}
const mapCount=i=>MP.on&&MP.lobby?MP.lobby.peers().filter(p=>!p.sameTab&&p.presence&&p.presence.w==='p'+i).length:0;
// --- remote avatars ---
function tagCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function makeAv(ch){const g=new THREE.Group();scene.add(g);
  const rig=ch===0?buildBot(g):ch===1?buildRook(g):ch===3?buildNova(g):buildChibi(g);
  const tc=tagCanvas(320,96),tt=new THREE.CanvasTexture(tc),tag=new THREE.Sprite(new THREE.SpriteMaterial({map:tt,transparent:true,depthWrite:false}));tag.scale.set(2.6,.78,1);tag.position.y=2.75;g.add(tag);
  const kc=tagCanvas(320,72),kt=new THREE.CanvasTexture(kc),trick=new THREE.Sprite(new THREE.SpriteMaterial({map:kt,transparent:true,depthWrite:false,opacity:0}));trick.scale.set(2.6,.58,1);trick.position.y=3.5;g.add(trick);
  return{g,rig,ch,of:-1,tc,tt,tag,kc,kt,trick,txt:'',tn:null,tt0:0,init:false,lx:0,lz:0}}
function dropAv(a){scene.remove(a.g)}
function clearAv(){MP.av.forEach(dropAv);MP.av.clear()}
function drawTag(a,name,sc,free){const t=name+'|'+sc+'|'+free;if(t===a.txt)return;a.txt=t;const x=a.tc.getContext('2d');x.clearRect(0,0,320,96);
  x.fillStyle='rgba(10,32,46,.82)';x.beginPath();x.roundRect?x.roundRect(10,6,300,84,22):x.rect(10,6,300,84);x.fill();
  x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff8e8';x.font='800 34px "Baloo 2", system-ui, sans-serif';x.fillText(name.slice(0,16),160,36);
  x.fillStyle=free?'#9fb3bf':'#ffd84a';x.font='700 24px "Baloo 2", system-ui, sans-serif';x.fillText(free?`practice · ${sc}`:`score ${sc}`,160,70);a.tt.needsUpdate=true}
function showTrickTag(a,s){const x=a.kc.getContext('2d');x.clearRect(0,0,320,72);x.textAlign='center';x.textBaseline='middle';x.font='800 36px "Baloo 2", system-ui, sans-serif';
  x.lineWidth=6;x.strokeStyle='rgba(60,30,0,.9)';x.strokeText(s,160,36);x.fillStyle='#ffd84a';x.fillText(s,160,36);a.kt.needsUpdate=true;a.tt0=1.3}
function poseOf(){if(ci===0)return[body.position.y,body.rotation.x,body.rotation.y,body.rotation.z,feet[0].position.z,feet[1].position.z].map(f2);
  const H=chars[ci].rig;return[H.hp.rotation.x,H.hp.rotation.y,H.hp.rotation.z,H.root.position.y,H.root.scale.y,H.legL.rotation.x,H.legL.rotation.z,H.legR.rotation.x,H.legR.rotation.z,
    H.armL.rotation.x,H.armL.rotation.z,H.armR.rotation.x,H.armR.rotation.z,H.head.rotation.x,H.head.rotation.y,H.head.rotation.z].map(f2)}
function applyPose(a,q,k){const Lr=(o,p,v)=>{if(typeof v!=='number')return;const d=v-o[p];o[p]=Math.abs(d)>PI?v:o[p]+d*k};
  if(a.ch===0){const b=a.rig.body;Lr(b.position,'y',q[0]);Lr(b.rotation,'x',q[1]);Lr(b.rotation,'y',q[2]);Lr(b.rotation,'z',q[3]);Lr(a.rig.feet[0].position,'z',q[4]);Lr(a.rig.feet[1].position,'z',q[5]);return}
  const H=a.rig;Lr(H.hp.rotation,'x',q[0]);Lr(H.hp.rotation,'y',q[1]);Lr(H.hp.rotation,'z',q[2]);Lr(H.root.position,'y',q[3]);
  if(typeof q[4]==='number'){const sy=q[4];H.root.scale.set(1/Math.sqrt(sy),sy,1/Math.sqrt(sy))}
  Lr(H.legL.rotation,'x',q[5]);Lr(H.legL.rotation,'z',q[6]);Lr(H.legR.rotation,'x',q[7]);Lr(H.legR.rotation,'z',q[8]);
  Lr(H.armL.rotation,'x',q[9]);Lr(H.armL.rotation,'z',q[10]);Lr(H.armR.rotation,'x',q[11]);Lr(H.armR.rotation,'z',q[12]);
  Lr(H.head.rotation,'x',q[13]);Lr(H.head.rotation,'y',q[14]);Lr(H.head.rotation,'z',q[15])}
function updAvatars(dt){
  if(!MP.room){if(MP.av.size)clearAv();return}
  const seen=new Set(),k=1-Math.exp(-14*dt);
  for(const peer of MP.room.peers()){if(peer.sameTab)continue;const pr=peer.presence||{},p=pr.p;
    if(!Array.isArray(p)||p.length<4||!p.every(v=>typeof v==='number'&&isFinite(v)))continue;
    seen.add(peer.peer);const ch=[0,1,2,3].includes(pr.ch)?pr.ch:2;let a=MP.av.get(peer.peer);
    if(a&&a.ch!==ch){dropAv(a);a=null}
    if(!a){a=makeAv(ch);MP.av.set(peer.peer,a)}
    {const L=chars[ch].outs;if(L&&Number.isInteger(pr.of)&&L[pr.of]&&pr.of!==a.of){applyOutfitTo(a.rig.mats,pr.of,L);a.of=pr.of}}
    const G=a.g.position;if(!a.init){G.set(p[0],p[1],p[2]);a.init=true}
    const ox=G.x,oz=G.z;G.x+=(p[0]-G.x)*k;G.y+=(p[1]-G.y)*k;G.z+=(p[2]-G.z)*k;a.g.rotation.y+=angD(p[3],a.g.rotation.y)*k;
    if(Array.isArray(pr.q))applyPose(a,pr.q,Math.min(1,k*1.6));
    const sp=Math.hypot(G.x-ox,G.z-oz)/Math.max(dt,1e-3);
    if(a.rig.pony){const fl=Math.min(1,sp*.08);a.rig.pony.forEach((g,i)=>{g.rotation.x=(i?.12+fl*.22:.45+fl*.75)+Math.sin(tAll*(5+sp*.6)-i*1.2)*(.05+fl*.08)})}
    if(a.rig.scarf){const fl=Math.min(1.25,sp*.11);a.rig.scarf.forEach((g,i)=>{g.rotation.x=(i?fl*.12:.25+fl)+Math.sin(tAll*(6+sp)-i*1.1)*(.08+fl*.12)})}
    snowFromPeer(peer,a);
    drawTag(a,nameOf(peer),Number.isFinite(pr.sc)?Math.floor(pr.sc):0,!!pr.fr);
    const t=pr.t;if(Array.isArray(t)&&t[0]!==a.tn){if(a.tn!==null&&typeof t[1]==='string'&&t[1])showTrickTag(a,t[1].slice(0,22));a.tn=t[0]}
    if(a.tt0>0){a.tt0-=dt;a.trick.material.opacity=Math.min(1,a.tt0*2);a.trick.position.y=3.5+(1.3-a.tt0)*.5}else a.trick.material.opacity=0}
  for(const[id,a]of MP.av)if(!seen.has(id)){dropAv(a);MP.av.delete(id)}
}
// --- room membership, host election, presence ---
function wantRoom(){return MP.on&&mode==='run'&&(state==='play'||state==='paused'||state==='over')?'tp-'+runIdx:''}
async function switchRoom(want){MP.joining=true;try{
  if(MP.room){const r=MP.room;MP.room=null;MP.roomName='';clearAv();try{await r.leave()}catch(e){}}
  MP.gone.clear();MP.done.clear();MP.client=false;MP.host=true;MP.hostPeer=null;
  if(want){const r=await MP.lobby.join(want);MP.room=r;MP.roomName=want;
    r.onPeers(()=>{},()=>{if(MP.room===r){MP.room=null;MP.roomName='';clearAv();MP.client=false;MP.host=true}})}
}catch(e){MP.retryAt=performance.now()+5000}finally{MP.joining=false}}
function electHost(){
  if(!MP.room){MP.client=false;MP.host=true;MP.hostPeer=null;return}
  const ps=MP.room.peers(),mine=ps.find(p=>p.sameTab);if(mine)MP.me=mine.peer;
  const act=ps.filter(p=>p.sameTab||(p.presence&&Array.isArray(p.presence.p)));
  let h=null;for(const p of act)if(!h||p.peer<h.peer)h=p;
  const was=MP.client;MP.hostPeer=h;MP.client=!!h&&!h.sameTab;MP.host=!MP.client;
  if(was&&!MP.client){MP.gone.clear();for(const q of runHz)if(!q.vx&&!q.vz){const a=Math.random()*PI*2,s=3.4;q.vx=Math.cos(a)*s;q.vz=Math.sin(a)*s}}
}
function mpFrame(dt){
  if(!MP.on)return;const now=performance.now();
  // lobby presence: where you are
  const w=state==='menu'||state==='select'?'menu':mode==='run'?'p'+runIdx:'adv';
  if(w!==MP.lastWhere){MP.lastWhere=w;MP.lobby.presence({w,nm:MP.myName||'Player'}).catch(()=>{});lobbyUI()}
  const want=wantRoom();if(want!==MP.roomName&&!MP.joining&&now>MP.retryAt)switchRoom(want);
  electHost();updAvatars(dt);
  if(MP.room&&now-MP.lastSend>50){MP.lastSend=now;
    const pr={nm:MP.myName||'Player',ch:ci,of:OFI[ci]??0,p:[P.position.x,py,P.position.z,face].map(f2),q:poseOf(),sc:score,fr:runFree?1:0,t:[MP.tr.n,MP.tr.s],c:[MP.cl.n,MP.cl.o,MP.cl.k],sb:SB.sent,hb:SB.hits,yw:YS.spray?1:0,z:SB.stun>0?1:0,H:null};
    if(MP.host)pr.H={o:orbs.map(o=>[o.id,f2(o.g.position.x),f2(o.y),f2(o.g.position.z),o.gold?1:0,o.v,o.ring.visible?0:1,o.beam?1:0]),h:runHz.filter(h=>!h.dead).map(h=>[h.id,f2(h.g.position.x),f2(h.g.position.z)])};
    MP.room.presence(pr).catch(()=>{})}
  if(now-MP.lastList>250){MP.lastList=now;mpList()}
}
function mpList(){const e=$('mpList');if(!MP.room){e.classList.remove('on');return}
  const ps=MP.room.peers().filter(p=>p.sameTab||(p.presence&&Array.isArray(p.presence.p)));if(ps.length<2){e.classList.remove('on');return}
  const rows=ps.map(p=>({n:p.sameTab?(MP.myName?MP.myName+' (you)':'You'):nameOf(p),s:p.sameTab?score:(Number.isFinite(p.presence.sc)?Math.floor(p.presence.sc):0),me:p.sameTab})).sort((a,b)=>b.s-a.s);
  e.replaceChildren(...rows.map(r=>{const d=document.createElement('div');d.className=r.me?'me':'';const n=document.createElement('span');n.textContent=r.n;const s=document.createElement('b');s.textContent=r.s;d.append(n,s);return d}));e.classList.add('on')}
// claims sent to the referee
function claim(kind,id){const L=MP.cl[kind];L.push(id);if(L.length>6)L.shift();MP.cl.n++}
function hostClaims(){
  if(!MP.room||MP.client)return;if(MP.done.size>600)MP.done.clear();
  for(const p of MP.room.peers()){if(p.sameTab)continue;const c=p.presence&&p.presence.c;if(!Array.isArray(c))continue;
    const[_,os,ks]=c;
    if(Array.isArray(os))for(const id of os){if(typeof id!=='string'||MP.done.has(id))continue;MP.done.add(id);const o=orbs.find(x=>x.id===id);if(o){rmObj(o.g);orbs.splice(orbs.indexOf(o),1);spawnOrb()}}
    if(Array.isArray(ks))for(const id of ks){if(typeof id!=='string'||MP.done.has(id))continue;MP.done.add(id);const h=runHz.find(x=>x.id===id);if(h&&!h.dead){burst(h.g.position.clone(),0xff5a4e,12);h.dead=true;rmObj(h.g);runQ.push(T.run.smashRespawn)}}}
}
function syncFromHost(){
  const H=MP.hostPeer&&MP.hostPeer.presence&&MP.hostPeer.presence.H;if(!H||!Array.isArray(H.o)||!Array.isArray(H.h))return;
  const oid=new Set(H.o.map(e=>e[0]));
  for(const o of [...orbs])if(!oid.has(o.id)){rmObj(o.g);orbs.splice(orbs.indexOf(o),1)}
  for(const e of H.o){if(typeof e[0]!=='string'||MP.gone.has(e[0])||orbs.some(o=>o.id===e[0]))continue;
    if(![1,2,3,5].every(i=>Number.isFinite(e[i])))continue;makeOrb({x:e[1],y:e[2],z:e[3],v:e[5],air:!!e[6],rand:!e[7]},!!e[4],e[0])}
  const hid=new Set(H.h.map(e=>e[0]));
  for(const h of [...runHz])if(!hid.has(h.id)){rmObj(h.g);runHz.splice(runHz.indexOf(h),1)}
  for(const e of H.h){if(typeof e[0]!=='string'||!Number.isFinite(e[1])||!Number.isFinite(e[2]))continue;let h=runHz.find(q=>q.id===e[0]);
    if(!h){if(MP.gone.has(e[0]))continue;const g=spikeball(runL.grp);g.position.set(e[1],.75,e[2]);h={g,id:e[0],vx:0,vz:0,tx:e[1],tz:e[2]};runHz.push(h)}
    h.tx=e[1];h.tz=e[2]}
  for(const id of [...MP.gone])if(!oid.has(id)&&!hid.has(id))MP.gone.delete(id);
}
