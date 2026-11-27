import {ORO_LAB as A,seededLab} from './orochimaru-lab-data.js';
export function labFloorArt(){
 const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');
 const r=seededLab(),w=c.width,s=w/19;g.fillStyle='#3d3945';g.fillRect(0,0,w,w);
 for(let row=0;row<19;row++)for(let col=0;col<20;col++){
  const x=(col-(row%2)*.5)*s,y=row*s,n=77+Math.floor(r()*15);
  g.fillStyle='rgb('+n+','+(n-4)+','+(n+7)+')';g.fillRect(x+2,y+2,s-4,s-4);
  g.strokeStyle='rgba(176,160,182,.21)';g.beginPath();g.moveTo(x+3,y+s-3);g.lineTo(x+3,y+3);g.lineTo(x+s-3,y+3);g.stroke();
  if(r()<.32){g.strokeStyle='rgba(28,24,32,.38)';g.beginPath();g.moveTo(x+s*.15,y+s*.1);g.lineTo(x+s*.45,y+s*.49);g.lineTo(x+s*.29,y+s*.87);g.stroke();}
 }
 for(let i=0;i<15000;i++){g.fillStyle=i%2?'rgba(215,205,220,.06)':'rgba(15,12,22,.13)';g.fillRect(r()*w,r()*w,1+r()*2,1+r()*2);}
 // Old circular seal, deliberately subdued so enemy telegraphs dominate.
 g.save();g.translate(w/2,w/2);g.strokeStyle='rgba(151,130,163,.24)';g.lineWidth=2.2;for(const rad of [88,103,334,343]){g.beginPath();g.arc(0,0,rad,0,Math.PI*2);g.stroke();}
 for(let i=0;i<24;i++){const a=i*Math.PI/12;g.save();g.rotate(a);g.beginPath();g.moveTo(0,-108);g.lineTo(7,-119);g.lineTo(0,-126);g.lineTo(-7,-119);g.closePath();g.stroke();g.restore();}g.restore();return c;
}
export function lampPoolArt(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const d=g.createRadialGradient(64,64,0,64,64,64);d.addColorStop(0,'rgba(255,231,181,.45)');d.addColorStop(.42,'rgba(242,191,123,.20)');d.addColorStop(1,'rgba(242,191,123,0)');g.fillStyle=d;g.fillRect(0,0,128,128);return c;}
export async function createOrochimaruLab({THREE,scene}){
 const group=new THREE.Group(),guides=new THREE.Group();group.name=A.id;guides.visible=false;scene.add(group,guides);
 const P=A.palette,r=seededLab(812),failures=[],batches=new Map(),tanks=[],pools=[];
 let floorMap=null,poolMap=null;for(const [key,paint] of [['floor',labFloorArt],['lamp glow',lampPoolArt]])try{const t=new THREE.CanvasTexture(paint());t.colorSpace=THREE.SRGBColorSpace;if(key==='floor'){t.anisotropy=4;floorMap=t;}else poolMap=t;}catch{failures.push(key);}
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.89,...extra});
 function plane(x,y,z,w,d,color,map=null){const geo=new THREE.PlaneGeometry(w,d);geo.rotateX(-Math.PI/2);const m=new THREE.Mesh(geo,mat(color,{map}));m.position.set(x,y,z);group.add(m);return m;}
 function box(x,y,z,w,h,d,color){if(!batches.has(color))batches.set(color,[]);batches.get(color).push([x,y,z,w,h,d]);}
 function cylinder(x,y,z,rt,rb,h,color,extra={}){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,20),mat(color,extra));m.position.set(x,y,z);group.add(m);return m;}
 plane(0,-.37,0,100,100,'#24212c');box(0,-.2,0,38,.32,38,P.iron);plane(0,.004,0,A.floor,A.floor,floorMap?'#ffffff':P.floor,floorMap);
 // Perimeter stone courses. Front wall intentionally kept low for the camera.
 for(const x of [-18.6,18.6])for(let i=0;i<12;i++){const z=-16.5+i*3;for(let j=0;j<3;j++)box(x,.32+j*.64,z,.85,.61,2.96,j%2?P.stone:P.iron);box(x,1.99,z,1.04,.16,2.98,P.trim);}
 for(let x=-16.5;x<=16.5;x+=3){if(Math.abs(x)<4)continue;for(let j=0;j<5;j++)box(x,.32+j*.64,-18.6,2.96,.61,.88,j%2?P.iron:P.stone);box(x,3.28,-18.6,2.98,.18,1.04,P.trim);}
 for(const x of [-15,-9,9,15])box(x,.28,18.6,5.8,.56,.9,P.stone);
 // Heavy sealed gateway, with snake-eye metal details.
 for(const x of [-3.6,3.6]){box(x,2.35,-18,1.1,4.7,1.2,P.stone);box(x,4.62,-18,1.5,.25,1.5,P.trim);}
 box(0,4.7,-18,8.8,.65,1.4,P.stone);box(0,5.12,-18,9,.2,1.6,P.trim);box(0,2,-18.25,5.9,4,.4,P.iron);
 for(let i=-2;i<=2;i++)box(i*1.12,2,-17.98,.06,3.8,.07,P.brass);for(const x of [-.85,.85]){box(x,2.35,-17.91,.48,.14,.08,P.violet);box(x,2.35,-17.85,.06,.18,.06,P.iron);}
 for(const [x,z] of A.pillars){box(x,.21,z,1.7,.42,1.7,P.iron);for(let i=0;i<5;i++)box(x,.73+i*.65,z,1.08,.63,1.08,i%2?P.stone:P.iron);box(x,3.82,z,1.44,.23,1.44,P.trim);}
 // Containment tubes, translucent glass, liquid core, steel hoops and pipework.
 for(const [x,z] of A.tanks){
  cylinder(x,.24,z,1.24,1.35,.48,P.iron);cylinder(x,.57,z,1.17,1.17,.18,P.brass);
  cylinder(x,2.03,z,1.02,1.02,2.75,P.fluid,{emissive:P.glass,emissiveIntensity:.21});
  const core=cylinder(x,2.04,z,.32,.40,1.68,'#b8c3a2',{emissive:'#576c54',emissiveIntensity:.1});core.rotation.z=.13;
  const glass=cylinder(x,2.03,z,1.14,1.14,2.9,P.glass,{transparent:true,opacity:.23,depthWrite:false,roughness:.22,side:THREE.DoubleSide});
  glass.renderOrder=-8;cylinder(x,3.52,z,1.23,1.23,.22,P.iron);cylinder(x,3.7,z,.89,1.15,.17,P.brass);
  for(const dx of [-.92,.92])box(x+dx,2.04,z,.10,2.8,.12,P.brass);
  for(const y of [1.24,2.85])cylinder(x,y,z,1.16,1.16,.09,P.iron);
  box(x,4.02,z,.22,.48,.22,P.brass);box(x,4.28,z-.85,.22,.22,1.85,P.iron);
  tanks.push({core,glass,y:core.position.y});
 }
 // Alchemy benches: flasks, scrolls, tools, shelving.
 for(const [x,z] of A.shelves){
  box(x,1.4,z,.8,2.8,3.2,P.wood);for(const y of [.52,1.35,2.22]){box(x+(x<0?.48:-.48),y,z,1.02,.11,3.15,P.trim);for(let i=0;i<5;i++){const zz=z-1.1+i*.49;const height=.22+r()*.25;cylinder(x+(x<0?.6:-.6),y+.08+height/2,zz,.13,.16,height,i%2?P.violet:P.fluid);cylinder(x+(x<0?.6:-.6),y+.1+height,zz,.095,.095,.1,P.brass);}}
 }
 for(const [x,z] of A.tables){for(const dx of [-.55,.55])for(const dz of [-1,1])box(x+dx,.48,z+dz,.16,.96,.16,P.iron);box(x,1,z,1.55,.18,2.7,P.wood);box(x,1.12,z-.6,.85,.06,.75,P.paper);for(let i=0;i<3;i++)box(x-.3+i*.3,1.18,z-.6,.07,.07,.45,P.iron);for(let i=0;i<3;i++)cylinder(x-.43+i*.4,1.31,z+.65,.10,.16,.32,i%2?P.violet:P.fluid);}
 for(const [x,z] of A.lamps){box(x,2.12,z,.30,.5,.30,P.iron);box(x,2.13,z,.23,.33,.24,P.wax);box(x,2.43,z,.43,.10,.43,P.brass);if(poolMap){const geo=new THREE.PlaneGeometry(8,8);geo.rotateX(-Math.PI/2);const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:poolMap,transparent:true,opacity:.63,depthWrite:false,fog:false}));m.position.set(x*.88,.019,z*.88);m.renderOrder=1;group.add(m);pools.push(m);}}
 const matrix=new THREE.Matrix4(),v=new THREE.Vector3(),scale=new THREE.Vector3(),quat=new THREE.Quaternion();let count=0;
 for(const [color,items] of batches){const m=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),mat(color),items.length);items.forEach(([x,y,z,w,h,d],i)=>{v.set(x,y,z);scale.set(w,h,d);matrix.compose(v,quat,scale);m.setMatrixAt(i,matrix);});m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();group.add(m);count+=items.length;}
 // Quiet perimeter motes (not attack or poison indicators).
 const pos=new Float32Array(A.motes*3),seeds=[];for(let i=0;i<A.motes;i++)seeds.push([r()*Math.PI*2,14+r()*5,.3+r()*3,r()*6.28]);
 const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.BufferAttribute(pos,3).setUsage(THREE.DynamicDrawUsage));const dust=new THREE.Points(geom,new THREE.PointsMaterial({color:'#c9b5db',size:.09,transparent:true,opacity:.21,depthWrite:false}));dust.frustumCulled=false;group.add(dust);
 function updateAtmosphere(t){for(let i=0;i<seeds.length;i++){const [a,rr,y,phase]=seeds[i],k=i*3;pos[k]=Math.cos(a+t*.018)*rr;pos[k+1]=y+.25*Math.sin(t*.65+phase);pos[k+2]=Math.sin(a+t*.018)*rr;}geom.attributes.position.needsUpdate=true;for(const [i,m] of pools.entries())m.material.opacity=.62+.04*Math.sin(t*.85+i);for(const [i,o] of tanks.entries())o.core.position.y=o.y+.09*Math.sin(t*.7+i);}
 updateAtmosphere(0);return {group,guides,failures,instanceCount:count,updateAtmosphere};
}
