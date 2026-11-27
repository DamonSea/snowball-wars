// The frame loop: tick() updates the active mode, camera, sounds and every animation, then renders.
// ---------- loop ----------
const clock=new THREE.Clock();let tAll=0;
const camPos=V(0,14,22),look=V(0,0,0);
let wasPlaying=null,wallSliding=false,sndG=true,sndAir=0,sndVy=0,stepPh=0;
// spring physics input: how the character's velocity changed this frame, in their own frame (f forward, s right, u up)
const pv={x:0,y:0,z:0},dvL={f:0,s:0,u:0};let idleT=0;
// Settings → Squash & stretch: Exaggerated springs the whole body around every move (TS = spring state per rig)
let TOON=0;try{const v=localStorage.getItem('orbRunSquash');TOON=v==='big'?1:v==='normal'?0:Math.max(0,Math.min(1,+v||0))}catch(e){}
function setToon(v){TOON=v===true?1:v===false?0:Math.max(0,Math.min(1,+v||0));try{localStorage.setItem('orbRunSquash',String(TOON))}catch(e){}}
const TS=new Map();
// target body scale for the current move: [x (side), y (up), z (forward)]
function toonTarget(air,m){const acro=!!chars[ci].acro;
  if(GP.st===1)return[1.2,.72,1.2];
  if(GP.st===2)return[.72,1.6,.72];
  if(GP.st===3){const k=GP.t/T.pound.recover;return[1+.6*k,1-.55*k,1+.6*k]}
  if(ATK.t>0){const p=1-ATK.t/ATK.dur,ext=p<.55?Math.sin(Math.min(1,p/.3)*PI/2):1-(p-.55)/.45;
    if(p<.1)return[1.12,.86,.78];
    if(ATK.kind==='sweep')return[1.3,.7,1.3];
    if(ATK.kind==='combo'&&ATK.step===3)return[1.25,.78,1.25];
    return[1-.12*ext,1-.12*ext,1+.55*ext]}
  if(SB.anim>0){const q=1-SB.anim/.3;return q<.4?[1.1,.88,.8]:[.9,1.05,1.35]}
  if(acro&&(m==='dive'||m==='slide'))return[.82,.82,1.5];
  if(acro&&m==='long')return[.85,.85,1.4];
  if(acro&&m==='skid')return[1.15,.88,.72];
  if(acro&&m==='crouch')return[1.18,.74,1.18];
  if(acro&&A.wallT>0&&air&&vy<=0)return[1.15,1.1,.7];
  if(acro&&air&&A.flipT<.75)return[1.1,.82,1.1];
  if(air&&vy>0){const y=1+Math.min(vy/28,.5);return[1/Math.sqrt(y),y,1/Math.sqrt(y)]}
  if(air&&vy<-6){const y=1+Math.min((-vy-6)/50,.22);return[1/Math.sqrt(y),y,1/Math.sqrt(y)]}
  if(squash>0){const q=squash;return[1+.6*q,1-.72*q,1+.6*q]}
  return[1,1,1]}
// base = the Default look ([x,y,z]); the slider blends toward the cartoon target and loosens the spring as it goes
function toonScale(o,dt,air,m,tookOff,base=[1,1,1]){let S=TS.get(o);if(!S){S={x:base[0],y:base[1],z:base[2],vx:0,vy:0,vz:0};TS.set(o,S)}
  const q=TOON,tt=toonTarget(air,m),t=base.map((b,i)=>b+(tt[i]-b)*q),C=30-19*q;if(tookOff){S.vy+=7*q;S.vx-=3*q;S.vz-=3*q}
  [['x',0],['y',1],['z',2]].forEach(([a,i])=>{const v='v'+a;S[v]+=((t[i]-S[a])*230-S[v]*C)*dt;S[a]=Math.max(.35,Math.min(2,S[a]+S[v]*dt))});
  o.scale.set(S.x,S.y,S.z)}
