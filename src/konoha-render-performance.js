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
