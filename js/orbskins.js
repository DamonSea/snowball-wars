// Orb styles: what the collectible orbs look like (Settings > Game > Orb style). Purely cosmetic and local:
// each player sees their own pick. Every style has a normal and a gold version (gold orbs are worth more).
// Shared geometry and materials are built once per style and kept (see KEEP in core.js), so
// removing an orb never frees them.
const ORB_SKINS=[
  {id:'crystal',name:'Crystal'},{id:'donut',name:'Donuts'},{id:'star',name:'Stars'},
  {id:'flake',name:'Snowflakes'},{id:'gift',name:'Presents'},{id:'coin',name:'Coins'}];
let ORB_SKIN='crystal';try{const v=localStorage.getItem('orbRunOrbSkin');if(ORB_SKINS.some(s=>s.id===v))ORB_SKIN=v}catch(e){}
// ring/burst/beam colour per style: [normal, gold]
const ORB_COL={crystal:[0x5ff3ff,0xffcc33],donut:[0xff7fb6,0xffc43a],star:[0xffd21f,0xff8a10],flake:[0xbfeaff,0xffcc33],gift:[0xff4a55,0xffcc33],coin:[0xdfe7f0,0xffc531]};
const orbCol=gold=>(ORB_COL[ORB_SKIN]||ORB_COL.crystal)[gold?1:0];
// spin only around the vertical axis (flat or upright shapes look wrong tumbling)
const ORB_FLAT={donut:1,star:1,flake:1,gift:1,coin:1};

// --- one merged mesh out of many small boxes (sprinkles, snowflake arms, ribbons): one draw call each ---
const v3=(x,y,z)=>({x,y,z}),vadd=(a,b,s=1)=>v3(a.x+b.x*s,a.y+b.y*s,a.z+b.z*s),
  vcross=(a,b)=>v3(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x),vnorm=a=>{const l=Math.hypot(a.x,a.y,a.z)||1;return v3(a.x/l,a.y/l,a.z/l)};
function boxSoup(boxes){const pos=[],nor=[],col=[];
  for(const b of boxes){const ax=[b.a,b.b,b.n],ex=b.e,c=new THREE.Color(b.col);
    for(let i=0;i<3;i++)for(const s of[1,-1]){const j=(i+1)%3,k=(i+2)%3,fc=vadd(b.c,ax[i],s*ex[i]),N=v3(ax[i].x*s,ax[i].y*s,ax[i].z*s);
      const P=(sj,sk)=>vadd(vadd(fc,ax[j],sj*ex[j]),ax[k],sk*ex[k]),q=s>0?[P(-1,-1),P(1,-1),P(1,1),P(-1,1)]:[P(-1,-1),P(-1,1),P(1,1),P(1,-1)];
      for(const t of[0,1,2,0,2,3]){pos.push(q[t].x,q[t].y,q[t].z);nor.push(N.x,N.y,N.z);col.push(c.r,c.g,c.b)}}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(pos),3));
  g.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(nor),3));g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(col),3));return g}
const OX=v3(1,0,0),OY=v3(0,1,0),OZ=v3(0,0,1);
const glow=(col,ei=.5,extra={})=>new THREE.MeshStandardMaterial(Object.assign({color:col,emissive:col,emissiveIntensity:ei,roughness:.5},extra));

