// Trick Park map 1: Frosty Falls (2.60: Plaza and Frozen Rink combined; Jungle Gym retired). A cliff with a frozen
// waterfall pours down onto a skating rink, ringed by the old Plaza lines. Built to the measured moveset like the
// Christmas Village: running jump 8.5 (apex 1.8), double 2.5, triple 3.85, long jump 10.8 (apex 1.3), long jump +
// dive ~14.3, backflip 4.56, side flip 3.8, ledge grab 1.3-1.95 above your feet. A ledge works when its top is within
// 0.5 of a move's apex; each tier is set so it takes a particular move.
//
//   The Rink (0,-8): skate it. You start just south of it; walk in through the gap in the boards (1.12, hop them).
//     Two ice blocks (1.1) 8 apart: Ice Leap.
//   The Falls (north): the frozen waterfall is a slide. Drop in from the Crown (top 6.0) and butt-slide all the way down
//     onto the rink. The cliff either side climbs in tiers: Lower Ledges 2.2 (hop up from the rink boards),
//     Upper Ledges 5.4 (triple jump / backflip / side flip, or double jump + ledge grab), the Crown 7.4 (a jump).
//     Hop Over the Falls between the Upper Ledges (a 4 gap over the chute); from the Lower Ledges you'd land on it.
//   The Chimney (east): icy wall-jump shaft up to the Sky Deck (8.0). Crown Transfer: long jump between the Crown
//     and the Sky Deck (an 8 gap).
//   The Runway (west): run its length, then long jump + late dive across 14.5 to the Perch, which hops onto the cliff.
//   Treehouse (south-west): climb the big tree, handstand, tree-top flip onto the Crow's Nest (9.5).
//   Frozen Fountain (-7,7), Candy Cane Hop (south, 3.6: triple jump or backflip up), Pillar Run (south-east), the
//   Big Slide (south-east corner), and the giant decorated pine with the star orb.
{const fallsW=new THREE.Group();fallsW.visible=false;scene.add(fallsW);advW=fallsW;plats=[];advCol=[];const G=fallsW;
add(new THREE.CylinderGeometry(30.5,26,3,48),sandM,0,-1.6,0,G);
add(new THREE.CylinderGeometry(28.5,28.5,.2,48),grassM,0,-.1,0,G).castShadow=false;
plats.push({k:'c',x:0,z:0,r:28.5,top:0});
const conc=seas(mat(0xdccdb0),0xdde3e8),pave=seas(mat(0xc9bfa9),0xe4e9ed),tealP=mat(0x2bb3a8),coralP=mat(0xff7a59),sunP=mat(0xffd84a),blueP=mat(0x4f8fe0),plumP=mat(0x9a5fc4),
  rockM=seas(mat(0x857d72,{roughness:.95}),0x6f7c89),rockDk=seas(mat(0x6a635b,{roughness:.95}),0x5a6672),snowTop=seas(mat(0x6fbf4a),0xf6f9fc),
  iceTop=new THREE.MeshStandardMaterial({color:0xd4f0fb,roughness:.06,metalness:.12}),iceSide=mat(0xa9d8ea,{roughness:.3}),
  fallsM=seas(new THREE.MeshStandardMaterial({color:0x5ec8e6,roughness:.12,metalness:.1,transparent:true,opacity:.9}),0xbfe8f7),
  icicleM=new THREE.MeshStandardMaterial({color:0xe6f7ff,roughness:.1,metalness:.1,transparent:true,opacity:.85}),
  boardM=mat(0xf4f6f8,{roughness:.5}),redM=mat(0xd83a2e),navyM=mat(0x2f6fd0),ironM=mat(0x3a3f47,{roughness:.5,metalness:.3}),woodM=mat(0x8a5a35);
const box=(x,z,w,d,top,s,t)=>boxPlat(x,z,w,d,top,s,t);
const icicles=(x0,x1,z,y,n,dir=1)=>{for(let i=0;i<n;i++){const t=(i+.5)/n,h=.35+((i*37)%7)*.08;const c=add(new THREE.ConeGeometry(.09,h,6),icicleM,x0+(x1-x0)*t,y-h/2,z+dir*.03,G);c.rotation.x=PI;c.castShadow=false}};

// ================= The Rink (x -9..9, z -3..-13), surface .12 =================
add(B(18,.24,10),iceSide,0,0,-8,G);add(B(18,.02,10),iceTop,0,.125,-8,G).receiveShadow=true;
plats.push({k:'b',x:0,z:-8,w:18,d:10,top:.12,ice:true});
[[.3,0,redM],[.25,-4.5,navyM],[.25,4.5,navyM]].forEach(([w,x,m])=>add(B(w,.02,10),m,x,.14,-8,G));
{const cc=new THREE.Mesh(new THREE.RingGeometry(1.6,1.8,40),new THREE.MeshBasicMaterial({color:0x2f6fd0}));cc.rotation.x=-PI/2;cc.position.set(0,.142,-8);G.add(cc)}
const board=(x,z,w,d)=>{add(B(w,1,d),boardM,x,.62,z,G);add(B(w+.04,.1,d+.04),navyM,x,1.17,z,G);plats.push({k:'b',x,z,w,d,top:1.12,rail:true})};
board(-6,-3,6,.3);board(6,-3,6,.3);board(-5.5,-13,7,.3);board(5.5,-13,7,.3);[-1,1].forEach(s=>{board(s*9,-5,.3,4);board(s*9,-11,.3,4)});
boxPlat(-4.5,-8,2,2,1.1,mat(0x9fd3e8,{roughness:.2,metalness:.1}),iceTop);boxPlat(4.5,-8,2,2,1.1,mat(0x9fd3e8,{roughness:.2,metalness:.1}),iceTop);
const bulbM=new THREE.MeshStandardMaterial({color:0xffe2a8,emissive:0xffc46b,emissiveIntensity:1.3});
const lamp=(x,z,h=4.2)=>{add(new THREE.CylinderGeometry(.1,.14,h,8),ironM,x,h/2,z,G);add(new THREE.SphereGeometry(.3,12,8),bulbM,x,h+.15,z,G);advCol.push({x,z,r:.32,tree:true,pole:true,y:0,top:h+.5})};
// lamps at the rink's south corners and two by the start (all climbable)
[[-10,-2.3],[10,-2.3]].forEach(([x,z])=>lamp(x,z));[[-6,2.5],[6,2.5]].forEach(([x,z])=>lamp(x,z,4));

// ================= The Falls cliff =================
// Lower Ledges (2.2) either side of the falls, Upper Ledges (5.4), the Crown (7.4) where the falls begin.
const LOW=[[-6,-17],[6,-17]],UP=[[-4.5,-20.5],[4.5,-20.5]];
// the Lower Ledges join under the falls (solid, so nothing gets trapped beneath the chute)
LOW.forEach(([x,z])=>box(x,z,8,6,2.2,rockM,snowTop));box(0,-18,4,8,2.2,rockDk,snowTop);UP.forEach(([x,z])=>box(x,z,5,5,5.4,rockDk,snowTop));box(0,-24,6,4,7.4,rockDk,snowTop);
box(-10.75,-15.5,1.5,2,1.1,rockM,snowTop);box(10.75,-15.5,1.5,2,1.1,rockM,snowTop);   // steps up from the ground at either end
// the cliff behind (backdrop, solid) and boulders at its foot
[[-12,-24.5,6,3,4.2],[12,-23.8,5,3,4.6],[-6.5,-25.6,5,2.4,8.6],[6.5,-25.6,5,2.4,9],[0,-26.6,6,1.6,10]].forEach(([x,z,w,d,t])=>box(x,z,w,d,t,rockDk,snowTop));
[[-10.5,-13.6,.7],[10.6,-13.4,.6]].forEach(([x,z,s])=>rock(x,z,s,G,advCol));
// dress the cliff: boulders bulging out of every face (decor) so the tiers read as rock, not blocks
{const rn=i=>{const v=Math.sin(i*73.1+11.7)*43758.5;return v-Math.floor(v)},faceM=[rockM,rockDk];let n=0;
  const dress=(x0,x1,z,y0,y1,cnt)=>{for(let i=0;i<cnt;i++){const x=x0+(x1-x0)*rn(n),y=y0+(y1-y0)*rn(n+500),s=.45+rn(n+900)*.55;
    const m=add(new THREE.DodecahedronGeometry(s,0),faceM[n%2],x,y,z+(rn(n+300)-.3)*.25,G);m.scale.set(1.3,.9,.55);m.rotation.set(rn(n+1)*3,rn(n+2)*3,rn(n+3)*3);n++}};
  dress(-9.8,-2.6,-14,.3,1.9,9);dress(2.6,9.8,-14,.3,1.9,9);dress(-6.8,-2.6,-18,2.6,5,6);dress(2.6,6.8,-18,2.6,5,6);
  dress(-2.8,-2.2,-22,5.8,7,1);dress(2.2,2.8,-22,5.8,7,1);dress(-14.8,-9.2,-23,.4,3.8,6);dress(9.7,14.3,-22.3,.4,4.2,6);
  dress(-8.8,-4.2,-24.4,5.6,8.2,5);dress(4.2,8.8,-24.4,5.6,8.6,5);dress(11.2,17.2,-17.4,.5,7.5,8)}
// pines along the top of the cliff behind the falls
[[-12,-24.5,4.2,1.1],[-7.5,-25.6,8.6,.9],[-5,-25.8,8.6,.8],[6,-25.6,9,.9],[8.2,-25.4,9,.8],[12.5,-24,4.6,1.1],[14,-24.6,4.6,.9]].forEach(([x,z,y,s],i)=>tree(x,z,s,G,advCol,y,i));
icicles(-10,-2,-14,2.2,14);icicles(2,10,-14,2.2,14);icicles(-7,-2,-18,5.4,9);icicles(2,7,-18,5.4,9);icicles(-3,3,-22,7.4,10);
// the frozen waterfall: a railed ice chute from the Crown down onto the rink. Crouch on it to butt-slide.
slideChute('z',-8.2,-22,0,3,.3,6,fallsM,icicleM,rockDk,G);   // pours out of a lip in the Crown's face at 6.0
// frozen cascade either side of the chute and a lip of ice at the top
for(let i=0;i<14;i++){const t=i/13,z=-22+t*12.5,y=5.8-t*5.3;[-1,1].forEach(s=>{const b=add(new THREE.SphereGeometry(.42+((i*13)%5)*.06,10,8),icicleM,s*(1.75+((i*7)%3)*.08),y,z,G);b.scale.set(.7,1.25,.9);b.castShadow=false})}
add(B(3.4,.4,.8),icicleM,0,6.05,-22.2,G).castShadow=false;for(let i=0;i<5;i++){const c=add(new THREE.ConeGeometry(.5,1.4,7),icicleM,-1.2+i*.6,6.9,-22.15,G);c.scale.z=.4;c.castShadow=false}
for(let k=1;k<12;k++){const t=k/12,z=-22+t*13.8,y=6-t*5.7;const r=add(B(2.9,.06,.14),icicleM,0,y+.04,z,G);r.rotation.x=-Math.atan2(5.7,13.8);r.castShadow=false}
[[-1.9,-8.6,.5],[1.9,-8.4,.45],[-1.2,-7.4,.3],[1.3,-7.3,.32]].forEach(([x,z,s])=>{const m=add(new THREE.SphereGeometry(s,10,8),icicleM,x,.12,z,G);m.scale.set(1.4,.7,1.2);m.castShadow=false});

// ================= The Chimney and the Sky Deck (east) =================
box(12.5,-11,2.5,6,8,mat(0x9fd3e8,{roughness:.2,metalness:.1}),snowTop);box(18,-11,2.5,6,8,mat(0x9fd3e8,{roughness:.2,metalness:.1}),snowTop);   // gap x 13.75..16.75
[-1,1].forEach(s=>{for(let k=0;k<3;k++)add(B(.06,6.5,.18),icicleM,15.25+s*1.47,4.4,-9+k*-1.9,G)});
// Sky Deck x 11..17.5, z -17.5..-22.5: level with the front of the Crown, so a long jump east carries across
box(14.25,-20,6.5,5,8,rockDk,blueP);
add(new THREE.CylinderGeometry(.05,.05,2.4,6),ironM,16.9,9.2,-21.9,G);add(B(1,.6,.04),coralP,16.4,9.95,-21.9,G);

// ================= The Runway and the Perch (west) =================
box(-13,2.5,4,12,2.2,conc,coralP);box(-13,9.25,3,1.5,1.1,conc,coralP);
for(let k=0;k<6;k++)add(B(.5,.03,.9),seas(mat(0xffffff),0xffffff),-13,2.22,7-k*2,G);
box(-13,-20.5,5,5,2.2,rockM,snowTop);                  // Perch x -15.5..-10.5, z -18..-23 (14.5 from the Runway)
tree(-17,-16,1,G,advCol,0,1);                          // a tree to climb up instead

// ================= South: Treehouse, Frozen Fountain, candy canes, pillars, giant pine, Big Slide =================
tree(-15,12,2,G,advCol,0,0);box(-19.5,17,3,3,9.5,woodM,woodM);
for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])add(new THREE.CylinderGeometry(.08,.08,1.1,6),woodM,-19.5+a*1.35,10.05,17+b*1.35,G);
add(B(3.1,.08,.08),woodM,-19.5,10.55,15.6,G);add(B(.08,.08,3.1),woodM,-18.1,10.55,17,G);
{const fx=-7,fz=7;for(let k=0;k<8;k++){const a=k*PI/4;box(fx+Math.cos(a)*2.75,fz+Math.sin(a)*2.75,1.2,1.2,1,conc,tealP)}
  add(new THREE.CylinderGeometry(2.1,2.1,.6,28),fallsM,fx,.3,fz,G);add(new THREE.CylinderGeometry(1.1,1.25,2.6,16),conc,fx,1.3,fz,G);add(new THREE.CylinderGeometry(1.3,1.1,.25,16),tealP,fx,2.58,fz,G);
  plats.push({k:'c',x:fx,z:fz,r:1.15,top:2.6});add(new THREE.ConeGeometry(.35,1.1,10),icicleM,fx,3.2,fz,G);icicles(fx-1.2,fx+1.2,fz+1.32,2.5,7)}
