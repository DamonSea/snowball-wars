// Settings panel: season, snowfall, volume mix and per-sound styles; HUD sound and pause buttons.
// ---------- sound settings panel ----------
let setOpen=false,setRow=0;const SKEYS=Object.keys(SFXV);
let sideStyle='somersault';try{if(localStorage.getItem('orbRunSideFlip')==='classic')sideStyle='classic'}catch(e){}
const LOOK={season:{label:'Season',opts:['Winter','Summer'],get:()=>WIN?0:1,set:i=>setSeason(i===0)},snowfall:{label:'Snowfall',opts:['On','Off'],get:()=>SNOW?0:1,set:i=>setSnow(i===0)},
  time:{label:'Time of day',opts:['Always day','Always night','Day & night'],get:()=>['day','night','cycle'].indexOf(DN.mode),set:i=>setTimeOfDay(['day','night','cycle'][i])},
  menuMusic:{label:'Menu music',opts:MUSIC_MENU.map(o=>o[1]),get:()=>Math.max(0,MUSIC_MENU.findIndex(o=>o[0]===MUSC.menu)),set:i=>setMusicPick('menu',MUSIC_MENU[i][0])},
  parkMusic:{label:'Trick Park music',opts:MUSIC_PARK.map(o=>o[1]),get:()=>Math.max(0,MUSIC_PARK.findIndex(o=>o[0]===MUSC.park)),set:i=>setMusicPick('park',MUSIC_PARK[i][0])},
  camera:{label:'Camera',opts:CAM_NAMES,get:()=>CAMS.indexOf(CAM.mode),set:i=>setCam(CAMS[i])},
  graphics:{label:'Graphics',opts:['Auto','High','Balanced','Low'],get:()=>['auto','high','balanced','low'].indexOf(GFX.mode),set:i=>setQual(['auto','high','balanced','low'][i])},
  perf:{label:'Performance stats',opts:['Off','On'],get:()=>PERF.on?1:0,set:i=>setPerf(i===1)},
  sideFlip:{label:'Side flip style',opts:['Somersault','Classic'],get:()=>sideStyle==='classic'?1:0,set:i=>{sideStyle=i?'classic':'somersault';try{localStorage.setItem('orbRunSideFlip',sideStyle)}catch(e){}}},
  hang:{label:'Ledge hang',opts:['On','Off'],get:()=>LH.enabled?0:1,set:i=>{LH.enabled=i===0;if(!LH.enabled)LH.on=false;try{localStorage.setItem('orbRunHang',LH.enabled?'1':'0')}catch(e){}}},
  squash:{label:'Squash & stretch',slider:true,get:()=>TOON,set:v=>setToon(v)},
  yellow:{label:'Yellow snow',opts:['On','Off'],get:()=>YS.on?0:1,set:i=>setYellow(i===0)},
  orbs:{label:'Orb style',opts:ORB_SKINS.map(s=>s.name),get:()=>Math.max(0,ORB_SKINS.findIndex(s=>s.id===ORB_SKIN)),set:i=>setOrbSkin(ORB_SKINS[i].id)},
  rivals:{label:'Collectathon rivals',opts:['2 computer','1 computer','Off'],get:()=>[2,1,0].indexOf(RACE.rivals),set:i=>setRivals([2,1,0][i])},
  foes:{label:'Enemies',opts:['Winter crew','Spikeballs'],get:()=>FOE_STYLE==='spike'?1:0,set:i=>setFoeStyle(i?'spike':'crew')},
  cpu:{label:'Computer player',opts:['Off','On'],get:()=>CPU.on?1:0,set:i=>setCpu(i===1)}};
