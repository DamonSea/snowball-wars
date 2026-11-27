// Trick Park map 5: Christmas Village. One connected rooftop loop around a town square, built to the measured
// moveset rather than eyeballed: running jump 8.5 (apex 1.8), double 2.5, triple 3.85, long jump 10.8 (apex 1.3),
// long jump + dive ~14.3, backflip 4.56, side flip 3.8, ledge grab 1.3-1.95 above your feet. A ledge is reachable
// when its top is within 0.5 of a move's apex. Ordinary hops here are 4-6 apart, long-jump gaps 9.5 (too far for a
// running jump), and the expert leap needs a long jump and a dive.
//
//   Town Square (centre): spawn, PLAY pad, a ring of market stalls whose awnings (2.0) chain with running jumps.
//   Giant Tree (0,-10): climb it, handstand on top (9.0), Tree-top Flip onto the Clock Tower's bell deck.
//   Clock Tower (north): base deck 4.0 (triple jump / side flip from the street, or from the rooftops), bell deck
//     8.4 (backflip from the base, or the tree), and a star pole on top to climb and flip off for the sky orb.
//   Rooftop Row (north-west): Gingerbread House (eave 2.2, ridge 3.4) -> Toy Shop (3.0 / 4.2) -> Clock Tower base.
//     Pitched roofs: run the ridges, or butt-slide down a slope and hop off the eave.
//   Santa's Workshop (north-east, roof 6.0): wall-jump up Chimney Alley between it and the Gift Silo, or climb the
//     candy cane and flip. Double-jump onto its chimney (8.6). Drop west onto the Clock Tower base (Sleigh Drop).
//   Sledding Hill (west): snow terraces (1.4 / 2.8 / 4.6) and a sled chute down into the square. From the summit,
//     a long jump + dive clears the street onto the Gingerbread House (Sky Sled).
//   Frozen Pond (south-east): skate it, or long-jump from the pier to the island (9.5 gap).
{const vilW=new THREE.Group();vilW.visible=false;scene.add(vilW);advW=vilW;plats=[];advCol=[];
const G=vilW;
add(new THREE.CylinderGeometry(30.5,26,3,48),sandM,0,-1.6,0,G);
add(new THREE.CylinderGeometry(28.5,28.5,.2,48),seas(mat(0x6fbf4a),0xf3f7fb),0,-.1,0,G).castShadow=false;   // snow in winter, grass in summer
plats.push({k:'c',x:0,z:0,r:28.5,top:0});
const snowW=mat(0xffffff,{roughness:.9}),cobble=mat(0xb8b2a8,{roughness:.95}),cobDk=mat(0x8f877b,{roughness:.95}),
  ginger=mat(0xb8743c,{roughness:.8}),icing=mat(0xfdf6ee,{roughness:.6}),brick=mat(0xa4453a,{roughness:.85}),plaster=mat(0xf0e2c8,{roughness:.85}),
  timber=mat(0x5b3a24,{roughness:.8}),redRoof=mat(0xb8312f,{roughness:.7}),grnRoof=mat(0x2f6b45,{roughness:.7}),slate=mat(0x4b5563,{roughness:.75}),
  stone=mat(0xd9c7a3,{roughness:.9}),stoneDk=mat(0xc2a57c,{roughness:.9}),gold=mat(0xffcf3f,{roughness:.3,metalness:.6}),
  red=mat(0xd8282f,{roughness:.45}),grn=mat(0x2a8a4a,{roughness:.5}),white=mat(0xf8f8f8,{roughness:.5}),iron=mat(0x2e3238,{roughness:.5,metalness:.4}),
  wood=mat(0x8a5a35,{roughness:.8}),iceM=new THREE.MeshStandardMaterial({color:0xbfe8f7,roughness:.08,metalness:.15,transparent:true,opacity:.92}),
  glowWin=new THREE.MeshStandardMaterial({color:0xffd98a,emissive:0xffb347,emissiveIntensity:1.1}),
  bulbs=[0xff4d4d,0x4dff7a,0x4da6ff,0xffd84d,0xff7af0].map(c=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:1.4}));
