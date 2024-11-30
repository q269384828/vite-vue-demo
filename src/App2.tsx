import { defineComponent, ref } from "vue";
import { RichTextEditor } from "./rich-text-editor";
import { OutputData } from "@editorjs/editorjs";


export const App = defineComponent(() => {

  const state = ref<OutputData>();
  return () => (
    <>
      <div style={{ padding: '70px' }}>
        <RichTextEditor v-model={state.value} />
      </div>
  
    </>
  );
});
