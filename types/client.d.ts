declare module '$vite-pwa/sveltekit' {
    export const pwaEnabled: boolean
}
declare module '$vite-pwa/sveltekit/webmanifest' {
    export { SvelteComponentDev as default } from 'svelte/internal'
}
declare module '$vite-pwa/sveltekit/register-sw' {
    export { SvelteComponentDev as default } from 'svelte/internal'
}
