import {directionToward} from './combat-data.js';
export const ARENA={x:32,z:-2,r:12};
export const BOSSES=[
 {id:'zabuza',name:'Zabuza Momochi',hp:1440,speed:3.6,reward:[['mistBlade',1],['pill',3]],xp:250,coins:180,intro:'The mist is my territory. Show me what you have learned, shinobi.',patterns:[{name:'Sword Slash',shape:'circle',radius:4.2,windup:.48,damage:24,reach:4.2},{name:'Water Dragon',shape:'line',radius:1.15,length:10,windup:2,damage:30,reach:12,special:'dragon'},{name:'Mist Whirlwind',shape:'circle',radius:5.2,windup:.55,damage:34,reach:5.2},{name:'Water Clone Jutsu',shape:'circle',radius:2.5,windup:.4,damage:0,reach:24,special:'clones'}]},
 {id:'haku',name:'Haku',hp:1200,speed:5.0,reward:[['iceMask',1],['scroll',1]],xp:300,coins:220,intro:'I do not want to hurt you. But I will not abandon my purpose.',patterns:[{name:'Ice Needles',shape:'line',radius:.8,length:12,windup:.30,damage:9,reach:24,special:'needles',count:5},{name:'Ice Mirrors',shape:'target',radius:2.3,windup:.40,damage:11,reach:24,special:'needles',count:7},{name:'Needle Dance',shape:'target',radius:3.1,windup:.34,damage:10,reach:24,special:'needles',count:9}]}
];
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function newBossProgress(){return {defeated:[],mistStage:0,kyubiUnlocked:false};}
export function validateBossProgress(raw){if(!raw||!Array.isArray(raw.defeated)||raw.defeated.length>BOSSES.length||raw.defeated.some((id,i)=>id!==BOSSES[i].id))throw Error('Invalid boss progress.');const legacy=raw.mistStage===undefined;const mistStage=legacy?(raw.defeated.length===2?4:raw.defeated.length===1?1:0):raw.mistStage;if(!Number.isInteger(mistStage)||mistStage<0||mistStage>4||(!legacy&&typeof raw.kyubiUnlocked!=='boolean')||mistStage===4&&raw.defeated.length!==2||raw.defeated.length===2&&mistStage!==4||mistStage>=2&&!legacy&&!raw.kyubiUnlocked)throw Error('Invalid Mist encounter progress.');return {defeated:[...raw.defeated],mistStage,kyubiUnlocked:legacy?true:raw.kyubiUnlocked};}
export function nextBoss(progress){return BOSSES[progress.defeated.length]||null;}
export function makeBoss(spec){return {id:spec.id,kind:spec.id,spec,x:ARENA.x,z:ARENA.z,hp:spec.hp,maxHP:spec.hp,dirX:-1,dirZ:0,phase:1,index:0,attack:1.4,hit:0,flash:0,mark:0,intent:null,motion:false,walk:0};}
export function bossContains(intent,target){const dx=target.x-intent.x,dz=target.z-intent.z;if(intent.shape!=='line')return Math.hypot(dx,dz)<=intent.radius;const along=dx*intent.dx+dz*intent.dz,side=Math.abs(dx*intent.dz-dz*intent.dx);return along>=0&&along<=intent.length&&side<=intent.radius;}
export function tickBoss(b,p,clones,dt,move,hit,signal){
 if(b.id==='zabuza'&&b.worldBoss)return tickZabuza(b,p,clones,dt,move,hit,signal);
 if(b.id==='haku'&&b.worldBoss)return tickHaku(b,p,dt,move,signal);
 b.hit=Math.max(0,b.hit-dt);b.flash=Math.max(0,b.flash-dt);b.mark=Math.max(0,b.mark-dt);b.motion=false;
 if(b.anim){b.anim.left-=dt;if(b.anim.left<=0)b.anim=null;}
 if(b.hp<=b.maxHP*.5&&b.phase===1){b.phase=2;b.intent=null;b.anim=null;b.attack=.55;signal('phase',b);return;}
 if(b.intent){const a=b.intent;a.left-=dt;if(a.left<=0){b.intent=null;b.attack=b.worldBoss?(b.enraged?.24:.36)+Math.random()*.32:b.enraged?.38:b.phase===2?.7:1.15;for(const target of [p,...clones])if(!a.special&&((target.hp??0)>0&&(target.life??1)>0&&bossContains(a,target)))hit(target,a.damage,b);signal('strike',b,a);}return;}
 b.attack=Math.max(0,b.attack-dt);const allies=clones.filter(a=>a.ally&&a.hp>0&&a.life>0);const target=b.scripted&&allies.length&&b.index%3!==2?allies[b.index%allies.length]:p;const v=directionToward(target.x-b.x,target.z-b.z);b.dirX=v.x;b.dirZ=v.z;
 const d=distance(b,target);let pattern=b.spec.patterns[b.index%(b.phase===2?3:2)];if(b.worldBoss){if(!b.choice){let options=b.spec.patterns.filter(a=>a.name!==b.lastPattern&&d<=a.reach);if(!options.length)options=b.spec.patterns.filter(a=>a.name!==b.lastPattern);if(!options.length)options=b.spec.patterns;b.choice=options[Math.floor(Math.random()*options.length)];}pattern=b.choice;}
 if(!b.attack&&d<=pattern.reach){const x=pattern.shape==='target'?target.x:b.x,z=pattern.shape==='target'?target.z:b.z;const windup=pattern.windup*(b.phase===2?.8:1);b.intent={...pattern,x,z,dx:v.x,dz:v.z,left:windup,total:windup};b.anim={k:'j',left:windup+.25,total:windup+.25,windup};b.index++;b.lastPattern=pattern.name;b.choice=null;signal('windup',b,b.intent);return;}
 if(d>Math.min(pattern.reach*.8,b.id==='haku'?5.5:2.5)){const speed=b.spec.speed*(b.phase===2?1.2:1);move(b,v.x*dt*speed,v.z*dt*speed);b.motion=true;b.walk+=dt*8;}
}
export function sandboxBoost(p,rpg,action,addItem){if(action==='level')p.xp=Math.min(1e9,p.xp+100);else if(action==='five')p.xp=Math.min(1e9,p.xp+500);else if(action==='coins')p.coins=Math.min(1e9,p.coins+500);else if(action==='restore'){p.hp=100;p.chakra=100;}else if(action==='supplies'){for(const [id,n] of [['ramen',5],['pill',5],['scroll',2]])addItem(rpg,id,n);}else return false;return true;}

