'use strict';
import { createRenderer } from './renderer.js';
import { createPixelSystem } from './pixel-renderer.js';
import { COMBAT,stepMotion,directionToward } from './combat-data.js';
import {prepareEnemy,roleFor,targetFor,damageModifier,tickEnemy,safeSubstitution} from './enemy-ai.js';
import { createAudio,createFeedback } from './feedback.js';
import { validateSave, readSave, writeSave, exportSave, importSave } from './save.js';
const $=id=>document.getElementById(id), canvas=$('c'), view=createRenderer(canvas);
const audio=createAudio(),feedback=createFeedback(view,$('damageLayer'));
let pixels=null;try{pixels=createPixelSystem(view.scene);}catch(e){console.warn('Pixel assets fallback',e);} 
const rgb=h=>[parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255], C={grass:rgb('87ad59'),path:rgb('e0bf87'),wood:rgb('815744'),roof:rgb('b45745'),wall:rgb('f2d5a0'),dark:rgb('344357'),water:rgb('5dabc0'),leaf:rgb('50874d'),stone:rgb('a2a498'),orange:rgb('ed8332'),skin:rgb('eec09a'),hair:rgb('f4ca48'),blue:rgb('6ee8ff')};
let mesh=[];function tri(a,b,c,color){for(const p of [a,b,c])mesh.push(...p,...color)}function quad(a,b,c,d,col){tri(a,b,c,col);tri(a,c,d,col)}
function box(x,y,z,w,h,d,col){let a=[x-w/2,y,z-d/2],b=[x+w/2,y,z-d/2],c=[x+w/2,y,z+d/2],e=[x-w/2,y,z+d/2],A=[a[0],y+h,a[2]],B=[b[0],y+h,b[2]],D=[c[0],y+h,c[2]],E=[e[0],y+h,e[2]];quad(A,E,D,B,col);quad(a,A,B,b,col);quad(b,B,D,c,col);quad(c,D,E,e,col);quad(e,E,A,a,col)}
function cone(x,y,z,r,h,col,n=8,top=0){for(let i=0;i<n;i++){let a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n,p=[x+Math.cos(a)*r,y,z+Math.sin(a)*r],q=[x+Math.cos(b)*r,y,z+Math.sin(b)*r],P=[x+Math.cos(a)*top,y+h,z+Math.sin(a)*top],Q=[x+Math.cos(b)*top,y+h,z+Math.sin(b)*top];quad(p,P,Q,q,col);if(top)tri(P,[x,y+h,z],Q,col)}}
function disc(x,y,z,r,col,n=16){for(let i=0;i<n;i++){let a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n;tri([x,y,z],[x+Math.cos(b)*r,y,z+Math.sin(b)*r],[x+Math.cos(a)*r,y,z+Math.sin(a)*r],col)}}
function sphere(x,y,z,r,col){cone(x,y-r,z,r*.7,r,col,10,r);cone(x,y,z,r,r,col,10,0)}
function ring(x,y,z,r,w,col,n=24){for(let i=0;i<n;i++){let a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n;quad([x+Math.cos(a)*(r-w),y,z+Math.sin(a)*(r-w)],[x+Math.cos(b)*(r-w),y,z+Math.sin(b)*(r-w)],[x+Math.cos(b)*r,y,z+Math.sin(b)*r],[x+Math.cos(a)*r,y,z+Math.sin(a)*r],col)}}
function limb(a,b,r,col,n=8){let d=b.map((v,i)=>v-a[i]),len=Math.hypot(...d)||1;d=d.map(v=>v/len);let u=Math.abs(d[1])>.9?[1,0,0]:[d[2],0,-d[0]];let l=Math.hypot(...u)||1;u=u.map(v=>v/l);let v=[d[1]*u[2]-d[2]*u[1],d[2]*u[0]-d[0]*u[2],d[0]*u[1]-d[1]*u[0]];let point=(p,t)=>p.map((q,i)=>q+r*(u[i]*Math.cos(t)+v[i]*Math.sin(t)));for(let i=0;i<n;i++){let t=i*6.283185/n,k=(i+1)*6.283185/n;quad(point(a,t),point(b,t),point(b,k),point(a,k),col)} }
const foliage=[];let obstacleGrid=null;let seed=44;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};const obstacles=[],chunks=[];const WORLD=100;
function blocked(x,z,r=.35){if(Math.abs(x)>49||Math.abs(z)>49)return true;if(Math.abs(x-8)<2.5 && Math.abs(z+2)>2.6)return true;let pool=obstacleGrid?.get(Math.floor(x/5)+","+Math.floor(z/5))||[];return (obstacleGrid?pool:obstacles).some(o=>Math.abs(x-o.x)<o.w/2+r&&Math.abs(z-o.z)<o.d/2+r)}
function building(x,z,w,d,h,roof=C.roof){box(x,0,z,w,h,d,C.wall);box(x,.12,z,w+.25,.22,d+.25,C.stone);for(let a of [-1,1]){box(x+a*(w/2-.14),0,z+d/2+.06,.2,h,.2,C.wood);box(x+a*(w/2-.14),0,z-d/2-.06,.2,h,.2,C.wood)}box(x,h-.28,z,w+.15,.25,d+.15,C.wood);let a=[x-w/2-.5,h,z-d/2-.55],b=[x+w/2+.5,h,z-d/2-.55],c=[x+w/2+.5,h,z+d/2+.55],d0=[x-w/2-.5,h,z+d/2+.55],r1=[x-w/2-.5,h+1.4,z],r2=[x+w/2+.5,h+1.4,z];quad(a,r1,r2,b,roof);quad(d0,c,r2,r1,roof);tri(a,d0,r1,C.wood);tri(b,r2,c,C.wood);box(x,h+1.38,z,w+1.2,.14,.22,C.dark);box(x,0,z+d/2+.05,.9,1.75,.12,C.wood);for(let i of [-1,1]){box(x+i*w*.29,1.1,z+d/2+.07,.9,.85,.13,C.dark);box(x+i*w*.29,1.46,z+d/2+.15,.9,.06,.04,C.wall);box(x+i*w*.29,1.1,z+d/2+.15,.06,.85,.04,C.wall);box(x+i*w*.4,2.1,z+d/2+.3,.36,.46,.36,rgb('e98940'))}for(let side of [-1,1]){for(let i=1;i<Math.floor(w/1.1);i++){let xx=x-w/2+i*1.1;box(xx,h+.015,z+side*(d/2+.48),.12,.12,.19,roof.map(v=>v*.7));}box(x,h-.48,z+side*(d/2+.09),w,.075,.12,C.wood)}for(let i=-1;i<=1;i++){box(x+i*.29,.98,z+d/2+.13,.22,1.28,.05,rgb('a4774a'))}box(x,1.98,z+d/2+.13,1.25,.22,.1,C.wood);for(let side of [-1,1]){box(x+side*(w/2+.06),1.25,z, .1,.78,1.05,C.dark);box(x+side*(w/2+.12),1.6,z,.06,.06,1.05,C.wall)}obstacles.push({x,z,w,d})}
function treeMesh(x,z,s){let trunk=rgb('73513a');cone(x,0,z,.32*s,2.9*s,trunk,9,.13*s);for(let i=0;i<5;i++){let a=i*2.4,xx=x+Math.cos(a)*.82*s,zz=z+Math.sin(a)*.82*s,yy=(2.55+(i%3)*.4)*s;limb([x,1.5*s,z],[xx,yy,zz],.10*s,trunk,6);sphere(xx,yy+.35*s,zz,(.93+(i%2)*.13)*s,rgb(['39764a','548d4c','6a9d52','43834d','82a958'][i]));}sphere(x,3.8*s,z,.95*s,rgb('659b53'));}
function tree(x,z,s){foliage.push({x,z,s});obstacles.push({x,z,w:.58*s,d:.58*s});}
function ground(x,z){let road=(Math.abs(z+2)<2.6)||(x<5&&x>-28&&Math.abs(x+13)<2.3);let water=Math.abs(x-8)<2.5;let col=water?C.water:road?C.path:C.grass;let n=.97+Math.floor(rand()*3)*.025;quad([x,0,z],[x,0,z+2],[x+2,0,z+2],[x+2,0,z],col.map(v=>v*n));if(!water&&!road&&rand()<.18){let xx=x+rand()*2,zz=z+rand()*2;for(let i=0;i<3;i++)tri([xx+i*.09,.02,zz],[xx+i*.09+.08,.02,zz],[xx+i*.09+.03,.18+rand()*.2,zz+.08],rgb('4f773d'))}if(water&&rand()<.3)box(x+1,.015,z+1,1.1,.015,.07,rgb('7bc3c6'));let h=Math.abs(Math.sin(x*13.17+z*7.13)*437.1)%1;if(road&&!water&&h<.46){box(x+.5,.012,z+.8,.64,.018,.48,rgb('aa936e'));box(x+1.25,.012,z+1.2,.72,.018,.38,rgb('d6bf91'))}if(!road&&!water&&h<.065){for(let i=0;i<3;i++){let xx=x+.4+i*.19,zz=z+.6+i*.12;limb([xx,.01,zz],[xx,.18,zz],.022,C.leaf,4);box(xx,.17,zz,.12,.055,.12,i===1?rgb('f5cc69'):rgb('f4e8d0'))}}} 
function upload(arr,terrain=false){return {obj:view.addStatic(arr,terrain)}}
for(let x=-50;x<50;x+=20)for(let z=-50;z<50;z+=20){mesh=[];for(let a=x;a<x+20;a+=2)for(let b=z;b<z+20;b+=2)ground(a,b);chunks.push({...upload(mesh,true),x:x+10,z:z+10})}
mesh=[];for(const b of [[-21,-8,6,5,3.5],[-13,-9,6,5,4.5],[-5,-9,6,5,3.5],[-21,6,7,5,3.3],[-5,7,6,5,3.7],[-30,-2,6,6,4.4],[-30,8,5,5,3.5]])building(...b, b[0]===-13?rgb('587c91'):b[0]===-5?rgb('497d7a'):C.roof);building(-13,-20,10,8,5.8,rgb('526d81'));box(-21,1.8,9,6,.18,1.6,C.roof);for(let i=0;i<3;i++)box(-23+i*2,0,9.8,.24,.75,.24,C.wood);for(let i=0;i<13;i++){box(5.2+i*.47,.03,-2,.44,.22,4.9,C.wood);for(let z of [-4.5,.5]){if(i%3===0)box(5.2+i*.47,.2,z,.14,.95,.14,C.wood)}}for(let z of [-4.5,.5])box(8.1,1.02,z,6.4,.14,.15,C.wood);
for(let i=0;i<160;i++){let x=rand()*94-47,z=rand()*94-47;if(Math.abs(z+2)<5||Math.abs(x-8)<5||(x<0&&x>-35&&z>-26&&z<14)||(x>15&&x<34&&z>-10&&z<12))continue;tree(x,z,.7+rand()*.65)}let pixelTrees=false;try{pixelTrees=!!pixels?.addTrees(foliage);}catch(e){console.warn('Pixel trees fallback',e);}if(!pixelTrees)for(const f of foliage)treeMesh(f.x,f.z,f.s);try{pixels?.addBuildingShadows(obstacles.filter(o=>o.w>=3));}catch(e){console.warn('Building shadow fallback',e);}
for(let x=17;x<33;x+=5){box(x,0,-9,.18,2.1,.18,C.wood);box(x,1.15,-9,.95,.95,.18,C.wall);box(x,1.4,-8.87,.45,.45,.08,C.roof);box(x,1.55,-8.8,.15,.15,.08,C.wall)}for(let i=0;i<15;i++){let x=-47+i*6.5;cone(x,0,-48,6+rand()*3,8+rand()*11,C.stone,5,2)}obstacleGrid=new Map();for(let o of obstacles){for(let x=Math.floor((o.x-o.w/2-1)/5);x<=Math.floor((o.x+o.w/2+1)/5);x++)for(let z=Math.floor((o.z-o.d/2-1)/5);z<=Math.floor((o.z+o.d/2+1)/5);z++){let k=x+','+z;if(!obstacleGrid.has(k))obstacleGrid.set(k,[]);obstacleGrid.get(k).push(o)}}// Scenic details, outside movement lanes.
for(let i=0;i<5;i++){let x=-25+i*5;box(x,0,2,.15,1.8,.15,C.wood);box(x,1.75,2,.65,.13,.22,C.wood);box(x+.26,1.3,2,.33,.42,.33,rgb('efaa53'));box(x+.26,1.72,2,.40,.08,.40,C.dark)}
for(let i=0;i<9;i++){let z=-17+i*3.6;if(Math.abs(z+2)>4){sphere(5.1,.28,z,.55,rgb('8c9c8c'));sphere(10.9,.25,z+.5,.48,rgb('9aa497'))}}
// Ichiraku awning, fabric panels, stools and counter.
box(-21,2.45,9.25,5.7,.15,1.5,rgb('963b32'));for(let i=0;i<5;i++){box(-23.35+i*1.17,1.98,9.95,1.08,.47,.07,rgb('d9b277'));box(-23.35+i*1.17,2.05,10.0,.14,.25,.035,rgb('963b32'))}box(-21,.92,9.7,5.1,.16,.65,C.wood);for(let i=0;i<3;i++){cone(-23+i*2,0,10.45,.14,.62,C.wood,8,.13);cone(-23+i*2,.61,10.45,.34,.13,C.roof,10,.34)}
const bins=new Map();for(let i=0;i<mesh.length;i+=18){let x=(mesh[i]+mesh[i+6]+mesh[i+12])/3,z=(mesh[i+2]+mesh[i+8]+mesh[i+14])/3,k=Math.floor(x/20)+','+Math.floor(z/20);if(!bins.has(k))bins.set(k,[]);let a=bins.get(k);for(let j=0;j<18;j++)a.push(mesh[i+j])}const staticGeo=Array.from(bins,([key,arr])=>{let [x,z]=key.split(',').map(Number);return {...upload(arr),x:x*20+10,z:z*20+10}});
const DATA={npc:{x:-12,z:-2,name:'Kakashi'},enemies:[{x:19,z:-2},{x:25,z:3},{x:30,z:-5},{x:36,z:8},{x:21,z:11}],skills:COMBAT.skills};let p, enemies, quest, effects, clones, projectiles, cd, running=false,quality=1,noticeUntil=0,keys=new Set(),t=0,last=performance.now(),fps=60,uiAt=0;let stepAt=0;function reset(){feedback.reset();stepAt=t;p={x:-16,z:-2,hp:100,chakra:100,xp:0,coins:0,dirX:1,dirZ:0,walk:0,hit:0};enemies=DATA.enemies.map((a,i)=>prepareEnemy({...a,id:i,hp:70,hit:0,attack:0}));quest=0;effects=[];clones=[];projectiles=[];cd={};}reset();function msg(s,sec=3){$('notice').textContent=s;noticeUntil=t+sec}function snapshot(){return validateSave({p,enemies,quest},DATA.enemies.length)}
function applySave(s){reset();p=s.p;enemies=s.enemies.map(e=>{prepareEnemy(e);e.homeX=DATA.enemies[e.id].x;e.homeZ=DATA.enemies[e.id].z;return e;});quest=s.quest;camX=p.x;camZ=p.z;}
function save(silent=false){try{writeSave(snapshot());$('continue').disabled=false;if(!silent)msg('Partida guardada.');return true;}catch(e){if(!silent)msg('No se pudo guardar. Usá Exportar.');return false;}}
function start(restore){audio.unlock();if(restore){try{const s=readSave(DATA.enemies.length);if(!s){$('error').textContent='No hay una partida guardada.';return;}applySave(s);}catch(e){$('error').textContent='Partida inválida. Podés importar un respaldo.';return;}}else reset();running=true;audio.wind(true);keys.clear();$('menu').style.display='none';$('pause').textContent='II';msg(restore?'Partida recuperada.':'Buscá a Kakashi en la plaza.');}
$('start').onclick=()=>start(false);$('continue').onclick=()=>start(true);$('save').onclick=()=>save(false);
$('export').onclick=()=>{try{exportSave(snapshot());msg('Respaldo de partida exportado.');}catch(e){msg('No se pudo exportar.')}};
$('import').onclick=$('importMenu').onclick=()=>$('saveFile').click();
$('saveFile').onchange=async e=>{try{audio.unlock();const s=await importSave(e.target.files[0],DATA.enemies.length);applySave(s);running=true;audio.wind(true);keys.clear();$('menu').style.display='none';$('pause').textContent='II';const persisted=save(true);msg(persisted?'Partida importada y guardada.':'Partida importada; almacenamiento bloqueado. Exportá para conservarla.');}catch(err){$('error').textContent='No se pudo importar: '+err.message;msg('No se pudo importar: '+err.message);}finally{e.target.value='';}};
$('pause').onclick=()=>{running=!running;audio.wind(running);keys.clear();$('pause').textContent=running?'II':'▶';msg(running?'Continuar':'Pausa',running?2:999)};
$('sound').textContent=audio.enabled?'Sonido: Sí':'Sonido: No';$('sound').onclick=()=>{audio.setEnabled(!audio.enabled);audio.wind(running);$('sound').textContent=audio.enabled?'Sonido: Sí':'Sonido: No';};$('volume').value=String(Math.round(audio.volume*100));$('volume').oninput=e=>audio.setVolume(Number(e.target.value)/100);$('shake').textContent=feedback.shakeEnabled?'Impacto: Sí':'Impacto: No';$('shake').onclick=()=>{feedback.setShake(!feedback.shakeEnabled);$('shake').textContent=feedback.shakeEnabled?'Impacto: Sí':'Impacto: No';};
$('quality').onclick=()=>{quality=quality===1?.75:quality===.75?.55:1;$('quality').textContent='Calidad: '+(quality===1?'Alta':quality===.75?'Media':'Baja');resize()};
function resize(){view.resize(quality)}addEventListener('resize',resize);resize();
let autosaveAt=20;addEventListener('pagehide',()=>{if($('menu').style.display==='none')save(true)});
function dist(a,b){return Math.hypot(a.x-b.x,a.z-b.z)}function move(a,dx,dz){stepMotion(a,dx,dz,blocked);}
function hurt(e,d,source=p,skill=COMBAT.skills.j,allowCrit=false){
 if(e.hp<=0)return false;
 const critical=allowCrit&&Math.random()<COMBAT.criticalChance;
 const coordinated=source===p&&e.mark>0&&skill===COMBAT.skills[' '];
 const modifier=damageModifier(e,source,skill);const damage=Math.round(d*(critical?COMBAT.criticalMultiplier:1)*modifier*(coordinated?COMBAT.clone.synergy:1));
 if(coordinated){e.mark=0;msg('¡Ataque coordinado! Rasengan +25%');}
 if(e.role==='guard'&&e.guard&&skill.breakGuard){e.stagger=.9;e.guard=false;msg('¡Guardia rota!');}
 if(modifier<1)msg('Bloqueado · rodealo o rompé su guardia');
 e.hp=Math.max(0,e.hp-damage);e.hit=.18;e.flash=.12;e.pendingAttack=0;e.intent=null;e.attack=Math.max(e.attack||0,.3);
 const v=directionToward(e.x-source.x,e.z-source.z,p.dirX,p.dirZ);
 e.kx=v.x*skill.knock*modifier;e.kz=v.z*skill.knock*modifier;e.knockTime=.14;
 effects.push({x:e.x,z:e.z,life:.3,max:.3,r:1,col:C.orange,type:'hit'});
 feedback.number(e.x,e.z,damage,critical?'critical':'normal');feedback.impact(skill.shake,skill.freeze);audio.play(skill.knock>=5?'heavy':'hit');
 if(e.hp===0){p.xp+=25;p.coins+=12;msg('+25 EXP · +12 ryō');if(quest===1&&enemies.every(e=>!e.hp)){quest=2;msg('¡Misión cumplida! Volvé con Kakashi.');audio.play('reward');}}
 return true;
}
function playerHurt(d,source){
 if(p.invuln>0)return;
 if(p.substitution>0){const origin={x:p.x,z:p.z},dest=safeSubstitution(p,source,blocked);p.x=dest.x;p.z=dest.z;p.substitution=0;p.invuln=COMBAT.substitution.invulnerable;p.pending=null;p.anim=null;p.queued=false;p.combo=0;effects.push({...origin,life:.6,max:.6,r:1,col:C.orange,type:'substitute'});effects.push({x:p.x,z:p.z,life:.35,max:.35,r:1,col:C.orange,type:'clone'});audio.play('clone');msg('¡Kawarimi! Ataque evitado');return;}
 p.hp=Math.max(0,p.hp-d);p.hit=.2;p.flash=.12;p.invuln=.22;p.combo=0;p.queued=false;p.pending=null;p.anim=null;
 const v=directionToward(p.x-source.x,p.z-source.z);move(p,v.x*.23,v.z*.23);
 feedback.number(p.x,p.z,d,'player');feedback.impact(.055,.035);audio.play('hurt');
 if(p.hp<=0){p.hp=100;p.chakra=100;p.x=-16;p.z=-2;p.dashTime=0;p.invuln=1;msg('Sakura te recuperó en Konoha.');}
}
function substitution(){if(!running||cd.r>0||p.chakra<COMBAT.substitution.cost||p.substitution>0)return false;p.chakra-=COMBAT.substitution.cost;cd.r=COMBAT.substitution.cd;p.substitution=COMBAT.substitution.duration;msg('Kawarimi preparado · 1,8 s');audio.play('charge');return true;}
function hitTarget(target,damage,source){if(target===p)playerHurt(damage,source);else if(target.life>0&&target.hp>0){target.hp=Math.max(0,target.hp-damage);target.flash=.14;feedback.number(target.x,target.z,damage,'player');if(target.hp===0){target.life=0;effects.push({x:target.x,z:target.z,life:.45,max:.45,r:1,col:C.orange,type:'clone'});}}}
function enemyFire(e,intent,role){const v=directionToward(intent.x-e.x,intent.z-e.z,intent.dx,intent.dz);projectiles.push({x:e.x,z:e.z,dx:v.x,dz:v.z,life:1.1,speed:10,hostile:true,damage:role.damage,kind:'kunai'});audio.play('shuriken');}
function interact(){if(!running)return;if(dist(p,DATA.npc)<3){if(quest===0){quest=enemies.every(e=>!e.hp)?2:1;msg('Kakashi: derrotá a los cinco renegados del bosque.',5)}else if(quest===2){quest=3;p.coins+=100;p.xp+=50;p.hp=100;audio.play('reward');msg('Kakashi: ¡bien hecho! +100 ryō, +50 EXP',5)}else msg(quest===1?'Kakashi: cruzá el puente hacia el bosque.':'Kakashi: seguí entrenando.')}else msg('Acercate a Kakashi para hablar.')}
function attack(k){
 if(!running||!DATA.skills[k]||p.dashTime>0)return false;
 if(p.anim||p.pending){if(k==='j'&&p.anim?.k==='j'&&p.anim.left<=.24)p.queued=true;return false;}
 if(cd[k]>0)return false;
 const base=DATA.skills[k];if(p.chakra<base.cost){msg('Chakra insuficiente');return false;}
 let s=base,combo=0;
 if(k==='j'){
  combo=t-(p.comboAt??-99)<=COMBAT.comboWindow?(p.combo||0)%3+1:1;
  s={...base,...COMBAT.combos[combo-1]};
  p.combo=combo;p.comboAt=t;
 }else{p.combo=0;p.queued=false;}
 p.chakra-=base.cost;cd[k]=Math.max(base.cd,s.duration);
 p.pending={k,s,remaining:s.windup,combo};p.anim={k,left:s.duration,total:s.duration,combo,windup:s.windup};
 p.motion=false;p.sprinting=false;
 audio.play(k===' '||k==='f'?'charge':k==='l'?'clone':'swing');
 return true;
}
function resolveAttack(a){
 const {k,s,combo}=a;
 let near=enemies.filter(e=>e.hp>0&&dist(p,e)<s.range).sort((a,b)=>dist(p,a)-dist(p,b));
 if(k==='k'||k==='f'){
  const target=near[0],dir=directionToward(target?target.x-p.x:p.dirX,target?target.z-p.z:p.dirZ);
  projectiles.push({x:p.x,z:p.z,dx:dir.x,dz:dir.z,life:k==='f'?1:.65,speed:k==='f'?14:18,kind:k==='f'?'wind':'shuriken',damage:s.damage,pierce:k==='f',hits:new Set()});audio.play(k==='f'?'rasengan':'shuriken');
 }else if(k==='l'){
  for(let i=0;i<2;i++){const x=p.x+(i?1:-1),z=p.z+1;clones.push({x:blocked(x,z)?p.x:x,z:blocked(x,z)?p.z:z,life:5,hp:COMBAT.clone.hp,hit:0,walk:0});}
  msg('¡Kage Bunshin no Jutsu!');audio.play('clone');
 }else{
  if(k===' '){
   const target=near[0];const v=directionToward(target?target.x-p.x:p.dirX,target?target.z-p.z:p.dirZ);p.dirX=v.x;p.dirZ=v.z;
   const lunge=target?Math.min(1.05,Math.max(0,dist(p,target)-.8)):.6;
   move(p,v.x*lunge,v.z*lunge);audio.play('rasengan');
   near=enemies.filter(e=>e.hp>0&&dist(p,e)<s.range).sort((a,b)=>dist(p,a)-dist(p,b));
  }
  effects.push({x:p.x+p.dirX*.8,z:p.z+p.dirZ*.8,life:k===' '?.65:.22,max:k===' '?.65:.22,r:k===' '?3:1.5,col:k===' '?C.blue:C.orange,type:k===' '?'rasengan':combo===3?'heavy':'hit'});
  for(const e of near.slice(0,k===' '?5:1))hurt(e,s.damage,p,s,true);
 }
}
function dash(){
 if(!running||p.dashTime>0||cd.q>0||p.pending||p.chakra<COMBAT.dash.cost)return false;
 const x=Number(keys.has('d'))-Number(keys.has('a')),z=Number(keys.has('s'))-Number(keys.has('w'));
 const v=directionToward(x,z,p.dirX,p.dirZ);
 p.dirX=v.x;p.dirZ=v.z;p.dashTime=COMBAT.dash.duration;p.invuln=COMBAT.dash.invulnerable;p.chakra-=COMBAT.dash.cost;cd.q=COMBAT.dash.cooldown;
 p.anim=null;p.queued=false;p.combo=0;p.motion=true;p.sprinting=true;
 effects.push({x:p.x,z:p.z,life:.18,max:.18,r:1,col:C.orange,type:'dash'});audio.play('dash');
 return true;
}
const mapKey=k=>({arrowup:'w',arrowdown:'s',arrowleft:'a',arrowright:'d'}[k]||k);
addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName))return;const k=mapKey(e.key.toLowerCase());if(['w','a','s','d',' ','shift','q','j','k','l','e','r','f'].includes(k))e.preventDefault();keys.add(k);if(!e.repeat){if(k==='e')interact();else if(k==='q')dash();else if(k==='r')substitution();else attack(k);}});
addEventListener('keyup',e=>keys.delete(mapKey(e.key.toLowerCase())));
addEventListener('blur',()=>keys.clear());
document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{audio.unlock();b.dataset.s==='q'?dash():b.dataset.s==='r'?substitution():attack(b.dataset.s);});
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);if(b.dataset.key==='e')interact();else keys.add(b.dataset.key)};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key)});
function update(dt){
 t+=dt;
 for(const k in cd)cd[k]=Math.max(0,cd[k]-dt);
 p.substitution=Math.max(0,(p.substitution||0)-dt);p.invuln=Math.max(0,(p.invuln||0)-dt);p.flash=Math.max(0,(p.flash||0)-dt);p.hit=Math.max(0,p.hit-dt);
 if(p.combo&&t-p.comboAt>COMBAT.comboWindow)p.combo=0;
 const dx=Number(keys.has('d'))-Number(keys.has('a')),dz=Number(keys.has('s'))-Number(keys.has('w'));
 if(p.dashTime>0){
  const delta=Math.min(dt,p.dashTime);move(p,p.dirX*COMBAT.dash.speed*delta,p.dirZ*COMBAT.dash.speed*delta);p.dashTime=Math.max(0,p.dashTime-dt);p.motion=true;p.sprinting=true;p.walk+=dt*24;
 }else{
  p.motion=Boolean(dx||dz)&&!p.pending;p.sprinting=p.motion&&keys.has('shift');
  if(p.motion){const v=directionToward(dx,dz),speed=p.sprinting?8:5;p.dirX=v.x;p.dirZ=v.z;move(p,v.x*speed*dt,v.z*speed*dt);p.walk+=dt*speed*2;if(t>=stepAt){audio.play('step');stepAt=t+(p.sprinting?.17:.28);}}
  else p.walk=0;
 }
 p.chakra=Math.min(100,p.chakra+dt*8);
 if(p.pending){p.pending.remaining-=dt;if(p.pending.remaining<=0){const a=p.pending;p.pending=null;resolveAttack(a);}}
 if(p.anim){p.anim.left-=dt;if(p.anim.left<=0)p.anim=null;}
 if(p.queued&&!p.anim&&!p.pending&&!(cd.j>0)){p.queued=false;attack('j');}
 for(const e of enemies){
  if(!e.hp||dist(e,p)>26)continue;
  e.hit=Math.max(0,e.hit-dt);e.flash=Math.max(0,(e.flash||0)-dt);e.mark=Math.max(0,(e.mark||0)-dt);
  if(e.anim){e.anim.left-=dt;if(e.anim.left<=0)e.anim=null;}
  if(e.knockTime>0){const delta=Math.min(dt,e.knockTime);move(e,e.kx*delta,e.kz*delta);e.knockTime=Math.max(0,e.knockTime-dt);e.motion=false;continue;}
  tickEnemy(e,p,clones,dt,move,enemyFire,hitTarget,blocked);
 }
 for(const c of clones){
  if(c.life<=0||c.hp<=0)continue;c.life-=dt;c.hit-=dt;c.flash=Math.max(0,(c.flash||0)-dt);if(c.anim){c.anim.left-=dt;if(c.anim.left<=0)c.anim=null;}c.motion=false;
  const e=enemies.filter(e=>e.hp>0&&dist(c,e)<14).sort((a,b)=>dist(c,a)-dist(c,b))[0];
  if(e){const d=dist(c,e);if(d>1.1){c.motion=true;const v=directionToward(e.x-c.x,e.z-c.z);c.dirX=v.x;c.dirZ=v.z;move(c,v.x*5*dt,v.z*5*dt);c.walk+=dt*10;}else if(c.hit<=0){e.mark=COMBAT.clone.markDuration;hurt(e,COMBAT.clone.damage,c,{...COMBAT.skills.j,knock:COMBAT.clone.knock,freeze:.018,shake:.018});c.hit=.65;c.anim={k:'j',left:.3,total:.3};}}
 }
 clones=clones.filter(c=>c.life>0&&c.hp>0);
 for(const a of projectiles){
  const speed=a.speed||18,steps=Math.max(1,Math.ceil(speed*dt/.2));
  for(let i=0;i<steps&&a.life>0;i++){
   const x=a.x+a.dx*speed*dt/steps,z=a.z+a.dz*speed*dt/steps;
   if(blocked(x,z,.06)){a.life=0;break;}a.x=x;a.z=z;
   if(a.hostile){const target=[...clones,p].find(e=>(e.hp??0)>0&&(e.life??1)>0&&dist(a,e)<.64);if(target){hitTarget(target,a.damage,{x:a.x-a.dx,z:a.z-a.dz});a.life=0;}}
   else{const e=enemies.find(e=>e.hp>0&&!a.hits?.has(e.id)&&dist(a,e)<(a.pierce?1.15:.9));
    if(e){a.hits?.add(e.id);hurt(e,a.damage||24,{x:a.x-a.dx,z:a.z-a.dz},COMBAT.skills[a.kind==='wind'?'f':'k'],true);if(!a.pierce)a.life=0;}}
  }a.life-=dt;
 }
 projectiles=projectiles.filter(a=>a.life>0);
 for(const e of effects)e.life-=dt;effects=effects.filter(e=>e.life>0).slice(-25);
}
function ninja(a,kind){let {x,z}=a,hero=kind==='player'||kind==='clone',npc=kind==='npc',enemy=kind==='enemy';let walk=Math.sin(a.walk||0),bob=Math.abs(walk)*.045,act=a.anim&&a.anim.left>0?Math.sin(Math.PI*(1-a.anim.left/a.anim.total)):0;let dark=rgb('202d39'),orange=rgb('f08a35'),body=hero?orange:npc?rgb('728560'):rgb('51475e'),hair=npc?rgb('c8d3d6'):enemy?dark:C.hair;if(!a.rigPreview)disc(x+.17,.031,z-.12,.55,rgb('526d47'));let start=mesh.length;let y=bob;
for(let i of [-1,1]){let foot=i*walk*.24;limb([i*.16,.67+y,0],[i*.17,.36+y,foot*.5],.137,body);limb([i*.17,.36+y,foot*.5],[i*.17,.13+y,foot],.115,hero?orange:dark);box(i*.17,.05+y,foot+.07,.25,.14,.35,dark);box(i*.17,.105+y,foot+.20,.23,.07,.1,C.skin);if(i===1)box(i*.17,.24+y,foot,.24,.12,.23,rgb('d7d2bb'))}
cone(0,.64+y,0,.34,.58,body,8,.40);box(0,.62+y,0,.65,.13,.42,dark);box(0,1.05+y,0,.68,.15,.48,dark);box(0,.75+y,.225,.035,.34,.025,rgb('d9a369'));if(hero){ring(0,1.215+y,0,.31,.055,orange,14);box(0,.91+y,-.25,.25,.23,.035,rgb('a52f32'));box(0,.95+y,-.28,.11,.10,.035,orange)}if(npc){for(let i of [-1,1])box(i*.18,.82+y,.27,.24,.22,.09,rgb('50694f'))}
for(let i of [-1,1]){let swing=-i*walk*.18,reach=i===1?act*.58:act*.17;let shoulder=[i*.34,1.13+y,0],elbow=[i*(.42+act*.07),.91+y,swing+reach*.55],hand=[i*(.39+act*.09),.75+y+act*.28,swing+reach];limb(shoulder,elbow,.115,hero?dark:body);limb(elbow,hand,.105,body);sphere(...hand,.105,enemy?dark:C.skin);if(hero)limb([hand[0],hand[1]+.09,hand[2]],[hand[0],hand[1]+.17,hand[2]],.107,dark)}
sphere(0,1.49+y,0,.31,enemy?dark:C.skin);sphere(0,1.59+y,-.065,.32,hair);for(let i=0;i<(enemy?0:9);i++){let a0=i*2.4,xx=Math.cos(a0)*.22,zz=Math.sin(a0)*.21;cone(xx,1.64+y,zz,.12,.19+(i%3)*.08,hair,5)}box(0,1.55+y,.27,.55,.115,.095,dark);box(0,1.55+y,.33,.29,.10,.045,rgb('b7c4c9'));box(0,1.57+y,.356,.085,.027,.012,rgb('4a5960'));for(let i of [-1,1]){box(i*.105,1.43+y,.275,.078,.045,.035,rgb('f5eee0'));box(i*.105,1.43+y,.299,.032,.044,.018,hero?rgb('438cc0'):dark);box(i*.105,1.469+y,.30,.088,.022,.017,dark);if(hero)for(let j=0;j<3;j++)box(i*.205,1.38+y-j*.035,.238,.07,.012,.025,rgb('815747'))}if(npc||enemy)box(0,1.34+y,.25,.44,.16,.12,dark);else box(0,1.325+y,.267,.09,.022,.025,rgb('915c45'));if(npc)box(-.1,1.44+y,.305,.19,.12,.06,dark);
let angle=Math.atan2(a.dirX||0,a.dirZ??1),cs=Math.cos(angle),sn=Math.sin(angle);for(let i=start;i<mesh.length;i+=6){let xx=mesh[i],zz=mesh[i+2];mesh[i]=x+xx*cs+zz*sn;mesh[i+2]=z-xx*sn+zz*cs;if(kind==='clone'){mesh[i+3]*=.79;mesh[i+4]=Math.min(1,mesh[i+4]*1.05);mesh[i+5]=Math.min(1,mesh[i+5]+.16)}}
if(enemy&&!a.rigPreview){box(x,2.08,z,.7,.07,.07,rgb('543f3c'));box(x-(70-a.hp)/70*.35,2.09,z,.7*a.hp/70,.08,.08,rgb('e46b51'));if(a.guard)ring(a.x,.06,a.z,.76,.10,rgb('e4c16c'),16);if(a.mark>0)ring(a.x,.065,a.z,.9,.09,rgb('6ee8ff'),16);if(a.intent){const role=roleFor(a),progress=Math.max(0,Math.min(1,1-a.intent.left/a.intent.total));if(a.role==='thrower'){const end={x:a.intent.x,z:a.intent.z};limb([a.x,.045,a.z],[end.x,.045,end.z],.055,role.color,4);}else{ring(a.x,.045,a.z,role.radius,.085,role.color,24);ring(a.x,.048,a.z,Math.max(.1,role.radius*progress),.055,role.color,24);}}}if(npc&&quest!==3&&!a.rigPreview){let yy=2.5+Math.sin(t*3)*.12;cone(x,yy,z,.19,.26,rgb('ffd162'),4);cone(x,yy-.26,z,.01,.26,rgb('ffd162'),4,.19)} }
function atmosphere(){if(quality<.7)return;let count=0;for(let f of foliage){if(Math.abs(f.x-camX)>22||Math.abs(f.z-camZ)>20)continue;if(++count>(quality===1?35:15))break;for(let i=0;i<3;i++){let a=t*1.2+i*2.1+f.x,xx=f.x+Math.cos(a)*.65*f.s,zz=f.z+Math.sin(a)*.65*f.s;tri([xx,3.4*f.s,zz],[xx+.28*f.s,3.5*f.s,zz+.16],[xx+.09,3.7*f.s,zz+.08],rgb('91b65d'))}}for(let i=0;i<18;i++){let z=-20+i*2.5+((t*.8)%2.5);if(Math.abs(z+2)<3||Math.abs(z-camZ)>24||Math.abs(camX-8)>24)continue;box(8+Math.sin(i*7)*1.7,.032,z,.45,.014,.055,rgb('a3d9d3'))}}
function visualEffect(e){let progress=1-e.life/e.max,r=e.r*(.25+progress*.75),blue=e.col===C.blue,n=quality===1?24:quality===.75?16:10;ring(e.x,.05,e.z,r,.07,e.col,n);if(blue){let yy=.85+.13*Math.sin(t*20);sphere(e.x,yy,e.z,.44*(1-progress*.6),rgb('b5f7ff'));for(let i=0;i<n;i++){let a=i*6.283/n+t*13,b=a+.34;let rr=.45+r*.19,yp=yy+Math.sin(a*2)*.22;limb([e.x+Math.cos(a)*rr,yp,e.z+Math.sin(a)*rr],[e.x+Math.cos(b)*rr,yy+Math.sin(b*2)*.22,e.z+Math.sin(b)*rr],.035,C.blue,4);if(i%3===0) sphere(e.x+Math.cos(a)*r,.25+Math.sin(i*2+t*4)**2*.65,e.z+Math.sin(a)*r,.075,rgb('e2fbff'))}}else{for(let i=0;i<n;i+=2){let a=i*6.283/n+t*5;limb([e.x+Math.cos(a)*r*.7,.28,e.z+Math.sin(a)*r*.7],[e.x+Math.cos(a)*r,.42,e.z+Math.sin(a)*r],.045,e.col,4)}}}

