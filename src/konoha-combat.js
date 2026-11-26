import {COMBAT,stepMotion,directionToward,chooseAttackTarget,canPayAction,payAction} from './combat-data.js';
import {characterFor,characterSkill,skillLabel} from './character-data.js';
import {prepareEnemy,tickEnemy,damageModifier,roleFor} from './enemy-ai.js';
import {statsFor,advancedUnlocked,skillModifiers,shadowCloneLimit} from './rpg-data.js';

// Original enemy IDs; only coordinates change. Shared mechanics use the original x/z convention.
export const FOREST_ROGUES=[[0,30,30],[1,36,34],[2,46,30],[3,54,27],[4,62,31]];
export function createForestCombat({resources,rpg,hero,enabled,enemyHP=[],onKill=()=>{},blocked,random=Math.random}){
 const p=resources, enemies=FOREST_ROGUES.map(([id,x,z])=>prepareEnemy({id,x,z,hp:enemyHP[id]??70,maxHP:70,dirX:0,dirZ:1,attack:0}));let time=0,serial=0,action=null,dash=null,charge=null,clones=[],shots=[],fx=[],combo=0,comboAt=-99,invuln=0,sub=0,focus=0,guardBuff=0,staminaDelay=0,guardBreak=0,charging=0,guard=false,notice='',noticeUntil=0,wasActive=false;
 const cd={},D=COMBAT.defense; p.stamina=D.max;
 const alive=()=>enemies.filter(e=>e.hp>0),dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),dec=(n,dt)=>Math.max(0,n-dt),stats=()=>statsFor(rpg,hero()),say=s=>{notice=s;noticeUntil=time+2.4};
 const move=(a,dx,dz)=>stepMotion(a,dx,dz,(x,z)=>blocked(x,z));
 const visible=(a,b)=>{const n=Math.max(1,Math.ceil(dist(a,b)/.25));for(let i=1;i<n;i++)if(blocked(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n,.08))return false;return true};
 const emit=(kind,x,z,r=1,life=.4,text='')=>{if(fx.length<80)fx.push({id:++serial,kind,x,z,r,life,max:life,text})};
 function hit(e,damage,source,skill,crit=true){if(e.hp<=0)return;const bonus=stats(),critical=crit&&random()<COMBAT.criticalChance+bonus.crit+characterFor(hero()).crit+(focus>0?.22:0),tech=skill.characterTechnique||skill.narutoImpact;const d=Math.max(1,Math.round((damage+(crit?bonus.attack:0))*(crit&&tech?1+bonus.ninjutsu:1)*(critical?COMBAT.criticalMultiplier:1)*damageModifier(e,source,skill)*(e.mark>0&&tech?COMBAT.clone.synergy:1)));
  e.hp=Math.max(0,e.hp-d);e.flash=.17;e.stagger=.14;e.intent=null;e.pendingAttack=0;const v=directionToward(e.x-source.x,e.z-source.z);move(e,v.x*Math.min(1.5,(skill.knock||0)*.15),v.z*Math.min(1.5,(skill.knock||0)*.15));emit('damage',e.x,e.z,1,.7,String(d)+(critical?'!':''));if(!e.hp){onKill(e.id);emit('defeat',e.x,e.z,1.6,.55);say('+25 EXP · +12 ryō');}}
 function hurt(target,d,source,kind){if(target!==p){target.hp=0;emit('clone',target.x,target.z,1,.35);return}if(invuln>0)return;if(sub>0){sub=0;invuln=COMBAT.substitution.invulnerable;const v=directionToward(p.x-source.x,p.z-source.z);emit('clone',p.x,p.z,1,.5);move(p,v.x*2.8,v.z*2.8);say('Kawarimi');return}
  const v=directionToward(source.x-p.x,source.z-p.z);if(guard&&kind==='physical'&&v.x*p.dirX+v.z*p.dirZ>=D.frontDot){const cost=D.blockBase+d*D.blockDamage;staminaDelay=D.regenDelay;if(p.stamina>=cost){p.stamina-=cost;emit('guard',p.x,p.z,1,.35,'BLOCK');return}p.stamina=0;guard=false;guardBreak=D.breakTime}
  p.hp=Math.max(0,p.hp-Math.max(1,d-stats().defense-characterFor(hero()).defense-(guardBuff>0?8:0)));invuln=.22;combo=0;emit('damage',p.x,p.z,1,.65,'−'+Math.round(d));if(!p.hp)say('Derrotado · Sakura te recuperará.');
 }
 function projectile(source,dir,skill,hostile=false,kind='kunai',pierce=false){if(shots.length>=48)return;const speed=hostile?10:kind==='kunai'?18:14;shots.push({id:++serial,x:source.x,z:source.z,dx:dir.x,dz:dir.z,life:Math.min(1.3,(skill.range||12)/speed),speed,damage:skill.damage,skill,hostile,kind,pierce,hits:new Set()})}
 function target(dir,range){return chooseAttackTarget(p,alive(),dir,range,COMBAT.hades.assistDot,visible)}
 function resolve(a){const {k,s,dir}=a,who=hero(),mode=s.mode;
  if(k==='l'&&who==='naruto'){const n=shadowCloneLimit(stats());clones=[];for(let i=0;i<n;i++){const ang=i/n*Math.PI*2+.7,x=p.x+Math.cos(ang)*1.4,z=p.z+Math.sin(ang)*1.4;clones.push({id:++serial,x:blocked(x,z)?p.x:x,z:blocked(x,z)?p.z:z,hp:1,life:COMBAT.clone.duration+stats().cloneDuration,attack:0,dirX:dir.x,dirZ:dir.z})}emit('clone',p.x,p.z,2,.55);return}
  if(mode==='focus'){focus=s.buff||5;emit('focus',p.x,p.z,1.8,.55);return}if(mode==='heal'){p.hp=Math.min(100,p.hp+(s.heal||35));emit('heal',p.x,p.z,1.8,.65);return}if(mode==='guard'){guardBuff=s.buff||4;emit('earth',p.x,p.z,1.8,.65);return}
  if(k==='k'||mode==='projectile'||k==='f'&&who==='naruto'){projectile(p,dir,s,false,k==='k'?'kunai':s.fx||'wind',who==='naruto'&&k==='f');return}
  if(mode==='lunge'||a.ras){const aim=target(dir,a.distance||s.range);const d=aim?Math.max(0,dist(p,aim)-.85):Math.min(a.distance||s.range,1.5);move(p,dir.x*Math.min(a.distance||1.3,d),dir.z*Math.min(a.distance||1.3,d));}
  const area=mode==='area'||k==='g',range=a.ras?(k==='g'?3:2):s.range;let targets=area?alive().filter(e=>dist(p,e)<=range&&visible(p,e)).sort((a,b)=>dist(p,a)-dist(p,b)).slice(0,s.targets||5):[target(dir,range+COMBAT.hades.assistReach)].filter(Boolean);
  emit(s.fx||(a.ras?k==='g'?'giant':'rasengan':k==='j'?'slash':'lightning'),p.x+dir.x*(area?0:1),p.z+dir.z*(area?0:1),area?range:1.5,.42);for(const e of targets)hit(e,s.damage,p,s);
 }
 function release(k){if(!charge||charge.k!==k)return false;const c=charge;charge=null;const cfg=COMBAT.rasengan[k],q=Math.min(1,c.age/cfg.maxCharge),extra=Math.min(p.chakra,Math.round(cfg.extraCost*q));p.chakra-=extra;action={...c,s:{...c.s,damage:Math.round(c.s.damage*(1+cfg.bonusDamage*q)),narutoImpact:true},ras:true,distance:cfg.minDistance+(cfg.maxDistance-cfg.minDistance)*q,impact:.055,left:cfg.recovery+.10,done:false,pose:'rasengan'};cd[k]=Math.max(c.s.cd,action.left);return true}
 function press(k,dir){if(!enabled()||p.hp<=0||guardBreak>0)return false;const who=hero();if(k==='q'){if(dash||action||charge||cd.q>0||!payAction(p,COMBAT.dash))return false;dash={dir,left:COMBAT.dash.duration};cd.q=COMBAT.dash.cooldown;invuln=COMBAT.dash.invulnerable;staminaDelay=D.regenDelay;emit('dash',p.x,p.z,1.2,.2);return true}
  if(k==='r'){if(cd.r>0||!payAction(p,COMBAT.substitution))return false;sub=COMBAT.substitution.duration;cd.r=COMBAT.substitution.cd;staminaDelay=D.regenDelay;say('Kawarimi listo');return true}
  if(!Object.hasOwn(COMBAT.skills,k)||action||charge||dash||cd[k]>0||guard)return false;if(k==='g'&&!advancedUnlocked(rpg,who)){say('Técnica avanzada sin desbloquear');return false}
  let s={...characterSkill(who,k,COMBAT.skills[k]),...skillModifiers(rpg,who,k)};if(k==='j'){combo=time-comboAt<=COMBAT.comboWindow?combo%3+1:1;comboAt=time;s={...s,...COMBAT.combos[combo-1],damage:Math.round(COMBAT.combos[combo-1].damage*characterFor(who).combo)}}else combo=0;
  if(!canPayAction(p,s)){say('Recursos insuficientes');return false}payAction(p,s);if(s.resource==='stamina')staminaDelay=D.regenDelay;
  const aim=target(dir,s.range+COMBAT.hades.assistReach);if(aim&&['j','k','f',' ','g'].includes(k))dir=directionToward(aim.x-p.x,aim.z-p.z);p.dirX=dir.x;p.dirZ=dir.z;
  if(who==='naruto'&&COMBAT.rasengan[k]){charge={k,s,dir,age:0};return true}
  const pose=k==='j'?['attack','kick','finish'][combo-1]:k==='k'?'release':k==='l'?'seal':s.mode==='area'?'slam':s.mode==='lunge'?'thrust':'release';action={k,s,dir,pose,impact:s.windup,left:s.duration,done:false};cd[k]=Math.max(s.cd,s.duration);return true;
 }
 function step(dt,pos,dir,active,inputs={}){
  p.x=pos.x;p.z=pos.y;if(!action&&!charge&&!dash){p.dirX=dir.x;p.dirZ=dir.z}
  if(!active||!enabled()){if(wasActive){shots=[];clones=[];action=charge=dash=null;guard=false;charging=0;for(const e of enemies){e.intent=null;e.pendingAttack=0}}wasActive=false;return}wasActive=true;time+=dt;
  for(const k in cd)cd[k]=dec(cd[k],dt);invuln=dec(invuln,dt);sub=dec(sub,dt);focus=dec(focus,dt);guardBuff=dec(guardBuff,dt);guardBreak=dec(guardBreak,dt);staminaDelay=dec(staminaDelay,dt);
  guard=!!inputs.guard&&!action&&!charge&&!dash&&!guardBreak&&p.stamina>0;charging=inputs.charge&&!guard&&!action&&!charge&&!dash?charging+dt:0;
  if(guard){p.stamina=dec(p.stamina,D.holdDrain*dt);staminaDelay=D.regenDelay;if(!p.stamina){guard=false;guardBreak=D.breakTime}}else if(!staminaDelay&&!guardBreak)p.stamina=Math.min(D.max,p.stamina+D.regen*dt);
  p.chakra=Math.min(100,p.chakra+dt*(8+stats().chakra+characterFor(hero()).regen+(charging>=D.chargeWindup?D.chargeBonus:0)));
  if(dash){move(p,dash.dir.x*COMBAT.dash.speed*dt,dash.dir.z*COMBAT.dash.speed*dt);dash.left-=dt;if(dash.left<=0)dash=null}
  if(charge){charge.age+=dt;if(charge.age>=COMBAT.rasengan[charge.k].maxCharge)release(charge.k)}
  if(action){action.impact-=dt;action.left-=dt;if(!action.done&&action.impact<=0){action.done=true;resolve(action)}if(action.left<=0)action=null}
  for(const e of alive()){e.flash=dec(e.flash||0,dt);e.mark=dec(e.mark||0,dt);tickEnemy(e,p,clones,dt,move,(e,intent,r)=>projectile(e,directionToward(intent.x-e.x,intent.z-e.z,intent.dx,intent.dz),{damage:r.damage,range:12},true,r.projectile||'kunai'),hurt,blocked)}
  for(const c of clones){c.life-=dt;c.attack=dec(c.attack,dt);if(c.hp<=0||c.life<=0)continue;const e=alive().sort((a,b)=>dist(c,a)-dist(c,b))[0];if(!e)continue;const v=directionToward(e.x-c.x,e.z-c.z);c.dirX=v.x;c.dirZ=v.z;if(dist(c,e)>1.4)move(c,v.x*dt*4,v.z*dt*4);else if(!c.attack&&visible(c,e)){c.attack=.8;e.mark=COMBAT.clone.markDuration;hit(e,COMBAT.clone.damage,c,COMBAT.clone,false)}}clones=clones.filter(c=>c.hp>0&&c.life>0);
  for(const q of shots){q.life-=dt;const steps=Math.max(1,Math.ceil(q.speed*dt/.2));for(let i=0;i<steps&&q.life>0;i++){q.x+=q.dx*q.speed*dt/steps;q.z+=q.dz*q.speed*dt/steps;if(blocked(q.x,q.z,.08)){q.life=0;break}const targets=q.hostile?[p,...clones]:alive();for(const e of targets){if(e.hp<=0||q.hits.has(e)||dist(q,e)>.65)continue;q.hits.add(e);if(q.hostile)hurt(e,q.damage,q,'physical');else hit(e,q.damage,q,q.skill);if(!q.pierce){q.life=0;break}}}}shots=shots.filter(q=>q.life>0);
  for(const f of fx)f.life-=dt;fx=fx.filter(f=>f.life>0);pos.x=p.x;pos.y=p.z;
 }
 function resetTransient(){action=charge=dash=null;clones=[];shots=[];fx=[];guard=false;charging=0;invuln=0;sub=focus=guardBuff=0;guardBreak=0;p.stamina=D.max;for(const e of enemies){e.intent=null;e.pendingAttack=0}}
 return {enemies,press,release,step,resetTransient,enabled,locked:()=>!!(dash||action||charge),moveScale:()=>guard?D.moveSpeed:charging?.55:action||charge||dash?0:1,threat:pos=>enabled()&&(!!action||!!charge||!!dash||alive().some(e=>Math.hypot(pos.x-e.x,pos.y-e.z)<11)||shots.some(q=>q.hostile)),pose:()=>dash?'dash':charge?'rasengan':action?.pose|| (guard?'guard':charging?'charge':null),state:()=>({enemies:enemies.map(e=>({id:e.id,x:e.x,z:e.z,hp:e.hp,role:roleFor(e).name,ai:e.ai,dirX:e.dirX,dirZ:e.dirZ,flash:e.flash||0,intent:e.intent?{...e.intent}:null})),clones:clones.map(c=>({...c})),shots:shots.map(({hits,...q})=>({...q})),fx:fx.map(f=>({...f})),stamina:p.stamina,charge:charge?charge.age/COMBAT.rasengan[charge.k].maxCharge:0,cooldowns:{...cd},notice:time<noticeUntil?notice:'',dirX:p.dirX,dirZ:p.dirZ})}
}
