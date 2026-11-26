// Adventure level 2: Sky Gauntlet (Flip only). Each section needs one trick; ends at the summit beacon.
// ===== Level 2: Sky Gauntlet (built for Flip) =====
// Each section needs a trick: long jump, triple jump, backflip, long jump + dive, wall jumps, side flip.
{beginLevel();
const sand=seas(mat(0xcaa57a),0xd2d9df),sandDk=seas(mat(0xa9845c),0xaab4bd),moss=seas(mat(0x5e9e48),0xf4f7fa),vine=seas(mat(0x3f8a3c),0x2f5e48),ruin=seas(mat(0xd8c3a0),0xe3e8ec);
boxPlat(0,0,8,10,0,sand,moss);           // A start (z 5..-5)
boxPlat(0,-25,16,20,0,sand,moss);        // B plaza, after a 10-unit long-jump gap (z -15..-35)
boxPlat(0,-41,16,12,3.6,sand,moss);      // C ledge: triple-jump wall (z -35..-47)
boxPlat(0,-51,16,8,8.2,sandDk,moss);     // D block: backflip wall (z -47..-55)
boxPlat(0,-79.25,8,22.5,8.2,sand,moss); // E tower after a 13-unit gap: long jump + dive (z -68..-90.5)
boxPlat(-2.75,-84,2.5,6,16,sandDk,moss); // chimney walls, 3 apart: wall-jump up
boxPlat(2.75,-84,2.5,6,16,sandDk,moss);
boxPlat(0,-93,10,8,16,sand,moss);        // G landing (z -89..-97)
boxPlat(0,-102,10,10,19.6,sandDk,moss);  // H summit: side-flip wall (z -97..-107)
// guard rails: left off every edge you jump from or land on
function rail(x,z,w,d,top){const len=Math.max(w,d),n=Math.max(2,Math.round(len/1.4)),ax=w>d;
  add(B(w,.16,d),ruin,x,top+.92,z,advW);add(B(w,.1,d),ruin,x,top+.08,z,advW);
  for(let i=0;i<=n;i++){const t=-len/2+len*i/n;add(new THREE.CylinderGeometry(.08,.1,.84,6),ruin,ax?x+t:x,top+.5,ax?z:z+t,advW)}
  plats.push({k:'b',x,z,w,d,top:top+1,rail:true})}
rail(-3.85,0,.3,10,0);rail(3.85,0,.3,10,0);rail(0,4.85,8,.3,0);
[[-25,20,0],[-41,12,3.6],[-51,8,8.2]].forEach(([z,d,t])=>{rail(-7.85,z,.3,d,t);rail(7.85,z,.3,d,t)});
rail(-3.85,-79.25,.3,22.5,8.2);rail(3.85,-79.25,.3,22.5,8.2);
rail(-4.85,-93,.3,8,16);rail(4.85,-93,.3,8,16);
rail(-4.85,-102,.3,10,19.6);rail(4.85,-102,.3,10,19.6);rail(0,-106.85,10,.3,19.6);
// vines mark the walls you can kick off
[-1,1].forEach(s=>{for(let k=0;k<3;k++)add(B(.06,6.5,.18),vine,s*1.47,12.2,-82+k*-1.9,advW)});
// ruins decor: broken columns (solid) and stone bands
function column(x,z,y,h){add(new THREE.CylinderGeometry(.45,.5,h,10),ruin,x,y+h/2,z,advW);add(B(1.1,.25,1.1),ruin,x,y+h+.12,z,advW);advCol.push({x,z,r:.6})}
column(-3,3.5,0,2.2);column(3,3.5,0,1.2);column(-6.5,-17,0,2.6);column(6.5,-33,0,1.6);column(-6.8,-45.5,3.6,1.4);column(6.8,-53.5,8.2,2);column(3.5,-105.5,19.6,1.8);column(-3.5,-105.5,19.6,2.4);
[[0,-25,16,20,0],[0,-41,16,12,3.6],[0,-79.25,8,22.5,8.2]].forEach(([x,z,w,d,t])=>add(B(w+.06,.18,d+.06),sandDk,x,t-1.2,z,advW));
flowers(0,-25,7,20,0,advW);flowers(0,-1,3,8,0,advW);
// summit beacon
add(new THREE.CylinderGeometry(.5,.7,1,10),ruin,0,20.1,-103.5,advW);
add(new THREE.CylinderGeometry(1,.55,.5,12),sandDk,0,20.85,-103.5,advW);advCol.push({x:0,z:-103.5,r:1.1});
const flameM=new THREE.MeshStandardMaterial({color:0xffb347,emissive:0xff7a1a,emissiveIntensity:2,transparent:true,opacity:.9});
const flame=new THREE.Group();flame.position.set(0,21.1,-103.5);flame.visible=false;advW.add(flame);
[[0,1.4,.6],[.3,.9,.35],[-.3,1,.35]].forEach(([x,h,r])=>{const f=new THREE.Mesh(new THREE.ConeGeometry(r,h,8),flameM);f.position.set(x,h/2,0);flame.add(f)});
const fLight=new THREE.PointLight(0xff9a3c,0,30);fLight.position.set(0,22,-103.5);advW.add(fLight);
const {pad,padM}=makePad(0,-100,19.6);
addCore(0,-10,0);         // floats over the long-jump gap
addCore(-2.75,-84,16);    // on top of a chimney wall
addCore(0,-61.5,8.2);    // floats over the dive gap
[[0,3,0],[-5,-17,0],[-5.5,-37,3.6],[5,-49,8.2],[-2.5,-70,8.2],[-3,-91,16]].forEach(([x,z,y])=>addFlag(x,z,y));
circler(4,-25,3,0,1.5,0);patrol(-7,-43.5,7,-43.5,3.6,4);patrol(2.5,-70.5,2.5,-78,8.2,3);
zones.push(
  {z0:6,z1:-6,y:0,t:'Long jump the gap: run, hold Shift, then Jump. Grab the core mid-air!'},
  {z0:-14,z1:-35,y:0,t:'Jump again right as you land, three times in a row, to triple jump up the ledge'},
  {z0:-35,z1:-47,y:3.6,t:'Too tall to jump! Stand still with your back to the wall, hold Shift, then Jump to backflip'},
  {z0:-47,z1:-56,y:8.2,t:'Long jump, then press Shift on the way down to dive across the gap'},
  {z0:-66,z1:-91,y:8.2,t:'Jump into a wall, then Jump again to kick off it. Zigzag up the chimney!'},
  {z0:-88,z1:-97.5,y:16,t:'Run, reverse to skid, then Jump mid-skid to side flip onto the summit'});
goal={x:0,z:-100,y:19.6,pad,padM,look:V(0,21,-103.5),
  on(v){flame.visible=v;fLight.intensity=v?3:0;padM.opacity=v?.8:.35},
  spin(dt){flame.children.forEach((f,i)=>{f.scale.y=1+Math.sin(tAll*12+i*2)*.15;f.rotation.y+=dt*2})}};
endLevel({name:'Sky Gauntlet',key:'orbRunAdv2',flipOnly:true,intro:'Climb to the summit with Flipper. Grab 3 cores on the way',
  allMsg:'All cores found! Light the beacon at the summit',need:n=>`The beacon needs all 3 cores. You have ${n}.`,
  winT:'Summit reached!',winHint:'The beacon is lit!'});
}
