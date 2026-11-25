(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
const F=chars[2],R=F.rig,vis=k=>R.parts[k].every(m=>m.visible);const iB=OUTFITS.findIndex(o=>o.name==='Beach Day'),iS=OUTFITS.findIndex(o=>o.name==='Super Flip');
ok('Flip has Beach Day and Super Flip (old outfits keep their numbers)',iB===5&&iS===6&&OUTFITS[4].name==='Golden Ace');
ok('Neither is locked',unlocked(iB)&&unlocked(iS));
ok('Normal outfit: cap, goggles, scarf on; extras hidden',(OFI[2]=0,applyOutfit(0),vis('cap')&&vis('goggles')&&vis('scarf')&&!R.parts.hair[0].visible&&!R.parts.shades[0].visible&&!R.parts.mask[0].visible));
OFI[2]=iB;applyOutfit(iB);
ok('Beach Day: shades, his own hair, bare arms and calves',vis('shades')&&vis('calves')&&vis('forearms')&&vis('hair'));
ok('Beach Day: no cap, goggles, scarf or collar',!R.parts.cap[0].visible&&!R.parts.goggles[0].visible&&!R.parts.scarf[0].visible&&!R.parts.collar[0].visible);
ok('Beach Day: shorts (pants shortened)',R.pantsLegs.every(m=>m.scale.y===.5));
ok('Beach Day: a plain tee with short sleeves (no print, no pockets)',!R.mats.jacket.map&&R.sleeves.every(m=>m.scale.y<.5)&&!vis('pockets')&&!vis('cuffs'));
ok('Beach Day: no cape',!(R.accA||[]).some(it=>it.id==='cape'));
OFI[2]=iS;applyOutfit(iS);
ok('Super Flip: mask, emblem, belt, hair',vis('mask')&&vis('emblem')&&vis('belt')&&vis('hair'));
ok('Super Flip: no shades, full-length pants and sleeves',!vis('shades')&&R.pantsLegs.every(m=>m.scale.y===1)&&R.sleeves.every(m=>m.scale.y===1));
ok('Super Flip: comes with a red cape',(R.accA||[]).some(it=>it.id==='cape'&&it.fromOutfit));
ok('Super Flip: blue suit, red boots',R.mats.jacket.color.getHex()===0x2a5bd7&&R.mats.boot.color.getHex()===0xe23b3b);
setLook(L=>{L.a.back='wings'});ok('Your own back accessory replaces the outfit cape',(R.accA||[]).some(it=>it.id==='wings')&&!(R.accA||[]).some(it=>it.id==='cape'));
setLook(L=>{L.a.back=''});ok('Clear it and the cape is back',(R.accA||[]).some(it=>it.id==='cape'));
OFI[2]=0;applyOutfit(0);ok('Back to Stunt Pilot: everything normal again',vis('cap')&&vis('scarf')&&!vis('mask')&&!vis('hair')&&!(R.accA||[]).some(it=>it.id==='cape')&&!R.mats.jacket.map);
// friends see it
const a=makeAv(2);ok('A friend\'s Flip starts with no extras showing',!a.rig.parts.hair[0].visible&&!a.rig.parts.mask[0].visible&&a.rig.parts.cap[0].visible);
applyLook(a.rig,2,iS,cleanLook(null,2));ok('A friend in Super Flip shows the mask and cape',a.rig.parts.mask[0].visible&&(a.rig.accA||[]).some(it=>it.id==='cape'));
// cape moves
OFI[2]=iS;applyOutfit(iS);__place(0,10,0,0);__k({KeyW:true});__step(40);const cp=R.accA.find(it=>it.id==='cape');ok('The cape flows when running',Math.abs(cp.c[0].rotation.x)>.2,cp.c[0].rotation.x.toFixed(2));__k({});
OFI[2]=0;applyOutfit(0);
return out.join('\n')})()
