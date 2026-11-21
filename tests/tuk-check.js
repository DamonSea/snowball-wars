(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;__step=n=>{for(let i=0;i<n;i++){runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});SB.stun=0;_st(1)}};
const ti=chars.findIndex(c=>c.name==='Tuk');ok('roster is Flip, Nova, Tuk; Tuk has the acrobat moveset',ti===5&&chars[5].acro&&ORDER.join()==='2,3,5'&&chars[5].moves===chars[2].moves);
ok('5 outfits, gold one locked',OUTFITS_TUK.length===5&&!!OUTFITS_TUK[4].lock);
menu();pickMode='run';pickLevel=0;ci=5;showChar();confirmChar();__step(5);const H=TK;
__place(10,-3,0,0);__step(10);jumpBuf=.15;keys.Space=true;__step(4);keys.Space=false;__until(()=>grounded,200);let ear=0,bel=9;for(let i=0;i<20;i++){__step(1);ear=Math.max(ear,Math.abs(H.ears[0].rotation.z-H.ears[0]._b));bel=Math.min(bel,H.belly.scale.y)}
ok('landing flops the ears ('+ear.toFixed(2)+')',ear>.15);ok('and the belly jiggles ('+bel.toFixed(2)+')',bel<.9);__step(120);ok('then settles',Math.abs(H.belly.scale.y-.95)<.03);
__k({});vel.set(0,0,0);idleT=0;let tongue=false,headBack=false;for(let i=0;i<220;i++){vel.set(0,0,0);__step(1);if(H.tongue.visible)tongue=true;if(H.head.rotation.x<-.3)headBack=true}
ok('standing around: head back, tongue out for snowflakes',tongue&&headBack);
__k({KeyD:true});__step(10);__k({});ok('moving puts the tongue away',!H.tongue.visible);
// the moveset works: backflip
__place(10,-3,0,0);__step(10);keys.ShiftLeft=true;__step(3);jumpBuf=.15;keys.Space=true;__step(2);keys.Space=false;keys.ShiftLeft=false;ok('backflip',A.mode==='flip'||TR.names.includes('Backflip'));__until(()=>grounded,200);
// customize + accessories
ok('Customize has Tuk’s parts',PARTS.Tuk.length===10);applyLook(TK,5,0,cleanLook({c:{leather:0xffd84a},a:{top:'crown',face:'shades',back:'cape'}},5));ok('recolor fur + accessories fit',TK.mats.leather.color.getHex()===0xffd84a&&TK.accA.length===3);
applyLook(TK,5,0,cleanLook(null,5));
const av=makeAv(5);ok('multiplayer avatar for Tuk',!!av.rig.ears&&av.rig.yeti);
__step=_st;return out.join('\n')})()
