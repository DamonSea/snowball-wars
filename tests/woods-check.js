(()=>{const out=[];const N=-Math.PI,E=Math.PI/2,W=-Math.PI/2,S=0;
setCam('classic');useRunMap(RUNMAPS.findIndex(M=>M.name==='Woodsy Cabin'));startRun(true);__step(5);
runHz.forEach(h=>h.g.position.set(0,.75,80));const _st=__step;__step=n=>{for(let i=0;i<n;i++){runHz.forEach(h=>{h.g.position.set(0,.75,80);h.vx=h.vz=0});_st(1)}};
const land=()=>{__until(()=>!grounded&&!LH.on&&!CL.on,40);__until(()=>(grounded&&!CL.on)||LH.on,500);const r={y:+py.toFixed(2),x:+P.position.x.toFixed(1),z:+P.position.z.toFixed(1),hang:LH.on,t:[...TR.names].join(',')};keys.Space=false;return r};
const rep=(name,ok,r,extra='')=>out.push((ok?'OK   ':'FAIL ')+name+' -> y='+r.y+' x='+r.x+' z='+r.z+(r.hang?' HANGING':'')+(extra?' '+extra:'')+' | '+r.t);
const pull=r=>{if(r.hang){__k({KeyW:true});__step(45);__k({});__step(5);r.y=+py.toFixed(2);r.x=+P.position.x.toFixed(1);r.z=+P.position.z.toFixed(1)}return r};
const inBox=(r,x0,x1,z0,z1)=>r.x>=x0-.25&&r.x<=x1+.25&&r.z>=z0-.25&&r.z<=z1+.25;
const fresh=()=>{__k({});keys.ShiftLeft=false;keys.Space=false;TR.names=[];__step(2)};
let r;
const dbl=()=>{jumpBuf=.15;keys.Space=true;__until(()=>!grounded,20);__until(()=>grounded,200);keys.Space=false;__step(1);jumpBuf=.15;keys.Space=true;return pull(land())};
const okk=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
okk('Woodsy Cabin replaced Rooftops',RUNMAPS[1].name==='Woodsy Cabin'&&!RUNMAPS.some(M=>M.name==='Rooftops'));
okk('You start by the campfire',Math.hypot(P.position.x,P.position.z+4)<5);
// woodpile -> porch roof (2.6): one running jump west
fresh();__place(8,-10.8,1.3,W);__k({KeyA:true});__step(8);jumpBuf=.15;keys.Space=true;r=pull(land());__k({});rep('Woodpile -> porch roof (running jump)',Math.abs(r.y-2.6)<.1&&r.x<4.9,r);
okk('...scores Woodpile Hop',/Woodpile Hop/.test(r.t),r.t);
// porch roof -> cabin roof: double jump north
fresh();__place(1,-10.2,2.6,N);__k({KeyW:true});__step(4);r=dbl();__k({});rep('Porch roof -> cabin roof (double jump)',r.y>3&&r.z<-12,r);
// ridge -> chimney (6.6)
fresh();__place(2.8,-15,5,E);__k({KeyD:true});__step(6);jumpBuf=.15;keys.Space=true;r=pull(land());__k({});rep('Ridge -> chimney (running jump)',Math.abs(r.y-6.6)<.1,r);
okk('...scores Chimney Sweep',/Chimney Sweep/.test(r.t),r.t);
// Treehouse Leap: running jump east off the treehouse onto the cabin roof
fresh();__place(-16.5,-13,5.2,E);__k({KeyD:true});__until(()=>P.position.x>-13.2,90);jumpBuf=.15;keys.Space=true;r=pull(land());__k({});rep('Treehouse -> cabin roof (running jump)',r.y>3&&r.x>-5,r);
okk('...scores Treehouse Leap',/Treehouse Leap/.test(r.t),r.t);
// stump stairs: top stump -> lookout (4.8) with a double jump
fresh();__place(13.2,-1,2.8,E);__k({KeyD:true});__step(3);r=dbl();__k({});rep('Top stump -> lookout (double jump)',Math.abs(r.y-4.8)<.1,r);
okk('...scores Lookout Climb',/Lookout Climb/.test(r.t),r.t);
// stump to stump
fresh();__place(6.5,-1.1,.7,E);__k({KeyD:true});__step(1);jumpBuf=.15;keys.Space=true;__step(26);__k({});r=pull(land());rep('Stump -> next stump (short hop)',Math.abs(r.y-1.3)<.1,r);
// tents bounce
fresh();__place(-10,-2.6,4,N);vy=-3;grounded=false;{let up=0;for(let i=0;i<90&&!up;i++){__step(1);if(vy>12)up=vy}okk('Tents are bouncy',up>12,up.toFixed(1))}
// the fire: you can't walk through it, but you can hop it
fresh();__place(0,-1.5,0,N);__k({KeyW:true});__step(80);__k({});okk('The fire blocks walking',P.position.z>-3,P.position.z.toFixed(2));
// treehouse ladder and the lookout ladder are poles you can climb
okk('Treehouse rope ladder is climbable',runL.advCol.some(c=>c.pole&&Math.abs(c.x+15)<.1&&c.top>5));okk('Lookout ladder is climbable',runL.advCol.some(c=>c.pole&&Math.abs(c.x-14.5)<.1&&c.top>4.8));
// the pond is ice
fresh();__place(12,-15,.12,N);__step(5);okk('The pond is ice',onIce||(stand&&stand.ice));
// lots of climbable trees
okk('Forest: 40+ climbable pines',runL.advCol.filter(c=>c.tree&&!c.pole).length>=40,runL.advCol.filter(c=>c.tree&&!c.pole).length);
// fire flickers, smoke rises
const f0=runL.grp.children.length;__step(10);okk('Map has its own per-frame effects',typeof runL.tick==='function');
okk('Orb spots',runL.spots.length>=20);okk('Snowmen placed',runL.snowmen.length===4);
return out.join('\n')})()
