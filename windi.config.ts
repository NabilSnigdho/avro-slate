import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    extend: {
      screens: {
        horizontal: { raw: '(max-height: 360px)' },
      },
    },
  },
  extract: {
    include: ['index.html', 'src/**/*.{tsx,css}'],
  },
})
