(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const calm=()=>{runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0})};__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const btns=()=>[...document.querySelectorAll('#ov .btns button')].filter(b=>b.textContent&&getComputedStyle(b).display!=='none').map(b=>b.textContent);
const click=t=>[...document.querySelectorAll('#ov button')].find(b=>b.textContent===t).click();
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(10);
const sp=runL.spad;ok('built-in maps hide the PLAY pad (for now)',!spadG.visible&&!spadG.parent);__place(0,5,0,0);__step(60);ok('...so standing where it was does nothing',state==='play');
press('start');__step(2);ok('Enter / △ opens the mode menu',state==='paused'&&$('ovT').textContent==='Choose a mode');
ok('choices: '+btns().join(', '),btns().join('|')==='Collectathon|Snowball Wars|Tag|Cancel');
ok('it explains both modes',/Collectathon · how many orbs/.test($('ovP').textContent)&&/Snowball Wars · 3-minute/.test($('ovP').textContent));
click('Cancel');__step(60);ok('Cancel: back to playing',state==='play'&&runFree&&!WAR.on);
press('start');__step(2);ok('and it opens again',state==='paused'&&$('ovT').textContent==='Choose a mode');
click('Collectathon');__step(5);ok('Collectathon starts the timed run',!runFree&&runCD>0&&state==='play');
stopOrbRun();__step(5);press('start');__step(2);
click('Snowball Wars');__step(5);ok('Snowball Wars starts a match',WAR.on&&state==='play');
pause();[...document.querySelectorAll('#ov button')].find(b=>b.textContent==='End match').click();__step(5);
// the button / key does the same
__place(sp.x+6,sp.z+2,0,0);__step(5);press('start');__step(2);ok('△ / Enter opens the same menu',state==='paused'&&$('ovT').textContent==='Choose a mode');
press('pause');__step(2);ok('Esc / Options / ○ cancels',state==='play');
// pause menu uses the mode names
pause();ok('free roam pause: '+btns().join(', '),btns().join('|')==='Resume|Play|Change map|Edit character|Moves|Settings|Quit to menu');resume();
ok('controls card: choose a mode, no PLAY pad mentioned on a map without one',!/PLAY pad/.test($('ctlList').textContent)&&/Choose a mode/.test($('ctlList').textContent));
// on a map without a PLAY pad, the button goes straight to Snowball Wars
openBuilder(blankMap());BLD.map.opt={enemies:1,orbs:0,flags:0};changed();testBuilder();__step(5);press('start');__step(2);ok('no PLAY pad: the menu offers Snowball Wars and Tag',state==='paused'&&btns().join('|')==='Snowball Wars|Tag|Cancel');click('Tag');__step(3);ok('...and Tag starts',TAG.on);
pause();backToBuilder();__step(2);exitBuilder();
menu();__step=_st;return out.join('\n')})()
