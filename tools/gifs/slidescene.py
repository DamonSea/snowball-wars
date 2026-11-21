import asyncio,sys
from rec import gif
C=open('/home/claude/rec/common.js').read()
S={'big-slide':(C+"""__go(4,0);document.querySelector('header.hud').style.visibility='hidden';const ch=plats.find(p=>p.ramp&&p.w>10&&p.d>2);
__at(15.2,19,-Math.PI/2,topOf(ch,15.2,19),20);T.camera.height=4.2;T.camera.back=7.2;
__run(s=>{runHz.forEach(h=>h.g.position.set(0,.75,40));SB.stun=0;s.w++;
 if(s.ph===0){if(s.w===14)keys.ShiftLeft=true;if(s.w>30&&!BS.on&&grounded&&P.position.x<1){s.ph=1;s.w=0}}
 else if(s.ph===1){if(s.w===30)keys.ShiftLeft=false}});""",64)}
async def main():
  for n in sys.argv[1:] or list(S):js,fr=S[n];await gif(n,js,fr)
asyncio.run(main())
