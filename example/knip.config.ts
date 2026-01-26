import type { KnipConfig } from 'knip';

export default {
  entry: ['src/main.tsx'],
  project: ['src/**/*.{ts,tsx}'],
  ignoreDependencies: [
    'zeiger',
    'zeiger-eslint-plugin',
    '@radix-ui/react-switch',
    'class-variance-authority',
    'lucide-react',
    'tailwindcss',
    '@eslint/js',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
    'globals',
    'typescript-eslint',
  ],
  ignoreBinaries: ['knip'],
} satisfies KnipConfig;
