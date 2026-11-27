(async()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);
// a fake lobby whose named rooms are refused, like a guest's
let mine={};const me=()=>({peer:'a1',sameTab:true,isMe:true,by:'u1',presence:mine});let bob=null;
const L={peers:()=>bob?[me(),bob]:[me()],presence:async pt=>{mine=Object.assign({},mine,pt);for(const k in pt)if(pt[k]===null)delete mine[k];if(JSON.stringify(mine).length>4096)throw{code:'invalid_argument'}},
  onPeers:f=>{setTimeout(()=>f({}),0);return()=>{}},join:async()=>{throw{code:'not_permitted'}},emit:async()=>{},on:()=>()=>{},connected:()=>true};
MP.lobby=L;MP.user={profiles:async()=>({})};MP.on=true;MP.room=null;MP.roomName='';clearAv();
const tick=async n=>{for(let i=0;i<n;i++){__step(1);if(i%5==0)await new Promise(r=>setTimeout(r,1))}};
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();await tick(20);
const w=mine.w;ok('my position goes out in the lobby ('+w+')',Array.isArray(mine.p)&&/Falls/i.test(w));
for(const c of [2,3,5]){bob={peer:'b2',sameTab:false,isMe:false,by:'u2',guest:true,presence:{w,nm:'Bob',ch:c,of:0,lk:LOOKS[c]||{},p:[3,0,3,0],q:poseOf(),sc:0,fr:1,t:[0,''],c:[0,[],[]],sb:0,hb:0,yw:0,z:0,H:null}};
  await tick(10);const a=[...MP.av.values()][0];ok(`Bob as ${chars[c].name} shows up on the same map`,MP.av.size===1&&a.ch===c)}
bob={...bob,presence:{...bob.presence,w:'pSomewhereElse'}};await tick(5);ok('Bob on another map: not drawn',MP.av.size===0);
bob={...bob,presence:{...bob.presence,w}};await tick(5);ok('back on Frosty Falls: drawn again',MP.av.size===1);
menu();await tick(10);ok('leaving the map clears my game state from the lobby',!('p' in mine)&&mine.w==='menu');ok('and drops Bob',MP.av.size===0);
ok('lobby line still lists Bob',/Online now/.test($('online').textContent));
MP.on=false;MP.lobby=null;MP.room=null;MP.roomName='';return out.join('\n')})()
