<script lang="ts">
	import { GenderString, GetUserIcon, PronounString, SexualityString, type User } from '$lib/user';

	let {
		user,
		isPublic = false
	}: {
		user: User;
		isPublic: boolean;
	} = $props();
</script>

<div class="sauto flex flex-col gap-2 rounded-lg bg-main p-2 text-white">
	<img
		src={GetUserIcon(user)}
		alt="{user.name} icon"
		class="w-full rounded-lg bg-light object-cover p-2"
	/>
	<div class="flex flex-col gap-2 rounded-lg bg-light p-2 text-lg">
		<h2 class="text-3xl font-medium">{user.name}</h2>
		{#if !isPublic}
			<div class="border-3 border-dashed border-lighter p-1">
				<h2>Not shown on public profile</h2>
				<div class="flex justify-items-stretch gap-2">
					<div class="grow rounded bg-lighter p-1 text-center">{user.email}</div>
					<div class="grow rounded bg-lighter p-1 text-center">{user.phone}</div>
				</div>
			</div>
		{/if}
		<div class="flex justify-items-stretch gap-2">
			<div class="grow rounded bg-lighter p-1 text-center">
				{PronounString(user.pronouns)}
			</div>
			<div class="grow rounded bg-lighter p-1 text-center">
				{GenderString(user.gender)}
			</div>
			<div class="grow rounded bg-lighter p-1 text-center">
				{SexualityString(user.sexuality)}
			</div>
		</div>
		<div class="flex justify-items-stretch gap-2">
			<div class="grow rounded bg-lighter p-1 text-center">
				{user.age} years old
			</div>
			<div class="grow rounded bg-lighter p-1 text-center">
				Lives in {user.city}
			</div>
		</div>
	</div>
	<div class="rounded-lg bg-light p-2 text-lg">
		{user.bio}
	</div>
</div>
