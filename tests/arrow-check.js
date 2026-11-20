(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};const deg=r=>Math.round(((r*180/Math.PI)%360+360)%360);
__place(-5.5,-6.9,0,Math.PI);keys.KeyW=true;let seenWhileClimbing=false;
for(let i=0;i<200&&!CL.top;i++){__step(1);if(CL.on&&!CL.top&&flipArrow.visible)seenWhileClimbing=true}
out.push('reached handstand='+CL.top+' arrow hidden while climbing='+!seenWhileClimbing);
keys.KeyW=false;runN(2);out.push('no input: arrow visible='+flipArrow.visible+' points '+deg(flipArrow.rotation.y)+'°, facing '+deg(face)+'°');
keys.KeyD=true;runN(3);const ad=flipArrow.rotation.y;out.push('holding right: arrow points '+deg(ad)+'° (east = 90°)');
jumpBuf=.15;runN(3);const fd=Math.atan2(vel.x,vel.z);keys.KeyD=false;
out.push('flip went '+deg(fd)+'° · matches arrow='+(Math.abs(deg(fd)-deg(ad))<=2)+' · arrow hidden after jump='+!flipArrow.visible+' · '+TR.names.join(','));
return out.join('\n')})()
