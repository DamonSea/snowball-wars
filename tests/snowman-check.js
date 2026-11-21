(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
const sm=snowmen().find(q=>q.x===6),reset=()=>{sm.up=true;sm.g.visible=true;sm.t=0};
// punch: stand in front facing it, attack
reset();__place(6,8.8,0,0);runN(3);TR.names=[];attackPress();runN(25);out.push('punch: snowman down='+!sm.up+' combo='+TR.names.join(','));runN(60);
// dive: run at it and dive
reset();__place(6,15,0,Math.PI);keys.KeyW=true;runN(30);jumpBuf=.15;runN(8);keys.ShiftLeft=true;runN(2);keys.ShiftLeft=false;let hit=false;for(let i=0;i<60;i++){__step(1);if(!sm.up){hit=true;break}}keys.KeyW=false;
out.push('dive: snowman down='+hit+' mode='+A.mode+' combo='+TR.names.join(','));runN(90);
// walking into it does nothing
reset();__place(6,11.5,0,Math.PI);keys.KeyW=true;runN(40);keys.KeyW=false;out.push('just walking through: still standing='+sm.up);
// rebuilds
reset();sm.up=false;sm.t=.1;sm.g.visible=false;runN(10);out.push('rebuilds after timer: '+sm.up);
return out.join('\n')})()
