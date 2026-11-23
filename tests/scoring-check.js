(()=>{closePark();const out=[];const ok=(n,c,x='')=>out.push((c?'OK   ':'FAIL ')+n+(x?' -> '+x:''));
const calm=()=>runHz.forEach(h=>{h.g.position.set(0,.75,60);h.vx=h.vz=0});const _st=__step;__step=n=>{for(let i=0;i<n;i++){calm();_st(1)}};
__place(0,10,0,0);hud();
ok('Free roam: no Lives box',$('lv').parentElement.style.display==='none');
ok('Free roam: the score box says Tricks',$('k1').textContent==='Tricks');
lives=3;invuln=0;hurt(P.position.x+1,P.position.z,5);ok('Free roam: getting hurt costs no lives',lives===3);__step(90);
setRivals(0);beginTimed();__step(200);hud();ok('Orb race: Lives box is back',$('lv').parentElement.style.display!=='none');
ok('Orb race: the score box counts Orbs',$('k1').textContent==='Orbs'&&$('v1').textContent==='0');
invuln=0;hurt(P.position.x+1,P.position.z,5);ok('Orb race: getting hurt costs a life',lives===2);__step(90);
const o=orbs.find(q=>!q.spill);__place(o.g.position.x,o.g.position.z,o.y,0);__step(4);ok('Grabbing an orb counts 1, whatever it was worth',orbN===1&&$('v1').textContent==='1',o.v+' -> '+orbN);
orbN=7;time=.02;__step(3);ok('End: a count and a best, no points',/7 orbs/.test($('hint').textContent)&&bestO(runL.key)>=7,$('hint').textContent);
parkMenu();__step(2);ok('Picker shows the best orb race',/Best Collectathon: \d+ orbs/.test($('parkBest').textContent),$('parkBest').textContent);closePark();
// friends' name tags say what they're doing
ok('Name tag: friend in a match shows KOs',peerLine({wm:['x',100,3,2,5],sc:10100,fr:1})==='2 KO');
ok('Name tag: friend in an orb race shows orbs',peerLine({or:['x',30,6],sc:999})==='6 orbs');
ok('Name tag: friend in free roam shows trick points',peerLine({sc:2650,fr:1})==='tricks · 2650');
return out.join('\n')})()
