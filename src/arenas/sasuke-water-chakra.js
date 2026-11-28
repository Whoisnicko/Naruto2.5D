import {END_VALLEY as A} from './sasuke-valley-data.js?v=6g5';
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
 const fx=new THREE.Group();fx.name='sasuke-water-chakra';group.add(fx);
 const ring=new THREE.RingGeometry(.81,1,32);ring.rotateX(-Math.PI/2);
 const inner=new THREE.RingGeometry(.48,1,24);inner.rotateX(-Math.PI/2);
 const make=(geo,color)=>{const m=new THREE.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});const o=new THREE.Mesh(geo,m);o.visible=false;o.renderOrder=-4;fx.add(o);return o;};
 const pool=Array.from({length:A.waterChakra.slots},()=>({age:Infinity,outer:make(ring,'#72d9ff'),core:make(inner,'#baf3ff')}));
 const auras=[make(inner,'#50caff'),make(inner,'#50caff')],states=[{},{}];
 // One fixed point buffer for six droplets per contact, no new allocations of GPU resources per step.
 const positions=new Float32Array(pool.length*6*3),pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
 const drops=new THREE.Points(pg,new THREE.PointsMaterial({color:'#8fe8ff',size:.075,transparent:true,opacity:.67,depthWrite:false,blending:THREE.AdditiveBlending}));drops.renderOrder=-3;drops.frustumCulled=false;fx.add(drops);
 let cursor=0,last=null;
 function reset(){last=null;cursor=0;for(const s of states){s.valid=false;s.carry=0;}for(const f of pool){f.age=Infinity;f.outer.visible=f.core.visible=false;}for(const o of auras)o.visible=false;drops.visible=false;positions.fill(-999);pg.attributes.position.needsUpdate=true;}
 function update(t,actors=[],enabled=true){
  const dt=last===null?0:Math.max(0,Math.min(.10,t-last));last=t;
  for(let i=0;i<2;i++){
   const a=actors[i],ground=enabled&&groundedContact(a),o=auras[i],hit=advanceFoot(states[i],a,enabled);
   o.visible=ground;if(ground){o.position.set(a.x,.043,a.z);const k=.18+.035*Math.sin(t*10+i*2);o.scale.set(k,1,k);o.material.opacity=.20+.045*Math.sin(t*8+i);}
   if(hit){const f=pool[cursor++%pool.length];f.x=hit.x;f.z=hit.z;f.age=0;}
  }
  let count=0;
  for(let i=0;i<pool.length;i++){const f=pool[i];f.age+=dt;const live=enabled&&f.age<A.waterChakra.life;f.outer.visible=f.core.visible=live;
   if(live){const u=f.age/A.waterChakra.life,k=.20+u*.91;f.outer.position.set(f.x,.037,f.z);f.outer.scale.set(k,1,k);f.outer.material.opacity=.68*(1-u);f.core.position.set(f.x,.046,f.z);f.core.scale.set(.22+u*.30,1,.22+u*.30);f.core.material.opacity=.47*(1-u)**2;count++;}
   for(let j=0;j<6;j++){const p=(i*6+j)*3;if(!live){positions[p]=positions[p+1]=positions[p+2]=-999;continue;}const u=f.age/A.waterChakra.life,a=j*Math.PI/3+i*.63,rad=.09+u*.43;positions[p]=f.x+Math.cos(a)*rad;positions[p+1]=.05+Math.sin(Math.PI*u)*(.18+.12*(j%2));positions[p+2]=f.z+Math.sin(a)*rad;}
  }
  drops.visible=count>0;pg.attributes.position.needsUpdate=true;
 }
 reset();return {update,reset};
}
