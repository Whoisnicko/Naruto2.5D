// Art only; boss-data.js owns encounters and movement limits.
export const BONE_VALLEY=Object.freeze({
 id:'kimimaro-bone-valley',radius:15,floor:88,
 palette:{ground:'#515b59',rock:'#353e46',slate:'#485259',bone:'#ddd7c3',aged:'#a5a79a',dark:'#6a726e',ash:'#b8c2c5'},
 ribs:[[-22,-12,0.5,8],[-25,-2,0.3,10],[-22,10,-.4,7],[22,-13,-.4,8],[25,-1,-.3,10],[22,11,.4,7],[-11,-24,.9,6],[11,-24,-.9,6]],
 cliffs:[[-34,-14,7,10],[-26,-31,8,12],[-6,-36,10,12],[14,-34,9,10],[33,-20,8,9],[34,5,7,8],[-35,13,6,8]],
 dust:72
});
export function rng(seed=761){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export function ribPath(x,z,yaw,h){const points=[];for(let i=0;i<=8;i++){const t=i/8,shift=3.3*t*t;points.push([x+Math.cos(yaw)*shift,h*(1.5*t-.5*t*t),z+Math.sin(yaw)*shift]);}return points;}
export function clearDecor(x,z,bound){return Math.hypot(x,z)-bound>BONE_VALLEY.radius;}
