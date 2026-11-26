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
