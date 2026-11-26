// Data-driven RPG rules. Inventory slots are indices, not item identifiers.
export const SLOTS=['head','torso','legs','feet','weapon','offhand','accessory'];
export const SLOT_NAMES={head:'Head',torso:'Torso',legs:'Legs',feet:'Feet',weapon:'Weapon',offhand:'Off Hand',accessory:'Accessory'};
export const RARITIES={common:{name:'Common',color:'#b7c4c5'},uncommon:{name:'Uncommon',color:'#8dc996'},rare:{name:'Rare',color:'#78bce9'},epic:{name:'Epic',color:'#cc9be9'}};
export const STAT_NAMES={attack:'Attack',defense:'Defense',speed:'Speed',crit:'Critical',chakra:'Chakra regen',clone:'Clone damage',ninjutsu:'Ninjutsu'};
export const ITEMS={
 ramen:{name:'Ichiraku Ramen',desc:'Restores 35 health.',icon:'bowl',type:'consumable',rarity:'common',maxStack:10,value:12,heal:35},
 pill:{name:'Soldier Pill',desc:'Restores 40 chakra.',icon:'pill',type:'consumable',rarity:'uncommon',maxStack:10,value:18,restore:40},
 bandage:{name:'Ninja Bandage',desc:'Restores 20 health.',icon:'bandage',type:'consumable',rarity:'common',maxStack:10,value:7,heal:20},
 cloth:{name:'Rogue Cloth',desc:'Training material. Reserved for future crafting.',icon:'cloth',type:'material',rarity:'common',maxStack:20,value:4},
 forestKey:{name:'Forest Key',desc:'Awarded by Iruka for completing the route. Opens the sealed cache.',icon:'key',type:'key',rarity:'rare',maxStack:1,value:0},
 scroll:{name:'Chakra Scroll',desc:'Consumed when learning an advanced technique in its skill tree.',icon:'scroll',type:'scroll',rarity:'rare',maxStack:5,value:50},
 headband:{name:'Konoha Headband',desc:'Reinforced shinobi plate.',icon:'headband',type:'armor',slot:'head',rarity:'uncommon',maxStack:1,value:30,stats:{defense:2},visual:{color:'#c4dbe1',accent:'#547486'}},
 vest:{name:'Training Vest',desc:'Light protection for missions.',icon:'vest',type:'armor',slot:'torso',rarity:'rare',maxStack:1,value:70,stats:{defense:4},visual:{color:'#73945f',accent:'#d0bf83'}},
 pants:{name:'Scout Pants',desc:'Flexible fabric for silent movement.',icon:'pants',type:'armor',slot:'legs',rarity:'uncommon',maxStack:1,value:35,stats:{defense:1,speed:.04},visual:{color:'#466578',accent:'#88a7a8'}},
 sandals:{name:'Swift Sandals',desc:'Light soles for better mobility.',icon:'boots',type:'armor',slot:'feet',rarity:'uncommon',maxStack:1,value:38,stats:{speed:.08},visual:{color:'#42768f',accent:'#c8dfd3'}},
 kunai:{name:'Tempered Kunai',desc:'Balanced blade: improves direct strikes and projectiles.',icon:'blade',type:'weapon',slot:'weapon',rarity:'rare',maxStack:1,value:65,stats:{attack:4,crit:.03},visual:{color:'#d2e9eb',accent:'#42546b'}},
 bracer:{name:'Iron Bracer',desc:'Protects the off hand.',icon:'bracer',type:'armor',slot:'offhand',rarity:'uncommon',maxStack:1,value:32,stats:{defense:3},visual:{color:'#9db4bf',accent:'#526779'}},
 charm:{name:'Spiral Amulet',desc:'Improves chakra flow.',icon:'charm',type:'accessory',slot:'accessory',rarity:'rare',maxStack:1,value:55,stats:{chakra:2},visual:{color:'#f0cb66',accent:'#a3673d'}},
 sandArmor:{name:'Sand Armor',desc:'Gaara trophy. Reinforced sand woven into a shinobi vest.',icon:'vest',type:'armor',slot:'torso',rarity:'epic',maxStack:1,value:300,stats:{defense:9,chakra:1},visual:{color:'#c5a16b',accent:'#795e45'}},
 medicalGloves:{name:'Medical Gloves',desc:'Kabuto trophy. Enhances chakra recovery and ninjutsu.',icon:'charm',type:'accessory',slot:'accessory',rarity:'epic',maxStack:1,value:220,stats:{chakra:3,ninjutsu:.08},visual:{color:'#92d9bc',accent:'#566777'}},
 valleyMemory:{name:'Memory of the Valley',desc:'A reminder of a bond that could not be severed. Story reward.',icon:'charm',type:'accessory',slot:'accessory',rarity:'epic',maxStack:1,value:0,stats:{chakra:3,crit:.04,ninjutsu:.06},visual:{color:'#b9c6ed',accent:'#8272a1'}},
 boneMantle:{name:'Kaguya Bone Mantle',desc:'Kimimaro trophy. Reinforced bone armor of the Kaguya clan.',icon:'vest',type:'armor',slot:'torso',rarity:'epic',maxStack:1,value:520,stats:{defense:12,attack:3,crit:.04},visual:{color:'#dcd8c9',accent:'#857b86'}},
 kusanagi:{name:'Kusanagi',desc:'Orochimaru trophy. A forbidden sword with a razor-sharp edge.',icon:'blade',type:'weapon',slot:'weapon',rarity:'epic',maxStack:1,value:420,stats:{attack:12,crit:.06,ninjutsu:.05},visual:{color:'#e2e3e8',accent:'#8869a9'}},
 mistBlade:{name:'Mist Sword',desc:'Zabuza trophy. Increases direct attack damage.',icon:'blade',type:'weapon',slot:'weapon',rarity:'epic',maxStack:1,value:180,stats:{attack:8,crit:.03},visual:{color:'#c8dce4',accent:'#466070'}},
 ruinCharm:{name:'Wind Talisman',desc:'Ruins relic. Improves chakra and mobility.',icon:'charm',type:'accessory',slot:'accessory',rarity:'epic',maxStack:1,value:180,stats:{chakra:3,speed:.06},visual:{color:'#b0d6be',accent:'#426c65'}},
 iceMask:{name:'Ice Mask',desc:'Haku trophy. Improves defense and critical hits.',icon:'headband',type:'armor',slot:'head',rarity:'epic',maxStack:1,value:150,stats:{defense:4,crit:.05},visual:{color:'#eff4f2',accent:'#a76876'}},
 chuninVest:{name:'Chaleco Chūnin',desc:'Exam distinction. Protection and mobility.',icon:'vest',type:'armor',slot:'torso',rarity:'epic',maxStack:1,value:220,stats:{defense:7,speed:.05,chakra:1},visual:{color:'#6c9272',accent:'#c0c79c'}},
 eliteVest:{name:'Elite Vest',desc:'Advanced training gear.',icon:'vest',type:'armor',slot:'torso',rarity:'epic',maxStack:1,value:130,stats:{defense:6,chakra:1},visual:{color:'#566f91',accent:'#b5d8e4'}}
};
export const SKILLS={
 fists:{name:'Steel Fists',branch:'Taijutsu',cost:1,level:2,desc:'+3 attack',stats:{attack:3}},
 reflex:{name:'Ninja Reflexes',branch:'Taijutsu',cost:1,level:3,requires:'fists',desc:'+8% speed and +5 percentage points critical chance',stats:{speed:.08,crit:.05}},
 focus:{name:'Chakra Control',branch:'Ninjutsu',cost:1,level:2,desc:'+2 chakra per second and +10% ninjutsu damage',stats:{chakra:2,ninjutsu:.10}},
 giant:{name:'Giant Rasengan',branch:'Ninjutsu',cost:1,level:3,requires:'focus',desc:'Unlocks Giant Rasengan: 84 damage, 32 chakra, 6 s cooldown.'},
 bond:{name:'Shadow Clone Mastery I',branch:'Clones',cost:1,level:2,desc:'Summon 3 shadow clones instead of 2.',cloneCount:1},
 endurance:{name:'Resilient Shadows',branch:'Clones',cost:1,level:3,requires:'bond',desc:'+2 seconds of clone duration',cloneDuration:2},
 cloneII:{name:'Shadow Clone Mastery II',branch:'Clones',cost:1,level:4,requires:'bond',desc:'Summon 4 shadow clones.',cloneCount:1},
 cloneIII:{name:'Multi Shadow Clone Jutsu',branch:'Clones',cost:1,level:6,requires:'cloneII',desc:'Summon 5 shadow clones.',cloneCount:1},
 guardMaster:{name:'Shinobi Guard',branch:'Taijutsu',cost:1,level:3,requires:'fists',desc:'+2 defense',stats:{defense:2}},
 chakraMaster:{name:'Chakra Flow',branch:'Ninjutsu',cost:1,level:4,requires:'focus',desc:'+1 chakra per second',stats:{chakra:1}}
};
// Independent point budgets at the shared account level. Naruto's original IDs remain stable.
export const CHARACTER_TREES={
 naruto:SKILLS,
 sasuke:{
  precision:{name:'Uchiha Precision',branch:'Sharingan',cost:1,level:2,desc:'+5 critical chance points',stats:{crit:.05}},
  insight:{name:'Combat Eye',branch:'Sharingan',cost:1,level:3,requires:'precision',desc:'Sharingan lasts 8 s (+3 s)',mods:{l:{buff:8}}},
  flame:{name:'Blazing Katon',branch:'Katon',cost:1,level:2,desc:'Katon +12 base damage',mods:{f:{damage:57}}},
  flameMaster:{name:'Fire Mastery',branch:'Katon',cost:1,level:4,requires:'flame',desc:'Katon costs 17 chakra',mods:{f:{cost:17}}},
  current:{name:'Focused Chidori',branch:'Raiton',cost:1,level:2,desc:'Chidori +10 base damage',mods:{' ':{damage:78}}},
  nagashi:{name:'Chidori Nagashi',branch:'Raiton',cost:1,level:3,requires:'current',scroll:'scroll',advanced:true,desc:'Unlocks area discharge, 94 damage'}
 },
 sakura:{
  strength:{name:'Precise Strength',branch:'Medical Taijutsu',cost:1,level:2,desc:'+4 attack',stats:{attack:4}},
  shock:{name:'Shockwave',branch:'Medical Taijutsu',cost:1,level:3,requires:'strength',desc:'Seismic Wave +12 base damage',mods:{f:{damage:52}}},
  medicine:{name:'Vital Pulse',branch:'Medicina',cost:1,level:2,desc:'Heals 50 HP (+15)',mods:{l:{heal:50}}},
  renewal:{name:'Fast Recovery',branch:'Medicina',cost:1,level:3,requires:'medicine',desc:'Healing: 6 s cooldown',mods:{l:{cd:6}}},
  control:{name:'Precise Control',branch:'Chakra',cost:1,level:2,desc:'+2 chakra/s, +1 defense',stats:{chakra:2,defense:1}},
  devastation:{name:'Devastating Impact',branch:'Chakra',cost:1,level:3,requires:'control',scroll:'scroll',advanced:true,desc:'Unlocks area strike, 90 damage'}
 },
 kakashi:{
  tactics:{name:'Tactical Insight',branch:'Estrategia',cost:1,level:2,desc:'+3 critical chance points and +1 defense',stats:{crit:.03,defense:1}},
  wall:{name:'Reinforced Wall',branch:'Estrategia',cost:1,level:3,requires:'tactics',desc:'Wall lasts 6 s and reduces damage by 11',mods:{l:{buff:6,guard:11}}},
  stream:{name:'Water Current',branch:'Suiton',cost:1,level:2,desc:'Water Dragon +12 base damage',mods:{f:{damage:52}}},
  flow:{name:'Elemental Flow',branch:'Suiton',cost:1,level:4,requires:'stream',desc:'Water Dragon costs 14 chakra',mods:{f:{cost:14}}},
  blade:{name:'Refined Raikiri',branch:'Raiton',cost:1,level:2,desc:'Raikiri +10 base damage',mods:{' ':{damage:75}}},
  storm:{name:'Multiple Raikiri',branch:'Raiton',cost:1,level:3,requires:'blade',scroll:'scroll',advanced:true,desc:'Unlocks multi-strike discharge, 88 damage'}
 }
};
export function treeFor(id='naruto'){return CHARACTER_TREES[id]||SKILLS;}
export function learnedFor(r,id='naruto'){return id==='naruto'?r.skills:r.trees?.[id]||[];}
export function advancedUnlocked(r,id='naruto'){return id==='naruto'?r.skills.includes('giant'):learnedFor(r,id).some(k=>treeFor(id)[k]?.advanced);}
export function skillModifiers(r,id,key){const out={};for(const k of learnedFor(r,id))Object.assign(out,treeFor(id)[k]?.mods?.[key]||{});return out;}
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
export function newRPG(){const r={inventory:Array(CAPACITY).fill(null),equipment:Object.fromEntries(SLOTS.map(k=>[k,null])),hotbar:['ramen','pill','bandage'],skills:[],trees:{sasuke:[],sakura:[],kakashi:[]},overflow:{},round:0};addItem(r,'ramen',2);addItem(r,'pill',1);addItem(r,'bandage',2);return r;}
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
 const item=itemFor(id);if(!item||item.type!=='consumable')return 'Not a consumable.';
 if(index!==null&&r.inventory[index]?.id!==id||itemCount(r,id)<1)return 'None remaining.';
 if(item.heal&&p.hp>=100||item.restore&&p.chakra>=100)return 'That resource is already full.';
 if(index===null)removeItem(r,id);else discardSlot(r,index);
 if(item.heal)p.hp=Math.min(100,p.hp+item.heal);if(item.restore)p.chakra=Math.min(100,p.chakra+item.restore);
 return null;
}
export function pointsFor(r,xp,char='naruto'){return Math.max(0,levelFor(xp)-1-learnedFor(r,char).reduce((n,k)=>n+treeFor(char)[k].cost,0));}
export function unlockReason(r,xp,id,char='naruto'){
 const tree=treeFor(char),learned=learnedFor(r,char);if(!owns(tree,id))return 'Unknown technique';const s=tree[id];
 if(learned.includes(id))return 'Aprendida';if(levelFor(xp)<s.level)return 'Requires level '+s.level;
 if(s.requires&&!learned.includes(s.requires))return 'Requiere '+tree[s.requires].name;
 if(pointsFor(r,xp,char)<s.cost)return 'No points available';if(s.scroll&&!itemCount(r,s.scroll))return 'Requires a Chakra Scroll';return '';
}
export function unlockSkill(r,xp,id,char='naruto'){const reason=unlockReason(r,xp,id,char);if(reason)return reason;const s=treeFor(char)[id];if(s.scroll)removeItem(r,s.scroll);learnedFor(r,char).push(id);return null;}
export function statsFor(r,char='naruto'){
 const out={attack:0,defense:0,speed:0,crit:0,chakra:0,clone:0,ninjutsu:0,cloneDuration:0,cloneCount:0};
 function add(s){for(const [k,v] of Object.entries(s||{}))if(k in out)out[k]+=v;}
 for(const id of Object.values(r.equipment))add(itemFor(id)?.stats);
 for(const id of learnedFor(r,char)){const skill=treeFor(char)[id];add(skill.stats);out.cloneDuration+=skill.cloneDuration||0;out.cloneCount+=skill.cloneCount||0;}
 return out;
}
export function equipmentVisuals(r){return Object.fromEntries(SLOTS.map(s=>[s,itemFor(r.equipment[s])?.visual||null]));}
export function migrateRPG(enemies,quest){const r=newRPG();for(const e of enemies)if(e.hp===0)rewardItems(r,LOOT[e.id]||[]);if(quest===3)rewardItems(r,QUEST_LOOT);return r;}
export function validateRPG(raw,xp,legacy=true){
 if(!raw||!Array.isArray(raw.inventory)||raw.inventory.length!==CAPACITY||!raw.equipment||!Array.isArray(raw.hotbar)||raw.hotbar.length!==3||!Array.isArray(raw.skills)||!raw.overflow||!Number.isSafeInteger(raw.round)||raw.round<0||raw.round>1000000)throw Error('Invalid inventory.');
 const inventory=raw.inventory.map(s=>{if(s===null)return null;const i=itemFor(s?.id);if(!i||!Number.isSafeInteger(s.count)||s.count<1||s.count>i.maxStack)throw Error('Invalid item.');return cloneStack(s);});
 const equipment={};for(const slot of SLOTS){const id=raw.equipment[slot];if(id!==null&&itemFor(id)?.slot!==slot)throw Error('Invalid equipment.');equipment[slot]=id;}
 const hotbar=raw.hotbar.map(id=>{if(id!==null&&itemFor(id)?.type!=='consumable')throw Error('Invalid hotbar.');return id;});
 const skills=[];for(const id of raw.skills){if(!owns(SKILLS,id)||skills.includes(id)||SKILLS[id].level>levelFor(xp)||SKILLS[id].requires&&!skills.includes(SKILLS[id].requires))throw Error('Invalid skill tree.');skills.push(id);}
 if(skills.reduce((n,k)=>n+SKILLS[k].cost,0)>levelFor(xp)-1)throw Error('Invalid skill points.');
 const overflow={};for(const [id,n] of Object.entries(raw.overflow)){if(!itemFor(id)||!Number.isSafeInteger(n)||n<1||n>1000000)throw Error('Invalid overflow.');overflow[id]=n;}
 const trees={};for(const char of ['sasuke','sakura','kakashi']){
 const tree=treeFor(char),arr=raw.trees?.[char]??(legacy?(skills.includes('giant')?({sasuke:['current','nagashi'],sakura:['control','devastation'],kakashi:['blade','storm']}[char]):[]):null);
 if(!Array.isArray(arr))throw Error('Missing tree for '+char);const learned=[];for(const id of arr){if(!owns(tree,id)||learned.includes(id)||tree[id].level>levelFor(xp)||tree[id].requires&&!learned.includes(tree[id].requires))throw Error('Invalid tree for '+char);learned.push(id);}
 if(learned.reduce((n,k)=>n+tree[k].cost,0)>levelFor(xp)-1)throw Error('Invalid points for '+char);trees[char]=learned;
 }
 return {inventory,equipment,hotbar,skills,trees,overflow,round:raw.round};
}

// Maximum five simultaneous player shadow clones; independent of scripted enemy clones.
export function shadowCloneLimit(bonus){return Math.min(5,2+Math.max(0,Math.floor(bonus?.cloneCount||0)));}
