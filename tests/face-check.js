(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
menu();pickMode='run';pickLevel=0;ci=2;showChar();__step(3);setLook(L=>{L.f={}});openCust();__step(3);
const R=chars[2].rig,F=R.face,shown=k=>Object.keys(F[k]).filter(s=>F[k][s].visible);
ok('Flip has a Face tab',!$('cust').querySelector('.ctab[data-t="face"]').classList.contains('hide'));
ok('Default face: round eyes, no brows, smile, nose/freckles/blush on',shown('eyes').join()==='round'&&shown('brows').join()==='none'&&shown('mouth').join()==='smile'&&F.nose[0].visible&&F.freckles[0].visible&&F.blush[0].visible);
CUST.tab='face';renderCust();__step(30);
ok('The Face tab lists eyes, eyebrows, mouth and switches',$('custBody').querySelectorAll('[data-fk="eyes"]').length===6&&$('custBody').querySelectorAll('[data-fk="brows"]').length===5&&$('custBody').querySelectorAll('[data-fk="mouth"]').length===7&&$('custBody').querySelectorAll('[data-fs][data-fo="0"]').length===5);
const click=sel=>{$('custBody').querySelector(sel).click();__step(2)};
click('[data-fk="eyes"][data-fv="relaxed"]');ok('Relaxed eyes',shown('eyes').join()==='relaxed'&&LOOKS[2].f.eyes==='relaxed');
ok('Relaxed eyes still blink',R.eyes===R.blinkOf.relaxed&&R.eyes.length===4);
click('[data-fk="mouth"][data-fv="calm"]');click('[data-fk="brows"][data-fv="soft"]');ok('Calm mouth, soft brows',shown('mouth').join()==='calm'&&shown('brows').join()==='soft');
click('[data-fk="eyes"][data-fv="happy"]');ok('Happy eyes (closed arcs) don\'t blink',R.eyes.length===0);
click('[data-fs="freckles"][data-fo="0"]');click('[data-fs="nose"][data-fo="0"]');ok('Freckles and nose switched off',!F.freckles[0].visible&&!F.nose[0].visible&&F.blush[0].visible&&LOOKS[2].f.freckles===0);
click('[data-fs="nose"][data-fo="1"]');ok('...and the nose back on',F.nose[0].visible&&LOOKS[2].f.nose===undefined);
click('[data-fk="mouth"][data-fv="none"]');ok('No mouth at all',shown('mouth').join()==='none');
click('[data-fk="eyes"][data-fv="round"]');ok('Picking the default isn\'t stored',LOOKS[2].f.eyes===undefined&&shown('eyes').join()==='round');
// saved and shared
const saved=JSON.parse(localStorage.getItem('orbRunLook_Flipper'));ok('Saved on this device',saved.f.mouth==='none'&&saved.f.freckles===0);
const a=makeAv(2);applyLook(a.rig,2,0,cleanLook(LOOKS[2],2));ok('Friends see your face choices',Object.keys(a.rig.face.mouth).filter(s=>a.rig.face.mouth[s].visible).join()==='none'&&!a.rig.face.freckles[0].visible);
ok('Junk face data from friends is ignored',JSON.stringify(cleanLook({f:{eyes:'laser',mouth:'<b>',nose:5,blush:0}},2).f)==='{"blush":0}');
ok('Picking an outfit keeps your face',(setOutfit(1),shown('mouth').join()==='none'));setOutfit(0);
// tabs cycle through Face with Q/E; other characters have no Face tab
CUST.tab='color';renderCust();custKey('KeyE');ok('E goes Colors -> Face',CUST.tab==='face');custKey('KeyE');ok('...then Wear',CUST.tab==='wear');
$('custReset').click();$('custReset').click();__step(2);ok('Reset look clears the face too',JSON.stringify(LOOKS[2].f)==='{}'&&shown('mouth').join()==='smile'&&F.freckles[0].visible);
closeCust();ci=3;showChar();openCust();ok('Parker has a Face tab too',!$('cust').querySelector('.ctab[data-t="face"]').classList.contains('hide'));CUST.tab='outfit';custKey('KeyE');custKey('KeyE');ok('...and Q/E reach it',CUST.tab==='face');closeCust();
return out.join('\n')})()
