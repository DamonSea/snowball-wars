// Trick Park map 4: Jungle Gym. One connected playground instead of scattered set pieces: every structure
// hands you to the next, and each one is built around a move. Heights come from the jump math in tuning.js
// (apex = v*v/48; a ledge you can hang from is within T.hang.max of your feet as you fall past it).
//
//   The Fort (centre): Deck 1 (2.4) on posts you can run under, reached by steps or the Tire Run.
//     The Roof (5.4) sits above it: backflip, side flip, or ledge-hang and pull up. A fireman pole at the
//     south-east corner tops out at 6.0: handstand, then flip onto the roof.
//   Monkey Bars (east): hang from the side and shimmy hand over hand, or balance along the top, to the
//     East Tower (3.4). Next to it, Pound Peak (9.0) is too tall to jump: ground pound on the tower and
//     Pound Jump straight up onto it. From the peak, long-jump back onto the Roof (Peak Plunge).
//   Bounce House (north): two trampolines launch you onto the North Deck (5.8). Ground pound onto one
//     for a super bounce.
//   The Canyon (west): a wall-jump chimney whose tops (8.0) hop over from the North Deck and leap back
//     to the Roof.
//   Swing Set (south-east): climb a pole, circle to its east side, Pole Leap onto the crossbar.
{const gymW=new THREE.Group();gymW.visible=false;scene.add(gymW);advW=gymW;plats=[];advCol=[];
add(new THREE.CylinderGeometry(30.5,26,3,48),sandM,0,-1.6,0,gymW);
add(new THREE.CylinderGeometry(28.5,28.5,.2,48),grassM,0,-.1,0,gymW).castShadow=false;
plats.push({k:'c',x:0,z:0,r:28.5,top:0});
const wood=seas(mat(0xb07a45,{roughness:.8}),0x9a7458),deck=seas(mat(0xc98d52,{roughness:.75}),0xf4f8fb),
      red=mat(0xd83a2e,{roughness:.45,metalness:.25}),blue=mat(0x2f6fd0,{roughness:.45,metalness:.25}),yel=mat(0xffd84a,{roughness:.45,metalness:.25}),
      grn=mat(0x3fb56a,{roughness:.45,metalness:.25}),steel=mat(0x9aa3ab,{roughness:.35,metalness:.6}),rubber=seas(mat(0xb5523b,{roughness:.95}),0xe9eef2),
      tireM=mat(0x22262b,{roughness:.9}),stone=seas(mat(0xb9ab8c),0xc4cbd0),snowT=seas(mat(0x6fbf4a),0xf6f9fc);
const post=(x,z,y0,y1,m,r=.14)=>add(new THREE.CylinderGeometry(r,r,y1-y0,10),m,x,(y0+y1)/2,z,gymW);
const pole=(x,z,y0,top,m)=>{post(x,z,y0,top,m,.1);add(new THREE.SphereGeometry(.17,10,8),m,x,top,z,gymW);advCol.push({x,z,r:.3,tree:true,pole:true,y:y0,top:top+.05})};
// soft play surface under the whole gym, so it reads as one place
add(new THREE.CylinderGeometry(19,19,.04,48),rubber,0,.02,-1,gymW).receiveShadow=true;

// ---- The Fort ----
floatPlat(0,0,8,8,2.4,.45,wood,deck);                     // Deck 1  x -4..4, z -4..4, underside 1.95
[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b],i)=>{post(a*3.7,b*3.7,0,1.95,[red,blue,yel,grn][i]);advCol.push({x:a*3.7,z:b*3.7,r:.25})});
floatPlat(0,-1,4.4,4.4,5.4,.4,wood,deck);                 // Roof    x -2.2..2.2, z -3.2..1.2, underside 5.0
[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b],i)=>post(a*2,-1+b*2,2.4,5.0,[grn,yel,blue,red][i],.11));
post(-1.9,-2.9,5.4,7.2,steel,.05);add(B(1,.6,.04),red,-1.35,6.85,-2.9,gymW);   // flag on the roof's corner
boxPlat(0,6.3,2.6,1.4,.9,stone,snowT);boxPlat(0,4.85,2.6,1.5,1.65,stone,snowT);   // steps up to Deck 1
pole(4.6,4.6,0,6.0,yel);                                   // fireman pole, handstand at 6.0

