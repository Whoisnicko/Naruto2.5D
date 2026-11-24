// Chunin exams are an optional parallel campaign. Only completed stages persist.
export const EXAM_DESK={x:-13,z:-14.5};
export const EXAM_FOREST={x:-9,z:32,r:9};
export const EXAM_RING={x:-29,z:32,r:10};
export const EXAM_TIME=100;
export const QUESTIONS=[
 {q:'A teammate is injured on a mission. What do you prioritize?',a:['Abandonarlo','Protect them and assess the risk','Spend all your chakra'],correct:1},
 {q:'A rival prepares an area attack. What do you do?',a:['Leave the marked area','Stand still','Attack without looking'],correct:0},
 {q:'What resource do ninja techniques consume?',a:['Ryō','Experiencia','Chakra'],correct:2},
 {q:'An enemy blocks from the front. What is a good tactic?',a:['Repeat the same attack','Flank them or break their guard','Close your eyes'],correct:1},
 {q:'In the forest, what should you do before facing another team?',a:['Check health, chakra and supplies','Discard supplies','Ignore terrain'],correct:0}
];
export const FOREST_RIVALS=[
 {id:'earthTeam',kind:'guard',name:'Earth Team',hp:105,speed:2.8,patterns:[{name:'Heavy Strike',shape:'circle',radius:2.4,reach:2.7,windup:.65,damage:18},{name:'Embestida',shape:'line',radius:1,length:7,reach:7,windup:.7,damage:20},{name:'Earth Impact',shape:'target',radius:2.5,reach:8,windup:.7,damage:22}]},
 {id:'skyTeam',kind:'thrower',name:'Heaven Team',hp:125,speed:3.1,patterns:[{name:'Kunai Rain',shape:'target',radius:2,reach:10,windup:.65,damage:18},{name:'Wind Slash',shape:'line',radius:.9,length:9,reach:9,windup:.6,damage:22},{name:'Torbellino',shape:'circle',radius:3.2,reach:3.5,windup:.65,damage:24}]}
];
export const EXAM_RIVALS=[
 {id:'lee',kind:'lee',name:'Rock Lee',hp:240,speed:4.1,patterns:[{name:'Swift Kick',shape:'circle',radius:2.3,reach:2.5,windup:.42,damage:20},{name:'Leaf Whirlwind',shape:'circle',radius:3.5,reach:3.8,windup:.65,damage:26},{name:'Front Lotus',shape:'line',radius:1.1,length:7,reach:7,windup:.52,damage:32}]},
 {id:'neji',kind:'neji',name:'Neji Hyūga',hp:280,speed:3.2,patterns:[{name:'Gentle Fist',shape:'circle',radius:2.1,reach:2.4,windup:.48,damage:24},{name:'Rotation',shape:'circle',radius:3.8,reach:4,windup:.7,damage:28},{name:'Sixty-Four Palms',shape:'line',radius:1.35,length:6,reach:6,windup:.6,damage:34}]},
 {id:'gaara',kind:'gaara',name:'Gaara',hp:340,speed:2.3,patterns:[{name:'Sand Coffin',shape:'target',radius:2.7,reach:11,windup:.85,damage:27},{name:'Sand Wave',shape:'line',radius:1.8,length:10,reach:10,windup:.9,damage:30},{name:'Sandstorm',shape:'target',radius:3.8,reach:12,windup:.82,damage:36}]}
];
export const EXAM_REWARD={xp:350,coins:300,items:[['chuninVest',1],['scroll',2]]};
export function newExam(){return {written:false,forest:false,wins:0};}
export function validateExam(raw,legacy=false){if(raw===undefined&&legacy)return newExam();if(!raw||typeof raw.written!=='boolean'||typeof raw.forest!=='boolean'||!Number.isInteger(raw.wins)||raw.wins<0||raw.wins>3||raw.forest&&!raw.written||raw.wins>0&&!raw.forest)throw Error('Invalid exam progress.');return {written:raw.written,forest:raw.forest,wins:raw.wins};}
export function examStage(e){return !e.written?'written':!e.forest?'forest':e.wins<3?'tournament':'complete';}
export function examScore(answers){if(!Array.isArray(answers)||answers.length!==QUESTIONS.length||answers.some(a=>!Number.isInteger(a)||a<0||a>2))return -1;return answers.reduce((n,a,i)=>n+Number(a===QUESTIONS[i].correct),0);}
export function examEligible(quest,sandbox){return quest===3||sandbox;}
export function examTitle(e){return e.wins===3?'Exam Passed':e.forest?'Torneo '+e.wins+'/3':e.written?'Forest of Death':'Written Exam';}
