import {blocked as villageBlocked,step as villageStep} from './konoha-layout.js';
import {TRAVEL} from './konoha-mobility.js';

// Separate region coordinates. The two exterior areas are prototypes, using the approved art kit.
const grove=Array.from({length:16},(_,i)=>({x:10+(i*13)%65,y:i%2?12+(i*7)%14:35+(i*3)%13,r:1.15,art:['tree-pine','tree-oak','tree-willow'][i%3],w:5.4+(i%3)*.7}));
export const REGIONS={
 konoha:{name:'Konoha',country:'País del Fuego',spawn:[72,43],width:144,height:84,zones:[],objects:[]},
 forest:{name:'Bosque de entrenamiento',country:'País del Fuego',spawn:[8,30],width:84,height:60,ground:'grass-natural',tint:'#a0b38b',
 zones:[{name:'Sendero occidental',at:[8,30]},{name:'Claro de entrenamiento',at:[42,30]},{name:'Camino al puesto',at:[77,30]}],
 groundPieces:[{art:'dirt-compact',x:42,y:30,w:84,h:7,tint:'#d8bf99'},{art:'dirt-compact',x:42,y:30,w:17,h:17,tint:'#d8bf99'},{art:'dirt-compact',x:8,y:41,w:5,h:25,tint:'#d8bf99'}],
 objects:[...grove,...[21,30,53,63].map((x,i)=>({x,y:i%2?25:36,r:.65,art:'rocks-flat',w:2.7})),{x:38,y:23,r:.65,art:'training-post',w:2},{x:46,y:23,r:.65,art:'training-post',w:2}]},
 outpost:{name:'Puesto fronterizo',country:'País del Fuego',spawn:[8,30],width:64,height:60,ground:'grass-wildflowers',tint:'#b5be93',
 zones:[{name:'Entrada occidental',at:[8,30]},{name:'Plaza del puesto',at:[32,30]},{name:'Mirador de frontera',at:[53,30]}],
 groundPieces:[{art:'dirt-compact',x:32,y:30,w:64,h:7,tint:'#d8bf99'},{art:'plaza-tiles',x:32,y:30,w:18,h:15,tint:'#ead7b6'}],
 objects:[{x:21,y:21,r:3,art:'house-blue',w:8},{x:42,y:21,r:3,art:'house-orange',w:8},{x:21,y:43,r:3,art:'house-tile',w:8},{x:42,y:43,r:3,art:'house-round',w:8},{x:32,y:21,r:2,art:'market-stall',w:5},{x:53,y:22,r:2,art:'watchtower',w:5},{x:53,y:41,r:1.3,art:'tree-oak',w:6},{x:11,y:17,r:1.3,art:'tree-willow',w:6},{x:12,y:46,r:1.3,art:'tree-pine',w:6}]}
};
export const PORTALS=[
 {id:'konoha-east',region:'konoha',at:[139,44],to:'forest',arrival:[8,30],name:'Bosque de entrenamiento'},
 {id:'forest-west',region:'forest',at:[5,30],to:'konoha',arrival:[135,44],name:'Konoha · salida oriental'},
 {id:'konoha-south',region:'konoha',at:[72,81],to:'forest',arrival:[8,47],name:'Bosque de entrenamiento'},
 {id:'forest-south',region:'forest',at:[8,51],to:'konoha',arrival:[72,76],name:'Konoha · puerta sur'},
 {id:'forest-east',region:'forest',at:[79,30],to:'outpost',arrival:[8,30],name:'Puesto fronterizo'},
 {id:'outpost-west',region:'outpost',at:[5,30],to:'forest',arrival:[75,30],name:'Bosque de entrenamiento'}
];
export const REGION_TRAVEL=[...TRAVEL.map(d=>({...d,region:'konoha'})),{id:'forest-camp',name:'Claro de entrenamiento',region:'forest',at:[42,30],icon:'森'},{id:'outpost-plaza',name:'Plaza del puesto',region:'outpost',at:[32,30],icon:'門'}];
export const PORTAL_REACH=2.7,REGION_RADIUS=.48;
export function regionBlocked(region,x,y,r=REGION_RADIUS){
 if(region==='konoha')return villageBlocked(x,y,r);
 const m=REGIONS[region];if(!m||!Number.isFinite(x)||!Number.isFinite(y)||x-r<3||x+r>m.width-3||y-r<3||y+r>m.height-3)return true;
 return m.objects.some(o=>Math.hypot(x-o.x,y-o.y)<o.r+r);
}
export function regionStep(region,p,dx,dy,dt,speed){
 if(region==='konoha')return villageStep(p,dx,dy,dt,speed);
 const len=Math.hypot(dx,dy);if(!len)return p;const n=Math.max(1,Math.ceil(dt*speed/.25));for(let i=0;i<n;i++){const x=p.x+dx/len*speed*dt/n,y=p.y+dy/len*speed*dt/n;if(!regionBlocked(region,x,p.y))p.x=x;if(!regionBlocked(region,p.x,y))p.y=y;}return p;
}
export function createRegionRouter({preview=false}={}){
 let region='konoha';const visited=new Set(['konoha']),unlocked=new Set(REGION_TRAVEL.filter(d=>d.region==='konoha').map(d=>d.id));
 function near(p){return PORTALS.find(t=>t.region===region&&Math.hypot(p.x-t.at[0],p.y-t.at[1])<=PORTAL_REACH)||null}
 function enter(id,at){if(!Object.hasOwn(REGIONS,id)||!Array.isArray(at)||at.length!==2||!at.every(Number.isFinite)||regionBlocked(id,...at))return false;region=id;visited.add(id);return true}
 function observe(p){for(const d of REGION_TRAVEL)if(d.region===region&&Math.hypot(p.x-d.at[0],p.y-d.at[1])<=3)unlocked.add(d.id);}
 function destinations(){return REGION_TRAVEL.map(d=>({...d,available:preview||unlocked.has(d.id),discovered:unlocked.has(d.id)}))}
 function portal(p){const t=near(p);return t?{id:t.id,name:t.name,region:t.to,at:[...t.arrival],type:'road'}:null}
 function fast(id){const d=REGION_TRAVEL.find(t=>t.id===id);return d&&(preview||unlocked.has(id))?{...d,type:'fast'}:null}
 return {get region(){return region},near,enter,observe,destinations,portal,fast,state:()=>({region,visited:[...visited],unlocked:[...unlocked]})}
}
