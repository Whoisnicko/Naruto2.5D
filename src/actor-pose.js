// Original pose functions extracted verbatim from pixel-renderer.js; shared by both presentations.
import {COMBAT} from './combat-data.js';
import {ANIMS,artFor,rasenganPose} from './pixel-art.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function frameFor(actor,clock,pose=null){
 const a=actor.anim;
 if(!a&&actor.guardBreak>0)return {col:ANIMS.guardBreak.start+Math.floor(clock*ANIMS.guardBreak.fps)%2,state:'guardBreak'};
 if(!a&&actor.guarding)return {col:ANIMS.guard.start+(pose&&pose.age<.10?0:1+Math.floor(clock*ANIMS.guard.fps)%3),state:'guard'};
 if(!a&&actor.charging)return {col:ANIMS.charge.start+((actor.chargeHeld||0)<.25?Math.min(1,Math.floor((actor.chargeHeld||0)*8)):2+Math.floor(clock*ANIMS.charge.fps)%2),state:'charge'};
 if(a?.dashStrike&&a.left>0){const age=a.dashImpactAge;return {col:ANIMS.dashStrike.start+(!Number.isFinite(age)?0:age<.065?1:age<.135?2:3),state:'dashStrike'};}
 if(!a&&actor.dashTime>0)return {col:ANIMS.dash.start+Math.min(3,Math.floor(Math.max(0,1-actor.dashTime/COMBAT.dash.duration)*4)),state:'dash'};
 if(a&&a.left>0){
  if(actor.character==='naruto'&&Number.isInteger(a.rasPose))return {col:38+a.rasPose,state:'rasengan'};
  if(actor.character==='naruto'&&a.k===' ')return {col:38+rasenganPose(a),state:'rasengan'};
  const special=actor.character&&artFor(actor.character,a.k);if(special){const v=ANIMS[special.pose],elapsed=Math.max(0,a.total-a.left),windup=a.windup||.001,recovery=Math.max(.001,a.total-windup);const phase=elapsed<windup?(elapsed<windup*.55?0:1):elapsed<windup+recovery*.65?2:3;return {col:v.start+phase,state:special.pose};}
  if(a.k==='j'&&a.combo>=1&&a.combo<=3){const state=['attack','kick','finish'][a.combo-1],v=ANIMS[state],age=Math.max(0,a.total-a.left),windup=a.windup||.001;return {col:v.start+(age<windup?0:age<windup+Math.max(.075,(a.total-windup)*.55)?1:2),state};}
  const state=(a.k==='l'||a.k===' '||a.k==='f'||a.k==='g')?'cast':a.combo===2?'kick':a.combo===3?'finish':'attack',v=ANIMS[state],progress=clamp(1-a.left/a.total,0,.999);
  const col=a.windup?(a.left>a.total-a.windup?v.start:v.start+Math.min(v.count-1,1+Math.floor((1-a.left/(a.total-a.windup))*(v.count-1)))):v.start+Math.min(v.count-1,Math.floor(progress*v.count));return {col,state};
 }
 if(actor.hit>0&&!actor.anim)return {col:13,state:'hit'};
 const moving=actor.motion??Boolean(actor.walk),state=moving?(actor.sprinting?'run':'walk'):'idle',v=ANIMS[state];
 if(!moving&&pose?.brake>0)return {col:ANIMS.brake.start+(pose.brake>.045?0:1),state:'brake'};
 return {col:v.start+Math.floor((moving&&pose?pose.gait:clock*v.fps))%v.count,state};
}
// Presentation-only pose clock, no additional sprite, hitbox or simulation latency.
export function advancePose(pose,actor,dt){
 const a=actor.anim,locked=!!(a||actor.guarding||actor.charging||actor.guardBreak>0||actor.hit>0||actor.dashTime>0||actor.fallen||actor.air);
 const moving=!locked&&!!(actor.motion??actor.walk),state=actor.fallen?'fallen':actor.guardBreak>0?'guardBreak':actor.guarding?'guard':actor.charging?'charge':a?'action':actor.dashTime>0?'dash':actor.hit>0?'hit':moving?(actor.sprinting?'run':'walk'):'idle';
 if(pose.state!==state){pose.age=0;pose.brake=state==='idle'&&(pose.state==='walk'||pose.state==='run'||pose.state==='dash')?.09:0;pose.state=state;}else pose.age+=dt;
 if(state!=='idle')pose.brake=0;else pose.brake=Math.max(0,pose.brake-dt);
 if(moving)pose.gait=(pose.gait+dt*(actor.sprinting?ANIMS.run.fps:ANIMS.walk.fps)*(actor.moveBlend==null?1:Math.max(.45,actor.moveBlend)))%4;
 // Preserve the exact Rasengan/cinematic alignment, feet anchored to ground.
 let sx=1,sy=1;
 if(!actor.fallen&&!actor.air&&!Number.isInteger(a?.rasPose)&&!(a&&a.k===' '&&actor.character==='naruto')&&!a?.rasRecovery){
  if(state==='dash'){sx=1.055;sy=.96;}else if(state==='guard'||state==='guardBreak'){sx=1.035;sy=.97;}else if(state==='charge'){sx=1.012;sy=1+.012*Math.sin(pose.age*12);}else if(state==='hit'){sx=1.035;sy=.965;}else if(pose.brake>0){sx=1.025;sy=.975;}
  const blend=1-Math.exp(-Math.max(0,dt)*24);pose.sx+=(sx-pose.sx)*blend;pose.sy+=(sy-pose.sy)*blend;
 }else{pose.sx=pose.sy=1;}
 return pose;
}
