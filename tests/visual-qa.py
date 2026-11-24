from playwright.sync_api import sync_playwright
from pathlib import Path
import json,re,base64,os,sys
root=Path(__file__).resolve().parents[1]
output=Path(sys.argv[1] if len(sys.argv)>1 else root/"visual-qa-output");output.mkdir(parents=True,exist_ok=True)
assets={p.stem:"data:image/webp;base64,"+base64.b64encode(p.read_bytes()).decode() for p in (root/"assets/hud-art").glob("*.webp")}
html=(root/"index.html").read_text()
html=re.sub(r'<link rel="stylesheet" href="\./([^"]+)">',lambda m:"<style>"+(root/m[1]).read_text()+"</style>",html)
html=re.sub(r"url\(['\"]?\./hud-art/([^/'\")]+)\.webp['\"]?\)",lambda m:"url('"+assets[m[1]]+"')",html)
html=re.sub(r'<script type="importmap">.*?</script>',"",html,flags=re.S)
js=(root/"src/ui-lab.js").read_text().replace("im.src='./assets/hud-art/'+n+'.webp'","im.src=ART[n]")
js="const ART="+json.dumps(assets)+";\n"+js
html=re.sub(r'<script type="module">.*?</script>',lambda m:'<script type="module">'+js+'</script>',html,flags=re.S)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files'])
 results=[]
 for w,h in [(1920,1080),(1600,900),(1366,768),(1280,720),(1024,768),(390,844),(844,390)]:
  page=b.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  page.on('pageerror',lambda e:print('PAGE ERROR',e))
  page.set_content(html,wait_until='domcontentloaded');page.wait_for_function('window.shinobiLab!==undefined',timeout=10000)
  for scenario,config in [('explore',{}),('long',{'long':True,'character':'kakashi','state':'building','rage':45}),('boss',{'boss':True,'character':'naruto','state':'active','rage':60,'long':True,'sandbox':True}),('fallback',{'boss':False,'art':False,'long':False,'sandbox':False,'state':'locked'}),('immersive',{'art':True,'immersive':True,'state':'ready'}),('compact',{'scale':'compact','state':'locked'}),('large',{'scale':'large','long':True,'state':'building','rage':45})]:
   page.evaluate('(c)=>window.shinobiLab.apply(c)',{'character':'naruto','rage':100,'state':'ready','scale':'normal','boss':False,'giant':True,'long':False,'immersive':False,'map':True,'art':True,'tools':False,'sandbox':False,**config});page.wait_for_timeout(170)
   r=page.evaluate('window.shinobiLab.inspect()');results.append({'scenario':scenario,**r});print(w,h,scenario,r['issues'])
   if (w,h,scenario) in [(1920,1080,'explore'),(1366,768,'explore'),(1280,720,'boss'),(390,844,'explore'),(844,390,'explore')]:page.screenshot(path=str(output/f'hud-{w}x{h}-{scenario}.png'))
  page.close()
 (output/'visual-qa-results.json').write_text(json.dumps(results,indent=2));b.close()
 failures=[r for r in results if r['issues'] or not all(x[1] for x in r['loadedArt'])];print(f'{len(results)-len(failures)}/{len(results)} cases passed');sys.exit(bool(failures))
