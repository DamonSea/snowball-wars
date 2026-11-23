// Custom controls: which keys, mouse buttons and controller buttons do each action (Settings → Controls).
// Every action has up to two keyboard/mouse slots and two controller slots, saved in localStorage.
// Arrow keys always move, Esc always pauses, M (sound) and H (controls panel) are fixed, and menus keep
// ✕ to select and ○ to go back on a controller.
const ACT=[
  {id:'up',label:'Move forward',kb:['KeyW']},{id:'down',label:'Move back',kb:['KeyS']},
  {id:'left',label:'Move left',kb:['KeyA']},{id:'right',label:'Move right',kb:['KeyD']},
  {id:'jump',label:'Jump',kb:['Space'],pad:[0]},
  {id:'attack',label:'Attack',kb:['KeyJ','KeyK'],pad:[2]},
  {id:'crouch',label:'Crouch / dive',kb:['ShiftLeft','KeyC'],pad:[1,7]},
  {id:'pound',label:'Ground pound / emotes',kb:['KeyQ','Mouse2'],pad:[4]},
  {id:'throw',label:'Throw snowball',kb:['KeyF','Mouse0'],pad:[5]},
  {id:'start',label:'Start timed run',kb:['Enter'],pad:[3]},
  {id:'pause',label:'Pause',kb:['KeyP'],pad:[9]},
  {id:'respawn',label:'Respawn (hold)',kb:['KeyR'],pad:[10]},
  {id:'camL',label:'Turn camera left',kb:['KeyZ']},{id:'camR',label:'Turn camera right',kb:['KeyX']},
  {id:'camC',label:'Camera behind you',kb:['KeyV'],pad:[11]},
];
const PADN=['✕','○','□','△','L1','R1','L2','R2','Create','Options','L3','R3'];
const KB_RESERVED=['Escape','KeyM','KeyH','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','MetaLeft','MetaRight'];
function defBinds(){const b={kb:{},pad:{}};ACT.forEach(a=>{b.kb[a.id]=[...a.kb];if(a.pad)b.pad[a.id]=[...a.pad]});return b}
let BIND=defBinds();
try{const s=JSON.parse(localStorage.getItem('orbRunBinds')||'null');if(s&&s.kb&&s.pad)for(const a of ACT){
  if(Array.isArray(s.kb[a.id]))BIND.kb[a.id]=s.kb[a.id].filter(x=>typeof x==='string'&&!KB_RESERVED.includes(x)).slice(0,2);
  if(a.pad&&Array.isArray(s.pad[a.id]))BIND.pad[a.id]=s.pad[a.id].filter(i=>Number.isInteger(i)&&i>=0&&i<PADN.length).slice(0,2)}}catch(e){}
function saveBinds(){try{localStorage.setItem('orbRunBinds',JSON.stringify(BIND))}catch(e){}}
let padNow=[];
const kbHeld=id=>BIND.kb[id].some(c=>keys[c]);
const held=id=>kbHeld(id)||(BIND.pad[id]||[]).some(i=>padNow[i]);
const kbAxisX=()=>(kbHeld('right')||keys.ArrowRight?1:0)-(kbHeld('left')||keys.ArrowLeft?1:0);
const kbAxisZ=()=>(kbHeld('down')||keys.ArrowDown?1:0)-(kbHeld('up')||keys.ArrowUp?1:0);
const actsOfKey=c=>ACT.filter(a=>BIND.kb[a.id].includes(c)).map(a=>a.id);
function press(id){
  if(emotePress(id))return;
  if(id==='jump')jumpBuf=.15;else if(id==='attack')attackPress();else if(id==='throw')aimStart();else if(id==='pound')poundOrSnow();
  else if(id==='start'){if(state==='play'&&mode==='run'&&runFree&&!WAR.on&&!(FR.on&&!runL.spad))modeMenu()}   // holding it restarts instead (qol.js)
  else if(id==='pause'){if(state==='play')pause();else if(state==='paused')backOrResume()}}
// on a sub-menu (Games), Esc / Options / ○ goes back to the pause menu; otherwise it closes it
function backOrResume(){const bk=['go','alt','alt2','alt3','alt4','alt5','alt6','alt7'].map($).find(e=>e&&e.textContent==='Back');if(bk)bk.click();else resume()}
function keyName(c){const m={Space:'Space',ShiftLeft:'L Shift',ShiftRight:'R Shift',ControlLeft:'L Ctrl',ControlRight:'R Ctrl',AltLeft:'L Alt',AltRight:'R Alt',
  Enter:'Enter',NumpadEnter:'Enter',Backspace:'Backspace',CapsLock:'Caps Lock',Backquote:'`',Minus:'-',Equal:'=',BracketLeft:'[',BracketRight:']',
  Semicolon:';',Quote:"'",Comma:',',Period:'.',Slash:'/',Backslash:'\\',Mouse0:'Left click',Mouse1:'Middle click',Mouse2:'Right click',Mouse3:'Mouse 4',Mouse4:'Mouse 5'};
  return m[c]||c.replace(/^Key/,'').replace(/^Digit/,'').replace(/^Numpad/,'Num ')}
