// Characters: the player root P and the three rigs (Sunny the robot, Rook the explorer,
// Flipper the stunt pilot), Flipper's wardrobe, the character table and Flipper's move state A.
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
// The face kit (Customize → Face): eye, brow and mouth styles plus switches. Built for Flipper's head (radius .45) and
// scaled by k onto other heads, shifted by (oy, oz). skin colors the lids, hair the brows.
function buildFace(head,{skin,hair,freck,noseC=0xd99a70,blushC=0xef9a85,k=1,oy=0,oz=0}){
  const S=(r,w=14,h=10)=>new THREE.SphereGeometry(r,w,h),sm=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.6,...o});
  const FACE={eyes:{},mouth:{},brows:{},nshape:{},freckles:[],blush:[],nose:[],whites:[],shine:[],pupils:[]},fg=new THREE.Group(),grp=(set,k)=>{const g=new THREE.Group();fg.add(g);set[k]=g;return g};
  fg.scale.setScalar(k);fg.position.set(0,oy,oz);head.add(fg);
  const white=sm(0xffffff,{roughness:.3}),pupilM=sm(0x2a1a10,{roughness:.2}),glintM=sm(0xffffff),lidM=skin;
  const blinkOf={};   // style -> meshes that close on a blink (each remembers its open height in _by)
  const eyeBase=(g,st,lid,tilt=0,py=0)=>{blinkOf[st]=[];[-1,1].forEach(s=>{
      const e=add(S(.11),white,s*.14,0,.39,g);e.scale.set(.85,1.25,.5);e._by=1.25;blinkOf[st].push(e);FACE.whites.push(e);
      const p=add(S(.058,10,8),pupilM,s*.13,py,.44,g);p._by=1;p._s=s;blinkOf[st].push(p);FACE.pupils.push(p);FACE.shine.push(add(S(.018,6,4),glintM,s*.11,.04+py,.475,g));
      if(lid){const l=add(new THREE.SphereGeometry(.118,14,8,0,2*PI,0,PI*lid),lidM,s*.14,0,.392,g);l.scale.set(.88,1.28,.56);l.rotation.z=s*tilt;
        const lash=add(B(.2,.022,.03),darkM,s*.14,.135*Math.cos(PI*lid)/.9,.445,g);lash.rotation.z=s*tilt}})};
  // eyes: big and round (the original) / relaxed (half-lidded) / focused (lids slanting in) / happy (closed arcs) /
  // chill (flat lines) / beady (small dark ovals)
  eyeBase(grp(FACE.eyes,'round'),'round',0);
  eyeBase(grp(FACE.eyes,'relaxed'),'relaxed',.43,0,-.025);
  eyeBase(grp(FACE.eyes,'focused'),'focused',.4,.38,-.01);
  {const g=grp(FACE.eyes,'happy');blinkOf.happy=[];[-1,1].forEach(s=>{const a=add(new THREE.TorusGeometry(.065,.022,6,12,PI),darkM,s*.14,-.01,.43,g)})}
  {const g=grp(FACE.eyes,'chill');blinkOf.chill=[];[-1,1].forEach(s=>{const l=add(B(.13,.026,.03),darkM,s*.14,-.01,.435,g);l.rotation.z=-s*.12})}
  {const g=grp(FACE.eyes,'beady');blinkOf.beady=[];[-1,1].forEach(s=>{const d=add(S(.05,10,8),pupilM,s*.13,0,.43,g);d.scale.set(.8,1.3,.6);d._by=1.3;blinkOf.beady.push(d);FACE.shine.push(add(S(.013,6,4),glintM,s*.115,.03,.475,g))})}
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
    [[.0,0],[.05,.04],[.05,-.03]].forEach(([dx,dy])=>FACE.freckles.push(add(S(.015,5,4),freck,s*(.25+dx),-.12+dy,.37-dx*.4,fg)));
    FACE.blush.push(add(S(.05,8,6),sm(blushC,{roughness:.8,transparent:true,opacity:.55}),s*.27,-.14,.33,fg))});
  // nose shapes (Face → Nose): default button / big bulbous one (think plumber) / small / pointy. The Nose switch hides
  // whichever is picked.
  {const nc=new THREE.Group();fg.add(nc);FACE.nose.push(nc);const nm=sm(noseC),grpN=k=>{const g=new THREE.Group();nc.add(g);FACE.nshape[k]=g;return g};
    add(S(.075),nm,0,-.09,.45,grpN('default'));
    {const g=grpN('big');add(S(.125,18,14),nm,0,-.115,.48,g).scale.set(1.15,.85,1)}
    add(S(.045),nm,0,-.08,.43,grpN('small'));
    {const g=grpN('pointy');const c=add(new THREE.ConeGeometry(.05,.17,10),nm,0,-.08,.5,g);c.rotation.x=PI/2}}
  for(const k of ['eyes','brows','mouth','nshape'])for(const st in FACE[k])FACE[k][st].visible=st===({eyes:'beady',brows:'none',mouth:'calm',nshape:'default'})[k];
  [...FACE.shine,...FACE.freckles,...FACE.blush].forEach(m=>{m.visible=false});
  return{FACE,blinkOf}}
