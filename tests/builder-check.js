(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);
menu();__step(2);openMapsPanel();ok('More maps panel opens',!$('maps').classList.contains('hide'));
$('mNew').click();__step(2);ok('builder opens in build state',state==='build'&&document.body.classList.contains('building'));
ok('blank map has a Spawn point and a START pad',BLD.map.items.some(i=>i.t==='start')&&BLD.map.items.some(i=>i.t==='spawn'));
const n0=BLD.map.items.length;
const iBlock=placeAt('block',4.2,-3.1);const blk=BLD.map.items[iBlock];ok('block placed + snapped',blk&&blk.x===4&&blk.z===-3);
placeAt('pad',-4,2);placeAt('tree',8,6);placeAt('pole',-8,-6);placeAt('deck',0,-8);placeAt('bars',6,-8);placeAt('stairs',-6,-8);placeAt('roller',2,6);placeAt('snowman',-2,8);placeAt('orb',0,4);placeAt('ice',10,0);placeAt('wall',-10,0);placeAt('tires',10,8);placeAt('lamp',-10,8);placeAt('rock',12,-10);
ok('15 items added',BLD.map.items.length===n0+15);
ok('preview has plats',BLD.prev&&BLD.prev.plats.length>5);
ok('preview has bounce pad',BLD.prev.plats.some(p=>p.bounce));ok('preview has climbables',BLD.prev.advCol.some(c=>c.tree||c.pole));
undo();ok('undo removes last',BLD.map.items.length===n0+14);redo();ok('redo restores',BLD.map.items.length===n0+15);
BLD.sel=iBlock;setField('h',3);ok('height edit',BLD.map.items[iBlock].h===3&&BLD.prev.plats.some(p=>Math.abs(p.top-3)<.01));
const w0=BLD.map.items[iBlock].w,d0=BLD.map.items[iBlock].d;BLD.map.items[iBlock].w=4;BLD.map.items[iBlock].d=2;changed();rotSel();ok('rotate swaps w/d',BLD.map.items[iBlock].w===2&&BLD.map.items[iBlock].d===4);
dupSel();ok('duplicate',BLD.map.items.length===n0+16);delSel();ok('delete',BLD.map.items.length===n0+15);
BLD.sel=BLD.map.items.findIndex(i=>i.t==='spawn');delSel();ok('Spawn point cannot be deleted',BLD.map.items.some(i=>i.t==='spawn'));
placeAt('start',3,3);ok('START stays unique',BLD.map.items.filter(i=>i.t==='start').length===1);
$('bName').value='Damon Park';$('bName').dispatchEvent(new Event('input'));saveDraftNow();ok('draft saved',loadDrafts()[BLD.map.id]&&loadDrafts()[BLD.map.id].name==='Damon Park');
// test play
testBuilder();__step(5);ok('test play runs the custom map',state==='play'&&runL.custom&&runL.key==='cm_'+BLD.map.id);
{const s=BLD.map.items.find(i=>i.t==='spawn');ok('player at the Spawn point',Math.hypot(P.position.x-s.x,P.position.z-s.z)<1.5)}
// stand on the block (top 3)
const b=itemBox(BLD.map.items[iBlock]);__place(b.x,b.z,b.top+.5,0);__step(30);ok('can stand on block top '+b.top+' (py '+py.toFixed(2)+')',Math.abs(py-b.top)<.05);
// bounce pad
const pd=BLD.map.items.find(i=>i.t==='pad');__place(pd.x,pd.z,2,0);let maxVy=0;for(let i=0;i<60;i++){__step(1);maxVy=Math.max(maxVy,vy)}ok('trampoline bounces (vy '+maxVy.toFixed(1)+')',maxVy>12);
invuln=0;pause();__step(1);ok('pause shows Back to builder',[...document.querySelectorAll('#ov button')].some(x=>x.textContent==='Back to builder'));
backToBuilder();__step(2);ok('back in builder, map intact',state==='build'&&BLD.map.name==='Damon Park'&&BLD.map.items.length===n0+15);
ok('other maps hidden while building',RUNMAPS.every(M=>!M.grp.visible));
// safety
const evil=cleanMap({id:'../../x',name:'<img src=x onerror=alert(1)>'+'a'.repeat(80),items:[...Array(900)].map((_,i)=>({t:i%3?'block':'nope',x:1e9,z:-1e9,w:-5,h:'9e9',c:99})).concat([{t:'start',x:0,z:0},{t:'start',x:5,z:5}])});
ok('cleanMap: id regenerated',/^[a-z0-9]{6,24}$/.test(evil.id));ok('cleanMap: name stripped & capped',!/[<>]/.test(evil.name)&&evil.name.length<=32);
ok('cleanMap: item cap',evil.items.length<=MAP_LIMIT);ok('cleanMap: unknown types dropped',evil.items.every(i=>ASSETS[i.t]));
ok('cleanMap: coords clamped',evil.items.every(i=>Math.abs(i.x)<=MAP_R&&Math.abs(i.z)<=MAP_R));ok('cleanMap: at most one START, exactly one spawn',evil.items.filter(i=>i.t==='start').length<=1&&evil.items.filter(i=>i.t==='spawn').length===1);
ok('cleanMap: fields clamped',evil.items.filter(i=>i.t==='block').every(i=>i.w>=FIELDS.w[1]&&i.h<=FIELDS.h[2]&&i.c<PALETTE.length));
ok('cleanMap: garbage input',cleanMap(null).items.length>=1&&cleanMap('x').items.length>=1);
// panel lists draft, play from panel
exitBuilder();__step(1);ok('exit returns to panel with draft listed',$('mapsList').textContent.includes('Damon Park'));
const pb=[...document.querySelectorAll('#mapsList [data-a="play"]')][0];pb.click();__step(3);ok('Play from panel opens character select / play',state==='select'||state==='play');
ok('best list excludes customs',!$('best').textContent.includes('Damon'));
menu();__step(2);ok('menu has Map Builder button',$('alt').textContent==='Map Builder');
return out.join('\n')})()
