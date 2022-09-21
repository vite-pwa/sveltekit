/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />

declare const __DATE__: string
declare const __RELOAD_SW__: boolean

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		userid: string;
		buildDate: string;
		periodicUpdates: boolean
	}

	// interface PageData {}

	// interface Platform {}
}