// Flipper: pint-sized stunt pilot. Same rig interface (root > hp > limbs), chunky mascot proportions
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
  const pantsLegs=[],soles=[],bootGs=[];
  const legs=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.17,-.25,0);hp.add(g);
    pantsLegs.push(add(Cy(.12,.26),pants,0,-.13,0,g));const bg=new THREE.Group();g.add(bg);bootGs.push(bg);
    add(S(.2),boot,0,-.34,.08,bg).scale.set(1,.7,1.45);
    soles.push(add(B(.32,.07,.52),sole,0,-.45,.08,bg));T(.12,.03,boot,0,-.24,0,bg);return g});
  // the torso and everything on it live in one group, so a body type can reshape it in one go
  const torso=new THREE.Group();hp.add(torso);
  // bomber jacket: a rounded body with a fitted ribbed waistband, a shearling collar with lapels folding down the
  // chest, a zip with a pull tab, slanted slash pockets, and a round pilot's patch on one sleeve
  add(S(.42,20,16),jacket,0,.08,0,torso).scale.set(1,.95,.9);
  {const w=T(.315,.055,rib,0,-.2,0,torso);w.scale.set(1,.88,1);for(let i=0;i<14;i++){const a=i/14*2*PI,r=add(B(.012,.07,.012),rib,Math.sin(a)*.37,-.2,Math.cos(a)*.33,torso);r.rotation.y=a}}
  const collar=new THREE.Group();torso.add(collar);
  {const c=T(.25,.075,fleece,0,.36,-.02,collar);c.scale.set(1,1,.8);
    [-1,1].forEach(s=>{const l=add(new THREE.SphereGeometry(1,12,10),fleece,s*.085,.28,.325,collar);l.scale.set(.05,.1,.022);l.rotation.set(-.45,s*.35,s*.6)})}
  const zip=new THREE.Group();torso.add(zip);
  {const tr=add(B(.022,.34,.02),metal,0,.0,.382,zip);tr.rotation.x=.08;const tab=add(B(.035,.06,.014),metal,0,.15,.392,zip);tab.rotation.x=.25;add(S(.012,6,4),metal,0,.12,.395,zip)}
  const pockets=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.22,-.06,.315);g.rotation.set(-.15,s*.55,s*.75);torso.add(g);
    add(B(.15,.032,.025),rib,0,0,0,g);add(B(.15,.008,.026),fleece,0,.019,0,g);return g});
  // arms + gloves
  const sleeves=[],cuffs=[],patch=[];
  const arms=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.44,.3,0);hp.add(g);
    sleeves.push(add(Cy(.1,.28),jacket,0,-.14,0,g));add(S(.104,14,10),jacket,0,-.005,0,g);cuffs.push(T(.1,.035,rib,0,-.27,0,g));   // rounded shoulder on top of the sleeve
    if(s>0){const pg=new THREE.Group();pg.position.set(.1,-.08,0);pg.rotation.z=-PI/2;g.add(pg);
      add(new THREE.CylinderGeometry(.07,.07,.012,18),metal,0,0,0,pg);add(new THREE.CylinderGeometry(.056,.056,.016,18),scarfM,0,0,0,pg);
      [-1,1].forEach(w=>{const wg=add(new THREE.SphereGeometry(1,8,6),fleece,.012,.01,w*.024,pg);wg.scale.set(.011,.008,.032);wg.rotation.x=w*.35});patch.push(pg)}
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
  const{FACE,blinkOf}=buildFace(head,{skin,hair,freck});
  const eyes=blinkOf.beady;
  // aviator cap: a leather dome (centre y .08, radius .475) with a fleece lining rolled at the edge, a seam over the
  // top with a button, and rounded fleece-lined ear flaps with snaps
  const capParts=[add(new THREE.SphereGeometry(.475,24,14,0,2*PI,0,PI/2.25),leather,0,.08,-.02,head)];
  capParts.push(T(.462,.042,fleece,0,.165,-.02,head));
  {const seam=add(new THREE.TorusGeometry(.479,.012,6,28,PI*.86),leather,0,.08,-.02,head);seam.rotation.set(0,PI/2,PI*.07);capParts.push(seam,add(S(.034,8,6),leather,0,.558,-.02,head))}
  const LS=new THREE.SphereGeometry(1,14,10);
  [-1,1].forEach(s=>{const lin=add(LS,fleece,s*.43,-.04,-.02,head);lin.scale.set(.045,.17,.13);lin.rotation.z=s*.1;
    const f=add(LS,leather,s*.455,-.04,-.02,head);f.scale.set(.05,.155,.115);f.rotation.z=s*.1;
    capParts.push(lin,f,add(S(.028,8,6),metal,s*.5,-.17,.03,head))});
  // goggles pushed up on the cap: lenses sit on the front of the dome (tilted to its surface), and the strap runs
  // round the sides and back, ending at the frames instead of crossing in front of the lenses
  const gogG=new THREE.Group();head.add(gogG);
  const strapG=new THREE.Group();strapG.position.set(0,.325,-.02);strapG.rotation.x=PI/2;gogG.add(strapG);
  {const st=add(new THREE.TorusGeometry(.425,.022,6,32,2*PI-1.05),rib,0,0,0,strapG);st.rotation.z=PI/2+.525;
    add(B(.05,.05,.03),metal,0,-.425,0,strapG).rotation.x=PI/2}
  const gog=[strapG];
  [-1,1].forEach(s=>{const rim=add(new THREE.TorusGeometry(.085,.03,8,16),metal,s*.125,.33,.37,gogG);rim.rotation.x=-.55;rim.rotation.y=s*.28;
    const l=add(new THREE.CylinderGeometry(.075,.075,.03,14),lens,s*.125,.33,.37,gogG);l.rotation.order='YXZ';l.rotation.set(PI/2-.55,s*.28,0);gog.push(rim,l)});
  gog.push(add(B(.06,.028,.03),metal,0,.335,.395,gogG));
  // ---- outfit-only pieces, hidden unless an outfit shows them (OUTFITS .show / .hide / .shorts) ----
  const parts={cap:capParts,goggles:gog,gogStrap:[gog[0]],scarf:[scarfRing,scarf[0]],collar:[collar],zip:[zip],pockets,cuffs,soles,patch};
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
  {const gold=sm(0xffd84a,{roughness:.35,metalness:.3}),red=sm(0xe23b3b,{roughness:.5}),g=new THREE.Group();g.position.set(0,.12,.37);torso.add(g);
    const a=add(B(.24,.24,.03),gold,0,0,0,g);a.rotation.z=PI/4;const b2=add(B(.16,.16,.035),red,0,0,.005,g);b2.rotation.z=PI/4;
    const bolt=add(B(.04,.15,.04),gold,0,0,.012,g);bolt.rotation.z=.5;parts.emblem=[g];
    parts.belt=[T(.37,.045,gold,0,-.17,0,torso)];parts.belt[0].scale.set(1,.92,1)}
  const PART_EXTRAS=['hair','shades','calves','forearms','mask','emblem','belt'];PART_EXTRAS.forEach(k=>parts[k].forEach(m=>{m.visible=false}));
  return{root,hp,legL:legs[0],legR:legs[1],armL:arms[0],armR:arms[1],head,eyes,scarf,face:FACE,blinkOf,parts,partExtras:PART_EXTRAS,pantsLegs,sleeves,gogG,torso,bootGs,hipY:.8,locks:parts.hair[0]._locks,native:{scarf:parts.scarf,aviator:capParts},natMain:{scarf:'scarf',aviator:'leather'},defAcc:{neck:'scarf',top:'aviator'},jk:[...torso.children,...patch],
    anc:{hr:.45,top:.56,eyeY:0,face:.5,nose:[0,-.09,.52],backY:.1,backZ:-.4,neckY:.46,neckR:.22,hood:{r:.42,y:.08,s:[1,.95,.9],neck:.45,arm:[0,-.27],sr:.15}},
    mats:{jacket,fleece,leather,pants,boot,sole,glove,scarf:scarfM,metal,lens,rib,hair,hairDark:dark}};
}
// Parker: backcountry snowboarder. Her own rig with the same interface (root > hp > limbs, head, eyes, mats):
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
  const jk0=hp.children.length;
  add(S(.4,18,14),jacket,0,.12,0,hp).scale.set(1,1.05,.88);
  [[-.14,.39],[.08,.41],[.28,.36]].forEach(([y,r])=>T(r,.07,rib,0,y,0,hp).scale.set(1,.88,1));
  T(.21,.1,fleece,0,.47,0,hp);
  add(B(.03,.5,.03),metal,0,.1,.355,hp);const jk=hp.children.slice(jk0);
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
  // curls around the back and sides (under the beanie too): a smooth base, then staggered rows of small curls in two
  // tones down to the nape, the same style as the curls on top
  const hair2=sm(0x3a261c,{roughness:.9});
  {const bs=add(new THREE.SphereGeometry(.402,20,12,PI*.95,PI*1.1,PI*.38,PI*.42),hair,0,0,-.01,head);
    [[.08,13,.082],[-.02,14,.09],[-.12,13,.088],[-.21,11,.08],[-.28,7,.068]].forEach(([y,n,r],row)=>{const R=Math.sqrt(.41*.41-y*y)+.015;
      for(let i=0;i<n;i++){const a=PI*.56+(i+(row%2)*.5)/(n-.5)*PI*.88;   // from one cheek round the back to the other
        add(S(r+(i%3)*.01,10,8),(i+row)%4?hair:hair2,Math.sin(a)*R,y+((i%2)?.012:-.012),Math.cos(a)*R-.01,head)}})}
  // the same face kit as Flipper, sized to her head; her defaults: soft brows, no freckles
  const{FACE,blinkOf}=buildFace(head,{skin,hair,freck:sm(0x5e3a26,{roughness:.8}),noseC:0x7a4a30,blushC:0xd9776a,k:.4/.45,oy:-.025});
  const eyes=blinkOf.beady;
  // curls on top for when the hat comes off (Customize → Accessories): a swept-back base with a clean hairline, then
  // curls spread evenly over it (golden-angle spiral) in two tones, and a row of small ones along the hairline
  const hairTop=new THREE.Group();head.add(hairTop);hairTop.visible=false;
  {const TL=-.5,ca=Math.cos(TL),sa=Math.sin(TL);   // the base tilts back so its front edge (the hairline) sits above the brows
    const base=add(new THREE.SphereGeometry(.418,24,14,0,2*PI,0,PI*.5),hair,0,0,-.02,hairTop);base.rotation.x=TL;
    for(let i=0;i<34;i++){const t=(i+.5)/34,el=Math.acos(1-t*.95),az=i*2.39996;   // even spread over the cap
      const x=Math.sin(el)*Math.sin(az),y=Math.cos(el),z=Math.sin(el)*Math.cos(az),rr=.43,cy=y*ca-z*sa,cz=y*sa+z*ca;
      if(cz>.55&&cy<.5)continue;   // the fringe below covers the front
      add(S(.075+(i%3)*.012,10,8),i%4?hair:hair2,x*rr,cy*rr,cz*rr-.02,hairTop)}
    // fringe: a row of curls laid right along the hairline edge, so no edge shows on the forehead
    for(let i=0;i<9;i++){const a=(i/8-.5)*2.5,r=.432,x=Math.sin(a)*r,z0=Math.cos(a)*r;
      add(S(.068+(i%2)*.012,10,8),i%2?hair2:hair,x,-z0*sa+.01,z0*ca-.02,hairTop)}}
  // slouchy beanie with rib band; the tip and pom-pom swing (chain in "pony"). It's her winter hat accessory.
  const beanieG=new THREE.Group();head.add(beanieG);
  const pony=beanieShape(beanieG,1,0,leather,fleece,scarf);
  // headphones over the beanie (her Ears accessory)
  const phones=new THREE.Group();head.add(phones);
  T(.47,.03,scarf,0,.04,0,phones,0,PI);
  [-1,1].forEach(s=>{const c=add(new THREE.CylinderGeometry(.12,.12,.09,16),scarf,s*.44,-.03,0,phones);c.rotation.z=PI/2;
    const l=add(new THREE.CylinderGeometry(.065,.065,.02,14),lens,s*.495,-.03,0,phones);l.rotation.z=PI/2});
  return{root,hp,legL:legs[0],legR:legs[1],armL:arms[0],armR:arms[1],head,eyes,pony,hsYo:.21,board,hairTop,face:FACE,blinkOf,faceDef:{brows:'soft',freckles:0},native:{beanie:[beanieG],board:[board],phones:[phones]},natMain:{beanie:'leather',board:'metal',phones:'scarf'},defAcc:{top:'beanie',back:'board',ears:'phones'},jk,
    anc:{hr:.4,top:.5,eyeY:0,face:.45,nose:[0,-.08,.45],backY:.12,backZ:-.38,neckY:.52,neckR:.27,hood:{r:.4,y:.12,s:[1,1.05,.88],neck:.5,arm:[-.02,-.33],sr:.155}},
    mats:{jacket,fleece,leather,pants,boot,sole,glove,scarf,metal,lens,rib}};
}
// Vex: a mouthy skate punk with attitude. Same rig interface as Flipper and Parker. His dangly bits run on real springs
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
  const jk0=hp.children.length;
  add(S(.41,18,14),jacket,0,.1,0,hp).scale.set(1.1,1,.92);
  T(.37,.07,rib,0,-.2,0,hp).scale.set(1.05,.92,1);
  add(B(.42,.16,.06),rib,0,-.07,.335,hp).rotation.x=-.18;
  add(S(.22),jacket,0,.42,-.26,hp).scale.set(1.3,.85,.7);add(S(.16),fleece,0,.47,-.22,hp).scale.set(1.1,.55,.5);
  T(.21,.08,jacket,0,.44,-.03,hp);
  [-1,1].forEach(s=>{add(new THREE.CylinderGeometry(.012,.012,.22,5),fleece,s*.08,.34,.37,hp);add(S(.022,6,5),metal,s*.08,.22,.375,hp)});
  bolt(-.17,.16,.355,.7,hp,-.35);bolt(0,.14,-.39,1.5,hp,PI);const jk=hp.children.slice(jk0);
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
  return{root,hp,legL:legs[0],legR:legs[1],armL:arms[0],armR:arms[1],head,eyes,tails,hawk,chain,gum,gT:0,attitude:true,hsYo:.24,jk,anc:{hr:.43,top:.42,tilt:.5,eyeY:.02,face:.47,nose:[0,-.07,.47],backY:.1,backZ:-.4,hood:{r:.41,y:.1,s:[1.1,1,.92],neck:.47,arm:[-.02,-.3],sr:.165}},
    mats:{jacket,fleece,leather,pants,boot,sole,glove,scarf,metal,lens,rib}};
}
// Parker's winter hat (also the Winter hat accessory): a slouchy knit beanie. Ribbed fold-up cuff, a band of
// contrast stitches round the crown, and a slouch that falls back to a fluffy pom-pom. Returns the slouch chain
// (groups that swing). k scales it to the head, b is the head-top offset; M main knit, acc stitches, pomM pom-pom.
function beanieShape(g,k,b,M,acc,pomM){const S=(r,w=12,h=10)=>new THREE.SphereGeometry(r*k,w,h);
  add(new THREE.SphereGeometry(.43*k,26,16,0,2*PI,0,PI/2.05),M,0,b+.06*k,-.015*k,g).scale.set(1,1.1,1.04);
  const cuff=add(new THREE.CylinderGeometry(.452*k,.445*k,.15*k,36,1,true),M,0,b+.075*k,-.012*k,g);cuff.scale.z=1.04;
  [.15,0].forEach(dy=>{const l=add(new THREE.TorusGeometry(.449*k,.016*k,6,36),M,0,b+(.075+dy-.075)*k,-.012*k,g);l.rotation.x=PI/2;l.scale.set(1,1.04,1)});
  for(let i=0;i<40;i++){const a=i/40*2*PI,r=add(new THREE.CylinderGeometry(.013*k,.013*k,.14*k,5),M,Math.sin(a)*.455*k,b+.075*k,Math.cos(a)*.455*k*1.04-.012*k,g)}
  [[.2,.02],[.27,.012]].forEach(([y,t])=>{const yy=y-.06,rr=Math.sqrt(.43*.43-Math.pow(yy/1.1,2))*k+.004*k,s=add(new THREE.TorusGeometry(rr,t*k,6,40),acc,0,b+y*k,-.015*k,g);s.rotation.x=PI/2;s.scale.set(1,1.04,1)});
  const chain=[];let pp=g,y0=b+.5*k,z0=-.1*k;
  [[.18,.15],[.13,.12]].forEach(([r,h])=>{const s=new THREE.Group();s.position.set(0,y0,z0);pp.add(s);add(S(r),M,0,-h*.45*k,0,s).scale.set(1,1.3,.95);chain.push(s);pp=s;y0=-h*k;z0=0});
  const pom=new THREE.Group();pom.position.set(0,-.1*k,0);pp.add(pom);add(S(.1,12,10),pomM,0,-.08*k,0,pom);
  for(let i=0;i<9;i++){const a=i*2.4,e=Math.acos(1-2*(i+.5)/9);add(S(.058,8,6),pomM,Math.sin(e)*Math.cos(a)*.09*k,-.08*k+Math.cos(e)*.09*k,Math.sin(e)*Math.sin(a)*.09*k,pom)}
  chain.push(pom);return chain}
