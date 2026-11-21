// Core: DOM helper, renderer, scene, camera, lights, material helpers, season registry,
// shared scenery builders (trees, rocks, flowers). Loaded first; everything else builds on these.
const $=id=>document.getElementById(id);
const PI=Math.PI,ARENA=27,V=(x,y,z)=>new THREE.Vector3(x,y,z);
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};

// ---------- renderer / scene ----------
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
$('stage').appendChild(renderer.domElement);
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x123f57);scene.fog=new THREE.Fog(0x123f57,30,75);
const cam=new THREE.PerspectiveCamera(55,1,.1,200);
// GPU memory: anything removed for good is freed with freeTree(). KEEP protects resources that are shared or permanent:
// everything that exists at startup (snapshotted in main.js) plus shared pieces like the particle geometry.
const KEEP=new Set();const keep=(...a)=>{a.forEach(x=>x&&KEEP.add(x));return a[0]};
function freeTree(o){if(!o)return;if(o.parent)o.parent.remove(o);if(!o.traverse)return;
  o.traverse(m=>{const g=m.geometry;if(g&&!KEEP.has(g)&&g.dispose)g.dispose();
    for(const x of Array.isArray(m.material)?m.material:m.material?[m.material]:[]){if(KEEP.has(x)||!x.dispose)continue;if(x.map&&!KEEP.has(x.map)&&x.map.dispose)x.map.dispose();x.dispose()}})}
function keepScene(){scene.traverse(m=>{if(m.geometry)KEEP.add(m.geometry);for(const x of Array.isArray(m.material)?m.material:m.material?[m.material]:[]){KEEP.add(x);if(x.map)KEEP.add(x.map)}})}
const resize=()=>{renderer.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.fov=cam.aspect<.8?70:55;cam.updateProjectionMatrix()};
addEventListener('resize',resize);resize();
const hemi=new THREE.HemisphereLight(0xcfeeff,0x2d3a22,.75);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffdcb0,1.05);
sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-34,right:34,top:34,bottom:-34,near:1,far:90});
scene.add(sun,sun.target);

const mat=(c,o={})=>new THREE.MeshStandardMaterial({color:c,flatShading:true,roughness:.85,...o});
// ---------- seasons: Winter (default) and Summer. seas() registers a material's winter colour ----------
let WIN=true,SNOW=true;try{const v=localStorage.getItem('orbRunSeason');if(v)WIN=v==='winter';const v2=localStorage.getItem('orbRunSnow');if(v2)SNOW=v2==='1'}catch(e){}
const SEAS=[],winterOnly=[],summerOnly=[];let puffCol=0xffffff;
const seas=(m,w)=>{SEAS.push({m,s:m.color.getHex(),w});return m};
const snowM=mat(0xf6f9fc,{roughness:.95});
const add=(geo,m,x=0,y=0,z=0,parent=scene)=>{const me=new THREE.Mesh(geo,m);me.position.set(x,y,z);me.castShadow=me.receiveShadow=true;parent.add(me);return me};

const water=new THREE.Mesh(new THREE.PlaneGeometry(500,500),seas(mat(0x2a85a8,{roughness:.3,metalness:.1}),0x5f93ae));
water.rotation.x=-PI/2;water.position.y=-.8;scene.add(water);

const trunkM=seas(mat(0x8a5a35),0x5a3d2a),leafM=[seas(mat(0x2f8f4e),0x1f4f3e),seas(mat(0x3fa65a),0x2a5e48),seas(mat(0x267a45),0x1a4636)],rockM=seas(mat(0x9aa3a8),0xb4bec6),grassM=seas(mat(0x6fbf4a),0xf2f6fa),sandM=seas(mat(0xe8cf8f),0xcfd8e0);
function tree(x,z,s,parent,list,y=0,i=0){
  const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(s);parent.add(g);
  add(new THREE.CylinderGeometry(.22,.3,1.4,6),trunkM,0,.7,0,g);
  const lm=leafM[i%3];add(new THREE.ConeGeometry(1.4,2.2,7),lm,0,2.1,0,g);add(new THREE.ConeGeometry(1,1.7,7),lm,0,3.2,0,g);
  winterOnly.push(add(new THREE.ConeGeometry(.68,.72,7),snowM,0,3.72,0,g),add(new THREE.CylinderGeometry(1.02,1.42,.16,7),snowM,0,1.95,0,g));
  list.push({x,z,r:.65*s,tree:true,y,top:y+4.05*s});
}
function rock(x,z,s,parent,list,y=0){const m=add(new THREE.DodecahedronGeometry(1,0),rockM,x,y+s*.4,z,parent);m.scale.set(s,s*.7,s);m.rotation.y=x*z;list.push({x,z,r:s*.9});
  const c=add(new THREE.SphereGeometry(1,10,6),snowM,x,y+s*.95,z,parent);c.scale.set(s*.75,s*.22,s*.75);winterOnly.push(c)}
const flowerC=[0xffffff,0xffd84a,0xff8fb1].map(c=>mat(c));
function flowers(cx,cz,R,n,y,parent){for(let i=0;i<n;i++){const a=rnd()*PI*2,r=rnd()*R;
  const m=new THREE.Mesh(new THREE.SphereGeometry(.09,5,4),flowerC[i%3]);m.position.set(cx+Math.cos(a)*r,y+.08,cz+Math.sin(a)*r);parent.add(m);summerOnly.push(m)}}
