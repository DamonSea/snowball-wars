// Butt slide: crouch on a slope (any ramp, like the big slide in the Plaza) and you drop onto your butt and slide.
// The slope pulls you downhill and speeds you up; steer with the stick, Jump to hop off with your speed, let go of
// crouch to stand up. On flat ground the slide slows and you get up. Works for every character.
const BS={on:false,dist:0,t:0};
const rampDown=p=>{const r=p.ramp,s=Math.sign(r.a0-r.a1);return r.ax==='x'?{x:s,z:0}:{x:0,z:s}};
const rampSlope=p=>{const r=p.ramp;return Math.abs(r.hi-r.lo)/Math.abs(r.a1-r.a0)};
const crouchHeld=()=>!!(held('crouch')||joy.crouch);
function wantButt(){return state==='play'&&grounded&&!!(stand&&stand.ramp)&&crouchHeld()&&!GP.st&&SA.t<=0&&ATK.t<=0&&!LH.on&&!CL.on}
function startButt(){BS.on=true;BS.dist=0;BS.t=0;if(chars[ci].acro){A.mode='normal';A.flipT=99}SFX.slide();burst(V(P.position.x,py+.1,P.position.z),0xffffff,5)}
function endButt(){if(!BS.on)return;BS.on=false;const sp=Math.hypot(vel.x,vel.z);
  if(sp>.5)face=Math.atan2(vel.x,vel.z);if(chars[ci].acro){A.spd=sp;A.mode=crouchHeld()&&grounded?'crouch':'normal'}
  if(BS.dist>=T.butt.minTrick)addTrick('Butt Slide')}
// one frame of sliding; returns false when the slide is over and normal movement should run instead
function buttMove(dt,ix,iz){const B=T.butt;
  if(!grounded){endButt();return false}
  if(jumpBuf>0){const sp=Math.hypot(vel.x,vel.z);endButt();vy=B.hopVy;grounded=false;stand=null;jumpBuf=0;
    if(chars[ci].acro){A.mode='jump';A.jumpN=1;A.canDive=true;A.canCut=true;A.spd=sp}SFX.jump(1);if(sp>4)addTrick('Slide Hop');return true}
  const onR=!!(stand&&stand.ramp);let vx=vel.x,vz=vel.z;
  if(!crouchHeld()){endButt();return false}
  if(onR){const d=rampDown(stand),s=rampSlope(stand),a=B.accel*s/Math.sqrt(1+s*s);vx+=d.x*a*dt;vz+=d.z*a*dt;const f=Math.exp(-B.friction*dt);vx*=f;vz*=f}
  else{const f=Math.exp(-B.flatFriction*dt);vx*=f;vz*=f}
  vx+=ix*B.steer*dt;vz+=iz*B.steer*dt;
  let sp=Math.hypot(vx,vz);if(sp>B.max){vx*=B.max/sp;vz*=B.max/sp;sp=B.max}
  if(!onR&&sp<B.stop){vel.set(vx,0,vz);endButt();return false}
  vel.set(vx,0,vz);P.position.x+=vx*dt;P.position.z+=vz*dt;BS.dist+=sp*dt;BS.t+=dt;
  if(sp>1)face+=angD(Math.atan2(vx,vz),face)*Math.min(1,dt*9);
  if(sp>3&&Math.random()<Math.min(.8,sp*.05))puff();
  return true}
// how far the body leans with the slope you're sliding down (positive = nose down)
function buttTilt(){if(!(stand&&stand.ramp))return 0;const d=rampDown(stand),s=rampSlope(stand);return Math.atan(s)*(Math.sin(face)*d.x+Math.cos(face)*d.z)}
