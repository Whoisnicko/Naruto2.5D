import {END_VALLEY as A} from './sasuke-valley-data.js?v=6g6';
// Cosmetic only. Positions provided in arena-local coordinates; no game state mutation.
export function groundedContact(a,radius=A.radius,airLimit=A.waterChakra.airLimit){
 return !!a&&Number.isFinite(a.x)&&Number.isFinite(a.z)&&Math.hypot(a.x,a.z)<=radius+.05&&!a.fallen&&!(a.hp<=0)&&Math.abs(a.air||0)<=airLimit;
}
export function advanceFoot(state,a,enabled=true){
 if(!enabled||!groundedContact(a)){state.valid=false;state.carry=0;return null;}
 if(!state.valid){state.valid=true;state.x=a.x;state.z=a.z;state.carry=0;return null;}
 const dx=a.x-state.x,dz=a.z-state.z,d=Math.hypot(dx,dz);state.x=a.x;state.z=a.z;
 if(d>A.waterChakra.teleport){state.carry=0;return null;}
 state.carry+=d;if(d<.0001||state.carry<A.waterChakra.step)return null;
 state.carry%=A.waterChakra.step;state.side=-(state.side||1);
 return {x:a.x-dz/d*state.side*.15,z:a.z+dx/d*state.side*.15};
}
export function createWaterChakra({THREE,group}){
 const cfg=A.waterChakra,fx=new THREE.Group();fx.name='sasuke-water-chakra';group.add(fx);
 const ring=new THREE.RingGeometry(.76,1,40);ring.rotateX(-Math.PI/2);
 const disc=new THREE.CircleGeometry(1,40);disc.rotateX(-Math.PI/2);
 let haloMap=null;
 try{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),d=g.createRadialGradient(32,32,1,32,32,31);d.addColorStop(0,'rgba(255,255,255,1)');d.addColorStop(.26,'rgba(111,241,255,.95)');d.addColorStop(.56,'rgba(0,155,255,.58)');d.addColorStop(1,'rgba(0,90,255,0)');g.fillStyle=d;g.fillRect(0,0,64,64);haloMap=new THREE.CanvasTexture(c);haloMap.colorSpace=THREE.SRGBColorSpace;}catch{}
 function make(geo,color,order,map=null,additive=true){const m=new THREE.MeshBasicMaterial({color,map,transparent:true,opacity:0,depthWrite:false,depthTest:true,side:THREE.DoubleSide,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending,toneMapped:false});const o=new THREE.Mesh(geo,m);o.visible=false;o.renderOrder=order;fx.add(o);return o;}
 const pool=Array.from({length:cfg.slots},()=>({age:Infinity,outer:make(ring,'#20bfff',3),core:make(disc,'#dcffff',3,null,false),halo:make(disc,haloMap?'#ffffff':'#29baff',2,haloMap)}));
 const auras=[make(disc,haloMap?'#ffffff':'#25c8ff',2,haloMap),make(disc,haloMap?'#ffffff':'#25c8ff',2,haloMap)],states=[{},{}];
 const positions=new Float32Array(pool.length*cfg.particles*3),pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
 const drops=new THREE.Points(pg,new THREE.PointsMaterial({color:'#77eeff',size:.18,transparent:true,opacity:.97,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,toneMapped:false}));drops.renderOrder=4;drops.frustumCulled=false;fx.add(drops);
 let cursor=0,last=null;
 function reset(){last=null;cursor=0;for(const s of states){s.valid=false;s.carry=0;}for(const f of pool){f.age=Infinity;f.outer.visible=f.core.visible=f.halo.visible=false;}for(const o of auras)o.visible=false;drops.visible=false;positions.fill(-999);pg.attributes.position.needsUpdate=true;}
 function update(t,actors=[],enabled=true){
  if(!enabled){if(last!==null)reset();return;}
  const dt=last===null?0:Math.max(0,Math.min(.10,t-last));last=t;
  for(let i=0;i<2;i++){
   const a=actors[i],ground=groundedContact(a),o=auras[i],hit=advanceFoot(states[i],a,true);
   o.visible=ground;if(ground){o.position.set(a.x,.091,a.z);const k=cfg.glowRadius+.08*Math.sin(t*10+i*2);o.scale.set(k,1,k);o.material.opacity=(haloMap ? .72 : .28)+.08*Math.sin(t*8+i);}
   if(hit){const f=pool[cursor++%pool.length];f.x=hit.x;f.z=hit.z;f.age=0;}
  }
  let count=0;
  for(let i=0;i<pool.length;i++){const f=pool[i];f.age+=dt;const live=f.age<cfg.life;f.outer.visible=f.core.visible=f.halo.visible=live;
   if(live){const u=f.age/cfg.life,k=.38+u*1.30;f.outer.position.set(f.x,.105,f.z);f.outer.scale.set(k,1,k);f.outer.material.opacity=.96*(1-u)**.75;
    f.core.position.set(f.x,.117,f.z);const c=.27+.24*u;f.core.scale.set(c,1,c);f.core.material.opacity=.92*(1-u)**3;
    f.halo.position.set(f.x,.098,f.z);const h=.58+u*.66;f.halo.scale.set(h,1,h);f.halo.material.opacity=(haloMap?1:.34)*(1-u)**1.3;count++;}
   for(let j=0;j<cfg.particles;j++){const p=(i*cfg.particles+j)*3;if(!live){positions[p]=positions[p+1]=positions[p+2]=-999;continue;}const u=f.age/cfg.life,a=j*Math.PI*2/cfg.particles+i*.63,rad=.12+u*(.78+.11*(j%3));positions[p]=f.x+Math.cos(a)*rad;positions[p+1]=.10+4*u*(1-u)*(.42+.21*(j%3));positions[p+2]=f.z+Math.sin(a)*rad;}
  }
  drops.visible=count>0;pg.attributes.position.needsUpdate=true;
 }
 reset();return {update,reset};
}
