import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  declaration: true,
  externals: [
    'tinyglobby',
    'vite',
    'vite-plugin-pwa',
    'workbox-build',
  ],
  rollup: {
    emitCJS: false,
    dts: {
      respectExternal: true,
    },
  },
})
