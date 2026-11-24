import {KYUBI_ASSETS} from './kyubi-assets.js';
import {COMBAT} from './combat-data.js';
import {roleFor} from './enemy-ai.js';
import {characterFor} from './character-data.js';
import * as THREE from 'three';
import {makeActorSheet,makeSheets,ANIMS,ACTOR_W,ACTOR_H,ACTOR_COLS,FX_ROWS,FX_SIZE,FX_COLS,TREE_W,TREE_H,artFor,makeRasenganSheet,RAS_COLS,RAS_ROWS,rasenganPose,rasenganHand} from './pixel-art.js';
const TILT=-Math.atan2(25,30),UP_Y=Math.cos(TILT),UP_Z=Math.sin(TILT);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function direction(x=0,z=1){return Math.abs(x)>Math.abs(z)?(x<0?1:2):(z<0?3:0);}
export function frameFor(actor,clock,pose=null){
 const a=actor.anim;
 if(!a&&actor.guardBreak>0)return {col:ANIMS.guardBreak.start+Math.floor(clock*ANIMS.guardBreak.fps)%2,state:'guardBreak'};
 if(!a&&actor.guarding)return {col:ANIMS.guard.start+(pose&&pose.age<.10?0:1+Math.floor(clock*ANIMS.guard.fps)%3),state:'guard'};
 if(!a&&actor.charging)return {col:ANIMS.charge.start+((actor.chargeHeld||0)<.25?Math.min(1,Math.floor((actor.chargeHeld||0)*8)):2+Math.floor(clock*ANIMS.charge.fps)%2),state:'charge'};
 if(a?.dashStrike&&a.left>0){const age=a.dashImpactAge;return {col:ANIMS.dashStrike.start+(!Number.isFinite(age)?0:age<.065?1:age<.135?2:3),state:'dashStrike'};}
 if(!a&&actor.dashTime>0)return {col:ANIMS.dash.start+Math.min(3,Math.floor(Math.max(0,1-actor.dashTime/COMBAT.dash.duration)*4)),state:'dash'};
 if(a&&a.left>0){
  if(actor.character==='naruto'&&Number.isInteger(a.rasPose))return {col:38+a.rasPose,state:'rasengan'};
  if(actor.character==='naruto'&&a.k===' ')return {col:38+rasenganPose(a),state:'rasengan'};
  const special=actor.character&&artFor(actor.character,a.k);if(special){const v=ANIMS[special.pose],elapsed=Math.max(0,a.total-a.left),windup=a.windup||.001,recovery=Math.max(.001,a.total-windup);const phase=elapsed<windup?(elapsed<windup*.55?0:1):elapsed<windup+recovery*.65?2:3;return {col:v.start+phase,state:special.pose};}
  const state=(a.k==='l'||a.k===' '||a.k==='f'||a.k==='g')?'cast':a.combo===2?'kick':a.combo===3?'finish':'attack',v=ANIMS[state],progress=clamp(1-a.left/a.total,0,.999);
  const col=a.windup?(a.left>a.total-a.windup?v.start:v.start+Math.min(v.count-1,1+Math.floor((1-a.left/(a.total-a.windup))*(v.count-1)))):v.start+Math.min(v.count-1,Math.floor(progress*v.count));return {col,state};
 }
 if(actor.hit>0&&!actor.anim)return {col:13,state:'hit'};
 const moving=actor.motion??Boolean(actor.walk),state=moving?(actor.sprinting?'run':'walk'):'idle',v=ANIMS[state];
 if(!moving&&pose?.brake>0)return {col:ANIMS.brake.start+(pose.brake>.045?0:1),state:'brake'};
 return {col:v.start+Math.floor((moving&&pose?pose.gait:clock*v.fps))%v.count,state};
}
// Presentation-only pose clock, no additional sprite, hitbox or simulation latency.
export function advancePose(pose,actor,dt){
 const a=actor.anim,locked=!!(a||actor.guarding||actor.charging||actor.guardBreak>0||actor.hit>0||actor.dashTime>0||actor.fallen||actor.air);
 const moving=!locked&&!!(actor.motion??actor.walk),state=actor.fallen?'fallen':actor.guardBreak>0?'guardBreak':actor.guarding?'guard':actor.charging?'charge':a?'action':actor.dashTime>0?'dash':actor.hit>0?'hit':moving?(actor.sprinting?'run':'walk'):'idle';
 if(pose.state!==state){pose.age=0;pose.brake=state==='idle'&&(pose.state==='walk'||pose.state==='run'||pose.state==='dash')?.09:0;pose.state=state;}else pose.age+=dt;
 if(state!=='idle')pose.brake=0;else pose.brake=Math.max(0,pose.brake-dt);
 if(moving)pose.gait=(pose.gait+dt*(actor.sprinting?ANIMS.run.fps:ANIMS.walk.fps)*(actor.moveBlend==null?1:Math.max(.45,actor.moveBlend)))%4;
 // Preserve the exact Rasengan/cinematic alignment, feet anchored to ground.
 let sx=1,sy=1;
 if(!actor.fallen&&!actor.air&&!Number.isInteger(a?.rasPose)&&!(a&&a.k===' '&&actor.character==='naruto')&&!a?.rasRecovery){
  if(state==='dash'){sx=1.055;sy=.96;}else if(state==='guard'||state==='guardBreak'){sx=1.035;sy=.97;}else if(state==='charge'){sx=1.012;sy=1+.012*Math.sin(pose.age*12);}else if(state==='hit'){sx=1.035;sy=.965;}else if(pose.brake>0){sx=1.025;sy=.975;}
  const blend=1-Math.exp(-Math.max(0,dt)*24);pose.sx+=(sx-pose.sx)*blend;pose.sy+=(sy-pose.sy)*blend;
 }else{pose.sx=pose.sy=1;}
 return pose;
}
function texture(canvas){const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;}
function atlasMap(base,cols,rows){
 const map=base.clone();map.repeat.set(1/cols,1/rows);map.needsUpdate=true;return map;
}
function frame(map,c,r,cols,rows){map.offset.set(c/cols,1-(r+1)/rows);}
function sprite(base,cols,rows,scaleX,scaleY,bottom=false,opacity=1){
 const map=atlasMap(base,cols,rows),material=new THREE.SpriteMaterial({map,transparent:true,alphaTest:.08,depthTest:true,depthWrite:true,opacity});
 const obj=new THREE.Sprite(material);obj.scale.set(scaleX,scaleY,1);if(bottom)obj.center.set(.5,0);
 return {obj,map,material,col:-1,row:-1,cols,rows};
}
function setFrame(o,col,row){if(col!==o.col||row!==o.row){frame(o.map,col,row,o.cols,o.rows);o.col=col;o.row=row;}}
// Separate texture pools: Texture.clone() shares Source in Three.js.
 // Never assign map.image between blue/purple atlases; it mutates the shared source.
