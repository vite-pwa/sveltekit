import type { sveltekit } from '@sveltejs/kit/vite'
import type { VitePWAStrategy } from '@unplugin-pwa/core'
import type { VitePWAPluginContext } from '@unplugin-pwa/vite/vite-context'
import type { SWType } from '@vite-pwa/workbox-build/types'
import type { KitOptions } from './types.ts'

export interface SvelteKitPWAContext<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
> extends VitePWAPluginContext<'vite', UserStrategy, T> {
  kitConfig?: Parameters<typeof sveltekit>[0]
  kitOptions?: KitOptions
  legacyKit: boolean
}
