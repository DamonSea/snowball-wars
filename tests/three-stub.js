// Minimal stand-in for three.js r128, for headless tests only. Real vector math, no rendering.
(function(){
class Vector3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}
  set(x,y,z){this.x=x;this.y=y;this.z=z;return this}setScalar(s){this.x=this.y=this.z=s;return this}
  copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this}clone(){return new Vector3(this.x,this.y,this.z)}
  add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this}sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this}
  addScaledVector(v,s){this.x+=v.x*s;this.y+=v.y*s;this.z+=v.z*s;return this}multiplyScalar(s){this.x*=s;this.y*=s;this.z*=s;return this}
  lerp(v,a){this.x+=(v.x-this.x)*a;this.y+=(v.y-this.y)*a;this.z+=(v.z-this.z)*a;return this}
  length(){return Math.hypot(this.x,this.y,this.z)}distanceTo(v){return Math.hypot(this.x-v.x,this.y-v.y,this.z-v.z)}}
class Vector2{constructor(x=0,y=0){this.x=x;this.y=y}set(x,y){this.x=x;this.y=y;return this}copy(v){this.x=v.x;this.y=v.y;return this}clone(){return new Vector2(this.x,this.y)}}
class Euler{constructor(){this.x=0;this.y=0;this.z=0;this.order='XYZ'}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}}
class Quaternion{setFromUnitVectors(){return this}}
class Color{constructor(c=0xffffff){this.setHex(typeof c==='number'?c:0xffffff)}
  setHex(h){this.h=h;return this}getHex(){return this.h}multiplyScalar(s){const r=Math.min(255,((this.h>>16)&255)*s)|0,g=Math.min(255,((this.h>>8)&255)*s)|0,b=Math.min(255,(this.h&255)*s)|0;this.h=(r<<16)|(g<<8)|b;return this}
  clone(){return new Color(this.h)}copy(c){this.h=c.h;return this}
  lerp(c,t){const m=(sh)=>{const a=(this.h>>sh)&255,b=(c.h>>sh)&255;return Math.round(a+(b-a)*t)&255};this.h=(m(16)<<16)|(m(8)<<8)|m(0);return this}}
let objCount=0;
class Object3D{constructor(){objCount++;this.position=new Vector3();this.rotation=new Euler();this.scale=new Vector3(1,1,1);this.quaternion=new Quaternion();
  this.children=[];this.parent=null;this.visible=true;this.castShadow=false;this.receiveShadow=false;this.frustumCulled=true;this.renderOrder=0}
  add(...os){for(const o of os){if(o.parent)o.parent.remove(o);o.parent=this;this.children.push(o)}return this}
  remove(...os){for(const o of os){const i=this.children.indexOf(o);if(i>=0){this.children.splice(i,1);o.parent=null}}return this}
  rotateOnWorldAxis(axis,a){this.rotation.x+=a*axis.x;this.rotation.z+=a*axis.z;return this}
  getWorldPosition(t){t.copy(this.position);let p=this.parent;while(p){t.add(p.position);p=p.parent}return t}
  lookAt(){}traverse(f){f(this);this.children.forEach(c=>c.traverse(f))}updateMatrixWorld(){}}
class Group extends Object3D{}
class Scene extends Object3D{constructor(){super();this.background=null;this.fog=null}}
class Mesh extends Object3D{constructor(g,m){super();this.geometry=g;this.material=m}}
class Sprite extends Object3D{constructor(m){super();this.material=m}}
class Points extends Object3D{constructor(g,m){super();this.geometry=g;this.material=m}}
class Light extends Object3D{constructor(c,i=1){super();this.color=new Color(c);this.intensity=i;this.target=new Object3D();this.shadow={mapSize:new Vector2(),camera:{}}}}
class HemisphereLight extends Light{constructor(s,g,i){super(s,i);this.groundColor=new Color(g)}}
class DirectionalLight extends Light{}
class PointLight extends Light{constructor(c,i,d){super(c,i);this.distance=d}}
class PerspectiveCamera extends Object3D{constructor(fov,aspect,near,far){super();Object.assign(this,{fov,aspect,near,far})}updateProjectionMatrix(){}}
class Geometry{constructor(...a){this.parameters=a;this.type=this.constructor.name;this.attributes={}}setAttribute(n,a){this.attributes[n]=a;return this}translate(){return this}computeVertexNormals(){}}
class Shape{constructor(){this.pts=[]}moveTo(x,y){this.pts.push([x,y]);return this}lineTo(x,y){this.pts.push([x,y]);return this}}
const geos={};['BoxGeometry','CylinderGeometry','SphereGeometry','ConeGeometry','RingGeometry','TorusGeometry','PlaneGeometry','OctahedronGeometry','IcosahedronGeometry','DodecahedronGeometry','CircleGeometry','BufferGeometry','ExtrudeGeometry'].forEach(n=>{geos[n]=class extends Geometry{};Object.defineProperty(geos[n],'name',{value:n})});
class BufferAttribute{constructor(a,s){this.array=a;this.itemSize=s;this.needsUpdate=false}}
class Material{constructor(p={}){this._p=p;Object.assign(this,p);this.color=new Color(p.color??0xffffff);this.emissive=new Color(p.emissive??0);if(this.opacity===undefined)this.opacity=1}
  clone(){const m=new this.constructor(this._p);m.color=this.color.clone();m.emissive=this.emissive.clone();for(const k of['opacity','transparent','flatShading','metalness','roughness','emissiveIntensity','map','emissiveMap'])if(k in this)m[k]=this[k];return m}}
class MeshStandardMaterial extends Material{}class MeshBasicMaterial extends Material{}class SpriteMaterial extends Material{}class PointsMaterial extends Material{}
class Texture{constructor(img){this.image=img;this.repeat=new Vector2(1,1);this.wrapS=this.wrapT=0;this.needsUpdate=false}clone(){const t=new Texture(this.image);t.repeat.copy(this.repeat);return t}}
class CanvasTexture extends Texture{}
class Fog{constructor(c,n,f){this.color=new Color(c);this.near=n;this.far=f}}
class Clock{getDelta(){return window.__fixedDt||1/60}}
class WebGLRenderer{constructor(){this.domElement=document.createElement('canvas');this.shadowMap={};this.frames=0}setPixelRatio(){}setSize(){}render(){this.frames++;window.__frames=this.frames}}
window.THREE=Object.assign({Shape,Vector3,Vector2,Euler,Quaternion,Color,Object3D,Group,Scene,Mesh,Sprite,Points,HemisphereLight,DirectionalLight,PointLight,PerspectiveCamera,
  BufferAttribute,MeshStandardMaterial,MeshBasicMaterial,SpriteMaterial,PointsMaterial,Texture,CanvasTexture,Fog,Clock,WebGLRenderer,
  DoubleSide:2,AdditiveBlending:2,RepeatWrapping:1000,PCFSoftShadowMap:2,NearestFilter:1003},geos);
window.__objCount=()=>objCount;
})();
