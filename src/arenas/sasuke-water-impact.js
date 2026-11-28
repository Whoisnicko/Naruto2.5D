import {END_VALLEY as A,rng,flowMeshData} from './sasuke-valley-data.js?v=6g6';
export function createConnectedWaterfall({THREE,group,falls,w,fallMap,mistMap,piece,boxGeo,rockGeo,cliff,shadow,moss}){
 const r=rng(6606),flow=flowMeshData();
 // Bed under river, no stone cap across the water.
 piece(falls,boxGeo,cliff,0,5.82,-11.4,w.width+1.1,11.64,21.3);
 piece(falls,boxGeo,shadow,0,5.72,-.48,w.width+.5,11.44,.65);
 for(const sign of [-1,1])for(let i=0;i<6;i++){const z=-2.6-i*3.6,x=sign*(w.width*.5+1.3+r()*.5);piece(falls,rockGeo,i%3===0?moss:cliff,x,11.35+r()*.5,z,1.45+r()*.65,1.0+r()*.75,2.15,0,r()*6.28);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(flow.positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(flow.uvs,2));geo.setAttribute('color',new THREE.Float32BufferAttribute(flow.colors,3));geo.setIndex(flow.indices);geo.computeVertexNormals();
 piece(falls,geo,new THREE.MeshBasicMaterial({color:fallMap?'#ffffff':'#b3dce2',map:fallMap,vertexColors:true,side:THREE.DoubleSide}),0,0,0,1,1,1);
 const impact=new THREE.Group();impact.name='waterfall-impact';group.add(impact);impact.position.set(w.x,0,w.impactZ);
 const circle=new THREE.CircleGeometry(1,40);circle.rotateX(-Math.PI/2);
 const foamMat=new THREE.MeshBasicMaterial({color:'#e7faf7',map:mistMap||null,transparent:true,opacity:mistMap ? .88 : .33,depthWrite:false,side:THREE.DoubleSide});
 const broad=piece(impact,circle,foamMat,0,.065,.48,w.width*.60,1,2.8);broad.renderOrder=-5;
 const ring=new THREE.RingGeometry(.72,1,40);ring.rotateX(-Math.PI/2);const ripples=[];
 for(let i=0;i<A.impact.foamCount;i++){const m=new THREE.MeshBasicMaterial({color:i%3?'#e4fcf9':'#9cdbdf',transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}),x=(r()-.5)*w.width*.98,phase=r(),size=.45+r()*.85,o=piece(impact,ring,m,x,.08+i*.001,.35,1,1,1);o.renderOrder=-4;ripples.push({o,x,phase,size});}
 const plumes=[];
 if(mistMap){const plane=new THREE.PlaneGeometry(1,1);for(let i=0;i<A.impact.plumeCount;i++){const x=(i/(A.impact.plumeCount-1)-.5)*w.width,m=new THREE.MeshBasicMaterial({color:'#e9fcfa',map:mistMap,transparent:true,opacity:.6,depthWrite:false,side:THREE.DoubleSide}),o=piece(impact,plane,m,x,.65,.28,3.6,2.2,1,-.20);o.renderOrder=-3;plumes.push({o,x,phase:r()*6.28});}}
 const n=A.impact.jetCount,positions=new Float32Array(n*3),seeds=Array.from({length:n},()=>[(r()-.5)*w.width,r(),.65+r()*1.85,.7+r()*2.7,(r()-.5)*.9]);
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
 const points=new THREE.Points(pg,new THREE.PointsMaterial({color:'#eaffff',size:.19,transparent:true,opacity:.78,depthWrite:false}));points.renderOrder=-2;points.frustumCulled=false;impact.add(points);
 function update(t){
  broad.scale.z=2.8+.28*Math.sin(t*2.9);foamMat.opacity=(mistMap ? .80 : .31)+.06*Math.sin(t*2.1);
  for(const f of ripples){const u=(f.phase+t*.73)%1,k=f.size*(.48+u*1.65);f.o.position.z=.12+u*2.8;f.o.scale.set(k,1,k*.55);f.o.material.opacity=.86*(1-u)**.65;}
  for(const f of plumes){f.o.position.x=f.x+.24*Math.sin(t*1.9+f.phase);f.o.position.y=.65+.27*Math.sin(t*1.4+f.phase);f.o.scale.set(3.4+.5*Math.sin(t*1.3+f.phase),2.2+.38*Math.cos(t*1.6+f.phase),1);}
  for(let i=0;i<n;i++){const [x,phase,height,d,side]=seeds[i],u=(phase+t*(.68+(i%5)*.055))%1,j=i*3;positions[j]=x+side*u;positions[j+1]=.075+4*u*(1-u)*height;positions[j+2]=.14+u*d;}
  pg.attributes.position.needsUpdate=true;
 }
 update(0);return {update};
}
