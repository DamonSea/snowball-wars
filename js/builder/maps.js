// Custom Trick Park maps: the asset catalog, the map file format, and turning a map into a playable Trick Park.
// A map is {v:1, id, name, author, items:[{t, x, z, ...}]}. Shared maps arrive from other people, so every map is
// passed through cleanMap() before it's built: unknown items are dropped and every number is clamped.
const MAP_LIMIT=600,MAP_R=26.5;
const PALETTE=[0x2bb3a8,0xff7a59,0xffd84a,0x4f8fe0,0x9a5fc4,0x3fb56a,0xd83a2e,0xdccdb0];
// field ranges: [min, max, step]
const FIELDS={w:['Width',.4,30,.5],d:['Depth',.4,30,.5],h:['Height',.2,20,.1],th:['Thickness',.15,1.5,.05],r:['Radius',.3,4,.05],
  s:['Size',.5,3,.1],steps:['Steps',2,12,1],y:['Height',0,20,.1],c:['Color',0,7,1],posts:['Posts',0,1,1],f:['Facade',0,4,1]};
// skyscraper facades (the Rooftops buildings' colours)
const BLD_FAC=['#b85c48','#6f7f96','#c9a26b','#7e9a86','#a46a8c'];
// the asset library: label, group, default fields, which fields the inspector shows, and how big its footprint is
const ASSETS={
  block:{label:'Block',icon:'▣',cat:'Structures',def:{w:2,d:2,h:2,c:0},f:['w','d','h','c'],tip:'Solid block from the ground up'},
  wall:{label:'Wall',icon:'▮',cat:'Structures',def:{w:.6,d:4,h:4,c:3},f:['w','d','h','c'],tip:'Tall and thin: wall jumps'},
  deck:{label:'Raised deck',icon:'▭',cat:'Structures',def:{w:4,d:4,h:2.4,th:.4,c:2,posts:1},f:['w','d','h','th','c','posts'],tip:'Floating platform you can run under'},
  bars:{label:'Monkey bars',icon:'☰',cat:'Structures',def:{w:6,d:.9,h:3.4,c:3},f:['w','d','h','c'],tip:'Hang and shimmy, or balance on top'},
  stairs:{label:'Stairs',icon:'⊿',cat:'Structures',def:{w:2,d:3,h:1.6,steps:4,c:7,dir:0},f:['w','d','h','steps','c'],tip:'Steps up; Rotate turns them'},
  ramp:{label:'Ramp',icon:'◺',cat:'Structures',def:{w:3,d:5,h:2,c:2,dir:0},f:['w','d','h','c'],tip:'Solid slope up from the ground (crouch on it to butt-slide); Rotate turns it'},
  tires:{label:'Tire stack',icon:'◎',cat:'Structures',def:{r:.8,h:1.6,c:5},f:['r','h','c'],tip:'Round pillar with a tire on top'},
  ice:{label:'Ice patch',icon:'❄',cat:'Structures',def:{w:6,d:6},f:['w','d'],tip:'Slippery skating ice'},
  slide:{label:'Slide',icon:'⟋',cat:'Play',def:{w:2.4,d:10,h:4,c:5,dir:0},f:['w','d','h','c'],tip:'Railed chute: crouch on it to butt-slide down. Rotate turns it; put stairs or a deck at the top'},
  pad:{label:'Trampoline',icon:'⤒',cat:'Play',def:{r:1.15,c:6},f:['r','c'],tip:'Bounce! Ground pound onto it for a super bounce'},
  pole:{label:'Climbing pole',icon:'❘',cat:'Play',def:{h:5,c:2},f:['h','c'],tip:'Climb, handstand, flip'},
  orb:{label:'Orb',icon:'◆',cat:'Play',def:{y:1},f:['y'],tip:'An orb spot (worth more the higher it is)'},
  snowman:{label:'Snowman target',icon:'☃',cat:'Play',def:{},f:[],tip:'Knock it over for points'},
  roller:{label:'Rolling snowball',icon:'●',cat:'Play',def:{},f:[],tip:'Push it to roll it bigger'},
  spawn:{label:'Spawn point',icon:'◉',cat:'Play',def:{},f:[],tip:'Where players appear (one per map)',unique:true,required:true},
  start:{label:'PLAY pad',icon:'▶',cat:'Objectives',def:{},f:[],tip:'Stand here to choose a mode: Collectathon, Snowball Wars or Tag',unique:true},
  checkpoint:{label:'Checkpoint flag',icon:'⚑',cat:'Objectives',def:{},f:[],tip:'Flag race: touch it to save your spot; you come back here'},
  finish:{label:'Finish flag',icon:'🏁',cat:'Objectives',def:{},f:[],tip:'Flag race: reach it to finish (one per map)',unique:true},
  tree:{label:'Tree',icon:'♣',cat:'Nature',def:{s:1},f:['s'],tip:'Climbable tree'},
  rock:{label:'Rock',icon:'◒',cat:'Nature',def:{s:1},f:['s'],tip:'Decoration you bump into'},
  cane:{label:'Candy cane',icon:'𝐉',cat:'Village',def:{h:4.4,dir:0},f:['h'],tip:'Climb it, handstand on top and flip. Rotate turns the hook'},
  xtree:{label:'Christmas tree',icon:'🎄',cat:'Village',def:{s:1.2},f:['s'],tip:'A decorated tree you can climb'},
  gift:{label:'Gift box',icon:'🎁',cat:'Village',def:{w:1.4,d:1.4,h:1.2,c:6},f:['w','d','h','c'],tip:'A solid present to hop on'},
  stall:{label:'Market stall',icon:'⛱',cat:'Village',def:{w:3,d:2.2,h:2,c:6},f:['w','d','h','c'],tip:'Walk under it; its striped awning is bouncy'},
  cottage:{label:'Cottage',icon:'⌂',cat:'Village',def:{w:5,d:5,h:2.2,c:6},f:['w','d','h','c'],tip:'Pitched roof you can run up and slide down (Height is the eaves)'},
  bauble:{label:'Big bauble',icon:'◍',cat:'Village',def:{s:1,c:0},f:['s','c'],tip:'A giant ornament you bump into or stand on'},
  sky:{label:'Skyscraper',icon:'🏢',cat:'City',def:{w:6,d:6,h:12,f:0},f:['w','d','h','f'],tip:'A tall city building with a flat roof; put two close together for a wall-jump alley'},
  flag:{label:'Flagpole',icon:'🚩',cat:'City',def:{h:6,c:6,dir:0},f:['h','c'],tip:'A climbable pole with a flag blowing in the wind. Rotate turns the wind'},
  lamp:{label:'Lamp post',icon:'†',cat:'City',def:{},f:[],tip:'A climbable lamp'},
};
const cottageRidge=it=>+(it.h+Math.min(2.2,it.d*.3)).toFixed(2);
const num=(v,lo,hi,dflt)=>{v=+v;return Number.isFinite(v)?Math.max(lo,Math.min(hi,v)):dflt};
const newMapId=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
// map settings: enemies on/off, the orb run (PLAY pad game) on/off, the flag race (checkpoints + finish) on/off
const MAP_OPTS={enemies:['Enemies',1],orbs:['Collectathon',1],flags:['Flag race',0]};
function blankMap(){return{v:1,id:newMapId(),name:'My map',author:'',opt:{enemies:1,orbs:1,flags:0},items:[{t:'spawn',x:0,z:16},{t:'start',x:0,z:10}]}}
// make any map safe to build: known items only, numbers in range, inside the arena, one PLAY pad
function cleanMap(m){const o={v:1,id:/^[a-z0-9]{6,24}$/.test(m&&m.id)?m.id:newMapId(),name:String((m&&m.name)||'Untitled').replace(/[<>]/g,'').slice(0,32)||'Untitled',
  author:String((m&&m.author)||'').replace(/[<>]/g,'').slice(0,32),items:[],opt:{}};const seen=new Set();
  for(const k in MAP_OPTS)o.opt[k]=m&&m.opt&&m.opt[k]!==undefined?(m.opt[k]?1:0):MAP_OPTS[k][1];
  for(const it of (Array.isArray(m&&m.items)?m.items:[]).slice(0,MAP_LIMIT)){const A=ASSETS[it&&it.t];if(!A)continue;if(A.unique){if(seen.has(it.t))continue;seen.add(it.t)}
    const q={t:it.t,x:num(it.x,-MAP_R,MAP_R,0),z:num(it.z,-MAP_R,MAP_R,0)};const r=Math.hypot(q.x,q.z);if(r>MAP_R){q.x*=MAP_R/r;q.z*=MAP_R/r}
    for(const k of Object.keys(A.def)){const F=FIELDS[k];q[k]=k==='dir'?Math.round(num(it.dir,0,3,0)):F?num(it[k],F[1],F[2],A.def[k]):A.def[k];if(F&&F[3]===1)q[k]=Math.round(q[k])}
    if(q.t==='deck'&&q.th>q.h-.1)q.th=Math.max(.15,q.h-.1);o.items.push(q)}
  // every map needs a spawn point; older maps spawned on their PLAY pad, so put it just in front of the pad
  if(!seen.has('spawn')){const s=o.items.find(i=>i.t==='start');let sx=0,sz=16;
    if(s){const r=Math.hypot(s.x,s.z)||1;sx=+(s.x-s.x/r*3).toFixed(1);sz=+(s.z-s.z/r*3).toFixed(1);if(!Math.hypot(s.x,s.z)){sx=0;sz=3}}
    o.items.unshift({t:'spawn',x:sx,z:sz})}
  return o}
