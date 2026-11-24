import {newExam,validateExam} from './exam-data.js';
import {validateCharacter} from './character-data.js';
import {newCampaign,validateCampaign} from './campaign-data.js';
import {newBossProgress,validateBossProgress} from './boss-data.js';
import {newWorld,validateWorld} from './world-data.js';
import {validateRPG,migrateRPG} from './rpg-data.js';
export const SAVE_KEY='shinobi25d-v1';
const SCHEMA='shinobi25d';
const finite=(v,lo,hi)=>typeof v==='number'&&Number.isFinite(v)&&v>=lo&&v<=hi;
export function validateSave(raw,enemyCount){
  if(raw?.schema!==undefined&&(raw.schema!==SCHEMA||![2,3,4,5,6,7,8,9,10,11].includes(raw.version)))throw Error('Unsupported save version.');
  const s=raw?.schema===SCHEMA?raw.state:raw;
  if(raw?.version>=6&&!s?.campaign)throw Error('Missing campaign state.');
  if(raw?.version>=5&&!s?.bossProgress)throw Error('Missing boss progress.');
  if(raw?.version>=4&&!s?.world)throw Error('Missing world state.');
  if(raw?.version>=3&&!s?.rpg)throw Error('Missing RPG state.');
  if(!s||!s.p||!Array.isArray(s.enemies)||s.enemies.length!==enemyCount||!Number.isInteger(s.quest)||s.quest<0||s.quest>3)throw Error('Invalid save format.');
  const p=s.p;
  if(!finite(p.x,-49,109)||!finite(p.z,-49,49)||(p.x>49&&(raw?.version!==undefined&&raw.version<8||p.x<50&&Math.abs(p.z+2)>2.6||p.x>=50&&Math.abs(p.z)>19))||!finite(p.hp,0,100)||!finite(p.chakra,0,100)||!finite(p.xp,0,1e9)||!finite(p.coins,0,1e9))throw Error('Invalid player data.');
  const ids=new Set();
  const enemies=s.enemies.map(e=>{
    if(!e||!Number.isInteger(e.id)||e.id<0||e.id>=enemyCount||ids.has(e.id)||!finite(e.x,-49,49)||!finite(e.z,-49,49)||!finite(e.hp,0,70))throw Error('Invalid enemy data.');
    ids.add(e.id);
    return {id:e.id,x:e.x,z:e.z,hp:e.hp,dirX:finite(e.dirX,-1,1)?e.dirX:0,dirZ:finite(e.dirZ,-1,1)?e.dirZ:1,walk:0,hit:0,attack:0};
  });
  return {exam:validateExam(s.exam,raw?.version===undefined||raw.version<11),p:{character:validateCharacter(p.character,raw?.version===undefined||raw.version<9),x:p.x,z:p.z,hp:p.hp||100,chakra:p.chakra,xp:p.xp,coins:p.coins,dirX:finite(p.dirX,-1,1)?p.dirX:1,dirZ:finite(p.dirZ,-1,1)?p.dirZ:0,walk:0,hit:0},enemies,quest:s.quest,rpg:s.rpg?validateRPG(s.rpg,p.xp,raw?.version===undefined||raw.version<10):migrateRPG(enemies,s.quest),world:s.world?validateWorld(s.world,raw?.version===undefined||raw.version<7,raw?.version===undefined||raw.version<8):newWorld(),bossProgress:s.bossProgress?validateBossProgress(s.bossProgress):validateBossProgress({defeated:[]}),campaign:s.campaign?validateCampaign(s.campaign,s.quest,s.bossProgress||newBossProgress()):newCampaign()};
}
export function packSave(state){return JSON.stringify({schema:SCHEMA,version:11,savedAt:new Date().toISOString(),state});}
export function readSave(count){const raw=localStorage.getItem(SAVE_KEY);return raw?validateSave(JSON.parse(raw),count):null;}
// Rolling recovery copy plus legacy migration backups. A backup failure must not block a primary save.
export function readRecovery(count){
 const candidates=['-previous',...Array.from({length:9},(_,i)=>'-backup-v'+(10-i))];
 for(const suffix of candidates){try{const raw=localStorage.getItem(SAVE_KEY+suffix);if(raw)return {state:validateSave(JSON.parse(raw),count),source:suffix};}catch{}}
 return null;
}
export function writeSave(state){
 const previous=localStorage.getItem(SAVE_KEY),next=packSave(state);
 let prior=null;
 if(previous)try{prior=JSON.parse(previous);validateSave(prior,state.enemies.length);}catch{prior=null;}
 localStorage.setItem(SAVE_KEY,next);
 if(prior){
  try{if(JSON.stringify(prior.state??prior)!==JSON.stringify(state))localStorage.setItem(SAVE_KEY+'-previous',previous);}catch{}
  const version=prior.version??2;if(version>=2&&version<11)try{const key=SAVE_KEY+'-backup-v'+version;if(!localStorage.getItem(key))localStorage.setItem(key,previous);}catch{}
 }
}
export function exportSave(state){
  const url=URL.createObjectURL(new Blob([packSave(state)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='shinobi-partida.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function importSave(file,count){
  if(!file||file.size>1024*1024)throw Error('File too large or missing.');
  return validateSave(JSON.parse(await file.text()),count);
}
