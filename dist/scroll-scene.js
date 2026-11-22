import {samplePath} from './scroll-path.js';

// One continuous scene, from first viewport to the footer. No wheel hijacking.
export function createScrollScene(host, group, camera, ringA, ringB, orbit, core) {
  const placeholder = document.createElement('div');
  placeholder.className = 'sculpture-host sculpture-placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  host.before(placeholder);
  document.body.append(host);
  host.classList.add('home-scroll-scene');
  host.setAttribute('aria-hidden', 'true');
  let points = [], paused = false, current = scrollY, refreshFrame = 0, chapters = [];
  const top = selector => {
    const element = document.querySelector(selector);
    return element ? element.getBoundingClientRect().top + scrollY : 0;
  };
  function resize() {
    const mobile = innerWidth < 900, h = innerHeight;
    const rect = placeholder.getBoundingClientRect();
    const hero = {x:(rect.left + rect.width / 2) / innerWidth, y:(rect.top + scrollY + rect.height * .46) / h, size:Math.min(rect.width * .79, rect.height * .85, 610), turn:0, spread:.2};
    const small = mobile ? 78 : 135;
    const edge = mobile ? .88 : .94;
    const key = (at, x, y, size, turn, spread) => ({at:Math.max(0,at), x,y,size,turn,spread});
    points = [
      {...hero, at:0},
      key(Math.max(200,top('.personal-journey')-h*.5),edge,.78,small,2,.4),
      key(top('.scroll-manifesto')-h*.75,edge,.7,small,5,.3),
      key(top('.scroll-manifesto')-h*.1,mobile?.76:.79,mobile?.8:.54,mobile?170:Math.min(innerWidth*.34,490),7,1.1),
      key(top('#selected-work')-h*.5,edge,.82,small,9,.3),
      key(top('.stack-story')-h*.2,edge,.8,small,12,1.2),
      key(top('.about-teaser')-h*.5,edge,.75,small,15,.5),
      key(top('.contact-cta')-h*.35,mobile?.88:.82,mobile?.78:.42,mobile?90:280,17,.2),
      key(Math.max(1,document.documentElement.scrollHeight-h),edge,.65,small,19,.1)
    ].sort((a,b)=>a.at-b.at);
    chapters = [top('.personal-journey'),top('#selected-work'),top('.contact-cta')];
    current = scrollY;
  }
  function update(dt, freeze) {
    if (!points.length) return;
    current = dt ? current + (scrollY-current)*(1-Math.exp(-dt*10)) : scrollY;
    const state = samplePath(points, freeze ? 0 : current);
    const viewHeight = 2*Math.tan(camera.fov*Math.PI/360)*camera.position.z;
    group.position.set((state.x-.5)*viewHeight*camera.aspect,(.5-state.y)*viewHeight,0);
    group.scale.setScalar(state.size/innerHeight*viewHeight/5.4);
    group.rotation.set(.12+state.turn*.21,-.28+state.turn*.7,-.16+state.turn*.18);
    core.rotation.z=state.turn*.25;
    ringA.position.z=state.spread*.42;
    ringB.position.z=-state.spread*.42;
    ringA.scale.setScalar(1+state.spread*.25);
    ringB.scale.setScalar(1+state.spread*.38);
    orbit.scale.setScalar(1+state.spread*.44);
    host.dataset.sceneChapter = current < chapters[0] ? 'intro' : current < chapters[1] ? 'perspective' : current < chapters[2] ? 'layers' : 'connected';
  }
  function setPaused(value) {
    paused=value;
    // Restore the original in-flow hero when reduced motion is requested.
    host.classList.toggle('scene-static',value);
    if(value) placeholder.append(host); else document.body.append(host);
    resize();
  }
  function refresh() {
    cancelAnimationFrame(refreshFrame);
    refreshFrame=requestAnimationFrame(resize);
  }
  window.ScrollTrigger?.addEventListener('refresh',refresh);
  new ResizeObserver(refresh).observe(document.querySelector('main'));
  document.fonts.ready.then(refresh);
  addEventListener('pageshow',refresh);
  resize();
  return {resize, update(dt,freeze){if(paused){group.position.set(0,0,0);group.scale.setScalar(camera.aspect<.8?.85:1);group.rotation.set(.12,-.28,-.16);ringA.position.z=ringB.position.z=0;return;}update(dt,freeze);},setPaused};
}
