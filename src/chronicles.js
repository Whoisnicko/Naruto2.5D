import {ARENA,BOSSES,WORLD_BOSSES,worldBossEligible} from './boss-data.js';
import {itemFor} from './rpg-data.js';
import {itemIcon} from './rpg-ui.js';
import {inventoryIcon} from './inventory-art.js';

// Presentation only. All encounter eligibility and loot are derived from the existing game data.
const FILES={
 zabuza:{title:'Demon of the Hidden Mist',crest:'水',style:'mist',hint:'Watch the sword windup and keep clear of the water techniques.'},
 haku:{title:'The Ice Mirror Shinobi',crest:'氷',style:'ice',hint:'Stay mobile and look for openings between ice mirror attacks.'},
 kabuto:{title:'Medical Prodigy',crest:'医',style:'medical',hint:'Interrupt medical regeneration with a special jutsu.'},
 gaara:{title:'Sand Shinobi',crest:'砂',style:'sand',hint:'Break the sand armor and avoid the heavy area attacks.'},
 orochimaru:{title:'The Serpent Master',crest:'蛇',style:'serpent',hint:'Destroy summons and interrupt body shedding when possible.'},
 kimimaro:{title:'Kaguya Clan',crest:'骨',style:'bone',hint:'Use special jutsu to break the bone guard.'},
 sasuke:{title:'Uchiha Rival',crest:'雷',style:'lightning',hint:'Ranged attacks become less effective. Watch for the final clash.'},
 jiraiya:{title:'The Toad Sage',crest:'仙',style:'sage',hint:'Read the mentor’s windups and use Rasengan to break his guard.'}
};
export function dossierEntries(progress){
 return [...BOSSES,...Object.values(WORLD_BOSSES)].map(spec=>{
  const id=spec.id,done=(progress.defeated||[]).includes(id)||(progress.worldDefeated||[]).includes(id);
  const eligible=id==='zabuza'||id==='haku'?id==='zabuza'||(progress.mistStage||0)>=1:worldBossEligible(id,progress);
  return {id,spec,...FILES[id],location:spec.arena?.name||ARENA.name,status:done?'complete':eligible?'available':'locked'};
 });
}
const el=(tag,cls='',value='')=>{const e=document.createElement(tag);if(cls)e.className=cls;if(value)e.textContent=value;return e;};
const stateText={complete:'CLEARED',available:'AVAILABLE',locked:'CLASSIFIED'};
function portrait(entry){
 const frame=el('span','dossier-portrait');const fallback=el('span','dossier-portrait-fallback',entry.status==='locked'?'?':entry.crest);frame.append(fallback);
 if(entry.status!=='locked'){const img=el('img');img.alt='';img.decoding='async';img.src=new URL('../assets/hud-art/chronicles/'+entry.id+'.webp',import.meta.url).href;img.addEventListener('error',()=>img.remove(),{once:true});frame.append(img);}
 return frame;
}
export function renderBingoBook(root,progress){
 if(!root)return;const entries=dossierEntries(progress);const total=entries.length,done=entries.filter(e=>e.status==='complete').length;
 let selected=entries.find(e=>e.id===root.dataset.selected)||entries.find(e=>e.status==='available')||entries[0],filter='all';
 root.replaceChildren();const heading=el('div','bingo-heading');const title=el('div');title.append(el('small','','HIDDEN LEAF · INTELLIGENCE ARCHIVE'),el('h3','','Bingo Book'));const counter=el('div','bingo-counter',done+' / '+total+' cleared');const track=el('div','bingo-track');const fill=el('i');fill.style.width=(100*done/Math.max(1,total))+'%';track.append(fill);counter.append(track);heading.append(title,counter);
 const filters=el('div','bingo-filters'),list=el('div','bingo-list'),detail=el('article','bingo-detail'),layout=el('div','bingo-layout');layout.append(list,detail);root.append(heading,filters,layout);
 function drawDetail(){detail.replaceChildren();if(!selected){detail.append(el('p','','No encounters match this filter.'));return;}root.dataset.selected=selected.id;const {spec,status}=selected;detail.dataset.style=status==='locked'?'locked':selected.style;const top=el('div','bingo-detail-top');top.append(portrait(selected));const title=el('div');title.append(el('small','bingo-class',stateText[status]),el('h4','',status==='locked'?'Classified encounter':spec.name));if(status!=='locked')title.append(el('p','bingo-title',selected.title));top.append(title);detail.append(top);
 if(status==='locked'){detail.append(el('p','bingo-hint','Complete the preceding story encounters to reveal this dossier.'));return;}
 detail.append(el('small','bingo-field','LOCATION'),el('p','bingo-location',selected.location));
 detail.append(el('small','bingo-field','FIELD NOTES'),el('p','bingo-hint',selected.hint));
 if(status==='complete'){detail.append(el('small','bingo-field','ENCOUNTER REWARDS'));const rewards=el('div','bingo-rewards');for(const [id,count] of spec.reward||[]){const item=itemFor(id);if(!item)continue;const row=el('div','bingo-reward');row.append(inventoryIcon(item,()=>itemIcon(id),id),el('span','',item.name+(count>1?' ×'+count:'')));rewards.append(row);}rewards.append(el('p','bingo-xp',`+${spec.xp||0} EXP${spec.coins?' · +'+spec.coins+' ryō':''}`));detail.append(rewards);}else detail.append(el('p','bingo-pending','Rewards revealed when the encounter is cleared.'));
 }
 function drawList(){list.replaceChildren();const visible=entries.filter(e=>filter==='all'||e.status===filter);if(!visible.includes(selected))selected=visible[0]||null;for(const entry of visible){const card=el('button','bingo-card');card.type='button';card.dataset.status=entry.status;card.dataset.boss=entry.id;card.setAttribute('aria-pressed',String(entry===selected));card.append(portrait(entry));const copy=el('span','bingo-card-copy');copy.append(el('strong','',entry.status==='locked'?'Classified file':entry.spec.name),el('small','',stateText[entry.status]));card.append(copy);card.onclick=()=>{selected=entry;for(const b of list.children)b.setAttribute('aria-pressed',String(b===card));drawDetail();};list.append(card);}if(!visible.length)list.append(el('p','bingo-empty','No encounters yet.'));drawDetail();}
 for(const [id,label] of [['all','All'],['available','Available'],['complete','Cleared'],['locked','Classified']]){const b=el('button','bingo-filter',label);b.type='button';b.dataset.filter=id;b.setAttribute('aria-pressed',String(id===filter));b.onclick=()=>{filter=id;for(const btn of filters.children)btn.setAttribute('aria-pressed',String(btn===b));drawList();};filters.append(b);}drawList();
}
export function setJournalPage(page){const journal=document.getElementById('journalWindow');if(!journal)return;const bingo=page==='bingo';journal.dataset.page=bingo?'bingo':'journal';document.getElementById('journalTab').setAttribute('aria-selected',String(!bingo));document.getElementById('bingoTab').setAttribute('aria-selected',String(bingo));document.getElementById('bingoBook').hidden=!bingo;}
// A single timer per text element; advancing a scene replaces/cancels the previous line.
const timers=new WeakMap();
export function revealDialogue(node){const active=timers.get(node);if(!active)return;clearInterval(active.timer);node.textContent=active.text;timers.delete(node);}
export function typeDialogue(node,text,immediate=false){revealDialogue(node);if(immediate||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches||!text){node.textContent=text;return;}let i=0;node.textContent='';const timer=setInterval(()=>{i+=3;node.textContent=text.slice(0,i);if(i>=text.length)revealDialogue(node);},22);timers.set(node,{timer,text});}
export function portraitFallback(canvas,label){const c=canvas?.getContext('2d');if(!c)return;c.clearRect(0,0,canvas.width,canvas.height);c.fillStyle='#263950';c.fillRect(0,0,canvas.width,canvas.height);c.fillStyle='#c9a26c';c.beginPath();c.arc(canvas.width/2,canvas.height*.34,canvas.width*.15,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(canvas.width/2,canvas.height*.83,canvas.width*.28,canvas.height*.29,0,0,Math.PI*2);c.fill();c.fillStyle='#172235';c.font='bold '+Math.round(canvas.width*.16)+'px sans-serif';c.textAlign='center';c.fillText((label||'?').slice(0,1).toUpperCase(),canvas.width/2,canvas.height*.40);}
