(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
select('run',0);ci=2;showChar();confirmChar();__step(3);if(state==='paused')resume();const H=chars[2].rig;
ok('Run style defaults to Classic (the original)',GAIT==='classic'&&Math.abs(gaitRate(9)-14.4)<.01);
openSet();setTabTo('game');const gr=[...document.querySelectorAll('#setList .srow')].find(r=>r.textContent.includes('Run style'));ok('Settings: Run style Classic / Fluid',!!gr&&gr.textContent.includes('Fluid'));
[...gr.querySelectorAll('.opt')].find(b=>b.textContent==='Fluid').click();closeSet();if(state==='paused')resume();ok('Fluid picked and saved',GAIT==='fluid'&&localStorage.getItem('orbRunGait')==='fluid');
// 1. gait: fewer, longer strides at speed
ok('Sprint cadence is a natural ~2.5-3.5 steps a second (was ~10)',(()=>{const r=gaitRate(9)*2.2/PI;return r>2.4&&r<3.6})(),(gaitRate(9)*2.2/PI).toFixed(2)+' steps/s');
ok('Walking is calmer than sprinting, but not by as much as before',gaitRate(2)/gaitRate(9)>.4&&gaitRate(2)/gaitRate(9)<.6);
__place(0,12,0,Math.PI);__k({KeyW:true});let maxL=0,minY=9,maxY=-9,leanMax=0;for(let i=0;i<120;i++){__step(1);if(i>60){maxL=Math.max(maxL,Math.abs(H.legL.rotation.x));minY=Math.min(minY,H.root.position.y);maxY=Math.max(maxY,H.root.position.y);leanMax=Math.max(leanMax,H.hp.rotation.x)}}
ok('At full run: long strides, a body bob, a forward lean',maxL>.9&&maxY-minY>.04&&leanMax>.2,maxL.toFixed(2)+' / '+(maxY-minY).toFixed(3)+' / '+leanMax.toFixed(2));
ok('Feet roll heel to toe',H.bootGs.some(b=>Math.abs(b.rotation.x)>.1));
__k({});__step(60);ok('Stopping settles back to standing (feet flat)',Math.abs(H.legL.rotation.x)<.15&&H.bootGs.every(b=>Math.abs(b.rotation.x)<.05));
// 2. edge teeter: stand on the edge of a raised deck
const deck=runL.plats.filter(p=>p.k==='b'&&p.top>1.2&&p.top<4&&p.w>2&&p.d>2&&!p.ramp)[0];
__place(deck.x+deck.w/2-.25,deck.z,deck.top,Math.PI/2);__step(2);__step(40);
ok('Standing over an edge: teeter (arms windmill, lean)',EDGE.k>.8&&Math.abs(H.armL.rotation.x-H.armR.rotation.x)>.4,EDGE.k.toFixed(2)+' rel='+EDGE.rel.toFixed(2));
const p1=H.hp.rotation.x;__step(20);ok('...wobbling back and forth',Math.abs(H.hp.rotation.x-p1)>.02);
__place(deck.x,deck.z,deck.top,0);__step(40);ok('In the middle of the deck: no teeter',EDGE.k<.05);
__place(0,12,0,0);__step(40);ok('On flat ground: no teeter',EDGE.k<.05);
// 3. pause in mid-air
__place(0,12,0,0);__step(5);jumpBuf=.15;keys.Space=true;__step(12);keys.Space=false;pause();__step(5);
const shown=()=>Object.keys(H.face.mouth).filter(k=>H.face.mouth[k].visible).join();
ok('Paused in the air: an "oh!" face',shown()==='o');
__step(60);ok('...then looks down at the drop',H.head.rotation.x>.4,H.head.rotation.x.toFixed(2));
__step(80);let lo=9,hi=-9;for(let i=0;i<30;i++){__step(1);lo=Math.min(lo,H.legL.rotation.x);hi=Math.max(hi,H.legL.rotation.x)}ok('...then flails and pedals',hi-lo>.6,(hi-lo).toFixed(2));
resume();__step(3);ok('Unpause: face back to normal, falling as before',shown()===faceVal(H,LOOKS[2].f||{},'mouth')&&!grounded);
__step(90);pause();__step(30);ok('Paused on the ground: no mid-air reaction',PAIR.t===0&&shown()!=='o');resume();
setGait('classic');__place(0,12,0,Math.PI);__k({KeyW:true});__step(60);__k({});ok('Classic: the original stride and pose',Math.abs(gaitRate(9)-14.4)<.01&&H.bootGs.every(b=>Math.abs(b.rotation.x)<.05));
return out.join('\n')})()
