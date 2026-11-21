// Map Builder: a top-down editor for custom Trick Park maps.
//  Pick an asset in the library and click the ground to place it (the tool stays active for more; Esc goes
//  back to Select). With Select, click an item to edit it in the inspector and drag it to move it; drag
//  empty ground, or right-drag, to pan; the wheel zooms. Keys: Delete removes, Ctrl+Z / Ctrl+Y undo and redo,
//  Ctrl+D duplicates, R rotates, arrows nudge (Shift for more), [ and ] lower and raise, WASD pans.
//  Test drops you into the map to play it; pause and choose Back to builder. Drafts save as you go.
const BLD={map:null,sel:-1,tool:'select',undo:[],redo:[],prev:null,cam:{x:0,z:3,dist:36},cs:{x:0,z:3,dist:36},drag:null,pan:null,cursor:null,testing:false,dirty:false,saveT:null};
const SNAP=.5,snap=v=>Math.round(v/SNAP)*SNAP;
// ----- 3D helpers: grid, placement ghost, selection box -----
const bGrid=(()=>{const cv=document.createElement('canvas');cv.width=cv.height=1024;const x=cv.getContext('2d');x.clearRect(0,0,1024,1024);
  for(let i=0;i<=56;i++){const p=i/56*1024;x.strokeStyle=i%5===0?'rgba(40,80,110,.5)':'rgba(40,80,110,.22)';x.lineWidth=i%5===0?2.2:1.1;x.beginPath();x.moveTo(p,0);x.lineTo(p,1024);x.stroke();x.beginPath();x.moveTo(0,p);x.lineTo(1024,p);x.stroke()}
  const m=new THREE.Mesh(new THREE.PlaneGeometry(56,56),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false}));m.rotation.x=-PI/2;m.position.y=.04;m.visible=false;scene.add(m);return m})();
const bGhost=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xffd84a,transparent:true,opacity:.35,depthWrite:false}));bGhost.visible=false;scene.add(bGhost);
const bSel=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0x5ff3ff,wireframe:true}));bSel.visible=false;scene.add(bSel);
const fitBox=(m,b)=>{const h=Math.max(.15,b.top);m.position.set(b.x,h/2,b.z);m.scale.set(b.w+.08,h+.08,b.d+.08)};
// ----- open / close -----
function openBuilder(map){BLD.map=cleanMap(map||blankMap());BLD.sel=-1;BLD.tool='select';BLD.undo=[];BLD.redo=[];BLD.testing=false;
  state='build';overlay(false);$('cs').classList.add('hide');closeMapsPanel();closeSet();setWorld('none');P.visible=false;if(CPU.a)CPU.a.g.visible=false;
  document.body.classList.add('building');$('bld').classList.remove('hide');$('bName').value=BLD.map.name;bGrid.visible=true;
  Object.assign(BLD.cam,{x:0,z:3,dist:36});Object.assign(BLD.cs,BLD.cam);renderLib();renderInsp();rebuildPreview();setStatus('')}
function closeBuilder(){saveDraftNow();BLD.testing=false;dropPreview();bGrid.visible=bGhost.visible=bSel.visible=false;document.body.classList.remove('building');$('bld').classList.add('hide');P.visible=true}
function exitBuilder(){closeBuilder();openMapsPanel()}
function dropPreview(){if(BLD.prev){freeTree(BLD.prev.grp);BLD.prev=null}}
function rebuildPreview(){dropPreview();BLD.prev=buildCustom(BLD.map);BLD.prev.grp.visible=true;BLD.dirty=false;updateSelBox()}
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
function delSel(){const it=BLD.map.items[BLD.sel];if(!it)return;if(ASSETS[it.t].unique){toast('Every map needs a START pad. Drag it to move it.');return}
  pushUndo();BLD.map.items.splice(BLD.sel,1);BLD.sel=-1;changed();SFX.ui(1)}
function dupSel(){const it=BLD.map.items[BLD.sel];if(!it||ASSETS[it.t].unique)return;if(BLD.map.items.length>=MAP_LIMIT)return;
  pushUndo();BLD.map.items.push({...it,x:it.x+1,z:it.z+1});BLD.sel=BLD.map.items.length-1;changed();SFX.ui(3)}
