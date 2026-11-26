(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
menu();pickMode='run';pickLevel=0;ci=2;showChar();__step(3);setOutfit(0);setLook(L=>{delete L.body});openCust();CUST.tab='outfit';renderCust();__step(2);
const R=chars[2].rig;
ok('Outfits tab has Body type: Stout / Slender (Stout on)',!!$('custBody').querySelector('[data-body="stout"].on')&&!!$('custBody').querySelector('[data-body="slender"]'));
const foot0=(()=>{const v=new THREE.Vector3();R.parts.soles[0].getWorldPosition&&R.parts.soles[0].getWorldPosition(v);return v.y})();
$('custBody').querySelector('[data-body="slender"]').click();__step(2);
ok('Slender: hips higher, legs longer',R.hp.position.y>.9&&R.pantsLegs[0].scale.y>1.4,R.hp.position.y.toFixed(2)+' / '+R.pantsLegs[0].scale.y.toFixed(2));
ok('Slender: torso narrower and taller, shoulders in',R.torso.scale.x<.9&&R.torso.scale.y>1&&Math.abs(R.armR.position.x)<.4);
ok('Slender: boots move down so his feet stay on the ground',Math.abs(R.hp.position.y-.25+R.bootGs[0].position.y-.8+.25)<.001,(R.hp.position.y+R.bootGs[0].position.y).toFixed(3));
ok('Saved with the look',LOOKS[2].body==='slender'&&JSON.parse(localStorage.getItem('orbRunLook_Flipper')).body==='slender');
setOutfit(4);__step(2);ok('Slender in Off Duty: shorts stay short, calves longer',R.pantsLegs[0].scale.y===.5&&R.parts.calves[0].scale.y>1.5&&R.hp.position.y>.9);
setOutfit(5);__step(2);ok('Slender Super Flip: emblem and belt move with the torso',R.parts.emblem[0].parent===R.torso&&R.parts.belt[0].parent===R.torso);
const a=makeAv(2);applyLook(a.rig,2,0,cleanLook(LOOKS[2],2));ok('Friends see the slender build',a.rig.hp.position.y>.9&&a.rig.torso.scale.x<.9);
ok('Junk body types are ignored',cleanLook({body:'giant'},2).body===undefined);
setOutfit(0);$('custBody').querySelector('[data-body="stout"]').click();__step(2);ok('Back to Stout: Flip\'s own build',R.hp.position.y===.8&&R.pantsLegs[0].scale.y===1&&R.torso.scale.x===1&&R.bootGs[0].position.y===0&&LOOKS[2].body===undefined);
setLook(L=>{L.body='slender'});$('custReset').click();$('custReset').click();__step(2);ok('Reset look goes back to Stout',R.hp.position.y===.8&&LOOKS[2].body===undefined);
// it plays: run and jump as slender
setLook(L=>{L.body='slender'});closeCust();confirmChar();__step(10);__place(0,10,0,0);__k({KeyW:true});__step(60);__k({});ok('Slender Flip runs and plays normally',state==='play'&&Math.hypot(P.position.x,P.position.z-10)>1);
setLook(L=>{delete L.body});closeCust&&0;
closeCust();ci=3;showChar();openCust();CUST.tab='outfit';renderCust();ok('Nova has no body type row',!$('custBody').querySelector('[data-body]'));closeCust();
return out.join('\n')})()