add(new THREE.CylinderGeometry(4.5,4.5,.04,36),pave,0,.02,4.5,G).receiveShadow=true;
const CANES=[[3,13],[7,13],[11,13]];
CANES.forEach(([x,z])=>{add(new THREE.CylinderGeometry(.8,.8,6.6,16),boardM,x,.3,z,G);for(let k=0;k<6;k++){const b=add(new THREE.CylinderGeometry(.82,.82,.22,16),redM,x,.35+k*.6,z,G);b.rotation.z=.25}
  add(new THREE.CylinderGeometry(.84,.84,.1,16),redM,x,3.58,z,G);plats.push({k:'c',x,z,r:.8,top:3.6})});
const PIL=[[13,3,1.8],[15.3,5.3,2.8],[17.6,7.6,3.8],[19.9,9.9,4.8]];PIL.forEach(([x,z,t],i)=>box(x,z,1.8,1.8,t,conc,[tealP,sunP,coralP,plumP][i]));
tree(-9,20.5,2.6,G,advCol,0,0);
const bauble=[0xd83a2e,0xffd84a,0x2f6fd0,0xf4f6f8].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.25,metalness:.4}));
for(let k=0;k<22;k++){const a=k*2.39,h=2+(k%7)*1.05,rr=3.4*(1-(h-1)/9.5);add(new THREE.SphereGeometry(.22,10,8),bauble[k%4],-9+Math.cos(a)*rr,h,20.5+Math.sin(a)*rr,G)}
{const st=add(new THREE.OctahedronGeometry(.6,0),new THREE.MeshStandardMaterial({color:0xffd84a,emissive:0xffb000,emissiveIntensity:1.2}),-9,11.3,20.5,G);st.scale.set(1,1.3,.4)}
[[-11.6,19.1,0xd83a2e],[-6.6,18.9,0x2bb3a8],[-10.2,23.1,0xffd84a],[-7.4,22.9,0x2f6fd0]].forEach(([x,z,c])=>{add(B(1.1,.9,1.1),mat(c),x,.45,z,G);add(B(1.14,.14,.24),mat(0xf4f6f8),x,.92,z,G);advCol.push({x,z,r:.8,top:.9})});
{const tx=17,tz=19,top=6;box(tx,tz,3,3,top,rockDk,coralP);
  [[16.75,4.8],[15.25,3.6],[13.75,2.4],[12.25,1.2]].forEach(([z,t])=>box(tx,z,3,1.5,t,conc,tealP));
  [[tz+1.35,'z'],[tx+1.35,'x']].forEach(([c,ax])=>{add(new THREE.BoxGeometry(ax==='z'?3:.2,.12,ax==='z'?.2:3),sunP,ax==='z'?tx:c,top+.7,ax==='z'?c:tz,G);
    plats.push({k:'b',x:ax==='z'?tx:c,z:ax==='z'?c:tz,w:ax==='z'?3:.3,d:ax==='z'?.3:3,top:top+.75,bot:top+.05})});
  slideChute('x',1,15.5,19,2.4,.3,top,seas(mat(0x37a6e8,{roughness:.35}),0x6fc3f0),sunP,ironM,G)}

