(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const calm=()=>{runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0})};__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const gp={id:'DualSense',mapping:'standard',connected:true,timestamp:1,buttons:Array.from({length:18},()=>({pressed:false,value:0})),axes:[0,0,0,0]};navigator.getGamepads=()=>[gp];
const stick=(x,y)=>{gp.axes[0]=x;gp.axes[1]=y;gp.timestamp++};const btn=(b,v)=>{gp.buttons[b].pressed=v;gp.timestamp++};
const angD=(a,b)=>{const d=a-b;return((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI};
const look=()=>CAM.yaw+Math.PI,mv=()=>Math.atan2(vel.x,vel.z);
const setup=()=>{setCam('auto');menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(5);__place(0,10,0,0);__step(3);face=Math.PI;camSnap();__step(40)};
// A: run straight away from the camera
setup();let y0=CAM.yaw;stick(0,-1);__step(120);ok(`running straight away: camera holds still (turned ${Math.abs(angD(CAM.yaw,y0)).toFixed(2)})`,Math.abs(angD(CAM.yaw,y0))<.05);stick(0,0);__step(30);
// B: hold sideways: camera comes round behind you within about a second and a half
setup();y0=CAM.yaw;stick(1,0);let t=-1;for(let i=0;i<240;i++){__step(1);if(t<0&&i>20&&Math.abs(angD(look(),mv()))<.3)t=i/60}
ok(`running sideways: camera settles behind you (${t.toFixed(2)}s)`,t>0&&t<1.8);
// and smoothly: no single frame turns more than a little
setup();stick(1,0);let mx=0,prev=CAM.yaw;for(let i=0;i<180;i++){__step(1);mx=Math.max(mx,Math.abs(angD(CAM.yaw,prev)));prev=CAM.yaw}ok(`...smoothly (max ${(mx*60).toFixed(2)} rad/s)`,mx*60<3);stick(0,0);__step(30);
// C: a side flip (run, reverse + jump) doesn't yank the camera
setup();stick(0,-1);__step(60);y0=CAM.yaw;stick(0,1);__step(2);btn(0,true);__step(3);btn(0,false);__step(36);
ok(`side flip: camera barely moves during it (${Math.abs(angD(CAM.yaw,y0)).toFixed(2)})`,Math.abs(angD(CAM.yaw,y0))<.35);stick(0,0);__step(40);
// D: jumping while running sideways: little turn in the air
setup();stick(1,0);__step(30);y0=CAM.yaw;btn(0,true);__step(2);btn(0,false);let air=0,turnAir=0,ya=CAM.yaw;for(let i=0;i<40;i++){const yb=CAM.yaw;__step(1);if(!grounded){air++;turnAir+=Math.abs(angD(CAM.yaw,yb))}}
ok(`in the air: turns gently (${(turnAir/Math.max(1,air)*60).toFixed(2)} rad/s over ${air} frames)`,air>10&&turnAir/air*60<1);stick(0,0);__step(30);
// E: pull back: straight line, and the camera still ends up behind you
setup();stick(0,-1);__step(50);stick(0,0);__step(45);const f0=face;stick(0,1);const pts=[];for(let i=0;i<180;i++){__step(1);pts.push([P.position.x,P.position.z])}
const a=pts[25],b=pts[179],L=Math.hypot(b[0]-a[0],b[1]-a[1]);let dev=0;for(const p of pts.slice(25)){dev=Math.max(dev,Math.abs((b[0]-a[0])*(a[1]-p[1])-(a[0]-p[0])*(b[1]-a[1]))/(L||1))}
ok(`pull back: straight line (strays ${dev.toFixed(2)}m), camera ends behind you (${Math.abs(angD(look(),face)).toFixed(2)})`,dev<.35&&Math.abs(angD(look(),face))<.35);stick(0,0);__step(20);
// F: turning it yourself, then letting go: it waits a moment before taking over
setup();stick(1,0);__step(20);gp.axes[2]=-1;gp.timestamp++;__step(20);gp.axes[2]=0;gp.timestamp++;y0=CAM.yaw;__step(30);const early=Math.abs(angD(CAM.yaw,y0));__step(60);const later=Math.abs(angD(CAM.yaw,y0));
ok(`after you turn it: leaves it for ~0.6s (${early.toFixed(2)}), then follows again (${later.toFixed(2)})`,early<.05&&later>.2);
stick(0,0);setCam('classic');navigator.getGamepads=()=>[];menu();__step=_st;return out.join('\n')})()
