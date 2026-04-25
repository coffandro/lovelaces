<script lang="ts">
	let {
		content = '',
		cursor = 'pointer',
		text,
		id,
		type = 'file',
		scale = 2,
		blurCallback = null,
		classes = ''
	} = $props();

	let cursorClass = 'cursor-pointer';

	if (cursor == 'pointer') {
		cursorClass = 'cursor-pointer';
	} else if (cursor == 'text') {
		cursorClass = 'cursor-text';
	}

	const styles = $derived(
		`scaled ${cursorClass} grow rounded-lg border-light bg-main p-2 hover:translate-y-0.2 active:translate-y-0.4 active:bg-dark ${classes}`
	);
	const scaleStyle = $derived(`--scale: ${scale}`);
</script>

<label class="flex" for={id}>
	<span class="flex items-center pr-1">
		{text}
	</span>
	<input
		{id}
		name={id}
		{type}
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
