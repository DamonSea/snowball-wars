(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
const kd=c=>{keys[c]=true;dispatchEvent(new KeyboardEvent('keydown',{code:c}))},ku=c=>{keys[c]=false;dispatchEvent(new KeyboardEvent('keyup',{code:c}))};
__place(3,6,0,Math.PI);runN(3);kd('KeyQ');runN(30);out.push('holding Q: spraying='+YS.spray+' drops in the air='+YS.drops.length+' marks so far='+YS.cur.n);
const z0=P.position.z;keys.KeyW=true;jumpBuf=.15;runN(45);keys.KeyW=false;
out.push('walking while spraying: moved '+(z0-P.position.z).toFixed(2)+'m in .75s (slow), grounded='+grounded+', marks='+YS.cur.n);
const ms=YS.cur.g.children.map(k=>k.position.z);out.push('marks trail along the path: z from '+Math.max(...ms).toFixed(1)+' to '+Math.min(...ms).toFixed(1)+', about '+(P.position.z-Math.min(...ms)).toFixed(1)+'m ahead of the feet at most');
ku('KeyQ');runN(2);out.push('released: spraying='+YS.spray+' finishing='+(YS.t>0)+' armed='+YS.armed+' tank='+YS.tank.toFixed(2)+' trick='+TR.names.join(','));runN(40);
// run it dry
YS.tank=T.yellow.tank;kd('KeyQ');runN(260);out.push('held 4.3s: spraying='+YS.spray+' tank='+YS.tank.toFixed(2)+' toast="'+document.getElementById('toast').textContent+'"');ku('KeyQ');runN(40);
kd('KeyQ');runN(3);out.push('right after, empty: spraying='+YS.spray);ku('KeyQ');runN(60*10);out.push('after 10s refill tank='+YS.tank.toFixed(2));
// friend spraying
const av=makeAv(2);av.g.position.set(-3,0,6);av.g.rotation.y=0;const n0=YS.sess.length;for(let i=0;i<40;i++){yellowFromPeer({yw:1},av);__step(1)}
out.push('friend spraying: new drawing='+(YS.sess.length>n0)+' marks='+(av.ysSess?av.ysSess.n:0));yellowFromPeer({yw:0},av);
// snowball comes out yellow; in the air L1 pounds
SB.ammo=6;SB.cool=0;__place(3,6,0,0);runN(3);throwSnow();out.push('next snowball yellow='+SB.list[SB.list.length-1].yellow);runN(40);
py=5;vy=0;grounded=false;kd('KeyQ');ku('KeyQ');out.push('in the air: pound st='+GP.st+' spray='+YS.spray);runN(70);
setYellow(false);kd('KeyQ');runN(5);out.push('toggle off: spray='+YS.spray);ku('KeyQ');setYellow(true);
return out.join('\n')})()
