(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
// nose shapes
menu();pickMode='run';pickLevel=0;ci=2;showChar();__step(2);setLook(L=>Object.assign(L,blankLook()),false);openCust();CUST.tab='face';renderCust();
const F=chars[2].rig.face,B=q=>$('custBody').querySelector(q),shown=()=>Object.keys(F.nshape).filter(k=>F.nshape[k].visible).join();
ok('Face tab has Nose shape: Default, Big, Small, Pointy (Default picked)',['default','big','small','pointy'].every(v=>!!B(`[data-fk="nshape"][data-fv="${v}"]`))&&!!B('[data-fk="nshape"][data-fv="default"].on')&&shown()==='default');
B('[data-fk="nshape"][data-fv="big"]').click();__step(2);ok('Big nose',shown()==='big'&&LOOKS[2].f.nshape==='big');
B('[data-fs="nose"][data-fo="0"]').click();__step(2);ok('The Nose switch still hides it',!F.nose[0].visible);B('[data-fs="nose"][data-fo="1"]').click();__step(2);
const a=makeAv(2);applyLook(a.rig,2,0,cleanLook(LOOKS[2],2));ok('Friends see the big nose',a.rig.face.nshape.big.visible&&!a.rig.face.nshape.default.visible);
ci=3;showChar();openCust();CUST.tab='face';renderCust();B('[data-fk="nshape"][data-fv="pointy"]').click();__step(2);ok('Parker gets nose shapes too',chars[3].rig.face.nshape.pointy.visible);
setLook(L=>Object.assign(L,blankLook()),false);closeCust();ci=2;showChar();setLook(L=>Object.assign(L,blankLook()),false);
// ground spot: straight under you while you're in the air
select('run',0);ci=2;showChar();confirmChar();__step(3);if(state==='paused')resume();__place(0,12,0,Math.PI);__step(10);
ok('No spot on the ground',!LM.g.visible);
__k({KeyW:true});__step(20);jumpBuf=.15;keys.Space=true;let seen=0,off=0;for(let i=0;i<100;i++){__step(1);if(LM.g.visible&&LM.a>.5){seen++;off=Math.max(off,Math.hypot(LM.g.position.x-P.position.x,LM.g.position.z-P.position.z))}if(grounded&&i>5)break}
keys.Space=false;__k({});ok('In the air, a spot shows on the ground',seen>10);
ok('...directly under you (not ahead)',off<.05,off.toFixed(3));
__step(30);ok('...and it goes once you land',!LM.g.visible);
// summer floors: every map's ground is one seasonal material, snow in winter and grass in summer
const vil=SEAS.find(x=>x.w===0xf3f7fb&&x.s===0x6fbf4a);ok('The Christmas Village floor is snow in winter, grass in summer',!!vil);
setSeason(false);__step(2);ok('Summer: it turns green',vil&&vil.m.color.getHex()===0x6fbf4a);
ok('Summer: the other grass floors are green too',grassM.color.getHex()===0x6fbf4a);
setSeason(true);__step(2);ok('Winter: snow again',vil&&vil.m.color.getHex()===0xf3f7fb);
return out.join('\n')})()
