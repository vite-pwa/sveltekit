import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  declaration: true,
  externals: [
    'vite',
    'vite-plugin-pwa',
    'workbox-build',
    'fast-glob',
  ],
  rollup: {
    emitCJS: false,
    dts: {
      respectExternal: true,
    },
  },
})
