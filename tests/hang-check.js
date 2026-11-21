(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
// Deck south face is at z=-10.5 (top 2.2): stand just south, face north, hold W into it, jump
__place(3.5,-9.75,0,Math.PI);__k({KeyW:true,Space:true});jumpBuf=.15;let grabbed=false;for(let i=0;i<60&&!grabbed;i++){__step(1);grabbed=LH.on}
out.push('hang: grabbed='+grabbed+' hands at top='+(py+T.hang.drop).toFixed(2)+' (deck 2.2)');
__k({KeyD:true});runN(40);__k({});out.push('shimmy right 0.66s: x 3.5 -> '+P.position.x.toFixed(2)+', still hanging='+LH.on);
__k({KeyW:true});runN(30);__k({});out.push('push toward ledge: pulled up='+(!LH.on&&grounded&&Math.abs(py-2.2)<.01)+' combo='+TR.names.join(','));runN(30);
// drop with crouch
__place(-3.5,-9.75,0,Math.PI);__k({KeyW:true,Space:true});jumpBuf=.15;for(let i=0;i<60&&!LH.on;i++)__step(1);__k({ShiftLeft:true});runN(3);__k({});runN(40);out.push('crouch lets go: hanging='+LH.on+' on ground='+(grounded&&py<.01));
// hop up with Jump
__place(-3.5,-9.75,0,Math.PI);__k({KeyW:true,Space:true});jumpBuf=.15;for(let i=0;i<60&&!LH.on;i++)__step(1);__k({});runN(5);TR.names=[];jumpBuf=.15;runN(50);out.push('jump from hang: on deck='+(grounded&&Math.abs(py-2.2)<.01)+' combo='+TR.names.join(','));
// walking off an edge doesn't grab (facing away)
__place(0,-11,2.2,0);__k({KeyS:true});runN(50);__k({});out.push('walk off the deck edge facing away: grabbed='+LH.on+' y='+py.toFixed(2));
// pound jump
__place(4,6,0,0);runN(2);jumpBuf=.15;keys.Space=true;runN(25);groundPound();let land=false;for(let i=0;i<80&&!land;i++){__step(1);land=GP.st===3}jumpBuf=.15;let peak=0;for(let i=0;i<80;i++){__step(1);peak=Math.max(peak,py)}
out.push('pound jump: peak '+peak.toFixed(2)+' (normal jump ~1.9) combo='+TR.names.join(','));
return out.join('\n')})()
