// Original deterministic, non-repeating painted textures for the full arena.
export const BRIDGE_ART=Object.freeze({
 stone:['#92978b','#a2a293','#8b938b','#a5a89b','#989d92','#858e87','#a9aa9c'],
 grout:'#586561',edge:'#737e76',water:'#244d61',foam:'#9fbfbd',mist:'#b9d0d1',
 rail:['#768984','#8b9b91','#98a69b','#606f6d']
});
function rng(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');if(!ctx)throw Error('Canvas unavailable');return {c,ctx,w,h};}
function line(ctx,pts,color,width=1){ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
export function deckArt(){
 const {c,ctx,w,h}=canvas(1024,2048),random=rng(871),P=BRIDGE_ART;ctx.fillStyle=P.grout;ctx.fillRect(0,0,w,h);
 // Broad rectangular masonry with offset joints, chipped bevels and fine weathering.
 for(let y=0,row=0;y<h;y+=63,row++){
  let x=-((row%2)*85)-Math.floor(random()*25);
  while(x<w){
   const sw=105+Math.floor(random()*100),sh=59,xx=x+3,yy=y+2,cut=2+random()*5;
   ctx.beginPath();ctx.moveTo(xx+cut,yy);ctx.lineTo(xx+sw-7,yy);ctx.lineTo(xx+sw-4,yy+cut);ctx.lineTo(xx+sw-4,yy+sh-5);ctx.lineTo(xx+sw-9,yy+sh);ctx.lineTo(xx+4,yy+sh);ctx.lineTo(xx,yy+sh-5);ctx.lineTo(xx,yy+cut);ctx.closePath();
   ctx.fillStyle=P.stone[Math.floor(random()*P.stone.length)];ctx.fill();
   line(ctx,[[xx+cut,yy+1],[xx+sw-8,yy+1]],'#c2c4af99',2);line(ctx,[[xx+1,yy+cut],[xx+1,yy+sh-5]],'#c7c9b666',2);line(ctx,[[xx+5,yy+sh-1],[xx+sw-9,yy+sh-1],[xx+sw-5,yy+sh-5]],'#424f4c88',3);
   for(let i=0;i<15;i++){const px=xx+7+random()*(sw-19),py=yy+5+random()*(sh-12);ctx.fillStyle=i%2?'#e4dacb24':'#344a4828';ctx.fillRect(px,py,1+random()*6,1+random()*2);}
   if(random()<.18){const ax=xx+16+random()*(sw-40),ay=yy+5;line(ctx,[[ax,ay],[ax+4,ay+11],[ax-3,ay+19],[ax+8,ay+28]],'#4b605a88',1.5);}
   x+=sw;
  }
 }
 // Side masonry strips frame the battlefield; all markings are flat paint, never collision.
 for(const side of [0,w-36]){ctx.fillStyle='#6b7c76';ctx.fillRect(side,0,36,h);for(let y=0;y<h;y+=96){ctx.fillStyle='#93a098';ctx.fillRect(side+2,y+2,32,91);ctx.fillStyle='#c0c8b8';ctx.fillRect(side+2,y+2,32,2);ctx.fillStyle='#526662';ctx.fillRect(side+2,y+92,32,3);}}
 for(let i=0;i<100;i++){const side=random()<.5?1:-1,x=side===1?39+random()*68:w-39-random()*68,y=random()*h;ctx.fillStyle=i%2?'#566d5938':'#425d5230';ctx.beginPath();ctx.ellipse(x,y,3+random()*14,2+random()*7,random()*Math.PI,0,Math.PI*2);ctx.fill();}
 for(let i=1;i<4;i++){const y=h*i/4;ctx.fillStyle='#495b58';ctx.fillRect(38,y-2,w-76,5);ctx.fillStyle='#bbc2b1';ctx.fillRect(38,y+3,w-76,2);}
 return c;
}
export function waterArt(){
 const {c,ctx,w,h}=canvas(1024,1024),random=rng(129);const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#315e70');g.addColorStop(.45,'#234b60');g.addColorStop(1,'#3a6974');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 for(let i=0;i<1050;i++){const x=random()*w,y=random()*h,len=15+random()*115,bend=1+random()*4;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+len*.35,y-bend,x+len*.68,y+1);ctx.quadraticCurveTo(x+len*.85,y+bend,x+len,y);ctx.strokeStyle=i%5===0?'#a4c7c044':i%3===0?'#7caeae30':'#143d5048';ctx.lineWidth=i%5===0?1.6:1;ctx.stroke();}
 // Muted broad currents painted once across the full water plane.
 for(let i=0;i<30;i++){const y=random()*h,x=random()*w;const q=ctx.createRadialGradient(x,y,0,x,y,65+random()*120);q.addColorStop(0,'#a4c9c218');q.addColorStop(1,'#a4c9c200');ctx.fillStyle=q;ctx.fillRect(0,0,w,h);}
 return c;
}
export function mistArt(){const {c,ctx,w,h}=canvas(256,128);const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,63);g.addColorStop(0,'#c6dce080');g.addColorStop(.55,'#c6dce039');g.addColorStop(1,'#c6dce000');ctx.scale(2,1); // draw using unscaled gradient coordinates via separate ellipse transform below
 ctx.setTransform(1,0,0,1,0,0);ctx.translate(w/2,h/2);ctx.scale(2,1);const q=ctx.createRadialGradient(0,0,0,0,0,64);q.addColorStop(0,'#c6dce070');q.addColorStop(.55,'#c6dce032');q.addColorStop(1,'#c6dce000');ctx.fillStyle=q;ctx.fillRect(-64,-64,128,128);return c;}