// Tucker (was Tuk): a yeti cub in a hand-knit sweater. Same rig interface as the others. Springy bits (tukPhysics, below): floppy
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
  const jk0=hp.children.length;
  add(new THREE.SphereGeometry(.53,20,14,0,2*PI,0,PI*.6),jacket,0,.04,0,hp).scale.set(1.04,.95,.95);
  T(.47,.06,rib,0,-.08,0,hp).scale.set(1.05,1,.93);
  for(let i=0;i<20;i++){const a=i/20*2*PI;const b=add(new THREE.BoxGeometry(.2,.04,.03),fleece,Math.sin(a)*.5,.2,Math.cos(a)*.47,hp);b.rotation.y=a;b.rotation.z=i%2?.55:-.55}
  // his initial knitted on the front, and a fluffy tail poking out under the hem
  add(new THREE.BoxGeometry(.17,.045,.03),metal,0,.085,.492,hp).rotation.x=-.12;add(new THREE.BoxGeometry(.05,.15,.03),metal,0,.01,.497,hp).rotation.x=-.05;
  const jk=hp.children.slice(jk0);
  {const tl=new THREE.Group();tl.position.set(0,-.2,-.46);hp.add(tl);add(S(.1,10,8),leather,0,0,0,tl);fluff(tl,0,.07,6,.05)}
  // arms: long furry arms with big round paws and little claws
  const arms=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.5,.26,0);hp.add(g);
    add(S(.15),jacket,0,-.04,0,g);add(new THREE.CylinderGeometry(.11,.13,.3,10),leather,0,-.2,0,g);
    add(new THREE.CylinderGeometry(.14,.145,.17,12),jacket,0,-.11,0,g);const cf=add(new THREE.TorusGeometry(.14,.035,6,16),rib,0,-.2,0,g);cf.rotation.x=PI/2;
    add(S(.17),leather,0,-.4,.02,g).scale.set(1,.95,1.05);[-.06,0,.06].forEach(x=>{const c=add(new THREE.ConeGeometry(.022,.06,5),sole,x,-.52,.08,g);c.rotation.x=PI})
    return g});
  // head
  const head=new THREE.Group();head.position.set(0,.84,0);hp.add(head);
  add(S(.46,22,18),leather,0,0,0,head);
  [-1,1].forEach(s=>{add(S(.14,10,8),leather,s*.36,-.16,.12,head);add(S(.1,8,6),leather,s*.42,-.06,.04,head)});   // fluffy cheeks
  add(S(.36),pants,0,-.05,.16,head).scale.set(1.02,.9,.78);
  // little curved horns: three tapering segments that curl out and back
  [-1,1].forEach(s=>{let h=new THREE.Group();h.position.set(s*.22,.33,-.02);h.rotation.set(-.25,0,-s*.55);head.add(h);
    [[.068,.055,.1],[.055,.04,.09],[.04,.012,.09]].forEach(([r0,r1,l],i)=>{add(new THREE.CylinderGeometry(r1,r0,l,10),sole,0,l/2,0,h);add(S(r1+.001,8,6),sole,0,l,0,h);
      const n=new THREE.Group();n.position.y=l;n.rotation.set(-.35,0,-s*.42);h.add(n);h=n})});
  // fur: tufts round the back and sides of his head, and fuzzy brows
  {const rn=i=>{const x=Math.sin(i*127.1+31.7)*43758.5;return x-Math.floor(x)};
  for(let i=0;i<26;i++){const a=PI*.55+rn(i)*PI*.9,y=-.22+rn(i+50)*.5,r=Math.sqrt(Math.max(.01,.46*.46-y*y))-.025,sz=.06+rn(i+90)*.035,t=add(S(sz,10,8),leather,Math.sin(a)*r,y,Math.cos(a)*r,head);
    t.rotation.set(-.6+rn(i+7)*.5,a,(rn(i+13)-.5)*.8);t.scale.set(1.15,.85,.4)}}
  [-1,1].forEach(s=>{const b=add(S(.05,8,6),pants,s*.16,.21,.39,head);b.scale.set(1.5,.6,.6);b.rotation.z=s*.25});
  // floppy ears and a tuft of fur on top, on springs
  const ears=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.42,.1,0);g.rotation.z=s*1.1;g._b=g.rotation.z;g._s=s;head.add(g);
    add(S(.15),leather,0,-.16,0,g).scale.set(.6,1.15,.32);add(S(.1),glove,0,-.17,.04,g).scale.set(.5,1,.2);return g});
  // a soft curl of fur on top that swoops forward (on a spring)
  const tuft=new THREE.Group();tuft.position.set(0,.42,.04);head.add(tuft);tuft._b=0;
  [[0,.02,-.04,.11],[-.07,.05,.02,.08],[.07,.05,.02,.08],[0,.12,.02,.085],[0,.17,.1,.065],[0,.15,.17,.05]].forEach(([x,y,z,r])=>add(S(r,10,8),leather,x,y,z,tuft));
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
    jk,anc:{hr:.46,top:.5,eyeY:.06,face:.47,nose:[0,-.07,.47],backY:.1,backZ:-.48,hood:{r:.53,y:.04,s:[1.04,.95,.95],neck:.5,arm:[-.02,-.28],sr:.175}},mats:{jacket,fleece,leather,pants,boot,sole,glove,scarf,metal,lens,rib}};
}
// Tucker's springs. dv = change in velocity this frame in his own frame (f forward, s right, u up), like Vex's.
function tukPhysics(H,dt,dv,sp,air,idle){const cl=x=>Math.max(-12,Math.min(12,x)),fl=Math.min(1,sp*.08)+(air?.3:0);
  H.ears.forEach(g=>{kick(g,'z',g._s*cl(dv.u)*.75-cl(dv.s)*.15);kick(g,'x',-cl(dv.f)*.15);
    spring(g,'z',g._b+g._s*(fl*.35+Math.sin(tAll*(4+sp*.5)+g._s)*.05),dt,55,3.5);spring(g,'x',-fl*.4,dt,60,5)});
  kick(H.tuft,'x',cl(dv.u)*.35-cl(dv.f)*.12);kick(H.tuft,'z',cl(dv.s)*.2);spring(H.tuft,'x',-fl*.35,dt,110,5);spring(H.tuft,'z',0,dt,110,5);
  kick(H.tail,'x',cl(dv.f)*.3-cl(dv.u)*.1);spring(H.tail,'x',H.tail._b+fl*.9,dt,60,5);
  // belly jiggle: a landing squashes it, then it wobbles back
  const B=H.belly,v=B._jv||(B._jv={y:0});v.y-=Math.max(0,cl(dv.u))*.26;v.y+=((.95-B.scale.y)*240-v.y*9)*dt;B.scale.y+=v.y*dt;B.scale.x=1.05+(.95-B.scale.y)*.6;
  // standing around: tips his head back and catches snowflakes on his tongue
  H.tongue.visible=idle&&Math.sin(tAll*1.3)>-.2;if(H.tongue.visible)H.tongue.scale.z=Math.min(.7,(H.tongue.scale.z||0)+dt*2);else H.tongue.scale.z=.001}
