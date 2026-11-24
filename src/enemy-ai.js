import {directionToward} from './combat-data.js';
// Stable enemy IDs map to roles; save files keep the original five IDs and 70 HP.
export const ENEMY_ROLES=['brawler','thrower','guard','brawler','thrower'];
export const ROLES={
 brawler:{name:'Rogue brawler',speed:3.05,reach:1.6,windup:.32,cooldown:1.05,damage:11,color:[.93,.48,.28],radius:1.6},
 thrower:{name:'Kunai thrower',speed:2.65,reach:8,windup:.55,cooldown:1.8,damage:10,color:[.89,.69,.28],radius:.52},
 guard:{name:'Guardian',speed:1.85,reach:2.3,windup:.65,cooldown:2.3,damage:20,color:[.94,.29,.29],radius:2.5},
 striker:{name:'Taijutsu specialist',speed:4.1,reach:2.2,windup:.27,cooldown:1.15,damage:14,color:[1,.47,.28],radius:2.3,tint:0xffb484},
 caster:{name:'Elemental specialist',speed:2.8,reach:9,windup:.72,cooldown:2.6,damage:19,color:[.99,.45,.19],radius:.65,projectile:'fire',tint:0xff926b},
 assassin:{name:'Assassin',speed:4.5,reach:1.9,windup:.33,cooldown:1.65,damage:19,color:[.65,.43,.94],radius:2,tint:0xb7a0ff},
 defender:{name:'Defensive ninja',speed:2.35,reach:2.6,windup:.55,cooldown:1.8,damage:23,color:[.91,.74,.35],radius:2.7,tint:0xe6cf83},
 medic:{name:'Medical ninja',speed:2.7,reach:5.5,windup:.7,cooldown:3.8,damage:8,color:[.36,.89,.57],radius:.6,projectile:'kunai',tint:0x8de7a7},
 summoner:{name:'Summoner',speed:2.5,reach:7,windup:.9,cooldown:5.5,damage:12,color:[.72,.46,.87],radius:.7,projectile:'wind',tint:0xe8a9f5},
 elite:{name:'Rogue Jonin',speed:3.7,reach:7,windup:.65,cooldown:2.15,damage:24,color:[1,.22,.27],radius:2.7,projectile:'lightning',tint:0xff7c81},
 reinforcement:{name:'Enemy clone',speed:3.4,reach:1.65,windup:.35,cooldown:1.3,damage:8,color:[.75,.58,.9],radius:1.7,tint:0xc8b2ef}
};
// Repeatable patrols have separate IDs and never affect campaign objectives.
export const PATROL_SPAWNS=[
 [200,36,15,'striker',82],[201,39,17,'medic',65],[202,43,14,'defender',105],
 [203,35,-16,'caster',78],[204,39,-18,'assassin',74],[205,43,-15,'summoner',84],
 [206,19,22,'striker',82],[207,23,25,'assassin',74],[208,27,23,'elite',125],
 [209,73,10,'caster',88],[210,78,11,'medic',75],[211,83,10,'defender',115],
 [212,74,-10,'assassin',84],[213,79,-10,'summoner',94],[214,84,-10,'elite',135]
].map(([id,x,z,role,hp])=>({id,x,z,role,hp,regional:x>=50}));
export const RESPAWN_SECONDS=60;
export const isRanged=e=>e.role==='thrower'||!!roleFor(e).projectile;
export const isDefensive=e=>e.role==='guard'||e.role==='defender';
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function roleFor(e){return ROLES[e.role||ENEMY_ROLES[e.id]]||ROLES.brawler;}
export function prepareEnemy(e){e.role=e.role||ENEMY_ROLES[e.id]||'brawler';e.ai='patrol';e.homeX=e.x;e.homeZ=e.z;e.patrolClock=e.id*1.7;e.guard=false;e.stagger=0;e.pendingAttack=0;e.intent=null;return e;}
export function targetFor(e,p,clones){
 let best=p,score=dist(e,p);
 for(const c of clones){if(c.life<=0||c.hp<=0)continue;const d=dist(e,c);if(d<=12&&d*.58<score){best=c;score=d*.58;}}
 return best;
}
export function damageModifier(e,source,skill){
 if(!isDefensive(e)||!e.guard||skill.breakGuard||e.stagger>0)return 1;
 const v=directionToward(source.x-e.x,source.z-e.z);return v.x*(e.dirX||0)+v.z*(e.dirZ??1)>.15?.35:1;
}
export function tickEnemy(e,p,clones,dt,move,fire,hit,blocked=()=>false,team={}){
 const r=roleFor(e);e.motion=false;e.attack=Math.max(0,(e.attack||0)-dt);e.stagger=Math.max(0,(e.stagger||0)-dt);
 if(e.stagger>0){e.ai='stagger';e.guard=false;e.intent=null;e.pendingAttack=0;return;}
 if(e.intent){
  e.guard=false;e.ai='windup';e.intent.left-=dt;e.pendingAttack=Math.max(0,e.intent.left);
  if(e.intent.left<=0){const intent=e.intent;e.intent=null;e.ai='recover';e.attack=r.cooldown;
   if(intent.mode==='heal'){team.heal?.(e,intent);}
   else if(intent.mode==='summon'){team.summon?.(e);}
   else if(intent.mode==='ranged'||e.role==='thrower')fire(e,intent,r);
   else for(const target of [p,...clones])if((target.life??1)>0&&(target.hp??100)>0&&dist(target,e)<=r.radius)hit(target,r.damage,e);
  }return;
 }
 const target=targetFor(e,p,clones),d=dist(e,target),v=directionToward(target.x-e.x,target.z-e.z);
 const advanced=e.id>=200;const allies=advanced?(team.allies||[]).filter(a=>a!==e&&a.hp>0&&dist(a,e)<10):[];
 if(advanced&&d<13&&e.attack<=0){const wounded=allies.filter(a=>a.hp<(a.maxHP||70)*.72&&dist(a,e)<7).sort((a,b)=>a.hp/(a.maxHP||70)-b.hp/(b.maxHP||70))[0];let mode=e.role==='medic'&&wounded?'heal':e.role==='summoner'&&team.canSummon?.(e)?'summon':null;if(mode){e.guard=false;e.ai='windup';e.intent={mode,targetId:wounded?.id,left:r.windup,total:r.windup,x:wounded?.x??e.x,z:wounded?.z??e.z,dx:v.x,dz:v.z};e.pendingAttack=r.windup;e.anim={k:'l',left:r.windup+.18,total:r.windup+.18,windup:r.windup};return;}}
 if(advanced&&e.role==='assassin'&&d<5&&d>1.3&&(e.attack>0||p.pending&&target===p)){e.ai='flank';const sign=e.id%2?1:-1;move(e,(v.x*.35-v.z*sign)*r.speed*dt,(v.z*.35+v.x*sign)*r.speed*dt);e.dirX=v.x;e.dirZ=v.z;e.motion=true;e.walk=(e.walk||0)+dt*10;return;}
 if(d>13||(advanced&&Math.hypot(e.x-e.homeX,e.z-e.homeZ)>17)){
  e.guard=false;e.ai='patrol';e.patrolClock=(e.patrolClock||0)+dt*.45;
  const x=e.homeX+Math.cos(e.patrolClock)*1.4,z=e.homeZ+Math.sin(e.patrolClock)*1.4,dir=directionToward(x-e.x,z-e.z);
  if(Math.hypot(x-e.x,z-e.z)>.3){move(e,dir.x*dt*.85,dir.z*dt*.85);e.dirX=dir.x;e.dirZ=dir.z;e.motion=true;e.walk=(e.walk||0)+dt*4;}return;
 }
 e.dirX=v.x;e.dirZ=v.z;e.guard=isDefensive(e)&&e.attack>0;e.ai=e.guard?'guard':'chase';
 if(isRanged(e)&&d<3.5&&e.attack>0){e.ai='retreat';e.motion=true;move(e,-v.x*r.speed*dt,-v.z*r.speed*dt);e.walk=(e.walk||0)+dt*8;return;}
 if(d<=r.reach&&e.attack<=0&&(!advanced||!isRanged(e)||!Array.from({length:8},(_,i)=>i+1).some(i=>blocked(e.x+(target.x-e.x)*i/9,e.z+(target.z-e.z)*i/9,.1)))&&(!advanced||allies.filter(a=>a.intent&&a.intent.mode==='melee').length<2||(isRanged(e)&&!(e.role==='elite'&&d<2.6)))){
  e.guard=false;e.ai='windup';const ranged=isRanged(e)&&!(e.role==='elite'&&d<2.6);e.intent={mode:ranged?'ranged':'melee',left:r.windup,total:r.windup,x:target.x,z:target.z,dx:v.x,dz:v.z};e.pendingAttack=r.windup;
  e.anim={k:ranged?'k':'j',left:r.windup+.18,total:r.windup+.18,windup:r.windup};return;
 }
 if(d>(isRanged(e)?(e.role==='thrower'?6.4:r.reach*.75):r.reach*.8)){e.motion=true;move(e,v.x*r.speed*dt,v.z*r.speed*dt);e.walk=(e.walk||0)+dt*7;}
}
export function safeSubstitution(p,source,blocked){
 const v=directionToward(p.x-source.x,p.z-source.z,p.dirX,p.dirZ);
 for(const [x,z] of [[p.x+v.x*2.7,p.z+v.z*2.7],[p.x-v.z*2.7,p.z+v.x*2.7],[p.x+v.z*2.7,p.z-v.x*2.7]]){
  if(blocked(x,z))continue;let clear=true;for(let i=1;i<=14;i++)if(blocked(p.x+(x-p.x)*i/14,p.z+(z-p.z)*i/14)){clear=false;break;}if(clear)return {x,z};
 }return {x:p.x,z:p.z};
}
