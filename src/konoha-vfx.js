// Shared field VFX; exact approved Kyubi atlas, with procedural fallbacks.
import {KYUBI_ASSETS} from './kyubi-assets.js';
export function createFieldVFX(){
 const images={};for(const [key,src] of Object.entries(KYUBI_ASSETS)){try{const i=new Image();i.onload=()=>{images[key]=i};i.src=src}catch{}}
 function aura(c,q,dir,t,burst=0){const size=q[2]*4.8,f=Math.floor(t*13)%8,i=images.aura;c.save();c.imageSmoothingEnabled=false;c.globalAlpha=.93;
 // Original 64px directional aura cells; tails are separate in classic renderer.
 if(i)c.drawImage(i,f*64,dir*64,64,64,q[0]-size/2,q[1]-size*51/64,size,size);
 else{c.strokeStyle='#e34b39';c.lineWidth=3;c.beginPath();c.ellipse(q[0],q[1]-size*.25,size*.22,size*.34,0,0,Math.PI*2);c.stroke();}
 for(let n=0;n<2;n++){c.strokeStyle=n?'#ff8656':'#a92d3e';c.lineWidth=Math.max(2,size*(n?.025:.055));for(let k=0;k<2;k++){const sign=k?1:-1,wave=Math.sin(t*9+k);c.beginPath();c.moveTo(q[0],q[1]-size*.14);c.quadraticCurveTo(q[0]+sign*size*.24,q[1]-size*.19,q[0]+sign*size*.34+wave*size*.035,q[1]-size*.52);c.stroke();}}
 if(burst>0){c.globalAlpha=burst/.85;c.strokeStyle='#ff9750';c.lineWidth=3;c.beginPath();c.ellipse(q[0],q[1],size*(1-burst/.85),size*.4*(1-burst/.85),0,0,Math.PI*2);c.stroke();}c.restore();}
 function orb(c,q,t,size){const i=images.orb;if(!i)return false;c.save();c.imageSmoothingEnabled=false;c.drawImage(i,(Math.floor(t*28)%12)*48,0,48,48,q[0]-size/2,q[1]-size/2,size,size);c.restore();return true;}
 function smoke(c,q,progress){c.save();c.globalAlpha=Math.min(1,(1-progress)*2.2);for(let n=0;n<9;n++){const a=n*2.39996,r=q[2]*(.18+progress*.8)*(n%3+1)/3,x=q[0]+Math.cos(a)*r,y=q[1]+Math.sin(a)*r*.65-progress*q[2]*.45,sz=q[2]*(.27+progress*.25);c.fillStyle=n%3?'#fffdf5':'#c9d2da';c.beginPath();c.arc(x,y,sz,0,Math.PI*2);c.fill();}c.restore();}
 function charge(c,q,t){c.save();for(let i=0;i<12;i++){const a=i*2.39996+t*5,u=(t*1.8+i/12)%1,r=q[2]*(.7+.22*Math.sin(a*2));c.globalAlpha=(1-u)*.8;c.fillStyle=i%2?'#e0f9ff':'#56c9ff';const x=q[0]+Math.cos(a)*r*(1-u*.4),y=q[1]-u*q[2]*2;c.fillRect(x,y,3,5);}c.globalAlpha=.7;c.strokeStyle='#69dcff';c.lineWidth=2;c.beginPath();c.ellipse(q[0],q[1],q[2]*(.8+.12*Math.sin(t*12)),q[2]*.30,0,0,Math.PI*2);c.stroke();c.restore();}
 return {aura,orb,smoke,charge,loaded:()=>Object.keys(images)};
}
