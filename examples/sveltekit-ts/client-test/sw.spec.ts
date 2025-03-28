import { expect, test } from '@playwright/test'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import { generateSW } from '../pwa.mjs'

test('The service worker is registered and cache storage is present', async ({ page }) => {
  await page.goto('/')

  const swURL = await page.evaluate(async () => {
    const registration = await Promise.race([
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Service worker registration failed: time out')), 10000)),
    ])
    // @ts-expect-error registration is of type unknown
    return registration.active?.scriptURL
  })
  const swName = generateSW ? 'sw.js' : 'prompt-sw.js'
  expect(swURL).toBe(`http://localhost:4173/${swName}`)

  const cacheContents = await page.evaluate(async () => {
    const cacheState: Record<string, Array<string>> = {}
    for (const cacheName of await caches.keys()) {
      const cache = await caches.open(cacheName)
      cacheState[cacheName] = (await cache.keys()).map(req => req.url)
    }
    return cacheState
  })

  expect(Object.keys(cacheContents).length).toEqual(1)

  const key = 'workbox-precache-v2-http://localhost:4173/'

  expect(Object.keys(cacheContents)[0]).toEqual(key)

  const urls = cacheContents[key].map(url => url.slice('http://localhost:4173/'.length))

  /*
    'http://localhost:4173/about?__WB_REVISION__=38251751d310c9b683a1426c22c135a2',
    'http://localhost:4173/?__WB_REVISION__=073370aa3804305a787b01180cd6b8aa',
    'http://localhost:4173/manifest.webmanifest?__WB_REVISION__=27df2fa4f35d014b42361148a2207da3'
    */
  expect(urls.some(url => url.startsWith('manifest.webmanifest?__WB_REVISION__='))).toEqual(true)
  expect(urls.some(url => url.startsWith('?__WB_REVISION__='))).toEqual(true)
  expect(urls.some(url => url.startsWith('about?__WB_REVISION__='))).toEqual(true)
  // dontCacheBustURLsMatching: any asset in _app/immutable folder shouldn't have a revision (?__WB_REVISION__=)
  expect(urls.some(url => url.startsWith('_app/immutable/') && url.endsWith('.css'))).toEqual(true)
  expect(urls.some(url => url.startsWith('_app/immutable/') && url.endsWith('.js'))).toEqual(true)
  expect(urls.some(url => url.includes('_app/version.json?__WB_REVISION__='))).toEqual(true)
})
