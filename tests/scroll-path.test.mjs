import test from 'node:test';
import assert from 'node:assert/strict';
import {samplePath} from '../dist/scroll-path.js';
const path=[{at:0,x:.5,size:400,turn:0},{at:500,x:.9,size:100,turn:4},{at:1000,x:.8,size:300,turn:8}];
test('scroll path clamps overscroll and preserves endpoints',()=>{assert.deepEqual(samplePath(path,-100),path[0]);assert.deepEqual(samplePath(path,1300),path[2]);assert.deepEqual(samplePath(path,500),path[1]);});
test('scrolling backward returns the same scene without accumulated rotation',()=>{const forward=samplePath(path,250);samplePath(path,900);assert.deepEqual(samplePath(path,250),forward);assert.equal(forward.size,250);assert.equal(forward.turn,2);});
test('interpolation stays finite and inside each segment for varied scroll positions',()=>{for(let at=0;at<=1000;at+=7){const s=samplePath(path,at);assert.ok(Object.values(s).every(Number.isFinite));assert.ok(s.size>=100&&s.size<=400);assert.ok(s.x>=.5&&s.x<=.9);}});
test('single-point and repeated anchors never divide by zero',()=>{assert.equal(samplePath([path[0]],400).size,400);assert.ok(Number.isFinite(samplePath([{at:0,x:0},{at:0,x:1},{at:20,x:2}],10).x));assert.throws(()=>samplePath([],0));});
