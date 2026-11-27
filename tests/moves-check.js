(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
const kd=c=>dispatchEvent(new KeyboardEvent('keydown',{code:c})),ku=c=>dispatchEvent(new KeyboardEvent('keyup',{code:c}));
// ---- ground pound ----
__place(2,8,0,0);runN(3);vy=0;py=5;grounded=false;kd('KeyQ');ku('KeyQ');
const y0=py;runN(10);out.push('pound spin: hangs='+(Math.abs(py-y0)<.05)+' st='+GP.st);
const h=runHz[0];h.g.position.set(2,.75,10.5);h.vx=h.vz=0;
runN(30);out.push('pound landed: st='+GP.st+' y='+py.toFixed(2)+' combo='+TR.names.join(',')+' spikeball smashed='+(h.dead||!runHz.includes(h)));
runN(30);out.push('recovered: st='+GP.st+' mode='+A.mode);
__place(2,8,0,0);runN(3);vy=6;grounded=false;py=.4;groundPound();out.push('too low to pound refused: st='+GP.st);
runN(40);
// snowman via pound
const sm=snowmen().find(q=>q.x===9);sm.up=true;sm.g.visible=true;__place(9,6.2,0,0);runN(3);py=4;vy=0;grounded=false;groundPound();runN(40);out.push('snowman knocked by pound: '+!sm.up);
// ---- bindings ----
openSet();const btn=document.querySelector('[data-bind="jump"][data-dev="kb"][data-slot="0"]');btn.click();out.push('capture started: '+!!CAP+' label='+document.querySelector('[data-bind="jump"][data-dev="kb"][data-slot="0"]').textContent);
kd('KeyL');ku('KeyL');out.push('jump now bound to: '+BIND.kb.jump.join(','));closeSet();if(state==="paused")resume();
__place(0,5,0,0);runN(5);kd('Space');runN(4);ku('Space');out.push('Space no longer jumps: '+grounded);runN(30);
kd('KeyL');runN(4);out.push('L jumps: '+!grounded);ku('KeyL');runN(60);
// steal a key: bind F (throw) to attack slot 1 -> moves from throw
openSet();document.querySelector('[data-bind="attack"][data-dev="kb"][data-slot="1"]').click();kd('KeyF');ku('KeyF');out.push('F moved: attack='+BIND.kb.attack.join(',')+' throw='+BIND.kb.throw.join(','));
document.querySelector('[data-bind="pound"][data-dev="kb"][data-slot="0"]').click();kd('Backspace');out.push('cleared pound slot: '+BIND.kb.pound.join(','));
document.querySelector('[data-bind="throw"][data-dev="kb"][data-slot="0"]').click();kd('Escape');out.push('Esc cancels capture: '+(CAP===null)+' panel open='+setOpen);
document.querySelector('[data-bind="up"][data-dev="kb"][data-slot="0"]').click();kd('KeyI');kd('ArrowUp');out.push('move fwd='+BIND.kb.up.join(','));
const pr=document.querySelectorAll('[data-dev="pad"]').length;out.push('controller slots shown='+pr);
document.getElementById('bindReset').click();out.push('reset: jump='+BIND.kb.jump+' throw='+BIND.kb.throw+' pound pad='+BIND.pad.pound);closeSet();if(state==="paused")resume();
// mouse right click = pound
__place(2,8,0,0);runN(3);py=5;vy=0;grounded=false;dispatchEvent(new PointerEvent('pointerdown',{pointerType:'mouse',button:2,bubbles:true}));out.push('right click pound: st='+GP.st+' state='+state);runN(60);
// controller held state through bindings
padNow=[];padNow[4]=true;out.push('pad L1 maps to pound held='+held('pound'));padNow=[];
out.push('controls card mentions pound: '+document.getElementById('ctlList').textContent.includes('Ground pound'));
// ---- pole climb (Frosty Falls lamp at -6,2.5) ----
__place(-6,3.6,0,Math.PI);keys.KeyW=true;let mx=0;for(let i=0;i<200;i++){__step(1);mx=Math.max(mx,py)}keys.KeyW=false;
out.push('lamp: climbing='+CL.on+' top='+CL.top+' pole='+(CL.tree&&CL.tree.pole)+' maxY='+mx.toFixed(2));
TR.names=[];jumpBuf=.15;runN(2);out.push('pole-top flip: '+TR.names.join(','));runN(80);
return out.join('\n')})()
