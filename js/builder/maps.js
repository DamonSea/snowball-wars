// Custom Trick Park maps: the asset catalog, the map file format, and turning a map into a playable Trick Park.
// A map is {v:1, id, name, author, items:[{t, x, z, ...}]}. Shared maps arrive from other people, so every map is
// passed through cleanMap() before it's built: unknown items are dropped and every number is clamped.
const MAP_LIMIT=600,MAP_R=26.5;
const PALETTE=[0x2bb3a8,0xff7a59,0xffd84a,0x4f8fe0,0x9a5fc4,0x3fb56a,0xd83a2e,0xdccdb0];
// field ranges: [min, max, step]
const FIELDS={w:['Width',.4,30,.5],d:['Depth',.4,30,.5],h:['Height',.2,20,.1],th:['Thickness',.15,1.5,.05],r:['Radius',.3,4,.05],
  s:['Size',.5,3,.1],steps:['Steps',2,12,1],y:['Height',0,20,.1],c:['Color',0,7,1],posts:['Posts',0,1,1]};
// the asset library: label, group, default fields, which fields the inspector shows, and how big its footprint is
const ASSETS={
  block:{label:'Block',icon:'▣',cat:'Structures',def:{w:2,d:2,h:2,c:0},f:['w','d','h','c'],tip:'Solid block from the ground up'},
  wall:{label:'Wall',icon:'▮',cat:'Structures',def:{w:.6,d:4,h:4,c:3},f:['w','d','h','c'],tip:'Tall and thin: wall jumps'},
  deck:{label:'Raised deck',icon:'▭',cat:'Structures',def:{w:4,d:4,h:2.4,th:.4,c:2,posts:1},f:['w','d','h','th','c','posts'],tip:'Floating platform you can run under'},
  bars:{label:'Monkey bars',icon:'☰',cat:'Structures',def:{w:6,d:.9,h:3.4,c:3},f:['w','d','h','c'],tip:'Hang and shimmy, or balance on top'},
  stairs:{label:'Stairs',icon:'⊿',cat:'Structures',def:{w:2,d:3,h:1.6,steps:4,c:7,dir:0},f:['w','d','h','steps','c'],tip:'Steps up; Rotate turns them'},
  tires:{label:'Tire stack',icon:'◎',cat:'Structures',def:{r:.8,h:1.6,c:5},f:['r','h','c'],tip:'Round pillar with a tire on top'},
  ice:{label:'Ice patch',icon:'❄',cat:'Structures',def:{w:6,d:6},f:['w','d'],tip:'Slippery skating ice'},
  pad:{label:'Trampoline',icon:'⤒',cat:'Play',def:{r:1.15,c:6},f:['r','c'],tip:'Bounce! Ground pound onto it for a super bounce'},
  pole:{label:'Climbing pole',icon:'❘',cat:'Play',def:{h:5,c:2},f:['h','c'],tip:'Climb, handstand, flip'},
  lamp:{label:'Lamp post',icon:'†',cat:'Play',def:{},f:[],tip:'A climbable lamp'},
  orb:{label:'Orb',icon:'◆',cat:'Play',def:{y:1},f:['y'],tip:'An orb spot (worth more the higher it is)'},
  snowman:{label:'Snowman target',icon:'☃',cat:'Play',def:{},f:[],tip:'Knock it over for points'},
  roller:{label:'Rolling snowball',icon:'●',cat:'Play',def:{},f:[],tip:'Push it to roll it bigger'},
  start:{label:'START pad',icon:'▶',cat:'Play',def:{},f:[],tip:'Where timed runs start (one per map)',unique:true},
  tree:{label:'Tree',icon:'♣',cat:'Nature',def:{s:1},f:['s'],tip:'Climbable tree'},
  rock:{label:'Rock',icon:'◒',cat:'Nature',def:{s:1},f:['s'],tip:'Decoration you bump into'},
};
const num=(v,lo,hi,dflt)=>{v=+v;return Number.isFinite(v)?Math.max(lo,Math.min(hi,v)):dflt};
const newMapId=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
function blankMap(){return{v:1,id:newMapId(),name:'My map',author:'',items:[{t:'start',x:0,z:12}]}}
// make any map safe to build: known items only, numbers in range, inside the arena, one START pad
function cleanMap(m){const o={v:1,id:/^[a-z0-9]{6,24}$/.test(m&&m.id)?m.id:newMapId(),name:String((m&&m.name)||'Untitled').replace(/[<>]/g,'').slice(0,32)||'Untitled',
  author:String((m&&m.author)||'').replace(/[<>]/g,'').slice(0,32),items:[]};let start=false;
  for(const it of (Array.isArray(m&&m.items)?m.items:[]).slice(0,MAP_LIMIT)){const A=ASSETS[it&&it.t];if(!A)continue;if(A.unique){if(start)continue;start=true}
    const q={t:it.t,x:num(it.x,-MAP_R,MAP_R,0),z:num(it.z,-MAP_R,MAP_R,0)};const r=Math.hypot(q.x,q.z);if(r>MAP_R){q.x*=MAP_R/r;q.z*=MAP_R/r}
    for(const k of Object.keys(A.def)){const F=FIELDS[k];q[k]=k==='dir'?Math.round(num(it.dir,0,3,0)):F?num(it[k],F[1],F[2],A.def[k]):A.def[k];if(F&&F[3]===1)q[k]=Math.round(q[k])}
    if(q.t==='deck'&&q.th>q.h-.1)q.th=Math.max(.15,q.h-.1);o.items.push(q)}
  if(!start)o.items.unshift({t:'start',x:0,z:12});return o}
