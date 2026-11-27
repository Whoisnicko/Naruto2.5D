import * as THREE from 'three';
import {createArenaCombatPresentation} from './arena-combat-presentation.js?v=6c2';
import {END_VALLEY} from './sasuke-valley-data.js?v=6g2';
import {createEndValley} from './sasuke-valley-scene.js?v=6g2';
export function createSasukeCombatPresentation({scene,arena}){
 return createArenaCombatPresentation({THREE,scene,arena,spec:END_VALLEY,buildScene:createEndValley,palette:{background:'#6b8994',fog:'#8aa8ae',sky:'#e1edf2',ground:'#66746e',sun:'#fff0d4',sunIntensity:1.32,skyIntensity:1.42,fogDensity:.0025}});
}
