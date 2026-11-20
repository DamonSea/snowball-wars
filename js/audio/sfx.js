// Sound engine (Web Audio, no files): buses, tone/noise synths, loops, the configurable
// sound-effect library (SFXV / SFX) and mute.
// ---------- procedural sound engine (Web Audio; no files needed) ----------
const AU={ctx:null,master:null,noise:null,muted:false,vol:.8,vMus:.55,vSfx:1,vAmb:.8,loops:{}};
try{AU.muted=localStorage.getItem('orbRunMute')==='1'}catch(e){}
function au(){
  if(!AU.ctx){try{const C=window.AudioContext||window.webkitAudioContext;const c=new C();AU.ctx=c;
    const comp=c.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=4;comp.connect(c.destination);
    AU.master=c.createGain();AU.master.gain.value=AU.muted?0:AU.vol;AU.master.connect(comp);
    for(const[k,v]of[['sfx','vSfx'],['mus','vMus'],['amb','vAmb']]){AU[k]=c.createGain();AU[k].gain.value=AU[v];AU[k].connect(AU.master)}
    const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.noise=b}catch(e){return null}}
  if(AU.ctx.state==='suspended')AU.ctx.resume().catch(()=>{});return AU.ctx}
function env(g,t,a,dur,vol){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(vol,.0002),t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur)}
// tone: pitch sweep f -> f2 (0 = steady). o: type, vol, a(attack), delay, vib(Hz), bend(fraction of dur to reach f2)
function tone(f,f2,dur,o={}){if(AU.muted)return;const c=au();if(!c)return;const t=c.currentTime+(o.delay||0);
  const osc=c.createOscillator(),g=c.createGain();osc.type=o.type||'sine';osc.frequency.setValueAtTime(f,t);
  if(f2&&f2!==f)osc.frequency.exponentialRampToValueAtTime(f2,t+dur*(o.bend||1));
  if(o.vib){const l=c.createOscillator(),lg=c.createGain();l.frequency.value=o.vib;lg.gain.value=f*.05;l.connect(lg).connect(osc.frequency);l.start(t);l.stop(t+dur+.02)}
  env(g,t,o.a||.005,dur,o.vol||.2);osc.connect(g).connect(o.bus||AU.sfx);osc.start(t);osc.stop(t+dur+.03)}
// noise: filtered white noise with a moving filter. o: ft(filter type), f, f2, q, vol, a, delay
function noise(dur,o={}){if(AU.muted)return;const c=au();if(!c)return;const t=c.currentTime+(o.delay||0);
  const src=c.createBufferSource();src.buffer=AU.noise;src.loop=true;
  const fl=c.createBiquadFilter();fl.type=o.ft||'bandpass';fl.frequency.setValueAtTime(o.f||1000,t);if(o.f2)fl.frequency.exponentialRampToValueAtTime(o.f2,t+dur);fl.Q.value=o.q||1;
  const g=c.createGain();env(g,t,o.a||.005,dur,o.vol||.2);src.connect(fl).connect(g).connect(o.bus||AU.sfx);src.start(t,Math.random()*.5);src.stop(t+dur+.03)}
function loopNoise(key,on,o={}){const L=AU.loops[key];if(on===!!L)return;
  if(on){if(AU.muted)return;const c=au();if(!c)return;const src=c.createBufferSource();src.buffer=AU.noise;src.loop=true;
    const fl=c.createBiquadFilter();fl.type=o.ft||'bandpass';fl.frequency.value=o.f||2500;fl.Q.value=o.q||2;
    const g=c.createGain();g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(o.vol||.08,c.currentTime+.06);
    src.connect(fl).connect(g).connect(AU.sfx);src.start();AU.loops[key]={src,g}}
  else{const c=AU.ctx;L.g.gain.cancelScheduledValues(c.currentTime);L.g.gain.setTargetAtTime(.0001,c.currentTime,.04);L.src.stop(c.currentTime+.25);delete AU.loops[key]}}
