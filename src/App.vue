<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { url } from 'inspector';
import { none } from 'ol/centerconstraint';

export default {
  name: 'App',
  data() {
    return {};
  },
  methods: {
    watermark({
      container = document.body,
      width = `240px`,
      height = '160px',
      textAlign = 'center',
      textBaseline = 'middle',
      font = '14px microsoft yahei',
      fillStyle = 'rgba(255,255,255,0.008)',
      content = 'shuiyin',
      rotate = '25',
      zIndex = 10000
    }) {
      const args = arguments[0];
      // 测试ggit提交
      const canvas = document.createElement('canvas');
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      const ctx = canvas.getContext('2d');
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;
      ctx.font = font;
      ctx.fillStyle = fillStyle;
      ctx.rotate((Math.PI / 180) * rotate);
      ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

      const base64Url = canvas.toDataURL();
      const __wm = document.querySelector('.__wm');
      const watermarkDiv = __wm || document.createElement('div');
      const style = `position:fixed;top:0;left:0;width:100%;height:100%;z-index:${zIndex};pointer-event:none;background-repeat:repeat;background-image:url(${base64Url})`;
      watermarkDiv.setAttribute('style', style);
      watermarkDiv.classList.add('__wm');
      if (!__wm) container.insertBefore(watermarkDiv, container.firstChild);
      const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
      if (MutationObserver) {
        let observe = new MutationObserver(() => {
          const __wm = document.querySelector('.__wm');
          if (!__wm || (__wm && __wm.getAttribute('style') != style)) {
            observe.disconnect();
            observe = null;
            this.watermark(args);
          }
        });

        observe.observe(container, {
          attributes: true,
          subtree: true,
          childList: true
        });
      }
    }
  }
};
</script>
