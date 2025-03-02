import createElement from "./createElement";
import Api from "./htmlApi";
import { isUndef } from "./is";
import updateChildren from "./updateChildren";

export default function patchVnode(oldVnode, newVnode) {
  if (isUndef(newVnode.children)) {
    // 1. 新的节点没有children, 用新的创建直接替换旧的
    if (newVnode.text != oldVnode.text) {
      Api.innerText(oldVnode.elm, newVnode.text);
    }
  } else {
    if (oldVnode.children == undefined) {
      // 2. 新的节点有children，旧的没有children，删除旧的，用新的创建添加
      let oldVnodeElm = oldVnode.elm;
      let newVnodeElm = createElement(newVnode);
      oldVnodeElm.parentNode.replaceChild(newVnodeElm, oldVnodeElm);
    } else {
      // 3. 新的节点有children，旧的有children
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
    }
  }
}