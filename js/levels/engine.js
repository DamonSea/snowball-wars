// Level engine: builders shared by Adventure levels and Trick Park maps (platforms, moving
// platforms, hazards, cores, flags, goal pads), the level/map registries, and the collision
// queries (inside / groundAt / blocked). A level or map file calls these to describe itself.
//
// Adding a Trick Park map: create js/maps/<name>.js and load it after the other maps in index.html.
//   { const g=new THREE.Group(); g.visible=false; scene.add(g); advW=g; plats=[]; advCol=[];
//     plats.push({k:'c',x:0,z:0,r:28.5,top:0});          // the ground
//     boxPlat(x,z,w,d,top,sideMaterial,topMaterial);       // any number of platforms
//     tree(x,z,scale,g,advCol);                            // climbable trees, rocks, decor...
//     RUNMAPS.push({name:'My Map',grp:g,plats,advCol,spad:{x:0,z:5},key:'orbRunBestN',
//       spots:[{x,z,y,v,any,air}, ...]}); }               // orb spots: y = surface height
//   The Trick Park menu lists it automatically; add its best-score key to bestR in state.js.
// Adding an Adventure level: create js/levels/<name>.js that calls beginLevel(), builds with
//   cylPlat/boxPlat/movPlat/patrol/circler/addCore/addFlag/makePad, sets goal={x,z,y,pad,padM,look,on(v),spin(dt)},
//   pushes tutorial zones if wanted, then endLevel({name,key,intro,allMsg,need,winT,winHint}).
const runW=new THREE.Group();scene.add(runW);let advW;
const RUNMAPS=[];let runL;
let plats,advCol,advHz,cores,flags,zones,goal;const levels=[];
function beginLevel(){advW=new THREE.Group();advW.visible=false;scene.add(advW);plats=[];advCol=[];advHz=[];cores=[];flags=[];zones=[];goal=null}
function endLevel(o){advHz.forEach(h=>{const[x,z]=h.f(0);h.g.position.set(x,h.y,z)});levels.push(Object.assign({advW,plats,advCol,advHz,cores,flags,zones,goal},o))}
const cliffM=seas(mat(0xd9b77a),0xc7d1da),stoneM=seas(mat(0xb9ab8c),0xc4cbd0),slabM=seas(mat(0x9a6b3f),0x7a5a40);
function cylPlat(x,z,r,top){const h=top+3;add(new THREE.CylinderGeometry(r+.3,r-1.2,h,40),cliffM,x,top-.3-h/2,z,advW);
  add(new THREE.CylinderGeometry(r,r,.3,40),grassM,x,top-.15,z,advW).castShadow=false;plats.push({k:'c',x,z,r,top})}
function boxPlat(x,z,w,d,top,sm=stoneM,tm=grassM){const h=top+3;add(new THREE.BoxGeometry(w,h,d),sm,x,top-h/2,z,advW);
  if(tm)add(new THREE.BoxGeometry(w+.1,.12,d+.1),tm,x,top-.04,z,advW);plats.push({k:'b',x,z,w,d,top})}
// raised deck / beam / bar with open space below (bot = underside)
function floatPlat(x,z,w,d,top,th=.4,sm=slabM,tm=null){add(new THREE.BoxGeometry(w,th,d),sm,x,top-th/2,z,advW);
  if(tm)add(new THREE.BoxGeometry(w+.06,.1,d+.06),tm,x,top-.03,z,advW);const p={k:'b',x,z,w,d,top,bot:top-th};plats.push(p);return p}
// trampoline: land on it from the air to bounce high (ground pound onto it for a super bounce)
function bouncePad(x,z,r,top,frameM){const legM=mat(0x3a3f47,{roughness:.5,metalness:.3});
  for(let k=0;k<4;k++){const a=k*PI/2+PI/4;add(new THREE.CylinderGeometry(.06,.06,top,6),legM,x+Math.cos(a)*r*.85,top/2,z+Math.sin(a)*r*.85,advW)}
  add(new THREE.TorusGeometry(r,.12,8,28),frameM,x,top,z,advW).rotation.x=PI/2;
  const m=add(new THREE.CylinderGeometry(r-.05,r-.05,.05,28),mat(0x22262b,{roughness:.8}),x,top-.02,z,advW);
  const p={k:'c',x,z,r,top,bounce:true,m};plats.push(p);return p}
function movPlat(x,z,w,d,top,ax,az,amp,sp,ph){const m=add(new THREE.BoxGeometry(w,.5,d),slabM,x,top-.25,z,advW);
  plats.push({k:'b',x,z,w,d,top,m,dx:0,dz:0,mv:{x0:x,z0:z,ax,az,amp,sp,ph}})}
