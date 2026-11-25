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
  const pantsLegs=[];
  const legs=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.17,-.25,0);hp.add(g);
    pantsLegs.push(add(Cy(.12,.26),pants,0,-.13,0,g));
    add(S(.2),boot,0,-.34,.08,g).scale.set(1,.7,1.45);
    add(B(.32,.07,.52),sole,0,-.45,.08,g);T(.12,.03,boot,0,-.24,0,g);return g});
  // bomber jacket
  add(S(.42,18,14),jacket,0,.08,0,hp).scale.set(1,.95,.9);
  T(.36,.06,rib,0,-.2,0,hp).scale.set(1,.92,1);
  const collar=T(.24,.09,fleece,0,.36,-.01,hp);
  const zip=add(B(.035,.42,.03),metal,0,.06,.385,hp);
  const pockets=[-1,1].map(s=>{const pk=add(B(.14,.1,.04),rib,s*.2,-.03,.35,hp);pk.rotation.y=s*.35;return pk});
  // arms + gloves
  const sleeves=[],cuffs=[];
  const arms=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.44,.3,0);hp.add(g);
    sleeves.push(add(Cy(.1,.28),jacket,0,-.14,0,g));cuffs.push(T(.1,.035,rib,0,-.27,0,g));
    add(S(.16),glove,0,-.38,0,g);return g});
  // scarf: chain of segments hanging from the back of the neck
  const scarf=[];let sp=hp,sy=.45,sz=-.24;
  const scarfRing=T(.22,.055,scarfM,0,.46,0,hp);
  for(let i=0;i<5;i++){const g=new THREE.Group();g.position.set(i?0:.08,sy,sz);sp.add(g);
    add(B(.16-i*.012,.17,.05),scarfM,0,-.085,0,g);scarf.push(g);sp=g;sy=-.17;sz=0}
  // head
  const head=new THREE.Group();head.position.set(0,.84,0);hp.add(head);
  add(S(.45,20,16),skin,0,0,0,head);
  // ---- face: every style is built once and shown or hidden (applyFace). Blinking scales whatever is in `eyes`. ----
  const FACE={eyes:{},mouth:{},brows:{},freckles:[],blush:[],nose:[]},grp=(set,k)=>{const g=new THREE.Group();head.add(g);set[k]=g;return g};
  const white=sm(0xffffff,{roughness:.3}),pupilM=sm(0x2a1a10,{roughness:.2}),glintM=sm(0xffffff),lidM=skin;
  const blinkOf={};   // style -> meshes that close on a blink (each remembers its open height in _by)
  const eyeBase=(g,st,lid,tilt=0,py=0)=>{blinkOf[st]=[];[-1,1].forEach(s=>{
      const e=add(S(.11),white,s*.14,0,.39,g);e.scale.set(.85,1.25,.5);e._by=1.25;blinkOf[st].push(e);
      const p=add(S(.058,10,8),pupilM,s*.13,py,.44,g);p._by=1;blinkOf[st].push(p);add(S(.018,6,4),glintM,s*.11,.04+py,.475,g);
      if(lid){const l=add(new THREE.SphereGeometry(.118,14,8,0,2*PI,0,PI*lid),lidM,s*.14,0,.392,g);l.scale.set(.88,1.28,.56);l.rotation.z=s*tilt;
        const lash=add(B(.2,.022,.03),darkM,s*.14,.135*Math.cos(PI*lid)/.9,.445,g);lash.rotation.z=s*tilt}})};
  // eyes: big and round (the original) / relaxed (half-lidded) / focused (lids slanting in) / happy (closed arcs) /
  // chill (flat lines) / beady (small dark ovals)
  eyeBase(grp(FACE.eyes,'round'),'round',0);
  eyeBase(grp(FACE.eyes,'relaxed'),'relaxed',.43,0,-.025);
  eyeBase(grp(FACE.eyes,'focused'),'focused',.4,.38,-.01);
  {const g=grp(FACE.eyes,'happy');blinkOf.happy=[];[-1,1].forEach(s=>{const a=add(new THREE.TorusGeometry(.065,.022,6,12,PI),darkM,s*.14,-.01,.43,g)})}
  {const g=grp(FACE.eyes,'chill');blinkOf.chill=[];[-1,1].forEach(s=>{const l=add(B(.13,.026,.03),darkM,s*.14,-.01,.435,g);l.rotation.z=-s*.12})}
  {const g=grp(FACE.eyes,'beady');blinkOf.beady=[];[-1,1].forEach(s=>{const d=add(S(.05,10,8),pupilM,s*.13,0,.43,g);d.scale.set(.8,1.3,.6);d._by=1.3;blinkOf.beady.push(d);add(S(.013,6,4),glintM,s*.115,.03,.475,g)})}
  // brows (in his hair color): none / soft arcs / bold / raised / worried
  grp(FACE.brows,'none');
  [['soft',.016,.11,.148,0],['bold',.028,.13,.148,.1],['raised',.018,.11,.155,-.2],['worried',.02,.11,.148,-.35]].forEach(([k,th,w,y,rz])=>{const g=grp(FACE.brows,k);
    [-1,1].forEach(s=>{const b=add(B(w,th*2,.03),hair,s*.14,y,.43,g);b.rotation.z=s*rz;b.rotation.x=-.3})});   // just under the cap's edge
  // mouths: smile (the original) / calm / grin / smirk / flat / "o" / none
  {const g=grp(FACE.mouth,'smile');const m=add(new THREE.TorusGeometry(.07,.018,6,12,PI),darkM,0,-.2,.41,g);m.rotation.z=PI}
  {const g=grp(FACE.mouth,'calm');const m=add(new THREE.TorusGeometry(.05,.014,6,12,PI*.8),darkM,0,-.19,.425,g);m.rotation.z=PI*1.1}
  {const g=grp(FACE.mouth,'grin');const m=add(new THREE.CircleGeometry(.085,16,PI,PI),darkM,0,-.17,.425,g);m.rotation.x=-.25;
    const t=add(B(.12,.025,.01),white,0,-.18,.43,g);t.rotation.x=-.25}
  {const g=grp(FACE.mouth,'smirk');const m=add(new THREE.TorusGeometry(.06,.016,6,12,PI*.6),darkM,.04,-.19,.42,g);m.rotation.z=PI*1.25}
  {const g=grp(FACE.mouth,'flat');add(B(.1,.02,.02),darkM,0,-.2,.42,g)}
  {const g=grp(FACE.mouth,'o');const m=add(S(.035,10,8),darkM,0,-.2,.42,g);m.scale.set(1,1.2,.5)}
  grp(FACE.mouth,'none');
  // freckles, blush and nose can be switched off
  [-1,1].forEach(s=>{
    [[.0,0],[.05,.04],[.05,-.03]].forEach(([dx,dy])=>FACE.freckles.push(add(S(.015,5,4),freck,s*(.25+dx),-.12+dy,.37-dx*.4,head)));
    FACE.blush.push(add(S(.05,8,6),sm(0xef9a85,{roughness:.8,transparent:true,opacity:.55}),s*.27,-.14,.33,head))});
  FACE.nose.push(add(S(.075),sm(0xd99a70),0,-.09,.45,head));
  for(const k of ['eyes','brows','mouth'])for(const st in FACE[k])FACE[k][st].visible=st===({eyes:'round',brows:'none',mouth:'smile'})[k];
  const eyes=blinkOf.round;
  // aviator cap with ear flaps
  const capParts=[add(new THREE.SphereGeometry(.475,22,14,0,2*PI,0,PI/2.25),leather,0,.08,-.02,head)];
  {const t=T(.43,.035,leather,0,.17,0,head);t.scale.set(1,1.03,1);capParts.push(t)}
  [-1,1].forEach(s=>{const f=add(B(.09,.34,.26),leather,s*.43,-.06,-.02,head);f.rotation.z=s*.12;
    capParts.push(f,add(S(.035,6,5),metal,s*.47,-.2,.02,head))});
  capParts.push(add(B(.05,.03,.4),leather,0,.55,-.05,head));
  // goggles pushed up on the cap
  const gogG=new THREE.Group();head.add(gogG);
  const gog=[T(.465,.025,rib,0,.3,-.01,gogG,PI/2-.1)];
  [-1,1].forEach(s=>{const rim=add(new THREE.TorusGeometry(.085,.03,8,16),metal,s*.12,.33,.37,gogG);rim.rotation.x=-.45;
    const l=add(new THREE.CylinderGeometry(.075,.075,.03,14),lens,s*.12,.33,.37,gogG);l.rotation.x=PI/2-.45;gog.push(rim,l)});
  gog.push(add(B(.07,.03,.03),metal,0,.33,.39,gogG));
  // ---- outfit-only pieces, hidden unless an outfit shows them (OUTFITS .show / .hide / .shorts) ----
  const parts={cap:capParts,goggles:gog,gogStrap:[gog[0]],scarf:[scarfRing,scarf[0]],collar:[collar],zip:[zip],pockets,cuffs};
  // hair when the cap is off: a tousled ginger mop made of chunky locks (two shades for depth) over a snug base,
  // fuller at the back, short at the sides so the ears show, with a fringe falling over his forehead
  const dark=sm(0xb5521d,{roughness:.85});
  {const g=new THREE.Group();head.add(g);const LS=new THREE.SphereGeometry(1,10,8);
    const base=add(new THREE.SphereGeometry(.47,22,14,0,2*PI,0,PI*.5),hair,0,.02,-.03,g);base.rotation.x=-.42;base.scale.set(1.02,1,1.03);
    // lock(x,y,z, size, length, tip direction): an egg-shaped clump stretched toward its tip, hung from a pivot at its
    // root so it can swing (hairPhysics)
    const locks=[];
    const lock=(x,y,z,r,len,dx,dy,dz,m=hair)=>{const L=Math.hypot(dx,dy,dz)||1,t=[dx/L,dy/L,dz/L],h=len*.55;
      const pv=new THREE.Group();pv.position.set(x-t[0]*h,y-t[1]*h,z-t[2]*h);g.add(pv);pv._t=t;pv._w=len/.2;pv._ph=locks.length*1.7;locks.push(pv);
      const o=add(LS,m,t[0]*h,t[1]*h,t[2]*h,pv);o.scale.set(r,r*.78,len);o.rotation.order='YXZ';o.rotation.set(-Math.asin(t[1]),Math.atan2(t[0],t[2]),0);return o};
    // crown and back: locks fanning back and down from the top of the head
    for(let i=0;i<9;i++){const a=PI*.55+i/8*PI*.9,c=Math.cos(a),s=Math.sin(a);
      lock(s*.3,.3-Math.abs(c)*.05,c*.3-.06,.15,.24,s*.5,-.35,c,i%2?dark:hair)}
    for(let i=0;i<7;i++){const a=PI*.72+i/6*PI*.56,c=Math.cos(a),s=Math.sin(a);lock(s*.36,.05,c*.36-.04,.14,.2,s*.6,-.7,c,i%2?hair:dark)}
    // top: a few locks sticking up and back for some bounce
    [[-.12,.47,-.02,.5,1,-.4],[.08,.49,.06,-.2,1,-.2],[.2,.42,-.12,.5,.9,-.6],[-.24,.4,-.14,-.6,.8,-.6]].forEach(([x,y,z,dx,dy,dz],i)=>lock(x,y,z,.12,.19,dx,dy,dz,i%2?dark:hair));
    // sides: short, above the ears
    [-1,1].forEach(s=>{lock(s*.4,.2,.06,.11,.16,s*.7,-.6,.3);lock(s*.41,.12,-.12,.11,.16,s*.6,-.8,-.2,dark)});
    // fringe: locks falling straight down over the forehead (fanning out a little), stopping just above the brows
    [[-.25,.31,.3,-.35,-1,.45,.11,.16],[-.09,.34,.35,-.1,-1,.5,.12,.18],[.08,.34,.35,.1,-1,.5,.12,.18],[.24,.31,.3,.35,-1,.45,.11,.16]].forEach(([x,y,z,dx,dy,dz,r,l],i)=>lock(x,y,z,r,l,dx,dy,dz,i%2?dark:hair));
    parts.hair=[g];g._locks=locks}
  // summer: sunglasses, bare forearms under short sleeves and bare calves under the shorts
  {const m=sm(0x14151a,{roughness:.12,metalness:.35}),g=new THREE.Group();g.position.set(0,.03,.46);head.add(g);
    [-1,1].forEach(s=>{const l=add(B(.18,.12,.04),m,s*.14,0,0,g);l.rotation.y=-s*.18});add(B(.1,.025,.03),m,0,.035,.02,g);
    [-1,1].forEach(s=>add(B(.025,.025,.34),m,s*.3,.03,-.17,g));parts.shades=[g]}
  parts.calves=legs.map(g=>add(Cy(.1,.14),skin,0,-.19,0,g));
  parts.forearms=arms.map(g=>add(Cy(.08,.16),skin,0,-.22,0,g));
  // superhero: a domino mask round the eyes, a shield emblem on the chest, a gold belt (the cape is an outfit accessory)
  {const m=sm(0x1b1e3a,{roughness:.4}),g=new THREE.Group();head.add(g);
    [-1,1].forEach(s=>{const r=add(new THREE.TorusGeometry(.11,.055,8,18),m,s*.14,0,.4,g);r.scale.set(.95,1.2,1);
      const w=add(new THREE.ConeGeometry(.07,.2,4),m,s*.3,.06,.34,g);w.rotation.z=-s*1.1;w.rotation.y=-s*.6});add(B(.12,.07,.06),m,0,.02,.445,g);parts.mask=[g]}
  {const gold=sm(0xffd84a,{roughness:.35,metalness:.3}),red=sm(0xe23b3b,{roughness:.5}),g=new THREE.Group();g.position.set(0,.12,.37);hp.add(g);
    const a=add(B(.24,.24,.03),gold,0,0,0,g);a.rotation.z=PI/4;const b2=add(B(.16,.16,.035),red,0,0,.005,g);b2.rotation.z=PI/4;
    const bolt=add(B(.04,.15,.04),gold,0,0,.012,g);bolt.rotation.z=.5;parts.emblem=[g];
    parts.belt=[T(.37,.045,gold,0,-.17,0,hp)];parts.belt[0].scale.set(1,.92,1)}
  const PART_EXTRAS=['hair','shades','calves','forearms','mask','emblem','belt'];PART_EXTRAS.forEach(k=>parts[k].forEach(m=>{m.visible=false}));
  return{root,hp,legL:legs[0],legR:legs[1],armL:arms[0],armR:arms[1],head,eyes,scarf,face:FACE,blinkOf,parts,partExtras:PART_EXTRAS,pantsLegs,sleeves,gogG,locks:parts.hair[0]._locks,anc:{hr:.45,top:.56,eyeY:0,face:.5,nose:[0,-.09,.52],backY:.1,backZ:-.4},
    mats:{jacket,fleece,leather,pants,boot,sole,glove,scarf:scarfM,metal,lens,rib,hair,hairDark:dark}};
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
  const board=new THREE.Group();board.position.set(0,.18,-.42);board.name='board';board.rotation.z=.32;hp.add(board);
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
  return{root,hp,legL:legs[0],legR:legs[1],armL:arms[0],armR:arms[1],head,eyes,pony,hsYo:.21,board,anc:{hr:.4,top:.5,eyeY:0,face:.45,nose:[0,-.08,.45],backY:.12,backZ:-.38},
    mats:{jacket,fleece,leather,pants,boot,sole,glove,scarf,metal,lens,rib}};
}
// Vex: a mouthy skate punk with attitude. Same rig interface as Flip and Nova. His dangly bits run on real springs
// (vexPhysics, below): "tails" (two bandana-knot tails), "hawk" (mohawk spikes that flop and wobble when he lands),
// "chain" (wallet chain at his hip) and "gum" (the bubble he blows when he's left standing around).
function buildVex(parent=P){
  const root=new THREE.Group(),hp=new THREE.Group();hp.position.y=.9;root.add(hp);parent.add(root);
  const S=(r,w=14,h=10)=>new THREE.SphereGeometry(r,w,h),sm=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.6,...o});
  const skin=sm(0xf1c49b,{roughness:.65}),lid=sm(0xe0ad84,{roughness:.7}),jacket=sm(0x2b2733,{roughness:.85}),rib=sm(0x221f28,{roughness:.9}),
        fleece=sm(0xb6ff3b,{roughness:.7}),leather=sm(0xff3d8b,{roughness:.7}),roots=sm(0x6f5448,{roughness:1}),brow=sm(0x3a2228,{roughness:.9}),pants=sm(0x26262e,{roughness:.9}),
        boot=sm(0x1d1d22,{roughness:.6}),sole=sm(0xf2f2f2,{roughness:.5}),glove=sm(0x1d1d22,{roughness:.5}),scarf=sm(0xe23b3b,{roughness:.7}),
        metal=sm(0xc8ccd0,{roughness:.3,metalness:.7}),lens=sm(0xb6ff3b,{roughness:.4,emissive:0x4a7a00,emissiveIntensity:.9}),
        dark=sm(0x1a0f12,{roughness:.4}),white=sm(0xffffff,{roughness:.3}),tape=sm(0xf6e2c4,{roughness:.95});
  const T=(r,t,m,x,y,z,par,rx=PI/2,arc=2*PI)=>{const o=add(new THREE.TorusGeometry(r,t,8,24,arc),m,x,y,z,par);o.rotation.x=rx;return o};
  const bolt=(x,y,z,k,par,ry=0)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;par.add(g);
    add(B(.05*k,.17*k,.02),lens,.025*k,.08*k,0,g).rotation.z=-.45;add(B(.13*k,.045*k,.02),lens,0,0,0,g).rotation.z=-.2;add(B(.05*k,.17*k,.02),lens,-.025*k,-.08*k,0,g).rotation.z=-.45;return g};
  // legs: baggy ripped jeans, high-top sneakers with white toe caps
  const legs=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.18,-.22,0);hp.add(g);
    add(new THREE.CylinderGeometry(.13,.165,.42,12),pants,0,-.2,0,g);
    if(s>0){add(B(.1,.045,.02),skin,0,-.17,.155,g).rotation.z=.3;add(B(.07,.02,.02),skin,.01,-.22,.158,g).rotation.z=-.2}
    add(new THREE.CylinderGeometry(.15,.16,.18,12),boot,0,-.46,0,g);T(.155,.025,fleece,0,-.4,0,g);
    add(S(.17),boot,0,-.54,.08,g).scale.set(1,.62,1.4);add(S(.1),sole,0,-.56,.23,g).scale.set(1.4,.6,.8);
    add(B(.32,.08,.5),sole,0,-.6,.07,g);return g});
  // oversized hoodie: kangaroo pocket, hood bunched behind the neck, drawstrings, lightning bolts front and back
  add(S(.41,18,14),jacket,0,.1,0,hp).scale.set(1.1,1,.92);
  T(.37,.07,rib,0,-.2,0,hp).scale.set(1.05,.92,1);
  add(B(.42,.16,.06),rib,0,-.07,.335,hp).rotation.x=-.18;
  add(S(.22),jacket,0,.42,-.26,hp).scale.set(1.3,.85,.7);add(S(.16),fleece,0,.47,-.22,hp).scale.set(1.1,.55,.5);
  T(.21,.08,jacket,0,.44,-.03,hp);
  [-1,1].forEach(s=>{add(new THREE.CylinderGeometry(.012,.012,.22,5),fleece,s*.08,.34,.37,hp);add(S(.022,6,5),metal,s*.08,.22,.375,hp)});
  bolt(-.17,.16,.355,.7,hp,-.35);bolt(0,.14,-.39,1.5,hp,PI);
  // arms: sleeves shoved up, studded wristbands, fists
  const arms=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.46,.3,0);hp.add(g);
    add(S(.145),jacket,0,-.07,0,g).scale.set(1,1.1,1);add(new THREE.CylinderGeometry(.075,.07,.2,10),skin,0,-.22,0,g);
    add(new THREE.CylinderGeometry(.095,.095,.08,12),glove,0,-.31,0,g);
    for(let i=0;i<4;i++){const a=i/4*2*PI+.4;add(S(.018,5,4),metal,Math.sin(a)*.097,-.31,Math.cos(a)*.097,g)}
    add(S(.12),skin,0,-.41,0,g).scale.set(1,1,.9);return g});
  // wallet chain: a loop of links from the front belt loop to the back pocket; the pivot swings it
  const chain=new THREE.Group();chain.position.set(.34,-.14,0);hp.add(chain);
  for(let i=0;i<=9;i++){const t=i/9,l=add(new THREE.TorusGeometry(.028,.009,5,8),metal,0,-.2*Math.sin(PI*t),.24*Math.cos(PI*t),chain);l.rotation.y=i%2?PI/2:0;l.rotation.x=PI*t}
  // head
  const head=new THREE.Group();head.position.set(0,.88,0);hp.add(head);
  add(S(.43,20,16),skin,0,0,0,head);
  [-1,1].forEach(s=>add(S(.09),skin,s*.42,-.04,0,head).scale.set(.55,1,.85));
  T(.045,.012,metal,-.445,-.15,.02,head,0);add(S(.02,6,5),metal,.445,-.1,.03,head);
  // shaved undercut, pink mohawk on springs (front spike is a big swoop that hangs over his brow)
  add(new THREE.SphereGeometry(.436,22,14,0,2*PI,0,PI/2.4),roots,0,.03,-.01,head);
  const hawk=[];[[-1,.42,.55],[-.55,.5,.32],[-.1,.48,.08],[.35,.4,-.12],[.8,.3,-.28],[1.15,.2,-.4]].forEach(([a,h,lean],i)=>{
    const g=new THREE.Group();g.position.set(0,.41*Math.cos(a),-.41*Math.sin(a));g.rotation.x=-a-lean;head.add(g);g._b=g.rotation.x;
    const c=add(new THREE.ConeGeometry(.14-i*.012,h,6),leather,0,h/2-.03,0,g);c.scale.set(.6,1,1);hawk.push(g)});
  add(B(.11,.06,.75),leather,0,.4,-.04,head).rotation.x=.1;
  // bandana across the forehead, knot at the back, two tails
  T(.44,.045,scarf,0,.1,0,head,PI/2-.06);add(S(.07),scarf,0,.12,-.44,head);
  const tails=[-1,1].map(s=>{const c=[];let pp=head,y0=.1,z0=-.46;for(let i=0;i<4;i++){const g=new THREE.Group();g.position.set(i?0:s*.05,y0,z0);if(!i)g.rotation.y=s*.4;pp.add(g);
    add(B(.09-i*.014,.15,.022),scarf,0,-.075,0,g);c.push(g);pp=g;y0=-.15;z0=0}return c});
  // face: half-lidded side-eye, one brow up and one down, lopsided smirk with a snaggletooth, bandage on the cheek
  const eyes=[];
  [-1,1].forEach(s=>{
    const e=add(S(.1),white,s*.15,.02,.355,head);e.scale.set(.95,1.1,.5);eyes.push(e);
    eyes.push(add(S(.05,10,8),dark,s*.15+.035,0,.4,head));
    add(S(.015,6,4),white,s*.15+.05,.03,.43,head);
    const l=add(new THREE.SphereGeometry(.108,14,8,0,2*PI,0,PI*.5),lid,s*.15,.02,.355,head);l.scale.set(.98,1.15,.6);l.rotation.x=.75;
    const br=add(B(.15,.04,.035),brow,s*.16,s<0?.2:.15,.37,head);br.rotation.z=s<0?.28:.32});
  add(S(.05),lid,0,-.07,.42,head);
  const smile=T(.075,.018,dark,.04,-.2,.39,head,0,PI*.6);smile.rotation.z=PI+.55;
  add(new THREE.ConeGeometry(.018,.045,4),white,.085,-.205,.405,head).rotation.x=PI;
  {const b=new THREE.Group();b.position.set(-.23,-.1,.34);b.rotation.set(0,-.55,.35);head.add(b);add(B(.13,.045,.02),tape,0,0,0,b);add(B(.045,.11,.02),tape,0,0,.004,b)}
  const gum=add(S(.15,16,12),sm(0xff4fa3,{roughness:.2,transparent:true,opacity:.92,emissive:0x5a0f30,emissiveIntensity:.4}),.05,-.22,.5,head);gum.scale.setScalar(.001);gum.visible=false;gum.castShadow=false;
  return{root,hp,legL:legs[0],legR:legs[1],armL:arms[0],armR:arms[1],head,eyes,tails,hawk,chain,gum,gT:0,attitude:true,hsYo:.24,anc:{hr:.43,top:.42,tilt:.5,eyeY:.02,face:.47,nose:[0,-.07,.47],backY:.1,backZ:-.4},
    mats:{jacket,fleece,leather,pants,boot,sole,glove,scarf,metal,lens,rib}};
}
// Tuk: a yeti cub in a hand-knit sweater. Same rig interface as the others. Springy bits (tukPhysics, below): floppy
// "ears", a "tuft" of fur on his head, his scarf "tail", and a round "belly" that jiggles when he lands. Left
// alone, he tips his head back and catches snowflakes on his "tongue".
function buildTuk(parent=P){
  const root=new THREE.Group(),hp=new THREE.Group();hp.position.y=.86;root.add(hp);parent.add(root);
  const S=(r,w=16,h=12)=>new THREE.SphereGeometry(r,w,h),sm=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.8,...o});
  const leather=sm(0xf4f7fb,{roughness:.95}),pants=sm(0xc6daec,{roughness:.95}),jacket=sm(0xf08a3c,{roughness:.9}),rib=sm(0xc96d2c,{roughness:.95}),
        fleece=sm(0xfff1d6,{roughness:.9}),scarf=sm(0x2f6fd0,{roughness:.9}),boot=sm(0x5a6472,{roughness:.6}),sole=sm(0xc9b48f,{roughness:.5}),
        glove=sm(0xff9aa8,{roughness:.7}),metal=sm(0x8a5a35,{roughness:.6}),lens=sm(0x37a6e8,{roughness:.3,emissive:0x0b3a5a,emissiveIntensity:.6}),
        dark=sm(0x1b1720,{roughness:.4}),white=sm(0xffffff,{roughness:.3}),pink=sm(0xff7d96,{roughness:.5});
  const T=(r,t,m,x,y,z,par,rx=PI/2,arc=2*PI)=>{const o=add(new THREE.TorusGeometry(r,t,8,24,arc),m,x,y,z,par);o.rotation.x=rx;return o};
  // a ring of fur tufts gives the round shapes a fluffy edge
  const fluff=(par,y,r,n,sz,m=leather,z=0)=>{for(let i=0;i<n;i++){const a=i/n*2*PI;add(S(sz,8,6),m,Math.sin(a)*r,y+(i%2?.02:-.02),Math.cos(a)*r+z,par)}};
  // legs: short furry legs, big feet with dark pads
  const legs=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.22,-.32,0);hp.add(g);
    add(new THREE.CylinderGeometry(.15,.17,.28,10),leather,0,-.12,0,g);fluff(g,-.24,.15,6,.06);
    add(S(.2),leather,0,-.36,.08,g).scale.set(1,.55,1.35);add(new THREE.CylinderGeometry(.16,.17,.04,14),boot,0,-.46,.1,g).scale.set(1,1,1.3);
    [-.08,0,.08].forEach(x=>add(S(.035,6,5),sole,x,-.38,.33,g));return g});
  // body: round fur belly, sweater over the top with a zigzag band, ribbed hem, wooden toggles
  const belly=add(S(.5,20,16),leather,0,.02,0,hp);belly.scale.set(1.05,.95,.95);
  add(S(.36),pants,0,-.12,.27,hp).scale.set(.95,.8,.45);
  add(new THREE.SphereGeometry(.53,20,14,0,2*PI,0,PI*.6),jacket,0,.04,0,hp).scale.set(1.04,.95,.95);
  T(.47,.06,rib,0,-.08,0,hp).scale.set(1.05,1,.93);
  for(let i=0;i<20;i++){const a=i/20*2*PI;const b=add(new THREE.BoxGeometry(.2,.04,.03),fleece,Math.sin(a)*.5,.2,Math.cos(a)*.47,hp);b.rotation.y=a;b.rotation.z=i%2?.55:-.55}
  [.08,-.02].forEach(y=>add(new THREE.CylinderGeometry(.025,.025,.09,6),metal,0,y,.5,hp).rotation.z=PI/2);
  // arms: long furry arms with big round paws and little claws
  const arms=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.5,.26,0);hp.add(g);
    add(S(.15),jacket,0,-.04,0,g);add(new THREE.CylinderGeometry(.11,.13,.3,10),leather,0,-.2,0,g);
    add(S(.17),leather,0,-.4,.02,g).scale.set(1,.95,1.05);[-.06,0,.06].forEach(x=>{const c=add(new THREE.ConeGeometry(.022,.06,5),sole,x,-.52,.08,g);c.rotation.x=PI})
    return g});
  // head
  const head=new THREE.Group();head.position.set(0,.84,0);hp.add(head);
  add(S(.46,22,18),leather,0,0,0,head);
  [-1,1].forEach(s=>{add(S(.14,10,8),leather,s*.36,-.16,.12,head);add(S(.1,8,6),leather,s*.42,-.06,.04,head)});   // fluffy cheeks
  add(S(.36),pants,0,-.05,.16,head).scale.set(1.02,.9,.78);
  // little curved horns
  [-1,1].forEach(s=>{const h=new THREE.Group();h.position.set(s*.2,.34,0);h.rotation.z=-s*.45;head.add(h);
    add(new THREE.ConeGeometry(.07,.16,8),sole,0,.08,0,h);const t=add(new THREE.ConeGeometry(.045,.1,8),sole,s*.03,.19,0,h);t.rotation.z=-s*.5});
  // floppy ears and a tuft of fur on top, on springs
  const ears=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.42,.1,0);g.rotation.z=s*1.1;g._b=g.rotation.z;g._s=s;head.add(g);
    add(S(.15),leather,0,-.16,0,g).scale.set(.6,1.15,.32);add(S(.1),glove,0,-.17,.04,g).scale.set(.5,1,.2);return g});
  const tuft=new THREE.Group();tuft.position.set(0,.42,.04);head.add(tuft);tuft._b=0;
  [[-.08,-.35],[0,0],[.08,.35],[0,.15]].forEach(([x,r],i)=>{const c=add(new THREE.ConeGeometry(.075,i===3?.22:.32,6),leather,x,.13,i===3?-.06:0,tuft);c.rotation.z=r;if(i===3)c.rotation.x=-.4});
  // face: big round eyes, rosy cheeks, button nose, smile with two buck teeth
  const eyes=[];
  [-1,1].forEach(s=>{const e=add(S(.11),white,s*.15,.06,.37,head);e.scale.set(.92,1.1,.5);eyes.push(e);
    const pu=new THREE.Group();pu.position.set(s*.15,.05,.41);head.add(pu);add(S(.075,12,10),lens,0,0,0,pu).scale.set(1,1,.5);add(S(.048,10,8),dark,0,0,.02,pu).scale.set(1,1,.6);add(S(.018,6,5),white,.025,.03,.04,pu);eyes.push(pu);
    add(S(.065),glove,s*.27,-.1,.33,head).scale.set(1,.6,.4)});
  add(S(.07),boot,0,-.07,.44,head).scale.set(1.3,.85,.8);
  T(.06,.014,dark,0,-.15,.42,head,0,PI).rotation.z=PI;
  [-1,1].forEach(s=>add(new THREE.BoxGeometry(.035,.05,.02),white,s*.02,-.2,.42,head));
  const tongue=add(S(.06),pink,0,-.2,.43,head);tongue.scale.set(1,.3,.001);tongue.visible=false;
  // knit scarf with one short tail
  T(.3,.07,scarf,0,.42,0,hp).scale.set(1,1,.92);
  const tail=new THREE.Group();tail.position.set(.14,.4,.24);tail.rotation.set(.3,0,-.15);hp.add(tail);tail._b=.3;
  add(new THREE.BoxGeometry(.12,.3,.05),scarf,0,-.15,0,tail);[-.04,0,.04].forEach(x=>add(new THREE.BoxGeometry(.018,.07,.04),scarf,x,-.32,0,tail));
  return{root,hp,legL:legs[0],legR:legs[1],armL:arms[0],armR:arms[1],head,eyes,ears,tuft,tail,belly,tongue,yeti:true,hsYo:.26,
    anc:{hr:.46,top:.5,eyeY:.06,face:.47,nose:[0,-.07,.47],backY:.1,backZ:-.48},mats:{jacket,fleece,leather,pants,boot,sole,glove,scarf,metal,lens,rib}};
}
// Tuk's springs. dv = change in velocity this frame in his own frame (f forward, s right, u up), like Vex's.
function tukPhysics(H,dt,dv,sp,air,idle){const cl=x=>Math.max(-12,Math.min(12,x)),fl=Math.min(1,sp*.08)+(air?.3:0);
  H.ears.forEach(g=>{kick(g,'z',g._s*cl(dv.u)*.75-cl(dv.s)*.15);kick(g,'x',-cl(dv.f)*.15);
    spring(g,'z',g._b+g._s*(fl*.35+Math.sin(tAll*(4+sp*.5)+g._s)*.05),dt,55,3.5);spring(g,'x',-fl*.4,dt,60,5)});
  kick(H.tuft,'x',cl(dv.u)*.35-cl(dv.f)*.12);kick(H.tuft,'z',cl(dv.s)*.2);spring(H.tuft,'x',-fl*.35,dt,110,5);spring(H.tuft,'z',0,dt,110,5);
  kick(H.tail,'x',cl(dv.f)*.3-cl(dv.u)*.1);spring(H.tail,'x',H.tail._b+fl*.9,dt,60,5);
  // belly jiggle: a landing squashes it, then it wobbles back
  const B=H.belly,v=B._jv||(B._jv={y:0});v.y-=Math.max(0,cl(dv.u))*.26;v.y+=((.95-B.scale.y)*240-v.y*9)*dt;B.scale.y+=v.y*dt;B.scale.x=1.05+(.95-B.scale.y)*.6;
  // standing around: tips his head back and catches snowflakes on his tongue
  H.tongue.visible=idle&&Math.sin(tAll*1.3)>-.2;if(H.tongue.visible)H.tongue.scale.z=Math.min(.7,(H.tongue.scale.z||0)+dt*2);else H.tongue.scale.z=.001}
