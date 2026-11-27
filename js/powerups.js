// Power-ups for Snowball Wars: special pickups that show up now and then during a match.
// Snowball Frenzy (pickup): a few seconds of snowballs spraying out in every direction, free of charge.
// Blitz (pickup): like a Super Star. You're invincible, a little faster, and anyone you touch is knocked out.
// You're on Fire! (earned): two or more KOs within T.power.fireWindow seconds and every snowball you throw is a
// charged one until the timer runs out or you get knocked out. Each further KO while on fire tops the timer up.
// Only KOs of other players and computer players count (Winter Crew enemies aren't in a snowball fight anyway).
const PWR={box:null,next:0,frenzy:0,blitz:0,fire:0,kos:[],fa:0,ft:0,fx:0,bzSeq:0,aura:null};
const PWR_KINDS={
  frenzy:{name:'Snowball Frenzy',col:0x7fd8ff,hint:'Snowballs everywhere!'},
  blitz:{name:'Blitz',col:0xffd23a,hint:'Invincible! Touch anyone to knock them out'}};
const pwrGemGeo=keep(new THREE.OctahedronGeometry(.62,0)),pwrCoreGeo=keep(new THREE.IcosahedronGeometry(.28,0)),
  pwrAuraGeo=keep(new THREE.SphereGeometry(1,16,12));
// a hue that cycles over time, as a Color (hue to RGB by hand, s=1 l=.6)
function rainbow(t,o=0){const h=((t*1.6+o)%1+1)%1,f=n=>{const k=(n+h*12)%12;return Math.round(255*(.6-.4*Math.max(-1,Math.min(k-3,9-k,1))))};return new THREE.Color((f(0)<<16)|(f(8)<<8)|f(4))}

function pwrClear(){if(PWR.box)freeTree(PWR.box.g);PWR.box=null;PWR.frenzy=PWR.blitz=PWR.fire=0;PWR.kos=[];PWR.next=T.power.first;pwrAura(false);pwrBadge()}
function makePwrBox(){const kind=Math.random()<.5?'frenzy':'blitz',K=PWR_KINDS[kind],s=packSpot(),g=new THREE.Group();g.position.set(s.x,s.y,s.z);runL.grp.add(g);
  const b=new THREE.Group();b.position.y=1.1;g.add(b);
  const gm=new THREE.MeshStandardMaterial({color:K.col,emissive:K.col,emissiveIntensity:.6,roughness:.35,metalness:.1});
  const gem=new THREE.Mesh(pwrGemGeo,gm);gem.castShadow=true;b.add(gem);
  const core=new THREE.Mesh(pwrCoreGeo,new THREE.MeshBasicMaterial({color:0xffffff}));b.add(core);
  const rm=new THREE.MeshBasicMaterial({color:K.col,transparent:true,opacity:.9,side:THREE.DoubleSide});
  const ring=new THREE.Mesh(ringGeo,rm);ring.rotation.x=-PI/2;ring.position.y=.03;ring.visible=!s.air;ring.scale.setScalar(1.3);ring._s=1.3;g.add(ring);
  const bmM=new THREE.MeshBasicMaterial({color:K.col,transparent:true,opacity:.28,depthWrite:false,blending:THREE.AdditiveBlending});
  const bm=new THREE.Mesh(packBeamGeo,bmM);bm.position.y=7;bm.scale.set(1.6,1,1.6);g.add(bm);
  PWR.box={g,b,gem,gm,rm,bmM,ring,kind,x:s.x,y:s.y,z:s.z,t:0,life:T.power.life};
  toast(`A ${K.name} power-up appeared!`);SFX.ui(5)}

function pwrGet(kind){const K=PWR_KINDS[kind],P_=T.power;
  if(kind==='frenzy'){PWR.frenzy=P_.frenzy;PWR.ft=0}
  else{PWR.blitz=P_.blitz;WAR.inv=0;SB.stun=0}
  popScore(K.name+'!');toast(K.hint);SFX.start();SFX.orb(true);rumble(200,.6,.9);shake=Math.max(shake,.15);
  burst(V(P.position.x,py+1.2,P.position.z),K.col,22);burst(V(P.position.x,py+1.2,P.position.z),0xffffff,10);pwrBadge()}

