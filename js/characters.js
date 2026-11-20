// Characters: the player root P and the three rigs (Sunny the robot, Rook the explorer,
// Flip the stunt pilot), Flip's wardrobe, the character table and Flip's move state A.
// Builders take a parent so multiplayer can make copies for other players.
// ---------- player ----------
const P=new THREE.Group();scene.add(P);
function buildBot(parent){const body=new THREE.Group();parent.add(body);
add(new THREE.SphereGeometry(.6,16,12),mat(0xffd84a,{roughness:.6}),0,.72,0,body).scale.set(1,1.08,1);
add(new THREE.BoxGeometry(.78,.36,.3),mat(0x1d2b33,{roughness:.3}),0,.85,.45,body);
const eyeM=new THREE.MeshBasicMaterial({color:0x5ff3ff});
[-.17,.17].forEach(x=>add(new THREE.SphereGeometry(.07,8,6),eyeM,x,.86,.6,body));
add(new THREE.CylinderGeometry(.03,.03,.4,5),mat(0x444444),0,1.5,0,body);
add(new THREE.SphereGeometry(.1,8,6),new THREE.MeshBasicMaterial({color:0xff5a4e}),0,1.72,0,body);
const feet=[-.25,.25].map(x=>add(new THREE.SphereGeometry(.18,8,6),mat(0xe0a92a),x,.15,0,body));return{body,feet}}
const _bot=buildBot(P),body=_bot.body,feet=_bot.feet;
// humanoid builder: root (feet) > hp (hip pivot, for leans and flips) > limbs
const darkM=mat(0x1d1a18),B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
function buildHuman(c,parent=P){
  const root=new THREE.Group(),hp=new THREE.Group();hp.position.y=.9;root.add(hp);parent.add(root);
  const skin=mat(c.skin,{roughness:.7}),top=mat(c.top,{roughness:.7}),pant=mat(c.pant),shoe=mat(c.shoe);
  const limb=(x,y,len,w,m,end,endM,ez)=>{const g=new THREE.Group();g.position.set(x,y-.9,0);hp.add(g);
    add(B(w,len,w*1.1),m,0,-len/2,0,g);add(end,endM,0,-len-.04,ez,g);return g};
  const legL=limb(-.15,.86,.74,.22,pant,B(.24,.12,.34),shoe,.05),legR=limb(.15,.86,.74,.22,pant,B(.24,.12,.34),shoe,.05);
  add(B(.56,.62,.32),top,0,.27,0,hp);add(B(.58,.1,.34),darkM,0,0,0,hp);
  const armL=limb(-.37,1.44,.58,.16,top,new THREE.SphereGeometry(.09,8,6),skin,0),armR=limb(.37,1.44,.58,.16,top,new THREE.SphereGeometry(.09,8,6),skin,0);
  const head=new THREE.Group();head.position.set(0,.82,0);hp.add(head);
  add(B(.4,.42,.38),skin,0,0,0,head);
  [-.09,.09].forEach(x=>add(B(.06,.08,.02),darkM,x,.02,.2,head));
  add(B(.12,.03,.02),mat(0x8a4a3a),0,-.1,.2,head);
  return{root,hp,legL,legR,armL,armR,head};
}
// Rook: explorer
const capM=mat(0xff8a3d);
function buildRook(parent){const R=buildHuman({skin:0xc98e5e,top:0x2bb3a8,pant:0x2f3e66,shoe:0x22262b},parent);
add(B(.44,.16,.42),capM,0,.22,0,R.head);add(B(.44,.05,.2),capM,0,.15,.28,R.head);add(B(.42,.12,.08),darkM,0,.1,-.18,R.head);
add(B(.42,.46,.2),capM,0,.3,-.26,R.hp);add(B(.46,.06,.06),darkM,0,.48,-.37,R.hp);return R}
const R=buildRook(P);
// Flip: pint-sized stunt pilot. Same rig interface (root > hp > limbs), chunky mascot proportions
// fem: Skye, Flip's sister: same rig, plus ponytail, bangs, side locks, lashes and rosy lips
function buildChibi(parent=P,fem=false){
  const root=new THREE.Group(),hp=new THREE.Group();hp.position.y=.8;root.add(hp);parent.add(root);
  const S=(r,w=14,h=10)=>new THREE.SphereGeometry(r,w,h),Cy=(r,l)=>new THREE.CylinderGeometry(r,r*.9,l,10);
  const sm=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.6,...o});
  const skin=sm(0xe8b087),jacket=sm(0xa8582c,{roughness:.75}),fleece=sm(0xf1e4c6,{roughness:.95}),leather=sm(0x6b3f22,{roughness:.55}),
        pants=sm(0x34405e),boot=sm(0x4a2c18,{roughness:.5}),sole=sm(0xe9dcc0),glove=sm(0xf3e6c8),scarfM=sm(0xe2493b,{roughness:.8}),
        hair=sm(fem?0x7a2e1a:0xd9692b,{roughness:.8}),metal=sm(0x7d858c,{roughness:.3,metalness:.6}),lens=sm(0x9fe3f0,{roughness:.1,emissive:0x1d5a66,emissiveIntensity:.5}),
        freck=sm(0xc0794d),rib=sm(0x8a4521,{roughness:.8});
  const T=(r,t,m,x,y,z,parent,rx=PI/2)=>{const o=add(new THREE.TorusGeometry(r,t,8,24),m,x,y,z,parent);o.rotation.x=rx;return o};
  // legs + boots
  const legs=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.17,-.25,0);hp.add(g);
    add(Cy(.12,.26),pants,0,-.13,0,g);
    add(S(.2),boot,0,-.34,.08,g).scale.set(1,.7,1.45);
    add(B(.32,.07,.52),sole,0,-.45,.08,g);T(.12,.03,boot,0,-.24,0,g);return g});
  // bomber jacket
  add(S(.42,18,14),jacket,0,.08,0,hp).scale.set(1,.95,.9);
  T(.36,.06,rib,0,-.2,0,hp).scale.set(1,.92,1);
  T(.24,.09,fleece,0,.36,-.01,hp);
  add(B(.035,.42,.03),metal,0,.06,.385,hp);
  [-1,1].forEach(s=>{const pk=add(B(.14,.1,.04),rib,s*.2,-.03,.35,hp);pk.rotation.y=s*.35});
  // arms + gloves
  const arms=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.44,.3,0);hp.add(g);
    add(Cy(.1,.28),jacket,0,-.14,0,g);T(.1,.035,rib,0,-.27,0,g);
    add(S(.16),glove,0,-.38,0,g);return g});
  // scarf: chain of segments hanging from the back of the neck
  const scarf=[];let sp=hp,sy=.45,sz=-.24;
  T(.22,.055,scarfM,0,.46,0,hp);
  for(let i=0;i<5;i++){const g=new THREE.Group();g.position.set(i?0:.08,sy,sz);sp.add(g);
    add(B(.16-i*.012,.17,.05),scarfM,0,-.085,0,g);scarf.push(g);sp=g;sy=-.17;sz=0}
  // head
  const head=new THREE.Group();head.position.set(0,.84,0);hp.add(head);
  add(S(.45,20,16),skin,0,0,0,head);
  const eyes=[];
  [-1,1].forEach(s=>{
    const e=add(S(.11),sm(0xffffff,{roughness:.3}),s*.14,0,.39,head);e.scale.set(.85,1.25,.5);eyes.push(e);
    eyes.push(add(S(.058,10,8),sm(0x2a1a10,{roughness:.2}),s*.13,0,.44,head));
    add(S(.018,6,4),sm(0xffffff),s*.11,.04,.475,head);
    [[.0,0],[.05,.04],[.05,-.03]].forEach(([dx,dy])=>add(S(.015,5,4),freck,s*(.25+dx),-.12+dy,.37-dx*.4,head));
    add(S(.05,8,6),sm(0xef9a85,{roughness:.8,transparent:true,opacity:.55}),s*.27,-.14,.33,head);
  });
  add(S(.075),sm(0xd99a70),0,-.09,.45,head);
  const smile=add(new THREE.TorusGeometry(.07,.018,6,12,PI),fem?sm(0xc94a63,{roughness:.5}):darkM,0,-.2,.41,head);smile.rotation.z=PI;
  // aviator cap with ear flaps
  add(new THREE.SphereGeometry(.475,22,14,0,2*PI,0,PI/2.25),leather,0,.08,-.02,head);
  T(.43,.035,leather,0,.17,0,head).scale.set(1,1.03,1);
  [-1,1].forEach(s=>{const f=add(B(.09,.34,.26),leather,s*.43,-.06,-.02,head);f.rotation.z=s*.12;
    add(S(.035,6,5),metal,s*.47,-.2,.02,head)});
  add(B(.05,.03,.4),leather,0,.55,-.05,head);
  let pony=null;
  if(!fem){
  // ginger tufts peeking out at the front
  [[-.14,.0],[0,.06],[.13,-.02]].forEach(([x,t])=>{const c=add(new THREE.ConeGeometry(.06,.18,5),hair,x,.2,.39,head);c.rotation.x=1.9+t;c.rotation.z=-x*2});
  }else{
    // side-swept bangs under the cap brim
    [[-.21,.13,.5],[-.08,.17,.3],[.06,.18,.15],[.19,.14,-.1]].forEach(([x,y,r])=>{const b=add(S(.11,10,8),hair,x,y,.37-Math.abs(x)*.25,head);b.scale.set(1.25,.55,.5);b.rotation.z=r});
    // locks in front of the ear flaps
    [-1,1].forEach(s=>{const l=add(new THREE.CylinderGeometry(.05,.035,.32,8),hair,s*.37,-.17,.17,head);l.rotation.z=s*.12;l.rotation.x=-.15});
    // lashes at the outer corners
    const lash=sm(0x2a1a10,{roughness:.4});
    [-1,1].forEach(s=>[[.2,.1,.9],[.225,.055,1.25]].forEach(([x,y,r])=>{const q=add(B(.07,.018,.018),lash,s*x,y,.42,head);q.rotation.z=-s*r}));
    // ponytail swinging out the back of the cap, with a hair tie
    pony=[];let pp=head,py0=.04,pz0=-.43;
    T(.075,.03,scarfM,0,.04,-.42,head);
    for(let i=0;i<4;i++){const g=new THREE.Group();g.position.set(0,py0,pz0);pp.add(g);
      add(S(.13-i*.018,10,8),hair,0,-.09,0,g).scale.set(1,1.5,.9);pony.push(g);pp=g;py0=-.17;pz0=0}
  }
  // goggles pushed up on the cap
  T(.465,.025,rib,0,.3,-.01,head,PI/2-.1);
  [-1,1].forEach(s=>{const rim=add(new THREE.TorusGeometry(.085,.03,8,16),metal,s*.12,.33,.37,head);rim.rotation.x=-.45;
    const l=add(new THREE.CylinderGeometry(.075,.075,.03,14),lens,s*.12,.33,.37,head);l.rotation.x=PI/2-.45});
  add(B(.07,.03,.03),metal,0,.33,.39,head);
  return{root,hp,legL:legs[0],legR:legs[1],armL:arms[0],armR:arms[1],head,eyes,scarf,pony,
    mats:{jacket,fleece,leather,pants,boot,sole,glove,scarf:scarfM,metal,lens,rib}};
}
const F=buildChibi(),SK=buildChibi(P,true);
// ---------- Flip's wardrobe ----------
const OUTFITS=[
  {name:'Stunt Pilot',jacket:0xa8582c,fleece:0xf1e4c6,leather:0x6b3f22,pants:0x34405e,boot:0x4a2c18,sole:0xe9dcc0,glove:0xf3e6c8,scarf:0xe2493b,lens:0x9fe3f0,lensE:0x1d5a66,metal:0x7d858c},
  {name:'Night Flyer',jacket:0x2a3048,fleece:0x8a93a8,leather:0x1b1e28,pants:0x1e2230,boot:0x15171d,sole:0x2bb3a8,glove:0x3a4058,scarf:0x2bb3a8,lens:0xffd84a,lensE:0x6b4a00,metal:0x2f333a},
  {name:'Racer',jacket:0xd83a2e,fleece:0xffffff,leather:0xf4f4f4,pants:0x1f1f24,boot:0xf4f4f4,sole:0xd83a2e,glove:0x1f1f24,scarf:0xffd84a,lens:0x3a3f45,lensE:0x000000,metal:0xc8ccd0},
  {name:'Arctic',jacket:0xe9eff2,fleece:0xffffff,leather:0x7fb3d9,pants:0x5d7a91,boot:0x8a9aa6,sole:0x3d4a55,glove:0x7fb3d9,scarf:0xff8a3d,lens:0xb8f0ff,lensE:0x2a6a80,metal:0xa0a8b0},
  {name:'Golden Ace',jacket:0xd9a630,fleece:0xfff4d6,leather:0x3a2a1a,pants:0x2a2a30,boot:0x3a2a1a,sole:0xd9a630,glove:0xffffff,scarf:0xffffff,lens:0xffd84a,lensE:0x8a5a00,metal:0xd9a630,shiny:true,lock:'Beat Sky Gauntlet to unlock'}];
