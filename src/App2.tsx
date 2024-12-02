import type { OutputData } from '@editorjs/editorjs'
import { defineComponent, ref } from 'vue'
import { RichTextEditor } from './rich-text-editor'

export const App = defineComponent(() => {
  const state = ref<OutputData>()
  const readOnly = ref(true)
  return () => (
    <>

      <div style={{ padding: '70px', display: 'flex' }}>
        <div style={{ flex: 1, minWidth: `0` }}>
          <RichTextEditor v-model={state.value} readOnly={readOnly.value} />
        </div>
        <div style={{ flex: 1 }}>
          <pre>{JSON.stringify(state.value, null, 2)}</pre>
        </div>
      </div>
      <button onClick={() => readOnly.value = !readOnly.value}>
        切换readOnly
      </button>

    </>
  )
})
