import {DAY_SECONDS,DAY_RATE,worldTime,WEATHER,weatherDuration} from './world-data.js';

// The original campaign clock is retained; this is an isolated visual adapter.
export const ATMOSPHERE_PRESETS={
 dawn:{at:0,label:'Amanecer'},day:{at:48,label:'Día'},sunset:{at:130,label:'Atardecer'},night:{at:192,label:'Noche'}
};
export const WEATHER_LABELS={clear:'Despejado',rain:'Lluvia',fog:'Niebla',storm:'Tormenta'};
export const REGION_AMBIENCE={
 konoha:{wind:.36,frequency:420,lights:[[65,34],[79,34],[65,51],[79,51],[66,69],[78,63],[85,74],[92,62],[72,81]]},
 forest:{wind:.64,frequency:730,lights:[]},
 outpost:{wind:.48,frequency:520,lights:[[32,21],[53,22],[21,21],[42,21]]}
};
const GRADES=[
 [0,.83,.88,.22,.18],[18,1,1,0,0],[76,1,1,0,0],[96,.94,1.10,.18,.08],[130,.76,1.15,.42,.24],[156,.59,.80,.10,.58],[178,.49,.72,0,.78],[218,.49,.72,0,.78],[240,.83,.88,.22,.18]
];
const mix=(a,b,t)=>a+(b-a)*t,clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
export function sampleLight(clock){
 const q=((clock%DAY_SECONDS)+DAY_SECONDS)%DAY_SECONDS;let i=1;while(i<GRADES.length-1&&q>GRADES[i][0])i++;
 const a=GRADES[i-1],b=GRADES[i],t=(q-a[0])/(b[0]-a[0]),[brightness,saturation,sepia,night]=a.slice(1).map((v,j)=>mix(v,b[j+1],t));
 return {brightness,saturation,sepia,night,phase:q<18?'Amanecer':q<96?'Día':q<156?'Atardecer':q<218?'Noche':'Madrugada',time:worldTime(q)};
}
export function createAtmosphere(random=Math.random){
 let clock=0,elapsed=0,kind='clear',until=weatherDuration('clear',random),automatic=true,autoClock=true;
 let rain=0,fog=0,flash=0,nextFlash=0;
 function selectWeather(id){if(!Object.hasOwn(WEATHER,id))return false;kind=id;until=elapsed+weatherDuration(id,random);nextFlash=elapsed+4+random()*7;return true;}
 function setWeather(id){if(id==='auto'){automatic=true;until=elapsed+weatherDuration(kind,random);return true}if(!selectWeather(id))return false;automatic=false;return true}
 function setTime(id){if(id==='auto'){autoClock=true;return true}if(!Object.hasOwn(ATMOSPHERE_PRESETS,id))return false;clock=ATMOSPHERE_PRESETS[id].at;autoClock=false;return true}
 function tick(dt){dt=clamp(Number.isFinite(dt)?dt:0,0,.1);elapsed+=dt;if(autoClock)clock=(clock+dt*DAY_RATE)%DAY_SECONDS;
  if(automatic&&elapsed>=until){const q=random();selectWeather(kind==='clear'?(q<.56?'rain':q<.82?'fog':'storm'):'clear');}
  const w=WEATHER[kind],blend=1-Math.exp(-dt*1.8);rain=mix(rain,w.rain,blend);fog=mix(fog,w.fog,blend);
  if(kind==='storm'&&elapsed>=nextFlash){flash=.16;nextFlash=elapsed+8+random()*9;}flash=Math.max(0,flash-dt*.8);
 }
 return {tick,setTime,setWeather,state:()=>({clock,elapsed,kind,automatic,autoClock,rain,fog,flash,...sampleLight(clock)})}
}
// Screen-space effects use the same scene in both render backends; no gameplay changes.
export function createAtmosphereView({canvas,stage,project,reduced=false}){
 const ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,grade='',lastLabel='',acc=0;const drops=Array.from({length:110},(_,i)=>({x:((i*71+17)%113)/113,y:((i*43+7)%127)/127,s: .65+(i%7)*.11}));
 function resize(width,height){w=Math.max(1,width);h=Math.max(1,height);dpr=Math.min(globalThis.devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
 function draw(s,region,dt){if(!ctx)return;acc+=dt;if(acc>=.075||!grade){acc=0;const filter='brightness('+s.brightness.toFixed(3)+') saturate('+s.saturation.toFixed(3)+') sepia('+s.sepia.toFixed(3)+')';if(filter!==grade){grade=filter;stage.style.filter=grade}}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  if(s.night>.005){ctx.fillStyle='rgba(15,33,77,'+(s.night*.20).toFixed(3)+')';ctx.fillRect(0,0,w,h);}
  const lights=REGION_AMBIENCE[region]?.lights||[];if(s.night>.08){for(const [x,y] of lights){const q=project(x,1.25,y);if(!q||q[0]<-80||q[0]>w+80||q[1]<-80||q[1]>h+80)continue;const [px,py,scale]=q;const radius=clamp(scale*2.6,12,65),g=ctx.createRadialGradient(px,py,0,px,py,radius);g.addColorStop(0,'rgba(255,208,116,'+(s.night*.48).toFixed(3)+')');g.addColorStop(.28,'rgba(255,166,70,'+(s.night*.20).toFixed(3)+')');g.addColorStop(1,'rgba(255,170,70,0)');ctx.fillStyle=g;ctx.fillRect(px-radius,py-radius,radius*2,radius*2);}}
  if(s.fog>.005){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(198,216,207,'+(s.fog*.56).toFixed(3)+')');g.addColorStop(.6,'rgba(198,216,207,'+(s.fog*.18).toFixed(3)+')');g.addColorStop(1,'rgba(198,216,207,'+(s.fog*.4).toFixed(3)+')');ctx.fillStyle=g;ctx.fillRect(0,0,w,h)}
  if(s.rain>.025&&!reduced){const n=Math.round(drops.length*s.rain*Math.min(1,w/900));ctx.strokeStyle='rgba(192,222,235,'+(.14+s.rain*.27).toFixed(3)+')';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<n;i++){const d=drops[i],x=((d.x*w-s.elapsed*85*d.s)%w+w)%w,y=((d.y*h+s.elapsed*430*d.s)%h+h)%h;ctx.moveTo(x,y);ctx.lineTo(x-7*d.s,y+20*d.s)}ctx.stroke()}
  if(s.rain<.08&&s.fog<.25&&!reduced){const n=region==='forest'?26:14;ctx.fillStyle=s.night>.3?'rgba(211,235,117,.54)':'rgba(244,231,181,.40)';for(let i=0;i<n;i++){const d=drops[i],x=(d.x*w+s.elapsed*(4+i%3))%w,y=(d.y*h+Math.sin(s.elapsed*.5+i)*14+h)%h;ctx.beginPath();ctx.arc(x,y,s.night>.3?1.5:1,0,Math.PI*2);ctx.fill()}}
  if(s.flash>0&&!reduced){ctx.fillStyle='rgba(222,231,255,'+s.flash.toFixed(3)+')';ctx.fillRect(0,0,w,h)}
 }
 return {resize,draw}
}
// Original procedural wind/rain ambience; only starts on explicit user action.
export function createAmbienceAudio(){
 let ac=null,source=null,filter=null,gain=null,enabled=false;
 async function toggle(){if(enabled){enabled=false;if(gain)gain.gain.setTargetAtTime(0,ac.currentTime,.12);return false}
  try{const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return false;if(!ac){ac=new Audio();const buffer=ac.createBuffer(1,ac.sampleRate*3,ac.sampleRate),data=buffer.getChannelData(0);let last=0;for(let i=0;i<data.length;i++){last=(last+.02*(Math.random()*2-1))/1.02;data[i]=last*3.5;}source=ac.createBufferSource();source.buffer=buffer;source.loop=true;filter=ac.createBiquadFilter();filter.type='lowpass';gain=ac.createGain();gain.gain.value=0;source.connect(filter);filter.connect(gain);gain.connect(ac.destination);source.start();}await ac.resume();enabled=true;return true;}catch{return false}}
 function update(s,region,hidden=false){if(!ac||!gain||!enabled)return;const m=REGION_AMBIENCE[region]||REGION_AMBIENCE.konoha;gain.gain.setTargetAtTime(hidden?0:.035+m.wind*.05+s.rain*.045,ac.currentTime,.18);filter.frequency.setTargetAtTime(m.frequency+s.rain*1450,ac.currentTime,.25)}
 return {toggle,update,get enabled(){return enabled}}
}