// Scripted boss encounter definitions. Each scene is advanced explicitly by the player.
export const MIST_SCENES={
 opening:{title:'THE DEMON OF THE MIST',lines:[['Kakashi','Stay sharp, Naruto. I will draw his attention.'],['Zabuza','The Hidden Mist has no mercy for children.'],['Naruto','I am not backing down!']]},
 arrival:{title:'A SHINOBI BEHIND THE MASK',lines:[['Zabuza','Haku. Take care of the boy.'],['Haku','Forgive me. I cannot let you harm the one who gave me a purpose.'],['Kakashi','Naruto, stay with Sasuke. I will deal with Zabuza.'],['Sasuke','Try not to get in my way.']]},
 awakening:{title:'THE NINE-TAILS AWAKENS',lines:[['Sasuke','Naruto! Look out!'],['Haku','He shielded you without hesitation.'],['Naruto','Sasuke... No! I will not let you hurt my friends!'],['Naruto','This chakra... what is happening to me?'],['Naruto','WWRRAAAH!!']]},
 wrath:{title:'THE DEMON’S WRATH',lines:[['Haku','Zabuza... I have failed you.'],['Kakashi','It is over, Zabuza. Put down your sword.'],['Zabuza','Out of my way, Haku! Kakashi is mine!'],['Naruto','Haku! How could you do that?!'],['Zabuza','Haku... What have I done? I have nothing left!'],['Sasuke','Naruto. I am still standing. Let us finish this.']]},
 ending:{title:'THE END OF THE MIST',lines:[['Zabuza','Haku... forgive me.'],['Kakashi','A shinobi is more than a weapon. Remember that.'],['Sasuke','Not bad, Naruto.'],['Naruto','I will find my own ninja way.']]}
};
export const MIST_ALLIES={kakashi:{name:'Kakashi',kind:'npc',character:'kakashi',hp:135,speed:4.6,reach:2.6,damage:10,cooldown:1.8,orbit:3.8,techniques:[{name:'Water Dragon',key:'k',kind:'water',reach:9,damage:16,cooldown:6,windup:.48},{name:'Raikiri',key:' ',kind:'lightning',reach:4.6,damage:19,cooldown:7,windup:.34}]},sasuke:{name:'Sasuke',kind:'sasuke',character:'sasuke',hp:95,speed:5.2,reach:2.4,damage:8,cooldown:1.65,orbit:4.5,techniques:[{name:'Fireball Jutsu',key:'f',kind:'fire',reach:9,damage:15,cooldown:5.5,windup:.45},{name:'Chidori',key:' ',kind:'lightning',reach:4.6,damage:18,cooldown:7,windup:.36}]}};
export const MIST_RAGE={...BOSSES[0],name:'Zabuza · Wrath',speed:BOSSES[0].speed*1.45,patterns:[{name:'Furious Cleave',shape:'circle',radius:4.8,windup:.40,damage:36,reach:4.8},{name:'Raging Water Dragon',shape:'line',radius:1.45,length:12,windup:2,damage:45,reach:24,special:'dragon'},{name:'Demon’s Whirlwind',shape:'circle',radius:6.2,windup:.48,damage:48,reach:6.2},{name:'Water Clone Ambush',shape:'circle',radius:2.5,windup:.28,damage:0,reach:24,special:'clones'}]};
export function mistBoss(stage){const b=makeBoss(stage===3?MIST_RAGE:stage===1||stage===2?BOSSES[1]:BOSSES[0]);b.scripted=true;b.worldBoss=true;if(stage===2||stage===3){b.hp=b.maxHP*.5;b.phase=2;}if(stage===3)b.enraged=true;return b;}
export function mistAlly(id,x,z){const spec=MIST_ALLIES[id];return {id:'ally-'+id,ally:true,spec,kind:spec.kind,x,z,hp:spec.hp,maxHP:spec.hp,life:1,character:spec.character,dirX:1,dirZ:0,walk:0,attack:1,techAt:1.6,techIndex:0,cast:null,orbitDir:id==='kakashi'?1:-1,hit:0,flash:0,motion:false};}

