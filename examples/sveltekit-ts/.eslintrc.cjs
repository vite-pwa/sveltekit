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
    __RELOAD_SW__: 'readonly',
  },
  plugins: [
    '@typescript-eslint',
  ],
  ignorePatterns: ['*.cjs'],
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
