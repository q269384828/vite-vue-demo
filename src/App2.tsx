import type { OutputData } from '@editorjs/editorjs'
import { defineComponent, ref } from 'vue'
import { RichTextEditor } from './rich-text-editor'

export const App = defineComponent(() => {
  const state = ref<OutputData>(
    {
      time: 1733165729083,
      blocks: [
        {
          id: 'dksb11c1bk',
          type: 'paragraph',
          data: {
            text: 'testffffffffffffff',
          },
          tunes: {
            textVariant: '',
          },
        },
      ],
      version: '2.30.7',
    },
  )
  const readOnly = ref(false)
  return () => (
    <>

      <div style={{ padding: '70px', display: 'flex' }}>
        <div style={{ flex: 1, minWidth: `0` }}>
          <RichTextEditor v-model={state.value} readOnly={readOnly.value} />
        </div>
        <div style={{ flex: 1, minWidth: `100px` }}>
          <pre>{JSON.stringify(state.value, null, 2)}</pre>
        </div>
      </div>
      <button onClick={() => readOnly.value = !readOnly.value}>
        切换readOnly
      </button>

    </>
  )
})