const ROWS=[...Object.keys(LOOK),...SKEYS,...BIND_ROWS];let setSlot=0;
// tabs: Game (look and gameplay), Sound (mix and a style per sound), Controls (bindings). Each tab owns a run of ROWS.
let setTab='game';try{const t=localStorage.getItem('orbRunSetTab');if(['game','sound','controls'].includes(t))setTab=t}catch(e){}
const nL=()=>Object.keys(LOOK).length,tabRows=()=>{const a=setTab==='game'?0:setTab==='sound'?nL():nL()+SKEYS.length,b=setTab==='game'?nL():setTab==='sound'?nL()+SKEYS.length:ROWS.length;return[a,b]};
const SUBS={game:'Look, feel and gameplay options.',sound:'Set the mix, then pick a style for each sound. Choosing one plays it; \u25b6 replays it.',controls:'Click a slot, then press the key, mouse button or controller button you want.'};
function setTabTo(t){setTab=t;try{localStorage.setItem('orbRunSetTab',t)}catch(e){}CAP=null;setRow=tabRows()[0];setSlot=0;renderSet();$('setList').scrollTop=0;$('set').querySelector('.setcard').scrollTop=0;SFX.ui(2)}
document.querySelector('#set .stabs').addEventListener('click',e=>{const b=e.target.closest('.stab');if(b)setTabTo(b.dataset.st)});
function renderSet(){
  const fr=ri=>ri===setRow&&document.body.classList.contains('padnav')?' focus':'';
  document.querySelectorAll('#set .stab').forEach(b=>{b.classList.toggle('on',b.dataset.st===setTab);b.setAttribute('aria-selected',b.dataset.st===setTab)});
  const card=$('set').querySelector('.setcard');['game','sound','controls'].forEach(t=>card.classList.toggle('t-'+t,t===setTab));$('setSub').textContent=SUBS[setTab];
  $('setList').innerHTML=(setTab!=='game'?'':Object.keys(LOOK).map((k,ri)=>{const S=LOOK[k],cur=S.get();
    if(S.slider)return `<div class="srow${fr(ri)}" data-row="${ri}"><label class="sl" for="sld-${k}">${S.label}</label><div class="sld"><small>Default</small><input type="range" id="sld-${k}" data-sld="${k}" min="0" max="100" step="5" value="${Math.round(cur*100)}" aria-valuetext="${cur?Math.round(cur*100)+'%':'Default'}"><small>Max</small></div><span></span></div>`;
    return `<div class="srow${fr(ri)}" data-row="${ri}"><span class="sl" id="sl-${k}">${S.label}</span><div class="seg" role="radiogroup" aria-labelledby="sl-${k}">${S.opts.map((o,i)=>`<button class="opt${i===cur?' on':''}" role="radio" aria-checked="${i===cur}" data-look="${k}" data-i="${i}">${o}</button>`).join('')}</div><span></span></div>`}).join(''))
    +(setTab!=='sound'?'':SKEYS.map((k,si)=>{const ri=si+Object.keys(LOOK).length,S=SFXV[k],cur=selOf(k);
    return `<div class="srow${fr(ri)}" data-row="${ri}" data-k="${k}"><span class="sl" id="sl-${k}">${S.label}</span>
      <div class="seg" role="radiogroup" aria-labelledby="sl-${k}">${S.opts.map((o,i)=>`<button class="opt${i===cur?' on':''}" role="radio" aria-checked="${i===cur}" data-k="${k}" data-i="${i}">${o[0]}</button>`).join('')}
      <button class="opt off${cur<0?' on':''}" role="radio" aria-checked="${cur<0}" data-k="${k}" data-i="-1">Off</button></div>
      <button class="pv" data-k="${k}" aria-label="Preview ${S.label}" ${cur<0?'disabled':''}>&#9654;</button></div>`}).join(''))
    +(setTab!=='controls'?'':bindRowsHTML(Object.keys(LOOK).length+SKEYS.length,fr));
  if(document.body.classList.contains('padnav')){const r=$('setList').querySelector(`[data-row="${setRow}"] [data-slot="${setSlot}"]`);r&&r.classList.add('slotfocus')}
  $('volr').value=Math.round(AU.vol*100);['vMus','vSfx','vAmb'].forEach(k=>$('v-'+k).value=Math.round(AU[k]*100));$('setMute').textContent=AU.muted?'Unmute':'Mute';
  $('setPad').textContent=pad.connected?'Controller: L1 / R1 switch tabs · ↑↓ choose a row · ←→ change it · ✕ preview · ○ done':'';
}
function chooseSfx(k,i){sfxSel[k]=i;try{localStorage.setItem('orbRunSfx',JSON.stringify(sfxSel))}catch(e){}renderSet();if(i>=0){if(AU.muted)toast('Sound is muted');else previewSfx(k)}}
function openSet(){if(state==='play')pause();setOpen=true;setRow=tabRows()[0];renderSet();document.body.classList.add('setopen');$('set').classList.remove('hide');$('set').setAttribute('aria-hidden','false');
  const card=$('set').querySelector('.setcard');card.scrollTop=0;setTimeout(()=>{try{$('setClose').focus({preventScroll:true})}catch(e){}card.scrollTop=0},50)}
function closeSet(){CAP=null;setOpen=false;document.body.classList.remove('setopen');$('set').classList.add('hide');$('set').setAttribute('aria-hidden','true');document.activeElement&&document.activeElement.blur&&document.activeElement.blur();
  if(!$('ov').classList.contains('hide'))setTimeout(()=>$('go').focus(),50)}
