// Effects and shared pieces: spikeball model, rolling, particle bursts, collision push-out.
// ---------- shared pieces ----------
const spikeDirs=[];for(let i=0;i<14;i++){const y=1-2*(i+.5)/14,r=Math.sqrt(1-y*y),a=i*2.39996;spikeDirs.push(V(Math.cos(a)*r,y,Math.sin(a)*r))}
const hzM=mat(0xff5a4e,{roughness:.5}),spM=mat(0x3a1414),UP=V(0,1,0);
function spikeball(parent){const g=new THREE.Group();parent.add(g);add(new THREE.SphereGeometry(.62,12,10),hzM,0,0,0,g);
  spikeDirs.forEach(d=>{add(new THREE.ConeGeometry(.15,.45,5),spM,d.x*.72,d.y*.72,d.z*.72,g).quaternion.setFromUnitVectors(UP,d)});return g}
function roll(g,vx,vz,dt){const s=Math.hypot(vx,vz);if(s>.01)g.rotateOnWorldAxis(V(vz/s,0,-vx/s),s*dt/.7)}
const parts=[],partGeo=new THREE.SphereGeometry(.09,5,4);
function burst(pos,col,n=14){for(let i=0;i<n;i++){const m=new THREE.Mesh(partGeo,new THREE.MeshBasicMaterial({color:col,transparent:true}));
  m.position.copy(pos);scene.add(m);parts.push({m,v:V((Math.random()-.5)*6,2+Math.random()*4,(Math.random()-.5)*6),life:.7})}}
function pushOut(p,rad,list){for(const c of list){const dx=p.x-c.x,dz=p.z-c.z,d=Math.hypot(dx,dz),mn=c.r+rad;
  if(d<mn&&d>0){p.x=c.x+dx/d*mn;p.z=c.z+dz/d*mn;return{x:dx/d,z:dz/d}}}return null}
