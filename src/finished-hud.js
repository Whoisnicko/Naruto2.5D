/* v1.20b.3 — presentation adapter. The game retains authoritative resources and controls. */
(()=>{
  'use strict';
  const $=id=>document.getElementById(id),hud=$('hud'),top=$('top'),sheet=$('missionSheet'),journal=$('journalWindow');
  if(!hud||!top)return;
  // Keep the original live mission nodes and IDs; the journal owns their presentation.
  if(sheet&&journal){journal.insertBefore(sheet,$('chapterList'));sheet.setAttribute('aria-label','Current missions');}
  const art=$('livingHudArt'),svg=art?.querySelector('svg'),xp=$('xpFill'),meter=$('kyubiMeter'),seal=$('kyubiHUD');
  const ns='http://www.w3.org/2000/svg',node=(name,attrs={})=>{const el=document.createElementNS(ns,name);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));return el;};
  let fill=null,progress=null,fury=null,furyFallback=null;
  const percent=n=>Math.min(100,Math.max(0,Number.isFinite(n)?n:0));
  const set=(el,key,value)=>{if(el&&el.getAttribute(key)!==String(value))el.setAttribute(key,String(value));};
  const write=(el,value)=>{if(el&&el.textContent!==String(value))el.textContent=String(value);};
  if(svg&&xp){
    const defs=svg.querySelector('defs'),grad=node('linearGradient',{id:'finishedXpGradient',x1:'0',y1:'0',x2:'0',y2:'1'});
    for(const [offset,color] of [['0%','#d0ff8c'],['23%','#96fa55'],['52%','#4cce32'],['100%','#157c3c']])grad.append(node('stop',{offset,'stop-color':color}));defs.append(grad);
    progress=node('g',{id:'finishedXpMeter',role:'meter','aria-label':'Experience toward next level','aria-valuemin':0,'aria-valuemax':100,'aria-valuenow':0});
    // Slim green fourth bar, directly beneath the four-segment orange stamina bar.
    progress.append(node('rect',{x:349,y:242,width:306,height:17,rx:5,fill:'#151820',stroke:'#8c6945','stroke-width':2}));
    progress.append(node('rect',{x:353,y:246,width:298,height:9,rx:3,fill:'#203327'}));
    fill=node('rect',{id:'finishedXpFill',x:353,y:246,width:0,height:9,rx:3,fill:'url(#finishedXpGradient)'});progress.append(fill);svg.append(progress);
  }
  function makeFury(id,parent){const el=document.createElement('span');el.id=id;el.className='finished-fury';el.setAttribute('role','meter');el.setAttribute('aria-label','Nine-Tails chakra');el.setAttribute('aria-valuemin','0');el.setAttribute('aria-valuemax','100');el.setAttribute('aria-valuenow','0');el.textContent='0%';parent.append(el);return el;}
  if(art)fury=makeFury('finishedFury',art);
  const head=top.querySelector('.hero-head');if(head)furyFallback=makeFury('finishedFuryFallback',head);
  function sync(){
    const x=percent(parseFloat(xp?.style.width||'0')),r=percent(Number(meter?.getAttribute('aria-valuenow')||0)),state=seal?.dataset.state||'locked';
    set(fill,'width',298*x/100);set(progress,'aria-valuenow',Math.round(x));
    for(const el of [fury,furyFallback])if(el){write(el,Math.floor(r)+'%');set(el,'aria-valuenow',Math.floor(r));set(el,'aria-valuetext',meter?.getAttribute('aria-valuetext')||Math.floor(r)+'%');el.dataset.state=state;}
    for(const [id,label] of [['hp','Health'],['chakra','Chakra'],['stamina','Stamina'],['xpFill','Experience toward next level']]){const bar=$(id),track=bar?.parentElement;if(!track)continue;const v=percent(parseFloat(bar.style.width||'0'));set(track,'role','meter');set(track,'aria-label',label);set(track,'aria-valuemin',0);set(track,'aria-valuemax',100);set(track,'aria-valuenow',Math.round(v));}
  }
  if(window.MutationObserver){const observer=new MutationObserver(sync);for(const id of ['hp','chakra','stamina','xpFill'])if($(id))observer.observe($(id),{attributes:true,attributeFilter:['style']});if(meter)observer.observe(meter,{attributes:true,attributeFilter:['aria-valuenow','aria-valuetext']});if(seal)observer.observe(seal,{attributes:true,attributeFilter:['data-state']});}
  hud.dataset.finishedHud='true';sync();
  // Atomic graphical groups with existing CSS/canvas fallback; no new game state.
  const groups={dock:['dock-frame','skill-icons','defense-button'],menu:['menu-buttons','quick-frame'],map:['minimap-frame']},loaded=new Set();
  if(typeof Image==='function')for(const [group,names] of Object.entries(groups))Promise.all(names.map(name=>new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(true);im.onerror=()=>resolve(false);im.src='./assets/hud-art/finished/'+name+'.webp';}))).then(results=>{if(results.every(Boolean)){loaded.add(group);hud.dataset.finishArt=[...loaded].join(' ');}});
})();
