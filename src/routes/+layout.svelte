<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/button.svelte';
	import { faUser } from '@fortawesome/free-solid-svg-icons';

	let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div>
	<!-- Consider moving to front page instead of layout -->
	<header class="mb-5 flex">
		<nav class="flex w-full justify-between p-2">
			<div class="grow">
				<h1 class="text-2xl font-bold">10-minute love</h1>
			</div>
			{#if data?.user}
				<div class="flex grow justify-end gap-2">
					<Button icon={faUser} href={`/user/${data.user.id}`} />
				</div>
			{/if}
		</nav>
	</header>

	{@render children()}
</div>
