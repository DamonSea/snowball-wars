(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};const deg=r=>Math.round(((r*180/Math.PI)%360+360)%360);
__place(-5.5,-6.9,0,Math.PI);keys.KeyW=true;for(let i=0;i<200&&!CL.top;i++)__step(1);keys.KeyW=false;runN(2);
out.push('handstand='+CL.top+', arrow '+deg(flipArrow.rotation.y)+'°, facing '+deg(face)+'°');
// stick wobbling around center must not move it
const a0=flipArrow.rotation.y;for(let i=0;i<60;i++){pad.x=(i%2?.18:-.18);pad.z=(i%3-1)*.2;__step(1)}pad.x=pad.z=0;
out.push('stick wobble near center: arrow moved '+Math.abs(deg(flipArrow.rotation.y)-deg(a0))+'°');
// pushing up/diagonal (no left/right) must not snap it to the stick angle
pad.x=.2;pad.z=-.4;runN(20);pad.x=pad.z=0;out.push('stick pushed up: arrow still '+deg(flipArrow.rotation.y)+'° (no snap)');
// rotate with right for half a second, steadily
const steps=[];keys.KeyD=true;for(let i=0;i<30;i++){__step(1);steps.push(deg(flipArrow.rotation.y))}keys.KeyD=false;
const diffs=steps.slice(1).map((v,i)=>((steps[i]-v)+360)%360);out.push('rotating right: '+steps[0]+'° -> '+steps[29]+'°, per-frame change '+Math.min(...diffs)+'-'+Math.max(...diffs)+'°');
const ad=flipArrow.rotation.y;jumpBuf=.15;runN(3);const fd=Math.atan2(vel.x,vel.z);
out.push('flip went '+deg(fd)+'°, arrow said '+deg(ad)+'°, match='+(Math.abs(deg(fd)-deg(ad))<=1)+' | '+TR.names.join(','));
return out.join('\n')})()
