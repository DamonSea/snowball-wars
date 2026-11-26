(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
select('run',0);ci=2;showChar();confirmChar();__step(5);if(state==='paused')resume();__place(0,0,0,0);SB.ammo=6;SB.cool=0;
let want=1.2;cursorFace=()=>want;
keys.Mouse0=true;press('throw');__step(1);ok('Holding the mouse button aims with the cursor',SB.aim.on&&SB.aim.mouse);
__step(20);const near=(a,b)=>Math.abs(angD(a,b))<.06;ok('Flip spins to face the cursor',near(aimFace(),1.2)&&near(P.rotation.y,1.2),aimFace().toFixed(2));
want=-2;__step(20);ok('...and follows it around',near(aimFace(),-2),aimFace().toFixed(2));
const x0=P.position.x;__k({KeyD:true,Mouse0:true});__step(20);ok('He can run one way while aiming another',near(aimFace(),-2)&&Math.abs(P.position.x-x0)>.5,aimFace().toFixed(2)+' / moved '+(P.position.x-x0).toFixed(2));
const n=SB.ammo;keys.Mouse0=false;__step(2);__k({});ok('Release throws where the cursor points, even mid-run',SB.ammo===n-1&&Math.abs(Math.atan2(SB.list.at(-1).vx,SB.list.at(-1).vz)+2)<.15);
__step(30);SB.cool=0;want=.5;keys.Mouse0=true;press('throw');keys.Mouse0=false;__step(2);ok('A quick click throws straight at the cursor',Math.abs(Math.atan2(SB.list.at(-1).vx,SB.list.at(-1).vz)-.5)<.15);
__step(30);SB.cool=0;keys.KeyF=true;press('throw');__k({KeyD:true,KeyF:true});__step(15);ok('F without touching the mouse still aims with the walking keys',!SB.aim.mouse);
MAIM.t=tAll+1;__step(2);ok('Moving the mouse while holding F switches to cursor aiming',SB.aim.mouse);ok('Cancelled aim lets go of the aim direction',(aimEnd(false),aimFace()===face));__k({});keys.KeyF=false;__step(3);
const t=document.createElement('div');t.id='ctlList';document.getElementById('ctl')&&document.getElementById('ctl').appendChild(t);

return out.join('\n')})()
