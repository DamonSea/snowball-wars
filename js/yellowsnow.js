// Yellow snow (a juvenile gag; Settings → Yellow snow turns it off). Hold the Ground pound button while standing
// in winter: your character sprays a yellow stream in an arc in front of them. You stay in control (slow walk,
// turn to aim) and wherever it lands it marks the snow, so you can draw or write your name. Each go lasts up to
// T.yellow.tank seconds and refills over time. Let go and they finish with a shiver. After a go, your next
// snowball is a yellow snowball worth a Yellow Snowball bonus. In multiplayer, presence "yw" says you're spraying
// and friends' screens draw your stream from your avatar.
const YS={on:true,spray:false,t:0,tank:0,used:0,armed:false,drops:[],sess:[],cur:null,dt:1/60,yIds:new Set()};
try{YS.on=localStorage.getItem('orbRunYellow')!=='0'}catch(e){}
const ysDropGeo=new THREE.SphereGeometry(.045,6,4),ysDropM=new THREE.MeshBasicMaterial({color:0xf5dc52}),ysMarkGeo=new THREE.CircleGeometry(.1,10);
YS.tank=T.yellow.tank;
// on the ground: Crouch + Ground pound makes a snow angel; Ground pound alone is yellow snow (Nova always makes angels)
const isNova=()=>chars[ci].name==='Nova';
function poundOrSnow(){if(grounded&&state==='play'){if(isNova()||held('crouch')||joy.crouch)startAngel();else startYellow()}else groundPound()}
function startYellow(){
  if(isNova()||SA.t>0||!YS.on||YS.spray||YS.t>0||CL.on||SB.stun>0||ATK.t>0||GP.st||!grounded)return;
  if(chars[ci].acro&&A.mode!=='normal'&&A.mode!=='crouch')return;
  if(!WIN){toast('No snow to write your name in. Try winter.');return}
  if(YS.tank<.4){toast('Nothing left. Give it a minute.');SFX.deny();return}
  YS.spray=true;YS.used=0;YS.cur=newSession();addTrick('Yellow Snow')}
function stopYellow(){if(!YS.spray)return;YS.spray=false;YS.t=T.yellow.finish;if(YS.used>.4)YS.armed=true;loopNoise('yellow',false);SFX.yellowEnd()}
// a session = one group of marks sharing a material, so a whole drawing fades together
function newSession(){const m=new THREE.MeshBasicMaterial({color:0xf2d64b,transparent:true,opacity:.85,depthWrite:false}),g=new THREE.Group();scene.add(g);
  const s={g,m,t:0,n:0,acc:0};YS.sess.push(s);while(YS.sess.length>T.yellow.maxSessions){const o=YS.sess.shift();scene.remove(o.g)}return s}
// emit stream drops from a body at (x,y,z) facing f, moving (vx,vz)
function emitStream(x,y,z,f,vx,vz,sess,dt){
  const Y=T.yellow;sess.acc+=dt*Y.rate;
  while(sess.acc>=1){sess.acc--;const fx=Math.sin(f),fz=Math.cos(f),j=(Math.random()-.5)*.35,sp=Y.speed*(.92+Math.random()*.16);
    const m=new THREE.Mesh(ysDropGeo,ysDropM);m.position.set(x+fx*.32,y+.72,z+fz*.32);scene.add(m);
    YS.drops.push({m,vx:fx*sp+fz*j+vx*.6,vy:Y.lift+Math.random()*.4,vz:fz*sp-fx*j+vz*.6,sess,t:0})}}
function updateYellow(dt){
  YS.dt=dt;const Y=T.yellow;
  if(YS.spray){
    const holding=held('pound')||joy.pound;
    if(!holding||!grounded||state!=='play'||SB.stun>0||CL.on){stopYellow()}
    else{YS.tank=Math.max(0,YS.tank-dt);YS.used+=dt;emitStream(P.position.x,py,P.position.z,face,vel.x,vel.z,YS.cur,dt);
      loopNoise('yellow',true,{f:3000,q:1.6,vol:.045});if(YS.tank<=0){stopYellow();toast('Empty.')}}}
  else{YS.tank=Math.min(Y.tank,YS.tank+dt*Y.tank/Y.refill);if(YS.t>0)YS.t=Math.max(0,YS.t-dt)}
  // drops fly, land, leave a mark
  for(let i=YS.drops.length-1;i>=0;i--){const d=YS.drops[i],p=d.m.position;d.t+=dt;d.vy-=Y.gravity*dt;p.x+=d.vx*dt;p.y+=d.vy*dt;p.z+=d.vz*dt;
    const g=groundAt(p.x,p.z,p.y+.3).h,gh=isFinite(g)?g:0;
    if(p.y<=gh+.02||d.t>2){if(p.y<=gh+.3&&d.sess&&d.sess.n<Y.maxMarks){const k=new THREE.Mesh(ysMarkGeo,d.sess.m);k.rotation.x=-PI/2;
        k.position.set(p.x,gh+.02+Math.random()*.004,p.z);k.scale.setScalar(.7+Math.random()*.7);d.sess.g.add(k);d.sess.n++}
      if(Math.random()<.15)burst(V(p.x,gh+.05,p.z),0xfff2a8,1);scene.remove(d.m);YS.drops.splice(i,1)}}
  // drawings melt away
  for(let i=YS.sess.length-1;i>=0;i--){const s=YS.sess[i];if(s===YS.cur&&YS.spray)continue;s.t+=dt;
    s.m.opacity=.85*Math.max(0,Math.min(1,(Y.sessionLife-s.t)/4));if(s.t>=Y.sessionLife){scene.remove(s.g);YS.sess.splice(i,1)}}
}
// friends: draw their stream while their presence says they're spraying (called from snowFromPeer)
function yellowFromPeer(pr,a){
  if(pr.yw===1&&mode==='run'&&WIN&&YS.on){if(!a.ysSess||!YS.sess.includes(a.ysSess))a.ysSess=newSession();
    const G=a.g.position;emitStream(G.x,G.y,G.z,a.g.rotation.y,0,0,a.ysSess,YS.dt)}
  else a.ysSess=null}
function clearYellow(){stopYellow();YS.t=0;YS.drops.forEach(d=>scene.remove(d.m));YS.drops=[];YS.sess.forEach(s=>scene.remove(s.g));YS.sess=[];YS.armed=false}
function setYellow(on){YS.on=on;try{localStorage.setItem('orbRunYellow',on?'1':'0')}catch(e){}if(!on){stopYellow();YS.armed=false}renderControls()}
// movement while spraying or finishing: slow walk and turn to aim, no jumping
function yellowMove(dt,ix,iz){
  const im=Math.hypot(ix,iz),sp=YS.spray&&im>.2?T.yellow.walk*im:0,k=1-Math.exp(-10*dt);jumpBuf=0;
  if(im>.2)face+=angD(Math.atan2(ix,iz),face)*Math.min(1,dt*6);
  vel.x+=(Math.sin(face)*sp-vel.x)*k;vel.z+=(Math.cos(face)*sp-vel.z)*k;P.position.x+=vel.x*dt;P.position.z+=vel.z*dt;
  walk+=Math.hypot(vel.x,vel.z)*dt*1.6;if(chars[ci].acro){A.spd=Math.hypot(vel.x,vel.z);A.mode='normal'}}