function rotSel(){const it=BLD.map.items[BLD.sel];if(!it||!('w' in it))return;pushUndo();[it.w,it.d]=[it.d,it.w];if('dir' in it)it.dir=(it.dir+1)%4;changed();SFX.ui(2)}
function setField(k,v){const it=BLD.map.items[BLD.sel];if(!it)return;pushUndo();it[k]=v;changed()}
function nudge(dx,dz){const it=BLD.map.items[BLD.sel];if(!it)return;pushUndo();it.x=snap(it.x+dx);it.z=snap(it.z+dz);changed()}
function raise(d){const it=BLD.map.items[BLD.sel];if(!it)return;const k='h' in it?'h':'y' in it?'y':null;if(!k)return;const F=FIELDS[k];pushUndo();it[k]=Math.max(F[1],Math.min(F[2],+(it[k]+d).toFixed(2)));changed()}
// ----- autosave to drafts -----
function queueSave(){setStatus('Saving…');clearTimeout(BLD.saveT);BLD.saveT=setTimeout(saveDraftNow,500)}
function saveDraftNow(){clearTimeout(BLD.saveT);if(!BLD.map)return;saveDraft(BLD.map);setStatus('Saved')}
function setStatus(t){$('bSave').textContent=t}
// ----- library and inspector -----
function renderLib(){const cats={};for(const[k,A]of Object.entries(ASSETS))(cats[A.cat]=cats[A.cat]||[]).push([k,A]);
  $('bLib').innerHTML=`<button class="bTool${BLD.tool==='select'?' on':''}" data-tool="select" title="Select, move and edit items (Esc)"><i>⮞</i>Select</button>`+
    Object.entries(cats).map(([c,L])=>`<h4>${c}</h4>`+L.map(([k,A])=>`<button class="bTool${BLD.tool===k?' on':''}" data-tool="${k}" title="${A.tip}"><i>${A.icon}</i>${A.label}</button>`).join('')).join('')}
function renderInsp(){const it=BLD.map.items[BLD.sel],el=$('bInsp');
  if(!it){const n=BLD.map.items.length;el.innerHTML=`<h3>${BLD.tool==='select'?'Select':ASSETS[BLD.tool].label}</h3><p class="bHelp">${BLD.tool==='select'?'Click an item to edit it, drag to move it. Drag empty ground to pan, wheel to zoom.':'Click the ground to place one. Keep clicking for more; Esc goes back to Select.'}</p>
    <p class="bHelp"><b>Keys</b>: Delete remove · Ctrl+Z undo · Ctrl+Y redo · Ctrl+D duplicate · R rotate · arrows nudge · [ ] lower/raise · WASD pan</p>
    <p class="bHelp">${n}/${MAP_LIMIT} items. Heights: a jump clears about 1.9, a double jump 2.6, triple 4, backflip 4.7, wall jumps climb any wall gap about 3 wide, ledge hang reaches about 1.9 above a jump.</p>`;return}
  const A=ASSETS[it.t];
  const row=k=>{const[F,lo,hi,st]=FIELDS[k];if(k==='c')return`<div class="bRow"><span>Color</span><div class="bSw">${PALETTE.map((p,i)=>`<button class="sw${it.c===i?' cur':''}" data-c="${i}" style="background:#${p.toString(16).padStart(6,'0')}" aria-label="Color ${i+1}"></button>`).join('')}</div></div>`;
    if(k==='posts')return`<div class="bRow"><span>Posts</span><button class="bTog" data-k="posts">${it.posts?'On':'Off'}</button></div>`;
    return`<div class="bRow"><span>${F}</span><button class="bStep" data-k="${k}" data-d="${-st}">−</button><input type="number" data-k="${k}" value="${it[k]}" min="${lo}" max="${hi}" step="${st}"><button class="bStep" data-k="${k}" data-d="${st}">+</button></div>`};
  el.innerHTML=`<h3><i>${A.icon}</i> ${A.label}</h3><p class="bHelp">${A.tip}</p>
    <div class="bRow"><span>X</span><button class="bStep" data-k="x" data-d="-.5">−</button><input type="number" data-k="x" value="${it.x}" step=".5"><button class="bStep" data-k="x" data-d=".5">+</button></div>
    <div class="bRow"><span>Z</span><button class="bStep" data-k="z" data-d="-.5">−</button><input type="number" data-k="z" value="${it.z}" step=".5"><button class="bStep" data-k="z" data-d=".5">+</button></div>
    ${A.f.map(row).join('')}
    <div class="bBtns">${'w' in A.def?'<button data-act="rot">Rotate (R)</button>':''}${A.unique?'':'<button data-act="dup">Duplicate</button><button data-act="del" class="bDel">Delete</button>'}</div>`}
$('bLib').addEventListener('click',e=>{const b=e.target.closest('[data-tool]');if(!b)return;BLD.tool=b.dataset.tool;if(BLD.tool!=='select')BLD.sel=-1;updateSelBox();renderLib();renderInsp();SFX.ui(2)});
$('bInsp').addEventListener('click',e=>{const it=BLD.map.items[BLD.sel];if(!it)return;const t=e.target.closest('button');if(!t)return;
  if(t.dataset.c!==undefined)return setField('c',+t.dataset.c);
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
  if(e.button===2||e.button===1||!g){BLD.pan={x:e.clientX,y:e.clientY};cvs.setPointerCapture(e.pointerId);return}
  if(BLD.tool!=='select'){placeAt(BLD.tool,g.x,g.z);return}
  const i=pickItem(ray);if(i>=0){BLD.sel=i;const it=BLD.map.items[i];BLD.drag={dx:it.x-g.x,dz:it.z-g.z,moved:false,before:snapMap()};cvs.setPointerCapture(e.pointerId);updateSelBox();renderInsp();SFX.ui(2)}
  else{BLD.sel=-1;updateSelBox();renderInsp();BLD.pan={x:e.clientX,y:e.clientY};cvs.setPointerCapture(e.pointerId)}});
