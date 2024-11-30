import editorjsColumns from '@calumk/editorjs-columns';
import EditorJS from '@editorjs/editorjs';
import EmbedTool from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import ListTool from '@editorjs/list';
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';

export default defineComponent((props, { emit }) => {
  const editorJsNodeRef = ref<HTMLElement>();
  let editor: EditorJS;
  let updatingModel = false;
  // model -> view
  function modelToView() {
    if (!props.modelValue) {
      return;
    }
    if (typeof props.modelValue === 'string') {
      editor.blocks.renderFromHTML(props.modelValue);
      return;
    }
    editor.render(props.modelValue);
  }
  // view -> model
  function viewToModel(api, event) {
    updatingModel = true;
    editor.save().then((outputData) => {
      emit('update:modelValue', outputData);
    }).catch((error) => {
    }).finally(() => {
      updatingModel = false;
    });
  }
  onMounted(() => {
    editor = new EditorJS({
      holder: editorJsNodeRef.value,
      placeholder: props.placeholder,
      inlineToolbar: ['bold', 'italic', 'link'],
      tools: {
        embed: EmbedTool,
        list: ListTool,
        image: ImageTool,
        columns: {
          class: editorjsColumns,
          config: {
            EditorJsLibrary: EditorJS, // Pass the library instance to the columns instance.
            tools: {
              embed: EmbedTool,
              list: ListTool,
              image: ImageTool,
            }, // IMPORTANT! ref the column_tools
          },
        },
      },
      i18n: {
        messages: {
          ui: {
            blockTunes: {
              toggler: {
                'Click to tune': '点击转换',
              },
            },
            inlineToolbar: {
              converter: {
                'Convert to': '转换',
              },
            },
            toolbar: {
              toolbox: {
                Add: '工具栏添加',
              },
            },
            popover: {
              'Filter': '过滤',
              'Nothing found': '找不到',
            },
          },
          toolNames: {
            Text: '段落',
            Bold: '加粗',
            Italic: '斜体',
          },
          tools: {
            paragraph: {
              'Press Tab': '输入内容',
            },
          },
          blockTunes: {
            delete: {
              Delete: '删除',
            },
            moveUp: {
              'Move up': '上移',
            },
            moveDown: {
              'Move down': '下移',
            },
          },
        },
      },
      minHeight: 'auto',
      data: props.modelValue,
      onReady: modelToView,
      onChange: viewToModel,
    });
  });
  watch(() => props.modelValue, () => {
    if (!updatingModel) {
      modelToView();
    }
  });
  onUnmounted(() => {
    editor.destroy();
  });
  return () => {
    return (
      <div class="editorjs" ref={editorJsNodeRef}>

      </div>
    );
  };
});
