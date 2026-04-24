<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import { remainingTime, type Message } from '$lib/conversation';

	let { data }: PageProps = $props();

	let messages = $state<Message[]>([]);
	$effect(() => {
		// Reset from the server snapshot whenever we navigate to a different convo
		const next = data.convo.messages;
		untrack(() => {
			messages = [...next];
		});
	});

	let draft = $state('');
	let sending = $state(false);

	let remaining = $state(0);
	$effect(() => {
		const convo = data.convo;
		untrack(() => {
			remaining = remainingTime(convo);
		});
		const tick = setInterval(() => {
			remaining = remainingTime(convo);
			if (remaining <= 0) clearInterval(tick);
		}, 1000);
		return () => clearInterval(tick);
	});

	function formatRemaining(ms: number): string {
		const total = Math.max(0, Math.floor(ms / 1000));
		const m = Math.floor(total / 60);
		const s = total % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	const me = $derived(data.asUser);
	const other = $derived(me && data.first && me.id === data.first.id ? data.second : data.first);

	function nameFor(userId: number): string {
		if (data.first && userId === data.first.id) return data.first.name;
		if (data.second && userId === data.second.id) return data.second.name;
		return `User ${userId}`;
	}

	async function send(e: Event) {
		e.preventDefault();
		const text = draft.trim();
		if (!text || !me || sending) return;

		sending = true;
		try {
			const res = await fetch(`/convo/${data.convo.id}/send`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: me.id, message: text })
			});
			if (res.ok) {
				draft = '';
			} else {
				console.error('send failed', await res.text());
			}
		} finally {
			sending = false;
		}
	}

	onMount(() => {
		const es = new EventSource(`/convo/${data.convo.id}/stream`);
		es.addEventListener('message', (e) => {
			const msg = JSON.parse(e.data) as Message;
			if (msg.userId === -1) {
				alert('This conversation has ended.');
				es.close();
				return;
			}
			messages = [...messages, msg];
		});
		es.onerror = () => {
			// Browser auto-reconnects; ignore
		};
		return () => es.close();
	});

	let asPickerId = $state<number | null>(null);
	$effect(() => {
		const defaultId = me?.id ?? data.first?.id ?? null;
		untrack(() => {
			if (asPickerId === null) asPickerId = defaultId;
		});
	});
	function switchAs() {
		if (asPickerId === null) return;
		const url = new URL(page.url);
		url.searchParams.set('as', String(asPickerId));
		window.location.href = url.toString();
	}
</script>

<div class="flex max-h-screen grow flex-col p-2">
	<header class="mb-3 grid grid-cols-3 items-center border-b pb-2">
		<div>
			{#if me}
				<h1 class="text-xl font-semibold">
					Chatting with {other?.name ?? '?'}
				</h1>
			{:else}
				<div class="flex items-center gap-2 text-sm">
					<span>View as:</span>
					<select bind:value={asPickerId} class="rounded border px-2 py-1">
						{#if data.first}
							<option value={data.first.id}>{data.first.name}</option>
						{/if}
						{#if data.second}
							<option value={data.second.id}>{data.second.name}</option>
						{/if}
					</select>
					<button class="rounded border px-2 py-1" onclick={switchAs}>Go</button>
				</div>
			{/if}
		</div>

		<div
			class="text-center font-mono text-lg tabular-nums {remaining <= 0
				? 'text-red-600'
				: remaining < 60_000
					? 'text-orange-600'
					: 'text-gray-700'}"
			title="Time remaining"
		>
			{remaining <= 0 ? 'ended' : formatRemaining(remaining)}
		</div>

		<div></div>
	</header>

	<div class="flex grow flex-col gap-2 overflow-y-scroll px-2">
		{#each messages as msg, i (i)}
			{@const mine = me && msg.userId === me.id}
			<div class="flex {mine ? 'justify-end' : 'justify-start'}">
				<div
					class="max-w-[75%] rounded-2xl px-3 py-2 {mine
						? 'bg-blue-500 text-white'
						: 'bg-gray-200 text-gray-900'}"
				>
					<div class="mb-0.5 text-xs opacity-70">{nameFor(msg.userId)}</div>
					<div>{msg.message}</div>
				</div>
			</div>
		{/each}
		{#if messages.length === 0}
			<p class="mt-8 text-center text-sm text-gray-400">No messages yet. Say hi!</p>
		{/if}
	</div>

	{#if me}
		<form class="mt-2 flex gap-2 border-t pt-2" onsubmit={send}>
			<input
				bind:value={draft}
				class="flex-1 rounded-full border px-4 py-2"
				placeholder="Type a message..."
				autocomplete="off"
			/>
			<button
				type="submit"
				class="rounded-xl border p-1 disabled:opacity-50"
				disabled={sending || draft.trim().length === 0}
			>
				Send
			</button>
		</form>
	{:else}
		<p class="mt-2 border-t pt-2 text-sm text-gray-500">Pick a user above to send messages.</p>
	{/if}
</div>
