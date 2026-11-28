import * as THREE from 'three';
import {createArenaCombatPresentation} from './arena-combat-presentation.js?v=6c2';
import {TOAD_GROUNDS} from './jiraiya-grounds-data.js?v=6h3';
import {createToadGrounds} from './jiraiya-grounds-scene.js?v=6h3';
export function createJiraiyaCombatPresentation({scene,arena}){
 return createArenaCombatPresentation({THREE,scene,arena,spec:TOAD_GROUNDS,buildScene:createToadGrounds,palette:{background:'#829a83',fog:'#9cad8a',sky:'#fff0cd',ground:'#758464',sun:'#ffebc1',sunIntensity:1.3,skyIntensity:1.5,fogDensity:.0031}});
}
