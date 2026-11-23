(async()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const btns=()=>[...document.querySelectorAll('#ov .btns button')].filter(b=>b.textContent&&getComputedStyle(b).display!=='none').map(b=>b.textContent);
const click=t=>[...document.querySelectorAll('#ov button')].find(b=>b.textContent===t).click();
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(10);
const sp=runL.spad;__place(sp.x,sp.z,0,0);__step(60);ok('PLAY pad menu: '+btns().join(', '),btns().join('|')==='Orb Race|Snowball Wars|Tag|Cancel');
click('Tag');__step(3);ok('Tag starts: 3 computer players, board up, someone is It',TAG.on&&TAG.bots.length===3&&$('warsBoard').classList.contains('on')&&!!TAG.it);
ok('orbs and enemies cleared',orbs.length===0&&runHz.length===0);
__step(200);ok('countdown over, clock running',TAG.cd===0&&TAG.t<120);
// make me It and tag a bot by touching it
TAG.it='me';TAG.count=0;TAG.safeT=0;const b=TAG.bots[0];b.x=P.position.x+.8;b.z=P.position.z;b.y=py;b.stun=5;__step(2);
ok('touching a computer player while It passes it on',TAG.it===b.key);
ok('the new It has an IT! sign',b.it.visible&&!myIt.visible);
// no tag-back: it can't tag me straight back
b.stun=0;b.x=P.position.x+.8;b.z=P.position.z;__step(5);ok('no tag-back right away',TAG.it===b.key);
// after the safe time, the It bot catches me if I stand still
for(let i=0;i<60*20&&TAG.it!=='me';i++)__step(1);ok('the It chases and tags someone (now It: '+tagName(TAG.it)+')',TAG.it!==b.key||TAG.it==='me');
// time as It goes to whoever is It
TAG.it='bot1';TAG.bots.forEach(q=>q.stun=3);const t1=TAG.itT.bot1;__step(60);ok('the clock counts time as It for whoever has it',TAG.itT.bot1>t1+.9);
// snowballs stun computer players
const b2=TAG.bots[2];b2.stun=0;launchSnowball([b2.x,b2.y+1.1,b2.z,.01,0,0],true,null,++SB.seq);__step(2);ok('a snowball stuns a computer player',b2.stun>0);
// a computer It catches you (the Sneak goes after you), but not while stunned
{const sn=TAG.bots.find(q=>q.pers.label==='Sneak');TAG.it=sn.key;sn.count=0;sn.safeT=0;sn.stun=0;TAG.safeT=0;sn.x=P.position.x+3;sn.z=P.position.z;sn.y=py;let t=0;for(;t<300&&TAG.it!=='me';t++)__step(1);
 ok('the Sneak, as It, catches you ('+(t/60).toFixed(1)+'s)',TAG.it==='me');
 TAG.it=sn.key;sn.count=0;sn.safeT=0;sn.stun=3;sn.x=P.position.x+.5;sn.z=P.position.z;__step(20);ok('a stunned It can\'t tag you',TAG.it===sn.key);sn.stun=0}
ok('name tags show each personality',TAG.bots.map(q=>q.pers.label).join(',')==='Hunter,Trickster,Sneak');
// hops: the It hops up after you onto a low ledge
TAG.it='bot0';const h=TAG.bots[0];h.count=0;h.safeT=0;h.stun=0;h.hopT=0;
pause();ok('pause during Tag: '+btns().join(', '),btns().join('|')==='Resume|Restart tag|End tag|Moves|Settings|Quit to menu');resume();
// end: results, least time first
TAG.itT.me=3;TAG.itT.bot0=20;TAG.itT.bot1=30;TAG.itT.bot2=40;TAG.it='bot2';TAG.t=.02;__step(3);
ok('time up: results screen, least time as It wins',state==='over'&&$('ovT').textContent==='You win!'&&$('ovP').querySelectorAll('.warsres li').length===4);
click('Keep playing');__step(5);ok('keep playing: back to free roam, orbs back, no bots',state==='play'&&!TAG.on&&TAG.bots.length===0&&orbs.length>0);
// modes don't overlap
startTag();__step(5);press('start');__step(2);ok('the PLAY menu stays shut during Tag',state==='play'&&TAG.on);
keys.Enter=true;__step(60);keys.Enter=false;__step(2);ok('hold △ / Enter restarts Tag',TAG.on&&TAG.cd>0);
pause();click('End tag');__step(3);ok('End tag',!TAG.on);
// ----- with a friend -----
let mine={};const me=()=>({peer:'a1',sameTab:true,isMe:true,by:'u1',presence:mine});let bob=null;
MP.lobby={peers:()=>bob?[me(),bob]:[me()],presence:async pt=>{mine=Object.assign({},mine,pt);for(const k in pt)if(pt[k]===null)delete mine[k]},onPeers:f=>{setTimeout(()=>f({}),0);return()=>{}},join:async()=>{throw{code:'not_permitted'}}};
MP.user={profiles:async()=>({})};MP.on=true;MP.room=null;MP.roomName='';MP.me='a1';
const tick=async n=>{for(let i=0;i<n;i++){__step(1);if(i%7==0)await new Promise(r=>setTimeout(r,60))}};
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();await tick(10);
const bobP=x=>({peer:'b2',sameTab:false,isMe:false,by:'u2',presence:Object.assign({w:mine.w,nm:'Bob',ch:3,of:0,p:[P.position.x+5,0,P.position.z,0],q:poseOf(),sc:0,fr:1,t:[0,''],c:[0,[],[]],sb:[],hb:[],yw:0,z:0,H:null},x)});
// Bob starts Tag and he's It
bob=bobP({tm:['b2-tag1',100,0,1,null]});await tick(60);ok('Bob starts Tag: you join, no computer players, Bob is It',TAG.on&&TAG.id==='b2-tag1'&&TAG.bots.length===0&&TAG.it==='b2');
ok('your game shows in your presence',Array.isArray(mine.tm)&&mine.tm[0]==='b2-tag1'&&mine.tm[3]===0);
ok('Bob gets an IT! sign',MP.av.get('b2')&&MP.av.get('b2').it&&MP.av.get('b2').it.visible);
// Bob tags you
bob=bobP({tm:['b2-tag1',95,4,0,[1,'a1']]});await tick(20);ok('Bob tags you: you\'re It',TAG.it==='me'&&mine.tm&&mine.tm[3]===1);
// you tag Bob back after the no-tag-back time
await tick(150);while(TAG.cd>0)await tick(5);TAG.count=0;TAG.safeT=0;bob=bobP({p:[P.position.x+.6,py,P.position.z,0],tm:['b2-tag1',90,4,0,[1,'a1']]});await tick(20);
ok('you tag Bob: your presence tells him',TAG.it==='b2'&&Array.isArray(mine.tm[4])&&mine.tm[4][1]==='b2');
pause();click('End tag');await tick(5);
MP.on=false;MP.lobby=null;MP.room=null;MP.roomName='';menu();return out.join('\n')})()
