import 'vite-plugin-pwa/svelte';
import 'vite-plugin-pwa/info';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	declare const __DATE__: string
	declare const __RELOAD_SW__: boolean
	namespace App {
		interface Locals {
			userid: string;
			buildDate: string;
			periodicUpdates: boolean;
		}

		// interface PageData {}

		// interface Platform {}
	}
}


export {};
