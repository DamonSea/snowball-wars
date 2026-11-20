(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
const kd=c=>dispatchEvent(new KeyboardEvent('keydown',{code:c})),ku=c=>dispatchEvent(new KeyboardEvent('keyup',{code:c}));
__place(3,6,0,0);runN(3);kd('KeyQ');ku('KeyQ');out.push('standing L1/Q: gag='+(YS.t>0)+' facing away='+(Math.abs(face-Math.PI)<.01)+' patch='+YS.spots.length+' armed='+YS.armed+' trick='+TR.names.join(','));
const x0=P.position.x;keys.KeyD=true;jumpBuf=.15;runN(20);keys.KeyD=false;out.push('locked in place during gag: moved='+Math.abs(P.position.x-x0).toFixed(2)+' still grounded='+grounded);
runN(80);out.push('gag over: t='+YS.t+' patch size='+YS.spots[0].g.scale.x.toFixed(2));
// yellow snowball at the computer
setCpu(true);runN(5);CPU.cool=99;CPU.retarget=99;CPU.vx=CPU.vz=0;CPU.tx=CPU.x;CPU.tz=CPU.z;
__place(CPU.x,CPU.z+6,0,Math.PI);runN(2);TR.names=[];SB.ammo=6;SB.cool=0;throwSnow();const yb=SB.list[SB.list.length-1];out.push('thrown snowball yellow='+yb.yellow+' armed after='+YS.armed);
runN(50);out.push('hit computer with it: '+TR.names.join(','));
SB.cool=0;throwSnow();out.push('next snowball yellow='+SB.list[SB.list.length-1].yellow);setCpu(false);runN(60);
// L1 in the air still ground pounds
__place(3,6,0,0);runN(3);py=5;vy=0;grounded=false;kd('KeyQ');ku('KeyQ');out.push('in the air: pound st='+GP.st+' gag='+(YS.t>0));runN(70);
// hit by a friend's yellow snowball
launchSnowball([3,1.5,0,0,3,20],false,'otherpeer',55,true);__place(3,6,0,0);runN(30);out.push('hit by yellow: frost yellow='+document.getElementById('frost').classList.contains('yellow'));runN(60);
// toggle off, summer
setYellow(false);__place(3,6,0,0);runN(3);yellowSnow();out.push('toggle off: gag='+(YS.t>0));setYellow(true);
setSeason(false);runN(2);yellowSnow();out.push('summer: gag='+(YS.t>0)+' toast="'+document.getElementById('toast').textContent+'"');setSeason(true);runN(5);
out.push('presence carries patches: '+JSON.stringify(YS.sent));
return out.join('\n')})()