// Flipper's hair (when it shows): every lock lags behind changes in his speed, overshoots and wobbles back; running
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
// ---------- Flipper's wardrobe ----------
const OUTFITS=[
  {name:'Stunt Pilot',jacket:0xa8582c,fleece:0xf1e4c6,leather:0x6b3f22,pants:0x34405e,boot:0x4a2c18,sole:0xe9dcc0,glove:0xf3e6c8,scarf:0xe2493b,lens:0x9fe3f0,lensE:0x1d5a66,metal:0x7d858c},
  {name:'Night Flyer',jacket:0x2a3048,fleece:0x8a93a8,leather:0x1b1e28,pants:0x1e2230,boot:0x15171d,sole:0x2bb3a8,glove:0x3a4058,scarf:0x2bb3a8,lens:0xffd84a,lensE:0x6b4a00,metal:0x2f333a},
  {name:'Racer',jacket:0xd83a2e,fleece:0xffffff,leather:0xf4f4f4,pants:0x1f1f24,boot:0xf4f4f4,sole:0xd83a2e,glove:0x1f1f24,scarf:0xffd84a,lens:0x3a3f45,lensE:0x000000,metal:0xc8ccd0},
  {name:'Arctic',jacket:0xe9eff2,fleece:0xffffff,leather:0x7fb3d9,pants:0x5d7a91,boot:0x8a9aa6,sole:0x3d4a55,glove:0x7fb3d9,scarf:0xff8a3d,lens:0xb8f0ff,lensE:0x2a6a80,metal:0xa0a8b0},
  // Off Duty: the stunt pilot on a summer day. Short-sleeve linen pilot shirt (collar, chest pockets, wooden buttons,
  // rolled cuffs), olive shorts, canvas sneakers with gum soles, his own hair with the goggles pushed up on it
  {name:'Off Duty',jacket:0xe3d3ad,fleece:0xf1e6cc,leather:0x6b3f22,pants:0x6f7a4a,boot:0xece4d2,sole:0x9a6a3e,glove:0xe8b087,scarf:0xe2493b,lens:0x9fe3f0,lensE:0x1d5a66,metal:0x8a5a35,
    hide:['cap','scarf','gogStrap'],show:['hair','calves','forearms'],shorts:true},
  // Super Flipper: blue suit, red cape, boots and gloves, gold emblem and belt, domino mask
  {name:'Super Flipper',jacket:0x2a5bd7,fleece:0xffd84a,leather:0xe23b3b,pants:0x2a5bd7,boot:0xe23b3b,sole:0xffd84a,glove:0xe23b3b,scarf:0xe23b3b,lens:0xffd84a,lensE:0x7a5a00,metal:0xffd84a,
    hide:['cap','goggles','gogStrap','scarf','collar','zip','patch'],show:['hair','mask','emblem','belt'],acc:{back:{id:'cape',col:0xe23b3b}}}];
