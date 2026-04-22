<script lang="ts">
    import type { PageProps } from './$types';

    let { data, form }: PageProps = $props();
</script>

<h1 class="text-xl font-semibold mb-3">Start a conversation</h1>

{#if data.users.length < 2}
    <p class="text-sm text-gray-600">
        You need at least two users.
    </p>
{:else}
    <form method="POST" class="flex flex-col gap-3">
        <label class="flex flex-col gap-1">
            <span class="text-sm">First user</span>
            <select name="firstId" class="border rounded px-2 py-1">
                {#each data.users as u}
                    <option value={u.id}>{u.name}</option>
                {/each}
            </select>
        </label>
        <label class="flex flex-col gap-1">
            <span class="text-sm">Second user</span>
            <select name="secondId" class="border rounded px-2 py-1">
                {#each data.users as u, i}
                    <option value={u.id} selected={i === 1}>{u.name}</option>
                {/each}
            </select>
        </label>
        {#if form?.error}
            <p class="text-sm text-red-600">{form.error}</p>
        {/if}
        <button class="p-1 border rounded-xl">Start chat</button>
    </form>
{/if}

<p class="mt-4 text-sm">
    <a href="/" class="text-blue-600 underline">Go back</a>
</p>