const box=(x,z,w,d,top,sm,tm)=>boxPlat(x,z,w,d,top,sm,tm),B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
const snowCap=m=>{winterOnly.push(m);return m};
// cobbled square
add(new THREE.CylinderGeometry(11,11,.05,48),cobble,0,.03,-1,G).receiveShadow=true;
add(new THREE.TorusGeometry(11,.18,6,64),cobDk,0,.04,-1,G).rotation.x=PI/2;

// a cottage: walls up to the eaves (E), a pitched roof with its ridge along x at height R (both slopes walkable)
function cottage(cx,cz,w,d,E,R,wallM,roofM,trim,o={}){
  box(cx,cz,w,d,E,wallM,null);
  const h=R-E,half=d/2,ov=.45,len=Math.hypot(half+ov,h*(half+ov)/half),ang=Math.atan2(h,half);
  [-1,1].forEach(s=>{   // s=1: south slope (z grows southward)
    const m=add(B(w+.7,.22,len),roofM,cx,E+h/2-(h*ov/half)/2+.1,cz+s*(half-ov)/2+s*ov*.0,G);m.position.z=cz+s*(half+ov)/2;m.position.y=E+h/2-h*ov/half/2+.08;m.rotation.x=s*ang;
    snowCap(add(B(w+.75,.12,len*.98),snowW,0,0,0,G)).position.set(cx,m.position.y+.16/Math.cos(ang),m.position.z),winterOnly[winterOnly.length-1].rotation.x=s*ang;
    rampPlat('z',cz+s*half,cz,cx,w,E,R,h+.4)});
  // gable ends (triangles) filling the attic
  const tri=new THREE.Shape();tri.moveTo(-half,0);tri.lineTo(half,0);tri.lineTo(0,h);tri.lineTo(-half,0);
  const gab=new THREE.Mesh(new THREE.ExtrudeGeometry(tri,{depth:w-.02,bevelEnabled:false}),wallM);gab.rotation.y=PI/2;gab.position.set(cx-w/2+.01,E,cz);gab.castShadow=gab.receiveShadow=true;G.add(gab);
  // trim along the eaves and ridge
  add(B(w+.8,.12,.12),trim,cx,R+.1,cz,G);
  // door, wreath, glowing windows on the south face
  const fz=cz+half+.03;add(B(1,1.7,.08),timber,cx,.85,fz,G);
  const wr=add(new THREE.TorusGeometry(.28,.09,6,14),grn,cx,1.25,fz+.06,G);add(B(.18,.14,.05),red,cx,1.0,fz+.12,G);
  for(const dx of[-1,1])if(w>3.2){add(B(.8,.8,.06),glowWin,cx+dx*(w/2-1),1.3,fz,G);add(B(.9,.08,.08),trim,cx+dx*(w/2-1),.86,fz+.04,G)}
  if(E>2.6)for(const dx of[-1,0,1])add(B(.6,.6,.06),glowWin,cx+dx*w/3.2,E-.7,fz,G);
  // little chimney (decor) and a string of lights along the front eave
  if(o.chim!==false){add(B(.6,1.2,.6),brick,cx+w/2-.8,R-.1,cz-half/2,G)}
  for(let i=0;i<=Math.floor(w/.7);i++)add(new THREE.SphereGeometry(.07,6,5),bulbs[i%5],cx-w/2+i*.7,E-.08,fz+.25,G)}

// a candy cane you can climb (a pole): striped shaft and a hook on top
function candyCane(x,z,top,hookDir=0){add(new THREE.CylinderGeometry(.12,.12,top,10),white,x,top/2,z,G);
  for(let y=.3;y<top-.2;y+=.45){const r=add(new THREE.TorusGeometry(.125,.04,5,12),red,x,y,z,G);r.rotation.x=PI/2+.5}
  const hk=add(new THREE.TorusGeometry(.38,.12,8,14,PI),red,x+Math.cos(hookDir)*.38,top,z+Math.sin(hookDir)*.38,G);hk.rotation.y=-hookDir;
  advCol.push({x,z,r:.3,tree:true,pole:true,y:0,top:top+.05})}