// footprint for picking and the selection box: {x,z,w,d,top}
function itemBox(it){const A=ASSETS[it.t];
  if('w' in A.def)return{x:it.x,z:it.z,w:it.w,d:it.d,top:it.t==='ice'?.12:it.t==='cottage'?cottageRidge(it):it.h};
  if(it.t==='tires'||it.t==='pad')return{x:it.x,z:it.z,w:it.r*2,d:it.r*2,top:it.t==='pad'?.4:it.h};
  if(it.t==='pole')return{x:it.x,z:it.z,w:.6,d:.6,top:it.h};
  if(it.t==='tree')return{x:it.x,z:it.z,w:1.4*it.s,d:1.4*it.s,top:4.1*it.s};
  if(it.t==='rock')return{x:it.x,z:it.z,w:1.4*it.s,d:1.4*it.s,top:.9*it.s};
  if(it.t==='orb')return{x:it.x,z:it.z,w:.9,d:.9,top:it.y+.9};
  if(it.t==='start')return{x:it.x,z:it.z,w:3.2,d:3.2,top:.1};
  if(it.t==='spawn')return{x:it.x,z:it.z,w:1.6,d:1.6,top:.1};
  if(it.t==='checkpoint')return{x:it.x,z:it.z,w:.8,d:.8,top:2.8};
  if(it.t==='finish')return{x:it.x,z:it.z,w:1.2,d:1.2,top:3.8};
  if(it.t==='lamp')return{x:it.x,z:it.z,w:.6,d:.6,top:4.4};
  if(it.t==='cane'||it.t==='flag')return{x:it.x,z:it.z,w:.7,d:.7,top:it.h+(it.t==='cane'?.5:.2)};
  if(it.t==='xtree')return{x:it.x,z:it.z,w:3*it.s,d:3*it.s,top:4.6*it.s};
  if(it.t==='bauble')return{x:it.x,z:it.z,w:1.2*it.s,d:1.2*it.s,top:1.25*it.s};
  return{x:it.x,z:it.z,w:1.4,d:1.4,top:2.3}}
