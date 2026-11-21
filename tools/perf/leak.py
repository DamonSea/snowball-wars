import asyncio,re,sys
from playwright.async_api import async_playwright
LP=open('/home/claude/orb/tests/lines.py').read()
INIT=re.search(r'INIT="""(.*?)"""',LP,re.S).group(1);DRIVER=re.search(r'DRIVER=r"""(.*?)"""',LP,re.S).group(1)
THREE=open('/home/claude/vendor/three/build/three.min.js').read()
JS=r"""(()=>{const out={};const G=()=>renderer.info.memory.geometries;const S=__step;
menu();S(5);pickMode='run';pickLevel=0;ci=2;showChar();confirmChar();S(30);
let g=G();for(let i=0;i<30;i++){shockRing(0,0,10);S(30)}out.pound=[g,G()];
g=G();for(let i=0;i<20;i++){runHz.forEach(h=>{if(!h.dead){killFoe(h);h.dead=true;rmObj(h.g)}});S(5);spawnRunHz('goon');spawnRunHz('penguin');S(5)}out.foes=[g,G(),runHz.length];
g=G();for(let i=0;i<40;i++){spawnOrb();S(2);if(orbs.length){const o=orbs[orbs.length-1];__place(o.g.position.x,o.g.position.z,0,0)}S(3)}out.orbs=[g,G()];
openBuilder(blankMap());S(3);g=G();for(let i=0;i<60;i++){placeAt('block',(i%10)-5,Math.floor(i/10)-3);S(1)}out.builder=[g,G()];
exitBuilder();return JSON.stringify(out)})()"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    ctx=await b.new_context(viewport={'width':640,'height':360})
    await ctx.route(re.compile(r'.*three(\.min)?\.js$'),lambda r:r.fulfill(body=THREE,content_type='application/javascript'))
    await ctx.route(re.compile(r'https://fonts\..*'),lambda r:r.abort())
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.add_init_script(INIT);await pg.goto('file://'+(sys.argv[1] if len(sys.argv)>1 else '/home/claude/orb/src/index.html'));await pg.wait_for_timeout(500);await pg.evaluate(DRIVER)
    print(await pg.evaluate(JS));print('errors',errs[:3]);await b.close()
asyncio.run(main())
