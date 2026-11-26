(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
const btn=t=>['go','alt','alt2','alt3','alt4','alt5','alt6','alt7','alt8'].map($).find(e=>e.textContent===t);
select('run',0);ci=2;showChar();confirmChar();__step(5);if(state==='paused')resume();__place(6,10,4,1.2);__step(5);
const x0=P.position.x,z0=P.position.z,f0=face;pause();__step(2);
ok('Pause menu has Edit character',!!btn('Edit character'));
btn('Edit character').click();__step(30);
ok('It opens the customizer over the paused game',CUST.on&&CUST.fromPause&&state==='paused'&&$('ov').classList.contains('hide')&&!$('cust').classList.contains('hide'));
ok('Flipper stays where he was standing',Math.hypot(P.position.x-x0,P.position.z-z0)<.01);
ok('The camera frames him there',Math.hypot(cam.position.x-P.position.x,cam.position.z-(P.position.z+4.3))<1.5,cam.position.x.toFixed(1)+','+cam.position.z.toFixed(1));
ok('He turns to face the camera',Math.abs(angD(face,.25))<.2,face.toFixed(2));
CUST.tab='acc';renderCust();$('custBody').querySelector('[data-s="top"][data-a="flame"]').click();__step(2);
ok('Changes apply right away (and save)',chars[2].rig.accA.some(i=>i.id==='flame')&&LOOKS[2].a.top==='flame');
custKey('KeyQ');ok('Keys go to the customizer, not the game',CUST.tab!=='acc'&&state==='paused');
custKey('Escape');__step(2);
ok('Esc goes back to the pause menu',!CUST.on&&state==='paused'&&!$('ov').classList.contains('hide')&&!!btn('Resume'));
ok('...facing the way he was',Math.abs(angD(face,f0))<.01);
ok('Character select stays hidden',$('cs').classList.contains('hide'));
btn('Resume').click();__step(3);ok('Resume: back to playing in the new look',state==='play'&&chars[2].rig.accA.some(i=>i.id==='flame'));
// Sunny has no wardrobe: no entry
setLook(L=>Object.assign(L,blankLook()),false);
return out.join('\n')})()
