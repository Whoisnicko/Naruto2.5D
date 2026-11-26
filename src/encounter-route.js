// The host is an encounter runner, never an explorable world.
export const KONOHA_HOME=Object.freeze({region:'konoha',x:72,y:43});
export const KONOHA_RECOVERY=Object.freeze({region:'konoha',x:97,y:30});
export function routeHost({active,child,modal,arena,exam,scene,sandbox}){
 if(child)return 'child';
 if(!active)return 'title';
 if(arena||exam||scene)return 'encounter';
 if(modal)return 'modal';
 return sandbox?'practice-exit':'illustrated';
}
export function returnPosition(candidate,valid,recovered=false){return recovered?{...KONOHA_RECOVERY}:valid(candidate)?{...candidate}:{...KONOHA_HOME};}
