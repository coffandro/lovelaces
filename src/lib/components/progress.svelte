<script lang="ts">
	let { percentage = 0, heightClass = 'h-2' } = $props();
</script>

<div class="w-full bg-dark {heightClass}">
	<div class="rounded-lg bg-light {heightClass}" style="width: {percentage}%;"></div>
</div>
