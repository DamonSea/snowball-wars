// Character customization for the wardrobe characters (Flip, Nova, Tuk; Vex too while benched): outfit presets, a color for every part, and
// accessories in three slots (head, face, back). Opened from character select with Customize. Looks save per
// character in this browser and travel in multiplayer presence ("lk"), so friends see them too.
// A look is {c:{part:hex}, a:{top,face,back}, ac:hex|null}: c overrides the preset's colors, ac recolors accessories.
// hair has its own palette: natural shades first, then a few bold ones
const HPAL=[0xd9692b,0x9a3b1e,0xe8995a,0xf0cf72,0xfff0b8,0x9a6a3e,0x5a3a22,0x3a2418,0x1b1b20,0xa8acb2,0xf2f2f2,0xff8ac2,0x37d7ff,0x39c46b,0x6b2cff,0xe23b3b];
const CPAL=[0xffffff,0xd9d9e0,0x8a8f99,0x2b2b33,0x111114,0x5a3a22,0xa8582c,0xe23b3b,0xff8a3d,0xffd84a,0xb6ff3b,0x39c46b,0x2bb3a8,0x37d7ff,0x2f6fd0,0x6b2cff,0xff3fb4,0xff8ac2];
const hexS=n=>'#'+(n>>>0).toString(16).padStart(6,'0');
const accM=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.5,...o});
// ---------- accessory catalog: make(rig, anchor, material) builds it; kind drives its animation ----------
// who: only these characters can wear it (Flipper and Parker share a build). Parker's winter hat and snowboard and
// Flipper's scarf are their own models on them ("native" on the rig); anyone else gets a built copy.
const FP=['Flipper','Parker'],flameMats=()=>[[0xff4a1c,.8],[0xff9a1e,.9],[0xffe25a,.95]].map(([c,o])=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false}));
const ACC={
  top:[
    {id:'flame',label:'Flaming head',col:0xff8a1e,kind:'flame',make(g,a,m,it){const r=a.hr,flameM=flameMats();g.position.y-=r*.3;it.f=[];
      // a crown of flickering tongues (red outside, orange, a yellow core) and embers drifting up
      const tongue=(x,z,h,w,mi,lean)=>{const t=new THREE.Group();t.position.set(x,0,z);g.add(t);const c=new THREE.Group();t.add(c);
        const b=add(new THREE.SphereGeometry(w,12,10),flameM[mi],0,w*.6,0,c);b.castShadow=false;const tp=add(new THREE.ConeGeometry(w*.97,h-w*.6,12),flameM[mi],0,w*.6+(h-w*.6)/2,0,c);tp.castShadow=false;
        t.rotation.set(lean[0],0,lean[1]);t.h=h;it.f.push(t);return t};
      for(let i=0;i<9;i++){const q=i/9*2*PI;tongue(Math.sin(q)*r*.62,Math.cos(q)*r*.58,r*(1.05+(i%3)*.28),r*.36,0,[Math.cos(q)*.42,-Math.sin(q)*.42])}
      for(let i=0;i<6;i++){const q=i/6*2*PI+.3;tongue(Math.sin(q)*r*.36,Math.cos(q)*r*.34,r*(1.2+(i%2)*.3),r*.32,1,[Math.cos(q)*.25,-Math.sin(q)*.25])}
      tongue(0,0,r*1.45,r*.3,2,[0,0]);tongue(.08*r,-.1*r,r*1.1,r*.26,2,[.1,.1]);
      it.e=Array.from({length:6},(_,i)=>{const e=add(new THREE.SphereGeometry(r*.045,5,4),flameM[i%2+1],0,0,0,g);e.castShadow=false;e.p=i/6;e.x=(Math.random()-.5)*r;e.z=(Math.random()-.5)*r;return e})}},
    {id:'beanie',label:'Winter hat',who:FP,col:0x2f4f8f,kind:'beanie',make(g,a,m,it){const k=a.hr/.4,b=-a.top;
      add(new THREE.SphereGeometry(.43*k,22,14,0,2*PI,0,PI/2.1),m,0,b+.06*k,-.01,g);
      const band=add(new THREE.TorusGeometry(.41*k,.065*k,8,24),m,0,b+.08*k,-.01,g);band.rotation.x=PI/2;
      it.c=[];let pp=g,y0=b+.4*k,z0=-.12*k;
      [[.17,.2],[.12,.16]].forEach(([r,h])=>{const s=new THREE.Group();s.position.set(0,y0,z0);pp.add(s);add(new THREE.SphereGeometry(r*k,12,10),m,0,-h*.5*k,0,s).scale.set(1,1.2,1);it.c.push(s);pp=s;y0=-h*k;z0=0});
      const s=new THREE.Group();s.position.set(0,-.18*k,0);pp.add(s);add(new THREE.SphereGeometry(.1*k,10,8),accM(0xf4f1ea,{roughness:.95}),0,-.06*k,0,s);it.c.push(s)}},
    {id:'party',label:'Party hat',col:0xff3fb4,make(g,a,m){add(new THREE.ConeGeometry(.15,.36,16),m,0,.17,0,g);
      add(new THREE.SphereGeometry(.06,10,8),accM(0xffffff),0,.36,0,g);const b=add(new THREE.TorusGeometry(.14,.02,6,18),accM(0xffffff),0,.01,0,g);b.rotation.x=PI/2}},
    {id:'propeller',label:'Propeller cap',col:0x37d7ff,kind:'prop',make(g,a,m,it){add(new THREE.SphereGeometry(.2,16,8,0,2*PI,0,PI/2),m,0,-.04,0,g);
      add(new THREE.CylinderGeometry(.015,.015,.14,6),accM(0x8a8f99,{metalness:.5}),0,.2,0,g);
      const p=new THREE.Group();p.position.y=.27;g.add(p);add(new THREE.BoxGeometry(.2,.02,.07),accM(0xe23b3b),.1,0,0,p);add(new THREE.BoxGeometry(.2,.02,.07),accM(0xffd84a),-.1,0,0,p);it.p=p}},
    {id:'ears',label:'Cat ears',col:0x2b2b33,make(g,a,m){[-1,1].forEach(s=>{const e=add(new THREE.ConeGeometry(.1,.2,4),m,s*a.hr*.5,-.04,0,g);e.rotation.z=-s*.4;
      const i=add(new THREE.ConeGeometry(.055,.12,4),accM(0xff8ac2),s*a.hr*.5,-.06,.04,g);i.rotation.z=-s*.4})}},
    {id:'halo',label:'Halo',col:0xffd84a,kind:'halo',make(g,a,m,it){m.emissive=new THREE.Color(m.color);m.emissiveIntensity=.8;
      const h=add(new THREE.TorusGeometry(.2,.03,8,24),m,0,.25,0,g);h.rotation.x=PI/2;h.castShadow=false;it.h=h}}],
  face:[
    {id:'shades',label:'Shades',col:0x111114,make(g,a,m){m.roughness=.15;m.metalness=.3;[-1,1].forEach(s=>add(new THREE.BoxGeometry(.17,.1,.03),m,s*.14,0,0,g));
      add(new THREE.BoxGeometry(.1,.025,.02),m,0,.025,0,g)}},
    {id:'specs',label:'Round specs',col:0xff3fb4,make(g,a,m){[-1,1].forEach(s=>{add(new THREE.TorusGeometry(.085,.018,8,20),m,s*.14,0,0,g);
      add(new THREE.CircleGeometry(.08,20),accM(0xbfefff,{transparent:true,opacity:.35,roughness:.1}),s*.14,0,-.005,g)});add(new THREE.BoxGeometry(.07,.018,.018),m,0,.01,0,g)}},
    {id:'clown',label:'Clown nose',col:0xe23b3b,make(g,a,m){m.roughness=.2;const[x,y,z]=a.nose;add(new THREE.SphereGeometry(.075,14,10),m,x,y-a.eyeY,z-a.face+.04,g)}}],
  ears:[
    {id:'phones',label:'Headphones',col:0xff5a5f,make(g,a,m){const r=a.hr*1.18;m.roughness=.4;
      const band=add(new THREE.TorusGeometry(r,.03,8,24,PI),m,0,.04,0,g);band.rotation.z=0;
      [-1,1].forEach(s=>{const c=add(new THREE.CylinderGeometry(a.hr*.3,a.hr*.3,.09,16),m,s*(r-.03),-.03,0,g);c.rotation.z=PI/2;
        const l=add(new THREE.CylinderGeometry(a.hr*.16,a.hr*.16,.02,14),accM(0x7ff0ff,{emissive:0x1d6070,roughness:.2}),s*(r+.025),-.03,0,g);l.rotation.z=PI/2})}}],
  neck:[
    {id:'scarf',label:'Scarf',who:FP,col:0xe2493b,kind:'scarf',make(g,a,m,it){m.roughness=.8;
      const ring=add(new THREE.TorusGeometry(a.neckR,.058,8,24),m,0,0,0,g);ring.rotation.x=PI/2;
      it.c=[];let pp=g,y=-.01,z=-a.neckR-.02;for(let i=0;i<3;i++){const s=new THREE.Group();s.position.set(i?0:.05,y,z);pp.add(s);add(new THREE.BoxGeometry(.16-i*.012,.17,.05),m,0,-.085,0,s);it.c.push(s);pp=s;y=-.17;z=0}}}],
  back:[
    {id:'board',label:'Snowboard',who:FP,col:0x1f2a36,make(g,a,m){m.roughness=.35;m.metalness=.3;const b=new THREE.Group();b.position.set(0,.06,-.04);b.rotation.z=.32;g.add(b);
      add(new THREE.BoxGeometry(.32,1.05,.045),m,0,0,0,b);[-1,1].forEach(e=>add(new THREE.CylinderGeometry(.16,.16,.045,18),m,0,e*.525,0,b).rotation.x=PI/2);
      add(new THREE.BoxGeometry(.33,.12,.05),accM(0xff5a5f),0,.12,-.002,b);add(new THREE.BoxGeometry(.33,.05,.05),accM(0x7ff0ff,{emissive:0x1d6070}),0,-.05,-.002,b);
      [-1,1].forEach(e=>add(new THREE.BoxGeometry(.36,.07,.09),accM(0xf2b33d),0,e*.28,.05,b))}},
    {id:'cape',label:'Cape',col:0xe23b3b,kind:'cape',make(g,a,m,it){m.side=THREE.DoubleSide;const c=[];let pp=g,y0=.3,z0=0;
      for(let i=0;i<4;i++){const s=new THREE.Group();s.position.set(0,y0,z0);pp.add(s);add(new THREE.BoxGeometry(.5+i*.06,.2,.025),m,0,-.1,0,s);c.push(s);pp=s;y0=-.2;z0=0}it.c=c}}]};
