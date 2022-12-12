import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

const config: UserConfig = {
	logLevel: 'info',
	build: {
		minify: false,
	},
	define: {
		__DATE__: `'${new Date().toISOString()}'`,
		__RELOAD_SW__: false,
	},
	// WARN: this will not be necessary on your project
	server: {
		fs: {
			// Allow serving files from hoisted root node_modules
			allow: ['../..']
		}
	},
	plugins: [
		sveltekit(),
		SvelteKitPWA({
				srcDir: './src',
				mode: 'development',
				strategies: 'injectManifest',
				filename: 'prompt-sw.ts',
				scope: '/',
				base: '/',
				manifest: {
					short_name: 'SvelteKit PWA',
					name: 'SvelteKit PWA',
					start_url: '/',
					scope: '/',
					display: 'standalone',
					theme_color: "#ffffff",
					background_color: "#ffffff",
					icons: [
						{
							src: '/pwa-192x192.png',
							sizes: '192x192',
							type: 'image/png',
						},
						{
							src: '/pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png',
						},
						{
							src: '/pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any maskable',
						},
					],
				},
				injectManifest: {
					globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
				},
				devOptions: {
					enabled: true,
					type: 'module',
					navigateFallback: '/',
				},
				// if you have shared info in svelte config file put in a separate module and use it also here
				kit: {}
			}
		)]
};

export default config;
