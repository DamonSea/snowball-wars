(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
menu();pickMode='run';pickLevel=0;ci=2;showChar();__step(3);setOutfit(0);setLook(L=>Object.assign(L,blankLook()),false);openCust();CUST.tab='acc';renderCust();__step(2);
const R=chars[2].rig,vis=k=>R.parts[k].every(m=>m.visible),B=q=>$('custBody').querySelector(q),click=q=>{B(q).click();__step(2)};
ok('Head slot has Aviator cap, on for Flipper by default (his own cap)',!!B('[data-s="top"][data-a="aviator"].on')&&vis('cap')&&!R.accA.some(i=>i.id==='aviator'));
click('[data-s="top"][data-a="off"]');
ok('Head: None: cap gone, hair shows',!vis('cap')&&vis('hair'));
ok('...goggles stay, pushed up on his hair (no strap)',R.parts.goggles[1].visible&&!R.parts.gogStrap[0].visible&&R.gogG.scale.x>1);
setOutfit(1);__step(2);ok('Changing outfit keeps the cap off',!vis('cap')&&vis('hair'));
click('[data-s="top"][data-a="party"]');ok('Another hat replaces the cap (party hat on his hair)',!vis('cap')&&vis('hair')&&R.accA.some(i=>i.id==='party'));
setOutfit(4);__step(2);click('[data-s="top"][data-a="aviator"]');
ok('Off Duty with the cap put back on: cap on, hair hidden',vis('cap')&&!vis('hair'));
setLook(L=>{L.a.top=''});ok('Off Duty by default: no cap',!vis('cap')&&vis('hair'));
setOutfit(0);setLook(L=>{L.a.top='off'});
const a=makeAv(2);applyLook(a.rig,2,0,cleanLook(LOOKS[2],2));ok('Friends see you without the cap',!a.rig.parts.cap[0].visible&&a.rig.parts.hair[0].visible);
ok('Old saves: the cap switch turns into the Head slot',cleanLook({cap:0},2).a.top==='off'&&cleanLook({cap:1},2).a.top==='aviator'&&cleanLook({cap:0,a:{top:'halo'}},2).a.top==='halo'&&cleanLook({cap:'yes'},2).a.top==='');
$('custReset').click();$('custReset').click();__step(2);ok('Reset look puts the cap back',vis('cap')&&!vis('hair'));
CUST.tab='wear';renderCust();
setLook(L=>{delete L.soles});ok('Shoes switch, with soles by default',!!B('[data-soles="1"].on')&&vis('soles'));
click('[data-soles="0"]');ok('Plain shoes: no soles',!vis('soles')&&LOOKS[2].soles===0&&!!B('[data-soles="0"].on'));
setOutfit(2);__step(2);ok('...kept across outfits',!vis('soles'));
const a2=makeAv(2);applyLook(a2.rig,2,2,cleanLook(LOOKS[2],2));ok('Friends see plain shoes',!a2.rig.parts.soles[0].visible);
click('[data-soles="1"]');ok('Back to soles',vis('soles')&&LOOKS[2].soles===undefined);setOutfit(0);
ok('No cap switch on the Wear tab any more',!B('[data-cap]'));
// anyone can wear it
closeCust();for(const c of [3,5]){ci=c;showChar();openCust();CUST.tab='acc';renderCust();click('[data-s="top"][data-a="aviator"]');
  ok(chars[c].name+' can wear the aviator cap (built to fit)',chars[c].rig.accA.some(i=>i.id==='aviator'));setLook(L=>Object.assign(L,blankLook()));closeCust()}
return out.join('\n')})()