// footprint for picking and the selection box: {x,z,w,d,top}
function itemBox(it){const A=ASSETS[it.t];
  if('w' in A.def)return{x:it.x,z:it.z,w:it.w,d:it.d,top:it.t==='ice'?.12:it.h};
  if(it.t==='tires'||it.t==='pad')return{x:it.x,z:it.z,w:it.r*2,d:it.r*2,top:it.t==='pad'?.4:it.h};
  if(it.t==='pole')return{x:it.x,z:it.z,w:.6,d:.6,top:it.h};
  if(it.t==='tree')return{x:it.x,z:it.z,w:1.4*it.s,d:1.4*it.s,top:4.1*it.s};
  if(it.t==='rock')return{x:it.x,z:it.z,w:1.4*it.s,d:1.4*it.s,top:.9*it.s};
  if(it.t==='orb')return{x:it.x,z:it.z,w:.9,d:.9,top:it.y+.9};
  if(it.t==='start')return{x:it.x,z:it.z,w:3.2,d:3.2,top:.1};
  if(it.t==='lamp')return{x:it.x,z:it.z,w:.6,d:.6,top:4.4};
  return{x:it.x,z:it.z,w:1.4,d:1.4,top:2.3}}
const orbValue=y=>Math.min(450,100+50*Math.floor(y/1.5));
// build a map into its own world group, in the same shape as the built-in maps
function buildCustom(map){const m=cleanMap(map);
  const saved={advW,plats,advCol};const grp=new THREE.Group();grp.visible=false;scene.add(grp);advW=grp;plats=[];advCol=[];
  add(new THREE.CylinderGeometry(30.5,26,3,48),sandM,0,-1.6,0,grp);
  add(new THREE.CylinderGeometry(28.5,28.5,.2,48),grassM,0,-.1,0,grp).castShadow=false;plats.push({k:'c',x:0,z:0,r:28.5,top:0});
  const col=i=>mat(PALETTE[i]||PALETTE[0],{roughness:.5,metalness:.15}),side=seas(mat(0xdccdb0),0xdde3e8),steel=mat(0x9aa3ab,{roughness:.35,metalness:.6});
  const spots=[],rollers=[],snowAt=[];let spad={x:0,z:12};
  const topSpot=(x,z,y)=>spots.push({x,z,y,v:orbValue(y),any:y<=2.6?1:0});
  m.items.forEach((it,i)=>{const{x,z}=it;switch(it.t){
    case'block':boxPlat(x,z,it.w,it.d,it.h,side,col(it.c));topSpot(x,z,it.h);break;
    case'wall':boxPlat(x,z,it.w,it.d,it.h,col(it.c),col(it.c));if(it.w>=1&&it.d>=1)topSpot(x,z,it.h);break;
    case'deck':floatPlat(x,z,it.w,it.d,it.h,it.th,col(it.c),seas(mat(0xc98d52),0xf4f8fb));topSpot(x,z,it.h);
      if(it.posts&&it.h-it.th>.6)[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{const px=x+a*(it.w/2-.25),pz=z+b*(it.d/2-.25);
        add(new THREE.CylinderGeometry(.12,.12,it.h-it.th,8),col(it.c),px,(it.h-it.th)/2,pz,grp);advCol.push({x:px,z:pz,r:.22})});break;
    case'bars':{floatPlat(x,z,it.w,it.d,it.h,.2,steel,null);const along=it.w>=it.d,L=along?it.w:it.d,n=Math.max(2,Math.floor(L/.66));
      for(let k=0;k<n;k++){const o=-L/2+.3+k*(L-.6)/(n-1),r=add(new THREE.CylinderGeometry(.05,.05,along?it.d:it.w,6),col(it.c),along?x+o:x,it.h-.08,along?z:z+o,grp);if(along)r.rotation.x=PI/2;else r.rotation.z=PI/2}
      [-1,1].forEach(s=>add(new THREE.CylinderGeometry(.08,.08,it.h-.2,8),col(it.c),along?x+s*(L/2-.2):x,(it.h-.2)/2,along?z:z+s*(L/2-.2),grp));topSpot(x,z,it.h);break}
    case'stairs':{const n=it.steps,along=it.dir%2===0,L=along?it.d:it.w,sgn=it.dir===0||it.dir===3?-1:1,step=L/n;
      for(let k=0;k<n;k++){const o=(-L/2+step*(k+.5))*sgn,top=it.h*(k+1)/n;boxPlat(along?x:x+o,along?z+o:z,along?it.w:step,along?step:it.d,top,side,col(it.c))}
      topSpot(along?x:x+(L/2-step/2)*sgn,along?z+(L/2-step/2)*sgn:z,it.h);break}
    case'tires':add(new THREE.CylinderGeometry(it.r,it.r,it.h,16),col(it.c),x,it.h/2,z,grp);add(new THREE.TorusGeometry(it.r*.78,it.r*.25,8,20),mat(0x22262b,{roughness:.9}),x,it.h,z,grp).rotation.x=PI/2;
      plats.push({k:'c',x,z,r:it.r,top:it.h});topSpot(x,z,it.h);break;
    case'ice':add(B(it.w,.24,it.d),mat(0xa9d8ea,{roughness:.3}),x,0,z,grp);add(B(it.w,.02,it.d),new THREE.MeshStandardMaterial({color:0xd4f0fb,roughness:.06,metalness:.12}),x,.125,z,grp).receiveShadow=true;
      plats.push({k:'b',x,z,w:it.w,d:it.d,top:.12,ice:true});break;
    case'pad':bouncePad(x,z,it.r,.35,col(it.c));spots.push({x,z,y:4,v:200,air:1,any:1});break;
    case'pole':add(new THREE.CylinderGeometry(.1,.1,it.h,10),col(it.c),x,it.h/2,z,grp);add(new THREE.SphereGeometry(.17,10,8),col(it.c),x,it.h,z,grp);advCol.push({x,z,r:.3,tree:true,pole:true,y:0,top:it.h+.05});break;
    case'lamp':add(new THREE.CylinderGeometry(.09,.13,4,8),steel,x,2,z,grp);add(new THREE.SphereGeometry(.28,12,8),new THREE.MeshStandardMaterial({color:0xffe2a8,emissive:0xffc46b,emissiveIntensity:1.3}),x,4.1,z,grp);
      advCol.push({x,z,r:.3,tree:true,pole:true,y:0,top:4.4});break;
    case'tree':tree(x,z,it.s,grp,advCol,0,i);break;
    case'rock':rock(x,z,it.s,grp,advCol);break;
    case'orb':spots.push({x,z,y:it.y,v:orbValue(it.y)+50,air:it.y>.3?1:0,any:it.y<=2.4?1:0});break;
    case'snowman':snowAt.push([x,z]);break;
    case'roller':rollers.push([x,z]);break;
    case'start':spad={x,z};break}});
  // a few ground orbs so every map has something to collect
  for(let k=0;k<8;k++){const a=k*PI/4+.4,rr=9+(k%3)*4,sx=Math.cos(a)*rr,sz=Math.sin(a)*rr;if(!plats.some(p=>p.top>.3&&inside(p,sx,sz,.6)))spots.push({x:sx,z:sz,y:0,v:100,any:1})}
  const M={name:m.name,author:m.author,grp,plats,advCol,spad,key:'cm_'+m.id,gaps:[],spots,rollers:rollers.length?rollers:null,custom:true,map:m,
    snowmen:snowAt.map(([x,z],i)=>makeSnowman(grp,x,z,i))};
  advW=saved.advW;plats=saved.plats;advCol=saved.advCol;return M}
// add (or replace) a custom map in the Trick Park list; returns its index
function addCustomMap(map){const M=buildCustom(map),i=RUNMAPS.findIndex(q=>q.key===M.key);
  if(i>=0){const old=RUNMAPS[i];if(old===runL&&mode==='run'&&state!=='build'){scene.remove(M.grp);return i}scene.remove(old.grp);RUNMAPS[i]=M;if(old===runL)runL=M;return i}
  RUNMAPS.push(M);return RUNMAPS.length-1}
