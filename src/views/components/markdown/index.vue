<template>
  <div class="markdown-container">
    <markdown-editor :content="content" @blur="handleBlur" />
  </div>
</template>

<script>
import markdownEditor from '@/components/markdown/index';
export default {
  name: 'markdown',
  components: { markdownEditor },
  data() {
    return {
      content: ''
    };
  },
  methods: {
    handleBlur(val) {
      this.content = val;
      console.log(888, this.content);
    }
  }
};
</script>
<style lang="scss" scoped></style>
