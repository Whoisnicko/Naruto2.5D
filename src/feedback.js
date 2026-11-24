// Lightweight procedural audio: no media downloads, no copyrighted recordings.
const CUES={
 step:[['triangle',115,60,.045,.045]],dash:[['sawtooth',510,95,.16,.075]],
 swing:[['triangle',280,95,.08,.10]],hit:[['square',115,48,.075,.11],['triangle',310,90,.07,.055]],
 heavy:[['sawtooth',105,36,.15,.10],['triangle',430,72,.18,.08]],
 shuriken:[['triangle',920,310,.11,.075]],clone:[['sine',190,520,.18,.09]],
 kyubi:[['sawtooth',88,35,.65,.12],['triangle',52,34,.8,.15],['square',155,48,.38,.035]],kyubiHit:[['sawtooth',145,42,.25,.12],['triangle',240,55,.28,.085]],
 charge:[['sine',160,550,.25,.08],['triangle',330,680,.22,.04]],
 rasengan:[['sawtooth',490,65,.23,.09],['sine',850,120,.22,.12]],
 hurt:[['square',200,75,.1,.075]],reward:[['sine',440,660,.15,.09],['triangle',660,880,.23,.05]]
};
export function createAudio(){
 let ctx=null,master=null,ambience=null,enabled=true,volume=.32,voices=0,musicEnabled=true,musicClock=0,musicStep=0,lastMood='';const melodies={explore:[62,0,65,69,67,0,65,0,60,0,62,65,69,0,67,0],boss:[50,50,57,53,50,0,58,57,48,48,55,53,48,0,57,55]};
 try{musicEnabled=localStorage.getItem('shinobi-music')!=='off';enabled=localStorage.getItem('shinobi-sound')!=='off';const v=localStorage.getItem('shinobi-volume');if(v!==null&&Number.isFinite(Number(v)))volume=Math.max(0,Math.min(1,Number(v)));}catch{}
 function unlock(){
  if(!enabled)return;
  try{
   if(!ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;ctx=new A();master=ctx.createGain();master.gain.value=volume;master.connect(ctx.destination);}
   if(ctx.state==='suspended')void ctx.resume().catch(()=>{});
  }catch(e){console.warn('Audio unavailable',e);}
 }
 function play(name){if(!enabled||!ctx||ctx.state!=='running')return;
  for(const [type,f0,f1,dur,amp] of CUES[name]||[]){if(voices>=14)break;try{
   const o=ctx.createOscillator(),g=ctx.createGain(),now=ctx.currentTime;voices++;o.type=type;o.frequency.setValueAtTime(f0,now);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),now+dur);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(amp,now+.009);g.gain.exponentialRampToValueAtTime(.0001,now+dur);o.connect(g);g.connect(master);o.onended=()=>{voices--;o.disconnect();g.disconnect();};o.start(now);o.stop(now+dur+.01);
  }catch(e){voices=Math.max(0,voices-1);}}
 }
 function wind(on){if(!ctx||!master)return;
  if(on&&enabled&&!ambience){try{
   const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),a=b.getChannelData(0);let last=0,seed=23;for(let i=0;i<a.length;i++){seed=(seed*1664525+1013904223)>>>0;last=(last+.024*(seed/4294967296*2-1))/.999;last=Math.max(-.6,Math.min(.6,last));a[i]=last;}
   const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=b;src.loop=true;filter.type='lowpass';filter.frequency.value=420;gain.gain.value=.045;src.connect(filter);filter.connect(gain);gain.connect(master);src.start();ambience={src,filter,gain};
  }catch{}}
  if((!on||!enabled)&&ambience){try{ambience.src.stop();ambience.src.disconnect();ambience.filter.disconnect();ambience.gain.disconnect();}catch{}ambience=null;}
 }
 function music(dt,mood='explore'){
 if(!musicEnabled||!enabled||!ctx||ctx.state!=='running')return;
 if(mood!==lastMood){lastMood=mood;musicClock=0;musicStep=0;}
 musicClock-=dt;if(musicClock>0)return;const interval=mood==='boss'?.22:.46;musicClock+=interval;const melody=melodies[mood]||melodies.explore,n=melody[musicStep++%melody.length];if(!n||voices>=12)return;
 try{const o=ctx.createOscillator(),g=ctx.createGain(),now=ctx.currentTime;voices++;o.type=mood==='boss'?'triangle':'sine';o.frequency.value=440*2**((n-69)/12);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.045,now+.018);g.gain.exponentialRampToValueAtTime(.0001,now+interval*.9);o.connect(g);g.connect(master);o.onended=()=>{voices--;o.disconnect();g.disconnect();};o.start(now);o.stop(now+interval);}catch{voices=Math.max(0,voices-1);}
 }
 function setMusic(v){musicEnabled=Boolean(v);try{localStorage.setItem('shinobi-music',musicEnabled?'on':'off');}catch{}}
 function setEnabled(v){enabled=Boolean(v);try{localStorage.setItem('shinobi-sound',enabled?'on':'off');}catch{}if(enabled)unlock();else wind(false);}
 function setVolume(v){volume=Math.max(0,Math.min(1,Number(v)||0));if(master)master.gain.value=volume;try{localStorage.setItem('shinobi-volume',String(volume));}catch{}}
 return {unlock,play,wind,music,setMusic,get musicEnabled(){return musicEnabled},setEnabled,setVolume,get enabled(){return enabled},get volume(){return volume}};
}
export function createFeedback(view,layer){
 let freeze=0,shake=0,clock=0,enabled=true;const numbers=[],pool=[];
 try{enabled=localStorage.getItem('shinobi-shake')!=='off';}catch{}
 function impact(amount,hitStop){shake=Math.max(shake,Number.isFinite(amount)?Math.max(0,amount):0);freeze=Math.max(freeze,Number.isFinite(hitStop)?Math.max(0,hitStop):0);}
 function number(x,z,amount,kind='normal'){if(!layer||numbers.length>=24)return;const el=pool.pop()||document.createElement('span');el.className='damage-number '+kind;el.textContent=String(amount)+(kind==='critical'?'!':'');el.style.opacity='1';layer.appendChild(el);numbers.push({el,x,z,life:.72});}
 function tick(dt){clock+=dt;freeze=Math.max(0,freeze-dt);shake=Math.max(0,shake-dt*1.5);}
 function updateNumbers(dt){for(let i=numbers.length-1;i>=0;i--){const n=numbers[i];n.life-=dt;if(n.life<=0){n.el.remove();pool.push(n.el);numbers.splice(i,1);continue;}const p=view.project?.(n.x,2.0+(1-n.life/.72)*1.0,n.z);if(!p){n.el.style.opacity='0';continue;}n.el.style.transform='translate('+p.x+'px,'+p.y+'px) translate(-50%,-50%)';n.el.style.opacity=String(Math.min(1,n.life/.22));}}
 function offset(){return enabled?{x:Math.sin(clock*111)*shake,z:Math.cos(clock*137)*shake*.65}:{x:0,z:0};}
 function reset(){freeze=shake=0;for(const n of numbers){n.el.remove();pool.push(n.el);}numbers.length=0;}
 function setShake(v){enabled=Boolean(v);try{localStorage.setItem('shinobi-shake',enabled?'on':'off');}catch{}}
 return {impact,number,tick,updateNumbers,offset,reset,setShake,get frozen(){return freeze>0},get shakeEnabled(){return enabled}};
}