// Parker's wardrobe (jacket / beanie+mittens = leather+glove / headphones+pom = scarf / board = metal)
const OUTFITS_NOVA=[
  {name:'Backcountry',jacket:0xf2b33d,fleece:0xfff4dc,leather:0x2f4f8f,pants:0x3d4a5c,boot:0x2a2a30,sole:0xf2b33d,glove:0x2f4f8f,scarf:0xff5a5f,lens:0x7ff0ff,lensE:0x1d6070,metal:0x1f2a36},
  {name:'Neon Night',jacket:0x1f1f2e,fleece:0x8a5cff,leather:0x8a5cff,pants:0x2a2a3a,boot:0x15151d,sole:0x39ff88,glove:0x39ff88,scarf:0xff3fb4,lens:0xff3fb4,lensE:0x80104f,metal:0x39ff88},
  {name:'Glacier',jacket:0xbfe6ff,fleece:0xffffff,leather:0xffffff,pants:0x5d7a91,boot:0x8a9aa6,sole:0xffffff,glove:0x7fb3d9,scarf:0x2f6fd0,lens:0xb8f0ff,lensE:0x2a6a80,metal:0xe9f6ff},
  {name:'Ember',jacket:0xd8452e,fleece:0x2a2a2a,leather:0x2a2a2a,pants:0x3a3330,boot:0x2a2220,sole:0xffb347,glove:0x2a2a2a,scarf:0xffb347,lens:0xffb347,lensE:0x804000,metal:0x2a2a2a}];
