<script lang="ts">
	import Button from '../button.svelte';
	import { faCog, faInfo } from '@fortawesome/free-solid-svg-icons';
	import type { User } from '$lib/user';

	interface Props {
		user?: User;
	}

	let { user }: Props = $props();
</script>

{#if user}
	<div class="flex grow justify-end gap-2">
		<Button classes="aspect-square" icon={faCog} href={`/user/edit`} />
		<Button classes="aspect-square" icon={faInfo} href={`/info`} />
	</div>
{/if}
