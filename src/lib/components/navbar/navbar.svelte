<script lang="ts">
	let { children } = $props();
</script>

<header class="flex">
	<nav class="flex w-full justify-between rounded-lg bg-main p-2 text-white">
		<div class="flex grow items-center justify-between">
			<h1 class="text-2xl font-bold">10-minute love</h1>
			{#if children}
				{@render children()}
			{/if}
		</div>
	</nav>
</header>