const ACC_SLOTS=[['top','Head'],['face','Face'],['ears','Ears'],['neck','Neck'],['back','Back']];
// what this character may wear in a slot
const accFor=(slot,ch)=>ACC[slot].filter(i=>!i.who||i.who.includes(chars[ch].name));
// ---------- looks ----------
const LOOKS={};
// a.<slot>: '' = whatever the outfit comes with, 'off' = nothing, else an accessory id
const blankLook=()=>({c:{},a:{top:'',face:'',ears:'',neck:'',back:''},ac:null,f:{},cap:undefined,soles:undefined,body:undefined,gog:undefined,hood:undefined,hc:undefined,acs:undefined});
function cleanLook(L,ch){const o=blankLook();if(!L||typeof L!=='object')return o;const parts=(PARTS[chars[ch].name]||[]).map(p=>p[0]);
  if(L.c&&typeof L.c==='object')for(const k of parts)if(Number.isInteger(L.c[k])&&L.c[k]>=0&&L.c[k]<=0xffffff)o.c[k]=L.c[k];
  if(L.a&&typeof L.a==='object')for(const[s]of ACC_SLOTS)if(L.a[s]==='off'||accFor(s,ch).some(i=>i.id===L.a[s]))o.a[s]=L.a[s];
  if(L.gog===0||L.gog===1)o.gog=L.gog;
  if(L.hood==='reg'||L.hood==='big')o.hood=L.hood;if(Number.isInteger(L.hc)&&L.hc>=0&&L.hc<=0xffffff)o.hc=L.hc;
  const okC=v=>Number.isInteger(v)&&v>=0&&v<=0xffffff;
  if(okC(L.ac))o.ac=L.ac;
  if(L.acs&&typeof L.acs==='object'){const a={};for(const[sl]of ACC_SLOTS)if(okC(L.acs[sl]))a[sl]=L.acs[sl];if(Object.keys(a).length)o.acs=a}
  if(L.cap===0||L.cap===1)o.cap=L.cap;
  if(L.soles===0)o.soles=0;
  if(L.body==='slender')o.body='slender';
  // face: only known styles, and toggles as 0 (off)
  // face: known styles, switches as 0 / 1; anything equal to the character's own default isn't stored
  if(L.f&&typeof L.f==='object'){const rig=chars[ch].rig,dv=k=>faceVal(rig,{},k);
    for(const k in FACE_OPTS)if(FACE_OPTS[k].some(([v])=>v===L.f[k])&&L.f[k]!==dv(k))o.f[k]=L.f[k];
    for(const[k]of FACE_TOGGLES)if((L.f[k]===0||L.f[k]===1)&&L.f[k]!==(dv(k)===0?0:1))o.f[k]=L.f[k]}
  return o}
