(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);
const vil=RUNMAPS.findIndex(M=>M.name==='Christmas Village');
ok('Orb style list starts with Auto',LOOK.orbs.opts[0]==='Auto');
setOrbSkin('auto');ok('Auto is selected',LOOK.orbs.get()===0);
useRunMap(vil);startRun(true);__step(5);ok('Auto: Christmas Village uses stars',orbSkin()==='star'&&orbs.every(o=>!(o.m.geometry===orbGeo)));
useRunMap(0);startRun(true);__step(5);ok('Auto: Plaza keeps crystals',orbSkin()==='crystal'&&orbs.every(o=>o.m.geometry===orbGeo));
setOrbSkin('donut');useRunMap(vil);startRun(true);__step(5);ok('picking Donuts: donuts in the village too',orbSkin()==='donut');
setOrbSkin('crystal');ok('picking Crystal sticks (saved under the new key)',localStorage.getItem('orbRunOrbStyle')==='crystal'&&orbSkin()==='crystal');
setOrbSkin('auto');
// the giant tree has no star mesh any more (its top orb spot is the star)
let starMeshes=0;runL=RUNMAPS[vil];runL.grp.traverse(o=>{if(o.geometry&&o.geometry.type==='ExtrudeGeometry'&&o.position&&Math.abs(o.position.y-4.75)<.01)starMeshes++});ok('no star on top of the giant tree',starMeshes===0);
ok('an orb spot floats just above the tree top',runL.spots.some(s=>s.x===0&&s.z===-10&&s.y>9));
pause();ok('pause menu says Play',[...document.querySelectorAll('#ov .btns button')].some(b=>b.textContent==='Play'));
[...document.querySelectorAll('#ov button')].find(b=>b.textContent==='Play').click();__step(2);ok('...and opens a menu titled Play',$('ovT').textContent==='Play');
menu();return out.join('\n')})()