// Vex's wardrobe (hoodie / hair = leather / bandana = scarf / laces, drawstrings, sneaker stripe = fleece / wristbands = glove / bolts = lens / studs, chain = metal)
const OUTFITS_VEX=[
  {name:'Street Punk',jacket:0x2b2733,fleece:0xb6ff3b,leather:0xff3d8b,pants:0x26262e,boot:0x1d1d22,sole:0xf2f2f2,glove:0x1d1d22,scarf:0xe23b3b,lens:0xb6ff3b,lensE:0x4a7a00,metal:0xc8ccd0},
  {name:'Toxic',jacket:0x8fe02e,fleece:0x6b2cff,leather:0x6b2cff,pants:0x1d1d22,boot:0x6b2cff,sole:0x1d1d22,glove:0x6b2cff,scarf:0x1d1d22,lens:0x1d1d22,lensE:0x000000,metal:0x9aa0a8},
  {name:'Bubblegum',jacket:0xff8ac2,fleece:0xffffff,leather:0x37d7ff,pants:0x3a3f6b,boot:0x37d7ff,sole:0xffffff,glove:0xffffff,scarf:0x37d7ff,lens:0xffffff,lensE:0x5a5a7a,metal:0xe8e8f0},
  {name:'Blackout',jacket:0x18181c,fleece:0xff2a2a,leather:0xf4f4f4,pants:0x18181c,boot:0x18181c,sole:0xff2a2a,glove:0xff2a2a,scarf:0xff2a2a,lens:0xff2a2a,lensE:0x7a0000,metal:0x55585e}];
