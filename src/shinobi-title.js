/* Title-only presentation. Existing game handlers remain authoritative. */
(()=>{
 const $=id=>document.getElementById(id),menu=$('menu'),panel=$('panel'),kunai=$('menuKunai'),credits=$('creditsDialog');
 const buttons=()=>Array.from(panel.querySelectorAll('button:not(:disabled)'));
 let selected=null,userSelected=false;
 function point(button){if(!button||button.disabled)return;selected=button;panel.dataset.selected=button.id;const box=panel.getBoundingClientRect(),r=button.getBoundingClientRect();if(box.height&&r.height)kunai.style.top=(r.top-box.top+r.height/2)+'px';}
 function refresh(){if(!userSelected||!selected||selected.disabled)selected=$('continue').disabled?($('start').disabled?buttons()[0]:$('start')):$('continue');point(selected);}
 panel.addEventListener('pointerover',e=>{const b=e.target.closest('button');if(b&&!b.disabled){userSelected=true;point(b);}});
 panel.addEventListener('focusin',e=>{userSelected=true;point(e.target.closest('button'));});
 panel.addEventListener('pointerleave',()=>{if(panel.contains(document.activeElement))point(document.activeElement.closest('button'));});
 new MutationObserver(refresh).observe(panel,{subtree:true,attributes:true,attributeFilter:['disabled']});
 new ResizeObserver(refresh).observe(panel);
 new MutationObserver(refresh).observe(menu,{attributes:true,attributeFilter:['style']});
 addEventListener('keydown',e=>{if(credits.open){e.stopImmediatePropagation();if(e.key==='Escape'){e.preventDefault();credits.close();}return;}if(menu.style.display==='none'||!$('controlSettings').hidden)return;if(['ArrowUp','ArrowDown','Home','End'].includes(e.key)){const bs=buttons();if(!bs.length)return;e.preventDefault();e.stopImmediatePropagation();let i=bs.indexOf(selected);i=e.key==='Home'?0:e.key==='End'?bs.length-1:(i+(e.key==='ArrowDown'?1:-1)+bs.length)%bs.length;userSelected=true;point(bs[i]);bs[i].focus();}},true);
 $('titleCredits').addEventListener('click',()=>credits.showModal());
 $('creditsClose').addEventListener('click',()=>credits.close());
 credits.addEventListener('close',()=>{$('titleCredits').focus({preventScroll:true});});
 credits.addEventListener('click',e=>{if(e.target===credits){const r=credits.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)credits.close();}});
 refresh();
})();
