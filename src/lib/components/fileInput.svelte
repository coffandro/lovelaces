<script lang="ts">
	let {
		content = '',
		cursor = 'pointer',
		text,
		id,
		type = 'file',
		blurCallback = null,
		classes = ''
	} = $props();

	let cursorClass = 'cursor-pointer';

	if (cursor == 'pointer') {
		cursorClass = 'cursor-pointer';
	} else if (cursor == 'text') {
		cursorClass = 'cursor-text';
	}

	const styles = `${cursorClass} grow rounded-lg border-2 border-b-4 border-light bg-main p-2 hover:translate-y-0.2 hover:border-b-3 active:translate-y-0.4 active:border-b-2 active:bg-dark ${classes}`;
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
