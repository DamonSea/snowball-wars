(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const calm=()=>{runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});SB.stun=0};__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const bm=blankMap();ok('new maps get a Spawn point and a START pad, separately',bm.items.some(i=>i.t==='spawn')&&bm.items.some(i=>i.t==='start')&&bm.opt.enemies===1&&bm.opt.orbs===1&&bm.opt.flags===0);
const old=cleanMap({id:'abcdef12',name:'Old map',items:[{t:'start',x:0,z:12},{t:'block',x:5,z:5,w:2,d:2,h:2,c:0}]});const sp=old.items.find(i=>i.t==='spawn');
ok('older maps get a spawn point just in front of their START pad ('+sp.x+','+sp.z+')',sp&&sp.z===9&&old.opt.orbs===1&&old.opt.enemies===1);
ok('only one spawn / START / finish kept',cleanMap({items:[{t:'spawn',x:1,z:1},{t:'spawn',x:2,z:2},{t:'finish',x:0,z:0},{t:'finish',x:3,z:3},{t:'checkpoint',x:4,z:4},{t:'checkpoint',x:5,z:5}]}).items.filter(i=>i.t==='spawn'||i.t==='finish').length===2);
ok('settings sanitized',JSON.stringify(cleanMap({opt:{enemies:'no',orbs:0,flags:5,evil:1}}).opt)==='{"enemies":1,"orbs":0,"flags":1}');
menu();__step(2);openBuilder(blankMap());__step(2);
BLD.sel=BLD.map.items.findIndex(i=>i.t==='spawn');delSel();ok('the Spawn point cannot be deleted',BLD.map.items.some(i=>i.t==='spawn'));
BLD.sel=BLD.map.items.findIndex(i=>i.t==='start');delSel();ok('the START pad can be deleted now',!BLD.map.items.some(i=>i.t==='start'));undo();
BLD.sel=-1;renderInsp();ok('Map settings show in the inspector',document.querySelectorAll('#bInsp [data-opt]').length===3);
document.querySelector('#bInsp [data-opt="flags"]').click();ok('toggle Flag race on (with an undo step)',BLD.map.opt.flags===1&&BLD.undo.length>0);
ok('warns when there is no Finish flag',/add a Finish flag/.test($('bInsp').textContent));
// a race course: spawn, a raised checkpoint on a block, the finish further on
BLD.map.items.push({t:'block',x:0,z:4,w:3,d:3,h:1.2,c:1},{t:'checkpoint',x:0,z:4},{t:'checkpoint',x:6,z:-4},{t:'finish',x:-6,z:-10});document.querySelector('#bInsp [data-opt="enemies"]').click();changed();
ok('enemies toggled off',BLD.map.opt.enemies===0);ok('checkpoint sits on top of the block',Math.abs(BLD.prev.cps[0].y-1.2)<1e-6&&BLD.prev.finish);
testBuilder();__step(30);ok('spawns at the Spawn point, not the START pad ('+P.position.x.toFixed(1)+','+P.position.z.toFixed(1)+')',Math.hypot(P.position.x-0,P.position.z-16)<1.5);
ok('flag race running',FR.on&&!FR.done&&FR.t>0);ok('no enemies on the map',runHz.length===0);
__step(120);ok('still no enemies later',runHz.length===0);
ok('START pad still there for the orb run',!!runL.spad&&spadG.visible);
const t0=FR.t;__place(0,4,1.2,0);__step(5);ok('touching a checkpoint turns it green and saves the spot',runL.cps[0].on&&FR.cp.z===4&&FR.reached===1);
__place(10,10,0,0);__step(3);lives=1;invuln=0;hurt(10,10.5,5);__step(2);if(lives<=0)frRespawn('x');ok('out of lives: back at the checkpoint with lives refilled',Math.hypot(P.position.x,P.position.z-4)<.5&&Math.abs(py-1.2)<.3&&lives===3);
__place(20,0,0,0);__step(3);pause();__step(2);const btn=[...document.querySelectorAll('#ov button')].find(b=>b.textContent==='Last checkpoint');ok('pause menu offers Last checkpoint',!!btn);btn.click();__step(3);ok('which takes you back',state==='play'&&Math.hypot(P.position.x,P.position.z-4)<.5);
__place(-6,-10,0,0);__step(3);ok('reaching the Finish flag finishes the race',FR.done&&state==='over'&&$('ovT')?.textContent!==undefined);
ok('best time saved',raceBest()>0);ok('Finished! screen',[...document.querySelectorAll('#ov button')].some(b=>b.textContent==='Race again'));
[...document.querySelectorAll('#ov button')].find(b=>b.textContent==='Keep exploring').click();__step(3);ok('Keep exploring: back to play, clock stopped',state==='play'&&FR.done);
// orb run off: no START pad, Enter does nothing, pause has no orb run
pause();backToBuilder();__step(2);BLD.map.opt.orbs=0;changed();testBuilder();__step(5);ok('orb run off: no START pad',!runL.spad&&!spadG.visible);beginTimed();ok('and no timed run',runFree);
pause();ok('pause offers Restart race instead of Start orb run',[...document.querySelectorAll('#ov button')].some(b=>b.textContent==='Restart race')&&![...document.querySelectorAll('#ov button')].some(b=>b.textContent==='Start orb run'));
// flags off: no race
backToBuilder();__step(2);BLD.map.opt.flags=0;BLD.map.opt.enemies=1;changed();testBuilder();__step(30);ok('flag race off: no race clock',!FR.on&&$('v2').textContent==='Free');ok('enemies back on',runHz.length>0);
pause();backToBuilder();__step(2);exitBuilder();
// built-in maps unchanged
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(5);ok('Frosty Falls: no race, START pad as before',!FR.on&&!!runL.spad&&spadG.visible);
__step=_st;return out.join('\n')})()
