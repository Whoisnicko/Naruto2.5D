import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';

import { makeArtAtlas, styleWorldMaterial, classifySurface, makeWater, makeChakra } from './art.js';

const lin = v => v <= .04045 ? v / 12.92 : ((v+.055)/1.055)**2.4;
function arrays(capacity) {
  return { pos:new Float32Array(capacity*3), col:new Float32Array(capacity*3), norm:new Float32Array(capacity*3), uv:new Float32Array(capacity*2) };
}
function fill(a, raw) {
  for(let i=0,j=0,k=0;i<raw.length;i+=18,j+=9,k+=6){
    const ux=raw[i+6]-raw[i],uy=raw[i+7]-raw[i+1],uz=raw[i+8]-raw[i+2];
    const vx=raw[i+12]-raw[i],vy=raw[i+13]-raw[i+1],vz=raw[i+14]-raw[i+2];
    let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
    const len=Math.hypot(nx,ny,nz)||1;nx/=len;ny/=len;nz/=len;
    for(let v=0;v<3;v++){
      const s=i+v*6,d=j+v*3;
      a.pos[d]=raw[s];a.pos[d+1]=raw[s+1];a.pos[d+2]=raw[s+2];
      a.col[d]=lin(raw[s+3]);a.col[d+1]=lin(raw[s+4]);a.col[d+2]=lin(raw[s+5]);
      a.norm[d]=nx;a.norm[d+1]=ny;a.norm[d+2]=nz;
      a.uv[k+v*2]=raw[s]/4;a.uv[k+v*2+1]=raw[s+2]/4;
    }
  }
}
function geometry(a,dynamic=false){
  const g=new THREE.BufferGeometry();
  for(const [name,data,size] of [['position',a.pos,3],['color',a.col,3],['normal',a.norm,3],['uv',a.uv,2]]){
    const attr=new THREE.BufferAttribute(data,size);
    if(dynamic)attr.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute(name,attr);
  }
  return g;
}
function terrainTexture(){
  const data=new Uint8Array(64*64*4);let seed=19;
  for(let i=0;i<64*64;i++){
    seed=(seed*1664525+1013904223)>>>0;
    const v=224+Math.floor(seed/4294967296*32);
    data.set([v,v,v,255],i*4);
  }
  const t=new THREE.DataTexture(data,64,64);
  t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;
  return t;
}
const gradient=new THREE.DataTexture(new Uint8Array([95,155,218,255]),4,1,THREE.RedFormat);
gradient.minFilter=gradient.magFilter=THREE.NearestFilter;gradient.generateMipmaps=false;gradient.needsUpdate=true;
const toon=()=>new THREE.MeshToonMaterial({vertexColors:true,side:THREE.DoubleSide,gradientMap:gradient});

export function createRenderer(canvas){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xb5d5cc);scene.fog=new THREE.Fog(0xb5d5cc,58,130);
  const camera=new THREE.OrthographicCamera(-12,12,12,-12,.1,180);
  scene.add(new THREE.HemisphereLight(0xfff2d4,0x829bb0,1.2));
  const sun=new THREE.DirectionalLight(0xffe2ad,2.1);
  sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera,{left:-23,right:23,top:23,bottom:-23,near:.5,far:100});
  sun.shadow.camera.updateProjectionMatrix();sun.shadow.bias=-.00015;sun.shadow.normalBias=.035;
  scene.add(sun,sun.target);
  const solid=toon(),atlas=makeArtAtlas(),ground=styleWorldMaterial(toon(),atlas),worldMat=styleWorldMaterial(toon(),atlas);
  const water=makeWater(scene),chakra=makeChakra(scene);
  const fxmat=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide});
  let quality=1;
  function addStatic(raw,terrain=false){
    const a=arrays(raw.length/6);fill(a,raw);const g=geometry(a);g.computeBoundingSphere();
    const surface=new Float32Array(raw.length/6);for(let i=0;i<raw.length;i+=18){const v=classifySurface(raw[i+3],raw[i+4],raw[i+5],terrain);surface.fill(v,i/6,i/6+3);}g.setAttribute('artSurface',new THREE.BufferAttribute(surface,1));
    const obj=new THREE.Mesh(g,terrain?ground:worldMat);
    obj.receiveShadow=true;obj.castShadow=!terrain;scene.add(obj);return obj;
  }
  function batch(material,cast){
    let cap=0,a=null;
    const obj=new THREE.Mesh(new THREE.BufferGeometry(),material);obj.frustumCulled=false;
    obj.castShadow=cast;obj.receiveShadow=cast;scene.add(obj);
    return raw=>{
      const n=raw.length/6;
      if(!n){obj.visible=false;return;}
      obj.visible=true;
      if(n>cap){cap=Math.max(512,2**Math.ceil(Math.log2(n)));a=arrays(cap);obj.geometry.dispose();obj.geometry=geometry(a,true);}
      fill(a,raw);
      for(const name of ['position','color','normal','uv']){
        const attr=obj.geometry.getAttribute(name);attr.clearUpdateRanges();attr.addUpdateRange(0,n*attr.itemSize);attr.needsUpdate=true;
      }
      obj.geometry.setDrawRange(0,n);
    };
  }
  const drawActors=batch(solid,true),drawEffects=batch(fxmat,false);
  function resize(q){
    quality=q;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)*q);
    renderer.setSize(Math.max(1,innerWidth),Math.max(1,innerHeight),false);
    const aspect=innerWidth/Math.max(1,innerHeight);
    camera.left=-12*aspect;camera.right=12*aspect;camera.updateProjectionMatrix();
    renderer.shadowMap.enabled=q>=.75;sun.castShadow=q>=.75;
    const size=q===1?1024:512;
    if(sun.shadow.mapSize.x!==size){sun.shadow.mapSize.set(size,size);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}}
  }
  function frame(x,z){
    camera.position.set(x,25,z+30);camera.lookAt(x,0,z);
    sun.position.set(x+14,32,z+18);sun.target.position.set(x,0,z);sun.target.updateMatrixWorld();
    renderer.render(scene,camera);
  }
  return {scene,renderer,camera,addStatic,drawActors,drawEffects,resize,frame,solid,artFrame(t,effects,clones){water(t);chakra(effects,clones,t,quality,renderer.getPixelRatio());},get quality(){return quality}};
}

