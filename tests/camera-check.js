(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const calm=()=>{runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});SB.stun=0};__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const gp={id:'DualSense Wireless Controller',mapping:'standard',connected:true,timestamp:1,buttons:Array.from({length:18},()=>({pressed:false,value:0})),axes:[0,0,0,0]};
ok('new players get Classic',localStorage.getItem('orbRunCam')===null&&CAM.mode==='classic');
ok('Camera row in Settings → Game',LOOK.camera&&LOOK.camera.opts.join('|')==='Classic|Behind you|Free|Free + auto');
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(5);
// classic: same view as before, Up goes north
__place(10,0,0,0);__step(120);ok('Classic: camera sits south of you at the old offset',Math.abs(cam.position.x-P.position.x)<.3&&Math.abs(cam.position.z-(P.position.z+T.camera.back))<.6&&CAM.yaw===0);
__k({KeyW:true});__step(30);__k({});ok('Classic: Up moves north',P.position.z<-1&&Math.abs(P.position.x-10)<.3);
// behind: run forward and the camera settles behind you; and input is camera-relative
setCam('behind');__place(10,0,0,Math.PI/2);CAM.yaw=0;__step(3);__k({KeyW:true});__step(150);__k({});
ok('Behind you: camera settles behind you (off by '+angTo(CAM.yaw,face+Math.PI).toFixed(2)+' rad)',Math.abs(angTo(CAM.yaw,face+Math.PI))<.25);
setCam('free');CAM.yaw=-Math.PI/2;__place(10,-2,0,0);__step(3);const x0=P.position.x,z0=P.position.z;__k({KeyW:true});__step(30);__k({});const mx=P.position.x-x0,mz=P.position.z-z0;
ok('camera to the west: Up runs east, away from it ('+mx.toFixed(1)+','+mz.toFixed(1)+')',mx>2&&Math.abs(mz)<.5);
// free: the right stick turns it and it stays put
setCam('free');navigator.getGamepads=()=>[gp];__step(3);const y0=CAM.yaw;gp.axes[2]=1;gp.timestamp++;__step(30);gp.axes[2]=0;gp.timestamp++;const y1=CAM.yaw;
ok('Free: right stick orbits ('+(y1-y0).toFixed(2)+' rad)',Math.abs(y1-y0)>1);gp.axes[3]=-1;__step(20);gp.axes[3]=0;ok('right stick up/down tilts',CAM.pitch<.5);
__k({KeyD:true});__step(90);__k({});ok('Free: stays where you put it while you run',Math.abs(CAM.yaw-y1)<.01);
// free + auto: leave the stick alone while running sideways and it swings back toward behind you
setCam('auto');__place(20,-4,0,0);CAM.yaw=0;__step(3);CAM.idle=0;__k({KeyA:true});__step(40);const ya=CAM.yaw;__step(60);__k({});
ok('Free + auto: waits a moment ('+ya.toFixed(2)+'), then drifts behind you while running ('+CAM.yaw.toFixed(2)+')',Math.abs(ya)<.01&&Math.abs(CAM.yaw)>.3);
setCam('free');CAM.yaw=0;__place(10,0,0,0);__step(3);__k({KeyD:true});__step(200);__k({});ok('Free (no auto): never moves on its own',CAM.yaw===0);
// R3 snaps behind
CAM.yaw=1;face=-2;gp.buttons[11].pressed=true;gp.timestamp++;__step(2);gp.buttons[11].pressed=false;gp.timestamp++;__step(2);ok('R3 snaps the camera behind you',Math.abs(angTo(CAM.yaw,face+Math.PI))<.2);
keys.KeyZ=true;const yz=CAM.yaw;__step(20);keys.KeyZ=false;ok('Z turns the camera on keyboard',CAM.yaw>yz+.3);
ok('controls card lists the camera controls',/Turn the camera/.test($('ctl').textContent)&&/Camera behind you/.test($('ctl').textContent));
navigator.getGamepads=()=>[];setCam('classic');__step(3);ok('back to Classic: no rotation',CAM.yaw===0&&!/Turn the camera/.test($('ctl').textContent));
localStorage.removeItem('orbRunCam');__step=_st;return out.join('\n')})()
