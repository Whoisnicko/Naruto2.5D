// Lightweight procedural audio: no media downloads, no copyrighted recordings.
// Cosmetic contact profiles: gameplay timing is unchanged.
export const CONTACT_FEEL=Object.freeze({
 light:{life:.19,sparks:4,kick:.045,zoom:.003,cue:'hit',color:[1,.78,.42]},
 heavy:{life:.28,sparks:7,kick:.12,zoom:.012,cue:'heavy',color:[1,.54,.22]},
 critical:{life:.29,sparks:8,kick:.13,zoom:.014,cue:'criticalHit',color:[1,.89,.47]},
 chakra:{life:.30,sparks:7,kick:.10,zoom:.012,cue:'chakraImpact',color:[.40,.79,1]},
 kyubi:{life:.30,sparks:7,kick:.10,zoom:.012,cue:'chakraImpact',color:[.86,.48,1]},
 block:{life:.20,sparks:5,kick:.035,zoom:.002,cue:'guardHit',color:[.96,.85,.56]},
 break:{life:.28,sparks:8,kick:.09,zoom:.008,cue:'guardCrack',color:[1,.56,.36]},
 dodge:{life:.15,sparks:3,kick:0,zoom:0,cue:'evade',color:[.76,.9,1]},
 hurt:{life:.21,sparks:5,kick:.065,zoom:.004,cue:'hurt',color:[1,.43,.34]}
});
const CUES={
 criticalHit:[['triangle',175,48,.12,.12],['square',750,180,.07,.065]],
 chakraImpact:[['sawtooth',420,52,.16,.095],['sine',970,100,.20,.11]],
 guardHit:[['triangle',1350,420,.095,.095],['sine',180,85,.10,.07]],
 guardCrack:[['sawtooth',210,39,.22,.10],['square',900,110,.09,.06]],
 evade:[['triangle',680,190,.10,.045]],
 step:[['triangle',115,60,.045,.045]],dash:[['sawtooth',510,95,.16,.075]],
 swing:[['triangle',280,95,.08,.10]],hit:[['square',115,48,.075,.11],['triangle',310,90,.07,.055]],
 heavy:[['sawtooth',105,36,.15,.10],['triangle',430,72,.18,.08]],
 shuriken:[['triangle',920,310,.11,.075]],clone:[['sine',190,520,.18,.09]],
 sageCharge:[['sine',72,140,2.35,.10],['triangle',160,710,2.25,.07],['sine',380,520,2.1,.04]],chainCharge:[['sine',45,90,1.95,.12],['triangle',95,550,1.95,.09],['sawtooth',75,320,1.8,.035]],blackCharge:[['triangle',130,850,.95,.075],['square',190,680,.8,.035]],blackChidori:[['sawtooth',870,105,.45,.10],['square',240,90,.7,.045]],shockTick:[['square',480,100,.18,.07],['triangle',220,55,.22,.07]],fireCharge:[['triangle',95,280,.7,.08]],fireLaunch:[['sawtooth',190,65,.45,.08]],fireBurst:[['sawtooth',100,26,.65,.13],['triangle',65,28,.7,.12]],
 sharingan:[['sine',260,1580,.28,.095],['triangle',980,360,.52,.075],['square',112,65,.32,.025]],megaChidori:[['sawtooth',70,330,3.8,.08],['triangle',180,760,3.9,.055],['square',290,950,2.8,.022]],megaLaunch:[['sawtooth',880,150,.52,.10],['triangle',92,250,.6,.12]],megaImpact:[['sawtooth',135,28,1.3,.14],['triangle',84,23,1.6,.18],['square',830,95,.4,.055],['sine',1800,130,.6,.09]],
 kyubi:[['sawtooth',88,35,.65,.12],['triangle',52,34,.8,.15],['square',155,48,.38,.035]],kyubiHit:[['sawtooth',145,42,.25,.12],['triangle',240,55,.28,.085]],
 event:[['triangle',392,523,.18,.13],['sine',523,784,.31,.1],['triangle',196,294,.45,.07]],
 thunder:[['sawtooth',62,24,.8,.11],['triangle',48,22,1.1,.13]],
 charge:[['sine',160,550,.25,.08],['triangle',330,680,.22,.04]],
 rasengan:[['sawtooth',490,65,.23,.09],['sine',850,120,.22,.12]],
 levelUp:[['sine',92,42,.32,.13,0],['triangle',150,720,.29,.075,0],['triangle',392,392,.23,.10,.08],['triangle',523.25,523.25,.24,.105,.17],['triangle',659.25,659.25,.30,.11,.27],['sine',1046.5,1046.5,.55,.095,.39],['triangle',784,784,.42,.065,.39],['sine',1850,580,.50,.045,.40]],
 hurt:[['square',200,75,.1,.075]],reward:[['sine',440,660,.15,.09],['triangle',660,880,.23,.05]]
};
export function createAudio(){
 let ctx=null,master=null,ambience=null,enabled=true,volume=.32,voices=0,musicEnabled=true,musicClock=0,musicStep=0,lastMood='';const melodies={explore:[62,0,65,69,67,0,65,0,60,0,62,65,69,0,67,0],boss:[50,50,57,53,50,0,58,57,48,48,55,53,48,0,57,55],defeat:[69,65,64,62,0,60,57,62,0,0]};
 try{musicEnabled=localStorage.getItem('shinobi-music')!=='off';enabled=localStorage.getItem('shinobi-sound')!=='off';const v=localStorage.getItem('shinobi-volume');if(v!==null&&Number.isFinite(Number(v)))volume=Math.max(0,Math.min(1,Number(v)));}catch{}
 function unlock(){
  if(!enabled)return;
  try{
   if(!ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;ctx=new A();master=ctx.createGain();master.gain.value=volume;master.connect(ctx.destination);}
   if(ctx.state==='suspended')void ctx.resume().catch(()=>{});
  }catch(e){console.warn('Audio unavailable',e);}
 }
 function play(name,pan=0){if(!enabled||!ctx||ctx.state!=='running')return;pan=Number.isFinite(pan)?Math.max(-.8,Math.min(.8,pan)):0;
  for(const [type,f0,f1,dur,amp,delay=0] of CUES[name]||[]){if(voices>=(name==='levelUp'?22:14))break;try{
   const o=ctx.createOscillator(),g=ctx.createGain(),now=ctx.currentTime+delay;let stereo=null;voices++;o.type=type;o.frequency.setValueAtTime(f0,now);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),now+dur);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(amp,now+.009);g.gain.exponentialRampToValueAtTime(.0001,now+dur);o.connect(g);if(pan&&typeof ctx.createStereoPanner==='function'){try{stereo=ctx.createStereoPanner();stereo.pan.value=pan;g.connect(stereo);stereo.connect(master);}catch{stereo?.disconnect();stereo=null;g.disconnect();g.connect(master);}}else g.connect(master);o.onended=()=>{voices=Math.max(0,voices-1);o.disconnect();g.disconnect();stereo?.disconnect();};o.start(now);o.stop(now+dur+.01);
  }catch(e){voices=Math.max(0,voices-1);}}
 }
 function wind(on){if(!ctx||!master)return;
  if(on&&enabled&&!ambience){try{
   const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),a=b.getChannelData(0);let last=0,seed=23;for(let i=0;i<a.length;i++){seed=(seed*1664525+1013904223)>>>0;last=(last+.024*(seed/4294967296*2-1))/.999;last=Math.max(-.6,Math.min(.6,last));a[i]=last;}
   const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=b;src.loop=true;filter.type='lowpass';filter.frequency.value=420;gain.gain.value=.045;src.connect(filter);filter.connect(gain);gain.connect(master);src.start();ambience={src,filter,gain};
  }catch{}}
  if((!on||!enabled)&&ambience){try{ambience.src.stop();ambience.src.disconnect();ambience.filter.disconnect();ambience.gain.disconnect();}catch{}ambience=null;}
 }
 // Dedicated, audible original defeat cue, independent of ambient music scheduling.
 let defeatBus=null,defeatNodes=[];
 function stopDefeat(){const bus=defeatBus;defeatBus=null;for(const o of defeatNodes){try{o.stop();o.disconnect()}catch{}}defeatNodes=[];try{bus?.disconnect()}catch{}}
 function playDefeat(){if(!enabled)return false;unlock();if(!ctx||!master||ctx.state!=='running')return false;if(defeatBus)return true;try{const bus=ctx.createGain();bus.gain.value=.64;bus.connect(master);defeatBus=bus;const now=ctx.currentTime+.025;const notes=[[69,0,.72],[65,.76,.68],[64,1.49,.69],[62,2.26,1.2],[60,3.62,.7],[57,4.39,.65],[62,5.13,1.15]],bass=[[50,0,2.1],[46,2.1,2.1],[45,4.2,2.05]];function note(n,at,dur,amp,type){const o=ctx.createOscillator(),env=ctx.createGain(),t=now+at;o.type=type;o.frequency.value=440*2**((n-69)/12);env.gain.setValueAtTime(.0001,t);env.gain.exponentialRampToValueAtTime(amp,t+.06);env.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(env);env.connect(bus);defeatNodes.push(o);o.onended=()=>{o.disconnect();env.disconnect();};o.start(t);o.stop(t+dur+.01);}for(const [n,t,len] of notes){note(n,t,len,.25,'triangle');note(n+12,t,len*.75,.035,'sine');}for(const [n,t,len] of bass){note(n,t,len,.15,'sine');note(n+7,t,len,.065,'sine');}return true;}catch(e){stopDefeat();return false;}}
 function music(dt,mood='explore'){
 if(!musicEnabled||!enabled||!ctx||ctx.state!=='running')return;
 if(mood!==lastMood){lastMood=mood;musicClock=0;musicStep=0;}
 musicClock-=dt;if(musicClock>0)return;const interval=mood==='defeat'?.66:mood==='boss'?.22:.46;musicClock+=interval;const melody=melodies[mood]||melodies.explore,step=musicStep++,n=melody[step%melody.length];if(mood==='defeat'&&step%3===0&&step<9&&voices<10){const bass=[50,46,45][Math.floor(step/3)];try{const o=ctx.createOscillator(),g=ctx.createGain(),now=ctx.currentTime,dur=1.8;voices++;o.type='sine';o.frequency.value=440*2**((bass-69)/12);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.045,now+.13);g.gain.exponentialRampToValueAtTime(.0001,now+dur);o.connect(g);g.connect(master);o.onended=()=>{voices=Math.max(0,voices-1);o.disconnect();g.disconnect();};o.start(now);o.stop(now+dur);}catch{voices=Math.max(0,voices-1);}}if(!n||voices>=12)return;
 try{const o=ctx.createOscillator(),g=ctx.createGain(),now=ctx.currentTime;voices++;o.type=mood==='boss'||mood==='defeat'?'triangle':'sine';o.frequency.value=440*2**((n-69)/12);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(mood==='defeat'?.075:.045,now+(mood==='defeat'?.055:.018));g.gain.exponentialRampToValueAtTime(.0001,now+interval*.9);o.connect(g);g.connect(master);o.onended=()=>{voices--;o.disconnect();g.disconnect();};o.start(now);o.stop(now+interval);}catch{voices=Math.max(0,voices-1);}
 }
 function setMusic(v){musicEnabled=Boolean(v);try{localStorage.setItem('shinobi-music',musicEnabled?'on':'off');}catch{}}
 function setEnabled(v){enabled=Boolean(v);if(!enabled)stopDefeat();try{localStorage.setItem('shinobi-sound',enabled?'on':'off');}catch{}if(enabled)unlock();else wind(false);}
 function setVolume(v){volume=Math.max(0,Math.min(1,Number(v)||0));if(master)master.gain.value=volume;try{localStorage.setItem('shinobi-volume',String(volume));}catch{}}
 return {unlock,play,wind,music,playDefeat,stopDefeat,restartMusic(){lastMood='';musicClock=0;musicStep=0;},setMusic,get musicEnabled(){return musicEnabled},setEnabled,setVolume,get enabled(){return enabled},get volume(){return volume}};
}
export function createFeedback(view,layer){
 let freeze=0,shake=0,clock=0,enabled=true,intensity=1,kickX=0,kickZ=0,zoom=0,lastDodge=-99;const numbers=[],pool=[],bursts=Array.from({length:8},()=>({life:0}));
 try{enabled=localStorage.getItem('shinobi-shake')!=='off';}catch{}
 function impact(amount,hitStop){shake=Math.max(shake,Number.isFinite(amount)?Math.max(0,amount):0);freeze=Math.max(freeze,Number.isFinite(hitStop)?Math.max(0,hitStop):0);}
 function number(x,z,amount,kind='normal'){if(!layer||numbers.length>=24)return;const el=pool.pop()||document.createElement('span');el.className='damage-number '+kind;el.textContent=String(amount)+(kind==='critical'?'!':'');el.style.opacity='1';layer.appendChild(el);numbers.push({el,x,z,life:.72});}
 function contact(kind,x,z,dx=1,dz=0){const profile=Object.hasOwn(CONTACT_FEEL,kind)?CONTACT_FEEL[kind]:null;if(!profile||!Number.isFinite(x)||!Number.isFinite(z))return null;if(kind==='dodge'&&clock-lastDodge<.18)return null;if(kind==='dodge')lastDodge=clock;const d=Math.hypot(dx,dz);if(Number.isFinite(d)&&d>.0001){dx/=d;dz/=d;}else{dx=1;dz=0;}let b=bursts.find(v=>v.life<=0);if(!b)b=bursts.reduce((a,v)=>v.life<a.life?v:a,bursts[0]);Object.assign(b,{kind,x,z,dx,dz,life:profile.life,max:profile.life,profile});kickX=Math.max(-.16,Math.min(.16,kickX+dx*profile.kick));kickZ=Math.max(-.16,Math.min(.16,kickZ+dz*profile.kick));zoom=Math.min(.022,Math.max(zoom,profile.zoom));return profile.cue;}
 function tick(dt){clock+=dt;freeze=Math.max(0,freeze-dt);shake=Math.max(0,shake-dt*1.5);const decay=Math.exp(-dt*16);kickX*=decay;kickZ*=decay;zoom*=decay;for(const b of bursts)b.life=Math.max(0,b.life-dt);}
 function updateNumbers(dt){for(let i=numbers.length-1;i>=0;i--){const n=numbers[i];n.life-=dt;if(n.life<=0){n.el.remove();pool.push(n.el);numbers.splice(i,1);continue;}const p=view.project?.(n.x,2.0+(1-n.life/.72)*1.0,n.z);if(!p){n.el.style.opacity='0';continue;}n.el.style.transform='translate('+p.x+'px,'+p.y+'px) translate(-50%,-50%)';n.el.style.opacity=String(Math.min(1,n.life/.22));}}
 function offset(reactive=true){return enabled?{x:(Math.sin(clock*111)*shake+(reactive?kickX:0))*intensity,z:(Math.cos(clock*137)*shake*.65+(reactive?kickZ:0))*intensity,zoom:reactive?zoom*intensity:0}:{x:0,z:0,zoom:0};}
 function reset(){freeze=shake=kickX=kickZ=zoom=0;lastDodge=-99;for(const b of bursts)b.life=0;for(const n of numbers){n.el.remove();pool.push(n.el);}numbers.length=0;}
 function setShake(v){enabled=Boolean(v);try{localStorage.setItem('shinobi-shake',enabled?'on':'off');}catch{}}
 return {impact,contact,bursts,number,tick,updateNumbers,offset,reset,setShake,setIntensity(v){intensity=Number.isFinite(v)?Math.min(1,Math.max(0,v)):1;},get intensity(){return intensity},get frozen(){return freeze>0},get shakeEnabled(){return enabled}};
}
