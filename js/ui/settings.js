// Settings panel: season, snowfall, volume mix and per-sound styles; HUD sound and pause buttons.
// ---------- sound settings panel ----------
let setOpen=false,setRow=0;const SKEYS=Object.keys(SFXV);
let sideStyle='somersault';try{if(localStorage.getItem('orbRunSideFlip')==='classic')sideStyle='classic'}catch(e){}
const LOOK={season:{label:'Season',opts:['Winter','Summer'],get:()=>WIN?0:1,set:i=>setSeason(i===0)},snowfall:{label:'Snowfall',opts:['On','Off'],get:()=>SNOW?0:1,set:i=>setSnow(i===0)},
  sideFlip:{label:'Side flip style',opts:['Somersault','Classic'],get:()=>sideStyle==='classic'?1:0,set:i=>{sideStyle=i?'classic':'somersault';try{localStorage.setItem('orbRunSideFlip',sideStyle)}catch(e){}}},
  cpu:{label:'Computer player',opts:['Off','On'],get:()=>CPU.on?1:0,set:i=>setCpu(i===1)}};
const ROWS=[...Object.keys(LOOK),...SKEYS,...BIND_ROWS];let setSlot=0;
function renderSet(){
  const fr=ri=>ri===setRow&&document.body.classList.contains('padnav')?' focus':'';
  $('setList').innerHTML='<h2 class="sh">Game</h2>'+Object.keys(LOOK).map((k,ri)=>{const S=LOOK[k],cur=S.get();
    return `<div class="srow${fr(ri)}" data-row="${ri}"><span class="sl" id="sl-${k}">${S.label}</span><div class="seg" role="radiogroup" aria-labelledby="sl-${k}">${S.opts.map((o,i)=>`<button class="opt${i===cur?' on':''}" role="radio" aria-checked="${i===cur}" data-look="${k}" data-i="${i}">${o}</button>`).join('')}</div><span></span></div>`}).join('')
    +'<h2 class="sh">Sound</h2>'+SKEYS.map((k,si)=>{const ri=si+Object.keys(LOOK).length,S=SFXV[k],cur=selOf(k);
    return `<div class="srow${fr(ri)}" data-row="${ri}" data-k="${k}"><span class="sl" id="sl-${k}">${S.label}</span>
      <div class="seg" role="radiogroup" aria-labelledby="sl-${k}">${S.opts.map((o,i)=>`<button class="opt${i===cur?' on':''}" role="radio" aria-checked="${i===cur}" data-k="${k}" data-i="${i}">${o[0]}</button>`).join('')}
      <button class="opt off${cur<0?' on':''}" role="radio" aria-checked="${cur<0}" data-k="${k}" data-i="-1">Off</button></div>
      <button class="pv" data-k="${k}" aria-label="Preview ${S.label}" ${cur<0?'disabled':''}>&#9654;</button></div>`}).join('')
    +bindRowsHTML(Object.keys(LOOK).length+SKEYS.length,fr);
  if(document.body.classList.contains('padnav')){const r=$('setList').querySelector(`[data-row="${setRow}"] [data-slot="${setSlot}"]`);r&&r.classList.add('slotfocus')}
  $('volr').value=Math.round(AU.vol*100);['vMus','vSfx','vAmb'].forEach(k=>$('v-'+k).value=Math.round(AU[k]*100));$('setMute').textContent=AU.muted?'Unmute':'Mute';
  $('setPad').textContent=pad.connected?'Controller: ↑↓ choose a row · ←→ change it · ✕ preview · ○ done':'';
}
function chooseSfx(k,i){sfxSel[k]=i;try{localStorage.setItem('orbRunSfx',JSON.stringify(sfxSel))}catch(e){}renderSet();if(i>=0){if(AU.muted)toast('Sound is muted');else previewSfx(k)}}
function openSet(){if(state==='play')pause();setOpen=true;setRow=0;renderSet();$('set').classList.remove('hide');$('set').setAttribute('aria-hidden','false');setTimeout(()=>$('setClose').focus(),50)}
function closeSet(){CAP=null;setOpen=false;$('set').classList.add('hide');$('set').setAttribute('aria-hidden','true');document.activeElement&&document.activeElement.blur&&document.activeElement.blur();
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
function setNav(L,R,U,D,ok,back){
  if(U||D){document.body.classList.add('padnav');setRow=(setRow+(D?1:-1)+ROWS.length)%ROWS.length;renderSet();
    const row=$('setList').querySelector(`[data-row="${setRow}"]`);row&&row.scrollIntoView({block:'nearest'})}
  const k=ROWS[setRow];
  if(k.startsWith('k:')||k.startsWith('p:')){if(L||R){setSlot=R?1:0;renderSet()}if(ok)startCap(k.slice(2),k[0]==='k'?'kb':'pad',setSlot);if(back)closeSet();return}
  if(L||R){if(LOOK[k]){const n=LOOK[k].opts.length;LOOK[k].set((LOOK[k].get()+(R?1:-1)+n)%n);renderSet();SFX.ui(2)}
    else{const n=SFXV[k].opts.length,cur=selOf(k);let i=cur+(R?1:-1);if(i>=n)i=-1;if(i<-1)i=n-1;chooseSfx(k,i)}}
  if(ok&&!LOOK[k])previewSfx(k);if(back)closeSet();
}
$('snd').addEventListener('click',()=>{setMute(!AU.muted);$('snd').blur();if(!AU.muted)SFX.ui(3)});setMute(AU.muted);
$('pz').addEventListener('click',()=>{pause();$('pz').blur()});
