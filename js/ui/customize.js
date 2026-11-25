// Character customization for the wardrobe characters (Flip, Nova, Tuk; Vex too while benched): outfit presets, a color for every part, and
// accessories in three slots (head, face, back). Opened from character select with Customize. Looks save per
// character in this browser and travel in multiplayer presence ("lk"), so friends see them too.
// A look is {c:{part:hex}, a:{top,face,back}, ac:hex|null}: c overrides the preset's colors, ac recolors accessories.
const CPAL=[0xffffff,0xd9d9e0,0x8a8f99,0x2b2b33,0x111114,0x5a3a22,0xa8582c,0xe23b3b,0xff8a3d,0xffd84a,0xb6ff3b,0x39c46b,0x2bb3a8,0x37d7ff,0x2f6fd0,0x6b2cff,0xff3fb4,0xff8ac2];
const hexS=n=>'#'+(n>>>0).toString(16).padStart(6,'0');
const accM=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.5,...o});
// ---------- accessory catalog: make(rig, anchor, material) builds it; kind drives its animation ----------
const ACC={
  top:[
    {id:'crown',label:'Crown',col:0xffd84a,make(g,a,m){m.metalness=.25;m.roughness=.35;m.emissive=new THREE.Color(m.color);m.emissiveIntensity=.25;const r=a.hr*.5;
      const band=add(new THREE.CylinderGeometry(r,r*1.05,.14,14,1,true),m,0,.06,0,g);band.material.side=THREE.DoubleSide;
      for(let i=0;i<6;i++){const t=i/6*2*PI;add(new THREE.ConeGeometry(.04,.13,5),m,Math.sin(t)*r,.19,Math.cos(t)*r,g)}
      add(new THREE.SphereGeometry(.04,8,6),accM(0xe23b3b,{roughness:.2}),0,.06,r+.01,g)}},
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
    {id:'stache',label:'Mustache',col:0x3a2418,make(g,a,m){const[x,y,z]=a.nose;[-1,1].forEach(s=>{const b=add(new THREE.SphereGeometry(.07,10,8),m,x+s*.07,y-.06-a.eyeY,z-a.face+.01,g);b.scale.set(1.5,.55,.6);b.rotation.z=s*.25;
      add(new THREE.SphereGeometry(.03,8,6),m,x+s*.16,y-.03-a.eyeY,z-a.face-.01,g)})}},
    {id:'clown',label:'Clown nose',col:0xe23b3b,make(g,a,m){m.roughness=.2;const[x,y,z]=a.nose;add(new THREE.SphereGeometry(.075,14,10),m,x,y-a.eyeY,z-a.face+.04,g)}}],
  back:[
    {id:'pack',label:'Backpack',col:0xff8a3d,make(g,a,m){add(new THREE.BoxGeometry(.42,.46,.22),m,0,0,-.08,g);const d=m.clone();d.color.multiplyScalar(.75);
      add(new THREE.BoxGeometry(.3,.18,.07),d,0,-.1,-.21,g);[-1,1].forEach(s=>{const st=add(new THREE.BoxGeometry(.05,.04,.66),d,s*.15,.27,.2,g);st.rotation.x=.3})}},
    {id:'cape',label:'Cape',col:0xe23b3b,kind:'cape',make(g,a,m,it){m.side=THREE.DoubleSide;const c=[];let pp=g,y0=.3,z0=0;
      for(let i=0;i<4;i++){const s=new THREE.Group();s.position.set(0,y0,z0);pp.add(s);add(new THREE.BoxGeometry(.5+i*.06,.2,.025),m,0,-.1,0,s);c.push(s);pp=s;y0=-.2;z0=0}it.c=c}},
    {id:'jet',label:'Jetpack',col:0xc8ccd0,kind:'jet',make(g,a,m,it){m.metalness=.6;m.roughness=.3;it.f=[];
      [-1,1].forEach(s=>{add(new THREE.CylinderGeometry(.1,.1,.4,12),m,s*.12,0,-.1,g);add(new THREE.SphereGeometry(.1,12,8),m,s*.12,.2,-.1,g);
        add(new THREE.ConeGeometry(.07,.1,10),accM(0x2b2b33),s*.12,-.24,-.1,g).rotation.x=PI;
        const f=add(new THREE.ConeGeometry(.06,.3,8),new THREE.MeshBasicMaterial({color:0xffa830,transparent:true,opacity:.85}),s*.12,-.44,-.1,g);f.rotation.x=PI;f.castShadow=false;f.visible=false;it.f.push(f)})}},
    {id:'wings',label:'Wings',col:0xffffff,kind:'wings',make(g,a,m,it){it.w=[-1,1].map(s=>{const w=new THREE.Group();w.position.set(s*.1,.15,-.05);g.add(w);
      for(let i=0;i<3;i++){const f=add(new THREE.SphereGeometry(.2,12,8),m,s*(.2+i*.05),-.05-i*.08,0,w);f.scale.set(1.2-i*.25,.35,.12);f.rotation.z=s*(.35+i*.2)}w.s=s;return w})}}]};
