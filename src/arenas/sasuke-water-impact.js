import {END_VALLEY as A,rng,flowMeshData} from './sasuke-valley-data.js?v=6g9';
import {impactTexture} from './sasuke-impact-art.js?v=6g7';
export function createConnectedWaterfall({THREE,group,falls,w,fallMap,mistMap,piece,boxGeo,rockGeo,cliff,shadow,moss,cliffGeo,rockDetail,rockShade,failures}){
 const r=rng(6606),flow=flowMeshData();let strength=1;
 // Bed under river, no stone cap across the water.
 piece(falls,boxGeo,cliff,0,5.82,-11.4,w.width+1.1,11.64,21.3);
 piece(falls,boxGeo,shadow,0,5.72,-.48,w.width+.5,11.44,.65);
 for(const sign of [-1,1])for(let i=0;i<6;i++){const z=-2.6-i*3.6,x=sign*(w.width*.5+1.3+r()*.5);piece(falls,i%3===0?rockGeo:cliffGeo[i%3],i%3===0?moss:rockDetail,x,11.35+r()*.5,z,1.45+r()*.65,1.0+r()*.75,2.15,0,r()*6.28);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(flow.positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(flow.uvs,2));geo.setAttribute('color',new THREE.Float32BufferAttribute(flow.colors,3));geo.setIndex(flow.indices);geo.computeVertexNormals();
 piece(falls,geo,new THREE.MeshBasicMaterial({color:fallMap?'#ffffff':'#b3dce2',map:fallMap,vertexColors:true,side:THREE.DoubleSide}),0,0,0,1,1,1);
 // Rock-facing buttresses, keep the continuous upper river and curtain clear.
 for(const sign of [-1,1])for(let j=0;j<3;j++)piece(falls,cliffGeo[j],j%2?rockShade:rockDetail,sign*(w.width*.5+1.1),2+j*3.1,-.95,1.30,2.15,1.25,0,sign*.18);
 const impact=new THREE.Group();impact.name='waterfall-impact';group.add(impact);impact.position.set(w.x,0,w.impactZ);
 const circle=new THREE.CircleGeometry(1,40);circle.rotateX(-Math.PI/2);
 function art(kind,seed){try{const t=new THREE.CanvasTexture(impactTexture(kind,seed));t.colorSpace=THREE.SRGBColorSpace;return t;}catch{failures.push(kind+' impact texture');return mistMap||null;}}
 const foamMap=art('foam',677),vaporMap=art('mist',678);
 const foamMat=new THREE.MeshBasicMaterial({color:'#efffff',map:foamMap,transparent:true,opacity:.86,depthWrite:false,side:THREE.DoubleSide});
 const broad=piece(impact,circle,foamMat,0,.065,.48,w.width*.68,1,3.3);broad.renderOrder=-5;
 const ripples=[];for(let i=0;i<A.impact.foamCount;i++){const m=new THREE.MeshBasicMaterial({color:'#eafffb',map:foamMap,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}),x=(r()-.5)*w.width*.98,phase=r(),size=.65+r()*1.15,o=piece(impact,circle,m,x,.08+i*.001,.35,1,1,1);o.rotation.y=r()*6.28;o.renderOrder=-4;ripples.push({o,x,phase,size});}
 const plumes=[];if(vaporMap){const plane=new THREE.PlaneGeometry(1,1);for(let i=0;i<A.impact.plumeCount;i++){const layer=i%3,x=(Math.floor(i/3)/(A.impact.plumeCount/3-1)-.5)*w.width,m=new THREE.MeshBasicMaterial({color:'#e9fcfa',map:vaporMap,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}),o=piece(impact,plane,m,x,.65,.28+layer*.9,3.6,2.2,1,-.20,layer*.22);o.renderOrder=-3;plumes.push({o,x,layer,phase:r(),drift:(r()-.5)*.9});}}
 const n=A.impact.jetCount,positions=new Float32Array(n*3),seeds=Array.from({length:n},()=>[(r()-.5)*w.width,r(),1.0+r()*2.35,.7+r()*2.9,(r()-.5)*.9]);
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
 const points=new THREE.Points(pg,new THREE.PointsMaterial({color:'#eaffff',map:vaporMap,size:.17,transparent:true,opacity:.83,depthWrite:false}));points.renderOrder=-2;points.frustumCulled=false;impact.add(points);
 function update(t){
  broad.scale.z=(3.3+.22*Math.sin(t*2.9))*strength;foamMat.opacity=Math.min(1,(foamMap?.97:.34)*strength+.025*Math.sin(t*2.1));
  for(const f of ripples){const u=(f.phase+t*.65)%1,k=f.size*(.65+u*.75);f.o.position.z=.10+u*3.2;f.o.position.x=f.x+.35*Math.sin(u*3+f.phase*6.28);f.o.scale.set(k,1,k*.58);f.o.material.opacity=Math.min(1,(foamMap?1:.28)*strength*Math.sin(Math.PI*u)**.48);}
  for(const f of plumes){const u=(f.phase+t*(.49-f.layer*.075))%1;f.o.position.x=f.x+f.drift*u;f.o.position.y=.38+u*(1.75+f.layer*.82)*strength;f.o.position.z=.28+f.layer*.68+u*.9;f.o.scale.set(3.15+u*2.15,1.8+u*2.1,1);f.o.material.opacity=Math.min(1,(.98-f.layer*.13)*strength*Math.sin(Math.PI*u)**.60);}
  for(let i=0;i<n;i++){const [x,phase,height,d,side]=seeds[i],u=(phase+t*(.68+(i%5)*.055))%1,j=i*3;positions[j]=x+side*u;positions[j+1]=.075+4*u*(1-u)*height;positions[j+2]=.14+u*d;}
  pg.attributes.position.needsUpdate=true;
 }
 update(0);return {update,setStrength(value){strength=Math.max(1,Math.min(1.16,Number(value)||1));}};
}
