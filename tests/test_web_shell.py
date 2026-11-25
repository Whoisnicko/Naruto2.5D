from pathlib import Path
from playwright.sync_api import sync_playwright
import json, threading, functools, html
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
p=Path(__file__).resolve().parents[1]
fragment=(p/'boot-fragment.html').read_text()
css=(p/'assets/web-shell.css').read_text()
js=(p/'src/web-shell.js').read_text()
icon='<svg class="web-fs-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5"/></svg><span class="web-fs-label">Fullscreen</span>'
fixture='<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#243445}*{box-sizing:border-box}.classic-stage{position:relative;width:100vw;height:100vh}#hud{position:absolute;inset:0;pointer-events:none}#utilityDock{position:absolute;bottom:8px;right:8px;display:grid;pointer-events:auto}'+css+'</style>'+fragment+'<div id="menu" inert><div class="classic-stage"><img class="classic-art" src="data:image/png;base64,AAAA"><button id="titleFullscreen" data-web-fullscreen type="button">'+icon+'</button><button id="start" disabled>New Game</button></div></div><div id="hud" inert><div id="utilityDock"><button id="gameFullscreen" data-web-fullscreen type="button">'+icon+'</button></div></div><script>'+js+'''</script><script>let releaseEngine, rejectEngine; ShinobiWebShell.start(()=>new Promise((resolve,reject)=>{releaseEngine=()=>{document.getElementById('start').disabled=false;resolve()};rejectEngine=()=>reject(Error('simulated import failure'))}));</script></html>'''
(p/'test-fixture.html').write_text(fixture)
(p/'test-frame.html').write_text('<iframe id="game" src="test-fixture.html" allow="fullscreen" allowfullscreen style="width:960px;height:540px;border:0"></iframe>')
(p/'test-denied.html').write_text('<iframe id="game" src="test-fixture.html" allow="fullscreen \'none\'" style="width:960px;height:540px;border:0"></iframe>')
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(p)))
threading.Thread(target=server.serve_forever,daemon=True).start(); base=f'http://127.0.0.1:{server.server_port}/'; results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h in [(941,534),(1280,720),(1920,1080),(390,844)]:
  page=browser.new_page(viewport={'width':w,'height':h}); errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(fixture);page.wait_for_function("document.getElementById('webBootProgress').value===2");assert page.locator('#webBoot').is_visible() and page.locator('#menu').evaluate('(e)=>e.inert');assert page.locator('#start').is_disabled();assert page.locator('.classic-art').evaluate('(e)=>e.hidden');
  if w==941:page.screenshot(path=str(p/'loading-screen-real.png'))
  rect=page.locator('.web-boot-card').bounding_box();assert rect['x']>=0 and rect['y']>=0 and rect['x']+rect['width']<=w+1 and rect['y']+rect['height']<=h+1
  page.evaluate('releaseEngine()');page.wait_for_function("document.documentElement.dataset.webReady==='true'");assert not page.locator('#webBoot').is_visible();assert page.locator('#start').is_enabled() and not page.locator('#menu').evaluate('(e)=>e.inert'); assert not errors,errors
  results.append({'viewport':[w,h],'waitsForEngine':True,'menuUnlockedAfterInit':True,'missingCoverFallback':True,'noPageErrors':True});page.close()
 page=browser.new_page(viewport={'width':941,'height':534});page.set_content(fixture);page.evaluate('rejectEngine()');page.wait_for_selector('#webBootError',state='visible');assert page.locator('#webBoot').is_visible() and page.locator('#menu').evaluate('(e)=>e.inert');page.screenshot(path=str(p/'loading-error-real.png'));page.close()
 page=browser.new_page(viewport={'width':1100,'height':650});page.set_content('<iframe id="game" allow="fullscreen" allowfullscreen style="width:960px;height:540px;border:0" srcdoc="'+html.escape(fixture,quote=True)+'"></iframe>');frame=page.frame_locator('#game');frame.locator('#webBootProgress').wait_for();page.frames[1].evaluate('releaseEngine()');frame.locator('#webBoot').wait_for(state='hidden');frame.locator('#titleFullscreen').click();page.frames[1].wait_for_function('!!document.fullscreenElement');assert frame.locator('#titleFullscreen').get_attribute('aria-pressed')=='true';assert frame.locator('#gameFullscreen').get_attribute('aria-pressed')=='true';frame.locator('#titleFullscreen').click();page.frames[1].wait_for_function('!document.fullscreenElement');assert frame.locator('#gameFullscreen').get_attribute('aria-pressed')=='false';page.close()
 page=browser.new_page(viewport={'width':1100,'height':650});page.set_content('<iframe id="game" allow="fullscreen \'none\'" style="width:960px;height:540px;border:0" srcdoc="'+html.escape(fixture,quote=True)+'"></iframe>');page.frames[1].evaluate('releaseEngine()');f=page.frame_locator('#game');f.locator('#webBoot').wait_for(state='hidden');f.locator('#titleFullscreen').click();f.locator('#webFullscreenStatus').wait_for(state='visible');assert 'unavailable' in f.locator('#webFullscreenStatus').inner_text();assert f.locator('#titleFullscreen').get_attribute('aria-pressed')=='false';page.close();browser.close()
server.shutdown()
report={'scope':'Browser fixture with actual new CSS/JS/markup, simulated game import, not full game','viewports':results,'rejectedImportShowsRetry':True,'iframeFullscreenEnterExit':True,'deniedFullscreenFeedback':True}
(p/'docs/web-shell-qa.json').write_text(json.dumps(report,indent=2)); print(json.dumps(report,indent=2))
