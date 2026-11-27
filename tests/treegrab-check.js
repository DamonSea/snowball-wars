(()=>{closePark();const calm=()=>runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});const _st=__step;__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const out=[];advCol.filter(c=>c.tree&&!c.pole&&!c.y).forEach((c,i)=>{
 for(const dist of [3]){
  // approach from the park centre side
  const ax=-c.x,az=-c.z,al=Math.hypot(ax,az)||1,ux=ax/al,uz=az/al;
  const sx=c.x+ux*dist,sz=c.z+uz*dist;const f=Math.atan2(-ux,-uz);
  __place(sx,sz,0,f);CL.cool=0;
  // hold toward the tree via camera-free input: use world keys? set face and push forward
  setCam('classic');const kx=-ux,kz=-uz;const k={};if(kx>.38)k.KeyD=true;if(kx<-.38)k.KeyA=true;if(kz>.38)k.KeyS=true;if(kz<-.38)k.KeyW=true;
  __k(k);__step(6);jumpBuf=.15;keys.Space=true;let g=false,minD=99,pyAt=0;
  for(let t=0;t<90;t++){__step(1);const d=Math.hypot(P.position.x-c.x,P.position.z-c.z);if(d<minD){minD=d;pyAt=py}if(CL.on){g=true;break}if(t>5&&grounded)break}
  keys.Space=false;__k({});
  out.push((g?'OK   ':'FAIL ')+`Jump into tree ${i} (${c.x.toFixed(1)},${c.z.toFixed(1)}) r=${c.r.toFixed(2)} top=${c.top.toFixed(1)} from ${dist}m: ${g?'GRAB':'miss'} closest=${minD.toFixed(2)} (need <${(c.r+.7).toFixed(2)}) y=${pyAt.toFixed(2)} touch=${CL.touch.toFixed(2)}`);
  if(CL.on){CL.on=false;CL.cool=0}__step(30)}});
return out.join('\n')})()
