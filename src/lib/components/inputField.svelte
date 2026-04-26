<script lang="ts">
	let {
		content = '',
		text,
		id,
		min = '',
		type = null,
		scale = 2,
		blurCallback = null,
		classes = '',
		...rest
	} = $props();
	const styles = $derived(
		`scaled text-white grow rounded-lg border-light bg-lighter p-1 ${classes}`
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
		{min}
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
		border-bottom-width: calc(var(--scale) * 1.5px);
		font-size: calc(var(--scale) * 0.5rem);
	}
</style>
