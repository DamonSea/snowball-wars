// Trick Park map 3: Woodsy Cabin (replaced Rooftops in 2.59). An old log cabin in a clearing, a campfire with log
// benches, tents, a treehouse, a hunter's lookout and a frozen pond, all ringed by thick pine forest. Distances are
// built to the moveset: running jump 8.5 (apex 1.8), double 2.5, triple 3.85, long jump 10.8, ledge grab 1.3-1.95.
//
//   Campfire (0,-4): you start just south of it. Log benches at .55; hop the fire (its stones are .5).
//   Log Cabin (0,-15): walls to the eaves at 3.0, pitched roof to a ridge at 5.0 (run it, or butt-slide down).
//     Woodpile (1.3) -> porch roof (2.6) -> roof eave. Stone chimney on the east end, top 6.6: hop up from the ridge.
//   Treehouse (-15,-13): climb the rope ladder (a pole, 5.3) or the trunk, platform 5.2. Treehouse Leap: running jump
//     east onto the cabin roof.
//   Lookout (16,-2): stump stairs from the fire (.7, 1.3, 2.0, 2.8), then a double jump to the deck at 4.8.
//   Tents: canvas slopes up to a ridge at 2.3, and they're bouncy. Frozen pond (12,-15) to skate on, a canoe, an
//   outhouse, a fallen log to balance along, and climbable pines all round the edge.
{const woodW=new THREE.Group();woodW.visible=false;scene.add(woodW);advW=woodW;plats=[];advCol=[];const G=woodW;
const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),Cy=(a,b,h,n=10)=>new THREE.CylinderGeometry(a,b,h,n);
add(new THREE.CylinderGeometry(30.5,26,3,48),seas(mat(0x6b5a44),0xc4ccd3),0,-1.6,0,G);
add(new THREE.CylinderGeometry(28.5,28.5,.2,48),seas(mat(0x557a3c,{roughness:.95}),0xeef3f7),0,-.1,0,G).castShadow=false;
plats.push({k:'c',x:0,z:0,r:28.5,top:0});
const logM=mat(0x6e4a2e,{roughness:.9}),logDk=mat(0x553821,{roughness:.9}),endM=mat(0xd9b27a,{roughness:.8}),bark=mat(0x5b3a24,{roughness:.95}),
  roofM=seas(mat(0x3f5a3a,{roughness:.8}),0x5d6b5a),stoneM2=mat(0x8d8a84,{roughness:.95}),stoneDk2=mat(0x6e6b66,{roughness:.95}),snowW=mat(0xffffff,{roughness:.9}),
  dirt=seas(mat(0x7a5f43,{roughness:1}),0xdcd6cf),glowWin=new THREE.MeshStandardMaterial({color:0xffd98a,emissive:0xffa94d,emissiveIntensity:1.1}),
  rope=mat(0xc8a46a,{roughness:.9}),iron=mat(0x2e3238,{roughness:.5,metalness:.4}),leafDk=mat(0x24553a,{roughness:.85});
const snowCap=m=>{winterOnly.push(m);return m};
// a log lying along x or z (decor), with pale cut ends
const log=(x,y,z,len,r,alongX,m=logM)=>{const c=add(Cy(r,r,len,10),m,x,y,z,G);if(alongX)c.rotation.z=PI/2;else c.rotation.x=PI/2;
  [-1,1].forEach(s=>{const e=add(Cy(r*.92,r*.92,.02,10),endM,alongX?x+s*len/2:x,y,alongX?z:z+s*len/2,G);if(alongX)e.rotation.z=PI/2;else e.rotation.x=PI/2});return c};

// ================= Dirt paths: spawn -> campfire -> porch, and out to the tents and the lookout =================
[[0,-1.5,2.2],[0,-8,1.6],[-6,-2,1.4],[7,-1.5,1.3],[0,3,1.8],[3.5,2,1.4]].forEach(([x,z,r])=>{const d=add(Cy(r,r,.03,20),dirt,x,.02,z,G);d.receiveShadow=true;d.castShadow=false});

