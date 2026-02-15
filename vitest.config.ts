import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    globalSetup: ['./scripts/vitest-global-setup.ts'],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '~prisma': path.resolve(__dirname, 'prisma'),
    },
  },
});
