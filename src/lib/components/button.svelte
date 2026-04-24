<script lang="ts">
	import { FontAwesomeIcon } from 'fontawesome-svelte';

	let {
		text = '',
		href = '',
		type = null,
		callback = null,
		icon = null,
		children = null,
		classes = ''
	} = $props();

	const styles = `cursor-pointer rounded-lg border-2 border-b-4 border-light bg-main p-2 hover:translate-y-0.2 hover:border-b-3 active:translate-y-0.4 active:border-b-2 active:bg-dark ${classes}`;
</script>

{#if !children}
	{#if href != ''}
		<a class={styles} {href}>
			<FontAwesomeIcon {icon} size="lg" />
			{text}
		</a>
	{:else}
		<button
			{type}
			class={styles}
			onclick={(e) => {
				if (callback) {
					callback(e);
				}
			}}
		>
			<FontAwesomeIcon {icon} size="lg" />
			{text}
		</button>
	{/if}
{:else}
	<div class={styles}>
		{@render children()}
	</div>
{/if}
