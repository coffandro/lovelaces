<script lang="ts">
	let {
		text,
		id,
		values,
		labels = null,
		labelFunction = null,
		content = '',
		scale = 2,
		blurCallback = null,
		classes = ''
	} = $props();
	const styles = $derived(
		`scaled text-white grow rounded-lg border-light bg-lighter p-1 ${classes}`
	);
	const scaleStyle = $derived(`--scale: ${scale}`);

	const options = $derived(
		Array.from(values).map((value, i) => ({
			value,
			label: labels != null ? labels[i] : labelFunction(value)
		}))
	);
</script>

<label class="flex" for={id}>
	<span class="flex items-center pr-1 text-white">
		{text}
	</span>
	<select
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
	>
		<option value="" selected disabled hidden>Choose your {text}</option>
		{#each options as option, i}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</label>

<style>
	.scaled {
		border-style: solid;
		border-width: calc(var(--scale) * 1px);
		border-bottom-width: calc(var(--scale) * 1.5px);
		font-size: calc(var(--scale) * 0.5rem);
	}
</style>