const orbValue=y=>Math.min(450,100+50*Math.floor(y/1.5));
// build a map into its own world group, in the same shape as the built-in maps
// bare: just the one kind of item (no ground, markers or extra orbs), for the builder's previews and ghost
function buildCustom(map,preview=false,bare=null){const m=cleanMap(map);if(bare)m.items=m.items.filter(i=>i.t===bare);
  const saved={advW,plats,advCol};const grp=new THREE.Group();grp.visible=false;scene.add(grp);advW=grp;plats=[];advCol=[];
  if(!bare){add(new THREE.CylinderGeometry(30.5,26,3,48),sandM,0,-1.6,0,grp);
    add(new THREE.CylinderGeometry(28.5,28.5,.2,48),grassM,0,-.1,0,grp).castShadow=false}plats.push({k:'c',x:0,z:0,r:28.5,top:0});
  const col=i=>mat(PALETTE[i]||PALETTE[0],{roughness:.5,metalness:.15}),side=seas(mat(0xdccdb0),0xdde3e8),steel=mat(0x9aa3ab,{roughness:.35,metalness:.6});
  const spots=[],rollers=[],snowAt=[],flagAt=[],waves=[];let spad=null,padAt=null,spawn={x:0,z:16};
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
    case'ramp':case'slide':{const along=it.dir%2===0,L=along?it.d:it.w,wid=along?it.w:it.d,sgn=it.dir===0||it.dir===3?-1:1,ax=along?'z':'x',
        cc=along?x:z,ca=along?z:x,high=ca+sgn*L/2,low=ca-sgn*L/2;
      if(it.t==='ramp')wedgeRamp(ax,low,high,cc,wid,it.h,side,col(it.c),grp);
      else slideChute(ax,low,high,cc,wid,.3,it.h,col(it.c),mat(0xffd84a),steel,grp);
      const hx=along?x:high-sgn*.6,hz=along?high-sgn*.6:z;topSpot(hx,hz,it.h);break}
    case'tires':add(new THREE.CylinderGeometry(it.r,it.r,it.h,16),col(it.c),x,it.h/2,z,grp);add(new THREE.TorusGeometry(it.r*.78,it.r*.25,8,20),mat(0x22262b,{roughness:.9}),x,it.h,z,grp).rotation.x=PI/2;
      plats.push({k:'c',x,z,r:it.r,top:it.h});topSpot(x,z,it.h);break;
    case'ice':add(B(it.w,.24,it.d),mat(0xa9d8ea,{roughness:.3}),x,0,z,grp);add(B(it.w,.02,it.d),new THREE.MeshStandardMaterial({color:0xd4f0fb,roughness:.06,metalness:.12}),x,.125,z,grp).receiveShadow=true;
      plats.push({k:'b',x,z,w:it.w,d:it.d,top:.12,ice:true});break;
    case'pad':bouncePad(x,z,it.r,.35,col(it.c));spots.push({x,z,y:4,v:200,air:1,any:1});break;
    case'pole':add(new THREE.CylinderGeometry(.1,.1,it.h,10),col(it.c),x,it.h/2,z,grp);add(new THREE.SphereGeometry(.17,10,8),col(it.c),x,it.h,z,grp);advCol.push({x,z,r:.3,tree:true,pole:true,y:0,top:it.h+.05});break;
    case'lamp':add(new THREE.CylinderGeometry(.09,.13,4,8),steel,x,2,z,grp);add(new THREE.SphereGeometry(.28,12,8),lampGlow(),x,4.1,z,grp);
      advCol.push({x,z,r:.3,tree:true,pole:true,y:0,top:4.4});break;
    case'tree':tree(x,z,it.s,grp,advCol,0,i);break;
    case'cane':case'xtree':case'gift':case'stall':case'cottage':case'bauble':case'sky':case'flag':villageItem(it,grp,col,steel,side,topSpot,waves);break;
    case'rock':rock(x,z,it.s,grp,advCol);break;
    case'orb':spots.push({x,z,y:it.y,v:orbValue(it.y)+50,air:it.y>.3?1:0,any:it.y<=2.4?1:0});break;
    case'snowman':snowAt.push([x,z]);break;
    case'roller':rollers.push([x,z]);break;
    case'start':padAt={x,z};break;
    case'spawn':spawn={x,z};break;
    case'checkpoint':flagAt.push({x,z,fin:false});break;
    case'finish':flagAt.push({x,z,fin:true});break}});
  // flags stand on whatever is under them; markers for the spawn point (and, in the builder, the PLAY pad)
  const topHere=(x,z)=>plats.reduce((h,p)=>inside(p,x,z,0)&&topOf(p,x,z)<40?Math.max(h,topOf(p,x,z)):h,0);
  const cps=[],flags=flagAt.map(f=>{const y=topHere(f.x,f.z),fl=makeRaceFlag(grp,f.x,y,f.z,f.fin);fl.x=f.x;fl.z=f.z;fl.y=y;fl.fin=f.fin;if(!f.fin)cps.push(fl);return fl});
  const finish=flags.find(f=>f.fin)||null;
  spawn.y=topHere(spawn.x,spawn.z);
  if(!bare||bare==='spawn'){const r=add(new THREE.RingGeometry(.55,.8,28),new THREE.MeshBasicMaterial({color:0x5ff3ff,transparent:true,opacity:.6,side:THREE.DoubleSide,depthWrite:false}),spawn.x,spawn.y+.05,spawn.z,grp);r.rotation.x=-PI/2;r.castShadow=r.receiveShadow=false}
  if(preview&&padAt&&(!bare||bare==='start')){const r=add(new THREE.RingGeometry(1.25,1.7,32),new THREE.MeshBasicMaterial({color:0xffcc33,transparent:true,opacity:m.opt.orbs?.7:.25,side:THREE.DoubleSide,depthWrite:false}),padAt.x,.06,padAt.z,grp);r.rotation.x=-PI/2;r.castShadow=r.receiveShadow=false}
  spad=m.opt.orbs&&padAt?padAt:null;
  // a few ground orbs so every map has something to collect
  if(!bare)for(let k=0;k<8;k++){const a=k*PI/4+.4,rr=9+(k%3)*4,sx=Math.cos(a)*rr,sz=Math.sin(a)*rr;if(!plats.some(p=>p.top>.3&&inside(p,sx,sz,.6)))spots.push({x:sx,z:sz,y:0,v:100,any:1})}
  const M={waves,name:m.name,author:m.author,grp,plats,advCol,spad,spawn,opt:m.opt,cps,finish:m.opt.flags?finish:null,key:'cm_'+m.id,gaps:[],spots,rollers:rollers.length?rollers:null,custom:true,map:m,
    snowmen:snowAt.map(([x,z],i)=>makeSnowman(grp,x,z,i))};
  advW=saved.advW;plats=saved.plats;advCol=saved.advCol;return M}
