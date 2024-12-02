import type { OutputData } from '@editorjs/editorjs'
import type { PropType, Ref } from 'vue'
import { isEqual } from 'lodash'
import { defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
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
    useClickOutside(nodeRef, () => {
      viewToModel()
    })
    onMounted(() => {
      if (nodeRef.value) {
        editor = new REditor(nodeRef.value, {
          data: props.modelValue,
          //   onChange: viewToModel,
          placeholder: props.placeholder,
          readOnly: props.readOnly,
          onBlur: viewToModel,
        })
      }
      editor.onReady(() => {
        modelToView()
      })
    })

    onUnmounted(() => {
      editor.destroy()
    })

    watch(() => props.modelValue, async (v, oldV) => {
      if (!updatingModel && !isEqual(v?.blocks, oldV?.blocks)) {
        await nextTick()
        modelToView()
      }
    })

    watch(() => props.readOnly, (v) => {
      editor.readOnly = v
    })

    return () => {
      return <div ref={nodeRef} class="editorjs-wrapper" onBlur={viewToModel}></div>
    }
  },
})
function useClickOutside(nodeRef: Ref<HTMLElement | undefined, HTMLElement | undefined>, cb: () => void | Promise<void>) {
  const handler = (e: MouseEvent) => {
    if (nodeRef.value && !nodeRef.value.contains(e.target as Node)) {
      cb()
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
}
