<template>
  <div class="revolve">
    <div class="circle"></div>
    <div>
      <div :style="item.style" class="title" v-for="item in nodes" :key="item.id" @click="handleRevolve(item)">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { raf, caf } from '@/utils/index';
let timer = 0;
export default {
  name: 'revolve',
  data() {
    return {
      nodes: [
        { id: 1, name: '节点1', style: { top: 0, left: 0 }, angle: 0 },
        { id: 2, name: '节点3', style: { top: 0, left: 0 }, angle: 0 },
        { id: 3, name: '节点3', style: { top: 0, left: 0 }, angle: 0 },
        { id: 4, name: '节点4', style: { top: 0, left: 0 }, angle: 0 }
      ]
    };
  },
  created() {
    this.nodes.map((item, index) => {
      console.log('打印节点', item);
      const angle = (index * 360) / this.nodes.length;
      this.render(item, angle);
    });
  },
  methods: {
    render(item, angle) {
      const { x, y } = this.getPostion(angle);
      console.log('节点的位置', x, y, angle);
      item.style = {
        top: y + 'px',
        left: x + 'px'
      };
      item.angle = angle;
    },
    // 根据角度更改
    getPostion(angle) {
      console.log('角度', angle);
      const x = (Math.cos((angle * Math.PI) / 180) * 112 + 112 - 32).toFixed(2);
      const y = (Math.sin((angle * Math.PI) / 180) * 112 + 112 - 32).toFixed(2);
      return { x, y };
    },
    handleRevolve(value) {
      console.log('点击的节点', value);
      let num = 360 - value.angle;
      let aAngle = parseInt(num / 10);
      let firstAngle = (this.nodes[0].angle + num) % 360;
      let lastAngle = (this.nodes[this.nodes.length - 1].angle + num) % 360;
      this.nodes.forEach(item => {
        let angle = item.angle;
        this.animation(aAngle, angle, item, firstAngle, lastAngle);
      });
    },
    animation(aAngle, angle, item, firstAngle, lastAngle) {
      let first = this.nodes[0];
      let last = this.nodes[this.nodes.length - 1];
      if (Math.abs(lastAngle - last.angle) > aAngle) {
        angle = (angle + aAngle) % 360;
      } else {
        angle = (angle + lastAngle - last.angle) % 360;
      }
      this.render(item, angle);
      timer = raf(() => {
        this.animation(aAngle, angle, item, firstAngle, lastAngle);
      });
      if (firstAngle === first.angle) {
        caf(timer);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.revolve {
  position: relative;
  top: 100px;
  left: 100px;
  .circle {
    width: 224px;
    height: 224px;
    border: 3px solid #413732;
    border-radius: 50%;
    user-select: none;
  }
  .title {
    cursor: pointer;
    position: absolute;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    line-height: 64px;
    text-align: center;
    background-color: #f6bb98;
  }
}
</style>
