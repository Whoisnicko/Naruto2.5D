import {levelFor,rankFor} from './rpg-data.js';
export function createLevelTracker(initialXP=0){
 let previous=levelFor(initialXP);
 return {reset(xp){previous=levelFor(xp);},observe(xp){const next=levelFor(xp),from=previous;previous=next;return next>from?{from,to:next}:null;}};
}
export function updateRankHUD(node,xp,coins,examPassed=false){
 if(!node)return;
 const level=levelFor(xp),rank=rankFor(xp),key=rank+':'+level+':'+coins+':'+examPassed;
 if(node.dataset.rankKey===key)return;
 node.dataset.rankKey=key;node.classList.add('shinobi-rank-display');
 const crest=document.createElement('span');crest.className='shinobi-rank-crest';crest.textContent=rank.toUpperCase();
 const lv=document.createElement('strong');lv.className='shinobi-rank-level';lv.textContent='LVL '+level;
 const wallet=document.createElement('span');wallet.className='shinobi-rank-wallet';wallet.textContent=(examPassed?'Exam ✓ · ':'')+coins+' ryō';
 node.replaceChildren(crest,lv,wallet);
}
export function createLevelUp(audio){
 const tracker=createLevelTracker();let root,banner,burst,sub,until=0;
 const stop=()=>{until=0;if(root){root.hidden=true;burst.hidden=true;root.classList.remove('level-celebrating');}};
 function mount(){
  if(root)return;
  root=document.createElement('div');root.className='shinobi-level-fx';root.hidden=true;
  burst=document.createElement('div');burst.className='shinobi-level-burst';burst.hidden=true;burst.setAttribute('aria-hidden','true');
  for(let i=0;i<16;i++){const spark=document.createElement('i');spark.className='shinobi-level-spark';spark.style.setProperty('--angle',(i*22.5)+'deg');spark.style.setProperty('--reach',(58+(i%4)*18)+'px');spark.style.setProperty('--delay',((i%3)*.045)+'s');burst.append(spark);}
  for(const kind of ['',' second']){const ring=document.createElement('span');ring.className='shinobi-level-ring'+kind;burst.append(ring);}
  banner=document.createElement('div');banner.className='shinobi-level-banner';banner.setAttribute('role','status');banner.setAttribute('aria-live','polite');
  const heading=document.createElement('strong');heading.className='shinobi-level-title';heading.textContent='LEVEL UP!';
  sub=document.createElement('span');sub.className='shinobi-level-sub';banner.append(heading,sub);root.append(burst,banner);document.body.append(root);
 }
 function update(xp,hero,project,now=performance.now()){
  const event=tracker.observe(xp);
  if(event){mount();root.hidden=false;root.classList.remove('level-celebrating');void root.offsetWidth;
   sub.textContent=rankFor(xp).toUpperCase()+' · LVL '+event.from+' → '+event.to+(hero==='naruto'?' · Dattebayo!':'');
   root.classList.add('level-celebrating');until=now+2200;audio?.play('levelUp');
  }
  if(!until)return;if(now>=until){stop();return;}
  let pos=null;try{pos=project?.();}catch{}
  const valid=pos&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)&&pos.x>=-100&&pos.x<=innerWidth+100&&pos.y>=-100&&pos.y<=innerHeight+100;
  burst.hidden=!valid;if(valid){burst.style.left=Math.round(pos.x)+'px';burst.style.top=Math.round(pos.y)+'px';}
 }
 return {reset(xp){tracker.reset(xp);stop();},update};
}
