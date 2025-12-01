import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    setupFiles: './src/__test__/utils/vitest.setup.ts',
    environment: 'node'
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~prisma': path.resolve(__dirname, './prisma')
    }
  }
});
