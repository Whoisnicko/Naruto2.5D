// 7A.1 reference-derived plaza art. Visual data only; no collision or navigation changes.
export const REFERENCE_ART=Object.freeze({
 'cherry-reference':'cherry-wide',
 'stone-lantern':'lamp-post',
 'leaf-monument':'rocks-flat',
 'plaza-reference':'plaza-tiles'
});
// Retain the approved tree anchors. Alternate the original curved cherry until a second
// dedicated illustration is available. Fallbacks use the original size/illustration.
export const PLAZA_CHERRIES=Object.freeze([
 {x:56,z:33,w:7.8,original:'cherry-wide'},
 {x:88,z:33,w:7.1,original:'cherry-curved'},
 {x:57,z:49,w:7.2,original:'cherry-wide'},
 {x:88,z:49,w:7.0,original:'cherry-curved'}
]);
export const PLAZA_PROPS=Object.freeze([
 ['leaf-monument',85.8,37.0,3.0],
 ['stone-lantern',62.5,32.5,1.15],
 ['stone-lantern',81.5,32.5,1.15],
 ['stone-lantern',61.5,49.8,1.10],
 ['stone-lantern',82.5,49.8,1.10]
]);
// Low, non-interactive foliage arranged in clumps. Only place it on valid garden ground.
export const PLAZA_GARDENS=Object.freeze([
 [59.5,30.1,2.4,1.65],[84.8,30.4,2.8,1.75],
 [58.4,49.5,2.7,1.6],[85.8,49.8,2.5,1.55],
 [85.8,37,2.1,1.15],[60.1,37.1,1.7,1.1],
 [53.7,36.4,2.0,1.25],[90.2,35.7,2.1,1.2]
]);
export function roadDistance(x,z,roads){let closest=Infinity;for(const r of roads){for(let i=1;i<r.points.length;i++){const [ax,az]=r.points[i-1],[bx,bz]=r.points[i],dx=bx-ax,dz=bz-az,n=dx*dx+dz*dz;if(!n)continue;const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/n));closest=Math.min(closest,Math.hypot(x-ax-dx*t,z-az-dz*t)-r.w/2);}}return closest;}
export function gardenClear(x,z,r,blocked,roads){return !blocked(x,z,r)&&roadDistance(x,z,roads)>r+.15;}
// Preserve the original artwork as a per-resource fallback, not a broken rectangle.
export function referenceName(textures,name){return textures[name]?name:REFERENCE_ART[name]||name;}
