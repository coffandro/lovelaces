<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/components/button.svelte';
	import { enhance } from '$app/forms';
	import InputField from '$lib/components/inputField.svelte';
	import { faCog, faInfo } from '@fortawesome/free-solid-svg-icons';
	import UserProfile from '$lib/components/userProfile.svelte';

	let { data, form }: PageProps = $props();
</script>

<div class="flex max-h-screen grow flex-col gap-2 p-2">
	<header class="flex">
		<nav class="flex w-full justify-between rounded-lg bg-main p-2 text-white">
			<div class="grow">
				<h1 class="text-2xl font-bold">10-minute love</h1>
			</div>
			{#if data?.user}
				<div class="flex grow justify-end gap-2">
					<Button classes="aspect-square" icon={faCog} href={`/user/edit`} />
					<Button classes="aspect-square" icon={faInfo} href={`/info`} />
				</div>
			{/if}
		</nav>
	</header>

	{#if !data.user}
		<section class="flex grow flex-col">
			<form use:enhance method="POST" class="flex grow flex-col content-stretch gap-1">
				<div class="flex flex-col gap-2 rounded-lg bg-main p-2">
					<h1 class="text-xl text-white">Please log in</h1>

					<InputField text="Email" id="email" type="email" />
					<InputField text="Password" id="password" type="password" />

					{#if form?.error}
						<div class="text-white/50">
							<p>{form.message}</p>
						</div>
					{/if}
				</div>

				<div class="rounded-lg bg-main p-2">
					<p class="text-white">Don't have an account?</p>
					<Button classes="h-15 grow" text="Go to signup" href="/user/create" />
				</div>

				<div class="grow"></div>

				<footer class="flex justify-stretch gap-2 rounded-lg bg-main p-2">
					<Button type="submit" classes="h-15 grow" text="Login" />
				</footer>
			</form>
		</section>
	{:else}
		<section>
			<UserProfile user={data.user} />
		</section>

		<footer class="pb-2">
			<div class="flex h-full rounded-lg bg-main p-2">
				<Button scale={3} classes="grow min-h-20" text="Search for match" href="/search" />
			</div>
		</footer>
	{/if}
</div>
