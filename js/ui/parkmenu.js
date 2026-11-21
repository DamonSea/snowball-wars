// Trick Park menu: one map at a time, with a picture of it, ◀ name ▶ to flip through, and your best score.
// Pictures are snapshots of each map from above, taken once the first time the menu opens.
const PARK={on:false,i:0,thumbs:{}};
const parkMaps=()=>RUNMAPS.filter(M=>!M.custom);
function parkThumb(M){if(PARK.thumbs[M.key])return PARK.thumbs[M.key];
  try{const prevVis=RUNMAPS.map(q=>q.grp.visible),pv=P.visible,cp=cam.position.clone(),cq=cam.quaternion.clone(),inSpad=spadG.parent;
    RUNMAPS.forEach(q=>q.grp.visible=q===M);if(typeof advGroups!=='undefined')advGroups.forEach(g=>g.visible=false);P.visible=false;if(spadG.parent)spadG.parent.remove(spadG);
    cam.position.set(0,30,33);cam.lookAt(0,0,-3);renderer.render(scene,cam);
    const src=renderer.domElement,c=document.createElement('canvas');c.width=480;c.height=270;const s=Math.min(src.width/16,src.height/9);
    c.getContext('2d').drawImage(src,(src.width-16*s)/2,(src.height-9*s)/2,16*s,9*s,0,0,480,270);PARK.thumbs[M.key]=c.toDataURL('image/jpeg',.82);
    RUNMAPS.forEach((q,k)=>q.grp.visible=prevVis[k]);P.visible=pv;cam.position.copy(cp);cam.quaternion.copy(cq);if(inSpad)inSpad.add(spadG)}catch(e){PARK.thumbs[M.key]=''}
  return PARK.thumbs[M.key]}
function parkMenu(){overlay(false);PARK.on=true;state='menu';const L=parkMaps();PARK.i=Math.max(0,Math.min(L.length-1,L.indexOf(runL)>=0?L.indexOf(runL):PARK.i));
  $('park').classList.remove('hide');renderPark();setTimeout(()=>{try{$('parkPlay').focus({preventScroll:true})}catch(e){}},60)}
function closePark(){PARK.on=false;$('park').classList.add('hide')}
function renderPark(){const L=parkMaps(),M=L[PARK.i],n=mapCount(RUNMAPS.indexOf(M)),b=bestR[M.key];
  $('parkName').textContent=M.name;$('parkBest').textContent=b?`Best score ${b.toLocaleString()}`:'No best score yet';
  $('parkMeta').textContent=[`${PARK.i+1} of ${L.length}`,n?`${n} friend${n>1?'s':''} here`:''].filter(Boolean).join(' · ');
  const img=$('parkImg'),src=parkThumb(M);if(src){img.src=src;img.alt=M.name+' from above'}img.parentNode.classList.toggle('noimg',!src)}
function parkStep(d){const n=parkMaps().length;PARK.i=(PARK.i+d+n)%n;renderPark();SFX.ui(2)}
function parkPlay(){const M=parkMaps()[PARK.i];closePark();select('run',RUNMAPS.indexOf(M))}
$('parkPrev').addEventListener('click',()=>parkStep(-1));$('parkNext').addEventListener('click',()=>parkStep(1));
$('parkPlay').addEventListener('click',parkPlay);$('parkFrame').addEventListener('click',parkPlay);
$('parkMore').addEventListener('click',()=>{closePark();openMapsPanel()});$('parkBack').addEventListener('click',()=>{closePark();menu()});
function parkKey(c){if(c==='ArrowLeft'||c==='KeyA')parkStep(-1);else if(c==='ArrowRight'||c==='KeyD')parkStep(1);else if(c==='Enter'||c==='Space')parkPlay();else if(c==='Escape'){closePark();menu()}else return false;return true}
function parkPad(L,R,ok,back,tri){if(L)parkStep(-1);else if(R)parkStep(1);else if(ok)parkPlay();else if(back){closePark();menu()}else if(tri){closePark();openMapsPanel()}}
