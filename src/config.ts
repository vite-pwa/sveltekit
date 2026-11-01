import type { VitePWAStrategy } from '@unplugin-pwa/core'
import type { ExternalPWAOptions } from '@unplugin-pwa/vite/config/types'
import type { SWType } from '@vite-pwa/workbox-build/types'
import type { SvelteKitPWAOptions } from './types.ts'

export type SvelteKitExternalPWAOptions<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
> = ExternalPWAOptions<UserStrategy, T, SvelteKitPWAOptions<UserStrategy, T>>

export function definePwaConfig<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
>(
  config: Partial<SvelteKitExternalPWAOptions<UserStrategy, T>>,
): Partial<SvelteKitExternalPWAOptions<UserStrategy, T>> {
  return config
}
