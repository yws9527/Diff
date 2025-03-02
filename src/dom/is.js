export function isSameVnode(oldVnode, newVnode) {
  return oldVnode.key === newVnode.key; 
}

export function isUndef(s) {
  return s === undefined;
}

export function isDef(s) {
  return s !== undefined;
}