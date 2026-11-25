import pathlib,base64,json,re
p=pathlib.Path(__file__).resolve().parents[1]; b64=lambda b:base64.b64encode(b).decode()
three=(p/'vendor/three.module.min.js').read_text(); head,tail=three.rsplit('export{',1); ex=tail.split('};')[0]; items=[]
for x in ex.split(','):
 s=x.split(' as ');items.append((s[-1]+':'+s[0]))
three='const THREE=(()=>{'+head+'\nreturn {'+','.join(items)+'};})();'
mods=['src/konoha-layout.js','src/pixel-art.js','src/konoha-three-data.js','src/konoha-mobility.js']; source='\n'.join((p/f).read_text().replace('export ','') for f in mods)
assets={a.stem:'data:image/webp;base64,'+b64(a.read_bytes()) for a in (p/'assets/konoha-world3c').glob('*.webp')}
s=(p/'src/konoha-three-lab.js').read_text();s=re.sub(r'^import .*?;\n','',s,flags=re.M).replace('import.meta.url','location.href');
# classic script async wrapper; the original library is unchanged in the modular package.
script='(async()=>{'+three+'\n'+source+'\n'+s+'\n})().catch(e=>{document.getElementById("progress").textContent=e.message;console.error(e);});'
html=(p/'konoha-three-lab.html').read_text().replace('<script type="module" src="./src/konoha-three-lab.js"></script>','<script>globalThis.KONOHA_INLINE_ASSETS='+json.dumps(assets)+';</script><script>'+script+'</script>')
(p/'konoha-three-playable.html').write_text(html);(p/'qa-inline.js').write_text(script);(p/'qa-assets.json').write_text(json.dumps(assets))
