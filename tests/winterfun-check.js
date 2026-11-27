(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
const kd=c=>{keys[c]=true;dispatchEvent(new KeyboardEvent('keydown',{code:c}))},ku=c=>{keys[c]=false;dispatchEvent(new KeyboardEvent('keyup',{code:c}))};
useRunMap(RUNMAPS.findIndex(M=>M.name==='Woodsy Cabin'));startRun(true);__step(5);
out.push('rollers on Woodsy Cabin: '+RS.list.length+' sizes '+RS.list.map(b=>b.r.toFixed(2)).join(','));
// snow angel: crouch + Q on snow
__place(-4,16,0,0);runN(2);keys.ShiftLeft=true;kd('KeyQ');ku('KeyQ');keys.ShiftLeft=false;out.push('crouch+Q: angel='+(SA.t>0)+' yellow='+(YS.spray||YS.t>0)+' imprint pieces='+(SA.dec?SA.dec.g.children.length:0));
const x0=P.position.x;keys.KeyD=true;runN(60);keys.KeyD=false;const mid=F.hp.rotation.x;runN(110);out.push('during angel: stayed put='+(Math.abs(P.position.x-x0)<.01)+' lying pitch='+mid.toFixed(2)+' | done, combo='+TR.names.join(','));
// plain Q on the ground is still yellow snow for Flip
__place(-6,18,0,0);runN(2);kd('KeyQ');runN(5);out.push('Flip plain Q held: wheel coming='+(EM.hold||EM.wheel)+' yellow='+YS.spray);ku('KeyQ');runN(40);
// Nova: Q makes an angel, never yellow snow
menu();pickMode='run';pickLevel=3;ci=3;showChar();confirmChar();__step(5);__place(-6,18,0,0);runN(2);kd('KeyQ');runN(5);out.push('Nova plain Q held: wheel coming='+(EM.hold||EM.wheel)+' angel='+(SA.t>0)+' yellow='+(YS.spray||YS.t>0));ku('KeyQ');runN(200);
startYellow();out.push('Nova startYellow() directly: yellow='+(YS.spray||YS.t>0));
// rolling snowball: push it, it grows
T.run.hazardsFree=0;runHz.forEach(h=>rmObj(h.g));runHz=[];const b=RS.list[0];b.x=-10;b.z=16;b.r=T.roll.r0;syncRoller(b);__place(-12,16,0,Math.PI/2);invuln=0;runHz.forEach(h=>rmObj(h.g));runHz=[];
const r0=b.r;keys.KeyD=true;runN(240);keys.KeyD=false;out.push('pushed 4s: ball moved to x='+b.x.toFixed(1)+' radius '+r0.toFixed(2)+' -> '+b.r.toFixed(2)+(RS.pushing?'':'')+' combo='+TR.names.join(','));
// bowl an enemy
const ft=foeThink;foeThink=h=>{h.vx=h.vz=0};spawnRunHz('goon');const g=runHz[runHz.length-1];g.g.position.set(b.x+3,0,b.z);b.vx=4.2;b.vz=0;TR.names=[];let bowled=false;for(let i=0;i<90;i++){__step(1);if(TR.names.includes('Bowled Over'))bowled=true}foeThink=ft;out.push('rolled into a goon: goon down='+!!g.dead+' Bowled Over='+bowled);
// stand on a big one
b.r=1.3;b.vx=b.vz=0;syncRoller(b);__place(b.x,b.z,b.r*1.92+.5,0);runN(30);out.push('stand on top: y='+py.toFixed(2)+' (top '+(b.r*1.92).toFixed(2)+') grounded='+grounded);
// smash it
__place(b.x-1.6-b.r*.72,b.z,0,Math.PI/2);runN(2);TR.names=[];attackPress();runN(20);out.push('punch the big one: back to small='+RS.list.every(q=>q.r<.4||q!==b)+' count='+RS.list.length);
return out.join('\n')})()
