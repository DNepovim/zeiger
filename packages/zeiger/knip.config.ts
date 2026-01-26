import type { KnipConfig } from 'knip';

export default {
  entry: ['src/index.ts'],
  ignoreDependencies: ['@rsbuild/plugin-react'],
  ignoreBinaries: ['eslint', 'prettier', 'size-limit'],
} satisfies KnipConfig;
