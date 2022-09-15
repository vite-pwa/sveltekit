import type { Plugin } from 'vite'
import type { VitePluginPWAAPI } from 'vite-plugin-pwa'
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

  let api: VitePluginPWAAPI | undefined
  let command: 'build' | 'serve' | undefined

  const plugins = VitePWA(userOptions)

  const virtual = 'virtual:vite-pwa/sveltekit'
  const resolvedVirtual = `\0${virtual}.js`

  plugins.push(
    {
      name: 'vite-plugin-pwa:sveltekit',
      enforce: 'pre',
      configResolved(viteConfig) {
        if (!viteConfig.build.ssr) {
          command = viteConfig.command
          api = viteConfig.plugins.find(p => p.name === 'vite-plugin-pwa')?.api
        }
      },
      resolveId(id) {
        if (id === virtual)
          return resolvedVirtual
      },
      load(id) {
        if (id === resolvedVirtual) {
          const pwaEnabled = api && !api.disabled && (command === 'build' || userOptions.devOptions?.enabled === true)
          let webManifest = ''
          if (pwaEnabled) {
            const webManifestData = api!.webManifestData()
            if (webManifestData)
              webManifest = `<link rel="manifest" href="${webManifestData.href}"${webManifestData.useCredentials ? ' crossorigin="use-credentials"' : ''} />`
          }
          // TODO: add missing logic
          return `
export const pwaEnabled = ${pwaEnabled};
export function registerDevServiceWorker() { return undefined; }
export function webManifestLink() { return '${webManifest}'; }
export function registerSWScript() { return undefined; }
            `
        }
      },

      /*
      resolveId(id) {
        if (id === '$vite-pwa/sveltekit')
          return 'vite-pwa-sveltekit-pwa-enabled.js'

        if (id === '$vite-pwa/sveltekit/webmanifest')
          return 'vite-pwa-sveltekit-webmanifest.svelte'
      },
      load(id) {
        let code: string | undefined
        if (id === 'vite-pwa-sveltekit-pwa-enabled.js') {
          code = command === 'serve'
            ? `export const pwaEnabled = ${api && !api.disabled && userOptions.devOptions?.enabled === true}`
            : `export const pwaEnabled = ${api && !api.disabled}`
        }

        if (id === 'vite-pwa-sveltekit-webmanifest.svelte') {
          const href = command === 'serve'
            ? userOptions.devOptions?.enabled === true
              ? api?.webManifestUrl
              : undefined
            : api?.webManifestUrl
          code = href
            ? `<link rel="manifest" href="${href}" />`
            : '<!---->'
          code = `{@html \`${escapeSvelte(code)}\`}`
        }

        if (code) {
          return {
            code,
            map: { version: 3, mappings: '', sources: [] } as any,
          }
        }
      },
*/
    },
  )

  // escape curlies, backtick, \\t, \\r, \\n to avoid breaking output of {@html \`here\`} in .svelte
  // function escapeSvelte(str: string): string {
  //   return str
  //     .replace(/{/g, '&#123;')
  //     .replace(/}/g, '&#125;')
  //     .replace(/\`/g, '&#96;')
  //     .replace(/\\\\([trn])/g, ' ')
  // }

  return plugins
}

export * from './types'
