import {COMBAT} from './combat-data.js';
import {characterFor} from './character-data.js';
import * as THREE from 'three';
import {makeActorSheet,makeSheets,ANIMS,ACTOR_W,ACTOR_H,ACTOR_COLS,FX_ROWS,FX_SIZE,FX_COLS,TREE_W,TREE_H,artFor,makeRasenganSheet,RAS_COLS,RAS_ROWS,rasenganPose,rasenganHand} from './pixel-art.js';
const TILT=-Math.atan2(25,30),UP_Y=Math.cos(TILT),UP_Z=Math.sin(TILT);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function direction(x=0,z=1){return Math.abs(x)>Math.abs(z)?(x<0?1:2):(z<0?3:0);}
export function frameFor(actor,clock){
 const a=actor.anim;
 if(a&&a.left>0){
  if(actor.character==='naruto'&&Number.isInteger(a.rasPose))return {col:38+a.rasPose,state:'rasengan'};
  if(actor.character==='naruto'&&a.k===' ')return {col:38+rasenganPose(a),state:'rasengan'};
  const special=actor.character&&artFor(actor.character,a.k);if(special){const v=ANIMS[special.pose],elapsed=Math.max(0,a.total-a.left),windup=a.windup||.001,recovery=Math.max(.001,a.total-windup);const phase=elapsed<windup?(elapsed<windup*.55?0:1):elapsed<windup+recovery*.65?2:3;return {col:v.start+phase,state:special.pose};}
  const state=(a.k==='l'||a.k===' '||a.k==='f'||a.k==='g')?'cast':a.combo===2?'kick':a.combo===3?'finish':'attack',v=ANIMS[state],progress=clamp(1-a.left/a.total,0,.999);
  const col=a.windup?(a.left>a.total-a.windup?v.start:v.start+Math.min(v.count-1,1+Math.floor((1-a.left/(a.total-a.windup))*(v.count-1)))):v.start+Math.min(v.count-1,Math.floor(progress*v.count));return {col,state};
 }
 if(actor.hit>0&&!actor.anim)return {col:13,state:'hit'};
 const moving=actor.motion??Boolean(actor.walk),state=moving?(actor.sprinting?'run':'walk'):'idle',v=ANIMS[state];
 return {col:v.start+Math.floor(clock*v.fps)%v.count,state};
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
function makeShadowTexture(){
 const c=document.createElement('canvas');c.width=c.height=16;const cx=c.getContext('2d');
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){let d=((x-7.5)/7)**2+((y-7.5)/6)**2;if(d<1){cx.fillStyle=d<.6?'rgba(28,32,47,.33)':'rgba(28,32,47,.14)';cx.fillRect(x,y,1,1);}}
 return texture(c);
}
function shadowMesh(geometry,material){const o=new THREE.Mesh(geometry,material);o.rotation.x=-Math.PI/2;o.position.y=.024;return o;}
export function createPixelSystem(scene){
 const sheets=makeSheets(),maps=Object.fromEntries(Object.entries(sheets).map(([key,c])=>[key,texture(c)]));
 const shadowGeo=new THREE.PlaneGeometry(1.1,.86),shadowMat=new THREE.MeshBasicMaterial({map:makeShadowTexture(),transparent:true,depthWrite:false,alphaTest:.03,polygonOffset:true,polygonOffsetFactor:-1});
 const active=new Map(),free={player:[],npc:[],enemy:[],thrower:[],guard:[],clone:[],sakura:[],teuchi:[],tenten:[],iruka:[],zabuza:[],haku:[],shikamaru:[],sasuke:[],lee:[],neji:[],gaara:[]},trails=[],fxPool=[];
 let generation=0,hero=null,gearKey=null,gearCanvas=null;const rasPool=[];let rasMap=null;try{rasMap=texture(makeRasenganSheet());}catch(e){console.warn('Rasengan art fallback',e);}
 function gearSheet(gear,kind='player'){const key=kind+JSON.stringify(gear||{});if(key!==gearKey){gearKey=key;gearCanvas=makeActorSheet(kind,gear);}return gearCanvas;}
 function previewEquipment(gear,canvas,kind='player'){const c=gearSheet(gear,kind),cx=canvas.getContext('2d');cx.clearRect(0,0,canvas.width,canvas.height);cx.imageSmoothingEnabled=false;cx.drawImage(c,0,0,24,32,0,0,canvas.width,canvas.height);}
 function portrait(kind,canvas){const c=sheets[kind]||sheets.npc,ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;ctx.drawImage(c,0,0,24,19,0,0,canvas.width,canvas.height);}
 function makeActor(kind){
  const scale=kind==='zabuza'?1.3:1;const s=sprite(maps[kind],ACTOR_COLS,4,1.80*scale,2.40*scale,true);s.kind=kind;s.clock=0;s.trailAt=-99;s.shadow=shadowMesh(shadowGeo,shadowMat);
  scene.add(s.obj,s.shadow);return s;
 }
 function begin(){generation++;hero=null;}
 function show(a,kind,dt=0){
  let item=active.get(a);
  if(!item){item=free[kind].pop()||makeActor(kind);item.clock=0;item.trailAt=-99;item.lastAnim=null;active.set(a,item);}
  item.seen=generation;item.clock+=dt;item.obj.visible=item.shadow.visible=true;
  const row=direction(a.dirX||0,a.dirZ??1),anim=frameFor(a,item.clock);
  if(kind==='player'){try{gearSheet(a.equipment,characterFor(a.character).art);if(item.gearKey!==gearKey){item.map.image=gearCanvas;item.map.needsUpdate=true;item.gearKey=gearKey;}}catch(e){console.warn('Equipment art fallback',e);}}
  setFrame(item,anim.col,row);
  item.obj.position.set(a.x,.035,a.z);item.shadow.position.set(a.x,.024,a.z);
  item.material.opacity=kind==='clone'?.84:1;item.material.color.setHex(a.flash>0?0xffe8cb:a.guard?0xffd98b:a.substitution>0?0xc9f1e4:a.hit>0&&!a.anim?0xffc1a3:0xffffff);item.material.opacity=a.invuln>0&&kind==='player'?.75:item.material.opacity;
  if(kind==='player'){hero={actor:a,row,item};if(characterFor(a.character).art==='player'&&a.sprinting&&a.motion&&dt>0&&item.clock-item.trailAt>(a.dashTime>0?.035:.085)){item.trailAt=item.clock;spawnTrail(a,row);}if(characterFor(a.character).art==='player'&&a.anim&&a.anim!==item.lastAnim&&a.anim.k==='j')spawnTrail(a,row);item.lastAnim=a.anim||null;}
  return true;
 }
 function end(){for(const [a,item] of active)if(item.seen!==generation){item.obj.visible=item.shadow.visible=false;active.delete(a);free[item.kind].push(item);}}
 function spawnTrail(a,row){
  let t=trails.find(o=>o.life<=0);
  if(!t){if(trails.length>=8)return;t=sprite(maps.smear,3,4,2.4,2.4,true,.5);t.material.depthWrite=false;scene.add(t.obj);trails.push(t);}
  t.life=.18;t.rowDir=row;t.obj.visible=true;t.obj.position.set(a.x-(a.dirX||0)*.45,.035,a.z-(a.dirZ||0)*.45);
 }
 function drawTrails(dt){
  for(const tr of trails){if(tr.life<=0){tr.obj.visible=false;continue;}tr.life=Math.max(0,tr.life-dt);tr.obj.visible=tr.life>0;
   setFrame(tr,Math.min(2,Math.floor((1-tr.life/.18)*3)),tr.rowDir);tr.material.opacity=.52*tr.life/.18;}
 }
 function getFX(i){if(!fxPool[i]){const f=sprite(maps.fx,FX_COLS,FX_ROWS.length,2,2,false);f.material.depthWrite=false;scene.add(f.obj);fxPool[i]=f;}return fxPool[i];}
 function effects(list,clones,projectiles,t,dt,quality,player){
  drawTrails(dt);let rn=0,n=0,limit=quality===1?48:quality===.75?32:20;
  function add(type,x,y,z,size,col,alpha=1,rotation=0){
   if(n>=limit)return;const f=getFX(n++),row=FX_ROWS.indexOf(type);if(row<0)return;
   setFrame(f,clamp(col,0,7),row);f.obj.position.set(x,y,z);f.obj.scale.set(size,size,1);f.obj.visible=true;f.material.opacity=clamp(alpha,0,1);f.material.rotation=rotation;
  }
  function ras(row,col,x,y,z,size,alpha=1,rotation=0){
   if(!rasMap||rn>=8)return false;let f=rasPool[rn];if(!f){f=sprite(rasMap,RAS_COLS,RAS_ROWS,2,2,false);f.material.depthWrite=false;f.obj.renderOrder=6;scene.add(f.obj);rasPool[rn]=f;}rn++;setFrame(f,clamp(col,0,11),row);f.obj.position.set(x,y,z);f.obj.scale.set(size,size,1);f.obj.visible=true;f.material.opacity=alpha;f.material.rotation=rotation;return true;
  }
  // Charge is a continuously rotating sphere; carry keeps it ahead of the hand.
  const pending=player?.pending;
  if(player?.character==='naruto'&&pending?.ras&&player.anim){
   const carrying=pending.phase==='carry',spec=COMBAT.rasengan[pending.k],q=pending.q||0,dir=direction(player.dirX,player.dirZ),hand=rasenganHand(dir,player.anim.rasPose||0),size=spec.size*(pending.scale||1),f=Math.floor(t*(carrying?30:24))%12,ang=Math.atan2(-player.dirZ*.64,player.dirX);
   const x=player.x+(carrying?player.dirX*.85:hand.x),z=player.z+(carrying?player.dirZ*.85:hand.z),y=hand.y;
   if(rasMap){ras(0,f,x,y,z,size,1);if(quality>=.75){ras(3,f,x,y,z,size*1.34,.9);ras(4,(f+4)%12,x,y,z,size*1.1,.8);}if(carrying)ras(5,f,x-player.dirX*1.2,y,z-player.dirZ*1.2,size*1.5,.8,ang);else if(quality===1)ras(2,f,player.x,.15,player.z,size*1.15,.6);}
   else add(pending.k==='g'?'giant':'rasengan',x,y,z,size,Math.floor(t*24)%8,1);
  }
  // Priority: main effects and projectiles first, accents second. Shared pool remains capped.
  const accents=[];
  for(const e of list){
   if(e.reference&&rasMap&&(e.type==='rasengan'||e.type==='giant')){const q=clamp(1-e.life/e.max,0,.999),angle=Math.atan2(-e.dz*.64,e.dx),size=(e.giant?5.0:3.5)*(e.scale||1),contact=e.contact&&q<.18,f=Math.floor(clamp((q-.18)/.82,0,.999)*12);if(ras(contact?0:1,contact?Math.floor(t*32)%12:f,e.x,1.15,e.z,contact?size*.68:size,1-q*.55,contact?0:angle)){if(quality>=.75){ras(contact?3:2,contact?Math.floor(t*32)%12:f,e.x,contact?1.15:.20,e.z,size*.95,.9*(1-q));if(!contact)ras(4,f,e.x,1.15,e.z,size*1.15,.85*(1-q));}continue;}}
   const q=clamp(1-e.life/e.max,0,.999),f=Math.floor(q*8),type=FX_ROWS.includes(e.type)?e.type:e.type==='heavy'?'slash':'hit';
   const large=['giant','storm','earth','cracks','wall'].includes(type),size=large?Math.min(5.8,Math.max(2.6,e.r*1.12)):type==='rasengan'?2.9:type==='clone'?2.8:type==='hit'?1.6:2.7;
   add(type,e.x,type==='cracks'||type==='earth'?.55:1.05,e.z,size,f,1-q*.72);
   if(['rasengan','giant','lightning','storm','earth','cracks','hit','slash'].includes(type))accents.push(()=>{add('shockwave',e.x,.35,e.z,size*(.7+q*.7),f,.75*(1-q));add('sparks',e.x,1+q*.8,e.z,size*.9,f,.9*(1-q));});
   else if(type==='heal'||type==='focus'||type==='wall')accents.push(()=>add('aura',e.x,1.2,e.z,size*1.12,f,.8*(1-q)));
  }
  if(player?.pending){
   const s=player.pending.s,k=player.pending.k,q=clamp(1-player.pending.remaining/Math.max(.001,s.windup),0,.999),art=artFor(player.character,k);
   if(art&&!player.pending.ras&&!(rasMap&&player.character==='naruto'&&k===' ')){const centered=['seal','slam'].includes(art.pose),x=player.x+(centered?0:player.dirX*.65),z=player.z+(centered?0:player.dirZ*.65);
    add(art.fx,x,centered?.85:1.35,z,.65+q*1.1,Math.floor(q*5),.85);
    if(quality>=.75)add('aura',player.x,1,player.z,1.35+q*.5,Math.floor(q*7),.55);
   }
  }
  for(const c of clones){if(c.life>4.58)add('clone',c.x,.95,c.z,2.8,Math.floor(clamp((5-c.life)/.42,0,.999)*8),.9);}
  for(const a of projectiles){
   const type=a.kind==='water'?'dragon':['fire','lightning','wind'].includes(a.kind)?a.kind:a.hostile?'kunai':'shuriken',elemental=['dragon','fire','lightning','wind'].includes(type),f=Math.floor(t*25)%8,angle=Math.atan2(-a.dz*.64,a.dx);
   add(type,a.x,.83,a.z,elemental?(type==='dragon'?3.2:2.2):.75,f,1,elemental?angle:Math.atan2(-a.dx,-a.dz*.64));
   if(elemental)accents.push(()=>{const tail=type==='fire'?'firetrail':type==='dragon'?'water':type;add(tail,a.x-a.dx*.85,.8,a.z-a.dz*.85,1.8,f,.6,angle);if(quality===1)add('sparks',a.x-a.dx*1.4,.8,a.z-a.dz*1.4,1.3,f,.45);});
  }
  if(quality>=.75)for(const draw of accents)draw();
  if(player?.focus>0||player?.guardBuff>0)add(player.focus>0?'focus':'wall',player.x,player.focus>0?2.4:.8,player.z,player.focus>0?.68:2.2,Math.floor(t*10)%8,.55);
  if(hero?.actor.sprinting&&hero.actor.motion&&quality>=.75){const a=hero.actor;add('dash',a.x-(a.dirX||0)*.7,.58,a.z-(a.dirZ||0)*.7,1.75,Math.floor(t*18)%8,.48);}
  for(let i=n;i<fxPool.length;i++)fxPool[i].obj.visible=false;for(let i=rn;i<rasPool.length;i++)rasPool[i].obj.visible=false;
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
    scene.add(inst,shadows);created.push(inst,shadows);
   }
   return true;
  }catch(e){for(const o of created)scene.remove(o);console.warn('Pixel tree fallback',e);return false;}
 }
 function addBuildingShadows(buildings){
 if(!buildings.length)return;
 const obj=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),shadowMat,buildings.length),d=new THREE.Object3D();
 for(let i=0;i<buildings.length;i++){const p=buildings[i];d.position.set(p.x+.5,.02,p.z+.35);d.rotation.set(-Math.PI/2,0,0);d.scale.set(p.w+1.8,p.d+1.5,1);d.updateMatrix();obj.setMatrixAt(i,d.matrix);}
 obj.instanceMatrix.needsUpdate=true;obj.computeBoundingSphere();scene.add(obj);
}
return {begin,show,end,effects,addTrees,addBuildingShadows,previewEquipment,portrait,maps,sheets};
}
