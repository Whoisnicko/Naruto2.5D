// The campaign is derived from existing mission and boss progress, with one persistent epilogue flag.
export const CHAPTERS=[
 {title:'I · La primera lección',goal:'Hablá con Kakashi en la plaza.',x:-12,z:-2},
 {title:'II · El bosque de entrenamiento',goal:'Derrotá a los cinco renegados al este del puente.',x:23,z:-2},
 {title:'III · El regreso a Konoha',goal:'Informá a Kakashi que completaste la misión.',x:-12,z:-2},
 {title:'IV · El demonio de la niebla',goal:'Desafiá a Zabuza en el marcador del este del bosque.',x:32,z:-2},
 {title:'V · Los espejos de hielo',goal:'Derrotá a Haku en el mismo campo de combate.',x:32,z:-2},
 {title:'VI · El camino del shinobi',goal:'Regresá a Kakashi para cerrar la campaña.',x:-12,z:-2},
 {title:'Campaña completada',goal:'Seguí explorando, entrenando y completando misiones secundarias.'}
];
export const FINALE={xp:100,coins:150,lines:['Kakashi: Un shinobi no se mide solo por sus técnicas.','Aprendiste a confiar en tus compañeros y a levantarte después de cada caída.','Naruto: ¡Todavía me queda mucho camino! ¡Voy a ser Hokage!','Fin del capítulo: Senda del Shinobi. Konoha sigue abierta para explorar.']};
export function newCampaign(){return {completed:false};}
export function validateCampaign(raw,quest,bossProgress){if(!raw||typeof raw.completed!=='boolean'||raw.completed&&(quest!==3||bossProgress.defeated.length!==2))throw Error('Campaña inválida.');return {completed:raw.completed};}
export function chapterIndex(quest,bossProgress,campaign){return quest<3?quest:campaign.completed?6:3+bossProgress.defeated.length;}
export function completeCampaign(campaign,quest,bossProgress,p){if(campaign.completed||quest!==3||bossProgress.defeated.length!==2)return false;campaign.completed=true;p.xp=Math.min(1e9,p.xp+FINALE.xp);p.coins=Math.min(1e9,p.coins+FINALE.coins);return true;}
export function campaignSummary(quest,bossProgress,campaign,world,rpg,p){return {chapter:chapterIndex(quest,bossProgress,campaign),bosses:bossProgress.defeated.length,side:Object.values(world.quests).filter(x=>x===2).length,chests:world.opened.length,places:world.visited.length,skills:rpg.skills.length+Object.values(rpg.trees||{}).reduce((n,a)=>n+a.length,0),rounds:rpg.round,xp:p.xp};}