// the giant Christmas tree: climbable like any tree, dressed with baubles and lights (the star on top is an orb)
function xmasTree(x,z,s){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);G.add(g);
  add(new THREE.CylinderGeometry(.22,.3,1.4,8),trunkM,0,.7,0,g);
  const lm=mat(0x1f6b3a,{roughness:.8});[[1.5,2.2,2.0],[1.15,1.9,3.0],[.8,1.5,3.85]].forEach(([r,h,y])=>add(new THREE.ConeGeometry(r,h,10),lm,0,y,0,g));
  [[1.3,1.65],[1.0,2.6],[.68,3.5]].forEach(([r,y],k)=>{for(let i=0;i<9;i++){const a=i/9*PI*2+k;add(new THREE.SphereGeometry(.12,8,6),bulbs[(i+k)%5],Math.cos(a)*r,y,Math.sin(a)*r,g)}});
  advCol.push({x,z,r:.65*s,tree:true,y:0,top:4.05*s});return g}
// gift boxes: solid presents with a ribbon cross
function gift(x,z,w,top,col,rib){box(x,z,w,w,top,col,col);add(B(w+.04,.06,.22),rib,x,top+.01,z,G);add(B(.22,.06,w+.04),rib,x,top+.01,z,G);
  add(B(w+.03,top,.2),rib,x,top/2,z,G);add(B(.2,top,w+.03),rib,x,top/2,z,G)}
// a market stall: awning on four posts (walk underneath, hop along the tops)
function stall(x,z,w,d,top,cA,cB){floatPlat(x,z,w,d,top,.3,cA,null);
  for(let i=0;i<Math.round(w/.6);i++)add(B(.6,.06,d+.06),i%2?cA:cB,x-w/2+.3+i*.6,top+.02,z,G);
  for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])add(new THREE.CylinderGeometry(.08,.08,top-.3,6),wood,x+a*(w/2-.15),(top-.3)/2,z+b*(d/2-.15),G);
  add(B(w-.4,.9,d-.6),wood,x,.45,z,G);plats.push({k:'b',x,z,w:w-.4,d:d-.6,top:.9})}
// string of lights between two points (decor)
function lights(x0,y0,z0,x1,y1,z1,n=10){for(let i=0;i<=n;i++){const t=i/n,sag=Math.sin(t*PI)*.45;add(new THREE.SphereGeometry(.08,6,5),bulbs[i%5],x0+(x1-x0)*t,y0+(y1-y0)*t-sag,z0+(z1-z0)*t,G)}}

// ================= Town Square =================
xmasTree(0,-10,2.22);                                   // top 9.0
// big baubles around the tree's base (solid, like rocks)
[[-2.6,-8.4,0],[2.7,-8.6,2],[-2.2,-12.4,3],[2.4,-12,1]].forEach(([x,z,c])=>{add(new THREE.SphereGeometry(.55,14,10),bulbs[c],x,.55,z,G);add(B(.2,.18,.2),gold,x,1.12,z,G);advCol.push({x,z,r:.6})});
// market stalls: a ring of awnings at 2.0, 5-6 apart, hop round the square
const STALLS=[[-8.5,-1.5,0],[-6.5,4.0,1],[6.5,5.2,2],[8.5,-1.5,3],[6,-6.8,4]];
STALLS.forEach(([x,z,c])=>stall(x,z,3,2.2,2.0,[red,grn,mat(0x2f6fd0),mat(0xffb020),mat(0x9a5fc4)][c],white));
// lamp posts that are candy canes (climb, handstand on top at 4.4)
[[-4.5,-4.5,0],[4.5,-4.5,PI],[-3.5,3,0],[3.5,3,PI]].forEach(([x,z,h])=>candyCane(x,z,4.4,h));
lights(-4.5,4.3,-4.5,4.5,4.3,-4.5,14);

