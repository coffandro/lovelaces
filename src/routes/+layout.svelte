<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { navbarItems } from '$lib/stores';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex grow flex-col gap-2 p-2">
	<header class="flex">
		<nav class="flex w-full justify-between rounded-lg bg-main p-2 text-white">
			<div class="grow">
				<h1 class="text-2xl font-bold">10-minute love</h1>
			</div>
			{#if $navbarItems}
				<svelte:component this={$navbarItems.component} {...$navbarItems.props} />
			{/if}
		</nav>
	</header>

	{@render children()}
</div>