function saveLook(ch){try{localStorage.setItem('orbRunLook_'+chars[ch].name,JSON.stringify(LOOKS[ch]))}catch(e){}}
function applyLook(rig,ch,of,L){const list=chars[ch].outs;if(!list)return;applyOutfitTo(rig.mats,of,list,rig);
  for(const k in L.c){const M=rig.mats[k];if(!M)continue;M.color.setHex(L.c[k]);if(k==='lens')M.emissive.setHex(L.c[k]).multiplyScalar(.35)}
  if(L.c.jacket!==undefined)rig.mats.rib.color.setHex(L.c.jacket).multiplyScalar(.78);
  if(L.c.hair!==undefined)setHair(rig.mats,L.c.hair);
  rig._body=L.body;if(rig.parts)outfitParts(rig,list[of],L.cap,L.soles,L.gog);
  applyFace(rig,L.f||{});
  buildAcc(rig,L,list[of]);buildHoodie(rig,L)}
// which accessory a slot ends up with: your pick, nothing ('off'), or the outfit's (Super Flipper's cape, and each
// character's own: Flipper's scarf unless the outfit drops it, Parker's winter hat and board)
function accPick(rig,L,o,slot){const v=L.a[slot];if(v==='off')return null;
  const own=ACC[slot].find(i=>i.id===v);if(own)return{def:own,own:true};
  const oa=o&&o.acc&&o.acc[slot];if(oa){const d=ACC[slot].find(i=>i.id===oa.id);if(d)return{def:d,col:oa.col}}
  const da=rig.defAcc&&rig.defAcc[slot];if(da&&!((o&&o.hide)||[]).includes(da)){const d=ACC[slot].find(i=>i.id===da);if(d)return{def:d}}
  return null}
