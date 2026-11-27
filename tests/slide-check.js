(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;__step=n=>{for(let i=0;i<n;i++){runHz.forEach(h=>{h.g.position.set(0,.75,40);h.vx=h.vz=0});SB.stun=0;_st(1)}};
const chute=plats.find(p=>p.ramp&&p.w>10&&p.d>2);ok('the Big Slide exists in Frosty Falls',!!chute&&chute.ramp.hi===6);
ok('surface height along it',Math.abs(topOf(chute,1,19)-.3)<1e-6&&Math.abs(topOf(chute,15.5,19)-6)<1e-6&&Math.abs(topOf(chute,8.25,19)-3.15)<1e-6);
// climb the steps onto the tower (Flip)
ci=2;__place(17,10.5,0,0);let maxY=0;for(let k=0;k<7;k++){__k({KeyS:true});jumpBuf=.15;keys.Space=true;__step(4);keys.Space=false;for(let i=0;i<40;i++){__step(1);maxY=Math.max(maxY,py)}}
__k({});__step(20);ok('climbs the steps to the top ('+maxY.toFixed(2)+')',maxY>5.9);
// sit at the top of the chute and crouch: butt slide
__place(15,19,topOf(chute,15,19),-Math.PI/2);__step(3);keys.ShiftLeft=true;let maxSp=0,slid=false;
for(let i=0;i<240;i++){__step(1);if(BS.on)slid=true;maxSp=Math.max(maxSp,Math.hypot(vel.x,vel.z));if(i>5&&!BS.on)break}
ok('crouching on the slope starts a butt slide',slid);ok('picks up real speed ('+maxSp.toFixed(1)+')',maxSp>12);
ok('stays on the chute the whole way (never fell off the sides)',Math.abs(P.position.z-19)<1.2);
ok('ends past the bottom of the slide (x '+P.position.x.toFixed(1)+')',P.position.x<1);
ok('Butt Slide trick',TR.names.includes('Butt Slide'));keys.ShiftLeft=false;__step(30);ok('stands back up',!BS.on);
// jump out mid-slide
__place(14,19,topOf(chute,14,19),-Math.PI/2);__step(3);keys.ShiftLeft=true;__step(40);const sp=Math.hypot(vel.x,vel.z);jumpBuf=.15;keys.Space=true;__step(2);keys.Space=false;keys.ShiftLeft=false;
ok('Jump hops off with speed ('+sp.toFixed(1)+' → '+Math.hypot(vel.x,vel.z).toFixed(1)+')',!BS.on&&!grounded&&vy>0&&Math.hypot(vel.x,vel.z)>sp*.6);
__until(()=>grounded,200);ok('Slide Hop trick',TR.names.includes('Slide Hop'));
// walking down without crouching stays grounded every frame
__place(14.5,19,topOf(chute,14.5,19),-Math.PI/2);__step(3);let air=0;__k({KeyA:true});for(let i=0;i<60;i++){__step(1);if(!grounded)air++}__k({});
ok('walking down the slope stays on the ground ('+air+' airborne frames)',air===0&&P.position.x<13);
// walking up it works too
__place(3,19,topOf(chute,3,19),Math.PI/2);__step(3);__k({KeyD:true});__step(90);__k({});ok('walking up the slide works (x '+P.position.x.toFixed(1)+', y '+py.toFixed(2)+')',P.position.x>7&&Math.abs(py-topOf(chute,P.position.x,19))<.05);
// walk under the high end
__place(13.5,16.5,0,0);__step(3);__k({KeyS:true});__step(60);__k({});ok('can walk under the high end of the chute (z '+P.position.z.toFixed(1)+')',P.position.z>20.5&&py<.1);
// Sunny and Rook can slide too
ci=0;__place(15,19,topOf(chute,15,19),-Math.PI/2);__step(3);keys.ShiftLeft=true;let sl0=false;for(let i=0;i<60;i++){__step(1);if(BS.on)sl0=true}keys.ShiftLeft=false;ok('Sunny butt-slides too',sl0);
ci=2;__step=_st;return out.join('\n')})()
