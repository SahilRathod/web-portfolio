const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../dist/motion.js'),'utf8');
function harness({reduced=false,saved=false,blocked=false}={}) {
  const events={},attrs={},classes=new Set(),label={textContent:''}; let stored=String(saved);
  const media={matches:reduced,addEventListener:(_,fn)=>events.media=fn};
  const button={setAttribute:(key,value)=>attrs[key]=value,querySelector:()=>label,addEventListener:(_,fn)=>events.click=fn};
  const document={hidden:false,documentElement:{classList:{toggle:(key,on)=>on?classes.add(key):classes.delete(key)}},querySelectorAll:()=>[button],addEventListener:(key,fn)=>events[key]=fn};
  const context={document,matchMedia:()=>media,localStorage:{getItem:()=>{if(blocked)throw Error();return stored;},setItem:(_,v)=>{if(blocked)throw Error();stored=v;}}};
  context.window=context; vm.runInNewContext(source,context);
  return {events,attrs,classes,label,media,button,document,api:context.portfolioMotion,stored:()=>stored};
}
test('manual pause persists and applies on the next page',()=>{const h=harness();h.events.click();assert.equal(h.api.paused,true);assert.equal(h.stored(),'true');assert.equal(harness({saved:true}).label.textContent,'Motion off');});
test('system preference takes priority and preserves manual pause',()=>{const h=harness({saved:true,reduced:true});assert.equal(h.button.disabled,true);h.media.matches=false;h.events.media();assert.equal(h.api.paused,true);assert.equal(h.button.disabled,false);});
test('blocked storage still allows animation pause',()=>{const h=harness({blocked:true});h.events.click();assert.equal(h.api.paused,true);});
test('motion subscribers get updates and can unsubscribe',()=>{const h=harness(),values=[];const off=h.api.subscribe(v=>values.push(v));h.events.click();off();h.events.click();assert.deepEqual(values,[false,true]);});
test('background page pauses CSS timelines',()=>{const h=harness();h.document.hidden=true;h.events.visibilitychange();assert.ok(h.classes.has('is-hidden'));});