const ACC_SLOTS=[['top','Head'],['face','Face'],['back','Back']];
// ---------- looks ----------
const LOOKS={};
const blankLook=()=>({c:{},a:{top:'',face:'',back:''},ac:null});
function cleanLook(L,ch){const o=blankLook();if(!L||typeof L!=='object')return o;const parts=(PARTS[chars[ch].name]||[]).map(p=>p[0]);
  if(L.c&&typeof L.c==='object')for(const k of parts)if(Number.isInteger(L.c[k])&&L.c[k]>=0&&L.c[k]<=0xffffff)o.c[k]=L.c[k];
  if(L.a&&typeof L.a==='object')for(const[s]of ACC_SLOTS)if(ACC[s].some(i=>i.id===L.a[s]))o.a[s]=L.a[s];
  if(Number.isInteger(L.ac)&&L.ac>=0&&L.ac<=0xffffff)o.ac=L.ac;return o}
function saveLook(ch){try{localStorage.setItem('orbRunLook_'+chars[ch].name,JSON.stringify(LOOKS[ch]))}catch(e){}}
function applyLook(rig,ch,of,L){const list=chars[ch].outs;if(!list)return;applyOutfitTo(rig.mats,of,list,rig);
  for(const k in L.c){const M=rig.mats[k];if(!M)continue;M.color.setHex(L.c[k]);if(k==='lens')M.emissive.setHex(L.c[k]).multiplyScalar(.35)}
  if(L.c.jacket!==undefined)rig.mats.rib.color.setHex(L.c.jacket).multiplyScalar(.78);
  buildAcc(rig,L,list[of])}
// your accessories, plus any the outfit comes with (Super Flip's cape) in slots you've left empty
function buildAcc(rig,L,o){(rig.accA||[]).forEach(it=>freeTree(it.g));rig.accA=[];const a=rig.anc;if(!a)return;
  for(const[slot]of ACC_SLOTS){const own=ACC[slot].find(i=>i.id===L.a[slot]),oa=!own&&o&&o.acc&&o.acc[slot],def=own||(oa&&ACC[slot].find(i=>i.id===oa.id));if(!def)continue;
    const m=accM(own?(L.ac??def.col):oa.col),it={kind:def.kind,id:def.id,fromOutfit:!own};
    let g;if(slot==='top'){const pv=new THREE.Group();pv.rotation.z=-(a.tilt||0);rig.head.add(pv);g=new THREE.Group();g.position.y=a.top;pv.add(g);it.g=pv}
    else if(slot==='face'){g=new THREE.Group();g.position.set(0,a.eyeY,a.face);rig.head.add(g);it.g=g}
    else{g=new THREE.Group();g.position.set(0,a.backY,a.backZ);rig.hp.add(g);it.g=g}
    def.make(g,a,m,it);rig.accA.push(it)}
  if(rig.board)rig.board.visible=!L.a.back&&!(o&&o.acc&&o.acc.back)}
