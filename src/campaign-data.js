// The campaign is derived from existing mission and boss progress, with one persistent epilogue flag.
export const CHAPTERS=[
 {title:'I · The first lesson',goal:'Talk to Kakashi in the plaza.',x:-12,z:-2},
 {title:'II · The training forest',goal:'Defeat five rogue ninja east of the bridge.',x:23,z:-2},
 {title:'III · Return to Konoha',goal:'Report the completed mission to Kakashi.',x:-12,z:-2},
 {title:'IV · Demon of the mist',goal:'Challenge Zabuza at the eastern forest marker.',x:32,z:-2},
 {title:'V · The ice mirrors',goal:'Defeat Haku in the same arena.',x:32,z:-2},
 {title:'VI · Path of the Shinobi',goal:'Return to Kakashi to finish the campaign.',x:-12,z:-2},
 {title:'Campaign complete',goal:'Keep exploring, training and completing side quests.'}
];
export const FINALE={xp:100,coins:150,lines:['Kakashi: A shinobi is not judged by techniques alone.','You learned to trust your teammates and stand again after every fall.','Naruto: I still have a long way to go! I will become Hokage!','End of chapter: Path of the Shinobi. Konoha remains open to explore.']};
export function newCampaign(){return {completed:false};}
export function validateCampaign(raw,quest,bossProgress){if(!raw||typeof raw.completed!=='boolean'||raw.completed&&(quest!==3||bossProgress.defeated.length!==2))throw Error('Invalid campaign.');return {completed:raw.completed};}
export function chapterIndex(quest,bossProgress,campaign){return quest<3?quest:campaign.completed?6:3+bossProgress.defeated.length;}
export function completeCampaign(campaign,quest,bossProgress,p){if(campaign.completed||quest!==3||bossProgress.defeated.length!==2)return false;campaign.completed=true;p.xp=Math.min(1e9,p.xp+FINALE.xp);p.coins=Math.min(1e9,p.coins+FINALE.coins);return true;}
export function campaignSummary(quest,bossProgress,campaign,world,rpg,p){return {chapter:chapterIndex(quest,bossProgress,campaign),bosses:bossProgress.defeated.length,side:Object.values(world.quests).filter(x=>x===2).length,chests:world.opened.length,places:world.visited.length,skills:rpg.skills.length+Object.values(rpg.trees||{}).reduce((n,a)=>n+a.length,0),rounds:rpg.round,xp:p.xp};}
