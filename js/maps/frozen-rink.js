// Trick Park map 2: Frozen Rink. A skateable ice rink (plats flagged ice) plus fort, chimney, decks, candy canes, giant pine.
// ----- Frozen Rink: an ice rink you can skate on, ringed by trick structures -----
{const rinkW=new THREE.Group();rinkW.visible=false;scene.add(rinkW);advW=rinkW;plats=[];advCol=[];
add(new THREE.CylinderGeometry(30.5,26,3,48),sandM,0,-1.6,0,rinkW);
add(new THREE.CylinderGeometry(28.5,28.5,.2,48),grassM,0,-.1,0,rinkW).castShadow=false;
plats.push({k:'c',x:0,z:0,r:28.5,top:0});
const iceTop=new THREE.MeshStandardMaterial({color:0xd4f0fb,roughness:.06,metalness:.12}),iceSide=mat(0xa9d8ea,{roughness:.3}),
      boardM=mat(0xf4f6f8,{roughness:.5}),blueM=mat(0x2f6fd0),redM=mat(0xd83a2e),
      snowBlk=seas(mat(0xe3d6bd),0xe8eef3),snowTop=seas(mat(0x6fbf4a),0xf6f9fc),iceWall=mat(0x9fd3e8,{roughness:.2,metalness:.1});
// the rink (x -12..12, z 5..-9), surface 0.12 high; flagged ice for skating physics
add(B(24,.24,14),iceSide,0,0,-2,rinkW);add(B(24,.02,14),iceTop,0,.125,-2,rinkW).receiveShadow=true;
plats.push({k:'b',x:0,z:-2,w:24,d:14,top:.12,ice:true});
[[.3,0,redM],[.25,-6,blueM],[.25,6,blueM]].forEach(([w,x,m])=>add(B(w,.02,14),m,x,.14,-2,rinkW));
const cc=new THREE.Mesh(new THREE.RingGeometry(1.8,2,40),new THREE.MeshBasicMaterial({color:0x2f6fd0}));cc.rotation.x=-PI/2;cc.position.set(0,.142,-2);rinkW.add(cc);
// boards with gaps on the short sides
function board(x,z,w,d){add(B(w,1,d),boardM,x,.62,z,rinkW);add(B(w+.04,.1,d+.04),blueM,x,1.17,z,rinkW);plats.push({k:'b',x,z,w,d,top:1.12,rail:true})}
board(0,5,24.3,.3);board(0,-9,24.3,.3);
[-1,1].forEach(s=>{board(s*12,3,.3,4);board(s*12,-7,.3,4)});
// two ice blocks to hop on the rink (not slippery on top)
boxPlat(-6,-2,2,2,1.1,iceWall,iceTop);boxPlat(6,-2,2,2,1.1,iceWall,iceTop);
// lamp posts
const poleM=mat(0x2b2f36),bulbM=new THREE.MeshStandardMaterial({color:0xffe2a8,emissive:0xffc46b,emissiveIntensity:1.4});
[[-13.2,6.2],[13.2,6.2],[-13.2,-10.2],[13.2,-10.2]].forEach(([x,z])=>{add(new THREE.CylinderGeometry(.1,.14,4.2,8),poleM,x,2.1,z,rinkW);
  add(new THREE.SphereGeometry(.32,12,8),bulbM,x,4.35,z,rinkW);add(new THREE.CylinderGeometry(.42,.2,.18,10),poleM,x,4.62,z,rinkW);advCol.push({x,z,r:.35,tree:true,pole:true,y:0,top:4.72})});
[[-13,3.5,-2],[13,3.5,-2]].forEach(([x,y,z])=>{const l=new THREE.PointLight(0xffc77a,.6,20);l.position.set(x,y,z);rinkW.add(l)});
// snow fort north: stairs -> tier 1 (anyone) -> tier 2 (backflip / side flip)
boxPlat(0,-17,10,6,2,snowBlk,snowTop);boxPlat(0,-17.5,4,3,5.4,snowBlk,snowTop);boxPlat(0,-13.25,3,1.5,1,snowBlk,snowTop);
for(let i=-4;i<=4;i+=2)add(B(.8,.5,.8),snowBlk,i,2.25,-19.6,rinkW);
// icy wall-jump chimney east
boxPlat(16.75,-2,2.5,6,8,iceWall,snowTop);boxPlat(22.25,-2,2.5,6,8,iceWall,snowTop);
// long-jump snow decks west, 9-unit gap
boxPlat(-19,4,5,5,2.2,snowBlk,snowTop);boxPlat(-19,-10,5,5,2.2,snowBlk,snowTop);
boxPlat(-15.75,4,1.5,3,1.1,snowBlk,snowTop);boxPlat(-22.25,-10,1.5,3,1.1,snowBlk,snowTop);
// candy-cane posts south: triple jump or backflip
function cane(x,z){add(new THREE.CylinderGeometry(.8,.8,6.6,16),boardM,x,.3,z,rinkW);
  for(let k=0;k<6;k++){const b=add(new THREE.CylinderGeometry(.82,.82,.22,16),redM,x,.35+k*.6,z,rinkW);b.rotation.z=.25}
  add(new THREE.CylinderGeometry(.84,.84,.1,16),redM,x,3.58,z,rinkW);plats.push({k:'c',x,z,r:.8,top:3.6})}
cane(-8,13);cane(8,13);cane(13,17);
// giant decorated pine with presents
tree(0,16,2.6,rinkW,advCol,0,0);
const bauble=[0xd83a2e,0xffd84a,0x2f6fd0,0xf4f6f8].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.25,metalness:.4}));
for(let k=0;k<22;k++){const a=k*2.39,h=2+(k%7)*1.05,rr=3.4*(1-(h-1)/9.5);add(new THREE.SphereGeometry(.22,10,8),bauble[k%4],Math.cos(a)*rr,h,16+Math.sin(a)*rr,rinkW)}
const star=add(new THREE.OctahedronGeometry(.6,0),new THREE.MeshStandardMaterial({color:0xffd84a,emissive:0xffb000,emissiveIntensity:1.2}),0,11.3,16,rinkW);star.scale.set(1,1.3,.4);
[[-2.6,14.6,0xd83a2e],[2.4,14.4,0x2bb3a8],[-1.2,13.6,0xffd84a],[1.6,18.6,0x2f6fd0]].forEach(([x,z,c])=>{add(B(1.1,.9,1.1),mat(c),x,.45,z,rinkW);add(B(1.14,.14,.24),mat(0xf4f6f8),x,.92,z,rinkW);advCol.push({x,z,r:.8})});
// rim trees
for(let a=0;a<PI*2;a+=PI/10){const x=Math.cos(a)*25.5,z=Math.sin(a)*25.5;if(!plats.some(p=>p.top>.5&&inside(p,x,z,2.5)))tree(x,z,.9+((a*7)%.4),rinkW,advCol,0,Math.round(a*3))}
RUNMAPS.push({name:'Frozen Rink',grp:rinkW,plats,advCol,spad:{x:0,z:9},key:'orbRunBest3',spots:[
  {x:-8,z:2,y:.12,v:100,any:1},{x:8,z:-6,y:.12,v:100,any:1},{x:0,z:-7,y:.12,v:100,any:1},
  {x:-6,z:-2,y:1.1,v:150,any:1},{x:6,z:-2,y:1.1,v:150,any:1},
  {x:0,z:1,y:3.7,v:200,air:1},{x:-3,z:-5,y:3.7,v:200,air:1},
  {x:-3,z:-16,y:2,v:150,any:1},{x:3,z:-18.5,y:2,v:150,any:1},{x:0,z:-17.5,y:5.4,v:300},
  {x:16.75,z:-2,y:8,v:350},{x:22.25,z:-2,y:8,v:350},{x:19.5,z:-2,y:4.5,v:250,air:1},
  {x:-19,z:4,y:2.2,v:150,any:1},{x:-19,z:-10,y:2.2,v:150,any:1},{x:-19,z:-1.5,y:2.2,v:200,air:1},{x:-19,z:-5,y:2.2,v:200,air:1},
  {x:-8,z:13,y:3.6,v:200},{x:8,z:13,y:3.6,v:200},{x:13,z:17,y:3.6,v:200},{x:0,z:16,y:10.53,v:400}]});
}
