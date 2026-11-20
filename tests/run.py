"""Headless playthrough of Orb Run. Usage: python3 run.py <index.html> [out.json]
Loads the game with a stand-in 3D library, deterministic randomness and frame timing,
plays a scripted session through every mode, and records game-state snapshots."""
import asyncio, json, sys, os, re
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__))
STUB=open(os.path.join(HERE,'three-stub.js')).read()
INIT="""(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined;let s=12345;Math.random=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};
window.__raf=[];window.requestAnimationFrame=cb=>{window.__raf.push(cb);return window.__raf.length};
window.__step=n=>{for(let i=0;i<n;i++){const q=window.__raf.splice(0);for(const f of q)f(0)}};})();"""
HOOK="""window.__G=()=>({state,mode,ci,runIdx,curIdx,py:+py.toFixed(3),x:+P.position.x.toFixed(3),z:+P.position.z.toFixed(3),face:+face.toFixed(3),
score,am:A.mode,jn:A.jumpN,orbs:orbs.length,hz:runHz.length,lives,runFree,cores:coreCount,time:+time.toFixed(2),win:WIN,climb:CL.on,top:CL.top,ice:onIce,
hint:document.getElementById('hint').textContent,ov:!document.getElementById('ov').classList.contains('hide'),ovT:document.getElementById('ovT').textContent,
set:!document.getElementById('set').classList.contains('hide'),outfit:OFI[2],tAll:+tAll.toFixed(3)});"""
# The scripted session: (action, arg)
def S():
  s=[]
  f=lambda n:s.append(('frames',n)); snap=lambda l:s.append(('snap',l))
  click=lambda sel:s.append(('click',sel)); down=lambda k:s.append(('down',k)); up=lambda k:s.append(('up',k))
  def tap(k,hold=2): down(k);f(hold);up(k)
  f(30);snap('title')
  # Trick Park / Plaza with Flip
  click('#go');f(2);snap('park menu');click('#go');f(5);snap('select');tap('ArrowRight');tap('ArrowLeft');tap('ArrowDown');tap('ArrowUp');click('#csGo');f(20);snap('plaza start')
  down('KeyW');f(90);snap('run fwd');tap('Space');f(25);tap('Space');f(25);tap('Space');f(40);snap('jumps');up('KeyW');f(30);snap('stop')
  down('ShiftLeft');f(10);tap('Space');f(5);up('ShiftLeft');f(60);snap('backflip')
  down('KeyW');f(50);down('ShiftLeft');f(3);tap('Space');up('ShiftLeft');f(15);tap('ShiftLeft');f(60);up('KeyW');f(30);snap('long jump + dive')
  tap('KeyJ');f(8);tap('KeyJ');f(8);tap('KeyJ');f(40);snap('combo')
  down('KeyD');f(60);down('KeyA');up('KeyD');f(40);tap('Space');f(30);up('KeyA');f(20);snap('skid flip')
  down('KeyA');f(200);up('KeyA');snap('to west');down('KeyW');f(120);up('KeyW');snap('wander')
  tap('Enter');f(260);snap('timed run');f(300);snap('timed later')
  tap('KeyP');f(3);snap('paused');click('#alt');f(10);snap('retry')
  tap('Escape');f(3);click('#alt2');f(10);snap('menu again')
  # Frozen Rink skating
  click('#go');f(2);click('#alt');f(5);click('#csGo');f(10);down('KeyW');f(80);snap('skate push');up('KeyW');f(60);snap('skate glide');down('KeyD');f(60);up('KeyD');snap('skate turn')
  down('KeyS');f(240);up('KeyS');f(30);snap('to the pine')
  tap('Escape');f(3);click('#alt2');f(10)
  # Rooftops
  click('#go');f(2);click('#alt2');f(5);click('#csGo');f(10);down('KeyW');f(100);up('KeyW');snap('rooftops street');down('KeyA');f(80);up('KeyA');tap('Space');f(40);snap('rooftops move')
  tap('Escape');f(3);click('#alt2');f(10)
  # Adventure: Lighthouse Isles
  click('#alt');f(2);snap('level menu');click('#go');f(5);click('#csGo');f(10);snap('isles start')
  down('KeyW');f(150);tap('Space');f(40);tap('Space');f(80);up('KeyW');snap('isles fwd')
  tap('KeyP');f(3);click('#alt2');f(10)
  # Adventure: Sky Gauntlet
  click('#alt');f(2);click('#alt');f(5);click('#csGo');f(10);snap('sky start');down('KeyW');f(30);down('ShiftLeft');f(3);tap('Space');up('ShiftLeft');f(70);up('KeyW');snap('sky long jump')
  down('KeyW');f(240);up('KeyW');snap('sky later')
  tap('KeyP');f(3);click('#alt2');f(10)
  # Run mode with Sunny, then Rook
  click('#go');f(2);click('#go');f(5);tap('ArrowRight');f(2);click('#csGo');f(10);down('KeyW');f(60);tap('Space');f(40);up('KeyW');snap('sunny')
  tap('Escape');f(3);click('#alt2');f(10)
  click('#go');f(2);click('#go');f(5);tap('ArrowRight');f(2);click('#csGo');f(10);down('KeyD');f(60);tap('Space');f(40);up('KeyD');snap('rook')
  # settings + season
  click('#gear');f(3);snap('settings');s.append(('click','[data-look="season"][data-i="1"]'));f(3);snap('summer');tap('Escape');f(5);snap('closed')
  return s
async def main(path,out):
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
    ctx=await b.new_context(viewport={'width':1200,'height':760})
    errs=[]
    pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append('console: '+m.text) if m.type=='error' and 'Failed to load resource' not in m.text else None)
    await ctx.route(re.compile(r'.*three(\.min)?\.js$'),lambda r:r.fulfill(body=STUB,content_type='application/javascript'))
    await ctx.route(re.compile(r'https://fonts\..*'),lambda r:r.abort())
    await pg.add_init_script(INIT)
    await pg.goto('file://'+os.path.abspath(path));await pg.wait_for_timeout(300)
    has=await pg.evaluate("typeof window.__G")
    if has!='function':
      try: await pg.evaluate(HOOK)
      except Exception as e: errs.append('hook: '+str(e))
    snaps=[]
    for a,arg in S():
      if a=='frames': await pg.evaluate(f"window.__step({arg})")
      elif a=='snap':
        g=await pg.evaluate("window.__G()");g['label']=arg;snaps.append(g)
      elif a=='click':
        el=await pg.query_selector(arg)
        if el is None: errs.append('missing '+arg)
        else: await el.evaluate("e=>e.click()")
      elif a=='down': await pg.keyboard.down(arg)
      elif a=='up': await pg.keyboard.up(arg)
      await pg.wait_for_timeout(1)
    await b.close()
  json.dump({'snaps':snaps,'errors':errs},open(out,'w'),indent=1)
  print(f"{len(snaps)} snapshots, {len(errs)} errors")
  for e in errs[:8]:print('  ERR',e)
asyncio.run(main(sys.argv[1],sys.argv[2] if len(sys.argv)>2 else 'trace.json'))
