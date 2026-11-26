// Presentation and routing only. Boss combat and campaign requirements remain in their original modules.
import {WORLD_BOSSES,PRACTICE_BOSSES,worldBossEligible} from './boss-data.js';
const required=['kabuto','gaara','orochimaru','kimimaro'];
function valleyReason(progress){
 const missing=required.filter(id=>!progress.worldDefeated.includes(id)).map(id=>WORLD_BOSSES[id].name);
 if(progress.mistStage!==4)missing.unshift('Land of Waves');
 return missing.length?'Complete '+missing.join(', '):'';
}
export function campaignDestinations({quest,character,progress,campaign,examComplete}){
 const ready=quest===3,naruto=character==='naruto',mist=progress.mistStage<4;
 const first='Report the five-rogue mission to Kakashi';
 const stages=PRACTICE_BOSSES.mistSaga.stages;
 const mistReason=!ready?first:!naruto?'Select Naruto at Kakashi':'';
 return [{id:'boss:mist',name:'Zabuza & Haku',location:'Land of Waves',detail:mist?stages[progress.mistStage]?.label:'',available:ready&&mist&&naruto,done:!mist,reason:mistReason,boss:true},
  ...Object.values(WORLD_BOSSES).map(s=>{
   const done=progress.worldDefeated.includes(s.id),requiresNaruto=['sasuke','jiraiya'].includes(s.id),eligible=worldBossEligible(s.id,progress);
   const reason=!ready?first:!eligible?(valleyReason(progress)|| (s.id==='jiraiya'?'Defeat Sasuke at the Valley of the End':'Previous encounters required')):requiresNaruto&&!naruto?'Select Naruto at Kakashi':'';
   return {id:'boss:'+s.id,name:s.name,location:s.arena.name,available:ready&&!done&&eligible&&(!requiresNaruto||naruto),done,reason,boss:true};
  }),
  {id:'exam',name:'Chūnin Exams',available:ready,done:examComplete,reason:ready?'Original three-stage exam':first},
  {id:'characters',name:'Team 7 · Choose shinobi',available:ready,reason:ready?'Character selection':first},
  {id:'epilogue',name:'Kakashi · Epilogue',available:ready&&!campaign.completed&&progress.defeated.length===2,done:campaign.completed,reason:ready?'Complete Land of Waves':first}];
}
export function practiceDestinations(){return Object.entries(PRACTICE_BOSSES).map(([id,s])=>({id,name:s.name,location:'Boss practice arena',detail:'Phase 1 · '+s.stages.length+' phases available in pause tools',available:true,boss:true}));}
export function encounterLabel(d){return (d.done?'✓ ':d.available?'▶ ':'🔒 ')+d.name+(d.location?' · '+d.location:'')+(d.done?' · Completed':!d.available?' · '+d.reason:d.detail?' · '+d.detail:'');}
export function practiceURL(id,phase=1,version='3c77',returnEncounter=''){if(!Object.hasOwn(PRACTICE_BOSSES,id)||!Number.isInteger(phase)||phase<1||phase>PRACTICE_BOSSES[id].stages.length)return null;return './?arenaPractice=1&boss='+encodeURIComponent(id)+'&phase='+phase+'&v='+encodeURIComponent(version)+(validReturnEncounter(returnEncounter)?'&returnEncounter='+encodeURIComponent(returnEncounter):'');}
export function validReturnEncounter(id){return ['mixed','regional','striker','assassin','defender','caster','medic','summoner','elite'].includes(id);}
export function sandboxReturnURL(encounter='',version='3c77'){return './konoha-three-lab.html?sandbox=1&v='+encodeURIComponent(version)+(validReturnEncounter(encounter)?'&encounter='+encodeURIComponent(encounter):'');}