// Christmas Village and city pieces (look like the ones on those maps)
let BFAC=null;const bFac=i=>{if(!BFAC)BFAC=BLD_FAC.map(c=>{const f=facade(c);keep(f.t,f.et);return f});return BFAC[i%BFAC.length]};
const XMAS={};const xm=()=>XMAS.white?XMAS:Object.assign(XMAS,{white:keep(mat(0xf8f8f8,{roughness:.5})),red:keep(mat(0xd8282f,{roughness:.45})),gold:keep(mat(0xffcf3f,{roughness:.3,metalness:.6})),
  leaf:keep(mat(0x1f6b3a,{roughness:.8})),trunk:keep(mat(0x6b4a2f,{roughness:.9})),wood:keep(mat(0x8a5a35,{roughness:.8})),timber:keep(mat(0x5b3a24,{roughness:.8})),
  plaster:keep(mat(0xf0e2c8,{roughness:.85})),snow:keep(mat(0xffffff,{roughness:.9})),metal:keep(mat(0x3a3f47,{roughness:.5,metalness:.3})),
  roof:keep(seas(mat(0x7d838b),0xf2f6fa)),glow:keep(new THREE.MeshStandardMaterial({color:0xffd98a,emissive:0xffb347,emissiveIntensity:1.1})),
  bulbs:[0xff4d4d,0x4dff7a,0x4da6ff,0xffd84d,0xff7af0].map(c=>keep(new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:1.4})))});
