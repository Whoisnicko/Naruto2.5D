import {END_VALLEY as A,rng,outsideArena,waveAt} from './sasuke-valley-data.js?v=6g1';
export function waterArt(){
 const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const r=rng(79);
 g.fillStyle='#527f89';g.fillRect(0,0,512,512);
 for(let i=0;i<1200;i++){const x=r()*512,y=r()*512,w=5+r()*35;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+w*.5,y-2-r()*2,x+w,y+.5);g.strokeStyle=i%3?'rgba(210,236,230,.13)':'rgba(19,52,62,.14)';g.lineWidth=.5+r()*1.4;g.stroke();}
 return c;
}
export async function createEndValley({THREE,scene}){
 const group=new THREE.Group(),guides=new THREE.Group(),failures=[],P=A.palette,r=rng();group.name=A.id;guides.visible=false;scene.add(group,guides);
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.94,...extra});
 const stone=mat(P.stone),shadow=mat(P.shadow),light=mat(P.light),cliff=mat(P.cliff),moss=mat(P.moss);
 const boxGeo=new THREE.BoxGeometry(1,1,1),sphereGeo=new THREE.SphereGeometry(1,14,10),rockGeo=new THREE.DodecahedronGeometry(1,0),cylinderGeo=new THREE.CylinderGeometry(.76,1,1,10);
 function piece(parent,geo,material,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);parent.add(o);return o;}
 let texture=null;try{texture=new THREE.CanvasTexture(waterArt());texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(3,3);}catch{failures.push('water texture');}
 const waterGeo=new THREE.PlaneGeometry(A.floor,A.floor);waterGeo.rotateX(-Math.PI/2);piece(group,waterGeo,mat(texture?'#ffffff':P.water,{map:texture,roughness:.48,metalness:.03}),0,-.024,0,1,1,1);
 // Rocky gorge: silhouetted cliff layers behind the two founders.
 for(const [x,z,w,h] of A.cliffs){if(!outsideArena(x,z,w))continue;piece(group,rockGeo,cliff,x,h*.3,z,w,h*.76,w*.72,0,r()*6.283);piece(group,rockGeo,shadow,x+2,h*.34,z-3,w*.72,h*.9,w*.55,.12,r()*6.283);}
 for(let i=0;i<30;i++){const side=i%2?1:-1,x=side*(20+r()*15),z=-20+r()*37,w=1.5+r()*3.6;if(!outsideArena(x,z,w))continue;piece(group,rockGeo,i%4?cliff:moss,x,w*.13,z,w,.5+w*.48,w*.7,0,r()*6.283);}
 // Original stylized stone sculptures: distinct hair, layered armor, faces, hand seals.
 function statue(s){
  if(!outsideArena(s.x,s.z,5))return;
  const root=new THREE.Group();root.position.set(s.x,0,s.z);root.rotation.y=s.yaw;group.add(root);
  const B=(m,x,y,z,w,h,d,rz=0)=>piece(root,boxGeo,m,x,y,z,w,h,d,0,0,rz);
  const E=(m,x,y,z,w,h,d,rz=0)=>piece(root,sphereGeo,m,x,y,z,w,h,d,0,0,rz);
  const R=(m,x,y,z,w,h,d,rx=0,ry=0,rz=0)=>piece(root,rockGeo,m,x,y,z,w,h,d,rx,ry,rz);
  const limb=(m,a,b,width,depth)=>{const v=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(v);const o=new THREE.Mesh(cylinderGeo,m);o.position.copy(v.add(end).multiplyScalar(.5));o.scale.set(width,delta.length(),depth);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());root.add(o);};
  B(shadow,0,.45,0,7.6,.9,6.1);B(stone,0,1.12,0,6.7,.45,5.3);B(light,0,1.46,0,6,.25,4.8);
  for(const side of [-1,1]){B(stone,side*1.13,2.95,0,1.75,3.0,2.1);B(shadow,side*1.17,1.55,.7,2.0,.62,2.65);B(light,side*1.13,3.1,1.07,1.35,1.7,.22);}
  R(stone,0,5.6,0,2.6,2.6,1.32,0,.14);B(shadow,0,4.62,.28,4.75,.5,2.4);
  // Lamellar armor and the founders' characteristic shoulder plates.
  for(let i=0;i<5;i++){const y=5.05+i*.51;B(i%2?stone:light,0,y,1.16,3.7+.17*i,.45,.28);B(shadow,0,y-.22,1.32,3.6,.085,.09);}
  for(const side of [-1,1]){R(shadow,side*2.12,7.1,.1,1.2,.65,1.0,0,0,side*.17);limb(stone,[side*2.22,6.9,0],[side*2.85,5.45,1.0],.62,.65);limb(light,[side*2.85,5.45,1],[side*.49,7.05,2.02],.53,.55);E(stone,side*.46,7.12,2.05,.39,.61,.37,side*.14);B(light,side*.35,7.65,2.05,.29,.67,.28);}
  E(stone,0,8.1,.04,.66,.65,.63);E(light,0,9.2,.16,1.15,1.45,.94);
  // Face planes, nose, eyes and chin, kept sculptural rather than painted.
  E(stone,-.5,9.44,.84,.54,.17,.17,-.1);E(stone,.5,9.44,.84,.54,.17,.17,.1);
  B(shadow,-.47,9.28,.99,.69,.10,.10);B(shadow,.47,9.28,.99,.69,.10,.10);
  R(light,0,9.02,1.03,.26,.39,.28);B(shadow,0,8.65,.95,.66,.08,.12);R(stone,0,8.43,.44,.76,.38,.59);
  if(s.id==='hashirama'){
   E(shadow,0,9.83,-.19,1.23,1.11,1.05);
   for(const side of [-1,1]){R(shadow,side*.99,8.48,-.22,.48,1.7,.84,0,0,side*.09);R(stone,side*1.08,8.93,.36,.31,1.18,.55,0,0,side*.10);}
   B(light,0,9.89,.84,1.87,.42,.23);B(shadow,0,9.89,.98,.72,.20,.04);
  }else{
   E(shadow,0,9.92,-.19,1.39,1.25,1.04);
   for(let i=0;i<7;i++){const side=i<3?-1:1,n=i<3?i:i-3;R(i%2?shadow:stone,side*(.68+n*.24),10.15+n*.14,-.33,.41,.84,.51,.05,.12,side*.46);}
   for(const side of [-1,1]){R(shadow,side*1.13,8.44,-.34,.56,1.82,.76,0,0,side*.17);R(stone,side*.76,9.46,.57,.36,1.06,.39,0,0,side*.36);}
   // Asymmetric armored collar and fan emblem carved into breastplate.
   B(shadow,0,7.71,-.42,2.9,.81,1.22);E(shadow,0,6.42,1.38,.35,.43,.07);B(shadow,0,5.99,1.38,.10,.38,.08);
  }
 }
 A.statues.forEach(statue);
 // Central waterfall, white curtains and darker water channels.
 const w=A.waterfall,falls=new THREE.Group();falls.position.set(w.x,0,w.z);group.add(falls);
 piece(falls,boxGeo,mat('#7babb7',{roughness:.46}),0,w.height/2,0,w.width,w.height,.45);
 const streakMat=new THREE.MeshBasicMaterial({color:'#cce8ea',transparent:true,opacity:.52,depthWrite:false}),streaks=[];
 for(let i=0;i<34;i++){const x=-w.width/2+.25+i*(w.width-.5)/33,len=1.3+r()*4;const o=piece(falls,boxGeo,streakMat,x,r()*w.height,.29,.055+r()*.20,len,.045);streaks.push({o,len,phase:r()*w.height,speed:3.8+r()*3.2});}
 const foamMat=new THREE.MeshBasicMaterial({color:P.foam,transparent:true,opacity:.25,depthWrite:false,side:THREE.DoubleSide}),foam=[];
 for(let i=0;i<15;i++){const ring=new THREE.RingGeometry(.91,1,44);ring.rotateX(-Math.PI/2);const o=piece(group,ring,foamMat,(r()-.5)*w.width,.016,w.z+2+r()*4,1,1,.58);foam.push({o,phase:r()*6.283,size:.4+r()*1.9});}
 const pos=new Float32Array(A.spray*3),seeds=[];for(let i=0;i<A.spray;i++)seeds.push([(r()-.5)*w.width, r(),r()*5,r()*6.283]);
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3).setUsage(THREE.DynamicDrawUsage));const spray=new THREE.Points(pg,new THREE.PointsMaterial({color:P.foam,size:.16,transparent:true,opacity:.45,depthWrite:false}));spray.frustumCulled=false;group.add(spray);
 const edge=new THREE.RingGeometry(A.radius-.035,A.radius+.04,96);edge.rotateX(-Math.PI/2);piece(group,edge,new THREE.MeshBasicMaterial({color:'#a8d0cf',transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide}),0,.006,0,1,1,1);
 function updateAtmosphere(t){if(texture){texture.offset.x=(t*.014)%1;texture.offset.y=(t*.009)%1;}for(const a of streaks){a.o.position.y=w.height-((a.phase+t*a.speed)%w.height);a.o.scale.y=Math.min(a.len,Math.max(.05,a.o.position.y*2),Math.max(.05,(w.height-a.o.position.y)*2));}for(const a of foam){const s=a.size*(1+.2*Math.sin(t*2+a.phase));a.o.scale.set(s,1,s*.58);}for(let i=0;i<seeds.length;i++){const [x,phase,d,angle]=seeds[i],u=(phase+t*.22)%1,j=i*3;pos[j]=x+Math.sin(angle)*u*1.1;pos[j+1]=.1+Math.sin(u*Math.PI)*1.6;pos[j+2]=w.z+1.3+d*u+waveAt(x,d,t)*.14;}pg.attributes.position.needsUpdate=true;}
 updateAtmosphere(0);return {group,guides,failures,updateAtmosphere};
}