// Flip's hair (when it shows): every lock lags behind changes in his speed, overshoots and wobbles back; running
// streams it back, falling lifts it, and it sways a little at rest. dv as in vexPhysics (f forward, s right, u up).
// A lock's tip moves along a direction D when it turns about the axis tip x D (small angles).
function hairPhysics(H,dt,dv,sp,air,falling){if(!H.locks||!H.parts.hair[0].visible)return;const cl=x=>Math.max(-12,Math.min(12,x));
  const D=[cl(dv.s)*.12,-cl(dv.u)*.07,-cl(dv.f)*.12],W=[0,falling?.25:0,-Math.min(.32,sp*.04)];
  for(const p of H.locks){const t=p._t,w=p._w,c=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const k=c(t,D),r=c(t,W),sw=Math.sin(tAll*(2.2+sp*.35)+p._ph)*(.025+Math.min(.07,sp*.008));
    kick(p,'x',k[0]*w*7);kick(p,'y',k[1]*w*7);kick(p,'z',k[2]*w*7);
    spring(p,'x',r[0]*w+sw*.5,dt,85,5.5);spring(p,'y',r[1]*w,dt,85,5.5);spring(p,'z',r[2]*w+sw,dt,85,5.5)}}
// A damped spring on one rotation axis (velocity kept on the object): dangly bits overshoot and wobble instead of easing.
function spring(o,ax,target,dt,k=120,c=9){const v=o._sv||(o._sv={x:0,y:0,z:0});v[ax]+=((target-o.rotation[ax])*k-v[ax]*c)*dt;v[ax]=Math.max(-40,Math.min(40,v[ax]));o.rotation[ax]+=v[ax]*dt}
const kick=(o,ax,dv)=>{const v=o._sv||(o._sv={x:0,y:0,z:0});v[ax]+=dv};
// Vex's physics. dv = how much the character's velocity changed this frame, in his own frame (f forward, s right, u up):
// speeding up flings the tails back, stopping throws them forward, landing flops the mohawk, turning swings the chain.
function vexPhysics(H,dt,dv,sp,air,run,ph,bank,idle){
  const fl=Math.min(1,sp*.09)+(air?.3:0),cl=x=>Math.max(-12,Math.min(12,x));
  H.tails.forEach((ch,j)=>ch.forEach((g,i)=>{kick(g,'x',cl(dv.f)*.35-cl(dv.u)*.12);kick(g,'z',cl(dv.s)*(.25+i*.06));
    spring(g,'x',(i?.15+fl*.22:.35+fl*.85)+Math.sin(tAll*(5+sp*.7)-i*1.3+j*1.7)*(.03+fl*.09),dt,70+i*25,5);
    spring(g,'z',(i?0:(j?.1:-.1))-bank*.6+Math.sin(tAll*(3.5+sp*.4)-i*.9+j)*(.03+fl*.05),dt,60+i*20,5)}));
  H.hawk.forEach((g,i)=>{kick(g,'x',cl(dv.u)*(.5+i*.08)-cl(dv.f)*.12);kick(g,'z',cl(dv.s)*.2);
    spring(g,'x',g._b-fl*.22*(i+1)/5+(run?Math.sin(ph*2)*.05:0),dt,150,6);spring(g,'z',-bank*.4,dt,150,6)});
  kick(H.chain,'z',-cl(dv.s)*.5+cl(dv.u)*.05);spring(H.chain,'z',(run?Math.sin(ph)*.22:0)+(air?-.3:0),dt,45,3.5);
  // gum: stand around long enough and he blows a bubble until it pops
  const G=H.gum;if(idle){H.gT+=dt}else{if(G.visible&&G.scale.x>.25)popGum(H);H.gT=Math.min(H.gT,0)}
  const q=(H.gT-2.2)/1.5;if(q>0&&q<1){G.visible=true;G.scale.setScalar(.05+.95*q*q*(1+.06*Math.sin(tAll*9)))}else if(q>=1){popGum(H);H.gT=-1.5-Math.random()*2}else{G.visible=false}}
