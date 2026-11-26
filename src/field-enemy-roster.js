// Temporary advanced enemy encounter definitions. Never persisted or used by campaign.
export const ENEMY_ROSTER=[
 {role:'striker',hp:82,pose:'attack'},
 {role:'assassin',hp:74,pose:'dashStrike'},
 {role:'defender',hp:105,pose:'guard'},
 {role:'caster',hp:78,pose:'release'},
 {role:'medic',hp:65,pose:'seal'},
 {role:'summoner',hp:84,pose:'seal'},
 {role:'elite',hp:125,pose:'thrust'}
];
export const ROSTER_RULES=Object.freeze({maxSummons:2,reinforcementHP:30,healAmount:18,healRange:7,firstId:600,reinforcementId:620});
export const rosterRole=role=>ENEMY_ROSTER.find(r=>r.role===role);
export function rosterPositions(at,count,blocked){
 if(!Number.isFinite(at?.x)||!Number.isFinite(at?.y)||count<1||count>ENEMY_ROSTER.length)return [];
 const out=[];for(const radius of [7,9,11]){for(let i=0;i<14&&out.length<count;i++){const a=i*Math.PI/7+radius*.17,x=at.x+Math.cos(a)*radius,z=at.y+Math.sin(a)*radius;if(!blocked(x,z,.65)&&out.every(o=>Math.hypot(o.x-x,o.z-z)>=3))out.push({x,z});}if(out.length===count)break;}return out;
}
export function reinforcementPosition(e,allies,p,blocked){
 for(let i=0;i<8;i++){const a=i*Math.PI/4,x=e.x+Math.cos(a)*2,z=e.z+Math.sin(a)*2;if(!blocked(x,z,.65)&&Math.hypot(p.x-x,p.z-z)>1.5&&allies.every(o=>o.hp<=0||Math.hypot(o.x-x,o.z-z)>1.2))return {x,z};}return null;
}

// Fixed regional groups for the opt-in temporary exploration sandbox.
// The map, campaign enemy IDs and campaign mission state remain untouched.
export const REGIONAL_ROSTER=Object.freeze({
 forest:{reinforcementId:760,groups:[
  {id:'western-patrol',members:[{id:700,role:'striker',x:20,z:29},{id:701,role:'assassin',x:23,z:31}]},
  {id:'clearing-patrol',members:[{id:702,role:'defender',x:49,z:30},{id:703,role:'caster',x:52,z:33}]}
 ]},
 outpost:{reinforcementId:764,groups:[
  {id:'western-guard',members:[{id:710,role:'defender',x:19,z:29},{id:711,role:'medic',x:22,z:32}]},
  {id:'frontier-elite',members:[{id:712,role:'elite',x:47,z:29},{id:713,role:'summoner',x:50,z:32},{id:714,role:'caster',x:53,z:29}]}
 ]}
});
export function regionalRosterMembers(region,blocked){
 const spec=REGIONAL_ROSTER[region];if(!spec)return [];
 const points=[];for(const group of spec.groups)for(const e of group.members){
  if(blocked(e.x,e.z,.65)||points.some(p=>Math.hypot(p.x-e.x,p.z-e.z)<1.2))continue;
  const role=rosterRole(e.role);if(role)points.push({...e,group:group.id,hp:role.hp,maxHP:role.hp});
 }return points;
}
