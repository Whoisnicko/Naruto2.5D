import * as THREE from 'three';
import {createArenaCombatPresentation} from './arena-combat-presentation.js?v=6c2';
import {GAARA_DESERT} from './gaara-desert-data.js';
import {createGaaraDesert} from './gaara-desert-scene.js';
export function createGaaraCombatPresentation({scene,arena}){return createArenaCombatPresentation({THREE,scene,arena,spec:GAARA_DESERT,buildScene:createGaaraDesert,palette:{background:'#d7ac7d',fog:'#d7ad7e',sky:'#fff1d3',ground:'#b88a62',sun:'#ffdbab',sunIntensity:1.5,skyIntensity:1.55,fogDensity:.003}});}