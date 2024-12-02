import editorjsColumns from '@calumk/editorjs-columns'
import CodeTool from '@editorjs/code'
import EditorJS, { type EditorConfig, type OutputData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import ListTool from '@editorjs/list'
import TextVariantTune from '@editorjs/text-variant-tune'
import { debounce } from 'lodash'
import configsMap from './i18n'

export class REditor {
  private editor: EditorJS

  private ready = false
  constructor(holder: HTMLElement, config: Pick<EditorConfig, 'onChange' | 'placeholder' | 'data' | 'readOnly'> & {
    onBlur?: (data: OutputData) => void
  }) {
    this.editor = new EditorJS({
      holder,
      placeholder: config.placeholder,
      inlineToolbar: true, // ['bold', 'italic', 'link'],
      autofocus: true,
      tools: {
        list: {
          class: ListTool,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        textVariant: TextVariantTune,
        code: CodeTool,
        header: {
          class: Header,
          config: {
            levels: [2, 3, 4, 5],
            defaultLevel: 3,
          },
        },
        columns: {
          class: editorjsColumns,
          config: {
            EditorJsLibrary: EditorJS,
            tools: {
              list: {
                class: ListTool,
                inlineToolbar: true,
                config: {
                  defaultStyle: 'unordered',
                },
              },
              textVariant: TextVariantTune,
              code: CodeTool,
              header: Header,
            },
          },
        },
      },
      readOnly: config.readOnly,
      onChange: config.onChange ? debounce(config.onChange, 1000) : undefined,
      onReady: () => {
        this.handleReady()
        this.onBlur(config.onBlur)
      },
      i18n: configsMap['zh-CN'],
      data: config.data,
      tunes: ['textVariant'],

    })
  }

  public destroy() {
    this.editor.destroy()
  }

  onBlur(onBlurCallback?: (data: OutputData) => void) {
    const handler = async () => {
      if (!this.ready) {
        return
      }
      const data = await this.editor.save()
      onBlurCallback?.(data)
    }
    this.editor.on('blur', handler)
    return () => {
      this.editor.off('blur', handler)
    }
  }

  set readOnly(value: boolean) {
    this.editor.readOnly.toggle(value)
  }

  get readOnly() {
    return this.editor.readOnly.isEnabled
  }

  _readyCallbacks: (() => void)[] = []

  private handleReady = () => {
    this.ready = true
    this._readyCallbacks.forEach((callback) => {
      callback()
    })
  }

  public onReady(callback: () => void) {
    if (this._readyCallbacks.includes(callback)) {
      return
    }
    if (this.ready) {
      callback()
      return
    }
    this._readyCallbacks.push(callback)
  }

  public async save() {
    return await this.editor.save()
  }

  public async render(data: OutputData | undefined) {
    if (!this.ready) {
      return
    }
    if (data == null) {
      return
    }
    if (typeof data === 'string') {
      await this.editor.blocks.renderFromHTML(data)
      this.editor.focus()
      return
    }
    await this.editor.render(data)
    this.editor.focus()
  }
}
