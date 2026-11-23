// Emotes (every character). Standing on the ground, hold Ground pound (L1 / Q / right-click) to open the emote wheel.
// Point the stick (or WASD / arrows / the mouse) at an emote and let go to do it. A quick tap leaves the wheel open:
// then pick with the stick and press Jump or Ground pound again, click or tap an emote, or press 1-8. Esc or Crouch
// closes it. Ground pound in the air is unchanged, and Crouch + Ground pound is still a quick snow angel.
// Dances loop until you move, jump, attack or throw. Friends see them: the rig pose is already sent over multiplayer.
// Yellow snow from the wheel keeps spraying (you can walk and steer) until you press Ground pound again or run dry.
const EMOTES=[
  {id:'wave',name:'Wave',ic:'👋',dur:1.6},
  {id:'cheer',name:'Cheer',ic:'🙌',dur:2.4},
  {id:'robot',name:'Robot',ic:'🤖',loop:true},
  {id:'shuffle',name:'Shuffle',ic:'🕺',loop:true},
  {id:'angel',name:'Snow Angel',ic:'❄️'},
  {id:'yellow',name:'Yellow Snow',ic:'💛'},
  {id:'disco',name:'Disco',ic:'✨',loop:true},
  {id:'chicken',name:'Chicken Dance',ic:'🐔',loop:true}];
const EM={wheel:false,sel:-1,openT:0,sticky:false,id:null,t:0,dur:0};
// why an emote can't be done right now ('' = it can)
function emoteWhy(e){
  if(e.id==='angel')return WIN?'':'Needs snow (winter)';
  if(e.id==='yellow')return!YS.on?'Off in Settings':isNova()?'Not Nova’s thing':!WIN?'Needs snow (winter)':YS.tank<.4?'Empty. Give it a minute':'';
  return''}
function canEmote(){return state==='play'&&grounded&&!CL.on&&!LH.on&&!GP.st&&SB.stun<=0&&ATK.t<=0&&A.knock<=0&&!YS.spray&&YS.t<=0&&SA.t<=0&&!BS.on}
// ---------- the wheel ----------
const ewEl=document.createElement('div');ewEl.id='emoteWheel';ewEl.className='ewheel hide';ewEl.setAttribute('role','menu');ewEl.setAttribute('aria-label','Emotes');
ewEl.innerHTML='<div class="ecenter"><b id="ewName">Emotes</b><small id="ewTip"></small></div>'+EMOTES.map((e,i)=>{const a=i/EMOTES.length*2*PI,r=118;
  return`<button class="eslot" role="menuitem" data-i="${i}" style="left:${(50+Math.sin(a)*r/3.4).toFixed(2)}%;top:${(50-Math.cos(a)*r/3.4).toFixed(2)}%"><span class="ic" aria-hidden="true">${e.ic}</span>${e.name}<span class="pk pkw" aria-hidden="true">${i+1}</span></button>`}).join('');
document.body.appendChild(ewEl);
ewEl.addEventListener('pointerover',e=>{const b=e.target.closest('.eslot');if(b&&EM.wheel){EM.sel=+b.dataset.i;renderWheel()}});
ewEl.addEventListener('click',e=>{const b=e.target.closest('.eslot');if(b&&EM.wheel)doEmote(+b.dataset.i)});
// right-click held over a slot: letting go there picks it (the release is also seen by updateEmotes)
ewEl.addEventListener('contextmenu',e=>e.preventDefault());
function renderWheel(){ewEl.querySelectorAll('.eslot').forEach((b,i)=>{b.classList.toggle('on',i===EM.sel);b.classList.toggle('off',!!emoteWhy(EMOTES[i]))});
  const e=EMOTES[EM.sel],why=e?emoteWhy(e):'';$('ewName').textContent=e?e.name:'Emotes';
  $('ewTip').textContent=why||(e?(EM.sticky?'Jump or click to do it':'Let go to do it'):(EM.sticky?'Pick one':'Point at one'))}
function openWheel(){if(!canEmote())return;stopEmote();EM.wheel=true;EM.sel=-1;EM.openT=0;EM.sticky=false;ewEl.classList.remove('hide');renderWheel();SFX.ui(1)}
function closeWheel(){if(!EM.wheel)return;EM.wheel=false;EM.sticky=false;ewEl.classList.add('hide')}
// ---------- doing one ----------
function doEmote(i){const e=EMOTES[i];closeWheel();if(!e)return;const why=emoteWhy(e);
  if(why){toast(why);SFX.deny();return}
  if(e.id==='angel'){startAngel();return}
  if(e.id==='yellow'){startYellow();if(YS.spray)YS.auto=true;return}
  if(!canEmote())return;
  EM.id=e.id;EM.t=0;EM.dur=e.loop?20:e.dur;if(e.id==='wave')wave=1.6;idleT=0;SFX.ui(5)}
function stopEmote(){EM.id=null;EM.t=0}
// a button press while the wheel is open or while dancing; true = handled here
function emotePress(id){
  if(id==='pound'&&YS.auto&&YS.spray){stopYellow();return true}
  if(EM.wheel){
    if(id==='pound'||id==='jump'){if(EM.sticky){if(EM.sel>=0)doEmote(EM.sel);else closeWheel()}return true}
    if(id==='pause'){closeWheel();return false}
    return true}
  if(EM.id&&id!=='pause')stopEmote();
  return false}
