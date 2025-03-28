import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    svelte: true,
    ignores: [
      '**/build/**',
      '**/dist/**',
      '**/dev-dist/**',
      '**/node_modules/**',
      '**/*.svelte',
    ],
  },
)
