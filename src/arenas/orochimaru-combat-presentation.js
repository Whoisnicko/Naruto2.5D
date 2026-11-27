import * as THREE from 'three';
import {createArenaCombatPresentation} from './arena-combat-presentation.js?v=6c2';
import {ORO_LAB} from './orochimaru-lab-data.js?v=6e1';
import {createOrochimaruLab} from './orochimaru-lab-scene.js?v=6e1';
export function createOrochimaruCombatPresentation({scene,arena}){
 return createArenaCombatPresentation({THREE,scene,arena,spec:ORO_LAB,buildScene:createOrochimaruLab,palette:{background:'#292532',fog:'#393342',sky:'#d9d1ea',ground:'#716578',sun:'#e9d6b8',sunIntensity:1.15,skyIntensity:1.65,fogDensity:.0025}});
}
