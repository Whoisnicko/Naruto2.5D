// Original defeat dialogue, not quoted from the anime. Story-specific endings keep their own rules.
export const DEFEAT_LINES=Object.freeze({
 zabuza:{name:'Zabuza',line:'A shinobi who hesitates will never survive the mist.'},
 haku:{name:'Haku',line:'Your resolve was strong. But I cannot abandon my purpose.'},
 gaara:{name:'Gaara',line:'Your strength was not enough to reach me.'},
 kabuto:{name:'Kabuto',line:'Even determination has its limits.'},
 orochimaru:{name:'Orochimaru',line:'How fragile a dream becomes when faced with true power.'},
 kimimaro:{name:'Kimimaro',line:'My purpose will not fall here.'},
 sasuke:{name:'Sasuke',line:'You still cannot reach me.'},
 jiraiya:{name:'Jiraiya',line:'Rest, kid. A shinobi learns even from defeat.'},
 lee:{name:'Rock Lee',line:'Stand again when your strength returns.'},
 neji:{name:'Neji',line:'You must find a different path.'},
 brawler:{name:'Rogue Shinobi',line:'You left yourself wide open.'},
 guard:{name:'Rogue Shinobi',line:'Your attacks could not break my defense.'},
 thrower:{name:'Rogue Shinobi',line:'You could not escape my reach.'},
 rogue:{name:'Rogue Shinobi',line:'This is where your journey ends... for now.'}
});
export function defeatDialogue(id,fallback='rogue'){return DEFEAT_LINES[id]||DEFEAT_LINES[fallback]||DEFEAT_LINES.rogue;}
export const DEFEAT_TIMING=Object.freeze({fall:.65,dialogue:.85,banner:2.25,fade:3.1,end:6.4});
const clamp=x=>Math.max(0,Math.min(1,x));
export function defeatFrame(elapsed){const t=DEFEAT_TIMING;return {fall:clamp(elapsed/t.fall),dialogue:clamp((elapsed-t.dialogue)/.35)*(1-clamp((elapsed-3.5)/.7)),banner:clamp((elapsed-t.banner)/.30),fade:clamp((elapsed-t.fade)/(t.end-t.fade-.35)),done:elapsed>=t.end};}
