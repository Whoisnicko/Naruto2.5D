// Data-driven RPG rules. Inventory slots are indices, not item identifiers.
export const SLOTS=['head','torso','legs','feet','weapon','offhand','accessory'];
export const SLOT_NAMES={head:'Cabeza',torso:'Torso',legs:'Piernas',feet:'Pies',weapon:'Arma',offhand:'Secundaria',accessory:'Accesorio'};
export const RARITIES={common:{name:'Común',color:'#b7c4c5'},uncommon:{name:'Poco común',color:'#8dc996'},rare:{name:'Raro',color:'#78bce9'},epic:{name:'Épico',color:'#cc9be9'}};
export const STAT_NAMES={attack:'Ataque',defense:'Defensa',speed:'Velocidad',crit:'Crítico',chakra:'Regen. chakra',clone:'Daño de clon',ninjutsu:'Ninjutsu'};
export const ITEMS={
 ramen:{name:'Ramen de Ichiraku',desc:'Recupera 35 puntos de vida.',icon:'bowl',type:'consumable',rarity:'common',maxStack:10,value:12,heal:35},
 pill:{name:'Píldora de soldado',desc:'Recupera 40 puntos de chakra.',icon:'pill',type:'consumable',rarity:'uncommon',maxStack:10,value:18,restore:40},
 bandage:{name:'Vendaje ninja',desc:'Recupera 20 puntos de vida.',icon:'bandage',type:'consumable',rarity:'common',maxStack:10,value:7,heal:20},
 cloth:{name:'Tela de renegado',desc:'Material de entrenamiento. Reservado para fabricación futura.',icon:'cloth',type:'material',rarity:'common',maxStack:20,value:4},
 forestKey:{name:'Llave del bosque',desc:'Iruka la entrega al completar la ruta. Abre el alijo sellado.',icon:'key',type:'key',rarity:'rare',maxStack:1,value:0},
 scroll:{name:'Pergamino de chakra',desc:'Se consume al aprender el Rasengan gigante en el árbol.',icon:'scroll',type:'scroll',rarity:'rare',maxStack:5,value:50},
 headband:{name:'Protector de Konoha',desc:'Placa reforzada de un shinobi.',icon:'headband',type:'armor',slot:'head',rarity:'uncommon',maxStack:1,value:30,stats:{defense:2},visual:{color:'#c4dbe1',accent:'#547486'}},
 vest:{name:'Chaleco de entrenamiento',desc:'Protección ligera para misiones.',icon:'vest',type:'armor',slot:'torso',rarity:'rare',maxStack:1,value:70,stats:{defense:4},visual:{color:'#73945f',accent:'#d0bf83'}},
 pants:{name:'Pantalón de explorador',desc:'Tela flexible para moverse sin ruido.',icon:'pants',type:'armor',slot:'legs',rarity:'uncommon',maxStack:1,value:35,stats:{defense:1,speed:.04},visual:{color:'#466578',accent:'#88a7a8'}},
 sandals:{name:'Sandalias veloces',desc:'Suela liviana que mejora el desplazamiento.',icon:'boots',type:'armor',slot:'feet',rarity:'uncommon',maxStack:1,value:38,stats:{speed:.08},visual:{color:'#42768f',accent:'#c8dfd3'}},
 kunai:{name:'Kunai templado',desc:'Hoja equilibrada: mejora todos los golpes directos y proyectiles.',icon:'blade',type:'weapon',slot:'weapon',rarity:'rare',maxStack:1,value:65,stats:{attack:4,crit:.03},visual:{color:'#d2e9eb',accent:'#42546b'}},
 bracer:{name:'Brazal de hierro',desc:'Protege el brazo secundario.',icon:'bracer',type:'armor',slot:'offhand',rarity:'uncommon',maxStack:1,value:32,stats:{defense:3},visual:{color:'#9db4bf',accent:'#526779'}},
 charm:{name:'Amuleto de espiral',desc:'Favorece el flujo de chakra.',icon:'charm',type:'accessory',slot:'accessory',rarity:'rare',maxStack:1,value:55,stats:{chakra:2},visual:{color:'#f0cb66',accent:'#a3673d'}},
 eliteVest:{name:'Chaleco de élite',desc:'Una prenda de entrenamiento avanzada.',icon:'vest',type:'armor',slot:'torso',rarity:'epic',maxStack:1,value:130,stats:{defense:6,chakra:1},visual:{color:'#566f91',accent:'#b5d8e4'}}
};
export const SKILLS={
 fists:{name:'Puños de acero',branch:'Taijutsu',cost:1,level:2,desc:'+3 ataque',stats:{attack:3}},
 reflex:{name:'Reflejos ninja',branch:'Taijutsu',cost:1,level:3,requires:'fists',desc:'+8% velocidad y +5 puntos porcentuales de crítico',stats:{speed:.08,crit:.05}},
 focus:{name:'Control de chakra',branch:'Ninjutsu',cost:1,level:2,desc:'+2 chakra por segundo y +10% daño ninjutsu',stats:{chakra:2,ninjutsu:.10}},
 giant:{name:'Rasengan gigante',branch:'Ninjutsu',cost:1,level:3,requires:'focus',scroll:'scroll',desc:'Desbloquea G: Rasengan gigante, daño 84, 32 chakra, recarga 6 s.'},
 bond:{name:'Vínculo de sombra',branch:'Clones',cost:1,level:2,desc:'+4 daño por golpe de clon',stats:{clone:4}},
 endurance:{name:'Sombras resistentes',branch:'Clones',cost:1,level:3,requires:'bond',desc:'+10 vida de cada clon',cloneHP:10}
};
export const LOOT=[
 [['bandage',2],['headband',1]],
 [['kunai',1],['cloth',2]],
 [['vest',1],['bracer',1]],
 [['pants',1],['sandals',1]],
 [['pill',2],['charm',1]]
];
export const QUEST_LOOT=[['scroll',1],['ramen',2]];
export const TRAINING_LOOT=[['ramen',1],['pill',1],['cloth',2]];
export const CAPACITY=24;
export const levelFor=xp=>1+Math.floor(xp/100);
export const rankFor=xp=>levelFor(xp)>=10?'Jōnin':levelFor(xp)>=5?'Chūnin':'Genin';
const owns=(o,k)=>typeof k==='string'&&Object.prototype.hasOwnProperty.call(o,k);
export const itemFor=id=>owns(ITEMS,id)?ITEMS[id]:null;
const cloneStack=s=>s?{id:s.id,count:s.count}:null;
export function newRPG(){const r={inventory:Array(CAPACITY).fill(null),equipment:Object.fromEntries(SLOTS.map(k=>[k,null])),hotbar:['ramen','pill','bandage'],skills:[],overflow:{},round:0};addItem(r,'ramen',2);addItem(r,'pill',1);addItem(r,'bandage',2);return r;}
export function itemCount(r,id){return r.inventory.reduce((n,s)=>n+(s?.id===id?s.count:0),0);}
export function addItem(r,id,amount,stash=true){
 const item=itemFor(id);if(!item||!Number.isSafeInteger(amount)||amount<=0)return 0;
 let left=amount;
 for(const s of r.inventory)if(s?.id===id&&s.count<item.maxStack){const n=Math.min(left,item.maxStack-s.count);s.count+=n;left-=n;if(!left)return 0;}
 for(let i=0;i<CAPACITY&&left>0;i++)if(!r.inventory[i]){const n=Math.min(left,item.maxStack);r.inventory[i]={id,count:n};left-=n;}
 if(left&&stash){r.overflow[id]=Math.min(1000000,(r.overflow[id]||0)+left);}
 return left;
}
export function rewardItems(r,list){for(const [id,n] of list)addItem(r,id,n);return list.map(([id,n])=>ITEMS[id].name+(n>1?' ×'+n:'')).join(', ');}
export function collectOverflow(r){let moved=0;for(const [id,count] of Object.entries(r.overflow)){const remain=addItem(r,id,count,false);moved+=count-remain;if(remain)r.overflow[id]=remain;else delete r.overflow[id];}return moved;}
export function removeItem(r,id,count=1){if(itemCount(r,id)<count)return false;for(let i=0;i<CAPACITY&&count>0;i++){const s=r.inventory[i];if(s?.id!==id)continue;const n=Math.min(s.count,count);s.count-=n;count-=n;if(!s.count)r.inventory[i]=null;}return true;}
export function moveSlot(r,from,to){
 if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||from>=CAPACITY||to<0||to>=CAPACITY||from===to||!r.inventory[from])return false;
 const a=r.inventory[from],b=r.inventory[to];if(b?.id===a.id){const n=Math.min(a.count,ITEMS[a.id].maxStack-b.count);if(!n)return false;b.count+=n;a.count-=n;if(!a.count)r.inventory[from]=null;}
 else{r.inventory[from]=b;r.inventory[to]=a;}return true;
}
export function sortInventory(r){const list=r.inventory.filter(Boolean);list.sort((a,b)=>ITEMS[a.id].type.localeCompare(ITEMS[b.id].type)||ITEMS[a.id].name.localeCompare(ITEMS[b.id].name));r.inventory.fill(null);for(const s of list)addItem(r,s.id,s.count,false);}
export function discardSlot(r,index){const s=r.inventory[index];if(!s||itemFor(s.id)?.type==='key')return false;if(--s.count===0)r.inventory[index]=null;return true;}
export function equipSlot(r,index){const s=r.inventory[index],item=itemFor(s?.id);if(!item?.slot||s.count!==1)return false;const old=r.equipment[item.slot];r.equipment[item.slot]=s.id;r.inventory[index]=old?{id:old,count:1}:null;return true;}
export function unequipSlot(r,slot){if(!SLOTS.includes(slot)||!r.equipment[slot])return false;const i=r.inventory.findIndex(s=>!s);if(i<0)return false;r.inventory[i]={id:r.equipment[slot],count:1};r.equipment[slot]=null;return true;}
export function assignHotbar(r,index,id){if(!Number.isInteger(index)||index<0||index>=3||itemFor(id)?.type!=='consumable')return false;r.hotbar[index]=id;return true;}
export function useItem(r,p,id,index=null){
 const item=itemFor(id);if(!item||item.type!=='consumable')return 'No es un consumible.';
 if(index!==null&&r.inventory[index]?.id!==id||itemCount(r,id)<1)return 'No te quedan unidades.';
 if(item.heal&&p.hp>=100||item.restore&&p.chakra>=100)return 'Ya tenés ese recurso al máximo.';
 if(index===null)removeItem(r,id);else discardSlot(r,index);
 if(item.heal)p.hp=Math.min(100,p.hp+item.heal);if(item.restore)p.chakra=Math.min(100,p.chakra+item.restore);
 return null;
}
export function pointsFor(r,xp){return Math.max(0,levelFor(xp)-1-r.skills.reduce((n,k)=>n+SKILLS[k].cost,0));}
export function unlockReason(r,xp,id){
 if(!owns(SKILLS,id))return 'Técnica desconocida';const s=SKILLS[id];
 if(r.skills.includes(id))return 'Aprendida';if(levelFor(xp)<s.level)return 'Requiere nivel '+s.level;
 if(s.requires&&!r.skills.includes(s.requires))return 'Requiere '+SKILLS[s.requires].name;
 if(pointsFor(r,xp)<s.cost)return 'Sin puntos disponibles';if(s.scroll&&!itemCount(r,s.scroll))return 'Requiere pergamino de chakra';return '';
}
export function unlockSkill(r,xp,id){const reason=unlockReason(r,xp,id);if(reason)return reason;const s=SKILLS[id];if(s.scroll)removeItem(r,s.scroll);r.skills.push(id);return null;}
export function statsFor(r){
 const out={attack:0,defense:0,speed:0,crit:0,chakra:0,clone:0,ninjutsu:0,cloneHP:0};
 function add(s){for(const [k,v] of Object.entries(s||{}))if(k in out)out[k]+=v;}
 for(const id of Object.values(r.equipment))add(itemFor(id)?.stats);
 for(const id of r.skills){add(SKILLS[id].stats);out.cloneHP+=SKILLS[id].cloneHP||0;}
 return out;
}
export function equipmentVisuals(r){return Object.fromEntries(SLOTS.map(s=>[s,itemFor(r.equipment[s])?.visual||null]));}
export function migrateRPG(enemies,quest){const r=newRPG();for(const e of enemies)if(e.hp===0)rewardItems(r,LOOT[e.id]||[]);if(quest===3)rewardItems(r,QUEST_LOOT);return r;}
export function validateRPG(raw,xp){
 if(!raw||!Array.isArray(raw.inventory)||raw.inventory.length!==CAPACITY||!raw.equipment||!Array.isArray(raw.hotbar)||raw.hotbar.length!==3||!Array.isArray(raw.skills)||!raw.overflow||!Number.isSafeInteger(raw.round)||raw.round<0||raw.round>1000000)throw Error('Inventario inválido.');
 const inventory=raw.inventory.map(s=>{if(s===null)return null;const i=itemFor(s?.id);if(!i||!Number.isSafeInteger(s.count)||s.count<1||s.count>i.maxStack)throw Error('Objeto inválido.');return cloneStack(s);});
 const equipment={};for(const slot of SLOTS){const id=raw.equipment[slot];if(id!==null&&itemFor(id)?.slot!==slot)throw Error('Equipo inválido.');equipment[slot]=id;}
 const hotbar=raw.hotbar.map(id=>{if(id!==null&&itemFor(id)?.type!=='consumable')throw Error('Acceso rápido inválido.');return id;});
 const skills=[];for(const id of raw.skills){if(!owns(SKILLS,id)||skills.includes(id)||SKILLS[id].level>levelFor(xp)||SKILLS[id].requires&&!skills.includes(SKILLS[id].requires))throw Error('Árbol de habilidades inválido.');skills.push(id);}
 if(skills.reduce((n,k)=>n+SKILLS[k].cost,0)>levelFor(xp)-1)throw Error('Puntos de habilidad inválidos.');
 const overflow={};for(const [id,n] of Object.entries(raw.overflow)){if(!itemFor(id)||!Number.isSafeInteger(n)||n<1||n>1000000)throw Error('Reserva inválida.');overflow[id]=n;}
 return {inventory,equipment,hotbar,skills,overflow,round:raw.round};
}