function popGum(H){const G=H.gum;G.visible=false;G.scale.setScalar(.001);if(state==='play'||state==='select'||state==='menu')SFX.gumPop();
  const w=G.getWorldPosition?G.getWorldPosition(new THREE.Vector3()):new THREE.Vector3(P.position.x,py+1.6,P.position.z);
  for(let i=0;i<7;i++){const m=new THREE.Mesh(partGeo,new THREE.MeshBasicMaterial({color:0xff8ac2,transparent:true}));m.position.copy(w);m.scale.setScalar(.6);scene.add(m);
    parts.push({m,v:new THREE.Vector3((Math.random()-.5)*3,1+Math.random()*1.5,(Math.random()-.5)*3),life:.35})}}
const F=buildChibi(),NV=buildNova(),VX=buildVex(),TK=buildTuk();
// ---------- Flip's wardrobe ----------
const OUTFITS=[
  {name:'Stunt Pilot',jacket:0xa8582c,fleece:0xf1e4c6,leather:0x6b3f22,pants:0x34405e,boot:0x4a2c18,sole:0xe9dcc0,glove:0xf3e6c8,scarf:0xe2493b,lens:0x9fe3f0,lensE:0x1d5a66,metal:0x7d858c},
  {name:'Night Flyer',jacket:0x2a3048,fleece:0x8a93a8,leather:0x1b1e28,pants:0x1e2230,boot:0x15171d,sole:0x2bb3a8,glove:0x3a4058,scarf:0x2bb3a8,lens:0xffd84a,lensE:0x6b4a00,metal:0x2f333a},
  {name:'Racer',jacket:0xd83a2e,fleece:0xffffff,leather:0xf4f4f4,pants:0x1f1f24,boot:0xf4f4f4,sole:0xd83a2e,glove:0x1f1f24,scarf:0xffd84a,lens:0x3a3f45,lensE:0x000000,metal:0xc8ccd0},
  {name:'Arctic',jacket:0xe9eff2,fleece:0xffffff,leather:0x7fb3d9,pants:0x5d7a91,boot:0x8a9aa6,sole:0x3d4a55,glove:0x7fb3d9,scarf:0xff8a3d,lens:0xb8f0ff,lensE:0x2a6a80,metal:0xa0a8b0},
  {name:'Golden Ace',jacket:0xd9a630,fleece:0xfff4d6,leather:0x3a2a1a,pants:0x2a2a30,boot:0x3a2a1a,sole:0xd9a630,glove:0xffffff,scarf:0xffffff,lens:0xffd84a,lensE:0x8a5a00,metal:0xd9a630,shiny:true,lock:'Beat Sky Gauntlet to unlock'},
  // Off Duty: the stunt pilot on a summer day. Short-sleeve linen pilot shirt (collar, chest pockets, wooden buttons,
  // rolled cuffs), olive shorts, canvas sneakers with gum soles, his own hair with the goggles pushed up on it
  {name:'Off Duty',jacket:0xe3d3ad,fleece:0xf1e6cc,leather:0x6b3f22,pants:0x6f7a4a,boot:0xece4d2,sole:0x9a6a3e,glove:0xe8b087,scarf:0xe2493b,lens:0x9fe3f0,lensE:0x1d5a66,metal:0x8a5a35,
    hide:['cap','scarf','gogStrap'],show:['hair','calves','forearms'],shorts:true},
  // Super Flip: blue suit, red cape, boots and gloves, gold emblem and belt, domino mask
  {name:'Super Flip',jacket:0x2a5bd7,fleece:0xffd84a,leather:0xe23b3b,pants:0x2a5bd7,boot:0xe23b3b,sole:0xffd84a,glove:0xe23b3b,scarf:0xe23b3b,lens:0xffd84a,lensE:0x7a5a00,metal:0xffd84a,
    hide:['cap','goggles','gogStrap','scarf','collar','zip'],show:['hair','mask','emblem','belt'],acc:{back:{id:'cape',col:0xe23b3b}}}];
