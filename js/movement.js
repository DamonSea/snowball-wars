// Movement: standard controls (Sunny, Rook) and Flip's momentum moveset (skid, crouch, long jump,
// backflip, side flip, dive, triple jump, wall jump), plus hurt and jump.
const angD=(a,b)=>{const d=a-b;return((d+PI)%(2*PI)+2*PI)%(2*PI)-PI};
const clamp=(v,a)=>Math.max(-a,Math.min(a,v));
function move(dt,speed){
  let ix=kbAxisX()+joy.x+pad.x;
  let iz=kbAxisZ()+joy.z+pad.z;
  if(CAM.yaw)[ix,iz]=camInput(ix,iz);   // turning cameras: Up means away from the camera
  const im=Math.hypot(ix,iz);if(im>1){ix/=im;iz/=im}
  speed*=chars[ci].speed;invuln=Math.max(0,invuln-dt);
  if(poundMove(dt))return;
  if(YS.spray||YS.t>0){yellowMove(dt,ix,iz);return}
  if(SA.t>0){angelMove(dt);return}
  if(SB.stun>0){jumpBuf=0;P.position.x+=vel.x*dt;P.position.z+=vel.z*dt;vel.multiplyScalar(Math.exp(-2.5*dt));if(chars[ci].acro){A.spd=0;A.air=!grounded;A.mode='normal'}return}
  if(BS.on||wantButt(ix,iz)){if(!BS.on)startButt();if(buttMove(dt,ix,iz)){jumpBuf=Math.max(0,jumpBuf-dt);return}}
  if(chars[ci].acro){moveAcro(dt,speed,ix,iz);jumpBuf=Math.max(0,jumpBuf-dt);return}
  if(ATK.t>0&&grounded)speed*=.15;
  const k=1-Math.exp(-(ATK.t>0&&grounded?6:T.walkAccel)*dt);vel.x+=(ix*speed-vel.x)*k;vel.z+=(iz*speed-vel.z)*k;
  P.position.x+=vel.x*dt;P.position.z+=vel.z*dt;
  const sp=Math.hypot(vel.x,vel.z);
  if(sp>.5&&ATK.t<=0)face+=angD(Math.atan2(vel.x,vel.z),face)*Math.min(1,dt*T.turnRate);
  walk+=sp*dt*1.6;
  if(jumpBuf>0){if(grounded)jump();jumpBuf=Math.max(0,jumpBuf-dt)}
}
function puff(n=1){for(let i=0;i<n;i++){if(n===1&&Math.random()<.4)continue;
  const m=new THREE.Mesh(partGeo,new THREE.MeshBasicMaterial({color:puffCol,transparent:true}));
  m.position.set(P.position.x+(Math.random()-.5)*.5,py+.1,P.position.z+(Math.random()-.5)*.5);m.scale.setScalar(1.6);scene.add(m);
  parts.push({m,v:V((Math.random()-.5)*1.5,1+Math.random()*1.2,(Math.random()-.5)*1.5),life:.45})}}
