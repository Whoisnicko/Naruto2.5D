import {directionToward} from './combat-data.js';
export const ARENA={x:32,z:-2,r:12};
export const BOSSES=[
 {id:'zabuza',name:'Zabuza Momochi',hp:360,speed:2.4,reward:[['mistBlade',1],['pill',3]],xp:250,coins:180,intro:'La niebla es mi territorio. Demostrame qué aprendiste, shinobi.',patterns:[{name:'Corte de espada',shape:'circle',radius:2.8,windup:.65,damage:24,reach:3.1},{name:'Dragón de agua',shape:'line',radius:1.15,length:10,windup:.9,damage:30,reach:10},{name:'Torbellino de niebla',shape:'circle',radius:4.2,windup:.8,damage:34,reach:4.5}]},
 {id:'haku',name:'Haku',hp:300,speed:3.5,reward:[['iceMask',1],['scroll',1]],xp:300,coins:220,intro:'No quiero lastimarte. Pero no voy a abandonar mi propósito.',patterns:[{name:'Agujas de hielo',shape:'line',radius:.8,length:12,windup:.55,damage:20,reach:12},{name:'Espejos de hielo',shape:'target',radius:2.3,windup:.85,damage:30,reach:10},{name:'Danza de agujas',shape:'target',radius:3.1,windup:.65,damage:32,reach:12}]}
];
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function newBossProgress(){return {defeated:[]};}
export function validateBossProgress(raw){if(!raw||!Array.isArray(raw.defeated)||raw.defeated.length>BOSSES.length||raw.defeated.some((id,i)=>id!==BOSSES[i].id))throw Error('Progreso de jefes inválido.');return {defeated:[...raw.defeated]};}
export function nextBoss(progress){return BOSSES[progress.defeated.length]||null;}
export function makeBoss(spec){return {id:spec.id,kind:spec.id,spec,x:ARENA.x,z:ARENA.z,hp:spec.hp,maxHP:spec.hp,dirX:-1,dirZ:0,phase:1,index:0,attack:1.4,hit:0,flash:0,mark:0,intent:null,motion:false,walk:0};}
export function bossContains(intent,target){const dx=target.x-intent.x,dz=target.z-intent.z;if(intent.shape!=='line')return Math.hypot(dx,dz)<=intent.radius;const along=dx*intent.dx+dz*intent.dz,side=Math.abs(dx*intent.dz-dz*intent.dx);return along>=0&&along<=intent.length&&side<=intent.radius;}
export function tickBoss(b,p,clones,dt,move,hit,signal){
 b.hit=Math.max(0,b.hit-dt);b.flash=Math.max(0,b.flash-dt);b.mark=Math.max(0,b.mark-dt);b.motion=false;
 if(b.anim){b.anim.left-=dt;if(b.anim.left<=0)b.anim=null;}
 if(b.hp<=b.maxHP*.5&&b.phase===1){b.phase=2;b.intent=null;b.anim=null;b.attack=.55;signal('phase',b);return;}
 if(b.intent){const a=b.intent;a.left-=dt;if(a.left<=0){b.intent=null;b.attack=b.phase===2?.7:1.15;for(const target of [p,...clones])if((target.hp??0)>0&&(target.life??1)>0&&bossContains(a,target))hit(target,a.damage,b);signal('strike',b,a);}return;}
 b.attack=Math.max(0,b.attack-dt);const v=directionToward(p.x-b.x,p.z-b.z);b.dirX=v.x;b.dirZ=v.z;
 const pattern=b.spec.patterns[b.index%(b.phase===2?3:2)],d=distance(b,p);
 if(!b.attack&&d<=pattern.reach){const x=pattern.shape==='target'?p.x:b.x,z=pattern.shape==='target'?p.z:b.z;const windup=pattern.windup*(b.phase===2?.8:1);b.intent={...pattern,x,z,dx:v.x,dz:v.z,left:windup,total:windup};b.anim={k:'j',left:windup+.25,total:windup+.25,windup};b.index++;signal('windup',b,b.intent);return;}
 if(d>Math.min(pattern.reach*.8,b.id==='haku'?5.5:2.5)){const speed=b.spec.speed*(b.phase===2?1.2:1);move(b,v.x*dt*speed,v.z*dt*speed);b.motion=true;b.walk+=dt*8;}
}
export function sandboxBoost(p,rpg,action,addItem){if(action==='level')p.xp=Math.min(1e9,p.xp+100);else if(action==='five')p.xp=Math.min(1e9,p.xp+500);else if(action==='coins')p.coins=Math.min(1e9,p.coins+500);else if(action==='restore'){p.hp=100;p.chakra=100;}else if(action==='supplies'){for(const [id,n] of [['ramen',5],['pill',5],['scroll',2]])addItem(rpg,id,n);}else return false;return true;}
