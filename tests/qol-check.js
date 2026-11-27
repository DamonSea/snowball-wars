(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;
const calm=()=>{runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});SB.stun=0};__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
const btns=()=>[...document.querySelectorAll('#ov .btns button')].filter(b=>b.textContent&&getComputedStyle(b).display!=='none').map(b=>b.textContent);
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(5);
// hold R: back to the spawn point
__place(12,-4,0,0);__step(3);keys.KeyR=true;__step(20);const mid=$('holdMeter').classList.contains('on')&&/spawn point/.test($('holdLab').textContent);__step(50);keys.KeyR=false;__step(2);
ok('hold R shows a meter, then respawns at the spawn point',mid&&Math.hypot(P.position.x,P.position.z)<.5);
keys.KeyR=true;__step(20);keys.KeyR=false;__step(2);ok('a short tap does nothing',Math.hypot(P.position.x,P.position.z)<.5);
// orb run: start, pause has Restart / Stop, Stop keeps you where you are
__place(10,-3,0,0);__step(3);beginTimed();__step(200);ok('orb run running',!runFree&&runCD<=0);
pause();__step(2);const b1=btns();ok('pause during an orb run: '+b1.join(', '),b1.join('|')==='Resume|Restart Collectathon|Stop Collectathon|Change map|Edit character|Moves|Settings|Quit to menu');
resume();__place(9,-2,0,0);__step(3);pause();[...document.querySelectorAll('#ov button')].find(b=>b.textContent.startsWith('Stop Collectathon')).click();__step(3);
ok('Stop orb run: back to free roam, right where you were',runFree&&state==='play'&&Math.hypot(P.position.x-9,P.position.z+2)<.6);
// hold Enter during a run: fresh countdown in place
beginTimed();__step(200);__place(8,-1,0,0);__step(3);keys.Enter=true;__step(60);keys.Enter=false;__step(2);ok('hold Enter restarts the orb run in place',runCD>0&&!runFree&&Math.hypot(P.position.x-8,P.position.z+1)<.6);
// time runs out: no overlay, no teleport, back to free roam with a result line
__step(200);__place(7,-3,0,0);__step(3);time=.05;__step(5);ok('time up: keep playing where you were (no overlay)',state==='play'&&runFree&&$('ov').classList.contains('hide')&&Math.hypot(P.position.x-7,P.position.z+3)<.6);
ok('with the result shown',/Time.s up!.*orbs?\b/.test($('hint').textContent));
// out of lives: same
beginTimed();__step(200);__place(6,-3,0,0);__step(3);lives=0;endRun();__step(2);ok('out of lives: same, lives back to 3',state==='play'&&runFree&&lives===3&&Math.hypot(P.position.x-6,P.position.z+3)<.6);
// Moves list
pause();[...document.querySelectorAll('#ov button')].find(b=>b.textContent==='Moves').click();__step(2);ok('Moves opens a list of moves',!$('moves').classList.contains('hide')&&$('movesList').querySelectorAll('.mvc').length>=4);
dispatchEvent(new KeyboardEvent('keydown',{code:'Escape',bubbles:true}));__step(2);ok('Esc goes back to the pause menu',$('moves').classList.contains('hide')&&state==='paused'&&!$('ov').classList.contains('hide'));resume();
// free roam pause
pause();ok('free roam pause: '+btns().join(', '),btns().join('|')==='Resume|Play|Change map|Edit character|Moves|Settings|Quit to menu');resume();
// controller: L3 hold respawns
const gp={id:'DualSense',mapping:'standard',connected:true,timestamp:1,buttons:Array.from({length:18},()=>({pressed:false,value:0})),axes:[0,0,0,0]};navigator.getGamepads=()=>[gp];
__place(11,-4,0,0);__step(3);gp.buttons[10].pressed=true;gp.timestamp++;__step(70);gp.buttons[10].pressed=false;gp.timestamp++;__step(2);ok('hold L3 respawns on the controller',Math.hypot(P.position.x,P.position.z)<.5);
ok('controls card lists both holds',/Respawn/.test($('ctlList').textContent)&&/Restart the Collectathon/.test($('ctlList').textContent));
navigator.getGamepads=()=>[];
// flag race: hold R goes to the checkpoint
openBuilder(blankMap());BLD.map.opt={enemies:0,orbs:0,flags:1};BLD.map.items.push({t:'checkpoint',x:6,z:0},{t:'finish',x:-8,z:-8});changed();testBuilder();__step(5);
__place(6,0,0,0);__step(4);__place(15,10,0,0);__step(3);keys.KeyR=true;__step(70);keys.KeyR=false;__step(2);ok('flag race: hold R goes back to the last checkpoint',Math.hypot(P.position.x-6,P.position.z)<.5);
const t1=FR.t;keys.Enter=true;__step(60);keys.Enter=false;__step(2);ok('hold Enter restarts the race',FR.t<t1&&Math.hypot(P.position.x-BLD.map.items.find(i=>i.t==='spawn').x,P.position.z-BLD.map.items.find(i=>i.t==='spawn').z)<1);
pause();backToBuilder();__step(2);exitBuilder();
// Adventure is gone: the main menu offers Trick Park and the Map Builder
menu();ok('No Adventure anywhere on the main menu',![...document.querySelectorAll('#ov .btns button')].some(b=>/Adventure/.test(b.textContent))&&typeof startAdv==='undefined');
menu();__step=_st;return out.join('\n')})()
