// Render-only utilities. No game state, input, collision or map construction.
export function createFrameDiagnostics(){
 let start=0,count=0,totals={},last={};return {add(name,ms){totals[name]=(totals[name]||0)+Math.max(0,ms);},frame(now){if(!start)start=now;count++;if(now-start>=1000){last=Object.fromEntries(Object.entries(totals).map(([k,v])=>[k,v/count]));totals={};count=0;start=now;}},report:()=>({...last})};
}
export function createBillboardPlacer(camera,up){
 const cache=new WeakMap();
 return (m,x,z,h,offset=0)=>{const q=camera.quaternion,old=cache.get(m);
  if(old&&old.x===x&&old.z===z&&old.h===h&&old.offset===offset&&Math.abs(old.qx-q.x)<1e-10&&Math.abs(old.qy-q.y)<1e-10&&Math.abs(old.qz-q.z)<1e-10&&Math.abs(old.qw-q.w)<1e-10)return false;
  m.quaternion.copy(q);m.position.set(x,offset,z).addScaledVector(up,h/2);m.updateMatrix();m.matrixAutoUpdate=false;cache.set(m,{x,z,h,offset,qx:q.x,qy:q.y,qz:q.z,qw:q.w});return true;};
}
export function estimateArtBytes(textures){let bytes=0;for(const {tex} of Object.values(textures)){const i=tex?.image;if(i?.width&&i?.height)bytes+=i.width*i.height*4;}return bytes;}
export function fieldPreset(preset){return {...preset,fpsLimit:'unlimited'};}
export function createCadence(hz){let next=0;return {due(now){if(now+.25<next)return false;next=next&&now-next<1000/hz*2?next+1000/hz:now+1000/hz;return true;},reset(){next=0;}};}

// WebGL-only batching of opaque terrain with identical material and render order.
// Original meshes remain available and the approved map data is never modified.
export function createGroundBatches(THREE,scene){
 const byRegion=new Map();let current=null,enabled=true;
 function capture(id,meshes){
  const groups=new Map(),result=[];
  for(const mesh of meshes){const g=mesh.geometry,m=mesh.material;if(!g?.attributes.position||!g.attributes.uv||Array.isArray(m)||m.transparent||m.depthWrite===false||m.depthTest===false||mesh.name==='konoha-plaza-medallion')continue;
   const key=m.uuid+':'+mesh.renderOrder;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(mesh);}
  for(const originals of groups.values()){
   if(originals.length<2)continue;
   const positions=[],uvs=[],indices=[],v=new THREE.Vector3();let offset=0;
   for(const mesh of originals){mesh.updateMatrix();const g=mesh.geometry,pos=g.attributes.position,uv=g.attributes.uv;
    for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i).applyMatrix4(mesh.matrix);positions.push(v.x,v.y,v.z);uvs.push(uv.getX(i),uv.getY(i));}
    if(g.index)for(let i=0;i<g.index.count;i++)indices.push(offset+g.index.getX(i));else for(let i=0;i<pos.count;i++)indices.push(offset+i);
    offset+=pos.count;}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeBoundingSphere();
   const batch=new THREE.Mesh(g,originals[0].material);batch.name='terrain-batch-'+id;batch.renderOrder=originals[0].renderOrder;batch.matrixAutoUpdate=false;batch.updateMatrix();batch.visible=false;scene.add(batch);result.push({originals,batch});}
  byRegion.set(id,result);
 }
 function show(id){current=id;for(const [region,groups] of byRegion)for(const {batch,originals} of groups){const active=region===id;batch.visible=active&&enabled;for(const m of originals)m.visible=active&&!enabled;}}
 function setEnabled(v){enabled=!!v;if(current!==null)show(current);}
 function stats(){const g=byRegion.get(current)||[];return {enabled,groups:g.length,sourceMeshes:g.reduce((n,x)=>n+x.originals.length,0),maxSaved:g.reduce((n,x)=>n+x.originals.length-1,0)};}
 return {capture,show,setEnabled,stats};
}
