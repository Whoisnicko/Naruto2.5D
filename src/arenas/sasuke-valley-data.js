// Environmental artwork only. All combat rules remain in boss-data.js.
export const END_VALLEY=Object.freeze({
 id:'sasuke-valley-of-the-end',radius:16,floor:94,
 palette:{water:'#497c89',deep:'#244954',foam:'#d8eeea',stone:'#89928b',shadow:'#536362',light:'#adb4a8',cliff:'#526467',moss:'#586c58'},
 // From the downstream camera: Madara left, Hashirama right; both face inward.
 statues:[{id:'madara',x:-14.8,z:-16.8,yaw:1.02},{id:'hashirama',x:14.8,z:-16.8,yaw:-1.02}],
 statueExtent:5.9,
 statueArt:{width:8.25,height:11,baseY:1.48,columns:2},
 waterChakra:{step:.46,teleport:3.4,life:.26,slots:24,airLimit:.12,particles:10,glowRadius:.38,flameHeight:.72},
 waterfall:{x:0,z:-18.0,width:15,height:12,sourceZ:-40,impactZ:-16.65},
 flowProfile:[[12.38,-22,1.12,0],[12.28,-16,1.06,.32],[12.20,-10,1.04,.66],[12.16,-4,1.0,.98],[12.08,-.85,1.0,1.16],[11.92,-.12,1.0,1.20],[11.45,.27,1.0,1.24],[10.2,.38,1.0,1.32],[8.3,.46,1.015,1.45],[6.0,.48,1.025,1.60],[3.5,.60,1.04,1.77],[1.5,.85,1.06,1.91],[.48,1.12,1.09,1.99],[.07,1.35,1.12,2.04]],
 impact:{foamCount:40,jetCount:216,plumeCount:24},
 cliffs:[[-27,-19,7,13],[-20,-27,8,15],[-14.5,-29,5.2,13.6],[14.5,-29,5.2,13.6],[20,-27,8,15],[27,-19,7,13],[-30,-4,7,9],[30,-4,7,9]],
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

// Continuous upstream-to-basin surface; UV v follows water downstream.
export function flowMeshData(A=END_VALLEY){
 const cols=32,positions=[],uvs=[],colors=[],indices=[],w=A.waterfall;
 for(let i=0;i<A.flowProfile.length;i++){
  const [y,z,width,v]=A.flowProfile[i],upper=z<-.85;
  for(let j=0;j<=cols;j++){const u=j/cols,x=(u*2-1)*w.width*.5*width,edge=Math.abs(u*2-1),ripple=Math.sin(x*1.7+v*2.1)*.075;
   positions.push(x,y+(upper?ripple:0),z+(upper?0:ripple));uvs.push(u,2.04-v);
   const shade=upper ? .75+.15*(1-edge) : .92+.08*(1-edge);colors.push(shade,shade+(upper ? .025 : 0),Math.min(1,shade+(upper ? .06 : 0)));
  }
 }
 for(let i=0;i<A.flowProfile.length-1;i++)for(let j=0;j<cols;j++){const a=i*(cols+1)+j,b=a+cols+1;indices.push(a,b,a+1,a+1,b,b+1);}
 return {positions,uvs,colors,indices,cols};
}

// Shared landmarks never move. Mega Clash reuses phase IV exactly.
// Phase-specific shore silhouettes are cosmetic.
// Each entry [x,z,width,height,depth,yaw] is outside the combat radius.
export const VALLEY_PHASE_ART=Object.freeze({
 1:{label:'Base',rocks:[],waterTint:'#ffffff',mist:1},
 2:{label:'Sharingan',rocks:[[-20.5,-3,2.4,1.15,2.2,.4],[-20.5,3,2.3,.85,2,-.3],[20.5,-4,2.5,1.25,1.7,-.4],[20.5,2,2.1,.85,2.2,.6]],waterTint:'#eaf6ff',mist:1.04},
 3:{label:'Curse Mark I',rocks:[[-20.5,-5,2.4,1.65,2,.5],[-18.8,7.7,1.7,.62,1.45,-.4],[-21,5,2.4,1.1,2.1,.7],[20.5,-5,2.4,1.6,2,-.5],[18.8,7.7,1.7,.65,1.45,.4],[21,5,2.4,1.1,2.1,-.7]],waterTint:'#dae6f5',mist:1.08},
 4:{label:'Curse Mark II',rocks:[[-21,-7,2.9,2.1,2.6,.6],[-20.5,4,2.2,1.5,2.2,-.55],[-17.7,10.2,1.8,.72,1.4,.3],[-10,18,1.9,.5,1.6,-.3],[21,-7,2.9,2.1,2.6,-.6],[20.5,4,2.2,1.5,2.2,.55],[17.7,10.2,1.8,.72,1.4,-.3],[10,18,1.9,.5,1.6,.3]],waterTint:'#cbd9ee',mist:1.12},
});
export function valleyArtStage(phase,finalDuel=false){return finalDuel?4:Math.max(1,Math.min(4,Math.floor(Number(phase)||1)));}
export function phaseArtController(groups,onChange=()=>{}){
 let stage=0;return {get stage(){return stage;},set(phase,finalDuel=false){const n=valleyArtStage(phase,finalDuel);if(n===stage)return false;stage=n;for(const [key,group] of Object.entries(groups))group.visible=Number(key)===stage;onChange(VALLEY_PHASE_ART[stage]);return true;}};
}