// Skye's wardrobe (same keys; Golden Ace unlocks the same way)
const OUTFITS_SKYE=[
  {name:'Sky Ace',jacket:0x6a4bb0,fleece:0xf6ead2,leather:0x3e2a4a,pants:0x2f3552,boot:0x3b2638,sole:0xf6ead2,glove:0xf6ead2,scarf:0x2bb3a8,lens:0xffb3e0,lensE:0x6a2a55,metal:0xb8a9c9},
  {name:'Sunrise',jacket:0xff7a59,fleece:0xfff1e0,leather:0x6b3f22,pants:0x3a3550,boot:0x4a2c18,sole:0xffd84a,glove:0xfff1e0,scarf:0xffd84a,lens:0xffd84a,lensE:0x6b4a00,metal:0xc8a070},
  {name:'Aurora',jacket:0x2bb3a8,fleece:0xe8fff9,leather:0x1d3d4a,pants:0x24324a,boot:0x1d3d4a,sole:0x9fe3f0,glove:0xe8fff9,scarf:0xb48cff,lens:0xb8f0ff,lensE:0x2a6a80,metal:0x8fb3c0},
  {name:'Snow Bunny',jacket:0xf7f2f5,fleece:0xffffff,leather:0xe58fb4,pants:0xc9d6e3,boot:0xe58fb4,sole:0xffffff,glove:0xffd3e6,scarf:0xe2493b,lens:0xffd3e6,lensE:0x803050,metal:0xd8dde2},
  {...OUTFITS[4]}];
