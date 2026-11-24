import {directionToward} from './combat-data.js';
export const ARENA={x:32,z:-2,r:12};
export const BOSSES=[
 {id:'zabuza',name:'Zabuza Momochi',hp:360,speed:2.4,reward:[['mistBlade',1],['pill',3]],xp:250,coins:180,intro:'The mist is my territory. Show me what you have learned, shinobi.',patterns:[{name:'Sword Slash',shape:'circle',radius:2.8,windup:.65,damage:24,reach:3.1},{name:'Water Dragon',shape:'line',radius:1.15,length:10,windup:.9,damage:30,reach:10},{name:'Mist Whirlwind',shape:'circle',radius:4.2,windup:.8,damage:34,reach:4.5}]},
 {id:'haku',name:'Haku',hp:300,speed:3.5,reward:[['iceMask',1],['scroll',1]],xp:300,coins:220,intro:'I do not want to hurt you. But I will not abandon my purpose.',patterns:[{name:'Ice Needles',shape:'line',radius:.8,length:12,windup:.55,damage:20,reach:12},{name:'Ice Mirrors',shape:'target',radius:2.3,windup:.85,damage:30,reach:10},{name:'Needle Dance',shape:'target',radius:3.1,windup:.65,damage:32,reach:12}]}
];
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function newBossProgress(){return {defeated:[],mistStage:0,kyubiUnlocked:false};}
export function validateBossProgress(raw){if(!raw||!Array.isArray(raw.defeated)||raw.defeated.length>BOSSES.length||raw.defeated.some((id,i)=>id!==BOSSES[i].id))throw Error('Invalid boss progress.');const legacy=raw.mistStage===undefined;const mistStage=legacy?(raw.defeated.length===2?4:raw.defeated.length===1?1:0):raw.mistStage;if(!Number.isInteger(mistStage)||mistStage<0||mistStage>4||(!legacy&&typeof raw.kyubiUnlocked!=='boolean')||mistStage===4&&raw.defeated.length!==2||raw.defeated.length===2&&mistStage!==4||mistStage>=2&&!legacy&&!raw.kyubiUnlocked)throw Error('Invalid Mist encounter progress.');return {defeated:[...raw.defeated],mistStage,kyubiUnlocked:legacy?true:raw.kyubiUnlocked};}
export function nextBoss(progress){return BOSSES[progress.defeated.length]||null;}
export function makeBoss(spec){return {id:spec.id,kind:spec.id,spec,x:ARENA.x,z:ARENA.z,hp:spec.hp,maxHP:spec.hp,dirX:-1,dirZ:0,phase:1,index:0,attack:1.4,hit:0,flash:0,mark:0,intent:null,motion:false,walk:0};}
export function bossContains(intent,target){const dx=target.x-intent.x,dz=target.z-intent.z;if(intent.shape!=='line')return Math.hypot(dx,dz)<=intent.radius;const along=dx*intent.dx+dz*intent.dz,side=Math.abs(dx*intent.dz-dz*intent.dx);return along>=0&&along<=intent.length&&side<=intent.radius;}
export function tickBoss(b,p,clones,dt,move,hit,signal){
 b.hit=Math.max(0,b.hit-dt);b.flash=Math.max(0,b.flash-dt);b.mark=Math.max(0,b.mark-dt);b.motion=false;
 if(b.anim){b.anim.left-=dt;if(b.anim.left<=0)b.anim=null;}
 if(b.hp<=b.maxHP*.5&&b.phase===1){b.phase=2;b.intent=null;b.anim=null;b.attack=.55;signal('phase',b);return;}
 if(b.intent){const a=b.intent;a.left-=dt;if(a.left<=0){b.intent=null;b.attack=b.enraged?.38:b.phase===2?.7:1.15;for(const target of [p,...clones])if((target.hp??0)>0&&(target.life??1)>0&&bossContains(a,target))hit(target,a.damage,b);signal('strike',b,a);}return;}
 b.attack=Math.max(0,b.attack-dt);const allies=clones.filter(a=>a.ally&&a.hp>0&&a.life>0);const target=b.scripted&&allies.length&&b.index%3!==2?allies[b.index%allies.length]:p;const v=directionToward(target.x-b.x,target.z-b.z);b.dirX=v.x;b.dirZ=v.z;
 const pattern=b.spec.patterns[b.index%(b.phase===2?3:2)],d=distance(b,target);
 if(!b.attack&&d<=pattern.reach){const x=pattern.shape==='target'?target.x:b.x,z=pattern.shape==='target'?target.z:b.z;const windup=pattern.windup*(b.phase===2?.8:1);b.intent={...pattern,x,z,dx:v.x,dz:v.z,left:windup,total:windup};b.anim={k:'j',left:windup+.25,total:windup+.25,windup};b.index++;signal('windup',b,b.intent);return;}
 if(d>Math.min(pattern.reach*.8,b.id==='haku'?5.5:2.5)){const speed=b.spec.speed*(b.phase===2?1.2:1);move(b,v.x*dt*speed,v.z*dt*speed);b.motion=true;b.walk+=dt*8;}
}
export function sandboxBoost(p,rpg,action,addItem){if(action==='level')p.xp=Math.min(1e9,p.xp+100);else if(action==='five')p.xp=Math.min(1e9,p.xp+500);else if(action==='coins')p.coins=Math.min(1e9,p.coins+500);else if(action==='restore'){p.hp=100;p.chakra=100;}else if(action==='supplies'){for(const [id,n] of [['ramen',5],['pill',5],['scroll',2]])addItem(rpg,id,n);}else return false;return true;}

