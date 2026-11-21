(()=>{const rep=[];let seed=5;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const gp={id:'DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)',mapping:'standard',connected:true,timestamp:1,buttons:Array.from({length:18},()=>({pressed:false,value:0})),axes:[0,0,0,0]};
navigator.getGamepads=()=>[gp];const btn=(i,v)=>{gp.buttons[i].pressed=!!v;gp.buttons[i].value=v?1:0;gp.timestamp++};
const calm=()=>{runHz.forEach(h=>h.g.position.set(0,.75,60));SB.stun=0;invuln=9};
const solidHere=()=>{const x=P.position.x,z=P.position.z;return plats.find(p=>inside(p,x,z,-.05)&&topOf(p,x,z)>py+.55&&(botOf(p,x,z)===undefined||py+T.bodyH>botOf(p,x,z)+.1))};
for(const c of[2,3,4,0,1]){menu();__step(3);pickMode='run';pickLevel=0;ci=c;showChar();confirmChar();__step(10);
 for(let trial=0;trial<14;trial++){
  // start just behind the low end of the slide, or beside / under it
  const starts=[[-.8,17.5],[-.8,19],[-.8,20.5],[.3,17.2],[.3,20.8],[2.5,16.8],[2.5,21.2],[6,16.6],[6,21.4],[14,16.5],[14.2,21.5],[15.2,18],[18.9,19],[17,21]];
  const[sx,sz]=starts[trial];__place(sx,sz,0,rnd()*6.28);__step(3);
  let crouchStuck=0,inS=0;
  for(let f=0;f<420;f++){
    if(f%15===0){const a=rnd()*6.28,m=.25+rnd()*.75;gp.axes[0]=Math.cos(a)*m;gp.axes[1]=Math.sin(a)*m}
    if(rnd()<.05)btn(1,!gp.buttons[1].pressed);if(rnd()<.03)btn(7,!gp.buttons[7].pressed);if(rnd()<.04)btn(0,1);else if(rnd()<.3)btn(0,0);
    calm();__step(1);gp.timestamp++;
    const held1=gp.buttons[1].pressed||gp.buttons[7].pressed;
    if((A.mode==='crouch'||BS.on)&&!held1){if(++crouchStuck===20)rep.push(`CROUCH-STUCK ${chars[ci].name} start(${sx},${sz}) f${f} at (${P.position.x.toFixed(2)},${py.toFixed(2)},${P.position.z.toFixed(2)}) mode ${A.mode} BS ${BS.on} g ${grounded} stand ${stand?(stand.ramp?'ramp':'flat'):'-'}`)}else crouchStuck=0;
    const s=solidHere();if(s&&!CL.on&&!LH.on){if(++inS===15)rep.push(`IN-SOLID ${chars[ci].name} start(${sx},${sz}) f${f} at (${P.position.x.toFixed(2)},${py.toFixed(2)},${P.position.z.toFixed(2)}) plat ${JSON.stringify({x:s.x,z:s.z,w:s.w,d:s.d,top:s.top,ramp:!!s.ramp})}`)}else inS=0}
  btn(1,0);btn(7,0);btn(0,0);gp.axes[0]=gp.axes[1]=0;__step(2)}
 // quit to menu and back: anything still stuck?
 menu();__step(20);const inMenu={mode:A.mode,BS:BS.on};pickMode='run';pickLevel=0;showChar();confirmChar();__step(20);
 if(inMenu.mode!=='normal'||inMenu.BS||A.mode!=='normal'||BS.on)rep.push(`PERSISTS ${chars[ci].name}: menu ${JSON.stringify(inMenu)} after restart mode ${A.mode} BS ${BS.on}`)}
navigator.getGamepads=()=>[];return rep.length?rep.slice(0,15).join('\n'):'no problems found'})()
