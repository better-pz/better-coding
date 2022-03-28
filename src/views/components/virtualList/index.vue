<template>
  <div class="content">
    <!-- <virtual-drag-list class="asdas" /> -->
    <virtual-list :estimatedItemSize="1111" />
  </div>
</template>

<script>
import virtualList from './virtualList.vue';
export default {
  name: 'App',
  components: { virtualList }
};
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
#app {
  height: 100%;
}
.content {
  /* height: 500px; */
  height: 100%;
}
</style>