const DIRA=d=>[0,PI/2,PI,-PI/2][d|0];
function villageItem(it,grp,col,steel,side,topSpot,waves){const X=xm(),{x,z}=it,G=grp,B3=(w,h,d)=>new THREE.BoxGeometry(w,h,d);switch(it.t){
  case'cane':{const top=it.h;add(new THREE.CylinderGeometry(.12,.12,top,10),X.white,x,top/2,z,G);
    for(let y=.3;y<top-.2;y+=.45){const r=add(new THREE.TorusGeometry(.125,.04,5,12),X.red,x,y,z,G);r.rotation.x=PI/2+.5}
    const a=DIRA(it.dir),hk=add(new THREE.TorusGeometry(.38,.12,8,14,PI),X.red,x+Math.cos(a)*.38,top,z+Math.sin(a)*.38,G);hk.rotation.y=-a;
    advCol.push({x,z,r:.3,tree:true,pole:true,y:0,top:top+.05});break}
  case'xtree':{const s=it.s,g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);G.add(g);add(new THREE.CylinderGeometry(.22,.3,1.4,8),X.trunk,0,.7,0,g);
    [[1.5,2.2,2.0],[1.15,1.9,3.0],[.8,1.5,3.85]].forEach(([r,h,y])=>add(new THREE.ConeGeometry(r,h,10),X.leaf,0,y,0,g));
    [[1.3,1.65],[1.0,2.6],[.68,3.5]].forEach(([r,y],k)=>{for(let i=0;i<7;i++){const a=i/7*PI*2+k;add(new THREE.SphereGeometry(.12,8,6),X.bulbs[(i+k)%5],Math.cos(a)*r,y,Math.sin(a)*r,g)}});
    add(new THREE.OctahedronGeometry(.32,0),X.gold,0,4.75,0,g);advCol.push({x,z,r:.65*s,tree:true,y:0,top:4.05*s});break}
  case'gift':{const c=col(it.c);boxPlat(x,z,it.w,it.d,it.h,c,c);add(B3(it.w+.04,.06,.22),X.gold,x,it.h+.01,z,G);add(B3(.22,.06,it.d+.04),X.gold,x,it.h+.01,z,G);
    add(B3(it.w+.03,it.h,.2),X.gold,x,it.h/2,z,G);add(B3(.2,it.h,it.d+.03),X.gold,x,it.h/2,z,G);
    const bw=add(new THREE.TorusGeometry(.22,.07,6,12),X.gold,x-.18,it.h+.2,z,G),bw2=add(new THREE.TorusGeometry(.22,.07,6,12),X.gold,x+.18,it.h+.2,z,G);bw.rotation.y=bw2.rotation.y=PI/2;topSpot(x,z,it.h);break}
  case'stall':{const cA=col(it.c),p=floatPlat(x,z,it.w,it.d,it.h,.3,cA,null);p.bounce=true;p.bvy=T.bounce.awning;
    const n=Math.max(2,Math.round(it.w/.6)),sw=it.w/n;for(let i=0;i<n;i++)add(B3(sw,.06,it.d+.06),i%2?cA:X.white,x-it.w/2+sw*(i+.5),it.h+.02,z,G);
    for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])add(new THREE.CylinderGeometry(.08,.08,it.h-.3,6),X.wood,x+a*(it.w/2-.15),(it.h-.3)/2,z+b*(it.d/2-.15),G);
    if(it.h>1.4&&it.w>1.2&&it.d>1){add(B3(it.w-.4,.9,it.d-.6),X.wood,x,.45,z,G);plats.push({k:'b',x,z,w:it.w-.4,d:it.d-.6,top:.9})}topSpot(x,z,it.h);break}
  case'cottage':{const E=it.h,R=cottageRidge(it),w=it.w,d=it.d,h=R-E,half=d/2,ov=.45,len=Math.hypot(half+ov,h*(half+ov)/half),ang=Math.atan2(h,half),roofM=col(it.c);
    boxPlat(x,z,w,d,E,X.plaster,null);
    [-1,1].forEach(s=>{const m=add(B3(w+.7,.22,len),roofM,x,E+h/2-h*ov/half/2+.08,z+s*(half+ov)/2,G);m.rotation.x=s*ang;
      const cap=add(B3(w+.75,.12,len*.98),X.snow,x,m.position.y+.16/Math.cos(ang),m.position.z,G);cap.rotation.x=s*ang;cap.visible=WIN;
      rampPlat('z',z+s*half,z,x,w,E,R,h+.4)});
    const tri=new THREE.Shape();tri.moveTo(-half,0);tri.lineTo(half,0);tri.lineTo(0,h);tri.lineTo(-half,0);
    const gab=new THREE.Mesh(new THREE.ExtrudeGeometry(tri,{depth:w-.02,bevelEnabled:false}),X.plaster);gab.rotation.y=PI/2;gab.position.set(x-w/2+.01,E,z);gab.castShadow=gab.receiveShadow=true;G.add(gab);
    add(B3(w+.8,.12,.12),X.white,x,R+.1,z,G);const fz=z+half+.03;add(B3(1,Math.min(1.7,E-.2),.08),X.timber,x,Math.min(1.7,E-.2)/2,fz,G);
    for(const dx of[-1,1])if(w>3.2)add(B3(.8,.8,.06),X.glow,x+dx*(w/2-1),Math.min(1.3,E-.6),fz,G);
    add(B3(.6,1.2,.6),X.timber,x+w/2-.8,R-.1,z-half/2,G);topSpot(x,z,R);break}
  case'bauble':{const s=it.s,c=PALETTE[it.c]||PALETTE[0],m=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.35,roughness:.25,metalness:.3});
    add(new THREE.SphereGeometry(.55*s,16,12),m,x,.55*s,z,G);add(B3(.2*s,.18*s,.2*s),X.gold,x,1.12*s,z,G);advCol.push({x,z,r:.6*s,top:1.2*s});break}
  case'sky':{let m;try{const f=bFac(it.f);m=new THREE.MeshStandardMaterial({map:f.t.clone(),emissiveMap:f.et.clone(),emissive:0xffc27a,emissiveIntensity:.55,roughness:.85});
      [m.map,m.emissiveMap].forEach(q=>{q.needsUpdate=true;q.repeat.set(Math.max(it.w,it.d)/4,(it.h+3)/4)})}catch(e){m=mat(parseInt(BLD_FAC[it.f%5].slice(1),16))}
    boxPlat(x,z,it.w,it.d,it.h,m,X.roof);add(B3(it.w+.3,.35,it.d+.3),X.metal,x,it.h+.05,z,G);topSpot(x,z,it.h);break}
  case'flag':{const h=it.h;add(new THREE.CylinderGeometry(.07,.09,h,10),steel,x,h/2,z,G);add(new THREE.SphereGeometry(.14,10,8),X.gold,x,h+.08,z,G);
    const fl=new THREE.Group();fl.position.set(x,h-.75,z);fl.rotation.y=DIRA(it.dir);G.add(fl);const fm=col(it.c),N=8,strips=[];
    for(let i=0;i<N;i++){const s=add(B3(.23,1.05,.035),i%4===3?X.white:fm,.14+i*.22,0,0,fl);strips.push(s)}
    waves.push({strips,ph:x*.7+z*.3});advCol.push({x,z,r:.3,tree:true,pole:true,y:0,top:h+.05});break}}}
