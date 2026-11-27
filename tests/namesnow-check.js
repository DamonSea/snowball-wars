(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x?' -> '+x:''));
const calm=()=>runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});const _st=__step;__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
// ---- snowmen are solid
const s=snowmen()[0];s.up=true;s.g.visible=true;
__place(s.x,s.z+4,0,Math.PI);__k({KeyW:true});__step(90);__k({});__step(3);
const d=Math.hypot(P.position.x-s.x,P.position.z-s.z);ok('Walking into a snowman: you stop at it',d>=1.05&&P.position.z>s.z,'distance '+d.toFixed(2));
__place(s.x+.3,s.z+.3,0,0);__step(2);ok('Standing inside one pushes you out',Math.hypot(P.position.x-s.x,P.position.z-s.z)>=1.05);
s.up=false;s.t=8;__place(s.x,s.z+3,0,Math.PI);__k({KeyW:true});__step(60);__k({});ok('A knocked-down snowman can be walked through',P.position.z<s.z-1);
s.up=true;s.g.visible=true;s.t=0;__step(2);
// dives and slides still smash them
__place(s.x,s.z+5,0,Math.PI);__k({KeyW:true});__step(14);keys.ShiftLeft=true;jumpBuf=.15;keys.Space=true;__step(2);keys.Space=false;keys.ShiftLeft=false;__step(4);keys.ShiftLeft=true;__step(2);keys.ShiftLeft=false;__step(40);__k({});
ok('A dive still smashes a snowman',!s.up);s.up=true;s.g.visible=true;s.t=0;
// snowball and punch still hit
__place(s.x,s.z+1.3,0,Math.PI);__step(2);attackPress();__step(20);ok('A punch still knocks one down',!s.up);s.up=true;s.g.visible=true;s.t=0;
// jumping on top: above it, no push
__place(s.x,s.z,2.6,0);__step(1);ok('Above a snowman you are not pushed sideways',Math.hypot(P.position.x-s.x,P.position.z-s.z)<.1);__step(60);
// computer rivals bump off too
setRivals(2);beginTimed();__step(200);const b=RACE.bots[0];b.x=s.x+.2;b.z=s.z;b.y=0;__step(2);ok('Computer players bump off snowmen (pushed out from 0.2m)',Math.hypot(b.x-s.x,b.z-s.z)>=.85,(Math.hypot(b.x-s.x,b.z-s.z)).toFixed(2));stopOrbRun();__step(3);
// ---- name
localStorage.removeItem('orbRunName');MP.acctName='';MP.myName='';
menu();__step(2);$('go').click();__step(3);ok('The map picker no longer has a name box',!$('park').querySelector('input'));
parkPlay();__step(3);ok('Character select has the name box (Trick Park)',state==='select'&&!$('csMe').classList.contains('hide')&&$('myName').offsetParent!==null);
csFocus('run');ok('With no name yet, the cursor starts in the name box',document.activeElement===$('myName')||document.body.classList.contains('haspad'));
const inp=$('myName');inp.value='  Ben <b>  the   Great  ';inp.dispatchEvent(new Event('input'));inp.dispatchEvent(new Event('change'));
ok('Name is cleaned and saved',localStorage.getItem('orbRunName')==='Ben b the Great'&&MP.myName==='Ben b the Great'&&inp.value==='Ben b the Great',localStorage.getItem('orbRunName'));
inp.value='Damon';inp.dispatchEvent(new Event('input'));
const c0=ci;inp.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD',bubbles:true}));inp.dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowRight',bubbles:true}));ok('Typing in the box does not change character',ci===c0&&state==='select');
inp.dispatchEvent(new KeyboardEvent('keydown',{code:'Enter',bubbles:true}));ok('Enter leaves the box (focus to Play), still on character select',document.activeElement===$('csGo')&&state==='select');
menu();__step(2);$('go').click();__step(2);parkPlay();__step(2);csFocus('run');ok('Name is remembered next time, and Play goes first',$('myName').value==='Damon'&&document.activeElement===$('csGo'));
menu();__step(2);select('adv',0);__step(2);ok('Adventure (single player) has no name box',$('csMe').classList.contains('hide'));menu();__step(2);
// friends see it
ok('My presence carries the typed name',(()=>{const pr={nm:MP.myName||'Player',nmSet:savedName()?1:0};return pr.nm==='Damon'&&pr.nmSet===1})());
MP.user={profiles:async()=>({})};MP.prof={u9:'Account Name'};
ok('A friend\'s typed name beats their account name',nameOf({peer:'x',by:'u9',presence:{nm:'Anderson',nmSet:1}})==='Anderson');
ok('Without a typed name, their account name is used',nameOf({peer:'x',by:'u9',presence:{nm:'Account Name',nmSet:0}})==='Account Name');
inp.value='';inp.dispatchEvent(new Event('input'));ok('Clearing it falls back',MP.myName===''&&!localStorage.getItem('orbRunName'));
return out.join('\n')})()
