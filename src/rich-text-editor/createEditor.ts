import editorjsColumns from '@calumk/editorjs-columns';
import EditorJS, { EditorConfig, type OutputData } from '@editorjs/editorjs';
import EmbedTool from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import ListTool from '@editorjs/list';

export class REditor {
    private editor: EditorJS;

    private ready = false;
    constructor(holder: HTMLElement, config: Pick<EditorConfig, 'onChange' | 'placeholder'>) {
        this.editor = new EditorJS({
            holder: holder,
            placeholder: config.placeholder,
            inlineToolbar: ['bold', 'italic', 'link'],
            tools: {
                embed: EmbedTool,
                list: ListTool,
                image: ImageTool,
                columns: {
                    class: editorjsColumns,
                    config: {
                        EditorJsLibrary: EditorJS,
                        tools: {
                            embed: EmbedTool,
                            list: ListTool,
                            image: ImageTool,
                        },
                    },
                },
            },
            onChange: config.onChange,
            onReady: () => {
                this.editor.focus();
                this.ready = true;
            }
        });

    }
    public destroy() {
        this.editor.destroy();
    }

    public onReady(callback: () => void) {
        if (this.ready) {
            callback();
            return;
        }
        this.editor.isReady.then(() => {
            callback();
        });
    }

    public async save() {
        await this.editor.save();
    }

    public async render(data: OutputData | string = '') {
        if (!this.ready) {
            return;
        }
        if (data == null) {
            return;
        }
        if (typeof data === 'string') {
            await this.editor.blocks.renderFromHTML(data);
            this.editor.focus();
            return;
        }
        await this.editor.render(data);
        this.editor.focus();
        return;
    }
}