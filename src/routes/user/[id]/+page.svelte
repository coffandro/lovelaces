<script lang="ts">
	import UserProfile from '$lib/components/userProfile.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<section class="p-2">
	<UserProfile user={data.user} />
</section>
