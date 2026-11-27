(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x?' -> '+x:''));
const btns=()=>['go','alt','alt2','alt3','alt4','alt5','alt6','alt7'].map($).filter(e=>e&&e.textContent).map(e=>e.textContent.replace(/[✕○△□]/g,'').trim());
const click=t=>{const b=['go','alt','alt2','alt3','alt4','alt5','alt6','alt7'].map($).find(e=>e&&e.textContent.replace(/[✕○△□]/g,'').trim()===t);if(b)b.click();return!!b};
pause();ok('Pause menu has Change map',btns().includes('Change map'),btns().join(' | '));
click('Change map');ok('Opens the map picker',PARK.on&&!$('park').classList.contains('hide'));
const ci0=ci;$('parkBack').click();ok('Back returns to the pause menu, same map',state==='paused'&&!PARK.on&&btns().includes('Resume')&&runL.name==='Frosty Falls');
click('Change map');parkTab('dev');PARK.i=devMaps().findIndex(M=>M.name==='Woodsy Cabin');renderPark();parkPlay();
ok('Picking a map goes straight in, same character, no character select',state==='play'&&runL.name==='Woodsy Cabin'&&ci===ci0&&$('cs').classList.contains('hide'),runL.name+' '+state);
setRivals(2);beginTimed();__step(3);pause();click('Change map');PARK.i=devMaps().findIndex(M=>M.name==='Frosty Falls');renderPark();parkPlay();__step(3);
ok('Changing map mid-Collectathon ends it',state==='play'&&runFree&&!RACE.on&&runL.name==='Frosty Falls');
pause();click('Change map');parkKey('Escape');ok('Esc also goes back to pause',state==='paused');resume();
menu();__step(2);$('go').click();__step(2);ok('From the title, picker Back still goes to the title',PARK.on);$('parkBack').click();ok('...title',state==='menu'&&!PARK.on);
// Collectathon naming
$('go').click();__step(2);parkPlay();confirmChar();__step(5);
ok('Mode list says Collectathon with the new line',modeList().some(o=>o[0]==='Collectathon'&&/how many orbs can you collect before time runs out/.test(o[2])),modeList().map(o=>o[0]).join(','));
beginTimed();__step(3);ok('Board title says Collectathon',/Collectathon/.test($('warsBoard').textContent));pause();ok('Pause title says Collectathon',/Collectathon/.test($('ovT').textContent)&&btns().includes('Stop Collectathon'),$('ovT').textContent);resume();
return out.join('\n')})()
