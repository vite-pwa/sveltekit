import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'

const cwd = fileURLToPath(new URL('.', import.meta.url))

export async function cleanupDistFiles(patterns: string | string[]) {
  const [fs, path] = await Promise.all([
    import('node:fs/promises'),
    import('node:path'),
  ])
  const dir = fs.glob(patterns, {
    withFileTypes: true,
    cwd: path.resolve(cwd, 'dist'),
  })

  for await (const file of dir) {
    await fs.rm(path.resolve(file.parentPath, file.name), { force: true })
  }
}

export async function cleanupJSTypes() {
  await cleanupDistFiles(['**/types.{js,mjs}'])
}

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/config.ts',
    'src/legacy.ts',
    'src/types.ts',
  ],
  platform: 'node',
  dts: true,
  attw: {
    level: 'error',
    profile: 'esm-only',
  },
  publint: true,
  deps: {
    neverBundle: [
      '@sveltejs/kit',
      'vite',
      'rolldown',
      'magicast',
      '@composable-vite-pwa/unplugin-pwa',
      '@composable-vite-pwa/workbox-window',
      '@composable-vite-pwa/workbox-build',
    ],
  },
  hooks: {
    'build:done': async () => {
      await cleanupJSTypes()
    },
  },
})
