(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};
// select screen: cycle to Skye
menu();select('run',0);ci=2;showChar();cycle(1);out.push('after Flip comes: '+chars[ci].name+' | dots='+document.querySelectorAll('#dots i').length+' | outfits shown='+document.querySelectorAll('#outfits .sw').length+' current='+document.querySelector('#outfits b').textContent);
cycleOutfit(1);out.push('Skye outfit -> '+OUTFITS_SKYE[OFI[3]].name+', Flip still '+OUTFITS[OFI[2]].name);
cycleOutfit(1);cycleOutfit(1);cycleOutfit(1);out.push('Golden Ace skipped while locked: '+OUTFITS_SKYE[OFI[3]].name);
out.push('only Skye visible: '+chars.map((c,i)=>c.name+'='+(i===ci)).join(','));
confirmChar();runN(30);out.push('playing as '+chars[ci].name+' acro='+!!chars[ci].acro+' Skye rig visible='+SK.root.visible+' Flip visible='+F.root.visible);
// her moveset: run then crouch+jump = long jump
__place(0,4,0,Math.PI);keys.KeyW=true;runN(60);keys.ShiftLeft=true;runN(2);jumpBuf=.15;runN(3);keys.ShiftLeft=false;keys.KeyW=false;out.push('long jump mode='+A.mode+' combo='+TR.names.join(','));runN(90);
// ponytail moves and stays finite
__place(0,4,0,Math.PI);keys.KeyW=true;runN(40);const r=SK.pony.map(g=>g.rotation.x.toFixed(2));keys.KeyW=false;runN(30);const r2=SK.pony.map(g=>g.rotation.x.toFixed(2));
out.push('ponytail running x='+r.join(',')+' | standing x='+r2.join(',')+' finite='+SK.pony.every(g=>isFinite(g.rotation.x)));
// multiplayer pose + avatar
const q=poseOf();out.push('pose values='+q.length+' finite='+q.every(isFinite));const av=makeAv(3);out.push('remote Skye avatar has ponytail='+!!av.rig.pony+' hair='+(av.rig.pony?'ok':'none'));
// Sky Gauntlet: flipOnly lets Skye in, keeps Sunny out
menu();pickCi=3;select('adv',1);out.push('Sky Gauntlet with Skye picked -> '+chars[ci].name+', choices='+pickOrder().map(i=>chars[i].name).join('/'));
pickCi=0;select('adv',1);out.push('Sky Gauntlet with Sunny picked -> '+chars[ci].name);
return out.join('\n')})()