// Nova's wardrobe (jacket / beanie+mittens = leather+glove / headphones+pom = scarf / board = metal)
const OUTFITS_NOVA=[
  {name:'Backcountry',jacket:0xf2b33d,fleece:0xfff4dc,leather:0x2f4f8f,pants:0x3d4a5c,boot:0x2a2a30,sole:0xf2b33d,glove:0x2f4f8f,scarf:0xff5a5f,lens:0x7ff0ff,lensE:0x1d6070,metal:0x1f2a36},
  {name:'Neon Night',jacket:0x1f1f2e,fleece:0x8a5cff,leather:0x8a5cff,pants:0x2a2a3a,boot:0x15151d,sole:0x39ff88,glove:0x39ff88,scarf:0xff3fb4,lens:0xff3fb4,lensE:0x80104f,metal:0x39ff88},
  {name:'Glacier',jacket:0xbfe6ff,fleece:0xffffff,leather:0xffffff,pants:0x5d7a91,boot:0x8a9aa6,sole:0xffffff,glove:0x7fb3d9,scarf:0x2f6fd0,lens:0xb8f0ff,lensE:0x2a6a80,metal:0xe9f6ff},
  {name:'Ember',jacket:0xd8452e,fleece:0x2a2a2a,leather:0x2a2a2a,pants:0x3a3330,boot:0x2a2220,sole:0xffb347,glove:0x2a2a2a,scarf:0xffb347,lens:0xffb347,lensE:0x804000,metal:0x2a2a2a},
  {...OUTFITS[4],name:'Gold Rush'}];
