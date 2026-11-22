'use strict';
(()=>{
 const q=(s)=>document.querySelector(s),qa=(s)=>[...document.querySelectorAll(s)];
 const menu=q('.menu-toggle'),nav=q('#navigation');
 function closeMenu(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu';document.body.classList.remove('menu-open');q('main').inert=false;q('footer').inert=false;}
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close':'Menu';document.body.classList.toggle('menu-open',open);q('main').inert=open;q('footer').inert=open;});
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&nav.classList.contains('is-open')){closeMenu();menu.focus();}});matchMedia('(min-width:761px)').addEventListener('change',ev=>{if(ev.matches)closeMenu();});
 const progress=q('.read-progress');let scheduled=false;function readProgress(){scheduled=false;const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';}addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(readProgress);}},{passive:true});readProgress();
 const cards=qa('[data-category]'),search=q('#project-search');let filter='all';
 function filterProjects(){const term=(search?.value||'').trim().toLowerCase();let n=0;cards.forEach(card=>{const match=(filter==='all'||filter===card.dataset.category)&&card.dataset.search.includes(term);card.hidden=!match;if(match)n++;});q('#filter-status').textContent=`${n} ${n===1?'project':'projects'}`;q('#empty-results').hidden=n>0;window.ScrollTrigger?.refresh();}
 qa('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;qa('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filterProjects();}));search?.addEventListener('input',filterProjects);q('#reset-search')?.addEventListener('click',()=>{search.value='';filter='all';qa('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.filter==='all')));filterProjects();search.focus();});
 q('[data-copy-email]')?.addEventListener('click',async ev=>{try{await navigator.clipboard.writeText(ev.currentTarget.dataset.copyEmail);q('#copy-feedback').textContent='Email copied.';}catch{q('#copy-feedback').textContent='Select the email address above to copy it.';}});
 q('#contact-form')?.addEventListener('submit',ev=>{ev.preventDefault();if(!ev.currentTarget.reportValidity())return;const email=q('[data-copy-email]').dataset.copyEmail,name=q('#contact-name').value.trim(),topic=q('#contact-topic').value,message=q('#contact-message').value.trim();if(!name||!message){q('#form-status').textContent='Please add your name and a little context.';return;}location.href=`mailto:${email}?subject=${encodeURIComponent(topic+' — '+name)}&body=${encodeURIComponent('Hi Sahil,\n\n'+message+'\n\n'+name)}`;q('#form-status').textContent='Your email draft is ready. If no app opened, use the email address above.';});
 // Keep real text in the DOM; wrappers only provide clipping masks.
 qa('.section-heading h2,.page-title,.notes-heading h2,.about-teaser h2,.values-section h2,.lab-notes h2').forEach(heading=>{
  const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word)return;if(/^\s+$/.test(word)){fragment.append(document.createTextNode(word));return;}const mask=document.createElement('span'),inner=document.createElement('span');mask.className='word-mask';inner.textContent=word;mask.append(inner);fragment.append(mask);});node.replaceWith(fragment);});
  heading.dataset.wordReveal='';
 });
 qa('[data-color-fill]').forEach(heading=>{const lines=heading.innerHTML.split(/<br\s*\/?\s*>/i);heading.innerHTML=lines.map(line=>'<span class="fill-line">'+line+'</span>').join('');});
 // One reversible animation context makes pausing reveal all content and removes scroll pinning.
 if(!window.gsap||!window.ScrollTrigger)return;const {gsap,ScrollTrigger}=window;gsap.registerPlugin(ScrollTrigger);let context=null,first=true;
 function motion(paused){context?.revert();context=null;q('.personal-journey')?.classList.remove('journey-motion');if(paused)return;
  context=gsap.context(()=>{
   if(first){if(q('.title-line'))gsap.from('.title-line',{yPercent:80,opacity:0,rotate:3,duration:1.2,stagger:.11,ease:'power4.out'});gsap.from('.hero-intro,.hero-top,.page-intro,.case-intro,.contact-page>div,.lab-heading',{y:25,opacity:0,duration:.9,delay:.15,ease:'power3.out'});first=false;}
   gsap.utils.toArray('.section-heading,.about-teaser>div,.career,.story-block,.values-grid article,.about-story').forEach(el=>gsap.from(el,{y:45,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
   qa('[data-word-reveal]').forEach(el=>gsap.from(el.querySelectorAll('.word-mask>span'),{yPercent:115,rotate:4,opacity:0,duration:.85,stagger:.055,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 91%',once:true}}));
   if(q('.outlined'))gsap.fromTo('.outlined',{'--outline-fill':'0%'},{'--outline-fill':'100%',duration:2,delay:.55,ease:'power2.inOut'});
   const fill=q('[data-color-fill]');
   if(fill){const text=gsap.timeline({scrollTrigger:{trigger:'.scroll-manifesto',start:'top 65%',end:'bottom 75%',scrub:.45}});qa('.fill-line').forEach(line=>text.fromTo(line,{'--text-fill':'0%'},{'--text-fill':'100%',duration:1,ease:'none'}));}
   const desktop=matchMedia('(min-width:900px)').matches;
   const journey=q('.personal-journey');
   if(journey&&desktop&&innerHeight>=650){
    journey.classList.add('journey-motion');
    const sequence=gsap.timeline({scrollTrigger:{trigger:journey,start:'top 100px',end:()=>'+='+Math.max(innerWidth*2,2200),pin:'.journey-pin',scrub:1,anticipatePin:1,invalidateOnRefresh:true}});
    sequence.to('.journey-track',{xPercent:-66.666667,ease:'none',duration:3},0)
     .to('.journey-progress>span',{scaleX:1,ease:'none',duration:3},0)
     .fromTo('.identity-card',{rotate:-9},{rotate:5,ease:'none',duration:1},0)
     .fromTo('.system-card',{rotate:8},{rotate:-4,ease:'none',duration:1},1)
     .fromTo('.curiosity-card',{rotate:-7},{rotate:4,ease:'none',duration:1},2);
   }
   gsap.utils.toArray('.note-card').forEach((el,i)=>gsap.from(el,{y:45,rotate:i%2?2:-2,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
   gsap.utils.toArray('.location-radar,.curiosity-ring').forEach(el=>gsap.to(el,{rotation:25,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}}));
   if(desktop&&q('.hero')){gsap.to('.hero-heading',{y:-60,opacity:.2,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});}
   if(q('.stack-story')&&desktop){const t=gsap.timeline({scrollTrigger:{trigger:'.stack-story',start:'top top',end:'+=1500',scrub:1,pin:'.stack-pin',anticipatePin:1,invalidateOnRefresh:true}});
    t.fromTo('.stack-assembly',{rotateZ:-27,rotateX:52},{rotateZ:-12,rotateX:35,duration:3},0)
     .to('.ui-plane',{z:230,y:-125,duration:2},0).to('.data-plane',{z:-230,y:125,duration:2},0)
     .fromTo('[data-stack-step="1"],[data-stack-step="2"]',{opacity:.28},{opacity:1,stagger:1,duration:.7},.5)
     .to('.ui-plane',{z:100,y:-85,duration:1},3).to('.data-plane',{z:-100,y:85,duration:1},3);
   }
   if(desktop&&q('.selected-grid')){gsap.to('.selected-grid .project-card:nth-child(2)',{y:-65,ease:'none',scrollTrigger:{trigger:'.selected-grid',start:'top bottom',end:'bottom top',scrub:1}});gsap.to('.signature-art',{rotate:7,ease:'none',scrollTrigger:{trigger:'.about-teaser',start:'top bottom',end:'bottom top',scrub:1}});}
  });ScrollTrigger.refresh();
 }
 window.portfolioMotion?.subscribe(motion);let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>motion(window.portfolioMotion?.paused),250);});document.fonts.ready.then(()=>ScrollTrigger.refresh());
})();
