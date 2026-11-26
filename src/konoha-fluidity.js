// Presentation and locomotion timing only; the original pose renderer supplies animation frames.
// No world geometry, damage, resource costs or enemy rules.
export function createFieldPose(){return {state:'idle',age:0,brake:0,gait:0,sx:1,sy:1};}
export function resetFieldPose(pose){Object.assign(pose,createFieldPose());}
export function fieldPoseActor({visual={},character,moving,running,moveBlend,speed,hit=0}){
 const v=visual,anim=v.anim||null;
 return {character,anim,dashTime:v.dashTime||0,guardBreak:v.guardBreak||0,guarding:!!v.guarding,charging:!!v.charging,chargeHeld:v.chargeHeld||0,hit,motion:!!moving,sprinting:!!running,moveBlend:Math.min(1.7,Math.max(.45,(speed||0)/(running?8.4:4.8))),walk:moving?1:0};
}
// The camera follows actual displacement instead of accumulating a long chase lag.
// Panorama and travel retain the original eased transition. No predicted movement through walls.
export function followFieldCamera(previous,target,{dt,walking,continuous,dx=0,dz=0}){
 if(!previous)return {...target};
 const k=1-Math.exp(-Math.max(0,dt)*(walking?13:7)),feed=walking&&continuous?.84:0;
 const x=previous.x+dx*feed,z=previous.z+dz*feed;
 return {x:x+(target.x-x)*k,z:z+(target.z-z)*k,height:previous.height+(target.height-previous.height)*k};
}
// Integrate the same original exponential acceleration over the frame, avoiding FPS-dependent travel.
export function integrateMovementBlend(blend,dt,acceleration){
 const a=Math.max(.001,acceleration),t=Math.max(0,dt),start=Math.max(0,Math.min(1,blend)),end=1-(1-start)*Math.exp(-a*t);
 return {end,average:t>0?1-(1-start)*(-Math.expm1(-a*t))/(a*t):start};
}
// Smooth transition between walk/run/sprint while still applying immediate stop on input release.
export function approachPace(current,target,dt){
 if(!Number.isFinite(current)||current<=0)return target;
 return target+(current-target)*Math.exp(-Math.max(0,dt)*18);
}
export function createFramePacing(){
 const gaps=new Float64Array(360);let n=0,head=0,last={samples:0,p50:0,p95:0,low1:0,spikes:0};
 return {sample(ms){if(!Number.isFinite(ms)||ms<=0||ms>250){n=head=0;return;}gaps[head]=ms;head=(head+1)%gaps.length;n=Math.min(n+1,gaps.length);},reset(){n=head=0;},report(){if(!n)return last;const a=Array.from(gaps.subarray(0,n)).sort((x,y)=>x-y),p=q=>a[Math.max(0,Math.ceil(q*n)-1)],tail=a.slice(Math.max(0,n-Math.ceil(n*.01)));last={samples:n,p50:p(.5),p95:p(.95),low1:1000/(tail.reduce((s,x)=>s+x,0)/tail.length),spikes:a.filter(x=>x>p(.5)*1.75).length};return last;}};
}
