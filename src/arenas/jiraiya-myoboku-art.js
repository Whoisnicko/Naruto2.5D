import {MYOBOKU as A} from './jiraiya-myoboku-data.js?v=6h3';
import {batchStatic} from './jiraiya-sanctuary-art.js?v=6h2';
// Reference-led native 3D scenery. No series screenshots are embedded.
export function createOilTexture(THREE,rng){
 const c=document.createElement('canvas');c.width=128;c.height=256;const g=c.getContext('2d');if(!g)throw Error('oil canvas unavailable');
 const r=rng(603),gr=g.createLinearGradient(0,0,128,0);gr.addColorStop(0,'#ad7624');gr.addColorStop(.18,'#e6b84d');gr.addColorStop(.46,'#f2d477');gr.addColorStop(.71,'#d7a13c');gr.addColorStop(1,'#b47e28');g.fillStyle=gr;g.fillRect(0,0,128,256);
 for(let i=0;i<150;i++){g.fillStyle=i%3===0?'rgba(255,238,168,.27)':'rgba(126,83,25,.12)';let x=r()*128,y=r()*256,w=.5+r()*3,h=12+r()*95;g.fillRect(x,y,w,h);if(y+h>256)g.fillRect(x,y-256,w,h);}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapT=THREE.RepeatWrapping;return t;
}
function leafGeometry(THREE){
 const vertices=[],colors=[],indices=[],n=12;
 for(let i=0;i<=n;i++){const t=i/n,w=Math.sin(Math.PI*t)**.72;
  for(let j=0;j<3;j++){const side=j-1;vertices.push(side*w*.47,.20*Math.sin(Math.PI*t)-Math.abs(side)*.10*w,t-.5);
   const c=new THREE.Color(j===1?'#a8be65':j===0?'#507d44':'#6d9a4b');colors.push(c.r,c.g,c.b);}
 }
 for(let i=0;i<n;i++)for(let j=0;j<2;j++){const a=i*3+j,b=a+3;indices.push(a,b,a+1,a+1,b,b+1);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();return geo;
}
export function buildMyoboku({THREE,group,mats,piece,box,sphere,rock,cyl,rng,failures}){
 const root=new THREE.Group();group.add(root);const r=rng(631),o=A.oil;
 const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.91,...extra});
 const M={sand:material('#c8ad70'),cliff:material('#a78d57'),cliffLight:material('#bfa16a'),seam:material('#776b47'),moss:material('#658442'),darkMoss:material('#4c6b3a'),oil:material('#c79737',{roughness:.28,metalness:.05}),stone:material('#69756b',{map:mats.sculpt.map||null}),stoneLight:material('#899185',{map:mats.sculpt.map||null}),carve:material('#46534b'),stem:material('#56763f'),cap:material('#aa674d'),gills:material('#e2cda2'),leaf:material('#ffffff',{vertexColors:true,side:THREE.DoubleSide})};
 const put=(geo,m,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0)=>piece(root,geo,m,x,y,z,sx,sy,sz,rx,ry,rz);
 const disc=new THREE.CircleGeometry(1,64);disc.rotateX(-Math.PI/2);
 // Layered, weathered sandstone formations with moss shelves and visible vertical fissures.
 for(const [x,z,w,h,d] of A.cliff){
  put(rock,M.cliff,x,h*.44,z,w,h*.58,d,0,r()*.35);
  put(rock,M.cliffLight,x-w*.31,h*.47,z+d*.41,w*.57,h*.53,d*.70,0,.22);
  put(rock,M.sand,x+w*.32,h*.42,z+d*.38,w*.54,h*.48,d*.69,0,-.25);
  for(let j=0;j<4;j++){const px=x-w*.69+j*w*.43;put(rock,j%2?M.seam:M.cliffLight,px,h*.40,z+d*.75,.14+r()*.20,h*(.32+r()*.12),.15,0,0,(r()-.5)*.12);}
  put(rock,M.moss,x,h*.96,z,w*.92,1.05,d*.96,0,r());
  for(let j=0;j<4;j++)put(rock,M.darkMoss,x+(r()-.5)*w*1.5,h*.85-r()*1.25,z+d*.64,.48+r()*.52,.3+r()*.8,.45,0,r());
 }
 // Golden sacred oil pool, with irregular stone edging; not a traversable surface.
 put(disc,M.seam,o.x,.011,o.z,o.rx+.32,1,o.rz+.30);
 put(disc,M.oil,o.x,.025,o.z,o.rx,1,o.rz);
 for(let i=0;i<26;i++){const a=i*Math.PI*2/26,sz=.24+r()*.34;put(rock,i%4?M.sand:M.moss,Math.cos(a)*(o.rx+.16),.16,o.z+Math.sin(a)*(o.rz+.16),sz,.17+r()*.17,sz*.8,0,r()*6.28);}
 // The waterfall is a gently curved ribbon with a separately scrolling texture.
 let map=null;try{map=createOilTexture(THREE,rng);}catch{failures.push('sacred oil texture');}
 const fallGeo=new THREE.BufferGeometry(),v=[],uv=[],idx=[];
 for(let i=0;i<=8;i++){const t=i/8,w=o.fallW*(.50+.10*t);for(let j=0;j<=4;j++){const u=j/4;v.push((u*2-1)*w,o.fallH*(1-t)+.22,o.fallZ+.48*t*t+.10*Math.sin(u*Math.PI));uv.push(u,1-t);} }
 for(let i=0;i<8;i++)for(let j=0;j<4;j++){const a=i*5+j,b=a+5;idx.push(a,b,a+1,a+1,b,b+1);}
 fallGeo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));fallGeo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));fallGeo.setIndex(idx);fallGeo.computeVertexNormals();
 const fall=new THREE.Mesh(fallGeo,material(map?'#fff1c0':'#e3b94d',{map,side:THREE.DoubleSide,roughness:.34}));group.add(fall);
 const ring=new THREE.RingGeometry(.95,1,48);ring.rotateX(-Math.PI/2);const rings=[];
 for(let i=0;i<3;i++){let m=new THREE.MeshBasicMaterial({color:'#ffe5a4',transparent:true,opacity:.4,depthWrite:false,side:THREE.DoubleSide});let mesh=piece(group,ring,m,0,.048,o.fallZ+.8,1,1,.56);rings.push(mesh);}
 // Petrified meditating toads: closed eyelids, hands together, wide haunches.
 const S=(x,z,scale,yaw)=>{
  const sub=new THREE.Group();sub.position.set(x,0,z);sub.rotation.y=yaw;sub.scale.setScalar(scale);root.add(sub);
  const E=(m,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0)=>piece(sub,sphere,m,x,y,z,sx,sy,sz,rx,ry,rz);
  piece(sub,rock,M.carve,0,.16,0,2.4,.23,1.74);
  E(M.stone,0,1.48,-.16,1.44,1.32,1.21);E(M.stone,0,2.55,.37,1.80,1.19,1.25);E(M.stoneLight,0,2.03,1.10,1.59,.53,.66);E(M.stoneLight,0,1.19,.81,.98,.80,.62);
  for(const s of [-1,1]){
   E(M.stone,s*1.14,3.12,.55,.62,.63,.63);E(M.carve,s*1.14,3.11,1.09,.46,.085,.14,0,0,-s*.11);E(M.stoneLight,s*1.14,3.23,1.04,.51,.18,.20,0,0,-s*.11);
   E(M.carve,s*.23,2.64,1.57,.075,.066,.07);
   E(M.stone,s*1.61,.87,-.15,.95,.76,1.08,0,s*.35);E(M.stoneLight,s*1.55,.36,.77,.77,.22,.90);
   E(M.stone,s*1.00,1.52,.88,.35,.72,.37,0,0,s*.33);E(M.stoneLight,s*.57,1.37,1.28,.66,.28,.33,0,0,-s*.36);
   E(M.stoneLight,s*.17,1.69,1.48,.16,.43,.20,0,0,-s*.08);
   for(let j=0;j<3;j++)E(M.stoneLight,s*1.38+(j-1)*.24,.29,1.39,.16,.13,.31);
   E(M.moss,s*1.45,.67,-.55,.46,.19,.40);
  }
  for(let j=0;j<9;j++){const t=(j-4)/4;E(M.carve,t*1.28,2.05+.11*t*t,1.66-.40*t*t,.20,.035,.062);}
 };
 for(const at of A.statues)S(...at);
 // Huge broad leaves with pointed tips, center ribs and variable silhouettes.
 const leaf=leafGeometry(THREE);
 for(const [x,z,h,w,yaw] of A.plants){
  put(cyl,M.stem,x,h*.45,z,.18,h*.9,.18,0,0,.05);
  for(let j=0;j<3;j++){const a=yaw+j*2.08,dx=Math.sin(a)*w*.30,dz=Math.cos(a)*w*.30;put(leaf,M.leaf,x+dx,h-j*.50,z+dz,w,h*.35,w*1.65,.17,a,(j-1)*.17);}
 }
 for(const [x,z,s] of A.mushrooms){put(cyl,M.gills,x,.65*s,z,.22*s,1.3*s,.22*s);put(sphere,M.cap,x,1.25*s,z,1.35*s,.55*s,1.24*s);put(sphere,M.gills,x,1.06*s,z,1.19*s,.18*s,1.07*s);}
 // Needle-rock silhouettes recalling the balance training from the anime.
 for(const [x,z,h,w] of A.spires){put(cyl,M.cliff,x,h*.5,z,w,h,w,0,.25);put(rock,M.moss,x,h,z,w*.78,.30,w*.78);}
 const batches=batchStatic(THREE,group,root);
 return {batches,update(t){if(map)map.offset.y=(t*.32)%1;for(let i=0;i<rings.length;i++){const a=(t*.55+i/3)%1,s=.4+a*2.05;rings[i].scale.set(s,1,s*.55);rings[i].material.opacity=.5*(1-a);}}};
}