// path enemies: a penguin (patrol) or imp (circler), with the classic spikeball inside for the Enemies toggle
function patrol(ax,az,bx,bz,y,speed){advHz.push({...advFoe('penguin'),y:y+.75,f:t=>{const L=Math.hypot(bx-ax,bz-az),u=.5-.5*Math.cos(t*speed/L*PI);return[ax+(bx-ax)*u,az+(bz-az)*u]}})}
function circler(cx,cz,r,y,sp,ph){advHz.push({...advFoe('imp'),y:y+.75,f:t=>[cx+Math.cos(t*sp+ph)*r,cz+Math.sin(t*sp+ph)*r]})}
const coreGeo=new THREE.OctahedronGeometry(.5,0);
function addCore(x,z,y){const g=new THREE.Group();g.position.set(x,y,z);advW.add(g);
  const m=new THREE.Mesh(coreGeo,new THREE.MeshStandardMaterial({color:0xffcc33,emissive:0xffaa00,emissiveIntensity:1,flatShading:true}));m.castShadow=true;g.add(m);
  const b=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,30,6,1,true),new THREE.MeshBasicMaterial({color:0xffcc33,transparent:true,opacity:.25,depthWrite:false,blending:THREE.AdditiveBlending}));
  b.position.y=15;g.add(b);cores.push({g,m,y,got:false,t:x})}
const flagOff=mat(0x9aa3a8),flagOn=mat(0x5ff3ff,{emissive:0x1b7f8a}),poleM=mat(0x5a5a5a);
function addFlag(x,z,y){const g=new THREE.Group();g.position.set(x,y,z);advW.add(g);
  add(new THREE.CylinderGeometry(.06,.06,2.2,6),poleM,0,1.1,0,g);
  const f=add(new THREE.BoxGeometry(.8,.5,.05),flagOff,.42,1.9,0,g);flags.push({x,y,z,f,on:false})}
function makePad(x,z,y){const padM=new THREE.MeshBasicMaterial({color:0xffcc33,transparent:true,opacity:.35,side:THREE.DoubleSide});
  const pad=new THREE.Mesh(new THREE.RingGeometry(1.1,1.6,32),padM);pad.rotation.x=-PI/2;pad.position.set(x,y+.04,z);advW.add(pad);return{pad,padM}}

function inside(p,x,z,m){return p.k==='c'?Math.hypot(x-p.x,z-p.z)<p.r+m:Math.abs(x-p.x)<p.w/2+m&&Math.abs(z-p.z)<p.d/2+m}
// ramps (slides): p.ramp={ax:'x'|'z',a0,a1,lo,hi,th}. The surface rises from lo at coordinate a0 to hi at a1;
// p.top is the high end (for coarse checks) and th is the slab's thickness, so you can walk under the high part.
function topOf(p,x,z){const r=p.ramp;if(!r)return p.top;const c=r.ax==='x'?x:z,t=Math.max(0,Math.min(1,(c-r.a0)/(r.a1-r.a0)));return r.lo+(r.hi-r.lo)*t}
const botOf=(p,x,z)=>p.ramp?topOf(p,x,z)-p.ramp.th:p.bot;
function rampPlat(ax,a0,a1,c,width,lo,hi,th){const L=Math.abs(a1-a0),mid=(a0+a1)/2,p={k:'b',x:ax==='x'?mid:c,z:ax==='x'?c:mid,w:ax==='x'?L:width,d:ax==='x'?width:L,top:Math.max(lo,hi),ramp:{ax,a0,a1,lo,hi,th}};plats.push(p);return p}
// A playground slide chute along axis ax from coordinate `low` (surface lo) to `high` (surface hi); c is the other
// coordinate. Tilted slab, low side walls with rails (solid, so you stay in), support legs, open underneath.
function slideChute(ax,low,high,c,wid,lo,hi,slideM,railM,legM,grp=advW){
  const L=Math.abs(high-low),mid=(low+high)/2,ang=Math.atan2(hi-lo,L),len=Math.hypot(hi-lo,L),up=Math.sign(high-low)||1;
  const G=(l,h,t)=>ax==='x'?new THREE.BoxGeometry(l,h,t):new THREE.BoxGeometry(t,h,l);
  const put=(m,off,y)=>{m.position.set(ax==='x'?mid:c+off,y,ax==='x'?c+off:mid);if(ax==='x')m.rotation.z=ang*up;else m.rotation.x=-ang*up;return m};
  put(add(G(len,.35,wid),slideM,0,0,0,grp),0,(lo+hi)/2-.175/Math.cos(ang));
  [-1,1].forEach(k=>{const o=k*(wid/2+.09);put(add(G(len,.55,.18),slideM,0,0,0,grp),o,(lo+hi)/2+.08);put(add(G(len,.1,.14),railM,0,0,0,grp),o,(lo+hi)/2+.4);
    rampPlat(ax,low,high,c+o,.3,lo+.6,hi+.6,1.05)});
  for(const f of[.24,.52,.79]){const a=low+(high-low)*f,h=lo+(hi-lo)*f-.3;if(h<.4)continue;
    [-1,1].forEach(k=>{const o=k*(wid/2-.15);add(new THREE.CylinderGeometry(.09,.11,h,8),legM,ax==='x'?a:c+o,h/2,ax==='x'?c+o:a,grp)})}
  return rampPlat(ax,low,high,c,wid,lo,hi,.4)}
