(()=>{closePark();const calm=()=>runHz.forEach(h=>{h.g.position.set(0,.75,90);h.vx=h.vz=0});const st=n=>{for(let i=0;i<n;i++){calm();__step(1)}};
const dirs=[[0,-1,'KeyW'],[0,1,'KeyS'],[-1,0,'KeyA'],[1,0,'KeyD']];let tot=[0,0],totJ=[0,0];
for(const[mi,M]of RUNMAPS.map((M,i)=>[i,M]).filter(([i,M])=>!M.custom&&(M.name==='Plaza'||M.name==='Christmas Village'))){select('run',mi);ci=2;showChar();confirmChar();st(3);if(state==='paused')resume();setCam('classic');
  advCol.filter(c=>c.tree&&!c.pole).forEach(c=>{for(const[dx,dz,kk]of dirs)for(const off of [-.9,-.5,.5,.9])for(const how of ['run','jump']){
    const px=-dz,pz=dx,sx=c.x-dx*7+px*off,sz=c.z-dz*7+pz*off;__place(sx,sz,c.y,Math.atan2(dx,dz));CL.on=false;CL.cool=0;st(2);
    if(Math.abs(py-c.y)>.3||Math.hypot(P.position.x-sx,P.position.z-sz)>.25)continue;
    // nothing else in the 7m lane
    // only clear, level lanes: same ground height all the way and nothing else (round or box) within a body's width of it
    let clear=true;for(let k=0;k<=10&&clear;k++){const t=k/10,x=sx+(c.x-sx)*t*.85,z=sz+(c.z-sz)*t*.85,gh=groundAt(x,z,c.y+1).h;
      if(!isFinite(gh)||Math.abs(gh-c.y)>.05)clear=false;
      else if(advCol.some(o=>o!==c&&(o.r?Math.hypot(o.x-x,o.z-z)<o.r+.8:Math.abs(o.x-x)<(o.w||0)/2+.8&&Math.abs(o.z-z)<(o.d||0)/2+.8)))clear=false}
    if(!clear)continue;
    __k({[kk]:true});let g=false;for(let t=0;t<90;t++){st(1);const d=Math.hypot(P.position.x-c.x,P.position.z-c.z);if(how==='jump'&&d<c.r+2.6&&grounded&&!keys.Space){jumpBuf=.15;keys.Space=true}if(CL.on){g=true;break}}
    keys.Space=false;__k({});const T_=how==='run'?tot:totJ;T_[1]++;if(g)T_[0]++;CL.on=false;CL.cool=0;st(4)}})}
const ok=(n,c,x)=>(c?'OK   ':'FAIL ')+n+' -> '+x;return [ok('Running into a tree a little off-centre grabs it (9 in 10 or better)',tot[0]>=tot[1]*.9,tot.join('/')),ok('Jumping into one does too',totJ[0]>=totJ[1]*.9,totJ.join('/'))].join('\n')})()
