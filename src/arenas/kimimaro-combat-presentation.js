import * as THREE from 'three';
import {createArenaCombatPresentation} from './arena-combat-presentation.js?v=6c2';
import {BONE_VALLEY} from './kimimaro-valley-data.js?v=6f3';
import {createBoneValley} from './kimimaro-valley-scene.js?v=6f3';
export async function createKimimaroCombatPresentation({scene,arena}){
 let world=null;
 const presentation=await createArenaCombatPresentation({THREE,scene,arena,spec:BONE_VALLEY,buildScene:async args=>(world=await createBoneValley(args)),palette:{background:'#81b7df',fog:'#a4c9d7',sky:'#e6f2ff',ground:'#8f9c6c',sun:'#fff1d4',sunIntensity:1.25,skyIntensity:1.55,fogDensity:.003}});
 return {...presentation,get active(){return presentation.active;},setActive(on){if(!on)world?.setPhase(1);presentation.setActive(on);},setPhase(phase){if(presentation.active)world?.setPhase(phase);}};
}
