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
    ['In the air: '+L('pound'),'Ground pound'],['Standing: tap / hold '+L('pound'),'Taunt / emote wheel'],...(camTurns()&&!T_?[[(pad.connected?'Right stick':L('camL')+' / '+L('camR')),'Turn the camera'+(CAM.mode==='behind'?'':' (stick up/down tilts)')],[L('camC'),'Camera behind you']]:[]),['On a slope: hold '+L('crouch'),'Butt slide (Jump to hop off)'],...(WIN?[[(chars[ci].name==='Nova'?'Standing: ':'Crouch + ')+L('pound'),'Snow angel']]:[]),...(YS.on&&WIN&&chars[ci].name!=='Nova'?[['Standing: hold '+L('pound'),'Yellow snow (walk to aim)']]:[]),...(mode==='run'?[['Walk into a small snowball','Roll it bigger']]:[]),[L('pause'),'Pause']];
  if(!T_)rows.push([P?b('Create'):k('M'),'Sound on/off'],[P?b('Touchpad'):k('H'),'Hide this panel']);
  if(chars[ci].acro)rows.splice(2,0,[L('crouch'),'Crouch (move to crouch-walk)'],['Crouch + '+L('attack'),'Sweep kick'],
    ['Run + crouch + Jump','Long jump'],['Still + crouch + Jump','Backflip'],['Run into a tree or pole','Climb it (Jump at the top: flip)'],
    ['Crouch in the air','Dive'],['Jump as you land \u00d73','Triple jump'],['Reverse at speed, Jump','Side flip'],['Jump off a wall mid-air','Wall jump']);
  else rows.splice(2,0,['Run into a tree or pole','Climb it']);
  if(mode==='run')rows.splice(3,0,[L('throw'),'Throw a snowball']);
  if(mode==='run'&&runFree)rows.unshift([L('start')+(padOn()?' or PLAY pad':''),'Choose a mode: Collectathon, Snowball Wars or Tag']);
  if(!T_)rows.push(['Hold '+L('respawn'),'Respawn (spawn point / checkpoint)'],['Hold '+L('start'),'Restart the Collectathon, match, race or level'],['Settings (gear)','Change any button']);
  $('ctlList').innerHTML=rows.map(([x,y])=>`<dt>${x}</dt><dd>${y}</dd>`).join('');
}
// The Moves screen: the same moves, grouped into pages of cards (name, buttons on this device, a one-line tip).
function moveGroups(){
  const k=x=>`<kbd>${x}</kbd>`,b=x=>`<span class="ps">${x}</span>`,P=pad.connected,T_=touchUI&&!P;
  const L=id=>{if(T_)return{jump:'Jump',attack:'Hit',crouch:'Duck',throw:'Snow',pound:'Pound',start:'Start',pause:'II',respawn:'',camL:'',camR:'',camC:''}[id]||'';
    const l=P?(BIND.pad[id]||[]):BIND.kb[id]||[];return l.length?l.map(c=>P?b(padName(c)):k(keyName(c))).join(' / '):'<i>unbound</i>'};
  const mv=T_?'Joystick':P?b('L-stick'):(()=>{const ks=['up','left','down','right'].map(id=>BIND.kb[id][0]),n=ks.map(c=>c?keyName(c):'?');return n.every(x=>x.length===1)?k(n.join('')):n.map(k).join(' ')})();
  const J=L('jump'),C=L('crouch'),A_=L('attack'),acro=!!chars[ci].acro,run=mode==='run',plus=' + ';
  const G=[
    {name:'Basics',items:[['Move',mv,'Full speed takes a moment; tap to turn on the spot.'],['Jump',J,'Hold for full height, tap for a hop.'],
      ...(acro?[['Crouch',C,'Move while crouched to crouch-walk.']]:[]),
      ['Climb',acro?'Run or dive into a tree or pole':'Run into a tree or pole',acro?'Jump at the top to flip off it.':'Jump to leap off.'],
      ...(acro?[['Butt slide','On a slope: hold '+C,'Steer with the stick; Jump to hop off.']]:[])]},
    ...(acro?[{name:'Big Jumps',items:[['Triple jump',J+' as you land \u00d73','Keep running; each jump goes higher.'],['Long jump','Run'+plus+C+plus+J,'Low and far: clears the widest gaps.'],
      ['Backflip','Stand still'+plus+C+plus+J,'The highest single jump.'],['Side flip','Run, reverse'+plus+J,'Turn hard against your run, then jump.'],
      ['Wall jump',J+' off a wall','Bounce between two walls to climb.'],['Ledge grab','Fall past a ledge facing it','Push toward it to climb up, '+J+' to hop, sideways to shimmy.']]}]:[]),
    {name:'In the Air',items:[...(acro?[['Dive',C+' in the air','Stretches a jump; dive into a pole to grab it.']]:[]),['Flying kick','In the air: '+A_,'Knocks over anything you fly into.'],
      ['Ground pound','In the air: '+L('pound'),'Smashes down and knocks things around you.'],['Pound jump',J+' as you land a pound','Shoots you straight up, very high.']]},
    {name:'Snowballs & Fighting',items:[['Attack',A_,'Tap \u00d73 for a combo.'],...(acro?[['Sweep kick',C+plus+A_,'Spins round and hits all around you.']]:[]),
      ...(run?[['Throw a snowball',L('throw'),'Aims where you face (or push the stick). Hit snowmen to get snowballs back.']]:[]),
      ...(WIN?[['Snow angel','Crouch'+plus+L('pound')+' or the emote wheel','Lie in the snow and flap.']]:[]),
      ...(run?[['Giant snowball','Walk into a small snowball','It grows as you roll it; bowl people over.']]:[])]},
    {name:'Emotes',items:[['Quick taunt','Standing: tap '+L('pound'),'Does your last emote from the wheel (Wave to start).'],['Emote wheel','Standing: hold '+L('pound'),'A ring fills, then the wheel opens. Point at an emote and let go.'],
      ['Dances','Robot, Shuffle, Disco, Chicken Dance','They loop until you move. Friends see them too.'],['Wave & Cheer','On the wheel','Say hi, or celebrate.']]},
    {name:'Game',items:[...(run&&runFree?[['Choose a mode',L('start')+(padOn()?' or the PLAY pad':' (or pause → Play)'),'Collectathon, Snowball Wars or Tag.']]:[]),
      ...(T_?[]:[['Respawn','Hold '+L('respawn'),'Back to the spawn point or your checkpoint.'],['Restart','Hold '+L('start'),'Restart the run, match, race or level.']]),
      ...(camTurns()&&!T_?[['Turn the camera',P?b('R-stick'):L('camL')+' '+L('camR'),'Up and down tilt it. '+L('camC')+' snaps it behind you.']]:[]),
      ['Pause',L('pause'),'Games, Moves and Settings live here.'],...(T_?[]:[['Sound',P?b('Create'):k('M'),'Turns the sound on or off.']]),['Change buttons','Settings \u2192 Controls','Rebind anything.']]}];
  return G.filter(g=>g.items.length)}
