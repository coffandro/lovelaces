<script lang="ts">
	import { GenderString, GetUserIcon, PronounString, SexualityString } from '$lib/user';
	import type { PageProps } from './$types';
	import Button from '$lib/components/button.svelte';
	import { enhance } from '$app/forms';
	import InputField from '$lib/components/inputField.svelte';

	let { data, form }: PageProps = $props();
</script>

<div class="flex max-h-screen flex-col gap-2 p-2">
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
		<section class="overflow-clip">
			<div class="sauto flex flex-col gap-2 rounded-lg bg-main p-2 text-white">
				<img
					src={GetUserIcon(data.user)}
					alt="{data.user.name} icon"
					class="w-full rounded-lg bg-light object-cover p-2"
				/>
				<div class="flex flex-col gap-2 rounded-lg bg-light p-2 text-lg">
					<h2 class="text-3xl font-medium">{data.user.name}</h2>
					<div class="flex justify-items-stretch gap-2">
						<div class="grow rounded bg-lighter p-1 text-center">{data.user.email}</div>
						<div class="grow rounded bg-lighter p-1 text-center">{data.user.phone}</div>
					</div>
					<div class="flex justify-items-stretch gap-2">
						<div class="grow rounded bg-lighter p-1 text-center">
							{PronounString(data.user.pronouns)}
						</div>
						<div class="grow rounded bg-lighter p-1 text-center">
							{GenderString(data.user.gender)}
						</div>
						<div class="grow rounded bg-lighter p-1 text-center">
							{SexualityString(data.user.sexuality)}
						</div>
					</div>
					<div class="flex justify-items-stretch gap-2">
						<div class="grow rounded bg-lighter p-1 text-center">
							{data.user.age} years old
						</div>
						<div class="grow rounded bg-lighter p-1 text-center">
							Lives in {data.user.city}
						</div>
					</div>
				</div>
				<div class="rounded-lg bg-light p-2 text-lg">
					{data.user.bio}
				</div>
			</div>
		</section>

		<footer class="flex h-full pb-2">
			<Button classes="grow min-h-20" text="Search for match" href="" />
		</footer>
	{/if}
</div>
