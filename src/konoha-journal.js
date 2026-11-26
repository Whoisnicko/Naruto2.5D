// Presentation adapter: uses the original journal renderer and current field state.
import {CHAPTERS,campaignSummary,partOneProgress,newCampaign} from './campaign-data.js';
import {newBossProgress,jiraiyaEligible} from './boss-data.js';
import {newExam,examTitle} from './exam-data.js';
import {SIDEQUESTS,CHESTS,LANDMARKS,questProgress} from './world-data.js';
import {CHARACTER_TREES} from './rpg-data.js';
import {renderBingoBook,setJournalPage} from './chronicles.js';

export function createFieldJournal({state,canOpen,clearMotion}){
 const $=id=>document.getElementById(id),dialog=$('releaseModal'),window=$('journalWindow');
 function read(){const s=state();return {...s,bossProgress:s.bossProgress||newBossProgress(),campaign:s.campaign||newCampaign(),exam:s.exam||newExam()};}
 function render(){const {quest,bossProgress,campaign,world,rpg,p,exam,defeated}=read(),q=campaignSummary(quest,bossProgress,campaign,world,rpg,p);
  $('journalCurrent').textContent=bossProgress.worldDefeated.includes('jiraiya')?'PART I COMPLETE · Shippuden awaits':jiraiyaEligible(bossProgress)?'FINAL LESSON · Train with Jiraiya':CHAPTERS[q.chapter].title+' — '+(quest===0?'Talk to Kakashi or explore the training forest.':quest===1?'Defeat the five rogues in the training forest · '+defeated+'/5':CHAPTERS[q.chapter].goal);
  for(let i=0;i<CHAPTERS.length;i++)$('chapter'+i).textContent=(i<q.chapter||q.chapter===6?'✓ ':i===q.chapter?'▶ ':'○ ')+CHAPTERS[i].title;
  const progression=partOneProgress(bossProgress);$('journalBossList').textContent=progression.entries.map(b=>(b.done?'✓ ':'○ ')+b.name).join('\n');$('journalBossCount').textContent='Part I encounters · '+progression.done+'/'+progression.total;
  $('journalStats').textContent='Side quests '+q.side+'/'+Object.keys(SIDEQUESTS).length+' · Chests '+q.chests+'/'+CHESTS.length+' · Places '+q.places+'/'+LANDMARKS.length+' · Skills '+q.skills+'/'+Object.values(CHARACTER_TREES).reduce((n,t)=>n+Object.keys(t).length,0)+' · Training '+q.rounds+' · Regional foes '+world.defeated.length+'/4 · Exams: '+examTitle(exam);
  const list=$('fieldSideQuests');list.replaceChildren();for(const [id,spec] of Object.entries(SIDEQUESTS)){const p=document.createElement('p');p.textContent=(world.quests[id]===2?'✓ ':world.quests[id]===1?'▶ ':'○ ')+spec.name+' · '+questProgress(world,rpg,id);list.append(p);}
 }
 function open(){if(dialog.open||!canOpen())return false;clearMotion();render();window.hidden=false;setJournalPage('journal');dialog.showModal();return true;}
 function close(){if(dialog.open)dialog.close();}
 $('journalClose').onclick=close;$('journalTab').onclick=()=>setJournalPage('journal');$('bingoTab').onclick=()=>{renderBingoBook($('bingoBook'),read().bossProgress);setJournalPage('bingo');};
 dialog.addEventListener('close',clearMotion);
 return {open,close,render,get opened(){return dialog.open}};
}