// Tucker's wardrobe (sweater = jacket / zigzag & hem trim = fleece / fur = leather / face & belly = pants / scarf / paw pads
// & nose = boot / horns & claws = sole / cheeks & inner ears = glove / toggles = metal / eyes = lens)
const OUTFITS_TUK=[
  {name:'Cozy',jacket:0xf08a3c,fleece:0xfff1d6,leather:0xf4f7fb,pants:0xc6daec,boot:0x5a6472,sole:0xc9b48f,glove:0xff9aa8,scarf:0x2f6fd0,metal:0x8a5a35,lens:0x37a6e8,lensE:0x0b3a5a},
  {name:'Glacier',jacket:0x2bb3a8,fleece:0xe8fbff,leather:0xcfe6f5,pants:0xf2f9ff,boot:0x3a4f66,sole:0xe8f2fb,glove:0x9fd8ff,scarf:0xf2f2f2,metal:0xd9e6f2,lens:0x2bb3a8,lensE:0x0b4a44},
  {name:'Berry',jacket:0x8e3bb8,fleece:0xffd84a,leather:0xf7e6f0,pants:0xffffff,boot:0x5a3a5e,sole:0xf3c9a8,glove:0xff7db0,scarf:0xffd84a,metal:0xffd84a,lens:0xb070ff,lensE:0x3a1260},
  {name:'Midnight',jacket:0x1f2b4a,fleece:0x8fd0ff,leather:0x9aa3b5,pants:0xd5dbe6,boot:0x1b1f2a,sole:0xe8e8f0,glove:0x8fa8d8,scarf:0xe23b3b,metal:0xc8ccd0,lens:0xffd84a,lensE:0x5a4700}];
const unlocked=(o,list=OUTFITS)=>!list[o].lock;
const OFI={}; // each wardrobe character's current outfit, by character index
function applyOutfit(i){const c=chars[ci];if(!c.outs)return;if(typeof LOOKS!=='undefined'&&LOOKS[ci]){LOOKS[ci].c={};saveLook(ci);applyLook(c.rig,ci,i,LOOKS[ci])}else applyOutfitTo(c.rig.mats,i,c.outs,c.rig)}
// which of the rig's pieces an outfit shows: everything normal, extras hidden, then the outfit's own hide/show/shorts
// cap: undefined = the outfit decides; 1 = wear it; 0 = take it off (his hair shows, goggles pushed up on it)
// Body types (Customize → Outfits): Stout is Flipper's own build; Slender is Parker's: hips higher, legs longer (boots move
// down so his feet stay on the ground), torso narrower and a little taller, shoulders in. The head doesn't change.
const BODY_TYPES=[['stout','Stout'],['slender','Slender']];
function applyBody(rig){if(!rig||!rig.torso)return;const sl=rig._body==='slender',D=sl?.15:0,sh=rig._shorts;
  rig.hp.position.y=rig.hipY+D;rig.torso.scale.set(sl?.85:1,sl?1.08:1,sl?.88:1);
  [rig.armL,rig.armR].forEach((a,i)=>{a.position.x=(i?1:-1)*(sl?.385:.44)});
  (rig.pantsLegs||[]).forEach(m=>{const L=sh?.13:.26+D;m.scale.y=L/.26;m.position.y=-L/2});
  (rig.parts.calves||[]).forEach(m=>{m.scale.y=(.14+D)/.14;m.position.y=-.19-D/2});
  (rig.bootGs||[]).forEach(g=>{g.position.y=-D})}
// soles: 0 = plain boots (no flat soles under them)
function outfitParts(rig,o,cap,soles,gog){if(!rig||!rig.parts)return;const ex=rig.partExtras||[],hide=new Set(o.hide||[]),show=new Set(o.show||[]);
  if(soles===0)hide.add('soles');
  if(rig.parts.cap&&cap!==undefined){if(cap){hide.delete('cap');show.delete('hair');if(!hide.has('goggles'))hide.delete('gogStrap')}else{hide.add('cap');show.add('hair');hide.add('gogStrap')}}
  // goggles: undefined = the outfit decides; 1 = on (resting on his cap or hair); 0 = off
  if(rig.parts.goggles&&gog!==undefined){if(gog){hide.delete('goggles');if(!hide.has('cap'))hide.delete('gogStrap')}else{hide.add('goggles');hide.add('gogStrap')}}
  for(const k in rig.parts){const on=ex.includes(k)?show.has(k):!hide.has(k);rig.parts[k].forEach(m=>{m.visible=on})}
  rig._shorts=!!o.shorts;applyBody(rig);
  // goggles pushed up over hair sit a touch bigger and higher
  if(rig.gogG){const up=show.has('hair');rig.gogG.scale.setScalar(up?1.1:1);rig.gogG.position.set(0,up?.1:0,up?-.03:0)}
  // summer: short sleeves too
  (rig.sleeves||[]).forEach(m=>{m.scale.y=o.shorts?.45:1;m.position.y=o.shorts?-.063:-.14})}
// face options for the Customize Face tab (first = default). A look stores only the choices that differ: L.f.
const FACE_OPTS={eyes:[['round','Round'],['relaxed','Relaxed'],['focused','Focused'],['happy','Happy'],['chill','Chill'],['beady','Beady']],
  brows:[['none','None'],['soft','Soft'],['bold','Bold'],['raised','Raised'],['worried','Worried']],
  mouth:[['smile','Smile'],['calm','Calm'],['grin','Grin'],['smirk','Smirk'],['flat','Flat'],['o','Oh'],['none','None']],
  nshape:[['default','Default'],['big','Big'],['small','Small'],['pointy','Pointy']]};
const FACE_TOGGLES=[['whites','Eye whites'],['shine','Eye shine'],['nose','Nose'],['freckles','Freckles'],['blush','Blush']];
// a face setting: yours, else the character's own default (rig.faceDef), else the first option / on
// everyone's default face: beady eyes, no eye shine, calm mouth, no freckles or blush (a character's own faceDef can add to this)
const FACE_DEF={eyes:'beady',shine:0,mouth:'calm',freckles:0,blush:0};
const faceVal=(rig,f,k)=>f[k]??(rig.faceDef||{})[k]??FACE_DEF[k]??(FACE_OPTS[k]?FACE_OPTS[k][0][0]:1);
function applyFace(rig,f={}){const F=rig.face;if(!F)return;
  for(const k in FACE_OPTS){const pick=faceVal(rig,f,k);for(const st in F[k])F[k][st].visible=st===pick}
  for(const[k]of FACE_TOGGLES)F[k].forEach(m=>{m.visible=faceVal(rig,f,k)!==0});
  // with the whites off, the pupils grow to fill the whole eye: solid dark cartoon eyes
  const solid=faceVal(rig,f,'whites')===0;F.pupils.forEach(p=>{p.position.x=p._s*(solid?.14:.13);p.scale.set(solid?1.6:1,solid?2.35:1,solid?.5:1);p._by=solid?2.35:1});
  rig.eyes=rig.blinkOf[faceVal(rig,f,'eyes')]||rig.blinkOf.round}
