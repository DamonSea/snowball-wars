// Attacks: three-hit combo, crouch sweep, air kick, hit detection and smash feedback.
// ---------- attacks: 3-hit combo, crouch sweep, air kick ----------
const ATK={t:0,dur:0,step:0,kind:'',queued:false,cool:0,hits:0};let hitStop=0;
const swM=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
const swArc=new THREE.Mesh(new THREE.RingGeometry(.7,1.05,20,1,0,PI*.75),swM),swFull=new THREE.Mesh(new THREE.RingGeometry(1.1,1.6,32),swM);
[swArc,swFull].forEach(m=>{m.rotation.order='YXZ';m.visible=false;scene.add(m)});
const ATKSPEC=T.attacks;
const atkSpec=()=>ATKSPEC[ATK.kind==='combo'?ATK.step:ATK.kind];
function inputDir(){const ix=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joy.x+pad.x,iz=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0)+joy.z+pad.z;return Math.hypot(ix,iz)>.3?Math.atan2(ix,iz):null}
function attackPress(){
  if(state!=='play'||A.knock>0||CL.on||SB.stun>0)return;
  if(ATK.t>0){if(ATK.kind==='combo'&&ATK.step<3)ATK.queued=true;return}
  if(ATK.cool>0)return;
  const crouched=chars[ci].acro&&A.mode==='crouch'&&grounded;
  if(!grounded&&(A.mode==='dive'||A.mode==='long'))return;
  startAttack(crouched?'sweep':grounded?'combo':'air',1);
}
function startAttack(kind,step){
  Object.assign(ATK,{kind,step,queued:false,hits:0});ATK.dur=atkSpec().dur;ATK.t=ATK.dur;
  const d=inputDir();if(d!==null&&kind!=='air')face=d;
  const big=kind!=='combo'||step===3;
  SFX.swing(big?3:step);
  if(kind==='combo'&&step===3&&grounded){if(chars[ci].acro)A.spd=Math.max(A.spd,6.5);else{vel.x+=Math.sin(face)*7;vel.z+=Math.cos(face)*7}}
  if(kind==='air'&&vy<2)vy=2;
}
function updateAttack(dt){
  ATK.cool=Math.max(0,ATK.cool-dt);
  if(ATK.t<=0){swArc.visible=swFull.visible=false;return}
  ATK.t-=dt;const p=1-ATK.t/ATK.dur;
  if(ATK.queued&&p>.62){startAttack('combo',ATK.step+1);return}
  if(ATK.t<=0){ATK.t=0;ATK.cool=ATK.kind==='combo'&&ATK.step<3?.05:.28;swArc.visible=swFull.visible=false;return}
  // swipe effect during the active frames
  const on=p>.18&&p<.7,full=ATK.kind!=='combo'||ATK.step===3,m=full?swFull:swArc,o=full?swArc:swFull;o.visible=false;
  m.visible=on;if(on){swM.opacity=.55*(1-(p-.18)/.52);
    m.position.set(P.position.x,py+(ATK.kind==='sweep'?.25:ATK.kind==='combo'&&ATK.step<3?1.05:.6),P.position.z);
    m.rotation.set(-PI/2,0,0);m.rotation.y=face-PI*.875+(ATK.step===2?.25:ATK.step===1?-.25:0);if(full)m.scale.setScalar(.7+p*.6)}
}
function attackHits(pos,yBase){
  if(ATK.t<=0)return false;const p=1-ATK.t/ATK.dur;if(p<.18||p>.7)return false;
  const sp=atkSpec(),cx=P.position.x+Math.sin(face)*sp.reach,cz=P.position.z+Math.cos(face)*sp.reach;
  return Math.hypot(pos.x-cx,pos.z-cz)<sp.r+.6&&Math.abs((yBase??pos.y-.75)-py)<1.6;
}
function smash(pos){
  ATK.hits++;hitStop=.07;shake=Math.max(shake,.18);rumble(120,.7,.9);
  burst(pos.clone(),0xff5a4e,18);burst(pos.clone(),0xffffff,6);SFX.hit();
}
