import type { VitePWAStrategy } from '@unplugin-pwa/core'
import type { SWType } from '@vite-pwa/workbox-build/types'
import type { SvelteKitPWAOptions } from './types.ts'
import { sveltekit } from '@sveltejs/kit/vite'
import { BuildPwaAssetsPlugin } from '@unplugin-pwa/vite/plugins/build-pwa-assets'
import { BuildRegisterSWPlugin } from '@unplugin-pwa/vite/plugins/build-register-sw'
import { DevPlugin } from '@unplugin-pwa/vite/plugins/dev'
import { DevMiddlewarePlugin } from '@unplugin-pwa/vite/plugins/dev-middleware'
import { DevAssetsMiddlewarePlugin } from '@unplugin-pwa/vite/plugins/dev-pwa-assets-middleware'
import { DevtoolsPlugin } from '@unplugin-pwa/vite/plugins/devtools'
import { InfoPlugin } from '@unplugin-pwa/vite/plugins/info'
import { InspectorPlugin } from '@unplugin-pwa/vite/plugins/inspector'
import { MainPlugin } from '@unplugin-pwa/vite/plugins/main'
import { AssetsPlugin } from '@unplugin-pwa/vite/plugins/pwa-assets'
import { VirtualModulesPlugin } from '@unplugin-pwa/vite/plugins/virtual-modules'
import { SvelteKitAdapterWrapper } from './adapter.ts'
import { createSvelteKitPWAContext } from './context.ts'
import { SvelteKitBuildPlugin } from './plugins/build.ts'

export function withPwa<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
>(
  config: Parameters<typeof sveltekit>[0] = {},
  options: Partial<SvelteKitPWAOptions<UserStrategy, T>> = {},
) {
  const ctx = createSvelteKitPWAContext<UserStrategy, T>(
    config,
    options,
    false,
  )

  return [
    sveltekit(Object.assign(
      config,
      {
        adapter: SvelteKitAdapterWrapper(ctx, config.adapter),
      },
    )),
    [
      MainPlugin(ctx),
      VirtualModulesPlugin(ctx),
      InfoPlugin(ctx),
      DevPlugin(ctx),
      DevMiddlewarePlugin(ctx),
      DevAssetsMiddlewarePlugin(ctx),
      AssetsPlugin(ctx),
      BuildPwaAssetsPlugin(ctx),
      BuildRegisterSWPlugin(ctx),
      SvelteKitBuildPlugin(ctx),
      DevtoolsPlugin(ctx),
      InspectorPlugin(ctx),
    ],
  ]
}
