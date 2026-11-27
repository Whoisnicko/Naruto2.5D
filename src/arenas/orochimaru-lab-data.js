// Presentation only. Combat radius and phases remain owned by boss-data.js.
export const ORO_LAB=Object.freeze({
 id:'orochimaru-underground-lab',radius:13,floor:38,
 palette:{floor:'#595462',grout:'#3d3945',stone:'#45414d',trim:'#83788b',iron:'#34313b',brass:'#8d765d',glass:'#527c74',fluid:'#85ae92',violet:'#9977b6',paper:'#bcad8a',wood:'#625042',wax:'#e6bc7a'},
 tanks:[[-13,-15],[13,-15],[-17,-7],[17,-7]],
 shelves:[[-17,3],[17,3]],tables:[[-13,12.5],[13,12.5]],
 pillars:[[-17,-17],[17,-17],[-7,-17],[7,-17],[-17,9],[17,9]],
 lamps:[[-10,-16],[0,-16],[10,-16],[-17,0],[17,0]],
 gate:{x:0,z:-18},motes:64
});
export function seededLab(seed=651){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export function labPropsClear(spec=ORO_LAB){return [...spec.tanks,...spec.shelves,...spec.tables,...spec.pillars,...spec.lamps].every(([x,z])=>Math.hypot(x,z)-2.6>spec.radius);}