function buildAcc(rig,L,o){(rig.accA||[]).forEach(it=>{freeTree(it.g);_freeHood(it)});rig.accA=[];const a=rig.anc;if(!a)return;const nat=rig.native||{},on={};
  for(const[slot]of ACC_SLOTS){const pk=accPick(rig,L,o,slot);if(!pk)continue;const def=pk.def;on[def.id]=1;
    if(nat[def.id])continue;   // their own model: shown below
    const sc=(L.acs||{})[slot],m=accM(sc??(pk.own?(L.ac??def.col):(pk.col??def.col))),it={kind:def.kind,id:def.id,fromOutfit:!pk.own,slot};
    let g;if(slot==='top'){const pv=new THREE.Group();pv.rotation.z=-(a.tilt||0);rig.head.add(pv);g=new THREE.Group();g.position.y=a.top;pv.add(g);it.g=pv}
    else if(slot==='face'){g=new THREE.Group();g.position.set(0,a.eyeY,a.face);rig.head.add(g);it.g=g}
    else if(slot==='ears'){const pv=new THREE.Group();pv.rotation.z=-(a.tilt||0);rig.head.add(pv);g=new THREE.Group();pv.add(g);it.g=pv}
    else if(slot==='neck'){g=new THREE.Group();g.position.set(0,a.neckY,0);(rig.torso||rig.hp).add(g);it.g=g}
    else{g=new THREE.Group();g.position.set(0,a.backY,a.backZ-(L.hood?L.hood==='big'?.12:.07:0));rig.hp.add(g);it.g=g}
    def.make(g,a,m,it);rig.accA.push(it)}
  // their own gear takes a slot color too: its main material is swapped for a recolored copy (and back)
  const slotOf={};for(const[slot]of ACC_SLOTS){const pk=accPick(rig,L,o,slot);if(pk)slotOf[pk.def.id]=slot}
  for(const id in nat){const key=(rig.natMain||{})[id],main=key&&rig.mats[key],c=on[id]&&(L.acs||{})[slotOf[id]];
    nat[id].forEach(n=>n.traverse(m=>{if(!m.material)return;if(m._om===undefined)m._om=m.material;
      if(c!==undefined&&c!==null&&m._om===main){if(!m._rc){m._rc=main.clone();}m._rc.color.setHex(c);m.material=m._rc}else m.material=m._om}))}
  for(const id in nat)nat[id].forEach(n=>{n.visible=!!on[id];if(id==='board')n.position.z=-.42-(L.hood?L.hood==='big'?.12:.07:0)});
  if(rig.hairTop)rig.hairTop.visible=!on.beanie;
  // a winter hat on Flipper replaces his cap and covers his hair; the goggles sit on its brim
  if(on.beanie&&!nat.beanie&&rig.parts){['cap','hair','gogStrap'].forEach(k=>(rig.parts[k]||[]).forEach(n=>{n.visible=false}));if(rig.gogG){rig.gogG.scale.setScalar(1.05);rig.gogG.position.set(0,.02,.01)}}}
// ---------- hoodie (Accessories tab): regular or oversized, over whatever they're wearing ----------
// Built from the rig's anc.hood (torso size and center, neck height, arm span, sleeve radius). The jacket pieces in
// rig.jk hide under it. The hood flops and the drawstrings swing (accFrame, kind 'hood').
const HOOD_COL=0x8a8f99;
function buildHoodie(rig,L){const h=rig.anc&&rig.anc.hood;if(!h)return;const big=L.hood==='big';
  const parts=new Set(rig.parts?Object.values(rig.parts).flat():[]);
  (rig.jk||[]).forEach(m=>{if(L.hood)m.visible=false;else if(!parts.has(m))m.visible=true});
  if(!L.hood)return;
  const col=L.hc??HOOD_COL,m=accM(col,{roughness:.9}),rib=accM(col,{roughness:.95}),lin=accM(col,{roughness:.95});rib.color.multiplyScalar(.82);lin.color.multiplyScalar(.6);
  const par=rig.torso||rig.hp,g=new THREE.Group();par.add(g);const it={kind:'hood',id:'hoodie',g,big};
  const k=h.r/.42,f=big?1.14:1.05,R=h.r*f,sy=h.s[1]*(big?1.12:1),cy=h.y-(big?.05:0);
  add(new THREE.SphereGeometry(R,20,16),m,0,cy,0,g).scale.set(h.s[0]*(big?1.06:1),sy,h.s[2]);
  // ribbed hem, kangaroo pocket
  const hy=cy-R*sy*.8,hem=add(new THREE.TorusGeometry(R*h.s[0]*(big?.66:.6),.05*k,8,24),rib,0,hy,0,g);hem.rotation.x=PI/2;hem.scale.set(1,h.s[2]/h.s[0],1);
  add(new THREE.BoxGeometry(R*.95,R*sy*.42,.07),m,0,cy-R*sy*.38,R*h.s[2]*.88,g).rotation.x=-.28;
  add(new THREE.BoxGeometry(R*.8,.025,.075),rib,0,cy-R*sy*.17,R*h.s[2]*.93,g).rotation.x=-.28;
  // neckline, then the hood bunched behind the neck on a pivot
  const nk=add(new THREE.TorusGeometry(.21*k*(big?1.08:1),.075*k,8,20),m,0,h.neck,-.02,g);nk.rotation.x=PI/2;
  const hd=new THREE.Group();hd.position.set(0,h.neck+.04,-.2*k);g.add(hd);
  add(new THREE.SphereGeometry(.26*k*(big?1.15:1),14,10),m,0,.02,-.1*k,hd).scale.set(1.3,.9,.75);
  add(new THREE.SphereGeometry(.16*k*(big?1.15:1),12,8),lin,0,.05,-.06*k,hd).scale.set(1.1,.5,.55);it.hd=hd;
  // drawstrings with tips
  it.st=[-1,1].map(s=>{const d=new THREE.Group();d.position.set(s*.08*k,h.neck-.06,R*h.s[2]*.86);g.add(d);
    add(new THREE.CylinderGeometry(.012,.012,.22*(big?1.2:1),5),accM(0xf4f1ea),0,-.11*(big?1.2:1),0,d);add(new THREE.SphereGeometry(.022,6,5),accM(0xc8ccd0,{metalness:.4}),0,-.22*(big?1.2:1),0,d);d.s=s;return d});
  // sleeves over the arms; oversized ones are baggier and run down over the wrists
  it.sl=[rig.armL,rig.armR].map(arm=>{const sg=new THREE.Group();arm.add(sg);const r=h.sr*(big?1.25:1),y0=h.arm[0],y1=h.arm[1]-(big?.05:0),len=y0-y1;
    add(new THREE.SphereGeometry(r*1.03,12,10),m,0,y0,0,sg);add(new THREE.CylinderGeometry(r,r*(big?1.08:.94),len,12),m,0,(y0+y1)/2,0,sg);
    const c=add(new THREE.TorusGeometry(r*.86,.035*k,6,16),rib,0,y1,0,sg);c.rotation.x=PI/2;return sg});
  it.g2=it.sl;rig.accA.push(it)}
