// Music sequencer (looping tracks, picked in Settings → Menu music / Trick Park music), ambience (ocean, wind, birds) and the
// proximity-based spikeball rolling sound. audioFrame() runs once per frame.
// ---------- music, ambience and spikeball rolling ----------
const mtof=n=>440*Math.pow(2,(n-69)/12);
const QUAL={M:[0,4,7],m:[0,3,7],M7:[0,4,7,11],m7:[0,3,7,10],7:[0,4,7,10]};
// Each track: tempo, chord loop [root MIDI, quality], 16-step patterns per bar.
// bass: r root, f fifth, o octave, t third. lead: [step, chord-tone index] motif, varied in the second half.
const TRACKS={
  menu:{bpm:92,swing:.12,bars:[[62,'M7'],[59,'m7'],[55,'M7'],[57,'7']],vol:.9,pad:.022,
    bass:'r.......f.......',kick:'x.........x.....',snare:'................',hat:'..x...x...x...x.',
    arp:true,lead:[],leadType:'pluck'},
  run:{bpm:136,swing:0,bars:[[57,'m'],[53,'M'],[48,'M'],[55,'M']],vol:.8,pad:.014,
    bass:'r.r.o.r.r.r.o.f.',kick:'x...x...x...x...',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',
    lead:[[0,2],[2,1],[3,2],[6,3],[8,2],[10,1],[11,0],[14,1]],leadType:'square'},
  isles:{bpm:112,swing:.16,bars:[[53,'M'],[48,'M'],[50,'m'],[46,'M']],vol:.85,pad:.016,
    bass:'r..r..f.o..r..f.',kick:'x.....x...x.....',snare:'....x.......x...',hat:'xxxxxxxxxxxxxxxx',rim:true,
    lead:[[0,0],[3,2],[6,1],[8,3],[11,2],[14,1]],leadType:'pluck'},
  sky:{bpm:124,swing:0,bars:[[52,'m'],[48,'M'],[55,'M'],[50,'M']],vol:.8,pad:.02,
    bass:'r.r.o.r.r.r.o.rf',kick:'x..x..x.x..x..x.',snare:'....x.......x..x',hat:'..x...x...x...x.',
    lead:[[0,0],[4,2],[6,1],[8,3],[12,2],[14,4]],leadType:'square'},
  // more to pick from: a lazy cocoa-break groove, a dreamy northern-lights arpeggio, a jingly sprint, a minor-key driver
  cocoa:{bpm:84,swing:.18,bars:[[57,'m7'],[50,'7'],[55,'M7'],[52,'m7']],vol:.85,pad:.02,
    bass:'r.....f...r...t.',kick:'x......x..x.....',snare:'....x.......x...',hat:'..x...x...x...x.',rim:true,
    lead:[[0,2],[3,3],[7,1],[10,2],[12,4]],leadType:'pluck'},
  aurora:{bpm:100,swing:0,bars:[[60,'M7'],[64,'m7'],[57,'m7'],[65,'M7']],vol:.85,pad:.024,
    bass:'r.......o.......',kick:'x.......x.......',snare:'................',hat:'....x.......x...',
    arp:true,lead:[[0,4],[6,3],[12,2]],leadType:'pluck'},
  jingle:{bpm:144,swing:0,bars:[[55,'M'],[60,'M'],[62,'7'],[55,'M']],vol:.78,pad:.012,
    bass:'r...f...r...f...',kick:'x...x...x...x...',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',
    lead:[[0,2],[2,2],[4,2],[8,2],[10,2],[12,2],[14,4]],leadType:'square'},
  frost:{bpm:128,swing:0,bars:[[50,'m'],[46,'M'],[53,'M'],[48,'M']],vol:.8,pad:.016,
    bass:'r.ro.r.rr.ro.r.f',kick:'x..x..x...x..x..',snare:'....x.......x...',hat:'xxxxxxxxxxxxxxxx',rim:true,
    lead:[[0,0],[3,1],[6,2],[8,4],[11,3],[14,2]],leadType:'square'}
};
// what plays where (Settings). The originals stay the defaults; Shuffle moves on to another track every two loops.
const MUSIC_MENU=[['menu','Classic'],['cocoa','Cocoa Break'],['aurora','Aurora'],['off','Off']];
const MUSIC_PARK=[['run','Classic'],['shuffle','Shuffle'],['isles','Island Hop'],['sky','Sky Climb'],['jingle','Jingle Rush'],['frost','Frostbite'],['cocoa','Cocoa Break'],['aurora','Aurora'],['off','Off']];
const MUSC={menu:'menu',park:'run'};try{const a=localStorage.getItem('orbRunMusMenu'),b=localStorage.getItem('orbRunMusPark');
  if(MUSIC_MENU.some(o=>o[0]===a))MUSC.menu=a;if(MUSIC_PARK.some(o=>o[0]===b))MUSC.park=b}catch(e){}
