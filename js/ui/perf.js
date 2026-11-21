// Performance stats overlay (Settings → Game → Performance stats, or the ` key): frames per second, frame time,
// draw calls, triangles, and what's loaded on the GPU. Numbers refresh twice a second.
const PERF={on:false,frames:0,acc:0,worst:0,last:performance.now(),el:null};
try{PERF.on=localStorage.getItem('orbRunPerf')==='1'}catch(e){}
function setPerf(on){PERF.on=on;try{localStorage.setItem('orbRunPerf',on?'1':'0')}catch(e){}if(PERF.el)PERF.el.classList.toggle('hide',!on)}
(()=>{const d=document.createElement('div');d.id='perf';d.className='perf'+(PERF.on?'':' hide');d.setAttribute('aria-live','off');document.body.appendChild(d);PERF.el=d})();
// Graphics quality. Render resolution (pixel ratio) is the big cost on Retina screens; shadow map size is next.
// Auto starts at 1.5x and adjusts: it drops resolution in steps when you're under ~50 fps, and creeps back up when
// frames are smooth, never returning to a level it had to leave.
const GFXS={high:{name:'High',pr:2,sh:2048},balanced:{name:'Balanced',pr:1.5,sh:1024},low:{name:'Low',pr:1,sh:1024}};
const GFX={mode:'auto',name:'Auto',pr:1.5,ceil:2,acc:0,n:0,good:0};
const maxPR=()=>Math.min(window.devicePixelRatio||1,2);
function setPR(r){const v=Math.max(.75,Math.min(maxPR(),r));if(!renderer.getPixelRatio||Math.abs(renderer.getPixelRatio()-v)<.01)return;renderer.setPixelRatio(v);resize()}
function setShadow(sz){if(sun.shadow.mapSize.x===sz)return;sun.shadow.mapSize.set(sz,sz);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}}
function setQual(mode){if(!GFXS[mode]&&mode!=='auto')mode='auto';GFX.mode=mode;try{localStorage.setItem('orbRunQuality',mode)}catch(e){}
  if(mode==='auto'){Object.assign(GFX,{name:'Auto',pr:Math.min(1.5,maxPR()),ceil:maxPR(),acc:0,n:0,good:0});setPR(GFX.pr);setShadow(2048)}
  else{const q=GFXS[mode];GFX.name=q.name;GFX.pr=q.pr;setPR(q.pr);setShadow(q.sh)}}
function qualFrame(ms){if(GFX.mode!=='auto'||state!=='play'||ms>250)return;GFX.acc+=ms;GFX.n++;if(GFX.acc<1500)return;
  const avg=GFX.acc/GFX.n;GFX.acc=GFX.n=0;
  if(avg>20){if(GFX.pr>1){GFX.ceil=GFX.pr-.25;GFX.pr=Math.max(1,GFX.pr-.25);setPR(GFX.pr)}else if(sun.shadow.mapSize.x>1024)setShadow(1024);else if(GFX.pr>.75&&avg>28){GFX.pr=.75;setPR(.75)}GFX.good=0}
  else if(avg<17.5){if(++GFX.good>=4&&GFX.pr+.25<=Math.min(GFX.ceil,maxPR())){GFX.pr+=.25;setPR(GFX.pr);GFX.good=0}}else GFX.good=0}
try{setQual(localStorage.getItem('orbRunQuality')||'auto')}catch(e){setQual('auto')}
// called once per frame from tick(), after rendering
function perfFrame(){const now=performance.now(),ms=now-PERF.last;PERF.last=now;qualFrame(ms);if(!PERF.on)return;PERF.frames++;PERF.acc+=ms;PERF.worst=Math.max(PERF.worst,ms);
  if(PERF.acc<500)return;const I=renderer.info||{render:{calls:0,triangles:0},memory:{geometries:0,textures:0}},fps=PERF.frames*1000/PERF.acc;
  PERF.el.innerHTML=`<b class="${fps<30?'bad':fps<50?'meh':'good'}">${fps.toFixed(0)} fps</b> ${(PERF.acc/PERF.frames).toFixed(1)} ms <small>(worst ${PERF.worst.toFixed(0)})</small><br>`+
    `${I.render.calls} draw calls · ${(I.render.triangles/1000).toFixed(0)}k tris<br>${I.memory.geometries} geometries · ${I.memory.textures} textures · ${I.programs?I.programs.length:0} shaders<br>`+
    `${renderer.domElement.width}×${renderer.domElement.height} @ ${renderer.getPixelRatio?renderer.getPixelRatio().toFixed(2):1}x${typeof GFX!=='undefined'?' · '+GFX.name:''}`;
  // what the player is doing, and what (if anything) is holding Crouch down: for tracking down stuck states
  if(state==='play'||state==='paused'){const kb=(BIND.kb.crouch||[]).filter(k=>keys[k]),pb=(BIND.pad.crouch||[]).filter(i=>padNow[i]).map(i=>PADN[i]||('#'+i)),
    held=[...kb,...pb.map(n=>'pad '+n),...(joy.crouch?['touch']:[])],gp=pad.gp,trig=gp?[6,7].map(i=>gp.buttons[i]?gp.buttons[i].value.toFixed(2):'-').join('/'):'-';
    PERF.el.innerHTML+=`<br><small>${chars[ci].name} · ${A.mode}${BS.on?' · butt slide':''}${LH.on?' · ledge hang':''}${CL.on?' · climbing':''}${SB.stun>0?' · stunned':''}${A.knock>0?' · knocked':''} · ${grounded?'ground':'air'}<br>`+
      `crouch: ${held.length?'<b class="bad">held by '+held.join(', ')+'</b>':'not held'} · L2/R2 ${trig}<br>${runL.name} (${P.position.x.toFixed(1)}, ${py.toFixed(1)}, ${P.position.z.toFixed(1)}) · cam ${CAM_NAMES[CAMS.indexOf(CAM.mode)]}</small>`}
  PERF.frames=0;PERF.acc=0;PERF.worst=0}
addEventListener('keydown',e=>{if(e.code==='Backquote'&&!e.repeat&&!(e.target.closest&&e.target.closest('input')))setPerf(!PERF.on)});