let camX=p.x,camZ=p.z;
function render(dt,animDt=dt){
  camX+=(p.x-camX)*Math.min(1,dt*7);camZ+=(p.z-camZ)*Math.min(1,dt*7);
  const spanX=12*innerWidth/Math.max(1,innerHeight);
  for(const ch of chunks)ch.obj.visible=Math.abs(ch.x-camX)<spanX+17&&Math.abs(ch.z-camZ)<38;
  for(const ch of staticGeo)ch.obj.visible=Math.abs(ch.x-camX)<spanX+20&&Math.abs(ch.z-camZ)<42;
  mesh=[];pixels?.begin();
  function actor(a,kind){const visual=kind==='enemy'?(a.role==='guard'?'guard':a.role==='thrower'?'thrower':'enemy'):kind;if(!pixels?.show(a,visual,running?animDt:0))ninja(a,kind);else{
    if(kind==='enemy'){box(a.x,2.08,a.z,.7,.07,.07,rgb('543f3c'));box(a.x-(70-a.hp)/70*.35,2.09,a.z,.7*a.hp/70,.08,.08,rgb('e46b51'))}
    if(kind==='clone'){box(a.x,2.03,a.z,.55,.045,.06,rgb('405566'));box(a.x-(COMBAT.clone.hp-a.hp)/COMBAT.clone.hp*.275,2.04,a.z,.55*a.hp/COMBAT.clone.hp,.05,.06,C.blue);}if(kind==='npc'&&quest!==3){let y=2.5+Math.sin(t*3)*.12;cone(a.x,y,a.z,.19,.26,rgb('ffd162'),4);cone(a.x,y-.26,a.z,.01,.26,rgb('ffd162'),4,.19)}
  }}
  actor(p,'player');if(dist(p,DATA.npc)<35)actor(DATA.npc,'npc');for(const e of enemies)if(e.hp>0&&dist(p,e)<35)actor(e,'enemy');for(const c of clones)actor(c,'clone');
  pixels?.end();view.drawActors(mesh);mesh=[];
  if(pixels){pixels.effects(effects,clones,projectiles,t,running?animDt:0,quality,p);}else{
  for(let a of projectiles){let ang=t*25;for(let i=0;i<4;i++){let q=ang+i*Math.PI/2;tri([a.x,.83,a.z],[a.x+Math.cos(q)*.33,.83,a.z+Math.sin(q)*.33],[a.x+Math.cos(q+.55)*.13,.83,a.z+Math.sin(q+.55)*.13],C.dark)}limb([a.x-a.dx*.65,.8,a.z-a.dz*.65],[a.x,.8,a.z],.018,rgb('c5dce1'),4)}for(let e of effects)visualEffect(e);}
  // Water highlights only; the tree crowns are static pixel silhouettes.
  if(quality>=.75)for(let i=0;i<18;i++){let z=-20+i*2.5+((t*.8)%2.5);if(Math.abs(z+2)<3||Math.abs(z-camZ)>24||Math.abs(camX-8)>24)continue;box(8+Math.sin(i*7)*1.7,.032,z,.45,.014,.055,rgb('a3d9d3'));}
  view.drawEffects(mesh);const offset=feedback.offset();view.frame(camX+offset.x,camZ+offset.z);feedback.updateNumbers(running?dt:0);
}
$('error').textContent='';$('start').disabled=false;$('importMenu').disabled=false;try{$('continue').disabled=!readSave(DATA.enemies.length);}catch(e){$('continue').disabled=true;$('error').textContent='Guardado anterior inválido o almacenamiento bloqueado. Podés importar un respaldo.';}
function loop(now){let real=Math.max(.001,(now-last)/1000),dt=Math.min(.05,real);last=now;fps=fps*.95+(.05/real);let animDt=0;if(running){const frozen=feedback.frozen;feedback.tick(real);if(!frozen){update(dt);animDt=dt;}if(t>=autosaveAt){autosaveAt=t+20;save(true);}}render(dt,animDt);if(now>uiAt){uiAt=now+200;if(running&&t>noticeUntil){let hint=dist(p,DATA.npc)<3?'E · Hablar con Kakashi':'Q · Esquivar   |   R · Kawarimi   |   F · Fūma';if($('notice').textContent!==hint)$('notice').textContent=hint;}$('fps').textContent=Math.round(fps)+' FPS · Pixel Anime · v0.8'+(view.renderer?.info?.render?' · '+view.renderer.info.render.calls+' draw calls':'');for(const el of document.querySelectorAll('[data-s]')){let sk=el.dataset.s==='q'?COMBAT.dash:el.dataset.s==='r'?COMBAT.substitution:DATA.skills[el.dataset.s],wait=cd[el.dataset.s]||0;el.style.opacity=wait>0?.55:p.chakra<sk.cost?.65:1;const label=el.querySelector('em');if(label)label.textContent=wait>0?wait.toFixed(1)+' s':el.dataset.name||label.textContent;}$('tactics').textContent=p.substitution>0?'KAWARIMI · '+p.substitution.toFixed(1)+' s':clones.length?'Clones activos: '+clones.length:'';$('combo').textContent=p.combo?'COMBO '+p.combo+' / 3 · '+COMBAT.combos[p.combo-1].name:'';$('hp').style.width=p.hp+'%';$('chakra').style.width=p.chakra+'%';$('stats').textContent='Nivel '+(1+Math.floor(p.xp/100))+' · '+p.coins+' ryō';$('qdesc').textContent=['Buscá a Kakashi en la plaza.','Derrotá renegados: '+enemies.filter(e=>!e.hp).length+'/5. Cruzá el puente al este.','Volvé con Kakashi.','¡Misión completada!'][quest];}requestAnimationFrame(loop)}requestAnimationFrame(loop);
