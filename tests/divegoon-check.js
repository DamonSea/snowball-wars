(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
select('run',0);ci=2;showChar();confirmChar();__step(3);if(state==='paused')resume();setFoeStyle('crew');__step(3);
let gid=0;const goon=()=>{let h=runHz.find(h=>!h.dead&&h.kind==='goon');if(!h){runQ.length=0;spawnRunHz('goon');h=runHz[runHz.length-1]}return h};let g=goon();
const pin=()=>{g.g.position.x=3;g.g.position.z=3;g.vx=g.vz=0;g.cool=9;g.throwT=9};
const run=(mode)=>{g=goon();lives=3;invuln=0;const l0=lives;pin();__place(3,mode==='slide'?5.2:7,0,Math.PI);__step(1);pin();
  face=Math.PI;A.mode=mode;A.spd=9;A.t=mode==='slide'?T.flip.dive.slideTime:A.t;if(mode==='dive'){vy=2;grounded=false}
  let killed=false;for(let i=0;i<50;i++){__step(1);if(g.dead||!runHz.includes(g)){killed=true;break}pin()}return{killed,hurt:lives<l0,names:[...TR.names].join(',')}};
let r=run('dive');ok('Diving into a snow goon knocks it out',r.killed,r.names);ok('...without hurting you',!r.hurt);ok('...as a Dive Bomb',/Dive Bomb/.test(r.names));
__step(30);r=run('slide');ok('Belly-sliding into one does too',r.killed&&!r.hurt);
// walking into one still hurts
__step(30);g=goon();g.vx=g.vz=0;g.cool=9;g.throwT=9;lives=3;invuln=0;pin();__place(3,6,0,Math.PI);__k({KeyW:true});let hurt=false;for(let i=0;i<80;i++){__step(1);invuln=0;if(lives<3){hurt=true;break}pin()}__k({});
ok('Just walking into one does not knock it out',!g.dead&&runHz.includes(g));
return out.join('\n')})()
