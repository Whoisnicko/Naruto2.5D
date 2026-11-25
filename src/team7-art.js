// Original pixel-art direction. Coordinates are in the legacy 24×32 logical grid;
// the enhanced raster uses half-unit pixels. No asset download is required.
export const TEAM7_KINDS=new Set(['player','clone','sasuke','sakura','npc']);
export const TEAM7_NAMES={player:'Naruto',clone:'Shadow clone',sasuke:'Sasuke',sakura:'Sakura',npc:'Kakashi'};
export const TEAM7_COLORS={
 player:{hair:'#efb927',hairLight:'#ffe476',hairShade:'#b67b26',shirt:'#f28b28',shade:'#af4c21',light:'#ffbd56',trim:'#243b61',metal:'#b7cbd4'},
 clone:{hair:'#efb927',hairLight:'#ffe476',hairShade:'#b67b26',shirt:'#f28b28',shade:'#af4c21',light:'#ffbd56',trim:'#243b61',metal:'#b7cbd4'},
 sasuke:{hair:'#202338',hairLight:'#656b90',hairShade:'#111827',shirt:'#3a4d87',shade:'#202c55',light:'#8395c2',trim:'#e3e2cf',metal:'#c4d0d9'},
 sakura:{hair:'#e785a2',hairLight:'#ffc3cb',hairShade:'#a84970',shirt:'#c33750',shade:'#822a46',light:'#f36f7d',trim:'#e7d8bd',metal:'#c7cdd6'},
 npc:{hair:'#d9e3e4',hairLight:'#fffdf0',hairShade:'#8396aa',shirt:'#506a4c',shade:'#293c37',light:'#a7b584',trim:'#233448',metal:'#becdd3'}
};
export function enhancedCell(w,h){
 const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
 const rect=(x,y,w,h,col)=>{if(![x,y,w,h].every(Number.isFinite)||w<=0||h<=0)return;ctx.fillStyle=col;ctx.fillRect(Math.round(x*2),Math.round(y*2),Math.round(w*2),Math.round(h*2));};
 // Integer scanlines, no anti-aliasing or half-transparent seams between cells.
 function poly(pts,col){const p=pts.map(([x,y])=>[x*2,y*2]);ctx.fillStyle=col;for(let y=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1]))));y<Math.min(h*2,Math.ceil(Math.max(...p.map(a=>a[1]))));y++){const xs=[];for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y+.5)!==(b[1]>y+.5))xs.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2){const l=Math.max(0,Math.ceil(xs[i]-.5)),r=Math.min(w*2,Math.ceil(xs[i+1]-.5));if(r>l)ctx.fillRect(l,y,r-l,1);}}}
 function line(x,y,xx,yy,col,w=1){if(![x,y,xx,yy].every(Number.isFinite))return;const n=Math.max(1,Math.ceil(2*Math.max(Math.abs(xx-x),Math.abs(yy-y))));for(let i=0;i<=n;i++)rect(x+(xx-x)*i/n-w/2,y+(yy-y)*i/n-w/2,w,w,col);}
 return {c,ctx,rect,poly,line};
}
export function paintTeamBody(s,role,p,{lean,bodyY,back,side}){
 const {rect,poly,line}=s,x=lean,y=bodyY;const ink='#25283b';
 if(role==='player'||role==='clone'){
  poly([[7.5+x,y+1],[15.5+x,y+1],[16,y+3.5],[13,y+4.5],[9,y+4.5],[7,y+3.5]],p.trim);
  line(9+x,y+1,9+x,y+3,'#597799',.5);line(11.5+x,y+4,11.5+x,23.5,'#ffe1a0',.5);
  if(!back){line(9,y+6,10.5,y+5,p.shade,.5);line(13.5,y+5,15,y+6,p.shade,.5);}else{rect(10,y+4,4,3.5,'#b53b34');line(11,y+5,13,y+5,'#e6b49a',.5);line(13,y+5,12,y+6.5,'#e6b49a',.5);}
 }else if(role==='npc'){
  rect(8+x,y+1,7,2,p.shade);rect(8.5,y+4,3,4,p.light);rect(12.5,y+4,3,4,p.light);rect(9,y+4.5,2.5,2.5,'#526749');rect(13,y+4.5,2,2.5,'#526749');line(12,y+3,12,24,ink,.5);if(back){rect(10,y+4,4,4,'#a94b46');rect(11,y+5,2,2,'#d1b6a0');}
 }else if(role==='sakura'){
  poly([[8+x,y+1],[15+x,y+1],[15.5,23.5],[17,25],[7,25],[8.5,23.5]],p.shirt);line(12,y+2,12,24,'#f7d7c5',.5);line(8,24,16,24,'#ebd2c1',.5);if(!back){rect(10.5,y+3,3,1,p.light);}else rect(10,y+4,4,4,'#ece1ca');
 }else if(role==='sasuke'){
  poly([[8+x,y+1],[15+x,y+1],[15+x,y+3],[12+x,y+4],[8+x,y+3]],p.shade);line(8+x,y+2,15+x,y+2,p.light,.5);rect(8,24,8,2,'#e8e4d5');if(back){rect(10,y+4,4,2,'#bb4946');rect(10,y+6,4,1,'#f4e7d6');rect(11.5,y+7,1,1,'#f4e7d6');}
 }
}
export function paintTeamHead(s,role,p,{hx,hy,side,back,kyubi}){
 const {rect,poly,line}=s,ink='#212638',skin='#f5bd8b',shadow='#bd795c',light='#ffe1ae';
 const P=(a,c)=>poly(a.map(([x,y])=>[x+hx,y+hy]),c),R=(x,y,w,h,c)=>rect(x+hx,y+hy,w,h,c),L=(x,y,X,Y,c,w=.5)=>line(x+hx,y+hy,X+hx,Y+hy,c,w);
 const hair=role==='sakura'?[[-7,2],[-7,-3],[-4,-7],[1,-8],[5,-6],[7,-2],[7,8],[4,10],[-5,10]]:role==='npc'?[[-7,1],[-8,-3],[-4,-4],[-5,-7],[0,-6],[4,-9],[4,-5],[8,-8],[7,-3],[10,-4],[7,2],[5,5],[-5,5]]:role==='sasuke'?[[-7,3],[-8,-3],[-5,-6],[-1,-7],[4,-6],[7,-7],[6,-4],[9,-5],[7,-1],[9,1],[5,5],[-6,5]]:[[-7,1],[-8,-3],[-4,-3],[-5,-7],[-1,-5],[0,-9],[3,-5],[6,-8],[6,-4],[9,-5],[7,1],[5,4],[-6,4]];
 P([[-6,-2],[4,-3],[7,1],[6,6],[3.5,9],[-3.5,9],[-6,5]],ink);P([[-5.5,-1.5],[4,-2],[6.5,1],[5.5,6],[3,8.5],[-3,8.5],[-5.5,5]],skin);
 if(!back){P([[-5.5,4],[-3,7],[2,8.5],[-3,8.5],[-5.5,6]],shadow);R(-3,2,6,1,light);}
 P(hair,ink);P(hair.map(([x,y])=>[x*.88,y*.88]),p.hair);
 if(role==='sakura'){if(!back){P([[-4.5,0],[3.5,0],[5,3],[4.5,6.5],[2.5,8.5],[-3,8.5],[-4.5,6]],skin);P([[-4.5,5],[-3,7],[2.5,8.5],[-3,8.5]],shadow);}P([[-6,-2],[-3,-6],[2,-7],[5,-4],[2,-3],[-2,-4]],p.hairLight);P([[-6,-1],[-4,0],[-4,7],[-5,9],[-6,7]],p.hairShade);P([[4,-2],[6,-1],[6,7],[4,9],[4,4]],p.hair);if(!back){P([[-5,-2],[-2,-5],[2,-3],[-1,2]],p.hairLight);P([[1,-4],[5,-2],[4,2],[2,0]],p.hairShade);}}
 else {P([[-5,-2],[-4,-5],[-1,-4],[0,-6],[2,-4],[4,-6],[4,-3],[6,-4],[5,-1]],p.hairLight);L(-5,0,-2,-2,p.hairShade);L(3,-2,5,-1,p.hairShade);}
 if(back){R(-5.5,1,11,3,p.trim);R(-1,4,2,4,p.trim);L(0,4,3,7,p.trim,1.5);if(role==='sakura')P([[-5,0],[4,-2],[5,7],[3,9],[-4,9]],p.hair);return;}
 if(role==='npc'){P([[-6,0],[6,1.5],[6,4],[-6,3]],p.trim);P([[-5.5,1],[1,1.8],[1,3.4],[-5.5,2.7]],p.metal);P([[-5.5,4.5],[1,5],[6,4],[5.5,7],[3,9],[-3,9],[-5.5,6]],p.trim);L(-3,7,2,8,'#546378');R(side?3:2,3.5,2.5,1.5,ink);R(side?3.5:2.5,4,1.5,.5,'#dce3d4');L(-2.5,1.8,-1,2.2,'#526579');return;}
 const bandY=role==='sakura'?-1:1;
 R(-5.5,bandY,11,2.5,role==='sakura'?'#a63249':p.trim);R(side?1:-3.5,bandY+.5,side?4.5:7,1.5,p.metal);L(side?2:-2.5,bandY+1,side?4:2.5,bandY+1,'#edf4ee');R(side?3:0,bandY+1,.5,1,'#4c6370');if(!side){L(-1,bandY+1.5,0,bandY+.75,'#536b79');L(0,bandY+.75,1,bandY+1.5,'#536b79');R(0,bandY+1.5,.5,.5,'#536b79');}
 if(role==='sasuke'){P([[-6,-2],[-3,-4],[-3,1.5],[-5,4.5],[-6,2]],p.hair);P([[4,-4],[6,-2],[6,3],[4,2]],p.hairShade);}
 const eye=role==='player'||role==='clone'?(kyubi?'#df302c':'#3d8fc6'):role==='sakura'?'#44805e':'#38394c';
 for(const ex of side?[2]:[-4,2]){L(ex,3,ex+2.5,3.5,ink,.75);R(ex,3.5,3,1.5,ink);R(ex+.5,3.5,2,1,'#f5eddf');R(ex+1,3.5,1,1.5,eye);R(ex+1,3.5,.5,.5,'#fff8d9');}
 R(side?4:0,5.5,.5,1,shadow);L(side?2:-1,7.2,side?4:1.5,7.2,'#8e4747');
 if(role==='player'||role==='clone'){for(const yy of [5.5,6.3,7.1]){if(!side)L(-5,yy,-3.5,yy+.5,kyubi?'#793333':'#a7674b');L(3.5,yy+.5,5,yy,kyubi?'#793333':'#a7674b');}}
}
