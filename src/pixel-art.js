// Original, deterministic pixel sheets. All primitives rasterize on integer pixels;
// no generated image or third-party character assets are needed.
export const ACTOR_W=24,ACTOR_H=32,ACTOR_COLS=22,DIRS=['down','left','right','up'];
export const ANIMS={idle:{start:0,count:2,fps:3},walk:{start:2,count:4,fps:9},run:{start:6,count:4,fps:13},attack:{start:10,count:3,fps:14},hit:{start:13,count:1,fps:1},cast:{start:14,count:2,fps:9},kick:{start:16,count:3,fps:14},finish:{start:19,count:3,fps:12}};
export const FX_ROWS=['rasengan','clone','hit','dash','shuriken'];
export const FX_SIZE=32,FX_COLS=8;
export const TREE_W=40,TREE_H=48;
const ink='#273044',skin='#f7c08a',skinShade='#bc795d',skinLight='#ffe0a8';
const PALETTES={
 player:{hair:'#f4c848',hairLight:'#fff0a1',hairShade:'#bf8739',shirt:'#f58b36',shade:'#b94b30',light:'#ffb650',trim:'#26344c',metal:'#bacfd3'},
 npc:{hair:'#c4d3df',hairLight:'#f0f4f8',hairShade:'#8495ae',shirt:'#78935a',shade:'#475e46',light:'#a5ba76',trim:'#26344c',metal:'#c6d6dd'},
 enemy:{hair:'#34364d',hairLight:'#69627e',hairShade:'#262839',shirt:'#665272',shade:'#3d354f',light:'#93748a',trim:'#29283c',metal:'#b8b6c6'},
 clone:{hair:'#edc448',hairLight:'#fff0a1',hairShade:'#bf8739',shirt:'#f58b36',shade:'#b94b30',light:'#ffb650',trim:'#26344c',metal:'#bacfd3'}
};
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function cell(w,h){
 const c=canvas(w,h),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
 function rect(x,y,w,h,col){if(w<=0||h<=0)return;ctx.fillStyle=col;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
 function poly(pts,col){const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);for(let y=Math.max(0,Math.floor(Math.min(...ys)));y<=Math.min(h-1,Math.ceil(Math.max(...ys)));y++)for(let x=Math.max(0,Math.floor(Math.min(...xs)));x<=Math.min(w-1,Math.ceil(Math.max(...xs)));x++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)rect(x,y,1,1,col);}}
 function ellipse(x,y,rx,ry,col){for(let yy=Math.floor(y-ry);yy<=Math.ceil(y+ry);yy++)for(let xx=Math.floor(x-rx);xx<=Math.ceil(x+rx);xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)rect(xx,yy,1,1,col);}
 function line(x,y,xx,yy,col,w=1){const n=Math.max(1,Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))));for(let i=0;i<=n;i++)rect(Math.round(x+(xx-x)*i/n)-Math.floor(w/2),Math.round(y+(yy-y)*i/n)-Math.floor(w/2),w,w,col);}
 return {c,ctx,rect,poly,ellipse,line};
}
function actorCell(kind,dir,frame){
 const p=PALETTES[kind],s=cell(24,32),{rect,poly,line}=s;
 const side=dir===1||dir===2,back=dir===3,run=frame>=6&&frame<=9,walk=frame>=2&&frame<=5,attack=frame>=10&&frame<=12||frame>=16,cast=frame===14||frame===15,kick=frame>=16&&frame<=18,finish=frame>=19;
 const f=walk?(frame-2):run?(frame-6):0,step=[-3,0,3,0][f],bob=(walk||run)&&f%2===1?1:frame===1?1:0;
 const phase=kick?frame-16:finish?frame-19:attack?frame-10:cast?frame-14:0;const lean=side&&run?2:side&&attack?(phase===1?2:0):0;const hx=12+lean,hy=8+bob,bodyY=16+bob;
 // side frames are painted facing right, mirrored for left.
 function limb(x,y,xx,yy,c,w=4){line(x,y,xx,yy,ink,w+2);line(x,y,xx,yy,c,w);}
 if(side){
   limb(10,23,8-step,28,p.shade,3);rect(5-step,28,6,3,ink);rect(6-step,28,4,1,p.trim);
   limb(13,23,13+step,28,p.shirt,4);rect(11+step,28,6,3,ink);rect(12+step,28,4,1,'#657286');
   const ax=run?4:attack?[6,18,14][phase]:cast?15+phase:8-step,ay=run?20:attack?[20,17,21][phase]:cast?18:21;
   limb(10,bodyY+2,ax,ay,p.shade,3);
 }else{
   limb(9,23,8,28+(step>0?-1:0),p.shade,4);rect(5,28+(step>0?-1:0),6,3,ink);
   limb(14,23,15,28+(step<0?-1:0),p.shirt,4);rect(13,28+(step<0?-1:0),6,3,ink);
   rect(6,28+(step>0?-1:0),4,1,'#657286');rect(14,28+(step<0?-1:0),4,1,'#657286');
   limb(7,bodyY+2,run?5:attack?[8,4,6][phase]:6,run?18:22+(step>0?1:0),p.shade,3);
   limb(16,bodyY+2,run?19:attack?[15,21,18][phase]:17,run?18:cast?18-phase:22+(step<0?1:0),p.shirt,3);
 }
 // jacket silhouette, shoulder panels, zipper and belt.
 poly([[7+lean,bodyY],[16+lean,bodyY],[18,bodyY+4],[16,25],[8,25],[6,bodyY+4]],ink);
 poly([[8+lean,bodyY+1],[15+lean,bodyY+1],[16,bodyY+4],[15,24],[9,24],[7,bodyY+4]],p.shirt);
 rect(9,23,6,1,p.shade);rect(8+lean,bodyY+1,7,3,p.trim);
 if(kind==='npc'){rect(8,bodyY+4,4,5,p.shade);rect(13,bodyY+4,3,5,p.light);}
 else if(!back){rect(side?15:11,bodyY+4,1,6,p.trim);rect(side?14:10,bodyY+4,1,1,p.light);}
 else{rect(10,bodyY+4,4,4,'#a33337');rect(11,bodyY+5,2,2,p.light);}
 rect(8,24,8,1,p.trim);
 if(side){const x=run?4:attack?[8,21,17][phase]:cast?17+phase:16+step,y=run?22:attack?[18,16,21][phase]:cast?18-phase:22;limb(14+lean,bodyY+2,x,y,p.shirt,3);rect(x-1,y-1,3,3,skin);rect(x-1,y+1,3,1,skinShade);}
 else if(cast){rect(9,18,3,3,skin);rect(12,18,3,3,skin);rect(11,17,2,1,skinLight);}
 // Distinct combo poses, with the same palette and original 24×32 cell.
 if(kick&&phase===1){if(side){limb(13,23,22,19,p.shirt,4);rect(20,17,4,4,ink);rect(20,18,3,1,'#657286');}else{limb(14,23,19,back?18:26,p.shirt,4);rect(18,back?16:25,5,3,ink);}}
 if(finish&&phase===1){if(side){limb(11,18,21,13,p.shade,4);limb(15,18,22,15,p.shirt,4);rect(20,12,4,5,skin);}else{limb(8,19,5,13,p.shirt,4);limb(16,19,19,13,p.shirt,4);rect(3,11,4,4,skin);rect(18,11,4,4,skin);}}
 // rounded anime head, outline, shade and a readable face at tiny scale.
 poly([[hx-6,hy-3],[hx+4,hy-4],[hx+7,hy],[hx+6,hy+6],[hx+3,hy+9],[hx-4,hy+9],[hx-6,hy+5]],ink);
 poly([[hx-5,hy-2],[hx+4,hy-3],[hx+6,hy+1],[hx+5,hy+6],[hx+2,hy+8],[hx-3,hy+8],[hx-5,hy+5]],kind==='enemy'?p.trim:skin);
 if(!back&&kind!=='enemy'){rect(hx-4,hy+5,2,2,skinShade);rect(hx+3,hy+6,2,1,skinShade);rect(hx-3,hy+7,6,1,skinShade);}
 const hairPoints=kind==='enemy'?[[hx-6,hy-4],[hx+5,hy-4],[hx+7,hy],[hx+4,hy+2],[hx-5,hy+2]]:[[hx-7,hy-2],[hx-7,hy-6],[hx-4,hy-5],[hx-4,hy-8],[hx-1,hy-6],[hx+2,hy-9],[hx+3,hy-6],[hx+6,hy-8],[hx+6,hy-4],[hx+8,hy-5],[hx+7,hy+1],[hx+4,hy+3],[hx-5,hy+2]];
 poly(hairPoints,ink);
 poly(kind==='enemy'?[[hx-5,hy-3],[hx+4,hy-3],[hx+5,hy],[hx-4,hy+1]]:[[hx-6,hy-3],[hx-6,hy-5],[hx-3,hy-4],[hx-3,hy-6],[hx,hy-5],[hx+2,hy-7],[hx+3,hy-4],[hx+5,hy-6],[hx+5,hy-3],[hx+6,hy-3],[hx+5,hy+1],[hx-4,hy+1]],p.hair);
 rect(hx-4,hy-3,6,1,p.hairLight);rect(hx,hy-5,2,2,p.hairLight);
 if(back){rect(hx-5,hy+2,10,3,p.trim);rect(hx-1,hy+4,2,3,p.trim);rect(hx+1,hy+5,3,2,p.trim);rect(hx-4,hy+1,2,1,p.hairShade);}
 else{
   rect(hx-5,hy+1,11,3,p.trim);rect(side?hx+1:hx-3,hy+1,side?5:7,2,p.metal);rect(side?hx+3:hx,hy+1,1,1,'#536b79');
   if(side){rect(hx+2,hy+4,3,2,ink);rect(hx+3,hy+4,1,1,kind==='player'||kind==='clone'?'#61b8d7':'#d6d8ce');}
   else{rect(hx-4,hy+4,3,2,ink);rect(hx+2,hy+4,3,2,ink);rect(hx-3,hy+4,1,1,kind==='player'||kind==='clone'?'#61b8d7':'#d6d8ce');rect(hx+3,hy+4,1,1,kind==='player'||kind==='clone'?'#61b8d7':'#d6d8ce');}
   if(kind==='npc'||kind==='enemy'){rect(hx-4,hy+6,9,3,p.trim);if(kind==='npc')rect(hx-4,hy+3,4,3,p.trim);}
   else{rect(hx-4,hy+6,2,1,skinShade);rect(hx+3,hy+6,2,1,skinShade);rect(hx,hy+7,2,1,'#9d574e');}
 }
 if(frame===13){rect(2,10,2,2,'#ffe4bc');rect(20,13,2,2,'#ffe4bc');}
 if(dir===1){const out=cell(24,32);out.ctx.translate(24,0);out.ctx.scale(-1,1);out.ctx.drawImage(s.c,0,0);return out.c;}
 return s.c;
}
export function makeActorSheet(kind){
 const c=canvas(ACTOR_W*ACTOR_COLS,ACTOR_H*4),ctx=c.getContext('2d');
 for(let d=0;d<4;d++)for(let f=0;f<ACTOR_COLS;f++)ctx.drawImage(actorCell(kind,d,f),f*ACTOR_W,d*ACTOR_H);
 return c;
}
// High-speed, deliberately stretched silhouettes. 32x32, three frames per direction.
export function makeSmearSheet(){
 const c=canvas(32*3,32*4),ctx=c.getContext('2d');
 for(let d=0;d<4;d++)for(let f=0;f<3;f++){
   const s=cell(32,32),{poly,line,rect}=s;
   poly([[1,19],[9,14],[4,10],[21,12],[28,9],[31,14],[27,20],[31,24],[17,26],[2,25],[12,21]],'#343450');
   poly([[2,20],[16,15],[9,12],[23,13],[29,12],[27,18],[21,20],[29,23],[17,24]],f===0?'#bc553c':f===1?'#f48a37':'#ffd079');
   line(3,15,19,15,'#f9bd61',2);line(1,23,18,23,'#ffd98a');rect(23,11,5,3,'#f7d56a');rect(25,15,3,2,'#dbe7ee');
   s.ctx.save();s.ctx.globalAlpha=.8;s.ctx.drawImage(actorCell('player',d===1?2:d,6+f),8,0);s.ctx.restore();
   ctx.save();ctx.translate(f*32+(d===1?32:0),d*32);if(d===1)ctx.scale(-1,1);ctx.drawImage(s.c,0,0);ctx.restore();
 }
 return c;
}
export function makeFXSheet(){
 const c=canvas(32*8,32*FX_ROWS.length),ctx=c.getContext('2d');
 for(let row=0;row<FX_ROWS.length;row++)for(let f=0;f<8;f++){
   const s=cell(32,32),{ellipse,line,rect,poly}=s,t=f/7,angle=f*.77;
   if(row===0){
     const r=4+Math.sin(t*Math.PI)*10;
     ellipse(16,16,r,r,'#145aa4');ellipse(16,16,r-2,r-2,'#32a9e3');ellipse(16,16,Math.max(2,r*.62),Math.max(2,r*.62),'#8eefff');ellipse(16,16,Math.max(1,r*.31),Math.max(1,r*.31),'#f5ffff');
     for(let k=0;k<3;k++)for(let j=0;j<11;j++){const a=angle+k*2.094+j*.16,rr=r*.88+j*.12;rect(16+Math.cos(a)*rr,16+Math.sin(a)*rr,2,1,j%3===0?'#ffffff':'#b7f7ff');}
     for(let k=0;k<7;k++){const a=angle+k*.9,rr=r+2+(k%3);rect(16+Math.cos(a)*rr,16+Math.sin(a)*rr,1+(k%2),1,'#8ce8ff');}
   }else if(row===1){
     const radius=3+10*t;
     for(let k=0;k<8;k++){const a=k*Math.PI/4+.12*f,x=16+Math.cos(a)*radius*.65,y=18+Math.sin(a)*radius*.62,rr=Math.max(2,6-f*.45);ellipse(x,y,rr,rr*.8,'#798fa6');ellipse(x,y-1,rr-1,rr*.6,'#e3edf1');}
     if(f<4){ellipse(16,17,6,5,'#f5f5dd');line(5,22,27,22,'#b5d6dc');}
   }else if(row===2){
     const r=5+f*1.5;for(let k=0;k<8;k++){const a=k*Math.PI/4+.1;line(16+Math.cos(a)*r*.3,16+Math.sin(a)*r*.3,16+Math.cos(a)*r,16+Math.sin(a)*r,k%2?'#ed703e':'#ffd677',f<3?3:1);}
     if(f<3){ellipse(16,16,5-f,5-f,'#fff3b4');poly([[16,1],[18,13],[31,16],[18,19],[16,31],[13,19],[1,16],[13,13]],'#fff0be');}
   }else if(row===3){
     for(let j=0;j<6;j++){const y=6+j*4,x=2+(j%3)*3+f;line(x,y,Math.min(31,x+20-f),y-2,j%2?'#f5ab4f':'#ffe5a3',j%3===0?2:1);}
     if(f<4)poly([[3,16],[20,11],[31,16],[20,21]],'#ffc464');
   }else{
     for(let k=0;k<4;k++){const a=angle+k*Math.PI/2;poly([[16,16],[16+Math.cos(a)*13,16+Math.sin(a)*13],[16+Math.cos(a+.45)*5,16+Math.sin(a+.45)*5]],'#252e45');line(16+Math.cos(a)*4,16+Math.sin(a)*4,16+Math.cos(a)*11,16+Math.sin(a)*11,'#d4e4e9');}ellipse(16,16,3,3,'#8597a6');ellipse(16,16,1.5,1.5,'#273044');
   }
   ctx.drawImage(s.c,f*32,row*32);
 }
 return c;
}
// Three expressive foliage silhouettes; large clusters, 4 shades, no real-world texture.
export function makeTreeSheet(){
 const c=canvas(TREE_W*3,TREE_H),ctx=c.getContext('2d');
 const palettes=[['#253e3b','#396b49','#65934c','#9bb75d','#c2ce78'],['#29483e','#3c795b','#75a75b','#a6cb75','#c7d990'],['#533c44','#a15d67','#cd8791','#efb8ac','#ffe0ba']];
 for(let f=0;f<3;f++){const s=cell(40,48),{poly,rect,ellipse,line}=s,p=palettes[f];
  poly([[17,45],[15,47],[24,47],[22,44],[22,30],[26,25],[23,25],[20,32],[17,28],[15,28],[17,36]],'#634d43');rect(18,33,3,13,'#a57954');rect(19,34,1,10,'#c59a65');
  const clusters=[[11,23,10,9],[29,23,10,9],[20,13,13,12],[7,29,6,5],[31,30,8,6],[19,29,12,9]];
  for(const [x,y,rx,ry] of clusters){ellipse(x,y,rx,ry,p[0]);ellipse(x,y-1,rx-1,ry-1,p[1]);ellipse(x-1,y-3,rx-2,Math.max(2,ry-3),p[2]);}
  for(const [x,y] of [[8,18],[14,10],[25,8],[29,19],[17,24],[6,28],[27,27]]){poly([[x-3,y],[x,y-3],[x+5,y-2],[x+4,y+1],[x,y+3]],p[3]);rect(x,y-2,2,1,p[4]);}
  line(16,39,13,35,'#80604b',2);ctx.drawImage(s.c,f*40,0);
 }
 return c;
}
export function makeWorldPattern(){
 const c=canvas(64,16),ctx=c.getContext('2d');
 for(let y=0;y<16;y++)for(let x=0;x<64;x++){let k=Math.floor(x/16),u=x%16,v=y;let b=248;
   if(k===0)b=((u*13+v*7)%19===0)?211:248;
   if(k===1)b=(v%8===0||u%8===0)?204:250;
   if(k===2)b=(u%5===0)?205:(u+v*3)%11===0?230:250;
   if(k===3)b=(v%4===0||((u+(Math.floor(v/4)%2)*4)%8===0))?190:248;
   ctx.fillStyle='rgb('+b+','+b+','+b+')';ctx.fillRect(x,y,1,1);
 }
 return c;
}
export function makeSheets(){return {player:makeActorSheet('player'),npc:makeActorSheet('npc'),enemy:makeActorSheet('enemy'),clone:makeActorSheet('clone'),smear:makeSmearSheet(),fx:makeFXSheet(),trees:makeTreeSheet(),world:makeWorldPattern()};}