// Camera shots relative to current speaker, interpolated independently of game time.
export const MIST_CAMERA={opening:[{zoom:1.32,yaw:-.18},{zoom:1.7,yaw:.21},{zoom:1.62,yaw:-.12}],arrival:[{zoom:1.55,yaw:.18},{zoom:1.85,yaw:-.2},{zoom:1.45,yaw:-.1},{zoom:1.72,yaw:.16}],awakening:[{zoom:1.45,yaw:.15},{zoom:1.55,yaw:-.18},{zoom:2.05,yaw:-.26},{zoom:2.5,yaw:.14},{zoom:4.8,yaw:.08,lookY:1.7}],wrath:[{zoom:1.65,yaw:.2},{zoom:1.45,yaw:-.17},{zoom:1.78,yaw:.24},{zoom:1.9,yaw:-.2},{zoom:2.02,yaw:.19},{zoom:1.5,yaw:-.15}],ending:[{zoom:1.55,yaw:.16},{zoom:1.48,yaw:-.16},{zoom:1.55,yaw:.12},{zoom:1.4,yaw:0}]};

// Encounter combat constants, shared by the game and tests.
export const MIST_COMBAT={dragon:{life:3,speed:7.5,turn:5.5},clone:{hp:45,life:9,speed:4.7,count:3,max:4,reach:1.1},prison:{duration:4.5,presses:12,failDamage:22,immunity:2.5},mirror:{needleSpeed:13,projectileCap:40}};

 // Independent cooldown groups: both sword variants share one timer.
