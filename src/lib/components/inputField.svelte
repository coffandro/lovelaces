<script lang="ts">
	let {
		content = '',
		cursor = 'text',
		text,
		id,
		min = '',
		type = null,
		scale = 2,
		blurCallback = null,
		classes = ''
	} = $props();

	let cursorClass = 'cursor-text';

	if (cursor == 'pointer') {
		cursorClass = 'cursor-pointer';
	} else if (cursor == 'text') {
		cursorClass = 'cursor-text';
	}

	const styles = $derived(
		`scaled grow rounded-lg border-light bg-lighter p-1 ${cursorClass} ${classes}`
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
		{min}
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
		border-bottom-width: calc(var(--scale) * 1.5px);
		font-size: calc(var(--scale) * 0.5rem);
	}
</style>
