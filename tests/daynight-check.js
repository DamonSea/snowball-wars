(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
select('run',0);ci=2;showChar();confirmChar();__step(3);if(state==='paused')resume();
openSet();setTabTo('game');ok('Settings has Time of day: Always day / Always night / Day & night',(()=>{const r=[...document.querySelectorAll('#setList .srow')].find(r=>r.textContent.includes('Time of day'));return!!r&&r.textContent.includes('Always day')&&r.textContent.includes('Always night')&&r.textContent.includes('Day & night')})());
closeSet();if(state==='paused')resume();
setTimeOfDay('day');__step(120);const dayBg=scene.background.getHex();ok('Always day: bright sky, no stars or moon',DN.amt>.99&&!skyG.visible&&dayBg===(WIN?0xaec4d6:0x123f57));
setTimeOfDay('night');__step(5);ok('Switching fades rather than snapping',DN.amt>.05&&DN.amt<.95,DN.amt.toFixed(2));
__step(200);ok('Always night: dark sky, moonlight, stars and moon out',DN.amt<.01&&scene.background.getHex()===0x0b1532&&skyG.visible&&STARS.every(s=>s.m.opacity>0)&&moonG.halo.material.opacity>.4&&sun.intensity<.5);
ok('Night stays playable (ambient light kept up)',hemi.intensity>=.5);
const o0=STARS.map(s=>s.m.opacity.toFixed(3)).join();__step(20);ok('Stars twinkle',STARS.map(s=>s.m.opacity.toFixed(3)).join()!==o0);
ok('Moonlight casts the shadows at night',!!DN.light&&sun.position.y>=14);
ok('Saved',localStorage.getItem('orbRunTime')==='night');
setTimeOfDay('cycle');DN.p=.25;__step(200);ok('Cycle at noon: day',DN.amt>.99);
DN.p=.75;__step(160);ok('Cycle at midnight: night',DN.amt<.01&&skyG.visible);
const p0=DN.p;__step(60);ok('The cycle moves on while you play',DN.p>p0,(DN.p-p0).toFixed(4));
pause();const p1=DN.p;__step(60);ok('...and holds while paused',DN.p===p1);resume();
DN.p=.53;__step(80);ok('Dusk warms the sky',((scene.background.getHex()>>16)&255)>((scene.background.getHex())&255),scene.background.getHex().toString(16));
setSeason(false);__step(5);setTimeOfDay('day');__step(200);ok('Summer days keep their own sky',scene.background.getHex()===0x123f57);setSeason(true);
setTimeOfDay('day');__step(60);
return out.join('\n')})()
