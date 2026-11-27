// Reusable visual-only arena lifecycle. No dependency on sprites or combat logic.
export function wantsArenaPractice(args,id,practiceStage){
 return args.get('arenaPractice')==='1'&&args.get('boss')===id&&!!practiceStage(id,Number(args.get('phase')));
}
export function activePresentation(...presentations){return presentations.find(p=>p?.active)||null;}
export async function createArenaCombatPresentation({THREE,scene,arena,spec,buildScene,palette}){
 if(arena.r!==spec.radius)throw Error('Approved arena combat radius mismatch: '+spec.id);
 const staging=new THREE.Group();
 const world=await buildScene({THREE,scene:staging});
 world.group.position.set(arena.x,0,arena.z);
 world.guides.position.set(arena.x,0,arena.z);world.guides.visible=false;
 // Place transparent environmental overlays behind combat sprites and telegraphs.
 world.group.traverse(o=>{if(o.material?.transparent&&o.renderOrder===1)o.renderOrder=-10;});
 const lighting=new THREE.Group(),sun=new THREE.DirectionalLight(palette.sun,palette.sunIntensity??1.10);
 sun.position.set(arena.x-22,45,arena.z+18);sun.target.position.set(arena.x,0,arena.z);
 lighting.add(new THREE.HemisphereLight(palette.sky,palette.ground,palette.skyIntensity??1.55),sun,sun.target);
 const background=new THREE.Color(palette.background),fog=new THREE.FogExp2(palette.fog,palette.fogDensity??.0017);
 let active=false,previous=null;staging.visible=lighting.visible=false;scene.add(staging,lighting);
 return {id:spec.id,get active(){return active;},failures:world.failures,setActive(on){
  on=!!on;if(on===active)return;
  if(on){previous={background:scene.background,fog:scene.fog};scene.background=background;scene.fog=fog;}
  else if(previous){scene.background=previous.background;scene.fog=previous.fog;previous=null;}
  active=on;staging.visible=lighting.visible=on;world.guides.visible=false;
 },update(t){if(active)world.updateAtmosphere(t);}};
}
