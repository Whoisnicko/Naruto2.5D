// Map-independent combat rules ported from the classic campaign.
// All positions use x/z. The caller supplies collision and live targets.
import {COMBAT,directionToward} from './combat-data.js';
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function attackCone(actor,targets,skill,dir,visible){
 return targets.filter(e=>e.hp>0&&distance(actor,e)<skill.range&&((e.x-actor.x)*dir.x+(e.z-actor.z)*dir.z>=distance(actor,e)*COMBAT.hades.meleeDot||distance(actor,e)<.001)&&visible(actor,e)).sort((a,b)=>distance(actor,a)-distance(actor,b));
}
export function rasenganCharge(held,windup,spec,chakra){
 const q=Math.max(0,Math.min(1,(held-windup)/Math.max(.001,spec.maxCharge-windup),Math.max(0,chakra)/spec.extraCost));
 return {q,scale:1+(spec.maxScale-1)*q,distance:spec.minDistance+(spec.maxDistance-spec.minDistance)*q,extra:spec.extraCost*q};
}
export function rasenganContact(actor,targets,dir,spec,scale,visible){
 return targets.filter(e=>e.hp>0&&distance(actor,e)<=spec.contact*(.85+.15*scale)&&((e.x-actor.x)*dir.x+(e.z-actor.z)*dir.z>=-.3||distance(actor,e)<.6)&&visible(actor,e)).sort((a,b)=>distance(actor,a)-distance(actor,b))[0];
}
export function rasenganSplash(actor,targets,primary,center,spec,scale,visible){
 return [...new Set(targets)].filter(e=>e.hp>0&&(e===primary||distance(e,center)<spec.splash*scale)&&visible(actor,e)).sort((a,b)=>distance(a,center)-distance(b,center)).slice(0,5);
}
export function cloneSpawnPoints(actor,current,count,blocked){
 const points=[];for(let i=current;i<count;i++){const angle=i/count*Math.PI*2+Math.PI/4,x=actor.x+Math.cos(angle)*1.45,z=actor.z+Math.sin(angle)*1.45;points.push(blocked(x,z)?{x:actor.x,z:actor.z}:{x,z});}return points;
}
export function techniqueTargets(actor,targets,skill,visible){
 return targets.filter(e=>e.hp>0&&distance(actor,e)<skill.range&&visible(actor,e)).sort((a,b)=>distance(actor,a)-distance(actor,b)).slice(0,skill.targets||1);
}

// A close, visible target may be behind the actor; explicit directional input wins
// when a valid target is in front. No long-range magnetism or wall bypass.
export function responsiveMeleeTarget(actor,targets,dir,range,visible){
 const front=attackCone(actor,targets,{range},dir,visible)[0];if(front)return front;
 const radius=Math.min(range,2.35);return targets.filter(e=>e.hp>0&&distance(actor,e)<=radius&&visible(actor,e)).sort((a,b)=>distance(actor,a)-distance(actor,b))[0]||null;
}

// Bounded homing: only visible living targets inside the remaining travel budget.
// Rotate progressively; collision checks remain with the caller.
export function steerRasengan(actor,action,targets,visible,dt){const limit=action.remaining+1.2,valid=e=>e.hp>0&&distance(actor,e)<=limit&&visible(actor,e);let target=targets.find(e=>e.id===action.targetId&&valid(e));if(!target){target=targets.filter(e=>valid(e)&&((e.x-actor.x)*action.dir.x+(e.z-actor.z)*action.dir.z>=distance(actor,e)*-.15)).sort((a,b)=>distance(actor,a)-distance(actor,b))[0];}if(!target)return action.dir;action.targetId=target.id;const from=Math.atan2(action.dir.z,action.dir.x),to=Math.atan2(target.z-actor.z,target.x-actor.x),delta=Math.atan2(Math.sin(to-from),Math.cos(to-from)),angle=from+Math.max(-dt*12,Math.min(dt*12,delta));return {x:Math.cos(angle),z:Math.sin(angle)};}
export function stressPositions(at,count,blocked){const out=[];for(let ring=0;ring<12&&out.length<count;ring++){const radius=3+ring*1.4,n=Math.max(12,Math.floor(radius*5));for(let i=0;i<n&&out.length<count;i++){const a=i/n*Math.PI*2+ring*.37,x=at.x+Math.cos(a)*radius,z=at.y+Math.sin(a)*radius;if(!blocked(x,z,.48)&&out.every(p=>Math.hypot(p.x-x,p.z-z)>1.0))out.push({x,z});}}return out;}
