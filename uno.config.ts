import { defineConfig, presetUno } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    verticalBreakpoints: {
      horizontal: '622px)',
    },
  },
  safelist: ['max-w-1/10'],
  shortcuts: {
    popper:
      'bg-white dark:(bg-dark-100 text-white) z-10 shadow-lg rounded-sm ring-1 ring-black ring-opacity-30 focus:outline-none',
    'item-active': 'bg-light-900 dark:bg-blue-gray-600',
    'item-hoverable': 'hover:(bg-gray-200 dark:bg-blue-gray-700)',
    focusable:
      'focus:outline-none focus-visible:(ring-2 ring-blue-500 ring-opacity-75)',
    button:
      'px-2 py-px rounded-sm bg-blue-400 hover:bg-blue-300 text-black ring-1 ring-blue-900',
  },
  transformers: [transformerVariantGroup(), transformerDirectives()],
})
