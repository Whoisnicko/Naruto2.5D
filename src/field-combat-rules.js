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
