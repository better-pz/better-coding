import Vue from 'vue';

Vue.directive('clickOutside', {
  // 初始化指令
  bind(el, binding) {
    function clickHandler(e) {
      // 判断点击的元素是否是本身,是本身则返回
      //  Node.contains()返回的是一个布尔值，来表示传入的节点是否为该节点的后代节点。
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        binding && binding.value(e);
      }
      // 给当前元素绑定个私有变量,方便在unbind中可以解除事件监听
      el.__vueClickOutside__ = clickHandler;
      document.addEventListener('click', clickHandler);
    }
  },
  update() {},
  unbind(el) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside___);
    delete el.__vueClickOutside__;
  }
});

Vue.directive('animate', {
  inserted: function(el, binding) {
    // 聚焦元素
    binding.addClass = () => {};
  }
});
