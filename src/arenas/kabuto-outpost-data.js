// Art-only candidate: the current world boss keeps ownership of combat rules.
export const KABUTO_OUTPOST=Object.freeze({
 id:'kabuto-outpost',name:'Abandoned Medical Outpost',center:{x:0,z:0},radius:12,actorMargin:.45,
 floor:{width:34,length:34},spawn:{x:-3.5,z:0},bossSpawn:{x:3.5,z:0},
 stages:[{name:'Medical Prodigy',actors:[{kind:'kabuto',x:3.5,z:0}]},{name:'Autopsy Protocol',actors:[{kind:'kabuto',x:3.5,z:0}]}],
 palette:{floor:'#60706b',joint:'#263c3e',wall:'#475953',base:'#263a38',trim:'#89978a',wood:'#645849',iron:'#718485',paper:'#c4c9ad',linen:'#a2b3a3',medicine:'#7ac3a4',glass:'#537e79',lamp:'#d5e5bc',debris:'#354d49'},
 tables:[{x:-14.4,z:-7.2},{x:14.4,z:7.2}],
 cabinets:[{x:-13.9,z:-12.4},{x:13.9,z:-12.4},{x:-14.3,z:11.9}],
 screens:[{x:-8.4,z:-14.7},{x:6.8,z:-14.7}],
 crates:[{x:13.8,z:12.9},{x:-10.1,z:14.2}],
 lights:[{x:-9,z:-16},{x:0,z:-16},{x:9,z:-16},{x:-16,z:0},{x:16,z:0}],
});