cvs.addEventListener('pointermove',e=>{if(state!=='build')return;const ray=rayAt(e),g=groundAtRay(ray);BLD.cursor=g;
  if(BLD.drag&&g){const it=BLD.map.items[BLD.sel];const nx=snap(g.x+BLD.drag.dx),nz=snap(g.z+BLD.drag.dz);if(nx!==it.x||nz!==it.z){it.x=nx;it.z=nz;BLD.drag.moved=true;BLD.dirty=true;updateSelBox()}}
  else if(BLD.pan){const k=BLD.cam.dist/innerHeight*1.2;BLD.cam.x-=(e.clientX-BLD.pan.x)*k;BLD.cam.z-=(e.clientY-BLD.pan.y)*k;BLD.pan={x:e.clientX,y:e.clientY};clampCam()}
  $('bHint').textContent=g?`x ${snap(g.x)}  z ${snap(g.z)}`:''});
cvs.addEventListener('pointerup',()=>{if(state!=='build')return;if(BLD.drag&&BLD.drag.moved){BLD.undo.push(BLD.drag.before);BLD.redo=[];changed()}BLD.drag=null;BLD.pan=null});
cvs.addEventListener('wheel',e=>{if(state!=='build')return;e.preventDefault();BLD.cam.dist=Math.max(10,Math.min(70,BLD.cam.dist*(e.deltaY>0?1.12:.89)))},{passive:false});
cvs.addEventListener('contextmenu',e=>{if(state==='build')e.preventDefault()});
const clampCam=()=>{BLD.cam.x=Math.max(-30,Math.min(30,BLD.cam.x));BLD.cam.z=Math.max(-30,Math.min(34,BLD.cam.z))};
// ----- keyboard (ignored while typing in a field) -----
addEventListener('keydown',e=>{if(state!=='build'||setOpen||e.target.closest&&e.target.closest('input'))return;const c=e.code,mod=e.ctrlKey||e.metaKey,big=e.shiftKey?2:.5;
  if(mod&&c==='KeyZ'){e.preventDefault();e.shiftKey?redo():undo();return}if(mod&&c==='KeyY'){e.preventDefault();redo();return}if(mod&&c==='KeyD'){e.preventDefault();dupSel();return}
  if(c==='Delete'||c==='Backspace'){e.preventDefault();delSel()}else if(c==='KeyR')rotSel();else if(c==='BracketLeft')raise(-.5);else if(c==='BracketRight')raise(.5);
  else if(c==='Escape'){BLD.tool='select';BLD.sel=-1;updateSelBox();renderLib();renderInsp()}
  else if(c.startsWith('Arrow')){e.preventDefault();if(BLD.sel>=0)nudge(c==='ArrowLeft'?-big:c==='ArrowRight'?big:0,c==='ArrowUp'?-big:c==='ArrowDown'?big:0)}});
// ----- per frame while building (called from tick) -----
function builderFrame(dt){const k=1-Math.exp(-10*dt),C=BLD.cam,S=BLD.cs,pan=8*dt*(C.dist/36);
  if(!(document.activeElement&&document.activeElement.tagName==='INPUT')){if(keys.KeyW)C.z-=pan;if(keys.KeyS)C.z+=pan;if(keys.KeyA)C.x-=pan;if(keys.KeyD)C.x+=pan;clampCam()}
  S.x+=(C.x-S.x)*k;S.z+=(C.z-S.z)*k;S.dist+=(C.dist-S.dist)*k;
  cam.position.set(S.x,S.dist,S.z+S.dist*.5);cam.lookAt(S.x,0,S.z);
  if(BLD.dirty&&!BLD.drag)rebuildPreview();else if(BLD.dirty&&BLD.drag&&(BLD.rb=(BLD.rb||0)+dt)>.12){BLD.rb=0;rebuildPreview()}
  const t=BLD.tool,g=BLD.cursor;bGhost.visible=t!=='select'&&!!g;if(bGhost.visible){const A=ASSETS[t];fitBox(bGhost,itemBox({t,x:snap(g.x),z:snap(g.z),...A.def}))}}
// ----- test play -----
function testBuilder(){saveDraftNow();const idx=addCustomMap(BLD.map);closeBuilderUI();BLD.testing=true;ci=pickCi;useRunMap(idx);startRun(true);
  hint('Testing your map. Pause (P / Options) and choose Back to builder to keep editing.')}
function closeBuilderUI(){dropPreview();bGrid.visible=bGhost.visible=bSel.visible=false;document.body.classList.remove('building');$('bld').classList.add('hide');P.visible=true}
function backToBuilder(){const m=BLD.map;resetRun();setWorld('none');openBuilder(m);BLD.undo=[]}
