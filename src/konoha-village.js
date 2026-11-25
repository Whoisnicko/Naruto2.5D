import {NPCS,DIALOGUES} from './world-data.js';
import {createVillageServices} from './konoha-services.js';
import {CHARACTERS} from './character-data.js';
import {makeActorSheet,ACTOR_W,ACTOR_H,ANIMS} from './pixel-art.js';

// Coordinates are lab-only, never the legacy save positions. All original NPC IDs are retained.
export const VILLAGE_ROUTES={
 kakashi:[[68,43],[68,40]],shikamaru:[[77,47],[79,47]],
 sakura:[[97,30],[99,30]],teuchi:[[85,75],[87,75]],
 tenten:[[92,62],[92,64]],iruka:[[47,31],[49,31]]
};
export const VILLAGE_NPCS=[{id:'kakashi',name:CHARACTERS.kakashi.name,kind:CHARACTERS.kakashi.art,role:'Sensei'},...NPCS];
export const VILLAGE_REACH=2.7;
export function createVillage({THREE,scene,billboards,shadow,blocked,step,clearMotion,onSelect}){
 const $=id=>document.getElementById(id),sheets=new Map(),actors=[];
 let hero='naruto',nearest=null,openedNPC=null,mode='dialog',position=null,activeNow=false;
 const services=createVillageServices();
 const getSheet=kind=>{if(!sheets.has(kind)){let sheet=null;try{sheet=makeActorSheet(kind)}catch{}sheets.set(kind,sheet)}return sheets.get(kind)};
 const select=document.createElement('select');select.id='villageHero';select.setAttribute('aria-label','Personaje de exploración');
 for(const [id,data] of Object.entries(CHARACTERS)){const o=document.createElement('option');o.value=id;o.textContent=data.name;select.append(o)}
 $('buttons').append(select);
 const hint=document.createElement('button');hint.id='villageTalk';hint.hidden=true;hint.type='button';$('info').append(hint);
 const journal=document.createElement('button');journal.id='villageJournal';journal.type='button';journal.textContent='J · Diario y mochila';$('buttons').append(journal);
 const stats=document.createElement('div');stats.id='villageStats';$('info').append(stats);
 const dialog=document.createElement('dialog');dialog.id='villageDialog';dialog.innerHTML='<div class="village-card"><canvas id="villagePortrait" width="24" height="32" aria-hidden="true"></canvas><div><small id="villageRole"></small><h2 id="villageName"></h2></div></div><p id="villageLine"></p><div id="villageWallet"></div><div id="villageActions"></div><p id="villageFeedback" role="status" aria-live="polite"></p><small>Sesión de prueba independiente · no altera la partida real.</small><div><button id="villageClose" type="button">Continuar explorando</button></div>';dialog.setAttribute('aria-labelledby','villageName');document.body.append(dialog);
 function paint(a,time){const anim=ANIMS[a.motion?'walk':'idle'],f=anim.start+Math.floor(time*anim.fps)%anim.count,k=a.dir+':'+f;if(k===a.frame)return;a.frame=k;const g=a.ctx;g.clearRect(0,0,ACTOR_W,ACTOR_H);const sheet=getSheet(a.kind);if(sheet)g.drawImage(sheet,f*ACTOR_W,a.dir*ACTOR_H,ACTOR_W,ACTOR_H,0,0,ACTOR_W,ACTOR_H);else{g.fillStyle='#5e876e';g.fillRect(6,12,12,15);g.fillStyle='#e4bc90';g.fillRect(7,3,10,9)}a.tex.needsUpdate=true}
 for(const data of VILLAGE_NPCS){
  const route=VILLAGE_ROUTES[data.id];if(!route||route.some(([x,y])=>blocked(x,y)))throw Error('Invalid village route: '+data.id);
  const [x,y]=route[0],c=document.createElement('canvas');c.width=ACTOR_W;c.height=ACTOR_H;
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(1.5,2),new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.1,depthWrite:false,depthTest:false}));scene.add(m);
  const visual={name:data.id,x,z:y,w:1.5,h:2,m,depth:y,offset:.1,kind:'villageActor'};billboards.push(visual);
  const a={...data,x,y,route,target:1,wait:2+actors.length*.7,dir:0,motion:false,frame:'',ctx:c.getContext('2d'),tex,visual,shade:shadow(x,y,1.15,.7),time:0};actors.push(a);paint(a,0);
 }
 function available(a){return a.id!==hero}
 function close(){if(dialog.open)dialog.close()}
 dialog.addEventListener('close',()=>{openedNPC=null;mode='dialog';clearMotion();hint.blur();journal.blur()});
 $('villageClose').onclick=close;
 function el(tag,text,cls){const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e}
 function button(label,fn){const b=el('button',label);b.type='button';b.onclick=fn;return b}
 function feedback(msg){$('villageFeedback').textContent=msg||'Listo.';}
 function action(fn){const err=fn();feedback(err||'Operación completada.');render();}
 function render(){
  const state=services.state(),p=state.player,actions=$('villageActions');actions.replaceChildren();
  $('villageWallet').textContent=p.coins+' ryō · '+p.xp+' EXP · HP '+p.hp+'/100 · Chakra '+p.chakra+'/100';
  if(mode==='journal'){
   $('villageName').textContent='Diario y mochila';$('villageRole').textContent='KONOHA · EXPLORACIÓN';$('villagePortrait').hidden=true;$('villageLine').textContent='Misiones existentes, adaptadas a este mapa. El jardín y la salida al bosque son ubicaciones provisionales. Cambiá de héroe si un NPC está oculto.';
   for(const q of services.quests()){const row=el('div','','village-row');row.append(el('strong',q.name+' · '+['Disponible','Activa','Completada'][q.status]),el('small',q.desc+' · '+q.progress+' · '+q.xp+' EXP / '+q.coins+' ryō'));for(const loc of q.locations)row.append(el('small',(loc.visited?'✓ ':'○ ')+loc.name+' · '+loc.at.join(', ')));actions.append(row)}
   actions.append(el('h3','Mochila'));for(const i of services.inventory()){const row=el('div','','village-row');row.append(el('strong',i.name+' ×'+i.count),el('small',i.desc));if(i.type==='consumable')row.append(button('Usar',()=>action(()=>services.use(i.id))));actions.append(row)}
   const extra=services.overflow();if(Object.keys(extra).length)actions.append(button('Recuperar recompensas pendientes',()=>{feedback('Recuperados: '+services.recover());render()}));
   return;
  }
  const a=openedNPC;if(!a)return;$('villagePortrait').hidden=false;
  if(mode==='dialog'){
   $('villageLine').textContent=DIALOGUES[a.id]?.text||'Naruto, keep training. A shinobi must know the village before setting out. Las misiones principales se conectarán con la campaña.';
   for(const choice of services.choices(a.id)){
    if(choice.action==='close')continue;let label=choice.label;if(choice.action==='finish'){const q=services.quests().find(q=>q.id===choice.quest);label+=' · '+q.progress}
    actions.append(button(label,()=>{if(choice.action==='shop'||choice.action==='sell'){mode=choice.action;feedback('');render()}else action(()=>services.action(a.id,choice));}));
   }
  }else{
   $('villageLine').textContent=mode==='shop'?'Elegí un artículo. Los precios están en ryō.':'Vendé artículos de tu mochila. Los objetos de misión no se pueden vender.';
   const items=mode==='shop'?services.shop(a.id):services.sell();for(const i of items){const row=el('div','','village-row');row.append(el('strong',i.name+' · tienes '+i.count),el('small',i.desc),button((mode==='shop'?'Comprar ':'Vender ')+i.price+' ryō',()=>action(()=>services.trade(a.id,mode,i.id))));actions.append(row)}
   if(!items.length)actions.append(el('small','No hay artículos disponibles.'));actions.append(button('Volver',()=>{mode='dialog';feedback('');render()}));
  }
 }
 function openJournal(){if(dialog.open||!activeNow)return false;clearMotion();openedNPC=null;mode='journal';feedback('');render();dialog.showModal();return true}
 journal.onclick=openJournal;
 function talk(){if(dialog.open||!activeNow)return false;if(!nearest){if(position&&services.nearSupply(position)){const err=services.collect(position);hint.textContent=err||'Provisiones obtenidas: Rogue Cloth ×3';return !err}return false}if(!available(nearest))return false;openedNPC=nearest;mode='dialog';clearMotion();feedback('');const a=nearest;const line=DIALOGUES[a.id]?.text||'Naruto, keep training. A shinobi must know the village before setting out.';
 $('villageName').textContent=a.name;$('villageRole').textContent=a.role;$('villageLine').textContent=line;
 const c=$('villagePortrait'),g=c.getContext('2d');g.clearRect(0,0,24,32);const sheet=getSheet(a.kind);if(sheet)g.drawImage(sheet,0,0,24,32,0,0,24,32);else g.drawImage(a.tex.image,0,0);render();dialog.showModal();return true}
 hint.onclick=talk;
 select.onchange=()=>{if(!Object.hasOwn(CHARACTERS,select.value)){select.value=hero;return}hero=select.value;clearMotion();close();nearest=null;hint.hidden=true;onSelect(hero,getSheet(CHARACTERS[hero].art));select.blur()};
 function update(dt,p,active,discover=active){position=p;activeNow=active;services.update(p,discover);const sp=services.state().player;const status=sp.coins+' ryō · '+sp.xp+' EXP · HP '+sp.hp+' · CH '+sp.chakra;if(stats.textContent!==status)stats.textContent=status;nearest=null;let best=VILLAGE_REACH;
  for(const a of actors){const visible=available(a);a.visual.m.visible=a.shade.visible=visible;if(!visible)continue;
   a.motion=false;if(active&&!dialog.open){a.time+=dt;a.wait=Math.max(0,a.wait-dt);const [tx,ty]=a.route[a.target],dx=tx-a.x,dy=ty-a.y,d=Math.hypot(dx,dy);
    if(d<.08){a.target=(a.target+1)%a.route.length;a.wait=2.6}
    else if(!a.wait){const ox=a.x,oy=a.y;step(a,dx,dy,Math.min(dt,d/1.15),1.15);a.motion=Math.hypot(a.x-ox,a.y-oy)>.0001;if(a.motion)a.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?2:1):(dy>0?0:3);else{a.target=(a.target+1)%a.route.length;a.wait=2.6}}
   }
   a.visual.x=a.x;a.visual.z=a.visual.depth=a.y;a.shade.position.set(a.x,.10,a.y);paint(a,a.time);
   const d=Math.hypot(p.x-a.x,p.y-a.y);if(active&&!dialog.open&&d<best){nearest=a;best=d}
  }
  const supply=active&&services.nearSupply(p);hint.hidden=(!nearest&&!supply)||dialog.open;if(nearest)hint.textContent='E · Hablar con '+nearest.name;else if(supply)hint.textContent='E · Recoger provisiones de práctica (3 telas)';journal.disabled=!active;
 }
 return {update,talk,close,openJournal,get opened(){return dialog.open},state:()=>({hero,nearby:nearest?.id||null,dialog:openedNPC?.id||null,mode,services:services.state(),npcs:actors.map(a=>({id:a.id,x:a.x,y:a.y,visible:available(a),motion:a.motion,fallback:!getSheet(a.kind)}))})};
}
