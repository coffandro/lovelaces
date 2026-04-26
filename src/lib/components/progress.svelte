<script lang="ts">
	let { percentage = 0, heightClass = 'h-2' } = $props();

	// Start at 5%, this means you can see it's a progress
	let _percentage = $derived(Math.min(percentage + 5, 100));
</script>

<div class="w-full bg-dark {heightClass}">
	<div class="rounded-lg bg-light {heightClass}" style="width: {_percentage}%;"></div>
</div>
