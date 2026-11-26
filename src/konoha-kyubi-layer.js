// Approved aura/tails behind each actor, using shared 64px directional textures.
// No gameplay or map data. One mesh per active transformed actor, pooled by owner id.
export function createKyubiLayers({THREE,scene,place,vfx,canvasFactory=()=>document.createElement('canvas')}){
 const size=4.8,anchor=51/64,slots=new Map(),frames=new Map();
 let geometry=null;const errors=new Set();
 function frame(dir,t){
  let o=frames.get(dir);if(!o){const canvas=canvasFactory();canvas.width=canvas.height=64;
   const ctx=canvas.getContext('2d');if(!ctx)throw Error('Aura canvas unavailable');
   const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
   o={canvas,ctx,tex,key:''};frames.set(dir,o);}
  const key=Math.floor(t*13)%8+':'+vfx.loaded().includes('aura');if(key!==o.key){o.ctx.clearRect(0,0,64,64);vfx.aura(o.ctx,[32,51,64/size],dir,t,0);o.tex.needsUpdate=true;o.key=key;}return o.tex;
 }
 function sync(owners,t){
  for(const o of slots.values())o.visible=false;
  const active=new Set();
  for(const {id,x,z,dir,actor} of owners){
   if(!actor?.visible||!Number.isFinite(x)||!Number.isFinite(z)||!Number.isInteger(dir)||dir<0||dir>3)continue;
   try{const tex=frame(dir,t);let m=slots.get(id);if(!m){geometry??=new THREE.PlaneGeometry(size,size);m=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false,toneMapped:false}));m.visible=false;m.name='kyubi-aura-'+id;scene.add(m);slots.set(id,m);}
    if(m.material.map!==tex){m.material.map=tex;m.material.needsUpdate=true;}
    m.renderOrder=actor.renderOrder-.25;place(m,x,z,size*(2*anchor-1),.05);m.visible=true;active.add(id);
   }catch(e){if(!errors.has(id)){errors.add(id);console.warn('Kyubi aura fallback',e);}}
  }
  // Reuse current clone slots; discard disappeared owners to bound storage.
  for(const [id,m] of slots)if(!active.has(id)&&id!=='hero'){scene.remove(m);m.material.dispose();slots.delete(id);}
  return active;
 }
 function fallbackEntries(){return [...slots.values()].filter(m=>m.visible).map(m=>({m,w:size,h:size,kind:'kyubiAura'}));}
 return {sync,fallbackEntries};
}
