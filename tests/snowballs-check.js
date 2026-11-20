(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
__place(0,2,0,Math.PI);const h=runHz[0];h.g.position.set(0,.75,-4);h.vx=h.vz=0;SB.ammo=6;throwSnow();runN(40);
out.push('spikeball: smashed='+(h.dead||!runHz.includes(h))+' combo='+TR.names.join(',')+' ammo='+SB.ammo);
__place(6,6,0,0);SB.cool=0;throwSnow();runN(40);const s=snowmen().find(q=>q.x===6);out.push('snowman: still up='+s.up+' combo='+TR.names.join(','));
__place(0,-8.6,0,Math.PI);SB.cool=0;throwSnow();runN(6);out.push('wall: snowballs still flying after 6 frames='+SB.list.length);
__place(3,3,0,0);TR.mult=2;TR.names=['Backflip'];TR.pts=150;MP.me='mepeer';launchSnowball([3,1.5,-3,0,3,20],false,'otherpeer',7);runN(30);
out.push('hit by friend: reported='+JSON.stringify(SB.hits)+' combo after='+TR.mult+' frost shown='+$('frost').classList.contains('on'));
SB.ammo=0;SB.regen=0;runN(60);out.push('ammo after 1s (no refill over time, expect 0)='+SB.ammo+', HUD pips='+$('snowAmmo').children.length+', HUD shown='+($('snowBox').style.display!=='none'));
SB.credited.clear();SB.seq=3;const fake={peer:'otherpeer',presence:{hb:[['mepeer',2]]}};const av={sbSeen:new Set(),g:new THREE.Group()};TR.mult=0;TR.names=[];snowFromPeer(fake,av);
out.push('thrower credited: combo='+TR.names.join(','));
return out.join('\n')})()
