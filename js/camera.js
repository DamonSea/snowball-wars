// Camera modes (Settings → Game → Camera). Classic is the default: the original fixed view from the south, where Up
// always means north. The others turn the camera, so movement becomes camera-relative (Up = away from the camera):
//   Behind you   - a closer camera that swings round to stay behind you as you run
//   Free         - aim it yourself: right stick (or Z / X) orbits, stick up/down tilts; it stays where you put it
//   Free + auto  - like Free, but when you leave it alone it drifts back behind you while you run
// R3 (or V) snaps the camera behind you in any turning mode.
const CAMS=['classic','behind','free','auto'],CAM_NAMES=['Classic','Behind you','Free','Free + auto'];
const CAM={mode:'classic',yaw:0,pitch:.5,idle:9};
try{const m=localStorage.getItem('orbRunCam');if(CAMS.includes(m))CAM.mode=m}catch(e){}
function setCam(m){if(!CAMS.includes(m))m='classic';CAM.mode=m;CAM.idle=9;if(m==='classic')CAM.yaw=0;try{localStorage.setItem('orbRunCam',m)}catch(e){}if(typeof renderControls==='function')renderControls()}
const camTurns=()=>CAM.mode!=='classic';
const angTo=(a,b)=>{let d=(b-a)%(2*PI);if(d>PI)d-=2*PI;if(d<-PI)d+=2*PI;return d};
// rotate a stick/keys input (screen space: x right, z down) into world space for the current camera
function camInput(ix,iz){const y=CAM.yaw;if(!y)return[ix,iz];const c=Math.cos(y),s=Math.sin(y);return[ix*c+iz*s,-ix*s+iz*c]}
function camSnap(){CAM.yaw=face+PI;CAM.idle=9}
// per frame while playing: update yaw / pitch, then where the camera sits and looks
function camFollow(dt){
  if(!camTurns()){camPos.set(P.position.x,py+T.camera.height,P.position.z+T.camera.back);look.set(P.position.x,py+1,P.position.z);cam.position.lerp(camPos,1-Math.exp(-5*dt));return}
  const gp=pad.connected&&pad.gp,rx=gp?gp.axes[2]||0:0,ry=gp?gp.axes[3]||0:0,dz=v=>Math.abs(v)>.18?(v-Math.sign(v)*.18)/.82:0;
  let turn=dz(rx)+(held('camR')?1:0)-(held('camL')?1:0),tilt=dz(ry);
  if(state==='play'&&pressed('camC'))camSnap();
  const sp=Math.hypot(vel.x,vel.z);
  if(CAM.mode==='behind'){if(turn)CAM.yaw-=turn*2.4*dt;else if(sp>.8)CAM.yaw+=angTo(CAM.yaw,face+PI)*(1-Math.exp(-2.6*dt))}
  else{if(turn||tilt){CAM.yaw-=turn*2.6*dt;CAM.pitch=Math.max(.15,Math.min(1.2,CAM.pitch+tilt*1.4*dt));CAM.idle=0}else CAM.idle+=dt;
    if(CAM.mode==='auto'&&CAM.idle>1.4&&sp>2.5)CAM.yaw+=angTo(CAM.yaw,face+PI)*(1-Math.exp(-1.4*dt))}
  const pitch=CAM.mode==='behind'?.42:CAM.pitch,D=CAM.mode==='behind'?9.5:11,h=Math.cos(pitch)*D;
  camPos.set(P.position.x+Math.sin(CAM.yaw)*h,py+1.2+Math.sin(pitch)*D,P.position.z+Math.cos(CAM.yaw)*h);look.set(P.position.x,py+1.3,P.position.z);
  // keep walls and buildings from blocking the view: pull the camera in front of anything solid in the way
  {const dx=camPos.x-look.x,dy=camPos.y-look.y,dz=camPos.z-look.z;
    for(let i=2;i<=16;i++){const t=i/16,x=look.x+dx*t,y=look.y+dy*t,z=look.z+dz*t;   // ~16 samples from you out to the camera
      if(plats.some(p=>p.k!=='c'||p.r<20?inside(p,x,z,.25)&&topOf(p,x,z)>y&&(botOf(p,x,z)===undefined||y>botOf(p,x,z)):false)){const u=Math.max(.12,t-.1);camPos.set(look.x+dx*u,look.y+dy*u,look.z+dz*u);if(u<.45)camPos.y=look.y+3+(.45-u)*9;break}}}
  cam.position.lerp(camPos,1-Math.exp(-6*dt))}
// a one-frame press for bindable actions read outside the key handlers
const camPrev={};function pressed(id){const h=held(id),was=camPrev[id];camPrev[id]=h;return h&&!was}
