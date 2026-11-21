(()=>{const out=[];const runN=n=>{for(let i=0;i<n;i++)__step(1)};const T0=T.run.hazardsFree;T.run.hazardsFree=0;
const clear=()=>{runHz.forEach(h=>rmObj(h.g));runHz=[];runQ=[]};
// place you, then one enemy; vulnerable again
const setup=(kind,px,pz,pf,ex,ez)=>{clear();__place(px,pz,0,pf);clear();spawnRunHz(kind);const h=runHz[0];h.g.position.set(ex,kind==='spike'?.75:0,ez);h.cool=99;invuln=0;SB.stun=0;lives=3;TR.names=[];return h};
let h=setup('goon',0,8,Math.PI,0,-2);h.cool=0;let thrown=false,stun=false;for(let i=0;i<240;i++){__step(1);if(SB.list.some(b=>b.owner==='goon'))thrown=true;if(SB.stun>0)stun=true}
out.push('goon: threw='+thrown+' stunned you='+stun+' lives='+lives+' keeps ~'+Math.hypot(h.g.position.x-P.position.x,h.g.position.z-P.position.z).toFixed(1)+'m away');runN(60);
h=setup('goon',0,4.9,0,0,6);attackPress();runN(20);out.push('punch goon: dead='+!!h.dead+' combo='+TR.names.join(','));runN(60);
h=setup('goon',4,4,0,4,4.3);py=3.1;vy=-2;grounded=false;let vmax=-9;for(let i=0;i<6;i++){__step(1);vmax=Math.max(vmax,vy)}out.push('stomp goon: dead='+!!h.dead+' bounce vy='+vmax.toFixed(1)+' combo='+TR.names.join(','));runN(90);
h=setup('goon',0,4.2,0,0,6);const l0=lives;runN(40);out.push('walk into goon: lives lost='+(l0-lives));runN(120);
h=setup('penguin',0,8,Math.PI,0,-4);h.t=0;const seen=[];for(let i=0;i<300;i++){__step(1);if(seen[seen.length-1]!==h.st)seen.push(h.st)}out.push('penguin: '+seen.join(' -> ')+' | lives lost='+(3-lives));runN(120);
h=setup('penguin',2,2,0,2,2.5);h.st='dizzy';h.t=5;runN(10);out.push('touch dizzy penguin: lives lost='+(3-lives));
h=setup('imp',3,3.6,Math.PI,3,3);SB.ammo=5;snowHud();runN(4);out.push('imp touch: ammo 5->'+SB.ammo+' imp='+h.st+' carrying='+h.mine+' lives lost='+(3-lives));
h.g.position.set(P.position.x,0,P.position.z+1.1);face=0;attackPress();runN(15);out.push('smack the imp: dead='+!!h.dead+' ammo back to '+SB.ammo);runN(30);
h=setup('imp',3,3.6,Math.PI,3,3);SB.ammo=5;runN(4);const after=SB.ammo;for(let i=0;i<360&&!h.dead;i++)__step(1);out.push('imp escaped: gone='+!!h.dead+' ammo stayed '+after+'->'+SB.ammo+' | "'+document.getElementById('toast').textContent+'"');
h=setup('goon',0,6,Math.PI,0,0);SB.ammo=6;SB.cool=0;throwSnow();runN(30);out.push('snowball vs goon: dead='+!!h.dead+' combo='+TR.names.join(','));
h=setup('penguin',0,4,0,0,6);runN(1);GP.st=0;py=4;vy=0;grounded=false;P.position.set(0,0,6);groundPound();runN(40);out.push('ground pound penguin: dead='+!!h.dead+' combo='+TR.names.join(','));runN(40);
h=setup('spike',0,8,Math.PI,0,0);out.push('spikeball still works: kind='+h.kind);
clear();T.run.hazardsFree=3;runN(3);setFoeStyle('spike');out.push('toggle Spikeballs: '+runHz.map(h=>h.kind).join(','));setFoeStyle('crew');out.push('toggle Winter crew: '+runHz.map(h=>h.kind).join(','));
T.run.hazardsFree=T0;return out.join('\n')})()