// Optional GLB actors. Missing or invalid assets never replace the working procedural actor.
export async function createAssetActors(scene, report=()=>{}){
  const templates=new Map(),active=new Map(),loader=new GLTFLoader();
  let generation=0;
  async function load(){
    try{
      const response=await fetch(new URL('../assets/manifest.json',import.meta.url));
      if(!response.ok)throw Error('manifest unavailable');
      const manifest=await response.json();
      await Promise.all(Object.entries(manifest.characters||{}).map(async ([kind,config])=>{
        if(!config?.url)return;
        try{
          const gltf=await loader.loadAsync(new URL(config.url,new URL('../assets/manifest.json',import.meta.url)).href);
          templates.set(kind,{gltf,config});report(kind+' GLB listo');
        }catch(e){console.warn('GLB fallback',kind,e);report(kind+': modelo de respaldo');}
      }));
    }catch(e){console.warn('Manifest fallback',e);}
  }
  void load();
  function begin(){generation++;}
  function show(actor,kind,dt){
    const template=templates.get(kind==='clone'?'player':kind);
    if(!template)return false;
    let item=active.get(actor);
    if(!item){
      try{
        const {gltf,config}=template,model=cloneSkeleton(gltf.scene);
        const bounds=new THREE.Box3().setFromObject(model),height=bounds.max.y-bounds.min.y;
        if(!Number.isFinite(height)||height<.00001)return false;
        const scale=(config.height||1.85)/height;
        model.scale.multiplyScalar(scale);
        model.position.set(-(bounds.min.x+bounds.max.x)*scale/2,-bounds.min.y*scale,-(bounds.min.z+bounds.max.z)*scale/2);
        model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
        const root=new THREE.Group();root.add(model);
        const mixer=new THREE.AnimationMixer(model),actions={};
        for(const name of ['idle','walk','run','attack','shuriken','clone','rasengan']){
          const requested=config.animations?.[name];
          const clip=gltf.animations.find(c=>requested?c.name===requested:c.name.toLowerCase().includes(name));
          if(clip)actions[name]=mixer.clipAction(clip);
        }
        scene.add(root);item={root,mixer,actions,current:null,config,seen:generation};active.set(actor,item);
      }catch(e){console.warn('Actor fallback',e);return false;}
    }
    item.seen=generation;item.root.visible=true;
    item.root.position.set(actor.x,0,actor.z);
    item.root.rotation.y=Math.atan2(actor.dirX||0,actor.dirZ??1)+(item.config.rotationY||0);
    const skill=actor.anim?.k;
    const state=skill?({'j':'attack','k':'shuriken','l':'clone',' ':'rasengan'}[skill]||'attack'):(actor.walk?'walk':'idle');
    const next=item.actions[state]||item.actions.attack&&skill&&item.actions.attack||item.actions.idle||Object.values(item.actions)[0];
    if(next&&next!==item.current){item.current?.fadeOut(.12);next.reset().fadeIn(.12).play();item.current=next;}
    if(dt>0)item.mixer.update(dt);
    return true;
  }
  function end(){for(const [actor,item] of active){if(item.seen!==generation){scene.remove(item.root);item.mixer.stopAllAction();item.mixer.uncacheRoot(item.root.children[0]);active.delete(actor);}}}
  return {begin,show,end};
}

