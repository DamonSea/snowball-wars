// Gamepad support (PS5 DualSense and standard controllers): polling, button remapping, menu navigation, rumble, toasts.
// ---------- gamepad (PS5 DualSense / any standard-mapping controller) ----------
const pad={x:0,z:0,jump:false,crouch:false,connected:false,gp:null};let padPrev=[],padStickPrev='',toastT=null;
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove('on'),2600)}
function rumble(ms,strong,weak){try{const v=pad.gp&&pad.gp.vibrationActuator;if(v&&v.playEffect)v.playEffect('dual-rumble',{duration:ms,strongMagnitude:strong,weakMagnitude:weak}).catch(()=>{})}catch(e){}}
// Controller navigation for scrolling panels (Customize, More maps): the D-pad moves to the nearest control in that
// direction, the panel scrolls to keep it in view, ✕ presses it, and on a slider ←→ change its value.
function padFocus(e){document.body.classList.add('padnav');try{e.focus({preventScroll:true})}catch(_){e.focus()}e.scrollIntoView({block:'nearest',inline:'nearest'})}
function panelNav(root,L,R,U,D,ok){
  const els=[...root.querySelectorAll('button,input,select')].filter(e=>!e.disabled&&e.type!=='file'&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');
  if(!els.length)return;const cur=document.activeElement,inside=els.includes(cur);
  if(!inside){if(L||R||U||D||ok)padFocus(els[0]);return}
  if(cur.type==='range'&&(L||R)){const st=+cur.step||1;cur.value=+cur.value+(R?st:-st);cur.dispatchEvent(new Event('input',{bubbles:true}));cur.dispatchEvent(new Event('change',{bubbles:true}));return}
  if(L||R||U||D){const a=cur.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2;let best=null,bs=Infinity;
    for(const e of els){if(e===cur)continue;const b=e.getBoundingClientRect(),dx=b.left+b.width/2-ax,dy=b.top+b.height/2-ay;
      const p=L?-dx:R?dx:U?-dy:dy,s=L||R?Math.abs(dy):Math.abs(dx);if(p<=2)continue;
      if((L||R)&&s>Math.max(a.height,b.height)*.8)continue;          // left/right stay on the same row
      const sc=p+s*(U||D?1.6:3);if(sc<bs){bs=sc;best=e}}
    if(best)padFocus(best);return}
  if(ok)cur.click()}
function padChanged(){document.body.classList.toggle('haspad',pad.connected);renderControls();toast(pad.connected?'Controller connected \u00b7 \u2715 select \u00b7 \u25cb back':'Controller disconnected')}
function updatePadInfo(){let t;if(!pad.connected)t='Controller: none detected. Press a button on it; if this stays, open the game on its own page.';
  else{const g=pad.gp,n=(g.id.replace(/\(.*?\)/g,'').trim()||'Gamepad').slice(0,32);t=`Controller: ${n} \u00b7 ${g.mapping==='standard'?'standard':SONY.test(g.id)?'PlayStation layout':'non-standard'} \u00b7 last button ${padLast||'none'}`}
  if(t!==padInfoTxt){padInfoTxt=t;$('padInfo').textContent=t}}
// Sony pads without the browser's "standard" mapping (common in Firefox) use DirectInput order:
// 0 Square, 1 Cross, 2 Circle, 3 Triangle, 4 L1, 5 R1, 6 L2, 7 R2, 8 Create, 9 Options, 10 L3, 11 R3, 12 PS, 13 Touchpad, D-pad on a hat axis.
const SONY=/054c|dualsense|dualshock|wireless controller|playstation|sony/i;
let padLast='',padInfoTxt='';
function readButtons(gp){
  const raw=i=>{const q=gp.buttons[i];return!!(q&&(q.pressed||q.value>.5))};
  const out=[];for(let i=0;i<18;i++)out[i]=raw(i);
  if(gp.mapping==='standard'||!SONY.test(gp.id))return out;
  const m=[1,2,0,3,4,5,6,7,8,9,10,11];m.forEach((src,dst)=>out[dst]=raw(src));
  out[16]=raw(12);out[17]=raw(13);out[12]=out[13]=out[14]=out[15]=false;
  // D-pad: either a hat axis (-1 = up, stepping clockwise by 2/7) or buttons 14-17 on some drivers
  const hv=gp.axes[9],hat=hv!==undefined&&Math.abs(hv)<=1.01?hv:undefined;
  if(hat!==undefined){const d=Math.round((hat+1)/(2/7))%8;out[12]=d===7||d<=1;out[15]=d>=1&&d<=3;out[13]=d>=3&&d<=5;out[14]=d>=5&&d<=7}
  else if(gp.buttons.length>17){out[12]=raw(14);out[13]=raw(15);out[14]=raw(16);out[15]=raw(17)}
  return out;
}
function pollPad(){
  // pick the most recently active controller, skipping idle virtual devices
  let gp=null;try{const l=navigator.getGamepads?navigator.getGamepads():[];for(const g of l)if(g&&g.connected&&g.buttons.length&&(!gp||g.timestamp>gp.timestamp))gp=g}catch(e){}
  pad.gp=gp;
  if(!gp){pad.x=pad.z=0;pad.jump=pad.crouch=false;padNow=[];if(pad.connected){pad.connected=false;padChanged()}padPrev=[];return}
  // without focus the browser may stop updating the controller and keep reporting the last buttons as held (a stuck
  // Crouch, for one), so while the game isn't focused, treat everything as let go
  if(document.hasFocus&&!document.hasFocus()){pad.x=pad.z=0;pad.jump=pad.crouch=false;padNow=[];padPrev=[];
    if(!pad.unfocused&&pad.connected&&state==='play'){pad.unfocused=true;toast('Click the game to keep using your controller.')}return}
  pad.unfocused=false;
  if(!pad.connected){pad.connected=true;padChanged()}
  const now=readButtons(gp);
  const prev=padPrev,pr=i=>now[i]&&!prev[i];
  for(let i=0;i<gp.buttons.length;i++){const q=gp.buttons[i];if(q&&q.pressed){padLast=String(i);break}}
  padPrev=now;
  // move: left stick with radial deadzone, D-pad overrides
  const sx=gp.axes[0]||0,sz=gp.axes[1]||0,m=Math.hypot(sx,sz);let x=0,z=0;
  if(m>.2){const k=Math.min(1,(m-.2)/.75)/m;x=sx*k;z=sz*k}
  if(now[14])x=-1;if(now[15])x=1;if(now[12])z=-1;if(now[13])z=1;
  pad.x=x;pad.z=z;padNow=now;pad.jump=held('jump');pad.crouch=held('crouch');
  // menu directions: D-pad or a flick of the stick
  let sd='';if(Math.abs(sx)>.6||Math.abs(sz)>.6)sd=Math.abs(sx)>Math.abs(sz)?(sx<0?'l':'r'):(sz<0?'u':'d');
  const se=sd&&sd!==padStickPrev?sd:'';padStickPrev=sd;
  if(pr(8)){setMute(!AU.muted);toast(AU.muted?'Sound off':'Sound on');if(setOpen)renderSet()}
  const L=pr(14)||se==='l',R=pr(15)||se==='r',U=pr(12)||se==='u',D=pr(13)||se==='d';
  if(capPad(pr))return;
  if(setOpen){setNav(L,R,U,D,pr(0),pr(1)||pr(9),pr(4),pr(5));return}
  if(movesOpen){movesPad(L,R,U,D,pr(1)||pr(9),pr(4),pr(5));return}
  if(PARK.on){parkPad(L,R,pr(0),pr(1),pr(3),pr(4),pr(5),U,D);return}
  if(typeof mapsOpen!=='undefined'&&mapsOpen){panelNav($('maps'),L,R,U,D,pr(0));if(pr(1)){closeMapsPanel();parkMenu()}return}
  if(state==='play'){
    for(const a of ACT)if(BIND.pad[a.id]&&BIND.pad[a.id].some(i=>pr(i))){press(a.id);if(state!=='play')break}if(pr(17))setCtl(!ctlHidden);
  }else if((state==='select'||state==='paused')&&CUST.on){custPad(L,R,U,D,pr(0),pr(1),pr(4),pr(5),gp);
  }else if(state==='select'){if(pr(3)&&chars[ci].outs){openCust();return}
    if(L)cycle(-1);if(R)cycle(1);if(U)cycleOutfit(-1);if(D)cycleOutfit(1);
    if(pr(0))confirmChar();else if(pr(1)){$('cs').classList.add('hide');menu()}
  }else if(!$('ov').classList.contains('hide')){
    const bs=['go','alt','alt2','alt3','alt4','alt5','alt6','alt7','alt8'].map($).filter(e=>e.textContent);let i=bs.indexOf(document.activeElement);
    if(L||U||R||D){document.body.classList.add('padnav');i=(L||U)?(i<=0?bs.length-1:i-1):(i+1)%bs.length;bs[i].focus()}
    if(state==='paused'&&pr(17))setCtl(!ctlHidden);
    if(pr(0))(bs[i]||bs[0]).click();
    else if(state==='paused'&&(BIND.pad.pause||[]).some(i=>pr(i)))backOrResume();
    else if(pr(1)){if(state==='paused')backOrResume();else{const bk=['alt2','alt3','alt4','alt5','alt6','alt7','alt8'].map($).find(e=>e.textContent==='Back');bk&&bk.click()}}
  }
}
addEventListener('gamepadconnected',()=>pollPad());addEventListener('gamepaddisconnected',()=>pollPad());
addEventListener('pointerdown',()=>document.body.classList.remove('padnav'));addEventListener('keydown',()=>document.body.classList.remove('padnav'));
