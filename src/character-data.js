// Shared campaign and equipment; character-specific techniques and passive modifiers.
export const CHARACTERS={
 naruto:{name:'Naruto',art:'player',role:'Versatile · clones and Rasengan',speed:1,regen:0,defense:0,crit:0,combo:1,skills:{},names:{' ':'Rasengan',f:'Fūma',l:'Clones',g:'Giant Rasengan'}},
 sasuke:{name:'Sasuke',art:'sasuke',role:'Offensive · mobility and critical hits',speed:1.08,regen:0,defense:0,crit:.06,combo:1.08,skills:{' ':{mode:'lunge',fx:'lightning',damage:68,cost:25,cd:2.3,range:3.5,windup:.26,duration:.65,targets:1},f:{mode:'projectile',fx:'fire',damage:45,cost:25,cd:3.6,range:12},l:{mode:'focus',cost:20,cd:10,buff:5},g:{mode:'area',fx:'lightning',damage:94,cost:36,cd:7,range:4.6,targets:5}},names:{' ':'Chidori',f:'Katon',l:'Sharingan',g:'Chidori Nagashi'}},
 sakura:{name:'Sakura',art:'sakura',role:'Medic · endurance and area attacks',speed:.97,regen:0,defense:2,crit:0,combo:1.15,skills:{' ':{mode:'area',fx:'earth',damage:56,cost:20,cd:2.1,range:3.6,targets:5},f:{mode:'area',fx:'earth',damage:40,cost:22,cd:3.2,range:4.2,targets:5},l:{mode:'heal',cost:30,cd:9,heal:35},g:{mode:'area',fx:'earth',damage:90,cost:34,cd:7,range:5,targets:8}},names:{' ':'Chakra Fist',f:'Seismic Wave',l:'Medical Ninjutsu',g:'Devastating Impact'}},
 kakashi:{name:'Kakashi',art:'npc',role:'Tactical · chakra and control',speed:1.02,regen:2,defense:1,crit:.02,combo:1,skills:{' ':{mode:'lunge',fx:'lightning',damage:65,cost:22,cd:2.1,range:3.8,targets:2},f:{mode:'projectile',fx:'water',damage:40,cost:20,cd:3.2,range:12},l:{mode:'guard',cost:22,cd:9,buff:4},g:{mode:'area',fx:'lightning',damage:88,cost:32,cd:6.5,range:4.8,targets:6}},names:{' ':'Raikiri',f:'Water Dragon',l:'Earth Wall',g:'Multiple Raikiri'}}
};
export function characterFor(id){return CHARACTERS[id]||CHARACTERS.naruto;}
export function validateCharacter(id,legacy){if(id===undefined&&legacy)return 'naruto';if(!Object.hasOwn(CHARACTERS,id))throw Error('Invalid character.');return id;}
export function characterSkill(id,key,base){const extra=characterFor(id).skills[key];return extra?{...base,...extra,characterTechnique:true}:base;}
export function canSelectCharacter(id,quest,sandbox){return Object.hasOwn(CHARACTERS,id)&&(id==='naruto'||quest===3||sandbox);}
export function skillLabel(id,key){return characterFor(id).names[key]||({j:'Taijutsu',k:'Shuriken',q:'Dash',r:'Kawarimi'}[key]||key);}