// ================= Log Cabin =================
{const cx=0,cz=-15,w=9,d=6,E=3,R=5,half=d/2,h=R-E,ov=.5,len=Math.hypot(half+ov,h*(half+ov)/half),ang=Math.atan2(h,half);
  boxPlat(cx,cz,w,d,E,logDk,null);
  // stacked logs on all four walls, crossing at the corners
  for(let k=0;k<6;k++){const y=.25+k*.5;log(cx,y,cz+half+.05,w+.7,.26,true);log(cx,y,cz-half-.05,w+.7,.26,true);
    log(cx-w/2-.05,y+.25,cz,d+.7,.26,false);log(cx+w/2+.05,y+.25,cz,d+.7,.26,false)}
  [-1,1].forEach(s=>{const m=add(B(w+1.1,.24,len),roofM,cx,E+h/2-h*ov/half/2+.1,cz+s*(half+ov)/2,G);m.rotation.x=s*ang;
    const c=snowCap(add(B(w+1.15,.12,len*.98),snowW,cx,m.position.y+.17/Math.cos(ang),m.position.z,G));c.rotation.x=s*ang;
    rampPlat('z',cz+s*half,cz,cx,w,E,R,h+.4)});
  const tri=new THREE.Shape();tri.moveTo(-half,0);tri.lineTo(half,0);tri.lineTo(0,h);tri.lineTo(-half,0);
  const gab=new THREE.Mesh(new THREE.ExtrudeGeometry(tri,{depth:w-.02,bevelEnabled:false}),logM);gab.rotation.y=PI/2;gab.position.set(cx-w/2+.01,E,cz);gab.castShadow=gab.receiveShadow=true;G.add(gab);
  add(B(w+1.2,.16,.16),logDk,cx,R+.12,cz,G);
  // front: door, two glowing windows with shutters, a lantern by the door
  const fz=cz+half+.32;add(B(1.2,2,.1),bark,cx,1,fz,G);add(new THREE.SphereGeometry(.06,8,6),iron,cx+.42,1,fz+.07,G);
  [-1,1].forEach(s=>{add(B(1.1,.9,.08),glowWin,cx+s*2.8,1.55,fz,G);add(B(1.2,.08,.1),logDk,cx+s*2.8,1.04,fz+.03,G);add(B(.08,.9,.1),logDk,cx+s*2.8,1.55,fz+.04,G);
    [-1,1].forEach(t=>add(B(.4,1,.06),roofM,cx+s*2.8+t*.8,1.55,fz+.02,G))});
  add(B(.9,.7,.08),glowWin,cx-w/2-.33,1.6,cz,G).rotation.y=PI/2;add(B(.7,.6,.08),glowWin,cx-w/2-.04,E+.75,cz,G).rotation.y=PI/2;
  // porch: a deck and a flat porch roof on four posts (the first step up to the roof)
  floatPlat(cx,cz+half+1.1,w,2.2,.45,.45,logM,null);for(let i=0;i<9;i++)add(B(.02,.01,2.2),logDk,cx-w/2+.5+i,.455,cz+half+1.1,G);
  floatPlat(cx,cz+half+1.2,w+.4,2.4,2.6,.18,roofM,null);snowCap(add(B(w+.45,.08,2.42),snowW,cx,2.64,cz+half+1.2,G));
  [-1,1].forEach(s=>{const px=cx+s*(w/2-.1),pz=cz+half+2.2;add(Cy(.12,.12,2.2,8),logM,px,1.5,pz,G);advCol.push({x:px,z:pz,r:.2,top:2.6})});
  const lan=new THREE.MeshStandardMaterial({color:0xffcf7a,emissive:0xffa040,emissiveIntensity:1.6});add(B(.22,.3,.22),iron,cx-1,1.9,fz+.2,G);add(B(.16,.22,.16),lan,cx-1,1.9,fz+.2,G);
  // stone chimney on the east end (top 6.6)
  boxPlat(cx+w/2+.85,cz,1.4,1.6,6.6,stoneM2,stoneDk2);for(let k=0;k<9;k++)add(B(1.46,.06,1.66),stoneDk2,cx+w/2+.85,.4+k*.7,cz,G);
  // woodpile against the porch corner (1.3): split logs stacked end-out
  boxPlat(cx+w/2+2.7,cz+half+1.2,2.4,1.4,1.3,logDk,logM);
  for(let r=0;r<3;r++)for(let i=0;i<5;i++){const e=add(Cy(.2,.2,.04,8),endM,cx+w/2+1.7+i*.5+(r%2)*.25,.22+r*.4,cz+half+1.92,G);e.rotation.x=PI/2}
  // the axe in the chopping block
  add(Cy(.4,.45,.6,12),logM,cx+w/2+2.6,.3,cz+half+3.1,G);advCol.push({x:cx+w/2+2.6,z:cz+half+3.1,r:.5,top:.6});
  {const a=new THREE.Group();a.position.set(cx+w/2+2.6,.6,cz+half+3.1);a.rotation.set(.2,.6,-.5);G.add(a);add(Cy(.035,.035,.8,6),logDk,0,.38,0,a);add(B(.04,.2,.28),iron,0,.7,.08,a)}}

