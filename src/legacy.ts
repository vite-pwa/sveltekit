import type { VitePWAStrategy } from '@unplugin-pwa/core'
import type { SWType } from '@vite-pwa/workbox-build/types'
import type { PluginOption } from 'vite'
import type { SvelteKitPWAOptions } from './types.ts'
import { BuildRegisterSWPlugin } from '@unplugin-pwa/vite/plugins/build-register-sw'
import { DevPlugin } from '@unplugin-pwa/vite/plugins/dev'
import { DevMiddlewarePlugin } from '@unplugin-pwa/vite/plugins/dev-middleware'
import { DevAssetsMiddlewarePlugin } from '@unplugin-pwa/vite/plugins/dev-pwa-assets-middleware'
import { InfoPlugin } from '@unplugin-pwa/vite/plugins/info'
import { InspectorPlugin } from '@unplugin-pwa/vite/plugins/inspector'
import { MainPlugin } from '@unplugin-pwa/vite/plugins/main'
import { AssetsPlugin } from '@unplugin-pwa/vite/plugins/pwa-assets'
import { VirtualModulesPlugin } from '@unplugin-pwa/vite/plugins/virtual-modules'
import { createSvelteKitPWAContext } from './context.ts'
import { LegacySvelteKitBuildPlugin } from './plugins/legacy-build.ts'
import { LegacySvelteKitMainPlugin } from './plugins/legacy-main.ts'

export function LegacySvelteKitPWA<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
>(
  options: Partial<SvelteKitPWAOptions<UserStrategy, T>> = {},
): PluginOption {
  const ctx = createSvelteKitPWAContext<UserStrategy, T>(
    {},
    options,
    true,
  )

  if (ctx.consumerOptions.devOptions?.inspector === 'vite-devtools') {
    ctx.consumerOptions.devOptions.inspector = 'standalone'
  }

  return [
    LegacySvelteKitMainPlugin(ctx),
    MainPlugin(ctx),
    VirtualModulesPlugin(ctx),
    InfoPlugin(ctx),
    DevPlugin(ctx),
    DevMiddlewarePlugin(ctx),
    DevAssetsMiddlewarePlugin(ctx),
    AssetsPlugin(ctx),
    BuildRegisterSWPlugin(ctx),
    LegacySvelteKitBuildPlugin(ctx),
    InspectorPlugin(ctx),
  ]
}
