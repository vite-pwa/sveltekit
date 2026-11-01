module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
  ],
  globals: {
    __DATE__: 'readonly',
  },
  plugins: [
    '@typescript-eslint',
  ],
  ignorePatterns: [
    '*.cjs',
    '.svelte-kit/',
    'build/',
    'dist/',
    'node_modules/',
    '.DS_Store',
    'package/',
    '.env',
    '.env.*',
    '!.env.example',
    'vite.config.ts.timestamp-*'
  ],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  rules: {
    'no-shadow': ['error'],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unused-vars': [
      // prevent variables with a _ prefix from being marked as unused
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
}
