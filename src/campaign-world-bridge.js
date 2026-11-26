// Campaign owns all durable state. The child receives a detached transaction.
const copy=v=>JSON.parse(JSON.stringify(v));
export function createCampaignTransaction(snapshot,revision,validate){
 const base=copy(snapshot);let closed=false,acquired=false;
 return {acquire(){if(closed||acquired)return null;acquired=true;return copy(base)},commit(patch,currentRevision){
  if(closed||!acquired||currentRevision!==revision||!patch||!patch.player||!patch.rpg||!patch.world)throw Error('La sesión de campaña cambió.');
  const p=patch.player;if(!(p.hp>0))throw Error('Vida inválida.');
  const candidate={...copy(base),p:{...base.p,hp:p.hp,chakra:p.chakra,xp:p.xp,coins:p.coins},rpg:copy(patch.rpg),world:{...base.world,quests:copy(patch.world.quests),visited:copy(patch.world.visited),clock:patch.world.clock}};
  const valid=validate(candidate);closed=true;return valid;
 },discard(){closed=true},get closed(){return closed}};
}
