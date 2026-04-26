<script lang="ts">
	let {
		content = '',
		cursor = 'pointer',
		text,
		id,
		type = 'file',
		scale = 2,
		blurCallback = null,
		classes = '',
		...rest
	} = $props();

	const cursorClass = $derived(cursor == 'text' ? 'cursor-text' : 'cursor-pointer');

	const styles = $derived(
		`scaled ${cursorClass} grow text-white rounded-lg border-light bg-main p-2 hover:translate-y-0.2 active:translate-y-0.4 active:bg-dark ${classes}`
	);
	const scaleStyle = $derived(`--scale: ${scale}`);
</script>

<label class="flex" for={id}>
	<span class="flex items-center pr-1 text-white">
		{text}
	</span>
	<input
		{id}
		name={id}
		{type}
		{...rest}
		class={styles}
		style={scaleStyle}
		bind:value={content}
		onblur={(e) => {
			if (blurCallback) {
				blurCallback(e, content);
			}
		}}
	/>
</label>

<style>
	.scaled {
		border-style: solid;
		border-width: calc(var(--scale) * 1px);
		border-bottom-width: calc(var(--scale) * 2px);
		font-size: calc(var(--scale) * 0.5rem);
	}
	.scaled:hover {
		border-bottom-width: calc(var(--scale) * 1.5px);
	}
	.scaled:active {
		border-bottom-width: calc(var(--scale) * 1px);
	}
</style>