const padName=i=>PADN[i]||('Button '+i);
// ----- rebinding: click a slot (or ✕ on it with a controller), then press the new key / button -----
let CAP=null,swallowClick=false; // CAP: {id,dev:'kb'|'pad',slot}
function startCap(id,dev,slot){CAP={id,dev,slot};renderSet()}
function cancelCap(){CAP=null;renderSet()}
function assignBind(code){const{id,dev,slot}=CAP;CAP=null;const map=BIND[dev];let from='';
  for(const a of ACT){const l=map[a.id];if(!l||a.id===id)continue;const i=l.indexOf(code);if(i>=0){l.splice(i,1);from=a.label}}
  const l=map[id].filter(x=>x!==code);if(slot<l.length)l[slot]=code;else l.push(code);map[id]=l.slice(0,2);
  saveBinds();renderControls();renderSet();SFX.ui(3);
  if(from)toast(`${dev==='kb'?keyName(code):padName(code)} moved from ${from} to ${ACT.find(a=>a.id===id).label}`)}
function clearBind(){const{id,dev,slot}=CAP;CAP=null;BIND[dev][id].splice(slot,1);saveBinds();renderControls();renderSet();SFX.ui(2)}
function resetBinds(){BIND=defBinds();CAP=null;saveBinds();renderControls();renderSet();SFX.ui(2);toast('Controls reset to defaults')}
// keyboard: returns true when the key was used for rebinding
function capKey(e){if(!CAP)return false;e.preventDefault();e.stopPropagation();
  if(e.code==='Escape')cancelCap();else if(CAP.dev==='pad'){}
  else if(e.code==='Backspace'||e.code==='Delete')clearBind();
  else if(KB_RESERVED.includes(e.code))toast(`${keyName(e.code).replace('Arrow','')} is reserved`);else assignBind(e.code);
  return true}
// mouse: catches the next click while rebinding, otherwise mouse buttons act during play
addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;const c='Mouse'+e.button;
  if(CAP&&CAP.dev==='kb'){e.preventDefault();e.stopPropagation();swallowClick=true;assignBind(c);return}
  if(state!=='play'||(e.target.closest&&e.target.closest('button,input,a,label,#set,#ov,#ctl,#cs,#touch')))return;
  keys[c]=true;for(const id of actsOfKey(c))press(id)},true);
addEventListener('pointerup',e=>{if(e.pointerType==='mouse')keys['Mouse'+e.button]=false},true);
addEventListener('click',e=>{if(swallowClick){swallowClick=false;e.preventDefault();e.stopPropagation()}},true);
addEventListener('contextmenu',e=>{if(state==='play'||CAP)e.preventDefault()});
addEventListener('auxclick',e=>{if(state==='play')e.preventDefault()});
// controller: called from pollPad with the "just pressed" test; returns true when it used the press
function capPad(pr){if(!CAP||CAP.dev!=='pad')return false;
  for(let i=0;i<PADN.length;i++)if(pr(i)){if(i===8){toast('Create is reserved for sound');return true}assignBind(i);return true}
  return true}
// settings rows
function bindRowsHTML(start,fr){let ri=start;const slotBtn=(a,dev,s)=>{const l=BIND[dev][a.id]||[],c=l[s],cap=CAP&&CAP.id===a.id&&CAP.dev===dev&&CAP.slot===s;
    const txt=cap?(dev==='kb'?'Press key or click':'Press a button'):c===undefined?'—':dev==='kb'?keyName(c):padName(c);
    return `<button class="opt bind${cap?' cap':''}${c===undefined&&!cap?' none':''}" data-bind="${a.id}" data-dev="${dev}" data-slot="${s}" aria-label="${a.label}, ${dev==='kb'?'keyboard or mouse':'controller'} slot ${s+1}: ${txt}">${txt}</button>`};
  const row=(a,dev)=>`<div class="srow${fr(ri)}" data-row="${ri++}"><span class="sl">${a.label}</span><div class="seg">${slotBtn(a,dev,0)}${slotBtn(a,dev,1)}</div><span></span></div>`;
  return '<h2 class="sh">Controls: keyboard &amp; mouse</h2><p class="bindHelp">Click a slot, then press a key or mouse button. Backspace clears it, Esc cancels.</p>'
    +ACT.map(a=>row(a,'kb')).join('')
    +'<h2 class="sh">Controls: controller</h2><p class="bindHelp">Select a slot, then press a controller button. Menus always use ✕ and ○.</p>'
    +ACT.filter(a=>a.pad).map(a=>row(a,'pad')).join('')
    +'<div class="srow"><span></span><button class="opt" id="bindReset">Reset controls</button><span></span></div>'}
const BIND_ROWS=[...ACT.map(a=>'k:'+a.id),...ACT.filter(a=>a.pad).map(a=>'p:'+a.id)];
