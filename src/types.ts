import type { VitePWAOptions, VitePWAStrategy } from '@unplugin-pwa/core'
import type { SWType } from '@vite-pwa/workbox-build/types'

export interface KitOptions {
  /**
   * The directory where SvelteKit keeps its stuff, including static assets (such as JS and CSS) and internally-used routes.
   *
   * Required if you are using legacy SvelteKit and changing the appDir option.
   *
   * @default _app
   * @see https://svelte.dev/docs/kit/configuration#appDir
   */
  appDir?: string
  /**
   * The directory where SvelteKit keeps its static assets (such as JS and CSS).
   *
   * @default static
   * @see https://svelte.dev/docs/kit/configuration#assets
   */
  assets?: string
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
   * Include `${appDir}/version.json` in the service worker precache manifest?
   *
   * @default false
   */
  includeVersionFile?: boolean

  /**
   * Enable SPA mode for the application.
   *
   * By default, the plugin will use `adapterFallback` to include the entry in the service worker
   * precache manifest.
   *
   * If you are using a logical name for the fallback, you can use the object syntax with the
   * `fallbackMapping`.
   *
   * For example, if you're using `fallback: 'app.html'` in your static adapter and your server
   * is redirecting to `/app`, you can configure `fallbackMapping: '/app'`.
   *
   * Since the static adapter will run after the PWA plugin generates the service worker,
   * the PWA plugin doesn't have access to the adapter fallback page to include the revision in the
   * service worker precache manifest.
   * To generate the revision for the fallback page, the PWA plugin will use the
   * `.svelte-kit/output/client/_app/version.json` file.
   * You can configure the `fallbackRevision` to generate a custom revision.
   *
   * @see https://svelte.dev/docs/kit/single-page-apps
   */
  spa?: true | {
    fallbackMapping?: string
    fallbackRevision?: () => Promise<string>
  }
}

export type SvelteKitPWAOptions<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
> = VitePWAOptions<UserStrategy, T> & {
  kit?: KitOptions
}
