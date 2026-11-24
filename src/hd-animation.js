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
