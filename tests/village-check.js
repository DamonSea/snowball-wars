(()=>{const out=[];const N=-Math.PI,E=Math.PI/2,W=-Math.PI/2,S=0;
setCam('classic');useRunMap(RUNMAPS.findIndex(M=>M.name==='Christmas Village'));startRun(true);__step(5);
runHz.forEach(h=>h.g.position.set(0,.75,80));const _st=__step;__step=n=>{for(let i=0;i<n;i++){runHz.forEach(h=>{h.g.position.set(0,.75,80);h.vx=h.vz=0});_st(1)}};
const land=()=>{__until(()=>!grounded&&!LH.on&&!CL.on,40);__until(()=>(grounded&&!CL.on)||LH.on,500);const r={y:+py.toFixed(2),x:+P.position.x.toFixed(1),z:+P.position.z.toFixed(1),hang:LH.on,t:[...TR.names].join(',')};keys.Space=false;return r};
const rep=(name,ok,r,extra='')=>out.push((ok?'OK   ':'FAIL ')+name+' -> y='+r.y+' x='+r.x+' z='+r.z+(r.hang?' HANGING':'')+(extra?' '+extra:'')+' | '+r.t);
const pull=r=>{if(r.hang){__k({KeyW:true});__step(45);__k({});__step(5);r.y=+py.toFixed(2);r.x=+P.position.x.toFixed(1);r.z=+P.position.z.toFixed(1)}return r};
const inBox=(r,x0,x1,z0,z1)=>r.x>=x0-.25&&r.x<=x1+.25&&r.z>=z0-.25&&r.z<=z1+.25;
const fresh=()=>{__k({});keys.ShiftLeft=false;keys.Space=false;TR.names=[];__step(2)};
let r;
// 1 street -> Gingerbread House roof (eave 2.2): one running jump
fresh();__place(-19,-3,0,N);__k({KeyW:true});__until(()=>P.position.z<-8.9,90);jumpBuf=.15;keys.Space=true;r=pull(land());rep('Street -> Gingerbread roof (running jump)',r.y>=2&&inBox(r,-21,-17,-16,-10),r);
// 2 Rooftop Run: Gingerbread ridge -> Toy Shop (4.5 gap, up 0.8)
fresh();__place(-20.5,-13,3.2,E);__k({KeyD:true});__until(()=>P.position.x>-17.3,90);jumpBuf=.15;keys.Space=true;r=pull(land());rep('Rooftop Run: Gingerbread -> Toy Shop (named gap counts on a sloped roof)',r.y>=3&&inBox(r,-12.5,-8,-17,-11)&&/Rooftop Run/.test(r.t),r);
// 3 Toy Shop -> Clock Tower base (4 gap)
fresh();__place(-11.5,-16,3.6,E);__k({KeyD:true});__until(()=>P.position.x>-8.3,90);jumpBuf=.15;keys.Space=true;r=pull(land());rep('Toy Shop Hop -> Clock base',Math.abs(r.y-4)<.05&&inBox(r,-4,4,-23,-15),r);
// 4 street -> Clock base by backflip (face away from the tower)
fresh();__place(-2.5,-14.4,0,S);__step(2);keys.ShiftLeft=true;__step(3);jumpBuf=.15;keys.Space=true;__step(3);keys.ShiftLeft=false;r=pull(land());rep('Street -> Clock base (backflip)',Math.abs(r.y-4)<.05,r);
// 6 Bell Climb: base -> bell deck (backflip)
fresh();__place(0,-16.1,4,S);__step(2);keys.ShiftLeft=true;__step(3);jumpBuf=.15;keys.Space=true;__step(3);keys.ShiftLeft=false;r=pull(land());rep('Bell Climb: base -> bell deck (backflip)',Math.abs(r.y-8.4)<.05,r);
// 7 Tree-top Flip: climb the giant tree, flip onto the bell deck
fresh();__place(0,-7,0,N);__k({KeyW:true});__until(()=>CL.on,120);__k({KeyW:true});__until(()=>CL.top,400);__k({});face=N;__step(3);jumpBuf=.15;keys.Space=true;
const climbed=CL.top;r=pull(land());rep('Tree-top Flip: giant tree -> bell deck',climbed&&Math.abs(r.y-8.4)<.05,r,'climbed='+climbed);
// 8 star pole on the bell deck: climb and flip high enough for the sky orb (13.2)
fresh();__place(1.3,-18.6,8.4,N);__k({KeyW:true});__until(()=>CL.on,120);__k({KeyW:true});__until(()=>CL.top,400);__k({});face=S;__step(3);jumpBuf=.15;keys.Space=true;let pk=0;for(let i=0;i<120;i++){__step(1);pk=Math.max(pk,py)}
out.push((pk>12.6?'OK   ':'FAIL ')+'Star pole flip reaches the sky orb (13.2): peak '+pk.toFixed(2));__until(()=>grounded,300);
// 9 Chimney Alley: wall-jump up to the workshop / present
fresh();__place(14.5,-7.5,0,N);let dir=-1;__k({KeyW:true});jumpBuf=.15;keys.Space=true;__step(3);
for(let i=0;i<700;i++){if(LH.on){__k({[dir<0?'KeyW':'KeyS']:true});__step(40);break}if(A.wallT>0&&!grounded&&vy<4){jumpBuf=.15;keys.Space=true;dir=-dir;__k(dir<0?{KeyW:true}:{KeyS:true})}__step(1);if(grounded&&py>5.5)break;if(grounded&&i>20&&py<.1)break}
__k({});__step(20);out.push((Math.abs(py-6)<.05?'OK   ':'FAIL ')+'Chimney Alley wall-jump climb -> y='+py.toFixed(2)+' z='+P.position.z.toFixed(1)+' | '+TR.names.join(','));
// 10 candy cane by the alley: climb, flip onto the workshop roof
fresh();__place(10.4,-7.4,0,N);__k({KeyW:true});__until(()=>CL.on,120);__k({KeyW:true});__until(()=>CL.top,400);__k({});face=Math.atan2(4,-5);__step(3);jumpBuf=.15;keys.Space=true;r=pull(land());rep('Candy cane flip -> workshop roof',Math.abs(r.y-6)<.05&&inBox(r,11,18,-19,-9),r);
// 11 workshop roof -> chimney (8.6): double jump
fresh();__place(16.5,-13.5,6,N);__k({KeyW:true});__step(6);jumpBuf=.15;keys.Space=true;__until(()=>!grounded,20);__until(()=>grounded,200);keys.Space=false;__step(1);jumpBuf=.15;keys.Space=true;r=pull(land());__k({});
rep('Workshop roof -> chimney (double jump)',/Chimney Top/.test(r.t),r);
// 12 Sleigh Drop: workshop roof -> Clock base
fresh();__place(16,-17.5,6,W);__k({KeyA:true});__until(()=>P.position.x<11.4,120);jumpBuf=.15;keys.Space=true;r=pull(land());rep('Sleigh Drop: workshop -> Clock base',Math.abs(r.y-4)<.05,r);
// 13 Sky Sled: hill summit -> rooftops, long jump + dive
fresh();__place(-18,10.7,4.6,N);__k({KeyW:true});__until(()=>P.position.z<6.1,90);keys.ShiftLeft=true;__step(1);jumpBuf=.15;keys.Space=true;__step(2);keys.Space=false;keys.ShiftLeft=false;__step(24);keys.ShiftLeft=true;r=pull(land());keys.ShiftLeft=false;
rep('Sky Sled: summit -> Gingerbread (long jump + dive)',r.y>=2&&inBox(r,-21.2,-16.8,-16,-9.8),r);
// ...and a plain long jump falls short
fresh();__place(-18,10.7,4.6,N);__k({KeyW:true});__until(()=>P.position.z<6.1,90);keys.ShiftLeft=true;__step(1);jumpBuf=.15;keys.Space=true;__step(2);keys.Space=false;keys.ShiftLeft=false;r=land();
rep('Sky Sled without the dive falls short',r.y<.5,r);
// 14 Ice Leap: pier -> island (9.5): long jump yes, running jump no
fresh();__place(-2,13.5,1.2,E);__k({KeyD:true});__until(()=>P.position.x>4.1,120);keys.ShiftLeft=true;__step(1);jumpBuf=.15;keys.Space=true;__step(2);keys.Space=false;keys.ShiftLeft=false;r=land();rep('Ice Leap: pier -> island (long jump)',Math.abs(r.y-1.2)<.05&&r.x>14,r);
fresh();__place(-2,13.5,1.2,E);__k({KeyD:true});__until(()=>P.position.x>4.1,120);jumpBuf=.15;keys.Space=true;r=land();rep('Ice Leap by running jump falls in (onto the ice)',r.y<.2,r);
// 15 Awning Hop: one stall roof to the next (4.5 gap)
fresh();__place(8,5.6,2,N);__k({KeyW:true});__until(()=>P.position.z<4.3,90);jumpBuf=.15;keys.Space=true;__step(4);__k({Space:true});r=pull(land());rep('Awning Hop: stall -> stall',Math.abs(r.y-2)<.05&&inBox(r,7,10,-2.6,-.4),r);
// 16 butt slide down a roof
fresh();__place(-10.25,-13.7,4.1,S);__step(3);__k({KeyS:true,ShiftLeft:true});let slid=false;for(let i=0;i<60;i++){__step(1);if(BS.on)slid=true}keys.ShiftLeft=false;__k({});__step(40);
out.push((slid?'OK   ':'FAIL ')+'Butt slide down the Toy Shop roof (slid='+slid+')');
// 17 sled chute from the summit
fresh();__place(-17,8.5,4.6,E);__k({KeyD:true});__step(30);keys.ShiftLeft=true;let sl=false,maxX=-99;for(let i=0;i<240;i++){__step(1);if(BS.on)sl=true;maxX=Math.max(maxX,P.position.x)}keys.ShiftLeft=false;__k({});__step(30);
out.push((sl&&maxX>-4?'OK   ':'FAIL ')+'Sled chute: summit -> square (slid='+sl+', reached x='+maxX.toFixed(1)+')');
// 18 stable roof: one jump
fresh();__place(19,10,0,N);__k({KeyW:true});__until(()=>P.position.z<7.9,90);jumpBuf=.15;keys.Space=true;r=pull(land());rep('Street -> Stable roof',r.y>=2&&inBox(r,16.5,21.5,1,7),r);
// every orb spot sits on a surface (or is meant to float)
const bad=runL.spots.filter(s=>{if(s.air)return false;const g=groundAt(s.x,s.z,s.y+.05).h;return Math.abs(g-s.y)>.3});out.push((bad.length?'FAIL ':'OK   ')+'orb spots sit on surfaces'+(bad.length?' '+JSON.stringify(bad.map(s=>[s.x,s.z,s.y,+groundAt(s.x,s.z,s.y+.05).h.toFixed(2)])):''));
__step=_st;__k({});return out.join('\n')})()
