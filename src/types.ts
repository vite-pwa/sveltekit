import type { VitePWAOptions } from 'vite-plugin-pwa'

export interface KitOptions {
  /**
   * The base path for your application: by default will use the Vite base.
   *
   * @deprecated since ^0.1.0 version, the plugin has SvelteKit ^1.0.0 as peer dependency, Vite's base is now properly configured.
   * @default '/'
   * @see https://kit.svelte.dev/docs/configuration#paths
   */
  base?: string

  /**
   * The static folder for your application.
   *
   * @default 'static'
   * @see https://kit.svelte.dev/docs/configuration#files
   */
  assets?: string

  /**
   * @default '.svelte-kit'
   * @see https://kit.svelte.dev/docs/configuration#outdir
   */
  outDir?: string

  /**
   * @see https://kit.svelte.dev/docs/adapter-static#options-fallback
   */
  adapterFallback?: string

  /**
   * Check your SvelteKit version, `trailingSlash` should be used in `+page[jt]s` files or `+layout.[jt]s.
   * @default 'never'
   */
  trailingSlash?: 'never' | 'always' | 'ignore'

  /**
   * @default `_app`
   * @see https://kit.svelte.dev/docs/configuration#appdir
   */
  appDir?: string

  /**
   * Include `${appDir}/version.json` in the service worker precache manifest?
   *
   * @default false
   */
  includeVersionFile?: boolean
}

export interface SvelteKitPWAOptions extends Partial<VitePWAOptions> {
  kit?: KitOptions
}
