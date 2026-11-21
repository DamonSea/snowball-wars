import asyncio,re
from playwright.async_api import async_playwright
THREE=open('/home/claude/vendor/three/build/three.min.js').read()
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
    pg=await b.new_page(viewport={'width':1100,'height':560});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.route(re.compile(r'.*three(\.min)?\.js$'),lambda r:r.fulfill(body=THREE,content_type='application/javascript'))
    await pg.route(re.compile(r'https://fonts\..*'),lambda r:r.abort())
    await pg.goto('file:///home/claude/orb/src/index.html');await pg.wait_for_timeout(800)
    await pg.evaluate("""select('run',0);ci=2;showChar();confirmChar();setCpu&&setCpu(false);
      document.querySelectorAll('header.hud,#hint,#ctl,#ctlShow,#toast').forEach(e=>e.style.visibility='hidden');
      orbs.forEach(o=>rmObj(o.g));orbs=[];runHz.forEach(h=>rmObj(h.g));runHz=[];
      P.position.set(14,0,-6);py=0;P.scale.set(.001,.001,.001);T.camera.height=1.6;T.camera.back=7;
      window.__av=[0,1,2,3,4,5].map((c,i)=>{const a=makeAv(c);a.g.position.set(9.5+i*1.8,0,-6.6);a.g.rotation.y=c===4?-.25:0;return a});""")
    await pg.wait_for_timeout(2500)
    await pg.evaluate("runHz.forEach(h=>rmObj(h.g));runHz=[];T.run.hazardsFree=0")
    await pg.wait_for_timeout(1200);await pg.screenshot(path='/home/claude/bshot/lineup6.png')
    print('errors',errs[:3]);await b.close()
asyncio.run(main())
