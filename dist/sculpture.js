import * as THREE from './vendor/three.module.min.js';
import {SoftwareRenderer} from './software-renderer.js';
import {createScrollScene} from './scroll-scene.js';
// The sculpture is procedural: no model download, texture CDN or tracking request.
const host=document.querySelector('[data-sculpture]');
if(host){
 const canvas=host.querySelector('canvas'),status=host.querySelector('[data-render-status]');
 let renderer,software=false;
 try{const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});if(!context)throw new Error('WebGL unavailable');renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:true,powerPreference:'low-power'});}catch{software=true;renderer=new SoftwareRenderer(canvas);}
 if(renderer) start();
 function start(){
  const lab=document.body.dataset.page==='lab.html';if(software)renderer.shadow=lab;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,80);camera.position.set(0,0,11.6);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.55;
  if(!software){const studio=document.createElement('canvas');studio.width=1024;studio.height=512;const ctx=studio.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,0,512);grad.addColorStop(0,'#e8eefb');grad.addColorStop(.38,'#596579');grad.addColorStop(.52,'#111a28');grad.addColorStop(.7,'#98a9bf');grad.addColorStop(1,'#101722');ctx.fillStyle=grad;ctx.fillRect(0,0,1024,512);ctx.fillStyle='#ffffff';ctx.fillRect(120,60,95,310);ctx.fillRect(680,20,220,200);ctx.fillStyle='#d1e0ff';ctx.fillRect(420,180,40,290);
  const env=new THREE.CanvasTexture(studio);env.mapping=THREE.EquirectangularReflectionMapping;env.colorSpace=THREE.SRGBColorSpace;const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromEquirectangular(env).texture;env.dispose();pmrem.dispose();}
  scene.add(new THREE.HemisphereLight(0xeef4ff,0x33442c,2.2));const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(4,6,5);scene.add(key);const rim=new THREE.DirectionalLight(0xb8ceff,3);rim.position.set(-5,1,-2);scene.add(rim);
  const group=new THREE.Group();scene.add(group);group.rotation.set(.12,-.28,-.16);
  const cobalt=new THREE.MeshStandardMaterial({color:0x74512d,metalness:.72,roughness:.19,envMapIntensity:1.1});
  const chrome=new THREE.MeshStandardMaterial({color:0xaf8f6f,metalness:1,roughness:.12,envMapIntensity:1.3});
  const lime=new THREE.MeshStandardMaterial({color:0xf8f4e1,metalness:.34,roughness:.28});
  let core=new THREE.Mesh(new THREE.TorusKnotGeometry(1.08,.34,software?120:144,software?18:24,2,3),cobalt);group.add(core);
  const ringA=new THREE.Mesh(new THREE.TorusGeometry(1.92,.075,software?8:16,software?72:144),chrome);ringA.rotation.set(.9,.3,.1);group.add(ringA);
  const ringB=new THREE.Mesh(new THREE.TorusGeometry(2.12,.055,software?8:16,software?72:144),lime);ringB.rotation.set(-.7,.45,-.5);group.add(ringB);
  const orbit=new THREE.Group();group.add(orbit);
  const satellites=[];for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(i===0?.23:.1,2),i%2?chrome:lime);mesh.position.set(Math.cos(a)*2.1,Math.sin(a)*1.8,Math.sin(a*2)*.6);orbit.add(mesh);satellites.push(mesh);}
  const ray=new THREE.Mesh(new THREE.TorusGeometry(2.45,.008,6,144),chrome);ray.rotation.x=.4;ray.material=chrome;group.add(ray);
  let lastDraw=0,frame=0,paused=window.portfolioMotion?.paused??matchMedia('(prefers-reduced-motion: reduce)').matches,visible=true,contextLost=false,last=0,time=0,speed=.4,separation=.35,targetX=0,targetY=0,dragging=false,downX=0,downY=0,rotationX=0,rotationY=0;
  const scrollScene=lab?null:createScrollScene(host,group,camera,ringA,ringB,orbit,core);
  const draw=()=>renderer.render(scene,camera);
  function resize(){const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();if(!scrollScene)group.scale.setScalar(camera.aspect<.8?.85:1);scrollScene?.resize();scrollScene?.update(0,paused);draw();}
  function tick(now){frame=0;if(paused||!visible||document.hidden||contextLost)return;const dt=Math.min((now-last)/1000,.04)||.016;last=now;time+=dt;
   core.rotation.y+=dt*.25*speed;core.rotation.x+=dt*.1*speed;
   ringA.rotation.z=time*.13*speed;ringB.rotation.y=.45+time*.18*speed;orbit.rotation.z=-time*.12*speed;ray.rotation.z=time*.08*speed;
   group.rotation.y+=(targetX*.28+rotationY-.28-group.rotation.y)*.045;group.rotation.x+=(targetY*.2+rotationX+.12-group.rotation.x)*.045;group.position.y=Math.sin(time*.65)*.075;
   const scale=1+separation*.23;ringA.scale.setScalar(scale);ringB.scale.setScalar(scale);orbit.scale.setScalar(1+separation*.3);scrollScene?.update(dt,false);if(!software||now-lastDraw>32){draw();lastDraw=now;}frame=requestAnimationFrame(tick);
  }
  function sync(){if(frame)cancelAnimationFrame(frame);frame=0;if(!paused&&visible&&!document.hidden&&!contextLost){last=performance.now();frame=requestAnimationFrame(tick);}else if(!contextLost)draw();}
  canvas.addEventListener('pointerdown',ev=>{if(!lab||paused)return;dragging=true;downX=ev.clientX;downY=ev.clientY;canvas.setPointerCapture(ev.pointerId);});
  canvas.addEventListener('pointermove',ev=>{if(paused)return;const rect=canvas.getBoundingClientRect();targetX=(ev.clientX-rect.left)/rect.width-.5;targetY=(ev.clientY-rect.top)/rect.height-.5;if(dragging){rotationY+=(ev.clientX-downX)*.006;rotationX+=(ev.clientY-downY)*.006;downX=ev.clientX;downY=ev.clientY;}});
  const endDrag=()=>{dragging=false;};canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('pointerleave',()=>{targetX=targetY=0;});
  function shape(mode){core.geometry.dispose();core.geometry=mode==='orbit'?new THREE.TorusGeometry(1.15,.38,software?12:32,software?84:128):mode==='core'?new THREE.IcosahedronGeometry(1.5,1):new THREE.TorusKnotGeometry(1.08,.34,software?120:144,software?18:24,2,3);core.rotation.set(0,0,0);draw();}
  if(lab){const shapeInput=document.querySelector('#shape-mode'),depth=document.querySelector('#depth-range'),velocity=document.querySelector('#speed-range'),material=document.querySelector('#color-mode');
   const update=()=>{separation=Number(depth.value)/100;speed=Number(velocity.value)/100;document.querySelector('#depth-value').textContent=depth.value+'%';document.querySelector('#speed-value').textContent=velocity.value+'%';ringA.scale.setScalar(1+separation*.23);ringB.scale.setScalar(1+separation*.23);orbit.scale.setScalar(1+separation*.3);draw();};
   shapeInput.addEventListener('change',()=>shape(shapeInput.value));depth.addEventListener('input',update);velocity.addEventListener('input',update);material.addEventListener('change',()=>{cobalt.color.set(material.value==='lime'?0xf8f4e1:material.value==='silver'?0xaf8f6f:0x74512d);draw();});
   document.querySelector('#reset-lab').addEventListener('click',()=>{shapeInput.value='knot';depth.value='35';velocity.value='40';material.value='cobalt';rotationX=rotationY=targetX=targetY=0;cobalt.color.set(0x74512d);shape('knot');update();document.querySelector('#lab-status').textContent='Sculpture reset to bronze knot, 35% separation and 40% speed.';});
  }
  new ResizeObserver(resize).observe(host);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{rootMargin:'100px'}).observe(host);
  window.portfolioMotion?.subscribe(value=>{paused=value;scrollScene?.setPaused(value);resize();sync();});document.addEventListener('visibilitychange',sync);
  canvas.addEventListener('webglcontextlost',ev=>{ev.preventDefault();contextLost=true;host.classList.remove('is-rendered');sync();status.textContent='Sculpture preview · graphics context paused';});
  canvas.addEventListener('webglcontextrestored',()=>{contextLost=false;host.classList.add('is-rendered');sync();});
  resize();host.classList.add('is-rendered');host.dataset.renderer=software?'software':'webgl';status.textContent=lab?'LIVE 3D / DRAG TO ROTATE':'SCROLL TO CHANGE PERSPECTIVE';sync();
 }
}
