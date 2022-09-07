import type { Plugin } from 'vite'
import type { SvelteKitPWAOptions } from './types'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'
import { configureSvelteKitOptions } from './config'

export function SvelteKitPWA(userOptions: Partial<VitePWAOptions> = {}): Plugin[] {
    if (!userOptions.integration)
        userOptions.integration = {}

    userOptions.integration.closeBundleOrder = 'pre'
    userOptions.integration.configureOptions = (
        viteConfig,
        options
    ) => configureSvelteKitOptions(
        viteConfig,
        options as SvelteKitPWAOptions
    )

    return VitePWA(userOptions)
}

export * from './types'