// a KO I scored (wars.js award): two inside the window sets you on fire
function pwrKo(){if(!WAR.on)return;const now=WAR.t;PWR.kos=PWR.kos.filter(t=>t-now<=T.power.fireWindow);PWR.kos.push(now);
  if(PWR.fire>0){PWR.fire=T.power.fire;pwrBadge();return}
  if(PWR.kos.length>=2){PWR.fire=T.power.fire;popScore("You're on Fire!");toast('Every snowball is a charged snowball!');SFX.start();rumble(220,.7,1);
    burst(V(P.position.x,py+1.6,P.position.z),0xff7a1e,24);burst(V(P.position.x,py+1.6,P.position.z),0xffe25a,14);pwrBadge()}}
// I got knocked out: the fire goes out
function pwrDown(){if(PWR.fire>0){PWR.fire=0;toast('Your fire went out')}PWR.kos=[];PWR.frenzy=0;pwrBadge()}
const pwrCharged=()=>PWR.fire>0&&WAR.on;
const pwrShield=()=>PWR.blitz>0&&WAR.on;
const pwrSpeed=()=>PWR.blitz>0&&WAR.on?T.power.blitzSpeed:1;

// frenzy: snowballs out in every direction, a golden-angle spiral so they spread evenly
function frenzyThrow(){const f=PWR.fa;PWR.fa+=2.39996;const fx=Math.sin(f),fz=Math.cos(f),s=T.snow,up=s.lift+Math.random()*2.5,sp=s.speed*(.75+Math.random()*.3);
  const o=[P.position.x+fx*.55,py+1.3,P.position.z+fz*.55,fx*sp+vel.x*.4,up,fz*sp+vel.z*.4].map(f2),id=++SB.seq,ch=pwrCharged();
  launchSnowball(o,true,null,id,false,ch);warsThrew(id);if(ch)SB.chIds.add(id);
  SB.sent.push([id,...o,0,ch?1:0]);if(SB.sent.length>8)SB.sent.shift();
  if(Math.random()<.35)SFX.snowThrow();SB.anim=.12}

// blitz: anything I run into goes down, and computer players run for it when you get close
function blitzBots(){for(const b of WAR.bots){if(b.out>0||b.inv>0)continue;const d=Math.hypot(b.x-P.position.x,b.z-P.position.z);
    if(d<9&&b.out<=0){const a=Math.atan2(b.x-P.position.x,b.z-P.position.z);b.tx=b.x+Math.sin(a)*8;b.tz=b.z+Math.cos(a)*8;b.retarget=.6;b.target=null}
    if(d>1.25||Math.abs(b.y-py)>2)continue;
    const dx=(b.x-P.position.x)/(d||1),dz=(b.z-P.position.z)/(d||1);b.vx=dx*T.snow.hitKnock*1.4;b.vz=dz*T.snow.hitKnock*1.4;b.vy=T.snow.hitLift*1.3;
    b.hp=0;b.last='me';b.out=T.wars.respawn;b.face=Math.atan2(-dx,-dz);b.stun=0;award('me',true,false);
    SFX.hit();SFX.hurt();hitStop=.08;shake=Math.max(shake,.25);rumble(160,.8,1);burst(V(b.x,1.2,b.z),0xffffff,22);burst(V(b.x,1.2,b.z),rainbow(tAll).getHex(),12);toast(`You blitzed ${b.name}!`)}}

// someone else's Blitz (they send bz in presence): touching them knocks me out
function pwrFromPeer(peer,a,pr){const on=pr.bz===1&&WAR.on;
  if(on){if(!a.pwrAura){a.pwrAura=new THREE.Mesh(pwrAuraGeo,new THREE.MeshBasicMaterial({color:0xffd23a,transparent:true,opacity:.22,depthWrite:false,blending:THREE.AdditiveBlending}));a.pwrAura.position.y=1;a.pwrAura.scale.set(.85,1.25,.85);a.g.add(a.pwrAura)}
    a.pwrAura.visible=true;a.pwrAura.material.color.copy(rainbow(tAll));
    const g=a.g.position;if(state==='play'&&WAR.out<=0&&!warsShielded()&&Math.hypot(g.x-P.position.x,g.z-P.position.z)<1.25&&Math.abs(g.y-py)<2)
      hitMe(peer.peer,-(++PWR.bzSeq),g.x,g.z,false,true,WAR.hp)}
  else if(a.pwrAura)a.pwrAura.visible=false}

function pwrAura(on){if(on&&!PWR.aura){PWR.aura=new THREE.Mesh(pwrAuraGeo,new THREE.MeshBasicMaterial({color:0xffd23a,transparent:true,opacity:.32,depthWrite:false,blending:THREE.AdditiveBlending}));PWR.aura.scale.set(.85,1.25,.85);scene.add(PWR.aura)}
  if(PWR.aura)PWR.aura.visible=!!on}

