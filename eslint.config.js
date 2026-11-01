import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    ignores: [
      '**/build/**',
      '**/dist/**',
      '**/dev-dist/**',
      '**/node_modules/**',
      '**/*.svelte',
      'pnpm-workspace.yaml',
      // examples with their own linting config
      'examples/**',
    ],
  },
  {
    // it detects nested arrays wrongly
    files: ['.github/labeler.yml'],
    rules: {
      'yaml/indent': 'off',
    },
  },
)