// ================= Campfire =================
const FIRE={x:0,z:-4};
for(let i=0;i<10;i++){const a=i/10*PI*2,s=add(new THREE.DodecahedronGeometry(.24,0),i%2?stoneM2:stoneDk2,FIRE.x+Math.cos(a)*.85,.14,FIRE.z+Math.sin(a)*.85,G);s.scale.set(1,.7,1);s.rotation.y=a}
advCol.push({x:FIRE.x,z:FIRE.z,r:1.05,top:.5});
add(Cy(.85,.85,.04,20),mat(0x2a2522,{roughness:1}),FIRE.x,.03,FIRE.z,G).castShadow=false;
[0,1,2].forEach(i=>{const l=log(FIRE.x,.2,FIRE.z,1.3,.1,true,bark);l.rotation.y=i*PI/3;l.rotation.z=PI/2-.25});
const flameMs=[0xff5a1a,0xff9a2a,0xffe066].map(c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.92,depthWrite:false,blending:THREE.AdditiveBlending}));
const flames=[[0,0,.5,1.6,0],[.16,.1,.36,1.2,1],[-.18,-.06,.36,1.15,1],[.03,-.14,.26,.95,2],[-.06,.15,.24,.8,2]].map(([x,z,r,h,c],i)=>{
  const f=new THREE.Mesh(new THREE.ConeGeometry(r,h,8),flameMs[c]);f.position.set(FIRE.x+x,.25+h/2,FIRE.z+z);f.castShadow=false;f._h=h;f._ph=i*1.7;G.add(f);return f});
const fireLight=new THREE.PointLight(0xff8a3a,1.4,16,1.6);fireLight.position.set(FIRE.x,1.4,FIRE.z);G.add(fireLight);
// embers drift up out of the fire (a small fixed pool)
const emberM=new THREE.MeshBasicMaterial({color:0xffb040,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
const embers=Array.from({length:14},(_,i)=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.035,5,4),emberM);e.castShadow=false;e._t=i/14*2;G.add(e);return e});
// log benches round the fire (.55)
[[-3.1,-4.4,false],[3.1,-4.4,false],[0,-7.2,true]].forEach(([x,z,ax])=>{log(x,.32,z,2.6,.32,ax);plats.push({k:'b',x,z,w:ax?2.6:.64,d:ax?.64:2.6,top:.6})});
// marshmallow sticks
[[-1.6,-3.2,.9],[1.7,-3.4,-.9]].forEach(([x,z,r])=>{const g=new THREE.Group();g.position.set(x,.5,z);g.rotation.set(0,r,.9*Math.sign(r));G.add(g);add(Cy(.015,.015,1.4,5),logM,0,.6,0,g);add(Cy(.06,.06,.12,8),snowW,0,1.3,0,g)});

