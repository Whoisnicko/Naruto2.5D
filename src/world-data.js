import {itemFor,itemCount,addItem,removeItem,rewardItems} from './rpg-data.js';
// Positions use the existing map, so legacy saves and the original five enemy IDs remain valid.
export const EAST={minX:50,maxX:109,minZ:-19,maxZ:19,gate:{x:49,z:-2},ruin:{x:90,z:0}};
export const REGIONAL_ENEMIES=[
 {id:100,x:64,z:-4,role:'brawler',hp:85,name:'Bandido del camino',xp:40,coins:20,loot:[['bandage',2],['cloth',1]]},
 {id:101,x:75,z:5,role:'thrower',hp:85,name:'Explorador renegado',xp:45,coins:25,loot:[['pill',2]]},
 {id:102,x:85,z:-4,role:'guard',hp:100,name:'Vigía del santuario',xp:55,coins:30,loot:[['cloth',3],['pill',1]]},
 {id:103,x:102,z:0,role:'guard',hp:120,name:'Guardián de las ruinas',xp:90,coins:55,loot:[['scroll',1],['ramen',2]]}
];
export const inEast=p=>p.x>=50;
export function regionalGate(x,z,world){return x>=89&&x<=91&&(Math.abs(z)>3||!REGIONAL_ENEMIES.slice(0,3).every(e=>world?.defeated?.includes(e.id)));}
export const NPCS=[
 {id:'shikamaru',name:'Shikamaru',x:-13,z:10,kind:'shikamaru',role:'Estratega',root:'shikamaru'},
 {id:'sakura',name:'Sakura',x:-9,z:2,kind:'sakura',role:'Médica ninja',root:'sakura'},
 {id:'teuchi',name:'Teuchi',x:-21,z:11.8,kind:'teuchi',role:'Ichiraku',root:'teuchi'},
 {id:'tenten',name:'Tenten',x:-4,z:-2,kind:'tenten',role:'Comerciante',root:'tenten'},
 {id:'iruka',name:'Iruka',x:-13,z:-14.5,kind:'iruka',role:'Instructor',root:'iruka'}
];
export const CHESTS=[
 {id:'roadcache',name:'Suministros del camino',x:60,z:5,type:'common',loot:[['ramen',2],['pill',1]],coins:25},
 {id:'reliccache',name:'Relicario de las ruinas',x:106,z:0,type:'rare',requiresDefeated:103,loot:[['ruinCharm',1],['pill',3]],coins:90},
 {id:'garden',name:'Reserva de la aldea',x:-16,z:12,type:'common',loot:[['ramen',2],['bandage',2]],coins:20},
 {id:'supply',name:'Cofre de suministros',x:-24,z:-2,type:'common',loot:[['ramen',2],['bandage',2]],coins:10},
 {id:'forest',name:'Cofre del explorador',x:23,z:-4,type:'rare',loot:[['pill',2],['cloth',3]],coins:35},
 {id:'sealed',name:'Alijo sellado',x:31,z:1,type:'locked',key:'forestKey',loot:[['scroll',1],['eliteVest',1]],coins:50},
 {id:'trap',name:'Cofre sospechoso',x:18,z:5,type:'trap',damage:18,loot:[['pill',2],['bandage',2]],coins:25}
];
export const LANDMARKS=[
 {id:'examforest',name:'Bosque de la muerte',x:-9,z:32,r:8},
 {id:'examring',name:'Arena Chūnin',x:-29,z:32,r:9},
 {id:'eastroad',name:'Sendero de la frontera',x:62,z:-2,r:5},
 {id:'shrine',name:'Santuario abandonado',x:80,z:0,r:5},
 {id:'ruins',name:'Ruinas del viento',x:102,z:0,r:6},
 {id:'garden',name:'Jardín del clan Nara',x:-13,z:10,r:3},
 {id:'market',name:'Mercado de Konoha',x:-5,z:10.8,r:3},
 {id:'hokage',name:'Mirador Hokage',x:-13,z:-25.8,r:3},
 {id:'plaza',name:'Plaza de Konoha',x:-13,z:-2,r:4},
 {id:'ichiraku',name:'Ichiraku',x:-21,z:11.8,r:3},
 {id:'bridge',name:'Puente del este',x:8,z:-2,r:3},
 {id:'forest',name:'Bosque de entrenamiento',x:25,z:-2,r:7},
 {id:'academy',name:'Academia ninja',x:-13,z:-14.5,r:4}
];
export const SIDEQUESTS={
 village:{name:'Un paseo estratégico',desc:'Visitá el jardín, el mercado y el mirador. Volvé con Shikamaru.',visits:['garden','market','hokage'],reward:[['pill',2],['charm',1]],xp:85,coins:65},
 supplies:{name:'Suministros para Sakura',desc:'Entregá 3 telas de renegado a Sakura.',reward:[['pill',2],['ramen',1]],xp:50,coins:35},
 scouting:{name:'Ruta del shinobi',desc:'Visitá Ichiraku, el puente y el bosque. Volvé con Iruka.',visits:['ichiraku','bridge','forest'],reward:[['forestKey',1]],xp:75,coins:50}
};
export const SHOPS={teuchi:['ramen','pill'],tenten:['bandage','pill','headband','kunai','bracer','sandals','charm']};
export const DIALOGUES={
 shikamaru:{text:'Qué problemático... Iruka me pidió revisar las rutas de la aldea. ¿Podés recorrer el jardín, el mercado y el mirador Hokage?',choices:[{label:'Aceptar recorrido',action:'accept',quest:'village',when:'villageNew'},{label:'Informar recorrido',action:'finish',quest:'village',when:'villageActive'},{label:'Hasta luego',action:'close'}]},
 sakura:{text:'¡Naruto! ¿Otra vez entrenando sin descansar? Necesito vendas para la enfermería.',choices:[
 {label:'¿Necesitás ayuda?',action:'accept',quest:'supplies',when:'suppliesNew'},
 {label:'Entregar tres telas',action:'finish',quest:'supplies',when:'suppliesActive'},
 {label:'Curarme (15 ryō)',action:'heal'},
 {label:'Hasta luego',action:'close'}]},
 teuchi:{text:'¡Bienvenido a Ichiraku! Un buen ramen es parte del entrenamiento.',choices:[
 {label:'Ver menú',action:'shop',shop:'teuchi'},{label:'Hasta luego',action:'close'}]},
 tenten:{text:'Tengo suministros y equipo para tus misiones. También compro materiales.',choices:[
 {label:'Comprar equipo',action:'shop',shop:'tenten'},{label:'Vender objetos',action:'sell',shop:'tenten'},{label:'Hasta luego',action:'close'}]},
 iruka:{text:'Conocer tu aldea es tan importante como dominar un jutsu. ¿Me ayudás a revisar la ruta?',choices:[
 {label:'Aceptar misión de exploración',action:'accept',quest:'scouting',when:'scoutingNew'},
 {label:'Informar ruta explorada',action:'finish',quest:'scouting',when:'scoutingActive'},
 {label:'Hasta luego',action:'close'}]}
};
export const DAY_SECONDS=240;
export function newWorld(){return {opened:[],quests:{supplies:0,scouting:0,village:0},visited:[],clock:60,defeated:[]};}
export function validateWorld(raw,legacy=false,legacyRegion=legacy){
 if(!raw||!Array.isArray(raw.opened)||!Array.isArray(raw.visited)||!raw.quests||!Number.isFinite(raw.clock)||raw.clock<0||raw.clock>=DAY_SECONDS)throw Error('Estado del mundo inválido.');
 const unique=(a,valid)=>{if(new Set(a).size!==a.length||a.some(k=>!valid.includes(k)))throw Error('Registro del mundo inválido.');return [...a];};
 const quests={};for(const id of Object.keys(SIDEQUESTS)){const v=id==='village'&&legacy&&raw.quests[id]===undefined?0:raw.quests[id];if(![0,1,2].includes(v))throw Error('Misión secundaria inválida.');quests[id]=v;}
 const dead=raw.defeated===undefined&&legacyRegion?[]:raw.defeated;if(!Array.isArray(dead))throw Error('Progreso regional inválido.');const defeated=unique(dead,REGIONAL_ENEMIES.map(e=>e.id));if(raw.opened.includes('reliccache')&&!defeated.includes(103))throw Error('Relicario sin guardián derrotado.');
 return {defeated,opened:unique(raw.opened,CHESTS.map(c=>c.id)),quests,visited:unique(raw.visited,LANDMARKS.map(l=>l.id)),clock:raw.clock};
}
export function discover(world,p){for(const l of LANDMARKS)if(!world.visited.includes(l.id)&&Math.hypot(p.x-l.x,p.z-l.z)<=l.r)world.visited.push(l.id);}
export function nearestWorld(p,world,npcs=NPCS){return [...npcs.map(o=>({...o,category:'npc'})),...CHESTS.filter(o=>!world.opened.includes(o.id)).map(o=>({...o,category:'chest'}))].map(o=>({...o,d:Math.hypot(p.x-o.x,p.z-o.z)})).filter(o=>o.d<(o.category==='npc'?2.5:1.9)).sort((a,b)=>a.d-b.d)[0]||null;}
export function openChest(world,rpg,p,id){const c=CHESTS.find(c=>c.id===id);if(!c||world.opened.includes(id))return {error:'El cofre ya está abierto.'};if(c.requiresDefeated!==undefined&&!world.defeated.includes(c.requiresDefeated))return {error:'Derrotá al guardián antes de abrir el relicario.'};if(c.key&&!itemCount(rpg,c.key))return {error:'Necesitás la llave de Iruka.'};if(c.key)removeItem(rpg,c.key);world.opened.push(id);p.coins+=c.coins;const loot=rewardItems(rpg,c.loot);if(c.damage)p.hp=Math.max(1,p.hp-c.damage);return {loot,coins:c.coins,damage:c.damage||0};}
export function questProgress(world,rpg,id){if(id==='supplies')return Math.min(3,itemCount(rpg,'cloth'))+'/3 telas';if(SIDEQUESTS[id]?.visits)return SIDEQUESTS[id].visits.filter(v=>world.visited.includes(v)).length+'/'+SIDEQUESTS[id].visits.length+' lugares';return '';}
export function acceptQuest(world,id){if(world.quests[id]!==0)return 'Misión no disponible.';world.quests[id]=1;return null;}
export function finishQuest(world,rpg,p,id){if(world.quests[id]!==1)return 'Misión no activa.';if(id==='supplies'&&itemCount(rpg,'cloth')<3)return 'Todavía faltan telas.';if(SIDEQUESTS[id].visits&&!SIDEQUESTS[id].visits.every(v=>world.visited.includes(v)))return 'Todavía faltan lugares por visitar.';if(id==='supplies')removeItem(rpg,'cloth',3);const q=SIDEQUESTS[id];world.quests[id]=2;p.xp+=q.xp;p.coins+=q.coins;rewardItems(rpg,q.reward);return null;}
export function choicesFor(world,id){return (DIALOGUES[id]?.choices||[]).filter(c=>!c.when||(c.when.endsWith('New')?world.quests[c.quest]===0:world.quests[c.quest]===1));}
export function buyPrice(id){return itemFor(id)?.value||0;}
export function sellPrice(id){return Math.max(1,Math.floor(buyPrice(id)*.5));}
export function buyItem(rpg,p,shop,id){if(!SHOPS[shop]?.includes(id))return 'No está a la venta.';const price=buyPrice(id);if(p.coins<price)return 'Ryō insuficientes.';if(addItem(rpg,id,1,false))return 'Mochila llena.';p.coins-=price;return null;}
export function sellItem(rpg,p,id){const item=itemFor(id);if(!item||item.type==='key'||item.type==='scroll')return 'Objeto de misión: no se vende.';if(!removeItem(rpg,id))return 'No tenés ese objeto.';p.coins+=sellPrice(id);return null;}
export function healPlayer(p){if(p.hp===100&&p.chakra===100)return 'Ya estás recuperado.';if(p.coins<15)return 'Necesitás 15 ryō.';p.coins-=15;p.hp=p.chakra=100;return null;}
export function worldTime(clock){const h=Math.floor(clock/DAY_SECONDS*24);return String(h).padStart(2,'0')+':'+String(Math.floor(clock/DAY_SECONDS*1440)%60).padStart(2,'0');}

