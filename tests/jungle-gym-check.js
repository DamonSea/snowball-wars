(()=>{const out=[];const N=-Math.PI,E=Math.PI/2,W=-Math.PI/2,S=0;
useRunMap(3);startRun(true);__step(5);
const land=()=>{__until(()=>!grounded&&!LH.on,40);__until(()=>(grounded&&!CL.on)||LH.on,400);const r={y:+py.toFixed(2),x:+P.position.x.toFixed(1),z:+P.position.z.toFixed(1),hang:LH.on,t:[...TR.names].join(',')};keys.Space=false;return r};
const res=(name,want,r)=>out.push((Math.abs(r.y-want)<.05?'OK  ':'FAIL')+' '+name+' (want y '+want+') -> y='+r.y+' x='+r.x+' z='+r.z+(r.hang?' HANGING':'')+' | '+r.t);
// 1 Tire Run: T4 -> Deck 1
__place(-6.6,3.4,2.4,E);__k({KeyD:true,Space:true});jumpBuf=.15;res('Tire Run: T4 -> Deck 1',2.4,land());
// 2 Tire hops T1->T2->T3 standing hops
__place(-7.6,9,.8,Math.atan2(-1.6,-1.8));__k({KeyW:true,KeyA:true,Space:true});jumpBuf=.15;res('Tire hop T1 -> T2',1.6,land());
// 3 Fort Climb by ledge hang: Deck 1 below the roof's south face (z=1.2), face north, jump, grab, pull up
__place(0,2.2,2.4,N);__k({KeyW:true,Space:true});jumpBuf=.15;__until(()=>LH.on,80);const g=LH.on;__k({KeyW:true});__step(45);__k({});__step(5);
out.push((g&&Math.abs(py-5.4)<.05?'OK  ':'FAIL')+' Fort Climb by ledge hang -> grabbed='+g+' y='+py.toFixed(2)+' | '+TR.names.join(','));
// 4 Fort Climb by backflip: face south near the roof, backflip goes north onto it
__place(0,2.6,2.4,S);__step(2);keys.ShiftLeft=true;__step(3);jumpBuf=.15;keys.Space=true;__step(3);keys.ShiftLeft=false;res('Fort Climb by backflip',5.4,land());
// 5 Fireman pole: climb, handstand at 6, aim at the roof, flip
__place(5.6,5.6,0,Math.atan2(-1,-1));__k({KeyW:true,KeyA:true});__until(()=>CL.on,120);__k({KeyW:true});__until(()=>CL.top,300);__k({});
face=Math.atan2(0-4.6,-1-4.6);__step(3);jumpBuf=.15;keys.Space=true;res('Fireman Flip: pole -> roof',5.4,land());
// 6 Monkey bars: jump from the ground at the bars' south side, hang, shimmy east, pull up, walk onto the tower
__place(5,1.2,0,N);__k({KeyW:true,Space:true});jumpBuf=.15;__until(()=>LH.on,80);const gb=LH.on;__k({KeyD:true});__step(170);__k({});const hx=P.position.x;
__k({KeyW:true});__step(40);__k({KeyD:true});__until(()=>P.position.x>13.2,120);__k({});__step(10);
out.push((gb&&Math.abs(py-3.4)<.05&&P.position.x>12?'OK  ':'FAIL')+' Monkey bars: grabbed='+gb+' shimmied to x='+hx.toFixed(1)+' then tower y='+py.toFixed(2)+' x='+P.position.x.toFixed(1)+' | '+TR.names.join(','));
// 7 Pound Peak: on the tower, jump, pound, Pound Jump drifting north
__place(14,-1.5,3.4,N);__step(2);jumpBuf=.15;keys.Space=true;__step(24);keys.Space=false;groundPound();__until(()=>GP.st===3,120);jumpBuf=.15;keys.Space=true;__step(8);__k({KeyW:true,Space:true});res('Pound Peak: tower -> peak',9,land());__k({});__step(10);
// 8 Peak Plunge: run west off the peak, long jump
__place(15.1,-3.0,9,W);__k({KeyA:true,Space:true});__until(()=>P.position.x<13.1,60);jumpBuf=.15;let r4=land();out.push((r4.y===5.4||r4.y===2.4?'OK  ':'FAIL')+' Peak Plunge: running jump -> y='+r4.y+' x='+r4.x+' | '+r4.t);
// 9 Bounce House: hop onto a pad, bounce north onto the North Deck
__place(2.8,-9.2,1.4,N);grounded=false;__k({Space:true});__until(()=>vy>12,60);__k({KeyW:true,Space:true});res('Bounce House: pad -> North Deck',5.8,land());
// 10 Super bounce: ground pound onto a pad
__place(-2.8,-9.2,0,N);__step(2);jumpBuf=.15;keys.Space=true;__step(22);groundPound();let pk=0;for(let i=0;i<140;i++){__step(1);pk=Math.max(pk,py)}out.push((pk>9?'OK  ':'FAIL')+' Super Bounce peak '+pk.toFixed(2)+' | '+TR.names.join(','));
// 11 Wall Hop: North Deck -> canyon east wall top (jump or hang+climb)
__place(4,-12.5,5.8,W);__k({KeyA:true,Space:true});__until(()=>P.position.x<-4.6,90);jumpBuf=.15;let r=land();if(r.hang){__k({KeyA:true});__step(45);__k({});__step(3);r.y=+py.toFixed(2)}res('Wall Hop: North Deck -> canyon top',8,r);
// 12 Canyon climb: wall-jump bot
__place(-12.5,-9,0,E);let dir=1;__k({KeyD:true});jumpBuf=.15;keys.Space=true;__step(3);
for(let i=0;i<600;i++){if(LH.on){__k({[dir>0?'KeyD':'KeyA']:true});__step(30);break}if(A.wallT>0&&!grounded&&vy<4){jumpBuf=.15;keys.Space=true;dir=-dir;__k(dir>0?{KeyD:true}:{KeyA:true})}__step(1);if(grounded&&py>7)break;if(grounded&&i>20&&py<.1)break}
out.push((py>7.9?'OK  ':'FAIL')+' Canyon wall-jump climb -> y='+py.toFixed(2)+' | '+TR.names.join(','));
// 13 Canyon Leap: east wall top -> roof
__place(-16.2,-3.6,8,E);__k({KeyD:true});__until(()=>P.position.x>-8.8,90);jumpBuf=.15;keys.Space=true;let r3=land();out.push((r3.y===5.4||r3.y===2.4?'OK  ':'FAIL')+' Canyon Leap: Lookout running jump -> y='+r3.y+' x='+r3.x+' z='+r3.z+' | '+r3.t);
// 14 North Express: North Deck south edge -> roof by long jump
__place(0,-17.2,5.8,S);__k({KeyS:true});__until(()=>P.position.z>-11.9,90);keys.ShiftLeft=true;__step(2);jumpBuf=.15;keys.Space=true;__step(2);keys.ShiftLeft=false;let r2=land();out.push((r2.y===5.4||r2.y===2.4?'OK  ':'FAIL')+' North Express -> y='+r2.y+' z='+r2.z+' | '+r2.t);
// 15 Swing set: climb pole, handstand, flip east onto the crossbar
__place(6,9.5,0,E);__k({KeyD:true});__until(()=>CL.on,120);__k({KeyW:true});__until(()=>CL.top,300);__k({});face=E;__step(3);jumpBuf=.15;keys.Space=true;res('Swing Set: pole -> crossbar',4.5,land());
// 16 walk under the deck, bonk head
__place(7,1.5,0,W);__k({KeyA:true});__step(50);__k({});out.push((P.position.x<2?'OK  ':'FAIL')+' walk under Deck 1: x='+P.position.x.toFixed(1)+' y='+py.toFixed(2));
jumpBuf=.15;keys.Space=true;let top=0;for(let i=0;i<40;i++){__step(1);top=Math.max(top,py)}keys.Space=false;out.push((top<=1.95-T.bodyH+.3&&top<.3?'OK  ':'OK? ')+' jump under Deck 1 bonks head: peak '+top.toFixed(2)+' (underside 1.95)');
return out.join('\n')})()
