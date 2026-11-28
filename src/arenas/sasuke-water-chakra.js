import {END_VALLEY as A} from './sasuke-valley-data.js?v=6g7';
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
// A tapered, crooked upright flame silhouette; not an expanding ripple.
export function flameMeshData(){
 const pos=[],idx=[],uv=[],rows=[[0,.24,0],[.14,.30,-.08],[.34,.19,.07],[.57,.13,-.065],[.78,.065,.11],[1,.008,.16]];
 for(let i=0;i<rows.length;i++){const [y,w,b]=rows[i];pos.push(b-w,y,0,b+w,y,0);uv.push(0,y,1,y);if(i){const j=i*2;idx.push(j-2,j-1,j,j-1,j+1,j);}}return {pos,idx,uv};
}
export function createWaterChakra({THREE,group}){
 const cfg=A.waterChakra,fx=new THREE.Group();fx.name='sasuke-water-chakra';group.add(fx);
 const disc=new THREE.CircleGeometry(1,32);disc.rotateX(-Math.PI/2);
 const fd=flameMeshData(),flame=new THREE.BufferGeometry();flame.setAttribute('position',new THREE.Float32BufferAttribute(fd.pos,3));flame.setAttribute('uv',new THREE.Float32BufferAttribute(fd.uv,2));flame.setIndex(fd.idx);flame.computeVertexNormals();
 let haloMap=null;try{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),d=g.createRadialGradient(32,32,1,32,32,31);d.addColorStop(0,'rgba(255,255,255,1)');d.addColorStop(.32,'rgba(102,239,255,.9)');d.addColorStop(1,'rgba(0,90,255,0)');g.fillStyle=d;g.fillRect(0,0,64,64);haloMap=new THREE.CanvasTexture(c);haloMap.colorSpace=THREE.SRGBColorSpace;}catch{}
 function make(geo,color,order,map=null,additive=true){const m=new THREE.MeshBasicMaterial({color,map,transparent:true,opacity:0,depthWrite:false,depthTest:true,side:THREE.DoubleSide,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending,toneMapped:false});const o=new THREE.Mesh(geo,m);o.visible=false;o.renderOrder=order;fx.add(o);return o;}
 const pool=Array.from({length:cfg.slots},()=>({age:Infinity,halo:make(disc,haloMap?'#ffffff':'#25bcff',2,haloMap),flame:[make(flame,'#11aaff',3),make(flame,'#5ee9ff',3),make(flame,'#d8ffff',4,null,false)]}));
 const auras=[make(disc,haloMap?'#ffffff':'#25c8ff',2,haloMap),make(disc,haloMap?'#ffffff':'#25c8ff',2,haloMap)],states=[{},{}];
 const positions=new Float32Array(pool.length*cfg.particles*3),pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
 const sparks=new THREE.Points(pg,new THREE.PointsMaterial({color:'#7cefff',size:.13,transparent:true,opacity:.98,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,toneMapped:false}));sparks.renderOrder=5;sparks.frustumCulled=false;fx.add(sparks);
 let cursor=0,last=null;
 function hide(f){f.halo.visible=false;for(const o of f.flame)o.visible=false;}
 function reset(){last=null;cursor=0;for(const s of states){s.valid=false;s.carry=0;}for(const f of pool){f.age=Infinity;hide(f);}for(const o of auras)o.visible=false;sparks.visible=false;positions.fill(-999);pg.attributes.position.needsUpdate=true;}
 function update(t,actors=[],enabled=true){
  if(!enabled){if(last!==null)reset();return;}const dt=last===null?0:Math.max(0,Math.min(.10,t-last));last=t;
  for(let i=0;i<2;i++){const a=actors[i],ground=groundedContact(a),o=auras[i],hit=advanceFoot(states[i],a,true);o.visible=ground;
   if(ground){o.position.set(a.x,.091,a.z);const k=cfg.glowRadius+.035*Math.sin(t*20+i);o.scale.set(k,1,k);o.material.opacity=(haloMap ? .63 : .22)+.09*Math.sin(t*17+i);}
   if(hit){const f=pool[cursor++%pool.length];f.x=hit.x;f.z=hit.z;f.age=0;}
  }
  let count=0;
  for(let i=0;i<pool.length;i++){const f=pool[i];f.age+=dt;const live=f.age<cfg.life;
   if(live){const u=f.age/cfg.life,fade=(1-u)**1.1,grow=.65+.55*Math.sin(u*Math.PI*.85);f.halo.visible=true;f.halo.position.set(f.x,.105,f.z);f.halo.scale.set(.42-.10*u,1,.42-.10*u);f.halo.material.opacity=(haloMap?1:.3)*fade;
    for(let j=0;j<3;j++){const o=f.flame[j],core=j===2,k=core?.55:1;o.visible=true;o.position.set(f.x+(j===0?-.055:j===1?.055:0),.09+u*.12,f.z);o.rotation.y=i*.77+j*Math.PI*.48+Math.sin(t*23+j)*.16;o.scale.set(k*(.90-.33*u),cfg.flameHeight*grow*(core?.63:1),1);o.material.opacity=(core?.92:.95)*fade;}
    count++;
   }else hide(f);
   for(let j=0;j<cfg.particles;j++){const p=(i*cfg.particles+j)*3;if(!live){positions[p]=positions[p+1]=positions[p+2]=-999;continue;}const u=f.age/cfg.life,a=j*2.399+i*.63,rad=.08+u*.18;positions[p]=f.x+Math.cos(a)*rad;positions[p+1]=.13+u*(.62+.27*(j%3));positions[p+2]=f.z+Math.sin(a)*rad;}
  }sparks.visible=count>0;pg.attributes.position.needsUpdate=true;
 }
 reset();return {update,reset};
}
