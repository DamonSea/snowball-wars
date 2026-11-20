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
function buildChibi(parent=P){
  const root=new THREE.Group(),hp=new THREE.Group();hp.position.y=.8;root.add(hp);parent.add(root);
  const S=(r,w=14,h=10)=>new THREE.SphereGeometry(r,w,h),Cy=(r,l)=>new THREE.CylinderGeometry(r,r*.9,l,10);
  const sm=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.6,...o});
  const skin=sm(0xe8b087),jacket=sm(0xa8582c,{roughness:.75}),fleece=sm(0xf1e4c6,{roughness:.95}),leather=sm(0x6b3f22,{roughness:.55}),
        pants=sm(0x34405e),boot=sm(0x4a2c18,{roughness:.5}),sole=sm(0xe9dcc0),glove=sm(0xf3e6c8),scarfM=sm(0xe2493b,{roughness:.8}),
        hair=sm(0xd9692b,{roughness:.8}),metal=sm(0x7d858c,{roughness:.3,metalness:.6}),lens=sm(0x9fe3f0,{roughness:.1,emissive:0x1d5a66,emissiveIntensity:.5}),
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
  const smile=add(new THREE.TorusGeometry(.07,.018,6,12,PI),darkM,0,-.2,.41,head);smile.rotation.z=PI;
  // aviator cap with ear flaps
  add(new THREE.SphereGeometry(.475,22,14,0,2*PI,0,PI/2.25),leather,0,.08,-.02,head);
  T(.43,.035,leather,0,.17,0,head).scale.set(1,1.03,1);
  [-1,1].forEach(s=>{const f=add(B(.09,.34,.26),leather,s*.43,-.06,-.02,head);f.rotation.z=s*.12;
    add(S(.035,6,5),metal,s*.47,-.2,.02,head)});
  add(B(.05,.03,.4),leather,0,.55,-.05,head);
  // ginger tufts peeking out at the front
  [[-.14,.0],[0,.06],[.13,-.02]].forEach(([x,t])=>{const c=add(new THREE.ConeGeometry(.06,.18,5),hair,x,.2,.39,head);c.rotation.x=1.9+t;c.rotation.z=-x*2});
  // goggles pushed up on the cap
  T(.465,.025,rib,0,.3,-.01,head,PI/2-.1);
  [-1,1].forEach(s=>{const rim=add(new THREE.TorusGeometry(.085,.03,8,16),metal,s*.12,.33,.37,head);rim.rotation.x=-.45;
    const l=add(new THREE.CylinderGeometry(.075,.075,.03,14),lens,s*.12,.33,.37,head);l.rotation.x=PI/2-.45});
  add(B(.07,.03,.03),metal,0,.33,.39,head);
  return{root,hp,legL:legs[0],legR:legs[1],armL:arms[0],armR:arms[1],head,eyes,scarf,
    mats:{jacket,fleece,leather,pants,boot,sole,glove,scarf:scarfM,metal,lens,rib}};
}
// Nova: backcountry snowboarder. Her own rig with the same interface (root > hp > limbs, head, eyes, mats):
// slouchy beanie with a swinging tip and pom-pom, headphones, curly hair, quilted puffer, baggy snow pants,
// mittens, chunky boots and a snowboard strapped to her back. "pony" is the beanie tip chain (it swings).
function buildNova(parent=P){
  const root=new THREE.Group(),hp=new THREE.Group();hp.position.y=.95;root.add(hp);parent.add(root);
  const S=(r,w=14,h=10)=>new THREE.SphereGeometry(r,w,h),sm=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.6,...o});
  const skin=sm(0x8d5a3b,{roughness:.65}),hair=sm(0x221612,{roughness:.9}),
        jacket=sm(0xf2b33d,{roughness:.7}),rib=sm(0xbf8a2a,{roughness:.8}),fleece=sm(0xfff4dc,{roughness:.95}),leather=sm(0x2f4f8f,{roughness:.95}),
        pants=sm(0x3d4a5c,{roughness:.85}),boot=sm(0x2a2a30,{roughness:.5}),sole=sm(0xf2b33d),glove=sm(0x2f4f8f,{roughness:.9}),
        scarf=sm(0xff5a5f,{roughness:.5}),metal=sm(0x1f2a36,{roughness:.35,metalness:.3}),lens=sm(0x7ff0ff,{roughness:.2,emissive:0x1d6070,emissiveIntensity:.8});
  const T=(r,t,m,x,y,z,par,rx=PI/2,arc=2*PI)=>{const o=add(new THREE.TorusGeometry(r,t,8,24,arc),m,x,y,z,par);o.rotation.x=rx;return o};
  // legs: baggy snow pants, knee patches, chunky boots with a strap
  const legs=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.17,-.22,0);hp.add(g);
    add(new THREE.CylinderGeometry(.14,.17,.46,12),pants,0,-.2,0,g);
    add(B(.16,.13,.05),fleece,0,-.24,.155,g);
    add(S(.19),boot,0,-.53,.05,g).scale.set(1,.78,1.38);
    add(B(.34,.08,.5),sole,0,-.62,.05,g);T(.165,.03,sole,0,-.47,.03,g);return g});
  // quilted puffer jacket: body plus stacked puffs, high collar, zipper
  add(S(.4,18,14),jacket,0,.12,0,hp).scale.set(1,1.05,.88);
  [[-.14,.39],[.08,.41],[.28,.36]].forEach(([y,r])=>T(r,.07,rib,0,y,0,hp).scale.set(1,.88,1));
  T(.21,.1,fleece,0,.47,0,hp);
  add(B(.03,.5,.03),metal,0,.1,.355,hp);
  // snowboard strapped to her back
  const board=new THREE.Group();board.position.set(0,.18,-.42);board.rotation.z=.32;hp.add(board);
  add(B(.32,1.05,.045),metal,0,0,0,board);[-1,1].forEach(e=>add(new THREE.CylinderGeometry(.16,.16,.045,18),metal,0,e*.525,0,board).rotation.x=PI/2);
  add(B(.33,.12,.05),scarf,0,.12,-.002,board);add(B(.33,.05,.05),lens,0,-.05,-.002,board);
  [-1,1].forEach(e=>add(B(.36,.07,.09),sole,0,e*.28,.05,board));
  // arms: puffy sleeves and mittens with thumbs
  const arms=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.42,.32,0);hp.add(g);
    add(S(.135),jacket,0,-.08,0,g);add(S(.125),jacket,0,-.24,0,g);T(.1,.035,rib,0,-.33,0,g);
    add(S(.15),glove,0,-.42,0,g).scale.set(1,1.1,.9);add(S(.06),glove,s*-.1,-.38,.07,g);return g});
  // head
  const head=new THREE.Group();head.position.set(0,.88,0);hp.add(head);
  add(S(.4,20,16),skin,0,0,0,head);
  // curly hair cloud around the back and sides, under the beanie
  for(let i=0;i<11;i++){const a=PI*.62+i*(PI*.76/10),y=-.06+Math.sin(i*1.7)*.05;add(S(.14+(i%3)*.025,10,8),hair,Math.sin(a)*.36,y,Math.cos(a)*.36,head)}
  [-1,1].forEach(s=>add(S(.12,10,8),hair,s*.36,-.17,-.12,head));
  const eyes=[];
  [-1,1].forEach(s=>{
    const e=add(S(.1),sm(0xffffff,{roughness:.3}),s*.14,.0,.34,head);e.scale.set(.9,1.15,.5);eyes.push(e);
    eyes.push(add(S(.056,10,8),sm(0x24140c,{roughness:.2}),s*.135,-.005,.39,head));
    add(S(.017,6,4),sm(0xffffff),s*.115,.035,.425,head);
    const br=add(B(.11,.025,.02),hair,s*.15,.15,.36,head);br.rotation.z=s*-.18;
    add(S(.045,8,6),sm(0xd9776a,{roughness:.8,transparent:true,opacity:.45}),s*.24,-.13,.3,head)});
  add(S(.055),sm(0x7a4a30),0,-.08,.4,head);
  const smile=T(.07,.02,sm(0x5e2722),0,-.19,.36,head,0,PI);smile.rotation.z=PI;
  // slouchy beanie with rib band; the tip and pom-pom swing (chain in "pony")
  add(new THREE.SphereGeometry(.43,22,14,0,2*PI,0,PI/2.1),leather,0,.06,-.01,head);
  T(.41,.065,leather,0,.08,-.01,head).scale.set(1,1.02,1);
  const pony=[];let pp=head,py0=.4,pz0=-.12;
  [[.17,.2],[.12,.16]].forEach(([r,h],i)=>{const g=new THREE.Group();g.position.set(0,py0,pz0);pp.add(g);
    add(S(r,12,10),leather,0,-h*.5,0,g).scale.set(1,1.2,1);pony.push(g);pp=g;py0=-h;pz0=0});
  {const g=new THREE.Group();g.position.set(0,-.18,0);pp.add(g);add(S(.1,10,8),scarf,0,-.06,0,g);pony.push(g)}
  // headphones over the beanie
  T(.47,.03,scarf,0,.04,0,head,0,PI);
  [-1,1].forEach(s=>{const c=add(new THREE.CylinderGeometry(.12,.12,.09,16),scarf,s*.44,-.03,0,head);c.rotation.z=PI/2;
    const l=add(new THREE.CylinderGeometry(.065,.065,.02,14),lens,s*.495,-.03,0,head);l.rotation.z=PI/2});
  return{root,hp,legL:legs[0],legR:legs[1],armL:arms[0],armR:arms[1],head,eyes,pony,hsYo:.21,
    mats:{jacket,fleece,leather,pants,boot,sole,glove,scarf,metal,lens,rib}};
}
const F=buildChibi(),NV=buildNova();
// ---------- Flip's wardrobe ----------
const OUTFITS=[
  {name:'Stunt Pilot',jacket:0xa8582c,fleece:0xf1e4c6,leather:0x6b3f22,pants:0x34405e,boot:0x4a2c18,sole:0xe9dcc0,glove:0xf3e6c8,scarf:0xe2493b,lens:0x9fe3f0,lensE:0x1d5a66,metal:0x7d858c},
  {name:'Night Flyer',jacket:0x2a3048,fleece:0x8a93a8,leather:0x1b1e28,pants:0x1e2230,boot:0x15171d,sole:0x2bb3a8,glove:0x3a4058,scarf:0x2bb3a8,lens:0xffd84a,lensE:0x6b4a00,metal:0x2f333a},
  {name:'Racer',jacket:0xd83a2e,fleece:0xffffff,leather:0xf4f4f4,pants:0x1f1f24,boot:0xf4f4f4,sole:0xd83a2e,glove:0x1f1f24,scarf:0xffd84a,lens:0x3a3f45,lensE:0x000000,metal:0xc8ccd0},
  {name:'Arctic',jacket:0xe9eff2,fleece:0xffffff,leather:0x7fb3d9,pants:0x5d7a91,boot:0x8a9aa6,sole:0x3d4a55,glove:0x7fb3d9,scarf:0xff8a3d,lens:0xb8f0ff,lensE:0x2a6a80,metal:0xa0a8b0},
  {name:'Golden Ace',jacket:0xd9a630,fleece:0xfff4d6,leather:0x3a2a1a,pants:0x2a2a30,boot:0x3a2a1a,sole:0xd9a630,glove:0xffffff,scarf:0xffffff,lens:0xffd84a,lensE:0x8a5a00,metal:0xd9a630,shiny:true,lock:'Beat Sky Gauntlet to unlock'}];
