<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/logo.png';
	import Button from '$lib/components/button.svelte';
	import { faCog, faInfo } from '@fortawesome/free-solid-svg-icons';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let path = $state('');

	onMount(() => {
		path = page.url.pathname;
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>10-minute love</title>
</svelte:head>

<div class="flex grow flex-col gap-2 p-2">
	{@render children()}
</div>
