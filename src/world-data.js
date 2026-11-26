import {itemFor,itemCount,addItem,removeItem,rewardItems} from './rpg-data.js';
// Positions use the existing map, so legacy saves and the original five enemy IDs remain valid.
export const EAST={minX:50,maxX:109,minZ:-19,maxZ:19,gate:{x:49,z:-2},ruin:{x:90,z:0}};
export const REGIONAL_ENEMIES=[
 {id:100,x:64,z:-4,role:'brawler',hp:85,name:'Road Bandit',xp:40,coins:20,loot:[['bandage',2],['cloth',1]]},
 {id:101,x:75,z:5,role:'thrower',hp:85,name:'Rogue Scout',xp:45,coins:25,loot:[['pill',2]]},
 {id:102,x:85,z:-4,role:'guard',hp:100,name:'Shrine Watcher',xp:55,coins:30,loot:[['cloth',3],['pill',1]]},
 {id:103,x:102,z:0,role:'guard',hp:120,name:'Ruins Guardian',xp:90,coins:55,loot:[['scroll',1],['ramen',2]]}
];
export const inEast=p=>p.x>=50;
export function regionalGate(x,z,world){return x>=89&&x<=91&&(Math.abs(z)>3||!REGIONAL_ENEMIES.slice(0,3).every(e=>world?.defeated?.includes(e.id)));}
export const NPCS=[
 {id:'shikamaru',name:'Shikamaru',x:-13,z:10,kind:'shikamaru',role:'Estratega',root:'shikamaru'},
 {id:'sakura',name:'Sakura',x:-9,z:2,kind:'sakura',role:'Medical Ninja',root:'sakura'},
 {id:'teuchi',name:'Teuchi',x:-21,z:11.8,kind:'teuchi',role:'Ichiraku',root:'teuchi'},
 {id:'tenten',name:'Tenten',x:-4,z:-2,kind:'tenten',role:'Comerciante',root:'tenten'},
 {id:'iruka',name:'Iruka',x:-13,z:-14.5,kind:'iruka',role:'Instructor',root:'iruka'}
];
export const CHESTS=[
 {id:'roadcache',name:'Road Supplies',x:60,z:5,type:'common',loot:[['ramen',2],['pill',1]],coins:25},
 {id:'reliccache',name:'Ruins Reliquary',x:106,z:0,type:'rare',requiresDefeated:103,loot:[['ruinCharm',1],['pill',3]],coins:90},
 {id:'garden',name:'Village Reserve',x:-16,z:12,type:'common',loot:[['ramen',2],['bandage',2]],coins:20},
 {id:'supply',name:'Supply Chest',x:-24,z:-2,type:'common',loot:[['ramen',2],['bandage',2]],coins:10},
 {id:'forest',name:'Scout Chest',x:23,z:-4,type:'rare',loot:[['pill',2],['cloth',3]],coins:35},
 {id:'sealed',name:'Sealed Cache',x:31,z:1,type:'locked',key:'forestKey',loot:[['scroll',1],['eliteVest',1]],coins:50},
 {id:'trap',name:'Suspicious Chest',x:18,z:5,type:'trap',damage:18,loot:[['pill',2],['bandage',2]],coins:25}
];
export const LANDMARKS=[
 {id:'examforest',name:'Forest of Death',x:-9,z:32,r:8},
 {id:'examring',name:'Arena Chūnin',x:-29,z:32,r:9},
 {id:'eastroad',name:'Frontier Trail',x:62,z:-2,r:5},
 {id:'shrine',name:'Abandoned Shrine',x:80,z:0,r:5},
 {id:'ruins',name:'Wind Ruins',x:102,z:0,r:6},
 {id:'garden',name:'Nara Clan Garden',x:-13,z:10,r:3},
 {id:'market',name:'Konoha Market',x:-5,z:10.8,r:3},
 {id:'hokage',name:'Hokage Lookout',x:-13,z:-25.8,r:3},
 {id:'plaza',name:'Konoha Square',x:-13,z:-2,r:4},
 {id:'ichiraku',name:'Ichiraku',x:-21,z:11.8,r:3},
 {id:'bridge',name:'East Bridge',x:8,z:-2,r:3},
 {id:'forest',name:'Training Forest',x:25,z:-2,r:7},
 {id:'academy',name:'Ninja Academy',x:-13,z:-14.5,r:4}
];
export const SIDEQUESTS={
 village:{name:'A Strategic Walk',desc:'Visit the garden, market and lookout. Return to Shikamaru.',visits:['garden','market','hokage'],reward:[['pill',2],['charm',1]],xp:85,coins:65},
 supplies:{name:'Supplies for Sakura',desc:'Deliver 3 rogue cloths to Sakura.',reward:[['pill',2],['ramen',1]],xp:50,coins:35},
 scouting:{name:'Shinobi Route',desc:'Visit Ichiraku, the bridge and the forest. Return to Iruka.',visits:['ichiraku','bridge','forest'],reward:[['forestKey',1]],xp:75,coins:50}
};
export const SHOPS={teuchi:['ramen','pill'],tenten:['bandage','pill','headband','kunai','bracer','sandals','charm']};
export const DIALOGUES={
 shikamaru:{text:'What a drag... Iruka asked me to check the village routes. Could you visit the garden, market and Hokage lookout?',choices:[{label:'Accept Route',action:'accept',quest:'village',when:'villageNew'},{label:'Report Route',action:'finish',quest:'village',when:'villageActive'},{label:'See you later',action:'close'}]},
 sakura:{text:'Naruto! Training without resting again? I need bandages for the infirmary.',choices:[
 {label:'Need help?',action:'accept',quest:'supplies',when:'suppliesNew'},
 {label:'Deliver three cloths',action:'finish',quest:'supplies',when:'suppliesActive'},
 {label:'Heal (15 ryō)',action:'heal'},
 {label:'See you later',action:'close'}]},
 teuchi:{text:'Welcome to Ichiraku! Good ramen is part of training.',choices:[
 {label:'View Menu',action:'shop',shop:'teuchi'},{label:'See you later',action:'close'}]},
 tenten:{text:'I have supplies and gear for your missions. I also buy materials.',choices:[
 {label:'Buy Gear',action:'shop',shop:'tenten'},{label:'Sell Items',action:'sell',shop:'tenten'},{label:'See you later',action:'close'}]},
 iruka:{text:'Knowing your village is as important as mastering jutsu. Can you check the route for me?',choices:[
 {label:'Accept Scouting Mission',action:'accept',quest:'scouting',when:'scoutingNew'},
 {label:'Report Scouting Route',action:'finish',quest:'scouting',when:'scoutingActive'},
 {label:'See you later',action:'close'}]}
};
// Keep the v11 save clock range 0..240, but advance at 2/3 unit per real simulation second.
export const DAY_SECONDS=240,DAY_RATE=2/3,PHASE_UNITS=80;
export function dayPhase(clock){const q=((clock%DAY_SECONDS)+DAY_SECONDS)%DAY_SECONDS,i=Math.floor(q/PHASE_UNITS);return {id:['day','sunset','night'][i],name:['Day','Sunset','Night'][i],remaining:Math.ceil((PHASE_UNITS-q%PHASE_UNITS)/DAY_RATE)};}
export function newWorld(){return {opened:[],quests:{supplies:0,scouting:0,village:0},visited:[],clock:0,defeated:[]};}
export function validateWorld(raw,legacy=false,legacyRegion=legacy){
 if(!raw||!Array.isArray(raw.opened)||!Array.isArray(raw.visited)||!raw.quests||!Number.isFinite(raw.clock)||raw.clock<0||raw.clock>=DAY_SECONDS)throw Error('Invalid world state.');
 const unique=(a,valid)=>{if(new Set(a).size!==a.length||a.some(k=>!valid.includes(k)))throw Error('Invalid world record.');return [...a];};
 const quests={};for(const id of Object.keys(SIDEQUESTS)){const v=id==='village'&&legacy&&raw.quests[id]===undefined?0:raw.quests[id];if(![0,1,2].includes(v))throw Error('Invalid side quest.');quests[id]=v;}
 const dead=raw.defeated===undefined&&legacyRegion?[]:raw.defeated;if(!Array.isArray(dead))throw Error('Invalid regional progress.');const defeated=unique(dead,REGIONAL_ENEMIES.map(e=>e.id));if(raw.opened.includes('reliccache')&&!defeated.includes(103))throw Error('Reliquary guardian not defeated.');
 return {defeated,opened:unique(raw.opened,CHESTS.map(c=>c.id)),quests,visited:unique(raw.visited,LANDMARKS.map(l=>l.id)),clock:raw.clock};
}
export function discover(world,p){for(const l of LANDMARKS)if(!world.visited.includes(l.id)&&Math.hypot(p.x-l.x,p.z-l.z)<=l.r)world.visited.push(l.id);}
export function nearestWorld(p,world,npcs=NPCS){return [...npcs.map(o=>({...o,category:'npc'})),...CHESTS.filter(o=>!world.opened.includes(o.id)).map(o=>({...o,category:'chest'}))].map(o=>({...o,d:Math.hypot(p.x-o.x,p.z-o.z)})).filter(o=>o.d<(o.category==='npc'?2.5:1.9)).sort((a,b)=>a.d-b.d)[0]||null;}
export function openChest(world,rpg,p,id){const c=CHESTS.find(c=>c.id===id);if(!c||world.opened.includes(id))return {error:'The chest is already open.'};if(c.requiresDefeated!==undefined&&!world.defeated.includes(c.requiresDefeated))return {error:'Defeat the guardian before opening the reliquary.'};if(c.key&&!itemCount(rpg,c.key))return {error:'You need Iruka\'s key.'};if(c.key)removeItem(rpg,c.key);world.opened.push(id);p.coins+=c.coins;const loot=rewardItems(rpg,c.loot);if(c.damage)p.hp=Math.max(1,p.hp-c.damage);return {loot,coins:c.coins,damage:c.damage||0};}
export function questProgress(world,rpg,id){if(id==='supplies')return Math.min(3,itemCount(rpg,'cloth'))+'/3 cloths';if(SIDEQUESTS[id]?.visits)return SIDEQUESTS[id].visits.filter(v=>world.visited.includes(v)).length+'/'+SIDEQUESTS[id].visits.length+' locations';return '';}
export function acceptQuest(world,id){if(world.quests[id]!==0)return 'Quest unavailable.';world.quests[id]=1;return null;}
export function finishQuest(world,rpg,p,id){if(world.quests[id]!==1)return 'Quest not active.';if(id==='supplies'&&itemCount(rpg,'cloth')<3)return 'More cloth is needed.';if(SIDEQUESTS[id].visits&&!SIDEQUESTS[id].visits.every(v=>world.visited.includes(v)))return 'More locations remain to be visited.';if(id==='supplies')removeItem(rpg,'cloth',3);const q=SIDEQUESTS[id];world.quests[id]=2;p.xp+=q.xp;p.coins+=q.coins;rewardItems(rpg,q.reward);return null;}
export function choicesFor(world,id){return (DIALOGUES[id]?.choices||[]).filter(c=>!c.when||(c.when.endsWith('New')?world.quests[c.quest]===0:world.quests[c.quest]===1));}
export function buyPrice(id){return itemFor(id)?.value||0;}
export function sellPrice(id){return Math.max(1,Math.floor(buyPrice(id)*.5));}
export function buyItem(rpg,p,shop,id){if(!SHOPS[shop]?.includes(id))return 'Not for sale.';const price=buyPrice(id);if(p.coins<price)return 'Not enough ryō.';if(addItem(rpg,id,1,false))return 'Backpack full.';p.coins-=price;return null;}
export function sellItem(rpg,p,id){const item=itemFor(id);if(!item||item.type==='key'||item.type==='scroll')return 'Quest item: cannot be sold.';if(!removeItem(rpg,id))return 'You do not have that item.';p.coins+=sellPrice(id);return null;}
export function healPlayer(p){if(p.hp===100&&p.chakra===100)return 'You are already healed.';if(p.coins<15)return 'You need 15 ryō.';p.coins-=15;p.hp=p.chakra=100;return null;}
export function worldTime(clock){const q=((clock%DAY_SECONDS)+DAY_SECONDS)%DAY_SECONDS,i=Math.floor(q/PHASE_UNITS),f=q%PHASE_UNITS/PHASE_UNITS,minutes=Math.floor(([6,16,20][i]+[10,4,10][i]*f)*60+1e-8)%1440;return String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');}

// Living World data. Existing save schema is unchanged; routes/weather derive from clock.
export const NPC_ROUTES={
 shikamaru:[[0,0],[1.4,0],[1.4,1.5],[-.6,1.5]],
 sakura:[[0,0],[1.4,0],[1.4,1.3],[0,1.3]],
 teuchi:[[0,0],[-1.1,0],[-1.1,1],[0,1]],
 tenten:[[0,0],[1.5,0],[1.5,1.3],[0,1.3]],
 iruka:[[0,0],[-1.3,0],[-1.3,.8],[0,.8]]
};
export function npcDestination(n,clock){
 const route=NPC_ROUTES[n.id]||[[0,0]],index=(1+Math.floor(clock/40))%route.length,[dx,dz]=route[index];return {x:n.homeX+dx,z:n.homeZ+dz,activity:['Rest','Work','Patrol','Return'][index]||'Rest'};
}
export const INTERIORS=[
 {id:'academy',name:'Ninja Academy',door:{x:-11.6,z:-14.5},x:-180,z:0,npc:'iruka',floor:'b49b74',wall:'e2cf9c',furniture:[[-3,-2,2.3,1.1,'desk'],[1.5,-2,2.3,1.1,'desk'],[-3,1,2.3,1.1,'desk'],[1.5,1,2.3,1.1,'desk']]},
 {id:'shop',name:'Tenten\'s Armory',door:{x:-5,z:-5.4},x:-250,z:0,npc:'tenten',floor:'9e896d',wall:'d9c5a0',furniture:[[-3,-2.8,2.6,1.2,'shelf'],[2.8,-2.8,2.6,1.2,'shelf'],[0,-.7,3.1,.85,'counter']]},
 {id:'ramen',name:'Ichiraku Ramen',door:{x:-19,z:11.8},x:-320,z:0,npc:'teuchi',floor:'b99b78',wall:'e5d5ac',furniture:[[-2.7,-1,2.4,1.15,'table'],[2.7,-1,2.4,1.15,'table'],[0,-3,4.5,1,'counter']]}
];
export const WEATHER={
 clear:{name:'Clear',rain:0,fog:0},rain:{name:'Rain',rain:.65,fog:.12},fog:{name:'Fog',rain:0,fog:.55},storm:{name:'Storm',rain:1,fog:.22}
};
// A weather clock independent from the day/night clock. Durations are simulation seconds.
export const WEATHER_TIMING={clear:[35,85],rain:[25,55],storm:[20,40],fog:[25,50]};
export function weatherDuration(kind,random=Math.random){const [min,max]=WEATHER_TIMING[kind]||WEATHER_TIMING.clear;return min+(max-min)*random();}
export function newWeather(now=0,random=Math.random){return {kind:'clear',until:now+weatherDuration('clear',random)};}
export function advanceWeather(state,now,random=Math.random){
 if(now<state.until)return state;
 const kind=state.kind==='clear'?(random()<.82?'rain':'storm'):'clear';
 return {kind,until:now+weatherDuration(kind,random)};
}
// CSS grades the actual world canvas, not the HUD, with an independent weather layer.
export const LIGHTING={day:{filter:'brightness(1) saturate(1)',tint:0},sunset:{filter:'sepia(.42) saturate(1.35) brightness(.86)',tint:.22},night:{filter:'brightness(.53) saturate(.72) contrast(1.08)',tint:.30},interior:{filter:'brightness(1) saturate(1)',tint:0}};
export function lightingFor(clock,interior=false){return LIGHTING[interior?'interior':dayPhase(clock).id];}
export const WORLD_EVENTS={
 ambush:{name:'Shinobi Ambush',banner:'SHINOBI AMBUSH',objective:'Defeat the three rogue ninja',duration:45,reward:45,xp:50,roles:['striker','caster','assassin']},
 cache:{name:'Lost Supplies',banner:'LOST SUPPLIES',objective:'Find the supplies and interact',duration:55,reward:30,xp:25,loot:[['ramen',1],['pill',1]]}
};
