// Adventure level 1: Lighthouse Isles. Islands, stepping stones, moving rafts, 3 cores, the lighthouse goal.
// ===== Level 1: Lighthouse Isles =====
{beginLevel();
cylPlat(0,0,8,0);
[[0,-11],[1.6,-15.5],[-.8,-20]].forEach(([x,z])=>boxPlat(x,z,2.4,2.4,0));
cylPlat(0,-31,8,0);
boxPlat(9.6,-31,2.6,3,.8);boxPlat(12.2,-31,2.6,3,1.6);boxPlat(14.8,-31,2.6,3,2.4);
boxPlat(20,-31,8,8,3.2);
movPlat(20,-39.5,3,3,3.2,1,0,3,1.2,0);movPlat(20,-44.5,3,3,3.2,1,0,3,1.2,PI);movPlat(20,-49.5,3,3,3.2,1,0,3,1.2,0);
cylPlat(20,-58,6.5,3.2);
boxPlat(11.2,-60,2.2,2.2,2.2);boxPlat(8.4,-62.5,2.2,2.2,1.2);
cylPlat(0,-67,8,0);
[[-4,-2.5],[4.5,1.5],[-3.5,4.5],[4,-4.5]].forEach(([x,z],i)=>tree(x,z,.9,advW,advCol,0,i));
[[-5.5,-31],[4.5,-24.5],[-3,-24]].forEach(([x,z],i)=>tree(x,z,.85,advW,advCol,0,i+1));
[[6,-71],[-6,-62.5]].forEach(([x,z],i)=>tree(x,z,.9,advW,advCol,0,i+2));
rock(17,-62,.8,advW,advCol,3.2);rock(23.5,-54.5,.7,advW,advCol,3.2);rock(23,-28,.6,advW,advCol,3.2);rock(-5,3,.6,advW,advCol);
flowers(0,0,7,25,0,advW);flowers(0,-31,7,30,0,advW);flowers(0,-67,7,25,0,advW);flowers(20,-58,5.5,20,3.2,advW);
const LH={x:-2.5,z:-71},lhRed=mat(0xe2493b),lhWhite=mat(0xf6f1e4);
for(let i=0;i<4;i++)add(new THREE.CylinderGeometry(1.55-i*.12-.12,1.55-i*.12,1.8,16),i%2?lhRed:lhWhite,LH.x,.9+i*1.8,LH.z,advW);
add(new THREE.CylinderGeometry(1.4,1.4,.25,16),mat(0x333a40),LH.x,7.3,LH.z,advW);
const lampM=new THREE.MeshStandardMaterial({color:0x99c4d6,emissive:0xffe9a0,emissiveIntensity:.05,transparent:true,opacity:.85});
add(new THREE.CylinderGeometry(.9,.9,1.2,12),lampM,LH.x,8,LH.z,advW);
add(new THREE.ConeGeometry(1.2,1,16),lhRed,LH.x,9.1,LH.z,advW);
advCol.push({x:LH.x,z:LH.z,r:1.7});
const beam=new THREE.Group();beam.position.set(LH.x,8,LH.z);beam.visible=false;advW.add(beam);
const beamM=new THREE.MeshBasicMaterial({color:0xfff2b0,transparent:true,opacity:.28,depthWrite:false,blending:THREE.AdditiveBlending});
[1,-1].forEach(s=>{const c=new THREE.Mesh(new THREE.ConeGeometry(3,40,16,1,true),beamM);c.rotation.z=s*PI/2;c.position.x=-s*20;beam.add(c)});
const lhLight=new THREE.PointLight(0xffe9a0,0,40);lhLight.position.set(LH.x,8,LH.z);advW.add(lhLight);
const {pad,padM}=makePad(2,-66.5,0);
[[-5,-37,0],[22,-33,3.2],[20,-58,3.2]].forEach(([x,z,y])=>addCore(x,z,y));
[[0,3,0],[2.5,-24.8,0],[17.5,-28.5,3.2],[17,-53.5,3.2],[5.5,-64.5,0]].forEach(([x,z,y])=>addFlag(x,z,y));
patrol(-6.5,-27.5,6.5,-27.5,0,4.5);patrol(6,-36.5,-6.5,-36.5,0,5.5);
circler(20,-31,2.6,3.2,1.7,0);
[0,2.09,4.19].forEach(ph=>circler(20,-58,3.2,3.2,1.3,ph));
goal={x:2,z:-66.5,y:0,pad,padM,look:V(LH.x,5,LH.z),
  on(v){lampM.emissiveIntensity=v?2.2:.05;beam.visible=v;lhLight.intensity=v?2.5:0;padM.opacity=v?.8:.35},
  spin(dt){beam.rotation.y+=dt*1.2}};
endLevel({name:'Lighthouse Isles',key:'orbRunAdv',intro:'Find the 3 glowing power cores',
  allMsg:'All cores found! Bring them to the lighthouse pad',need:n=>`The lighthouse needs all 3 cores. You have ${n}.`,
  winT:'Lighthouse lit!',winHint:'The lighthouse is lit!'});
}
