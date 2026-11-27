// Environmental artwork only. All combat rules remain in boss-data.js.
export const END_VALLEY=Object.freeze({
 id:'sasuke-valley-of-the-end',radius:16,floor:94,
 palette:{water:'#497c89',deep:'#244954',foam:'#d8eeea',stone:'#89928b',shadow:'#536362',light:'#adb4a8',cliff:'#526467',moss:'#586c58'},
 statues:[{id:'hashirama',x:-14.4,z:-23,yaw:.48},{id:'madara',x:14.4,z:-23,yaw:-.48}],
 waterfall:{x:0,z:-24,width:14,height:13},
 cliffs:[[-32,-24,8,14],[-22,-32,8,17],[-7,-34,8,16],[7,-34,8,17],[22,-32,8,17],[32,-24,8,14],[-34,-7,7,10],[34,-7,7,10]],
 spray:96
});
export function rng(seed=1701){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export function outsideArena(x,z,extent=0){return Math.hypot(x,z)-extent>END_VALLEY.radius;}
export function waveAt(x,z,t){return Math.sin(x*.9+z*.43-t*1.7)*.5+Math.sin(x*.28-z*.95+t*.9)*.32+Math.sin(x*.14+z*.21-t*.7)*.18;}
