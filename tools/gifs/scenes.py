import asyncio,sys
from rec import gif
import os
C=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'common.js')).read()
S={}
S['tricks']=(C+"""__go(2,0);__at(-9,13.5,Math.PI/2);
__run(s=>{if(s.ph===0){__k({KeyD:true,Space:true});if(s.f===20){jumpBuf=.15;s.ph=1}}
 else if(s.ph===1){keys.Space=true;if(grounded&&A.jumpN<3)jumpBuf=.15;if(A.jumpN===3&&grounded&&s.f>50){s.ph=2;s.w=0}}
 else if(s.ph===2){if(++s.w===14)__k({KeyA:true});if(A.mode==='skid'){jumpBuf=.15;keys.Space=true;s.ph=3;s.w=0}}
 else if(s.ph===3){if(grounded&&++s.w>10){__k({});s.ph=4;s.w=0}}
 else if(s.ph===4){++s.w;if(s.w===30)keys.ShiftLeft=true;if(s.w===36){jumpBuf=.15;keys.Space=true}if(s.w===40)keys.ShiftLeft=false}});""",100)
S['runway']=(C+"""__go(2,0);__at(-13,7.4,Math.PI,2.2);
__run(s=>{if(s.ph===0){__k({KeyW:true});if(P.position.z<-3.6){keys.ShiftLeft=true;s.ph=1;s.w=0}}
 else if(s.ph===1){s.w++;if(s.w===2){jumpBuf=.15;keys.Space=true}if(s.w===4){keys.ShiftLeft=false;s.ph=2}}
 else if(s.ph===2){if(vy<-4){keys.ShiftLeft=true;s.ph=3}}
 else if(s.ph===3){keys.ShiftLeft=false;if(grounded){s.ph=4;s.w=0}}
 else if(++s.w>12)__k({})});""",62)
S['snowball-fight']=(C+"""__go(3,0);__at(1,9,Math.PI);setCpu(true);Object.assign(CPU,{x:1,z:3.5,y:0,vx:0,vz:0,stun:0,cool:1.6,retarget:999,tx:1,tz:3.5});CPU.a.init=true;
__run(s=>{SB.ammo=6;CPU.retarget=999;CPU.tx=1+Math.sin(s.f/40)*1.5;CPU.tz=3.5;const dx=CPU.x-P.position.x,dz=CPU.z-P.position.z;
 const side=Math.floor(s.f/60)%2?'KeyA':'KeyD';if(SB.stun<=0)__k({[side]:true});
 if(s.f%40===16&&SB.stun<=0){face=Math.atan2(dx,dz);__k({});throwSnow()}});""",96)
S['winter-crew']=(C+"""__go(2,0);__at(0,10,Math.PI);const ft=foeTouch;foeTouch=h=>h.kind==='imp'?ft(h):null;T.foes.penguinSlide=.9;
spawnRunHz('penguin');spawnRunHz('goon');spawnRunHz('imp');const [pg,gn,im]=runHz;
T.camera.height=5.6;T.camera.back=7.2;__step(40);pg.g.position.set(4,0,6.2);Object.assign(pg,{st:'walk',t:.6,face:0});gn.g.position.set(-2.6,0,6.6);Object.assign(gn,{cool:1.6,face:0});
im.g.position.set(4.5,0,12.5);Object.assign(im,{st:'walk',face:-1.5,hopT:0});
__run(s=>{SB.stun=0;gn.t=99;gn.g.position.x=-2.6;gn.g.position.z=6.6;
 if(s.f===150){SB.ammo=6;SB.cool=0;face=Math.atan2(gn.g.position.x-P.position.x,gn.g.position.z-P.position.z);throwSnow()}
 if(s.f===175){SB.cool=0;SB.ammo=Math.max(SB.ammo,1);face=Math.atan2(gn.g.position.x-P.position.x,gn.g.position.z-P.position.z);throwSnow()}});""",100)
S['climb']=(C+"""__go(2,0);__at(-12.7,12,-Math.PI/2);const tgt=Math.atan2(-4.5,5);
__run(s=>{if(s.ph===0){__k({KeyA:true});if(CL.on){s.ph=1}}
 else if(s.ph===1){__k({KeyW:true});if(CL.top){s.ph=2;s.w=0;__k({})}}
 else if(s.ph===2){const d=angD(tgt,face);if(++s.w>18){if(Math.abs(d)>.04)__k(d<0?{KeyD:true}:{KeyA:true});else{__k({});s.ph=3;s.w=0}}}
 else if(s.ph===3){if(++s.w===14){__k({KeyA:true,KeyS:true,Space:true});jumpBuf=.15;s.ph=4;s.w=0}}
 else if(s.ph===4){if(grounded&&++s.w>6)__k({})}});""",120)
S['frozen-rink']=(C+"""__go(3,1);__at(-9,1,Math.PI/2);
__run(s=>{const t=s.f;if(t<80)__k({KeyD:true});else if(t<140)__k({});else if(t<210)__k({KeyA:true,KeyW:true});else if(t<250)__k({});else if(t===250){__k({ShiftLeft:true})}else if(t===253){jumpBuf=.15;keys.Space=true}else if(t>258)__k({})});""",80)
S["monkey-bars"]=(C+"""__go(2,3);__at(5,1.6,-Math.PI);
__run(s=>{if(s.ph===0){if(++s.w===8){__k({KeyW:true,Space:true});jumpBuf=.15;s.ph=1}}
 else if(s.ph===1){if(LH.on){__k({});s.ph=2;s.w=0}}
 else if(s.ph===2){if(++s.w===10)__k({KeyD:true});if(P.position.x>11.4){__k({KeyW:true});s.ph=3;s.w=0}}
 else if(s.ph===3){if(!LH.on&&++s.w>6){__k({KeyD:true});s.ph=4}}
 else if(s.ph===4){if(P.position.x>13.6){__k({});s.ph=5}}});""",110)
S['pound-peak']=(C+"""__go(2,3);__at(14,-.2,-Math.PI,3.4);
__run(s=>{if(s.ph===0){if(++s.w===10){jumpBuf=.15;keys.Space=true;s.ph=1;s.w=0}}
 else if(s.ph===1){if(++s.w===24){keys.Space=false;groundPound();s.ph=2}}
 else if(s.ph===2){if(GP.st===3){jumpBuf=.15;keys.Space=true;s.ph=3;s.w=0}}
 else if(s.ph===3){if(++s.w===8)__k({KeyW:true,Space:true});if(grounded&&py>8.9){__k({});s.ph=4;s.w=0}}
 else if(s.ph===4){if(++s.w===14){face=-Math.PI/2;P.position.x=15.1;}if(s.w===20)__k({KeyA:true,Space:true});if(s.w>20&&P.position.x<13.1){jumpBuf=.15;s.ph=5}}
 else if(s.ph===5){if(grounded&&py<6){__k({});s.ph=6}}});""",105)
S['winter-fun']=(C+"""__go(3,3);__at(-7,18,Math.PI/2);const b=RS.list[0];b.x=-4.6;b.z=18;b.r=T.roll.r0;b.vx=b.vz=0;syncRoller(b);
__run(s=>{if(s.ph===0){if(++s.w===10){poundOrSnow();s.ph=1}}
 else if(s.ph===1){if(SA.t<=0&&++s.w>20){__k({KeyD:true});s.ph=2;s.w=0}}
 else if(s.ph===2){if(++s.w>200){__k({});s.ph=3}}});""",110)
async def main(names):
  for n in names:
    js,fr=S[n];await gif(n,js,fr)
asyncio.run(main(sys.argv[1:] or list(S)))
