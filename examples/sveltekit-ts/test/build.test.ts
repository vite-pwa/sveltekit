import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { generateSW } from '../pwa.mjs'
import { nodeAdapter } from '../adapter.mjs'

describe(`test-build: ${nodeAdapter ? 'node' : 'static'} adapter`, () => {
    it(`service worker is generated: ${generateSW ? 'sw.js' : 'prompt-sw.js'}`, () => {
        const swName = `./build/${nodeAdapter ? 'client/': ''}${generateSW ? 'sw.js' : 'prompt-sw.js'}`
        expect(existsSync(swName), `${swName} doesn't exist`).toBeTruthy()
        const webManifest = `./build/${nodeAdapter ? 'client/': ''}manifest.webmanifest`
        expect(existsSync(webManifest), `${webManifest} doesn't exist`).toBeTruthy()
        const swContent = readFileSync(swName, 'utf-8')
        let match: RegExpMatchArray | null
        if (generateSW) {
            match = swContent.match(/define\(\['\.\/(workbox-\w+)'/)
            expect(match && match.length === 2, `workbox-***.js entry not found in ${swName}`).toBeTruthy()
            const workboxName = `./build/${nodeAdapter ? 'client/': ''}${match?.[1]}.js`
            expect(existsSync(workboxName),`${workboxName} doesn't exist`).toBeTruthy()
        }
        match = swContent.match(/"url":\s*"manifest\.webmanifest"/)
        expect(match && match.length === 1, 'missing manifest.webmanifest in sw precache manifest').toBeTruthy()
        match = swContent.match(/"url":\s*"\/"/)
        expect(match && match.length === 1, 'missing entry point route (/) in sw precache manifest').toBeTruthy()
        match = swContent.match(/"url":\s*"about"/)
        expect(match && match.length === 1,'missing about route (/about) in sw precache manifest').toBeTruthy()
        if (nodeAdapter) {
            match = swContent.match(/"url":\s*"server\//)
            expect(match === null, 'found server/ entries in sw precache manifest').toBeTruthy()
        }
    })
})
