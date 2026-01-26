import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  lib: [
    {
      format: 'esm',
      syntax: ['node 22'],
      dts: true,
      autoExternal: false,
      output: {
        externals: (data) => {
          // Bundle zustand and all its subpaths instead of externalizing
          if (data.request?.startsWith('zustand')) {
            return false;
          }
          // Externalize other peer dependencies
          return true;
        },
      },
    },
    {
      format: 'cjs',
      syntax: ['node 22'],
      autoExternal: false,
      output: {
        externals: (data) => {
          // Bundle zustand and all its subpaths instead of externalizing
          if (data.request?.startsWith('zustand')) {
            return false;
          }
          // Externalize other peer dependencies
          return true;
        },
      },
    },
  ],
  output: {
    target: 'web',
  },
});
