// On-screen controls card, keyboard input and touch controls.
// on-screen controls
const touchUI=matchMedia('(pointer:coarse)').matches;
let ctlHidden=touchUI;try{const v=localStorage.getItem('orbRunCtlHidden');if(v)ctlHidden=v==='1'}catch(e){}
function renderControls(){
  const k=(...a)=>a.map(x=>`<kbd>${x}</kbd>`).join(' ');
  const b=x=>`<span class="ps">${x}</span>`;
  if(pad.connected){const rows=[['L-stick / D-pad','Move'],[b('\u2715'),'Jump (hold for full height)'],[b('\u25a1'),'Attack (tap \u00d73 for a combo)'],['In the air: '+b('\u25a1'),'Flying kick'],[b('Options'),'Pause'],[b('Create'),'Sound on/off'],[b('Touchpad'),'Hide this panel']];
    if(chars[ci].acro)rows.splice(2,0,[b('\u25cb')+' / '+b('R2'),'Crouch (move to crouch-walk)'],['Crouch + '+b('\u25a1'),'Sweep kick'],['Run + crouch + '+b('\u2715'),'Long jump'],['Run into a tree','Climb it ('+b('\u2715')+' at the top: tree-top flip)'],['Still + crouch + '+b('\u2715'),'Backflip'],
      ['Crouch in the air','Dive'],[b('\u2715')+' as you land \u00d73','Triple jump'],['Reverse at speed, '+b('\u2715'),'Side flip'],[b('\u2715')+' off a wall mid-air','Wall jump']);
    if(mode==='run')rows.splice(3,0,[b('R1'),'Throw a snowball']);
    if(mode==='run'&&runFree)rows.unshift([b('\u25b3')+' or START pad','Start timed run']);
    $('ctlList').innerHTML=rows.map(([a,c])=>`<dt>${a}</dt><dd>${c}</dd>`).join('');return}
  const rows=touchUI?[['Joystick','Move'],['Jump','Jump'],['Hit','Attack (tap \u00d73 for a combo)'],['II','Pause']]:[[k('WASD')+' / '+k('Arrows'),'Move'],[k('Space'),'Jump'],[k('J'),'Attack (tap \u00d73 for a combo)'],['In the air: '+k('J'),'Flying kick'],[k('P'),'Pause'],[k('M'),'Sound on/off'],[k('H'),'Hide this panel']];
  if(chars[ci].acro)rows.splice(2,0,
    [touchUI?'Duck':k('Shift'),'Crouch (move to crouch-walk)'],[touchUI?'Duck + Hit':'Crouch + '+k('J'),'Sweep kick'],
    ['Run + crouch + Jump','Long jump'],['Still + crouch + Jump','Backflip'],['Run into a tree','Climb it (Jump at the top: tree-top flip)'],
    ['Crouch in the air','Dive'],['Jump as you land \u00d73','Triple jump'],
    ['Reverse at speed, Jump','Side flip'],['Jump off a wall mid-air','Wall jump']);
  if(mode==='run')rows.splice(3,0,[touchUI?'Snow':k('F'),'Throw a snowball']);
  if(mode==='run'&&runFree)rows.unshift([touchUI?'Start or START pad':k('Enter')+' or START pad','Start timed run']);
  $('ctlList').innerHTML=rows.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('');
}
function setCtl(h){ctlHidden=h;document.body.classList.toggle('ctlHidden',h);try{localStorage.setItem('orbRunCtlHidden',h?'1':'0')}catch(e){}}
$('ctlHide').addEventListener('click',()=>setCtl(true));$('ctlShow').addEventListener('click',()=>setCtl(false));
setCtl(ctlHidden);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
addEventListener('keydown',e=>{keys[e.code]=true;
  if(setOpen){if(e.code==='Escape')closeSet();return}if(e.code==='Space'&&!e.repeat)jumpBuf=.15;if((e.code==='KeyJ'||e.code==='KeyK')&&!e.repeat)attackPress();if(e.code==='KeyF'&&!e.repeat)throwSnow();if((e.code==='Enter'||e.code==='NumpadEnter')&&!e.repeat&&state==='play')beginTimed();
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&state==='play')e.preventDefault();
  if(state==='select'){if(e.code==='ArrowLeft'||e.code==='KeyA')cycle(-1);if(e.code==='ArrowRight'||e.code==='KeyD')cycle(1);
    if(e.code==='ArrowUp'||e.code==='KeyW'){e.preventDefault();cycleOutfit(-1)}if(e.code==='ArrowDown'||e.code==='KeyS'){e.preventDefault();cycleOutfit(1)}
    if(e.code==='Escape'){$('cs').classList.add('hide');menu()}return}
  if(e.code==='Escape'||e.code==='KeyP'){if(state==='play')pause();else if(state==='paused')resume()}
  if(e.code==='KeyM'&&!e.repeat){setMute(!AU.muted);toast(AU.muted?'Sound off':'Sound on');if(!AU.muted)SFX.ui(3)}
  if(e.code==='KeyH'&&(state==='play'||state==='paused'))setCtl(!ctlHidden)});
addEventListener('keyup',e=>keys[e.code]=false);
addEventListener('blur',()=>{for(const k in keys)keys[k]=false});
const J=$('joy'),K=$('knob');let jid=null;
J.addEventListener('pointerdown',e=>{jid=e.pointerId;J.setPointerCapture(jid);moveJoy(e)});
J.addEventListener('pointermove',e=>{if(e.pointerId===jid)moveJoy(e)});
const endJoy=()=>{jid=null;joy.x=joy.z=0;K.style.transform=''};
J.addEventListener('pointerup',endJoy);J.addEventListener('pointercancel',endJoy);
function moveJoy(e){const r=J.getBoundingClientRect();let dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;
  const m=Math.hypot(dx,dy),max=r.width/2-20;if(m>max){dx*=max/m;dy*=max/m}K.style.transform=`translate(${dx}px,${dy}px)`;joy.x=dx/max;joy.z=dy/max}
$('sb').addEventListener('click',()=>{$('sb').blur();beginTimed()});
$('snowBtn').addEventListener('pointerdown',e=>{e.preventDefault();throwSnow()});
$('hb').addEventListener('pointerdown',e=>{e.preventDefault();attackPress()});
$('jb').addEventListener('pointerdown',e=>{e.preventDefault();jumpBuf=.15;keys.Space=true});
['pointerup','pointercancel','pointerleave'].forEach(t=>{$('jb').addEventListener(t,()=>keys.Space=false);$('cb').addEventListener(t,()=>joy.crouch=false)});
$('cb').addEventListener('pointerdown',e=>{e.preventDefault();joy.crouch=true});
