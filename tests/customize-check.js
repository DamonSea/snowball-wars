(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const hx=m=>m.color.getHex?m.color.getHex():null;
menu();__step(2);pickMode='run';pickLevel=0;$('cs').classList.remove('hide');state='select';ci=0;showChar();ok('no Customize for Sunny',$('csCust').textContent==='');
ci=2;showChar();ok('Customize for Flip',$('csCust').textContent==='Customize');
$('csCust').click();__step(2);ok('panel opens, select card hides',CUST.on&&!$('cust').classList.contains('hide')&&$('cs').classList.contains('hide'));
document.querySelector('#cust .ctab[data-t="color"]').click();const rows=document.querySelectorAll('#custBody .crow').length;ok('Colors tab lists Flip parts ('+rows+')',rows===PARTS.Flip.length);
document.querySelector('#custBody [data-p="jacket"][data-c="'+0x2f6fd0+'"]').click();ok('recolor jacket',F.mats.jacket.color.getHex()===0x2f6fd0&&LOOKS[2].c.jacket===0x2f6fd0);
ok('saved',JSON.parse(localStorage.getItem('orbRunLook_Flip')).c.jacket===0x2f6fd0);
document.querySelector('#cust .ctab[data-t="acc"]').click();document.querySelector('#custBody [data-s="top"][data-a="propeller"]').click();document.querySelector('#custBody [data-s="back"][data-a="jet"]').click();document.querySelector('#custBody [data-s="face"][data-a="shades"]').click();
ok('3 accessories built',F.accA.length===3);
const pr=F.accA.find(a=>a.kind==='prop').p,r0=pr.rotation.y;__step(10);ok('propeller spins',pr.rotation.y!==r0);
document.querySelector('#custBody [data-ac="'+0xe23b3b+'"]').click();ok('accessory color',LOOKS[2].ac===0xe23b3b);
document.querySelector('#cust .ctab[data-t="outfit"]').click();document.querySelector('#custBody [data-o="1"]').click();ok('preset clears colors, keeps accessories',!LOOKS[2].c.jacket&&OFI[2]===1&&F.accA.length===3);
CUST.rot=0;custKey('ArrowRight');__step(3);ok('turntable',CUST.rot===.5&&Math.abs(face-.5)<.01);
custKey('Escape');ok('Esc closes back to select',!CUST.on&&!$('cs').classList.contains('hide'));
ci=3;showChar();openCust();document.querySelector('#cust .ctab[data-t="acc"]').click();document.querySelector('#custBody [data-s="back"][data-a="cape"]').click();ok('Nova: back item hides snowboard',NV.board.visible===false);
document.querySelector('#custBody [data-s="back"][data-a=""]').click();ok('removing it brings the board back',NV.board.visible===true);closeCust();
const bad=cleanLook({c:{jacket:-5,scarf:0xff0000,evil:1},a:{top:'<x>',face:'shades'},ac:'red'},2);ok('cleanLook sanitizes',bad.c.scarf===0xff0000&&bad.c.jacket===undefined&&!bad.c.evil&&bad.a.top===''&&bad.a.face==='shades'&&bad.ac===null);
const av=makeAv(4);applyLook(av.rig,4,0,cleanLook({c:{leather:0x37d7ff},a:{top:'crown',back:'wings'}},4));ok('multiplayer avatar look',av.rig.accA.length===2&&av.rig.mats.leather.color.getHex()===0x37d7ff);
// game with a look on: jetpack flames in the air
ci=2;confirmChar();__step(5);__place(0,10,0,Math.PI);jumpBuf=.15;keys.Space=true;__step(6);const jet=F.accA.find(a=>a.kind==='jet');ok('jetpack fires in the air',jet.f[0].visible);keys.Space=false;__until(()=>grounded,200);__step(2);ok('and stops on the ground',!jet.f[0].visible);
// pause: camera swings in front, character faces it and waves
__place(0,10,0,Math.PI/2);__step(5);pause();__step(30);const wv=wave>0||F.armR.rotation.z>1;__step(120);const fx=Math.sin(face),fz=Math.cos(face),dx=cam.position.x-P.position.x,dz=cam.position.z-P.position.z,dd=Math.hypot(dx,dz);
ok('pause camera in front of the character ('+((dx*fx+dz*fz)/dd).toFixed(2)+')',(dx*fx+dz*fz)/dd>.9&&dd<6);ok('waves on pause',wv);
resume();__step(120);ok('camera returns behind after resume',cam.position.z-P.position.z>0||Math.abs(cam.position.x-P.position.x)<3);
// settings tabs
openSet();setTabTo('game');ok('Game tab: game rows only + slider',document.querySelectorAll('#setList .srow').length===Object.keys(LOOK).length&&!!document.querySelector('[data-sld="squash"]'));
const sl=document.querySelector('[data-sld="squash"]');sl.value=60;sl.dispatchEvent(new Event('input',{bubbles:true}));ok('slider sets squash 0.6',Math.abs(TOON-.6)<1e-6);
setTabTo('sound');ok('Sound tab: sound rows + mix visible',document.querySelectorAll('#setList .srow').length===SKEYS.length&&getComputedStyle($('volr').parentNode).display!=='none');
setTabTo('controls');ok('Controls tab: bindings',document.querySelectorAll('#setList [data-bind]').length>0&&getComputedStyle($('volr').parentNode).display==='none');
setNav(false,false,false,false,false,false,false,true);ok('R1 wraps to Game',setTab==='game');setNav(false,false,false,true,false,false);ok('pad nav stays in tab',setRow>=0&&setRow<Object.keys(LOOK).length);
setRow=Object.keys(LOOK).indexOf('squash');setNav(false,true,false,false,false,false);ok('pad right raises the slider',Math.abs(TOON-.7)<1e-6);
setToon(0);closeSet();resume();
return out.join('\n')})()
