import { defineConfig } from 'vitest/config';
import { withPwa } from '@vite-pwa/sveltekit'
import { generateSW } from './pwa.mjs'
import { adapter } from './adapter.mjs'
import process from 'node:process'
import Inspect from 'vite-plugin-inspect'
import { DevTools } from '@vitejs/devtools'

export default defineConfig({
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
	server: {
		fs: {
			// Allow serving files from hoisted root node_modules
			allow: ['../..'],
		},
	},
	plugins: [
		DevTools(),
		withPwa(
			{
				compilerOptions: {
					// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
					runes: ({ filename }) =>
						filename.split(/[/\\]/).includes('node_modules') ? undefined : true
				},

				// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
				// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
				// See https://svelte.dev/docs/kit/adapters for more information about adapters.
				adapter
			},
			{
				// you don't need to do this if you're using generateSW strategy in your app
				strategies: generateSW ? 'generateSW' : 'buildSW',
				// tests with classic, dev with dual
				swType: process.env.NODE_ENV === 'production' ? 'classic' : 'classic-and-module',
				injectRegister: false,
				scope: '/',
				base: '/',
				// selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
				manifest: {
					short_name: 'SvelteKit PWA',
					name: 'SvelteKit PWA',
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
					inspector: 'vite-devtools',
					suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
					type: 'module',
					navigateFallback: '/',
				},
				// if you have shared info in svelte config file put in a separate module and use it also here
				kit: {
					includeVersionFile: true,
				}
			}
		),
		Inspect()
	]
});
