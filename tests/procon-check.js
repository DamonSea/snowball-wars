// Switch 2 Pro Controller through js/input/pads.js: run with python3 tests/lines.py index.html "$(cat tests/procon-check.js)"
(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);
// a raw Switch 2 Pro as Chrome reports it: non-standard order, 21 buttons, 6 axes, sticks with Y pointing up
const raw={id:'Pro Controller (Vendor: 057e Product: 2069)',index:0,connected:true,mapping:'',timestamp:1,
  buttons:Array.from({length:21},()=>({pressed:false,value:0})),axes:[.026,.046,0,.153,0,-.016]};
const realGet=navigator.getGamepads;Pads.source=()=>[raw];navigator.getGamepads=realGet;
const RAW={B:0,A:1,Y:2,X:3,L:12,R:4,ZL:13,ZR:5,MINUS:14,PLUS:6,UP:11,DOWN:8,LEFT:10,RIGHT:9};
const tap=i=>{raw.buttons[i].pressed=true;raw.buttons[i].value=1;raw.timestamp++;__step(1);raw.buttons[i].pressed=false;raw.buttons[i].value=0;raw.timestamp++;__step(1)};
const m=Pads.map(raw);ok('remapped to the standard layout',m.mapping==='standard'&&m.buttons.length===21&&m.axes.length===4);
raw.buttons[RAW.A].pressed=true;ok('A becomes button 1 (right face)',Pads.map(raw).buttons[1].pressed);raw.buttons[RAW.A].pressed=false;
raw.axes[1]=.046+.704;ok('left stick pushed up reads -1',Math.abs(Pads.map(raw).axes[1]+1)<.01);raw.axes[1]=.046;
ok('stick at rest reads 0',Math.abs(Pads.map(raw).axes[0])<.01&&Math.abs(Pads.map(raw).axes[3])<.01);
menu();__step(3);ok('controller detected: prompts on',document.body.classList.contains('haspad'));
pickMode='run';pickLevel=0;$('cs').classList.remove('hide');state='select';ci=2;showChar();__step(3);Pads.refresh(); // the page applies this itself before the next paint
ok('Play shows B, Back shows A (were ✕ / ○)',$('csGo').querySelector('.pk').textContent==='B'&&$('csBack').querySelector('.pk').textContent==='A');
ok('Customize shows X (was △)',$('csCust').querySelector('.pk').textContent==='X');
ok('rebind names follow the controller',PADN[0]==='B'&&PADN[4]==='L'&&PADN[9]==='+');
tap(RAW.X);__step(3);ok('X opens Customize',CUST.on);
tap(RAW.R);ok('R switches to Colors',CUST.tab==='color');
tap(RAW.A);ok('A closes back to select',!CUST.on&&state==='select');
tap(RAW.RIGHT);ok('D-pad right still works',true);
// switching back to a DualSense restores the PlayStation symbols
const ds={id:'DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)',index:1,connected:true,mapping:'standard',timestamp:raw.timestamp+50,buttons:Array.from({length:18},()=>({pressed:false,value:0})),axes:[0,0,0,0]};
Pads.source=()=>[raw,ds];__step(4);
ok('DualSense in use: Play shows ✕ again',$('csGo').querySelector('.pk').textContent==='✕'&&PADN[0]==='✕');
ok('rumble goes through the shim on the Switch 2 Pro',typeof Pads.map(raw).vibrationActuator.playEffect==='function');
Pads.source=()=>[];__step(3);ok('unplugged: prompts hidden',!document.body.classList.contains('haspad'));
return out.join('\n')})()