// --- the styles: build(gold) returns {geos, mats, make()} once; make() gives a fresh Object3D sharing them ---
const SKIN_BUILD={
  donut(gold){const R=.29,dough=new THREE.TorusGeometry(R,.14,12,28),icing=new THREE.TorusGeometry(R,.152,12,28);
    const mD=new THREE.MeshStandardMaterial({color:0xd99a5b,roughness:.8,emissive:0x5a3010,emissiveIntensity:.35}),
      mI=glow(gold?0xffc43a:0xff7fb6,gold?.6:.32,{roughness:.35});
    // sprinkles scattered over the icing (the upper half of the tube)
    const pal=gold?[0xffffff,0xff7fb6,0xfff3c4]:[0xffffff,0xffe14a,0x5fd0ff,0x7ee06a,0xb57bff,0xff9a3c],bx=[];let seed=gold?7:3;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
    for(let n=0;n<34;n++){const u=rnd()*PI*2,v=.55+rnd()*2.05,rd=v3(Math.cos(u),0,Math.sin(u));
      const c=vadd(vadd(v3(R*Math.cos(u),0,R*Math.sin(u)),rd,.152*Math.cos(v)),OY,.045+.105*Math.sin(v));
      const N=vnorm(vadd(v3(rd.x*Math.cos(v)/.152,0,rd.z*Math.cos(v)/.152),OY,Math.sin(v)/.105)),r=vnorm(v3(rnd()-.5,rnd()-.5,rnd()-.5)),a=vnorm(vcross(N,r)),b=vcross(N,a);
      bx.push({c:vadd(c,N,.006),a,b,n:N,e:[.03,.008,.008],col:pal[Math.floor(rnd()*pal.length)]})}
    const sp=boxSoup(bx),mS=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.4,emissive:0x222222,emissiveIntensity:1});
    return{geos:[dough,icing,sp],mats:[mD,mI,mS],make(){const g=new THREE.Group(),t=new THREE.Group();t.rotation.x=.5;g.add(t);
      const d=new THREE.Mesh(dough,mD);d.rotation.x=-PI/2;const i=new THREE.Mesh(icing,mI);i.rotation.x=-PI/2;i.scale.z=.7;i.position.y=.045;
      t.add(d,i,new THREE.Mesh(sp,mS));d.castShadow=true;return g}}},
  star(gold){const s=new THREE.Shape(),o=.46,n=.2;for(let k=0;k<10;k++){const a=PI/2+k*PI/5,r=k%2?n:o;k?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r)}
    const geo=new THREE.ExtrudeGeometry(s,{depth:.12,bevelEnabled:true,bevelThickness:.045,bevelSize:.035,bevelSegments:1});geo.translate(0,0,-.06);
    const m=glow(gold?0xff7a00:0xffd21f,gold?.28:.3,{roughness:.4});
    return{geos:[geo],mats:[m],make(){const g=new THREE.Group(),me=new THREE.Mesh(geo,m);me.castShadow=true;if(gold)me.scale.setScalar(1.15);g.add(me);return g}}},
  flake(gold){const bx=[],col=gold?0xffd54a:0xe8f7ff;
    for(let k=0;k<6;k++){const a=k*PI/3,d=v3(Math.cos(a),Math.sin(a),0),p=vcross(OZ,d);
      bx.push({c:vadd(v3(0,0,0),d,.22),a:d,b:p,n:OZ,e:[.22,.028,.03],col});
      for(const f of[.2,.31]){const sz=f===.2?.09:.06;for(const sg of[1,-1]){const bd=vnorm(vadd(d,p,sg*1.25)),bp=vcross(OZ,bd);
        bx.push({c:vadd(vadd(v3(0,0,0),d,f),bd,sz),a:bd,b:bp,n:OZ,e:[sz,.022,.026],col})}}}
    bx.push({c:v3(0,0,0),a:OX,b:OY,n:OZ,e:[.06,.06,.04],col});
    const geo=boxSoup(bx),m=new THREE.MeshStandardMaterial({vertexColors:true,emissive:gold?0xe89a10:0x9fdcff,emissiveIntensity:gold?.5:.55,roughness:.25,side:THREE.DoubleSide});
    return{geos:[geo],mats:[m],make(){const g=new THREE.Group(),me=new THREE.Mesh(geo,m);me.castShadow=true;g.add(me);return g}}},
  gift(gold){const body=new THREE.BoxGeometry(.5,.44,.5),rc=gold?0xd8202c:0xffd23c,
    rib=boxSoup([{c:v3(0,0,0),a:OX,b:OY,n:OZ,e:[.258,.226,.06],col:rc},{c:v3(0,0,0),a:OZ,b:OY,n:OX,e:[.258,.226,.06],col:rc}]),
    bow=new THREE.TorusGeometry(.085,.03,6,14);
    const mB=glow(gold?0xffc531:0xe8343a,gold?.55:.3,{roughness:.55}),mR=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.35,emissive:rc,emissiveIntensity:.3}),
      mW=glow(rc,.35,{roughness:.35});
    return{geos:[body,rib,bow],mats:[mB,mR,mW],make(){const g=new THREE.Group(),b=new THREE.Mesh(body,mB);b.castShadow=true;
      const l=new THREE.Mesh(bow,mW),r=new THREE.Mesh(bow,mW);l.position.set(-.08,.27,0);r.position.set(.08,.27,0);l.rotation.y=r.rotation.y=PI/2;l.rotation.x=.5;r.rotation.x=-.5;
      g.add(b,new THREE.Mesh(rib,mR),l,r);return g}}},
  coin(gold){const face=new THREE.CylinderGeometry(.38,.38,.08,28),rim=new THREE.TorusGeometry(.36,.035,6,28),
    m=new THREE.MeshStandardMaterial({color:gold?0xffc531:0xd4dde6,emissive:gold?0xd89a18:0x7d8a98,emissiveIntensity:.5,metalness:.45,roughness:.3});
    return{geos:[face,rim],mats:[m],make(){const g=new THREE.Group(),f=new THREE.Mesh(face,m);f.rotation.x=PI/2;f.castShadow=true;g.add(f,new THREE.Mesh(rim,m));return g}}}};
const SKIN_CACHE={};
function skinKit(id,gold){const k=id+(gold?'G':'');if(!SKIN_CACHE[k]){const s=SKIN_BUILD[id](gold);keep(...s.geos,...s.mats);SKIN_CACHE[k]=s}return SKIN_CACHE[k]}
// the orb's visible body for the current style (the crystal keeps its original per-orb material)
function orbBody(gold){const col=orbCol(gold);
  if(ORB_SKIN==='crystal'||!SKIN_BUILD[ORB_SKIN]){const m=new THREE.Mesh(orbGeo,new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.9,flatShading:true}));m.castShadow=true;return m}
  return skinKit(ORB_SKIN,gold).make()}
// switch style: restyle every orb already out there
function setOrbSkin(id){if(!ORB_SKINS.some(s=>s.id===id))return;ORB_SKIN=id;try{localStorage.setItem('orbRunOrbSkin',id)}catch(e){}
  for(const o of orbs){const nm=orbBody(o.gold),old=o.m;nm.position.y=old.position.y;nm.rotation.y=old.rotation.y;nm.rotation.x=ORB_FLAT[ORB_SKIN]?0:old.rotation.x;
    o.g.remove(old);freeTree(old);o.g.add(nm);o.m=nm;o.col=orbCol(o.gold);
    o.g.children.forEach(c=>{if(c!==nm&&c.material&&c.material.color)c.material.color.setHex(o.col)})}}
