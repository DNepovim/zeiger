import type { ESLint } from 'eslint';
import zeigerDeps from './rules/zeiger-deps';

const plugin: ESLint.Plugin = {
  meta: {
    name: 'zeiger-eslint-plugin',
    version: '1.0.0',
  },
  rules: {
    'zeiger-deps': zeigerDeps,
  },
  configs: {
    recommended: {
      plugins: ['zeiger'],
      rules: {
        'zeiger/zeiger-deps': 'error',
      },
    },
  },
};

export default plugin;
