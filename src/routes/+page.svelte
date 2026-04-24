<script lang="ts">
	import { GetUserIcon } from '$lib/user';
	import { FontAwesomeIcon } from 'fontawesome-svelte';
	import type { PageProps } from './$types';
	import { faUser } from '@fortawesome/free-solid-svg-icons';
	import Button from '$lib/components/button.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import InputField from '$lib/components/inputField.svelte';

	let { data, form }: PageProps = $props();
</script>

<div class="flex h-screen flex-col p-2">
	<header class="mb-5 flex">
		<nav class="flex w-full justify-between">
			<div class="grow">
				<h1 class="text-2xl font-bold">10-minute love</h1>
			</div>
			{#if data.user}
				<div class="flex grow justify-end gap-2">
					<a class="flex items-center justify-items-center" href={`/user/${0}`}>
						<FontAwesomeIcon icon={faUser} size="lg" />
					</a>
					<a class="flex items-center justify-items-center" href={`/user/${0}`}>
						<FontAwesomeIcon icon={faUser} size="lg" />
					</a>
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
					<Button type="submit" classes="grow" text="Submit"></Button>
				</footer>
			</form>
		</section>
	{:else}
		<section>
			<h2 class="mb-2 text-lg font-medium">Users</h2>
			<div class="flex flex-wrap gap-2">
				<div class="w-40 rounded-lg border-2 p-2">
					<img
						src={GetUserIcon(data.user)}
						alt="{data.user.name} icon"
						class="h-24 w-full rounded object-cover"
					/>
					<div class="mt-1 truncate font-medium">{data.user.name}</div>
					<div class="truncate text-xs text-gray-500">{data.user.email}</div>
				</div>
			</div>
		</section>

		<footer></footer>
	{/if}
</div>