// ---- Monkey Bars and the East Tower ----
floatPlat(8.1,0,7.8,.9,3.4,.2,steel,null);                 // bars x 4.2..12, z -.45..45, underside 3.2
for(let k=0;k<12;k++)add(new THREE.CylinderGeometry(.05,.05,.9,6),blue,4.5+k*.66,3.32,0,gymW).rotation.x=PI/2;   // rungs
[-.45,.45].forEach(z=>add(B(7.8,.1,.1),blue,8.1,3.32,z,gymW));
[[4.5,-1],[4.5,1],[11.7,-1],[11.7,1]].forEach(([x,s])=>{const l=post(x,s*.75,0,3.25,blue,.08);l.rotation.x=s*.2});
boxPlat(14,0,4,4,3.4,stone,mat(0x2f6fd0));                 // East Tower x 12..16, z -2..2
boxPlat(14,-3.2,2.4,2.4,9,stone,mat(0xffd84a));            // Pound Peak  z -4.4..-2 (touches the tower's north side)
for(let k=0;k<4;k++)add(B(2.42,.16,2.42),[red,blue,yel,grn][k],14,3.6+k*1.3,-3.2,gymW);
pole(14.95,-4.15,9,11.4,red);add(B(.9,.55,.04),yel,15.45,11.1,-4.15,gymW);   // summit flag pole (corner, out of the way)

// ---- Bounce House and the North Deck ----
bouncePad(-2.8,-9.2,1.15,.35,red);bouncePad(2.8,-9.2,1.15,.35,blue);
floatPlat(0,-14.5,10,6,5.8,.45,wood,deck);                  // North Deck x -5..5, z -11.5..-17.5 (room for a long-jump run-up)
[[-4.6,-11.9],[4.6,-11.9],[-4.6,-17.1],[4.6,-17.1]].forEach(([x,z],i)=>{post(x,z,0,5.35,[yel,grn,red,blue][i]);advCol.push({x,z,r:.25})});

// ---- The Canyon (wall-jump chimney) ----
boxPlat(-9.75,-9,2.5,8,8,stone,mat(0x3fb56a));            // east wall x -11..-8.5
boxPlat(-15.25,-9,2.5,8,8,stone,mat(0x3fb56a));           // west wall x -16.5..-14   (3 wide gap)
boxPlat(-12.5,-4,8,2,8,stone,mat(0xffd84a));             // Lookout across the south end: a run-up for the leap to the roof
for(let k=0;k<14;k++){const y=.8+k*.5,s=k%2?1:-1;add(new THREE.SphereGeometry(.12,6,5),[red,blue,yel,grn][k%4],s<0?-11.02:-13.98,y,-12+((k*1.7)%7),gymW)}   // climbing holds (decor)

// ---- Tire Run ----
[[-7.6,9,.8],[-9.2,7.2,1.6],[-8.8,4.8,2.4],[-6.6,3.4,2.4]].forEach(([x,z,t],i)=>{
  add(new THREE.CylinderGeometry(.8,.8,t,16),[grn,yel,red,blue][i],x,t/2,z,gymW);
  add(new THREE.TorusGeometry(.62,.2,8,20),tireM,x,t,z,gymW).rotation.x=PI/2;plats.push({k:'c',x,z,r:.8,top:t})});

// ---- Swing Set ----
pole(7,9.5,0,4.4,red);pole(12,9.5,0,4.4,red);
floatPlat(9.5,9.5,4.2,.35,4.5,.25,steel,null);              // crossbar x 7.4..11.6
[-1,1].forEach(s=>{const a=post(7+s*.0,9.5+s*.7,0,4.3,red,.07);a.rotation.x=-s*.16;const b=post(12,9.5+s*.7,0,4.3,red,.07);b.rotation.x=-s*.16});
[8.5,10.5].forEach(x=>{[-.25,.25].forEach(dx=>add(new THREE.CylinderGeometry(.015,.015,3.1,4),steel,x+dx,2.7,9.5,gymW));add(B(.8,.07,.35),yel,x,1.15,9.5,gymW)});

