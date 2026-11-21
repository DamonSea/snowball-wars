(()=>{const rep=[];const _st=__step;const calm=()=>{runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});SB.stun=0;invuln=9};const st=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
menu();pickMode='run';pickLevel=2;ci=3;showChar();confirmChar();st(5);let tried=0;
const walls=plats.filter(p=>p.k==='b'&&p.top>1.2&&!p.ramp);
for(const p of walls){const faces=[[1,0,'KeyD','KeyA'],[-1,0,'KeyA','KeyD'],[0,1,'KeyS','KeyW'],[0,-1,'KeyW','KeyS']];
  for(const[fx,fz,into,away]of faces){for(const off of[-.3,0,.3]){
    // start 2.5 units outside this face, on the ground, walk (or jump) into it
    const sx=fx?p.x-fx*(p.w/2+2.5):p.x+off*p.w,sz=fz?p.z-fz*(p.d/2+2.5):p.z+off*p.d;
    if(Math.hypot(sx,sz)>26||plats.some(q=>q!==p&&q.k==='b'&&inside(q,sx,sz,.6)&&topOf(q,sx,sz)>.3))continue;
    for(const jump of[false,true]){tried++;
      __place(sx,sz,0,Math.atan2(fx,fz));st(3);__k({[into]:true});if(jump){jumpBuf=.15;keys.Space=true}st(jump?50:45);keys.Space=false;
      const at={x:P.position.x,z:P.position.z,y:py,mode:A.mode,LH:LH.on,CL:CL.on,BS:BS.on,g:grounded,wall:A.wallT};__k({[away]:true});st(35);__k({});
      const moved=Math.hypot(P.position.x-at.x,P.position.z-at.z);
      if(LH.on){__k({});keys.ShiftLeft=true;st(3);keys.ShiftLeft=false;st(30)}   // let go of a ledge hang before the next try
      if(moved<1&&!at.LH&&!at.CL)rep.push(`STUCK ${jump?'jumped':'walked'} into wall ${JSON.stringify({x:p.x,z:p.z,w:p.w,d:p.d,top:p.top})} face ${fx},${fz}: at (${at.x.toFixed(2)},${at.y.toFixed(2)},${at.z.toFixed(2)}) mode ${at.mode} g ${at.g} moved away only ${moved.toFixed(2)} now mode ${A.mode} y ${py.toFixed(2)} g ${grounded}`);
      if(rep.length>10)break}}}if(rep.length>10)break}
return `tried ${tried} approaches on ${walls.length} solids\n`+(rep.join('\n')||'no stuck spots')})()
