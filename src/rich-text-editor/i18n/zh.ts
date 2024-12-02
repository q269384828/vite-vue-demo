import type { I18nConfig } from '@editorjs/editorjs'

export const lang = 'zh-CN'

export const config: I18nConfig = {
  messages: {
    ui: {

      blockTunes: {
        toggler: {
          'Click to tune': '点击转换',
          'or drag to move': '拖拽移动',
        },
      },
      inlineToolbar: {
        converter: {
          'Convert to': '转换为',
        },
      },
      toolbar: {
        toolbox: {
          Add: '添加',
        },
      },
      popover: {
        'Filter': '过滤',
        'Nothing found': '找不到',
      },

    },
    /** * 工具名称的翻译：包括块级工具和行内工具 */
    toolNames: {
      'Text': '段落',
      'Bold': '加粗',
      'Italic': '斜体',
      'Unordered List': '无序列表',
      'Ordered List': '有序列表',
      'Checklist': '任务列表',
      'Image': '图片',
      'Link': '链接',
      'Columns': '分栏',
    },
    tools: {
      paragraph: {
        'Press Tab': '输入内容',
      },
      link: {
        'Add a link': '添加链接',
      },
    },
    blockTunes: {
      converter: '转换',

      delete: {
        Delete: '删除',
      },
      moveUp: {
        'Move up': '上移',
      },
      moveDown: {
        'Move down': '下移',
      },
    },
  },
}
