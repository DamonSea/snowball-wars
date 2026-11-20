// Yellow snow (a juvenile gag; Settings → Yellow snow turns it off). Press the Ground pound button while standing
// in winter: your character turns their back to the camera for a moment, a yellow patch appears in the snow, and
// your next snowball is a yellow snowball worth a Yellow Snowball bonus when it hits someone. Patches are shared
// with friends in multiplayer through presence ("ys": your last few patches).
const YS={on:true,t:0,armed:false,spots:[],sent:[],seq:0,yIds:new Set()};
try{YS.on=localStorage.getItem('orbRunYellow')!=='0'}catch(e){}
const ysM=new THREE.MeshBasicMaterial({color:0xf2d64b,transparent:true,opacity:.85,depthWrite:false});
function poundOrSnow(){if(grounded&&state==='play')yellowSnow();else groundPound()}
function yellowSnow(){
  if(!YS.on||YS.t>0||CL.on||SB.stun>0||ATK.t>0||GP.st||!grounded)return;
  if(chars[ci].acro&&A.mode!=='normal')return;
  if(!WIN){toast('No snow to write your name in. Try winter.');return}
  YS.t=T.yellow.time;face=PI;vel.set(0,0,0);A.spd=0;SFX.yellow();
  const x=f2(P.position.x+Math.sin(face)*.55),z=f2(P.position.z+Math.cos(face)*.55),y=f2(py);
  makeSpot(x,y,z,T.yellow.time*.8);YS.armed=true;
  YS.sent.push([++YS.seq,x,y,z]);if(YS.sent.length>3)YS.sent.shift();
  addTrick('Yellow Snow')}
// a patch: a few overlapping discs that spread out, steam a little, then melt away
function makeSpot(x,y,z,grow=.6){const g=new THREE.Group();g.position.set(x,y+.025,z);scene.add(g);
  [[0,0,.34],[.16,.08,.22],[-.12,.12,.2],[.04,-.15,.18]].forEach(([dx,dz,r])=>{const m=new THREE.Mesh(new THREE.CircleGeometry(r,18),ysM.clone());m.rotation.x=-PI/2;m.position.set(dx,0,dz);g.add(m)});
  g.scale.setScalar(.05);YS.spots.push({g,t:0,grow,life:T.yellow.spotLife});
  while(YS.spots.length>T.yellow.maxSpots){const o=YS.spots.shift();scene.remove(o.g)}}
function updateYellow(dt){
  if(YS.t>0){YS.t=Math.max(0,YS.t-dt);vel.set(0,0,0);A.spd=0}
  for(let i=YS.spots.length-1;i>=0;i--){const s=YS.spots[i];s.t+=dt;
    s.g.scale.setScalar(Math.min(1,.05+s.t/s.grow));
    if(s.t<3&&Math.random()<dt*6)burst(V(s.g.position.x+(Math.random()-.5)*.3,s.g.position.y+.1,s.g.position.z+(Math.random()-.5)*.3),0xfff6d8,1);
    const fade=Math.min(1,(s.life-s.t)/3);s.g.children.forEach(m=>m.material.opacity=.85*Math.max(0,fade));
    if(s.t>=s.life){scene.remove(s.g);YS.spots.splice(i,1)}}}
// friends' patches (called from snowFromPeer)
function yellowFromPeer(pr,a){if(!Array.isArray(pr.ys))return;
  if(!a.ysSeen){a.ysSeen=new Set(pr.ys.map(s=>Array.isArray(s)&&s[0]));return}
  for(const s of pr.ys){if(!Array.isArray(s)||s.length<4||a.ysSeen.has(s[0])||!s.slice(1).every(Number.isFinite))continue;
    a.ysSeen.add(s[0]);if(mode==='run'&&WIN)makeSpot(s[1],s[2],s[3])}}
function clearYellow(){YS.spots.forEach(s=>scene.remove(s.g));YS.spots=[];YS.t=0;YS.armed=false}
function setYellow(on){YS.on=on;try{localStorage.setItem('orbRunYellow',on?'1':'0')}catch(e){}if(!on){YS.armed=false}renderControls()}