const unlocked=(o,list=OUTFITS)=>!list[o].lock||!!bestA.orbRunAdv2;
const OFI={}; // each wardrobe character's current outfit, by character index
function applyOutfit(i){const c=chars[ci];if(c.outs)applyOutfitTo(c.rig.mats,i,c.outs)}
function applyOutfitTo(M,i,list=OUTFITS){const o=list[i];
  ['jacket','fleece','leather','pants','boot','sole','glove','scarf','metal','lens'].forEach(k=>M[k].color.setHex(o[k]));
  M.lens.emissive.setHex(o.lensE);M.rib.color.setHex(o.jacket).multiplyScalar(.78);
  M.jacket.metalness=o.shiny?.55:0;M.jacket.roughness=o.shiny?.35:.75;M.rib.metalness=o.shiny?.4:0;}
const chars=[
  {name:'Sunny',desc:'A bouncy little robot. Springy legs give the highest jump.',speed:1,jump:9,sp:3,jp:5,ag:2,g:body},
  {name:'Rook',desc:'A quick-footed island explorer. Fastest runner, shorter hop.',speed:1.15,jump:7.8,sp:5,jp:3,ag:3,g:R.root,rig:R},
  {name:'Flip',desc:'A pint-sized stunt pilot who plays by momentum. Harder to steer, full of tricks.',speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:F.root,rig:F,outs:OUTFITS,ofKey:'orbRunOutfit',acro:true,
   moves:'Shift: crouch · Crouch + Jump: long jump (running) or backflip (standing) · Shift in the air: dive · Jump off a wall mid-air: wall jump · Jump as you land: double and triple jump · Reverse at speed to skid, Jump mid-skid to side flip'}];
