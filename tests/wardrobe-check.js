(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x!==''?' -> '+x:''));
const F=chars[2].rig,N=chars[3].rig,K=chars[5].rig,ids=r=>(r.accA||[]).map(i=>i.id),vis=(r,k)=>r.parts[k].every(m=>m.visible);
ok('Renamed: Flipper and Parker',chars[2].name==='Flipper'&&chars[3].name==='Parker'&&!!PARTS.Flipper&&!!PARTS.Parker);
ok('Gone: crown, wings, backpack, jetpack, mustache',!['crown','wings','pack','jet','stache'].some(id=>ACC_SLOTS.some(([s])=>ACC[s].some(i=>i.id===id))));
ok('Gone: every gold outfit',chars.every(c=>!c.outs||!c.outs.some(o=>/gold/i.test(o.name))));
ok('Old looks with removed accessories load clean',(l=>l.a.top===''&&l.a.back===''&&l.a.face==='')(cleanLook({a:{top:'crown',back:'jet',face:'stache'}},2)));
menu();pickMode='run';pickLevel=0;ci=2;showChar();__step(2);OFI[2]=0;applyOutfit(0);setLook(L=>Object.assign(L,blankLook()));openCust();CUST.tab='acc';renderCust();
const B=q=>$('custBody').querySelector(q),click=q=>{B(q).click();__step(2)};
ok('Accessories tab: Head, Face, Neck and Back rows with Flaming head, Winter hat, Scarf, Snowboard and Cape',!!B('[data-s="top"][data-a="flame"]')&&!!B('[data-s="top"][data-a="beanie"]')&&!!B('[data-s="neck"][data-a="scarf"]')&&!!B('[data-s="back"][data-a="board"]')&&!!B('[data-s="back"][data-a="cape"]'));
ok('Flipper wears his scarf by default (his own model)',vis(F,'scarf')&&!!B('[data-s="neck"][data-a="scarf"].on'));
click('[data-s="neck"][data-a="off"]');ok('Neck: None takes the scarf off',!vis(F,'scarf')&&LOOKS[2].a.neck==='off');
click('[data-s="neck"][data-a="scarf"]');ok('...and back on',vis(F,'scarf'));
click('[data-s="top"][data-a="beanie"]');ok('Winter hat on Flipper replaces his cap and hair, goggles stay on the brim',ids(F).includes('beanie')&&!vis(F,'cap')&&!vis(F,'hair')&&F.parts.goggles[1].visible);
click('[data-s="back"][data-a="board"]');ok('Snowboard on Flipper',ids(F).includes('board'));
click('[data-s="top"][data-a="flame"]');ok('Flaming head (replaces the cap)',ids(F).includes('flame')&&!vis(F,'cap'));
const fl=F.accA.find(i=>i.id==='flame'),s0=fl.f.map(t=>t.scale.y).join();__step(6);ok('The flames flicker and embers rise',fl.f.map(t=>t.scale.y).join()!==s0&&fl.e.some(e=>e.position.y>.2));
CUST.tab='wear';renderCust();click('[data-gog="0"]');ok('Goggles off',!vis(F,'goggles')&&!vis(F,'gogStrap'));click('[data-gog="1"]');ok('Goggles back on head',F.parts.goggles[1].visible);
// hoodie
click('[data-hood="reg"]');const hd=F.accA.find(i=>i.id==='hoodie');
ok('Hoodie (regular): built over the jacket, jacket pieces hidden',!!hd&&!hd.big&&F.jk.every(m=>!m.visible)&&!!B('[data-hc]'));
click('[data-hc="'+0x2f6fd0+'"]');ok('Hoodie color',F.accA.find(i=>i.id==='hoodie').g.children[0].material.color.getHex()===0x2f6fd0);
click('[data-hood="big"]');ok('Oversized fit',F.accA.find(i=>i.id==='hoodie').big&&!!B('[data-hood="big"].on'));
const H=F.accA.find(i=>i.id==='hoodie');closeCust();confirmChar();__step(5);if(state==='paused')resume();__place(0,10,0,0);const hx=H.hd.rotation.x;__k({KeyW:true});__step(40);__k({});
ok('The hood bounces and the drawstrings swing while running',Math.abs(H.hd.rotation.x-hx)>.05&&H.st.some(d=>Math.abs(d.rotation.x)>.05),H.hd.rotation.x.toFixed(2)+' / '+H.st[0].rotation.x.toFixed(2));
menu();ci=2;showChar();openCust();CUST.tab='wear';renderCust();click('[data-hood=""]');
ok('Hoodie off: his jacket is back, Stunt Pilot extras still hidden',!F.accA.some(i=>i.id==='hoodie')&&F.torso.children[0].visible&&!vis(F,'emblem')&&vis(F,'collar'));
setOutfit(5);__step(2);setLook(L=>{L.hood='reg'});setLook(L=>{delete L.hood});ok('Super Flipper keeps his emblem and belt after a hoodie comes off',vis(F,'emblem')&&vis(F,'belt')&&!vis(F,'collar'));
setOutfit(0);setLook(L=>Object.assign(L,blankLook()));closeCust();
// Parker
ci=3;showChar();openCust();CUST.tab='acc';renderCust();
ok('Parker wears her winter hat and board by default (her own models)',N.native.beanie[0].visible&&N.board.visible&&!N.hairTop.visible&&!ids(N).includes('beanie'));
click('[data-s="top"][data-a="off"]');ok('Hat off: her curls show',!N.native.beanie[0].visible&&N.hairTop.visible);
click('[data-s="neck"][data-a="scarf"]');ok('Scarf on Parker (built for her)',ids(N).includes('scarf'));
click('[data-s="back"][data-a="cape"]');ok('Cape on Parker swaps out the board',ids(N).includes('cape')&&!N.board.visible);
CUST.tab='wear';renderCust();click('[data-hood="reg"]');ok('Parker hoodie hides her puffer',N.jk.every(m=>!m.visible)&&ids(N).includes('hoodie'));click('[data-hood=""]');ok('...and brings it back',N.jk.every(m=>m.visible));
const av=makeAv(3);applyLook(av.rig,3,0,cleanLook(LOOKS[3],3));ok('Friends see her look',av.rig.hairTop.visible&&av.rig.accA.some(i=>i.id==='scarf')&&av.rig.accA.some(i=>i.id==='cape'));
setLook(L=>Object.assign(L,blankLook()));closeCust();
// Tuk: no Flipper/Parker gear, but hoodie and flames
ci=5;showChar();openCust();CUST.tab='acc';renderCust();
ok('Tuk: no scarf/hat/board options (Flipper and Parker only), but flames and headphones',!B('[data-a="beanie"]')&&!B('[data-s="neck"]')&&!B('[data-a="board"]')&&!!B('[data-a="flame"]')&&!!B('[data-a="phones"]'));CUST.tab='wear';renderCust();
click('[data-hood="big"]');ok('Tuk oversized hoodie',ids(K).includes('hoodie')&&K.jk.every(m=>!m.visible));
ok('A winter hat sneaked into Tuk\'s save is dropped',cleanLook({a:{top:'beanie'}},5).a.top==='');
setLook(L=>Object.assign(L,blankLook()));closeCust();
return out.join('\n')})()