const _freeHood=it=>{(it.g2||[]).forEach(x=>freeTree(x))};
// per frame: propeller spins with speed, halo bobs, cape rides the springs
function accFrame(H,dt,sp,air,dv){for(const it of H.accA){
  if(it.kind==='prop')it.p.rotation.y+=dt*(6+sp*2.5+(air?18:0));
  else if(it.kind==='halo'){it.h.position.y=.25+Math.sin(tAll*2.4)*.03;it.h.rotation.z+=dt*.8}
  else if(it.kind==='flame'){const lean=Math.min(.6,sp*.05)+(air?.2:0);it.f.forEach((t,i)=>{const fl=1+.22*Math.sin(tAll*(17+i*3.1)+i)+.12*Math.random();t.scale.set(1,fl,1);t.children[0].rotation.x=lean});
    it.e.forEach(e=>{e.p=(e.p+dt*1.1)%1;e.position.set(e.x*(1-e.p*.5)+Math.sin(tAll*3+e.x*9)*.03,.15+e.p*.75,e.z*(1-e.p*.5)-lean*e.p*.4);e.scale.setScalar(1-e.p)})}
  else if(it.kind==='beanie'){const fl=Math.min(1,sp*.08)+(air?.4:0);it.c.forEach((g,i)=>{g.rotation.x+=((i?.12+fl*.22:.45+fl*.75)+Math.sin(tAll*(5+sp*.6)-i*1.2)*(.05+fl*.08)-g.rotation.x)*Math.min(1,dt*12)})}
  else if(it.kind==='scarf'){const fl=Math.min(1.25,sp*.11)+(air?.35:0);it.c.forEach((g,i)=>{g.rotation.x+=((i?fl*.12:.25+fl)+Math.sin(tAll*(6+sp)-i*1.1)*(.08+fl*.12)-g.rotation.x)*Math.min(1,dt*14)})}
  else if(it.kind==='hood'){const fl=Math.min(1,sp*.08)+(air?.3:0);kick(it.hd,'x',-Math.max(-12,Math.min(12,dv.u))*.35);kick(it.hd,'x',Math.max(-12,Math.min(12,dv.f))*.15);
    spring(it.hd,'x',.05+fl*.25+Math.sin(tAll*(5+sp*.5))*.03*fl,dt,it.big?55:80,6);
    it.st.forEach(d=>{kick(d,'x',-Math.max(-12,Math.min(12,dv.f))*.4);kick(d,'z',Math.max(-12,Math.min(12,dv.s))*.4*d.s);
      spring(d,'x',-fl*.5+Math.sin(tAll*(7+sp)+d.s)*.06*fl,dt,45,4);spring(d,'z',Math.sin(tAll*3+d.s)*.04,dt,45,4)})}
  else if(it.kind==='cape'){const fl=Math.min(1,sp*.09)+(air?.4:0);it.c.forEach((g,i)=>{kick(g,'x',Math.max(-12,Math.min(12,dv.f))*.25);
    spring(g,'x',(i?.12+fl*.2:.18+fl*.9)+Math.sin(tAll*(5+sp*.6)-i*1.2)*(.03+fl*.07),dt,70+i*20,6)})}}}
