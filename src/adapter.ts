import type { Adapter } from '@sveltejs/kit'
import type { VitePWAStrategy } from '@unplugin-pwa/core'
import type { ViteBundler, VitePWAPluginContext } from '@unplugin-pwa/vite/vite-context'
import type { SWType } from '@vite-pwa/workbox-build/types'

export function SvelteKitAdapterWrapper<
  UserStrategy extends VitePWAStrategy,
  B extends ViteBundler,
  T extends SWType,
>(
  ctx: VitePWAPluginContext<B, UserStrategy, T>,
  adapter?: Adapter,
): Adapter {
  const { adapt, ...options } = adapter ?? {}
  return Object.assign(
    options,
    {
      async adapt(builder) {
        await ctx.runBuild()
        return await adapt?.(builder)
      },
    } as Partial<Adapter>,
  ) as Adapter
}
