(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(10);
const s=runL.snowmen[0];
// a target snowman, knocked down with a snowball
SB.ammo=1;snowHud();s.up=true;s.g.visible=true;launchSnowball([s.x,1.2,s.z,.01,0,0],true,null,++SB.seq);__step(2);ok('snowball knocks a snowman down: +2 snowballs (1 -> '+SB.ammo+')',!s.up&&SB.ammo===3);
// punched
s.up=true;s.g.visible=true;SB.ammo=2;__place(s.x,s.z+1,0,Math.PI);__step(2);ATK.cool=0;dispatchEvent(new KeyboardEvent('keydown',{code:'KeyJ',bubbles:true}));__step(3);dispatchEvent(new KeyboardEvent('keyup',{code:'KeyJ',bubbles:true}));__step(10);
ok('punching one down: +2 ('+SB.ammo+')',!s.up&&SB.ammo===4);
// never above the cap
s.up=true;s.g.visible=true;SB.ammo=T.snow.ammo-1;knockSnowman(s);ok('capped at a full load ('+SB.ammo+'/'+T.snow.ammo+')',SB.ammo===T.snow.ammo);
// a Winter Crew snowman (goon), smashed
const g=makeFoe('goon',runL.grp);g.g.position.set(5,0,5);const h=Object.assign(g,{id:'t1',st:'walk',t:1,face:0,wa:0,cool:9,robbed:0,mine:0});SB.ammo=0;killFoe(h,'hit');rmObj(h.g);
ok('smashing a Winter Crew snowman: +2 ('+SB.ammo+')',SB.ammo===2);
const g2=makeFoe('goon',runL.grp);const h2=Object.assign(g2,{id:'t2',st:'walk',t:1,face:0,wa:0,cool:9,robbed:0,mine:0});SB.ammo=1;killFoe(h2,'stomp');rmObj(h2.g);ok('stomping one: +2 ('+SB.ammo+')',SB.ammo===3);
// other enemies don't
const p=makeFoe('penguin',runL.grp);const hp=Object.assign(p,{id:'t3',st:'walk',t:1,face:0,wa:0,cool:9,robbed:0,mine:0});SB.ammo=1;killFoe(hp,'hit');rmObj(hp.g);ok('a penguin gives none ('+SB.ammo+')',SB.ammo===1);
menu();return out.join('\n')})()