function loadLooks(){chars.forEach((c,i)=>{if(!c.outs)return;let L=null;try{L=JSON.parse(localStorage.getItem('orbRunLook_'+c.name)||'null')}catch(e){}LOOKS[i]=cleanLook(L,i);applyLook(c.rig,i,OFI[i],LOOKS[i])})}
loadLooks();
// ---------- the Customize panel ----------
const CUST={on:false,tab:'outfit',rot:0,drag:null,rotTo:null,acT:'top'};
// tabs for the current character (Face only where the model has face options)
const custTabs=()=>['outfit','color',...(chars[ci].rig&&chars[ci].rig.face?['face']:[]),'wear','acc'];
function openCust(){if(!chars[ci].outs)return;CUST.on=true;CUST.rot=0;CUST.rotTo=null;$('cs').classList.add('hide');$('cust').classList.remove('hide');renderCust();wave=0;SFX.ui(3);
  setTimeout(()=>{const b=$('cust').querySelector('.ctab.on');b&&b.focus()},50)}
function closeCust(){CUST.on=false;$('cust').classList.add('hide');
  if(CUST.fromPause){CUST.fromPause=false;face=CUST.face0;showPause();return}   // back to the pause menu, facing the way they were
  $('cs').classList.remove('hide');showChar();setTimeout(()=>$('csGo').focus(),50)}
// Pause menu → Edit character: the same dressing room, over the paused game, framed on wherever you're standing
function editCharacter(){if(state!=='paused'||!chars[ci].outs)return;CUST.fromPause=true;CUST.face0=face;overlay(false);openCust();CUST.rot=face;CUST.rotTo=.25}
// every change can be undone (Undo button / Z): a snapshot of the look and outfit goes on a stack first
const CHIST=[];
function snapLook(){CHIST.push({ci,of:OFI[ci],L:JSON.stringify(LOOKS[ci])});if(CHIST.length>40)CHIST.shift();updUndo()}
function undoLook(){let h;while((h=CHIST.pop())&&h.ci!==ci);if(!h){updUndo();SFX.deny();return}
  OFI[ci]=h.of;try{localStorage.setItem(chars[ci].ofKey,h.of)}catch(e){}LOOKS[ci]=cleanLook(JSON.parse(h.L),ci);saveLook(ci);applyLook(chars[ci].rig,ci,OFI[ci],LOOKS[ci]);renderCust();SFX.ui(1);updUndo()}
function updUndo(){const b=$('custUndo');if(b)b.disabled=!CHIST.some(h=>h.ci===ci)}
function setLook(fn,hist=true){const L=LOOKS[ci];if(hist)snapLook();fn(L);saveLook(ci);applyLook(chars[ci].rig,ci,OFI[ci],L);renderCust()}
// turn the character to show what you're changing: their back for back items and hoodies, their front otherwise
function turnTo(slot){CUST.rotTo=slot==='back'?PI*.85:slot===null?null:.25}
// Surprise me: a random face, accessories (each slot about half the time), colors and maybe a hoodie. Undo puts it back.
function surpriseLook(){const r=a=>a[Math.floor(Math.random()*a.length)],rig=chars[ci].rig;
  setLook(L=>{if(rig.face){L.f={};for(const k in FACE_OPTS){const v=r(FACE_OPTS[k])[0];if(v!==faceVal(rig,{},k))L.f[k]=v}}
    L.acs={};for(const[sl]of ACC_SLOTS){const o=accFor(sl,ci);L.a[sl]=o.length&&Math.random()<.55?r(o).id:'off';if(L.a[sl]!=='off')L.acs[sl]=r(CPAL)}
    if(rig.anc&&rig.anc.hood&&Math.random()<.35){L.hood=r(['reg','big']);L.hc=r(CPAL)}else delete L.hood});
  wave=1.6;SFX.ui(5)}
