// Static illustrated world only. Source of truth: approved 144x84 blockout.
import {zones,buildings,river,roads,walls,trees,blocked} from './konoha-layout.js';
import {ART,DECOR} from './konoha-three-data.js';
import {PLAZA_CHERRIES,PLAZA_PROPS,PLAZA_GARDENS,gardenClear,referenceName} from './konoha-reference-art.js?v=7a1';
import {REGIONS,PORTALS} from './konoha-regions.js?v=3c64';

export function createKonohaScene({THREE,scene,groundGroup,billboards,textures,depthArt=true}){
const solidMat=color=>new THREE.MeshBasicMaterial({color});
const regionVisuals=new Map();let roadLayer=0;
// Keep the approved asset at the approved plaza anchor. Terrain owns the emblem,
// not the actors, collision system or legacy map. The original texture is preferred.
function addPlazaMedallion(){
 const mark=textures['plaza-medallion'];let map=mark?.tex;
 if(!map){try{const c=document.createElement('canvas');c.width=c.height=256;const q=c.getContext('2d');q.fillStyle='#ddc6a0';q.fillRect(0,0,256,256);q.strokeStyle='#a86443';q.lineWidth=12;q.lineCap='round';q.beginPath();q.arc(128,128,109,0,Math.PI*2);q.stroke();q.beginPath();for(let i=0;i<=140;i++){const t=i/140*Math.PI*2.2,r=11+t*9,x=126+Math.cos(t)*r,y=128+Math.sin(t)*r;i?q.lineTo(x,y):q.moveTo(x,y);}q.lineTo(48,180);q.lineTo(25,180);q.stroke();map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;}catch{}}
 const g=new THREE.CircleGeometry(3.6,64);g.rotateX(-Math.PI/2);
 const mat=new THREE.MeshBasicMaterial(map?{map,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}:{color:'#b58d65',side:THREE.DoubleSide});
 const m=new THREE.Mesh(g,mat);m.name='konoha-plaza-medallion';m.userData.originalAsset=!!mark;m.position.set(72,.11,43);m.renderOrder=1;groundGroup.add(m);return m;
}
const tileMats={};function tile(n,color,scale){const key=n+color+scale;if(tileMats[key])return tileMats[key];const t=textures[n]?.tex;let mat;if(t){const map=t.clone();map.wrapS=map.wrapT=THREE.MirroredRepeatWrapping;map.needsUpdate=true;mat=new THREE.MeshBasicMaterial({map,color,polygonOffset:true,polygonOffsetFactor:-1});}else mat=solidMat(color);mat.userData.repeat=scale;return tileMats[key]=mat;}
function flat(name,x,z,w,d,level,color='#ffffff',repeat=5){const g=new THREE.PlaneGeometry(w,d);g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(x-w/2+uv.getX(i)*w)/repeat,(z+d/2-uv.getY(i)*d)/repeat);const mesh=new THREE.Mesh(g,tile(name,color,repeat));mesh.position.set(x,level,z);groundGroup.add(mesh);return mesh;}
function circle(name,x,z,rx,rz,level,color,repeat){const g=new THREE.CircleGeometry(1,80);g.rotateX(-Math.PI/2);g.scale(rx,1,rz);const uv=g.attributes.uv,pos=g.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(x+pos.getX(i))/repeat,(z+pos.getZ(i))/repeat);const m=new THREE.Mesh(g,tile(name,color,repeat));m.position.set(x,level,z);groundGroup.add(m);}
function road(r){for(let i=1;i<r.points.length;i++){const [ax,az]=r.points[i-1],[bx,bz]=r.points[i],dx=bx-ax,dz=bz-az,l=Math.hypot(dx,dz),nx=-dz/l*r.w/2,nz=dx/l*r.w/2;let pts=[[ax+nx,az+nz],[bx+nx,bz+nz],[bx-nx,bz-nz],[ax-nx,az-nz]];let g=new THREE.BufferGeometry();const level=.025+(++roadLayer)*.00012;g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flatMap(([x,z])=>[x,0,z]),3));g.setAttribute('uv',new THREE.Float32BufferAttribute(pts.flatMap(([x,z])=>[x/5,z/5]),2));g.setIndex([0,2,1,0,3,2]);g.computeVertexNormals();let m=new THREE.Mesh(g,tile('cobbles-irregular','#e6d7c0',5));m.material.side=THREE.DoubleSide;m.position.y=level;groundGroup.add(m);if(i<r.points.length-1)circle('cobbles-irregular',bx,bz,r.w/2,r.w/2,.025+(++roadLayer)*.00012,'#e6d7c0',5);}}
function shadow(x,z,w,d){let g=new THREE.CircleGeometry(1,32);g.rotateX(-Math.PI/2);g.scale(w/2,1,d/2);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:'#273c24',transparent:true,opacity:.19,depthWrite:false}));m.position.set(x+.2,.09,z+.3);m.renderOrder=2;scene.add(m);return m;}
// Additional soft ground contact for plaza ornaments only. Kept inside region capture;
 // no gameplay geometry, no actor shadow changes. Shared resources limit allocations.
 const softShadowGeo=new THREE.CircleGeometry(1,32);softShadowGeo.rotateX(-Math.PI/2);
 const softShadowMat=new THREE.MeshBasicMaterial({color:'#35472e',transparent:true,opacity:.075,depthWrite:false});
 function plazaShadow(x,z,w,d){if(!depthArt)return;const m=new THREE.Mesh(softShadowGeo,softShadowMat);m.scale.set(w*.63,1,d*.72);m.position.set(x+.34,.088,z+.42);m.renderOrder=2;scene.add(m);}
 // Real Three.js meshes with camera-facing planes; depth uses the ground anchor, not the center of the image.
