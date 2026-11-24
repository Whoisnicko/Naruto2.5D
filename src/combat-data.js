// Timings in seconds; distances in world units. Balance lives here, not in the renderer.
export const COMBAT={
 dash:{resource:'stamina',cost:12,cooldown:.85,duration:.17,speed:19,invulnerable:.28},
 comboWindow:.72,
 fluid:{buffer:.22,dashBuffer:.16,acceleration:24,recoverySpeed:.65},
 defense:{max:100,holdDrain:6,regen:22,regenDelay:.65,blockBase:8,blockDamage:1.15,frontDot:.2,breakTime:.85,moveSpeed:.55,chargeWindup:.25,chargeBonus:24,enemyAimLock:.14},
 hades:{assistDot:.70710678,meleeDot:.42,assistReach:.45,meleeStep:.38,chainTail:.09,dashWindup:.055,dashRecovery:.24,dashDamage:.85},
 kyubi:{name:'Three Tails',duration:14,regenPerSecond:3,melee:1.95,technique:1.65,speed:1.3,damageTaken:.65,reach:[5.7,6.1,6.6],targets:[1,2,3],width:1.55,dealt:.55,received:1.8,threshold:100,lossInterval:2.8,lossRadius:5.8},
 kyubiRasenganBlast:{fullCharge:.999,radius:6.5,giantRadius:8.5,inner:.70,edge:.40,knockScale:.45,life:.82},
 rasengan:{' ':{maxCharge:.9,minDistance:5.5,maxDistance:9,speed:22,extraCost:10,bonusDamage:.30,size:2.1,maxScale:1.75,contact:1.15,splash:2.0,recovery:.39,impact:.85},g:{maxCharge:1.25,minDistance:8,maxDistance:13,speed:24,extraCost:14,bonusDamage:.35,size:3.35,maxScale:1.65,contact:1.65,splash:3.0,recovery:.46,impact:1.1}},
 substitution:{resource:'stamina',cost:18,cd:7,duration:1.8,invulnerable:.38},
 skills:{
  j:{resource:'stamina',cost:5,cd:.35,range:2,damage:25,windup:.095,duration:.32,knock:2.4,freeze:.035,shake:.045},
  k:{cost:8,cd:.45,range:10,damage:24,windup:.11,duration:.32,knock:1.8,freeze:.025,shake:.025},
  l:{cost:25,cd:5,range:8,damage:32,windup:.23,duration:.55,knock:1.2,freeze:.025,shake:.025},
  g:{cost:32,cd:6,range:4.6,damage:84,windup:.42,duration:.88,knock:9,freeze:.09,shake:.23,breakGuard:true},
  f:{cost:22,cd:3.2,range:12,damage:34,windup:.25,duration:.55,knock:3.4,freeze:.05,shake:.08,breakGuard:true},
  ' ':{cost:20,cd:1.6,range:3.5,damage:60,windup:.26,duration:.65,knock:7,freeze:.075,shake:.18,breakGuard:true}
 },
 combos:[
  {name:'Punch',damage:25,range:2,windup:.095,duration:.32,knock:2.4,freeze:.035,shake:.045},
  {name:'Kick',damage:28,range:2.15,windup:.10,duration:.34,knock:3.2,freeze:.045,shake:.065},
  {name:'Finisher',damage:38,breakGuard:true,range:2.35,windup:.14,duration:.43,knock:5,freeze:.065,shake:.12}
 ],
 criticalChance:.10,criticalMultiplier:1.5,
 enemy:{windup:.24,damage:9,range:1.5,cooldown:1.1},
 clone:{damage:18,knock:1.4,hp:1,duration:5,markDuration:2.5,synergy:1.25}
};
export function stepMotion(actor,dx,dz,blocked){
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));
 for(let i=0;i<steps;i++){
  if(!blocked(actor.x+dx/steps,actor.z))actor.x+=dx/steps;
  if(!blocked(actor.x,actor.z+dz/steps))actor.z+=dz/steps;
 }
}
export function directionToward(x,z,fx=1,fz=0){
 const d=Math.hypot(x,z);if(d>.0001)return {x:x/d,z:z/d};
 const f=Math.hypot(fx,fz)||1;return {x:fx/f,z:fz/f};
}

// Prefer enemies aligned with intent, not merely the closest enemy. Never aim through a wall.
export function chooseAttackTarget(actor,targets,dir,range,dot=COMBAT.hades.assistDot,visible=()=>true){
 let best=null,bestScore=Infinity;for(const e of targets){if(!(e.hp>0))continue;const x=e.x-actor.x,z=e.z-actor.z,d=Math.hypot(x,z);if(d>range)continue;const alignment=d<.001?1:(x*dir.x+z*dir.z)/d;if(alignment<dot||!visible(actor,e))continue;const score=d+(1-alignment)*range*.65;if(score<bestScore){bestScore=score;best=e;}}return best;
}

// Default chakra for techniques; stamina actions share the guard recovery delay.
export function actionResource(skill){return skill.resource==='stamina'?'stamina':'chakra';}
export function canPayAction(actor,skill){return (actor[actionResource(skill)]??0)>=skill.cost;}
export function payAction(actor,skill){if(!canPayAction(actor,skill))return false;const r=actionResource(skill);actor[r]-=skill.cost;if(r==='stamina')actor.staminaDelay=COMBAT.defense.regenDelay;return true;}
