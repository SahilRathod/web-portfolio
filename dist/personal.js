'use strict';
// Pointer highlights are an enhancement: no ongoing frame loop, and no hover
// dependency for touch, keyboard or readers who prefer reduced motion.
(()=>{
 const media=matchMedia('(hover:hover) and (pointer:fine)');
 document.querySelectorAll('[data-glass]').forEach(card=>{
  let frame=0,lastX=0,lastY=0;
  card.addEventListener('pointermove',event=>{
   if(!media.matches||window.portfolioMotion?.paused)return;
   lastX=event.clientX;lastY=event.clientY;if(frame)return;
   frame=requestAnimationFrame(()=>{frame=0;const r=card.getBoundingClientRect();card.style.setProperty('--glass-x',`${lastX-r.left}px`);card.style.setProperty('--glass-y',`${lastY-r.top}px`);});
  },{passive:true});
  card.addEventListener('pointerleave',()=>{if(frame)cancelAnimationFrame(frame);frame=0;card.style.removeProperty('--glass-x');card.style.removeProperty('--glass-y');});
 });
})();