// ================= Clock Tower (north) =================
box(0,-19,8,8,4.0,stone,cobble);                         // base deck x -4..4, z -15..-23
box(0,-19,4.5,4.5,8.4,stoneDk,slate);                    // bell deck x -2.25..2.25, z -16.75..-21.25
// clock face on the bell tower's south side, and a bell in an arch (decor)
add(new THREE.CylinderGeometry(1.25,1.25,.12,32),white,0,6.5,-16.7,G).rotation.x=PI/2;add(new THREE.TorusGeometry(1.25,.1,8,32),gold,0,6.5,-16.66,G);
add(B(.08,.85,.06),iron,0,6.85,-16.6,G);add(B(.6,.08,.06),iron,.27,6.5,-16.6,G);
for(let k=0;k<12;k++){const a=k/12*PI*2;add(B(.08,.2,.04),iron,Math.sin(a)*1.05,6.5+Math.cos(a)*1.05,-16.62,G)}
add(new THREE.CylinderGeometry(.35,.6,.8,12,1,true),gold,-1.4,8.9,-20.4,G);
// star pole on the bell deck: climb it and flip for the sky orb
add(new THREE.CylinderGeometry(.1,.1,3.2,8),gold,1.3,8.4+1.6,-20.3,G);advCol.push({x:1.3,z:-20.3,r:.3,tree:true,pole:true,y:8.4,top:11.65});
{const st=new THREE.Shape();for(let i=0;i<10;i++){const a=PI/2+i*PI/5,r=i%2?.25:.6;i?st.lineTo(Math.cos(a)*r,Math.sin(a)*r):st.moveTo(Math.cos(a)*r,Math.sin(a)*r)}
 const s=new THREE.Mesh(new THREE.ExtrudeGeometry(st,{depth:.12,bevelEnabled:false}),new THREE.MeshStandardMaterial({color:0xffe066,emissive:0xffc21a,emissiveIntensity:1.4}));s.position.set(1.3,12.3,-20.36);G.add(s)}
// trim bands, a door, arched windows and a wreath, so the tower reads as the village landmark
add(B(8.06,.25,8.06),red,0,3.85,-19,G);add(B(4.56,.25,4.56),red,0,8.25,-19,G);add(B(4.56,.18,4.56),white,0,4.15,-19,G);
add(B(1.4,2.4,.1),timber,0,1.2,-14.95,G);add(new THREE.CylinderGeometry(.7,.7,.1,16,1,false,0,PI),timber,0,2.4,-14.95,G).rotation.x=PI/2;
for(const dx of[-2.6,2.6]){add(B(.9,1.3,.08),glowWin,dx,2.2,-14.95,G);add(new THREE.CylinderGeometry(.45,.45,.08,12,1,false,0,PI),glowWin,dx,2.85,-14.95,G).rotation.x=PI/2}
add(new THREE.TorusGeometry(.5,.16,8,18),grn,0,3.25,-14.9,G);add(B(.3,.25,.08),red,0,2.85,-14.84,G);
// battlement posts on the base deck corners (decor) and garland
for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])add(B(.5,.7,.5),stoneDk,a*3.75,4.35,-19+b*3.75,G);
lights(-4,4.6,-15,4,4.6,-15,16);

