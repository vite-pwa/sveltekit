<svelte:head>
  <title>About</title>
  <meta name='description' content='About this app' />
</svelte:head>

<div class='content'>
  <h1>About this app</h1>

  <p>
    This is a <a href='https://kit.svelte.dev'>SvelteKit</a> app. You can make your own by typing the
    following into your command line and following the prompts:
  </p>

  <pre>npm create svelte@latest</pre>

  <p>
    The page you're looking at is purely static HTML, with no client-side interactivity needed.
    Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
    the devtools network panel and reloading.
  </p>

</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
