import * as THREE from 'three';
import {createArenaCombatPresentation} from './arena-combat-presentation.js?v=6c2';
import {BONE_VALLEY} from './kimimaro-valley-data.js?v=6f1';
import {createBoneValley} from './kimimaro-valley-scene.js?v=6f1';
export function createKimimaroCombatPresentation({scene,arena}){
 return createArenaCombatPresentation({THREE,scene,arena,spec:BONE_VALLEY,buildScene:createBoneValley,palette:{background:'#414d5a',fog:'#46535e',sky:'#d6e3ec',ground:'#67716e',sun:'#e3dfcd',sunIntensity:1.25,skyIntensity:1.55,fogDensity:.0038}});
}