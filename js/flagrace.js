// Flag race (custom maps with Map settings → Flag race on and a Finish flag): the clock runs from the spawn point
// until you touch the Finish flag. Checkpoint flags turn green when you reach them and become where you come back
// to: when you run out of lives, or from the pause menu (Last checkpoint). Best times save per map.
const FR={on:false,t:0,done:false,cp:null,reached:0};
const raceKey=()=>'orbRunRace_'+runL.key;
const fmtRace=s=>`${Math.floor(s/60)}:${(s%60).toFixed(1).padStart(4,'0')}`;
function raceBest(){try{const v=+localStorage.getItem(raceKey());return v>0?v:null}catch(e){return null}}
function frReset(){FR.on=!!(runL&&runL.custom&&runL.finish);FR.t=0;FR.done=false;FR.reached=0;FR.cp=runL&&runL.spawn?{x:runL.spawn.x,y:runL.spawn.y||0,z:runL.spawn.z}:null;
  (runL&&runL.cps||[]).forEach(f=>{f.on=false;f.cm.color.setHex(0x2f6fd0)})}
// back to the last checkpoint (or the spawn point)
function frRespawn(msg){const c=FR.cp;if(!c)return;P.position.set(c.x,0,c.z);py=c.y;vy=0;vel.set(0,0,0);grounded=true;stand=null;resetPound();
  if(chars[ci].acro)resetAcro();CL.on=false;CL.top=false;LH.on=false;lives=3;invuln=1.2;dropCombo();hud();if(msg)toast(msg)}
function frUpdate(dt){if(!FR.on)return;
  for(const f of runL.cps.concat(runL.finish?[runL.finish]:[])){f.pv.rotation.y=Math.sin(advT*3+f.x)*.25;f.cloth.rotation.y=Math.sin(advT*6+f.z)*.12}
  if(FR.done||!runFree||runCD>0)return;FR.t+=dt;$('v2').textContent=fmtRace(FR.t);
  const near=f=>Math.hypot(P.position.x-f.x,P.position.z-f.z)<1.25&&py>f.y-.6&&py<f.y+3;
  for(const f of runL.cps)if(!f.on&&near(f)){f.on=true;f.cm.color.setHex(0x39c46b);FR.cp={x:f.x,y:f.y,z:f.z};FR.reached++;
    popScore('Checkpoint!');SFX.unlock();burst(V(f.x,f.y+2.4,f.z),0x39c46b,10)}
  if(near(runL.finish))frFinish()}
function frFinish(){FR.done=true;const t=FR.t,b=raceBest(),nb=!b||t<b;if(nb)try{localStorage.setItem(raceKey(),t.toFixed(2))}catch(e){}
  SFX.unlock();burst(V(runL.finish.x,runL.finish.y+3,runL.finish.z),0xffd84a,24);state='over';hint('');
  overlay(true,'Finished!',`${runL.name} in ${fmtRace(t)}.${nb?(b?' New best!':' First finish!'):' Best '+fmtRace(b)+'.'}${FR.reached?` Checkpoints ${FR.reached}/${runL.cps.length}.`:''}`,
    'Race again','Keep exploring',()=>startRun(true),()=>{state='play';overlay(false);hud()},
    ...(BLD.testing?['Back to builder',()=>backToBuilder()]:['Menu',()=>menu()]))}
// what free roam says on a custom map
function freeHint(){if(!runL.custom)return FREE_HINT;const a=[];
  if(FR.on)a.push('Flag race: reach the Finish flag'+(runL.cps.length?'; checkpoints save your spot':'')+'.');
  if(runL.spad)a.push('Stand on the START pad (or press Enter / △) for a 60-second orb run.');
  if(!FR.on||FR.done)a.push('Pause for Snowball Wars.');
  return a.join(' ')||'Explore and play around.'}
