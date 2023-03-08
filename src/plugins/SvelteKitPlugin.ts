import { lstat, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import type { VitePWAOptions, VitePluginPWAAPI } from 'vite-plugin-pwa'
// @ts-expect-error export = is not supported by @types/node
import fg from 'fast-glob'

export function SvelteKitPlugin(
  options: Partial<VitePWAOptions>,
  apiResolver: () => VitePluginPWAAPI | undefined,
) {
  let viteConfig: ResolvedConfig
  return <Plugin>{
    name: 'vite-plugin-pwa:sveltekit:build',
    apply: 'build',
    enforce: 'pre',
    configResolved(config) {
      viteConfig = config
    },
    generateBundle(_, bundle) {
      // generate only for client
      if (viteConfig.build.ssr)
        return

      apiResolver()?.generateBundle(bundle)
    },
    closeBundle: {
      sequential: true,
      enforce: 'pre',
      async handler() {
        const api = apiResolver()

        if (api && !api.disabled && viteConfig.build.ssr) {
          let swName = options.filename ?? 'sw.js'
          const outDir = options.outDir ?? `${viteConfig.root}/.svelte-kit/output`
          if (!options.strategies || options.strategies === 'generateSW' || options.selfDestroying) {
            // regenerate sw before adapter runs: we need to include generated html pages
            await api.generateSW()
            const serverOutputDir = join(outDir, 'server')
            let path = join(serverOutputDir, swName).replace(/\\/g, '/')
            const existsFile = await isFile(path)
            if (existsFile) {
              const sw = await readFile(path, 'utf-8')
              await writeFile(
                join(outDir, 'client', swName).replace('\\/g', '/'),
                sw,
                'utf-8',
              )
              await rm(path)
            }
            // move also workbox-*.js when using generateSW
            const result = await fg(
              ['workbox-*.js'], {
                cwd: serverOutputDir,
                onlyFiles: true,
                unique: true,
              },
            )
            if (result) {
              path = join(serverOutputDir, result[0]).replace(/\\/g, '/')
              await writeFile(
                join(outDir, 'client', result[0]).replace('\\/g', '/'),
                await readFile(path, 'utf-8'),
                'utf-8',
              )
              await rm(path)
            }
            return
          }

          if (swName.endsWith('.ts'))
            swName = swName.replace(/\.ts$/, '.js')

          // kit fixes sw name to 'service-worker.js'
          const injectManifestOptions: import('workbox-build').InjectManifestOptions = {
            globDirectory: join(outDir, 'client').replace(/\\/g, '/'),
            ...options.injectManifest ?? {},
            swSrc: join(outDir, 'client', 'service-worker.js').replace(/\\/g, '/'),
            swDest: join(outDir, 'client', 'service-worker.js').replace(/\\/g, '/'),
          }

          const [injectManifest, logWorkboxResult] = await Promise.all([
            import('workbox-build').then(m => m.injectManifest),
            import('./log').then(m => m.logWorkboxResult),
          ])

          // inject the manifest
          const buildResult = await injectManifest(injectManifestOptions)
          // log workbox result
          logWorkboxResult('injectManifest', buildResult, viteConfig)
          // rename the sw
          if (swName !== 'service-worker.js') {
            await writeFile(
              join(outDir, 'client', swName).replace('\\/g', '/'),
              await readFile(injectManifestOptions.swSrc, 'utf-8'),
              'utf-8',
            )
            await rm(injectManifestOptions.swDest)
          }
        }
      },
    },
  }
}

async function isFile(path: string) {
  try {
    const stats = await lstat(path)
    return stats.isFile()
  }
  catch {
    return false
  }
}
