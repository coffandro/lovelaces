<script lang="ts">
	let { content = '', text, id, scale = 2, blurCallback = null, classes = '' } = $props();

	const styles = $derived(
		`scaled text-white grow rounded-lg border-light bg-lighter p-1 ${classes}`
	);
	const scaleStyle = $derived(`--scale: ${scale}`);
</script>

<label class="flex" for={id}>
	<span class="flex items-center pr-1 text-white">
		{text}
	</span>
	<textarea
		{id}
		name={id}
		class={styles}
		style={scaleStyle}
		bind:value={content}
		onblur={(e) => {
			if (blurCallback) {
				blurCallback(e, content);
			}
		}}
	></textarea>
</label>

<style>
	.scaled {
		border-style: solid;
		border-width: calc(var(--scale) * 1px);
		border-bottom-width: calc(var(--scale) * 1.5px);
		font-size: calc(var(--scale) * 0.5rem);
	}
</style>
