(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
__place(0,5,0,0);setCpu(true);runN(5);
out.push('bot visible='+CPU.a.g.visible+' at '+[CPU.x,CPU.y,CPU.z].map(v=>v.toFixed(1)));
// stand 6m from it facing it, throw
CPU.cool=99;const fz=CPU.z>5?0:Math.PI;__place(CPU.x,CPU.z+(fz?6:-6),0,fz);CPU.vx=CPU.vz=0;CPU.retarget=99;CPU.tx=CPU.x;CPU.tz=CPU.z;SB.cool=0;SB.ammo=6;throwSnow();
let st=0;for(let i=0;i<50;i++){__step(1);st=Math.max(st,CPU.stun)}
out.push('bot hit: stunned peak='+st.toFixed(2)+' hits='+CPU.hits+' combo='+TR.names.join(','));
runN(40);out.push('stars while stunned seen, now stun='+CPU.stun.toFixed(2)+' stars='+CPU.a.stars.visible);
// let it throw at a standing player for a while
SB.hits=[];CPU.cool=0;CPU.retarget=0;let peak=0;for(let i=0;i<600;i++){__step(1);peak=Math.max(peak,SB.stun)}
out.push('10s vs bot: I got hit '+SB.hits.length+' times, bot snowballs flying='+SB.list.length+', bot y='+CPU.y.toFixed(2));
// settings row
openSet();out.push('settings has row='+!!document.querySelector('[data-look="cpu"]')+', sound rows ok='+(document.querySelectorAll('[data-row]').length===ROWS.length));closeSet();
setCpu(false);runN(2);out.push('turned off, visible='+CPU.a.g.visible);
return out.join('\n')})()
