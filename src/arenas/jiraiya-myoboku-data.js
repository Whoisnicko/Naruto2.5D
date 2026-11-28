// 6H.3 visual-only adaptation of the Mount Myoboku senjutsu training site.
export const MYOBOKU=Object.freeze({
 radius:15,
 oil:{x:0,z:-21.7,rx:4.3,rz:3.0,fallZ:-24.3,fallW:3.3,fallH:8.1},
 cliff:[[-13,-28,4.5,10.6,3.6],[-7,-28.3,3.8,11.8,3.5],[0,-29.5,4.7,10.4,3.6],[7,-28.5,3.9,12.0,3.6],[13,-28,4.5,10.5,3.6]],
 statues:[[-9.3,-17.9,1.12,.18], [9.3,-17.9,1.12,-.18],[-15.4,-18.7,.84,.35],[15.4,-18.7,.84,-.35],[-18,-13.7,.68,.5],[18,-13.7,.68,-.5],[-19.5,-8.8,.58,.55],[19.5,-8.8,.58,-.55]],
 plants:[[-25,-13,5.7,3.3,.4],[25,-13,6.1,3.5,-.4],[-28,10,5.1,2.8,1.2],[28,10,5.4,3.0,-1.2],[-18,-29,7.0,3.6,.65],[18,-29,7.1,3.7,-.65]],
 mushrooms:[[-23,-7,1.2],[-24.6,-9.4,.78],[23,-7,1.2],[24.6,-9.4,.76],[-25,15,1.1],[25,15,1.0]],
 spires:[[-15,-34,4.8,1.35],[15,-34,5.1,1.35],[-23,-32,6.9,1.6],[23,-32,6.6,1.6]]
});
export function myobokuVolumes(A=MYOBOKU){
 const o=A.oil;
 return [
 {id:'oil pool',x:o.x,z:o.z,r:Math.max(o.rx,o.rz)+.6},
 {id:'oil waterfall',x:o.x,z:o.fallZ,r:o.fallW/2+.6},
 ...A.cliff.map(([x,z,w,h,d],i)=>({id:'cliff '+i,x,z,r:Math.hypot(w,d)+.7})),
 ...A.statues.map(([x,z,s],i)=>({id:'statue '+i,x,z,r:3.35*s})),
 ...A.plants.map(([x,z,h,w],i)=>({id:'plant '+i,x,z,r:w*1.4})),
 ...A.mushrooms.map(([x,z,s],i)=>({id:'mushroom '+i,x,z,r:1.7*s})),
 ...A.spires.map(([x,z,h,w],i)=>({id:'spire '+i,x,z,r:w*1.4}))
 ];
}