chars.push({name:'Skye',desc:"Flip's sister and wingmate. Same daredevil moveset, and she never misses a landing.",speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:SK.root,rig:SK,outs:OUTFITS_SKYE,ofKey:'orbRunOutfitSkye',acro:true,moves:chars[2].moves});
chars.forEach((c,i)=>{if(!c.outs)return;let v=0;try{v=+localStorage.getItem(c.ofKey)||0}catch(e){}if(!c.outs[v])v=0;OFI[i]=v;applyOutfitTo(c.rig.mats,v,c.outs)});
const A={wallT:0,lock:0,wnx:0,wnz:0,spd:0,mode:'normal',t:0,air:false,landT:0,jumpN:0,canCut:false,canDive:true,prevC:false,flipT:99,flipAxis:'x',flipDir:1,knock:0,skidTo:0,twirlT:99};
const resetAcro=()=>Object.assign(A,{wallT:0,lock:0,spd:0,mode:'normal',t:0,air:false,landT:0,jumpN:0,canCut:false,canDive:true,flipT:99,knock:0,twirlT:99});
let jumpBuf=0;
const fxM=new THREE.MeshBasicMaterial({color:0xffcc33,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
const fxRing=new THREE.Mesh(new THREE.RingGeometry(.35,.55,32),fxM);fxRing.rotation.x=-PI/2;fxRing.visible=false;scene.add(fxRing);let fxT=0;
function readyRing(){fxRing.position.set(P.position.x,py+.06,P.position.z);fxT=.3;fxRing.visible=true}
function trail(col,n=1){for(let i=0;i<n;i++){const m=new THREE.Mesh(partGeo,new THREE.MeshBasicMaterial({color:col,transparent:true}));
  m.position.set(P.position.x+(Math.random()-.5)*.4,py+.5+Math.random()*.9,P.position.z+(Math.random()-.5)*.4);scene.add(m);
  parts.push({m,v:V(-vel.x*.15,.2,-vel.z*.15),life:.35})}}
// Flip is the lead: default pick, first in the select order. Sunny and Rook remain as alternates.
const ORDER=[2,3,0,1];let ci=2;try{const v=localStorage.getItem('orbRunPick');if(v!==null&&chars[+v])ci=+v}catch(e){}let pickCi=ci;
let wave=0,bank=0,squash=0,airVy=0,wasG=true,lastFace=0;
