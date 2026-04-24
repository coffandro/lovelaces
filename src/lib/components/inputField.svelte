<script lang="ts">
	let { content = '', text, id, type = null, blurCallback = null, classes = '' } = $props();

	const styles = `grow cursor-text rounded-lg border-2 border-b-3 border-light bg-lighter p-1 ${classes}`;
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
		bind:value={content}
		onblur={(e) => {
			if (blurCallback) {
				blurCallback(e, content);
			}
		}}
	/>
</label>
