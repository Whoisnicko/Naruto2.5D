/* Apply a uniform desktop HUD scale using CSS viewport dimensions, not physical pixels. */
(()=>{'use strict';
 const root=document.documentElement;
 function scale(w,h){w=Math.max(1,Number(w)||1);h=Math.max(1,Number(h)||1);return Math.min(1.2,1.2*w/1600,1.2*h/900,w/1078,h/490);}
 function sync(){const value=scale(window.innerWidth,window.innerHeight);root.style.setProperty('--field-hud-fit',String(Math.round(value*10000)/10000));}
 window.addEventListener('resize',sync,{passive:true});sync();
})();
