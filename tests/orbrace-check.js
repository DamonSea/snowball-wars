(async()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const calm=()=>{runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0})};__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
setRivals(2);menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(10);
ok('Settings has Orb run rivals (2 computer / 1 computer / Off)',LOOK.rivals&&LOOK.rivals.opts.length===3&&LOOK.rivals.get()===0);
beginTimed();__step(2);ok('solo orb run brings 2 computer rivals and a scoreboard',RACE.on&&RACE.bots.length===2&&$('warsBoard').classList.contains('on'));
ok('board lists you and both rivals',$('warsBoard').querySelectorAll('.wbr').length===3);
__step(200);const n0=orbs.length;
// rivals collect ground orbs and the field refills
__step(60*25);ok('rivals grab ground orbs ('+RACE.bots.map(b=>b.name+' '+b.n).join(', ')+')',RACE.bots.some(b=>b.n>0));
ok('the field refills as they grab',orbs.filter(o=>!o.spill).length===n0);
// getting hit knocks points loose
orbN=5;hud();ok('HUD shows your orb count',$('k1').textContent==='Orbs'&&$('v1').textContent==='5');ok('board shows orb icons and counts, no points',$('warsBoard').querySelectorAll('.orbic').length===3);const c0=orbs.length;SB.hitCool=0;invuln=0;hitMe('rb0',1,P.position.x+1,P.position.z,false);__step(1);
ok('hit with 5 orbs: drop 2, keep 3',orbN===3);
const sp=orbs.filter(o=>o.spill);ok('two orbs land around you',orbs.length===c0+2&&sp.length===2&&sp.every(o=>Math.hypot(o.g.position.x-P.position.x,o.g.position.z-P.position.z)<3.5));
SB.stun=0;__step(60);const o=sp[0];__place(o.g.position.x,o.g.position.z,0,0);__step(4);ok('grab one back: +1, and it does not respawn',orbN>=4&&!orbs.includes(o)&&orbs.filter(q=>q.spill).length<=1);
orbN=1;SB.hitCool=0;invuln=0;const c1=orbs.length;hitMe('rb0',2,P.position.x+1,P.position.z,false);ok('with 1 orb: drop just that one',orbN===0&&orbs.length===c1+1);
SB.stun=0;__step(60);orbN=0;SB.hitCool=0;invuln=0;const c1b=orbs.length;hitMe('rb0',3,P.position.x+1,P.position.z,false);ok('with no orbs: nothing drops',orbN===0&&orbs.length===c1b);
// hitting a rival knocks its points loose
const b=RACE.bots[0];b.n=3;b.stun=0;const c2=orbs.filter(q=>q.spill).length;launchSnowball([b.x,b.y+1.1,b.z,.01,0,0],true,null,++SB.seq);__step(2);
ok('hit a rival with 3 orbs: it drops 2',b.n===1&&orbs.filter(q=>q.spill).length===c2+2);
// rivals throw at you
let thrown=0;const L0=launchSnowball;launchSnowball=(...a)=>{if(String(a[2]).startsWith('rb'))thrown++;return L0(...a)};__place(b.x+6,b.z,0,0);__step(600);launchSnowball=L0;ok('rivals throw at you ('+thrown+' in 10s)',thrown>=2);
// end of run: place in the banner, rivals gone
orbN=999;time=.02;__step(3);ok('time up: banner shows your place',/You win the race!/.test($('hint').textContent));
ok('rivals and board cleared, back in free roam',!RACE.on&&RACE.bots.length===0&&!$('warsBoard').classList.contains('on')&&runFree);
// stop mid-run
beginTimed();__step(250);stopOrbRun();__step(2);ok('Stop orb run removes the rivals',!RACE.on&&RACE.bots.length===0);
// classic solo run
setRivals(0);beginTimed();__step(5);ok('rivals Off: the classic solo run',!RACE.on&&!runFree&&RACE.bots.length===0);stopOrbRun();setRivals(2);
// settings computer player stays out of the race
// ----- with a friend -----
let mine={};const me=()=>({peer:'a1',sameTab:true,isMe:true,by:'u1',presence:mine});let bob=null;
MP.lobby={peers:()=>bob?[me(),bob]:[me()],presence:async pt=>{mine=Object.assign({},mine,pt);for(const k in pt)if(pt[k]===null)delete mine[k]},onPeers:f=>{setTimeout(()=>f({}),0);return()=>{}},join:async()=>{throw{code:'not_permitted'}}};
MP.user={profiles:async()=>({})};MP.on=true;MP.room=null;MP.roomName='';MP.me='a1';
const tick=async n=>{for(let i=0;i<n;i++){__step(1);if(i%7==0)await new Promise(r=>setTimeout(r,60))}};
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();await tick(10);
const bobP=(x)=>({peer:'b2',sameTab:false,isMe:false,by:'u2',presence:Object.assign({w:mine.w,nm:'Bob',ch:3,of:0,p:[3,0,3,0],q:poseOf(),sc:400,fr:0,t:[0,''],c:[0,[],[]],sb:[],hb:[],yw:0,z:0,H:null},x)});
bob=bobP({or:['b2-race1',50,4]});await tick(60);
ok('Bob starts an orb run: you join it, no computer rivals',RACE.on&&RACE.id==='b2-race1'&&!runFree&&RACE.bots.length===0&&time<=50&&time>40);
ok('your run shows in your presence',Array.isArray(mine.or)&&mine.or[0]==='b2-race1');
ok('scoreboard lists Bob\'s orbs, not his points',raceRows().some(r=>r.name==='Bob'&&r.n===4)&&!$('warsBoard').textContent.includes('400'));
// you're the host here (a1 < b2): Bob asks for knocked-loose orbs, you make them
const s0=orbs.filter(o=>o.spill).length;bob=bobP({or:['b2-race1',45],sp:[[1,4,4,2]]});await tick(20);ok('host makes the orbs Bob knocked loose',orbs.filter(o=>o.spill).length===s0+2);
bob=bobP({or:['b2-race1',44],sp:[[1,4,4,2]]});await tick(20);ok('...only once',orbs.filter(o=>o.spill).length===s0+2);
while(runCD>0)await tick(5);time=.02;await tick(5);ok('race ends: back to free roam, no auto-rejoin of the same race',runFree&&!RACE.on);await tick(40);ok('still not rejoined',runFree);
// as a client (Bob hosts), your hit asks the host for the orbs
bob={...bobP({or:null}),peer:'a0'};await tick(30);beginTimed();await tick(220);MP.client=true;orbN=3;SB.hitCool=0;invuln=0;hitMe('a0',9,P.position.x+1,P.position.z,false);
ok('as a client, a hit asks the host for 2 orbs',RACE.sp.length>0&&RACE.sp[RACE.sp.length-1][3]===2&&orbN===1);
MP.on=false;MP.lobby=null;MP.room=null;MP.roomName='';MP.client=false;menu();__step=_st;return out.join('\n')})()
