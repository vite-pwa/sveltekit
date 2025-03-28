import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { adapter } from './adapter.mjs'
// you don't need to do this if you're using generateSW strategy in your app
import { generateSW } from './pwa.mjs'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter,
    serviceWorker: {
      register: false,
    },
    files: {
      // you don't need to do this if you're using generateSW strategy in your app
      serviceWorker: generateSW ? undefined : 'src/prompt-sw.ts',
    },
  },
}

export default config
