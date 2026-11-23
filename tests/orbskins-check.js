(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const calm=()=>{runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});SB.stun=0};__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
setOrbSkin('crystal');menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(10);
ok('default is the original crystal',ORB_SKIN==='crystal'&&orbs.length>0&&orbs.every(o=>o.m.geometry===orbGeo));
openSet();setTabTo('game');const row=[...document.querySelectorAll('#setList *')].find(e=>/^Orb style/.test(e.textContent||''));ok('Settings > Game has an Orb style row',!!row);
ok('with 6 choices',LOOK.orbs.opts.join(',')==='Crystal,Donuts,Stars,Snowflakes,Presents,Coins');
LOOK.orbs.set(1);closeSet();if(state==='paused')resume();__step(3);
ok('switching restyles the orbs already out (donuts)',ORB_SKIN==='donut'&&orbs.every(o=>o.m instanceof THREE.Group&&o.m.parent===o.g));
ok('ring colour follows the style',orbs.every(o=>o.ring.material.color.getHex()===orbCol(o.gold)));
ok('saved for next time',localStorage.getItem('orbRunOrbSkin')==='donut');
for(const s of ORB_SKINS){setOrbSkin(s.id);__step(2);for(const g of[false,true]){const b=orbBody(g);ok(`${s.name}${g?' (gold)':''} builds`,!!b)}}
// collecting works with a style on
setOrbSkin('star');beginTimed();__step(200);const sc=score,o=orbs[0];__place(o.g.position.x,o.g.position.z,0,0);__step(4);ok('collecting a star orb scores',score>sc);
// shared pieces survive orbs being collected (not freed)
const kit=SKIN_CACHE.star;ok('shared star mesh is kept, not freed',kit&&kit.geos.every(g=>KEEP.has(g)));
// flat styles spin flat
const o2=orbs[0];__step(30);ok('stars spin upright (no tumbling)',Math.abs(o2.m.rotation.x)<1e-6);
setOrbSkin('crystal');__step(30);ok('crystal still tumbles',Math.abs(orbs[0].m.rotation.x)>.01);
// multiplayer mirror path builds styled orbs too
setOrbSkin('gift');makeOrb({x:3,y:0,z:3,v:100,rand:1},true,'zz9');const mo=orbs.find(q=>q.id==='zz9');ok('orbs mirrored from a host use your style',mo&&mo.m instanceof THREE.Group);
setOrbSkin('crystal');menu();__step=_st;return out.join('\n')})()
