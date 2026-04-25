<script lang="ts">
	import { GenderString, GetUserIcon, PronounString, SexualityString } from '$lib/user';
	import type { PageProps } from './$types';
	import Button from '$lib/components/button.svelte';
	import { enhance } from '$app/forms';
	import InputField from '$lib/components/inputField.svelte';
	import { faCog, faInfo } from '@fortawesome/free-solid-svg-icons';
	import UserProfile from '$lib/components/userProfile.svelte';

	let { data, form }: PageProps = $props();
</script>

<div class="flex max-h-screen flex-col gap-2 p-2">
	<header class="flex">
		<nav class="flex w-full justify-between rounded-lg bg-main p-2 text-white">
			<div class="grow">
				<h1 class="text-2xl font-bold">10-minute love</h1>
			</div>
			{#if data?.user}
				<div class="flex grow justify-end gap-2">
					<Button classes="aspect-square" icon={faCog} href={`/user/${data.user.id}/edit`} />
					<Button classes="aspect-square" icon={faInfo} href={`/user/${data.user.id}/edit`} />
				</div>
			{/if}
		</nav>
	</header>

	{#if !data.user}
		<section class="flex grow flex-col">
			<form use:enhance method="POST" class="flex grow flex-col content-stretch gap-1">
				<h1 class="text-xl">Please log in</h1>

				<InputField text="Email" id="email" type="email" />
				<InputField text="Password" id="password" type="password" />

				{#if form?.error}
					<div class="text-black/50">
						<p>{form.message}</p>
					</div>
				{/if}

				<div class="grow"></div>

				<footer class="flex">
					<Button type="submit" classes="grow" text="Submit" />
				</footer>
			</form>
		</section>
	{:else}
		<section>
			<UserProfile user={data.user} />
		</section>

		<footer class="flex h-full pb-2">
			<Button scale={3} classes="grow min-h-20" text="Search for match" href="" />
		</footer>
	{/if}
</div>
