<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import type { PageProps } from './$types';
	import { remainingTime, type Message } from '$lib/conversation';
	import Button from '$lib/components/button.svelte';
	import InputField from '$lib/components/inputField.svelte';
	import { browser } from '$app/environment';
	import Navbar from '$lib/components/navbar/navbar.svelte';
	import { faUser } from '@fortawesome/free-solid-svg-icons';
	import UserProfile from '$lib/components/userProfile.svelte';

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

	async function endConversation() {
		if (!confirm('Are you sure you want to end the conversation?')) {
			return;
		}

		try {
			const response = await fetch(`/convo/${data.convo.id}/end`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result = await response.json();

			if (response.ok) {
				// Redirect to home page after successful deletion
				window.location.href = '/';
			} else {
				alert(`Error: ${result.message}`);
			}
		} catch (error) {
			console.error('Failed to delete account:', error);
			alert('Failed to delete account. Please try again.');
		}
	}

	let showingProfile = $state(false);
	function switchProfile() {
		showingProfile = !showingProfile;
	}

	if (browser) {
		window.onbeforeunload = () => {
			return 'Are you sure you want to leave this conversation?';
		};
	}
</script>

<div class="flex max-h-screen grow flex-col gap-2 text-white">
	<Navbar>
		<div class="flex gap-2">
			<Button icon={faUser} callback={switchProfile} />
			<Button text="End" callback={endConversation} />
		</div>
	</Navbar>

	{#if showingProfile && other}
		<UserProfile user={other} />
	{:else}
		<header class="mb-3 flex items-center justify-between rounded-lg bg-main p-2">
			<div>
				<h1 class="text-xl font-semibold">
					Chatting with {other?.name ?? '?'}
				</h1>
			</div>

			<div class="text-center font-mono text-lg text-white tabular-nums" title="Time remaining">
				{remaining <= 0 ? 'ended' : formatRemaining(remaining)}
			</div>
		</header>

		<div class="flex grow flex-col gap-2 overflow-y-scroll">
			{#each messages as msg, i (i)}
				{@const mine = me && msg.userId === me.id}
				<div class="flex {mine ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-[75%] rounded-lg px-3 py-2 {mine
							? 'bg-dark text-white'
							: 'bg-lighter text-white'}"
					>
						<div class="mb-0.5 text-xs opacity-70">{nameFor(msg.userId)}</div>
						<div>{msg.message}</div>
					</div>
				</div>
			{/each}
			{#if messages.length === 0}
				<p class="mt-8 text-center text-xl text-gray-400">No messages yet. Say hi!</p>
			{/if}
		</div>

		<form class="flex gap-2 rounded-lg bg-main p-2" onsubmit={send}>
			<InputField
				outerClasses="grow"
				bind:content={draft}
				placeholder="Type a message..."
				autocomplete="off"
				scale={2}
			/>
			<Button type="submit" scale={2} disabled={sending || draft.trim().length === 0} text="send" />
		</form>
	{/if}
</div>
