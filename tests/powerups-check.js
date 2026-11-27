(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
select('run',0);ci=2;showChar();confirmChar();__step(3);if(state==='paused')resume();startWars();__step(200);
ok('No power-up before the first one is due',!PWR.box);
PWR.next=.01;__step(2);ok('A power-up appears in Snowball Wars',!!PWR.box&&['frenzy','blitz'].includes(PWR.box.kind),PWR.box&&PWR.box.kind);
// frenzy
const grab=k=>{PWR.box.kind=k;__place(PWR.box.x,PWR.box.z,PWR.box.y,0);__step(2)};
grab('frenzy');ok('Walking into it picks it up',!PWR.box&&PWR.frenzy>0);
const am=SB.ammo,n0=SB.seq;const dirs=new Set();const before=SB.list.length;__step(60);
const mine=SB.list.filter(b=>b.own);mine.forEach(b=>dirs.add(Math.round(Math.atan2(b.vx,b.vz)/(PI/4))));
ok('Frenzy sprays snowballs',SB.seq-n0>=8,SB.seq-n0);ok('...in all directions',dirs.size>=6,dirs.size);ok('...without using your snowballs',SB.ammo>=am);
__step(Math.ceil(T.power.frenzy*60));ok('Frenzy wears off',PWR.frenzy===0);const n1=SB.seq;__step(30);ok('...and the spraying stops',SB.seq===n1);
// blitz
PWR.next=.01;__step(2);grab('blitz');ok('Blitz picked up',PWR.blitz>0);
const hp=WAR.hp;hitMe('bot0',999,P.position.x+1,P.position.z,false,true);ok('Blitz: snowballs don\'t hurt you',WAR.hp===hp);
const b=WAR.bots[0];b.out=0;b.inv=0;b.x=P.position.x+.6;b.z=P.position.z;b.y=py;const k0=WAR.kos;__step(2);
ok('Blitz: touching a computer player knocks it out',b.out>0&&WAR.kos===k0+1,b.out.toFixed(2)+' kos '+WAR.kos);
const b1=WAR.bots[1];b1.out=0;b1.inv=0;b1.x=P.position.x+5;b1.z=P.position.z;b1.retarget=9;__step(20);ok('...and they run away from you',Math.hypot(b1.x-P.position.x,b1.z-P.position.z)>5,Math.hypot(b1.x-P.position.x,b1.z-P.position.z).toFixed(1));
ok('Blitz makes you faster',pwrSpeed()>1);
__step(Math.ceil(T.power.blitz*60));ok('Blitz wears off',PWR.blitz===0&&!warsShielded()||WAR.inv>0);
// on fire: two KOs inside the window
PWR.fire=0;PWR.kos=[];award('me',true,false);ok('One KO isn\'t enough',PWR.fire===0);
WAR.t-=T.power.fireWindow+1;award('me',true,false);ok('Two KOs far apart aren\'t either',PWR.fire===0);
award('me',true,false);ok("Two KOs within 10 seconds: You're on Fire!",PWR.fire>0);
award('bot0',true,false);ok('...computer players\' KOs don\'t count for you',PWR.fire>0);
SB.ammo=6;SB.cool=0;SB.stun=0;WAR.inv=0;const n2=SB.seq;throwSnow(false);const ball=SB.list.find(x=>x.id===SB.seq);
ok('On fire, a quick throw is a charged snowball',SB.seq===n2+1&&ball&&ball.ch);
WAR.inv=0;invuln=0;SB.hitCool=0;WAR.hp=1;hitMe('bot1',1001,P.position.x+1,P.position.z,false,false);ok('Getting knocked out puts the fire out',WAR.out>0&&PWR.fire===0);
__step(Math.ceil((T.wars.respawn+.2)*60));SB.cool=0;SB.stun=0;SB.ammo=6;throwSnow(false);ok('...and throws are normal again',!SB.list.find(x=>x.id===SB.seq).ch);
ok('The badge shows while something is active',(PWR.fire=3,pwrBadge(),$('pwrBadge').classList.contains('on')));
warsStop();__step(2);ok('Ending the match clears power-ups',!PWR.box&&!PWR.fire&&!PWR.blitz&&!PWR.frenzy&&!$('pwrBadge').classList.contains('on'));
PWR.fire=5;SB.ammo=6;SB.cool=0;throwSnow(false);ok('Outside a match there\'s no fire',!SB.list.find(x=>x.id===SB.seq).ch);PWR.fire=0;
return out.join('\n')})()
