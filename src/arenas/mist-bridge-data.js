// Art-review geometry. Coordinates local to arena; legacy encounter radius preserved.
export const MIST_BRIDGE=Object.freeze({
 id:'mist-bridge',name:'Land of Waves · Great Naruto Bridge',
 center:{x:0,z:0},radius:12,actorMargin:.45,
 deck:{width:30,length:68,level:0},water:{width:120,length:110,level:-2.7},
 spawn:{x:-3.5,z:0},bossSpawn:{x:3.5,z:0},mirrorRadius:7,
 assets:{deck:'cobbles-irregular',water:'water-clear',bank:'grass-natural'},
 stages:[
  {name:'Zabuza opening',actors:[{kind:'zabuza',x:3.5,z:0},{kind:'npc',x:0,z:4.2}]},
  {name:'Haku arrival',actors:[{kind:'haku',x:3.5,z:0},{kind:'sasuke',x:-2,z:4.2},{kind:'zabuza',x:6.5,z:-4},{kind:'npc',x:2,z:-4}]},
  {name:'Kyūbi awakening',actors:[{kind:'haku',x:3.5,z:0},{kind:'sasukeInjured',x:-2,z:4.2}],kyubi:true},
  {name:'Zabuza wrath',actors:[{kind:'zabuza',x:3.5,z:0},{kind:'npc',x:0,z:4.2},{kind:'sasuke',x:-2,z:-4.2}]}
 ]
});
export function arenaContains(x,z,margin=MIST_BRIDGE.actorMargin){return Number.isFinite(x)&&Number.isFinite(z)&&Math.hypot(x,z)<=MIST_BRIDGE.radius-margin+1e-8;}
export function arenaStep(p,dx,dz){if(![p.x,p.z,dx,dz].every(Number.isFinite))return {...MIST_BRIDGE.spawn};const x=p.x+dx,z=p.z+dz,r=Math.hypot(x,z),limit=MIST_BRIDGE.radius-MIST_BRIDGE.actorMargin;if(r<=limit)return {x,z};return {x:x*limit/r,z:z*limit/r};}
export function mirrorPoints(){return Array.from({length:6},(_,i)=>({x:Math.cos(i*Math.PI/3)*MIST_BRIDGE.mirrorRadius,z:Math.sin(i*Math.PI/3)*MIST_BRIDGE.mirrorRadius}));}
export function arenaFrustum(width,height,overview=false){const aspect=Math.max(.1,width/Math.max(1,height));const span=overview?Math.max(45,40/aspect):Math.max(24,18/aspect);return {left:-span*aspect/2,right:span*aspect/2,top:span/2,bottom:-span/2};}
