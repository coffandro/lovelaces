<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/button.svelte';
	import type { PageProps } from './$types';
	import { FontAwesomeIcon } from 'fontawesome-svelte';
	import { faSadTear } from '@fortawesome/free-solid-svg-icons';
	import { MATCH_TIMEOUT_MS } from '$lib/matchmaking';
	import Progress from '$lib/components/progress.svelte';
	import Navbar from '$lib/components/navbar/navbar.svelte';

	let { data }: PageProps = $props();
	const TIMEOUT_S = Math.ceil(MATCH_TIMEOUT_MS / 1000);

	let status = $state<'searching' | 'timeout'>('searching');
	let secondsLeft = $state(TIMEOUT_S);
	let controller: AbortController | null = null;
	let interval: ReturnType<typeof setInterval> | null = null;

	function cleanup() {
		controller?.abort();
		controller = null;
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
	}

	async function startSearch() {
		cleanup();
		status = 'searching';
		secondsLeft = TIMEOUT_S;
		controller = new AbortController();

		interval = setInterval(() => {
			secondsLeft = Math.max(0, secondsLeft - 1);
			progress = 100 - (secondsLeft / TIMEOUT_S) * 100;
		}, 1000);

		try {
			const res = await fetch('/search/join', {
				method: 'POST',
				signal: controller.signal
			});
			if (!res.ok) {
				status = 'timeout';
				return;
			}
			const result = await res.json();
			if (typeof result.convoId === 'number') {
				if (interval) clearInterval(interval);
				interval = null;
				goto(`/convo/${result.convoId}?as=${data.user.id}`);
				return;
			}
			status = 'timeout';
		} catch (e) {
			if ((e as Error)?.name !== 'AbortError') {
				status = 'timeout';
			}
		} finally {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
		}
	}

	let progress: number = $state(0);

	onMount(() => {
		startSearch();
	});

	onDestroy(() => {
		cleanup();
	});
</script>

<div class="flex max-h-screen flex-col gap-2">
	<Navbar />

	<section
		class="row flex flex-col items-center justify-center gap-4 rounded-lg bg-main p-4 text-center text-white"
	>
		{#if status === 'searching'}
			<h2 class="text-xl font-semibold">Scouring the multiverse...</h2>
			<p>Hang tight! We're searching for your match.</p>
			<Progress percentage={progress} />
			<p class="font-mono text-2xl tabular-nums">{secondsLeft}s</p>
			<div class="pt-4">
				<Button text="Cancel" href="/" />
			</div>
		{:else}
			<FontAwesomeIcon icon={faSadTear} size="4x" />
			<h2 class="text-xl font-semibold">No one's around right now</h2>
			<p>Sorry, we couldn't find a match for you. Try again in a bit!</p>
			<div class="flex gap-2 pt-4">
				<Button text="Try again" callback={startSearch} />
				<Button text="Back" href="/" />
			</div>
		{/if}
	</section>
</div>
