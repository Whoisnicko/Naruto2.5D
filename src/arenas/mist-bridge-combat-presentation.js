// Presentation adapter only: the original combat engine continues to own coordinates and rules.
import * as THREE from 'three';
import {createMistBridge} from './mist-bridge-scene.js?v=6a3';
import {MIST_BRIDGE} from './mist-bridge-data.js';
export function wantsBridgePractice(args,practiceStage){
 const id=args.get('boss'),phase=Number(args.get('phase'));
 return args.get('arenaPractice')==='1'&&args.get('bridgePractice')==='1'&&['zabuza','haku','mistSaga'].includes(id)&&!!practiceStage(id,phase);
}
export async function createBridgeCombatPresentation({scene,arena}){
 if(arena.r!==MIST_BRIDGE.radius)throw Error('Approved bridge combat radius mismatch');
 const world=await createMistBridge({THREE,scene,assetURL:name=>new URL('../../assets/konoha-world3c/'+name+'.webp',import.meta.url).href});
 world.group.position.set(arena.x,0,arena.z);
 world.guides.position.set(arena.x,0,arena.z);
 world.guides.visible=false;
 // Draw the soft mist before transparent actor and technique sprites, not on top of them.
 world.group.traverse(o=>{if(o.name==='deck-mist'||o.material?.transparent&&o.renderOrder===1)o.renderOrder=-10;});
 const light=new THREE.Group(),sun=new THREE.DirectionalLight('#e0e8eb',1.15);
 sun.position.set(arena.x-22,45,arena.z+18);sun.target.position.set(arena.x,0,arena.z);
 light.add(new THREE.HemisphereLight('#dce8ef','#50696a',1.65),sun,sun.target);scene.add(light);
 const original={background:scene.background,fog:scene.fog};
 const background=new THREE.Color('#8faeb8'),fog=new THREE.FogExp2('#a1bbc3',.0017);
 let active=false;world.group.visible=light.visible=false;
 return {get active(){return active;},failures:world.failures,setActive(on){
  on=!!on;if(active===on)return;active=on;world.group.visible=light.visible=on;world.guides.visible=false;
  scene.background=on?background:original.background;scene.fog=on?fog:original.fog;
 },update(t){if(active)world.updateAtmosphere(t);}};
}
