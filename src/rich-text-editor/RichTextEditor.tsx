import { type OutputData } from '@editorjs/editorjs';
import { defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue';
import { REditor } from './createEditor';
import { isEqual } from 'lodash';


export const RichTextEditor = defineComponent({
    props: {
        modelValue: {
            type: [String, Object] as PropType<OutputData>,
            required: true
        },
        placeholder: {
            type: String,
            default: '开始编辑您的内容...'
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const nodeRef = ref<HTMLElement>();
        // model -> view
        const modelToView = () => {
            editor.render(props.modelValue);
        };

        let updatingModel = false;
        // view -> model
        const viewToModel = async () => {
            updatingModel = true;
            try {
                const outputData = await editor.save();
                emit('update:modelValue', outputData);

            } catch (error) {
                console.error('保存数据时出错:', error);

            }
            updatingModel = false;
        };
        let editor: REditor;
        onMounted(() => {
            if (nodeRef.value) {
                editor = new REditor(nodeRef.value, {
                    onChange: viewToModel,
                    placeholder: props.placeholder
                });
            }
            editor.onReady(() => {
                modelToView();
            });
        });

        onUnmounted(() => {
            editor.destroy();
        });

        watch(() => props.modelValue, (v, oldV) => {
            if (!updatingModel && !isEqual(v, oldV)) {
                modelToView();
            }
        });

        return () => {
            return <div ref={nodeRef} style="border: 1px solid #ccc; padding: 10px;"></div>;
        };
    },
});