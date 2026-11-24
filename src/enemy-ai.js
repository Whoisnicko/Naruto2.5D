import {directionToward} from './combat-data.js';
// Stable enemy IDs map to roles; save files keep the original five IDs and 70 HP.
export const ENEMY_ROLES=['brawler','thrower','guard','brawler','thrower'];
export const ROLES={
 brawler:{name:'Renegado cuerpo a cuerpo',speed:3.05,reach:1.6,windup:.32,cooldown:1.05,damage:11,color:[.93,.48,.28],radius:1.6},
 thrower:{name:'Lanzador de kunai',speed:2.65,reach:8,windup:.55,cooldown:1.8,damage:10,color:[.89,.69,.28],radius:.52},
 guard:{name:'Guardián',speed:1.85,reach:2.3,windup:.65,cooldown:2.3,damage:20,color:[.94,.29,.29],radius:2.5}
};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function roleFor(e){return ROLES[e.role||ENEMY_ROLES[e.id]]||ROLES.brawler;}
export function prepareEnemy(e){e.role=ENEMY_ROLES[e.id]||'brawler';e.ai='patrol';e.homeX=e.x;e.homeZ=e.z;e.patrolClock=e.id*1.7;e.guard=false;e.stagger=0;e.pendingAttack=0;e.intent=null;return e;}
export function targetFor(e,p,clones){
 let best=p,score=dist(e,p);
 for(const c of clones){if(c.life<=0||c.hp<=0)continue;const d=dist(e,c);if(d<=12&&d*.58<score){best=c;score=d*.58;}}
 return best;
}
export function damageModifier(e,source,skill){
 if(e.role!=='guard'||!e.guard||skill.breakGuard||e.stagger>0)return 1;
 const v=directionToward(source.x-e.x,source.z-e.z);return v.x*(e.dirX||0)+v.z*(e.dirZ??1)>.15?.35:1;
}
export function tickEnemy(e,p,clones,dt,move,fire,hit,blocked=()=>false){
 const r=roleFor(e);e.motion=false;e.attack=Math.max(0,(e.attack||0)-dt);e.stagger=Math.max(0,(e.stagger||0)-dt);
 if(e.stagger>0){e.ai='stagger';e.guard=false;e.intent=null;e.pendingAttack=0;return;}
 if(e.intent){
  e.guard=false;e.ai='windup';e.intent.left-=dt;e.pendingAttack=Math.max(0,e.intent.left);
  if(e.intent.left<=0){const intent=e.intent;e.intent=null;e.ai='recover';e.attack=r.cooldown;
   if(e.role==='thrower')fire(e,intent,r);
   else for(const target of [p,...clones])if((target.life??1)>0&&(target.hp??100)>0&&dist(target,e)<=r.radius)hit(target,r.damage,e);
  }return;
 }
 const target=targetFor(e,p,clones),d=dist(e,target),v=directionToward(target.x-e.x,target.z-e.z);
 if(d>13){
  e.guard=false;e.ai='patrol';e.patrolClock=(e.patrolClock||0)+dt*.45;
  const x=e.homeX+Math.cos(e.patrolClock)*1.4,z=e.homeZ+Math.sin(e.patrolClock)*1.4,dir=directionToward(x-e.x,z-e.z);
  if(Math.hypot(x-e.x,z-e.z)>.3){move(e,dir.x*dt*.85,dir.z*dt*.85);e.dirX=dir.x;e.dirZ=dir.z;e.motion=true;e.walk=(e.walk||0)+dt*4;}return;
 }
 e.dirX=v.x;e.dirZ=v.z;e.guard=e.role==='guard'&&e.attack>0;e.ai=e.guard?'guard':'chase';
 if(e.role==='thrower'&&d<3.5&&e.attack>0){e.ai='retreat';e.motion=true;move(e,-v.x*r.speed*dt,-v.z*r.speed*dt);e.walk=(e.walk||0)+dt*8;return;}
 if(d<=r.reach&&e.attack<=0){
  e.guard=false;e.ai='windup';e.intent={left:r.windup,total:r.windup,x:target.x,z:target.z,dx:v.x,dz:v.z};e.pendingAttack=r.windup;
  e.anim={k:e.role==='thrower'?'k':'j',left:r.windup+.18,total:r.windup+.18,windup:r.windup};return;
 }
 if(d>(e.role==='thrower'?6.4:r.reach*.8)){e.motion=true;move(e,v.x*r.speed*dt,v.z*r.speed*dt);e.walk=(e.walk||0)+dt*7;}
}
export function safeSubstitution(p,source,blocked){
 const v=directionToward(p.x-source.x,p.z-source.z,p.dirX,p.dirZ);
 for(const [x,z] of [[p.x+v.x*2.7,p.z+v.z*2.7],[p.x-v.z*2.7,p.z+v.x*2.7],[p.x+v.z*2.7,p.z-v.x*2.7]]){
  if(blocked(x,z))continue;let clear=true;for(let i=1;i<=14;i++)if(blocked(p.x+(x-p.x)*i/14,p.z+(z-p.z)*i/14)){clear=false;break;}if(clear)return {x,z};
 }return {x:p.x,z:p.z};
}
