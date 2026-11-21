import asyncio,re,sys,json
from playwright.async_api import async_playwright
LP=open('/home/claude/orb/tests/lines.py').read()
INIT=re.search(r'INIT="""(.*?)"""',LP,re.S).group(1)
THREE=open('/home/claude/vendor/three/build/three.min.js').read()
GAME=sys.argv[1] if len(sys.argv)>1 else '/home/claude/orb/src/index.html'
JS=r"""(()=>{const res={};const S=n=>{for(let i=0;i<n;i++){const q=window.__raf.splice(0);for(const f of q)f(0)}};
const go=(c,m,adv)=>{menu();pickMode=adv?'adv':'run';pickLevel=m;ci=c;showChar();confirmChar();S(30)};
const meas=(label)=>{let calls=0,tris=0,t=0;const N=20;for(let i=0;i<N;i++){const a=performance.now();S(1);t+=performance.now()-a;calls+=renderer.info.render.calls;tris+=renderer.info.render.triangles}
  res[label]={calls:Math.round(calls/N),ktris:Math.round(tris/N/1000),ms:+(t/N).toFixed(1),geos:renderer.info.memory.geometries,progs:renderer.info.programs.length,objs:(()=>{let n=0;scene.traverse(()=>n++);return n})()}};
menu();S(20);meas('menu');
RUNMAPS.forEach((M,i)=>{if(M.custom)return;go(2,i);meas('park: '+M.name)});
levels.forEach((L,i)=>{go(2,i,true);meas('adventure: '+L.name)});
go(2,0);const g0=renderer.info.memory.geometries;let n0=0;scene.traverse(()=>n0++);
for(let k=0;k<6;k++){S(200);}let n1=0;scene.traverse(()=>n1++);res['plaza 20s play']={geosBefore:g0,geosAfter:renderer.info.memory.geometries,objsBefore:n0,objsAfter:n1,foes:runHz.length};
sun.castShadow=false;meas('plaza, shadows off');sun.castShadow=true;
renderer.setPixelRatio(1);meas('plaza, 1x pixels');
return JSON.stringify(res,null,1)})()"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    ctx=await b.new_context(viewport={'width':1280,'height':720},device_scale_factor=2)
    await ctx.route(re.compile(r'.*three(\.min)?\.js$'),lambda r:r.fulfill(body=THREE,content_type='application/javascript'))
    await ctx.route(re.compile(r'https://fonts\..*'),lambda r:r.abort())
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.add_init_script(INIT);await pg.goto('file://'+GAME);await pg.wait_for_timeout(500)
    print(await pg.evaluate(JS));print('errors',errs[:3]);await b.close()
asyncio.run(main())
