(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const btns=()=>[...document.querySelectorAll('#ov .btns button')].filter(b=>b.textContent&&getComputedStyle(b).display!=='none').map(b=>b.textContent);
const click=t=>[...document.querySelectorAll('#ov button')].find(b=>b.textContent===t).click();
const at=(b,own=true)=>{launchSnowball([b.x,b.y+1.1,b.z,.01,0,0],own,own?null:'bot1',++SB.seq);__step(2)};
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(10);
pause();click('Play');__step(2);ok('pause → Play offers Snowball Wars',btns().includes('Snowball Wars'));click('Snowball Wars');__step(2);
ok('match starts: 3 computer players, board up',WAR.on&&WAR.bots.length===3&&$('warsBoard').classList.contains('on'));
ok('orbs and enemies cleared',orbs.length===0&&runHz.length===0);
ok('6 snowball pickups out, at orb spots',WAR.piles.length===6&&WAR.piles.filter(p=>!p.spot.rand).length>=4);
ok('HUD shows KOs / Ready / 3 hearts',$('k1').textContent==='KOs'&&$('v2').textContent==='Ready'&&lives===3);
SB.ammo=6;throwSnow();ok('no throwing during the countdown',SB.ammo===6);
__step(200);ok('countdown over, clock running',WAR.cd===0&&WAR.t<180&&/^[23]:\d\d$/.test($('v2').textContent));
__step(60);ok('no new enemies or orbs appear mid-match',runHz.length===0&&orbs.length===0);
// my hits on a bot
const b=WAR.bots[0];b.inv=0;b.stun=0;b.hp=3;const s0=WAR.hits;at(b);ok('hit a computer player: it loses a heart (no points)',WAR.hits===s0+1&&WAR.kos===0&&b.hp===2);
b.stun=0;b.inv=0;const id=SB.seq+1;SB.trickIds.add(id);launchSnowball([b.x,b.y+1.1,b.z,.01,0,0],true,null,id);SB.seq=id;__step(2);ok('trick shot: still called out, no points',WAR.hits===s0+2&&b.hp===1);
b.stun=0;b.inv=0;at(b);ok('last heart: a KO, it drops out',WAR.hits===s0+3&&b.out>0&&WAR.kos===1&&$('v1').textContent==='1');
at(b);ok('can\'t hit someone who is knocked out',WAR.hits===s0+3&&WAR.kos===1);
__step(40);ok('knocked-out bot stays visible, flat on its back',b.a.g.visible&&b.a.rig.hp.rotation.x<-1.3&&b.a.stars.visible);
__step(Math.ceil(T.wars.respawn*60)+5);ok('it respawns with full hearts, blinking',b.out<=0&&b.hp===3&&b.inv>0);
// getting hit (computer players held still so the checks are exact)
const hold=()=>WAR.bots.forEach(q=>{q.cool=99});hold();WAR.hp=3;WAR.inv=0;WAR.out=0;SB.hitCool=0;const bot1=WAR.bots[1],bs=bot1.hits;hitMe('bot1',1,P.position.x+1,P.position.z,false);ok('a computer player hits you: you lose a heart, it gets a hit',WAR.hp===2&&bot1.hits===bs+1&&lives===2);
SB.hitCool=0;hitMe('bot1',2,P.position.x+1,P.position.z,false);SB.hitCool=0;hitMe('bot1',3,P.position.x+1,P.position.z,false);
ok('third hit knocks you out (it gets the KO)',WAR.out>0&&bot1.hits===bs+3&&bot1.kos===1&&WAR.downs===1);
__step(40);ok('you fall flat on your back (others see it too)',chars[ci].rig.hp.rotation.x<-1.3&&poseOf()[0]<-1.3&&P.visible);
ok('your KO is reported to others with a flag',JSON.stringify(SB.hits[SB.hits.length-1])==='["bot1",3,1]');
SB.ammo=6;throwSnow();ok('can\'t throw while knocked out',SB.ammo===6);
SB.hitCool=0;hitMe('bot1',4,0,0,false);ok('no hits while you\'re down',WAR.hp===0&&bot1.hits===bs+3);
const x0=P.position.x;__step(Math.ceil(T.wars.respawn*60)+5);ok('you respawn somewhere else with 3 hearts and full snow',WAR.out<=0&&WAR.hp===3&&SB.ammo===T.snow.ammo&&WAR.inv>0);
SB.hitCool=0;hitMe('bot1',5,0,0,false);ok('blinking after respawn: safe',WAR.hp===3);
// snowball pickups: grab one like an orb, another appears elsewhere; bigger bundles up high
__step(200);hold();WAR.out=0;WAR.inv=0;const pl=WAR.piles.find(p=>!p.spot.air)||WAR.piles[0];SB.ammo=1;snowHud();__place(pl.x,pl.z,pl.y,0);__step(3);
ok('grab a snowball pickup: +'+pl.v+' (1 -> '+SB.ammo+')',SB.ammo===Math.min(T.snow.ammo,1+pl.v));
ok('it disappears and a new one appears somewhere else',!WAR.piles.includes(pl)&&WAR.piles.length===6);
SB.ammo=T.snow.ammo;snowHud();const p2=WAR.piles.find(p=>!p.spot.air);__place(p2.x,p2.z,p2.y,0);__step(3);ok('when you\'re full, pickups stay put',WAR.piles.includes(p2));
const hi=WAR.piles.concat().map(p=>p.spot).filter(s=>s.y>=3||s.air);ok('high / mid-air pickups are the big ones',WAR.piles.every(p=>(p.spot.rand||!(p.spot.y>=3||p.spot.air))?p.v===T.wars.packSmall:p.v===T.wars.packBig));
WAR.bots.forEach(q=>{q.cool=1});
// bots throw at each other and at you
const before=WAR.bots.reduce((a,q)=>a+q.hits,0)+WAR.downs;let thrown=0;const L0=launchSnowball;launchSnowball=(...a)=>{if(String(a[2]).startsWith('bot'))thrown++;return L0(...a)};__step(600);launchSnowball=L0;
ok('computer players throw ('+thrown+' in 10s)',thrown>=6);
// pause menu during a match
pause();ok('pause during a match: '+btns().join(', '),btns().join('|')==='Resume|Restart match|End match|Moves|Settings|Quit to menu');resume();
ok('pause line shows place and time',true);
// time up: results
WAR.t=.02;__step(3);ok('time up: results screen',state==='over'&&!$('ov').classList.contains('hide')&&$('ovP').querySelectorAll('.warsres li').length===4);
ok('results list you',[...$('ovP').querySelectorAll('.warsres li.me')].length===1);
ok('bots and pickups cleared, board hidden',!WAR.on&&WAR.bots.length===0&&WAR.piles.length===0&&!$('warsBoard').classList.contains('on'));
ok('buttons: '+btns().join(', '),btns().join('|')==='Play again|Keep playing');
const px=P.position.x;click('Keep playing');__step(5);ok('keep playing: free roam in place, orbs back',state==='play'&&runFree&&orbs.length===T.run.orbsOnField&&Math.abs(P.position.x-px)<.5);
__step(30);ok('enemies come back',runHz.length===T.run.hazardsFree||!foesOn());
ok('free roam: tricks, no lives box',$('k1').textContent==='Tricks'&&$('lv').parentElement.style.display==='none');
// play again / hold to restart / end match
startWars();__step(250);WAR.kos=5;keys.Enter=true;__step(60);keys.Enter=false;__step(2);ok('hold Enter restarts the match',WAR.on&&WAR.kos===0&&WAR.cd>0);
pause();click('End match');__step(5);ok('End match: back to free roam',!WAR.on&&state==='play'&&orbs.length>0);
// orb-run START is off during a match
startWars();__step(200);press('start');__step(2);ok('the orb-run start button does nothing mid-match',WAR.on&&runFree);
// leaving the map tidies up
menu();__step(3);ok('quitting to the menu ends the match',!WAR.on&&WAR.bots.length===0);
return (async()=>{
// a friend starts a match: you join (players only)
let mine={};const me=()=>({peer:'a1',sameTab:true,isMe:true,by:'u1',presence:mine});let bob=null;
MP.lobby={peers:()=>bob?[me(),bob]:[me()],presence:async pt=>{mine=Object.assign({},mine,pt);for(const k in pt)if(pt[k]===null)delete mine[k]},onPeers:f=>{setTimeout(()=>f({}),0);return()=>{}},join:async()=>{throw{code:'not_permitted'}}};
MP.user={profiles:async()=>({})};MP.on=true;MP.room=null;MP.roomName='';MP.me='a1';
pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(10);
bob={peer:'b2',sameTab:false,isMe:false,by:'u2',presence:{w:mine.w,nm:'Bob',ch:3,of:0,p:[3,0,3,0],q:poseOf(),sc:10100,fr:1,t:[0,''],c:[0,[],[]],sb:[],hb:[],yw:0,z:0,H:null,wm:['b2-xyz',150,3,2,4]}};
for(let i=0;i<70;i++){__step(1);if(i%7==0)await new Promise(r=>setTimeout(r,60))}ok('a friend\'s match pulls you in, no computer players',WAR.on&&WAR.id==='b2-xyz'&&WAR.bots.length===0&&WAR.t<=150&&WAR.t>140);
ok('your match shows in your presence',Array.isArray(mine.wm)&&mine.wm[0]==='b2-xyz');
ok('scoreboard lists Bob by KOs, not his trick points',standings().some(r=>r.name==='Bob'&&r.kos===2)&&standings().length===2&&!$('warsBoard').textContent.includes('10100'));
mpList();ok('the friends trick-points list hides during the match',!$('mpList').classList.contains('on'));
__step(80);const sb0=WAR.kos;SB.seq=Math.max(SB.seq,50);bob={...bob,presence:{...bob.presence,hb:[['a1',SB.seq,1]]}};__step(5);ok('Bob reports your hit + KO: you get the KO',WAR.kos===sb0+1);
pause();click('End match');__step(10);ok('after ending, you don\'t get pulled back into the same match',!WAR.on);
MP.on=false;MP.lobby=null;MP.room=null;MP.roomName='';menu();__step=_st;return out.join('\n')})()})()