function setCtl(h){ctlHidden=h;document.body.classList.toggle('ctlHidden',h);try{localStorage.setItem('orbRunCtlHidden',h?'1':'0')}catch(e){}}
$('ctlHide').addEventListener('click',()=>setCtl(true));$('ctlShow').addEventListener('click',()=>setCtl(false));
setCtl(ctlHidden);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
// On a Mac, keys pressed while Cmd is held never send a key-up (Cmd+C, Cmd+Shift+4...), so they'd stay "held" forever:
// ignore them, and let go of everything when Cmd is released or the page loses focus.
const releaseAll=()=>{for(const k in keys)keys[k]=false};
addEventListener('keydown',e=>{if(e.target&&e.target.id==='myName'){if(e.code==='Enter'||e.code==='NumpadEnter'||e.code==='Escape'){e.preventDefault();$('csGo').focus()}return}if(capKey(e))return;if(movesOpen){if(e.code==='Escape'||e.code==='Backspace'){e.preventDefault();closeMoves();return}if(e.code==='ArrowLeft'||e.code==='ArrowRight'){e.preventDefault();moveCat(e.code==='ArrowLeft'?-1:1);return}}if(e.metaKey){if(e.key!=='Meta')return}else keys[e.code]=true;
  if(setOpen){if(e.code==='Escape')closeSet();return}
  if(state==='paused'&&CUST.on){if(!e.target.closest||!e.target.closest('input'))custKey(e.code);if(e.code.startsWith('Arrow'))e.preventDefault();return}   // editing from the pause menu
  if(state==='play'&&emoteKey(e.code)){e.preventDefault();return}
  const acts=actsOfKey(e.code==='NumpadEnter'?'Enter':e.code);
  if(!e.repeat)for(const id of acts)if(state==='play'||(id==='pause'&&state==='paused'))press(id);
  if((acts.length||['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))&&state==='play')e.preventDefault();
  if(state==='menu'&&PARK.on&&!setOpen){if(parkKey(e.code))e.preventDefault();return}
  if(state==='select'&&CUST.on){if(!e.target.closest||!e.target.closest('input'))custKey(e.code);if(e.code.startsWith('Arrow'))e.preventDefault();return}
  if(state==='select'){if(e.code==='ArrowLeft'||e.code==='KeyA')cycle(-1);if(e.code==='ArrowRight'||e.code==='KeyD')cycle(1);
    if(e.code==='ArrowUp'||e.code==='KeyW'){e.preventDefault();cycleOutfit(-1)}if(e.code==='ArrowDown'||e.code==='KeyS'){e.preventDefault();cycleOutfit(1)}
    if(e.code==='Escape'){$('cs').classList.add('hide');menu()}return}
  if(e.code==='Escape'&&!acts.includes('pause')){if(state==='play')pause();else if(state==='paused')resume()}
  if(e.code==='KeyM'&&!e.repeat){setMute(!AU.muted);toast(AU.muted?'Sound off':'Sound on');if(!AU.muted)SFX.ui(3)}
  if(e.code==='KeyH'&&(state==='play'||state==='paused'))setCtl(!ctlHidden)});
addEventListener('keyup',e=>{keys[e.code]=false;if(e.key==='Meta'||e.code==='MetaLeft'||e.code==='MetaRight')releaseAll()});
addEventListener('blur',releaseAll);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAll()});
const J=$('joy'),K=$('knob');let jid=null;
J.addEventListener('pointerdown',e=>{jid=e.pointerId;J.setPointerCapture(jid);moveJoy(e)});
J.addEventListener('pointermove',e=>{if(e.pointerId===jid)moveJoy(e)});
const endJoy=()=>{jid=null;joy.x=joy.z=0;K.style.transform=''};
J.addEventListener('pointerup',endJoy);J.addEventListener('pointercancel',endJoy);
function moveJoy(e){const r=J.getBoundingClientRect();let dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;
  const m=Math.hypot(dx,dy),max=r.width/2-20;if(m>max){dx*=max/m;dy*=max/m}K.style.transform=`translate(${dx}px,${dy}px)`;joy.x=dx/max;joy.z=dy/max}
$('sb').addEventListener('click',()=>{$('sb').blur();beginTimed()});
$('snowBtn').addEventListener('pointerdown',e=>{e.preventDefault();joy.snow=true;aimStart()});
['pointerup','pointercancel','pointerleave'].forEach(t=>$('snowBtn').addEventListener(t,()=>joy.snow=false));
$('hb').addEventListener('pointerdown',e=>{e.preventDefault();attackPress()});
$('jb').addEventListener('pointerdown',e=>{e.preventDefault();jumpBuf=.15;joy.jump=true});
$('pb').addEventListener('pointerdown',e=>{e.preventDefault();joy.pound=true;poundOrSnow()});
['pointerup','pointercancel','pointerleave'].forEach(t=>$('pb').addEventListener(t,()=>joy.pound=false));
['pointerup','pointercancel','pointerleave'].forEach(t=>{$('jb').addEventListener(t,()=>joy.jump=false);$('cb').addEventListener(t,()=>joy.crouch=false)});
$('cb').addEventListener('pointerdown',e=>{e.preventDefault();joy.crouch=true});
