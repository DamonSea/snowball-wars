(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;__step=n=>{for(let i=0;i<n;i++){runHz.forEach(h=>{h.g.position.set(0,.75,40);h.vx=h.vz=0});SB.stun=0;_st(1)}};
ok('Slide and Ramp in the library',ASSETS.slide&&ASSETS.ramp&&ASSETS.slide.cat==='Play'&&ASSETS.ramp.cat==='Structures');
menu();__step(2);openBuilder(blankMap());__step(2);
// one slide per direction: where is its high end?
const hi=[];for(let d=0;d<4;d++){const i=placeAt('slide',0,0);BLD.sel=i;for(let k=0;k<d;k++)rotSel();const p=BLD.prev.plats.find(q=>q.ramp&&q.w>1.5&&q.d>1.5&&q.ramp.lo<.5);
  const r=p.ramp;hi.push(r.ax+(r.a1>r.a0?'+':'-'));BLD.sel=BLD.map.items.indexOf(BLD.map.items[i]);delSel()}
ok('Rotate turns the slide all four ways ('+hi.join(' ')+')',hi.join(' ')==='z- x+ z+ x-');
// build a little course: deck at the top of a slide, and a ramp
BLD.map.items=[{t:'start',x:0,z:14},{t:'slide',x:0,z:0,w:2.4,d:10,h:4,c:5,dir:0},{t:'deck',x:0,z:-6.25,w:3,d:2.5,h:4,th:.4,c:2,posts:1},{t:'ramp',x:8,z:0,w:3,d:6,h:2.5,c:2,dir:0}];changed();
const ch=BLD.prev.plats.find(q=>q.ramp&&q.w>2&&q.ramp.lo<.5&&q.ramp.hi===4);ok('slide surface: 0.3 at the low end, 4 at the top',Math.abs(topOf(ch,0,5)-.3)<1e-6&&Math.abs(topOf(ch,0,-5)-4)<1e-6);
ok('slide has rails',BLD.prev.plats.filter(q=>q.ramp&&q.w<.5).length===2);
ok('the custom map survives clean/save',cleanMap(JSON.parse(JSON.stringify(BLD.map))).items.filter(i=>i.t==='slide'||i.t==='ramp').length===2);
testBuilder();__step(5);ok('test play starts',state==='play'&&runL.custom);
const C=runL.plats.find(q=>q.ramp&&q.w>2&&q.ramp.hi===4);
__place(0,-4.6,topOf(C,0,-4.6),0);__step(3);keys.ShiftLeft=true;let slid=false,mx=0;for(let i=0;i<200;i++){__step(1);if(BS.on)slid=true;mx=Math.max(mx,Math.hypot(vel.x,vel.z));if(i>5&&!BS.on)break}keys.ShiftLeft=false;
ok('butt-slides down a builder slide (top speed '+mx.toFixed(1)+', ends z '+P.position.z.toFixed(1)+')',slid&&mx>8&&P.position.z>5);
// ramp: walk up it, it's solid underneath
const Rm=runL.plats.find(q=>q.ramp&&q.ramp.hi===2.5);__place(8,4,0,Math.PI);__step(3);__k({KeyW:true});let top=0,launched=false;for(let i=0;i<80;i++){__step(1);top=Math.max(top,py);if(!grounded&&py>1.5)launched=true}__k({});ok('runs up the ramp (peak '+top.toFixed(2)+') and launches off the top',top>2.3&&launched);
__place(10.5,0,0,-Math.PI/2);__step(3);__k({KeyA:true});__step(40);__k({});ok('the ramp is solid from the side (x '+P.position.x.toFixed(2)+')',P.position.x>9.4||py>.5);
__place(8,-2.6,topOf(Rm,8,-2.6),0);__step(3);keys.ShiftLeft=true;let rs=false;for(let i=0;i<120;i++){__step(1);if(BS.on)rs=true;if(i>5&&!BS.on)break}keys.ShiftLeft=false;ok('butt-slides down the ramp too',rs);
pause();backToBuilder();__step(2);exitBuilder();__step=_st;return out.join('\n')})()
