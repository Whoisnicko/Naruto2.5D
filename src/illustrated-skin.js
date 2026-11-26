import * as THREE from 'three';
import {createAtmosphereView,sampleLight,ATMOSPHERE_WEATHER} from './konoha-atmosphere.js?v=3c61';

// Presentation only. Never owns a player, quest, AI, collision, inventory or save.
export const BUILDING_ART=['house-orange','house-blue','house-round','ramen','house-terrace','house-courtyard','house-tile','academy'];
const TREE_ART=['tree-oak','tree-pine','tree-willow'],TILT=-Math.atan2(25,30),UP_Y=Math.cos(TILT),UP_Z=Math.sin(TILT);
export const ENVIRONMENT_ART=[...new Set([...BUILDING_ART,...TREE_ART,'grass-natural','cobbles-irregular','water-clear','dirt-compact','plaza-tiles','mountain','lamp-post'])];
export function buildingPlacement(b,index){return {name:BUILDING_ART[index%BUILDING_ART.length],x:b.x,z:b.z+b.d/2,width:b.w+1.05};}
export function groundPlacements(){return [
 {name:'grass-natural',x:0,z:0,w:100,d:100,y:.032,repeat:7},
 {name:'grass-natural',x:80,z:0,w:60,d:40,y:.032,repeat:7},
 {name:'cobbles-irregular',x:0,z:-2,w:100,d:5.2,y:.045,repeat:5},
 {name:'cobbles-irregular',x:-13,z:-2,w:4.6,d:100,y:.046,repeat:5},
 {name:'dirt-compact',x:80,z:-1,w:60,d:6,y:.047,repeat:6},
 {name:'plaza-tiles',x:-13,z:-2,w:8,d:5.2,y:.05,repeat:6},
 {name:'water-clear',x:8,z:0,w:5,d:100,y:.057,repeat:5}
];}
export function createIllustratedSkin({view,canvas,overlay,buildings,foliage,replaceTrees=true,loadTexture=null}){
 const root=new THREE.Group();root.visible=false;view.scene.add(root);
 const loaded=new Map(),failures=[],buildingVisuals=[],treeVisuals=[],lamps=[-25,-20,-15,-10,-5].map(x=>({x,z:2}));
 let active=false,ready=false,treesReady=false,weatherBlend={rain:0,fog:0,shade:0},previousKind='',stormAt=0,nextFlash=0,boltSeed=0,flashAge=Infinity,w=0,h=0;
 const acquire=loadTexture|| (async name=>{
  const img=new Image();img.src=new URL('../assets/konoha-world3c/'+name+'.webp',import.meta.url).href;await img.decode();
  // Keep tile images unchanged. Crop transparent padding on illustrations.
  const c=document.createElement('canvas');c.width=img.width;c.height=img.height;let ctx=c.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('canvas unavailable');ctx.drawImage(img,0,0);
  if(!['grass-natural','cobbles-irregular','water-clear','dirt-compact','plaza-tiles'].includes(name)){const d=ctx.getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=-1,y1=-1;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>32){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}if(x1<0)throw Error('empty image');const out=document.createElement('canvas');out.width=x1-x0+1;out.height=y1-y0+1;out.getContext('2d').drawImage(c,x0,y0,out.width,out.height,0,0,out.width,out.height);const texture=new THREE.CanvasTexture(out);texture.colorSpace=THREE.SRGBColorSpace;return {texture,aspect:out.height/out.width};}
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return {texture,aspect:c.height/c.width};
 });
 function plane(d){const a=loaded.get(d.name);if(!a)return null;const g=new THREE.PlaneGeometry(d.w,d.d);g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(d.x-d.w/2+uv.getX(i)*d.w)/d.repeat,(d.z+d.d/2-uv.getY(i)*d.d)/d.repeat);const tex=a.texture.clone();tex.wrapS=tex.wrapT=THREE.MirroredRepeatWrapping;tex.needsUpdate=true;const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));m.position.set(d.x,d.y,d.z);root.add(m);return m;}
 function billboard(name,x,z,width){const a=loaded.get(name);if(!a)return null;const height=width*a.aspect,mat=new THREE.MeshBasicMaterial({map:a.texture,alphaTest:.22,side:THREE.DoubleSide,depthWrite:true});const m=new THREE.Mesh(new THREE.PlaneGeometry(width,height),mat);m.rotation.x=TILT;m.position.set(x,.04+height*UP_Y/2,z+height*UP_Z/2);root.add(m);return m;}
 let atmosphere=null;try{atmosphere=createAtmosphereView({canvas:overlay,stage:canvas,project:(x,y,z)=>project(x,y,z),lamps:()=>lamps.map(l=>({head:project(l.x,1.75,l.z),ground:project(l.x,.04,l.z)}))});}catch(e){console.warn('Illustrated weather fallback',e);}
 function project(x,y,z){const q=view.project(x,y,z);return q?[q.x,q.y,Math.max(1,innerHeight/24*(view.camera.zoom||1))]:null;}
 async function initialize(){await Promise.all(ENVIRONMENT_ART.map(async name=>{try{loaded.set(name,await acquire(name));}catch{failures.push(name);}}));
  for(const d of groundPlacements())plane(d);
  buildings.forEach((b,i)=>{const p=buildingPlacement(b,i),m=billboard(p.name,p.x,p.z,p.width);if(m)buildingVisuals.push({fallback:b.fallback,m,x:p.x,z:p.z});});
  treesReady=replaceTrees&&TREE_ART.every(n=>loaded.has(n));if(treesReady)foliage.forEach((f,i)=>{const m=billboard(TREE_ART[i%3],f.x,f.z,3.9*f.s);if(m)treeVisuals.push({m,x:f.x,z:f.z});});
  billboard('mountain',-13,-49,55);for(const lamp of lamps)billboard('lamp-post',lamp.x+.26,lamp.z,1.1);
  ready=true;return status();
 }
 function sync({visible,x,z,spanX,enabled=true}){active=!!(ready&&visible&&enabled);root.visible=active;const near=(a)=>Math.abs(a.x-x)<spanX+20&&Math.abs(a.z-z)<42;for(const b of buildings){b.fallback.visible=visible&&near(b)&&!buildingVisuals.some(v=>v.fallback===b.fallback&&active);}
  for(const b of buildingVisuals)b.m.visible=active&&near(b);for(const a of treeVisuals)a.m.visible=active&&near(a);return active&&treesReady;
 }
 function drawAtmosphere({clock,kind,time,dt,x,z}){if(!active||!atmosphere)return false;
  if(innerWidth!==w||innerHeight!==h){w=innerWidth;h=innerHeight;atmosphere.resize(w,h);}const target=ATMOSPHERE_WEATHER[kind]||ATMOSPHERE_WEATHER.clear,blend=1-Math.exp(-Math.max(0,dt)*2.4);for(const key of ['rain','fog','shade'])weatherBlend[key]+=(target[key]-weatherBlend[key])*blend;
  if(kind!==previousKind){previousKind=kind;flashAge=Infinity;nextFlash=time+2;weatherBlend.shade=Math.max(0,weatherBlend.shade);}
  if(kind==='storm'&&time>=nextFlash){stormAt=time;nextFlash=time+6.1;boltSeed=(Math.sin(time*13.3)+1)/2;}flashAge=kind==='storm'&&stormAt>0?time-stormAt:Infinity;
  const flash=flashAge<.14?.54*(1-flashAge/.14):flashAge>=.23&&flashAge<.4?.35*(1-(flashAge-.23)/.17):0;
  overlay.hidden=false;atmosphere.draw({...sampleLight(clock),...weatherBlend,kind,elapsed:time,boltAge:flashAge,boltSeed,flash},x>=50?'outpost':x>=14?'forest':'konoha',dt,{x,y:z},dt);return true;
 }
 function hideAtmosphere(){overlay.hidden=true;}function disable(){ready=false;active=false;root.visible=false;hideAtmosphere();}
 function status(){return {ready,active,loaded:loaded.size,missing:[...failures],buildings:buildingVisuals.length,trees:treeVisuals.length};}
 return {initialize,sync,drawAtmosphere,hideAtmosphere,disable,status};
}
