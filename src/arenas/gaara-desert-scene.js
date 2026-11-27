import {GAARA_DESERT as A,seeded} from './gaara-desert-data.js';
export function desertFloorArt(){
 const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const r=seeded(624),w=1024;
 g.fillStyle='#d1a477';g.fillRect(0,0,w,w);
 for(let i=0;i<140;i++){const x=r()*w,y=r()*w,s=35+r()*190,grad=g.createRadialGradient(x,y,0,x,y,s);grad.addColorStop(0,i%2?'rgba(245,211,157,.16)':'rgba(139,83,43,.12)');grad.addColorStop(1,'rgba(190,141,87,0)');g.fillStyle=grad;g.fillRect(x-s,y-s,s*2,s*2);}
 for(let i=0;i<1100;i++){const x=r()*w,y=r()*w,len=9+r()*65;g.strokeStyle=i%3?'rgba(117,73,43,.11)':'rgba(255,225,174,.19)';g.lineWidth=.65+r()*1.3;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+len*.45,y-4-r()*5,x+len,y+2);g.stroke();}
 for(let i=0;i<18000;i++){g.fillStyle=i%2?'rgba(255,224,180,.15)':'rgba(102,61,34,.11)';g.fillRect(r()*w,r()*w,1+r()*2,1+r()*2);}
 for(let i=0;i<100;i++){const a=r()*Math.PI*2,rad=195+r()*85,x=w/2+Math.cos(a)*rad,y=w/2+Math.sin(a)*rad;g.save();g.translate(x,y);g.rotate(a+.1);const l=9+r()*24,d=5+r()*13;g.fillStyle='rgba(151,110,71,.37)';g.fillRect(-l/2,-d/2,l,d);g.strokeStyle='rgba(240,200,144,.37)';g.strokeRect(-l/2,-d/2,l,d);g.restore();}
 return c;
}
export async function createGaaraDesert({THREE,scene}){
 const group=new THREE.Group(),guides=new THREE.Group();group.name=A.id;scene.add(group,guides);guides.visible=false;
 const P=A.palette,r=seeded(),failures=[],batches=new Map();let tex=null;
 try{tex=new THREE.CanvasTexture(desertFloorArt());tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;}catch{failures.push('sand texture');}
 const groundGeo=new THREE.PlaneGeometry(A.floor,A.floor);groundGeo.rotateX(-Math.PI/2);const ground=new THREE.Mesh(groundGeo,new THREE.MeshStandardMaterial({color:tex?'#ffffff':P.sand,map:tex,roughness:1}));ground.position.y=-.025;group.add(ground);
 const box=(x,y,z,w,h,d,color,yaw=0)=>{if(!batches.has(color))batches.set(color,[]);batches.get(color).push({x,y,z,w,h,d,yaw});};
 for(const [x0,z0,len,h,yaw] of A.walls){const cs=Math.cos(yaw),sn=Math.sin(yaw),n=Math.floor(len/1.45);for(let i=0;i<n;i++){const off=(i-(n-1)/2)*1.5,x=x0+off*cs,z=z0-off*sn,courses=Math.max(1,Math.floor(h/.58)-(r()<.36?2:0));for(let j=0;j<courses;j++)box(x+(j%2?.12:-.08)*cs,.3+j*.57,z,1.43,.55,.84,[P.stone,P.trim,P.shade][Math.floor(r()*3)],yaw);if(courses>3)box(x,courses*.57+.09,z,1.48,.18,1.03,P.dark,yaw);}}
 for(const [x,z,h] of A.pillars){box(x,.2,z,1.95,.4,1.95,P.dark);box(x,.52,z,1.64,.24,1.64,P.trim);let y=.65;while(y+.5<h){box(x,y+.25,z,1.12,.49,1.12,r()>.35?P.stone:P.shade);y+=.5;}box(x,y+.13,z,1.5,.26,1.5,P.trim);if(h>4)box(x,y+.36,z,1.79,.2,1.79,P.dark);}
 box(0,5.38,-17,11.6,.65,1.6,P.stone);box(0,5.81,-17,12,.2,1.85,P.trim);
 for(let i=-4;i<=4;i++)box(i*1.12,5.38,-16.12,.19,.34,.05,P.dark);
 for(const x of [-5,5]){box(x+.65,3.45,-16,.12,2.75,.12,P.dark);box(x+.65,4.66,-15.98,1.38,.09,.1,P.dark);box(x+.65,3.95,-15.92,1.05,1.28,.045,P.cloth);box(x+.65,3.42,-15.89,1.02,.08,.055,P.trim);}
 for(let i=0;i<80;i++){const a=r()*Math.PI*2,rad=14.65+r()*8,x=Math.cos(a)*rad,z=Math.sin(a)*rad,w=.22+r()*.88,h=.1+r()*.42;box(x,h/2,z,w,h,.25+r()*.8,i%3?P.stone:P.dark,r()*Math.PI);}
 for(let i=0;i<3;i++)box(0,.1+i*.15,-14.7-i*.65,6.6,.2+i*.3,.68,P.stone);
 const matrix=new THREE.Matrix4(),v=new THREE.Vector3(),scale=new THREE.Vector3(),quat=new THREE.Quaternion(),axis=new THREE.Vector3(0,1,0);let instances=0;
 for(const [color,items] of batches){const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color,roughness:1}),items.length);items.forEach((b,i)=>{v.set(b.x,b.y,b.z);scale.set(b.w,b.h,b.d);quat.setFromAxisAngle(axis,b.yaw);matrix.compose(v,quat,scale);mesh.setMatrixAt(i,matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);instances+=items.length;}
 for(const [x,z,rad,h] of A.dunes){const geom=new THREE.SphereGeometry(1,32,12,0,Math.PI*2,0,Math.PI/2);const mesh=new THREE.Mesh(geom,new THREE.MeshStandardMaterial({color:P.shade,roughness:1}));mesh.scale.set(rad,h,rad*.7);mesh.rotation.y=r()*Math.PI;mesh.position.set(x,-.12,z);group.add(mesh);}
 const ringGeo=new THREE.RingGeometry(A.radius-.06,A.radius+.025,96);ringGeo.rotateX(-Math.PI/2);const ring=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:'#a97647',transparent:true,opacity:.48,depthWrite:false,side:THREE.DoubleSide}));ring.position.y=.009;group.add(ring);
 const positions=new Float32Array(A.dust*3),base=[];for(let i=0;i<A.dust;i++)base.push({x:r()*48-24,y:.12+r()*3.4,z:r()*48-24,phase:r()*6.28,speed:.6+r()*1.2});
 const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:'#ffe0a6',size:.105,transparent:true,opacity:.24,depthWrite:false,sizeAttenuation:true}));dust.frustumCulled=false;group.add(dust);
 function updateAtmosphere(t){for(let i=0;i<base.length;i++){const p=base[i],j=i*3;positions[j]=((p.x+24+t*1.25*p.speed)%48+48)%48-24;positions[j+1]=p.y+.13*Math.sin(t*.8+p.phase);positions[j+2]=p.z+.35*Math.sin(t*.45+p.phase);}dg.attributes.position.needsUpdate=true;}
 updateAtmosphere(0);return {group,guides,failures,instanceCount:instances,updateAtmosphere};
}