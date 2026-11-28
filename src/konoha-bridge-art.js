// 7A.5 — World-aligned civic bridges. Visual only; river.bridges remains collision authority.
export const BRIDGE_STYLES=Object.freeze([
 {id:'north',kind:'wood',base:'#76513c',planks:['#b78050','#c38c59','#b98754'],rail:'#865435',cap:'#d3a16a'},
 {id:'central',kind:'stone',base:'#9e8c74',planks:[],rail:'#bba486',cap:'#e2cbb0'},
 {id:'south',kind:'wood',base:'#79523c',planks:['#b07a4e','#c18b58','#b98755'],rail:'#8a5838',cap:'#d6a36c'}
]);
export const RIVER_ACCENTS=Object.freeze([
 ['rocks-flat',31.8,30.4,1.45],['bush-medium',39.8,32.3,1.2],
 ['flowers-pink',31.9,53.4,1.1],['rocks-flat',39.8,55.4,1.4],
 ['bush-medium',32,73.3,1.25],['flowers-pink',39.7,72.2,1.05]
]);
export function bridgePlans(river){
 const x=river.x+river.w/2,span=river.w+2.2;
 return river.bridges.map((b,i)=>{
  const style=BRIDGE_STYLES[i]||BRIDGE_STYLES[0],half=b.w/2,outer=half+.25,railZ=half+.12;
  const pieces=[],boards=[];
  const box=(role,color,x,z,w,d,y,h)=>pieces.push({role,color,x,z,w,d,y,h});
  // Post positions are outside the collision-authorized crossing, with a low profile.
  for(const sign of [-1,1]){
   const z=b.y+sign*railZ;
   box('rail',style.rail,x,z,span,.15,.09,.39);
   box('rail-cap',style.cap,x,z,span,.22,.48,.10);
   for(const dx of [-span/2+.14,-span/4,0,span/4,span/2-.14]){
    box('post',style.rail,x+dx,z,.22,.22,.09,.55);
    box('post-cap',style.cap,x+dx,z,.27,.27,.64,.09);
   }
  }
  // Each board is a flat strip perpendicular to east-west travel, rather than a billboard.
  if(style.kind==='wood'){
   const count=14,step=span/count;
   for(let n=0;n<count;n++)boards.push({color:style.planks[n%style.planks.length],x:x-span/2+(n+.5)*step,z:b.y,w:step-.028,d:b.w,y:.092});
  }
  return {id:style.id,kind:style.kind,x,z:b.y,span,width:b.w,outerWidth:2*outer,base:style.base,pieces,boards};
 });
}
// Merge each color into one static mesh. No textures are required for wood/rails.
// Coordinates are local to the mesh's fixed ground height to preserve fallback ordering.
export function bridgeGeometry(parts,baseY=0){
 const groups=new Map();
 for(const p of parts){
  let g=groups.get(p.color);if(!g){g={color:p.color,positions:[],indices:[]};groups.set(p.color,g);}
  const x0=p.x-p.w/2,x1=p.x+p.w/2,z0=p.z-p.d/2,z1=p.z+p.d/2,y0=p.y-baseY,y1=y0+(p.h||0),v=g.positions.length/3;
  if(!p.h){g.positions.push(x0,y0,z0,x0,y0,z1,x1,y0,z1,x1,y0,z0);g.indices.push(v,v+1,v+2,v,v+2,v+3);}
  else {g.positions.push(x0,y0,z0,x1,y0,z0,x1,y0,z1,x0,y0,z1,x0,y1,z0,x1,y1,z0,x1,y1,z1,x0,y1,z1);
   for(const face of [[4,7,6,5],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[0,3,2,1]])g.indices.push(v+face[0],v+face[1],v+face[2],v+face[0],v+face[2],v+face[3]);
  }
 }
 return [...groups.values()];
}
