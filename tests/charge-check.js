(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x?' -> '+x:''));
const calm=()=>runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});const _st=__step;__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const fdown=()=>{keys.KeyF=true;press('throw')},fup=()=>{keys.KeyF=false};
const vis=()=>aimDots.filter(m=>m.visible).length;
__place(0,10,0,0);SB.ammo=6;SB.cool=0;__step(2);
// tap = throw right away, normal ball
let n0=SB.list.length;fdown();__step(1);fup();__step(2);let b=SB.list[SB.list.length-1];ok('Tap throws right away (a normal snowball)',SB.list.length===n0+1&&!b.ch&&SB.ammo===5);
// hold = arc
__step(30);fdown();__step(10);ok('Holding shows the aim arc',SB.aim.on&&vis()>8&&aimRing.visible,vis()+' dots');ok('Arc is white before it charges',aimDots[0].material===aimM&&!SB.aim.full);
ok('Nothing thrown while holding',SB.list.filter(q=>q.own).length<=1&&SB.ammo===5);
// arc matches the throw
const o=throwVec(face);let x=o[0],y=o[1],z=o[2],vy=o[4];{vy-=T.snow.gravity*.035;x+=o[3]*.035;y+=vy*.035;z+=o[5]*.035}
ok('Arc starts on the throw path',Math.hypot(aimDots[0].position.x-x,aimDots[0].position.y-y,aimDots[0].position.z-z)<.3);
__step(55);ok('After 1 second it charges: the arc turns gold',SB.aim.full&&aimDots[0].material===aimGold);
n0=SB.list.length;fup();__step(2);b=SB.list[SB.list.length-1];ok('Letting go throws a charged snowball (bigger, glowing)',SB.list.length===n0+1&&b.ch&&b.m.material===sbCharged&&b.m.scale.x>1.4);
ok('Arc hides after the throw',vis()===0&&!aimRing.visible);
ok('Friends are told it is charged',SB.sent[SB.sent.length-1][8]===1);
// an incoming charged ball (a friend's)
SB.hitCool=0;SB.stun=0;hitMe('peerX',99,P.position.x+1,P.position.z,false,true);ok('Getting hit by a charged ball stuns longer',Math.abs(SB.stun-T.snow.stun*T.snow.chargeStun)<.01);__step(140);
// Snowball Wars: 2 hearts
startWars();__step(220);WAR.bots.forEach(q=>{q.cool=99});const bt=WAR.bots[0];bt.inv=0;bt.stun=0;bt.hp=3;
launchSnowball([bt.x,bt.y+1.1,bt.z,.01,0,0],true,null,++SB.seq,false,true);__step(2);ok('Wars: a charged hit takes 2 hearts',bt.hp===1,'hp '+bt.hp);
bt.stun=0;bt.inv=0;launchSnowball([bt.x,bt.y+1.1,bt.z,.01,0,0],true,null,++SB.seq,false,false);__step(2);ok('Wars: a normal hit takes 1 (KO here)',bt.hp===0&&WAR.kos===1);
WAR.hp=3;WAR.inv=0;WAR.out=0;SB.hitCool=0;hitMe('peerY',5,P.position.x+1,P.position.z,false,true);ok('Wars: a friend\'s charged hit takes 2 of your hearts',WAR.hp===1);
warsStop(false);__step(5);
// Collectathon: twice the orbs knocked loose
setRivals(2);beginTimed();__step(220);orbN=8;SB.hitCool=0;invuln=0;hitMe('rb0',7,P.position.x+1,P.position.z,false,true);ok('Collectathon: a charged hit knocks 4 orbs loose',orbN===4,'left '+orbN);
const rb=RACE.bots[0];rb.n=6;rb.stun=0;launchSnowball([rb.x,rb.y+1.1,rb.z,.01,0,0],true,null,++SB.seq,false,true);__step(2);ok('Collectathon: a charged hit on a rival knocks 4 loose',rb.n===2,'left '+rb.n);
stopOrbRun();__step(3);
// aim cancels when you can't throw
SB.ammo=3;SB.cool=0;fdown();__step(5);SB.stun=1;__step(2);ok('Getting stunned cancels the aim (no throw)',!SB.aim.on&&vis()===0&&SB.ammo>=3);fup();__step(60);
// pad R1
const GP_={id:'t',index:0,connected:true,timestamp:1,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};const rg=navigator.getGamepads.bind(navigator),rh=document.hasFocus;navigator.getGamepads=()=>[GP_];document.hasFocus=()=>true;
SB.cool=0;SB.stun=0;__step(3);GP_.buttons[5]={pressed:true,value:1};__step(70);ok('Pad: holding R1 aims and charges',SB.aim.on&&SB.aim.full);n0=SB.list.length;GP_.buttons[5]={pressed:false,value:0};__step(2);ok('Pad: letting go of R1 throws it charged',SB.list.length===n0+1&&SB.list[SB.list.length-1].ch);
navigator.getGamepads=rg;document.hasFocus=rh;__step(2);
return out.join('\n')})()
