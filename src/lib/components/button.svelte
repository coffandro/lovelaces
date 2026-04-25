<script lang="ts">
	import { FontAwesomeIcon } from 'fontawesome-svelte';

	let {
		text = '',
		id = '',
		href = '',
		type = null,
		callback = null,
		icon = null,
		children = null,
		classes = ''
	} = $props();

	const styles = `cursor-pointer rounded-lg border-2 border-b-4 border-light text-white bg-main p-2 hover:translate-y-0.2 hover:border-b-3 active:translate-y-0.4 active:border-b-2 active:bg-dark ${classes}`;
</script>

{#if !children}
	{#if href != ''}
		<a class={styles} {id} {href}>
			<FontAwesomeIcon {icon} size="lg" />
			{#if text}
				{text}
			{/if}
		</a>
	{:else}
		<button
			{id}
			{type}
			class={styles}
			onclick={(e) => {
				if (callback) {
					callback(e);
				}
			}}
		>
			<FontAwesomeIcon {icon} size="lg" />
			{#if text}
				{text}
			{/if}
		</button>
	{/if}
{:else}
	<div class={styles} {id}>
		{@render children()}
	</div>
{/if}
