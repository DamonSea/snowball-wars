// Camera modes (Settings → Game → Camera). Classic is the default: the original fixed view from the south, where Up
// always means north. The others turn the camera, so movement becomes camera-relative (Up = away from the camera):
//   Behind you   - a closer camera that swings round to stay behind you as you run
//   Free         - aim it yourself: right stick (or Z / X) orbits, stick up/down tilts; it stays where you put it
//   Free + auto  - like Free, but when you leave it alone it turns with you as you run sideways
// R3 (or V) snaps the camera behind you in any turning mode.
// Only Classic and Free are offered for now; Behind you and Free + auto are parked (code kept, not selectable in
// Settings). A saved parked mode moves to Free, the closest match.
const CAM_ALL=['classic','behind','free','auto'],CAMS=['classic','free'],CAM_NAMES=['Classic','Free'];
const CAM={mode:'classic',yaw:0,pitch:.5,idle:9,inYaw:0,lockDir:null};
try{const m=localStorage.getItem('orbRunCam');if(CAMS.includes(m))CAM.mode=m;else if(m==='behind'||m==='auto'){CAM.mode='free';localStorage.setItem('orbRunCam','free')}}catch(e){}
function setCam(m){if(!CAM_ALL.includes(m))m='classic';CAM.mode=m;CAM.idle=9;if(m==='classic')CAM.yaw=0;CAM.inYaw=CAM.yaw;CAM.lockDir=null;try{localStorage.setItem('orbRunCam',m)}catch(e){}if(typeof renderControls==='function')renderControls()}
const camTurns=()=>CAM.mode!=='classic';
const angTo=(a,b)=>{let d=(b-a)%(2*PI);if(d>PI)d-=2*PI;if(d<-PI)d+=2*PI;return d};
// Input lock: while you hold a direction, it keeps meaning the same way in the world, even as the camera swings.
// Without it, pulling back in a following camera walks you in a circle: you turn toward the camera, the camera
// swings behind you, "back" now points somewhere new, and you keep turning. The lock resets when you let go,
// clearly change direction, or turn the camera yourself.
function camInputFrame(manual){const ix=kbAxisX()+joy.x+pad.x,iz=kbAxisZ()+joy.z+pad.z;
  if(!camTurns()||Math.hypot(ix,iz)<.25){CAM.inYaw=CAM.yaw;CAM.lockDir=null;return}
  const d=Math.atan2(ix,iz);if(manual||CAM.lockDir===null||Math.abs(angTo(CAM.lockDir,d))>.8){CAM.inYaw=CAM.yaw;CAM.lockDir=d}}
// rotate a stick/keys input (screen space: x right, z down) into world space for the current camera
// Classic: the stick maps straight to the world (Up is always north). Free: camera-relative, through the input lock.
function camInput(ix,iz){if(!camTurns())return[ix,iz];const y=CAM.inYaw;if(!y)return[ix,iz];const c=Math.cos(y),s=Math.sin(y);return[ix*c+iz*s,-ix*s+iz*c]}
function camSnap(){CAM.yaw=face+PI;CAM.idle=9;CAM.inYaw=CAM.yaw;CAM.lockDir=null}
// per frame while playing: update yaw / pitch, then where the camera sits and looks
function camFollow(dt){
  if(!camTurns()){camPos.set(P.position.x,py+T.camera.height,P.position.z+T.camera.back);look.set(P.position.x,py+1,P.position.z);cam.position.lerp(camPos,1-Math.exp(-5*dt));return}
  const gp=pad.connected&&pad.gp,rx=gp?gp.axes[2]||0:0,ry=gp?gp.axes[3]||0:0,dz=v=>Math.abs(v)>.18?(v-Math.sign(v)*.18)/.82:0;
  let turn=dz(rx)+(held('camR')?1:0)-(held('camL')?1:0),tilt=dz(ry);
  if(state==='play'&&pressed('camC'))camSnap();
  camInputFrame(!!turn);
  const sp=Math.hypot(vel.x,vel.z),rev=Math.abs(angTo(CAM.yaw,face+PI))>2;   // rev: you've turned to face the camera
  if(CAM.mode==='behind'){if(turn)CAM.yaw-=turn*2.4*dt;else if(sp>.8)CAM.yaw+=angTo(CAM.yaw,face+PI)*(1-Math.exp(-(rev?4.2:2.6)*dt))}
  else{if(turn||tilt){CAM.yaw-=turn*2.6*dt;CAM.pitch=Math.max(.15,Math.min(1.2,CAM.pitch+tilt*1.4*dt));CAM.idle=0}else CAM.idle+=dt;
    // Free + auto: follow where you're actually moving (not where you face, which flips during tricks). Moving
    // sideways turns the camera, more the more sideways you go; straight away from or toward the camera, it holds
    // still; in the air it barely turns. It takes over 0.6 s after you stop turning it yourself.
    if(CAM.mode==='auto'&&CAM.idle>.6&&sp>1){const a=angTo(CAM.yaw+PI,Math.atan2(vel.x,vel.z));
      if(Math.abs(a)<2.4){CAM.toward=0;CAM.yaw+=Math.sin(a)*T.camera.autoTurn*Math.min(1,sp/9)*(grounded?1:.3)*dt}
      // running at the camera: after a moment, swing steadily round behind you
      else if(grounded&&(CAM.toward=(CAM.toward||0)+dt)>.7)CAM.yaw+=(a<0?-1:1)*T.camera.autoTurn*.6*dt}
    else CAM.toward=0}
  const pitch=CAM.mode==='behind'?.42:CAM.pitch,D=CAM.mode==='behind'?9.5:11,h=Math.cos(pitch)*D;
  camPos.set(P.position.x+Math.sin(CAM.yaw)*h,py+1.2+Math.sin(pitch)*D,P.position.z+Math.cos(CAM.yaw)*h);look.set(P.position.x,py+1.3,P.position.z);
  // keep walls and buildings from blocking the view: pull the camera in front of anything solid in the way
  {const dx=camPos.x-look.x,dy=camPos.y-look.y,dz=camPos.z-look.z;
    for(let i=2;i<=16;i++){const t=i/16,x=look.x+dx*t,y=look.y+dy*t,z=look.z+dz*t;   // ~16 samples from you out to the camera
      if(plats.some(p=>p.k!=='c'||p.r<20?inside(p,x,z,.25)&&topOf(p,x,z)>y&&(botOf(p,x,z)===undefined||y>botOf(p,x,z)):false)){const u=Math.max(.12,t-.1);camPos.set(look.x+dx*u,look.y+dy*u,look.z+dz*u);if(u<.45)camPos.y=look.y+3+(.45-u)*9;break}}}
  cam.position.lerp(camPos,1-Math.exp(-6*dt))}
// a one-frame press for bindable actions read outside the key handlers
const camPrev={};function pressed(id){const h=held(id),was=camPrev[id];camPrev[id]=h;return h&&!was}
