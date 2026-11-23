// Drafts, publishing, and the "More maps" panel.
//  Drafts live in this browser (localStorage). Publish writes the map to the game's shared database (the "db"
//  capability of the claude.ai version), where it appears under Trick Park → More maps for everyone who opens
//  the game. The owner, and anyone shared in as a Contributor or Editor, can publish; others can still build,
//  play published maps and export files. Off claude.ai (GitHub Pages, a downloaded copy) maps stay local:
//  Export / Import moves them around as .json files.
const COMM={db:null,user:null,me:{id:null,name:'',owner:false},list:[],status:'loading',canWrite:null};
// ----- drafts -----
function loadDrafts(){try{const d=JSON.parse(localStorage.getItem('orbRunDrafts')||'{}');return d&&typeof d==='object'?d:{}}catch(e){return{}}}
function saveDraft(m){const d=loadDrafts();d[m.id]={...cleanMap(m),saved:Date.now()};try{localStorage.setItem('orbRunDrafts',JSON.stringify(d))}catch(e){toast('Could not save the draft (browser storage is full?)')}}
function deleteDraft(id){const d=loadDrafts();delete d[id];try{localStorage.setItem('orbRunDrafts',JSON.stringify(d))}catch(e){}}
// ----- shared maps (claude.ai only) -----
async function commInit(){try{if(!window.claude||typeof window.claude.use!=='function'){COMM.status='off';return}
  const[db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);COMM.user=user;
  if(!db){COMM.status='off';renderMaps();return}COMM.db=db;
  try{COMM.me.id=user&&await user.id()}catch(e){}try{const me=user&&await user.me();COMM.me.name=(me&&me.name)||''}catch(e){}
  try{COMM.me.owner=!!(user&&await user.isOwner())}catch(e){}try{COMM.canWrite=user?await user.can('data.write'):null}catch(e){}
  const timer=setTimeout(()=>{if(COMM.status==='loading'){COMM.status='slow';renderMaps()}},10000);
  db.collection('maps').onSnapshot(s=>{clearTimeout(timer);
    COMM.list=(Array.isArray(s)?s:(s&&s.docs)||[]).map(d=>d&&typeof d.data==='function'?{id:d.id,...d.data()}:{...d}).filter(m=>typeof m.map==='string'&&m.map.length<240000).sort((a,b)=>(+b.updated||0)-(+a.updated||0));COMM.status='ok';syncPubMaps();renderMaps()},
    e=>{clearTimeout(timer);COMM.status='error';renderMaps()})}catch(e){COMM.status='off'}}
// Published maps join Trick Park → User Maps. Each is built once per published version (and again if a draft of it was
// played in between); unpublished maps drop out of the list.
const PUB={keys:new Set()};
function syncPubMaps(){const keys=new Set();
  for(const p of COMM.list){const m=parseShared(p);if(!m)continue;const key='cm_'+m.id,v=String(p.updated||'');keys.add(key);
    if(RUNMAPS.some(M=>M.key===key&&(M.user||M.pubV===v)))continue;
    try{const was=RUNMAPS.find(M=>M.key===key),M=RUNMAPS[addCustomMap(m)];if(M===was)continue;   // being played right now: rebuilt on the next update
      M.author=p.author||m.author||'';M.pubAt=+p.updated||0;M.pubV=v;mergeStatic(M.grp,true);delete PARK.thumbs[key]}catch(e){}}
  PUB.keys=keys;if(PARK.on)renderPark()}
function parseShared(m){try{return cleanMap({...JSON.parse(m.map),id:m.id})}catch(e){return null}}
async function publishMap(map){
  if(!COMM.db){toast('Publishing works in the claude.ai version of the game. Use Export to share the map file.');SFX.deny();return}
  if(COMM.canWrite===false){toast('Only the owner and people shared in as Contributors can publish. Ask the owner, or Export the file.');SFX.deny();return}
  const m=cleanMap(map);if(!m.name||m.name==='Untitled'||m.name==='My map'){toast('Give your map a name first (top left).');$('bName').focus();return}
  const prev=COMM.list.find(q=>q.id===m.id);
  if(prev&&prev.authorId&&COMM.me.id&&prev.authorId!==COMM.me.id&&!COMM.me.owner){toast('That map belongs to someone else. Export it, or make a copy.');return}
  m.author=(prev&&prev.author)||COMM.me.name||'Player';
  try{await COMM.db.collection('maps').doc(m.id).set({name:m.name,author:m.author,authorId:(prev&&prev.authorId)||COMM.me.id||'',items:m.items.length,updated:Date.now(),map:JSON.stringify(m)});
    toast(`Published "${m.name}"! It's in Trick Park → User Maps for everyone.`);SFX.unlock()}
  catch(e){const c=e&&e.code;if(c==='invalid_argument'){COMM.canWrite=false;toast('You can play shared maps, but publishing needs Contributor access from the owner.')}
    else if(c==='quota_exceeded')toast('The game’s map storage is full. Unpublish an old map first.');
    else toast('Could not publish right now. Try again in a moment.');SFX.deny()}}
