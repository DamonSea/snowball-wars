// Trick Park menu: one map at a time, with a picture of it, ◀ name ▶ to flip through, and your best score.
// Pictures are snapshots of each map from above, taken once the first time the menu opens.
const PARK={on:false,i:0,thumbs:{},tab:'dev',pos:{dev:0,user:0}};
// Two tabs. Dev Maps: the maps that come with the game. User Maps: maps made by players, the ones shipped with the game
// (js/maps/user-maps.js) first, then maps published from the builder, newest first.
const devMaps=()=>RUNMAPS.filter(M=>!M.custom);
const userMaps=()=>{const pub=typeof PUB!=='undefined'?PUB.keys:new Set();
  return[...RUNMAPS.filter(M=>M.user),...RUNMAPS.filter(M=>!M.user&&pub.has(M.key)).sort((a,b)=>(b.pubAt||0)-(a.pubAt||0))]};
const parkMaps=()=>PARK.tab==='user'?userMaps():devMaps();
function parkTab(t){if(t===PARK.tab)return;PARK.pos[PARK.tab]=PARK.i;PARK.tab=t;PARK.i=Math.min(PARK.pos[t]||0,Math.max(0,parkMaps().length-1));renderPark();SFX.ui(1)}
function parkThumb(M){if(PARK.thumbs[M.key])return PARK.thumbs[M.key];
  try{const prevVis=RUNMAPS.map(q=>q.grp.visible),pv=P.visible,cp=cam.position.clone(),cq=cam.quaternion.clone(),inSpad=spadG.parent;
    RUNMAPS.forEach(q=>q.grp.visible=q===M);if(typeof advGroups!=='undefined')advGroups.forEach(g=>g.visible=false);P.visible=false;if(spadG.parent)spadG.parent.remove(spadG);
    cam.position.set(0,30,33);cam.lookAt(0,0,-3);renderer.render(scene,cam);
    const src=renderer.domElement,c=document.createElement('canvas');c.width=480;c.height=270;const s=Math.min(src.width/16,src.height/9);
    c.getContext('2d').drawImage(src,(src.width-16*s)/2,(src.height-9*s)/2,16*s,9*s,0,0,480,270);PARK.thumbs[M.key]=c.toDataURL('image/jpeg',.82);
    RUNMAPS.forEach((q,k)=>q.grp.visible=prevVis[k]);P.visible=pv;cam.position.copy(cp);cam.quaternion.copy(cq);if(inSpad)inSpad.add(spadG)}catch(e){PARK.thumbs[M.key]=''}
  return PARK.thumbs[M.key]}
function parkMenu(){overlay(false);PARK.on=true;state='menu';if(runL&&userMaps().includes(runL))PARK.tab='user';else if(runL&&devMaps().includes(runL))PARK.tab='dev';const L=parkMaps();PARK.i=Math.max(0,Math.min(L.length-1,L.indexOf(runL)>=0?L.indexOf(runL):PARK.i));
  $('park').classList.remove('hide');renderPark();setTimeout(()=>{try{$('parkPlay').focus({preventScroll:true})}catch(e){}},60)}
function closePark(){PARK.on=false;$('park').classList.add('hide')}
function renderPark(){const L=parkMaps();PARK.i=Math.max(0,Math.min(PARK.i,L.length-1));const M=L[PARK.i],user=PARK.tab==='user';
  $('parkTabDev').classList.toggle('on',!user);$('parkTabUser').classList.toggle('on',user);$('parkTabDev').setAttribute('aria-selected',!user);$('parkTabUser').setAttribute('aria-selected',user);
  $('parkHint').classList.toggle('hide',!user);const img=$('parkImg');
  if(!M){$('parkName').textContent='No maps yet';$('parkBest').textContent='';$('parkMeta').textContent='';img.removeAttribute('src');img.parentNode.classList.add('noimg');$('parkPlay').disabled=true;return}
  $('parkPlay').disabled=false;const n=mapCount(RUNMAPS.indexOf(M)),b=bestR[M.key];
  $('parkName').textContent=M.name;$('parkBest').textContent=b?`Best score ${b.toLocaleString()}`:'No best score yet';
  $('parkMeta').textContent=[user?`by ${M.author||'a player'}`:'',`${PARK.i+1} of ${L.length}`,n?`${n} friend${n>1?'s':''} here`:''].filter(Boolean).join(' · ');
  const src=parkThumb(M);if(src){img.src=src;img.alt=M.name+' from above'}img.parentNode.classList.toggle('noimg',!src)}
function parkStep(d){const n=parkMaps().length;if(!n)return;PARK.i=(PARK.i+d+n)%n;renderPark();SFX.ui(2)}
function parkPlay(){const M=parkMaps()[PARK.i];if(!M)return;closePark();select('run',RUNMAPS.indexOf(M))}
$('parkTabDev').addEventListener('click',()=>parkTab('dev'));$('parkTabUser').addEventListener('click',()=>parkTab('user'));
$('parkPrev').addEventListener('click',()=>parkStep(-1));$('parkNext').addEventListener('click',()=>parkStep(1));
$('parkPlay').addEventListener('click',parkPlay);$('parkFrame').addEventListener('click',parkPlay);
$('parkMore').addEventListener('click',()=>{closePark();openMapsPanel()});$('parkBack').addEventListener('click',()=>{closePark();menu()});
function parkKey(c){if(c==='KeyQ'||c==='ArrowUp'||c==='KeyW')parkTab('dev');else if(c==='KeyE'||c==='ArrowDown'||c==='KeyS')parkTab('user');else if(c==='ArrowLeft'||c==='KeyA')parkStep(-1);else if(c==='ArrowRight'||c==='KeyD')parkStep(1);else if(c==='Enter'||c==='Space')parkPlay();else if(c==='Escape'){closePark();menu()}else return false;return true}
function parkPad(L,R,ok,back,tri,l1,r1,U,D){if(l1||U)parkTab('dev');else if(r1||D)parkTab('user');else if(L)parkStep(-1);else if(R)parkStep(1);else if(ok)parkPlay();else if(back){closePark();menu()}else if(tri){closePark();openMapsPanel()}}
