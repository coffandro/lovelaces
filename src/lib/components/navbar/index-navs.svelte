<script>
	import { faCog, faInfo } from '@fortawesome/free-solid-svg-icons';
	import Button from '../button.svelte';
</script>

<div class="flex grow justify-end gap-2">
	<Button classes="aspect-square" icon={faCog} href={`/user/edit`} />
	<Button classes="aspect-square" icon={faInfo} href={`/info`} />
</div>
