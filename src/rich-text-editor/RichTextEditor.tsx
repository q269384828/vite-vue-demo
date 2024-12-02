import type { OutputData } from '@editorjs/editorjs'
import type { PropType } from 'vue'
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { REditor } from './editor'
import './editor.css'

export const RichTextEditor = defineComponent({
  props: {
    modelValue: {
      type: [String, Object] as PropType<OutputData>,

    },
    placeholder: {
      type: String,
      default: '输入内容,键入 `/` 获取更多选项',
    },
    readOnly: {
      type: Boolean,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    let editor: REditor
    const nodeRef = ref<HTMLElement>()
    // model -> view
    const modelToView = () => {
      editor.render(props.modelValue)
    }

    let updatingModel = false
    // view -> model
    const viewToModel = async () => {
      updatingModel = true
      try {
        const outputData = await editor.save()
        emit('update:modelValue', outputData)
      }
      catch (error) {
        console.error('保存数据时出错:', error)
      }
      updatingModel = false
    }
    // useFocusout(nodeRef, () => {
    //   viewToModel()
    // })

    onMounted(() => {
      if (nodeRef.value) {
        editor = new REditor(nodeRef.value, {
          data: props.modelValue,
          placeholder: props.placeholder,
          readOnly: props.readOnly,
          onChange: () => {
            viewToModel()
          },
        })
      }
    })

    onUnmounted(() => {
      editor.destroy()
    })

    watch(() => props.modelValue, async () => {
      if (!updatingModel) {
        modelToView()
      }
    })

    watch(() => props.readOnly, (v) => {
      editor.readOnly = v
    })

    return () => {
      return (
        <div
          ref={nodeRef}
          class="editorjs-wrapper"

        >
        </div>
      )
    }
  },
})

// function useFocusout(nodeRef: Ref<HTMLElement | undefined, HTMLElement | undefined>, cb: () => void | Promise<void>) {
//   function on(ele: HTMLElement) {
//     ele.addEventListener('focusout', cb)
//     return () => {
//       ele.removeEventListener('focusout', cb)
//     }
//   }
//   watchEffect((onCleanup) => {
//     if (!nodeRef.value) {
//       return
//     }
//     const off = on(nodeRef.value)
//     onCleanup(() => {
//       off()
//     })
//   })
// }
