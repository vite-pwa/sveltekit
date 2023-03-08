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
          // regenerate sw before adapter runs: we need to include generated html pages
          await api.generateSW()
          const outDir = options.outDir ?? `${viteConfig.root}/.svelte-kit/output`
          // move sw
          let swName = options.filename ?? 'sw.js'
          if (options.strategies === 'injectManifest' && swName.endsWith('.ts'))
            swName = swName.replace(/\.ts$/, '.js')

          const serverOutputDir = join(outDir, 'server')
          let path = join(serverOutputDir, swName).replace(/\\/g, '/')
          let existsFile = await isFile(path)
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
          if (!options.strategies || options.strategies === 'generateSW') {
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
          }

          // delete webmanifest from server build
          path = join(serverOutputDir, options.manifestFilename ?? 'manifest.webmanifest').replace(/\\/g, '/')
          existsFile = await isFile(path)
          if (existsFile)
            await rm(path)
        }
      },
    },
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
}
