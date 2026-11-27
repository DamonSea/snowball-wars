(()=>{const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
setFoeStyle('off');select('run',0);ci=2;showChar();confirmChar();__step(5);if(state==='paused')resume();
const shown=()=>$('k1').parentElement.style.display!=='none';
ok('Settings has Trick points, off by default',LOOK.trickpts&&LOOK.trickpts.opts.join()==='Off,On'&&LOOK.trickpts.get()===0);
ok('Free roam with points off: no score on the HUD',!shown());
addTrick('Backflip');addTrick('Side Flip');__step(2);ok('Tricks still register (for gaps and moves)',TR.names.includes('Backflip'));
ok('...but no combo meter or multiplier',!$('combo').classList.contains('on'));
__step(Math.ceil((T.combo.window+.5)*60));ok('...and nothing is banked',score===0&&!TR.mult,score);
const o=orbs[0];__place(o.g.position.x,o.g.position.z,o.y,0);__step(3);ok('Orbs collect without points',score===0&&!orbs.includes(o));
LOOK.trickpts.set(1);__step(2);ok('Turning it on shows the score',shown()&&localStorage.getItem('orbRunTrickPts')==='1');
addTrick('Backflip');addTrick('Side Flip');__step(2);ok('...and the combo meter with its multiplier',$('combo').classList.contains('on')&&$('cMult').textContent==='×2');
__step(Math.ceil((T.combo.window+.5)*60));ok('...and the combo banks into your score',score>0,score);
LOOK.trickpts.set(0);__step(2);ok('Off again: score cleared and hidden',score===0&&!shown());
beginTimed();__step(2);ok('A Collectathon still counts orbs on the HUD',!runFree&&shown()&&$('k1').textContent==='Orbs');stopOrbRun();__step(3);
startWars();__step(2);ok('Snowball Wars still shows KOs',shown()&&$('k1').textContent==='KOs');warsStop();__step(3);
ok('Back in free roam: hidden again',!shown());
return out.join('\n')})()