function renderCust(){const c=chars[ci],L=LOOKS[ci],list=c.outs;$('custName').textContent=c.name;updUndo();
  if(CUST.tab==='face'&&CUST.lastTab!=='face')CUST.rotTo=0;CUST.lastTab=CUST.tab;   // the Face tab always turns them to face you
  if(!custTabs().includes(CUST.tab))CUST.tab='outfit';
  document.querySelectorAll('#cust .ctab').forEach(b=>{b.classList.toggle('on',b.dataset.t===CUST.tab);b.setAttribute('aria-selected',b.dataset.t===CUST.tab);b.classList.toggle('hide',!custTabs().includes(b.dataset.t))});
  const sw=(attr,v,cur,label)=>`<button class="sw${cur?' cur':''}" ${attr}="${v}" style="background:${hexS(v)}" aria-label="${label}" title="${label}"></button>`;
  let h='';
  if(CUST.tab==='outfit'){h=(c.rig.torso?`<div class="crow"><span>Body type</span><div class="copts">${BODY_TYPES.map(([v,n])=>`<button class="opt${(L.body||'stout')===v?' on':''}" data-body="${v}">${n}</button>`).join('')}</div></div>`:'')+'<p class="bHelp">Pick a starting outfit. Picking one resets your custom colors (accessories stay).</p><div class="cgrid">'+
    list.map((o,i)=>`<button class="cpre${OFI[ci]===i?' on':''}${unlocked(i,list)?'':' locked'}" data-o="${i}"><i style="background:linear-gradient(135deg,${hexS(o.jacket)} 50%,${hexS(o.scarf)} 50%)"></i>${o.name}${unlocked(i,list)?'':'<small>'+o.lock+'</small>'}</button>`).join('')+'</div>'}
  else if(CUST.tab==='color'){const base=list[OFI[ci]];
    h=(PARTS[c.name]||[]).map(([k,lab])=>{const cur=L.c[k]??base[k]??(k==='hair'?HAIR:undefined);return`<div class="crow"><span>${lab}${L.c[k]!==undefined?` <button class="cundo" data-u="${k}" title="Back to the outfit's color" aria-label="Reset ${lab}">↺</button>`:''}</span><div class="cpal">${(k==='hair'?HPAL:CPAL).map(v=>sw('data-c',v,v===cur,lab+' '+hexS(v))).join('').replace(/data-c=/g,`data-p="${k}" data-c=`)}</div></div>`}).join('')}
  else if(CUST.tab==='face'){const f=L.f||{};
    h=[['eyes','Eyes'],['brows','Eyebrows'],['mouth','Mouth']].map(([k,lab])=>`<div class="crow"><span>${lab}</span><div class="copts">${FACE_OPTS[k].map(([v,n],i)=>`<button class="opt${faceVal(c.rig,f,k)===v?' on':''}" data-fk="${k}" data-fv="${v}">${n}</button>`).join('')}</div></div>`).join('')+
      FACE_TOGGLES.map(([k,n])=>`<div class="crow"><span>${n}</span><div class="copts"><button class="opt${faceVal(c.rig,f,k)!==0?' on':''}" data-fs="${k}" data-fo="1">On</button><button class="opt${faceVal(c.rig,f,k)===0?' on':''}" data-fs="${k}" data-fo="0">Off</button></div></div>`).join('')}
  else if(CUST.tab==='wear'){const o=list[OFI[ci]],P_=c.rig.parts||{},hatOn=(accPick(c.rig,L,o,'top')||{def:{}}).def.id==='beanie',
      row=(lab,btns)=>`<div class="crow"><span>${lab}</span><div class="copts">${btns.map(([attr,v,n,on])=>`<button class="opt${on?' on':''}" ${attr}="${v}">${n}</button>`).join('')}</div></div>`;
    const capOn=L.cap!==undefined?!!L.cap:!(o.hide||[]).includes('cap'),gogOn=L.gog!==undefined?!!L.gog:!(o.hide||[]).includes('goggles');
    h=(P_.cap&&!hatOn?row('Aviator cap',[['data-cap',1,'On',capOn],['data-cap',0,'Off',!capOn]]):'')+
      (c.rig.gogG?row('Goggles',[['data-gog',1,'On head',gogOn],['data-gog',0,'Off',!gogOn]]):'')+
      (P_.soles?row('Shoes',[['data-soles',1,'With soles',L.soles!==0],['data-soles',0,'Plain',L.soles===0]]):'')+
      (c.rig.anc&&c.rig.anc.hood?row('Hoodie',[['','None'],['reg','Regular fit'],['big','Oversized']].map(([v,n])=>['data-hood',v,n,(L.hood||'')===v]))+
        (L.hood?`<div class="crow"><span>Hoodie color</span><div class="cpal">${CPAL.map(v=>sw('data-hc',v,v===(L.hc??HOOD_COL),'Hoodie '+hexS(v))).join('')}</div></div>`:''):'')}
  else{const o=list[OFI[ci]],worn=[];
    h=ACC_SLOTS.map(([s,lab])=>{const opts=accFor(s,ci);if(!opts.length)return'';const pk=accPick(c.rig,L,o,s),cur=pk?pk.def.id:'';if(pk)worn.push([s,lab,pk.def]);
      return`<div class="crow"><span>${lab}</span><div class="copts"><button class="opt${!cur?' on':''}" data-s="${s}" data-a="off">None</button>${opts.map(i=>`<button class="opt${cur===i.id?' on':''}" data-s="${s}" data-a="${i.id}">${i.label}</button>`).join('')}</div></div>`}).join('');
    // one palette for whichever worn accessory you pick above it
    if(worn.length){if(!worn.some(w=>w[0]===CUST.acT))CUST.acT=worn[0][0];const t=worn.find(w=>w[0]===CUST.acT),sc=(L.acs||{})[CUST.acT],
        nk=(c.rig.natMain||{})[t[2].id],cur=sc??(c.rig.native&&c.rig.native[t[2].id]&&nk?c.rig.mats[nk].color.getHex():L.ac??(accPick(c.rig,L,o,CUST.acT).col??t[2].col));
      h+=`<div class="crow"><span>Color${sc!==undefined?` <button class="cundo" data-u="acs" aria-label="Reset ${t[2].label} color">↺</button>`:''}</span>
        <div class="copts acts">${worn.map(([s,lab,d])=>`<button class="opt${s===CUST.acT?' on':''}" data-act="${s}" title="${lab}">${d.label}</button>`).join('')}</div>
        <div class="cpal">${CPAL.map(v=>sw('data-ac',v,v===cur,t[2].label+' '+hexS(v))).join('')}</div></div>`}
    else h+='<p class="bHelp">Nothing on yet. Pick something above.</p>'}
  const a=document.activeElement,key=a&&$('cust').contains(a)?[...a.attributes].filter(x=>x.name.startsWith('data-')).map(x=>`[${x.name}="${x.value}"]`).join(''):'';
  $('custBody').innerHTML=h;
  if(key&&document.body.classList.contains('padnav')){const n=$('cust').querySelector('button'+key);n&&padFocus(n)}}
