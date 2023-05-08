import {test, expect} from '@playwright/test';
import {generateSW} from "../pwa.mjs";

test('The service worker registers and precaches', async ({ page}) => {
    await page.goto('/');

    const swURL = await page.evaluate(async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const registration = await navigator.serviceWorker.ready;
        return registration.active?.scriptURL;
    });
    const swName = generateSW ? 'sw.js' : 'prompt-sw.js'
    expect(swURL).toBe(`http://localhost:4173/${swName}`);

    const cacheContents = await page.evaluate(async () => {
        const cacheState: Record<string, Array<string>> = {};
        for (const cacheName of await caches.keys()) {
            const cache = await caches.open(cacheName);
            cacheState[cacheName] = (await cache.keys()).map((req) => req.url);
        }
        return cacheState;
    });

    expect(Object.keys(cacheContents).length).toEqual(1)

    const key = 'workbox-precache-v2-http://localhost:4173/'

    expect(Object.keys(cacheContents)[0]).toEqual(key)

    const urls = cacheContents[key].map(url => url.slice('http://localhost:4173/'.length))

    expect(urls.some(url => url.startsWith('manifest.webmanifest?__WB_REVISION__='))).toEqual(true)
    expect(urls.some(url => url.startsWith('?__WB_REVISION__='))).toEqual(true)
    expect(urls.some(url => url.startsWith('about?__WB_REVISION__='))).toEqual(true)
});
