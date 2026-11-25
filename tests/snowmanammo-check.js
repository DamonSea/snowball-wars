(()=>{const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(10);
const calm=()=>runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});const _st=__step;__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const s=runL.snowmen[0];clearDrops();
// a target snowman, knocked down with a snowball: no instant snowballs, a pickup where it stood
__place(s.x+6,s.z,0,0);__step(2);SB.ammo=1;snowHud();s.up=true;s.g.visible=true;launchSnowball([s.x,1.2,s.z,.01,0,0],true,null,++SB.seq);__step(2);
ok('snowball knocks a snowman down: no snowballs yet',!s.up&&SB.ammo===1,SB.ammo);
ok('...it leaves a snowball pickup where it stood',DROPS.length===1&&Math.hypot(DROPS[0].x-s.x,DROPS[0].z-s.z)<.01);
const d=DROPS[0];__step(20);ok('the pickup bobs and spins',Math.abs(d.b.position.y-.9)>.001||d.b.rotation.y>0);
__place(s.x,s.z+.5,0,Math.PI);__step(3);ok('walk into it: +2 snowballs (1 -> '+SB.ammo+')',SB.ammo===3&&DROPS.length===0);
// full: it stays until you have room
s.up=true;s.g.visible=true;s.t=0;__step(2);__place(s.x+6,s.z,0,0);__step(2);knockSnowman(s);SB.ammo=T.snow.ammo;__place(s.x,s.z+.5,0,Math.PI);__step(3);ok('with a full load it stays put',DROPS.length===1&&SB.ammo===T.snow.ammo);
SB.ammo=T.snow.ammo-1;__step(2);ok('never above the cap ('+SB.ammo+'/'+T.snow.ammo+')',SB.ammo===T.snow.ammo&&DROPS.length===0);
// it doesn't last forever
s.up=true;s.g.visible=true;s.t=0;__place(s.x+8,s.z,0,0);__step(2);knockSnowman(s);__step(Math.round((T.snow.dropLife-1.5)*60));ok('it blinks near the end',DROPS.length===1);__step(150);ok('and is gone after '+T.snow.dropLife+' s',DROPS.length===0);
// a Winter Crew snowman (goon): drops one too
__place(-5,-5,0,0);__step(2);const g=makeFoe('goon',runL.grp);g.g.position.set(5,0,5);const h=Object.assign(g,{id:'t1',st:'walk',t:1,face:0,wa:0,cool:9,robbed:0,mine:0});SB.ammo=0;killFoe(h,'hit');rmObj(h.g);
ok('smashing a Winter Crew snowman: a pickup, no instant snowballs',SB.ammo===0&&DROPS.length===1&&Math.hypot(DROPS[0].x-5,DROPS[0].z-5)<.01);clearDrops();
const p=makeFoe('penguin',runL.grp);const hp=Object.assign(p,{id:'t3',st:'walk',t:1,face:0,wa:0,cool:9,robbed:0,mine:0});SB.ammo=1;killFoe(hp,'hit');rmObj(hp.g);ok('a penguin drops none',SB.ammo===1&&DROPS.length===0);
// leaving clears them
knockSnowman(s);menu();__step(2);ok('leaving the map clears pickups',DROPS.length===0);
return out.join('\n')})()
