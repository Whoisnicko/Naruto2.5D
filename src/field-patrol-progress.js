// Separate optional world record; original mission IDs and rewards are not modified.
import {REGIONAL_ROSTER,ROSTER_RULES,rosterRole} from './field-enemy-roster.js';
import {regionBlocked} from './konoha-regions.js';
const definitions=new Map();
for(const [region,spec] of Object.entries(REGIONAL_ROSTER)){
 for(const group of spec.groups)for(const member of group.members)definitions.set(member.id,{region,hp:rosterRole(member.role).hp});
 if(spec.groups.some(g=>g.members.some(m=>m.role==='summoner')))for(let i=0;i<ROSTER_RULES.maxSummons;i++)definitions.set(spec.reinforcementId+i,{region,hp:ROSTER_RULES.reinforcementHP,reinforcement:true,first:spec.reinforcementId});
}
export function validatePatrolProgress(raw=[]){
 if(!Array.isArray(raw)||raw.length>definitions.size)throw Error('Invalid patrol progress');
 const ids=new Set(),result=[];
 for(const e of raw){
  const spec=definitions.get(e?.id);
  if(!spec||ids.has(e.id)||!Number.isFinite(e.hp)||e.hp<0||e.hp>spec.hp)throw Error('Invalid patrol record');
  ids.add(e.id);
  if(spec.reinforcement){
   if(!Number.isFinite(e.x)||!Number.isFinite(e.z)||regionBlocked(spec.region,e.x,e.z,.65))throw Error('Invalid reinforcement position');
   result.push({id:e.id,hp:e.hp,x:e.x,z:e.z});
  }else result.push({id:e.id,hp:e.hp});
 }
 for(const e of result){const s=definitions.get(e.id);if(s.reinforcement&&e.id>s.first&&!ids.has(e.id-1))throw Error('Invalid reinforcement sequence');}
 return result.sort((a,b)=>a.id-b.id);
}
export function mergePatrolProgress(previous,next,unlocked){
 const a=validatePatrolProgress(previous),b=validatePatrolProgress(next===undefined?a:next);
 if(!unlocked&&b.length)throw Error('Patrols not unlocked');
 for(const e of a){const n=b.find(x=>x.id===e.id);if(!n||e.hp===0&&n.hp!==0||e.x!==undefined&&(n.x!==e.x||n.z!==e.z))throw Error('Patrol progress cannot be reversed');}
 return b;
}