// per frame: propeller spins with speed, halo bobs, jetpack fires in the air, wings flap, cape rides the springs
function accFrame(H,dt,sp,air,dv){for(const it of H.accA){
  if(it.kind==='prop')it.p.rotation.y+=dt*(6+sp*2.5+(air?18:0));
  else if(it.kind==='halo'){it.h.position.y=.25+Math.sin(tAll*2.4)*.03;it.h.rotation.z+=dt*.8}
  else if(it.kind==='jet')it.f.forEach(f=>{f.visible=air;f.scale.set(1,.7+Math.random()*.6,1)});
  else if(it.kind==='wings')it.w.forEach(w=>{const t=air?Math.sin(tAll*16)*.7:.15*Math.sin(tAll*2);w.rotation.y=w.s*(-.3+t);w.rotation.z=w.s*(air?.2:0)});
  else if(it.kind==='cape'){const fl=Math.min(1,sp*.09)+(air?.4:0);it.c.forEach((g,i)=>{kick(g,'x',Math.max(-12,Math.min(12,dv.f))*.25);
    spring(g,'x',(i?.12+fl*.2:.18+fl*.9)+Math.sin(tAll*(5+sp*.6)-i*1.2)*(.03+fl*.07),dt,70+i*20,6)})}}}
function loadLooks(){chars.forEach((c,i)=>{if(!c.outs)return;let L=null;try{L=JSON.parse(localStorage.getItem('orbRunLook_'+c.name)||'null')}catch(e){}LOOKS[i]=cleanLook(L,i);applyLook(c.rig,i,OFI[i],LOOKS[i])})}
loadLooks();
// ---------- the Customize panel ----------
const CUST={on:false,tab:'outfit',rot:0,drag:null};
function openCust(){if(!chars[ci].outs)return;CUST.on=true;CUST.rot=0;$('cs').classList.add('hide');$('cust').classList.remove('hide');renderCust();wave=0;SFX.ui(3);
  setTimeout(()=>{const b=$('cust').querySelector('.ctab.on');b&&b.focus()},50)}
function closeCust(){CUST.on=false;$('cust').classList.add('hide');$('cs').classList.remove('hide');showChar();setTimeout(()=>$('csGo').focus(),50)}
function setLook(fn){const L=LOOKS[ci];fn(L);saveLook(ci);applyLook(chars[ci].rig,ci,OFI[ci],L);renderCust()}
function renderCust(){const c=chars[ci],L=LOOKS[ci],list=c.outs;$('custName').textContent=c.name;
  document.querySelectorAll('#cust .ctab').forEach(b=>{b.classList.toggle('on',b.dataset.t===CUST.tab);b.setAttribute('aria-selected',b.dataset.t===CUST.tab)});
  const sw=(attr,v,cur,label)=>`<button class="sw${cur?' cur':''}" ${attr}="${v}" style="background:${hexS(v)}" aria-label="${label}" title="${label}"></button>`;
  let h='';
  if(CUST.tab==='outfit'){h='<p class="bHelp">Pick a starting outfit. Picking one resets your custom colors (accessories stay).</p><div class="cgrid">'+
    list.map((o,i)=>`<button class="cpre${OFI[ci]===i?' on':''}${unlocked(i,list)?'':' locked'}" data-o="${i}"><i style="background:linear-gradient(135deg,${hexS(o.jacket)} 50%,${hexS(o.scarf)} 50%)"></i>${o.name}${unlocked(i,list)?'':'<small>'+o.lock+'</small>'}</button>`).join('')+'</div>'}
  else if(CUST.tab==='color'){const base=list[OFI[ci]];
    h=(PARTS[c.name]||[]).map(([k,lab])=>{const cur=L.c[k]??base[k];return`<div class="crow"><span>${lab}${L.c[k]!==undefined?` <button class="cundo" data-u="${k}" title="Back to the outfit's color" aria-label="Reset ${lab}">↺</button>`:''}</span><div class="cpal">${CPAL.map(v=>sw('data-c',v,v===cur,lab+' '+hexS(v))).join('').replace(/data-c=/g,`data-p="${k}" data-c=`)}</div></div>`}).join('')}
  else{h=ACC_SLOTS.map(([s,lab])=>`<div class="crow"><span>${lab}</span><div class="copts"><button class="opt${!L.a[s]?' on':''}" data-s="${s}" data-a="">None</button>${ACC[s].map(i=>`<button class="opt${L.a[s]===i.id?' on':''}" data-s="${s}" data-a="${i.id}">${i.label}</button>`).join('')}</div></div>`).join('')+
    `<div class="crow"><span>Accessory color${L.ac!==null?' <button class="cundo" data-u="ac" aria-label="Reset accessory color">↺</button>':''}</span><div class="cpal">${CPAL.map(v=>sw('data-ac',v,v===L.ac,'Accessory '+hexS(v))).join('')}</div></div>`}
  const a=document.activeElement,key=a&&$('cust').contains(a)?[...a.attributes].filter(x=>x.name.startsWith('data-')).map(x=>`[${x.name}="${x.value}"]`).join(''):'';
  $('custBody').innerHTML=h;
  if(key&&document.body.classList.contains('padnav')){const n=$('cust').querySelector('button'+key);n&&padFocus(n)}}
