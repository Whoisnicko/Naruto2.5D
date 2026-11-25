import {renderJutsuTree} from './jutsu-tree-layout.js';
import {inventoryIcon} from './inventory-art.js';
import {characterFor} from './character-data.js';
import {ITEMS,SLOTS,SLOT_NAMES,RARITIES,STAT_NAMES,SKILLS,treeFor,learnedFor,CAPACITY,itemFor,itemCount,statsFor,levelFor,rankFor,pointsFor,unlockReason} from './rpg-data.js';
const $=id=>document.getElementById(id);
const statText=(k,v)=>['speed','crit','ninjutsu'].includes(k)?Math.round(v*100)+'%':String(v);
export function itemIcon(id){
 const item=itemFor(id),c=document.createElement('canvas');c.width=c.height=24;c.className='item-icon';const x=c.getContext('2d');x.imageSmoothingEnabled=false;
 const rect=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
 if(!item)return c;
 const outline='#263244',metal='#c4dce1',gold='#e9bd6a',cloth='#799c85',dark='#526778';
 switch(item.icon){
 case 'bowl':rect(3,11,18,3,outline);rect(4,14,16,6,'#a85b45');rect(7,20,10,2,outline);rect(5,10,14,3,'#f4d798');rect(8,8,9,2,'#e1ae64');rect(8,4,2,4,metal);rect(14,3,2,4,metal);break;
 case 'pill':rect(7,4,10,16,outline);rect(5,7,14,10,outline);rect(7,7,10,10,'#79b999');rect(8,7,8,5,'#e3ead2');rect(9,8,2,2,'#ffffff');break;
 case 'bandage':rect(4,7,16,11,outline);rect(5,8,14,9,'#e6cba7');rect(9,8,6,9,'#b48372');rect(10,10,4,5,'#f2dbc0');break;
 case 'key':rect(3,5,9,9,outline);rect(4,6,7,7,gold);rect(6,8,3,3,outline);rect(10,9,11,4,gold);rect(17,12,3,5,gold);rect(20,12,2,3,outline);break;
 case 'scroll':rect(5,4,14,16,outline);rect(7,5,10,14,'#e8cf9a');rect(4,4,16,3,gold);rect(4,17,16,3,gold);rect(10,9,4,7,'#a45854');rect(11,10,2,3,'#fae3a7');break;
 case 'blade':rect(10,2,4,3,metal);rect(8,5,8,8,metal);rect(10,7,2,5,'#f5ffff');rect(6,13,12,2,dark);rect(11,15,3,5,'#98705b');rect(10,20,5,2,outline);break;
 case 'headband':rect(2,7,20,11,outline);rect(4,9,16,7,dark);rect(7,9,10,7,metal);rect(11,11,3,3,'#557686');rect(20,15,2,5,dark);break;
 case 'vest':rect(5,4,14,17,outline);rect(3,7,4,8,outline);rect(17,7,4,8,outline);rect(7,5,10,15,item.visual.color);rect(8,11,3,6,item.visual.accent);rect(13,11,3,6,item.visual.accent);rect(11,6,2,14,outline);break;
 case 'pants':rect(5,4,14,18,outline);rect(6,5,12,7,item.visual.color);rect(6,12,5,9,item.visual.color);rect(13,12,5,9,item.visual.color);rect(7,7,10,2,item.visual.accent);break;
 case 'boots':rect(3,7,7,14,outline);rect(14,7,7,14,outline);rect(4,9,5,10,item.visual.color);rect(15,9,5,10,item.visual.color);rect(3,19,8,2,metal);rect(13,19,8,2,metal);break;
 case 'bracer':rect(7,3,10,18,outline);rect(8,4,8,16,dark);rect(9,7,6,10,metal);rect(10,8,2,8,'#edf4e6');break;
 case 'charm':rect(11,2,2,6,gold);rect(6,8,12,12,outline);rect(8,9,8,10,gold);rect(10,11,4,5,'#ad6c4d');rect(11,12,2,2,'#f4e6ad');break;
 default:rect(4,5,16,15,outline);rect(5,6,14,13,cloth);rect(8,8,9,2,'#adc1ac');rect(8,13,10,2,dark);
 }return c;
}
// Lightweight pixel-art silhouette only when the real equipment renderer is unavailable.
function drawEquipmentFallback(canvas,character,equipment){
 const c=canvas.getContext('2d');if(!c)return;c.clearRect(0,0,canvas.width,canvas.height);const {hair,shirt,legs,skin}={naruto:{hair:'#f2c64c',shirt:'#e88838',legs:'#e88838',skin:'#edbe94'},sasuke:{hair:'#24334d',shirt:'#354f79',legs:'#e9e2ce',skin:'#e8bb94'},sakura:{hair:'#e88ca1',shirt:'#b44753',legs:'#3f4350',skin:'#efc6ab'},kakashi:{hair:'#c4cbd1',shirt:'#6e8272',legs:'#3a4d59',skin:'#e1b08d'}}[character]||{hair:'#f2c64c',shirt:'#e88838',legs:'#38495b',skin:'#edbe94'};
 const rect=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};const out='#222c3b',head=itemFor(equipment.head),torso=itemFor(equipment.torso),pants=itemFor(equipment.legs),feet=itemFor(equipment.feet),off=itemFor(equipment.offhand),weapon=itemFor(equipment.weapon);
 c.fillStyle='#101b29aa';c.beginPath();c.ellipse(48,115,26,6,0,0,Math.PI*2);c.fill();
 rect(29,18,38,41,out);rect(33,28,30,28,skin);for(const [x,y,w,h] of [[26,13,11,17],[34,7,11,24],[45,11,13,19],[57,6,10,24],[65,16,6,13]])rect(x,y,w,h,hair);rect(31,25,35,11,'#284569');rect(40,26,17,8,head?.visual?.color||'#bec7cc');rect(47,28,4,4,'#536276');rect(37,39,7,5,out);rect(52,39,7,5,out);rect(40,40,3,3,character==='naruto'?'#69bde8':'#b4b3a2');rect(54,40,3,3,character==='naruto'?'#69bde8':'#b4b3a2');rect(45,50,8,2,'#8e5b51');if(character==='naruto'){for(let i=0;i<3;i++){rect(33,43+i*3,5,1,'#936553');rect(59,43+i*3,5,1,'#936553');}}if(character==='kakashi')rect(33,45,30,12,'#37465b');
 rect(27,57,42,34,out);rect(31,60,34,28,torso?.visual?.color||shirt);rect(45,61,5,25,torso?.visual?.accent||'#39546e');rect(20,60,12,28,out);rect(64,60,12,28,out);rect(23,63,8,20,shirt);rect(65,63,8,20,off?.visual?.color||shirt);rect(23,83,8,7,skin);rect(65,83,8,7,skin);
 rect(30,87,17,23,out);rect(49,87,17,23,out);rect(33,90,11,17,pants?.visual?.color||legs);rect(52,90,11,17,pants?.visual?.color||legs);rect(27,108,20,8,out);rect(49,108,20,8,out);rect(30,109,14,5,feet?.visual?.color||'#3a5068');rect(52,109,14,5,feet?.visual?.color||'#3a5068');if(weapon){rect(76,73,4,23,weapon.visual?.color||'#dbe1de');rect(73,77,10,3,out);}
}
export function createRPGUI(api){
 let opened=false,selected=-1,tab='inventory',drag=-1,lastHot='',filter='all';
 const panel=$('rpgPanel'),grid=$('inventoryGrid'),equipment=$('equipmentGrid'),detail=$('itemDetail'),tree=$('skillTree');
 function state(){return api.state();}
 const icon=id=>inventoryIcon(itemFor(id),()=>itemIcon(id),id);
 const filterMatches=i=>filter==='all'||(filter==='gear'?!!i.slot:filter==='other'?(!i.slot&&i.type!=='consumable'):i.type===filter);
 const filters=$('inventoryFilters');for(const [key,name] of [['all','All'],['gear','Equipment'],['consumable','Consumables'],['other','Materials & scrolls']]){const b=button(name,()=>{filter=key;selected=-1;render();});b.dataset.filter=key;filters.append(b);}
 function dropTo(ev,fn){ev.preventDefault();const from=drag;drag=-1;if(from>=0)fn(from);}

 function button(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;return b;}
 function text(tag,value,cls){const e=document.createElement(tag);e.textContent=value;if(cls)e.className=cls;return e;}
 function act(fn){const result=fn();if(result===true||result===null){api.changed();render();}else if(typeof result==='string')api.notice(result);else api.notice('Action failed.');}
 function open(which='inventory'){if(!api.canOpen())return;tab=which;if(!opened){selected=-1;drag=-1;filter='all';opened=true;api.pause(true);}panel.hidden=false;render();}
 function close(){if(!opened)return;drag=-1;selected=-1;opened=false;panel.hidden=true;api.pause(false);}
 function toggle(which){if(opened&&tab===which)close();else open(which);}
 function hotbar(){
  const {rpg}=state(),key=rpg.hotbar.map(id=>id+':'+itemCount(rpg,id)).join('|');if(key===lastHot)return;lastHot=key;
  const bar=$('consumableBar');bar.replaceChildren();
  rpg.hotbar.forEach((id,i)=>{const b=button('',()=>api.quick(i));b.className='quick-item';b.title=(itemFor(id)?.name||'Empty')+' · '+(i+1);b.append(text('small',String(i+1)),icon(id),text('b',String(itemCount(rpg,id))));b.disabled=!id||!itemCount(rpg,id);bar.append(b);});
 }
 function showDetail(){
  detail.replaceChildren();detail.style.removeProperty('--item-rarity');const {rpg}=state(),s=rpg.inventory[selected],i=itemFor(s?.id);
  if(!i){detail.append(text('div','✧','empty-mark'),text('h3','Choose an item'),text('p','Select an item from your backpack to inspect, equip or use it.'));return;}
  const header=text('h3',i.name);header.style.color=RARITIES[i.rarity].color;detail.append(icon(s.id),header,text('small',RARITIES[i.rarity].name+' · '+i.type+' · ×'+s.count,'item-rarity'),text('p',i.desc),text('small','Value: '+i.value+' ryō'));detail.style.setProperty('--item-rarity',RARITIES[i.rarity].color);
  if(i.slot){const equipped=itemFor(rpg.equipment[i.slot]);detail.append(text('p','Equipped: '+(equipped?.name||'None')));
   for(const k of new Set([...Object.keys(i.stats||{}),...Object.keys(equipped?.stats||{})])){const delta=(i.stats?.[k]||0)-(equipped?.stats?.[k]||0);const e=text('div',STAT_NAMES[k]+': '+statText(k,i.stats?.[k]||0)+' ('+(delta>0?'+':'')+statText(k,delta)+')',delta>0?'gain':delta<0?'loss':'');detail.append(e);}
   detail.append(button('Equip',()=>act(()=>api.equip(selected))));
  }
  if(i.type==='consumable'){detail.append(button('Use',()=>act(()=>api.use(s.id,selected))));for(let n=0;n<3;n++)detail.append(button('Quick '+(n+1),()=>act(()=>api.assign(n,s.id))));}
  const discard=button('Discard 1',()=>{if(discard.dataset.confirm!=='yes'){discard.dataset.confirm='yes';discard.textContent='Confirm discard';return;}act(()=>api.discard(selected));});if(i.type!=='key')detail.append(discard);else detail.append(text('small','Quest item: cannot discard.'));
 }
 function render(){
  if(!opened){hotbar();return;}const {rpg,p,quest,enemies}=state(),stats=statsFor(rpg,p.character),spec=characterFor(p.character),skills=treeFor(p.character),learned=learnedFor(rpg,p.character);
  $('rpgWindow').dataset.character=p.character;
  $('rpgLevel').textContent=spec.name+' · '+rankFor(p.xp)+' · Level '+levelFor(p.xp)+' · '+p.xp+' EXP · '+pointsFor(rpg,p.xp,p.character)+' personal points';
  $('rpgStats').textContent='Attack +'+stats.attack+' · Defense '+(stats.defense+spec.defense)+' · Speed '+Math.round(((1+stats.speed)*spec.speed-1)*100)+'% · Critical '+Math.round((.1+stats.crit+spec.crit)*100)+'% · Chakra/s '+(8+stats.chakra+spec.regen);
  $('inventoryPage').hidden=tab!=='inventory';$('skillsPage').hidden=tab!=='skills';$('invTab').classList.toggle('active',tab==='inventory');$('skillsTab').classList.toggle('active',tab==='skills');
  $('trainingBtn').disabled=quest!==3||enemies.some(e=>e.hp>0)||!api.nearTrainer();$('trainingBtn').textContent='Training '+(rpg.round+1)+' (near Kakashi)';
  $('overflowBtn').textContent='Collect overflow ('+Object.values(rpg.overflow).reduce((n,x)=>n+x,0)+')';
  $('inventoryCapacity').textContent=rpg.inventory.filter(Boolean).length+' / '+CAPACITY+' slots';$('inventoryCurrency').textContent=(p.coins||0).toLocaleString('en-US')+' ryō';$('inventoryCharacter').textContent=spec.name+' · '+rankFor(p.xp);for(const b of filters.children)b.setAttribute('aria-pressed',String(b.dataset.filter===filter));
  grid.replaceChildren();rpg.inventory.forEach((s,index)=>{const b=button('',()=>{selected=index;render();});b.className='inventory-slot'+(selected===index?' selected':'');b.setAttribute('aria-label',s?ITEMS[s.id].name+' ×'+s.count:'Empty slot '+(index+1));
   if(s){const item=ITEMS[s.id];b.style.setProperty('--rarity',RARITIES[item.rarity].color);b.dataset.rarity=item.rarity;b.title=item.name+' · '+RARITIES[item.rarity].name+' · '+item.desc;b.append(icon(s.id),text('span',String(s.count),'stack-count'));b.classList.toggle('filtered-out',!filterMatches(item));b.disabled=!filterMatches(item);b.draggable=filterMatches(item);b.ondragstart=ev=>{drag=index;ev.dataTransfer.setData('text/plain',String(index));};b.ondragend=()=>drag=-1;}
   b.ondragover=ev=>{if(drag>=0&&!b.disabled)ev.preventDefault();};b.ondrop=ev=>dropTo(ev,from=>{if(!b.disabled&&from!==index){selected=index;act(()=>api.move(from,index));}});grid.append(b);});
  equipment.replaceChildren();for(const slot of SLOTS){const id=rpg.equipment[slot],b=button('',()=>{if(id)act(()=>api.unequip(slot));});b.className='equip-slot';b.title=id?'Unequip '+ITEMS[id].name:SLOT_NAMES[slot];b.dataset.slot=slot;b.dataset.filled=String(!!id);if(id)b.style.setProperty('--rarity',RARITIES[ITEMS[id].rarity].color);b.append(id?icon(id):text('span','◇','slot-placeholder'),text('small',SLOT_NAMES[slot]),text('span',itemFor(id)?.name||'Empty'));b.setAttribute('aria-label',SLOT_NAMES[slot]+': '+(itemFor(id)?.name||'Empty')+(id?' · Click to unequip':''));b.ondragover=ev=>{if(drag>=0&&itemFor(rpg.inventory[drag]?.id)?.slot===slot)ev.preventDefault();};b.ondrop=ev=>dropTo(ev,from=>{if(itemFor(rpg.inventory[from]?.id)?.slot===slot){selected=from;act(()=>api.equip(from));}});equipment.append(b);}
  const quick=$('inventoryQuick');quick.replaceChildren();rpg.hotbar.forEach((id,n)=>{const b=button('',()=>{const item=itemFor(rpg.inventory[selected]?.id);if(item?.type==='consumable')act(()=>api.assign(n,rpg.inventory[selected].id));else api.notice('Select a consumable to assign to this slot.');});b.className='inventory-quick-slot';b.title='Quick slot '+(n+1)+' · '+(itemFor(id)?.name||'Empty');b.append(text('small',String(n+1)),icon(id),text('b',String(itemCount(rpg,id))));b.ondragover=ev=>{if(drag>=0&&itemFor(rpg.inventory[drag]?.id)?.type==='consumable')ev.preventDefault();};b.ondrop=ev=>dropTo(ev,from=>{const id=rpg.inventory[from]?.id;if(itemFor(id)?.type==='consumable')act(()=>api.assign(n,id));});quick.append(b);});
  const avatar=$('equipmentPreview');let drawn=false;try{drawn=!!api.preview?.(avatar);}catch(e){console.warn('Equipment preview fallback',e);}if(!drawn)drawEquipmentFallback(avatar,p.character,rpg.equipment);showDetail();
  tree.replaceChildren();const points=pointsFor(rpg,p.xp,p.character);$('jutsuPoints').textContent=points+' skill point'+(points===1?'':'s')+' available';$('jutsuProgress').textContent=learned.length+' / '+Object.keys(skills).length+' learned';
  renderJutsuTree(tree,{skills,learned,character:p.character,name:spec.name,reasonFor:id=>unlockReason(rpg,p.xp,id,p.character),onLearn:id=>act(()=>api.unlock(id))});
  hotbar();
 }
 $('inventoryBtn').onclick=()=>toggle('inventory');$('skillTreeBtn').onclick=()=>toggle('skills');$('rpgClose').onclick=close;
 $('invTab').onclick=()=>{tab='inventory';render();};$('skillsTab').onclick=()=>{tab='skills';render();};
 $('sortBtn').onclick=()=>{api.sort();selected=-1;api.changed();render();};$('overflowBtn').onclick=()=>act(()=>api.collect()>0||'No room or no pending items.');
 $('trainingBtn').onclick=()=>{const ok=api.train();if(ok){api.changed();close();}else api.notice('Complete the mission and approach Kakashi.');};
 return {open,close,toggle,render,hotbar,get opened(){return opened;}};
}
