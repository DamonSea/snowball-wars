(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const calm=()=>{runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0})};__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const gp={id:'DualSense',mapping:'standard',connected:true,timestamp:1,buttons:Array.from({length:18},()=>({pressed:false,value:0})),axes:[0,0,0,0]};navigator.getGamepads=()=>[gp];
const stick=(x,y)=>{gp.axes[0]=x;gp.axes[1]=y;gp.timestamp++};const tap=b=>{gp.buttons[b].pressed=true;gp.timestamp++;__step(1);gp.buttons[b].pressed=false;gp.timestamp++};
const angD=(a,b)=>{const d=a-b;return((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI};
for(const c of [2,3,5]){menu();pickMode='run';pickLevel=0;ci=c;showChar();confirmChar();__step(5);
  __place(10,-3,0,0);__step(3);stick(1,0);__step(30);stick(0,0);__step(40);       // walking east, then standing still facing east
  const f0=face,x0=P.position.x;stick(-1,0);__step(5);const f5=face,x5=P.position.x;__step(10);const x15=P.position.x,z15=P.position.z;stick(0,0);__step(20);
  ok(chars[c].name+': standing facing east, push west: facing west within 5 frames',Math.abs(angD(f0,Math.PI/2))<.2&&Math.abs(angD(f5,-Math.PI/2))<.15);
  ok(chars[c].name+': and walks straight west, no arc',x5<x0&&x15<x0-.3&&Math.abs(z15+3)<.15);
  // running: still skids/turns with momentum
  __place(6,-3,0,0);__step(3);stick(1,0);__step(70);const sp=A.spd;stick(-1,0);__step(2);ok(chars[c].name+": at full speed a reversal still skids ("+sp.toFixed(1)+" "+A.mode+")",sp>6&&A.mode==="skid");stick(0,0);__step(40);
}
// attack aims with the stick, in every camera mode
for(const m of ['classic','behind','free','auto']){menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(5);setCam&&setCam(m);CAM.yaw=m==='classic'?0:1.1;
  __place(10,-3,0,0);__step(3);face=0;stick(0,0);__step(30);ATK.t=0;ATK.cool=0;stick(-.9,.1);__step(1);const press=()=>{gp.buttons[2].pressed=true;gp.timestamp++;__step(1);gp.buttons[2].pressed=false;gp.timestamp++};
  face=0;press();const w2=Math.atan2(...(CAM.yaw?camInput(-.9,.1):[-.9,.1]));
  ok(`attack (□) faces the stick, ${m} camera`,ATK.t>0&&Math.abs(angD(face,w2))<.2);stick(0,0);__step(40)}
navigator.getGamepads=()=>[];menu();__step=_st;return out.join('\n')})()
