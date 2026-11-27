import {KABUTO_OUTPOST as A} from './kabuto-outpost-data.js';
import {medicalFloorArt,lampPoolArt} from './kabuto-outpost-art.js';
export async function createKabutoOutpost({THREE,scene}){
 const group=new THREE.Group();group.name='kabuto-medical-outpost';scene.add(group);const P=A.palette,failures=[],batches=new Map(),lights=[];
 let floorMap=null,poolMap=null;
 for(const [name,paint] of [['floor',medicalFloorArt],['lamplight',lampPoolArt]])try{const tex=new THREE.CanvasTexture(paint());tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;if(name==='floor')floorMap=tex;else poolMap=tex;}catch{failures.push(name);}
 function box(x,y,z,w,h,d,color,tag='architecture'){const key=color+'|'+tag;if(!batches.has(key))batches.set(key,[]);batches.get(key).push({x,y,z,w,h,d,color,tag});}
 function plane(x,y,z,w,d,color,map=null){const geom=new THREE.PlaneGeometry(w,d);geom.rotateX(-Math.PI/2);const m=new THREE.Mesh(geom,new THREE.MeshStandardMaterial({color,map,roughness:.95}));m.position.set(x,y,z);group.add(m);return m;}
 plane(0,-.48,0,84,84,'#253a36');box(0,-.26,0,34,.50,34,P.base,'foundation');plane(0,.006,0,A.floor.width,A.floor.length,floorMap?'#dedfd1':P.floor,floorMap);
 // Broken perimeter masonry, open south entrance, low walls for clear top-down view.
 for(const x of [-16.7,16.7]){
  box(x,.30,0,.65,.60,34,P.base);
  for(let z=-15;z<=15;z+=3){const h=z===0?1.05:1.48+(Math.abs(z)%4)*.10;box(x,h/2+.15,z,.65,h,2.88,P.wall);box(x,h+.20,z,.80,.13,2.94,P.trim);}
 }
 for(let x=-15;x<=15;x+=3){const z=-16.7,h=2.6+(Math.abs(x)%4)*.10;box(x,h/2,z,2.88,h,.64,P.wall);box(x,h+.06,z,2.96,.14,.80,P.trim);box(x,.35,z+ .05,2.92,.42,.74,P.base);}
 for(const x of [-14,-10,-6,6,10,14]){box(x,.44,16.7,3.7,.88,.66,P.wall);box(x,.94,16.7,3.80,.12,.83,P.trim);}
 // Pillars and exposed steel framing, all outside the combat radius.
 for(const x of [-16,16])for(const z of [-16,-8,8,16]){box(x,1.15,z,.76,2.3,.76,P.base);box(x,2.34,z,1,.18,1,P.trim);}
 for(const x of [-9,0,9]){box(x,1.65,-16.27,1.65,1.02,.09,P.base);box(x,1.67,-16.20,1.48,.84,.06,P.glass);box(x,1.67,-16.14,.08,.86,.07,P.trim);box(x,1.67,-16.14,1.50,.08,.07,P.trim);}
 // Medical examination tables, folded fabric, trays, small tools.
 for(const {x,z} of A.tables){for(const dx of [-.52,.52])for(const dz of [-1.04,1.04])box(x+dx,.44,z+dz,.13,.88,.13,P.iron,'prop');
  box(x,.90,z,1.38,.18,2.68,P.iron,'prop');box(x,1.04,z,1.24,.14,2.42,P.linen,'prop');box(x,1.13,z-.78,1.13,.15,.66,P.paper,'prop');
  box(x,1.14,z+.74,.74,.055,.62,P.base,'prop');for(let i=0;i<3;i++)box(x-.22+i*.22,1.19,z+.74,.08,.045,.42,P.trim,'prop');}
 // Shelves with medicinal glass bottles and scrolls.
 for(const {x,z} of A.cabinets){box(x,.94,z,1.32,1.88,.96,P.wood,'prop');box(x,1.94,z,1.43,.12,1.08,P.trim,'prop');box(x,.96,z+.51,1.22,.10,.10,P.iron,'prop');box(x,.48,z+.51,.10,.34,.10,P.iron,'prop');box(x,.49,z+.51,1.22,.035,.06,P.base,'prop');for(let i=0;i<4;i++){box(x-.45+i*.30,2.12,z,.18,.25+(i%2)*.11,.18,i%2?P.glass:P.medicine,'prop');box(x-.45+i*.30,2.29+(i%2)*.055,z,.12,.06,.12,P.wood,'prop');}}
 for(const {x,z} of A.screens){for(const dx of [-1.08,0,1.08])box(x+dx,1.17,z,.09,2.34,.12,P.wood,'prop');for(const dx of [-.54,.54]){box(x+dx,1.23,z,1.02,1.70,.08,P.paper,'prop');box(x+dx,.38,z,1.10,.13,.12,P.wood,'prop');box(x+dx,2.13,z,1.10,.12,.12,P.wood,'prop');for(const dz of [-.18,.18])box(x+dx,.055,z+dz,1.12,.11,.16,P.base,'prop');}}
 for(const {x,z} of A.crates){box(x,.33,z,1.25,.66,1.05,P.wood,'prop');box(x,.70,z,1.30,.12,1.10,P.trim,'prop');for(const dx of [-.46,.46])box(x+dx,.37,z,.13,.74,1.12,P.base,'prop');for(let i=0;i<3;i++)box(x-.31+i*.30,.85,z,.22,.18,.62,P.paper,'prop');}
 // Wall light fixtures with optional soft painted light pools (no expensive dynamic lights).
 for(const {x,z} of A.lights){box(x,1.89,z,.42,.46,.40,P.base,'fixture');box(x,1.90,z,.29,.32,.30,P.lamp,'fixture');box(x,2.17,z,.48,.12,.46,P.iron,'fixture');
  if(poolMap){const g=new THREE.PlaneGeometry(7.4,7.4);g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:poolMap,transparent:true,depthWrite:false,opacity:.48,fog:false}));m.position.set(x*.86,.025,z*.86);m.renderOrder=1;group.add(m);lights.push(m);}}
 const matrix=new THREE.Matrix4(),v=new THREE.Vector3(),scale=new THREE.Vector3(),rot=new THREE.Quaternion();let count=0;
 for(const boxes of batches.values()){const {color,tag}=boxes[0],mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color,roughness:.94}),boxes.length);mesh.name=tag;boxes.forEach((b,i)=>{v.set(b.x,b.y,b.z);scale.set(b.w,b.h,b.d);matrix.compose(v,rot,scale);mesh.setMatrixAt(i,matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);count+=boxes.length;}
 const guides=new THREE.Group();scene.add(guides);const geom=new THREE.RingGeometry(A.radius-.055,A.radius+.055,96);geom.rotateX(-Math.PI/2);const ring=new THREE.Mesh(geom,new THREE.MeshBasicMaterial({color:'#f0d29b',transparent:true,opacity:.85,depthWrite:false,side:THREE.DoubleSide}));ring.position.set(0,.06,0);ring.renderOrder=3;guides.add(ring);guides.visible=false;
 return {group,guides,failures,instanceCount:count,updateAtmosphere(t){for(const [i,m] of lights.entries())m.material.opacity=.46+.025*Math.sin(t*.8+i*1.9);}};
}