// Nova's wardrobe (jacket / beanie+mittens = leather+glove / headphones+pom = scarf / board = metal)
const OUTFITS_NOVA=[
  {name:'Backcountry',jacket:0xf2b33d,fleece:0xfff4dc,leather:0x2f4f8f,pants:0x3d4a5c,boot:0x2a2a30,sole:0xf2b33d,glove:0x2f4f8f,scarf:0xff5a5f,lens:0x7ff0ff,lensE:0x1d6070,metal:0x1f2a36},
  {name:'Neon Night',jacket:0x1f1f2e,fleece:0x8a5cff,leather:0x8a5cff,pants:0x2a2a3a,boot:0x15151d,sole:0x39ff88,glove:0x39ff88,scarf:0xff3fb4,lens:0xff3fb4,lensE:0x80104f,metal:0x39ff88},
  {name:'Glacier',jacket:0xbfe6ff,fleece:0xffffff,leather:0xffffff,pants:0x5d7a91,boot:0x8a9aa6,sole:0xffffff,glove:0x7fb3d9,scarf:0x2f6fd0,lens:0xb8f0ff,lensE:0x2a6a80,metal:0xe9f6ff},
  {name:'Ember',jacket:0xd8452e,fleece:0x2a2a2a,leather:0x2a2a2a,pants:0x3a3330,boot:0x2a2220,sole:0xffb347,glove:0x2a2a2a,scarf:0xffb347,lens:0xffb347,lensE:0x804000,metal:0x2a2a2a},
  {...OUTFITS[4],name:'Gold Rush'}];
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
chars.push({name:'Nova',desc:'A fearless backcountry snowboarder with a board on her back and beats in her ears. Same trick moveset as Flip.',speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:NV.root,rig:NV,outs:OUTFITS_NOVA,ofKey:'orbRunOutfitNova',acro:true,moves:chars[2].moves});
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