function sprite(name,x,z,w,{depth=z,aspect=.85,kind='prop',offset=0}={}){const a=textures[name];const h=w*(a?.aspect||aspect),material=a?new THREE.MeshBasicMaterial({map:a.tex,transparent:true,alphaTest:.08,depthTest:false,depthWrite:false}):new THREE.MeshBasicMaterial({color:kind==='tree'?'#48744b':'#b69a74',transparent:true,depthTest:false,depthWrite:false});const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);scene.add(m);const o={name,x,z,w,h,m,depth,offset,kind};billboards.push(o);return o;}
function ground(){flat('grass-natural',72,42,240,125,0,'#b6c4a4',9);flat('grass-wildflowers',72,-9,144,22,.005,'#849772',10);for(const r of roads)road(r);for(const z of zones){if(z.kind==='combat')flat('dirt-compact',z.bounds[0]+z.bounds[2]/2,z.bounds[1]+z.bounds[3]/2,z.bounds[2],z.bounds[3],.016,'#e2caa5',7);}
 const paving=referenceName(textures,'plaza-reference'),pavingTint=paving==='plaza-reference'?'#ffffff':'#f1e5ce';
 circle(paving,72,43,13.1,9.2,.045,pavingTint,6);addPlazaMedallion();flat(paving,72,28,15,8,.042,paving==='plaza-reference'?'#ffffff':'#efdfbd',6);
 for(const [x,z,rx,rz] of PLAZA_GARDENS){if(gardenClear(x,z,Math.min(rx,rz)*.65,blocked,roads))circle('grass-wildflowers',x,z,rx,rz,.012,'#b3c49d',5);}
 flat('water-clear',36,42,4,78,.075,'#b9d9ce',5);for(const x of [33.7,38.3])flat('dirt-compact',x,42,.6,78,.076,'#b3a382',4);for(const b of river.bridges)flat('plaza-tiles',36,b.y,5.4,b.w,.085,'#dfcdb5',5);}