function emoteKey(c){if(!EM.wheel)return false;
  if(c==='Escape'){closeWheel();return true}
  const d=/^(Digit|Numpad)([1-8])$/.exec(c);if(d){doEmote(+d[2]-1);return true}
  if(c==='Enter'||c==='NumpadEnter'){if(EM.sel>=0)doEmote(EM.sel);return true}
  return false}
function updateEmotes(dt){
  if(EM.wheel){
    if(state!=='play'||!grounded||SB.stun>0||A.knock>0||CL.on){closeWheel();return}
    EM.openT+=dt;
    const x=kbAxisX()+joy.x+pad.x,z=kbAxisZ()+joy.z+pad.z;
    if(Math.hypot(x,z)>.5){const n=EMOTES.length,a=(Math.atan2(x,-z)+2*PI)%(2*PI),s=Math.round(a/(2*PI/n))%n;if(s!==EM.sel){EM.sel=s;SFX.ui(1)}}
    const down=held('pound')||joy.pound;
    if(EM.sticky&&(held('crouch')||joy.crouch))closeWheel();
    else if(!down&&!EM.sticky){if(EM.sel>=0)doEmote(EM.sel);else if(EM.openT<.3)EM.sticky=true;else closeWheel()}
    if(EM.wheel)renderWheel()}
  if(EM.id){EM.t+=dt;if(EM.t>=EM.dur||state!=='play'||!grounded||SB.stun>0||A.knock>0||CL.on||ATK.t>0)stopEmote()}}
// called from move(): stand still while the wheel is open or while dancing; moving or jumping ends a dance
function emoteMove(dt,ix,iz){
  if(EM.id&&!EM.wheel&&(Math.hypot(ix,iz)>.3||jumpBuf>0)){stopEmote();return false}
  const k=Math.exp(-14*dt);vel.x*=k;vel.z*=k;P.position.x+=vel.x*dt;P.position.z+=vel.z*dt;if(EM.wheel)jumpBuf=0;
  if(chars[ci].acro){A.spd=0;A.mode='normal';A.air=false}return true}
// ---------- the dances (rig characters: legs lx/lr, arms ax/ar forward-back and zl/zr out to the side,
// body pitch/roll/yaw and height yo, head hx/hy/hz, legs out to the side llz/lrz) ----------
function emotePose(o){const t=EM.t,s=Math.sin,c=Math.cos,ab=Math.abs;o.rate=18;o.lx=o.lr=0;o.llz=o.lrz=0;o.pitch=o.roll=o.yaw=0;o.hy=o.hz=0;
  switch(EM.id){
    case'wave':o.hy=.18;o.hz=-.1;o.zl=-.15;o.ax=0;o.yo=ab(s(t*6))*.03;break;
    case'cheer':{const b=ab(s(t*7));o.rate=26;o.ax=o.ar=-2.9+b*.35;o.zl=-.35-b*.25;o.zr=.35+b*.25;o.yo=b*.16;o.hx=-.35;o.lx=o.lr=-.15*b;o.pitch=-.08;break}
    case'robot':{const q=Math.floor(t*3.2),side=q%4<2?1:-1,up=q%2;o.rate=40;o.yaw=.45*side;o.hy=-.3*side;o.hx=up?.15:-.1;
      o.ax=side>0?-1.57:-.15;o.ar=side>0?-.15:-1.57;o.zl=-.12;o.zr=.12;o.yo=up?-.04:0;o.lx=up?-.2:0;break}
    case'shuffle':{const w=s(t*11),b=ab(c(t*11));o.rate=30;o.llz=-.55*Math.max(0,w);o.lrz=.55*Math.max(0,-w);o.lx=-.35*Math.max(0,-w);o.lr=-.35*Math.max(0,w);
      o.yo=b*.07;o.ax=-.7*w;o.ar=.7*w;o.zl=-.3;o.zr=.3;o.yaw=.18*w;o.hy=-.12*w;o.pitch=.05;break}
    case'disco':{const k=s(t*4.4),u=k>0;o.rate=16;o.zr=u?2.7:.3;o.ar=u?0:-.6;o.zl=u?-.3:-.9;o.ax=u?.35:0;o.roll=.12*k;o.hz=-.1*k;o.hy=.35*k;o.yaw=.12*k;
      o.yo=ab(k)*.05;o.lx=-.25*Math.max(0,k);o.lr=-.25*Math.max(0,-k);break}
    case'chicken':{const f=ab(s(t*7)),ph=t%4,sq=ph>3?s((ph-3)*PI):0,w=s(t*3.5);o.rate=30;o.zl=-.1-f*1.5;o.zr=.1+f*1.5;o.ax=o.ar=.6;
      o.pitch=.32+.08*f;o.hx=.45*s(t*7);o.yaw=.25*w;o.hy=-.2*w;o.yo=-.2*sq+.05*f;o.lx=o.lr=-.7*sq;o.llz=-.3*sq;o.lrz=.3*sq;break}}
  return o}
