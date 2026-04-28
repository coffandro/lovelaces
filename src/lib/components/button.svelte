<script lang="ts">
	import { FontAwesomeIcon } from 'fontawesome-svelte';

	let {
		text = '',
		id = '',
		href = '',
		type = null,
		callback = null,
		icon = null,
		scale = 2,
		children = null,
		disabled = false,
		classes = ''
	} = $props();

	const styles = $derived(
		`flex justify-center items-center  rounded-lg border-light text-white p-2  ${disabled ? 'bg-light' : 'btn cursor-pointer bg-main hover:translate-y-0.2 active:translate-y-0.4 active:bg-dark'}`
	);
	const scaleStyle = $derived(`--scale: ${scale}`);
</script>

{#if !children}
	{#if href != ''}
		<a
			class="{classes} {styles}"
			{id}
			href={disabled ? 'javascript:void(0)' : href}
			style={scaleStyle}
		>
			<FontAwesomeIcon {icon} size="lg" />
			{#if text}
				{text}
			{/if}
		</a>
	{:else}
		<button
			{disabled}
			{id}
			{type}
			class="{classes} {styles}"
			style={scaleStyle}
			onclick={(e) => {
				if (callback) {
					callback(e);
				}
			}}
		>
			<FontAwesomeIcon {icon} size="lg" />
			{#if text}
				{text}
			{/if}
		</button>
	{/if}
{:else}
	<div class="{classes} {styles}" {id} style={scaleStyle}>
		{@render children()}
	</div>
{/if}

<style>
	.btn {
		border-style: solid;
		border-width: calc(var(--scale) * 1px);
		border-bottom-width: calc(var(--scale) * 2px);
		font-size: calc(var(--scale) * 0.5rem);
	}
	.btn:hover {
		border-bottom-width: calc(var(--scale) * 1.5px);
	}
	.btn:active {
		border-bottom-width: calc(var(--scale) * 1px);
	}
</style>
