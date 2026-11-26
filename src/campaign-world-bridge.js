// Campaign owns all durable state. The child receives a detached transaction.
const copy=v=>JSON.parse(JSON.stringify(v));
export function createCampaignTransaction(snapshot,revision,validate){
 const base=copy(snapshot);let closed=false,acquired=false;
 return {acquire(){if(closed||acquired)return null;acquired=true;return copy(base)},commit(patch,currentRevision){
  if(closed||!acquired||currentRevision!==revision||!patch||!patch.player||!patch.rpg||!patch.world)throw Error('La sesión de campaña cambió.');
  const p=patch.player;if(!(p.hp>0))throw Error('Vida inválida.');
  for(const key of ['opened','defeated'])if(!Array.isArray(patch.world[key])||base.world[key].some(id=>!patch.world[key].includes(id)))throw Error('World progress cannot be reversed.');
  const candidate={...copy(base),p:{...base.p,hp:p.hp,chakra:p.chakra,xp:p.xp,coins:p.coins},rpg:copy(patch.rpg),world:{...base.world,quests:copy(patch.world.quests),visited:copy(patch.world.visited),clock:patch.world.clock,opened:copy(patch.world.opened),defeated:copy(patch.world.defeated)}};
  // Accept only the five original enemy IDs, never reset an already defeated enemy.
  if(patch.combat){const q=patch.combat.quest,ids=patch.combat.defeated,old=base.enemies.filter(e=>!e.hp).map(e=>e.id);if(!Array.isArray(ids)||new Set(ids).size!==ids.length||ids.some(id=>!base.enemies.some(e=>e.id===id))||old.some(id=>!ids.includes(id)))throw Error('Progreso de enemigos inválido.');if(base.quest>=2){if(q!==base.quest||ids.length!==old.length)throw Error('Misión ya completada.')}else{const expected=base.quest===0&&q===0?0:ids.length===base.enemies.length?2:1;if(q!==expected||q===0&&ids.length!==old.length)throw Error('Progreso de misión inválido.');candidate.quest=q;candidate.enemies=base.enemies.map(e=>({...e,hp:ids.includes(e.id)?0:e.hp}));}}
  const valid=validate(candidate);closed=true;return valid;
 },discard(){closed=true},get closed(){return closed}};
}
