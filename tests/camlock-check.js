(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const calm=()=>{runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0})};__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const gp={id:'DualSense',mapping:'standard',connected:true,timestamp:1,buttons:Array.from({length:18},()=>({pressed:false,value:0})),axes:[0,0,0,0]};navigator.getGamepads=()=>[gp];
const stick=(x,y)=>{gp.axes[0]=x;gp.axes[1]=y;gp.timestamp++};
const angD=(a,b)=>{const d=a-b;return((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI};
for(const m of ['behind','auto','free']){for(const c of [2,3,5]){
  setCam(m);menu();pickMode='run';pickLevel=0;ci=c;showChar();confirmChar();__step(5);
  __place(0,8,0,0);__step(3);camSnap();__step(30);
  stick(0,-1);__step(50);stick(0,0);__step(45);                 // walk forward, stop
  const x0=P.position.x,z0=P.position.z,f0=face;stick(0,1);       // now hold the stick back
  const pts=[];for(let i=0;i<150;i++){__step(1);pts.push([P.position.x,P.position.z])}
  // how far the path strays from the straight line it set off on (after the turn-around)
  const a=pts[25],b=pts[149],L=Math.hypot(b[0]-a[0],b[1]-a[1]);let dev=0;for(const p of pts.slice(25)){const d=Math.abs((b[0]-a[0])*(a[1]-p[1])-(a[0]-p[0])*(b[1]-a[1]))/(L||1);dev=Math.max(dev,d)}
  const back=Math.abs(angD(face,f0+Math.PI));
  ok(`${m}, ${chars[c].name}: pull back walks a straight line (strays ${dev.toFixed(2)}m over ${L.toFixed(1)}m), turned around (${back.toFixed(2)})`,dev<.35&&L>8&&back<.25);
  if(m!=='free'){const cb=Math.abs(angD(CAM.yaw,face+Math.PI));ok(`${m}, ${chars[c].name}: camera ends up behind you (${cb.toFixed(2)})`,cb<.35)}
  else ok(`free, ${chars[c].name}: camera stays where you put it`,Math.abs(angD(CAM.yaw,f0+Math.PI))<.05);
  stick(0,0);__step(20);
  // let go and push forward: carries on the way you were going (camera's behind you now)
  if(m!=='free'){const fb=face;stick(0,-1);__step(40);ok(`${m}, ${chars[c].name}: then pushing up keeps going that way`,Math.abs(angD(face,fb))<.3);stick(0,0);__step(20)}
}}
// turning the camera yourself while running still steers
setCam('free');menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(5);__place(0,8,0,0);__step(3);camSnap();__step(20);
const f1=face;stick(0,-1);__step(30);gp.axes[2]=1;gp.timestamp++;__step(40);gp.axes[2]=0;gp.timestamp++;__step(10);ok('free cam: right stick while running still steers you',Math.abs(angD(face,f1))>.8);
stick(0,0);__step(10);setCam('classic');navigator.getGamepads=()=>[];menu();__step=_st;return out.join('\n')})()