$('gear').addEventListener('click',()=>{$('gear').blur();setOpen?closeSet():openSet()});
$('setClose').addEventListener('click',closeSet);
$('setReset').addEventListener('click',()=>{sfxSel={};Object.assign(AU,{vMus:.55,vSfx:1,vAmb:.8});['vMus','vSfx','vAmb'].forEach(k=>{try{localStorage.removeItem('orbRun_'+k)}catch(e){}if(AU.ctx)AU[{vMus:'mus',vSfx:'sfx',vAmb:'amb'}[k]].gain.value=AU[k]});try{localStorage.removeItem('orbRunSfx')}catch(e){}renderSet();SFX.ui(2)});
$('setMute').addEventListener('click',()=>{setMute(!AU.muted);renderSet()});
$('volr').addEventListener('input',e=>{AU.vol=e.target.value/100;try{localStorage.setItem('orbRunVol',AU.vol)}catch(_){}if(AU.master&&!AU.muted)AU.master.gain.setTargetAtTime(AU.vol,AU.ctx.currentTime,.02)});
$('volr').addEventListener('change',()=>SFX.ui(3));
document.querySelectorAll('.vols input').forEach(el=>{el.addEventListener('input',()=>{const k=el.dataset.k;AU[k]=el.value/100;try{localStorage.setItem('orbRun_'+k,AU[k])}catch(e){}
  const bus={vMus:'mus',vSfx:'sfx',vAmb:'amb'}[k];if(AU[bus])AU[bus].gain.setTargetAtTime(AU[k],AU.ctx.currentTime,.03)});el.addEventListener('change',()=>{if(el.dataset.k==='vSfx')SFX.ui(3)})});
$('setList').addEventListener('click',e=>{if(e.target.id==='bindReset'){resetBinds();return}const bb=e.target.closest('[data-bind]');if(bb){startCap(bb.dataset.bind,bb.dataset.dev,+bb.dataset.slot);return}const o=e.target.closest('.opt');if(o&&o.dataset.look){LOOK[o.dataset.look].set(+o.dataset.i);renderSet();SFX.ui(+o.dataset.i+2);return}if(o){chooseSfx(o.dataset.k,+o.dataset.i);return}
  const v=e.target.closest('.pv');if(v){if(AU.muted)toast('Sound is muted');previewSfx(v.dataset.k)}});
$('set').addEventListener('click',e=>{if(e.target.id==='set')closeSet()});
function setNav(L,R,U,D,ok,back,lb,rb){
  if(lb||rb){const T=['game','sound','controls'];setTabTo(T[(T.indexOf(setTab)+(rb?1:2))%3]);return}
  const[r0,r1]=tabRows();if(setRow<r0||setRow>=r1)setRow=r0;
  if(U||D){document.body.classList.add('padnav');setRow=r0+(setRow-r0+(D?1:-1)+(r1-r0))%(r1-r0);renderSet();
    const row=$('setList').querySelector(`[data-row="${setRow}"]`);row&&row.scrollIntoView({block:'nearest'});if(setRow===r0)$('set').querySelector('.setcard').scrollTop=0}
  const k=ROWS[setRow];
  if(k.startsWith('k:')||k.startsWith('p:')){if(L||R){setSlot=R?1:0;renderSet()}if(ok)startCap(k.slice(2),k[0]==='k'?'kb':'pad',setSlot);if(back)closeSet();return}
  if(L||R){if(LOOK[k]&&LOOK[k].slider){LOOK[k].set(Math.round((LOOK[k].get()+(R?.1:-.1))*10)/10);renderSet();SFX.ui(2)}
    else if(LOOK[k]){const n=LOOK[k].opts.length;LOOK[k].set((LOOK[k].get()+(R?1:-1)+n)%n);renderSet();SFX.ui(2)}
    else{const n=SFXV[k].opts.length,cur=selOf(k);let i=cur+(R?1:-1);if(i>=n)i=-1;if(i<-1)i=n-1;chooseSfx(k,i)}}
  if(ok&&!LOOK[k])previewSfx(k);if(back)closeSet();
}
$('snd').addEventListener('click',()=>{setMute(!AU.muted);$('snd').blur();if(!AU.muted)SFX.ui(3)});setMute(AU.muted);
$('pz').addEventListener('click',()=>{pause();$('pz').blur()});

$('setList').addEventListener('input',e=>{const r=e.target.closest('[data-sld]');if(r){LOOK[r.dataset.sld].set(r.value/100);r.setAttribute('aria-valuetext',r.value>0?r.value+'%':'Default')}});
$('setList').addEventListener('change',e=>{if(e.target.closest('[data-sld]'))SFX.ui(3)});