// ================= Rooftop Row (north-west) =================
cottage(-19,-13,4,6,2.0,3.2,ginger,mat(0x7a4a2a),icing);  // Gingerbread House x -21..-17, z -10..-16
// gumdrops and candy trim on the gingerbread house
[[-20.4,2.1],[-19,2.1],[-17.6,2.1]].forEach(([x,y],i)=>add(new THREE.SphereGeometry(.2,10,8),bulbs[i],x,y,-9.9,G));
cottage(-10.25,-14,4.5,6,3.0,4.2,plaster,redRoof,timber); // Toy Shop x -12.5..-8, z -11..-17
add(B(2.6,.5,.08),mat(0x2f6fd0),-10.25,2.5,-10.94,G);      // shop sign
// crates by the Gingerbread House: a little leg-up for anyone (1.0)
gift(-15,-8.6,1.3,1.0,mat(0x2f6fd0),gold);

// ================= Santa's Workshop (north-east) =================
box(14.5,-14,7,10,6.0,brick,snowW);                      // Workshop x 11..18, z -9..-19, roof 6.0
// the Gift Silo: a giant wrapped present (x 11..18, z -3..-6). Chimney Alley is the 3-wide gap behind it (z -6..-9).
{const wrap=mat(0x2a8a4a,{roughness:.55}),rib=gold;box(14.5,-4.5,7,3,6.0,wrap,wrap);
 add(B(7.04,6,.5),rib,14.5,3,-4.5,G);add(B(.5,6,3.04),rib,14.5,3,-4.5,G);add(B(7.04,.06,.5),rib,14.5,6.02,-4.5,G);add(B(.5,.06,3.04),rib,14.5,6.02,-4.5,G);
 [-1,1].forEach(k=>{const l=add(new THREE.TorusGeometry(.55,.16,8,16),rib,14.5+k*.55,6.15,-4.5,G);l.rotation.x=PI/2;l.scale.set(1,.6,1)})}
box(16.5,-17,2,2,8.6,brick,snowW);                       // big chimney: double jump from the roof
add(B(2.3,.3,2.3),stoneDk,16.5,8.75,-17,G);
candyCane(10.4,-9.6,6.6,-PI/2);
// candy-striped trim round the workshop roof, a big door on the west wall and a sign over the alley
for(let i=0;i<14;i++){const m=i%2?red:white;add(B(.5,.25,.12),m,11.25+i*.5,6.12,-9.04,G);add(B(.5,.25,.12),m,11.25+i*.5,6.12,-18.96,G)}
for(let i=0;i<20;i++){const m=i%2?red:white;add(B(.12,.25,.5),m,11.04,6.12,-9.25-i*.5,G);add(B(.12,.25,.5),m,17.96,6.12,-9.25-i*.5,G)}
add(B(.1,3,2.4),timber,10.95,1.5,-14,G);add(B(.12,.12,2.6),gold,10.9,3.05,-14,G);
add(B(4.2,.8,.1),red,14.5,7.0,-8.96,G);
{const c=document.createElement('canvas');c.width=512;c.height=80;const x=c.getContext('2d');if(x){x.fillStyle='#fff8ec';x.fillRect(0,0,512,80);x.fillStyle='#c62828';x.font='800 46px "Baloo 2", system-ui, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText("SANTA'S WORKSHOP",256,42)}
 add(B(4,.6,.12),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c)}),14.5,7.0,-8.92,G)}                          // candy cane by the alley mouth: climb, flip onto the roof
// sleigh on the roof (decor + a low solid seat)
{const sx=13.2,sz=-12.5;add(B(1.4,.6,2.4),red,sx,6.4,sz,G);add(B(1.5,.12,2.6),gold,sx,6.75,sz,G);
 [-1,1].forEach(k=>{add(B(.1,.1,3),gold,sx+k*.6,6.06,sz,G);add(new THREE.TorusGeometry(.3,.05,6,12,PI),gold,sx+k*.6,6.3,sz-1.45,G).rotation.y=PI/2});
 plats.push({k:'b',x:sx,z:sz,w:1.4,d:2.4,top:6.7})}
for(let i=0;i<6;i++)add(B(.9,.9,.06),glowWin,11.8+i*1.15,3.2,-8.97,G);
lights(11,6.1,-9,18,6.1,-9,12);

