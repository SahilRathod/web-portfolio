'use strict';

// Original parametric globe. One frame loop, bounded resolution, no libraries.
(() => {
  const canvas = document.querySelector('#atlas-canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('#motion-toggle');
  let paused = reducedMotion.matches;
  let visible = true;
  let mode = 'orbit';
  let angle = .35;
  let frame = 0;
  let lastTime = 0;
  let width = 620;
  let pointerX = 0;
  let pointerY = 0;

  function project(x, y, z) {
    const turn = angle + pointerX * .1;
    const rx = x * Math.cos(turn) + z * Math.sin(turn);
    const rz = -x * Math.sin(turn) + z * Math.cos(turn);
    const tilt = -.37 + pointerY * .08;
    const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
    const depth = y * Math.sin(tilt) + rz * Math.cos(tilt);
    const rotation = -.28;
    const scale = width * .338;
    return { x: width / 2 + (rx * Math.cos(rotation) - ry * Math.sin(rotation)) * scale,
      y: width / 2 + (rx * Math.sin(rotation) + ry * Math.cos(rotation)) * scale, z: depth };
  }
  function line(points, color, thickness = .7) {
    context.beginPath();
    points.forEach((p, i) => i ? context.lineTo(p.x, p.y) : context.moveTo(p.x, p.y));
    context.strokeStyle = color; context.lineWidth = thickness; context.stroke();
  }
  function draw() {
    context.clearRect(0, 0, width, width);
    // Thin construction guides give the globe its drawn, engineering quality.
    context.strokeStyle = '#a6ada52e'; context.lineWidth = .65;
    context.beginPath(); context.arc(width/2,width/2,width*.407,0,Math.PI*2); context.stroke();
    context.setLineDash([2,6]);
    context.beginPath(); context.moveTo(width*.05,width/2);context.lineTo(width*.95,width/2);context.moveTo(width/2,width*.06);context.lineTo(width/2,width*.94);context.stroke();context.setLineDash([]);
    for (let latitude = -8; latitude <= 8; latitude++) {
      const phi = latitude / 9 * Math.PI / 2;
      const points = [];
      for (let step = 0; step <= 120; step++) {
        const theta = step / 120 * Math.PI * 2;
        const wave = mode === 'signal' ? 1 + .045 * Math.sin(theta*8 + phi*5 + angle*4) : 1;
        points.push(project(Math.cos(phi)*Math.cos(theta)*wave, Math.sin(phi),Math.cos(phi)*Math.sin(theta)*wave));
      }
      line(points, latitude > -2 && latitude < 2 ? '#234be8' : '#234be84a', latitude > -2 && latitude < 2 ? 1.3 : .7);
    }
    for(let meridian=0;meridian<24;meridian++){
      const theta=meridian/24*Math.PI*2;const points=[];
      for(let step=0;step<=70;step++){
        const phi=-Math.PI/2+step/70*Math.PI;
        points.push(project(Math.cos(phi)*Math.cos(theta),Math.sin(phi),Math.cos(phi)*Math.sin(theta)));
      }
      line(points,'#234be85a',.7);
    }
    // A denser band gives this atlas its signature off-axis silhouette.
    for(let band=0;band<9;band++){
      const points=[];
      for(let step=0;step<=160;step++){
        const theta=step/160*Math.PI*2;
        const r=1.05+band*.013;
        const p=project(Math.cos(theta)*r,Math.sin(theta)*.31,Math.sin(theta)*r);
        points.push(p);
      }
      line(points,'#234be8',.85);
    }
    for(let n=0;n<14;n++){
      const theta=n*2.39996;const y=1-2*(n+.5)/14;const r=Math.sqrt(1-y*y);
      const p=project(r*Math.cos(theta),y,r*Math.sin(theta));
      if(p.z>-.1){context.beginPath();context.arc(p.x,p.y,2.5,0,Math.PI*2);context.fillStyle='#234be8';context.fill();}
    }
  }
  function shouldRun(){return !paused && !reducedMotion.matches && visible && !document.hidden;}
  function tick(time){
    frame=0;
    if(!shouldRun())return;
    if(lastTime)angle+=Math.min(time-lastTime,50)*.0001;
    lastTime=time;draw();frame=requestAnimationFrame(tick);
  }
  function schedule(){
    cancelAnimationFrame(frame);frame=0;lastTime=0;draw();
    if(shouldRun())frame=requestAnimationFrame(tick);
  }
  function updateControl(){
    const stopped=paused||reducedMotion.matches;
    toggle.setAttribute('aria-pressed',String(stopped));
    toggle.setAttribute('aria-label',reducedMotion.matches?'Animation disabled by reduced motion preference':stopped?'Play animation':'Pause animation');
    toggle.innerHTML=`<span aria-hidden="true">${stopped?'▶':'II'}</span>`;
    toggle.disabled=reducedMotion.matches;
    document.documentElement.classList.toggle('motion-paused',stopped);
  }
  toggle.addEventListener('click',()=>{paused=!paused;updateControl();schedule();});
  reducedMotion.addEventListener('change',()=>{paused=reducedMotion.matches;updateControl();schedule();});
  document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{
    mode=button.dataset.mode;
    document.querySelectorAll('[data-mode]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    draw();
  }));
  canvas.addEventListener('pointermove',event=>{
    if(paused||reducedMotion.matches)return;
    const bounds=canvas.getBoundingClientRect();pointerX=(event.clientX-bounds.left)/bounds.width-.5;pointerY=(event.clientY-bounds.top)/bounds.height-.5;
  });
  canvas.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
  function resize(){
    width=canvas.getBoundingClientRect().width;
    if(!width)return;
    const ratio=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(width*ratio);
    context.setTransform(ratio,0,0,ratio,0,0);draw();
  }
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas);else window.addEventListener('resize',resize);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:0}).observe(canvas);
  document.addEventListener('visibilitychange',schedule);
  resize();updateControl();schedule();
})();
