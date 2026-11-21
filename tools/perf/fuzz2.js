(()=>{const rep=[];let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const solidHere=()=>{const x=P.position.x,z=P.position.z;return plats.find(p=>inside(p,x,z,-.05)&&topOf(p,x,z)>py+.55&&(botOf(p,x,z)===undefined||py+T.bodyH>botOf(p,x,z)+.1))};
const KEYS=['KeyW','KeyA','KeyS','KeyD'];const runs=[];[0,1,2,3].forEach(m=>runs.push(['run',m]));levels.forEach((L,i)=>runs.push(['adv',i]));
for(const[md,mapI]of runs)for(const c of[2,3,4,1]){menu();pickMode=md;pickLevel=mapI;ci=c;showChar();confirmChar();__step(10);
  let stuckIn=0,crouchStuck=0,frozen=0,hold={},log=[],lp=null;const nm=md==='run'?RUNMAPS[mapI].name:levels[mapI].name||('level '+mapI);
  for(let f=0;f<3000;f++){
    if(f%(8+Math.floor(rnd()*20))===0){hold={};if(rnd()<.85)hold[KEYS[Math.floor(rnd()*4)]]=true;if(rnd()<.3)hold[KEYS[Math.floor(rnd()*4)]]=true;__k(hold);}
    if(rnd()<.06)keys.ShiftLeft=!keys.ShiftLeft;
    if(rnd()<.05){jumpBuf=.15;keys.Space=true}else if(rnd()<.2)keys.Space=false;
    if(rnd()<.01)attackPress();if(rnd()<.006)groundPound();
    log.push(f+':'+[...Object.keys(hold),keys.ShiftLeft?'C':'',keys.Space?'J':''].join(''));if(log.length>10)log.shift();
    advHz.forEach&&advHz.forEach(h=>{h.g&&h.g.position.set(0,-50,0)});runHz.forEach(h=>{h.g.position.set(0,.75,60)});SB.stun=0;invuln=9;lives=9;
    const bx=P.position.x,bz=P.position.z;__step(1);if(state!=='play')break;
    const s=solidHere();if(s&&!CL.on&&!LH.on){if(++stuckIn===15)rep.push(`STUCK-IN-SOLID ${nm} ${chars[ci].name} f${f} at (${P.position.x.toFixed(2)},${py.toFixed(2)},${P.position.z.toFixed(2)}) plat ${JSON.stringify({x:s.x,z:s.z,w:s.w,d:s.d,r:s.r,top:s.top,bot:s.bot,mv:!!s.mv})} mode ${A.mode} | ${log.join(' ')}`)}else stuckIn=0;
    const cr=(A.mode==='crouch'||BS.on)&&!crouchHeld();if(cr){if(++crouchStuck===20)rep.push(`CROUCH-STUCK ${nm} ${chars[ci].name} f${f} mode ${A.mode} BS ${BS.on} g ${grounded} GP ${GP.st} | ${log.join(' ')}`)}else crouchStuck=0;
    const mv=Object.keys(hold).length>0&&grounded&&!keys.ShiftLeft&&ATK.t<=0&&!GP.st&&A.mode==='normal'&&!CL.on&&!LH.on;
    if(mv&&Math.hypot(P.position.x-bx,P.position.z-bz)<1e-4){if(++frozen===90)rep.push(`FROZEN ${nm} ${chars[ci].name} f${f} at (${P.position.x.toFixed(2)},${py.toFixed(2)},${P.position.z.toFixed(2)}) hold ${Object.keys(hold)} mode ${A.mode} stand ${stand?JSON.stringify({x:stand.x,z:stand.z,top:stand.top,k:stand.k}):'-'}`)}else frozen=0}
  __k({});keys.Space=keys.ShiftLeft=false}
return rep.length?rep.slice(0,14).join('\n'):'no problems found'})()
