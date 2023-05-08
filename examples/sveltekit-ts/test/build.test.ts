// import { describe, expect, it } from 'vitest'
import { stat, readFile } from 'node:fs/promises'
import { generateSW } from '../pwa.mjs'
import { nodeAdapter } from '../adapter.mjs'

describe(`test-build: ${nodeAdapter ? 'node' : 'static'} adapter`, () => {
    it(`service worker is generated: ${generateSW ? 'sw.js' : 'prompt-sw.js'}`, async () => {
        const swName = `./build/${nodeAdapter ? 'client/': ''}${generateSW ? 'sw.js' : 'prompt-sw.js'}`
        let result = await stat(swName)
        expect(result, `${swName} doesn't exists`).toBeDefined()
        expect(result.isFile(), `${swName} doesn't exists`).toBeTruthy()
        const webManifest = `./build/${nodeAdapter ? 'client/': ''}manifest.webmanifest`
        result = await stat(webManifest)
        expect(result, `${webManifest} doesn't exists`).toBeDefined()
        expect(result.isFile(), `${webManifest} doesn't exist`).toBeTruthy()
        const swContent = await readFile(swName, 'utf-8')
        let match: RegExpMatchArray | null
        if (generateSW) {
            match = swContent.match(/define\(\['\.\/(workbox-\w+)'/)
            expect(match && match.length === 2, `workbox-***.js entry not found in ${swName}`).toBeTruthy()
            const workboxName = `./build/${nodeAdapter ? 'client/': ''}${match?.[1]}.js`
            result = await stat(workboxName)
            expect(result, `${workboxName} doesn't exists`).toBeDefined()
            expect(result.isFile(),`${workboxName} doesn't exists`).toBeTruthy()
        }
        match = swContent.match(/"url":\s*"manifest\.webmanifest"/)
        expect(match && match.length === 1, 'missing manifest.webmanifest in sw precache manifest').toBeTruthy()
        match = swContent.match(/"url":\s*"\/"/)
        expect(match && match.length === 1, 'missing entry point route (/) in sw precache manifest').toBeTruthy()
        match = swContent.match(/"url":\s*"about"/)
        expect(match && match.length === 1,'missing about route (/about) in sw precache manifest').toBeTruthy()
        if (nodeAdapter) {
            match = swContent.match(/"url":\s*"server\//)
            expect(match === null, 'found server/ entry in sw precache manifest').toBeTruthy()
        }
    })
})
