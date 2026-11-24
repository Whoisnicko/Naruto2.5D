// Original, deterministic pixel sheets. All primitives rasterize on integer pixels;
// no generated image or third-party character assets are needed.
export const ACTOR_W=24,ACTOR_H=32,ACTOR_COLS=44,DIRS=['down','left','right','up'];
export const ANIMS={idle:{start:0,count:2,fps:3},walk:{start:2,count:4,fps:9},run:{start:6,count:4,fps:13},attack:{start:10,count:3,fps:14},hit:{start:13,count:1,fps:1},cast:{start:14,count:2,fps:9},kick:{start:16,count:3,fps:14},finish:{start:19,count:3,fps:12},thrust:{start:22,count:4,fps:12},release:{start:26,count:4,fps:12},seal:{start:30,count:4,fps:10},slam:{start:34,count:4,fps:12},rasengan:{start:38,count:6,fps:12}};
export const FX_ROWS=['rasengan','clone','hit','dash','shuriken','wind','kunai','substitute','giant','water','ice','lightning','fire','heal','earth','focus','shockwave','sparks','slash','firetrail','dragon','wall','cracks','aura','storm'];
export const FX_SIZE=32,FX_COLS=8;
export const TECH_ART={
 naruto:{' ':{pose:'thrust',fx:'rasengan'},f:{pose:'release',fx:'wind'},l:{pose:'seal',fx:'clone'},g:{pose:'thrust',fx:'giant'}},
 sasuke:{' ':{pose:'thrust',fx:'lightning'},f:{pose:'release',fx:'fire'},l:{pose:'seal',fx:'focus'},g:{pose:'slam',fx:'storm'}},
 sakura:{' ':{pose:'slam',fx:'earth'},f:{pose:'slam',fx:'cracks'},l:{pose:'seal',fx:'heal'},g:{pose:'slam',fx:'cracks'}},
 kakashi:{' ':{pose:'thrust',fx:'lightning'},f:{pose:'release',fx:'dragon'},l:{pose:'seal',fx:'wall'},g:{pose:'slam',fx:'storm'}}
};
export function artFor(character,key){return TECH_ART[character]?.[key]||null;}
export const TREE_W=40,TREE_H=48;
const ink='#273044',skin='#f7c08a',skinShade='#bc795d',skinLight='#ffe0a8';
const PALETTES={
 lee:{hair:'#27372f',hairLight:'#4e6654',hairShade:'#1a2826',shirt:'#5b9b52',shade:'#35633d',light:'#a5c675',trim:'#d08041',metal:'#d9d9c8'},
 neji:{hair:'#5f463f',hairLight:'#997466',hairShade:'#3c3031',shirt:'#e1d8bb',shade:'#9c9a86',light:'#f7ebcf',trim:'#63716b',metal:'#c7d4d8'},
 gaara:{hair:'#aa4b42',hairLight:'#d47b62',hairShade:'#70383b',shirt:'#95624e',shade:'#65463e',light:'#c8a37b',trim:'#e1caa5',metal:'#c6c0ab'},
 sasuke:{hair:'#35384e',hairLight:'#777a9b',hairShade:'#23283b',shirt:'#465a8e',shade:'#303c67',light:'#8393bf',trim:'#e2dcca',metal:'#c3cbd7'},
 player:{hair:'#f4c848',hairLight:'#fff0a1',hairShade:'#bf8739',shirt:'#f58b36',shade:'#b94b30',light:'#ffb650',trim:'#26344c',metal:'#bacfd3'},
 npc:{hair:'#c4d3df',hairLight:'#f0f4f8',hairShade:'#8495ae',shirt:'#78935a',shade:'#475e46',light:'#a5ba76',trim:'#26344c',metal:'#c6d6dd'},
 enemy:{hair:'#34364d',hairLight:'#69627e',hairShade:'#262839',shirt:'#665272',shade:'#3d354f',light:'#93748a',trim:'#29283c',metal:'#b8b6c6'},
 thrower:{hair:'#4d625d',hairLight:'#91b5a1',hairShade:'#304840',shirt:'#427a71',shade:'#284b4d',light:'#7fbaa6',trim:'#263644',metal:'#ced6ce'},
 guard:{hair:'#70494f',hairLight:'#b68176',hairShade:'#422d3c',shirt:'#97564b',shade:'#58373f',light:'#c98468',trim:'#352c39',metal:'#e0c293'},
 sakura:{hair:'#df7b92',hairLight:'#ffc0bb',hairShade:'#ad536f',shirt:'#c64e5f',shade:'#86364b',light:'#e88b85',trim:'#57394d',metal:'#e9d4cf'},
 teuchi:{hair:'#e9dec2',hairLight:'#fff7e7',hairShade:'#b6a78e',shirt:'#e5d7b9',shade:'#99876e',light:'#f8efda',trim:'#695646',metal:'#ede1c5'},
 tenten:{hair:'#593e39',hairLight:'#a57b65',hairShade:'#3b2830',shirt:'#ddadad',shade:'#a66877',light:'#ffe1c9',trim:'#4d4453',metal:'#cfdae1'},
 iruka:{hair:'#684536',hairLight:'#a47853',hairShade:'#392e35',shirt:'#779768',shade:'#43594d',light:'#a1be8a',trim:'#354457',metal:'#c0d2d7'},
 zabuza:{hair:'#313746',hairLight:'#6a7781',hairShade:'#222737',shirt:'#687e87',shade:'#384c5b',light:'#9eafb6',trim:'#344051',metal:'#d5dde0'},
 haku:{hair:'#272d3e',hairLight:'#67748a',hairShade:'#1d2434',shirt:'#6a9e8c',shade:'#385f60',light:'#a3cfb4',trim:'#6a455d',metal:'#e8e8dc'},
 shikamaru:{hair:'#34393b',hairLight:'#626966',hairShade:'#242a30',shirt:'#859673',shade:'#4a5c50',light:'#b1c09b',trim:'#343b45',metal:'#c4c9be'},
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
function actorCell(kind,dir,frame,gear=null,kyubi=false){
 const ras=frame>=38?frame-38:-1;if(ras>=0)frame=[14,14,14,7,12,0][ras];
 const special=frame>=22?Math.floor((frame-22)/4):-1,stage=frame>=22?(frame-22)%4:0;if(special>=0)frame=[14,14,15,14][stage];
 const role=kind;const p=PALETTES[kind],s=cell(24,32),{rect,poly,line}=s;if(kind==='guard'||kind==='thrower')kind='enemy';
 const side=dir===1||dir===2,back=dir===3,run=frame>=6&&frame<=9,walk=frame>=2&&frame<=5,attack=frame>=10&&frame<=12||frame>=16,cast=frame===14||frame===15,kick=frame>=16&&frame<=18,finish=frame>=19;
 const f=walk?(frame-2):run?(frame-6):0,step=[-3,0,3,0][f],bob=(walk||run)&&f%2===1?1:frame===1?1:0;
 const phase=kick?frame-16:finish?frame-19:attack?frame-10:cast?frame-14:0;const lean=ras>=0&&kind==='player'?(side?[0,-1,0,3,2,0][ras]:0):side&&run?2:side&&attack?(phase===1?2:0):0;const hx=12+lean,hy=8+bob,bodyY=16+bob;
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
   if(side){rect(hx+2,hy+4,3,2,ink);rect(hx+3,hy+4,1,1,kind==='player'||kind==='clone'?(kyubi?'#ed3d43':'#61b8d7'):'#d6d8ce');}
   else{rect(hx-4,hy+4,3,2,ink);rect(hx+2,hy+4,3,2,ink);rect(hx-3,hy+4,1,1,kind==='player'||kind==='clone'?(kyubi?'#ed3d43':'#61b8d7'):'#d6d8ce');rect(hx+3,hy+4,1,1,kind==='player'||kind==='clone'?(kyubi?'#ed3d43':'#61b8d7'):'#d6d8ce');}
   if(kind==='npc'||kind==='enemy'){rect(hx-4,hy+6,9,3,p.trim);if(kind==='npc')rect(hx-4,hy+3,4,3,p.trim);}
   else{rect(hx-4,hy+6,2,1,skinShade);rect(hx+3,hy+6,2,1,skinShade);rect(hx,hy+7,2,1,'#9d574e');}
 }
 if(role==='sakura'){rect(hx-6,hy-1,2,8,p.hairShade);rect(hx+5,hy-1,2,8,p.hair);rect(hx-5,hy-2,10,3,p.hair);rect(hx-2,hy-3,4,2,p.hairLight);}if(role==='teuchi'){rect(hx-6,hy-6,12,7,p.hair);rect(hx-7,hy-1,14,2,p.hairLight);rect(9,bodyY+3,7,7,'#f3ead8');}if(role==='tenten'){rect(hx-7,hy-7,4,5,p.hair);rect(hx+4,hy-7,4,5,p.hair);rect(hx-6,hy-6,2,2,p.hairLight);}if(role==='iruka'){rect(hx-1,hy-8,4,5,p.hair);if(!back)rect(hx-3,hy+6,7,1,'#a66c56');}
 if(role==='zabuza'){rect(hx-5,hy+5,11,5,'#d6d9cf');rect(hx-4,hy+6,9,1,'#87999c');line(side?17:19,8,side?21:21,25,'#344051',4);line(side?17:19,8,side?21:21,22,'#b5ced5',3);rect(19,25,3,4,'#795c50');}if(role==='haku'){if(!back){rect(hx-4,hy+1,8,9,'#e7e8dc');rect(hx-3,hy+3,2,1,'#554253');rect(hx+1,hy+3,2,1,'#554253');rect(hx-1,hy+6,2,2,'#b06b78');}rect(hx-6,hy,2,11,p.hair);rect(hx+5,hy,2,11,p.hairShade);}
 if(role==='shikamaru'){rect(hx-2,hy-8,4,5,p.hair);rect(hx-3,hy-7,6,2,p.hairShade);rect(hx-1,hy-9,2,2,p.hairLight);rect(9,bodyY+5,6,2,p.shade);}
 if(role==='guard'){rect(6,17,12,3,p.metal);rect(5,19,3,5,p.shade);rect(16,19,3,5,p.shade);}if(role==='thrower'){rect(6,22,3,4,p.metal);rect(15,22,3,4,p.metal);}
 if(role==='lee'){rect(hx-6,hy-5,12,6,p.hair);rect(hx-5,hy-4,10,1,p.hairLight);if(!back){rect(hx-4,hy+3,3,1,ink);rect(hx+2,hy+3,3,1,ink);}rect(7,25,3,3,p.trim);rect(14,25,3,3,p.trim);}
 if(role==='neji'){rect(hx-6,hy,2,12,p.hair);rect(hx+5,hy,2,12,p.hairShade);if(!back){rect(hx-3,hy+4,2,1,'#e7e6ea');rect(hx+3,hy+4,2,1,'#e7e6ea');}}
 if(role==='gaara'){rect(5,17,4,10,'#bd9c68');rect(4,19,5,6,'#d0b58a');rect(5,16,3,2,'#8d6348');if(!back)rect(hx+3,hy-1,2,2,'#a74646');}
 if(role==='sasuke'){if(!back){rect(hx-5,hy-2,3,5,p.hair);rect(hx+4,hy-2,2,6,p.hairShade);rect(hx+3,hy+4,1,1,'#bc6a72');}else{rect(10,bodyY+4,4,2,'#b65a55');rect(11,bodyY+6,2,2,'#e9dfd1');}rect(8,24,8,2,'#c7c7d6');}
 if(gear&&['player','sasuke','sakura','npc'].includes(role)){
 const {head,torso,legs,feet,weapon,offhand,accessory}=gear;
 if(head){rect(hx-5,hy+1,11,3,head.accent);rect(side?hx+1:hx-3,hy+1,side?5:7,2,head.color);rect(hx+1,hy+1,1,1,'#ecf6eb');}
 if(torso){poly([[8+lean,bodyY+2],[15+lean,bodyY+2],[16,bodyY+5],[15,24],[9,24],[7,bodyY+5]],torso.color);rect(9,bodyY+5,3,3,torso.accent);rect(13,bodyY+5,2,3,torso.accent);rect(12,bodyY+3,1,5,ink);}
 if(legs){if(side){line(10,24,8-step,27,legs.color,2);line(13,24,13+step,27,legs.color,3);}else{rect(7,25,4,3,legs.color);rect(13,25,4,3,legs.color);}}
 if(feet){if(side){rect(6-step,28,4,2,feet.color);rect(12+step,28,4,2,feet.color);}else{rect(6,28+(step>0?-1:0),4,2,feet.color);rect(14,28+(step<0?-1:0),4,2,feet.color);}}
 if(weapon){const wx=side?(run?5:attack?[8,21,17][phase]:cast?17+phase:16+step):17,wy=side?(run?22:attack?[18,16,21][phase]:cast?18-phase:22):22;line(wx,wy,Math.min(23,wx+2),Math.max(1,wy-6),weapon.accent,3);line(wx,wy-1,Math.min(23,wx+2),Math.max(1,wy-6),weapon.color,1);}
 if(offhand){rect(side?8:5,bodyY+5,3,3,offhand.accent);rect(side?9:6,bodyY+5,2,2,offhand.color);}
 if(accessory){rect(11,bodyY+3,2,3,accessory.accent);rect(11,bodyY+4,2,2,accessory.color);}
 }
 // Four additional pose families. Paint arms over torso, keeping equipment and the pixel silhouette.
 if(special>=0&&stage!==3){
  const sleeve=gear?.torso?.color||p.shirt,accent=gear?.offhand?.color||p.shade;
  if(special===0){ // wind-up, reach, follow-through
   const tx=side?[12,21,20][stage]:[12,12,13][stage],ty=side?[19,15,19][stage]:back?[18,11,14][stage]:[19,24,22][stage];
   limb(15,18,tx,ty,sleeve,3);rect(tx-1,ty-1,3,3,skin);rect(tx,ty-1,1,1,skinLight);limb(8,18,side?5:8,21,accent,2);
   if(stage===1){rect(5,29,6,2,ink);rect(16,28,6,3,ink);}
  }else if(special===1){ // throw / elemental release
   const x=side?[9,21,19][stage]:[11,19,17][stage],y=[13,15,19][stage];
   limb(15,18,x,y,sleeve,3);rect(x-1,y-1,3,3,skin);limb(8,18,side?7:5,stage===0?15:20,accent,2);
  }else if(special===2){ // hand seals and opening palms
   const spread=[2,4,7][stage],y=[19,16,15][stage];
   limb(8,18,12-spread,y,accent,3);limb(16,18,12+spread,y,sleeve,3);rect(11-spread,y-1,3,3,skin);rect(11+spread,y-1,3,3,skin);
  }else{ // raised fists, downward strike, braced recovery
   const x=side?[16,22,19][stage]:[17,13,16][stage],y=[10,26,23][stage];
   limb(15,18,x,y,sleeve,4);rect(x-1,y-1,3,4,skin);limb(8,18,stage===0?5:7,stage===0?11:23,accent,3);
   if(stage===1){rect(5,28,6,3,ink);rect(16,28,6,3,ink);}
  }
 }
 // Dedicated Rasengan key poses, keeping the existing head, silhouette and equipment.
 if(ras>=0&&role==='player'){
  const sleeve=gear?.torso?.color||p.shirt,shade=gear?.offhand?.color||p.shade,leg=gear?.legs?.color||p.shirt,shoe=gear?.feet?.color||p.trim;
  if(side){
   const hand=[[11,20],[9,18],[14,16],[21,15],[22,17],[17,21]][ras],other=[[14,19],[13,17],[16,16],[8,20],[6,22],[10,21]][ras];
   limb(8+lean,18,other[0],other[1],shade,3);rect(other[0]-1,other[1]-1,3,3,skin);
   limb(15+lean,18,hand[0],hand[1],sleeve,3);rect(hand[0]-1,hand[1]-1,3,3,skin);rect(hand[0],hand[1]-1,2,1,skinLight);
   if(ras===3||ras===4){limb(10,23,4,28,leg,3);rect(1,28,7,3,ink);rect(2,28,5,1,shoe);limb(15,23,19,27,leg,4);rect(17,28,6,3,ink);rect(18,28,4,1,shoe);}
  }else{
   const y=back?[20,18,15,10,12,21][ras]:[20,19,19,24,25,21][ras],x=back?[12,12,12,13,14,14][ras]:[12,11,12,13,14,16][ras];
   limb(8,18,ras<3?x-2:5,ras<3?y:22,shade,3);limb(16,18,x,y,sleeve,3);rect(x-1,y-1,3,3,skin);rect(x,y-1,2,1,skinLight);
   if(ras<3)rect(x-3,y-1,2,3,skin);
   if(ras===3||ras===4){limb(9,23,6,28,leg,4);limb(14,23,18,28,leg,4);rect(3,28,6,3,ink);rect(16,28,6,3,ink);rect(4,28,4,1,shoe);rect(17,28,4,1,shoe);}
  }
 }
 if(frame===13){rect(2,10,2,2,'#ffe4bc');rect(20,13,2,2,'#ffe4bc');}
 if(dir===1){const out=cell(24,32);out.ctx.translate(24,0);out.ctx.scale(-1,1);out.ctx.drawImage(s.c,0,0);return out.c;}
 return s.c;
}
export function makeActorSheet(kind,gear=null,kyubi=false){
 const c=canvas(ACTOR_W*ACTOR_COLS,ACTOR_H*4),ctx=c.getContext('2d');
 for(let d=0;d<4;d++)for(let f=0;f<ACTOR_COLS;f++)ctx.drawImage(actorCell(kind,d,f,gear,kyubi),f*ACTOR_W,d*ACTOR_H);
 return c;
}
// High-speed, deliberately stretched silhouettes. 32x32, three frames per direction.
// Rasengan reference atlas: discrete pixel ribbons, not a blurred glow or HD character.
export const RAS_SIZE=48,RAS_COLS=12,RAS_ROWS=6;
export function rasenganPose(anim){const e=Math.max(0,anim.total-anim.left),w=anim.windup||.26;return e<w?Math.min(2,Math.floor(e/w*3)):3+Math.min(2,Math.floor((e-w)/Math.max(.001,anim.total-w)*3));}
export function rasenganHand(dir,pose){const d=dir===1?-1:dir===2?1:0;return {x:d*[0,-.22,.12,.66,.74,.38][pose],y:[.96,1.08,1.22,1.27,1.13,.86][pose],z:dir===0?[.22,.3,.39,.7,.75,.32][pose]:dir===3?-[.2,.32,.44,.72,.65,.3][pose]:0};}
export function makeRasenganSheet(purple=false){
 const atlas=canvas(RAS_SIZE*RAS_COLS,RAS_SIZE*RAS_ROWS),ctx=atlas.getContext('2d');ctx.imageSmoothingEnabled=false;
 const palette=purple?['#30134f','#5a258f','#9144d8','#c17aff','#ffffff','#ffffff']:['#17488d','#236db7','#329ed9','#80d8ff','#c7f4ff','#ffffff'];
 const ribbon=[[0,-13],[5,-12],[10,-9],[13,-4],[12,2],[8,7],[3,8],[-2,5],[-3,1],[0,-2],[4,-1]];
 const arc=[[0,-14],[6,-13],[11,-9],[14,-3],[14,3],[10,9],[4,13],[-3,14],[-10,10],[-14,3],[-13,-4],[-9,-10],[-4,-13]];
 for(let row=0;row<RAS_ROWS;row++)for(let f=0;f<12;f++){
  const c=cell(48,48),{rect,line,ellipse,poly}=c,q=f/11;
  function stroke(path,angle,sx,sy,ox,oy,col,w){const pts=path.map(([x,y])=>[ox+(x*Math.cos(angle)-y*Math.sin(angle))*sx,oy+(x*Math.sin(angle)+y*Math.cos(angle))*sy]);for(let i=1;i<pts.length;i++)line(...pts[i-1],...pts[i],col,w);}
  if(row===0){
   const size=14+Math.sin(f*Math.PI/6)*.65,cx=24,cy=24;ellipse(cx,cy,size+1,size+1,palette[0]);ellipse(cx,cy,size,size,palette[1]);ellipse(cx-1,cy-1,size*.87,size*.87,palette[2]);if(!purple){ellipse(cx-1,cy-1,size*.64,size*.64,palette[3]);ellipse(cx,cy,size*.35,size*.35,palette[4]);}
   for(let k=0;k<3;k++){const angle=f*.82+k*2.094;stroke(ribbon,angle,size/14,size/14,cx,cy,palette[1],3);stroke(ribbon,angle+.12,size/14,size/14,cx,cy,palette[4],2);stroke(ribbon.slice(2,8),angle+.12,size/14,size/14,cx,cy,palette[5],1);}
   ellipse(cx-1,cy,size*.23,size*.27,palette[5]);for(let k=0;k<5;k++){const ang=f*.6+k*1.26,r=size+3+(k%2)*2;line(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r,cx+Math.cos(ang+.15)*r,cy+Math.sin(ang+.15)*r,purple?palette[3]:palette[5],1);}
  }else if(row===1){
   // Forward burst. Bright, compact contact flash gives way to torn cyan ribbons.
   const r=4+q*16,cy=24,cx=18+q*5;
   if(f<5){const s=1+f*.85;poly([[cx-s*4,cy],[cx-s,cy-s],[cx,cy-s*4],[cx+s,cy-s],[cx+s*5,cy],[cx+s,cy+s],[cx,cy+s*4],[cx-s,cy+s]],palette[3]);ellipse(cx,cy,s*1.9,s*1.6,palette[5]);}
   for(let k=0;k<3;k++){const ang=f*.26+k*2.094;const section=arc.slice(k,Math.max(k+2,11-Math.floor(q*5)));stroke(section,ang,r/14,r*.78/14,cx,cy,palette[0],f<6?4:2);stroke(section,ang+.04,r/14,r*.78/14,cx,cy,palette[f<7?3:2],f<6?2:1);if(f<8)stroke(section.slice(1,5),ang+.05,r/14,r*.78/14,cx,cy,palette[5],1);}
   for(let k=0;k<8;k++){const angle=(k-3.5)*.38+f*.04,len=4+(k%3)*3,rr=6+q*14;const x=cx+Math.cos(angle)*rr,y=cy+Math.sin(angle)*rr;line(x-len*(1-q*.65),y-Math.sin(angle)*len,x,y,palette[k%3===0?5:3],f<4?2:1);}
  }else if(row===2){
   const r=4+q*17;for(let k=0;k<4;k++){const seg=arc.slice(k*2,k*2+5);stroke(seg,k*1.57+q*.5,r/14,r*.42/14,24,28,palette[2],2);if(f<9)stroke(seg,k*1.57+q*.5,r/14,r*.42/14,24,27,palette[4],1);}
   for(let k=0;k<7;k++){const ang=k*2.4,rr=4+q*17,x=24+Math.cos(ang)*rr,y=28+Math.sin(ang)*rr*.4-q*4;rect(x,y,2,1,k%2?'#c9c1a4':'#92bed1');}
  }else if(row===3){
   // Orbiting torn ribbons, with bright tips and a dark blue pixel outline.
   for(let k=0;k<4;k++){const angle=f*.61+k*1.57;const path=arc.slice(k, k+5);stroke(path,angle,1.28,1.18,24,24,palette[0],4);stroke(path,angle+.04,1.28,1.18,24,24,purple?palette[3]:palette[4],2);stroke(path.slice(1,4),angle+.04,1.28,1.18,24,24,palette[5],purple?1:2);}
  }else if(row===4){
   for(let k=0;k<10;k++){const angle=k*2.399+f*.41,rad=14+(k%4)*2.2,x=24+Math.cos(angle)*rad,y=24+Math.sin(angle)*rad;line(x,y,x+Math.cos(angle+.8)*4,y+Math.sin(angle+.8)*4,palette[k%3===0?5:3],k%3===0?2:1);rect(x-1,y-1,1,1,palette[4]);}
  }else{
   // Directional streaming tails pointing opposite the carry direction.
   for(let k=0;k<7;k++){const y=10+k*4+Math.sin(f*.9+k)*3,x=34+(k%3)*3,len=13+(k%4)*4;poly([[x,y],[x-len*.6,y-2],[x-len,y+1],[x-3,y+3]],palette[0]);line(x-len,y+1,x-2,y,palette[3],2);line(x-len*.55,y,x,y,palette[5],1);}
  }
  ctx.drawImage(c.c,f*48,row*48);
 }
 return atlas;
}
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
   }else if(row===5){for(let k=0;k<3;k++)for(let j=0;j<15;j++){const a=angle+k*2.094+j*.11,r=5+j*.61;rect(16+Math.cos(a)*r,16+Math.sin(a)*r,2,2,j%3?'#a9e8cb':'#f1fff2');}ellipse(16,16,4,4,'#5cbba5');}
   else if(row===6){poly([[16,1],[20,18],[16,25],[12,18]],'#c3c9cc');line(16,3,16,22,'#f6d7a7',2);rect(14,21,4,7,'#7b4447');ellipse(16,28,3,2,'#292c3d');}
   else if(row===7){rect(10,6,12,21,'#69483d');rect(12,7,8,19,'#9f7852');line(14,9,14,24,'#c69c68',2);for(let k=0;k<6;k++){const a=k*1.047+angle;ellipse(16+Math.cos(a)*(4+f*1.4),16+Math.sin(a)*(4+f),Math.max(2,5-f*.4),3,'#dce6e2');}}
   else if(row===8){const r=5+Math.sin(Math.PI*t)*9;ellipse(16,16,r,r,'#1d5eae');ellipse(16,16,r*.83,r*.83,'#3cbae7');ellipse(16,16,r*.55,r*.55,'#b9fbff');ellipse(16,16,r*.25,r*.25,'#ffffff');for(let k=0;k<4;k++)for(let j=0;j<14;j++){const a=angle+k*Math.PI/2+j*.13,rr=r*.67+j*.32;rect(16+Math.cos(a)*rr,16+Math.sin(a)*rr,2,2,j%2?'#d7ffff':'#76c6f8');}for(let k=0;k<8;k++){const a=k*Math.PI/4+angle;line(16+Math.cos(a)*r,16+Math.sin(a)*r,16+Math.cos(a)*15,16+Math.sin(a)*15,'#e4ffff');}}
   else if(row===9){const radius=5+f*1.25;for(let k=0;k<4;k++)for(let j=0;j<12;j++){const a=angle*.55+k*Math.PI/2+j*.13,rr=radius+j*.23;const x=16+Math.cos(a)*rr,y=16+Math.sin(a)*rr*.76;rect(x,y,3,3,'#285b83');rect(x,y,2,2,j%3?'#5cc7e1':'#e4fbf6');}for(let k=0;k<6;k++){const a=k*1.05+angle;rect(16+Math.cos(a)*(radius+3),16+Math.sin(a)*(radius+3),2,2,'#b7e7e9');}}
   else if(row===10){for(let k=0;k<6;k++){const a=k*Math.PI/3+angle*.12,r=4+f*1.55,x=16+Math.cos(a)*r,y=16+Math.sin(a)*r;poly([[x,y-6],[x+3,y-1],[x+1,y+5],[x-3,y+1]],'#4f92b5');poly([[x,y-5],[x+2,y-1],[x,y+3],[x-1,y-1]],'#e1f7ff');rect(x,y-3,1,2,'#ffffff');}ellipse(16,16,Math.max(1,5-f*.4),Math.max(1,5-f*.4),'#b7f3ff');}
   else if(row===11){for(let k=0;k<7;k++){const a=k*Math.PI*2/7+angle,r=5+f*1.2,x=16+Math.cos(a)*r,y=16+Math.sin(a)*r;line(16,16,x-3,y+2,'#5967d8',3);line(x-3,y+2,x+2,y-3,'#82caff',2);line(x+2,y-3,x+3,y,'#edffff');}ellipse(16,16,4,4,'#e6fbff');}
   else if(row===12){const r=5+f*.9;ellipse(16,18,r,r*.7,'#a44339');ellipse(16,17,r*.8,r*.65,'#ee793e');for(let k=0;k<5;k++){const x=7+k*4,y=10+Math.sin(k+f)*3;poly([[x-3,20],[x,y-4],[x+3,20]],'#ffc15c');}ellipse(16,18,r*.4,r*.35,'#fff4bd');}
   else if(row===13){for(let k=0;k<8;k++){const a=k*.785+angle,r=5+f*1.4;rect(16+Math.cos(a)*r,16+Math.sin(a)*r,2,2,'#a4f8b9');}rect(14,7,4,18,'#60c795');rect(7,14,18,4,'#60c795');rect(15,8,2,16,'#e0ffe6');rect(8,15,16,2,'#e0ffe6');}
   else if(row===14){for(let k=0;k<9;k++){const a=k*.698+angle*.2,r=4+f*1.45,x=16+Math.cos(a)*r,y=16+Math.sin(a)*r*.8;rect(x,y,4,3,'#755c4d');rect(x,y-1,3,2,'#d6b38b');}if(f<4)ellipse(16,16,5-f,3,'#fff0ba');}
   else if(row===15){ellipse(16,16,10+f*.3,10+f*.3,'#772d4c');ellipse(16,16,8,8,'#c14b61');ellipse(16,16,3,3,'#2e263e');for(let k=0;k<3;k++){const a=k*2.094+angle;ellipse(16+Math.cos(a)*6,16+Math.sin(a)*6,2,2,'#30273a');}}
   else if(row===16){const r=3+f*1.65;for(let k=0;k<48;k++){const a=k*Math.PI/24,rr=r+(k%4===0?1:0);rect(16+Math.cos(a)*rr,16+Math.sin(a)*rr*.55,2,f<3?2:1,k%3?'#e9f9ed':'#8eb7b9');}if(f<3)ellipse(16,16,4-f,2,'#fff8d9');}
   else if(row===17){for(let k=0;k<9;k++){const a=k*2.4+f*.18,r=3+f*1.5+(k%3),x=16+Math.cos(a)*r,y=16+Math.sin(a)*r;line(x,y,x+Math.cos(a)*3,y+Math.sin(a)*3,k%2?'#fff8ce':'#9be9f7',f<3?2:1);}}
   else if(row===18){for(let k=0;k<30;k++){const a=-1.1+k*.074+f*.23,r=8+f*.55;rect(16+Math.cos(a)*r,16+Math.sin(a)*r,3,2,k%3?'#f3fff7':'#88c5d6');}if(f<4)line(10,24,26,7,'#fff2c5',2);}
   else if(row===19){for(let k=0;k<7;k++){const x=3+k*4,y=16+Math.sin(k*2+angle)*(4+k*.3);poly([[x-3,y],[x+3,y-5],[x+5,y+3],[x,y+6]],'#a84b40');poly([[x-1,y],[x+3,y-3],[x+4,y+2]],k%2?'#f9b05b':'#ffde85');}}
   else if(row===20){for(let k=0;k<13;k++){const x=3+k*2,y=18+Math.sin(k*.6-angle)*5;ellipse(x,y,3.2,3.2,'#275d85');ellipse(x,y-1,2.2,2.2,k%2?'#a2edeb':'#4fb9dd');}poly([[20,12],[25,8],[30,10],[31,15],[25,19],[21,17]],'#95e5ec');rect(27,12,2,2,'#eafff1');rect(28,12,1,1,'#28435d');line(25,15,31,15,'#23557b',2);}
   else if(row===21){for(let j=0;j<3;j++)for(let i=0;i<4;i++){const x=2+i*7+(j%2)*2,y=25-j*7-Math.min(f,3)*2;rect(x,y,7,6,'#675b50');rect(x,y,6,5,'#ab9072');rect(x,y,6,1,'#dac39b');}for(let k=0;k<6;k++)rect(3+k*5,27-f,2,2,'#d8bc94');}
   else if(row===22){for(let k=0;k<8;k++){const a=k*Math.PI/4+f*.04,r=4+f*1.4,x=16+Math.cos(a)*r,y=16+Math.sin(a)*r*.62;line(16,16,x-3,y+2,'#594f49',2);line(x-3,y+2,x,y,'#d8ac77',2);rect(x,y-2-(f%3),3,3,'#b89b77');}if(f<3)ellipse(16,15,5-f,4-f,'#fff0be');}
   else if(row===23){for(let k=0;k<12;k++){const a=k*Math.PI/6+angle,r=9+Math.sin(k+f)*2;line(16+Math.cos(a)*r,18+Math.sin(a)*r*.65,16+Math.cos(a)*r*.8,9+Math.sin(a)*r*.5,'#a5e8bc',k%3===0?2:1);}}
   else if(row===24){for(let k=0;k<8;k++){const a=k*Math.PI/4+f*.12,r=5+f*1.35,x=16+Math.cos(a)*r,y=16+Math.sin(a)*r;line(16,16,x-3,y+2,'#48478e',3);line(x-3,y+2,x+2,y-2,'#83cfff',2);line(x+2,y-2,x,y,'#f7ffff',2);}if(f<5)ellipse(16,16,4,4,'#f1fbff');}
   else{
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
export function makeSheets(){return {player:makeActorSheet('player'),sasuke:makeActorSheet('sasuke'),lee:makeActorSheet('lee'),neji:makeActorSheet('neji'),gaara:makeActorSheet('gaara'),npc:makeActorSheet('npc'),enemy:makeActorSheet('enemy'),thrower:makeActorSheet('thrower'),guard:makeActorSheet('guard'),clone:makeActorSheet('clone'),sakura:makeActorSheet('sakura'),teuchi:makeActorSheet('teuchi'),tenten:makeActorSheet('tenten'),iruka:makeActorSheet('iruka'),zabuza:makeActorSheet('zabuza'),haku:makeActorSheet('haku'),shikamaru:makeActorSheet('shikamaru'),smear:makeSmearSheet(),fx:makeFXSheet(),trees:makeTreeSheet(),world:makeWorldPattern()};}
