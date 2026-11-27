(()=>{const out=[];const N=-Math.PI,E=Math.PI/2,W=-Math.PI/2,S=0;
setCam('classic');useRunMap(RUNMAPS.findIndex(M=>M.name==='Frosty Falls'));startRun(true);__step(5);
runHz.forEach(h=>h.g.position.set(0,.75,80));const _st=__step;__step=n=>{for(let i=0;i<n;i++){runHz.forEach(h=>{h.g.position.set(0,.75,80);h.vx=h.vz=0});_st(1)}};
const land=()=>{__until(()=>!grounded&&!LH.on&&!CL.on,40);__until(()=>(grounded&&!CL.on)||LH.on,500);const r={y:+py.toFixed(2),x:+P.position.x.toFixed(1),z:+P.position.z.toFixed(1),hang:LH.on,t:[...TR.names].join(',')};keys.Space=false;return r};
const rep=(name,ok,r,extra='')=>out.push((ok?'OK   ':'FAIL ')+name+' -> y='+r.y+' x='+r.x+' z='+r.z+(r.hang?' HANGING':'')+(extra?' '+extra:'')+' | '+r.t);
const pull=r=>{if(r.hang){__k({KeyW:true});__step(45);__k({});__step(5);r.y=+py.toFixed(2);r.x=+P.position.x.toFixed(1);r.z=+P.position.z.toFixed(1)}return r};
const inBox=(r,x0,x1,z0,z1)=>r.x>=x0-.25&&r.x<=x1+.25&&r.z>=z0-.25&&r.z<=z1+.25;
const fresh=()=>{__k({});keys.ShiftLeft=false;keys.Space=false;TR.names=[];__step(2)};
let r;
const dbl=()=>{jumpBuf=.15;keys.Space=true;__until(()=>!grounded,20);__until(()=>grounded,200);keys.Space=false;__step(1);jumpBuf=.15;keys.Space=true;return pull(land())};
const LJ=(dive)=>{keys.ShiftLeft=true;__step(1);jumpBuf=.15;keys.Space=true;__step(2);keys.Space=false;keys.ShiftLeft=false;if(dive){__step(24);keys.ShiftLeft=true}const r=pull(land());keys.ShiftLeft=false;return r};
const okk=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
okk('Frosty Falls is the first map; Plaza, Frozen Rink and Jungle Gym are gone',RUNMAPS[0].name==='Frosty Falls'&&!RUNMAPS.some(M=>/Plaza|Frozen Rink|Jungle Gym/.test(M.name)));
okk('Maps: Frosty Falls, Woodsy Cabin, Christmas Village',RUNMAPS.filter(M=>!M.custom).map(M=>M.name).join()==='Frosty Falls,Woodsy Cabin,Christmas Village');
// start -> rink: walk straight in through the gap in the boards
fresh();__place(0,0,0,N);__k({KeyW:true});__step(50);__k({});__step(3);okk('Walk from the start onto the rink ice',onIce||(stand&&stand.ice),P.position.z.toFixed(1));
// the frozen falls: crouch at the top and butt-slide down onto the rink
fresh();__place(0,-21.4,6,S);keys.ShiftLeft=true;let maxV=0;for(let i=0;i<240;i++){__step(1);maxV=Math.max(maxV,Math.hypot(vel.x,vel.z));if(P.position.z>-8&&py<.6)break}keys.ShiftLeft=false;
okk('Butt-slide down the frozen falls onto the rink',P.position.z>-12&&py<.6,'z '+P.position.z.toFixed(1)+' y '+py.toFixed(2)+' top speed '+maxV.toFixed(1));
// rink boards -> Lower Ledge (2.2)
fresh();__place(-6,-12.6,.12,N);__k({KeyW:true});__step(3);r=dbl();__k({});rep('Rink -> Lower Ledge (double jump over the boards)',Math.abs(r.y-2.2)<.1&&r.z<-14,r);
// Lower -> Upper (5.4): double jump + ledge grab
fresh();__place(-4.5,-15,2.2,N);__k({KeyW:true});__step(4);r=dbl();__k({});rep('Lower -> Upper Ledge (double jump, grab the ledge)',Math.abs(r.y-5.4)<.1,r);okk('...scores Falls Climb',/Falls Climb/.test(r.t),r.t);
// Upper -> Crown (7.4)
fresh();__place(-2.6,-19.2,5.4,N);__k({KeyW:true});__step(4);r=dbl();__k({});rep('Upper Ledge -> Crown',Math.abs(r.y-7.4)<.1,r);okk('...scores Crown Hop',/Crown Hop/.test(r.t),r.t);
// Over the Falls: Upper W -> Upper E across the chute
fresh();__place(-5.5,-18.6,5.4,E);__k({KeyD:true});__until(()=>P.position.x>-2.6,90);jumpBuf=.15;keys.Space=true;r=pull(land());__k({});rep('Over the Falls (Upper W -> Upper E)',Math.abs(r.y-5.4)<.1&&r.x>2,r);okk('...scores Over the Falls',/Over the Falls/.test(r.t),r.t);
// Crown Transfer: long jump east to the Sky Deck (8.0)
fresh();__place(-1.5,-22.4,7.4,E);__k({KeyD:true});__until(()=>P.position.x>2.4,90);r=LJ(false);__k({});rep('Crown -> Sky Deck (long jump)',Math.abs(r.y-8)<.1,r);okk('...scores Crown Transfer',/Crown Transfer/.test(r.t),r.t);
// Sky Step: Upper E -> Sky Deck takes a triple jump; a double jump isn't enough
fresh();__place(5,-19,5.4,E);__k({KeyD:true});__step(3);r=dbl();__k({});rep('Upper E -> Sky Deck: a double jump falls short',r.y<7.9,r);
// Runway Leap: long jump + dive across 13.5 to the Perch
fresh();__place(-13,7,2.2,N);__k({KeyW:true});__until(()=>P.position.z<-2.9,120);r=LJ(true);__k({});rep('Runway -> Perch (long jump + dive)',Math.abs(r.y-2.2)<.1&&r.z<-17.5,r);okk('...scores Runway Leap',/Runway Leap/.test(r.t),r.t);
fresh();__place(-13,7,2.2,N);__k({KeyW:true});__until(()=>P.position.z<-2.9,120);r=LJ(false);__k({});rep('...a plain long jump falls short',r.y<.5,r);
// Perch -> Lower Ledge W
fresh();__place(-14,-19,2.2,E);__k({KeyD:true});__step(8);jumpBuf=.15;keys.Space=true;r=pull(land());__k({});rep('Perch -> Lower Ledge',Math.abs(r.y-2.2)<.1&&r.x>-10,r);
// Ice Leap: block to block on the rink (8 apart)
fresh();__place(-5.2,-8,1.1,E);__k({KeyD:true});__until(()=>P.position.x>-3.6,60);jumpBuf=.15;keys.Space=true;r=pull(land());__k({});rep('Ice Leap (running jump block -> block)',Math.abs(r.y-1.1)<.1&&r.x>3,r);
// Candy Cane Hop
fresh();__place(2.3,13,3.6,E);__k({KeyD:true});__until(()=>P.position.x>3.55,40);jumpBuf=.15;keys.Space=true;r=pull(land());__k({});rep('Candy cane -> next cane',Math.abs(r.y-3.6)<.1,r);
// structures from both old maps are here
const pl=runL.plats,ac=runL.advCol;
okk('Icy chimney walls (8)',pl.filter(p=>Math.abs(p.top-8)<.01&&p.w===2.5&&p.d===6).length===2);
okk("Treehouse tree and the Crow's Nest (9.5)",ac.some(c=>c.tree&&Math.abs(c.x+15)<.1&&Math.abs(c.z-12)<.1)&&pl.some(p=>Math.abs(p.top-9.5)<.01));
okk('Pillar Run, the Big Slide and the fountain spout',[1.8,2.8,3.8,4.8].every(t=>pl.some(p=>Math.abs(p.top-t)<.01))&&pl.some(p=>p.ramp&&p.w>10)&&pl.some(p=>p.k==='c'&&Math.abs(p.top-2.6)<.01));
okk('Giant decorated pine is climbable',ac.some(c=>c.tree&&Math.abs(c.x+9)<.1&&c.top>10));
okk('Lamps by the start are climbable',ac.some(c=>c.pole&&c.x===-6&&c.z===2.5));
okk('19 named gaps',runL.gaps.length>=19,runL.gaps.length);okk('30+ orb spots',runL.spots.length>=30,runL.spots.length);okk('Snowmen placed',runL.snowmen.length===4);
return out.join('\n')})()
