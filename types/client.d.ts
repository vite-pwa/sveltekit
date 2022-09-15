// declare module '$vite-pwa/sveltekit' {
declare module 'virtual:vite-pwa/sveltekit' {
    export const pwaEnabled: boolean
    export function registerDevServiceWorker(): string | undefined
    export function webManifestLink(): string | undefined
    export function registerSWScript(): string | undefined
}
// declare module '$vite-pwa/sveltekit/webmanifest' {
//     export { SvelteComponentDev as default } from 'svelte/internal'
// }
// declare module '$vite-pwa/sveltekit/register-sw' {
//     export { SvelteComponentDev as default } from 'svelte/internal'
// }
