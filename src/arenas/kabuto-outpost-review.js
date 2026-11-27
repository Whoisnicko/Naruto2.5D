import {startArenaReview} from './arena-art-review.js?v=6c1';
import {KABUTO_OUTPOST} from './kabuto-outpost-data.js';
import {createKabutoOutpost} from './kabuto-outpost-scene.js';
startArenaReview({spec:KABUTO_OUTPOST,buildScene:createKabutoOutpost,palette:{background:'#253b38',fog:'#526d63',sky:'#d9e5d6',ground:'#43534b',sun:'#d7e8cf'}}).catch(e=>{console.error(e);const l=document.getElementById('loading');l.hidden=false;l.textContent='Unable to load arena review. Reload or return to Sandbox.';});
