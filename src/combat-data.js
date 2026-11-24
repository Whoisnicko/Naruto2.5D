// Timings in seconds; distances in world units. Balance lives here, not in the renderer.
export const COMBAT={
 dash:{cost:12,cooldown:.85,duration:.17,speed:19,invulnerable:.19},
 comboWindow:.72,
 kyubi:{duration:15,melee:1.4,technique:1.25,speed:1.15,damageTaken:.8,reach:[4.5,4.8,5.2],dealt:.55,received:1.8,threshold:100,lossInterval:2.8,lossRadius:5.8,forms:[{name:'Una cola',duration:15,melee:1.4,technique:1.25,speed:1.15,damageTaken:.8,reach:[4.5,4.8,5.2],targets:[1,1,1],width:.8},{name:'Dos colas',duration:17,melee:1.65,technique:1.45,speed:1.23,damageTaken:.72,reach:[5.2,5.6,6],targets:[1,1,2],width:1.15},{name:'Tres colas',duration:14,melee:1.95,technique:1.65,speed:1.3,damageTaken:.65,reach:[5.7,6.1,6.6],targets:[1,2,3],width:1.55}]},
 rasengan:{' ':{maxCharge:.9,minDistance:5.5,maxDistance:9,speed:22,extraCost:10,bonusDamage:.30,size:2.1,maxScale:1.75,contact:1.15,splash:2.0,recovery:.39,impact:.85},g:{maxCharge:1.25,minDistance:8,maxDistance:13,speed:24,extraCost:14,bonusDamage:.35,size:3.35,maxScale:1.65,contact:1.65,splash:3.0,recovery:.46,impact:1.1}},
 substitution:{cost:18,cd:7,duration:1.8,invulnerable:.38},
 skills:{
  j:{cost:0,cd:.35,range:2,damage:25,windup:.095,duration:.32,knock:2.4,freeze:.035,shake:.045},
  k:{cost:8,cd:.45,range:10,damage:24,windup:.11,duration:.32,knock:1.8,freeze:.025,shake:.025},
  l:{cost:25,cd:5,range:8,damage:32,windup:.23,duration:.55,knock:1.2,freeze:.025,shake:.025},
  g:{cost:32,cd:6,range:4.6,damage:84,windup:.42,duration:.88,knock:9,freeze:.09,shake:.23,breakGuard:true},
  f:{cost:22,cd:3.2,range:12,damage:34,windup:.25,duration:.55,knock:3.4,freeze:.05,shake:.08,breakGuard:true},
  ' ':{cost:20,cd:1.6,range:3.5,damage:60,windup:.26,duration:.65,knock:7,freeze:.075,shake:.18,breakGuard:true}
 },
 combos:[
  {name:'Puño',damage:25,range:2,windup:.095,duration:.32,knock:2.4,freeze:.035,shake:.045},
  {name:'Patada',damage:28,range:2.15,windup:.10,duration:.34,knock:3.2,freeze:.045,shake:.065},
  {name:'Remate',damage:38,breakGuard:true,range:2.35,windup:.14,duration:.43,knock:5,freeze:.065,shake:.12}
 ],
 criticalChance:.10,criticalMultiplier:1.5,
 enemy:{windup:.24,damage:9,range:1.5,cooldown:1.1},
 clone:{damage:18,knock:1.4,hp:22,markDuration:2.5,synergy:1.25}
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