// Vex's wardrobe (hoodie / hair = leather / bandana = scarf / laces, drawstrings, sneaker stripe = fleece / wristbands = glove / bolts = lens / studs, chain = metal)
const OUTFITS_VEX=[
  {name:'Street Punk',jacket:0x2b2733,fleece:0xb6ff3b,leather:0xff3d8b,pants:0x26262e,boot:0x1d1d22,sole:0xf2f2f2,glove:0x1d1d22,scarf:0xe23b3b,lens:0xb6ff3b,lensE:0x4a7a00,metal:0xc8ccd0},
  {name:'Toxic',jacket:0x8fe02e,fleece:0x6b2cff,leather:0x6b2cff,pants:0x1d1d22,boot:0x6b2cff,sole:0x1d1d22,glove:0x6b2cff,scarf:0x1d1d22,lens:0x1d1d22,lensE:0x000000,metal:0x9aa0a8},
  {name:'Bubblegum',jacket:0xff8ac2,fleece:0xffffff,leather:0x37d7ff,pants:0x3a3f6b,boot:0x37d7ff,sole:0xffffff,glove:0xffffff,scarf:0x37d7ff,lens:0xffffff,lensE:0x5a5a7a,metal:0xe8e8f0},
  {name:'Blackout',jacket:0x18181c,fleece:0xff2a2a,leather:0xf4f4f4,pants:0x18181c,boot:0x18181c,sole:0xff2a2a,glove:0xff2a2a,scarf:0xff2a2a,lens:0xff2a2a,lensE:0x7a0000,metal:0x55585e},
  {...OUTFITS[4],name:'Gold Tooth',leather:0x1d1d22}];
