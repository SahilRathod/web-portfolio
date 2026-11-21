import test from 'node:test';
import assert from 'node:assert/strict';
import {Scene,PerspectiveCamera,Mesh,BoxGeometry,MeshStandardMaterial} from '../dist/vendor/three.module.min.js';
import {SoftwareRenderer} from '../dist/software-renderer.js';
function fixture(){
 const paints=[];const ctx={setTransform(){},clearRect(){},createRadialGradient(){return {addColorStop(){}};},save(){},translate(){},scale(){},fillRect(){},restore(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){paints.push(this.fillStyle);},stroke(){}};
 const canvas={style:{},getContext:()=>ctx},renderer=new SoftwareRenderer(canvas);renderer.setPixelRatio(3);renderer.setSize(400,400);
 const scene=new Scene(),camera=new PerspectiveCamera(34,1,.1,80);camera.position.z=8;
 const mesh=new Mesh(new BoxGeometry(2,2,2),new MeshStandardMaterial({color:0x173bff}));scene.add(mesh);
 return {paints,canvas,renderer,scene,camera,mesh};
}
test('software renderer caps resolution and draws visible faces',()=>{const f=fixture();f.renderer.render(f.scene,f.camera);assert.equal(f.canvas.width,500);assert.ok(f.paints.length>0);assert.ok(f.paints.every(c=>/^rgb\(/.test(c)));});
test('consecutive manual changes render immediately while animation is paused',()=>{const f=fixture();f.renderer.render(f.scene,f.camera);const before=f.paints.at(-1);f.mesh.material.color.set(0xc9ff49);f.renderer.render(f.scene,f.camera);assert.notEqual(f.paints.at(-1),before);});
test('hidden geometry does not paint',()=>{const f=fixture();f.mesh.visible=false;f.renderer.render(f.scene,f.camera);assert.equal(f.paints.length,0);});
