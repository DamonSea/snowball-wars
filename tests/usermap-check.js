(()=>{const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x?' -> '+x:''));
const L=parkMaps(),M=L[L.length-1];
ok('User map is last in the Trick Park picker',M&&M.user&&M.name==="Ben's Madness Map",M&&M.name);
ok('Built-in maps still come first, none are User Maps',L.slice(0,-1).every(m=>!m.custom&&!m.user),L.length+' maps');
ok('Not counted in the title-screen best scores',!$('best').textContent.includes('Madness'));
PARK.i=L.indexOf(M);renderPark();ok('Picker credits Ben',/User Map by Ben/.test($('parkMeta').textContent),$('parkMeta').textContent);
PARK.i=0;renderPark();ok('Built-in maps have no User Map label',!/User Map/.test($('parkMeta').textContent),$('parkMeta').textContent);
const src=USER_MAPS[0];ok('Duplicates removed (400 items kept)',src.items.length===400,src.items.length);
useRunMap(RUNMAPS.indexOf(M));startRun(true);__step(5);
ok('Starts at the spawn point',Math.abs(P.position.x)<.6&&Math.abs(P.position.z-16)<.6,P.position.x.toFixed(1)+','+P.position.z.toFixed(1));
ok('Has lamps to climb',advCol.filter(c=>c.pole).length>=300,advCol.filter(c=>c.pole).length+' poles');
ok('Has orb spots (Ben placed 34 + 8 ground)',runL.spots.length>=40&&orbs.length>0,runL.spots.length+' spots, '+orbs.length+' out now');
ok('Enemies on (Ben\'s setting)',runHz.length>0,runHz.length+' enemies');
// stand on a block
const b=src.items.find(i=>i.t==='block');__place(b.x,b.z,2.5,0);__until(()=>grounded,120);ok('Can stand on a block',Math.abs(py-2)<.15,'y='+py.toFixed(2));
// climb a lamp
const c=advCol.find(c=>c.pole&&Math.hypot(c.x,c.z)<20);__place(c.x,c.z+1.2,0,-Math.PI);__k({KeyW:true});__until(()=>CL.on,90);ok('Can grab a lamp pole',CL.on);__k({});
// walk up stairs
const s=src.items.find(i=>i.t==='stairs');__place(s.x,s.z+3,0,-Math.PI);__k({KeyW:true});__step(80);__k({});__step(10);ok('Stairs are walkable',py>.5,'y='+py.toFixed(2));
// modes start
const tryMode=(n,f,g)=>{try{f();__step(10);ok(n+' starts here',g())}catch(e){ok(n+' starts here',false,e.message)}};
tryMode('Snowball Wars',()=>startWars(),()=>WAR.on);if(WAR.on)warsStop(false);__step(3);
tryMode('Tag',()=>startTag(),()=>TAG.on);if(TAG.on)tagStop(false);__step(3);
tryMode('Orb Race',()=>{setRivals(2);beginTimed()},()=>RACE.on&&RACE.bots.length===2);__step(120);ok('Orb Race rivals move',RACE.bots.length>0&&RACE.bots.some(b=>Math.hypot(b.a.g.position.x,b.a.g.position.z-16)>2));raceStop();
return out.join('\n')})()