// Tuk's wardrobe (sweater = jacket / zigzag & hem trim = fleece / fur = leather / face & belly = pants / scarf / paw pads
// & nose = boot / horns & claws = sole / cheeks & inner ears = glove / toggles = metal / eyes = lens)
const OUTFITS_TUK=[
  {name:'Cozy',jacket:0xf08a3c,fleece:0xfff1d6,leather:0xf4f7fb,pants:0xc6daec,boot:0x5a6472,sole:0xc9b48f,glove:0xff9aa8,scarf:0x2f6fd0,metal:0x8a5a35,lens:0x37a6e8,lensE:0x0b3a5a},
  {name:'Glacier',jacket:0x2bb3a8,fleece:0xe8fbff,leather:0xcfe6f5,pants:0xf2f9ff,boot:0x3a4f66,sole:0xe8f2fb,glove:0x9fd8ff,scarf:0xf2f2f2,metal:0xd9e6f2,lens:0x2bb3a8,lensE:0x0b4a44},
  {name:'Berry',jacket:0x8e3bb8,fleece:0xffd84a,leather:0xf7e6f0,pants:0xffffff,boot:0x5a3a5e,sole:0xf3c9a8,glove:0xff7db0,scarf:0xffd84a,metal:0xffd84a,lens:0xb070ff,lensE:0x3a1260},
  {name:'Midnight',jacket:0x1f2b4a,fleece:0x8fd0ff,leather:0x9aa3b5,pants:0xd5dbe6,boot:0x1b1f2a,sole:0xe8e8f0,glove:0x8fa8d8,scarf:0xe23b3b,metal:0xc8ccd0,lens:0xffd84a,lensE:0x5a4700},
  {...OUTFITS[4],name:'Golden Fleece',leather:0xffe08a,pants:0xfff4cc,sole:0xffffff,lens:0xffd84a,lensE:0x7a5a00}];
