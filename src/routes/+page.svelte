<script lang="ts">
	import { GetUserIcon } from '$lib/user';
	import type { PageProps } from './$types';
	import Button from '$lib/components/button.svelte';
	import { enhance } from '$app/forms';
	import InputField from '$lib/components/inputField.svelte';

	let { data, form }: PageProps = $props();
</script>

<div class="flex max-h-screen flex-col p-2">
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
			<h2 class="mb-2 text-lg font-medium">Users</h2>
			<div class="rounded-lg border-2 p-2">
				<img
					src={GetUserIcon(data.user)}
					alt="{data.user.name} icon"
					class="w-full rounded object-cover"
				/>
				<div class="mt-1 truncate font-medium">{data.user.name}</div>
				<div class="truncate text-xs text-gray-500">{data.user.email}</div>
			</div>
		</section>

		<footer></footer>
	{/if}
</div>
