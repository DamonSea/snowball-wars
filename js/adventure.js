// Adventure mode: level reset/start, respawns and falls, cores, checkpoints, tutorial zones, the goal.
// ---------- ADVENTURE mode ----------
function resetAdv(){
  atime=0;falls=0;coreCount=0;lives=3;invuln=0;won=false;advT=0;stand=null;
  cores.forEach(c=>{c.got=false;c.g.visible=true});advHz.forEach(h=>{h.dead=0;h.g.visible=true});
  flags.forEach((f,i)=>{f.on=i===0;f.f.material=i===0?flagOn:flagOff});cp=flags[0];
  goal.on(false);lastZone=null;
  respawn(false);
}
function startAdv(lv=curIdx){clearSnow();useLevel(lv);mode='adv';setWorld('adv');[...orbs,...runHz].forEach(o=>rmObj(o.g));orbs=[];runHz=[];
  resetAdv();state='play';overlay(false);hud();hint(curL.intro);SFX.start()}
function respawn(count=true){ATK.t=0;CL.on=false;CL.top=false;P.position.set(cp.x,cp.y,cp.z+(cp===flags[0]?0:.8));py=cp.y;vy=0;vel.set(0,0,0);stand=null;invuln=1;resetAcro();if(count)lives=3;hud()}
function fall(){rumble(320,.6,.7);falls++;SFX.splash();shake=.25;respawn()}
function winAdv(){
  won=true;state='won';SFX.win();
  goal.on(true);hint(curL.winHint);
  const wasLocked=!unlocked(4),k=curL.key,nb=!bestA[k]||atime<bestA[k];if(nb){bestA[k]=atime;try{localStorage.setItem(k,atime)}catch(e){}}
  if(wasLocked&&unlocked(4))setTimeout(()=>{toast('New outfit unlocked: Golden Ace');SFX.unlock()},900);
  setTimeout(()=>{state='over';overlay(true,curL.winT,`Finished in ${fmt(atime)} with ${falls} fall${falls===1?'':'s'}.${nb?' New best time!':''}`,'Play again','Menu',()=>startAdv(),()=>menu())},2600);
}
function updateAdv(dt){
  advT+=dt;const shown=Math.floor(atime);atime+=dt;if(Math.floor(atime)!==shown)hud();
  if(!stepBody(dt,T.speed.adventure)){fall();return}
  // hazards
  for(const h of advHz){const p=h.g.position,ox=p.x,oz=p.z,[x,z]=h.f(advT);p.x=x;p.z=z;roll(h.g,(x-ox)/dt,(z-oz)/dt,dt);
    if(h.dead>0){h.dead-=dt;if(h.dead<=0){h.g.visible=true;burst(p.clone(),0x9aa3a8,8)}continue}
    if(attackHits(p,h.y-.75)){smash(p);h.dead=5;h.g.visible=false;continue}
    if(!invuln&&Math.abs(py-(h.y-.75))<1&&Math.hypot(x-P.position.x,z-P.position.z)<1.2){hurt(x,z,9);if(lives<=0){beep(140,.4,'sawtooth',.1);respawn();return}}}
  // cores
  for(const c of cores)if(!c.got&&Math.abs(py-c.y)<2&&Math.hypot(c.g.position.x-P.position.x,c.g.position.z-P.position.z)<1.2){
    c.got=true;c.g.visible=false;coreCount++;rumble(90,0,.5);burst(c.m.getWorldPosition(V(0,0,0)),0xffcc33,24);SFX.core();hud();
    hint(coreCount<3?`Core found! ${3-coreCount} to go`:curL.allMsg)}
  // checkpoints
  for(const f of flags)if(!f.on&&Math.abs(py-f.y)<1.5&&Math.hypot(f.x-P.position.x,f.z-P.position.z)<2){
    f.on=true;f.f.material=flagOn;cp=f;SFX.checkpoint();burst(V(f.x,f.y+1.9,f.z),0x5ff3ff,10)}
  // goal
  let zn=null;for(const q of zones)if(P.position.z<=q.z0&&P.position.z>q.z1&&py>=q.y-1.5&&(!zn||q.y>zn.y))zn=q;
  if(zn&&zn!==lastZone){lastZone=zn;hint(zn.t)}
  const onPad=Math.abs(py-goal.y)<.5&&Math.hypot(goal.x-P.position.x,goal.z-P.position.z)<1.6;
  if(onPad){if(coreCount===3)winAdv();else hint(curL.need(coreCount))}
}
