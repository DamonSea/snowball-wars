(()=>{const st=document.createElement('style');st.textContent='#hint,#toast,#ctlShow,#ctl,#padInfo{display:none!important}';document.head.appendChild(st);
window.__go=(c,map)=>{menu();pickMode='run';pickLevel=map;ci=c;showChar();confirmChar();__step(5);T.run.hazardsFree=0;runHz.forEach(h=>rmObj(h.g));runHz=[];runQ=[];invuln=0;setCpu(false)};
window.__at=(x,z,f,y=0,settle=50)=>{__place(x,z,y,f);runHz.forEach(h=>rmObj(h.g));runHz=[];runQ=[];invuln=0;hint('');__step(settle);invuln=0};
T.camera.height=6.8;T.camera.back=8.6;})();
// run fn once per simulation step; one GIF frame = 4 steps (15 fps at the game's 60 Hz)
window.__run=fn=>{window.__S={ph:0,f:0,w:0};window.__scen=i=>{for(let k=0;k<4;k++){__S.f++;fn(__S);__step(1)}}};
