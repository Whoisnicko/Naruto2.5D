// Environmental data only. Jiraiya encounter and training rules remain in boss-data.js.
export const TOAD_GROUNDS=Object.freeze({
 id:'jiraiya-toad-sage-grounds',radius:15,floor:82,
 palette:{grass:'#788966',earth:'#9c9e79',stone:'#859082',dark:'#506558',moss:'#647b52',water:'#497b76',wood:'#87534b',trim:'#c7ac78',leaves:'#75994e',flower:'#e6b2ac'},
 ponds:[[-23,4,4.6,4.0],[23,4,4.6,4.0]],
 guardians:[[-12,-16,.35],[12,-16,-.35]],
 lanterns:[[-17,8],[17,8]],
 gate:[0,-20],trees:[[-33,-9],[-33,19],[-30,24],[30,24],[33,19],[33,-9]],
 shrine:{x:0,z:-28,w:11,d:5.4,roofW:14.2,roofD:7.5,roofH:2.1},
 approach:{x:0,z:-17.5,w:4.6,d:3.3},
 guardianExtent:3.9,pondRim:.65,
 motes:64
});
export function rng(seed=682){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export function clearDecor(x,z,extent){return Math.hypot(x,z)-extent>TOAD_GROUNDS.radius;}

export function shrineClear(s=TOAD_GROUNDS.shrine){return Math.hypot(s.x,s.z)-Math.hypot(s.roofW/2,s.roofD/2)>TOAD_GROUNDS.radius;}
export function approachClear(q=TOAD_GROUNDS.approach){return q.z+q.d/2 < -TOAD_GROUNDS.radius;}
