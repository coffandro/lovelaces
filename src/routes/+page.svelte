<script lang="ts">
	import { GetUserIcon } from '$lib/user';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

{#if data.error}
    <h1>{data.error}</h1>
{:else}
    <div class="flex gap-2 flex-wrap">
        {#each data.users as user}
            <div class="p-2 border-2 rounded-lg">
                <img src={GetUserIcon(user)} alt="User icon">
                <h1>Name: {user.name}</h1>
                <h2>Email: {user.email}</h2>
                <h2>Phone: {user.phone}</h2>
                <h2>Password: {user.password}</h2>
            </div>
        {/each}
    </div>
{/if}