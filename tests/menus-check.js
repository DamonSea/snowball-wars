(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);
const gp={id:'DualSense Wireless Controller',mapping:'standard',connected:true,timestamp:1,buttons:Array.from({length:18},()=>({pressed:false,value:0})),axes:[0,0,0,0]};
const tap=i=>{gp.buttons[i].pressed=true;gp.timestamp++;__step(1);gp.buttons[i].pressed=false;gp.timestamp++;__step(1)};
menu();__step(3);const vis=id=>{const e=$(id);return e&&e.textContent&&getComputedStyle(e).display!=='none'};
ok('main menu: title and three buttons',$('ovT').textContent==='Snowball Wars'&&['Trick Park','Adventure','Map Builder'].every(t=>[...document.querySelectorAll('#ov .btns button')].some(b=>b.textContent===t&&getComputedStyle(b).display!=='none')));
ok('no intro paragraph or score list on the main menu',!vis('ovP')&&getComputedStyle($('best')).display==='none');
$('go').click();__step(2);ok('Trick Park opens the map picker',PARK.on&&!$('park').classList.contains('hide')&&$('ov').classList.contains('hide'));
ok('shows one map with its name and best orb race',$('parkName').textContent==='Plaza'&&/orb race/i.test($('parkBest').textContent));
ok('map picture rendered',$('parkImg').src.startsWith('data:image')||$('parkFrame').classList.contains('noimg'));
$('parkNext').click();ok('▶ goes to the next map',$('parkName').textContent==='Frozen Rink');$('parkPrev').click();$('parkPrev').click();ok('◀ wraps around',$('parkName').textContent===parkMaps()[parkMaps().length-1].name);
localStorage.setItem('orbsBest_'+parkMaps()[0].key,12);$('parkNext').click();ok('best orb count shows',$('parkBest').textContent.includes('12 orbs'));
dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowRight',bubbles:true}));ok('arrow keys flip maps',$('parkName').textContent==='Frozen Rink');
navigator.getGamepads=()=>[gp];__step(2);gp.axes[0]=1;gp.timestamp++;__step(2);gp.axes[0]=0;gp.timestamp++;__step(2);ok('D-pad / stick flips maps on the controller',$('parkName').textContent==='Rooftops');
tap(1);ok('○ goes back to the main menu',!PARK.on&&!$('ov').classList.contains('hide'));
parkMenu();__step(2);tap(3);ok('△ opens More maps',!PARK.on&&mapsOpen);tap(1);__step(2);ok('and ○ from there returns to the Trick Park picker',PARK.on);
PARK.i=3;renderPark();tap(0);__step(3);ok('✕ plays the shown map (Jungle Gym)',state==='select'&&runL.name==='Jungle Gym'&&!PARK.on);
navigator.getGamepads=()=>[];delete bestR[parkMaps()[0].key];menu();return out.join('\n')})()
