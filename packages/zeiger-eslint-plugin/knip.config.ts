import type { KnipConfig } from 'knip';

export default {
  project: ['src/**/*.ts'],
  ignore: ['src/**/*.test.ts'],
  ignoreDependencies: ['@types/estree'],
  ignoreBinaries: ['eslint', 'prettier'],
} satisfies KnipConfig;
