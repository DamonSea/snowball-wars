// On-screen controls card, keyboard input and touch controls.
// on-screen controls
const touchUI=matchMedia('(pointer:coarse)').matches;
let ctlHidden=touchUI;try{const v=localStorage.getItem('orbRunCtlHidden');if(v)ctlHidden=v==='1'}catch(e){}
function renderControls(){
  const k=x=>`<kbd>${x}</kbd>`,b=x=>`<span class="ps">${x}</span>`,P=pad.connected,T_=touchUI&&!P;
  // the buttons bound to an action, as shown on this device
  const L=id=>{if(T_)return{jump:'Jump',attack:'Hit',crouch:'Duck',throw:'Snow',pound:'Pound',start:'Start',pause:'II'}[id];
    const l=P?(BIND.pad[id]||[]):BIND.kb[id];return l.length?l.map(c=>P?b(padName(c)):k(keyName(c))).join(' / '):'<i>unbound</i>'};
  const mv=T_?'Joystick':P?'L-stick / D-pad':(()=>{const ks=['up','left','down','right'].map(id=>BIND.kb[id][0]);
    const n=ks.map(c=>c?keyName(c):'?');return(n.every(x=>x.length===1)?k(n.join('')):n.map(k).join(' '))+' / '+k('Arrows')})();
  const rows=[[mv,'Move'],[L('jump'),'Jump (hold for full height)'],[L('attack'),'Attack (tap \u00d73 for a combo)'],['In the air: '+L('attack'),'Flying kick'],
    ['In the air: '+L('pound'),'Ground pound'],...(YS.on&&WIN?[['Standing: '+L('pound'),'Make yellow snow']]:[]),[L('pause'),'Pause']];
  if(!T_)rows.push([P?b('Create'):k('M'),'Sound on/off'],[P?b('Touchpad'):k('H'),'Hide this panel']);
  if(chars[ci].acro)rows.splice(2,0,[L('crouch'),'Crouch (move to crouch-walk)'],['Crouch + '+L('attack'),'Sweep kick'],
    ['Run + crouch + Jump','Long jump'],['Still + crouch + Jump','Backflip'],['Run into a tree or pole','Climb it (Jump at the top: flip)'],
    ['Crouch in the air','Dive'],['Jump as you land \u00d73','Triple jump'],['Reverse at speed, Jump','Side flip'],['Jump off a wall mid-air','Wall jump']);
  else rows.splice(2,0,['Run into a tree or pole','Climb it']);
  if(mode==='run')rows.splice(3,0,[L('throw'),'Throw a snowball']);
  if(mode==='run'&&runFree)rows.unshift([L('start')+' or START pad','Start timed run']);
  if(!T_)rows.push(['Settings (gear)','Change any button']);
  $('ctlList').innerHTML=rows.map(([x,y])=>`<dt>${x}</dt><dd>${y}</dd>`).join('');
}
function setCtl(h){ctlHidden=h;document.body.classList.toggle('ctlHidden',h);try{localStorage.setItem('orbRunCtlHidden',h?'1':'0')}catch(e){}}
$('ctlHide').addEventListener('click',()=>setCtl(true));$('ctlShow').addEventListener('click',()=>setCtl(false));
setCtl(ctlHidden);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
addEventListener('keydown',e=>{if(capKey(e))return;keys[e.code]=true;
  if(setOpen){if(e.code==='Escape')closeSet();return}
  const acts=actsOfKey(e.code==='NumpadEnter'?'Enter':e.code);
  if(!e.repeat)for(const id of acts)if(state==='play'||(id==='pause'&&state==='paused'))press(id);
  if((acts.length||['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))&&state==='play')e.preventDefault();
  if(state==='select'){if(e.code==='ArrowLeft'||e.code==='KeyA')cycle(-1);if(e.code==='ArrowRight'||e.code==='KeyD')cycle(1);
    if(e.code==='ArrowUp'||e.code==='KeyW'){e.preventDefault();cycleOutfit(-1)}if(e.code==='ArrowDown'||e.code==='KeyS'){e.preventDefault();cycleOutfit(1)}
    if(e.code==='Escape'){$('cs').classList.add('hide');menu()}return}
  if(e.code==='Escape'&&!acts.includes('pause')){if(state==='play')pause();else if(state==='paused')resume()}
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
$('jb').addEventListener('pointerdown',e=>{e.preventDefault();jumpBuf=.15;joy.jump=true});
$('pb').addEventListener('pointerdown',e=>{e.preventDefault();poundOrSnow()});
['pointerup','pointercancel','pointerleave'].forEach(t=>{$('jb').addEventListener(t,()=>joy.jump=false);$('cb').addEventListener(t,()=>joy.crouch=false)});
$('cb').addEventListener('pointerdown',e=>{e.preventDefault();joy.crouch=true});
