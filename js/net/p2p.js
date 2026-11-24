// Multiplayer outside claude.ai (the GitHub Pages copy): a stand-in for claude.ai's `room` and `user` capabilities,
// built on Trystero (https://github.com/dmotz/trystero, MIT). Browsers find each other through public Nostr relays and
// then talk directly over WebRTC, so no game server is needed. multiplayer.js uses it exactly like the claude.ai room:
//   peers()          -> [{peer, sameTab, presence}]   (sameTab = you)
//   presence(patch)  -> merges into your presence (null deletes a key) and tells everyone what changed
//   onPeers(cb, err) -> cb() whenever someone joins, leaves, or changes where they are / their name
// Everyone who opens the page joins the public lobby; add ?room=anything to the link for a private group.
// Some strict networks block direct connections: add a TURN relay to P2P.turn (see README, "Multiplayer on GitHub").
const P2P={
  lib:'https://esm.run/trystero@0.25.2',   // pinned so an update can't break the game
  appId:'snowball-wars.damonsea.v1',
  room:(()=>{try{const r=new URLSearchParams(location.search).get('room');return r&&/^[\w-]{1,40}$/.test(r)?r:'lobby'}catch(e){return'lobby'}})(),
  turn:[],                                  // e.g. [{urls:'turn:…',username:'…',credential:'…'}]
  status:'off',err:''};
// WebRTC needs a secure page (https, or localhost while testing)
const p2pPossible=()=>typeof RTCPeerConnection!=='undefined'&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1');
const P2P_BAD=new Set(['__proto__','constructor','prototype']);
// copy only plain data keys from a peer's message (it comes from the internet)
function p2pMerge(dst,patch){if(!patch||typeof patch!=='object'||Array.isArray(patch))return false;let where=false;
  for(const k of Object.keys(patch).slice(0,64)){if(P2P_BAD.has(k))continue;const v=patch[k];
    if(v===null||v===undefined)delete dst[k];else dst[k]=v;if(k==='w'||k==='nm'||k==='nmSet')where=true}
  return where}
async function p2pRoom(){
  P2P.status='connecting';
  const T=await import(P2P.lib);
  const cfg={appId:P2P.appId};if(P2P.turn.length)cfg.turnConfig=P2P.turn;
  const room=T.joinRoom(cfg,P2P.room,{onJoinError:d=>{P2P.err='a friend couldn’t connect directly (their network may block it)';fire()}});
  const me=String(T.selfId||'me'),mine={},sentJSON={},peers=new Map(),cbs=[];
  // Trystero 0.25 API (objects and assigned callbacks), with a fallback for older releases (arrays and calls)
  const act=room.makeAction('pr'),old=Array.isArray(act);
  const send=(data,to)=>{try{const r=old?act[0](data,to):act.send(data,to?{target:to}:undefined);if(r&&r.catch)r.catch(()=>{})}catch(e){}};
  const onMsg=h=>old?act[1](h):(act.onMessage=(d,meta)=>h(d,meta&&typeof meta==='object'?meta.peerId:meta));
  const on=(k,h)=>{if(typeof room[k]==='function')room[k](h);else room[k]=h};
  let fireT=0;const fire=()=>{const now=performance.now();if(now-fireT<100)return;fireT=now;for(const c of cbs)try{c()}catch(e){}};
  const fireNow=()=>{fireT=0;fire()};
  on('onPeerJoin',id=>{if(!peers.has(id))peers.set(id,{presence:{},seen:performance.now()});send({full:1,p:mine},id);fireNow()});   // new arrivals get everything
  on('onPeerLeave',id=>{if(peers.delete(id))fireNow()});
  onMsg((d,id)=>{if(!id||!d||typeof d!=='object')return;let q=peers.get(id);if(!q){q={presence:{},seen:0};peers.set(id,q)}
    q.seen=performance.now();if(d.full)q.presence={};const where=p2pMerge(q.presence,d.p);if(where||d.full)fireNow()});
  // drop anyone silent for 20 s (a closed laptop doesn't always say goodbye)
  setInterval(()=>{const t=performance.now();let gone=false;for(const[id,q]of peers)if(t-q.seen>20000){peers.delete(id);gone=true}if(gone)fireNow()},5000);
  P2P.status='on';
  return{
    peers:()=>[{peer:me,sameTab:true,presence:mine},...[...peers].filter(([,q])=>q.seen>0).map(([id,q])=>({peer:id,sameTab:false,presence:q.presence}))],
    // only send the keys that changed since last time (the game calls this up to 20 times a second)
    presence:async patch=>{const out={};let any=false;
      for(const k of Object.keys(patch||{})){const v=patch[k];if(v===null||v===undefined)delete mine[k];else mine[k]=v;
        const j=JSON.stringify(v===undefined?null:v);if(sentJSON[k]!==j){sentJSON[k]=j;out[k]=v===undefined?null:v;any=true}}
      if(any&&peers.size)send({p:out})},
    onPeers:(cb,err)=>{cbs.push(cb)},
    leave:()=>{try{room.leave()}catch(e){}}};
}
// claude.ai's `user` capability: here there are no accounts, so names come from the name box
const p2pUser={me:async()=>({name:''}),profiles:async()=>({})};
