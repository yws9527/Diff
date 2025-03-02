import { isDef, isSameVnode, isUndef } from "./is";
import Logger from "./logger";
import Api from './htmlApi';
import patchVnode from "./patchVnode";
import createElement from "./createElement";

export default function (parentElm, oldCh, newCh) {
  let oldStartIdx = 0;
  let oldStartVnode = oldCh[0];
  let oldEndIdx = oldCh.length - 1;
  let oldEndVnode = oldCh[oldEndIdx];

  let newStartIdx = 0;
  let newStartVnode = newCh[0];
  let newEndIdx = newCh.length - 1;
  let newEndVnode = newCh[newEndIdx];

  const keys = [];
  const oldKeyMap = {};
  const newKeyMap = {};
  const delKeyVnodeMap = {};
  const addKeyVnodeMap = {};

  for (let o = 0; o < oldCh.length; o++) {
    let oldKey = oldCh[o]?.key;
    if (isDef(oldKey)) oldKeyMap[oldKey] = o;
  }

  for (let n = 0; n < newCh.length; n++) {
    let newKey = newCh[n]?.key;
    keys.push(newKey);
    if (isDef(newKey)) newKeyMap[newKey] = n;
  }

  // 待删除
  for (const oKey of Object.keys(oldKeyMap)) {
    if (isUndef(newKeyMap[oKey])) delKeyVnodeMap[oKey] = oldCh[oldKeyMap[oKey]];
  }

  // 待新增
  for (const nKey of Object.keys(newKeyMap)) {
    if (isUndef(oldKeyMap[nKey])) addKeyVnodeMap[nKey] = newCh[newKeyMap[nKey]];
  }


  // 总是会因为children中vnode个数少的一方而提前结束while循环
  // 导致新增或者删除无法操作，所以需要循环外单独处理
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 旧前 新前
      Logger('旧前 新前', 1);
      patchVnode(oldStartVnode, newStartVnode);
      if (newStartVnode) newStartVnode.elm = oldStartVnode?.elm;
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 旧后 新后
      Logger('旧后 新后', 2);
      patchVnode(oldEndVnode, newEndVnode);
      if (newEndVnode) newEndVnode.elm = oldEndVnode?.elm;
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 旧前 新后 ===> 说明新节点向右移动了
      Logger('旧前 新后', 3);
      patchVnode(oldStartVnode, newEndVnode);
      if (newEndVnode) newEndVnode.elm = oldStartVnode?.elm;
      // 把旧前指定的节点移动到旧后节点之后，满足这个节点在新后的位置
      Api.insertBefore(parentElm, oldStartVnode.elm, oldEndVnode.elm.nextSibling);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 旧后 新前 ===> 说明新节点向左移动了
      Logger('旧后 新前', 4);
      patchVnode(oldEndVnode, newStartVnode);
      if (newStartVnode) newStartVnode.elm = oldEndVnode?.elm;
      // 把旧后指定的节点移动到旧前节点之前，满足这个节点在新前的位置
      Api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      Logger('以上情况都不满足', 5);
      // 以上情况都不满足，就拿新前在旧节点中进行查找
      // 如果找到：就将该旧节点设置为undefined，同时新前++
      // 如果没找到：说明新前是新增的，那么就创建添加
      let newVnodeInOldIdx = undefined;
      let newStartVnodeKey = newStartVnode?.key;

      if (isDef(oldKeyMap[newStartVnodeKey])) {
        // 找到了 ===> 值修改并交换位置
        newVnodeInOldIdx = oldKeyMap[newStartVnodeKey];
        const moveVnode = oldCh[newVnodeInOldIdx];
        patchVnode(moveVnode, newStartVnode);
        oldCh[newVnodeInOldIdx] = undefined;
        Api.insertBefore(parentElm, moveVnode.elm, oldStartVnode.elm);
      } else {
        // 没找到 ===> 新增
        // const addVnodeElm = createElement(newStartVnode);
        // Api.insertBefore(parentElm, addVnodeElm, oldStartVnode.elm);
      }

      newStartVnode = newCh[++newStartIdx];
    }
  }

  console.group({ oldCh, newCh });
  // 处理新节点中children新增或者删除的情况
  const addKeys = Object.keys(addKeyVnodeMap);
  const delKeys = Object.keys(delKeyVnodeMap);

  // 删除的操作
  if (delKeys.length) {
    for(const _key of delKeys) {
      const oldIdx = oldKeyMap[_key];
      const delVnode = oldCh[oldIdx];
      Api.removeChild(parentElm, delVnode.elm);
      oldCh[oldIdx] = undefined;
    }
  }

  // 新增的操作
  if (addKeys.length) {
    let count = addKeys.length;
    
    while ( count-- ) {
      const _key = addKeys[count];
      const newLastIdx = newKeyMap[_key];
      const newNextIdx = newLastIdx + 1;
      const newLastVnode = newCh[newLastIdx];
      const newNextVnode = newCh[newNextIdx];

      if (newNextVnode) {
        const oldNextVnode = oldCh[oldKeyMap[newNextVnode.key]];
        if (oldNextVnode) {
          // 找到说明oldCh中原来就有
          Api.appendChild(parentElm, createElement(newLastVnode));
          Api.moveBefore(parentElm, newLastVnode.elm, oldNextVnode.elm);
        } else if (oldKeyMap[newNextVnode.key] && newKeyMap[newNextVnode.key]) {
          // 没找到[diff比较过程中被undefined]，但新旧都存在
          const oldNextVnodeElm = parentElm.childNodes[oldKeyMap[newNextVnode.key] - 1];
          Api.appendChild(parentElm, createElement(newLastVnode));
          Api.moveBefore(parentElm, newLastVnode.elm, oldNextVnodeElm);
        } else {
          // 找不到说明是从newCh中新增的，因为上次新增的已经被插入父节点，可以直接使用
          Api.appendChild(parentElm, createElement(newLastVnode));
          Api.moveBefore(parentElm, newLastVnode.elm, newNextVnode.elm);
        }
      } else {
        Api.appendChild(parentElm, createElement(newLastVnode));
      }
    }
  }
  // 对照日志输出
  Logger('结果应为：===> ' + keys + '');
}