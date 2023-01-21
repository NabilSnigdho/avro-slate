import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        horizontal: { raw: '(max-height: 622px)' },
      },
    },
  },
  safelist: 'max-w-1/10',
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
  extract: {
    include: ['index.html', 'src/**/*.tsx'],
  },
})