// Scripted boss encounter definitions. Each scene is advanced explicitly by the player.
export const MIST_SCENES={
 opening:{title:'THE DEMON OF THE MIST',lines:[['Kakashi','Stay sharp, Naruto. I will draw his attention.'],['Zabuza','The Hidden Mist has no mercy for children.'],['Naruto','I am not backing down!']]},
 arrival:{title:'A SHINOBI BEHIND THE MASK',lines:[['Zabuza','Haku. Take care of the boy.'],['Haku','Forgive me. I cannot let you harm the one who gave me a purpose.'],['Kakashi','Naruto, stay with Sasuke. I will deal with Zabuza.'],['Sasuke','Try not to get in my way.']]},
 awakening:{title:'THE NINE-TAILS AWAKENS',lines:[['Sasuke','Naruto! Look out!'],['Haku','He shielded you without hesitation.'],['Naruto','Sasuke... No! I will not let you hurt my friends!'],['Naruto','This chakra... what is happening to me?']]},
 wrath:{title:'THE DEMON’S WRATH',lines:[['Haku','Zabuza... I have failed you.'],['Kakashi','It is over, Zabuza. Put down your sword.'],['Zabuza','Out of my way, Haku! Kakashi is mine!'],['Naruto','Haku! How could you do that?!'],['Zabuza','Haku... What have I done? I have nothing left!'],['Sasuke','Naruto. I am still standing. Let us finish this.']]},
 ending:{title:'THE END OF THE MIST',lines:[['Zabuza','Haku... forgive me.'],['Kakashi','A shinobi is more than a weapon. Remember that.'],['Sasuke','Not bad, Naruto.'],['Naruto','I will find my own ninja way.']]}
};
export const MIST_ALLIES={kakashi:{name:'Kakashi',kind:'npc',hp:135,speed:3.8,reach:3.6,damage:10,cooldown:2.6,effect:'water'},sasuke:{name:'Sasuke',kind:'sasuke',hp:95,speed:4.6,reach:4.1,damage:8,cooldown:2.2,effect:'fire'}};
export const MIST_RAGE={...BOSSES[0],name:'Zabuza · Wrath',speed:BOSSES[0].speed*1.45,patterns:[{name:'Furious Cleave',shape:'circle',radius:3.8,windup:.48,damage:36,reach:4},{name:'Raging Water Dragon',shape:'line',radius:1.45,length:12,windup:.65,damage:45,reach:12},{name:'Demon’s Whirlwind',shape:'circle',radius:5.6,windup:.7,damage:48,reach:5.8}]};
export function mistBoss(stage){const b=makeBoss(stage===3?MIST_RAGE:stage===1||stage===2?BOSSES[1]:BOSSES[0]);b.scripted=true;if(stage===2||stage===3){b.hp=b.maxHP*.5;b.phase=2;}if(stage===3)b.enraged=true;return b;}
export function mistAlly(id,x,z){const spec=MIST_ALLIES[id];return {id:'ally-'+id,ally:true,spec,kind:spec.kind,x,z,hp:spec.hp,maxHP:spec.hp,life:1,dirX:1,dirZ:0,walk:0,attack:1,hit:0,flash:0,motion:false};}
