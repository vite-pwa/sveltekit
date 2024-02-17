import {test, expect} from '@playwright/test';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {generateSW} from "../pwa.mjs";

test('Test offline and trailing slashes', async ({ browser}) => {
    // test offline + trailing slashes routes
    const context = await browser.newContext()
    const offlinePage = await context.newPage()
    await offlinePage.goto('/')
    const offlineSwURL = await offlinePage.evaluate(async () => {
        const registration = await Promise.race([
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigator.serviceWorker.ready,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Service worker registration failed: time out')), 10000))
        ])
        // @ts-expect-error registration is of type unknown
        return registration.active?.scriptURL
    });
    const offlineSwName = generateSW ? 'sw.js' : 'prompt-sw.js'
    expect(offlineSwURL).toBe(`http://localhost:4173/${offlineSwName}`);
    await context.setOffline(true)
    const aboutAnchor = offlinePage.getByRole('link', { name: 'About' })
    expect(await aboutAnchor.getAttribute('href')).toBe('/about')
    await aboutAnchor.click({ noWaitAfter: false })
    const url = await offlinePage.evaluate(async () => {
        await new Promise(resolve => setTimeout(resolve, 3000))
        return location.href
    })
    expect(url).toBe('http://localhost:4173/about')
    expect(offlinePage.locator('li[aria-current="page"] a').getByText('About')).toBeTruthy()
    await offlinePage.reload({ waitUntil: 'load' })
    expect(offlinePage.url()).toBe('http://localhost:4173/about')
    expect(offlinePage.locator('li[aria-current="page"] a').getByText('About')).toBeTruthy()
    // Dispose context once it's no longer needed.
    await context.close();
});