$('cust').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.t){CUST.tab=d.t;renderCust();SFX.ui(2);return}
  if(b.id==='custDone'){closeCust();SFX.ui(3);return}
  if(b.id==='custReset'){if(!b.dataset.sure){b.dataset.sure='1';b.textContent='Sure?';setTimeout(()=>{delete b.dataset.sure;b.textContent='Reset look'},2500);return}
    setLook(L=>Object.assign(L,blankLook()));SFX.ui(1);return}
  if(d.o!==undefined){setOutfit(+d.o);renderCust();return}
  if(d.p){setLook(L=>L.c[d.p]=+d.c);SFX.ui(4);return}
  if(d.u){setLook(L=>{if(d.u==='ac')L.ac=null;else delete L.c[d.u]});SFX.ui(1);return}
  if(d.s){setLook(L=>L.a[d.s]=d.a);wave=d.a?1.6:0;SFX.ui(d.a?5:1);return}
  if(d.ac){setLook(L=>L.ac=+d.ac);SFX.ui(4)}});
// turn the character: drag the view, or arrow keys / D-pad
renderer.domElement.addEventListener('pointerdown',e=>{if(CUST.on){CUST.drag=e.clientX;renderer.domElement.setPointerCapture(e.pointerId)}});
renderer.domElement.addEventListener('pointermove',e=>{if(CUST.on&&CUST.drag!==null){CUST.rot+=(e.clientX-CUST.drag)*.012;CUST.drag=e.clientX}});
renderer.domElement.addEventListener('pointerup',()=>{CUST.drag=null});
function custKey(code){if(code==='ArrowLeft'||code==='KeyA')CUST.rot-=.5;else if(code==='ArrowRight'||code==='KeyD')CUST.rot+=.5;
  else if(code==='Escape'){closeCust();return true}else if(code==='KeyQ'||code==='KeyE'){const T=['outfit','color','acc'];CUST.tab=T[(T.indexOf(CUST.tab)+(code==='KeyE'?1:2))%3];renderCust()}return true}
// controller: D-pad / left stick move between controls, ✕ picks, ○ done, L1 / R1 tabs, right stick turns the character
function custPad(L,R,U,D,ok,back,lb,rb,gp){const rx=gp&&gp.axes[2]||0;if(Math.abs(rx)>.2)CUST.rot+=rx*.07;
  if(back){closeCust();return}
  if(lb||rb){const T=['outfit','color','acc'];CUST.tab=T[(T.indexOf(CUST.tab)+(rb?1:2))%3];renderCust();const t=$('cust').querySelector('.ctab.on');t&&padFocus(t);$('custBody').scrollTop=0;SFX.ui(2);return}
  panelNav($('cust'),L,R,U,D,ok)}