// rim trees (where there's room) and a few rocks
for(let a=0;a<PI*2;a+=PI/12){const x=Math.cos(a)*25.8,z=Math.sin(a)*25.8;if(!plats.some(p=>p.top>.5&&p.r!==28.5&&inside(p,x,z,2.6))&&Math.hypot(x+9,z-20.5)>5&&!advCol.some(c=>c.tree&&Math.hypot(c.x-x,c.z-z)<3.5))tree(x,z,.95+((a*7)%.45),G,advCol,0,Math.round(a*3))}
[[22,-3],[-22,-4],[3,24]].forEach(([x,z],i)=>rock(x,z,.6+i*.1,G,advCol));
mergeStatic(G);

// ---- named gaps ----
const R=(x,z,w,d,y)=>({x,z,w,d,y});
const LW=R(-6,-17,8,6,2.2),LE=R(6,-17,8,6,2.2),UW=R(-4.5,-20.5,5,5,5.4),UE=R(4.5,-20.5,5,5,5.4),CROWN=R(0,-24,6,4,7.4),SKY=R(14.25,-20,6.5,5,8),
  RINK=R(0,-8,18,10,.12),BLK=[R(-4.5,-8,2,2,1.1),R(4.5,-8,2,2,1.1)],RUNWAY=R(-13,2.5,4,12,2.2),PERCH=R(-13,-20.5,5,5,2.2),NEST=R(-19.5,17,3,3,9.5),
  TREETOP=R(-15,12,2.4,2.4,8.1),CHIMNEY=R(15.25,-11,3,6,0),WALLS=[R(12.5,-11,2.5,6,8),R(18,-11,2.5,6,8)],GROUND=R(0,0,60,60,0),
  RING=R(-7,7,7,7,1),SPOUT=R(-7,7,2.3,2.3,2.6),P=PIL.map(([x,z,t])=>R(x,z,1.8,1.8,t)),CN=CANES.map(([x,z])=>R(x,z,1.6,1.6,3.6));
