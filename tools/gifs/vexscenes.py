import asyncio,sys
from rec import gif,still
C=open('/home/claude/rec/common.js').read()
L=open('/home/claude/rec/lineup2.js').read()
S={}
S['vex']=(C+"""__go(4,3);__at(-9,18,Math.PI/2);document.querySelector("header.hud").style.visibility="hidden";orbs.forEach(o=>rmObj(o.g));orbs=[];RS.list.forEach(b=>{b.x=40;syncRoller(b)});T.camera.height=2.6;T.camera.back=4.6;
__run(s=>{runHz.forEach(h=>h.g.position.set(0,.75,40));SB.stun=0;
 if(s.ph===0){__k({KeyD:true});if(s.f>=44){__k({});s.ph=1;s.w=0}}
 else if(s.ph===1){if(++s.w===40){jumpBuf=.15;keys.Space=true}if(s.w===46)keys.Space=false;if(s.w>50&&grounded){s.ph=2;s.w=0}}
 else if(s.ph===2){vel.set(0,0,0);s.w++;face+=(.55-face)*.08;if(s.w===40)VX.gT=1.4}
});""",92)
S['squash-stretch']=(C+"""__go(2,3);__at(-9,18,Math.PI/2);document.querySelector("header.hud").style.visibility="hidden";orbs.forEach(o=>rmObj(o.g));orbs=[];RS.list.forEach(b=>{b.x=40;syncRoller(b)});setToon(true);T.camera.height=2.4;T.camera.back=4.4;
__run(s=>{runHz.forEach(h=>h.g.position.set(0,.75,40));SB.stun=0;s.w++;
 if(s.ph===0){if(s.w===6){jumpBuf=.15;keys.Space=true}if(s.w===24)keys.Space=false;if(s.w>30&&grounded){s.ph=1;s.w=0}}
 else if(s.ph===1){if(s.w===24||s.w===40||s.w===56)attackPress();if(s.w>95){s.ph=2;s.w=0}}
 else if(s.ph===2){if(s.w===2){jumpBuf=.15;keys.Space=true}if(s.w===26){keys.Space=false;groundPound()}if(s.w>40&&grounded&&!GP.st){s.ph=3;s.w=0}}
 else if(s.ph===3){if(s.w===20){__k({KeyD:true})}if(s.w===40){keys.ShiftLeft=true}if(s.w===42){jumpBuf=.15;keys.Space=true}if(s.w===46)keys.ShiftLeft=false;if(s.w>60&&grounded)__k({})}
});""",110)
async def main(names):
  for n in names:
    if n=='lineup':
      await still(C+L+"""window.__LX=-1;window.__LZ=17;__lineup([[()=>makeAv(0),-3.6],[()=>makeAv(1),-1.8],[()=>{const a=makeAv(2);return a},0],[()=>makeAv(3),1.8],[()=>{const a=makeAv(4);a.ry=-.25;return a},3.6]]);
        orbs.forEach(o=>rmObj(o.g));orbs=[];document.querySelector("header.hud").style.visibility="hidden";T.camera.back=5.6;T.camera.height=1.5;__step(40)""",'/home/claude/rec/lineup5.png');continue
    js,fr=S[n];await gif(n,js,fr)
asyncio.run(main(sys.argv[1:] or ['lineup']+list(S)))
