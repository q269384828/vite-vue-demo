import editorjsColumns from '@calumk/editorjs-columns'
import CodeTool from '@editorjs/code'
import EditorJS, { type EditorConfig, type OutputData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import ListTool from '@editorjs/list'
import TextVariantTune from '@editorjs/text-variant-tune'
import ColorPicker from 'editorjs-color-picker'
import Undo from 'editorjs-undo'
import { debounce, isEqual } from 'lodash'
import configsMap from './i18n'

export class REditor {
  private editor: EditorJS

  private ready = false
  constructor(holder: HTMLElement, config: Pick<EditorConfig, 'onChange' | 'placeholder' | 'data' | 'readOnly'>) {
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
        colorPicker: {
          class: ColorPicker,
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
              colorPicker: {
                class: ColorPicker,
              },
            },
          },
        },
      },
      readOnly: config.readOnly,
      onChange: config.onChange ? debounce(config.onChange, 1000) : undefined,
      onReady: () => {
        this.handleReady()
        // eslint-disable-next-line no-new
        new Undo({ editor: this.editor })
      },
      i18n: configsMap['zh-CN'],
      data: config.data,
      tunes: ['textVariant'],
    })
  }

  public destroy() {
    this.editor.destroy()
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
    const currData = await this.editor.save()
    // 和当前值不一样时才更新, 否则会导致光标位置丢失, 无法输入, 无法撤销等问题
    if (!isEqual(currData.blocks, data.blocks)) {
      await this.editor.render(data)
      this.editor.focus()
    }
  }
}
