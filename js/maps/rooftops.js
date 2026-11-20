// Trick Park map 3: Rooftops. A vertical city block of wall-jump alleys, roofs, fire escape and street furniture.
// ----- Rooftops: a vertical city block built around wall-jump alleys -----
{const cityW=new THREE.Group();cityW.visible=false;scene.add(cityW);advW=cityW;plats=[];advCol=[];
const asph=seas(mat(0x3d4148,{roughness:.9}),0x4f555d),walk=seas(mat(0xb9b4aa),0xdfe5ea),roof=seas(mat(0x7d838b),0xf2f6fa),
      metal=mat(0x3a3f47,{roughness:.5,metalness:.3}),stripe=mat(0xf4f6f8),yel=mat(0xffd84a);
add(new THREE.CylinderGeometry(30.5,26,3,48),seas(mat(0x8f8a80),0xc4ccd3),0,-1.6,0,cityW);
add(new THREE.CylinderGeometry(28.5,28.5,.2,48),asph,0,-.1,0,cityW).castShadow=false;
plats.push({k:'c',x:0,z:0,r:28.5,top:0});
// facades: a canvas of windows (lit ones glow) repeated across each building
function facade(base){const W=128,cv=document.createElement('canvas'),ev=document.createElement('canvas');cv.width=ev.width=W;cv.height=ev.height=W;
  const x=cv.getContext('2d'),e=ev.getContext('2d');x.fillStyle=base;x.fillRect(0,0,W,W);e.fillStyle='#000';e.fillRect(0,0,W,W);
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){const lit=Math.random()<.42;x.fillStyle=lit?'#ffd98a':'#2b3a4a';x.fillRect(5+i*32,6+j*32,22,20);
    x.fillStyle='rgba(0,0,0,.25)';x.fillRect(5+i*32,26+j*32,22,3);if(lit){e.fillStyle='#ffb75e';e.fillRect(5+i*32,6+j*32,22,20)}}
  const t=new THREE.CanvasTexture(cv),et=new THREE.CanvasTexture(ev);[t,et].forEach(q=>{q.wrapS=q.wrapT=THREE.RepeatWrapping});return{t,et}}
const FAC=['#b85c48','#6f7f96','#c9a26b','#7e9a86','#a46a8c'].map(facade);
function building(x,z,w,d,top,fi){const f=FAC[fi%FAC.length],m=new THREE.MeshStandardMaterial({map:f.t.clone(),emissiveMap:f.et.clone(),emissive:0xffc27a,emissiveIntensity:.55,roughness:.85});
  [m.map,m.emissiveMap].forEach(q=>{q.needsUpdate=true;q.repeat.set(Math.max(w,d)/4,(top+3)/4)});
  boxPlat(x,z,w,d,top,m,roof);add(B(w+.3,.35,d+.3),metal,x,top+.05,z,cityW);
  add(B(w+.1,.12,d+.1),walk,x,.02,z+d/2+.9,cityW)}
// back row: alleys at x = -4.5 and 4.5 (3 wide)
building(-9,-14,6,6,10,0);building(0,-14,6,6,14,1);building(9,-14,6,6,11,2);
// side clusters: alleys at x = -16.5 and 16.5
building(-12.5,-2,5,6,6,3);building(-20.5,-2,5,6,10,4);building(12.5,-2,5,6,9,2);building(20.5,-2,5,6,13,0);
// fire escape up the low building (anyone can climb it)
[[-14.4,1.2],[-13.2,2.4],[-12,3.6],[-10.8,4.8]].forEach(([x,t])=>{boxPlat(x,1.75,1.2,1.5,t,metal,metal);add(B(.05,.6,1.5),metal,x+.58,t+.3,1.75,cityW)});
// water tower on the east back-row roof (its top is a platform)
{const x=9,z=-15.4;for(const[a,b]of[[-.8,-.8],[.8,-.8],[-.8,.8],[.8,.8]])add(new THREE.CylinderGeometry(.08,.08,1.6,6),metal,x+a,11.8,z+b,cityW);
  add(new THREE.CylinderGeometry(1.3,1.3,1.8,16),seas(mat(0x8a5a3a),0x9a7a62),x,13.4,z,cityW);add(new THREE.ConeGeometry(1.45,.7,16),roof,x,14.55,z,cityW);
  plats.push({k:'c',x,z,r:1.3,top:14.3});}
