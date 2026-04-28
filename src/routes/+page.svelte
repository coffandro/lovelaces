<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/components/button.svelte';
	import { enhance } from '$app/forms';
	import InputField from '$lib/components/inputField.svelte';
	import UserProfile from '$lib/components/userProfile.svelte';
	import Navbar from '$lib/components/navbar/navbar.svelte';
	import IndexNavs from '$lib/components/navbar/index-navs.svelte';

	let { data, form }: PageProps = $props();
</script>

<div class="flex max-h-screen grow flex-col gap-2">
	{#if !data.user}
		<Navbar />

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
		<Navbar>
			<IndexNavs />
		</Navbar>

		<section>
			<UserProfile user={data.user} />
		</section>

		<footer>
			<div class="flex h-full rounded-lg bg-main p-2">
				<Button scale={3} classes="grow min-h-20" text="Search for match" href="/search" />
			</div>
		</footer>
	{/if}
</div>
