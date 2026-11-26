// New scene candidate, no modifications to campaign scene or combat modules.
import {MIST_BRIDGE,mirrorPoints} from './mist-bridge-data.js';
export async function createMistBridge({THREE,scene,assetURL}){
 const A=MIST_BRIDGE,loader=new THREE.TextureLoader(),failures=[],maps={};
 await Promise.all(Object.entries(A.assets).map(async([key,name])=>{try{const map=await loader.loadAsync(assetURL(name));map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=4;maps[key]=map;}catch{failures.push(name);}}));
 const group=new THREE.Group();group.name='mist-bridge-review';scene.add(group);
 const materials=new Map(),mat=(color)=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.94}));return materials.get(color)};
 function box(x,y,z,w,h,d,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.position.set(x,y,z);group.add(m);return m;}
 function plane(x,y,z,w,d,key,color,repeat){const g=new THREE.PlaneGeometry(w,d);g.rotateX(-Math.PI/2);const map=maps[key]?.clone();if(map){map.repeat.set(w/repeat,d/repeat);map.needsUpdate=true;}const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color,map:map||null,roughness:.96}));m.position.set(x,y,z);group.add(m);return m;}
 // Broad sea, stone deck and structural girders. Decorative geometry is outside combat radius.
 plane(0,A.water.level,0,A.water.width,A.water.length,'water','#729ba5',15);
 for(const z of [-43,43]){box(0,-1.6,z,105,2,18,'#566e6d');plane(0,-.58,z,105,18,'bank','#80948b',9);}
 box(0,-.65,0,A.deck.width,1.2,A.deck.length,'#687779');plane(0,.006,0,A.deck.width,A.deck.length,'deck','#b1b7ad',6);
 for(const x of [-14.65,14.65]){
  box(x,.15,0,.7,.3,68,'#a5b0ac');box(x,1.15,0,.48,.22,68,'#a3b1b0');
  box(x,.55,0,.28,.15,68,'#627c80');
  for(let z=-32;z<=32;z+=4){box(x,.62,z,.64,1.24,.65,'#87989a');box(x,1.29,z,.82,.15,.82,'#bcc6bd');}
  box(x,-1.48,0,1.25,.5,68,'#53676c');
 }
 for(const z of [-27,-9,9,27])for(const x of [-11.5,11.5]){box(x,-1.7,z,2.25,3.5,2.5,'#5d7176');box(x,-.9,z,3.1,.55,3.2,'#849492');}
 // Expansion joints, edge markings and distant construction pylons.
 for(let z=-30;z<=30;z+=6)box(0,.013,z,28.6,.022,.08,'#869396');
 for(const x of [-13.6,13.6])box(x,.016,0,.09,.025,66,'#c5c9bd');
 for(const z of [-29,29])for(const x of [-12.8,12.8]){box(x,1.65,z,1.1,3.3,1.1,'#76898b');box(x,3.45,z,1.5,.3,1.5,'#b6c2bb');}
 // Distant rocks and restrained water highlights, kept away from the bridge.
 for(let i=0;i<32;i++){const sign=i%2?1:-1,x=sign*(19+(i*13)%34),z=-47+(i*17)%94;box(x,-2.65,z,1.5+(i%5)*.6,.035,.11,'#a6c6c8');}
 const guides=new THREE.Group();guides.name='optional collision overlay';scene.add(guides);
 const ring=(x,z,r,color)=>{const geom=new THREE.RingGeometry(r-.06,r+.06,80);geom.rotateX(-Math.PI/2);const m=new THREE.Mesh(geom,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.75,depthWrite:false,side:THREE.DoubleSide}));m.position.set(x,.08,z);guides.add(m);};
 ring(0,0,A.radius,'#ead49d');for(const p of mirrorPoints())ring(p.x,p.z,.47,'#95e6f3');guides.visible=false;
 return {group,guides,failures};
}