async function unpublishMap(id){if(!COMM.db)return;try{await COMM.db.collection('maps').doc(id).delete();toast('Unpublished.');SFX.ui(1)}catch(e){toast('Could not unpublish (only the author or the owner can).')}}
// ----- export / import -----
async function exportMap(map){const m=cleanMap(map),txt=JSON.stringify(m),name=(m.name.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')||'map').toLowerCase()+'.snowmap.json';
  try{const dl=window.claude&&await window.claude.use('downloads');if(dl){await dl.save({filename:name,data:txt});return}}catch(e){if(e&&/declin|cancel/i.test(e.message||''))return}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
$('bFile').addEventListener('change',async e=>{const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
  if(f.size>400000){toast('That file is too big to be a map.');return}
  try{const m=cleanMap({...JSON.parse(await f.text()),id:newMapId()});saveDraft(m);toast(`Imported "${m.name}".`);openBuilder(m)}catch(err){toast('That file isn’t a Snowball Wars map.');SFX.deny()}});
// ----- the More maps panel -----
let mapsOpen=false;
function openMapsPanel(){mapsOpen=true;state='menu';overlay(false);$('maps').classList.remove('hide');renderMaps();setTimeout(()=>{const b=$('maps').querySelector('button');b&&b.focus()},50)}
function closeMapsPanel(){mapsOpen=false;$('maps').classList.add('hide')}
function playMap(map){const idx=addCustomMap(map);closeMapsPanel();select('run',idx)}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderMaps(){if(!mapsOpen)return;const d=Object.values(loadDrafts()).sort((a,b)=>(b.saved||0)-(a.saved||0));
  const pubIds=new Set(COMM.list.map(m=>m.id)),mine=m=>COMM.me.owner||(m.authorId&&m.authorId===COMM.me.id);
  let h=`<div class="mHead"><button id="mNew">+ Build a new map</button><button id="mImp" class="alt">Import map file</button></div><h2 class="sh">Your drafts</h2>`;
  h+=d.length?d.map(m=>`<div class="mRow"><div><b>${esc(m.name)}</b><small>${m.items.length} items${pubIds.has(m.id)?' · published':''}</small></div><span><button data-a="edit" data-id="${m.id}">Edit</button><button data-a="play" data-id="${m.id}" class="alt">Play</button><button data-a="del" data-id="${m.id}" class="alt mDel" aria-label="Delete draft ${esc(m.name)}">✕</button></span></div>`).join('')
    :'<p class="bHelp">No drafts yet. Build one!</p>';
  h+='<h2 class="sh">Published maps</h2>';
  if(COMM.status==='off')h+='<p class="bHelp">Shared maps live in the claude.ai version of the game. Here you can still build, play your drafts and Export / Import map files.</p>';
  else if(COMM.status==='loading')h+='<p class="bHelp">Loading shared maps…</p>';
  else if(COMM.status==='slow'||COMM.status==='error')h+='<p class="bHelp">Shared maps can’t be reached right now.</p>';
  else if(!COMM.list.length)h+='<p class="bHelp">Nothing published yet. Build a map and press Publish.</p>';
  else h+=COMM.list.map(m=>`<div class="mRow"><div><b>${esc(m.name)}</b><small>by ${esc(m.author||'someone')} · ${+m.items||0} items</small></div><span><button data-a="pplay" data-id="${esc(m.id)}">Play</button><button data-a="pedit" data-id="${esc(m.id)}" class="alt">${mine(m)?'Edit':'Copy'}</button>${mine(m)?`<button data-a="unpub" data-id="${esc(m.id)}" class="alt mDel" aria-label="Unpublish ${esc(m.name)}">✕</button>`:''}</span></div>`).join('');
  h+='<div class="btns"><button id="mBack" class="alt">Back<span class="pk" aria-hidden="true">\u25cb</span></button></div>';$('mapsList').innerHTML=h}
$('maps').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.id,a=b.dataset.a;
  if(b.id==='mNew')return openBuilder(blankMap());if(b.id==='mImp')return $('bFile').click();if(b.id==='mBack'){closeMapsPanel();return parkMenu()}
  const dr=loadDrafts()[id],pub=COMM.list.find(m=>m.id===id);
  if(a==='edit'&&dr)openBuilder(dr);else if(a==='play'&&dr)playMap(dr);
  else if(a==='del'&&dr){if(confirmTwice(b))deleteDraft(id),renderMaps()}
  else if(a==='pplay'&&pub){const m=parseShared(pub);m?playMap(m):toast('That map couldn’t be read.')}
  else if(a==='pedit'&&pub){const m=parseShared(pub);if(!m)return;const own=COMM.me.owner||(pub.authorId&&pub.authorId===COMM.me.id);if(!own){m.id=newMapId();m.name=(m.name+' copy').slice(0,32)}saveDraft(m);openBuilder(m)}
  else if(a==='unpub'&&pub){if(confirmTwice(b))unpublishMap(id)}});
// destructive buttons need a second click
function confirmTwice(b){if(b.dataset.sure)return true;b.dataset.sure='1';const t=b.textContent;b.textContent='Sure?';setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent=t}},2500);return false}
