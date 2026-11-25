import {skillArt,branchLabel} from './shinobi-art.js';
const NS='http://www.w3.org/2000/svg';
const make=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt)n.textContent=txt;return n;};
let atlasReady=false;const atlasImage=new Image();atlasImage.onload=()=>{atlasReady=true;for(const el of document.querySelectorAll('.jutsu-art[data-atlas]'))el.classList.add('jutsu-illustrated');};atlasImage.src=new URL('../assets/hud-art/finished/compact-icons.webp',import.meta.url).href;
const atlas={reflex:0,giant:7,bond:5,cloneII:5,cloneIII:5,endurance:5};
const counts={bond:3,cloneII:4,cloneIII:5};
const branchKanji={Taijutsu:'体術',Ninjutsu:'忍術',Clones:'影分身',Sharingan:'写輪眼',Katon:'火遁',Raiton:'雷遁',Suiton:'水遁',Chakra:'チャクラ',Medicina:'医療忍術',Estrategia:'戦術','Medical Taijutsu':'体術'};
export function renderJutsuTree(tree,{skills,learned,character,name,reasonFor,onLearn}){
 tree.replaceChildren();tree.classList.add('ninja-tree');
 const root=make('div','tree-origin');root.append(make('span','tree-seal','忍'),make('strong','',name+' · Shinobi Path'));tree.append(root);
 const branches=make('div','tree-branches');tree.append(branches);const edges=[],nodes=new Map();
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('class','tree-connections');svg.setAttribute('aria-hidden','true');tree.prepend(svg);
 const entries=Object.entries(skills);
 for(const branch of new Set(entries.map(([,s])=>s.branch))){
  const group=make('section','tree-family');const heading=make('h3','tree-family-title');heading.append(make('small','',branchKanji[branch]||'忍'),make('span','',branchLabel(branch)));group.append(heading);branches.append(group);edges.push([root,heading,true,true]);
  const graph=make('div','tree-family-graph');group.append(graph);const family=entries.filter(([,s])=>s.branch===branch);const ids=new Set(family.map(([id])=>id));
  const children=id=>family.filter(([,s])=>s.requires===id).map(([id])=>id);
  const leaves=id=>Math.max(1,children(id).reduce((n,k)=>n+leaves(k),0));
  const roots=family.filter(([,s])=>!ids.has(s.requires)).map(([id])=>id);let cursor=0;const cols=roots.reduce((n,id)=>n+leaves(id),0);graph.style.setProperty('--leaves',String(cols));
  const visit=(id,depth,from)=>{const s=skills[id],width=leaves(id),start=cursor;const done=learned.includes(id),reason=reasonFor(id),b=make('button','tree-node'+(done?' learned':''));b.type='button';b.dataset.skill=id;b.dataset.state=done?'learned':reason?'locked':'available';b.disabled=!!reason;b.style.gridColumn=(start+1)+' / span '+width;b.style.gridRow=String(depth+1);b.title=s.name+' — '+s.desc+(reason?' · '+reason:'');b.onclick=()=>onLearn(id);const icon=skillArt(id);if(character==='naruto'&&id in atlas){icon.dataset.atlas='true';if(atlasReady)icon.classList.add('jutsu-illustrated');icon.style.setProperty('--jutsu-x',atlas[id]*100/7+'%');}if(character==='naruto'&&id in counts)icon.append(make('span','clone-count',String(counts[id])));b.append(icon,make('strong','tree-name',s.name),make('small','tree-desc',s.desc),make('small','tree-req','Lv. '+s.level+(s.scroll?' · Chakra Scroll':'')),make('span','tree-status',done?'✓ Learned':reason||'Learn · '+s.cost+' point'));if(s.scroll)b.classList.add('tree-advanced');graph.append(b);nodes.set(id,b);edges.push([from,b,done||!reason,false]);const kids=children(id);if(kids.length){for(const kid of kids)visit(kid,depth+1,b);}else cursor++;};
  for(const id of roots)visit(id,0,heading);
 }
 let frame=0;const draw=()=>{if(!tree.isConnected)return;const bounds=tree.getBoundingClientRect();if(!bounds.width||!bounds.height)return;svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);svg.replaceChildren();const mobile=getComputedStyle(branches).gridTemplateColumns.split(' ').length===1;for(const [a,b,lit,rootEdge] of edges){if(mobile&&rootEdge)continue;const x=a.getBoundingClientRect(),y=b.getBoundingClientRect(),x1=x.left+x.width/2-bounds.left,y1=x.bottom-bounds.top,x2=y.left+y.width/2-bounds.left,y2=y.top-bounds.top,mid=(y1+y2)/2;const path=document.createElementNS(NS,'path');path.setAttribute('d',`M${x1} ${y1} V${mid} H${x2} V${y2}`);path.setAttribute('class',lit?'tree-edge-lit':'tree-edge');svg.append(path);}};
 tree._jutsuObserver?.disconnect();const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);};const obs=new ResizeObserver(schedule);obs.observe(tree);tree._jutsuObserver=obs;schedule();
}
