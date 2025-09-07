/**
 * 点击元素外部指令
 * 用于检测点击组件外部的事件
 */
export function clickOutside(node: HTMLElement, handler: () => void) {
  const handleClick = (event: MouseEvent) => {
    // 如果点击的不是当前节点或其子节点，则触发回调
    if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
      handler();
    }
  };

  // 添加事件监听
  document.addEventListener('click', handleClick, true);
  
  return {
    // 当组件卸载时移除事件监听
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
    // 当处理函数更新时更新事件监听
    update(newHandler: () => void) {
      handler = newHandler;
    }
  };
}