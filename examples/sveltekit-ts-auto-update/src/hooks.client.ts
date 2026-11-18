import { registerSW } from 'virtual:pwa-register'

export const init: import('@sveltejs/kit/hooks').ClientInit = () => {
	registerSW({
		immediate: true,
		onRegisteredSW(swUrl, r) {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			r && setInterval(async () => {
				if (r.installing || !navigator)
					return

				if (('connection' in navigator) && !navigator.onLine)
					return

				const resp = await fetch(swUrl, {
					cache: 'no-store',
					headers: {
						'cache': 'no-store',
						'cache-control': 'no-cache',
					},
				})

				if (resp?.status === 200)
					await r.update()
			}, 20000 /* 20s for testing purposes */)
		},
		onRegisterError(error) {
			console.log('SW registration error', error)
		},
	})
}