import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Use different polyfill strategies for dev vs build
    process.env.NODE_ENV === 'production'
      ? nodePolyfills({
          protocolImports: true,
          include: ['buffer'],
          exclude: ['process', 'fs', 'path', 'os', 'crypto'],
          globals: {
            Buffer: true,
            global: true,
            process: false,
          },
        })
      : null,
  ].filter(Boolean),
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development',
    ),
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
});
