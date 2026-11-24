// test double for trystero@0.25 (same API shape), using BroadcastChannel between pages
export const selfId=Math.random().toString(36).slice(2,12);
export function joinRoom(cfg,roomId,cb){const ch=new BroadcastChannel('t|'+cfg.appId+'|'+roomId);const room={onPeerJoin:null,onPeerLeave:null};const actions={};const known=new Set();
  window.__fake={roomId,appId:cfg.appId,turn:cfg.turnConfig||null,sent:0,bytes:0};
  ch.onmessage=e=>{const m=e.data;if(m.to&&m.to!==selfId)return;
    if(m.t==='hello'){if(!known.has(m.from)){known.add(m.from);room.onPeerJoin&&room.onPeerJoin(m.from)}if(!m.to)ch.postMessage({t:'hello',from:selfId,to:m.from})}
    else if(m.t==='bye'){if(known.delete(m.from))room.onPeerLeave&&room.onPeerLeave(m.from)}
    else if(m.t==='act'&&known.has(m.from)){const a=actions[m.a];a&&a.onMessage&&a.onMessage(m.d,{peerId:m.from})}};
  setTimeout(()=>ch.postMessage({t:'hello',from:selfId}),30);
  room.makeAction=id=>actions[id]={onMessage:null,send:async(d,o)=>{const s=JSON.stringify(d);window.__fake.sent++;window.__fake.bytes+=s.length;const tg=o&&o.target;for(const to of (tg?[].concat(tg):[null]))ch.postMessage({t:'act',a:id,d:JSON.parse(s),from:selfId,to})}};
  room.leave=()=>{ch.postMessage({t:'bye',from:selfId});ch.close()};
  addEventListener('pagehide',()=>room.leave());
  return room}
