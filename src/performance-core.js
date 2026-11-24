// Presentation settings and bounded frame telemetry. Never part of campaign saves.
export const PERFORMANCE_PRESETS=Object.freeze({
 ultra:Object.freeze({preset:'ultra',fpsLimit:'unlimited',resolution:125,particles:100,shake:35,targetAssist:true,dynamic:true}),
 balanced:Object.freeze({preset:'balanced',fpsLimit:'60',resolution:100,particles:75,shake:35,targetAssist:true,dynamic:true}),
 performance:Object.freeze({preset:'performance',fpsLimit:'60',resolution:85,particles:50,shake:35,targetAssist:true,dynamic:true})
});
const bound=(v,lo,hi,fallback)=>Number.isFinite(Number(v))&&v!==null?Math.min(hi,Math.max(lo,Number(v))):fallback;
export function normalizePerformance(value={}){
 const v=value&&typeof value==='object'?value:{},base=PERFORMANCE_PRESETS[v.preset]||PERFORMANCE_PRESETS.ultra;
 return {preset:base.preset,fpsLimit:['60','120','144','unlimited'].includes(String(v.fpsLimit))?String(v.fpsLimit):base.fpsLimit,
 resolution:Math.round(bound(v.resolution,55,125,base.resolution)/5)*5,particles:[50,75,100].includes(Number(v.particles))?Number(v.particles):base.particles,
 shake:Math.round(bound(v.shake,0,100,base.shake)),targetAssist:true,dynamic:typeof v.dynamic==='boolean'?v.dynamic:base.dynamic};
}
export function createPerformanceController(initial){
 let settings=normalizePerformance(initial),scale=settings.resolution/100,good=0,bad=0,windowStart=null,head=0,count=0,lastReport={fps:0,p95:0,max:0,cpu:0,samples:0};
 const gaps=new Float64Array(360),costs=new Float64Array(360),windowGaps=new Float64Array(360),windowCosts=new Float64Array(360);let wh=0,wc=0;
 const resetWindow=()=>{windowStart=null;wh=wc=0;good=bad=0;};
 function configure(v){settings=normalizePerformance(v);scale=settings.resolution/100;head=count=0;lastReport={fps:0,p95:0,max:0,cpu:0,samples:0};resetWindow();}
 function stats(a,b,n){if(!n)return {fps:0,p95:0,max:0,cpu:0,samples:0};const sorted=Array.from(a.subarray(0,n)).sort((x,y)=>x-y);let total=0,cpu=0;for(let i=0;i<n;i++){total+=a[i];cpu+=b[i];}return {fps:1000*n/total,p95:sorted[Math.ceil(.95*n)-1],max:sorted[n-1],cpu:cpu/n,samples:n};}
 function report(){lastReport=stats(gaps,costs,count);return lastReport;}
 function sample(now,gap,cpu){
  // Ignore suspended tabs and long discontinuities instead of adapting to them.
  if(!Number.isFinite(gap)||gap<=0||gap>250||!Number.isFinite(cpu)||cpu<0){resetWindow();head=count=0;lastReport={fps:0,p95:0,max:0,cpu:0,samples:0};return false;}
  gaps[head]=gap;costs[head]=cpu;head=(head+1)%gaps.length;count=Math.min(count+1,gaps.length);
  windowGaps[wh]=gap;windowCosts[wh]=cpu;wh=(wh+1)%windowGaps.length;wc=Math.min(wc+1,windowGaps.length);
  if(windowStart===null)windowStart=now;
  if(now-windowStart<2000)return false;
  const m=stats(windowGaps,windowCosts,wc);windowStart=now;wh=wc=0;
  // A 60 FPS floor is intentional, not an attempt to infer monitor refresh.
  if(!settings.dynamic||m.samples<20)return false;
  const slow=m.p95>21&&m.fps<57||m.cpu>14,fast=m.p95<=19&&m.cpu<11&&m.fps>=57;
  bad=slow?bad+1:0;good=fast?good+1:0;
  const ceiling=settings.resolution/100,floor=Math.min(ceiling,.65),prev=scale;
  if(bad>=2){scale=Math.max(floor,Math.round((scale-.10)*100)/100);bad=good=0;}
  else if(good>=3){scale=Math.min(ceiling,Math.round((scale+.05)*100)/100);bad=good=0;}
  return scale!==prev;
 }
 return {configure,sample,report,resetWindow,get settings(){return {...settings}},get fpsLimit(){return settings.fpsLimit},get scale(){return scale},get current(){return lastReport}};
}
