// Art-review scene. The combat contract and approved geometry stay in mist-bridge-data.
import {MIST_BRIDGE,mirrorPoints} from './mist-bridge-data.js';
import {BRIDGE_ART,deckArt,waterArt,mistArt} from './mist-bridge-art.js?v=6a2';
export async function createMistBridge({THREE,scene,assetURL}){
 const A=MIST_BRIDGE,loader=new THREE.TextureLoader(),failures=[],maps={};
 // Full-length non-repeating generated art; original textures or solid materials as fallbacks.
 for(const [key,make] of [['deck',deckArt],['water',waterArt],['mist',mistArt]])try{const tex=new THREE.CanvasTexture(make());tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;maps[key]=tex;}catch{failures.push(key+' generated art');}
 await Promise.all(Object.entries(A.assets).filter(([key])=>!maps[key]).map(async([key,name])=>{try{const map=await loader.loadAsync(assetURL(name));map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;maps[key]=map;}catch{failures.push(name);}}));
 const group=new THREE.Group();group.name='mist-bridge-review';scene.add(group);
 const materials=new Map(),mat=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.94}));return materials.get(color)};
 function box(x,y,z,w,h,d,color,name='detail'){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.name=name;m.position.set(x,y,z);group.add(m);return m;}
 function plane(x,y,z,w,d,key,color,repeat=0){const g=new THREE.PlaneGeometry(w,d);g.rotateX(-Math.PI/2);const map=maps[key]?.clone();if(map&&repeat){map.repeat.set(w/repeat,d/repeat);map.needsUpdate=true;}const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color,map:map||null,roughness:.96}));m.name=key;m.position.set(x,y,z);group.add(m);return m;}
 plane(0,A.water.level,0,A.water.width,A.water.length,'water','#d0e1e0');
 for(const z of [-43,43]){box(0,-1.6,z,105,2,18,'#566c68','bank');plane(0,-.58,z,105,18,'bank','#84968a',9);}
 box(0,-.65,0,A.deck.width,1.2,A.deck.length,'#627775','deck-base');plane(0,.006,0,A.deck.width,A.deck.length,'deck','#deded1');
 // Layered stone parapets with readable tops and shadowed bases, outside the playable circle.
 for(const sign of [-1,1]){
  const x=sign*14.65;box(x,.12,0,.7,.24,68,'#647a75','rail-base');box(x,.4,0,.48,.36,68,'#80928a','rail-plinth');box(x,1.08,0,.46,.2,68,'#a4b1a3','rail-top');box(x,1.2,0,.58,.10,68,'#bdc5b2','rail-cap');
  for(let z=-32;z<=32;z+=4){box(x,.62,z,.67,1.24,.75,BRIDGE_ART.rail[(z+32)/4%4],'rail-post');box(x,1.31,z,.89,.14,.94,'#b1bdad','post-cap');box(x,1.40,z,.68,.04,.72,'#d1d5bf','post-highlight');}
  box(x,-1.48,0,1.25,.5,68,'#53676c','under-girder');
  // Narrow edge foam. No straight cross-water bars.
  for(let i=0;i<28;i++){const z=-33+i*2.4+Math.sin(i*3)*.5;box(sign*(15.5+Math.sin(i*1.7)*.55),A.water.level+.018,z,.12+(i%3)*.06,.018,.45+(i%5)*.29,'#a2bfc0','foam');}
 }
 // All support tops strictly below the deck; no square intrusions or water-spanning geometry.
 for(const z of [-27,-9,9,27])for(const x of [-11.5,11.5]){box(x,-2.30,z,2.25,2.7,2.5,'#455e63','support');box(x,-.94,z,3.1,.40,3.2,'#748988','support-cap');}
 // Decorative stone entrance posts far beyond combat radius.
 for(const z of [-29,29])for(const x of [-12.8,12.8]){box(x,.12,z,1.65,.24,1.65,'#6c8179','gate-base');box(x,1.6,z,1.1,3.2,1.1,'#7f938a','gate-post');box(x,3.24,z,1.45,.22,1.45,'#b3bfad','gate-cap');box(x,3.40,z,1.15,.10,1.15,'#d3d7c2','gate-highlight');}
 // Low-cost mist wisps over the water only, kept out of the fight area.
 const mist=[];if(maps.mist)for(let i=0;i<14;i++){const sign=i%2?1:-1,x=sign*(23+(i%4)*8),z=-43+(i*17)%86;const g=new THREE.PlaneGeometry(15+(i%3)*4,11);g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:maps.mist,transparent:true,depthWrite:false,opacity:.42,fog:false}));m.position.set(x,A.water.level+.05,z);m.renderOrder=1;group.add(m);mist.push({m,x,z,sign,i});}
 function updateAtmosphere(t){for(const a of mist){a.m.position.x=a.x+Math.sin(t*.16+a.i)*1.4;a.m.position.z=a.z+Math.sin(t*.11+a.i*2)*2;}}
 const guides=new THREE.Group();guides.name='optional collision overlay';scene.add(guides);
 const ring=(x,z,r,color)=>{const geom=new THREE.RingGeometry(r-.06,r+.06,80);geom.rotateX(-Math.PI/2);const m=new THREE.Mesh(geom,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.75,depthWrite:false,side:THREE.DoubleSide}));m.position.set(x,.08,z);guides.add(m);};
 ring(0,0,A.radius,'#ead49d');for(const p of mirrorPoints())ring(p.x,p.z,.47,'#95e6f3');guides.visible=false;
 return {group,guides,failures,updateAtmosphere};
}
