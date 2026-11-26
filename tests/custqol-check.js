(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
const N=chars[3].rig,K=chars[5].rig,ids=r=>(r.accA||[]).map(i=>i.id);
menu();pickMode='run';pickLevel=0;ci=3;showChar();__step(2);OFI[3]=0;applyOutfit(0);setLook(L=>Object.assign(L,blankLook()),false);CHIST.length=0;state='select';openCust();
const B=q=>$('custBody').querySelector(q),click=q=>{B(q).click();__step(2)},tab=t=>{CUST.tab=t;renderCust()};
// Parker's face
tab('face');ok('Parker has the full face kit: 6 eyes, 5 brows, 7 mouths, 5 switches',$('custBody').querySelectorAll('[data-fk="eyes"]').length===6&&$('custBody').querySelectorAll('[data-fk="mouth"]').length===7&&$('custBody').querySelectorAll('[data-fs][data-fo="0"]').length===5);
ok('Her defaults: soft brows on, freckles off, beady eyes without shine, smile',N.face.brows.soft.visible&&N.face.freckles.every(m=>!m.visible)&&N.face.eyes.beady.visible&&N.face.shine.every(m=>!m.visible)&&!!B('[data-fk="brows"][data-fv="soft"].on')&&!!B('[data-fs="freckles"][data-fo="0"].on'));
click('[data-fs="freckles"][data-fo="1"]');ok('Freckles on for her (stored as 1, since her default is off)',N.face.freckles.every(m=>m.visible)&&LOOKS[3].f.freckles===1);
click('[data-fk="eyes"][data-fv="relaxed"]');click('[data-fs="whites"][data-fo="0"]');ok('Relaxed eyes, no whites',N.face.eyes.relaxed.visible&&N.face.whites.every(m=>!m.visible));
click('[data-fk="brows"][data-fv="soft"]');ok('Picking her default brows stores nothing',LOOKS[3].f.brows===undefined);
const av=makeAv(3);applyLook(av.rig,3,0,cleanLook(LOOKS[3],3));ok('Friends see her face',av.rig.face.eyes.relaxed.visible&&av.rig.face.freckles.every(m=>m.visible));
// headphones
tab('acc');ok('Ears slot: her headphones, on by default (her own model)',N.native.phones[0].visible&&!!B('[data-s="ears"][data-a="phones"].on'));
click('[data-s="ears"][data-a="off"]');ok('Headphones off',!N.native.phones[0].visible);
// per-slot colors, incl. her own gear
click('[data-s="ears"][data-a="phones"]');ok('Picking a slot points the color picker at it',CUST.acT==='ears'&&!!B('[data-act="ears"].on'));
const mit=N.mats.leather.color.getHex();click('[data-act="top"]');click('[data-ac="'+0xe23b3b+'"]');
const hatM=N.native.beanie[0].children[0].material;ok('Her winter hat takes its own color; her mittens keep theirs',hatM.color.getHex()===0xe23b3b&&N.mats.leather.color.getHex()===mit&&LOOKS[3].acs.top===0xe23b3b);
click('[data-u="acs"]');ok('...and back to its outfit color',N.native.beanie[0].children[0].material===N.mats.leather);
// turning to show it
click('[data-s="back"][data-a="cape"]');__step(40);ok('Picking a back item turns her round to show it',Math.abs(angD(CUST.rot,PI*.85))<.15,CUST.rot.toFixed(2));
click('[data-s="top"][data-a="flame"]');__step(40);ok('...and a head item turns her back to the front',Math.abs(angD(CUST.rot,.25))<.15);
// undo
const J=()=>JSON.stringify(cleanLook(LOOKS[3],3)),before=J();click('[data-s="top"][data-a="party"]');$('custUndo').click();__step(2);ok('Undo takes back the last change',J()===before&&ids(N).includes('flame')&&!ids(N).includes('party'));
custKey('KeyZ');__step(2);ok('Z undoes too (flames off, cape still on)',!ids(N).includes('flame')&&ids(N).includes('cape'));
tab('outfit');click('[data-o="1"]');ok('Outfit picked',OFI[3]===1);$('custUndo').click();__step(2);ok('Undo puts the outfit back',OFI[3]===0);
let n=0;while(!$('custUndo').disabled&&n<60){$('custUndo').click();n++}__step(2);ok('Undo all the way: her starting look, then the button greys out',!LOOKS[3].f.eyes&&!LOOKS[3].acs&&$('custUndo').disabled,n);
// surprise me
const s0=JSON.stringify(LOOKS[3]);let changed=false;for(let i=0;i<4&&!changed;i++){$('custRand').click();__step(2);changed=JSON.stringify(LOOKS[3])!==s0}
ok('Surprise me changes the look',changed);ok('...and saves only valid things',JSON.stringify(cleanLook(LOOKS[3],3))===JSON.stringify(LOOKS[3]));$('custUndo').click();
// wear tab, everyone
closeCust();for(const c of [2,3,5]){ci=c;showChar();openCust();tab('wear');ok(chars[c].name+': Wear tab with a hoodie row',!!B('[data-hood="reg"]'));closeCust()}
// Tuk with headphones (built to fit him)
ci=5;showChar();openCust();tab('acc');click('[data-s="ears"][data-a="phones"]');ok('Tuk can wear headphones',ids(K).includes('phones'));setLook(L=>Object.assign(L,blankLook()));closeCust();
// face zoom aims at the head
ci=3;showChar();state='select';openCust();tab('acc');click('[data-s="back"][data-a="board"]');__step(40);tab('face');__step(60);ok('The Face tab turns her to face you',Math.abs(angD(CUST.rot,0))<.1,CUST.rot.toFixed(2));const hy=N.hp.position.y+N.head.position.y;ok('Face tab zooms onto Parker\'s head',Math.abs(cam.position.y-(hy+.11))<.1,cam.position.y.toFixed(2)+' vs '+hy.toFixed(2));
setLook(L=>Object.assign(L,blankLook()));closeCust();
return out.join('\n')})()
