import '@unplugin-pwa/core/svelte'
import '@unplugin-pwa/core/info'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
  declare const __DATE__: string
  namespace App {
    interface Locals {
      userid: string
      buildDate: string
      periodicUpdates: boolean
    }

    // interface PageData {}

    // interface Platform {}
  }
}

export {}
