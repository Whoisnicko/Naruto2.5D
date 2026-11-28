import {rng} from './sasuke-valley-data.js?v=6g7';
// Terraced cliff mesh: bounded angular irregularity, flat normals, height-aware
// color and UVs. Multiple seeded variants use the same original stone texture.
export function rockMeshData(seed=167){
 const r=rng(seed),sides=12,levels=[-.95,-.62,-.43,-.09,.08,.39,.54,.82,1],radii=[.81,.98,.91,.97,.84,.85,.70,.61,.38],pos=[],uv=[],colors=[],index=[],angles=Array.from({length:sides},(_,i)=>(i+(r()-.5)*.31)*2*Math.PI/sides),faces=Array.from({length:sides},()=>.86+r()*.14);
 const shade=[.55,.69,.52,.84,.65,.92,.73,.93,.97];
 for(let j=0;j<levels.length;j++)for(let i=0;i<=sides;i++){
  const k=i%sides,a=angles[k],rad=radii[j]*faces[k]*(.94+.06*Math.sin(k*2.1+j*1.9)),y=levels[j]+.035*Math.sin(k*2.7+j*.8),v=shade[j]*(.89+.11*Math.cos(k*.8+j*.7));
  pos.push(Math.cos(a)*rad,y,Math.sin(a)*rad);uv.push(i/sides*2,(levels[j]+1)/2);colors.push(v*.99,v,v*.96);
 }
 for(let j=0;j<levels.length-1;j++)for(let i=0;i<sides;i++){const a=j*(sides+1)+i,b=a+sides+1;index.push(a,b,a+1,a+1,b,b+1);}
 for(let j=1;j<sides-1;j++){const a=(levels.length-1)*(sides+1);index.push(a,a+j+1,a+j);index.push(0,j,j+1);}
 return {pos,uv,colors,index};
}
export function stratifiedRock(THREE,seed){
 const d=rockMeshData(seed),g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.Float32BufferAttribute(d.pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(d.uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(d.colors,3));g.setIndex(d.index);
 const flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();return flat;
}
export function rockSurfaceArt(){
 const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const r=rng(671);
 g.fillStyle='#b7b9ad';g.fillRect(0,0,1024,1024);
 // Large fractured slabs with shadow seams and one-sided light edges.
 for(let row=-1;row<11;row++){let x=-160-r()*130,y=row*115-18;while(x<1100){const w=90+r()*210,h=72+r()*65,offset=(r()-.5)*28;
  const pts=[[x,y+offset],[x+w*.76,y-15+offset],[x+w,y+22+offset],[x+w*.93,y+h],[x+w*.23,y+h+11],[x-12,y+h*.57]];
  g.beginPath();pts.forEach(([px,py],i)=>i?g.lineTo(px,py):g.moveTo(px,py));g.closePath();const v=143+Math.floor(r()*49);g.fillStyle='rgb('+v+','+(v+3)+','+(v-9)+')';g.fill();g.strokeStyle='rgba(38,45,43,.45)';g.lineWidth=3+r()*4;g.stroke();
  g.beginPath();g.moveTo(...pts[0]);g.lineTo(...pts[1]);g.lineTo(...pts[2]);g.strokeStyle='rgba(245,239,212,.45)';g.lineWidth=2+r()*3;g.stroke();x+=w*.96;
 }}
 for(let i=0;i<180;i++){let x=r()*1024,y=r()*1024;g.beginPath();g.moveTo(x,y);for(let j=0;j<4;j++){x+=(r()-.5)*30;y+=6+r()*18;g.lineTo(x,y);}g.strokeStyle='rgba(45,54,51,.32)';g.lineWidth=.7+r()*1.5;g.stroke();}
 for(let i=0;i<19000;i++){g.fillStyle=i%3?'rgba(38,52,48,.10)':'rgba(249,240,216,.22)';g.fillRect(r()*1024,r()*1024,.7+r()*2.4,.6+r()*2.7);}
 return c;
}
