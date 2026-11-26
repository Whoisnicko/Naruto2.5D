import {mergePatrolProgress} from './field-patrol-progress.js';
// Campaign owns all durable state. The child receives a detached transaction.
const copy=v=>JSON.parse(JSON.stringify(v));
export function createCampaignTransaction(snapshot,revision,validate){
 const base=copy(snapshot);let closed=false,acquired=false;
 return {acquire(){if(closed||acquired)return null;acquired=true;return copy(base)},commit(patch,currentRevision){
  if(closed||!acquired||currentRevision!==revision||!patch||!patch.player||!patch.rpg||!patch.world)throw Error('La sesión de campaña cambió.');
  const p=patch.player;if(!(p.hp>0))throw Error('Vida inválida.');
  for(const key of ['opened','defeated'])if(!Array.isArray(patch.world[key])||base.world[key].some(id=>!patch.world[key].includes(id)))throw Error('World progress cannot be reversed.');
  const candidate={...copy(base),p:{...base.p,hp:p.hp,chakra:p.chakra,xp:p.xp,coins:p.coins},rpg:copy(patch.rpg),world:{...base.world,quests:copy(patch.world.quests),visited:copy(patch.world.visited),clock:patch.world.clock,opened:copy(patch.world.opened),defeated:copy(patch.world.defeated)}};
  // Five durable original IDs; only a new, explicit training round may resurrect them.
  const round=patch.rpg.round,oldRound=base.rpg.round;
  if(!Number.isSafeInteger(round)||round<oldRound||round>oldRound+1)throw Error('Invalid training round.');
  if(patch.combat){const q=patch.combat.quest,ids=patch.combat.defeated,old=base.enemies.filter(e=>!e.hp).map(e=>e.id),fresh=round===oldRound+1;
   if(!Array.isArray(ids)||new Set(ids).size!==ids.length||ids.some(id=>!base.enemies.some(e=>e.id===id)))throw Error('Progreso de enemigos inválido.');
   if(fresh){if(base.quest!==3||q!==3||old.length!==base.enemies.length)throw Error('Complete the previous training round.');}
   else if(old.some(id=>!ids.includes(id)))throw Error('Progreso de enemigos inválido.');
   if(base.quest===3){if(q!==3||!fresh&&oldRound===0&&ids.length!==old.length)throw Error('Misión ya completada.');}
   else if(base.quest===2){if(q!==2||ids.length!==old.length||fresh)throw Error('Misión ya completada.');}
   else{const expected=base.quest===0&&q===0?0:ids.length===base.enemies.length?2:1;if(q!==expected||q===0&&ids.length!==old.length||fresh)throw Error('Progreso de misión inválido.');}
   candidate.quest=q;candidate.enemies=base.enemies.map(e=>({...e,hp:ids.includes(e.id)?0:fresh?70:e.hp}));
  }else if(round!==oldRound)throw Error('Missing training progress.');
  candidate.world.patrols=mergePatrolProgress(base.world.patrols,patch.world.patrols,base.quest===3);
  const valid=validate(candidate);closed=true;return valid;
 },discard(){closed=true},get closed(){return closed}};
}