// antenna and blinking light on the tallest tower
add(new THREE.CylinderGeometry(.06,.1,4,6),metal,1.8,16,-15.8,cityW);
const blink=new THREE.MeshStandardMaterial({color:0xff3b30,emissive:0xff3b30,emissiveIntensity:2});add(new THREE.SphereGeometry(.16,10,8),blink,1.8,18.1,-15.8,cityW);
// neon sign on the tallest tower's face
{const cv=document.createElement('canvas');cv.width=512;cv.height=128;const x=cv.getContext('2d');x.fillStyle='#14202b';x.fillRect(0,0,512,128);
  x.strokeStyle='#5ff3ff';x.lineWidth=6;x.strokeRect(8,8,496,112);x.fillStyle='#ff7ad9';x.shadowColor='#ff7ad9';x.shadowBlur=18;x.font='800 72px "Baloo 2", system-ui, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('ROOFTOPS',256,68);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(4.8,1.2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)}));sign.position.set(0,11.6,-10.94);cityW.add(sign)}
// street furniture: cars and a bus (you can stand on them), lamps, crosswalks
function car(x,z,c,top=1.3,w=2,d=4){const m=mat(c,{roughness:.4,metalness:.2});add(B(w,top*.62,d),m,x,top*.31+.12,z,cityW);add(B(w*.9,top*.42,d*.55),m,x,top*.62+top*.21,z-d*.05,cityW);
  add(B(w*.92,top*.3,d*.5),mat(0x9fd3e8,{roughness:.1,metalness:.3}),x,top*.8,z-d*.05,cityW);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>add(new THREE.CylinderGeometry(.3,.3,.25,10),metal,x+a*w*.48,.3,z+b*d*.32,cityW).rotation.z=PI/2);
  plats.push({k:'b',x,z,w,d,top})}
car(4.5,10,0xd83a2e);car(-5,11,0x2f6fd0);car(8,10,0xffcc33,2.6,2.6,7);
[[-6,-6],[6,-6],[-6,5],[6,5],[-18,6],[18,6]].forEach(([x,z])=>{add(new THREE.CylinderGeometry(.09,.13,4,8),metal,x,2,z,cityW);
  add(new THREE.SphereGeometry(.28,12,8),new THREE.MeshStandardMaterial({color:0xffe2a8,emissive:0xffc46b,emissiveIntensity:1.4}),x,4.1,z,cityW);advCol.push({x,z,r:.3})});
for(let k=-3;k<=3;k++)add(B(.7,.02,3),stripe,k*1.3,.02,-7.5,cityW);
for(let k=-2;k<=2;k++)add(B(3,.02,.7),stripe,-8,.02,k*1.3+4,cityW);
add(B(.25,.02,30),yel,0,.015,6,cityW);
[[-24,8],[24,8],[-10,22],[10,22],[0,24]].forEach(([x,z],i)=>tree(x,z,1,cityW,advCol,0,i));
RUNMAPS.push({name:'Rooftops',grp:cityW,plats,advCol,spad:{x:0,z:5},key:'orbRunBest4',spots:[
  {x:-14.4,z:1.75,y:1.2,v:150,any:1},{x:-10.8,z:1.75,y:4.8,v:150,any:1},{x:-12.5,z:-3,y:6,v:200,any:1},
  {x:4.5,z:10,y:1.3,v:100,any:1},{x:8,z:11,y:2.6,v:150,any:1},
  {x:-20.5,z:-2,y:10,v:300},{x:12.5,z:-2,y:9,v:250},{x:20.5,z:-2,y:13,v:400},
  {x:-9,z:-14,y:10,v:300},{x:7,z:-12.5,y:11,v:350},{x:9,z:-15.4,y:14.3,v:450},{x:-1,z:-13,y:14,v:500},
  {x:-4.5,z:-14,y:5,v:250,air:1},{x:-4.5,z:-14,y:8.5,v:300,air:1},{x:4.5,z:-14,y:6,v:250,air:1},{x:4.5,z:-14,y:9.5,v:300,air:1},
  {x:16.5,z:-2,y:5,v:250,air:1},{x:-16.5,z:-2,y:4,v:250,air:1}],blink});
}
