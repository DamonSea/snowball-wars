(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
__place(0,5,0,0);SB.ammo=1;runN(120);out.push('no refill over 2s: ammo='+SB.ammo);
SB.ammo=0;SB.cool=0;throwSnow();out.push('empty throw blocked, toast told='+SB.told);
const o=orbs.find(q=>!q.gold);__place(o.g.position.x,o.g.position.z,o.y,0);runN(2);out.push('regular orb: ammo='+SB.ammo);
SB.ammo=1;const g=orbs[0];g.gold=true;__place(g.g.position.x,g.g.position.z,g.y,0);runN(2);out.push('gold orb: ammo='+SB.ammo);
return out.join('\n')})()
