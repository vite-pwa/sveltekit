import type { Plugin } from 'vite'
import type { VitePluginPWAAPI } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'
import type { SvelteKitPWAOptions } from './types'
import { configureSvelteKitOptions } from './config'
import { SvelteKitPlugin } from './plugins/SvelteKitPlugin'

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

  const plugins = VitePWA(userOptions)

  const plugin = plugins.find(p => p && typeof p === 'object' && 'name' in p && p.name === 'vite-plugin-pwa')
  const resolveVitePluginPWAAPI = (): VitePluginPWAAPI | undefined => {
    return plugin?.api
  }

  return [
    // remove the build plugin: we're using a custom one
    ...plugins.filter(p => p && typeof p === 'object' && 'name' in p && p.name !== 'vite-plugin-pwa:build'),
    SvelteKitPlugin(userOptions, resolveVitePluginPWAAPI),
  ]
}

export * from './types'
