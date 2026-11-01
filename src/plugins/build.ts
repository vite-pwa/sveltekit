import type { VitePWAStrategy } from '@unplugin-pwa/core'
import type { ViteBundler, VitePWAPluginContext } from '@unplugin-pwa/vite/vite-context'
import type { SWType } from '@vite-pwa/workbox-build/types'
import type { Plugin } from 'vite'
import { generateWebManifest } from '@unplugin-pwa/core/generate-web-manifest'

export function SvelteKitBuildPlugin<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
>(
  ctx: VitePWAPluginContext<ViteBundler, UserStrategy, T>,
): Plugin {
  return {
    name: 'vite-pwa:sveltekit:build',
    enforce: 'post',
    apply: 'build',
    sharedDuringBuild: true,
    applyToEnvironment(environment) {
      return environment.config.consumer === 'client'
    },
    async generateBundle(_, bundle) {
      if (!ctx.envApi && ctx.viteConfig.build.ssr) {
        return
      }

      const pwaAssetsGenerator = await ctx.pwaAssetsGenerator
      if (pwaAssetsGenerator) {
        pwaAssetsGenerator.injectManifestIcons()
      }

      if (ctx.resolvedOptions.manifest) {
        if (typeof this !== 'undefined' && typeof this.emitFile !== 'undefined') {
          this.emitFile({
            type: 'asset',
            fileName: ctx.resolvedOptions.manifestFilename,
            source: generateWebManifest(ctx),
          })
        }
        else {
          // NOTE: assigning to bundle[foo] directly is discouraged by rollup
          // and is not supported by rolldown.
          // The api consumers should pass in the pluginCtx in the future
          bundle[ctx.resolvedOptions.manifestFilename!] = {
            // @ts-expect-error: for Vite 3 support, Vite 4 has removed `isAsset` property
            isAsset: true,
            type: 'asset',
            // vite 6 deprecation: replaced with names
            name: undefined,
            // fix vite 6 build with manifest enabled
            names: [],
            source: generateWebManifest(ctx),
            fileName: ctx.resolvedOptions.manifestFilename!,
          }
        }
      }
    },
  }
}