const unlocked=(o,list=OUTFITS)=>!list[o].lock||!!bestA.orbRunAdv2;
const OFI={}; // each wardrobe character's current outfit, by character index
function applyOutfit(i){const c=chars[ci];if(!c.outs)return;if(typeof LOOKS!=='undefined'&&LOOKS[ci]){LOOKS[ci].c={};saveLook(ci);applyLook(c.rig,ci,i,LOOKS[ci])}else applyOutfitTo(c.rig.mats,i,c.outs,c.rig)}
// which of the rig's pieces an outfit shows: everything normal, extras hidden, then the outfit's own hide/show/shorts
function outfitParts(rig,o){if(!rig||!rig.parts)return;const ex=rig.partExtras||[];
  for(const k in rig.parts){const on=ex.includes(k)?(o.show||[]).includes(k):!(o.hide||[]).includes(k);rig.parts[k].forEach(m=>{m.visible=on})}
  (rig.pantsLegs||[]).forEach(m=>{m.scale.y=o.shorts?.5:1;m.position.y=o.shorts?-.065:-.13});
  // goggles pushed up over hair sit a touch bigger and higher
  if(rig.gogG){const up=(o.show||[]).includes('hair');rig.gogG.scale.setScalar(up?1.1:1);rig.gogG.position.set(0,up?.1:0,up?-.03:0)}
  // summer: short sleeves too
  (rig.sleeves||[]).forEach(m=>{m.scale.y=o.shorts?.45:1;m.position.y=o.shorts?-.063:-.14})}
// face options for the Customize Face tab (first = default). A look stores only the choices that differ: L.f.
const FACE_OPTS={eyes:[['round','Round'],['relaxed','Relaxed'],['focused','Focused'],['happy','Happy'],['chill','Chill'],['beady','Beady']],
  brows:[['none','None'],['soft','Soft'],['bold','Bold'],['raised','Raised'],['worried','Worried']],
  mouth:[['smile','Smile'],['calm','Calm'],['grin','Grin'],['smirk','Smirk'],['flat','Flat'],['o','Oh'],['none','None']]};
