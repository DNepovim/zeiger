import baseConfig from '../eslint.config.js';
import zeigerPlugin from '../packages/zeiger-eslint-plugin/dist/index.js';

export default [
  ...baseConfig,
  {
    plugins: {
      zeiger: zeigerPlugin,
    },
    rules: {
      ...zeigerPlugin.configs.recommended.rules,
    },
  },
];