export const ZABUZA_TIMING={sword:3,dragon:12,clones:20,initial:{sword:0,dragon:2.5,clones:5},recovery:.24};
export function zabuzaGroup(pattern){return pattern.special==='dragon'?'dragon':pattern.special==='clones'?'clones':'sword';}
export function tickZabuza(b,p,clones,dt,move,hit,signal,random=Math.random){
 b.cooldowns??={...ZABUZA_TIMING.initial};b.orbitDir??=1;b.orbitLeft??=1.8;
 b.hit=Math.max(0,b.hit-dt);b.flash=Math.max(0,b.flash-dt);b.mark=Math.max(0,b.mark-dt);b.motion=false;
 for(const k of ['sword','dragon','clones'])b.cooldowns[k]=Math.max(0,b.cooldowns[k]-dt);
 b.attack=Math.max(0,b.attack-dt);
 if(b.anim){b.anim.left-=dt;if(b.anim.left<=0)b.anim=null;}
 if(b.hp<=b.maxHP*.5&&b.phase===1){b.phase=2;if(b.intent){const group=zabuzaGroup(b.intent);b.cooldowns[group]=ZABUZA_TIMING[group];}b.intent=null;b.anim=null;b.attack=.55;signal('phase',b);return;}
 if(b.intent){
  const a=b.intent;a.left-=dt;
  if(a.special==='dragon'){const v=directionToward(p.x-b.x,p.z-b.z);b.dirX=a.dx=v.x;b.dirZ=a.dz=v.z;}
  if(a.left<=1e-8){b.intent=null;const group=zabuzaGroup(a);b.cooldowns[group]=ZABUZA_TIMING[group];b.attack=ZABUZA_TIMING.recovery;
   if(group==='sword')for(const target of [p,...clones])if((target.hp??0)>0&&(target.life??1)>0&&bossContains(a,target))hit(target,a.damage,b);
   signal('strike',b,a);
  }return;
 }
 const allies=clones.filter(a=>a.ally&&a.hp>0&&a.life>0);
 const target=b.scripted&&allies.length&&b.index%3!==2?allies[b.index%allies.length]:p;
 const d=distance(b,target),v=directionToward(target.x-b.x,target.z-b.z);b.dirX=v.x;b.dirZ=v.z;
 if(!b.attack){
  const ready=b.spec.patterns.filter(a=>b.cooldowns[zabuzaGroup(a)]<=1e-8&&distance(b,a.special==='dragon'?p:target)<=a.reach);
  const varied=ready.filter(a=>a.name!==b.lastPattern),options=varied.length?varied:ready;
  if(options.length){
   const pattern=options[Math.floor(random()*options.length)],windup=pattern.windup;
   const aim=pattern.special==='dragon'?directionToward(p.x-b.x,p.z-b.z):v;
   b.dirX=aim.x;b.dirZ=aim.z;b.intent={...pattern,x:b.x,z:b.z,dx:aim.x,dz:aim.z,left:windup,total:windup};
   b.anim={k:pattern.special==='dragon'||pattern.special==='clones'?'l':'j',left:windup+.25,total:windup+.25,windup};
   b.index++;b.lastPattern=pattern.name;signal('windup',b,b.intent);return;
  }
 }
 // Pursue from range; flank and reposition while waiting. No movement during a cast.
 b.orbitLeft-=dt;if(b.orbitLeft<=0){b.orbitDir*=-1;b.orbitLeft=1.6+random()*1.3;}
 const desired=b.cooldowns.sword<=.45?3:4.6,radial=Math.max(-.9,Math.min(1,(d-desired)*.55)),tangent=d>desired+3?.18:.83;
 const dir=directionToward(v.x*radial-v.z*tangent*b.orbitDir,v.z*radial+v.x*tangent*b.orbitDir);
 const x=b.x,z=b.z,speed=b.spec.speed*(b.phase===2?1.12:1);move(b,dir.x*dt*speed,dir.z*dt*speed);
 b.motion=Math.hypot(b.x-x,b.z-z)>.0001;if(b.motion)b.walk+=dt*speed*2.5;else{b.orbitDir*=-1;b.orbitLeft=.65;}
}

