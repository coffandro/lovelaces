<script lang="ts">
    import { GetUserIcon } from '$lib/user';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    function nameFor(id: number): string {
        return data.users[id]?.name ?? `User ${id}`;
    }
</script>

<header class="flex items-center justify-between">
    <nav class="flex gap-2">
        <a href="/user/create" class="p-1 border rounded-xl">Add User</a>
        <a href="/convo/start" class="p-1 border rounded-xl">Start Conversation</a>
    </nav>
</header>   

<section>
    <h2 class="text-lg font-medium mb-2">Conversations</h2>
    {#if data.convos.length === 0}
        <p class="text-sm text-gray-500">No conversations yet.</p>
    {:else}
        <ul class="flex flex-col gap-2">
            {#each data.convos as convo}
                <li class="border rounded-lg p-3 flex items-center justify-between">
                    <div>
                        <div class="font-medium">
                            {nameFor(convo.firstId)} with {nameFor(convo.secondId)}
                        </div>
                        <div class="text-xs text-gray-500">
                            {convo.messages.length} message{convo.messages.length === 1 ? '' : 's'}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <a
                            href={`/convo/${convo.id}?as=${convo.firstId}`}
                            class="text-sm border rounded px-2 py-1"
                        >
                            Open as {nameFor(convo.firstId)}
                        </a>
                        <a
                            href={`/convo/${convo.id}?as=${convo.secondId}`}
                            class="text-sm border rounded px-2 py-1"
                        >
                            Open as {nameFor(convo.secondId)}
                        </a>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</section>

<section>
    <h2 class="text-lg font-medium mb-2">Users</h2>
    {#if data.users.length === 0}
        <p class="text-sm text-gray-500">No users yet.</p>
    {:else}
        <div class="flex gap-2 flex-wrap">
            {#each data.users as user}
                <div class="p-2 border-2 rounded-lg w-40">
                    <img
                        src={GetUserIcon(user)}
                        alt="{user.name} icon"
                        class="w-full h-24 object-cover rounded"
                    />
                    <div class="mt-1 font-medium truncate">{user.name}</div>
                    <div class="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
            {/each}
        </div>
    {/if}
</section>
