(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
menu();select('adv',0);confirmChar();runN(10);
out.push('Lighthouse Isles enemies: '+advHz.map(h=>h.kind).join(',')+' | crew visible='+advHz.every(h=>h.m.g.visible&&!h.spk.visible));
const h=advHz[0];runN(1);const p=h.g.position,b=h.y-.75;
// stomp it: drop onto its head
P.position.set(p.x,0,p.z);py=b+FOE[h.kind].top+.3;vy=-3;grounded=false;invuln=0;runN(2);out.push('stomp '+h.kind+': down='+(h.dead>0)+' bounce vy='+vy.toFixed(1));runN(330);out.push('comes back after 5s: '+(h.dead<=0&&h.g.visible));
setFoeStyle('spike');runN(2);out.push('toggle Spikeballs in Adventure: spikes visible='+advHz.every(h=>h.spk.visible&&!h.m.g.visible));setFoeStyle('crew');runN(2);
menu();select('adv',1);confirmChar();runN(5);out.push('Sky Gauntlet enemies: '+advHz.map(h=>h.kind).join(','));
return out.join('\n')})()