// Rigged procedural backups: one reusable geometry per character type, independent skeleton per actor.
// The original actor is still available if rig creation fails.
function skinGeometry(raw){
  const n=raw.length/6,a=arrays(n);fill(a,raw);
  const g=geometry(a),indices=new Uint16Array(n*4),weights=new Float32Array(n*4);
  const clamp=x=>Math.max(0,Math.min(1,x));
  for(let i=0;i<n;i+=3){
    const x=(a.pos[i*3]+a.pos[(i+1)*3]+a.pos[(i+2)*3])/3;
    const y=(a.pos[i*3+1]+a.pos[(i+1)*3+1]+a.pos[(i+2)*3+1])/3;
    let first=1,second=1,pivot=0;
    if(y>1.25){first=2;second=2;}
    else if(y<.63){first=x<0?7:9;second=first+1;pivot=.36;}
    else if(Math.abs(x)>.335&&y<1.23){first=x<0?3:5;second=first+1;pivot=.91;}
    for(let v=i;v<i+3;v++){
      let w=first===second?1:clamp((a.pos[v*3+1]-pivot+.07)/.14);
      indices[v*4]=first;indices[v*4+1]=second;
      weights[v*4]=w;weights[v*4+1]=1-w;
    }
  }
  g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));
  g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));
  g.computeBoundingSphere();return g;
}
export function createProceduralActors(scene,material,rawByKind){
  const templates=new Map(),active=new Map();
  for(const [kind,raw] of Object.entries(rawByKind))templates.set(kind,skinGeometry(raw));
  let generation=0;
  function begin(){generation++;}
  function make(kind){
    const bones=[];
    function bone(parent,x,y,z){const b=new THREE.Bone();b.position.set(x,y,z);if(parent!==null)bones[parent].add(b);bones.push(b);return b;}
    bone(null,0,0,0);bone(0,0,.65,0);bone(1,0,.70,0);
    bone(1,-.34,.48,0);bone(3,-.08,-.22,0);
    bone(1,.34,.48,0);bone(5,.08,-.22,0);
    bone(0,-.16,.67,0);bone(7,-.01,-.31,0);
    bone(0,.16,.67,0);bone(9,.01,-.31,0);
    const obj=new THREE.SkinnedMesh(templates.get(kind),material);
    obj.add(bones[0]);obj.bind(new THREE.Skeleton(bones));obj.frustumCulled=false;
    obj.castShadow=true;obj.receiveShadow=true;scene.add(obj);
    return {obj,bones,seen:generation,angle:null,blend:0,clock:0};
  }
  function show(a,kind,dt=0){
    if(!templates.has(kind))return false;
    let item=active.get(a);
    if(!item){try{item=make(kind);active.set(a,item);}catch(e){console.warn('Rig fallback',kind,e);return false;}}
    item.seen=generation;
    const {obj,bones:b}=item;
    const k=1-Math.exp(-Math.max(0,dt)*13),moving=a.motion??Boolean(a.walk);
    item.blend+=(Number(moving)-item.blend)*k;item.clock+=dt;
    const w=Math.sin(a.walk||0)*item.blend,act=a.anim&&a.anim.left>0?Math.sin(Math.PI*(1-a.anim.left/a.anim.total)):0;
    const run=a.sprinting?1:0,breath=Math.sin(item.clock*2.6)*.017*(1-item.blend);
    obj.position.set(a.x,Math.abs(w)*.035+breath,a.z);
    const target=Math.atan2(a.dirX||0,a.dirZ??1);
    if(item.angle===null)item.angle=target;
    item.angle+=Math.atan2(Math.sin(target-item.angle),Math.cos(target-item.angle))*k;
    obj.rotation.y=item.angle;
    const pose=(i,x,y,z)=>{b[i].rotation.x+=(x-b[i].rotation.x)*k;b[i].rotation.y+=(y-b[i].rotation.y)*k;b[i].rotation.z+=(z-b[i].rotation.z)*k;};
    pose(1,-.045*Math.abs(w)-run*.22*item.blend-act*.12,act*.16,w*.025);
    pose(2,-breath*.4,-act*.09,0);
    const back=run*.70*item.blend;
    pose(3,w*.44-act*.25+back,0,-act*.08);
    pose(4,-.12-act*.22-back*.22,0,0);
    pose(5,-w*.44-act*1.14+back,0,act*.12);
    pose(6,-.12-act*.55-back*.22,0,0);
    pose(7,-w*(.43+run*.19),0,0);pose(8,Math.max(0,w)*(.4+run*.16),0,0);
    pose(9,w*(.43+run*.19),0,0);pose(10,Math.max(0,-w)*(.4+run*.16),0,0);
    if(a.anim?.k==='l'){pose(3,-act*.9,0,-.12*act);pose(5,-act*.9,0,.12*act);pose(4,-act*.65,0,0);pose(6,-act*.65,0,0);}
    if(a.anim?.k===' '){pose(3,-act*.62,0,-act*.22);pose(5,-act*1.5,0,.15*act);pose(6,-act*.75,0,0);}
    return true;
  }
  function end(){for(const [actor,item] of active){if(item.seen!==generation){scene.remove(item.obj);item.obj.skeleton.dispose();active.delete(actor);}}}
  return {begin,show,end};
}