// ================= Sledding Hill (west) =================
const hillM=mat(0xf2f6fa,{roughness:.95}),hillS=mat(0xdfe7ee,{roughness:.95});
[[6,1.4],[4.4,2.8],[2.8,4.6]].forEach(([r,top])=>{const h=top+3;add(new THREE.CylinderGeometry(r,r+.6,h,36),hillS,-18,top-h/2,8.5,G);add(new THREE.CylinderGeometry(r,r,.12,36),hillM,-18,top-.05,8.5,G);plats.push({k:'c',x:-18,z:8.5,r,top})});
slideChute('x',-4,-15.4,8.5,2.4,.3,4.6,mat(0x37a6e8,{roughness:.35}),red,iron,G);   // chute from the summit down to the square
[[-22.5,11.1],[-22.5,5.9],[-18.9,3.4]].forEach(([x,z],i)=>tree(x,z,.55,G,advCol,1.4,i));   // pines on the terraces
// a flag on the summit
add(new THREE.CylinderGeometry(.05,.05,2.2,6),iron,-18.8,5.7,9.3,G);add(B(.9,.5,.04),red,-18.35,6.55,9.3,G);

// ================= Reindeer Stable (east) =================
cottage(19,4,5,6,2.0,3.4,mat(0x8c3b2e),grnRoof,white,{chim:false});   // x 16.5..21.5, z 1..7: slide off its roof
for(const[x,z,r]of[[15,8.6,.3],[16.6,9.6,-.2]]){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=r;G.add(g);const fur=mat(0x9a6a44);
  add(B(1.1,.55,.45),fur,0,1.0,0,g);add(B(.3,.45,.3),fur,.55,1.4,0,g);add(new THREE.SphereGeometry(.1,8,6),red,.75,1.45,0,g);
  for(const[a,b]of[[-.4,-.15],[-.4,.15],[.4,-.15],[.4,.15]])add(B(.1,.75,.1),fur,a,.38,b,g);
  [-1,1].forEach(k=>add(B(.05,.35,.05),timber,.5,1.75,k*.12,g));advCol.push({x,z,r:.55})}
for(let i=0;i<6;i++){add(B(.1,.9,.1),wood,14.2+i*1.3,.45,10.6,G)}add(B(6.6,.1,.08),wood,17.45,.75,10.6,G);

// ================= Frozen Pond (south-east) =================
plats.push({k:'b',x:11.5,z:13.5,w:13,d:9,top:.12,ice:true});
add(B(13,.12,9),iceM,11.5,.06,13.5,G).receiveShadow=true;
box(1,13.5,7,2,1.2,wood,wood);                           // pier x -2.5..4.5 (run-up), z 12.5..14.5
for(let i=0;i<7;i++)add(B(.12,.04,2),timber,-2.2+i,1.22,13.5,G);
{const h=4.2;add(new THREE.CylinderGeometry(1.6,1.9,h,24),stone,15.6,1.2-h/2,13.5,G);add(new THREE.CylinderGeometry(1.6,1.6,.12,24),snowW,15.6,1.18,13.5,G);plats.push({k:'c',x:15.6,z:13.5,r:1.6,top:1.2})}   // island: 9.5 from the pier
add(new THREE.CylinderGeometry(.06,.06,1.8,6),iron,15.6,2.1,13.5,G);add(new THREE.SphereGeometry(.22,10,8),glowWin,15.6,3.05,13.5,G);

// ================= edges: pines all round =================
for(let a=0;a<PI*2;a+=PI/10){const x=Math.cos(a)*25.5,z=Math.sin(a)*25.5;if(!plats.some(p=>p.top>.5&&inside(p,x,z,2.5)))tree(x,z,.9+((a*7)%.4),G,advCol,0,Math.round(a*3))}

// ---- performance: the village is mostly small decorations (bulbs, stripes, trim). Collision lives in `plats`/`advCol`,
// not in the meshes, so every static mesh that shares a material is merged into one: far fewer draw calls.
// Season-only meshes, textured ones and ones that don't cast shadows stay as they are.
mergeStatic(G);

