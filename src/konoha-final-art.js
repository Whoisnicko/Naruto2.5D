// 7A.6 — curated facade approaches and district detail, visual data only.
export const FRONTAGE_STYLE=Object.freeze({
 house:{width:.55,maxWidth:5.2,depth:1.35,edge:'#b7a68c',fill:'#eee0ca',repeat:2.8},
 shop:{width:.94,maxWidth:8,depth:1.8,edge:'#b7a18a',fill:'#ebd6b7',repeat:3},
 ramen:{width:.88,maxWidth:8.5,depth:1.2,edge:'#b6a18a',fill:'#ead8bc',repeat:3}
});
// Small fixtures in residential and commercial areas. Roads, NPC paths and existing
// decor are screened at assembly; never install interactive objects or colliders.
export const DISTRICT_FIXTURES=Object.freeze([
 ['lamp-post',12.1,28.4,1.2],['flowers-pink',16.8,28.4,1.2],
 ['bush-medium',23.4,30.1,1.25],['barrel-large',28.8,29.7,.92],
 ['lamp-post',10.8,43-5.2,1.15],['flowers-pink',15.5,43+5.2,1.2],
 ['lamp-post',12,57.5,1.15],['bush-medium',17,58,1.25],
 ['flowers-pink',24.5,58.7,1.15],['barrel-large',28.7,59.5,.92],
 ['lamp-post',45.2,62.7,1.15],['bush-medium',60.5,63,1.15],
 ['barrel-large',84,61.2,.95],['barrel-large',100.8,61.4,.95],
 ['flowers-pink',81.5,65.7,1.15],['bush-medium',103.5,64.8,1.2],
 ['lamp-post',110.8,59.5,1.15],['flowers-pink',116,59.8,1.2],
 ['bush-medium',126,60.2,1.2],['lamp-post',131.5,60.5,1.15],
 ['flowers-pink',111,74.4,1.15],['bush-medium',115.5,75.4,1.2]
]);
// Reserve clear approach to all six villagers and the supply chest vicinity.
export const NPC_CLEARANCE=Object.freeze([[68,43,4],[77,47,4],[97,30,4],[85,75,4],[92,63,4],[47,31,4]]);
export function frontagePlans(buildings,blocked,roadDistance,roads){
 const plans=[];
 for(const b of buildings){
  const t=FRONTAGE_STYLE[b.kind];if(!t)continue;
  const x=b.x+b.w/2,w=Math.min(t.maxWidth,b.w*t.width),front=b.y+b.d;
  // Start just outside the collision footprint; shrink shallow spaces rather than
  // paint through another house, wall, river or the existing street.
  for(const d of [t.depth,t.depth*.75,t.depth*.5]){
   const z=front+.12+d/2;
   const valid=[-1,0,1].every(dx=>[-1,0,1].every(dz=>{
    const px=x+dx*w/2,pz=z+dz*d/2;
    return !blocked(px,pz,.05)&&roadDistance(px,pz,roads)>=.12;
   }));
   if(valid){plans.push({id:b.id,x,z,w,d,edge:t.edge,fill:t.fill,repeat:t.repeat});break;}
  }
 }
 return plans;
}
export function districtFixtures(blocked,gardenClear,roads,decor,trees,frontages){
 const result=[];
 for(const item of DISTRICT_FIXTURES){
  const [name,x,z,w]=item,r=Math.max(.40,w*.36);
  if(!gardenClear(x,z,r,blocked,roads))continue;
  if(NPC_CLEARANCE.some(([a,b,d])=>Math.hypot(x-a,z-b)<d))continue;
  if(decor.some(([n,a,b,s])=>Math.hypot(x-a,z-b)<r+Math.min(2,s*.4)))continue;
  if(trees.some(t=>Math.hypot(x-t.x,z-t.y)<r+t.r))continue;
  if(frontages.some(q=>Math.abs(x-q.x)<q.w/2+r&&Math.abs(z-q.z)<q.d/2+r))continue;
  if(result.some(([n,a,b,s])=>Math.hypot(x-a,z-b)<r+s*.36))continue;
  result.push(item);
 }
 return result;
}
