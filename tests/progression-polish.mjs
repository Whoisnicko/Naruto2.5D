import assert from 'node:assert/strict';
import {createLevelTracker,makeBurstParticles,LEVEL_FX} from '../src/level-up-feedback.js';
const p=makeBurstParticles();assert.equal(p.length,72);assert.equal(LEVEL_FX.rings,4);assert.equal(LEVEL_FX.rays,24);assert.equal(LEVEL_FX.duration,2800);
assert.deepEqual(p,makeBurstParticles());assert.ok(p.every(x=>Object.values(x).every(v=>typeof v==='boolean'||Number.isFinite(v))));
const t=createLevelTracker(99);assert.deepEqual(t.observe(100),{from:1,to:2});assert.equal(t.observe(105),null);t.reset(300);assert.equal(t.observe(300),null);assert.deepEqual(t.observe(599),{from:4,to:6});
console.log('6C.4B burst and tracker checks OK');