function setMusicPick(where,v){MUSC[where]=v;try{localStorage.setItem(where==='menu'?'orbRunMusMenu':'orbRunMusPark',v)}catch(e){}}
const SHUF={pool:['run','isles','sky','jingle','frost','cocoa','aurora'],i:0,loops:0};
function parkTrack(){const p=MUSC.park;if(p==='off')return null;if(p!=='shuffle')return p;return SHUF.pool[SHUF.i%SHUF.pool.length]}
const MUS={name:null,want:null,track:null,g:null,next:0,step:0,duck:1};
function mOsc(t,f,dur,type,vol,cut,a=.005,bus){const c=AU.ctx,o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();
  o.type=type;o.frequency.setValueAtTime(f,t);fl.type='lowpass';fl.frequency.value=cut;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(fl).connect(g).connect(bus||MUS.g);o.start(t);o.stop(t+dur+.05)}
function mNoise(t,dur,ft,f,vol,bus){const c=AU.ctx,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=AU.noise;
  fl.type=ft;fl.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(fl).connect(g).connect(bus||MUS.g);s.start(t,Math.random()*.5);s.stop(t+dur+.05)}
function mKick(t,v=.5){const c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.16);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.2);o.connect(g).connect(MUS.g);o.start(t);o.stop(t+.25)}
function scheduleStep(step,t){
  const T=MUS.track,s=step%16,bar=Math.floor(step/16),half=bar>=T.bars.length,[root,q]=T.bars[bar%T.bars.length],iv=QUAL[q];
  const spb=60/T.bpm/4,tones=[];for(let o=0;o<3;o++)iv.forEach(x=>tones.push(root+12+x+o*12));
  if(s===0&&T.pad)iv.forEach(x=>mOsc(t,mtof(root+x),spb*16,'sawtooth',T.pad,900,.35));
  const b=T.bass[s];if(b!=='.'){const n=root-12+({r:0,f:7,o:12,t:iv[1]}[b]||0);mOsc(t,mtof(n),spb*1.8,'triangle',.16,700)}
  if(T.arp&&s%2===0){const idx=[0,1,2,3,2,1,2,4][(s/2)%8];mOsc(t,mtof(tones[idx]+12),spb*2.2,'triangle',.045,3000)}
  for(const[st,ti]of T.lead)if(st===s){const n=tones[(ti+(half?2:0))%tones.length]+12;
    if(T.leadType==='pluck')mOsc(t,mtof(n),spb*2.5,'triangle',.07,4000);else mOsc(t,mtof(n),spb*1.6,'square',.035,2200)}
  if(T.kick[s]==='x')mKick(t,.45);
  if(T.snare[s]==='x'||(half&&bar===T.bars.length*2-1&&s>=13)){if(T.rim)mNoise(t,.05,'bandpass',2600,.09);else{mNoise(t,.13,'bandpass',1800,.16);mOsc(t,190,.07,'triangle',.08,800)}}
  if(WIN){if(s%2===0)mNoise(t,.09,'bandpass',9500,.022);if(s===0||s===8||(s===12&&bar%2))mOsc(t,mtof(tones[(bar+s/4)%tones.length]+24),1.1,'sine',.028,9000,.003)}
  if(T.hat[s]==='x')mNoise(t,T.rim?.03:.035,'highpass',T.rim?6000:7500,T.rim?.022:.04);
}
function musTick(){
  const c=AU.ctx;if(!c||c.state!=='running')return;
  if(MUS.want!==MUS.name){
    if(MUS.g){const old=MUS.g;old.gain.setTargetAtTime(.0001,c.currentTime,.25);setTimeout(()=>old.disconnect(),1500)}
    MUS.name=MUS.want;MUS.track=MUS.want?TRACKS[MUS.want]:null;MUS.g=null;
    if(MUS.track){MUS.g=c.createGain();MUS.g.gain.value=.0001;MUS.g.gain.setTargetAtTime(MUS.track.vol*MUS.duck,c.currentTime,.4);MUS.g.connect(AU.mus);MUS.step=0;MUS.next=c.currentTime+.1}}
  if(!MUS.track)return;
  MUS.g.gain.setTargetAtTime(MUS.track.vol*MUS.duck,c.currentTime,.15);
  const T=MUS.track,spb=60/T.bpm/4,len=T.bars.length*32;
  if(MUS.next<c.currentTime-.3)MUS.next=c.currentTime+.05; // tab was in the background: resync
  while(MUS.next<c.currentTime+.15){scheduleStep(MUS.step,MUS.next);
    MUS.next+=spb*(T.swing?(MUS.step%2?1-T.swing:1+T.swing):1);MUS.step=(MUS.step+1)%len;
    if(MUS.step===0&&MUSC.park==='shuffle'&&MUS.name===parkTrack()&&++SHUF.loops>=2){SHUF.loops=0;SHUF.i++}}
}
setInterval(musTick,25);
// ambience: ocean swell, wind with altitude, birds
const AMB={on:false,ocean:null,wind:null,windF:null,birdT:3};
function startAmb(){const c=AU.ctx;if(!c||AMB.on)return;AMB.on=true;
  const mk=(ft,f,q)=>{const s=c.createBufferSource();s.buffer=AU.noise;s.loop=true;const fl=c.createBiquadFilter();fl.type=ft;fl.frequency.value=f;fl.Q.value=q;const g=c.createGain();g.gain.value=0;s.connect(fl).connect(g).connect(AU.amb);s.start();return{g,fl}};
  AMB.ocean=mk('lowpass',480,.5);AMB.wind=mk('bandpass',650,.6);
  const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.11;lg.gain.value=.035;lfo.connect(lg).connect(AMB.ocean.g.gain);lfo.start();
  const wl=c.createOscillator(),wg=c.createGain();wl.frequency.value=.07;wg.gain.value=260;wl.connect(wg).connect(AMB.wind.fl.frequency);wl.start()}
