import * as THREE from 'three';
import {makeActorSheet,makeSheets,ANIMS,ACTOR_W,ACTOR_H,ACTOR_COLS,FX_ROWS,FX_SIZE,FX_COLS,TREE_W,TREE_H} from './pixel-art.js';
const TILT=-Math.atan2(25,30),UP_Y=Math.cos(TILT),UP_Z=Math.sin(TILT);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function direction(x=0,z=1){return Math.abs(x)>Math.abs(z)?(x<0?1:2):(z<0?3:0);}
export function frameFor(actor,clock){
 const a=actor.anim;
 if(a&&a.left>0){
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
 const active=new Map(),free={player:[],npc:[],enemy:[],thrower:[],guard:[],clone:[]},trails=[],fxPool=[];
 let generation=0,hero=null,gearKey=null,gearCanvas=null,gearTexture=null;
 function gearSheet(gear){const key=JSON.stringify(gear||{});if(key!==gearKey){gearKey=key;gearCanvas=makeActorSheet('player',gear);if(!gearTexture)gearTexture=texture(gearCanvas);else{gearTexture.image=gearCanvas;gearTexture.needsUpdate=true;}}return gearCanvas;}
 function previewEquipment(gear,canvas){const c=gearSheet(gear),cx=canvas.getContext('2d');cx.clearRect(0,0,canvas.width,canvas.height);cx.imageSmoothingEnabled=false;cx.drawImage(c,0,0,24,32,0,0,canvas.width,canvas.height);}
 function makeActor(kind){
  const s=sprite(maps[kind],ACTOR_COLS,4,1.80,2.40,true);s.kind=kind;s.clock=0;s.trailAt=-99;s.shadow=shadowMesh(shadowGeo,shadowMat);
  scene.add(s.obj,s.shadow);return s;
 }
 function begin(){generation++;hero=null;}
 function show(a,kind,dt=0){
  let item=active.get(a);
  if(!item){item=free[kind].pop()||makeActor(kind);item.clock=0;item.trailAt=-99;item.lastAnim=null;active.set(a,item);}
  item.seen=generation;item.clock+=dt;item.obj.visible=item.shadow.visible=true;
  const row=direction(a.dirX||0,a.dirZ??1),anim=frameFor(a,item.clock);
  if(kind==='player'){try{gearSheet(a.equipment);if(item.gearKey!==gearKey){item.map.image=gearCanvas;item.map.needsUpdate=true;item.gearKey=gearKey;}}catch(e){console.warn('Equipment art fallback',e);}}
  setFrame(item,anim.col,row);
  item.obj.position.set(a.x,.035,a.z);item.shadow.position.set(a.x,.024,a.z);
  item.material.opacity=kind==='clone'?.84:1;item.material.color.setHex(a.flash>0?0xffe8cb:a.guard?0xffd98b:a.substitution>0?0xc9f1e4:a.hit>0&&!a.anim?0xffc1a3:0xffffff);item.material.opacity=a.invuln>0&&kind==='player'?.75:item.material.opacity;
  if(kind==='player'){hero={actor:a,row,item};if(a.sprinting&&a.motion&&dt>0&&item.clock-item.trailAt>(a.dashTime>0?.035:.085)){item.trailAt=item.clock;spawnTrail(a,row);}if(a.anim&&a.anim!==item.lastAnim&&(a.anim.k==='j'||a.anim.k===' '))spawnTrail(a,row);item.lastAnim=a.anim||null;}
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
  drawTrails(dt);let n=0,limit=quality===1?48:quality===.75?32:20;
  function add(type,x,y,z,size,col,alpha=1,rotation=0){
   if(n>=limit)return;const f=getFX(n++),row=FX_ROWS.indexOf(type);if(row<0)return;
   setFrame(f,clamp(col,0,7),row);f.obj.position.set(x,y,z);f.obj.scale.set(size,size,1);f.obj.visible=true;f.material.opacity=clamp(alpha,0,1);f.material.rotation=rotation;
  }
  for(const e of list){const progress=clamp(1-e.life/e.max,0,.999),blue=e.col?.[2]>.75&&e.col?.[0]<.65;add(['dash','substitute','clone'].includes(e.type)?e.type:blue?'rasengan':'hit',e.x,blue?1.12:.85,e.z,e.type==='giant'?5:blue?3.1:e.type==='heavy'?2.6:1.9,Math.floor(progress*8),1-progress*.72);}
  if(player?.pending?.k===' '||player?.pending?.k==='g'){const progress=1-player.pending.remaining/player.pending.s.windup;add('rasengan',player.x+player.dirX*.5,1.2,player.z+player.dirZ*.5,.75+progress*.8,Math.min(5,Math.floor(progress*6)),.9);}
  for(const c of clones){if(c.life>4.58)add('clone',c.x,.95,c.z,2.8,Math.floor(clamp((5-c.life)/.42,0,.999)*8),.9);}
  for(const a of projectiles)add(a.kind==='wind'?'wind':a.hostile?'kunai':'shuriken',a.x,.83,a.z,a.kind==='wind'?1.9:.75,Math.floor(t*25)%8,1,a.hostile?Math.atan2(-a.dx,-a.dz*.64):0);
  if(hero?.actor.sprinting&&hero.actor.motion&&quality>=.75){const a=hero.actor;add('dash',a.x-(a.dirX||0)*.7,.58,a.z-(a.dirZ||0)*.7,1.75,Math.floor(t*18)%8,.48);}
  for(let i=n;i<fxPool.length;i++)fxPool[i].obj.visible=false;
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
return {begin,show,end,effects,addTrees,addBuildingShadows,previewEquipment,maps,sheets};
}