// ---- around the edge ----
[[-20,-18],[-23.5,-1],[-22,8],[-19,17],[20,-19],[23,-5],[22,9],[18,18],[-6,-22],[7,-23]].forEach(([x,z],i)=>tree(x,z,.9+(i%3)*.2,gymW,advCol,0,i));
[[-16,0],[16,6]].forEach(([x,z])=>{add(new THREE.CylinderGeometry(.09,.13,4,8),steel,x,2,z,gymW);
  add(new THREE.SphereGeometry(.28,12,8),new THREE.MeshStandardMaterial({color:0xffe2a8,emissive:0xffc46b,emissiveIntensity:1.3}),x,4.1,z,gymW);advCol.push({x,z,r:.3,tree:true,pole:true,y:0,top:4.4})});

const R=(x,z,w,d,y)=>({x,z,w,d,y});
const F1=R(0,0,8,8,2.4),F2=R(0,-1,4.4,4.4,5.4),EAST=R(14,0,4,4,3.4),PEAK=R(14,-3.2,2.4,2.4,9),NORTH=R(0,-14.5,10,6,5.8),
      PADS=R(0,-9.2,9,4,0),CANYON=R(-12.5,-9.5,3,7,0),CTOP=[R(-9.75,-9,2.5,8,8),R(-15.25,-9,2.5,8,8),R(-12.5,-4,8,2,8)],
      T34=[R(-8.8,4.8,1.6,1.6,2.4),R(-6.6,3.4,1.6,1.6,2.4)],POLE=R(4.6,4.6,1,1,6),SWP=[R(7,9.5,1,1,4.4),R(12,9.5,1,1,4.4)],SWBAR=R(9.5,9.5,4.2,.6,4.5);
const gaps=[
  {name:'Tire Run',pts:100,from:T34,to:[F1]},
  {name:'Fort Climb',pts:150,from:[F1],to:[F2]},
  {name:'Fireman Flip',pts:300,from:[POLE],to:[F2]},
  {name:'Pound Peak',pts:350,from:[EAST],to:[PEAK]},
  {name:'Peak Plunge',pts:450,from:[PEAK],to:[F2]},
  {name:'Big Drop',pts:150,from:[PEAK],to:[F1]},
  {name:'Bounce House',pts:200,from:[PADS],to:[NORTH]},
  {name:'North Express',pts:300,from:[NORTH],to:[F2,F1]},
  {name:'Wall Hop',pts:250,from:[NORTH],to:CTOP},
  {name:'Canyon Climb',pts:300,from:[CANYON],to:CTOP},
  {name:'Canyon Leap',pts:300,from:CTOP,to:[F2,F1]},
  {name:'Swing Set',pts:150,from:SWP,to:[SWBAR]}];
RUNMAPS.push({name:'Jungle Gym',grp:gymW,plats,advCol,spad:{x:0,z:13},key:'orbRunJungle',gaps,
  rollers:[[-4,16],[5,16.5],[-18,3],[17,-8]],spots:[
  {x:-2.5,z:2.5,y:2.4,v:150,any:1},{x:2.5,z:-2.5,y:2.4,v:150,any:1},{x:-6.6,z:3.4,y:2.4,v:100,any:1},{x:8,z:0,y:3.4,v:150,any:1},
  {x:14,z:1,y:3.4,v:200,any:1},{x:14,z:-3.2,y:9,v:450,any:1},{x:-3,z:-14.5,y:5.8,v:300,any:1},{x:3,z:-15.5,y:5.8,v:300,any:1},
  {x:-2.8,z:-9.2,y:4,v:200,air:1,any:1},{x:2.8,z:-9.2,y:4,v:200,air:1,any:1},
  {x:0,z:-1,y:5.4,v:250},{x:-9.75,z:-10,y:8,v:350},{x:-15.25,z:-10,y:8,v:350},{x:-12.5,z:-4,y:8,v:300},{x:-12.5,z:-9,y:4.5,v:250,air:1},
  {x:9.5,z:9.5,y:4.5,v:250},{x:4.6,z:4.6,y:6.8,v:250,air:1},{x:8,z:-1,y:2.2,v:200,air:1,any:1}]});
}
