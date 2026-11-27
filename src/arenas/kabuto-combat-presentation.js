import * as THREE from 'three';
import {createArenaCombatPresentation} from './arena-combat-presentation.js?v=6c2';
import {KABUTO_OUTPOST} from './kabuto-outpost-data.js';
import {createKabutoOutpost} from './kabuto-outpost-scene.js';
export function createKabutoCombatPresentation({scene,arena}){
 return createArenaCombatPresentation({THREE,scene,arena,spec:KABUTO_OUTPOST,buildScene:createKabutoOutpost,palette:{background:'#253b38',fog:'#526d63',sky:'#d9e5d6',ground:'#43534b',sun:'#d7e8cf'}});
}
