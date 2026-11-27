// Environmental data only. Jiraiya encounter and training rules remain in boss-data.js.
export const TOAD_GROUNDS=Object.freeze({
 id:'jiraiya-toad-sage-grounds',radius:15,floor:82,
 palette:{grass:'#788966',earth:'#9c9e79',stone:'#859082',dark:'#506558',moss:'#647b52',water:'#497b76',wood:'#87534b',trim:'#c7ac78',leaves:'#75994e',flower:'#e6b2ac'},
 ponds:[[-21,3,5.1,4.6],[21,2,5.2,4.5],[-14,-19,4.2,3.5],[14,-19,4.2,3.5]],
 guardians:[[-12,-16,.35],[12,-16,-.35]],
 lanterns:[[-17,-8],[17,-8],[-17,8],[17,8],[-6,-19],[6,-19]],
 gate:[0,-20],trees:[[-24,-15],[-28,-5],[-24,13],[-15,-26],[-5,-27],[5,-27],[15,-26],[24,-15],[28,-5],[24,13]],
 motes:64
});
export function rng(seed=682){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export function clearDecor(x,z,extent){return Math.hypot(x,z)-extent>TOAD_GROUNDS.radius;}
