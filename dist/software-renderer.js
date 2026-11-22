import {Vector3,Matrix3} from './vendor/three.module.min.js';
// A small painter's-algorithm renderer preserves the interactive sculpture on
// browsers with no WebGL. The same geometry, transforms and controls are reused.
export class SoftwareRenderer{
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.ratio=1;this.width=1;this.height=1;this.last=0;this.shadow=true;}
 setPixelRatio(ratio){this.ratio=Math.min(ratio,1.25);}
 setClearColor(){}
 setSize(w,h){this.width=w;this.height=h;this.canvas.width=Math.round(w*this.ratio);this.canvas.height=Math.round(h*this.ratio);this.canvas.style.width=w+'px';this.canvas.style.height=h+'px';}
 render(scene,camera){

  const ctx=this.ctx,w=this.width,h=this.height,r=this.ratio;ctx.setTransform(r,0,0,r,0,0);ctx.clearRect(0,0,w,h);
  scene.updateMatrixWorld();camera.updateMatrixWorld();const faces=[],factor=h/(2*Math.tan(camera.fov*Math.PI/360));
  const light=new Vector3(-.4,.7,1).normalize(),half=new Vector3(-.2,.35,1).normalize();
  scene.traverse(mesh=>{
   if(!mesh.isMesh||!mesh.visible)return;
   const geo=mesh.geometry,pos=geo.attributes.position,norm=geo.attributes.normal,index=geo.index?.array,normalMatrix=new Matrix3().getNormalMatrix(mesh.matrixWorld);
   const vertices=[],normals=[];for(let i=0;i<pos.count;i++){const v=new Vector3().fromBufferAttribute(pos,i).applyMatrix4(mesh.matrixWorld);const z=camera.position.z-v.z;vertices.push({x:w/2+v.x*factor/z,y:h/2-v.y*factor/z,z:v.z});normals.push(new Vector3().fromBufferAttribute(norm,i).applyMatrix3(normalMatrix).normalize());}
   const count=index?index.length:pos.count;const rgb=mesh.material.color.clone().convertLinearToSRGB();const metallic=mesh.material.metalness;
   for(let i=0;i<count;i+=3){const ia=index?index[i]:i,ib=index?index[i+1]:i+1,ic=index?index[i+2]:i+2;const a=vertices[ia],b=vertices[ib],c=vertices[ic];if((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)>=0)continue;
    const n=normals[ia].clone().add(normals[ib]).add(normals[ic]).normalize();const diffuse=.25+Math.max(0,n.dot(light))*.75;const spec=Math.pow(Math.max(0,n.dot(half)),metallic>.9?36:24)*.9;
    const shade=component=>Math.round(Math.min(255,(component*diffuse+spec)*255));
    faces.push({a,b,c,z:(a.z+b.z+c.z)/3,color:`rgb(${shade(rgb.r)},${shade(rgb.g)},${shade(rgb.b)})`});
   }
  });
  if(this.shadow){const shadow=ctx.createRadialGradient(w*.5,h*.82,2,w*.5,h*.82,w*.23);shadow.addColorStop(0,'rgba(16,32,25,.14)');shadow.addColorStop(1,'rgba(16,32,25,0)');ctx.save();ctx.translate(0,h*.68);ctx.scale(1,.18);ctx.fillStyle=shadow;ctx.fillRect(0,0,w,h);ctx.restore();}
  faces.sort((a,b)=>a.z-b.z);for(const f of faces){ctx.beginPath();ctx.moveTo(f.a.x,f.a.y);ctx.lineTo(f.b.x,f.b.y);ctx.lineTo(f.c.x,f.c.y);ctx.closePath();ctx.fillStyle=f.color;ctx.fill();ctx.strokeStyle=f.color;ctx.lineWidth=.5;ctx.stroke();}
 }
}
