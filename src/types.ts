import type { VitePWAOptions } from 'vite-plugin-pwa'

export interface KitOptions {
  /**
     * The base path for your application: by default will use the Vite base.
     *
     * @default '/'
     * @see https://kit.svelte.dev/docs/configuration#paths
     * */
  base?: string

  /**
     * @default '.svelte-kit'
     * @see https://kit.svelte.dev/docs/configuration#outdir
     */
  outDir?: string

  /**
     * @see https://github.com/sveltejs/kit/tree/master/packages/adapter-static#fallback
     */
  adapterFallback?: string

  /**
     * @default 'never'
     * @see https://kit.svelte.dev/docs/configuration#trailingslash
     * */
  trailingSlash?: 'never' | 'always' | 'ignore'
}

export interface SvelteKitPWAOptions extends Partial<VitePWAOptions> {
  kit?: KitOptions
}
