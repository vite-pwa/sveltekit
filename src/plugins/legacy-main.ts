import type { VitePWAStrategy } from '@unplugin-pwa/core'
import type { ViteBundler, VitePWAPluginContext } from '@unplugin-pwa/vite/vite-context'
import type { SWType } from '@vite-pwa/workbox-build/types'
import type { Plugin } from 'vite'

export function LegacySvelteKitMainPlugin<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
>(
  ctx: VitePWAPluginContext<ViteBundler, UserStrategy, T>,
): Plugin {
  return {
    name: 'vite-pwa:sveltekit:legacy-main',
    enforce: 'pre',
    sharedDuringBuild: true,
    configResolved(config) {
      ctx.envApi = false
      ctx.viteConfig = config
    },
  }
}
