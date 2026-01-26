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
          if (data.request?.startsWith('zustand')) {
            return false;
          }
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
          if (data.request?.startsWith('zustand')) {
            return false;
          }
          return true;
        },
      },
    },
  ],
  output: {
    target: 'web',
  },
});
