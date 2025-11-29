import { defineConfig } from 'vitest/config'


export default defineConfig({
  test: {
    setupFiles: './src/__test__/utils/vitest.setup.ts',
    environment: 'node'
  },
})
