import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const strip=x=>x.replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const src=Object.fromEntries(['game','renderer','save','pixel-art','pixel-renderer','combat-data','feedback','enemy-ai'].map(n=>[n,read('src/'+n+'.js')]));
for(const source of Object.values(src))new AsyncFunction(strip(source));
const store=new Map(),localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
const saved=new Function('localStorage',strip(src.save)+'\nreturn {validateSave,packSave,readSave,writeSave,importSave,exportSave};')(localStorage);
const combat=new Function(strip(src['combat-data'])+'\nreturn {COMBAT,stepMotion,directionToward};')();
const {COMBAT,stepMotion}=combat;
const ai=new Function('directionToward',strip(src['enemy-ai'])+'\nreturn {prepareEnemy,roleFor,targetFor,damageModifier,tickEnemy,safeSubstitution};')(combat.directionToward);
const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{style:{},textContent:'',disabled:false,click(){},dataset:{},value:''});return nodes.get(id)};
const document={getElementById:node,querySelectorAll:()=>[]};
const view={scene:{},solid:{},addStatic:()=>({visible:true}),resize(){},frame(){},drawActors(){},drawEffects(){}};
const feedback=new Function('localStorage','document',strip(src.feedback)+'\nreturn createFeedback;')(localStorage,document)(view,null);
const audio={enabled:true,volume:.32,unlock(){},wind(){},play(){},setEnabled(v){this.enabled=v;},setVolume(v){this.volume=v;}};
const math=Object.create(Math);math.random=()=>.5;
const args={document,Math:math,performance:{now:()=>0},innerWidth:1280,innerHeight:720,addEventListener(){},requestAnimationFrame(){},createRenderer:()=>view,createPixelSystem:()=>({begin(){},show:()=>true,end(){},effects(){},addTrees(p){assert(p.length>0);return true;},addBuildingShadows(p){assert(p.length>0);}}),createAudio:()=>audio,createFeedback:()=>feedback,...saved,...combat,...ai};
const game=await new AsyncFunction(...Object.keys(args),strip(src.game)+'\nreturn {start,interact,attack,dash,substitution,update,render,save,snapshot,blocked,playerHurt,hurt,hitTarget,get state(){return {p,enemies,quest,running,projectiles,clones}},get cd(){return cd},keys};')(...Object.values(args));
function sim(seconds){for(let left=seconds;left>1e-8;left-=.01){feedback.tick(.01);game.update(Math.min(.01,left));}}
game.start(false);game.render(.016);assert.equal(game.state.running,true);
// Dash: collision, cost, cooldown, invulnerability, displacement.
let p=game.state.p;p.x=-16;p.z=-2;p.dirX=1;p.dirZ=0;assert(game.dash());assert.equal(p.chakra,88);
assert(!game.dash());game.playerHurt(9,{x:p.x-1,z:p.z});assert.equal(p.hp,100);sim(.18);assert(p.x>-13.0);assert.equal(p.dashTime,0);
const testActor={x:0,z:0};stepMotion(testActor,5,0,(x,z)=>x>.55&&x<1.2);assert(testActor.x<=.55);
assert(game.blocked(8,10));assert(!game.blocked(8,-2));
game.start(false);p=game.state.p;p.x=-12;p.z=-2;game.interact();assert.equal(game.state.quest,1);
// Windup does not deal damage early; combo stages and buffering.
let e=game.state.enemies[0];p.x=e.x-1;p.z=e.z;e.attack=100;assert(game.attack('j'));assert.equal(e.hp,70);sim(.11);assert.equal(e.hp,45);assert(feedback.frozen||e.knockTime>0);
sim(.15);assert(!game.attack('j'));assert(p.queued);sim(.14);assert.equal(p.combo,2);assert.equal(p.anim.k,'j');assert.equal(p.anim.combo,2);e.x=p.x+1;e.z=p.z;e.attack=100;sim(.13);assert.equal(e.hp,17);sim(.28);assert(game.attack('j'));assert.equal(p.combo,3);e.x=p.x+1;e.z=p.z;e.attack=100;sim(.15);assert.equal(e.hp,0);
sim(.5);
// Remaining enemies: Rasengan + normal attack; preserve original mission/reward.
for(const enemy of game.state.enemies.filter(x=>x.hp>0)){p.x=enemy.x;p.z=enemy.z;p.chakra=100;enemy.attack=100;enemy.stagger=10;game.cd[' ']=0;assert(game.attack(' '));assert.equal(enemy.hp,70);sim(.28);assert.equal(enemy.hp,10);sim(.4);p.x=enemy.x;p.z=enemy.z;game.cd.j=0;assert(game.attack('j'));sim(.4);assert.equal(enemy.hp,0);}
assert(game.state.enemies.every(e=>!e.hp));assert.equal(game.state.quest,2);
p.x=-12;p.z=-2;game.interact();assert.equal(game.state.quest,3);assert.equal(p.coins,160);
const before=game.snapshot();assert(game.save());game.start(false);assert.equal(game.state.quest,0);game.start(true);assert.equal(game.state.quest,3);assert.equal(game.state.p.coins,before.p.coins);
assert.equal((await saved.importSave({size:100,text:async()=>saved.packSave(before)},5)).quest,3);assert.equal(saved.validateSave(before,5).p.coins,before.p.coins);assert.throws(()=>saved.validateSave({...before,quest:99},5));
// Other techniques have an anticipation phase and spawn only when it ends.
game.start(false);assert(game.attack('k'));assert.equal(game.state.projectiles.length,0);sim(.12);assert.equal(game.state.projectiles.length,1);sim(.55);assert(game.attack('l'));assert.equal(game.state.clones.length,0);sim(.25);assert.equal(game.state.clones.length,2);
assert(game.state.clones.every(c=>c.hp===22));
// Advanced combat checks.
game.start(false);p=game.state.p;p.x=-16;p.z=-2;assert(game.substitution());assert.equal(p.chakra,82);game.playerHurt(20,{x:p.x-1,z:p.z});assert.equal(p.hp,100);assert.equal(p.substitution,0);assert(p.x>-16);assert(!game.substitution());
game.start(false);p=game.state.p;assert(game.attack('f'));sim(.27);assert(game.state.projectiles.some(a=>a.kind==='wind'&&a.pierce));
const [brawler,thrower,guard]=game.state.enemies;assert.equal(brawler.role,'brawler');assert.equal(thrower.role,'thrower');assert.equal(guard.role,'guard');
const c={x:guard.x+1,z:guard.z,hp:22,life:4};assert.equal(ai.targetFor(guard,{x:guard.x+3,z:guard.z},[c]),c);guard.dirX=1;guard.dirZ=0;guard.guard=true;assert.equal(ai.damageModifier(guard,c,COMBAT.skills.j),.35);assert.equal(ai.damageModifier(guard,c,COMBAT.skills[' ']),1);assert.equal(ai.damageModifier(guard,{x:guard.x-1,z:guard.z},COMBAT.skills.j),1);game.hurt(guard,25,c,COMBAT.skills.j);assert.equal(guard.hp,61);guard.guard=true;game.hurt(guard,34,c,COMBAT.skills.f);assert.equal(guard.hp,27);assert(guard.stagger>0);
const dummy=ai.prepareEnemy({id:1,x:0,z:0,hp:70,attack:0}),target={x:6,z:0,hp:100};let fired=0;ai.tickEnemy(dummy,target,[],.01,()=>{},()=>{fired++},()=>{});assert(dummy.intent);ai.tickEnemy(dummy,target,[],.2,()=>{},()=>{fired++},()=>{});assert.equal(fired,0);ai.tickEnemy(dummy,target,[],.4,()=>{},()=>{fired++},()=>{});assert.equal(fired,1);
const marked=game.state.enemies[0];marked.mark=2;game.hurt(marked,60,p,COMBAT.skills[' ']);assert.equal(marked.hp,0);assert.equal(marked.mark,0);
// Independently test animation metadata and hit-stop decay.
const art=new Function(strip(src['pixel-art'])+'\nreturn {ANIMS,ACTOR_COLS};')();
const anim=new Function('ANIMS',strip(src['pixel-renderer'])+'\nreturn {frameFor};')(art.ANIMS);
assert.equal(art.ACTOR_COLS,22);assert.equal(anim.frameFor({anim:{k:'j',combo:2,left:.3,total:.34,windup:.1}},0).state,'kick');assert.equal(anim.frameFor({anim:{k:'j',combo:3,left:.2,total:.43,windup:.14}},0).state,'finish');
feedback.impact(.1,.07);assert(feedback.frozen);feedback.tick(.08);assert(!feedback.frozen);game.render(.016);
console.log('PASS: syntax, collision, dash, invulnerability, anticipation, combo buffer, three combo stages, all techniques, mission/rewards, save/import, animation selection hit-stop, enemy roles, telegraphs, guard break, clone targeting, substitution and wind projectile. Renderer/audio mocked; real GPU/audio pending.');