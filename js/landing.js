// Landing marker: while you're in the air, a faint ring and soft shadow on the ground show where you'll come down.
// It steps your current motion forward under gravity until it meets a surface (groundAt), so it follows ledges,
// roofs and slopes. Hidden on the ground, while climbing or hanging, and for short hops (under .2s of air).
const LM={};
{const ring=new THREE.Mesh(new THREE.RingGeometry(.34,.46,32),new THREE.MeshBasicMaterial({color:0x8fd8ff,transparent:true,opacity:0,depthWrite:false}));
  const dot=new THREE.Mesh(new THREE.CircleGeometry(.36,24),new THREE.MeshBasicMaterial({color:0x0b1a2a,transparent:true,opacity:0,depthWrite:false}));
  [ring,dot].forEach(m=>{m.rotation.x=-PI/2;m.renderOrder=2;m.castShadow=m.receiveShadow=false});
  LM.g=new THREE.Group();LM.g.add(dot,ring);LM.g.visible=false;scene.add(LM.g);LM.ring=ring;LM.dot=dot;LM.a=0}
// Holding a direction in the air speeds an acrobat up toward their top speed (movement.js), so the forecast does too.
function landPredict(){let x=P.position.x,z=P.position.z,y=py,v=vy;const dt=1/60,g=T.gravity;
  const[ix,iz]=rawInput(),im=Math.min(1,Math.hypot(ix,iz)),acc=chars[ci].acro&&im>.2&&A.mode!=='dive'&&A.mode!=='long'&&A.lock<=0&&A.spd>=0;
  let sp=Math.hypot(vel.x,vel.z);const ux=sp>.01?vel.x/sp:Math.sin(face),uz=sp>.01?vel.z/sp:Math.cos(face),top=(A.maxNow||8)*im;
  for(let i=0;i<240;i++){if(acc&&sp<top)sp=Math.min(top,sp+T.flip.air.accel*dt);
    const ny=y+v*dt;v-=g*dt;const nx=x+ux*sp*dt,nz=z+uz*sp*dt,gr=groundAt(nx,nz,y);
    if(v<0&&isFinite(gr.h)&&ny<=gr.h)return{x:nx,z:nz,y:gr.h,t:i*dt};
    if(ny<-6)return null;x=nx;z=nz;y=ny}
  return null}
function updateLandMark(dt){const air=state==='play'&&!grounded&&!CL.on&&!(typeof LH!=='undefined'&&LH.on);let p=null;
  if(air&&py-(groundAt(P.position.x,P.position.z,py).h||0)>.35)p=landPredict();
  const want=p&&p.t>.12?1:0;LM.a+=(want-LM.a)*Math.min(1,dt*12);LM.g.visible=LM.a>.02;if(!LM.g.visible)return;
  if(p){LM.g.position.set(p.x,p.y+.04,p.z);const k=Math.max(.7,Math.min(1.25,.7+p.t*.5));LM.g.scale.setScalar(k)}   // a bit wider the further off it is
  LM.ring.material.opacity=.5*LM.a*(.85+.15*Math.sin(tAll*9));LM.dot.material.opacity=.22*LM.a}
