import {BONE_VALLEY as A,rng,clearDecor,boneForestLayout,treeLayout,forestVisible} from './kimimaro-valley-data.js?v=6f3';
// Original procedural surface, inspired by anime reference palette, no screenshots.
export function valleyFloorArt(){
 const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const r=rng(613),w=1024;
 g.fillStyle='#879e55';g.fillRect(0,0,w,w);
 const center=g.createRadialGradient(512,512,105,512,512,270);center.addColorStop(0,'#c7b27c');center.addColorStop(.52,'#b9b17b');center.addColorStop(.82,'#9ca867');center.addColorStop(1,'rgba(135,158,85,0)');g.fillStyle=center;g.fillRect(0,0,w,w);
 for(let i=0;i<175;i++){const x=r()*w,y=r()*w,rad=12+r()*62,inside=Math.hypot(x-512,y-512)<190,grad=g.createRadialGradient(x,y,0,x,y,rad);grad.addColorStop(0,inside?'rgba(154,120,72,.15)':i%3?'rgba(58,103,48,.18)':'rgba(194,193,107,.20)');grad.addColorStop(1,'rgba(135,158,85,0)');g.fillStyle=grad;g.fillRect(x-rad,y-rad,rad*2,rad*2);}
 for(let i=0;i<17000;i++){const x=r()*w,y=r()*w,inside=Math.hypot(x-512,y-512)<175+r()*22;g.fillStyle=inside?(i%2?'rgba(102,83,49,.15)':'rgba(237,220,169,.18)'):(i%2?'rgba(42,79,36,.24)':'rgba(218,214,130,.20)');g.fillRect(x,y,.8+r()*1.5,inside?.6+r()*1.4:1.1+r()*4.5);}
 for(let i=0;i<35;i++){let x=350+r()*324,y=350+r()*324;if(Math.hypot(x-512,y-512)>178)continue;g.beginPath();g.moveTo(x,y);let ang=r()*6.28;for(let j=0;j<3;j++){ang+=(r()-.5)*1.2;x+=Math.cos(ang)*(3+r()*8);y+=Math.sin(ang)*(3+r()*8);g.lineTo(x,y);}g.lineWidth=.7;g.strokeStyle='rgba(110,88,54,.14)';g.stroke();}
 return c;
}
export function boneGeometry(THREE){
 // Asymmetric blade-like taper, ivory face and blue-grey shaded facet.
 const rings=10,sides=7,pos=[],col=[],idx=[],light=new THREE.Color('#fff8e6'),shadow=new THREE.Color('#9eafb8');
 for(let i=0;i<=rings;i++){const t=i/rings,rad=Math.max(.012,(1-t)**.75*(1+.07*Math.sin(t*12)));
  for(let j=0;j<sides;j++){const a=j*2*Math.PI/sides,rr=rad*(1+.13*Math.cos(j*2.7+t*4));pos.push(Math.cos(a)*rr+t*t,.0+t,Math.sin(a)*rr*.66);const shade=(.5+.5*Math.cos(a+.65))*.66+.11;const c=shadow.clone().lerp(light,shade);col.push(c.r,c.g,c.b);}}
 for(let i=0;i<rings;i++)for(let j=0;j<sides;j++){const a=i*sides+j,b=i*sides+(j+1)%sides;idx.push(a,a+sides,b,b,a+sides,b+sides);}
 for(let j=1;j<sides-1;j++)idx.push(rings*sides,rings*sides+j,rings*sides+j+1);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));geo.setIndex(idx);geo.computeVertexNormals();return geo;
}
export async function createBoneValley({THREE,scene}){
 const group=new THREE.Group(),guides=new THREE.Group(),forest=new THREE.Group();group.name=A.id;guides.visible=false;forest.visible=false;scene.add(group,guides);group.add(forest);const P=A.palette,r=rng(),failures=[];
 const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.94,...extra});
 let map=null;try{map=new THREE.CanvasTexture(valleyFloorArt());map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;}catch{failures.push('floor texture');}
 const floorGeo=new THREE.PlaneGeometry(A.floor,A.floor);floorGeo.rotateX(-Math.PI/2);const floor=new THREE.Mesh(floorGeo,material(map?'#ffffff':P.ground,{map}));floor.position.y=-.027;group.add(floor);
 const mat4=new THREE.Matrix4(),v=new THREE.Vector3(),scale=new THREE.Vector3(),q=new THREE.Quaternion(),euler=new THREE.Euler();
 function batch(target,items,geo,mat){if(!items.length)return;const mesh=new THREE.InstancedMesh(geo,mat,items.length);items.forEach(([x,y,z,sx,sy,sz,yaw,rx=0,rz=0],i)=>{v.set(x,y,z);scale.set(sx,sy,sz);euler.set(rx,yaw,rz);q.setFromEuler(euler);mat4.compose(v,q,scale);mesh.setMatrixAt(i,mat4);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();target.add(mesh);}
 const trunks=[],crownDark=[],crownLight=[],bushes=[],rocks=[],spikes=[],roots=[],chips=[];
 for(const {x,z,h,w,yaw} of treeLayout()){
  trunks.push([x,h*.32,z,.23,h*.64,.23,yaw]);
  crownDark.push([x,h*.78,z,w,h*.36,w*.9,yaw],[x-w*.52,h*.66,z+.25,w*.68,h*.23,w*.65,yaw]);
  crownLight.push([x+w*.45,h*.90,z-.15,w*.64,h*.25,w*.65,yaw],[x-w*.14,h*.98,z,w*.76,h*.27,w*.73,yaw]);
 }
 for(let i=0;i<68;i++){const a=r()*6.283,d=20+r()*13,x=Math.cos(a)*d,z=Math.sin(a)*d,w=.45+r()*.8;if(clearDecor(x,z,w*1.5))bushes.push([x,w*.48,z,w,w*.53,w*.75,r()*6.283]);}
 for(let i=0;i<35;i++){const a=r()*6.283,d=18.7+r()*10,x=Math.cos(a)*d,z=Math.sin(a)*d,w=.22+r()*.46;if(clearDecor(x,z,w*1.5))rocks.push([x,w*.26,z,w,w*.4,w*.8,r()*6.283]);}
 const ico=new THREE.IcosahedronGeometry(1,1),rock=new THREE.DodecahedronGeometry(1,0);
 batch(group,trunks,new THREE.CylinderGeometry(.72,1,1,7),material('#74664a'));batch(group,crownDark,ico,material('#49743f'));batch(group,crownLight,ico,material('#6f984d'));batch(group,bushes,ico,material('#668c48'));batch(group,rocks,rock,material(P.rock));
 for(const b of boneForestLayout()){
  spikes.push([b.x,0,b.z,b.lean,b.h,b.w,b.yaw,0,0]);
  roots.push([b.x,.075,b.z,b.w*1.25,.12,b.w*.95,b.yaw]);
  if(b.h>4.0)chips.push([b.x+Math.cos(b.yaw)*.8,.12,b.z+Math.sin(b.yaw)*.8,b.w*.65,.38,b.w*.4,b.yaw,.22,.38]);
 }
 batch(forest,roots,rock,material('#a69c78'));batch(forest,spikes,boneGeometry(THREE),material('#ffffff',{vertexColors:true,side:THREE.DoubleSide,roughness:.8}));batch(forest,chips,rock,material(P.bone));
 const edge=new THREE.RingGeometry(A.radius-.045,A.radius+.025,96);edge.rotateX(-Math.PI/2);const border=new THREE.Mesh(edge,new THREE.MeshBasicMaterial({color:'#756d4a',transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide}));border.position.y=.006;group.add(border);
 const pos=new Float32Array(A.dust*3),seeds=[];for(let i=0;i<A.dust;i++)seeds.push([r()*6.283,16+r()*15,.25+r()*3.5,r()*6.283]);
 const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(pos,3).setUsage(THREE.DynamicDrawUsage));const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:P.ash,size:.075,transparent:true,opacity:.20,depthWrite:false}));dust.frustumCulled=false;group.add(dust);
 function updateAtmosphere(t){for(let i=0;i<seeds.length;i++){const [a,rad,y,phase]=seeds[i],j=i*3;pos[j]=Math.cos(a+t*.013)*rad;pos[j+1]=y+.22*Math.sin(t*.5+phase);pos[j+2]=Math.sin(a+t*.013)*rad;}dg.attributes.position.needsUpdate=true;}
 function setPhase(phase){forest.visible=forestVisible(phase);}
 updateAtmosphere(0);return {group,guides,failures,updateAtmosphere,setPhase};
}
