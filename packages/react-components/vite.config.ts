import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import tailwindcss from 'tailwindcss';
import { UserConfigExport } from 'vite';
import { name } from './package.json';
import { visualizer } from 'rollup-plugin-visualizer';

const app = async (): Promise<UserConfigExport> => {
  /**
   * Removes everything before the last
   * @octocat/library-repo -> library-repo
   * vite-component-library-template -> vite-component-library-template
   */
  const formattedName = name.match(/[^/]+$/)?.[0] ?? name;

  return defineConfig({
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
      visualizer({ gzipSize: true }),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/lib/index.ts'),
        name: formattedName,
        formats: ['es'],
        fileName: format => `${formattedName}.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react/jsx-runtime', 'react-dom', 'tailwindcss', '@leapwallet/elements', '@interchain-ui/react', 'chain-registry', '@agoric/web-components', '@cosmos-kit/core', '@cosmos-kit/react', 'cosmos-kit'],
        output: {
          minifyInternalExports: true,
          globals: {
            react: 'React',
            'react/jsx-runtime': 'react/jsx-runtime',
            'react-dom': 'ReactDOM',
            tailwindcss: 'tailwindcss',
            '@leapwallet/elements': '@leapwallet/elements',
            '@interchain-ui/react': '@interchain-ui/react',
            'chain-registry': 'chain-registry',
            '@agoric/web-components': '@agoric/web-components',
            '@cosmos-kit/core': '@cosmos-kit/core',
            '@cosmos-kit/react': '@cosmos-kit/react',
            'cosmos-kit': 'cosmos-kit',
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  });
};
// https://vitejs.dev/config/
export default app;
