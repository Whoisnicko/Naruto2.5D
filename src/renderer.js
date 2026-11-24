import * as THREE from 'three';
import { makeWorldPattern } from './pixel-art.js';

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
// A single nearest-neighbor texture for grass, pavement, wood, and roof tiles.
// All lighting for static geometry is baked once into vertex colors.
function pixelMaterial(){
 const mat=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide});
 try{
  const tex=new THREE.CanvasTexture(makeWorldPattern());tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;tex.colorSpace=THREE.SRGBColorSpace;
  mat.onBeforeCompile=shader=>{
   shader.uniforms.pixelAtlas={value:tex};
   shader.vertexShader='attribute float surfaceType; varying float vSurface; varying vec3 vPixelPos; varying vec3 vPixelNormal;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSurface=surfaceType;vPixelPos=position;vPixelNormal=normal;');
   shader.fragmentShader='uniform sampler2D pixelAtlas; varying float vSurface; varying vec3 vPixelPos; varying vec3 vPixelNormal;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nvec3 pn=abs(normalize(vPixelNormal));vec2 pp=pn.y>.55?vPixelPos.xz:(pn.x>pn.z?vPixelPos.zy:vPixelPos.xy);float tile=floor(vSurface+.5);vec2 uvp=fract(pp*.70);vec2 uvAtlas=vec2((tile+uvp.x)/4.,uvp.y);diffuseColor.rgb*=mix(vec3(1.),texture2D(pixelAtlas,uvAtlas).rgb,.55);');
  };
  mat.customProgramCacheKey=()=> 'shinobi-pixel-world-1';
 }catch(e){console.warn('World texture fallback',e);}
 return mat;
}
function surface(r,g,b,terrain){
 if(g>r*1.08&&g>b*1.12)return 0;
 if(terrain)return 1;
 if(r>g*1.2&&g>b*1.1&&r<.68)return 2;
 if(r>g*1.3&&r>b*1.25)return 3;
 return 1;
}
export function createRenderer(canvas){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'high-performance'});
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=false;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xadcbb6);scene.fog=new THREE.Fog(0xadcbb6,61,125);
  const camera=new THREE.OrthographicCamera(-12,12,12,-12,.1,180);
  const solid=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide}),world=pixelMaterial();
  const fxmat=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide});
  let quality=1;
  function addStatic(raw,terrain=false){
    const a=arrays(raw.length/6);fill(a,raw);const g=geometry(a);g.computeBoundingSphere();
    const types=new Float32Array(raw.length/6);for(let i=0;i<raw.length;i+=18){const v=surface(raw[i+3],raw[i+4],raw[i+5],terrain);types.fill(v,i/6,i/6+3);const j=i/2,ny=a.norm[j+1],nz=a.norm[j+2],nx=a.norm[j];const dot=nx*.32+ny*.78+nz*.42;const shade=dot>.6?1:dot>.1?.91:dot>-.35?.77:.67;for(let q=j;q<j+9;q++)a.col[q]*=shade;}
    g.setAttribute('surfaceType',new THREE.BufferAttribute(types,1));const obj=new THREE.Mesh(g,world);scene.add(obj);return obj;
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
    quality=q;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1)*q);
    renderer.setSize(Math.max(1,innerWidth),Math.max(1,innerHeight),false);
    const aspect=innerWidth/Math.max(1,innerHeight);
    camera.left=-12*aspect;camera.right=12*aspect;camera.updateProjectionMatrix();

  }
  function frame(x,z,shot={}){
    const zoom=shot.zoom||1,yaw=shot.yaw||0,lookY=shot.lookY||0;
    if(Math.abs(camera.zoom-zoom)>.0005){camera.zoom=zoom;camera.updateProjectionMatrix();}
    camera.position.set(x+Math.sin(yaw)*30,25,z+Math.cos(yaw)*30);camera.lookAt(x,lookY,z);
    renderer.render(scene,camera);
  }
  const projection=new THREE.Vector3();function project(x,y,z){projection.set(x,y,z).project(camera);if(Math.abs(projection.x)>1.15||Math.abs(projection.y)>1.15||Math.abs(projection.z)>1)return null;return {x:(projection.x+1)*innerWidth/2,y:(1-projection.y)*innerHeight/2};}
  return {scene,renderer,camera,addStatic,drawActors,drawEffects,resize,frame,project,solid,get quality(){return quality}};
}

