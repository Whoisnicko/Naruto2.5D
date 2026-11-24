import {NPCS,CHESTS,LANDMARKS,SIDEQUESTS,SHOPS,DIALOGUES,EAST,inEast,choicesFor,questProgress,buyPrice,sellPrice,worldTime,DAY_SECONDS,dayPhase,INTERIORS,WEATHER,WORLD_EVENTS} from './world-data.js';
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
 function open(n){if(opened)return;npc=n;mode='dialog';opened=true;api.pause(true);panel.hidden=false;$('worldName').textContent=n.name+' · '+n.role;try{if(!api.portrait(n.kind,$('worldPortrait'))){const c=$('worldPortrait').getContext('2d');if(c){c.clearRect(0,0,96,76);c.fillStyle='#f0c996';c.fillRect(30,12,36,32);c.fillStyle='#57768a';c.fillRect(20,44,56,32);}}}catch{}$('worldMessage').textContent='';render(true);}
 function action(fn){const err=fn();const saved=err?false:api.changed();$('worldMessage').textContent=err||(saved?'Done. Progress saved.':'Done. Temporary changes or storage unavailable.');render(false);}
 function render(animate=false){
  if(!opened)return;const {world,rpg,p}=api.state();opts.replaceChildren();$('worldMoney').textContent=p.coins+' ryō';
  if(mode==='dialog'){
   if(animate)speak(DIALOGUES[npc.id].text);else{stopText();full=DIALOGUES[npc.id].text;body.textContent=full;}
   for(const choice of choicesFor(world,npc.id)){let label=choice.label;if(choice.action==='finish')label+=' · '+questProgress(world,rpg,choice.quest);opts.append(button(label,()=>{stopText();if(choice.action==='close')close();else if(choice.action==='shop'||choice.action==='sell'){mode=choice.action;render(false);}else if(choice.action==='accept')action(()=>api.accept(choice.quest));else if(choice.action==='finish')action(()=>api.finish(choice.quest));else if(choice.action==='heal')action(api.heal);}));}
  }else{
   stopText();body.textContent=mode==='shop'?'Choose an item. Prices are in ryō.':'Vendé objetos de la mochila; el equipo puesto y los objetos de misión no se venden.';
   const ids=mode==='shop'?SHOPS[npc.id]:[...new Set(rpg.inventory.filter(Boolean).map(s=>s.id))].filter(id=>!['key','scroll'].includes(itemFor(id).type));
   for(const id of ids){const item=itemFor(id),price=mode==='shop'?buyPrice(id):sellPrice(id),row=el('div','','shop-row');row.append(itemIcon(id),el('span',item.name+' · You have '+itemCount(rpg,id)),button((mode==='shop'?'Comprar ':'Vender ')+price,()=>action(()=>mode==='shop'?api.buy(npc.id,id):api.sell(id))));opts.append(row);}
   opts.append(button('Back',()=>{mode='dialog';render(false);}));
  }
 }
 function tick(){
  const {p,world,enemies,rpg,bossProgress,boss,quest,campaign,exam,examRun,npcs=NPCS,interior,roomNPC,weather='clear',worldEvent}=api.state();const phase=dayPhase(world.clock);$('worldClock').textContent=worldTime(world.clock);if($('dayPhaseLabel'))$('dayPhaseLabel').textContent=interior?'Interior':phase.name+' · '+phase.remaining+' s';if($('weatherName'))$('weatherName').textContent=interior?'Interior':WEATHER[weather].name;
  const east=inEast(p);const near=LANDMARKS.find(l=>Math.hypot(p.x-l.x,p.z-l.z)<l.r);$('worldRegion').textContent=interior?.name||near?.name||(east?'Wind Frontier':p.x>10?'Outer Forest':'Konoha');
  const summary=Object.entries(SIDEQUESTS).filter(([id])=>world.quests[id]===1).map(([id,q])=>q.name+' · '+questProgress(world,rpg,id)).join('\n');if(summary!==shown){shown=summary;$('sideQuestLog').textContent=summary||'Talk to Sakura, Iruka or Shikamaru for new quests.';}
  if(!cx||!b||$('mapPanel').hidden)return;cx.clearRect(0,0,100,100);if(interior){cx.fillStyle='#393837';cx.fillRect(0,0,100,100);cx.fillStyle='#c3ad85';cx.fillRect(5,5,90,90);const point=(x,z,col)=>{cx.fillStyle=col;cx.fillRect(50+(x-interior.x)*7.5-2,50+(z-interior.z)*9-2,4,4);};cx.fillStyle='#7b5944';for(const [x,z,w,d] of interior.furniture)cx.fillRect(50+(x-w/2)*7.5,50+(z-d/2)*9,w*7.5,d*9);point(interior.x,interior.z+4,'#f4ce83');if(roomNPC)point(roomNPC.x,roomNPC.z,'#e8cb86');point(p.x,p.z,'#fff');return;}if(east){cx.fillStyle='#526f58';cx.fillRect(0,0,100,100);cx.fillStyle='#b5a681';cx.fillRect(0,43,100,14);cx.fillStyle='#878d80';cx.fillRect(67,0,33,100);cx.fillStyle='#444f52';cx.fillRect(66,0,3,43);cx.fillRect(66,57,3,43);cx.fillStyle='#e8c67d';cx.fillRect(1,44,4,6);}else{cx.drawImage(base,0,0);cx.fillStyle='#e8c67d';cx.fillRect(96,46,4,4);}const mark=(x,z,col,size=2)=>{if(east?(x<50||x>110):(x>=50))return;cx.fillStyle=col;cx.fillRect(Math.round((east?(x-50)/60*100:x+50)-size/2),Math.round((east?(z+20)/40*100:z+50)-size/2),size,size);};
  for(const l of LANDMARKS)mark(l.x,l.z,world.visited.includes(l.id)?'#a9c7bc':'#738d82',2);
  for(const n of npcs)mark(n.x,n.z,'#e8cb86',3);
  mark(-12,-2,'#e8cb86',3);for(const room of INTERIORS)mark(room.door.x,room.door.z,'#77e1d7',3);if(worldEvent)mark(worldEvent.x,worldEvent.z,'#f5d359',4);
  for(const c of CHESTS)if(!world.opened.includes(c.id))mark(c.x,c.z,'#e5a25d',2);
  for(const e of enemies)if(e.hp>0){const color=e.role==='elite'?'#ff536e':e.role==='medic'?'#ff9f75':e.temporary?'#b78cf2':'#f36c62';mark(e.x,e.z,color,e.role==='elite'?4:3);}else if(e.respawnAt!=null)mark(e.homeX,e.homeZ,'#858b83',2);
  if(quest===3&&bossProgress?.defeated.length<2)mark(32,-2,'#e7a6dc',4);else if(quest===3&&bossProgress?.defeated.length===2&&!campaign?.completed)mark(-12,-2,'#e7a6dc',4);if(quest===3&&exam?.wins!==3)mark(-13,-14.5,'#e7a6dc',4);if(examRun?.scroll)mark(examRun.scroll.x,examRun.scroll.z,'#f8d893',4);if(boss)mark(boss.x,boss.z,'#f17685',4);mark(p.x,p.z,'#ffffff',3);
 }
 $('worldClose').onclick=close;$('worldBody').onclick=stopText;
 $('mapToggle').onclick=()=>{$('mapPanel').hidden=!$('mapPanel').hidden;};
 return {open,close,tick,get opened(){return opened;}};
}