export function createRasenganPool(create,limit=8){
 const pools={normal:[],purple:[]},used={normal:0,purple:0};let count=0;
 return {
  begin(){used.normal=used.purple=count=0;},
  take(base,purple){if(!base||count>=limit)return null;const key=purple?'purple':'normal',i=used[key]++;count++;const pool=pools[key];if(!pool[i])pool[i]=create(base);return pool[i];},
  end(){for(const key of ['normal','purple'])for(let i=used[key];i<pools[key].length;i++)pools[key][i].obj.visible=false;},
  refreshPurple(){for(const f of pools.purple)f.map.needsUpdate=true;}
 };
}
export function rasenganVisualKyubi(player,skill){return !!(player?.character==='naruto'&&player.kyubiLeft>0&&skill?.kyubi);}
function makeShadowTexture(){
 const c=document.createElement('canvas');c.width=c.height=16;const cx=c.getContext('2d');
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){let d=((x-7.5)/7)**2+((y-7.5)/6)**2;if(d<1){cx.fillStyle=d<.6?'rgba(28,32,47,.33)':'rgba(28,32,47,.14)';cx.fillRect(x,y,1,1);}}
 return texture(c);
}
function shadowMesh(geometry,material){const o=new THREE.Mesh(geometry,material);o.rotation.x=-Math.PI/2;o.position.y=.024;return o;}
export function createPixelSystem(scene){
 const sheets=makeSheets(),maps=Object.fromEntries(Object.entries(sheets).map(([key,c])=>[key,texture(c)]));
 const shadowGeo=new THREE.PlaneGeometry(1.1,.86),shadowMat=new THREE.MeshBasicMaterial({map:makeShadowTexture(),transparent:true,depthWrite:false,alphaTest:.03,polygonOffset:true,polygonOffsetFactor:-1});
 const active=new Map(),free={jiraiya:[],jiraiyaSage:[],player:[],npc:[],enemy:[],thrower:[],guard:[],clone:[],sakura:[],teuchi:[],tenten:[],iruka:[],kabuto:[],zabuza:[],haku:[],shikamaru:[],sasuke:[],lee:[],neji:[],gaara:[],shukaku:[],orochimaru:[],whiteSerpent:[],kimimaro:[],kimiMarked:[],kimiCursed:[],sasukeSharingan:[],sasukeMarked:[],sasukeCursed:[],sasukeInjured:[]},trails=[],fxPool=[];
 const worldMeshes=[];let warmIndex=0;const warmKinds=['jiraiya','jiraiyaSage','zabuza','haku','npc','sasuke','kabuto','shukaku','orochimaru','whiteSerpent','kimimaro','kimiMarked','kimiCursed','sasukeSharingan','sasukeMarked','sasukeCursed','sasukeInjured'];
 let generation=0,hero=null,gearKey=null,gearCanvas=null,redGearKey=null,redGearCanvas=null;const rasPool=createRasenganPool(base=>{const f=sprite(base,RAS_COLS,RAS_ROWS,2,2,false);f.material.depthWrite=false;f.obj.renderOrder=6;scene.add(f.obj);return f;});let rasMap=null;try{rasMap=texture(makeRasenganSheet());}catch(e){console.warn('Rasengan art fallback',e);}
 // Load exact approved art into canvas textures; keep visible procedural fallback if decoding fails.
 function pixelLayer(name,w,h,paint){
  const c=document.createElement('canvas');c.width=w;c.height=h;const cx=c.getContext('2d');cx.imageSmoothingEnabled=false;paint?.(cx);
  const map=texture(c);try{const img=new Image();img.onload=()=>{cx.clearRect(0,0,w,h);cx.drawImage(img,0,0);map.needsUpdate=true;for(const f of kyPool)if(f?.base===map)f.map.needsUpdate=true;};img.src=KYUBI_ASSETS[name];}catch{}return map;
 }
 const kyPool=[];let purpleMap=null;try{purpleMap=texture(makeRasenganSheet(true));const img=new Image();img.onload=()=>{const cx=purpleMap.image.getContext('2d');cx.clearRect(0,0,576,48);cx.drawImage(img,0,0);purpleMap.needsUpdate=true;rasPool.refreshPurple();};img.src=KYUBI_ASSETS.orb;}catch{}
 const auraMap=pixelLayer('aura',512,256,cx=>{for(let d=0;d<4;d++)for(let f=0;f<8;f++){cx.fillStyle='#aa2536';cx.fillRect(f*64+17,d*64+21,4,32);cx.fillRect(f*64+43,d*64+19,4,32);cx.fillRect(f*64+21,d*64+47,22,4);cx.fillStyle='#ff6b42';cx.fillRect(f*64+18,d*64+24,2,24);cx.fillRect(f*64+44,d*64+20,2,26);}});
 const armMap=pixelLayer('arm',512,24,cx=>{for(let f=0;f<8;f++){cx.fillStyle='#a52b39';cx.fillRect(f*64,7,62,10);cx.fillStyle='#ff7548';cx.fillRect(f*64,10,64,4);}});
 const tailCanvas=document.createElement('canvas');tailCanvas.width=512;tailCanvas.height=512;const tc=tailCanvas.getContext('2d');tc.imageSmoothingEnabled=false;
 for(let count=1;count<=2;count++)for(let row=0;row<4;row++)for(let f=0;f<8;f++)for(let j=0;j<count;j++){const ox=f*64,oy=((count-1)*4+row)*64,side=row===1?1:row===2?-1:(j%2?1:-1),wave=Math.sin(f*Math.PI/4+j*1.9),spread=count===2?(j?1:-1):side;for(let k=0;k<=24;k++){const u=k/24,x=Math.round(32+side*9*u+spread*(12+j*3)*Math.sin(u*1.6)+wave*4*u),y=Math.round(43-26*u+4*Math.sin(u*4+j)),w=Math.max(1,Math.round(5*(1-u)));tc.fillStyle='#781d33';tc.fillRect(ox+x-w,oy+y-w,w*2+1,w*2+1);tc.fillStyle='#d73e43';tc.fillRect(ox+x-w+1,oy+y-w+1,Math.max(1,w*2-1),Math.max(1,w*2-1));tc.fillStyle='#ff864a';tc.fillRect(ox+x,oy+y,Math.max(1,w),Math.max(1,w));}}const tailMap=texture(tailCanvas);
 function gearSheet(gear,kind='player',red=false){const key=kind+JSON.stringify(gear||{});if(red){if(key!==redGearKey){redGearKey=key;redGearCanvas=makeActorSheet(kind,gear,true);}return redGearCanvas;}if(key!==gearKey){gearKey=key;gearCanvas=makeActorSheet(kind,gear);}return gearCanvas;}
 function previewEquipment(gear,canvas,kind='player'){const c=gearSheet(gear,kind),cx=canvas.getContext('2d');cx.clearRect(0,0,canvas.width,canvas.height);cx.imageSmoothingEnabled=false;cx.drawImage(c,0,0,24,32,0,0,canvas.width,canvas.height);}
 function portrait(kind,canvas){const c=sheets[kind]||sheets.npc,ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;ctx.drawImage(c,0,0,24,19,0,0,canvas.width,canvas.height);}
 function makeActor(kind){
  const scale=kind==='jiraiyaSage'?1.26:kind==='jiraiya'?1.14:kind==='sasukeCursed'?1.22:kind==='kimiCursed'?1.4:kind==='whiteSerpent'?2:kind==='shukaku'?1.85:kind==='zabuza'?1.3:1;const s=sprite(maps[kind],ACTOR_COLS,4,1.80*scale,2.40*scale,true);s.kind=kind;s.baseScale=scale;s.clock=0;s.trailAt=-99;s.shadow=shadowMesh(shadowGeo,shadowMat);
  scene.add(s.obj,s.shadow);return s;
 }
 function begin(){generation++;hero=null;}
 function show(a,kind,dt=0){
  let item=active.get(a);
  if(item&&item.kind!==kind){item.obj.visible=item.shadow.visible=false;free[item.kind].push(item);active.delete(a);item=null;}
  if(!item){item=free[kind].pop()||makeActor(kind);item.clock=0;item.trailAt=-99;item.lastAnim=null;item.pose={state:null,age:0,gait:0,brake:0,sx:1,sy:1};active.set(a,item);}
  item.seen=generation;item.clock+=dt;item.obj.visible=item.shadow.visible=true;
  const row=direction(a.dirX||0,a.dirZ??1),pose=advancePose(item.pose,a,Math.max(0,Math.min(.1,dt))),anim=frameFor(a,item.clock,kind==='player'?pose:null);
  const safeScale=kind==='player'&&!a.fallen;item.obj.scale.set(1.80*item.baseScale*(safeScale?pose.sx:1),2.40*item.baseScale*(safeScale?pose.sy:1),1);
  if(kind==='player'){try{const red=a.character==='naruto'&&(a.kyubiLeft>0||a.anim?.kyubi),sheet=gearSheet(a.equipment,characterFor(a.character).art,red);if(item.map.image!==sheet){item.map.image=sheet;item.map.needsUpdate=true;}}catch(e){console.warn('Equipment art fallback',e);}}
  setFrame(item,anim.col,row);
  item.obj.center.set(.5,a.fallen?.5:0);item.material.rotation=a.fallen?-Math.PI/2:0;item.obj.position.set(a.x,a.fallen?.28:.035+(a.air||0),a.z);item.shadow.position.set(a.x,.024,a.z);item.shadow.scale.set(kind==='whiteSerpent'?2:kind==='shukaku'?1.85:1,kind==='whiteSerpent'?2:kind==='shukaku'?1.85:1,1);
  item.material.opacity=a.waterClone?.66:kind==='clone'?.84:1;item.material.color.setHex(a.shieldLeft>0?0xa5e5ff:a.waterClone?0x79d5ee:a.kyubiLeft>0||a.kyubi?0xffb8a0:a.flash>0?0xffe8cb:a.guard?0xffd98b:a.substitution>0?0xc9f1e4:a.hit>0&&!a.anim?0xffc1a3:a.patrol||a.temporary?(roleFor(a).tint||0xffffff):0xffffff);item.material.opacity=a.invuln>0&&kind==='player'?.75:a.role==='assassin'&&a.ai==='flank'?.55:item.material.opacity;
  if(['sasukeSharingan','sasukeMarked','sasukeCursed','zabuza','haku','jiraiyaSage'].includes(kind)&&a.sprinting&&dt>0&&item.clock-item.trailAt>.075){item.trailAt=item.clock;spawnTrail(a,row,true);}
  if(kind==='player'){hero={actor:a,row,item};if(characterFor(a.character).art==='player'&&a.sprinting&&a.motion&&dt>0&&item.clock-item.trailAt>(a.dashTime>0?.035:.085)){item.trailAt=item.clock;spawnTrail(a,row);}if(characterFor(a.character).art==='player'&&a.anim&&a.anim!==item.lastAnim&&a.anim.k==='j')spawnTrail(a,row);item.lastAnim=a.anim||null;}
  return true;
 }
 function end(){for(const [a,item] of active)if(item.seen!==generation){item.obj.visible=item.shadow.visible=false;active.delete(a);free[item.kind].push(item);}}
 function spawnTrail(a,row,valley=false){
  let t=trails.find(o=>o.life<=0);
  if(!t){if(trails.length>=8)return;t=sprite(maps.smear,3,4,2.4,2.4,true,.5);t.material.depthWrite=false;scene.add(t.obj);trails.push(t);}
  t.life=.18;t.material.color.setHex(valley?0xc1a5f2:a.kyubiLeft>0?0xe94c38:0xffffff);t.rowDir=row;t.obj.visible=true;t.obj.position.set(a.x-(a.dirX||0)*.45,.035,a.z-(a.dirZ||0)*.45);
 }
 function drawTrails(dt){
  for(const tr of trails){if(tr.life<=0){tr.obj.visible=false;continue;}tr.life=Math.max(0,tr.life-dt);tr.obj.visible=tr.life>0;
   setFrame(tr,Math.min(2,Math.floor((1-tr.life/.18)*3)),tr.rowDir);tr.material.opacity=.52*tr.life/.18;}
 }
 function getFX(i){if(!fxPool[i]){const f=sprite(maps.fx,FX_COLS,FX_ROWS.length,2,2,false);f.material.depthWrite=false;scene.add(f.obj);fxPool[i]=f;}return fxPool[i];}
 function effects(list,clones,projectiles,t,dt,quality,player,boss=null){
  drawTrails(dt);rasPool.begin();let kn=0,n=0,limit=quality===1?48:quality===.75?32:20;
  function add(type,x,y,z,size,col,alpha=1,rotation=0,red=false){
   if(n>=limit)return;const f=getFX(n++),row=FX_ROWS.indexOf(type);if(row<0)return;
   setFrame(f,clamp(col,0,7),row);f.obj.position.set(x,y,z);f.obj.scale.set(size,size,1);f.obj.visible=true;f.material.opacity=clamp(alpha,0,1);f.material.rotation=rotation;f.material.color.setHex(red?0xff473c:0xffffff);
  }
  function ras(row,col,x,y,z,size,alpha=1,rotation=0,purple=false){
   const variant=purple&&!!purpleMap,base=variant?purpleMap:rasMap,f=rasPool.take(base,variant);if(!f)return false;setFrame(f,clamp(col,0,11),row);f.obj.position.set(x,y,z);f.obj.scale.set(size,size,1);f.obj.visible=true;f.material.opacity=alpha;f.material.rotation=rotation;return true;
  }
  function ky(base,cols,rows,col,row,x,y,z,w,h,angle=0,order=4,centerY=.5,opacity=1){
   if(kn>=8)return;let f=kyPool[kn];if(!f){f=sprite(base,cols,rows,w,h,false);f.material.depthWrite=false;scene.add(f.obj);kyPool[kn]=f;}kn++;
   if(f.base!==base){f.base=base;f.map.image=base.image;f.cols=cols;f.rows=rows;f.map.repeat.set(1/cols,1/rows);f.map.needsUpdate=true;f.col=f.row=-1;}
   setFrame(f,col,row);f.obj.position.set(x,y,z);f.obj.scale.set(w,h,1);f.obj.center.set(.5,centerY);f.obj.renderOrder=order;f.material.rotation=angle;f.material.opacity=opacity;f.obj.visible=true;
  }
  if(player?.character==='naruto'&&(player.kyubiLeft>0||player.anim?.kyubi)){
   const row=direction(player.dirX,player.dirZ),f=Math.floor(t*13)%8;
   const stage=player.kyubiStage||1,burst=player.kyubiIntro||0;if(stage>=2)ky(tailMap,8,8,f,(stage-2)*4+row,player.x,.05,player.z,4.8+(stage-2)*.5,4.8,0,-2,13/64,.96);ky(auraMap,8,4,f,row,player.x,.035,player.z,4.8+(stage-1)*.35,4.8+(stage-1)*.35,0,-1,13/64,.93);if(stage>=2&&quality>=.75)add('sparks',player.x,1.2,player.z,2.5+stage*.6,f,.55,0,true);if(burst>0)add('shockwave',player.x,.25,player.z,2.0+(1-burst/.85)*5,Math.floor((1-burst/.85)*7),burst/.85,0,true);
   if(player.anim?.k==='j'&&player.anim.kyubi){
    const a=player.anim,elapsed=a.total-a.left,w=a.windup||.095,after=Math.max(.001,a.total-w),extend=elapsed<w?Math.max(.12,elapsed/w):Math.max(0,1-(elapsed-w)/after);
    const reach=(a.clawRange||0)*extend,dx=player.dirX||0,dz=player.dirZ??1,proj=Math.hypot(dx,dz*.64);
    if(reach>.45){const len=reach-.25,angle=Math.atan2(-dz*.64,dx),frame=extend>.8?3:extend>.45?4:5;ky(armMap,8,1,frame,0,player.x+dx*(reach+.25)/2,1.16,player.z+dz*(reach+.25)/2,Math.max(.2,len*proj),1.8,angle,7,.5,1);}
   }
  }
  for(const c of clones)if(c.kyubi)ky(auraMap,8,4,Math.floor(t*13)%8,direction(c.dirX,c.dirZ),c.x,.035,c.z,4.8,4.8,0,-1,13/64,.72);
  // Charge is a continuously rotating sphere; carry keeps it ahead of the hand.
  const pending=player?.pending;
  if(player?.character==='naruto'&&pending?.ras&&player.anim){
   const carrying=pending.phase==='carry',spec=COMBAT.rasengan[pending.k],q=pending.q||0,dir=direction(player.dirX,player.dirZ),hand=rasenganHand(dir,player.anim.rasPose||0),size=spec.size*(rasenganVisualKyubi(player,pending.s)?1.2:.74)*(pending.scale||1)*(carrying?1:Math.min(1,.38+.62*pending.held/pending.s.windup)),f=Math.floor(t*(carrying?30:24))%12,ang=Math.atan2(-player.dirZ*.64,player.dirX);
   const x=player.x+(carrying?player.dirX*.85:hand.x),z=player.z+(carrying?player.dirZ*.85:hand.z),y=hand.y;
   if(rasMap){const purple=rasenganVisualKyubi(player,pending.s);ras(0,f,x,y,z,size,1,0,purple);ras(3,f,x,y,z,size*1.34,.94,0,purple);if(quality>=.75){ras(4,(f+4)%12,x,y,z,size*1.1,.8,0,purple);}if(carrying)ras(5,f,x-player.dirX*1.2,y,z-player.dirZ*1.2,size*1.5,.8,ang,purple);else if(quality===1)ras(2,f,player.x,.15,player.z,size*1.15,.6,0,purple);}
   else add(pending.k==='g'?'giant':'rasengan',x,y,z,size,Math.floor(t*24)%8,1);
  }
  // Priority: main effects and projectiles first, accents second. Shared pool remains capped.
  const accents=[];
  // Reserve the high-priority Katon sprites before ordinary effects consume the shared pool.
  if(boss?.intent?.projectile==='inferno'){const a=boss.intent,q=clamp(1-a.left/a.total,0,1),dx=a.dx,dz=a.dz;add('infernoOrb',boss.x+dx*.9,1.2,boss.z+dz*.9,.9+q*2.8,Math.floor(t*24)%8,1,Math.atan2(-dz*.64,dx));}
  const fires=projectiles.filter(a=>a.kind==='valleyInferno'||a.kind==='valleyEmber'),zones=boss?.fireZones||[];limit=Math.min(48,Math.max(limit,n+fires.length+zones.length+2));
  for(const a of fires){const big=a.kind==='valleyInferno',f=Math.floor(t*(big?28:24))%8,ang=Math.atan2(-a.dz*.64,a.dx);add(big?'infernoOrb':'infernoEmber',a.x,big?1.25:.83,a.z,big?4.6:1.3,f,1,ang);}
  for(const q of zones)add('infernoGround',q.x,.86,q.z,q.r*2.2,Math.floor(t*13+q.x*2+q.z*3)&7,Math.min(1,q.life/.8));
  for(const a of fires)if(a.kind==='valleyInferno'){const trail=a.trail||[],count=quality===1?5:quality===.75?3:2;for(let k=0;k<count;k++){const idx=trail.length-2-k*2;if(idx<0)break;const q=trail[idx],ang=Math.atan2(-(q.dz??a.dz)*.64,q.dx??a.dx),size=2.5*(1-k/(count+1));add('infernoTrail',q.x,.95+.12*Math.sin(t*17+k),q.z,size,(Math.floor(t*28)-k+8)%8,.9*(1-k/(count+1)),ang);}}
  for(const e of list){if(e.type==='bossImpact')continue;if(e.type==='infernoBurst'){const q=clamp(1-e.life/e.max,0,.999);add('infernoBurst',e.x,1.05,e.z,2.2+q*e.r*2.1,Math.floor(q*8),1-q*.65);continue;}
   if(e.reference&&rasMap&&(e.type==='rasengan'||e.type==='giant')){const q=clamp(1-e.life/e.max,0,.999),angle=Math.atan2(-e.dz*.64,e.dx),size=(e.giant?5.0:3.5)*(e.kyubi?1.2:.74)*(e.scale||1),contact=e.contact&&q<.18,f=Math.floor(clamp((q-.18)/.82,0,.999)*12);if(ras(contact?0:1,contact?Math.floor(t*32)%12:f,e.x,1.15,e.z,contact?size*.68:size,1-q*.55,contact?0:angle,!!e.kyubi)){if(quality>=.75){ras(contact?3:2,contact?Math.floor(t*32)%12:f,e.x,contact?1.15:.20,e.z,size*.95,.9*(1-q),0,!!e.kyubi);if(!contact)ras(4,f,e.x,1.15,e.z,size*1.15,.85*(1-q),0,!!e.kyubi);}continue;}}
   const q=clamp(1-e.life/e.max,0,.999),f=Math.floor(q*8),type=FX_ROWS.includes(e.type)?e.type:e.type==='heavy'?'slash':'hit';
   const large=['giant','storm','earth','cracks','wall'].includes(type),size=large?Math.min(5.8,Math.max(2.6,e.r*1.12)):type==='rasengan'?2.9:type==='clone'?2.8:type==='hit'?1.6:2.7;
   add(type,e.x,type==='cracks'||type==='earth'?.55:1.05,e.z,size,f,1-q*.72,0,!!e.kyubi);
   if(['rasengan','giant','lightning','storm','earth','cracks','hit','slash'].includes(type))accents.push(()=>{add('shockwave',e.x,.35,e.z,size*(.7+q*.7),f,.75*(1-q),0,!!e.kyubi);add('sparks',e.x,1+q*.8,e.z,size*.9,f,.9*(1-q),0,!!e.kyubi);});
   else if(type==='heal'||type==='focus'||type==='wall')accents.push(()=>add('aura',e.x,1.2,e.z,size*1.12,f,.8*(1-q)));
  }
  if(player?.pending){
   const s=player.pending.s,k=player.pending.k,q=clamp(1-player.pending.remaining/Math.max(.001,s.windup),0,.999),art=artFor(player.character,k);
   if(art&&!player.pending.ras&&!(rasMap&&player.character==='naruto'&&k===' ')){const centered=['seal','slam'].includes(art.pose),x=player.x+(centered?0:player.dirX*.65),z=player.z+(centered?0:player.dirZ*.65);
    add(art.fx,x,centered?.85:1.35,z,.65+q*1.1,Math.floor(q*5),.85,0,!!s.kyubi);
    if(quality>=.75)add('aura',player.x,1,player.z,1.35+q*.5,Math.floor(q*7),.55,0,!!s.kyubi);
   }
  }
  for(const c of clones){if(c.life>4.58)add('clone',c.x,.95,c.z,2.8,Math.floor(clamp((5-c.life)/.42,0,.999)*8),.9,0,!!c.kyubi);}
  for(const a of projectiles){
   if(a.kind==='sandShuriken'||a.kind==='boneBullet'||a.kind==='valleyBlade'||a.kind==='valleyInferno'||a.kind==='valleyEmber')continue;
   const type=a.kind==='water'?'dragon':a.kind==='iceNeedle'?'ice':['fire','lightning','wind'].includes(a.kind)?a.kind:a.hostile?'kunai':'shuriken',elemental=['dragon','fire','lightning','wind'].includes(type),f=Math.floor(t*25)%8,angle=Math.atan2(-a.dz*.64,a.dx);
   add(type,a.x,.83,a.z,elemental?(type==='dragon'?(a.homing?4.2:3.2):2.2):a.kind==='iceNeedle'?.75:.75,f,1,elemental||a.kind==='iceNeedle'?angle:Math.atan2(-a.dx,-a.dz*.64),!!a.kyubi);
   if(elemental)accents.push(()=>{const tail=type==='fire'?'firetrail':type==='dragon'?'water':type;add(tail,a.x-a.dx*.85,.8,a.z-a.dz*.85,1.8,f,.6,angle,!!a.kyubi);if(quality===1)add('sparks',a.x-a.dx*1.4,.8,a.z-a.dz*1.4,1.3,f,.45,0,!!a.kyubi);});
  }
  if(quality>=.75)for(const draw of accents)draw();
  if(player?.focus>0||player?.guardBuff>0)add(player.focus>0?'focus':'wall',player.x,player.focus>0?2.4:.8,player.z,player.focus>0?.68:2.2,Math.floor(t*10)%8,.55);
  if(hero?.actor.sprinting&&hero.actor.motion&&quality>=.75){const a=hero.actor;add('dash',a.x-(a.dirX||0)*.7,.58,a.z-(a.dirZ||0)*.7,1.75,Math.floor(t*18)%8,.48,0,a.kyubiLeft>0);}
  for(let i=n;i<fxPool.length;i++)fxPool[i].obj.visible=false;rasPool.end();for(let i=kn;i<kyPool.length;i++)kyPool[i].obj.visible=false;
 }
 function addTrees(placements){
  const groups=new Map(),created=[];
  try{
   for(let i=0;i<placements.length;i++){const p=placements[i],variant=i%9===0?2:i%2,k=Math.floor(p.x/20)+','+Math.floor(p.z/20)+','+variant;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(p);}
   const materials=[],geos=[];
   for(let k=0;k<3;k++){
    const tex=atlasMap(maps.trees,3,1);frame(tex,k,0,3,1);
    materials.push(new THREE.MeshBasicMaterial({map:tex,alphaTest:.45,side:THREE.DoubleSide,depthWrite:true}));
    geos.push(new THREE.PlaneGeometry(1,1));
   }
   const dummy=new THREE.Object3D();
   for(const [key,ps] of groups){
    const variant=Number(key.split(',')[2]),inst=new THREE.InstancedMesh(geos[variant],materials[variant],ps.length);
    const shadows=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),shadowMat,ps.length);
    for(let i=0;i<ps.length;i++){
     const p=ps[i],h=4.8*p.s,w=h*TREE_W/TREE_H;
     dummy.rotation.set(TILT,0,0);dummy.scale.set(w,h,1);dummy.position.set(p.x,.04+h*UP_Y/2,p.z+h*UP_Z/2);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);
     dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.set(2.9*p.s,2.1*p.s,1);dummy.position.set(p.x+.4*p.s,.027,p.z);dummy.updateMatrix();shadows.setMatrixAt(i,dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate=shadows.instanceMatrix.needsUpdate=true;inst.computeBoundingSphere();shadows.computeBoundingSphere();
    scene.add(inst,shadows);created.push(inst,shadows);worldMeshes.push(inst,shadows);
   }
   return true;
  }catch(e){for(const o of created)scene.remove(o);console.warn('Pixel tree fallback',e);return false;}
 }
 function addBuildingShadows(buildings){
 if(!buildings.length)return;
 const obj=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),shadowMat,buildings.length),d=new THREE.Object3D();
 for(let i=0;i<buildings.length;i++){const p=buildings[i];d.position.set(p.x+.5,.02,p.z+.35);d.rotation.set(-Math.PI/2,0,0);d.scale.set(p.w+1.8,p.d+1.5,1);d.updateMatrix();obj.setMatrixAt(i,d.matrix);}
 obj.instanceMatrix.needsUpdate=true;obj.computeBoundingSphere();scene.add(obj);worldMeshes.push(obj);
}
function setWorldVisible(visible){for(const o of worldMeshes)o.visible=visible;}
function warmNext(renderer){if(warmIndex>=warmKinds.length)return false;const kind=warmKinds[warmIndex++];try{const item=makeActor(kind);item.obj.visible=item.shadow.visible=false;free[kind].push(item);renderer?.initTexture?.(item.map);}catch(e){console.warn('Optional encounter warmup',e);}return true;}
return {begin,show,end,effects,addTrees,addBuildingShadows,previewEquipment,portrait,maps,sheets,setWorldVisible,warmNext};
}
