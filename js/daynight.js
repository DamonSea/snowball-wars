// Day and night (Settings → Time of day: Always day / Always night / Day & night cycle). Night darkens the sky and
// fog, turns the sun into cool moonlight, and brings out a moon (craters and a soft halo) and twinkling stars; dusk
// and dawn warm the sky. The cycle runs DN.len seconds for a whole day, a little more day than night.
// dnFrame (every frame, from the loop) blends the season's daytime palette toward the night one by DN.amt (1 = day).
const DN={mode:'cycle',p:.2,len:480,amt:1};
try{const v=localStorage.getItem('orbRunTime');if(['day','night','cycle'].includes(v))DN.mode=v}catch(e){}
DN.amt=DN.mode==='night'?0:1;   // start the way it was left (switching later fades)
function setTimeOfDay(m){DN.mode=m;if(m==='cycle')DN.p=.2;try{localStorage.setItem('orbRunTime',m)}catch(e){}}
// ---------- sky dressing: stars in four sets that twinkle out of step, and the moon ----------
const dotTex=(()=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.8)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return new THREE.CanvasTexture(c)})();
const skyG=new THREE.Group();scene.add(skyG);
const STARS=[0,1,2,3].map(k=>{const n=140,pos=new Float32Array(n*3);
  for(let i=0;i<n;i++){const az=Math.random()*2*PI,el=.04+Math.pow(Math.random(),.8)*1.45,R=150;   // above the horizon
    pos[i*3]=Math.cos(el)*Math.sin(az)*R;pos[i*3+1]=Math.sin(el)*R;pos[i*3+2]=Math.cos(el)*Math.cos(az)*R}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const m=new THREE.PointsMaterial({size:[2.2,3,2.6,3.6][k],sizeAttenuation:false,map:dotTex,transparent:true,depthWrite:false,fog:false,color:[0xffffff,0xfff4d8,0xdfe8ff,0xffffff][k]});
  const p=new THREE.Points(g,m);p.frustumCulled=false;p.renderOrder=-2;skyG.add(p);return{p,m,w:1.3+k*.7,ph:k*1.7}});
const MOON_DIR=(()=>{const x=-.38,y=.5,z=-.78,l=Math.hypot(x,y,z);return V(x/l,y/l,z/l)})();
const moonG=new THREE.Group();skyG.add(moonG);
{const mm=new THREE.MeshBasicMaterial({color:0xf3efdc,fog:false}),cr=new THREE.MeshBasicMaterial({color:0xd8d2bb,fog:false});
  const m=new THREE.Mesh(new THREE.SphereGeometry(7,24,16),mm);moonG.add(m);
  [[1.8,2.2,1.6],[-2.4,-1.2,1.2],[.6,-2.8,.9],[-1,2.6,.7],[2.9,-1,.6]].forEach(([x,y,r])=>{const c=new THREE.Mesh(new THREE.CircleGeometry(r,16),cr);c.position.set(x,y,6.6-Math.hypot(x,y)*.25);moonG.add(c)});
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:dotTex,color:0xbfd2ff,transparent:true,opacity:.5,depthWrite:false,fog:false}));halo.scale.setScalar(46);moonG.add(halo);moonG.halo=halo;moonG.mats=[mm,cr]}
moonG.renderOrder=-1;
// ---------- palettes ----------
const _c1=new THREE.Color(),_c2=new THREE.Color(),_dusk=new THREE.Color(0xff9058),_duskHemi=new THREE.Color(0xffc7a0),_duskSun=new THREE.Color(0xffa060);
const NIGHT={sky:0x0b1532,hemi:0x56689a,ground:0x161e2e,hi:.55,sun:0xa8c0ff,si:.42,near:18,far:62};
const dayPal=()=>WIN?{sky:0xaec4d6,hemi:0xe6f2ff,ground:0x6f8296,hi:.85,sun:0xeaf2ff,si:.85,near:22,far:72}:{sky:0x123f57,hemi:0xcfeeff,ground:0x2d3a22,hi:.75,sun:0xffdcb0,si:1.05,near:30,far:75};
const mix=(a,b,t)=>a+(b-a)*t,mixC=(out,a,b,t)=>out.setHex(a).lerp(_c2.setHex(b),t);
function dnFrame(dt){
  if(DN.mode==='cycle'&&(state==='play'||state==='menu'||state==='select'))DN.p=(DN.p+dt/DN.len)%1;
  const el=Math.sin(DN.p*2*PI)+.18,target=DN.mode==='day'?1:DN.mode==='night'?0:Math.min(1,Math.max(0,(el+.2)/.4));
  DN.amt+=(target-DN.amt)*(dt?Math.min(1,dt*2.5):1);const a=DN.amt,n=1-a,D=dayPal(),dusk=DN.mode==='cycle'?Math.max(0,1-Math.abs(el)/.4)*.85:0;
  mixC(scene.background,NIGHT.sky,D.sky,a);if(dusk)scene.background.lerp(_dusk,dusk*Math.min(1,a*1.6));scene.fog.color.copy(scene.background);
  scene.fog.near=mix(NIGHT.near,D.near,a);scene.fog.far=mix(NIGHT.far,D.far,a);
  mixC(hemi.color,NIGHT.hemi,D.hemi,a);if(dusk)hemi.color.lerp(_duskHemi,dusk*.6);mixC(hemi.groundColor,NIGHT.ground,D.ground,a);hemi.intensity=mix(NIGHT.hi,D.hi,a);
  mixC(sun.color,NIGHT.sun,D.sun,a);if(dusk)sun.color.lerp(_duskSun,dusk*.8);sun.intensity=mix(NIGHT.si,D.si,a);
  // stars and moon ride along with the camera, so they always sit on the sky
  skyG.position.copy(cam.position);skyG.visible=n>.02;
  STARS.forEach(s=>{s.m.opacity=Math.min(1,n*1.3)*(.55+.45*Math.sin(tAll*s.w+s.ph))});
  moonG.position.set(MOON_DIR.x*130,MOON_DIR.y*130,MOON_DIR.z*130);moonG.lookAt(cam.position);moonG.halo.material.opacity=.45*n;moonG.mats.forEach(m=>{m.transparent=n<.98;m.opacity=Math.min(1,n*1.4)});
  // shadows come from the moon at night
  DN.light=a>.5?null:MOON_DIR}