function bird(){const c=AU.ctx,n=2+Math.floor(Math.random()*3),f=2300+Math.random()*1400;
  for(let i=0;i<n;i++)tone(f*(1+Math.random()*.1),f*1.35,.07,{vol:.018,delay:i*.11,bus:AU.amb})}
// spikeball rolling: one shared rumble + clicks, driven by the nearest spikeball
const ROLL={src:null,g:null,fl:null,pan:null,ph:0,prev:new Map()};
function startRoll(){const c=AU.ctx;if(!c||ROLL.src)return;
  const s=c.createBufferSource();s.buffer=AU.noise;s.loop=true;const fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=220;fl.Q.value=2;
  const o=c.createOscillator();o.type='sawtooth';o.frequency.value=38;const og=c.createGain();og.gain.value=.25;
  const g=c.createGain();g.gain.value=0;const pan=c.createStereoPanner?c.createStereoPanner():c.createGain();
  s.connect(fl);o.connect(og).connect(fl);fl.connect(g).connect(pan).connect(AU.sfx);s.start();o.start();Object.assign(ROLL,{src:s,g,fl,pan,osc:o})}
function audioFrame(dt){
  const c=AU.ctx;if(!c||c.state!=='running')return;
  // music choice
  MUS.want=state==='menu'||state==='select'?(MUSC.menu==='off'?null:MUSC.menu):(state==='won'||state==='over')?null:parkTrack();
  MUS.duck=state==='paused'||setOpen?.35:1;
  // ambience
  startAmb();const live=state!=='over',h=Math.max(0,py),sky=false;
  AMB.ocean.g.gain.setTargetAtTime(live?(WIN?.035:.06)*Math.max(.15,1-h/22):0,c.currentTime,.5);
  AMB.wind.g.gain.setTargetAtTime(live?(sky?.025+Math.min(1,h/20)*.075:WIN?.035:.012):0,c.currentTime,.6);
  if(live&&!sky&&!WIN&&state!=='paused'&&(AMB.birdT-=dt)<=0){AMB.birdT=4+Math.random()*7;bird()}
  // rolling spikeballs
  startRoll();if(ROLL.prev.size>120)ROLL.prev.clear();const sel=selOf('roll');let best=null,bd=14,bs=0;
  const list=state==='play'||state==='paused'?runHz:[];
  for(const h of list){if(h.dead||(mode==='run'?h.kind!=='spike':FOE_STYLE!=='spike'))continue;const p=h.g.position,d=Math.hypot(p.x-P.position.x,p.z-P.position.z,(p.y-.75-py)*.6);
    const pr=ROLL.prev.get(h),sp=pr?Math.hypot(p.x-pr.x,p.z-pr.z)/Math.max(dt,1e-3):0;ROLL.prev.set(h,{x:p.x,z:p.z});if(d<bd){bd=d;best=h;bs=sp}}
  const prox=best&&state==='play'&&sel>=0?Math.pow(1-bd/14,2):0;
  ROLL.g.gain.setTargetAtTime(prox*.22,c.currentTime,.06);ROLL.fl.frequency.setTargetAtTime(160+bs*45,c.currentTime,.1);
  ROLL.osc.frequency.setTargetAtTime(30+bs*6,c.currentTime,.1);
  if(ROLL.pan.pan&&best)ROLL.pan.pan.setTargetAtTime(clamp((best.g.position.x-P.position.x)/8,.9),c.currentTime,.08);
  if(prox>.08&&sel===0){ROLL.ph+=bs*dt*1.7;if(ROLL.ph>=1){ROLL.ph%=1;noise(.025,{ft:'highpass',f:3800+Math.random()*1500,vol:.05*prox+.01})}}
}
