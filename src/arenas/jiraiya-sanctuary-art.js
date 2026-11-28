// 6H.2 sculptural environment only. Native Three geometry, no external assets.
export function stoneArt(rng){
 const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');if(!g)throw Error('stone canvas unavailable');const r=rng(6138);
 g.fillStyle='#a4aca0';g.fillRect(0,0,256,256);
 for(let i=0;i<5000;i++){const x=r()*256,y=r()*256;g.fillStyle=i%3?'rgba(56,66,55,.08)':'rgba(230,231,211,.13)';g.fillRect(x,y,.6+r()*2.3,.6+r()*2.3);}
 return c;
}
// Compile static roots at identity group coordinates, before arena translation.
export function batchStatic(THREE,group,root){
 root.updateMatrixWorld(true);const sets=new Map();
 root.traverse(o=>{if(!o.isMesh||o.isInstancedMesh)return;const k=o.geometry.uuid+':'+o.material.uuid;if(!sets.has(k))sets.set(k,[]);sets.get(k).push(o);});
 let count=0;for(const arr of sets.values()){
  if(arr.length===1){const o=arr[0],m=new THREE.Mesh(o.geometry,o.material);m.matrixAutoUpdate=false;m.matrix.copy(o.matrixWorld);group.add(m);}
  else{const m=new THREE.InstancedMesh(arr[0].geometry,arr[0].material,arr.length);arr.forEach((o,i)=>m.setMatrixAt(i,o.matrixWorld));m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();group.add(m);}
  count++;
 }
 group.remove(root);return count;
}
export function buildSanctuaryArchitecture({THREE,group,A,mats,piece,box,cyl,rock,rng}){
 const root=new THREE.Group();group.add(root);const C=A.shrine,q=A.approach,r=rng(620);
 const put=(geo,m,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0)=>piece(root,geo,m,x,y,z,sx,sy,sz,rx,ry,rz);
 put(box,mats.dark,C.x,.20,C.z,C.w+1.1,.4,C.d+1.0);
 put(box,mats.stone,C.x,.48,C.z,C.w,.20,C.d);
 put(box,mats.plaster,C.x,1.95,C.z,C.w-.9,2.85,C.d-.65);
 const front=C.z+C.d/2-.27;
 for(const x of [-4.6,-2.5,2.5,4.6]){
  put(box,mats.timber,x,2.02,front,.24,2.95,.30);
  put(box,mats.timber,x,2.02,C.z-C.d/2+.29,.24,2.95,.30);
 }
 put(box,mats.timber,0,3.35,front,C.w-.6,.25,.28);
 put(box,mats.timber,0,.78,front,C.w-.6,.22,.28);
 put(box,mats.timber,0,1.91,front+.10,2.18,2.45,.25);
 for(const x of [-.48,.48]){
  put(box,mats.wood,x,1.91,front+.26,.91,2.21,.12);
  put(box,mats.trim,x,1.77,front+.34,.09,.10,.08);
  for(const y of [1.34,2.40])put(box,mats.timber,x,y,front+.34,.86,.09,.08);
 }
 for(const x of [-3.55,3.55]){
  put(box,mats.timber,x,2.24,front+.13,1.55,1.25,.13);
  put(box,mats.window,x,2.24,front+.23,1.38,1.08,.09);
  for(const dx of [-.40,0,.40])put(box,mats.timber,x+dx,2.24,front+.30,.055,1.08,.05);
  put(box,mats.timber,x,2.24,front+.30,1.38,.055,.05);
 }
 // Paired sloped roof panels with raised tile rows, eaves and ridge.
 const roofGeo=new THREE.BufferGeometry();
 roofGeo.setAttribute('position',new THREE.Float32BufferAttribute([-1,0,-1,1,0,-1,-1,1,0,1,1,0,-1,0,1,1,0,1],3));
 roofGeo.setIndex([0,2,1,1,2,3,2,4,3,3,4,5]);roofGeo.computeVertexNormals();
 function roof(y,w,d,h){
  put(roofGeo,mats.roof,C.x,y,C.z,w/2,h,d/2);
  for(const sign of [-1,1]){
   put(box,mats.timber,C.x,y+.04,C.z+sign*d/2,w+.18,.22,.22);
   for(let j=1;j<=3;j++){const t=j/4;put(box,mats.roofTrim,C.x,y+h*t,C.z+sign*d/2*(1-t),w+.04,.085,.10);}
  }
  put(box,mats.roofTrim,C.x,y+h+.04,C.z,w+.30,.18,.24);
  for(const sign of [-1,1])put(box,mats.trim,C.x+sign*(w/2-.14),y+h+.18,C.z,.36,.30,.34,0,0,sign*.28);
 }
 roof(3.50,C.roofW,C.roofD,C.roofH);
 put(box,mats.plaster,0,5.30,C.z,4.4,1.2,2.8);
 put(box,mats.timber,0,5.35,C.z+1.44,4.5,.12,.18);
 roof(5.93,6.1,4.1,.92);
 for(let i=0;i<4;i++)put(box,mats.stone,0,.07+i*.08,front+1.75-i*.36,3.8,.14+i*.16,.45);
 for(let i=0;i<4;i++){const z=q.z-q.d/2+(i+.5)*q.d/4;put(box,mats.stone,q.x,.018,z,q.w,.035,q.d/4-.10);}
 for(const s of [-1,1]){put(rock,mats.moss,s*5.7,.35,-25,.75,.40,.65);for(let i=0;i<3;i++)put(rock,mats.canopy,s*(5.2+r()*1.25),.43+r()*.13,-25.6+r()*.8,.65,.5,.62);}
 return batchStatic(THREE,group,root);
}
export function buildGuardian({THREE,group,at,mats,piece,box,sphere,cyl}){
 const [x,z,yaw]=at,root=new THREE.Group();root.position.set(x,0,z);root.rotation.y=yaw;group.add(root);
 const E=(m,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0)=>piece(root,sphere,m,x,y,z,sx,sy,sz,rx,ry,rz);
 const B=(m,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0)=>piece(root,box,m,x,y,z,sx,sy,sz,rx,ry,rz);
 piece(root,cyl,mats.dark,0,.20,0,3.05,.40,2.45,0,Math.PI/8);
 piece(root,cyl,mats.stone,0,.51,0,2.82,.22,2.23,0,Math.PI/8);
 E(mats.sculpt,0,1.60,-.25,1.73,1.32,1.65);
 E(mats.sculpt,0,2.74,.42,2.10,1.05,1.33);
 E(mats.sculptLight,0,2.28,1.00,1.94,.52,.83);
 E(mats.sculptLight,0,1.53,1.08,1.03,.96,.65);
 for(const s of [-1,1]){
  E(mats.sculpt,s*1.20,3.39,.47,.76,.73,.75);
  E(mats.dark,s*1.20,3.37,1.12,.47,.24,.17,0,0,s*-.10);
  E(mats.sculptLight,s*1.20,3.59,1.03,.57,.16,.29,0,0,s*-.12);
  E(mats.trim,s*1.20,3.39,1.25,.25,.075,.06);
  E(mats.dark,s*.32,2.83,1.61,.12,.09,.10);
  E(mats.sculpt,s*1.74,1.26,-.24,1.11,.91,1.39,0,s*.32,0);
  E(mats.sculptLight,s*1.75,.77,.83,.85,.27,1.02);
  E(mats.sculpt,s*.83,1.25,1.21,.45,.79,.49,0,0,s*.15);
  for(let j=0;j<4;j++)E(mats.sculptLight,s*.83+(j-1.5)*.22,.74,1.67,.15,.12,.36,0,(j-1.5)*.10);
  E(mats.moss,s*2.22,.64,.65,.47,.10,.53);
  E(mats.moss,s*1.64,1.77,-.82,.48,.18,.43);
 }
 for(let i=0;i<7;i++){const a=(i-3)/3;B(mats.dark,a*1.56,2.26-.065*a*a,1.73-.40*a*a,.48,.055,.075,0,-a*.40,0);}
 return batchStatic(THREE,group,root);
}
