import h from './dom/h';
import Logger from './dom/logger';
import patch from './dom/patch';

const container = document.getElementById('container');
const btn = document.getElementById('btn');

const vnode1 = h('div', {}, '你好呀');

const vnode2 = h('div', {}, [
  h('p', { key: 'a', }, 'aaaa'),
  h('p', { key: 'b', }, 'bbbb'),
  h('p', { key: 'c', }, 'cccc'),
]);

const vnode3 = h('div', {}, [
  h('p', { key: 'c', }, 'cccc'),
  h('p', { key: 'b', }, 'bbbb'),
  h('p', { key: 'a', }, 'aaaa'),
]);

const vnode4 = h('div', {}, [
  h('p', { key: 'c', }, 'cccc4'),
  h('p', { key: 'a', }, 'aaaa4'),
  h('p', { key: 'b', }, 'bbbb4'),
]);

const vnode5 = h('div', {}, [
  h('p', { key: 'a', }, 'aaaa'),
  h('p', { key: 'b', }, 'bbbb'),
  h('p', { key: 'c', }, 'cccc'),
  h('p', { key: 'd', }, 'dddd'),
  h('p', { key: 'e', }, 'eeee'),
  h('p', { key: 'f', }, 'ffff'),
]);

const vnode6 = h('div', {}, [
  
  h('p', { key: 'b', }, 'bbbb'),h('p', { key: 'k', }, 'kkkk'),
  h('p', { key: 'a', }, 'aaaa'),
  h('p', { key: 'f', }, 'ffff'),h('p', { key: 'j', }, 'jjjj'),
  h('p', { key: 'e', }, 'eeee'),
  
  
  // h('p', { key: 'b', }, 'bbbb'),
  // h('p', { key: 'a', }, 'aaaa'),
  // h('p', { key: 'c', }, 'cccc'),
  // h('p', { key: 'd', }, 'dddd'),
  // h('p', { key: 'f', }, 'ffff'),
  // h('p', { key: 'e', }, 'eeee'),
  // h('p', { key: 'j', }, 'jjjj'),
  // h('p', { key: 'k', }, 'kkkk'),
]);

// Logger('vnode1', vnode1);

// Logger('vnode2', vnode2);

// patch(container, vnode2);

patch(container, vnode5);

btn.onclick = function() {
  // patch(vnode2, vnode3);
  // patch(vnode2, vnode4);
  patch(vnode5, vnode6);
}