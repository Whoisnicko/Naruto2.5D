import {NPCS,CHESTS,LANDMARKS,SIDEQUESTS,SHOPS,DIALOGUES,choicesFor,questProgress,buyPrice,sellPrice,worldTime,DAY_SECONDS} from './world-data.js';
import {itemFor,itemCount} from './rpg-data.js';
import {itemIcon} from './rpg-ui.js';
const $=id=>document.getElementById(id);
export function createWorldUI(api){
 let npc=null,mode='dialog',opened=false,shown='',reveal=0,full='',timer=null;
 const panel=$('worldPanel'),body=$('worldBody'),opts=$('worldChoices'),map=$('miniMap');
 const cx=map.getContext('2d');if(cx)cx.imageSmoothingEnabled=false;
 const base=document.createElement('canvas');base.width=base.height=100;const b=base.getContext('2d');if(b){
 b.fillStyle='#506e51';b.fillRect(0,0,100,100);b.fillStyle='#c2a374';b.fillRect(0,46,100,5);b.fillRect(35,24,5,38);b.fillStyle='#537fa0';b.fillRect(55,0,6,100);b.fillStyle='#be9766';b.fillRect(55,46,6,5);b.fillStyle='#a18b6d';for(const [x,z,w,d] of [[-21,-8,6,5],[-13,-9,6,5],[-5,-9,6,5],[-21,6,7,5],[-5,7,6,5],[-30,-2,6,6],[-30,8,5,5],[-13,-20,10,8]])b.fillRect(x+50-w/2,z+50-d/2,w,d);}
 function el(tag,str,cls){const e=document.createElement(tag);if(str)e.textContent=str;if(cls)e.className=cls;return e;}
 function button(label,fn){const e=el('button',label);e.type='button';e.onclick=fn;return e;}
 function stopText(){if(timer!==null){clearInterval(timer);timer=null;}body.textContent=full;}
 function speak(s){stopText();full=s;body.textContent='';reveal=0;timer=setInterval(()=>{reveal+=3;body.textContent=full.slice(0,reveal);if(reveal>=full.length)stopText();},24);}
 function close(){if(!opened)return;stopText();opened=false;npc=null;panel.hidden=true;api.pause(false);}
 function open(n){if(opened)return;npc=n;mode='dialog';opened=true;api.pause(true);panel.hidden=false;$('worldName').textContent=n.name+' · '+n.role;try{api.portrait(n.kind,$('worldPortrait'));}catch{}$('worldMessage').textContent='';render(true);}
 function action(fn){const err=fn();$('worldMessage').textContent=err||'Listo. Progreso guardado si el almacenamiento está disponible.';if(!err)api.changed();render(false);}
 function render(animate=false){
  if(!opened)return;const {world,rpg,p}=api.state();opts.replaceChildren();$('worldMoney').textContent=p.coins+' ryō';
  if(mode==='dialog'){
   if(animate)speak(DIALOGUES[npc.id].text);else{stopText();full=DIALOGUES[npc.id].text;body.textContent=full;}
   for(const choice of choicesFor(world,npc.id)){let label=choice.label;if(choice.action==='finish')label+=' · '+questProgress(world,rpg,choice.quest);opts.append(button(label,()=>{stopText();if(choice.action==='close')close();else if(choice.action==='shop'||choice.action==='sell'){mode=choice.action;render(false);}else if(choice.action==='accept')action(()=>api.accept(choice.quest));else if(choice.action==='finish')action(()=>api.finish(choice.quest));else if(choice.action==='heal')action(api.heal);}));}
  }else{
   stopText();body.textContent=mode==='shop'?'Elegí un objeto. Los precios están en ryō.':'Vendé objetos de la mochila; el equipo puesto y los objetos de misión no se venden.';
   const ids=mode==='shop'?SHOPS[npc.id]:[...new Set(rpg.inventory.filter(Boolean).map(s=>s.id))].filter(id=>!['key','scroll'].includes(itemFor(id).type));
   for(const id of ids){const item=itemFor(id),price=mode==='shop'?buyPrice(id):sellPrice(id),row=el('div','','shop-row');row.append(itemIcon(id),el('span',item.name+' · Tenés '+itemCount(rpg,id)),button((mode==='shop'?'Comprar ':'Vender ')+price,()=>action(()=>mode==='shop'?api.buy(npc.id,id):api.sell(id))));opts.append(row);}
   opts.append(button('Volver',()=>{mode='dialog';render(false);}));
  }
 }
 function tick(){
  const {p,world,enemies,rpg}=api.state();$('worldClock').textContent=worldTime(world.clock);const night=(1-Math.cos((world.clock/DAY_SECONDS-.5)*Math.PI*2))*.5;$('nightTint').style.opacity=String(night*.36);
  const near=LANDMARKS.find(l=>Math.hypot(p.x-l.x,p.z-l.z)<l.r);$('worldRegion').textContent=near?.name||(p.x>10?'Bosque exterior':'Konoha');
  const summary=Object.entries(SIDEQUESTS).filter(([id])=>world.quests[id]===1).map(([id,q])=>q.name+' · '+questProgress(world,rpg,id)).join('\n');if(summary!==shown){shown=summary;$('sideQuestLog').textContent=summary||'Hablá con Sakura o Iruka para nuevas misiones.';}
  if(!cx||!b||$('mapPanel').hidden)return;cx.clearRect(0,0,100,100);cx.drawImage(base,0,0);const mark=(x,z,col,size=2)=>{cx.fillStyle=col;cx.fillRect(Math.round(x+50-size/2),Math.round(z+50-size/2),size,size);};
  for(const l of LANDMARKS)if(world.visited.includes(l.id))mark(l.x,l.z,'#a9c7bc',2);
  for(const n of NPCS)mark(n.x,n.z,'#e8cb86',3);
  mark(-12,-2,'#e8cb86',3);
  for(const c of CHESTS)if(!world.opened.includes(c.id))mark(c.x,c.z,'#e5a25d',2);
  for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.z-p.z)<18)mark(e.x,e.z,'#dd756c',2);
  mark(p.x,p.z,'#ffffff',3);
 }
 $('worldClose').onclick=close;$('worldBody').onclick=stopText;
 $('mapToggle').onclick=()=>{$('mapPanel').hidden=!$('mapPanel').hidden;};
 return {open,close,tick,get opened(){return opened;}};
}
