// Snowfall, Flip's cold breath, and applying the Winter/Summer season to materials, sky and lights.
// ---------- snowfall ----------
const SN=1600,snowPos=new Float32Array(SN*3),snowV=new Float32Array(SN);
for(let i=0;i<SN;i++){snowPos[i*3]=(Math.random()-.5)*70;snowPos[i*3+1]=Math.random()*30-6;snowPos[i*3+2]=(Math.random()-.5)*70;snowV[i]=.7+Math.random()*1.1}
const snowGeo=new THREE.BufferGeometry();snowGeo.setAttribute('position',new THREE.BufferAttribute(snowPos,3));
const flakeCv=document.createElement('canvas');flakeCv.width=flakeCv.height=32;{const x=flakeCv.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.5,'rgba(255,255,255,.7)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,32,32)}
const snowPts=new THREE.Points(snowGeo,new THREE.PointsMaterial({size:.24,map:new THREE.CanvasTexture(flakeCv),transparent:true,depthWrite:false,opacity:.95}));snowPts.frustumCulled=false;scene.add(snowPts);
function updSnow(dt){if(!snowPts.visible)return;const cx=P.position.x,cy=py,cz=P.position.z,t=tAll;
  for(let i=0;i<SN;i++){const k=i*3;let x=snowPos[k],y=snowPos[k+1],z=snowPos[k+2];
    y-=snowV[i]*dt*1.6;x+=Math.sin(t*.7+i)*dt*.45;z+=Math.cos(t*.5+i*1.3)*dt*.3;
    if(y<cy-6)y+=30;else if(y>cy+24)y-=30;if(x-cx>35)x-=70;else if(x-cx<-35)x+=70;if(z-cz>35)z-=70;else if(z-cz<-35)z+=70;
    snowPos[k]=x;snowPos[k+1]=y;snowPos[k+2]=z}
  snowGeo.attributes.position.needsUpdate=true}
let breathT=1;
function breath(dt){if(!WIN||(breathT-=dt)>0)return;breathT=2.2+Math.random()*1.2;
  const h=ci===0?.95:1.62,fx=Math.sin(face),fz=Math.cos(face);
  for(let i=0;i<4;i++){const m=new THREE.Mesh(partGeo,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.7}));
    m.position.set(P.position.x+fx*.45,py+h,P.position.z+fz*.45);m.scale.setScalar(1.2+Math.random());scene.add(m);
    parts.push({m,v:V(fx*(.8+Math.random()*.6)+(Math.random()-.5)*.4,1.6+Math.random()*.6,fz*(.8+Math.random()*.6)+(Math.random()-.5)*.4),life:.6})}}
function applySeason(){
  SEAS.forEach(x=>x.m.color.setHex(WIN?x.w:x.s));winterOnly.forEach(o=>o.visible=WIN);summerOnly.forEach(o=>o.visible=!WIN);
  const sky=WIN?0xaec4d6:0x123f57;scene.background.setHex(sky);scene.fog.color.setHex(sky);scene.fog.near=WIN?22:30;scene.fog.far=WIN?72:75;
  hemi.color.setHex(WIN?0xe6f2ff:0xcfeeff);hemi.groundColor.setHex(WIN?0x6f8296:0x2d3a22);hemi.intensity=WIN?.85:.75;
  sun.color.setHex(WIN?0xeaf2ff:0xffdcb0);sun.intensity=WIN?.85:1.05;
  snowPts.visible=WIN&&SNOW;puffCol=WIN?0xffffff:0xeee2c4;document.body.classList.toggle('winter',WIN);
}
function setSeason(w){WIN=w;try{localStorage.setItem('orbRunSeason',w?'winter':'summer')}catch(e){}applySeason()}
function setSnow(on){SNOW=on;try{localStorage.setItem('orbRunSnow',on?'1':'0')}catch(e){}applySeason()}
