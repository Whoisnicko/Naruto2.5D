// Shared field VFX; exact approved Kyubi atlas, with procedural fallbacks.
import {KYUBI_ASSETS} from './kyubi-assets.js';
export function createFieldVFX(){
 const images={};for(const [key,src] of Object.entries(KYUBI_ASSETS)){try{const i=new Image();i.onload=()=>{images[key]=i};i.src=src}catch{}}
 let tails=null;try{const tailCanvas=document.createElement('canvas');tailCanvas.width=512;tailCanvas.height=512;const tc=tailCanvas.getContext('2d');tc.imageSmoothingEnabled=false;
 for(let count=1;count<=2;count++)for(let row=0;row<4;row++)for(let f=0;f<8;f++)for(let j=0;j<count;j++){const ox=f*64,oy=((count-1)*4+row)*64,side=row===1?1:row===2?-1:(j%2?1:-1),wave=Math.sin(f*Math.PI/4+j*1.9),spread=count===2?(j?1:-1):side;for(let k=0;k<=24;k++){const u=k/24,x=Math.round(32+side*9*u+spread*(12+j*3)*Math.sin(u*1.6)+wave*4*u),y=Math.round(43-26*u+4*Math.sin(u*4+j)),w=Math.max(1,Math.round(5*(1-u)));tc.fillStyle='#781d33';tc.fillRect(ox+x-w,oy+y-w,w*2+1,w*2+1);tc.fillStyle='#d73e43';tc.fillRect(ox+x-w+1,oy+y-w+1,Math.max(1,w*2-1),Math.max(1,w*2-1));tc.fillStyle='#ff864a';tc.fillRect(ox+x,oy+y,Math.max(1,w),Math.max(1,w));}}tails=tailCanvas;}catch{}
 function aura(c,q,dir,t,burst=0){const size=q[2]*4.8,f=Math.floor(t*13)%8,i=images.aura;c.save();c.imageSmoothingEnabled=false;c.globalAlpha=.93;
 // Original 64px directional aura cells; tails are separate in classic renderer.
 if(tails)c.drawImage(tails,f*64,(4+dir)*64,64,64,q[0]-size/2,q[1]-size*51/64,size,size);if(i)c.drawImage(i,f*64,dir*64,64,64,q[0]-size/2,q[1]-size*51/64,size,size);
 else{c.strokeStyle='#e34b39';c.lineWidth=3;c.beginPath();c.ellipse(q[0],q[1]-size*.25,size*.22,size*.34,0,0,Math.PI*2);c.stroke();}
 if(!tails){ for(let n=0;n<2;n++){c.strokeStyle=n?'#ff8656':'#a92d3e';c.lineWidth=Math.max(2,size*(n?.025:.055));for(let k=0;k<2;k++){const sign=k?1:-1,wave=Math.sin(t*9+k);c.beginPath();c.moveTo(q[0],q[1]-size*.14);c.quadraticCurveTo(q[0]+sign*size*.24,q[1]-size*.19,q[0]+sign*size*.34+wave*size*.035,q[1]-size*.52);c.stroke();}}
}
 if(burst>0){c.globalAlpha=burst/.85;c.strokeStyle='#ff9750';c.lineWidth=3;c.beginPath();c.ellipse(q[0],q[1],size*(1-burst/.85),size*.4*(1-burst/.85),0,0,Math.PI*2);c.stroke();}c.restore();}
 function claw(c,a,b,extend){const i=images.arm;if(!i||extend<.12)return false;const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(len<3)return false;c.save();c.translate(a[0],a[1]);c.rotate(Math.atan2(dy,dx));c.imageSmoothingEnabled=false;const f=extend>.8?3:extend>.45?4:5;c.drawImage(i,f*64,0,64,24,0,-a[2]*.9,len,a[2]*1.8);c.restore();return true;}
 function orb(c,q,t,size){const i=images.orb;if(!i)return false;c.save();c.imageSmoothingEnabled=false;c.drawImage(i,(Math.floor(t*28)%12)*48,0,48,48,q[0]-size/2,q[1]-size/2,size,size);c.restore();return true;}
 function smoke(c,q,progress){c.save();c.globalAlpha=Math.min(1,(1-progress)*2.2);for(let n=0;n<9;n++){const a=n*2.39996,r=q[2]*(.18+progress*.8)*(n%3+1)/3,x=q[0]+Math.cos(a)*r,y=q[1]+Math.sin(a)*r*.65-progress*q[2]*.45,sz=q[2]*(.27+progress*.25);c.fillStyle=n%3?'#fffdf5':'#c9d2da';c.beginPath();c.arc(x,y,sz,0,Math.PI*2);c.fill();}c.restore();}
 function charge(c,q,t){c.save();for(let i=0;i<12;i++){const a=i*2.39996+t*5,u=(t*1.8+i/12)%1,r=q[2]*(.7+.22*Math.sin(a*2));c.globalAlpha=(1-u)*.8;c.fillStyle=i%2?'#e0f9ff':'#56c9ff';const x=q[0]+Math.cos(a)*r*(1-u*.4),y=q[1]-u*q[2]*2;c.fillRect(x,y,3,5);}c.globalAlpha=.7;c.strokeStyle='#69dcff';c.lineWidth=2;c.beginPath();c.ellipse(q[0],q[1],q[2]*(.8+.12*Math.sin(t*12)),q[2]*.30,0,0,Math.PI*2);c.stroke();c.restore();}
 // Burst stays on the original foreground FX layer; only the cloak moves behind actors.
 function burst(c,q,amount=0){if(!(amount>0))return;const size=q[2]*4.8;c.save();c.globalAlpha=amount/.85;c.strokeStyle='#ff9750';c.lineWidth=3;c.beginPath();c.ellipse(q[0],q[1],size*(1-amount/.85),size*.4*(1-amount/.85),0,0,Math.PI*2);c.stroke();c.restore();}
 function groundAura(c,q,t){c.save();c.strokeStyle='#e34b39';c.globalAlpha=.75;c.lineWidth=3;c.beginPath();c.ellipse(q[0],q[1],q[2]*(.9+.1*Math.sin(t*12)),q[2]*.3,0,0,Math.PI*2);c.stroke();c.restore();}
 return {aura,claw,orb,smoke,charge,burst,groundAura,loaded:()=>Object.keys(images)};
}
