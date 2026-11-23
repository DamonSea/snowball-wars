(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);
const btns=()=>[...document.querySelectorAll('#ov .btns button')].filter(b=>b.textContent&&getComputedStyle(b).display!=='none').map(b=>b.textContent.replace(/[○✕]/g,'').trim());
const click=t=>[...document.querySelectorAll('#ov button')].find(b=>b.textContent.replace(/[○✕]/g,'').trim()===t).click();
menu();pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();__step(10);
// pause menu: modes moved into Games
pause();ok('free roam pause: '+btns().join(', '),btns().join('|')==='Resume|Play|Change map|Moves|Settings|Quit to menu');
click('Play');__step(2);ok('Play: '+btns().join(', '),$('ovT').textContent==='Play'&&btns().join('|')==='Collectathon|Snowball Wars|Tag|Back'&&/Collectathon/.test($('ovP').textContent));
click('Back');__step(2);ok('Back returns to the pause menu',state==='paused'&&btns()[1]==='Play');
click('Play');__step(2);press('pause');__step(2);ok('Esc / Options on Play goes back, not straight to the game',state==='paused'&&btns()[1]==='Play');
press('pause');__step(2);ok('...and again closes the pause menu',state==='play');
pause();click('Play');__step(2);click('Tag');__step(3);ok('starting a mode from Play works',TAG.on&&state==='play');pause();click('End tag');__step(3);
// Moves: pages of cards
pause();click('Moves');__step(2);ok('title reads "Flip’s Moves"',$('movesT').textContent==='Flip’s Moves');
ok('first page: Basics, 1 of 6, with cards',$('mvCat').textContent==='Basics'&&$('mvOf').textContent==='1 of 6'&&$('movesList').querySelectorAll('.mvc').length>=4);
dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowRight',bubbles:true}));__step(1);ok('→ flips to Big Jumps',$('mvCat').textContent==='Big Jumps'&&/Long jump/.test($('movesList').textContent));
dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowLeft',bubbles:true}));dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowLeft',bubbles:true}));__step(1);ok('← wraps round to Game',$('mvCat').textContent==='Game');
[...document.querySelectorAll('.mvtab')].find(t=>t.textContent==='In the Air').click();__step(1);ok('tabs jump straight to a page',$('mvCat').textContent==='In the Air'&&/Dive/.test($('movesList').textContent));
const gp={id:'DualSense',mapping:'standard',connected:true,timestamp:1,buttons:Array.from({length:18},()=>({pressed:false,value:0})),axes:[0,0,0,0]};navigator.getGamepads=()=>[gp];__step(3);
gp.buttons[5].pressed=true;gp.timestamp++;__step(2);gp.buttons[5].pressed=false;gp.timestamp++;__step(2);ok('R1 flips pages on the controller',$('mvCat').textContent==='Snowballs & Fighting');
ok('controller buttons shown on the cards',/ps/.test($('movesList').innerHTML));
gp.buttons[1].pressed=true;gp.timestamp++;__step(2);gp.buttons[1].pressed=false;gp.timestamp++;__step(2);ok('○ goes back to the pause menu',!movesOpen&&state==='paused');
navigator.getGamepads=()=>[];resume();__step(2);
// Nova's page title
menu();pickMode='run';pickLevel=0;ci=3;showChar();confirmChar();__step(5);pause();click('Moves');__step(1);ok('Nova’s Moves',$('movesT').textContent==='Nova’s Moves');closeMoves();resume();
// dive into a tree or pole to grab it
const pole=runL.advCol.find(c=>c.pole&&c.y===0&&c.top>3);
__place(pole.x,pole.z+6,0,Math.PI);__step(3);__k({KeyW:true});__step(20);keys.Space=true;jumpBuf=.15;__step(8);keys.Space=false;keys.ShiftLeft=true;__step(2);keys.ShiftLeft=false;
const dv=A.mode==='dive';let got=false;for(let i=0;i<60;i++){__step(1);if(CL.on){got=true;break}}__k({});
ok('diving into a pole grabs it (was diving: '+dv+')',dv&&got&&CL.tree===pole&&TR.names.includes('Dive Grab'));
__step(5);keys.Space=false;__step(60);
menu();return out.join('\n')})()
