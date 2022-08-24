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
    // 支持IntersectionObserver
    if (window.IntersectionObserver) {
      const obj = new IntersectionObserver(function(els) {
        els.forEach(item => {
          if (item.isIntersecting && item.target.className.indexOf(binding.value) === -1) {
            item.target.className = binding.value + ' ' + item.target.className;
            obj.unobserve(item.target); // 在加载后取消观察
          }
        });
      });
      obj.observe(el);
    } else {
      // 不支持使用getBoundingClientRect
      const { top } = el.getBoundingClientRect();
      const h = document.documentElement.clientHeight || document.body.clientHeight;
      if (top < h) {
        if (el.className.indexOf(binding.value) == -1) {
          el.className = binding.value + ' ' + el.className;
        }
        if (binding.addClass) {
          window.removeEventListener('scroll', binding.addClass);
        }
      }
      window.addEventListener('scroll', binding.addClass, true);
    }
    binding.addClass();
  },
  unbind: function(el, binding) {
    if (binding.addClass) {
      window.removeEventListener('mousewheel', binding.addClass);
    }
  }
});
