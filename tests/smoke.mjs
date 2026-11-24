import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const strip=x=>x.replace(/^import .*;\n/gm,'').replace(/^export /gm,'').replaceAll('import.meta.url',"'https://example.invalid/src/renderer.js'");
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const g=read('src/game.js'),r=read('src/renderer.js'),s=read('src/save.js'),art=read('src/art.js');
for(const source of [g,r,s,art])new AsyncFunction(strip(source));
const store=new Map(),localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
const saved=new Function('localStorage',strip(s)+'\nreturn {validateSave,packSave,readSave,writeSave,importSave,exportSave};')(localStorage);
const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{style:{},textContent:'',disabled:false,click(){},dataset:{}});return nodes.get(id)};
const document={getElementById:node,querySelectorAll:()=>[]};
const view={scene:{},solid:{},addStatic:()=>({visible:true}),resize(){},frame(){},drawActors(){},drawEffects(){}};
let fallbackCount=0;const args={installNature:(scene,foliage,fallbacks)=>{assert(foliage.length);fallbackCount=fallbacks.length;},document,performance:{now:()=>0},innerWidth:1280,innerHeight:720,addEventListener(){},requestAnimationFrame(){},createRenderer:()=>view,createAssetActors:async()=>({begin(){},show:()=>false,end(){}}),createProceduralActors:()=>({begin(){},show:()=>true,end(){}}),...saved};
const game=await new AsyncFunction(...Object.keys(args),strip(g)+'\nreturn {start,interact,attack,update,render,save,applySave,snapshot,get state(){return {p,enemies,quest,running}},get cd(){return cd}};')(...Object.values(args));
game.start(false);game.render(.016);assert.equal(game.state.running,true);assert(fallbackCount>0);
game.state.p.x=-12;game.state.p.z=-2;game.interact();assert.equal(game.state.quest,1);
for(const enemy of game.state.enemies){game.state.p.x=enemy.x;game.state.p.z=enemy.z;game.state.p.chakra=100;game.cd[' ']=0;game.attack(' ');game.cd.j=0;game.attack('j');}
assert(game.state.enemies.every(e=>!e.hp));assert.equal(game.state.quest,2);
game.state.p.x=-12;game.state.p.z=-2;game.interact();assert.equal(game.state.quest,3);
const before=game.snapshot();assert(game.save());game.start(false);assert.equal(game.state.quest,0);game.start(true);assert.equal(game.state.quest,3);assert.equal(game.state.p.coins,before.p.coins);
assert.equal((await saved.importSave({size:100,text:async()=>saved.packSave(before)},5)).quest,3);
assert.equal(saved.validateSave(before,5).p.coins,before.p.coins);
assert.throws(()=>saved.validateSave({...before,quest:99},5));
game.render(.016);
console.log('PASS: syntax, mission, combat, rewards, local save, continue, JSON import, legacy and invalid save handling. Renderer mocked; no GPU validation.');

for(const name of ['tree1','bush']){const b=Buffer.from(read('assets/nature/'+name+'.glb.b64'),'base64');assert.equal(b.readUInt32LE(0),0x46546c67);assert.equal(b.readUInt32LE(8),b.length);const meta=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString('utf8'));assert(meta.meshes.length);assert(meta.images.every(i=>i.bufferView!==undefined));}console.log('PASS: embedded CC0 GLB headers, mesh and texture references. Visual asset loading pending.');
