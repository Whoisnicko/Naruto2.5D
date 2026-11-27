// Session-scoped preferences, deliberately separate from campaign saves.
export const GOD_KEY='shinobi-sandbox-god-v1';
export function readGod(storage){try{return storage?.getItem(GOD_KEY)==='1';}catch{return false;}}
export function writeGod(storage,enabled){try{storage?.setItem(GOD_KEY,enabled?'1':'0');return !!storage;}catch{return false;}}
export function sandboxStorage(){try{return globalThis.sessionStorage;}catch{return null;}}
export function syncFieldGod(combat,enabled){if(!!combat.state().immortal!==!!enabled)combat.sandboxBoost('immortal');return !!combat.state().immortal;}