// ================= Tents (bouncy canvas slopes, ridge 2.3) =================
const tent=(x,z,col,rot)=>{const w=3.2,d=3.4,Rr=2.3,half=w/2,ang=Math.atan2(Rr,half),len=Math.hypot(half,Rr)+.15,cm=mat(col,{roughness:.8}),
    g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot?PI/2:0;G.add(g);
  [-1,1].forEach(s=>{const p=add(B(len,.08,d),cm,s*half/2,Rr/2,0,g);p.rotation.z=-s*ang;
    const c=snowCap(add(B(len*.38,.05,d*.96),snowW,s*half*.2,Rr*.8+.06,0,g));c.rotation.z=-s*ang});
  const tri=new THREE.Shape();tri.moveTo(-half,0);tri.lineTo(half,0);tri.lineTo(0,Rr);tri.lineTo(-half,0);
  [-1,1].forEach(s=>{const f=new THREE.Mesh(new THREE.ShapeGeometry(tri),s>0?mat(0x2a2522):cm);f.position.z=s*d/2;f.material.side=THREE.DoubleSide;f.castShadow=true;g.add(f)});
  add(Cy(.03,.03,Rr+.3,5),logDk,0,(Rr+.3)/2,d/2+.05,g);add(Cy(.03,.03,Rr+.3,5),logDk,0,(Rr+.3)/2,-d/2-.05,g);
  const ax=rot?'z':'x',c0=rot?z:x,cc=rot?x:z;[-1,1].forEach(s=>{const p=rampPlat(ax,c0+s*half,c0,cc,d,0,Rr,Rr+.2);p.bounce=true;p.bvy=T.bounce.awning})};
tent(-10,-2,0xe0702a,false);tent(-12.5,5,0x3f8a4a,true);tent(10,5,0x2f6fd0,false);

// ================= Treehouse (-15,-13) =================
{const x=-15,z=-13,top=5.2;add(Cy(.75,1.05,8.5,12),bark,x,4.25,z,G);advCol.push({x,z,r:1.05,tree:true,y:0,top:top-.1});
  [[2.6,3,8.6],[2.1,2.6,10.3],[1.4,2.2,11.8]].forEach(([r,h,y])=>add(new THREE.ConeGeometry(r,h,9),leafDk,x,y,z,G));snowCap(add(new THREE.ConeGeometry(.8,.8,9),snowW,x,12.6,z,G));
  floatPlat(x,z,4.2,4.2,top,.35,logM,null);for(let i=0;i<7;i++)add(B(.02,.01,4.2),logDk,x-2.1+.3+i*.6,top+.005,z,G);
  // railings on the back and sides (decor), little roof high above
  [[0,-2,4.2,true],[-2,0,4.2,false],[2,-1,2.2,false]].forEach(([dx,dz,L,ax])=>{add(B(ax?L:.08,.08,ax?.08:L),logM,x+dx,top+.8,z+dz,G);
    for(let i=0;i<=4;i++){const t=-L/2+i*L/4;add(Cy(.04,.04,.8,5),logM,ax?x+dx+t:x+dx,top+.4,ax?z+dz:z+dz+t,G)}});
  // rope ladder down the front: a climbable pole
  const lz=z+2.25;[-.25,.25].forEach(o=>add(Cy(.025,.025,top+.2,5),rope,x+o,(top+.2)/2,lz,G));for(let y=.4;y<top;y+=.4)add(B(.56,.05,.06),logM,x,y,lz,G);
  advCol.push({x,z:lz,r:.3,tree:true,pole:true,y:0,top:top+.15})}

