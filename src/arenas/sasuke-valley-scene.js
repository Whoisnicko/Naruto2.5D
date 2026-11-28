import {END_VALLEY as A,rng,outsideArena,waveAt} from './sasuke-valley-data.js?v=6g4';
export function waterArt(){
 const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const r=rng(79);
 g.fillStyle='#527f89';g.fillRect(0,0,512,512);
 for(let i=0;i<1200;i++){const x=r()*512,y=r()*512,w=5+r()*35;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+w*.5,y-2-r()*2,x+w,y+.5);g.strokeStyle=i%3?'rgba(210,236,230,.13)':'rgba(19,52,62,.14)';g.lineWidth=.5+r()*1.4;g.stroke();}
 return c;
}
// Original procedural painted surfaces. Every texture has a solid-color fallback.
export function stoneArt(){
 const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const r=rng(162);
 g.fillStyle='#c7cbc0';g.fillRect(0,0,512,512);
 for(let i=0;i<100;i++){const x=r()*512,y=r()*512,rad=12+r()*62;const d=g.createRadialGradient(x,y,0,x,y,rad);d.addColorStop(0,i%2?'rgba(53,71,66,.18)':'rgba(255,253,224,.26)');d.addColorStop(1,'rgba(170,175,165,0)');g.fillStyle=d;g.fillRect(x-rad,y-rad,rad*2,rad*2);}
 for(let i=0;i<14000;i++){g.fillStyle=i%2?'rgba(50,64,59,.11)':'rgba(255,253,230,.14)';g.fillRect(r()*512,r()*512,.4+r()*1.6,.4+r()*2);}
 for(let i=0;i<22;i++){let x=r()*512,y=r()*512;g.beginPath();g.moveTo(x,y);for(let j=0;j<5;j++){x+=(r()-.5)*17;y+=4+r()*12;g.lineTo(x,y);}g.strokeStyle='rgba(45,56,53,.18)';g.lineWidth=.5+r()*.65;g.stroke();}
 return c;
}
export function cascadeArt(){
 const c=document.createElement('canvas');c.width=512;c.height=1024;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const r=rng(891);
 const d=g.createLinearGradient(0,0,512,0);for(const [x,col] of [[0,'#80a6ad'],[.08,'#d8eeee'],[.24,'#98c4cf'],[.39,'#e3f1eb'],[.53,'#75a4b5'],[.72,'#d9eeed'],[.9,'#a6ccd3'],[1,'#668b98']])d.addColorStop(x,col);g.fillStyle=d;g.fillRect(0,0,512,1024);
 for(let i=0;i<1300;i++){const x=r()*512,y=r()*1024,w=.6+r()*5,h=12+r()*170;g.strokeStyle=i%4?'rgba(245,255,252,.28)':'rgba(44,91,113,.23)';g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.bezierCurveTo(x+(r()-.5)*8,y+h*.4,x+(r()-.5)*10,y+h*.8,x+2,y+h);g.stroke();if(y+h>1024){g.beginPath();g.moveTo(x,y-1024);g.lineTo(x+2,y+h-1024);g.stroke();}}
 return c;
}
export function mistArt(){
 const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const d=g.createRadialGradient(64,64,4,64,64,62);d.addColorStop(0,'rgba(240,252,249,.7)');d.addColorStop(.35,'rgba(224,245,244,.47)');d.addColorStop(1,'rgba(214,240,239,0)');g.fillStyle=d;g.fillRect(0,0,128,128);return c;
}
export async function createEndValley({THREE,scene}){
 const group=new THREE.Group(),guides=new THREE.Group(),failures=[],P=A.palette,r=rng();group.name=A.id;guides.visible=false;scene.add(group,guides);
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.94,...extra});
 function painted(name,make){try{const t=new THREE.CanvasTexture(make());t.colorSpace=THREE.SRGBColorSpace;return t;}catch{failures.push(name);return null;}}
 const rockMap=painted('stone texture',stoneArt),fallMap=painted('waterfall texture',cascadeArt),mistMap=painted('mist texture',mistArt);
 if(fallMap){fallMap.wrapS=fallMap.wrapT=THREE.RepeatWrapping;fallMap.repeat.set(1,1.6);}
 const stone=mat('#a9afa4',{map:rockMap}),shadow=mat('#65736f',{map:rockMap}),light=mat('#c2c5ba',{map:rockMap}),cliff=mat('#6e8180',{map:rockMap}),moss=mat('#758b6e',{map:rockMap});
 const boxGeo=new THREE.BoxGeometry(1,1,1),sphereGeo=new THREE.SphereGeometry(1,14,10),rockGeo=new THREE.DodecahedronGeometry(1,0),cylinderGeo=new THREE.CylinderGeometry(.76,1,1,10);
 function piece(parent,geo,material,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);parent.add(o);return o;}
 let texture=null;try{texture=new THREE.CanvasTexture(waterArt());texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(3,3);}catch{failures.push('water texture');}
 const waterGeo=new THREE.PlaneGeometry(A.floor,A.floor);waterGeo.rotateX(-Math.PI/2);piece(group,waterGeo,mat(texture?'#ffffff':P.water,{map:texture,roughness:.48,metalness:.03}),0,-.024,0,1,1,1);
 // Rocky gorge: silhouetted cliff layers behind the two founders.
 for(const [x,z,w,h] of A.cliffs){if(!outsideArena(x,z,w))continue;piece(group,rockGeo,cliff,x,h*.3,z,w,h*.76,w*.72,0,r()*6.283);piece(group,rockGeo,shadow,x+2,h*.34,z-3,w*.72,h*.9,w*.55,.12,r()*6.283);}
 for(let i=0;i<30;i++){const side=i%2?1:-1,x=side*(20+r()*15),z=-20+r()*37,w=1.5+r()*3.6;if(!outsideArena(x,z,w))continue;piece(group,rockGeo,i%4?cliff:moss,x,w*.13,z,w,.5+w*.48,w*.7,0,r()*6.283);}
 // Original stylized stone sculptures: distinct hair, layered armor, faces, hand seals.
 function statue(s){
  if(!outsideArena(s.x,s.z,A.statueExtent))return;
  const root=new THREE.Group();root.position.set(s.x,0,s.z);root.rotation.y=s.yaw;group.add(root);
  const isHash=s.id==='hashirama';
  const B=(m,x,y,z,w,h,d,rz=0)=>piece(root,boxGeo,m,x,y,z,w,h,d,0,0,rz);
  const E=(m,x,y,z,w,h,d,rz=0)=>piece(root,sphereGeo,m,x,y,z,w,h,d,0,0,rz);
  const R=(m,x,y,z,w,h,d,rx=0,ry=0,rz=0)=>piece(root,rockGeo,m,x,y,z,w,h,d,rx,ry,rz);
  const limb=(m,a,b,width,depth)=>{const v=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(v);const o=new THREE.Mesh(cylinderGeo,m);o.position.copy(v.add(end).multiplyScalar(.5));o.scale.set(width,delta.length(),depth);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());root.add(o);};
  // Dressed stone footing and broad rock-to-sculpture transition.
  B(shadow,0,.45,0,7.6,.9,6.1);B(stone,0,1.12,0,6.7,.45,5.3);B(light,0,1.46,0,6,.25,4.8);
  for(const side of [-1,1]){
   E(stone,side*1.08,3.15,-.06,.87,1.72,.88);
   B(shadow,side*1.12,1.83,.45,1.73,.51,2.13);
   E(stone,side*1.12,1.91,.78,.87,.30,1.09);
   for(let j=0;j<3;j++)B(light,side*1.12,2.13,.52+j*.25,1.53,.075,.16);
   // Fabric folds and shin guards, not cylindrical bare legs.
   for(let j=0;j<3;j++)R(j===1?shadow:stone,side*(.68+j*.31),3.00,.68,.15,.98,.21,0,0,side*(j-1)*.11);
   B(light,side*1.07,2.65,.84,1.32,.67,.27);
  }
  E(stone,0,5.9,-.07,2.06,2.05,1.06);E(shadow,0,4.68,.05,2.10,.46,1.04);
  B(light,0,4.77,.90,3.85,.32,.20);
  // Five overlapping skirt plates; separate torso lamellae and carved fastening.
  for(const side of [-1,1]){
   for(let i=0;i<3;i++){B(i%2?stone:light,side*(.64+.66*i),4.13,.76-.13*i,.62,1.22-.10*i,.30,side*(.035+i*.055));B(shadow,side*(.64+.66*i),3.58,.91-.13*i,.54,.08,.07);}
   for(let i=0;i<5;i++){
    const y=5.11+i*.48;B(i%2?stone:light,side*.91,y,1.00,1.70+.08*i,.43,.27,side*.025);
    B(shadow,side*.91,y-.22,1.16,1.70,.055,.07);
    for(const dx of [-.50,.50]){E(shadow,side*.91+dx,y+.08,1.16,.047,.065,.032);B(shadow,side*.91+dx,y-.05,1.17,.045,.18,.04);}
   }
   for(let i=0;i<3;i++){B(i%2?stone:light,side*(2.02+.10*i),7.17-.35*i,.08,1.05,.36,1.58,side*(.14+.02*i));B(shadow,side*(2.02+.10*i),7.00-.35*i,.80,1.0,.06,.07,side*.14);}
  }
  // Canon-inspired single raised hand: two extended fingers; opposite hand lowered.
  // Mirror the arm choice to make the inward silhouette legible from downstream.
  const raised=isHash?1:-1,low=-raised;
  limb(stone,[raised*2.06,6.84,.05],[raised*2.72,5.82,1.00],.66,.69);
  limb(light,[raised*2.72,5.82,1.00],[raised*1.70,7.82,1.94],.54,.55);
  E(stone,raised*1.70,7.94,1.96,.40,.48,.29);
  for(const dx of [-.115,.115]){
   const x=raised*1.70+dx;
   B(light,x,8.55,1.98,.19,.73,.22);E(light,x,8.92,1.98,.10,.13,.11);
   B(shadow,x,8.40,2.11,.15,.033,.028);
  }
  for(let j=0;j<3;j++)E(stone,raised*1.70+(j-1)*.15,7.88,2.20,.11,.22,.13);
  E(light,raised*1.40,8.01,2.12,.16,.24,.13,raised*.35);
  limb(stone,[low*2.10,6.78,0],[low*2.52,5.34,.35],.68,.68);
  limb(light,[low*2.52,5.34,.35],[low*1.95,4.38,.99],.53,.52);
  E(stone,low*1.95,4.26,1.02,.39,.51,.28,low*.16);
  for(let j=0;j<4;j++)B(shadow,low*1.95+(j-1.5)*.14,4.16,1.28,.045,.30,.04,low*.13);
  // Face planes, brows, lids, sculpted nose and jaw. Eyes intentionally stone.
  E(stone,0,8.04,.03,.65,.65,.60);
  E(light,0,9.20,.16,.99,1.24,.87);
  R(light,0,8.68,.54,.67,.51,.50,0,0,0);
  for(const side of [-1,1]){
   E(stone,side*.97,9.10,.03,.18,.32,.18);
   E(shadow,side*.99,9.10,.16,.075,.18,.06);
   E(stone,side*.45,9.37,.83,.48,.17,.14,-side*.14);
   B(shadow,side*.43,9.21,.94,.57,.068,.09,side*.055);
   E(light,side*.61,8.91,.73,.30,.26,.20,side*.24);
  }
  R(light,0,9.00,1.01,.22,.37,.24);
  E(shadow,0,8.63,.88,.31,.055,.095);
  E(light,0,8.53,.83,.33,.07,.10);
  if(isHash){
   // Hashirama: smooth long hair, forehead protector, vertically carved strands.
   E(shadow,0,9.82,-.28,1.19,1.07,1.01);
   E(stone,0,8.55,-.77,1.11,1.72,.57);
   B(light,0,9.86,.79,1.75,.39,.18);B(shadow,0,9.86,.90,.78,.22,.045);
   for(const side of [-1,1])for(let j=0;j<4;j++){
    E(j%2?stone:shadow,side*(.84+j*.13),8.76-j*.25,.04-j*.10,.19,1.08,.29,side*.08);
    B(light,side*(.84+j*.13),8.80-j*.25,.29-j*.10,.035,.78,.04,side*.08);
   }
   for(let i=0;i<3;i++)B(shadow,-.23+i*.23,9.86,1.0,.05,.14,.028);
  }else{
   // Madara: long swept jagged hair, one partially obscured eye, tall collar.
   E(shadow,0,9.88,-.31,1.39,1.13,1.04);
   for(let i=0;i<10;i++){
    const side=i<5?-1:1,n=i%5;
    limb(i%2?stone:shadow,[side*(.31+n*.18),10.12-n*.13,-.18],[side*(.98+n*.16),9.55-n*.48,-.78-n*.14],.25+.045*n,.26+.04*n);
    R(i%2?shadow:stone,side*(.96+n*.18),9.40-n*.33,-.65-n*.09,.31,.68,.38,.25,side*.18,side*.33);
   }
   R(stone,.48,9.52,.61,.43,.92,.30,0,0,.36);
   B(shadow,0,7.77,-.38,2.7,.78,1.26);
   B(light,-1.14,7.77,.33,.26,.63,.35,-.12);B(light,1.14,7.77,.33,.26,.63,.35,.12);
  }

 }
 // Batch identical static geometry/material pairs inside each statue; preserve local transforms.
 function batchStatue(root){
  const buckets=new Map();for(const o of [...root.children]){if(!o.isMesh||Array.isArray(o.material))continue;const key=o.geometry.uuid+':'+o.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);}
  let count=0;for(const list of buckets.values()){if(list.length<2)continue;const batch=new THREE.InstancedMesh(list[0].geometry,list[0].material,list.length);for(let i=0;i<list.length;i++){const o=list[i];o.updateMatrix();batch.setMatrixAt(i,o.matrix);}batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();root.remove(...list);root.add(batch);count+=list.length-1;}return count;
 }
 A.statues.forEach(statue);
 const statueRoots=group.children.filter(o=>o.isGroup);for(const root of statueRoots)batchStatue(root);
 // Central waterfall, white curtains and darker water channels.
 const w=A.waterfall,falls=new THREE.Group();falls.position.set(w.x,0,w.z);group.add(falls);
 const curtain=new THREE.PlaneGeometry(w.width,w.height,1,1);
 piece(falls,boxGeo,mat('#537784',{roughness:.55}),0,w.height/2,-.10,w.width,w.height,.4);
 piece(falls,curtain,new THREE.MeshBasicMaterial({color:fallMap?'#ffffff':'#b2d5df',map:fallMap,side:THREE.DoubleSide}),0,w.height/2,.24,1,1,1);
 // Broken side channels and shelf above the falling water.
 for(const side of [-1,1]){piece(falls,rockGeo,cliff,side*(w.width*.5+.5),w.height*.44,-.55,1.6,w.height*.61,1.7,0,side*.18);piece(falls,boxGeo,light,side*(w.width*.5+.25),w.height+.08,-.6,1.5,.35,2.4);}
 piece(falls,boxGeo,cliff,0,w.height+.13,-1.4,w.width+1,.44,2.9);
 const mist=[];if(mistMap){const m=new THREE.MeshBasicMaterial({color:'#d4e9e9',map:mistMap,transparent:true,opacity:.46,depthWrite:false,side:THREE.DoubleSide});const geo=new THREE.PlaneGeometry(1,1);for(let i=0;i<12;i++){const x=-w.width*.55+i*w.width*1.10/11;const o=piece(group,geo,m,x,.45+r()*.5,w.z+1.4+r()*1.6,3.6,1.7,1,-.25);mist.push({o,x,phase:r()*6.283});}}

 const streakMat=new THREE.MeshBasicMaterial({color:'#cce8ea',transparent:true,opacity:.52,depthWrite:false}),streaks=[];
 for(let i=0;i<42;i++){const x=-w.width/2+.25+i*(w.width-.5)/41,len=1.3+r()*4;const o=piece(falls,boxGeo,streakMat,x,r()*w.height,.29,.055+r()*.20,len,.045);streaks.push({o,len,phase:r()*w.height,speed:3.8+r()*3.2});}
 const foamMat=new THREE.MeshBasicMaterial({color:P.foam,transparent:true,opacity:.25,depthWrite:false,side:THREE.DoubleSide}),foam=[];
 for(let i=0;i<15;i++){const ring=new THREE.RingGeometry(.91,1,44);ring.rotateX(-Math.PI/2);const o=piece(group,ring,foamMat,(r()-.5)*w.width,.016,w.z+1.0+r()*2.5,1,1,.58);foam.push({o,phase:r()*6.283,size:.4+r()*1.9});}
 const pos=new Float32Array(A.spray*3),seeds=[];for(let i=0;i<A.spray;i++)seeds.push([(r()-.5)*w.width, r(),r()*5,r()*6.283]);
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3).setUsage(THREE.DynamicDrawUsage));const spray=new THREE.Points(pg,new THREE.PointsMaterial({color:P.foam,size:.16,transparent:true,opacity:.45,depthWrite:false}));spray.frustumCulled=false;group.add(spray);
 const edge=new THREE.RingGeometry(A.radius-.035,A.radius+.04,96);edge.rotateX(-Math.PI/2);piece(group,edge,new THREE.MeshBasicMaterial({color:'#a8d0cf',transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide}),0,.006,0,1,1,1);
 function updateAtmosphere(t){if(fallMap)fallMap.offset.y=(t*.42)%1;for(const a of mist){a.o.position.x=a.x+Math.sin(t*.75+a.phase)*.35;a.o.position.y=.65+.22*Math.sin(t*.86+a.phase);a.o.scale.x=3.6+.3*Math.sin(t*.6+a.phase);}if(texture){texture.offset.x=(t*.014)%1;texture.offset.y=(t*.009)%1;}for(const a of streaks){a.o.position.y=w.height-((a.phase+t*a.speed)%w.height);a.o.scale.y=Math.min(a.len,Math.max(.05,a.o.position.y*2),Math.max(.05,(w.height-a.o.position.y)*2));}for(const a of foam){const s=a.size*(1+.2*Math.sin(t*2+a.phase));a.o.scale.set(s,1,s*.58);}for(let i=0;i<seeds.length;i++){const [x,phase,d,angle]=seeds[i],u=(phase+t*.22)%1,j=i*3;pos[j]=x+Math.sin(angle)*u*1.1;pos[j+1]=.1+Math.sin(u*Math.PI)*1.6;pos[j+2]=w.z+1.3+d*u+waveAt(x,d,t)*.14;}pg.attributes.position.needsUpdate=true;}
 updateAtmosphere(0);return {group,guides,failures,updateAtmosphere};
}
