<script lang="ts">
    import { onMount, untrack } from 'svelte';
    import { page } from '$app/state';
    import type { PageProps } from './$types';
    import type { Message } from '$lib/conversation';

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

    const me = $derived(data.asUser);
    const other = $derived(
        me && data.first && me.id === data.first.id ? data.second : data.first,
    );

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
                body: JSON.stringify({ userId: me.id, message: text }),
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

<div class="flex flex-col grow">
    <header class="border-b pb-2 mb-3">
        {#if me}
            <h1 class="text-xl font-semibold">
                Chatting with {other?.name ?? '?'}
            </h1>
        {:else}
            <div class="mt-2 flex gap-2 items-center text-sm">
                <span>View as:</span>
                <select bind:value={asPickerId} class="border rounded px-2 py-1">
                    {#if data.first}
                        <option value={data.first.id}>{data.first.name}</option>
                    {/if}
                    {#if data.second}
                        <option value={data.second.id}>{data.second.name}</option>
                    {/if}
                </select>
                <button class="border rounded px-2 py-1" onclick={switchAs}>Go</button>
            </div>
        {/if}
    </header>

    <div class="grow overflow-y-scroll flex flex-col gap-2">
        {#each messages as msg, i (i)}
            {@const mine = me && msg.userId === me.id}
            <div class="flex {mine ? 'justify-end' : 'justify-start'}">
                <div
                    class="max-w-[75%] rounded-2xl px-3 py-2 {mine
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'}"
                >
                    <div class="text-xs opacity-70 mb-0.5">{nameFor(msg.userId)}</div>
                    <div>{msg.message}</div>
                </div>
            </div>
        {/each}
        {#if messages.length === 0}
            <p class="text-center text-gray-400 text-sm mt-8">No messages yet. Say hi!</p>
        {/if}
    </div>

    {#if me}
        <form class="flex gap-2 mt-2 pt-2 border-t" onsubmit={send}>
            <input
                bind:value={draft}
                class="flex-1 border rounded-full px-4 py-2"
                placeholder="Type a message..."
                autocomplete="off"
            />
            <button
                type="submit"
                class="p-1 border rounded-xl disabled:opacity-50"
                disabled={sending || draft.trim().length === 0}
            >
                Send
            </button>
        </form>
    {:else}
        <p class="text-sm text-gray-500 mt-2 pt-2 border-t">
            Pick a user above to send messages.
        </p>
    {/if}
</div>
