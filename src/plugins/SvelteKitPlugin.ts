import type { Plugin, ResolvedConfig } from 'vite'
import type { VitePluginPWAAPI, VitePWAOptions } from 'vite-plugin-pwa'
import { lstat, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { glob } from 'tinyglobby'

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
    async generateBundle(_, bundle) {
      // generate only for client
      if (viteConfig.build.ssr)
        return

      const api = apiResolver()
      if (!api)
        return

      const assetsGenerator = await api.pwaAssetsGenerator()
      if (assetsGenerator)
        assetsGenerator.injectManifestIcons()

      api.generateBundle(bundle)
    },
    writeBundle: {
      sequential: true,
      enforce: 'pre',
      async handler() {
        const api = apiResolver()
        if (!api || viteConfig.build.ssr)
          return

        const assetsGenerator = await api.pwaAssetsGenerator()
        if (assetsGenerator)
          await assetsGenerator.generate()
      },
    },
    closeBundle: {
      sequential: true,
      enforce: 'pre',
      async handler() {
        const api = apiResolver()

        if (api && !api.disabled && viteConfig.build.ssr) {
          const webManifest = options.manifestFilename ?? 'manifest.webmanifest'
          let swName = options.filename ?? 'sw.js'
          const outDir = options.outDir ?? `${viteConfig.root}/.svelte-kit/output`
          const clientOutputDir = join(outDir, 'client')
          await mkdir(clientOutputDir, { recursive: true })
          if (!options.strategies || options.strategies === 'generateSW' || options.selfDestroying) {
            let path: string
            let existsFile: boolean

            // remove kit sw: we'll regenerate the sw
            if (options.selfDestroying && options.strategies === 'injectManifest') {
              if (swName.endsWith('.ts'))
                swName = swName.replace(/\.ts$/, '.js')

              path = join(clientOutputDir, 'service-worker.js').replace('\\/g', '/')
              existsFile = await isFile(path)
              if (existsFile)
                await rm(path)
            }

            // regenerate sw before adapter runs: we need to include generated html pages
            await api.generateSW()

            const serverOutputDir = join(outDir, 'server')
            path = join(serverOutputDir, swName).replace(/\\/g, '/')
            existsFile = await isFile(path)
            if (existsFile) {
              const sw = await readFile(path, 'utf-8')
              await writeFile(
                join(clientOutputDir, swName).replace('\\/g', '/'),
                sw,
                'utf-8',
              )
              await rm(path)
            }
            // move also workbox-*.js when using generateSW
            const result = await glob({
              patterns: ['workbox-*.js'],
              cwd: serverOutputDir,
              onlyFiles: true,
              expandDirectories: false,
            })
            if (result && result.length > 0) {
              path = join(serverOutputDir, result[0]).replace(/\\/g, '/')
              await writeFile(
                join(clientOutputDir, result[0]).replace('\\/g', '/'),
                await readFile(path, 'utf-8'),
                'utf-8',
              )
              await rm(path)
            }
            // remove also web manifest in server folder
            path = join(serverOutputDir, webManifest).replace(/\\/g, '/')
            existsFile = await isFile(path)
            if (existsFile)
              await rm(path)

            return
          }

          if (swName.endsWith('.ts'))
            swName = swName.replace(/\.ts$/, '.js')

          const injectionPoint = !options.injectManifest || !('injectionPoint' in options.injectManifest) || !!options.injectManifest.injectionPoint

          if (injectionPoint) {
            // kit fixes sw name to 'service-worker.js'
            const injectManifestOptions: import('workbox-build').InjectManifestOptions = {
              globDirectory: outDir.replace(/\\/g, '/'),
              ...options.injectManifest ?? {},
              swSrc: join(clientOutputDir, 'service-worker.js').replace(/\\/g, '/'),
              swDest: join(clientOutputDir, 'service-worker.js').replace(/\\/g, '/'),
            }

            const [injectManifest, logWorkboxResult] = await Promise.all([
              import('workbox-build').then(m => m.injectManifest),
              import('./log').then(m => m.logWorkboxResult),
            ])

            // inject the manifest
            const buildResult = await injectManifest(injectManifestOptions)
            // log workbox result
            logWorkboxResult('injectManifest', viteConfig, buildResult)
            // rename the sw
            if (swName !== 'service-worker.js') {
              await rename(
                join(clientOutputDir, 'service-worker.js').replace('\\/g', '/'),
                join(clientOutputDir, swName).replace('\\/g', '/'),
              )
            }
          }
          else {
            const { logWorkboxResult } = await import('./log')
            // log workbox result
            logWorkboxResult('injectManifest', viteConfig)
            if (swName !== 'service-worker.js') {
              await rename(
                join(clientOutputDir, 'service-worker.js').replace('\\/g', '/'),
                join(clientOutputDir, swName).replace('\\/g', '/'),
              )
            }
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
