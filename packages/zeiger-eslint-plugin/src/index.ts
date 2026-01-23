import type { ESLint } from 'eslint';

const plugin: ESLint.Plugin = {
  meta: {
    name: 'zeiger-eslint-plugin',
    version: '1.0.0',
  },
  rules: {
    // Add your Zeiger-specific ESLint rules here
  },
  configs: {
    recommended: {
      plugins: ['zeiger'],
      rules: {
        // Add recommended rule configurations here
      },
    },
  },
};

export default plugin;
