<template>
  <div v-if="type.indexOf('editor') > -1" :id="`editor_${differ}`" class="article-content"></div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Editor from '@toast-ui/editor';

export default {
  name: 'markdownEditor',
  props: {
    // 多个编辑器存在时用于区分的key值,默认为16进制随机数
    differ: {
      type: [String, Number],
      default: () => {
        return (((1 + Math.random()) * new Date().getTime()) | 0).toString(16);
      }
    },
    // 编辑器类型，viewer、editor或者['viewer', 'editor]
    type: {
      type: [String, Array],
      default: () => {
        return 'editor';
      }
    },
    // 默认显示内容
    content: {
      type: String,
      default: () => ''
    },
    placeholder: {
      type: String,
      default: () => ''
    },
    // 最大文本数量
    maxLength: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      flag: true,
      editor: null,
      viewer: null,
      toolbar: null,
      history: [], // undo\redo 存储数据
      current: -1, // undo\redo 当前索引
      editorType: ['markdown', 'wysiwyg'],
      imgUrl: '/img/loading.gif'
    };
  },
  watch: {
    type: {
      handler(val) {
        if (val.indexOf('editor') > -1) {
          this.$nextTick(() => {
            this.initEditor();
          });
        } else if (val.indexOf('viewer') > -1) {
          this.$nextTick(() => {
            this.initViewer();
          });
        }
      },
      immediate: true
    }
    // content: {
    //   handler(val) {
    //     this.history[0] = val
    //     if (~this.type.indexOf('editor')) {
    //       console.log('赋值content', val)
    //       this.$nextTick(() => {
    //         // this.editor.setMarkdown(val)
    //       })
    //     } else {
    //       this.$nextTick(() => {
    //         this.viewer.setMarkdown(val)
    //       })
    //     }
    //   }
    // }
  },
  mounted() {
    this.initEditor();
  },

  methods: {
    initEditor() {
      const self = this;
      this.editor = new Editor({
        el: document.querySelector(`#editor_${this.differ}`),
        minHeight: '200px',
        height: 'auto',
        language: 'zh-CN',
        previewStyle: 'vertical',
        placeholder: this.placeholder,
        initialValue: this.content,
        initialEditType: 'wysiwyg',
        theme: 'dark',
        hooks: {
          addImageBlobHook(imgeBlob, callback) {
            // 编写代码
            self.uploadFile(imgeBlob, callback);
          }
        },

        autofocus: false,
        events: {
          blur: () => this.onBlur()
          // change: () => this.onChange()
        }
      });
    },
    onBlur() {
      const val = this.getHTML();
      this.$emit('blur', val);
    },
    getHTML() {
      console.log('getHTML', this.editor.getHTML());
      return this.editor.getHTML();
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
.markdownEditor {
  /deep/ {
    .te-md-container {
      background: #fff !important;
    }
    .te-preview {
      min-width: 400px !important;
    }
  }
}
</style>
