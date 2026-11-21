"""Record gameplay GIFs with real three.js in headless Chrome (software WebGL)."""
import asyncio,os,re,sys,json,subprocess,shutil
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.abspath(os.path.join(HERE,'..','..'))
LP=open(os.path.join(ROOT,'tests','lines.py')).read()
INIT=re.search(r'INIT="""(.*?)"""',LP,re.S).group(1)
DRIVER=re.search(r'DRIVER=r"""(.*?)"""',LP,re.S).group(1)
THREE=open(os.environ.get('THREE_JS','three.min.js')).read()  # three.js r128 build
GAME=os.environ.get('GAME',os.path.join(ROOT,'index.html'))
async def page(p,w=960,h=540):
  b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
  ctx=await b.new_context(viewport={'width':w,'height':h})
  await ctx.route(re.compile(r'.*three(\.min)?\.js$'),lambda r:r.fulfill(body=THREE,content_type='application/javascript'))
  await ctx.route(re.compile(r'https://fonts\..*'),lambda r:r.abort())
  pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  await pg.add_init_script(INIT);await pg.goto('file://'+GAME);await pg.wait_for_timeout(400)
  await pg.evaluate(DRIVER)
  return b,pg,errs
async def still(js,out):
  async with async_playwright() as p:
    b,pg,errs=await page(p)
    await pg.evaluate(js);await pg.evaluate("__step(2)");await pg.screenshot(path=out);print('errors',errs[:3]);await b.close()
async def gif(name,setup,frames,per=0,fps=15,w=540):
  async with async_playwright() as p:
    b,pg,errs=await page(p)
    await pg.evaluate(setup)
    d=f'/tmp/frames_{name}';shutil.rmtree(d,ignore_errors=True);os.makedirs(d)
    for i in range(frames):
      await pg.evaluate(f"__scen({i});__step({per})");await pg.screenshot(path=f'{d}/{i:04d}.png')
    await b.close()
    out=os.path.join(ROOT,'docs','media',f'{name}.gif')
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate',str(fps),'-i',f'{d}/%04d.png','-vf',f'scale={w}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle','-loop','0',out],check=True)
    print(name,frames,'frames',os.path.getsize(out)//1024,'KB','errors',errs[:3])
if __name__=='__main__':
  asyncio.run(still(sys.argv[1],sys.argv[2]))