function beep(f,d=.12,type='sine',vol=.12){tone(f,f*1.5,d,{type,vol})}
// browsers only start audio after a user gesture: unlock on the first click, tap or key
['pointerdown','keydown','touchstart'].forEach(t=>addEventListener(t,()=>{if(!AU.muted)au()},{once:true,passive:true}));
const jit=()=>1+(Math.random()-.5)*.08;
const retro=(f,d=.1,type='square',vol=.05)=>tone(f,f*1.5,d,{type,vol}); // the original simple beeps
// Every configurable sound: label, options [name, fn], and a preview. Option -1 = Off.
const SFXV={
  step:{label:'Footsteps',opts:[
    ['Soft',k=>{const r=jit();if(k===3){noise(.18,{ft:'highpass',f:3000*r,f2:5600,vol:.06});return}if(WIN&&k===0){noise(.085,{ft:'lowpass',f:2600*r,f2:850,q:.6,vol:.095});noise(.05,{ft:'highpass',f:5200,vol:.022});tone(140*r,70,.05,{vol:.04});return}if(k===2){tone(1500*r,950,.035,{type:'square',vol:.022});tone(95,60,.05,{vol:.08});return}
      noise(.055,{f:k?2700*r:1100*r,f2:k?1700:650,q:k?1.3:.7,vol:k?.075:.06});tone(115*r,60,.06,{vol:.07})}],
    ['Tap',k=>noise(.03,{ft:'highpass',f:(k?4200:3200)*jit(),vol:.05})],
    ['Retro',k=>tone((k===2?320:220)*jit(),150,.03,{type:'square',vol:.03})]],
    prev:p=>[0,.28,.56].forEach(d=>setTimeout(()=>p(0),d*1000))},
  jump:{label:'Jump',opts:[
    ['Hup',n=>{const r=jit();
      if(n<=1){tone(300*r,580*r,.13,{vol:.13});noise(.1,{f:900,f2:2400,vol:.035})}
      else if(n===2){tone(380*r,780*r,.14,{vol:.13});tone(1320,0,.2,{type:'triangle',vol:.05,delay:.05});tone(1760,0,.16,{type:'triangle',vol:.035,delay:.11});noise(.12,{f:1200,f2:3200,vol:.04})}
      else{tone(420,1000,.26,{vol:.14,vib:9,bend:.55});tone(660,1320,.3,{type:'triangle',vol:.05,delay:.08});noise(.42,{f:500,f2:2800,q:.7,vol:.07,a:.03})}}],
    ['Boing',n=>{const b=1+(n-1)*.25;tone(180*b,520*b,.26,{vol:.13,vib:14,bend:.5});if(n>=3)tone(520,1040,.3,{type:'triangle',vol:.05,delay:.1})}],
    ['Retro',n=>retro(420+Math.max(1,n)*120)]],
    prev:p=>[1,2,3].forEach((n,i)=>setTimeout(()=>p(n),i*420))},
  land:{label:'Landing',opts:[
    ['Thud',v=>{const s=Math.min(1,Math.max(.2,v/15));tone(150,46,.12+s*.12,{vol:.1+s*.2});noise(.07+s*.1,{ft:'lowpass',f:900,f2:280,vol:.04+s*.1})}],
    ['Puff',v=>{const s=Math.min(1,Math.max(.2,v/15));noise(.1+s*.08,{ft:'lowpass',f:700,f2:220,vol:.03+s*.08})}],
    ['Retro',v=>tone(170,110,.06,{type:'square',vol:.04})]],
    prev:p=>{p(6);setTimeout(()=>p(15),450)}},
  crouch:{label:'Crouch',opts:[
    ['Rustle',()=>{noise(.08,{ft:'highpass',f:2800,vol:.035});tone(180,120,.06,{vol:.04})}],
    ['Squish',()=>tone(260,130,.1,{vol:.08})],
    ['Retro',()=>retro(200,.06)]],prev:p=>p()},
  skid:{label:'Skid',opts:[
    ['Screech',()=>{noise(.36,{f:3300,f2:1400,q:4,vol:.12});tone(1550,950,.32,{type:'sawtooth',vol:.016})}],
    ['Dusty',()=>noise(.36,{ft:'lowpass',f:1300,f2:380,vol:.12})],
    ['Retro',()=>retro(320,.2,'sawtooth',.035)]],prev:p=>p()},
  flip:{label:'Side flip & backflip',opts:[
    ['Whoosh',b=>{if(b){noise(.5,{f:400,f2:3200,q:1.1,vol:.1,a:.05});tone(330,760,.26,{vol:.12,vib:7})}else{noise(.44,{f:450,f2:3000,q:1.1,vol:.09,a:.05});tone(480,1150,.22,{vol:.11})}}],
    ['Spin',b=>[0,.09,.18].forEach((d,i)=>tone((b?500:600)+i*180,(b?900:1100)+i*220,.08,{type:'triangle',vol:.06,delay:d}))],
    ['Retro',b=>retro(b?760:700,.15)]],prev:p=>{p(0);setTimeout(()=>p(1),600)}},
  longJump:{label:'Long jump',opts:[
    ['Whoosh',()=>{tone(250,520,.22,{vol:.14});noise(.6,{f:650,f2:2300,q:.8,vol:.08,a:.04})}],
    ['Boost',()=>{tone(200,900,.35,{type:'sawtooth',vol:.035});noise(.45,{f:900,f2:4000,q:2,vol:.07})}],
    ['Retro',()=>retro(380,.2,'triangle',.07)]],prev:p=>p()},
  dive:{label:'Dive',opts:[
    ['Swoop',()=>{tone(560,230,.24,{vol:.12});noise(.38,{f:2800,f2:550,q:1,vol:.11})}],
    ['Jet',()=>noise(.42,{f:600,f2:3600,q:2,vol:.1})],
    ['Retro',()=>{retro(250,.15,'triangle',.08);retro(180,.25,'sawtooth',.03)}]],prev:p=>p()},
  slide:{label:'Belly slide',opts:[
    ['Rumble',()=>{noise(.55,{ft:'lowpass',f:1500,f2:260,vol:.13});tone(90,55,.3,{vol:.06})}],
    ['Swish',()=>noise(.42,{f:2100,f2:600,vol:.08})],
    ['Retro',()=>retro(160,.15,'triangle',.08)]],prev:p=>p()},
  wallKick:{label:'Wall jump',opts:[
    ['Kick',()=>{noise(.04,{ft:'highpass',f:2400,vol:.13});tone(210,85,.09,{vol:.16});tone(380,760,.12,{vol:.1,delay:.02})}],
    ['Boing',()=>tone(300,900,.2,{vol:.11,vib:16,bend:.6})],
    ['Retro',()=>retro(640,.1,'square',.06)]],prev:p=>p()},
  wallSlide:{label:'Wall slide',loop:true,opts:[
    ['Scrape',{f:3200,q:1.4,vol:.07}],['Soft',{ft:'lowpass',f:900,q:.7,vol:.06}]],
    prev:o=>noise(.7,Object.assign({a:.05},o))},
  swing:{label:'Attack swings',opts:[
    ['Swish',n=>{const big=n>=3;noise(big?.26:.12,{f:1100,f2:big?4200:3300,q:1.5,vol:big?.11:.07});if(big)tone(300,600,.2,{vol:.07})}],
    ['Whip',n=>{noise(n>=3?.12:.06,{ft:'highpass',f:4200,vol:.09});tone(n>=3?900:1200,n>=3?400:700,.06,{type:'triangle',vol:.04})}],
    ['Retro',n=>n>=3?retro(300,.2,'triangle',.06):retro(520+n*90,.09,'triangle',.06)]],
    prev:p=>[1,2,3].forEach((n,i)=>setTimeout(()=>p(n),i*260))},
  hit:{label:'Spikeball smash',opts:[
    ['Crunch',()=>{tone(170,48,.16,{vol:.26});noise(.13,{ft:'lowpass',f:2600,f2:380,vol:.2});tone(950,280,.07,{type:'square',vol:.04})}],
    ['Pop',()=>{tone(620,180,.1,{type:'triangle',vol:.14});noise(.05,{ft:'highpass',f:3000,vol:.08})}],
    ['Retro',()=>{retro(180,.12,'square',.09);setTimeout(()=>retro(90,.15,'sawtooth',.06),40)}]],prev:p=>p()},
  hurt:{label:'Getting hit',opts:[
    ['Oof',()=>{tone(430,150,.26,{type:'triangle',vol:.15,vib:12});noise(.1,{ft:'lowpass',f:1200,vol:.08})}],
    ['Retro',()=>retro(140,.3,'sawtooth',.1)]],prev:p=>p()},
  splash:{label:'Falling in water',opts:[
    ['Splash',()=>{noise(.75,{ft:'lowpass',f:2400,f2:240,vol:.2,a:.01});for(let i=0;i<6;i++){const f=500+Math.random()*900;tone(f,f*1.7,.05,{vol:.035,delay:.14+i*.07})}}],
    ['Retro',()=>retro(180,.35,'sine',.12)]],prev:p=>p()},
  ready:{label:'Triple-jump cue',opts:[
    ['Ding',()=>{tone(1568,0,.32,{vol:.09});tone(2352,0,.26,{vol:.03})}],
    ['Retro',()=>retro(1175,.12,'triangle',.07)]],prev:p=>p()},
  roll:{label:'Spikeball rolling',live:true,opts:[['Rumble & clicks',0],['Rumble only',0]],prev:()=>{}},
  pickup:{label:'Pickups & checkpoints',opts:[
    ['Chimes',(t,g)=>{if(t==='core')[784,988,1175,1568].forEach((f,i)=>tone(f,0,.24,{type:'triangle',vol:.08,delay:i*.07}));
      else if(t==='cp'){tone(880,0,.28,{type:'triangle',vol:.08});tone(1318,0,.38,{type:'triangle',vol:.06,delay:.09})}
      else if(g)[1046,1318,1568].forEach((f,i)=>tone(f,0,.18,{type:'triangle',vol:.08,delay:i*.06}));else tone(988*jit(),1318,.1,{type:'triangle',vol:.08})}],
    ['Retro',(t,g)=>retro(t==='core'?880:t==='cp'?600:g?880:660,.15,'triangle',.1)]],
    prev:p=>{p('orb');setTimeout(()=>p('core'),350);setTimeout(()=>p('cp'),900)}}
};
let sfxSel={};try{sfxSel=JSON.parse(localStorage.getItem('orbRunSfx')||'{}')||{}}catch(e){}
const selOf=k=>{const i=sfxSel[k];return i===-1?-1:SFXV[k].opts[i]?i:0};
function play(k,...a){const i=selOf(k);if(i<0)return;SFXV[k].opts[i][1](...a)}
const SFX={
  step:k=>play('step',k),jump:n=>play('jump',n),
  robotJump(){const i=selOf('jump');if(i<0)return;if(i===0){tone(480,920,.12,{type:'square',vol:.045});tone(240,460,.12,{vol:.1})}else SFXV.jump.opts[i][1](1)},
  land:v=>play('land',v),crouch:()=>play('crouch'),skid:()=>play('skid'),flip:()=>play('flip',0),backflip:()=>play('flip',1),
  longJump:()=>play('longJump'),dive:()=>play('dive'),slide:()=>play('slide'),wallKick:()=>play('wallKick'),
  swing:n=>play('swing',n),hit:()=>play('hit'),hurt:()=>play('hurt'),splash:()=>play('splash'),ready:()=>play('ready'),
  orb:g=>play('pickup','orb',g),core:()=>play('pickup','core'),checkpoint:()=>play('pickup','cp'),
  grab(){noise(.12,{f:1800,f2:900,q:.8,vol:.07});tone(220,330,.08,{vol:.06})},
  climb(){noise(.09,{f:WIN?3200:2200,f2:WIN?1800:1200,q:.9,vol:.045})},
  tada(){[784,1175,1568].forEach((f,i)=>tone(f,0,.22,{type:'triangle',vol:.07,delay:i*.07}));tone(500,900,.18,{vol:.06})},
  snowThrow(){noise(.12,{f:900,f2:2600,q:1.2,vol:.06});tone(260,420,.08,{vol:.05})},
  splat(big){noise(big?.22:.14,{ft:'lowpass',f:2400,f2:500,vol:big?.16:.1});tone(140,70,.08,{vol:big?.12:.06})},
  board(v){const s=Math.min(1,v/12);tone(120,60,.12,{vol:.1+s*.15});noise(.1,{ft:'lowpass',f:1400,vol:.06+s*.08})},
  ui(i=0){tone(620+i*70,0,.05,{type:'triangle',vol:.05})},
  deny(){tone(180,140,.12,{type:'square',vol:.04})},
  start(){tone(523,0,.1,{type:'triangle',vol:.07});tone(784,0,.16,{type:'triangle',vol:.07,delay:.08})},
  win(){[523,659,784,1046].forEach((f,i)=>tone(f,0,.32,{type:'triangle',vol:.09,delay:i*.12}))},
  unlock(){[784,1046,1318,1568,2093].forEach((f,i)=>tone(f,0,.25,{type:'triangle',vol:.07,delay:i*.07}))}
};
function previewSfx(k){const S=SFXV[k],i=selOf(k);if(i<0)return;
  if(k==='roll'){const c=au();if(!c)return;const g=c.createGain();g.gain.value=0;g.connect(AU.sfx);const s=c.createBufferSource();s.buffer=AU.noise;s.loop=true;const fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=380;fl.Q.value=2;s.connect(fl).connect(g);g.gain.setTargetAtTime(.2,c.currentTime,.25);g.gain.setTargetAtTime(.0001,c.currentTime+.9,.2);s.start();s.stop(c.currentTime+1.6);
    if(i===0)for(let n=0;n<10;n++)noise(.025,{ft:'highpass',f:4200,vol:.05,delay:.1+n*.13});return}const o=S.opts[i][1];if(S.loop)S.prev(o);else S.prev(o)}
try{const v=localStorage.getItem('orbRunVol');if(v!==null)AU.vol=Math.min(1,Math.max(0,+v));
  for(const k of['vMus','vSfx','vAmb']){const x=localStorage.getItem('orbRun_'+k);if(x!==null)AU[k]=Math.min(1,Math.max(0,+x))}}catch(e){}
function setMute(m){AU.muted=m;try{localStorage.setItem('orbRunMute',m?'1':'0')}catch(e){}
  if(AU.master)AU.master.gain.setTargetAtTime(m?0:AU.vol,AU.ctx.currentTime,.02);if(m)Object.keys(AU.loops).forEach(k=>loopNoise(k,false));
  const sm=document.getElementById('setMute');if(sm)sm.textContent=m?'Unmute':'Mute';
  const b=document.getElementById('snd');if(b){b.classList.toggle('off',m);b.setAttribute('aria-pressed',String(m));b.title=m?'Sound off (M)':'Sound on (M)'}}
