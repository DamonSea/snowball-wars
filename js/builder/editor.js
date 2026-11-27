// Map Builder: a top-down editor for custom Trick Park maps.
//  Pick an asset in the library and click the ground to place it (the tool stays active for more; Esc goes
//  back to Select). With Select, click an item to edit it in the inspector and drag it to move it; drag
//  empty ground, or right-drag, to pan; the wheel zooms. Keys: Delete removes, Ctrl+Z / Ctrl+Y undo and redo,
//  Ctrl+D duplicates, R rotates, arrows nudge (Shift for more), [ and ] lower and raise, WASD pans.
//  Test drops you into the map to play it; pause and choose Back to builder. Drafts save as you go.
const BLD={map:null,sel:-1,tool:'select',tab:'Structures',q:'',view:'angle',undo:[],redo:[],prev:null,ghost:null,cam:{x:0,z:3,dist:36,yaw:0,pitch:1.107},cs:{x:0,z:3,dist:36,yaw:0,pitch:1.107},orbit:null,drag:null,pan:null,cursor:null,testing:false,dirty:false,saveT:null};
const SNAP=.5,snap=v=>Math.round(v/SNAP)*SNAP;
// ----- 3D helpers: grid, placement ghost, selection box -----
const bGrid=(()=>{const cv=document.createElement('canvas');cv.width=cv.height=1024;const x=cv.getContext('2d');x.clearRect(0,0,1024,1024);
  for(let i=0;i<=56;i++){const p=i/56*1024;x.strokeStyle=i%5===0?'rgba(40,80,110,.5)':'rgba(40,80,110,.22)';x.lineWidth=i%5===0?2.2:1.1;x.beginPath();x.moveTo(p,0);x.lineTo(p,1024);x.stroke();x.beginPath();x.moveTo(0,p);x.lineTo(1024,p);x.stroke()}
  const m=new THREE.Mesh(new THREE.PlaneGeometry(56,56),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false}));m.rotation.x=-PI/2;m.position.y=.04;m.visible=false;scene.add(m);return m})();
const bGhost=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xffd84a,transparent:true,opacity:.16,depthWrite:false}));bGhost.visible=false;scene.add(bGhost);
const bSel=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0x5ff3ff,wireframe:true}));bSel.visible=false;scene.add(bSel);
const fitBox=(m,b)=>{const h=Math.max(.15,b.top);m.position.set(b.x,h/2,b.z);m.scale.set(b.w+.08,h+.08,b.d+.08)};
// ----- open / close -----
function openBuilder(map){BLD.map=cleanMap(map||blankMap());BLD.sel=-1;BLD.tool='select';BLD.undo=[];BLD.redo=[];BLD.testing=false;
  state='build';overlay(false);$('cs').classList.add('hide');closeMapsPanel();closeSet();setWorld('none');P.visible=false;if(CPU.a)CPU.a.g.visible=false;
  document.body.classList.add('building');$('bld').classList.remove('hide');$('bName').value=BLD.map.name;bGrid.visible=true;
  setView('angle',true);renderLib();renderInsp();rebuildPreview();setStatus('')}
function closeBuilder(){saveDraftNow();BLD.testing=false;dropPreview();dropGhost();bGrid.visible=bGhost.visible=bSel.visible=false;document.body.classList.remove('building');$('bld').classList.add('hide');P.visible=true}
function exitBuilder(){closeBuilder();openMapsPanel()}
function dropPreview(){if(BLD.prev){freeTree(BLD.prev.grp);BLD.prev=null}}
function rebuildPreview(){dropPreview();BLD.prev=buildCustom(BLD.map,true);BLD.prev.grp.visible=true;BLD.dirty=false;updateSelBox()}
function updateSelBox(){const it=BLD.map.items[BLD.sel];bSel.visible=!!it&&state==='build';if(it)fitBox(bSel,itemBox(it))}
// ----- edits (every change goes through here: undo snapshot, rebuild, autosave) -----
const snapMap=()=>JSON.stringify(BLD.map);
function pushUndo(){BLD.undo.push(snapMap());if(BLD.undo.length>100)BLD.undo.shift();BLD.redo=[]}
function changed(){BLD.map=cleanMap(BLD.map);rebuildPreview();renderInsp();queueSave()}
function undo(){if(!BLD.undo.length)return;BLD.redo.push(snapMap());BLD.map=JSON.parse(BLD.undo.pop());BLD.sel=Math.min(BLD.sel,BLD.map.items.length-1);$('bName').value=BLD.map.name;changed();SFX.ui(2)}
function redo(){if(!BLD.redo.length)return;BLD.undo.push(snapMap());BLD.map=JSON.parse(BLD.redo.pop());$('bName').value=BLD.map.name;changed();SFX.ui(3)}
function placeAt(t,x,z){const A=ASSETS[t];if(!A)return -1;
  if(BLD.map.items.length>=MAP_LIMIT){toast(`That's the limit: ${MAP_LIMIT} items per map.`);SFX.deny();return -1}
  pushUndo();x=snap(x);z=snap(z);
  if(A.unique){const i=BLD.map.items.findIndex(q=>q.t===t);if(i>=0){Object.assign(BLD.map.items[i],{x,z});BLD.sel=i;changed();SFX.ui(3);return i}}
  BLD.map.items.push({t,x,z,...JSON.parse(JSON.stringify(A.def))});BLD.sel=BLD.map.items.length-1;changed();SFX.ui(3);return BLD.sel}
