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
export function cloneSpawnPoints(actor,current,count,blocked,existing=[]){
 const points=[];for(let i=current;i<count;i++){const angle=i/count*Math.PI*2+Math.PI/4;let spot=null;
 for(const radius of [1.45,1.05,.72]){for(const offset of [0,.45,-.45,.9,-.9,Math.PI]){const a=angle+offset,p={x:actor.x+Math.cos(a)*radius,z:actor.z+Math.sin(a)*radius};if(!blocked(p.x,p.z)&&[...existing,...points].every(q=>distance(q,p)>.48)){spot=p;break;}}if(spot)break;}
 if(spot)points.push(spot);else if(!blocked(actor.x,actor.z))points.push({x:actor.x,z:actor.z});}return points;
}
// Stable object identity avoids merging targets with absent or reused IDs.
export function projectileContacts(shot,targets,radius,visible=()=>true){return targets.filter(e=>e.hp>0&&!shot.hits?.has(e)&&distance(shot,e)<=radius&&visible(shot,e)).sort((a,b)=>distance(shot,a)-distance(shot,b));}
export function cloneTarget(clone,targets,visible,range=14){return targets.filter(e=>e.hp>0&&distance(clone,e)<=range&&visible(clone,e)).sort((a,b)=>distance(clone,a)-distance(clone,b))[0]||null;}
// A deliberate technique request may wait for the current short recovery, not a full cooldown.
export function techniqueBuffer(k,base,recovery=0){return k==='f'||k==='l'?Math.max(base,Math.min(.85,Math.max(0,recovery)+.08)):base;}

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
export function steerRasengan(actor,action,targets,visible,dt){const limit=action.remaining+1.2,valid=e=>e.hp>0&&distance(actor,e)<=limit&&visible(actor,e);let target=targets.includes(action.targetRef)&&valid(action.targetRef)?action.targetRef:null;if(!target){target=targets.filter(e=>valid(e)&&((e.x-actor.x)*action.dir.x+(e.z-actor.z)*action.dir.z>=distance(actor,e)*-.15)).sort((a,b)=>distance(actor,a)-distance(actor,b))[0];}if(!target)return action.dir;action.targetRef=target;const from=Math.atan2(action.dir.z,action.dir.x),to=Math.atan2(target.z-actor.z,target.x-actor.x),delta=Math.atan2(Math.sin(to-from),Math.cos(to-from)),angle=from+Math.max(-dt*12,Math.min(dt*12,delta));return {x:Math.cos(angle),z:Math.sin(angle)};}
export function stressPositions(at,count,blocked){const out=[];for(let ring=0;ring<12&&out.length<count;ring++){const radius=3+ring*1.4,n=Math.max(12,Math.floor(radius*5));for(let i=0;i<n&&out.length<count;i++){const a=i/n*Math.PI*2+ring*.37,x=at.x+Math.cos(a)*radius,z=at.y+Math.sin(a)*radius;if(!blocked(x,z,.48)&&out.every(p=>Math.hypot(p.x-x,p.z-z)>1.0))out.push({x,z});}}return out;}

// Shared indicator: match the cone radius and Kyūbi lateral limit.
export function meleeAreaOutline(actor,skill,dir,segments=20){
 const range=Math.max(0,skill.range||0),half=Math.acos(COMBAT.hades.meleeDot),angle=Math.atan2(dir.z,dir.x),points=[{x:actor.x,z:actor.z}];
 for(let i=0;i<=segments;i++){const d=-half+2*half*i/segments,s=Math.abs(Math.sin(d)),limit=skill.kyubi&&s>.0001?Math.min(range,(skill.clawWidth||.8)/s):range;points.push({x:actor.x+Math.cos(angle+d)*limit,z:actor.z+Math.sin(angle+d)*limit});}
 points.push({x:actor.x,z:actor.z});return points;
}
export function meleeAimDuringWindup(actor,action,targets,visible){
 const range=action.s.range+COMBAT.hades.assistReach,prior=action.aimTarget;
 const target=prior&&targets.includes(prior)&&prior.hp>0&&distance(actor,prior)<=range&&visible(actor,prior)?prior:responsiveMeleeTarget(actor,targets,action.dir,range,visible);
 if(target){action.aimTarget=target;action.dir=directionToward(target.x-actor.x,target.z-actor.z,action.dir.x,action.dir.z);}
 return target;
}
