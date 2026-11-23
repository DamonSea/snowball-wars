// Game state and flow: shared variables, HUD, overlay card, main/park/level menus, character
// select, world switching, pause/resume/retry.
// ---------- state ----------
let mode='run',state='menu',score=0,time=45,lives=3,invuln=0,shake=0,grounded=true,stand=null;
let atime=0,falls=0,coreCount=0,cp=null,won=false,advT=0,spawnCount=0,lastZone=null;
let best=0;const bestA={},bestR={};try{['orbRunPlaza2','orbRunBest3','orbRunBest4','orbRunJungle'].forEach(k=>bestR[k]=+localStorage.getItem(k)||0);levels.forEach(L=>bestA[L.key]=+localStorage.getItem(L.key)||0)}catch(e){}
const vel=V(0,0,0);let vy=0,py=0,face=0,walk=0;
const keys={},joy={x:0,z:0};
const fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
const level=()=>Math.floor(score/5);

function hud(){
  if(mode==='run'&&typeof WAR!=='undefined'&&WAR.on){$('k1').textContent='Score';$('v1').textContent=WAR.score;$('v2').textContent=WAR.cd>0?'Ready':fmtClock(WAR.t);$('v2').classList.toggle('low',!WAR.cd&&WAR.t<15);lives=WAR.out>0?0:WAR.hp}
  else if(mode==='run'){$('k1').textContent=runFree?'Practice':'Score';$('v1').textContent=score;$('v2').textContent=runFree?(typeof FR!=='undefined'&&FR.on?fmtRace(FR.t):'Free'):runCD>0?'Ready':Math.ceil(time);$('v2').classList.toggle('low',!runFree&&!runCD&&time<10)}
  else{$('k1').textContent='Cores';$('v1').textContent=`${coreCount}/3`;$('v2').textContent=fmt(atime);$('v2').classList.remove('low')}
  {const sb=$('snowBox');if(sb){sb.style.display=mode==='run'&&state!=='menu'&&state!=='select'?'':'none';snowHud()}}
  {const k=$('lvK');if(k)k.textContent=mode==='run'&&typeof WAR!=='undefined'&&WAR.on?'Hearts':'Lives'}
  $('lv').innerHTML=[0,1,2].map(i=>`<i class="${i<lives?'':'off'}"></i>`).join('');
  $('mname').textContent=state==='menu'?'':mode==='run'?runL.name:'Adventure';
}
function hint(t){const h=$('hint');if(h.textContent===t)return;h.textContent=t;h.classList.remove('pop');void h.offsetWidth;if(t)h.classList.add('pop')}
let onGo=null,onAlt=null,onAlt2=null,onAlt3=null,onAlt4=null,onAlt5=null,onAlt6=null,onAlt7=null;
function overlay(show,t,p,goTxt,altTxt,go,alt,alt2Txt='',alt2=null,alt3Txt='',alt3=null,alt4Txt='',alt4=null,alt5Txt='',alt5=null,alt6Txt='',alt6=null,alt7Txt='',alt7=null){
  $('ov').classList.toggle('hide',!show);$('ov').classList.remove('menu','pausem','wres');if(!show){document.activeElement&&document.activeElement.blur&&document.activeElement.blur();return}
  $('ovT').textContent=t;$('ovT').classList.toggle('logo',t==='Snowball Wars');$('ovP').textContent=p;$('go').textContent=goTxt;$('alt').textContent=altTxt;onGo=go;onAlt=alt;$('alt2').textContent=alt2Txt;onAlt2=alt2;$('alt3').textContent=alt3Txt;onAlt3=alt3;$('alt4').textContent=alt4Txt;onAlt4=alt4;$('alt5').textContent=alt5Txt;onAlt5=alt5;$('alt6').textContent=alt6Txt;onAlt6=alt6;$('alt7').textContent=alt7Txt;onAlt7=alt7;
  $('best').textContent=RUNMAPS.filter(M=>!M.custom).map(M=>`${M.name}: ${bestR[M.key]||'not yet'}`).join(' \u00b7 ')+levels.map(L=>` · ${L.name}: ${bestA[L.key]?fmt(bestA[L.key]):'not yet'}`).join('');
  setTimeout(()=>$('go').focus(),50);
}
$('go').addEventListener('click',()=>onGo&&onGo());$('alt2').addEventListener('click',()=>onAlt2&&onAlt2());$('alt3').addEventListener('click',()=>onAlt3&&onAlt3());$('alt4').addEventListener('click',()=>onAlt4&&onAlt4());$('alt5').addEventListener('click',()=>onAlt5&&onAlt5());$('alt6').addEventListener('click',()=>onAlt6&&onAlt6());$('alt7').addEventListener('click',()=>onAlt7&&onAlt7());$('alt').addEventListener('click',()=>onAlt&&onAlt());
function menu(){BLD.testing=false;if(typeof closeMoves==='function'&&movesOpen){movesOpen=false;$('moves').classList.add('hide')}if(typeof closePark==='function')closePark();if(typeof closeMapsPanel==='function')closeMapsPanel();chars.forEach((c,i)=>{if(c.outs&&!unlocked(OFI[i],c.outs)){OFI[i]=0;applyOutfitTo(c.rig.mats,0,c.outs)}});

  state='menu';mode='run';ci=2;wave=1.6;setWorld('run');resetRun();hint('');hud();freeUI();
  overlay(true,'Snowball Wars','','Trick Park','Adventure',()=>parkMenu(),()=>levelMenu(),'Map Builder',()=>openMapsPanel());
  $('ov').classList.add('menu');
}
function levelMenu(){overlay(true,'Adventure','Lighthouse Isles: hop across islands and light the lighthouse. Sky Gauntlet: a climb through sky ruins that needs every one of Flip’s tricks, wall jumps included.','Lighthouse Isles','Sky Gauntlet',()=>select('adv',0),()=>select('adv',1),'Back',()=>menu())}
let pickMode='run',pickLevel=0,lockChar=false;
function select(m,lv=0){if(typeof closePark==='function')closePark();
  pickMode=m;pickLevel=lv;if(m==='run'&&lv!==runIdx){useRunMap(lv);setWorld('run');resetRun()}lockChar=m==='adv'&&!!levels[lv].flipOnly;ci=lockChar&&!chars[pickCi].acro?2:pickCi;state='select';overlay(false);$('cs').classList.remove('hide');
  P.position.set(0,0,0);py=0;vel.set(0,0,0);
  $('csMode').textContent=m==='run'?`Trick Park \u00b7 ${RUNMAPS[lv].name}`:`Adventure · ${levels[lv].name}`;showChar();setTimeout(()=>$('csGo').focus(),50);
}
function showChar(){
  const c=chars[ci];$('csName').textContent=c.name;$('csDesc').textContent=c.desc;
  $('bSp').style.width=c.sp*20+'%';$('bJp').style.width=c.jp*20+'%';$('bAg').style.width=c.ag*20+'%';
  renderOutfits();
  $('csMoves').textContent=c.moves||'';$('csCust').innerHTML=c.outs?'Customize<span class="pk" aria-hidden="true">\u25b3</span>':'';$('cb').classList.toggle('na',!c.acro);
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
// levels marked flipOnly need the acrobat moveset, so only Flip and Nova can be picked there
const pickOrder=()=>lockChar?ORDER.filter(i=>chars[i].acro):ORDER;
function cycle(d){const O=pickOrder();ci=O[(O.indexOf(ci)+d+O.length)%O.length];showChar();SFX.ui(ci)}
function confirmChar(){$('cs').classList.add('hide');document.activeElement&&document.activeElement.blur&&document.activeElement.blur();if(pickMode==='run'){useRunMap(pickLevel);startRun()}else startAdv(pickLevel)}
$('prev').addEventListener('click',()=>cycle(-1));$('next').addEventListener('click',()=>cycle(1));
$('csGo').addEventListener('click',confirmChar);$('csCust').addEventListener('click',()=>openCust());
$('csBack').addEventListener('click',()=>{$('cs').classList.add('hide');menu()});
function setWorld(m){RUNMAPS.forEach(M=>M.grp.visible=m==='run'&&M===runL);levels.forEach(L=>L.advW.visible=m==='adv'&&L===curL)}
function resume(){state='play';overlay(false)}
function retry(){mode==='run'?startRun(runFree):startAdv(curIdx)}
function pause(){if(state!=='play')return;state='paused';wave=1.6;idleT=0;showPause()}
// one vertical column: Resume, then this mode's actions, then Moves, Settings and Quit (the character waves on the left)
function showPause(){const quit=BLD.testing?['Back to builder',()=>backToBuilder()]:['Quit to menu',()=>menu()],tail=[['Moves',()=>openMoves()],['Settings',()=>openSet()],quit];
  let title,line='',acts;
  if(mode==='run'&&WAR.on){title='Snowball Wars';const st=standings(),pl=st.findIndex(r=>r.me)+1;line=`Score ${WAR.score} \u00b7 ${pl}${['st','nd','rd'][pl-1]||'th'} of ${st.length} \u00b7 ${fmtClock(WAR.t)} left`;
    acts=[['Restart match',()=>{resume();startWars()}],['End match',()=>{resume();warsStop(true);hint(freeHint());toast('Match ended.')}]]}
  else if(mode==='run'&&runFree){const race=FR.on&&!FR.done,b=FR.on?raceBest():null;title=FR.on?'Flag race':runL.custom?runL.name:'Trick Park';
    if(FR.on)line=FR.done?'Finished! Keep exploring, or race again.':`Race time ${fmtRace(FR.t)}${b?' · best '+fmtRace(b):''} · checkpoints ${FR.reached}/${runL.cps.length}`;
    acts=[runL.spad?['Start game',()=>{resume();beginTimed()}]:null,canWar()?['Snowball Wars',()=>{resume();startWars()}]:null,race&&FR.reached?['Last checkpoint',()=>{resume();frRespawn()}]:null,FR.on?['Restart race',()=>startRun(true)]:null].filter(Boolean)}
  else if(mode==='run'){title='Orb run';line=`Score ${score} · ${Math.ceil(time)}s left`;acts=[['Restart orb run',()=>{resume();quickRetry()}],['Stop orb run',()=>{resume();stopOrbRun()}]]}
  else{title=curL.name;line=`${fmt(atime)} \u00b7 ${coreCount}/3 cores`;acts=[['Retry',retry]]}
  const B=[['Resume',resume],...acts,...tail],g=k=>B[k]||['',null];
  overlay(true,title,line,g(0)[0],g(1)[0],g(0)[1],g(1)[1],g(2)[0],g(2)[1],g(3)[0],g(3)[1],g(4)[0],g(4)[1],g(5)[0],g(5)[1],g(6)[0],g(6)[1],g(7)[0],g(7)[1]);
  $('ov').classList.add('menu','pausem')}
