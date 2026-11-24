# Two game windows talking through a stand-in for Trystero (BroadcastChannel), served from http://localhost:8765.
# Run from the repo root: python3 tests/p2p/p2p-check.py path/to/three.min.js   (needs playwright + Chrome)
import asyncio,re,json,subprocess,sys,time
from playwright.async_api import async_playwright
THREE=open(sys.argv[1]).read()  # path to a local three.min.js (r128)
FAKE=open('tests/p2p/fake-trystero.js').read()
srv=subprocess.Popen([sys.executable,'-m','http.server','8765','--bind','127.0.0.1'],cwd='.',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
out=[]
def ok(n,c,x=''):out.append(('OK   ' if c else 'FAIL ')+n+(' -> '+str(x) if x!='' else ''))
async def page(ctx,q='',errs=None):
  pg=await ctx.new_page()
  pg.on('pageerror',lambda e:errs.append(str(e)))
  await pg.route(re.compile(r'.*three(\.min)?\.js$'),lambda r:r.fulfill(body=THREE,content_type='application/javascript'))
  await pg.route(re.compile(r'https://fonts\..*'),lambda r:r.abort())
  await pg.route(re.compile(r'https://esm\.run/.*'),lambda r:r.fulfill(body=FAKE,content_type='application/javascript',headers={'Access-Control-Allow-Origin':'*'}))
  await pg.goto('http://localhost:8765/index.html'+q);await pg.wait_for_timeout(1200)
  return pg
async def play(pg,name,x):
  await pg.evaluate(f"setMyName('{name}');select('run',0);ci=2;showChar();confirmChar();document.getElementById('ctl').style.display='none';P.position.set({x},0,8);0")
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
    ctx=await b.new_context(viewport={'width':800,'height':500});errs=[]
    A=await page(ctx,'',errs);B=await page(ctx,'',errs)
    ok('Not on claude.ai: multiplayer uses the peer-to-peer stand-in',await A.evaluate("MP.p2p===true&&MP.on&&P2P.status==='on'"))
    ok('Loads Trystero (pinned) and joins the public lobby',await A.evaluate("__fake.roomId==='lobby'&&__fake.appId==='snowball-wars.damonsea.v1'"))
    await A.wait_for_timeout(800)
    t=await A.evaluate("$('online').textContent");ok('Title screen lists the other player',('Online now' in t),t)
    await play(A,'Alice',-3);await play(B,'Bob',3);await A.wait_for_timeout(3000)
    ok('Alice sees Bob on the map',await A.evaluate("MP.av.size===1"),await A.evaluate("MP.av.size"))
    ok('Bob sees Alice',await B.evaluate("MP.av.size===1"))
    ok('Names come through',await A.evaluate("[...MP.room.peers()].some(p=>!p.sameTab&&nameOf(p)==='Bob')"))
    hosts=[await A.evaluate("MP.host"),await B.evaluate("MP.host")];ok('Exactly one host',hosts.count(True)==1,hosts)
    await B.evaluate("P.position.set(6,0,-4);0");await B.bring_to_front();await B.wait_for_timeout(1500);await A.bring_to_front();await A.wait_for_timeout(1500)
    bpos=await B.evaluate("[P.position.x,P.position.z].map(v=>+v.toFixed(1))")
    pos=await A.evaluate("(()=>{const a=[...MP.av.values()][0];return a?[a.g.position.x,a.g.position.z].map(v=>+v.toFixed(1)):null})()")
    ok('Bob moving shows on Alice\'s screen',pos and abs(pos[0]-bpos[0])<.6 and abs(pos[1]-bpos[1])<.6,f'Alice sees {pos}, Bob is at {bpos}')
    # shared orbs: the client grabs one, the host removes it
    H,C=(A,B) if hosts[0] else (B,A)
    oid=await C.evaluate("(()=>{const o=orbs.find(o=>!o.spill&&o.y<1);if(!o)return null;P.position.set(o.g.position.x,0,o.g.position.z);py=o.y;return o.id})()")
    await A.wait_for_timeout(2500)
    ok('An orb grabbed by one player vanishes for the other',await H.evaluate(f"!orbs.some(o=>o.id==={json.dumps(oid)})||orbs.find(o=>o.id==={json.dumps(oid)}).ring.visible===false"),oid)
    lst=await A.evaluate("mpList();$('mpList').textContent");ok('Friends list shows both players',('Bob' in lst and 'Alice' in lst),lst)
    # bandwidth: only changed keys are sent
    s=await A.evaluate("({n:__fake.sent,b:__fake.bytes})");ok('Sends small updates',s['b']/max(1,s['n'])<6000,f"{s['n']} msgs, avg {s['b']//max(1,s['n'])} bytes")
    # a private room doesn't mix with the lobby
    C2=await page(ctx,'?room=bens-crew',errs);await play(C2,'Cara',0);await C2.wait_for_timeout(2500)
    ok('?room= makes a private room',await C2.evaluate("__fake.roomId==='bens-crew'&&MP.av.size===0")and await A.evaluate("MP.av.size===1"))
    ok('Private room is shown on screen',await C2.evaluate("/bens-crew/.test($('online').textContent)"),await C2.evaluate("$('online').textContent"))
    await C2.close()
    # leaving
    await B.close();await A.wait_for_timeout(2500)
    ok('When Bob closes the page he disappears for Alice',await A.evaluate("MP.av.size===0&&MP.host"))
    # bad data from a peer is ignored safely
    r=await A.evaluate("(()=>{const o={};p2pMerge(o,JSON.parse('{\"__proto__\":{\"x\":1},\"w\":\"pX\"}'));return ({}).x===undefined&&o.w==='pX'})()")
    ok('Junk from other players can\'t break things',r)
    ok('No page errors',not errs,errs[:3])
    await b.close()
  srv.terminate()
  print('\n'.join(out))
asyncio.run(main())
