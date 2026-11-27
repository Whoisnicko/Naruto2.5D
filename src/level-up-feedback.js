import {levelFor,rankFor} from './rpg-data.js';

// All sizes are CSS pixels; the shared renderer is independent of the game engines.
export const LEVEL_FX=Object.freeze({duration:2800,particles:72,rays:24,rings:4,maxDPR:1.5});
export function createLevelTracker(initialXP=0){
 let previous=levelFor(initialXP);
 return {reset(xp){previous=levelFor(xp);},observe(xp){const next=levelFor(xp),from=previous;previous=next;return next>from?{from,to:next}:null;}};
}
function rankPlate(rank,level,art=false){
 const plate=document.createElement('span');plate.className='shinobi-rank-plate'+(art?' portrait-rank-plate':'');
 const crest=document.createElement('span');crest.className='shinobi-rank-crest';crest.textContent=rank.toUpperCase();
 const lv=document.createElement('strong');lv.className='shinobi-rank-level';lv.textContent='LVL '+level;
 plate.append(crest,lv);plate.setAttribute('aria-label',rank+' level '+level);return plate;
}
export function updateRankHUD(node,xp,coins,examPassed=false){
 if(!node)return;
 const level=levelFor(xp),rank=rankFor(xp),key=rank+':'+level+':'+coins+':'+examPassed;
 const art=document.getElementById('livingHudArt');
 let plate=art?.querySelector('.portrait-rank-plate');
 if(art&&(!plate||plate.dataset.rankKey!==rank+':'+level)){
  const next=rankPlate(rank,level,true);next.dataset.rankKey=rank+':'+level;
  if(plate)plate.replaceWith(next);else art.append(next);
  node.closest('#top')?.setAttribute('data-rank-art','ready');
 }
 if(node.dataset.rankKey===key)return;
 node.dataset.rankKey=key;node.classList.add('shinobi-rank-display');
 const wallet=document.createElement('span');wallet.className='shinobi-rank-wallet';wallet.textContent=(examPassed?'Exam ✓ · ':'')+coins+' ryō';
 node.replaceChildren(rankPlate(rank,level),wallet);
}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const TAU=Math.PI*2;
const ease=x=>1-Math.pow(1-clamp(x,0,1),3);
const fade=(x,a,b)=>1-clamp((x-a)/(b-a),0,1);
export function makeBurstParticles(count=LEVEL_FX.particles){
 let seed=9281;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 return Array.from({length:count},(_,i)=>({angle:random()*TAU,delay:random()*.37,reach:.6+random()*.85,lift:.5+random()*.9,size:1.4+random()*4.6,life:.8+random()*.85,blue:i%3===0}));
}
export function createLevelUp(audio){
 const tracker=createLevelTracker(),particles=makeBurstParticles();let root,canvas,ctx,banner,sub,catchphrase,start=0,until=0,width=0,height=0,dpr=1;
 const stop=()=>{until=0;if(root){root.hidden=true;root.classList.remove('level-celebrating');}ctx?.clearRect(0,0,width,height);};
 function mount(){
  if(root)return;
  root=document.createElement('div');root.className='shinobi-level-fx';root.hidden=true;
  canvas=document.createElement('canvas');canvas.className='shinobi-level-canvas';canvas.setAttribute('aria-hidden','true');root.append(canvas);
  try{ctx=canvas.getContext('2d');}catch{}
  banner=document.createElement('div');banner.className='shinobi-level-banner';banner.setAttribute('role','status');banner.setAttribute('aria-live','polite');
  const heading=document.createElement('strong');heading.className='shinobi-level-title';heading.textContent='LEVEL UP!';
  sub=document.createElement('span');sub.className='shinobi-level-sub';catchphrase=document.createElement('span');catchphrase.className='shinobi-level-catch';catchphrase.textContent='DATTEBAYO!';
  banner.append(heading,sub,catchphrase);root.append(banner);document.body.append(root);
 }
 function size(){
  const w=innerWidth,h=innerHeight,ratio=Math.min(LEVEL_FX.maxDPR,window.devicePixelRatio||1);
  if(width===w&&height===h&&dpr===ratio)return;
  width=w;height=h;dpr=ratio;canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);ctx?.setTransform(ratio,0,0,ratio,0,0);
 }
 function draw(pos,seconds){
  if(!ctx)return;size();ctx.clearRect(0,0,width,height);
  if(!pos||!Number.isFinite(pos.x)||!Number.isFinite(pos.y))return;
  if(pos.x< -140||pos.x>width+140||pos.y< -140||pos.y>height+140)return;
  const r=clamp(Math.min(width,height)*.22,82,205),x=pos.x,y=pos.y,age=seconds;
  ctx.save();ctx.translate(x,y);ctx.lineCap='round';
  // A white-blue ignition halo. No full-screen strobe.
  const glow=fade(age,.18,1.55)*.72;
  if(glow>0){const radius=r*(.65+ease(age/.55)*.55),g=ctx.createRadialGradient(0,-r*.33,0,0,-r*.33,radius);g.addColorStop(0,'rgba(235,253,255,'+glow*.65+')');g.addColorStop(.3,'rgba(42,187,255,'+glow*.62+')');g.addColorStop(1,'rgba(0,92,255,0)');ctx.fillStyle=g;ctx.fillRect(-radius,-r*.33-radius,radius*2,radius*2);}
  // Four ground shockwaves with blue outer strokes and bright white cores.
  for(let i=0;i<LEVEL_FX.rings;i++){const q=(age-i*.14)/1.12;if(q<0||q>=1)continue;const rad=r*(.15+ease(q)*1.42),alpha=fade(q,.08,1);ctx.globalAlpha=alpha*.87;ctx.beginPath();ctx.ellipse(0,0,rad,rad*.33,0,0,TAU);ctx.lineWidth=9*(1-q)+2;ctx.strokeStyle=i%2?'#147fff':'#4ce5ff';ctx.stroke();ctx.globalAlpha=alpha;ctx.lineWidth=2.7;ctx.strokeStyle='#f3fcff';ctx.stroke();}
  // Tall chakra tongues taper upward and remain centered on the moving actor.
  for(let i=0;i<11;i++){const q=(age-i*.035)/1.35;if(q<0||q>1)continue;const a=i*TAU/11+age*.7,bx=Math.cos(a)*r*.39,by=Math.sin(a)*r*.13,tip=by-r*(.65+(i%4)*.19)*ease(q*3);ctx.globalAlpha=.72*fade(q,.22,1);const g=ctx.createLinearGradient(bx,by,bx,tip);g.addColorStop(0,'#1375ff');g.addColorStop(.35,'#56dfff');g.addColorStop(.75,'#e9fcff');g.addColorStop(1,'rgba(112,220,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(bx-r*.07,by);ctx.quadraticCurveTo(bx-r*.13,tip+r*.2,bx+Math.sin(a*2)*r*.09,tip);ctx.quadraticCurveTo(bx+r*.12,tip+r*.2,bx+r*.06,by);ctx.closePath();ctx.fill();}
  // Manga-style action rays, angled slightly upward.
  for(let i=0;i<LEVEL_FX.rays;i++){const q=(age-(i%4)*.045)/.76;if(q<0||q>1)continue;const a=i*TAU/LEVEL_FX.rays,rad=r*(.23+ease(q)*.9),tail=rad+r*(.18+(i%3)*.07);ctx.globalAlpha=fade(q,.15,1)*.92;ctx.beginPath();ctx.moveTo(Math.cos(a)*rad,Math.sin(a)*rad*.62-r*.24);ctx.lineTo(Math.cos(a)*tail,Math.sin(a)*tail*.62-r*.24);ctx.strokeStyle='#64d9ff';ctx.lineWidth=5;ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=1.8;ctx.stroke();}
  const count=width<600?48:particles.length;
  for(let i=0;i<count;i++){const p=particles[i],q=(age-p.delay)/p.life;if(q<0||q>1)continue;const f=ease(q),px=Math.cos(p.angle)*r*p.reach*f,py=Math.sin(p.angle)*r*.3*f-r*p.lift*q;ctx.globalAlpha=fade(q,.35,1);ctx.fillStyle=p.blue?'#178dff':'#70e5ff';ctx.beginPath();ctx.arc(px,py,p.size*1.5,0,TAU);ctx.fill();ctx.fillStyle='#f4fdff';ctx.beginPath();ctx.arc(px,py,p.size*.68,0,TAU);ctx.fill();}
  ctx.restore();
 }
 function update(xp,hero,project,now=performance.now()){
  const event=tracker.observe(xp);
  if(event){mount();root.hidden=false;root.classList.remove('level-celebrating');void root.offsetWidth;
   sub.textContent=rankFor(xp).toUpperCase()+'  ·  LVL '+event.from+' → '+event.to;catchphrase.hidden=hero!=='naruto';
   root.classList.add('level-celebrating');start=now;until=now+LEVEL_FX.duration;audio?.play('levelUp');
  }
  if(!until)return;if(now>=until){stop();return;}
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
  let pos=null;try{pos=project?.();}catch{}
  draw(pos,(now-start)/1000);
 }
 return {reset(xp){tracker.reset(xp);stop();},update};
}
