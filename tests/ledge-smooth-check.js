(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
const trace=()=>{const ys=[],xs=[];let pz=P.position.z;for(let i=0;i<50;i++){__step(1);ys.push(py);xs.push(P.position.z)}let dy=0,dz=0;for(let i=1;i<ys.length;i++){dy=Math.max(dy,Math.abs(ys[i]-ys[i-1]));dz=Math.max(dz,Math.abs(xs[i]-xs[i-1]))}return{dy,dz,end:ys[ys.length-1]}};
const grab=()=>{__place(3.5,-9.75,0,Math.PI);__k({KeyW:true,Space:true});jumpBuf=.15;for(let i=0;i<60&&!LH.on;i++)__step(1);__k({});runN(5);return LH.on};
let g=grab();__k({KeyW:true});let t=trace();__k({});out.push('pull-up: grabbed='+g+' biggest per-frame rise '+t.dy.toFixed(3)+', step-in '+t.dz.toFixed(3)+', ended on deck y='+t.end.toFixed(2)+' | '+TR.names.join(','));
g=grab();TR.names=[];jumpBuf=.15;t=trace();out.push('jump hop: grabbed='+g+' biggest per-frame rise '+t.dy.toFixed(3)+', ended y='+py.toFixed(2)+' grounded='+grounded+' | '+TR.names.join(','));
runN(30);pause();const btns=['go','alt','alt2','alt3','alt4'].map(i=>document.getElementById(i).textContent).filter(Boolean);document.getElementById('alt2').click();out.push('pause buttons: '+btns.join(' / ')+' | Settings opens: '+setOpen);closeSet();out.push('after closing settings, still paused: '+(state==='paused'));
return out.join('\n')})()
