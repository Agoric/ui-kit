// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  optimizeDeps: {
    include: ['@endo/init'],
    esbuildOptions: { target: 'es2020', supported: { bigint: true } },
  },
  plugins: [tsconfigPaths()],
  build: {
    chunkSizeWarningLimit: 4000,
    target: 'es2020',
  },
});
