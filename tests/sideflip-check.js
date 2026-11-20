(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
function sideFlip(){__place(0,6,0,Math.PI);keys.KeyW=true;runN(70);keys.KeyW=false;keys.KeyS=true;let k=0;while(A.mode!=='skid'&&k++<20)__step(1);const sk=A.mode;
  jumpBuf=.15;runN(2);keys.KeyS=false;const nm=TR.names.slice(-1)[0];
  runN(20);const H=F.hp.rotation;const mid={yaw:+H.y.toFixed(2),roll:+H.z.toFixed(2),legL:+F.legL.rotation.z.toFixed(2),armR:+F.armR.rotation.z.toFixed(2)};
  runN(60);return{sk,nm,mid,landed:grounded}}
const a=sideFlip();out.push('default ('+LOOK.sideFlip.opts[LOOK.sideFlip.get()]+'): skid='+a.sk+' trick='+a.nm+' mid-flip '+JSON.stringify(a.mid)+' landed='+a.landed);
LOOK.sideFlip.set(1);TR.names=[];const b=sideFlip();out.push('Classic: trick='+b.nm+' mid-flip '+JSON.stringify(b.mid)+' landed='+b.landed);
openSet();out.push('settings row: '+!!document.querySelector('[data-look="sideFlip"]')+', saved='+localStorage.getItem('orbRunSideFlip'));closeSet();resume();LOOK.sideFlip.set(0);
return out.join('\n')})()