// ================= Lookout tower (16,-2) and the stump stairs up to it =================
{const x=16,z=-2,top=4.8;[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{add(Cy(.1,.12,top,6),logM,x+a*1.25,top/2,z+b*1.25,G);advCol.push({x:x+a*1.25,z:z+b*1.25,r:.18,top})});
  floatPlat(x,z,2.8,2.8,top,.25,logM,null);
  [[0,-1.35,true],[-1.35,0,false],[1.35,0,false]].forEach(([dx,dz,ax])=>add(B(ax?2.8:.08,.7,ax?.08:2.8),logDk,x+dx,top+.35,z+dz,G));
  const r=add(new THREE.ConeGeometry(2.3,1.2,4),roofM,x,top+2.5,z,G);r.rotation.y=PI/4;snowCap(add(new THREE.ConeGeometry(1.8,.7,4),snowW,x,top+2.85,z,G)).rotation.y=PI/4;
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>add(Cy(.05,.05,1.9,5),logM,x+a*1.3,top+.95,z+b*1.3,G));
  advCol.push({x:x-1.5,z:z+1.5,r:.3,tree:true,pole:true,y:0,top:top+.1});add(Cy(.05,.05,top+.1,6),rope,x-1.5,(top+.1)/2,z+1.5,G)}
[[6.5,-1.3,.7,.6],[8.8,-1,1.3,.55],[11,-.4,2,.55],[13.2,-1,2.8,.55]].forEach(([x,z,t,r])=>{add(Cy(r,r*1.1,t,12),bark,x,t/2,z,G);add(Cy(r*.92,r*.92,.03,12),endM,x,t+.01,z,G);plats.push({k:'c',x,z,r,top:t})});

// ================= Frozen pond (12,-15), the canoe, the outhouse, a fallen log =================
add(Cy(4.4,4.4,.12,32),new THREE.MeshStandardMaterial({color:0xbfe8f7,roughness:.08,metalness:.15}),12,.06,-15,G).receiveShadow=true;
plats.push({k:'c',x:12,z:-15,r:4.2,top:.12,ice:true});
for(let i=0;i<16;i++){const a=i/16*PI*2,s=add(new THREE.DodecahedronGeometry(.35,0),stoneM2,12+Math.cos(a)*4.6,.12,-15+Math.sin(a)*4.6,G);s.scale.set(1,.5,1)}
{const c=new THREE.Group();c.position.set(17.8,0,-19.5);c.rotation.y=.7;G.add(c);const cm=mat(0xb8452e,{roughness:.6});
  const hull=add(new THREE.SphereGeometry(1,16,8,0,PI*2,PI/2,PI/2),cm,0,.45,0,c);hull.scale.set(.55,.45,2.2);add(B(.9,.06,.25),logM,0,.42,.4,c);add(B(.9,.06,.25),logM,0,.42,-.6,c);
  const pd=add(B(.08,.04,1.8),logM,.55,.5,0,c);pd.rotation.x=.2;plats.push({k:'b',x:17.8,z:-19.5,w:2.2,d:2.2,top:.45})}
{const x=20,z=9;boxPlat(x,z,1.8,1.8,2.6,mat(0x7a5232,{roughness:.9}),roofM);const dz=z+.92;add(B(1,1.9,.06),mat(0x5b3a24),x,.95,dz,G);
  const cv=document.createElement('canvas');cv.width=cv.height=64;const q=cv.getContext('2d');q.fillStyle='#5b3a24';q.fillRect(0,0,64,64);q.fillStyle='#ffd98a';q.beginPath();q.arc(32,30,18,0,PI*2);q.fill();q.fillStyle='#5b3a24';q.beginPath();q.arc(40,24,16,0,PI*2);q.fill();
  add(new THREE.PlaneGeometry(.35,.35),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)}),x,1.6,dz+.04,G).castShadow=false;snowCap(add(B(1.9,.1,1.9),snowW,x,2.65,z,G))}
