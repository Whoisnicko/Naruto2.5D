// UI adapter only: reuse existing controls and handlers, never mutate campaign or combat state.
export const SANDBOX_TABS=[['character','Characters'],['enemies','Enemies'],['bosses','Bosses'],['resources','Resources'],['world','World'],['performance','Performance']];
export function encounterURL(id,roles,version='3c77'){
 if(!['mixed','regional',...roles].includes(id))return null;
 return './konoha-three-lab.html?sandbox=1&encounter='+encodeURIComponent(id)+'&v='+encodeURIComponent(version);
}
export function initSandboxControl({document:doc,characterFor,enemyRoles,bosses,readState}){
 const $=id=>doc.getElementById(id),dialog=$('fieldPause'),tools=$('fieldSandboxTools');
 if(!dialog||!tools||dialog.querySelector('#sb-control'))return null;
 const create=(tag,cls,text)=>{const el=doc.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el};
 const root=create('div','sb-control');root.id='sb-control';
 const header=create('header','sb-header');const intro=create('div','sb-heading');intro.append(create('small','sb-kicker','TRAINING MODE / TEMPORARY PROGRESS'),create('h2','','Sandbox Control Center'),create('p','','Configure your next test. Campaign progress stays untouched.'));
 header.append(intro,$('fieldResume'));root.append(header);
 const summary=create('div','sb-summary');summary.setAttribute('aria-live','polite');const values={};
 for(const [id,label] of [['hero','SHINOBI'],['level','LEVEL'],['hp','HP'],['chakra','CHAKRA'],['coins','RYŌ'],['region','REGION']]){const node=create('div','sb-stat'),val=create('strong','','—');node.append(create('small','',label),val);summary.append(node);values[id]=val;}root.append(summary);
 const layout=create('div','sb-layout'),tabs=create('nav','sb-tabs'),panels=create('div','sb-panels');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Sandbox tools');layout.append(tabs,panels);root.append(layout);
 const records=new Map();let current='character';function select(id,focus=false){if(!records.has(id))return false;current=id;for(const [key,{button,panel}] of records){const chosen=key===id;button.setAttribute('aria-selected',String(chosen));button.tabIndex=chosen?0:-1;panel.hidden=!chosen;}if(focus)records.get(id).button.focus();return true}
 for(const [id,label] of SANDBOX_TABS){const b=create('button','sb-tab',label),p=create('section','sb-panel');b.type='button';b.id='sb-tab-'+id;b.setAttribute('role','tab');b.setAttribute('aria-controls','sb-panel-'+id);p.id='sb-panel-'+id;p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby',b.id);p.append(create('h3','',label));b.onclick=()=>select(id);b.onkeydown=e=>{const ids=SANDBOX_TABS.map(t=>t[0]),i=ids.indexOf(id);let n;if(e.key==='ArrowDown'||e.key==='ArrowRight')n=(i+1)%ids.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')n=(i+ids.length-1)%ids.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=ids.length-1;else return;e.preventDefault();select(ids[n],true);};tabs.append(b);panels.append(p);records.set(id,{button:b,panel:p});}
 const panel=id=>records.get(id).panel;
 const note=(p,text)=>p.append(create('p','sb-note',text));
 const grid=(p,ids,cls='sb-grid')=>{const g=create('div',cls);for(const id of ids){const el=$(id);if(el)g.append(el)}p.append(g);return g};
 const label=(p,text)=>p.append(create('h4','',text));
 const hidden=create('div','');hidden.hidden=true;root.append(hidden);
 function choiceGrid(p,selectEl,describe){
  const group=create('div','sb-choice-grid'),buttons=new Map();p.append(group);hidden.append(selectEl);
  function sync(){for(const [id,b] of buttons)b.setAttribute('aria-pressed',String(selectEl.value===id));}
  function rebuild(){group.replaceChildren();buttons.clear();for(const option of selectEl.options){const id=option.value,b=create('button','sb-choice');b.type='button';b.append(create('strong','',option.textContent));const sub=describe?.(id);if(sub)b.append(create('small','',sub));b.onclick=()=>{selectEl.value=id;selectEl.dispatchEvent(new Event('change',{bubbles:true}));sync();};buttons.set(id,b);group.append(b);}sync();}
  selectEl.addEventListener('change',sync);rebuild();return {sync,rebuild};
 }
 const hero=panel('character');note(hero,'Switch instantly, then test techniques with the same temporary equipment.');const heroPicker=choiceGrid(hero,$('villageHero'),id=>characterFor(id).role);label(hero,'Character tools');grid(hero,['inventoryBtn','skillTreeBtn','sandboxSkills','sandboxRage']);note(hero,'Kyūbi activation requires Naruto. Press T after filling rage.');
 const enemies=panel('enemies');note(enemies,'Open a dedicated encounter in a new tab. Your current sandbox remains available.');
 const enemyGrid=create('div','sb-choice-grid');enemies.append(enemyGrid);
 for(const e of [{id:'mixed',name:'Mixed roster',detail:'All 7 roles'},{id:'regional',name:'Regional patrols',detail:'Explore both hostile regions'},...enemyRoles]){const href=encounterURL(e.id,enemyRoles.map(x=>x.id));if(!href)continue;const a=create('a','sb-choice');a.href=href;a.target='_blank';a.rel='noopener';a.append(create('strong','',e.name),create('small','',e.detail));enemyGrid.append(a);}
 label(enemies,'Current encounter');grid(enemies,['sandboxResetEnemies','sandboxStressStop']);note(enemies,'Respawn restores your current encounter. Stop / clear removes stress-test enemies.');
 const bossesPanel=panel('bosses');note(bossesPanel,'Select a boss and starting phase. Fight in this tab; returning restarts the temporary field encounter.');
 const bossSelect=$('sandboxBoss'),phaseSelect=$('sandboxPhase'),bossPicker=choiceGrid(bossesPanel,bossSelect,id=>bosses[id].stages.length+' phases');label(bossesPanel,'Starting phase');const phasePicker=choiceGrid(bossesPanel,phaseSelect);bossSelect.addEventListener('change',()=>phasePicker.rebuild());const launch=$('sandboxBossStart');launch.classList.add('sb-primary');bossesPanel.append(launch);
 const res=panel('resources');note(res,'These changes affect only the active sandbox.');label(res,'Quick setup');grid(res,['sandboxXP','sandboxRefill','sandboxImmortalField']);label(res,'Progress & supplies');grid(res,['sandboxLevel1','sandboxLevel5','sandboxCoins','sandboxSupplies','sandboxScrolls']);
 const world=panel('world');note(world,'Jump to an illustrated region or use the full destination list.');grid(world,['regionHome','regionForest','fieldPractice','regionOutpost','travelOpen','reset','villageJournal','fieldView']);const util=$('fieldPauseUtility');world.append(util);
 const performance=panel('performance');note(performance,'Stress tests spawn enemies in the current clear area and measure 15 seconds of gameplay.');grid(performance,['sandboxStress24','sandboxStress48']);const stop=$('sandboxStressStop');const perfStop=create('button','','Stop / clear');perfStop.type='button';perfStop.onclick=()=>stop.click();performance.append(perfStop,$('sandboxStressStatus'));$('fieldPerformance').open=true;performance.append($('fieldPerformance'));const settings=create('div','sb-settings');settings.append($('fieldSound'),$('fieldVolume').closest('label'));performance.append(settings);
 const footer=create('footer','sb-footer');const feedback=create('div','sb-feedback');feedback.append($('sandboxFeedback'),$('fieldPauseStatus'));footer.append(feedback,$('sandboxExitField'));root.append(footer);
 dialog.prepend(root);tools.hidden=true;dialog.dataset.sandboxControl='true';select(current);
 function refresh(){const s=readState();for(const [id,val] of Object.entries(s))if(values[id])values[id].textContent=String(val);heroPicker.sync();bossPicker.sync();phasePicker.sync();}
 root.addEventListener('click',()=>refresh());dialog.addEventListener('close',refresh);refresh();
 return {select,refresh};
}
