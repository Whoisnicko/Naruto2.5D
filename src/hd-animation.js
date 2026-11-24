// Map the eight illustrated frames to the existing attack's wind-up and recovery.
// Damage and projectile spawning remain owned by game.js.
export function slashFrame(anim){
 if(!anim||anim.k!=='f'||!(anim.left>0)||!(anim.total>0))return null;
 const elapsed=Math.max(0,anim.total-anim.left),windup=anim.windup||.25,recovery=Math.max(.001,anim.total-windup);
 const index=elapsed<windup?Math.min(2,Math.floor(elapsed/windup*3)):3+Math.min(4,Math.floor((elapsed-windup)/recovery*5));
 return {index,col:index%4,row:Math.floor(index/4)};
}
export function slashFacing(x,z){
 if(Math.abs(x)<=Math.abs(z))return null;
 return x<0?'left':'right';
}
export function slashUV(col,row,flip){
 return {u:(col+(flip?1:0))/4,v:1-(row+1)/2,sx:(flip?-1:1)/4,sy:1/2};
}

// Locomotion: 0 neutral, 1/2/3 stride poses. Front/back rows are three-quarter views.
export function heroFrame(actor,clock=0){
 const dx=actor.dirX||0,dz=actor.dirZ??1,side=Math.abs(dx)>Math.abs(dz);
 const row=side?1:dz<0?2:0,flip=side&&dx<0;
 const moving=!!(actor.motion||actor.dashTime>0),a=actor.anim;
 let col=0;
 if(a&&a.left>0&&a.total>0){
  const elapsed=Math.max(0,a.total-a.left),windup=a.windup||0;
  col=elapsed<windup?0:elapsed<a.total*.83?1:0;
 }else if(actor.hit>0)col=2;
 else if(moving)col=[1,2,3,0][Math.floor(Math.max(0,clock)*(actor.sprinting||actor.dashTime>0?13:8))%4];
 return {col,row,flip};
}
export function heroUV(col,row,flip){return {u:(col+(flip?1:0))/4,v:1-(row+1)/3,sx:(flip?-1:1)/4,sy:1/3};}