const gaps=[
  {name:'Crown Transfer',pts:400,from:[CROWN],to:[SKY]},
  {name:'Return Flight',pts:400,from:[SKY],to:[CROWN]},
  {name:'Over the Falls',pts:200,from:[UW],to:[UE]},
  {name:'Over the Falls',pts:200,from:[UE],to:[UW]},
  {name:'Falls Climb',pts:150,from:[LW,LE],to:[UW,UE]},
  {name:'Crown Hop',pts:100,from:[UW,UE],to:[CROWN]},
  {name:'Sky Step',pts:300,from:[UE],to:[SKY]},
  {name:'Falls Plunge',pts:250,from:[CROWN,UW,UE],to:[RINK]},
  {name:'Runway Leap',pts:450,from:[RUNWAY],to:[PERCH]},
  {name:'Perch Hop',pts:100,from:[PERCH],to:[LW]},
  {name:'Chimney Climb',pts:300,from:[CHIMNEY],to:[SKY,...WALLS]},
  {name:'Chimney Escape',pts:150,from:WALLS,to:[SKY]},
  {name:'Leap of Faith',pts:150,from:[SKY],to:[GROUND]},
  {name:'Ice Leap',pts:150,from:BLK,to:BLK},
  {name:'Pillar Hop',pts:75,from:P.slice(0,3),to:P.slice(1)},
  {name:'Pillar Summit',pts:200,from:[P[2]],to:[P[3]]},
  {name:'Candy Cane Hop',pts:150,from:CN,to:CN},
  {name:"Crow's Nest",pts:450,from:[TREETOP],to:[NEST]},
  {name:'Fountain Hop',pts:75,from:[RING],to:[SPOUT]}];
