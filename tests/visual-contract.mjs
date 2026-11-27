// Node regression baseline; intentionally update atlas metadata tests only when both renderer adapters migrate.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const src=async path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const moduleFrom=async path=>import('data:text/javascript;base64,'+Buffer.from(await src(path)).toString('base64'));
const art=await moduleFrom('src/pixel-art.js');
assert.equal(art.ACTOR_COLS,64);assert.equal(art.ACTOR_W,24);assert.equal(art.ACTOR_H,32);assert.deepEqual(art.DIRS,['down','left','right','up']);
const slots=Object.values(art.ANIMS).flatMap(v=>Array.from({length:v.count},(_,i)=>v.start+i)).sort((a,b)=>a-b);
assert.deepEqual(slots,Array.from({length:64},(_,i)=>i));assert.equal(new Set(art.FX_ROWS).size,art.FX_ROWS.length);
for(let dir=0;dir<4;dir++)for(let pose=0;pose<6;pose++)assert(Object.values(art.rasenganHand(dir,pose)).every(Number.isFinite));
const {KABUTO_OUTPOST:A}=await moduleFrom('src/arenas/kabuto-outpost-data.js'),m=await moduleFrom('src/arenas/arena-review-contract.js');
assert.equal(A.radius,12);assert(A.stages.every(s=>s.actors.every(a=>m.arenaContains(A,a.x,a.z))));
for(let i=0;i<72;i++){let p={...A.spawn};for(let n=0;n<100;n++){p=m.arenaStep(A,p,Math.cos(i*Math.PI/36)*.4,Math.sin(i*Math.PI/36)*.4);assert(m.arenaContains(A,p.x,p.z));}}
for(const [w,h] of [[2560,1440],[1920,1080],[1366,768],[1024,768],[844,390],[390,844]])for(const overview of [false,true]){const f=m.arenaFrustum(w,h,overview);assert(Math.abs((f.right-f.left)/(f.top-f.bottom)-w/h)<1e-8);}
console.log('Visual contract baseline and arena geometry passed');
