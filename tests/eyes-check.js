(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
menu();pickMode='run';pickLevel=0;ci=2;showChar();__step(3);setLook(L=>{L.f={}});openCust();CUST.tab='face';renderCust();__step(2);
const R=chars[2].rig,F=R.face,click=q=>{$('custBody').querySelector(q).click();__step(2)};
ok('Face tab has Eye whites and Eye shine On/Off rows',!!$('custBody').querySelector('[data-fs="whites"][data-fo="0"]')&&!!$('custBody').querySelector('[data-fs="shine"][data-fo="0"]'));
ok('Both on by default',F.whites.every(m=>m.visible)&&F.shine.every(m=>m.visible)&&F.pupils[0].scale.x===1);
click('[data-fs="whites"][data-fo="0"]');
ok('Whites off: whites hidden, pupils fill the eye',F.whites.every(m=>!m.visible)&&F.pupils[0].scale.x>1.5&&F.pupils[0]._by>2,F.pupils[0].scale.x);
ok('Shine stays on with whites off',F.shine.every(m=>m.visible));
click('[data-fs="shine"][data-fo="0"]');ok('Shine off hides every glint (beady too)',F.shine.every(m=>!m.visible)&&F.shine.length===8);
ok('Saved',LOOKS[2].f.whites===0&&LOOKS[2].f.shine===0);
const a=makeAv(2);applyLook(a.rig,2,0,cleanLook(LOOKS[2],2));ok('Friends see it',a.rig.face.whites.every(m=>!m.visible)&&a.rig.face.pupils[0].scale.x>1.5);
R.eyes.forEach(e=>e.scale.y=.1);__step(40);ok('Blinking reopens to the big pupil',R.eyes.some(e=>e.scale.y>2),R.eyes.map(e=>e.scale.y.toFixed(2)).join(','));
click('[data-fs="whites"][data-fo="1"]');click('[data-fs="shine"][data-fo="1"]');
ok('Back on: normal eyes',F.whites.every(m=>m.visible)&&F.shine.every(m=>m.visible)&&F.pupils[0].scale.x===1&&LOOKS[2].f.whites===undefined);
closeCust();return out.join('\n')})()
