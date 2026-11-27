import {BONE_VALLEY as A,rng,ribPath,clearDecor} from './kimimaro-valley-data.js?v=6f1';
export function valleyFloorArt(){
 const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const r=rng(613),w=1024;
 g.fillStyle='#515b59';g.fillRect(0,0,w,w);
 for(let i=0;i<130;i++){const x=r()*w,y=r()*w,rad=35+r()*130,grad=g.createRadialGradient(x,y,0,x,y,rad);grad.addColorStop(0,i%2?'rgba(172,180,169,.16)':'rgba(20,28,35,.19)');grad.addColorStop(1,'rgba(81,91,89,0)');g.fillStyle=grad;g.fillRect(x-rad,y-rad,rad*2,rad*2);}
 for(let i=0;i<215;i++){let x=r()*w,y=r()*w,ang=r()*6.283;g.beginPath();g.moveTo(x,y);for(let j=0;j<4;j++){ang+=(r()-.5)*1.3;x+=Math.cos(ang)*(5+r()*27);y+=Math.sin(ang)*(5+r()*27);g.lineTo(x,y);}g.lineWidth=.6+r()*1.2;g.strokeStyle='rgba(23,32,34,.25)';g.stroke();}
 for(let i=0;i<22000;i++){g.fillStyle=i%2?'rgba(207,211,197,.11)':'rgba(20,26,30,.11)';g.fillRect(r()*w,r()*w,.5+r()*2,.5+r()*2);}
 return c;
}
export async function createBoneValley({THREE,scene}){
 const group=new THREE.Group(),guides=new THREE.Group();group.name=A.id;guides.visible=false;scene.add(group,guides);const P=A.palette,r=rng(),failures=[];
 let map=null;try{map=new THREE.CanvasTexture(valleyFloorArt());map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;}catch{failures.push('floor texture');}
 const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.96,...extra});
 const geo=new THREE.PlaneGeometry(A.floor,A.floor);geo.rotateX(-Math.PI/2);const floor=new THREE.Mesh(geo,material(map?'#ffffff':P.ground,{map}));floor.position.y=-.027;group.add(floor);
 // Pale, tapered curved ribs. Tube rings are stitched into one mesh per rib.
 function rib(x,z,yaw,h){
  if(!clearDecor(x,z,4.8))return;const pts=ribPath(x,z,yaw,h).map(p=>new THREE.Vector3(...p));const curve=new THREE.CatmullRomCurve3(pts);const n=20,sides=9,frames=curve.computeFrenetFrames(n,false),positions=[],indices=[];
  for(let i=0;i<=n;i++){const t=i/n,p=curve.getPointAt(t),rad=.66*Math.pow(1-t,.82)+.018;for(let j=0;j<sides;j++){const a=j*2*Math.PI/sides,rr=rad*(1+.07*Math.sin(j*3+i*.52)),v=p.clone().addScaledVector(frames.normals[i],Math.cos(a)*rr).addScaledVector(frames.binormals[i],Math.sin(a)*rr);positions.push(v.x,v.y,v.z);}}
  for(let i=0;i<n;i++)for(let j=0;j<sides;j++){const a=i*sides+j,b=i*sides+(j+1)%sides;indices.push(a,a+sides,b,b,a+sides,b+sides);}
  const last=n*sides;for(let j=1;j<sides-1;j++)indices.push(last,last+j,last+j+1);
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();const m=new THREE.Mesh(geometry,material(P.bone,{side:THREE.DoubleSide}));group.add(m);
 }
 for(const [x,z,yaw,h] of A.ribs){rib(x,z,yaw,h);rib(x+Math.cos(yaw+Math.PI/2)*1.8,z+Math.sin(yaw+Math.PI/2)*1.8,yaw+.13,h*.69);}
 // Jagged cliffs: subdued dark slate behind the ivory structures.
 for(const [x,z,w,h] of A.cliffs){if(!clearDecor(x,z,w))continue;const m=new THREE.Mesh(new THREE.DodecahedronGeometry(1,0),material(P.rock));m.position.set(x,h*.25,z);m.scale.set(w,h*.75,w*.8);m.rotation.y=r()*6.283;group.add(m);const b=new THREE.Mesh(new THREE.DodecahedronGeometry(1,0),material(P.slate));b.position.set(x+2,h*.42,z-2);b.scale.set(w*.5,h*.66,w*.48);b.rotation.y=r()*6.283;group.add(b);}
 // Small fragments and low angled bones: batched by geometry, no collision.
 const rubble=[],spikes=[];for(let i=0;i<120;i++){const a=r()*6.283,d=17.3+r()*11,x=Math.cos(a)*d,z=Math.sin(a)*d,s=.18+r()*.5;if(clearDecor(x,z,1.1))rubble.push([x,s*.29,z,s,s*.6,s*.85,r()*6.283]);}
 for(let i=0;i<48;i++){const a=r()*6.283,d=18.5+r()*9,x=Math.cos(a)*d,z=Math.sin(a)*d,h=.55+r()*1.7;if(clearDecor(x,z,2.2))spikes.push([x,h*.45,z,.18+r()*.13,h,.22+r()*.1,r()*6.283]);}
 const matrix=new THREE.Matrix4(),v=new THREE.Vector3(),scale=new THREE.Vector3(),q=new THREE.Quaternion(),euler=new THREE.Euler();
 function batch(items,geo,color,bones){const mesh=new THREE.InstancedMesh(geo,material(color),items.length);items.forEach(([x,y,z,w,h,d,yaw],i)=>{v.set(x,y,z);scale.set(w,h,d);euler.set(bones?.21:0,yaw,bones?.16:0);q.setFromEuler(euler);matrix.compose(v,q,scale);mesh.setMatrixAt(i,matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);}
 batch(rubble,new THREE.DodecahedronGeometry(1,0),P.slate,false);batch(spikes,new THREE.ConeGeometry(1,1,7),P.aged,true);
 const edge=new THREE.RingGeometry(A.radius-.045,A.radius+.025,96);edge.rotateX(-Math.PI/2);const border=new THREE.Mesh(edge,new THREE.MeshBasicMaterial({color:'#8d9692',transparent:true,opacity:.32,depthWrite:false,side:THREE.DoubleSide}));border.position.y=.006;group.add(border);
 // Quiet drifting ash, outside the active attack field.
 const pos=new Float32Array(A.dust*3),seeds=[];for(let i=0;i<A.dust;i++)seeds.push([r()*6.283,16+r()*15,.25+r()*3.5,r()*6.283]);
 const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(pos,3).setUsage(THREE.DynamicDrawUsage));const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:P.ash,size:.085,transparent:true,opacity:.24,depthWrite:false}));dust.frustumCulled=false;group.add(dust);
 function updateAtmosphere(t){for(let i=0;i<seeds.length;i++){const [a,rad,y,phase]=seeds[i],j=i*3;pos[j]=Math.cos(a+t*.013)*rad;pos[j+1]=y+.22*Math.sin(t*.5+phase);pos[j+2]=Math.sin(a+t*.013)*rad;}dg.attributes.position.needsUpdate=true;}
 updateAtmosphere(0);return {group,guides,failures,updateAtmosphere};
}