RUNMAPS.push({name:'Frosty Falls',grp:G,plats,advCol,spad:{x:0,z:5},key:'orbRunFalls',gaps,
  rollers:[[-3,9],[5,9],[-20,-11],[6,-1]],spots:[
  {x:-6,z:-8,y:.12,v:100,any:1},{x:6,z:-11,y:.12,v:100,any:1},{x:0,z:-4,y:.12,v:100,any:1},{x:-4.5,z:-8,y:1.1,v:150,any:1},{x:4.5,z:-8,y:1.1,v:150,any:1},{x:0,z:-8,y:3,v:200,air:1},
  {x:-6,z:-15.5,y:2.2,v:150,any:1},{x:6,z:-15.5,y:2.2,v:150,any:1},{x:-4.5,z:-19.5,y:5.4,v:250},{x:4.5,z:-19.5,y:5.4,v:250},{x:0,z:-24,y:7.4,v:400},{x:0,z:-17,y:5.6,v:300,air:1},
  {x:15.25,z:-11,y:4.5,v:250,air:1},{x:15.25,z:-11,y:7.5,v:300,air:1},{x:13,z:-20,y:8,v:350},{x:16,z:-19,y:8,v:350},{x:7,z:-24,y:9.4,v:400,air:1},
  {x:-13,z:5,y:2.2,v:150,any:1},{x:-13,z:-1,y:2.2,v:150,any:1},{x:-13,z:-9,y:3,v:250,air:1},{x:-13,z:-14.5,y:2.6,v:250,air:1},{x:-13,z:-21,y:2.2,v:200,any:1},
  {x:-19.5,z:17,y:9.5,v:450,any:1},{x:-7,z:7,y:2.6,v:150,any:1},{x:-9,z:20.5,y:10.53,v:400},
  {x:3,z:13,y:3.6,v:200},{x:7,z:13,y:3.6,v:200},{x:11,z:13,y:3.6,v:200},
  {x:13,z:3,y:1.8,v:100,any:1},{x:17.6,z:7.6,y:3.8,v:200},{x:19.9,z:9.9,y:4.8,v:300},
  {x:17,z:19,y:6,v:200,any:1},{x:12,z:19,y:4.62,v:150},{x:6,z:19,y:2.27,v:150}]});
}