$('cust').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.t){CUST.tab=d.t;renderCust();SFX.ui(2);return}
  if(b.id==='custDone'){closeCust();SFX.ui(3);return}
  if(b.id==='custReset'){if(!b.dataset.sure){b.dataset.sure='1';b.textContent='Sure?';setTimeout(()=>{delete b.dataset.sure;b.textContent='Reset look'},2500);return}
    setLook(L=>Object.assign(L,blankLook()));SFX.ui(1);return}
  if(b.id==='custUndo'){undoLook();return}
  if(b.id==='custRand'){surpriseLook();return}
  if(d.o!==undefined){snapLook();setOutfit(+d.o);renderCust();return}
  if(d.p){setLook(L=>L.c[d.p]=+d.c);SFX.ui(4);return}
  if(d.u){setLook(L=>{if(d.u==='ac')L.ac=null;else if(d.u==='acs'){if(L.acs)delete L.acs[CUST.acT]}else delete L.c[d.u]});SFX.ui(1);return}
  if(d.act){CUST.acT=d.act;turnTo(d.act);renderCust();SFX.ui(2);return}
  if(d.body){setLook(L=>{if(d.body==='slender')L.body='slender';else delete L.body});SFX.ui(4);return}
  if(d.soles!==undefined){setLook(L=>{if(d.soles==='0')L.soles=0;else delete L.soles});SFX.ui(4);return}
  if(d.cap!==undefined){setLook(L=>{L.cap=+d.cap});SFX.ui(4);return}
  if(d.fk){setLook(L=>{L.f=L.f||{};if(d.fv===faceVal(chars[ci].rig,{},d.fk))delete L.f[d.fk];else L.f[d.fk]=d.fv});SFX.ui(4);return}
  if(d.ft){setLook(L=>{L.f=L.f||{};if(L.f[d.ft]===0)delete L.f[d.ft];else L.f[d.ft]=0});SFX.ui(4);return}
  if(d.fs){setLook(L=>{L.f=L.f||{};const v=+d.fo,def=faceVal(chars[ci].rig,{},d.fs)===0?0:1;if(v===def)delete L.f[d.fs];else L.f[d.fs]=v});SFX.ui(4);return}
  if(d.s){CUST.acT=d.s;turnTo(d.s);setLook(L=>L.a[d.s]=d.a);wave=d.a!=='off'?1.6:0;SFX.ui(d.a!=='off'?5:1);return}
  if(d.gog!==undefined){setLook(L=>{L.gog=+d.gog});SFX.ui(4);return}
  if(d.hood!==undefined){turnTo(d.hood?'back':null);setLook(L=>{if(d.hood)L.hood=d.hood;else delete L.hood});wave=d.hood?1.6:0;SFX.ui(d.hood?5:1);return}
  if(d.hc){setLook(L=>L.hc=+d.hc);SFX.ui(4);return}
  if(d.ac){setLook(L=>{L.acs=L.acs||{};L.acs[CUST.acT]=+d.ac});SFX.ui(4)}});
// turn the character: drag the view, or arrow keys / D-pad
renderer.domElement.addEventListener('pointerdown',e=>{if(CUST.on){CUST.rotTo=null;CUST.drag=e.clientX;renderer.domElement.setPointerCapture(e.pointerId)}});
renderer.domElement.addEventListener('pointermove',e=>{if(CUST.on&&CUST.drag!==null){CUST.rot+=(e.clientX-CUST.drag)*.012;CUST.drag=e.clientX}});
renderer.domElement.addEventListener('pointerup',()=>{CUST.drag=null});
function custKey(code){if(code==='ArrowLeft'||code==='KeyA'){CUST.rotTo=null;CUST.rot-=.5}else if(code==='ArrowRight'||code==='KeyD'){CUST.rotTo=null;CUST.rot+=.5}
  else if(code==='KeyZ')undoLook();
  else if(code==='Escape'){closeCust();return true}else if(code==='KeyQ'||code==='KeyE'){const T=custTabs();CUST.tab=T[(T.indexOf(CUST.tab)+(code==='KeyE'?1:T.length-1))%T.length];renderCust()}return true}
// controller: D-pad / left stick move between controls, ✕ picks, ○ done, L1 / R1 tabs, right stick turns the character
function custPad(L,R,U,D,ok,back,lb,rb,gp){const rx=gp&&gp.axes[2]||0;if(Math.abs(rx)>.2){CUST.rotTo=null;CUST.rot+=rx*.07}
  if(back){closeCust();return}
  if(lb||rb){const T=custTabs();CUST.tab=T[(T.indexOf(CUST.tab)+(rb?1:T.length-1))%T.length];renderCust();const t=$('cust').querySelector('.ctab.on');t&&padFocus(t);$('custBody').scrollTop=0;SFX.ui(2);return}
  panelNav($('cust'),L,R,U,D,ok)}