// the badge under the scoreboard: what's active and how long is left
function pwrBadge(){const e=$('pwrBadge');if(!e)return;const L=[];
  if(PWR.blitz>0)L.push(['blitz','Blitz',PWR.blitz/T.power.blitz]);
  if(PWR.frenzy>0)L.push(['frenzy','Snowball Frenzy',PWR.frenzy/T.power.frenzy]);
  if(PWR.fire>0)L.push(['fire',"On Fire",PWR.fire/T.power.fire]);
  if(!L.length||!WAR.on){e.classList.remove('on');e.innerHTML='';return}
  e.innerHTML=L.map(([k,n,f])=>`<div class="pw ${k}"><b>${n}</b><i style="width:${Math.round(Math.max(0,f)*100)}%"></i></div>`).join('');e.classList.add('on')}

function pwrUpdate(dt){
  if(!WAR.on){if(PWR.box||PWR.frenzy||PWR.blitz||PWR.fire)pwrClear();return}
  if(state!=='play')return;
  const live=WAR.cd<=0&&WAR.t>0;let badge=false;
  // the pickup: wait, appear, bob, blink out if nobody takes it
  if(!PWR.box&&live&&(PWR.next-=dt)<=0)makePwrBox();
  const B=PWR.box;if(B){B.t+=dt;B.life-=dt;B.b.position.y=1.3+Math.sin(B.t*2.6)*.2;B.gem.rotation.y+=dt*2.2;B.gem.rotation.x=Math.sin(B.t*1.3)*.4;packPulse(B.ring,B.t);
    if(B.kind==='blitz'){const c=rainbow(B.t);B.gm.color.copy(c);B.gm.emissive.copy(c);B.rm.color.copy(c);B.bmM.color.copy(c)}
    B.g.visible=B.life>3||Math.floor(B.t*8)%2===0;
    if(WAR.out<=0&&Math.hypot(B.x-P.position.x,B.z-P.position.z)<1.2&&Math.abs(py-B.y)<1.8){freeTree(B.g);PWR.box=null;PWR.next=T.power.every;pwrGet(B.kind)}
    else if(B.life<=0){burst(V(B.x,B.y+1,B.z),0xffffff,8);freeTree(B.g);PWR.box=null;PWR.next=T.power.every*.5}}
  // timers
  if(PWR.frenzy>0){PWR.frenzy=Math.max(0,PWR.frenzy-dt);badge=true;
    if(WAR.out<=0&&live){PWR.ft-=dt;while(PWR.ft<=0){PWR.ft+=T.power.frenzyRate;frenzyThrow()}}
    if(PWR.frenzy<=0)toast('Frenzy over')}
  if(PWR.blitz>0){PWR.blitz=Math.max(0,PWR.blitz-dt);badge=true;if(live&&WAR.out<=0)blitzBots();if(PWR.blitz<=0){WAR.inv=Math.max(WAR.inv,.8);toast('Blitz over')}}
  if(PWR.fire>0){PWR.fire=Math.max(0,PWR.fire-dt);badge=true;if(PWR.fire<=0)toast('You cooled off')}
  pwrAura(PWR.blitz>0&&WAR.out<=0);
  if(PWR.aura&&PWR.aura.visible){PWR.aura.position.set(P.position.x,py+1,P.position.z);PWR.aura.material.color.copy(rainbow(tAll));PWR.aura.scale.set(.85,1.25+.06*Math.sin(tAll*14),.85)}
  // sparkles: rainbow for Blitz, flames off your head when on fire, flecks of snow in a Frenzy
  if((PWR.fx-=dt)<=0&&WAR.out<=0&&(PWR.blitz>0||PWR.fire>0||PWR.frenzy>0)){PWR.fx=.07;const x=P.position.x,z=P.position.z;
    if(PWR.blitz>0)burst(V(x+(Math.random()-.5)*.9,py+.3+Math.random()*1.8,z+(Math.random()-.5)*.9),rainbow(tAll,Math.random()*.3).getHex(),2);
    if(PWR.fire>0)burst(V(x+(Math.random()-.5)*.35,py+2.05,z+(Math.random()-.5)*.35),Math.random()<.5?0xff6a1a:0xffc23a,2);
    if(PWR.frenzy>0)burst(V(x,py+1.3,z),0xdff4ff,1)}
  if(badge||$('pwrBadge')?.classList.contains('on'))pwrBadge()}
