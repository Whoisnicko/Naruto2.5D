import {newWorld,SIDEQUESTS,SHOPS,DIALOGUES,choicesFor,questProgress,acceptQuest,finishQuest,buyPrice,sellPrice,buyItem,sellItem,healPlayer} from './world-data.js';
import {newRPG,itemFor,itemCount,addItem,rewardItems,useItem,collectOverflow,LOOT} from './rpg-data.js';

// Temporary remapping for the new village; no legacy coordinates or campaign save mutations.
export const VILLAGE_LANDMARKS=[
 {id:'garden',name:'Jardín Nara (barrio oeste)',at:[20,43],r:3},
 {id:'market',name:'Mercado',at:[92,59],r:3},
 {id:'hokage',name:'Mirador Hokage',at:[72,26],r:3},
 {id:'ichiraku',name:'Ichiraku Ramen',at:[85,74],r:2.8},
 {id:'bridge',name:'Puente central',at:[36,43],r:3},
 {id:'forest',name:'Claro de entrenamiento',region:'forest',at:[42,30],r:3}
];
export const VILLAGE_SUPPLY={at:[119,25],radius:2.5,reward:[['cloth',3]]};
export const VILLAGE_SEED={coins:100,xp:0,hp:60,chakra:50};
export function createVillageServices(initial=null){
 const world=initial?.world??newWorld(),rpg=initial?.rpg??newRPG(),p=initial?{hp:initial.p.hp,chakra:initial.p.chakra,xp:initial.p.xp,coins:initial.p.coins}:{...VILLAGE_SEED};let cache=false,mainQuest=initial?.quest??1;const defeated=new Set(initial?.enemies?.filter(e=>e.hp===0).map(e=>e.id)||[]);
 const inventory=()=>[...new Set(rpg.inventory.filter(Boolean).map(s=>s.id))].map(id=>({id,count:itemCount(rpg,id),...itemFor(id)}));
 function update(pos,active=true,region='konoha'){if(!active)return;for(const l of VILLAGE_LANDMARKS)if((l.region||'konoha')===region&&!world.visited.includes(l.id)&&Math.hypot(pos.x-l.at[0],pos.y-l.at[1])<=l.r)world.visited.push(l.id);}
 function nearSupply(pos){return !initial&&!cache&&Math.hypot(pos.x-VILLAGE_SUPPLY.at[0],pos.y-VILLAGE_SUPPLY.at[1])<=VILLAGE_SUPPLY.radius;}
 function collect(pos){if(!nearSupply(pos))return 'No hay provisiones disponibles aquí.';rewardItems(rpg,VILLAGE_SUPPLY.reward);cache=true;return null;}
 function action(npc,choice,id){if(!choice||!choicesFor(world,npc).some(c=>c.action===choice.action&&c.quest===choice.quest&&c.shop===choice.shop))return 'Opción no disponible.';
  if(choice.action==='accept')return acceptQuest(world,choice.quest);
  if(choice.action==='finish')return finishQuest(world,rpg,p,choice.quest);
  if(choice.action==='heal')return healPlayer(p);
  return 'Acción no disponible.';
 }
 function trade(npc,mode,id){if(!Object.hasOwn(SHOPS,npc))return 'Comercio no disponible.';if(mode==='shop')return buyItem(rpg,p,npc,id);if(mode==='sell'&&choicesFor(world,npc).some(c=>c.action==='sell'))return sellItem(rpg,p,id);return 'Venta no disponible.';}
 function quests(){return Object.entries(SIDEQUESTS).map(([id,q])=>({id,...q,status:world.quests[id],progress:questProgress(world,rpg,id),locations:(q.visits||[]).map(v=>({...VILLAGE_LANDMARKS.find(l=>l.id===v),visited:world.visited.includes(v)}))}));}
 function startMain(){if(mainQuest!==0)return false;mainQuest=defeated.size===5?2:1;return true}
 function defeat(id){if(mainQuest!==1||!Number.isInteger(id)||id<0||id>=5||defeated.has(id))return false;defeated.add(id);p.xp=Math.min(1e9,p.xp+25);p.coins=Math.min(1e9,p.coins+12);rewardItems(rpg,LOOT[id]);if(defeated.size===5)mainQuest=2;return true}
 return {combatResources:p,combatRPG:rpg,startMain,defeat,mainQuest:()=>mainQuest,defeated:()=>[...defeated],campaignData:()=>({player:{...p},rpg,world,combat:{quest:mainQuest,defeated:[...defeated]}}),resources:()=>({...p}),update,nearSupply,collect,action,trade,quests,inventory,choices:id=>choicesFor(world,id),shop:id=>(SHOPS[id]||[]).map(k=>({id:k,...itemFor(k),count:itemCount(rpg,k),price:buyPrice(k)})),sell:()=>inventory().filter(i=>!['key','scroll'].includes(i.type)).map(i=>({...i,price:sellPrice(i.id)})),use:id=>useItem(rpg,p,id),overflow:()=>({...rpg.overflow}),recover:()=>collectOverflow(rpg),state:()=>({player:{...p},visited:[...world.visited],quests:{...world.quests},inventory:inventory().map(({id,count})=>({id,count})),overflow:{...rpg.overflow},cache,mainQuest,defeated:[...defeated]})};
}
