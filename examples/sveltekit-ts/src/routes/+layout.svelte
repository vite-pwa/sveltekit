<script lang='ts'>
  import Header from '$lib/header/Header.svelte'
  import { pwaInfo } from 'virtual:pwa-info'
  import '../app.css'

  interface Props {
    children?: import('svelte').Snippet
  }

  const { children }: Props = $props()

  const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '')

</script>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html webManifest}
</svelte:head>

<Header />

<main>
  {@render children?.()}
</main>

<footer>
  <p>visit <a href='https://kit.svelte.dev'>kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
