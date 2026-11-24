import {directionToward} from './combat-data.js';
export const ARENA={x:-36,z:-18,r:12,name:'Western Forest'};
export const BOSSES=[
 {id:'zabuza',name:'Zabuza Momochi',hp:1440,speed:3.6,reward:[['mistBlade',1],['pill',3]],xp:250,coins:180,intro:'The mist is my territory. Show me what you have learned, shinobi.',patterns:[{name:'Sword Slash',shape:'circle',radius:4.2,windup:.48,damage:24,reach:4.2},{name:'Water Dragon',shape:'line',radius:1.15,length:10,windup:2,damage:30,reach:12,special:'dragon'},{name:'Mist Whirlwind',shape:'circle',radius:5.2,windup:.55,damage:34,reach:5.2},{name:'Water Clone Jutsu',shape:'circle',radius:2.5,windup:.4,damage:0,reach:24,special:'clones'}]},
 {id:'haku',name:'Haku',hp:1200,speed:5.0,reward:[['iceMask',1],['scroll',1]],xp:300,coins:220,intro:'I do not want to hurt you. But I will not abandon my purpose.',patterns:[{name:'Ice Needles',shape:'line',radius:.8,length:12,windup:.30,damage:9,reach:24,special:'needles',count:5},{name:'Ice Mirrors',shape:'target',radius:2.3,windup:.40,damage:11,reach:24,special:'needles',count:7},{name:'Needle Dance',shape:'target',radius:3.1,windup:.34,damage:10,reach:24,special:'needles',count:9}]}
];
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function newBossProgress(){return {defeated:[],mistStage:0,kyubiUnlocked:false,worldDefeated:[]};}
export function validateBossProgress(raw){if(!raw||!Array.isArray(raw.defeated)||raw.defeated.length>BOSSES.length||raw.defeated.some((id,i)=>id!==BOSSES[i].id))throw Error('Invalid boss progress.');const legacy=raw.mistStage===undefined;const mistStage=legacy?(raw.defeated.length===2?4:raw.defeated.length===1?1:0):raw.mistStage;if(!Number.isInteger(mistStage)||mistStage<0||mistStage>4||(!legacy&&typeof raw.kyubiUnlocked!=='boolean')||mistStage===4&&raw.defeated.length!==2||raw.defeated.length===2&&mistStage!==4||mistStage>=2&&!legacy&&!raw.kyubiUnlocked)throw Error('Invalid Mist encounter progress.');const wd=raw.worldDefeated===undefined?[]:raw.worldDefeated;if(!Array.isArray(wd)||new Set(wd).size!==wd.length||wd.some(id=>!Object.hasOwn(WORLD_BOSSES,id)))throw Error('Invalid world boss progress.');return {defeated:[...raw.defeated],mistStage,kyubiUnlocked:legacy?true:raw.kyubiUnlocked,worldDefeated:[...wd]};}
export function nextBoss(progress){return BOSSES[progress.defeated.length]||null;}
export function makeBoss(spec){return {id:spec.id,kind:spec.id,spec,x:ARENA.x,z:ARENA.z,hp:spec.hp,maxHP:spec.hp,dirX:-1,dirZ:0,phase:1,index:0,attack:1.4,hit:0,flash:0,mark:0,intent:null,motion:false,walk:0};}
export function bossContains(intent,target){const dx=target.x-intent.x,dz=target.z-intent.z;if(intent.shape==='annulus'){const d=Math.hypot(dx,dz);return d>=intent.inner&&d<=intent.radius;}if(intent.shape!=='line')return Math.hypot(dx,dz)<=intent.radius;const along=dx*intent.dx+dz*intent.dz,side=Math.abs(dx*intent.dz-dz*intent.dx);return along>=0&&along<=intent.length&&side<=intent.radius;}
export function tickBoss(b,p,clones,dt,move,hit,signal){
 if(b.id==='zabuza'&&b.worldBoss)return tickZabuza(b,p,clones,dt,move,hit,signal);
 if(b.id==='haku'&&b.worldBoss)return tickHaku(b,p,dt,move,signal);
 if(b.id==='kabuto'&&b.independent)return tickKabuto(b,p,clones,dt,move,hit,signal);
 if(b.id==='gaara'&&b.independent)return tickGaara(b,p,clones,dt,move,hit,signal);
 if(b.id==='orochimaru'&&b.independent)return tickOrochimaru(b,p,clones,dt,move,hit,signal);
 if(b.id==='kimimaro'&&b.independent)return tickKimimaro(b,p,clones,dt,move,hit,signal);
 if(b.id==='sasuke'&&b.independent)return tickValleySasuke(b,p,clones,dt,move,hit,signal);
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

export const WORLD_BOSSES={kabuto:{id:'kabuto',name:'Kabuto Yakushi',hp:1500,speed:4.9,arena:{x:36,z:-30,r:12,name:'Abandoned Medical Outpost'},xp:650,coins:420,reward:[['medicalGloves',1],['pill',3]],patterns:[
{id:'scalpel',name:'Chakra Scalpel',shape:'line',radius:1.1,length:5,reach:5,windup:.55,damage:24,cooldown:3},
{id:'disrupt',name:'Nervous System Disruption',shape:'target',radius:3.2,reach:11,windup:1,damage:16,cooldown:12},
{id:'heal',name:'Medical Regeneration',shape:'circle',radius:2,reach:30,windup:2.8,damage:0,cooldown:20},
{id:'evasion',name:'Evasive Step',shape:'circle',radius:1,reach:5,windup:.25,damage:0,cooldown:7},
{id:'extract',name:'Chakra Extraction',shape:'target',radius:3.3,reach:12,windup:1.15,damage:15,cooldown:14},
 {id:'cross',name:'Surgical Cross',shape:'line',radius:1.2,length:10,reach:10,windup:.85,damage:27,cooldown:9,phase:2},
 {id:'autopsy',name:'Autopsy Protocol',shape:'target',radius:2.5,reach:24,windup:.9,damage:14,cooldown:15,phase:2,pulses:3}
]},gaara:{id:'gaara',name:'Gaara',hp:1900,speed:3.6,arena:{x:36,z:34,r:13,name:'Southern Sand Basin'},marker:'#edbd70',xp:850,coins:550,reward:[['sandArmor',1],['pill',3]],patterns:[
 {id:'sandWave',name:'Sand Wave',shape:'line',radius:2,length:14,reach:15,windup:.9,damage:24,cooldown:8},
 {id:'sandCoffin',name:'Sand Coffin',shape:'target',radius:3.3,reach:20,windup:1.2,damage:32,cooldown:14,zone:true},
 {id:'sandBurst',name:'Sand Burst',shape:'circle',radius:4,reach:4,windup:.65,damage:20,cooldown:5},
 {id:'shukakuClaw',name:'Shukaku Claw',shape:'line',radius:2.4,length:11,reach:11,windup:.8,damage:34,cooldown:7,phase:2},
 {id:'sandTsunami',name:'Sand Tsunami',shape:'annulus',inner:3,radius:14,reach:25,windup:1.8,damage:40,cooldown:17,phase:2},
 {id:'sandDetonation',name:'Sand Detonation',shape:'target',radius:2.7,reach:30,windup:.8,damage:19,cooldown:8,phase:3,pulses:3},
 {id:'sandShuriken',name:'Sand Shuriken Barrage',shape:'line',radius:1.8,length:17,reach:30,windup:.65,damage:11,cooldown:6,phase:3,projectile:true,pulses:2},
 {id:'tailRend',name:'One-Tail Rampage',shape:'line',radius:2.8,length:13,reach:15,windup:.65,damage:28,cooldown:9,phase:3,pulses:2},
 {id:'sandEruption',name:'Shukaku Eruption',shape:'circle',radius:5.8,reach:6.2,windup:1.05,damage:35,cooldown:12,phase:3}
 ]},orochimaru:{id:'orochimaru',name:'Orochimaru',hp:2400,speed:4.6,arena:{x:40,z:12,r:13,name:'Forbidden Underground Laboratory'},marker:'#c69af7',xp:1200,coins:800,reward:[['kusanagi',1],['pill',4]],patterns:[
 {id:'kusanagiSweep',name:'Kusanagi Sweep',shape:'line',radius:1.5,length:7,reach:7,windup:.55,damage:27,cooldown:3.5},
 {id:'snakeStrike',name:'Hidden Shadow Snake Hands',shape:'line',radius:1.35,length:13,reach:14,windup:.8,damage:30,cooldown:9},
 {id:'snakeSummon',name:'Summoning: Serpent Pack',shape:'circle',radius:2,reach:30,windup:1.2,damage:0,cooldown:18,summon:true},
 {id:'venomBurst',name:'Venom Seal',shape:'target',radius:3.4,reach:18,windup:1.15,damage:15,cooldown:12,phase:2,venom:true},
 {id:'serpentRush',name:'White Serpent Rampage',shape:'line',radius:2.2,length:12,reach:13,windup:.75,damage:29,cooldown:10,phase:2,pulses:2},
 {id:'trueFang',name:'White Fang Lunge',shape:'line',radius:2.1,length:14,reach:15,windup:.85,damage:36,cooldown:6,phase:3,lunge:5},
 {id:'trueMiasma',name:'Venom Miasma',shape:'target',radius:3.8,reach:26,windup:1.1,damage:18,cooldown:11,phase:3,venom:true,cloud:true},
 {id:'trueEruption',name:'Serpent Eruption',shape:'target',radius:2.8,reach:26,windup:.85,damage:23,cooldown:9,phase:3,pulses:3},
 {id:'trueCoil',name:'Coil Crush',shape:'circle',radius:5.4,reach:6,windup:1.05,damage:38,cooldown:8,phase:3}
 ]},kimimaro:{id:'kimimaro',name:'Kimimaro',hp:2800,speed:5.1,arena:{x:-30,z:32,r:15,name:'Valley of Bones'},marker:'#e4e1ce',xp:1500,coins:1000,reward:[['boneMantle',1],['pill',4]],patterns:[
 {id:'willowDance',name:'Dance of the Willow',shape:'line',radius:1.55,length:6,reach:6,windup:.45,damage:26,cooldown:3.5},
 {id:'camelliaDance',name:'Dance of the Camellia',shape:'line',radius:1.8,length:10,reach:11,windup:.7,damage:30,cooldown:8,lunge:4},
 {id:'boneBullets',name:'Ten-Finger Drilling Bullets',shape:'line',radius:2,length:18,reach:25,windup:.65,damage:10,cooldown:7,projectile:true},
 {id:'larchDance',name:'Dance of the Larch',shape:'circle',radius:4.2,reach:5,windup:.8,damage:34,cooldown:9,phase:2},
 {id:'clematisDance',name:'Dance of the Clematis',shape:'line',radius:2,length:13,reach:14,windup:1,damage:37,cooldown:12,phase:2},
 {id:'cursedDrill',name:'Cursed Bone Drill',shape:'line',radius:2.6,length:15,reach:16,windup:.85,damage:42,cooldown:7,phase:3,lunge:5},
 {id:'cursedVolley',name:'Cursed Bone Volley',shape:'line',radius:2,length:19,reach:28,windup:.65,damage:12,cooldown:8,phase:3,projectile:true,pulses:2},
 {id:'seedlingFern',name:'Dance of the Seedling Fern',shape:'target',radius:3.2,reach:30,windup:1.15,damage:25,cooldown:15,phase:3,pulses:4,forest:true},
 {id:'cursedTail',name:'Cursed Tail Sweep',shape:'circle',radius:5.2,reach:6,windup:.9,damage:35,cooldown:9,phase:3}
 ]},sasuke:{id:'sasuke',name:'Sasuke Uchiha',hp:2600,speed:5.5,arena:{x:-9,z:39,r:16,name:'Valley of the End'},marker:'#a8b3ff',xp:1800,coins:0,reward:[['valleyMemory',1]],patterns:[
 {id:'lionCombo',name:'Lion Combo',shape:'circle',radius:2.7,reach:3.1,windup:.48,damage:18,cooldown:3.3,pulses:2,phase:1},
 {id:'valleyFire',name:'Fireball Jutsu',shape:'line',radius:1.2,length:18,reach:23,windup:.85,damage:27,cooldown:6.6,projectile:'fire',phase:1},
 {id:'valleyWire',name:'Shuriken Wire',shape:'line',radius:1.6,length:16,reach:22,windup:.55,damage:9,cooldown:4.9,projectile:'wire',phase:1},
 {id:'valleyChidori',name:'Chidori Dash',shape:'line',radius:1.45,length:12,reach:13,windup:1,damage:34,cooldown:8.2,lunge:7,clash:true,phase:1},
 {id:'sharinganChidori',name:'Sharingan Chidori',shape:'line',radius:1.7,length:14,reach:15,windup:.85,damage:36,cooldown:6.6,lunge:8,clash:true,phase:2},
 {id:'sharinganCounter',name:'Counter Step',shape:'target',radius:2.6,reach:6,windup:.65,damage:24,cooldown:5.7,phase:2,flank:true},
 {id:'curseFlurry',name:'Curse Flurry',shape:'target',radius:2.5,reach:9,windup:.65,damage:18,cooldown:5.7,pulses:3,phase:3},
 {id:'darkChidori',name:'Dark Chidori Burst',shape:'line',radius:2.1,length:15,reach:16,windup:1,damage:41,cooldown:6.6,lunge:9,clash:true,phase:3},
 {id:'curseDive',name:'Aerial Dive',shape:'target',radius:3.5,reach:22,windup:1,damage:33,cooldown:8.2,dive:true,phase:3},
 {id:'wingChidori',name:'Wing Dive Chidori',shape:'line',radius:2.4,length:17,reach:18,windup:1.1,damage:46,cooldown:6.6,lunge:10,clash:true,dive:true,phase:4},
 {id:'wingNeedles',name:'Wing Shuriken Barrage',shape:'line',radius:2.2,length:20,reach:30,windup:.65,damage:11,cooldown:5.7,projectile:'wing',pulses:2,phase:4},
 {id:'wingShockwave',name:'Dark Shockwave',shape:'target',radius:4.3,reach:22,windup:1.15,damage:39,cooldown:9,dive:true,phase:4},
 {id:'predatorRush',name:'Predator Rush',shape:'target',radius:2.8,reach:25,windup:.8,damage:22,cooldown:9.8,pulses:3,dive:true,phase:4},
 {id:'curseBlackRush',name:'Black Chidori · Lightning Prison',shape:'line',radius:1.35,length:32,reach:32,windup:1.15,damage:14,cooldown:9.8,rush:true,phase:3},
 {id:'curseInferno',name:'Katon · Inferno Burst',shape:'target',radius:2.5,reach:32,windup:1.05,damage:32,cooldown:7.4,projectile:'inferno',phase:3},
 {id:'wingBlackRush',name:'Black Chidori · Lightning Prison',shape:'line',radius:1.45,length:32,reach:32,windup:1.0,damage:17,cooldown:9,rush:true,phase:4},
 {id:'wingInferno',name:'Katon · Inferno Burst',shape:'target',radius:2.7,reach:32,windup:.9,damage:36,cooldown:6.6,projectile:'inferno',phase:4}
 ]}};
export const VALLEY_RULES={thresholds:[.70,.45,.24,.05],speed:[1,1.65,1.42,1.55],damageScale:[1,1.30,1,1],evadeCooldown:1.4,evadeDistance:3.2,rushSpeed:43,rushLock:.10,rushTravel:44,rushRecovery:.85,rushNear:4.5,recovery:[1,.76,.72,.65],shockDuration:5,shockPresses:10,shockDamage:10,fireSpeed:12,fireFragments:10,fragmentDamage:12,fragmentSpeed:13,fragmentLife:1.4,counterCooldown:8,clashRecovery:2,clashDistance:3.3,projectileCap:28,ultimateTime:4,ultimateCharge:1.25,ultimateRush:.9,ultimateImpact:2.15,ultimateRise:3.55,ultimateExit:5.65};
export const KIMI_RULES={stageOne:.65,stageTwo:.30,phaseSpeed:1.12,finalSpeed:1.28,forestLife:5,forestCap:4,forestSlow:.65,bulletCount:10,bulletSpeed:18,bulletCap:30};
export const ORO_RULES={snakeHP:85,snakeCap:3,snakeLife:24,snakeSpeed:5.2,biteDamage:13,biteCooldown:3.2,biteWindup:.55,biteRange:1.7,phaseSpeed:1.2,shedThreshold:.30,huskHP:160,huskLife:3.5,shedHeal:360,venomLife:5,venomInterval:1,venomDamage:4,finalThreshold:.25,finalSpeed:1.36,cloudLife:4,cloudCap:2};
export const GAARA_RULES={shieldHP:240,shieldDuration:4,shieldCooldown:18,shieldFirst:5,breakRecovery:1.5,zoneDuration:6,zoneSlow:.55,phaseSpeed:1.22,finalThreshold:.35,finalSpeed:1.38,finalScale:1.85,shurikenSpeed:15,shurikenCount:7,shurikenCap:28};
export const KABUTO_RULES={healFraction:.30,healCap:.90,healThreshold:.70,interruptRecovery:2,disruptDuration:8,regenMultiplier:.35,extractChakra:28,phaseSpeed:1.25};
Object.assign(MIST_SCENES,{
 kabutoIntro:{title:'THE MEDICAL PRODIGY',lines:[['Kabuto','Interesting. Your chakra leaves a very readable signature.'],['Naruto','Quit staring and fight!'],['Kabuto','Very well. Let us see how long you last without your precious chakra.']]},
 kabutoPhase:{title:'THE ANATOMY OF A SHINOBI',lines:[['Kabuto','I underestimated you. No matter. I know exactly where to cut.'],['Naruto','I will not let you decide what I can do!']]},
 kabutoEnd:{title:'THE FAILED EXPERIMENT',lines:[['Kabuto','So much for my calculations. We will meet again.'],['Naruto','Next time, try fighting without the cheap tricks.']]}
});
Object.assign(MIST_CAMERA,{kabutoIntro:[{zoom:1.8,yaw:.18},{zoom:1.55,yaw:-.16},{zoom:2.2,yaw:.24}],kabutoPhase:[{zoom:2.4,yaw:-.22},{zoom:1.8,yaw:.14}],kabutoEnd:[{zoom:1.9,yaw:.2},{zoom:1.55,yaw:-.12}]});
export function makeWorldBoss(id){const spec=WORLD_BOSSES[id];if(!spec)return null;return {...makeBoss(spec),x:spec.arena.x,z:spec.arena.z,independent:true,worldBoss:true,...(id==='sasuke'?{cooldowns:Object.fromEntries(spec.patterns.map((a,i)=>[a.id,i%3*2])),lastPattern:null,counterAt:0,evadeAt:0,evadeVisual:0,uses:{},rush:null,clashes:0,air:0}:id==='kimimaro'?{cooldowns:Object.fromEntries(spec.patterns.map((a,i)=>[a.id,i%3*2])),zones:[],lastPattern:null}:id==='orochimaru'?{cooldowns:{kusanagiSweep:0,snakeStrike:4,snakeSummon:7,venomBurst:3,serpentRush:6,trueFang:0,trueMiasma:0,trueEruption:0,trueCoil:0},clouds:[],snakes:[],husk:null,shedUsed:false,serial:0}:id==='gaara'?{cooldowns:{sandWave:0,sandCoffin:3,sandBurst:0,shukakuClaw:3,sandTsunami:7,sandDetonation:0,sandShuriken:0,tailRend:0,sandEruption:0},sandShield:0,sandShieldLeft:0,shieldAt:GAARA_RULES.shieldFirst,zones:[]}:{cooldowns:{scalpel:0,disrupt:5,heal:8,evasion:3,cross:4,extract:9,autopsy:8},healed:0}),orbitDir:1,orbitLeft:2};}
export function tickKabuto(b,p,clones,dt,move,hit,signal,random=Math.random){
 b.hit=Math.max(0,b.hit-dt);b.flash=Math.max(0,b.flash-dt);b.mark=Math.max(0,b.mark-dt);b.motion=false;b.attack=Math.max(0,b.attack-dt);
 for(const k of Object.keys(b.cooldowns))b.cooldowns[k]=Math.max(0,b.cooldowns[k]-dt);
 if(b.anim){b.anim.left-=dt;if(b.anim.left<=0)b.anim=null;}
 if(b.phase===1&&b.hp<=b.maxHP/2)b.phasePending=true;
 if(b.phase===1&&b.phasePending&&b.intent?.id!=='heal'){b.phase=2;b.phasePending=false;if(b.intent)b.cooldowns[b.intent.id]=b.intent.cooldown;b.intent=null;b.anim=null;b.attack=1;signal('kabutoPhase',b);return;}
 if(b.intent){const a=b.intent;a.left-=dt;if(a.left<=1e-8){b.intent=null;b.cooldowns[a.id]=a.cooldown;b.attack=.65;
  if(a.id==='heal'){const amount=Math.max(0,Math.min(b.maxHP*KABUTO_RULES.healFraction,b.maxHP*KABUTO_RULES.healCap-b.healed,b.maxHP-b.hp));b.hp+=amount;b.healed+=amount;signal('kabutoHeal',b,{...a,amount});}
  else if(a.id==='evasion'){const v=directionToward(p.x-b.x,p.z-b.z);move(b,-v.z*2.4*b.orbitDir,v.x*2.4*b.orbitDir);signal('kabutoEvade',b,a);}
  else {for(const q of [p,...clones])if(q.hp>0&&(q.life??1)>0&&(bossContains(a,q)||a.id==='cross'&&bossContains({...a,dx:-a.dz,dz:a.dx},q))){const landed=q===p&&!(p.invuln>0)&&!(p.substitution>0);hit(q,a.damage,b);if(landed&&a.id==='disrupt')signal('kabutoDisrupt',b,a);if(landed&&a.id==='extract')signal('kabutoExtract',b,a);}signal('strike',b,a);
   if(a.id==='autopsy'&&(a.pulse||1)<a.pulses){b.cooldowns[a.id]=0;b.attack=0;b.intent={...a,x:p.x,z:p.z,left:a.windup,total:a.windup,pulse:(a.pulse||1)+1};b.anim={k:'j',left:a.windup+.25,total:a.windup+.25,windup:a.windup};signal('windup',b,b.intent);}}
 }return;}
 const v=directionToward(p.x-b.x,p.z-b.z),d=distance(b,p);b.dirX=v.x;b.dirZ=v.z;
 if(!b.attack){const ready=b.spec.patterns.filter(a=>(a.phase||1)<=b.phase&&b.cooldowns[a.id]<=1e-8&&d<=a.reach&&(a.id!=='heal'||b.hp<=b.maxHP*KABUTO_RULES.healThreshold&&b.healed<b.maxHP*KABUTO_RULES.healCap));const heal=ready.find(a=>a.id==='heal');const varied=ready.filter(a=>a.id!==b.lastPattern);const opts=varied.length?varied:ready;const a=heal||opts[Math.floor(random()*opts.length)];if(a){const windup=a.windup;b.intent={...a,x:a.shape==='target'?p.x:b.x,z:a.shape==='target'?p.z:b.z,dx:v.x,dz:v.z,left:windup,total:windup};b.anim={k:a.id==='heal'?'l':'j',left:windup+.25,total:windup+.25,windup};b.lastPattern=a.id;signal('windup',b,b.intent);return;}}
 b.orbitLeft-=dt;if(b.orbitLeft<=0){b.orbitDir*=-1;b.orbitLeft=1.3+random()*1.4;}const desired=b.cooldowns.scalpel<.5?2.5:5,radial=Math.max(-.75,Math.min(1,(d-desired)*.6)),tan=d>8?.15:.8,dir=directionToward(v.x*radial-v.z*tan*b.orbitDir,v.z*radial+v.x*tan*b.orbitDir),x=b.x,z=b.z;move(b,dir.x*dt*b.spec.speed*(b.phase===2?KABUTO_RULES.phaseSpeed:1),dir.z*dt*b.spec.speed*(b.phase===2?KABUTO_RULES.phaseSpeed:1));b.motion=Math.hypot(b.x-x,b.z-z)>.0001;if(b.motion)b.walk+=dt*10;else b.orbitDir*=-1;
}

Object.assign(MIST_SCENES,{
 gaaraIntro:{title:'THE SAND GUARDIAN',lines:[['Gaara','The sand protects me. Can you say the same?'],['Naruto','I have people I want to protect. That is why I fight.'],['Gaara','Then show me your strength.']]},
 gaaraPhase:{title:'THE ONE-TAIL STIRS',lines:[['Gaara','Mother... more blood!'],['Naruto','That chakra... I know that feeling.'],['Gaara','I will crush everything!']]},
 gaaraFinal:{title:'SHUKAKU UNLEASHED',lines:[['Gaara','I cannot hold it back anymore...'],['Naruto','That chakra is taking over his body!'],['Gaara','RRRAAAAH!']]},
 gaaraEnd:{title:'THE LONELY JINCHURIKI',lines:[['Gaara','Why do you keep getting back up?'],['Naruto','Because being alone is not the only way to live.'],['Gaara','... I will remember that.']]}
});
Object.assign(MIST_CAMERA,{gaaraIntro:[{zoom:1.9,yaw:.18},{zoom:1.6,yaw:-.16},{zoom:2.1,yaw:.2}],gaaraPhase:[{zoom:2.2,yaw:-.2},{zoom:1.7,yaw:.1},{zoom:1.5,yaw:.2,lookY:1.7}],gaaraFinal:[{zoom:1.5,yaw:.18,lookY:2.1},{zoom:1.5,yaw:-.15},{zoom:1.15,yaw:.2,lookY:2.1}],gaaraEnd:[{zoom:1.8,yaw:.2},{zoom:1.6,yaw:-.12},{zoom:2,yaw:.12}]});
export function absorbGaaraDamage(b,damage,signal){
 if(!b.independent||b.id!=='gaara'||!(b.sandShield>0)||damage<=0)return damage;
 const absorbed=Math.min(b.sandShield,damage);b.sandShield-=absorbed;signal('sandAbsorb',b,{amount:absorbed});
 if(b.sandShield<=0){b.sandShield=0;b.sandShieldLeft=0;if(b.intent)b.cooldowns[b.intent.id]=b.intent.cooldown;b.intent=null;b.anim=null;b.attack=Math.max(b.attack,GAARA_RULES.breakRecovery);signal('sandBreak',b);}
 return damage-absorbed;
}
export function sandSlow(b,p){return b?.id==='gaara'&&b.independent&&b.zones.some(z=>z.left>0&&distance(z,p)<=z.radius)?GAARA_RULES.zoneSlow:1;}
export function tickGaara(b,p,clones,dt,move,hit,signal,random=Math.random){
 const cfg=GAARA_RULES;
 b.hit=Math.max(0,b.hit-dt);b.flash=Math.max(0,b.flash-dt);b.mark=Math.max(0,b.mark-dt);b.motion=false;b.attack=Math.max(0,b.attack-dt);
 for(const k of Object.keys(b.cooldowns))b.cooldowns[k]=Math.max(0,b.cooldowns[k]-dt);
 b.zones=b.zones.filter(z=>(z.left-=dt)>1e-8);
 b.shieldAt=Math.max(0,b.shieldAt-dt);
 if(b.sandShieldLeft>0){b.sandShieldLeft=Math.max(0,b.sandShieldLeft-dt);if(b.sandShieldLeft<=1e-8){b.sandShieldLeft=0;b.sandShield=0;signal('sandExpire',b);}}
 if(b.anim){b.anim.left-=dt;if(b.anim.left<=0)b.anim=null;}
 if(b.hp<=b.maxHP*cfg.finalThreshold+1e-8&&b.phase<3){b.phase=3;b.sandShield=0;b.sandShieldLeft=0;b.zones=[];b.intent=null;b.anim=null;b.attack=1.3;b.lastPattern=null;b.cooldowns.sandDetonation=0;b.cooldowns.sandShuriken=2;b.cooldowns.tailRend=3.5;b.cooldowns.sandEruption=5;signal('gaaraFinal',b);return;}
 if(b.hp<=b.maxHP*.5&&b.phase===1){b.phase=2;if(b.intent)b.cooldowns[b.intent.id]=b.intent.cooldown;b.intent=null;b.anim=null;b.attack=1.2;signal('gaaraPhase',b);return;}
 if(b.phase<3&&b.shieldAt<=1e-8&&b.attack<=0&&!b.intent){b.sandShield=cfg.shieldHP;b.sandShieldLeft=cfg.shieldDuration;b.shieldAt=cfg.shieldCooldown;signal('sandShield',b);}
 if(b.intent){const a=b.intent;a.left-=dt;if(a.left<=1e-8){b.intent=null;b.cooldowns[a.id]=a.cooldown;b.attack=b.phase===3?.5:.65;if(!a.projectile)for(const q of [p,...clones])if(q.hp>0&&(q.life??1)>0&&bossContains(a,q))hit(q,a.damage,b);
  if(a.zone)b.zones.push({x:a.x,z:a.z,radius:a.radius,left:cfg.zoneDuration});signal('strike',b,a);if(a.pulses&&(a.pulse||1)<a.pulses){const n=(a.pulse||1)+1,v=directionToward(p.x-b.x,p.z-b.z),angle=(random()-.5)*.7,dx=v.x*Math.cos(angle)-v.z*Math.sin(angle),dz=v.x*Math.sin(angle)+v.z*Math.cos(angle),delay=a.id==='sandDetonation'?.65+random()*.3:a.id==='sandShuriken'?.55+random()*.2:.7+random()*.2;b.cooldowns[a.id]=0;b.attack=0;b.intent={...a,x:a.shape==='target'?p.x:b.x,z:a.shape==='target'?p.z:b.z,dx,dz,pulse:n,left:delay,total:delay};b.dirX=dx;b.dirZ=dz;b.anim={k:a.id==='tailRend'?'j':'l',left:delay+.25,total:delay+.25,windup:delay};signal('windup',b,b.intent);}}return;}
 const v=directionToward(p.x-b.x,p.z-b.z),d=distance(b,p);b.dirX=v.x;b.dirZ=v.z;
 if(!b.attack){const ready=b.spec.patterns.filter(a=>(b.phase===3?a.phase===3:(a.phase||1)<=b.phase)&&b.cooldowns[a.id]<=1e-8&&d<=a.reach),varied=ready.filter(a=>a.id!==b.lastPattern),options=varied.length?varied:ready;const a=options.find(a=>a.id==='sandTsunami')||options[Math.floor(random()*options.length)];
  if(a){b.intent={...a,x:a.shape==='target'?p.x:b.x,z:a.shape==='target'?p.z:b.z,dx:v.x,dz:v.z,left:a.windup,total:a.windup};b.anim={k:a.id==='shukakuClaw'||a.id==='tailRend'?'j':'l',left:a.windup+.3,total:a.windup+.3,windup:a.windup};b.lastPattern=a.id;signal('windup',b,b.intent);return;}}
 b.orbitLeft-=dt;if(b.orbitLeft<=0){b.orbitDir*=-1;b.orbitLeft=1.6+random()*1.2;}const desired=b.phase===3?4.5:b.phase===2?5.5:7,radial=Math.max(-1,Math.min(1,(d-desired)*.6)),tan=d>desired+3?.22:.68,dir=directionToward(v.x*radial-v.z*tan*b.orbitDir,v.z*radial+v.x*tan*b.orbitDir),x=b.x,z=b.z,speed=b.spec.speed*(b.phase===3?cfg.finalSpeed:b.phase===2?cfg.phaseSpeed:1);move(b,dir.x*speed*dt,dir.z*speed*dt);b.motion=Math.hypot(b.x-x,b.z-z)>.0001;if(b.motion)b.walk+=dt*speed*2.5;else b.orbitDir*=-1;
}

Object.assign(MIST_SCENES,{
 orochimaruIntro:{title:'THE IMMORTAL SERPENT',lines:[['Orochimaru','How fascinating. Let me see the power hiding inside you.'],['Naruto','I am not one of your experiments!'],['Orochimaru','Then entertain me.']]},
 orochimaruPhase:{title:'THE WHITE SERPENT',lines:[['Orochimaru','This body is merely a vessel.'],['Naruto','What are you?!'],['Orochimaru','Something that refuses to die.']]},
 orochimaruFinal:{title:'THE TRUE WHITE SERPENT',lines:[['Orochimaru','You have destroyed my vessel...'],['Naruto','What is that thing?!'],['Orochimaru','Behold my true form!']]},
 orochimaruEnd:{title:'THE FORBIDDEN LABORATORY',lines:[['Orochimaru','Interesting... I will remember this.'],['Naruto','You are not taking anyone else!']]}
});
Object.assign(MIST_CAMERA,{orochimaruIntro:[{zoom:1.9,yaw:.22},{zoom:1.6,yaw:-.16},{zoom:2.1,yaw:.1}],orochimaruPhase:[{zoom:2,yaw:-.22},{zoom:1.6,yaw:.14},{zoom:1.8,yaw:.24}],orochimaruFinal:[{zoom:1.65,yaw:.2,lookY:1.6},{zoom:1.55,yaw:-.15},{zoom:1.1,yaw:.22,lookY:1.9}],orochimaruEnd:[{zoom:1.8,yaw:.2},{zoom:1.6,yaw:-.1}]});
export function orochimaruTargets(b){return b?.id==='orochimaru'&&b.independent?[...b.snakes.filter(s=>s.hp>0&&s.life>0),...(b.husk?.hp>0&&b.husk.life>0?[b.husk]:[])]:[];}
export function hurtOroMinion(b,e,damage,signal){
 if(!orochimaruTargets(b).includes(e)||damage<=0)return false;
 e.hp=Math.max(0,e.hp-damage);e.flash=.18;signal('oroMinionHit',b,{target:e,damage});
 if(!e.hp){e.life=0;signal(e.oroHusk?'oroHuskBroken':'oroSnakeDown',b,{target:e});if(e.oroHusk){b.husk=null;b.attack=Math.max(b.attack,1.5);}}
 return true;
}
export function tickOrochimaru(b,p,clones,dt,move,hit,signal,random=Math.random){
 const c=ORO_RULES,alive=q=>q.hp>0&&(q.life??1)>0;
 b.hit=Math.max(0,b.hit-dt);b.flash=Math.max(0,b.flash-dt);b.mark=Math.max(0,b.mark-dt);b.attack=Math.max(0,b.attack-dt);b.motion=false;
 for(const k of Object.keys(b.cooldowns))b.cooldowns[k]=Math.max(0,b.cooldowns[k]-dt);
 if(b.anim){b.anim.left-=dt;if(b.anim.left<=0)b.anim=null;}
 if(b.hp<=b.maxHP*.5&&b.phase===1){b.phase=2;b.intent=null;b.anim=null;b.attack=1.2;signal('orochimaruPhase',b);return;}
 if(b.husk){b.husk.flash=Math.max(0,b.husk.flash-dt);b.husk.life-=dt;if(b.husk.life<=1e-8){const amount=Math.min(c.shedHeal,b.maxHP-b.hp);b.hp+=amount;b.husk=null;signal('oroShedHeal',b,{amount});}}
 if(!b.shedUsed&&b.hp<=b.maxHP*c.shedThreshold+1e-8){b.shedUsed=true;b.husk={id:'oro-husk',oroHusk:true,x:b.x,z:b.z,hp:c.huskHP,maxHP:c.huskHP,life:c.huskLife,flash:0};b.intent=null;b.anim=null;b.attack=.9;const v=directionToward(b.x-p.x,b.z-p.z);move(b,v.x*4,v.z*4);signal('oroShed',b,{target:b.husk});return;}
 if(b.phase===2&&b.shedUsed&&!b.husk&&b.hp<=b.maxHP*c.finalThreshold+1e-8){b.phase=3;b.intent=null;b.anim=null;b.attack=1.3;b.snakes=[];b.clouds=[];b.lastPattern=null;b.cooldowns.trueFang=0;b.cooldowns.trueMiasma=2;b.cooldowns.trueEruption=3;b.cooldowns.trueCoil=1;signal('orochimaruFinal',b);return;}
 b.clouds=b.clouds.filter(q=>(q.life-=dt)>1e-8);for(const q of b.clouds)if(!q.applied&&distance(q,p)<=q.radius&&p.hp>0&&!(p.invuln>0)&&!(p.substitution>0)){q.applied=true;signal('oroVenom',b,q);}
 for(const s of b.snakes){s.life-=dt;s.flash=Math.max(0,s.flash-dt);s.attack=Math.max(0,s.attack-dt);if(!alive(s))continue;
  if(s.intent){s.intent.left-=dt;if(s.intent.left<=1e-8){const a=s.intent;s.intent=null;s.attack=c.biteCooldown;for(const q of [p,...clones])if(alive(q)&&distance(q,a)<=c.biteRange)hit(q,c.biteDamage,s);signal('oroBite',b,{target:s,x:a.x,z:a.z,radius:c.biteRange});}continue;}
  const target=[p,...clones].filter(alive).sort((a,d)=>distance(s,a)-distance(s,d))[0];if(!target)continue;const v=directionToward(target.x-s.x,target.z-s.z);s.dirX=v.x;s.dirZ=v.z;
  if(distance(s,target)<=c.biteRange){if(s.attack<=0)s.intent={x:target.x,z:target.z,left:c.biteWindup,total:c.biteWindup};}else move(s,v.x*c.snakeSpeed*dt,v.z*c.snakeSpeed*dt);
 }
 b.snakes=b.snakes.filter(alive);
 if(b.intent){const a=b.intent;a.left-=dt;if(a.left<=1e-8){b.intent=null;b.cooldowns[a.id]=a.cooldown;b.attack=b.phase===3?.65:.7;
  if(a.summon){for(let i=b.snakes.length;i<c.snakeCap;i++){const th=i*2*Math.PI/3;const q={id:'oro-snake-'+(++b.serial),oroSnake:true,x:b.x,z:b.z,hp:c.snakeHP,maxHP:c.snakeHP,life:c.snakeLife,attack:1+i*.55,flash:0,dirX:1,dirZ:0};move(q,Math.cos(th)*2.3,Math.sin(th)*2.3);b.snakes.push(q);}signal('oroSummon',b,a);}
  else{for(const q of [p,...clones])if(alive(q)&&bossContains(a,q)){const landed=q===p&&!(p.invuln>0)&&!(p.substitution>0);hit(q,a.damage,b);if(a.venom&&landed)signal('oroVenom',b,a);}signal('strike',b,a);if(a.cloud){b.clouds.push({x:a.x,z:a.z,radius:a.radius,life:c.cloudLife,applied:distance(a,p)<=a.radius&&!(p.substitution>0)});b.clouds=b.clouds.slice(-c.cloudCap);}if(a.lunge)move(b,a.dx*a.lunge,a.dz*a.lunge);}
  if(a.pulses&&(a.pulse||1)<a.pulses){const v=directionToward(p.x-b.x,p.z-b.z);b.intent={...a,x:a.shape==='target'?p.x:b.x,z:a.shape==='target'?p.z:b.z,dx:v.x,dz:v.z,left:.85,total:.85,pulse:(a.pulse||1)+1};b.cooldowns[a.id]=0;b.attack=0;signal('windup',b,b.intent);}
 }return;}
 const v=directionToward(p.x-b.x,p.z-b.z),d=distance(b,p);b.dirX=v.x;b.dirZ=v.z;
 if(!b.attack){const ready=b.spec.patterns.filter(a=>(b.phase===3?a.phase===3:(a.phase||1)<=b.phase)&&b.cooldowns[a.id]<=1e-8&&d<=a.reach&&(!a.summon||b.snakes.length<c.snakeCap)),varied=ready.filter(a=>a.id!==b.lastPattern),options=varied.length?varied:ready,a=options.find(a=>a.summon)||options[Math.floor(random()*options.length)];if(a){b.intent={...a,x:a.shape==='target'?p.x:b.x,z:a.shape==='target'?p.z:b.z,dx:v.x,dz:v.z,left:a.windup,total:a.windup};b.anim={k:a.summon||a.venom?'l':'j',left:a.windup+.25,total:a.windup+.25,windup:a.windup};b.lastPattern=a.id;signal('windup',b,b.intent);return;}}
 b.orbitLeft-=dt;if(b.orbitLeft<=0){b.orbitDir*=-1;b.orbitLeft=1.5+random();}const radial=Math.max(-1,Math.min(1,(d-(b.phase===3?3.8:4.5))*.6)),dir=directionToward(v.x*radial-v.z*.65*b.orbitDir,v.z*radial+v.x*.65*b.orbitDir),speed=b.spec.speed*(b.phase===3?c.finalSpeed:b.phase===2?c.phaseSpeed:1),x=b.x,z=b.z;move(b,dir.x*speed*dt,dir.z*speed*dt);b.motion=distance(b,{x,z})>.0001;if(b.motion)b.walk+=dt*speed*2.5;
}

Object.assign(MIST_SCENES,{
 kimimaroIntro:{title:'THE LAST KAGUYA',lines:[['Kimimaro','My body belongs to Lord Orochimaru. I will not let you pass.'],['Naruto','You can decide your own future!'],['Kimimaro','Then show me your resolve.']]},
 kimimaroPhase:{title:'CURSE MARK · STAGE ONE',lines:[['Kimimaro','I have not yet shown you everything.'],['Naruto','Those markings...!']]},
 kimimaroFinal:{title:'CURSE MARK · STAGE TWO',lines:[['Kimimaro','Even if my body fails, my purpose remains.'],['Naruto','I will end this fight!']]},
 kimimaroEnd:{title:'THE LAST DANCE',lines:[['Kimimaro','So... this is as far as I can go.'],['Naruto','You were more than just a weapon.'],['Naruto','I need to become stronger. There is still so much to learn.']]}
});
Object.assign(MIST_CAMERA,{kimimaroIntro:[{zoom:1.9,yaw:.2},{zoom:1.6,yaw:-.16},{zoom:2,yaw:.1}],kimimaroPhase:[{zoom:2,yaw:-.2},{zoom:1.7,yaw:.15}],kimimaroFinal:[{zoom:1.35,yaw:.2,lookY:1.8},{zoom:1.5,yaw:-.15}],kimimaroEnd:[{zoom:1.8,yaw:.2},{zoom:1.6,yaw:-.1},{zoom:1.7,yaw:.1}]});
export function boneSlow(b,p){return b?.id==='kimimaro'&&b.independent&&b.zones.some(z=>z.left>0&&distance(z,p)<=z.radius)?KIMI_RULES.forestSlow:1;}
export function tickKimimaro(b,p,clones,dt,move,hit,signal,random=Math.random){
 const c=KIMI_RULES,alive=q=>q.hp>0&&(q.life??1)>0;
 b.hit=Math.max(0,b.hit-dt);b.flash=Math.max(0,b.flash-dt);b.mark=Math.max(0,b.mark-dt);b.attack=Math.max(0,b.attack-dt);b.motion=false;
 for(const k of Object.keys(b.cooldowns))b.cooldowns[k]=Math.max(0,b.cooldowns[k]-dt);
 b.zones=b.zones.filter(q=>(q.left-=dt)>1e-8);if(b.anim){b.anim.left-=dt;if(b.anim.left<=0)b.anim=null;}
 const next=b.hp<=b.maxHP*c.stageTwo+1e-8?3:b.hp<=b.maxHP*c.stageOne+1e-8?2:1;
 if(next>b.phase){b.phase=next;b.intent=null;b.anim=null;b.attack=1.2;b.lastPattern=null;if(next===3){b.zones=[];b.cooldowns.seedlingFern=2;b.cooldowns.cursedDrill=0;b.cooldowns.cursedVolley=4;b.cooldowns.cursedTail=3;}signal(next===3?'kimimaroFinal':'kimimaroPhase',b);return;}
 if(b.intent){const a=b.intent;a.left-=dt;if(a.left<=1e-8){b.intent=null;b.cooldowns[a.id]=a.cooldown;b.attack=b.phase===3?.7:.6;
  if(!a.projectile)for(const q of [p,...clones])if(alive(q)&&bossContains(a,q))hit(q,a.damage,b);
  if(a.forest){b.zones.push({x:a.x,z:a.z,radius:a.radius,left:c.forestLife});b.zones=b.zones.slice(-c.forestCap);}
  signal('strike',b,a);if(a.lunge)move(b,a.dx*a.lunge,a.dz*a.lunge);
  if(a.pulses&&(a.pulse||1)<a.pulses){const v=directionToward(p.x-b.x,p.z-b.z),delay=a.forest?.85:.65;b.intent={...a,x:a.shape==='target'?p.x:b.x,z:a.shape==='target'?p.z:b.z,dx:v.x,dz:v.z,pulse:(a.pulse||1)+1,left:delay,total:delay};b.cooldowns[a.id]=0;b.attack=0;b.dirX=v.x;b.dirZ=v.z;signal('windup',b,b.intent);}
 }return;}
 const v=directionToward(p.x-b.x,p.z-b.z),d=distance(b,p);b.dirX=v.x;b.dirZ=v.z;
 if(!b.attack){const ready=b.spec.patterns.filter(a=>(b.phase===3?a.phase===3:(a.phase||1)<=b.phase)&&b.cooldowns[a.id]<=1e-8&&d<=a.reach),varied=ready.filter(a=>a.id!==b.lastPattern),opts=varied.length?varied:ready,a=opts.find(a=>a.forest)||opts[Math.floor(random()*opts.length)];if(a){b.intent={...a,x:a.shape==='target'?p.x:b.x,z:a.shape==='target'?p.z:b.z,dx:v.x,dz:v.z,left:a.windup,total:a.windup};b.anim={k:a.forest||a.projectile?'l':'j',left:a.windup+.3,total:a.windup+.3,windup:a.windup};b.lastPattern=a.id;signal('windup',b,b.intent);return;}}
 b.orbitLeft-=dt;if(b.orbitLeft<=0){b.orbitDir*=-1;b.orbitLeft=1.2+random();}const radial=Math.max(-1,Math.min(1,(d-2.8)*.7)),dir=directionToward(v.x*radial-v.z*.32*b.orbitDir,v.z*radial+v.x*.32*b.orbitDir),speed=b.spec.speed*(b.phase===3?c.finalSpeed:b.phase===2?c.phaseSpeed:1),x=b.x,z=b.z;move(b,dir.x*speed*dt,dir.z*speed*dt);b.motion=distance(b,{x,z})>.0001;if(b.motion)b.walk+=dt*speed*2.5;
}

export function valleyEligible(progress){return progress?.mistStage===4&&['kabuto','gaara','orochimaru','kimimaro'].every(id=>progress.worldDefeated?.includes(id));}
export function valleyDamageFloor(b){return b.maxHP*VALLEY_RULES.thresholds[Math.min(3,b.phase-1)];}
export function valleyClashOutcome(charge,kyubi,phase){const power=Math.max(0,Math.min(1,charge||0))*.8+(kyubi?.55:0),need=[.30,.45,.65,.85][Math.min(3,Math.max(0,phase-1))];return power>=need+.12?'win':power>=need-.12?'draw':'loss';}
Object.assign(MIST_SCENES,{
 sasukeIntro:{title:'VALLEY OF THE END',lines:[['Naruto','Sasuke! I promised I would bring you home.'],['Sasuke','I have chosen my own path. Stop following me.'],['Naruto','Then I will stop you right here!']]},
 sasukeSharingan:{title:'SHARINGAN · THE RIVAL AWAKENS',lines:[['Sasuke','I can see your movements now.'],['Naruto','I will never give up on you!']]},
 sasukeCurse:{title:'CURSE MARK · STAGE ONE',lines:[['Sasuke','This is the power I need.'],['Naruto','Orochimaru is using you!']]},
 sasukeFinal:{title:'CURSE MARK · STAGE TWO',lines:[['Sasuke','I will cut every bond that holds me back.'],['Naruto','You are my friend! I will not let you disappear!']]},
 sasukeEnd:{title:'A BOND THAT REMAINS',lines:[['Sasuke','...I will find my own way to become stronger.'],['Naruto','Sasuke... I still could not bring you home.']]}
});
Object.assign(MIST_CAMERA,{sasukeIntro:[{zoom:1.55,yaw:-.15},{zoom:1.8,yaw:.2},{zoom:1.55,yaw:-.2}],sasukeSharingan:[{zoom:2.05,yaw:.25},{zoom:1.7,yaw:-.2}],sasukeCurse:[{zoom:2,yaw:.2},{zoom:1.7,yaw:-.2}],sasukeFinal:[{zoom:1.45,yaw:.18,lookY:1.8},{zoom:1.45,yaw:-.18}],sasukeEnd:[{zoom:1.25,yaw:.12},{zoom:1.8,yaw:-.18}]});
export function tickValleySasuke(b,p,clones,dt,move,hit,signal,random=Math.random){
 const c=VALLEY_RULES,alive=q=>q.hp>0&&(q.life??1)>0;
 b.hit=Math.max(0,b.hit-dt);b.flash=Math.max(0,b.flash-dt);b.mark=Math.max(0,b.mark-dt);b.attack=Math.max(0,b.attack-dt);b.counterAt=Math.max(0,b.counterAt-dt);b.evadeAt=Math.max(0,(b.evadeAt||0)-dt);b.evadeVisual=Math.max(0,(b.evadeVisual||0)-dt);b.motion=false;b.sprinting=false;
 for(const k of Object.keys(b.cooldowns))b.cooldowns[k]=Math.max(0,b.cooldowns[k]-dt);
 if(b.anim){b.anim.left-=dt;if(b.anim.left<=0)b.anim=null;}
 if(b.phase<4&&b.hp<=valleyDamageFloor(b)+1e-8){b.phase++;b.intent=null;b.rush=null;b.anim=null;b.air=0;b.mark=0;b.attack=1.3;b.lastPattern=null;signal(['','', 'sasukeSharingan','sasukeCurse','sasukeFinal'][b.phase],b);return;}
 if(b.phase===4&&b.hp<=valleyDamageFloor(b)+1e-8){if(!b.finalDuel)signal('sasukeUltimate',b);return;}
 if(b.rush){const r=b.rush,step=Math.min(r.remaining,c.rushSpeed*dt),n=Math.max(1,Math.ceil(step/.18));b.motion=b.sprinting=true;for(let j=0;j<n;j++){if(!r.hit){const v=directionToward(p.x-b.x,p.z-b.z,r.dx,r.dz);r.dx=v.x;r.dz=v.z;}b.dirX=r.dx;b.dirZ=r.dz;const x=b.x,z=b.z;move(b,r.dx*step/n,r.dz*step/n);if(!r.hit&&alive(p)&&distance(b,p)<=r.radius){r.hit=true;signal('valleyRushHit',b,r);if(!b.rush)return;}if(r.hit&&Math.hypot(b.x-x,b.z-z)<.001){r.remaining=0;break;}}r.remaining-=step;b.walk+=dt*32;if(r.remaining<=1e-8){b.rush=null;b.attack=c.rushRecovery;b.motion=b.sprinting=false;signal('valleyRushEnd',b,r);}return;}
 if(b.intent){const a=b.intent;a.left-=dt;if(a.rush&&a.left>c.rushLock){const v=directionToward(p.x-b.x,p.z-b.z);a.dx=v.x;a.dz=v.z;b.dirX=v.x;b.dirZ=v.z;}b.air=a.dive?Math.sin(Math.PI*Math.max(0,1-a.left/a.total))*1.15:0;if(a.left<=1e-8){b.intent=null;b.air=0;b.cooldowns[a.id]=a.cooldown;b.attack=(a.clash?1.05:.65)*c.recovery[b.phase-1];
  if(a.rush){b.rush={...a,remaining:c.rushTravel,hit:false};b.attack=0;b.anim=null;signal('valleyRushStart',b,a);return;}
  if(!a.projectile)for(const q of [p,...clones])if(alive(q)&&bossContains(a,q))hit(q,a.damage,b);
  signal('strike',b,a);if(a.lunge)move(b,a.dx*a.lunge,a.dz*a.lunge);else if(a.dive&&a.shape==='target'){const v=directionToward(a.x-b.x,a.z-b.z),d=Math.min(8,distance(b,a));move(b,v.x*d,v.z*d);}
  if(a.pulses&&(a.pulse||1)<a.pulses){const v=directionToward(p.x-b.x,p.z-b.z),delay=a.id==='predatorRush'?.60:a.id==='curseFlurry'?.50:.48;b.intent={...a,x:a.shape==='target'?p.x:b.x,z:a.shape==='target'?p.z:b.z,dx:v.x,dz:v.z,pulse:(a.pulse||1)+1,left:delay,total:delay};b.cooldowns[a.id]=0;b.attack=0;b.dirX=v.x;b.dirZ=v.z;signal('windup',b,b.intent);}
 }return;}
 const v=directionToward(p.x-b.x,p.z-b.z),d=distance(b,p);b.dirX=v.x;b.dirZ=v.z;
 if(!b.attack){const ready=b.spec.patterns.filter(a=>(b.phase===4?a.phase===4:b.phase===3?a.phase>=2&&a.phase<=3:b.phase===2?a.phase<=2&&a.id!=='valleyChidori':a.phase===1)&&b.cooldowns[a.id]<=1e-8&&d<=a.reach),varied=ready.filter(a=>a.id!==b.lastPattern),opts=varied.length?varied:ready,a=opts.sort((x,y)=>(b.uses[x.id]||0)/(x.projectile==='inferno'?1.7:1)-(b.uses[y.id]||0)/(y.projectile==='inferno'?1.7:1)||Number(Boolean(y.rush||y.projectile==='inferno'))-Number(Boolean(x.rush||x.projectile==='inferno'))||Number(Boolean(y.clash))-Number(Boolean(x.clash)))[0];if(a){b.uses[a.id]=(b.uses[a.id]||0)+1;if(a.flank){move(b,-v.z*2*b.orbitDir,v.x*2*b.orbitDir);}const aim=directionToward(p.x-b.x,p.z-b.z);b.intent={...a,damage:Math.round(a.damage*c.damageScale[b.phase-1]),x:a.shape==='target'?p.x:b.x,z:a.shape==='target'?p.z:b.z,dx:aim.x,dz:aim.z,left:a.windup,total:a.windup};b.anim={k:a.clash||a.projectile||a.rush?'l':'j',left:a.windup+.3,total:a.windup+.3,windup:a.windup};b.lastPattern=a.id;signal('windup',b,b.intent);return;}}
 b.orbitLeft-=dt;if(b.orbitLeft<=0){b.orbitDir*=-1;b.orbitLeft=.9+random()*.9;}const radial=Math.max(-1,Math.min(1,(d-(b.phase===4?4:3.2))*.65)),dir=directionToward(v.x*radial-v.z*.57*b.orbitDir,v.z*radial+v.x*.57*b.orbitDir),speed=b.spec.speed*c.speed[b.phase-1],x=b.x,z=b.z;move(b,dir.x*speed*dt,dir.z*speed*dt);b.motion=distance(b,{x,z})>.0001;if(b.motion){b.walk+=dt*speed*2.5;b.sprinting=b.phase>=2;}
}

export function newValleyUltimate(){return {stage:'charge',left:VALLEY_RULES.ultimateTime,held:0,key:null,elapsed:0,impactPlayed:false};}
// Resolve charge before timeout on a shared simulation tick; a late start cannot borrow time.
export function advanceValleyCharge(q,dt,holding){if(q.stage!=='charge')return q.stage;const step=Math.min(Math.max(0,dt),Math.max(0,q.left));q.held=holding?Math.min(VALLEY_RULES.ultimateCharge,q.held+step):0;q.left=Math.max(0,q.left-step);if(q.held>=VALLEY_RULES.ultimateCharge-1e-8){q.held=VALLEY_RULES.ultimateCharge;q.stage='cinematic';q.elapsed=0;}else if(q.left<=1e-8)q.stage='failed';return q.stage;}
