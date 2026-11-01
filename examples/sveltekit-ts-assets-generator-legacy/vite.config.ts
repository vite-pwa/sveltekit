import type { Plugin, UserConfig } from 'vite'
import process from 'node:process'
import { sveltekit } from '@sveltejs/kit/vite'
import { LegacySvelteKitPWA } from '@vite-pwa/sveltekit/legacy'
// you don't need to do this if you're using generateSW strategy in your app
import { generateSW } from './pwa.mjs'

const config: UserConfig = {
  // WARN: this will not be necessary on your project
  logLevel: 'info',
  // WARN: this will not be necessary on your project
  build: {
    minify: false,
  },
  // WARN: this will not be necessary on your project
  define: {
    __DATE__: `'${new Date().toISOString()}'`,
  },
  plugins: [
    sveltekit(),
    LegacySvelteKitPWA({
      // you don't need to do this if you're using generateSW strategy in your app
      strategies: generateSW ? 'generateSW' : 'buildSW',
      // tests with classic, dev with dual
      swType: process.env.NODE_ENV === 'production' ? 'classic' : 'classic-and-module',
      injectRegister: false,
      scope: '/',
      base: '/',
      // selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
      pwaAssets: {
        config: true,
      },
      manifest: {
        short_name: 'Legacy SvelteKit PWA',
        name: 'Legacy SvelteKit PWA',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
      },
      buildSW: {
        swSrc: 'src/prompt-sw.ts',
        globStrict: process.env.NODE_ENV === 'production',
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2,webmanifest}'],
      },
      generateSW: {
        globStrict: process.env.NODE_ENV === 'production',
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2,webmanifest}'],
      },
      devOptions: {
        enabled: true,
        inspector: 'standalone',
        suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
        type: 'module',
        navigateFallback: '/',
      },
      // if you have shared info in svelte config file put in a separate module and use it also here
      kit: {
        includeVersionFile: true,
      },
    }) as Plugin,
  ],
}

export default config
