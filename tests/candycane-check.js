(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
const mi=RUNMAPS.findIndex(M=>M.name==='Christmas Village');select('run',mi);ci=2;showChar();confirmChar();__step(3);if(state==='paused')resume();
const canes=advCol.filter(c=>c.pole&&Math.abs(c.top-4.45)<.01);let over=0,tries=0;
for(const c of canes){for(const[dx,dz,k]of[[0,1,'KeyS'],[0,-1,'KeyW'],[1,0,'KeyD'],[-1,0,'KeyA']]){tries++;
  __place(c.x-dx*4,c.z-dz*4,0,Math.atan2(dx,dz));const tg=tryGrab;tryGrab=()=>{};__step(2);__k({[k]:true});__step(8);
  // a big launch: as if off a bounce pad
  vy=16;grounded=false;A.mode='jump';let crossed=false;for(let i=0;i<120;i++){__step(1);if((P.position.x-c.x)*dx+(P.position.z-c.z)*dz>1){crossed=true;break}}
  __k({});tryGrab=tg;if(crossed)over++;__step(20)}}
ok('Leaping high over a candy cane carries you past it ('+over+'/'+tries+'; the rest meet a stall beyond)',over>=tries-3);
// on the ground the cane still stops you
const c=canes[0];__place(c.x,c.z+3,0,PI);CL.cool=99;__step(2);__k({KeyW:true});__step(60);__k({});CL.cool=0;ok('Walking into one still bumps (or grabs) you',Math.hypot(P.position.x-c.x,P.position.z-c.z)>.6||CL.on);
return out.join('\n')})()
