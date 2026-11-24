import {ITEMS,SLOTS,SLOT_NAMES,RARITIES,STAT_NAMES,SKILLS,CAPACITY,itemFor,itemCount,statsFor,levelFor,rankFor,pointsFor,unlockReason} from './rpg-data.js';
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
export function createRPGUI(api){
 let opened=false,selected=-1,tab='inventory',drag=-1,lastHot='';
 const panel=$('rpgPanel'),grid=$('inventoryGrid'),equipment=$('equipmentGrid'),detail=$('itemDetail'),tree=$('skillTree');
 function state(){return api.state();}
 function button(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;return b;}
 function text(tag,value,cls){const e=document.createElement(tag);e.textContent=value;if(cls)e.className=cls;return e;}
 function act(fn){const result=fn();if(result===true||result===null){api.changed();render();}else if(typeof result==='string')api.notice(result);else api.notice('No se pudo realizar esa acción.');}
 function open(which='inventory'){if(!api.canOpen())return;tab=which;if(!opened){opened=true;api.pause(true);}panel.hidden=false;render();}
 function close(){if(!opened)return;opened=false;panel.hidden=true;api.pause(false);}
 function toggle(which){if(opened&&tab===which)close();else open(which);}
 function hotbar(){
  const {rpg}=state(),key=rpg.hotbar.map(id=>id+':'+itemCount(rpg,id)).join('|');if(key===lastHot)return;lastHot=key;
  const bar=$('consumableBar');bar.replaceChildren();
  rpg.hotbar.forEach((id,i)=>{const b=button('',()=>api.quick(i));b.className='quick-item';b.title=(itemFor(id)?.name||'Vacío')+' · '+(i+1);b.append(text('small',String(i+1)),itemIcon(id),text('b',String(itemCount(rpg,id))));b.disabled=!id||!itemCount(rpg,id);bar.append(b);});
 }
 function showDetail(){
  detail.replaceChildren();const {rpg}=state(),s=rpg.inventory[selected],i=itemFor(s?.id);
  if(!i){detail.append(text('p','Seleccioná un objeto para ver sus estadísticas.'));return;}
  const header=text('h3',i.name);header.style.color=RARITIES[i.rarity].color;detail.append(header,text('small',RARITIES[i.rarity].name+' · '+i.type+' · ×'+s.count),text('p',i.desc),text('small','Valor: '+i.value+' ryō'));
  if(i.slot){const equipped=itemFor(rpg.equipment[i.slot]);detail.append(text('p','Equipado: '+(equipped?.name||'ninguno')));
   for(const k of new Set([...Object.keys(i.stats||{}),...Object.keys(equipped?.stats||{})])){const delta=(i.stats?.[k]||0)-(equipped?.stats?.[k]||0);const e=text('div',STAT_NAMES[k]+': '+statText(k,i.stats?.[k]||0)+' ('+(delta>0?'+':'')+statText(k,delta)+')',delta>0?'gain':delta<0?'loss':'');detail.append(e);}
   detail.append(button('Equipar',()=>act(()=>api.equip(selected))));
  }
  if(i.type==='consumable'){detail.append(button('Usar',()=>act(()=>api.use(s.id,selected))));for(let n=0;n<3;n++)detail.append(button('Asignar '+(n+1),()=>act(()=>api.assign(n,s.id))));}
  const discard=button('Descartar 1',()=>{if(discard.dataset.confirm!=='yes'){discard.dataset.confirm='yes';discard.textContent='Confirmar descarte';return;}act(()=>api.discard(selected));});detail.append(discard);
 }
 function render(){
  if(!opened){hotbar();return;}const {rpg,p,quest,enemies}=state(),stats=statsFor(rpg);
  $('rpgLevel').textContent=rankFor(p.xp)+' · Nivel '+levelFor(p.xp)+' · '+p.xp+' EXP · '+pointsFor(rpg,p.xp)+' puntos';
  $('rpgStats').textContent='Ataque +'+stats.attack+' · Defensa '+stats.defense+' · Velocidad +'+Math.round(stats.speed*100)+'% · Crítico '+Math.round((.1+stats.crit)*100)+'% · Chakra/s '+(8+stats.chakra);
  $('inventoryPage').hidden=tab!=='inventory';$('skillsPage').hidden=tab!=='skills';$('invTab').classList.toggle('active',tab==='inventory');$('skillsTab').classList.toggle('active',tab==='skills');
  $('trainingBtn').disabled=quest!==3||enemies.some(e=>e.hp>0)||!api.nearTrainer();$('trainingBtn').textContent='Entrenamiento '+(rpg.round+1)+' (junto a Kakashi)';
  $('overflowBtn').textContent='Recoger reserva ('+Object.values(rpg.overflow).reduce((n,x)=>n+x,0)+')';
  grid.replaceChildren();rpg.inventory.forEach((s,index)=>{const b=button('',()=>{selected=index;render();});b.className='inventory-slot'+(selected===index?' selected':'');b.setAttribute('aria-label',s?ITEMS[s.id].name+' ×'+s.count:'Espacio vacío '+(index+1));
   if(s){const item=ITEMS[s.id];b.style.borderColor=RARITIES[item.rarity].color;b.title=item.name;b.append(itemIcon(s.id),text('span',String(s.count),'stack-count'));b.draggable=true;b.ondragstart=ev=>{drag=index;ev.dataTransfer.setData('text/plain',String(index));};b.ondragend=()=>drag=-1;}
   b.ondragover=ev=>ev.preventDefault();b.ondrop=ev=>{ev.preventDefault();const from=drag;drag=-1;if(from>=0){selected=index;act(()=>api.move(from,index));}};grid.append(b);});
  equipment.replaceChildren();for(const slot of SLOTS){const id=rpg.equipment[slot],b=button('',()=>{if(id)act(()=>api.unequip(slot));});b.className='equip-slot';b.title=id?'Quitar '+ITEMS[id].name:SLOT_NAMES[slot];b.append(itemIcon(id),text('small',SLOT_NAMES[slot]),text('span',itemFor(id)?.name||'Vacío'));b.disabled=!id;equipment.append(b);}
  const avatar=$('equipmentPreview');api.preview?.(avatar);showDetail();
  tree.replaceChildren();for(const branch of ['Taijutsu','Ninjutsu','Clones']){const column=text('div','','skill-branch');column.append(text('h3',branch));for(const [id,s] of Object.entries(SKILLS).filter(([,s])=>s.branch===branch)){const reason=unlockReason(rpg,p.xp,id),b=button(s.name,()=>act(()=>api.unlock(id)));b.className='tree-node'+(rpg.skills.includes(id)?' learned':'');b.disabled=!!reason;b.append(text('small',s.desc),text('small',reason||'Aprender · 1 punto'));column.append(b);}tree.append(column);}
  hotbar();
 }
 $('inventoryBtn').onclick=()=>toggle('inventory');$('skillTreeBtn').onclick=()=>toggle('skills');$('rpgClose').onclick=close;
 $('invTab').onclick=()=>{tab='inventory';render();};$('skillsTab').onclick=()=>{tab='skills';render();};
 $('sortBtn').onclick=()=>{api.sort();selected=-1;api.changed();render();};$('overflowBtn').onclick=()=>act(()=>api.collect()>0||'No hay espacio o no hay objetos pendientes.');
 $('trainingBtn').onclick=()=>{const ok=api.train();if(ok){api.changed();close();}else api.notice('Completá la misión y acercate a Kakashi.');};
 return {open,close,toggle,render,hotbar,get opened(){return opened;}};
}
