// Ground spot: while you're in the air, a soft disc on the surface directly below you (like a drop shadow you can
// always see), so you can line up landings. It shrinks and darkens as you get closer to the ground. Hidden on the
// ground, while climbing or hanging, and for little hops.
const LM={};
{const ring=new THREE.Mesh(new THREE.RingGeometry(.34,.46,32),new THREE.MeshBasicMaterial({color:0x8fd8ff,transparent:true,opacity:0,depthWrite:false}));
  const dot=new THREE.Mesh(new THREE.CircleGeometry(.36,24),new THREE.MeshBasicMaterial({color:0x0b1a2a,transparent:true,opacity:0,depthWrite:false}));
  [ring,dot].forEach(m=>{m.rotation.x=-PI/2;m.renderOrder=2;m.castShadow=m.receiveShadow=false});
  LM.g=new THREE.Group();LM.g.add(dot,ring);LM.g.visible=false;scene.add(LM.g);LM.ring=ring;LM.dot=dot;LM.a=0}
function updateLandMark(dt){const air=state==='play'&&!grounded&&!CL.on&&!(typeof LH!=='undefined'&&LH.on);
  const gh=air?groundAt(P.position.x,P.position.z,py).h:-Infinity,ht=py-gh,want=air&&isFinite(gh)&&ht>.35?1:0;
  LM.a+=(want-LM.a)*Math.min(1,dt*12);LM.g.visible=LM.a>.02;if(!LM.g.visible)return;
  LM.g.position.x=P.position.x;LM.g.position.z=P.position.z;   // always right under you, even while fading
  if(want){LM.g.position.y=gh+.04;LM.g.scale.setScalar(Math.max(.7,Math.min(1.25,.7+ht*.08)))}   // wider the higher you are
  const near=Math.max(0,1-Math.min(1,ht/8));LM.ring.material.opacity=(.35+.2*near)*LM.a;LM.dot.material.opacity=(.14+.16*near)*LM.a}
