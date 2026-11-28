import {rng} from './sasuke-valley-data.js?v=6g7';
// Noise-based translucent foam/mist textures. No hard-edged circles.
export function noiseField(seed,size){
 const r=rng(seed),lattices=[4,8,16,32,64].map(n=>({n,v:Float32Array.from({length:(n+1)*(n+1)},()=>r())}));
 function sample(l,x,y){const {n,v}=l,px=x*n,py=y*n,i=Math.min(n-1,Math.floor(px)),j=Math.min(n-1,Math.floor(py)),a=px-i,b=py-j,s=a*a*(3-2*a),t=b*b*(3-2*b),k=j*(n+1)+i;return (v[k]*(1-s)+v[k+1]*s)*(1-t)+(v[k+n+1]*(1-s)+v[k+n+2]*s)*t;}
 const out=new Float32Array(size*size);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const u=x/(size-1),v=y/(size-1);out[y*size+x]=lattices.reduce((s,l,i)=>s+sample(l,u,v)*[.37,.27,.18,.11,.07][i],0);}return out;
}
export function impactTexture(kind,seed=677){
 const n=256,c=document.createElement('canvas');c.width=c.height=n;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');const image=g.createImageData(n,n),field=noiseField(seed,n),clamp=v=>Math.max(0,Math.min(1,v));
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const i=y*n+x,u=x/(n-1)*2-1,v=y/(n-1)*2-1,d=Math.hypot(u,v),f=field[i],edge=clamp((1-d)*3.1),mist=kind==='mist',a=mist?edge*clamp((f-.25)*2.2)*Math.pow(Math.max(0,1-d),.46):edge*clamp((f-.37)*4.2)*(.58+.42*Math.sin(f*33)**2);
 const k=i*4;image.data[k]=mist?231:226;image.data[k+1]=mist?245:248;image.data[k+2]=250;image.data[k+3]=Math.round(a*255);}
 g.putImageData(image,0,0);return c;
}
