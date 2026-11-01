<p align='center'>
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/vite-pwa/.github/main/sveltekit-hero-dark.svg" />
        <img src="https://raw.githubusercontent.com/vite-pwa/.github/main/sveltekit-hero.svg" alt="@vite-pwa/sveltekit - Zero-config PWA for SvelteKit">
    </picture>
</p>

<h1 align='center'>
Zero-config PWA for SvelteKit
</h1>

<p align='center'>
<a href='https://npmx.dev/package/@vite-pwa/sveltekit' target="__blank">
<img src='https://img.shields.io/npm/v/@vite-pwa/sveltekit?color=33A6B8&label=' alt="NPM version">
</a>
<a href="https://npmx.dev/package/@vite-pwa/sveltekit" target="__blank">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@vite-pwa/sveltekit?color=476582&label=">
</a>
<a href="https://unplugin-pwa.netlify.app/frameworks/sveltekit" target="__blank">
    <img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20guides&color=2e859c" alt="Docs & Guides">
</a>
<br>
<a href="https://github.com/vite-pwa/sveltekit" target="__blank">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/vite-pwa/sveltekit?style=social">
</a>
</p>

<br>

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg' alt="Anthony Fu SVG sponsors image"/>
  </a>
</p>

## 🚀 Features

- 📖 [**Documentation & guides**](https://unplugin-pwa.netlify.app/)
- 👌 **Zero-Config**: sensible built-in default configs for common use cases
- 🔩 **Extensible**: expose the full ability to customize the behavior of the plugin
- 🦾 **Type Strong**: written in [TypeScript](https://www.typescriptlang.org/)
- 🔌 **Offline Support**: generate service worker with offline support (via Workbox)
- ⚡ **Fully tree shakable**: client virtual modules are strictly optimized for Dead Code Elimination.
- 📄 **Web Manifest**: auto-inject Web App Manifest and PWA assets seamlessly.
- 💬 **Prompt for new content**: built-in support for Vanilla JavaScript, Vue 3, React, Svelte, SolidJS and Preact
- ⚙️ **Stale-while-revalidate**: automatic reload when new content is available
- ✨ **Static assets handling**: configure static assets for offline support
- 🐞 **Development Support**: debug your custom service worker logic as you develop your application
- 🔍 **Inspector**: visually inspect your resolved configuration, web manifest and service worker during development, via middleware or [DevFrame](https://github.com/devframes/devframe)
- 🧩 **Modular**: use the ready-to-use plugins or compose your own integration from the building blocks in `@unplugin-pwa/core` and `@unplugin-pwa/vite`
- 📦 **Universal Bundlers**: native integration with Vite, Rolldown, Webpack (WIP), Rspack (WIP), and Rsbuild (WIP).
- 🛠️ **Meta-Frameworks**: seamless integration with [îles](https://github.com/ElMassimo/iles), [SvelteKit](https://github.com/sveltejs/kit), [VitePress](https://github.com/vuejs/vitepress), [Astro](https://github.com/withastro/astro), [Nuxt 3/4/5](https://github.com/nuxt/nuxt), [React Router](https://github.com/remix-run/react-router/), [TanStack](https://github.com/TanStack) and [Next](https://github.com/vercel/next.js/) (WIP).
- 💥 **PWA Assets Generator**: generate all the PWA assets from a single command and a single source image
- 🚀 **PWA Assets Integration**: serving, generating and injecting PWA Assets on the fly in your application


## 📦 Install

> From v2.0.0, `@vite-pwa/sveltekit` supports SvelteKit 3 (should also support SvelteKit 1) and requires Node 22.14.0 or above.

> From v0.3.0, `@vite-pwa/sveltekit` supports SvelteKit 2 (should also support SvelteKit 1).

> From v0.2.0, `@vite-pwa/sveltekit` requires **SvelteKit 1.3.1 or above**.

```bash
npm i @vite-pwa/sveltekit -D

# yarn
yarn add @vite-pwa/sveltekit -D

# pnpm
pnpm add @vite-pwa/sveltekit -D
```

## 🦄 Usage

Add `SvelteKitPWA` plugin to `vite.config.js / vite.config.ts` and configure it.

### ⚠️ v2.0.0 Breaking Changes

- **SvelteKit 3 Support:** The SvelteKit integration has been completely revamped. SvelteKit v3 removes the internal `$service-worker` module, and `v2.0.0` aligns with this new architecture.
- **API Change:** The standalone `SvelteKitPWA()` plugin has been replaced by the `withPwa` wrapper, which now manages the `sveltekit()` plugin execution internally to correctly inject the PWA context and adapter.
- **SvelteKit >= 2.63.0:** The SvelteKit team backported the removal of the service worker configuration to version 2.63.0. If you are using `v2.63.0+` or Kit v3, you can directly use the new `withPwa` wrapper. The plugin automatically detects the Kit version to conditionally enable the new Vite Environment API in the PWA context without manual configuration.
- **SvelteKit < 2.63.0 with `buildSW`:** If you are still using an older SvelteKit v2 version and opting for the `buildSW` strategy (formerly `injectManifest`), you **must** manually remove the service worker entry from your `svelte.config.js` to avoid conflicts with Kit's legacy SW behavior.

### v2.x (SvelteKit 3 & >= 2.63.0)

In `v2.0.0`, wrap your SvelteKit configuration using `withPwa`. This function automatically includes the `sveltekit()` plugin and all necessary `@unplugin-pwa` integrations.

```ts
// vite.config.js / vite.config.ts
import { withPwa } from '@vite-pwa/sveltekit'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    withPwa(
      // SvelteKit options (formerly passed to sveltekit())
      {
        // ...
      },
      // PWA options
      {
        strategy: 'buildSW',
        // ...
      }
    )
  ]
})
```

### v1.x (Legacy SvelteKit < 2.63.0)

```ts
// vite.config.js / vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default {
  plugins: [
    sveltekit(),
    SvelteKitPWA()
  ]
}
```

Read the [📖 documentation](https://unplugin-pwa.netlify.app/frameworks/sveltekit) for a complete guide on how to configure and use
this plugin.

## 👀 Full config

Check out the type declaration [src/types.ts](https://github.com/vite-pwa/sveltekit/blob/main/src/types.ts) and the following links for more details.

- [Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Vite PWA Workbox](https://unplugin-pwa.netlify.app/vite-pwa-workbox/)

## 📄 License

[MIT](./LICENSE) License &copy; 2022-PRESENT [Anthony Fu](https://github.com/antfu)