log(-7,.5,12,7.5,.5,true);plats.push({k:'b',x:-7,z:12,w:7.5,d:.6,top:1.0});for(let i=0;i<4;i++)add(new THREE.SphereGeometry(.18,6,5),leafDk,-10+i*2,.95,12.1+(i%2?.25:-.25),G);

// lantern posts along the path (climbable)
const lampM=new THREE.MeshStandardMaterial({color:0xffcf7a,emissive:0xffa040,emissiveIntensity:1.5});
[[-2.4,1.5],[2.4,1.5],[-2.2,-9.2],[2.2,-9.2]].forEach(([x,z])=>{add(Cy(.08,.1,3,6),logDk,x,1.5,z,G);add(B(.3,.36,.3),iron,x,3.15,z,G);add(B(.22,.26,.22),lampM,x,3.15,z,G);advCol.push({x,z,r:.25,tree:true,pole:true,y:0,top:3.35})});

// ================= The forest: climbable pines filling the edge, and taller ones outside it =================
{const rn=i=>{const v=Math.sin(i*91.7+13.3)*43758.5;return v-Math.floor(v)};
  const keep=[[0,-15,7],[-15,-13,4],[16,-2,3.5],[12,-15,5.5],[17.8,-19.5,2],[20,9,2.2],[-10,-2,2.6],[-12.5,5,2.6],[10,5,2.6],[0,-4,4],[-7,12,4.4],[0,0,3],[5.5,2,2.5]];
  const free=(x,z,r)=>keep.every(([a,b,c])=>Math.hypot(x-a,z-b)>c+r);let n=0;
  for(let i=0;i<70;i++){const a=i/70*PI*2+rn(i)*.08,rr=21+rn(i+200)*6.5,x=Math.cos(a)*rr,z=Math.sin(a)*rr,s=1.15+rn(i+400)*.75;if(!free(x,z,1.3*s))continue;tree(x,z,s,G,advCol,0,n++)}
  [[-6,6,1.3],[7.5,10,1.2],[-18,-4,1.4],[19,-9,1.3],[-3,17,1.25],[14,15,1.4],[-17,12,1.3],[5,-22,1.5],[-8,-21,1.4],[-21,-11,1.2]].forEach(([x,z,s])=>{if(free(x,z,1.3*s))tree(x,z,s,G,advCol,0,n++)});
  for(let i=0;i<46;i++){const a=i/46*PI*2+rn(i+700)*.1,rr=29.4+rn(i+800)*1.4,s=2+rn(i+900)*.9;tree(Math.cos(a)*rr,Math.sin(a)*rr,s,G,[],-.1,i)}}
// a few rocks and mossy stumps between the trees
[[-4,9,.8],[8,-8,.6],[-19,0,1],[22,-2,.9],[-9,17,.7],[3,20,.8]].forEach(([x,z,s])=>rock(x,z,s,G,advCol));

mergeStatic(G);

// ---- per frame: fire flicker, embers, chimney smoke ----
const smokeM=new THREE.MeshBasicMaterial({color:0xd9dde2,transparent:true,opacity:.5,depthWrite:false});
const smoke=Array.from({length:8},(_,i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),smokeM.clone());m.castShadow=false;m._t=i/8*4;G.add(m);return m});
const tick=dt=>{const t=tAll;
  flames.forEach(f=>{const k=1+Math.sin(t*13+f._ph)*.12+Math.sin(t*7.3+f._ph*2)*.08;f.scale.set(1+Math.sin(t*9+f._ph)*.06,k,1+Math.cos(t*8+f._ph)*.06)});
  fireLight.intensity=1.25+Math.sin(t*11)*.15+Math.sin(t*23)*.08;
  embers.forEach((e,i)=>{e._t=(e._t+dt)%2;const q=e._t/2;e.position.set(FIRE.x+Math.sin(i*2.1+q*4)*.35*q,.6+q*3.2,FIRE.z+Math.cos(i*1.7+q*3)*.35*q);e.scale.setScalar(1-q*.7)});
  smoke.forEach(m=>{m._t=(m._t+dt)%4;const q=m._t/4;m.position.set(5.35+q*1.4,6.8+q*3.5,-15+Math.sin(q*6)*.3);m.scale.setScalar(.6+q*2.2);m.material.opacity=.45*(1-q)})};

