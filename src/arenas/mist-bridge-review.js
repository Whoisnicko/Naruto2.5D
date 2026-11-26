import * as THREE from '../../vendor/three.module.min.js';
import {makeActorSheet,ACTOR_W,ACTOR_H,ANIMS} from '../pixel-art.js';
import {MIST_BRIDGE,arenaStep,arenaFrustum} from './mist-bridge-data.js';
import {createMistBridge} from './mist-bridge-scene.js';
const $=id=>document.getElementById(id),stage=$('stage'),keys=new Set();
let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;stage.append(renderer.domElement);}catch(e){$('loading').textContent='WebGL unavailable. Return to Sandbox and enable hardware acceleration.';throw e;}
const scene=new THREE.Scene();scene.background=new THREE.Color('#a6bbc0');scene.fog=new THREE.FogExp2('#a6bbc0',.0044);
const camera=new THREE.OrthographicCamera(-15,15,15,-15,.1,500);
scene.add(new THREE.HemisphereLight('#e5edf0','#66736d',2.1));const sun=new THREE.DirectionalLight('#f1f2e2',1.45);sun.position.set(-22,45,18);scene.add(sun);
const A=MIST_BRIDGE,world=await createMistBridge({THREE,scene,assetURL:name=>new URL('../../assets/konoha-world3c/'+name+'.webp',import.meta.url).href});
$('loading').hidden=true;$('assetStatus').textContent=world.failures.length?'Fallback textures: '+world.failures.join(', '):'Existing terrain textures loaded';
let p={...A.spawn},dir=2,phase=0,overview=false,last=performance.now(),clock=0,actors=[],width=1,height=1;
const sheets=new Map(),up=new THREE.Vector3();
function makeSprite(kind,x,z,d=0,kyubi=false){const key=kind+':'+kyubi;let sheet=sheets.get(key);if(!sheets.has(key)){try{sheet=makeActorSheet(kind,null,kyubi);}catch{sheet=null;}sheets.set(key,sheet);}
 const c=document.createElement('canvas');c.width=ACTOR_W;c.height=ACTOR_H;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.5,2),new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.1,depthWrite:false,depthTest:true,fog:true}));scene.add(mesh);
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(.63,24),new THREE.MeshBasicMaterial({color:'#253b43',transparent:true,opacity:.23,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.scale.set(1,.55,1);scene.add(shadow);
 return {kind,x,z,dir:d,mesh,shadow,ctx,tex,sheet,last:''};
}
function dispose(a){scene.remove(a.mesh,a.shadow);a.mesh.geometry.dispose();a.mesh.material.dispose();a.shadow.geometry.dispose();a.shadow.material.dispose();a.tex.dispose();}
let hero;function setPhase(i){if(!A.stages[i])return;for(const a of actors)dispose(a);if(hero)dispose(hero);phase=i;hero=makeSprite('player',p.x,p.z,dir,!!A.stages[i].kyubi);actors=A.stages[i].actors.map(a=>makeSprite(a.kind,a.x,a.z,1));$('phase').value=String(i);$('phaseName').textContent=A.stages[i].name; }
for(const [i,s] of A.stages.entries()){const o=document.createElement('option');o.value=String(i);o.textContent=(i+1)+' · '+s.name;$('phase').append(o);}
setPhase(0);$('phase').onchange=()=>setPhase(Number($('phase').value));$('overview').onclick=()=>{overview=!overview;$('overview').textContent=overview?'Follow character':'Overview';$('overview').setAttribute('aria-pressed',String(overview));};
$('guides').onchange=e=>world.guides.visible=e.target.checked;$('reset').onclick=()=>{p={...A.spawn};dir=2;};$('exit').onclick=()=>location.assign('./konoha-three-lab.html?sandbox=1&v=3c77');
function resize(){width=Math.max(1,stage.clientWidth);height=Math.max(1,stage.clientHeight);renderer.setSize(width,height,false);}new ResizeObserver(resize).observe(stage);resize();
const movement=['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift'];addEventListener('keydown',e=>{if(['SELECT','INPUT','BUTTON'].includes(e.target?.tagName))return;const k=e.key.toLowerCase();if(movement.includes(k)){e.preventDefault();keys.add(k);}});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>keys.clear());
for(const b of document.querySelectorAll('[data-key]')){const k=b.dataset.key;b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(k);};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys.delete(k);}
function paint(a,moving){const anim=ANIMS[moving?'walk':'idle'],f=anim.start+Math.floor(clock*anim.fps)%anim.count,k=a.dir+':'+f;if(k!==a.last){a.ctx.clearRect(0,0,ACTOR_W,ACTOR_H);if(a.sheet)a.ctx.drawImage(a.sheet,f*ACTOR_W,a.dir*ACTOR_H,ACTOR_W,ACTOR_H,0,0,ACTOR_W,ACTOR_H);else{a.ctx.fillStyle='#d9ad72';a.ctx.fillRect(6,3,12,12);a.ctx.fillStyle='#56746c';a.ctx.fillRect(5,15,14,16);}a.tex.needsUpdate=true;a.last=k;}a.mesh.quaternion.copy(camera.quaternion);a.mesh.position.set(a.x,.035,a.z).addScaledVector(up,1);a.shadow.position.set(a.x,.035,a.z);}
let cameraX=p.x,cameraZ=p.z-3;
function frame(now){const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;clock+=dt;let dx=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft')),dz=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'));const len=Math.hypot(dx,dz),speed=keys.has('shift')?9:4.8;if(len){dx/=len;dz/=len;dir=Math.abs(dx)>Math.abs(dz)?(dx>0?2:1):(dz>0?0:3);p=arenaStep(p,dx*speed*dt,dz*speed*dt);}
 const f=arenaFrustum(width,height,overview);Object.assign(camera,f);const blend=1-Math.exp(-dt*9),tx=overview?0:p.x,tz=overview?0:p.z-3;cameraX+=(tx-cameraX)*blend;cameraZ+=(tz-cameraZ)*blend;camera.position.set(cameraX,100,cameraZ+120);camera.lookAt(cameraX,0,cameraZ);camera.updateProjectionMatrix();camera.updateMatrixWorld();up.set(0,1,0).applyQuaternion(camera.quaternion);hero.x=p.x;hero.z=p.z;hero.dir=dir;paint(hero,!!len);for(const a of actors)paint(a,false);renderer.render(scene,camera);requestAnimationFrame(frame);}
requestAnimationFrame(frame);