// ---- named gaps (points into the combo) ----
const R=(x,z,w,d,y)=>({x,z,w,d,y});
const BASE=R(0,-19,8,8,4),BELL=R(0,-19,4.5,4.5,8.4),TREE=R(0,-10,2.6,2.6,9),GINGER={...R(-19,-13,4,6,2.0),y1:3.2},TOY={...R(-10.25,-14,4.5,6,3),y1:4.2},STABLE={...R(19,4,5,6,2),y1:3.4},
  SHOP=R(14.5,-14,7,10,6),SILO=R(14.5,-4.5,7,3,6),CHIM=R(16.5,-17,2,2,8.6),ALLEY=R(14.5,-7.5,7,3,0),SUMMIT=R(-18,8.5,5.6,5.6,4.6),
  PIER=R(1,13.5,7,2,1.2),ISLE=R(15.6,13.5,3.2,3.2,1.2),AWN=STALLS.map(([x,z])=>R(x,z,3,2.2,2)),GROUND=R(0,0,60,60,0);
const gaps=[
  {name:'Tree-top Flip',pts:450,from:[TREE],to:[BELL]},
  {name:'Bell Climb',pts:200,from:[BASE],to:[BELL]},
  {name:'Rooftop Run',pts:150,from:[GINGER],to:[TOY]},
  {name:'Toy Shop Hop',pts:150,from:[TOY],to:[BASE]},
  {name:'Chimney Alley',pts:300,from:[ALLEY],to:[SHOP,SILO]},
  {name:'Chimney Top',pts:200,from:[SHOP],to:[CHIM]},
  {name:'Sleigh Drop',pts:250,from:[SHOP,CHIM],to:[BASE]},
  {name:'Sky Sled',pts:500,from:[SUMMIT],to:[GINGER,TOY]},
  {name:'Ice Leap',pts:300,from:[PIER],to:[ISLE]},
  {name:'Awning Hop',pts:75,from:AWN,to:AWN},
  {name:'Stable Slide',pts:100,from:[STABLE],to:[GROUND]},
  {name:'Bell Dive',pts:150,from:[BELL],to:[GROUND]}];
RUNMAPS.push({name:'Christmas Village',orbSkin:'star',grp:G,plats,advCol,spad:{x:3.5,z:8.5},key:'orbRunVillage',gaps,
  rollers:[[-8,14],[9,2],[-12,-2],[22,-4]],spots:[
  {x:-5,z:1,y:0,v:100,any:1},{x:5,z:-1,y:0,v:100,any:1},{x:-8.5,z:-1.5,y:2,v:150,any:1},{x:6.5,z:5.2,y:2,v:150,any:1},{x:19,z:4,y:3.4,v:150,any:1},{x:6,z:-6.8,y:2,v:150,any:1},
  {x:-19,z:-13,y:3.2,v:150,any:1},{x:-10.25,z:-14,y:4.2,v:200,any:1},{x:-2.8,z:-16,y:4,v:250,any:1},{x:2.8,z:-22,y:4,v:250},
  {x:0,z:-19,y:8.4,v:400},{x:1.3,z:-20.3,y:13.2,v:450,air:1},{x:0,z:-10,y:10,v:300,air:1},
  {x:13,z:-16,y:6,v:300},{x:16.5,z:-17,y:8.6,v:400},{x:14.5,z:-7.5,y:3.6,v:250,air:1},{x:-4.5,z:-4.5,y:5.4,v:200,air:1},
  {x:-18,z:8.5,y:4.6,v:250,any:1},{x:-8,z:8.5,y:1.81,v:150,any:1},{x:-18,z:0,y:5.6,v:400,air:1},
  {x:1,z:13.5,y:1.2,v:100,any:1},{x:15.6,z:13.5,y:1.2,v:300,any:1},{x:9,z:15,y:.12,v:100,any:1}]});
}
