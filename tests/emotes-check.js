(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x?' -> '+x:''));const kd=c=>{keys[c]=true;press(actsOfKey(c)[0]||'')},ku=c=>{keys[c]=false};
const calm=()=>runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});const _st=__step;__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const fresh=()=>{__k({});closeWheel();stopEmote();if(YS.spray)stopYellow();YS.t=0;SA.t=0;__place(-6,18,0,0);__step(3)};
const kdQ=()=>{keys.KeyQ=true;press('pound')};
// hold + point + release
fresh();kdQ();__step(3);ok('Holding Q on the ground opens the wheel',EM.wheel&&!$('emoteWheel').classList.contains('hide'));
ok('Holding does not start yellow snow any more',!YS.spray);
ok('Wheel has 8 emotes incl. 4 dances',EMOTES.length===8&&['robot','shuffle','disco','chicken'].every(id=>EMOTES.some(e=>e.id===id)));
keys.KeyD=true;__step(3);ok('Pointing right picks Robot',EMOTES[EM.sel].id==='robot',EMOTES[EM.sel]&&EMOTES[EM.sel].name);
ok('Standing still while the wheel is open',Math.hypot(vel.x,vel.z)<.2);
keys.KeyD=false;__step(2);ok('Letting the stick go keeps the pick',EMOTES[EM.sel].id==='robot');
keys.KeyQ=false;__step(2);ok('Letting go of Q does the Robot',EM.id==='robot'&&!EM.wheel);
const H=chars[ci].rig,y0=H.hp.rotation.y;__step(20);const p1=[H.armL.rotation.x,H.armR.rotation.x,H.hp.rotation.y].map(v=>v.toFixed(2)).join(',');__step(20);const p2=[H.armL.rotation.x,H.armR.rotation.x,H.hp.rotation.y].map(v=>v.toFixed(2)).join(',');
ok('Robot animates the body',p1!==p2,p1+' / '+p2);
__step(300);ok('Dances keep going while you stand still',EM.id==='robot');
keys.KeyW=true;__step(5);keys.KeyW=false;ok('Moving ends the dance',!EM.id);
// every dance runs
for(const id of ['shuffle','disco','chicken','cheer','wave']){fresh();doEmote(EMOTES.findIndex(e=>e.id===id));__step(30);ok(id+' plays',EM.id===id&&grounded)}
fresh();doEmote(EMOTES.findIndex(e=>e.id==='cheer'));__step(200);ok('Cheer ends by itself',!EM.id);
fresh();doEmote(EMOTES.findIndex(e=>e.id==='disco'));__step(10);jumpBuf=.15;keys.Space=true;press('jump');__step(5);keys.Space=false;ok('Jumping ends a dance',!EM.id);__step(60);
// tap mode
fresh();kdQ();__step(3);keys.KeyQ=false;__step(3);ok('A quick tap keeps the wheel open',EM.wheel&&EM.sticky);
keys.KeyS=true;__step(3);keys.KeyS=false;ok('Down picks Snow Angel',EMOTES[EM.sel].id==='angel');
press('jump');__step(3);ok('Jump confirms: snow angel (winter)',!EM.wheel&&SA.t>0,'WIN='+WIN);__step(260);
fresh();kdQ();__step(2);keys.KeyQ=false;__step(3);emoteKey('Digit4');__step(3);ok('Number key 4 does Shuffle',EM.id==='shuffle');
fresh();kdQ();__step(2);keys.KeyQ=false;__step(3);emoteKey('Escape');ok('Esc closes the wheel without pausing',!EM.wheel&&state==='play');
fresh();kdQ();__step(2);keys.KeyQ=false;__step(3);document.querySelectorAll('.eslot')[6].click();__step(3);ok('Clicking a slot does it (Disco)',EM.id==='disco');
fresh();kdQ();__step(40);keys.KeyQ=false;__step(3);ok('Holding then letting go with nothing picked closes it',!EM.wheel&&!EM.id);
// yellow snow from the wheel keeps going until Q again
fresh();YS.tank=T.yellow.tank;kdQ();__step(2);keys.KeyQ=false;__step(2);doEmote(EMOTES.findIndex(e=>e.id==='yellow'));__step(30);ok('Yellow snow from the wheel keeps spraying after letting go',YS.spray&&YS.auto);
kdQ();keys.KeyQ=false;__step(2);ok('Q again stops it',!YS.spray&&!EM.wheel);__step(60);
setYellow(false);fresh();doEmote(EMOTES.findIndex(e=>e.id==='yellow'));ok('Yellow snow off in Settings: refused',!YS.spray);setYellow(true);
// shortcuts unchanged
fresh();keys.ShiftLeft=true;kdQ();keys.KeyQ=false;keys.ShiftLeft=false;__step(3);ok('Crouch + Q is still a quick snow angel',SA.t>0&&!EM.wheel);__step(260);
fresh();py=5;vy=0;grounded=false;kdQ();keys.KeyQ=false;__step(2);ok('In the air Q still ground pounds',GP.st>0&&!EM.wheel);__step(80);
// pad
const GP_={id:'test pad',index:0,connected:true,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};const realGP=navigator.getGamepads.bind(navigator),realHF=document.hasFocus;navigator.getGamepads=()=>[GP_];document.hasFocus=()=>true;
const bt=(i,v)=>{GP_.buttons[i]={pressed:v,value:v?1:0}};
fresh();__step(2);bt(4,true);__step(3);ok('Pad: holding L1 opens the wheel',EM.wheel);GP_.axes[0]=-1;__step(3);GP_.axes[0]=0;__step(1);bt(4,false);__step(3);ok('Pad: stick left, let go of L1 = Disco',EM.id==='disco',EM.id);
fresh();bt(4,true);__step(2);bt(4,false);__step(3);ok('Pad: tap L1 keeps it open',EM.wheel&&EM.sticky);GP_.axes[0]=1;__step(3);GP_.axes[0]=0;__step(1);bt(0,true);__step(2);bt(0,false);__step(3);ok('Pad: stick right + X = Robot',EM.id==='robot',EM.id);
fresh();bt(4,true);__step(2);bt(4,false);__step(3);bt(1,true);__step(2);bt(1,false);__step(2);ok('Pad: O closes the wheel',!EM.wheel&&!EM.id);
navigator.getGamepads=realGP;document.hasFocus=realHF;__step(3);
fresh();const wasP=state;kdQ();__step(2);keys.KeyQ=false;__step(3);press('pause');ok('Pause closes the wheel and pauses',!EM.wheel&&state==='paused');resume();__step(3);
for(const c of chars.map((q,i)=>i).filter(i=>i>=2&&chars[i].name!=='Vex')){menu();pickMode='run';pickLevel=3;ci=c;showChar();confirmChar();__step(5);fresh();doEmote(EMOTES.findIndex(e=>e.id==='chicken'));__step(40);ok(chars[ci].name+' can dance',EM.id==='chicken')}
return out.join('\n')})()