function startFlip(axis,dir){A.flipAxis=axis;A.flipDir=dir;A.flipT=0}
function landAcro(){
  if(A.mode==='dive'){A.mode='slide';A.t=T.flip.dive.slideTime;puff(6);SFX.slide()}
  else{if(A.mode==='long')A.spd*=T.flip.longJump.landKeep;if(A.spd<0)A.spd=0;A.landT=A.mode==='jump'?T.flip.chainWindow:0;if(A.mode==='jump'&&A.jumpN===2&&A.spd>T.flip.chainMinSpeed){readyRing();SFX.ready()}A.mode='normal';if(A.flipT<99)puff(4)}
  A.canDive=true;A.canCut=false;A.flipT=99;
}
function moveAcro(dt,max,ix,iz){
  const im=Math.hypot(ix,iz),ang=Math.atan2(ix,iz);
  const ck=!!(held('crouch')||joy.crouch),edge=ck&&!A.prevC;A.prevC=ck;
  if(A.knock>0){A.knock-=dt;P.position.x+=vel.x*dt;P.position.z+=vel.z*dt;vel.multiplyScalar(Math.exp(-3*dt));A.spd=0;A.air=!grounded;return}
  A.landT=Math.max(0,A.landT-dt);A.wallT=grounded?0:Math.max(0,A.wallT-dt);A.lock=Math.max(0,A.lock-dt);
  if(grounded&&A.air)landAcro();
  A.air=!grounded;
  const leave=()=>{grounded=false;stand=null;jumpBuf=0};
  if(grounded){
    if(A.mode==='slide'){A.t-=dt;A.spd*=Math.exp(-T.flip.dive.slideDecay*dt);puff();if(A.t<=0)A.mode=ck?'crouch':'normal'}
    else if(A.mode==='skid'){A.t-=dt;A.spd=Math.max(0,A.spd-T.flip.skid.decel*dt);puff(onIce?4:2);
      if(jumpBuf>0){face=A.skidTo;A.spd=T.flip.sideFlip.speed;vy=T.flip.sideFlip.vy;A.mode='flip';startFlip('z',1);leave();SFX.flip();addTrick(sideStyle==='classic'?'Side Flip':'Side Somersault')}
      else if(A.t<=0){A.mode='normal';face=A.skidTo;A.spd=T.flip.skid.exitSpeed}}
    else if(ck){if(A.mode!=='crouch'&&A.mode!=='slide')SFX.crouch();A.mode='crouch';const cw=im>.2?T.flip.crouch.crawlSpeed*im:0;
      if(A.spd>cw)A.spd=Math.max(cw,A.spd*Math.exp(-T.flip.crouch.decay*dt));else A.spd=Math.min(cw,A.spd+T.flip.crouch.accel*dt);
      if(im>.2)face+=clamp(angD(ang,face),(A.spd>T.flip.longJump.minSpeed?T.flip.crouch.turnSlide:T.flip.crouch.turnCrawl)*dt);
      if(jumpBuf>0){
        if(A.spd>T.flip.longJump.minSpeed){vy=T.flip.longJump.vy;A.spd=T.flip.longJump.speed;A.mode='long';SFX.longJump();addTrick('Long Jump')}
        else{vy=T.flip.backflip.vy;A.spd=T.flip.backflip.speed;A.mode='flip';startFlip('x',-1);SFX.backflip();addTrick('Backflip')}
        A.jumpN=0;leave()}}
    else{
      A.mode='normal';
      if(ATK.t>0)A.spd=Math.max(0,A.spd-(ATK.step===3?14:30)*dt);
      else if(im>.2){const d=angD(ang,face);
        if(Math.abs(d)>T.flip.skid.angle&&A.spd>T.flip.skid.minSpeed){A.mode='skid';A.t=T.flip.skid.time;A.skidTo=ang;SFX.skid()}
        else{const tr=A.spd>T.flip.fastAbove?T.flip.turnSlow:T.flip.turnFast;face+=clamp(d,tr*dt);
          const tgt=max*T.flip.topSpeedBoost*im*(Math.abs(d)>T.flip.sharpTurn?.5:1);
          A.spd+=A.spd<tgt?Math.min(T.flip.accel*dt,tgt-A.spd):-Math.min(T.flip.decel*dt,A.spd-tgt)}}
      else A.spd=Math.max(0,A.spd-T.flip.stopDecel*dt);
      if(A.mode==='normal'&&jumpBuf>0){
        A.jumpN=A.landT>0&&A.spd>T.flip.chainMinSpeed&&A.jumpN<3?A.jumpN+1:1;
        vy=T.flip.jumps[A.jumpN];A.mode='jump';A.canCut=A.jumpN<3;if(A.jumpN===3){startFlip('x',1);addTrick('Triple Jump');burst(V(P.position.x,py+.3,P.position.z),0xffcc33,16)}
        if(A.jumpN===2){A.twirlT=0;addTrick('Double Jump');burst(V(P.position.x,py+.6,P.position.z),0x5ff3ff,12)}
        SFX.jump(A.jumpN);leave()}
    }
  }else{
    if(A.wallT>0&&jumpBuf>0&&A.mode!=='dive'){face=Math.atan2(A.wnx,A.wnz);A.spd=T.flip.wallJump.speed;vy=T.flip.wallJump.vy;A.mode='jump';A.jumpN=0;A.canCut=false;A.canDive=true;A.flipT=99;A.lock=T.flip.wallJump.lock;A.wallT=0;jumpBuf=0;puff(4);SFX.wallKick();addTrick('Wall Jump')}
    if(edge&&A.canDive&&A.mode!=='dive'){A.mode='dive';A.canDive=false;vy=Math.max(vy*.5,T.flip.dive.minVy);A.spd=Math.max(A.spd,T.flip.dive.speed);A.flipT=99;A.canCut=false;A.twirlT=99;SFX.dive();addTrick('Dive');burst(V(P.position.x,py+.8,P.position.z),0xffffff,10)}
    if(im>.2&&A.mode!=='dive'&&A.mode!=='long'&&A.lock<=0&&!(A.mode==='flip'&&A.spd<0)){face+=clamp(angD(ang,face),T.flip.air.turn*dt);if(A.spd<max*im)A.spd+=T.flip.air.accel*dt}
    if(A.canCut&&!held('jump')&&!joy.jump&&vy>T.flip.jumpCutAbove){vy*=T.flip.jumpCut;A.canCut=false}
    A.flipT+=dt;A.twirlT+=dt;if(A.mode==='long'&&Math.random()<.6)trail(0xffffff);
  }
  vel.x=Math.sin(face)*A.spd;vel.z=Math.cos(face)*A.spd;
  P.position.x+=vel.x*dt;P.position.z+=vel.z*dt;
  walk+=Math.abs(A.spd)*dt*1.6;
}
function hurt(x,z,kb){ATK.t=0;resetPound();CL.on=false;CL.top=false;rumble(220,.9,.5);lives--;invuln=1.6;shake=.35;SFX.hurt();A.knock=chars[ci].acro?T.flip.knockTime:0;A.mode='normal';A.flipT=99;
  const dx=P.position.x-x,dz=P.position.z-z,d=Math.hypot(dx,dz)||1;vel.x=dx/d*kb;vel.z=dz/d*kb;vy=5;grounded=false;stand=null;hud()}
function jump(){if(grounded&&state==='play'){vy=chars[ci].jump;grounded=false;stand=null;jumpBuf=0;ci===0?SFX.robotJump():SFX.jump(1)}}
