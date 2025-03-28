import type { UserConfig } from 'vite'
import process from 'node:process'
import { sveltekit } from '@sveltejs/kit/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
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
    '__DATE__': `'${new Date().toISOString()}'`,
    '__RELOAD_SW__': false,
    'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? '"production"' : '"development"',
  },
  // WARN: this will not be necessary on your project
  server: {
    fs: {
      // Allow serving files from hoisted root node_modules
      allow: ['../..'],
    },
  },
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      srcDir: './src',
      mode: 'development',
      // you don't need to do this if you're using generateSW strategy in your app
      strategies: generateSW ? 'generateSW' : 'injectManifest',
      // you don't need to do this if you're using generateSW strategy in your app
      filename: generateSW ? undefined : 'prompt-sw.ts',
      scope: '/',
      base: '/',
      selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
      pwaAssets: {
        config: true,
      },
      manifest: {
        short_name: 'SvelteKit PWA',
        name: 'SvelteKit PWA',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
      },
      injectManifest: {
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
      },
      workbox: {
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
      },
      devOptions: {
        enabled: false,
        suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
        type: 'module',
        navigateFallback: '/',
      },
      // if you have shared info in svelte config file put in a separate module and use it also here
      kit: {
        includeVersionFile: true,
      },
    },
    ),
  ],
}

export default config
