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
//   Then add the map to parkMenu() in state.js and its best-score key to bestR in state.js.
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
function groundAt(x,z,y){let h=-Infinity,on=null;for(const p of plats)if(p.top<=y+T.stepUp&&p.top>h&&inside(p,x,z,T.footMargin)){h=p.top;on=p}return{h,on}}
const blocked=(x,z,y)=>plats.some(p=>p.top>y+T.stepUp&&inside(p,x,z,T.wallMargin));
