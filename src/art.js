import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const TAU=Math.PI*2;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const noise=(x,y)=>{const f=Math.sin(x*127.1+y*311.7)*43758.5453;return f-Math.floor(f);};
export function makeArtAtlas(){
  const N=256,T=64,data=new Uint8Array(N*N*4);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    const tile=Math.floor(x/T),u=(x%T)/T,v=(y%T)/T;
    let b=237+noise(x,y)*13;
    if(tile===0)b=226+16*Math.sin(u*TAU*3+Math.sin(v*TAU*2))**2+noise(x,y)*10;
    if(tile===1)b=235+noise(x,y)*11-9*Math.sin(v*TAU*2)**4;
    if(tile===2)b=218+17*Math.sin(u*TAU*7+Math.sin(v*TAU*2)*.8)**2+noise(x,y)*10-(u<.035?38:0);
    if(tile===3){const row=Math.floor(v*5),seam=(u+(row%2)*.125)%.25;b=230+18*Math.sin(u*TAU*4)**2+noise(x,y)*7-((v*5)%1<.08||seam<.018?38:0);}
    const i=(y*N+x)*4;b=clamp(Math.round(b),0,255);data.set([b,b,b,255],i);
  }
  const tex=new THREE.DataTexture(data,N,N);tex.magFilter=THREE.LinearFilter;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.generateMipmaps=true;tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;return tex;
}
export function styleWorldMaterial(mat,atlas){
  mat.onBeforeCompile=shader=>{
    shader.uniforms.artAtlas={value:atlas};
    shader.vertexShader='attribute float artSurface; varying float vArtSurface; varying vec3 vArtPos; varying vec3 vArtNormal;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvArtSurface=artSurface;vArtPos=position;vArtNormal=normal;');
    shader.fragmentShader='uniform sampler2D artAtlas; varying float vArtSurface; varying vec3 vArtPos; varying vec3 vArtNormal;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nvec3 artN=abs(normalize(vArtNormal)); vec2 artUV=artN.y>0.55?vArtPos.xz:(artN.x>artN.z?vArtPos.zy:vArtPos.xy); float artTile=floor(vArtSurface+0.5); vec2 artCell=fract(artUV*0.7); vec2 artAUV=vec2((artTile+mix(0.04,0.96,artCell.x))/4.0,mix(0.04,0.96,artCell.y)); diffuseColor.rgb*=mix(vec3(1.0),texture2D(artAtlas,artAUV).rgb,0.65);');
  };
  mat.customProgramCacheKey=()=> 'shinobi-art-atlas-v1';return mat;
}
export function classifySurface(r,g,b,terrain){
  if(terrain)return g>r*1.1&&g>b*1.25?0:3;
  if(r>g*1.18&&g>b*1.12&&r<.65)return 2;
  if(r>g*1.35&&r>b*1.25)return 3;
  if(g>r*1.08&&g>b*1.15)return 0;
  return 1;
}
async function localGLB(name){
  const res=await fetch(new URL('../assets/nature/'+name+'.glb.b64',import.meta.url));
  if(!res.ok)throw Error('asset unavailable: '+name);
  const encoded=(await res.text()).replace(/\s/g,'');
  if(encoded.length>1500000||!encoded.startsWith('Z2xURg'))throw Error('invalid GLB: '+name);
  const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0)),dv=new DataView(bytes.buffer);
  if(bytes.length<20||dv.getUint32(0,true)!==0x46546c67||dv.getUint32(8,true)!==bytes.length)throw Error('invalid GLB header');
  return new GLTFLoader().parseAsync(bytes.buffer,'');
}
function instanceModel(scene,model,placements,targetHeight){
  model.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  if(!Number.isFinite(size.y)||size.y<.01)throw Error('invalid model bounds');
  const group=new THREE.Group(),dummy=new THREE.Object3D(),transform=new THREE.Matrix4();
  let count=0;
  model.traverse(node=>{
    if(!node.isMesh||node.isSkinnedMesh)return;
    const inst=new THREE.InstancedMesh(node.geometry,node.material,placements.length);
    for(let i=0;i<placements.length;i++){
      const p=placements[i],s=targetHeight*p.s/size.y;
      dummy.position.set(p.x,0,p.z);dummy.rotation.set(0,p.angle,0);dummy.scale.setScalar(s);dummy.updateMatrix();
      transform.makeTranslation(-center.x,-bounds.min.y,-center.z);
      inst.setMatrixAt(i,dummy.matrix.clone().multiply(transform).multiply(node.matrixWorld));
    }
    inst.instanceMatrix.needsUpdate=true;inst.computeBoundingSphere();inst.castShadow=true;inst.receiveShadow=true;group.add(inst);count++;
  });
  if(!count)throw Error('no instanced meshes');
  scene.add(group);return group;
}
export function installNature(scene,foliage,fallbacks){
  const trees=foliage.map((p,i)=>({...p,angle:i*2.399963}));
  const bushes=[];
  for(let i=0;i<trees.length;i+=2){const p=trees[i];bushes.push({x:p.x+.9*p.s,z:p.z+.5*p.s,s:p.s*.85,angle:i*1.7});}
  async function install(name,placements,height){
    const gltf=await localGLB(name),chunks=new Map(),groups=[];
    for(const p of placements){const k=Math.floor(p.x/20)+','+Math.floor(p.z/20);if(!chunks.has(k))chunks.set(k,[]);chunks.get(k).push(p);}
    try{for(const ps of chunks.values())groups.push(instanceModel(scene,gltf.scene,ps,height));}
    catch(e){for(const group of groups)scene.remove(group);throw e;}
  }
  void install('tree1',trees,4.5).then(()=>{for(const f of fallbacks){f.replaced=true;f.obj.visible=false;}}).catch(e=>console.warn('Tree fallback retained',e));
  if(bushes.length)void install('bush',bushes,.85).catch(e=>console.warn('Optional bushes unavailable',e));
}
export function makeWater(scene){
  const time={value:0};
  const mat=new THREE.ShaderMaterial({uniforms:{time},vertexShader:'varying vec2 vWorld; void main(){vWorld=(modelMatrix*vec4(position,1.0)).xz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform float time; varying vec2 vWorld; void main(){float a=sin(vWorld.x*3.4+vWorld.y*.8-time*1.5); float b=sin(vWorld.y*2.7-vWorld.x*1.1-time*1.8); float ripple=smoothstep(.82,.98,a*.65+b*.35); float bank=smoothstep(2.2,2.9,abs(vWorld.x-9.0)); vec3 col=mix(vec3(.035,.25,.32),vec3(.12,.49,.54),.52+.22*a+.12*b);col=mix(col,vec3(.65,.87,.83),ripple*.48+bank*.18);gl_FragColor=vec4(col,1.);\n#include <colorspace_fragment>\n}',side:THREE.DoubleSide});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(6,100),mat);mesh.rotation.x=-Math.PI/2;mesh.position.set(9,.042,0);scene.add(mesh);
  return t=>{time.value=t;};
}
export function makeChakra(scene){
  const capacity=280,positions=new Float32Array(capacity*3),sizes=new Float32Array(capacity),colors=new Float32Array(capacity*3),alpha=new Float32Array(capacity);
  const g=new THREE.BufferGeometry();
  for(const [name,buf,n] of [['position',positions,3],['size',sizes,1],['tint',colors,3],['opacity',alpha,1]])g.setAttribute(name,new THREE.BufferAttribute(buf,n).setUsage(THREE.DynamicDrawUsage));
  const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{pixelRatio:{value:1}},vertexShader:'attribute float size;attribute vec3 tint;attribute float opacity;varying vec3 c;varying float a;uniform float pixelRatio;void main(){c=tint;a=opacity;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_PointSize=size*pixelRatio;}',fragmentShader:'varying vec3 c;varying float a;void main(){float d=length(gl_PointCoord-.5)*2.;float glow=exp(-d*d*4.)*(1.-smoothstep(.55,1.,d));gl_FragColor=vec4(c,glow*a);}'});
  const points=new THREE.Points(g,mat);points.frustumCulled=false;scene.add(points);
  return (effects,clones,t,quality,ratio)=>{
    let n=0;
    function add(x,y,z,s,r,g,b,a){if(n>=capacity)return;positions.set([x,y,z],n*3);colors.set([r,g,b],n*3);sizes[n]=s;alpha[n++]=a;}
    const count=quality===1?26:quality===.75?16:8;
    for(const e of effects){
      if(!(e.col?.[2]>.75&&e.col?.[0]<.65))continue;
      const life=clamp(e.life/e.max,0,1),progress=1-life;
      add(e.x,.88,e.z,44*life+10,.12,.75,1,.85*life);
      for(let i=0;i<count;i++){const a=i*TAU/count+t*13,r=.2+e.r*progress*.65+(i%3)*.12;add(e.x+Math.cos(a)*r,.8+Math.sin(a*2)*.36,e.z+Math.sin(a)*r,7+(i%3)*3,.18,.72,1,life*.85);}
    }
    for(const c of clones){if(c.life>4.65)for(let i=0;i<8;i++){const a=i*TAU/8;add(c.x+Math.cos(a)*.45,.5+i*.08,c.z+Math.sin(a)*.45,16,.7,.9,1,(c.life-4.65)*1.8);}}
    g.setDrawRange(0,n);for(const a of Object.values(g.attributes))a.needsUpdate=true;mat.uniforms.pixelRatio.value=ratio;
  };
}
