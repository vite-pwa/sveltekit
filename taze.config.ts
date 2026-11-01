import { defineConfig } from 'taze'

export default defineConfig({
  recursive: true,
  write: true,
  includeLocked: true,
  maturityPeriod: 7,
  peer: false,
  mode: 'minor',
  retry: 2,
  exclude: [
    'taze',
    'node',
    'why-is-node-running',
    'vite@5',
    'vite-plugin-inspect@0',
    'vite@6',
    'vite@7',
    'vite-plugin-inspect@11',
    // sveltekit2legacy
    '@sveltejs/kit@2',
    '@sveltejs/vite-plugin-svelte@3.0.1',
    '@sveltejs/adapter-node@2',
    'svelte@5.1.9',
    'svelte-check@4.0.5',
    // sveltekit2
    '@sveltejs/kit@2.63.0',
    '@sveltejs/adapter-node@5',
    'svelte@5.56.1',
    'svelte-check@4.6.0',
    // static adapter
    '@sveltejs/adapter-static@3',
    // examples
    '@types/lib',
    '@fontsource/fira-mono',
    'eslint@8.57.0',
    'eslint-plugin-svelte@2.46.0',
    'typescript-eslint@8.16.0',
    '@typescript-eslint/eslint-plugin@8.16.0',
    '@typescript-eslint/eslint-parser@8.16.0',
    '@types/cookie@0.6.0',
    'cookie@0.6.0',
  ],
  githubActions: {
    style: 'sha',
  },
  depFields: {
    packageManager: false,
  },
})
