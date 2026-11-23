// Quality of life: hold to respawn, hold to retry, stop an orb run, orb runs that end in place, and the Moves list.
//   Hold Respawn (L3 / R) ~1s: back to the spawn point (Trick Park), your last checkpoint (flag race) or the last
//     flag (Adventure). A safety valve for any odd spot.
//   Hold Start (△ / Enter) ~0.8s: restart what you're doing: the timed orb run, the flag race, or the Adventure level.
const HOLD={id:null,t:0,done:false};
const HOLD_T={respawn:1,start:.8};
function holdLabel(id){if(id==='respawn')return mode==='adv'?'Back to the last flag':FR.on&&!FR.done?'Back to your checkpoint':'Back to the spawn point';
  return mode==='adv'?'Restart level':WAR.on?'Restart match':TAG.on?'Restart tag':!runFree||runCD>0?'Restart Collectathon':'Restart race'}
// what holding Start would restart right now (nothing in plain free roam, where a tap starts the orb run)
const retryable=()=>mode==='adv'||(mode==='run'&&(WAR.on||TAG.on))||(mode==='run'&&(!runFree||runCD>0))||(mode==='run'&&FR.on&&!runL.spad);
function holdFrame(dt){const m=$('holdMeter');
  const want=state!=='play'?null:held('respawn')?'respawn':held('start')&&retryable()?'start':null;
  if(want!==HOLD.id){HOLD.id=want;HOLD.t=0;HOLD.done=false}
  if(!want||HOLD.done){m.classList.remove('on');return}
  HOLD.t+=dt;const k=Math.min(1,HOLD.t/HOLD_T[want]);
  if(HOLD.t>.15){m.classList.add('on');$('holdLab').textContent=holdLabel(want);$('holdBar').style.transform=`scaleX(${k})`}
  if(k>=1){HOLD.done=true;m.classList.remove('on');want==='respawn'?respawnHere():quickRetry()}}
function respawnHere(){SFX.ui(3);
  if(mode==='adv'){respawn(false);return}
  if(FR.on&&!FR.done){frRespawn();return}
  const s=runL.custom?runL.spawn:{x:0,y:0,z:0};P.position.set(s.x,0,s.z);py=s.y||0;vy=0;vel.set(0,0,0);grounded=true;stand=null;resetPound();
  if(chars[ci].acro)resetAcro();CL.on=false;CL.top=false;LH.on=false;invuln=1;dropCombo();burst(V(P.position.x,py+1,P.position.z),0x5ff3ff,10)}
function quickRetry(){if(mode==='adv'){retry();return}
  if(WAR.on){startWars();return}
  if(TAG.on){startTag();return}
  if(!runFree||runCD>0){runFree=true;runCD=0;beginTimed();return}   // fresh countdown right where you are
  if(FR.on)startRun(true)}
// leave a timed orb run early: back to free roam right where you are
function stopOrbRun(){if(mode!=='run'||runFree)return;toFreeInPlace();toast('Collectathon stopped.')}
// a timed run is over (time up, out of lives, or stopped): free roam again, in place, no reset to spawn
function toFreeInPlace(){raceStop();runFree=true;runCD=0;time=T.run.time;runT=0;score=0;orbN=0;lives=3;padHold=0;Object.assign(TR,{pts:0,mult:0,names:[],t:0});showCombo();
  if(!MP.client){const extra=runHz.splice(T.run.hazardsFree);extra.forEach(h=>rmObj(h.g));runQ=[]}
  hud();freeUI();renderControls()}
// ---------- Moves list (pause menu) ----------
let movesOpen=false,mvCat=0;
// Moves: pages of move cards, flipped like the map picker (arrows, tabs, L1/R1)
function openMoves(){movesOpen=true;mvCat=Math.min(mvCat,moveGroups().length-1);$('movesT').textContent=`${chars[ci].name}\u2019s Moves`;renderMoves();
  $('moves').classList.remove('hide');$('ov').classList.add('hide');setTimeout(()=>{try{$('movesBack').focus({preventScroll:true})}catch(e){}},50)}
function renderMoves(){const G=moveGroups(),g=G[mvCat];
  $('mvCat').textContent=g.name;$('mvOf').textContent=`${mvCat+1} of ${G.length}`;
  $('mvTabs').innerHTML=G.map((q,i)=>`<button class="mvtab${i===mvCat?' on':''}" data-i="${i}" tabindex="-1">${q.name}</button>`).join('');
  $('movesList').innerHTML=g.items.map(([n,keys,tip])=>`<div class="mvc"><b>${n}</b><div class="mvk">${keys}</div><p>${tip}</p></div>`).join('');$('movesList').scrollTop=0}
function moveCat(d){const n=moveGroups().length;mvCat=(mvCat+d+n)%n;SFX.ui(1);renderMoves()}
function closeMoves(){if(!movesOpen)return;movesOpen=false;$('moves').classList.add('hide');showPause()}
$('movesBack').addEventListener('click',closeMoves);$('mvPrev').addEventListener('click',()=>moveCat(-1));$('mvNext').addEventListener('click',()=>moveCat(1));
$('mvTabs').addEventListener('click',e=>{const t=e.target.closest('.mvtab');if(t){mvCat=+t.dataset.i;SFX.ui(1);renderMoves()}});
function movesPad(L,R,U,D,back,l1,r1){if(L||l1)moveCat(-1);if(R||r1)moveCat(1);if(U||D)$('movesList').scrollBy({top:D?120:-120,behavior:'smooth'});if(back)closeMoves()}