// A solid ramp (wedge) from the ground at `low` up to height hi at `high`.
function wedgeRamp(ax,low,high,c,wid,hi,sideM,topM,grp=advW){const L=Math.abs(high-low),mid=(low+high)/2,ang=Math.atan2(hi,L),len=Math.hypot(hi,L),up=Math.sign(high-low)||1;
  const g=ax==='x'?new THREE.BoxGeometry(L,hi,wid):new THREE.BoxGeometry(wid,hi,L),P=g.attributes&&g.attributes.position;
  if(P){for(let i=0;i<P.count;i++){const a=ax==='x'?P.getX(i):P.getZ(i);if(P.getY(i)>0&&Math.sign(a)===-up)P.setY(i,-hi/2+.01)}P.needsUpdate=true;g.computeVertexNormals()}
  add(g,sideM,ax==='x'?mid:c,hi/2,ax==='x'?c:mid,grp);
  const t=add(ax==='x'?new THREE.BoxGeometry(len,.08,wid+.04):new THREE.BoxGeometry(wid+.04,.08,len),topM,ax==='x'?mid:c,hi/2,ax==='x'?c:mid,grp);
  if(ax==='x')t.rotation.z=ang*up;else t.rotation.x=-ang*up;
  return rampPlat(ax,low,high,c,wid,0,hi,hi+3)}
function groundAt(x,z,y){let h=-Infinity,on=null;for(const p of plats){const t=topOf(p,x,z);if(t<=y+T.stepUp&&t>h&&inside(p,x,z,T.footMargin)){h=t;on=p}}return{h,on}}
// a platform with a bottom (bot) only blocks you where your body overlaps it, so you can walk under decks and bars
// how deep a point sits inside a solid's wall buffer (bigger = deeper; <= 0 = clear of it)
function wallDepth(p,x,z){const M=T.wallMargin;return p.k==='c'?p.r+M-Math.hypot(x-p.x,z-p.z):Math.min(p.w/2+M-Math.abs(x-p.x),p.d/2+M-Math.abs(z-p.z))}
const blocksAt=(p,x,z,y)=>{if(!inside(p,x,z,T.wallMargin))return false;const t=topOf(p,x,z),b=botOf(p,x,z);return t>y+T.stepUp&&(b===undefined||y+T.bodyH>b)};
// a move is refused only if it goes deeper into a wall's buffer: if you ever end up inside one (a fall past a ledge,
// a knockback, a moving platform), you can always walk back out instead of freezing in place
const blockedMove=(ox,oz,nx,nz,y)=>plats.some(p=>blocksAt(p,nx,nz,y)&&(!blocksAt(p,ox,oz,y)||wallDepth(p,nx,nz)>wallDepth(p,ox,oz)+1e-6));
const blocked=(x,z,y)=>plats.some(p=>{if(!inside(p,x,z,T.wallMargin))return false;const t=topOf(p,x,z),b=botOf(p,x,z);return t>y+T.stepUp&&(b===undefined||y+T.bodyH>b)});

// Merge every static mesh under `root` that shares a material into one mesh: far fewer draw calls for maps full of
// small decorations. Collision lives in plats/advCol, not in meshes, so this is safe for map scenery. Season-only,
// textured and non-shadow-casting meshes are left alone.
function mergeStatic(root){if(typeof root.updateMatrixWorld!=='function'||!THREE.BufferGeometry.prototype.applyMatrix4)return;
  root.updateMatrixWorld(true);const byMat=new Map();
  root.traverse(o=>{if(!o.isMesh||!o.castShadow||winterOnly.includes(o)||Array.isArray(o.material)||o.material.map)return;if(!byMat.has(o.material))byMat.set(o.material,[]);byMat.get(o.material).push(o)});
  for(const[m,list]of byMat){if(list.length<2)continue;let n=0;
    const gs=list.map(o=>{const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(o.matrixWorld);n+=g.attributes.position.count;return g});
    const pos=new Float32Array(n*3),nor=new Float32Array(n*3);let k=0;
    for(const g of gs){pos.set(g.attributes.position.array,k*3);if(g.attributes.normal)nor.set(g.attributes.normal.array,k*3);k+=g.attributes.position.count;g.dispose()}
    const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(pos,3));bg.setAttribute('normal',new THREE.BufferAttribute(nor,3));
    const me=new THREE.Mesh(bg,m);me.castShadow=me.receiveShadow=true;root.add(me);
    list.forEach(o=>{o.parent.remove(o);o.geometry.dispose()})}}
