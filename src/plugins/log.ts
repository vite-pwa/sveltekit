/* eslint-disable no-console */
import type { ResolvedConfig } from 'vite'
import type { BuildResult } from 'workbox-build'
import { relative } from 'node:path'
import { cyan, dim, green, magenta, yellow } from 'kolorist'
import { version } from '../../package.json'

export function logWorkboxResult(strategy: string, viteOptions: ResolvedConfig, buildResult?: BuildResult) {
  const { root, logLevel = 'info' } = viteOptions

  if (logLevel === 'silent')
    return

  if (!buildResult) {
    console.info([
      '',
      `${cyan(`SvelteKit VitePWA v${version}`)}`,
      `mode      ${magenta(strategy)}`,
    ].join('\n'))
    return
  }

  const { count, size, filePaths, warnings } = buildResult

  if (logLevel === 'info') {
    console.info([
      '',
      `${cyan(`SvelteKit VitePWA v${version}`)}`,
      `mode      ${magenta(strategy)}`,
      `precache  ${green(`${count} entries`)} ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}`,
      'files generated',
      ...filePaths.map(p => `  ${dim(relative(root, p))}`),
    ].join('\n'))
  }

  // log build warning
  warnings && warnings.length > 0 && console.warn(yellow([
    'warnings',
    ...warnings.map(w => `  ${w}`),
    '',
  ].join('\n')))
}
