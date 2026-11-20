// Game state and flow: shared variables, HUD, overlay card, main/park/level menus, character
// select, world switching, pause/resume/retry.
// ---------- state ----------
let mode='run',state='menu',score=0,time=45,lives=3,invuln=0,shake=0,grounded=true,stand=null;
let atime=0,falls=0,coreCount=0,cp=null,won=false,advT=0,spawnCount=0,lastZone=null;
let best=0;const bestA={},bestR={};try{['orbRunPlaza2','orbRunBest3','orbRunBest4'].forEach(k=>bestR[k]=+localStorage.getItem(k)||0);levels.forEach(L=>bestA[L.key]=+localStorage.getItem(L.key)||0)}catch(e){}
const vel=V(0,0,0);let vy=0,py=0,face=0,walk=0;
const keys={},joy={x:0,z:0};
const fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
const level=()=>Math.floor(score/5);

function hud(){
  if(mode==='run'){$('k1').textContent=runFree?'Practice':'Score';$('v1').textContent=score;$('v2').textContent=runFree?'Free':runCD>0?'Ready':Math.ceil(time);$('v2').classList.toggle('low',!runFree&&!runCD&&time<10)}
  else{$('k1').textContent='Cores';$('v1').textContent=`${coreCount}/3`;$('v2').textContent=fmt(atime);$('v2').classList.remove('low')}
  {const sb=$('snowBox');if(sb){sb.style.display=mode==='run'&&state!=='menu'&&state!=='select'?'':'none';snowHud()}}
  $('lv').innerHTML=[0,1,2].map(i=>`<i class="${i<lives?'':'off'}"></i>`).join('');
  $('mname').textContent=state==='menu'?'':mode==='run'?runL.name:'Adventure';
}
function hint(t){const h=$('hint');if(h.textContent===t)return;h.textContent=t;h.classList.remove('pop');void h.offsetWidth;if(t)h.classList.add('pop')}
let onGo=null,onAlt=null,onAlt2=null,onAlt3=null;
function overlay(show,t,p,goTxt,altTxt,go,alt,alt2Txt='',alt2=null,alt3Txt='',alt3=null){
  $('ov').classList.toggle('hide',!show);$('ov').classList.remove('menu');if(!show){document.activeElement&&document.activeElement.blur&&document.activeElement.blur();return}
  $('ovT').textContent=t;$('ovT').classList.toggle('logo',t==='Snowball Wars');$('ovP').textContent=p;$('go').textContent=goTxt;$('alt').textContent=altTxt;onGo=go;onAlt=alt;$('alt2').textContent=alt2Txt;onAlt2=alt2;$('alt3').textContent=alt3Txt;onAlt3=alt3;
  $('best').textContent=RUNMAPS.map(M=>`${M.name}: ${bestR[M.key]||'not yet'}`).join(' \u00b7 ')+levels.map(L=>` · ${L.name}: ${bestA[L.key]?fmt(bestA[L.key]):'not yet'}`).join('');
  setTimeout(()=>$('go').focus(),50);
}
$('go').addEventListener('click',()=>onGo&&onGo());$('alt2').addEventListener('click',()=>onAlt2&&onAlt2());$('alt3').addEventListener('click',()=>onAlt3&&onAlt3());$('alt').addEventListener('click',()=>onAlt&&onAlt());
function menu(){chars.forEach((c,i)=>{if(c.outs&&!unlocked(OFI[i],c.outs)){OFI[i]=0;applyOutfitTo(c.rig.mats,0,c.outs)}});

  state='menu';mode='run';ci=2;wave=1.6;setWorld('run');resetRun();hint('');hud();freeUI();
  overlay(true,'Snowball Wars','Meet Flip and his sister Skye, pint-sized stunt pilots with momentum to burn. Trick Park: chain flips, dives and wall jumps into combos, grab orbs for snowballs and pelt your rivals. Adventure: handmade levels to conquer.','Trick Park','Adventure',()=>parkMenu(),()=>levelMenu());
  $('ov').classList.add('menu');
}
function parkMenu(){const lab=(n,i)=>{const c=mapCount(i);return c?`${n} \u00b7 ${c} here`:n};
  overlay(true,'Trick Park','Plaza: a skatepark built around trick lines, with named gaps to discover. Frozen Rink: skate on slippery ice, then trick off the snow fort and candy canes. Rooftops: a vertical city of wall-jump alleys and rooftop orbs.'+(MP.on?' Friends on the same map play together.':''),lab('Plaza',0),lab('Frozen Rink',1),()=>select('run',0),()=>select('run',1),lab('Rooftops',2),()=>select('run',2),'Back',()=>menu())}
