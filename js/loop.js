// The frame loop: tick() updates the active mode, camera, sounds and every animation, then renders.
// ---------- loop ----------
const clock=new THREE.Clock();let tAll=0;
const camPos=V(0,14,22),look=V(0,0,0);
let wasPlaying=null,wallSliding=false,sndG=true,sndAir=0,sndVy=0,stepPh=0;
function tick(){
  pollPad();if(!$('ov').classList.contains('hide'))updatePadInfo();
  const pl=state==='play';if(pl!==wasPlaying){wasPlaying=pl;document.body.classList.toggle('playing',pl);if(pl)renderControls();freeUI()}
  let dt=Math.min(clock.getDelta(),.05);if(hitStop>0){hitStop-=dt;dt*=.12}tAll+=dt;
  if(state==='play')updateAttack(dt);
  water.position.y=-.8+Math.sin(tAll*.8)*.05;
  if(state==='play')mode==='run'?updateRun(dt):updateAdv(dt);
  if(state==='play'&&mode==='run')updateSnow(dt);
  updateCpu(dt);
  if(state==='play'){
    if(grounded&&!sndG&&sndAir>.15)SFX.land(-sndVy);
    if(!grounded){sndAir+=dt;sndVy=vy}else sndAir=0;
    const am=chars[ci].acro?A.mode:'normal',gs=Math.hypot(vel.x,vel.z);
    if(grounded&&gs>1.2&&am!=='skid'&&am!=='slide'&&!A.knock){const ph=Math.floor(walk*(onIce?1.15:ci===0?3:am==='crouch'?3.2:2.2)/PI);if(ph!==stepPh){stepPh=ph;SFX.step(onIce?3:ci===0?2:mode==='adv'&&curIdx===1?1:0)}}
  }
  updSnow(dt);if(state!=='paused'&&state!=='over')breath(dt);audioFrame(dt);sndG=grounded;{const gl=state==='play'&&onIce&&grounded&&Math.hypot(vel.x,vel.z)>2&&selOf('step')>=0;loopNoise('skate',gl,{ft:'highpass',f:4200,q:.6,vol:.035})}{const ws=selOf('wallSlide');loopNoise('slide',wallSliding&&state==='play'&&ws>=0,SFXV.wallSlide.opts[Math.max(0,ws)][1])}if(state!=='play')wallSliding=false;
  else if(state==='menu'){face=Math.sin(tAll*.5)*.35;if(tAll%6<dt)wave=1.6}
  else if(state==='select'){face=Math.sin(tAll*.7)*.45}
  if(mode==='adv'&&(state==='won'||state==='over'))goal.spin(dt);

  P.position.y=py;P.rotation.y=face;
  const moving=Math.hypot(vel.x,vel.z)>.5&&state==='play';
  chars.forEach((c,i)=>c.g.visible=i===ci);wave=Math.max(0,wave-dt);
  const air=!grounded&&state==='play';
  if(ci===0){
    body.position.y=(moving&&grounded&&!onIce?Math.abs(Math.sin(walk*3))*.12:Math.sin(tAll*3)*.04)+(wave>1.2?Math.sin((1.6-wave)*PI/.4)*.35:0);
    body.rotation.z=moving?Math.sin(walk*3)*.08:0;
    if(ATK.t>0){const p=1-ATK.t/ATK.dur,ext=p<.55?Math.sin(Math.min(1,p/.3)*PI/2):1-(p-.55)/.45,e=1-(1-p)*(1-p),spin=ATK.kind!=='combo'||ATK.step===3;
      body.rotation.y=spin?-e*2*PI:(ATK.step===1?-.7:.7)*ext;body.rotation.x=(ATK.kind==='sweep'?.1:.35)*ext;feet[1].position.z=.45*ext;if(ATK.kind==='sweep')body.position.y-=.2}
    else if(CL.on){body.rotation.y=0;body.rotation.x=CL.top?PI:-.35;if(CL.top)body.position.y+=1.45+Math.sin(tAll*3)*.03}
    else if(SB.anim>0){body.rotation.y=0;body.rotation.x=SB.anim>.18?-.3:.4}
    else{body.rotation.y=0;body.rotation.x=0}
    feet[0].position.z=moving?Math.sin(walk*3)*.22:0;feet[1].position.z=-feet[0].position.z;
  }else{
    const H=ci===1?R:F,m=A.mode,playing=state==='play',acro=ci===2&&playing,chibi=ci===2;
    const sp=acro?Math.abs(A.spd):Math.hypot(vel.x,vel.z),run=moving&&grounded,ph=walk*2.2;
    // lean into turns
    const dF=angD(face,lastFace)/Math.max(dt,1e-3);lastFace=face;
    bank+=(clamp(-dF*.045*Math.min(1,sp/7),.32)*(playing?1:0)-bank)*(1-Math.exp(-7*dt));
    // squash on landing
    if(playing&&grounded&&!wasG)squash=Math.min(1,Math.max(.35,-airVy/15));
    if(!grounded)airVy=vy;wasG=grounded;squash=Math.max(0,squash-dt*4.5);
    const br=Math.sin(tAll*2.2);
    let lx=0,lr=0,ax=.05*br,ar=-.05*br,zl=-.12-br*.04,zr=.12+br*.04,pitch=0,roll=0,yaw=0,yo=br*.012,hx=Math.sin(tAll*1.1)*.05,hz=0,hy=0,snap=false,snapY=false,rate=10,llz=0,skz=0;
    if(acro&&air&&A.wallT>0&&vy<=0&&m!=='dive'){rate=14;pitch=-.15;lx=-.9;lr=-.15;ax=-2.7;ar=-1.3;zl=-.5;zr=.4;hx=.2}
    else if(acro&&(air||m==='slide')){rate=14;
      if(m==='dive'||m==='slide'){pitch=1.45;ax=ar=-3;zl=-.25;zr=.25;lx=lr=.15+Math.sin(tAll*9)*(m==='dive'?.12:0);yo=m==='slide'?-.42:0;hx=-.9}
      else if(m==='long'){pitch=.25;lx=-1.3;lr=.9;ax=ar=1.1;zl=-.55;zr=.55;hx=-.15}
      else if(m==='jump'&&A.jumpN===2&&A.twirlT<.55){const p=A.twirlT/.55,e=1-(1-p)*(1-p);yaw=e*2*PI;snapY=true;lx=-.55;lr=.55;ax=ar=-.2;zl=-1.45;zr=1.45;hx=-.1}
      else if(A.flipT<.75){const p=A.flipT/.75,e=p<.5?2*p*p:1-2*(1-p)*(1-p);lx=lr=-1.6;ax=ar=-1.1;snap=true;
        if(A.flipAxis==='x')pitch=A.flipDir*e*2*PI;else roll=e*2*PI}
      else{lx=-.8;lr=.35;ax=.5+Math.sin(tAll*7)*.12;ar=-2.7+Math.sin(tAll*7+1)*.12;zl=-.35;zr=.2;hx=vy>0?-.15:.15}
    }else if(acro&&m==='skid'){rate=16;pitch=-.4;lx=-.9;lr=.3;ax=ar=.7;zl=-.85;zr=.85;roll=Math.sin(tAll*38)*.05;hx=.25}
    else if(acro&&m==='crouch'){rate=14;yo=-.2;pitch=.45;lx=lr=-.9;ax=ar=-.6;zl=-.3;zr=.3;hx=-.3;
      if(grounded&&A.spd>.3&&A.spd<=3.5){const c=Math.sin(walk*3.2);lx=-.9+c*.4;lr=-.9-c*.4;ax=-.6-c*.35;ar=-.6+c*.35;roll=c*.06;yaw=c*.08;yo=-.2+Math.abs(Math.cos(walk*3.2))*.04;hz=-roll}}
    else if(air){rate=12;lx=-.7;lr=.35;ax=ar=-2.4}
    else if(run&&onIce){rate=10;const ia=Math.min(1,Math.hypot(vel.x,vel.z)/9),s=Math.sin(walk*1.15);
      pitch=.12+.3*ia;lx=-.2+s*.4*ia;lr=-.2-s*.4*ia;llz=-.32*Math.max(0,s)*ia;skz=.32*Math.max(0,-s)*ia;
      ax=ar=.25;zl=-.55-s*.45*ia;zr=.55-s*.45*ia;yaw=s*.14*ia;roll=s*.07*ia;yo=-.05;hx=-pitch*.6;hy=-yaw*.8;hz=-roll}
    else if(run){rate=chibi?18:14;
      const amp=chibi?Math.min(1.2,.45+sp*.075):.8,s=Math.sin(ph);
      lx=s*amp;lr=-s*amp;ax=-s*amp*.95;ar=s*amp*.95;
      zl=chibi?-.22-Math.abs(s)*.1:-.1;zr=-zl;
      pitch=(chibi?Math.min(.32,sp*.028):.06)+Math.abs(Math.sin(ph*2))*.03;
      yaw=s*(chibi?.16:.1);roll=s*.04;yo=Math.abs(Math.cos(ph))*(chibi?.1:.07);
      hx=-pitch*.6;hy=-yaw*.8;hz=-roll}
    let lrz=skz;
    if(ATK.t>0){const p=1-ATK.t/ATK.dur,ext=p<.55?Math.sin(Math.min(1,p/.3)*PI/2):1-(p-.55)/.45,e=1-(1-p)*(1-p),st=ATK.step,kd=ATK.kind;rate=30;
      if(kd==='combo'&&st<3){const Rt=st===1;yaw=(Rt?-.5:.5)*ext;pitch=.14*ext;lx=Rt?-.35:.3;lr=Rt?.3:-.35;hy=-yaw*.6;
        if(Rt){ar=-1.6*ext-.5*(1-ext);zr=.12;ax=-1.15;zl=-.4}else{ax=-1.6*ext-.5*(1-ext);zl=-.12;ar=-1.15;zr=.4}}
      else if(kd==='combo'){snapY=true;yaw=-e*2*PI;lr=-1.55*ext;lx=.3;zl=-1.25;zr=1.25;ax=ar=-.3;pitch=-.22*ext}
      else if(kd==='sweep'){snapY=true;yaw=-e*2*PI;yo=-.38;pitch=.4;lx=-1.05;lr=-.2;lrz=1.45*ext;ax=-.9;ar=-.4;zl=-.7;zr=.3}
      else{lr=-1.5*ext;lx=.45;ax=ar=.5;zl=-.5;zr=.5;pitch=-.3*ext}}
    if(SB.anim>0&&!CL.on){const q=1-SB.anim/.3;rate=30;if(q<.4){ar=.9;zr=.25;yaw=.35;hy=-.2}else{ar=-2.5+(q-.4)*2.2;zr=.15;yaw=-.3;hy=.2}}
    if(CL.on&&state!=='menu'){snap=false;snapY=false;rate=12;yaw=0;roll=0;hy=0;hz=0;lrz=0;llz=0;
      if(CL.top){pitch=PI;ax=ar=-3.1;zl=-.15;zr=.15;lx=.4;lr=-.4;roll=Math.sin(tAll*3)*.07;yo=ci===2?.32:.38;hx=-.3}
      else{const c=Math.sin(CL.h*3+CL.ang*2);pitch=-.12;ax=-2.75+c*.45;ar=-2.75-c*.45;zl=-.3;zr=.3;lx=-.95+c*.45;lr=-.95-c*.45;yo=0;hx=.35}}
    if(wave>0&&!air&&!moving){zr=2.5+Math.sin(wave*14)*.35;ar=0;hz=-.1}
    if(state==='select')hy=Math.sin(tAll*1.3)*.25;
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
    L(H.root.scale,'y',sy,.5);L(H.root.scale,'x',sxz,.5);L(H.root.scale,'z',sxz,.5);
    if(H.scarf){const fl=Math.min(1.25,sp*.11)+(air?.35:0)+(state==='select'?.15:0);
      H.scarf.forEach((g,i)=>{L(g.rotation,'x',(i?fl*.12:.25+fl)+Math.sin(tAll*(6+sp)-i*1.1)*(.08+fl*.12),.25);
        L(g.rotation,'z',Math.sin(tAll*(4+sp*.5)-i*.9)*(.06+fl*.08)-bank*.3,.25)})}
    if(H.eyes){const b=tAll%3.7<.13?.12:1;H.eyes.forEach((e,i)=>L(e.scale,'y',(i%2?1:1.25)*b,.6))}
  }
  P.visible=!(invuln>0&&state==='play'&&Math.floor(invuln*12)%2);

  orbs.forEach(o=>{o.t+=dt;o.m.position.y=1+Math.sin(o.t*2.4)*.2;o.m.rotation.y+=dt*1.8;o.m.rotation.x+=dt*.9;const s=1+Math.sin(o.t*3)*.12;o.ring.scale.set(s,s,s)});
  cores.forEach(c=>{c.t+=dt;c.m.position.y=1.1+Math.sin(c.t*2)*.2;c.m.rotation.y+=dt*2});
  if(fxT>0){fxT-=dt;const q=1-fxT/.3;fxRing.scale.setScalar(1+q*3.5);fxM.opacity=Math.max(0,1-q)*.9;if(fxT<=0)fxRing.visible=false}
  RUNMAPS.forEach(M=>{if(M.blink)M.blink.emissiveIntensity=tAll%1.4<.35?2.4:.15});
  goal.pad.scale.setScalar(1+Math.sin(tAll*3)*.06);
  for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.life-=dt;q.v.y-=12*dt;q.m.position.addScaledVector(q.v,dt);
    q.m.material.opacity=Math.max(0,q.life/.7);if(q.life<=0){scene.remove(q.m);parts.splice(i,1)}}

  if(state==='select'){camPos.set(0,1.9,innerWidth<600?7:5.6);look.set(0,innerWidth<600?.1:.45,0);cam.position.lerp(camPos,1-Math.exp(-6*dt))}
  else if(state==='menu'){if(innerWidth>=900){camPos.set(-.6+Math.sin(tAll*.2)*.4,2.3,7.2);look.set(2.4,1.2,0);cam.position.lerp(camPos,1-Math.exp(-3*dt))}
    else{camPos.set(Math.cos(tAll*.12)*24,13,Math.sin(tAll*.12)*24);look.set(0,0,0);cam.position.copy(camPos)}}
  else if(state==='won'){camPos.set(P.position.x+4,py+7,P.position.z+11);look.copy(goal.look);cam.position.lerp(camPos,1-Math.exp(-2*dt))}
  else{camPos.set(P.position.x,py+T.camera.height,P.position.z+T.camera.back);look.set(P.position.x,py+1,P.position.z);cam.position.lerp(camPos,1-Math.exp(-5*dt))}
  if(shake>0){shake-=dt;cam.position.x+=(Math.random()-.5)*shake;cam.position.y+=(Math.random()-.5)*shake}
  cam.lookAt(look);
  sun.position.set(P.position.x+18,30,P.position.z+12);sun.target.position.copy(P.position);

  mpFrame(dt);
  renderer.render(scene,cam);
  requestAnimationFrame(tick);
}
