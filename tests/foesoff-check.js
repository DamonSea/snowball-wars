(()=>{const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
select('run',0);ci=2;showChar();confirmChar();__step(3);if(state==='paused')resume();__step(120);
ok('Enemies are on by default',runHz.length>0,runHz.length);
ok('Settings has Enemies: Winter crew / Spikeballs / Off',LOOK.foes.opts.join()==='Winter crew,Spikeballs,Off');
LOOK.foes.set(2);__step(2);ok('Off clears them right away',runHz.length===0&&FOE_STYLE==='off');
__step(600);ok('...and none come back while you play',runHz.length===0);
ok('Off is saved',localStorage.getItem('orbRunFoes')==='off');ok('Settings shows Off',LOOK.foes.get()===2);
beginTimed();__step(260);ok('A timed run has no enemies either',runHz.length===0&&state==='play',state);
LOOK.foes.set(0);__step(120);ok('Turning them back on brings the Winter Crew back',runHz.length>0&&runHz.every(h=>h.kind!=='spike'),runHz.length);
LOOK.foes.set(1);__step(5);ok('Spikeballs still work',runHz.length>0&&runHz.every(h=>h.kind==='spike'));
LOOK.foes.set(0);return out.join('\n')})()
