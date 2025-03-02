export default {
  parentNode(node) {
    return node?.parentNode;
  },

  removeChild(parentNode, node) {
    parentNode.removeChild(node);
  },
  
  innerText(node, text) {
    node.innerText = text;
  },

  // node1 插入的节点
  // node2 原位置的节点
  // 将node1插入到node2之前
  insertBefore(parentNode, node1, node2) {
    parentNode.insertBefore(node1, node2);
  },

  // node1 要移动的节点
  // node2 原位置的节点
  // 将node1移动到node2之前
  moveBefore(parentNode, node1, node2) {
    parentNode.moveBefore(node1, node2);
  },

  appendChild(parentNode, node) {
    parentNode.appendChild(node);
  }

}