function delSel(){const it=BLD.map.items[BLD.sel];if(!it)return;if(ASSETS[it.t].required){toast('Every map needs a '+ASSETS[it.t].label+'. Drag it to move it.');return}
  pushUndo();BLD.map.items.splice(BLD.sel,1);BLD.sel=-1;changed();SFX.ui(1)}
function dupSel(){const it=BLD.map.items[BLD.sel];if(!it||ASSETS[it.t].unique)return;if(BLD.map.items.length>=MAP_LIMIT)return;
  pushUndo();BLD.map.items.push({...it,x:it.x+1,z:it.z+1});BLD.sel=BLD.map.items.length-1;changed();SFX.ui(3)}
function rotSel(){const it=BLD.map.items[BLD.sel];if(!it||!('w' in it||'dir' in it))return;pushUndo();if('w' in it)[it.w,it.d]=[it.d,it.w];if('dir' in it)it.dir=(it.dir+1)%4;changed();SFX.ui(2)}
function setField(k,v){const it=BLD.map.items[BLD.sel];if(!it)return;pushUndo();it[k]=v;changed()}
function nudge(dx,dz){const it=BLD.map.items[BLD.sel];if(!it)return;pushUndo();it.x=snap(it.x+dx);it.z=snap(it.z+dz);changed()}
function raise(d){const it=BLD.map.items[BLD.sel];if(!it)return;const k='h' in it?'h':'y' in it?'y':null;if(!k)return;const F=FIELDS[k];pushUndo();it[k]=Math.max(F[1],Math.min(F[2],+(it[k]+d).toFixed(2)));changed()}
// ----- autosave to drafts -----
function queueSave(){setStatus('Saving…');clearTimeout(BLD.saveT);BLD.saveT=setTimeout(saveDraftNow,500)}
function saveDraftNow(){clearTimeout(BLD.saveT);if(!BLD.map)return;saveDraft(BLD.map);setStatus('Saved')}
function setStatus(t){$('bSave').textContent=t}
// ----- library and inspector -----
// ----- asset library: tabs, search, and a picture of every asset -----
const LIB_TABS=[['Structures','▣'],['Play','⤒'],['Objectives','⚑'],['Nature','♣'],['Village','🎄'],['City','🏢']];
const thumbImg=(k,A)=>THUMB.url[k]?`<img src="${THUMB.url[k]}" alt="">`:`<i>${A.icon}</i>`;
function renderLib(){const q=BLD.q.trim().toLowerCase(),L=Object.entries(ASSETS).filter(([k,A])=>q?(A.label+' '+A.cat+' '+A.tip).toLowerCase().includes(q):A.cat===BLD.tab);
  $('bLib').innerHTML=`<div class="bLibTop"><button class="bTool bSelT${BLD.tool==='select'?' on':''}" data-tool="select" title="Select, move and edit items (Esc)"><i>⮞</i>Select</button>
    <input id="bFind" type="search" placeholder="Find…" aria-label="Find an asset" value="${BLD.q.replace(/"/g,'')}"></div>
    <div class="bTabs" role="tablist">${LIB_TABS.map(([c,ic])=>`<button role="tab" class="bTab${!q&&BLD.tab===c?' on':''}" data-tab="${c}" aria-selected="${!q&&BLD.tab===c}" title="${c}"><i>${ic}</i><span>${c}</span></button>`).join('')}</div>
    <h4>${q?`Results for “${BLD.q.replace(/[<>"]/g,'')}”`:BLD.tab}</h4>
    <div class="bGridL">${L.map(([k,A])=>`<button class="bTile${BLD.tool===k?' on':''}" data-tool="${k}" title="${A.tip}" aria-label="${A.label}"><span class="bTh" data-th="${k}">${thumbImg(k,A)}</span><b>${A.label}</b></button>`).join('')||'<p class="bHelp">Nothing matches.</p>'}</div>
    <p class="bHelp bTipL" id="bTipL">${BLD.tool!=='select'?ASSETS[BLD.tool].tip:'Pick something to place, then click the ground.'}</p>`;
  const f=$('bFind');if(BLD.focusFind){BLD.focusFind=false;f.focus();f.setSelectionRange(f.value.length,f.value.length)}
  queueThumbs()}
// pictures: each asset is built on its own and photographed once with a small second renderer
const THUMB={url:{},r:null,scene:null,cam:null,todo:[],busy:false,dead:false};
function thumbKit(){if(THUMB.r||THUMB.dead)return!!THUMB.r;try{const r=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
    if(!r.domElement||!r.domElement.toDataURL||!r.getContext||!r.getContext())throw 0;r.setPixelRatio(1);r.setSize(112,112);r.outputEncoding=renderer.outputEncoding;r.toneMapping=renderer.toneMapping;r.setClearColor(0x000000,0);
    const s=new THREE.Scene();s.add(new THREE.HemisphereLight(0xffffff,0x8a9aa8,.95));const d=new THREE.DirectionalLight(0xffffff,.9);d.position.set(4,9,6);s.add(d);
    THUMB.r=r;THUMB.scene=s;THUMB.cam=new THREE.PerspectiveCamera(32,1,.1,200);return true}catch(e){THUMB.dead=true;return false}}
function queueThumbs(){if(THUMB.busy||!thumbKit())return;THUMB.todo=Object.keys(ASSETS).filter(k=>!THUMB.url[k]);if(!THUMB.todo.length)return;THUMB.busy=true;
  const step=()=>{const k=THUMB.todo.shift();if(!k||state!=='build'){THUMB.busy=false;return}try{makeThumb(k)}catch(e){}setTimeout(step,16)};setTimeout(step,30)}
function assetModel(t,preview=true){const A=ASSETS[t],it={t,x:0,z:0,...JSON.parse(JSON.stringify(A.def))},M=buildCustom({items:[it]},preview,t),g=M.grp;g.visible=true;
  if(t==='orb'){add(new THREE.OctahedronGeometry(.42,0),new THREE.MeshStandardMaterial({color:0x5ff3ff,emissive:0x2fc6ff,emissiveIntensity:.8}),0,1.4,0,g)}
  if(t==='roller'){add(new THREE.SphereGeometry(.7,16,12),mat(0xf4f8fb),0,.7,0,g)}
  return{g,M,box:itemBox(it)}}
function makeThumb(k){const{g,box}=assetModel(k);scene.remove(g);THUMB.scene.add(g);
  const top=Math.max(.6,box.top),sz=Math.max(box.w,box.d,top*.9,1.2),c=THUMB.cam,dist=sz*1.05/Math.tan(16*PI/180)*.62+.5;
  c.position.set(dist*.62,top*.5+dist*.48,dist*.78);c.lookAt(0,top*.45,0);THUMB.r.render(THUMB.scene,c);THUMB.url[k]=THUMB.r.domElement.toDataURL('image/png');freeTree(g);
  document.querySelectorAll(`[data-th="${k}"]`).forEach(e=>e.innerHTML=`<img src="${THUMB.url[k]}" alt="">`)}
// the ghost: a see-through copy of what you're about to place, following the pointer
function dropGhost(){if(BLD.ghost){freeTree(BLD.ghost.g);BLD.ghost=null}}
function makeGhost(t){dropGhost();if(t==='select'||!ASSETS[t])return;const{g,M}=assetModel(t,false);g.traverse(m=>{if(!m.material)return;const o=m.material;
    m.material=Array.isArray(o)?o.map(x=>x.clone()):o.clone();for(const x of Array.isArray(m.material)?m.material:[m.material]){x.transparent=true;x.opacity=.5;x.depthWrite=false}
    for(const x of Array.isArray(o)?o:[o])if(!KEEP.has(x)&&x.dispose)x.dispose();m.castShadow=false});
  g.visible=false;BLD.ghost={g,t,waves:M.waves}}
function renderInsp(){const it=BLD.map.items[BLD.sel],el=$('bInsp');
  if(!it){const n=BLD.map.items.length,O=BLD.map.opt||{},has=t=>BLD.map.items.some(i=>i.t===t);
    const warn=[];if(O.orbs&&!has('start'))warn.push('Collectathon is on, but there\u2019s no PLAY pad.');if(O.flags&&!has('finish'))warn.push('Flag race is on: add a Finish flag.');
    if(!O.flags&&(has('finish')||has('checkpoint')))warn.push('Flags are placed, but Flag race is off.');
    const sets=`<h3>Map settings</h3>${Object.entries(MAP_OPTS).map(([k,[lab]])=>`<div class="bRow"><span>${lab}</span><button class="bTog${O[k]?' on':''}" data-opt="${k}" aria-pressed="${!!O[k]}">${O[k]?'On':'Off'}</button></div>`).join('')}
      <p class="bHelp">Collectathon: stand on the PLAY pad, then collect as many orbs as you can before time runs out. Flag race: get from the spawn point to the Finish flag; checkpoints save your spot.</p>${warn.map(w=>`<p class="bHelp bWarn">${w}</p>`).join('')}<hr class="bHr">`;
    el.innerHTML=sets+`<h3>${BLD.tool==='select'?'Select':ASSETS[BLD.tool].label}</h3><p class="bHelp">${BLD.tool==='select'?'Click an item to edit it, drag to move it. Drag empty ground to pan, right-drag to orbit, wheel to zoom.':'Click the ground to place one. Keep clicking for more; Esc goes back to Select.'}</p>
    <p class="bHelp"><b>Keys</b>: Delete remove · Ctrl+Z undo · Ctrl+Y redo · Ctrl+D duplicate · R rotate · arrows nudge · [ ] lower/raise · WASD pan · Q/E turn the view · V change view · F focus on the selection</p>
    <p class="bHelp">${n}/${MAP_LIMIT} items. Heights: a jump clears about 1.9, a double jump 2.6, triple 4, backflip 4.7, wall jumps climb any wall gap about 3 wide, ledge hang reaches about 1.9 above a jump.</p>`;return}
  const A=ASSETS[it.t];
  const row=k=>{const[F,lo,hi,st]=FIELDS[k];if(k==='c')return`<div class="bRow"><span>Color</span><div class="bSw">${PALETTE.map((p,i)=>`<button class="sw${it.c===i?' cur':''}" data-c="${i}" style="background:#${p.toString(16).padStart(6,'0')}" aria-label="Color ${i+1}"></button>`).join('')}</div></div>`;
    if(k==='f')return`<div class="bRow"><span>Facade</span><div class="bSw">${BLD_FAC.map((p,i)=>`<button class="sw${it.f===i?' cur':''}" data-f="${i}" style="background:${p}" aria-label="Facade ${i+1}"></button>`).join('')}</div></div>`;
    if(k==='posts')return`<div class="bRow"><span>Posts</span><button class="bTog" data-k="posts">${it.posts?'On':'Off'}</button></div>`;
    return`<div class="bRow"><span>${F}</span><button class="bStep" data-k="${k}" data-d="${-st}">−</button><input type="number" data-k="${k}" value="${it[k]}" min="${lo}" max="${hi}" step="${st}"><button class="bStep" data-k="${k}" data-d="${st}">+</button></div>`};
  el.innerHTML=`<div class="bInspHead"><span class="bTh" data-th="${it.t}">${thumbImg(it.t,A)}</span><div><h3>${A.label}</h3><p class="bHelp">${A.tip}</p></div></div>
    <div class="bRow"><span>X</span><button class="bStep" data-k="x" data-d="-.5">−</button><input type="number" data-k="x" value="${it.x}" step=".5"><button class="bStep" data-k="x" data-d=".5">+</button></div>
    <div class="bRow"><span>Z</span><button class="bStep" data-k="z" data-d="-.5">−</button><input type="number" data-k="z" value="${it.z}" step=".5"><button class="bStep" data-k="z" data-d=".5">+</button></div>
    ${A.f.map(row).join('')}
    <div class="bBtns">${'w' in A.def||'dir' in A.def?'<button data-act="rot">Rotate (R)</button>':''}${A.unique?'':'<button data-act="dup">Duplicate</button>'}${A.required?'':'<button data-act="del" class="bDel">Delete</button>'}</div>`}
$('bLib').addEventListener('click',e=>{const tb=e.target.closest('[data-tab]');if(tb){BLD.tab=tb.dataset.tab;BLD.q='';renderLib();SFX.ui(1);return}
  const b=e.target.closest('[data-tool]');if(!b)return;pickTool(b.dataset.tool)});
$('bLib').addEventListener('input',e=>{if(e.target.id!=='bFind')return;BLD.q=e.target.value.slice(0,24);BLD.focusFind=true;renderLib()});
function pickTool(t){BLD.tool=t;if(t!=='select')BLD.sel=-1;makeGhost(t);updateSelBox();renderLib();renderInsp();SFX.ui(2)}
$('bInsp').addEventListener('click',e=>{const o=e.target.closest('[data-opt]');if(o){pushUndo();BLD.map.opt=BLD.map.opt||{};BLD.map.opt[o.dataset.opt]=BLD.map.opt[o.dataset.opt]?0:1;changed();SFX.ui(3);return}
  const it=BLD.map.items[BLD.sel];if(!it)return;const t=e.target.closest('button');if(!t)return;
  if(t.dataset.c!==undefined)return setField('c',+t.dataset.c);
  if(t.dataset.f!==undefined)return setField('f',+t.dataset.f);
  if(t.dataset.k==='posts')return setField('posts',it.posts?0:1);
  if(t.classList.contains('bStep')){const k=t.dataset.k,F=FIELDS[k],v=+(+it[k]+ +t.dataset.d).toFixed(2);return setField(k,F?Math.max(F[1],Math.min(F[2],v)):v)}
  if(t.dataset.act==='rot')rotSel();else if(t.dataset.act==='dup')dupSel();else if(t.dataset.act==='del')delSel()});
$('bInsp').addEventListener('change',e=>{const i=e.target.closest('input[data-k]');if(i&&Number.isFinite(+i.value))setField(i.dataset.k,+i.value)});
$('bName').addEventListener('input',()=>{BLD.map.name=$('bName').value.replace(/[<>]/g,'').slice(0,32);queueSave()});
$('bUndo').addEventListener('click',undo);$('bRedo').addEventListener('click',redo);
$('bTest').addEventListener('click',testBuilder);$('bExit').addEventListener('click',exitBuilder);
$('bPub').addEventListener('click',()=>{saveDraftNow();publishMap(BLD.map)});
$('bExport').addEventListener('click',()=>{saveDraftNow();exportMap(BLD.map)});$('bImport').addEventListener('click',()=>$('bFile').click());
// ----- picking: where on the ground (or on top of an item) is the pointer? -----
function rayAt(e){const r=renderer.domElement.getBoundingClientRect(),v=new THREE.Vector3((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1,.5).unproject(cam);
  return{o:cam.position.clone(),d:v.sub(cam.position).normalize()}}
function groundAtRay(ray,y=0){if(Math.abs(ray.d.y)<1e-4)return null;const t=(y-ray.o.y)/ray.d.y;return t>0?{x:ray.o.x+ray.d.x*t,z:ray.o.z+ray.d.z*t,t}:null}
function pickItem(ray){let best=-1,bt=Infinity;BLD.map.items.forEach((it,i)=>{const b=itemBox(it);for(const y of[b.top,0]){const p=groundAtRay(ray,y);
    if(p&&Math.abs(p.x-b.x)<=b.w/2+.15&&Math.abs(p.z-b.z)<=b.d/2+.15&&p.t<bt){bt=p.t;best=i}}});return best}
// ----- pointer and wheel on the 3D view -----
const cvs=renderer.domElement;
cvs.addEventListener('pointerdown',e=>{if(state!=='build')return;const ray=rayAt(e),g=groundAtRay(ray);
  if(e.button===2){BLD.orbit={x:e.clientX,y:e.clientY};cvs.setPointerCapture(e.pointerId);return}
  if(e.button===1||!g){BLD.pan={x:e.clientX,y:e.clientY};cvs.setPointerCapture(e.pointerId);return}
  if(BLD.tool!=='select'){placeAt(BLD.tool,g.x,g.z);return}
  const i=pickItem(ray);if(i>=0){BLD.sel=i;const it=BLD.map.items[i];BLD.drag={dx:it.x-g.x,dz:it.z-g.z,moved:false,before:snapMap()};cvs.setPointerCapture(e.pointerId);updateSelBox();renderInsp();SFX.ui(2)}
  else{BLD.sel=-1;updateSelBox();renderInsp();BLD.pan={x:e.clientX,y:e.clientY};cvs.setPointerCapture(e.pointerId)}});
cvs.addEventListener('pointermove',e=>{if(state!=='build')return;const ray=rayAt(e),g=groundAtRay(ray);BLD.cursor=g;
  if(BLD.drag&&g){const it=BLD.map.items[BLD.sel];const nx=snap(g.x+BLD.drag.dx),nz=snap(g.z+BLD.drag.dz);if(nx!==it.x||nz!==it.z){it.x=nx;it.z=nz;BLD.drag.moved=true;BLD.dirty=true;updateSelBox()}}
  else if(BLD.orbit){const C=BLD.cam;C.yaw-=(e.clientX-BLD.orbit.x)*.008;C.pitch=Math.max(.22,Math.min(1.53,C.pitch+(e.clientY-BLD.orbit.y)*.006));BLD.orbit={x:e.clientX,y:e.clientY};markView()}
  else if(BLD.pan){const C=BLD.cam,k=C.dist/innerHeight*1.2,dx=(e.clientX-BLD.pan.x)*k,dy=(e.clientY-BLD.pan.y)*k/Math.max(.45,Math.sin(C.pitch)),c=Math.cos(C.yaw),s=Math.sin(C.yaw);
    C.x-=dx*c+dy*s;C.z-=-dx*s+dy*c;BLD.pan={x:e.clientX,y:e.clientY};clampCam()}
  $('bHint').textContent=g?`x ${snap(g.x)}  z ${snap(g.z)}`:''});
cvs.addEventListener('pointerup',()=>{if(state!=='build')return;if(BLD.drag&&BLD.drag.moved){BLD.undo.push(BLD.drag.before);BLD.redo=[];changed()}BLD.drag=null;BLD.pan=null;BLD.orbit=null});
cvs.addEventListener('wheel',e=>{if(state!=='build')return;e.preventDefault();BLD.cam.dist=Math.max(10,Math.min(70,BLD.cam.dist*(e.deltaY>0?1.12:.89)))},{passive:false});
cvs.addEventListener('contextmenu',e=>{if(state==='build')e.preventDefault()});
const clampCam=()=>{BLD.cam.x=Math.max(-30,Math.min(30,BLD.cam.x));BLD.cam.z=Math.max(-30,Math.min(34,BLD.cam.z))};
// ----- keyboard (ignored while typing in a field) -----
addEventListener('keydown',e=>{if(state!=='build'||setOpen||e.target.closest&&e.target.closest('input'))return;const c=e.code,mod=e.ctrlKey||e.metaKey,big=e.shiftKey?2:.5;
  if(mod&&c==='KeyZ'){e.preventDefault();e.shiftKey?redo():undo();return}if(mod&&c==='KeyY'){e.preventDefault();redo();return}if(mod&&c==='KeyD'){e.preventDefault();dupSel();return}
  if(c==='Delete'||c==='Backspace'){e.preventDefault();delSel()}else if(c==='KeyR')rotSel();
  else if(c==='KeyQ')turnView(1);else if(c==='KeyE')turnView(-1);else if(c==='KeyV')setView(BLD.view==='top'?'angle':BLD.view==='angle'?'low':'top');else if(c==='KeyF')focusSel();else if(c==='BracketLeft')raise(-.5);else if(c==='BracketRight')raise(.5);
  else if(c==='Escape'){BLD.sel=-1;pickTool('select')}
  else if(c.startsWith('Arrow')){e.preventDefault();if(BLD.sel>=0)nudge(c==='ArrowLeft'?-big:c==='ArrowRight'?big:0,c==='ArrowUp'?-big:c==='ArrowDown'?big:0)}});
// ----- per frame while building (called from tick) -----
// ----- camera views: Top (straight down), Angled (the classic), Low (close to the ground, to check heights); Q/E turn it -----
const BVIEWS={top:{pitch:1.53,label:'Top',key:'V'},angle:{pitch:1.107,label:'Angled',key:'V'},low:{pitch:.42,label:'Low',key:'V'}};
function setView(v,snapNow=false){const V=BVIEWS[v];if(!V)return;BLD.view=v;BLD.cam.pitch=V.pitch;if(v==='top')BLD.cam.yaw=Math.round(BLD.cam.yaw/(PI/2))*(PI/2);
  if(snapNow){Object.assign(BLD.cam,{x:0,z:3,dist:36,yaw:0});Object.assign(BLD.cs,BLD.cam)}renderViewBar()}
function turnView(d){BLD.cam.yaw+=d*PI/4;renderViewBar()}
function markView(){const v=Object.keys(BVIEWS).find(k=>Math.abs(BVIEWS[k].pitch-BLD.cam.pitch)<.02)||'';if(v!==BLD.view){BLD.view=v;renderViewBar()}}
function focusSel(){const it=BLD.map.items[BLD.sel];if(!it){Object.assign(BLD.cam,{x:0,z:3,dist:36});return}const b=itemBox(it);BLD.cam.x=b.x;BLD.cam.z=b.z;BLD.cam.dist=Math.max(12,Math.min(40,Math.max(b.w,b.d,b.top)*2.6));clampCam()}
function renderViewBar(){const el=$('bView');if(!el)return;el.innerHTML=Object.entries(BVIEWS).map(([k,V])=>`<button class="bV${BLD.view===k?' on':''}" data-view="${k}" title="${V.label} view (V)">${V.label}</button>`).join('')+
  `<span class="bVs"></span><button class="bV" data-turn="1" title="Turn the view left (Q)">⟲</button><button class="bV" data-turn="-1" title="Turn the view right (E)">⟳</button><button class="bV" data-focus="1" title="Focus on the selection, or the whole map (F)">Focus</button>`}
$('bView').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.view)setView(b.dataset.view);else if(b.dataset.turn)turnView(+b.dataset.turn);else if(b.dataset.focus)focusSel();SFX.ui(1)});
function builderFrame(dt){const k=1-Math.exp(-10*dt),C=BLD.cam,S=BLD.cs,pan=8*dt*(C.dist/36),cy=Math.cos(C.yaw),sy=Math.sin(C.yaw);
  if(!(document.activeElement&&document.activeElement.tagName==='INPUT')){const f=(keys.KeyS?1:0)-(keys.KeyW?1:0),r=(keys.KeyD?1:0)-(keys.KeyA?1:0);
    if(f||r){C.x+=(f*sy+r*cy)*pan;C.z+=(f*cy-r*sy)*pan;clampCam()}}
  let dy=C.yaw-S.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));
  S.x+=(C.x-S.x)*k;S.z+=(C.z-S.z)*k;S.dist+=(C.dist-S.dist)*k;S.yaw+=dy*k;S.pitch+=(C.pitch-S.pitch)*k;
  const R=S.dist*1.118,hz=R*Math.cos(S.pitch),ty=S.pitch<.7?1.2*(1-S.pitch/.7):0;
  cam.position.set(S.x+Math.sin(S.yaw)*hz,R*Math.sin(S.pitch)+ty,S.z+Math.cos(S.yaw)*hz);cam.lookAt(S.x,ty,S.z);
  if(BLD.prev)waveFlags(BLD.prev.waves,tAll);
  if(BLD.dirty&&!BLD.drag)rebuildPreview();else if(BLD.dirty&&BLD.drag&&(BLD.rb=(BLD.rb||0)+dt)>.12){BLD.rb=0;rebuildPreview()}
  const t=BLD.tool,g=BLD.cursor;bGhost.visible=t!=='select'&&!!g;if(bGhost.visible){const A=ASSETS[t];fitBox(bGhost,itemBox({t,x:snap(g.x),z:snap(g.z),...A.def}))}
  if(BLD.ghost&&BLD.ghost.t!==t)dropGhost();if(!BLD.ghost&&t!=='select')makeGhost(t);
  if(BLD.ghost){BLD.ghost.g.visible=bGhost.visible;if(g)BLD.ghost.g.position.set(snap(g.x),0,snap(g.z));waveFlags(BLD.ghost.waves,tAll)}}
// ----- test play -----
function testBuilder(){saveDraftNow();const idx=addCustomMap(BLD.map);closeBuilderUI();BLD.testing=true;ci=pickCi;useRunMap(idx);startRun(true);
  hint('')}
function closeBuilderUI(){dropPreview();dropGhost();bGrid.visible=bGhost.visible=bSel.visible=false;document.body.classList.remove('building');$('bld').classList.add('hide');P.visible=true}
function backToBuilder(){const m=BLD.map;resetRun();setWorld('none');openBuilder(m);BLD.undo=[]}
