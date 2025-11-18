import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@components': resolve(__dirname, './src/components'),
      '@services': resolve(__dirname, './src/services'),
      '@models': resolve(__dirname, './src/models'),
      '@stores': resolve(__dirname, './src/stores'),
      '@uis': resolve(__dirname, './src/uis'),
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
  },
});
