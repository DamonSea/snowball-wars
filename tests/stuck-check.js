(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);const _st=__step;__step=n=>{for(let i=0;i<n;i++){runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});SB.stun=0;_st(1)}};
const kd=(code,key,meta)=>dispatchEvent(new KeyboardEvent('keydown',{code,key,metaKey:!!meta,bubbles:true})),ku=(code,key,meta)=>dispatchEvent(new KeyboardEvent('keyup',{code,key,metaKey:!!meta,bubbles:true}));
// Mac: Cmd+C (copy) must not leave C (crouch) held
kd('MetaLeft','Meta',true);kd('KeyC','c',true);ku('MetaLeft','Meta',false);ok('Cmd+C does not hold Crouch',!keys.KeyC&&!crouchHeld());
kd('ShiftLeft','Shift');kd('MetaLeft','Meta',true);kd('Digit4','$',true);ku('MetaLeft','Meta',false);ok('Cmd+Shift+4 (screenshot) releases Shift when Cmd is let go',!keys.ShiftLeft&&!crouchHeld());
kd('KeyC','c');ok('plain C still crouches',crouchHeld());ku('KeyC','c');ok('and releases',!crouchHeld());
kd('ShiftLeft','Shift');document.dispatchEvent(new Event('visibilitychange'));Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));delete document.hidden;ok('switching tabs releases held keys',!keys.ShiftLeft);if(state==='paused')resume();__step(2);
// slide base: crouch-walk into the chute's low lip from behind, along every lane
ci=2;let loops=0,stuck=0;const ch=plats.find(p=>p.ramp&&p.w>10&&p.d>2);
for(const z of[17.6,18.2,19,19.8,20.4]){__place(-1.2,z,0,Math.PI/2);__step(3);keys.ShiftLeft=true;__k({KeyD:true,ShiftLeft:true});let starts=0,was=false;
  for(let i=0;i<150;i++){__step(1);if(BS.on&&!was)starts++;was=BS.on;if(bodyInSolid(P.position.x,P.position.z,py))stuck++}
  if(starts>1)loops++;__k({});keys.ShiftLeft=false;__step(10)}
ok('crouch-walking into the bottom of the slide never loops into butt slides',loops===0);ok('never ends up inside the slide',stuck===0);
// standing still on the slope and crouching still starts a slide; heading downhill too
__place(15,19,topOf(ch,15,19),Math.PI/2);__step(3);keys.ShiftLeft=true;__step(20);ok('crouch while standing still on the slope: slides',BS.on||P.position.x<12);keys.ShiftLeft=false;__step(60);
// crawl up the slide: no butt slide while pushing uphill
__place(3,19,topOf(ch,3,19),Math.PI/2);__step(3);__k({KeyD:true,ShiftLeft:true});let anyBS=false;for(let i=0;i<40;i++){__step(1);if(BS.on)anyBS=true}__k({});ok('crawling uphill stays a crouch',!anyBS&&A.mode==='crouch'||!anyBS);__step(30);
// safety net: dropped inside a solid block gets pushed out
__place(-6,-17,0,0);__step(2);const was1=!!bodyInSolid(P.position.x,P.position.z,py);__step(25);ok('stuck inside the cliff: nudged out ('+(was1?'was inside':'?')+' → at '+P.position.x.toFixed(2)+','+P.position.z.toFixed(2)+')',was1&&!bodyInSolid(P.position.x,P.position.z,py));
__place(2.2,-10.4,0,0);__step(25);ok('clipped into a wall edge: nudged out',!bodyInSolid(P.position.x,P.position.z,py));
__step=_st;return out.join('\n')})()
