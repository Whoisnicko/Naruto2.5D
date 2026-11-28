// 6F.3 — anime-inspired meadow and peripheral bone forest. Visual only.
export const BONE_VALLEY=Object.freeze({
 id:'kimimaro-bone-valley',radius:15,floor:88,dust:72,
 palette:{ground:'#a2b46a',grass:'#75984b',sand:'#c4b17e',rock:'#777b62',bone:'#f3eedc',aged:'#a6b6b6',ash:'#dfd8bc'},
 treeBands:[[-34,-22],[-25,-32],[-13,-35],[0,-36],[13,-35],[25,-32],[34,-22],[-37,-7],[37,-7],[-36,12],[36,12]],
 boneBands:[{count:38,min:19.4,max:25.6,h0:3.2,h1:8.8},{count:52,min:26,max:32.8,h0:4.5,h1:11.0}],
});
export function rng(seed=761){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export function clearDecor(x,z,bound){return Math.hypot(x,z)-bound>BONE_VALLEY.radius;}
export function boneForestLayout(){
 const r=rng(603),out=[];
 for(const band of BONE_VALLEY.boneBands)for(let i=0;i<band.count;i++){
  const a=i*Math.PI*2/band.count+(r()-.5)*.075,d=band.min+r()*(band.max-band.min),x=Math.cos(a)*d,z=Math.sin(a)*d;
  // Keep front and side foreground short to preserve sprites and attack telegraphs.
  const h=(band.h0+r()*(band.h1-band.h0))*(z>5?.30:z>0?.56:1),w=.28+r()*.45,yaw=r()*6.283,lean=.30+r()*.72;
  const bound=w*1.2+lean;
  if(clearDecor(x,z,bound))out.push({x,z,h,w,yaw,lean,bound});
 }
 return out;
}
export function treeLayout(){
 const r=rng(153),out=[];
 for(const [x,z] of BONE_VALLEY.treeBands)for(let i=0;i<4;i++){
  const px=x+(r()-.5)*6,pz=z+(r()-.5)*5,h=4.5+r()*3.8,w=1.8+r()*1.1;
  if(clearDecor(px,pz,w*1.8))out.push({x:px,z:pz,h,w,yaw:r()*6.283});
 }
 return out;
}
export function forestVisible(phase){return Number(phase)>=3;}