// hair: ginger unless the outfit says otherwise; the darker locks are always the same color a shade darker
const HAIR=0xd9692b;
function setHair(M,hex){if(!M.hair)return;M.hair.color.setHex(hex);if(M.hairDark)M.hairDark.color.setHex(hex).multiplyScalar(.82)}
function applyOutfitTo(M,i,list=OUTFITS,rig){const o=list[i];outfitParts(rig,o);setHair(M,o.hair??HAIR);
  ['jacket','fleece','leather','pants','boot','sole','glove','scarf','metal','lens'].forEach(k=>M[k].color.setHex(o[k]));
  M.lens.emissive.setHex(o.lensE);M.rib.color.setHex(o.jacket).multiplyScalar(.78);
  M.jacket.metalness=o.shiny?.55:0;M.jacket.roughness=o.shiny?.35:.75;M.rib.metalness=o.shiny?.4:0;}
// paintable parts per wardrobe character, in Colors-tab order: [material key, label]
const PARTS={Flipper:[['jacket','Jacket'],['fleece','Collar & trim'],['leather','Cap'],['hair','Hair'],['scarf','Scarf'],['pants','Pants'],['boot','Boots'],['sole','Soles'],['glove','Gloves'],['lens','Goggle lenses'],['metal','Goggle frames']],
  Parker:[['jacket','Puffer'],['fleece','Collar & patches'],['leather','Beanie'],['glove','Mittens'],['scarf','Headphones & pom'],['pants','Snow pants'],['boot','Boots'],['sole','Soles & straps'],['metal','Snowboard'],['lens','Board stripe']],
  Tucker:[['jacket','Sweater'],['fleece','Zigzag & trim'],['leather','Fur'],['pants','Face & belly'],['scarf','Scarf'],['glove','Cheeks & ears'],['boot','Nose & paw pads'],['sole','Horns & claws'],['metal','Toggles'],['lens','Eyes']],
  Vex:[['jacket','Hoodie'],['leather','Mohawk'],['scarf','Bandana'],['fleece','Laces & strings'],['lens','Bolts'],['pants','Jeans'],['boot','Sneakers'],['sole','Soles & toe caps'],['glove','Wristbands'],['metal','Studs & chain']]};
const chars=[
  {name:'Sunny',desc:'A bouncy little robot.',speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:body},
  {name:'Rook',desc:'A quick-footed island explorer.',speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:R.root,rig:R},
  {name:'Flipper',desc:'A pint-sized stunt pilot who plays by momentum. Harder to steer, full of tricks.',speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:F.root,rig:F,outs:OUTFITS,ofKey:'orbRunOutfit',acro:true,
   moves:'Shift: crouch · Crouch + Jump: long jump (running) or backflip (standing) · Shift in the air: dive · Jump off a wall mid-air: wall jump · Jump as you land: double and triple jump · Reverse at speed to skid, Jump mid-skid to side flip'}];
chars.push({name:'Parker',desc:'A fearless backcountry snowboarder with a board on her back and beats in her ears. Same trick moveset as Flipper.',speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:NV.root,rig:NV,outs:OUTFITS_NOVA,ofKey:'orbRunOutfitNova',acro:true,moves:chars[2].moves});
chars.push({name:'Vex',desc:'A mouthy skate punk who never asked for your help and won\u2019t say thanks. Same trick moveset as Flipper.',speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:VX.root,rig:VX,outs:OUTFITS_VEX,ofKey:'orbRunOutfitVex',acro:true,moves:chars[2].moves});
chars.push({name:'Tucker',desc:'A yeti cub in a hand-knit sweater. Cuddly, curious, and much bouncier than he looks. Same trick moveset as Flipper.',speed:1.1,jump:9.5,sp:5,jp:4,ag:5,g:TK.root,rig:TK,outs:OUTFITS_TUK,ofKey:'orbRunOutfitTuk',acro:true,moves:chars[2].moves});
// 2.47 renamed Flipper and Parker and dropped the gold outfits, 2.58 renamed Tuk: move old saves over once
try{if(!localStorage.getItem('orbRunWardrobe3')){const L=localStorage.getItem('orbRunLook_Tuk');if(L&&!localStorage.getItem('orbRunLook_Tucker'))localStorage.setItem('orbRunLook_Tucker',L);localStorage.setItem('orbRunWardrobe3','1')}}catch(e){}
try{if(!localStorage.getItem('orbRunWardrobe2')){localStorage.setItem('orbRunWardrobe2','1');
  const v=+localStorage.getItem('orbRunOutfit')||0;if(v>=4)localStorage.setItem('orbRunOutfit',v===4?0:v-1);
  [['Flip','Flipper'],['Nova','Parker']].forEach(([a,b])=>{const L=localStorage.getItem('orbRunLook_'+a);if(L&&!localStorage.getItem('orbRunLook_'+b))localStorage.setItem('orbRunLook_'+b,L)})}}catch(e){}
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
// Flipper is the lead: default pick, first in the select order, then Parker, Vex and Tucker. Sunny and Rook remain as alternates.
// The playable cast: Flipper, Parker and Tucker. Sunny (0), Rook (1) and Vex (4) are benched for now: still built and working,
// just not offered. Put their numbers back in ORDER to bring them back.
const ORDER=[2,3,5];let ci=2;try{const v=localStorage.getItem('orbRunPick');if(v!==null&&ORDER.includes(+v))ci=+v}catch(e){}let pickCi=ci;
let wave=0,bank=0,squash=0,airVy=0,wasG=true,lastFace=0;
