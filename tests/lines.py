"""Line checks for Trick Park maps: drive Flip with frame-exact inputs and record landings."""
import asyncio,os,re,sys,json
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__))
STUB=open(os.path.join(HERE,'three-stub.js')).read()
INIT="""(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined;let s=12345;Math.random=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};
window.__raf=[];window.requestAnimationFrame=cb=>{window.__raf.push(cb);return 1};
window.__step=n=>{for(let i=0;i<n;i++){const q=window.__raf.splice(0);for(const f of q)f(0)}};})();"""
DRIVER=r"""
window.__k=o=>{for(const k in keys)keys[k]=false;Object.assign(keys,o||{})};
window.__place=(x,z,y,f)=>{__k();P.position.set(x,0,z);py=y;face=f;vel.set(0,0,0);vy=0;A.spd=0;A.mode='normal';A.air=false;A.flipT=99;
  grounded=true;stand=null;CL.on=false;CL.top=false;invuln=999;runHz.forEach(h=>{h.g.position.set(0,.75,25);h.vx=h.vz=0});TR.mult=0;TR.names=[];TR.pts=0;
  GAP.take=null;GAP.wasSup=true;GAP.from={x,z,y};__step(2)};
window.__until=(cond,max=400)=>{for(let i=0;i<max;i++){if(cond())return i;__step(1)}return -1};
window.__land=()=>{keys.Space=keys.Space;__until(()=>!grounded,30);__until(()=>grounded&&!CL.on,400);keys.Space=false;__step(1);return{x:+P.position.x.toFixed(2),z:+P.position.z.toFixed(2),y:+py.toFixed(2),tricks:[...TR.names]}};
const N=-Math.PI,E=Math.PI/2;
window.__tests={
 'Runway: long jump + late dive -> Perch (y 2.2)':()=>{__place(-13,7,2.2,N);__k({KeyW:true});__until(()=>P.position.z<-3.6);keys.ShiftLeft=true;__step(2);jumpBuf=.15;keys.Space=true;__step(2);keys.ShiftLeft=false;
   __until(()=>vy<-4);keys.ShiftLeft=true;__step(1);keys.ShiftLeft=false;return __land()},
 'Runway: long jump only (should fall short, y 0)':()=>{__place(-13,7,2.2,N);__k({KeyW:true});__until(()=>P.position.z<-3.6);keys.ShiftLeft=true;__step(2);jumpBuf=.15;keys.Space=true;__step(2);keys.ShiftLeft=false;return __land()},
 'Runway: jump + late dive (should fall short, y 0)':()=>{__place(-13,7,2.2,N);__k({KeyW:true});__until(()=>P.position.z<-3.9);jumpBuf=.15;keys.Space=true;__step(2);__until(()=>vy<-4);keys.ShiftLeft=true;__step(1);keys.ShiftLeft=false;return __land()},
 'Perch -> Deck hop (y 2.2, Perch Hop)':()=>{__place(-8.6,-19.5,2.2,E);__k({KeyD:true});__step(6);jumpBuf=.15;keys.Space=true;__step(2);return __land()},
 'Sunny/Rook route: climb tree, leap to Perch (y 2.2)':()=>{const c=advCol.find(c=>c.tree&&Math.abs(c.x+15.6)<.1);__place(c.x+1.2,c.z,0,0);
   Object.assign(CL,{on:true,tree:c,top:false,ang:Math.atan2(4.6,-3.8),h:2.6});grounded=false;__step(2);jumpBuf=.15;keys.Space=true;__step(2);return __land()},
 'Tower: backflip Deck -> Tier 2 (y 5.4)':()=>{__place(0,-12.05,2.2,0);keys.ShiftLeft=true;__step(4);jumpBuf=.15;keys.Space=true;__step(2);keys.ShiftLeft=false;return __land()},
 'Tower: plain jump into Tier 2 (should stay, y 2.2)':()=>{__place(0,-10.8,2.2,N);__k({KeyW:true});__step(8);jumpBuf=.15;keys.Space=true;__step(2);return __land()},
 'Tower: jump Tier 2 -> Crown (y 7.4)':()=>{__place(0,-13,5.4,N);__k({KeyW:true});__step(10);jumpBuf=.15;keys.Space=true;__step(2);return __land()},
 'Crown: long jump -> Sky Deck (y 8)':()=>{__place(-1.2,-17.5,7.4,E);__k({KeyD:true});__until(()=>P.position.x>1.1);keys.ShiftLeft=true;__step(2);jumpBuf=.15;keys.Space=true;__step(2);keys.ShiftLeft=false;return __land()},
 'Crown: plain jump toward Sky Deck (should fall)':()=>{__place(-1.2,-17.5,7.4,E);__k({KeyD:true});__until(()=>P.position.x>1.1);jumpBuf=.15;keys.Space=true;__step(2);return __land()},
 'Chimney: wall-jump bot -> top (y 8)':()=>{__place(14,-12,0,E);let dir=1;__k({KeyD:true});jumpBuf=.15;keys.Space=true;__step(3);
   for(let i=0;i<600;i++){if(A.wallT>0&&!grounded&&vy<4){jumpBuf=.15;keys.Space=true;dir=-dir;__k(dir>0?{KeyD:true}:{KeyA:true})}__step(1);if(grounded&&py>7.5)break;if(grounded&&i>20&&py<.1)break}
   return{x:+P.position.x.toFixed(2),z:+P.position.z.toFixed(2),y:+py.toFixed(2),tricks:[...TR.names]}},
 'Pillars: standing hop P1 -> P2 (y 2.8)':()=>{__place(13,3,1.8,Math.PI/4);__k({KeyD:true,KeyS:true});jumpBuf=.15;keys.Space=true;__step(2);return __land()},
 'Pillars: P3 -> P4 (y 4.8)':()=>{__place(17.6,7.6,3.8,Math.PI/4);__k({KeyS:true,KeyD:true});jumpBuf=.15;keys.Space=true;__step(2);return __land()},
 "Treehouse: tree-top flip -> Crow's Nest (y 9.5)":()=>{const c=advCol.find(c=>c.tree&&Math.abs(c.x+15)<.1&&Math.abs(c.z-12)<.1);__place(c.x,c.z,c.top,0);
   Object.assign(CL,{on:true,tree:c,top:true,ang:0,h:c.top});grounded=false;GAP.from={x:c.x,z:c.z,y:c.top};GAP.wasSup=true;__step(2);face=Math.atan2(-4.5,5);__step(1);__k({KeyA:true,KeyS:true});jumpBuf=.15;keys.Space=true;__step(2);return __land()},
 'Fountain: ring -> spout (y 2.6)':()=>{__place(-7,4.25,1,0);__k({KeyS:true});jumpBuf=.15;keys.Space=true;__step(2);return __land()},
};
"""
async def main(path):
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome');ctx=await b.new_context()
    errs=[];pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
    await ctx.route(re.compile(r'.*three(\.min)?\.js$'),lambda r:r.fulfill(body=STUB,content_type='application/javascript'))
    await ctx.route(re.compile(r'https://fonts\..*'),lambda r:r.abort())
    await pg.add_init_script(INIT);await pg.goto('file://'+os.path.abspath(path));await pg.wait_for_timeout(300)
    await pg.evaluate("$('go').click()");await pg.evaluate("__step(2)");await pg.evaluate("$('go').click()");await pg.evaluate("__step(3)");await pg.evaluate("$('csGo').click()");await pg.evaluate("__step(10)")
    await pg.evaluate(DRIVER)
    if len(sys.argv)>2:
      print(await pg.evaluate(sys.argv[2]));await b.close();return
    names=await pg.evaluate("Object.keys(__tests)")
    for n in names:
      r=await pg.evaluate(f"__tests[{json.dumps(n)}]()")
      print(f"{n:62} -> y={r['y']:6} x={r['x']:7} z={r['z']:7}  {', '.join(r['tricks'])}")
    print('errors:',errs[:5])
    await b.close()
asyncio.run(main(sys.argv[1]))
