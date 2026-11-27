// Shared access and manual priority; no change to damage, chakra cost or cooldown.
export function canUseAdvancedTechnique(character,learned,kyubiActive){return !!learned||(character==='naruto'&&!!kyubiActive);}
export function isKyubiRasengan(character,key,kyubiActive){return character==='naruto'&&!!kyubiActive&&(key===' '||key==='g');}
// Long enough to complete one ordinary involuntary strike, bounded and never an infinite queue.
export const KYUBI_RAS_BUFFER=.75;
export function allowKyubiImpulse({buffered=false,rasenganHeld=false}={}){return !buffered&&!rasenganHeld;}
