import {TOAD_GROUNDS as A,rng,clearDecor} from './jiraiya-grounds-data.js?v=6h1';
export function groundArt(){
 const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const r=rng(611),w=1024;
 g.fillStyle='#7d8d69';g.fillRect(0,0,w,w);const center=w/2,rad=15/82*w;
 const grad=g.createRadialGradient(center,center,rad*.65,center,center,rad*1.22);grad.addColorStop(0,'#b0ad86');grad.addColorStop(.69,'#a6a37e');grad.addColorStop(1,'rgba(163,161,126,0)');g.fillStyle=grad;g.fillRect(0,0,w,w);
 for(let i=0;i<18000;i++){const x=r()*w,y=r()*w,inside=Math.hypot(x-center,y-center)<rad;g.fillStyle=i%2?'rgba(226,222,174,.12)':'rgba(41,68,47,.14)';g.fillRect(x,y,.6+r()*2,inside?1+r()*2:2+r()*4);}
 for(let i=0;i<110;i++){let x=r()*w,y=r()*w;if(Math.hypot(x-center,y-center)>rad*.95)continue;g.beginPath();g.moveTo(x,y);g.lineTo(x+4+r()*14,y+(r()-.5)*7);g.strokeStyle='rgba(72,70,53,.15)';g.lineWidth=.7;g.stroke();}
 return c;
}
export async function createToadGrounds({THREE,scene}){
 const group=new THREE.Group(),guides=new THREE.Group(),P=A.palette,r=rng(),failures=[];group.name=A.id;guides.visible=false;scene.add(group,guides);
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.92,...extra});
 const mats={stone:mat(P.stone),dark:mat(P.dark),moss:mat(P.moss),wood:mat(P.wood),trim:mat(P.trim),leaf:mat(P.leaves),flower:mat(P.flower),water:mat(P.water,{roughness:.35}),bark:mat('#685f46'),canopy:mat('#648653')};
 const box=new THREE.BoxGeometry(1,1,1),sphere=new THREE.SphereGeometry(1,14,10),rock=new THREE.DodecahedronGeometry(1,0),cyl=new THREE.CylinderGeometry(.78,1,1,9);
 function piece(parent,geo,m,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);parent.add(o);return o;}
 let map=null;try{map=new THREE.CanvasTexture(groundArt());map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;}catch{failures.push('ground texture');}
 const ground=new THREE.PlaneGeometry(A.floor,A.floor);ground.rotateX(-Math.PI/2);piece(group,ground,mat(map?'#ffffff':P.grass,{map}),0,-.025,0,1,1,1);
 const ring=new THREE.RingGeometry(A.radius-.04,A.radius+.03,96);ring.rotateX(-Math.PI/2);piece(group,ring,new THREE.MeshBasicMaterial({color:'#c0b687',transparent:true,opacity:.32,depthWrite:false,side:THREE.DoubleSide}),0,.006,0,1,1,1);
 // Quiet ponds, each outside the movement circle. Lily pads have a recognizable notched outline.
 const padShape=new THREE.Shape();padShape.moveTo(0,0);for(let i=0;i<=22;i++){const a=.23+i*(Math.PI*2-.46)/22;padShape.lineTo(Math.cos(a),Math.sin(a));}padShape.closePath();
 const padGeo=new THREE.ShapeGeometry(padShape);padGeo.rotateX(-Math.PI/2);const disc=new THREE.CircleGeometry(1,48);disc.rotateX(-Math.PI/2);
 const rippleGeo=new THREE.RingGeometry(.94,1,40);rippleGeo.rotateX(-Math.PI/2);const rippleMat=new THREE.MeshBasicMaterial({color:'#b9ded3',transparent:true,opacity:.27,depthWrite:false,side:THREE.DoubleSide});const ripples=[],pads=[];
 for(const [x,z,rx,rz] of A.ponds){if(!clearDecor(x,z,Math.max(rx,rz)+.15))continue;
  piece(group,disc,mats.dark,x,.008,z,rx+.12,1,rz+.12);piece(group,disc,mats.water,x,.016,z,rx,1,rz);
  for(let i=0;i<13;i++){const a=r()*Math.PI*2,d=.74*Math.sqrt(r()),px=x+Math.cos(a)*rx*d,pz=z+Math.sin(a)*rz*d,size=.24+r()*.34;const pad=piece(group,padGeo,mats.leaf,px,.035,pz,size,1,size,0,r()*6.28);pads.push({o:pad,y:.035,phase:r()*6.28});if(i%4===0){piece(group,sphere,mats.flower,px,.10,pz,.13,.08,.13);for(let j=0;j<5;j++){const v=j*1.256;piece(group,sphere,mats.flower,px+Math.cos(v)*.12,.10,pz+Math.sin(v)*.12,.10,.045,.10);}}}
  for(let i=0;i<3;i++){const o=piece(group,rippleGeo,rippleMat,x+(r()-.5)*rx,.028,z+(r()-.5)*rz,1,1,.85);ripples.push({o,phase:r()*6.28,size:.5+r()*.7});}
 }
 // Stone toad guardians: seated silhouette with broad head, raised eyes, wide mouth, curled legs.
 for(const [x,z,yaw] of A.guardians){if(!clearDecor(x,z,3.9))continue;const root=new THREE.Group();root.position.set(x,0,z);root.rotation.y=yaw;group.add(root);
  const E=(m,x,y,z,sx,sy,sz)=>piece(root,sphere,m,x,y,z,sx,sy,sz);
  piece(root,rock,mats.dark,0,.38,0,3.15,.52,2.55);E(mats.stone,0,1.55,0,1.98,1.34,1.54);E(mats.stone,0,2.75,.38,2.10,1.0,1.38);E(mats.moss,0,2.44,1.2,1.70,.46,.69);
  for(const side of [-1,1]){E(mats.stone,side*1.12,3.48,.48,.65,.64,.62);E(mats.dark,side*1.12,3.47,1.0,.39,.27,.13);E(mats.stone,side*1.95,1.25,-.1,1.02,.78,1.35);E(mats.dark,side*1.8,.68,.93,.88,.28,1.04);E(mats.stone,side*.85,1.12,1.27,.44,.89,.46);for(let j=0;j<3;j++)E(mats.stone,side*.85+(j-1)*.26,.48,1.68,.20,.15,.43);}
  piece(root,box,mats.dark,0,2.35,1.76,2.5,.09,.10);for(const side of [-1,1])E(mats.dark,side*.3,2.84,1.62,.12,.09,.09);
 }
 // Vermilion torii gate, stone lanterns, quiet forest framing.
 {const [x,z]=A.gate;const root=new THREE.Group();root.position.set(x,0,z);group.add(root);for(const side of [-1,1]){piece(root,cyl,mats.dark,side*2.85,.35,0,.62,.70,.62);piece(root,cyl,mats.wood,side*2.85,2.75,0,.43,4.8,.43);piece(root,box,mats.trim,side*2.85,4.7,0,.98,.17,.96);}piece(root,box,mats.wood,0,4.35,0,7.4,.37,.48);piece(root,box,mats.wood,0,5.18,0,8.5,.50,.74);piece(root,box,mats.dark,0,5.51,0,9,.22,.96);for(const side of [-1,1])piece(root,box,mats.dark,side*4.13,5.64,0,1.15,.26,.99,0,0,side*.18);piece(root,box,mats.trim,0,4.76,.28,.85,1.05,.15);}
 for(const [x,z] of A.lanterns){if(!clearDecor(x,z,1.1))continue;piece(group,rock,mats.dark,x,.2,z,.87,.32,.87);piece(group,cyl,mats.stone,x,.94,z,.40,1.28,.40);piece(group,box,mats.stone,x,1.62,z,.86,.18,.86);piece(group,box,mats.trim,x,1.92,z,.55,.45,.55);for(const dx of [-.35,.35])for(const dz of [-.35,.35])piece(group,box,mats.dark,x+dx,1.91,z+dz,.11,.55,.11);piece(group,rock,mats.moss,x,2.32,z,.89,.38,.89);}
 for(const [x,z] of A.trees){if(!clearDecor(x,z,3.6))continue;const h=4+r()*3;piece(group,cyl,mats.bark,x,h*.42,z,.42,h*.84,.42);for(let i=0;i<3;i++)piece(group,rock,mats.canopy,x+(r()-.5)*1.9,h*.79+i*.73,z+(r()-.5)*1.4,2.5-i*.25,1.65,2.4-i*.24,0,r()*6.28);}
 // One batched mesh for peripheral stones.
 const stones=[];for(let i=0;i<95;i++){const a=r()*6.28,d=16.5+r()*13,x=Math.cos(a)*d,z=Math.sin(a)*d,w=.16+r()*.65;if(clearDecor(x,z,1))stones.push([x,w*.2,z,w,.5*w,w*.8,r()*6.28]);}
 const batch=new THREE.InstancedMesh(rock,mats.stone,stones.length),matrix=new THREE.Matrix4(),v=new THREE.Vector3(),scale=new THREE.Vector3(),q=new THREE.Quaternion(),e=new THREE.Euler();stones.forEach(([x,y,z,sx,sy,sz,yaw],i)=>{v.set(x,y,z);scale.set(sx,sy,sz);e.set(0,yaw,0);q.setFromEuler(e);matrix.compose(v,q,scale);batch.setMatrixAt(i,matrix);});batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();group.add(batch);
 const pos=new Float32Array(A.motes*3),seeds=[];for(let i=0;i<A.motes;i++)seeds.push([r()*6.28,16.5+r()*11,.45+r()*3,r()*6.28]);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3).setUsage(THREE.DynamicDrawUsage));const dust=new THREE.Points(geo,new THREE.PointsMaterial({color:'#ece3ad',size:.09,transparent:true,opacity:.35,depthWrite:false}));dust.frustumCulled=false;group.add(dust);
 function updateAtmosphere(t){for(const a of ripples){const s=a.size*(1+.22*Math.sin(t*1.7+a.phase));a.o.scale.set(s,1,s*.85);}for(const a of pads)a.o.position.y=a.y+.008*Math.sin(t*1.3+a.phase);for(let i=0;i<seeds.length;i++){const [a,d,y,p]=seeds[i],j=i*3;pos[j]=Math.cos(a+t*.018)*d;pos[j+1]=y+.35*Math.sin(t*.7+p);pos[j+2]=Math.sin(a+t*.018)*d;}geo.attributes.position.needsUpdate=true;}
 updateAtmosphere(0);return {group,guides,failures,updateAtmosphere};
}
