(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const calm=()=>{runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0})};__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const gp={id:'DualSense',mapping:'standard',connected:true,timestamp:1,buttons:Array.from({length:18},()=>({pressed:false,value:0})),axes:[0,0,0,0]};navigator.getGamepads=()=>[gp];
const stick=(x,y)=>{gp.axes[0]=x;gp.axes[1]=y;gp.timestamp++};
ok('Settings offers just Classic and Free',LOOK.camera.opts.join(',')==='Classic,Free');
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(5);
for(const turn of [1,-1,.4]){
  // play with the Free camera: turn it, run around holding a direction
  setCam('free');__step(5);gp.axes[2]=turn;gp.timestamp++;__step(50);gp.axes[2]=0;stick(.3,-1);__step(30);stick(0,0);__step(20);
  // switch to Classic: every direction means the same as on the map
  setCam('classic');__step(5);
  for(const[x,y,dx,dz,name]of[[0,-1,0,-1,'up = north'],[1,0,1,0,'right = east'],[0,1,0,1,'down = south'],[-1,0,-1,0,'left = west']]){
    __place(0,10,0,0);__step(3);stick(x,y);__step(40);stick(0,0);const mx=P.position.x,mz=P.position.z-10,L=Math.hypot(mx,mz)||1;
    ok(`after Free cam (turned ${turn}), Classic ${name}`,(mx/L*dx+mz/L*dz)>.98);__step(30)}}
// and a mid-hold switch doesn't carry over either
setCam('free');__step(5);gp.axes[2]=1;gp.timestamp++;__step(40);gp.axes[2]=0;stick(0,-1);__step(20);setCam('classic');__place(0,10,0,0);__step(40);ok('switching while holding the stick: Classic up = north at once',10-P.position.z>2&&Math.abs(P.position.x)<.3);
stick(0,0);navigator.getGamepads=()=>[];menu();__step=_st;return out.join('\n')})()
