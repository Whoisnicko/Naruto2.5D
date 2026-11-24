import {newWorld,validateWorld} from './world-data.js';
import {validateRPG,migrateRPG} from './rpg-data.js';
export const SAVE_KEY='shinobi25d-v1';
const SCHEMA='shinobi25d';
const finite=(v,lo,hi)=>typeof v==='number'&&Number.isFinite(v)&&v>=lo&&v<=hi;
export function validateSave(raw,enemyCount){
  if(raw?.schema!==undefined&&(raw.schema!==SCHEMA||![2,3,4].includes(raw.version)))throw Error('Versión de guardado no compatible.');
  const s=raw?.schema===SCHEMA?raw.state:raw;
  if(raw?.version===4&&!s?.world)throw Error('Falta el estado del mundo.');
  if(raw?.version>=3&&!s?.rpg)throw Error('Falta el estado RPG.');
  if(!s||!s.p||!Array.isArray(s.enemies)||s.enemies.length!==enemyCount||!Number.isInteger(s.quest)||s.quest<0||s.quest>3)throw Error('Formato de partida inválido.');
  const p=s.p;
  if(!finite(p.x,-49,49)||!finite(p.z,-49,49)||!finite(p.hp,0,100)||!finite(p.chakra,0,100)||!finite(p.xp,0,1e9)||!finite(p.coins,0,1e9))throw Error('Datos de jugador inválidos.');
  const ids=new Set();
  const enemies=s.enemies.map(e=>{
    if(!e||!Number.isInteger(e.id)||e.id<0||e.id>=enemyCount||ids.has(e.id)||!finite(e.x,-49,49)||!finite(e.z,-49,49)||!finite(e.hp,0,70))throw Error('Datos de enemigo inválidos.');
    ids.add(e.id);
    return {id:e.id,x:e.x,z:e.z,hp:e.hp,dirX:finite(e.dirX,-1,1)?e.dirX:0,dirZ:finite(e.dirZ,-1,1)?e.dirZ:1,walk:0,hit:0,attack:0};
  });
  return {p:{x:p.x,z:p.z,hp:p.hp||100,chakra:p.chakra,xp:p.xp,coins:p.coins,dirX:finite(p.dirX,-1,1)?p.dirX:1,dirZ:finite(p.dirZ,-1,1)?p.dirZ:0,walk:0,hit:0},enemies,quest:s.quest,rpg:s.rpg?validateRPG(s.rpg,p.xp):migrateRPG(enemies,s.quest),world:s.world?validateWorld(s.world):newWorld()};
}
export function packSave(state){return JSON.stringify({schema:SCHEMA,version:4,savedAt:new Date().toISOString(),state});}
export function readSave(count){const raw=localStorage.getItem(SAVE_KEY);return raw?validateSave(JSON.parse(raw),count):null;}
export function writeSave(state){const old=localStorage.getItem(SAVE_KEY);if(old&&!localStorage.getItem(SAVE_KEY+'-backup-v2')){try{const prior=JSON.parse(old);if(prior.version===2||!prior.schema)localStorage.setItem(SAVE_KEY+'-backup-v2',old);}catch{}}if(old&&!localStorage.getItem(SAVE_KEY+'-backup-v3')){try{if(JSON.parse(old).version===3)localStorage.setItem(SAVE_KEY+'-backup-v3',old);}catch{}}localStorage.setItem(SAVE_KEY,packSave(state));}
export function exportSave(state){
  const url=URL.createObjectURL(new Blob([packSave(state)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='shinobi-partida.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function importSave(file,count){
  if(!file||file.size>1024*1024)throw Error('Archivo demasiado grande o ausente.');
  return validateSave(JSON.parse(await file.text()),count);
}
