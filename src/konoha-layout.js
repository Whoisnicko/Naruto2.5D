// World 2 / blockout. Coordinates in logical tiles, north is negative Y.
export const MAP={width:144,height:84,scenicNorth:24,tilePixels:16,spawn:[72,78],walkSpeed:4.8,runSpeed:8.4,radius:.48};
export const boundary=[[0,16,3,48],[3,3,13,3],[16,0,112,3],[128,3,13,3],[141,6,3,34],[141,48,3,20],[128,81,13,3],[78,81,50,3],[16,81,50,3],[3,78,13,3],[0,64,3,14],[3,64,3,14],[138,68,3,13],[3,6,3,10]];
export const zones=[
 {id:'gate',name:'Puerta de Konoha',at:[72,78],kind:'entry',desc:'Entrada principal y conexión futura al exterior.',bounds:[60,70,24,11]},
 {id:'avenue',name:'Avenida central',at:[72,64],kind:'route',desc:'Eje principal, conecta la puerta con el corazón de la aldea.',bounds:[67,52,10,18]},
 {id:'plaza',name:'Plaza central',at:[72,43],kind:'hub',desc:'Centro de misiones y encuentro con Kakashi.',bounds:[57,34,30,19]},
 {id:'tower',name:'Torre del Hokage',at:[72,26],kind:'story',desc:'Escalinata y acceso al edificio administrativo.',bounds:[58,7,28,21]},
 {id:'academy',name:'Academia Ninja',at:[47,31],kind:'story',desc:'Tutoriales y exámenes. Patio propio.',bounds:[40,7,17,25]},
 {id:'hospital',name:'Hospital',at:[97,30],kind:'support',desc:'Recuperación y misiones médicas.',bounds:[88,8,19,23]},
 {id:'training',name:'Entrenamiento',at:[119,25],kind:'combat',desc:'Claro para desafíos y práctica, separado del comercio.',bounds:[109,8,25,25]},
 {id:'market',name:'Mercado',at:[92,59],kind:'commerce',desc:'Tiendas y puestos a pocos pasos de la plaza.',bounds:[82,52,24,20]},
 {id:'ichiraku',name:'Ichiraku Ramen',at:[85,74],kind:'commerce',desc:'Local reconocible, cerca de la entrada y el mercado.',bounds:[78,68,13,11]},
 {id:'west',name:'Barrio oeste',at:[20,43],kind:'residential',desc:'Casas, callejones y conexión por tres puentes.',bounds:[8,19,24,55]},
 {id:'east',name:'Barrio este',at:[119,60],kind:'residential',desc:'Casas y patios próximos a la salida oriental.',bounds:[108,51,28,27]},
 {id:'forest',name:'Salida al bosque',at:[139,44],kind:'exit',desc:'Conexión prevista al bosque y campaña existente; no activa en esta maqueta.',bounds:[128,35,13,15]},
 {id:'mountain',name:'Monte Hokage',at:[72,-10],kind:'scenic',desc:'Fondo no transitable con los cuatro rostros del comienzo de Naruto.',bounds:[16,-24,112,24]}
];
// Rectangular solid footprints. Front doors face accessible approach points.
export const buildings=[
 {id:'tower',kind:'tower',x:61,y:9,w:22,d:14,h:7},
 {id:'academy',kind:'academy',x:42,y:11,w:14,d:13,h:4},
 {id:'hospital',kind:'hospital',x:89,y:11,w:16,d:13,h:5},
 {id:'ichiraku',kind:'ramen',x:80,y:68,w:10,d:5,h:3},
 {id:'shop',kind:'shop',x:83,y:55,w:7,d:5,h:3},
 {id:'shop2',kind:'shop',x:95,y:55,w:8,d:5,h:3},
 {id:'shop3',kind:'shop',x:93,y:66,w:8,d:5,h:3},
 ...[[10,21,8,6],[22,22,8,6],[9,35,8,7],[23,35,7,6],[10,49,8,7],[23,51,7,6],[10,66,9,7],[23,69,7,6],[43,55,9,7],[44,69,10,7],[54,56,8,6],[55,71,8,7],[110,52,8,6],[124,52,8,7],[109,66,8,7],[125,69,9,7]].map(([x,y,w,d],i)=>({id:'house'+i,kind:'house',x,y,w,d,h:3+i%3*.65}))
];
export const river={x:34,w:4,from:3,to:81,bridges:[{y:24,w:6},{y:43,w:7},{y:64,w:6}]};
export const roads=[{points:[[72,82],[72,43],[72,26]],w:8},{points:[[8,43],[57,43],[87,43],[143,43]],w:7},{points:[[20,24],[34,24],[41,24],[47,31],[57,34]],w:4},{points:[[97,30],[97,43],[119,43],[119,25]],w:4},{points:[[20,64],[34,64],[40,64],[64,64],[72,64],[92,64],[119,64]],w:4},{points:[[92,43],[92,74],[80,74]],w:4},{points:[[20,24],[20,64]],w:4},{points:[[119,43],[119,74]],w:4},{points:[[40,24],[40,64]],w:4}];
export const walls=[{x:3,y:3,w:138,d:2},{x:3,y:81,w:63,d:2},{x:78,y:81,w:63,d:2},{x:3,y:3,w:2,d:80},{x:139,y:3,w:2,d:36},{x:139,y:49,w:2,d:34}];
export const trees=Array.from({length:25},(_,i)=>({x:7+(i*29)%130,y:i%2?7:78,r:1.4})).filter(t=>!buildings.some(b=>t.x>b.x-2&&t.x<b.x+b.w+2&&t.y>b.y-2&&t.y<b.y+b.d+2)&&Math.abs(t.x-72)>11);
export function blocked(x,y,r=MAP.radius){
 if(x-r<5||x+r>143||y-r<5||y+r>84)return true;
 if(x>139&&!(y>=39+r&&y<=49-r))return true;
 if(y>81&&!(x>=66+r&&x<=78-r))return true;
 if(x+r>river.x&&x-r<river.x+river.w&&!river.bridges.some(b=>Math.abs(y-b.y)+r<=b.w/2))return true;
 return [...buildings,...walls].some(b=>x+r>b.x&&x-r<b.x+b.w&&y+r>b.y&&y-r<b.y+b.d);
}
export function step(p,dx,dy,dt,speed=MAP.walkSpeed){const len=Math.hypot(dx,dy);if(!len)return p;const n=Math.max(1,Math.ceil(dt*speed/.25));for(let i=0;i<n;i++){const x=p.x+dx/len*speed*dt/n,y=p.y+dy/len*speed*dt/n;if(!blocked(x,p.y))p.x=x;if(!blocked(p.x,y))p.y=y;}return p;}
