(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
setFoeStyle('crew');menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(10);
runHz.forEach(h=>rmObj(h.g));runHz=[];runQ=[];
const mk=(x,z)=>{const f=makeFoe('penguin',runL.grp);f.g.position.set(x,0,z);const h=Object.assign(f,{vx:0,vz:0,id:'p'+x,st:'walk',t:1,face:0,wa:0,cool:9,robbed:0,mine:0});runHz.push(h);return h};
const keep=()=>{const want=runHz.length;return n=>{for(let i=0;i<n;i++){_st(1);runQ=[];while(runHz.length>want)rmObj(runHz.pop().g)}}};
__place(0,8,0,0);__step(3);const p1=mk(3,8),p2=mk(5,10),far=mk(-20,-5);const S=keep();
lives=3;let wind=0,hurtN=0;const L0=lives;for(let i=0;i<600;i++){S(1);if(p1.st==='windup'||p1.st==='slide'||p2.st==='windup'||p2.st==='slide')wind++;}
ok('calm penguins never wind up or charge (10s next to you)',wind===0);
p1.g.position.set(P.position.x+.3,0,P.position.z);S(5);ok('bumping into a calm penguin doesn\'t hurt',lives===L0);
ok('they look calm (flat brows, no blush)',!p1.m.cheeks[0].visible);
// attack one: it survives, gets angry, calls its friend; the far one stays calm
p1.g.position.set(P.position.x,0,P.position.z-1.1);face=Math.PI;__step(1);ATK.cool=0;dispatchEvent(new KeyboardEvent('keydown',{code:'KeyJ',bubbles:true}));S(3);dispatchEvent(new KeyboardEvent('keyup',{code:'KeyJ',bubbles:true}));S(10);
ok('first hit: the penguin survives',!p1.dead&&runHz.includes(p1));
ok('...and gets angry (red cheeks)',p1.angry>0&&p1.m.cheeks[0].visible);
ok('its friend nearby gets angry too',p2.angry>0);ok('a far-away penguin stays calm',!far.angry);
// angry ones charge
let charged=false;for(let i=0;i<600;i++){S(1);if(p1.st==='windup'||p2.st==='windup'||p2.st==='slide'){charged=true;break}}ok('angry penguins charge you',charged);
// second hit takes it out
p1.st='walk';p1.hurtT=0;p1.g.position.set(P.position.x,0,P.position.z-1.1);face=Math.PI;S(1);ATK.cool=0;ATK.t=0;dispatchEvent(new KeyboardEvent('keydown',{code:'KeyJ',bubbles:true}));S(3);dispatchEvent(new KeyboardEvent('keyup',{code:'KeyJ',bubbles:true}));S(5);
ok('second hit takes an angry penguin out',p1.dead||!runHz.includes(p1));
// snowball on a calm one: angers, doesn't kill
const p3=mk(-10,-8);const S2=keep();far.angry=0;launchSnowball([p3.g.position.x,1,p3.g.position.z,.01,0,0],true,null,++SB.seq);S2(3);ok('a snowball angers a calm penguin instead of taking it out',p3.angry>0&&runHz.includes(p3));
// grudges wear off
p2.angry=.5;p2.st='walk';S2(60);ok('they calm down after a while',!p2.angry&&!p2.m.cheeks[0].visible);
__step=_st;menu();return out.join('\n')})()