const FACE_TOGGLES=[['nose','Nose'],['freckles','Freckles'],['blush','Blush']];
function applyFace(rig,f={}){const F=rig.face;if(!F)return;
  for(const k in FACE_OPTS){const pick=f[k]||FACE_OPTS[k][0][0];for(const st in F[k])F[k][st].visible=st===pick}
  for(const[k]of FACE_TOGGLES)F[k].forEach(m=>{m.visible=f[k]!==0});
  rig.eyes=rig.blinkOf[f.eyes||'round']||rig.blinkOf.round}
// hair: ginger unless the outfit says otherwise; the darker locks are always the same color a shade darker
const HAIR=0xd9692b;
function setHair(M,hex){if(!M.hair)return;M.hair.color.setHex(hex);if(M.hairDark)M.hairDark.color.setHex(hex).multiplyScalar(.82)}
function applyOutfitTo(M,i,list=OUTFITS,rig){const o=list[i];outfitParts(rig,o);setHair(M,o.hair??HAIR);
  ['jacket','fleece','leather','pants','boot','sole','glove','scarf','metal','lens'].forEach(k=>M[k].color.setHex(o[k]));
  M.lens.emissive.setHex(o.lensE);M.rib.color.setHex(o.jacket).multiplyScalar(.78);
  M.jacket.metalness=o.shiny?.55:0;M.jacket.roughness=o.shiny?.35:.75;M.rib.metalness=o.shiny?.4:0;}
// paintable parts per wardrobe character, in Colors-tab order: [material key, label]
const PARTS={Flip:[['jacket','Jacket'],['fleece','Collar & trim'],['leather','Cap'],['hair','Hair'],['scarf','Scarf'],['pants','Pants'],['boot','Boots'],['sole','Soles'],['glove','Gloves'],['lens','Goggle lenses'],['metal','Goggle frames']],
  Nova:[['jacket','Puffer'],['fleece','Collar & patches'],['leather','Beanie'],['glove','Mittens'],['scarf','Headphones & pom'],['pants','Snow pants'],['boot','Boots'],['sole','Soles & straps'],['metal','Snowboard'],['lens','Board stripe']],
  Tuk:[['jacket','Sweater'],['fleece','Zigzag & trim'],['leather','Fur'],['pants','Face & belly'],['scarf','Scarf'],['glove','Cheeks & ears'],['boot','Nose & paw pads'],['sole','Horns & claws'],['metal','Toggles'],['lens','Eyes']],
  Vex:[['jacket','Hoodie'],['leather','Mohawk'],['scarf','Bandana'],['fleece','Laces & strings'],['lens','Bolts'],['pants','Jeans'],['boot','Sneakers'],['sole','Soles & toe caps'],['glove','Wristbands'],['metal','Studs & chain']]};
const chars=[
  {name:'Sunny',desc:'A bouncy little robot. Springy legs give the highest jump.',speed:1,jump:9,sp:3,jp:5,ag:2,g:body},
  {name:'Rook',desc:'A quick-footed island explorer. Fastest runner, shorter hop.',speed:1.15,jump:7.8,sp:5,jp:3,ag:3,g:R.root,rig:R},
  {name:'Flip',desc:'A pint-sized stunt pilot who plays by momentum. Harder to steer, full of tricks.',speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:F.root,rig:F,outs:OUTFITS,ofKey:'orbRunOutfit',acro:true,
   moves:'Shift: crouch · Crouch + Jump: long jump (running) or backflip (standing) · Shift in the air: dive · Jump off a wall mid-air: wall jump · Jump as you land: double and triple jump · Reverse at speed to skid, Jump mid-skid to side flip'}];
chars.push({name:'Nova',desc:'A fearless backcountry snowboarder with a board on her back and beats in her ears. Same trick moveset as Flip.',speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:NV.root,rig:NV,outs:OUTFITS_NOVA,ofKey:'orbRunOutfitNova',acro:true,moves:chars[2].moves});
chars.push({name:'Vex',desc:'A mouthy skate punk who never asked for your help and won\u2019t say thanks. Same trick moveset as Flip.',speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:VX.root,rig:VX,outs:OUTFITS_VEX,ofKey:'orbRunOutfitVex',acro:true,moves:chars[2].moves});
chars.push({name:'Tuk',desc:'A yeti cub in a hand-knit sweater. Cuddly, curious, and much bouncier than he looks. Same trick moveset as Flip.',speed:1.05,jump:9.6,sp:4,jp:5,ag:4,g:TK.root,rig:TK,outs:OUTFITS_TUK,ofKey:'orbRunOutfitTuk',acro:true,moves:chars[2].moves});
chars.forEach((c,i)=>{if(!c.outs)return;let v=0;try{v=+localStorage.getItem(c.ofKey)||0}catch(e){}if(!c.outs[v])v=0;OFI[i]=v;applyOutfitTo(c.rig.mats,v,c.outs,c.rig)});
const A={wallT:0,lock:0,wnx:0,wnz:0,spd:0,mode:'normal',t:0,air:false,landT:0,jumpN:0,canCut:false,canDive:true,prevC:false,flipT:99,flipAxis:'x',flipDir:1,knock:0,skidTo:0,twirlT:99};
const resetAcro=()=>Object.assign(A,{wallT:0,lock:0,spd:0,mode:'normal',t:0,air:false,landT:0,jumpN:0,canCut:false,canDive:true,flipT:99,knock:0,twirlT:99});
let jumpBuf=0;
const fxM=new THREE.MeshBasicMaterial({color:0xffcc33,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
const fxRing=new THREE.Mesh(new THREE.RingGeometry(.35,.55,32),fxM);fxRing.rotation.x=-PI/2;fxRing.visible=false;scene.add(fxRing);let fxT=0;
function readyRing(){fxRing.position.set(P.position.x,py+.06,P.position.z);fxT=.3;fxRing.visible=true}
function trail(col,n=1){for(let i=0;i<n;i++){const m=new THREE.Mesh(partGeo,new THREE.MeshBasicMaterial({color:col,transparent:true}));
  m.position.set(P.position.x+(Math.random()-.5)*.4,py+.5+Math.random()*.9,P.position.z+(Math.random()-.5)*.4);scene.add(m);
  parts.push({m,v:V(-vel.x*.15,.2,-vel.z*.15),life:.35})}}
// Flip is the lead: default pick, first in the select order, then Nova, Vex and Tuk. Sunny and Rook remain as alternates.
// The playable cast: Flip, Nova and Tuk. Sunny (0), Rook (1) and Vex (4) are benched for now: still built and working,
// just not offered. Put their numbers back in ORDER to bring them back.
const ORDER=[2,3,5];let ci=2;try{const v=localStorage.getItem('orbRunPick');if(v!==null&&ORDER.includes(+v))ci=+v}catch(e){}let pickCi=ci;
let wave=0,bank=0,squash=0,airVy=0,wasG=true,lastFace=0;