// Living World data. Existing save schema is unchanged; routes/weather derive from clock.
export const NPC_ROUTES={
 shikamaru:[[0,0],[1.4,0],[1.4,1.5],[-.6,1.5]],
 sakura:[[0,0],[1.4,0],[1.4,1.3],[0,1.3]],
 teuchi:[[0,0],[-1.1,0],[-1.1,1],[0,1]],
 tenten:[[0,0],[1.5,0],[1.5,1.3],[0,1.3]],
 iruka:[[0,0],[1.3,0],[1.3,.8],[0,.8]]
};
export function npcDestination(n,clock){
 const route=NPC_ROUTES[n.id]||[[0,0]],index=Math.floor(clock/15)%route.length,[dx,dz]=route[index];return {x:n.homeX+dx,z:n.homeZ+dz,activity:['Descanso','Trabajo','Recorrido','Regreso'][index]||'Descanso'};
}
export const INTERIORS=[
 {id:'academy',name:'Academia ninja',door:{x:-11.6,z:-14.5},x:-180,z:0,npc:'iruka',floor:'b49b74',wall:'e2cf9c',furniture:[[-3,-2,2.3,1.1,'desk'],[1.5,-2,2.3,1.1,'desk'],[-3,1,2.3,1.1,'desk'],[1.5,1,2.3,1.1,'desk']]},
 {id:'shop',name:'Armería de Tenten',door:{x:-5,z:-5.4},x:-250,z:0,npc:'tenten',floor:'9e896d',wall:'d9c5a0',furniture:[[-3,-2.8,2.6,1.2,'shelf'],[2.8,-2.8,2.6,1.2,'shelf'],[0,-.7,3.1,.85,'counter']]},
 {id:'ramen',name:'Ichiraku Ramen',door:{x:-19,z:11.8},x:-320,z:0,npc:'teuchi',floor:'b99b78',wall:'e5d5ac',furniture:[[-2.7,-1,2.4,1.15,'table'],[2.7,-1,2.4,1.15,'table'],[0,-3,4.5,1,'counter']]}
];
export const WEATHER={
 clear:{name:'Despejado',rain:0,fog:0},rain:{name:'Lluvia',rain:.65,fog:.12},fog:{name:'Niebla',rain:0,fog:.55},storm:{name:'Tormenta',rain:1,fog:.22}
};
export function weatherAt(clock){return clock>=105&&clock<145?'rain':clock>=145&&clock<185?'fog':clock>=185&&clock<215?'storm':'clear';}
export const WORLD_EVENTS={
 ambush:{name:'Emboscada renegada',duration:45,reward:45,xp:50,roles:['striker','caster','assassin']},
 cache:{name:'Suministros perdidos',duration:55,reward:30,xp:25,loot:[['ramen',1],['pill',1]]}
};
