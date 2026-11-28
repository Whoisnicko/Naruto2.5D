import {HOKAGE_APPROACH} from './konoha-layout.js?v=7a7';
// World lab only. Units per second; no campaign state or storage.
export const MOBILITY={walk:4.8,run:8.4,sprint:16,threshold:2.5,accelTime:.45};
export function createMobility(){return {held:0,speed:MOBILITY.walk,sprint:false,unlocked:true};}
export function updateMobility(s,dt,{running,moved,request}){
 if(!running||!request||!moved){s.held=0;s.sprint=false;s.speed=running&&request?MOBILITY.run:MOBILITY.walk;return s;}
 s.held+=dt;s.sprint=s.unlocked&&s.held>=MOBILITY.threshold;
 const target=s.sprint?MOBILITY.sprint:MOBILITY.run;
 s.speed=Math.min(target,Math.max(MOBILITY.run,s.speed)+(MOBILITY.sprint-MOBILITY.run)*dt/MOBILITY.accelTime);
 return s;
}
export const TRAVEL=[{id:'gate',name:'Puerta principal',at:[72,78],icon:'門'},{id:'plaza',name:'Plaza central',at:[72,43],icon:'葉'},{id:'tower',name:'Mirador Hokage',at:HOKAGE_APPROACH,icon:'火'},{id:'academy',name:'Academia Ninja',at:[47,31],icon:'忍'},{id:'training',name:'Entrenamiento',at:[119,25],icon:'技'},{id:'market',name:'Mercado',at:[92,59],icon:'店'},{id:'west',name:'Barrio oeste',at:[20,43],icon:'橋'},{id:'forest',name:'Salida al bosque',at:[139,44],icon:'森'}];