function assemble(){ground();sprite('mountain',72,6,124,{depth:-100,kind:'mountain'});for(const [i,b] of buildings.entries()){const n=ART[b.kind]|| (b.kind==='house'?ART.houses[Number(b.id.slice(5))%6]:ART.shops[i%3]);shadow(b.x+b.w/2,b.y+b.d,b.w*1.08,3.2);sprite(n,b.x+b.w/2,b.y+b.d,b.w*1.14,{kind:'building'});}
 for(const [i,t] of trees.entries()){if(!blocked(t.x,t.y)) {shadow(t.x,t.y,t.r*2.4,1.7);sprite(ART.trees[i%3],t.x,t.y,t.r*3.6,{kind:'tree'});}}for(const [n,x,z,w] of DECOR){if(!blocked(x,z)){const cherry=PLAZA_CHERRIES.find(a=>a.x===x&&a.z===z&&a.original===n);const art=cherry&&textures['cherry-reference']&&n==='cherry-wide'?'cherry-reference':n,size=cherry?cherry.w:w;shadow(x,z,size*.8,Math.min(1.9,size*.28));if(cherry)plazaShadow(x,z,size*.8,Math.min(1.9,size*.28));sprite(art,x,z,size,{kind:n.includes('tree')||n.includes('cherry')?'tree':'prop'});}}
 // New reference assets and a few layered garden accents; anchors never alter collision.
 for(const [n,x,z,w] of PLAZA_PROPS){if(blocked(x,z)||!textures[n])continue;shadow(x,z,w*.87,Math.min(1.1,w*.34));plazaShadow(x,z,w*.87,Math.min(1.1,w*.34));sprite(n,x,z,w,{kind:'prop'});}
 for(const [x,z,rx,rz] of PLAZA_GARDENS){for(let i=0;i<3;i++){const dx=(i-1)*rx*.59,dz=(i%2?-.45:.25)*rz,px=x+dx,pz=z+dz;if(gardenClear(px,pz,.35,blocked,roads)){const n=i===1?'flowers-pink':'bush-medium';sprite(n,px,pz,i===1?1.55:1.25,{kind:'prop'});}}}
 for(let i=0;i<65;i++){const x=8+(i*37)%128,z=9+(i*23)%68;if(blocked(x,z)||Math.abs(x-36)<5||Math.hypot(x-72,(z-43)*1.4)<15||roads.some(r=>r.points.slice(1).some((b,j)=>{const a=r.points[j],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-dx*t,z-a[1]-dy*t)<r.w/2+1.6}))||buildings.some(b=>x>b.x-2&&x<b.x+b.w+2&&z>b.y-2&&z<b.y+b.d+2))continue;const n=i%3===0?'flowers-pink':'bush-medium';sprite(n,x,z,1.1+(i%4)*.3,{kind:'prop'});}for(const [i,b] of river.bridges.entries())sprite(ART.bridges[i],36,b.y+1.65,7.6,{depth:b.y-b.w/2-.1,kind:'bridge'});
 // Wall silhouettes on fixed blockout footprints. Vertical sides use basic geometry rather than rotating front-facing artwork.
 for(const w of walls){if(w.w>w.d){const count=Math.ceil(w.w/10);for(let i=0;i<count;i++)sprite('wall-long',w.x+(i+.5)*w.w/count,w.y+w.d,w.w/count,{kind:'wall'});}else{let m=new THREE.Mesh(new THREE.BoxGeometry(w.w,2.4,w.d),solidMat('#ac9171'));m.position.set(w.x+w.w/2,1.2,w.y+w.d/2);scene.add(m);}}
 sprite('main-gate',72,83,15.7,{kind:'gate',depth:83.2});sprite('watchtower',62,82,4.5,{kind:'wall',depth:82.1});sprite('watchtower',82,82,4.5,{kind:'wall',depth:82.1});
 sprite('notice-board',75.5,78.4,1.8,{kind:'prop'});sprite('notice-board',136,41,1.8,{kind:'prop'});
}
// Capture static objects per region. Keep actor, HUD and NPC state alive across transitions.
function captureRegion(id,build){const priorScene=new Set(scene.children),priorGround=new Set(groundGroup.children);build();regionVisuals.set(id,[...scene.children.filter(o=>!priorScene.has(o)),...groundGroup.children.filter(o=>!priorGround.has(o))]);}
function assembleExterior(id){const m=REGIONS[id];flat(m.ground,m.width/2,m.height/2,m.width+48,m.height+48,0,m.tint,9);
 for(const [i,g] of m.groundPieces.entries())flat(g.art,g.x,g.y,g.w,g.h,.03+i*.001,g.tint,6);
 for(const o of m.objects){shadow(o.x,o.y,o.w*.8,Math.min(2,o.w*.35));sprite(o.art,o.x,o.y,o.w,{kind:o.art.startsWith('tree')?'tree':'prop'});}
 if(id==='outpost')for(const [x,z] of [[25,25],[39,25],[25,35],[39,35]])sprite('lamp-post',x,z,1.25,{kind:'prop'});
 for(const t of PORTALS.filter(t=>t.region===id))sprite('notice-board',t.at[0],t.at[1]-2.3,2.1,{kind:'prop'});
}

function show(id){for(const [key,objects] of regionVisuals)for(const o of objects)o.visible=key===id;scene.background.set(id==='forest'?'#506a46':id==='outpost'?'#79845d':'#607c57');}
function status(){const mark=groundGroup.children.find(o=>o.name==='konoha-plaza-medallion');return {regions:[...regionVisuals.keys()],objects:Object.fromEntries([...regionVisuals].map(([id,o])=>[id,o.length])),plaza:mark?{x:mark.position.x,z:mark.position.z,height:mark.position.y,visible:mark.visible,originalAsset:mark.userData.originalAsset}:null};}
return {shadow,assemble,captureRegion,assembleExterior,show,status};
}
