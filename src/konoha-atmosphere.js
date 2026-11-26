import {DAY_SECONDS,DAY_RATE,worldTime,WEATHER,weatherDuration} from './world-data.js';

// Three visual phases, with the original six-minute clock. No sound subsystem.
export const ATMOSPHERE_PRESETS={day:{at:48,label:'Día'},sunset:{at:130,label:'Atardecer'},night:{at:192,label:'Noche'}};
export const WEATHER_LABELS={clear:'Despejado',rain:'Lluvia',fog:'Niebla',storm:'Tormenta'};
export const ATMOSPHERE_WEATHER={
 clear:{rain:0,fog:0,shade:0},rain:{rain:.86,fog:.05,shade:.07},fog:{rain:0,fog:.83,shade:.03},storm:{rain:1,fog:.24,shade:.22}
};
// Brightness, saturation, sepia, darkness alpha and warm wash. Preserve neutral daylight.
const GRADES=[[0,1,1,0,0,0],[80,1,1,0,0,0],[105,.98,1.30,.48,0,.25],[130,.92,1.55,.83,.04,.43],[155,.91,1.15,.45,.18,.25],[175,.91,.94,0,.65,0],[232,.91,.94,0,.65,0],[240,1,1,0,0,0]];
const mix=(a,b,t)=>a+(b-a)*t,clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),wrap=(v,n)=>((v%n)+n)%n;
export function sampleLight(clock){
 const q=wrap(clock,DAY_SECONDS);let i=1;while(i<GRADES.length-1&&q>GRADES[i][0])i++;
 const a=GRADES[i-1],b=GRADES[i],t=(q-a[0])/(b[0]-a[0]),[brightness,saturation,sepia,night,warm]=a.slice(1).map((v,j)=>mix(v,b[j+1],t));
 return {brightness,saturation,sepia,night,warm,phase:q<96?'Día':q<160?'Atardecer':'Noche',time:worldTime(q)};
}
export function createAtmosphere(random=Math.random){
 let clock=0,elapsed=0,kind='clear',until=weatherDuration('clear',random),automatic=true,autoClock=true;
 let rain=0,fog=0,shade=0,flash=0,boltAge=Infinity,boltSeed=0,nextFlash=Infinity;
 function selectWeather(id){if(!Object.hasOwn(WEATHER,id))return false;kind=id;until=elapsed+weatherDuration(id,random);flash=0;boltAge=Infinity;nextFlash=id==='storm'?elapsed+.65+random()*.65:Infinity;return true}
 function setWeather(id){if(id==='auto'){automatic=true;until=elapsed+weatherDuration(kind,random);return true}if(!selectWeather(id))return false;automatic=false;return true}
 function setTime(id){if(id==='auto'){autoClock=true;return true}if(!Object.hasOwn(ATMOSPHERE_PRESETS,id))return false;clock=ATMOSPHERE_PRESETS[id].at;autoClock=false;return true}
 function tick(dt){dt=clamp(Number.isFinite(dt)?dt:0,0,.1);elapsed+=dt;if(autoClock)clock=wrap(clock+dt*DAY_RATE,DAY_SECONDS);
  if(automatic&&elapsed>=until){const q=random();selectWeather(kind==='clear'?(q<.56?'rain':q<.82?'fog':'storm'):'clear')}
  const w=ATMOSPHERE_WEATHER[kind],blend=1-Math.exp(-dt*2.4);rain=mix(rain,w.rain,blend);fog=mix(fog,w.fog,blend);shade=mix(shade,w.shade,blend);
  if(kind==='storm'){boltAge+=dt;if(elapsed>=nextFlash){boltAge=0;boltSeed=random();nextFlash=elapsed+4.5+random()*3.5;}flash=boltAge<.14?.54*(1-boltAge/.14):boltAge>=.23&&boltAge<.40?.35*(1-(boltAge-.23)/.17):0;}
 }
 return {tick,setTime,setWeather,state:()=>({clock,elapsed,kind,automatic,autoClock,rain,fog,shade,flash,boltAge,boltSeed,...sampleLight(clock)})}
}
// The darkness mask is separate from the scene. Light pools erase local darkness,
// then a warm source/core is drawn above it. No WebGL lighting dependency.
export function createAtmosphereView({canvas,stage,project,lamps=()=>[],reduced=false}){
 const ctx=canvas.getContext('2d');let w=1,h=1,dpr=1,grade='',acc=0;
 const drops=Array.from({length:560},(_,i)=>({x:wrap(Math.sin(i*127.1+3)*43758.5453,1),y:wrap(Math.sin(i*269.5+11)*24634.6345,1),s:.65+(i%9)*.10}));
 function resize(width,height){w=Math.max(1,width);h=Math.max(1,height);dpr=Math.min(globalThis.devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
 function radial(x,y,rx,ry,stops){ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);const g=ctx.createRadialGradient(0,0,0,0,0,1);for(const [at,color] of stops)g.addColorStop(at,color);ctx.fillStyle=g;ctx.fillRect(-1,-1,2,2);ctx.restore()}
 function draw(s,region,dt,player){
  if(!ctx)return;acc+=dt;if(acc>=.06||!grade){acc=0;const filter='brightness('+s.brightness.toFixed(3)+') saturate('+s.saturation.toFixed(3)+') sepia('+s.sepia.toFixed(3)+')';if(filter!==grade){grade=filter;stage.style.filter=grade}}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,w,h);
  if(s.night>.005){ctx.fillStyle='rgba(9,18,43,'+s.night.toFixed(3)+')';ctx.fillRect(0,0,w,h)}
  const active=[];if(s.night>.07){for(const lamp of lamps(region)){const head=lamp.head,ground=lamp.ground;if(!head||!ground||head[0]<-220||head[0]>w+220||head[1]<-220||head[1]>h+220)continue;active.push(lamp);}
   ctx.globalCompositeOperation='destination-out';for(const {head,ground} of active){const [x,y,k]=ground,r=clamp(k*4.6,34,220);radial(x,y,r,r*.60,[[0,'rgba(0,0,0,.98)'],[.42,'rgba(0,0,0,.76)'],[1,'rgba(0,0,0,0)']]);const [hx,hy,hk]=head;const a=clamp(hk*1.65,16,82);radial(hx,hy,a,a,[[0,'rgba(0,0,0,.97)'],[.25,'rgba(0,0,0,.80)'],[1,'rgba(0,0,0,0)']]);}
   if(player){const q=project(player.x,.75,player.y);if(q){const r=clamp(q[2]*2,18,78);radial(q[0],q[1],r,r,[[0,'rgba(0,0,0,.34)'],[1,'rgba(0,0,0,0)']])}}
   ctx.globalCompositeOperation='source-over';
   const power=clamp(s.night/.65,0,1);for(const {head,ground} of active){const [x,y,k]=ground,r=clamp(k*4.6,34,220);radial(x,y,r,r*.60,[[0,'rgba(255,171,54,'+(.33*power)+')'],[.38,'rgba(255,180,65,'+(.18*power)+')'],[1,'rgba(255,150,30,0)']]);const [hx,hy,hk]=head,a=clamp(hk*1.7,16,82);radial(hx,hy,a,a,[[0,'rgba(255,246,189,'+power+')'],[.12,'rgba(255,213,104,'+(.92*power)+')'],[.38,'rgba(255,161,39,'+(.42*power)+')'],[1,'rgba(255,140,25,0)']]);ctx.fillStyle='rgba(255,248,210,'+power+')';ctx.beginPath();ctx.arc(hx,hy,clamp(hk*.13,2,5),0,Math.PI*2);ctx.fill();}
  }
  if(s.warm>.005){ctx.fillStyle='rgba(225,93,19,'+(s.warm*.72).toFixed(3)+')';ctx.fillRect(0,0,w,h);const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(255,176,66,'+s.warm+')');g.addColorStop(1,'rgba(255,176,66,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h)}
  if(s.shade>.005){ctx.fillStyle='rgba(19,32,48,'+s.shade.toFixed(3)+')';ctx.fillRect(0,0,w,h)}
  if(s.fog>.005){const a=s.fog;ctx.fillStyle='rgba(188,207,211,'+(a*.40)+')';ctx.fillRect(0,0,w,h);const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(215,226,225,'+(a*.84)+')');g.addColorStop(.55,'rgba(204,220,220,'+(a*.50)+')');g.addColorStop(1,'rgba(193,211,214,'+(a*.24)+')');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);for(let i=0;i<3;i++){const x=(reduced?i*w/2:wrap(i*w*.48+s.elapsed*(12+i*6),w*1.6)-w*.3);radial(x,h*(.28+i*.25),w*.62,h*.23,[[0,'rgba(222,234,233,'+(a*.24)+')'],[1,'rgba(222,234,233,0)']]);}}
  if(s.rain>.025){const storm=s.kind==='storm',n=Math.round((storm?560:390)*s.rain*Math.min(1,Math.max(.5,w/1150))*(reduced?.38:1));const time=reduced?0:s.elapsed;ctx.strokeStyle='rgba(195,224,242,'+(storm?.71:.59)*s.rain+')';ctx.lineWidth=storm?1.8:1.45;ctx.beginPath();for(let i=0;i<n;i++){const d=drops[i],x=wrap(d.x*w-time*(storm?260:135)*d.s,w),y=wrap(d.y*h+time*(storm?880:640)*d.s,h);ctx.moveTo(x,y);ctx.lineTo(x-(storm?23:12)*d.s,y+(storm?48:34)*d.s)}ctx.stroke();if(!reduced){ctx.strokeStyle='rgba(205,231,244,'+(.30*s.rain)+')';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<36;i++){const d=drops[i],t=wrap(s.elapsed*2+d.x,1);if(t>.45)continue;const x=d.x*w,y=h*(.35+d.y*.65);ctx.moveTo(x-4*t,y);ctx.lineTo(x+4*t,y)}ctx.stroke();}}
  if(s.rain<.08&&s.fog<.25&&!reduced){const n=region==='forest'?26:14;ctx.fillStyle=s.night>.3?'rgba(211,235,117,.54)':'rgba(244,231,181,.40)';for(let i=0;i<n;i++){const d=drops[i],x=wrap(d.x*w+s.elapsed*(4+i%3),w),y=wrap(d.y*h+Math.sin(s.elapsed*.5+i)*14,h);ctx.beginPath();ctx.arc(x,y,s.night>.3?1.5:1,0,Math.PI*2);ctx.fill()}}
  if(s.kind==='storm'&&!reduced){if(s.flash>0){ctx.fillStyle='rgba(222,235,255,'+s.flash.toFixed(3)+')';ctx.fillRect(0,0,w,h)}if(s.boltAge<.15){const x=w*(.19+.62*s.boltSeed);ctx.strokeStyle='rgba(230,243,255,.88)';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-w*.035,h*.13);ctx.lineTo(x+w*.012,h*.16);ctx.lineTo(x-w*.025,h*.32);ctx.moveTo(x-w*.035,h*.13);ctx.lineTo(x-w*.077,h*.22);ctx.stroke()}}
 }
 return {resize,draw}
}
