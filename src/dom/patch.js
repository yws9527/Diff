import createElement from "./createElement";
import vnode from "./vnode";
import Logger from './logger';
import patchVnode from "./patchVnode";
import { isUndef } from "./is";

export default function(oldVnode, newVnode) {
  if (isUndef(oldVnode?.sel)) {
    oldVnode = vnode(
      oldVnode.tagName.toLowerCase(),
      {},
      undefined,
      oldVnode.innerText,
      oldVnode,
    );
  }

  if (oldVnode.sel === newVnode.sel) { // 标签相同
    patchVnode(oldVnode, newVnode);
  } else { // 标签不同
    let oldVnodeElm = oldVnode.elm;
    let newVnodeElm = createElement(newVnode);
    oldVnodeElm.parentNode.replaceChild(newVnodeElm, oldVnodeElm);
    Logger('newVnodeElm', newVnodeElm);
  }
}