// Haku has a single shared offensive timer for teleport + needle volleys.
// Ice protection has an independent start-to-start timer.
export const HAKU_TIMING={needles:5,shield:20,shieldDuration:3,initialNeedles:5,recovery:.35};
export function tickHaku(b,p,dt,move,signal,random=Math.random){
 const cfg=HAKU_TIMING;
 b.needleAt??=cfg.initialNeedles;b.shieldAt??=cfg.shield;b.shieldLeft??=0;b.orbitDir??=1;b.orbitLeft??=2;
 b.hit=Math.max(0,b.hit-dt);b.flash=Math.max(0,b.flash-dt);b.mark=Math.max(0,b.mark-dt);b.motion=false;
 b.needleAt=Math.max(0,b.needleAt-dt);b.shieldAt=Math.max(0,b.shieldAt-dt);
 if(b.anim){b.anim.left-=dt;if(b.anim.left<=0)b.anim=null;}
 if(b.shieldLeft>0){
  b.shieldLeft=Math.max(0,b.shieldLeft-dt);
  if(b.shieldLeft<=1e-8){b.shieldLeft=0;b.needleAt=Math.max(b.needleAt,cfg.recovery);signal('shieldEnd',b);}
  return;
 }
 if(b.shieldAt<=1e-8){b.shieldAt=cfg.shield;b.shieldLeft=cfg.shieldDuration;b.intent=null;b.anim=null;b.motion=false;b.needleAt=Math.max(b.needleAt,cfg.recovery);signal('shield',b);return;}
 if(b.hp<=b.maxHP*.5&&b.phase===1){b.phase=2;b.intent=null;b.anim=null;b.needleAt=Math.max(b.needleAt,.55);signal('phase',b);return;}
 if(b.intent){const a=b.intent;a.left-=dt;if(a.left<=1e-8){b.intent=null;b.needleAt=cfg.needles;signal('strike',b,a);}return;}
 const v=directionToward(p.x-b.x,p.z-b.z),d=distance(b,p);b.dirX=v.x;b.dirZ=v.z;
 if(b.needleAt<=1e-8){
  const available=b.spec.patterns.filter(a=>a.name!==b.lastPattern),options=available.length?available:b.spec.patterns;
  const pattern=options[Math.floor(random()*options.length)],windup=pattern.windup;
  b.intent={...pattern,x:pattern.shape==='target'?p.x:b.x,z:pattern.shape==='target'?p.z:b.z,dx:v.x,dz:v.z,left:windup,total:windup};
  b.anim={k:'k',left:windup+.25,total:windup+.25,windup};b.lastPattern=pattern.name;b.index++;signal('windup',b,b.intent);return;
 }
 // Reposition without firing or teleporting between the five-second volleys.
 b.orbitLeft-=dt;if(b.orbitLeft<=0){b.orbitDir*=-1;b.orbitLeft=1.8+random()*1.2;}
 const radial=Math.max(-.75,Math.min(1,(d-5)*.45)),tangent=d>8?.18:.63;
 const dir=directionToward(v.x*radial-v.z*tangent*b.orbitDir,v.z*radial+v.x*tangent*b.orbitDir),x=b.x,z=b.z;
 move(b,dir.x*dt*b.spec.speed*.78,dir.z*dt*b.spec.speed*.78);b.motion=Math.hypot(b.x-x,b.z-z)>.0001;if(b.motion)b.walk+=dt*8;else{b.orbitDir*=-1;b.orbitLeft=.6;}
}