function levelMenu(){overlay(true,'Adventure','Lighthouse Isles: hop across islands and light the lighthouse. Sky Gauntlet: a climb through sky ruins that needs every one of Flip’s tricks, wall jumps included.','Lighthouse Isles','Sky Gauntlet',()=>select('adv',0),()=>select('adv',1),'Back',()=>menu())}
let pickMode='run',pickLevel=0,lockChar=false;
function select(m,lv=0){
  pickMode=m;pickLevel=lv;if(m==='run'&&lv!==runIdx){useRunMap(lv);setWorld('run');resetRun()}lockChar=m==='adv'&&!!levels[lv].flipOnly;ci=lockChar&&!chars[pickCi].acro?2:pickCi;state='select';overlay(false);$('cs').classList.remove('hide');
  P.position.set(0,0,0);py=0;vel.set(0,0,0);
  $('csMode').textContent=m==='run'?`Trick Park \u00b7 ${RUNMAPS[lv].name}`:`Adventure · ${levels[lv].name}${lockChar?' · Flip and Skye only':''}`;showChar();setTimeout(()=>$('csGo').focus(),50);
}
function showChar(){
  const c=chars[ci];$('csName').textContent=c.name;$('csDesc').textContent=c.desc;
  $('bSp').style.width=c.sp*20+'%';$('bJp').style.width=c.jp*20+'%';$('bAg').style.width=c.ag*20+'%';
  renderOutfits();
  $('csMoves').textContent=c.moves||'';$('cb').classList.toggle('na',!c.acro);
  $('dots').innerHTML=pickOrder().map(i=>`<i class="${i===ci?'on':''}"></i>`).join('');
  wave=1.6;if(!lockChar){pickCi=ci;try{localStorage.setItem('orbRunPick',ci)}catch(e){}}
}
function renderOutfits(){
  if(!chars[ci].outs){$('outfits').innerHTML='';return}
  const L=chars[ci].outs,cur=OFI[ci],o=L[cur],hex=n=>'#'+n.toString(16).padStart(6,'0');
  $('outfits').innerHTML=`<span class="on">Outfit: <b>${o.name}</b>${touchUI||pad.connected?'':' <kbd>\u2191</kbd><kbd>\u2193</kbd>'}${pad.connected?' D-pad \u2191\u2193':''}</span>`+
    L.map((q,i)=>`<button class="sw${i===cur?' cur':''}${unlocked(i,L)?'':' locked'}" data-o="${i}" aria-label="${q.name}${unlocked(i,L)?'':' (locked: '+q.lock+')'}" title="${unlocked(i,L)?q.name:q.lock}" style="background:linear-gradient(135deg,${hex(q.jacket)} 55%,${hex(q.scarf)} 55%)"></button>`).join('');
}
function setOutfit(i){const c=chars[ci],L=c.outs;if(!L)return;if(!unlocked(i,L)){toast(L[i].lock);SFX.deny();return}
  OFI[ci]=i;applyOutfit(i);try{localStorage.setItem(c.ofKey,i)}catch(e){}renderOutfits();wave=1.6;SFX.ui(i+2)}
function cycleOutfit(d){const L=chars[ci].outs;if(!L)return;let i=OFI[ci];for(let n=0;n<L.length;n++){i=(i+d+L.length)%L.length;if(unlocked(i,L))break}setOutfit(i)}
$('outfits').addEventListener('click',e=>{const b=e.target.closest('.sw');if(b)setOutfit(+b.dataset.o)});
// levels marked flipOnly need the acrobat moveset, so only Flip and Skye can be picked there
const pickOrder=()=>lockChar?ORDER.filter(i=>chars[i].acro):ORDER;
function cycle(d){const O=pickOrder();ci=O[(O.indexOf(ci)+d+O.length)%O.length];showChar();SFX.ui(ci)}
function confirmChar(){$('cs').classList.add('hide');document.activeElement&&document.activeElement.blur&&document.activeElement.blur();if(pickMode==='run'){useRunMap(pickLevel);startRun()}else startAdv(pickLevel)}
$('prev').addEventListener('click',()=>cycle(-1));$('next').addEventListener('click',()=>cycle(1));
$('csGo').addEventListener('click',confirmChar);
$('csBack').addEventListener('click',()=>{$('cs').classList.add('hide');menu()});
function setWorld(m){RUNMAPS.forEach(M=>M.grp.visible=m==='run'&&M===runL);levels.forEach(L=>L.advW.visible=m==='adv'&&L===curL)}
function resume(){state='play';overlay(false)}
function retry(){mode==='run'?startRun(runFree):startAdv(curIdx)}
function pause(){if(state!=='play')return;state='paused';
  if(mode==='run'&&runFree){overlay(true,'Free roam','Practice as long as you like.'+gapText(),'Resume','Start timed run',resume,()=>{resume();beginTimed()},'Quit to menu',()=>menu());$('ovP').textContent+=' Sound settings: the gear in the top bar.';return}
  overlay(true,'Paused',mode==='run'?'Take a breather. The spikeballs will wait.'+gapText():`${curL.name} \u00b7 ${fmt(atime)} \u00b7 ${coreCount}/3 cores`,'Resume','Retry',resume,retry,'Quit to menu',()=>menu());$('ovP').textContent+=' Sound settings: the gear in the top bar.'}
