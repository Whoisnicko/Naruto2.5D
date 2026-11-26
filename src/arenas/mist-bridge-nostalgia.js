// Art only. These placements never enter the movement or combat collision model.
export const BRIDGE_NOSTALGIA=Object.freeze({
 mist:[
  {x:-8,z:-9,w:13,d:5.8,opacity:.65,dx:2.1,dz:.9},
  {x:7,z:-7,w:14,d:6.5,opacity:.62,dx:1.9,dz:1.1},
  {x:-2,z:-4,w:16,d:5.5,opacity:.48,dx:2.2,dz:.8},
  {x:3,z:2,w:13,d:6.2,opacity:.48,dx:2,dz:1.2},
  {x:-7,z:7,w:14,d:5.7,opacity:.62,dx:1.6,dz:1},
  {x:7,z:10,w:13,d:6.3,opacity:.65,dx:1.8,dz:1.3},
  {x:-2,z:-20,w:18,d:7,opacity:.62,dx:2.1,dz:1},
  {x:2,z:21,w:18,d:7.5,opacity:.66,dx:2,dz:1},
  {x:0,z:29,w:23,d:8,opacity:.68,dx:1.8,dz:1}
 ],
 work:[
  {x:-13.25,z:-6.7,type:'timber'},
  {x:13.25,z:7.8,type:'crates'},
  {x:-13.2,z:22.5,type:'crates'},
  {x:13.2,z:-23,type:'timber'},
  {x:-10.4,z:-30,type:'bench'},
  {x:10.4,z:30,type:'bench'}
 ],
 palette:{wood:'#826c50',light:'#ae9772',dark:'#51483b',iron:'#59686a',rope:'#aa966c',cloth:'#746b59'}
});
export function mistPose(spec,t,i){
 const time=Number.isFinite(t)?t:0,phase=i*1.83;
 return {x:spec.x+Math.sin(time*.18+phase)*spec.dx,z:spec.z+Math.sin(time*.11+phase*1.3)*spec.dz,opacity:spec.opacity*(.85+.15*Math.sin(time*.22+phase))};
}
// Thin mist on the deck is drawn before the sprites and after the solid terrain.
// Work details use one instanced draw per shape/color group, not a draw per board.
export function createBridgeNostalgia({THREE,group,mistTexture}){
 const D=BRIDGE_NOSTALGIA,P=D.palette,batches=new Map(),mist=[];
 function block(x,y,z,w,h,d,color){const key=color;if(!batches.has(key))batches.set(key,[]);batches.get(key).push({x,y,z,w,h,d});}
 for(const a of D.work){
  const {x,z,type}=a;
  if(type==='timber'){
   for(let i=0;i<3;i++)for(let level=0;level<2;level++)block(x+(i-1)*.32,.09+level*.13,z,.29,.12,2.55-(i%2)*.18,level?P.light:P.wood);
   for(const k of [-.9,.9])block(x,.35,z+k,1.06,.035,.14,P.dark);
   for(const k of [-.96,.96])block(x,.035,z+k,1.12,.065,.18,P.dark);
  }else if(type==='crates'){
   for(const k of [-.57,.57]){
    block(x,.30,z+k,.78,.60,.85,P.wood);block(x,.62,z+k,.81,.06,.88,P.light);
    for(const dx of [-.31,.31])block(x+dx,.33,z+k,.11,.66,.92,P.dark);
    for(const dz of [-.38,.38])block(x,.32,z+k+dz,.84,.09,.08,P.light);
   }
   block(x,.70,z-.57,.54,.13,.54,P.cloth);
  }else{
   block(x,.76,z,1.35,.16,.73,P.light);for(const dx of [-.54,.54])for(const dz of [-.25,.25])block(x+dx,.35,z+dz,.12,.7,.12,P.dark);
   block(x-.28,.90,z,.48,.11,.27,P.wood);block(x+.26,.88,z,.10,.08,.56,P.iron);block(x+.37,.89,z+.18,.34,.08,.13,P.wood);
   block(x,.15,z,1.12,.08,.49,P.wood);
  }
 }
 const matrix=new THREE.Matrix4(),pos=new THREE.Vector3(),scale=new THREE.Vector3(),rot=new THREE.Quaternion();
 for(const [color,boxes] of batches){
  const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color,roughness:.97}),boxes.length);
  mesh.name='bridge-construction-detail';
  boxes.forEach((b,i)=>{pos.set(b.x,b.y,b.z);scale.set(b.w,b.h,b.d);matrix.compose(pos,rot,scale);mesh.setMatrixAt(i,matrix);});
  mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);
 }
 // A soft generated mist texture is optional. If unavailable, skip the effect; never block play.
 if(mistTexture)for(const [i,s] of D.mist.entries()){
  const g=new THREE.PlaneGeometry(s.w,s.d);g.rotateX(-Math.PI/2);
  const mesh=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:mistTexture,transparent:true,depthWrite:false,depthTest:true,fog:false,opacity:s.opacity}));
  mesh.name='deck-mist';mesh.position.set(s.x,.055+i*.001,s.z);mesh.renderOrder=1;group.add(mesh);mist.push({mesh,s,i});
 }
 let enabled=true;
 return {setVisible(value){enabled=!!value;for(const o of mist)o.mesh.visible=enabled;},update(t){for(const o of mist){const p=mistPose(o.s,t,o.i);o.mesh.position.x=p.x;o.mesh.position.z=p.z;o.mesh.material.opacity=p.opacity;}},count:mist.length,instanceCount:[...batches.values()].reduce((n,a)=>n+a.length,0)};
}
