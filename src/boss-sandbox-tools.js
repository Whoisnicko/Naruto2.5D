// Standalone, responsive practice dialog. Does not change boss rules.
export function createBossSandboxTools({doc,bosses,actions}){
 const $=id=>doc.getElementById(id),dialog=$('bossSandboxDialog'),dock=$('bossSandboxDock'),god=$('bossSandboxGod'),quick=$('bossSandboxGodQuick'),boss=$('bossSandboxSelect'),phase=$('bossSandboxPhase');
 let open=false,context=null;
 function renderPhases(selected=1){phase.replaceChildren();for(const [i,stage] of (bosses[boss.value]?.stages||[]).entries()){const o=doc.createElement('option');o.value=String(i+1);o.textContent=stage.label;phase.append(o);}phase.value=String(selected);if(!phase.value)phase.value='1';}
 for(const [id,spec] of Object.entries(bosses)){const o=doc.createElement('option');o.value=id;o.textContent=spec.name;boss.append(o);}renderPhases();
 boss.onchange=()=>renderPhases();
 function refresh(){const s=actions.state();dock.hidden=!s.available;const enabled=!!s.god;for(const b of [god,quick]){b.textContent='God Mode: '+(enabled?'ON':'OFF');b.setAttribute('aria-pressed',String(enabled));}
 $('bossSandboxVitals').textContent='HP '+Math.ceil(s.hp||0)+' / 100 · Chakra '+Math.ceil(s.chakra||0)+' / 100';
 $('bossSandboxMessage').textContent=s.scripted?'Scripted challenges still require their original input.':'Practice only · campaign saves are not changed.';
 return s;}
 function close(){if(!open)return false;open=false;if(dialog.open)dialog.close();actions.resume(context);context=null;refresh();return true;}
 function show(){const s=refresh();if(!s.available||open||!actions.canOpen())return false;context=actions.pause();open=true;boss.value=s.id&&bosses[s.id]?s.id:'mistSaga';renderPhases(s.phase||1);try{dialog.showModal();}catch{open=false;actions.resume(context);context=null;return false;}return true;}
 function toggle(){if(open)return close();return show();}
 $('bossSandboxOpen').onclick=toggle;$('bossSandboxResume').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.addEventListener('close',()=>{if(open)close();});
 god.onclick=quick.onclick=()=>{if(actions.state().available){actions.toggleGod();refresh();}};
 $('bossSandboxRefill').onclick=()=>{actions.refill();refresh();};
 $('bossSandboxLevel').onclick=()=>{actions.level();refresh();};
 $('bossSandboxRage').onclick=()=>{actions.rage();refresh();};
 $('bossSandboxLaunch').onclick=()=>{if(bosses[boss.value]?.stages[Number(phase.value)-1])actions.launch(boss.value,Number(phase.value));};
 $('bossSandboxExit').onclick=()=>actions.exit();
 return {show,close,toggle,refresh,get opened(){return open;}};
}
