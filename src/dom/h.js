import vnode from './vnode';

export default function(sel, data, params) {
  if (typeof params == 'string') {
    return vnode(sel, data, undefined, params, undefined );
  } else if (Array.isArray(params)) {
    let children = [];
    params.forEach((item) => children.push(item));
    return vnode(sel, data, children, undefined, undefined);
  }
}