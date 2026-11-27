import {defeatDialogue,defeatFrame,DEFEAT_TIMING} from './defeat-data.js?v=6e2';
// Shared transient controller. No timers, save mutations, or input while the sequence runs.
export function createDefeatSequence(audio){
 let root,shade,dialogue,speaker,line,banner,sub,age=0,finish=null,active=false,previousFocus=null;
 function mount(){if(root)return;root=document.createElement('div');root.className='shinobi-defeat';root.hidden=true;root.setAttribute('role','status');root.setAttribute('aria-live','polite');
  shade=document.createElement('div');shade.className='defeat-shade';root.append(shade);
  dialogue=document.createElement('div');dialogue.className='defeat-dialogue';speaker=document.createElement('strong');speaker.className='defeat-speaker';line=document.createElement('span');line.className='defeat-line';dialogue.append(speaker,line);root.append(dialogue);
  banner=document.createElement('div');banner.className='defeat-banner';const title=document.createElement('strong');title.className='defeat-title';title.textContent='YOU LOST';sub=document.createElement('span');sub.className='defeat-sub';banner.append(title,sub);root.append(banner);document.body.append(root);
 }
 function paint(){const f=defeatFrame(age),motion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;root.style.setProperty('--defeat-fade',String(f.fade));dialogue.style.opacity=String(f.dialogue);banner.style.opacity=String(f.banner);banner.style.transform=motion?'translate(-50%,-50%)':'translate(-50%,-50%) scale('+(0.83+.17*f.banner)+')';return f;}
 function reset(){active=false;finish=null;age=0;if(root)root.hidden=true;previousFocus=null;}
 function start({id,hero='Naruto',onComplete,subtitle='The will of fire lives on.'}={}){if(active)return false;mount();const d=defeatDialogue(id);speaker.textContent=d.name;line.textContent=d.line;sub.textContent=subtitle;previousFocus=document.activeElement;previousFocus?.blur?.();age=0;active=true;finish=onComplete;root.hidden=false;audio?.wind(false);audio?.restartMusic?.();paint();return true;}
 function update(dt){if(!active)return null;const delta=Math.max(0,Math.min(.1,Number(dt)||0));age+=delta;audio?.music?.(delta,'defeat');const f=paint();if(f.done){const next=finish;reset();next?.();}return f;}
 // Capture gameplay controls, including touch and keyboard, before game-specific handlers.
 function block(e){if(!active)return;e.preventDefault();e.stopImmediatePropagation();}
 for(const name of ['keydown','keyup','pointerdown','pointerup','click','wheel','touchstart','touchend'])globalThis.addEventListener?.(name,block,{capture:true,passive:false});
 return {start,update,reset,get active(){return active;},get frame(){return defeatFrame(age);}};
}
