(()=>{const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
menu();__step(2);openBuilder(blankMap());__step(2);
// tabs and search
ok('Library has tabs for every group',['Structures','Play','Objectives','Nature','Village','City'].every(c=>document.querySelector(`#bLib [data-tab="${c}"]`)));
document.querySelector('#bLib [data-tab="Village"]').click();ok('Village tab lists the village pieces',['cane','xtree','gift','stall','cottage','bauble'].every(k=>document.querySelector(`#bLib [data-tool="${k}"]`))&&!document.querySelector('#bLib [data-tool="block"]'));
document.querySelector('#bLib [data-tab="City"]').click();ok('City tab has skyscraper, flagpole, lamp',['sky','flag','lamp'].every(k=>document.querySelector(`#bLib [data-tool="${k}"]`)));
const f=$('bFind');f.value='cane';f.dispatchEvent(new Event('input',{bubbles:true}));ok('Search finds across tabs',!!document.querySelector('#bLib [data-tool="cane"]')&&!document.querySelector('#bLib [data-tool="sky"]'));
BLD.q='';renderLib();ok('Every asset has a picture slot',Object.keys(ASSETS).every(k=>{BLD.tab=ASSETS[k].cat;renderLib();return document.querySelector(`#bLib [data-tool="${k}"] .bTh`)}));
// placing the new pieces
const P0=BLD.map.items.length;const at={};[['sky',-14,-14],['flag',6,-12],['cane',-6,4],['xtree',10,10],['gift',0,-4],['stall',8,0],['cottage',-14,8],['bauble',4,8]].forEach(([t,x,z])=>at[t]=placeAt(t,x,z));
ok('All 8 new pieces placed',BLD.map.items.length===P0+8);
const pl=BLD.prev.plats,ac=BLD.prev.advCol;
ok('Skyscraper: solid, roof at its height',pl.some(p=>p.k==='b'&&Math.abs(p.x+14)<.01&&Math.abs(p.top-12)<.01));
ok('Flagpole and candy cane are climbable poles',ac.some(c=>c.pole&&c.x===6&&c.z===-12)&&ac.some(c=>c.pole&&c.x===-6&&c.z===4));
ok('Christmas tree is climbable',ac.some(c=>c.tree&&!c.pole&&c.x===10&&c.z===10));
ok('Gift box is solid',pl.some(p=>p.x===0&&p.z===-4&&Math.abs(p.top-1.2)<.01));
ok('Market stall awning is bouncy',pl.some(p=>p.bounce&&p.x===8&&p.z===0&&p.bvy===T.bounce.awning));
ok('Cottage roof slopes are walkable',pl.filter(p=>p.ramp&&Math.abs(p.x+14)<.01).length===2);
ok('Bauble is solid',ac.some(c=>c.x===4&&c.z===8&&c.top>1));
ok('Flag waves are there',BLD.prev.waves.length===1&&BLD.prev.waves[0].strips.length===8);
const s0=BLD.prev.waves[0].strips[7].position.z;__step(10);ok('...and they move',BLD.prev.waves[0].strips[7].position.z!==s0);
BLD.sel=at.flag;const d0=BLD.map.items[at.flag].dir;rotSel();ok('Rotate turns the flag’s wind',BLD.map.items[at.flag].dir===(d0+1)%4);
BLD.sel=at.sky;setField('f',3);ok('Skyscraper facade can change',BLD.map.items[at.sky].f===3);renderInsp();ok('Inspector shows facade swatches',$('bInsp').querySelectorAll('[data-f]').length===5);
// saved maps keep them
const m2=cleanMap(JSON.parse(JSON.stringify(BLD.map)));ok('New pieces survive saving',['sky','flag','cane','xtree','gift','stall','cottage','bauble'].every(t=>m2.items.some(i=>i.t===t)));
// camera views
setView('top');__step(40);const topY=cam.position.y;ok('Top view looks straight down',Math.hypot(cam.position.x-BLD.cs.x,cam.position.z-BLD.cs.z)<topY*.1,topY.toFixed(1));
setView('low');__step(40);ok('Low view is near the ground',cam.position.y<topY*.5,cam.position.y.toFixed(1));
const y0=BLD.cam.yaw;turnView(1);ok('Q/E turn the view',Math.abs(BLD.cam.yaw-y0-PI/4)<1e-6);
setView('angle');BLD.sel=at.sky;focusSel();ok('Focus moves to the selection',BLD.cam.x===-14&&BLD.cam.z===-14);
ok('View bar shows the views',$('bView').querySelectorAll('[data-view]').length===3&&!!$('bView').querySelector('.on'));
// the ghost follows the chosen tool
pickTool('stall');BLD.cursor={x:3,z:3};__step(2);ok('A see-through ghost of the asset follows the pointer',BLD.ghost&&BLD.ghost.t==='stall'&&BLD.ghost.g.visible&&BLD.ghost.g.position.x===3);
pickTool('select');__step(2);ok('...and goes away with Select',!BLD.ghost);
// play it: waves and the awning work in the game too
testBuilder();__step(5);ok('Flags wave in the test run',runL.waves&&runL.waves.length===1);
const st=runL.plats.find(p=>p.bounce&&p.bvy);ok('Stall is bouncy in play',!!st);
return out.join('\n')})()