// flags blowing in the wind: each strip ripples a little more the further it is from the pole
function waveFlags(list,t){if(!list)return;for(const w of list){const n=w.strips.length;w.strips.forEach((s,i)=>{const k=(i+1)/n,ph=t*5.5-i*.75+w.ph;
    s.position.z=Math.sin(ph)*.16*k;s.rotation.y=Math.cos(ph)*.45*k;s.position.y=Math.sin(ph*.5)*.04*k})}}
// one glow material shared by every builder lamp (so maps with lots of lamps can be batched)
let LAMP_GLOW=null;const lampGlow=()=>LAMP_GLOW||(LAMP_GLOW=keep(new THREE.MeshStandardMaterial({color:0xffe2a8,emissive:0xffc46b,emissiveIntensity:1.3})));
// add (or replace) a custom map in the Trick Park list; returns its index
function addCustomMap(map){const M=buildCustom(map),i=RUNMAPS.findIndex(q=>q.key===M.key);
  if(i>=0){const old=RUNMAPS[i];if(old===runL&&mode==='run'&&state!=='build'){freeTree(M.grp);return i}freeTree(old.grp);RUNMAPS[i]=M;if(old===runL)runL=M;return i}
  RUNMAPS.push(M);return RUNMAPS.length-1}

// a race flag: white pole, waving cloth (blue checkpoint that turns green when reached; checkered finish flag)
let raceCheckTex=null;
function makeRaceFlag(grp,x,y,z,fin){const g=new THREE.Group();g.position.set(x,y,z);grp.add(g);const h=fin?3.6:2.6;
  add(new THREE.CylinderGeometry(.06,.07,h,8),mat(0xf2f2f2,{roughness:.4}),0,h/2,0,g);
  add(new THREE.SphereGeometry(.1,10,8),mat(fin?0xffd84a:0xd9d9e0,{roughness:.3,metalness:.4}),0,h+.05,0,g);
  add(new THREE.CylinderGeometry(.35,.42,.12,16),mat(0x3a3f47,{roughness:.6}),0,.06,0,g);
  if(fin&&!raceCheckTex&&typeof document!=='undefined'){const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d');
    for(let i=0;i<4;i++)for(let j=0;j<4;j++){q.fillStyle=(i+j)%2?'#111':'#fff';q.fillRect(i*16,j*16,16,16)}raceCheckTex=new THREE.CanvasTexture(c);if(typeof keep==='function')keep(raceCheckTex)}
  const cm=fin?new THREE.MeshStandardMaterial({map:raceCheckTex,roughness:.6,side:THREE.DoubleSide}):mat(0x2f6fd0,{roughness:.6});if(!fin)cm.side=THREE.DoubleSide;
  const pv=new THREE.Group();pv.position.set(0,h-.45,0);g.add(pv);const cloth=add(new THREE.BoxGeometry(fin?1.1:.8,fin?.7:.5,.03),cm,(fin?.55:.4),0,0,pv);
  if(fin){const r=add(new THREE.TorusGeometry(1.1,.07,8,32),new THREE.MeshBasicMaterial({color:0xffd84a,transparent:true,opacity:.7}),0,.08,0,g);r.rotation.x=PI/2;r.castShadow=false}
  return{g,pv,cloth,cm,on:false}}
