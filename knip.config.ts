import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  workspaces: {
    '.': {
      entry: ['turbo.json'],
      project: ['**/*.{ts,tsx,js,jsx}'],
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/build/**',
        '**/coverage/**',
        '**/*.config.{ts,js}',
        '**/vite.config.ts',
        '**/rslib.config.ts',
      ],
    },
    'packages/*': {
      entry: ['src/index.{ts,tsx}', 'src/**/*.{ts,tsx}'],
      project: ['src/**/*.{ts,tsx}'],
    },
    example: {
      entry: ['src/main.{ts,tsx}', 'src/**/*.{ts,tsx}'],
      project: ['src/**/*.{ts,tsx}'],
    },
  },
};

export default config;
