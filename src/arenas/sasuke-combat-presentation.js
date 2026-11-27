import * as THREE from 'three';
import {createArenaCombatPresentation} from './arena-combat-presentation.js?v=6c2';
import {END_VALLEY} from './sasuke-valley-data.js?v=6g1';
import {createEndValley} from './sasuke-valley-scene.js?v=6g1';
export function createSasukeCombatPresentation({scene,arena}){
 return createArenaCombatPresentation({THREE,scene,arena,spec:END_VALLEY,buildScene:createEndValley,palette:{background:'#657f8b',fog:'#7899a0',sky:'#d8e6ea',ground:'#657768',sun:'#f2e8d2',sunIntensity:1.4,skyIntensity:1.6,fogDensity:.0032}});
}
