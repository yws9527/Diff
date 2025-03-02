import { isUndef } from "./is";

export default function createElement(vnode) {
  const nodeElm = document.createElement(vnode.sel);

  if (isUndef(vnode.children)) {
    nodeElm.innerText = vnode.text;
  } else if (Array.isArray(vnode.children)) {
    for (const child of vnode.children) {
      const childElm  = createElement(child);
      nodeElm.appendChild(childElm);
    }
  }

  vnode.elm = nodeElm;
  return nodeElm;
}