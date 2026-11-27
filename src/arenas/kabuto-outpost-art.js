// Deterministic, original procedural artwork. No remote dependencies.
function rng(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function surface(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');if(!ctx)throw Error('Canvas unavailable');return {c,ctx};}
export function medicalFloorArt(){
 const {c,ctx}=surface(1024,1024),random=rng(7123),colors=['#65766e','#697970','#596c66','#62736c','#718077','#5e716b','#64736f'];ctx.fillStyle='#344946';ctx.fillRect(0,0,1024,1024);
 for(let z=0;z<16;z++)for(let x=0;x<16;x++){
  const px=x*64,py=z*64;ctx.fillStyle=colors[Math.floor(random()*colors.length)];ctx.fillRect(px+2,py+2,60,60);
  ctx.fillStyle='#a1ac972e';ctx.fillRect(px+2,py+2,60,2);ctx.fillRect(px+2,py+2,2,58);ctx.fillStyle='#203b385e';ctx.fillRect(px+3,py+59,58,3);ctx.fillRect(px+59,py+3,3,58);
  for(let i=0;i<18;i++){ctx.fillStyle=i%2?'#c4c9af1c':'#203a3726';ctx.fillRect(px+5+random()*51,py+5+random()*51,1+random()*4,1+random()*2);}
  if(random()<.16){ctx.beginPath();ctx.moveTo(px+64*random(),py+2);ctx.lineTo(px+15+random()*27,py+21);ctx.lineTo(px+12+random()*36,py+34);ctx.lineTo(px+23+random()*30,py+62);ctx.strokeStyle='#2c474755';ctx.lineWidth=1.5;ctx.stroke();}
 }
 // Faded inspection zone and perimeter edging, all paint, not collision indicators.
 ctx.strokeStyle='#b9c1a13b';ctx.lineWidth=3;ctx.strokeRect(32,32,960,960);ctx.strokeStyle='#2e444649';ctx.lineWidth=8;ctx.strokeRect(8,8,1008,1008);
 for(let i=0;i<32;i++){const x=40+random()*944,y=random()<.5?24+random()*90:910+random()*90,g=ctx.createRadialGradient(x,y,0,x,y,12+random()*31);g.addColorStop(0,'#24474054');g.addColorStop(1,'#24474000');ctx.fillStyle=g;ctx.fillRect(x-45,y-45,90,90);}
 return c;
}
export function lampPoolArt(){const {c,ctx}=surface(128,128),g=ctx.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'#dbeac373');g.addColorStop(.4,'#b1d5a534');g.addColorStop(1,'#b1d5a500');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return c;}
