import { type OutputData } from '@editorjs/editorjs';
import { defineComponent, nextTick, onMounted, onUnmounted, PropType, ref, watch } from 'vue';
import { REditor } from './editor';
import { isEqual } from 'lodash';
import './editor.css';

export const RichTextEditor = defineComponent({
    props: {
        modelValue: {
            type: [String, Object] as PropType<OutputData>,

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

        watch(() => props.modelValue, async (v, oldV) => {
            console.log('modelValue changed:', JSON.stringify(v), JSON.stringify(oldV));
            if (!updatingModel && !isEqual(v?.blocks, oldV?.blocks)) {
                await nextTick();
                modelToView();

            }
        });

        return () => {
            return <div ref={nodeRef} class={'editorjs-wrapper'}></div>;
        };
    },
});