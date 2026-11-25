from playwright.sync_api import sync_playwright
from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]; html=(r/'konoha-three-lab.html').read_text().split('<script type="module"')[0]+'</body></html>'; js=(r/'qa-inline.js').read_text();assets=json.loads((r/'qa-assets.json').read_text());results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1366,'height':768});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(html);page.evaluate('(a)=>globalThis.KONOHA_INLINE_ASSETS=a',assets);page.add_script_tag(content=js);page.wait_for_function('window.KONOHA_QA?.state().ready && KONOHA_QA.state().frames>2',timeout=20000);state=lambda:page.evaluate('KONOHA_QA.state()');assert state()['loaded']==39
 page.click('#sample');page.wait_for_function('KONOHA_QA.state().mode==="lookout" && KONOHA_QA.state().view.height>70',timeout=10000);page.wait_for_timeout(800);page.screenshot(path=str(r/'hokage-lookout.png'))
 page.click('#walk');page.click('#travelOpen');page.locator('#destinations button').first.click();page.wait_for_function('KONOHA_QA.state().travel===null && KONOHA_QA.state().p.y===78',timeout=18000);assert state()['mode']=='walk'
 page.keyboard.down('Shift');page.keyboard.down('w');page.wait_for_function('KONOHA_QA.state().sprint && KONOHA_QA.state().speed>=15.8',timeout=20000);s=state();assert s['dust']>0 and not s['blocked'],s;page.screenshot(path=str(r/'ninja-sprint.png'))
 page.keyboard.up('Shift');page.keyboard.up('w');page.wait_for_function('!KONOHA_QA.state().sprint && KONOHA_QA.state().held===0');page.click('#unlock');page.evaluate('KONOHA_QA.teleport(72,78)');page.keyboard.down('Shift');page.keyboard.down('w');page.wait_for_function('KONOHA_QA.state().held>2.6',timeout=20000);assert not state()['sprint'] and state()['speed']==8.4
 page.keyboard.up('w');page.keyboard.up('Shift');page.click('#unlock');page.evaluate('KONOHA_QA.teleport(72,24)');page.keyboard.down('Shift');page.keyboard.down('w');page.wait_for_timeout(600);assert not state()['sprint'] and not state()['blocked'];page.keyboard.up('w');page.keyboard.up('Shift')
 page.click('#travelOpen');page.locator('#destinations button').nth(2).click();page.wait_for_function('KONOHA_QA.state().mode==="lookout" && KONOHA_QA.state().travel===null',timeout=18000);assert state()['p']['y']==26;assert not errors,errors
 results.append({'viewport':[1366,768],'backend':state()['backend'],'sprint':s,'travel':True,'lookout':True,'lockedSprint':True,'collision':True,'errors':errors});print(json.dumps(results[-1],ensure_ascii=False),flush=True);page.close();b.close()
(r/'docs/mobility-qa.json').write_text(json.dumps(results,indent=2))
