import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  declaration: true,
  externals: [
    'vite',
    'rollup',
    'workbox-build',
  ],
  rollup: {
    emitCJS: false,
    dts: {
      respectExternal: true,
    },
  },
})