// ---- named gaps ----
const R_=(x,z,w,d,y)=>({x,z,w,d,y});
const TREEH=R_(-15,-13,4.2,4.2,5.2),ROOF={...R_(0,-15,9,7,3),y1:5},CHIM=R_(5.35,-15,1.4,1.6,6.6),PORCH=R_(0,-10.8,9.4,2.4,2.6),PILE=R_(7.2,-10.8,2.4,1.4,1.3),
  LOOK=R_(16,-2,2.8,2.8,4.8),STUMP=R_(13.2,-1,1.1,1.1,2.8),GROUND=R_(0,0,60,60,0),POND=R_(12,-15,8,8,.12),
  TENTS=[{...R_(-10,-2,3.2,3.4,0),y1:2.3},{...R_(-12.5,5,3.4,3.2,0),y1:2.3},{...R_(10,5,3.2,3.4,0),y1:2.3}];
const gaps=[
  {name:'Treehouse Leap',pts:400,from:[TREEH],to:[ROOF]},
  {name:'Chimney Sweep',pts:200,from:[ROOF],to:[CHIM]},
  {name:'Porch Climb',pts:100,from:[PORCH],to:[ROOF]},
  {name:'Woodpile Hop',pts:75,from:[PILE],to:[PORCH]},
  {name:'Lookout Climb',pts:200,from:[STUMP],to:[LOOK]},
  {name:'Lookout Dive',pts:200,from:[LOOK],to:[GROUND,POND]},
  {name:'Chimney Drop',pts:250,from:[CHIM],to:[POND]},
  {name:'Tent Hop',pts:100,from:TENTS,to:TENTS}];
RUNMAPS.push({name:'Woodsy Cabin',grp:G,plats,advCol,spad:{x:5.5,z:2},key:'orbRunWoods',gaps,tick,
  rollers:[[-5,4],[6,8],[-14,-6],[8,-20]],spots:[
  {x:-3.1,z:-4.4,y:.6,v:100,any:1},{x:3.1,z:-4.4,y:.6,v:100,any:1},{x:0,z:-4,y:1.6,v:150,air:1,any:1},
  {x:7.2,z:-10.8,y:1.3,v:150,any:1},{x:-3,z:-10.8,y:2.6,v:150,any:1},{x:3,z:-10.8,y:2.6,v:150,any:1},
  {x:-2.5,z:-15,y:5,v:250},{x:2.5,z:-15,y:5,v:250},{x:5.35,z:-15,y:6.6,v:350},{x:5.35,z:-15,y:8.2,v:450,air:1},
  {x:-15,z:-13,y:5.2,v:300},{x:-10,z:-14,y:6.5,v:400,air:1},
  {x:8.8,z:-1,y:1.3,v:100,any:1},{x:13.2,z:-1,y:2.8,v:150,any:1},{x:16,z:-2,y:4.8,v:300},
  {x:-10,z:-2,y:2.3,v:150,any:1},{x:-12.5,z:5,y:2.3,v:150,any:1},{x:10,z:5,y:2.3,v:150,any:1},{x:10,z:5,y:6,v:300,air:1},
  {x:12,z:-15,y:.12,v:100,any:1},{x:14,z:-13,y:.12,v:100,any:1},{x:-7,z:12,y:1,v:150,any:1},{x:20,z:9,y:2.6,v:200},
  {x:-5,z:3,y:0,v:100,any:1},{x:4,z:8,y:0,v:100,any:1}]});
}
