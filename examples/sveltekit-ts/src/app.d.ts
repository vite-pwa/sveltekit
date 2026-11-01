import '@unplugin-pwa/core/svelte'
import '@unplugin-pwa/core/info'
import '@unplugin-pwa/vite/hmr-entry-point'

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	declare const __DATE__: string
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
