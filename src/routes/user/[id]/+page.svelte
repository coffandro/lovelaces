<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

{#if data.error}
    <h1>{data.error}</h1>
{:else}
    <h1>Name: {data.user?.name}</h1>
    <h2>Email: {data.user?.email}</h2>
    <h2>Phone: {data.user?.phone}</h2>
    <h2>Password: {data.user?.password}</h2>
{/if}