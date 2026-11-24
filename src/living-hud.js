/* Living Shinobi HUD v1.20b.2 — view adapter only; gameplay owns all resource values. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id),hud=$('hud'),top=$('top'),meter=$('kyubiMeter'),source=$('kyubiActivate'),panel=$('kyubiHUD');
 if(!hud||!top||!meter||!source||!panel||!window.MutationObserver)return;
 const base='./assets/hud-art/living-',variants=['normal','active'],paths=variants.flatMap(v=>[base+v+'-empty.webp',base+v+'-full.webp']);
 const clamp=n=>Math.min(100,Math.max(0,Number.isFinite(n)?n:0));
 const arc=(p)=>{const r=140,cx=218,cy=151;p=clamp(p);if(p===0)return 'M218 151Z';if(p===100)return 'M78 151a140 140 0 1 0 280 0a140 140 0 1 0 -280 0Z';const angle=p*Math.PI/50-Math.PI/2;return `M${cx} ${cy}L${cx} ${cy-r}A${r} ${r} 0 ${p>50?1:0} 1 ${cx+r*Math.cos(angle)} ${cy+r*Math.sin(angle)}Z`;};
 const img=(path,clip='')=>`<image href="${path}" width="880" height="310" ${clip?`clip-path="url(#${clip})"`:''}/>`;
 const art=document.createElement('div');art.id='livingHudArt';art.innerHTML=`<svg viewBox="0 0 880 310" role="img" aria-label="Naruto illustrated profile with live resource bars"><defs><clipPath id="livingHpClip"><rect id="livingHpRect" x="350" y="90" width="0" height="50"/></clipPath><clipPath id="livingChClip"><rect id="livingChRect" x="350" y="145" width="0" height="44"/></clipPath><clipPath id="livingStClip"><rect id="livingStRect" x="350" y="197" width="0" height="44"/></clipPath><clipPath id="livingRageClip"><path id="livingRageArc" d="M218 151Z"/></clipPath><clipPath id="livingRingBounds"><rect x="65" y="0" width="285" height="310"/></clipPath></defs>${variants.map(v=>`<g class="living-variant living-${v}">${img(base+v+'-empty.webp')}${img(base+v+'-full.webp','livingHpClip')}${img(base+v+'-full.webp','livingChClip')}${img(base+v+'-full.webp','livingStClip')}<g clip-path="url(#livingRingBounds)">${img(base+v+'-full.webp','livingRageClip')}</g></g>`).join('')}</svg><button type="button" class="living-transform" id="livingTransform" disabled aria-label="Transform into Kyūbi"></button>`;
 top.prepend(art);
 const fallback=top.querySelector('.portrait-frame'),fallbackButton=document.createElement('button');fallbackButton.type='button';fallbackButton.className='living-transform living-transform-fallback';fallbackButton.disabled=true;fallbackButton.setAttribute('aria-label','Transform into Kyūbi');fallback.append(fallbackButton);
 const status=document.createElement('div');status.id='livingFury';status.setAttribute('role','meter');status.setAttribute('aria-label','Nine-Tails chakra');status.setAttribute('aria-valuemin','0');status.setAttribute('aria-valuemax','100');status.setAttribute('aria-valuenow','0');status.textContent='Kyūbi · Sealed';top.querySelector('.hero-head').after(status);
 const button=$('livingTransform');for(const b of [button,fallbackButton])b.addEventListener('click',()=>{if(!source.disabled)source.click();});
 const pct=id=>clamp(parseFloat($(id).style.width)||0),set=(el,k,v)=>{if(el.getAttribute(k)!==String(v))el.setAttribute(k,String(v));};
 let last='';
 function sync(){
  const active=hud.dataset.character==='naruto'&&hud.dataset.form==='kyubi',state=panel.dataset.state||'locked',rage=clamp(Number(meter.getAttribute('aria-valuenow'))),hp=pct('hp'),ch=pct('chakra'),st=pct('stamina'),disabled=source.disabled,desc=$('kyubiValue').textContent||'0%',label=source.textContent||'',artEnabled=hud.dataset.livingFallback!=='true';
  const key=[active,state,rage,hp,ch,st,disabled,desc,label,source.title,hud.dataset.character,artEnabled].join('|');if(last===key)return;last=key;
  top.dataset.livingState=state;top.dataset.livingForm=active?'active':'normal';top.style.setProperty('--living-rage',rage+'%');
  set($('livingHpRect'),'width',420*hp/100);set($('livingChRect'),'width',410*ch/100);set($('livingStRect'),'width',300*st/100);set($('livingRageArc'),'d',arc(rage));
  const message=state==='active'?'Kyūbi · '+desc+' remaining':state==='locked'?'Kyūbi · Sealed':state==='ready'?'Kyūbi · '+label:'Kyūbi · '+desc;
  if(status.textContent!==message)status.textContent=message;set(status,'aria-valuenow',rage);set(status,'aria-valuetext',message);
  for(const b of [button,fallbackButton]){b.disabled=disabled;b.title=source.title||message;b.setAttribute('aria-label',message+(disabled?'':' · Activate'));}
 }
 const observer=new MutationObserver(sync);for(const [el,opts] of [[hud,{attributes:true,attributeFilter:['data-character','data-form','data-living-fallback']}],[meter,{attributes:true,attributeFilter:['aria-valuenow']}],[panel,{attributes:true,attributeFilter:['data-state']}],[source,{attributes:true,attributeFilter:['disabled','title'],childList:true,characterData:true,subtree:true}],[$('kyubiValue'),{childList:true,characterData:true,subtree:true}],...['hp','chakra','stamina'].map(id=>[$(id),{attributes:true,attributeFilter:['style']}])])observer.observe(el,opts);
 hud.dataset.livingHud='true';sync();
 // Enable the art atomically only when all four exact source textures decode.
 Promise.all(paths.map(path=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(true);img.onerror=()=>resolve(false);img.src=path;}))).then(results=>{hud.dataset.livingArt=results.every(Boolean)?'ready':'fallback';});
})();
