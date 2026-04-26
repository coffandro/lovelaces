<script lang="ts">
	let {
		text,
		id,
		values,
		labels = null,
		labelFunction = null,
		scale = 2,
		containerClasses = ''
	} = $props();

	const containerStyles = $derived(
		`scaled rounded-lg border-2 border-light p-2 rounded-lg text-white border-main bg-light ${containerClasses}`
	);
	const scaleStyle = $derived(`--scale: ${scale}`);

	const options = $derived(
		Array.from(values).map((value, i) => ({
			value,
			label: labels != null ? labels[i] : labelFunction(value)
		}))
	);
</script>

<fieldset class={containerStyles} style={scaleStyle}>
	<legend class="rounded-lg border-t-2 border-main bg-light p-1">
		{text}
	</legend>
	{#each options as option, i}
		<div>
			<input
				class="h-4 w-4 rounded-lg"
				style={scaleStyle}
				name="{id}_{i}"
				id="{id}_{i}"
				type="checkbox"
				value={option.value}
			/>
			<label for="{id}_{i}">
				{option.label}
			</label>
		</div>
	{/each}
</fieldset>

<style>
	.scaled {
		border-style: solid;
		border-width: calc(var(--scale) * 1px);
		border-bottom-width: calc(var(--scale) * 1.5px);
		font-size: calc(var(--scale) * 0.5rem);
	}
</style>
