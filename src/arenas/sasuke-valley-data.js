// Environmental artwork only. All combat rules remain in boss-data.js.
export const END_VALLEY=Object.freeze({
 id:'sasuke-valley-of-the-end',radius:16,floor:94,
 palette:{water:'#497c89',deep:'#244954',foam:'#d8eeea',stone:'#89928b',shadow:'#536362',light:'#adb4a8',cliff:'#526467',moss:'#586c58'},
 // From the downstream camera: Madara left, Hashirama right; both face inward.
 statues:[{id:'madara',x:-14.8,z:-16.8,yaw:1.02},{id:'hashirama',x:14.8,z:-16.8,yaw:-1.02}],
 statueExtent:5.9,
 statueArt:{width:8.25,height:11,baseY:1.48,columns:2},
 waterChakra:{step:.46,teleport:3.4,life:.56,slots:24,airLimit:.12},
 waterfall:{x:0,z:-18.0,width:15,height:12},
 cliffs:[[-27,-19,7,13],[-20,-27,8,15],[-7,-27,7,14],[7,-27,7,14],[20,-27,8,15],[27,-19,7,13],[-30,-4,7,9],[30,-4,7,9]],
 spray:144
});
export function rng(seed=1701){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export function outsideArena(x,z,extent=0){return Math.hypot(x,z)-extent>END_VALLEY.radius;}
export function waveAt(x,z,t){return Math.sin(x*.9+z*.43-t*1.7)*.5+Math.sin(x*.28-z*.95+t*.9)*.32+Math.sin(x*.14+z*.21-t*.7)*.18;}

// Orthographic framing for the ordinary fight. No change to movement/collision.
// Keep combatants inside a conservative safe rectangle while including the waterfall.
// On portrait screens prioritize combat over the two full statues.
export function valleyCamera(arena,hero,boss,aspect){
 const a=Math.max(.1,Number(aspect)||1),clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v)),p=hero||arena,b=boss?.hp>0?boss:p;
 const px=p.x-arena.x,pz=p.z-arena.z,bx=b.x-arena.x,bz=b.z-arena.z;
 const x=clamp((px+bx)*.5,-10,10)*.9;
 const z=clamp((pz+bz)*.34-4.0,-8,3);
 const lookY=2.65,half=Math.max(12,9/a);
 const maxX=Math.max(Math.abs(px-x),Math.abs(bx-x))+2.2;
 const angle=Math.atan2(57-lookY,120),s=Math.sin(angle),c=Math.cos(angle);
 const maxY=Math.max(...[pz,bz].flatMap(v=>[0,3].map(y=>Math.abs((y-lookY)*c-(v-z)*s))))+1.2;
 const zoom=Math.max(.28,Math.min(.80,half*a/maxX,half*.82/maxY));
 return {x:arena.x+x,z:arena.z+z,lookY,zoom,height:57};
}
