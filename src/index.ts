import type { Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import type { SvelteKitPWAOptions } from './types'
import { configureSvelteKitOptions } from './config'

export function SvelteKitPWA(userOptions: Partial<SvelteKitPWAOptions> = {}): Plugin[] {
  if (!userOptions.integration)
    userOptions.integration = {}

  userOptions.integration.closeBundleOrder = 'pre'
  userOptions.integration.configureOptions = (
    viteConfig,
    options,
  ) => configureSvelteKitOptions(
    userOptions.kit ?? {},
    viteConfig,
    options,
  )

  return VitePWA(userOptions)
}

export * from './types'
