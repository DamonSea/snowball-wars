(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
const want=()=>{MUS.want=state==='menu'||state==='select'?(MUSC.menu==='off'?null:MUSC.menu):(state==='won'||state==='over')?null:parkTrack();return MUS.want};
setMusicPick('menu','menu');setMusicPick('park','run');
openSet();setTabTo('game');const row=t=>[...document.querySelectorAll('#setList .srow')].find(r=>r.querySelector('.sl')&&r.querySelector('.sl').textContent===t);
ok('Settings has Menu music and Trick Park music',!!row('Menu music')&&!!row('Trick Park music'));
ok('Defaults are the originals (Classic)',row('Menu music').querySelector('.opt.on').textContent==='Classic'&&row('Trick Park music').querySelector('.opt.on').textContent==='Classic');
ok('Trick Park has 6 tracks plus Shuffle and Off to pick from',MUSIC_PARK.length===9&&MUSIC_PARK.filter(o=>o[0]!=='shuffle'&&o[0]!=='off').every(o=>!!TRACKS[o[0]]));
ok('Every menu choice is a real track',MUSIC_MENU.filter(o=>o[0]!=='off').every(o=>!!TRACKS[o[0]]));
[...row('Trick Park music').querySelectorAll('.opt')].find(b=>b.textContent==='Jingle Rush').click();ok('Picking one saves it',MUSC.park==='jingle'&&localStorage.getItem('orbRunMusPark')==='jingle');
closeSet();menu();ok('Menu plays the menu pick',want()==='menu');
select('run',0);ci=2;showChar();confirmChar();__step(3);if(state==='paused')resume();ok('Trick Park plays your pick',want()==='jingle');
setMusicPick('park','shuffle');SHUF.i=0;SHUF.loops=0;const a=want();SHUF.loops=1;MUS.name=a;SHUF.i++;const b=parkTrack();ok('Shuffle moves on to another track',a!==b&&SHUF.pool.includes(b),a+' -> '+b);
ok('Shuffle starts with the original',a==='run');
setMusicPick('park','off');ok('Off means silence',want()===null);setMusicPick('menu','cocoa');menu();ok('Menu: Cocoa Break',want()==='cocoa');
setMusicPick('menu','menu');setMusicPick('park','run');
return out.join('\n')})()