const playingToon=()=>TOON>0&&(state==='play'||state==='paused');
function tick(){
  pollPad();if(!$('ov').classList.contains('hide'))updatePadInfo();
  const pl=state==='play';if(pl!==wasPlaying){wasPlaying=pl;document.body.classList.toggle('playing',pl);if(pl)renderControls();freeUI()}
  let dt=Math.min(clock.getDelta(),.05);if(hitStop>0){hitStop-=dt;dt*=.12}tAll+=dt;
  if(state==='build'){builderFrame(dt);renderer.render(scene,cam);perfFrame();requestAnimationFrame(tick);return}   // Map Builder: its own camera, no game updates
  if(state==='play')updateAttack(dt);
  water.position.y=-.8+Math.sin(tAll*.8)*.05;
  if(state==='play')updateRun(dt);
  if(state==='play'&&mode==='run')updateSnow(dt);
  unstick(dt);holdFrame(dt);updateCpu(dt);warsUpdate(dt);raceUpdate(dt);tagUpdate(dt);poundFx(dt);updateYellow(dt);updateAngels(dt);updateEmotes(dt);updateRollers(dt);updateFlipArrow();
  if(state==='play'){
    if(grounded&&!sndG&&sndAir>.15)SFX.land(-sndVy);
    if(!grounded){sndAir+=dt;sndVy=vy}else sndAir=0;
    const am=chars[ci].acro?A.mode:'normal',gs=Math.hypot(vel.x,vel.z);
    if(grounded&&gs>1.2&&am!=='skid'&&am!=='slide'&&!A.knock){const ph=Math.floor(walk*(onIce?1.15:ci===0?3:am==='crouch'?3.2:2.2)/PI);if(ph!==stepPh){stepPh=ph;SFX.step(onIce?3:ci===0?2:mode==='adv'&&curIdx===1?1:0)}}
  }
  updSnow(dt);if(state!=='paused'&&state!=='over')breath(dt);audioFrame(dt);sndG=grounded;{const gl=state==='play'&&onIce&&grounded&&Math.hypot(vel.x,vel.z)>2&&selOf('step')>=0;loopNoise('skate',gl,{ft:'highpass',f:4200,q:.6,vol:.035})}{const ws=selOf('wallSlide');loopNoise('slide',wallSliding&&state==='play'&&ws>=0,SFXV.wallSlide.opts[Math.max(0,ws)][1])}if(state!=='play')wallSliding=false;
  if(state==='menu'){face=Math.sin(tAll*.5)*.35;if(tAll%6<dt)wave=1.6}
  else if(state==='paused'&&CUST.on){if(CUST.rotTo!=null)CUST.rot+=angD(CUST.rotTo,CUST.rot)*Math.min(1,dt*5);face=CUST.rot}
  else if(state==='select'){if(CUST.on&&CUST.rotTo!=null)CUST.rot+=angD(CUST.rotTo,CUST.rot)*Math.min(1,dt*5);face=CUST.on?CUST.rot:Math.sin(tAll*.7)*.45}
  else if(state==='paused'&&tAll%7<dt&&!setOpen)wave=1.6;

  P.position.y=py;P.rotation.y=aimFace();
  updateLandMark(dt);   // after this frame's movement, so the ground spot sits right under you
  const moving=Math.hypot(vel.x,vel.z)>.5&&state==='play';
  WIND.t.value=tAll;WIND.amp.value=GFX.mode==='low'||(GFX.mode==='auto'&&GFX.pr<=1)?0:1;   // trees sway, except on Low graphics
  if(state!=='play'&&(EM.hold||EM.wheel||EM.id)){closeWheel();stopEmote()}   // menus, pause, level changes
  chars.forEach((c,i)=>c.g.visible=i===ci);wave=Math.max(0,wave-dt);
  const air=!grounded&&state==='play';
  {const pl=state==='play',dx=pl?vel.x-pv.x:0,dz=pl?vel.z-pv.z:0,sf=Math.sin(face),cf=Math.cos(face);
    dvL.f=dx*sf+dz*cf;dvL.s=dx*cf-dz*sf;dvL.u=pl?vy-pv.y:0;pv.x=vel.x;pv.y=vy;pv.z=vel.z;
    const busy=EM.id||EM.wheel||EM.hold||BS.on||moving||air||ATK.t>0||GP.st||YS.spray||YS.t>0||SA.t>0||SB.anim>0||LH.on||CL.on||RS.pushing||wave>0||(chars[ci].acro&&A.mode!=='normal');
    idleT=(state==='play'||state==='select'||state==='menu'||state==='paused')&&!busy?idleT+dt:0}
  const tookOff=state==='play'&&wasG&&!grounded&&vy>3;
  if(ci===0){
    body.position.y=(moving&&grounded&&!onIce?Math.abs(Math.sin(walk*3))*.12:Math.sin(tAll*3)*.04)+(wave>1.2?Math.sin((1.6-wave)*PI/.4)*.35:0);
    body.rotation.z=moving?Math.sin(walk*3)*.08:0;
    if(ATK.t>0){const p=1-ATK.t/ATK.dur,ext=p<.55?Math.sin(Math.min(1,p/.3)*PI/2):1-(p-.55)/.45,e=1-(1-p)*(1-p),spin=ATK.kind!=='combo'||ATK.step===3;
      body.rotation.y=spin?-e*2*PI:(ATK.step===1?-.7:.7)*ext;body.rotation.x=(ATK.kind==='sweep'?.1:.35)*ext;feet[1].position.z=.45*ext;if(ATK.kind==='sweep')body.position.y-=.2}
    else if(CL.on){body.rotation.y=0;body.rotation.x=CL.top?PI:-.35;if(CL.top)body.position.y+=1.45+Math.sin(tAll*3)*.03}
    else if(SA.t>0){const e=angelPhase().lie;body.rotation.y=0;body.rotation.x=-PI/2*e;body.position.y-=.3*e}
    else if(GP.st){body.rotation.y=0;body.rotation.x=GP.st===1?(1-GP.t/T.pound.spin)*2*PI:0;if(GP.st===3)body.position.y-=.18*(GP.t/T.pound.recover)}
    else if(YS.spray||YS.t>0){body.rotation.y=0;body.rotation.x=-.1;body.rotation.z=YS.spray?0:Math.sin(tAll*42)*.09}
    else if(SB.anim>0){body.rotation.y=0;body.rotation.x=SB.anim>.18?-.3:.4}
    else if(BS.on){body.rotation.y=0;body.rotation.x=-.45+buttTilt();body.rotation.z=0;body.position.y-=.12}
    else if(EM.id){body.rotation.y=Math.sin(EM.t*6)*.4;body.rotation.x=0;body.position.y+=Math.abs(Math.sin(EM.t*8))*.15}
    else{body.rotation.y=0;body.rotation.x=0}
    feet[0].position.z=moving?Math.sin(walk*3)*.22:0;feet[1].position.z=-feet[0].position.z;
    if(playingToon())toonScale(body,dt,air,'normal',tookOff);else{TS.delete(body);body.scale.set(1,1,1)}
    if(state==='play'&&grounded&&!wasG)squash=Math.min(1,Math.max(.65,-airVy/12));if(!grounded)airVy=vy;wasG=grounded;squash=Math.max(0,squash-dt*4.5);
  }else{
    const H=chars[ci].rig,m=A.mode,playing=state==='play',acro=!!chars[ci].acro&&playing,chibi=ci>=2;
    const sp=acro?Math.abs(A.spd):Math.hypot(vel.x,vel.z),run=moving&&grounded,ph=walk*2.2;
    // lean into turns
    const dF=angD(face,lastFace)/Math.max(dt,1e-3);lastFace=face;
    bank+=(clamp(-dF*.045*Math.min(1,sp/7),.32)*(playing?1:0)-bank)*(1-Math.exp(-7*dt));
    // squash on landing
    if(playing&&grounded&&!wasG)squash=TOON>.5?Math.min(1,Math.max(.65,-airVy/12)):Math.min(1,Math.max(.35,-airVy/15));
    if(!grounded)airVy=vy;wasG=grounded;squash=Math.max(0,squash-dt*4.5);
    const br=Math.sin(tAll*2.2);
    let lx=0,lr=0,ax=.05*br,ar=-.05*br,zl=-.12-br*.04,zr=.12+br*.04,pitch=0,roll=0,yaw=0,yo=br*.012,hx=Math.sin(tAll*1.1)*.05,hz=0,hy=0,snap=false,snapY=false,rate=10,llz=0,skz=0;
    if(acro&&air&&A.wallT>0&&vy<=0&&m!=='dive'){rate=14;pitch=-.15;lx=-.9;lr=-.15;ax=-2.7;ar=-1.3;zl=-.5;zr=.4;hx=.2}
    else if(acro&&(air||m==='slide')){rate=14;
      if(m==='dive'||m==='slide'){pitch=1.45;ax=ar=-3;zl=-.25;zr=.25;lx=lr=.15+Math.sin(tAll*9)*(m==='dive'?.12:0);yo=m==='slide'?-.42:0;hx=-.9}
      else if(m==='long'){pitch=.25;lx=-1.3;lr=.9;ax=ar=1.1;zl=-.55;zr=.55;hx=-.15}
      else if(m==='jump'&&A.jumpN===2&&A.twirlT<.55){const p=A.twirlT/.55,e=1-(1-p)*(1-p);yaw=e*2*PI;snapY=true;lx=-.55;lr=.55;ax=ar=-.2;zl=-1.45;zr=1.45;hx=-.1}
      else if(A.flipT<.75){const p=A.flipT/.75,e=p<.5?2*p*p:1-2*(1-p)*(1-p);lx=lr=-1.6;ax=ar=-1.1;snap=true;
        if(A.flipAxis==='x')pitch=A.flipDir*e*2*PI;
        else if(sideStyle==='classic')roll=e*2*PI;
        // side somersault: turn side-on, open into a straddle with arms out, rotate through the direction of travel
        else{const tw=Math.min(1,p/.15,(1-p)/.15);yaw=tw*PI/2;snapY=true;roll=e*2*PI;lx=lr=0;llz=-.75;skz=.75;ax=ar=0;zl=-1.5;zr=1.5;hx=0}}
      else{lx=-.8;lr=.35;ax=.5+Math.sin(tAll*7)*.12;ar=-2.7+Math.sin(tAll*7+1)*.12;zl=-.35;zr=.2;hx=vy>0?-.15:.15}
    }else if(acro&&m==='skid'){rate=16;pitch=-.4;lx=-.9;lr=.3;ax=ar=.7;zl=-.85;zr=.85;roll=Math.sin(tAll*38)*.05;hx=.25}
    else if(acro&&m==='crouch'){rate=14;yo=-.2;pitch=.45;lx=lr=-.9;ax=ar=-.6;zl=-.3;zr=.3;hx=-.3;
      if(grounded&&A.spd>.3&&A.spd<=3.5){const c=Math.sin(walk*3.2);lx=-.9+c*.4;lr=-.9-c*.4;ax=-.6-c*.35;ar=-.6+c*.35;roll=c*.06;yaw=c*.08;yo=-.2+Math.abs(Math.cos(walk*3.2))*.04;hz=-roll}}
    else if(air){rate=12;lx=-.7;lr=.35;ax=ar=-2.4}
    else if(run&&onIce){rate=10;const ia=Math.min(1,Math.hypot(vel.x,vel.z)/9),s=Math.sin(walk*1.15);
      pitch=.12+.3*ia;lx=-.2+s*.4*ia;lr=-.2-s*.4*ia;llz=-.32*Math.max(0,s)*ia;skz=.32*Math.max(0,-s)*ia;
      ax=ar=.25;zl=-.55-s*.45*ia;zr=.55-s*.45*ia;yaw=s*.14*ia;roll=s*.07*ia;yo=-.05;hx=-pitch*.6;hy=-yaw*.8;hz=-roll}
    else if(run&&GAIT!=='fluid'){rate=chibi?18:14;   // Classic run (the original)
      const amp=chibi?Math.min(1.2,.45+sp*.075):.8,s=Math.sin(ph);
      lx=s*amp;lr=-s*amp;ax=-s*amp*.95;ar=s*amp*.95;
      zl=chibi?-.22-Math.abs(s)*.1:-.1;zr=-zl;
      pitch=(chibi?Math.min(.32,sp*.028):.06)+Math.abs(Math.sin(ph*2))*.03;
      yaw=s*(chibi?.16:.1);roll=s*.04;yo=Math.abs(Math.cos(ph))*(chibi?.1:.07);
      hx=-pitch*.6;hy=-yaw*.8;hz=-roll}
    else if(run){rate=chibi?20:14;   // Fluid run
      // walk -> jog -> sprint blend (g). Legs: a shaped swing that kicks up behind at speed (the forward swing is the
      // quicker one); arms lag the legs a touch so they feel loose; the body bobs twice a stride, dipping on each
      // footfall, sways over the planted foot, and leans in harder when speeding up (dvL.f) and back when braking
      const g=Math.min(1,Math.max(0,(sp-1)/8)),s=Math.sin(ph),s2=Math.sin(ph*2),la=Math.sin(ph-.35);
      const stride=chibi?.42+g*.8:.45+g*.4,kick=g*.28;
      lx=s*stride+kick*Math.max(0,s)**2;lr=-s*stride+kick*Math.max(0,-s)**2;
      ax=-la*stride*(.75+g*.35);ar=la*stride*(.75+g*.35);
      zl=(chibi?-.18:-.1)-g*.12-Math.abs(la)*.08;zr=-zl;
      const acc=clamp(dvL.f*1.5,.18);
      pitch=(chibi?.04+g*.26:.04+g*.1)+acc+Math.max(0,-s2)*.025;
      yaw=s*(chibi?.1+g*.06:.08);roll=s*(.05-g*.02);
      const foot=Math.abs(Math.cos(ph));yo=(chibi?.025+g*.09:.03+g*.05)*Math.pow(foot,.7)-(1-foot)*g*.03;
      hx=-pitch*.7+Math.max(0,s2)*.03;hy=-yaw*.85;hz=-roll*.8;
      // feet roll heel to toe (Flipper's boots)
      if(H.bootGs)H.bootGs.forEach((b,i)=>{const p=i?-s:s;b.rotation.x+=((p>0?-.35*p:.25*p)*(.4+g*.6)-b.rotation.x)*Math.min(1,dt*20)})}
    let lrz=skz;
    if(ATK.t>0){const p=1-ATK.t/ATK.dur,ext=p<.55?Math.sin(Math.min(1,p/.3)*PI/2):1-(p-.55)/.45,e=1-(1-p)*(1-p),st=ATK.step,kd=ATK.kind;rate=30;
      if(kd==='combo'&&st<3){const Rt=st===1;yaw=(Rt?-.5:.5)*ext;pitch=.14*ext;lx=Rt?-.35:.3;lr=Rt?.3:-.35;hy=-yaw*.6;
        if(Rt){ar=-1.6*ext-.5*(1-ext);zr=.12;ax=-1.15;zl=-.4}else{ax=-1.6*ext-.5*(1-ext);zl=-.12;ar=-1.15;zr=.4}}
      else if(kd==='combo'){snapY=true;yaw=-e*2*PI;lr=-1.55*ext;lx=.3;zl=-1.25;zr=1.25;ax=ar=-.3;pitch=-.22*ext}
      else if(kd==='sweep'){snapY=true;yaw=-e*2*PI;yo=-.38;pitch=.4;lx=-1.05;lr=-.2;lrz=1.45*ext;ax=-.9;ar=-.4;zl=-.7;zr=.3}
      else{lr=-1.5*ext;lx=.45;ax=ar=.5;zl=-.5;zr=.5;pitch=-.3*ext}}
    if(GP.st&&!CL.on){rate=26;if(GP.st===1){pitch=(1-GP.t/T.pound.spin)*2*PI;snap=true;roll=0;yaw=0;lx=lr=-1.5;ax=ar=-.4;zl=-.6;zr=.6;hx=-.3}
      else if(GP.st===2){pitch=0;roll=0;yaw=0;lx=lr=-1.7;ax=ar=-2.9;zl=-.25;zr=.25;hx=.15;yo=.1}
      else{const k=GP.t/T.pound.recover;pitch=.3*k;yo=-.25*k;lx=lr=-.9*k;ax=ar=.9;zl=-.9;zr=.9;hx=-.2}}
    // yellow snow: hands low in front, hips forward, head tipped back in relief (legs keep walking); a shiver to finish
    else if((YS.spray||YS.t>0)&&!CL.on){rate=12;ax=ar=-.55;zl=-.08;zr=.08;hx=-.25;pitch=-.08;if(!run){lx=lr=-.08}if(!YS.spray)roll=Math.sin(tAll*42)*.07}
    // snow angel: lie back, sweep arms overhead and legs apart; push pose for rolling snowballs
    else if(SA.t>0&&!CL.on){const k=angelPhase(),e=k.lie;rate=18;snap=true;pitch=-PI/2*e;yo=-(H.hp.position.y-.3)*e;roll=0;yaw=0;hx=.1*e;ax=ar=0;zl=-.15-k.sweep*2.6*e;zr=-zl;lx=lr=0;llz=-k.sweep*.55*e;lrz=k.sweep*.55*e}
    // butt slide: sitting back, legs out front, arms up (wheee), leaning with the slope
    else if(BS.on&&!CL.on){const w=Math.sin(tAll*9);rate=16;pitch=-.32+buttTilt();roll=bank*.5;yaw=0;yo=-(H.hp.position.y-.3);lx=lr=-1.5;llz=-.12;lrz=.12;
      ax=-2.75+w*.15;ar=-2.75-w*.15;zl=-.55;zr=.55;hx=-.2;hy=0}
    else if(RS.pushing&&grounded&&!CL.on&&ATK.t<=0){ax=ar=-1.35;zl=-.25;zr=.25;pitch+=.22;hx=-.1}
    else if(SB.anim>0&&!CL.on){const q=1-SB.anim/.3;rate=30;if(q<.4){ar=.9;zr=.25;yaw=.35;hy=-.2}else{ar=-2.5+(q-.4)*2.2;zr=.15;yaw=-.3;hy=.2}}
    // emotes: dances, wave and cheer (emotes.js)
    else if(EM.id&&!CL.on&&state==='play'){const o=emotePose({lx,lr,ax,ar,zl,zr,pitch,roll,yaw,yo,hx,hy,hz,llz,lrz,rate});({lx,lr,ax,ar,zl,zr,pitch,roll,yaw,yo,hx,hy,hz,llz,lrz,rate}=o)}
    // standing still with part of you over a drop: teeter (lean over and back, arms windmilling, a leg up, eyes down)
    const tt=edgeTeeter(dt,sp);
    if(tt&&!CL.on&&!LH.on&&ATK.t<=0&&!GP.st&&!EM.id&&!BS.on&&!(SA.t>0)&&!YS.spray){const w=Math.sin(tAll*5.5),fwd=Math.cos(tt.rel),side=Math.sin(tt.rel),
        lean=(.2+w*.17)*tt.k,c=tAll*11;rate=12;
      pitch=fwd*lean;roll=-side*lean;yaw=0;
      ax=(-1.7+Math.sin(c)*1.3)*tt.k;ar=(-1.7+Math.sin(c+PI)*1.3)*tt.k;zl=-.25-.85*tt.k;zr=.25+.85*tt.k;
      lx=-fwd*.2*tt.k;lr=fwd*.9*tt.k*(.75+.25*Math.sin(tAll*3));llz=0;lrz=side*.4*tt.k;
      hx=(fwd>0?.5:-.15)*tt.k;hy=side*.5*tt.k;hz=Math.sin(tAll*7)*.06*tt.k;yo=0}
    // paused in mid-air: a cartoon beat. Freeze with an "oh!", look down at the drop, then flail and pedal, glancing at you
    const pa=state==='paused'&&!grounded&&!CL.on&&!LH.on&&!(typeof WAR!=='undefined'&&WAR.on&&WAR.out>0);
    PAIR.t=pa?PAIR.t+dt:0;
    if(pa){const t=PAIR.t,flail=t>1.7,look=t>.55&&t<1.9;snap=false;snapY=false;rate=flail?16:9;roll=0;yaw=0;
      pitch=flail?.12+Math.sin(tAll*6)*.06:.05;yo=Math.sin(tAll*2.2)*.03;
      if(!flail){lx=-.55;lr=.25;ax=-2.2;ar=-2.4;zl=-.45;zr=.45;hx=look?.75:-.12;hy=look?.15:0}
      else{const c=tAll*13;lx=Math.sin(c)*.9;lr=-Math.sin(c)*.9;ax=-1.6+Math.sin(c*.9)*1.4;ar=-1.6-Math.sin(c*.9)*1.4;zl=-.9;zr=.9;
        hx=Math.sin(tAll*1.7)>.4?.6:-.1;hy=Math.sin(tAll*2.3)*.25}
      hz=Math.sin(tAll*9)*.03}
    pairFace(H,pa);
    if(CL.on&&state!=='menu'){snap=false;snapY=false;rate=12;yaw=0;roll=0;hy=0;hz=0;lrz=0;llz=0;
      if(CL.top){pitch=PI;ax=ar=-3.1;zl=-.15;zr=.15;lx=.4;lr=-.4;roll=Math.sin(tAll*3)*.07;yo=H.hsYo??(ci>=2?.32:.38);hx=-.3}
      else{const c=Math.sin(CL.h*3+CL.ang*2);pitch=-.12;ax=-2.75+c*.45;ar=-2.75-c*.45;zl=-.3;zr=.3;lx=-.95+c*.45;lr=-.95-c*.45;yo=0;hx=.35}}
    // ledge hang: arms straight up gripping the edge, legs dangling (they swing as you shimmy); pull-up bends the arms
    if(LH.on&&state!=='menu'){snap=false;snapY=false;rate=16;yaw=0;roll=0;hy=0;hz=0;lrz=0;llz=0;hx=-.25;const sw=Math.sin(walk*2.2);
      if(LH.up>0){const k=1-LH.up/LH.upT;rate=22;ax=ar=-3+Math.min(1,k*1.4)*2.6;zl=-.25;zr=.25;lx=-1.3*Math.sin(PI*Math.min(1,k*1.15));lr=-.9*Math.sin(PI*Math.min(1,k*1.25));pitch=.45*Math.sin(PI*k);yo=0}
      else{ax=-3+sw*.18;ar=-3-sw*.18;zl=-.18;zr=.18;lx=.08+sw*.12;lr=.08-sw*.12;pitch=.04;yo=0}}
    // Tuk, standing around: head back, catching snowflakes
    if(H.yeti&&idleT>1.5&&!CL.on&&!LH.on){const k=Math.min(1,(idleT-1.5)*2);hx=-.5*k+Math.sin(tAll*1.3)*.08;hy=Math.sin(tAll*.7)*.25*k;ax=ar=-.25*k;zl=-.35*k;zr=.35*k;pitch=-.08*k}
    if(H.attitude&&idleT>.4&&!CL.on&&!LH.on){const k=Math.min(1,(idleT-.4)*3);rate=8;ax=-1.5*k;ar=-1.38*k;zl=.74*k;zr=-.7*k;lx=-.06;lr=.1;roll=.07*k;yo=0;pitch=-.04*k;hx=-.14*k;hy=.3*k+Math.sin(tAll*.6)*.05;hz=.13*k}
    if(H.bootGs&&!(run&&GAIT==='fluid'))H.bootGs.forEach(b=>{b.rotation.x*=1-Math.min(1,dt*12)});   // feet flat again
    if(wave>0&&!air&&!moving&&!pa&&!tt){zr=2.5+Math.sin(wave*14)*.35;ar=0;hz=-.1}
    if(state==='select'&&!CUST.on)hy=Math.sin(tAll*1.3)*.25;
    roll+=bank;hz-=bank*.5;
    const k=snap?1:1-Math.exp(-rate*dt),kh=1-Math.exp(-8*dt),L=(o,p,v,q=k)=>o[p]+=(v-o[p])*q;
    L(H.legL.rotation,'x',lx);L(H.legR.rotation,'x',lr);L(H.legR.rotation,'z',lrz);L(H.legL.rotation,'z',llz);L(H.armL.rotation,'x',ax);L(H.armR.rotation,'x',ar);
    L(H.armL.rotation,'z',zl);L(H.armR.rotation,'z',zr);L(H.root.position,'y',yo);
    if(snapY)H.hp.rotation.y=yaw;else{if(Math.abs(H.hp.rotation.y)>PI)H.hp.rotation.y-=Math.sign(H.hp.rotation.y)*2*PI;L(H.hp.rotation,'y',yaw)}
    if(snap||Math.abs(H.hp.rotation.x)>PI*1.2||Math.abs(H.hp.rotation.z)>PI*1.2){H.hp.rotation.x=pitch;H.hp.rotation.z=roll}
    else{L(H.hp.rotation,'x',pitch);L(H.hp.rotation,'z',roll)}
    L(H.head.rotation,'x',hx,kh);L(H.head.rotation,'y',hy,kh);L(H.head.rotation,'z',hz,kh);
    // squash and stretch
    const st=air&&vy>0?1+Math.min(vy/70,.13):1,sy=(1-.26*squash*squash)*st,sxz=1/Math.sqrt(sy);
    if(playingToon())toonScale(H.root,dt,air,m,tookOff,[sxz,sy,sxz]);else{TS.delete(H.root);L(H.root.scale,'y',sy,.5);L(H.root.scale,'x',sxz,.5);L(H.root.scale,'z',sxz,.5)}
    // Snowball Wars knockout: flat on your back until you respawn
    if(playing&&typeof WAR!=='undefined'&&WAR.on&&WAR.out>0){applyPose({rig:H},KO_Q,koBlend(T.wars.respawn-WAR.out));koStars(myStars,P.position.x,py,P.position.z,face,dt)}
    if(H.accA&&H.accA.length)accFrame(H,dt,sp,air,dvL);
    if(H.ears)tukPhysics(H,dt,dvL,sp,air,idleT>1.5&&state!=='menu');
    if(H.locks)hairPhysics(H,dt,dvL,sp,air,air&&vy<-2);
    if(H.tails)vexPhysics(H,dt,dvL,sp,air,run,ph,bank,idleT>1.2&&state!=='menu');
    if(H.scarf){const fl=Math.min(1.25,sp*.11)+(air?.35:0)+(state==='select'?.15:0);
      H.scarf.forEach((g,i)=>{L(g.rotation,'x',(i?fl*.12:.25+fl)+Math.sin(tAll*(6+sp)-i*1.1)*(.08+fl*.12),.25);
        L(g.rotation,'z',Math.sin(tAll*(4+sp*.5)-i*.9)*(.06+fl*.08)-bank*.3,.25)})}
    // Nova's beanie tip and pom-pom stream back with speed, bounce with steps, flip up when falling
    if(H.pony){const fl=Math.min(1,sp*.08)+(air?(vy<0?.7:.3):0)+(state==='select'?.1:0),bob=run?Math.sin(ph*2)*.12:0;
      H.pony.forEach((g,i)=>{L(g.rotation,'x',(i?.12+fl*.22:.45+fl*.75)+bob+Math.sin(tAll*(5+sp*.6)-i*1.2)*(.05+fl*.08),.22);
        L(g.rotation,'z',Math.sin(tAll*(3.5+sp*.4)-i*.8)*(.05+fl*.06)-bank*.5,.22)})}
    if(H.eyes){const b=tAll%3.7<.13?.12:1;H.eyes.forEach((e,i)=>L(e.scale,'y',(e._by??(i%2?1:1.25))*b,.6))}
  }
  P.visible=!(invuln>0&&state==='play'&&Math.floor(invuln*12)%2)&&!(typeof WAR!=='undefined'&&WAR.on&&WAR.out>0&&WAR.out<=.3);

  orbs.forEach(o=>{o.t+=dt;o.m.position.y=1+Math.sin(o.t*2.4)*.2;o.m.rotation.y+=dt*1.8;if(!ORB_FLAT[orbSkin()])o.m.rotation.x+=dt*.9;const s=1+Math.sin(o.t*3)*.12;o.ring.scale.set(s,s,s)});
  if(fxT>0){fxT-=dt;const q=1-fxT/.3;fxRing.scale.setScalar(1+q*3.5);fxM.opacity=Math.max(0,1-q)*.9;if(fxT<=0)fxRing.visible=false}
  RUNMAPS.forEach(M=>{if(M.blink)M.blink.emissiveIntensity=tAll%1.4<.35?2.4:.15});
  for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.life-=dt;q.v.y-=12*dt;q.m.position.addScaledVector(q.v,dt);
    q.m.material.opacity=Math.max(0,q.life/.7);if(q.life<=0){freeTree(q.m);parts.splice(i,1)}}

  if((state==='select'||state==='paused')&&CUST.on){const wide=innerWidth>=760,fz=CUST.tab==='face',R_=chars[ci].rig,hy=R_&&R_.head?R_.hp.position.y+R_.head.position.y:1.64;   // face zoom: aimed at this character's head
    const ox=state==='paused'?P.position.x:0,oy=state==='paused'?py:0,oz=state==='paused'?P.position.z:0;   // from the pause menu: wherever they're standing
    camPos.set(ox,oy+(fz?hy+.11:1.5),oz+(fz?(wide?2.3:2.9):(wide?4.3:5.4)));look.set(ox+(wide?(fz?.42:.85):0),oy+(fz?hy-.14:(wide?.85:.15)),oz);cam.position.lerp(camPos,1-Math.exp(-6*dt))}
  else if(state==='select'){camPos.set(0,1.9,innerWidth<600?7:5.6);look.set(0,innerWidth<600?.1:.45,0);cam.position.lerp(camPos,1-Math.exp(-6*dt))}
  // paused: swing round in front of the character so they face the camera, standing to the left of the pause card
  else if(state==='paused'){const fx=Math.sin(face),fz=Math.cos(face),wide=innerWidth>=900,d=wide?4.6:5.4,o=wide?1.9:0;
    camPos.set(P.position.x+fx*d,py+1.5,P.position.z+fz*d);look.set(P.position.x+fz*o,py+(wide?.95:.2),P.position.z-fx*o);cam.position.lerp(camPos,1-Math.exp(-4*dt))}
  else if(state==='menu'){if(innerWidth>=900){camPos.set(-.6+Math.sin(tAll*.2)*.4,2.3,7.2);look.set(2.4,1.2,0);cam.position.lerp(camPos,1-Math.exp(-3*dt))}
    else{camPos.set(Math.cos(tAll*.12)*24,13,Math.sin(tAll*.12)*24);look.set(0,0,0);cam.position.copy(camPos)}}
  else camFollow(dt);
  if(shake>0){shake-=dt;cam.position.x+=(Math.random()-.5)*shake;cam.position.y+=(Math.random()-.5)*shake}
  cam.lookAt(look);
  dnFrame(dt);if(DN.light)sun.position.set(P.position.x+DN.light.x*36,Math.max(14,DN.light.y*40),P.position.z+DN.light.z*36);else sun.position.set(P.position.x+18,30,P.position.z+12);sun.target.position.copy(P.position);

  mpFrame(dt);
  renderer.render(scene,cam);perfFrame();
  requestAnimationFrame(tick);
}
