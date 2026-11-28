import * as THREE from 'three';
import {createArenaCombatPresentation} from './arena-combat-presentation.js?v=6c2';
import {END_VALLEY} from './sasuke-valley-data.js?v=6g5';
import {createEndValley} from './sasuke-valley-scene.js?v=6g5';
export async function createSasukeCombatPresentation({scene,arena}){
 let world=null;const presentation=await createArenaCombatPresentation({THREE,scene,arena,spec:END_VALLEY,buildScene:async args=>(world=await createEndValley(args)),palette:{background:'#6b8994',fog:'#8aa8ae',sky:'#e1edf2',ground:'#66746e',sun:'#fff0d4',sunIntensity:1.32,skyIntensity:1.42,fogDensity:.0025}});
 const local=a=>a?{x:a.x-arena.x,z:a.z-arena.z,air:a.air||0,fallen:!!a.fallen,hp:a.hp}:null;
 return {...presentation,get active(){return presentation.active;},setActive(on){if(!on)world?.resetChakra();presentation.setActive(on);},updateWaterChakra(t,hero,boss,enabled){if(presentation.active)world?.updateChakra(t,[local(hero),local(boss)],enabled);}};
}
