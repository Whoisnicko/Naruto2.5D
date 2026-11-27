// Generic review geometry, independent of the combat and visual assets.
export function arenaContains(spec,x,z,margin=spec.actorMargin){return Number.isFinite(x)&&Number.isFinite(z)&&Math.hypot(x,z)<=spec.radius-margin+1e-8;}
export function arenaStep(spec,p,dx,dz){if(![p.x,p.z,dx,dz].every(Number.isFinite))return {...spec.spawn};const x=p.x+dx,z=p.z+dz,r=Math.hypot(x,z),limit=spec.radius-spec.actorMargin;return r<=limit?{x,z}:{x:x*limit/r,z:z*limit/r};}
export function arenaFrustum(width,height,overview=false){const aspect=Math.max(.1,width/Math.max(1,height)),span=overview?Math.max(45,44/aspect):Math.max(24,18/aspect);return {left:-span*aspect/2,right:span*aspect/2,top:span/2,bottom:-span/2};}
