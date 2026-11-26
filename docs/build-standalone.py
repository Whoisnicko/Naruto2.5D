import pathlib,base64,json,re
p=pathlib.Path(__file__).resolve().parents[1]; b64=lambda b:base64.b64encode(b).decode()
three=(p/'vendor/three.module.min.js').read_text(); head,tail=three.rsplit('export{',1); ex=tail.split('};')[0]; items=[]
for x in ex.split(','):
 s=x.split(' as ');items.append((s[-1]+':'+s[0]))
three='const THREE=(()=>{'+head+'\nreturn {'+','.join(items)+'};})();'
mods=['src/konoha-layout.js','src/pixel-art.js','src/konoha-three-data.js','src/konoha-mobility.js']; source='\n'.join((p/f).read_text().replace('export ','') for f in mods)
# Scope original RPG and world modules to avoid collisions with the lab's globals.
def scoped(file,names):
 text=(p/file).read_text()
 text=re.sub(r'^import .*?;\n','',text,flags=re.M).replace('export ','')
 if file=='src/konoha-regions.js': text='const villageBlocked=blocked,villageStep=step;\n'+text
 return 'const {'+names+'}=(()=>{\n'+text+'\nreturn {'+names+'};})();'
source+='\n'+scoped('src/rpg-data.js','newRPG,itemFor,itemCount,addItem,removeItem,rewardItems,useItem,collectOverflow')
source+='\n'+scoped('src/world-data.js','NPCS,DIALOGUES,newWorld,SIDEQUESTS,SHOPS,choicesFor,questProgress,acceptQuest,finishQuest,buyPrice,sellPrice,buyItem,sellItem,healPlayer,DAY_SECONDS,DAY_RATE,worldTime,WEATHER,weatherDuration')
source+='\n'+scoped('src/character-data.js','CHARACTERS')
source+='\n'+scoped('src/konoha-regions.js','REGIONS,PORTALS,regionBlocked,regionStep,createRegionRouter')
source+='\n'+scoped('src/konoha-services.js','createVillageServices')
source+='\n'+scoped('src/konoha-village.js','createVillage')
source+='\n'+scoped('src/konoha-atmosphere.js','createAtmosphere,createAtmosphereView,WEATHER_LABELS')
assets={a.stem:'data:image/webp;base64,'+b64(a.read_bytes()) for a in (p/'assets/konoha-world3c').glob('*.webp')}
s=(p/'src/konoha-three-lab.js').read_text();s=re.sub(r'^import .*?;\n','',s,flags=re.M).replace('import.meta.url','location.href');
# classic script async wrapper; the original library is unchanged in the modular package.
script='(async()=>{'+three+'\n'+source+'\n'+s+'\n})().catch(e=>{document.getElementById("progress").textContent=e.message;console.error(e);});'
html=(p/'konoha-three-lab.html').read_text().replace('<script type="module" src="./src/konoha-three-lab.js?v=3c51"></script>','<script>globalThis.KONOHA_INLINE_ASSETS='+json.dumps(assets)+';</script><script>'+script+'</script>')
(p/'konoha-three-playable.html').write_text(html);(p/'qa-inline.js').write_text(script);(p/'qa-assets.json').write_text(json.dumps(assets))
